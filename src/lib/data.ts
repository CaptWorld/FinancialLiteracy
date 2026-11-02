import { useMemo } from 'preact/hooks';
import { buildContent, type ContentBundle } from './content';
import { all, useStore } from './store';

let cache: { key: string; bundle: ContentBundle } | null = null;

/** All course content, with in-app edits applied. Rebuilt only when edits change. */
export function useContent(): ContentBundle {
  useStore();
  const overrides = all<string>('overrides');
  const key = JSON.stringify(overrides);
  return useMemo(() => {
    if (!cache || cache.key !== key) cache = { key, bundle: buildContent(overrides) };
    return cache.bundle;
  }, [key]);
}

export const inr = (n: number, digits = 0) =>
  isFinite(n) ? '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: digits, minimumFractionDigits: 0 }) : '—';

/** Short Indian format: ₹1.2 L, ₹3.4 Cr. */
export const inrShort = (n: number) => {
  if (!isFinite(n)) return '—';
  const a = Math.abs(n);
  if (a >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (a >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`;
  return inr(n);
};

export async function copyText(text: string): Promise<boolean> {
  try { await navigator.clipboard.writeText(text); return true; } catch {
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta); ta.select();
    const ok = document.execCommand('copy'); ta.remove(); return ok;
  }
}

export function download(name: string, text: string, type = 'text/plain') {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type }));
  a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
