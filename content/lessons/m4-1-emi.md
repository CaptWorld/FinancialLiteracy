---
id: m4-emi
module: 4
order: 1
title: How an EMI really works (and why long loans cost so much)
summary: Each EMI pays this month's interest first, then a bit of principal. Tenure and "flat rates" change the total cost far more than people expect.
minutes: 14
reviewed_on: 2026-11-02
cheatsheet:
  - "Each month, interest = outstanding principal × (annual rate ÷ 12). The rest of the EMI reduces the principal."
  - "Early EMIs are mostly interest; later ones are mostly principal. That's why prepaying early saves the most."
  - "Longer tenure → smaller EMI → much more total interest. Choose the shortest tenure you can comfortably afford."
  - "A 'flat rate' charges interest on the original amount for the whole loan. 10% flat ≈ 18% reducing. Always ask for the reducing-balance rate."
  - "Total cost = EMI × number of months + fees. Compare loans on total cost and APR, not EMI."
cards:
  - q: How is the interest part of an EMI calculated each month?
    a: Outstanding principal × (annual rate ÷ 12). Whatever is left of the EMI goes to reducing the principal.
  - q: Why are early EMIs mostly interest?
    a: Because the outstanding principal is largest at the start, so the monthly interest on it is largest.
  - q: What does a longer tenure do to your EMI and total interest?
    a: The EMI goes down, but the total interest goes up a lot because you borrow for longer.
  - q: Flat rate vs reducing-balance rate?
    a: Flat charges interest on the original loan amount all through. Reducing charges interest only on what you still owe. A flat rate is roughly 1.8× its reducing equivalent.
  - q: What is an amortisation schedule?
    a: The month-by-month table showing how each EMI splits into interest and principal, and the balance left after each.
quiz:
  - q: Arjun's ₹3 lakh personal loan at 13% can be for 3 years (EMI ₹10,108) or 5 years (EMI ₹6,826). Roughly how much MORE interest does the 5-year option cost?
    options: ["About ₹5,000", "About ₹20,000", "About ₹46,000", "The same, the rate is the same"]
    answer: 2
    why: 3 years ≈ ₹63,900 interest; 5 years ≈ ₹1,09,600. The lower EMI costs about ₹45,700 more.
  - q: A dealer offers a ₹1 lakh loan at "10% flat" for 2 years. What's the approximate reducing-balance rate?
    options: ["10%", "12%", "About 18%", "About 25%"]
    answer: 2
    why: Flat interest = ₹20,000 on the full ₹1 lakh even though you repay monthly. EMI ₹5,000 for 24 months works out to about 18.2% on a reducing balance.
  - q: In the first EMI of a ₹40 lakh home loan at 8.5% (EMI ₹34,713), how much goes to interest?
    options: ["About ₹6,400", "About ₹17,000", "About ₹28,300", "All of it"]
    answer: 2
    why: 40,00,000 × 8.5% ÷ 12 ≈ ₹28,333 interest. Only about ₹6,380 reduces the principal in month 1.
explain:
  prompt: Explain to a friend why choosing a 5-year loan "because the EMI is smaller" can be a costly decision.
  model: A smaller EMI just means you're spreading the repayment over more months, and you pay interest every one of those months on whatever you still owe. So the total interest grows a lot. It's better to pick the shortest tenure whose EMI still fits comfortably in your budget.
deeper: [rbi-faqs, varsity]
---

:::hook
"Only ₹6,826 a month!" sounds better than "₹10,108 a month". On the same ₹3 lakh loan at the same 13%, the cheaper-looking EMI costs **₹45,700 more** in the end. The EMI is the number lenders want you to look at. **The total is the number that matters.**
:::

## What's inside one EMI

An **EMI** stays the same every month, but what it pays for changes:

1. **Interest for the month** = outstanding principal × annual rate ÷ 12
2. **Principal repaid** = EMI − that interest

As the principal shrinks, each month's interest shrinks, so more of the same EMI goes to principal.

:::example
Arjun takes a ₹40,00,000 home loan at 8.5% for 20 years. EMI: **₹34,713**.

- Month 1 interest: 40,00,000 × 8.5% ÷ 12 = **₹28,333**
- Month 1 principal: 34,713 − 28,333 = **₹6,380**

After a whole year of EMIs (₹4.17 lakh paid), he still owes about **₹39.2 lakh**. Over 20 years he pays about **₹43.3 lakh in interest**, more than the loan itself.
:::

Open **Tools → EMI** and enter these numbers to see the full month-by-month table, called an **amortisation schedule**.

## Tenure: the hidden lever

| ₹3,00,000 at 13% | EMI | Total interest |
|---|---|---|
| 3 years | ₹10,108 | ₹63,895 |
| 5 years | ₹6,826 | ₹1,09,555 |

A longer tenure lowers the EMI but **increases the total cost**, because you're borrowing more money for more months. Rule of thumb: **pick the shortest tenure whose EMI fits your budget comfortably**, then prepay when you can.

## The "flat rate" trick

Some dealers, small lenders and gold-loan or two-wheeler offers quote a **flat rate**. It charges interest on the **original** amount for the whole loan, even though you're repaying every month.

- ₹1,00,000 at **10% flat** for 2 years → interest ₹20,000 → EMI ₹5,000
- The same EMI on a normal reducing balance is about **18.2%**

:::trap
"Only 1% a month", "10% flat", "₹99 per day per ₹10,000". All of these hide the real rate. Ask: **"What is the reducing-balance rate, and what's the APR in the Key Facts Statement?"** Lesson 3 of this module shows how to read that statement.
:::

:::dive The EMI formula, if you're curious
EMI = P × r × (1 + r)ⁿ ÷ ((1 + r)ⁿ − 1)

- P = principal
- r = monthly rate (annual % ÷ 12 ÷ 100)
- n = number of months

It comes from asking: "what fixed monthly payment makes the present value of all payments equal to the loan?" That's the same compounding from Module 1, run backwards. You don't need to memorise it; the EMI tool does it. But it shows why the rate and **n** both matter so much: they sit inside an exponent.
:::

:::task
1. If you have any loan (bike, phone EMI, education), find its rate, tenure and outstanding principal in the lender's app. Note them in **Me → Notes** (no loan numbers).
2. Put it in **Tools → EMI** and look at the amortisation table. How much of your next EMI is interest?
3. If you have no loan: work out what a ₹1 lakh phone or laptop "EMI" at 16% for 12 months would cost in total.
:::
