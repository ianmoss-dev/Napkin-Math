const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const CODE_LENGTH = 8;

function compress(obj) {
  try {
    return btoa(JSON.stringify(obj));
  } catch {
    return null;
  }
}

function decompress(str) {
  try {
    return JSON.parse(atob(str));
  } catch {
    return null;
  }
}

function b64ToCode(b64) {
  let code = '';
  for (let i = 0; i < CODE_LENGTH; i++) {
    const byte = b64.charCodeAt(i % b64.length);
    code += ALPHABET[byte % ALPHABET.length];
  }
  return code.match(/.{1,4}/g).join('-');
}

export function generateSaveCode(userData) {
  const slim = {
    v: 1,
    ht: userData.householdType,
    pit: userData.partnerIncomeType,
    it: userData.incomeType,
    idm: userData.isDualMilitary,
    m1r: userData.m1Rank, m1t: userData.m1TIS, m1z: userData.m1ZIP,
    m1d: userData.m1Dependents, m1oco: userData.m1IsOCONUS,
    m1bp: userData.m1BasePay, m1bah: userData.m1BAH, m1bas: userData.m1BAS,
    m1th: userData.m1TakeHome, m1mm: userData.m1MidMonth, m1em: userData.m1EndOfMonth,
    m2r: userData.m2Rank, m2t: userData.m2TIS, m2z: userData.m2ZIP,
    m2d: userData.m2Dependents, m2oco: userData.m2IsOCONUS,
    m2bp: userData.m2BasePay, m2bah: userData.m2BAH, m2bas: userData.m2BAS,
    m2th: userData.m2TakeHome, m2mm: userData.m2MidMonth, m2em: userData.m2EndOfMonth,
    ri: userData.retirementIntent, rr: userData.retirementRank, rt: userData.retirementTIS,
    mth: userData.monthlyTakeHome,
    ai: userData.additionalIncome,
    gm: userData.goodMonth, tm: userData.typicalMonth, tum: userData.toughMonth,
    ho: userData.housing, ut: userData.utilities, gr: userData.groceries, he: userData.householdEssentials,
    do: userData.diningOut, cp: userData.carPayment, gf: userData.gasAndFuel,
    ci: userData.carInsurance, ph: userData.phone, in: userData.internet,
    hm: userData.homeMaintenance, hi: userData.healthInsurance, md: userData.outOfPocketMedical,
    hsa: userData.hasHSA, su: userData.subscriptions, hk: userData.hasKids, ch: userData.childcare, ke: userData.kidExpenses,
    db: userData.debts, cl: userData.clothing, pc: userData.personalCare, en: userData.entertainment, pt: userData.pets,
    gi: userData.giving, tme: userData.totalMonthlyExpenses,
    br: userData.breathingRoom, ns: userData.napkinScale,
    hc: userData.hasCushion, cm: userData.capturingMatch,
    tsp: userData.tspContributionPct, ef: userData.emergencyFundMonths,
    gl: userData.goals,
  };

  const b64 = compress(slim);
  if (!b64) return null;
  return b64ToCode(b64) + '|' + b64;
}

export function decodeSaveCode(raw) {
  try {
    const cleaned = raw.trim().toUpperCase().replace(/\s/g, '');
    const pipeIdx = cleaned.indexOf('|');
    if (pipeIdx === -1) return null;
    const b64 = raw.trim().slice(pipeIdx + 1);
    const slim = decompress(b64);
    if (!slim || slim.v !== 1) return null;

    return {
      householdType: slim.ht ?? null,
      partnerIncomeType: slim.pit ?? null,
      incomeType: slim.it ?? null,
      isDualMilitary: slim.idm ?? false,
      m1Rank: slim.m1r ?? null, m1TIS: slim.m1t ?? null, m1ZIP: slim.m1z ?? null,
      m1Dependents: slim.m1d ?? false, m1IsOCONUS: slim.m1oco ?? false,
      m1BasePay: slim.m1bp ?? 0, m1BAH: slim.m1bah ?? 0, m1BAS: slim.m1bas ?? 0,
      m1TakeHome: slim.m1th ?? 0, m1MidMonth: slim.m1mm ?? 0, m1EndOfMonth: slim.m1em ?? 0,
      m2Rank: slim.m2r ?? null, m2TIS: slim.m2t ?? null, m2ZIP: slim.m2z ?? null,
      m2Dependents: slim.m2d ?? false, m2IsOCONUS: slim.m2oco ?? false,
      m2BasePay: slim.m2bp ?? 0, m2BAH: slim.m2bah ?? 0, m2BAS: slim.m2bas ?? 0,
      m2TakeHome: slim.m2th ?? 0, m2MidMonth: slim.m2mm ?? 0, m2EndOfMonth: slim.m2em ?? 0,
      retirementIntent: slim.ri ?? null, retirementRank: slim.rr ?? null, retirementTIS: slim.rt ?? 20,
      monthlyTakeHome: slim.mth ?? 0,
      additionalIncome: slim.ai ?? [],
      goodMonth: slim.gm ?? 0, typicalMonth: slim.tm ?? 0, toughMonth: slim.tum ?? 0,
      housing: slim.ho ?? null, utilities: slim.ut ?? null, groceries: slim.gr ?? null, householdEssentials: slim.he ?? null,
      diningOut: slim.do ?? null, carPayment: slim.cp ?? null, gasAndFuel: slim.gf ?? null,
      carInsurance: slim.ci ?? null, phone: slim.ph ?? null, internet: slim.in ?? null, homeMaintenance: slim.hm ?? null,
      healthInsurance: slim.hi ?? null, outOfPocketMedical: slim.md ?? null,
      hasHSA: slim.hsa ?? null, subscriptions: slim.su ?? [], hasKids: slim.hk ?? null, childcare: slim.ch ?? null, kidExpenses: slim.ke ?? null,
      debts: slim.db ?? [], clothing: slim.cl ?? null, personalCare: slim.pc ?? null, entertainment: slim.en ?? null, pets: slim.pt ?? null,
      giving: slim.gi ?? null, totalMonthlyExpenses: slim.tme ?? 0,
      breathingRoom: slim.br ?? 0, napkinScale: slim.ns ?? null,
      hasCushion: slim.hc ?? null, capturingMatch: slim.cm ?? null,
      tspContributionPct: slim.tsp ?? 0, emergencyFundMonths: slim.ef ?? null,
      goals: slim.gl ?? [],
    };
  } catch {
    return null;
  }
}
