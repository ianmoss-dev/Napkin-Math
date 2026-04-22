import { useEffect, useState } from 'react';
import { formatCurrency } from '../utils/formatters';
import { getNextStepAfterCushion } from '../utils/flow';

const LINKS = [
  { label: 'Marcus by Goldman Sachs', url: 'https://www.marcus.com' },
  { label: 'Ally Bank', url: 'https://www.ally.com' },
  { label: 'NerdWallet — Best HYSA rates', url: 'https://www.nerdwallet.com/best/banking/high-yield-online-savings-accounts' },
];
const MILITARY_LINKS = [
  { label: 'Navy Federal Credit Union', url: 'https://www.navyfederal.org' },
  { label: 'USAA', url: 'https://www.usaa.com' },
];

function ActionLink({ label, url }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: '#fff', borderRadius: 12, marginBottom: 8, textDecoration: 'none', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
      <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'var(--navy)', fontWeight: 500 }}>{label}</span>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="var(--navy)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </a>
  );
}

export default function Step1CushionScreen({ userData, updateUserData, onNext, onBack }) {
  const [mounted, setMounted] = useState(false);
  const [answer, setAnswer] = useState(userData.hasCushion ?? null);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t); }, []);

  const breathing = userData.breathingRoom || 0;
  const monthsNeeded = breathing > 0 ? Math.ceil(1000 / breathing) : null;
  const isMilitary = userData.incomeType === 'military' || userData.partnerIncomeType === 'military';

  const handleSelect = (val) => {
    setAnswer(val);
    updateUserData({ hasCushion: val });
  };

  const allLinks = isMilitary ? [...LINKS, ...MILITARY_LINKS] : LINKS;

  return (
    <div style={{
      minHeight: '100dvh', padding: '4px 24px 100px', background: '#F8F9FA',
      opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(8px)',
      transition: 'opacity 300ms ease, transform 300ms ease',
    }}>
      <button onClick={onBack} aria-label="Back" style={{ marginTop: 16, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--navy)' }}>
        <svg width="10" height="18" viewBox="0 0 10 18" fill="none"><path d="M9 1L1 9L9 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>

      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600, color: 'var(--blue)', margin: '24px 0 4px', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Step 1</p>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: 'var(--navy)', margin: '0 0 8px', lineHeight: 1.2 }}>
        The $1,000 Cushion
      </h1>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'var(--gray)', margin: '0 0 24px', lineHeight: 1.5 }}>
        Do you have $1,000 sitting somewhere you don't touch?
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {[
          { val: 'yes', label: 'Yes', sub: 'I have a $1,000+ buffer I leave alone.' },
          { val: 'kindof', label: 'Kind of', sub: 'I have some savings but dip into it.' },
          { val: 'no', label: 'No', sub: "I don't have a separate cushion right now." },
        ].map(opt => {
          const active = answer === opt.val;
          return (
            <button key={opt.val} onClick={() => handleSelect(opt.val)} style={{
              textAlign: 'left', padding: '16px 20px', borderRadius: 16,
              border: `2px solid ${active ? 'var(--navy)' : 'transparent'}`,
              background: active ? 'var(--light-blue)' : '#fff',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)', cursor: 'pointer', transition: 'all 150ms',
            }}>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 17, fontWeight: 600, color: 'var(--navy)', margin: '0 0 2px' }}>{opt.label}</p>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)', margin: 0 }}>{opt.sub}</p>
            </button>
          );
        })}
      </div>

      {answer === 'yes' && (
        <div style={{ background: 'var(--light-green)', borderRadius: 12, padding: 16 }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'var(--green)', margin: 0, fontWeight: 600 }}>
            ✓ You've got the cushion. On to Step 2.
          </p>
        </div>
      )}

      {(answer === 'no' || answer === 'kindof') && (
        <div>
          {monthsNeeded && (
            <div style={{ background: 'var(--light-blue)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--navy)', margin: '0 0 4px', fontWeight: 600 }}>
                At your current breathing room ({formatCurrency(breathing)}/mo):
              </p>
              <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 700, color: 'var(--navy)', margin: '0 0 4px' }}>
                {monthsNeeded} {monthsNeeded === 1 ? 'month' : 'months'} to $1,000
              </p>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--gray)', margin: 0 }}>
                Open a high-yield savings account, name it "Do Not Touch," and set up an auto-transfer on payday.
              </p>
            </div>
          )}
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--gray)', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Where to open one
          </p>
          {allLinks.map(l => <ActionLink key={l.url} {...l} />)}
        </div>
      )}

      {answer != null && (
        <>
          <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, height: 80, background: 'linear-gradient(transparent, #F8F9FA 40%)', pointerEvents: 'none', zIndex: 99 }} />
          <button onClick={() => onNext(getNextStepAfterCushion(userData))} style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 48px)', maxWidth: 382, height: 56, background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: 16, fontFamily: 'DM Sans, sans-serif', fontSize: 18, fontWeight: 600, cursor: 'pointer', zIndex: 100 }}>
            Continue
          </button>
        </>
      )}
    </div>
  );
}
