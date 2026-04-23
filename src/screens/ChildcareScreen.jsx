import { useEffect, useState } from 'react';
import BinSelector from '../components/BinSelector';
import { getBins } from '../utils/calculations';

const CHILDCARE_BANDS = [[5, 10], [10, 15], [15, 20], [20, 100]];
const KID_BANDS = [[1, 3], [3, 5], [5, 8], [8, 100]];

export default function ChildcareScreen({ userData, updateUserData, onNext, onBack }) {
  const [mounted, setMounted] = useState(false);
  const [hasKids, setHasKids] = useState(userData.hasKids ?? null);
  const [childcare, setChildcare] = useState(userData.childcare ?? null);
  const [kidExpenses, setKidExpenses] = useState(userData.kidExpenses ?? null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const income = userData.monthlyTakeHome || 0;
  const childcareBins = getBins(income, CHILDCARE_BANDS, 3500);
  const kidExpenseBins = getBins(income, KID_BANDS, 1500);

  const canContinue = hasKids === false || (hasKids === true && childcare != null && kidExpenses != null);

  const handleContinue = () => {
    updateUserData({
      hasKids,
      childcare: hasKids ? childcare : 0,
      kidExpenses: hasKids ? kidExpenses : 0,
    });
    onNext('budgetDebt');
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
        <svg width="10" height="18" viewBox="0 0 10 18" fill="none"><path d="M9 1L1 9L9 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>

      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: 'var(--navy)', margin: '24px 0 0', lineHeight: 1.2 }}>
        Kids
      </h1>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'var(--gray)', margin: '8px 0 24px', lineHeight: 1.5 }}>
        Let&apos;s include the costs that tend to hide in the background when you have kids.
      </p>

      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600, color: 'var(--navy)', margin: '0 0 10px' }}>
        Do you have kids or regular kid-related expenses?
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {[
          { value: false, label: 'No', body: 'Skip this section.' },
          { value: true, label: 'Yes', body: 'Show childcare and kid-related monthly costs.' },
        ].map((option) => {
          const active = hasKids === option.value;
          return (
            <button
              key={String(option.value)}
              onClick={() => setHasKids(option.value)}
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
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, fontWeight: 600, color: 'var(--navy)', margin: '0 0 4px' }}>{option.label}</p>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)', margin: 0, lineHeight: 1.45 }}>{option.body}</p>
            </button>
          );
        })}
      </div>

      {hasKids && (
        <>
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--navy)', margin: '0 0 6px' }}>
              Childcare
            </h2>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'var(--gray)', margin: '0 0 14px', lineHeight: 1.5 }}>
              Daycare, after-school care, babysitters, camps, and regular coverage.
            </p>
            <BinSelector bins={childcareBins} selectedValue={childcare} onSelect={setChildcare} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--navy)', margin: '0 0 6px' }}>
              Kid expenses
            </h2>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'var(--gray)', margin: '0 0 14px', lineHeight: 1.5 }}>
              School costs, sports, lessons, activity fees, field trips, and the constant extras.
            </p>
            <BinSelector bins={kidExpenseBins} selectedValue={kidExpenses} onSelect={setKidExpenses} />
          </div>
        </>
      )}

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
