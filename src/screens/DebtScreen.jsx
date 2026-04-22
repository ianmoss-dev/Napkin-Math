import { useEffect, useState } from 'react';
import { formatCurrency } from '../utils/formatters';

const DEBT_TYPES = ['Credit card', 'Student loan', 'Car loan', 'Personal loan', 'Medical debt', 'Other'];

function DebtCard({ debt, onDelete }) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--blue)', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{debt.type}</p>
        <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: 'var(--navy)', margin: '0 0 2px' }}>{formatCurrency(debt.balance)}</p>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--gray)', margin: 0 }}>
          {debt.rateUnknown ? '24.99% (estimated)' : `${debt.rate}% APR`} · {formatCurrency(debt.minimum)}/mo minimum
        </p>
      </div>
      <button onClick={onDelete} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray)', padding: 4, fontSize: 18, lineHeight: 1 }}>×</button>
    </div>
  );
}

function AddDebtForm({ onAdd, onCancel }) {
  const [type, setType] = useState('');
  const [balance, setBalance] = useState('');
  const [rate, setRate] = useState('');
  const [rateUnknown, setRateUnknown] = useState(false);
  const [minimum, setMinimum] = useState('');
  const [minUnknown, setMinUnknown] = useState(false);

  const estimatedMin = balance ? Math.max(25, Math.round(parseFloat(balance) * 0.02)) : null;

  const canAdd = type && balance && (rate || rateUnknown) && (minimum || minUnknown);

  const handleAdd = () => {
    if (!canAdd) return;
    const bal = parseFloat(balance);
    onAdd({
      id: Date.now(),
      type,
      balance: bal,
      rate: rateUnknown ? 24.99 : parseFloat(rate),
      rateUnknown,
      minimum: minUnknown ? estimatedMin : parseFloat(minimum),
      minUnknown,
    });
  };

  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--gray)', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Debt type</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        {DEBT_TYPES.map(t => (
          <button key={t} onClick={() => setType(t)} style={{
            padding: '8px 14px', borderRadius: 20, border: `1.5px solid ${type === t ? 'var(--navy)' : '#D0D0D0'}`,
            background: type === t ? 'var(--navy)' : '#fff', color: type === t ? '#fff' : 'var(--navy)',
            fontFamily: 'DM Sans, sans-serif', fontSize: 14, cursor: 'pointer', transition: 'all 150ms',
          }}>{t}</button>
        ))}
      </div>

      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--gray)', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Balance</p>
      <input
        type="number" inputMode="decimal" placeholder="$0"
        value={balance} onChange={e => setBalance(e.target.value)}
        style={{ width: '100%', height: 56, border: '2px solid #E0E0E0', borderRadius: 12, fontFamily: 'DM Sans, sans-serif', fontSize: 18, padding: '0 16px', outline: 'none', boxSizing: 'border-box', marginBottom: 16 }}
      />

      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--gray)', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Interest rate</p>
      {!rateUnknown ? (
        <>
          <input
            type="number" inputMode="decimal" placeholder="% APR"
            value={rate} onChange={e => setRate(e.target.value)}
            style={{ width: '100%', height: 56, border: '2px solid #E0E0E0', borderRadius: 12, fontFamily: 'DM Sans, sans-serif', fontSize: 18, padding: '0 16px', outline: 'none', boxSizing: 'border-box', marginBottom: 8 }}
          />
          <button onClick={() => { setRateUnknown(true); setRate(''); }} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--blue)', background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 16px', textDecoration: 'underline' }}>
            I don't know my rate
          </button>
        </>
      ) : (
        <div style={{ background: 'var(--light-gold)', borderRadius: 12, padding: 12, marginBottom: 16 }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)', margin: 0, lineHeight: 1.5 }}>
            We assumed the worst — 24.99% — so your plan is built on solid ground, not wishful thinking.{' '}
            <button onClick={() => setRateUnknown(false)} style={{ color: 'var(--blue)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 14, textDecoration: 'underline' }}>Enter it instead</button>
          </p>
        </div>
      )}

      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--gray)', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Monthly minimum</p>
      {!minUnknown ? (
        <>
          <input
            type="number" inputMode="decimal" placeholder="$0/mo"
            value={minimum} onChange={e => setMinimum(e.target.value)}
            style={{ width: '100%', height: 56, border: '2px solid #E0E0E0', borderRadius: 12, fontFamily: 'DM Sans, sans-serif', fontSize: 18, padding: '0 16px', outline: 'none', boxSizing: 'border-box', marginBottom: 8 }}
          />
          <button onClick={() => setMinUnknown(true)} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--blue)', background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 16px', textDecoration: 'underline' }}>
            I'm not sure
          </button>
        </>
      ) : (
        <div style={{ background: 'var(--light-blue)', borderRadius: 12, padding: 12, marginBottom: 16 }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--navy)', margin: 0, lineHeight: 1.5 }}>
            {balance ? <>We estimated <strong>{formatCurrency(estimatedMin)}/mo</strong>. Check your statement to confirm.</> : 'Enter a balance first.'}
            {' '}<button onClick={() => setMinUnknown(false)} style={{ color: 'var(--blue)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 14, textDecoration: 'underline' }}>Enter it instead</button>
          </p>
        </div>
      )}

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onCancel} style={{ flex: 1, height: 48, borderRadius: 12, border: '2px solid #E0E0E0', background: '#fff', color: 'var(--gray)', fontFamily: 'DM Sans, sans-serif', fontSize: 15, cursor: 'pointer' }}>Cancel</button>
        <button onClick={handleAdd} disabled={!canAdd} style={{ flex: 2, height: 48, borderRadius: 12, border: 'none', background: canAdd ? 'var(--navy)' : '#ccc', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 600, cursor: canAdd ? 'pointer' : 'default' }}>Add debt</button>
      </div>
    </div>
  );
}

export default function DebtScreen({ userData, updateUserData, onNext, onBack }) {
  const [mounted, setMounted] = useState(false);
  const [debts, setDebts] = useState(userData.debts || []);
  const [adding, setAdding] = useState(false);
  const [noDebt, setNoDebt] = useState(userData.debts?.length === 0 && userData.debts !== null ? false : null);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t); }, []);

  const addDebt = (debt) => {
    const updated = [...debts, debt];
    setDebts(updated);
    setAdding(false);
    setNoDebt(false);
  };

  const removeDebt = (id) => {
    setDebts(prev => prev.filter(d => d.id !== id));
  };

  const handleContinue = () => {
    updateUserData({ debts });
    onNext('budgetClothing');
  };

  const canContinue = noDebt || debts.length > 0;

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
        Debt
      </h1>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'var(--gray)', margin: '8px 0 24px', lineHeight: 1.5 }}>
        Enter each debt separately — this helps us build the right payoff plan.
      </p>

      {debts.map(debt => (
        <DebtCard key={debt.id} debt={debt} onDelete={() => removeDebt(debt.id)} />
      ))}

      {!adding && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <button onClick={() => { setAdding(true); setNoDebt(false); }} style={{ flex: 2, height: 56, borderRadius: 16, border: '2px solid var(--navy)', background: '#fff', color: 'var(--navy)', fontFamily: 'DM Sans, sans-serif', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>
            + Add a debt
          </button>
          {debts.length === 0 && (
            <button onClick={() => { setNoDebt(true); setDebts([]); }} style={{
              flex: 1, height: 56, borderRadius: 16,
              border: `2px solid ${noDebt ? 'var(--navy)' : '#E0E0E0'}`,
              background: noDebt ? 'var(--navy)' : '#fff',
              color: noDebt ? '#fff' : 'var(--gray)',
              fontFamily: 'DM Sans, sans-serif', fontSize: 15, cursor: 'pointer', transition: 'all 150ms',
            }}>
              No debt
            </button>
          )}
        </div>
      )}

      {adding && <AddDebtForm onAdd={addDebt} onCancel={() => setAdding(false)} />}

      {canContinue && !adding && (
        <>
          <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, height: 80, background: 'linear-gradient(transparent, #F8F9FA 40%)', pointerEvents: 'none', zIndex: 99 }} />
          <button onClick={handleContinue} style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 48px)', maxWidth: 382, height: 56, background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: 16, fontFamily: 'DM Sans, sans-serif', fontSize: 18, fontWeight: 600, cursor: 'pointer', zIndex: 100 }}>
            Continue
          </button>
        </>
      )}
    </div>
  );
}
