import { useEffect, useState } from 'react';
import { formatCurrency } from '../utils/formatters';
import { monthsToPayoff } from '../utils/calculations';

function ActionLink({ label, url }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: '#fff', borderRadius: 12, marginBottom: 8, textDecoration: 'none', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
      <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'var(--navy)', fontWeight: 500 }}>{label}</span>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="var(--navy)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </a>
  );
}

function projectGrowth(monthly, months, annualRate) {
  const r = annualRate / 12;
  let bal = 0;
  for (let m = 0; m < months; m++) bal = (bal + monthly) * (1 + r);
  return Math.round(bal);
}

export default function Step5ModerateDebtScreen({ userData, updateUserData, onNext, onBack }) {
  const [mounted, setMounted] = useState(false);
  const [choice, setChoice] = useState(null);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t); }, []);

  const moderateDebt = (userData.debts || []).filter(d => d.rate >= 4 && d.rate <= 7);
  const isMilitary = userData.incomeType === 'military' || userData.partnerIncomeType === 'military';
  const MONTHS = 120; // 10 years
  const INVEST_RATE = 0.07 / 12;

  const handleContinue = () => {
    updateUserData({ moderateDebtChoice: choice });
    onNext('step6Retirement');
  };

  if (moderateDebt.length === 0) {
    return (
      <div style={{ minHeight: '100dvh', padding: '4px 24px 100px', background: '#F8F9FA', opacity: mounted ? 1 : 0, transition: 'opacity 300ms ease' }}>
        <button onClick={onBack} style={{ marginTop: 16, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--navy)' }}>
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none"><path d="M9 1L1 9L9 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600, color: 'var(--blue)', margin: '24px 0 4px', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Step 5</p>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: 'var(--navy)', margin: '0 0 16px' }}>Moderate-Rate Debt</h1>
        <div style={{ background: 'var(--light-green)', borderRadius: 12, padding: 16, marginBottom: 24 }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'var(--green)', fontWeight: 600, margin: 0 }}>✓ No moderate-rate debt. On to Step 6.</p>
        </div>
        <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, height: 80, background: 'linear-gradient(transparent, #F8F9FA 40%)', pointerEvents: 'none', zIndex: 99 }} />
        <button onClick={() => onNext('step6Retirement')} style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 48px)', maxWidth: 382, height: 56, background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: 16, fontFamily: 'DM Sans, sans-serif', fontSize: 18, fontWeight: 600, cursor: 'pointer', zIndex: 100 }}>Continue</button>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100dvh', padding: '4px 24px 100px', background: '#F8F9FA',
      opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(8px)',
      transition: 'opacity 300ms ease, transform 300ms ease',
    }}>
      <button onClick={onBack} aria-label="Back" style={{ marginTop: 16, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--navy)' }}>
        <svg width="10" height="18" viewBox="0 0 10 18" fill="none"><path d="M9 1L1 9L9 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>

      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600, color: 'var(--blue)', margin: '24px 0 4px', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Step 5</p>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: 'var(--navy)', margin: '0 0 8px', lineHeight: 1.2 }}>Moderate-Rate Debt</h1>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'var(--gray)', margin: '0 0 24px', lineHeight: 1.5 }}>
        At 4–7%, this debt isn't an emergency — but it's not free either. Here's the honest math.
      </p>

      {moderateDebt.map(debt => {
        const extra = Math.round(debt.minimum * 0.5);
        const payoffMonths = monthsToPayoff(debt.balance, debt.rate, debt.minimum + extra);
        const investAfterPayoff = projectGrowth(debt.minimum + extra, MONTHS - payoffMonths, INVEST_RATE);
        const investNow = projectGrowth(extra, MONTHS, INVEST_RATE);

        return (
          <div key={debt.id} style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600, color: 'var(--blue)', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {debt.type} — {formatCurrency(debt.balance)} at {debt.rate}%
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div style={{ background: 'var(--light-blue)', borderRadius: 12, padding: 14, textAlign: 'center' }}>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--navy)', margin: '0 0 6px', fontWeight: 600 }}>Pay off first</p>
                <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: 'var(--navy)', margin: '0 0 4px' }}>{formatCurrency(investAfterPayoff)}</p>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: 'var(--gray)', margin: 0 }}>invested at 10 yrs</p>
              </div>
              <div style={{ background: 'var(--light-gold)', borderRadius: 12, padding: 14, textAlign: 'center' }}>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--gray)', margin: '0 0 6px', fontWeight: 600 }}>Invest now</p>
                <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: 'var(--navy)', margin: '0 0 4px' }}>{formatCurrency(investNow)}</p>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: 'var(--gray)', margin: 0 }}>invested at 10 yrs</p>
              </div>
            </div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--gray)', margin: 0, lineHeight: 1.5 }}>
              At {debt.rate}%, the math is close. The right call depends on your peace of mind and what you'll actually do.
            </p>
          </div>
        );
      })}

      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 600, color: 'var(--navy)', margin: '0 0 12px' }}>
        What feels right to you?
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {[
          { val: 'payoff', label: 'Pay it off first', sub: 'Guaranteed return, less stress, more breathing room after.' },
          { val: 'invest', label: 'Invest alongside it', sub: 'Keep payments at minimum, put extra toward retirement now.' },
          { val: 'split', label: 'Split the difference', sub: 'Some extra toward debt, some toward retirement. Both move forward.' },
        ].map(opt => {
          const active = choice === opt.val;
          return (
            <button key={opt.val} onClick={() => setChoice(opt.val)} style={{
              textAlign: 'left', padding: '16px 20px', borderRadius: 16,
              border: `2px solid ${active ? 'var(--navy)' : 'transparent'}`,
              background: active ? 'var(--light-blue)' : '#fff',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)', cursor: 'pointer', transition: 'all 150ms',
            }}>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, fontWeight: 600, color: 'var(--navy)', margin: '0 0 2px' }}>{opt.label}</p>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)', margin: 0 }}>{opt.sub}</p>
            </button>
          );
        })}
      </div>

      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--gray)', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Resources</p>
      <ActionLink label="StudentAid.gov — loan simulator" url="https://studentaid.gov/loan-simulator/" />
      {isMilitary && <ActionLink label="SCRA — 6% interest rate cap" url="https://www.consumerfinance.gov/consumer-tools/military-financial-lifecycle/scra/" />}

      {choice && (
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
