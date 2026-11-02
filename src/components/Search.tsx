import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { useContent } from '../lib/data';

interface Doc { title: string; text: string; to: string; kind: string; external?: boolean }

export function Search({ onClose }: { onClose: () => void }) {
  const c = useContent();
  const [q, setQ] = useState('');
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    ref.current?.focus();
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    addEventListener('keydown', k);
    return () => removeEventListener('keydown', k);
  }, []);

  const docs = useMemo<Doc[]>(() => [
    ...c.lessons.map((l) => ({ title: l.title, text: `${l.summary} ${l.cheatsheet.join(' ')} ${l.text}`, to: `learn/${l.id}`, kind: `Lesson · Module ${l.module}` })),
    ...c.glossary.map((g) => ({ title: g.term, text: g.def, to: `library/glossary/${encodeURIComponent(g.term)}`, kind: 'Glossary' })),
    ...c.problems.map((p) => ({ title: p.title, text: p.question, to: `practice/problems/${p.id}`, kind: 'Practice problem' })),
    ...c.scenarios.map((s) => ({ title: s.title, text: s.situation, to: `practice/scenarios/${s.id}`, kind: 'Scenario' })),
    ...c.linkList.map((l) => ({ title: l.title, text: `${l.publisher} ${l.why}`, to: l.url, kind: `Link · ${l.publisher}`, external: true })),
    ...c.prompts.map((p) => ({ title: p.title, text: p.when + ' ' + p.text, to: 'library/prompts', kind: 'Copy prompt' })),
    ...c.blindspots.map((b) => ({ title: b.title, text: b.why, to: 'me/blindspots', kind: 'Things people never learn' })),
    ...Object.entries(c.pages).map(([k, p]) => ({ title: p.title, text: p.html.replace(/<[^>]+>/g, ' '), to: `library/${k}`, kind: 'Guide' }))
  ], [c]);

  const hits = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter((t) => t.length > 1);
    if (!terms.length) return [];
    return docs
      .map((d) => {
        const t = d.title.toLowerCase(), x = d.text.toLowerCase();
        let s = 0;
        for (const term of terms) {
          if (t.includes(term)) s += 10;
          const n = x.split(term).length - 1;
          if (!n && !t.includes(term)) return { d, s: 0 };
          s += Math.min(n, 5);
        }
        return { d, s };
      })
      .filter((h) => h.s > 0).sort((a, b) => b.s - a.s).slice(0, 30);
  }, [q, docs]);

  const snippet = (text: string) => {
    const i = text.toLowerCase().indexOf(q.toLowerCase().split(/\s+/)[0]);
    return (i > 40 ? '…' : '') + text.slice(Math.max(0, i - 40), i + 120) + '…';
  };

  return (
    <div class="search-overlay" role="dialog" aria-label="Search">
      <div class="inner">
        <div class="row">
          <input ref={ref} type="search" placeholder="Search lessons, terms, tools, links…" value={q} onInput={(e) => setQ((e.target as HTMLInputElement).value)} style="flex:1" />
          <button class="btn quiet" onClick={onClose}>Close</button>
        </div>
        {q && !hits.length && <p class="empty">Nothing found. Add it to your “terms I didn’t get” log in Me → Gaps.</p>}
        {hits.map(({ d }) => (
          <a class="hit" href={d.external ? d.to : '#/' + d.to} target={d.external ? '_blank' : undefined} rel="noopener" onClick={() => !d.external && onClose()}>
            <div class="small muted">{d.kind}</div>
            <div class="t">{d.title}{d.external ? ' ↗' : ''}</div>
            <div class="small">{snippet(d.text)}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
