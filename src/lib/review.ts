// Builds the review queue: flashcards from finished lessons, plus quiz questions you got wrong.
import type { ContentBundle, Card, QuizQ } from './content';
import { type CardState, type Grade, newCard, review, today, isDue } from './srs';
import { all, get, put } from './store';

export type ReviewItem = { kind: 'card'; item: Card } | { kind: 'quiz'; item: QuizQ };

export function lessonDone(id: string) { return !!get('progress', id); }

export function markLessonDone(c: ContentBundle, lessonId: string) {
  put('progress', lessonId, { done: today() });
  const l = c.lessons.find((x) => x.id === lessonId);
  for (const card of l?.cards || []) if (!get('srs', card.id)) put('srs', card.id, newCard());
}

/** Wrong quiz answers enter spaced review; right ones push a queued question further out. */
export function recordQuiz(q: QuizQ, correct: boolean) {
  put('quiz', `${q.id}@${Date.now()}`, { q: q.id, correct, on: today() });
  const s = get<CardState>('srs', q.id);
  if (!correct) put('srs', q.id, review(s || newCard(), 'again'));
  else if (s) put('srs', q.id, review(s, 'good'));
}

export function gradeItem(id: string, g: Grade) {
  put('srs', id, review(get<CardState>('srs', id) || newCard(), g));
}

function lookup(c: ContentBundle) {
  const map = new Map<string, ReviewItem>();
  for (const l of c.lessons) {
    l.cards.forEach((x) => map.set(x.id, { kind: 'card', item: x }));
    l.quiz.forEach((x) => map.set(x.id, { kind: 'quiz', item: x }));
  }
  return map;
}

export function dueItems(c: ContentBundle, on = today()): ReviewItem[] {
  const map = lookup(c);
  const states = all<CardState>('srs');
  return Object.entries(states)
    .filter(([id, s]) => map.has(id) && isDue(s, on))
    .sort((a, b) => a[1].due.localeCompare(b[1].due))
    .map(([id]) => map.get(id)!);
}

export function forgotten(c: ContentBundle, days = 21): { item: ReviewItem; state: CardState }[] {
  const map = lookup(c);
  const cutoff = new Date(Date.now() - days * 864e5).toISOString().slice(0, 10);
  return Object.entries(all<CardState>('srs'))
    .filter(([id, s]) => map.has(id) && s.lapses > 0 && (s.last || '') >= cutoff)
    .sort((a, b) => b[1].lapses - a[1].lapses || (b[1].last || '').localeCompare(a[1].last || ''))
    .map(([id, state]) => ({ item: map.get(id)!, state }));
}

export function upcoming(days = 7): number[] {
  const out = Array(days).fill(0);
  const t = today();
  for (const s of Object.values(all<CardState>('srs'))) {
    const diff = Math.round((new Date(s.due).getTime() - new Date(t).getTime()) / 864e5);
    if (diff >= 0 && diff < days) out[diff]++;
    else if (diff < 0) out[0]++;
  }
  return out;
}
