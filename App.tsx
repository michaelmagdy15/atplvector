
import React, { useState, useEffect } from 'react';
import { AuthStatus, View, User } from './types';
import { supabase } from './lib/supabase';

// Components
import AuthView from './components/AuthView';
import PlatformDashboard from './components/PlatformDashboard';
import UserProfile from './components/UserProfile';
import AccountSettings from './components/AccountSettings';
import PlatformProgress from './components/PlatformProgress';
import LearningObjectivesViewer from './components/LearningObjectivesViewer';
import FlashcardSystem from './components/FlashcardSystem';
import SubscriptionManagement from './components/SubscriptionManagement';
import AdminDashboard from './components/AdminDashboard';
import ContentProtection from './components/ContentProtection';
import StudyGuide from './components/StudyGuide';
import SubjectSidebar from './components/SubjectSidebar';
import { getSubjectConfig } from './data/sidebarNavigation';
import StarfieldBackground from './components/StarfieldBackground';
import GlowOrbs from './components/GlowOrbs';

// Imports for Subjects...
import AirLawDashboard from './components/AirLawDashboard';
import AviationOrganisations from './components/AviationOrganisations';
import InternationalLaw from './components/InternationalLaw';
import LiabilityAndRights from './components/LiabilityAndRights';
import AnnexList from './components/AnnexList';
import PersonnelLicensing from './components/PersonnelLicensing';
import AirworthinessAndOps from './components/AirworthinessAndOps';
import AircraftRegistration from './components/AircraftRegistration';
import DocumentsOnboard from './components/DocumentsOnboard';
import RulesOfTheAirDetails from './components/RulesOfTheAirDetails';
import CockpitToggle from './components/CockpitToggle';
import CruisingLevelTool from './components/CruisingLevelTool';
import InterceptionProcedures from './components/InterceptionProcedures';
import LightGunSignals from './components/LightGunSignals';
import AirspaceLayers from './components/AirspaceLayers';
import IFRVFRExplorer from './components/IFRVFRExplorer';
import InstrumentApproach from './components/InstrumentApproach';
import PansOpsProcedures from './components/PansOpsProcedures';
import HoldingPatternEntry from './components/HoldingPatternEntry';
import AltimeterVisualizer from './components/AltimeterVisualizer';
import AerodromeReferenceCode from './components/AerodromeReferenceCode';
import SurfaceContamination from './components/SurfaceContamination';
import AerodromeLightingSummary from './components/AerodromeLightingSummary';
import AerodromeVisualizer from './components/AerodromeVisualizer';
import SignsAndSignals from './components/SignsAndSignals';
import GroundOperations from './components/GroundOperations';
import RWSL from './components/RWSL';
import TVasisVisualizer from './components/TVasisVisualizer';
import DeclaredDistances from './components/DeclaredDistances';
import OperationalInfo from './components/OperationalInfo';
import SecuritySection from './components/SecuritySection';
import AccidentInvestigation from './components/AccidentInvestigation';
import SearchAndRescue from './components/SearchAndRescue';
import EmergencyProcedures from './components/EmergencyProcedures';

import HydraulicSystemAnim from './components/AGK/HydraulicSystemAnim';
import JetEnginePrinciples from './components/AGK/JetEnginePrinciples';
import MassDefinitions from './components/MassBal/MassDefinitions';
import CgCalculator from './components/MassBal/CgCalculator';
import LoadingLimits from './components/MassBal/LoadingLimits';
import MacVisualizer from './components/MassBal/MacVisualizer';
import FuelDensityCalc from './components/MassBal/FuelDensityCalc';
import CargoHandlingSim from './components/MassBal/CargoHandlingSim';
import HumanPhysiology from './components/HPL/HumanPhysiology';
import HumanFactorsIntro from './components/HPL/HumanFactorsIntro';
import SleepAndRhythms from './components/HPL/SleepAndRhythms';
import InformationProcessing from './components/HPL/InformationProcessing';
import ErrorAndDecision from './components/HPL/ErrorAndDecision';
import CommunicationAndStress from './components/HPL/CommunicationAndStress';
import HumanBehaviour from './components/HPL/HumanBehaviour';
import CockpitManagement from './components/HPL/CockpitManagement';
import HPLVision from './components/HPL/HPLVision';
import HPLHearing from './components/HPL/HPLHearing';
import HPLHealth from './components/HPL/HPLHealth';
import HPLTEM from './components/HPL/HPLTEM';
import HPLShell from './components/HPL/HPLShell';
import HPLSafetyCulture from './components/HPL/HPLSafetyCulture';
import HPLAcceleration from './components/HPL/HPLAcceleration';
import HPLToxicHazards from './components/HPL/HPLToxicHazards';
import HPLAutomation from './components/HPL/HPLAutomation';
import HPLVestibular from './components/HPL/HPLVestibular';
import HPLMemory from './components/HPL/HPLMemory';
import HPLRespiration from './components/HPL/HPLRespiration';
import HPLCirculation from './components/HPL/HPLCirculation';
import HPLNervousSystem from './components/HPL/HPLNervousSystem';
import HPLMetabolism from './components/HPL/HPLMetabolism';
import HPLErgonomics from './components/HPL/HPLErgonomics';
import HPLBiases from './components/HPL/HPLBiases';
import HPLCulture from './components/HPL/HPLCulture';
import HPLRadiation from './components/HPL/HPLRadiation';
import HPLThermal from './components/HPL/HPLThermal';
import HPLSleepDisorders from './components/HPL/HPLSleepDisorders';
import HPLPressure from './components/HPL/HPLPressure';
import HPLMotionSickness from './components/HPL/HPLMotionSickness';
import HPLPerception from './components/HPL/HPLPerception';
import HPLWorkload from './components/HPL/HPLWorkload';
import HPLCommunicationProcess from './components/HPL/HPLCommunicationProcess';
import HPLCompetency from './components/HPL/HPLCompetency';
import HPLCooperation from './components/HPL/HPLCooperation';
import HPLHealthHygiene from './components/HPL/HPLHealthHygiene';
import HPLLearning from './components/HPL/HPLLearning';
import HPLPersonality from './components/HPL/HPLPersonality';
import HPLAtmosphere from './components/HPL/HPLAtmosphere';
import HPLIncidents from './components/HPL/HPLIncidents';

import AtmosphereLayers from './components/Meteorology/AtmosphereLayers';
import OneInSixty from './components/Nav/OneInSixty';
import TimeZoner from './components/TimeZoner';
import GNSSTheory from './components/RadioNav/GNSSTheory';
import WavePropVisualizer from './components/RadioNav/WavePropVisualizer';
import SpectrumExplorer from './components/RadioNav/SpectrumExplorer';
import IonosphereSim from './components/RadioNav/IonosphereSim';
import AntennaTheory from './components/RadioNav/AntennaTheory';
import Modulation from './components/RadioNav/Modulation';
import VDF from './components/RadioNav/VDF';
import MLS from './components/RadioNav/MLS';
import VORLab from './components/RadioNav/VORLab';
import ADFSimulator from './components/RadioNav/ADFSimulator';
import DMESimulator from './components/RadioNav/DMESimulator';
import ILSSimulator from './components/RadioNav/ILSSimulator';
import RadarTheory from './components/RadioNav/RadarTheory';
import SSRTransponder from './components/RadioNav/SSRTransponder';
import SbasAbas from './components/RadioNav/SbasAbas';
import RnavPbn from './components/RadioNav/RnavPbn';
import FMSTrainer from './components/RadioNav/FMSTrainer';
import LiftDrag from './components/PoF/LiftDrag';
import AtmosphereProp from './components/PoF/AtmosphereProp';
import AirflowBasics from './components/PoF/AirflowBasics';
import AerofoilGeom from './components/PoF/AerofoilGeom';
import WingGeom from './components/PoF/WingGeom';
import LiftDragCoeff from './components/PoF/LiftDragCoeff';
import ThreeDAirflow from './components/PoF/ThreeDAirflow';
import TotalDrag from './components/PoF/TotalDrag';
import GroundEffect from './components/PoF/GroundEffect';
import HighLiftDevices from './components/PoF/HighLiftDevices';

import CommsDashboard from './components/Comms/CommsDashboard';
import GeneralTheory from './components/GeneralTheory';
import PropagationTheory from './components/Comms/PropagationTheory';
import TechPhysics from './components/TechPhysics';
import FrequencyExplorer from './components/FrequencyExplorer';
import SuffixMatch from './components/SuffixMatch';
import QCodeFlashcards from './components/QCodeFlashcards';
import QCodeCompass from './components/QCodeCompass';
import WordMatch from './components/WordMatch';
import PhoneticTrainer from './components/PhoneticTrainer';
import AltSpeak from './components/AltSpeak';
import TimeReport from './components/TimeReport';
import ReadabilitySim from './components/ReadabilitySim';
import FlightRules from './components/FlightRules';
import PrioritySorter from './components/PrioritySorter';
import ReadbackChallenge from './components/ReadbackChallenge';
import MetarDecoder from './components/MetarDecoder';
import VolmetSimulator from './components/Comms/VolmetSimulator';
import AirepSpec from './components/AirepSpec';
import GenNavDashboard from './components/GenNav/GenNavDashboard';
import EarthGeometry from './components/GenNav/EarthGeometry';
import WindTriangle from './components/GenNav/WindTriangle';
import SolarCalc from './components/GenNav/SolarCalc';
import MapProjections from './components/GenNav/MapProjections';
import PolarGrid from './components/GenNav/PolarGrid';
import NavDataLink from './components/NavDataLink';
import EmergencyBuilder from './components/EmergencyBuilder';
import EmergencyOps from './components/EmergencyOps';
import CommFailure from './components/CommFailure';
import BlindTrans from './components/BlindTrans';
import TransponderDojo from './components/TransponderDojo';
import VfrFlightSim from './components/Comms/VfrFlightSim';
import PhraseologyExplorer from './components/PhraseologyExplorer';
import PositionReport from './components/PositionReport';
import TrafficClock from './components/TrafficClock';
import ScenarioRoleplay from './components/ScenarioRoleplay';
import AIQuiz from './components/AIQuiz';
import LightGunGame from './components/LightGunGame';
import MorseMaster from './components/MorseMaster';
import BandSpectrum from './components/BandSpectrum';
import VHFCalculator from './components/VHFCalculator';
import AdvancedPhraseology from './components/AdvancedPhraseology';
import RvrSimulator from './components/RvrSimulator';
import RvrDecoder from './components/RvrDecoder';
import CloudMaster from './components/CloudMaster';
import FlirtTrainer from './components/FlirtTrainer';
import PapiVis from './components/PapiVis';
import MorseIdent from './components/Comms/MorseIdent';
import WeatherMinima from './components/WeatherMinima';
import HoldEntryCalc from './components/HoldEntryCalc';
import AltimeterLab from './components/AltimeterLab';
import RunwayLighting from './components/RunwayLighting';
import SurfaceLighting from './components/SurfaceLighting';
import TaxiwayLighting from './components/TaxiwayLighting';
import RunwayQuiz from './components/RunwayQuiz';
import SnowtamDecoder from './components/SnowtamDecoder';
import WakeTurbulence from './components/WakeTurbulence';
import ServiceCodes from './components/ServiceCodes';
import InterceptTrainer from './components/InterceptTrainer';

import GenericSubjectDashboard from './components/GenericSubjectDashboard';
import {
    Plane as PlaneIcon, Menu, X, BookOpen, Settings, Weight,
    Users, Cloud, Compass, Wifi, TrendingUp, Map, FolderCog, Wind
} from 'lucide-react';

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [currentView, setCurrentView] = useState<View>(View.PLATFORM_DASHBOARD);
    const [studyTime, setStudyTime] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [authInitialView, setAuthInitialView] = useState<'LOGIN' | 'SIGNUP' | 'RESET_PASSWORD'>('LOGIN');
    const [isLoading, setIsLoading] = useState(true);

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
                fetchUserProfile(session.user.id, session.user.email!);
            } else {
                setIsLoading(false);
            }
        });

        // 2. Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'PASSWORD_RECOVERY') {
                if (session) {
                    fetchUserProfile(session.user.id, session.user.email!).then(() => {
                        setCurrentView(View.ACCOUNT_SETTINGS);
                    });
                }
            } else if (session) {
                fetchUserProfile(session.user.id, session.user.email!);
            } else {
                setUser(null);
                setCurrentView(View.PLATFORM_DASHBOARD);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchUserProfile = async (uid: string, email: string) => {
        try {
            // Trial configuration
            const TRIAL_DURATION_DAYS = 7;
            const TRIAL_SUBJECTS = ['090', '040']; // Communications and Human Performance

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
                const { data: newProfile, error: createError } = await supabase
                    .from('profiles')
                    .insert([{
                        id: uid,
                        email: email,
                        full_name: 'Pilot',
                        study_seconds: 0,
                        trial_start_date: trialStartDate,
                        trial_subjects: TRIAL_SUBJECTS,
                        is_approved: true // Auto-approve for trial
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
            let allowedSubjects: string[] = [];
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
                let trialSubjects = profile.trial_subjects || TRIAL_SUBJECTS;
                let isTrialActive = false;
                let isTrialExpired = false;

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

                // Determine final status
                let finalStatus: AuthStatus = status;

                // Priority: ACTIVE (paid) > FREE_TRIAL > TRIAL_EXPIRED > PENDING_APPROVAL
                if (hasActiveSubscription) {
                    finalStatus = AuthStatus.ACTIVE;
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
            supabase.from('profiles').update({ study_seconds: studyTime }).eq('id', user.id);
        };
    }, [user]); // user dependency ensures this runs when user logs in/out

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

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return <AuthView onAuthChange={setUser} initialView={authInitialView} />;
    }

    // Show pending approval screen for unapproved users
    if (user.status === AuthStatus.PENDING_APPROVAL) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center shadow-2xl">
                    <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-3">Account Pending Approval</h1>
                    <p className="text-slate-400 mb-6">
                        Thank you for signing up, <span className="text-white font-medium">{user.fullName || user.email}</span>!
                        Your account is currently awaiting admin approval. You'll receive access once approved.
                    </p>
                    <div className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-slate-700">
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

    const NavButton = ({ view, label, icon: Icon }: any) => (
        <button
            onClick={() => {
                setCurrentView(view);
                setMobileMenuOpen(false);
            }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 text-sm font-medium ${currentView === view
                ? 'bg-blue-600/90 text-white shadow-lg shadow-blue-500/30 ring-1 ring-blue-400/50'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
        >
            {Icon && <Icon size={16} />}
            <span>{label}</span>
        </button>
    );

    // Sidebar Config Logic
    const subjectConfig = getSubjectConfig(currentView);

    return (
        <ContentProtection userId={user.id}>
            <div className="min-h-screen font-sans text-slate-100 selection:bg-blue-500/30 selection:text-white bg-slate-950">

                {/* Immersive Background Effects */}
                <StarfieldBackground />
                <GlowOrbs />

                {/* Modern Floating Navbar */}
                <div className="fixed top-0 w-full z-50 px-4 py-4 pointer-events-none">
                    <nav className="pointer-events-auto max-w-7xl mx-auto bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
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
                                    onClick={() => setCurrentView(View.PLATFORM_DASHBOARD)}
                                >
                                    <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-lg group-hover:shadow-blue-500/20 transition-all duration-500 group-hover:scale-105">
                                        <PlaneIcon className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-lg font-black tracking-tight text-white whitespace-nowrap">
                                        ATPL<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">VECTOR</span>
                                    </span>
                                </div>
                            </div>

                            {/* Desktop Nav */}
                            <div className="hidden md:flex items-center space-x-2">
                                <NavButton view={View.PLATFORM_DASHBOARD} label="Hangar" />
                                <NavButton view={View.SYLLABUS_VIEWER} label="Syllabus" />
                                <NavButton view={View.FLASHCARDS} label="Flashcards" />
                                <NavButton view={View.SUBSCRIPTION_MANAGEMENT} label="Plan" />

                                {user.isAdmin && (
                                    <button
                                        onClick={() => setCurrentView(View.ADMIN_DASHBOARD)}
                                        className="text-red-400 hover:text-red-300 font-bold text-xs uppercase px-4"
                                    >
                                        Admin
                                    </button>
                                )}

                                <div className="h-6 w-px bg-white/10 mx-2"></div>

                                <div
                                    onClick={() => setCurrentView(View.PROFILE)}
                                    className="flex items-center space-x-3 cursor-pointer group pl-2"
                                >
                                    <div className="w-9 h-9 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center text-xs font-bold text-white border border-white/10 group-hover:border-blue-500/50 transition-colors shadow-lg">
                                        {user.email.substring(0, 2).toUpperCase()}
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Menu Toggle */}
                            <div className="md:hidden">
                                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-300">
                                    {mobileMenuOpen ? <X /> : <Menu />}
                                </button>
                            </div>
                        </div>

                        {/* Mobile Nav Dropdown */}
                        {mobileMenuOpen && (
                            <div className="md:hidden border-t border-white/5 p-4 space-y-2 animate-in slide-in-from-top-2 bg-slate-900 rounded-b-2xl pointer-events-auto">
                                <NavButton view={View.PLATFORM_DASHBOARD} label="Dashboard" />
                                <NavButton view={View.SYLLABUS_VIEWER} label="Syllabus" />
                                <NavButton view={View.FLASHCARDS} label="Flashcards" />
                                <NavButton view={View.SUBSCRIPTION_MANAGEMENT} label="Plan" />
                                <NavButton view={View.PROFILE} label="Profile" />
                            </div>
                        )}
                    </nav>
                </div>

                {/* Mobile Subject Sidebar (Drawer) */}
                {subjectConfig && sidebarOpen && (
                    <div className="fixed inset-0 z-40 lg:hidden">
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>
                        <div className="absolute top-0 left-0 bottom-0 w-72 bg-slate-900 border-r border-slate-700 pt-24 pb-safe animate-in slide-in-from-left">
                            <SubjectSidebar
                                config={subjectConfig}
                                currentView={currentView}
                                onNavigate={setCurrentView}
                                onClose={() => setSidebarOpen(false)}
                            />
                        </div>
                    </div>
                )}

                {/* Main Content Area */}
                <main className="pt-28 min-h-screen px-4 pb-20">
                    <div className="max-w-7xl mx-auto flex gap-8">
                        {/* Desktop Sidebar */}
                        {subjectConfig && (
                            <div className="hidden lg:block w-64 shrink-0 sticky top-28 h-[calc(100vh-140px)]">
                                <SubjectSidebar
                                    config={subjectConfig}
                                    currentView={currentView}
                                    onNavigate={setCurrentView}
                                />
                            </div>
                        )}

                        <div className="flex-1 min-w-0">
                            {/* --- PLATFORM LEVEL --- */}
                            {currentView === View.PLATFORM_DASHBOARD && (
                                <div className="animate-in fade-in duration-500">
                                    <div className="px-2 md:px-0 mb-8">
                                        <PlatformProgress />
                                    </div>
                                    <PlatformDashboard onChangeView={setCurrentView} studyTime={studyTime} user={user} />
                                </div>
                            )}
                            {currentView === View.PROFILE && (
                                <UserProfile
                                    user={user}
                                    studyTime={studyTime}
                                    onLogout={handleLogout}
                                    onUpdateUser={handleUserUpdate}
                                    onNavigate={setCurrentView}
                                />
                            )}
                            {currentView === View.ACCOUNT_SETTINGS && (
                                <AccountSettings user={user} onBack={() => setCurrentView(View.PROFILE)} />
                            )}
                            {currentView === View.SYLLABUS_VIEWER && <LearningObjectivesViewer onNavigate={setCurrentView} />}
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
                                <StudyGuide onBack={() => setCurrentView(View.PLATFORM_DASHBOARD)} />
                            )}

                            {/* --- SUBJECT MODULES --- */}
                            {/* Air Law */}
                            {currentView === View.AIR_LAW_HOME && <AirLawDashboard onChangeView={setCurrentView} />}
                            {currentView === View.AIR_LAW_INT_LAW && <InternationalLaw />}
                            {currentView === View.AIR_LAW_ORG && <AviationOrganisations />}
                            {currentView === View.AIR_LAW_LIABILITY && <LiabilityAndRights />}
                            {currentView === View.AIR_LAW_ANNEXES && <AnnexList />}
                            {currentView === View.AIR_LAW_PERSONNEL && <PersonnelLicensing />}
                            {currentView === View.AIR_LAW_AIRWORTHINESS && <AirworthinessAndOps />}
                            {currentView === View.AIR_LAW_REGISTRATION && <AircraftRegistration />}
                            {currentView === View.AIR_LAW_DOCS && <DocumentsOnboard />}
                            {currentView === View.AIR_LAW_RULES_DETAILS && <RulesOfTheAirDetails />}
                            {currentView === View.AIR_LAW_RULES_OF_AIR && <CockpitToggle />}
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

                            {/* AGK */}
                            {currentView === View.AGK_SYSTEMS_HOME && (
                                <GenericSubjectDashboard
                                    subjectCode="021" subjectName="AGK: Airframe & Systems" color="orange"
                                    description="Fuselage, hydraulics, landing gear, flight controls, pneumatics and electrics."
                                    icon={Settings} onChangeView={setCurrentView}
                                    modules={[
                                        { title: 'Hydraulics', desc: 'Pascal’s Law, actuators, pumps and reservoirs.', view: View.AGK_HYDRAULICS },
                                        { title: 'Gas Turbines', desc: 'The Brayton Cycle, intake, compression, combustion, exhaust.', view: View.AGK_JET_ENGINE },
                                        { title: 'Electrics', desc: 'DC/AC generation, batteries, and distribution.', isLocked: true },
                                        { title: 'Piston Engines', desc: 'Four stroke cycle, mixture, ignition.', isLocked: true },
                                    ]}
                                />
                            )}
                            {currentView === View.AGK_HYDRAULICS && <HydraulicSystemAnim />}
                            {currentView === View.AGK_JET_ENGINE && <JetEnginePrinciples />}

                            {/* Mass & Balance */}
                            {currentView === View.MASS_BAL_HOME && (
                                <GenericSubjectDashboard
                                    subjectCode="031" subjectName="Mass & Balance" color="yellow"
                                    description="Center of gravity calculations, loading, weighing, and performance limitations."
                                    icon={Weight} onChangeView={setCurrentView}
                                    modules={[
                                        { title: 'Mass Definitions', desc: 'BEM, DOM, TOM, ZFM. Build the stack.', view: View.MASS_BAL_DEFINITIONS },
                                        { title: 'CG Calculator', desc: 'Moments, Arms, and Envelope visualization.', view: View.MASS_BAL_CG_CALC },
                                        { title: 'Loading Limits', desc: 'Floor loading, running load, and spreaders.', view: View.MASS_BAL_LIMITS },
                                        { title: 'MAC Visualizer', desc: 'Mean Aerodynamic Chord, LEMAC and CG% calculations.', view: View.MASS_BAL_MAC },
                                        { title: 'Fuel Density', desc: 'SG vs Temperature. Volume to Mass conversion.', view: View.MASS_BAL_FUEL },
                                        { title: 'Load Shifting', desc: 'Calculate CG movement when shifting cargo.', view: View.MASS_BAL_SHIFT },
                                    ]}
                                />
                            )}
                            {currentView === View.MASS_BAL_DEFINITIONS && <MassDefinitions />}
                            {currentView === View.MASS_BAL_CG_CALC && <CgCalculator />}
                            {currentView === View.MASS_BAL_LIMITS && <LoadingLimits />}
                            {currentView === View.MASS_BAL_MAC && <MacVisualizer />}
                            {currentView === View.MASS_BAL_FUEL && <FuelDensityCalc />}
                            {currentView === View.MASS_BAL_SHIFT && <CargoHandlingSim />}

                            {/* HPL */}
                            {currentView === View.HPL_HOME && (
                                <GenericSubjectDashboard
                                    subjectCode="040" subjectName="Human Performance" color="emerald"
                                    description="Physiology, psychology, sleep, stress, and error management."
                                    icon={Users} onChangeView={setCurrentView}
                                    modules={[
                                        { title: 'Physiology', desc: 'Hypoxia, Respiration, Circulation.', view: View.HPL_PHYSIOLOGY },
                                        { title: 'Basic Concepts', desc: 'Accident stats, TEM, Safety Culture.', view: View.HPL_BASIC_CONCEPTS },
                                        { title: 'Sleep & Rhythms', desc: 'Circadian rhythms, Jet Lag, Sleep Stages.', view: View.HPL_SLEEP },
                                        { title: 'Information Processing', desc: 'Attention, Vigilance, Situation Awareness.', view: View.HPL_INFO_PROCESSING },
                                        { title: 'Error & Decision', desc: 'Error models, FOR-DEC, Error Chains.', view: View.HPL_ERROR_DECISION },
                                        { title: 'Cockpit Mgmt & CRM', desc: 'SOPs, Group Dynamics, Synergy.', view: View.HPL_COCKPIT_MGMT },
                                        { title: 'Comms & Stress', desc: 'Communication models, Stress, Workload.', view: View.HPL_COMMS_STRESS },
                                        { title: 'Human Behaviour', desc: 'Hazardous Attitudes, Leadership, Crew.', view: View.HPL_BEHAVIOUR },
                                        { title: 'Vision', desc: 'Eye anatomy, Scanning, and Visual Illusions.', view: View.HPL_VISION },
                                        { title: 'Hearing', desc: 'The Ear, Vestibular System, Spatial Disorientation.', view: View.HPL_HEARING },
                                        { title: 'Health', desc: 'Gas Laws, Hypoxia, TUC, Barotrauma.', view: View.HPL_HEALTH },
                                        { title: 'TEM Model', desc: 'Threats, Errors, UAS, and Countermeasures.', view: View.HPL_TEM },
                                        { title: 'SHELL Model', desc: 'Software, Hardware, Environment, Liveware.', view: View.HPL_SHELL },
                                        { title: 'Safety Culture', desc: 'Swiss Cheese, Just Culture, SMS.', view: View.HPL_SAFETY },
                                        { title: 'Acceleration', desc: 'G-Forces, G-LOC, Protections.', view: View.HPL_ACCELERATION },
                                        { title: 'Toxic Hazards', desc: 'CO, Alcohol, Smoking, Drugs.', view: View.HPL_TOXIC },
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
                                        { title: 'Communication Process', desc: 'Models, Barriers, Readback.', view: View.HPL_COMMUNICATION_PROCESS },
                                        { title: 'Competency', desc: 'KSA, Core Competencies.', view: View.HPL_COMPETENCY },
                                        { title: 'Cooperation', desc: 'Group Dynamics, Synergy.', view: View.HPL_COOPERATION },
                                        { title: 'Health & Hygiene', desc: 'Alcohol, Drugs, Sleep.', view: View.HPL_HEALTH_HYGIENE },
                                    ]}
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
                            {currentView === View.HPL_COMMUNICATION_PROCESS && <HPLCommunicationProcess />}
                            {currentView === View.HPL_COOPERATION && <HPLCooperation />}
                            {currentView === View.HPL_COMPETENCY && <HPLCompetency />}
                            {currentView === View.HPL_MOTION_SICKNESS && <HPLMotionSickness />}
                            {currentView === View.HPL_PRESSURE && <HPLPressure />}
                            {currentView === View.HPL_ATMOSPHERE && <HPLAtmosphere />}
                            {currentView === View.HPL_HEALTH_HYGIENE && <HPLHealthHygiene />}
                            {currentView === View.HPL_INCIDENTS && <HPLIncidents />}

                            {currentView === View.HPL_PRESSURE && <HPLPressure />}
                            {currentView === View.HPL_MOTION_SICKNESS && <HPLMotionSickness />}
                            {currentView === View.HPL_PERCEPTION && <HPLPerception />}
                            {currentView === View.HPL_WORKLOAD && <HPLWorkload />}
                            {currentView === View.HPL_COMMUNICATION_PROCESS && <HPLCommunicationProcess onNavigate={setCurrentView} />}
                            {currentView === View.HPL_COMPETENCY && <HPLCompetency onNavigate={setCurrentView} />}
                            {currentView === View.HPL_COOPERATION && <HPLCooperation onNavigate={setCurrentView} />}
                            {currentView === View.HPL_HEALTH_HYGIENE && <HPLHealthHygiene onNavigate={setCurrentView} />}

                            {/* Met */}
                            {currentView === View.MET_HOME && (
                                <GenericSubjectDashboard
                                    subjectCode="050" subjectName="Meteorology" color="teal"
                                    description="Atmosphere, wind, thermodynamics, clouds, fog, precipitation."
                                    icon={Cloud} onChangeView={setCurrentView}
                                    modules={[
                                        { title: 'The Atmosphere', desc: 'Layers, composition, ISA.', view: View.MET_ATMOSPHERE },
                                        { title: 'Altimetry', desc: 'QNH, QFE, QFF, True Altitude.', isLocked: true },
                                        { title: 'Clouds', desc: 'Classification, formation, lifting.', isLocked: true },
                                    ]}
                                />
                            )}
                            {currentView === View.MET_ATMOSPHERE && <AtmosphereLayers />}

                            {/* Gen Nav */}
                            {/* General Navigation */}
                            {currentView === View.GEN_NAV_HOME && (
                                <GenNavDashboard currentView={currentView} setCurrentView={setCurrentView} />
                            )}
                            {currentView === View.GEN_NAV_EARTH && <EarthGeometry onNavigate={setCurrentView} />}
                            {currentView === View.GEN_NAV_SOLAR && <SolarCalc onNavigate={setCurrentView} />}
                            {currentView === View.GEN_NAV_MAPS && <MapProjections onNavigate={setCurrentView} />}
                            {currentView === View.GEN_NAV_WIND_TRIANGLE && <WindTriangle onNavigate={setCurrentView} />}
                            {currentView === View.GEN_NAV_POLAR && <PolarGrid onNavigate={setCurrentView} />}
                            {currentView === View.NAV_HOME && (
                                <GenNavDashboard currentView={View.GEN_NAV_HOME} setCurrentView={setCurrentView} />
                            )}
                            {currentView === View.NAV_60_1 && <OneInSixty />}
                            {currentView === View.NAV_TIME && <TimeZoner />}

                            {/* Radio Nav */}
                            {currentView === View.RAD_NAV_HOME && (
                                <GenericSubjectDashboard
                                    subjectCode="062" subjectName="Radio Navigation" color="sky"
                                    description="Radio aids, radar, GNSS, area navigation systems."
                                    icon={Wifi} onChangeView={setCurrentView}
                                    modules={[
                                        // Phase 1: Basics
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
                                        { title: 'Radar Theory', desc: 'Pulse technique, PRF, PRI.', view: View.RAD_NAV_RADAR },
                                        { title: 'SSR Transponder', desc: 'Mode A/C/S, Codes and Interrogation.', view: View.RAD_NAV_SSR },
                                        { title: 'GNSS Principles', desc: 'GPS, GLONASS, GALILEO satellites.', view: View.NAV_GNSS },
                                        { title: 'SBAS/ABAS', desc: 'EGNOS, WAAS and augmentation.', view: View.RAD_NAV_SBAS },
                                        { title: 'RNAV/PBN', desc: 'Area Navigation and Kalman Filtering.', view: View.RAD_NAV_RNAV },
                                        { title: 'FMS Trainer', desc: 'CDU/MCDU Waypoint entry.', view: View.RAD_NAV_FMS },
                                    ]}
                                />
                            )}
                            {currentView === View.NAV_GNSS && <GNSSTheory />}
                            {currentView === View.RAD_NAV_WAVE_PROP && <WavePropVisualizer />}
                            {currentView === View.RAD_NAV_SPECTRUM && <SpectrumExplorer />}
                            {currentView === View.RAD_NAV_IONOSPHERE && <IonosphereSim />}
                            {currentView === View.RAD_NAV_ANTENNA && <AntennaTheory />}
                            {currentView === View.RAD_NAV_MODULATION && <Modulation />}
                            {currentView === View.RAD_NAV_VOR && <VORLab />}
                            {currentView === View.RAD_NAV_ADF && <ADFSimulator />}
                            {currentView === View.RAD_NAV_DME && <DMESimulator />}
                            {currentView === View.RAD_NAV_ILS && <ILSSimulator />}
                            {currentView === View.RAD_NAV_VDF && <VDF />}
                            {currentView === View.RAD_NAV_MLS && <MLS />}
                            {currentView === View.RAD_NAV_RADAR && <RadarTheory />}
                            {currentView === View.RAD_NAV_SSR && <SSRTransponder />}
                            {currentView === View.RAD_NAV_SBAS && <SbasAbas />}
                            {currentView === View.RAD_NAV_RNAV && <RnavPbn />}
                            {currentView === View.RAD_NAV_FMS && <FMSTrainer />}

                            {/* PoF */}
                            {currentView === View.POF_HOME && (
                                <GenericSubjectDashboard
                                    subjectCode="081" subjectName="Principles of Flight" color="violet"
                                    description="Subsonic aerodynamics, stability, control, lift, drag."
                                    icon={PlaneIcon} onChangeView={setCurrentView}
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

                            {/* Communications (090) */}
                            {currentView === View.DASHBOARD && <CommsDashboard onChangeView={setCurrentView} />}
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
                            {currentView === View.READBACK && <ReadbackChallenge />}
                            {currentView === View.METAR && <MetarDecoder />}
                            {currentView === View.VOLMET_SIM && <VolmetSimulator />}
                            {currentView === View.AIREP_SPEC && <AirepSpec />}
                            {currentView === View.RADIO_NAV_DATA && <NavDataLink />}
                            {currentView === View.TIME_ZONER && <TimeZoner />}
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
                            {currentView === View.WAKE_TURB && <WakeTurbulence />}
                            {currentView === View.SERVICE_CODES && <ServiceCodes />}
                            {currentView === View.INTERCEPT && <InterceptTrainer />}

                            {currentView === View.OPS_PROC_HOME && (
                                <GenericSubjectDashboard
                                    subjectCode="070" subjectName="Operational Procedures" color="indigo"
                                    description="Special operational procedures, noise abatement, fire/smoke, wind shear and icing."
                                    icon={BookOpen} onChangeView={setCurrentView}
                                    modules={[]}
                                />
                            )}
                            {currentView === View.PERF_HOME && (
                                <GenericSubjectDashboard
                                    subjectCode="032" subjectName="Performance (A)" color="lime"
                                    description="Take-off, climb, cruise, descent and landing performance for Class A/B aircraft."
                                    icon={TrendingUp} onChangeView={setCurrentView}
                                    modules={[]}
                                />
                            )}
                            {currentView === View.FLIGHT_PLAN_HOME && (
                                <GenericSubjectDashboard
                                    subjectCode="033" subjectName="Flight Planning" color="green"
                                    description="VFR/IFR planning, fuel planning, point of equal time, and flight monitoring."
                                    icon={Map} onChangeView={setCurrentView}
                                    modules={[]}
                                />
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </ContentProtection>
    );
};

export default App;
