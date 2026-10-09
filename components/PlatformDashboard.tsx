import React, { useState, useEffect } from 'react';
import { View, User } from '../types';
import { 
    Plane, Scale, Clock, Trophy, ChevronRight, Settings, Activity, Weight, 
    TrendingUp, Map, Users, Cloud, Radio, Navigation, Compass, BookOpen, 
    Lock, Calendar, Flame, Target, Shield, Gauge, Award, Search, Sparkles,
    Zap, CheckCircle2, RotateCw, Filter, Layers, ArrowUpRight
} from 'lucide-react';

interface Props {
    onChangeView: (view: View) => void;
    studyTime: number;
    user: User;
}

type SubjectCategory = 'ALL' | 'SYSTEMS' | 'NAV' | 'FLIGHT' | 'OPS' | 'SPECIAL';

export const PlatformDashboard: React.FC<Props> = ({ onChangeView, studyTime, user }) => {
    const [selectedCategory, setSelectedCategory] = useState<SubjectCategory>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [utcTime, setUtcTime] = useState<string>('');

    // Live UTC Clock for Authentic Flight Deck Feel
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setUtcTime(now.toUTCString().slice(17, 25) + ' ZULU');
        };
        updateTime();
        const timer = setInterval(updateTime, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h}h ${m}m`;
    };

    const isLocked = (subjectId: string) => {
        if (user.isAdmin) return false;
        const allowed = user.allowedSubjects || [];
        if (allowed.includes('ALL')) return false;
        return !allowed.includes(subjectId);
    };

    const getColorStyles = (color: string) => {
        const styles: Record<string, { border: string, bg: string, text: string, gradient: string }> = {
            red: { border: 'border-rose-500/30', bg: 'bg-rose-500/10', text: 'text-rose-400', gradient: 'from-rose-500 to-red-600' },
            orange: { border: 'border-orange-500/30', bg: 'bg-orange-500/10', text: 'text-orange-400', gradient: 'from-orange-500 to-amber-600' },
            amber: { border: 'border-amber-500/30', bg: 'bg-amber-500/10', text: 'text-amber-400', gradient: 'from-amber-400 to-orange-500' },
            yellow: { border: 'border-yellow-500/30', bg: 'bg-yellow-500/10', text: 'text-yellow-400', gradient: 'from-yellow-400 to-amber-500' },
            lime: { border: 'border-lime-500/30', bg: 'bg-lime-500/10', text: 'text-lime-400', gradient: 'from-lime-400 to-emerald-500' },
            green: { border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', text: 'text-emerald-400', gradient: 'from-emerald-500 to-teal-600' },
            emerald: { border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', text: 'text-emerald-400', gradient: 'from-emerald-400 to-teal-500' },
            teal: { border: 'border-teal-500/30', bg: 'bg-teal-500/10', text: 'text-teal-400', gradient: 'from-teal-400 to-cyan-500' },
            cyan: { border: 'border-cyan-500/30', bg: 'bg-cyan-500/10', text: 'text-cyan-400', gradient: 'from-cyan-400 to-sky-500' },
            sky: { border: 'border-sky-500/30', bg: 'bg-sky-500/10', text: 'text-sky-400', gradient: 'from-sky-400 to-blue-500' },
            blue: { border: 'border-blue-500/30', bg: 'bg-blue-500/10', text: 'text-blue-400', gradient: 'from-blue-500 to-indigo-600' },
            indigo: { border: 'border-indigo-500/30', bg: 'bg-indigo-500/10', text: 'text-indigo-400', gradient: 'from-indigo-500 to-purple-600' },
            violet: { border: 'border-violet-500/30', bg: 'bg-violet-500/10', text: 'text-violet-400', gradient: 'from-violet-500 to-purple-600' },
            purple: { border: 'border-purple-500/30', bg: 'bg-purple-500/10', text: 'text-purple-400', gradient: 'from-purple-500 to-fuchsia-600' },
            pink: { border: 'border-pink-500/30', bg: 'bg-pink-500/10', text: 'text-pink-400', gradient: 'from-pink-500 to-rose-600' },
        };
        return styles[color] || styles['cyan'];
    };

    // Gamification calculations
    const todayDateStr = new Date().toISOString().split('T')[0];
    const todayStudySeconds = user?.dailyStudyData?.[todayDateStr] || 0;
    const dailyGoalSeconds = user?.dailyGoalSeconds || 3600;
    const streakDays = user?.streakDays || 0;
    const goalProgressPercent = Math.min(100, Math.round((todayStudySeconds / dailyGoalSeconds) * 100));

    // Subject Library Definition with Category Tagging
    const allSubjects = [
        {
            code: "010",
            title: "Air Law",
            category: "OPS" as SubjectCategory,
            desc: "International conventions (Chicago/Tokyo/Warsaw), Annexes 2, 7, 11, 14, airspace classifications, and ATC procedures.",
            icon: Scale,
            color: "red",
            targetView: View.AIR_LAW_HOME,
            progress: 35,
            topicsCount: 14,
            simCount: 8
        },
        {
            code: "021",
            title: "AGK: Systems",
            category: "SYSTEMS" as SubjectCategory,
            desc: "Airframe structure, hydraulics, landing gear, flight controls, pneumatics, AC/DC electrics, and APU systems.",
            icon: Settings,
            color: "orange",
            targetView: View.AGK_SYSTEMS_HOME,
            progress: 20,
            topicsCount: 18,
            simCount: 12
        },
        {
            code: "022",
            title: "AGK: Instruments",
            category: "SYSTEMS" as SubjectCategory,
            desc: "Pitot-static probes, altimeters, ASI, VSI, gyroscopes, flux valves, EFIS, FMS, and stall warning transducers.",
            icon: Activity,
            color: "amber",
            targetView: View.INST_HOME,
            progress: 45,
            topicsCount: 16,
            simCount: 10
        },
        {
            code: "031",
            title: "Mass & Balance",
            category: "FLIGHT" as SubjectCategory,
            desc: "CG limits, datum offsets, zero fuel mass, MAC percentages, load sheet calculations, and cargo distribution.",
            icon: Weight,
            color: "yellow",
            targetView: View.MASS_BAL_HOME,
            progress: 15,
            topicsCount: 10,
            simCount: 6
        },
        {
            code: "032",
            title: "Performance (A)",
            category: "FLIGHT" as SubjectCategory,
            desc: "Takeoff distance, V1/VR/V2 speeds, balanced field lengths, climb gradients, drift down, and landing margins.",
            icon: TrendingUp,
            color: "lime",
            targetView: View.PERF_HOME,
            progress: 10,
            topicsCount: 12,
            simCount: 7
        },
        {
            code: "033",
            title: "Flight Planning",
            category: "NAV" as SubjectCategory,
            desc: "Fuel policy, taxi/trip/contingency reserves, ICAO flight plan forms, critical point (CP), and point of safe return (PSR).",
            icon: Map,
            color: "blue",
            targetView: View.FLIGHT_PLAN_HOME,
            progress: 30,
            topicsCount: 15,
            simCount: 9
        },
        {
            code: "040",
            title: "Human Performance",
            category: "OPS" as SubjectCategory,
            desc: "High altitude physiology, hypoxia, spatial disorientation, sleep cycles, TEM, CRM, and cockpit communication.",
            icon: Users,
            color: "emerald",
            targetView: View.HPL_HOME,
            progress: 60,
            topicsCount: 13,
            simCount: 5
        },
        {
            code: "050",
            title: "Meteorology",
            category: "FLIGHT" as SubjectCategory,
            desc: "Atmospheric pressure, wind shear, jet streams, cloud microphysics, frontal cyclones, METAR/TAF decoders, and SIGWX.",
            icon: Cloud,
            color: "teal",
            targetView: View.MET_HOME,
            progress: 50,
            topicsCount: 22,
            simCount: 11
        },
        {
            code: "061",
            title: "General Navigation",
            category: "NAV" as SubjectCategory,
            desc: "Earth geometry, great circles, rhumb lines, Lambert & Mercator charts, 1 in 60 rule, and polar navigation.",
            icon: Compass,
            color: "cyan",
            targetView: View.GEN_NAV_HOME,
            progress: 40,
            topicsCount: 17,
            simCount: 8
        },
        {
            code: "062",
            title: "Radio Navigation",
            category: "NAV" as SubjectCategory,
            desc: "Ground-based radio aids (VOR, NDB/ADF, DME, ILS, MLS), radar theory, GNSS constellations, SBAS, and PBN.",
            icon: Radio,
            color: "sky",
            targetView: View.RAD_NAV_HOME,
            progress: 75,
            topicsCount: 20,
            simCount: 14
        },
        {
            code: "070",
            title: "Operational Proc.",
            category: "OPS" as SubjectCategory,
            desc: "Special ops, low visibility ops (Cat II/III), MNPS/NAT-HLA, fire protection, emergency evacuation, and bird strikes.",
            icon: BookOpen,
            color: "indigo",
            targetView: View.OPS_PROC_HOME,
            progress: 25,
            topicsCount: 14,
            simCount: 6
        },
        {
            code: "081",
            title: "Principles of Flight",
            category: "FLIGHT" as SubjectCategory,
            desc: "Subsonic airflow, boundary layer, lift/drag polar, stalls, Dutch roll, Mach tuck, shockwaves, and sweepback.",
            icon: Plane,
            color: "violet",
            targetView: View.POF_HOME,
            progress: 55,
            topicsCount: 19,
            simCount: 15
        },
        {
            code: "100",
            title: "KSA 100",
            category: "OPS" as SubjectCategory,
            desc: "Knowledge, Skills and Attitudes: Threat and Error Management (TEM), mental math strategies, and scenario decision making.",
            icon: Award,
            color: "pink",
            targetView: View.KSA_HOME,
            progress: 80,
            topicsCount: 8,
            simCount: 4
        }
    ];

    // Filter Subjects by Category and Search
    const filteredSubjects = allSubjects.filter(sub => {
        const matchesCategory = selectedCategory === 'ALL' || sub.category === selectedCategory;
        const matchesSearch = sub.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              sub.code.includes(searchQuery) ||
                              sub.desc.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-300">
            {/* COCKPIT HUD MISSION BANNER */}
            <section className="relative isolate overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-slate-900 via-[#07101f] to-slate-950 p-6 sm:p-8 lg:p-10 shadow-2xl">
                {/* Background Radar Grid & Subtle Scan Line */}
                <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    {/* Left: Pilot Status & Mission Objective */}
                    <div className="space-y-4 max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2.5">
                            <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                FLIGHT DECK ACTIVE
                            </span>
                            <span className="px-3 py-1 rounded-full bg-slate-800/80 border border-white/10 text-slate-300 font-mono text-xs">
                                {utcTime || 'UTC CLOCK SYNCED'}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 font-mono text-xs font-bold">
                                {user.subscriptionTier || 'CADET TRACK'}
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                            Welcome back, <br className="hidden sm:inline" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
                                {user.fullName || (user.email ? user.email.split('@')[0] : 'Aviator')}
                            </span>
                        </h1>

                        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                            Maintain your exam readiness pace. Today's objective is to complete focused question bank intervals and verify instrument radials.
                        </p>

                        {/* Quick Dispatch Buttons */}
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => onChangeView(View.QUESTION_BANK)}
                                className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/25 active:scale-95 flex items-center gap-2"
                            >
                                <Zap size={16} />
                                <span>Question Bank Sprint</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => onChangeView(View.PROGRESS_DASHBOARD)}
                                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider transition-all border border-white/10 flex items-center gap-2 active:scale-95"
                            >
                                <Activity size={16} />
                                <span>Review Analytics</span>
                            </button>
                        </div>
                    </div>

                    {/* Right: Telemetry Flight Gauges */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:w-auto shrink-0">
                        {/* Daily Goal Gauge */}
                        <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 flex flex-col justify-between">
                            <div className="flex items-center justify-between text-slate-500 text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
                                <span>DAILY TARGET</span>
                                <span className="text-emerald-400">{goalProgressPercent}%</span>
                            </div>
                            <div className="text-xl sm:text-2xl font-mono font-bold text-white mb-2">
                                {formatTime(todayStudySeconds)}
                            </div>
                            <div className="w-28 sm:w-36 h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-700"
                                    style={{ width: `${goalProgressPercent}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Study Streak */}
                        <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 flex flex-col justify-between">
                            <div className="flex items-center justify-between text-slate-500 text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
                                <span>FLIGHT STREAK</span>
                                <Flame size={14} className={streakDays > 0 ? 'text-orange-400 animate-pulse' : 'text-slate-600'} />
                            </div>
                            <div className="text-xl sm:text-2xl font-mono font-bold text-white mb-2">
                                {streakDays} <span className="text-xs text-slate-500 font-sans">Days</span>
                            </div>
                            <div className="text-[10px] font-mono text-emerald-400">
                                {streakDays > 0 ? 'STREAK MAINTAINED' : 'LOG 30 MIN TODAY'}
                            </div>
                        </div>

                        {/* Total Flight Hours */}
                        <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 flex flex-col justify-between">
                            <div className="flex items-center justify-between text-slate-500 text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
                                <span>TOTAL LOGGED</span>
                                <Clock size={14} className="text-blue-400" />
                            </div>
                            <div className="text-xl sm:text-2xl font-mono font-bold text-white mb-2">
                                {formatTime(studyTime)}
                            </div>
                            <div className="text-[10px] font-mono text-blue-400">
                                ALL SESSIONS SYNCED
                            </div>
                        </div>

                        {/* Exam Readiness Target */}
                        <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 flex flex-col justify-between">
                            <div className="flex items-center justify-between text-slate-500 text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
                                <span>ACCURACY GOAL</span>
                                <Target size={14} className="text-purple-400" />
                            </div>
                            <div className="text-xl sm:text-2xl font-mono font-bold text-white mb-2">
                                94%
                            </div>
                            <div className="text-[10px] font-mono text-purple-400">
                                45S PACING BENCHMARK
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SPECIALIZED FLIGHT DECK HUBS */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Sparkles size={18} className="text-cyan-400" />
                        <span>Featured Flight Deck Hubs</span>
                    </h2>
                    <span className="text-xs font-mono text-slate-500 uppercase">Specialized Simulations</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Cessna 172 Flight Deck Hub */}
                    <div 
                        onClick={() => onChangeView(View.C172_HUB)}
                        className="p-6 rounded-3xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-950 border border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 cursor-pointer group shadow-xl hover:shadow-cyan-500/10 flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <span className="px-2.5 py-1 rounded-md bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold uppercase tracking-wider border border-cyan-500/30">
                                    COCKPIT SYSTEMS
                                </span>
                                <Gauge size={22} className="text-cyan-400 group-hover:scale-110 transition-transform" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                                Cessna 172 Hub
                            </h3>
                            <p className="text-slate-400 text-xs leading-relaxed">
                                Dynamic airspeed indicator with calibrated color arcs, V-speed envelope, Lycoming IO-360 engine parameters, and weight &amp; balance calculator.
                            </p>
                        </div>
                        <div className="pt-4 mt-4 border-t border-white/5 flex items-center text-xs font-bold text-cyan-400">
                            <span>Open Cockpit Hub</span>
                            <ArrowUpRight size={14} className="ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </div>
                    </div>

                    {/* FAA Knowledge Test Center */}
                    <div 
                        onClick={() => onChangeView(View.FAA_TEST_GUIDE)}
                        className="p-6 rounded-3xl bg-gradient-to-br from-sky-950/40 via-slate-900 to-slate-950 border border-sky-500/20 hover:border-sky-400/50 transition-all duration-300 cursor-pointer group shadow-xl hover:shadow-sky-500/10 flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <span className="px-2.5 py-1 rounded-md bg-sky-500/20 text-sky-300 font-mono text-[10px] font-bold uppercase tracking-wider border border-sky-500/30">
                                    57 FIGURES · ACS
                                </span>
                                <Shield size={22} className="text-sky-400 group-hover:scale-110 transition-transform" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">
                                FAA Test Guide
                            </h3>
                            <p className="text-slate-400 text-xs leading-relaxed">
                                Official FAA airman knowledge test simulator with chart cross-sections, airspace symbology, weather depiction charts, and diagnostic error analysis.
                            </p>
                        </div>
                        <div className="pt-4 mt-4 border-t border-white/5 flex items-center text-xs font-bold text-sky-400">
                            <span>Launch FAA Simulator</span>
                            <ArrowUpRight size={14} className="ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </div>
                    </div>

                    {/* EgyptAir Cadet Portal */}
                    <div 
                        onClick={() => onChangeView(View.EGYPTAIR_DASHBOARD)}
                        className="p-6 rounded-3xl bg-gradient-to-br from-blue-950/40 via-slate-900 to-slate-950 border border-blue-500/20 hover:border-blue-400/50 transition-all duration-300 cursor-pointer group shadow-xl hover:shadow-blue-500/10 flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <span className="px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-300 font-mono text-[10px] font-bold uppercase tracking-wider border border-blue-500/30">
                                    ABC 4TH EDITION
                                </span>
                                <Plane size={22} className="text-blue-400 group-hover:scale-110 transition-transform" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                                EgyptAir Cadets
                            </h3>
                            <p className="text-slate-400 text-xs leading-relaxed">
                                Specialized ground school curriculum covering ECARs civil aviation regulations, airline fuel policies, holding patterns, and multi-crew CRM scenarios.
                            </p>
                        </div>
                        <div className="pt-4 mt-4 border-t border-white/5 flex items-center text-xs font-bold text-blue-400">
                            <span>Access Cadet Portal</span>
                            <ArrowUpRight size={14} className="ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </div>
                    </div>
                </div>
            </section>

            {/* SUBJECT LIBRARY & FILTER BAR */}
            <section className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight">ATPL &amp; PPL Ground School</h2>
                        <p className="text-xs text-slate-400">Select any module to launch learning objectives, theory notes, and interactive simulators.</p>
                    </div>

                    {/* Search Field */}
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3.5 top-3 text-slate-500 w-4 h-4" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Filter by subject or code..."
                            className="w-full bg-slate-900/90 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white text-xs placeholder-slate-500 outline-none focus:border-cyan-400 transition-colors"
                        />
                    </div>
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {[
                        { id: 'ALL', label: 'All Subjects (14)' },
                        { id: 'SYSTEMS', label: 'Aircraft Systems' },
                        { id: 'NAV', label: 'Navigation & Radio' },
                        { id: 'FLIGHT', label: 'Flight & Meteorology' },
                        { id: 'OPS', label: 'Regulations & Operations' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setSelectedCategory(tab.id as SubjectCategory)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                                selectedCategory === tab.id
                                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/5'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Subject Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSubjects.map((sub) => {
                        const locked = isLocked(sub.code);
                        const colors = getColorStyles(sub.color);
                        const Icon = sub.icon;

                        return (
                            <div
                                key={sub.code}
                                role={locked ? undefined : 'button'}
                                tabIndex={locked ? -1 : 0}
                                onClick={() => !locked && onChangeView(sub.targetView)}
                                onKeyDown={(e) => {
                                    if (!locked && (e.key === 'Enter' || e.key === ' ')) {
                                        e.preventDefault();
                                        onChangeView(sub.targetView);
                                    }
                                }}
                                className={`group relative rounded-3xl p-6 bg-slate-950/80 border ${colors.border} transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg ${
                                    locked 
                                        ? 'opacity-70 cursor-not-allowed' 
                                        : 'hover:scale-[1.01] hover:border-cyan-400/50 cursor-pointer hover:shadow-cyan-500/10'
                                }`}
                            >
                                {/* Lock Overlay if unpermitted */}
                                {locked && (
                                    <div className="absolute inset-0 bg-slate-950/80 z-20 flex flex-col items-center justify-center p-4 text-center">
                                        <div className="p-3 rounded-full bg-slate-900 border border-white/10 mb-2">
                                            <Lock size={18} className="text-slate-400" />
                                        </div>
                                        <span className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-widest">
                                            LOCKED MODULE
                                        </span>
                                        <span className="text-[10px] text-slate-500 mt-1">Upgrade subscription to unlock</span>
                                    </div>
                                )}

                                {/* Glow Corner Accent */}
                                <div className={`absolute -top-16 -right-16 w-32 h-32 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity bg-gradient-to-br ${colors.gradient}`}></div>

                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <span className={`px-2.5 py-1 rounded-md font-mono text-[10px] font-bold uppercase tracking-wider ${colors.bg} ${colors.text} border ${colors.border}`}>
                                            SUB {sub.code}
                                        </span>
                                        <div className={`p-2 rounded-xl ${colors.bg} ${colors.text}`}>
                                            <Icon size={20} />
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                                        {sub.title}
                                    </h3>

                                    <p className="text-slate-400 text-xs leading-relaxed mb-6">
                                        {sub.desc}
                                    </p>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-white/5 mt-auto">
                                    {/* Topic and Simulator Badges */}
                                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                                        <span>{sub.topicsCount} Topics</span>
                                        <span className="text-cyan-400 font-bold">{sub.simCount} Simulators</span>
                                    </div>

                                    {/* Enter Action */}
                                    <div className="flex items-center justify-between text-xs font-bold text-slate-300 group-hover:text-cyan-300 transition-colors">
                                        <span>Initialize Module</span>
                                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredSubjects.length === 0 && (
                    <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-white/5">
                        <p className="text-slate-400 text-sm">No subjects matched your filter "{searchQuery}".</p>
                        <button
                            type="button"
                            onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); }}
                            className="mt-3 text-xs font-bold text-cyan-400 hover:underline"
                        >
                            Reset search filter
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default PlatformDashboard;
