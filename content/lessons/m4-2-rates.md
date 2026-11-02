---
id: m4-rates
module: 4
order: 2
title: Fixed vs floating rates, repo-linked loans and what happens at a reset
summary: Why your home loan rate moves when RBI changes the repo rate, and why "tenure extended" can quietly cost lakhs.
minutes: 13
reviewed_on: 2026-11-02
cheatsheet:
  - "Fixed rate: stays the same for the agreed period. Floating rate: moves with a benchmark."
  - "Bank floating-rate retail loans are linked to an external benchmark, usually RBI's repo rate. Your rate = benchmark + spread."
  - "When rates rise, banks often extend your tenure instead of raising the EMI. That can add years and lakhs of interest."
  - "At a reset, ask for your options: higher EMI, longer tenure, a mix, or prepaying. Some lenders also offer switching to fixed."
  - "Your credit score affects the spread you're offered. A better score = a lower rate for years."
  - "If your rate is well above what new borrowers get, ask your bank for a lower spread or consider a balance transfer."
cards:
  - q: Fixed vs floating interest rate?
    a: Fixed stays the same for the agreed period. Floating changes with a benchmark such as the repo rate.
  - q: What is the "spread" on a repo-linked loan?
    a: The margin the bank adds on top of the benchmark. Your rate = benchmark + spread.
  - q: When rates rise, what do banks often do by default with floating loans?
    a: Extend the tenure to keep the EMI the same. You pay much more interest overall.
  - q: What's a balance transfer?
    a: Moving your outstanding loan to another lender offering a lower rate. Worth it only if savings beat the fees.
  - q: How often must banks reset repo-linked retail loans?
    a: At least once every three months, so RBI's changes reach your rate fairly quickly.
quiz:
  - q: Arjun's ₹40 lakh, 20-year home loan is at 8.5%. After a year, the rate rises to 9.5%. The bank keeps his EMI at ₹34,713. Roughly how much longer will he be paying?
    options: ["A month or two", "About a year", "About 4–5 years", "No change"]
    answer: 2
    why: Keeping the EMI fixed at a higher rate stretches the remaining 19 years to about 23.75 years, around 57 extra months.
  - q: "In that case, which choice costs less interest overall: raise the EMI to about ₹37,200, or keep EMI and extend tenure?"
    options: ["Extend tenure", "Raise EMI", "Both cost the same", "Depends on inflation only"]
    answer: 1
    why: Raising the EMI keeps the end date, costing about ₹48.98 lakh in total interest. Extending tenure costs about ₹63 lakh.
  - q: A new customer gets 8.25% at your bank while your loan is still at 9.4%. What's a sensible first step?
    options: ["Do nothing", "Ask your bank to reduce your spread (there may be a small fee), then compare a balance transfer", "Stop paying EMIs", "Take a top-up loan"]
    answer: 1
    why: Banks often reprice existing loans on request. If they won't, a balance transfer can make sense once you count fees and paperwork.
explain:
  prompt: Explain what happens to a floating-rate home loan when RBI raises the repo rate, and what the borrower should do.
  model: The bank's rate is the repo rate plus a spread, so when repo rises, the loan rate goes up at the next reset. To keep the EMI the same, the bank usually stretches the tenure, which adds lots of interest. The borrower should check the new tenure, and if they can afford it, choose a higher EMI or prepay so the loan doesn't drag on for years longer.
deeper: [rbi-notifications, rbi-faqs, cibil]
---

:::hook
In 2022–23, RBI raised the repo rate several times. Many home-loan borrowers didn't notice anything, because their EMI didn't change. What changed was the **end date**: some loans grew by years. **No EMI change doesn't mean no cost.**
:::

## Fixed vs floating

- **Fixed rate**: the same rate for the agreed period. It's predictable. Many "fixed" home loans are fixed only for a few years before turning floating. Car and personal loans are often truly fixed.
- **Floating rate**: moves with a **benchmark**. Most home loans are floating.

## Repo-linked loans

For banks, floating-rate retail loans must be linked to an **external benchmark**, usually RBI's **repo rate**. Your rate is:

**Loan rate = benchmark (e.g. repo) + spread**

- The **spread** is the bank's margin. It depends partly on your **credit score** and the loan type. A lower spread saves you money every month for the whole loan.
- The bank resets the rate **at least every three months**, so RBI's cuts and hikes reach you fairly quickly.
- NBFCs and housing finance companies may use their own benchmark, which moves less transparently.

:::checklive rbi
Find the current repo rate on RBI's home page. Your loan statement shows your benchmark and spread.
:::

## At a reset: your choices

:::example
Arjun's ₹40 lakh home loan: 20 years at 8.5%, EMI ₹34,713. After a year he owes about ₹39.2 lakh, and the rate goes to **9.5%**.

| Option | EMI | Loan ends | Total interest (whole loan) |
|---|---|---|---|
| Rate had stayed 8.5% | ₹34,713 | Year 20 | ₹43.3 lakh |
| **Keep EMI, extend tenure** | ₹34,713 | ~Year 24¾ | **~₹63.0 lakh** |
| **Raise EMI, keep end date** | ~₹37,198 | Year 20 | **~₹49.0 lakh** |

Extending the tenure costs about **₹14 lakh more** than raising the EMI by ₹2,500 a month.
:::

RBI's rules on resetting floating rates require lenders to tell you what's happening and to let you choose: **raise the EMI, extend the tenure, a mix of both, or prepay**. A tenure extension must not make your loan grow ("negative amortisation"). Some lenders also offer a switch to a fixed rate, depending on their policy.

:::trap
Banks default to extending the tenure because it's painless today. Check your loan statement after every rate change for the **remaining tenure**. If it has jumped, ask for a higher EMI instead or prepay a lump sum.
:::

:::dive Why your credit score is worth lakhs
On a ₹40 lakh, 20-year loan, a spread just **0.5% lower** cuts the EMI by about ₹1,250, roughly ₹15,000 a year and about ₹3 lakh over the loan. Lenders price that spread largely on your credit score. Paying every card bill and EMI on time for years before you need a home loan is one of the highest-return habits you can build.
:::

## Balance transfers and repricing

- **Repricing / spread reduction**: ask your own bank to lower your spread to what new customers get. There may be a small fee.
- **Balance transfer**: another lender pays off your loan and you continue with them at a lower rate. Count processing fees, legal and valuation charges, and stamp duty before deciding.

:::task
1. If you have a floating-rate loan, find on its statement: benchmark, spread, current rate and remaining tenure.
2. Compare the remaining tenure with what you originally signed. Has it grown?
3. If you have no loan, open **Tools → EMI** and redo Arjun's example with a rate 1% higher, keeping the EMI fixed. How many months does it add?
:::
