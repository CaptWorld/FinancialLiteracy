import { useMemo, useState } from 'preact/hooks';
import { marked } from 'marked';
import { useContent } from '../lib/data';
import { dueItems, forgotten, gradeItem, recordQuiz, type ReviewItem } from '../lib/review';
import { Tabs, Reveal } from '../components/ui';
import type { Grade } from '../lib/srs';

const TABS: [string, string][] = [['practice/review', 'Review'], ['practice/problems', 'Problems'], ['practice/scenarios', 'Scenarios'], ['practice/explain', 'Explain it back'], ['practice/forgotten', 'Recently forgotten']];

export function Practice({ path }: { path: string[] }) {
  const sub = path[0] || 'review';
  return (
    <div>
      <h1>Practice</h1>
      <Tabs items={TABS} active={`practice/${sub}`} />
      {sub === 'review' && <ReviewSession />}
      {sub === 'problems' && <Problems open={path[1]} />}
      {sub === 'scenarios' && <Scenarios open={path[1]} />}
      {sub === 'explain' && <ExplainList />}
      {sub === 'forgotten' && <Forgotten />}
    </div>
  );
}

function ReviewSession() {
  const c = useContent();
  // Snapshot the queue when the session starts so graded items don't reshuffle mid-session.
  const [queue] = useState<ReviewItem[]>(() => dueItems(c));
  const [i, setI] = useState(0);
  const [shown, setShown] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  const [stats, setStats] = useState({ good: 0, again: 0 });

  if (!queue.length) return (
    <div class="empty">
      <p><strong>Nothing due right now.</strong></p>
      <p>Finish a lesson to add its flashcards, or try a practice problem.</p>
      <a class="btn" href="#/learn">Go to lessons</a>
    </div>
  );
  if (i >= queue.length) return (
    <div class="card" style="text-align:center">
      <h2>Session done</h2>
      <p>{stats.good} remembered · {stats.again} to see again soon</p>
      <a class="btn" href="#/today">Back to Today</a>
    </div>
  );

  const it = queue[i];
  const lesson = c.lessons.find((l) => l.id === it.item.lesson);
  const nextItem = () => { setI(i + 1); setShown(false); setPicked(null); };
  const grade = (g: Grade) => {
    gradeItem(it.item.id, g);
    setStats((s) => ({ good: s.good + (g === 'again' ? 0 : 1), again: s.again + (g === 'again' ? 1 : 0) }));
    nextItem();
  };

  return (
    <div>
      <div class="row between small muted"><span>{i + 1} / {queue.length}</span><span>{lesson?.title}</span></div>
      <div class="progress" style="margin:.4rem 0 1rem"><span style={`width:${(i / queue.length) * 100}%`} /></div>
      {it.kind === 'card' ? (
        <section class="card flash">
          <div class="q">{it.item.q}</div>
          {shown ? (
            <>
              <div class="a">{it.item.a}</div>
              <div class="grades">
                <button class="g-again" onClick={() => grade('again')}>Again<small>forgot</small></button>
                <button class="g-hard" onClick={() => grade('hard')}>Hard<small>struggled</small></button>
                <button class="g-good" onClick={() => grade('good')}>Good<small>got it</small></button>
                <button class="g-easy" onClick={() => grade('easy')}>Easy<small>instant</small></button>
              </div>
            </>
          ) : <div style="margin-top:1.4rem"><button class="btn" onClick={() => setShown(true)}>Show answer</button><p class="small muted">Say the answer out loud first.</p></div>}
        </section>
      ) : (
        <section class="card">
          <div class="small muted">Quiz question you missed earlier</div>
          <p><strong>{it.item.q}</strong></p>
          {it.item.options.map((o, j) => (
            <button class={`opt ${picked != null && j === it.item.answer ? 'right' : ''} ${picked === j && j !== it.item.answer ? 'wrong' : ''}`} disabled={picked != null}
              onClick={() => { setPicked(j); recordQuiz(it.item, j === it.item.answer); setStats((s) => j === it.item.answer ? { ...s, good: s.good + 1 } : { ...s, again: s.again + 1 }); }}>{o}</button>
          ))}
          {picked != null && <><p class="small">{it.item.why}</p><button class="btn" onClick={nextItem}>Next</button></>}
        </section>
      )}
    </div>
  );
}

function Problems({ open }: { open?: string }) {
  const c = useContent();
  return (
    <div>
      <p class="muted">Work it out on paper first, then check the worked solution. Use the linked tool to confirm.</p>
      {c.problems.map((p) => (
        <details class="card" open={open === p.id} id={p.id}>
          <summary style="cursor:pointer"><strong>{p.title}</strong> <span class="pill">Module {p.module}</span></summary>
          <p>{p.question}</p>
          <Reveal label="Show worked solution">
            <div class="result prose" dangerouslySetInnerHTML={{ __html: marked.parse(p.solution, { async: false, breaks: true }) as string }} />
            <p><strong>Answer:</strong> {p.answer}</p>
            {p.tool && <a class="small" href={`#/tools/${p.tool}`}>Open the {p.tool} tool →</a>}
          </Reveal>
        </details>
      ))}
    </div>
  );
}

function Scenarios({ open }: { open?: string }) {
  const c = useContent();
  const [picks, setPicks] = useState<Record<string, number>>({});
  const verdictPill = { good: 'ok', ok: 'warn', bad: 'bad' } as const;
  return (
    <div>
      <p class="muted">Real-life situations. Pick what you'd actually do, then read the feedback.</p>
      {c.scenarios.map((s) => (
        <section class="card" id={s.id} style={open === s.id ? 'border-color:var(--accent)' : ''}>
          <h3 style="margin-top:0">{s.title}</h3>
          <p>{s.situation}</p>
          {s.options.map((o, j) => (
            <button class={`opt ${picks[s.id] != null && o.verdict === 'good' ? 'right' : ''} ${picks[s.id] === j && o.verdict === 'bad' ? 'wrong' : ''}`} disabled={picks[s.id] != null} onClick={() => setPicks({ ...picks, [s.id]: j })}>{o.text}</button>
          ))}
          {picks[s.id] != null && s.options.map((o, j) => (
            <p class="small"><span class={`pill ${verdictPill[o.verdict]}`}>{o.verdict}</span> {j === picks[s.id] ? <strong>{o.feedback}</strong> : o.feedback}</p>
          ))}
        </section>
      ))}
    </div>
  );
}

function ExplainList() {
  const c = useContent();
  return (
    <div>
      <p class="muted">Explaining something in plain words is the fastest way to find what you don't really understand.</p>
      {c.lessons.filter((l) => l.explain).map((l) => (
        <a class="card link" href={`#/learn/${l.id}/explain`}><div class="small muted">{l.title}</div>{l.explain!.prompt}</a>
      ))}
    </div>
  );
}

function Forgotten() {
  const c = useContent();
  const list = useMemo(() => forgotten(c), [c]);
  if (!list.length) return <p class="empty">Nothing forgotten in the last 3 weeks. Items you mark “Again” or miss in quizzes show up here.</p>;
  return (
    <div>
      <p class="muted">Things you forgot recently, most-forgotten first. Re-read the lesson section for the top few.</p>
      {list.map(({ item, state }) => (
        <section class="card">
          <div class="row between"><span class="small muted">{c.lessons.find((l) => l.id === item.item.lesson)?.title}</span><span class="pill bad">forgot {state.lapses}×</span></div>
          <p><strong>{item.item.q}</strong></p>
          <p class="small">{item.kind === 'card' ? item.item.a : `${item.item.options[item.item.answer]} — ${item.item.why}`}</p>
          <a class="small" href={`#/learn/${item.item.lesson}`}>Re-read lesson →</a>
        </section>
      ))}
    </div>
  );
}
