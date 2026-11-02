---
id: m10-how-markets-work
module: 10
order: 1
title: How the stock market works — exchanges, brokers, demat and IPOs
summary: What happens when you buy a share, who holds it for you, what an index is, how IPOs work, and every cost on a trade.
minutes: 13
reviewed_on: 2026-11-02
cheatsheet:
  - "A share is part-ownership of a company. Listed shares trade on stock exchanges, NSE and BSE in India, regulated by SEBI."
  - "You need a SEBI-registered broker and a demat account (held at NSDL or CDSL via a depository participant)."
  - "Trades settle T+1: shares and money move one working day after the trade."
  - "An index (Nifty 50, Sensex) tracks a basket of large companies. 'The market rose' usually means an index rose."
  - "IPO = a company selling shares to the public for the first time (primary market). Later trading between investors is the secondary market."
  - "Costs on each trade: brokerage, STT, exchange and SEBI charges, stamp duty, GST, and DP charges on selling. Small, but they add up with frequent trading."
cards:
  - q: What does a stock exchange do?
    a: Runs the marketplace where buyers and sellers of listed shares are matched, under SEBI's rules. India's main ones are NSE and BSE.
  - q: What is a demat account?
    a: An electronic account that holds your shares and other securities, kept with a depository (NSDL or CDSL) through a depository participant.
  - q: What does T+1 settlement mean?
    a: Shares and money change hands one working day after the trade date.
  - q: What is an index like the Nifty 50?
    a: A number that tracks the combined value of a fixed basket of shares (50 large companies for Nifty 50), used to measure the market.
  - q: Primary vs secondary market?
    a: Primary is when a company issues new shares (like an IPO) and gets the money. Secondary is investors trading existing shares with each other.
  - q: Name three costs on a share trade in India.
    a: Any of brokerage, Securities Transaction Tax (STT), exchange transaction charges, SEBI fees, stamp duty, GST, DP charges.
quiz:
  - q: Arjun buys 10 shares on Monday. When do they reach his demat account (assuming no holiday)?
    options: ["Same day", "Tuesday (T+1)", "Friday", "After a month"]
    answer: 1
    why: India moved to T+1 settlement, so shares arrive the next working day.
  - q: A company raises ₹1,000 crore in an IPO. Who receives that money?
    options: ["Investors who sold shares later", "The company (for new shares) and/or existing shareholders selling in an offer for sale", "SEBI", "The stock exchange"]
    answer: 1
    why: In a fresh issue the company gets the money; in an offer-for-sale portion, existing shareholders selling their stake get it. Check the prospectus to see which.
  - q: The Nifty 50 rose 1% today but Arjun's stock fell 3%. What's true?
    options: ["Impossible", "An index is an average of 50 stocks; individual stocks can move very differently", "His broker made an error", "The Nifty includes all listed companies"]
    answer: 1
    why: Indices summarise a basket. Any single stock can move against it.
explain:
  prompt: Explain to a friend what actually happens, step by step, when they tap "Buy" on a share in their broker's app.
  model: The broker sends my order to the exchange, which matches it with someone selling at that price. The trade is done in seconds, but settlement happens the next working day, when money leaves my account and the shares arrive in my demat account at NSDL or CDSL. The company isn't involved; I'm buying from another investor. I pay brokerage plus small taxes and charges.
deeper: [sebi-investor, nism, varsity]
---

:::hook
"The Sensex crashed 900 points!" is on every screen, yet most people couldn't say what the Sensex is or where their shares actually sit. **Before buying a single share, know the plumbing**: it protects you from frauds and from paying costs you don't see.
:::

## The players

| Who | Role |
|---|---|
| **Companies** | Issue shares, listed on an exchange |
| **Stock exchanges** (NSE, BSE) | Run the marketplace, match buyers and sellers |
| **SEBI** | Regulates exchanges, brokers, companies' disclosures, and protects investors |
| **Brokers** (SEBI-registered) | Send your orders to the exchange |
| **Depositories** (NSDL, CDSL) | Hold your shares electronically in your **demat account** |
| **Clearing corporations** | Make sure money and shares actually change hands |

## What happens when you tap "Buy"

1. Your **broker** sends the order to the **exchange**.
2. The exchange **matches** it with a seller at that price.
3. **Settlement on T+1**: the next working day, money leaves your trading account and shares land in your **demat account**.

You're buying from another investor, not from the company.

## Indices

- **Nifty 50** (NSE): 50 large companies.
- **Sensex** (BSE): 30 large companies.
- Others cover mid-caps, small-caps, sectors.

"The market rose 1%" usually means one of these indices rose 1%. Your own shares can do something completely different.

## IPOs: the primary market

An **IPO (Initial Public Offering)** is when a company first sells shares to the public:

- You apply through your bank (ASBA) or a UPI mandate. Money is **blocked**, not taken, until allotment.
- Oversubscribed retail portions are allotted by **lottery**.
- Shares list on the exchange a few days after the issue closes.
- Part of an IPO is often an **offer for sale**: existing owners cashing out, with no new money going to the company.

:::trap
"Grey market premium" and listing-day pops make IPOs feel like free money. Many IPOs list below their issue price or fall below it within a year. Read the prospectus's "Objects of the issue": is the company raising money to grow, or are insiders selling?
:::

## Costs on every trade

| Cost | Who charges |
|---|---|
| Brokerage | Your broker (some charge zero for delivery trades) |
| STT (Securities Transaction Tax) | Government |
| Exchange transaction charges, SEBI fee | Exchange, SEBI |
| Stamp duty | State government (on buying) |
| GST | On brokerage and charges |
| DP charges | Depository participant, when you sell from demat |
| Annual maintenance (AMC) | Demat account yearly fee (BSDA accounts for small holdings are cheaper) |

For long-term investing these are small. For frequent trading they add up fast (Module 11).

:::dive Why your shares are safe if your broker shuts down
Your shares sit in **your** demat account at NSDL/CDSL, not on the broker's books. If a broker fails, the shares remain yours and can be moved to another broker. Money lying unused in your trading account is more exposed, which is why SEBI requires brokers to return idle funds periodically. Keep only what you need with the broker.
:::

:::task
1. If you have a demat account, check your holdings on NSDL's or CDSL's own investor portal (not just the broker's app). They should match.
2. Look up today's Nifty 50 and Sensex levels and note what each tracks.
3. If you don't have a demat account yet, that's fine. You don't need one for index mutual funds. Note why you'd want one, if at all.
:::
