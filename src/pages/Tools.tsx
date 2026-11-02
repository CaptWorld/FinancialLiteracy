import { useState } from 'preact/hooks';
import { Tabs, Num, Seg } from '../components/ui';
import { inr, inrShort, uid } from '../lib/data';
import { futureValue, inflatedCost, presentValue, realReturnPct, doublingYears, effectiveAnnualPct, corpusFor } from '../lib/calc/money';
import { emi, amortization, flatRateEmi, aprFromPayment, compareOffer, prepaymentEffect, type LoanOffer } from '../lib/calc/loan';
import { sipSchedule, sipNeeded, costDrag } from '../lib/calc/sip';
import { all, get, put, remove } from '../lib/store';

const TABS: [string, string][] = [['tools/compound', 'Compound & inflation'], ['tools/emi', 'EMI'], ['tools/loans', 'Compare loans'], ['tools/sip', 'SIP & step-up'], ['tools/goal', 'Goal planner'], ['tools/budget', 'Budget'], ['tools/selffund', 'Self-funding']];

export function Tools({ path }: { path: string[] }) {
  const sub = path[0] || 'compound';
  return (
    <div>
      <h1>Tools</h1>
      <p class="small muted">You type every number. Nothing here assumes today's rates, slabs or limits. Check those on the official pages linked in lessons.</p>
      <Tabs items={TABS} active={`tools/${sub}`} />
      {sub === 'compound' && <Compound />}
      {sub === 'emi' && <Emi />}
      {sub === 'loans' && <Loans />}
      {sub === 'sip' && <Sip />}
      {sub === 'goal' && <GoalPlanner />}
      {sub === 'budget' && <Budget />}
      {sub === 'selffund' && <SelfFund />}
    </div>
  );
}

const n = (v: number | undefined) => v ?? 0;

function Compound() {
  const [p, setP] = useState<number | undefined>(100000);
  const [r, setR] = useState<number | undefined>(7);
  const [y, setY] = useState<number | undefined>(10);
  const [inf, setInf] = useState<number | undefined>(6);
  const [freq, setFreq] = useState<'1' | '4' | '12'>('1');
  const fv = futureValue(n(p), n(r), n(y), Number(freq));
  const real = presentValue(fv, n(inf), n(y));
  const d = n(r) > 0 ? doublingYears(n(r)) : null;
  return (
    <section class="card">
      <h2>Compound growth vs inflation</h2>
      <div class="formgrid">
        <Num label="Amount today" suffix="₹" value={p} onInput={setP} />
        <Num label="Yearly rate / return" suffix="%" value={r} onInput={setR} />
        <Num label="Years" value={y} onInput={setY} />
        <Num label="Inflation you assume" suffix="%" value={inf} onInput={setInf} />
      </div>
      <Seg label="Compounding" value={freq} options={[['1', 'Yearly'], ['4', 'Quarterly'], ['12', 'Monthly']]} onChange={setFreq} />
      <div class="result">
        <div>Grows to <strong>{inr(fv)}</strong></div>
        <div>Worth in today's money: <strong>{inr(real)}</strong> ({real >= n(p) ? 'more' : 'less'} buying power than today)</div>
        <div class="small">Real return ≈ {realReturnPct(n(r), n(inf)).toFixed(2)}% a year · effective yearly rate {effectiveAnnualPct(n(r), Number(freq)).toFixed(2)}%</div>
        {d && <div class="small">Doubles in ≈ {d.exact.toFixed(1)} years (rule of 72 says {d.rule72.toFixed(1)})</div>}
        <div class="small">Something costing {inr(n(p))} today will cost ≈ {inr(inflatedCost(n(p), n(inf), n(y)))} in {n(y)} years.</div>
      </div>
    </section>
  );
}

function Emi() {
  const [p, setP] = useState<number | undefined>(500000);
  const [r, setR] = useState<number | undefined>(12);
  const [m, setM] = useState<number | undefined>(36);
  const [type, setType] = useState<'reducing' | 'flat'>('reducing');
  const [extra, setExtra] = useState<number | undefined>(0);
  const e = type === 'flat' ? flatRateEmi(n(p), n(r), n(m)) : emi(n(p), n(r), n(m));
  const total = e * n(m);
  const apr = type === 'flat' ? aprFromPayment(n(p), e, n(m)) : n(r);
  const rows = type === 'reducing' && n(m) > 0 && n(m) <= 600 ? amortization(n(p), n(r), n(m)) : [];
  const years: { y: number; interest: number; principal: number; balance: number }[] = [];
  rows.forEach((row) => {
    const y = Math.ceil(row.month / 12);
    const yr = years[y - 1] || (years[y - 1] = { y, interest: 0, principal: 0, balance: 0 });
    yr.interest += row.interest; yr.principal += row.principal; yr.balance = row.balance;
  });
  const pre = type === 'reducing' && n(extra) > 0 ? prepaymentEffect(n(p), n(r), e, n(extra)) : null;
  return (
    <section class="card">
      <h2>EMI calculator</h2>
      <div class="formgrid">
        <Num label="Loan amount" suffix="₹" value={p} onInput={setP} />
        <Num label="Interest rate" suffix="% a year" value={r} onInput={setR} />
        <Num label="Tenure" suffix="months" value={m} onInput={setM} />
      </div>
      <Seg label="Rate type" value={type} options={[['reducing', 'Reducing balance (normal)'], ['flat', 'Flat rate']]} onChange={setType} />
      <div class="result">
        <div>EMI: <strong>{inr(e)}</strong> / month</div>
        <div>Total paid {inr(total)} · interest {inr(total - n(p))}</div>
        {type === 'flat' && <div class="bad"><strong>A {n(r)}% flat rate is really ≈ {apr.toFixed(1)}% a year</strong> on a reducing basis. Always ask for the reducing-balance rate or APR.</div>}
      </div>
      {type === 'reducing' && (
        <>
          <Num label="One-time prepayment now (keep same EMI)" suffix="₹" value={extra} onInput={setExtra} />
          {pre && isFinite(pre.monthsAfter) && <div class="result small">Loan ends ≈ {Math.ceil(pre.monthsBefore - pre.monthsAfter)} months sooner and saves ≈ <strong>{inr(pre.interestSaved)}</strong> interest. Check your lender's prepayment charges first.</div>}
        </>
      )}
      {years.length > 0 && (
        <div class="tablewrap"><table>
          <thead><tr><th>Year</th><th class="num">Interest</th><th class="num">Principal</th><th class="num">Balance</th></tr></thead>
          <tbody>{years.map((y) => <tr><td>{y.y}</td><td class="num">{inr(y.interest)}</td><td class="num">{inr(y.principal)}</td><td class="num">{inr(y.balance)}</td></tr>)}</tbody>
        </table></div>
      )}
      {years.length > 1 && <p class="small muted">Notice how early EMIs are mostly interest. That's why prepaying early saves the most.</p>}
    </section>
  );
}

const blankOffer = (i: number): LoanOffer => ({ name: `Offer ${i}`, amount: 300000, ratePct: 12, months: 36, fees: 0 });

function Loans() {
  const [offers, setOffers] = useState<LoanOffer[]>([blankOffer(1), { ...blankOffer(2), ratePct: 11, fees: 6000 }]);
  const set = (i: number, k: keyof LoanOffer, v: any) => setOffers(offers.map((o, j) => (j === i ? { ...o, [k]: v } : o)));
  const results = offers.map(compareOffer);
  const best = results.reduce((a, b) => (b.aprPct < a.aprPct ? b : a), results[0]);
  return (
    <div>
      <p class="muted">Compare offers on true cost: rate type, fees and tenure together. The lowest headline rate isn't always cheapest.</p>
      {offers.map((o, i) => (
        <section class="card">
          <div class="row between"><input type="text" value={o.name} onInput={(e) => set(i, 'name', (e.target as HTMLInputElement).value)} style="max-width:14rem" />
            {offers.length > 1 && <button class="btn sm danger" onClick={() => setOffers(offers.filter((_, j) => j !== i))}>Remove</button>}</div>
          <div class="formgrid">
            <Num label="Amount" suffix="₹" value={o.amount} onInput={(v) => set(i, 'amount', n(v))} />
            <Num label="Rate" suffix="%" value={o.ratePct} onInput={(v) => set(i, 'ratePct', n(v))} />
            <Num label="Months" value={o.months} onInput={(v) => set(i, 'months', n(v))} />
            <Num label="Upfront fees (processing, insurance…)" suffix="₹" value={o.fees} onInput={(v) => set(i, 'fees', n(v))} />
          </div>
          <Seg label="Rate type" value={o.flat ? 'flat' : 'reducing'} options={[['reducing', 'Reducing'], ['flat', 'Flat']]} onChange={(v) => set(i, 'flat', v === 'flat')} />
        </section>
      ))}
      <button class="btn quiet" onClick={() => setOffers([...offers, blankOffer(offers.length + 1)])}>+ Add offer</button>
      <div class="tablewrap"><table>
        <thead><tr><th>Offer</th><th class="num">EMI</th><th class="num">Interest + fees</th><th class="num">True yearly cost (APR)</th></tr></thead>
        <tbody>{results.map((r) => <tr><td>{r.name} {r === best && <span class="pill ok">cheapest</span>}</td><td class="num">{inr(r.emi)}</td><td class="num">{inr(r.trueCostTotal)}</td><td class="num">{r.aprPct.toFixed(2)}%</td></tr>)}</tbody>
      </table></div>
      <p class="small muted">APR here treats fees as reducing the money you actually receive. Lenders regulated by RBI must show a Key Fact Statement with the annual cost; compare it with this.</p>
    </div>
  );
}

function Sip() {
  const [m, setM] = useState<number | undefined>(2000);
  const [r, setR] = useState<number | undefined>(10);
  const [y, setY] = useState<number | undefined>(15);
  const [step, setStep] = useState<number | undefined>(10);
  const [inf, setInf] = useState<number | undefined>(6);
  const [ca, setCa] = useState<number | undefined>(0.2);
  const [cb, setCb] = useState<number | undefined>(1.2);
  const flat = sipSchedule(n(m), n(r), n(y), 0);
  const stepped = sipSchedule(n(m), n(r), n(y), n(step));
  const last = (s: typeof flat) => s[s.length - 1] || { invested: 0, value: 0, monthly: 0 };
  const lows = [n(r) - 4, n(r) - 2].filter((x) => x > 0);
  const drag = costDrag(n(m), n(r), n(y), n(ca), n(cb));
  return (
    <div>
      <section class="card">
        <h2>SIP with yearly step-up</h2>
        <div class="formgrid">
          <Num label="Monthly SIP" suffix="₹" value={m} onInput={setM} />
          <Num label="Assumed yearly return" suffix="%" value={r} onInput={setR} />
          <Num label="Years" value={y} onInput={setY} />
          <Num label="Step-up each year" suffix="%" value={step} onInput={setStep} />
          <Num label="Inflation" suffix="%" value={inf} onInput={setInf} />
        </div>
        <div class="tablewrap"><table>
          <thead><tr><th></th><th class="num">Invested</th><th class="num">Value</th><th class="num">In today's money</th></tr></thead>
          <tbody>
            <tr><td>Flat SIP</td><td class="num">{inrShort(last(flat).invested)}</td><td class="num">{inrShort(last(flat).value)}</td><td class="num">{inrShort(presentValue(last(flat).value, n(inf), n(y)))}</td></tr>
            <tr><td>Step-up {n(step)}%</td><td class="num">{inrShort(last(stepped).invested)}</td><td class="num"><strong>{inrShort(last(stepped).value)}</strong></td><td class="num">{inrShort(presentValue(last(stepped).value, n(inf), n(y)))}</td></tr>
          </tbody>
        </table></div>
        <p class="small">With step-up, your SIP in year {n(y)} is {inr(last(stepped).monthly)}/month.</p>
        {lows.length > 0 && <div class="warnbox">Same step-up plan at lower returns: {lows.map((lr) => `${lr}% → ${inrShort(last(sipSchedule(n(m), lr, n(y), n(step))).value)}`).join(' · ')}. Real returns are uneven and some years are negative. You control the amount, costs, time and behaviour — not the return.</div>}
      </section>
      <section class="card">
        <h2>What costs do over time</h2>
        <p class="small muted">Same SIP and same gross return, two different yearly costs (e.g. direct vs regular plan expense ratios — check the fund's factsheet for real numbers).</p>
        <div class="formgrid">
          <Num label="Cost A" suffix="% a year" value={ca} onInput={setCa} />
          <Num label="Cost B" suffix="% a year" value={cb} onInput={setCb} />
        </div>
        <div class="result">A ends at <strong>{inrShort(drag.a)}</strong>, B at <strong>{inrShort(drag.b)}</strong>. Difference: <strong>{inrShort(drag.difference)}</strong> over {n(y)} years.</div>
      </section>
    </div>
  );
}

interface Goal { id: string; name: string; why: string; todayCost: number; years: number; inflation: number; ret: number; step: number; saved: number; earmarked: string }

function GoalPlanner() {
  const goals = Object.values(all<Goal>('goals'));
  const [g, setG] = useState<Goal>({ id: '', name: '', why: '', todayCost: 500000, years: 5, inflation: 6, ret: 8, step: 5, saved: 0, earmarked: '' });
  const future = inflatedCost(g.todayCost, g.inflation, g.years);
  const savedFuture = futureValue(g.saved, g.ret, g.years);
  const need = sipNeeded(Math.max(0, future - savedFuture), g.ret, g.years, g.step);
  const set = (k: keyof Goal, v: any) => setG({ ...g, [k]: v });
  return (
    <div>
      <section class="card">
        <h2>Plan a goal</h2>
        <label class="field"><span>Goal</span><input type="text" value={g.name} placeholder="e.g. Emergency fund, Bike, Parents' medical fund" onInput={(e) => set('name', (e.target as HTMLInputElement).value)} /></label>
        <label class="field"><span>Why it matters (one line)</span><input type="text" value={g.why} onInput={(e) => set('why', (e.target as HTMLInputElement).value)} /></label>
        <div class="formgrid">
          <Num label="Cost in today's money" suffix="₹" value={g.todayCost} onInput={(v) => set('todayCost', n(v))} />
          <Num label="Years away" value={g.years} onInput={(v) => set('years', n(v))} />
          <Num label="Inflation for this goal" suffix="%" value={g.inflation} onInput={(v) => set('inflation', n(v))} />
          <Num label="Assumed return" suffix="%" value={g.ret} onInput={(v) => set('ret', n(v))} />
          <Num label="Yearly step-up" suffix="%" value={g.step} onInput={(v) => set('step', n(v))} />
          <Num label="Already saved for it" suffix="₹" value={g.saved} onInput={(v) => set('saved', n(v))} />
        </div>
        <label class="field"><span>Where the money sits (e.g. "liquid fund", "index fund SIP") — no account numbers</span><input type="text" value={g.earmarked} onInput={(e) => set('earmarked', (e.target as HTMLInputElement).value)} /></label>
        <div class="result">
          <div>Needed in {g.years} years: <strong>{inr(future)}</strong></div>
          <div>Monthly SIP to start now: <strong>{inr(need)}</strong>{g.step ? `, rising ${g.step}% a year` : ''}</div>
          {g.years < 3 && <div class="small">Under ~3 years away: keep this money in safe options (FD, liquid/debt funds). Equity can be down exactly when you need it.</div>}
        </div>
        <button class="btn" disabled={!g.name.trim()} onClick={() => { const id = g.id || uid(); put('goals', id, { ...g, id }); setG({ ...g, id: '', name: '', why: '' }); }}>{g.id ? 'Update goal' : 'Save goal'}</button>
      </section>
      {goals.length > 0 && <h2>My goals</h2>}
      {goals.map((x) => {
        const fut = inflatedCost(x.todayCost, x.inflation, x.years);
        const pct = Math.min(100, (x.saved / Math.max(1, fut)) * 100);
        return (
          <section class="card">
            <div class="row between"><strong>{x.name}</strong><span class="pill">{x.years} yrs</span></div>
            {x.why && <div class="small muted">{x.why}</div>}
            <div class="small">Target {inr(fut)} · saved {inr(x.saved)}{x.earmarked ? ` · in ${x.earmarked}` : ''}</div>
            <div class="progress" style="margin:.4rem 0"><span style={`width:${pct}%`} /></div>
            <div class="row"><button class="btn sm quiet" onClick={() => { setG(x); scrollTo(0, 0); }}>Edit</button><button class="btn sm danger" onClick={() => confirm('Delete this goal?') && remove('goals', x.id)}>Delete</button></div>
          </section>
        );
      })}
    </div>
  );
}

const CATS = ['Rent & bills', 'Food & groceries', 'Transport', 'Family support', 'Shopping & fun', 'EMIs & card payments', 'Health', 'Other'];

function Budget() {
  const month = new Date().toISOString().slice(0, 7);
  const [sel, setSel] = useState(month);
  const data = get<{ income?: number; cats: Record<string, number>; invest?: number }>('budget', sel) || { cats: {} };
  const save = (d: typeof data) => put('budget', sel, d);
  const spent = Object.values(data.cats).reduce((a, b) => a + (b || 0), 0);
  const left = n(data.income) - spent - n(data.invest);
  const months = Object.keys(all('budget')).sort().reverse();
  return (
    <div>
      <section class="card">
        <h2>Monthly budget</h2>
        <label class="field"><span>Month</span><input type="month" value={sel} onInput={(e) => setSel((e.target as HTMLInputElement).value)} /></label>
        <Num label="Take-home income this month" suffix="₹" value={data.income} onInput={(v) => save({ ...data, income: v })} />
        <Num label="Saved/invested first (pay yourself first)" suffix="₹" value={data.invest} onInput={(v) => save({ ...data, invest: v })} />
        <div class="formgrid">
          {CATS.map((c) => <Num label={c} suffix="₹" value={data.cats[c]} onInput={(v) => save({ ...data, cats: { ...data.cats, [c]: n(v) } })} />)}
        </div>
        <div class="result">
          <div>Spent {inr(spent)} · invested {inr(n(data.invest))} · {left >= 0 ? 'left over' : 'overspent'} <strong class={left < 0 ? 'bad' : ''}>{inr(Math.abs(left))}</strong></div>
          {n(data.income) > 0 && <div class="small">Savings rate {((n(data.invest) / n(data.income)) * 100).toFixed(1)}%</div>}
        </div>
        {spent > 0 && <div class="tablewrap"><table><tbody>
          {CATS.filter((c) => data.cats[c]).sort((a, b) => data.cats[b] - data.cats[a]).map((c) => (
            <tr><td>{c}</td><td class="num">{inr(data.cats[c])}</td><td style="width:40%"><div class="progress"><span style={`width:${(data.cats[c] / spent) * 100}%`} /></div></td></tr>
          ))}
        </tbody></table></div>}
      </section>
      {months.length > 1 && <section class="card"><h3>Other months</h3>{months.map((mm) => <button class="btn sm quiet" style="margin:.2rem" onClick={() => setSel(mm)}>{mm}</button>)}</section>}
    </div>
  );
}

export interface SelfFundPlan {
  items: { id: string; name: string; monthly: number }[];
  withdrawal: number; // % of the corpus taken out each year (an assumption you choose)
  invested: number;   // corpus already set aside for this
  monthlySip: number; // what you add each month
  ret: number;        // assumed yearly return while building
  inflation: number;  // how fast these costs rise
}
export const defaultSelfFund = (): SelfFundPlan => ({ items: [], withdrawal: 3.5, invested: 0, monthlySip: 0, ret: 9, inflation: 6 });

/** Months until the corpus (growing by SIP + return) covers the inflating costs. Infinity if never within 50 years. */
export function monthsToSelfFund(p: SelfFundPlan): number {
  const yearly = p.items.reduce((a, b) => a + (b.monthly || 0), 0) * 12;
  if (!yearly) return Infinity;
  const r = Math.pow(1 + p.ret / 100, 1 / 12) - 1;
  let corpus = p.invested;
  for (let m = 0; m <= 600; m++) {
    const need = corpusFor(inflatedCost(yearly, p.inflation, m / 12), p.withdrawal);
    if (corpus >= need) return m;
    corpus = (corpus + p.monthlySip) * (1 + r);
  }
  return Infinity;
}

function SelfFund() {
  const plan = get<SelfFundPlan>('settings', 'selffund') || defaultSelfFund();
  const save = (p: SelfFundPlan) => put('settings', 'selffund', p);
  const [name, setName] = useState('');
  const [amt, setAmt] = useState<number | undefined>();
  const yearly = plan.items.reduce((a, b) => a + (b.monthly || 0), 0) * 12;
  const corpus = corpusFor(yearly, plan.withdrawal);
  const pct = corpus > 0 && isFinite(corpus) ? Math.min(100, (plan.invested / corpus) * 100) : 0;
  const covered = (plan.invested * plan.withdrawal) / 100 / 12;
  const months = monthsToSelfFund(plan);
  return (
    <div>
      <section class="card">
        <h2>Make your extras pay for themselves</h2>
        <p class="small">The idea: build a separate pot of investments big enough that taking out a small, steady share each year pays for your recurring extras (a subscription, regular giving), so they stop coming out of salary.</p>
        <p class="small muted">Honest version: this needs a corpus many times the yearly cost, built from savings over years. Trading isn't passive income. Returns are uneven, costs rise with inflation, and withdrawals may be taxed. Use cautious numbers.</p>
      </section>
      <section class="card">
        <h3 style="margin-top:0">Recurring extras</h3>
        {plan.items.map((it) => (
          <div class="row between check"><span>{it.name}</span><span class="row"><strong>{inr(it.monthly)}/mo</strong><button class="btn sm danger" onClick={() => save({ ...plan, items: plan.items.filter((x) => x.id !== it.id) })}>✕</button></span></div>
        ))}
        <div class="formgrid">
          <label class="field"><span>What (e.g. Claude Pro, monthly giving)</span><input type="text" value={name} onInput={(e) => setName((e.target as HTMLInputElement).value)} /></label>
          <Num label="Cost per month (check the current price)" suffix="₹" value={amt} onInput={setAmt} />
        </div>
        <button class="btn sm" disabled={!name.trim() || !amt} onClick={() => { save({ ...plan, items: [...plan.items, { id: uid(), name: name.trim(), monthly: amt! }] }); setName(''); setAmt(undefined); }}>Add</button>
      </section>
      <section class="card">
        <h3 style="margin-top:0">Your assumptions</h3>
        <div class="formgrid">
          <Num label="Withdrawal rate per year" suffix="%" value={plan.withdrawal} onInput={(v) => save({ ...plan, withdrawal: n(v) })} />
          <Num label="Already invested for this" suffix="₹" value={plan.invested} onInput={(v) => save({ ...plan, invested: n(v) })} />
          <Num label="Adding each month" suffix="₹" value={plan.monthlySip} onInput={(v) => save({ ...plan, monthlySip: n(v) })} />
          <Num label="Assumed return while building" suffix="%" value={plan.ret} onInput={(v) => save({ ...plan, ret: n(v) })} />
          <Num label="Price rise of these extras" suffix="% a year" value={plan.inflation} onInput={(v) => save({ ...plan, inflation: n(v) })} />
        </div>
        <p class="small muted">Withdrawal rate: a lower rate is safer but needs a bigger pot. You'll learn where common rules of thumb come from, and their limits, in later modules.</p>
      </section>
      {yearly > 0 && (
        <div class="result">
          <div>Extras cost <strong>{inr(yearly)}</strong> a year today.</div>
          <div>Pot needed at {plan.withdrawal}%: <strong>{inrShort(corpus)}</strong> ({[3, 4, 5].map((w) => `${w}% → ${inrShort(corpusFor(yearly, w))}`).join(' · ')})</div>
          <div class="progress" style="margin:.5rem 0"><span style={`width:${pct}%`} /></div>
          <div class="small">{pct.toFixed(1)}% there. Your pot already covers about {inr(covered)}/month.</div>
          <div class="small">{plan.monthlySip > 0 || plan.invested > 0 ? (isFinite(months) ? `At these assumptions, fully self-funding in about ${(months / 12).toFixed(1)} years (costs rise ${plan.inflation}%/yr meanwhile).` : 'At these assumptions it never catches up within 50 years. Add more each month or cut the list.') : 'Add what you invest monthly to see a timeline.'}</div>
        </div>
      )}
      <p class="small muted">Order still matters: emergency fund, no costly debt and insurance come before this pot. Check My Money Snapshot first.</p>
    </div>
  );
}
