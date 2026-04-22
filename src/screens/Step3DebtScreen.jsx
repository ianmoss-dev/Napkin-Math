import { useEffect, useState } from 'react';
import { formatCurrency } from '../utils/formatters';
import { monthsToPayoff } from '../utils/calculations';
import DebtPayoffChart from '../components/DebtPayoffChart';
import WealthBuildingChart from '../components/WealthBuildingChart';

function ActionLink({ label, url }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: '#fff', borderRadius: 12, marginBottom: 8, textDecoration: 'none', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
      <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'var(--navy)', fontWeight: 500 }}>{label}</span>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="var(--navy)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </a>
  );
}

const INVESTMENT_YEARS = 30;

export default function Step3DebtScreen({ userData, updateUserData, onNext, onBack }) {
  const [mounted, setMounted] = useState(false);
  const [strategy, setStrategy] = useState(null);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t); }, []);

  const highDebt = (userData.debts || []).filter(d => d.rate > 7);
  const totalBalance = highDebt.reduce((s, d) => s + d.balance, 0);
  const totalMinimum = highDebt.reduce((s, d) => s + d.minimum, 0);
  const isMilitary = userData.incomeType === 'military' || userData.partnerIncomeType === 'military';

  const [payment, setPayment] = useState(totalMinimum);
  const sliderMin = totalMinimum;
  const sliderMax = Math.max(totalMinimum * 3, totalMinimum + 500);

  if (highDebt.length === 0) {
    return (
      <div style={{ minHeight: '100dvh', padding: '4px 24px 100px', background: '#F8F9FA', opacity: mounted ? 1 : 0, transition: 'opacity 300ms ease' }}>
        <button onClick={onBack} style={{ marginTop: 16, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--navy)' }}>
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none"><path d="M9 1L1 9L9 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600, color: 'var(--blue)', margin: '24px 0 4px', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Step 3</p>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: 'var(--navy)', margin: '0 0 16px' }}>High-Interest Debt</h1>
        <div style={{ background: 'var(--light-green)', borderRadius: 12, padding: 16, marginBottom: 24 }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'var(--green)', margin: 0, fontWeight: 600 }}>✓ No high-interest debt. On to Step 4.</p>
        </div>
        <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, height: 80, background: 'linear-gradient(transparent, #F8F9FA 40%)', pointerEvents: 'none', zIndex: 99 }} />
        <button onClick={() => onNext('step4EmergencyFund')} style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 48px)', maxWidth: 382, height: 56, background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: 16, fontFamily: 'DM Sans, sans-serif', fontSize: 18, fontWeight: 600, cursor: 'pointer', zIndex: 100 }}>Continue</button>
      </div>
    );
  }

  const months = payment > 0 ? monthsToPayoff(totalBalance, highDebt[0]?.rate || 20, payment) : null;
  const monthsInterest = highDebt.reduce((s, d) => s + Math.round(d.balance * d.rate / 100 / 12), 0);

  return (
    <div style={{
      minHeight: '100dvh', padding: '4px 24px 100px', background: '#F8F9FA',
      opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(8px)',
      transition: 'opacity 300ms ease, transform 300ms ease',
    }}>
      <button onClick={onBack} aria-label="Back" style={{ marginTop: 16, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--navy)' }}>
        <svg width="10" height="18" viewBox="0 0 10 18" fill="none"><path d="M9 1L1 9L9 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>

      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600, color: 'var(--blue)', margin: '24px 0 4px', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Step 3</p>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: 'var(--navy)', margin: '0 0 8px', lineHeight: 1.2 }}>High-Interest Debt</h1>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'var(--gray)', margin: '0 0 24px', lineHeight: 1.5 }}>
        This debt costs you {formatCurrency(monthsInterest)}/month in interest alone. Let's see what paying it off actually unlocks.
      </p>

      {highDebt.map(d => (
        <div key={d.id} style={{ background: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600, color: 'var(--blue)', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{d.type}</p>
              <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: 'var(--navy)', margin: 0 }}>{formatCurrency(d.balance)}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--gray)', margin: '0 0 2px' }}>{d.rate}% APR</p>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600, color: 'var(--red)', margin: 0 }}>
                {formatCurrency(Math.round(d.balance * d.rate / 100 / 12))}/mo in interest
              </p>
            </div>
          </div>
        </div>
      ))}

      <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--gray)', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Monthly payment — {formatCurrency(payment)}
        </p>
        <input
          type="range"
          min={sliderMin}
          max={sliderMax}
          value={payment}
          onChange={e => setPayment(Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--navy)', marginBottom: 8 }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--gray)' }}>Minimum {formatCurrency(sliderMin)}</span>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--gray)' }}>3× {formatCurrency(sliderMax)}</span>
        </div>
        {months && (
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--navy)', fontWeight: 600, margin: '12px 0 0', textAlign: 'center' }}>
            Paid off in {months} months ({(months / 12).toFixed(1)} years)
          </p>
        )}
      </div>

      <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--gray)', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Debt payoff</p>
        <DebtPayoffChart balance={totalBalance} rate={highDebt[0]?.rate || 20} payment={payment} />
      </div>

      <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)', margin: '0 0 12px', lineHeight: 1.5 }}>
          That's {formatCurrency(payment)}/month you're already spending on debt. The month it's gone, it becomes an investment.
        </p>
        <WealthBuildingChart monthlyAmount={payment} years={INVESTMENT_YEARS} />
      </div>

      <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 600, color: 'var(--navy)', margin: '0 0 12px' }}>How do you want to attack it?</p>
        {[
          { val: 'avalanche', label: 'Highest rate first', sub: 'Pay minimums on everything, throw extra at the highest interest rate. Costs less overall.' },
          { val: 'snowball', label: 'Smallest balance first', sub: 'Pay minimums on everything, throw extra at the smallest balance. More motivating.' },
        ].map(opt => {
          const active = strategy === opt.val;
          return (
            <button key={opt.val} onClick={() => setStrategy(opt.val)} style={{
              width: '100%', textAlign: 'left', padding: '14px 16px', borderRadius: 12, marginBottom: 10,
              border: `2px solid ${active ? 'var(--navy)' : '#E0E0E0'}`,
              background: active ? 'var(--light-blue)' : '#fff',
              cursor: 'pointer', transition: 'all 150ms',
            }}>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 600, color: 'var(--navy)', margin: '0 0 2px' }}>{opt.label}</p>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--gray)', margin: 0 }}>{opt.sub}</p>
            </button>
          );
        })}
      </div>

      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--gray)', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Resources</p>
      <ActionLink label="Undebt.it — free debt payoff tracker" url="https://undebt.it" />
      <ActionLink label="AnnualCreditReport.com" url="https://www.annualcreditreport.com" />
      {isMilitary && <ActionLink label="SCRA — 6% interest rate cap for service members" url="https://www.consumerfinance.gov/consumer-tools/military-financial-lifecycle/scra/" />}

      {strategy && (
        <>
          <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, height: 80, background: 'linear-gradient(transparent, #F8F9FA 40%)', pointerEvents: 'none', zIndex: 99 }} />
          <button onClick={() => { updateUserData({ debtStrategy: strategy, debtPayment: payment }); onNext('step4EmergencyFund'); }} style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 48px)', maxWidth: 382, height: 56, background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: 16, fontFamily: 'DM Sans, sans-serif', fontSize: 18, fontWeight: 600, cursor: 'pointer', zIndex: 100 }}>
            Continue
          </button>
        </>
      )}
    </div>
  );
}
