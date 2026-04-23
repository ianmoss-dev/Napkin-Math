import BudgetScreen from './BudgetScreen';

const BANDS = [[2, 4], [4, 6], [6, 8], [8, 100]];
const CAP = 600;

export default function HouseholdEssentialsScreen({ userData, updateUserData, onNext, onBack }) {
  return (
    <BudgetScreen
      heading="Household essentials"
      subtext="Toiletries, paper products, cleaning supplies, and all the not-fun stuff you still buy."
      percentageBands={BANDS}
      binCap={CAP}
      fieldName="householdEssentials"
      userData={userData}
      updateUserData={updateUserData}
      onNext={() => onNext('budgetDining')}
      onBack={onBack}
    />
  );
}
