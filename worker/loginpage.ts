// The sign-in page. Plain HTML form (no JavaScript needed) so password managers and every phone browser handle it.

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export type LoginMessage =
  | { kind: 'error'; text: string }
  | { kind: 'info'; text: string }
  | null;

export function loginPage(message: LoginMessage = null, opts: { disabled?: boolean } = {}): string {
  const msg = message ? `<p class="msg ${message.kind}" role="${message.kind === 'error' ? 'alert' : 'status'}">${esc(message.text)}</p>` : '';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#0f766e">
<title>Sign in · Paisa Sense</title>
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="apple-touch-icon" href="/icon-192.png">
<style>
  :root { --bg:#f6f7f5; --surface:#fff; --text:#17201d; --muted:#5b6863; --line:#dde3df; --accent:#0f766e; --accent-ink:#fff; --bad:#b42318; --bad-soft:#fde8e6; --info-soft:#d6efe9; color-scheme: light dark; }
  @media (prefers-color-scheme: dark) { :root { --bg:#0d1412; --surface:#141d1a; --text:#e6ece9; --muted:#9aa8a2; --line:#26332e; --accent:#2dd4bf; --accent-ink:#062521; --bad:#ffb4ab; --bad-soft:#3b1714; --info-soft:#123a34; } }
  * { box-sizing: border-box; }
  body { margin:0; min-height:100vh; min-height:100dvh; display:grid; place-items:center; padding:24px 16px; background:var(--bg); color:var(--text);
         font: 17px/1.5 system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", sans-serif; }
  main { width:100%; max-width:380px; }
  .brand { display:flex; align-items:center; gap:.6rem; font-weight:700; font-size:1.25rem; margin-bottom:1.4rem; }
  .logo { width:2.2rem; height:2.2rem; border-radius:.6rem; background:var(--accent); color:var(--accent-ink); display:grid; place-items:center; font-size:1.2rem; }
  form { background:var(--surface); border:1px solid var(--line); border-radius:16px; padding:1.4rem; }
  h1 { font-size:1.15rem; margin:0 0 .2rem; }
  .sub { margin:0 0 1.1rem; color:var(--muted); font-size:.92rem; }
  label { display:block; font-weight:600; font-size:.92rem; margin-bottom:.35rem; }
  input[type=password] { width:100%; font:inherit; padding:.7rem .8rem; border-radius:12px; border:1px solid var(--line); background:var(--bg); color:var(--text); min-height:48px; }
  input[type=password]:focus { outline:3px solid var(--accent); outline-offset:1px; border-color:transparent; }
  .show { display:flex; align-items:center; gap:.45rem; margin:.6rem 0 1.1rem; font-weight:400; color:var(--muted); font-size:.9rem; }
  .show input { width:1.1rem; height:1.1rem; accent-color:var(--accent); }
  button { width:100%; font:inherit; font-weight:600; min-height:48px; border-radius:12px; border:0; background:var(--accent); color:var(--accent-ink); cursor:pointer; }
  button:disabled { opacity:.5; cursor:not-allowed; }
  .msg { margin:0 0 1rem; padding:.65rem .8rem; border-radius:10px; font-size:.92rem; }
  .msg.error { background:var(--bad-soft); color:var(--bad); }
  .msg.info { background:var(--info-soft); }
  .foot { color:var(--muted); font-size:.8rem; text-align:center; margin-top:1rem; }
  .hidden { position:absolute; left:-9999px; width:1px; height:1px; overflow:hidden; }
</style>
</head>
<body>
<main>
  <div class="brand"><span class="logo" aria-hidden="true">₹</span>Paisa Sense</div>
  <form method="post" action="/login">
    <h1>Sign in</h1>
    <p class="sub">Your private finance course and notes.</p>
    ${msg}
    <input class="hidden" type="text" name="username" value="paisa-sense" autocomplete="username" tabindex="-1" aria-hidden="true">
    <label for="pw">Password</label>
    <input id="pw" name="password" type="password" autocomplete="current-password" required autofocus ${opts.disabled ? 'disabled' : ''}>
    <label class="show"><input type="checkbox" onclick="document.getElementById('pw').type=this.checked?'text':'password'"> Show password</label>
    <button type="submit" ${opts.disabled ? 'disabled' : ''}>Sign in</button>
  </form>
  <p class="foot">You stay signed in on this device for ${90} days.</p>
</main>
</body>
</html>`;
}
