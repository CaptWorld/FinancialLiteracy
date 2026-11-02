// Pure money maths. Every rate is a yearly percentage typed by the user (e.g. 9 means 9% a year).
// Nothing here knows about current tax slabs, interest rates or limits on purpose.

/** Value after compounding. compoundsPerYear: 1 = yearly, 4 = quarterly, 12 = monthly. */
export function futureValue(principal: number, ratePct: number, years: number, compoundsPerYear = 1): number {
  const r = ratePct / 100 / compoundsPerYear;
  return principal * Math.pow(1 + r, compoundsPerYear * years);
}

/** What something costing `today` will cost after `years` of inflation. */
export function inflatedCost(today: number, inflationPct: number, years: number): number {
  return today * Math.pow(1 + inflationPct / 100, years);
}

/** What `amount` received after `years` is worth in today's money. */
export function presentValue(amount: number, inflationPct: number, years: number): number {
  return amount / Math.pow(1 + inflationPct / 100, years);
}

/** Real return: what your money actually grows by after inflation (Fisher equation, exact form). */
export function realReturnPct(nominalPct: number, inflationPct: number): number {
  return ((1 + nominalPct / 100) / (1 + inflationPct / 100) - 1) * 100;
}

/** Rule of 72 estimate vs exact doubling time in years. */
export function doublingYears(ratePct: number): { rule72: number; exact: number } {
  return { rule72: 72 / ratePct, exact: Math.log(2) / Math.log(1 + ratePct / 100) };
}

/** Effective annual rate from a stated yearly rate compounded n times a year. */
export function effectiveAnnualPct(ratePct: number, compoundsPerYear: number): number {
  return (Math.pow(1 + ratePct / 100 / compoundsPerYear, compoundsPerYear) - 1) * 100;
}
