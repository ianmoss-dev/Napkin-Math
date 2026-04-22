import { useEffect, useState } from 'react';
import BinSelector from '../components/BinSelector';
import { getBins } from '../utils/calculations';

const BANDS = [[1, 2], [2, 4], [4, 6], [6, 100]];

export default function GivingScreen({ userData, updateUserData, onNext, onBack }) {
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState(userData.giving ?? null);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t); }, []);

  const bins = getBins(userData.monthlyTakeHome || 0, BANDS, 1000);

  const handleContinue = (value) => {
    updateUserData({ giving: value });
    onNext('budgetGifts');
  };

  return (
    <div style={{
      minHeight: '100dvh', padding: '4px 24px 100px', background: '#F8F9FA',
      opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(8px)',
      transition: 'opacity 300ms ease, transform 300ms ease',
    }}>
      <button onClick={onBack} aria-label="Back" style={{ marginTop: 16, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--navy)' }}>
        <svg width="10" height="18" viewBox="0 0 10 18" fill="none"><path d="M9 1L1 9L9 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>

      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: 'var(--navy)', margin: '24px 0 0' }}>
        Giving
      </h1>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'var(--gray)', margin: '8px 0 24px', lineHeight: 1.5 }}>
        Charitable giving, church, family support. Skip if it doesn't apply.
      </p>

      <BinSelector bins={bins} selectedValue={selected} onSelect={setSelected} />

      <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
        <button
          onClick={() => handleContinue(0)}
          style={{ flex: 1, height: 56, borderRadius: 16, border: '2px solid #E0E0E0', background: '#fff', color: 'var(--gray)', fontFamily: 'DM Sans, sans-serif', fontSize: 16, cursor: 'pointer' }}
        >
          Skip
        </button>
      </div>

      {selected != null && (
        <>
          <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, height: 80, background: 'linear-gradient(transparent, #F8F9FA 40%)', pointerEvents: 'none', zIndex: 99 }} />
          <button onClick={() => handleContinue(selected)} style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 48px)', maxWidth: 382, height: 56, background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: 16, fontFamily: 'DM Sans, sans-serif', fontSize: 18, fontWeight: 600, cursor: 'pointer', zIndex: 100 }}>
            Continue
          </button>
        </>
      )}
    </div>
  );
}
