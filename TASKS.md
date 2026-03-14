# Napkin Math -- Build Tasks
# Version 3.0 -- March 2026

Work through tasks sequentially. One task at a time.
After each: run npm run build, confirm no errors, commit.
Ask before moving to next task.

---

## TASK 0 -- Scaffold (COMPLETE)
- Vite + React installed
- Recharts and @react-pdf/renderer installed
- Clean App.jsx placeholder
- Deployed to Cloudflare Pages

---

## TASK 1 -- Global Setup

- Add to index.html head: Google Fonts import for Playfair Display (400,700) and DM Sans (400,500,600)
- Replace index.css with CSS variables from CLAUDE.md plus global reset plus body font-family DM Sans background #F8F9FA margin 0
- Create src/components/ProgressBar.jsx: props current and total. 4px tall full-width bar flush at top. Navy fill = (current/total)*100%. Light-gray background. Animated 300ms.
- Create src/utils/formatters.js: export formatCurrency(amount) returns $X,XXX and formatCurrencyPair(amount) returns $X,XXX/mo and $XX,XXX/yr
- Update App.jsx: full userData state object from CLAUDE.md. currentScreen state starting at welcome. updateUserData(updates) function merges updates. Screen routing switch renders matching component. Pass userData, updateUserData, onNext as props.
- Create src/utils/calculations.js: all calculation functions from CLAUDE.md (calculateFederalTax, federalTaxAdvantage, calculatePension, getDefaultRetirementRank, conservativeMonthly, toMonthly, getBins, runSimulation, monthsToPayoff)
- Commit: task-1-global-setup

---

## TASK 2 -- Welcome Screen

File: src/screens/WelcomeScreen.jsx

Layout: min-height 100dvh, flex column space-between, navy background, padding 40px 24px 48px 24px, no progress bar

Top section:
- NAPKIN MATH label: DM Sans 13px uppercase letter-spacing 0.15em white 50% opacity
- Napkin Math wordmark: Playfair Display 56px weight 700 white line-height 1.1
- Gold rule: 48px wide 2px tall var(--gold) margin-top 16px

Middle section (flex-grow):
- "Let's build a picture of your financial life." DM Sans 22px white 85% opacity line-height 1.5

Bottom section:
- Button "Let's get started" white bg navy text border-radius 16px height 56px full-width DM Sans 18px weight 600. onClick: onNext()
- "All calculations happen on your device. Nothing you enter is stored or shared." DM Sans 11px white 50% opacity text-align center margin-top 12px
- "Napkin Math provides financial planning tools, not financial advice. Not affiliated with or endorsed by the Department of Defense." DM Sans 11px white 35% opacity text-align center margin-top 8px

Animation: staggered fade-in. Label 0ms, wordmark 100ms, rule 150ms, tagline 250ms, button and text 400ms.
onNext: knowledge
Commit: task-2-welcome-screen

---

## TASK 3 -- Self-Assessment Screen

File: src/screens/KnowledgeScreen.jsx

Progress bar at top. Back button top left margin-top 16px 44x44px.
Heading: "Self-Assessment" Playfair Display 32px weight 700 navy margin-top 24px
Subheading: "No wrong answers. This just helps us start in the right place." DM Sans 16px gray margin-top 8px

Three selectable cards gap 12px. Each has info button (absolute top 16px right 16px, 24x24px circle, navy border 1.5px, DM Sans 13px italic i). Tapping info button toggles info text below card body fade 200ms. e.stopPropagation() on info button so it does not select the card.

Card 1: label GETTING STARTED, body "Others are doing financially well. I am here.", info "I need a budget, a debt reduction plan, a savings plan -- the whole thing.", value beginner
Card 2: label FINDING MY FOOTING, body "I have a money. But I would like more to occur, also.", info "I need to refine my savings plan and be sure I'm hitting my goals.", value intermediate
Card 3: label READY TO OPTIMIZE, body "I'm doing great. I think.", info "I want to optimize my savings and pursue additional wealth building avenues -- and get a common sense check.", value advanced

Cards stagger in on mount: 0ms / 80ms / 160ms.
Continue button (navy bg white text) appears only after selection, fade 200ms.
On continue: save userData.knowledgeLevel, call onNext()
onNext: household
Commit: task-3-knowledge-screen

---

## TASK 4 -- Household Screen

File: src/screens/HouseholdScreen.jsx

Heading: "Who is this plan for?"
Subheading: "This helps us make sure we capture everything."

Two cards, no info button:
Card 1: label JUST ME, body "This plan covers my finances only.", value solo
Card 2: label ME AND MY PARTNER, body "We want a plan that covers our household.", value partner

Continue button appears after selection. Saves userData.householdType.
onNext: solo goes to incomeType, partner goes to partnerIncome
Commit: task-4-household-screen

---

## TASK 5 -- Partner Income Screen

File: src/screens/PartnerIncomeScreen.jsx
Only renders if userData.householdType === partner

Heading: "What about your partner?"
Subheading: "We'll factor their income into the full picture."

Four cards with info buttons:
Card 1: label REGULAR EMPLOYER, body "They get a paycheck on a set schedule.", info "W-2 employee. We'll ask what actually hits your account.", value civilian
Card 2: label ACTIVE DUTY MILITARY, body "They receive a military paycheck.", info "We'll reconstruct their full compensation as part of your household picture.", value military
Card 3: label SELF-EMPLOYED OR VARIABLE, body "Their income doesn't follow a set schedule.", info "Freelance, contract, or inconsistent income. We'll use a realistic baseline.", value selfEmployed
Card 4: label NO INCOME, body "They're not currently earning income.", value none -- NO info button on this card

Cards stagger: 0ms / 80ms / 160ms / 240ms
Saves userData.partnerIncomeType
onNext: incomeType
Commit: task-5-partner-income-screen

---

## TASK 6 -- Income Type Screen

File: src/screens/IncomeTypeScreen.jsx

Heading: solo gives "What best describes your situation?", partner gives "What about you?"
Subheading: solo gives "This shapes how we look at your income.", partner gives "Now let's look at your situation."

Three cards with info buttons:
Card 1: label REGULAR EMPLOYER, body "I get a paycheck on a set schedule.", info "W-2 employee. We'll ask what actually hits your bank account.", value civilian
Card 2: label ACTIVE DUTY MILITARY, body "I receive a military paycheck.", info "We'll reconstruct your full compensation. To build your budget we'll also need a couple numbers from your LES, because taxes.", value military
Card 3: label SELF-EMPLOYED OR VARIABLE, body "My income doesn't follow a set schedule.", info "Contractor, freelance, or gig work. We'll build your plan around a realistic baseline.", value selfEmployed

On continue: save userData.incomeType. Auto-calculate isDualMilitary = (userData.partnerIncomeType === military AND value === military). Save isDualMilitary silently, never show to user.
onNext: spendingPhilosophy
Commit: task-6-income-type-screen

---

## TASK 7 -- Spending Philosophy Screen

File: src/screens/SpendingPhilosophyScreen.jsx

Heading: "How do you want to handle your money?"

Two cards with info buttons:
Card 1: label SET IT AND FORGET IT, body "Make my savings happen automatically. I'll spend whatever's left without thinking about it.", info "Automate savings and investments first, then spend freely. No tracking, no guilt.", value automator
Card 2: label TRACK EVERY DOLLAR, body "I want to know exactly where my money goes and adjust as I go.", info "Every dollar has a job. More hands-on but gives you complete visibility.", value tracker

Note below cards: "Automation is lower maintenance. Tracking gives you more visibility. Pick the one you'll actually stick with." DM Sans 13px gray italic margin-top 16px text-align center

Saves userData.spendingPhilosophy
onNext: military goes to payReconstruction1, selfEmployed goes to irregularIncome, civilian goes to lesConfirmation
Commit: task-7-spending-philosophy-screen

---

## TASK 8 -- Military Data Setup

Create src/data/militaryPayTables.js: 2026 base pay table E-1 through O-10 at TIS brackets. Use official DFAS 2026 pay tables.
Create src/data/bahRates.js: simplified BAH lookup by rank category and dependency status. Note in comments: V2 will replace with full ZIP table.
Create src/data/basRates.js: enlisted $460.20/mo, officer $319.71/mo. Verify against 2026 DFAS tables.
Create src/data/promotionTimelines.js: Enlisted E-4 yr2 E-5 yr4 E-6 yr8 E-7 yr13 E-8 yr17. Warrant W-2 yr2 W-3 yr5 W-4 yr8 W-5 yr12. Officers O-2 yr2 O-3 yr4 O-4 yr10 O-5 yr16 O-6 yr22.
Add to calculations.js: getBasePay(rank, tis), getBAH(rank, dependents), getBAS(rank), getDefaultRetirementRank(rank) using logic in CLAUDE.md
Commit: task-8-military-data-setup

---

## TASK 9 -- Pay Reconstruction Screen

File: src/screens/PayReconstructionScreen.jsx
Props: memberNumber (1 or 2)
Render condition: incomeType === military only

Heading M1: "Let's look at your pay"
Heading M2: "Now let's look at your spouse's pay"
Subheading: "Your bank account tells part of the story. Let's hear the rest."

Section order:
1. THE BASICS: Pay Grade dropdown grouped E1-E9 / W1-W5 / O1-O10. Years of Service number input 0-40.
2. ZIP/OCONUS: Duty Station ZIP text input maxLength 5. Below ZIP: small toggle "Stationed overseas?" 40x24px. When ON: ZIP slides up fades out 200ms, three inputs fade in: OHA Monthly Rental, OHA Monthly Utility, Overseas COLA. Helper: "Find your rates at travel.dod.mil" as tappable link. BAH label in card relabels to OHA.
3. Dependents toggle 48x28px navy. M2: if m1Dependents is true, disable with note: "Dependents already claimed by Member 1. Per DoD policy (JTR Vol 1, Ch 10), only one spouse receives BAH at the with-dependents rate."
4. SPECIAL PAYS: collapsed by default, white card row with plus to expand. Pre-listed: Static Line +$150, HALO +$225, Aviation +$200 note estimate, Dive +$150, Demo +$150, Hostile Fire +$225, FLPB text input when checked. Each is checkbox row: checkbox left label center amount right visible when checked. Below list: Add another special pay button appends name field plus amount field plus delete button.
5. LIVE COMPENSATION CARD: fades in when Pay Grade and TIS entered. Updates real-time. Shows Base Pay, BAH/OHA, BAS, Special Pays, Federal Tax Advantage each with monthly and annual. Divider. RMC total monthly and annual larger. Note: "The DoD's official measure of cash compensation. Calculated using the standard deduction -- your actual tax advantage varies by filing status and state."
6. CAREER EARNINGS CHART: component CareerEarningsChart.jsx. Recharts LineChart 700px wide in div with overflow-x auto and WebkitOverflowScrolling touch. Height 260px. Y axis $0 annual RMC. X axis 0-20 years. Navy line. Gold dot year 0 labeled Now. Blue dots at promotions. $100K and $150K dashed reference lines labeled right side. "swipe to see more" hint fades after first scroll. Dual military: navy M1 gold M2 legend below.
7. ADDITIONAL BENEFITS: collapsed at bottom. Expanded shows intro "These aren't included in your RMC -- but a civilian pays for all of them out of their paycheck." Then 7 benefit rows: Tricare, Commissary and Exchange, Tuition Assistance, GI Bill, Legal Services, TSP Match, Pension. Each name plus one sentence description. No dollar values.
8. STICKY CONTINUE BUTTON "See what this all means" visible when Pay Grade and TIS and ZIP or OHA are entered.

Saves all m1 or m2 fields.
onNext: M1 plus isDualMilitary goes to payReconstruction2. M1 not dual goes to pension. M2 goes to pension.
Commit: task-9-pay-reconstruction

---

## TASK 10 -- Pension Screen

File: src/screens/PensionScreen.jsx
Render condition: incomeType === military only

Heading: "Your Pension"
Subheading: "Before we move on, let's talk about what you're building toward."

Three cards no info button:
YES: "I plan to serve 20 or more years."
NOT SURE: "I haven't decided yet."
NO: "I plan to separate before 20 years."

After any selection: pension calculator section fades in 250ms.

NO section title: "[E-7 or W-3 or O-5] with 20 Years -- Pension Estimate" using getDefaultRetirementRank. No framing copy. Let numbers speak.
YES and NOT SURE section title: "Your Pension Estimate"

Two inputs side by side 50/50 gap 12px:
- Retirement Rank dropdown pre-populated via getDefaultRetirementRank(userData.m1Rank)
- Years of Service number input pre-populated 20, min 20 max 40

Note below inputs: "We pre-filled these based on your current rank and the most common retirement point. Adjust if you have a different plan."

Live Pension Card appears immediately from pre-population and updates on change:
Row 1: "Monthly pension at retirement" value Playfair Display 24px navy. Sub: annual gray.
Divider
Row 2: "Equivalent savings needed to replicate this pension" shows SWR range. Expandable note uses approved SWR copy from CLAUDE.md. Small note: "Based on a 3.5%-4.5% withdrawal rate. Conservative estimate."
Divider
Row 3 for unsure and no only: light-gold background. "Each year you stay adds $X-$Y to that total permanently. Each year you leave early, that value is gone." gold value text.

Numbers count up from 0 on first render 600ms ease-out.

Separation flag for no only: gold left border 3px card. Copy: "We'll come back to this. When we get to your goals, we'll show you exactly what compensation package you'd need on the outside to truly come out ahead."

Sticky button: "Now let's look at your budget" visible after card selection.
Saves retirementIntent, retirementRank, retirementTIS, monthlyPension, annualPension, pensionSWRLow, pensionSWRHigh
onNext: lesConfirmation
Commit: task-10-pension-screen

---

## TASK 11 -- LES and Regular Income Screen

File: src/screens/LESConfirmationScreen.jsx
Renders for: military and civilian regular income types

Heading: "What actually hits your account"
Subheading: "Check your bank statement or LES. Military pay arrives mid-month and end of month."

Military sub-flow: Mid-month deposit input plus End of month deposit input. Helpers: "Usually around the 15th" and "Usually the last business day". No frequency selector.

Civilian sub-flow: "What hits your account each paycheck?" single input plus frequency selector four options: Weekly / Every two weeks / Twice a month / Monthly. Convert to monthly using toMonthly() silently.

Couple: two sections "Your income" and "Partner's income" each with appropriate inputs for their income type.

No empty placeholders. Required. Continue hidden until all fields greater than 0.

Live total card: monthly and annual. Couple shows both members then combined total larger navy.

Sanity check: if variance from expected greater than 25% show light-gold card: "Take a second to double-check that number -- it's the foundation of everything that follows."
Expected = m1RMC times 0.75 for military.

Additional income section: toggle "Do you have any additional income?" If yes: rows with name field plus amount field plus regularity selector (Every month 100% / Most months 75% / Unpredictable 50%). Plus Add another source button. Running total updates.

Saves monthlyTakeHome.
onNext: budgetHousing
Commit: task-11-les-confirmation

---

## TASK 12 -- Irregular Income Screen

File: src/screens/IrregularIncomeScreen.jsx
Renders for: selfEmployed income type only

Heading: "Let's talk about your income"
Subheading: "Irregular income makes budgeting harder than most advice accounts for. We're going to build your plan around what you can reliably count on -- not your best month."

Three inputs per person. Couple shows two sections "Your income" and "Partner's income":
- Good month: "What's a good month look like?" helper "Not your best ever. Just a solid month."
- Typical month: "What's a typical month?" helper "The number you'd bet on most months."
- Tough month: "What's a tough month look like?" helper "Not worst case. Just a slow one."

Live conservative estimate card when all three entered:
Label "We'll build your plan around". Value $X,XXX/month Playfair Display 36px navy. Annual below.
Note: "A weighted estimate that accounts for slow months without assuming the worst."

Adjustment slider below estimate:
- Min = conservativeMonthly result, max = good month value
- Current value shown above thumb in real time
- Helper: "Only go higher if you're confident. Your plan is only as good as this number."

Couple shows two estimates then combined.
Sanity check if less than $500 or greater than $50,000: approved copy from CLAUDE.md.
Same additional income section as Task 11.

Saves monthlyTakeHome = slider value.
onNext: budgetHousing
Commit: task-12-irregular-income-screen

---

## TASK 13 -- Reusable Budget Components

Create src/components/BinSelector.jsx:
Props: bins array of objects with label and value, selectedValue, onSelect, onCustomAmount.
2x2 grid of tappable tiles. Selected = navy bg white text. Unselected = white bg navy border.
Border-radius 12px height 72px font DM Sans 16px.
Below grid: "Enter exact amount" link shows number input instead.

Create src/screens/BudgetScreen.jsx reusable template:
Props: heading, subtext, percentageBands array of lo/hi pairs, fieldName, flagThreshold optional, flagCopy optional, userData, updateUserData, onNext.
Calculates bins from userData.monthlyTakeHome using getBins().
Shows heading, subtext, bin selector. If top bin selected and flagThreshold set: show flagCopy in light-gold card.
Continue button saves userData[fieldName] and calls onNext().

Commit: task-13-reusable-budget-component

---

## TASK 14 -- Housing Screen

Use BudgetScreen:
heading "Housing"
subtext "Your rent or mortgage payment only -- we'll cover utilities separately."
bands 20-25, 25-35, 35-45, 45-100
fieldName housing
flagThreshold 35
flagCopy "Housing above 35% of income leaves less room for everything else. Not a problem -- just worth knowing."

After selection: follow-up "Do you rent or own?" If rent: nudge card "Renters insurance typically costs $10-20/month and covers your belongings. Worth it."
Commit: task-14-budget-housing

---

## TASK 15 -- Utilities Screen

Use BudgetScreen:
heading "Utilities"
subtext "Electric, gas, water, and trash -- bundled together."
bands 3-5, 5-8, 8-12, 12-100
fieldName utilities
Commit: task-15-budget-utilities

---

## TASK 16 -- Groceries Screen

Use BudgetScreen:
heading "Groceries"
subtext "In-home food only -- we'll ask about restaurants separately."
bands 5-8, 8-12, 12-15, 15-100
fieldName groceries
Commit: task-16-budget-groceries

---

## TASK 17 -- Dining Out Screen

File: src/screens/DiningOutScreen.jsx (custom, not reusable BudgetScreen)

Two paths: "I know roughly what I spend" shows bin selector bands 2-4, 4-6, 6-10, 10-100. OR "Honestly, I'm not sure" shows calculator path.

Calculator path inputs:
- Delivery: times per week times order size bins $15-25 / $25-40 / $40-60
- Fast food: times per week times size bins $8-12 / $12-20
- Coffee: frequency daily/few times/occasionally times price bins $4-6 / $6-8
- Restaurants: times per month times spend bins $20-40 / $40-70 / $70+
- Bars: times per month times spend bins $20-40 / $40-80 / $80+

Running monthly total updates as inputs change.
Reveal: show total in large text with approved dining copy from CLAUDE.md.
Saves userData.diningOut.
onNext: budgetCarPayment
Commit: task-17-budget-dining

---

## TASK 18 -- Transportation Screens

Three screens using BudgetScreen:

Car Payment:
heading "Car payment"
subtext "Your monthly loan or lease payment. Enter $0 if you own outright."
bands 0-0, 5-10, 10-15, 15-100
First bin label "$0 -- I own my car"
fieldName carPayment
flagThreshold 15
flagCopy "Car payment above 15% of income is significant. Total car costs ideally stay under 20% combined."

Gas:
heading "Gas and fuel"
bands 2-4, 4-6, 6-8, 8-100
fieldName gasAndFuel

Car Insurance:
heading "Car insurance"
subtext "Divide annual premium by 12 if you pay yearly."
bands 1-3, 3-5, 5-7, 7-100
fieldName carInsurance

Commit: task-18-budget-transportation

---

## TASK 19 -- Phone and Internet

Phone:
heading "Phone"
bands 1-2, 2-3, 3-5, 5-100
fieldName phone
flagThreshold 5
flagCopy "Over $150/month for one line is worth a quick comparison shop."

Internet:
heading "Internet"
bands 1-2, 2-3, 3-100
fieldName internet

Commit: task-19-budget-phone-internet

---

## TASK 20 -- Healthcare Screens

Health Insurance:
heading "Health insurance"
subtext "What you personally pay out of pocket. Active duty: your Tricare is free -- this is likely $0."
bands 0-0, 2-5, 5-8, 8-100
First bin "$0 -- covered or free"
fieldName healthInsurance

Out of Pocket Medical:
heading "Out of pocket medical"
subtext "Copays, prescriptions, dental, vision -- your monthly average."
bands 1-2, 2-4, 4-6, 6-100
fieldName outOfPocketMedical
Follow-up: "Do you have a Health Savings Account (HSA)?" Yes/No saves userData.hasHSA

Commit: task-20-budget-healthcare

---

## TASK 21 -- Subscriptions Screen

File: src/screens/SubscriptionsScreen.jsx
Create src/data/subscriptions.js with full list from CLAUDE.md

Running total at top updates real-time.
Tappable chips: selected navy bg white text, unselected white bg navy border.
Organized by category with headers.
Each category header has "+ Add one I don't see" inline form with name and price fields.
If total greater than $100: "That's $[total*12] a year. Worth a quick look at what you actually use."

Saves userData.subscriptions array.
onNext: budgetChildcare if has dependents, else budgetDebt
Commit: task-21-subscriptions

---

## TASK 22 -- Childcare Screen

Only renders if userData.m1Dependents or userData.m2Dependents is true.

Use BudgetScreen:
heading "Childcare"
subtext "Monthly childcare costs -- daycare, after-school programs, babysitters."
bands 5-10, 10-15, 15-20, 20-100
fieldName childcare
No flag copy -- not discretionary spending.

Commit: task-22-budget-childcare

---

## TASK 23 -- Debt Screen

File: src/screens/DebtScreen.jsx
Create src/components/DebtCard.jsx

Heading: "Let's look at your debt"
Subtext: "Enter each debt separately -- this helps us build the right payoff plan."

Add debt button opens form:
- Type selector: Credit card / Student loan / Car loan / Personal loan / Medical debt / Other
- Balance: number input
- Interest rate: number input plus "I don't know" option. If selected: default 24.99% with approved copy from CLAUDE.md.
- Minimum payment: number input plus "I'm not sure" option. If selected: estimate 2% of balance or $25 whichever higher, with nudge "We estimated $X. Check your statement to confirm."

Each debt renders as DebtCard showing type, balance, rate, minimum. Deletable.
"No debt" button if none.

Saves userData.debts array.
Commit: task-23-debt-screen

---

## TASK 24 -- Remaining Budget Screens

Clothing:
heading "Clothing and personal care"
subtext "Clothes, shoes, haircuts, toiletries, cosmetics -- bundled."
bands 2-3, 3-5, 5-7, 7-100
fieldName clothing

Entertainment:
heading "Entertainment and hobbies"
subtext "Events, hobbies, sports, concerts, pets."
bands 2-4, 4-6, 6-8, 8-100
fieldName entertainment
Note: no judgment flag -- intentional quality-of-life spending.

Giving opt-in:
heading "Giving"
subtext "Charitable giving, church, family support. Skip if it doesn't apply."
fieldName giving
Show Skip button as well as bin selector.
No judgment, no flag ever.

Commit: task-24-remaining-budget

---

## TASK 25 -- Transition Screen

File: src/screens/TransitionScreen.jsx
Full screen navy background.
Words fade in sequentially: "Okay." then pause then "We've got your numbers." then pause then "Let's see what your picture looks like."
CSS animation, words appear one at a time.
Auto-advances after 3 seconds or tap to continue.
On this screen: calculate totalMonthlyExpenses (sum all budget categories plus debt minimums) and breathingRoom (monthlyTakeHome minus totalMonthlyExpenses). Save to userData.
Commit: task-25-transition

---

## TASK 26 -- Monthly Picture Screen

File: src/screens/MonthlyPictureScreen.jsx
Three numbers large centered:
- "Money coming in" -- monthlyTakeHome
- "Money going out" -- totalMonthlyExpenses
- "Breathing room" -- breathingRoom. Green if positive, red if negative.

One framing sentence:
- breathingRoom less than 0: "Right now more is going out than coming in. Let's figure out why and find some breathing room."
- breathingRoom less than 5% of income: "You've got a little room to work with. Let's put it in the right order."
- breathingRoom 5% or more of income: "You've got real breathing room. Here's how to make sure it's working as hard as possible."

Whole-picture flag if housing plus car costs plus debt minimums greater than 60% of income: "Your fixed costs are taking up [X]% of your income. That's worth understanding -- we'll address it in your plan."
Commit: task-26-monthly-picture

---

## TASK 27 -- Steps 1 through 4

Step 1 (src/screens/Step1CushionScreen.jsx):
Heading: "The $1,000 Cushion"
Question: "Do you have $1,000 sitting somewhere you don't touch?"
Three options: Yes / No / Kind of
If No or Kind of: show timeline at current breathing room. Action: open HYSA, name it Do Not Touch, auto-transfer on payday.
Links: Marcus https://www.marcus.com, Ally https://www.ally.com, NerdWallet HYSA https://www.nerdwallet.com/best/banking/high-yield-online-savings-accounts, Navy Federal https://www.navyfederal.org, USAA https://www.usaa.com
If Yes: green check, continue.

Step 2 (src/screens/Step2MatchScreen.jsx):
Show BRS match: 5% of m1BasePay in real dollars monthly and annual.
Approved copy: "Your employer set aside money each month for you. If you don't meet the match, you're handing it back."
Question: "Are you contributing at least 5% to your TSP?" Yes / No / Not sure
If No or unsure: action with MyPay link https://mypay.dfas.mil. If dual military: show action for BOTH members with separate MyPay links.
Links: MyPay https://mypay.dfas.mil, TSP.gov https://www.tsp.gov

Step 3 (src/screens/Step3DebtScreen.jsx):
Only activates if any debt rate greater than 7%. If none: green check skip to Step 4.
Create src/components/DebtPayoffChart.jsx (Recharts LineChart debt to zero)
Create src/components/WealthBuildingChart.jsx (Recharts AreaChart compound growth at 6%)
Show each high-interest debt as card with monthly interest cost in plain dollars.
Slider: min = sum of minimums, max = minimums times 3. Both charts update real-time.
Big number above wealth chart: "At 65, that's $[X]"
Avalanche vs Snowball choice in plain language.
Links: Undebt.it https://undebt.it, AnnualCreditReport.com https://www.annualcreditreport.com, SCRA for military https://www.consumerfinance.gov/consumer-tools/military-financial-lifecycle/scra/

Step 4 (src/screens/Step4EmergencyFundScreen.jsx):
Calculate essential expenses from userData (housing + utilities + groceries + transportation + phone + internet + health + childcare + debt minimums).
Show 3-month target and 6-month target in actual dollars.
Two options using approved copy from CLAUDE.md.
Military note: military income stability, 3 months often sufficient.
Timeline to hit target at current breathing room.
HYSA recommendation.
Links: same as Step 1.

Commit: task-27-steps-1-4

---

## TASK 28 -- Steps 5 through 8

Step 5 (src/screens/Step5ModerateDebtScreen.jsx):
Only if any debt 4-7%. If none: skip.
Show both 10-year outcomes side by side: pay off vs invest.
Honest math framing. User chooses.
Links: StudentAid.gov https://studentaid.gov/loan-simulator/, SCRA if military.

Step 6 (src/screens/Step6RetirementScreen.jsx):
Create src/components/MonteCarloChart.jsx using Recharts.
Show 15% target in actual dollars. Current TSP vs target.
TSP L Fund recommendation with link https://www.tsp.gov/funds-lifecycle/
Three buttons: Conservative / Moderate / Aggressive.
"How did we define these?" expandable plain language explanation.
Run simulation on button click. Fan chart 500 lines faded plus 10th/50th/90th highlighted.
Three plain language outcomes.
Copy: "All three people contributed the same amount every month. The difference is luck and timing -- not effort."
Military: pension plus TSP combined picture.
Full allocation tool link: "Want to understand how your fund allocation affects this?"
Links: TSP funds https://www.tsp.gov/funds-individual/, Lifecycle funds https://www.tsp.gov/funds-lifecycle/, MilTax https://www.militaryonesource.mil/financial-legal/tax-resource-center/miltax-military-tax-services/

Step 7 (src/screens/Step7GoalsScreen.jsx):
Multi-select cards: home / car / wedding / business / education / leaving the military / other.
Each selected goal: follow-up how much and when. Back-calculate monthly savings needed.
VA loan callout if home selected. Link: https://www.benefits.va.gov/homeloans/
Separation tool if leaving the military selected: show civilian equivalent salary and pension SWR range.
529 nudge if education selected. Link: https://www.savingforcollege.com

Step 8 (src/screens/Step8OptimizeScreen.jsx):
Only renders if napkinScale is drafting, building, or built.
Roth vs Traditional behavioral question.
HSA triple tax advantage if applicable. Link: https://www.fidelity.com/go/hsa/why-hsa
Advanced links: Bogleheads https://www.bogleheads.org/wiki/Main_Page, MilTax, IRS Roth limits https://www.irs.gov/retirement-plans/roth-iras

Commit: task-28-steps-5-8

---

## TASK 29 -- Napkin Scale and Score Screen

Create src/utils/napkinScale.js:
function calculateNapkinScale(userData):
- No cushion: blank
- Has cushion plus high-interest debt: scribbling
- Has cushion plus no high-interest debt plus no emergency fund: sketching
- Has emergency fund plus not at 15% retirement: drafting
- Has emergency fund plus 15% retirement plus goals: building
- All optimized: built
Save result to userData.napkinScale.

File: src/screens/ScoreScreen.jsx
Stage name large Playfair Display centered.
Stage description using their specific numbers, not generic.
One sentence preview of next stage only. Not the full staircase.
"Get my plan" button goes to pdfScreen.

Commit: task-29-napkin-scale-score

---

## TASK 30 -- PDF and Share Card

File: src/screens/PDFScreen.jsx
Create src/components/PDFDocument.jsx using @react-pdf/renderer.

PDF four pages:
Page 1: date, Napkin Scale stage large, three numbers, household situation
Page 2: complete budget every category, total expenses, breathing room
Page 3: one job right now with single specific action and their actual numbers and timeline
Page 4: come back when with three specific return triggers using their actual milestones

Download button: "Download my plan"
Share card: screenshot-friendly summary showing score and one job. Copy button.

Commit: task-30-pdf-output

---

## TASK 31 -- Polish and Deploy

Back button on every screen saves state before going back.
Screen skip logic verified: partnerIncome, payReconstruction2, pension, childcare, step8Optimize.
Progress bar percentage accurate across all screens.
localStorage: save userData on every updateUserData call.
Test every screen at 390px width.
All touch targets minimum 56px.
All currency inputs have inputMode="decimal".
npm run build -- zero errors zero warnings.
git add . and git commit -m "v1.0 complete" and git push origin main
Confirm Cloudflare deployment succeeds.
Test full flow on mobile.
Commit: task-31-v1-complete

---

## V2 Notes

Civilian income path
Full BAH ZIP code lookup table
TypeScript migration
Spouse pension planning in Step 7
Anonymous subscription aggregation
