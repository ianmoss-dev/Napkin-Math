// 2026 DFAS Basic Pay — sourced from military_data.json
import militaryData from './military_data.json';

export function getBasePay(rank, tis) {
  const rankData = militaryData.base_pay[rank];
  if (!rankData) return 0;

  // Sort TIS keys numerically, find highest bracket <= tis
  const tiers = Object.keys(rankData)
    .map(Number)
    .sort((a, b) => a - b);

  let pay = 0;
  for (const tier of tiers) {
    if (tis >= tier) pay = rankData[String(tier)];
    else break;
  }
  return pay;
}
