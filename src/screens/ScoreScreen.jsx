import { useEffect, useState } from 'react';
import { calculateNapkinScale, getStage, STAGES } from '../utils/napkinScale';
import { formatCurrency } from '../utils/formatters';

const STAGE_COLORS = {
  blank:      { bg: '#E8E8E8', text: '#595959', accent: '#595959' },
  scribbling: { bg: 'var(--light-red)',   text: 'var(--red)',   accent: 'var(--red)' },
  sketching:  { bg: 'var(--light-gold)',  text: '#8B6914',      accent: 'var(--gold)' },
  drafting:   { bg: 'var(--light-blue)',  text: 'var(--blue)',  accent: 'var(--blue)' },
  building:   { bg: 'var(--light-blue)',  text: 'var(--navy)',  accent: 'var(--navy)' },
  built:      { bg: 'var(--light-green)', text: 'var(--green)', accent: 'var(--green)' },
};

export default function ScoreScreen({ userData, updateUserData, onNext, onBack, onStartFresh }) {
  const [mounted, setMounted] = useState(false);
  const scaleId = calculateNapkinScale(userData);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (userData.napkinScale !== scaleId) {
      updateUserData({ napkinScale: scaleId });
    }
  }, [scaleId, updateUserData, userData.napkinScale]);

  const stage = getStage(scaleId);
  const colors = STAGE_COLORS[scaleId] || STAGE_COLORS.blank;
  const stageIndex = STAGES.findIndex(s => s.id === scaleId);
  const nextStage = stageIndex < STAGES.length - 1 ? STAGES[stageIndex + 1] : null;

  const income = userData.monthlyTakeHome || 0;
  const expenses = userData.totalMonthlyExpenses || 0;
  const breathing = userData.breathingRoom || 0;

  return (
    <div style={{
      minHeight: '100dvh', padding: '4px 24px 100px', background: '#F8F9FA',
      opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(8px)',
      transition: 'opacity 400ms ease, transform 400ms ease',
    }}>
      <button onClick={onBack} aria-label="Back" style={{ marginTop: 16, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--navy)' }}>
        <svg width="10" height="18" viewBox="0 0 10 18" fill="none"><path d="M9 1L1 9L9 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>

      <button
        onClick={onStartFresh}
        style={{ marginTop: 12, background: 'transparent', border: 'none', padding: 0, color: 'var(--blue)', fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
      >
        Start over
      </button>

      {/* Stage card */}
      <div style={{ background: colors.bg, borderRadius: 24, padding: '32px 24px', margin: '24px 0 0', textAlign: 'center' }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600, color: colors.accent, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
          Your Napkin Scale
        </p>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 56, fontWeight: 700, color: colors.text, margin: '0 0 16px', lineHeight: 1 }}>
          {stage.name}
        </h1>
        <div style={{ width: 48, height: 2, background: colors.accent, margin: '0 auto 20px' }} />
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: colors.text, margin: 0, lineHeight: 1.6, opacity: 0.85 }}>
          {stage.description}
        </p>
      </div>

      {/* Numbers snapshot */}
      <div style={{ background: '#fff', borderRadius: 16, padding: 20, margin: '16px 0 0', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600, color: 'var(--blue)', margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Your numbers</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)' }}>Monthly income</span>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600, color: 'var(--navy)' }}>{formatCurrency(income)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)' }}>Monthly expenses</span>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600, color: 'var(--navy)' }}>{formatCurrency(expenses)}</span>
        </div>
        <div style={{ height: 1, background: '#F0F0F0', margin: '4px 0 10px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--gray)' }}>Breathing room</span>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 700, color: breathing >= 0 ? 'var(--green)' : 'var(--red)' }}>{formatCurrency(breathing)}/mo</span>
        </div>
      </div>

      {/* Next stage preview */}
      {nextStage && stage.next && (
        <div style={{ background: 'var(--navy)', borderRadius: 16, padding: 20, margin: '16px 0 0' }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Next: {nextStage.name}
          </p>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: '#fff', margin: 0, lineHeight: 1.5 }}>
            {stage.next}
          </p>
        </div>
      )}

      {scaleId === 'built' && (
        <div style={{ background: 'var(--light-green)', borderRadius: 16, padding: 20, margin: '16px 0 0' }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'var(--green)', margin: 0, fontWeight: 600, lineHeight: 1.5 }}>
            The system runs without you. Now help someone else get here.
          </p>
        </div>
      )}

      <button
        onClick={() => onNext('retirementCalc')}
        style={{ width: '100%', height: 48, borderRadius: 14, border: '2px solid var(--navy)', background: '#fff', color: 'var(--navy)', fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 600, cursor: 'pointer', margin: '20px 0 0' }}
      >
        Open retirement calculator
      </button>

      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, height: 80, background: 'linear-gradient(transparent, #F8F9FA 40%)', pointerEvents: 'none', zIndex: 99 }} />
      <button onClick={() => onNext('pdfScreen')} style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 48px)', maxWidth: 382, height: 56, background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: 16, fontFamily: 'DM Sans, sans-serif', fontSize: 18, fontWeight: 600, cursor: 'pointer', zIndex: 100 }}>
        Get my plan
      </button>
    </div>
  );
}
