// Request lock. Prefers Cloudflare Access (verifies the signed JWT Access adds to every request).
// Until Access is enabled, falls back to a passcode stored as the APP_PASSCODE secret.

export interface AuthEnv { ACCESS_TEAM_DOMAIN?: string; ACCESS_AUD?: string; APP_PASSCODE?: string }

let jwksCache: { keys: JsonWebKey[]; at: number } | null = null;

const b64urlToBytes = (s: string) => {
  const b = atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4));
  return Uint8Array.from(b, (c) => c.charCodeAt(0));
};

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
  return crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64urlToBytes(sig), new TextEncoder().encode(`${h}.${p}`));
}

async function sameString(a: string, b: string): Promise<boolean> {
  const enc = new TextEncoder();
  const [x, y] = await Promise.all([crypto.subtle.digest('SHA-256', enc.encode(a)), crypto.subtle.digest('SHA-256', enc.encode(b))]);
  const ax = new Uint8Array(x), by = new Uint8Array(y);
  let diff = 0;
  for (let i = 0; i < ax.length; i++) diff |= ax[i] ^ by[i];
  return diff === 0;
}

export type AuthResult = { ok: true } | { ok: false; status: number; reason: string };

export async function checkAuth(req: Request, env: AuthEnv): Promise<AuthResult> {
  if (env.ACCESS_TEAM_DOMAIN && env.ACCESS_AUD) {
    const token = req.headers.get('Cf-Access-Jwt-Assertion');
    if (token && (await verifyAccessJwt(token, env).catch(() => false))) return { ok: true };
    return { ok: false, status: 401, reason: 'access' };
  }
  if (env.APP_PASSCODE) {
    const given = req.headers.get('x-passcode') || '';
    if (given && (await sameString(given, env.APP_PASSCODE))) return { ok: true };
    return { ok: false, status: 401, reason: 'passcode' };
  }
  return { ok: false, status: 503, reason: 'not-configured' };
}
