# Napkin Math — Claude Code Context
# Version 3.0 — March 2026

## What We Are Building

Napkin Math is a mobile-first financial planning app for US military service members (V1).
It walks users through their complete financial picture one screen at a time and produces a personalized PDF plan.

This is F.I.R.E. for Effect rebuilt with a better interface.
All military financial logic from app__19__.py needs to be ported to JavaScript.

Fortress (github.com/ianmoss-dev/fortress) is a separate product. Do not conflate. No action during Napkin Math build.

---

## Golden Rules

1. One screen at a time. Every screen is its own component in src/screens/. Never build multiple screens in one task.
2. Mobile first always. Max-width 430px, centered. Minimum 56px touch targets.
3. Plain language only. No financial jargon.
4. Non-judgmental tone always. Never shame spending.
5. Conservative assumptions. State them plainly. Never overstate outcomes.
6. Run npm run build after every screen to confirm clean compilation.
7. Commit after every screen with a descriptive message.
8. No Ramit Sethi references in user-facing copy. No r/personalfinance references in user-facing copy.
9. Monthly and annual always shown side by side wherever money amounts appear.

---

## Design System

### CSS Variables (add to index.css)

:root {
  --navy: #1B3A6B;
  --blue: #2E75B6;
  --gold: #C9A84C;
  --light-blue: #D5E8F0;
  --light-gold: #FEF9EE;
  --gray: #595959;
  --light-gray: #F2F2F2;
  --white: #FFFFFF;
  --green: #2E7D32;
  --light-green: #E8F5E9;
  --red: #C62828;
  --light-red: #FFEBEE;
}

### Typography

Display/headings: Playfair Display, serif
Body/UI: DM Sans, sans-serif
Import both from Google Fonts in index.html

### Layout

Max width: 430px, centered with margin: 0 auto
Full viewport: min-height: 100dvh
Horizontal padding: 24px on all screens
Bottom padding: 80px on all screens (clearance for sticky button)
Safe area: padding-bottom: env(safe-area-inset-bottom)

### Buttons

Primary: navy bg, white text, border-radius 16px, height 56px, full width, DM Sans 18px weight 600, no border, no shadow
Secondary: white bg, navy border 2px, navy text, same dimensions
Sticky bottom button: position fixed, bottom 24px, width calc(100% - 48px), max-width 382px
Gradient fade behind sticky button: linear-gradient(transparent, #F8F9FA 40%) 80px tall

### Inputs

Height: 56px, border: 2px solid #E0E0E0, border-radius: 12px
Font: DM Sans 18px, focus: border 2px solid var(--navy), padding: 0 16px
inputMode="decimal" on all currency inputs
No $0 placeholders. Leave empty, mark required.

### Selectable Cards

White bg, border-radius 16px
Unselected: border 2px solid transparent, box-shadow 0 2px 12px rgba(0,0,0,0.06)
Selected: border 2px solid var(--navy), background var(--light-blue)
Padding: 20px, transition: border-color 150ms, background 150ms
Label: DM Sans 12px weight 600 letter-spacing 0.12em uppercase var(--blue)
Body: DM Sans 17px weight 400 var(--gray) line-height 1.5 padding-right 32px

### Info Button

Position: absolute top 16px right 16px on cards
Size: 24x24px, border-radius 50%, border: 1.5px solid var(--blue)
Color: var(--blue), background: transparent, font: DM Sans 13px italic
On tap: toggles info text, e.stopPropagation()
Info text: DM Sans 14px gray italic, margin-top 10px, padding-top 10px, border-top 1px solid var(--light-gray), fade 200ms

### Progress Bar

4px tall, full width, flush at very top of screen
var(--navy) fill, var(--light-gray) background, no border-radius, animated 300ms

### Screen Transitions

On mount: opacity 0 to 1, translateY 8px to 0, 300ms ease-out

---

## Approved Copy

"Your bank account tells part of the story. Let's hear the rest."
-- Screen 6 subheading

"Your employer set aside money each month for you. If you don't meet the match, you're handing it back."
-- Step 2 TSP match

"We assumed the worst -- 24.99% -- so your plan is built on solid ground, not wishful thinking."
-- Unknown debt interest rate

"Based on what you told us, you're spending about $[X] a month eating and drinking out. This is the most common place people are surprised by their own spending -- not because they're being irresponsible, but because $14 here and $8 there just doesn't feel like $[X]. Now you know."
-- Dining out reveal

"This is an estimate of how much you would need to have saved and invested to replicate this pension's monthly income on your own. Based on a 3.5%-4.5% withdrawal rate."
-- Pension SWR explanation

"Each year you stay adds $[X]-$[Y] to that total permanently. Each year you leave early, that value is gone."
-- Pension cliff value

"Take a second to double-check that number -- it's the foundation of everything that follows."
-- Income sanity check

"My income is stable and I have strong job security"
-- Emergency fund 3 months label

"My income varies or my situation could change"
-- Emergency fund 6 months label

"Automation is lower maintenance. Tracking gives you more visibility. Pick the one you'll actually stick with."
-- Below spending philosophy cards

"These aren't included in your RMC -- but a civilian pays for all of them out of their paycheck."
-- Additional benefits intro

"We'll come back to this. When we get to your goals, we'll show you exactly what compensation package you'd need on the outside to truly come out ahead."
-- Separation flag

"Irregular income makes budgeting harder than most advice accounts for. We're going to build your plan around what you can reliably count on -- not your best month."
-- Screen 8B subheading

REJECTED -- never use these:
- "without touching the principal"
- "Safe Withdrawal Rate"
- "actuarial present value"
- "I want to sleep well at night"
- "Most service members are surprised"

---

## Self-Assessment Cards (exact copy)

Card 1 -- GETTING STARTED
Body: "Others are doing financially well. I am here."
Info: "I need a budget, a debt reduction plan, a savings plan -- the whole thing."
Value: beginner

Card 2 -- FINDING MY FOOTING
Body: "I have a money. But I would like more to occur, also."
Info: "I need to refine my savings plan and be sure I'm hitting my goals."
Value: intermediate

Card 3 -- READY TO OPTIMIZE
Body: "I'm doing great. I think."
Info: "I want to optimize my savings and pursue additional wealth building avenues -- and get a common sense check."
Value: advanced

---

## App State Model

const [userData, setUserData] = useState({
  // Intake
  knowledgeLevel: null,
  householdType: null,          // solo | partner
  partnerIncomeType: null,       // civilian | military | selfEmployed | none
  incomeType: null,              // civilian | military | selfEmployed
  isDualMilitary: false,         // auto-calculated, never shown to user
  spendingPhilosophy: null,      // automator | tracker

  // Member 1 Military Pay
  m1Rank: null, m1TIS: null, m1ZIP: null, m1Dependents: false,
  m1IsOCONUS: false, m1OHARental: 0, m1OHAUtility: 0, m1COLA: 0,
  m1BasePay: 0, m1BAH: 0, m1BAS: 0, m1TaxAdvantage: 0,
  m1RMC: 0, m1RMCAnnual: 0, m1MidMonth: 0, m1EndOfMonth: 0, m1TakeHome: 0,
  m1SpecialPays: { staticLine: false, halo: false, aviation: false, dive: false, demo: false, hostileFire: false, flpb: 0, custom: [] },

  // Member 2 Military Pay (dual only)
  m2Rank: null, m2TIS: null, m2ZIP: null, m2Dependents: false,
  m2IsOCONUS: false, m2OHARental: 0, m2OHAUtility: 0, m2COLA: 0,
  m2BasePay: 0, m2BAH: 0, m2BAS: 0, m2TaxAdvantage: 0,
  m2RMC: 0, m2RMCAnnual: 0, m2MidMonth: 0, m2EndOfMonth: 0, m2TakeHome: 0,
  m2SpecialPays: { staticLine: false, halo: false, aviation: false, dive: false, demo: false, hostileFire: false, flpb: 0, custom: [] },

  // Pension
  retirementIntent: null,        // yes | unsure | no
  retirementRank: null, retirementTIS: 20,
  monthlyPension: 0, annualPension: 0, pensionSWRLow: 0, pensionSWRHigh: 0,

  // Income (all paths converge here)
  monthlyTakeHome: 0,
  additionalIncome: [],
  goodMonth: 0, typicalMonth: 0, toughMonth: 0,
  p2GoodMonth: 0, p2TypicalMonth: 0, p2ToughMonth: 0,

  // Budget
  housing: null, utilities: null, groceries: null, diningOut: null,
  carPayment: null, gasAndFuel: null, carInsurance: null, phone: null,
  internet: null, healthInsurance: null, outOfPocketMedical: null,
  hasHSA: null, subscriptions: [], childcare: null,
  debts: [],
  clothing: null, entertainment: null, giving: null,

  // Computed
  totalMonthlyExpenses: 0, breathingRoom: 0, napkinScale: null,

  // Step answers
  hasCushion: null, capturingMatch: null, tspContributionPct: 0,
  emergencyFundMonths: null, goals: [],
});

---

## Screen List

const screens = [
  'welcome', 'knowledge', 'household',
  'partnerIncome',       // skip if solo
  'incomeType', 'spendingPhilosophy',
  'payReconstruction1',  // skip if not military
  'payReconstruction2',  // skip if not dual military
  'pension',             // skip if not military
  'lesConfirmation',     // skip if selfEmployed
  'irregularIncome',     // skip if not selfEmployed
  'budgetHousing', 'budgetUtilities', 'budgetGroceries', 'budgetDining',
  'budgetCarPayment', 'budgetGas', 'budgetCarInsurance',
  'budgetPhone', 'budgetInternet', 'budgetHealthInsurance', 'budgetMedical',
  'budgetSubscriptions',
  'budgetChildcare',     // skip if no dependents
  'budgetDebt', 'budgetClothing', 'budgetEntertainment', 'budgetGiving',
  'transition', 'monthlyPicture',
  'step1Cushion', 'step2Match', 'step3Debt', 'step4EmergencyFund',
  'step5ModerateDebt', 'step6Retirement', 'step7Goals', 'step8Optimize',
  'scoreScreen', 'pdfScreen',
];

Progress bar = current index / total screens * 100.

---

## Key Calculations

### Federal Tax Advantage

function calculateFederalTax(taxableIncome) {
  if (taxableIncome <= 0) return 0;
  const brackets = [
    { max: 11925, rate: 0.10 }, { max: 48475, rate: 0.12 },
    { max: 103350, rate: 0.22 }, { max: 197300, rate: 0.24 },
    { max: 250525, rate: 0.32 }, { max: 626350, rate: 0.35 },
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

function federalTaxAdvantage(basePay, bah, bas, specialPays) {
  const std = 15000;
  const a = basePay*12, b = bah*12, c = bas*12, d = specialPays*12;
  return Math.round((calculateFederalTax(Math.max(0,a+b+c+d-std))
    - calculateFederalTax(Math.max(0,a+d-std))) / 12);
}

### Pension

function calculatePension(rank, tis, isBRS) {
  const basePay = getBasePay(rank, tis);
  const multiplier = isBRS ? 0.02 : 0.025;
  const annual = basePay * 12 * multiplier * tis;
  return {
    monthly: Math.round(annual/12),
    annual: Math.round(annual),
    swrLow: Math.round(annual/0.045),
    swrHigh: Math.round(annual/0.035)
  };
}
// BRS: entryYear >= 2018

### Retirement Rank Pre-population

function getDefaultRetirementRank(currentRank) {
  const e = ['E-1','E-2','E-3','E-4','E-5','E-6','E-7','E-8','E-9'];
  const w = ['W-1','W-2','W-3','W-4','W-5'];
  const o = ['O-1','O-2','O-3','O-4','O-5','O-6','O-7','O-8','O-9','O-10'];
  if (e.includes(currentRank)) return e.indexOf(currentRank) >= 6 ? currentRank : 'E-7';
  if (w.includes(currentRank)) return w.indexOf(currentRank) >= 2 ? currentRank : 'W-3';
  if (o.includes(currentRank)) return o.indexOf(currentRank) >= 4 ? currentRank : 'O-5';
}

### Irregular Income

function conservativeMonthly(good, typical, tough) {
  return Math.round((good * 0.2) + (typical * 0.5) + (tough * 0.3));
}
// Slider min = conservativeMonthly, max = good month

### Frequency Conversion

function toMonthly(amount, frequency) {
  const map = { weekly: 52/12, biweekly: 26/12, twiceMonthly: 2, monthly: 1 };
  return Math.round(amount * map[frequency]);
}

### Bins

function getBins(monthlyIncome, bands) {
  return bands.map(([lo, hi]) => ({
    label: '$' + Math.round(monthlyIncome*lo/100).toLocaleString() + ' - $' + Math.round(monthlyIncome*hi/100).toLocaleString() + '/mo',
    value: Math.round(monthlyIncome*((lo+hi)/2)/100)
  }));
}

### Monte Carlo

const RISK = {
  conservative: { mean: 0.05, std: 0.08 },
  moderate:     { mean: 0.07, std: 0.12 },
  aggressive:   { mean: 0.09, std: 0.15 }
};

function runSimulation(contribution, years, profile) {
  const {mean, std} = RISK[profile];
  const months = years * 12;
  const results = [];
  for (let t = 0; t < 500; t++) {
    let bal = 0;
    for (let m = 0; m < months; m++) {
      const u1 = Math.random(), u2 = Math.random();
      const r = (mean + std * Math.sqrt(-2*Math.log(u1)) * Math.cos(2*Math.PI*u2)) / 12;
      bal = (bal + contribution) * (1 + r);
    }
    results.push(bal);
  }
  return results.sort((a,b) => a-b);
  // [49]=10th percentile, [249]=50th, [449]=90th
}

### Debt Payoff

function monthsToPayoff(balance, rate, payment) {
  const r = rate / 100 / 12;
  return r === 0 ? Math.ceil(balance/payment)
    : Math.ceil(-Math.log(1-(balance*r)/payment)/Math.log(1+r));
}

---

## Dual Military Rules

No kids: both get BAH without-dependents rate.
With kids: one gets with-dependents, one gets without. Only ONE can claim. Mutual exclusion at UI. JTR Vol 1 Ch 10.
Both always get BAS independently.
Both get own special pays menus independently.
DUAL MILITARY COMPLEXITY ENDS AFTER SCREEN 7. Screen 8 onward = solo vs couple only.

---

## Career Earnings Chart

Recharts LineChart, width 700px in scrollable div (overflow-x: auto, WebkitOverflowScrolling: touch)
Height 260px, Y axis $0 annual RMC, X axis years 0-20. Annual dollars only (not monthly).
Line: var(--navy) 2.5px. No gridlines.
Gold dot at year 0 labeled "Now". Blue dots at promotion milestones.
Dashed reference lines at $100K and $150K labeled right side.
"swipe to see more" hint fades after first scroll.
Dual military: navy line M1, gold line M2, legend below.

Promotion timeline (standard +1yr lag):
Enlisted: E-4 yr2, E-5 yr4, E-6 yr8, E-7 yr13, E-8 yr17
Warrant: W-2 yr2, W-3 yr5, W-4 yr8, W-5 yr12
Officers: O-2 yr2, O-3 yr4, O-4 yr10, O-5 yr16, O-6 yr22

---

## Napkin Scale Scoring

Blank: no $1,000 cushion
Scribbling: has cushion, in high-interest debt
Sketching: high-interest debt gone, emergency fund building
Drafting: full emergency fund, 15% retirement, no high-interest debt
Building: all above + goals funded, optimizing
Built: everything optimized, tax strategies active

---

## Subscription List (March 2026)

Store in src/data/subscriptions.js as array of { id, name, category, price }.
Each category gets "+ Add one I don't see" option in its header.

Streaming Video: Netflix Standard $17.99, Netflix with ads $7.99, Amazon Prime $14.99, Disney+ $15.99, Hulu $18.99, Max $16.99, Apple TV+ $12.99, Paramount+ $10.99, Peacock $10.99, ESPN/Fox One $40.00, YouTube TV $72.99

Music & Audio: Spotify $11.99, Apple Music $10.99, Amazon Music $13.00, Audible $14.95, SiriusXM $9.99

Fitness & Wellness: Gym membership $40.00, Peloton $44.00, Noom/WW $16.00, Calm/Headspace $12.99

Shopping & Convenience: Costco $6.25, Walmart+ $12.95, Instacart+ $9.99, DashPass $9.99

Productivity & Tech: iCloud+ $9.99, Google One $2.99, Microsoft 365 $9.99, Adobe CC $59.99, Dropbox $9.99, 1Password $3.99, ChatGPT Plus $20.00, VPN $5.00

Gaming: Xbox Game Pass $14.99, PlayStation Plus $17.99, Nintendo Online $3.33, Steam custom entry

News & Reading: New York Times $25.00, Kindle Unlimited $11.99, Other news custom entry

Other: Dating apps $30.00, LinkedIn Premium $39.99, Duolingo Plus $6.99

---

## File Structure

src/
  App.jsx
  main.jsx
  index.css
  screens/
    WelcomeScreen.jsx
    KnowledgeScreen.jsx
    HouseholdScreen.jsx
    PartnerIncomeScreen.jsx
    IncomeTypeScreen.jsx
    SpendingPhilosophyScreen.jsx
    PayReconstructionScreen.jsx
    PensionScreen.jsx
    LESConfirmationScreen.jsx
    IrregularIncomeScreen.jsx
    BudgetScreen.jsx
    DiningOutScreen.jsx
    SubscriptionsScreen.jsx
    DebtScreen.jsx
    TransitionScreen.jsx
    MonthlyPictureScreen.jsx
    Step1CushionScreen.jsx
    Step2MatchScreen.jsx
    Step3DebtScreen.jsx
    Step4EmergencyFundScreen.jsx
    Step5ModerateDebtScreen.jsx
    Step6RetirementScreen.jsx
    Step7GoalsScreen.jsx
    Step8OptimizeScreen.jsx
    ScoreScreen.jsx
    PDFScreen.jsx
  components/
    ProgressBar.jsx
    BinSelector.jsx
    DebtCard.jsx
    SubscriptionGrid.jsx
    DebtPayoffChart.jsx
    WealthBuildingChart.jsx
    MonteCarloChart.jsx
    CareerEarningsChart.jsx
    ActionLink.jsx
  data/
    subscriptions.js
    militaryPayTables.js
    bahRates.js
    basRates.js
    promotionTimelines.js
  utils/
    calculations.js
    napkinScale.js
    formatters.js

---

## Do NOT Build

No backend, no API, no database, no auth
No TypeScript (plain JavaScript V1)
No Fortress features
Recharts only, not Plotly
Not Inter, Roboto, or Arial fonts
No dollar values assigned to military benefits -- describe only
