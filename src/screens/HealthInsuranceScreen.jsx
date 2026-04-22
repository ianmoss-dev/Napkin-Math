import BudgetScreen from './BudgetScreen';

const BANDS = [[0, 0], [2, 5], [5, 8], [8, 100]];
const OVERRIDES = ['$0 — covered or free', null, null, null];

export default function HealthInsuranceScreen({ userData, updateUserData, onNext, onBack }) {
  return (
    <BudgetScreen
      heading="Health insurance"
      subtext="What you personally pay out of pocket. Active duty: your Tricare is free — this is likely $0."
      percentageBands={BANDS}
      fieldName="healthInsurance"
      binOverrides={OVERRIDES}
      userData={userData}
      updateUserData={updateUserData}
      onNext={() => onNext('budgetMedical')}
      onBack={onBack}
    />
  );
}
