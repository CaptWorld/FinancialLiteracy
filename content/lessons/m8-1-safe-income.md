---
id: m8-safe-income
module: 8
order: 1
title: FDs, post office schemes and other "safe" options — what's actually safe
summary: Bank FDs, small savings schemes (NSC, KVP, SCSS, MIS, Sukanya), RBI bonds and corporate FDs. Who backs each, how they're taxed, and where they fit.
minutes: 13
reviewed_on: 2026-11-02
cheatsheet:
  - "Safety depends on who owes you: the Government of India (small savings, G-secs) > banks (DICGC cover up to a limit) > companies (corporate FDs/bonds, no insurance)."
  - "Small savings rates (PPF, NSC, SCSS…) are reset every quarter by the government. Oct–Dec 2026: PPF 7.1%, NSC 7.7%, SCSS 8.2%."
  - "Most of this interest is taxable at your slab (PPF and Sukanya are the main exceptions). After tax, many 'safe' returns barely beat inflation."
  - "Safe options are for emergency money, near-term goals and the stable part of long-term money, not for beating inflation by a wide margin."
  - "Corporate/NBFC FDs pay more because they're riskier. Check the credit rating; never put a large share in one company."
  - "SCSS and post office MIS suit parents/retirees who need regular income."
cards:
  - q: Rank by safety, lowest default risk first, Government small savings, bank FD, corporate FD.
    a: Government small savings (sovereign), then bank FD (DICGC-insured up to a limit), then corporate FD (no insurance, depends on the company).
  - q: How often do small savings scheme rates change?
    a: The government reviews them every quarter.
  - q: What is SCSS?
    a: Senior Citizens' Savings Scheme. A 5-year government scheme for those 60+ (some early retirees from 55) paying quarterly interest. Good for parents.
  - q: What is NSC?
    a: National Savings Certificate. A 5-year post office deposit with interest compounded yearly and paid at maturity; interest is taxable.
  - q: Why do corporate FDs pay more than bank FDs?
    a: They carry more risk. There's no deposit insurance, and repayment depends on the company's health.
  - q: Is FD interest taxable?
    a: Yes, at your income-tax slab. Banks may also deduct TDS above a yearly threshold.
quiz:
  - q: Arjun's parents (dad is 61) want regular, safe income from ₹10 lakh of retirement savings. Which fits well?
    options: ["Small-cap fund", "Senior Citizens' Savings Scheme (SCSS), possibly with a bank FD", "Crypto", "A corporate FD paying 11%"]
    answer: 1
    why: SCSS is government-backed and pays quarterly interest, suited to retirees. It's taxable, so compare post-tax income with FDs.
  - q: An NBFC offers a 3-year FD at 9.5% while banks offer 7%. What's the honest view?
    options: ["Free extra 2.5%", "The extra is payment for extra risk: no DICGC cover; check its rating and keep exposure small", "It's guaranteed by RBI", "Same as a bank"]
    answer: 1
    why: Higher rate = higher risk. NBFC deposits are not covered by DICGC. Several NBFCs and cooperative banks have failed in the past.
  - q: Arjun is in a high tax slab. A bank FD pays 7%. Roughly what does he keep after tax at a 30% slab (ignoring cess)?
    options: ["7%", "About 4.9%", "About 2%", "10%"]
    answer: 1
    why: 7% × (1 − 0.30) = 4.9%. With inflation around 4–5%, the real return is close to zero.
explain:
  prompt: Explain to your parents why a 9–10% FD from a little-known company isn't "just a better FD".
  model: A bank FD is insured up to a limit and banks are closely watched by RBI. A company FD has no such insurance. The higher rate is what the company pays because lending to it is riskier. If the company runs into trouble, the money can be stuck or lost. It's safer to stay with banks and government schemes, and if you do use a company FD, keep it small and choose highly rated ones.
deeper: [indiapost-savings, dicgc, rbi]
---

:::hook
Arjun's uncle put most of his retirement money in a cooperative bank paying "1.5% more than SBI". When RBI restricted withdrawals at that bank, the family could take out only a small sum for months. **"Safe" depends on who owes you the money, not on the word "fixed".**
:::

## Who owes you: the safety ladder

| Option | Who owes you | Protection | Typical use |
|---|---|---|---|
| **Small savings** (PPF, NSC, KVP, SCSS, MIS, Sukanya, post office TD/RD) | Government of India | Sovereign | Long-term safe money; parents' income |
| **G-secs, T-bills, RBI Floating Rate Savings Bonds** | Government of India | Sovereign | Safe fixed income (Lesson 5) |
| **Bank FDs / RDs** | The bank | DICGC insurance up to a limit per bank | Emergency fund, near-term goals |
| **Corporate / NBFC FDs, corporate bonds** | A company | **None**; depends on the company | Small part, only highly rated |

## Small savings schemes

Run through post offices and many banks, with rates **reset every quarter** by the government. For **October–December 2026** they were unchanged, for example:

| Scheme | Rate (Oct–Dec 2026) | Key feature |
|---|---|---|
| **PPF** | 7.1% | 15-year, tax-free interest (Lesson 2) |
| **NSC** | 7.7% | 5-year, interest taxable, paid at maturity |
| **KVP** | 7.5% | Money doubles in a fixed period (115 months at this rate) |
| **SCSS** | 8.2% | For 60+; quarterly interest; 5 years |
| **Post Office MIS** | 7.4% | Monthly income; 5 years |
| **Sukanya Samriddhi** | 8.2% | For a girl child's future; tax-free |

:::checklive indiapost-savings
Rates change quarterly. Check the current ones before investing.
:::

## Taxes change the picture

Interest from FDs, RDs, NSC, KVP, SCSS and MIS is **added to your income and taxed at your slab**. PPF and Sukanya interest is tax-free.

:::example
At a 30% slab (ignoring cess), a 7% FD leaves **4.9%** after tax. With inflation around 4–5%, that's roughly **zero real return**. Fine for safety and near-term goals; poor for building long-term wealth (Module 1, Lesson 1).
:::

## Corporate and NBFC FDs

They pay more because they're **riskier**: no DICGC cover, repayment depends entirely on the company. If you use them at all:

- Only **highly rated** ones (look for AAA/AA ratings from CRISIL, ICRA, CARE, India Ratings)
- **Small amounts**, spread across issuers
- Never "because a relative/agent recommended it"

:::trap
"Guaranteed 12% monthly income" schemes from chit funds, cooperatives you've never heard of, or "investment clubs" are how many families lose savings. Check the entity on RBI's **Sachet** portal. Remember the rule from Module 0: **high return and safety don't come together.**
:::

:::dive RBI Floating Rate Savings Bonds
A 7-year government bond whose rate is reset every six months, set a fixed margin above the NSC rate. Interest is paid half-yearly and is taxable; it can't be traded or encashed early (except for senior citizens after a lock-in). It's a sovereign option for parents who want regular income and can lock money for 7 years. Check the current rate on RBI's site.
:::

:::task
1. Note the current PPF, NSC and SCSS rates (with the quarter) from India Post's page.
2. If your parents hold FDs or deposits, list (with them) where each is: government scheme, bank, cooperative bank, or company.
3. For any deposit above the DICGC limit in one bank, or with a company, discuss whether to spread it out.
:::
