---
id: m3-accounts-upi
module: 3
order: 1
title: Bank accounts, deposit insurance and UPI
summary: Choose accounts that don't bleed charges, know what's insured, and use UPI without getting tricked.
minutes: 12
reviewed_on: 2026-11-02
cheatsheet:
  - "A salary account is usually zero-balance only while salary is credited. If salary stops, it may become a regular account with minimum-balance charges."
  - "Bank deposits are insured by DICGC up to a limit per depositor per bank (all accounts in that bank combined). Check the limit."
  - "Add a nominee to every bank account and FD."
  - "UPI PIN is only for SENDING money. You never need it to receive."
  - "Collect requests and QR codes can pull money out. Read the screen: 'Pay' means money leaves."
  - "Wrong UPI transfer? Raise it in your UPI app and with your bank immediately; keep the transaction reference."
  - Check your statement monthly for charges (SMS alerts, minimum balance, debit card fees).
cards:
  - q: Do you need your UPI PIN to receive money?
    a: Never. The PIN is only for sending money. Anyone asking you to enter it "to receive" is scamming you.
  - q: What does DICGC insure?
    a: Bank deposits (savings, FD, current, RD) up to a limit per depositor per bank, if the bank fails.
  - q: What happens to a salary account when salary stops coming?
    a: Many banks convert it to a regular savings account, which may have minimum-balance requirements and charges.
  - q: What's a UPI collect request?
    a: A request from someone else asking you to pay. Approving it with your PIN sends money out of your account.
  - q: Why add a nominee to bank accounts?
    a: So your family can claim the money easily if something happens to you, without long legal processes.
  - q: What's a sweep-in FD?
    a: A facility that moves extra savings balance into an FD automatically and breaks it when you need the money. Higher interest, still accessible.
quiz:
  - q: Someone buying your old phone on OLX sends a QR code "to send you the payment". What do you do?
    options: ["Scan and enter PIN", "Refuse — scanning a QR and entering PIN sends YOUR money", "Scan but don't enter PIN", "Ask for a second QR"]
    answer: 1
    why: You never scan a QR or enter a PIN to receive money. Ask them to pay to your UPI ID instead.
  - q: You have ₹8 lakh in one bank across savings and FD. How does deposit insurance apply?
    options: ["Each account insured separately", "Total across that bank is insured up to the DICGC limit", "Only FDs are insured", "Not insured at all"]
    answer: 1
    why: The limit is per depositor per bank, combining all your accounts there. Check the current limit on DICGC's site.
  - q: You sent ₹5,000 to the wrong UPI ID. First step?
    options: ["Post on social media", "Raise a complaint in your UPI app/bank with the transaction ID right away", "Wait a month", "Send another payment"]
    answer: 1
    why: Report quickly through your app and bank. If unresolved, escalate to the bank's grievance channel and then RBI CMS.
explain:
  prompt: Explain to your mother, in simple words, why she should never enter her UPI PIN when someone says they're sending her money.
  model: The PIN is like signing a cheque from your own account. It's only needed when you pay someone. To receive money, you don't need to do anything at all. If anyone asks you to enter the PIN or scan a code to receive money, they're trying to take money from you.
deeper: [rbi-faqs, npci, dicgc]
---

:::hook
A friend lost ₹15,000 selling a sofa online. The "buyer" sent a QR code "to pay". He scanned it, entered his PIN, and the money left his account. **UPI is safe. Not reading the screen isn't.**
:::

## Choosing accounts

- **Salary account**: often zero-balance while salary is credited. If you change jobs, it may turn into a regular account with a minimum balance and charges. Close or convert old salary accounts.
- **Savings account**: check the minimum average balance and the interest rate. Fewer, well-chosen accounts are easier to track.
- **Sweep-in / auto-sweep**: excess balance moves into an FD automatically and comes back when needed. Useful for your emergency fund.

:::trap
Old salary accounts from previous jobs quietly collecting minimum-balance penalties and debit-card fees. List all your accounts and close the ones you don't use (after updating any linked SIPs/EMIs).
:::

## Deposit insurance

If a bank fails, **DICGC** (an RBI subsidiary) insures deposits up to a limit **per depositor, per bank**: all your savings, FD and RD balances at that bank combined.

:::checklive dicgc
Find the current insured limit. If your money at one bank exceeds it, consider splitting across banks.
:::

## Nominees

Add a nominee to every account and FD. It takes two minutes in most banking apps and saves your family months of paperwork. (Module 16 covers nominees and wills properly; Module 17 helps you review family accounts.)

## UPI: how it actually works

- Your **UPI ID** (like name@bank) is safe to share for receiving money.
- Your **UPI PIN** authorises *payments out*. Nothing else.
- **Collect request**: someone asks you to pay. Approve only if you meant to pay them.
- **QR code**: scanning one and entering a PIN = paying the QR owner.

:::checklive npci
Check NPCI's UPI section for current per-transaction limits and features (UPI Lite, AutoPay). These change; don't rely on old numbers.
:::

## Mistakes and disputes

- Wrong transfer or money debited but not received: raise a complaint **inside your UPI app** and with your **bank**, quoting the transaction reference (UTR).
- If the bank doesn't resolve it in the allowed time, escalate to **RBI's complaint portal**.

:::task
1. List every bank account you hold (bank name + type only, **no account numbers**) in **Me → Notes**.
2. For each: is a nominee added? Any charges in the last 3 statements?
3. Turn on SMS/app alerts for every debit.
4. Mark accounts to close.
:::
