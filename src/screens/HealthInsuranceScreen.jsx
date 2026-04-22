import BudgetScreen from './BudgetScreen';

const FIXED_BINS = [
  { label: '$0 — covered or free', value: 0 },
  { label: '$50 – $200/mo', value: 125 },
  { label: '$200 – $400/mo', value: 300 },
  { label: '$400 – $700+/mo', value: 550 },
];

export default function HealthInsuranceScreen({ userData, updateUserData, onNext, onBack }) {
  return (
    <BudgetScreen
      heading="Health insurance"
      subtext="What you personally pay each month. Active duty: Tricare is free — this is likely $0."
      fixedBins={FIXED_BINS}
      fieldName="healthInsurance"
      userData={userData}
      updateUserData={updateUserData}
      onNext={() => onNext('budgetMedical')}
      onBack={onBack}
    />
  );
}
