import BudgetScreen from './BudgetScreen';

const BANDS = [[2, 4], [4, 6], [6, 8], [8, 100]];

export default function EntertainmentScreen({ userData, updateUserData, onNext, onBack }) {
  return (
    <BudgetScreen
      heading="Entertainment & hobbies"
      subtext="Events, hobbies, sports, concerts, pets."
      percentageBands={BANDS}
      fieldName="entertainment"
      userData={userData}
      updateUserData={updateUserData}
      onNext={() => onNext('budgetGiving')}
      onBack={onBack}
    />
  );
}
