---
id: m11-fo-explained
module: 11
order: 2
title: Futures and options, explained honestly
summary: What derivatives are, how leverage works in futures, how call and put options work, why most option buyers lose, and what SEBI changed in 2024.
minutes: 15
reviewed_on: 2026-11-02
cheatsheet:
  - "A derivative's value comes from something else, like a share or an index. F&O = futures and options."
  - "Futures: an agreement to buy/sell at a set price on a future date. You put up only margin, so a small price move is a big % of your money (leverage)."
  - "Options: the right, not obligation, to buy (call) or sell (put) at a strike price before expiry. Buyers pay a premium; sellers collect it."
  - "Options lose value as expiry nears (time decay). Most cheap 'lottery-ticket' options expire worthless."
  - "SEBI's late-2024 rules raised contract sizes, allowed only one weekly expiry per exchange, and required upfront premium collection, to curb speculation."
  - "Legitimate use: hedging an existing portfolio. For a beginner, the honest default is: don't trade F&O."
cards:
  - q: What is a derivative?
    a: A contract whose value depends on an underlying asset like a share, an index or a commodity.
  - q: What is leverage in futures?
    a: Controlling a large position with a small margin, so small price moves become large gains or losses relative to your money.
  - q: Call option vs put option?
    a: A call gives the right to buy at the strike price; a put gives the right to sell at the strike price, until expiry.
  - q: What is an option premium?
    a: The price the buyer pays the seller for the option. The buyer's maximum loss is the premium.
  - q: What is time decay?
    a: Options lose value as expiry approaches, all else equal. It works against option buyers every day.
  - q: What is hedging?
    a: Using a position (e.g. buying a put) to offset potential losses on something you already own, like insurance.
quiz:
  - q: Arjun buys one Nifty futures lot worth about ₹15 lakh with ₹2 lakh margin. Nifty falls 2%. What happens to his margin?
    options: ["Loses 2% (₹4,000)", "Loses ₹30,000, about 15% of his margin", "Nothing until expiry", "Loses ₹2 lakh"]
    answer: 1
    why: 2% of ₹15 lakh = ₹30,000, which is 15% of his ₹2 lakh. A 13% fall would wipe out the whole margin.
  - q: Arjun buys a Nifty call option for ₹50 premium per unit. At expiry, Nifty is below the strike price. What happens?
    options: ["He gets his premium back", "The option expires worthless; he loses the premium", "He must buy Nifty", "He earns the premium"]
    answer: 1
    why: A call is worthless at expiry if the index is below the strike. The buyer loses the whole premium.
  - q: Which is a legitimate use of options?
    options: ["Turning ₹10,000 into ₹1 lakh by Friday", "Buying puts to protect a large existing portfolio before a known risk", "Borrowing to buy weekly options", "Following Telegram option tips"]
    answer: 1
    why: Hedging limits downside on what you own, like insurance. Using options as lottery tickets is how most retail traders lose.
explain:
  prompt: Explain to a friend why buying cheap weekly options is more like buying lottery tickets than investing.
  model: A cheap option only pays off if the price moves a lot in a short time, which rarely happens. Every day the option loses value from time decay, and most expire worthless, so you lose the whole premium. Occasionally one pays big, which feels like proof it works, but over many trades buyers mostly lose, while sellers and the platform collect the money.
deeper: [nism, sebi-investor, varsity]
---

:::hook
"Turn ₹5,000 into ₹50,000 by Thursday" is the pitch behind most retail F&O trading in India. It's mathematically possible, which is why it's so dangerous: **the rare big win hides the steady stream of losses behind it.**
:::

## What a derivative is

A **derivative** is a contract whose value comes from something else: a share, an index like Nifty, a currency, a commodity. Indian exchanges trade two main kinds, **futures** and **options** (F&O).

## Futures: leverage in action

A **futures contract** is an agreement to buy or sell an asset at a fixed price on a future date. You don't pay the full value; you deposit a **margin**, a fraction of it. Gains and losses are settled **daily** (mark-to-market).

:::example
Arjun buys one Nifty futures lot worth about **₹15 lakh**, depositing about **₹2 lakh** as margin (illustrative numbers).

- Nifty rises 2% → profit ₹30,000 (**+15%** on his money)
- Nifty falls 2% → loss ₹30,000 (**−15%**)
- Nifty falls ~13% → his entire ₹2 lakh margin is gone, and he may owe more

That's **leverage**: small moves, big swings in your money, in both directions.
:::

## Options: rights, premiums and time decay

| | Call option | Put option |
|---|---|---|
| Gives the buyer the right to | **Buy** at the strike price | **Sell** at the strike price |
| Buyer profits if | Price rises well above strike + premium | Price falls well below strike − premium |
| Buyer's max loss | The premium paid | The premium paid |
| Seller | Collects the premium; can face large losses | Collects the premium; can face large losses |

- **Strike price**: the agreed price.
- **Expiry**: the date it ends. Weekly and monthly expiries exist.
- **Premium**: what the buyer pays.
- **Time decay**: as expiry nears, an option loses value every day if the price doesn't move enough. It's a steady drain on buyers.

**Why most buyers lose:** cheap "out-of-the-money" options need big moves in short times. Most expire worthless. The occasional big win feels like proof of skill and keeps people trading.

## What SEBI changed

From late 2024, SEBI tightened index derivatives to curb speculation, including:

- **Larger contract sizes**, so each trade needs more money
- **Only one weekly expiry per exchange**, instead of near-daily expiries
- **Upfront collection of option premium** from buyers
- Extra margin on expiry days and closer intraday monitoring of positions

Rules keep evolving; check SEBI's site for the current framework.

## The legitimate use: hedging

Options can work like **insurance**: someone with a large equity portfolio can buy **puts** before a known risk to limit losses, paying the premium as the cost of protection. That's a real, sensible use, but it requires understanding pricing, and most salaried investors with SIPs simply don't need it.

:::trap
Option **selling** is often marketed as "consistent income, 90% win rate". It does win often, with small gains, and then occasionally loses huge amounts in one move (gaps, crashes, surprise news). Many accounts are wiped out by a single bad week.
:::

:::task
1. Without trading, look up one Nifty option on NSE's site: its strike, expiry and premium. Write down what would have to happen for a buyer to profit by expiry.
2. In **Me → Notes**, write your personal F&O rule. For most beginners, the honest one is: "No F&O until I've completed this course, paper-traded for a year, and only with money I can lose entirely."
:::
