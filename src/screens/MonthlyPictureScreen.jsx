import { useEffect, useState } from 'react';
import { formatCurrency } from '../utils/formatters';

function Stat({ label, value, color }) {
  return (
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--gray)', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</p>
      <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 40, fontWeight: 700, color: color || 'var(--navy)', margin: '0 0 4px', lineHeight: 1 }}>{formatCurrency(Math.abs(value))}</p>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--gray)', margin: 0 }}>per month</p>
    </div>
  );
}

export default function MonthlyPictureScreen({ userData, onNext, onBack }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t); }, []);

  const income = userData.monthlyTakeHome || 0;
  const expenses = userData.totalMonthlyExpenses || 0;
  const breathing = userData.breathingRoom || 0;
  const breathingPct = income > 0 ? breathing / income : 0;

  const fixedCosts = (userData.housing || 0) + (userData.carPayment || 0) + (userData.gasAndFuel || 0) + (userData.carInsurance || 0) + (userData.debts || []).reduce((s, d) => s + d.minimum, 0);
  const fixedPct = income > 0 ? fixedCosts / income : 0;
  const showWholePictureFlag = fixedPct > 0.60;

  let framingCopy;
  if (breathing < 0) {
    framingCopy = "Right now more is going out than coming in. Let's figure out why and find some breathing room.";
  } else if (breathingPct < 0.05) {
    framingCopy = "You've got a little room to work with. Let's put it in the right order.";
  } else {
    framingCopy = "You've got real breathing room. Here's how to make sure it's working as hard as possible.";
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

      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: 'var(--navy)', margin: '24px 0 0' }}>
        Your monthly picture
      </h1>

      <div style={{ background: '#fff', borderRadius: 20, padding: '4px 0', margin: '24px 0 0', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <Stat label="Money coming in" value={income} />
        <div style={{ height: 1, background: '#F0F0F0', margin: '0 20px' }} />
        <Stat label="Money going out" value={expenses} />
        <div style={{ height: 1, background: '#F0F0F0', margin: '0 20px' }} />
        <Stat
          label="Breathing room"
          value={breathing}
          color={breathing < 0 ? 'var(--red)' : 'var(--green)'}
        />
      </div>

      {breathing < 0 && (
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 600, color: 'var(--red)', textAlign: 'center', margin: '8px 0 0' }}>
          You're spending {formatCurrency(Math.abs(breathing))} more than you're bringing in.
        </p>
      )}

      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'var(--gray)', margin: '20px 0 0', lineHeight: 1.6 }}>
        {framingCopy}
      </p>

      {showWholePictureFlag && (
        <div style={{ background: 'var(--light-gold)', borderRadius: 12, padding: 16, marginTop: 20, borderLeft: '3px solid var(--gold)' }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)', margin: 0, lineHeight: 1.5 }}>
            Your fixed costs — housing, car, and debt minimums — are taking up {Math.round(fixedPct * 100)}% of your income. That's worth understanding. We'll address it in your plan.
          </p>
        </div>
      )}

      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, height: 80, background: 'linear-gradient(transparent, #F8F9FA 40%)', pointerEvents: 'none', zIndex: 99 }} />
      <button onClick={() => onNext('step1Cushion')} style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 48px)', maxWidth: 382, height: 56, background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: 16, fontFamily: 'DM Sans, sans-serif', fontSize: 18, fontWeight: 600, cursor: 'pointer', zIndex: 100 }}>
        Let's build your plan
      </button>
    </div>
  );
}
