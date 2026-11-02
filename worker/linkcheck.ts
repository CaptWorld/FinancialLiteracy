// Weekly link checker. Reads /links.json from the deployed static assets and records results in D1.

interface LinkDef { id: string; url: string }
interface Env { DB: D1Database; ASSETS: Fetcher }

const UA = 'Mozilla/5.0 (compatible; PaisaSenseLinkCheck/1.0; personal study app)';

async function checkOne(l: LinkDef): Promise<{ status: number | null; ok: boolean; note: string }> {
  try {
    const res = await fetch(l.url, { method: 'GET', redirect: 'follow', headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(15000) });
    const s = res.status;
    if (s >= 200 && s < 400) return { status: s, ok: true, note: res.redirected ? `redirected to ${res.url}` : '' };
    // Many government sites block automated checks. That is not proof the page is gone.
    // Only "page gone" answers count as broken. Government sites often block or time out on automated
    // checks from data centres; that is not proof the page is gone, so flag those for a manual look.
    if (s === 404 || s === 410) return { status: s, ok: false, note: 'page not found' };
    return { status: s, ok: true, note: `blocked or erroring (HTTP ${s}); open it yourself to confirm` };
  } catch (e: any) {
    const name = String(e?.name || e);
    if (/TimeoutError|AbortError/.test(name)) return { status: null, ok: true, note: 'no answer in 15s (site slow or blocking checks); open it yourself to confirm' };
    return { status: null, ok: false, note: `could not connect (${name.slice(0, 60)})` };
  }
}

export async function runLinkCheck(env: Env, origin = 'https://assets.local'): Promise<number> {
  const res = await env.ASSETS.fetch(new Request(`${origin}/links.json`));
  const links = (await res.json()) as LinkDef[];
  const now = Date.now();
  const sql =
    'INSERT INTO link_health (id,url,status,ok,note,checked_at) VALUES (?1,?2,?3,?4,?5,?6) ' +
    'ON CONFLICT(id) DO UPDATE SET url=?2,status=?3,ok=?4,note=?5,checked_at=?6';
  // Save after each batch so a slow site never loses earlier results.
  for (let i = 0; i < links.length; i += 8) {
    const batch = links.slice(i, i + 8);
    const results = await Promise.all(batch.map(checkOne));
    await env.DB.batch(batch.map((l, j) => env.DB.prepare(sql).bind(l.id, l.url, results[j].status, results[j].ok ? 1 : 0, results[j].note, now)));
  }
  return links.length;
}
