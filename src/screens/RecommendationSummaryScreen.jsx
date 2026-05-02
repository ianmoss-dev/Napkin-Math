import { useEffect, useMemo, useState } from 'react';
import { monthsToPayoff } from '../utils/calculations';
import { formatCurrency } from '../utils/formatters';

const CATEGORY_CONFIG = [
  { key: 'housing', label: 'Housing', value: (userData) => userData.housing || 0, flexible: false },
  { key: 'utilities', label: 'Utilities', value: (userData) => userData.utilities || 0, flexible: false },
  { key: 'groceries', label: 'Groceries', value: (userData) => userData.groceries || 0, flexible: true },
  { key: 'householdEssentials', label: 'Household', value: (userData) => userData.householdEssentials || 0, flexible: true },
  { key: 'diningOut', label: 'Dining out', value: (userData) => userData.diningOut || 0, flexible: true },
  { key: 'carPayment', label: 'Car payment', value: (userData) => userData.carPayment || 0, flexible: false },
  { key: 'gasAndFuel', label: 'Gas and fuel', value: (userData) => userData.gasAndFuel || 0, flexible: false },
  { key: 'carInsurance', label: 'Car insurance', value: (userData) => userData.carInsurance || 0, flexible: false },
  { key: 'phone', label: 'Phone', value: (userData) => userData.phone || 0, flexible: false },
  { key: 'internet', label: 'Internet', value: (userData) => userData.internet || 0, flexible: false },
  { key: 'homeMaintenance', label: 'Home maintenance', value: (userData) => userData.homeMaintenance || 0, flexible: false },
  { key: 'healthInsurance', label: 'Health insurance', value: (userData) => userData.healthInsurance || 0, flexible: false },
  { key: 'outOfPocketMedical', label: 'Medical', value: (userData) => userData.outOfPocketMedical || 0, flexible: false },
  { key: 'childcare', label: 'Childcare', value: (userData) => userData.childcare || 0, flexible: false },
  { key: 'kidExpenses', label: 'Kid expenses', value: (userData) => userData.kidExpenses || 0, flexible: true },
  { key: 'debtMinimums', label: 'Debt minimums', value: (userData) => (userData.debts || []).reduce((sum, debt) => sum + (debt.minimum || 0), 0), flexible: false },
  { key: 'clothing', label: 'Clothing', value: (userData) => userData.clothing || 0, flexible: true },
  { key: 'personalCare', label: 'Personal care', value: (userData) => userData.personalCare || 0, flexible: true },
  { key: 'entertainment', label: 'Entertainment', value: (userData) => userData.entertainment || 0, flexible: true },
  { key: 'pets', label: 'Pets', value: (userData) => userData.pets || 0, flexible: true },
  { key: 'travel', label: 'Travel', value: (userData) => userData.travel || 0, flexible: true },
  { key: 'gifts', label: 'Gifts', value: (userData) => userData.gifts || 0, flexible: true },
  { key: 'giving', label: 'Giving', value: (userData) => userData.giving || 0, flexible: true },
  { key: 'subscriptions', label: 'Subscriptions', value: (userData) => (userData.subscriptions || []).reduce((sum, item) => sum + (item.price || 0), 0), flexible: true },
];

function roundToNearestFive(amount) {
  if (amount <= 0) return 0;
  return Math.max(5, Math.round(amount / 5) * 5);
}

function getHighInterestDebtAmount(userData) {
  const detailed = (userData.debts || [])
    .filter((debt) => (debt.rate || 0) >= 7)
    .reduce((sum, debt) => sum + (debt.balance || 0), 0);

  if (detailed > 0) {
    return detailed;
  }

  return userData.checklistDebtBalance || 0;
}

function getDebtSummary(userData) {
  const detailedDebts = (userData.debts || []).filter((debt) => (debt.balance || 0) > 0);
  const highInterestDebts = detailedDebts.filter((debt) => (debt.rate || 0) >= 7);

  if (highInterestDebts.length > 0) {
    const balance = highInterestDebts.reduce((sum, debt) => sum + (debt.balance || 0), 0);
    const weightedRate = balance > 0
      ? highInterestDebts.reduce((sum, debt) => sum + ((debt.balance || 0) * (debt.rate || 0)), 0) / balance
      : 0;
    const minimums = highInterestDebts.reduce((sum, debt) => sum + (debt.minimum || 0), 0);
    return { balance, rate: weightedRate, minimums };
  }

  const checklistBalance = userData.checklistDebtBalance || 0;
  const checklistRate = userData.checklistDebtRate || 0;
  return {
    balance: checklistBalance,
    rate: checklistRate,
    minimums: 0,
  };
}

function getCurrentPriority(userData) {
  if (userData.emergencyReady !== 'yes') {
    return {
      key: 'emergency',
      title: 'Build a $1,000 cushion',
      body: 'Start with cash you can reach quickly without using a credit card.',
      actionLabel: 'Put into savings',
      targetAmount: 1000,
    };
  }

  if (userData.fullMatchStatus === 'no' || userData.fullMatchStatus === 'notSure') {
    return {
      key: 'match',
      title: 'Capture the full match',
      body: 'If free employer or TSP money is available, do that before reaching for more advanced moves.',
      actionLabel: 'Raise retirement saving by',
      targetAmount: null,
    };
  }

  if (getHighInterestDebtAmount(userData) > 0) {
    return {
      key: 'debt',
      title: 'Pay down high-interest debt',
      body: 'Expensive debt is still taking money out of the plan every month.',
      actionLabel: 'Pay extra toward debt',
      targetAmount: getHighInterestDebtAmount(userData),
    };
  }

  if ((userData.retirementSavingsMonthly || 0) <= 0) {
    return {
      key: 'retirementStart',
      title: 'Start retirement saving',
      body: 'Once the basic foundation is in place, retirement needs a steady monthly contribution.',
      actionLabel: 'Start contributing',
      targetAmount: null,
    };
  }

  if (userData.savingMoreRetirement === 'yes') {
    return {
      key: 'retirementMore',
      title: 'Increase retirement savings',
      body: 'You already have momentum. The next gain comes from increasing the amount going in.',
      actionLabel: 'Increase retirement saving by',
      targetAmount: null,
    };
  }

  if (userData.savingOtherGoals === 'yes') {
    return {
      key: 'goals',
      title: 'Fund other goals',
      body: 'Your baseline is working. Now direct the extra money toward the next goal that matters.',
      actionLabel: 'Keep available for your next goal',
      targetAmount: null,
    };
  }

  return {
    key: 'maintain',
    title: 'Maintain and review',
    body: 'The basics are covered. Keep the system running and check it periodically.',
    actionLabel: 'Keep available each month',
    targetAmount: null,
  };
}

function getCategorySpending(userData) {
  return CATEGORY_CONFIG
    .map((category) => ({
      key: category.key,
      label: category.label,
      value: Math.round(category.value(userData)),
      flexible: category.flexible,
    }))
    .filter((category) => category.value > 0);
}

function getTopFlexibleCategories(userData, limit = 3) {
  return getCategorySpending(userData)
    .filter((category) => category.flexible)
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

function getActionAmount(priorityKey, userData) {
  const breathingRoom = Math.max(0, userData.breathingRoom || 0);

  switch (priorityKey) {
    case 'emergency':
      return breathingRoom >= 250 ? 250 : 250;
    case 'debt':
      return breathingRoom >= 250 ? 250 : 250;
    case 'match':
      return breathingRoom >= 150 ? 150 : 100;
    case 'retirementStart':
      return breathingRoom >= 150 ? 150 : 100;
    case 'retirementMore':
      return breathingRoom >= 200 ? 200 : 150;
    case 'goals':
      return breathingRoom >= 250 ? 250 : 150;
    case 'maintain':
      return breathingRoom >= 250 ? 250 : Math.max(0, breathingRoom);
    default:
      return 0;
  }
}

function buildCutPlan(categories, targetAmount) {
  if (!categories.length || targetAmount <= 0) {
    return [];
  }

  if (categories.length === 1) {
    return [{ ...categories[0], cut: roundToNearestFive(targetAmount) }];
  }

  const first = categories[0];
  const second = categories[1];
  const firstCap = Math.max(25, roundToNearestFive(first.value * 0.3));
  const secondCap = Math.max(25, roundToNearestFive(second.value * 0.3));

  let firstCut = Math.min(firstCap, roundToNearestFive(targetAmount * 0.6));
  let secondCut = Math.min(secondCap, roundToNearestFive(targetAmount - firstCut));
  let remaining = targetAmount - firstCut - secondCut;

  if (remaining > 0 && firstCut < first.value) {
    const extra = Math.min(remaining, Math.max(0, roundToNearestFive(first.value * 0.4) - firstCut));
    firstCut += extra;
    remaining -= extra;
  }

  if (remaining > 0 && secondCut < second.value) {
    const extra = Math.min(remaining, Math.max(0, roundToNearestFive(second.value * 0.4) - secondCut));
    secondCut += extra;
    remaining -= extra;
  }

  const cutPlan = [
    { ...first, cut: firstCut },
    { ...second, cut: secondCut },
  ].filter((item) => item.cut > 0);

  if (remaining > 0) {
    cutPlan.push({ label: 'Other flexible spending', value: 0, cut: remaining });
  }

  return cutPlan;
}

function getTimeline(priority, actionAmount, userData, debtSummary) {
  if (actionAmount <= 0) {
    return null;
  }

  if (priority.key === 'emergency') {
    return {
      value: Math.ceil((priority.targetAmount || 1000) / actionAmount),
      label: 'months to reach $1,000',
    };
  }

  if (priority.key === 'debt' && debtSummary.balance > 0) {
    const payment = Math.max(actionAmount + (debtSummary.minimums || 0), 1);
    return {
      value: monthsToPayoff(debtSummary.balance, debtSummary.rate || 0, payment),
      label: 'months to clear high-interest debt',
    };
  }

  if (priority.key === 'match') {
    return {
      value: 1,
      label: 'pay cycle to make the change',
    };
  }

  return null;
}

export default function RecommendationSummaryScreen({ userData, onBack, onStartFresh }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const priority = useMemo(() => getCurrentPriority(userData), [userData]);
  const debtSummary = useMemo(() => getDebtSummary(userData), [userData]);
  const debtAmount = debtSummary.balance;
  const topFlexibleCategories = useMemo(() => getTopFlexibleCategories(userData), [userData]);
  const actionAmount = useMemo(() => getActionAmount(priority.key, userData), [priority.key, userData]);
  const cutPlan = useMemo(() => buildCutPlan(topFlexibleCategories, actionAmount), [topFlexibleCategories, actionAmount]);
  const timeline = useMemo(() => getTimeline(priority, actionAmount, userData, debtSummary), [actionAmount, debtSummary, priority, userData]);
  const breathingRoom = userData.breathingRoom || 0;
  const recommendedSourceText = cutPlan.length >= 2
    ? `${formatCurrency(cutPlan[0].cut)} from ${cutPlan[0].label.toLowerCase()} and ${formatCurrency(cutPlan[1].cut)} from ${cutPlan[1].label.toLowerCase()}`
    : cutPlan.length === 1
      ? `${formatCurrency(cutPlan[0].cut)} from ${cutPlan[0].label.toLowerCase()}`
      : null;
  const topCategoryText = topFlexibleCategories.length >= 2
    ? `${topFlexibleCategories[0].label} and ${topFlexibleCategories[1].label}`
    : topFlexibleCategories[0]?.label || null;
  const summaryLine = (() => {
    if (priority.key === 'emergency') {
      return `Save ${formatCurrency(actionAmount)}/month in a savings account at your bank${recommendedSourceText ? ` by reducing ${recommendedSourceText}` : ''}.`;
    }

    if (priority.key === 'debt') {
      return `Pay ${formatCurrency(actionAmount)}/month extra toward high-interest debt${recommendedSourceText ? ` by reducing ${recommendedSourceText}` : ''}.`;
    }

    if (priority.key === 'match') {
      return `Increase retirement contributions by at least ${formatCurrency(actionAmount)}/month now, then raise it until you capture the full match.`;
    }

    if (priority.key === 'retirementStart') {
      return `Start with ${formatCurrency(actionAmount)}/month into retirement and automate it on payday.`;
    }

    if (priority.key === 'retirementMore') {
      return `Increase retirement saving by ${formatCurrency(actionAmount)}/month and automate the change.`;
    }

    if (priority.key === 'goals') {
      return `Keep ${formatCurrency(actionAmount)}/month available for your next goal while we add goal-specific planning.`;
    }

    return 'Keep your current system running and revisit this when a new goal shows up.';
  })();

  return (
    <div style={{
      minHeight: '100dvh',
      padding: '4px 24px 100px',
      background: '#F8F9FA',
      opacity: mounted ? 1 : 0,
      transform: mounted ? 'translateY(0)' : 'translateY(8px)',
      transition: 'opacity 300ms ease, transform 300ms ease',
    }}>
      <button onClick={onBack} aria-label="Back" style={{ marginTop: 16, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--navy)' }}>
        <svg width="10" height="18" viewBox="0 0 10 18" fill="none"><path d="M9 1L1 9L9 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>

      <button
        onClick={onStartFresh}
        style={{ marginTop: 12, background: 'transparent', border: 'none', padding: 0, color: 'var(--blue)', fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
      >
        Start over
      </button>

      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: 'var(--navy)', margin: '24px 0 8px', lineHeight: 1.2 }}>
        Recommendation summary
      </h1>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'var(--gray)', margin: '0 0 24px', lineHeight: 1.5 }}>
        Based on your checklist and the numbers you entered, this is the next job.
      </p>

      <div style={{ background: 'var(--navy)', borderRadius: 20, padding: 24, marginBottom: 16 }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', margin: '0 0 8px' }}>
          Priority
        </p>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 34, fontWeight: 700, color: '#fff', margin: '0 0 10px', lineHeight: 1.1 }}>
          {priority.title}
        </h2>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'rgba(255,255,255,0.86)', margin: 0, lineHeight: 1.5 }}>
          {priority.body}
        </p>
      </div>

      <div style={{ background: '#DCEBFA', borderRadius: 16, padding: 20, marginBottom: 16 }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--blue)', margin: '0 0 10px' }}>
          Based on your numbers
        </p>
        <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 700, color: 'var(--navy)', margin: '0 0 10px', lineHeight: 1.15 }}>
          {summaryLine}
        </p>
        {topCategoryText && (
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)', margin: 0, lineHeight: 1.5 }}>
            Your largest flexible categories right now are {topCategoryText.toLowerCase()}.
          </p>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 18, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--blue)', margin: '0 0 10px' }}>
            Monthly action
          </p>
          <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 30, fontWeight: 700, color: 'var(--navy)', margin: '0 0 4px' }}>
            {formatCurrency(actionAmount)}
          </p>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--gray)', margin: 0, lineHeight: 1.5 }}>
            {priority.actionLabel}
          </p>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, padding: 18, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--blue)', margin: '0 0 10px' }}>
            Timeline
          </p>
          <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 30, fontWeight: 700, color: 'var(--navy)', margin: '0 0 4px' }}>
            {timeline ? timeline.value : 'Next'}
          </p>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--gray)', margin: 0, lineHeight: 1.5 }}>
            {timeline ? timeline.label : 'Goal planning gets deeper in the next version.'}
          </p>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--blue)', margin: '0 0 12px' }}>
          Your snapshot
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)' }}>Monthly take-home</span>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600, color: 'var(--navy)' }}>{formatCurrency(userData.monthlyTakeHome || 0)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)' }}>Breathing room</span>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600, color: 'var(--navy)' }}>{formatCurrency(userData.breathingRoom || 0)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)' }}>Retirement saving now</span>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600, color: 'var(--navy)' }}>{formatCurrency(userData.retirementSavingsMonthly || 0)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)' }}>High-interest debt tracked</span>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600, color: 'var(--navy)' }}>{formatCurrency(debtAmount)}</span>
        </div>
      </div>

      {cutPlan.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--blue)', margin: '0 0 12px' }}>
            Where to find it
          </p>
          {cutPlan.map((item) => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #EEF2F5' }}>
              <div>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600, color: 'var(--navy)', margin: '0 0 4px' }}>
                  {item.label}
                </p>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--gray)', margin: 0 }}>
                  Current budget: {item.value > 0 ? formatCurrency(item.value) : 'Flexible'}
                </p>
              </div>
              <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: 'var(--navy)', margin: 0 }}>
                {formatCurrency(item.cut)}
              </p>
            </div>
          ))}
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--gray)', margin: '12px 0 0', lineHeight: 1.5 }}>
            Start with the largest flexible categories first. Smaller cuts in two places usually stick better than one extreme cut.
          </p>
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--blue)', margin: '0 0 12px' }}>
          Emergency fund target
        </p>
        <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 700, color: 'var(--navy)', margin: '0 0 6px' }}>
          {formatCurrency(userData.emergencyFundTargetAmount || 0)}
        </p>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)', margin: 0, lineHeight: 1.5 }}>
          Based on {userData.emergencyFundTargetMonths || 0} months of essential spending.
        </p>
      </div>

      <div style={{ background: breathingRoom >= 0 ? 'var(--light-blue)' : 'var(--light-gold)', borderRadius: 16, padding: 16, marginTop: 16 }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)', margin: 0, lineHeight: 1.5 }}>
          {breathingRoom >= 0
            ? `You currently have ${formatCurrency(breathingRoom)} left each month before this next move.`
            : `You are currently short ${formatCurrency(Math.abs(breathingRoom))} each month, so the first job is trimming spending before adding a new savings target.`}
        </p>
      </div>
    </div>
  );
}
