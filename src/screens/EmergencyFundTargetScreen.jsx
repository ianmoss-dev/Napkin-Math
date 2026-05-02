import { useEffect, useMemo, useState } from 'react';
import { formatCurrency } from '../utils/formatters';

function calcEssentialExpenses(userData) {
  const fields = [
    'housing',
    'utilities',
    'groceries',
    'householdEssentials',
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
  ];

  const fixedTotal = fields.reduce((sum, fieldName) => sum + (userData[fieldName] || 0), 0);
  const subscriptionTotal = (userData.subscriptions || []).reduce((sum, item) => sum + (item.price || 0), 0);
  const debtMinimums = (userData.debts || []).reduce((sum, debt) => sum + (debt.minimum || 0), 0);

  return Math.round(fixedTotal + subscriptionTotal + debtMinimums);
}

export default function EmergencyFundTargetScreen({ userData, updateUserData, onNext, onBack }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const essentialExpenses = useMemo(() => calcEssentialExpenses(userData), [userData]);
  const hasVariableIncome = userData.incomeType === 'selfEmployed' || userData.partnerIncomeType === 'selfEmployed';
  const recommendedMonths = hasVariableIncome ? 6 : 3;
  const recommendedTarget = essentialExpenses * recommendedMonths;
  const stretchTarget = essentialExpenses * 6;
  const breathingRoom = userData.breathingRoom || 0;
  const monthsToTarget = breathingRoom > 0 ? Math.ceil(recommendedTarget / breathingRoom) : null;

  const handleContinue = () => {
    updateUserData({
      emergencyFundTargetMonths: recommendedMonths,
      emergencyFundTargetAmount: recommendedTarget,
    });
    onNext('recommendationSummary');
  };

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
        Emergency fund target
      </h1>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'var(--gray)', margin: '0 0 24px', lineHeight: 1.5 }}>
        This uses the essential spending you just entered.
      </p>

      <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--blue)', margin: '0 0 10px' }}>
          Essential expenses
        </p>
        <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 34, fontWeight: 700, color: 'var(--navy)', margin: '0 0 4px' }}>
          {formatCurrency(essentialExpenses)}<span style={{ fontSize: 16, fontFamily: 'DM Sans, sans-serif' }}>/mo</span>
        </p>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)', margin: 0 }}>
          Housing, utilities, groceries, transportation, health, childcare, subscriptions, and debt minimums.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        <div style={{ background: 'var(--light-blue)', borderRadius: 16, padding: 18 }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--blue)', margin: '0 0 6px' }}>
            Recommended
          </p>
          <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 700, color: 'var(--navy)', margin: '0 0 4px' }}>
            {formatCurrency(recommendedTarget)}
          </p>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--gray)', margin: 0 }}>
            {recommendedMonths} months of essentials based on your income stability.
          </p>
        </div>
        <div style={{ background: '#fff', borderRadius: 16, padding: 18, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--blue)', margin: '0 0 6px' }}>
            Stretch target
          </p>
          <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 700, color: 'var(--navy)', margin: '0 0 4px' }}>
            {formatCurrency(stretchTarget)}
          </p>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--gray)', margin: 0 }}>
            6 months of essentials.
          </p>
        </div>
      </div>

      <div style={{ background: 'var(--light-gold)', borderRadius: 16, padding: 16, marginBottom: 16 }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)', margin: 0, lineHeight: 1.5 }}>
          {hasVariableIncome
            ? 'Because at least one income is variable, the conservative target is 6 months.'
            : 'Because your income is consistent, a 3-month target is a reasonable starting point.'}
        </p>
      </div>

      <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--blue)', margin: '0 0 10px' }}>
          At your current pace
        </p>
        {monthsToTarget ? (
          <>
            <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 30, fontWeight: 700, color: 'var(--navy)', margin: '0 0 4px' }}>
              {monthsToTarget} months
            </p>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)', margin: 0, lineHeight: 1.5 }}>
              If you put your current breathing room of {formatCurrency(breathingRoom)}/month toward the recommended target.
            </p>
          </>
        ) : (
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)', margin: 0, lineHeight: 1.5 }}>
            You need positive breathing room before this can be funded steadily.
          </p>
        )}
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, height: 80, background: 'linear-gradient(transparent, #F8F9FA 40%)', pointerEvents: 'none', zIndex: 99 }} />
      <button
        onClick={handleContinue}
        style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 48px)', maxWidth: 382, height: 56, background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: 16, fontFamily: 'DM Sans, sans-serif', fontSize: 18, fontWeight: 600, cursor: 'pointer', zIndex: 100 }}
      >
        Continue
      </button>
    </div>
  );
}
