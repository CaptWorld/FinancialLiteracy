// SIP (monthly investing) maths. Assumes a steady yearly return for illustration only:
// real returns arrive unevenly, and some years are negative.

export interface SipYear { year: number; monthly: number; invested: number; value: number }

/**
 * Invest `monthly` at the start of each month; raise the monthly amount by `stepUpPct` every 12 months.
 * Returns year-end totals.
 */
export function sipSchedule(monthly: number, returnPct: number, years: number, stepUpPct = 0): SipYear[] {
  const r = Math.pow(1 + returnPct / 100, 1 / 12) - 1; // monthly rate equivalent to the yearly return
  let value = 0, invested = 0, amt = monthly;
  const out: SipYear[] = [];
  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) {
      value = (value + amt) * (1 + r);
      invested += amt;
    }
    out.push({ year: y, monthly: amt, invested, value });
    amt = amt * (1 + stepUpPct / 100);
  }
  return out;
}

export function sipFinal(monthly: number, returnPct: number, years: number, stepUpPct = 0) {
  const s = sipSchedule(monthly, returnPct, years, stepUpPct);
  return s.length ? { invested: s[s.length - 1].invested, value: s[s.length - 1].value } : { invested: 0, value: 0 };
}

/** Monthly SIP needed today (with an optional yearly step-up) to reach `target` in `years`. */
export function sipNeeded(target: number, returnPct: number, years: number, stepUpPct = 0): number {
  const per1 = sipFinal(1, returnPct, years, stepUpPct).value;
  return per1 > 0 ? target / per1 : 0;
}

/** Cost drag: final value with two different yearly costs (e.g. expense ratios), same gross return. */
export function costDrag(monthly: number, grossReturnPct: number, years: number, costAPct: number, costBPct: number) {
  const a = sipFinal(monthly, grossReturnPct - costAPct, years).value;
  const b = sipFinal(monthly, grossReturnPct - costBPct, years).value;
  return { a, b, difference: a - b };
}
