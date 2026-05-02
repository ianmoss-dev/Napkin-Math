import { useEffect, useMemo, useState } from 'react';
import { formatCurrency } from '../utils/formatters';

const DEBT_RATE_DEFAULTS = {
  creditCard: 20,
  personalLoan: 12,
  autoLoan: 7,
  other: 10,
};

function QuestionBlock({ label, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 700, color: 'var(--navy)', margin: '0 0 10px' }}>
        {label}
      </p>
      {children}
    </div>
  );
}

function ChoiceRow({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {options.map((option) => {
        const active = value === option.value;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            style={{
              textAlign: 'left',
              padding: '16px 18px',
              borderRadius: 16,
              border: `2px solid ${active ? 'var(--navy)' : 'transparent'}`,
              background: active ? 'var(--light-blue)' : '#fff',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              cursor: 'pointer',
            }}
          >
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, fontWeight: 600, color: 'var(--navy)', margin: '0 0 4px' }}>
              {option.label}
            </p>
            {option.body && (
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)', margin: 0, lineHeight: 1.45 }}>
                {option.body}
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
}

function getDebtRate(type, rateInput, useEstimate) {
  if (type === 'none') return 0;
  if (!useEstimate) return Number(rateInput) || 0;
  return DEBT_RATE_DEFAULTS[type] || 10;
}

export default function ChecklistScreen({ userData, updateUserData, onNext, onBack }) {
  const [mounted, setMounted] = useState(false);
  const [emergencyReady, setEmergencyReady] = useState(userData.emergencyReady ?? null);
  const [fullMatchStatus, setFullMatchStatus] = useState(userData.fullMatchStatus ?? null);
  const [debtType, setDebtType] = useState(userData.checklistDebtType || 'none');
  const [debtBalance, setDebtBalance] = useState(userData.checklistDebtBalance ? String(userData.checklistDebtBalance) : '');
  const [useEstimatedRate, setUseEstimatedRate] = useState(userData.checklistDebtRateEstimated ?? false);
  const [debtRate, setDebtRate] = useState(
    userData.checklistDebtRate && !userData.checklistDebtRateEstimated ? String(userData.checklistDebtRate) : ''
  );
  const [retirementSavingsMonthly, setRetirementSavingsMonthly] = useState(
    userData.retirementSavingsMonthly ? String(userData.retirementSavingsMonthly) : ''
  );
  const [savingMoreRetirement, setSavingMoreRetirement] = useState(userData.savingMoreRetirement ?? null);
  const [savingOtherGoals, setSavingOtherGoals] = useState(userData.savingOtherGoals ?? null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const resolvedDebtRate = useMemo(
    () => getDebtRate(debtType, debtRate, useEstimatedRate),
    [debtRate, debtType, useEstimatedRate]
  );
  const monthlyInterest = Math.round(((Number(debtBalance) || 0) * resolvedDebtRate) / 100 / 12);

  const debtSectionComplete = debtType === 'none'
    || ((Number(debtBalance) || 0) > 0 && resolvedDebtRate > 0);

  const canContinue = emergencyReady
    && fullMatchStatus
    && debtSectionComplete
    && retirementSavingsMonthly !== ''
    && savingMoreRetirement
    && savingOtherGoals;

  const handleContinue = () => {
    updateUserData({
      emergencyReady,
      fullMatchStatus,
      checklistDebtType: debtType,
      checklistDebtBalance: debtType === 'none' ? 0 : Number(debtBalance) || 0,
      checklistDebtRate: debtType === 'none' ? 0 : resolvedDebtRate,
      checklistDebtRateEstimated: debtType === 'none' ? false : useEstimatedRate,
      retirementSavingsMonthly: Number(retirementSavingsMonthly) || 0,
      savingMoreRetirement,
      savingOtherGoals,
    });
    onNext('household');
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
      <button
        onClick={onBack}
        aria-label="Back"
        style={{
          marginTop: 16,
          width: 44,
          height: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          color: 'var(--navy)',
        }}
      >
        <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
          <path d="M9 1L1 9L9 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: 'var(--navy)', margin: '24px 0 8px', lineHeight: 1.2 }}>
        Checklist
      </h1>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'var(--gray)', margin: '0 0 24px', lineHeight: 1.5 }}>
        Answer these first. Then we will collect the pay that hits your bank and build the budget.
      </p>

      <QuestionBlock label="Could you cover a $1,000 emergency today without using a credit card or carrying it for a few months?">
        <ChoiceRow
          value={emergencyReady}
          onChange={setEmergencyReady}
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
            { value: 'notSure', label: 'Not sure' },
          ]}
        />
      </QuestionBlock>

      <QuestionBlock label="Are you getting the full employer or TSP match available to you?">
        <ChoiceRow
          value={fullMatchStatus}
          onChange={setFullMatchStatus}
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
            { value: 'notSure', label: 'Not sure' },
            { value: 'notApplicable', label: 'Not applicable' },
          ]}
        />
      </QuestionBlock>

      <QuestionBlock label="Do you have high-interest debt right now?">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          {[
            { value: 'none', label: 'No high-interest debt' },
            { value: 'creditCard', label: 'Credit card' },
            { value: 'personalLoan', label: 'Personal loan' },
            { value: 'autoLoan', label: 'Auto loan' },
            { value: 'other', label: 'Other' },
          ].map((option) => {
            const active = debtType === option.value;
            return (
              <button
                key={option.value}
                onClick={() => setDebtType(option.value)}
                style={{
                  minHeight: 56,
                  borderRadius: 14,
                  border: `2px solid ${active ? 'var(--navy)' : 'transparent'}`,
                  background: active ? 'var(--light-blue)' : '#fff',
                  color: 'var(--navy)',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                  padding: '10px 12px',
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        {debtType !== 'none' && (
          <div style={{ background: '#fff', borderRadius: 16, padding: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ marginBottom: 12 }}>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600, color: 'var(--gray)', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Balance
              </p>
              <input
                type="number"
                inputMode="decimal"
                value={debtBalance}
                onChange={(event) => setDebtBalance(event.target.value)}
                style={{ width: '100%', height: 56, borderRadius: 12, border: '2px solid #E0E0E0', padding: '0 16px', fontFamily: 'DM Sans, sans-serif', fontSize: 18, boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: 12 }}>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600, color: 'var(--gray)', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Interest rate
              </p>
              {!useEstimatedRate ? (
                <>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={debtRate}
                    onChange={(event) => setDebtRate(event.target.value)}
                    placeholder="% APR"
                    style={{ width: '100%', height: 56, borderRadius: 12, border: '2px solid #E0E0E0', padding: '0 16px', fontFamily: 'DM Sans, sans-serif', fontSize: 18, boxSizing: 'border-box' }}
                  />
                  <button
                    onClick={() => setUseEstimatedRate(true)}
                    style={{ marginTop: 8, background: 'none', border: 'none', padding: 0, color: 'var(--blue)', fontFamily: 'DM Sans, sans-serif', fontSize: 14, cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    I do not know the rate
                  </button>
                </>
              ) : (
                <div style={{ background: 'var(--light-gold)', borderRadius: 12, padding: 12 }}>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)', margin: 0, lineHeight: 1.5 }}>
                    Using an estimate of <strong>{resolvedDebtRate}% APR</strong> for this debt type.
                  </p>
                  <button
                    onClick={() => setUseEstimatedRate(false)}
                    style={{ marginTop: 8, background: 'none', border: 'none', padding: 0, color: 'var(--blue)', fontFamily: 'DM Sans, sans-serif', fontSize: 14, cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Enter the rate instead
                  </button>
                </div>
              )}
            </div>

            {monthlyInterest > 0 && (
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)', margin: 0, lineHeight: 1.5 }}>
                At {resolvedDebtRate}% APR, this balance costs about <strong style={{ color: 'var(--navy)' }}>{formatCurrency(monthlyInterest)}/month</strong> in interest.
              </p>
            )}
          </div>
        )}
      </QuestionBlock>

      <QuestionBlock label="How much are you currently saving for retirement each month?">
        <input
          type="number"
          inputMode="decimal"
          value={retirementSavingsMonthly}
          onChange={(event) => setRetirementSavingsMonthly(event.target.value)}
          style={{ width: '100%', height: 56, borderRadius: 12, border: '2px solid #E0E0E0', padding: '0 16px', fontFamily: 'DM Sans, sans-serif', fontSize: 18, boxSizing: 'border-box' }}
        />
      </QuestionBlock>

      <QuestionBlock label="Do you want to save more for retirement?">
        <ChoiceRow
          value={savingMoreRetirement}
          onChange={setSavingMoreRetirement}
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
        />
      </QuestionBlock>

      <QuestionBlock label="Are you actively saving for other goals right now?">
        <ChoiceRow
          value={savingOtherGoals}
          onChange={setSavingOtherGoals}
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
        />
      </QuestionBlock>

      {canContinue && (
        <>
          <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, height: 80, background: 'linear-gradient(transparent, #F8F9FA 40%)', pointerEvents: 'none', zIndex: 99 }} />
          <button
            onClick={handleContinue}
            style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 48px)', maxWidth: 382, height: 56, background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: 16, fontFamily: 'DM Sans, sans-serif', fontSize: 18, fontWeight: 600, cursor: 'pointer', zIndex: 100 }}
          >
            Continue
          </button>
        </>
      )}
    </div>
  );
}
