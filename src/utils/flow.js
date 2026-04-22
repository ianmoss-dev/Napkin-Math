const REGULAR_TYPES = new Set(['civilian', 'military']);

export function hasHighInterestDebt(userData) {
  return (userData.debts || []).some((debt) => debt.rate > 7);
}

export function hasAnyMatchOpportunity(userData) {
  return REGULAR_TYPES.has(userData.incomeType) || REGULAR_TYPES.has(userData.partnerIncomeType);
}

export function getNextStepAfterCushion(userData) {
  if (hasAnyMatchOpportunity(userData)) {
    return 'step2Match';
  }

  return hasHighInterestDebt(userData) ? 'step3Debt' : 'step4EmergencyFund';
}

export function getNextStepAfterMatch(userData) {
  return hasHighInterestDebt(userData) ? 'step3Debt' : 'step4EmergencyFund';
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
