import { useEffect, useState } from 'react';

function WelcomeScreen({ onNext }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const fade = (delay) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(8px)',
    transition: `opacity 300ms ease ${delay}ms, transform 300ms ease ${delay}ms`,
  });

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      background: 'var(--navy)',
      padding: '40px 24px 48px',
    }}>
      {/* Top */}
      <div>
        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: 13,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          color: 'rgba(255,255,255,0.5)',
          margin: '0 0 12px',
          ...fade(0),
        }}>
          Napkin Math
        </p>
        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 56,
          fontWeight: 700,
          color: '#fff',
          lineHeight: 1.1,
          margin: 0,
          ...fade(100),
        }}>
          Napkin<br />Math
        </h1>
        <div style={{
          width: 48,
          height: 2,
          background: 'var(--gold)',
          marginTop: 16,
          opacity: visible ? 1 : 0,
          transition: `opacity 300ms ease 150ms`,
        }} />
      </div>

      {/* Middle */}
      <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', paddingTop: 40 }}>
        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: 22,
          color: 'rgba(255,255,255,0.85)',
          lineHeight: 1.5,
          margin: 0,
          ...fade(250),
        }}>
          Let&rsquo;s build a picture of your financial life.
        </p>
      </div>

      {/* Bottom */}
      <div style={{ ...fade(400) }}>
        <button
          onClick={() => onNext('knowledge')}
          style={{
            width: '100%',
            height: 56,
            background: '#fff',
            color: 'var(--navy)',
            border: 'none',
            borderRadius: 16,
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 18,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Let&rsquo;s get started
        </button>
        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: 11,
          color: 'rgba(255,255,255,0.5)',
          textAlign: 'center',
          marginTop: 12,
          marginBottom: 0,
        }}>
          All calculations happen on your device. Nothing you enter is stored or shared.
        </p>
        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: 11,
          color: 'rgba(255,255,255,0.35)',
          textAlign: 'center',
          marginTop: 8,
          marginBottom: 0,
        }}>
          Napkin Math provides financial planning tools, not financial advice. Not affiliated with or endorsed by the Department of Defense.
        </p>
      </div>
    </div>
  );
}

export default WelcomeScreen;
