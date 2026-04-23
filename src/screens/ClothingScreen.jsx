import BudgetScreen from './BudgetScreen';

const BANDS = [[2, 3], [3, 5], [5, 7], [7, 100]];
const CAP = 500;

export default function ClothingScreen({ userData, updateUserData, onNext, onBack }) {
  return (
    <BudgetScreen
      heading="Clothing"
      subtext="Clothes, shoes, uniforms, seasonal basics, and replacements."
      percentageBands={BANDS}
      binCap={CAP}
      fieldName="clothing"
      userData={userData}
      updateUserData={updateUserData}
      onNext={() => onNext('budgetPersonalCare')}
      onBack={onBack}
    />
  );
}
