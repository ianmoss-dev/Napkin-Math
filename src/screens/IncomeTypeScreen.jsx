import { useEffect, useState } from 'react';

const CARDS = [
  {
    label: 'REGULAR EMPLOYER',
    body: 'I get a paycheck on a set schedule.',
    info: "W-2 employee. We'll ask what actually hits your bank account.",
    value: 'civilian',
  },
  {
    label: 'ACTIVE DUTY MILITARY',
    body: 'I receive a military paycheck.',
    info: "We'll reconstruct your full compensation. To build your budget we'll also need a couple numbers from your LES, because taxes.",
    value: 'military',
  },
  {
    label: 'SELF-EMPLOYED OR VARIABLE',
    body: "My income doesn't follow a set schedule.",
    info: "Contractor, freelance, or gig work. We'll build your plan around a realistic baseline.",
    value: 'selfEmployed',
  },
];

function IncomeTypeScreen({ userData, updateUserData, onNext, onBack }) {
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState(userData.incomeType ?? null);
  const [openInfo, setOpenInfo] = useState(null);

  const isSolo = userData.householdType === 'solo';

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleContinue = () => {
    const isDualMilitary = userData.partnerIncomeType === 'military' && selected === 'military';
    updateUserData({ incomeType: selected, isDualMilitary });
    onNext('prep');
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
        {isSolo ? 'What best describes your situation?' : 'What about you?'}
      </h1>
      <p style={{
        fontFamily: 'DM Sans, sans-serif',
        fontSize: 16,
        color: 'var(--gray)',
        margin: '8px 0 24px',
        lineHeight: 1.5,
      }}>
        {isSolo ? 'This shapes how we look at your income.' : "Now let's look at your situation."}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {CARDS.map((card, i) => {
          const isSelected = selected === card.value;
          const infoOpen = openInfo === card.value;
          return (
            <div
              key={card.value}
              onClick={() => setSelected(card.value)}
              style={{
                position: 'relative',
                background: isSelected ? 'var(--light-blue)' : '#fff',
                border: `2px solid ${isSelected ? 'var(--navy)' : 'transparent'}`,
                borderRadius: 16,
                padding: 20,
                paddingRight: 52,
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

              {infoOpen && (
                <p style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 14,
                  fontStyle: 'italic',
                  color: 'var(--gray)',
                  margin: '10px 0 0',
                  paddingTop: 10,
                  borderTop: '1px solid var(--light-gray)',
                  lineHeight: 1.5,
                }}>
                  {card.info}
                </p>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenInfo(infoOpen ? null : card.value);
                }}
                aria-label="More info"
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  border: '1.5px solid var(--blue)',
                  background: 'transparent',
                  color: 'var(--blue)',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 13,
                  fontStyle: 'italic',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                }}
              >
                i
              </button>
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

export default IncomeTypeScreen;
