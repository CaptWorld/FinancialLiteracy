---
id: m9-balance-cash
module: 9
order: 3
title: The balance sheet and cash flow — why profit isn't cash
summary: What a company owns and owes, working capital, debt, and the cash flow statement that catches problems the P&L can hide.
minutes: 14
reviewed_on: 2026-11-02
cheatsheet:
  - "Balance sheet = a snapshot on one date: Assets = Liabilities + Shareholders' equity."
  - "Equity (net worth) is what would be left for shareholders if all assets were sold and debts paid, at book values."
  - "Working capital = money tied up in inventory and in customers' unpaid bills (receivables), minus what the company owes suppliers (payables)."
  - "Cash flow statement: operating (from the business), investing (capex, acquisitions), financing (loans, dividends, share issues)."
  - "Profit can be high while cash is low, if customers aren't paying or inventory piles up. Persistent gaps between profit and operating cash flow are a red flag."
  - "Free cash flow = operating cash flow − capex. It's the cash truly available to repay debt, pay dividends or grow."
cards:
  - q: What is the balance sheet equation?
    a: Assets = Liabilities + Shareholders' equity.
  - q: What are receivables?
    a: Money customers owe the company for goods or services already delivered.
  - q: What is working capital?
    a: Current assets like inventory and receivables minus current liabilities like payables. Cash tied up in running the business day to day.
  - q: What are the three parts of a cash flow statement?
    a: Cash from operating activities, investing activities and financing activities.
  - q: What is free cash flow?
    a: Operating cash flow minus capital expenditure. Cash left after keeping the business running and growing.
  - q: Why can a profitable company run out of cash?
    a: If customers pay late, inventory piles up, or heavy capex and debt repayments use up cash faster than profits bring it in.
quiz:
  - q: Deccan Chai has assets of ₹400 cr and liabilities of ₹160 cr. What is shareholders' equity?
    options: ["₹560 cr", "₹240 cr", "₹160 cr", "₹400 cr"]
    answer: 1
    why: Equity = assets − liabilities = 400 − 160 = ₹240 cr.
  - q: Deccan Chai's PAT is ₹45 cr, depreciation ₹30 cr, and working capital rose by ₹15 cr. Roughly what's its operating cash flow?
    options: ["₹45 cr", "₹60 cr", "₹90 cr", "₹15 cr"]
    answer: 1
    why: Start with profit, add back non-cash depreciation, subtract cash tied up in working capital → 45 + 30 − 15 = ₹60 cr.
  - q: A company reports rising profits for three years, but operating cash flow is negative every year and receivables keep ballooning. What's the concern?
    options: ["None, profits are rising", "Sales may not be turning into cash, so customers aren't paying or revenue may be aggressive", "It's normal for all companies", "Cash doesn't matter"]
    answer: 1
    why: Profit without cash, year after year, is a classic warning sign of weak business quality or accounting problems.
explain:
  prompt: Explain to a friend, with a shop example, how a business can show a profit but still run out of cash.
  model: Imagine a shop sells ₹10 lakh of goods on credit this month at a profit, but customers will pay only after three months. Meanwhile it must pay suppliers, rent and staff now. On paper it made a profit, but its bank account is empty. If customers delay further, or stock piles up unsold, it can't pay its bills even though the books show profit.
deeper: [varsity, nism, yt-varsity]
---

:::hook
Several Indian companies that reported years of rising profits later collapsed. Their profits were real on paper, but cash wasn't coming in, or it was quietly leaving. **The cash flow statement is where that story shows first.**
:::

## The balance sheet: a snapshot

It shows, on one date, what a company **owns** and how it's **funded**:

**Assets = Liabilities + Shareholders' equity**

Deccan Chai on 31 March (₹ crore):

| Assets | ₹ cr | Liabilities & equity | ₹ cr |
|---|---|---|---|
| Stores, machines (net of depreciation) | 300 | Borrowings | 100 |
| Inventory (tea, milk, packaging) | 30 | Payables (owed to suppliers) | 40 |
| Receivables (owed by corporate clients, delivery apps) | 20 | Other liabilities | 20 |
| Cash | 50 | **Shareholders' equity** | **240** |
| **Total** | **400** | **Total** | **400** |

- **Equity (₹240 cr)** is the book value of what shareholders own: past money invested plus profits kept in the business.
- **Debt-to-equity** = 100 ÷ 240 ≈ **0.42**: moderate.

## Working capital: cash stuck in the business

- **Inventory**: cash spent on stock not yet sold.
- **Receivables**: sales made but not yet paid for.
- **Payables**: purchases made but not yet paid for (suppliers' money funding you).

Rising inventory and receivables **consume cash** even when profits look fine.

## The cash flow statement

It tracks real cash in and out over the year, in three buckets:

| Bucket | Deccan Chai (₹ cr) | What it shows |
|---|---|---|
| **Operating** | +60 | PAT 45 + depreciation 30 (non-cash) − 15 more cash stuck in working capital |
| **Investing** | −50 | New stores and machines (**capex**) |
| **Financing** | −10 | Dividends paid (plus any loans taken or repaid) |

**Free cash flow = operating cash flow − capex = 60 − 50 = ₹10 cr.** Deccan Chai is profitable *and* funds its growth from its own cash, with a little left over. That's healthy.

:::trap
**Profit without cash.** If operating cash flow stays well below profit for years, with receivables or inventory swelling, ask why. It can mean customers aren't paying, sales are being booked aggressively, or worse. Also watch for **debt rising every year** while the company says it's "doing great".
:::

:::dive Auditor's report and related-party transactions
Two places in the annual report deserve a look even for beginners:

- **Auditor's report**: a "qualified opinion", "emphasis of matter" or a sudden auditor resignation is a serious warning.
- **Related-party transactions**: deals between the company and its promoters' other businesses or relatives. Big or growing amounts can mean money flowing to insiders at shareholders' cost.

You don't need to understand every note. Knowing these two spots catches many problems.
:::

:::task
1. For the same listed company as Lesson 2, find the balance sheet: total assets, borrowings, shareholders' equity. Calculate debt-to-equity.
2. Find the cash flow statement: operating cash flow and capex. Calculate free cash flow.
3. Compare operating cash flow with net profit. Are they roughly in line over the last 3 years?
:::
