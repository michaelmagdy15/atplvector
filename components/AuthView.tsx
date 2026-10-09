import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { 
    Shield, Mail, CheckCircle, Lock, ArrowRight, Plane, Zap, Menu, X, 
    User as UserIcon, HelpCircle, Eye, EyeOff, AlertTriangle, PlayCircle, 
    Star, Globe, BarChart3, Radio, RefreshCw, KeyRound, Target, BookOpen, 
    Layout, Dna, Rocket, Tablet, Smartphone, Download, ExternalLink, 
    Sparkles, CheckCircle2, Laptop, Gauge, Compass, Award, ChevronRight,
    ChevronDown, Sliders, Layers, Clock, Flame
} from 'lucide-react';
import { auth, db, getSiteUrl, collection, doc } from '../lib/firebase';
import { useSignIn, useSignUp } from '@clerk/clerk-react';
import { query, where, getDocs, updateDoc, addDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import Terms from './Terms';
import Privacy from './Privacy';
import Refund from './Refund';
import Contact from './Contact';
import StudyGuide from './StudyGuide';
import CockpitInteractiveWidget from './visual/CockpitInteractiveWidget';

type AuthViewMode = 'LOGIN' | 'SIGNUP' | 'FORGOT_PASS' | 'RESET_PASSWORD';

interface Props {
    onAuthChange: (user: User) => void;
    onDemoLogin?: () => void;
    initialView?: AuthViewMode;
}

export const AuthView: React.FC<Props> = ({ onAuthChange, onDemoLogin, initialView = 'LOGIN' }) => {
    const [view, setView] = useState<AuthViewMode>(initialView);
    const [activeHeroTab, setActiveHeroTab] = useState<'SIMULATOR' | 'AUTH'>('SIMULATOR');
    const [activeInfoPage, setActiveInfoPage] = useState<'TERMS' | 'PRIVACY' | 'REFUND' | 'CONTACT' | null>(null);
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const authCardRef = useRef<HTMLDivElement>(null);

    // Clerk Hooks
    const { isLoaded: signInLoaded, signIn, setActive: setSignInActive } = useSignIn();
    const { isLoaded: signUpLoaded, signUp, setActive: setSignUpActive } = useSignUp();

    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Clerk Verification State
    const [verifying, setVerifying] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');

    // Feedback State
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [passStrength, setPassStrength] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);

    // Pricing Billing Frequency
    const [billingPeriod, setBillingPeriod] = useState<'MONTHLY' | 'ANNUAL'>('ANNUAL');

    useEffect(() => {
        if (!password) { setPassStrength(0); return; }
        let score = 0;
        if (password.length >= 8) score++;
        if (password.match(/[0-9]/)) score++;
        if (password.match(/[A-Z]/)) score++;
        if (password.match(/[^a-zA-Z0-9]/)) score++;
        setPassStrength(score);
    }, [password]);

    // Helper to send notifications to Admin via Formspree
    const sendAdminNotification = async (subject: string, data: any) => {
        try {
            await fetch('https://formspree.io/f/mgovnoaw', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    _subject: subject,
                    ...data
                })
            });
        } catch (err) {
            console.error('Failed to send admin notification:', err);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!signInLoaded) return;
        setLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            const result = await signIn.create({
                identifier: email,
                password: password,
            });
            if (result.status === 'complete') {
                await setSignInActive({ session: result.createdSessionId });
            } else {
                setErrorMsg("Sign-in incomplete. Please verify your details.");
                setLoading(false);
            }
        } catch (error: any) {
            setLoading(false);
            setErrorMsg(error.message || "Invalid email or password.");
        }
    };

    const handleGoogleSignIn = async () => {
        if (!signInLoaded) return;
        setLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            await signIn.authenticateWithRedirect({
                strategy: 'oauth_google',
                redirectUrl: '/sso-callback',
                redirectUrlComplete: '/'
            });
        } catch (error: any) {
            setLoading(false);
            setErrorMsg(error.message || "Google sign-in failed. Please try again.");
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fullName.trim()) return setErrorMsg("Full Name is required.");
        if (!agreeToTerms) return setErrorMsg("You must agree to the Terms, Privacy, and Refund Policies to sign up.");
        if (password !== confirmPassword) return setErrorMsg("Passwords do not match.");
        if (passStrength < 3) return setErrorMsg("Password is too weak. Please use a stronger password.");

        if (!signUpLoaded) return;
        setLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            let initialStatus = 'FREE_TRIAL';

            sendAdminNotification(`New Signup Attempt (Clerk): ${email}`, {
                email: email,
                full_name: fullName,
                status: initialStatus,
                type: 'SIGNUP_ATTEMPT',
                timestamp: new Date().toISOString()
            });

            const firstName = fullName.split(' ')[0] || '';
            const lastName = fullName.split(' ').slice(1).join(' ') || '';

            await signUp.create({
                emailAddress: email,
                password: password,
                firstName: firstName,
                lastName: lastName,
            });

            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
            setVerifying(true);
            setSuccessMsg("Verification code sent to your email.");
        } catch (error: any) {
            setErrorMsg(error.message || "Signup failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!signUpLoaded) return;
        setLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code: verificationCode.trim(),
            });
            if (completeSignUp.status === 'complete') {
                await setSignUpActive({ session: completeSignUp.createdSessionId });
                setSuccessMsg("Email verified successfully! Logging you in...");
            } else {
                setErrorMsg("Verification failed. Please check the code.");
            }
        } catch (error: any) {
            setErrorMsg(error.message || "Verification failed. Please check your code.");
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return setErrorMsg("Please enter your email.");
        if (!signInLoaded) return;
        setLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            sendAdminNotification(`Reset Password Request: ${email}`, {
                email: email,
                type: 'PASSWORD_RESET_REQUEST',
                timestamp: new Date().toISOString()
            });

            await signIn.create({
                strategy: 'reset_password_email_code',
                identifier: email,
            });
            setSuccessMsg("Password reset code sent to your email.");
            setView('RESET_PASSWORD');
            setVerificationCode('');
            setPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            setErrorMsg(error.message || "Failed to send reset code.");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) return setErrorMsg("Passwords do not match.");
        if (passStrength < 3) return setErrorMsg("Password is too weak. Please use a stronger password.");
        if (!signInLoaded) return;
        setLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            const result = await signIn.attemptFirstFactor({
                strategy: 'reset_password_email_code',
                code: verificationCode.trim(),
                password: password,
            });
            if (result.status === 'complete') {
                await setSignInActive({ session: result.createdSessionId });
                setSuccessMsg("Password reset successfully! Logging you in...");
            } else {
                setErrorMsg("Password reset incomplete. Please verify the code and details.");
            }
        } catch (error: any) {
            setErrorMsg(error.message || "Failed to reset password. Please check the code.");
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (!signUpLoaded) return;
        setResendLoading(true);
        setErrorMsg('');
        setSuccessMsg('');
        try {
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
            setSuccessMsg("A new verification code has been sent to your email.");
        } catch (error: any) {
            setErrorMsg(error.message || "Failed to resend verification code.");
        } finally {
            setResendLoading(false);
        }
    };

    const handleResendResetCode = async () => {
        if (!signInLoaded) return;
        setResendLoading(true);
        setErrorMsg('');
        setSuccessMsg('');
        try {
            await signIn.create({
                strategy: 'reset_password_email_code',
                identifier: email,
            });
            setSuccessMsg("A new password reset code has been sent to your email.");
        } catch (error: any) {
            setErrorMsg(error.message || "Failed to send reset code.");
        } finally {
            setResendLoading(false);
        }
    };

    const openAuthWithMode = (mode: AuthViewMode) => {
        setView(mode);
        setActiveHeroTab('AUTH');
        if (authCardRef.current) {
            authCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
    };

    return (
        <div className="min-h-screen font-sans text-slate-100 overflow-x-hidden selection:bg-cyan-500/30 selection:text-white bg-[#030712]">
            {/* Info Pages Overlay */}
            {activeInfoPage === 'TERMS' && <Terms onBack={() => setActiveInfoPage(null)} />}
            {activeInfoPage === 'PRIVACY' && <Privacy onBack={() => setActiveInfoPage(null)} />}
            {activeInfoPage === 'REFUND' && <Refund onBack={() => setActiveInfoPage(null)} />}
            {activeInfoPage === 'CONTACT' && <Contact onBack={() => setActiveInfoPage(null)} />}

            {activeInfoPage === null && (
                <>
                    {/* TOP AEROSPACE NAVBAR */}
                    <header className="sticky top-0 w-full z-50 bg-[#030712]/85 backdrop-blur-xl border-b border-white/10 [padding-top:calc(max(env(safe-area-inset-top,0px),var(--sat,0px))+4px)]">
                        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="h-16 md:h-20 flex items-center justify-between">
                                {/* Brand Logo */}
                                <div 
                                    className="flex items-center space-x-3 cursor-pointer group shrink-0" 
                                    onClick={() => scrollToSection('hero')}
                                >
                                    <div className="p-1 w-9 h-9 md:w-11 md:h-11 bg-slate-900/90 rounded-xl shadow-lg shadow-cyan-500/10 group-hover:scale-105 transition-all duration-300 border border-cyan-500/30 flex items-center justify-center overflow-hidden">
                                        <img src="/logo.png" alt="ATPL Vector Logo" className="w-full h-full object-contain scale-[3.6] object-center" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-lg md:text-2xl font-black text-white tracking-tighter">
                                            ATPL<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">VECTOR</span>
                                        </span>
                                        <span className="text-[9px] font-mono tracking-widest text-cyan-400/80 uppercase -mt-1 hidden sm:block">
                                            FLIGHT TRAINING PLATFORM
                                        </span>
                                    </div>
                                </div>

                                {/* Desktop Navigation Links */}
                                <div className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-sm font-medium text-slate-300">
                                    <button onClick={() => scrollToSection('interactive-sim')} className="hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                                        <Gauge size={15} className="text-cyan-400" />
                                        <span>Cockpit Sim</span>
                                    </button>
                                    <button onClick={() => scrollToSection('features')} className="hover:text-cyan-300 transition-colors">Features</button>
                                    <button onClick={() => scrollToSection('curriculum')} className="hover:text-cyan-300 transition-colors">14 Subjects</button>
                                    <button onClick={() => scrollToSection('pricing')} className="hover:text-cyan-300 transition-colors">Pricing</button>
                                    <button onClick={() => scrollToSection('study-guide')} className="hover:text-cyan-300 transition-colors">Live ROI Lab</button>
                                </div>

                                {/* Action Buttons */}
                                <div className="hidden sm:flex items-center gap-3">
                                    {onDemoLogin && (
                                        <button 
                                            onClick={onDemoLogin}
                                            className="px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold font-mono transition-all flex items-center gap-1.5 active:scale-95 shadow-sm shadow-emerald-500/20"
                                        >
                                            <PlayCircle size={14} className="text-emerald-400" />
                                            <span>Quick Demo Flight</span>
                                        </button>
                                    )}

                                    <button 
                                        onClick={() => openAuthWithMode('LOGIN')}
                                        className="px-4 py-2 text-xs font-bold text-slate-200 hover:text-white transition-colors"
                                    >
                                        Aviator Login
                                    </button>

                                    <button 
                                        onClick={() => openAuthWithMode('SIGNUP')}
                                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-extrabold uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 active:scale-95 border border-cyan-400/30"
                                    >
                                        Get Started
                                    </button>
                                </div>

                                {/* Mobile Hamburger */}
                                <div className="lg:hidden flex items-center gap-2">
                                    {onDemoLogin && (
                                        <button 
                                            onClick={onDemoLogin}
                                            className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold"
                                            title="Demo Access"
                                        >
                                            <PlayCircle size={18} />
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => openAuthWithMode('LOGIN')}
                                        className="text-xs font-bold text-slate-300 px-2 py-1"
                                    >
                                        Login
                                    </button>
                                    <button 
                                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                                        className="text-white p-2 hover:bg-white/5 rounded-xl"
                                        aria-label="Toggle Navigation Menu"
                                    >
                                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                                    </button>
                                </div>
                            </div>
                        </nav>

                        {/* Mobile Menu Dropdown */}
                        {mobileMenuOpen && (
                            <div className="lg:hidden bg-slate-950/95 backdrop-blur-2xl border-b border-white/10 p-5 space-y-3 animate-in slide-in-from-top-2">
                                <button type="button" onClick={() => scrollToSection('interactive-sim')} className="w-full text-left px-4 py-3 text-slate-300 font-medium hover:bg-white/5 rounded-xl">Cockpit Simulator</button>
                                <button type="button" onClick={() => scrollToSection('features')} className="w-full text-left px-4 py-3 text-slate-300 font-medium hover:bg-white/5 rounded-xl">Features</button>
                                <button type="button" onClick={() => scrollToSection('curriculum')} className="w-full text-left px-4 py-3 text-slate-300 font-medium hover:bg-white/5 rounded-xl">14 EASA Subjects &amp; FAA</button>
                                <button type="button" onClick={() => scrollToSection('pricing')} className="w-full text-left px-4 py-3 text-slate-300 font-medium hover:bg-white/5 rounded-xl">Subscription Pricing</button>
                                
                                <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                                    {onDemoLogin && (
                                        <button 
                                            type="button" 
                                            onClick={onDemoLogin} 
                                            className="w-full py-3 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-center flex items-center justify-center gap-2"
                                        >
                                            <PlayCircle size={16} /> Instant Demo Flight
                                        </button>
                                    )}
                                    <button 
                                        type="button" 
                                        onClick={() => { openAuthWithMode('LOGIN'); setMobileMenuOpen(false); }} 
                                        className="w-full py-3 rounded-xl bg-white/10 text-white font-bold"
                                    >
                                        Sign In
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => { openAuthWithMode('SIGNUP'); setMobileMenuOpen(false); }} 
                                        className="w-full py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold"
                                    >
                                        Create Pilot Account
                                    </button>
                                </div>
                            </div>
                        )}
                    </header>

                    {/* HERO SECTION WITH LIVE FLIGHT DECK */}
                    <section id="hero" className="relative pt-8 pb-16 lg:pt-14 lg:pb-24 overflow-hidden">
                        {/* Background Cockpit Grid & Aerospace Glows */}
                        <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-60"></div>
                        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -translate-x-1/2"></div>
                        <div className="absolute top-32 right-10 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none"></div>

                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                            {/* Live Aerospace Telemetry Bar */}
                            <div className="flex justify-center mb-6">
                                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-mono text-cyan-300 shadow-lg shadow-cyan-500/10 backdrop-blur-md">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                                    <span className="font-bold uppercase tracking-wider">EASA ECQB 2026 ALIGNED</span>
                                    <span className="text-slate-600">·</span>
                                    <span className="text-slate-300 hidden sm:inline">FAA AIRMAN STANDARDS</span>
                                    <span className="text-slate-600 hidden sm:inline">·</span>
                                    <span className="text-slate-300">65+ 3D COCKPIT SIMS</span>
                                </div>
                            </div>

                            {/* Headline */}
                            <div className="text-center max-w-4xl mx-auto mb-10 space-y-5">
                                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1]">
                                    Master ATPL Theory on <br className="hidden sm:block" />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 drop-shadow-[0_0_35px_rgba(6,182,212,0.3)]">
                                        Your Modern Flight Deck.
                                    </span>
                                </h1>
                                <p className="text-slate-300 text-base sm:text-xl font-normal leading-relaxed max-w-2xl mx-auto">
                                    The comprehensive training suite for student pilots: GPU-accelerated avionics simulators, 15,000+ Chair-Flight ECQB questions, and instant AI debriefing. Fly on the web or offline on iPad.
                                </p>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                                    {onDemoLogin && (
                                        <button
                                            type="button"
                                            onClick={onDemoLogin}
                                            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-sm uppercase tracking-wider transition-all shadow-xl shadow-emerald-500/25 active:scale-95 flex items-center gap-2 group"
                                        >
                                            <PlayCircle size={18} className="group-hover:scale-110 transition-transform" />
                                            <span>Launch Free Test Flight</span>
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => openAuthWithMode('SIGNUP')}
                                        className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-sm uppercase tracking-wider transition-all shadow-xl shadow-cyan-500/25 active:scale-95 flex items-center gap-2 border border-cyan-400/30"
                                    >
                                        <span>Create Aviator Account</span>
                                        <ArrowRight size={18} />
                                    </button>

                                    <a
                                        href="https://testflight.apple.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-6 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white font-bold text-sm transition-all flex items-center gap-2 active:scale-95"
                                    >
                                        <Tablet size={18} className="text-blue-400" />
                                        <span>Install on iPad</span>
                                        <ExternalLink size={14} className="opacity-60" />
                                    </a>
                                </div>
                            </div>

                            {/* DUAL COCKPIT CONSOLE (Tabs: Interactive Simulator vs. Sign In / Register) */}
                            <div className="max-w-5xl mx-auto mt-6" ref={authCardRef}>
                                <div className="flex justify-center mb-4">
                                    <div className="p-1.5 bg-slate-950/90 rounded-2xl border border-white/10 flex items-center gap-2 shadow-xl">
                                        <button
                                            type="button"
                                            onClick={() => setActiveHeroTab('SIMULATOR')}
                                            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                                                activeHeroTab === 'SIMULATOR'
                                                    ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25'
                                                    : 'text-slate-400 hover:text-white'
                                            }`}
                                        >
                                            <Gauge size={16} />
                                            <span>Interactive Cockpit Simulator</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setActiveHeroTab('AUTH')}
                                            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                                                activeHeroTab === 'AUTH'
                                                    ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25'
                                                    : 'text-slate-400 hover:text-white'
                                            }`}
                                        >
                                            <Lock size={16} />
                                            <span>Pilot Sign In / Register</span>
                                        </button>
                                    </div>
                                </div>

                                {activeHeroTab === 'SIMULATOR' ? (
                                    <div id="interactive-sim" className="animate-in zoom-in-95 duration-300">
                                        <CockpitInteractiveWidget />
                                    </div>
                                ) : (
                                    /* EMBEDDED AUTH CONSOLE */
                                    <div className="max-w-md mx-auto glass-card bg-slate-900/90 backdrop-blur-2xl border border-cyan-500/30 p-8 rounded-3xl shadow-2xl shadow-cyan-500/10 animate-in zoom-in-95 duration-300 relative overflow-hidden">
                                        <div className="relative z-10">
                                            <div className="mb-6 text-center">
                                                <h3 className="text-2xl font-bold text-white mb-1.5">
                                                    {verifying ? 'Verify Your Email' : (
                                                        view === 'LOGIN' ? 'Aviator Sign In' :
                                                            view === 'SIGNUP' ? 'Register Flight Account' :
                                                                'Reset Password'
                                                    )}
                                                </h3>
                                                <p className="text-slate-400 text-xs">
                                                    {verifying ? `We sent a 6-digit code to ${email}.` : (
                                                        view === 'LOGIN' ? 'Access your training syllabus, question bank, and flight labs.' :
                                                            view === 'SIGNUP' ? 'Unlock full web access and offline iPad flight deck.' :
                                                                'Enter your email to receive a secure recovery code.'
                                                    )}
                                                </p>
                                            </div>

                                            {errorMsg && (
                                                <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-medium flex items-start gap-2.5 animate-in slide-in-from-top-2">
                                                    <AlertTriangle size={16} className="mt-0.5 text-rose-400 shrink-0" />
                                                    <span>{errorMsg}</span>
                                                </div>
                                            )}

                                            {successMsg && (
                                                <div className="mb-5 p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-medium flex items-start gap-2.5 animate-in slide-in-from-top-2">
                                                    <CheckCircle size={16} className="mt-0.5 text-emerald-400 shrink-0" />
                                                    <span>{successMsg}</span>
                                                </div>
                                            )}

                                            {/* Google Sign-in */}
                                            {(view === 'LOGIN' || view === 'SIGNUP') && !verifying && (
                                                <div className="mb-5 pb-5 border-b border-white/10">
                                                    <button
                                                        type="button"
                                                        onClick={handleGoogleSignIn}
                                                        disabled={loading}
                                                        className="w-full bg-white hover:bg-slate-100 disabled:opacity-50 text-slate-900 py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center shadow-lg active:scale-98"
                                                    >
                                                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                                        </svg>
                                                        {view === 'SIGNUP' ? 'Sign up with Google' : 'Sign in with Google'}
                                                    </button>
                                                    <div className="mt-3 text-center">
                                                        <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500">Or use email</span>
                                                    </div>
                                                </div>
                                            )}

                                            {verifying ? (
                                                <form onSubmit={handleVerifyEmail} className="space-y-4">
                                                    <div>
                                                        <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Verification Code</label>
                                                        <div className="relative">
                                                            <KeyRound className="absolute left-3.5 top-3 text-slate-500 w-4 h-4" />
                                                            <input
                                                                required
                                                                type="text"
                                                                value={verificationCode}
                                                                onChange={e => setVerificationCode(e.target.value)}
                                                                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 pl-10 pr-3 text-white text-center font-mono text-lg tracking-[0.3em] outline-none focus:border-cyan-400"
                                                                placeholder="000000"
                                                                maxLength={6}
                                                            />
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="submit"
                                                        disabled={loading}
                                                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95"
                                                    >
                                                        {loading ? <Zap className="animate-spin w-4 h-4" /> : 'Verify & Launch'}
                                                    </button>
                                                    <div className="text-center space-y-1 pt-2">
                                                        <button
                                                            type="button"
                                                            disabled={resendLoading}
                                                            onClick={handleResendCode}
                                                            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                                                        >
                                                            {resendLoading ? 'Resending...' : "Resend code"}
                                                        </button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <form 
                                                    onSubmit={
                                                        view === 'LOGIN' ? handleLogin :
                                                            view === 'SIGNUP' ? handleSignup :
                                                                view === 'FORGOT_PASS' ? handleForgotPassword :
                                                                    handleResetPassword
                                                    } 
                                                    className="space-y-4"
                                                >
                                                    {view === 'SIGNUP' && (
                                                        <div>
                                                            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Full Name</label>
                                                            <div className="relative">
                                                                <UserIcon className="absolute left-3.5 top-3 text-slate-500 w-4 h-4" />
                                                                <input 
                                                                    required 
                                                                    type="text" 
                                                                    value={fullName} 
                                                                    onChange={e => setFullName(e.target.value)} 
                                                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 pl-10 pr-3 text-white text-xs outline-none focus:border-cyan-400" 
                                                                    placeholder="Captain Michael" 
                                                                />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {view !== 'RESET_PASSWORD' && (
                                                        <div>
                                                            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Email Address</label>
                                                            <div className="relative">
                                                                <Mail className="absolute left-3.5 top-3 text-slate-500 w-4 h-4" />
                                                                <input 
                                                                    required 
                                                                    type="email" 
                                                                    value={email} 
                                                                    onChange={e => setEmail(e.target.value)} 
                                                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 pl-10 pr-3 text-white text-xs outline-none focus:border-cyan-400" 
                                                                    placeholder="pilot@airline.com" 
                                                                />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {view === 'RESET_PASSWORD' && (
                                                        <div>
                                                            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Reset Code</label>
                                                            <div className="relative">
                                                                <KeyRound className="absolute left-3.5 top-3 text-slate-500 w-4 h-4" />
                                                                <input
                                                                    required
                                                                    type="text"
                                                                    value={verificationCode}
                                                                    onChange={e => setVerificationCode(e.target.value.trim())}
                                                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 pl-10 pr-3 text-white text-center font-mono text-sm tracking-[0.2em] outline-none focus:border-cyan-400"
                                                                    placeholder="000000"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {view !== 'FORGOT_PASS' && (
                                                        <div>
                                                            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                                                                {view === 'RESET_PASSWORD' ? 'New Password' : 'Password'}
                                                            </label>
                                                            <div className="relative">
                                                                <Lock className="absolute left-3.5 top-3 text-slate-500 w-4 h-4" />
                                                                <input 
                                                                    required 
                                                                    type={showPassword ? "text" : "password"} 
                                                                    value={password} 
                                                                    onChange={e => setPassword(e.target.value)} 
                                                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 pl-10 pr-9 text-white text-xs outline-none focus:border-cyan-400" 
                                                                    placeholder="••••••••" 
                                                                />
                                                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2.5 top-2.5 text-slate-500 hover:text-white">
                                                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                                </button>
                                                            </div>

                                                            {(view === 'SIGNUP' || view === 'RESET_PASSWORD') && password && (
                                                                <div className="mt-2 flex items-center gap-2">
                                                                    <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                                                                        <div className={`h-full transition-all duration-300 ${passStrength <= 2 ? 'bg-rose-500' : passStrength === 3 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${(passStrength / 4) * 100}%` }}></div>
                                                                    </div>
                                                                    <span className="text-[10px] font-mono text-slate-400">{passStrength <= 2 ? 'Weak' : passStrength === 3 ? 'Good' : 'Strong'}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {(view === 'SIGNUP' || view === 'RESET_PASSWORD') && (
                                                        <div>
                                                            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Confirm Password</label>
                                                            <div className="relative">
                                                                <Lock className="absolute left-3.5 top-3 text-slate-500 w-4 h-4" />
                                                                <input 
                                                                    required 
                                                                    type="password" 
                                                                    value={confirmPassword} 
                                                                    onChange={e => setConfirmPassword(e.target.value)} 
                                                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 pl-10 pr-3 text-white text-xs outline-none focus:border-cyan-400" 
                                                                    placeholder="••••••••" 
                                                                />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {view === 'SIGNUP' && (
                                                        <div className="flex items-start gap-2 pt-1">
                                                            <input
                                                                required
                                                                type="checkbox"
                                                                id="agreeTerms"
                                                                checked={agreeToTerms}
                                                                onChange={e => setAgreeToTerms(e.target.checked)}
                                                                className="mt-0.5 accent-cyan-500 cursor-pointer"
                                                            />
                                                            <label htmlFor="agreeTerms" className="text-[11px] text-slate-400 leading-tight">
                                                                I agree to the{' '}
                                                                <button type="button" onClick={() => setActiveInfoPage('TERMS')} className="text-cyan-400 hover:underline">Terms</button>,{' '}
                                                                <button type="button" onClick={() => setActiveInfoPage('PRIVACY')} className="text-cyan-400 hover:underline">Privacy</button>, and{' '}
                                                                <button type="button" onClick={() => setActiveInfoPage('REFUND')} className="text-cyan-400 hover:underline">Refund Policy</button>.
                                                            </label>
                                                        </div>
                                                    )}

                                                    <button
                                                        type="submit"
                                                        disabled={loading}
                                                        className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/25 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                                                    >
                                                        {loading ? <Zap className="animate-spin w-4 h-4" /> : (
                                                            view === 'LOGIN' ? 'Enter Flight Deck' :
                                                                view === 'SIGNUP' ? 'Create Aviator Account' :
                                                                    view === 'FORGOT_PASS' ? 'Send Reset Link' :
                                                                        'Confirm New Password'
                                                        )}
                                                        {!loading && <ArrowRight size={16} />}
                                                    </button>

                                                    {/* Toggle Links */}
                                                    <div className="text-center text-xs text-slate-400 pt-2 space-y-2">
                                                        {view === 'LOGIN' && (
                                                            <>
                                                                <div>
                                                                    <button type="button" onClick={() => setView('FORGOT_PASS')} className="hover:text-white transition-colors">Forgot password?</button>
                                                                </div>
                                                                <div>
                                                                    Don't have an account?{' '}
                                                                    <button type="button" onClick={() => setView('SIGNUP')} className="text-cyan-400 font-bold hover:underline">Sign Up</button>
                                                                </div>
                                                            </>
                                                        )}

                                                        {view === 'SIGNUP' && (
                                                            <div>
                                                                Already registered?{' '}
                                                                <button type="button" onClick={() => setView('LOGIN')} className="text-cyan-400 font-bold hover:underline">Sign In</button>
                                                            </div>
                                                        )}

                                                        {(view === 'FORGOT_PASS' || view === 'RESET_PASSWORD') && (
                                                            <div>
                                                                <button type="button" onClick={() => setView('LOGIN')} className="text-cyan-400 font-bold hover:underline">Back to Login</button>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Instant Demo Shortcut */}
                                                    {onDemoLogin && view === 'LOGIN' && (
                                                        <div className="pt-3 border-t border-white/10 text-center">
                                                            <button
                                                                type="button"
                                                                onClick={onDemoLogin}
                                                                className="w-full py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                                                            >
                                                                <PlayCircle size={15} /> Instant 1-Click Demo Access
                                                            </button>
                                                        </div>
                                                    )}
                                                </form>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* AVIATION TRUST & TELEMETRY BAR */}
                    <section className="border-y border-white/10 bg-slate-950/90 py-10 relative z-20">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
                                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                    <div className="text-3xl sm:text-4xl font-mono font-black text-cyan-400 mb-1">14/14</div>
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">EASA ATPL Subjects</div>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                    <div className="text-3xl sm:text-4xl font-mono font-black text-blue-400 mb-1">65+</div>
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">3D Cockpit Sims</div>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                    <div className="text-3xl sm:text-4xl font-mono font-black text-indigo-400 mb-1">15,000+</div>
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">ECQB 2026 Questions</div>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                    <div className="text-3xl sm:text-4xl font-mono font-black text-emerald-400 mb-1">94%</div>
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pass Rate Target</div>
                                </div>
                                <div className="col-span-2 md:col-span-1 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                    <div className="text-3xl sm:text-4xl font-mono font-black text-purple-400 mb-1">100%</div>
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Offline iPad Sync</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* FEATURES BENTO GRID: THE COMPLETE PILOT SUITE */}
                    <section id="features" className="py-24 sm:py-32 relative overflow-hidden bg-slate-900/40">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                            <div className="text-center max-w-3xl mx-auto mb-16">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[10px] font-bold uppercase tracking-widest mb-4">
                                    <Rocket size={12} /> THE PILOT TRAINING ARCHITECTURE
                                </div>
                                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                                    Engineered to conquer <br className="hidden sm:block" />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                                        every aviation theory exam.
                                    </span>
                                </h2>
                                <p className="text-slate-400 mt-4 text-base sm:text-lg">
                                    Traditional question dumps cause rote memorization failures. ATPL Vector bridges deep aerodynamic visualization with real-time exam telemetry.
                                </p>
                            </div>

                            {/* 6-Card Bento Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Bento 1: 65+ 3D Cockpit Sims */}
                                <div className="p-8 rounded-3xl bg-slate-950/70 border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 flex flex-col justify-between group shadow-xl">
                                    <div>
                                        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                            <Gauge size={24} />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">65+ 3D Cockpit &amp; Systems Labs</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed">
                                            Turn abstract theory into muscle memory. Manipulate VOR/ILS radials, calibrate altimeter sub-scales, inspect Airbus MCDU flight management computers, and adjust PAPI glide paths.
                                        </p>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center text-xs font-mono text-cyan-400 font-bold">
                                        <span>VOR · ILS · MCDU · PAPI · Gyros</span>
                                    </div>
                                </div>

                                {/* Bento 2: Chair-Flight Powered Question Bank */}
                                <div className="p-8 rounded-3xl bg-slate-950/70 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 flex flex-col justify-between group shadow-xl">
                                    <div>
                                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                            <BookOpen size={24} />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">Chair-Flight ECQB 2026 Engine</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed">
                                            Over 15,000 official ECQB questions with smart retest filters, error attribution algorithms, and AI-powered aeronautical debriefs that explain the "why" behind every option.
                                        </p>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center text-xs font-mono text-blue-400 font-bold">
                                        <span>Smart Retest · AI Explanations</span>
                                    </div>
                                </div>

                                {/* Bento 3: Dual Syllabus: EASA + FAA Tracks */}
                                <div className="p-8 rounded-3xl bg-slate-950/70 border border-sky-500/20 hover:border-sky-400/40 transition-all duration-300 flex flex-col justify-between group shadow-xl">
                                    <div>
                                        <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                            <Shield size={24} />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">Dual Track: EASA ATPL &amp; FAA Suite</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed">
                                            Whether preparing for European airline captaincy or US FAA Airman Knowledge tests, switch between EASA ATPL and the FAA Knowledge Test Guide with 57 official figures and C172 systems.
                                        </p>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center text-xs font-mono text-sky-400 font-bold">
                                        <span>57 Official Figures · C172 Hub</span>
                                    </div>
                                </div>

                                {/* Bento 4: EgyptAir Cadet Ground School */}
                                <div className="p-8 rounded-3xl bg-slate-950/70 border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 flex flex-col justify-between group shadow-xl">
                                    <div>
                                        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                            <Plane size={24} />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">EgyptAir Cadet Portal (ABC 4th Ed.)</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed">
                                            Specialized training track engineered for EgyptAir cadet candidates: ECAR regulations quizzes, Boeing/Airbus fuel buildup models, instrument holding pattern entries, and ADM/CRM scenarios.
                                        </p>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center text-xs font-mono text-cyan-300 font-bold">
                                        <span>ECARs · CRM · Fuel Buildup</span>
                                    </div>
                                </div>

                                {/* Bento 5: Exam Readiness & Pacing Telemetry */}
                                <div className="p-8 rounded-3xl bg-slate-950/70 border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300 flex flex-col justify-between group shadow-xl">
                                    <div>
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                            <Target size={24} />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">Predictive Readiness Telemetry</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed">
                                            We track pacing down to the second (45s per question benchmark) and predict your CAA exam probability. Never sit an exam without knowing you will clear the 75% bar with a cushion.
                                        </p>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center text-xs font-mono text-emerald-400 font-bold">
                                        <span>45s Pacing · 94% Target Score</span>
                                    </div>
                                </div>

                                {/* Bento 6: Native iPad & iOS Offline Vault */}
                                <div className="p-8 rounded-3xl bg-slate-950/70 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 flex flex-col justify-between group shadow-xl">
                                    <div>
                                        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                            <Tablet size={24} />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">Native iPad App &amp; Offline Vault</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed">
                                            Study at FL390 without WiFi. Full encrypted offline question databases, iPad Split View, Apple Pencil scratchpad, and automatic cloud sync when you touch down.
                                        </p>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center text-xs font-mono text-purple-400 font-bold">
                                        <span>Apple Pencil · Zero-Lag Offline</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CURRICULUM SYLLABUS OVERVIEW */}
                    <section id="curriculum" className="py-20 sm:py-28 bg-[#030712] border-t border-white/5">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                                <div>
                                    <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">Full Syllabus Coverage</span>
                                    <h2 className="text-3xl sm:text-4xl font-black text-white mt-1">All 14 ATPL Subjects. Covered to Perfection.</h2>
                                </div>
                                <p className="text-slate-400 text-sm max-w-md">
                                    Every module includes learning objectives mapped directly to EASA Part-FCL guidelines, interactive diagrams, and flashcard banks.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
                                {[
                                    { code: '010', title: 'Air Law' },
                                    { code: '021', title: 'AGK Systems' },
                                    { code: '022', title: 'Instruments' },
                                    { code: '031', title: 'Mass & Balance' },
                                    { code: '032', title: 'Performance' },
                                    { code: '033', title: 'Flight Planning' },
                                    { code: '040', title: 'Human Factors' },
                                    { code: '050', title: 'Meteorology' },
                                    { code: '061', title: 'General Nav' },
                                    { code: '062', title: 'Radio Nav' },
                                    { code: '070', title: 'Operational Proc' },
                                    { code: '081', title: 'Principles of Flight' },
                                    { code: '090', title: 'Communications' },
                                    { code: '100', title: 'KSA 100' },
                                ].map((sub) => (
                                    <div key={sub.code} className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-cyan-500/40 transition-colors">
                                        <div className="text-[10px] font-mono font-bold text-cyan-400">SUB {sub.code}</div>
                                        <div className="text-sm font-bold text-white mt-1 truncate">{sub.title}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* LIVE ROI STUDY GUIDE LAB PREVIEW */}
                    <section id="study-guide" className="py-24 bg-slate-950 border-y border-white/10 relative overflow-hidden">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                            <div className="text-center max-w-2xl mx-auto mb-12">
                                <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">Interactive Tool Preview</span>
                                <h2 className="text-3xl sm:text-5xl font-black text-white mt-1">Live Study Guide Analyzer</h2>
                                <p className="text-slate-400 text-sm sm:text-base mt-3">
                                    Interact with our actual Study Guide tool below. See which subjects have the highest Return On Investment for your study hours. No login required to test.
                                </p>
                            </div>

                            <div className="rounded-3xl border border-white/10 overflow-hidden shadow-2xl bg-slate-900/50 backdrop-blur-md">
                                <StudyGuide />
                            </div>
                        </div>
                    </section>

                    {/* PRICING SECTION */}
                    <section id="pricing" className="py-24 sm:py-32 relative overflow-hidden bg-[#030712]">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                            <div className="text-center max-w-3xl mx-auto mb-16">
                                <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">Transparent Membership</span>
                                <h2 className="text-3xl sm:text-5xl font-black text-white mt-2">Invest in Your Airline Pilot Seat.</h2>
                                <p className="text-slate-400 text-base sm:text-lg mt-3">
                                    Zero hidden fees. Unlimited access to all 14 subjects, 3D simulators, and AI explanation engines.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                                {/* 1 Month */}
                                <div className="bg-slate-950/80 rounded-3xl border border-white/10 p-8 flex flex-col hover:border-cyan-500/30 transition-all duration-300">
                                    <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">Sprint Revision</div>
                                    <h3 className="text-2xl font-bold text-white mb-2">1 Month</h3>
                                    <p className="text-slate-400 text-xs mb-6">Designed for final exam polish.</p>
                                    <div className="text-4xl font-mono font-black text-white mb-6">€25<span className="text-sm font-normal text-slate-500">/mo</span></div>
                                    <ul className="space-y-3.5 mb-8 flex-1 text-xs text-slate-300">
                                        <li className="flex items-center gap-2.5"><CheckCircle size={16} className="text-emerald-400 shrink-0" /> Full access to 14 subjects</li>
                                        <li className="flex items-center gap-2.5"><CheckCircle size={16} className="text-emerald-400 shrink-0" /> 65+ 3D Cockpit Simulators</li>
                                        <li className="flex items-center gap-2.5"><CheckCircle size={16} className="text-emerald-400 shrink-0" /> AI Explanations &amp; Telemetry</li>
                                        <li className="flex items-center gap-2.5"><CheckCircle size={16} className="text-emerald-400 shrink-0" /> Web &amp; iPad access</li>
                                    </ul>
                                    <button 
                                        type="button" 
                                        onClick={() => openAuthWithMode('SIGNUP')} 
                                        className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider border border-white/10 transition-colors"
                                    >
                                        Choose 1 Month
                                    </button>
                                </div>

                                {/* 6 Months - HIGHLIGHTED */}
                                <div className="bg-gradient-to-b from-cyan-950/40 via-slate-900/80 to-slate-950 rounded-3xl border-2 border-cyan-400/50 p-8 flex flex-col relative shadow-2xl shadow-cyan-500/15 md:-translate-y-3">
                                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-cyan-400 text-slate-950 font-black text-[10px] uppercase tracking-widest shadow-md">
                                        MOST POPULAR CADET PLAN
                                    </div>
                                    <div className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-widest mb-1 mt-2">Steady Flight Path</div>
                                    <h3 className="text-2xl font-bold text-white mb-2">6 Months</h3>
                                    <p className="text-slate-400 text-xs mb-6">Ideal duration for all ATPL module phases.</p>
                                    <div className="flex items-baseline gap-2 mb-6">
                                        <div className="text-4xl font-mono font-black text-white">€70</div>
                                        <div className="text-sm font-mono text-slate-500 line-through">€150</div>
                                        <span className="text-[11px] font-bold text-emerald-400 ml-auto">Save €80</span>
                                    </div>
                                    <ul className="space-y-3.5 mb-8 flex-1 text-xs text-slate-300">
                                        <li className="flex items-center gap-2.5"><CheckCircle size={16} className="text-cyan-400 shrink-0" /> Full access to 14 subjects</li>
                                        <li className="flex items-center gap-2.5"><CheckCircle size={16} className="text-cyan-400 shrink-0" /> 65+ 3D Cockpit Simulators</li>
                                        <li className="flex items-center gap-2.5"><CheckCircle size={16} className="text-cyan-400 shrink-0" /> Unlimited AI Tutor Debriefs</li>
                                        <li className="flex items-center gap-2.5"><CheckCircle size={16} className="text-cyan-400 shrink-0" /> EgyptAir &amp; FAA Special Portals</li>
                                        <li className="flex items-center gap-2.5"><CheckCircle size={16} className="text-cyan-400 shrink-0" /> Priority Support</li>
                                    </ul>
                                    <button 
                                        type="button" 
                                        onClick={() => openAuthWithMode('SIGNUP')} 
                                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/30 active:scale-95"
                                    >
                                        Enroll For 6 Months
                                    </button>
                                </div>

                                {/* 12 Months */}
                                <div className="bg-slate-950/80 rounded-3xl border border-white/10 p-8 flex flex-col hover:border-purple-500/30 transition-all duration-300">
                                    <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">Full License Journey</div>
                                    <h3 className="text-2xl font-bold text-white mb-2">12 Months</h3>
                                    <p className="text-slate-400 text-xs mb-6">Complete peace of mind from Day 1 to graduation.</p>
                                    <div className="flex items-baseline gap-2 mb-6">
                                        <div className="text-4xl font-mono font-black text-white">€105</div>
                                        <div className="text-sm font-mono text-slate-500 line-through">€300</div>
                                        <span className="text-[11px] font-bold text-emerald-400 ml-auto">Save €195</span>
                                    </div>
                                    <ul className="space-y-3.5 mb-8 flex-1 text-xs text-slate-300">
                                        <li className="flex items-center gap-2.5"><CheckCircle size={16} className="text-purple-400 shrink-0" /> Full access to 14 subjects</li>
                                        <li className="flex items-center gap-2.5"><CheckCircle size={16} className="text-purple-400 shrink-0" /> 65+ 3D Cockpit Simulators</li>
                                        <li className="flex items-center gap-2.5"><CheckCircle size={16} className="text-purple-400 shrink-0" /> All curriculum updates free</li>
                                        <li className="flex items-center gap-2.5"><CheckCircle size={16} className="text-purple-400 shrink-0" /> Best value for integrated cadets</li>
                                    </ul>
                                    <button 
                                        type="button" 
                                        onClick={() => openAuthWithMode('SIGNUP')} 
                                        className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider border border-white/10 transition-colors"
                                    >
                                        Choose 12 Months
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* PILOT TESTIMONIALS */}
                    <section className="py-20 bg-slate-950/70 border-t border-white/5">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-12">
                                <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">Cadet Reviews</span>
                                <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1">Trusted by Aviators Across the Globe</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
                                    <div className="flex gap-1 text-amber-400">
                                        {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                    </div>
                                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                                        "The 3D Radio Navigation lab helped me understand VOR radials and DME arcs in 10 minutes, when textbook diagrams took me weeks. Cleared 062 with 96%!"
                                    </p>
                                    <div className="text-xs font-bold text-white pt-2 border-t border-white/5">
                                        Capt. Ahmed K. <span className="text-slate-500 font-normal">· EgyptAir Cadet</span>
                                    </div>
                                </div>

                                <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
                                    <div className="flex gap-1 text-amber-400">
                                        {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                    </div>
                                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                                        "The Chair-Flight ECQB questions with AI debriefing make mistake analysis instant. Passed all 14 EASA exams first try in 6 months."
                                    </p>
                                    <div className="text-xs font-bold text-white pt-2 border-t border-white/5">
                                        Luca R. <span className="text-slate-500 font-normal">· European Flight Academy</span>
                                    </div>
                                </div>

                                <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
                                    <div className="flex gap-1 text-amber-400">
                                        {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                    </div>
                                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                                        "The offline iPad app is a lifesaver. Being able to practice 100 questions while in cruising transit without relying on aircraft Wi-Fi is unmatched."
                                    </p>
                                    <div className="text-xs font-bold text-white pt-2 border-t border-white/5">
                                        Sarah T. <span className="text-slate-500 font-normal">· First Officer B737</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* REFINED FOOTER */}
                    <footer className="py-16 bg-slate-950 border-t border-white/10">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                                <div className="col-span-1 md:col-span-2 space-y-4">
                                    <div className="flex items-center space-x-3 cursor-pointer" onClick={() => scrollToSection('hero')}>
                                        <div className="p-1 w-8 h-8 bg-slate-900 rounded-lg border border-cyan-500/30 flex items-center justify-center overflow-hidden">
                                            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain scale-[3.5]" />
                                        </div>
                                        <span className="text-lg font-black text-white tracking-tighter">
                                            ATPL<span className="text-cyan-400">VECTOR</span>
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                                        Aviation flight training system designed for modern student pilots, flight academies, and commercial airline cadet programs.
                                    </p>
                                    <div className="text-[11px] font-mono text-slate-500">
                                        Question Bank powered by <span className="text-slate-300 font-bold">Chair-Flight</span> open source data. Explanations augmented by AI.
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-widest mb-3">Navigation</h4>
                                    <ul className="space-y-2 text-xs text-slate-400">
                                        <li><button onClick={() => scrollToSection('interactive-sim')} className="hover:text-white transition-colors">Cockpit Simulator</button></li>
                                        <li><button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">Features &amp; Tech</button></li>
                                        <li><button onClick={() => scrollToSection('curriculum')} className="hover:text-white transition-colors">14 ATPL Subjects</button></li>
                                        <li><button onClick={() => scrollToSection('pricing')} className="hover:text-white transition-colors">Plans &amp; Pricing</button></li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-widest mb-3">Support &amp; Legal</h4>
                                    <ul className="space-y-2 text-xs text-slate-400">
                                        <li><button onClick={() => setActiveInfoPage('CONTACT')} className="hover:text-white transition-colors">Contact Flight Support</button></li>
                                        <li><button onClick={() => setActiveInfoPage('TERMS')} className="hover:text-white transition-colors">Terms of Service</button></li>
                                        <li><button onClick={() => setActiveInfoPage('PRIVACY')} className="hover:text-white transition-colors">Privacy Policy</button></li>
                                        <li><button onClick={() => setActiveInfoPage('REFUND')} className="hover:text-white transition-colors">Refund Policy</button></li>
                                    </ul>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                                <div>
                                    &copy; {new Date().getFullYear()} ATPL Vector. All rights reserved.
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                    <span>All Systems Operational · FL390</span>
                                </div>
                            </div>
                        </div>
                    </footer>
                </>
            )}
        </div>
    );
};

export default AuthView;
