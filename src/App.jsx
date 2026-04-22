import { useState } from 'react';
import ProgressBar from './components/ProgressBar';
import WelcomeScreen from './screens/WelcomeScreen';
import KnowledgeScreen from './screens/KnowledgeScreen';
import HouseholdScreen from './screens/HouseholdScreen';
import PartnerIncomeScreen from './screens/PartnerIncomeScreen';
import IncomeTypeScreen from './screens/IncomeTypeScreen';
import SpendingPhilosophyScreen from './screens/SpendingPhilosophyScreen';
import PayReconstructionScreen from './screens/PayReconstructionScreen';
import PensionScreen from './screens/PensionScreen';
import LESConfirmationScreen from './screens/LESConfirmationScreen';
import IrregularIncomeScreen from './screens/IrregularIncomeScreen';
import HousingScreen from './screens/HousingScreen';
import UtilitiesScreen from './screens/UtilitiesScreen';
import GroceriesScreen from './screens/GroceriesScreen';
import DiningOutScreen from './screens/DiningOutScreen';
import CarPaymentScreen from './screens/CarPaymentScreen';
import GasScreen from './screens/GasScreen';
import CarInsuranceScreen from './screens/CarInsuranceScreen';
import PhoneScreen from './screens/PhoneScreen';
import InternetScreen from './screens/InternetScreen';
import HealthInsuranceScreen from './screens/HealthInsuranceScreen';
import MedicalScreen from './screens/MedicalScreen';
import SubscriptionsScreen from './screens/SubscriptionsScreen';
import ChildcareScreen from './screens/ChildcareScreen';
import DebtScreen from './screens/DebtScreen';
import ClothingScreen from './screens/ClothingScreen';
import EntertainmentScreen from './screens/EntertainmentScreen';
import GivingScreen from './screens/GivingScreen';
import TransitionScreen from './screens/TransitionScreen';
import MonthlyPictureScreen from './screens/MonthlyPictureScreen';
import Step1CushionScreen from './screens/Step1CushionScreen';
import Step2MatchScreen from './screens/Step2MatchScreen';
import Step3DebtScreen from './screens/Step3DebtScreen';
import Step4EmergencyFundScreen from './screens/Step4EmergencyFundScreen';
import Step5ModerateDebtScreen from './screens/Step5ModerateDebtScreen';
import Step6RetirementScreen from './screens/Step6RetirementScreen';
import Step7GoalsScreen from './screens/Step7GoalsScreen';
import Step8OptimizeScreen from './screens/Step8OptimizeScreen';
import ScoreScreen from './screens/ScoreScreen';
import PDFScreen from './screens/PDFScreen';

const STORAGE_KEY = 'napkin-math-v1';

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

const ALL_SCREENS = [
  'welcome', 'knowledge', 'household', 'partnerIncome',
  'incomeType', 'spendingPhilosophy',
  'payReconstruction1', 'payReconstruction2', 'pension',
  'lesConfirmation', 'irregularIncome',
  'budgetHousing', 'budgetUtilities', 'budgetGroceries', 'budgetDining',
  'budgetCarPayment', 'budgetGas', 'budgetCarInsurance',
  'budgetPhone', 'budgetInternet', 'budgetHealthInsurance', 'budgetMedical',
  'budgetSubscriptions', 'budgetChildcare',
  'budgetDebt', 'budgetClothing', 'budgetEntertainment', 'budgetGiving',
  'transition', 'monthlyPicture',
  'step1Cushion', 'step2Match', 'step3Debt', 'step4EmergencyFund',
  'step5ModerateDebt', 'step6Retirement', 'step7Goals', 'step8Optimize',
  'scoreScreen', 'pdfScreen',
];

const initialUserData = {
  // Intake
  knowledgeLevel: null,
  householdType: null,
  partnerIncomeType: null,
  incomeType: null,
  isDualMilitary: false,
  spendingPhilosophy: null,

  // Member 1 Military Pay
  m1Rank: null, m1TIS: null, m1ZIP: null, m1Dependents: false,
  m1IsOCONUS: false, m1OHARental: 0, m1OHAUtility: 0, m1COLA: 0,
  m1BasePay: 0, m1BAH: 0, m1BAS: 0, m1TaxAdvantage: 0,
  m1RMC: 0, m1RMCAnnual: 0, m1MidMonth: 0, m1EndOfMonth: 0, m1TakeHome: 0,
  m1SpecialPays: { staticLine: false, halo: false, aviation: false, dive: false, demo: false, hostileFire: false, flpb: 0, custom: [] },

  // Member 2 Military Pay (dual only)
  m2Rank: null, m2TIS: null, m2ZIP: null, m2Dependents: false,
  m2IsOCONUS: false, m2OHARental: 0, m2OHAUtility: 0, m2COLA: 0,
  m2BasePay: 0, m2BAH: 0, m2BAS: 0, m2TaxAdvantage: 0,
  m2RMC: 0, m2RMCAnnual: 0, m2MidMonth: 0, m2EndOfMonth: 0, m2TakeHome: 0,
  m2SpecialPays: { staticLine: false, halo: false, aviation: false, dive: false, demo: false, hostileFire: false, flpb: 0, custom: [] },

  // Pension
  retirementIntent: null,
  retirementRank: null, retirementTIS: 20,
  monthlyPension: 0, annualPension: 0, pensionSWRLow: 0, pensionSWRHigh: 0,

  // Income
  monthlyTakeHome: 0,
  additionalIncome: [],
  goodMonth: 0, typicalMonth: 0, toughMonth: 0,
  p2GoodMonth: 0, p2TypicalMonth: 0, p2ToughMonth: 0,

  // Budget
  housing: null, utilities: null, groceries: null, diningOut: null,
  carPayment: null, gasAndFuel: null, carInsurance: null, phone: null,
  internet: null, healthInsurance: null, outOfPocketMedical: null,
  hasHSA: null, subscriptions: [], childcare: null,
  debts: [],
  clothing: null, entertainment: null, giving: null,

  // Computed
  totalMonthlyExpenses: 0, breathingRoom: 0, napkinScale: null,

  // Step answers
  hasCushion: null, capturingMatch: null, tspContributionPct: 0,
  emergencyFundMonths: null, goals: [],
};

function App() {
  const saved = loadSaved();
  const [currentScreen, setCurrentScreen] = useState(saved?.currentScreen || 'welcome');
  const [history, setHistory] = useState(saved?.history || ['welcome']);
  const [userData, setUserData] = useState({ ...initialUserData, ...(saved?.userData || {}) });

  const save = (ud, screen, hist) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ userData: ud, currentScreen: screen, history: hist }));
    } catch {}
  };

  const updateUserData = (updates) => {
    setUserData(prev => {
      const next = { ...prev, ...updates };
      save(next, currentScreen, history);
      return next;
    });
  };

  const navigate = (screen) => {
    const newHistory = [...history, screen];
    setHistory(newHistory);
    setCurrentScreen(screen);
    save(userData, screen, newHistory);
  };

  const goBack = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      const prev = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      setCurrentScreen(prev);
      save(userData, prev, newHistory);
    }
  };

  const startFresh = () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    setUserData(initialUserData);
    setHistory(['welcome']);
    navigate('knowledge');
  };

  // Progress: use history depth as proxy for actual completion
  const ESTIMATED_TOTAL = 32;
  const progressPct = currentScreen === 'welcome' ? 0
    : Math.min(99, Math.round((history.length / ESTIMATED_TOTAL) * 100));

  const showProgress = currentScreen !== 'welcome';
  const props = { userData, updateUserData, onNext: navigate, onBack: goBack, onStartFresh: startFresh };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':    return <WelcomeScreen {...props} />;
      case 'knowledge':       return <KnowledgeScreen {...props} />;
      case 'household':      return <HouseholdScreen {...props} />;
      case 'partnerIncome':  return <PartnerIncomeScreen {...props} />;
      case 'incomeType':     return <IncomeTypeScreen {...props} />;
      case 'spendingPhilosophy':   return <SpendingPhilosophyScreen {...props} />;
      case 'payReconstruction1':   return <PayReconstructionScreen {...props} memberNumber={1} />;
      case 'payReconstruction2':   return <PayReconstructionScreen {...props} memberNumber={2} />;
      case 'pension':              return <PensionScreen {...props} />;
      case 'lesConfirmation':      return <LESConfirmationScreen {...props} />;
      case 'irregularIncome':      return <IrregularIncomeScreen {...props} />;
      case 'budgetHousing':        return <HousingScreen {...props} />;
      case 'budgetUtilities':      return <UtilitiesScreen {...props} />;
      case 'budgetGroceries':      return <GroceriesScreen {...props} />;
      case 'budgetDining':         return <DiningOutScreen {...props} />;
      case 'budgetCarPayment':     return <CarPaymentScreen {...props} />;
      case 'budgetGas':            return <GasScreen {...props} />;
      case 'budgetCarInsurance':   return <CarInsuranceScreen {...props} />;
      case 'budgetPhone':          return <PhoneScreen {...props} />;
      case 'budgetInternet':       return <InternetScreen {...props} />;
      case 'budgetHealthInsurance': return <HealthInsuranceScreen {...props} />;
      case 'budgetMedical':        return <MedicalScreen {...props} />;
      case 'budgetSubscriptions':  return <SubscriptionsScreen {...props} />;
      case 'budgetChildcare':      return <ChildcareScreen {...props} />;
      case 'budgetDebt':           return <DebtScreen {...props} />;
      case 'budgetClothing':       return <ClothingScreen {...props} />;
      case 'budgetEntertainment':  return <EntertainmentScreen {...props} />;
      case 'budgetGiving':         return <GivingScreen {...props} />;
      case 'transition':           return <TransitionScreen {...props} />;
      case 'monthlyPicture':       return <MonthlyPictureScreen {...props} />;
      case 'step1Cushion':         return <Step1CushionScreen {...props} />;
      case 'step2Match':           return <Step2MatchScreen {...props} />;
      case 'step3Debt':            return <Step3DebtScreen {...props} />;
      case 'step4EmergencyFund':   return <Step4EmergencyFundScreen {...props} />;
      case 'step5ModerateDebt':    return <Step5ModerateDebtScreen {...props} />;
      case 'step6Retirement':      return <Step6RetirementScreen {...props} />;
      case 'step7Goals':           return <Step7GoalsScreen {...props} />;
      case 'step8Optimize':        return <Step8OptimizeScreen {...props} />;
      case 'scoreScreen':          return <ScoreScreen {...props} />;
      case 'pdfScreen':            return <PDFScreen {...props} />;
      default:
        return (
          <div style={{ padding: '80px 24px 24px', color: 'var(--gray)', fontFamily: 'DM Sans, sans-serif' }}>
            Coming soon: {currentScreen}
          </div>
        );
    }
  };

  return (
    <>
      {showProgress && <ProgressBar pct={progressPct} />}
      {renderScreen()}
    </>
  );
}

export default App;
