import { checkAuth, type AuthEnv } from './auth';
import { runLinkCheck } from './linkcheck';

interface Env extends AuthEnv { DB: D1Database; ASSETS: Fetcher }

const COLLECTIONS = new Set(['srs', 'quiz', 'snapshot', 'goals', 'notes', 'gaps', 'overrides', 'settings', 'progress', 'explain', 'budget']);
const MAX_ITEM_BYTES = 200_000;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });

interface SyncItem { collection: string; id: string; data: unknown; updated: number; deleted?: boolean }

async function handleApi(req: Request, env: Env, url: URL): Promise<Response> {
  if (url.pathname === '/api/health') return json({ ok: true, lock: env.ACCESS_AUD ? 'access' : env.APP_PASSCODE ? 'passcode' : 'none' });

  const auth = await checkAuth(req, env);
  if (!auth.ok) return json({ error: auth.reason }, auth.status);

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

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname.startsWith('/api/')) {
      try {
        return await handleApi(req, env, url);
      } catch (e) {
        console.error(e);
        return json({ error: 'server error' }, 500);
      }
    }
    return env.ASSETS.fetch(req);
  },
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(runLinkCheck(env));
  }
} satisfies ExportedHandler<Env>;
