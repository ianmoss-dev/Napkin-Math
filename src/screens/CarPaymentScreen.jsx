import BudgetScreen from './BudgetScreen';

const BANDS = [[0, 0], [5, 10], [10, 15], [15, 100]];
const OVERRIDES = ['$0 — I own my car', null, null, null];

export default function CarPaymentScreen({ userData, updateUserData, onNext, onBack }) {
  return (
    <BudgetScreen
      heading="Car payment"
      subtext="Your monthly loan or lease payment. Enter $0 if you own outright."
      percentageBands={BANDS}
      binCap={900}
      fieldName="carPayment"
      flagAbovePct={15}
      flagCopy="Car payment above 15% of income is significant. Total car costs ideally stay under 20% combined."
      binOverrides={OVERRIDES}
      userData={userData}
      updateUserData={updateUserData}
      onNext={() => onNext('budgetGas')}
      onBack={onBack}
    />
  );
}
