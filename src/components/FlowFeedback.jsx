function getFeedback(screen, pct) {
  if (screen === 'triage') {
    return "Nice. We're setting the order before we get into the numbers.";
  }

  if (screen.startsWith('payReconstruction') || screen === 'pension' || screen === 'lesConfirmation' || screen === 'irregularIncome') {
    return "Good. You're locking in the income side first.";
  }

  if (screen.startsWith('budget')) {
    if (pct < 45) return "Good pace. You're mapping the biggest spending buckets.";
    if (pct < 70) return "Nice. The plan is getting sharper with every category.";
    return "You're close. We have almost the full monthly picture.";
  }

  if (screen === 'monthlyPicture') {
    return "You made it to the full picture. Now we can prioritize the plan.";
  }

  return null;
}

export default function FlowFeedback({ currentScreen, pct }) {
  const message = getFeedback(currentScreen, pct);

  if (!message) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 14,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 120,
      width: 'calc(100% - 40px)',
      maxWidth: 360,
      pointerEvents: 'none',
    }}>
      <div style={{
        background: 'rgba(27,58,107,0.92)',
        color: '#fff',
        borderRadius: 999,
        padding: '10px 14px',
        boxShadow: '0 10px 24px rgba(0,0,0,0.16)',
        textAlign: 'center',
      }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, margin: 0, lineHeight: 1.35 }}>
          {message}
        </p>
      </div>
    </div>
  );
}
