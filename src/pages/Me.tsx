import { useEffect, useState } from 'preact/hooks';
import { useContent, uid, download } from '../lib/data';
import { all, get, put, remove, syncNow, syncInfo, getPasscode, setPasscode, exportAll } from '../lib/store';
import { evaluate, lightOrder, type SnapshotAnswers } from '../lib/snapshot';
import { Tabs, Num, Seg, CopyButton, toast, SENSITIVE_WARNING, looksSensitive } from '../components/ui';
import { today } from '../lib/srs';
import { lessonDone } from '../lib/review';
import { LADDER, ladderLevel } from './Today';
import { parseLesson, rawLessonById, rawPageByName, splitFrontmatter } from '../lib/content';

const TABS: [string, string][] = [['me/snapshot', 'Snapshot'], ['me/blindspots', 'Never learned'], ['me/goals', 'Goals'], ['me/notes', 'Notes'], ['me/gaps', 'Gaps'], ['me/ladder', 'Ladder'], ['me/links', 'Link health'], ['me/edit', 'Edit content'], ['me/settings', 'Settings']];

export function Me({ path }: { path: string[] }) {
  const sub = path[0] || 'snapshot';
  return (
    <div>
      <h1>Me</h1>
      <Tabs items={TABS} active={`me/${sub}`} />
      {sub === 'snapshot' && <Snapshot />}
      {sub === 'blindspots' && <Blindspots />}
      {sub === 'goals' && <GoalsLink />}
      {sub === 'notes' && <Notes />}
      {sub === 'gaps' && <Gaps />}
      {sub === 'ladder' && <Ladder />}
      {sub === 'links' && <LinkHealth />}
      {sub === 'edit' && <Editor id={path[1]} />}
      {sub === 'settings' && <Settings />}
    </div>
  );
}

function Snapshot() {
  const [a, setA] = useState<SnapshotAnswers>(get<SnapshotAnswers>('snapshot', 'current') || { targetMonths: 6 });
  const set = <K extends keyof SnapshotAnswers>(k: K, v: SnapshotAnswers[K]) => {
    const next = { ...a, [k]: v };
    setA(next);
    put('snapshot', 'current', next);
  };
  const items = evaluate(a).sort((x, y) => lightOrder[x.light] - lightOrder[y.light]);
  const history = Object.entries(all<{ on: string; reds: number; ambers: number; greens: number }>('snapshot')).filter(([k]) => k.startsWith('h:')).map(([, v]) => v).sort((x, y) => x.on.localeCompare(y.on));
  return (
    <div>
      <p class="muted">Rough numbers are fine. Nothing here needs account details. Saves as you type.</p>
      <section class="card">
        <h2>Money in and out</h2>
        <div class="formgrid">
          <Num label="Monthly take-home" suffix="₹" value={a.income} onInput={(v) => set('income', v)} />
          <Num label="Essential monthly spending" suffix="₹" value={a.essentials} onInput={(v) => set('essentials', v)} />
          <Num label="Safe, quick-access savings" suffix="₹" value={a.emergency} onInput={(v) => set('emergency', v)} />
          <Num label="Your emergency target" suffix="months" value={a.targetMonths} onInput={(v) => set('targetMonths', v)} />
          <Num label="Invested monthly for long-term goals" suffix="₹" value={a.investing} onInput={(v) => set('investing', v)} />
          <Num label="Costly debt outstanding (card balance carried, personal/app loans)" suffix="₹" value={a.highDebt} onInput={(v) => set('highDebt', v)} />
        </div>
        <Seg label="Credit card bills" value={a.cardHabit} options={[['full', 'Pay in full'], ['partial', 'Sometimes partial'], ['none', 'No card']]} onChange={(v) => set('cardHabit', v)} />
      </section>
      <section class="card">
        <h2>Protection & paperwork</h2>
        <Seg label="Health insurance" value={a.health} options={[['none', 'None'], ['employer', 'Only employer'], ['personal', 'Personal policy']]} onChange={(v) => set('health', v)} />
        <Seg label="Does anyone depend on your income?" value={a.dependents} options={[['yes', 'Yes'], ['no', 'No']]} onChange={(v) => set('dependents', v)} />
        {a.dependents === 'yes' && <Seg label="Pure term insurance?" value={a.term} options={[['yes', 'Yes'], ['no', 'No']]} onChange={(v) => set('term', v)} />}
        <Seg label="Nominees on bank, EPF, MF, insurance" value={a.nominees} options={[['all', 'All'], ['some', 'Some'], ['none', 'None / not sure']]} onChange={(v) => set('nominees', v)} />
        <Seg label="Checked EPF passbook, KYC and nominee recently?" value={a.uan} options={[['yes', 'Yes'], ['no', 'No']]} onChange={(v) => set('uan', v)} />
        <Seg label="Checked your credit report this year?" value={a.creditReport} options={[['yes', 'Yes'], ['no', 'No']]} onChange={(v) => set('creditReport', v)} />
        <Seg label="1930 saved and debit alerts on?" value={a.fraudReady} options={[['yes', 'Yes'], ['no', 'No']]} onChange={(v) => set('fraudReady', v)} />
      </section>
      <section class="card">
        <h2>Your checklist</h2>
        {items.map((x) => (
          <div class="check"><span class={`light ${x.light}`} aria-label={x.light} /><div><strong>{x.label}</strong><div class="small">{x.detail}</div>{x.fix ? <a class="small" href={'#/' + x.fix}>{x.fixLabel} →</a> : x.fixLabel && <span class="small muted">{x.fixLabel}</span>}</div></div>
        ))}
        <button class="btn quiet sm" style="margin-top:.6rem" onClick={() => {
          const c = { reds: 0, ambers: 0, greens: 0 } as any;
          items.forEach((i) => { if (i.light !== 'grey') c[i.light + 's']++; });
          put('snapshot', 'h:' + today(), { on: today(), ...c }); toast('Snapshot saved to history');
        }}>Save today's result to history</button>
        {history.length > 0 && <div class="small muted" style="margin-top:.6rem">{history.map((h) => `${h.on}: ${h.reds}🔴 ${h.ambers}🟠 ${h.greens}🟢`).join(' · ')}</div>}
      </section>
    </div>
  );
}

function Blindspots() {
  const c = useContent();
  const done = get<Record<string, boolean>>('settings', 'blindspots-done') || {};
  const toggle = (id: string) => put('settings', 'blindspots-done', { ...done, [id]: !done[id] });
  return (
    <div>
      <p class="muted">Things most salaried people in India never learn, ranked by how much not knowing them usually costs. Tick the ones you've dealt with.</p>
      {[...c.blindspots].sort((a, b) => b.cost - a.cost).map((b) => (
        <section class="card" style={done[b.id] ? 'opacity:.6' : ''}>
          <div class="row between"><strong>{b.title}</strong><span class="small" title="How costly">{'●'.repeat(b.cost)}{'○'.repeat(5 - b.cost)}</span></div>
          <p class="small">{b.why}</p>
          <div class="row">{b.lesson && <a class="small" href={`#/learn/${b.lesson}`}>Lesson →</a>}<label class="small"><input type="checkbox" checked={!!done[b.id]} onChange={() => toggle(b.id)} /> Handled</label></div>
        </section>
      ))}
    </div>
  );
}

function GoalsLink() {
  const goals = Object.values(all<any>('goals'));
  return (
    <div>
      <p class="muted">Every investment should be tied to a goal with an amount, a date and a reason.</p>
      <a class="btn" href="#/tools/goal">{goals.length ? 'Open goal planner' : 'Plan your first goal'}</a>
      {goals.map((g) => <section class="card"><strong>{g.name}</strong><div class="small muted">{g.why}</div><div class="small">{g.years} years · {g.earmarked || 'not earmarked yet'}</div></section>)}
    </div>
  );
}

interface Note { title: string; body: string; source?: string; on: string }
function Notes() {
  const notes = Object.entries(all<Note>('notes')).sort((a, b) => b[1].on.localeCompare(a[1].on));
  const [editing, setEditing] = useState<{ id: string; n: Note } | null>(null);
  const warn = editing ? looksSensitive(editing.n.title + ' ' + editing.n.body) : null;
  const crossPrompt = (n: Note) => `I'm learning personal finance in India. From ${n.source || 'something I read'}, I understood this about "${n.title}":\n\n${n.body}\n\nPlease check it against primary sources only (RBI, SEBI, AMFI, IRDAI, Income Tax Department, EPFO, PIB, official laws). For each point say correct / partly correct / wrong, explain briefly and link the official page. Flag anything that depends on rules that change, with the current figure, source and date.`;
  return (
    <div>
      <p class="muted">Your notes, and a place to write down what you learned from any book, video or article. Each note has a “cross-check” prompt to verify it against primary sources.</p>
      <button class="btn" onClick={() => setEditing({ id: uid(), n: { title: '', body: '', source: '', on: today() } })}>+ New note</button>
      {editing && (
        <section class="card">
          <label class="field"><span>Title / topic</span><input type="text" value={editing.n.title} onInput={(e) => setEditing({ ...editing, n: { ...editing.n, title: (e.target as HTMLInputElement).value } })} /></label>
          <label class="field"><span>Source (book, video, article) — optional</span><input type="text" value={editing.n.source} onInput={(e) => setEditing({ ...editing, n: { ...editing.n, source: (e.target as HTMLInputElement).value } })} /></label>
          <label class="field"><span>What I think I learned</span><textarea value={editing.n.body} onInput={(e) => setEditing({ ...editing, n: { ...editing.n, body: (e.target as HTMLTextAreaElement).value } })} /></label>
          <p class="small muted">{SENSITIVE_WARNING}</p>
          {warn && <div class="warnbox">{warn} Please remove it before saving.</div>}
          <div class="row"><button class="btn" disabled={!editing.n.title.trim() || !!warn} onClick={() => { put('notes', editing.id, editing.n); setEditing(null); }}>Save</button><button class="btn quiet" onClick={() => setEditing(null)}>Cancel</button></div>
        </section>
      )}
      {notes.map(([id, n]) => (
        <section class="card">
          <div class="row between"><strong>{n.title}</strong><span class="small muted">{n.on}</span></div>
          {n.source && <div class="small muted">From: {n.source}</div>}
          <p style="white-space:pre-wrap">{n.body}</p>
          <div class="row"><CopyButton text={crossPrompt(n)} label="Copy cross-check prompt" /><button class="btn sm quiet" onClick={() => setEditing({ id, n })}>Edit</button><button class="btn sm danger" onClick={() => confirm('Delete note?') && remove('notes', id)}>Delete</button></div>
        </section>
      ))}
      {!notes.length && !editing && <p class="empty">No notes yet.</p>}
    </div>
  );
}

interface Gap { term: string; added: string; resolved: boolean; answer?: string }
function Gaps() {
  const c = useContent();
  const gaps = Object.entries(all<Gap>('gaps')).sort((a, b) => Number(a[1].resolved) - Number(b[1].resolved) || b[1].added.localeCompare(a[1].added));
  const [term, setTerm] = useState('');
  const open = gaps.filter(([, g]) => !g.resolved);
  const batchPrompt = `I'm a beginner learning personal finance in India. For each term below, give: a plain-language explanation (3–4 sentences, Indian example), why it matters to a salaried 27-year-old, the official source to read (RBI/SEBI/IRDAI/Income Tax/EPFO etc. with link), and 3 flashcards in "Q: … / A: …" format.\n\nTerms:\n${open.map(([, g]) => '- ' + g.term).join('\n')}`;
  return (
    <div>
      <p class="muted">Every time you hear a term you don't understand, add it in one tap. Later, the app matches it with the glossary, or gives you one prompt to get explanations and flashcards for all of them.</p>
      <div class="row"><input type="text" value={term} placeholder="Term or idea" onInput={(e) => setTerm((e.target as HTMLInputElement).value)} onKeyDown={(e) => { if (e.key === 'Enter' && term.trim()) { put('gaps', uid(), { term: term.trim(), added: today(), resolved: false }); setTerm(''); } }} style="flex:1" />
        <button class="btn" onClick={() => { if (term.trim()) { put('gaps', uid(), { term: term.trim(), added: today(), resolved: false }); setTerm(''); } }}>Add</button></div>
      {open.length > 0 && <div class="row" style="margin:.8rem 0"><CopyButton text={batchPrompt} label={`Copy prompt for ${open.length} open term${open.length > 1 ? 's' : ''}`} /></div>}
      {gaps.map(([id, g]) => {
        const match = c.glossary.find((x) => x.term.toLowerCase().includes(g.term.toLowerCase()) || g.term.toLowerCase().includes(x.term.toLowerCase().split(' ')[0]));
        return (
          <section class="card" style={g.resolved ? 'opacity:.6' : ''}>
            <div class="row between"><strong>{g.term}</strong><span class="small muted">{g.added}</span></div>
            {match && <p class="small"><span class="pill info">In glossary</span> <strong>{match.term}:</strong> {match.def} {match.lesson && <a href={`#/learn/${match.lesson}`}>Lesson →</a>}</p>}
            <label class="field"><span>My explanation once I understand it</span><textarea style="min-height:4rem" value={g.answer || ''} onChange={(e) => put('gaps', id, { ...g, answer: (e.target as HTMLTextAreaElement).value })} /></label>
            <div class="row"><button class="btn sm quiet" onClick={() => put('gaps', id, { ...g, resolved: !g.resolved })}>{g.resolved ? 'Reopen' : 'Mark understood'}</button><button class="btn sm danger" onClick={() => remove('gaps', id)}>Delete</button></div>
          </section>
        );
      })}
    </div>
  );
}

function Ladder() {
  const c = useContent();
  const byModule: Record<number, string[]> = {};
  c.lessons.forEach((l) => (byModule[l.module] ||= []).push(l.id));
  const level = ladderLevel(byModule);
  return (
    <div>
      <p class="muted">Where you are. Each level unlocks by finishing its modules (more modules arrive as we build them).</p>
      {LADDER.map((s) => {
        const ids = s.modules.flatMap((m) => byModule[m] || []);
        const done = ids.filter(lessonDone).length;
        const state = s.n <= level ? 'done' : s.n === level + 1 ? 'now' : 'later';
        return (
          <section class="card" style={state === 'later' ? 'opacity:.65' : state === 'now' ? 'border-color:var(--accent)' : ''}>
            <div class="row between"><strong>Level {s.n}: {s.title}</strong><span class={`pill ${state === 'done' ? 'ok' : state === 'now' ? 'info' : ''}`}>{state === 'done' ? 'Done' : state === 'now' ? 'You are here' : 'Later'}</span></div>
            <p class="small">{s.desc}</p>
            <div class="small muted">Modules {s.modules.join(', ')} · {ids.length ? `${done}/${ids.length} lessons available done` : 'lessons coming next'}</div>
          </section>
        );
      })}
    </div>
  );
}

function LinkHealth() {
  const c = useContent();
  const [rows, setRows] = useState<any[] | null>(null);
  const [err, setErr] = useState('');
  const load = async () => {
    try {
      const h: Record<string, string> = {}; const p = getPasscode(); if (p) h['x-passcode'] = p;
      const r = await fetch('/api/links', { headers: h });
      if (!r.ok) throw new Error(r.status === 401 ? 'Locked: enter your passcode in Settings.' : `Error ${r.status}`);
      setRows(((await r.json()) as any).results); setErr('');
    } catch (e: any) { setErr(e.message || 'Could not load (offline?)'); }
  };
  useEffect(() => { void load(); }, []);
  const byId = Object.fromEntries((rows || []).map((r) => [r.id, r]));
  const lastRun = rows?.length ? new Date(Math.max(...rows.map((r) => r.checked_at))).toLocaleString('en-IN') : null;
  const bad = c.linkList.filter((l) => byId[l.id] && !byId[l.id].ok);
  return (
    <div>
      <p class="muted">Every link is re-checked automatically each Monday. Government sites sometimes block automated checks; those are marked “open it yourself”, not dead. If a page is down, the “archived copy” link opens the Web Archive's saved version.</p>
      <div class="row"><button class="btn quiet sm" onClick={async () => {
        const h: Record<string, string> = {}; const p = getPasscode(); if (p) h['x-passcode'] = p;
        toast('Checking all links… this takes about a minute');
        const r = await fetch('/api/links/check', { method: 'POST', headers: h }).catch(() => null);
        toast(r?.ok ? 'Check finished' : 'Check failed'); void load();
      }}>Run check now</button><button class="btn quiet sm" onClick={load}>Refresh</button></div>
      {err && <div class="warnbox">{err}</div>}
      {lastRun && <p class="small muted">Last check: {lastRun} · {bad.length} problem{bad.length === 1 ? '' : 's'}</p>}
      {rows && !rows.length && <p class="small muted">No check has run yet. Tap “Run check now”.</p>}
      <div class="tablewrap"><table>
        <thead><tr><th>Link</th><th>Status</th></tr></thead>
        <tbody>{[...c.linkList].sort((a, b) => Number(byId[a.id]?.ok ?? 1) - Number(byId[b.id]?.ok ?? 1)).map((l) => {
          const r = byId[l.id];
          return <tr><td><a href={l.url} target="_blank" rel="noopener">{l.title}</a><div class="small muted">{l.publisher} · added {l.verified_on} · <a href={`https://web.archive.org/web/2026/${l.url}`} target="_blank" rel="noopener">archived copy</a></div></td>
            <td>{!r ? <span class="pill">not checked</span> : r.ok ? <span class={`pill ${r.note?.includes('open it yourself') ? 'warn' : 'ok'}`}>{r.note?.includes('open it yourself') ? 'open it yourself' : 'OK'}</span> : <span class="pill bad">{r.note || 'broken'}</span>}</td></tr>;
        })}</tbody>
      </table></div>
    </div>
  );
}

function Editor({ id }: { id?: string }) {
  const c = useContent();
  if (!id) return (
    <div>
      <p class="muted">Edit any lesson or guide without touching code. Edits are saved to your account and sync across devices. Use “Download” to keep a copy of an edited file.</p>
      {c.lessons.map((l) => <a class="check" href={`#/me/edit/${l.id}`} style="text-decoration:none;color:inherit"><span>{get('overrides', l.id) ? '✏️' : '📄'}</span><div>{l.title}<div class="small muted">Module {l.module}</div></div></a>)}
      {Object.entries(c.pages).map(([k, p]) => <a class="check" href={`#/me/edit/page:${k}`} style="text-decoration:none;color:inherit"><span>{get('overrides', 'page:' + k) ? '✏️' : '📄'}</span><div>{p.title}<div class="small muted">Guide</div></div></a>)}
      <p class="small muted">Links, glossary, problems and scenarios live in the <code>content/</code> folder of the repo. Ask Claude to change those, or edit them on GitHub.</p>
    </div>
  );
  return <EditOne key={id} id={id} />;
}

function EditOne({ id }: { id: string }) {
  const c = useContent();
  const isPage = id.startsWith('page:');
  const original = isPage ? rawPageByName(id.slice(5)) : rawLessonById(id);
  const current = get<string>('overrides', id) || original || '';
  const [text, setText] = useState(current);
  const [error, setError] = useState('');
  if (!original) return <p class="empty">Not found.</p>;
  const validate = (t: string) => {
    try {
      if (isPage) { splitFrontmatter(t); return ''; }
      const l = parseLesson(t, c.links);
      if (!l.title || !l.cards.length) return 'Lesson needs a title and at least one card.';
      if (l.id !== id) return `The id must stay "${id}".`;
      return '';
    } catch (e: any) { return 'Could not read this: ' + (e.message || e).toString().slice(0, 200); }
  };
  return (
    <div>
      <a class="small" href="#/me/edit">← All content</a>
      <p class="small muted">Markdown with a YAML header between <code>---</code> lines. Blocks: <code>:::hook</code>, <code>:::task</code>, <code>:::trap</code>, <code>:::example</code>, <code>:::note</code>, <code>:::checklive link-id</code>, each closed with <code>:::</code>. Update <code>reviewed_on</code> when you check facts.</p>
      <textarea class="code" value={text} onInput={(e) => { const t = (e.target as HTMLTextAreaElement).value; setText(t); setError(validate(t)); }} />
      {error && <div class="warnbox">{error}</div>}
      <div class="row" style="margin-top:.6rem">
        <button class="btn" disabled={!!error} onClick={() => { put('overrides', id, text); toast('Saved'); }}>Save</button>
        <button class="btn quiet" onClick={() => download(`${id.replace(':', '-')}.md`, text, 'text/markdown')}>Download</button>
        {get('overrides', id) && <button class="btn danger" onClick={() => { if (confirm('Discard your edits and go back to the original?')) { remove('overrides', id); setText(original); } }}>Reset to original</button>}
        {!isPage && <a class="btn ghost" href={`#/learn/${id}`}>View</a>}
      </div>
    </div>
  );
}

function Settings() {
  const ui = get<{ theme?: string; size?: string }>('settings', 'ui') || {};
  const [pass, setPass] = useState(getPasscode());
  const [health, setHealth] = useState<any>(null);
  const { status, lastSync } = syncInfo();
  useEffect(() => { fetch('/api/health').then((r) => r.json()).then(setHealth).catch(() => setHealth(null)); }, []);
  const setUi = (k: 'theme' | 'size', v: string) => {
    put('settings', 'ui', { ...ui, [k]: v });
    if (k === 'theme') v === 'auto' ? delete document.documentElement.dataset.theme : (document.documentElement.dataset.theme = v);
    if (k === 'size') document.documentElement.dataset.size = v;
  };
  return (
    <div>
      <section class="card">
        <h2>Display</h2>
        <Seg label="Theme" value={(ui.theme as any) || 'auto'} options={[['auto', 'Match device'], ['light', 'Light'], ['dark', 'Dark']]} onChange={(v) => setUi('theme', v)} />
        <Seg label="Text size" value={(ui.size as any) || 'normal'} options={[['normal', 'Large'], ['large', 'Larger'], ['xl', 'Largest']]} onChange={(v) => setUi('size', v)} />
      </section>
      <section class="card">
        <h2>Sync</h2>
        <p class="small">Status: <strong>{status}</strong>{lastSync ? ` · last change pulled ${new Date(lastSync).toLocaleString('en-IN')}` : ''}</p>
        <p class="small muted">Lock in use: {health ? (health.lock === 'access' ? 'Cloudflare Access (no passcode needed)' : health.lock === 'passcode' ? 'Passcode' : 'Not configured') : 'unknown (offline?)'}</p>
        {health?.lock !== 'access' && (
          <>
            <label class="field"><span>Passcode (needed once per device until Cloudflare Access is on)</span><input type="password" value={pass} onInput={(e) => setPass((e.target as HTMLInputElement).value)} autoComplete="current-password" /></label>
            <button class="btn sm" onClick={() => { setPasscode(pass.trim()); toast('Saved. Syncing…'); }}>Save passcode</button>
          </>
        )}
        <div class="row" style="margin-top:.6rem"><button class="btn sm quiet" onClick={() => syncNow().then((s) => toast(s === 'idle' ? 'Synced' : `Sync: ${s}`))}>Sync now</button></div>
      </section>
      <section class="card">
        <h2>Your data</h2>
        <p class="small">{SENSITIVE_WARNING}</p>
        <button class="btn sm quiet" onClick={() => download(`paisa-sense-backup-${today()}.json`, exportAll(), 'application/json')}>Download backup (JSON)</button>
      </section>
      <section class="card">
        <h2>About</h2>
        <p class="small">An educational app, not financial advice. No stock tips, no AI inside. Rules and numbers that change are linked to official sources instead of being written here.</p>
      </section>
    </div>
  );
}
