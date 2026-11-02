// Tap-a-word: glossary terms inside a lesson become buttons; tapping one opens a small sheet
// with the meaning, so you can keep reading instead of falling down a rabbit hole.
import { useEffect, useMemo, useState } from 'preact/hooks';
import type { RefObject } from 'preact';
import type { GlossaryTerm } from '../lib/content';
import { buildMatchers, contextPicker, nextMatch } from '../lib/terms';
import { addGlossaryCard, glossaryCardId } from '../lib/review';
import { get, put } from '../lib/store';
import { today } from '../lib/srs';
import { uid } from '../lib/data';
import { toast } from './ui';

const SKIP = new Set(['A', 'BUTTON', 'CODE', 'PRE', 'H1', 'H2', 'H3', 'TH', 'SUMMARY', 'LABEL', 'INPUT', 'TEXTAREA']);

/** Wraps the first appearance of each glossary term inside `root` in a <button class="term">. */
export function linkTerms(root: HTMLElement, glossary: GlossaryTerm[], lessonId?: string) {
  if (root.querySelector('button.term')) return;
  const m = buildMatchers(glossary);
  const used = new Set<string>();
  const pick = contextPicker(glossary, lessonId);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(n) {
      for (let p = n.parentElement; p && p !== root; p = p.parentElement) {
        if (SKIP.has(p.tagName) || p.classList.contains('block-label')) return NodeFilter.FILTER_REJECT;
      }
      return n.nodeValue && n.nodeValue.trim().length > 1 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });
  const nodes: Text[] = [];
  for (let n = walker.nextNode(); n; n = walker.nextNode()) nodes.push(n as Text);
  for (let node of nodes) {
    let hit = nextMatch(node.data, 0, m, used, pick);
    while (hit) {
      used.add(hit.term);
      const word = node.splitText(hit.start);
      const rest = word.splitText(hit.end - hit.start);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'term';
      btn.dataset.term = hit.term;
      btn.textContent = word.data;
      word.replaceWith(btn);
      node = rest;
      hit = nextMatch(node.data, 0, m, used, pick);
    }
  }
}

/** Hooks the popup up to a container. Returns the sheet to render. */
export function useTermSheet(ref: RefObject<HTMLElement>, glossary: GlossaryTerm[], deps: unknown[], lessonId?: string) {
  const [open, setOpen] = useState<GlossaryTerm | null>(null);
  const byTerm = useMemo(() => new Map(glossary.map((g) => [g.term, g])), [glossary]);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    linkTerms(el, glossary, lessonId);
    const onClick = (e: Event) => {
      const b = (e.target as HTMLElement).closest('button.term') as HTMLButtonElement | null;
      if (b?.dataset.term) { e.preventDefault(); setOpen(byTerm.get(b.dataset.term) || null); }
    };
    el.addEventListener('click', onClick);
    return () => el.removeEventListener('click', onClick);
  }, deps);
  return open ? <TermSheet g={open} onClose={() => setOpen(null)} /> : null;
}

export function TermSheet({ g, onClose }: { g: GlossaryTerm; onClose: () => void }) {
  const [inCards, setInCards] = useState(!!get('srs', glossaryCardId(g.term)));
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    addEventListener('keydown', k);
    return () => removeEventListener('keydown', k);
  }, []);
  return (
    <div class="sheet-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-term">
        <div class="row between" style="align-items:flex-start">
          <h3 id="sheet-term" style="margin:0">{g.term}</h3>
          <button class="iconbtn" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <p style="margin:.5rem 0 1rem">{g.def}</p>
        <div class="row">
          <a class="btn sm quiet" href={`#/library/glossary/${encodeURIComponent(g.term)}`} onClick={onClose}>{g.more ? 'Read more' : 'Glossary'} →</a>
          {inCards
            ? <span class="pill ok">In your flashcards</span>
            : <button class="btn sm" onClick={() => { addGlossaryCard(g.term); setInCards(true); toast('Added to flashcards'); }}>Add to flashcards</button>}
        </div>
        <button class="linkbtn small" style="margin-top:.8rem" onClick={() => { put('gaps', uid(), { term: g.term, added: today(), resolved: false }); toast('Added to your gap log'); onClose(); }}>
          Still confusing? Add to gap log and ask Claude later
        </button>
      </div>
    </div>
  );
}
