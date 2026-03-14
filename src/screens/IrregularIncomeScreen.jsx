import { useEffect, useState } from 'react';
import { conservativeMonthly } from '../utils/calculations';
import { formatCurrency } from '../utils/formatters';

const inputStyle = {
  height: 56, border: '2px solid #E0E0E0', borderRadius: 12,
  fontFamily: 'DM Sans, sans-serif', fontSize: 18, padding: '0 16px',
  width: '100%', background: '#fff', outline: 'none',
};

function IncomeInputGroup({ label, good, setGood, typical, setTypical, tough, setTough }) {
  return (
    <div style={{ marginBottom: 24 }}>
      {label && <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--blue)', margin: '0 0 16px' }}>{label}</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <input type="number" inputMode="decimal" placeholder="Good month" value={good} onChange={e => setGood(e.target.value)} style={inputStyle} />
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--gray)', margin: '4px 0 0', fontStyle: 'italic' }}>Not your best ever. Just a solid month.</p>
        </div>
        <div>
          <input type="number" inputMode="decimal" placeholder="Typical month" value={typical} onChange={e => setTypical(e.target.value)} style={inputStyle} />
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--gray)', margin: '4px 0 0', fontStyle: 'italic' }}>The number you&rsquo;d bet on most months.</p>
        </div>
        <div>
          <input type="number" inputMode="decimal" placeholder="Tough month" value={tough} onChange={e => setTough(e.target.value)} style={inputStyle} />
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--gray)', margin: '4px 0 0', fontStyle: 'italic' }}>Not worst case. Just a slow one.</p>
        </div>
      </div>
    </div>
  );
}

export default function IrregularIncomeScreen({ userData, updateUserData, onNext, onBack }) {
  const [mounted, setMounted] = useState(false);
  const isPartner = userData.householdType === 'partner';

  const [m1Good, setM1Good]       = useState(userData.goodMonth ? String(userData.goodMonth) : '');
  const [m1Typical, setM1Typical] = useState(userData.typicalMonth ? String(userData.typicalMonth) : '');
  const [m1Tough, setM1Tough]     = useState(userData.toughMonth ? String(userData.toughMonth) : '');

  const [m2Good, setM2Good]       = useState(userData.p2GoodMonth ? String(userData.p2GoodMonth) : '');
  const [m2Typical, setM2Typical] = useState(userData.p2TypicalMonth ? String(userData.p2TypicalMonth) : '');
  const [m2Tough, setM2Tough]     = useState(userData.p2ToughMonth ? String(userData.p2ToughMonth) : '');

  const [sliderValue, setSliderValue] = useState(null);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t); }, []);

  const m1AllFilled = m1Good && m1Typical && m1Tough;
  const m2AllFilled = !isPartner || (userData.partnerIncomeType === 'selfEmployed' ? (m2Good && m2Typical && m2Tough) : true);

  const m1Conservative = m1AllFilled
    ? conservativeMonthly(Number(m1Good), Number(m1Typical), Number(m1Tough))
    : 0;

  const m2Conservative = (isPartner && userData.partnerIncomeType === 'selfEmployed' && m2AllFilled)
    ? conservativeMonthly(Number(m2Good), Number(m2Typical), Number(m2Tough))
    : 0;

  const combinedConservative = m1Conservative + m2Conservative;
  const combinedGood = (Number(m1Good) || 0) + (Number(m2Good) || 0);

  // Initialize slider when estimate is available
  useEffect(() => {
    if (combinedConservative > 0 && sliderValue === null) {
      setSliderValue(combinedConservative);
    }
  }, [combinedConservative]);

  const currentSlider = sliderValue ?? combinedConservative;
  const canContinue = m1AllFilled && m2AllFilled && currentSlider > 0;

  const handleContinue = () => {
    updateUserData({
      goodMonth: Number(m1Good) || 0,
      typicalMonth: Number(m1Typical) || 0,
      toughMonth: Number(m1Tough) || 0,
      p2GoodMonth: Number(m2Good) || 0,
      p2TypicalMonth: Number(m2Typical) || 0,
      p2ToughMonth: Number(m2Tough) || 0,
      monthlyTakeHome: currentSlider,
    });
    onNext('budgetHousing');
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
        Let&rsquo;s talk about your income
      </h1>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'var(--gray)', margin: '8px 0 24px', lineHeight: 1.5 }}>
        Irregular income makes budgeting harder than most advice accounts for. We&rsquo;re going to build your plan around what you can reliably count on — not your best month.
      </p>

      <IncomeInputGroup
        label={isPartner ? 'Your Income' : undefined}
        good={m1Good} setGood={setM1Good}
        typical={m1Typical} setTypical={setM1Typical}
        tough={m1Tough} setTough={setM1Tough}
      />

      {isPartner && userData.partnerIncomeType === 'selfEmployed' && (
        <IncomeInputGroup
          label="Partner's Income"
          good={m2Good} setGood={setM2Good}
          typical={m2Typical} setTypical={setM2Typical}
          tough={m2Tough} setTough={setM2Tough}
        />
      )}

      {/* Live estimate card */}
      {m1AllFilled && (
        <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--blue)', margin: '0 0 12px' }}>
            We&rsquo;ll build your plan around
          </p>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, fontWeight: 700, color: 'var(--navy)' }}>
            {formatCurrency(currentSlider)}<span style={{ fontSize: 18, fontFamily: 'DM Sans, sans-serif' }}>/month</span>
          </div>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)', marginTop: 4 }}>
            {formatCurrency(currentSlider * 12)}/year
          </div>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontStyle: 'italic', color: 'var(--gray)', margin: '12px 0 16px', lineHeight: 1.5 }}>
            A weighted estimate that accounts for slow months without assuming the worst.
          </p>

          {/* Slider */}
          {combinedGood > combinedConservative && (
            <div>
              <input
                type="range"
                min={combinedConservative}
                max={combinedGood}
                step={50}
                value={currentSlider}
                onChange={e => setSliderValue(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--navy)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--gray)' }}>Conservative: {formatCurrency(combinedConservative)}</span>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--gray)' }}>Good month: {formatCurrency(combinedGood)}</span>
              </div>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontStyle: 'italic', color: 'var(--gray)', margin: '8px 0 0' }}>
                Only go higher if you&rsquo;re confident. Your plan is only as good as this number.
              </p>
            </div>
          )}
        </div>
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
