// Login for the whole app (lessons and personal data).
//
// Two modes:
// 1. Password login (default). The password is a Worker secret: `npx wrangler secret put APP_PASSWORD`.
//    Signing in sets a signed, HttpOnly session cookie. Wrong guesses are rate-limited per IP in D1.
//    Changing the password signs out every device (the cookie signing key is derived from it).
// 2. Cloudflare Access, if ACCESS_TEAM_DOMAIN and ACCESS_AUD are set. Access does the login; the Worker
//    only checks the signed JWT that Access adds to every request.

export interface AuthEnv {
  ACCESS_TEAM_DOMAIN?: string;
  ACCESS_AUD?: string;
  APP_PASSWORD?: string;
  /** Old name for the password secret; still read so an existing deploy keeps working. */
  APP_PASSCODE?: string;
}

export const COOKIE = 'ps_session';
export const SESSION_DAYS = 90;
export const MIN_PASSWORD_LENGTH = 12;
export const MAX_FAILS = 5;
export const WINDOW_MS = 15 * 60_000;
export const LOCK_MS = 15 * 60_000;

const enc = new TextEncoder();

export const accessMode = (env: AuthEnv) => !!(env.ACCESS_TEAM_DOMAIN && env.ACCESS_AUD);
export const configuredPassword = (env: AuthEnv) => env.APP_PASSWORD || env.APP_PASSCODE || '';

// ---------- small crypto helpers ----------
const b64url = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const b64urlToBytes = (s: string): Uint8Array<ArrayBuffer> => {
  const b = atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4));
  return Uint8Array.from(b, (c) => c.charCodeAt(0));
};

/** Constant-time string comparison (compares SHA-256 digests so lengths don't leak). */
export async function sameString(a: string, b: string): Promise<boolean> {
  const [x, y] = await Promise.all([crypto.subtle.digest('SHA-256', enc.encode(a)), crypto.subtle.digest('SHA-256', enc.encode(b))]);
  const ax = new Uint8Array(x), by = new Uint8Array(y);
  let diff = 0;
  for (let i = 0; i < ax.length; i++) diff |= ax[i] ^ by[i];
  return diff === 0;
}

const keyCache = new Map<string, Promise<CryptoKey>>();
/** HMAC key for session cookies, derived from the password. New password → old cookies stop working. */
function sessionKey(password: string): Promise<CryptoKey> {
  let k = keyCache.get(password);
  if (!k) {
    k = crypto.subtle
      .digest('SHA-256', enc.encode('paisa-sense-session-v1\0' + password))
      .then((raw) => crypto.subtle.importKey('raw', raw, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']));
    keyCache.clear(); // only ever one password in use
    keyCache.set(password, k);
  }
  return k;
}

// ---------- sessions ----------
/** Token format: v1.<expiry ms>.<random>.<HMAC of the first three parts> */
export async function makeSession(password: string, now = Date.now()): Promise<{ token: string; expires: number }> {
  const expires = now + SESSION_DAYS * 86_400_000;
  const body = `v1.${expires}.${b64url(crypto.getRandomValues(new Uint8Array(16)))}`;
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', await sessionKey(password), enc.encode(body)));
  return { token: `${body}.${b64url(sig)}`, expires };
}

/** Returns the expiry time if the token is valid, otherwise null. */
export async function verifySession(token: string, password: string, now = Date.now()): Promise<number | null> {
  const parts = token.split('.');
  if (parts.length !== 4 || parts[0] !== 'v1') return null;
  const expires = Number(parts[1]);
  if (!Number.isFinite(expires) || expires < now) return null;
  let sig: Uint8Array<ArrayBuffer>;
  try { sig = b64urlToBytes(parts[3]); } catch { return null; }
  const ok = await crypto.subtle.verify('HMAC', await sessionKey(password), sig, enc.encode(parts.slice(0, 3).join('.')));
  return ok ? expires : null;
}

export function readCookie(req: Request, name: string): string {
  const header = req.headers.get('cookie') || '';
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i > 0 && part.slice(0, i).trim() === name) return part.slice(i + 1).trim();
  }
  return '';
}

export const sessionCookie = (token: string, expires: number) =>
  `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${Math.floor((expires - Date.now()) / 1000)}`;
export const clearCookie = () => `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;

// ---------- Cloudflare Access ----------
let jwksCache: { keys: JsonWebKey[]; at: number } | null = null;

async function verifyAccessJwt(token: string, env: AuthEnv): Promise<boolean> {
  const [h, p, sig] = token.split('.');
  if (!h || !p || !sig) return false;
  const header = JSON.parse(new TextDecoder().decode(b64urlToBytes(h)));
  const payload = JSON.parse(new TextDecoder().decode(b64urlToBytes(p)));
  const team = env.ACCESS_TEAM_DOMAIN!.replace(/^https?:\/\//, '').replace(/\/$/, '');
  if (payload.iss !== `https://${team}`) return false;
  const aud = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  if (!aud.includes(env.ACCESS_AUD)) return false;
  if (typeof payload.exp !== 'number' || payload.exp * 1000 < Date.now()) return false;

  if (!jwksCache || Date.now() - jwksCache.at > 3600_000) {
    const res = await fetch(`https://${team}/cdn-cgi/access/certs`);
    jwksCache = { keys: ((await res.json()) as { keys: JsonWebKey[] }).keys, at: Date.now() };
  }
  const jwk = jwksCache.keys.find((k: any) => k.kid === header.kid);
  if (!jwk) return false;
  const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
  return crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64urlToBytes(sig), enc.encode(`${h}.${p}`));
}

// ---------- the check every protected request goes through ----------
export type AuthResult =
  | { ok: true; renew?: { token: string; expires: number } }
  | { ok: false; reason: 'login' | 'access' | 'not-configured' | 'weak-password' };

export async function checkAuth(req: Request, env: AuthEnv): Promise<AuthResult> {
  if (accessMode(env)) {
    const token = req.headers.get('Cf-Access-Jwt-Assertion');
    if (token && (await verifyAccessJwt(token, env).catch(() => false))) return { ok: true };
    return { ok: false, reason: 'access' };
  }
  const password = configuredPassword(env);
  if (!password) return { ok: false, reason: 'not-configured' };
  if (password.length < MIN_PASSWORD_LENGTH) return { ok: false, reason: 'weak-password' };
  const token = readCookie(req, COOKIE);
  const expires = token ? await verifySession(token, password) : null;
  if (!expires) return { ok: false, reason: 'login' };
  // Sliding expiry: once a session is past half its life, hand out a fresh one.
  if (expires - Date.now() < (SESSION_DAYS / 2) * 86_400_000) return { ok: true, renew: await makeSession(password) };
  return { ok: true };
}

// ---------- rate limiting of wrong passwords ----------
/** IPv6 users can rotate through a whole /64, so count those per /64. */
export function clientKey(req: Request): string {
  const ip = req.headers.get('cf-connecting-ip') || 'unknown';
  if (!ip.includes(':')) return ip;
  const full = ip.includes('::')
    ? (() => { const [a, b] = ip.split('::'); const l = a ? a.split(':') : [], r = b ? b.split(':') : []; return [...l, ...Array(8 - l.length - r.length).fill('0'), ...r]; })()
    : ip.split(':');
  return full.slice(0, 4).join(':') + '::/64';
}

interface AttemptRow { fails: number; window_start: number; locked_until: number }

/** Milliseconds until this client may try again (0 = allowed now). */
export async function lockedFor(db: D1Database, key: string, now = Date.now()): Promise<number> {
  const row = await db.prepare('SELECT locked_until FROM login_attempts WHERE ip = ?1').bind(key).first<{ locked_until: number }>();
  return row && row.locked_until > now ? row.locked_until - now : 0;
}

/** Records a wrong password. Returns ms locked out (0 if still allowed) and tries left. */
export async function recordFailure(db: D1Database, key: string, now = Date.now()): Promise<{ lockedMs: number; left: number }> {
  const row = await db.prepare('SELECT fails, window_start, locked_until FROM login_attempts WHERE ip = ?1').bind(key).first<AttemptRow>();
  const fresh = !row || now - row.window_start > WINDOW_MS;
  const fails = fresh ? 1 : row!.fails + 1;
  const windowStart = fresh ? now : row!.window_start;
  const lockedUntil = fails >= MAX_FAILS ? now + LOCK_MS : 0;
  await db
    .prepare('INSERT INTO login_attempts (ip, fails, window_start, locked_until) VALUES (?1,?2,?3,?4) ON CONFLICT(ip) DO UPDATE SET fails=?2, window_start=?3, locked_until=?4')
    .bind(key, lockedUntil ? 0 : fails, lockedUntil ? now : windowStart, lockedUntil)
    .run();
  return { lockedMs: lockedUntil ? LOCK_MS : 0, left: Math.max(0, MAX_FAILS - fails) };
}

export async function clearFailures(db: D1Database, key: string) {
  await db.prepare('DELETE FROM login_attempts WHERE ip = ?1').bind(key).run();
}
