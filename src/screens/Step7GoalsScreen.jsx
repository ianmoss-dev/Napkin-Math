import { useEffect, useState } from 'react';
import { formatCurrency } from '../utils/formatters';

function ActionLink({ label, url }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: '#fff', borderRadius: 12, marginBottom: 8, textDecoration: 'none', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
      <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'var(--navy)', fontWeight: 500 }}>{label}</span>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="var(--navy)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </a>
  );
}

const GOAL_OPTIONS = [
  { id: 'home',      label: '🏠 Buy a home',         placeholder: 'Down payment target' },
  { id: 'car',       label: '🚗 Buy a car',           placeholder: 'Target price' },
  { id: 'wedding',   label: '💍 Wedding',             placeholder: 'Budget' },
  { id: 'business',  label: '💼 Start a business',    placeholder: 'Starting capital' },
  { id: 'education', label: '🎓 Education',           placeholder: 'Tuition target' },
  { id: 'military',  label: '✈️ Leave the military',  placeholder: 'Transition fund target' },
  { id: 'other',     label: '⭐ Something else',      placeholder: 'Amount' },
];

export default function Step7GoalsScreen({ userData, updateUserData, onNext, onBack }) {
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState(new Set((userData.goals || []).map(g => g.id)));
  const [details, setDetails] = useState(() => {
    const d = {};
    (userData.goals || []).forEach(g => { d[g.id] = { amount: g.amount || '', years: g.years || '' }; });
    return d;
  });

  useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t); }, []);

  const isMilitary = userData.incomeType === 'military' || userData.partnerIncomeType === 'military';
  const toggleGoal = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const setDetail = (id, field, val) => {
    setDetails(prev => ({ ...prev, [id]: { ...(prev[id] || {}), [field]: val } }));
  };

  const monthlyNeeded = (amount, years) => {
    const a = parseFloat(amount), y = parseFloat(years);
    if (!a || !y || y <= 0) return null;
    return Math.ceil(a / (y * 12));
  };

  const goals = GOAL_OPTIONS.filter(g => selected.has(g.id)).map(g => ({
    ...g,
    amount: details[g.id]?.amount || '',
    years: details[g.id]?.years || '',
  }));

  const handleContinue = () => {
    updateUserData({ goals });
    onNext('step8Optimize');
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

      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600, color: 'var(--blue)', margin: '24px 0 4px', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Step 7</p>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: 'var(--navy)', margin: '0 0 8px', lineHeight: 1.2 }}>Big Goals</h1>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'var(--gray)', margin: '0 0 24px', lineHeight: 1.5 }}>
        What are you saving toward? Select everything that applies.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
        {GOAL_OPTIONS.map(g => {
          const active = selected.has(g.id);
          return (
            <button key={g.id} onClick={() => toggleGoal(g.id)} style={{
              height: 64, borderRadius: 14, textAlign: 'center',
              border: `2px solid ${active ? 'var(--navy)' : 'transparent'}`,
              background: active ? 'var(--light-blue)' : '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: active ? 600 : 400,
              color: 'var(--navy)', cursor: 'pointer', transition: 'all 150ms', padding: '0 10px',
            }}>{g.label}</button>
          );
        })}
      </div>

      {goals.map(g => {
        const monthly = monthlyNeeded(g.amount, g.years);
        return (
          <div key={g.id} style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600, color: 'var(--navy)', margin: '0 0 14px' }}>{g.label}</p>
            <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <div style={{ flex: 2 }}>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--gray)', margin: '0 0 4px' }}>{g.placeholder}</p>
                <input
                  type="number" inputMode="decimal" placeholder="$0"
                  value={g.amount}
                  onChange={e => setDetail(g.id, 'amount', e.target.value)}
                  style={{ width: '100%', height: 48, border: '2px solid #E0E0E0', borderRadius: 10, fontFamily: 'DM Sans, sans-serif', fontSize: 16, padding: '0 12px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--gray)', margin: '0 0 4px' }}>In how many years?</p>
                <input
                  type="number" inputMode="decimal" placeholder="5"
                  value={g.years}
                  onChange={e => setDetail(g.id, 'years', e.target.value)}
                  style={{ width: '100%', height: 48, border: '2px solid #E0E0E0', borderRadius: 10, fontFamily: 'DM Sans, sans-serif', fontSize: 16, padding: '0 12px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            </div>
            {monthly && (
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--navy)', fontWeight: 600, margin: '0 0 8px' }}>
                Save {formatCurrency(monthly)}/month to hit this goal.
              </p>
            )}
            {g.id === 'home' && (
              <div style={{ marginTop: 8 }}>
                {isMilitary
                  ? <ActionLink label="VA Loan — no down payment for eligible veterans" url="https://www.benefits.va.gov/homeloans/" />
                  : <ActionLink label="CFPB — First-time homebuyer guide" url="https://www.consumerfinance.gov/owning-a-home/" />}
              </div>
            )}
            {g.id === 'education' && (
              <div style={{ marginTop: 8 }}>
                <ActionLink label="529 plans — tax-advantaged education savings" url="https://www.savingforcollege.com" />
              </div>
            )}
            {g.id === 'military' && isMilitary && (
              <div style={{ background: 'var(--light-gold)', borderRadius: 10, padding: 14, marginTop: 8 }}>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--navy)', margin: '0 0 4px' }}>Separation snapshot</p>
                {userData.monthlyPension > 0 && (
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--gray)', margin: '0 0 4px', lineHeight: 1.4 }}>
                    Your pension is worth {formatCurrency(userData.pensionSWRLow)}–{formatCurrency(userData.pensionSWRHigh)} in equivalent savings. A civilian salary would need to replace that plus your TSP.
                  </p>
                )}
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--gray)', margin: 0, lineHeight: 1.4 }}>
                  We'll come back to this. When we get to your goals, we'll show you exactly what compensation package you'd need on the outside to truly come out ahead.
                </p>
              </div>
            )}
          </div>
        );
      })}

      {selected.size === 0 && (
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)', fontStyle: 'italic', textAlign: 'center', margin: '0 0 24px' }}>
          No big goals right now — that's fine. You can always add them later.
        </p>
      )}

      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, height: 80, background: 'linear-gradient(transparent, #F8F9FA 40%)', pointerEvents: 'none', zIndex: 99 }} />
      <button onClick={handleContinue} style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 48px)', maxWidth: 382, height: 56, background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: 16, fontFamily: 'DM Sans, sans-serif', fontSize: 18, fontWeight: 600, cursor: 'pointer', zIndex: 100 }}>
        Continue
      </button>
    </div>
  );
}
