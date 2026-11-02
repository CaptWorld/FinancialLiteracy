---
id: m0-bank-statement
module: 0
order: 5
title: Reading your bank statement line by line
summary: What each column and those cryptic codes mean, how to spot charges and auto-debits, and a 15-minute monthly check.
minutes: 15
reviewed_on: 2026-11-02
cheatsheet:
  - "Debit / Withdrawal / Dr = money OUT. Credit / Deposit / Cr = money IN. Balance = what's left after that line."
  - "The narration (description) tells you what happened: UPI, NEFT, IMPS, ATM, POS (card swipe), ACH/NACH (auto-debit), INT (interest), charges."
  - "The reference number (UTR / RRN) is what you quote in any complaint."
  - "Auto-debits (ACH, NACH, ECS, 'mandate') are EMIs, SIPs, insurance or subscriptions. Know every one."
  - "Charges hide in words like 'CHRG', 'MAB', 'non-maintenance', 'SMS', 'annual fee', 'GST'."
  - "Download statements from the bank's app or net banking (PDF). Never via a link someone sends you."
  - "Codes differ by bank. If one is unclear, tap the transaction in the app or ask the bank."
cards:
  - q: On a bank statement, debit vs credit?
    a: Debit (Dr, withdrawal) is money leaving your account. Credit (Cr, deposit) is money coming in.
  - q: What is ACH / NACH on a statement?
    a: An automatic debit you authorised with a mandate, e.g. an EMI, SIP or insurance premium. ACH D usually means a debit.
  - q: What does POS mean in a narration?
    a: Point of Sale, i.e. a debit card payment at a shop's card machine.
  - q: What's a UTR or RRN?
    a: The unique reference number of a transfer. Quote it when you complain about a wrong or failed payment.
  - q: What does "INT" or "Int.Pd" usually mean?
    a: Interest the bank paid into your account.
  - q: Name three words that signal a bank charge.
    a: Any of CHRG/charges, MAB or non-maintenance, SMS alert, annual fee, GST on charges, penalty.
quiz:
  - q: "A line reads: ACH D- XYZ FINANCE LTD ... Debit 3,877.00. What is it most likely?"
    options: ["A refund", "An automatic EMI deduction you authorised", "Interest credited", "A UPI payment you made"]
    answer: 1
    why: ACH D is an automatic debit under a mandate, typically an EMI, SIP or premium.
  - q: Your closing balance on 30 June was ₹21,450. On 1 July there's a credit of ₹65,000 (salary) and a debit of ₹16,000 (rent). What's the balance after both?
    options: ["₹65,000", "₹70,450", "₹86,450", "₹49,000"]
    answer: 1
    why: 21,450 + 65,000 − 16,000 = ₹70,450.
  - q: You see "MAB CHRG 590.00" and "GST 106.20". What happened?
    options: ["You earned interest", "Your average balance fell below the required minimum, so the bank charged a fee plus GST", "Your card was renewed", "A UPI refund"]
    answer: 1
    why: MAB = Minimum Average Balance. The fee attracts GST. Fix it by keeping the balance up, or by converting to an account that suits you.
  - q: You find a ₹299 monthly debit you don't recognise, labelled with a mandate. First step?
    options: ["Ignore it, it's small", "Find what it is (app → mandates/autopay), cancel it if unwanted, and complain to the bank if you never authorised it", "Close the account", "Post on social media"]
    answer: 1
    why: Small unknown debits add up and can be fraud. UPI apps and net banking list active mandates/autopays; cancel unwanted ones and dispute unauthorised ones quickly.
explain:
  prompt: Explain how you would do a 15-minute monthly check of your bank statement, step by step.
  model: I'd download last month's statement from the bank app. First I'd scan the credits to make sure salary and any refunds came in. Then I'd list every auto-debit and check I recognise each one. Then I'd search for charges like MAB, SMS or annual fees. Finally I'd add up spending by type (rent, food, transport) to see where the money went.
deeper: [rbi-faqs, rbi-cms, rbi-fin-edu]
---

:::hook
Arjun thought his savings account was free. Going through a year of statements, he found ₹2,950 in "non-maintenance" charges plus GST, a ₹199 app subscription he'd forgotten, and SMS-alert fees in **both** banks. **Fifteen minutes a month with your statement is the cheapest money habit there is.**
:::

## The five columns

| Column | What it means |
|---|---|
| **Date** (sometimes also Value date) | When it happened. Value date = when interest starts or stops counting on that money. |
| **Narration / Description / Particulars** | What happened, in bank shorthand |
| **Ref No / Chq No / UTR** | The transaction's ID. Quote it in any complaint. |
| **Withdrawal / Debit / Dr** | Money **out** |
| **Deposit / Credit / Cr** | Money **in** |
| **Balance** | What's left after this line |

## Decoding the narration

Every bank writes these differently. These are typical patterns:

| You see something like | It means |
|---|---|
| `UPI/…/name@okaxis/…` or `UPI-NAME-…` | A UPI payment or receipt |
| `NEFT CR-…` / `NEFT DR-…` | NEFT transfer in / out |
| `IMPS-…` | IMPS transfer |
| `ATW-…`, `ATM WDL`, `NWD-…` | Cash from an ATM. Another bank's ATM may show a different code. |
| `POS …` | Debit card swipe at a shop |
| `ACH D-…`, `NACH`, `ECS`, `DEBIT-ACHDr` | **Auto-debit** under a mandate: EMI, SIP, premium, subscription |
| `BIL/…`, `BBPS` | Bill payment (electricity, phone, credit card) |
| `INT`, `Int.Pd`, `Credit Interest` | Interest paid to you |
| `CHRG`, `MAB`, `Non-Maint`, `SMS Chrg`, `Annual Fee`, `GST` | **Charges** (and GST on them) |
| `REV`, `Reversal`, `Refund` | Money returned (failed transaction or refund) |
| `SAL`, `SALARY`, company name | Salary credit |

:::trap
Fraud and scams also show up first on your statement: a small "test" debit, a UPI collect you didn't mean to approve, a new mandate. **If you see a debit you didn't make, call the bank's official helpline and block the card or UPI the same day**, then report at cybercrime.gov.in or call 1930. Speed matters: the sooner you report, the better the chance of recovery.
:::

:::checklive rbi-faqs
RBI's FAQs explain your rights on unauthorised electronic transactions: how quickly to report, and when your liability is zero or limited.
:::

## A sample month: Arjun's statement

| Date | Narration | Debit | Credit | Balance |
|---|---|---|---|---|
| 30 Jun | Opening balance | | | 21,450 |
| 01 Jul | SALARY JUN ACME TECH | | 65,000 | 86,450 |
| 01 Jul | UPI/landlord name/rent | 16,000 | | 70,450 |
| 05 Jul | ACH D- XYZ FINANCE LTD | 3,877 | | 66,573 |
| 05 Jul | UPI/mom/home | 8,000 | | 58,573 |
| 09 Jul | POS SUPERMART HYD | 2,340 | | 56,233 |
| 12 Jul | ATW-ATM HYD | 2,000 | | 54,233 |
| 15 Jul | NACH STREAMPLUS | 199 | | 54,034 |
| 18 Jul | NEFT DR-Self to other bank | 20,000 | | 34,034 |
| 25 Jul | UPI/various food & cabs (14 lines, summed) | 9,800 | | 24,234 |
| 31 Jul | SMS CHRG Q1 | 15 | | 24,219 |
| 31 Jul | GST ON SMS CHRG | 2.70 | | 24,216.30 |

What it tells him:

- **Fixed commitments** (rent, EMI, home, subscription) = ₹28,076 of his ₹65,000, before any choice is made.
- The ₹199 streaming mandate: does he still use it?
- ₹17.70 of SMS charges per quarter in each bank, about ₹140 a year across two banks. Small, but it's money for nothing if he already uses app alerts.
- ₹20,000 moved to his other bank. **Two banks means two statements to check.**

:::dive Why "value date" matters
If you deposit a cheque on Friday, the "date" is Friday but the money may only be counted from Monday, its **value date**. Interest is calculated from the value date. The same applies when a credit card payment is credited "late" even though you paid on the due date: what counts is when your card's bank receives it. Pay a day or two early, especially across banks.
:::

## Your 15-minute monthly check

1. **Download** last month's statement as a PDF from each bank's app or net banking.
2. **Credits**: did salary, refunds and interest all arrive?
3. **Auto-debits**: list every ACH/NACH/mandate line. Do you recognise and still want each one?
4. **Charges**: search the PDF (Ctrl+F) for "CHRG", "MAB", "fee", "GST", "penal".
5. **Spending**: add up the big buckets (rent, food, transport, shopping). Module 1's budget lesson builds on this.
6. **Anything odd?** Report it today, not next week.

:::task
1. Download last month's statement from **each** bank you use.
2. Do steps 2–4 of the monthly check for each. In **Me → Notes**, write the total charges and list your auto-debits (merchant names and amounts only, no account numbers).
3. Cancel one unwanted auto-debit or subscription if you find one.
4. Set a monthly phone reminder for this check, e.g. on the 3rd of every month.
:::
