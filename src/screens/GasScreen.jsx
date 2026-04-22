import BudgetScreen from './BudgetScreen';

const BANDS = [[2, 4], [4, 6], [6, 8], [8, 100]];

export default function GasScreen({ userData, updateUserData, onNext, onBack }) {
  return (
    <BudgetScreen
      heading="Gas and fuel"
      percentageBands={BANDS}
      fieldName="gasAndFuel"
      userData={userData}
      updateUserData={updateUserData}
      onNext={() => onNext('budgetCarInsurance')}
      onBack={onBack}
    />
  );
}
