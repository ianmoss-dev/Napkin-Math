import BudgetScreen from './BudgetScreen';

const BANDS = [[5, 8], [8, 12], [12, 15], [15, 100]];

export default function GroceriesScreen({ userData, updateUserData, onNext, onBack }) {
  return (
    <BudgetScreen
      heading="Groceries"
      subtext="In-home food only — we'll ask about restaurants separately."
      percentageBands={BANDS}
      binCap={1200}
      fieldName="groceries"
      groceryMode
      userData={userData}
      updateUserData={updateUserData}
      onNext={() => onNext('budgetHouseholdEssentials')}
      onBack={onBack}
    />
  );
}
