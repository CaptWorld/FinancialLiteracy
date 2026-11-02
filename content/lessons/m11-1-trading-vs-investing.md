---
id: m11-trading-vs-investing
module: 11
order: 1
title: Trading vs investing — what SEBI's own data shows
summary: Why short-term trading is a different game from investing, what costs and leverage do to traders, and the numbers from SEBI's studies of Indian retail traders.
minutes: 12
reviewed_on: 2026-11-02
cheatsheet:
  - "Investing: owning businesses for years, earning from their growth. Trading: trying to profit from short-term price moves."
  - "Short-term trading is close to zero-sum before costs; after costs and taxes, most traders lose."
  - "SEBI found over 70% of individual intraday traders in equity cash lost money in FY23."
  - "SEBI found about 91% of individual F&O traders lost money in FY25, with net losses over ₹1 lakh crore that year (93% over FY22–FY24)."
  - "Costs per trade look tiny but compound with frequency: brokerage, STT, exchange charges, GST, stamp duty."
  - "Professionals (prop desks, algos, institutions) take the other side with better speed, data and capital."
cards:
  - q: Trading vs investing?
    a: Investing means owning businesses for years and earning from their growth. Trading means trying to profit from short-term price moves.
  - q: What did SEBI find about intraday traders in FY23?
    a: Over 70% of individual intraday traders in the equity cash segment made losses.
  - q: What share of individual F&O traders lost money in FY25, per SEBI?
    a: About 91%, with aggregate net losses of over ₹1 lakh crore in that year.
  - q: Why is short-term trading roughly zero-sum?
    a: Over short periods, one trader's gain is largely another's loss, since business growth barely matters in minutes or days. Costs make it negative-sum.
  - q: Who are retail traders up against?
    a: Proprietary trading firms, algorithmic traders and institutions with faster systems, better data and more capital.
quiz:
  - q: Arjun does 2 intraday round trips of ₹1 lakh each per trading day. If costs are about ₹82 per round trip, what are his yearly costs over 250 days?
    options: ["About ₹4,000", "About ₹20,000", "About ₹41,000", "About ₹1 lakh"]
    answer: 2
    why: 82 × 2 × 250 ≈ ₹41,000 a year, before any trading losses or taxes. He must earn that just to break even.
  - q: Over the long run, where do investors' returns from shares mainly come from?
    options: ["Out-trading others", "Business earnings growth and dividends", "Tips", "Luck only"]
    answer: 1
    why: Owners share in business growth. Traders are mostly redistributing money among themselves, minus costs.
  - q: A friend shows 3 months of trading profits and says "I've cracked it". What does SEBI's data suggest?
    options: ["He's in the top 1%", "A few good months are common; across years, most individual traders end up losing", "Trading always wins in bull markets", "Profits prove skill"]
    answer: 1
    why: Short winning streaks are normal randomness. Over longer periods, the large majority lose, especially after costs.
explain:
  prompt: Explain to a friend why most retail traders lose money even though markets go up over time.
  model: Markets rise over years because businesses grow, which benefits people who hold for years. Trading over minutes and days doesn't capture much of that. It's mostly traders swapping money with each other, including professionals with faster systems. Every trade has costs and taxes, so the group as a whole loses, and SEBI's studies show most individuals do.
deeper: [sebi, sebi-investor, nism]
---

:::hook
Trading apps show smiling people, "₹4,000 profit in 10 minutes" screenshots, and courses promising financial freedom. SEBI's own studies of millions of Indian traders tell a different story: **most individual traders lose money, year after year.**
:::

## Two different games

| | Investing | Short-term trading |
|---|---|---|
| Holding period | Years | Minutes to weeks |
| You earn from | Business growth, dividends | Price moves |
| Who's on the other side | Mostly other long-term holders | Often professionals and algorithms |
| Costs | Tiny (few transactions) | Large (many transactions) |
| Outcome for most people | Market-like returns | Losses |

Over minutes and days, a company's growth barely matters. Prices move on flows, news and noise. For every buyer who wins, a seller loses: **roughly zero-sum before costs, negative-sum after**.

## What SEBI found

- **Intraday (equity cash), FY23**: over **70%** of individual intraday traders made losses. Frequent traders were even more likely to lose.
- **F&O (futures and options), FY22–FY24**: about **93%** of individual traders lost money; aggregate losses were over ₹1.8 lakh crore across the three years.
- **F&O, FY25**: about **91%** lost money; net losses rose to **over ₹1 lakh crore** in that single year, even after SEBI's tighter rules cut participation.

:::checklive sebi
SEBI publishes these studies on its website. Check for any newer one.
:::

## Costs: the silent drain

:::example
Arjun tries intraday: 2 round trips a day of ₹1 lakh each. Costs per round trip (brokerage, STT, exchange charges, stamp duty, GST) come to roughly **₹82** at typical rates (illustrative; rates vary by broker).

- Per year: 82 × 2 × 250 days ≈ **₹41,000**

He must make ₹41,000 profit just to break even, and then pay tax on any gains. On ₹1 lakh of capital, that's a 41% hurdle.
:::

## Why individuals lose

1. **Costs** compound with frequency.
2. **Opponents**: prop desks and algorithms react in microseconds, with better data.
3. **Leverage** magnifies small mistakes (Lesson 2).
4. **Behaviour**: cutting winners early, holding losers, revenge trading, overconfidence after a lucky streak.

:::trap
"Trading courses", "mentorship", "copy my trades" and "algo bots with 90% accuracy" are often where the real money is made: from students, not markets. SEBI has acted against many unregistered finfluencers selling these. If someone truly had a reliable edge, selling courses wouldn't be their business.
:::

:::task
1. If you've ever traded, export your P&L report from your broker for the full period and calculate your net result after all charges. Write it in **Me → Notes**.
2. Read the summary of SEBI's latest F&O study (on SEBI's website). Note one finding that surprised you.
:::
