import BudgetScreen from './BudgetScreen';

const BANDS = [[1, 2], [2, 3], [3, 100]];

export default function InternetScreen({ userData, updateUserData, onNext, onBack }) {
  return (
    <BudgetScreen
      heading="Internet"
      percentageBands={BANDS}
      fieldName="internet"
      userData={userData}
      updateUserData={updateUserData}
      onNext={() => onNext('budgetHealthInsurance')}
      onBack={onBack}
    />
  );
}
