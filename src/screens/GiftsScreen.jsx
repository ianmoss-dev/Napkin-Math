import { useEffect, useState, useMemo } from 'react';
import { formatCurrency } from '../utils/formatters';

function ChipRow({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map(opt => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            style={{
              height: 40, paddingInline: 14, borderRadius: 20,
              border: `1.5px solid ${active ? 'var(--navy)' : '#D0D0D0'}`,
              background: active ? 'var(--navy)' : '#fff',
              color: active ? '#fff' : 'var(--gray)',
              fontFamily: 'DM Sans, sans-serif', fontSize: 13,
              fontWeight: active ? 600 : 400, cursor: 'pointer',
              transition: 'all 150ms', whiteSpace: 'nowrap',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

const GIFT_COSTS = [
  { label: 'Under $25', value: 20 },
  { label: '$25 – $50', value: 37 },
  { label: '$50 – $100', value: 75 },
  { label: '$100+', value: 150 },
];

const CHRISTMAS_COSTS = [
  { label: 'Under $200', value: 150 },
  { label: '$200 – $500', value: 350 },
  { label: '$500 – $1,000', value: 750 },
  { label: '$1,000+', value: 1400 },
];

const QTY_OPTIONS = [
  { label: '0', value: 0 },
  { label: '1–3', value: 2 },
  { label: '4–8', value: 6 },
  { label: '9–15', value: 12 },
  { label: '15+', value: 20 },
];

export default function GiftsScreen({ updateUserData, onNext, onBack }) {
  const [mounted, setMounted] = useState(false);
  const [bdayQty, setBdayQty] = useState(4);
  const [bdayCost, setBdayCost] = useState(37);
  const [xmasCost, setXmasCost] = useState(350);
  const [doXmas, setDoXmas] = useState(true);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t); }, []);

  const total = useMemo(() => {
    const bday = (bdayQty * bdayCost) / 12;
    const xmas = doXmas ? xmasCost / 12 : 0;
    return Math.round(bday + xmas);
  }, [bdayQty, bdayCost, xmasCost, doXmas]);

  const handleContinue = () => {
    updateUserData({ gifts: total });
    onNext('budgetTravel');
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

      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: 'var(--navy)', margin: '24px 0 4px', lineHeight: 1.2 }}>
        Gifts
      </h1>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'var(--gray)', margin: '0 0 20px', lineHeight: 1.5 }}>
        Birthdays, holidays, celebrations. We'll average it monthly so nothing surprises you.
      </p>

      {/* Running total */}
      <div style={{ background: 'var(--navy)', borderRadius: 16, padding: '14px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: 0 }}>Monthly average</p>
        <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, fontWeight: 700, color: '#fff', margin: 0 }}>{formatCurrency(total)}/mo</p>
      </div>

      {/* Birthday gifts */}
      <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--blue)', margin: '0 0 12px' }}>
          Birthday gifts per year
        </p>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--gray)', margin: '0 0 8px' }}>How many do you buy?</p>
        <ChipRow
          options={QTY_OPTIONS}
          value={bdayQty}
          onChange={setBdayQty}
        />
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--gray)', margin: '16px 0 8px' }}>Typical spend per gift</p>
        <ChipRow
          options={GIFT_COSTS}
          value={bdayCost}
          onChange={setBdayCost}
        />
        {bdayQty > 0 && (
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#BDBDBD', margin: '8px 0 0', fontStyle: 'italic' }}>
            {bdayQty} × {formatCurrency(bdayCost)} = {formatCurrency(bdayQty * bdayCost)}/yr · {formatCurrency(Math.round(bdayQty * bdayCost / 12))}/mo
          </p>
        )}
      </div>

      {/* Holiday / Christmas */}
      <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--blue)', margin: 0 }}>
            Holiday giving
          </p>
          <button
            onClick={() => setDoXmas(v => !v)}
            style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--blue)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {doXmas ? 'Skip this' : 'Add this'}
          </button>
        </div>
        {doXmas ? (
          <>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--gray)', margin: '0 0 8px' }}>Total holiday gift budget per year</p>
            <ChipRow
              options={CHRISTMAS_COSTS}
              value={xmasCost}
              onChange={setXmasCost}
            />
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#BDBDBD', margin: '8px 0 0', fontStyle: 'italic' }}>
              {formatCurrency(xmasCost)}/yr · {formatCurrency(Math.round(xmasCost / 12))}/mo averaged
            </p>
          </>
        ) : (
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: '#BDBDBD', margin: 0, fontStyle: 'italic' }}>
            Not factored in.
          </p>
        )}
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, height: 80, background: 'linear-gradient(transparent, #F8F9FA 40%)', pointerEvents: 'none', zIndex: 99 }} />
      <button
        onClick={handleContinue}
        style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 48px)', maxWidth: 382, height: 56, background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: 16, fontFamily: 'DM Sans, sans-serif', fontSize: 18, fontWeight: 600, cursor: 'pointer', zIndex: 100 }}
      >
        Continue — {formatCurrency(total)}/mo
      </button>
    </div>
  );
}
