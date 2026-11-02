import { describe, it, expect } from 'vitest';
import { newCard, review, isDue, addDays } from '../src/lib/srs';

describe('SM-2', () => {
  const d0 = '2026-01-01';
  it('good, good, good grows 1 → 6 → ~15 days', () => {
    let c = review(newCard(d0), 'good', d0);
    expect(c.interval).toBe(1);
    c = review(c, 'good', c.due);
    expect(c.interval).toBe(6);
    c = review(c, 'good', c.due);
    expect(c.interval).toBe(15);
    expect(c.due).toBe(addDays('2026-01-08', 15));
  });
  it('again resets and counts a lapse, ease never below 1.3', () => {
    let c = newCard(d0);
    for (let i = 0; i < 10; i++) c = review(c, 'again', d0);
    expect(c.reps).toBe(0);
    expect(c.lapses).toBe(10);
    expect(c.ease).toBeCloseTo(1.3, 5);
    expect(c.interval).toBe(1);
  });
  it('easy first review skips ahead', () => {
    expect(review(newCard(d0), 'easy', d0).interval).toBe(3);
  });
  it('due logic', () => {
    expect(isDue(undefined)).toBe(true);
    expect(isDue({ ...newCard(d0), due: '2026-01-05' }, '2026-01-04')).toBe(false);
    expect(isDue({ ...newCard(d0), due: '2026-01-05' }, '2026-01-05')).toBe(true);
  });
});
