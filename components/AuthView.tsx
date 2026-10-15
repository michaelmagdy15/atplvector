import React, { useState, useEffect } from 'react';
import { User } from '../types';
import {
  Shield,
  Mail,
  CheckCircle,
  Lock,
  ArrowRight,
  Plane,
  Zap,
  Menu,
  X,
  User as UserIcon,
  Eye,
  EyeOff,
  AlertTriangle,
  PlayCircle,
  Globe,
  BarChart3,
  KeyRound,
  Target,
  BookOpen,
  Layout,
  Dna,
  Rocket,
  Tablet,
  Download,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Laptop,
} from 'lucide-react';
import { useSignIn, useSignUp } from '@clerk/clerk-react';
import Terms from './Terms';
import Privacy from './Privacy';
import Refund from './Refund';
import Contact from './Contact';
import StudyGuide from './StudyGuide';
import {
  Accent,
  SectionShell,
  ThemeToggleButton,
} from './artcraft/SectionShell';
import { AvionicsSpiralCanvas } from './artcraft/AvionicsSpiralCanvas';
import { FlightDeckSplitViewport } from './artcraft/FlightDeckSplitViewport';
import { FlightLevelRuler } from './artcraft/FlightLevelRuler';

type AuthViewMode = 'LOGIN' | 'SIGNUP' | 'FORGOT_PASS' | 'RESET_PASSWORD';

const LazyImage = ({
  src,
  alt,
  className,
  fallback,
}: {
  src: string;
  alt: string;
  className?: string;
  fallback?: React.ReactNode;
}) => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkResolution = () => setIsDesktop(window.innerWidth >= 768);
    checkResolution();
    window.addEventListener('resize', checkResolution);
    return () => window.removeEventListener('resize', checkResolution);
  }, []);

  if (!isDesktop) return <div className={className}>{fallback}</div>;
  return <img src={src} alt={alt} className={className} loading="lazy" />;
};

const EASA_TICKER_ITEMS = [
  '010 · AIR LAW & ATC PROCEDURES',
  '021 · AIRFRAME, SYSTEMS & POWERPLANT',
  '022 · INSTRUMENTATION & AVIONICS',
  '031 · MASS & BALANCE',
  '032 · PERFORMANCE (CLASS A)',
  '033 · FLIGHT PLANNING & MONITORING',
  '040 · HUMAN PERFORMANCE & LIMITATIONS',
  '050 · METEOROLOGY',
  '061 · GENERAL NAVIGATION',
  '062 · RADIO NAVIGATION (ILS / RNAV)',
  '070 · OPERATIONAL PROCEDURES',
  '081 · PRINCIPLES OF FLIGHT',
  '090 · VFR & IFR COMMUNICATIONS',
  '100 · KSA (KNOWLEDGE, SKILLS & ATTITUDES)',
];

interface Props {
  onAuthChange: (user: User) => void;
  onDemoLogin?: () => void;
  initialView?: AuthViewMode;
}

const AuthView: React.FC<Props> = ({
  onAuthChange: _onAuthChange,
  onDemoLogin,
  initialView = 'LOGIN',
}) => {
  const [view, setView] = useState<AuthViewMode>(initialView);
  const [activeInfoPage, setActiveInfoPage] = useState<
    'TERMS' | 'PRIVACY' | 'REFUND' | 'CONTACT' | null
  >(null);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

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

  useEffect(() => {
    if (!password) {
      setPassStrength(0);
      return;
    }
    let score = 0;
    if (password.length >= 8) score++;
    if (password.match(/[0-9]/)) score++;
    if (password.match(/[A-Z]/)) score++;
    if (password.match(/[^a-zA-Z0-9]/)) score++;
    setPassStrength(score);
  }, [password]);

  const sendAdminNotification = async (subject: string, data: Record<string, unknown>) => {
    try {
      await fetch('https://formspree.io/f/mgovnoaw', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _subject: subject,
          ...data,
        }),
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
        setErrorMsg('Sign-in incomplete. Please verify your details.');
        setLoading(false);
      }
    } catch (error: any) {
      setLoading(false);
      setErrorMsg(error.message || 'Invalid email or password.');
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
        redirectUrlComplete: '/',
      });
    } catch (error: any) {
      setLoading(false);
      setErrorMsg(error.message || 'Google sign-in failed. Please try again.');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return setErrorMsg('Full Name is required.');
    if (!agreeToTerms)
      return setErrorMsg('You must agree to the Terms, Privacy, and Refund Policies to sign up.');
    if (password !== confirmPassword) return setErrorMsg('Passwords do not match.');
    if (passStrength < 3) return setErrorMsg('Password is too weak. Please use a stronger password.');

    if (!signUpLoaded) return;
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const initialStatus = 'FREE_TRIAL';

      sendAdminNotification(`New Signup Attempt (Clerk): ${email}`, {
        email: email,
        full_name: fullName,
        status: initialStatus,
        type: 'SIGNUP_ATTEMPT',
        timestamp: new Date().toISOString(),
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
      setSuccessMsg('Verification code sent to your email.');
    } catch (error: any) {
      setErrorMsg(error.message || 'Signup failed. Please try again.');
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
        setSuccessMsg('Email verified successfully! Logging you in...');
      } else {
        setErrorMsg('Verification failed. Please check the code.');
      }
    } catch (error: any) {
      setErrorMsg(error.message || 'Verification failed. Please check your code.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return setErrorMsg('Please enter your email.');
    if (!signInLoaded) return;
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      sendAdminNotification(`Reset Password Request: ${email}`, {
        email: email,
        type: 'PASSWORD_RESET_REQUEST',
        timestamp: new Date().toISOString(),
      });

      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      });
      setSuccessMsg('Password reset code sent to your email.');
      setView('RESET_PASSWORD');
      setVerificationCode('');
      setPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setErrorMsg(error.message || 'Failed to send reset code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return setErrorMsg('Passwords do not match.');
    if (passStrength < 3) return setErrorMsg('Password is too weak. Please use a stronger password.');
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
        setSuccessMsg('Password reset successfully! Logging you in...');
      } else {
        setErrorMsg('Password reset incomplete. Please verify the code and details.');
      }
    } catch (error: any) {
      setErrorMsg(error.message || 'Failed to reset password. Please check the code.');
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
      setSuccessMsg('A new verification code has been sent to your email.');
    } catch (error: any) {
      setErrorMsg(error.message || 'Failed to resend verification code.');
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
      setSuccessMsg('A new password reset code has been sent to your email.');
    } catch (error: any) {
      setErrorMsg(error.message || 'Failed to send reset code.');
    } finally {
      setResendLoading(false);
    }
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
      {activeInfoPage === 'REFUND' && <Refund onBack={() => setActiveInfoPage(null)} />}
      {activeInfoPage === 'CONTACT' && <Contact onBack={() => setActiveInfoPage(null)} />}

      {activeInfoPage === null && (
        <>
          {/* Right-Edge Interactive Altimeter / Flight Level Ruler Rail (ArtCraft HUD) */}
          <FlightLevelRuler />

          {/* Integrated ATPLVector Navbar with ArtCraft Precision CAD Framing */}
          <header className="sticky top-0 w-full z-50 bg-slate-950/85 backdrop-blur-md border-b border-line">
            <nav className="mx-auto max-w-[1280px] border-x border-line">
              <div className="px-4 md:px-10 h-16 flex items-center justify-between gap-4">
                {/* Official ATPLVector Logo & Gradient Brand Wordmark */}
                <div
                  className="flex items-center space-x-2.5 cursor-pointer group shrink-0"
                  onClick={() => scrollToSection('hero')}
                >
                  <div className="p-1.5 w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-white/[0.12] via-blue-500/[0.08] to-violet-500/[0.10] backdrop-blur-xl border border-cyan-200/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_8px_24px_rgba(37,99,235,0.18)] group-hover:border-cyan-200/35 group-hover:scale-110 transition-all duration-300 flex items-center justify-center overflow-hidden">
                    <img
                      src="/brand-mark.png"
                      alt="ATPLVector Logo"
                      className="w-full h-full object-contain object-center"
                    />
                  </div>
                  <span className="text-xl md:text-2xl font-black text-white tracking-tighter">
                    ATPL
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400">
                      VECTOR
                    </span>
                  </span>
                  <span className="hidden sm:inline-block hud-label border border-blue-500/30 bg-blue-500/10 text-blue-300 px-2 py-0.5 text-[9px]">
                    ECQB-2026
                  </span>
                </div>

                {/* Desktop Navigation Links */}
                <div className="hidden lg:flex items-center space-x-1 text-xs font-mono uppercase tracking-wider text-slate-300 shrink-0">
                  <button
                    onClick={() => scrollToSection('flight-plan')}
                    className="invert-block px-3 py-1.5 hover:text-white transition whitespace-nowrap cursor-pointer"
                  >
                    01 / Flight Plan
                  </button>
                  <button
                    onClick={() => scrollToSection('capabilities')}
                    className="invert-block px-3 py-1.5 hover:text-white transition whitespace-nowrap cursor-pointer"
                  >
                    02 / Features
                  </button>
                  <button
                    onClick={() => scrollToSection('viewport-3d')}
                    className="invert-block px-3 py-1.5 hover:text-white transition whitespace-nowrap cursor-pointer"
                  >
                    03 / 3D Viewport
                  </button>
                  <button
                    onClick={() => scrollToSection('live-demo')}
                    className="invert-block px-3 py-1.5 hover:text-white transition whitespace-nowrap cursor-pointer"
                  >
                    04 / Live Lab
                  </button>
                  <button
                    onClick={() => scrollToSection('pricing')}
                    className="invert-block px-3 py-1.5 hover:text-white transition whitespace-nowrap cursor-pointer"
                  >
                    05 / Pricing
                  </button>
                </div>

                {/* Right Desktop CTAs */}
                <div className="hidden lg:flex items-center gap-2.5 shrink-0">
                  <ThemeToggleButton />
                  <button
                    onClick={() => {
                      scrollToSection('hero');
                      setView('LOGIN');
                    }}
                    className="px-3.5 py-2 text-xs font-bold text-white hover:text-blue-300 border border-white/10 hover:border-blue-500/40 transition whitespace-nowrap cursor-pointer"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      scrollToSection('hero');
                      setView('SIGNUP');
                    }}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition shadow-lg shadow-blue-500/20 active:scale-95 whitespace-nowrap cursor-pointer"
                  >
                    Get Started
                  </button>
                </div>

                {/* Mobile Menu Controls */}
                <div className="lg:hidden flex items-center gap-3">
                  <button
                    onClick={() => {
                      scrollToSection('hero');
                      setView('LOGIN');
                    }}
                    className="text-xs font-bold text-slate-300"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="text-white p-2 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                  </button>
                </div>
              </div>
            </nav>

            {/* Mobile Menu Drawer */}
            {mobileMenuOpen && (
              <div className="absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 p-4 flex flex-col space-y-2 lg:hidden z-50 shadow-2xl">
                <button
                  type="button"
                  onClick={() => scrollToSection('flight-plan')}
                  className="text-left px-6 py-3.5 text-slate-200 font-medium hover:bg-white/10 rounded-xl transition-all"
                >
                  01 / Flight Plan
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('capabilities')}
                  className="text-left px-6 py-3.5 text-slate-200 font-medium hover:bg-white/10 rounded-xl transition-all"
                >
                  02 / Features &amp; EgyptAir Portal
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('viewport-3d')}
                  className="text-left px-6 py-3.5 text-slate-200 font-medium hover:bg-white/10 rounded-xl transition-all"
                >
                  03 / 3D Split Viewport
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('pricing')}
                  className="text-left px-6 py-3.5 text-slate-200 font-medium hover:bg-white/10 rounded-xl transition-all"
                >
                  05 / Pricing
                </button>
                <button
                  type="button"
                  onClick={() => {
                    scrollToSection('hero');
                    setView('LOGIN');
                  }}
                  className="text-left px-6 py-3.5 text-white font-bold bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-xl transition-all"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    scrollToSection('hero');
                    setView('SIGNUP');
                  }}
                  className="text-left px-6 py-3.5 text-white font-bold bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-blue-500/20"
                >
                  Get Started
                </button>
              </div>
            )}
          </header>

          {/* =====================================================================
              HERO SECTION: ATPLVector Value Prop + Clerk Auth Card + ArtCraft 6-Arm Logarithmic Spiral Radar
          ====================================================================== */}
          <div
            id="hero"
            className="relative min-h-[calc(100vh-4rem)] border-b border-line overflow-hidden flex items-center"
          >
            {/* Interactive ArtCraft 6-Arm Logarithmic Spiral Telemetry Canvas in ATPLVector Blue/Indigo */}
            <AvionicsSpiralCanvas />

            {/* Ambient Aviation Blue / Violet Glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[90px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[90px] pointer-events-none" />

            <div className="mx-auto w-full max-w-[1280px] border-x border-line px-6 md:px-10 py-12 lg:py-16 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
              {/* Left Column: ATPLVector Brand Value Prop + Radial Scrim */}
              <div className="lg:w-1/2 flex flex-col justify-center relative">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-8 -z-10"
                  style={{
                    background:
                      'radial-gradient(closest-side, rgba(6, 11, 22, 0.86) 45%, rgba(6, 11, 22, 0.45) 78%, transparent 100%)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    maskImage: 'radial-gradient(closest-side, #000 58%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(closest-side, #000 58%, transparent 100%)',
                  }}
                />

                <div className="space-y-7 max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-inner">
                    <Tablet className="w-4 h-4 text-blue-400 animate-pulse" />
                    <span>Web Registration • Native iPad Flight Deck</span>
                  </div>

                  {/* Brand Emblem + Headline */}
                  <div className="flex items-center gap-3.5">
                    <div className="p-2 w-12 h-12 md:w-14 md:h-14 bg-slate-900/90 rounded-xl shadow-[0_0_25px_rgba(59,130,246,0.3)] border border-blue-500/30 flex items-center justify-center overflow-hidden shrink-0">
                      <img
                        src="/logo.png"
                        alt="ATPLVector Logo"
                        className="w-full h-full object-contain scale-[3.8] object-center"
                      />
                    </div>
                    <div className="hud-label text-blue-400">
                      INTERACTIVE TELEMETRY RADAR ACTIVE
                      <div className="text-xl md:text-2xl font-black text-white tracking-tighter font-sans mt-0.5">
                        ATPL
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                          VECTOR
                        </span>
                      </div>
                    </div>
                  </div>

                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] text-white">
                    Master <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 drop-shadow-lg">
                      ATPL Theory
                    </span>
                    <br />
                    On Your <Accent className="text-blue-300">Flight Deck.</Accent>
                  </h1>

                  <p className="text-slate-300 text-base sm:text-lg font-light leading-relaxed">
                    Create your aviator account here on the web to unlock instant access inside our dedicated native iPad &amp; iOS application with offline study vaults and 65+ 3D cockpit visualizers.
                  </p>

                  <div className="flex flex-wrap gap-2.5 text-xs font-mono text-slate-300">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 border border-line">
                      <CheckCircle2 className="text-emerald-400 w-4 h-4" /> 14 ATPL Subjects
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 border border-line">
                      <Tablet className="text-blue-400 w-4 h-4" /> Native iPad &amp; iOS
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 border border-line">
                      <Lock className="text-indigo-400 w-4 h-4" /> Encrypted Offline Vault
                    </div>
                  </div>

                  {/* Native iPad Download Banner */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/60 via-indigo-950/40 to-slate-900/80 border border-blue-500/30 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
                        <Tablet size={22} />
                      </div>
                      <div>
                        <div className="text-[10px] text-blue-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          Flight Deck App Ready
                        </div>
                        <div className="text-white font-bold text-sm">Download on iPad &amp; iOS</div>
                        <div className="text-[11px] text-slate-400">
                          Register on web &bull; Fly on the iPad App
                        </div>
                      </div>
                    </div>
                    <a
                      href="https://testflight.apple.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 whitespace-nowrap"
                    >
                      <Download size={14} />
                      <span>Install on iPad</span>
                      <ExternalLink size={12} className="opacity-70" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column: Aviator Auth Form Card */}
              <div className="lg:w-1/2 w-full flex items-center justify-center relative">
                <div className="w-full max-w-md bg-slate-900/88 backdrop-blur-2xl border border-blue-500/25 p-8 rounded-2xl relative shadow-[0_25px_70px_rgba(0,0,0,0.65)]">
                  {/* Corner CAD Crosshair Ticks */}
                  <span className="tick tick-half absolute -top-[5px] -left-[6px] z-20 pointer-events-none" />
                  <span className="tick tick-half absolute -top-[5px] -right-[5px] z-20 pointer-events-none" />

                  <div className="relative z-10">
                    <div className="mb-6">
                      <div className="hud-label text-blue-400 mb-1.5">
                        {verifying
                          ? 'STEP 02 // EMAIL VERIFICATION'
                          : view === 'LOGIN'
                          ? 'FLIGHT DECK ACCESS // SIGN IN'
                          : view === 'SIGNUP'
                          ? 'NEW PILOT DISPATCH // REGISTER'
                          : 'CREDENTIAL RECOVERY'}
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-1.5">
                        {verifying
                          ? 'Verify Your Email'
                          : view === 'LOGIN'
                          ? 'Aviator Sign In'
                          : view === 'SIGNUP'
                          ? 'Create Pilot Account'
                          : 'Reset Password'}
                      </h2>
                      <p className="text-slate-400 text-xs sm:text-sm">
                        {verifying
                          ? `We've sent a verification code to ${email}.`
                          : view === 'LOGIN'
                          ? 'Sign in to manage your training track or launch flight deck.'
                          : view === 'SIGNUP'
                          ? 'Register on web to unlock your iPad & mobile app access.'
                          : "We'll email you a secure reset link."}
                      </p>
                    </div>

                    {errorMsg && (
                      <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/25 rounded-xl text-red-200 text-xs font-medium flex items-start gap-2.5">
                        <AlertTriangle size={16} className="mt-0.5 text-red-400 shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    {successMsg && (
                      <div className="mb-5 p-3.5 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-emerald-200 text-xs font-medium flex items-start gap-2.5">
                        <CheckCircle size={16} className="mt-0.5 text-emerald-400 shrink-0" />
                        <span>{successMsg}</span>
                      </div>
                    )}

                    {verifying ? (
                      <form onSubmit={handleVerifyEmail} className="space-y-5">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">
                            Verification Code
                          </label>
                          <div className="relative">
                            <KeyRound className="absolute left-4 top-3.5 text-slate-500 w-5 h-5" />
                            <input
                              required
                              type="text"
                              value={verificationCode}
                              onChange={(e) => setVerificationCode(e.target.value)}
                              className="w-full bg-slate-950/70 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-blue-500 outline-none transition-all placeholder-slate-600 text-center font-mono text-lg tracking-[0.3em]"
                              placeholder="000000"
                              maxLength={6}
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white py-3.5 rounded-xl font-bold transition-all flex items-center justify-center shadow-lg cursor-pointer"
                        >
                          {loading ? <Zap className="animate-spin w-5 h-5" /> : 'Verify & Activate'}
                          {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
                        </button>

                        <div className="text-center mt-4 space-y-2">
                          <button
                            type="button"
                            disabled={resendLoading}
                            onClick={handleResendCode}
                            className="text-xs text-blue-400 hover:text-blue-300 block w-full transition-colors font-semibold disabled:opacity-50"
                          >
                            {resendLoading ? 'Resending...' : "Didn't get the code? Resend Code"}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setVerifying(false);
                              setErrorMsg('');
                              setSuccessMsg('');
                            }}
                            className="text-xs text-slate-400 hover:text-white block w-full transition-colors"
                          >
                            Back to Sign Up
                          </button>
                        </div>
                      </form>
                    ) : (
                      <form
                        onSubmit={
                          view === 'LOGIN'
                            ? handleLogin
                            : view === 'SIGNUP'
                            ? handleSignup
                            : view === 'FORGOT_PASS'
                            ? handleForgotPassword
                            : handleResetPassword
                        }
                        className="space-y-4"
                      >
                        {(view === 'LOGIN' || view === 'SIGNUP') && (
                          <div className="pb-4 border-b border-white/10">
                            <button
                              type="button"
                              onClick={handleGoogleSignIn}
                              disabled={loading}
                              className="w-full bg-white hover:bg-gray-100 disabled:opacity-50 text-gray-900 py-3 rounded-xl font-bold transition-all flex items-center justify-center shadow-lg border border-gray-200 cursor-pointer"
                            >
                              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                <path
                                  fill="currentColor"
                                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                  fill="currentColor"
                                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                  fill="currentColor"
                                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                  fill="currentColor"
                                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                              </svg>
                              {loading
                                ? view === 'SIGNUP'
                                  ? 'Creating account...'
                                  : 'Signing in...'
                                : view === 'SIGNUP'
                                ? 'Sign up with Google'
                                : 'Sign in with Google'}
                            </button>
                            <div className="mt-3 text-center">
                              <p className="text-[10px] text-slate-400 uppercase tracking-widest">
                                Or use email
                              </p>
                            </div>
                          </div>
                        )}

                        {view === 'SIGNUP' && (
                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1">
                              Full Name
                            </label>
                            <div className="relative">
                              <UserIcon className="absolute left-4 top-3.5 text-slate-500 w-4 h-4" />
                              <input
                                required
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full bg-slate-950/60 border border-slate-700 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white focus:border-blue-500 outline-none transition-all placeholder-slate-600"
                                placeholder="Captain Name"
                              />
                            </div>
                          </div>
                        )}

                        {view !== 'RESET_PASSWORD' && (
                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1">
                              Email Address
                            </label>
                            <div className="relative">
                              <Mail className="absolute left-4 top-3.5 text-slate-500 w-4 h-4" />
                              <input
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-950/60 border border-slate-700 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white focus:border-blue-500 outline-none transition-all placeholder-slate-600"
                                placeholder="pilot@example.com"
                              />
                            </div>
                          </div>
                        )}

                        {view === 'RESET_PASSWORD' && (
                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1">
                              Reset Code
                            </label>
                            <div className="relative">
                              <KeyRound className="absolute left-4 top-3.5 text-slate-500 w-4 h-4" />
                              <input
                                required
                                type="text"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value.trim())}
                                className="w-full bg-slate-950/60 border border-slate-700 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white focus:border-blue-500 outline-none transition-all placeholder-slate-600 font-mono text-center tracking-[0.2em]"
                                placeholder="000000"
                              />
                            </div>
                          </div>
                        )}

                        {view !== 'FORGOT_PASS' && (
                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1">
                              {view === 'RESET_PASSWORD' ? 'New Password' : 'Password'}
                            </label>
                            <div className="relative">
                              <Lock className="absolute left-4 top-3.5 text-slate-500 w-4 h-4" />
                              <input
                                required
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-950/60 border border-slate-700 rounded-xl py-2.5 pl-11 pr-10 text-sm text-white focus:border-blue-500 outline-none transition-all placeholder-slate-600"
                                placeholder="••••••••"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2.5 top-2 p-1.5 text-slate-500 hover:text-white transition-colors"
                              >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                            {(view === 'SIGNUP' || view === 'RESET_PASSWORD') && password && (
                              <div className="mt-2 flex items-center gap-2">
                                <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full transition-all duration-500 ${
                                      passStrength <= 2
                                        ? 'bg-red-500'
                                        : passStrength === 3
                                        ? 'bg-yellow-500'
                                        : 'bg-green-500'
                                    }`}
                                    style={{ width: `${(passStrength / 4) * 100}%` }}
                                  />
                                </div>
                                <span className="text-[10px] font-bold text-slate-400">
                                  {passStrength <= 2 ? 'Weak' : passStrength === 3 ? 'Good' : 'Strong'}
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        {(view === 'SIGNUP' || view === 'RESET_PASSWORD') && (
                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1">
                              {view === 'RESET_PASSWORD'
                                ? 'Confirm New Password'
                                : 'Confirm Password'}
                            </label>
                            <div className="relative">
                              <Lock className="absolute left-4 top-3.5 text-slate-500 w-4 h-4" />
                              <input
                                required
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-slate-950/60 border border-slate-700 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white focus:border-blue-500 outline-none transition-all placeholder-slate-600"
                                placeholder="••••••••"
                              />
                            </div>
                          </div>
                        )}

                        {view === 'SIGNUP' && (
                          <div className="flex items-start gap-3 pt-1">
                            <input
                              required
                              type="checkbox"
                              id="agreeToTerms"
                              checked={agreeToTerms}
                              onChange={(e) => setAgreeToTerms(e.target.checked)}
                              className="mt-1 w-4 h-4 bg-slate-900 border border-slate-700 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                            <label
                              htmlFor="agreeToTerms"
                              className="text-xs text-slate-400 select-none leading-relaxed cursor-pointer"
                            >
                              I agree to the{' '}
                              <button
                                type="button"
                                onClick={() => setActiveInfoPage('TERMS')}
                                className="text-blue-400 hover:text-blue-300 font-semibold underline inline"
                              >
                                Terms of Service
                              </button>
                              ,{' '}
                              <button
                                type="button"
                                onClick={() => setActiveInfoPage('PRIVACY')}
                                className="text-blue-400 hover:text-blue-300 font-semibold underline inline"
                              >
                                Privacy Policy
                              </button>
                              , and acknowledge the{' '}
                              <button
                                type="button"
                                onClick={() => setActiveInfoPage('REFUND')}
                                className="text-blue-400 hover:text-blue-300 font-semibold underline inline"
                              >
                                Refund Policy
                              </button>
                              .
                            </label>
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white py-3.5 rounded-xl font-bold transition-all flex items-center justify-center shadow-lg hover:shadow-blue-500/25 cursor-pointer"
                        >
                          {loading ? (
                            <Zap className="animate-spin w-5 h-5" />
                          ) : view === 'LOGIN' ? (
                            'Sign In'
                          ) : view === 'SIGNUP' ? (
                            'Create Account'
                          ) : view === 'FORGOT_PASS' ? (
                            'Send Reset Link'
                          ) : (
                            'Reset Password'
                          )}
                          {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
                        </button>

                        <div className="text-center space-y-2 pt-2">
                          {view === 'LOGIN' && (
                            <>
                              <button
                                type="button"
                                onClick={() => setView('FORGOT_PASS')}
                                className="text-xs text-slate-400 hover:text-white block w-full transition-colors cursor-pointer"
                              >
                                Forgot Password?
                              </button>
                              <button
                                type="button"
                                onClick={() => setView('SIGNUP')}
                                className="text-xs text-slate-400 hover:text-white block w-full transition-colors cursor-pointer"
                              >
                                Don't have an account?{' '}
                                <strong className="text-blue-400">Sign Up</strong>
                              </button>
                            </>
                          )}
                          {view === 'SIGNUP' && (
                            <button
                              type="button"
                              onClick={() => setView('LOGIN')}
                              className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                            >
                              Already have an account?{' '}
                              <strong className="text-blue-400">Log In</strong>
                            </button>
                          )}
                          {view === 'RESET_PASSWORD' && (
                            <button
                              type="button"
                              disabled={resendLoading}
                              onClick={handleResendResetCode}
                              className="text-xs text-blue-400 hover:text-blue-300 block w-full transition-colors font-semibold disabled:opacity-50"
                            >
                              {resendLoading ? 'Resending...' : "Didn't get the code? Resend Code"}
                            </button>
                          )}
                          {(view === 'FORGOT_PASS' || view === 'RESET_PASSWORD') && (
                            <button
                              type="button"
                              onClick={() => setView('LOGIN')}
                              className="text-xs text-slate-400 hover:text-white block w-full transition-colors"
                            >
                              Back to Login
                            </button>
                          )}
                        </div>

                        {view === 'LOGIN' && onDemoLogin && (
                          <div className="pt-3 border-t border-white/10">
                            <button
                              type="button"
                              onClick={onDemoLogin}
                              className="w-full bg-white/5 hover:bg-white/10 text-slate-300 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center border border-white/10 hover:border-emerald-500/50 hover:text-emerald-400 group cursor-pointer text-sm"
                            >
                              <PlayCircle className="mr-2 w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />{' '}
                              Demo Access
                            </button>
                          </div>
                        )}
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================================
              INFINITE EASA SUBJECT TELEMETRY MARQUEE
          ====================================================================== */}
          <div className="border-b border-line bg-slate-950 py-2.5 marquee">
            <div className="marquee-track flex items-center gap-10 whitespace-nowrap">
              {[...EASA_TICKER_ITEMS, ...EASA_TICKER_ITEMS].map((item, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-slate-400"
                >
                  <span className="h-1.5 w-1.5 bg-blue-500 inline-block" />
                  <span>{item}</span>
                </span>
              ))}
            </div>
          </div>

          {/* =====================================================================
              01 / SIMPLE 3-STEP FLIGHT PLAN (CAD SECTION SHELL)
          ====================================================================== */}
          <SectionShell
            id="flight-plan"
            eyebrow={{
              index: '01',
              label: 'SIMPLE 3-STEP FLIGHT PLAN // HOW ATPL VECTOR WORKS',
              right: 'WEB REGISTRATION → NATIVE IPAD FLIGHT DECK',
            }}
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-3">
                  <Sparkles size={12} /> Simple 3-Step Flight Plan
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                  How ATPL <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Vector</span> Works
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md">
                Register your profile on the web &bull; Train and study on our dedicated iPad and iOS application with full offline capability.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line border border-line">
              <div className="p-8 bg-slate-950/90 relative overflow-hidden group hover:bg-slate-900/90 transition-all duration-300">
                <div className="flex items-center justify-between mb-5">
                  <span className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-bold flex items-center justify-center">
                    01
                  </span>
                  <Laptop className="w-5 h-5 text-slate-500 group-hover:text-blue-400 transition-colors" />
                </div>
                <h3 className="font-bold text-white text-lg mb-2">Sign Up on Web</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Create your aviator account here on the web browser, choose your syllabus track (EASA / UK / PPL / ATPL), and manage your subscriptions.
                </p>
              </div>

              <div className="p-8 bg-slate-950/90 relative overflow-hidden group hover:bg-slate-900/90 transition-all duration-300">
                <div className="flex items-center justify-between mb-5">
                  <span className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-bold flex items-center justify-center">
                    02
                  </span>
                  <Tablet className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                </div>
                <h3 className="font-bold text-white text-lg mb-2">Install on iPad &amp; iOS</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Install our high-performance native app via TestFlight or App Store to unlock GPU-accelerated 3D cockpits, split-screen mode, and Apple Pencil support.
                </p>
              </div>

              <div className="p-8 bg-slate-950/90 relative overflow-hidden group hover:bg-slate-900/90 transition-all duration-300">
                <div className="flex items-center justify-between mb-5">
                  <span className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold flex items-center justify-center">
                    03
                  </span>
                  <Plane className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                </div>
                <h3 className="font-bold text-white text-lg mb-2">Fly Through Theory</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Sign in with your web credentials to study all 14 subjects offline at FL390, practice exam questions, and master interactive aerodynamic labs.
                </p>
              </div>
            </div>
          </SectionShell>

          {/* =====================================================================
              02 / COMPLETE PILOT SUITE (BENTO GRID + EGYPTAIR & PPL LAUNCH)
          ====================================================================== */}
          <SectionShell
            id="capabilities"
            eyebrow={{
              index: '02',
              label: 'COMPLETE PILOT SUITE // VISUAL STUDY STACK',
              right: 'EASA ATPL · PPL · EGYPTAIR CADET PORTAL',
            }}
          >
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                <Rocket size={12} /> Complete Pilot Suite
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mt-2 tracking-tight">
                The ultimate{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                  visual
                </span>{' '}
                study stack.
              </h2>
              <p className="text-slate-400 mt-4 max-w-2xl mx-auto text-base md:text-lg">
                We've combined deep interactive theory with a professional-grade question bank and strategic analytics to give you the highest possible chance of passing first time.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-line border border-line">
              {/* Card 1: Interactive Theory */}
              <div className="lg:col-span-7 bg-slate-950/95 p-8 lg:p-10 flex flex-col justify-between relative group overflow-hidden">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20">
                    <Layout size={24} />
                  </div>
                  <h3 className="text-3xl font-black text-white">Interactive Theory</h3>
                  <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-md">
                    Every subject is an interactive lab. Manipulate controls, simulate physics, and visualize systems in real-time.
                  </p>
                </div>
                <div className="mt-8 relative rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                  <LazyImage
                    src={`${import.meta.env.BASE_URL}assets/walkthroughs/planner_demo.webp`}
                    alt="Interactive Simulator"
                    className="w-full h-64 object-cover"
                    fallback={
                      <div className="w-full h-64 bg-gradient-to-br from-blue-600/40 to-indigo-900/40 flex items-center justify-center">
                        <Plane size={64} className="text-blue-400/20" />
                      </div>
                    }
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex gap-3">
                    <div className="px-3 py-1.5 bg-black/70 backdrop-blur rounded-lg text-xs font-bold text-white border border-white/10 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Live Simulation
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Exam Readiness */}
              <div className="lg:col-span-5 bg-slate-950/95 p-8 lg:p-10 flex flex-col justify-between relative group overflow-hidden">
                <div>
                  <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 border border-purple-500/20 mb-6">
                    <BarChart3 size={24} />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-4">Exam Readiness</h3>
                  <p className="text-slate-400 mb-8">
                    We measure 94% accuracy and 45s pacing before we recommend sitting the exam.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="p-5 bg-slate-900/80 border border-line flex items-center justify-between">
                    <div>
                      <div className="text-purple-400 font-black text-3xl">94%</div>
                      <div className="text-[10px] text-slate-400 uppercase font-mono tracking-widest mt-1">
                        Accuracy Goal
                      </div>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                      <Target size={20} />
                    </div>
                  </div>
                  <div className="p-5 bg-slate-900/80 border border-line flex items-center justify-between">
                    <div>
                      <div className="text-emerald-400 font-black text-3xl">45s</div>
                      <div className="text-[10px] text-slate-400 uppercase font-mono tracking-widest mt-1">
                        Avg Pacing
                      </div>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Zap size={20} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Modern Question Bank */}
              <div className="lg:col-span-12 bg-slate-950/95 p-8 lg:p-10 flex flex-col lg:flex-row items-center gap-10">
                <div className="lg:w-1/2 space-y-5">
                  <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                    <BookOpen size={24} />
                  </div>
                  <h3 className="text-3xl font-black text-white">Modern Question Bank</h3>
                  <p className="text-slate-400 text-base md:text-lg leading-relaxed">
                    Built on <strong className="text-white">Chair-Flight</strong> open source data. Includes Smart Retest workflows, Error Attribution, and AI-driven explanations.
                  </p>
                  <div className="bg-gradient-to-r from-indigo-600/20 to-blue-600/20 border border-indigo-500/30 p-4 rounded-xl">
                    <p className="text-indigo-200 text-xs font-black uppercase tracking-widest text-center">
                      Try now the Chairflight Question Bank on our platform enhanced for free!
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase">
                      ECQB 2026
                    </span>
                    <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase">
                      15,000+ Questions
                    </span>
                    <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase">
                      AI Explanation Support
                    </span>
                  </div>
                </div>

                <div className="lg:w-1/2 w-full">
                  <div className="w-full aspect-video bg-slate-900/90 rounded-2xl border border-white/10 overflow-hidden relative p-6 flex flex-col gap-4">
                    <div className="w-full h-8 bg-white/5 rounded-lg flex items-center px-4 gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/50" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                      <div className="w-3 h-3 rounded-full bg-green-500/50" />
                      <span className="ml-2 font-mono text-[10px] text-slate-400 uppercase tracking-widest">
                        ECQB-2026 // AI EXPLANATION ENGINE
                      </span>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <div className="bg-white/5 rounded-lg p-4 border border-white/5 flex flex-col justify-between">
                        <span className="hud-label text-blue-400">081 · POF</span>
                        <span className="text-xs text-slate-300 font-medium">
                          Induced Drag &amp; Ground Effect Vector Analysis
                        </span>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 border border-white/5 flex flex-col justify-between">
                        <span className="hud-label text-emerald-400">98.4% MATCH</span>
                        <span className="text-xs text-slate-300 font-medium">
                          Verified EASA Learning Objective Mapping
                        </span>
                      </div>
                      <div className="col-span-2 bg-indigo-500/10 rounded-lg border border-indigo-500/25 p-4">
                        <div className="hud-label text-indigo-300 mb-1">AI FLIGHT INSTRUCTOR</div>
                        <div className="text-xs text-slate-300">
                          Step-by-step aerodynamic &amp; ICAO regulatory breakdown generated instantaneously.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4: ATPL & PPL Ground School + EgyptAir Cadet Portal */}
              <div className="lg:col-span-12 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 p-8 lg:p-12 flex flex-col md:flex-row items-center gap-10">
                <div className="flex-1 space-y-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse">
                      Just Launched Today!
                    </span>
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em] bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Dual ATPL &amp; PPL Support
                    </span>
                  </div>

                  <h3 className="text-3xl lg:text-5xl font-black text-white leading-tight">
                    Expanding the Skies:
                    <br />
                    ATPL &amp;{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                      PPL Ground School
                    </span>
                  </h3>

                  <p className="text-slate-300 text-base md:text-lg leading-relaxed">
                    We are thrilled to announce that ATPLVector is officially live! In addition to our flagship EASA ATPL visual curriculum, we have launched full comprehensive support for{' '}
                    <strong className="text-cyan-400">PPL (Private Pilot) students</strong>. Master Air Law, Meteorology, Navigation, and Principles of Flight with our legendary simulator-driven ground school.
                  </p>

                  <div className="p-6 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="space-y-1">
                      <div className="text-xs text-cyan-400 font-bold uppercase tracking-widest">
                        Special EgyptAir Cadets Update
                      </div>
                      <h4 className="text-white font-bold text-lg">
                        ABC 4th Edition Ground School Preparation
                      </h4>
                      <p className="text-slate-400 text-sm">
                        Access exclusive simulators, regulations quizzes, fuel planners, and CRM scenario builders tuned to EgyptAir cadet requirements.
                      </p>
                    </div>
                    <button
                      onClick={() => scrollToSection('hero')}
                      className="shrink-0 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/20 active:scale-95 text-xs border border-cyan-500/30 cursor-pointer"
                    >
                      Start Training Now
                    </button>
                  </div>
                </div>

                <div className="md:w-1/3 w-full flex items-center justify-center relative">
                  <div className="w-56 h-56 rounded-full bg-slate-900/80 border border-cyan-500/30 flex items-center justify-center relative shadow-inner overflow-hidden p-8">
                    <div className="absolute -inset-4 bg-cyan-500/10 rounded-full blur-xl animate-pulse" />
                    <img
                      src="/assets/egyptair_logo.png"
                      alt="EgyptAir Logo"
                      className="w-full h-full object-contain filter brightness-0 invert drop-shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </SectionShell>

          {/* =====================================================================
              03 / INTERACTIVE 3D WIREFRAME VS. GLASS COCKPIT SPLIT VIEWPORT + 3D STACK
          ====================================================================== */}
          <SectionShell
            id="viewport-3d"
            eyebrow={{
              index: '03',
              label: 'THE VECTOR EXPERIENCE // 3D WIREFRAME VS. LIVE GLASS COCKPIT',
              right: 'SCRUB POINTER ACROSS VIEWPORT',
            }}
          >
            <div className="text-center mb-14">
              <span className="text-blue-400 font-bold uppercase tracking-[0.3em] text-[10px] mb-3 block">
                The Vector Experience
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter mb-4">
                Designed for{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 italic">
                  Immersion.
                </span>
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg">
                Move your cursor across the live split viewport below to compare our 3D aerodynamic vector solver on the left with the glass-cockpit EASA simulator on the right.
              </p>
            </div>

            {/* ArtCraft Pointer-Scrubbable 3D Split Viewport */}
            <FlightDeckSplitViewport onLaunchDemo={onDemoLogin} />

            {/* Feature Tickers */}
            <div className="mt-10 py-6 bg-slate-900/50 border border-line">
              <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 text-slate-400 font-black text-[10px] uppercase tracking-[0.35em]">
                <span className="flex items-center gap-2 hover:text-white transition-colors">
                  <Dna size={14} className="text-blue-500" /> Neural Explanations
                </span>
                <span className="flex items-center gap-2 hover:text-white transition-colors">
                  <Rocket size={14} className="text-indigo-500" /> Hyper-Fast UI
                </span>
                <span className="flex items-center gap-2 hover:text-white transition-colors">
                  <Target size={14} className="text-emerald-500" /> Pattern AI
                </span>
                <span className="flex items-center gap-2 hover:text-white transition-colors">
                  <Layout size={14} className="text-purple-500" /> 3D Viewports
                </span>
              </div>
            </div>
          </SectionShell>

          {/* =====================================================================
              04 / LIVE STUDY GUIDE ANALYZER DEMO
          ====================================================================== */}
          <SectionShell
            id="live-demo"
            eyebrow={{
              index: '04',
              label: 'LIVE DEMO // TRY THE STUDY ROI ANALYZER REAL-TIME',
              right: 'INTERACTIVE · NO LOGIN REQUIRED',
            }}
          >
            <div className="text-center mb-12">
              <span className="text-blue-400 font-bold uppercase tracking-widest text-sm">
                Live Demo
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white mt-2">
                Try the Analyzer Real-Time.
              </h2>
              <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
                Interact with our actual Study Guide tool below. See which subjects have the highest "Return on Investment" for your study time. No login required.
              </p>
            </div>

            <div className="border border-line rounded-2xl overflow-hidden shadow-2xl bg-slate-950/70 backdrop-blur-sm">
              <StudyGuide />
            </div>
          </SectionShell>

          {/* =====================================================================
              05 / CLEAR & FAIR PRICING
          ====================================================================== */}
          <SectionShell
            id="pricing"
            eyebrow={{
              index: '05',
              label: 'CLEAR & FAIR PRICING // INVEST IN YOUR AVIATION CAREER',
              right: 'ALL 14 SUBJECTS · 65+ 3D SIMULATORS',
            }}
          >
            <div className="text-center mb-16">
              <span className="text-indigo-400 font-bold uppercase tracking-widest text-sm">
                Clear &amp; Fair Pricing
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white mt-2">
                Invest in Your Aviation Career.
              </h2>
              <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
                Affordable plans designed for pilots. Get full access to all 14 subjects, 3D simulations, and AI feedback.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* 1 Month Plan */}
              <div className="bg-slate-900/60 rounded-2xl border border-slate-700/60 p-8 flex flex-col hover:border-blue-500/40 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 group">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  1 Month
                </h3>
                <p className="text-slate-400 text-sm mb-6">Perfect for final revision</p>
                <div className="text-4xl font-black text-white mb-6">
                  €25<span className="text-lg text-slate-500 font-normal">/mo</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex gap-3 text-sm text-slate-300">
                    <CheckCircle size={18} className="text-emerald-500 shrink-0" /> Full access to 14 subjects
                  </li>
                  <li className="flex gap-3 text-sm text-slate-300">
                    <CheckCircle size={18} className="text-emerald-500 shrink-0" /> 65+ 3D Interactive Simulators
                  </li>
                  <li className="flex gap-3 text-sm text-slate-300">
                    <CheckCircle size={18} className="text-emerald-500 shrink-0" /> AI-Powered Explanations
                  </li>
                </ul>
                <button
                  onClick={() => {
                    scrollToSection('hero');
                    setView('SIGNUP');
                  }}
                  className="w-full bg-slate-800 hover:bg-blue-600 text-white py-3 rounded-xl font-bold transition-all duration-300 cursor-pointer"
                >
                  Get Started
                </button>
              </div>

              {/* 6 Months Plan */}
              <div className="bg-gradient-to-b from-indigo-900/50 to-slate-900/60 rounded-2xl border border-indigo-500/40 p-8 flex flex-col relative transform md:-translate-y-4 shadow-2xl shadow-indigo-900/20 hover:border-indigo-400/60 transition-all duration-500 group">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-indigo-500/30">
                  Most Popular
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                  6 Months
                </h3>
                <p className="text-indigo-200 text-sm mb-6">Ideal for steady progression</p>
                <div className="flex items-baseline gap-2 mb-6">
                  <div className="text-4xl font-black text-white">€70</div>
                  <div className="text-sm text-slate-400 line-through">€150</div>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex gap-3 text-sm text-slate-300">
                    <CheckCircle size={18} className="text-indigo-400 shrink-0" />{' '}
                    <span className="font-bold text-indigo-300">Save €80</span> compared to monthly
                  </li>
                  <li className="flex gap-3 text-sm text-slate-300">
                    <CheckCircle size={18} className="text-indigo-400 shrink-0" /> Full access to 14 subjects
                  </li>
                  <li className="flex gap-3 text-sm text-slate-300">
                    <CheckCircle size={18} className="text-indigo-400 shrink-0" /> 65+ 3D Interactive Simulators
                  </li>
                  <li className="flex gap-3 text-sm text-slate-300">
                    <CheckCircle size={18} className="text-indigo-400 shrink-0" /> Priority Support
                  </li>
                </ul>
                <button
                  onClick={() => {
                    scrollToSection('hero');
                    setView('SIGNUP');
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-indigo-500/25 cursor-pointer"
                >
                  Choose 6 Months
                </button>
              </div>

              {/* 12 Months Plan */}
              <div className="bg-slate-900/60 rounded-2xl border border-slate-700/60 p-8 flex flex-col hover:border-purple-500/40 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 group">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                  12 Months
                </h3>
                <p className="text-slate-400 text-sm mb-6">For the complete journey</p>
                <div className="flex items-baseline gap-2 mb-6">
                  <div className="text-4xl font-black text-white">€105</div>
                  <div className="text-sm text-slate-400 line-through">€300</div>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex gap-3 text-sm text-slate-300">
                    <CheckCircle size={18} className="text-emerald-500 shrink-0" />{' '}
                    <span className="font-bold text-emerald-300">Save €195 (Best Value)</span>
                  </li>
                  <li className="flex gap-3 text-sm text-slate-300">
                    <CheckCircle size={18} className="text-emerald-500 shrink-0" /> Full access to 14 subjects
                  </li>
                  <li className="flex gap-3 text-sm text-slate-300">
                    <CheckCircle size={18} className="text-emerald-500 shrink-0" /> 65+ 3D Interactive Simulators
                  </li>
                  <li className="flex gap-3 text-sm text-slate-300">
                    <CheckCircle size={18} className="text-emerald-500 shrink-0" /> Free minor updates
                  </li>
                </ul>
                <button
                  onClick={() => {
                    scrollToSection('hero');
                    setView('SIGNUP');
                  }}
                  className="w-full bg-slate-800 hover:bg-purple-600 text-white py-3 rounded-xl font-bold transition-all duration-300 cursor-pointer"
                >
                  Choose 12 Months
                </button>
              </div>
            </div>
          </SectionShell>

          {/* =====================================================================
              FOOTER WITH OFFICIAL ATPLVECTOR LOGO & BRANDING
          ====================================================================== */}
          <footer className="py-20 bg-slate-950 border-t border-line relative overflow-hidden">
            <div className="mx-auto max-w-[1280px] border-x border-line px-6 md:px-10 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                <div className="col-span-1 md:col-span-2 space-y-6">
                  <div
                    className="flex items-center space-x-2.5 cursor-pointer group"
                    onClick={() => scrollToSection('hero')}
                  >
                    <div className="p-1 w-9 h-9 rounded-xl bg-gradient-to-br from-white/[0.12] via-blue-500/[0.08] to-violet-500/[0.10] backdrop-blur-xl border border-cyan-200/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_8px_24px_rgba(37,99,235,0.18)] group-hover:border-cyan-200/35 group-hover:scale-110 transition-all duration-300 flex items-center justify-center overflow-hidden">
                      <img
                        src="/brand-mark.png"
                        alt="ATPLVector Logo"
                        className="w-full h-full object-contain object-center"
                      />
                    </div>
                    <span className="text-xl font-black text-white tracking-tighter">
                      ATPL
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400">
                        VECTOR
                      </span>
                    </span>
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
                  <h4 className="text-white font-bold text-sm uppercase tracking-widest">
                    Platform
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li>
                      <button
                        onClick={() => scrollToSection('capabilities')}
                        className="hover:text-white transition-colors cursor-pointer"
                      >
                        Features
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => scrollToSection('viewport-3d')}
                        className="hover:text-white transition-colors cursor-pointer"
                      >
                        3D Split Viewport
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => scrollToSection('pricing')}
                        className="hover:text-white transition-colors cursor-pointer"
                      >
                        Pricing
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setActiveInfoPage('CONTACT')}
                        className="hover:text-white transition-colors cursor-pointer"
                      >
                        Contact Support
                      </button>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="text-white font-bold text-sm uppercase tracking-widest">Legal</h4>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li>
                      <button
                        onClick={() => setActiveInfoPage('TERMS')}
                        className="hover:text-white transition-colors text-left w-full cursor-pointer"
                      >
                        Terms of Service
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setActiveInfoPage('PRIVACY')}
                        className="hover:text-white transition-colors text-left w-full cursor-pointer"
                      >
                        Privacy Policy
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setActiveInfoPage('REFUND')}
                        className="hover:text-white transition-colors text-left w-full cursor-pointer"
                      >
                        Refund Policy
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-10 border-t border-line flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-xs text-slate-500">
                  © {new Date().getFullYear()} ATPL Vector. All rights reserved. Built by Michael Mitry.
                </div>

                <div className="flex flex-col items-center md:items-end gap-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                    <Shield size={12} className="text-blue-400" />
                    Question Bank powered by{' '}
                    <span className="text-white font-bold">Chair-Flight</span> Open Source
                  </div>
                  <div className="text-[10px] text-slate-500">Explanations augmented by AI.</div>
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
