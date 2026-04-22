import BudgetScreen from './BudgetScreen';

const BANDS = [[3, 5], [5, 8], [8, 12], [12, 100]];

export default function UtilitiesScreen({ userData, updateUserData, onNext, onBack }) {
  return (
    <BudgetScreen
      heading="Utilities"
      subtext="Electric, gas, water, and trash — bundled together."
      percentageBands={BANDS}
      binCap={450}
      fieldName="utilities"
      userData={userData}
      updateUserData={updateUserData}
      onNext={() => onNext('budgetGroceries')}
      onBack={onBack}
    />
  );
}
