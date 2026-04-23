import BudgetScreen from './BudgetScreen';

const BANDS = [[1, 2], [2, 4], [4, 6], [6, 100]];
const CAP = 700;

export default function PetsScreen({ userData, updateUserData, onNext, onBack }) {
  return (
    <BudgetScreen
      heading="Pets"
      subtext="Food, meds, vet visits, grooming, boarding, and all the ways they quietly run your life."
      percentageBands={BANDS}
      binCap={CAP}
      fieldName="pets"
      userData={userData}
      updateUserData={updateUserData}
      onNext={() => onNext('budgetTravel')}
      onBack={onBack}
    />
  );
}
