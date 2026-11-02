import { useState } from 'preact/hooks';
import { useContent } from '../lib/data';
import { dueItems, lessonDone, tasksDone, upcoming } from '../lib/review';
import { all, get, put } from '../lib/store';
import { evaluate, lightOrder, type SnapshotAnswers } from '../lib/snapshot';
import { today } from '../lib/srs';
import { uid, inr } from '../lib/data';
import { corpusFor } from '../lib/calc/money';
import { toast } from '../components/ui';

export const LADDER = [
  { n: 1, title: 'Foundations', desc: 'Understand the basics, read your payslip and statements, stay safe.', modules: [0, 1, 2, 3] },
  { n: 2, title: 'Borrow wisely & protect yourself', desc: 'Know loan types and their real cost; get the insurance you actually need.', modules: [4, 5] },
  { n: 3, title: 'Goals & first SIP', desc: 'Understand the economy around you; set goals; start a small direct index fund SIP knowing costs and risks.', modules: [6, 7, 8, 13] },
  { n: 4, title: 'Analyse & paper trade', desc: 'Read company accounts and reports, paper trade with a written journal.', modules: [9, 10, 11] },
  { n: 5, title: 'Small real stock investing (optional)', desc: 'With an explicit rule on what you can afford to lose. Taxes, behaviour and history first.', modules: [12, 14, 15] },
  { n: 6, title: 'Help with family money (optional)', desc: 'Review family investments and policies; plan succession.', modules: [16, 17] }
];

export function ladderLevel(lessonsByModule: Record<number, string[]>): number {
  let level = 0;
  for (const step of LADDER) {
    const ids = step.modules.flatMap((m) => lessonsByModule[m] || []);
    const anyMissing = step.modules.some((m) => !(lessonsByModule[m] || []).length);
    if (anyMissing || !ids.every(lessonDone)) break;
    level = step.n;
  }
  return level;
}

export function Today() {
  const c = useContent();
  const due = dueItems(c);
  const next = c.lessons.find((l) => !lessonDone(l.id));
  const snap = get<SnapshotAnswers>('snapshot', 'current');
  const checks = snap ? evaluate(snap).filter((x) => x.light === 'red' || x.light === 'amber').sort((a, b) => lightOrder[a.light] - lightOrder[b.light]).slice(0, 3) : [];
  const dismissed = get<Record<string, boolean>>('settings', 'blindspots-done') || {};
  const pool = c.blindspots.filter((b) => !dismissed[b.id]);
  const dayIndex = Math.floor(Date.now() / 864e5);
  const spot = pool.length ? pool[dayIndex % pool.length] : null;
  const byModule: Record<number, string[]> = {};
  c.lessons.forEach((l) => (byModule[l.module] ||= []).push(l.id));
  const level = ladderLevel(byModule);
  const done = c.lessons.filter((l) => lessonDone(l.id)).length;
  const week = upcoming(7);
  const [term, setTerm] = useState('');
  const openTasks = c.lessons.filter((l) => lessonDone(l.id) && l.tasks > tasksDone(l.id, l.tasks));

  const addGap = () => {
    if (!term.trim()) return;
    put('gaps', uid(), { term: term.trim(), added: today(), resolved: false });
    setTerm(''); toast('Added to your gap log');
  };

  return (
    <div>
      <h1>Today</h1>

      {(() => {
        const t = today();
        const doneToday = c.lessons.find((l) => get<{ done: string }>('progress', l.id)?.done === t);
        const practisedToday = Object.entries(all<{ on?: string }>('progress')).some(([k, v]) => k.startsWith('task:') && v?.on === t)
          || Object.values(all<{ on?: string }>('quiz')).some((v) => v?.on === t);
        const reviewDone = done > 0 && due.length === 0;
        const taskLesson = openTasks[0];
        return (
          <section class="card">
            <div class="row between"><h2 style="margin:0">Today · about 30 min</h2>{reviewDone && doneToday && practisedToday && <span class="pill ok">All done 🎉</span>}</div>
            <p class="small muted" style="margin:.2rem 0 .4rem">Review first: remembering beats reading more.</p>
            <a class={`plan-step ${reviewDone ? 'done' : ''}`} href={due.length ? '#/practice/review' : '#/practice'}>
              <span class="num">{reviewDone ? '✓' : 1}</span>
              <div><strong>Review flashcards</strong><div class="small muted">{due.length ? `${due.length} due today` : done ? 'Nothing due. Nice.' : 'Starts after your first lesson'}</div></div>
              <span class="small muted mins">~10 min</span>
            </a>
            {doneToday ? (
              <a class="plan-step done" href={`#/learn/${doneToday.id}`}>
                <span class="num">✓</span>
                <div><strong>Lesson done</strong><div class="small muted">{doneToday.title}</div></div>
                <span class="small muted mins">~15 min</span>
              </a>
            ) : next ? (
              <a class="plan-step" href={`#/learn/${next.id}`}>
                <span class="num">2</span>
                <div><strong>{next.title}</strong><div class="small muted">Module {next.module} · {next.summary}</div></div>
                <span class="small muted mins">~{next.minutes} min</span>
              </a>
            ) : (
              <div class="plan-step done"><span class="num">✓</span><div><strong>All available lessons done</strong><div class="small muted">Ask Claude for the next module.</div></div></div>
            )}
            <a class={`plan-step ${practisedToday ? 'done' : ''}`} href={taskLesson ? `#/learn/${taskLesson.id}` : '#/practice/problems'}>
              <span class="num">{practisedToday ? '✓' : 3}</span>
              <div><strong>{taskLesson ? 'Do a task on your own money' : 'Solve one practice problem'}</strong>
                <div class="small muted">{taskLesson ? `${taskLesson.title} · ${tasksDone(taskLesson.id, taskLesson.tasks)}/${taskLesson.tasks} done` : 'Or a real-life scenario, or the quiz of today’s lesson'}</div></div>
              <span class="small muted mins">~5 min</span>
            </a>
            {done > 0 && <div class="small muted" style="margin-top:.4rem">Reviews in the next 7 days: {week.join(' · ')}</div>}
          </section>
        );
      })()}

      {openTasks.length > 0 && (
        <section class="card">
          <h2 style="margin-top:0">Tasks to do on your own money</h2>
          <p class="small muted">Reading is half of it. These are the "Do this now" steps from lessons you've finished.</p>
          {openTasks.slice(0, 4).map((l) => (
            <a class="check" href={`#/learn/${l.id}`} style="text-decoration:none;color:inherit">
              <span aria-hidden="true">☐</span><div style="flex:1"><strong>{l.title}</strong><div class="small muted">{tasksDone(l.id, l.tasks)}/{l.tasks} tasks done</div></div>
            </a>
          ))}
        </section>
      )}

      <section class="card">
        <div class="row between"><h2 style="margin:0">My Money Snapshot</h2><a href="#/me/snapshot" class="small">{snap ? 'Update' : 'Fill in (3 min)'}</a></div>
        {!snap && <p class="muted">A quick checkup with rough numbers. It turns the lessons into a to-do list for your own money.</p>}
        {snap && !checks.length && <p>Everything you answered is green. 👏</p>}
        {checks.map((x) => (
          <div class="check"><span class={`light ${x.light}`} /><div><strong>{x.label}</strong><div class="small muted">{x.detail}</div>{x.fix && <a class="small" href={'#/' + x.fix}>{x.fixLabel} →</a>}</div></div>
        ))}
      </section>

      <section class="card">
        <h2 style="margin-top:0">Heard a term you didn't get?</h2>
        <div class="row">
          <input type="text" placeholder="e.g. repo rate, XIRR, sub-limit" value={term} onInput={(e) => setTerm((e.target as HTMLInputElement).value)} onKeyDown={(e) => e.key === 'Enter' && addGap()} style="flex:1;min-width:10rem" />
          <button class="btn" onClick={addGap}>Add</button>
        </div>
        <a class="small" href="#/me/gaps">See your gap log →</a>
      </section>

      {spot && (
        <section class="card">
          <div class="small muted">Most people never learn this · cost {'●'.repeat(spot.cost)}{'○'.repeat(5 - spot.cost)}</div>
          <h3 style="margin:.2rem 0">{spot.title}</h3>
          <p class="small">{spot.why}</p>
          {spot.lesson && <a class="small" href={`#/learn/${spot.lesson}`}>Read the lesson →</a>}
        </section>
      )}

      {(() => {
        const sf = get<{ items: { monthly: number }[]; withdrawal: number; invested: number }>('settings', 'selffund');
        const yearly = (sf?.items || []).reduce((a, b) => a + (b.monthly || 0), 0) * 12;
        if (!sf || !yearly) return (
          <a class="card link" href="#/tools/selffund"><div class="small muted">Long-term goal</div><strong>Make your extras pay for themselves</strong><div class="small muted">List recurring extras (subscriptions, giving) and track the investment pot that will cover them.</div></a>
        );
        const need = corpusFor(yearly, sf.withdrawal);
        const pct = Math.min(100, (sf.invested / need) * 100);
        return (
          <a class="card link" href="#/tools/selffund">
            <div class="small muted">Self-funding extras</div>
            <div class="row between"><strong>{pct.toFixed(1)}% of {inr(need)}</strong><span class="pill info">covers {inr((sf.invested * sf.withdrawal) / 1200)}/mo</span></div>
            <div class="progress" style="margin-top:.5rem"><span style={`width:${pct}%`} /></div>
          </a>
        );
      })()}

      <a class="card link" href="#/me/ladder">
        <div class="small muted">Learning ladder</div>
        <div class="row between"><strong>{level ? `Level ${level}: ${LADDER[level - 1].title}` : 'Working on Level 1: Foundations'}</strong><span class="pill info">{done}/{c.lessons.length} lessons</span></div>
        <div class="progress" style="margin-top:.5rem"><span style={`width:${(done / Math.max(1, c.lessons.length)) * 100}%`} /></div>
      </a>
    </div>
  );
}
