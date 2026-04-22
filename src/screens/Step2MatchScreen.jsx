import { useEffect, useState } from 'react';
import { formatCurrency } from '../utils/formatters';
import { getNextStepAfterMatch, hasAnyMatchOpportunity } from '../utils/flow';

function ActionLink({ label, url }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: '#fff', borderRadius: 12, marginBottom: 8, textDecoration: 'none', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
      <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'var(--navy)', fontWeight: 500 }}>{label}</span>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="var(--navy)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </a>
  );
}

function ResponseButtons({ answer, onAnswer }) {
  return (
    <div style={{ display: 'flex', gap: 10 }}>
      {[{ val: 'yes', label: 'Yes' }, { val: 'no', label: 'No' }, { val: 'unsure', label: 'Not sure' }].map(opt => {
        const active = answer === opt.val;
        return (
          <button key={opt.val} onClick={() => onAnswer(opt.val)} style={{
            flex: 1, height: 48, borderRadius: 12,
            border: `2px solid ${active ? 'var(--navy)' : '#E0E0E0'}`,
            background: active ? 'var(--navy)' : '#fff',
            color: active ? '#fff' : 'var(--navy)',
            fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: active ? 600 : 400,
            cursor: 'pointer', transition: 'all 150ms',
          }}>{opt.label}</button>
        );
      })}
    </div>
  );
}

function MilitaryMatchBlock({ label, basePay, answer, onAnswer }) {
  const matchMonthly = Math.round(basePay * 0.05);
  const matchAnnual = matchMonthly * 12;

  return (
    <div style={{ marginBottom: 24 }}>
      {label && <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--blue)', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</p>}
      <div style={{ background: 'var(--navy)', borderRadius: 16, padding: 20, marginBottom: 16, display: 'flex', gap: 16 }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.6)', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Monthly match</p>
          <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 700, color: '#fff', margin: 0 }}>{formatCurrency(matchMonthly)}</p>
        </div>
        <div style={{ width: 1, background: 'rgba(255,255,255,0.15)' }} />
        <div style={{ flex: 1, textAlign: 'center' }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.6)', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Annual match</p>
          <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 700, color: '#fff', margin: 0 }}>{formatCurrency(matchAnnual)}</p>
        </div>
      </div>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'var(--gray)', margin: '0 0 16px', lineHeight: 1.6 }}>
        Your employer set aside money each month for you. If you don&apos;t meet the match, you&apos;re handing it back.
      </p>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 600, color: 'var(--navy)', margin: '0 0 12px' }}>
        Contributing at least 5% to TSP?
      </p>
      <ResponseButtons answer={answer} onAnswer={onAnswer} />
    </div>
  );
}

function CivilianMatchBlock({ label, answer, onAnswer }) {
  return (
    <div style={{ marginBottom: 24 }}>
      {label && <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--blue)', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</p>}
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'var(--gray)', margin: '0 0 16px', lineHeight: 1.6 }}>
        Your employer set aside money each month for you. If you don&apos;t meet the match, you&apos;re handing it back.
      </p>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 600, color: 'var(--navy)', margin: '0 0 12px' }}>
        Are you contributing enough to get the full employer match?
      </p>
      <ResponseButtons answer={answer} onAnswer={onAnswer} />
    </div>
  );
}

export default function Step2MatchScreen({ userData, updateUserData, onNext, onBack }) {
  const [mounted, setMounted] = useState(false);
  const [m1Answer, setM1Answer] = useState(userData.capturingMatch ?? null);
  const [m2Answer, setM2Answer] = useState(userData.capturingMatchM2 ?? null);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t); }, []);

  const showActionM1 = m1Answer === 'no' || m1Answer === 'unsure';
  const showActionM2 = m2Answer === 'no' || m2Answer === 'unsure';

  const members = [
    userData.incomeType === 'military' ? { id: 'm1', type: 'military', label: userData.householdType === 'partner' ? 'Your TSP Match' : null, answer: m1Answer } : null,
    userData.incomeType === 'civilian' ? { id: 'm1', type: 'civilian', label: userData.householdType === 'partner' ? 'Your Employer Match' : null, answer: m1Answer } : null,
    userData.partnerIncomeType === 'military' ? { id: 'm2', type: 'military', label: "Partner's TSP Match", answer: m2Answer } : null,
    userData.partnerIncomeType === 'civilian' ? { id: 'm2', type: 'civilian', label: "Partner's Employer Match", answer: m2Answer } : null,
  ].filter(Boolean);

  const canContinue = members.every((member) => member.answer != null);

  const handleContinue = () => {
    updateUserData({ capturingMatch: m1Answer, capturingMatchM2: m2Answer });
    onNext(getNextStepAfterMatch(userData));
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

      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600, color: 'var(--blue)', margin: '24px 0 4px', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Step 2</p>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: 'var(--navy)', margin: '0 0 8px', lineHeight: 1.2 }}>Match</h1>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'var(--gray)', margin: '0 0 24px', lineHeight: 1.5 }}>
        Free money is on the table. Let&apos;s make sure your household is picking it up.
      </p>

      {!hasAnyMatchOpportunity(userData) && (
        <div style={{ background: 'var(--light-blue)', borderRadius: 12, padding: 16, marginBottom: 24 }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--navy)', margin: 0, lineHeight: 1.5 }}>
            No employer or TSP match showed up in your household path, so we&apos;re skipping straight to the next priority.
          </p>
        </div>
      )}

      {userData.incomeType === 'military' && (
        <>
          <MilitaryMatchBlock
            label={userData.householdType === 'partner' ? 'Your TSP Match' : null}
            basePay={userData.m1BasePay || 0}
            answer={m1Answer}
            onAnswer={val => { setM1Answer(val); updateUserData({ capturingMatch: val }); }}
          />
          {showActionM1 && (
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--gray)', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Set it up in MyPay
              </p>
              <ActionLink label="Log in to MyPay" url="https://mypay.dfas.mil" />
              <ActionLink label="TSP.gov - contribution guide" url="https://www.tsp.gov" />
            </div>
          )}
        </>
      )}

      {userData.incomeType === 'civilian' && (
        <>
          <CivilianMatchBlock
            label={userData.householdType === 'partner' ? 'Your Employer Match' : null}
            answer={m1Answer}
            onAnswer={val => { setM1Answer(val); updateUserData({ capturingMatch: val }); }}
          />
          {showActionM1 && (
            <div style={{ background: 'var(--light-gold)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)', margin: 0, lineHeight: 1.5 }}>
                Log into your HR portal or benefits site and increase your contribution until the full employer match is captured.
              </p>
            </div>
          )}
        </>
      )}

      {userData.partnerIncomeType === 'military' && (
        <>
          <MilitaryMatchBlock
            label="Partner's TSP Match"
            basePay={userData.m2BasePay || 0}
            answer={m2Answer}
            onAnswer={val => { setM2Answer(val); updateUserData({ capturingMatchM2: val }); }}
          />
          {showActionM2 && (
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--gray)', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Partner set-up in MyPay
              </p>
              <ActionLink label="Log in to MyPay" url="https://mypay.dfas.mil" />
            </div>
          )}
        </>
      )}

      {userData.partnerIncomeType === 'civilian' && (
        <>
          <CivilianMatchBlock
            label="Partner's Employer Match"
            answer={m2Answer}
            onAnswer={val => { setM2Answer(val); updateUserData({ capturingMatchM2: val }); }}
          />
          {showActionM2 && (
            <div style={{ background: 'var(--light-gold)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)', margin: 0, lineHeight: 1.5 }}>
                Have your partner check their benefits portal or HR system and increase contributions until the full employer match is captured.
              </p>
            </div>
          )}
        </>
      )}

      {(canContinue || !hasAnyMatchOpportunity(userData)) && (
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
