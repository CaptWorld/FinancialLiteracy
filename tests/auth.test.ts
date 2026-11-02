import { describe, expect, it } from 'vitest';
import { checkAuth, clientKey, COOKIE, makeSession, readCookie, sameString, SESSION_DAYS, verifySession } from '../worker/auth';

const PW = 'correct horse battery staple';
const req = (headers: Record<string, string> = {}) => new Request('https://x.test/', { headers });

describe('sessions', () => {
  it('accepts its own token', async () => {
    const { token, expires } = await makeSession(PW);
    expect(await verifySession(token, PW)).toBe(expires);
  });
  it('rejects a token after the password changes', async () => {
    const { token } = await makeSession(PW);
    expect(await verifySession(token, PW + '!')).toBeNull();
  });
  it('rejects tampered and expired tokens', async () => {
    const { token } = await makeSession(PW);
    const [v, exp, rnd, sig] = token.split('.');
    expect(await verifySession(`${v}.${Number(exp) + 86_400_000}.${rnd}.${sig}`, PW)).toBeNull();
    expect(await verifySession(token.slice(0, -2) + 'AA', PW)).toBeNull();
    expect(await verifySession(token, PW, Date.now() + (SESSION_DAYS + 1) * 86_400_000)).toBeNull();
    expect(await verifySession('garbage', PW)).toBeNull();
  });
});

describe('checkAuth', () => {
  it('needs a password configured, of a safe length', async () => {
    expect(await checkAuth(req(), {})).toEqual({ ok: false, reason: 'not-configured' });
    expect(await checkAuth(req(), { APP_PASSWORD: 'short' })).toEqual({ ok: false, reason: 'weak-password' });
  });
  it('asks for login without a cookie, accepts a valid one', async () => {
    expect(await checkAuth(req(), { APP_PASSWORD: PW })).toEqual({ ok: false, reason: 'login' });
    const { token } = await makeSession(PW);
    const r = await checkAuth(req({ cookie: `other=1; ${COOKIE}=${token}` }), { APP_PASSWORD: PW });
    expect(r.ok).toBe(true);
    expect(r.ok && r.renew).toBeFalsy();
  });
  it('renews a session past half its life', async () => {
    const { token } = await makeSession(PW, Date.now() - (SESSION_DAYS / 2 + 1) * 86_400_000);
    const r = await checkAuth(req({ cookie: `${COOKIE}=${token}` }), { APP_PASSWORD: PW });
    expect(r.ok && r.renew?.token).toBeTruthy();
  });
  it('still reads the old APP_PASSCODE secret name', async () => {
    const { token } = await makeSession(PW);
    expect((await checkAuth(req({ cookie: `${COOKIE}=${token}` }), { APP_PASSCODE: PW })).ok).toBe(true);
  });
});

describe('helpers', () => {
  it('compares strings', async () => {
    expect(await sameString('abc', 'abc')).toBe(true);
    expect(await sameString('abc', 'abd')).toBe(false);
  });
  it('reads cookies', () => {
    expect(readCookie(req({ cookie: 'a=1; ps_session=xyz; b=2' }), 'ps_session')).toBe('xyz');
    expect(readCookie(req(), 'ps_session')).toBe('');
  });
  it('groups IPv6 clients by /64', () => {
    expect(clientKey(req({ 'cf-connecting-ip': '203.0.113.9' }))).toBe('203.0.113.9');
    expect(clientKey(req({ 'cf-connecting-ip': '2001:db8:1:2:aaaa::1' }))).toBe('2001:db8:1:2::/64');
    expect(clientKey(req({ 'cf-connecting-ip': '2001:db8::1' }))).toBe('2001:db8:0:0::/64');
  });
});
