# Napkin Math Codex Notes

## Purpose

This file tracks implementation changes, UX findings, and product-direction ideas discussed during Codex sessions so they do not get lost between edits.

## Recent Changes

- Cleaned up core navigation and state flow in `src/App.jsx`.
- Fixed `startFresh()` so it truly resets session state instead of reusing stale history.
- Improved progress calculation so it is based on the intended flow rather than raw history depth.
- Fixed back navigation to skip transient screens like `transition`, which was trapping users after the budget flow.
- Added `Start over` actions on end-state screens:
  - `src/screens/ScoreScreen.jsx`
  - `src/screens/PDFScreen.jsx`
  - `src/screens/RetirementCalculatorScreen.jsx`
- Removed the required `knowledge` screen from the active opening flow.
  - Active start is now `welcome -> household`
  - Restore fallback now lands in `household` instead of `knowledge`
- Cleaned up lint issues and render/state problems across key screens and components.
- Fixed mixed-household income routing so military, civilian, and self-employed combinations no longer depend only on the primary user.
- Fixed self-employed branching in the post-budget steps so households without a match path do not get stranded in `step2Match`.
- Replaced branded HYSA links with broader resources in:
  - `src/screens/Step1CushionScreen.jsx`
  - `src/screens/Step4EmergencyFundScreen.jsx`
- Added a triage-first intake step for:
  - emergency fund
  - employer / TSP match
  - high-interest debt
- Removed `prep` and `spendingPhilosophy` from the required opening flow.
- Added floating in-app progress feedback during triage, income collection, and budgeting.
- Updated the post-budget handoff so users land on their first priority step instead of always starting at `step1Cushion`.
- Expanded the budget flow with visible buckets for:
  - household essentials
  - home maintenance
  - personal care
  - pets
  - kid expenses behind a `hasKids` gate
- Reordered the back half of the budget flow so `travel` comes after `entertainment`, and `giving` comes last.
- Verified current repo state with:
  - `npm run lint`
  - `npm run build`

## Confirmed UX / Logic Findings

### Navigation

- The old post-budget trap came from `transition` being treated like a normal history entry.
- That issue is now fixed by skipping transient screens during back navigation.

### Knowledge Selector

- `knowledgeLevel` was being collected but not used to affect routing, copy, or recommendations.
- It currently remains in code/storage, but it is no longer part of the required user flow.

### Household-Aware Routing

- Mixed-household routing is now household-aware in the income collection flow and the post-budget steps.
- Partner military take-home data is now persisted through `LESConfirmationScreen`.
- Remaining weakness:
  - `PrepScreen` still reads as primary-income-centric and should eventually adapt its checklist to mixed households.

## Product Direction Ideas

### Triage First

Preferred direction:

- Start with triage instead of self-reported knowledge level.
- Use a short flowchart to determine where the user actually is.
- Then route into the most relevant solution path.
- This is now the active opening direction in the app.

Example early triage questions:

- Do you have $1,000 you never touch?
- Do you have high-interest debt?
- Are you getting your full match?
- Is month-to-month cash flow tight?
- Do you have a near-term goal that matters more than optimization?

### Flow Shape

Likely better structure:

1. Quick intake
   household, income type(s), military/variable flags
2. Triage
   identify the most important financial priority
3. Guided branch
   budget/cash-flow, debt cleanup, match, emergency fund, or optimization

### Knowledge Level

Current recommendation:

- Keep it out of the required opening flow until it has a real job.

Possible future use:

- Adjust tone and explanation depth
- Personalize concern selectors
- Surface different "what are you most concerned about?" options

Important caution:

- Guide beginner users toward fundamentals first, but do not make the app feel patronizing or overly restrictive.
- Better approach: recommend the right next priority rather than hard-blocking advanced concerns.

### Links

Current view:

- Link density is not extreme per individual screen, but there is too much repetition across the app.
- HYSA links have been shifted away from Goldman Sachs / Ally style brand recommendations toward broader resources.
- Some later screens still have more links than they need and could eventually be consolidated into a lighter resource pattern.

Potential cleanup direction:

- Cap most screens at 1-2 links
- Reduce repeated HYSA / military resource links
- Move extra resources into an optional end-of-plan resource section
- Prefer neutral guidance over specific brand recommendations where possible

## Suggested Next Priorities

1. Redesign opening flow around triage-first logic
2. Decouple early triage from the current budget-derived `step1..step8` recommendation chain
3. Reduce / consolidate repeated external links across later plan screens
4. Rework `PrepScreen` so mixed households get a more accurate setup checklist
5. Consider route-level code splitting to reduce bundle size

## Verification Notes

- Current build passes
- Current lint passes
- Bundle is still large and should be revisited later for performance
