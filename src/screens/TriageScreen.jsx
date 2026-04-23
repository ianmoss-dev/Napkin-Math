import { useEffect, useState } from 'react';
import { getNextIncomeScreen, hasAnyMatchOpportunity } from '../utils/flow';

const FUND_OPTIONS = [
  { value: 'yes', label: 'Yes', body: 'I have at least $1,000 that I do not touch.' },
  { value: 'kindof', label: 'Sort of', body: 'I have some savings, but I dip into it.' },
  { value: 'no', label: 'No', body: 'I do not have a real emergency cushion yet.' },
];

const MATCH_OPTIONS = [
  { value: 'yes', label: 'Yes', body: 'I am already getting the full match.' },
  { value: 'no', label: 'No', body: 'I know there is a match and I am not getting all of it.' },
  { value: 'unsure', label: 'Not sure', body: 'I need to check my TSP or benefits portal.' },
];

const DEBT_OPTIONS = [
  { value: 'yes', label: 'Yes', body: 'I have credit-card or other debt above about 7%.' },
  { value: 'no', label: 'No', body: 'Nothing meaningfully high-interest right now.' },
  { value: 'unsure', label: 'Not sure', body: 'I need to check rates, but I know there is debt.' },
];

function OptionRow({ options, selected, onSelect }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {options.map((option) => {
        const active = selected === option.value;
        return (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            style={{
              textAlign: 'left',
              padding: '16px 18px',
              borderRadius: 16,
              border: `2px solid ${active ? 'var(--navy)' : 'transparent'}`,
              background: active ? 'var(--light-blue)' : '#fff',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              cursor: 'pointer',
              transition: 'all 150ms',
            }}
          >
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, fontWeight: 600, color: 'var(--navy)', margin: '0 0 4px' }}>
              {option.label}
            </p>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)', margin: 0, lineHeight: 1.45 }}>
              {option.body}
            </p>
          </button>
        );
      })}
    </div>
  );
}

export default function TriageScreen({ userData, updateUserData, onNext, onBack }) {
  const [mounted, setMounted] = useState(false);
  const [fund, setFund] = useState(userData.hasCushion ?? null);
  const [match, setMatch] = useState(userData.capturingMatch ?? null);
  const [partnerMatch, setPartnerMatch] = useState(userData.capturingMatchM2 ?? null);
  const [debt, setDebt] = useState(userData.highInterestDebt ?? null);

  const showPrimaryMatch = userData.incomeType === 'civilian' || userData.incomeType === 'military';
  const showPartnerMatch = userData.partnerIncomeType === 'civilian' || userData.partnerIncomeType === 'military';
  const showAnyMatch = hasAnyMatchOpportunity(userData);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const canContinue = fund
    && debt
    && (!showPrimaryMatch || match)
    && (!showPartnerMatch || partnerMatch);

  const handleContinue = () => {
    const nextUserData = {
      ...userData,
      hasCushion: fund,
      capturingMatch: showPrimaryMatch ? match : 'notApplicable',
      capturingMatchM2: showPartnerMatch ? partnerMatch : 'notApplicable',
      highInterestDebt: debt,
    };
    updateUserData({
      hasCushion: fund,
      capturingMatch: showPrimaryMatch ? match : 'notApplicable',
      capturingMatchM2: showPartnerMatch ? partnerMatch : 'notApplicable',
      highInterestDebt: debt,
    });
    onNext(getNextIncomeScreen(nextUserData));
  };

  return (
    <div style={{
      minHeight: '100dvh',
      padding: '4px 24px 100px',
      background: '#F8F9FA',
      opacity: mounted ? 1 : 0,
      transform: mounted ? 'translateY(0)' : 'translateY(8px)',
      transition: 'opacity 300ms ease, transform 300ms ease',
    }}>
      <button
        onClick={onBack}
        aria-label="Back"
        style={{
          marginTop: 16,
          width: 44,
          height: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          color: 'var(--navy)',
        }}
      >
        <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
          <path d="M9 1L1 9L9 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600, color: 'var(--blue)', margin: '24px 0 4px', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
        Triage
      </p>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: 'var(--navy)', margin: '0 0 8px', lineHeight: 1.2 }}>
        Let&apos;s figure out what matters first.
      </h1>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'var(--gray)', margin: '0 0 24px', lineHeight: 1.5 }}>
        Three quick answers, then we&apos;ll build the numbers around your real priorities.
      </p>

      <div style={{ marginBottom: 22 }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600, color: 'var(--navy)', margin: '0 0 10px' }}>
          Do you have an emergency fund?
        </p>
        <OptionRow options={FUND_OPTIONS} selected={fund} onSelect={setFund} />
      </div>

      {showAnyMatch && (
        <div style={{ marginBottom: 22 }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600, color: 'var(--navy)', margin: '0 0 10px' }}>
            Match check
          </p>
          {showPrimaryMatch && (
            <div style={{ marginBottom: showPartnerMatch ? 14 : 0 }}>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--blue)', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Your match
              </p>
              <OptionRow options={MATCH_OPTIONS} selected={match} onSelect={setMatch} />
            </div>
          )}
          {showPartnerMatch && (
            <div>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--blue)', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Partner&apos;s match
              </p>
              <OptionRow options={MATCH_OPTIONS} selected={partnerMatch} onSelect={setPartnerMatch} />
            </div>
          )}
        </div>
      )}

      <div style={{ marginBottom: 12 }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600, color: 'var(--navy)', margin: '0 0 10px' }}>
          Do you have high-interest debt?
        </p>
        <OptionRow options={DEBT_OPTIONS} selected={debt} onSelect={setDebt} />
      </div>

      <div style={{ background: 'var(--light-gold)', borderRadius: 12, padding: 14, marginTop: 18 }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)', margin: 0, lineHeight: 1.5 }}>
          Next we&apos;ll map income and spending so your plan is built on real numbers, not guesses.
        </p>
      </div>

      {canContinue && (
        <>
          <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, height: 80, background: 'linear-gradient(transparent, #F8F9FA 40%)', pointerEvents: 'none', zIndex: 99 }} />
          <button
            onClick={handleContinue}
            style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 48px)', maxWidth: 382, height: 56, background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: 16, fontFamily: 'DM Sans, sans-serif', fontSize: 18, fontWeight: 600, cursor: 'pointer', zIndex: 100 }}
          >
            Continue
          </button>
        </>
      )}
    </div>
  );
}
