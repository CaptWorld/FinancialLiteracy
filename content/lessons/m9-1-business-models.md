---
id: m9-business-models
module: 9
order: 1
title: How companies make money — revenue, costs, margins and moats
summary: The simple arithmetic behind every business, why some earn far more per rupee of sales than others, and what lets a few keep doing it for decades.
minutes: 12
reviewed_on: 2026-11-02
cheatsheet:
  - "Profit = revenue − costs. Everything in company analysis is a detailed version of this."
  - "Fixed costs (rent, salaries) don't change with sales; variable costs (raw materials) do. High fixed costs make profits swing more with sales."
  - "Margin = profit ÷ revenue. Software and brands often have high margins; retail and airlines low ones."
  - "A moat is what stops competitors copying the profits: brand, network effects, switching costs, cost advantage, licences."
  - "Unit economics: does each customer or each sale make money once all its costs are counted?"
  - "Growth without profit can destroy value if every extra sale loses money."
cards:
  - q: Fixed vs variable costs?
    a: Fixed costs stay the same regardless of sales (rent, most salaries). Variable costs rise with each sale (raw materials, delivery).
  - q: What is a profit margin?
    a: Profit as a percentage of revenue. A 10% net margin means ₹10 of profit from every ₹100 of sales.
  - q: What is a moat?
    a: A durable advantage that protects a company's profits from competitors, like a strong brand, network effects, high switching costs or lowest costs.
  - q: What are unit economics?
    a: Whether a single sale or customer is profitable after all the costs directly tied to it.
  - q: What is operating leverage?
    a: When high fixed costs mean profits rise or fall much faster than sales.
quiz:
  - q: A chai outlet has fixed costs of ₹60,000 a month. Each cup sells for ₹20 and costs ₹8 in milk, tea and cups. How many cups a month to break even?
    options: ["3,000", "5,000", "7,500", "12,000"]
    answer: 1
    why: Each cup contributes ₹12 towards fixed costs. 60,000 ÷ 12 = 5,000 cups to break even.
  - q: Which business typically has the highest profit margin?
    options: ["A supermarket chain", "An airline", "A software company selling subscriptions", "A construction contractor"]
    answer: 2
    why: Once software is built, each extra customer costs little to serve, so margins can be very high. Supermarkets and airlines run on thin margins.
  - q: A food-delivery startup grows orders 3× but loses ₹40 on every order after discounts and delivery costs. What's happening?
    options: ["Great growth", "Growth is multiplying losses; unit economics are negative", "It will become profitable automatically", "Margins are irrelevant early"]
    answer: 1
    why: If each order loses money, more orders mean more losses. Growth creates value only when unit economics eventually turn positive.
explain:
  prompt: Pick a business you use every week (your employer, a chai stall, an app). Explain how it makes money and what stops others from copying it.
  model: My neighbourhood medical store earns a margin on each medicine it sells. Its costs are rent, staff and the stock. Its moat is mostly convenience and trust, since it's on my street and knows my family, but that's a weak moat because big online pharmacies can undercut prices. A company like a payments network has a stronger moat, because everyone already uses it.
deeper: [varsity, yt-varsity, nism]
---

:::hook
A neighbourhood chai stall and a software company both sell something for more than it costs. But one keeps ₹2 from a ₹20 cup, and the other keeps ₹30 of every ₹100 subscription for years. **Understanding why is the first step to understanding shares, and your own employer.**
:::

## The one equation

**Profit = Revenue − Costs**

- **Revenue**: money from selling goods or services
- **Costs**:
  - **Variable**: rise with each sale (raw materials, packaging, delivery, commissions)
  - **Fixed**: stay the same whatever you sell (rent, most salaries, software licences)

:::example
**A chai outlet:** rent + staff + electricity = ₹60,000 a month (fixed). Each cup sells for ₹20 and costs ₹8 in milk, tea and cup (variable).

- Each cup **contributes** ₹12 to fixed costs.
- Break-even = 60,000 ÷ 12 = **5,000 cups a month** (about 167 a day).
- At 8,000 cups: profit = 8,000 × 12 − 60,000 = **₹36,000**.
- At 4,000 cups: loss of ₹12,000.

A 60% jump in cups (5,000 → 8,000) takes profit from zero to ₹36,000. That's **operating leverage**: high fixed costs make profits swing much more than sales.
:::

## Margins: how much of each ₹100 is kept

**Margin = profit ÷ revenue**

| Business type | Typical margin | Why |
|---|---|---|
| Software / platforms | High | Extra customers cost little to serve |
| Branded consumer goods | Medium–high | Brand lets them charge more |
| Banks | Depends on loan quality | Earn the gap between lending and deposit rates (Module 0) |
| Supermarkets, airlines, contractors | Low | Fierce competition, high costs |

High margins aren't automatically good, and low margins aren't automatically bad. A supermarket with thin margins but huge, steady volume can be an excellent business.

## Moats: why some profits last

Profits attract competitors. A **moat** stops them:

- **Brand**: people pay more for a name they trust.
- **Network effects**: the service gets better as more people use it (payment networks, marketplaces).
- **Switching costs**: it's painful to change (core banking software, an enterprise's ERP system).
- **Cost advantage**: scale or process lets them be cheapest.
- **Licences / regulation**: limited permits (some infrastructure, exchanges).

## Unit economics

For any sale or customer: **does it make money after the costs it directly causes?** If yes, growth adds profit. If not, growth adds losses. Many startups grew fast on discounts and investor money before discovering their unit economics never worked.

:::dive Your employer through this lens
An IT services company like those many Indians work for earns revenue by billing clients for engineers' time. Its biggest cost is salaries. Margins depend on **utilisation** (what share of employees are billed), **pricing**, the **rupee** (Module 6: a weaker rupee raises rupee revenue), and the **mix** of onsite vs offshore work. That's why hiring freezes, bench policies and appraisal cycles track deal wins and the dollar. Understanding the model helps you read your own job's risks.
:::

:::task
1. Pick two businesses you pay every month. For each, write in **Me → Notes**: how they make money, roughly what their big costs are, and what (if anything) is their moat.
2. Find your employer's latest quarterly results press release. Note its revenue growth and operating margin.
:::
