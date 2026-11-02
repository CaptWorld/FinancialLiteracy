// SM-2 spaced repetition (SuperMemo 2), with four buttons mapped to quality scores.
export type Grade = 'again' | 'hard' | 'good' | 'easy';
const Q: Record<Grade, number> = { again: 1, hard: 3, good: 4, easy: 5 };

export interface CardState {
  ease: number;       // ease factor, starts at 2.5, never below 1.3
  interval: number;   // days until next review
  reps: number;       // successful reviews in a row
  lapses: number;     // times forgotten
  due: string;        // ISO date (YYYY-MM-DD)
  last?: string;      // ISO date of last review
  lastGrade?: Grade;
}

export const today = (d = new Date()) => d.toISOString().slice(0, 10);
export const addDays = (iso: string, n: number) => {
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

export function newCard(on = today()): CardState {
  return { ease: 2.5, interval: 0, reps: 0, lapses: 0, due: on };
}

export function review(s: CardState, grade: Grade, on = today()): CardState {
  const q = Q[grade];
  let { ease, interval, reps, lapses } = s;
  if (q < 3) {
    reps = 0;
    lapses += 1;
    interval = 1; // see it again tomorrow
  } else {
    reps += 1;
    if (reps === 1) interval = grade === 'easy' ? 3 : 1;
    else if (reps === 2) interval = grade === 'hard' ? 3 : 6;
    else interval = Math.round(interval * ease * (grade === 'hard' ? 0.8 : grade === 'easy' ? 1.3 : 1));
  }
  ease = Math.max(1.3, ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
  return { ease, interval, reps, lapses, due: addDays(on, interval), last: on, lastGrade: grade };
}

export const isDue = (s: CardState | undefined, on = today()) => !s || s.due <= on;
