# Paisa Sense

A personal, practical course in Indian personal finance, plus an app to read, practise and remember it. Runs on one Cloudflare Worker with a D1 database. Works offline as an installable app (PWA). The whole app is behind a password login. No AI inside, no tips, no ads.

**Live:** https://paisa-sense.vardhanlokesh3.workers.dev

## What's in it

- **Today**: due reviews, next lesson, your Money Snapshot alerts, a "most people never learn this" item, learning ladder.
- **Learn**: lessons that start with a real situation and end with a task on your own money. Each has a cheat sheet, flashcards, a 3-question quiz, "explain it back", and checked links to go deeper.
- **Practice**: spaced-repetition review (SM-2), worked problems, real-life scenarios, recently forgotten.
- **Tools**: compound & inflation, EMI (flat vs reducing, prepayment), loan comparison (true APR with fees), SIP & step-up (with cost comparison and low-return check), goal planner, monthly budget. You type every number.
- **Library**: glossary, official sources, resources (with bias notes), how to verify a claim, copy-ready prompts for an external AI tool.
- **Me**: Money Snapshot, things people never learn, goals, notes (with cross-check prompt), gap log, ladder, link health, content editor, settings.

## Rules the content follows

- Anything that changes (tax slabs, rates, limits) is **not** written down. Lessons use `:::checklive` blocks that link to the official page and say where to look.
- Every lesson and link has a reviewed/verified date. Lessons older than 12 months show "Check before trusting" automatically.
- Every link was opened before adding it. The Worker re-checks all links every Monday 03:00 UTC; see **Me → Link health**.
- No sensitive data: the app never asks for account numbers, PAN, Aadhaar or passwords, and warns if notes look like they contain them.

## Content

All text lives in `content/`:

| File | What |
|---|---|
| `lessons/*.md` | Lessons. YAML header (id, module, cards, quiz, cheatsheet, explain, deeper links) + Markdown with `:::hook`, `:::task`, `:::trap`, `:::example`, `:::note`, `:::checklive <link-id>` blocks |
| `links.yaml` | Every external link, with why/bias/verified date |
| `modules.yaml`, `glossary.yaml`, `problems.yaml`, `scenarios.yaml`, `blindspots.yaml`, `prompts.yaml` | Other course content |
| `pages/*.md` | Guides (e.g. how to verify a claim) |

You can also edit lessons in the app (**Me → Edit content**). Edits save to D1 and sync across devices; **Download** gives you the file to commit.

`npm test` validates all content (every link id exists, quiz answers are valid, blocks are closed).

## Run and deploy

```bash
npm install
npm test                 # calculators, SM-2, content checks
npm run build
npx wrangler deploy      # deploys app + API + weekly cron
```

First-time setup (already done for the live app):

```bash
npx wrangler d1 create paisa-sense          # put the id in wrangler.jsonc
npm run db:migrate                          # create tables
npx wrangler secret put APP_PASSWORD        # your login password (12+ characters)
```

Local dev: put `APP_PASSWORD=some-long-test-password` in `.dev.vars`, run `npx wrangler d1 migrations apply paisa-sense --local`, then `npm run build && npx wrangler dev`.

## Working on it from your own computer (Cowork or Claude Code)

```bash
git clone https://github.com/CaptWorld/FinancialLiteracy
cd FinancialLiteracy
npm install
npx wrangler login        # once; opens the browser to log in to Cloudflare
npm run progress          # your learning progress, read from the live app
```

Needs Node.js 20+ installed. `CLAUDE.md` tells any Claude session about you, the teaching rules and what's next.

## Login

Everything (lessons, tools, your data, even the JavaScript) needs you to sign in. Only the sign-in page, app icons and install manifest are public.

**Set or change the password** (12+ characters; a passphrase of 4–5 random words is easy to type on a phone):

```bash
npx wrangler secret put APP_PASSWORD
```

It takes effect in a few seconds, no deploy needed. Changing it signs out every device.

How it works:
- Signing in sets a signed, HttpOnly cookie (JavaScript can't read it). You stay signed in for 90 days; it renews itself while you keep using the app.
- 5 wrong passwords from one network → that network waits 15 minutes. Locked yourself out? `npx wrangler d1 execute paisa-sense --remote --command "DELETE FROM login_attempts"`
- Forms and data changes from other websites are refused.
- **Me → Settings → Account** has *Sign out* and *Sign out and clear this device* (removes your notes, progress and offline copy from that device; your synced data stays on the server).
- The app keeps a copy of your data on each device for offline use, so lock your phone.

The old secret name `APP_PASSCODE` still works as a fallback. Once `APP_PASSWORD` is set, remove it: `npx wrangler secret delete APP_PASSCODE`.

### Optional: Cloudflare Access instead

If you'd rather log in with a one-time PIN sent to your email, Cloudflare Access can replace the password:

1. Cloudflare dashboard → **Zero Trust**. If asked, pick a team name and the **Free** plan.
2. Dashboard → **Workers & Pages → paisa-sense → Settings → Domains & Routes**. Next to the `workers.dev` route, turn on **Cloudflare Access**.
3. Open the Access application it created (Zero Trust → Access → Applications). Set the policy to **Allow → Emails → your email**. Login method: **One-time PIN**.
4. Copy the application's **Audience (AUD) tag**, and note your team domain (`<team>.cloudflareaccess.com`).
5. In `wrangler.jsonc`, set `ACCESS_TEAM_DOMAIN` and `ACCESS_AUD`, then `npx wrangler deploy`. The app then trusts only Access and the password login is switched off.

## Code map

- `src/lib/calc/` – pure money maths (tested in `tests/calc.test.ts`)
- `src/lib/srs.ts` – SM-2 scheduler
- `src/lib/store.ts` – offline-first storage, syncs to D1 (last write wins per item)
- `src/lib/content.ts` – content loader and Markdown block renderer
- `worker/` – login (`auth.ts`, `loginpage.ts`), API (`/api/sync`, `/api/links`), weekly link checker
- `migrations/` – D1 schema

Educational only. Not financial advice.
