import type { ComponentChildren } from 'preact';
import { useState } from 'preact/hooks';
import { copyText } from '../lib/data';
import { isStale, monthsSince } from '../lib/content';

let toastTimer: any;
export function toast(msg: string) {
  let el = document.querySelector('.toast') as HTMLDivElement | null;
  if (!el) { el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
  el.textContent = msg;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el?.remove(), 2200);
}

export function Reviewed({ on }: { on: string }) {
  if (!on) return <span class="pill warn">No review date</span>;
  const stale = isStale(on);
  const m = Math.floor(monthsSince(on));
  return (
    <span class={`pill ${stale ? 'warn' : 'ok'}`} title={stale ? 'Over 12 months old: check official sources before trusting' : 'Reviewed recently'}>
      {stale ? `⚠ Check before trusting · reviewed ${on}` : `Reviewed ${on}${m >= 1 ? ` · ${m} mo ago` : ''}`}
    </span>
  );
}

export function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  return <button class="btn sm quiet" onClick={async () => toast((await copyText(text)) ? 'Copied' : 'Copy failed')}>{label}</button>;
}

export function Num({ label, value, onInput, step, suffix, min = 0 }: { label: string; value: number | undefined; onInput: (n: number | undefined) => void; step?: number; suffix?: string; min?: number }) {
  return (
    <label class="field">
      <span>{label}{suffix ? ` (${suffix})` : ''}</span>
      <input type="number" inputMode="decimal" min={min} step={step ?? 'any'} value={value ?? ''}
        onInput={(e) => { const v = (e.target as HTMLInputElement).value; onInput(v === '' ? undefined : Number(v)); }} />
    </label>
  );
}

export function Seg<T extends string>({ label, value, options, onChange }: { label: string; value: T | undefined; options: [T, string][]; onChange: (v: T) => void }) {
  return (
    <div class="field" style="margin:.8rem 0">
      <div class="small muted" style="margin-bottom:.3rem">{label}</div>
      <div class="seg" role="radiogroup" aria-label={label}>
        {options.map(([v, t]) => <button type="button" role="radio" aria-checked={value === v} class={value === v ? 'on' : ''} onClick={() => onChange(v)}>{t}</button>)}
      </div>
    </div>
  );
}

export function Tabs({ items, active }: { items: [string, string][]; active: string }) {
  return <nav class="tabs" aria-label="Sections">{items.map(([to, t]) => <a href={'#/' + to} class={active === to ? 'active' : ''}>{t}</a>)}</nav>;
}

export function Card({ children, title }: { children: ComponentChildren; title?: string }) {
  return <section class="card">{title && <h2>{title}</h2>}{children}</section>;
}

export function Reveal({ label, children }: { label: string; children: ComponentChildren }) {
  const [open, setOpen] = useState(false);
  return open ? <div>{children}</div> : <button class="btn ghost sm" onClick={() => setOpen(true)}>{label}</button>;
}

export const SENSITIVE_WARNING = 'Never type account numbers, PAN, Aadhaar, card numbers, policy/loan numbers or passwords here. Keep real documents elsewhere.';

/** Rough check for things that look like sensitive identifiers. */
export function looksSensitive(s: string): string | null {
  if (/\b[A-Z]{5}\d{4}[A-Z]\b/i.test(s)) return 'This looks like a PAN.';
  if (/\b\d{4}\s?\d{4}\s?\d{4}\b/.test(s)) return 'This looks like an Aadhaar or card number.';
  if (/\b\d{9,18}\b/.test(s)) return 'This looks like an account or policy number.';
  return null;
}
