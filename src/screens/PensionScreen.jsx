import { useEffect, useState, useRef } from 'react';
import { getBasePay } from '../data/militaryPayTables';
import { getDefaultRetirementRank } from '../utils/calculations';
import { getNextIncomeScreen } from '../utils/flow';

const RANKS_FLAT = [
  'E-1','E-2','E-3','E-4','E-5','E-6','E-7','E-8','E-9',
  'W-1','W-2','W-3','W-4','W-5',
  'O-1','O-2','O-3','O-4','O-5','O-6','O-7','O-8','O-9','O-10',
];

const RANK_GROUPS = {
  'Enlisted': ['E-1','E-2','E-3','E-4','E-5','E-6','E-7','E-8','E-9'],
  'Warrant Officer': ['W-1','W-2','W-3','W-4','W-5'],
  'Officer': ['O-1','O-2','O-3','O-4','O-5','O-6','O-7','O-8','O-9','O-10'],
};

function fmt(n) { return '$' + Math.round(n).toLocaleString('en-US'); }

function calcPension(rank, tis, isBRS) {
  const bp = getBasePay(rank, tis);
  const multiplier = isBRS ? 0.02 : 0.025;
  const annual = bp * 12 * multiplier * tis;
  return {
    monthly: Math.round(annual / 12),
    annual: Math.round(annual),
    swrLow: Math.round(annual / 0.045),
    swrHigh: Math.round(annual / 0.035),
  };
}

function useCountUp(target, duration = 600) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const startValRef = useRef(0);

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const startVal = 0;
    startRef.current = null;
    startValRef.current = startVal;

    function step(ts) {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(startVal + (target - startVal) * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    }
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return value;
}

const INTENT_CARDS = [
  { label: 'YES',      body: 'I plan to serve 20 or more years.',  value: 'yes' },
  { label: 'NOT SURE', body: "I haven't decided yet.",              value: 'unsure' },
  { label: 'NO',       body: 'I plan to separate before 20 years.', value: 'no' },
];

export default function PensionScreen({ userData, updateUserData, onNext, onBack }) {
  const [mounted, setMounted] = useState(false);
  const [intent, setIntent] = useState(userData.retirementIntent ?? null);
  const [calcVisible, setCalcVisible] = useState(!!userData.retirementIntent);
  const [swrOpen, setSwrOpen] = useState(false);

  const defaultRank = getDefaultRetirementRank(userData.m1Rank) || 'E-7';
  const [retRank, setRetRank] = useState(userData.retirementRank || defaultRank);
  const [retTIS, setRetTIS] = useState(userData.retirementTIS || 20);

  // BRS: entry year >= 2018 → TIS <= 8
  const isBRS = (userData.m1TIS || 0) <= 8;

  const pension = calcPension(retRank, retTIS, isBRS);

  // Per-year add: difference between staying one more year
  const yearAdd = {
    low: Math.round((calcPension(retRank, retTIS + 1, isBRS).swrLow - pension.swrLow)),
    high: Math.round((calcPension(retRank, retTIS + 1, isBRS).swrHigh - pension.swrHigh)),
  };

  const animMonthly = useCountUp(calcVisible ? pension.monthly : 0);
  const animAnnual  = useCountUp(calcVisible ? pension.annual  : 0);
  const animSwrLow  = useCountUp(calcVisible ? pension.swrLow  : 0);
  const animSwrHigh = useCountUp(calcVisible ? pension.swrHigh : 0);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t); }, []);

  const handleIntentSelect = (val) => {
    setIntent(val);
    setTimeout(() => setCalcVisible(true), 100);
  };

  const handleContinue = () => {
    const updates = {
      retirementIntent: intent,
      retirementRank: retRank,
      retirementTIS: Number(retTIS),
      monthlyPension: pension.monthly,
      annualPension: pension.annual,
      pensionSWRLow: pension.swrLow,
      pensionSWRHigh: pension.swrHigh,
    };
    const nextUserData = { ...userData, ...updates };
    updateUserData(updates);
    onNext(getNextIncomeScreen(nextUserData));
  };

  const inputStyle = {
    height: 56, border: '2px solid #E0E0E0', borderRadius: 12,
    fontFamily: 'DM Sans, sans-serif', fontSize: 18, padding: '0 16px',
    width: '100%', background: '#fff', outline: 'none',
  };

  const sectionTitle = intent === 'no'
    ? `${getDefaultRetirementRank(userData.m1Rank) || 'E-7'} with 20 Years — Pension Estimate`
    : 'Your Pension Estimate';

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
        Your Pension
      </h1>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'var(--gray)', margin: '8px 0 24px', lineHeight: 1.5 }}>
        Before we move on, let&rsquo;s talk about what you&rsquo;re building toward.
      </p>

      {/* Intent cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {INTENT_CARDS.map((card, i) => {
          const isSelected = intent === card.value;
          return (
            <div
              key={card.value}
              onClick={() => handleIntentSelect(card.value)}
              style={{
                background: isSelected ? 'var(--light-blue)' : '#fff',
                border: `2px solid ${isSelected ? 'var(--navy)' : 'transparent'}`,
                borderRadius: 16, padding: 20,
                boxShadow: isSelected ? 'none' : '0 2px 12px rgba(0,0,0,0.06)',
                cursor: 'pointer', transition: 'border-color 150ms, background 150ms',
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(8px)',
                transitionProperty: 'opacity, transform, border-color, background',
                transitionDuration: '300ms, 300ms, 150ms, 150ms',
                transitionDelay: `${i * 80}ms, ${i * 80}ms, 0ms, 0ms`,
              }}
            >
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--blue)', margin: '0 0 6px' }}>{card.label}</p>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 17, color: 'var(--gray)', lineHeight: 1.5, margin: 0 }}>{card.body}</p>
            </div>
          );
        })}
      </div>

      {/* Pension calculator section */}
      {calcVisible && (
        <div style={{ marginTop: 32, opacity: 1, transition: 'opacity 250ms ease' }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--blue)', margin: '0 0 16px' }}>
            {sectionTitle}
          </p>

          {/* Two inputs side by side */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
            <select
              value={retRank}
              onChange={e => setRetRank(e.target.value)}
              style={{ ...inputStyle, flex: 1 }}
            >
              {Object.entries(RANK_GROUPS).map(([group, ranks]) => (
                <optgroup key={group} label={group}>
                  {ranks.map(r => <option key={r} value={r}>{r}</option>)}
                </optgroup>
              ))}
            </select>
            <input
              type="number"
              inputMode="numeric"
              placeholder="Years"
              min={20} max={40}
              value={retTIS}
              onChange={e => setRetTIS(Number(e.target.value) || 20)}
              style={{ ...inputStyle, flex: 1 }}
            />
          </div>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontStyle: 'italic', color: 'var(--gray)', margin: '0 0 20px', lineHeight: 1.4 }}>
            We pre-filled these based on your current rank and the most common retirement point. Adjust if you have a different plan.
          </p>

          {/* Live Pension Card */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
            {/* Row 1: Monthly pension */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottom: '1px solid var(--light-gray)' }}>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)' }}>Monthly pension at retirement</span>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: 'var(--navy)' }}>{fmt(animMonthly)}</div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--gray)' }}>{fmt(animAnnual)}/yr</div>
              </div>
            </div>

            {/* Row 2: SWR equivalent */}
            <div style={{ padding: '16px 0', borderBottom: '1px solid var(--light-gray)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)', maxWidth: '50%', lineHeight: 1.4 }}>
                  Equivalent savings needed to replicate this pension
                </span>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 700, color: 'var(--navy)' }}>
                    {fmt(animSwrLow)}–{fmt(animSwrHigh)}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSwrOpen(v => !v)}
                style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--blue)', background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0 0', textDecoration: 'underline' }}
              >
                {swrOpen ? 'Hide explanation' : 'What does this mean?'}
              </button>
              {swrOpen && (
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontStyle: 'italic', color: 'var(--gray)', margin: '8px 0 0', lineHeight: 1.5 }}>
                  This is an estimate of how much you would need to have saved and invested to replicate this pension&rsquo;s monthly income on your own. Based on a 3.5%–4.5% withdrawal rate.
                </p>
              )}
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--gray)', margin: '8px 0 0', fontStyle: 'italic' }}>
                Based on a 3.5%–4.5% withdrawal rate. Conservative estimate.
              </p>
            </div>

            {/* Row 3: Year-by-year value (unsure and no only) */}
            {(intent === 'unsure' || intent === 'no') && (
              <div style={{ background: 'var(--light-gold)', margin: '-0px -20px -20px', borderRadius: '0 0 16px 16px', padding: '16px 20px' }}>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)', margin: 0, lineHeight: 1.6 }}>
                  Each year you stay adds{' '}
                  <span style={{ fontWeight: 700, color: 'var(--gold)' }}>{fmt(yearAdd.low)}–{fmt(yearAdd.high)}</span>
                  {' '}to that total permanently. Each year you leave early, that value is gone.
                </p>
              </div>
            )}
          </div>

          {/* Separation flag (no only) */}
          {intent === 'no' && (
            <div style={{ marginTop: 16, borderLeft: '3px solid var(--gold)', background: 'var(--light-gold)', borderRadius: '0 12px 12px 0', padding: 16 }}>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)', margin: 0, lineHeight: 1.6 }}>
                We&rsquo;ll come back to this. When we get to your goals, we&rsquo;ll show you exactly what compensation package you&rsquo;d need on the outside to truly come out ahead.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Sticky Continue */}
      {intent && (
        <>
          <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, height: 80, background: 'linear-gradient(transparent, #F8F9FA 40%)', pointerEvents: 'none', zIndex: 99 }} />
          <button
            onClick={handleContinue}
            style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 48px)', maxWidth: 382, height: 56, background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: 16, fontFamily: 'DM Sans, sans-serif', fontSize: 18, fontWeight: 600, cursor: 'pointer', zIndex: 100 }}
          >
            Now let&rsquo;s look at your budget
          </button>
        </>
      )}
    </div>
  );
}
