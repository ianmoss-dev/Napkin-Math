import { useEffect, useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PDFDocument from '../components/PDFDocument';
import { getStage } from '../utils/napkinScale';
import { formatCurrency } from '../utils/formatters';

export default function PDFScreen({ userData, onBack, onStartFresh, saveCode }) {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t); }, []);

  const stage = getStage(userData.napkinScale || 'blank');
  const breathing = userData.breathingRoom || 0;
  const income = userData.monthlyTakeHome || 0;

  const shareText = `Napkin Math — ${stage.name}\n${formatCurrency(income)}/mo in · ${formatCurrency(userData.totalMonthlyExpenses || 0)}/mo out · ${formatCurrency(breathing)}/mo breathing room\nnapkinmath.app`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleCopyCode = () => {
    if (!saveCode) return;
    navigator.clipboard.writeText(saveCode).then(() => {
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    });
  };

  const filename = `napkin-math-plan-${new Date().toISOString().slice(0, 10)}.pdf`;

  return (
    <div style={{
      minHeight: '100dvh', padding: '4px 24px 40px', background: '#F8F9FA',
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

      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: 'var(--navy)', margin: '24px 0 8px' }}>
        Your Plan
      </h1>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'var(--gray)', margin: '0 0 32px', lineHeight: 1.5 }}>
        Four pages. Your numbers. What to do next.
      </p>

      {/* Share card */}
      <div style={{ background: 'var(--navy)', borderRadius: 20, padding: 24, marginBottom: 16 }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.5)', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
          Napkin Scale
        </p>
        <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 40, fontWeight: 700, color: '#fff', margin: '0 0 20px', lineHeight: 1 }}>
          {stage.name}
        </p>
        <div style={{ display: 'flex', gap: 16 }}>
          {[
            { label: 'Monthly in', value: formatCurrency(income) },
            { label: 'Monthly out', value: formatCurrency(userData.totalMonthlyExpenses || 0) },
            { label: 'Breathing room', value: formatCurrency(Math.abs(breathing)), color: breathing >= 0 ? '#4CAF50' : '#EF5350' },
          ].map(s => (
            <div key={s.label} style={{ flex: 1 }}>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.5)', margin: '0 0 2px' }}>{s.label}</p>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 700, color: s.color || '#fff', margin: 0 }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Copy share text */}
      <button
        onClick={handleCopy}
        style={{ width: '100%', height: 52, borderRadius: 14, border: '2px solid var(--navy)', background: '#fff', color: 'var(--navy)', fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 600, cursor: 'pointer', marginBottom: 12, transition: 'all 150ms' }}
      >
        {copied ? '✓ Copied to clipboard' : 'Copy share card'}
      </button>

      {/* Save code */}
      {saveCode && (
        <div style={{ background: 'var(--light-gold)', borderRadius: 16, padding: '16px 20px', marginBottom: 12 }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7A6020', margin: '0 0 6px' }}>
            Save Code
          </p>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#595959', margin: '0 0 12px', lineHeight: 1.5 }}>
            Paste this code on your next visit to restore your plan on any device.
          </p>
          <div style={{ fontFamily: 'monospace', fontSize: 13, wordBreak: 'break-all', color: 'var(--navy)', background: '#fff', borderRadius: 10, padding: '10px 14px', marginBottom: 10 }}>
            {saveCode.split('|')[0]}
          </div>
          <button
            onClick={handleCopyCode}
            style={{ width: '100%', height: 44, borderRadius: 12, border: '1.5px solid #C9A84C', background: '#fff', color: '#7A6020', fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
          >
            {codeCopied ? '✓ Code copied' : 'Copy full save code'}
          </button>
        </div>
      )}

      {/* PDF download */}
      <PDFDownloadLink
        document={<PDFDocument userData={userData} />}
        fileName={filename}
        style={{ display: 'block', textDecoration: 'none' }}
      >
        {({ loading }) => (
          <button
            style={{ width: '100%', height: 56, borderRadius: 16, border: 'none', background: loading ? '#ccc' : 'var(--navy)', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: 18, fontWeight: 600, cursor: loading ? 'default' : 'pointer', transition: 'background 150ms' }}
          >
            {loading ? 'Building your plan...' : 'Download my plan'}
          </button>
        )}
      </PDFDownloadLink>

      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--gray)', textAlign: 'center', margin: '16px 0 0', lineHeight: 1.6 }}>
        Your plan is built on your device. Nothing you entered was sent anywhere.
      </p>
    </div>
  );
}
