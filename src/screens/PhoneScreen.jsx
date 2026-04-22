import BudgetScreen from './BudgetScreen';

const FIXED_BINS = [
  { label: '$30 – $60/mo', value: 45 },
  { label: '$60 – $90/mo', value: 75 },
  { label: '$90 – $120/mo', value: 105 },
  { label: '$120 – $150+/mo', value: 140 },
];

export default function PhoneScreen({ userData, updateUserData, onNext, onBack }) {
  return (
    <BudgetScreen
      heading="Phone plan"
      subtext="Your monthly wireless bill — or your share if on a family plan."
      fixedBins={FIXED_BINS}
      fieldName="phone"
      userData={userData}
      updateUserData={updateUserData}
      onNext={() => onNext('budgetInternet')}
      onBack={onBack}
    />
  );
}
