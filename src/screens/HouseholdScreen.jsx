import { useEffect, useState } from 'react';

const CARDS = [
  {
    label: 'JUST ME',
    body: 'This plan covers my finances only.',
    value: 'solo',
  },
  {
    label: 'ME AND MY PARTNER',
    body: 'We want a plan that covers our household.',
    value: 'partner',
  },
];

function HouseholdScreen({ userData, updateUserData, onNext, onBack }) {
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState(userData.householdType ?? null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleContinue = () => {
    updateUserData({ householdType: selected });
    onNext(selected === 'partner' ? 'partnerIncome' : 'incomeType');
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
        Who is this plan for?
      </h1>
      <p style={{
        fontFamily: 'DM Sans, sans-serif',
        fontSize: 16,
        color: 'var(--gray)',
        margin: '8px 0 24px',
        lineHeight: 1.5,
      }}>
        This helps us make sure we capture everything.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {CARDS.map((card, i) => {
          const isSelected = selected === card.value;
          return (
            <div
              key={card.value}
              onClick={() => setSelected(card.value)}
              style={{
                background: isSelected ? 'var(--light-blue)' : '#fff',
                border: `2px solid ${isSelected ? 'var(--navy)' : 'transparent'}`,
                borderRadius: 16,
                padding: 20,
                boxShadow: isSelected ? 'none' : '0 2px 12px rgba(0,0,0,0.06)',
                cursor: 'pointer',
                transitionProperty: 'opacity, transform, border-color, background',
                transitionDuration: '300ms, 300ms, 150ms, 150ms',
                transitionDelay: `${i * 80}ms, ${i * 80}ms, 0ms, 0ms`,
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(8px)',
              }}
            >
              <p style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--blue)',
                margin: '0 0 6px',
              }}>
                {card.label}
              </p>
              <p style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 17,
                color: 'var(--gray)',
                lineHeight: 1.5,
                margin: 0,
              }}>
                {card.body}
              </p>
            </div>
          );
        })}
      </div>

      {selected && (
        <>
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
            onClick={handleContinue}
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
            Continue
          </button>
        </>
      )}
    </div>
  );
}

export default HouseholdScreen;
