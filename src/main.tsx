import { render } from 'preact';
import { App } from './app';
import './styles.css';
import { get } from './lib/store';

const s = get<{ theme?: string; size?: string }>('settings', 'ui') || {};
if (s.theme && s.theme !== 'auto') document.documentElement.dataset.theme = s.theme;
if (s.size) document.documentElement.dataset.size = s.size;

render(<App />, document.getElementById('app')!);
