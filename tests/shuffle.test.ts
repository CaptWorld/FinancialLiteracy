import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { stableOrder } from '../src/lib/shuffle';
import { splitFrontmatter } from '../src/lib/content';

describe('stableOrder', () => {
  it('is a stable permutation', () => {
    for (const n of [2, 3, 4, 5]) {
      const o = stableOrder('q-' + n, n);
      expect([...o].sort()).toEqual([...Array(n).keys()]);
      expect(stableOrder('q-' + n, n)).toEqual(o);
    }
  });
  it('spreads correct answers across positions in the real quizzes', () => {
    const dir = new URL('../content/lessons/', import.meta.url);
    const pos = [0, 0, 0, 0];
    for (const f of readdirSync(dir)) {
      const { meta } = splitFrontmatter(readFileSync(new URL(f, dir), 'utf8'));
      (meta.quiz || []).forEach((q: any, i: number) => {
        const shown = stableOrder(`${meta.id}#q${i + 1}`, q.options.length).indexOf(q.answer);
        pos[shown]++;
      });
    }
    const total = pos.reduce((a, b) => a + b, 0);
    // No single position should hold more than half of all correct answers.
    for (const p of pos) expect(p / total).toBeLessThan(0.5);
  });
});
