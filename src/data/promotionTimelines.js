// Standard promotion timelines (years of service)
// Based on typical promotion points with +1 year standard lag per CLAUDE.md

export const PROMOTION_TIMELINES = {
  enlisted: [
    { to: 'E-4', atYear: 2 },
    { to: 'E-5', atYear: 4 },
    { to: 'E-6', atYear: 8 },
    { to: 'E-7', atYear: 13 },
    { to: 'E-8', atYear: 17 },
  ],
  warrant: [
    { to: 'W-2', atYear: 2 },
    { to: 'W-3', atYear: 5 },
    { to: 'W-4', atYear: 8 },
    { to: 'W-5', atYear: 12 },
  ],
  officer: [
    { to: 'O-2', atYear: 2 },
    { to: 'O-3', atYear: 4 },
    { to: 'O-4', atYear: 10 },
    { to: 'O-5', atYear: 16 },
    { to: 'O-6', atYear: 22 },
  ],
};

export function getPromotionTimeline(rank) {
  if (rank.startsWith('E')) return PROMOTION_TIMELINES.enlisted;
  if (rank.startsWith('W')) return PROMOTION_TIMELINES.warrant;
  if (rank.startsWith('O')) return PROMOTION_TIMELINES.officer;
  return [];
}
