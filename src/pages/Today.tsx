import { useState } from 'preact/hooks';
import { useContent } from '../lib/data';
import { dueItems, lessonDone, upcoming } from '../lib/review';
import { get, put } from '../lib/store';
import { evaluate, lightOrder, type SnapshotAnswers } from '../lib/snapshot';
import { today } from '../lib/srs';
import { uid } from '../lib/data';
import { toast } from '../components/ui';

export const LADDER = [
  { n: 1, title: 'Foundations', desc: 'Understand the basics, read your payslip and statements, stay safe.', modules: [1, 2, 3] },
  { n: 2, title: 'Track & borrow wisely', desc: 'Track a month of spending; know loan types and their real cost.', modules: [4] },
  { n: 3, title: 'Goals & first SIP', desc: 'Set goals; start a small direct index fund SIP knowing costs and risks.', modules: [5, 6, 7, 11] },
  { n: 4, title: 'Analyse & paper trade', desc: 'Read company reports, paper trade with a written journal.', modules: [8, 9] },
  { n: 5, title: 'Small real stock investing (optional)', desc: 'With an explicit rule on what you can afford to lose.', modules: [10, 12] },
  { n: 6, title: 'Help with family money (optional)', desc: 'Review family investments and policies; plan succession.', modules: [13, 14] }
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

  const addGap = () => {
    if (!term.trim()) return;
    put('gaps', uid(), { term: term.trim(), added: today(), resolved: false });
    setTerm(''); toast('Added to your gap log');
  };

  return (
    <div>
      <h1>Today</h1>

      <section class="card">
        <div class="row between">
          <div>
            <div class="small muted">Daily review</div>
            <div class="big">{due.length}</div>
            <div class="small muted">{due.length ? `item${due.length > 1 ? 's' : ''} due · about ${Math.max(1, Math.round(due.length * 0.3))} min` : done ? 'All caught up' : 'Finish a lesson to get flashcards'}</div>
          </div>
          {due.length > 0 && <a class="btn" href="#/practice/review">Start review</a>}
        </div>
        {done > 0 && <div class="small muted" style="margin-top:.5rem">Next 7 days: {week.join(' · ')}</div>}
      </section>

      {next ? (
        <a class="card link" href={`#/learn/${next.id}`}>
          <div class="small muted">Next lesson · Module {next.module} · {next.minutes} min</div>
          <h2 style="margin:.2rem 0">{next.title}</h2>
          <div class="muted">{next.summary}</div>
        </a>
      ) : (
        <section class="card"><h2>All available lessons done 🎉</h2><p class="muted">Keep reviewing. Ask for the next module when you're ready.</p></section>
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

      <a class="card link" href="#/me/ladder">
        <div class="small muted">Learning ladder</div>
        <div class="row between"><strong>{level ? `Level ${level}: ${LADDER[level - 1].title}` : 'Working on Level 1: Foundations'}</strong><span class="pill info">{done}/{c.lessons.length} lessons</span></div>
        <div class="progress" style="margin-top:.5rem"><span style={`width:${(done / Math.max(1, c.lessons.length)) * 100}%`} /></div>
      </a>
    </div>
  );
}
