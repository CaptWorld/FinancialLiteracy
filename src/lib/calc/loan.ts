// Loan maths: reducing-balance EMI, amortisation, flat-rate loans, and true cost with fees.

/** Monthly EMI on a reducing-balance loan. */
export function emi(principal: number, ratePct: number, months: number): number {
  if (months <= 0) return 0;
  const r = ratePct / 100 / 12;
  if (r === 0) return principal / months;
  const f = Math.pow(1 + r, months);
  return (principal * r * f) / (f - 1);
}

export interface AmortRow { month: number; emi: number; interest: number; principal: number; balance: number }

export function amortization(principal: number, ratePct: number, months: number): AmortRow[] {
  const r = ratePct / 100 / 12;
  const e = emi(principal, ratePct, months);
  const rows: AmortRow[] = [];
  let bal = principal;
  for (let m = 1; m <= months; m++) {
    const interest = bal * r;
    let princ = e - interest;
    if (m === months) princ = bal; // clear rounding drift
    bal = Math.max(0, bal - princ);
    rows.push({ month: m, emi: e, interest, principal: princ, balance: bal });
  }
  return rows;
}

/** Flat-rate loan: interest is charged on the full original amount for the whole term. */
export function flatRateEmi(principal: number, flatRatePct: number, months: number): number {
  const interest = principal * (flatRatePct / 100) * (months / 12);
  return (principal + interest) / months;
}

/**
 * Yearly rate (APR, %) that makes `monthlyPayment` for `months` repay `netReceived`.
 * Use netReceived = loan amount minus upfront fees to see the true cost.
 */
export function aprFromPayment(netReceived: number, monthlyPayment: number, months: number): number {
  if (monthlyPayment * months <= netReceived) return 0;
  const pv = (r: number) => (r === 0 ? monthlyPayment * months : (monthlyPayment * (1 - Math.pow(1 + r, -months))) / r);
  let lo = 0, hi = 1; // monthly rate bounds (0%..100% a month)
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (pv(mid) > netReceived) lo = mid; else hi = mid;
  }
  return ((lo + hi) / 2) * 12 * 100;
}

export interface LoanOffer { name: string; amount: number; ratePct: number; months: number; fees: number; flat?: boolean }
export interface LoanOfferResult extends LoanOffer { emi: number; totalPaid: number; totalInterest: number; trueCostTotal: number; aprPct: number }

export function compareOffer(o: LoanOffer): LoanOfferResult {
  const e = o.flat ? flatRateEmi(o.amount, o.ratePct, o.months) : emi(o.amount, o.ratePct, o.months);
  const totalPaid = e * o.months;
  return {
    ...o,
    emi: e,
    totalPaid,
    totalInterest: totalPaid - o.amount,
    trueCostTotal: totalPaid - o.amount + o.fees,
    aprPct: aprFromPayment(o.amount - o.fees, e, o.months)
  };
}

/** Months left and interest saved by paying `extra` once now, keeping the same EMI. */
export function prepaymentEffect(balance: number, ratePct: number, currentEmi: number, extra: number) {
  const monthsFor = (bal: number) => {
    const r = ratePct / 100 / 12;
    if (bal <= 0) return 0;
    if (r === 0) return bal / currentEmi;
    if (currentEmi <= bal * r) return Infinity;
    return -Math.log(1 - (bal * r) / currentEmi) / Math.log(1 + r);
  };
  const before = monthsFor(balance);
  const after = monthsFor(balance - extra);
  const interestBefore = currentEmi * before - balance;
  const interestAfter = currentEmi * after - (balance - extra);
  return { monthsBefore: before, monthsAfter: after, interestSaved: interestBefore - interestAfter };
}
