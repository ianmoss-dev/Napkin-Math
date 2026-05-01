const REGULAR_TYPES = new Set(['civilian', 'military']);
const TRIAGE_GATE_TO_SCREEN = {
  emergencyFund: 'step4EmergencyFund',
  employerMatch: 'step2Match',
  highInterestDebt: 'step3Debt',
  saveForRetirement: 'step6Retirement',
  saveMoreRetirement: 'step8Optimize',
  otherGoalsAdvanced: 'step7Goals',
};

export function hasHighInterestDebt(userData) {
  return (userData.debts || []).some((debt) => debt.rate > 7);
}

export function hasHighInterestDebtSignal(userData) {
  return hasHighInterestDebt(userData) || userData.highInterestDebt === 'yes' || userData.highInterestDebt === 'unsure';
}

export function hasAnyMatchOpportunity(userData) {
  return REGULAR_TYPES.has(userData.incomeType) || REGULAR_TYPES.has(userData.partnerIncomeType);
}

export function isFullMatchCaptured(userData) {
  if (!hasAnyMatchOpportunity(userData)) {
    return true;
  }

  const checks = [];

  if (REGULAR_TYPES.has(userData.incomeType)) {
    checks.push(userData.capturingMatch === 'yes');
  }

  if (REGULAR_TYPES.has(userData.partnerIncomeType)) {
    checks.push(userData.capturingMatchM2 === 'yes');
  }

  return checks.every(Boolean);
}

export function getPriorityPlanScreen(userData) {
  if (userData.triageGate && TRIAGE_GATE_TO_SCREEN[userData.triageGate]) {
    return TRIAGE_GATE_TO_SCREEN[userData.triageGate];
  }

  if (userData.hasCushion !== 'yes') {
    return 'step1Cushion';
  }

  if (!isFullMatchCaptured(userData)) {
    return 'step2Match';
  }

  if (hasHighInterestDebtSignal(userData)) {
    return 'step3Debt';
  }

  return 'step4EmergencyFund';
}

export function getNextStepAfterCushion(userData) {
  if (!isFullMatchCaptured(userData)) {
    return 'step2Match';
  }

  return hasHighInterestDebtSignal(userData) ? 'step3Debt' : 'step4EmergencyFund';
}

export function getNextStepAfterMatch(userData) {
  return hasHighInterestDebtSignal(userData) ? 'step3Debt' : 'step4EmergencyFund';
}

function needsPrimaryMilitaryPay(userData) {
  return userData.incomeType === 'military' && !(userData.m1Rank && userData.m1TIS);
}

function needsPartnerMilitaryPay(userData) {
  return userData.partnerIncomeType === 'military' && !(userData.m2Rank && userData.m2TIS);
}

function needsPension(userData) {
  return userData.incomeType === 'military' && !userData.retirementIntent;
}

function hasAnyRegularIncome(userData) {
  return REGULAR_TYPES.has(userData.incomeType) || REGULAR_TYPES.has(userData.partnerIncomeType);
}

function hasPendingRegularIncome(userData) {
  const m1Pending = REGULAR_TYPES.has(userData.incomeType) && !(userData.m1TakeHome > 0);
  const m2Pending = REGULAR_TYPES.has(userData.partnerIncomeType) && !(userData.m2TakeHome > 0);
  return m1Pending || m2Pending;
}

function hasAnyVariableIncome(userData) {
  return userData.incomeType === 'selfEmployed' || userData.partnerIncomeType === 'selfEmployed';
}

function hasPendingVariableIncome(userData) {
  const m1Pending = userData.incomeType === 'selfEmployed'
    && !(userData.goodMonth > 0 && userData.typicalMonth > 0 && userData.toughMonth > 0);
  const m2Pending = userData.partnerIncomeType === 'selfEmployed'
    && !(userData.p2GoodMonth > 0 && userData.p2TypicalMonth > 0 && userData.p2ToughMonth > 0);

  return m1Pending || m2Pending;
}

export function getNextIncomeScreen(userData) {
  if (needsPrimaryMilitaryPay(userData)) {
    return 'payReconstruction1';
  }

  if (needsPartnerMilitaryPay(userData)) {
    return 'payReconstruction2';
  }

  if (needsPension(userData)) {
    return 'pension';
  }

  if (hasAnyRegularIncome(userData) && hasPendingRegularIncome(userData)) {
    return 'lesConfirmation';
  }

  if (hasAnyVariableIncome(userData) && hasPendingVariableIncome(userData)) {
    return 'irregularIncome';
  }

  return 'budgetHousing';
}

export function getTriagePlanScreen(triageGate) {
  return TRIAGE_GATE_TO_SCREEN[triageGate] || 'step4EmergencyFund';
}
