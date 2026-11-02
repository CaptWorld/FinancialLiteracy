---
id: m1-inflation
module: 1
order: 1
title: Inflation — why safe money quietly shrinks
summary: Prices rise every year. Money that grows slower than prices loses value, even if the number goes up.
minutes: 12
reviewed_on: 2026-11-02
cheatsheet:
  - Inflation = how fast prices rise in general. India's official measure is CPI, published monthly by MoSPI.
  - "Real return = what your money grows by after inflation. Roughly: interest rate − inflation rate."
  - "Money growing slower than inflation loses buying power even though the balance goes up."
  - "Your personal inflation can be higher than CPI (rent, school fees, healthcare often rise faster)."
  - "Rule of 72: 72 ÷ inflation % ≈ years for prices to double. At 6%, about 12 years."
  - Cash for emergencies is fine. Long-term savings sitting in a low-interest account is the problem.
cards:
  - q: What is inflation, in one line?
    a: The general rise in prices over time, so the same rupee buys less each year.
  - q: Where do you find India's official inflation number?
    a: CPI (Consumer Price Index) from MoSPI's National Statistics Office, released monthly. Use CPI (Combined) for the headline rate.
  - q: What is a real return?
    a: Your return after inflation. Approximately interest/return % minus inflation %. Exact form is (1+r)/(1+i) − 1.
  - q: Your savings account pays 3% and inflation is 6%. What's happening to your money?
    a: It's losing about 3% of buying power a year, even though the balance grows.
  - q: Using the rule of 72, how long until prices double at 8% inflation?
    a: About 9 years (72 ÷ 8).
  - q: Why might your personal inflation be higher than CPI?
    a: Your spending mix differs. Rent, education, healthcare and eating out often rise faster than the CPI average.
quiz:
  - q: An FD pays 7% a year. Inflation is 6%. Roughly what is your real return?
    options: ["13%", "7%", "About 1%", "−1%"]
    answer: 2
    why: Real return ≈ 7 − 6 = 1% (exact ≈ 0.94%). And that's before tax on FD interest, which can push it to zero or below.
  - q: Which is the official source for India's inflation rate?
    options: ["RBI repo rate page", "MoSPI's CPI release", "Your bank's website", "A finance YouTube channel"]
    answer: 1
    why: CPI is compiled and released by MoSPI's National Statistics Office. RBI targets inflation but doesn't publish CPI.
  - q: You keep ₹2 lakh for emergencies in a savings account. Is inflation a reason to move it all into stocks?
    options: ["Yes, cash always loses", "No — emergency money must be safe and instantly available; accept a small real loss on it", "Yes, but only half", "No, savings accounts beat inflation"]
    answer: 1
    why: Emergency money's job is safety and access, not growth. Inflation matters for money you won't need for years.
explain:
  prompt: Explain to your dad, in 3–4 sentences, why ₹10 lakh kept in a savings account for 15 years is not "safe".
  model: Prices rise every year. If inflation is around 6% and the account pays around 3%, the money loses about 3% of buying power each year. Over 15 years, prices roughly double or more, so the ₹10 lakh plus interest buys much less than ₹10 lakh does today. The rupee number looks safe, but what it can buy shrinks.
deeper: [cpi, rbi-fin-edu, ncfe]
---

:::hook
In 2011 a plate of idli-vada at a Tirupati hotel might have cost ₹20. Today it costs a lot more. The idli didn't get bigger. **Your rupee got smaller.** That shrinking is inflation, and it's the single most important reason money can't just sit still.
:::

## What inflation actually is

Inflation is the *average* rise in prices of the things households buy: food, rent, fuel, school fees, medicines. If inflation is 6% this year, something that cost ₹100 last year costs about ₹106 now.

India measures it with the **Consumer Price Index (CPI)**. The National Statistics Office (under MoSPI) tracks prices in over a thousand villages and markets every month and combines them into one number. RBI's job is to keep that number within a target band, which is why you hear about inflation every time RBI changes interest rates.

:::checklive cpi
Open the CPI page and find the latest **CPI (Combined)** year-on-year inflation for all India. Write it down with the month. That's the number to use in calculations, not a figure from a news headline or from this app.
:::

## The two numbers that matter: nominal vs real

- **Nominal return**: the number your bank or fund shows. "7% FD."
- **Real return**: what you gain in *buying power* after inflation.

Quick estimate: **real ≈ nominal − inflation**. Exact: (1 + nominal) ÷ (1 + inflation) − 1.

:::example
You put ₹1,00,000 in an FD at 7% for a year. Inflation that year is 6%.

- Balance after a year: ₹1,07,000
- What ₹1,07,000 buys, in last year's prices: 1,07,000 ÷ 1.06 ≈ **₹1,00,943**

So you gained about ₹943 of real buying power, under 1%. FD interest is also taxed at your slab rate, so after tax your real return may be zero or negative.
:::

## Why this changes how you save

1. **Short-term money** (emergencies, next few months of expenses): keep it safe and accessible. Losing a little to inflation is the price of safety. That's fine.
2. **Long-term money** (5+ years away): it *must* aim to beat inflation, or you're slowly getting poorer. This is why long-term money usually goes into things like equity mutual funds, which have historically beaten inflation over long periods but swing a lot in the short term. You'll learn that in Module 6.

:::trap
"My money is safe in the bank, it never goes down." The number never goes down. The buying power does. Don't confuse the two.
:::

## Your personal inflation

CPI is an average across the country. Your own spending may rise faster: rent in Hyderabad, health insurance premiums, your parents' medical costs. When you plan a goal (Module 11), it's honest to assume a *higher* inflation for things like education and healthcare.

## Rule of 72

72 ÷ rate ≈ years to double. It works for prices (inflation) and for investments.

- At 6% inflation, prices double in about **12 years**.
- At 8%, about **9 years**.

So a ₹50,000/month lifestyle today could need about ₹1,00,000/month in 12 years. That's why retirement numbers look huge.

:::task
1. Open the CPI page and note the latest CPI (Combined) inflation and its month.
2. Open your savings account app and find its current interest rate.
3. Use **Tools → Compound & inflation** to see what ₹1 lakh in that account is worth in today's money after 10 years.
4. Write one line in **Me → Notes**: "My savings account real return is about ___%."
:::
