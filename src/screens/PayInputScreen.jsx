import { useEffect, useMemo, useState } from 'react';
import { toMonthly } from '../utils/calculations';
import { formatCurrency } from '../utils/formatters';

const FREQUENCY_OPTIONS = [
  { label: 'Weekly', value: 'weekly' },
  { label: 'Every two weeks', value: 'biweekly' },
  { label: 'Twice a month', value: 'twiceMonthly' },
  { label: 'Monthly', value: 'monthly' },
];

function SectionTitle({ children }) {
  return (
    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--blue)', margin: '0 0 12px' }}>
      {children}
    </p>
  );
}

function RegularIncomeSection({ title, amount, setAmount, frequency, setFrequency }) {
  return (
    <div style={{ marginBottom: 24 }}>
      {title && <SectionTitle>{title}</SectionTitle>}
      <input
        type="number"
        inputMode="decimal"
        placeholder="Amount per paycheck"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
        style={{ width: '100%', height: 56, borderRadius: 12, border: '2px solid #E0E0E0', padding: '0 16px', fontFamily: 'DM Sans, sans-serif', fontSize: 18, boxSizing: 'border-box', marginBottom: 12 }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {FREQUENCY_OPTIONS.map((option) => {
          const active = frequency === option.value;
          return (
            <button
              key={option.value}
              onClick={() => setFrequency(option.value)}
              style={{
                height: 48,
                borderRadius: 12,
                border: `2px solid ${active ? 'var(--navy)' : '#E0E0E0'}`,
                background: active ? 'var(--light-blue)' : '#fff',
                color: active ? 'var(--navy)' : 'var(--gray)',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 14,
                fontWeight: active ? 600 : 400,
                cursor: 'pointer',
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MilitaryIncomeSection({ title, midMonth, setMidMonth, endMonth, setEndMonth }) {
  return (
    <div style={{ marginBottom: 24 }}>
      {title && <SectionTitle>{title}</SectionTitle>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <input
            type="number"
            inputMode="decimal"
            placeholder="Mid-month deposit"
            value={midMonth}
            onChange={(event) => setMidMonth(event.target.value)}
            style={{ width: '100%', height: 56, borderRadius: 12, border: '2px solid #E0E0E0', padding: '0 16px', fontFamily: 'DM Sans, sans-serif', fontSize: 18, boxSizing: 'border-box' }}
          />
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--gray)', margin: '4px 0 0' }}>
            Usually around the 15th
          </p>
        </div>
        <div>
          <input
            type="number"
            inputMode="decimal"
            placeholder="End-of-month deposit"
            value={endMonth}
            onChange={(event) => setEndMonth(event.target.value)}
            style={{ width: '100%', height: 56, borderRadius: 12, border: '2px solid #E0E0E0', padding: '0 16px', fontFamily: 'DM Sans, sans-serif', fontSize: 18, boxSizing: 'border-box' }}
          />
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--gray)', margin: '4px 0 0' }}>
            Usually the last business day
          </p>
        </div>
      </div>
    </div>
  );
}

function VariableIncomeSection({ title, amount, setAmount }) {
  return (
    <div style={{ marginBottom: 24 }}>
      {title && <SectionTitle>{title}</SectionTitle>}
      <input
        type="number"
        inputMode="decimal"
        placeholder="Conservative monthly estimate"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
        style={{ width: '100%', height: 56, borderRadius: 12, border: '2px solid #E0E0E0', padding: '0 16px', fontFamily: 'DM Sans, sans-serif', fontSize: 18, boxSizing: 'border-box' }}
      />
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--gray)', margin: '6px 0 0' }}>
        Use the number you can count on, not your best month.
      </p>
    </div>
  );
}

function AdditionalIncomeSection({ items, setItems }) {
  const addRow = () => setItems((prev) => [...prev, { name: '', amount: '', regularity: 1.0 }]);

  const updateItem = (index, field, value) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <div style={{ marginTop: 24 }}>
      <SectionTitle>Additional income</SectionTitle>
      {items.map((item, index) => (
        <div key={index} style={{ background: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <input
              placeholder="Source"
              value={item.name}
              onChange={(event) => updateItem(index, 'name', event.target.value)}
              style={{ flex: 1, height: 44, borderRadius: 10, border: '2px solid #E0E0E0', padding: '0 12px', fontFamily: 'DM Sans, sans-serif', fontSize: 15, boxSizing: 'border-box' }}
            />
            <input
              type="number"
              inputMode="decimal"
              placeholder="$/mo"
              value={item.amount}
              onChange={(event) => updateItem(index, 'amount', event.target.value)}
              style={{ width: 110, height: 44, borderRadius: 10, border: '2px solid #E0E0E0', padding: '0 12px', fontFamily: 'DM Sans, sans-serif', fontSize: 15, boxSizing: 'border-box' }}
            />
            <button onClick={() => removeItem(index)} style={{ background: 'none', border: 'none', color: 'var(--gray)', fontSize: 20, cursor: 'pointer', padding: 0 }}>
              x
            </button>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { label: 'Every month', value: 1.0 },
              { label: 'Most months', value: 0.75 },
              { label: 'Unpredictable', value: 0.5 },
            ].map((option) => {
              const active = item.regularity === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => updateItem(index, 'regularity', option.value)}
                  style={{
                    flex: 1,
                    height: 36,
                    borderRadius: 8,
                    border: `2px solid ${active ? 'var(--navy)' : '#E0E0E0'}`,
                    background: active ? 'var(--light-blue)' : '#fff',
                    color: active ? 'var(--navy)' : 'var(--gray)',
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <button
        onClick={addRow}
        style={{ background: 'none', border: 'none', padding: 0, color: 'var(--blue)', fontFamily: 'DM Sans, sans-serif', fontSize: 14, cursor: 'pointer', textDecoration: 'underline' }}
      >
        Add another source
      </button>
    </div>
  );
}

function getMemberMonthly(type, values) {
  if (type === 'military') {
    return (Number(values.mid) || 0) + (Number(values.end) || 0);
  }

  if (type === 'civilian') {
    return toMonthly(Number(values.amount) || 0, values.frequency);
  }

  if (type === 'selfEmployed') {
    return Number(values.variable) || 0;
  }

  return 0;
}

export default function PayInputScreen({ userData, updateUserData, onNext, onBack }) {
  const [mounted, setMounted] = useState(false);
  const [additionalIncome, setAdditionalIncome] = useState(userData.additionalIncome || []);

  const [m1Mid, setM1Mid] = useState(userData.m1MidMonth ? String(userData.m1MidMonth) : '');
  const [m1End, setM1End] = useState(userData.m1EndOfMonth ? String(userData.m1EndOfMonth) : '');
  const [m1Amount, setM1Amount] = useState('');
  const [m1Frequency, setM1Frequency] = useState('biweekly');
  const [m1Variable, setM1Variable] = useState(userData.goodMonth ? String(userData.goodMonth) : '');

  const [m2Mid, setM2Mid] = useState(userData.m2MidMonth ? String(userData.m2MidMonth) : '');
  const [m2End, setM2End] = useState(userData.m2EndOfMonth ? String(userData.m2EndOfMonth) : '');
  const [m2Amount, setM2Amount] = useState('');
  const [m2Frequency, setM2Frequency] = useState('biweekly');
  const [m2Variable, setM2Variable] = useState(userData.p2GoodMonth ? String(userData.p2GoodMonth) : '');

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const m1Monthly = getMemberMonthly(userData.incomeType, {
    mid: m1Mid,
    end: m1End,
    amount: m1Amount,
    frequency: m1Frequency,
    variable: m1Variable,
  });

  const m2Monthly = getMemberMonthly(userData.partnerIncomeType, {
    mid: m2Mid,
    end: m2End,
    amount: m2Amount,
    frequency: m2Frequency,
    variable: m2Variable,
  });

  const additionalTotal = useMemo(
    () => additionalIncome.reduce((sum, item) => sum + (Number(item.amount) || 0) * (item.regularity || 1), 0),
    [additionalIncome]
  );
  const totalMonthly = Math.round(m1Monthly + m2Monthly + additionalTotal);

  const memberComplete = (type, values) => {
    if (!type || type === 'none') return true;
    if (type === 'military') return (Number(values.mid) || 0) > 0 || (Number(values.end) || 0) > 0;
    if (type === 'civilian') return (Number(values.amount) || 0) > 0;
    if (type === 'selfEmployed') return (Number(values.variable) || 0) > 0;
    return true;
  };

  const canContinue = memberComplete(userData.incomeType, {
    mid: m1Mid,
    end: m1End,
    amount: m1Amount,
    variable: m1Variable,
  }) && memberComplete(userData.partnerIncomeType, {
    mid: m2Mid,
    end: m2End,
    amount: m2Amount,
    variable: m2Variable,
  });

  const handleContinue = () => {
    updateUserData({
      m1MidMonth: Number(m1Mid) || 0,
      m1EndOfMonth: Number(m1End) || 0,
      m1TakeHome: Math.round(m1Monthly),
      m2MidMonth: Number(m2Mid) || 0,
      m2EndOfMonth: Number(m2End) || 0,
      m2TakeHome: Math.round(m2Monthly),
      goodMonth: Number(m1Variable) || 0,
      typicalMonth: Number(m1Variable) || 0,
      toughMonth: Number(m1Variable) || 0,
      p2GoodMonth: Number(m2Variable) || 0,
      p2TypicalMonth: Number(m2Variable) || 0,
      p2ToughMonth: Number(m2Variable) || 0,
      monthlyTakeHome: totalMonthly,
      additionalIncome,
    });
    onNext('budgetHousing');
  };

  const renderPrimarySection = () => {
    if (userData.incomeType === 'military') {
      return <MilitaryIncomeSection midMonth={m1Mid} setMidMonth={setM1Mid} endMonth={m1End} setEndMonth={setM1End} />;
    }
    if (userData.incomeType === 'civilian') {
      return <RegularIncomeSection amount={m1Amount} setAmount={setM1Amount} frequency={m1Frequency} setFrequency={setM1Frequency} />;
    }
    return <VariableIncomeSection amount={m1Variable} setAmount={setM1Variable} />;
  };

  const renderPartnerSection = () => {
    if (userData.householdType !== 'partner' || !userData.partnerIncomeType || userData.partnerIncomeType === 'none') {
      return null;
    }

    if (userData.partnerIncomeType === 'military') {
      return (
        <MilitaryIncomeSection
          title="Partner income"
          midMonth={m2Mid}
          setMidMonth={setM2Mid}
          endMonth={m2End}
          setEndMonth={setM2End}
        />
      );
    }

    if (userData.partnerIncomeType === 'civilian') {
      return (
        <RegularIncomeSection
          title="Partner income"
          amount={m2Amount}
          setAmount={setM2Amount}
          frequency={m2Frequency}
          setFrequency={setM2Frequency}
        />
      );
    }

    return <VariableIncomeSection title="Partner income" amount={m2Variable} setAmount={setM2Variable} />;
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
        <svg width="10" height="18" viewBox="0 0 10 18" fill="none"><path d="M9 1L1 9L9 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>

      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: 'var(--navy)', margin: '24px 0 8px', lineHeight: 1.2 }}>
        What hits your bank account
      </h1>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'var(--gray)', margin: '0 0 24px', lineHeight: 1.5 }}>
        Enter the actual deposits or the monthly amount you can count on.
      </p>

      {userData.householdType === 'partner' && <SectionTitle>Your income</SectionTitle>}
      {renderPrimarySection()}
      {renderPartnerSection()}

      {totalMonthly > 0 && (
        <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--blue)', margin: '0 0 12px' }}>
            Monthly total
          </p>
          {userData.householdType === 'partner' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)' }}>Your income</span>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600, color: 'var(--navy)' }}>{formatCurrency(Math.round(m1Monthly))}/mo</span>
              </div>
              {userData.partnerIncomeType !== 'none' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)' }}>Partner income</span>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600, color: 'var(--navy)' }}>{formatCurrency(Math.round(m2Monthly))}/mo</span>
                </div>
              )}
              <div style={{ height: 1, background: '#F0F0F0', margin: '8px 0' }} />
            </>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 600, color: 'var(--navy)' }}>
              {userData.householdType === 'partner' ? 'Household total' : 'Monthly take-home'}
            </span>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 700, color: 'var(--navy)' }}>
                {formatCurrency(totalMonthly)}<span style={{ fontSize: 16, fontFamily: 'DM Sans, sans-serif' }}>/mo</span>
              </div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--gray)' }}>{formatCurrency(totalMonthly * 12)}/yr</div>
            </div>
          </div>
        </div>
      )}

      <AdditionalIncomeSection items={additionalIncome} setItems={setAdditionalIncome} />

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
