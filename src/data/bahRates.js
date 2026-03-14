// 2026 BAH rates — sourced from military_data.json
// Full ZIP → MHA → rank lookup. No approximations.
import militaryData from './military_data.json';

// O-8, O-9, O-10 are not in the BAH table — they use O-7 rates (BAH caps at O-7)
function normalizeRank(rank) {
  if (['O-8', 'O-9', 'O-10'].includes(rank)) return 'O-7';
  return rank;
}

export function getMHA(zip) {
  const entry = militaryData.zip_to_mha[zip];
  return entry ? entry.mha : null;
}

export function getMHAName(zip) {
  const entry = militaryData.zip_to_mha[zip];
  return entry ? entry.name : null;
}

export function getBAH(rank, hasDependents, zip) {
  if (!zip || zip.length !== 5) return 0;

  const mha = getMHA(zip);
  if (!mha) return 0;

  const mhaRates = militaryData.bah_rates[mha];
  if (!mhaRates) return 0;

  const bahRank = normalizeRank(rank);
  const rankRates = mhaRates[bahRank];
  if (!rankRates) return 0;

  return hasDependents ? rankRates.with : rankRates.without;
}
