---
id: m0-cards-payments
module: 0
order: 3
title: Debit card, credit card, UPI — how money leaves your account
summary: Your own money vs borrowed money, and the main ways to pay (UPI, cards, NEFT, IMPS, RTGS).
minutes: 10
reviewed_on: 2026-11-02
cheatsheet:
  - "Debit card = spends YOUR money from your savings account, immediately."
  - "Credit card = the bank LENDS you money; you repay later. Pay the full bill on time and it's free; pay less and it gets very expensive."
  - "Credit limit = the most you can borrow on the card. Not your money, not a target."
  - "Credit score (300–900) = a report card on how reliably you repay. Banks check it before lending."
  - "UPI moves money straight from your bank account using your phone. UPI PIN is only for paying."
  - "NEFT, IMPS, RTGS = bank-to-bank transfers. IMPS is instant; NEFT runs in batches; RTGS is for large amounts."
  - "Never share OTP, PIN, CVV or card number with anyone. Banks never ask for them."
cards:
  - q: Debit card vs credit card?
    a: Debit spends your own money right away. Credit is a short loan from the bank that you repay later.
  - q: When is a credit card free to use?
    a: When you pay the total amount due in full by the due date every month.
  - q: What is a credit limit?
    a: The maximum the bank will lend you on the card. It's borrowed money, not yours.
  - q: What is a credit score?
    a: A number (usually 300–900) showing how reliably you repay loans and cards. Lenders use it to decide whether to lend and at what rate.
  - q: Do you need your UPI PIN to receive money?
    a: No. The PIN is only for paying. Anyone asking for it "to send you money" is scamming you.
  - q: IMPS vs NEFT vs RTGS?
    a: IMPS is instant, any amount up to a limit. NEFT settles in half-hourly batches. RTGS is real-time, for large amounts only.
  - q: What are OTP and CVV?
    a: OTP is a one-time password that approves a transaction. CVV is the 3-digit code on the back of a card. Never share either.
quiz:
  - q: Your savings account has ₹800. You try to pay ₹1,200 with your debit card. What happens?
    options: ["It goes through and you owe the bank", "It's declined (unless you have an overdraft)", "It goes on your credit score", "The bank pays and charges interest from next year"]
    answer: 1
    why: A debit card can only spend what's in your account.
  - q: Your credit card bill is ₹20,000 and you pay all of it by the due date. How much interest do you pay?
    options: ["₹0", "About 3% of ₹20,000", "Depends on the minimum due", "₹500 flat"]
    answer: 0
    why: Paying the total due on time means you borrowed for free during the interest-free period.
  - q: A buyer on OLX says "I've sent you a payment request, enter your PIN to receive it". What's true?
    options: ["You need the PIN to receive", "Entering the PIN would SEND money from your account", "It's safe if the app is genuine", "Only a QR needs a PIN"]
    answer: 1
    why: The UPI PIN only authorises payments out. Receiving money never needs anything from you.
  - q: You need to transfer ₹5 lakh to a builder today. Which is designed for large transfers?
    options: ["UPI", "RTGS", "Debit card", "Cash deposit"]
    answer: 1
    why: RTGS is meant for large-value transfers. UPI has per-day limits that are usually lower. Check your bank's limits.
explain:
  prompt: Explain to a friend why a credit card can be free or very expensive, using the idea of a kirana shop's khata (tab).
  model: A credit card is like a khata at the kirana shop. You buy now and settle at month-end. If you clear the whole tab on time, it costs nothing extra. If you pay only part of it, the shopkeeper (the bank) adds heavy charges on the rest every month, so the unpaid amount keeps growing.
deeper: [rbi-faqs, npci, cibil]
---

:::hook
A debit card and a credit card look identical in your wallet. **One spends your money. The other spends the bank's money, and charges you heavily if you don't return it on time.**
:::

## Debit card: your own money

- Linked to your **savings account**. Each payment reduces your balance immediately.
- Use it at shops, online and at ATMs. Most banks give a few free ATM withdrawals a month and charge after that.
- If your balance is ₹0, the payment fails. That makes it safer than a credit card for people still building habits.

## Credit card: borrowed money

Think of it as a **khata (tab) at a kirana shop**:

1. You buy things during the month. The bank pays the shops for you.
2. You get a **bill (statement)** once a month.
3. You have until the **due date** (a couple of weeks later) to pay.

| You pay | What happens |
|---|---|
| **Total amount due**, on time | No interest. You borrowed for free for a few weeks. |
| **Only the minimum due**, or anything less than the total | High interest on everything unpaid, often over 30% a year, and new purchases lose the free period. |
| **Nothing** by the due date | Late fee + interest, and your credit score drops. |

- **Credit limit**: the most the bank will lend on the card. It's not your money and not a target. Using a small share of it is better for your credit score.
- **Never withdraw cash on a credit card.** There's a fee, and interest starts that same day.
- Module 3, Lesson 2 goes deeper into credit cards and how to read the bill.

:::trap
Banks call you with "lifetime free" cards and pre-approved limits. A card is a loan product. Get one only when you'll pay the full bill every month, preferably with auto-pay set to "total amount due".
:::

## Credit score

A number, usually **300–900**, calculated by credit bureaus (CIBIL, Experian, Equifax, CRIF High Mark) from your loan and card repayment history. Lenders check it before giving you a loan or card, and a low score means a refusal or higher interest. **Paying on time, every time** matters most. Checking your own score does **not** lower it.

## Ways to send money

| Method | Speed | Typical use |
|---|---|---|
| **UPI** | Instant, 24×7 | Daily payments by phone, QR codes |
| **IMPS** | Instant, 24×7 | Bank transfer to an account number + IFSC |
| **NEFT** | Batches, usually within an hour, 24×7 | Regular bank transfers, any amount |
| **RTGS** | Real-time | Large amounts only (there's a minimum) |

- **IFSC**: the code that identifies a bank branch, needed for IMPS, NEFT and RTGS transfers.
- **UPI ID** (like name@bank): safe to share for receiving money. Your **UPI PIN** is only for paying.

:::checklive npci
See the current UPI limits and features (UPI Lite, AutoPay). These change, so don't rely on old numbers.
:::

:::dive What actually happens when you pay ₹200 by UPI
1. Your UPI app (PhonePe, GPay, your bank's app) sends the request to **NPCI**, which runs UPI.
2. NPCI asks **your bank** to check your PIN and balance and take ₹200 out.
3. NPCI tells the **shop's bank** to put ₹200 in.
4. Both banks settle the actual money between themselves through RBI later the same day.

The app is just a front door. Your money never sits "in PhonePe". It moves bank to bank. That's also why a wrong payment is disputed with **your bank and app**, quoting the **UTR** (the transaction's reference number).
:::

:::dive How card companies earn when you swipe, and why "rewards" aren't free
When you pay ₹1,000 by card, the shop receives a little less than ₹1,000. The cut is the **MDR (Merchant Discount Rate)**, shared between the shop's bank, your card's bank and the card network (Visa, Mastercard, RuPay). Your credit card's reward points are funded partly by this cut, and partly by the interest and fees paid by people who **don't** clear their bills in full. Rewards are a reason to use a card you'd pay off anyway, never a reason to spend more.
:::

## The three secrets

**OTP, PIN and CVV** (the 3 digits on the back of a card) approve payments. Banks, RBI and the police **never** ask for them, not on a call, SMS or WhatsApp. Anyone who asks is a scammer. Module 3, Lesson 3 covers fraud in detail.

:::task
1. Check your wallet and apps: do you have only a debit card, or a credit card too? Note it in **Me → Notes** (no card numbers).
2. If you have a credit card, find its **due date** and check whether auto-pay is set to "total amount due".
3. In your UPI app, find your **UPI ID**. That's what you share to receive money.
4. Write in your own words: what's the difference between a debit and a credit card?
:::
