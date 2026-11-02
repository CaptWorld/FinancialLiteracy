import { useEffect, useState } from 'preact/hooks';
import { useRoute } from './lib/router';
import { syncNow, syncInfo, useStore } from './lib/store';
import { Search } from './components/Search';
import { Today } from './pages/Today';
import { Learn } from './pages/Learn';
import { Practice } from './pages/Practice';
import { Tools } from './pages/Tools';
import { Library } from './pages/Library';
import { Me } from './pages/Me';

const NAV: [string, string, string][] = [
  ['today', 'Today', '☀︎'], ['learn', 'Learn', '📖'], ['practice', 'Practice', '🧠'],
  ['tools', 'Tools', '🧮'], ['library', 'Library', '📚'], ['me', 'Me', '👤']
];

const SYNC_TEXT: Record<string, string> = {
  idle: 'Synced', syncing: 'Syncing…', offline: 'Offline', locked: 'Locked', error: 'Not synced', 'not-configured': 'Sync off'
};

export function App() {
  const route = useRoute();
  useStore();
  const [searching, setSearching] = useState(false);
  useEffect(() => { void syncNow(); }, []);
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !(e.target as HTMLElement).matches('input,textarea'))) { e.preventDefault(); setSearching(true); } };
    addEventListener('keydown', k);
    return () => removeEventListener('keydown', k);
  }, []);

  const [section, ...rest] = route;
  const { status } = syncInfo();
  const Page = { today: Today, learn: Learn, practice: Practice, tools: Tools, library: Library, me: Me }[section] || Today;

  return (
    <div class="app">
      <nav class="nav" aria-label="Main">
        {NAV.map(([to, label, ico]) => (
          <a href={'#/' + to} class={section === to ? 'active' : ''} aria-current={section === to ? 'page' : undefined}>
            <span class="ico" aria-hidden="true">{ico}</span>{label}
          </a>
        ))}
      </nav>
      <div class="main-col">
        <header class="topbar">
          <a class="brand" href="#/today"><span class="logo">₹</span>Paisa Sense</a>
          <span class="spacer" />
          <a href="#/me/settings" title="Saved on this device; tap for sync settings" class={`sync ${status === 'idle' || status === 'syncing' ? '' : 'bad'}`}>{SYNC_TEXT[status]}</a>
          <button class="iconbtn" onClick={() => setSearching(true)} aria-label="Search">🔍<span class="hide-narrow"> Search</span></button>
        </header>
        <main><Page path={rest} /></main>
      </div>
      {searching && <Search onClose={() => setSearching(false)} />}
    </div>
  );
}
