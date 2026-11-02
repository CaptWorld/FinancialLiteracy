// "My Money Snapshot": a practical checkup from rough numbers. Each item links to what fixes it.
export interface SnapshotAnswers {
  income?: number;            // monthly in-hand
  essentials?: number;        // monthly essential spending
  emergency?: number;         // safe, quickly accessible savings
  targetMonths?: number;      // your chosen emergency-fund target in months
  highDebt?: number;          // credit card / personal loan / app loan outstanding
  cardHabit?: 'full' | 'partial' | 'none';
  health?: 'none' | 'employer' | 'personal';
  dependents?: 'yes' | 'no';
  term?: 'yes' | 'no';
  nominees?: 'all' | 'some' | 'none';
  uan?: 'yes' | 'no';
  creditReport?: 'yes' | 'no';
  investing?: number;         // monthly amount invested for long-term goals
  fraudReady?: 'yes' | 'no';
}

export type Light = 'red' | 'amber' | 'green' | 'grey';
export interface CheckItem { id: string; label: string; light: Light; detail: string; fix?: string; fixLabel?: string }

export function evaluate(a: SnapshotAnswers): CheckItem[] {
  const out: CheckItem[] = [];
  const target = a.targetMonths || 6;

  if (a.emergency != null && a.essentials) {
    const m = a.emergency / a.essentials;
    out.push({
      id: 'emergency', label: 'Emergency fund',
      light: m < 1 ? 'red' : m < target ? 'amber' : 'green',
      detail: `${m.toFixed(1)} months of essentials covered (your target: ${target}).`,
      fix: 'learn/m1-networth-budget', fixLabel: 'Lesson: emergency fund'
    });
  } else out.push({ id: 'emergency', label: 'Emergency fund', light: 'grey', detail: 'Enter essentials and emergency savings.' });

  if (a.highDebt != null || a.cardHabit) {
    const bad = (a.highDebt || 0) > 0 || a.cardHabit === 'partial';
    out.push({
      id: 'debt', label: 'High-interest debt',
      light: bad ? 'red' : 'green',
      detail: bad ? 'Card balances or costly loans are compounding against you. Clearing them is a guaranteed return.' : 'No costly debt. Keep paying cards in full.',
      fix: 'learn/m3-cards-credit', fixLabel: 'Lesson: credit cards'
    });
  } else out.push({ id: 'debt', label: 'High-interest debt', light: 'grey', detail: 'Answer the debt questions.' });

  if (a.health) out.push({
    id: 'health', label: 'Health insurance',
    light: a.health === 'none' ? 'red' : a.health === 'employer' ? 'amber' : 'green',
    detail: a.health === 'employer' ? "Employer cover ends when the job ends. Consider a personal policy early (waiting periods start when you buy)." : a.health === 'none' ? 'One hospital stay can wipe out savings.' : 'Personal cover in place. Review sub-limits and room-rent caps yearly.',
    fixLabel: 'Module 5 (coming next)'
  });
  else out.push({ id: 'health', label: 'Health insurance', light: 'grey', detail: 'Answer the health cover question.' });

  if (a.dependents) out.push({
    id: 'term', label: 'Term insurance',
    light: a.dependents === 'no' ? 'green' : a.term === 'yes' ? 'green' : 'red',
    detail: a.dependents === 'no' ? 'Nobody depends on your income yet, so term cover can wait. Revisit when that changes.' : a.term === 'yes' ? 'Covered. Check the amount is enough for your dependents.' : 'People depend on your income and there is no pure term cover.',
    fixLabel: 'Module 5 (coming next)'
  });

  if (a.nominees) out.push({
    id: 'nominees', label: 'Nominees on accounts',
    light: a.nominees === 'all' ? 'green' : a.nominees === 'some' ? 'amber' : 'red',
    detail: 'Bank accounts, FDs, EPF, mutual funds, demat and insurance should each have a nominee.',
    fix: 'learn/m3-accounts-upi', fixLabel: 'Lesson: accounts & nominees'
  });

  if (a.uan) out.push({
    id: 'uan', label: 'EPF / UAN checked',
    light: a.uan === 'yes' ? 'green' : 'amber',
    detail: a.uan === 'yes' ? 'Passbook and KYC checked.' : 'Check your EPF passbook, KYC and nominee.',
    fix: 'learn/m2-epf-gratuity', fixLabel: 'Lesson: EPF & UAN'
  });

  if (a.creditReport) out.push({
    id: 'credit', label: 'Credit report checked this year',
    light: a.creditReport === 'yes' ? 'green' : 'amber',
    detail: 'Free reports from each bureau catch errors and fraud early.',
    fix: 'learn/m3-cards-credit', fixLabel: 'Lesson: credit score'
  });

  if (a.fraudReady) out.push({
    id: 'fraud', label: 'Fraud plan ready',
    light: a.fraudReady === 'yes' ? 'green' : 'amber',
    detail: '1930 saved, alerts on, and you know the first-hour steps.',
    fix: 'learn/m3-fraud', fixLabel: 'Lesson: fraud'
  });

  if (a.income && a.investing != null) {
    const r = (a.investing / a.income) * 100;
    out.push({
      id: 'saving', label: 'Investing rate',
      light: a.investing <= 0 ? 'amber' : 'green',
      detail: `${r.toFixed(1)}% of in-hand goes to long-term investing. Only increase it once the items above are green — that's the right order.`,
      fix: 'tools/sip', fixLabel: 'SIP & step-up calculator'
    });
  }
  return out;
}

export const lightOrder: Record<Light, number> = { red: 0, amber: 1, grey: 2, green: 3 };
