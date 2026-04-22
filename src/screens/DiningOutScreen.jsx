import { useEffect, useState } from 'react';
import BinSelector from '../components/BinSelector';
import { getBins } from '../utils/calculations';
import { formatCurrency as fmt } from '../utils/formatters';

const KNOW_BANDS = [[2, 4], [4, 6], [6, 10], [10, 100]];

const FREQ_WEEKLY = [
  { label: 'Once a week', value: 4.3 },
  { label: '2–3x a week', value: 10 },
  { label: '4–5x a week', value: 19 },
  { label: 'Almost daily', value: 26 },
];
const DELIVERY_SIZE = [
  { label: '$15–25', value: 20 },
  { label: '$25–40', value: 32 },
  { label: '$40–60', value: 50 },
];
const FASTFOOD_SIZE = [
  { label: '$8–12', value: 10 },
  { label: '$12–20', value: 16 },
];
const COFFEE_FREQ = [
  { label: 'Daily', value: 30 },
  { label: 'Few times/week', value: 12 },
  { label: 'Occasionally', value: 4 },
];
const COFFEE_PRICE = [
  { label: '$4–6', value: 5 },
  { label: '$6–8', value: 7 },
];
const PER_MONTH = [1, 2, 3, 4, 5, 6, 8, 10, 12];
const RESTAURANT_SIZE = [
  { label: '$20–40', value: 30 },
  { label: '$40–70', value: 55 },
  { label: '$70+', value: 85 },
];
const BARS_SIZE = [
  { label: '$20–40', value: 30 },
  { label: '$40–80', value: 60 },
  { label: '$80+', value: 100 },
];

function ChipRow({ label, options, value, onChange }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--gray)', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {options.map(opt => {
          const active = value === opt.value;
          return (
            <button key={opt.value} onClick={() => onChange(opt.value)} style={{
              padding: '8px 14px', borderRadius: 20, border: `1.5px solid ${active ? 'var(--navy)' : '#D0D0D0'}`,
              background: active ? 'var(--navy)' : '#fff', color: active ? '#fff' : 'var(--navy)',
              fontFamily: 'DM Sans, sans-serif', fontSize: 14, cursor: 'pointer', transition: 'all 150ms',
            }}>
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function NumRow({ label, value, onChange }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--gray)', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {PER_MONTH.map(n => {
          const active = value === n;
          return (
            <button key={n} onClick={() => onChange(n)} style={{
              width: 48, height: 48, borderRadius: 12, border: `1.5px solid ${active ? 'var(--navy)' : '#D0D0D0'}`,
              background: active ? 'var(--navy)' : '#fff', color: active ? '#fff' : 'var(--navy)',
              fontFamily: 'DM Sans, sans-serif', fontSize: 15, cursor: 'pointer', transition: 'all 150ms',
            }}>
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function DiningOutScreen({ userData, updateUserData, onNext, onBack }) {
  const [mounted, setMounted] = useState(false);
  const [path, setPath] = useState(null); // 'know' | 'calc'
  const [selected, setSelected] = useState(userData.diningOut ?? null);
  const [revealed, setRevealed] = useState(false);

  // Calculator state
  const [delivFreq, setDelivFreq] = useState(null);
  const [delivSize, setDelivSize] = useState(null);
  const [ffFreq, setFfFreq] = useState(null);
  const [ffSize, setFfSize] = useState(null);
  const [coffeeFreq, setCoffeeFreq] = useState(null);
  const [coffeePrice, setCoffeePrice] = useState(null);
  const [restCount, setRestCount] = useState(null);
  const [restSize, setRestSize] = useState(null);
  const [barsCount, setBarsCount] = useState(null);
  const [barsSize, setBarsSize] = useState(null);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t); }, []);

  const bins = getBins(userData.monthlyTakeHome || 0, KNOW_BANDS);

  const calcTotal = Math.round(
    (delivFreq ?? 0) * (delivSize ?? 0) +
    (ffFreq ?? 0) * (ffSize ?? 0) +
    (coffeeFreq ?? 0) * (coffeePrice ?? 0) +
    (restCount ?? 0) * (restSize ?? 0) +
    (barsCount ?? 0) * (barsSize ?? 0)
  );

  const handleReveal = () => {
    setSelected(calcTotal);
    setRevealed(true);
  };

  const handleContinue = () => {
    updateUserData({ diningOut: selected });
    onNext('budgetCarPayment');
  };

  const canReveal = delivFreq != null || ffFreq != null || coffeeFreq != null || restCount != null || barsCount != null;

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
        Dining Out
      </h1>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'var(--gray)', margin: '8px 0 24px', lineHeight: 1.5 }}>
        Restaurants, delivery, fast food, coffee, bars — everything outside the grocery store.
      </p>

      {path === null && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { label: 'I know roughly what I spend', val: 'know' },
            { label: "Honestly, I'm not sure", val: 'calc' },
          ].map(opt => (
            <button key={opt.val} onClick={() => setPath(opt.val)} style={{
              height: 64, borderRadius: 16, border: '2px solid var(--navy)', background: '#fff',
              color: 'var(--navy)', fontFamily: 'DM Sans, sans-serif', fontSize: 17, fontWeight: 500,
              cursor: 'pointer', transition: 'all 150ms',
            }}>
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {path === 'know' && !revealed && (
        <>
          <BinSelector bins={bins} selectedValue={selected} onSelect={setSelected} />
          {selected != null && (
            <>
              <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, height: 80, background: 'linear-gradient(transparent, #F8F9FA 40%)', pointerEvents: 'none', zIndex: 99 }} />
              <button onClick={handleContinue} style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 48px)', maxWidth: 382, height: 56, background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: 16, fontFamily: 'DM Sans, sans-serif', fontSize: 18, fontWeight: 600, cursor: 'pointer', zIndex: 100 }}>
                Continue
              </button>
            </>
          )}
        </>
      )}

      {path === 'calc' && !revealed && (
        <>
          <ChipRow label="Delivery — how often?" options={FREQ_WEEKLY} value={delivFreq} onChange={setDelivFreq} />
          {delivFreq != null && <ChipRow label="Typical order size" options={DELIVERY_SIZE} value={delivSize} onChange={setDelivSize} />}

          <ChipRow label="Fast food — how often?" options={FREQ_WEEKLY} value={ffFreq} onChange={setFfFreq} />
          {ffFreq != null && <ChipRow label="Typical spend per visit" options={FASTFOOD_SIZE} value={ffSize} onChange={setFfSize} />}

          <ChipRow label="Coffee — how often?" options={COFFEE_FREQ} value={coffeeFreq} onChange={setCoffeeFreq} />
          {coffeeFreq != null && <ChipRow label="Typical price" options={COFFEE_PRICE} value={coffeePrice} onChange={setCoffeePrice} />}

          <NumRow label="Sit-down restaurants — times per month?" value={restCount} onChange={setRestCount} />
          {restCount != null && <ChipRow label="Typical spend per visit" options={RESTAURANT_SIZE} value={restSize} onChange={setRestSize} />}

          <NumRow label="Bars — times per month?" value={barsCount} onChange={setBarsCount} />
          {barsCount != null && <ChipRow label="Typical spend per visit" options={BARS_SIZE} value={barsSize} onChange={setBarsSize} />}

          {calcTotal > 0 && (
            <div style={{ background: 'var(--light-blue)', borderRadius: 12, padding: 16, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--navy)' }}>Running total</span>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 20, fontWeight: 700, color: 'var(--navy)' }}>{fmt(calcTotal)}/mo</span>
            </div>
          )}

          {canReveal && (
            <>
              <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, height: 80, background: 'linear-gradient(transparent, #F8F9FA 40%)', pointerEvents: 'none', zIndex: 99 }} />
              <button onClick={handleReveal} style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 48px)', maxWidth: 382, height: 56, background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: 16, fontFamily: 'DM Sans, sans-serif', fontSize: 18, fontWeight: 600, cursor: 'pointer', zIndex: 100 }}>
                Show me my number
              </button>
            </>
          )}
        </>
      )}

      {revealed && selected != null && (
        <>
          <div style={{ background: 'var(--navy)', borderRadius: 16, padding: 24, marginBottom: 16, textAlign: 'center' }}>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.7)', margin: '0 0 8px' }}>You're spending about</p>
            <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 48, fontWeight: 700, color: '#fff', margin: '0 0 4px', lineHeight: 1 }}>{fmt(selected)}</p>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.7)', margin: 0 }}>per month eating and drinking out</p>
          </div>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'var(--gray)', lineHeight: 1.6, margin: '0 0 24px' }}>
            This is the most common place people are surprised by their own spending — not because they're being irresponsible, but because $14 here and $8 there just doesn't feel like {fmt(selected)}. Now you know.
          </p>
          <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, height: 80, background: 'linear-gradient(transparent, #F8F9FA 40%)', pointerEvents: 'none', zIndex: 99 }} />
          <button onClick={handleContinue} style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 48px)', maxWidth: 382, height: 56, background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: 16, fontFamily: 'DM Sans, sans-serif', fontSize: 18, fontWeight: 600, cursor: 'pointer', zIndex: 100 }}>
            Continue
          </button>
        </>
      )}
    </div>
  );
}
