import { getBasePay as _getBasePay } from '../data/militaryPayTables';
import { getBAS as _getBAS } from '../data/basRates';

export { getBasePay } from '../data/militaryPayTables';
export { getBAH, getMHA, getMHAName } from '../data/bahRates';
export { getBAS } from '../data/basRates';

export function calculateFederalTax(taxableIncome) {
  if (taxableIncome <= 0) return 0;
  const brackets = [
    { max: 11925,  rate: 0.10 },
    { max: 48475,  rate: 0.12 },
    { max: 103350, rate: 0.22 },
    { max: 197300, rate: 0.24 },
    { max: 250525, rate: 0.32 },
    { max: 626350, rate: 0.35 },
    { max: Infinity, rate: 0.37 },
  ];
  let tax = 0, prev = 0;
  for (const bracket of brackets) {
    if (taxableIncome <= prev) break;
    tax += (Math.min(taxableIncome, bracket.max) - prev) * bracket.rate;
    prev = bracket.max;
  }
  return tax;
}

export function federalTaxAdvantage(basePay, bah, bas, specialPays) {
  const std = 15000;
  const a = basePay * 12, b = bah * 12, c = bas * 12, d = specialPays * 12;
  return Math.round(
    (calculateFederalTax(Math.max(0, a + b + c + d - std)) -
      calculateFederalTax(Math.max(0, a + d - std))) / 12
  );
}

export function calculatePension(rank, tis, isBRS) {
  const basePay = _getBasePay(rank, tis);
  const multiplier = isBRS ? 0.02 : 0.025;
  const annual = basePay * 12 * multiplier * tis;
  return {
    monthly: Math.round(annual / 12),
    annual: Math.round(annual),
    swrLow: Math.round(annual / 0.045),
    swrHigh: Math.round(annual / 0.035),
  };
}

export function getDefaultRetirementRank(currentRank) {
  const e = ['E-1','E-2','E-3','E-4','E-5','E-6','E-7','E-8','E-9'];
  const w = ['W-1','W-2','W-3','W-4','W-5'];
  const o = ['O-1','O-2','O-3','O-4','O-5','O-6','O-7','O-8','O-9','O-10'];
  if (e.includes(currentRank)) return e.indexOf(currentRank) >= 6 ? currentRank : 'E-7';
  if (w.includes(currentRank)) return w.indexOf(currentRank) >= 2 ? currentRank : 'W-3';
  if (o.includes(currentRank)) return o.indexOf(currentRank) >= 4 ? currentRank : 'O-5';
  return currentRank;
}

export function conservativeMonthly(good, typical, tough) {
  return Math.round((good * 0.2) + (typical * 0.5) + (tough * 0.3));
}

export function toMonthly(amount, frequency) {
  const map = { weekly: 52 / 12, biweekly: 26 / 12, twiceMonthly: 2, monthly: 1 };
  return Math.round(amount * (map[frequency] ?? 1));
}

export function getBins(monthlyIncome, bands, dollarCap = null) {
  return bands.map(([lo, hi], i) => {
    const isLast = i === bands.length - 1 && hi >= 50;
    const loVal = Math.round(monthlyIncome * lo / 100);

    if (isLast) {
      const capVal = dollarCap ?? Math.round(loVal * 1.75);
      const effectiveLo = Math.min(loVal, capVal);
      return {
        label: `$${effectiveLo.toLocaleString('en-US')} – $${capVal.toLocaleString('en-US')}+/mo`,
        value: Math.round((effectiveLo + capVal) / 2),
      };
    }

    const hiVal = dollarCap
      ? Math.min(Math.round(monthlyIncome * hi / 100), dollarCap)
      : Math.round(monthlyIncome * hi / 100);
    const midVal = Math.round((loVal + hiVal) / 2);
    return {
      label: `$${loVal.toLocaleString('en-US')} – $${hiVal.toLocaleString('en-US')}/mo`,
      value: midVal,
    };
  });
}

const RISK = {
  conservative: { mean: 0.05, std: 0.08 },
  moderate:     { mean: 0.07, std: 0.12 },
  aggressive:   { mean: 0.09, std: 0.15 },
};

export function runSimulation(contribution, years, profile) {
  const { mean, std } = RISK[profile];
  const months = years * 12;
  const results = [];
  for (let t = 0; t < 500; t++) {
    let bal = 0;
    for (let m = 0; m < months; m++) {
      const u1 = Math.random(), u2 = Math.random();
      const r = (mean + std * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)) / 12;
      bal = (bal + contribution) * (1 + r);
    }
    results.push(bal);
  }
  return results.sort((a, b) => a - b);
}

export function monthsToPayoff(balance, rate, payment) {
  const r = rate / 100 / 12;
  if (r === 0) return Math.ceil(balance / payment);
  return Math.ceil(-Math.log(1 - (balance * r) / payment) / Math.log(1 + r));
}
