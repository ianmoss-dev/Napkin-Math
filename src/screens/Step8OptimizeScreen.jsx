import { useEffect, useState } from 'react';

function ActionLink({ label, url }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: '#fff', borderRadius: 12, marginBottom: 8, textDecoration: 'none', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
      <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'var(--navy)', fontWeight: 500 }}>{label}</span>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="var(--navy)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </a>
  );
}

export default function Step8OptimizeScreen({ userData, updateUserData, onNext, onBack }) {
  const [mounted, setMounted] = useState(false);
  const [rothChoice, setRothChoice] = useState(userData.rothChoice ?? null);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t); }, []);

  const scale = userData.napkinScale;
  const showStep8 = ['drafting', 'building', 'built'].includes(scale);
  const isMilitary = userData.incomeType === 'military' || userData.partnerIncomeType === 'military';
  const hasHSA = userData.hasHSA === true;

  const handleContinue = () => {
    updateUserData({ rothChoice });
    onNext('scoreScreen');
  };

  if (!showStep8) {
    return (
      <div style={{ minHeight: '100dvh', padding: '4px 24px 100px', background: '#F8F9FA', opacity: mounted ? 1 : 0, transition: 'opacity 300ms ease' }}>
        <button onClick={onBack} style={{ marginTop: 16, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--navy)' }}>
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none"><path d="M9 1L1 9L9 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600, color: 'var(--blue)', margin: '24px 0 4px', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Step 8</p>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: 'var(--navy)', margin: '0 0 16px' }}>Optimize</h1>
        <div style={{ background: 'var(--light-blue)', borderRadius: 12, padding: 16, marginBottom: 24 }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'var(--navy)', margin: 0, lineHeight: 1.5 }}>
            This step unlocks once your foundation is solid — emergency fund, match captured, and retirement on track. Come back when you're at Drafting or higher.
          </p>
        </div>
        <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, height: 80, background: 'linear-gradient(transparent, #F8F9FA 40%)', pointerEvents: 'none', zIndex: 99 }} />
        <button onClick={() => onNext('scoreScreen')} style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 48px)', maxWidth: 382, height: 56, background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: 16, fontFamily: 'DM Sans, sans-serif', fontSize: 18, fontWeight: 600, cursor: 'pointer', zIndex: 100 }}>
          See my score
        </button>
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

      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600, color: 'var(--blue)', margin: '24px 0 4px', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Step 8</p>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: 'var(--navy)', margin: '0 0 8px', lineHeight: 1.2 }}>Optimize</h1>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'var(--gray)', margin: '0 0 24px', lineHeight: 1.5 }}>
        The foundation is solid. Now let's squeeze efficiency out of every dollar.
      </p>

      <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 600, color: 'var(--navy)', margin: '0 0 8px' }}>Roth or Traditional?</p>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)', margin: '0 0 14px', lineHeight: 1.5 }}>
          Roth: pay taxes now, withdraw tax-free in retirement. Traditional: defer taxes now, pay later. The right answer depends on whether you expect to be in a higher or lower bracket in retirement.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { val: 'roth', label: 'Roth', sub: "I'm in a lower bracket now than I expect to be in retirement. Pay tax now, grow tax-free." },
            { val: 'traditional', label: 'Traditional', sub: "I'm in a higher bracket now. Defer the tax hit until retirement when I'll withdraw less." },
            { val: 'both', label: 'Both / Not sure', sub: 'Split contributions or consult a tax professional. Both accounts have value.' },
          ].map(opt => {
            const active = rothChoice === opt.val;
            return (
              <button key={opt.val} onClick={() => setRothChoice(opt.val)} style={{
                textAlign: 'left', padding: '14px 16px', borderRadius: 12,
                border: `2px solid ${active ? 'var(--navy)' : '#E0E0E0'}`,
                background: active ? 'var(--light-blue)' : '#fff',
                cursor: 'pointer', transition: 'all 150ms',
              }}>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 600, color: 'var(--navy)', margin: '0 0 2px' }}>{opt.label}</p>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--gray)', margin: 0, lineHeight: 1.4 }}>{opt.sub}</p>
              </button>
            );
          })}
        </div>
        <div style={{ marginTop: 12 }}>
          <ActionLink label="IRS Roth IRA income limits" url="https://www.irs.gov/retirement-plans/roth-iras" />
        </div>
      </div>

      {hasHSA && (
        <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 600, color: 'var(--navy)', margin: '0 0 8px' }}>Max your HSA</p>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)', margin: '0 0 12px', lineHeight: 1.5 }}>
            Your HSA is the only account with a triple tax advantage: contributions are pre-tax, growth is tax-free, and withdrawals for medical expenses are tax-free. Max it before adding to taxable accounts.
          </p>
          <ActionLink label="Fidelity HSA — why it matters" url="https://www.fidelity.com/go/hsa/why-hsa" />
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 600, color: 'var(--navy)', margin: '0 0 12px' }}>Go deeper</p>
        <ActionLink label="Bogleheads — evidence-based investing" url="https://www.bogleheads.org/wiki/Main_Page" />
        {isMilitary && <ActionLink label="MilTax — free filing for military" url="https://www.militaryonesource.mil/financial-legal/tax-resource-center/miltax-military-tax-services/" />}
      </div>

      {rothChoice && (
        <>
          <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, height: 80, background: 'linear-gradient(transparent, #F8F9FA 40%)', pointerEvents: 'none', zIndex: 99 }} />
          <button onClick={handleContinue} style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 48px)', maxWidth: 382, height: 56, background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: 16, fontFamily: 'DM Sans, sans-serif', fontSize: 18, fontWeight: 600, cursor: 'pointer', zIndex: 100 }}>
            See my score
          </button>
        </>
      )}
    </div>
  );
}
