import { useEffect, useMemo, useState } from 'react';
import { formatCurrency } from '../utils/formatters';

function calcTotals(userData) {
  const fields = [
    'housing',
    'utilities',
    'groceries',
    'householdEssentials',
    'diningOut',
    'carPayment',
    'gasAndFuel',
    'carInsurance',
    'phone',
    'internet',
    'homeMaintenance',
    'healthInsurance',
    'outOfPocketMedical',
    'childcare',
    'kidExpenses',
    'clothing',
    'personalCare',
    'entertainment',
    'pets',
    'travel',
    'gifts',
    'giving',
  ];

  const fixedTotal = fields.reduce((sum, fieldName) => sum + (userData[fieldName] || 0), 0);
  const subscriptionTotal = (userData.subscriptions || []).reduce((sum, item) => sum + (item.price || 0), 0);
  const debtMinimums = (userData.debts || []).reduce((sum, debt) => sum + (debt.minimum || 0), 0);
  const totalExpenses = Math.round(fixedTotal + subscriptionTotal + debtMinimums);
  const breathingRoom = Math.round((userData.monthlyTakeHome || 0) - totalExpenses);

  return { totalExpenses, breathingRoom };
}

export default function MonthlyPictureScreen({ userData, updateUserData, onNext, onBack }) {
  const [mounted, setMounted] = useState(false);
  const { totalExpenses, breathingRoom } = useMemo(() => calcTotals(userData), [userData]);
  const income = userData.monthlyTakeHome || 0;
  const expensePct = income > 0 ? Math.min(100, Math.round((totalExpenses / income) * 100)) : 0;
  const breathingPct = income > 0 ? Math.max(0, Math.round((Math.max(breathingRoom, 0) / income) * 100)) : 0;

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (userData.totalMonthlyExpenses !== totalExpenses || userData.breathingRoom !== breathingRoom) {
      updateUserData({ totalMonthlyExpenses: totalExpenses, breathingRoom });
    }
  }, [breathingRoom, totalExpenses, updateUserData, userData.breathingRoom, userData.totalMonthlyExpenses]);

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

      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: 'var(--navy)', margin: '24px 0 8px', lineHeight: 1.2 }}>
        Monthly picture
      </h1>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'var(--gray)', margin: '0 0 24px', lineHeight: 1.5 }}>
        This is what is coming in, what is going out, and what is left.
      </p>

      <div style={{ background: '#fff', borderRadius: 20, padding: 20, marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Coming in', value: income, color: 'var(--navy)' },
            { label: 'Going out', value: totalExpenses, color: 'var(--navy)' },
            { label: 'Left over', value: breathingRoom, color: breathingRoom >= 0 ? 'var(--green)' : 'var(--red)' },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gray)', margin: '0 0 6px' }}>
                {stat.label}
              </p>
              <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: stat.color, margin: 0, lineHeight: 1 }}>
                {formatCurrency(Math.abs(stat.value))}
              </p>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--gray)' }}>Expenses</span>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--navy)' }}>{expensePct}% of income</span>
          </div>
          <div style={{ height: 14, borderRadius: 999, background: '#E7EDF3', overflow: 'hidden' }}>
            <div style={{ width: `${expensePct}%`, height: '100%', background: 'var(--navy)' }} />
          </div>
        </div>

        {breathingRoom > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--gray)' }}>Breathing room</span>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--green)' }}>{breathingPct}% of income</span>
            </div>
            <div style={{ height: 14, borderRadius: 999, background: '#E8F5E9', overflow: 'hidden' }}>
              <div style={{ width: `${breathingPct}%`, height: '100%', background: 'var(--green)' }} />
            </div>
          </div>
        )}
      </div>

      <div style={{ background: breathingRoom >= 0 ? 'var(--light-blue)' : 'var(--light-gold)', borderRadius: 16, padding: 16 }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)', margin: 0, lineHeight: 1.5 }}>
          {breathingRoom >= 0
            ? `You have ${formatCurrency(breathingRoom)} left after expenses each month.`
            : `You are short ${formatCurrency(Math.abs(breathingRoom))} each month before savings.`}
        </p>
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, height: 80, background: 'linear-gradient(transparent, #F8F9FA 40%)', pointerEvents: 'none', zIndex: 99 }} />
      <button
        onClick={() => onNext('emergencyFundTarget')}
        style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 48px)', maxWidth: 382, height: 56, background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: 16, fontFamily: 'DM Sans, sans-serif', fontSize: 18, fontWeight: 600, cursor: 'pointer', zIndex: 100 }}
      >
        Continue
      </button>
    </div>
  );
}
