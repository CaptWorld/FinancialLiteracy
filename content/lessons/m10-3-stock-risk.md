---
id: m10-stock-risk
module: 10
order: 3
title: Single-stock risk, diversification, and the maths of losses
summary: Why individual shares are far riskier than an index, why big losses are so hard to recover from, and how to size positions if you pick stocks at all.
minutes: 12
reviewed_on: 2026-11-02
cheatsheet:
  - "A 50% loss needs a 100% gain to get back to where you started; a 90% loss needs 900%."
  - "Single companies can fall 80–100% (fraud, debt, disruption) and never recover. The Nifty 50 fell about 60% in 2008, a severe fall, but it has recovered from every past crash."
  - "Global research finds that a small minority of stocks produce most of the market's long-term gains; most individual stocks do worse than the index."
  - "Diversification across many companies and sectors removes company-specific risk you don't get paid for."
  - "If you pick stocks, use a 'core and satellite' approach: index funds as the core, a small capped amount in individual stocks."
  - "Set a maximum per stock (e.g. a few % of your total investments) before buying."
cards:
  - q: How much gain do you need to recover from a 50% loss?
    a: 100%. Losses hurt more than equal-sized gains help.
  - q: What is company-specific (unsystematic) risk?
    a: Risk from things affecting one company, like fraud, a failed product or heavy debt. Diversification can largely remove it.
  - q: What is market (systematic) risk?
    a: Risk affecting nearly all shares together, like recessions, rate shocks or pandemics. Diversification within shares can't remove it.
  - q: What's a core-and-satellite approach?
    a: Most money in a broad, low-cost core (index funds); a small, capped portion in individual picks or themes.
  - q: What is survivorship bias?
    a: Judging by the winners you can still see, while forgetting the many companies that failed or vanished.
quiz:
  - q: Arjun's stock falls from ₹200 to ₹50. What gain does he need to get back to ₹200?
    options: ["75%", "150%", "300%", "400%"]
    answer: 2
    why: From ₹50 to ₹200 is ×4, a 300% gain. A 75% loss needs a 300% gain.
  - q: Which risk can diversification across 50+ companies largely remove?
    options: ["A countrywide recession", "One company's fraud or failure", "Global interest-rate rises", "Inflation"]
    answer: 1
    why: Company-specific risk averages out across many holdings. Market-wide risk remains.
  - q: "Arjun's friend says 'Just buy the companies everyone knows, they never fail'. What does history say?"
    options: ["True", "Many once-famous Indian and global companies collapsed or shrank; well-known isn't the same as safe", "Only small companies fail", "SEBI guarantees large companies"]
    answer: 1
    why: Famous names have failed or stagnated for decades. Survivorship bias makes today's winners look inevitable.
explain:
  prompt: Explain to a friend why owning 3 shares they like is riskier than owning an index fund, even if they've researched the 3 companies.
  model: With three shares, if one hits fraud, debt trouble or a bad product, a third of my money can be wiped out, and research can miss these things. An index fund holds 50 or more companies, so one disaster barely matters. Also, a small number of companies produce most of the market's gains, and with only three I'll probably miss them. The index gives me the market return with much less chance of a disaster.
deeper: [varsity, sebi-investor, spiva-india]
---

:::hook
Every few years an Indian company that was a household name, a "safe blue chip", sees its share price collapse 80–95% through fraud, debt or disruption. **Shareholders who owned it inside an index barely noticed. Those who owned it alone lost most of their money.**
:::

## The maths of losses

| Loss | Gain needed to recover |
|---|---|
| 20% | 25% |
| 50% | **100%** |
| 75% | **300%** |
| 90% | **900%** |

Big losses are disproportionately hard to recover from. **Avoiding a few disasters matters more than catching a few winners.**

## Two kinds of risk

- **Company-specific risk**: fraud, a failed product, heavy debt, a key customer leaving, management problems. **Diversification removes most of it.**
- **Market risk**: recessions, rate shocks, pandemics, which hit nearly everything. Diversification *within shares* can't remove it; only holding other assets (debt, gold) and time can soften it.

Markets don't reward you for company-specific risk, because anyone can diversify it away for free.

## Most stocks don't beat the index

Long-term research on stock markets (notably large studies of US and global stocks) finds that **a small minority of companies produce most of the market's total gains**, while the majority do worse than simply holding the index, and many lose money. Indian data shows the same pattern in fund performance (SPIVA, Module 7). Picking a few stocks means you'll probably miss most of the big winners.

:::trap
**Survivorship bias**: lists of "stocks that made people rich" show only survivors. The many companies that once looked just as promising, then stagnated, were delisted or went bust, don't appear on those lists.
:::

## If you do pick stocks

Use **core and satellite**:

- **Core (most of your equity)**: broad, low-cost index funds (Module 7).
- **Satellite (small, capped)**: individual stocks you've studied, using Module 9's checks.

Rules worth writing down **before** you buy:

1. Maximum in any single stock, e.g. **a few % of total investments**.
2. Maximum in all individual stocks together.
3. Why you're buying (a 3-line thesis) and what would prove you wrong.
4. Never average down on a stock just because it fell; re-check the thesis first.

:::dive Why concentrated "conviction" works for a few and fails for most
Famous investors who held concentrated portfolios are famous precisely because it worked for them. For every one, many others with equal conviction lost heavily and are forgotten. Unless you have a real informational or analytical edge, and the time to use it, concentration mostly adds risk. For most salaried people, the edge is low costs, patience and diversification.
:::

:::task
1. In **Me → Notes**, write your personal limits: maximum % of investments in any single stock, and in all individual stocks together.
2. If you hold individual shares, check whether any one is above that limit.
:::
