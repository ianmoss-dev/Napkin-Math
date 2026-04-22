import { useEffect, useState } from 'react';
import { formatCurrency } from '../utils/formatters';
import MonteCarloChart from '../components/MonteCarloChart';

function ActionLink({ label, url }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: '#fff', borderRadius: 12, marginBottom: 8, textDecoration: 'none', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
      <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'var(--navy)', fontWeight: 500 }}>{label}</span>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="var(--navy)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </a>
  );
}

const PROFILES = [
  { val: 'conservative', label: 'Conservative', desc: 'Lower expected return, less volatility. Good for shorter timelines or risk-averse investors.' },
  { val: 'moderate', label: 'Moderate', desc: 'Balanced mix. Most common choice for long-term retirement investors.' },
  { val: 'aggressive', label: 'Aggressive', desc: 'Higher expected return, more volatility. Best suited for long timelines (20+ years).' },
];

export default function Step6RetirementScreen({ userData, updateUserData, onNext, onBack }) {
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState(null);
  const [showExplainer, setShowExplainer] = useState(false);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t); }, []);

  const income = userData.monthlyTakeHome || 0;
  const target15 = Math.round(income * 0.15);
  const isMilitary = userData.incomeType === 'military';
  const hasPension = isMilitary && userData.retirementIntent !== 'no';
  const monthlyPension = userData.monthlyPension || 0;
  const YEARS = 30;

  const handleContinue = () => {
    updateUserData({ retirementProfile: profile });
    onNext('step7Goals');
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

      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600, color: 'var(--blue)', margin: '24px 0 4px', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Step 6</p>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: 'var(--navy)', margin: '0 0 8px', lineHeight: 1.2 }}>Retirement</h1>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'var(--gray)', margin: '0 0 24px', lineHeight: 1.5 }}>
        The target is 15% of your take-home income toward retirement.
      </p>

      <div style={{ background: 'var(--navy)', borderRadius: 16, padding: 20, marginBottom: 16, display: 'flex', gap: 16 }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.6)', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>15% target</p>
          <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 700, color: '#fff', margin: 0 }}>{formatCurrency(target15)}/mo</p>
        </div>
        {hasPension && monthlyPension > 0 && (
          <>
            <div style={{ width: 1, background: 'rgba(255,255,255,0.15)' }} />
            <div style={{ flex: 1, textAlign: 'center' }}>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.6)', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Pension covers</p>
              <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 700, color: 'var(--gold)', margin: 0 }}>{formatCurrency(monthlyPension)}/mo</p>
            </div>
          </>
        )}
      </div>

      {isMilitary && (
        <div style={{ background: 'var(--light-blue)', borderRadius: 12, padding: 14, marginBottom: 16 }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--navy)', margin: 0, lineHeight: 1.5 }}>
            {hasPension
              ? `Your pension handles a portion. TSP fills the gap — target at least 5% for the match, more when you can.`
              : `No pension in your plan. TSP is your primary retirement vehicle — aim for 15% of base pay.`}
          </p>
        </div>
      )}

      {isMilitary && (
        <div style={{ marginBottom: 16 }}>
          <ActionLink label="TSP L Fund — set it and forget it" url="https://www.tsp.gov/funds-lifecycle/" />
          <ActionLink label="All TSP fund options" url="https://www.tsp.gov/funds-individual/" />
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 600, color: 'var(--navy)', margin: '0 0 12px' }}>
          Pick a scenario to see the projection
        </p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          {PROFILES.map(p => {
            const active = profile === p.val;
            return (
              <button key={p.val} onClick={() => setProfile(p.val)} style={{
                flex: 1, height: 44, borderRadius: 10,
                border: `2px solid ${active ? 'var(--navy)' : '#E0E0E0'}`,
                background: active ? 'var(--navy)' : '#fff',
                color: active ? '#fff' : 'var(--navy)',
                fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: active ? 600 : 400,
                cursor: 'pointer', transition: 'all 150ms',
              }}>{p.label}</button>
            );
          })}
        </div>

        <button onClick={() => setShowExplainer(v => !v)} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--blue)', background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 12px', textDecoration: 'underline' }}>
          {showExplainer ? 'Hide explanation' : 'How did we define these?'}
        </button>

        {showExplainer && (
          <div style={{ background: '#F8F9FA', borderRadius: 10, padding: 14, marginBottom: 12 }}>
            {PROFILES.map(p => (
              <div key={p.val} style={{ marginBottom: 10 }}>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--navy)', margin: '0 0 2px' }}>{p.label}</p>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--gray)', margin: 0, lineHeight: 1.4 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        )}

        {profile && (
          <>
            <MonteCarloChart contribution={target15} years={YEARS} profile={profile} />
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--gray)', margin: '16px 0 0', lineHeight: 1.6, fontStyle: 'italic' }}>
              All three people contributed the same amount every month. The difference is luck and timing — not effort.
            </p>
          </>
        )}
      </div>

      {isMilitary && (
        <div style={{ marginBottom: 16 }}>
          <ActionLink label="MilTax — free tax filing for military" url="https://www.militaryonesource.mil/financial-legal/tax-resource-center/miltax-military-tax-services/" />
        </div>
      )}

      {profile && (
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
