import { useEffect, useRef, useState } from 'preact/hooks';
import { useContent } from '../lib/data';
import { lessonDone, markLessonDone, recordQuiz, tasksDone } from '../lib/review';
import { get, put, remove } from '../lib/store';
import { Reviewed, toast } from '../components/ui';
import type { Lesson, QuizQ } from '../lib/content';
import { today } from '../lib/srs';
import { useTermSheet } from '../components/TermSheet';
import { stableOrder } from '../lib/shuffle';

export function Learn({ path }: { path: string[] }) {
  const c = useContent();
  if (path[0]) {
    const l = c.lessons.find((x) => x.id === path[0]);
    return l ? <LessonView lesson={l} tab={path[1] || 'read'} /> : <p class="empty">Lesson not found. <a href="#/learn">Back to lessons</a></p>;
  }
  return (
    <div>
      <h1>Learn</h1>
      <p class="muted">Short lessons that start with a real situation and end with a task on your own money. Finishing a lesson adds its flashcards to your daily review.</p>
      {c.modules.map((m) => {
        const ls = c.lessons.filter((l) => l.module === m.id);
        const done = ls.filter((l) => lessonDone(l.id)).length;
        if (!ls.length) return (
          <section class="card" style="opacity:.7">
            <div class="row between"><h3 style="margin:0">{m.id}. {m.title}</h3><span class="pill">Coming next</span></div>
            <p class="small muted" style="margin-bottom:0">{m.blurb}</p>
          </section>
        );
        return (
          <section class="card">
            <div class="row between"><h2 style="margin:0">{m.id}. {m.title}</h2><span class={`pill ${done === ls.length ? 'ok' : ''}`}>{done}/{ls.length}</span></div>
            <p class="small muted">{m.blurb}</p>
            {ls.map((l) => (
              <a class="check" href={`#/learn/${l.id}`} style="text-decoration:none;color:inherit">
                <span aria-hidden="true">{lessonDone(l.id) ? '✅' : '⚪️'}</span>
                <div style="flex:1"><strong>{l.title}</strong><div class="small muted">{l.minutes} min · {l.summary}</div>
                  {lessonDone(l.id) && l.tasks > 0 && <div class="small muted">Tasks {tasksDone(l.id, l.tasks)}/{l.tasks}</div>}</div>
              </a>
            ))}
          </section>
        );
      })}
    </div>
  );
}

function LessonView({ lesson: l, tab }: { lesson: Lesson; tab: string }) {
  const c = useContent();
  const done = lessonDone(l.id);
  const idx = c.lessons.findIndex((x) => x.id === l.id);
  const next = c.lessons[idx + 1];
  const prose = useRef<HTMLDivElement>(null);
  // Tick boxes on "Do this now" tasks are saved per lesson and synced.
  useEffect(() => {
    const el = prose.current;
    if (!el) return;
    el.querySelectorAll<HTMLInputElement>('input[data-task]').forEach((cb) => { cb.checked = !!get('progress', `task:${l.id}:${cb.dataset.task}`); });
    const onChange = (e: Event) => {
      const cb = e.target as HTMLInputElement;
      if (!cb.dataset.task) return;
      const key = `task:${l.id}:${cb.dataset.task}`;
      if (cb.checked) { put('progress', key, { on: today() }); toast('Nice. Task done.'); } else remove('progress', key);
    };
    el.addEventListener('change', onChange);
    return () => el.removeEventListener('change', onChange);
  }, [l.id, l.html, tab]);
  const sheet = useTermSheet(prose, c.glossary, [l.id, l.html, tab], l.id);
  const tabs: [string, string][] = [['read', 'Lesson'], ['cheat', 'Cheat sheet'], ['quiz', 'Quiz'], ['explain', 'Explain it back'], ['deeper', 'Resources']];

  return (
    <article>
      <a href="#/learn" class="small">← All lessons</a>
      <div class="small muted" style="margin-top:.6rem">Module {l.module} · {l.minutes} min read</div>
      <h1>{l.title}</h1>
      <div class="row"><Reviewed on={l.reviewed_on} />{done && <span class="pill ok">Done</span>}<a class="small" href={`#/me/edit/${l.id}`}>Edit</a></div>
      <nav class="tabs" style="margin-top:1rem">{tabs.map(([k, t]) => <a href={`#/learn/${l.id}/${k}`} class={tab === k ? 'active' : ''}>{t}</a>)}</nav>

      {tab === 'read' && (
        <>
          <p class="small muted noprint" style="margin:.8rem 0 0">Tap any <span class="term" aria-hidden="true">underlined word</span> for a quick meaning. “Go deeper” boxes are optional.</p>
          <div class="prose" ref={prose} dangerouslySetInnerHTML={{ __html: l.html }} />
          {sheet}
          <section class="card noprint">
            {done ? (
              <p style="margin:0">✅ Done on {get<{ done: string }>('progress', l.id)?.done}. Its {l.cards.length} flashcards are in your review queue.</p>
            ) : (
              <>
                <p style="margin-top:0">Finished reading? Mark it done to add <strong>{l.cards.length} flashcards</strong> to your spaced review, then take the 3-question quiz.</p>
                <button class="btn" onClick={() => { markLessonDone(c, l.id); toast('Flashcards added'); location.hash = `#/learn/${l.id}/quiz`; }}>Mark done & take quiz</button>
              </>
            )}
          </section>
        </>
      )}

      {tab === 'cheat' && (
        <section class="card">
          <h2>60-second cheat sheet</h2>
          <ul>{l.cheatsheet.map((x) => <li>{x}</li>)}</ul>
          <button class="btn quiet sm noprint" onClick={() => print()}>Print</button>
        </section>
      )}

      {tab === 'quiz' && <Quiz qs={l.quiz} />}
      {tab === 'explain' && <Explain lesson={l} />}

      {tab === 'deeper' && (
        <section>
          <p class="muted">Free, credible material to go further, beyond the lesson's own “Go deeper” boxes. Each link was opened and checked; the bias line tells you who's behind it.</p>
          {l.deeper.map((id) => {
            const k = c.links[id];
            if (!k) return null;
            return (
              <div class="card">
                <a href={k.url} target="_blank" rel="noopener"><strong>{k.title} ↗</strong></a>
                <div class="small muted">{k.publisher}{k.format ? ` · ${k.format}` : ''}</div>
                <p class="small">{k.why}</p>
                {k.bias && <p class="small"><strong>Bias:</strong> {k.bias}</p>}
                <span class={`pill ${k.status === 'verified' ? 'ok' : 'warn'}`}>{k.status} {k.verified_on}</span>
              </div>
            );
          })}
        </section>
      )}

      {next && <a class="card link noprint" href={`#/learn/${next.id}`}><div class="small muted">Next</div><strong>{next.title}</strong></a>}
    </article>
  );
}

export function Quiz({ qs }: { qs: QuizQ[] }) {
  const [picked, setPicked] = useState<Record<string, number>>({});
  const score = qs.filter((q) => picked[q.id] === q.answer).length;
  const answered = Object.keys(picked).length;
  return (
    <div>
      {qs.map((q, i) => {
        const p = picked[q.id];
        return (
          <section class="card">
            <div class="small muted">Question {i + 1}</div>
            <p><strong>{q.q}</strong></p>
            {stableOrder(q.id, q.options.length).map((j) => (
              <button class={`opt ${p != null && j === q.answer ? 'right' : ''} ${p === j && j !== q.answer ? 'wrong' : ''}`} disabled={p != null}
                onClick={() => { setPicked({ ...picked, [q.id]: j }); recordQuiz(q, j === q.answer); }}>{q.options[j]}</button>
            ))}
            {p != null && <p class="small">{p === q.answer ? '✅ ' : '❌ This one will come back in your review. '}{q.why}</p>}
          </section>
        );
      })}
      {answered === qs.length && <div class="result"><strong>{score}/{qs.length}</strong> correct. {score < qs.length ? 'Missed questions are now in your spaced review.' : 'Nice.'}</div>}
    </div>
  );
}

function Explain({ lesson: l }: { lesson: Lesson }) {
  const saved = get<{ text: string; on: string }>('explain', l.id);
  const [text, setText] = useState(saved?.text || '');
  const [show, setShow] = useState(false);
  if (!l.explain) return <p class="empty">No prompt for this lesson.</p>;
  return (
    <section class="card">
      <p><strong>{l.explain.prompt}</strong></p>
      <p class="small muted">Write it in plain words, as if talking to a friend. Then compare with the model answer. Being able to explain it is the real test.</p>
      <textarea value={text} onInput={(e) => setText((e.target as HTMLTextAreaElement).value)} placeholder="Your explanation…" />
      <div class="row" style="margin-top:.6rem">
        <button class="btn" disabled={!text.trim()} onClick={() => { put('explain', l.id, { text, on: today() }); setShow(true); }}>Save & compare</button>
      </div>
      {show && (
        <div class="result">
          <div class="small muted">Model answer</div>
          <p>{l.explain.model}</p>
          <p class="small">Did yours cover the same key ideas? If not, re-read the lesson section, then try again tomorrow.</p>
        </div>
      )}
    </section>
  );
}
