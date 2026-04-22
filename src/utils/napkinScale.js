export const STAGES = [
  {
    id: 'blank',
    name: 'Blank',
    description: 'No picture of your finances yet. Every plan starts here.',
    next: 'Build a $1,000 cushion you don\'t touch.',
  },
  {
    id: 'scribbling',
    name: 'Scribbling',
    description: 'You have some awareness, maybe a savings account — but no real system yet.',
    next: 'Clear your high-interest debt.',
  },
  {
    id: 'sketching',
    name: 'Sketching',
    description: 'High-interest debt is addressed. You\'re building your emergency fund.',
    next: 'Fund your full emergency fund.',
  },
  {
    id: 'drafting',
    name: 'Drafting',
    description: 'Emergency fund in place, employer match captured, retirement on track.',
    next: 'Hit 15% toward retirement and define your big goals.',
  },
  {
    id: 'building',
    name: 'Building',
    description: 'The 80% solution is in place. Goals are funded. You\'re optimizing.',
    next: 'Optimize your tax strategy and keep building.',
  },
  {
    id: 'built',
    name: 'Built',
    description: 'The system runs without you. Tax strategy active. Helping others.',
    next: null,
  },
];

export function calculateNapkinScale(userData) {
  const hasCushion = userData.hasCushion === 'yes';
  const highDebt = (userData.debts || []).some(d => d.rate > 7);
  const hasEmergencyFund = userData.emergencyFundMonths != null;
  const capturingMatch = userData.capturingMatch === 'yes';
  const income = userData.monthlyTakeHome || 0;
  const target15 = income * 0.15;
  const tspPct = userData.tspContributionPct || 0;
  const atRetirement = tspPct >= 15 || (userData.m1BasePay && userData.m1BasePay * 0.15 <= target15);
  const hasGoals = (userData.goals || []).length > 0;
  const rothDone = userData.rothChoice != null;

  if (!hasCushion) return 'blank';
  if (hasCushion && highDebt) return 'scribbling';
  if (hasCushion && !highDebt && !hasEmergencyFund) return 'sketching';
  if (hasEmergencyFund && capturingMatch && !atRetirement) return 'drafting';
  if (hasEmergencyFund && capturingMatch && atRetirement && hasGoals && !rothDone) return 'building';
  if (hasEmergencyFund && capturingMatch && atRetirement && hasGoals && rothDone) return 'built';

  return 'drafting';
}

export function getStage(id) {
  return STAGES.find(s => s.id === id) || STAGES[0];
}
