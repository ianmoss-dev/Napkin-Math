import { useEffect, useMemo, useState } from 'react';
import { formatCurrency } from '../utils/formatters';

function getHighInterestDebtAmount(userData) {
  const detailed = (userData.debts || [])
    .filter((debt) => (debt.rate || 0) >= 7)
    .reduce((sum, debt) => sum + (debt.balance || 0), 0);

  if (detailed > 0) {
    return detailed;
  }

  return userData.checklistDebtBalance || 0;
}

function getCurrentPriority(userData) {
  if (userData.emergencyReady !== 'yes') {
    return {
      title: 'Build a $1,000 cushion',
      body: 'Start with cash you can reach quickly without using a credit card.',
    };
  }

  if (userData.fullMatchStatus === 'no' || userData.fullMatchStatus === 'notSure') {
    return {
      title: 'Capture the full match',
      body: 'If free employer or TSP money is available, do that before reaching for more advanced moves.',
    };
  }

  if (getHighInterestDebtAmount(userData) > 0) {
    return {
      title: 'Pay down high-interest debt',
      body: 'Expensive debt is still taking money out of the plan every month.',
    };
  }

  if ((userData.retirementSavingsMonthly || 0) <= 0) {
    return {
      title: 'Start retirement saving',
      body: 'Once the basic foundation is in place, retirement needs a steady monthly contribution.',
    };
  }

  if (userData.savingMoreRetirement === 'yes') {
    return {
      title: 'Increase retirement savings',
      body: 'You already have momentum. The next gain comes from increasing the amount going in.',
    };
  }

  if (userData.savingOtherGoals === 'yes') {
    return {
      title: 'Fund other goals',
      body: 'Your baseline is working. Now direct the extra money toward the next goal that matters.',
    };
  }

  return {
    title: 'Maintain and review',
    body: 'The basics are covered. Keep the system running and check it periodically.',
  };
}

export default function RecommendationSummaryScreen({ userData, onBack, onStartFresh }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const priority = useMemo(() => getCurrentPriority(userData), [userData]);
  const debtAmount = getHighInterestDebtAmount(userData);

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
    </div>
  );
}
