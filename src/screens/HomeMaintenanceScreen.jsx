import BudgetScreen from './BudgetScreen';

const BANDS = [[1, 2], [2, 4], [4, 6], [6, 100]];
const CAP = 800;

export default function HomeMaintenanceScreen({ userData, updateUserData, onNext, onBack }) {
  return (
    <BudgetScreen
      heading="Home maintenance"
      subtext="Repairs, tools, lawn care, filters, random replacements, and the stuff houses always seem to need."
      percentageBands={BANDS}
      binCap={CAP}
      fieldName="homeMaintenance"
      userData={userData}
      updateUserData={updateUserData}
      onNext={() => onNext('budgetHealthInsurance')}
      onBack={onBack}
    />
  );
}
