import BudgetScreen from './BudgetScreen';

const FIXED_BINS = [
  { label: '$30 – $60/mo', value: 45 },
  { label: '$60 – $90/mo', value: 75 },
  { label: '$90 – $120/mo', value: 105 },
  { label: '$120 – $150+/mo', value: 140 },
];

export default function InternetScreen({ userData, updateUserData, onNext, onBack }) {
  return (
    <BudgetScreen
      heading="Internet"
      fixedBins={FIXED_BINS}
      fieldName="internet"
      userData={userData}
      updateUserData={updateUserData}
      onNext={() => onNext('budgetHealthInsurance')}
      onBack={onBack}
    />
  );
}
