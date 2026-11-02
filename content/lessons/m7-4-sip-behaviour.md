---
id: m7-sip-behaviour
module: 7
order: 4
title: SIPs, lump sums, XIRR, and the behaviour that decides your returns
summary: How a SIP works, what rupee-cost averaging really does, how to measure your return properly, and why staying put matters more than picking the "best" fund.
minutes: 14
reviewed_on: 2026-11-02
cheatsheet:
  - "A SIP (Systematic Investment Plan) invests a fixed amount on a fixed date every month, automatically."
  - "Rupee-cost averaging: the same amount buys more units when NAV is low and fewer when it's high, so your average cost is usually a bit lower than the average NAV."
  - "A SIP doesn't guarantee profits. Its real power is habit and removing timing decisions."
  - "Step-up your SIP with each raise. A 10% yearly step-up can roughly double the final amount over 20 years."
  - "Measure SIP returns with XIRR, not 'total gain ÷ total invested'."
  - "Equity falls of 20–40% happen every few years. Stopping SIPs during falls is the costliest mistake."
cards:
  - q: What is a SIP?
    a: A Systematic Investment Plan, investing a fixed amount into a mutual fund on a fixed date each month via auto-debit.
  - q: What is rupee-cost averaging?
    a: Investing a fixed amount regularly buys more units when prices are low and fewer when high, usually lowering your average cost per unit.
  - q: Does a SIP guarantee you won't lose money?
    a: No. If the market is lower when you need the money, you can still have a loss. SIPs reduce timing risk; they don't remove market risk.
  - q: What's a step-up SIP?
    a: A SIP whose amount rises each year (e.g. by 10%), usually in line with salary hikes.
  - q: Why use XIRR for SIP returns?
    a: Each instalment is invested for a different length of time. XIRR gives the true yearly return considering every date and amount.
  - q: What is the "behaviour gap"?
    a: The difference between a fund's return and what investors actually earn, because they buy after rises and sell after falls.
quiz:
  - q: Arjun invests ₹6,000 a month for 3 months at NAVs ₹100, ₹80 and ₹125. What's his average cost per unit?
    options: ["₹101.67", "About ₹98.36", "₹80", "₹125"]
    answer: 1
    why: Units = 60 + 75 + 48 = 183. Average cost = 18,000 ÷ 183 ≈ ₹98.36, lower than the average NAV (₹101.67), because more units were bought at ₹80.
  - q: "₹5,000 a month for 20 years at 10% a year grows to about ₹38 lakh. If Arjun steps it up 10% every year instead, roughly what does he end with?"
    options: ["About ₹40 lakh", "About ₹55 lakh", "About ₹81 lakh", "About ₹2 crore"]
    answer: 2
    why: About ₹80.7 lakh (he also invests more, about ₹34 lakh in total vs ₹12 lakh). Step-ups matter a lot.
  - q: In March 2020 the Nifty 50 fell about 38% from its January high in weeks. What did SIP investors who kept going experience by the end of 2020?
    options: ["Permanent losses", "Their units bought cheap in the fall helped as the index recovered to new highs by year-end", "SIPs were frozen by SEBI", "No change at all"]
    answer: 1
    why: The index recovered to new highs within the year. Those who stopped or sold missed buying at low prices and the rebound.
explain:
  prompt: Explain to a friend why they shouldn't stop their SIP when the market falls 25%.
  model: When the market falls, your same SIP amount buys more units at lower prices. Those cheap units are what make returns good when the market recovers. If you stop or sell during the fall, you lock in the loss and miss the cheap buying. The fall only matters if you need the money now, and money needed soon shouldn't be in equity anyway.
deeper: [amfi, sebi-investor, freefincal]
---

:::hook
A fund can return 12% a year for a decade while many of its investors earn far less. They bought after it had risen, panicked during a fall, and sold near the bottom. **The fund's return and your return are not the same number.**
:::

## How a SIP works

You choose a fund, an amount and a date. Each month the money is auto-debited (a **mandate**, Module 0) and invested at that day's NAV. You get new units each time.

:::example
**Rupee-cost averaging**: Arjun invests ₹6,000 a month.

| Month | NAV | Units bought |
|---|---|---|
| 1 | ₹100 | 60 |
| 2 | ₹80 | 75 |
| 3 | ₹125 | 48 |
| **Total** | avg NAV ₹101.67 | **183 units for ₹18,000** |

Average cost per unit = 18,000 ÷ 183 = **₹98.36**, below the average NAV, because the fixed amount bought more units when the price was low.
:::

This is useful, but don't oversell it. If markets mostly rise, a lump sum invested early would often do better. **A SIP's real benefit is behavioural**: it invests from every salary without you deciding when, which is exactly what most people get wrong.

## Lump sum or SIP?

- Got a bonus or windfall for a **long-term** goal? Investing it all at once has historically done better more often, but feels worse if a fall follows. Splitting it over 6–12 months (an "STP" from a liquid fund) is a reasonable compromise for peace of mind.
- Monthly salary savings → **SIP**.

## Step it up

:::example
₹5,000 a month for 20 years at an assumed 10% a year:

- **Flat SIP**: invested ₹12 lakh → ≈ **₹38 lakh**
- **10% yearly step-up**: invested ≈ ₹34 lakh → ≈ **₹81 lakh**

Raise the SIP with every appraisal, before lifestyle quietly absorbs the raise. Try different numbers in **Tools → SIP & step-up**.
:::

## Measuring your return: XIRR

"I invested ₹1.2 lakh and it's worth ₹1.5 lakh, so 25% return" is wrong for a SIP: some instalments have been invested for years, others for weeks. **XIRR** gives the true yearly rate considering every date and amount. Your CAS and most apps show it. In a spreadsheet, list each SIP date as −amount, today's value as +amount, and use `=XIRR(values, dates)`.

## The behaviour that decides returns

Equity markets fall **20–40%** every few years. In **March 2020**, the Nifty 50 fell about **38%** from its January peak in a few weeks, then recovered to new highs by year-end.

What costs investors most:

- **Stopping SIPs or selling in a fall**: locks in losses and skips the cheapest buying.
- **Chasing last year's best fund or category**: buying high.
- **Checking the portfolio daily**: makes normal swings feel like emergencies.
- **Money needed soon kept in equity**: forces selling at the wrong time.

:::trap
Pausing just one year (year 2) of a 20-year ₹5,000 SIP costs about ₹3.8 lakh at the end, at an assumed 10%, because those missed instalments would have compounded for 18 more years. Don't pause SIPs because the news is scary. Pause only if your own cash flow needs it, and set a restart date.
:::

:::dive A rule that protects you from yourself
Write your **investment rules** before markets test you, e.g.: "SIP on the 5th, step up 10% each April, review once a year in April, never sell equity for goals more than 5 years away because of market news, move money to debt gradually in the 3 years before a goal." Then follow the note, not the headlines. Save it in **Me → Notes**.
:::

:::task
1. In **Tools → SIP & step-up**, try your own realistic monthly amount for 20 years, flat and with a 10% step-up.
2. Write your own 4–5 investment rules (see the deep dive) in **Me → Notes**.
3. If you already have SIPs, find their XIRR in your app or CAS.
:::
