total*12] a year. Worth a quick look at what you actually use."
- [ ] Saves userData.subscriptions array. onNext → childcare if dependents, else budgetDebt
- **Commit:** `task-21-subscriptions`

### TASK 22 — Childcare (only if dependents)
- [ ] Use BudgetScreen: heading "Childcare", subtext "Monthly childcare costs — daycare, after-school, babysitters.", bands [[5,10],[10,15],[15,20],[20,100]], fieldName 'childcare'. No flag — not discretionary.
- **Commit:** `task-22-budget-childcare`

### TASK 23 — Debt Screen
- [ ] File: `src/screens/DebtScreen.jsx` + `src/components/DebtCard.jsx`
- [ ] Add debt form: Type selector, Balance input, Interest rate input ("I don't know" → default 24.99% with approved copy), Minimum payment ("I'm not sure" → estimate 2% of balance or $25 whichever higher with nudge to confirm)
- [ ] Each debt renders as a DebtCard, deletable
- [ ] "No debt" button if none
- [ ] Saves userData.debts array
- **Commit:** `task-23-debt-screen`

### TASK 24 — Remaining Budget (3 screens)
Clothing: heading "Clothing and personal care", subtext "Clothes, shoes, haircuts, toiletries, cosmetics.", bands [[2,3],[3,5],[5,7],[7,100]], fieldName 'clothing'
Entertainment: heading "Entertainment and hobbies", subtext "Events, hobbies, sports, concerts, pets.", bands [[2,4],[4,6],[6,8],[8,100]], fieldName 'entertainment'. Note: no judgment flag.
Giving: heading "Giving", subtext "Charitable giving, church, family support. Skip if it doesn't apply.", fieldName 'giving'. Show Skip button. No judgment, no flag ever.
- **Commit:** `task-24-remaining-budget`

---

## RESULTS FLOW

### TASK 25 — Transition Screen
- [ ] Navy background, words fade in sequentially: "Okay." → pause → "We've got your numbers." → pause → "Let's see what your picture looks like."
- [ ] Auto-advances after 3 seconds or tap to continue
- [ ] Calculate totalMonthlyExpenses and breathingRoom, save to userData
- **Commit:** `task-25-transition`

### TASK 26 — Monthly Picture Screen
- [ ] Three numbers large: Money coming in / Money going out / Breathing room
- [ ] breathingRoom green if positive, red if negative
- [ ] One framing sentence based on situation
- [ ] Whole-picture flag if housing+car+debt minimums > 60% of income
- **Commit:** `task-26-monthly-picture`

### TASK 27 — Steps 1-4
- [ ] Step1CushionScreen, Step2MatchScreen, Step3DebtScreen, Step4EmergencyFundScreen
- [ ] Full specs in session context document v3
- [ ] DebtPayoffChart and WealthBuildingChart components using Recharts
- [ ] Slider on Step 3 updates both charts in real time
- **Commit:** `task-27-steps-1-4`

### TASK 28 — Steps 5-8
- [ ] Step5ModerateDebtScreen, Step6RetirementScreen, Step7GoalsScreen, Step8OptimizeScreen
- [ ] MonteCarloChart: 3 buttons conservative/moderate/aggressive, 500 trials, fan chart
- [ ] Full allocation tool link in Step 6
- [ ] Separation/retention tool in Step 7 if "leaving the military" selected
- **Commit:** `task-28-steps-5-8`

### TASK 29 — Score + PDF
- [ ] ScoreScreen: Napkin Scale stage large, specific numbers, one sentence next stage preview
- [ ] PDFScreen: 4-page PDF using @react-pdf/renderer
- [ ] Shareable image card
- **Commit:** `task-29-score-pdf`

### TASK 30 — Polish + Deploy
- [ ] Back button on every screen
- [ ] localStorage save on every userData update
- [ ] Screen skip logic verified
- [ ] Test full flow on mobile at 390px
- [ ] npm run build zero errors
- [ ] Push to GitHub, confirm Cloudflare deploy
- **Commit:** `task-30-v1-complete`

---

## NOTES FOR V2
- Civilian income path
- Full BAH ZIP code table
- TypeScript migration
- Spouse pension planning (Step 7 Goals)
- Anonymous subscription aggregation
if positive, red if negative.

One framing sentence:
- breathingRoom < 0: "Right now more is going out than coming in. Let's figure out why and find some breathing room."
- breathingRoom < monthlyTakeHome * 0.05: "You've got a little room to work with. Let's put it in the right order."
- breathingRoom >= monthlyTakeHome * 0.05: "You've got real breathing room. Here's how to make sure it's working as hard as possible."

Whole-picture flag if housing + car costs + debt minimums > 60% of income: "Your fixed costs are taking up [X]% of your income. That's worth understanding -- we'll address it in your plan."
Commit: task-26-monthly-picture

---

## TASK 27 -- Steps 1 through 4

Step 1 (src/screens/Step1CushionScreen.jsx):
Heading: "The $1,000 Cushion"
Question: "Do you have $1,000 sitting somewhere you don't touch?"
Three options: Yes / No / Kind of
If No or Kind of: show timeline at current breathing room. Action: open HYSA, name it Do Not Touch, auto-transfer on payday.
Links: Marcus, Ally, NerdWallet HYSA, Navy Federal, USAA
If Yes: green check, continue.

Step 2 (src/screens/Step2MatchScreen.jsx):
Show BRS match calculation: 5% of m1BasePay in real dollars monthly and annual.
Approved copy: "Your employer set aside money each month for you. If you don't meet the match, you're handing it back."
Question: "Are you contributing at least 5% to your TSP?" Yes / No / Not sure
If No or unsure: action with MyPay link. If dual military: show action for BOTH members with separate MyPay links.
Links: MyPay https://mypay.dfas.mil, TSP.gov https://www.tsp.gov

Step 3 (src/screens/Step3DebtScreen.jsx):
Only activates if any debt rate > 7%. If none: green check skip to Step 4.
Create src/components/DebtPayoffChart.jsx (Recharts LineChart debt to zero)
Create src/components/WealthBuildingChart.jsx (Recharts AreaChart compound growth at 6%)
Show each high-interest debt as card with monthly interest cost in plain dollars.
Slider: min = sum of minimums, max = minimums * 3. Both charts update real-time.
Big number above wealth chart: "At 65, that's $[X]"
Avalanche vs Snowball choice in plain language.
Links: Undebt.it, AnnualCreditReport.com, SCRA for military.

Step 4 (src/screens/Step4EmergencyFundScreen.jsx):
Calculate essential expenses from userData.
Show 3-month target and 6-month target in actual dollars.
Two options using approved copy from CLAUDE.md.
Military note: military income stability, 3 months often sufficient.
Timeline to hit target at current breathing room.
HYSA recommendation.
Links: Marcus, Ally, NerdWallet, Navy Federal, USAA.

Commit: task-27-steps-1-4

---

## TASK 28 -- Steps 5 through 8

Step 5 (src/screens/Step5ModerateDebtScreen.jsx):
Only if any debt 4-7%. If none: skip.
Show both 10-year outcomes side by side: pay off vs invest.
Honest math framing. User chooses.
Links: StudentAid.gov, SCRA if military.

Step 6 (src/screens/Step6RetirementScreen.jsx):
Create src/components/MonteCarloChart.jsx using Recharts.
Show 15% target in actual dollars. Current TSP vs target.
TSP L Fund recommendation with link.
Three buttons: Conservative / Moderate / Aggressive.
"How did we define these?" expandable plain language explanation.
Run simulation on button click. Fan chart 500 lines faded + 10th/50th/90th highlighted.
Three plain language outcomes. Copy: "All three people contributed the same amount every month. The difference is luck and timing -- not effort."
Military: pension + TSP combined picture.
Full allocation tool link: "Want to understand how your fund allocation affects this?"
Links: TSP funds, Lifecycle funds, MilTax, Fidelity Roth IRA, Bogleheads.

Step 7 (src/screens/Step7GoalsScreen.jsx):
Multi-select cards: home / car / wedding / business / education / leaving the military / other.
Each selected goal: follow-up how much + when. Back-calculate monthly savings needed.
VA loan callout if home selected.
Separation tool if leaving the military selected: show civilian equivalent salary and pension SWR range.
529 nudge if education selected.

Step 8 (src/screens/Step8OptimizeScreen.jsx):
Only renders if napkinScale is Drafting, Building, or Built.
Roth vs Traditional behavioral question.
HSA triple tax advantage if applicable.
Advanced links: Bogleheads wiki, MilTax, IRS Roth limits.

Commit: task-28-steps-5-8

---

## TASK 29 -- Napkin Scale + Score Screen

Create src/utils/napkinScale.js:
function calculateNapkinScale(userData):
- No cushion -> blank
- Has cushion + high-interest debt -> scribbling
- Has cushion + no high-interest debt + no emergency fund -> sketching
- Has emergency fund + not at 15% retirement -> drafting
- Has emergency fund + 15% retirement + goals -> building
- All optimized -> built
Save result to userData.napkinScale.

File: src/screens/ScoreScreen.jsx
Stage name large Playfair Display centered.
Stage description using their specific numbers -- not generic.
One sentence preview of next stage only. Not the full staircase.
"Get my plan" button -> pdfScreen

Commit: task-29-napkin-scale-score

---

## TASK 30 -- PDF + Share Card

File: src/screens/PDFScreen.jsx
Create src/components/PDFDocument.jsx using @react-pdf/renderer.

PDF four pages:
Page 1: date, Napkin Scale stage large, three numbers, household situation
Page 2: complete budget every category, total expenses, breathing room
Page 3: one job right now -- single specific action with their actual numbers and timeline
Page 4: come back when -- three specific return triggers with their actual milestones

Download button: "Download my plan"
Share card: screenshot-friendly summary showing score and one job. Copy button.

Commit: task-30-pdf-output

---

## TASK 31 -- Polish + Deploy

Back button on every screen saves state before going back.
Screen skip logic verified (partnerIncome, payReconstruction2, pension, childcare, step8Optimize).
Progress bar percentage accurate across all screens.
localStorage: save userData on every updateUserData call.
Test every screen at 390px width.
All touch targets minimum 56px.
All currency inputs have inputMode="decimal".
npm run build -- zero errors zero warnings.
git add . && git commit -m "v1.0 complete" && git push origin main
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
