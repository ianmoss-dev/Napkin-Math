import { useEffect, useState } from 'react';

function calcTotalExpenses(userData) {
  const fields = [
    'housing', 'utilities', 'groceries', 'diningOut',
    'carPayment', 'gasAndFuel', 'carInsurance',
    'phone', 'internet', 'healthInsurance', 'outOfPocketMedical',
    'childcare', 'clothing', 'entertainment', 'giving', 'gifts', 'travel',
  ];
  const fixed = fields.reduce((sum, f) => sum + (userData[f] || 0), 0);
  const subTotal = (userData.subscriptions || []).reduce((sum, s) => sum + (s.price || 0), 0);
  const debtMin = (userData.debts || []).reduce((sum, d) => sum + (d.minimum || 0), 0);
  return Math.round(fixed + subTotal + debtMin);
}

export default function TransitionScreen({ userData, updateUserData, onNext }) {
  const [phase, setPhase] = useState(0); // 0=hidden, 1="Okay.", 2="We've got your numbers.", 3="Let's see what your picture looks like."

  useEffect(() => {
    const total = calcTotalExpenses(userData);
    const breathing = (userData.monthlyTakeHome || 0) - total;
    updateUserData({ totalMonthlyExpenses: total, breathingRoom: breathing });
  }, []);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2200),
      setTimeout(() => onNext('monthlyPicture'), 4200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const lines = [
    { text: 'Okay.', size: 52 },
    { text: "We've got your numbers.", size: 28 },
    { text: "Let's see what your picture looks like.", size: 22 },
  ];

  return (
    <div
      onClick={() => onNext('monthlyPicture')}
      style={{
        minHeight: '100dvh', background: 'var(--navy)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '0 32px', cursor: 'pointer',
      }}
    >
      {lines.map((line, i) => (
        <p
          key={i}
          style={{
            fontFamily: i === 0 ? 'Playfair Display, serif' : 'DM Sans, sans-serif',
            fontSize: line.size,
            fontWeight: i === 0 ? 700 : 400,
            color: '#fff',
            margin: i === 0 ? '0 0 24px' : '0 0 16px',
            lineHeight: 1.2,
            opacity: phase > i ? 1 : 0,
            transform: phase > i ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 500ms ease, transform 500ms ease',
          }}
        >
          {line.text}
        </p>
      ))}
    </div>
  );
}
