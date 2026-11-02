# Paisa Sense — notes for future Claude sessions

## Who this is for
- 27, software engineer in Hyderabad, lives alone; family in Tirupati. Complete beginner: explain every term before using it.
- Wants broad, practical financial literacy for India. Learns by doing (tasks on own documents), reading, practice problems, long videos.
- Starting small (₹1–2k/month), increasing over time with evidence-backed rules. No chasing quick returns.
- Side goal: understand and eventually help with family money (dad manages MFs, insurance, rent income, home loan).
- Treat their brief as a starting point, not a literal spec. Improve on it.
- Level: truly from zero (didn't know what a savings account or a credit card was). Reading one term used to send them down a rabbit hole, which is why lessons have tap-a-word popups and Module 0 exists.
- Wants breadth: personal money plus the economy, how businesses work, and money history. Medium-length lessons with optional "Go deeper" boxes. About 30 minutes a day. English only.

## Long-term goal to keep in mind (the "self-funding" thread)
They want recurring extras to eventually be paid for by investment income instead of salary. For example: their Claude Pro subscription and regular charitable giving.
- Built into the app: **Tools → Self-funding** (corpus needed = yearly cost ÷ withdrawal rate they choose; progress tracker; also shown on Today).
- Covered in Module 13, Lesson 4 (`m13-self-funding`) and touched in MF (7), instruments (8), stocks/dividends (10), taxes (12), retirement and withdrawal rates (16).
- Be honest: "passive" income needs a large corpus built from savings over years. Trading is not passive income. Withdrawal-rate and dividend-yield numbers are assumptions; show several and say what can go wrong (bad years early, inflation, taxes, the subscription price rising).

## Teaching rules (from their brief)
- Plain language, Indian examples, primary sources (RBI, SEBI, AMFI, IRDAI, Income Tax Dept, EPFO, PIB, NSE/BSE, SPIVA India). Be honest, not encouraging. No stock tips.
- Never hardcode things that change (slabs, rates, limits). Use `:::checklive <link-id>` blocks pointing at official pages.
- Verify every link before adding (curl, the browser via `npm run check-links`, or a web fetcher when the sandbox is blocked). Never guess URLs.
- No AI features inside the app. Never store account numbers, PAN, Aadhaar, passwords.
- Ask before moving on when teaching live. (All modules 0–17 were drafted in one go in Nov 2026 at the learner's explicit request; revise them as feedback comes in.)

## Facts already checked (Nov 2026)
- Income-tax Act, 2025 in force from 1 April 2026: Form 16 → Form 130, Form 26AS → Form 168, "tax year" term.
- Four Labour Codes in force from 21 Nov 2025: wages ≥ 50% of remuneration for PF/gratuity; fixed-term gratuity after 1 year.
- EPF partial withdrawals simplified Oct 2025: three categories, 25% minimum balance.
- Impostor "SEBI" channels exist on YouTube; link regulators' socials only from their official sites.
- New-regime slabs for tax year 2026-27 unchanged by Budget 2026 (nil to ₹4L … 30% above ₹24L; ₹12L rebate; ₹75k standard deduction). Old 80C → s.123, 80D → s.126, 87A → s.156.
- Equity STCG 20% (≤12 months), LTCG 12.5% above ₹1.25L/yr; debt MFs bought from 1 Apr 2023 taxed at slab.
- RBI: KFS + APR mandatory for retail loans (Oct 2024); penal charges, not penal interest (Jan 2024); fixed-rate switch at reset now optional for lenders (Oct 2025); no prepayment charges on individuals' non-business floating loans (directions for loans from 1 Jan 2026); property documents back within 30 days or ₹5,000/day.
- Inflation target 4% (2–6%) renewed for 2026–2031. CPI base 2024 and GDP base 2022-23 since Feb 2026. FY27 fiscal deficit target 4.3% of GDP.
- IRDAI: moratorium 5 years, PED wait ≤ 3 years, cashless decision 1 hour / discharge 3 hours, free-look 30 days. Individual life/health premiums GST-free from 22 Sep 2025 (group still 18%).
- SPIVA India (to 30 Jun 2026): 10-yr underperformance 74% large-cap, 80% ELSS, 82% mid/small-cap.
- SEBI MF rules from 1 Apr 2026: base expense ratio shown separately from levies. SEBI F&O studies: 93% lost (FY22–24), 91% lost FY25 (> ₹1 lakh crore); >70% intraday traders lost (FY23).
- Small savings Oct–Dec 2026: PPF 7.1%, NSC 7.7%, SCSS 8.2%, KVP 7.5%, MIS 7.4%. No new SGBs since Feb 2024. SEBI cautioned on unregulated digital gold (Nov 2025). NPS exit rules overhauled Dec 2025 (check PFRDA).
- Nomination: banks up to 4 nominees from 1 Nov 2025; MF/demat up to 10. Supreme Court (2023): nominee of shares isn't the owner over legal heirs.

## Start of every session
1. Run `npm run progress` to see where the learner is (lessons done, what they keep forgetting, open gap-log terms, notes, snapshot, self-funding progress). Use it to pick what to teach or review next.
2. If they ask about a term in their gap log, explain it and offer to add it to `content/glossary.yaml` and flashcards to the relevant lesson.
3. If "Lessons edited in the app" shows anything, offer to copy those edits into `content/lessons/` (read them with `npx wrangler d1 execute paisa-sense --remote --json --command "SELECT data FROM items WHERE collection='overrides' AND id='<id>'"`).

## Content conventions
- Examples follow **Arjun** (fictional, like the learner): 27, software tester in Hyderabad, renting; take-home ₹65,000/month, gross ₹9.6 lakh (nil tax in new regime), essential spend ≈ ₹48,000/month, bike loan ₹1.5L at 11% (EMI ₹3,877), EPF ≈ ₹3L, sends ₹8,000 home, two bank accounts. Priya (₹18L salary) is the higher-income comparison. Deccan Chai Ltd is the fictional company in Module 9. Keep numbers consistent and recompute any you change.
- Lesson blocks: `:::hook`, `:::note Title`, `:::example`, `:::trap`, `:::task`, `:::checklive <link-id>`, `:::dive Title` (fold-away deep dive).
- Glossary entries power the tap-a-word popups: `term`, `def` (1–2 lines), optional `more`, `aliases`, `lesson`. Only list real synonyms in brackets ("NAV (Net Asset Value)"), never "Margin (trading)", because the bracketed part becomes a match on its own (a test enforces this). A word can mean different things in different modules (EPS); the popup picks the meaning by module.
- Header values containing ": " must be quoted. `npm run fix-yaml` fixes them; `npm test` names the file if one breaks.
- Quiz/scenario options are shown in a stable shuffled order, so the answer index can be anything.

## Making changes
- Edit content in `content/`, run `npm test`, then `npm run deploy`. Commit and push.
- Deploying needs Cloudflare access: either `npx wrangler login` once on this machine, or a `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` environment variable.
- Never print or commit the password or tokens.

## Project
- Live: https://paisa-sense.vardhanlokesh3.workers.dev (Cloudflare Worker + D1 `paisa-sense`). Whole app behind a password login (secret `APP_PASSWORD`, signed HttpOnly cookie, 5 wrong tries → 15-min wait per network). See README → Login.
- Content in `content/`; `npm test` validates it. See README for structure and deploy.
- Status (Nov 2026): 18 modules (0–17), 72 lessons, ~430 glossary terms, ~50 problems, ~30 scenarios. Next: improve lessons from the learner's feedback and gap log, add more practice problems, keep checklive facts current.
