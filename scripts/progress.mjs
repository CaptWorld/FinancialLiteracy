// Prints a Markdown summary of learning progress from the live D1 database,
// so any Claude session (Code, Cowork) can see where the learner is.
// Usage: npm run progress            (needs wrangler logged in, or CLOUDFLARE_API_TOKEN set)
//        npm run progress -- --local (reads the local dev database instead)
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { parse } from 'yaml';

const where = process.argv.includes('--local') ? '--local' : '--remote';
const raw = execFileSync('npx', ['wrangler', 'd1', 'execute', 'paisa-sense', where, '--json', '--command',
  'SELECT collection, id, data, updated FROM items WHERE deleted = 0'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] });
const rows = JSON.parse(raw)[0].results.map((r) => ({ ...r, data: JSON.parse(r.data) }));
const by = (c) => rows.filter((r) => r.collection === c);

const lessons = readdirSync('content/lessons').map((f) => {
  const m = readFileSync(`content/lessons/${f}`, 'utf8').match(/^---\n([\s\S]*?)\n---/);
  return parse(m[1]);
}).sort((a, b) => a.module - b.module || a.order - b.order);

const today = new Date().toISOString().slice(0, 10);
const progress = Object.fromEntries(by('progress').map((r) => [r.id, r.data]));
const srs = by('srs');
const quiz = by('quiz');
const out = [];
const p = (s = '') => out.push(s);

p(`# Learning progress (${today})`);
p();
p('## Lessons');
for (const l of lessons) {
  const done = progress[l.id];
  const tasks = Object.keys(progress).filter((k) => k.startsWith(`task:${l.id}:`)).length;
  p(`- ${done ? '[x]' : '[ ]'} M${l.module} ${l.title}${done ? ` (done ${done.done}; tasks ticked: ${tasks})` : ''}`);
}
p();
p('## Review');
const due = srs.filter((r) => r.data.due <= today).length;
const right = quiz.filter((r) => r.data.correct).length;
p(`- Flashcards/quiz items in spaced review: ${srs.length}, due today: ${due}`);
p(`- Quiz/problem answers logged: ${quiz.length}, correct: ${quiz.length ? Math.round((right / quiz.length) * 100) : 0}%`);
const forgotten = srs.filter((r) => r.data.lapses > 0).sort((a, b) => b.data.lapses - a.data.lapses).slice(0, 10);
if (forgotten.length) {
  p('- Most-forgotten items (id: times forgotten):');
  forgotten.forEach((r) => p(`  - ${r.id}: ${r.data.lapses}`));
}
p();
const snap = by('snapshot').find((r) => r.id === 'current');
if (snap) {
  p('## Money Snapshot (rough numbers they entered)');
  for (const [k, v] of Object.entries(snap.data)) p(`- ${k}: ${v}`);
  p();
}
const sf = by('settings').find((r) => r.id === 'selffund');
if (sf?.data.items?.length) {
  const yearly = sf.data.items.reduce((a, b) => a + b.monthly, 0) * 12;
  p('## Self-funding extras');
  sf.data.items.forEach((i) => p(`- ${i.name}: ₹${i.monthly}/month`));
  p(`- Pot needed at ${sf.data.withdrawal}%: ₹${Math.round(yearly / (sf.data.withdrawal / 100))}; invested so far: ₹${sf.data.invested}; adding ₹${sf.data.monthlySip}/month`);
  p();
}
const goals = by('goals');
if (goals.length) { p('## Goals'); goals.forEach((g) => p(`- ${g.data.name}: ₹${g.data.todayCost} in today's money, ${g.data.years} years. Why: ${g.data.why || '-'}`)); p(); }
const gaps = by('gaps').filter((g) => !g.data.resolved);
if (gaps.length) { p('## Open "terms I didn\'t get"'); gaps.forEach((g) => p(`- ${g.data.term} (added ${g.data.added})`)); p(); }
const notes = by('notes');
if (notes.length) { p('## Notes'); notes.forEach((n) => p(`- ${n.data.on} — ${n.data.title}${n.data.source ? ` (from ${n.data.source})` : ''}`)); p(); }
const edits = by('overrides');
if (edits.length) { p('## Lessons edited in the app (not yet in the repo)'); edits.forEach((e) => p(`- ${e.id}`)); p(); }
console.log(out.join('\n'));
