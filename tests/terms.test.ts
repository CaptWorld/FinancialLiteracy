import { describe, expect, it } from 'vitest';
import { buildMatchers, nextMatch, variantsOf } from '../src/lib/terms';

const G = [
  { term: 'Savings account', def: 'x', aliases: ['savings bank account'] },
  { term: 'Savings', def: 'x' },
  { term: 'FD (Fixed Deposit)', def: 'x' },
  { term: 'EMI', def: 'x' },
  { term: 'Form 16 / Form 130', def: 'x' },
  { term: 'Interest', def: 'x' }
];
const m = buildMatchers(G);
const all = (text: string) => {
  const used = new Set<string>(); const out: string[] = []; let from = 0;
  for (let h = nextMatch(text, from, m, used); h; h = nextMatch(text, from, m, used)) { out.push(`${h.term}=${text.slice(h.start, h.end)}`); used.add(h.term); from = h.end; }
  return out;
};

describe('term matching', () => {
  it('splits variants', () => {
    expect(variantsOf(G[2])).toEqual(expect.arrayContaining(['FD (Fixed Deposit)', 'FD', 'Fixed Deposit']));
    expect(variantsOf(G[4])).toEqual(expect.arrayContaining(['Form 16', 'Form 130']));
  });
  it('prefers the longest phrase and matches case-insensitively', () => {
    expect(all('Open a Savings Account today.')).toEqual(['Savings account=Savings Account']);
  });
  it('matches acronyms case-sensitively, with plurals', () => {
    expect(all('Two FDs and an EMI')).toEqual(['FD (Fixed Deposit)=FDs', 'EMI=EMI']);
    expect(all('the premium is high')).toEqual([]); // "emi" inside a word, wrong case
  });
  it('respects word boundaries and links each term once', () => {
    expect(all('interest-free, then interest again; interesting')).toEqual(['Interest=interest']);
  });
  it('finds a term after an earlier unmatched one', () => {
    expect(all('Get Form 130 from HR')).toEqual(['Form 16 / Form 130=Form 130']);
  });
});
