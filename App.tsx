import React, { useState, useEffect } from 'react';
import { AuthStatus, View, User } from './types';
import { supabase } from './lib/supabase';
import { AnimatePresence } from 'framer-motion';
import AnimatedPageWrapper from './components/AnimatedPageWrapper';

// Define global constant for commit hash
declare const __COMMIT_HASH__: string;

// Components
// Lazy Load Components
const AuthView = React.lazy(() => import('./components/AuthView'));
const PlatformDashboard = React.lazy(() => import('./components/PlatformDashboard'));
const UserProfile = React.lazy(() => import('./components/UserProfile'));
const AccountSettings = React.lazy(() => import('./components/AccountSettings'));
const PlatformProgress = React.lazy(() => import('./components/PlatformProgress'));
const FlashcardSystem = React.lazy(() => import('./components/FlashcardSystem'));
const SubscriptionManagement = React.lazy(() => import('./components/SubscriptionManagement'));
const AdminDashboard = React.lazy(() => import('./components/AdminDashboard'));
const StudyGuide = React.lazy(() => import('./components/StudyGuide'));
const ConceptLab = React.lazy(() => import('./components/ConceptLab'));
const QuestionBank = React.lazy(() => import('./components/QuestionBank'));
const ExamPlanner = React.lazy(() => import('./components/ExamPlanner').then(module => ({ default: module.ExamPlanner })));

// Concepts
const ForcesOfFlight = React.lazy(() => import('./components/concepts/ForcesOfFlight'));
const HoldEntryVisualizer = React.lazy(() => import('./components/concepts/HoldEntryVisualizer'));
const GreatCircleExplorer = React.lazy(() => import('./components/concepts/GreatCircleExplorer'));
const TurnPerformance = React.lazy(() => import('./components/concepts/TurnPerformance'));

// Critical Imports (Static)
import ContentProtection from './components/ContentProtection';
import NavigationBar from './components/NavigationBar';
import SubjectSidebar from './components/SubjectSidebar';
import { getSubjectConfig } from './data/sidebarNavigation';
// import StarfieldBackground from './components/StarfieldBackground';
// import GlowOrbs from './components/GlowOrbs';
import LoadingScreen from './components/LoadingScreen';

// Imports for Subjects...
// Lazy Load Subject Dashboards
const AirLawDashboard = React.lazy(() => import('./components/AirLawDashboard'));
const AviationOrganisations = React.lazy(() => import('./components/AviationOrganisations'));
const InternationalLaw = React.lazy(() => import('./components/InternationalLaw'));
const LiabilityAndRights = React.lazy(() => import('./components/LiabilityAndRights'));
const AnnexList = React.lazy(() => import('./components/AnnexList'));
const PersonnelLicensing = React.lazy(() => import('./components/PersonnelLicensing'));
const AirworthinessAndOps = React.lazy(() => import('./components/AirworthinessAndOps'));
const AircraftRegistration = React.lazy(() => import('./components/AircraftRegistration'));
const DocumentsOnboard = React.lazy(() => import('./components/DocumentsOnboard'));
const RulesOfTheAirDetails = React.lazy(() => import('./components/RulesOfTheAirDetails'));
const CockpitToggle = React.lazy(() => import('./components/CockpitToggle'));
const CruisingLevelTool = React.lazy(() => import('./components/CruisingLevelTool'));
const InterceptionProcedures = React.lazy(() => import('./components/InterceptionProcedures'));
const LightGunSignals = React.lazy(() => import('./components/LightGunSignals'));
const AirspaceLayers = React.lazy(() => import('./components/AirspaceLayers'));
const IFRVFRExplorer = React.lazy(() => import('./components/IFRVFRExplorer'));
const InstrumentApproach = React.lazy(() => import('./components/InstrumentApproach'));
const PansOpsProcedures = React.lazy(() => import('./components/PansOpsProcedures'));
const HoldingPatternEntry = React.lazy(() => import('./components/HoldingPatternEntry'));
const AltimeterVisualizer = React.lazy(() => import('./components/AltimeterVisualizer'));
const AerodromeReferenceCode = React.lazy(() => import('./components/AerodromeReferenceCode'));
const SurfaceContamination = React.lazy(() => import('./components/SurfaceContamination'));
const AerodromeLightingSummary = React.lazy(() => import('./components/AerodromeLightingSummary'));
const AerodromeVisualizer = React.lazy(() => import('./components/AerodromeVisualizer'));
const SignsAndSignals = React.lazy(() => import('./components/SignsAndSignals'));
const GroundOperations = React.lazy(() => import('./components/GroundOperations'));
const RWSL = React.lazy(() => import('./components/RWSL'));
const TVasisVisualizer = React.lazy(() => import('./components/TVasisVisualizer'));
const DeclaredDistances = React.lazy(() => import('./components/DeclaredDistances'));
const OperationalInfo = React.lazy(() => import('./components/OperationalInfo'));
const SecuritySection = React.lazy(() => import('./components/SecuritySection'));
const AccidentInvestigation = React.lazy(() => import('./components/AccidentInvestigation'));
const SearchAndRescue = React.lazy(() => import('./components/SearchAndRescue'));
const EmergencyProcedures = React.lazy(() => import('./components/EmergencyProcedures'));

const HydraulicSystemAnim = React.lazy(() => import('./components/AGK/HydraulicSystemAnim'));

const AGKSystemsDashboard = React.lazy(() => import('./components/AGK/AGKSystemsDashboard'));
const JetEnginePrinciples = React.lazy(() => import('./components/AGK/JetEnginePrinciples'));
const ElectricsSystem = React.lazy(() => import('./components/AGK/ElectricsSystem'));
const PistonEnginePrinciples = React.lazy(() => import('./components/AGK/PistonEnginePrinciples'));
const AirLawFacilitation = React.lazy(() => import('./components/AirLawFacilitation'));
const AirLawParallelRunway = React.lazy(() => import('./components/AirLawParallelRunway'));
const AirLawAISDeepDive = React.lazy(() => import('./components/AirLawAISDeepDive'));
const AirLawConventions = React.lazy(() => import('./components/AirLawConventions'));
const AirLawRightOfWay = React.lazy(() => import('./components/AirLawRightOfWay'));
const InstrumentationDashboard = React.lazy(() => import('./components/Instrumentation/InstrumentationDashboard'));
const PitotStaticSystem = React.lazy(() => import('./components/Instrumentation/PitotStaticSystem'));
const InstAltimeterLab = React.lazy(() => import('./components/Instrumentation/AltimeterLab'));
const AirspeedIndicator = React.lazy(() => import('./components/Instrumentation/AirspeedIndicator'));
const VSILab = React.lazy(() => import('./components/Instrumentation/VSILab'));
const Machmeter = React.lazy(() => import('./components/Instrumentation/Machmeter'));
const GyroPrinciples = React.lazy(() => import('./components/Instrumentation/GyroPrinciples'));
const TurnIndicator = React.lazy(() => import('./components/Instrumentation/TurnIndicator'));
const DirectionalGyro = React.lazy(() => import('./components/Instrumentation/DirectionalGyro'));
const AttitudeIndicator = React.lazy(() => import('./components/Instrumentation/AttitudeIndicator'));
const MagneticCompass = React.lazy(() => import('./components/Instrumentation/MagneticCompass'));
const RadioAltimeter = React.lazy(() => import('./components/Instrumentation/RadioAltimeter'));
const NavigationSystems = React.lazy(() => import('./components/Instrumentation/NavigationSystems'));
const FMSEFIS = React.lazy(() => import('./components/Instrumentation/FMSEFIS'));
const GPWSSystem = React.lazy(() => import('./components/Instrumentation/GPWSSystem'));
const AutopilotSystem = React.lazy(() => import('./components/Instrumentation/AutopilotSystem'));
const AutolandSystem = React.lazy(() => import('./components/Instrumentation/AutolandSystem'));
const MassBalanceDashboard = React.lazy(() => import('./components/MassBal/MassBalanceDashboard'));
const WeighingProcedure = React.lazy(() => import('./components/MassBal/WeighingProcedure'));
const MassDefinitions = React.lazy(() => import('./components/MassBal/MassDefinitions'));
const CgCalculator = React.lazy(() => import('./components/MassBal/CgCalculator'));
const LoadingLimits = React.lazy(() => import('./components/MassBal/LoadingLimits'));
const MacVisualizer = React.lazy(() => import('./components/MassBal/MacVisualizer'));
const MetDashboard = React.lazy(() => import('./components/Meteorology/MetDashboard'));
const FuelDensityCalc = React.lazy(() => import('./components/MassBal/FuelDensityCalc'));
const CargoHandlingSim = React.lazy(() => import('./components/MassBal/CargoHandlingSim'));
const LoadSheetSim = React.lazy(() => import('./components/MassBal/LoadSheetSim'));
const MassBuildUpFlow = React.lazy(() => import('./components/MassBal/MassBuildUpFlow'));
const TrimSheetSim = React.lazy(() => import('./components/MassBal/TrimSheetSim'));
const CGShiftVisualizer = React.lazy(() => import('./components/MassBal/CGShiftVisualizer'));
const UnitConverter = React.lazy(() => import('./components/MassBal/UnitConverter'));
const MassEffects = React.lazy(() => import('./components/MassBal/MassEffects'));
const CGEffects = React.lazy(() => import('./components/MassBal/CGEffects'));
const StructuralLimits = React.lazy(() => import('./components/MassBal/StructuralLimits'));
const StallSpeedCalc = React.lazy(() => import('./components/MassBal/StallSpeedCalc'));
const FleetMasses = React.lazy(() => import('./components/MassBal/FleetMasses'));
const CargoTypes = React.lazy(() => import('./components/MassBal/CargoTypes'));
const StandardMasses = React.lazy(() => import('./components/MassBal/StandardMasses'));
const HumanPhysiology = React.lazy(() => import('./components/HPL/HumanPhysiology'));
const HumanFactorsIntro = React.lazy(() => import('./components/HPL/HumanFactorsIntro'));
const SleepAndRhythms = React.lazy(() => import('./components/HPL/SleepAndRhythms'));
const InformationProcessing = React.lazy(() => import('./components/HPL/InformationProcessing'));
const ErrorAndDecision = React.lazy(() => import('./components/HPL/ErrorAndDecision'));
const CommunicationAndStress = React.lazy(() => import('./components/HPL/CommunicationAndStress'));
const HumanBehaviour = React.lazy(() => import('./components/HPL/HumanBehaviour'));
const CockpitManagement = React.lazy(() => import('./components/HPL/CockpitManagement'));
const HPLVision = React.lazy(() => import('./components/HPL/HPLVision'));
const HPLHearing = React.lazy(() => import('./components/HPL/HPLHearing'));
const HPLHealth = React.lazy(() => import('./components/HPL/HPLHealth'));
const HPLTEM = React.lazy(() => import('./components/HPL/HPLTEM'));
const HPLShell = React.lazy(() => import('./components/HPL/HPLShell'));
const HPLSafetyCulture = React.lazy(() => import('./components/HPL/HPLSafetyCulture'));
const HPLAcceleration = React.lazy(() => import('./components/HPL/HPLAcceleration'));
const HPLToxicHazards = React.lazy(() => import('./components/HPL/HPLToxicHazards'));
const HPLAutomation = React.lazy(() => import('./components/HPL/HPLAutomation'));
const HPLVestibular = React.lazy(() => import('./components/HPL/HPLVestibular'));
const HPLMemory = React.lazy(() => import('./components/HPL/HPLMemory'));
const HPLRespiration = React.lazy(() => import('./components/HPL/HPLRespiration'));
const HPLCirculation = React.lazy(() => import('./components/HPL/HPLCirculation'));
const HPLNervousSystem = React.lazy(() => import('./components/HPL/HPLNervousSystem'));
const HPLMetabolism = React.lazy(() => import('./components/HPL/HPLMetabolism'));
const HPLErgonomics = React.lazy(() => import('./components/HPL/HPLErgonomics'));
const HPLBiases = React.lazy(() => import('./components/HPL/HPLBiases'));
const HPLCulture = React.lazy(() => import('./components/HPL/HPLCulture'));
const HPLRadiation = React.lazy(() => import('./components/HPL/HPLRadiation'));
const HPLThermal = React.lazy(() => import('./components/HPL/HPLThermal'));
const HPLSleepDisorders = React.lazy(() => import('./components/HPL/HPLSleepDisorders'));
const HPLPressure = React.lazy(() => import('./components/HPL/HPLPressure'));
const HPLMotionSickness = React.lazy(() => import('./components/HPL/HPLMotionSickness'));
const HPLPerception = React.lazy(() => import('./components/HPL/HPLPerception'));
const HPLWorkload = React.lazy(() => import('./components/HPL/HPLWorkload'));
const HPLCommunicationProcess = React.lazy(() => import('./components/HPL/HPLCommunicationProcess'));
const HPLCompetency = React.lazy(() => import('./components/HPL/HPLCompetency'));
const HPLCooperation = React.lazy(() => import('./components/HPL/HPLCooperation'));
const HPLHealthHygiene = React.lazy(() => import('./components/HPL/HPLHealthHygiene'));
const HPLTropicalDiseases = React.lazy(() => import('./components/HPL/HPLTropicalDiseases'));
const HPLLearning = React.lazy(() => import('./components/HPL/HPLLearning'));
const HPLPersonality = React.lazy(() => import('./components/HPL/HPLPersonality'));
const HPLAtmosphere = React.lazy(() => import('./components/HPL/HPLAtmosphere'));
const HPLIncidents = React.lazy(() => import('./components/HPL/HPLIncidents'));
const HPLIncapacitation = React.lazy(() => import('./components/HPL/HPLIncapacitation'));

const AtmosphereLayers = React.lazy(() => import('./components/Meteorology/AtmosphereLayers'));
const AtmosphereMaster = React.lazy(() => import('./components/Meteorology/AtmosphereMaster'));
const Altimetry = React.lazy(() => import('./components/Meteorology/Altimetry'));
const Precipitation = React.lazy(() => import('./components/Meteorology/Precipitation'));
const HumidityLab = React.lazy(() => import('./components/Meteorology/HumidityLab'));
const WindSystems = React.lazy(() => import('./components/Meteorology/WindSystems'));
const GeneralCirculation = React.lazy(() => import('./components/Meteorology/GeneralCirculation'));
const FrontalSystems = React.lazy(() => import('./components/Meteorology/FrontalSystems'));
const OneInSixty = React.lazy(() => import('./components/Nav/OneInSixty'));
const PressureSystems = React.lazy(() => import('./components/Meteorology/PressureSystems'));
const Density = React.lazy(() => import('./components/Meteorology/Density'));
const VisibilityFog = React.lazy(() => import('./components/Meteorology/VisibilityFog'));
const Icing = React.lazy(() => import('./components/Meteorology/Icing'));
const Thunderstorms = React.lazy(() => import('./components/Meteorology/Thunderstorms'));
const AirMasses = React.lazy(() => import('./components/Meteorology/AirMasses'));
const Turbulence = React.lazy(() => import('./components/Meteorology/Turbulence'));
const JetStreams = React.lazy(() => import('./components/Meteorology/JetStreams'));
const Climatology = React.lazy(() => import('./components/Meteorology/Climatology'));
const LocalWinds = React.lazy(() => import('./components/Meteorology/LocalWinds'));
const DepressionsAnticyclones = React.lazy(() => import('./components/Meteorology/DepressionsAnticyclones'));
const CloudTypes = React.lazy(() => import('./components/Meteorology/CloudTypes'));
const MetarTafDecoder = React.lazy(() => import('./components/Meteorology/MetarTafDecoder'));
const WeatherCharts = React.lazy(() => import('./components/Meteorology/WeatherCharts'));
const TropicalStorms = React.lazy(() => import('./components/Meteorology/TropicalStorms'));
const SpecialHazards = React.lazy(() => import('./components/Meteorology/SpecialHazards'));
const SatelliteRadar = React.lazy(() => import('./components/Meteorology/SatelliteRadar'));
const OpticalPhenomena = React.lazy(() => import('./components/Meteorology/OpticalPhenomena'));
const StationModels = React.lazy(() => import('./components/Meteorology/StationModels'));

const TimeZoner = React.lazy(() => import('./components/TimeZoner'));
const GNSSTheory = React.lazy(() => import('./components/RadioNav/GNSSTheory'));
const WavePropVisualizer = React.lazy(() => import('./components/RadioNav/WavePropVisualizer'));
const SpectrumExplorer = React.lazy(() => import('./components/RadioNav/SpectrumExplorer'));
const IonosphereSim = React.lazy(() => import('./components/RadioNav/IonosphereSim'));
const AntennaTheory = React.lazy(() => import('./components/RadioNav/AntennaTheory'));
const Modulation = React.lazy(() => import('./components/RadioNav/Modulation'));
const VDF = React.lazy(() => import('./components/RadioNav/VDF'));
const MLS = React.lazy(() => import('./components/RadioNav/MLS'));
const VORSystem = React.lazy(() => import('./components/RadioNav/VORSystem'));
const ADFSimulator = React.lazy(() => import('./components/RadioNav/ADFSimulator'));
const NDBADFSystem = React.lazy(() => import('./components/RadioNav/NDBADFSystem'));
const DMESystem = React.lazy(() => import('./components/RadioNav/DMESystem'));
const ILSSystem = React.lazy(() => import('./components/RadioNav/ILSSystem'));
const RadarTheory = React.lazy(() => import('./components/RadioNav/RadarTheory'));
const SSRTransponder = React.lazy(() => import('./components/RadioNav/SSRTransponder'));
const SbasAbas = React.lazy(() => import('./components/RadioNav/SbasAbas'));
const RnavPbn = React.lazy(() => import('./components/RadioNav/RnavPbn'));
const FMSTrainer = React.lazy(() => import('./components/RadioNav/FMSTrainer'));
const LiftDrag = React.lazy(() => import('./components/PoF/LiftDrag'));
const AtmosphereProp = React.lazy(() => import('./components/PoF/AtmosphereProp'));
const AirflowBasics = React.lazy(() => import('./components/PoF/AirflowBasics'));
const AerofoilGeom = React.lazy(() => import('./components/PoF/AerofoilGeom'));
const WingGeom = React.lazy(() => import('./components/PoF/WingGeom'));
const LiftDragCoeff = React.lazy(() => import('./components/PoF/LiftDragCoeff'));
const ThreeDAirflow = React.lazy(() => import('./components/PoF/ThreeDAirflow'));
const TotalDrag = React.lazy(() => import('./components/PoF/TotalDrag'));
const GroundEffect = React.lazy(() => import('./components/PoF/GroundEffect'));
const HighLiftDevices = React.lazy(() => import('./components/PoF/HighLiftDevices'));
const RadioFundamentals = React.lazy(() => import('./components/RadioNav/RadioFundamentals'));
const WeatherRadar = React.lazy(() => import('./components/RadioNav/WeatherRadar'));

const CommsDashboard = React.lazy(() => import('./components/Comms/CommsDashboard'));
const GeneralTheory = React.lazy(() => import('./components/GeneralTheory'));
const PropagationTheory = React.lazy(() => import('./components/Comms/PropagationTheory'));
const TechPhysics = React.lazy(() => import('./components/TechPhysics'));
const FrequencyExplorer = React.lazy(() => import('./components/FrequencyExplorer'));
const SuffixMatch = React.lazy(() => import('./components/SuffixMatch'));
const QCodeFlashcards = React.lazy(() => import('./components/QCodeFlashcards'));
const QCodeCompass = React.lazy(() => import('./components/QCodeCompass'));
const WordMatch = React.lazy(() => import('./components/WordMatch'));
const PhoneticTrainer = React.lazy(() => import('./components/PhoneticTrainer'));
const AltSpeak = React.lazy(() => import('./components/AltSpeak'));
const TimeReport = React.lazy(() => import('./components/TimeReport'));
const ReadabilitySim = React.lazy(() => import('./components/Comms/ReadabilitySim'));
const FlightRules = React.lazy(() => import('./components/FlightRules'));
const PrioritySorter = React.lazy(() => import('./components/Comms/PrioritySorter'));
const CallsignTrainer = React.lazy(() => import('./components/Comms/CallsignTrainer'));
const TransmissionDrill = React.lazy(() => import('./components/Comms/TransmissionDrill'));
const CommsDefinitions = React.lazy(() => import('./components/Comms/CommsDefinitions'));
const QCodeCards = React.lazy(() => import('./components/Comms/QCodeCards'));
const UrgencyTrainer = React.lazy(() => import('./components/Comms/UrgencyTrainer'));
const LevelChanges = React.lazy(() => import('./components/Comms/LevelChanges'));
const AbbreviationGame = React.lazy(() => import('./components/Comms/AbbreviationGame'));
const CPDLCSim = React.lazy(() => import('./components/Comms/CPDLCSim'));
const ReadbackChallenge = React.lazy(() => import('./components/ReadbackChallenge'));
const MetarDecoder = React.lazy(() => import('./components/MetarDecoder'));
const VolmetSimulator = React.lazy(() => import('./components/Comms/VolmetSimulator'));
const AirepSpec = React.lazy(() => import('./components/AirepSpec'));
const GenNavDashboard = React.lazy(() => import('./components/GenNav/GenNavDashboard'));
const EarthGeometry = React.lazy(() => import('./components/GenNav/EarthGeometry'));
const WindTriangle = React.lazy(() => import('./components/GenNav/WindTriangle'));
const SolarCalc = React.lazy(() => import('./components/GenNav/SolarCalc'));
const MapProjections = React.lazy(() => import('./components/GenNav/MapProjections'));
const PolarGrid = React.lazy(() => import('./components/GenNav/PolarGrid'));
const NavDataLink = React.lazy(() => import('./components/NavDataLink'));
const EmergencyBuilder = React.lazy(() => import('./components/EmergencyBuilder'));
const EmergencyOps = React.lazy(() => import('./components/EmergencyOps'));
const CommFailure = React.lazy(() => import('./components/CommFailure'));
const BlindTrans = React.lazy(() => import('./components/BlindTrans'));
const TransponderDojo = React.lazy(() => import('./components/TransponderDojo'));
const VfrFlightSim = React.lazy(() => import('./components/Comms/VfrFlightSim'));
const PhraseologyExplorer = React.lazy(() => import('./components/PhraseologyExplorer'));
const PositionReport = React.lazy(() => import('./components/PositionReport'));
const TrafficClock = React.lazy(() => import('./components/TrafficClock'));
const ScenarioRoleplay = React.lazy(() => import('./components/ScenarioRoleplay'));
const AIQuiz = React.lazy(() => import('./components/AIQuiz'));
const LightGunGame = React.lazy(() => import('./components/LightGunGame'));
const MorseMaster = React.lazy(() => import('./components/MorseMaster'));
const BandSpectrum = React.lazy(() => import('./components/BandSpectrum'));
const RadarVectors = React.lazy(() => import('./components/Comms/RadarVectors'));
const TransferDrill = React.lazy(() => import('./components/Comms/TransferDrill'));
const MetarBuilder = React.lazy(() => import('./components/Comms/MetarBuilder'));
const VHFCalculator = React.lazy(() => import('./components/VHFCalculator'));
const AdvancedPhraseology = React.lazy(() => import('./components/AdvancedPhraseology'));
const RvrSimulator = React.lazy(() => import('./components/RvrSimulator'));
const RvrDecoder = React.lazy(() => import('./components/RvrDecoder'));
const CloudMaster = React.lazy(() => import('./components/CloudMaster'));
const FlirtTrainer = React.lazy(() => import('./components/FlirtTrainer'));
const PapiVis = React.lazy(() => import('./components/PapiVis'));
const MorseIdent = React.lazy(() => import('./components/Comms/MorseIdent'));
const WeatherMinima = React.lazy(() => import('./components/WeatherMinima'));
const HoldEntryCalc = React.lazy(() => import('./components/HoldEntryCalc'));
const AltimeterLab = React.lazy(() => import('./components/AltimeterLab'));
const RunwayLighting = React.lazy(() => import('./components/RunwayLighting'));
const SurfaceLighting = React.lazy(() => import('./components/SurfaceLighting'));
const TaxiwayLighting = React.lazy(() => import('./components/TaxiwayLighting'));
const RunwayQuiz = React.lazy(() => import('./components/RunwayQuiz'));
const SnowtamDecoder = React.lazy(() => import('./components/SnowtamDecoder'));
const SigmetDecoder = React.lazy(() => import('./components/Comms/SigmetDecoder'));
const WakeTurbulence = React.lazy(() => import('./components/WakeTurbulence'));
const ServiceCodes = React.lazy(() => import('./components/ServiceCodes'));
const InterceptTrainer = React.lazy(() => import('./components/InterceptTrainer'));
const LongRangeOps = React.lazy(() => import('./components/LongRangeOps'));
const SpecialOpsDashboard = React.lazy(() => import('./components/SpecialOpsDashboard'));
const FTLCalculator = React.lazy(() => import('./components/FTLCalculator'));
const AllWeatherOps = React.lazy(() => import('./components/AllWeatherOps'));
const OpsGeneral = React.lazy(() => import('./components/OpsGeneral'));

const GenericSubjectDashboard = React.lazy(() => import('./components/GenericSubjectDashboard'));
const KSADashboard = React.lazy(() => import('./components/KSA/KSADashboard'));
const KSACoreCompetencies = React.lazy(() => import('./components/KSA/KSACoreCompetencies'));
const TEMAdvanced = React.lazy(() => import('./components/KSA/TEMAdvanced'));
const MentalMathsLab = React.lazy(() => import('./components/KSA/MentalMathsLab'));
const FORDECDecision = React.lazy(() => import('./components/KSA/FORDECDecision'));
const UPRTConcepts = React.lazy(() => import('./components/KSA/UPRTConcepts'));
const CRMScenarios = React.lazy(() => import('./components/KSA/CRMScenarios'));
const ResilienceTraining = React.lazy(() => import('./components/KSA/ResilienceTraining'));
const ProcedureApplication = React.lazy(() => import('./components/KSA/ProcedureApplication'));

// Removed duplicate imports of View, User, AuthStatus as they are already imported at the top.
// Removed duplicate imports of View, User, AuthStatus as they are already imported at the top.
import SyllabusViewer from './components/SyllabusViewer';
import ProgressDashboard from './components/ProgressDashboard';
import { ToastProvider } from './components/ui/ToastContext';

import FocusTimer from './components/study/FocusTimer';
import Scratchpad from './components/study/Scratchpad';
import CommandPalette from './components/CommandPalette';
import {
    Plane as PlaneIcon, Menu, X, BookOpen, Settings, Weight,
    Users, Cloud, Compass, Wifi, TrendingUp, Map, FolderCog, Wind, Search, Activity, Calendar, Clock
} from 'lucide-react';

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [currentView, setCurrentView] = useState<View>(View.PLATFORM_DASHBOARD);
    const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
    const [studyTime, setStudyTime] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mainMenuOpen, setMainMenuOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

    // Global Command Palette Listener
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setCommandPaletteOpen(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const [authInitialView, setAuthInitialView] = useState<'LOGIN' | 'SIGNUP' | 'RESET_PASSWORD'>('LOGIN');

    // Navigation History State
    const [viewHistory, setViewHistory] = useState<View[]>([View.PLATFORM_DASHBOARD]);
    const [historyIndex, setHistoryIndex] = useState(0);

    // Navigate to a new view (adds to history)
    const navigateTo = (view: View) => {
        // Don't add duplicate consecutive entries
        if (viewHistory[historyIndex] === view) return;

        // Clear forward history and add new view
        const newHistory = viewHistory.slice(0, historyIndex + 1);
        newHistory.push(view);

        // Limit history size to prevent memory issues
        if (newHistory.length > 50) newHistory.shift();

        setViewHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        setCurrentView(view);
    };

    // Go back in history
    const goBack = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setCurrentView(viewHistory[newIndex]);
        }
    };

    // Go forward in history
    const goForward = () => {
        if (historyIndex < viewHistory.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setCurrentView(viewHistory[newIndex]);
        }
    };

    const canGoBack = historyIndex > 0;
    const canGoForward = historyIndex < viewHistory.length - 1;
    const [isLoading, setIsLoading] = useState(true);

    // Pending/Invite State
    const [pendingInviteCode, setPendingInviteCode] = useState('');
    const [isSubmittingCode, setIsSubmittingCode] = useState(false);
    const [codeError, setCodeError] = useState('');

    // Clean URL hash after Supabase redirect
    useEffect(() => {
        if (window.location.hash && window.location.hash.includes('access_token')) {
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    // Initial Data Fetch & Auth Listener
    useEffect(() => {
        // 1. Check for active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                fetchUserProfile(session.user.id, session.user.email!, session.user.user_metadata);
            } else {
                setIsLoading(false);
            }
        });

        // 2. Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'PASSWORD_RECOVERY') {
                if (session) {
                    fetchUserProfile(session.user.id, session.user.email!, session.user.user_metadata).then(() => {
                        setCurrentView(View.ACCOUNT_SETTINGS);
                    });
                }
            } else if (session) {
                fetchUserProfile(session.user.id, session.user.email!, session.user.user_metadata);
            } else {
                setUser(null);
                setCurrentView(View.PLATFORM_DASHBOARD);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchUserProfile = async (uid: string, email: string, metadata: any = {}) => {
        try {
            // Trial configuration
            const TRIAL_DURATION_DAYS = 7;
            const TRIAL_SUBJECTS = ['090']; // Communications only for free/trial users

            // Try to get profile
            let { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', uid)
                .single();

            // Auto-create profile if missing (Self-healing for existing users)
            if (error && (error.code === 'PGRST116' || error.message.includes('0 rows'))) {
                console.log("Profile missing, creating new profile with trial access...");
                const trialStartDate = new Date().toISOString();

                // Determine initial approval status from metadata
                const isApproved = metadata?.initial_status === 'PENDING_APPROVAL' ? false : true;

                const { data: newProfile, error: createError } = await supabase
                    .from('profiles')
                    .insert([{
                        id: uid,
                        email: email,
                        full_name: metadata?.full_name || 'Pilot',
                        study_seconds: 0,
                        trial_start_date: trialStartDate,
                        trial_subjects: TRIAL_SUBJECTS,
                        is_approved: isApproved
                    }])
                    .select()
                    .single();

                if (createError) {
                    console.error("Failed to create profile:", createError);
                } else {
                    profile = newProfile;
                    // Also ensure subscription exists
                    await supabase.from('subscriptions').insert([{ user_id: uid, plan: 'CUSTOM', status: 'inactive' }]);
                }
            }

            const { data: sub } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('user_id', uid)
                .single();

            let subTier: any = 'CUSTOM';
            let allowedSubjects: string[] = ['090']; // Default to 090 (Comms) always allowed
            let status: AuthStatus = AuthStatus.VERIFIED;

            // Check subscription status first
            const hasActiveSubscription = sub && sub.status === 'active';
            if (hasActiveSubscription) {
                status = AuthStatus.ACTIVE;
                subTier = sub.plan;
                if (sub.plan?.includes('PRO')) {
                    allowedSubjects = ['ALL'];
                }
            }

            if (profile) {
                // Initialize local study time from DB
                setStudyTime(profile.study_seconds || 0);

                // Check trial status if no active subscription
                let trialStartDate = profile.trial_start_date;
                let demoStartDate = profile.demo_start_date; // Check for demo
                let trialSubjects = profile.trial_subjects || TRIAL_SUBJECTS;
                let isTrialActive = false;
                let isTrialExpired = false;
                let isDemoActive = false;
                let isDemoExpired = false;

                if (trialStartDate && !hasActiveSubscription) {
                    const trialStart = new Date(trialStartDate);
                    const now = new Date();
                    const daysSinceTrialStart = Math.floor((now.getTime() - trialStart.getTime()) / (1000 * 60 * 60 * 24));

                    if (daysSinceTrialStart < TRIAL_DURATION_DAYS) {
                        isTrialActive = true;
                        allowedSubjects = trialSubjects;
                    } else {
                        isTrialExpired = true;
                    }
                }

                // Demo Logic (Overrides Trial)
                if (demoStartDate && !hasActiveSubscription) {
                    const demoStart = new Date(demoStartDate);
                    const now = new Date();
                    const hoursSinceDemoStart = (now.getTime() - demoStart.getTime()) / (1000 * 60 * 60);

                    if (hoursSinceDemoStart < 3) {
                        isDemoActive = true;
                        allowedSubjects = ['ALL']; // Full access for 3 hours
                        isTrialActive = false; // Demo takes precedence
                        isTrialExpired = false;
                    } else {
                        isDemoExpired = true;
                        isTrialActive = false;
                    }
                }

                // Determine final status
                let finalStatus: AuthStatus = status;

                // Priority: ACTIVE > DEMO > FREE_TRIAL > DEMO_EXPIRED > TRIAL_EXPIRED > PENDING_APPROVAL
                if (hasActiveSubscription) {
                    finalStatus = AuthStatus.ACTIVE;
                } else if (isDemoActive) {
                    finalStatus = AuthStatus.DEMO_PREVIEW;
                } else if (isDemoExpired) {
                    finalStatus = AuthStatus.DEMO_EXPIRED;
                } else if (isTrialActive) {
                    finalStatus = AuthStatus.FREE_TRIAL;
                } else if (isTrialExpired) {
                    finalStatus = AuthStatus.TRIAL_EXPIRED;
                } else if (!profile.is_approved && !profile.is_admin) {
                    finalStatus = AuthStatus.PENDING_APPROVAL;
                }

                setUser({
                    id: uid,
                    email: email,
                    fullName: profile.full_name,
                    status: finalStatus,
                    studySeconds: profile.study_seconds || 0,
                    subscriptionTier: subTier,
                    allowedSubjects: allowedSubjects,
                    isAdmin: profile.is_admin,
                    isApproved: profile.is_approved,
                    trialStartDate: trialStartDate,
                    demoStartDate: demoStartDate,
                    trialSubjects: trialSubjects
                });
            } else {
                // Fallback if profile creation failed completely
                setUser({
                    id: uid,
                    email: email,
                    fullName: 'Pilot',
                    status: AuthStatus.PENDING_APPROVAL,
                    studySeconds: 0,
                    subscriptionTier: 'CUSTOM',
                    allowedSubjects: [],
                    isAdmin: false,
                    isApproved: false
                });
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Study Timer Logic with Database Persistence
    // Keep track of study time for cleanup
    const studyTimeRef = React.useRef(studyTime);
    useEffect(() => {
        studyTimeRef.current = studyTime;
    }, [studyTime]);

    // Study Timer Logic with Database Persistence
    useEffect(() => {
        if (!user) return;

        const interval = setInterval(() => {
            setStudyTime(prev => {
                const newValue = prev + 1;
                // Periodically save to DB (every 30 seconds) to prevent data loss on crash
                if (newValue % 30 === 0) {
                    supabase.from('profiles')
                        .update({ study_seconds: newValue })
                        .eq('id', user.id)
                        .then(({ error }) => {
                            if (error) console.error("Failed to auto-save study time:", error);
                        });
                }
                return newValue;
            });
        }, 1000);

        return () => {
            clearInterval(interval);
            // Try to save on unmount if possible (best effort)
            supabase.from('profiles').update({ study_seconds: studyTimeRef.current }).eq('id', user.id);
        };
    }, [user?.id]); // Only restart if user ID changes (login/logout), not on every profile update

    const handleLogout = async () => {
        // Force save study time before logging out
        if (user) {
            await supabase.from('profiles').update({ study_seconds: studyTime }).eq('id', user.id);
        }
        await supabase.auth.signOut();
        setUser(null);
        setCurrentView(View.PLATFORM_DASHBOARD);
        setAuthInitialView('LOGIN');
    };

    const handleUserUpdate = (updatedUser: User) => {
        setUser(updatedUser);
    };

    // Helper to check subject access
    const isSubjectAllowed = (code: string) => {
        if (!user) return false;
        if (user.isAdmin) return true;
        if (user.status === AuthStatus.DEMO_PREVIEW) return true; // Explicit check
        if (user.allowedSubjects?.includes('ALL')) return true;
        return user.allowedSubjects?.includes(code);
    };

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (!user) {
        return (
            <React.Suspense fallback={<LoadingScreen />}>
                <AuthView
                    onAuthChange={setUser}
                    initialView={authInitialView}
                    onDemoLogin={() => {
                        setUser({
                            id: 'demo-user',
                            email: 'demo@atplvector.com',
                            fullName: 'Captain Demo',
                            status: AuthStatus.ACTIVE,
                            studySeconds: 3600,
                            subscriptionTier: 'PRO_MONTHLY',
                            allowedSubjects: ['ALL'],
                            isAdmin: false,
                            isApproved: true
                        });
                    }}
                />
            </React.Suspense>
        );
    }

    // Show pending approval screen for unapproved users
    if (user.status === AuthStatus.PENDING_APPROVAL) {
        const handleSubmitInviteCode = async () => {
            if (!pendingInviteCode.trim()) return;
            setIsSubmittingCode(true);
            setCodeError('');

            try {
                // Verify code
                const { data: codeData, error: codeError } = await supabase
                    .from('access_codes')
                    .select('*')
                    .eq('code', pendingInviteCode.trim().toUpperCase())
                    .eq('is_used', false)
                    .single();

                if (codeError || !codeData) throw new Error("Invalid or expired code.");

                // Mark code used
                await supabase.from('access_codes').update({
                    is_used: true,
                    used_by_user: user.id,
                    used_at: new Date().toISOString()
                }).eq('id', codeData.id);

                // Approve user AND reset trial start date so they get full 7 days from approval
                const { error: updateError } = await supabase
                    .from('profiles')
                    .update({
                        is_approved: true,
                        trial_start_date: new Date().toISOString()
                    })
                    .eq('id', user.id);

                if (updateError) throw updateError;

                // Refresh profile
                await fetchUserProfile(user.id, user.email || '');

            } catch (err: any) {
                setCodeError(err.message || "Failed to verify code.");
            } finally {
                setIsSubmittingCode(false);
            }
        };

        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500"></div>

                    <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-amber-500/10">
                        <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>

                    <h1 className="text-2xl font-bold text-white mb-3">Waitlist / Approval</h1>
                    <p className="text-slate-400 mb-6">
                        Hi <span className="text-white font-medium">{user.fullName || user.email}</span>, your account is awaiting admin approval.
                    </p>

                    {/* Invite Code Section */}
                    <div className="bg-slate-800/80 rounded-xl p-5 mb-6 border border-slate-700">
                        <h3 className="text-sm font-bold text-slate-300 uppercase mb-3 flex items-center justify-center gap-2">
                            Skip the queue
                        </h3>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={pendingInviteCode}
                                onChange={e => setPendingInviteCode(e.target.value.toUpperCase())}
                                placeholder="ENTER-CODE"
                                className="flex-1 bg-slate-950 border border-slate-600 rounded-lg px-3 py-2 text-white font-mono text-center uppercase tracking-widest focus:border-blue-500 outline-none"
                            />
                            <button
                                onClick={handleSubmitInviteCode}
                                disabled={isSubmittingCode || !pendingInviteCode}
                                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-bold"
                            >
                                {isSubmittingCode ? '...' : 'Go'}
                            </button>
                        </div>
                        {codeError && <p className="text-red-400 text-xs mt-2 font-medium">{codeError}</p>}
                    </div>

                    <div className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-slate-700/50">
                        <p className="text-sm text-slate-500">Need help? Contact</p>
                        <a href="mailto:support@atplvector.com" className="text-blue-400 hover:text-blue-300 font-medium text-sm">support@atplvector.com</a>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors border border-slate-600 hover:text-white"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        );
    }



    // Show Demo Expired Screen
    if (user.status === AuthStatus.DEMO_EXPIRED) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-700">
                        <Clock className="w-8 h-8 text-slate-400" />
                    </div>

                    <h1 className="text-2xl font-bold text-white mb-3">Demo Preview Ended</h1>
                    <p className="text-slate-400 mb-6">
                        We hope you enjoyed your 3-hour preview flight, <span className="text-white font-medium">{user.fullName}</span>.
                        To continue your training, please upgrade to a full account.
                    </p>

                    <div className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-slate-700">
                        <p className="text-sm text-slate-500 font-medium mb-3">Ready to upgrade?</p>
                        <button
                            onClick={() => {
                                // Allow mostly to view subscription page, or redirect to external payment
                                alert("Please contact sales@atplvector.com to upgrade your account.");
                            }}
                            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            Contact Sales
                        </button>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors border border-slate-600"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        );
    }

    // Show trial expired screen for users whose trial has ended
    if (user.status === AuthStatus.TRIAL_EXPIRED) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center shadow-2xl">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-3">Free Trial Expired</h1>
                    <p className="text-slate-400 mb-6">
                        Your 7-day free trial has ended, <span className="text-white font-medium">{user.fullName || user.email}</span>!
                        Subscribe now to continue accessing all ATPL training modules.
                    </p>
                    <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl p-4 mb-6 border border-blue-500/20">
                        <p className="text-sm text-blue-300 font-medium mb-2">🎓 What you'll get:</p>
                        <ul className="text-xs text-slate-400 space-y-1 text-left">
                            <li>• Access to all 14 ATPL subjects</li>
                            <li>• Interactive simulators & visualizers</li>
                            <li>• AI-powered roleplay & quizzes</li>
                            <li>• Progress tracking & flashcards</li>
                        </ul>
                    </div>
                    <button
                        onClick={() => {
                            // Allow user to access subscription page
                            setUser({ ...user, status: AuthStatus.VERIFIED });
                            setCurrentView(View.SUBSCRIPTION_MANAGEMENT);
                        }}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg mb-3"
                    >
                        View Subscription Plans
                    </button>
                    <div className="bg-slate-800/50 rounded-xl p-4 mb-4 border border-slate-700">
                        <p className="text-sm text-slate-500">Need help? Contact us at:</p>
                        <a href="mailto:support@atplvector.com" className="text-blue-400 hover:text-blue-300 font-medium">support@atplvector.com</a>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors border border-slate-600"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        );
    }

    const NavButton = ({ view, label, icon: Icon, labelClassName = "" }: any) => (
        <button
            onClick={() => {
                navigateTo(view);
                setMobileMenuOpen(false);
            }}
            className={`flex items-center space-x-2 px-3 xl:px-4 py-2 rounded-full transition-all duration-300 text-sm font-medium ${currentView === view
                ? 'bg-blue-600/90 text-white shadow-lg shadow-blue-500/30 ring-1 ring-blue-400/50'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
        >
            {Icon && <Icon size={16} />}
            <span className={labelClassName}>{label}</span>
        </button>
    );

    const MenuNavItem = ({ view, label, icon: Icon, color = "text-slate-300", bgColor = "bg-transparent" }: any) => {
        const active = currentView === view;
        return (
            <button
                onClick={() => {
                    navigateTo(view);
                    setMainMenuOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl group ${active
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
            >
                <div className={`p-2 rounded-xl ${active ? 'bg-white/20' : `${bgColor} ${color} group-hover:bg-white/10`}`}>
                    <Icon size={18} />
                </div>
                <span className={`text-sm font-bold tracking-tight ${active ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>{label}</span>
                {active && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>}
            </button>
        );
    };

    const handleOpenSyllabus = (subjectId: string) => {
        setSelectedSubjectId(subjectId);
        navigateTo(View.SYLLABUS_VIEWER);
    };

    // Sidebar Config Logic
    const subjectConfig = getSubjectConfig(currentView);

    const appContent = (
        <ContentProtection userId={user.id}>
            <div className="min-h-screen font-sans text-slate-100 selection:bg-blue-500/30 selection:text-white bg-slate-950">

                {/* Immersive Background Effects */}
                {/* <StarfieldBackground /> - Disabled for performance */}
                {/* <GlowOrbs /> - Disabled for performance */}

                {/* Modern Floating Navbar */}
                <div className="fixed top-0 w-full z-50 px-4 py-4 pointer-events-none">
                    {/* OPTIMIZATION: Removed backdrop-blur-xl for performance */}
                    <nav className="pointer-events-auto max-w-7xl mx-auto bg-slate-900 border border-white/10 rounded-2xl shadow-2xl">
                        <div className="px-6 h-16 flex items-center justify-between">

                            {/* Logo */}
                            <div className="flex items-center gap-4">
                                {subjectConfig && (
                                    <button
                                        onClick={() => setSidebarOpen(!sidebarOpen)}
                                        className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg"
                                    >
                                        <BookOpen size={20} />
                                    </button>
                                )}
                                <div
                                    className="flex items-center space-x-3 cursor-pointer group"
                                    onClick={() => navigateTo(View.PLATFORM_DASHBOARD)}
                                >
                                    <div className="p-1.5 w-9 h-9 bg-slate-900/50 rounded-lg shadow-lg group-hover:shadow-blue-500/20 transition-all duration-500 group-hover:scale-105 border border-white/10 flex items-center justify-center overflow-hidden">
                                        <img src="/assets/logo.png" alt="Logo" className="w-full h-full object-contain" />
                                    </div>
                                    <span className="text-lg font-black tracking-tight text-white whitespace-nowrap">
                                        ATPL<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">VECTOR</span>
                                    </span>
                                </div>

                                {/* Navigation Back/Forward */}
                                <NavigationBar
                                    canGoBack={canGoBack}
                                    canGoForward={canGoForward}
                                    onBack={goBack}
                                    onForward={goForward}
                                />
                            </div>

                            {/* Global Action Bar */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCommandPaletteOpen(true)}
                                    className="hidden sm:flex p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all items-center gap-2 px-3 border border-white/5"
                                    title="Command Palette (Ctrl+K)"
                                >
                                    <Search size={18} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest hidden lg:inline">Search</span>
                                </button>

                                <div className="h-8 w-px bg-white/10 mx-1 hidden sm:block"></div>

                                <div
                                    onClick={() => navigateTo(View.PROFILE)}
                                    className="flex items-center space-x-3 cursor-pointer group pl-2"
                                >
                                    <div className="w-9 h-9 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl flex items-center justify-center text-xs font-bold text-white border border-white/10 group-hover:border-blue-500/50 transition-colors shadow-lg">
                                        {user.email.substring(0, 2).toUpperCase()}
                                    </div>
                                </div>

                                <button
                                    onClick={() => setMainMenuOpen(true)}
                                    className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 group ml-2 active:scale-95"
                                >
                                    <Menu size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                                    <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Portal</span>
                                </button>
                            </div>
                        </div>

                    </nav>
                </div>

                {/* Mobile Subject Sidebar (Drawer) */}
                {
                    subjectConfig && sidebarOpen && (
                        <div className="fixed inset-0 z-40 lg:hidden">
                            {/* OPTIMIZATION: Removed backdrop-blur-sm */}
                            <div className="absolute inset-0 bg-black/80" onClick={() => setSidebarOpen(false)}></div>
                            <div className="absolute top-0 left-0 bottom-0 w-72 bg-slate-900 border-r border-slate-700 pt-24 pb-safe animate-in slide-in-from-left">
                                <SubjectSidebar
                                    config={subjectConfig}
                                    currentView={currentView}
                                    onNavigate={navigateTo}
                                    onClose={() => setSidebarOpen(false)}
                                />
                            </div>
                        </div>
                    )
                }

                {/* Main Content Area */}
                <main className="pt-32 md:pt-36 min-h-screen px-4 pb-20">
                    <div className="max-w-7xl mx-auto flex gap-8">
                        {/* Desktop Sidebar */}
                        {subjectConfig && (
                            <div className="hidden lg:block w-64 shrink-0 sticky top-36 h-[calc(100vh-140px)]">
                                <SubjectSidebar
                                    config={subjectConfig}
                                    currentView={currentView}
                                    onNavigate={navigateTo}
                                />
                            </div>
                        )}

                        <div className="flex-1 min-w-0">
                            <React.Suspense fallback={<div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>}>
                                <AnimatePresence mode="wait">
                                    <AnimatedPageWrapper key={currentView}>
                                        {/* --- PLATFORM LEVEL --- */}
                                        {currentView === View.PLATFORM_DASHBOARD && (
                                            <div>
                                                <PlatformDashboard onChangeView={navigateTo} studyTime={studyTime} user={user} />
                                                <div className="px-2 md:px-0 mt-12 mb-8">
                                                    <PlatformProgress />
                                                </div>
                                            </div>
                                        )}
                                        {currentView === View.PROFILE && (
                                            <UserProfile
                                                user={user}
                                                studyTime={studyTime}
                                                onLogout={handleLogout}
                                                onUpdateUser={handleUserUpdate}
                                                onNavigate={navigateTo}
                                            />
                                        )}
                                        {currentView === View.ACCOUNT_SETTINGS && (
                                            <AccountSettings user={user} onBack={() => setCurrentView(View.PROFILE)} />
                                        )}

                                        {currentView === View.FLASHCARDS && <FlashcardSystem />}
                                        {currentView === View.SUBSCRIPTION_MANAGEMENT && (
                                            <SubscriptionManagement
                                                user={user}
                                                onUpdateUser={handleUserUpdate}
                                                onBack={() => setCurrentView(View.PLATFORM_DASHBOARD)}
                                            />
                                        )}
                                        {currentView === View.ADMIN_DASHBOARD && user.isAdmin && (
                                            <AdminDashboard currentUser={user} onBack={() => setCurrentView(View.PLATFORM_DASHBOARD)} />
                                        )}
                                        {currentView === View.STUDY_GUIDE && (
                                            <StudyGuide
                                                onBack={() => setCurrentView(View.PLATFORM_DASHBOARD)}
                                                onChangeView={navigateTo}
                                            />
                                        )}
                                        {currentView === View.QUESTION_BANK && (
                                            <QuestionBank
                                                onChangeView={navigateTo}
                                            />
                                        )}
                                        {currentView === View.EXAM_PLANNER && <ExamPlanner currentUser={user} />}
                                        {currentView === View.PROGRESS_DASHBOARD && (
                                            <ProgressDashboard
                                                onChangeView={navigateTo}
                                                onOpenSyllabus={handleOpenSyllabus}
                                            />
                                        )}

                                        {/* --- SUBJECT MODULES --- */}
                                        {/* Air Law */}
                                        {currentView === View.AIR_LAW_HOME && <AirLawDashboard onChangeView={navigateTo} isLocked={!isSubjectAllowed('010')} onOpenSyllabus={handleOpenSyllabus} />}
                                        {currentView === View.AIR_LAW_INT_LAW && <InternationalLaw />}
                                        {currentView === View.AIR_LAW_ORG && <AviationOrganisations />}
                                        {currentView === View.AIR_LAW_LIABILITY && <LiabilityAndRights />}
                                        {currentView === View.AIR_LAW_ANNEXES && <AnnexList />}
                                        {currentView === View.AIR_LAW_PERSONNEL && <PersonnelLicensing />}
                                        {currentView === View.AIR_LAW_AIRWORTHINESS && <AirworthinessAndOps />}
                                        {currentView === View.AIR_LAW_REGISTRATION && <AircraftRegistration />}
                                        {currentView === View.AIR_LAW_DOCS && <DocumentsOnboard />}
                                        {currentView === View.AIR_LAW_RULES_DETAILS && <RulesOfTheAirDetails />}
                                        {currentView === View.AIR_LAW_RULES_OF_AIR && <AirLawRightOfWay />}
                                        {currentView === View.AIR_LAW_CRUISING && <CruisingLevelTool />}
                                        {currentView === View.AIR_LAW_INTERCEPT && <InterceptionProcedures />}
                                        {currentView === View.AIR_LAW_LIGHTGUN && <LightGunSignals />}
                                        {currentView === View.AIR_LAW_LAYERS && <AirspaceLayers />}
                                        {currentView === View.AIR_LAW_IFR_VFR && <IFRVFRExplorer />}
                                        {currentView === View.AIR_LAW_INSTRUMENT && <InstrumentApproach />}
                                        {currentView === View.AIR_LAW_PANS_OPS && <PansOpsProcedures />}
                                        {currentView === View.AIR_LAW_HOLDING && <HoldingPatternEntry />}
                                        {currentView === View.AIR_LAW_ALTIMETER && <AltimeterVisualizer />}
                                        {currentView === View.AIR_LAW_REF_CODE && <AerodromeReferenceCode />}
                                        {currentView === View.AIR_LAW_SURFACE_CON && <SurfaceContamination />}
                                        {currentView === View.AIR_LAW_LIGHTING && <AerodromeLightingSummary />}
                                        {currentView === View.AIR_LAW_AERODROME_VIS && <AerodromeVisualizer />}
                                        {currentView === View.AIR_LAW_SIGNS && <SignsAndSignals />}
                                        {currentView === View.AIR_LAW_GROUND_OPS && <GroundOperations />}
                                        {currentView === View.AIR_LAW_RWSL && <RWSL />}
                                        {currentView === View.AIR_LAW_TVASIS && <TVasisVisualizer />}
                                        {currentView === View.AIR_LAW_DECLARED_DIST && <DeclaredDistances />}
                                        {currentView === View.AIR_LAW_OPS_INFO && <OperationalInfo />}
                                        {currentView === View.AIR_LAW_SECURITY && <SecuritySection />}
                                        {currentView === View.AIR_LAW_ACCIDENT && <AccidentInvestigation />}
                                        {currentView === View.AIR_LAW_SAR && <SearchAndRescue />}
                                        {currentView === View.AIR_LAW_EMERGENCY && <EmergencyProcedures />}
                                        {currentView === View.AIR_LAW_FACILITATION && <AirLawFacilitation />}
                                        {currentView === View.AIR_LAW_PARALLEL_RWY && <AirLawParallelRunway />}
                                        {currentView === View.AIR_LAW_AIS_DEEP_DIVE && <AirLawAISDeepDive />}
                                        {currentView === View.AIR_LAW_CONVENTIONS && <AirLawConventions />}

                                        {/* AGK */}

                                        {/* --- AGK (021) Systems (Wrapped in Layout) --- */}
                                        {[
                                            View.AGK_SYSTEMS_HOME, View.AGK_PISTON_ENGINE, View.AGK_JET_ENGINE,
                                            View.AGK_ELECTRICS, View.AGK_HYDRAULICS
                                        ].includes(currentView) ? (
                                            <div className="w-full animate-in fade-in duration-500">
                                                {currentView === View.AGK_SYSTEMS_HOME && (
                                                    <AGKSystemsDashboard
                                                        currentView={currentView}
                                                        setCurrentView={navigateTo}
                                                        isLocked={!isSubjectAllowed('021')}
                                                    />
                                                )}
                                                {currentView === View.AGK_HYDRAULICS && <HydraulicSystemAnim />}
                                                {currentView === View.AGK_JET_ENGINE && <JetEnginePrinciples />}
                                                {currentView === View.AGK_ELECTRICS && <ElectricsSystem />}
                                                {currentView === View.AGK_PISTON_ENGINE && <PistonEnginePrinciples />}
                                            </div>
                                        ) : null}

                                        {/* Instrumentation (022) */}
                                        {currentView === View.INST_HOME && <InstrumentationDashboard onChangeView={navigateTo} isLocked={!isSubjectAllowed('022')} />}
                                        {currentView === View.INST_PITOT_STATIC && <PitotStaticSystem />}
                                        {currentView === View.INST_ALTIMETER && <InstAltimeterLab />}
                                        {currentView === View.INST_ASI && <AirspeedIndicator />}
                                        {currentView === View.INST_VSI && <VSILab />}
                                        {currentView === View.INST_MACHMETER && <Machmeter />}
                                        {currentView === View.INST_GYROS && <GyroPrinciples />}
                                        {currentView === View.INST_TURN_INDICATOR && <TurnIndicator />}
                                        {currentView === View.INST_DG && <DirectionalGyro />}
                                        {currentView === View.INST_ATTITUDE && <AttitudeIndicator />}
                                        {currentView === View.INST_COMPASS && <MagneticCompass />}
                                        {currentView === View.INST_RADIO_ALT && <RadioAltimeter />}
                                        {currentView === View.INST_NAV_SYSTEMS && <NavigationSystems />}
                                        {currentView === View.INST_FMS_EFIS && <FMSEFIS />}
                                        {currentView === View.INST_GPWS && <GPWSSystem />}
                                        {currentView === View.INST_AUTOPILOT && <AutopilotSystem />}
                                        {currentView === View.INST_AUTOLAND && <AutolandSystem />}

                                        {/* HPL */}
                                        {currentView === View.HPL_HOME && (
                                            <GenericSubjectDashboard
                                                subjectCode="040" subjectName="Human Performance" color="emerald"
                                                description="Physiology, psychology, sleep, stress, and error management."
                                                icon={Users} onChangeView={navigateTo}
                                                modules={[
                                                    { title: 'Physiology', desc: 'Hypoxia, Respiration, Circulation.', view: View.HPL_PHYSIOLOGY, isLocked: !isSubjectAllowed('040') },
                                                    { title: 'Basic Concepts', desc: 'Accident stats, TEM, Safety Culture.', view: View.HPL_BASIC_CONCEPTS, isLocked: !isSubjectAllowed('040') },
                                                    { title: 'Sleep & Rhythms', desc: 'Circadian rhythms, Jet Lag, Sleep Stages.', view: View.HPL_SLEEP, isLocked: !isSubjectAllowed('040') },
                                                    { title: 'Information Processing', desc: 'Attention, Vigilance, Situation Awareness.', view: View.HPL_INFO_PROCESSING, isLocked: !isSubjectAllowed('040') },
                                                    { title: 'Error & Decision', desc: 'Error models, FOR-DEC, Error Chains.', view: View.HPL_ERROR_DECISION, isLocked: !isSubjectAllowed('040') },
                                                    { title: 'Cockpit Mgmt & CRM', desc: 'SOPs, Group Dynamics, Synergy.', view: View.HPL_COCKPIT_MGMT, isLocked: !isSubjectAllowed('040') },
                                                    { title: 'Comms & Stress', desc: 'Communication models, Stress, Workload.', view: View.HPL_COMMS_STRESS, isLocked: !isSubjectAllowed('040') },
                                                    { title: 'Human Behaviour', desc: 'Hazardous Attitudes, Leadership, Crew.', view: View.HPL_BEHAVIOUR, isLocked: !isSubjectAllowed('040') },
                                                    { title: 'Vision', desc: 'Eye anatomy, Scanning, and Visual Illusions.', view: View.HPL_VISION, isLocked: !isSubjectAllowed('040') },
                                                    { title: 'Hearing', desc: 'The Ear, Vestibular System, Spatial Disorientation.', view: View.HPL_HEARING, isLocked: !isSubjectAllowed('040') },
                                                    { title: 'Health', desc: 'Gas Laws, Hypoxia, TUC, Barotrauma.', view: View.HPL_HEALTH, isLocked: !isSubjectAllowed('040') },
                                                    { title: 'TEM Model', desc: 'Threats, Errors, UAS, and Countermeasures.', view: View.HPL_TEM, isLocked: !isSubjectAllowed('040') },
                                                    { title: 'SHELL Model', desc: 'Software, Hardware, Environment, Liveware.', view: View.HPL_SHELL, isLocked: !isSubjectAllowed('040') },
                                                    { title: 'Safety Culture', desc: 'Swiss Cheese, Just Culture, SMS.', view: View.HPL_SAFETY, isLocked: !isSubjectAllowed('040') },
                                                    { title: 'Acceleration', desc: 'G-Forces, G-LOC, Protections.', view: View.HPL_ACCELERATION, isLocked: !isSubjectAllowed('040') },
                                                    { title: 'Toxic Hazards', desc: 'CO, Alcohol, Smoking, Drugs.', view: View.HPL_TOXIC, isLocked: !isSubjectAllowed('040') },
                                                    { title: 'Automation', desc: 'Levels, Irony, Mode Confusion.', view: View.HPL_AUTOMATION },
                                                    { title: 'Vestibular', desc: 'Leans, Coriolis, Somatogravic.', view: View.HPL_VESTIBULAR },
                                                    { title: 'Memory', desc: 'Sensory, STM, LTM, Motor Programs.', view: View.HPL_MEMORY },
                                                    { title: 'Respiration', desc: 'Lungs, Gas Exchange, Control.', view: View.HPL_RESPIRATION },
                                                    { title: 'Circulation', desc: 'Heart, Blood, BP.', view: View.HPL_CIRCULATION },
                                                    { title: 'Nervous System', desc: 'CNS, PNS, Autonomic.', view: View.HPL_NERVOUS },
                                                    { title: 'Metabolism', desc: 'BMR, Blood Sugar, BMI.', view: View.HPL_METABOLISM },
                                                    { title: 'Ergonomics', desc: 'Anthropometry, DEP, Biomechanics.', view: View.HPL_ERGONOMICS },
                                                    { title: 'Biases', desc: 'Confirmation, Sunk Cost, Gambler.', view: View.HPL_BIASES },
                                                    { title: 'Culture', desc: 'Hofstede, Safety Culture, SMS.', view: View.HPL_CULTURE },
                                                    { title: 'Radiation', desc: 'Cosmic, Solar, Ozone.', view: View.HPL_RADIATION },
                                                    { title: 'Thermal', desc: 'Hypothermia, Heat Stroke, Reg.', view: View.HPL_THERMAL },
                                                    { title: 'Sleep Disorders', desc: 'Apnea, Insomnia, Narcolepsy.', view: View.HPL_SLEEP_DISORDERS },
                                                    { title: 'Pressure Effects', desc: 'Barotrauma, Decompression, TUC.', view: View.HPL_PRESSURE },
                                                    { title: 'Motion Sickness', desc: 'Sensory Conflict, Prevention.', view: View.HPL_MOTION_SICKNESS },
                                                    { title: 'Perception', desc: 'Visual Illusions, Runway Illusions.', view: View.HPL_PERCEPTION },
                                                    { title: 'Workload', desc: 'Yerkes-Dodson, ANC, DODAR.', view: View.HPL_WORKLOAD },
                                                    { title: 'Incapacitation', desc: 'Procedures, 2-Comms Rule, Fume Events.', view: View.HPL_INCAPACITATION },
                                                    { title: 'Communication Process', desc: 'Models, Barriers, Readback.', view: View.HPL_COMMUNICATION_PROCESS },
                                                    { title: 'Competency', desc: 'KSA, Core Competencies.', view: View.HPL_COMPETENCY },
                                                    { title: 'Cooperation', desc: 'Group Dynamics, Synergy.', view: View.HPL_COOPERATION },
                                                    { title: 'Health & Hygiene', desc: 'Alcohol, Drugs, Diet & Hygiene.', view: View.HPL_HEALTH_HYGIENE },
                                                    { title: 'Tropical Diseases', desc: 'Infectious diseases and travel health.', view: View.HPL_TROPICAL_DISEASES },
                                                ]}
                                                onOpenSyllabus={handleOpenSyllabus}
                                            />
                                        )}
                                        {currentView === View.HPL_PHYSIOLOGY && <HumanPhysiology />}
                                        {currentView === View.HPL_BASIC_CONCEPTS && <HumanFactorsIntro />}
                                        {currentView === View.HPL_SLEEP && <SleepAndRhythms />}
                                        {currentView === View.HPL_INFO_PROCESSING && <InformationProcessing />}
                                        {currentView === View.HPL_ERROR_DECISION && <ErrorAndDecision />}
                                        {currentView === View.HPL_COCKPIT_MGMT && <CockpitManagement />}
                                        {currentView === View.HPL_COMMS_STRESS && <CommunicationAndStress />}
                                        {currentView === View.HPL_BEHAVIOUR && <HumanBehaviour />}
                                        {currentView === View.HPL_VISION && <HPLVision />}
                                        {currentView === View.HPL_HEARING && <HPLHearing />}
                                        {currentView === View.HPL_HEALTH && <HPLHealth />}
                                        {currentView === View.HPL_TEM && <HPLTEM />}
                                        {currentView === View.HPL_SHELL && <HPLShell />}
                                        {currentView === View.HPL_SAFETY && <HPLSafetyCulture />}
                                        {currentView === View.HPL_ACCELERATION && <HPLAcceleration />}
                                        {currentView === View.HPL_TOXIC && <HPLToxicHazards />}
                                        {currentView === View.HPL_AUTOMATION && <HPLAutomation />}
                                        {currentView === View.HPL_VESTIBULAR && <HPLVestibular />}
                                        {currentView === View.HPL_MEMORY && <HPLMemory />}
                                        {currentView === View.HPL_RESPIRATION && <HPLRespiration />}
                                        {currentView === View.HPL_CIRCULATION && <HPLCirculation />}
                                        {currentView === View.HPL_NERVOUS && <HPLNervousSystem />}
                                        {currentView === View.HPL_METABOLISM && <HPLMetabolism />}
                                        {currentView === View.HPL_ERGONOMICS && <HPLErgonomics />}
                                        {currentView === View.HPL_BIASES && <HPLBiases />}
                                        {currentView === View.HPL_CULTURE && <HPLCulture />}
                                        {currentView === View.HPL_RADIATION && <HPLRadiation />}
                                        {currentView === View.HPL_THERMAL && <HPLThermal />}
                                        {currentView === View.HPL_SLEEP_DISORDERS && <HPLSleepDisorders />}
                                        {currentView === View.HPL_WORKLOAD && <HPLWorkload />}
                                        {currentView === View.HPL_PERSONALITY && <HPLPersonality />}
                                        {currentView === View.HPL_LEARNING && <HPLLearning />}
                                        {currentView === View.HPL_PERCEPTION && <HPLPerception />}
                                        {currentView === View.HPL_COMMUNICATION_PROCESS && <HPLCommunicationProcess onNavigate={navigateTo} />}
                                        {currentView === View.HPL_COOPERATION && <HPLCooperation onNavigate={navigateTo} />}
                                        {currentView === View.HPL_COMPETENCY && <HPLCompetency onNavigate={navigateTo} />}
                                        {currentView === View.HPL_MOTION_SICKNESS && <HPLMotionSickness />}
                                        {currentView === View.HPL_PRESSURE && <HPLPressure />}
                                        {currentView === View.HPL_ATMOSPHERE && <HPLAtmosphere />}
                                        {currentView === View.HPL_HEALTH_HYGIENE && <HPLHealthHygiene onNavigate={navigateTo} />}
                                        {currentView === View.HPL_INCIDENTS && <HPLIncidents />}


                                        {currentView === View.HPL_TROPICAL_DISEASES && <HPLTropicalDiseases onNavigate={navigateTo} />}

                                        {/* Gen Nav (061) */}
                                        {currentView === View.GEN_NAV_HOME && <GenNavDashboard currentView={currentView} setCurrentView={navigateTo} isLocked={!isSubjectAllowed('061')} />}
                                        {/* --- METEOROLOGY SECTION (Wrapped in Layout) --- */}
                                        {[
                                            View.MET_HOME, View.MET_ATMOSPHERE, View.MET_PRESSURE, View.MET_DENSITY,
                                            View.MET_TEMPERATURE, View.MET_ALTIMETRY, View.MET_WIND, View.MET_CIRCULATION, View.MET_HUMIDITY,
                                            View.MET_PRECIPITATION, View.MET_FRONTS, View.MET_THUNDERSTORMS, View.MET_ICING,
                                            View.MET_VISIBILITY, View.MET_AIR_MASSES, View.MET_TURBULENCE,
                                            View.MET_JET_STREAMS, View.MET_CLIMATOLOGY, View.MET_LOCAL_WINDS,
                                            View.MET_DEPRESSIONS_ANTICYCLONES, View.MET_CLOUD_TYPES, View.MET_METAR_TAF,
                                            View.MET_CHARTS, View.MET_TRS, View.MET_SPECIAL_HAZARDS, View.MET_SATELLITE,
                                            View.MET_OPTICAL, View.MET_STATION_MODEL
                                        ].includes(currentView) ? (
                                            <div className="w-full animate-in fade-in duration-500">
                                                {currentView === View.MET_HOME && <MetDashboard onChangeView={navigateTo} />}
                                                {currentView === View.MET_ATMOSPHERE && <AtmosphereLayers />}
                                                {currentView === View.MET_TEMPERATURE && <AtmosphereMaster />}
                                                {currentView === View.MET_PRESSURE && <PressureSystems />}
                                                {currentView === View.MET_DENSITY && <Density />}
                                                {currentView === View.MET_ALTIMETRY && <Altimetry />}
                                                {currentView === View.MET_WIND && <WindSystems />}
                                                {currentView === View.MET_CIRCULATION && <GeneralCirculation />}
                                                {currentView === View.MET_HUMIDITY && <HumidityLab />}
                                                {currentView === View.MET_PRECIPITATION && <Precipitation />}
                                                {currentView === View.MET_FRONTS && <FrontalSystems />}
                                                {currentView === View.MET_THUNDERSTORMS && <Thunderstorms />}
                                                {currentView === View.MET_ICING && <Icing />}
                                                {currentView === View.MET_VISIBILITY && <VisibilityFog />}
                                                {currentView === View.MET_AIR_MASSES && <AirMasses />}
                                                {currentView === View.MET_TURBULENCE && <Turbulence />}
                                                {currentView === View.MET_JET_STREAMS && <JetStreams />}
                                                {currentView === View.MET_CLIMATOLOGY && <Climatology />}
                                                {currentView === View.MET_LOCAL_WINDS && <LocalWinds />}
                                                {currentView === View.MET_DEPRESSIONS_ANTICYCLONES && <DepressionsAnticyclones />}
                                                {currentView === View.MET_CLOUD_TYPES && <CloudTypes />}
                                                {currentView === View.MET_METAR_TAF && <MetarTafDecoder />}
                                                {currentView === View.MET_CHARTS && <WeatherCharts />}
                                                {currentView === View.MET_TRS && <TropicalStorms />}
                                                {currentView === View.MET_SPECIAL_HAZARDS && <SpecialHazards />}
                                                {currentView === View.MET_SATELLITE && <SatelliteRadar />}
                                                {currentView === View.MET_OPTICAL && <OpticalPhenomena />}
                                                {currentView === View.MET_STATION_MODEL && <StationModels />}
                                            </div>
                                        ) : null}

                                        {/* --- GEN NAV / RADIO NAV --- */}
                                        {currentView === View.GEN_NAV_SOLAR && <SolarCalc onNavigate={navigateTo} />}
                                        {currentView === View.GEN_NAV_MAPS && <MapProjections onNavigate={navigateTo} />}
                                        {currentView === View.GEN_NAV_WIND_TRIANGLE && <WindTriangle onNavigate={navigateTo} />}
                                        {currentView === View.GEN_NAV_POLAR && <PolarGrid onNavigate={navigateTo} />}
                                        {currentView === View.NAV_60_1 && <OneInSixty />}
                                        {/* Radio Nav */}
                                        {currentView === View.RAD_NAV_HOME && (
                                            <GenericSubjectDashboard
                                                subjectCode="062" subjectName="Radio Navigation" color="sky"
                                                description="Radio aids, radar, GNSS, area navigation systems."
                                                icon={Wifi} onChangeView={navigateTo}
                                                modules={[
                                                    // Phase 1: Basics
                                                    { title: 'Class 1: Fundamentals', desc: 'Waves, Spectrum, Modulation, Propagation (New).', view: View.RAD_NAV_CLASS_1 },
                                                    { title: 'Wave Propagation', desc: 'Wavelength, Frequency, Amplitude visualized.', view: View.RAD_NAV_WAVE_PROP },
                                                    { title: 'Spectrum Explorer', desc: 'VLF to EHF bands and aviation usage.', view: View.RAD_NAV_SPECTRUM },
                                                    { title: 'Ionosphere', desc: 'Sky wave propagation, layers and skip distance.', view: View.RAD_NAV_IONOSPHERE },
                                                    { title: 'Antenna Theory', desc: 'Radiation patterns, dipoles and loops.', view: View.RAD_NAV_ANTENNA },
                                                    { title: 'Modulation', desc: 'AM, FM, Phase and Pulse modulation.', view: View.RAD_NAV_MODULATION },

                                                    // Phase 2: Radio Aids
                                                    { title: 'VOR Simulator', desc: 'CDI, TO/FROM, Radial Interception.', view: View.RAD_NAV_VOR },
                                                    { title: 'ADF/NDB', desc: 'RBI/RMI tracking and homing.', view: View.RAD_NAV_ADF },
                                                    { title: 'DME', desc: 'Slant range vs Ground distance.', view: View.RAD_NAV_DME },
                                                    { title: 'ILS Approach', desc: 'Localizer and Glidepath lobes.', view: View.RAD_NAV_ILS },
                                                    { title: 'VDF', desc: 'QDM/QDR and homing.', view: View.RAD_NAV_VDF },
                                                    { title: 'MLS', desc: 'Microwave Landing System TRSB.', view: View.RAD_NAV_MLS },

                                                    // Phase 3: Radar & Advanced
                                                    { title: 'Weather Radar', desc: 'Tilt, Iso-Echo, Attenuation and shadows.', view: View.RAD_NAV_WX_RADAR },
                                                    { title: 'Radar Theory', desc: 'Pulse technique, PRF, PRI.', view: View.RAD_NAV_RADAR },
                                                    { title: 'SSR Transponder', desc: 'Mode A/C/S, Codes and Interrogation.', view: View.RAD_NAV_SSR },
                                                    { title: 'GNSS Principles', desc: 'GPS, GLONASS, GALILEO satellites.', view: View.NAV_GNSS },
                                                    { title: 'SBAS/ABAS', desc: 'EGNOS, WAAS and augmentation.', view: View.RAD_NAV_SBAS },
                                                    { title: 'RNAV/PBN', desc: 'Area Navigation and Kalman Filtering.', view: View.RAD_NAV_RNAV },
                                                    { title: 'FMS Trainer', desc: 'CDU/MCDU Waypoint entry.', view: View.RAD_NAV_FMS },
                                                ]}
                                                onOpenSyllabus={handleOpenSyllabus}
                                            />
                                        )}

                                        {currentView === View.NAV_GNSS && <GNSSTheory />}
                                        {currentView === View.RAD_NAV_WAVE_PROP && <WavePropVisualizer />}
                                        {currentView === View.RAD_NAV_SPECTRUM && <SpectrumExplorer />}
                                        {currentView === View.RAD_NAV_IONOSPHERE && <IonosphereSim />}
                                        {currentView === View.RAD_NAV_ANTENNA && <AntennaTheory />}
                                        {currentView === View.RAD_NAV_MODULATION && <Modulation />}
                                        {currentView === View.RAD_NAV_VOR && <VORSystem onNavigate={navigateTo} />}
                                        {currentView === View.RAD_NAV_ADF && <NDBADFSystem onNavigate={navigateTo} />}
                                        {currentView === View.RAD_NAV_DME && <DMESystem onNavigate={navigateTo} />}
                                        {currentView === View.RAD_NAV_ILS && <ILSSystem onNavigate={navigateTo} />}
                                        {currentView === View.RAD_NAV_VDF && <VDF />}
                                        {currentView === View.RAD_NAV_MLS && <MLS />}
                                        {currentView === View.RAD_NAV_RADAR && <RadarTheory />}
                                        {currentView === View.RAD_NAV_WX_RADAR && <WeatherRadar onNavigate={navigateTo} />}
                                        {currentView === View.RAD_NAV_SSR && <SSRTransponder />}
                                        {currentView === View.RAD_NAV_SBAS && <SbasAbas />}
                                        {currentView === View.RAD_NAV_RNAV && <RnavPbn />}
                                        {currentView === View.RAD_NAV_FMS && <FMSTrainer />}
                                        {currentView === View.RAD_NAV_CLASS_1 && <RadioFundamentals onNavigate={navigateTo} />}

                                        {/* PoF */}
                                        {currentView === View.POF_HOME && (
                                            <GenericSubjectDashboard
                                                subjectCode="081" subjectName="Principles of Flight" color="violet"
                                                description="Subsonic aerodynamics, stability, control, lift, drag."
                                                icon={PlaneIcon} onChangeView={navigateTo}
                                                modules={[
                                                    { title: 'Atmosphere', desc: 'ISA properties: Temperature, Pressure, Density.', view: View.POF_ATMOSPHERE },
                                                    { title: 'Airflow Basics', desc: 'Streamlines, Bernoulli, and Continuity.', view: View.POF_AIRFLOW },
                                                    { title: 'Aerofoil Geometry', desc: 'Camber, Chord, Thickness, Angle of Attack.', view: View.POF_AEROFOIL },
                                                    { title: 'Wing Geometry', desc: 'Aspect Ratio, Taper, Sweep, Planform.', view: View.POF_WING_GEOM },
                                                    { title: 'Lift & Drag', desc: 'Coefficient curves, polar diagrams.', view: View.POF_LIFT_DRAG },
                                                    { title: '3D Airflow', desc: 'Wingtip vortices, Downwash, Induced Drag.', view: View.POF_3D_AIRFLOW },
                                                    { title: 'Total Drag', desc: 'Parasite vs Induced Drag curves.', view: View.POF_DRAG },
                                                    { title: 'Ground Effect', desc: 'Cushioning effect near surface.', view: View.POF_GROUND_EFFECT },
                                                    { title: 'High Lift Devices', desc: 'Flaps and Slats performance.', view: View.POF_HIGH_LIFT },
                                                    { title: 'Stall', desc: 'Stalling characteristics and recovery.', isLocked: true },
                                                    { title: 'Stability', desc: 'Static and Dynamic stability.', isLocked: true },
                                                ]}
                                                onOpenSyllabus={handleOpenSyllabus}
                                            />
                                        )}
                                        {currentView === View.POF_ATMOSPHERE && <AtmosphereProp />}
                                        {currentView === View.POF_AIRFLOW && <AirflowBasics />}
                                        {currentView === View.POF_AEROFOIL && <AerofoilGeom />}
                                        {currentView === View.POF_WING_GEOM && <WingGeom />}
                                        {currentView === View.POF_LIFT_DRAG && <LiftDragCoeff />}
                                        {currentView === View.POF_3D_AIRFLOW && <ThreeDAirflow />}
                                        {currentView === View.POF_DRAG && <TotalDrag />}
                                        {currentView === View.POF_GROUND_EFFECT && <GroundEffect />}
                                        {currentView === View.POF_HIGH_LIFT && <HighLiftDevices />}

                                        {/* KSA (100) */}
                                        {currentView === View.KSA_HOME && <KSADashboard onChangeView={navigateTo} isLocked={!isSubjectAllowed('100')} />}
                                        {currentView === View.KSA_COMPETENCIES && <KSACoreCompetencies />}
                                        {currentView === View.KSA_TEM && <TEMAdvanced />}
                                        {currentView === View.KSA_MENTAL_MATHS && <MentalMathsLab />}
                                        {currentView === View.KSA_FORDEC && <FORDECDecision />}
                                        {currentView === View.KSA_UPRT && <UPRTConcepts />}
                                        {currentView === View.KSA_CRM && <CRMScenarios />}
                                        {currentView === View.KSA_RESILIENCE && <ResilienceTraining />}
                                        {currentView === View.KSA_PROCEDURES && <ProcedureApplication />}

                                        {/* Communications (090) */}
                                        {currentView === View.DASHBOARD && <CommsDashboard onChangeView={navigateTo} onOpenSyllabus={handleOpenSyllabus} />}
                                        {currentView === View.GENERAL_THEORY && <GeneralTheory />}
                                        {currentView === View.PROPAGATION_THEORY && <PropagationTheory />}
                                        {currentView === View.TECH_PHYSICS && <TechPhysics />}
                                        {currentView === View.FREQ_EXPLORER && <FrequencyExplorer />}
                                        {currentView === View.SUFFIX_MATCH && <SuffixMatch />}
                                        {currentView === View.QCODE_CARDS && <QCodeFlashcards />}
                                        {currentView === View.Q_COMPASS && <QCodeCompass />}
                                        {currentView === View.WORD_MATCH && <WordMatch />}
                                        {currentView === View.PHONETIC && <PhoneticTrainer />}
                                        {currentView === View.ALT_SPEAK && <AltSpeak />}
                                        {currentView === View.TIME_REPORT && <TimeReport />}
                                        {currentView === View.READABILITY_SIM && <ReadabilitySim />}
                                        {currentView === View.FLIGHT_RULES && <FlightRules />}
                                        {currentView === View.PRIORITY && <PrioritySorter />}
                                        {currentView === View.CALLSIGN_TRAINER && <CallsignTrainer />}
                                        {currentView === View.URGENCY_TRAINER && <UrgencyTrainer />}
                                        {currentView === View.LEVEL_CHANGES && <LevelChanges />}
                                        {currentView === View.ABBREVIATION_GAME && <AbbreviationGame />}
                                        {currentView === View.CPDLC_SIM && <CPDLCSim />}
                                        {currentView === View.READBACK && <ReadbackChallenge />}
                                        {currentView === View.METAR && <MetarDecoder />}
                                        {currentView === View.VOLMET_SIM && <VolmetSimulator />}
                                        {currentView === View.AIREP_SPEC && <AirepSpec />}
                                        {currentView === View.RADIO_NAV_DATA && <NavDataLink />}
                                        {(currentView === View.TIME_ZONER || currentView === View.NAV_TIME) && <TimeZoner />}
                                        {currentView === View.EMERGENCY && <EmergencyBuilder />}
                                        {currentView === View.EMERGENCY_OPS && <EmergencyOps />}
                                        {currentView === View.COMM_FAIL && <CommFailure />}
                                        {currentView === View.BLIND_TX && <BlindTrans />}
                                        {currentView === View.TRANSPONDER && <TransponderDojo />}
                                        {currentView === View.VFR_COMMS_SIM && <VfrFlightSim />}
                                        {currentView === View.PHRASEOLOGY_EXPLORER && <PhraseologyExplorer />}
                                        {currentView === View.POS_REPORT && <PositionReport />}
                                        {currentView === View.TRAFFIC_CLOCK && <TrafficClock />}
                                        {currentView === View.AI_ROLEPLAY && <ScenarioRoleplay />}
                                        {currentView === View.AI_QUIZ && <AIQuiz />}
                                        {currentView === View.LIGHT_GUN && <LightGunGame />}
                                        {currentView === View.RADAR_VECTORS && <RadarVectors />}
                                        {currentView === View.TRANSFER_DRILL && <TransferDrill />}
                                        {currentView === View.METAR_BUILDER && <MetarBuilder />}
                                        {currentView === View.MORSE && <MorseMaster />}
                                        {currentView === View.BAND_SPEC && <BandSpectrum />}
                                        {currentView === View.VHF_CALC && <VHFCalculator />}
                                        {currentView === View.ADV_PHRASEOLOGY && <AdvancedPhraseology />}
                                        {currentView === View.RVR_SIM && <RvrSimulator />}
                                        {currentView === View.RVR_CODE && <RvrDecoder />}
                                        {currentView === View.CLOUD_MASTER && <CloudMaster />}
                                        {currentView === View.FLIRT_TRAINER && <FlirtTrainer />}
                                        {currentView === View.PAPI_VIS && <PapiVis />}
                                        {currentView === View.NAV_NDB_VOR && <MorseIdent />}
                                        {currentView === View.WEATHER_MINIMA && <WeatherMinima />}
                                        {currentView === View.HOLDING && <HoldEntryCalc />}
                                        {currentView === View.ALTIMETER && <AltimeterLab />}
                                        {currentView === View.RUNWAY && <RunwayLighting />}
                                        {currentView === View.SURFACE_LIGHT && <SurfaceLighting />}
                                        {currentView === View.TAXIWAY_LIGHT && <TaxiwayLighting />}
                                        {currentView === View.RUNWAY_MARKING && <RunwayQuiz />}
                                        {currentView === View.SNOWTAM && <SnowtamDecoder />}
                                        {currentView === View.SIGMET_DECODER && <SigmetDecoder />}
                                        {currentView === View.WAKE_TURB && <WakeTurbulence />}
                                        {currentView === View.SERVICE_CODES && <ServiceCodes />}
                                        {currentView === View.QCODE_CARDS && <QCodeCards />}
                                        {currentView === View.NUM_TIME_TRANSMIT && <TransmissionDrill />}
                                        {currentView === View.COMMS_DEFINITIONS && <CommsDefinitions />}
                                        {currentView === View.INTERCEPT && <InterceptTrainer />}


                                        {currentView === View.MASS_BAL_HOME && <MassBalanceDashboard onNavigate={navigateTo} isLocked={!isSubjectAllowed('031')} />}
                                        {currentView === View.MASS_BAL_DEFINITIONS && <MassDefinitions />}
                                        {currentView === View.MASS_BAL_CG_CALC && <WeighingProcedure />}
                                        {currentView === View.MASS_BAL_LIMITS && <LoadingLimits />}
                                        {currentView === View.MASS_BAL_MAC && <MacVisualizer />}
                                        {currentView === View.MASS_BAL_SHIFT && <CargoHandlingSim />}
                                        {currentView === View.MASS_BAL_FUEL && <FuelDensityCalc />}
                                        {currentView === View.MASS_BAL_LOADSHEET && <LoadSheetSim />}
                                        {currentView === View.MASS_BAL_FLOW_DIAGRAM && <MassBuildUpFlow />}
                                        {currentView === View.MASS_BAL_TRIM_SHEET && <TrimSheetSim />}
                                        {currentView === View.MASS_BAL_CG_SHIFT && <CGShiftVisualizer />}
                                        {currentView === View.MASS_BAL_CONVERTER && <UnitConverter />}
                                        {currentView === View.MASS_BAL_EFFECTS && <MassEffects />}
                                        {currentView === View.MASS_BAL_CG_EFFECTS && <CGEffects />}
                                        {currentView === View.MASS_BAL_STRUCTURAL && <StructuralLimits />}
                                        {currentView === View.MASS_BAL_STALL_SPEED && <StallSpeedCalc />}
                                        {currentView === View.MASS_BAL_FLEET && <FleetMasses />}
                                        {currentView === View.MASS_BAL_CARGO_TYPES && <CargoTypes />}
                                        {currentView === View.MASS_BAL_STD_MASSES && <StandardMasses />}

                                        {currentView === View.OPS_PROC_HOME && (
                                            <GenericSubjectDashboard
                                                subjectCode="070" subjectName="Operational Procedures" color="indigo"
                                                description="Special operational procedures, noise abatement, fire/smoke, wind shear and icing."
                                                icon={BookOpen} onChangeView={navigateTo}
                                                modules={[
                                                    { title: 'Long Range Ops', desc: 'NAT HLA, ETOPS, Polar.', view: View.OPS_LONG_RANGE, isLocked: !isSubjectAllowed('070') },
                                                    { title: 'Special Procedures', desc: 'Fire, DG, Contamination, Noise.', view: View.OPS_SPECIAL, isLocked: !isSubjectAllowed('070') },
                                                    { title: 'Flight Time Limitations', desc: 'FDP Calculator & Rest Rules.', view: View.OPS_FTL, isLocked: !isSubjectAllowed('070') },
                                                    { title: 'Emergency Ops', desc: 'Fuel dump, TCAS, Distress.', view: View.EMERGENCY_OPS, isLocked: !isSubjectAllowed('070') },
                                                    { title: 'All Weather Ops', desc: 'LVP, Minima, Approach Bans.', view: View.OPS_AWO, isLocked: !isSubjectAllowed('070') },
                                                    { title: 'General Requirements', desc: 'MEL, Equipment, AOC, Safety.', view: View.OPS_GENERAL, isLocked: !isSubjectAllowed('070') },
                                                    { title: 'Ground Ops', desc: 'Marshalling & Safety.', view: View.AIR_LAW_GROUND_OPS, isLocked: !isSubjectAllowed('070') },
                                                ]}
                                                onOpenSyllabus={handleOpenSyllabus}
                                            />
                                        )}
                                        {currentView === View.OPS_LONG_RANGE && <LongRangeOps />}
                                        {currentView === View.OPS_SPECIAL && <SpecialOpsDashboard isLocked={!isSubjectAllowed('070')} />}
                                        {currentView === View.OPS_FTL && <FTLCalculator />}
                                        {currentView === View.OPS_AWO && <AllWeatherOps />}
                                        {currentView === View.OPS_GENERAL && <OpsGeneral />}
                                        {currentView === View.PERF_HOME && (
                                            <GenericSubjectDashboard
                                                subjectCode="032" subjectName="Performance (A)" color="lime"
                                                description="Take-off, climb, cruise, descent and landing performance for Class A/B aircraft."
                                                icon={TrendingUp} onChangeView={navigateTo}
                                                modules={[]}
                                                onOpenSyllabus={handleOpenSyllabus}
                                            />
                                        )}
                                        {currentView === View.FLIGHT_PLAN_HOME && (
                                            <GenericSubjectDashboard
                                                subjectCode="033" subjectName="Flight Planning" color="green"
                                                description="VFR/IFR planning, fuel planning, point of equal time, and flight monitoring."
                                                icon={Map} onChangeView={navigateTo}
                                                modules={[]}
                                                onOpenSyllabus={handleOpenSyllabus}
                                            />
                                        )}

                                        {/* Visual Concept Lab */}
                                        {currentView === View.CONCEPT_LAB && <ConceptLab onChangeView={navigateTo} />}
                                        {currentView === View.CONCEPT_FORCES_OF_FLIGHT && (
                                            <ForcesOfFlight onBack={() => navigateTo(View.CONCEPT_LAB)} />
                                        )}
                                        {currentView === View.CONCEPT_HOLD_ENTRY && (
                                            <HoldEntryVisualizer onBack={() => navigateTo(View.CONCEPT_LAB)} />
                                        )}
                                        {currentView === View.CONCEPT_GREAT_CIRCLE && (
                                            <GreatCircleExplorer onBack={() => navigateTo(View.CONCEPT_LAB)} />
                                        )}
                                        {currentView === View.CONCEPT_TURN_PERF && (
                                            <TurnPerformance onBack={() => navigateTo(View.CONCEPT_LAB)} />
                                        )}

                                        {currentView === View.SYLLABUS_VIEWER && (
                                            <SyllabusViewer
                                                subjectId={selectedSubjectId || 'ALL'} // Default to ALL if no subject selected
                                                currentUser={user}
                                                onUpdateUser={handleUserUpdate}
                                                onBack={goBack}
                                                onNavigate={navigateTo}
                                            />
                                        )}
                                    </AnimatedPageWrapper>
                                </AnimatePresence>
                            </React.Suspense>
                        </div>
                    </div>
                </main>

                {/* Version Footer */}
                <footer className="w-full py-6 text-center z-10 relative pointer-events-none">
                    <p className="text-slate-600 text-[10px] font-mono tracking-widest uppercase opacity-40 hover:opacity-100 transition-opacity duration-300 select-none">
                        System Version: <span className="text-slate-500">{typeof __COMMIT_HASH__ !== 'undefined' ? __COMMIT_HASH__ : 'DEV'}</span>
                    </p>
                </footer>

                {/* Unified Navigation Drawer */}
                {mainMenuOpen && (
                    <div className="fixed inset-0 z-[9999] flex justify-end pointer-events-auto">
                        <div
                            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300"
                            onClick={() => setMainMenuOpen(false)}
                        ></div>
                        <div className="relative w-full max-w-sm bg-slate-900 border-l border-white/10 shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col h-full">
                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/20 rounded-lg">
                                        <PlaneIcon className="text-blue-400" size={20} />
                                    </div>
                                    <span className="font-black text-white tracking-tight">MISSION CONTROL</span>
                                </div>
                                <button
                                    onClick={() => setMainMenuOpen(false)}
                                    className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                                {/* Main Navigation */}
                                <div>
                                    <h3 className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3">Principal</h3>
                                    <div className="space-y-1">
                                        <MenuNavItem icon={PlaneIcon} label="Hangar" view={View.PLATFORM_DASHBOARD} />
                                        <MenuNavItem icon={BookOpen} label="Syllabus" view={View.SYLLABUS_VIEWER} />
                                        <MenuNavItem icon={TrendingUp} label="Progress" view={View.PROGRESS_DASHBOARD} />
                                    </div>
                                </div>

                                {/* Integrated Quick Access Tools */}
                                <div>
                                    <h3 className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3">Study Suite</h3>
                                    <div className="space-y-1 grid grid-cols-1">
                                        <MenuNavItem icon={Search} label="Question Bank" view={View.QUESTION_BANK} color="text-purple-400" bgColor="bg-purple-500/10" />
                                        <MenuNavItem icon={Map} label="Study Guide" view={View.STUDY_GUIDE} color="text-blue-400" bgColor="bg-blue-500/10" />
                                        <MenuNavItem icon={Activity} label="Concept Lab" view={View.CONCEPT_LAB} color="text-cyan-400" bgColor="bg-cyan-500/10" />
                                        <MenuNavItem icon={Calendar} label="Exam Planner" view={View.EXAM_PLANNER} color="text-indigo-400" bgColor="bg-indigo-500/10" />
                                        <MenuNavItem icon={FolderCog} label="Flashcards" view={View.FLASHCARDS} />
                                    </div>
                                </div>

                                {/* Account */}
                                <div>
                                    <h3 className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3">Management</h3>
                                    <div className="space-y-1">
                                        <MenuNavItem icon={Settings} label="Subscription Plan" view={View.SUBSCRIPTION_MANAGEMENT} />
                                        {user.isAdmin && <MenuNavItem icon={TrendingUp} label="Admin Dashboard" view={View.ADMIN_DASHBOARD} color="text-red-400" />}
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all"
                                        >
                                            <X size={18} />
                                            <span className="text-sm font-medium">Safe Exit (Sign Out)</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-white/5 bg-slate-950/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-800 rounded-xl border border-white/10 flex items-center justify-center font-bold text-blue-400">
                                        {user.email.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-white">{user.fullName || 'Aviator'}</div>
                                        <div className="text-[10px] text-slate-500 font-mono">{user.email}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ContentProtection>
    );


    return (
        <ToastProvider>
            {appContent}
            {user && (
                <>
                    <FocusTimer />
                    <Scratchpad />
                    <CommandPalette
                        isOpen={commandPaletteOpen}
                        onClose={() => setCommandPaletteOpen(false)}
                        onNavigate={navigateTo}
                    />
                </>
            )}
        </ToastProvider>
    );
};

export default App;
