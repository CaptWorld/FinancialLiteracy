import {
  accessMode, checkAuth, clearCookie, clearFailures, clientKey, configuredPassword, lockedFor, makeSession,
  MIN_PASSWORD_LENGTH, recordFailure, sameString, sessionCookie, type AuthEnv
} from './auth';
import { loginPage, type LoginMessage } from './loginpage';
import { runLinkCheck } from './linkcheck';

interface Env extends AuthEnv { DB: D1Database; ASSETS: Fetcher }

const COLLECTIONS = new Set(['srs', 'quiz', 'snapshot', 'goals', 'notes', 'gaps', 'overrides', 'settings', 'progress', 'explain', 'budget']);
const MAX_ITEM_BYTES = 200_000;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });

interface SyncItem { collection: string; id: string; data: unknown; updated: number; deleted?: boolean }

// Requests anyone may make without signing in: what a phone needs to show the sign-in page and install the app.
const PUBLIC_ASSETS = new Set(['/manifest.webmanifest', '/icon.svg', '/icon-192.png', '/icon-512.png', '/favicon.ico']);

const SETUP_MESSAGES: Record<string, string> = {
  'not-configured': 'No password is set yet. On your computer run: npx wrangler secret put APP_PASSWORD, then reload this page.',
  'weak-password': `The password set on the server is too short (minimum ${MIN_PASSWORD_LENGTH} characters). Set a longer one with: npx wrangler secret put APP_PASSWORD`
};

const html = (body: string, status = 200, extra: Record<string, string> = {}) =>
  new Response(body, { status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-frame-options': 'DENY', 'referrer-policy': 'same-origin', ...extra } });
const redirect = (to: string, cookie?: string) =>
  new Response(null, { status: 303, headers: { location: to, 'cache-control': 'no-store', ...(cookie ? { 'set-cookie': cookie } : {}) } });

/** Blocks form posts and API writes coming from other websites. */
const crossSite = (req: Request, url: URL) => {
  const site = req.headers.get('sec-fetch-site');
  if (site) return site !== 'same-origin' && site !== 'none';
  const origin = req.headers.get('origin');
  return !!origin && origin !== 'null' && origin !== url.origin;
};

const isPageLoad = (req: Request) =>
  req.method === 'GET' && (req.headers.get('sec-fetch-mode') === 'navigate' || (req.headers.get('accept') || '').includes('text/html'));

const minutes = (ms: number) => Math.max(1, Math.ceil(ms / 60_000));

async function handleLogin(req: Request, env: Env, url: URL): Promise<Response> {
  if (accessMode(env)) return redirect('/');
  const setup = !configuredPassword(env) ? 'not-configured' : configuredPassword(env).length < MIN_PASSWORD_LENGTH ? 'weak-password' : null;
  if (setup) return html(loginPage({ kind: 'error', text: SETUP_MESSAGES[setup] }, { disabled: true }), 503);

  if (req.method === 'GET') {
    const auth = await checkAuth(req, env);
    if (auth.ok) return redirect('/');
    const out = url.searchParams.has('out') ? ({ kind: 'info', text: 'You are signed out.' } as LoginMessage) : null;
    return html(loginPage(out));
  }
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  if (crossSite(req, url)) return new Response('Forbidden', { status: 403 });

  const key = clientKey(req);
  const wait = await lockedFor(env.DB, key);
  if (wait) return html(loginPage({ kind: 'error', text: `Too many wrong tries. Try again in ${minutes(wait)} minutes.` }, { disabled: true }), 429, { 'retry-after': String(Math.ceil(wait / 1000)) });

  let given = '';
  try { given = String((await req.formData()).get('password') || ''); } catch { /* empty or bad form */ }
  if (given && given.length <= 1000 && (await sameString(given, configuredPassword(env)))) {
    await clearFailures(env.DB, key);
    const s = await makeSession(configuredPassword(env));
    return redirect('/', sessionCookie(s.token, s.expires));
  }

  const { lockedMs, left } = await recordFailure(env.DB, key);
  await new Promise((r) => setTimeout(r, 400)); // slows down scripted guessing a little more
  if (lockedMs) return html(loginPage({ kind: 'error', text: `Too many wrong tries. Try again in ${minutes(lockedMs)} minutes.` }, { disabled: true }), 429, { 'retry-after': String(Math.ceil(lockedMs / 1000)) });
  return html(loginPage({ kind: 'error', text: `Wrong password. ${left} ${left === 1 ? 'try' : 'tries'} left before a 15-minute pause.` }), 401);
}

async function handleApi(req: Request, env: Env, url: URL): Promise<Response> {
  if (req.method !== 'GET' && crossSite(req, url)) return json({ error: 'forbidden' }, 403);

  if (url.pathname === '/api/sync' && req.method === 'GET') {
    const since = Number(url.searchParams.get('since') || 0);
    const { results } = await env.DB.prepare('SELECT collection,id,data,updated,deleted FROM items WHERE updated > ?1 ORDER BY updated LIMIT 5000')
      .bind(since)
      .all<{ collection: string; id: string; data: string; updated: number; deleted: number }>();
    return json({
      now: Date.now(),
      items: results.map((r) => ({ collection: r.collection, id: r.id, data: JSON.parse(r.data), updated: r.updated, deleted: !!r.deleted }))
    });
  }

  if (url.pathname === '/api/sync' && req.method === 'POST') {
    const body = (await req.json()) as { items?: SyncItem[] };
    const items = (body.items || []).slice(0, 1000);
    const stmts: D1PreparedStatement[] = [];
    for (const it of items) {
      if (!COLLECTIONS.has(it.collection) || typeof it.id !== 'string' || it.id.length > 200 || typeof it.updated !== 'number') continue;
      const data = JSON.stringify(it.data ?? null);
      if (data.length > MAX_ITEM_BYTES) continue;
      // Last write wins: only replace if the incoming change is newer.
      stmts.push(
        env.DB.prepare(
          'INSERT INTO items (collection,id,data,updated,deleted) VALUES (?1,?2,?3,?4,?5) ' +
            'ON CONFLICT(collection,id) DO UPDATE SET data=?3,updated=?4,deleted=?5 WHERE excluded.updated > items.updated'
        ).bind(it.collection, it.id, data, it.updated, it.deleted ? 1 : 0)
      );
    }
    if (stmts.length) await env.DB.batch(stmts);
    return json({ saved: stmts.length, now: Date.now() });
  }

  if (url.pathname === '/api/links' && req.method === 'GET') {
    const { results } = await env.DB.prepare('SELECT id,url,status,ok,note,checked_at FROM link_health ORDER BY ok, id').all();
    return json({ results });
  }

  if (url.pathname === '/api/links/check' && req.method === 'POST') {
    // Runs while the request waits: background work after a response is cut off after ~30s.
    const checked = await runLinkCheck(env, url.origin);
    return json({ checked });
  }

  return json({ error: 'not found' }, 404);
}

async function route(req: Request, env: Env): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;

  if (PUBLIC_ASSETS.has(path)) return env.ASSETS.fetch(req);
  if (path === '/api/health') return json({ ok: true, lock: accessMode(env) ? 'access' : configuredPassword(env) ? 'password' : 'none' });
  if (path === '/login') return handleLogin(req, env, url);
  if (path === '/logout' || path === '/api/logout') {
    if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });
    if (crossSite(req, url)) return new Response('Forbidden', { status: 403 });
    return path === '/logout' ? redirect('/login?out', clearCookie()) : new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json', 'set-cookie': clearCookie() } });
  }

  const auth = await checkAuth(req, env);
  if (!auth.ok) {
    if (path.startsWith('/api/')) return json({ error: auth.reason }, auth.reason === 'login' || auth.reason === 'access' ? 401 : 503);
    if (isPageLoad(req)) {
      if (auth.reason === 'login') return html(loginPage(), 401);
      if (auth.reason === 'access') return new Response('Sign in through Cloudflare Access.', { status: 401 });
      return html(loginPage({ kind: 'error', text: SETUP_MESSAGES[auth.reason] }, { disabled: true }), 503);
    }
    return new Response('Sign in first', { status: 401, headers: { 'cache-control': 'no-store' } });
  }

  const res = path.startsWith('/api/') ? await handleApi(req, env, url) : await env.ASSETS.fetch(req);
  const out = new Response(res.body, res);
  out.headers.set('cache-control', path.startsWith('/api/') ? 'no-store' : (res.headers.get('cache-control') || '').replace('public', 'private') || 'private, no-cache');
  if (auth.renew) out.headers.append('set-cookie', sessionCookie(auth.renew.token, auth.renew.expires));
  return out;
}

export default {
  async fetch(req, env) {
    try {
      return await route(req, env);
    } catch (e) {
      console.error(e);
      return json({ error: 'server error' }, 500);
    }
  },
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(runLinkCheck(env));
  }
} satisfies ExportedHandler<Env>;
