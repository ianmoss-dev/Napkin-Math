import BudgetScreen from './BudgetScreen';

const BANDS = [[2, 3], [3, 5], [5, 7], [7, 100]];

export default function ClothingScreen({ userData, updateUserData, onNext, onBack }) {
  return (
    <BudgetScreen
      heading="Clothing & personal care"
      subtext="Clothes, shoes, haircuts, toiletries, cosmetics — bundled."
      percentageBands={BANDS}
      fieldName="clothing"
      userData={userData}
      updateUserData={updateUserData}
      onNext={() => onNext('budgetEntertainment')}
      onBack={onBack}
    />
  );
}
