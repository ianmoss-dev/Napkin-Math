# Napkin Math Flow Map

## Goal

Simplify the opening flow, remove the "Who is this plan for?" screen, and support partner / second-adult income inside a unified income collection model instead of a separate household framing step.

## Recommended Top-Level Flow

```text
Welcome
  -> Income Type (primary user)
    -> Additional Adult Income?
      -> No
        -> Triage
      -> Yes
        -> Additional Adult Income Type
          -> Triage
            -> Income Collection
              -> Budget
                -> Monthly Picture
                  -> First Priority Step
                    -> Remaining Plan Steps
                      -> Score / PDF / Retirement Tools
```

## Proposed Screen Flow

```text
1. welcome
   -> start / restore

2. incomeType
   Question:
   - What best describes your income?
   Options:
   - Regular employer
   - Active duty military
   - Self-employed or variable

3. additionalAdult
   Question:
   - Is there another adult income we should include?
   Options:
   - No, just mine
   - Yes, add another adult income

4. additionalAdultIncomeType
   Only shown if previous answer is yes.
   Question:
   - What best describes the additional adult's income?
   Options:
   - Regular employer
   - Active duty military
   - Self-employed or variable
   - No income

5. triage
   Questions:
   - Do you have an emergency fund?
   - Are you getting your full employer / TSP match?
   - Does the additional adult have a full employer / TSP match?
   - Do you have high-interest debt?

6. income collection
   Route by income type combinations:

   Primary military
     -> payReconstruction1
     -> pension
     -> lesConfirmation

   Primary civilian
     -> lesConfirmation

   Primary self-employed
     -> irregularIncome

   Additional adult military
     -> payReconstruction2
     -> lesConfirmation

   Additional adult civilian
     -> lesConfirmation

   Additional adult self-employed
     -> irregularIncome

   Additional income
     -> handled inside lesConfirmation / irregularIncome as side-income rows

7. budget flow
   -> budgetHousing
   -> budgetUtilities
   -> budgetGroceries
   -> budgetDining
   -> budgetCarPayment
   -> budgetGas
   -> budgetCarInsurance
   -> budgetPhone
   -> budgetInternet
   -> budgetHealthInsurance
   -> budgetMedical
   -> budgetSubscriptions
   -> budgetChildcare (conditional)
   -> budgetDebt
   -> budgetClothing
   -> budgetEntertainment
   -> budgetGiving
   -> budgetGifts
   -> budgetTravel

8. monthly picture
   -> monthlyPicture

9. first priority step
   Route based on triage + actual numbers:
   - no cushion -> step1Cushion
   - no full match -> step2Match
   - high-interest debt -> step3Debt
   - otherwise -> step4EmergencyFund

10. remaining plan steps
   Continue through unresolved priorities:
   -> step1Cushion
   -> step2Match
   -> step3Debt
   -> step4EmergencyFund
   -> step5ModerateDebt
   -> step6Retirement
   -> step7Goals
   -> step8Optimize

11. outputs
   -> scoreScreen
   -> pdfScreen
   -> retirementCalc
```

## Decision Logic

### Opening

```text
welcome
  -> incomeType
    -> additionalAdult
      -> if no: triage
      -> if yes: additionalAdultIncomeType -> triage
```

### Income Routing

```text
triage
  -> if primary military and rank/TIS missing: payReconstruction1
  -> if second adult military and rank/TIS missing: payReconstruction2
  -> if primary military and retirement intent missing: pension
  -> if any regular paycheck missing: lesConfirmation
  -> if any self-employed baseline missing: irregularIncome
  -> budgetHousing
```

### Post-Budget Routing

```text
monthlyPicture
  -> if no real cushion: step1Cushion
  -> else if match not captured: step2Match
  -> else if high-interest debt exists: step3Debt
  -> else: step4EmergencyFund
```

## Screens To Remove From Required Flow

- `household`
- `partnerIncome`
- `prep`
- `spendingPhilosophy`

Notes:
- `prep` could come back later as optional helper copy.
- `spendingPhilosophy` should stay removed unless it changes routing or presentation.

## Screens To Add

- `additionalAdult`
- `additionalAdultIncomeType`

These replace the current household / partner framing with a simpler question:
"Do we need to include another adult income?"

## Data Model Direction

Current model:

- primary user fields live in `incomeType`, `m1*`
- partner fields live in `partnerIncomeType`, `m2*`

Near-term practical approach:

- keep `m1*` and `m2*` internally for now
- rename the UX from "partner" to "additional adult"
- remove the dedicated household identity framing

Later ideal approach:

- replace `m1/m2` hardcoding with an `adults[]` collection
- each adult would have:
  - role label
  - income type
  - military details if needed
  - take-home / variable-income details
  - match status

That would make the app more flexible and much easier to maintain.

## UX Guidance

### What the user should feel

- Fast start
- Immediate relevance
- Less military repetition
- Less "tell us about your household structure"
- More "let's get the money picture right"

### Progress feedback

Use floating encouragement during:

- triage
- pay reconstruction
- LES / income confirmation
- budget sequence

Examples:

- "Good. We're setting the order before we get into the numbers."
- "Nice. You're locking in the income side first."
- "Good pace. You're mapping the biggest spending buckets."
- "You're close. We have almost the full monthly picture."

## Suggested Implementation Order

1. Remove `household` from the opening path.
2. Replace it with `additionalAdult`.
3. Rename partner-facing copy to "additional adult income."
4. Keep existing `m2` logic under the hood so behavior does not regress.
5. After that is stable, decide whether to fully migrate to an `adults[]` model.
