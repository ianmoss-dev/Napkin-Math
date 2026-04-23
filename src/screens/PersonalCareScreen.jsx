import BudgetScreen from './BudgetScreen';

const BANDS = [[1, 2], [2, 4], [4, 6], [6, 100]];
const CAP = 500;

export default function PersonalCareScreen({ userData, updateUserData, onNext, onBack }) {
  return (
    <BudgetScreen
      heading="Personal care"
      subtext="Haircuts, grooming, cosmetics, skincare, and everyday personal upkeep."
      percentageBands={BANDS}
      binCap={CAP}
      fieldName="personalCare"
      userData={userData}
      updateUserData={updateUserData}
      onNext={() => onNext('budgetEntertainment')}
      onBack={onBack}
    />
  );
}
