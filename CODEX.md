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

### Mixed Household Routing Bug

This still needs work.

- Routing currently depends too heavily on primary `incomeType`.
- Mixed households are not handled correctly in several cases:
  - primary `selfEmployed` + partner `military`
  - primary `military` + partner `selfEmployed`
  - likely other mixed partner paths
- `PrepScreen` is also primary-income-only and does not reflect mixed household prep needs.
- `LESConfirmationScreen` does not fully persist partner income fields.

### Self-Employed / Variable Income Bug

This still needs work.

- Self-employed users currently flow into the later steps in a way that can leave `Step2Match` without a meaningful experience.
- The post-budget “solutions” flow should branch more intentionally for users without an employer/TSP match concept.

## Product Direction Ideas

### Triage First

Preferred direction:

- Start with triage instead of self-reported knowledge level.
- Use a short flowchart to determine where the user actually is.
- Then route into the most relevant solution path.

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
- Surface different “what are you most concerned about?” options

Important caution:

- Guide beginner users toward fundamentals first, but do not make the app feel patronizing or overly restrictive.
- Better approach: recommend the right next priority rather than hard-blocking advanced concerns.

### Links

Current view:

- Link density is not extreme per individual screen, but there is too much repetition across the app.
- Some branded links feel closer to endorsements than neutral resources.

Potential cleanup direction:

- Cap most screens at 1-2 links
- Reduce repeated HYSA / military resource links
- Move extra resources into an optional end-of-plan resource section
- Prefer neutral guidance over specific brand recommendations where possible

## Suggested Next Priorities

1. Fix mixed-household routing and data persistence
2. Fix self-employed branching in the post-budget “next steps” flow
3. Redesign opening flow around triage-first logic
4. Reduce / consolidate repeated external links
5. Consider route-level code splitting to reduce bundle size

## Verification Notes

- Current build passes
- Current lint passes
- Bundle is still large and should be revisited later for performance
