import { useEffect, useState } from 'react';
import BinSelector from '../components/BinSelector';
import { getBins } from '../utils/calculations';

export default function BudgetScreen({
  heading,
  subtext,
  percentageBands,
  fieldName,
  flagAbovePct,
  flagCopy,
  binOverrides,
  userData,
  updateUserData,
  onNext,
  onBack,
  onSelectChange,
  children,
}) {
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState(userData[fieldName] ?? null);
  const [showFlag, setShowFlag] = useState(false);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t); }, []);

  const income = userData.monthlyTakeHome || 0;
  const rawBins = getBins(income, percentageBands);
  const bins = binOverrides
    ? rawBins.map((b, i) => binOverrides[i] ? { ...b, label: binOverrides[i] } : b)
    : rawBins;

  const handleSelect = (value) => {
    setSelected(value);
    if (flagCopy && income > 0) {
      const threshold = flagAbovePct != null
        ? income * flagAbovePct / 100
        : bins[bins.length - 1]?.value;
      setShowFlag(value >= threshold);
    }
    onSelectChange?.(value);
  };

  const handleContinue = () => {
    updateUserData({ [fieldName]: selected });
    onNext();
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

      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: 'var(--navy)', margin: '24px 0 0', lineHeight: 1.2 }}>
        {heading}
      </h1>
      {subtext && (
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'var(--gray)', margin: '8px 0 24px', lineHeight: 1.5 }}>
          {subtext}
        </p>
      )}
      {!subtext && <div style={{ marginTop: 24 }} />}

      <BinSelector
        bins={bins}
        selectedValue={selected}
        onSelect={handleSelect}
      />

      {showFlag && flagCopy && (
        <div style={{ background: 'var(--light-gold)', borderRadius: 12, padding: 16, marginTop: 16 }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)', margin: 0, lineHeight: 1.5 }}>
            {flagCopy}
          </p>
        </div>
      )}

      {/* Slot for screen-specific follow-up content */}
      {children}

      {selected != null && (
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
