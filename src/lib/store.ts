// Offline-first personal state. Everything is saved to localStorage instantly and synced to D1
// in the background (last write wins per item), so phone and laptop see the same progress.
import { useEffect, useState } from 'preact/hooks';

export type Collection = 'srs' | 'quiz' | 'snapshot' | 'goals' | 'notes' | 'gaps' | 'overrides' | 'settings' | 'progress' | 'explain' | 'budget';
interface Item<T = any> { data: T; updated: number; deleted?: boolean }
type Coll = Record<string, Item>;

const LS = 'ps:v1:';
const state: Record<string, Coll> = {};
const dirty: Record<string, Set<string>> = {};
const listeners = new Set<() => void>();
let version = 0;

const safeGet = (k: string) => { try { return localStorage.getItem(k); } catch { return null; } };
const safeSet = (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* storage full or blocked */ } };

function coll(name: string): Coll {
  if (!state[name]) {
    const raw = safeGet(LS + name);
    try { state[name] = raw ? JSON.parse(raw) : {}; } catch { state[name] = {}; }
  }
  return state[name];
}
function persist(name: string) { safeSet(LS + name, JSON.stringify(state[name])); }
function emit() { version++; listeners.forEach((f) => f()); }

/** Monotonic timestamp so two quick writes never share the same `updated`. */
let lastTs = 0;
const stamp = () => (lastTs = Math.max(Date.now(), lastTs + 1));

export function get<T = any>(c: Collection, id: string): T | undefined {
  const it = coll(c)[id];
  return it && !it.deleted ? (it.data as T) : undefined;
}
export function all<T = any>(c: Collection): Record<string, T> {
  const out: Record<string, T> = {};
  for (const [id, it] of Object.entries(coll(c))) if (!it.deleted) out[id] = it.data;
  return out;
}
export function put<T>(c: Collection, id: string, data: T) {
  coll(c)[id] = { data, updated: stamp() };
  (dirty[c] ||= new Set()).add(id);
  persist(c); saveDirty(); emit(); scheduleSync();
}
export function remove(c: Collection, id: string) {
  const it = coll(c)[id];
  if (!it) return;
  coll(c)[id] = { data: null, updated: stamp(), deleted: true };
  (dirty[c] ||= new Set()).add(id);
  persist(c); saveDirty(); emit(); scheduleSync();
}

/** Re-render a component whenever stored state changes. */
export function useStore(): number {
  const [, set] = useState(0);
  useEffect(() => { const f = () => set(version); listeners.add(f); return () => { listeners.delete(f); }; }, []);
  return version;
}

// ---------- sync ----------
export type SyncStatus = 'idle' | 'syncing' | 'offline' | 'locked' | 'error' | 'not-configured';
let status: SyncStatus = 'idle';
let lastSync = Number(safeGet(LS + '_lastPull') || 0);
export const syncInfo = () => ({ status, lastSync });

function saveDirty() {
  safeSet(LS + '_dirty', JSON.stringify(Object.fromEntries(Object.entries(dirty).map(([k, v]) => [k, [...v]]))));
}
(function loadDirty() {
  try {
    const d = JSON.parse(safeGet(LS + '_dirty') || '{}');
    for (const [k, v] of Object.entries(d)) dirty[k] = new Set(v as string[]);
  } catch { /* ignore */ }
})();

export const getPasscode = () => safeGet(LS + '_passcode') || '';
export const setPasscode = (p: string) => { safeSet(LS + '_passcode', p); void syncNow(); };

function headers(): HeadersInit {
  const h: Record<string, string> = { 'content-type': 'application/json' };
  const p = getPasscode();
  if (p) h['x-passcode'] = p;
  return h;
}

let timer: ReturnType<typeof setTimeout> | undefined;
function scheduleSync() { clearTimeout(timer); timer = setTimeout(() => void syncNow(), 1500); }

let running = false;
export async function syncNow(): Promise<SyncStatus> {
  if (running) return status;
  running = true;
  status = 'syncing'; emit();
  try {
    // push local changes
    const items: any[] = [];
    for (const [c, ids] of Object.entries(dirty)) for (const id of ids) {
      const it = coll(c)[id];
      if (it) items.push({ collection: c, id, data: it.data, updated: it.updated, deleted: !!it.deleted });
    }
    if (items.length) {
      const r = await fetch('/api/sync', { method: 'POST', headers: headers(), body: JSON.stringify({ items }) });
      if (!r.ok) throw r;
      for (const it of items) dirty[it.collection]?.delete(it.id);
      saveDirty();
    }
    // pull remote changes
    const r = await fetch(`/api/sync?since=${lastSync}`, { headers: headers() });
    if (!r.ok) throw r;
    const body = (await r.json()) as { now: number; items: any[] };
    const touched = new Set<string>();
    for (const it of body.items) {
      const local = coll(it.collection)[it.id];
      if (!local || it.updated > local.updated) {
        coll(it.collection)[it.id] = { data: it.data, updated: it.updated, deleted: it.deleted };
        touched.add(it.collection);
      }
      lastSync = Math.max(lastSync, it.updated);
    }
    touched.forEach(persist);
    safeSet(LS + '_lastPull', String(lastSync));
    status = 'idle';
  } catch (e: any) {
    if (e instanceof Response) status = e.status === 401 ? 'locked' : e.status === 503 ? 'not-configured' : 'error';
    else status = navigator.onLine === false ? 'offline' : 'error';
  } finally {
    running = false;
    emit();
  }
  return status;
}

export function exportAll(): string {
  const names: Collection[] = ['srs', 'quiz', 'snapshot', 'goals', 'notes', 'gaps', 'overrides', 'settings', 'progress', 'explain', 'budget'];
  return JSON.stringify(Object.fromEntries(names.map((n) => [n, all(n)])), null, 2);
}

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => void syncNow());
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') void syncNow(); });
}
