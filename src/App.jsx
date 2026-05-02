import { useEffect, useRef, useState } from 'react';
import { generateSaveCode } from './utils/saveCode';
import ProgressBar from './components/ProgressBar';
import WelcomeScreen from './screens/WelcomeScreen';
import ChecklistScreen from './screens/ChecklistScreen';
import HouseholdScreen from './screens/HouseholdScreen';
import PartnerIncomeScreen from './screens/PartnerIncomeScreen';
import IncomeTypeScreen from './screens/IncomeTypeScreen';
import PayInputScreen from './screens/PayInputScreen';
import HousingScreen from './screens/HousingScreen';
import UtilitiesScreen from './screens/UtilitiesScreen';
import GroceriesScreen from './screens/GroceriesScreen';
import HouseholdEssentialsScreen from './screens/HouseholdEssentialsScreen';
import DiningOutScreen from './screens/DiningOutScreen';
import CarPaymentScreen from './screens/CarPaymentScreen';
import CarMaintenanceScreen from './screens/CarMaintenanceScreen';
import CarInsuranceScreen from './screens/CarInsuranceScreen';
import PhoneScreen from './screens/PhoneScreen';
import InternetScreen from './screens/InternetScreen';
import HomeMaintenanceScreen from './screens/HomeMaintenanceScreen';
import HealthInsuranceScreen from './screens/HealthInsuranceScreen';
import MedicalScreen from './screens/MedicalScreen';
import SubscriptionsScreen from './screens/SubscriptionsScreen';
import ChildcareScreen from './screens/ChildcareScreen';
import DebtScreen from './screens/DebtScreen';
import ClothingScreen from './screens/ClothingScreen';
import PersonalCareScreen from './screens/PersonalCareScreen';
import EntertainmentScreen from './screens/EntertainmentScreen';
import PetsScreen from './screens/PetsScreen';
import TravelScreen from './screens/TravelScreen';
import GiftsScreen from './screens/GiftsScreen';
import GivingScreen from './screens/GivingScreen';
import MonthlyPictureScreen from './screens/MonthlyPictureScreen';
import EmergencyFundTargetScreen from './screens/EmergencyFundTargetScreen';
import RecommendationSummaryScreen from './screens/RecommendationSummaryScreen';

const STORAGE_KEY = 'napkin-math-v1';

const VALID_SCREENS = new Set([
  'welcome',
  'checklist',
  'household',
  'partnerIncome',
  'incomeType',
  'payInput',
  'budgetHousing',
  'budgetUtilities',
  'budgetGroceries',
  'budgetHouseholdEssentials',
  'budgetDining',
  'budgetCarPayment',
  'budgetGas',
  'budgetCarInsurance',
  'budgetPhone',
  'budgetInternet',
  'budgetHomeMaintenance',
  'budgetHealthInsurance',
  'budgetMedical',
  'budgetSubscriptions',
  'budgetChildcare',
  'budgetDebt',
  'budgetClothing',
  'budgetPersonalCare',
  'budgetEntertainment',
  'budgetPets',
  'budgetTravel',
  'budgetGifts',
  'budgetGiving',
  'monthlyPicture',
  'emergencyFundTarget',
  'recommendationSummary',
]);

const initialUserData = {
  householdType: null,
  partnerIncomeType: null,
  incomeType: null,
  isDualMilitary: false,

  emergencyReady: null,
  fullMatchStatus: null,
  checklistDebtType: 'none',
  checklistDebtBalance: 0,
  checklistDebtRate: 0,
  checklistDebtRateEstimated: false,
  retirementSavingsMonthly: 0,
  savingMoreRetirement: null,
  savingOtherGoals: null,

  m1Rank: null, m1TIS: null, m1ZIP: null, m1Dependents: false,
  m1IsOCONUS: false, m1OHARental: 0, m1OHAUtility: 0, m1COLA: 0,
  m1BasePay: 0, m1BAH: 0, m1BAS: 0, m1TaxAdvantage: 0,
  m1RMC: 0, m1RMCAnnual: 0, m1MidMonth: 0, m1EndOfMonth: 0, m1TakeHome: 0,
  m1SpecialPays: { staticLine: false, halo: false, aviation: false, dive: false, demo: false, hostileFire: false, flpb: 0, custom: [] },

  m2Rank: null, m2TIS: null, m2ZIP: null, m2Dependents: false,
  m2IsOCONUS: false, m2OHARental: 0, m2OHAUtility: 0, m2COLA: 0,
  m2BasePay: 0, m2BAH: 0, m2BAS: 0, m2TaxAdvantage: 0,
  m2RMC: 0, m2RMCAnnual: 0, m2MidMonth: 0, m2EndOfMonth: 0, m2TakeHome: 0,
  m2SpecialPays: { staticLine: false, halo: false, aviation: false, dive: false, demo: false, hostileFire: false, flpb: 0, custom: [] },

  retirementIntent: null,
  retirementRank: null,
  retirementTIS: 20,
  monthlyPension: 0,
  annualPension: 0,
  pensionSWRLow: 0,
  pensionSWRHigh: 0,

  monthlyTakeHome: 0,
  additionalIncome: [],
  goodMonth: 0,
  typicalMonth: 0,
  toughMonth: 0,
  p2GoodMonth: 0,
  p2TypicalMonth: 0,
  p2ToughMonth: 0,

  housing: null,
  housingType: null,
  utilities: null,
  groceries: null,
  householdEssentials: null,
  diningOut: null,
  carPayment: null,
  gasAndFuel: null,
  carInsurance: null,
  phone: null,
  internet: null,
  homeMaintenance: null,
  healthInsurance: null,
  outOfPocketMedical: null,
  hasHSA: null,
  subscriptions: [],
  hasKids: null,
  childcare: null,
  kidExpenses: null,
  debts: [],
  clothing: null,
  personalCare: null,
  entertainment: null,
  pets: null,
  travel: null,
  gifts: null,
  giving: null,

  totalMonthlyExpenses: 0,
  breathingRoom: 0,
  emergencyFundTargetMonths: 0,
  emergencyFundTargetAmount: 0,
};

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !VALID_SCREENS.has(parsed.currentScreen)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function getFlowScreens(userData) {
  const screens = ['checklist', 'household'];

  if (userData.householdType === 'partner') {
    screens.push('partnerIncome');
  }

  screens.push(
    'incomeType',
    'payInput',
    'budgetHousing',
    'budgetUtilities',
    'budgetGroceries',
    'budgetHouseholdEssentials',
    'budgetDining',
    'budgetCarPayment',
    'budgetGas',
    'budgetCarInsurance',
    'budgetPhone',
    'budgetInternet',
    'budgetHomeMaintenance',
    'budgetHealthInsurance',
    'budgetMedical',
    'budgetSubscriptions',
    'budgetChildcare',
    'budgetDebt',
    'budgetClothing',
    'budgetPersonalCare',
    'budgetEntertainment',
    'budgetPets',
    'budgetTravel',
    'budgetGifts',
    'budgetGiving',
    'monthlyPicture',
    'emergencyFundTarget',
    'recommendationSummary'
  );

  return screens;
}

function App() {
  const saved = loadSaved();
  const [currentScreen, setCurrentScreen] = useState(saved?.currentScreen || 'welcome');
  const [history, setHistory] = useState(saved?.history || ['welcome']);
  const [userData, setUserData] = useState({ ...initialUserData, ...(saved?.userData || {}) });
  const hydratedRef = useRef(false);

  const save = (nextUserData, nextScreen, nextHistory) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          userData: nextUserData,
          currentScreen: nextScreen,
          history: nextHistory,
        })
      );
    } catch {
      // Ignore storage failures and continue in-memory.
    }
  };

  useEffect(() => {
    hydratedRef.current = true;
  }, []);

  const applyNavigation = (screen, nextHistory, nextUserData = userData) => {
    setHistory(nextHistory);
    setCurrentScreen(screen);
    save(nextUserData, screen, nextHistory);
  };

  const updateUserData = (updates) => {
    setUserData((prev) => {
      const next = { ...prev, ...updates };
      if (hydratedRef.current) {
        save(next, currentScreen, history);
      }
      return next;
    });
  };

  const navigate = (screen) => {
    const nextHistory = [...history, screen];
    applyNavigation(screen, nextHistory);
  };

  const goBack = () => {
    if (history.length <= 1) {
      return;
    }

    const nextHistory = history.slice(0, -1);
    const previousScreen = nextHistory[nextHistory.length - 1];
    applyNavigation(previousScreen, nextHistory);
  };

  const startFresh = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage failures and continue with a fresh in-memory session.
    }

    const nextUserData = { ...initialUserData };
    const nextHistory = ['welcome', 'checklist'];
    setUserData(nextUserData);
    applyNavigation('checklist', nextHistory, nextUserData);
  };

  const resumeSaved = () => {
    const savedState = loadSaved();
    if (!savedState) {
      startFresh();
      return;
    }

    setUserData({ ...initialUserData, ...(savedState.userData || {}) });
    applyNavigation(savedState.currentScreen, savedState.history || ['welcome', savedState.currentScreen], {
      ...initialUserData,
      ...(savedState.userData || {}),
    });
  };

  const restoreCode = (decoded) => {
    const nextUserData = { ...initialUserData, ...decoded };
    const screen = decoded.monthlyTakeHome ? 'monthlyPicture' : 'checklist';
    const nextHistory = ['welcome', screen];
    setUserData(nextUserData);
    applyNavigation(screen, nextHistory, nextUserData);
  };

  const flowScreens = getFlowScreens(userData);
  const progressIndex = flowScreens.indexOf(currentScreen);
  const progressPct = currentScreen === 'welcome' || progressIndex === -1
    ? 0
    : Math.round(((progressIndex + 1) / flowScreens.length) * 100);

  const showProgress = currentScreen !== 'welcome';
  const saveCode = generateSaveCode(userData);
  const props = {
    userData,
    updateUserData,
    onNext: navigate,
    onBack: goBack,
    onStartFresh: startFresh,
    saveCode,
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen {...props} onRestoreCode={restoreCode} onResumeSaved={resumeSaved} />;
      case 'checklist':
        return <ChecklistScreen {...props} />;
      case 'household':
        return <HouseholdScreen {...props} />;
      case 'partnerIncome':
        return <PartnerIncomeScreen {...props} />;
      case 'incomeType':
        return <IncomeTypeScreen {...props} />;
      case 'payInput':
        return <PayInputScreen {...props} />;
      case 'budgetHousing':
        return <HousingScreen {...props} />;
      case 'budgetUtilities':
        return <UtilitiesScreen {...props} />;
      case 'budgetGroceries':
        return <GroceriesScreen {...props} />;
      case 'budgetHouseholdEssentials':
        return <HouseholdEssentialsScreen {...props} />;
      case 'budgetDining':
        return <DiningOutScreen {...props} />;
      case 'budgetCarPayment':
        return <CarPaymentScreen {...props} />;
      case 'budgetGas':
        return <CarMaintenanceScreen {...props} />;
      case 'budgetCarInsurance':
        return <CarInsuranceScreen {...props} />;
      case 'budgetPhone':
        return <PhoneScreen {...props} />;
      case 'budgetInternet':
        return <InternetScreen {...props} />;
      case 'budgetHomeMaintenance':
        return <HomeMaintenanceScreen {...props} />;
      case 'budgetHealthInsurance':
        return <HealthInsuranceScreen {...props} />;
      case 'budgetMedical':
        return <MedicalScreen {...props} />;
      case 'budgetSubscriptions':
        return <SubscriptionsScreen {...props} />;
      case 'budgetChildcare':
        return <ChildcareScreen {...props} />;
      case 'budgetDebt':
        return <DebtScreen {...props} />;
      case 'budgetClothing':
        return <ClothingScreen {...props} />;
      case 'budgetPersonalCare':
        return <PersonalCareScreen {...props} />;
      case 'budgetEntertainment':
        return <EntertainmentScreen {...props} />;
      case 'budgetPets':
        return <PetsScreen {...props} />;
      case 'budgetTravel':
        return <TravelScreen {...props} />;
      case 'budgetGifts':
        return <GiftsScreen {...props} />;
      case 'budgetGiving':
        return <GivingScreen {...props} />;
      case 'monthlyPicture':
        return <MonthlyPictureScreen {...props} />;
      case 'emergencyFundTarget':
        return <EmergencyFundTargetScreen {...props} />;
      case 'recommendationSummary':
        return <RecommendationSummaryScreen {...props} />;
      default:
        return <ChecklistScreen {...props} />;
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
