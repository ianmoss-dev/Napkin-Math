import { useEffect, useState } from 'react';

const GATE_OPTIONS = [
  {
    value: 'emergencyFund',
    label: 'Emergency Fund',
    body: 'I need to build or finish my emergency fund before I worry about anything more advanced.',
  },
  {
    value: 'employerMatch',
    label: 'Employer Match',
    body: 'I have some cushion, and the next thing I need to lock in is my employer or TSP match.',
  },
  {
    value: 'highInterestDebt',
    label: 'High-Interest Debt',
    body: 'My next priority is getting expensive debt under control.',
  },
  {
    value: 'saveForRetirement',
    label: 'Save For Retirement',
    body: 'My foundation is decent, and I need a real retirement savings plan.',
  },
  {
    value: 'saveMoreRetirement',
    label: 'Save More For Retirement',
    body: 'I am already saving for retirement and want to push that further.',
  },
  {
    value: 'otherGoalsAdvanced',
    label: 'Other Goals / Advanced',
    body: 'Retirement is moving, and I want to focus on other goals or more advanced planning.',
  },
];

export default function TriageScreen({ userData, updateUserData, onNext, onBack }) {
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState(userData.triageGate ?? null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleContinue = () => {
    updateUserData({ triageGate: selected });
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

      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600, color: 'var(--blue)', margin: '24px 0 4px', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
        Starting Point
      </p>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: 'var(--navy)', margin: '0 0 8px', lineHeight: 1.2 }}>
        Where are you right now?
      </h1>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'var(--gray)', margin: '0 0 24px', lineHeight: 1.5 }}>
        Pick the gate that best matches your current priority. Then we&apos;ll build the income and budget picture around it.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {GATE_OPTIONS.map((option) => {
          const active = selected === option.value;
          return (
            <button
              key={option.value}
              onClick={() => setSelected(option.value)}
              style={{
                textAlign: 'left',
                padding: '16px 18px',
                borderRadius: 16,
                border: `2px solid ${active ? 'var(--navy)' : 'transparent'}`,
                background: active ? 'var(--light-blue)' : '#fff',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                cursor: 'pointer',
                transition: 'all 150ms',
              }}
            >
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, fontWeight: 600, color: 'var(--navy)', margin: '0 0 4px' }}>
                {option.label}
              </p>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)', margin: 0, lineHeight: 1.45 }}>
                {option.body}
              </p>
            </button>
          );
        })}
      </div>

      <div style={{ background: 'var(--light-gold)', borderRadius: 12, padding: 14, marginTop: 18 }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)', margin: 0, lineHeight: 1.5 }}>
          Next we&apos;ll establish household income, then walk through the budget so the recommendations match real life.
        </p>
      </div>

      {selected && (
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
