import { useEffect, useState } from 'react';

const CONTENT = {
  civilian: {
    heading: 'One quick thing.',
    subheading: 'Grab your most recent pay stub or check your last bank deposit.',
    items: [
      { icon: '💵', label: 'Net pay (what actually hits your account)', key: 'net' },
      { icon: '📅', label: 'Pay frequency (weekly, bi-weekly, twice a month, monthly)', key: 'freq' },
      { icon: '📋', label: 'Any additional income sources', key: 'extra' },
    ],
    note: "If you don't have it handy, you can estimate — we'll prompt you to double-check.",
  },
  military: {
    heading: 'Pull up your LES.',
    subheading: 'We need two numbers from it to build your actual budget.',
    items: [
      { icon: '💳', label: 'Mid-month deposit amount', key: 'mid' },
      { icon: '💳', label: 'End-of-month deposit amount', key: 'eom' },
      { icon: '📍', label: 'Your current ZIP code (for BAH rates)', key: 'zip' },
    ],
    note: 'Access your LES on MyPay at mypay.dfas.mil. The deposit amounts are under "Remarks" or your bank statement.',
  },
  selfEmployed: {
    heading: 'This one takes a minute.',
    subheading: 'Self-employed income is harder to plan around. Here\'s what will help.',
    items: [
      { icon: '📊', label: 'Last 3 months of bank deposits', key: 'bank' },
      { icon: '📈', label: 'Your best recent month', key: 'good' },
      { icon: '📉', label: 'Your most typical month', key: 'typical' },
      { icon: '😬', label: 'Your toughest recent month', key: 'tough' },
    ],
    note: "We'll build your plan around a conservative baseline — not your best month.",
  },
};

export default function PrepScreen({ userData, onNext, onBack }) {
  const [mounted, setMounted] = useState(false);
  const [checked, setChecked] = useState({});

  const content = CONTENT[userData.incomeType] || CONTENT.civilian;

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const toggle = (key) => setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  const allChecked = content.items.every(item => checked[item.key]);

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
          <path d="M9 1L1 9L9 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <h1 style={{
        fontFamily: 'Playfair Display, serif',
        fontSize: 32,
        fontWeight: 700,
        color: 'var(--navy)',
        margin: '24px 0 0',
        lineHeight: 1.2,
      }}>
        {content.heading}
      </h1>
      <p style={{
        fontFamily: 'DM Sans, sans-serif',
        fontSize: 16,
        color: 'var(--gray)',
        margin: '8px 0 28px',
        lineHeight: 1.5,
      }}>
        {content.subheading}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
        {content.items.map((item) => {
          const isChecked = !!checked[item.key];
          return (
            <button
              key={item.key}
              onClick={() => toggle(item.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '16px 20px',
                background: isChecked ? 'var(--light-blue)' : '#fff',
                border: `2px solid ${isChecked ? 'var(--navy)' : 'transparent'}`,
                borderRadius: 16,
                boxShadow: isChecked ? 'none' : '0 2px 12px rgba(0,0,0,0.06)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'border-color 150ms, background 150ms',
              }}
            >
              <div style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                border: `2px solid ${isChecked ? 'var(--navy)' : '#D0D0D0'}`,
                background: isChecked ? 'var(--navy)' : 'transparent',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 150ms',
              }}>
                {isChecked && (
                  <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                    <path d="M1 4L4.5 7.5L11 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <span style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 16,
                  color: 'var(--gray)',
                  lineHeight: 1.4,
                }}>
                  {item.icon} {item.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div style={{
        background: 'var(--light-gold)',
        borderRadius: 12,
        padding: '14px 16px',
        marginBottom: 8,
      }}>
        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: 14,
          color: '#7A6020',
          margin: 0,
          lineHeight: 1.5,
        }}>
          {content.note}
        </p>
      </div>

      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 430,
        height: 80,
        background: 'linear-gradient(transparent, #F8F9FA 40%)',
        pointerEvents: 'none',
        zIndex: 99,
      }} />
      <button
        onClick={() => onNext('spendingPhilosophy')}
        style={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 48px)',
          maxWidth: 382,
          height: 56,
          background: 'var(--navy)',
          color: '#fff',
          border: 'none',
          borderRadius: 16,
          fontFamily: 'DM Sans, sans-serif',
          fontSize: 18,
          fontWeight: 600,
          cursor: 'pointer',
          zIndex: 100,
        }}
      >
        {allChecked ? "I'm ready" : "I'll figure it out as I go"}
      </button>
    </div>
  );
}
