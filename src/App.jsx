import { useState, useEffect, useRef } from 'react';
import { generateSaveCode } from './utils/saveCode';
import ProgressBar from './components/ProgressBar';
import FlowFeedback from './components/FlowFeedback';
import WelcomeScreen from './screens/WelcomeScreen';
import HouseholdScreen from './screens/HouseholdScreen';
import PartnerIncomeScreen from './screens/PartnerIncomeScreen';
import IncomeTypeScreen from './screens/IncomeTypeScreen';
import TriageScreen from './screens/TriageScreen';
import PayReconstructionScreen from './screens/PayReconstructionScreen';
import PensionScreen from './screens/PensionScreen';
import LESConfirmationScreen from './screens/LESConfirmationScreen';
import IrregularIncomeScreen from './screens/IrregularIncomeScreen';
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
import GiftsScreen from './screens/GiftsScreen';
import TravelScreen from './screens/TravelScreen';
import ScoreScreen from './screens/ScoreScreen';
import PDFScreen from './screens/PDFScreen';
import RetirementCalculatorScreen from './screens/RetirementCalculatorScreen';

const STORAGE_KEY = 'napkin-math-v1';

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const ALL_SCREENS = [
  'welcome', 'household', 'partnerIncome',
  'incomeType', 'triage',
  'payReconstruction1', 'payReconstruction2', 'pension',
  'lesConfirmation', 'irregularIncome',
  'budgetHousing', 'budgetUtilities', 'budgetGroceries', 'budgetHouseholdEssentials', 'budgetDining',
  'budgetCarPayment', 'budgetGas', 'budgetCarInsurance',
  'budgetPhone', 'budgetInternet', 'budgetHomeMaintenance', 'budgetHealthInsurance', 'budgetMedical',
  'budgetSubscriptions', 'budgetChildcare',
  'budgetDebt', 'budgetClothing', 'budgetPersonalCare', 'budgetEntertainment', 'budgetPets',
  'budgetTravel', 'budgetGifts', 'budgetGiving',
  'transition', 'monthlyPicture',
  'step1Cushion', 'step2Match', 'step3Debt', 'step4EmergencyFund',
  'step5ModerateDebt', 'step6Retirement', 'step7Goals', 'step8Optimize',
  'scoreScreen', 'pdfScreen', 'retirementCalc',
];

const initialUserData = {
  // Intake
  householdType: null,
  partnerIncomeType: null,
  incomeType: null,
  isDualMilitary: false,
  highInterestDebt: null,

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
  householdEssentials: null,
  carPayment: null, gasAndFuel: null, carInsurance: null, phone: null,
  internet: null, homeMaintenance: null, healthInsurance: null, outOfPocketMedical: null,
  hasHSA: null, subscriptions: [], hasKids: null, childcare: null, kidExpenses: null,
  debts: [],
  clothing: null, personalCare: null, entertainment: null, pets: null, giving: null,
  gifts: null, travel: null,

  // Computed
  totalMonthlyExpenses: 0, breathingRoom: 0, napkinScale: null,

  // Step answers
  hasCushion: null, capturingMatch: null, tspContributionPct: 0,
  emergencyFundMonths: null, goals: [],
};

const TIMER_DURATION = 10 * 60 * 1000;
const EXEMPT_SCREENS = new Set(['welcome', 'scoreScreen', 'pdfScreen']);
const SKIP_BACK_SCREENS = new Set(['transition']);

function getProgressScreens(userData) {
  const screens = ['household'];

  if (userData.householdType === 'partner') {
    screens.push('partnerIncome');
  }

  screens.push('incomeType', 'triage');

  if (userData.incomeType === 'military') {
    screens.push('payReconstruction1');
    if (userData.isDualMilitary) {
      screens.push('payReconstruction2');
    }
    screens.push('pension', 'lesConfirmation');
  } else if (userData.incomeType === 'selfEmployed') {
    screens.push('irregularIncome');
  } else if (userData.incomeType === 'civilian') {
    screens.push('lesConfirmation');
  }

  screens.push(
    'budgetHousing', 'budgetUtilities', 'budgetGroceries', 'budgetHouseholdEssentials', 'budgetDining',
    'budgetCarPayment', 'budgetGas', 'budgetCarInsurance', 'budgetPhone',
    'budgetInternet', 'budgetHomeMaintenance', 'budgetHealthInsurance', 'budgetMedical', 'budgetSubscriptions',
    'budgetChildcare',
    'budgetDebt', 'budgetClothing', 'budgetPersonalCare', 'budgetEntertainment',
    'budgetPets', 'budgetTravel', 'budgetGifts', 'budgetGiving'
  );

  screens.push(
    'transition', 'monthlyPicture',
    'step1Cushion', 'step2Match', 'step3Debt', 'step4EmergencyFund',
    'step5ModerateDebt', 'step6Retirement', 'step7Goals', 'step8Optimize',
    'scoreScreen', 'pdfScreen', 'retirementCalc'
  );

  return screens;
}

function App() {
  const saved = loadSaved();
  const [currentScreen, setCurrentScreen] = useState(saved?.currentScreen || 'welcome');
  const [history, setHistory] = useState(saved?.history || ['welcome']);
  const [userData, setUserData] = useState({ ...initialUserData, ...(saved?.userData || {}) });
  const [showTimerOverlay, setShowTimerOverlay] = useState(false);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const save = (ud, screen, hist) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ userData: ud, currentScreen: screen, history: hist }));
    } catch {
      // Ignore storage failures and continue in-memory.
    }
  };

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const applyNavigation = (screen, hist, nextUserData = userData) => {
    if (EXEMPT_SCREENS.has(screen)) {
      clearTimer();
      setShowTimerOverlay(false);
    }

    setHistory(hist);
    setCurrentScreen(screen);
    save(nextUserData, screen, hist);
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
    applyNavigation(screen, newHistory);
  };

  const goBack = () => {
    if (history.length > 1) {
      let newHistory = history.slice(0, -1);

      while (newHistory.length > 1 && SKIP_BACK_SCREENS.has(newHistory[newHistory.length - 1])) {
        newHistory = newHistory.slice(0, -1);
      }

      const prev = newHistory[newHistory.length - 1];
      applyNavigation(prev, newHistory);
    }
  };

  const startFresh = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage failures and continue with a fresh in-memory session.
    }
    const nextUserData = { ...initialUserData };
    const newHistory = ['welcome', 'household'];
    clearTimer();
    setShowTimerOverlay(false);
    setUserData(nextUserData);
    applyNavigation('household', newHistory, nextUserData);
  };

  const restoreCode = (decoded) => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage failures and continue with restored in-memory data.
    }
    const next = { ...initialUserData, ...decoded };
    setUserData(next);
    const screen = decoded.napkinScale ? 'scoreScreen' : decoded.monthlyTakeHome ? 'monthlyPicture' : 'household';
    const newHistory = ['welcome', screen];
    applyNavigation(screen, newHistory, next);
  };

  // Start timer when user leaves welcome screen
  useEffect(() => {
    if (currentScreen === 'welcome' || EXEMPT_SCREENS.has(currentScreen)) {
      clearTimer();
      return undefined;
    }
    if (timerRef.current) return undefined;
    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(() => {
      setShowTimerOverlay(true);
    }, TIMER_DURATION);
    return undefined;
  }, [currentScreen]);

  const progressScreens = getProgressScreens(userData);
  const progressIndex = progressScreens.indexOf(currentScreen);
  const progressPct = currentScreen === 'welcome'
    ? 0
    : progressIndex === -1
      ? Math.min(99, Math.round((history.length / Math.max(progressScreens.length, 1)) * 100))
      : Math.round(((progressIndex + 1) / progressScreens.length) * 100);

  const showProgress = currentScreen !== 'welcome';
  const showFeedback = showProgress && !EXEMPT_SCREENS.has(currentScreen);
  const saveCode = generateSaveCode(userData);
  const props = { userData, updateUserData, onNext: navigate, onBack: goBack, onStartFresh: startFresh, saveCode };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':    return <WelcomeScreen {...props} onRestoreCode={restoreCode} />;
      case 'household':      return <HouseholdScreen {...props} />;
      case 'partnerIncome':  return <PartnerIncomeScreen {...props} />;
      case 'incomeType':     return <IncomeTypeScreen {...props} />;
      case 'triage':         return <TriageScreen {...props} />;
      case 'payReconstruction1':   return <PayReconstructionScreen {...props} memberNumber={1} />;
      case 'payReconstruction2':   return <PayReconstructionScreen {...props} memberNumber={2} />;
      case 'pension':              return <PensionScreen {...props} />;
      case 'lesConfirmation':      return <LESConfirmationScreen {...props} />;
      case 'irregularIncome':      return <IrregularIncomeScreen {...props} />;
      case 'budgetHousing':        return <HousingScreen {...props} />;
      case 'budgetUtilities':      return <UtilitiesScreen {...props} />;
      case 'budgetGroceries':      return <GroceriesScreen {...props} />;
      case 'budgetHouseholdEssentials': return <HouseholdEssentialsScreen {...props} />;
      case 'budgetDining':         return <DiningOutScreen {...props} />;
      case 'budgetCarPayment':     return <CarPaymentScreen {...props} />;
      case 'budgetGas':            return <CarMaintenanceScreen {...props} />;
      case 'budgetCarInsurance':   return <CarInsuranceScreen {...props} />;
      case 'budgetPhone':          return <PhoneScreen {...props} />;
      case 'budgetInternet':       return <InternetScreen {...props} />;
      case 'budgetHomeMaintenance': return <HomeMaintenanceScreen {...props} />;
      case 'budgetHealthInsurance': return <HealthInsuranceScreen {...props} />;
      case 'budgetMedical':        return <MedicalScreen {...props} />;
      case 'budgetSubscriptions':  return <SubscriptionsScreen {...props} />;
      case 'budgetChildcare':      return <ChildcareScreen {...props} />;
      case 'budgetDebt':           return <DebtScreen {...props} />;
      case 'budgetClothing':       return <ClothingScreen {...props} />;
      case 'budgetPersonalCare':   return <PersonalCareScreen {...props} />;
      case 'budgetEntertainment':  return <EntertainmentScreen {...props} />;
      case 'budgetPets':           return <PetsScreen {...props} />;
      case 'budgetGiving':         return <GivingScreen {...props} />;
      case 'budgetGifts':          return <GiftsScreen {...props} />;
      case 'budgetTravel':         return <TravelScreen {...props} />;
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
      case 'retirementCalc':       return <RetirementCalculatorScreen {...props} />;
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
      {showFeedback && <FlowFeedback currentScreen={currentScreen} pct={progressPct} />}
      {renderScreen()}
      {showTimerOverlay && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: 'rgba(27,58,107,0.85)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          padding: '0 0 24px',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 24,
            padding: '32px 24px 24px',
            width: 'calc(100% - 48px)',
            maxWidth: 382,
            boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
          }}>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--blue)', margin: '0 0 8px' }}>
              Time&rsquo;s Up
            </p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, fontWeight: 700, color: 'var(--navy)', margin: '0 0 12px', lineHeight: 1.2 }}>
              Great progress today.
            </h2>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'var(--gray)', lineHeight: 1.5, margin: '0 0 24px' }}>
              Get your next steps now, or keep going for a more complete picture.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                onClick={() => { setShowTimerOverlay(false); navigate('scoreScreen'); }}
                style={{ width: '100%', height: 56, background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: 16, fontFamily: 'DM Sans, sans-serif', fontSize: 18, fontWeight: 600, cursor: 'pointer' }}
              >
                Get my next steps
              </button>
              <button
                onClick={() => setShowTimerOverlay(false)}
                style={{ width: '100%', height: 48, background: 'transparent', color: 'var(--gray)', border: '1.5px solid #E0E0E0', borderRadius: 14, fontFamily: 'DM Sans, sans-serif', fontSize: 16, cursor: 'pointer' }}
              >
                Keep going
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
