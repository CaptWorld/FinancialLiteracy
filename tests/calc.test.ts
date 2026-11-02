import { describe, it, expect } from 'vitest';
import { emi, amortization, flatRateEmi, aprFromPayment, compareOffer, prepaymentEffect } from '../src/lib/calc/loan';
import { futureValue, inflatedCost, realReturnPct, doublingYears, effectiveAnnualPct, presentValue } from '../src/lib/calc/money';
import { sipFinal, sipNeeded, costDrag } from '../src/lib/calc/sip';

describe('loan', () => {
  it('EMI matches known value: ₹10L, 9%, 20y ≈ ₹8,997', () => {
    expect(emi(1_000_000, 9, 240)).toBeCloseTo(8997.26, 1);
  });
  it('EMI with 0% is principal / months', () => {
    expect(emi(12000, 0, 12)).toBe(1000);
  });
  it('amortization ends at zero and interest sums correctly', () => {
    const rows = amortization(500_000, 10, 60);
    expect(rows.at(-1)!.balance).toBeCloseTo(0, 6);
    const paid = rows.reduce((s, r) => s + r.interest + r.principal, 0);
    expect(paid).toBeCloseTo(emi(500_000, 10, 60) * 60, 2);
  });
  it('flat 10% for 3y is far costlier than it sounds (~17.6% APR)', () => {
    const e = flatRateEmi(100_000, 10, 36);
    expect(e).toBeCloseTo(3611.11, 1);
    expect(aprFromPayment(100_000, e, 36)).toBeGreaterThan(17);
    expect(aprFromPayment(100_000, e, 36)).toBeLessThan(18.5);
  });
  it('APR of a plain loan equals its rate; fees push APR up', () => {
    const r = compareOffer({ name: 'a', amount: 200_000, ratePct: 12, months: 24, fees: 0 });
    expect(r.aprPct).toBeCloseTo(12, 2);
    const f = compareOffer({ name: 'b', amount: 200_000, ratePct: 12, months: 24, fees: 4000 });
    expect(f.aprPct).toBeGreaterThan(13.5);
  });
  it('3% a month loan app ≈ 36% APR', () => {
    const e = emi(10_000, 36, 6);
    expect(aprFromPayment(10_000, e, 6)).toBeCloseTo(36, 1);
  });
  it('prepayment shortens the loan and saves interest', () => {
    const e = emi(3_000_000, 8.5, 240);
    const p = prepaymentEffect(3_000_000, 8.5, e, 200_000);
    expect(p.monthsBefore).toBeCloseTo(240, 3);
    expect(p.monthsAfter).toBeLessThan(220);
    expect(p.interestSaved).toBeGreaterThan(200_000);
  });
});

describe('money', () => {
  it('compounding', () => {
    expect(futureValue(100_000, 10, 10)).toBeCloseTo(259_374.25, 1);
    expect(effectiveAnnualPct(12, 12)).toBeCloseTo(12.6825, 3);
  });
  it('inflation', () => {
    expect(inflatedCost(100, 6, 12)).toBeCloseTo(201.22, 1);
    expect(presentValue(201.22, 6, 12)).toBeCloseTo(100, 1);
    expect(realReturnPct(7, 6)).toBeCloseTo(0.943, 2);
  });
  it('rule of 72 is close to exact at 8%', () => {
    const d = doublingYears(8);
    expect(d.rule72).toBe(9);
    expect(d.exact).toBeCloseTo(9.006, 2);
  });
});

describe('sip', () => {
  it('₹10k/month for 10y at 12% ≈ ₹22.4L (start-of-month)', () => {
    const r = sipFinal(10_000, 12, 10);
    expect(r.invested).toBe(1_200_000);
    expect(r.value).toBeGreaterThan(2_200_000);
    expect(r.value).toBeLessThan(2_300_000);
  });
  it('0% return gives back what you put in', () => {
    expect(sipFinal(1000, 0, 5).value).toBeCloseTo(60_000, 6);
  });
  it('step-up invests more and ends higher', () => {
    const flat = sipFinal(2000, 10, 15);
    const step = sipFinal(2000, 10, 15, 10);
    expect(step.invested).toBeGreaterThan(flat.invested);
    expect(step.value).toBeGreaterThan(flat.value);
  });
  it('sipNeeded inverts sipFinal', () => {
    const need = sipNeeded(1_000_000, 10, 8, 5);
    expect(sipFinal(need, 10, 8, 5).value).toBeCloseTo(1_000_000, 0);
  });
  it('1% extra cost over 20y costs a lot', () => {
    const d = costDrag(5000, 11, 20, 0.2, 1.2);
    expect(d.difference).toBeGreaterThan(400_000);
  });
});
