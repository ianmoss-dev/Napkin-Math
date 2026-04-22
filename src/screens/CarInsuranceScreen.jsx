import BudgetScreen from './BudgetScreen';

const BANDS = [[1, 3], [3, 5], [5, 7], [7, 100]];

export default function CarInsuranceScreen({ userData, updateUserData, onNext, onBack }) {
  return (
    <BudgetScreen
      heading="Car insurance"
      subtext="Divide annual premium by 12 if you pay yearly."
      percentageBands={BANDS}
      binCap={600}
      fieldName="carInsurance"
      userData={userData}
      updateUserData={updateUserData}
      onNext={() => onNext('budgetPhone')}
      onBack={onBack}
    />
  );
}
