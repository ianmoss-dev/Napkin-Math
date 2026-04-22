import { useEffect, useState } from 'react';
import { toMonthly } from '../utils/calculations';
import { formatCurrency } from '../utils/formatters';
import { getNextIncomeScreen } from '../utils/flow';

const FREQ_OPTIONS = [
  { label: 'Weekly',          value: 'weekly' },
  { label: 'Every two weeks', value: 'biweekly' },
  { label: 'Twice a month',   value: 'twiceMonthly' },
  { label: 'Monthly',         value: 'monthly' },
];

function MilitaryIncomeSection({ label, midMonth, setMidMonth, endMonth, setEndMonth }) {
  return (
    <div style={{ marginBottom: 24 }}>
      {label && <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--blue)', margin: '0 0 12px' }}>{label}</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <input
            type="number"
            inputMode="decimal"
            placeholder="Mid-month deposit"
            value={midMonth}
            onChange={e => setMidMonth(e.target.value)}
            style={inputStyle}
          />
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--gray)', margin: '4px 0 0', fontStyle: 'italic' }}>Usually around the 15th</p>
        </div>
        <div>
          <input
            type="number"
            inputMode="decimal"
            placeholder="End-of-month deposit"
            value={endMonth}
            onChange={e => setEndMonth(e.target.value)}
            style={inputStyle}
          />
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--gray)', margin: '4px 0 0', fontStyle: 'italic' }}>Usually the last business day</p>
        </div>
      </div>
    </div>
  );
}

function CivilianIncomeSection({ label, amount, setAmount, frequency, setFrequency }) {
  return (
    <div style={{ marginBottom: 24 }}>
      {label && <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--blue)', margin: '0 0 12px' }}>{label}</p>}
      <input
        type="number"
        inputMode="decimal"
        placeholder="Amount per paycheck"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        style={{ ...inputStyle, marginBottom: 12 }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {FREQ_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => setFrequency(opt.value)}
            style={{
              height: 48, borderRadius: 10, border: `2px solid ${frequency === opt.value ? 'var(--navy)' : '#E0E0E0'}`,
              background: frequency === opt.value ? 'var(--light-blue)' : '#fff',
              fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: frequency === opt.value ? 600 : 400,
              color: frequency === opt.value ? 'var(--navy)' : 'var(--gray)', cursor: 'pointer',
              transition: 'border-color 150ms, background 150ms',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const inputStyle = {
  height: 56, border: '2px solid #E0E0E0', borderRadius: 12,
  fontFamily: 'DM Sans, sans-serif', fontSize: 18, padding: '0 16px',
  width: '100%', background: '#fff', outline: 'none',
};

function AdditionalIncomeSection({ items, setItems }) {
  const addRow = () => setItems(prev => [...prev, { name: '', amount: '', regularity: 1.0 }]);
  const update = (i, field, val) => setItems(prev => {
    const next = [...prev];
    next[i] = { ...next[i], [field]: val };
    return next;
  });
  const remove = (i) => setItems(prev => prev.filter((_, idx) => idx !== i));

  const regularityOptions = [
    { label: 'Every month', value: 1.0 },
    { label: 'Most months', value: 0.75 },
    { label: 'Unpredictable', value: 0.5 },
  ];

  return (
    <div style={{ marginTop: 24 }}>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--blue)', margin: '0 0 12px' }}>
        Additional Income
      </p>
      {items.map((item, i) => (
        <div key={i} style={{ background: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <input
              placeholder="Source name"
              value={item.name}
              onChange={e => update(i, 'name', e.target.value)}
              style={{ flex: 1, height: 44, border: '2px solid #E0E0E0', borderRadius: 10, fontFamily: 'DM Sans, sans-serif', fontSize: 15, padding: '0 12px', outline: 'none' }}
            />
            <input
              type="number"
              inputMode="decimal"
              placeholder="$/mo"
              value={item.amount}
              onChange={e => update(i, 'amount', e.target.value)}
              style={{ width: 100, height: 44, border: '2px solid #E0E0E0', borderRadius: 10, fontFamily: 'DM Sans, sans-serif', fontSize: 15, padding: '0 12px', outline: 'none' }}
            />
            <button onClick={() => remove(i)} style={{ background: 'none', border: 'none', color: 'var(--red)', fontSize: 20, cursor: 'pointer', padding: 4 }}>×</button>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {regularityOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => update(i, 'regularity', opt.value)}
                style={{
                  flex: 1, height: 36, borderRadius: 8,
                  border: `2px solid ${item.regularity === opt.value ? 'var(--navy)' : '#E0E0E0'}`,
                  background: item.regularity === opt.value ? 'var(--light-blue)' : '#fff',
                  fontFamily: 'DM Sans, sans-serif', fontSize: 12,
                  color: item.regularity === opt.value ? 'var(--navy)' : 'var(--gray)', cursor: 'pointer',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button onClick={addRow} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--blue)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', textDecoration: 'underline' }}>
        + Add another source
      </button>
    </div>
  );
}

export default function LESConfirmationScreen({ userData, updateUserData, onNext, onBack }) {
  const [mounted, setMounted] = useState(false);
  const [showAdditional, setShowAdditional] = useState(false);
  const [additionalItems, setAdditionalItems] = useState(userData.additionalIncome || []);

  const isPartner = userData.householdType === 'partner';
  const m1Type = userData.incomeType;
  const m2Type = userData.partnerIncomeType;

  // M1 state
  const [m1Mid, setM1Mid] = useState(userData.m1MidMonth ? String(userData.m1MidMonth) : '');
  const [m1End, setM1End] = useState(userData.m1EndOfMonth ? String(userData.m1EndOfMonth) : '');
  const [m1Amount, setM1Amount] = useState('');
  const [m1Freq, setM1Freq] = useState('biweekly');

  // M2 state
  const [m2Mid, setM2Mid] = useState(userData.m2MidMonth ? String(userData.m2MidMonth) : '');
  const [m2End, setM2End] = useState(userData.m2EndOfMonth ? String(userData.m2EndOfMonth) : '');
  const [m2Amount, setM2Amount] = useState('');
  const [m2Freq, setM2Freq] = useState('biweekly');

  useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t); }, []);

  function m1Monthly() {
    if (m1Type === 'military') return (Number(m1Mid) || 0) + (Number(m1End) || 0);
    if (m1Type !== 'civilian') return 0;
    return toMonthly(Number(m1Amount) || 0, m1Freq);
  }

  function m2Monthly() {
    if (!isPartner || m2Type === 'none') return 0;
    if (m2Type === 'military') return (Number(m2Mid) || 0) + (Number(m2End) || 0);
    if (m2Type !== 'civilian') return 0;
    return toMonthly(Number(m2Amount) || 0, m2Freq);
  }

  const additionalTotal = additionalItems.reduce((sum, item) => sum + (Number(item.amount) || 0) * (item.regularity || 1), 0);

  const totalMonthly = m1Monthly() + m2Monthly() + additionalTotal;

  // Sanity check for military: compare to RMC * 0.75
  const expectedM1 = (userData.m1RMC || 0) * 0.75;
  const m1Variance = expectedM1 > 0 ? Math.abs(m1Monthly() - expectedM1) / expectedM1 : 0;
  const showSanity = m1Type === 'military' && m1Monthly() > 0 && m1Variance > 0.25;

  function isComplete() {
    const m1ok = m1Type === 'military'
      ? (Number(m1Mid) > 0 || Number(m1End) > 0)
      : m1Type === 'civilian'
        ? Number(m1Amount) > 0
        : true;
    if (!isPartner || m2Type === 'none') return m1ok;
    const m2ok = m2Type === 'military'
      ? (Number(m2Mid) > 0 || Number(m2End) > 0)
      : m2Type === 'civilian'
        ? Number(m2Amount) > 0
        : true;
    return m1ok && m2ok;
  }

  const handleContinue = () => {
    const updates = {
      m1MidMonth: Number(m1Mid) || 0,
      m1EndOfMonth: Number(m1End) || 0,
      m1TakeHome: m1Monthly(),
      m2MidMonth: Number(m2Mid) || 0,
      m2EndOfMonth: Number(m2End) || 0,
      m2TakeHome: m2Monthly(),
      monthlyTakeHome: totalMonthly,
      additionalIncome: additionalItems,
    };
    const nextUserData = { ...userData, ...updates };
    updateUserData(updates);
    onNext(getNextIncomeScreen(nextUserData));
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
        What actually hits your account
      </h1>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'var(--gray)', margin: '8px 0 24px', lineHeight: 1.5 }}>
        {m1Type === 'military'
          ? 'Check your LES. Military pay arrives mid-month and end of month.'
          : 'Check your bank statement.'}
      </p>

      {/* M1 income */}
      {m1Type === 'military' ? (
        <MilitaryIncomeSection
          label={isPartner ? 'Your Income' : undefined}
          midMonth={m1Mid} setMidMonth={setM1Mid}
          endMonth={m1End} setEndMonth={setM1End}
        />
      ) : m1Type === 'civilian' ? (
        <CivilianIncomeSection
          label={isPartner ? 'Your Income' : undefined}
          amount={m1Amount} setAmount={setM1Amount}
          frequency={m1Freq} setFrequency={setM1Freq}
        />
      ) : null}

      {/* M2 income */}
      {isPartner && m2Type && m2Type !== 'none' && (
        m2Type === 'military' ? (
          <MilitaryIncomeSection
            label="Partner's Income"
            midMonth={m2Mid} setMidMonth={setM2Mid}
            endMonth={m2End} setEndMonth={setM2End}
          />
        ) : m2Type === 'civilian' ? (
          <CivilianIncomeSection
            label="Partner's Income"
            amount={m2Amount} setAmount={setM2Amount}
            frequency={m2Freq} setFrequency={setM2Freq}
          />
        ) : null
      )}

      {/* Sanity check */}
      {showSanity && (
        <div style={{ background: 'var(--light-gold)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)', margin: 0, lineHeight: 1.5 }}>
            Take a second to double-check that number — it&rsquo;s the foundation of everything that follows.
          </p>
        </div>
      )}

      {/* Live total card */}
      {totalMonthly > 0 && (
        <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--blue)', margin: '0 0 12px' }}>Monthly Total</p>
          {isPartner && m1Monthly() > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, marginBottom: 8, borderBottom: '1px solid var(--light-gray)' }}>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)' }}>Your income</span>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600, color: 'var(--navy)' }}>{formatCurrency(m1Monthly())}/mo</span>
            </div>
          )}
          {isPartner && m2Monthly() > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, marginBottom: 8, borderBottom: '1px solid var(--light-gray)' }}>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)' }}>Partner&rsquo;s income</span>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600, color: 'var(--navy)' }}>{formatCurrency(m2Monthly())}/mo</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 600, color: 'var(--navy)' }}>{isPartner ? 'Household total' : 'Monthly take-home'}</span>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 700, color: 'var(--navy)' }}>{formatCurrency(totalMonthly)}<span style={{ fontSize: 16, fontFamily: 'DM Sans, sans-serif' }}>/mo</span></div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--gray)' }}>{formatCurrency(totalMonthly * 12)}/yr</div>
            </div>
          </div>
        </div>
      )}

      {/* Additional income toggle */}
      <button
        onClick={() => setShowAdditional(v => !v)}
        style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'var(--blue)', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0', textDecoration: 'underline' }}
      >
        {showAdditional ? '− Hide' : '+ Do you have any additional income?'}
      </button>

      {showAdditional && (
        <AdditionalIncomeSection items={additionalItems} setItems={setAdditionalItems} />
      )}

      {/* Sticky Continue */}
      {isComplete() && (
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
