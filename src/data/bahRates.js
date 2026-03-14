// Simplified national-average BAH rates by rank tier (2025, monthly)
// V2: Replace with full ZIP code lookup per DFAS BAH tables at travel.dod.mil
// Rates are approximate mid-tier MHA averages — actual rates vary significantly by duty station

function getRankTier(rank) {
  if (['E-1','E-2','E-3'].includes(rank)) return 'E1-3';
  if (['E-4','E-5','E-6'].includes(rank)) return 'E4-6';
  if (['E-7','E-8','E-9'].includes(rank)) return 'E7-9';
  if (['W-1','W-2','W-3'].includes(rank)) return 'W1-3';
  if (['W-4','W-5'].includes(rank))        return 'W4-5';
  if (['O-1','O-2','O-3'].includes(rank)) return 'O1-3';
  if (['O-4','O-5','O-6'].includes(rank)) return 'O4-6';
  if (['O-7','O-8','O-9','O-10'].includes(rank)) return 'O7+';
  return 'E4-6';
}

const BAH_RATES = {
  'E1-3': { withDep: 1450, withoutDep: 1180 },
  'E4-6': { withDep: 1640, withoutDep: 1340 },
  'E7-9': { withDep: 1880, withoutDep: 1550 },
  'W1-3': { withDep: 1980, withoutDep: 1640 },
  'W4-5': { withDep: 2180, withoutDep: 1820 },
  'O1-3': { withDep: 1950, withoutDep: 1620 },
  'O4-6': { withDep: 2300, withoutDep: 1950 },
  'O7+':  { withDep: 2700, withoutDep: 2300 },
};

export function getBAH(rank, hasDependents) {
  const tier = getRankTier(rank);
  const rates = BAH_RATES[tier];
  return hasDependents ? rates.withDep : rates.withoutDep;
}
