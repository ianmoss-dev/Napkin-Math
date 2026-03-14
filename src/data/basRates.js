// 2025 DFAS Basic Allowance for Subsistence (monthly)
// Enlisted: $460.20 | Officer (including Warrant): $319.71
// Source: dfas.mil/militarymembers/payentitlements/bas/

const OFFICER_RANKS = [
  'W-1','W-2','W-3','W-4','W-5',
  'O-1','O-2','O-3','O-4','O-5','O-6','O-7','O-8','O-9','O-10',
];

export function getBAS(rank) {
  return OFFICER_RANKS.includes(rank) ? 320 : 460;
}
