import BudgetScreen from './BudgetScreen';

const BANDS = [[1, 2], [2, 3], [3, 5], [5, 100]];

export default function PhoneScreen({ userData, updateUserData, onNext, onBack }) {
  return (
    <BudgetScreen
      heading="Phone"
      percentageBands={BANDS}
      fieldName="phone"
      flagAbovePct={5}
      flagCopy="Over $150/month for one line is worth a quick comparison shop."
      userData={userData}
      updateUserData={updateUserData}
      onNext={() => onNext('budgetInternet')}
      onBack={onBack}
    />
  );
}
