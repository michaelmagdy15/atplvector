
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { Shield, Mail, CheckCircle, Lock, ArrowRight, Plane, Zap, Menu, X, User as UserIcon, HelpCircle, Eye, EyeOff, AlertTriangle, PlayCircle, Star, Globe, BarChart3, Radio, RefreshCw, KeyRound, Target, BookOpen, Layout, Dna, Rocket } from 'lucide-react';
import { supabase, getSiteUrl } from '../lib/supabase';
import { TestimonialService } from '../services/TestimonialService';
import { Testimonial } from '../types';
import Terms from './Terms';
import Privacy from './Privacy';
import Contact from './Contact';

type AuthViewMode = 'LOGIN' | 'SIGNUP' | 'FORGOT_PASS' | 'RECOVER_ACCOUNT' | 'RESET_PASSWORD' | 'VERIFY_EMAIL';

interface Props {
    onAuthChange: (user: User) => void;
    onDemoLogin?: () => void;
    initialView?: AuthViewMode;
}

const AuthView: React.FC<Props> = ({ onAuthChange, onDemoLogin, initialView = 'LOGIN' }) => {
    const [view, setView] = useState<AuthViewMode>(initialView);
    const [activeInfoPage, setActiveInfoPage] = useState<'TERMS' | 'PRIVACY' | 'CONTACT' | null>(null);

    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [inviteCode, setInviteCode] = useState(''); // New state
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Feedback State
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [passStrength, setPassStrength] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Resend Confirmation State
    const [showResend, setShowResend] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);

    // OTP Verification State
    const [otpCode, setOtpCode] = useState('');

    // Math CAPTCHA state
    const [mathQuestion, setMathQuestion] = useState({ num1: 0, num2: 0, operator: '+', answer: 0 });
    const [captchaInput, setCaptchaInput] = useState('');

    // Generate a random math CAPTCHA question
    const generateMathQuestion = () => {
        const operators = ['+', '-', '×'];
        const operator = operators[Math.floor(Math.random() * operators.length)];
        let num1, num2, answer;

        if (operator === '+') {
            num1 = Math.floor(Math.random() * 10) + 1;
            num2 = Math.floor(Math.random() * 10) + 1;
            answer = num1 + num2;
        } else if (operator === '-') {
            num1 = Math.floor(Math.random() * 10) + 5;
            num2 = Math.floor(Math.random() * num1) + 1;
            answer = num1 - num2;
        } else {
            num1 = Math.floor(Math.random() * 5) + 1;
            num2 = Math.floor(Math.random() * 5) + 1;
            answer = num1 * num2;
        }

        setMathQuestion({ num1, num2, operator, answer });
        setCaptchaInput('');
    };

    useEffect(() => {
        generateMathQuestion();
    }, []);


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
        setLoading(true);
        setErrorMsg('');
        setShowResend(false);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
        } catch (error: any) {
            setLoading(false);
            if (error.message && (error.message.includes("Email not confirmed") || error.message.includes("Email not verified"))) {
                setErrorMsg("Email not verified. Please check your inbox for the code.");
                setShowResend(true);
            } else {
                setErrorMsg(error.message);
            }
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            const { data, error } = await supabase.auth.verifyOtp({
                email,
                token: otpCode,
                type: 'signup'
            });

            if (error) throw error;

            if (data.session) {
                setSuccessMsg("Email verified successfully! 🎉 You now have 7 days of FREE access.");
                setTimeout(() => {
                    onAuthChange(data.user as any); // Or just trigger a re-render/fetch
                }, 1500);
            } else {
                // Should technically have session, but just in case
                setSuccessMsg("Email verified! Please log in.");
                setView('LOGIN');
            }

        } catch (error: any) {
            setErrorMsg(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResendConfirmation = async () => {
        if (!email) return;
        setResendLoading(true);
        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: email,
            });
            if (error) throw error;
            setSuccessMsg("Confirmation email resent! Please check your inbox.");
            setErrorMsg('');
            setShowResend(false);
        } catch (error: any) {
            setErrorMsg(error.message);
        } finally {
            setResendLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fullName.trim()) return setErrorMsg("Full Name is required.");
        if (password !== confirmPassword) return setErrorMsg("Passwords do not match.");
        if (passStrength < 3) return setErrorMsg("Password is too weak. Please use a stronger password.");

        // Validate CAPTCHA
        if (parseInt(captchaInput) !== mathQuestion.answer) {
            generateMathQuestion();
            return setErrorMsg("Incorrect answer. Please solve the math problem correctly.");
        }

        setLoading(true);
        setErrorMsg('');

        try {
            let initialStatus = 'PENDING_APPROVAL';
            let validCodeId = null;

            // Validate Invite Code if provided
            if (inviteCode.trim()) {
                const { data: codeData, error: codeError } = await supabase
                    .from('access_codes')
                    .select('*')
                    .eq('code', inviteCode.trim())
                    .eq('is_used', false) // Ensure code isn't already used
                    .single();

                if (codeError || !codeData) {
                    throw new Error("Invalid or expired invite code.");
                }

                initialStatus = 'FREE_TRIAL'; // Or VERIFIED, acts as approval
                validCodeId = codeData.id;
            }

            // Notify admin of new signup attempt
            await sendAdminNotification(`New Signup: ${email} [${initialStatus}]`, {
                email: email,
                full_name: fullName,
                invite_code: inviteCode,
                status: initialStatus,
                type: 'SIGNUP_ATTEMPT',
                timestamp: new Date().toISOString()
            });

            // Create account 
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        initial_status: initialStatus, // Pass to App.tsx / triggers
                        invite_code_id: validCodeId
                    },
                },
            });

            if (signUpError) throw signUpError;

            // Mark code as used if successful signup and valid code
            if (signUpData.user && validCodeId) {
                await supabase
                    .from('access_codes')
                    .update({
                        is_used: true,
                        used_by_user: signUpData.user.id,
                        used_at: new Date().toISOString()
                    })
                    .eq('id', validCodeId);
            }

            // If we have a session, we are logged in (email confirm disabled)
            if (signUpData.session) {
                if (initialStatus === 'PENDING_APPROVAL') {
                    setSuccessMsg("Account created! ⏳ Waiting for admin approval.");
                } else {
                    setSuccessMsg("Account created! 🎉 You now have 7 days of FREE access.");
                }
            } else {
                // Email confirmation required - redirect to OTP entry
                setSuccessMsg("Account created! Please enter the code sent to your email.");
                setView('VERIFY_EMAIL');
            }
        } catch (error: any) {
            setErrorMsg(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return setErrorMsg("Please enter your email.");
        setLoading(true);
        setErrorMsg('');

        try {
            // Notify admin of password reset request
            await sendAdminNotification(`Reset Password Request: ${email}`, {
                email: email,
                type: 'PASSWORD_RESET_REQUEST',
                timestamp: new Date().toISOString()
            });

            const siteUrl = getSiteUrl();
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                // Redirect to root to avoid "Cannot GET /auth/reset" errors
                redirectTo: `${siteUrl}`,
            });
            if (error) throw error;
            setSuccessMsg("Password reset link sent to your email.");
        } catch (error: any) {
            setErrorMsg(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Hero 3D Interaction State
    const [heroMouse, setHeroMouse] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Calculate normalized mouse position (-1 to 1) for tilt
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = (e.clientY / window.innerHeight) * 2 - 1;
            setHeroMouse({ x, y });

            // Update CSS variables for the shimmer/slider effect relative to text
            const hero = document.getElementById('hero-text');
            if (hero) {
                const rect = hero.getBoundingClientRect();
                const relX = e.clientX - rect.left;
                const relY = e.clientY - rect.top;
                hero.style.setProperty('--mouse-x', `${relX}px`);
                hero.style.setProperty('--mouse-y', `${relY}px`);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) return setErrorMsg("Passwords do not match.");

        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({ password });
            if (error) throw error;
            setSuccessMsg("Password updated successfully! Redirecting...");
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
        } catch (error: any) {
            setErrorMsg(error.message);
            setLoading(false);
        }
    };

    const handleAccountRecovery = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMsg("Please contact support at support@atplvector.com with your Full Name and purchase details for manual recovery.");
    };

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
    };

    return (
        <div className="min-h-screen font-sans text-slate-100 overflow-x-hidden selection:bg-blue-500/30 selection:text-white bg-slate-950">

            {/* Info Pages Overlay */}
            {activeInfoPage === 'TERMS' && <Terms onBack={() => setActiveInfoPage(null)} />}
            {activeInfoPage === 'PRIVACY' && <Privacy onBack={() => setActiveInfoPage(null)} />}
            {activeInfoPage === 'CONTACT' && <Contact onBack={() => setActiveInfoPage(null)} />}

            {activeInfoPage === null && (
                <>
                    {/* Nav */}
                    <nav className="fixed top-6 w-full z-50 flex justify-center pointer-events-none animate-in slide-in-from-top-4 duration-700">
                        <div className="pointer-events-auto w-[92%] max-w-7xl glass-panel rounded-full h-16 md:h-20 px-6 md:px-10 flex items-center justify-between bg-slate-900/70 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                            <div className="flex items-center space-x-2 cursor-pointer group" onClick={() => scrollToSection('hero')}>
                                <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <Plane className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-black text-white tracking-tighter">ATPL<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">VECTOR</span></span>
                            </div>

                            <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
                                <button onClick={() => scrollToSection('features')} className="hover:text-white transition hover:scale-105">Features</button>
                                <button onClick={() => scrollToSection('experience')} className="hover:text-white transition hover:scale-105">Experience</button>
                                <button onClick={() => scrollToSection('pricing')} className="hover:text-white transition hover:scale-105">Pricing</button>
                                <button onClick={() => { scrollToSection('hero'); setView('LOGIN'); }} className="text-white hover:text-blue-300 transition">Login</button>
                                <button onClick={() => { scrollToSection('hero'); setView('SIGNUP'); }} className="bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-full font-bold transition hover:shadow-lg hover:shadow-blue-500/20 active:scale-95">Get Started</button>
                            </div>
                            <div className="md:hidden">
                                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">{mobileMenuOpen ? <X /> : <Menu />}</button>
                            </div>
                        </div>
                        {/* Mobile Menu */}
                        {mobileMenuOpen && (
                            <div className="absolute top-24 left-4 right-4 bg-slate-900 rounded-2xl border border-white/10 p-4 flex flex-col space-y-4 md:hidden z-50 shadow-2xl animate-in slide-in-from-top-4">
                                <button onClick={() => scrollToSection('features')} className="text-left px-4 py-2 hover:bg-white/5 rounded-lg">Features</button>
                                <button onClick={() => scrollToSection('pricing')} className="text-left px-4 py-2 hover:bg-white/5 rounded-lg">Pricing</button>
                                <button onClick={() => { scrollToSection('hero'); setView('LOGIN'); }} className="text-left px-4 py-2 hover:bg-white/5 rounded-lg">Login</button>
                            </div>
                        )}
                    </nav>

                    {/* HERO SECTION */}
                    <div id="hero" className="flex flex-col lg:flex-row min-h-screen pt-20 lg:pt-0 relative overflow-hidden">
                        <div className="absolute inset-0 bg-grid-pattern pointer-events-none"></div>

                        {/* Background FX */}
                        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-blob pointer-events-none"></div>
                        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-blob animation-delay-2000 pointer-events-none"></div>

                        {/* Left: Value Prop */}
                        <div className="lg:w-1/2 flex flex-col justify-center px-8 lg:px-20 relative z-10 pt-10 lg:pt-0 perspective-1000">
                            <div className="space-y-8 max-w-xl">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span> EASA 2026 Ready
                                </div>
                                <h1
                                    id="hero-text"
                                    className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 drop-shadow-2xl transition-transform duration-100 ease-out"
                                    style={{
                                        transform: `rotateX(${heroMouse.y * -5}deg) rotateY(${heroMouse.x * 5}deg)`,
                                        backgroundImage: 'radial-gradient(circle 300px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.4), transparent)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        color: 'white', // Fallback
                                        // We mix the gradient with text color using blend mode or just overlaying
                                    }}
                                >
                                    Master <br />
                                    <span
                                        className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 drop-shadow-lg filter relative"
                                        style={{
                                            filter: `brightness(${1 + Math.abs(heroMouse.x) * 0.3}) saturate(${1 + Math.abs(heroMouse.y) * 0.2})`
                                        }}
                                    >
                                        ATPL Theory
                                        {/* Interactive Slider / Shimmer Overlay */}
                                        <span
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none mix-blend-overlay"
                                            style={{
                                                transform: `translateX(${(heroMouse.x + 1) * 50}%) skewX(-20deg)`,
                                                opacity: 0.5 + Math.abs(heroMouse.x) * 0.5
                                            }}
                                        ></span>
                                    </span>
                                    <br />Visually.
                                </h1>
                                <p className="text-slate-400 text-lg lg:text-xl font-light animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                                    Interactive simulations, AI-driven roleplay, and immersive systems logic designed for modern pilots. Forget static PDFs.
                                </p>
                                <div className="flex gap-4 text-sm text-slate-500 font-mono animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
                                    <div className="flex items-center gap-2"><CheckCircle className="text-green-500 w-4 h-4" /> 14 Subjects</div>
                                    <div className="flex items-center gap-2"><CheckCircle className="text-green-500 w-4 h-4" /> 65+ Simulators</div>
                                </div>

                                <div className="pt-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-700">
                                    <div className="glass-panel px-6 py-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 flex items-center gap-4">
                                        <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                                            <Shield size={20} />
                                        </div>
                                        <div>
                                            <div className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">Platform Status</div>
                                            <div className="text-white font-bold text-sm">Exclusive Invite-Only Beta</div>
                                            <div className="text-[10px] text-slate-500 mt-1">Codes are required to skip the waitlist and gain immediate access.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Auth Form */}
                        <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-20 relative z-10">
                            {/* Cockpit Glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-blue-600/15 rounded-full blur-[100px] pointer-events-none mix-blend-screen animate-pulse duration-[4000ms]"></div>

                            <div className="w-full max-w-md glass-card bg-slate-900/80 backdrop-blur-2xl border border-white/10 p-8 rounded-[2rem] relative overflow-hidden group shadow-2xl animate-in fade-in slide-in-from-right-8 duration-1000">
                                <div className="relative z-10">
                                    <div className="mb-8">
                                        <h2 className="text-3xl font-bold text-white mb-2">
                                            {view === 'LOGIN' && 'Welcome Back'}
                                            {view === 'SIGNUP' && 'Start Your Journey'}
                                            {view === 'FORGOT_PASS' && 'Reset Password'}
                                            {view === 'RECOVER_ACCOUNT' && 'Account Recovery'}
                                            {view === 'RESET_PASSWORD' && 'Set New Password'}
                                            {view === 'VERIFY_EMAIL' && 'Verify Email'}
                                        </h2>
                                        <p className="text-slate-400">
                                            {view === 'LOGIN' && 'Enter your details to access the cockpit.'}
                                            {view === 'SIGNUP' && 'Create a secure account to begin.'}
                                            {view === 'FORGOT_PASS' && 'We\'ll email you a secure reset link.'}
                                            {view === 'RECOVER_ACCOUNT' && 'Lost access to your email?'}
                                            {view === 'RESET_PASSWORD' && 'Enter your new password below.'}
                                            {view === 'VERIFY_EMAIL' && 'Enter the 6-digit code sent to your email.'}
                                        </p>
                                    </div>

                                    {errorMsg && (
                                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm font-medium flex flex-col gap-3 animate-in slide-in-from-top-2">
                                            <div className="flex items-start gap-3">
                                                <AlertTriangle size={16} className="mt-0.5 text-red-400 shrink-0" />
                                                <span>{errorMsg}</span>
                                            </div>
                                            {showResend && (
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={handleResendConfirmation}
                                                        disabled={resendLoading}
                                                        className="ml-7 text-xs bg-red-500/20 hover:bg-red-500/30 text-red-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 w-fit"
                                                    >
                                                        {resendLoading ? <RefreshCw className="animate-spin w-3 h-3" /> : <Mail className="w-3 h-3" />}
                                                        Resend Confirmation Code
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setView('VERIFY_EMAIL')}
                                                        className="text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 w-fit"
                                                    >
                                                        Enter Code
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {successMsg && (
                                        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-200 text-sm font-medium flex items-start gap-3 animate-in slide-in-from-top-2">
                                            <CheckCircle size={16} className="mt-0.5 text-green-400 shrink-0" />
                                            <span>{successMsg}</span>
                                        </div>
                                    )}

                                    {/* RECOVER ACCOUNT VIEW */}
                                    {view === 'RECOVER_ACCOUNT' ? (
                                        <div className="space-y-4">
                                            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-sm text-slate-300">
                                                <p className="mb-2 font-bold text-white flex items-center gap-2"><HelpCircle size={16} /> Forgot your email?</p>
                                                <p className="mb-2">For security reasons, we cannot lookup accounts by name publicly.</p>
                                                <ul className="list-disc pl-4 space-y-1 text-slate-400">
                                                    <li>Search your inboxes for "Welcome to ATPLVector".</li>
                                                    <li>Try logging in with commonly used emails.</li>
                                                    <li>Contact support with your proof of purchase.</li>
                                                </ul>
                                            </div>
                                            <button onClick={handleAccountRecovery} className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold">Contact Support</button>
                                            <button onClick={() => setView('LOGIN')} className="w-full py-3 bg-transparent hover:bg-white/5 text-slate-400 rounded-xl font-bold">Back to Login</button>
                                        </div>
                                    ) : (
                                        /* FORM FIELDS */
                                        <form onSubmit={
                                            view === 'LOGIN' ? handleLogin :
                                                view === 'SIGNUP' ? handleSignup :
                                                    view === 'RESET_PASSWORD' ? handlePasswordReset :
                                                        view === 'VERIFY_EMAIL' ? handleVerifyOtp :
                                                            handleForgotPassword
                                        } className="space-y-5">

                                            {view === 'VERIFY_EMAIL' && (
                                                <div className="animate-in slide-in-from-left-4 fade-in">
                                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Verification Code</label>
                                                    <div className="relative">
                                                        <KeyRound className="absolute left-4 top-3.5 text-slate-500 w-5 h-5" />
                                                        <input required type="text" value={otpCode} onChange={e => setOtpCode(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-blue-500 outline-none transition-all placeholder-slate-600 tracking-[0.5em] text-center font-mono text-lg" placeholder="123456" maxLength={6} />
                                                    </div>
                                                    <p className="text-xs text-slate-500 mt-2 text-center">Enter the 6-digit code sent to <strong>{email}</strong></p>
                                                </div>
                                            )}

                                            {view === 'SIGNUP' && (
                                                <div className="animate-in slide-in-from-left-4 fade-in">
                                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Full Name</label>
                                                    <div className="relative">
                                                        <UserIcon className="absolute left-4 top-3.5 text-slate-500 w-5 h-5" />
                                                        <input required type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-blue-500 outline-none transition-all placeholder-slate-600" placeholder="Captain Name" />
                                                    </div>

                                                    {/* Invite Code Input */}
                                                    <div className="mt-4">
                                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Invite Code <span className="text-slate-600 font-normal lowercase">(Optional, skips waitlist)</span></label>
                                                        <div className="relative">
                                                            <KeyRound className="absolute left-4 top-3.5 text-slate-500 w-5 h-5" />
                                                            <input
                                                                type="text"
                                                                value={inviteCode}
                                                                onChange={e => setInviteCode(e.target.value.toUpperCase())}
                                                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-blue-500 outline-none transition-all placeholder-slate-600 font-mono tracking-widest uppercase"
                                                                placeholder="CODE"
                                                                maxLength={10}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {view !== 'RESET_PASSWORD' && view !== 'VERIFY_EMAIL' && (
                                                <div className="animate-in slide-in-from-left-4 fade-in delay-75">
                                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Email Address</label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-4 top-3.5 text-slate-500 w-5 h-5" />
                                                        <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-blue-500 outline-none transition-all placeholder-slate-600" placeholder="pilot@example.com" />
                                                    </div>
                                                </div>
                                            )}

                                            {view !== 'FORGOT_PASS' && view !== 'VERIFY_EMAIL' && (
                                                <div className="animate-in slide-in-from-left-4 fade-in delay-100">
                                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Password</label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-4 top-3.5 text-slate-500 w-5 h-5" />
                                                        <input required type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-12 pr-10 text-white focus:border-blue-500 outline-none transition-all placeholder-slate-600" placeholder="••••••••" />
                                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-slate-500 hover:text-white">
                                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                        </button>
                                                    </div>
                                                    {/* Strength Meter for Signup */}
                                                    {(view === 'SIGNUP' || view === 'RESET_PASSWORD') && password && (
                                                        <div className="mt-2 flex items-center gap-2">
                                                            <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                                                                <div className={`h-full transition-all duration-500 ${passStrength <= 2 ? 'bg-red-500' : passStrength === 3 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${(passStrength / 4) * 100}%` }}></div>
                                                            </div>
                                                            <span className="text-[10px] font-bold text-slate-400">{passStrength <= 2 ? 'Weak' : passStrength === 3 ? 'Good' : 'Strong'}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {(view === 'SIGNUP' || view === 'RESET_PASSWORD') && (
                                                <div className="animate-in slide-in-from-left-4 fade-in delay-150">
                                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Confirm Password</label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-4 top-3.5 text-slate-500 w-5 h-5" />
                                                        <input required type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-blue-500 outline-none transition-all placeholder-slate-600" placeholder="••••••••" />
                                                    </div>
                                                </div>
                                            )}

                                            {view === 'SIGNUP' && (
                                                <div className="animate-in slide-in-from-left-4 fade-in delay-200">
                                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Human Verification</label>
                                                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                                                        <div className="bg-slate-800 px-4 py-3 rounded-xl border border-slate-600 text-white font-mono text-lg select-none w-full sm:w-auto sm:min-w-[100px] text-center shadow-inner">
                                                            {mathQuestion.num1} {mathQuestion.operator} {mathQuestion.num2} = ?
                                                        </div>
                                                        <div className="relative flex-1 w-full">
                                                            <input
                                                                required
                                                                type="number"
                                                                value={captchaInput}
                                                                onChange={e => setCaptchaInput(e.target.value)}
                                                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white text-center text-lg focus:border-blue-500 outline-none transition-all placeholder-slate-600 font-mono pl-10"
                                                                placeholder="?"
                                                            />
                                                            <Shield className="absolute left-3 top-3.5 text-slate-500 w-5 h-5 opacity-50" />
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={generateMathQuestion}
                                                            className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-600 text-slate-400 hover:text-white transition-all transform hover:rotate-180 duration-500"
                                                            title="New question"
                                                        >
                                                            <RefreshCw size={18} />
                                                        </button>
                                                    </div>
                                                    <p className="text-[10px] text-slate-500 mt-2 ml-1">Solve the math problem to prove you're human.</p>
                                                </div>
                                            )}

                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center shadow-lg transform active:scale-[0.98] animate-in zoom-in duration-300 delay-200 hover:shadow-blue-500/25"
                                            >
                                                {loading ? <Zap className="animate-spin w-5 h-5" /> : (
                                                    view === 'LOGIN' ? 'Sign In' :
                                                        view === 'SIGNUP' ? 'Create Account' :
                                                            view === 'RESET_PASSWORD' ? 'Set New Password' :
                                                                view === 'VERIFY_EMAIL' ? 'Verify Code' :
                                                                    'Send Reset Link'
                                                )}
                                                {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
                                            </button>

                                            {/* Action Links */}
                                            <div className="text-center space-y-3 mt-4">
                                                {view === 'LOGIN' && (
                                                    <>
                                                        <button type="button" onClick={() => setView('FORGOT_PASS')} className="text-sm text-slate-400 hover:text-white block w-full transition-colors">Forgot Password?</button>
                                                        <button type="button" onClick={() => setView('SIGNUP')} className="text-sm text-slate-400 hover:text-white block w-full transition-colors">Don't have an account? <strong className="text-blue-400">Sign Up</strong></button>
                                                    </>
                                                )}
                                                {view === 'SIGNUP' && (
                                                    <button type="button" onClick={() => setView('LOGIN')} className="text-sm text-slate-400 hover:text-white transition-colors">Already have an account? <strong className="text-blue-400">Log In</strong></button>
                                                )}
                                                {view === 'FORGOT_PASS' && (
                                                    <>
                                                        <button type="button" onClick={() => setView('LOGIN')} className="text-sm text-slate-400 hover:text-white block w-full transition-colors">Back to Login</button>
                                                        <button type="button" onClick={() => setView('RECOVER_ACCOUNT')} className="text-xs text-slate-500 hover:text-slate-300 mt-2 block w-full transition-colors">Forgot Email Address?</button>
                                                    </>
                                                )}
                                            </div>

                                            {view === 'LOGIN' && onDemoLogin && (
                                                <div className="pt-4 border-t border-white/10 animate-in fade-in delay-300">
                                                    <button type="button" onClick={onDemoLogin} className="w-full bg-white/5 hover:bg-white/10 text-slate-300 py-3 rounded-xl font-bold transition-all flex items-center justify-center border border-white/10 hover:border-emerald-500/50 hover:text-emerald-400 group">
                                                        <PlayCircle className="mr-2 w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" /> Demo Access
                                                    </button>
                                                </div>
                                            )}
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FEATURES SHOWCASE */}
                    <div id="features" className="py-32 bg-slate-900 relative overflow-hidden">
                        {/* Background Accents */}
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                        <div className="max-w-7xl mx-auto px-6 relative z-10">
                            <div className="text-center mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-6">
                                    <Rocket size={12} /> Complete Pilot Suite
                                </div>
                                <h2 className="text-4xl md:text-6xl font-black text-white mt-2 tracking-tight">The ultimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">visual</span> study stack.</h2>
                                <p className="text-slate-400 mt-6 max-w-2xl mx-auto text-lg">We've combined deep interactive theory with a professional-grade question bank and strategic analytics to give you the highest possible chance of passing first time.</p>
                            </div>

                            {/* Bento Grid Layout */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                                {/* Card 1: Visual Theory (Large Interactive) */}
                                <div className="lg:col-span-7 relative group rounded-[2.5rem] bg-slate-900/50 border border-white/5 overflow-hidden hover:border-blue-500/20 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                    <div className="p-8 lg:p-10 h-full flex flex-col justify-between relative z-10">
                                        <div className="space-y-4">
                                            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20">
                                                <Layout size={24} />
                                            </div>
                                            <h3 className="text-3xl font-black text-white">Interactive Theory</h3>
                                            <p className="text-slate-400 text-lg leading-relaxed max-w-md">Every subject is an interactive lab. Manipulate controls, simulate physics, and visualize systems in real-time.</p>
                                        </div>
                                        <div className="mt-8 relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl group-hover:scale-[1.02] transition-transform duration-700">
                                            <img src="/assets/walkthroughs/planner_demo.webp" alt="Sim" className="w-full h-64 object-cover" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                                            <div className="absolute bottom-4 left-4 flex gap-3">
                                                <div className="px-3 py-1.5 bg-black/60 backdrop-blur rounded-lg text-xs font-bold text-white border border-white/10 flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                                    Live Simulation
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Card 2: Psychological Readiness (Tall Stats) */}
                                <div className="lg:col-span-5 relative group rounded-[2.5rem] bg-slate-900/50 border border-white/5 overflow-hidden hover:border-purple-500/20 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10">
                                    <div className="absolute inset-0 bg-gradient-to-bl from-purple-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                    <div className="p-8 lg:p-10 h-full flex flex-col relative z-10">
                                        <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 border border-purple-500/20 mb-6">
                                            <BarChart3 size={24} />
                                        </div>
                                        <h3 className="text-3xl font-black text-white mb-4">Exam Readiness</h3>
                                        <p className="text-slate-400 mb-8">We measure 94% accuracy and 45s pacing before we recommend sitting the exam.</p>

                                        <div className="flex-1 grid grid-cols-1 gap-4">
                                            <div className="p-5 bg-slate-800/40 rounded-2xl border border-white/5 flex items-center justify-between group-hover:bg-slate-800/60 transition-colors">
                                                <div>
                                                    <div className="text-purple-400 font-black text-2xl">94%</div>
                                                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Accuracy Goal</div>
                                                </div>
                                                <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400"><Target size={20} /></div>
                                            </div>
                                            <div className="p-5 bg-slate-800/40 rounded-2xl border border-white/5 flex items-center justify-between group-hover:bg-slate-800/60 transition-colors">
                                                <div>
                                                    <div className="text-emerald-400 font-black text-2xl">45s</div>
                                                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Avg Pacing</div>
                                                </div>
                                                <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400"><Zap size={20} /></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Card 3: Question Bank (Wide) */}
                                <div className="lg:col-span-12 relative group rounded-[2.5rem] bg-slate-900/50 border border-white/5 overflow-hidden hover:border-indigo-500/20 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10">
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                    <div className="p-8 lg:p-10 flex flex-col lg:flex-row items-center gap-10 relative z-10">
                                        <div className="lg:w-1/2 space-y-6">
                                            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                                                <BookOpen size={24} />
                                            </div>
                                            <h3 className="text-3xl font-black text-white">Modern Question Bank</h3>
                                            <p className="text-slate-400 text-lg leading-relaxed mb-4">
                                                Built on **Chair-Flight** open source data. Includes Smart Retest workflows, Error Attribution, and AI-driven explanations.
                                            </p>
                                            <div className="bg-gradient-to-r from-indigo-600/20 to-blue-600/20 border border-indigo-500/30 p-4 rounded-xl mb-4 animate-pulse">
                                                <p className="text-indigo-200 text-xs font-black uppercase tracking-widest text-center">
                                                    Try now the Chairflight Question Bank on our platform enhanced for free!
                                                </p>
                                            </div>
                                            <div className="flex flex-wrap gap-3">
                                                <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase">ECQB 2026</span>
                                                <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase">15,000+ Questions</span>
                                                <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase">AI Explanation Support</span>
                                            </div>
                                        </div>
                                        <div className="lg:w-1/2 w-full relative">
                                            <div className="w-full aspect-video bg-slate-950 rounded-2xl border border-white/10 overflow-hidden relative group-hover:scale-[1.01] transition-transform duration-500">
                                                {/* Simulated UI elements (Bento style) */}
                                                <div className="absolute inset-0 p-6 flex flex-col gap-4">
                                                    <div className="w-full h-8 bg-white/5 rounded-lg flex items-center px-4 gap-2">
                                                        <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                                        <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                                        <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                                                    </div>
                                                    <div className="flex-1 grid grid-cols-2 gap-4">
                                                        <div className="bg-white/5 rounded-lg animate-pulse"></div>
                                                        <div className="bg-white/5 rounded-lg animate-pulse delay-75"></div>
                                                        <div className="col-span-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20 p-4">
                                                            <div className="h-2 w-1/3 bg-indigo-500/50 rounded-full mb-2"></div>
                                                            <div className="h-2 w-2/3 bg-indigo-500/30 rounded-full"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Glow behind */}
                                            <div className="absolute -inset-4 bg-indigo-500/20 blur-2xl -z-10 opacity-50 group-hover:opacity-80 transition-opacity"></div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* 3D CINEMATIC SHOWCASE */}
                    <div id="experience" className="py-32 bg-slate-950 relative overflow-hidden flex flex-col items-center">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-blue-600/10 rounded-full blur-[180px] pointer-events-none"></div>

                        <div className="max-w-7xl mx-auto px-6 text-center mb-20 relative z-10">
                            <span className="text-blue-500 font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">The Vector Experience</span>
                            <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-6">Designed for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 italic">Immersion.</span></h2>
                            <p className="text-slate-400 max-w-2xl mx-auto text-lg">We've engineered a platform that moves as fast as you do. Experience the most powerful study environment ever built for aviation.</p>
                        </div>

                        {/* 3D Floating Product Stack */}
                        <div className="relative w-full max-w-5xl aspect-[16/10] perspective-2000 group cursor-default mb-20">
                            <div className="relative w-full h-full transition-all duration-1000 transform-gpu preserve-3d group-hover:rotate-x-5 group-hover:rotate-y-n10">

                                {/* Background Layer (Dashboard) */}
                                <div className="absolute top-0 left-0 w-[90%] h-[90%] bg-slate-900 rounded-3xl border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden transform translate-z-0 opacity-40 blur-[2px] group-hover:blur-0 transition-all duration-700">
                                    <img src="/assets/walkthroughs/planner_demo.webp" className="w-full h-full object-cover opacity-50" alt="Dashboard Layer" />
                                </div>

                                {/* Mid Layer (Question Bank) */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-[45%] -translate-y-[45%] w-[85%] h-[85%] bg-slate-800 rounded-3xl border border-white/20 shadow-2xl overflow-hidden transform translate-z-150 rotate-x-2 rotate-y-n5 hover:translate-z-200 transition-transform duration-500">
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-transparent"></div>
                                    <img src="/assets/walkthroughs/confidence_demo.webp" className="w-full h-full object-cover opacity-80" alt="QB Layer" />
                                    <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">Live Analysis</span>
                                    </div>
                                </div>

                                {/* Top Layer (Interactive Sim) */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-white rounded-2xl shadow-[0_100px_150px_-30px_rgba(59,130,246,0.3)] overflow-hidden transform translate-z-300 group-hover:translate-z-450 transition-transform duration-700">
                                    <div className="absolute inset-0 bg-slate-900 group">
                                        <img src="/assets/walkthroughs/planner_demo.webp" className="w-full h-full object-cover opacity-90 scale-110 group-hover:scale-125 transition-transform duration-[10s]" alt="Simulation Layer" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-20 h-20 bg-blue-600/20 backdrop-blur-xl rounded-full border border-blue-500/50 flex items-center justify-center text-white scale-90 group-hover:scale-110 transition-transform shadow-2xl shadow-blue-500/50">
                                                <PlayCircle size={40} className="ml-1" />
                                            </div>
                                        </div>
                                        <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                                            <div>
                                                <div className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em] mb-1">Module 01</div>
                                                <div className="text-white font-black text-xl tracking-tight">VFR Comms Lab</div>
                                            </div>
                                            <div className="px-4 py-2 bg-white/10 backdrop-blur rounded-xl border border-white/10 text-xs font-bold text-white">
                                                4K Simulation
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Decor Elements */}
                                <div className="absolute top-10 right-20 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse transform translate-z-500"></div>
                                <div className="absolute bottom-10 left-20 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000 transform translate-z-400"></div>
                            </div>
                        </div>

                        {/* Feature Tickers */}
                        <div className="w-full py-10 bg-white/[0.02] border-y border-white/5 relative z-10">
                            <div className="max-w-7xl mx-auto px-6 overflow-hidden">
                                <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 text-slate-500 font-black text-[10px] uppercase tracking-[0.4em]">
                                    <span className="flex items-center gap-2 hover:text-white transition-colors cursor-default"><Dna size={14} className="text-blue-500" /> Neural Explanations</span>
                                    <span className="flex items-center gap-2 hover:text-white transition-colors cursor-default"><Rocket size={14} className="text-indigo-500" /> Hyper-Fast UI</span>
                                    <span className="flex items-center gap-2 hover:text-white transition-colors cursor-default"><Target size={14} className="text-emerald-500" /> Pattern AI</span>
                                    <span className="flex items-center gap-2 hover:text-white transition-colors cursor-default"><Layout size={14} className="text-purple-500" /> 3D Viewports</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PRICING SECTION */}
                    <div id="pricing" className="py-24 bg-slate-900">
                        <div className="max-w-7xl mx-auto px-6">
                            <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                <span className="text-indigo-400 font-bold uppercase tracking-widest text-sm">Pricing</span>
                                <h2 className="text-3xl md:text-5xl font-black text-white mt-2">Premium visual learning, accessible prices.</h2>
                                <p className="text-slate-400 mt-4">Choose your study duration. All plans include every subject and simulator.</p>
                            </div>

                            {/* Duration-based Pricing Grid */}
                            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto mb-16">
                                {/* 12 Months - Best Value */}
                                <div className="bg-slate-800 p-6 rounded-2xl border-2 border-emerald-500 relative flex flex-col hover:scale-105 transition-transform duration-300 shadow-xl shadow-emerald-500/10">
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">Best Value</div>
                                    <h3 className="font-bold text-white text-lg mt-2">12 Months</h3>
                                    <div className="my-4">
                                        <span className="text-slate-500 line-through text-sm">€139</span>
                                        <span className="text-3xl font-black text-white ml-2">€119</span>
                                    </div>
                                    <p className="text-emerald-400 text-xs font-bold">~€10/month</p>
                                    <button onClick={() => { scrollToSection('hero'); setView('SIGNUP'); }} className="mt-4 w-full py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition text-sm">Get Started</button>
                                </div>

                                {/* 9 Months */}
                                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex flex-col hover:border-blue-500 hover:scale-105 transition-all duration-300">
                                    <h3 className="font-bold text-white text-lg">9 Months</h3>
                                    <div className="my-4">
                                        <span className="text-slate-500 line-through text-sm">€119</span>
                                        <span className="text-3xl font-black text-white ml-2">€99</span>
                                    </div>
                                    <p className="text-blue-400 text-xs font-bold">~€11/month</p>
                                    <button onClick={() => { scrollToSection('hero'); setView('SIGNUP'); }} className="mt-4 w-full py-2 rounded-xl border border-slate-600 text-white font-bold hover:bg-slate-700 transition text-sm">Select</button>
                                </div>

                                {/* 6 Months */}
                                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex flex-col hover:border-blue-500 hover:scale-105 transition-all duration-300">
                                    <h3 className="font-bold text-white text-lg">6 Months</h3>
                                    <div className="my-4">
                                        <span className="text-slate-500 line-through text-sm">€89</span>
                                        <span className="text-3xl font-black text-white ml-2">€79</span>
                                    </div>
                                    <p className="text-blue-400 text-xs font-bold">~€13/month</p>
                                    <button onClick={() => { scrollToSection('hero'); setView('SIGNUP'); }} className="mt-4 w-full py-2 rounded-xl border border-slate-600 text-white font-bold hover:bg-slate-700 transition text-sm">Select</button>
                                </div>

                                {/* 3 Months */}
                                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex flex-col hover:border-blue-500 hover:scale-105 transition-all duration-300">
                                    <h3 className="font-bold text-white text-lg">3 Months</h3>
                                    <div className="my-4">
                                        <span className="text-slate-500 line-through text-sm">€59</span>
                                        <span className="text-3xl font-black text-white ml-2">€49</span>
                                    </div>
                                    <p className="text-blue-400 text-xs font-bold">~€16/month</p>
                                    <button onClick={() => { scrollToSection('hero'); setView('SIGNUP'); }} className="mt-4 w-full py-2 rounded-xl border border-slate-600 text-white font-bold hover:bg-slate-700 transition text-sm">Select</button>
                                </div>

                                {/* 1 Month */}
                                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex flex-col hover:border-blue-500 hover:scale-105 transition-all duration-300">
                                    <h3 className="font-bold text-white text-lg">1 Month</h3>
                                    <div className="my-4">
                                        <span className="text-slate-500 line-through text-sm">€25</span>
                                        <span className="text-3xl font-black text-white ml-2">€19</span>
                                    </div>
                                    <p className="text-slate-400 text-xs font-bold">Trial friendly</p>
                                    <button onClick={() => { scrollToSection('hero'); setView('SIGNUP'); }} className="mt-4 w-full py-2 rounded-xl border border-slate-600 text-white font-bold hover:bg-slate-700 transition text-sm">Try It</button>
                                </div>

                                {/* Single Subject */}
                                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex flex-col hover:border-purple-500 hover:scale-105 transition-all duration-300">
                                    <h3 className="font-bold text-white text-lg">1 Subject</h3>
                                    <div className="my-4">
                                        <span className="text-slate-500 line-through text-sm">€29</span>
                                        <span className="text-3xl font-black text-white ml-2">€25</span>
                                    </div>
                                    <p className="text-purple-400 text-xs font-bold">3 months access</p>
                                    <button onClick={() => { scrollToSection('hero'); setView('SIGNUP'); }} className="mt-4 w-full py-2 rounded-xl border border-slate-600 text-white font-bold hover:bg-slate-700 transition text-sm">Focus Mode</button>
                                </div>
                            </div>

                            {/* All Plans Include */}
                            <div className="text-center mb-16">
                                <p className="text-slate-400 text-sm mb-4">All plans include:</p>
                                <div className="flex flex-wrap justify-center gap-4 text-xs">
                                    <span className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full text-slate-300"><CheckCircle size={14} className="text-emerald-500" /> All 14 ATPL Subjects</span>
                                    <span className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full text-slate-300"><CheckCircle size={14} className="text-emerald-500" /> 50+ Interactive Simulators</span>
                                    <span className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full text-slate-300"><CheckCircle size={14} className="text-emerald-500" /> AI ATC Roleplay</span>
                                    <span className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full text-slate-300"><CheckCircle size={14} className="text-emerald-500" /> EASA 2026 Aligned</span>
                                </div>
                            </div>

                            {/* Why ATPLVector - Comparison Section */}
                            <div className="bg-slate-800/50 rounded-3xl border border-slate-700 p-8 md:p-12 max-w-5xl mx-auto">
                                <div className="text-center mb-10">
                                    <h3 className="text-2xl md:text-3xl font-black text-white">Why ATPLVector?</h3>
                                    <p className="text-slate-400 mt-2">Understanding vs. Memorization</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* ATPLVector Column */}
                                    <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-2xl p-6 border border-blue-500/30">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 bg-blue-500/20 rounded-lg">
                                                <Plane className="w-6 h-6 text-blue-400" />
                                            </div>
                                            <h4 className="font-bold text-white text-lg">ATPLVector</h4>
                                            <span className="ml-auto text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full font-bold">Visual Learning</span>
                                        </div>
                                        <ul className="space-y-4">
                                            <li className="flex gap-3 text-sm">
                                                <CheckCircle size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                                                <span className="text-slate-300"><strong className="text-white">3D Interactive Simulations</strong> - See how systems actually work</span>
                                            </li>
                                            <li className="flex gap-3 text-sm">
                                                <CheckCircle size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                                                <span className="text-slate-300"><strong className="text-white">AI-Powered Roleplay</strong> - Practice radio calls with intelligent feedback</span>
                                            </li>
                                            <li className="flex gap-3 text-sm">
                                                <CheckCircle size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                                                <span className="text-slate-300"><strong className="text-white">Deep Understanding</strong> - Learn the "why", not just the "what"</span>
                                            </li>
                                            <li className="flex gap-3 text-sm">
                                                <CheckCircle size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                                                <span className="text-slate-300"><strong className="text-white">Affordable Pricing</strong> - Premium learning from €10/mo</span>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Question Bank Providers Column */}
                                    <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 bg-slate-700 rounded-lg">
                                                <HelpCircle className="w-6 h-6 text-slate-400" />
                                            </div>
                                            <h4 className="font-bold text-slate-400 text-lg">Question Banks</h4>
                                            <span className="ml-auto text-xs bg-slate-700 text-slate-400 px-2 py-1 rounded-full font-bold">Memorization</span>
                                        </div>
                                        <ul className="space-y-4">
                                            <li className="flex gap-3 text-sm">
                                                <X size={18} className="text-slate-500 shrink-0 mt-0.5" />
                                                <span className="text-slate-500">Static PDFs and text-heavy content</span>
                                            </li>
                                            <li className="flex gap-3 text-sm">
                                                <X size={18} className="text-slate-500 shrink-0 mt-0.5" />
                                                <span className="text-slate-300 text-sm font-medium">65+ Interactive Labs</span>
                                            </li>
                                            <li className="flex gap-3 text-sm">
                                                <X size={18} className="text-slate-500 shrink-0 mt-0.5" />
                                                <span className="text-slate-500">Memorize answers, forget concepts</span>
                                            </li>
                                            <li className="flex gap-3 text-sm">
                                                <X size={18} className="text-slate-500 shrink-0 mt-0.5" />
                                                <span className="text-slate-500">€200+ for full access</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="mt-8 text-center">
                                    <p className="text-slate-400 text-sm mb-4">💡 <strong className="text-white">Pro Tip:</strong> Use ATPLVector to understand the theory, then add any question bank for exam practice.</p>
                                    <button onClick={() => { scrollToSection('hero'); setView('SIGNUP'); }} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition shadow-lg shadow-blue-500/25">Start 7-Day Free Trial</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FOOTER */}
                    <footer className="py-20 bg-slate-950 border-t border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>
                        <div className="max-w-7xl mx-auto px-6 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                                <div className="col-span-1 md:col-span-2 space-y-6">
                                    <div className="flex items-center space-x-2">
                                        <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                                            <Plane className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="text-xl font-black text-white tracking-tighter">ATPL<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">VECTOR</span></span>
                                    </div>
                                    <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
                                        Advanced visual learning for the next generation of airline pilots. Built for excellence, designed for clarity.
                                    </p>
                                    <div className="flex items-center gap-4 pt-2">
                                        <div className="p-3 bg-white/5 rounded-xl border border-white/5 group hover:border-blue-500/50 transition-colors cursor-pointer">
                                            <Globe className="w-5 h-5 text-slate-500 group-hover:text-blue-400" />
                                        </div>
                                        <div className="p-3 bg-white/5 rounded-xl border border-white/5 group hover:border-blue-500/50 transition-colors cursor-pointer">
                                            <Shield className="w-5 h-5 text-slate-500 group-hover:text-blue-400" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-white font-bold text-sm uppercase tracking-widest">Platform</h4>
                                    <ul className="space-y-2 text-sm text-slate-500">
                                        <li><button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">Features</button></li>
                                        <li><button onClick={() => scrollToSection('pricing')} className="hover:text-white transition-colors">Pricing</button></li>
                                        <li><button onClick={() => setActiveInfoPage('CONTACT')} className="hover:text-white transition-colors">Contact Support</button></li>
                                    </ul>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-white font-bold text-sm uppercase tracking-widest">Legal</h4>
                                    <ul className="space-y-2 text-sm text-slate-500">
                                        <li><button onClick={() => setActiveInfoPage('TERMS')} className="hover:text-white transition-colors">Terms of Service</button></li>
                                        <li><button onClick={() => setActiveInfoPage('PRIVACY')} className="hover:text-white transition-colors">Privacy Policy</button></li>
                                    </ul>
                                </div>
                            </div>

                            <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                                <div className="text-xs text-slate-600">
                                    © {new Date().getFullYear()} ATPL Vector. All rights reserved. Built by Michael Mitry.
                                </div>

                                <div className="flex flex-col items-center md:items-end gap-2">
                                    <div className="flex items-center gap-2 text-xs text-slate-500 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                                        <Shield size={12} className="text-blue-400" />
                                        Question Bank powered by <span className="text-white font-bold">Chair-Flight</span> Open Source
                                    </div>
                                    <div className="text-[10px] text-slate-600">
                                        Explanations augmented by AI.
                                    </div>
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
