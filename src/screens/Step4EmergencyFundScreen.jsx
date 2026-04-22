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

function calcEssential(userData) {
  return (
    (userData.housing || 0) +
    (userData.utilities || 0) +
    (userData.groceries || 0) +
    (userData.carPayment || 0) +
    (userData.gasAndFuel || 0) +
    (userData.carInsurance || 0) +
    (userData.phone || 0) +
    (userData.internet || 0) +
    (userData.healthInsurance || 0) +
    (userData.outOfPocketMedical || 0) +
    (userData.childcare || 0) +
    (userData.debts || []).reduce((s, d) => s + d.minimum, 0)
  );
}

export default function Step4EmergencyFundScreen({ userData, updateUserData, onNext, onBack }) {
  const [mounted, setMounted] = useState(false);
  const [choice, setChoice] = useState(userData.emergencyFundMonths ?? null);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t); }, []);

  const essential = calcEssential(userData);
  const target3 = essential * 3;
  const target6 = essential * 6;
  const breathing = userData.breathingRoom || 0;
  const isMilitary = userData.incomeType === 'military' || userData.partnerIncomeType === 'military';

  const targetAmount = choice === 3 ? target3 : choice === 6 ? target6 : null;
  const months = targetAmount && breathing > 0 ? Math.ceil(targetAmount / breathing) : null;

  const handleContinue = () => {
    updateUserData({ emergencyFundMonths: choice, emergencyFundTarget: targetAmount });
    onNext('step5ModerateDebt');
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

      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600, color: 'var(--blue)', margin: '24px 0 4px', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Step 4</p>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: 'var(--navy)', margin: '0 0 8px', lineHeight: 1.2 }}>Emergency Fund</h1>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'var(--gray)', margin: '0 0 8px', lineHeight: 1.5 }}>
        Your essential monthly expenses come to <strong style={{ color: 'var(--navy)' }}>{formatCurrency(essential)}/month</strong>. That's what you need to cover if your income stops.
      </p>

      {isMilitary && (
        <div style={{ background: 'var(--light-blue)', borderRadius: 12, padding: 14, marginBottom: 16 }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--navy)', margin: 0, lineHeight: 1.5 }}>
            Military income is highly stable. Three months is often sufficient for active duty.
          </p>
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        {[
          { val: 3, label: '3 months', amount: target3, sub: 'My income is stable and I have strong job security' },
          { val: 6, label: '6 months', amount: target6, sub: 'My income varies or my situation could change' },
        ].map(opt => {
          const active = choice === opt.val;
          return (
            <button key={opt.val} onClick={() => { setChoice(opt.val); updateUserData({ emergencyFundMonths: opt.val }); }} style={{
              flex: 1, textAlign: 'left', padding: '16px', borderRadius: 16,
              border: `2px solid ${active ? 'var(--navy)' : 'transparent'}`,
              background: active ? 'var(--light-blue)' : '#fff',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)', cursor: 'pointer', transition: 'all 150ms',
            }}>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--blue)', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{opt.label}</p>
              <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: 'var(--navy)', margin: '0 0 6px' }}>{formatCurrency(opt.amount)}</p>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--gray)', margin: 0, lineHeight: 1.4 }}>{opt.sub}</p>
            </button>
          );
        })}
      </div>

      {choice && (
        <>
          <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)', margin: '0 0 12px' }}>
              Your target: <strong style={{ color: 'var(--navy)' }}>{formatCurrency(targetAmount)}</strong>
            </p>
            {months && breathing > 0 ? (
              <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, fontWeight: 700, color: 'var(--navy)', margin: '0 0 4px' }}>
                {months} months to fully funded
              </p>
            ) : breathing <= 0 ? (
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)', margin: 0 }}>
                Free up some breathing room first — we'll address that above.
              </p>
            ) : null}
            {months && (
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--gray)', margin: '4px 0 0' }}>
                At your current breathing room of {formatCurrency(breathing)}/month, saving the full amount every month.
              </p>
            )}
          </div>
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--gray)', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Best place to keep it — a high-yield savings account
            </p>
            <ActionLink label="Marcus by Goldman Sachs" url="https://www.marcus.com" />
            <ActionLink label="Ally Bank" url="https://www.ally.com" />
            <ActionLink label="NerdWallet — Best HYSA rates" url="https://www.nerdwallet.com/best/banking/high-yield-online-savings-accounts" />
            {isMilitary && <ActionLink label="Navy Federal Credit Union" url="https://www.navyfederal.org" />}
            {isMilitary && <ActionLink label="USAA" url="https://www.usaa.com" />}
          </div>
        </>
      )}

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
