// Finds glossary terms in lesson text so they can be tapped for a quick meaning.
// Pure functions here (tested); the DOM wiring lives in components/TermSheet.tsx.
import type { GlossaryTerm } from './content';

export interface Matchers {
  /** Case-insensitive words/phrases ("savings account"). */
  words: RegExp | null;
  /** Case-sensitive acronyms ("FD", "UPI", "EMI") so "emi" inside normal text never matches. */
  acronyms: RegExp | null;
  /** variant (lower-cased for words, exact for acronyms) → glossary terms using it (usually one) */
  lookup: Map<string, string[]>;
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const isAcronym = (v: string) => /^[A-Z0-9&]{2,}$/.test(v.replace(/[\s-]/g, '')) && /[A-Z]/.test(v);

/** All the ways a term can appear: "CTC (Cost to Company)" → CTC, Cost to Company; "Form 16 / Form 130" → both. */
export function variantsOf(g: GlossaryTerm): string[] {
  const out = new Set<string>();
  const add = (s: string) => { const t = s.trim(); if (t.length >= 2) out.add(t); };
  const base = g.term;
  add(base);
  const paren = base.match(/^(.*?)\s*\((.*)\)\s*$/);
  if (paren) { add(paren[1]); add(paren[2]); }
  for (const part of (paren ? paren[1] : base).split(/\s+\/\s+/)) add(part);
  for (const a of g.aliases || []) add(a);
  return [...out];
}

export function buildMatchers(glossary: GlossaryTerm[]): Matchers {
  const lookup = new Map<string, string[]>();
  const words: string[] = [], acr: string[] = [];
  const add = (k: string, term: string, list: string[], v: string) => {
    const cur = lookup.get(k);
    if (!cur) { lookup.set(k, [term]); list.push(v); } else if (!cur.includes(term)) cur.push(term);
  };
  for (const g of glossary) {
    for (const v of variantsOf(g)) {
      if (isAcronym(v)) add(v, g.term, acr, v);
      else add(v.toLowerCase(), g.term, words, v);
    }
  }
  // Longest first so "savings account" wins over "savings". Allow a plural "s"/"es" after the term.
  const mk = (list: string[], flags: string) =>
    list.length ? new RegExp(`(^|[^A-Za-z0-9])(${list.sort((a, b) => b.length - a.length).map(escapeRe).join('|')})(?:e?s)?(?![A-Za-z0-9])`, flags) : null;
  return { words: mk(words, 'gi'), acronyms: mk(acr, 'g'), lookup };
}

export interface TermMatch { start: number; end: number; term: string }

/**
 * Earliest glossary match in `text` at or after `from`, skipping terms in `used`.
 * When one word belongs to several terms (e.g. EPS = pension scheme or earnings per share),
 * `pick` chooses the one that fits the current lesson; default is the first.
 */
export function nextMatch(text: string, from: number, m: Matchers, used: Set<string>, pick: (terms: string[]) => string = (t) => t[0]): TermMatch | null {
  let best: TermMatch | null = null;
  for (const [re, ci] of [[m.words, true], [m.acronyms, false]] as const) {
    if (!re) continue;
    re.lastIndex = from;
    for (let r; (r = re.exec(text)); ) {
      const variant = r[2];
      const cands = m.lookup.get(ci ? variant.toLowerCase() : variant);
      const term = cands && pick(cands);
      const start = r.index + r[1].length;
      if (term && !used.has(term)) {
        const end = start + r[0].length - r[1].length;
        if (!best || start < best.start) best = { start, end, term };
        break;
      }
      re.lastIndex = start + 1;
    }
  }
  return best;
}

/** Prefer the term taught in this lesson, then one from the same module, else the first. */
export function contextPicker(glossary: GlossaryTerm[], lessonId?: string) {
  const lessonOf = new Map(glossary.map((g) => [g.term, g.lesson || '']));
  const mod = (id: string) => (id.match(/^m(\d+)-/) || [])[1];
  const here = lessonId ? mod(lessonId) : undefined;
  return (terms: string[]) =>
    terms.find((t) => lessonOf.get(t) === lessonId) ||
    terms.find((t) => here !== undefined && mod(lessonOf.get(t) || '') === here) ||
    terms[0];
}
