import React, { useState, useEffect } from 'react';
import { AuthStatus, View, User } from './types';
import { GamificationProvider } from './context/GamificationContext';
import { auth, db, doc, collection } from './lib/firebase';
import { signInWithCustomToken } from 'firebase/auth';
import { useUser, useAuth } from '@clerk/clerk-react';
import { getDoc, setDoc, updateDoc, getDocs, increment, onSnapshot } from 'firebase/firestore';
import { AnimatePresence } from 'framer-motion';
import AnimatedPageWrapper from './components/AnimatedPageWrapper';
import { CourseModeProvider } from './context/CourseModeContext';

// Define global constant for commit hash
declare const __COMMIT_HASH__: string;

// Components
import Router from './components/Router';
const AuthView = React.lazy(() => import('./components/AuthView'));

// Critical Imports (Static)
import ContentProtection from './components/ContentProtection';
import NavigationBar from './components/NavigationBar';
import SubjectSidebar from './components/SubjectSidebar';
import { getSubjectConfig } from './data/sidebarNavigation';
import LoadingScreen from './components/LoadingScreen';
import SplineVisualizer from './components/visual/SplineVisualizer';
import CommandPalette from './components/CommandPalette';
import CourseModeToggle from './components/CourseModeToggle';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastProvider } from './components/ui/ToastContext';
import FocusTimer from './components/study/FocusTimer';
import Scratchpad from './components/study/Scratchpad';
import {
    Plane as PlaneIcon, Menu, X, BookOpen, Settings, Weight,
    Users, Cloud, Compass, Wifi, TrendingUp, Map, FolderCog, Wind, Search, Activity, Calendar, Clock, Radio
} from 'lucide-react';

const App: React.FC = () => {
    const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
    const { signOut: clerkSignOut } = useAuth();
    const [user, setUser] = useState<User | null>(null);
    const [sessionInvalid, setSessionInvalid] = useState(false);
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

    const [authInitialView, setAuthInitialView] = useState<'LOGIN' | 'SIGNUP' | 'FORGOT_PASS'>('LOGIN');

    // Navigation History State
    const [viewHistory, setViewHistory] = useState<View[]>([View.PLATFORM_DASHBOARD]);
    const [historyIndex, setHistoryIndex] = useState(0);

    // Scroll to top on view change
    useEffect(() => {
        window.scrollTo(0, 0);
        if (sidebarOpen) setSidebarOpen(false);
    }, [currentView]);

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



    // Initial Data Fetch & Clerk Auth Listener
    useEffect(() => {
        if (!clerkLoaded) return;

        const isRecovery = window.location.search?.includes('mode=resetPassword');
        if (isRecovery) {
            setAuthInitialView('FORGOT_PASS');
        }

        if (clerkUser) {
            const email = clerkUser.primaryEmailAddress?.emailAddress || '';
            console.log("Clerk Auth State Changed:", email);
            
            // Sync Clerk session with Firebase Auth in the background
            const syncFirebase = async () => {
                try {
                    const token = await clerkUser.getToken({ template: 'integration_firebase' });
                    if (token) {
                        await signInWithCustomToken(auth, token);
                        console.log("Firebase Auth synced with Clerk successfully.");
                    }
                } catch (err) {
                    console.warn("Could not sync Firebase Auth with Clerk:", err);
                }
            };

            syncFirebase().finally(() => {
                fetchUserProfile(clerkUser.id, email).then(() => {
                    if (isRecovery) setCurrentView(View.ACCOUNT_SETTINGS);
                });
            });
        } else {
            setUser(null);
            setCurrentView(View.PLATFORM_DASHBOARD);
            setIsLoading(false);
        }
    }, [clerkUser, clerkLoaded]);

    const fetchUserProfile = async (uid: string, email: string) => {
        try {
            // Trial configuration
            const TRIAL_DURATION_DAYS = 7;
            const TRIAL_SUBJECTS: string[] = []; // No free subjects by default

            // Get or generate local device ID
            let localDeviceId = localStorage.getItem('atpl_device_id');
            if (!localDeviceId) {
                localDeviceId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36);
                localStorage.setItem('atpl_device_id', localDeviceId);
            }

            // Try to get profile from Firestore
            const profileRef = doc(db, 'profiles', uid);
            const profileSnap = await getDoc(profileRef);
            let profile = profileSnap.data() as any;

            // Auto-create profile if missing (Self-healing for existing users)
            if (!profile) {
                console.log("Profile missing, creating new profile with trial access...");
                const trialStartDate = new Date().toISOString();

                profile = {
                    id: uid,
                    email: email,
                    full_name: 'Pilot',
                    study_seconds: 0,
                    trial_start_date: trialStartDate,
                    trial_subjects: TRIAL_SUBJECTS,
                    is_approved: true,
                    current_device_id: localDeviceId
                };

                await setDoc(profileRef, profile);
                // Also ensure subscription exists
                const subRef = doc(db, 'subscriptions', uid);
                await setDoc(subRef, { user_id: uid, plan: 'CUSTOM', status: 'inactive' });
            } else {
                // If profile already exists, update current_device_id
                await updateDoc(profileRef, { current_device_id: localDeviceId });
                profile.current_device_id = localDeviceId;
            }

            // Get subscription
            const subRef = doc(db, 'subscriptions', uid);
            const subSnap = await getDoc(subRef);
            const sub = subSnap.data() as any;

            let subTier: any = 'CUSTOM';
            let allowedSubjects: string[] = []; // Default to none, must activate demo
            let status: AuthStatus = AuthStatus.VERIFIED;
            let subscriptionExpiresAt: string | undefined = undefined;

            // Check subscription status first
            let hasActiveSubscription = false;
            if (sub && sub.status === 'active') {
                if (sub.expires_at) {
                    const expiresAt = new Date(sub.expires_at);
                    if (expiresAt > new Date()) {
                        hasActiveSubscription = true;
                    }
                } else {
                    // Legacy subscription without expires_at
                    hasActiveSubscription = true;
                }
            }

            if (hasActiveSubscription) {
                status = AuthStatus.ACTIVE;
                subTier = sub.plan;
                if (sub.expires_at) subscriptionExpiresAt = sub.expires_at;

                // Set allowed subjects
                const fullAccessPlans = ['1_MONTH', '3_MONTHS', '6_MONTHS', '9_MONTHS', '12_MONTHS', 'PRO_MONTHLY', 'PRO_YEARLY'];
                if (fullAccessPlans.includes(sub.plan) || sub.plan?.includes('PRO')) {
                    allowedSubjects = ['ALL'];
                } else if (sub.plan === 'SINGLE_SUBJECT' && sub.allowed_subjects) {
                    allowedSubjects = sub.allowed_subjects;
                }
            }

            if (profile) {
                // Initialize local study time from DB
                const dbSeconds = profile.study_seconds || 0;
                setStudyTime(dbSeconds);
                localStorage.setItem(`atpl_study_seconds_${uid}`, dbSeconds.toString());

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

                const isOwner = email === 'michaelmitry13@gmail.com';

                // Priority: ACTIVE > DEMO > FREE_TRIAL > DEMO_EXPIRED > TRIAL_EXPIRED > PENDING_APPROVAL
                if (isOwner || hasActiveSubscription) {
                    finalStatus = AuthStatus.ACTIVE;
                } else if (isDemoActive) {
                    finalStatus = AuthStatus.DEMO_PREVIEW;
                } else if (isDemoExpired) {
                    finalStatus = AuthStatus.DEMO_EXPIRED;
                } else if (isTrialActive) {
                    finalStatus = AuthStatus.FREE_TRIAL;
                } else if (isTrialExpired) {
                    finalStatus = AuthStatus.TRIAL_EXPIRED;
                } else {
                    finalStatus = AuthStatus.FREE_TRIAL;
                }

                // Gamification Logic
                let dailyGoalSeconds = profile.daily_goal_seconds || 3600;
                let dailyStudyData = profile.daily_study_data || {};
                let lastStudyDate = profile.last_study_date;
                let streakDays = profile.streak_days || 0;

                const todayDateStr = new Date().toISOString().split('T')[0];
                if (lastStudyDate) {
                    if (lastStudyDate !== todayDateStr) {
                        const yesterday = new Date();
                        yesterday.setDate(yesterday.getDate() - 1);
                        const yesterdayStr = yesterday.toISOString().split('T')[0];
                        
                        if (lastStudyDate === yesterdayStr) {
                            streakDays += 1;
                        } else {
                            streakDays = 1; // broken streak
                        }
                        lastStudyDate = todayDateStr;
                        updateDoc(doc(db, 'profiles', uid), { 
                            streak_days: streakDays,
                            last_study_date: todayDateStr
                        });
                    }
                } else {
                    lastStudyDate = todayDateStr;
                    streakDays = 1;
                    updateDoc(doc(db, 'profiles', uid), { 
                        streak_days: streakDays,
                        last_study_date: todayDateStr
                    });
                }

                setUser({
                    id: uid,
                    email: email,
                    fullName: profile.full_name,
                    status: finalStatus,
                    studySeconds: profile.study_seconds || 0,
                    streakDays: streakDays,
                    lastStudyDate: lastStudyDate,
                    dailyGoalSeconds: dailyGoalSeconds,
                    dailyStudyData: dailyStudyData,
                    subscriptionTier: isOwner ? 'OWNER' : subTier,
                    allowedSubjects: isOwner ? ['ALL'] : allowedSubjects,
                    isAdmin: isOwner ? true : profile.is_admin,
                    isApproved: true,
                    trialStartDate: trialStartDate,
                    demoStartDate: demoStartDate,
                    trialSubjects: trialSubjects,
                    subscriptionExpiresAt: subscriptionExpiresAt
                });
            } else {
                // Fallback if profile creation failed completely
                const isOwner = email === 'michaelmitry13@gmail.com';
                const cachedSeconds = parseInt(localStorage.getItem(`atpl_study_seconds_${uid}`) || '0', 10);
                setUser({
                    id: uid,
                    email: email,
                    fullName: isOwner ? 'Michael Mitry' : 'Pilot',
                    status: isOwner ? AuthStatus.ACTIVE : AuthStatus.FREE_TRIAL,
                    studySeconds: cachedSeconds,
                    subscriptionTier: isOwner ? 'OWNER' : 'CUSTOM',
                    allowedSubjects: isOwner ? ['ALL'] : [],
                    isAdmin: isOwner ? true : false,
                    isApproved: true
                });
                setStudyTime(cachedSeconds);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            
            // Fallback profile if Firestore read/write fails completely (e.g. offline or permission issue)
            const isOwner = email === 'michaelmitry13@gmail.com';
            const cachedSeconds = parseInt(localStorage.getItem(`atpl_study_seconds_${uid}`) || '0', 10);
            setUser({
                id: uid,
                email: email,
                fullName: isOwner ? 'Michael Mitry' : 'Pilot',
                status: isOwner ? AuthStatus.ACTIVE : AuthStatus.FREE_TRIAL,
                studySeconds: cachedSeconds,
                subscriptionTier: isOwner ? 'OWNER' : 'CUSTOM',
                allowedSubjects: isOwner ? ['ALL'] : [],
                isAdmin: isOwner ? true : false,
                isApproved: true
            });
            setStudyTime(cachedSeconds);
        } finally {
            setIsLoading(false);
        }
    };

    // Study Timer Logic with Database Persistence
    const studyTimeRef = React.useRef(studyTime);
    useEffect(() => {
        studyTimeRef.current = studyTime;
    }, [studyTime]);

    useEffect(() => {
        if (!user) return;

        let interval: ReturnType<typeof setInterval> | null = null;

        const startTimer = () => {
            if (interval) return;
            interval = setInterval(() => {
                setStudyTime(prev => {
                    const newValue = prev + 1;
                    localStorage.setItem(`atpl_study_seconds_${user.id}`, newValue.toString());
                    if (newValue % 30 === 0) {
                        const todayDateStr = new Date().toISOString().split('T')[0];
                        
                        // Update User state locally for immediate UI reflection
                        setUser(u => {
                            if (!u) return u;
                            const newDailyData = { ...u.dailyStudyData };
                            newDailyData[todayDateStr] = (newDailyData[todayDateStr] || 0) + 30;
                            return { ...u, dailyStudyData: newDailyData };
                        });

                        updateDoc(doc(db, 'profiles', user.id), { 
                            study_seconds: newValue,
                            [`daily_study_data.${todayDateStr}`]: increment(30)
                        }).catch(error => {
                            console.error("Failed to auto-save study time:", error);
                        });
                    }
                    return newValue;
                });
            }, 1000);
        };

        const stopTimer = () => {
            if (interval) {
                clearInterval(interval);
                interval = null;
            }
        };

        const handleVisibility = () => {
            if (document.visibilityState === 'visible') {
                startTimer();
            } else {
                stopTimer();
                updateDoc(doc(db, 'profiles', user.id), { study_seconds: studyTimeRef.current });
            }
        };

        if (document.visibilityState === 'visible') {
            startTimer();
        }

        document.addEventListener('visibilitychange', handleVisibility);

        return () => {
            stopTimer();
            document.removeEventListener('visibilitychange', handleVisibility);
            updateDoc(doc(db, 'profiles', user.id), { study_seconds: studyTimeRef.current });
        };
    }, [user?.id]);

    // Listen to real-time session updates to prevent concurrent device usage
    useEffect(() => {
        if (!user || user.id === 'demo-user') {
            setSessionInvalid(false);
            return;
        }

        // Exempt the platform owner account from single device limitations
        if (user.email === 'michaelmitry13@gmail.com') {
            return;
        }

        const profileRef = doc(db, 'profiles', user.id);
        const unsubscribe = onSnapshot(profileRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data();
                const localDeviceId = localStorage.getItem('atpl_device_id');
                if (data && data.current_device_id && localDeviceId && data.current_device_id !== localDeviceId) {
                    console.log("Concurrent device session detected. Invalidating session.");
                    setSessionInvalid(true);
                }
            }
        }, (error) => {
            console.error("Error listening to session updates:", error);
        });

        return () => {
            unsubscribe();
        };
    }, [user?.id, user?.email]);

    const handleLogout = async () => {
        if (user) {
            try {
                await updateDoc(doc(db, 'profiles', user.id), { 
                    study_seconds: studyTime,
                    current_device_id: null
                });
            } catch (err) {
                console.warn("Failed to clear device ID on logout:", err);
            }
        }
        await clerkSignOut();
        setUser(null);
        setSessionInvalid(false);
        setCurrentView(View.PLATFORM_DASHBOARD);
        setAuthInitialView('LOGIN');
    };

    const handleUserUpdate = (updatedUser: User) => {
        setUser(updatedUser);
    };

    const isSubjectAllowed = (code: string) => {
        if (!user) return false;
        if (user.isAdmin) return true;
        if (user.status === AuthStatus.DEMO_PREVIEW) return true;
        if (user.allowedSubjects?.includes('ALL')) return true;
        return user.allowedSubjects?.includes(code);
    };

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (!user) {
        return (
            <ErrorBoundary>
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
            </ErrorBoundary>
        );
    }
    if (sessionInvalid) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-3">Session Terminated</h1>
                    <p className="text-slate-400 mb-6 text-sm leading-relaxed">
                        You have been signed out because your account is active on another device. ATPL Vector accounts are restricted to one active device at a time to prevent account sharing.
                    </p>
                    <button
                        onClick={handleLogout}
                        className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all border border-slate-600 shadow-lg"
                    >
                        Return to Sign In
                    </button>
                </div>
            </div>
        );
    }

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
                            onClick={() => alert("Please contact sales@atplvector.com to upgrade your account.")}
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

    const MenuNavItem = ({ view, label, icon: Icon, color = "text-slate-300", bgColor = "bg-transparent", onClick }: any) => {
        const active = currentView === view;
        return (
            <button
                onClick={() => {
                    if (onClick) {
                        onClick();
                    } else {
                        navigateTo(view);
                    }
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

    const isSubjectNavView = (view: View) => {
        return view !== View.PLATFORM_DASHBOARD &&
            view !== View.PROFILE &&
            view !== View.ACCOUNT_SETTINGS &&
            view !== View.SYLLABUS_VIEWER &&
            view !== View.SUBSCRIPTION_MANAGEMENT &&
            view !== View.ADMIN_DASHBOARD &&
            view !== View.EXAM_PLANNER &&
            view !== View.PROGRESS_DASHBOARD;
    };

    const subjectConfig = isSubjectNavView(currentView) ? getSubjectConfig(currentView) : null;

    const appContent = (
        <ContentProtection userId={user.id}>
            <div className="min-h-screen font-sans text-slate-100 selection:bg-blue-500/30 selection:text-white bg-slate-950">
                <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
                    <nav className="max-w-7xl mx-auto">
                        <div className="px-4 sm:px-6 h-16 flex items-center justify-between relative">
                            <div className="flex items-center gap-2 sm:gap-4 z-10">
                                {subjectConfig && (
                                    <button
                                        onClick={() => setSidebarOpen(!sidebarOpen)}
                                        className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg"
                                    >
                                        <BookOpen size={20} />
                                    </button>
                                )}
                                <div className="hidden sm:flex items-center">
                                    <CourseModeToggle />
                                </div>
                                <div className="hidden md:block">
                                    <NavigationBar
                                        canGoBack={canGoBack}
                                        canGoForward={canGoForward}
                                        onBack={goBack}
                                        onForward={goForward}
                                    />
                                </div>
                            </div>

                            {/* Centered Logo */}
                            <div
                                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center space-x-2.5 sm:space-x-3.5 cursor-pointer group z-20"
                                onClick={() => navigateTo(View.PLATFORM_DASHBOARD)}
                            >
                                <div className="p-1.5 w-9 h-9 sm:w-10 sm:h-10 bg-slate-900/50 rounded-lg shadow-lg group-hover:shadow-blue-500/20 transition-all duration-500 group-hover:scale-105 border border-white/10 flex items-center justify-center overflow-hidden">
                                    <img src="/assets/ATPLVECTOR Aviation Tech Logo.png" alt="Logo" className="w-full h-full object-contain scale-[3.8] object-center" />
                                </div>
                                <span className="text-lg sm:text-xl font-black tracking-tight text-white whitespace-nowrap">
                                    ATPL<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">VECTOR</span>
                                </span>
                            </div>
                            <div className="flex items-center gap-1 sm:gap-2">
                                <button
                                    onClick={() => setCommandPaletteOpen(true)}
                                    className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all flex items-center gap-2 px-2 sm:px-3 border border-white/5"
                                    title="Search (Ctrl+K)"
                                >
                                    <Search size={18} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest hidden lg:inline">Search</span>
                                </button>
                                <div className="h-6 w-px bg-white/10 mx-1 hidden sm:block"></div>
                                <div
                                    onClick={() => navigateTo(View.PROFILE)}
                                    className="flex items-center space-x-2 cursor-pointer group px-1"
                                >
                                    <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl flex items-center justify-center text-[10px] sm:text-xs font-bold text-white border border-white/10 group-hover:border-blue-500/50 transition-colors shadow-lg">
                                        {user.email.substring(0, 2).toUpperCase()}
                                    </div>
                                </div>
                                <button
                                    onClick={() => setMainMenuOpen(true)}
                                    className="p-2 sm:p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 group ml-1 active:scale-95"
                                >
                                    <Menu size={18} className="sm:w-5 sm:h-5 group-hover:rotate-180 transition-transform duration-500" />
                                    <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Portal</span>
                                </button>
                            </div>
                        </div>
                    </nav>
                </div>

                {subjectConfig && sidebarOpen && (
                    <div className="fixed inset-0 z-40 lg:hidden">
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
                )}

                <main className="pt-24 sm:pt-32 min-h-screen px-4 pb-20">
                    <div className="max-w-7xl mx-auto flex gap-8">
                        {subjectConfig && (
                            <div className="hidden lg:block w-64 shrink-0 sticky top-24 h-[calc(100vh-120px)]">
                                <SubjectSidebar
                                    config={subjectConfig}
                                    currentView={currentView}
                                    onNavigate={navigateTo}
                                />
                            </div>
                        )}

                        <div className="flex-1 min-w-0">
                            <ErrorBoundary>
                                <React.Suspense fallback={<LoadingScreen />}>
                                    <Router
                                        currentView={currentView}
                                        user={user}
                                        studyTime={studyTime}
                                        navigateTo={navigateTo}
                                        handleLogout={handleLogout}
                                        handleUserUpdate={handleUserUpdate}
                                        handleOpenSyllabus={handleOpenSyllabus}
                                        isSubjectAllowed={isSubjectAllowed}
                                        goBack={goBack}
                                        goForward={goForward}
                                        selectedSubjectId={selectedSubjectId}
                                    />
                                </React.Suspense>
                            </ErrorBoundary>
                        </div>
                    </div>
                </main>

                <footer className="w-full py-6 text-center z-10 relative pointer-events-none">
                    <p className="text-slate-600 text-[10px] font-mono tracking-widest uppercase opacity-40 hover:opacity-100 transition-opacity duration-300 select-none">
                        Build: <span className="text-slate-500">{typeof __COMMIT_HASH__ !== 'undefined' ? __COMMIT_HASH__ : 'Loading...'}</span>
                    </p>
                </footer>

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
                                <div>
                                    <h3 className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3">Principal</h3>
                                    <div className="space-y-1">
                                        <MenuNavItem icon={PlaneIcon} label="Hangar" view={View.PLATFORM_DASHBOARD} />
                                        <MenuNavItem icon={BookOpen} label="Syllabus" view={View.SYLLABUS_VIEWER} onClick={() => {
                                            setSelectedSubjectId('');
                                            navigateTo(View.SYLLABUS_VIEWER);
                                        }} />
                                        <MenuNavItem icon={TrendingUp} label="Progress" view={View.PROGRESS_DASHBOARD} />
                                    </div>
                                </div>

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
        <CourseModeProvider initialTrack={user?.licenceTrack}>
            <ToastProvider>
                <GamificationProvider>
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
                </GamificationProvider>
            </ToastProvider>
        </CourseModeProvider>
    );
};

export default App;
