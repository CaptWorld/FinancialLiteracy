---
id: m1-compounding
module: 1
order: 2
title: Compounding, interest and returns
summary: Growth on top of growth. Time matters more than amount, and "interest" is not the same as "returns".
minutes: 13
reviewed_on: 2026-11-02
cheatsheet:
  - Simple interest pays only on what you put in. Compound interest also pays on past interest.
  - "Compounding needs time. The last years add the most money."
  - "Starting 5 years earlier often beats investing more later."
  - "Interest = a promised rate (FD, loan). Returns = whatever the investment actually did (can be negative)."
  - "Compounding frequency matters: 12% compounded monthly ≈ 12.68% a year (effective rate)."
  - "Compounding also works against you: credit card debt compounds at very high rates."
  - Past returns are not promises. Plan with conservative numbers and test lower ones too.
cards:
  - q: Simple vs compound interest?
    a: Simple pays only on the original amount. Compound pays on the original amount plus all interest earned so far.
  - q: Why do the last years of a long investment add the most money?
    a: Growth is a percentage of a bigger and bigger balance, so each year's growth is larger than the year before.
  - q: What's the difference between interest and returns?
    a: Interest is a promised, fixed rate (FD, loan). Returns are what a market investment actually earned, which varies and can be negative.
  - q: What is an effective annual rate?
    a: The true yearly rate after compounding within the year. E.g. 12% compounded monthly ≈ 12.68% a year.
  - q: How does compounding hurt you?
    a: Debt compounds too. Unpaid credit card balances grow on top of unpaid interest at very high rates.
  - q: ₹1 lakh at 10% a year for 10 years, compounded yearly, becomes about?
    a: About ₹2.59 lakh (1.1^10 ≈ 2.594).
quiz:
  - q: Asha invests ₹5,000/month from age 25 to 35, then stops. Ravi invests ₹5,000/month from 35 to 60. At similar returns, who often ends up with more at 60?
    options: ["Ravi, he invested 25 years", "Asha can come close or beat him because her money compounds for longer", "Always exactly equal", "Neither grows"]
    answer: 1
    why: Asha's money compounds for 35 years. Early money gets the most doubling periods. Try it in Tools → SIP to see the exact numbers at your chosen return.
  - q: A fund returned 25% last year. What does that tell you about next year?
    options: ["It will return about 25%", "Very little — one year's return is mostly noise", "It will fall 25%", "It's guaranteed to beat FDs"]
    answer: 1
    why: Short-term returns are noisy. Judge funds on costs, long periods and consistency, never on last year.
  - q: Two FDs both say 7.2%. One compounds quarterly, one yearly. Which pays more?
    options: ["Quarterly", "Yearly", "Same", "Can't tell"]
    answer: 0
    why: More frequent compounding means interest starts earning interest sooner, so the effective rate is slightly higher.
explain:
  prompt: In your own words, explain why starting early matters more than investing a big amount later.
  model: Compounding means each year's growth is added to the balance and then grows too. Money invested early goes through more of these growth cycles, so it can grow many times over. Money added late has only a few cycles. That's why small amounts started early can rival much bigger amounts started late.
deeper: [varsity, freefincal, yt-freefincal, sebi-investor, yt-nism]
---

:::hook
Put ₹1 lakh somewhere that grows 10% a year. After 10 years you have about ₹2.6 lakh. After 20 years, about ₹6.7 lakh. After 30, about ₹17.4 lakh. Same rate, same ₹1 lakh. **The last 10 years added more than the first 20 combined.** That's compounding.
:::

## Simple vs compound

- **Simple interest**: ₹1 lakh at 10% earns ₹10,000 every year. After 10 years: ₹2 lakh.
- **Compound interest**: year 1 earns ₹10,000. Year 2 earns 10% of ₹1.1 lakh = ₹11,000. Year 3 earns ₹12,100. After 10 years: about **₹2.59 lakh**.

The difference grows with time. Over 30 years: ₹4 lakh (simple) vs ₹17.4 lakh (compound).

## Time beats amount

Because growth stacks on growth, **when** you start matters a lot. Five extra years at the beginning are worth more than five extra years at the end. That's why it's worth starting your ₹1–2k SIP now rather than waiting for "a bigger salary". The habit and the time both compound.

:::note
This is also why your plan to *step up* your investment as your salary grows is sound. You get the early start and the bigger amounts later.
:::

## Interest vs returns (people mix these up constantly)

| | Interest | Returns |
|---|---|---|
| Examples | FD, savings account, loan | Mutual funds, stocks, gold |
| Promised? | Yes, a fixed rate | No |
| Can it be negative? | No (for deposits) | Yes, in some years |
| What you control | Which bank, how long | Costs, time, behaviour |

When someone says a fund "gives 12%", that's a past *return*, not a promise. Equity investments have had years of −20% or worse. Over long periods, Indian equity has beaten inflation, but the path is bumpy.

:::trap
Calculators that show "₹1 crore in 20 years at 15%" are using an assumed number. Always test a lower one (say 8–10% for equity, and something near inflation) to see if your plan still works. If it only works at 15%, it's not a plan.
:::

## Compounding frequency and effective rate

12% "per year" compounded monthly is really 1% a month, which grows to about **12.68%** over a year. Banks quote FDs with different compounding (often quarterly). Credit cards quote a *monthly* rate, which compounds into a very high yearly rate. Tools → Compound & inflation shows the effective rate for any frequency.

## Compounding against you

Debt compounds too. An unpaid credit card balance grows on top of the unpaid interest. A loan app charging "just 3% a month" is roughly 36% a year before fees, and much more if it compounds. You'll compute this in Practice → Scenarios.

:::example
₹50,000 credit card balance, you pay only the minimum due. At a typical credit card rate of a few percent a month, the interest each month is charged on a balance that barely shrinks. It can take years to clear and cost more than the original purchase. (Check your own card's rate in its "Most Important Terms and Conditions" document.)
:::

:::task
1. Open **Tools → SIP**. Enter ₹2,000/month, 10 years, at a cautious 10% return. Note the final value.
2. Change only the years to 20. How much more did 10 extra years add?
3. Now try 20 years at 7%. Does your plan still look OK at a lower return?
4. Add a flashcard-worthy insight to **Me → Notes**.
:::
