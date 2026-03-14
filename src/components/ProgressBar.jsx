function ProgressBar({ current, total }) {
  const pct = total > 0 ? Math.min(100, (current / total) * 100) : 0;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: 4,
      background: 'var(--light-gray)',
      zIndex: 1000,
    }}>
      <div style={{
        height: '100%',
        width: `${pct}%`,
        background: 'var(--navy)',
        transition: 'width 300ms ease',
      }} />
    </div>
  );
}

export default ProgressBar;
