---
id: m9-pnl
module: 9
order: 2
title: The profit & loss statement, line by line
summary: Revenue down to net profit and earnings per share, using one simple company. What EBITDA hides, and which "profits" to distrust.
minutes: 13
reviewed_on: 2026-11-02
cheatsheet:
  - "The P&L (income statement) shows a period's revenue, expenses and profit."
  - "Revenue → minus operating costs = EBITDA → minus depreciation = EBIT (operating profit) → minus interest = PBT → minus tax = PAT (net profit)."
  - "EPS = net profit ÷ number of shares. Share prices are often compared with EPS (P/E ratio, Module 10)."
  - "EBITDA ignores the cost of wearing out assets and of debt. Useful, but flattering for capital-heavy or indebted companies."
  - "Watch for one-time items (asset sales, write-offs) that inflate or depress a single year."
  - "Compare margins over several years and against peers. One year tells you little."
cards:
  - q: What does EBITDA stand for?
    a: Earnings Before Interest, Taxes, Depreciation and Amortisation. Operating profit before the cost of assets and debt.
  - q: What is PAT?
    a: Profit After Tax, the company's net profit for the period, belonging to shareholders.
  - q: What is EPS?
    a: Earnings Per Share = net profit ÷ number of shares.
  - q: What is depreciation?
    a: Spreading the cost of a long-lasting asset (machines, stores, computers) over its useful life as a yearly expense.
  - q: Why be careful with "adjusted EBITDA"?
    a: It leaves out real costs like depreciation, interest and sometimes "one-time" items that keep recurring, making the business look more profitable than it is.
quiz:
  - q: Deccan Chai has revenue ₹500 cr, operating costs ₹400 cr, depreciation ₹30 cr, interest ₹10 cr, tax 25%. What's its net profit (PAT)?
    options: ["₹100 cr", "₹70 cr", "₹45 cr", "₹60 cr"]
    answer: 2
    why: EBITDA 100 → EBIT 70 → PBT 60 → tax 15 → PAT ₹45 cr.
  - q: Deccan Chai has 10 crore shares. What is its EPS?
    options: ["₹45", "₹4.5", "₹0.45", "₹10"]
    answer: 1
    why: ₹45 crore ÷ 10 crore shares = ₹4.50 per share.
  - q: A company's net profit doubled this year, but the notes show a big one-time gain from selling land. What's the right reading?
    options: ["The business doubled", "Core profit may be flat; strip out the one-time gain before judging", "Land sales are recurring", "Profit is irrelevant"]
    answer: 1
    why: One-offs don't repeat. Judge the business on its recurring operating profit.
explain:
  prompt: Explain to a friend the difference between EBITDA and net profit, and why a company might prefer to talk about EBITDA.
  model: EBITDA is profit from operations before paying for depreciation of assets, interest on loans and tax. Net profit is what's left after all of those. A company with lots of debt or expensive equipment looks much better on EBITDA, because the biggest costs are left out, so it might highlight EBITDA. But shareholders only get what's left after everything, which is net profit.
deeper: [varsity, nism, yt-varsity]
---

:::hook
A company announces "EBITDA up 40%!" and its share price falls the same day. Another reports "profit doubled" and analysts shrug. **Which profit you look at, and what's hiding inside it, changes the story completely.**
:::

## Meet Deccan Chai Ltd

An invented listed chain of tea cafés we'll use for the rest of this module. Its year in numbers (₹ crore):

| Line | ₹ cr | What it means |
|---|---|---|
| **Revenue** | 500 | Sales of tea, snacks and packaged tea |
| − Raw materials | 200 | Milk, tea, snacks, packaging |
| − Employee costs | 90 | Salaries of staff |
| − Rent & other expenses | 110 | Store rents, electricity, marketing |
| **= EBITDA** | **100** | Operating profit before depreciation, interest, tax · **20% margin** |
| − Depreciation | 30 | Wear and tear on stores, machines, fit-outs |
| **= EBIT (operating profit)** | **70** | |
| − Interest | 10 | On ₹100 cr of borrowings |
| **= PBT (profit before tax)** | **60** | |
| − Tax (25%) | 15 | |
| **= PAT (net profit)** | **45** | **9% net margin** |

With **10 crore shares**: **EPS = 45 ÷ 10 = ₹4.50**.

## What each layer tells you

- **Revenue growth**: is the business getting bigger? Is it from more stores, more sales per store, or price hikes?
- **EBITDA margin**: how efficiently it runs day to day.
- **Depreciation**: a real cost. Stores and machines wear out and must be replaced.
- **Interest**: the cost of debt. High interest relative to EBIT is a warning sign.
- **PAT**: what actually belongs to shareholders.

:::trap
"**Adjusted** EBITDA" and "**excluding** one-time items" can be honest, or can quietly remove costs that happen every year. If "one-time restructuring costs" appear in five straight years, they're ordinary costs. Always look at reported net profit too.
:::

## One-offs and "other income"

The P&L also has **other income** (interest on cash, gains on investments) and **exceptional items** (selling land, write-offs, legal settlements). These can swing a single year's profit a lot. Ask: **what did the core business earn?**

## Standalone vs consolidated

Listed companies report **standalone** results (just the parent company) and **consolidated** results (including subsidiaries). For most analysis, use **consolidated**: it shows the whole group.

:::dive Quarterly results and the "QoQ / YoY" game
Indian listed companies publish results every quarter. Compare a quarter with the **same quarter last year (YoY)**, because many businesses are seasonal: tea cafés sell more in winter, AC makers in summer. Quarter-on-quarter (QoQ) comparisons can mislead. And one quarter is noise; look at the trend over several years.
:::

:::task
1. Find your employer's (or any listed company's) latest annual P&L on its investor-relations page or on BSE/NSE.
2. Write down revenue, EBITDA, depreciation, interest, PAT and EPS. Calculate the EBITDA margin and net margin yourself.
3. Check whether there were any "exceptional items" that year.
:::
