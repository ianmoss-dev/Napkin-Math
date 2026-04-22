import BudgetScreen from './BudgetScreen';

const BANDS = [[5, 10], [10, 15], [15, 20], [20, 100]];

export default function ChildcareScreen({ userData, updateUserData, onNext, onBack }) {
  return (
    <BudgetScreen
      heading="Childcare"
      subtext="Monthly childcare costs — daycare, after-school programs, babysitters."
      percentageBands={BANDS}
      binCap={3500}
      fieldName="childcare"
      userData={userData}
      updateUserData={updateUserData}
      onNext={() => onNext('budgetDebt')}
      onBack={onBack}
    />
  );
}
