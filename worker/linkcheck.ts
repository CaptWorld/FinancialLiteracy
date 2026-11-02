// Weekly link checker. Reads /links.json from the deployed static assets and records results in D1.

interface LinkDef { id: string; url: string }
interface Env { DB: D1Database; ASSETS: Fetcher }

const UA = 'Mozilla/5.0 (compatible; PaisaSenseLinkCheck/1.0; personal study app)';

async function checkOne(l: LinkDef): Promise<{ status: number | null; ok: boolean; note: string }> {
  try {
    const res = await fetch(l.url, { method: 'GET', redirect: 'follow', headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(20000) });
    const s = res.status;
    if (s >= 200 && s < 400) return { status: s, ok: true, note: res.redirected ? `redirected to ${res.url}` : '' };
    // Many government sites block automated checks. That is not proof the page is gone.
    if (s === 403 || s === 429 || s === 503) return { status: s, ok: true, note: 'blocked automated check; open it yourself to confirm' };
    return { status: s, ok: false, note: s === 404 ? 'page not found' : `HTTP ${s}` };
  } catch (e: any) {
    return { status: null, ok: false, note: `could not connect (${String(e?.name || e).slice(0, 60)})` };
  }
}

export async function runLinkCheck(env: Env, origin = 'https://assets.local'): Promise<number> {
  const res = await env.ASSETS.fetch(new Request(`${origin}/links.json`));
  const links = (await res.json()) as LinkDef[];
  const now = Date.now();
  const stmts: D1PreparedStatement[] = [];
  for (let i = 0; i < links.length; i += 6) {
    const batch = links.slice(i, i + 6);
    const results = await Promise.all(batch.map(checkOne));
    batch.forEach((l, j) => {
      const r = results[j];
      stmts.push(
        env.DB.prepare(
          'INSERT INTO link_health (id,url,status,ok,note,checked_at) VALUES (?1,?2,?3,?4,?5,?6) ' +
            'ON CONFLICT(id) DO UPDATE SET url=?2,status=?3,ok=?4,note=?5,checked_at=?6'
        ).bind(l.id, l.url, r.status, r.ok ? 1 : 0, r.note, now)
      );
    });
  }
  if (stmts.length) await env.DB.batch(stmts);
  return links.length;
}
