
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { Shield, Mail, CheckCircle, Lock, ArrowRight, Plane, Zap, Menu, X, User as UserIcon, HelpCircle, Eye, EyeOff, AlertTriangle, PlayCircle, Star, Globe, BarChart3, Radio, RefreshCw, KeyRound } from 'lucide-react';
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
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
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

    // Initialize CAPTCHA on mount
    useEffect(() => {
        generateMathQuestion();
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const data = await TestimonialService.getApprovedTestimonials();
            if (data.length > 0) {
                setTestimonials(data);
            }
        } catch (error) {
            console.error("Failed to fetch testimonials", error);
        }
    };

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
                    <nav className="fixed w-full z-50 p-2 md:px-4 md:py-4 animate-in slide-in-from-top-4 duration-700">
                        <div className="max-w-7xl mx-auto glass-panel rounded-xl md:rounded-2xl h-14 md:h-16 px-4 md:px-6 flex items-center justify-between bg-slate-900/80 backdrop-blur border border-white/10 shadow-2xl">
                            <div className="flex items-center space-x-2 cursor-pointer group" onClick={() => scrollToSection('hero')}>
                                <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <Plane className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-black text-white tracking-tighter">ATPL<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">VECTOR</span></span>
                            </div>

                            <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
                                <button onClick={() => scrollToSection('features')} className="hover:text-white transition hover:scale-105">Features</button>
                                <button onClick={() => scrollToSection('testimonials')} className="hover:text-white transition hover:scale-105">Testimonials</button>
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

                        {/* Background FX */}
                        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-blob pointer-events-none"></div>
                        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-blob animation-delay-2000 pointer-events-none"></div>

                        {/* Left: Value Prop */}
                        <div className="lg:w-1/2 flex flex-col justify-center px-8 lg:px-20 relative z-10 pt-10 lg:pt-0">
                            <div className="space-y-8 max-w-xl">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span> EASA 2026 Ready
                                </div>
                                <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
                                    Master <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">ATPL Theory</span><br />Visually.
                                </h1>
                                <p className="text-slate-400 text-lg lg:text-xl font-light animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                                    Interactive simulations, AI-driven roleplay, and immersive systems logic designed for modern pilots. Forget static PDFs.
                                </p>
                                <div className="flex gap-4 text-sm text-slate-500 font-mono animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
                                    <div className="flex items-center gap-2"><CheckCircle className="text-green-500 w-4 h-4" /> 14 Subjects</div>
                                    <div className="flex items-center gap-2"><CheckCircle className="text-green-500 w-4 h-4" /> 50+ Simulators</div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Auth Form */}
                        <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-20 relative z-10">
                            <div className="w-full max-w-md glass-card bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl relative overflow-hidden group shadow-2xl animate-in fade-in slide-in-from-right-8 duration-1000">
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

                    {/* FEATURES SECTION */}
                    <div id="features" className="py-24 bg-slate-900 relative">
                        <div className="max-w-7xl mx-auto px-6">
                            <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                <span className="text-indigo-400 font-bold uppercase tracking-widest text-sm">Features</span>
                                <h2 className="text-3xl md:text-5xl font-black text-white mt-2">More than just questions.</h2>
                                <p className="text-slate-400 mt-4 max-w-2xl mx-auto">We use interactive visualizers, AI agents, and 3D simulations to help you understand the physics, not just memorize the answers.</p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-blue-500 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/10 group">
                                    <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
                                        <Radio size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">AI ATC Roleplay</h3>
                                    <p className="text-slate-400">Practice your VFR and IFR radio calls with an intelligent AI controller that corrects your phraseology in real-time.</p>
                                </div>
                                <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-purple-500 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-500/10 group">
                                    <div className="w-12 h-12 bg-purple-900/30 rounded-lg flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
                                        <Eye size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">3D Visualizers</h3>
                                    <p className="text-slate-400">Don't just read about holding entries or light signals. See them on a 3D radar and interact with the cockpit view.</p>
                                </div>
                                <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-emerald-500 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-xl hover:shadow-emerald-500/10 group">
                                    <div className="w-12 h-12 bg-emerald-900/30 rounded-lg flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform">
                                        <BarChart3 size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">Smart Progress</h3>
                                    <p className="text-slate-400">Track your progress against specific EASA Learning Objectives (LOs). Focus on your weak areas automatically.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TESTIMONIALS SECTION */}
                    <div id="testimonials" className="py-24 bg-slate-950">
                        <div className="max-w-7xl mx-auto px-6">
                            <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                <span className="text-indigo-400 font-bold uppercase tracking-widest text-sm">Community</span>
                                <h2 className="text-3xl md:text-5xl font-black text-white mt-2">Pilots love the vector.</h2>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {testimonials.length > 0 ? (
                                    testimonials.map((t) => (
                                        <div key={t.id} className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:bg-slate-800 transition-all hover:scale-[1.02] duration-300">
                                            <div className="flex gap-1 text-yellow-500 mb-4 animate-in zoom-in delay-200 duration-500">
                                                {[...Array(t.rating)].map((_, i) => (
                                                    <Star key={i} fill="currentColor" size={16} />
                                                ))}
                                            </div>
                                            <p className="text-slate-300 mb-4">"{t.text}"</p>
                                            <div>
                                                <p className="font-bold text-white">{t.userName}</p>
                                                <p className="text-xs text-slate-500 uppercase">{t.userRole}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    /* Fallback to hardcoded if no DB testimonials yet */
                                    [
                                        { name: "Alex M.", role: "ATPL Student", text: "The holding pattern visualizer finally made sector entries click for me. Passed Ops with 95%." },
                                        { name: "Sarah K.", role: "PPL Holder", text: "I used the VFR comms simulator before my first solo cross-country. Gave me so much confidence on the radio." },
                                        { name: "Capt. James", role: "CFI", text: "I recommend this to all my students. The interactive diagrams explain systems better than any whiteboard drawing." }
                                    ].map((t, i) => (
                                        <div key={i} className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:bg-slate-800 transition-all hover:scale-[1.02] duration-300">
                                            <div className="flex gap-1 text-yellow-500 mb-4 animate-in zoom-in delay-200 duration-500">
                                                <Star fill="currentColor" size={16} />
                                                <Star fill="currentColor" size={16} />
                                                <Star fill="currentColor" size={16} />
                                                <Star fill="currentColor" size={16} />
                                                <Star fill="currentColor" size={16} />
                                            </div>
                                            <p className="text-slate-300 mb-4">"{t.text}"</p>
                                            <div>
                                                <p className="font-bold text-white">{t.name}</p>
                                                <p className="text-xs text-slate-500 uppercase">{t.role}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* PRICING SECTION */}
                    <div id="pricing" className="py-24 bg-slate-900">
                        <div className="max-w-7xl mx-auto px-6">
                            <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                <span className="text-indigo-400 font-bold uppercase tracking-widest text-sm">Pricing</span>
                                <h2 className="text-3xl md:text-5xl font-black text-white mt-2">Invest in your career.</h2>
                                <p className="text-slate-400 mt-4">Simple pricing. Cancel anytime.</p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                                {/* Custom */}
                                <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 flex flex-col hover:border-slate-500 transition-all hover:-translate-y-2 duration-300">
                                    <h3 className="font-bold text-white text-xl">Custom</h3>
                                    <p className="text-slate-400 text-sm mb-6">Pick only what you need.</p>
                                    <div className="mb-6">
                                        <span className="text-4xl font-black text-white">$19</span>
                                        <span className="text-slate-500"> / subject / mo</span>
                                    </div>
                                    <ul className="space-y-3 mb-8 flex-1">
                                        <li className="flex gap-2 text-slate-300 text-sm"><CheckCircle size={16} className="text-blue-500" /> Single Subject Access</li>
                                        <li className="flex gap-2 text-slate-300 text-sm"><CheckCircle size={16} className="text-blue-500" /> Specific Simulators</li>
                                        <li className="flex gap-2 text-slate-300 text-sm"><CheckCircle size={16} className="text-blue-500" /> Basic Support</li>
                                    </ul>
                                    <button onClick={() => { scrollToSection('hero'); setView('SIGNUP'); }} className="w-full py-3 rounded-xl border border-slate-600 text-white font-bold hover:bg-slate-700 transition">Select Subjects</button>
                                </div>

                                {/* Pro Monthly */}
                                <div className="bg-slate-800 p-8 rounded-2xl border-2 border-indigo-500 relative transform md:-translate-y-4 shadow-2xl flex flex-col hover:scale-105 transition-transform duration-300 z-10">
                                    <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider shadow-lg">Most Popular</div>
                                    <h3 className="font-bold text-white text-xl">Pro Monthly</h3>
                                    <p className="text-slate-400 text-sm mb-6">Total access for serious study.</p>
                                    <div className="mb-6">
                                        <span className="text-4xl font-black text-white">$29</span>
                                        <span className="text-slate-500"> / month</span>
                                    </div>
                                    <ul className="space-y-3 mb-8 flex-1">
                                        <li className="flex gap-2 text-white text-sm"><CheckCircle size={16} className="text-emerald-500" /> All 14 ATPL Subjects</li>
                                        <li className="flex gap-2 text-white text-sm"><CheckCircle size={16} className="text-emerald-500" /> All Simulators & Tools</li>
                                        <li className="flex gap-2 text-white text-sm"><CheckCircle size={16} className="text-emerald-500" /> Unlimited AI Roleplay</li>
                                        <li className="flex gap-2 text-white text-sm"><CheckCircle size={16} className="text-emerald-500" /> Priority Support</li>
                                    </ul>
                                    <button onClick={() => { scrollToSection('hero'); setView('SIGNUP'); }} className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/25">Start Free Trial</button>
                                </div>

                                {/* Pro Yearly */}
                                <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 flex flex-col hover:border-slate-500 transition-all hover:-translate-y-2 duration-300">
                                    <h3 className="font-bold text-white text-xl">Pro Yearly</h3>
                                    <p className="text-slate-400 text-sm mb-6">Commit to the long haul.</p>
                                    <div className="mb-6">
                                        <span className="text-4xl font-black text-white">$290</span>
                                        <span className="text-slate-500"> / year</span>
                                    </div>
                                    <ul className="space-y-3 mb-8 flex-1">
                                        <li className="flex gap-2 text-slate-300 text-sm"><CheckCircle size={16} className="text-purple-500" /> 2 Months Free</li>
                                        <li className="flex gap-2 text-slate-300 text-sm"><CheckCircle size={16} className="text-purple-500" /> All Pro Features</li>
                                        <li className="flex gap-2 text-slate-300 text-sm"><CheckCircle size={16} className="text-purple-500" /> Offline Mode (App)</li>
                                    </ul>
                                    <button onClick={() => { scrollToSection('hero'); setView('SIGNUP'); }} className="w-full py-3 rounded-xl border border-slate-600 text-white font-bold hover:bg-slate-700 transition">Get Yearly</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FOOTER */}
                    <footer className="bg-slate-950 py-12 border-t border-slate-800">
                        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
                            <div className="flex items-center gap-2 mb-4 md:mb-0 group cursor-pointer" onClick={() => scrollToSection('hero')}>
                                <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg group-hover:rotate-12 transition-transform duration-500">
                                    <Plane className="w-4 h-4 text-white" />
                                </div>
                                <span className="font-bold text-white tracking-tight">ATPL<span className="text-slate-400">VECTOR</span></span>
                            </div>
                            <div className="flex gap-8 text-sm text-slate-500">
                                <button onClick={() => setActiveInfoPage('TERMS')} className="hover:text-white transition">Terms</button>
                                <button onClick={() => setActiveInfoPage('PRIVACY')} className="hover:text-white transition">Privacy</button>
                                <button onClick={() => setActiveInfoPage('CONTACT')} className="hover:text-white transition">Contact</button>
                            </div>
                            <div className="text-xs text-slate-600 mt-4 md:mt-0 flex flex-col items-end">
                                <p>© 2026 ATPLVector. All rights reserved.</p>
                                <p className="mt-1 opacity-50">Platform created by <span className="font-bold text-slate-500">Michael Mitry</span></p>
                            </div>
                        </div>
                    </footer>
                </>
            )}

        </div>
    );
};

export default AuthView;
