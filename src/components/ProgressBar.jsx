export default function ProgressBar({ pct = 0 }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      height: 4,
      background: 'var(--light-gray)',
      zIndex: 1000,
    }}>
      <div style={{
        height: '100%',
        width: `${Math.min(100, pct)}%`,
        background: 'var(--navy)',
        transition: 'width 300ms ease',
      }} />
    </div>
  );
}
