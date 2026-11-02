import { useState } from 'preact/hooks';
import { useContent } from '../lib/data';
import { Tabs, CopyButton, Reviewed, toast } from '../components/ui';
import { get, useStore } from '../lib/store';
import { addGlossaryCard, glossaryCardId } from '../lib/review';
import { marked } from 'marked';
import type { LinkDef } from '../lib/content';

const TABS: [string, string][] = [['library/glossary', 'Glossary'], ['library/sources', 'Official sources'], ['library/resources', 'Resources'], ['library/verify', 'Verify a claim'], ['library/prompts', 'Copy prompts']];

export function Library({ path }: { path: string[] }) {
  const sub = path[0] || 'glossary';
  const c = useContent();
  return (
    <div>
      <h1>Library</h1>
      <Tabs items={TABS} active={`library/${sub}`} />
      {sub === 'glossary' && <Glossary key={path[1] || ''} focus={path[1]} />}
      {sub === 'sources' && <LinkList links={c.linkList.filter((l) => l.kind !== 'resource')} intro="Where the real rules live. When anything changes (Budget in February, new tax year in April, RBI/SEBI circulars), check here, not on social media." />}
      {sub === 'resources' && (
        <>
          <p class="muted">Free learning material worth your time. Each has a note on who's behind it. A fuller ranked list (books, courses, specific long videos) comes with the Resources module.</p>
          <h2>Read</h2>
          <LinkList links={c.linkList.filter((l) => l.kind === 'resource' && !l.url.includes('youtube.com'))} intro="" />
          <h2>Watch</h2>
          <LinkList links={c.linkList.filter((l) => l.kind === 'resource' && l.url.includes('youtube.com'))} intro="Channels opened and checked in a browser. Beware look-alike channels using regulators' names; use these links." />
          <section class="card"><h3>What to ignore</h3><ul class="small">
            <li>Telegram/WhatsApp tip groups, "signals", copy-trading apps.</li>
            <li>Anyone showing profit screenshots instead of a long, verifiable record.</li>
            <li>Courses promising you'll replace your salary with trading.</li>
            <li>"Top 5 funds to buy now" lists ranked by last year's returns.</li>
            <li>Product pitches from people earning commission on them, presented as advice.</li>
          </ul><a class="small" href="#/library/verify">Red flags checklist →</a></section>
        </>
      )}
      {sub === 'verify' && c.pages.verify && (
        <article>
          <div class="row"><Reviewed on={c.pages.verify.reviewed_on} /><a class="small" href="#/me/edit/page:verify">Edit</a></div>
          <div class="prose" dangerouslySetInnerHTML={{ __html: c.pages.verify.html }} />
        </article>
      )}
      {sub === 'prompts' && (
        <div>
          <p class="muted">Plain text to paste into an AI tool that has web search. The app has no AI inside it. Replace the [BRACKETS] first, and never paste account numbers or ID numbers.</p>
          {c.prompts.map((p) => (
            <section class="card">
              <div class="row between"><h3 style="margin:0">{p.title}</h3><CopyButton text={p.text} /></div>
              <div class="small muted">{p.when}</div>
              <pre style="white-space:pre-wrap;font-size:.8rem;background:var(--surface-2);padding:.7rem;border-radius:10px;margin-bottom:0">{p.text}</pre>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function Glossary({ focus }: { focus?: string }) {
  const c = useContent();
  const exact = focus ? decodeURIComponent(focus) : '';
  const [q, setQ] = useState(exact);
  useStore();
  const ql = q.toLowerCase();
  const list = c.glossary
    .filter((g) => !q || [g.term, g.def, ...(g.aliases || [])].join(' ').toLowerCase().includes(ql))
    .sort((a, b) => Number(b.term === exact) - Number(a.term === exact) || a.term.localeCompare(b.term));
  const lessonTitle = (id?: string) => c.lessons.find((l) => l.id === id)?.title;
  return (
    <div>
      <p class="muted">{c.glossary.length} terms. Tap “Add to flashcards” on any word you keep forgetting.</p>
      <input type="search" placeholder="Filter terms…" value={q} onInput={(e) => setQ((e.target as HTMLInputElement).value)} />
      {list.map((g) => {
        const inCards = !!get('srs', glossaryCardId(g.term));
        return (
          <section class={`card gloss ${g.term === exact ? 'focus' : ''}`}>
            <h3 style="margin:0">{g.term}</h3>
            {g.aliases?.length ? <div class="small muted">Also: {g.aliases.join(', ')}</div> : null}
            <p style="margin:.4rem 0">{g.def}</p>
            {g.more && <div class="small prose" dangerouslySetInnerHTML={{ __html: marked.parse(g.more, { async: false }) as string }} />}
            <div class="row" style="margin-top:.4rem">
              {g.lesson && lessonTitle(g.lesson) && <a class="small" href={`#/learn/${g.lesson}`}>Lesson: {lessonTitle(g.lesson)} →</a>}
              <span class="spacer" />
              {inCards ? <span class="pill ok">In flashcards</span> : <button class="btn sm quiet" onClick={() => { addGlossaryCard(g.term); toast('Added to flashcards'); }}>Add to flashcards</button>}
            </div>
          </section>
        );
      })}
      {!list.length && <p class="empty">Not in the glossary yet. <a href="#/me/gaps">Add it to your gap log</a>.</p>}
    </div>
  );
}

function LinkList({ links, intro }: { links: LinkDef[]; intro: string }) {
  return (
    <div>
      {intro && <p class="muted">{intro}</p>}
      {links.map((k) => (
        <section class="card">
          <a href={k.url} target="_blank" rel="noopener"><strong>{k.title} ↗</strong></a>
          <div class="small muted">{k.publisher}{k.format ? ` · ${k.format}` : ''}</div>
          <p class="small" style="margin-bottom:.3rem">{k.why}</p>
          {k.bias && <p class="small" style="margin-top:0"><strong>Bias:</strong> {k.bias}</p>}
          <span class={`pill ${k.status === 'verified' ? 'ok' : 'warn'}`}>{k.status} {k.verified_on}</span>
        </section>
      ))}
    </div>
  );
}
