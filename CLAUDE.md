# Paisa Sense — notes for future Claude sessions

## Who this is for
- 27, software engineer in Hyderabad, lives alone; family in Tirupati. Complete beginner: explain every term before using it.
- Wants broad, practical financial literacy for India. Learns by doing (tasks on own documents), reading, practice problems, long videos.
- Starting small (₹1–2k/month), increasing over time with evidence-backed rules. No chasing quick returns.
- Side goal: understand and eventually help with family money (dad manages MFs, insurance, rent income, home loan).
- Treat their brief as a starting point, not a literal spec. Improve on it.

## Long-term goal to keep in mind (the "self-funding" thread)
They want recurring extras to eventually be paid for by investment income instead of salary. For example: their Claude Pro subscription and regular charitable giving.
- Built into the app: **Tools → Self-funding** (corpus needed = yearly cost ÷ withdrawal rate they choose; progress tracker; also shown on Today).
- Weave it into future modules where relevant: MF (Module 6), other instruments/dividends/REITs/bonds (7), stocks and dividends (8), taxes on withdrawals/dividends/capital gains (10), goals (11), withdrawal rates and sequence risk (12/13).
- Be honest: "passive" income needs a large corpus built from savings over years. Trading is not passive income. Withdrawal-rate and dividend-yield numbers are assumptions; show several and say what can go wrong (bad years early, inflation, taxes, the subscription price rising).

## Teaching rules (from their brief)
- Plain language, Indian examples, primary sources (RBI, SEBI, AMFI, IRDAI, Income Tax Dept, EPFO, PIB, NSE/BSE, SPIVA India). Be honest, not encouraging. No stock tips.
- Never hardcode things that change (slabs, rates, limits). Use `:::checklive <link-id>` blocks pointing at official pages.
- Verify every link before adding (curl, the browser via `npm run check-links`, or a web fetcher when the sandbox is blocked). Never guess URLs.
- No AI features inside the app. Never store account numbers, PAN, Aadhaar, passwords.
- Ask before moving to the next module.

## Facts already checked (Nov 2026)
- Income-tax Act, 2025 in force from 1 April 2026: Form 16 → Form 130, Form 26AS → Form 168, "tax year" term.
- Four Labour Codes in force from 21 Nov 2025: wages ≥ 50% of remuneration for PF/gratuity; fixed-term gratuity after 1 year.
- EPF partial withdrawals simplified Oct 2025: three categories, 25% minimum balance.
- Impostor "SEBI" channels exist on YouTube; link regulators' socials only from their official sites.

## Start of every session
1. Run `npm run progress` to see where the learner is (lessons done, what they keep forgetting, open gap-log terms, notes, snapshot, self-funding progress). Use it to pick what to teach or review next.
2. If they ask about a term in their gap log, explain it and offer to add it to `content/glossary.yaml` and flashcards to the relevant lesson.
3. If "Lessons edited in the app" shows anything, offer to copy those edits into `content/lessons/` (read them with `npx wrangler d1 execute paisa-sense --remote --json --command "SELECT data FROM items WHERE collection='overrides' AND id='<id>'"`).

## Making changes
- Edit content in `content/`, run `npm test`, then `npm run deploy`. Commit and push.
- Deploying needs Cloudflare access: either `npx wrangler login` once on this machine, or a `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` environment variable.
- Never print or commit the password or tokens.

## Project
- Live: https://paisa-sense.vardhanlokesh3.workers.dev (Cloudflare Worker + D1 `paisa-sense`). Whole app behind a password login (secret `APP_PASSWORD`, signed HttpOnly cookie, 5 wrong tries → 15-min wait per network). See README → Login.
- Content in `content/`; `npm test` validates it. See README for structure and deploy.
- Status: Modules 1–3 done. Next: Module 4 (loans in depth), then insurance, mutual funds, resources/research toolkit.
