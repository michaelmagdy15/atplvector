
import React from 'react';
import { View, User } from '../types';
import { Plane, Scale, Clock, Trophy, ChevronRight, Settings, Activity, Weight, TrendingUp, Map, Users, Cloud, Radio, Navigation, Compass, BookOpen, Lock, Calendar } from 'lucide-react';

interface Props {
    onChangeView: (view: View) => void;
    studyTime: number;
    user: User;
}

const PlatformDashboard: React.FC<Props> = ({ onChangeView, studyTime, user }) => {

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h}h ${m}m`;
    };

    const isLocked = (subjectId: string) => {
        const allowed = user.allowedSubjects || [];
        if (allowed.includes('ALL')) return false;
        return !allowed.includes(subjectId);
    };

    // Helper for color styles - gradients instead of solid colors
    const getColorStyles = (color: string) => {
        const styles: Record<string, string> = {
            red: 'from-red-500 to-rose-600 text-red-100',
            orange: 'from-orange-500 to-amber-600 text-orange-100',
            amber: 'from-amber-400 to-orange-500 text-amber-100',
            yellow: 'from-yellow-400 to-orange-500 text-yellow-100',
            lime: 'from-lime-400 to-green-500 text-lime-100',
            green: 'from-green-500 to-emerald-600 text-green-100',
            emerald: 'from-emerald-500 to-teal-600 text-emerald-100',
            teal: 'from-teal-400 to-cyan-500 text-teal-100',
            cyan: 'from-cyan-400 to-sky-500 text-cyan-100',
            sky: 'from-sky-400 to-blue-500 text-sky-100',
            blue: 'from-blue-500 to-indigo-600 text-blue-100',
            indigo: 'from-indigo-500 to-violet-600 text-indigo-100',
            violet: 'from-violet-500 to-purple-600 text-violet-100',
            purple: 'from-purple-500 to-fuchsia-600 text-purple-100',
            pink: 'from-pink-500 to-rose-600 text-pink-100',
        };
        return styles[color] || styles['blue'];
    };

    // Card Helper Component
    const SubjectCard = ({ id, code, title, desc, icon: Icon, color, onClick, progress }: any) => {
        const locked = isLocked(code);
        const gradient = getColorStyles(color);

        return (
            <div
                onClick={() => !locked && onClick()}
                className={`group relative glass-card rounded-2xl p-1 overflow-hidden transition-all duration-300 ${locked ? 'opacity-80 cursor-not-allowed' : 'hover:scale-[1.01] cursor-pointer'}`}
            >
                {locked && (
                    <div className="absolute inset-0 z-30 bg-slate-950/60 backdrop-blur-[4px] flex flex-col items-center justify-center transition-opacity hover:bg-slate-950/50">
                        <div className="p-3 bg-slate-900/80 rounded-full border border-white/10 shadow-xl mb-2 backdrop-blur-md">
                            <Lock className="w-6 h-6 text-slate-400" />
                        </div>
                        <span className="text-white font-bold text-xs tracking-wider uppercase bg-black/40 px-3 py-1 rounded-full border border-white/10">Locked</span>
                    </div>
                )}

                <div className="bg-slate-900/40 rounded-xl h-full p-6 md:p-8 relative overflow-hidden flex flex-col">
                    {/* Background Glow */}
                    <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${gradient} rounded-full blur-[80px] opacity-20 group-hover:opacity-30 transition-opacity duration-500`}></div>

                    {/* Icon */}
                    <div className={`absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12`}>
                        <Icon size={120} />
                    </div>

                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-6">
                            <div className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border bg-white/5 border-white/10 text-slate-300 shadow-sm`}>
                                Subject {code}
                            </div>
                            <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient} shadow-lg opacity-80 group-hover:opacity-100 transition-opacity`}>
                                <Icon size={20} className="text-white" />
                            </div>
                        </div>

                        <h2 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all">{title}</h2>

                        <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
                            {desc}
                        </p>

                        {/* Progress Bar */}
                        {!locked && progress !== undefined && (
                            <div className="mb-6">
                                <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
                                    <span>Progress</span>
                                    <span>{progress}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full bg-gradient-to-r ${gradient} transition-all duration-1000`}
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center text-sm font-bold text-white/80 group-hover:text-white transition-colors pt-4 border-t border-white/5 mt-auto">
                            <span>Open Module</span>
                            <ChevronRight className="ml-auto w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const commsLocked = isLocked('090');

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8">
            {/* Header / Stats */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">Pilot Dashboard</h1>
                    <p className="text-slate-400 text-sm md:text-base">Ready for briefing, Captain. Select a module to begin.</p>
                </div>

                <div className="flex flex-wrap gap-4">
                    <div className="glass-panel px-5 py-3 rounded-2xl flex items-center gap-4">
                        <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                            <Clock size={20} />
                        </div>
                        <div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Flight Time</div>
                            <div className="text-xl font-mono font-bold text-white">{formatTime(studyTime)}</div>
                        </div>
                    </div>
                    <div className="glass-panel px-5 py-3 rounded-2xl flex items-center gap-4">
                        <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400">
                            <Trophy size={20} />
                        </div>
                        <div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Rank</div>
                            <div className="text-xl font-bold text-white">Cadet</div>
                        </div>
                    </div>

                    {/* Study Guide Quick Access */}
                    <div
                        onClick={() => onChangeView(View.STUDY_GUIDE)}
                        className="glass-panel px-5 py-3 rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-colors border border-blue-500/30 shadow-lg shadow-blue-500/10 group"
                    >
                        <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 group-hover:scale-110 transition-transform">
                            <TrendingUp size={20} />
                        </div>
                        <div>
                            <div className="text-[10px] text-blue-400/60 font-bold uppercase tracking-wider">Strategy</div>
                            <div className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors">Study Guide</div>
                        </div>
                    </div>

                    {/* Question Bank Quick Access */}
                    <div
                        onClick={() => onChangeView(View.QUESTION_BANK)}
                        className="glass-panel px-5 py-3 rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-colors border border-purple-500/30 shadow-lg shadow-purple-500/10 group"
                    >
                        <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400 group-hover:scale-110 transition-transform">
                            <BookOpen size={20} />
                        </div>
                        <div>
                            <div className="text-[10px] text-purple-400/60 font-bold uppercase tracking-wider">Practice</div>
                            <div className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors">Question Bank</div>
                        </div>
                    </div>

                    {/* Exam Planner Quick Access */}
                    <div
                        onClick={() => onChangeView(View.EXAM_PLANNER)}
                        className="glass-panel px-5 py-3 rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-colors border border-indigo-500/30 shadow-lg shadow-indigo-500/10 group"
                    >
                        <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400 group-hover:scale-110 transition-transform">
                            <Calendar size={20} />
                        </div>
                        <div>
                            <div className="text-[10px] text-indigo-400/60 font-bold uppercase tracking-wider">Planning</div>
                            <div className="text-xl font-bold text-white group-hover:text-indigo-200 transition-colors">Exam Planner</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subjects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                {/* 010 Air Law */}
                <SubjectCard
                    code="010" title="Air Law"
                    desc="International law, conventions, agreements and organizations. Annex 2, 7, 11 and 14."
                    icon={Scale} color="red"
                    onClick={() => onChangeView(View.AIR_LAW_HOME)}
                />

                {/* 021 AGK Airframe */}
                <SubjectCard
                    code="021" title="AGK: Systems"
                    desc="Fuselage, hydraulics, landing gear, flight controls, pneumatics and electrics."
                    icon={Settings} color="orange"
                    onClick={() => onChangeView(View.AGK_SYSTEMS_HOME)}
                />

                {/* 022 AGK Instrumentation */}
                <SubjectCard
                    code="022" title="AGK: Instruments"
                    desc="Sensors, instruments, measurement of air data, gyroscopic instruments and EFIS."
                    icon={Activity} color="amber"
                    onClick={() => onChangeView(View.AGK_INSTRUMENTS_HOME)}
                />

                {/* 031 Mass & Balance */}
                <SubjectCard
                    code="031" title="Mass & Balance"
                    desc="Center of gravity calculations, loading, weighing, and performance limitations."
                    icon={Weight} color="yellow"
                    onClick={() => onChangeView(View.MASS_BAL_HOME)}
                />

                {/* 032 Performance */}
                <SubjectCard
                    code="032" title="Performance (A)"
                    desc="Take-off, climb, cruise, descent and landing performance for Class A/B aircraft."
                    icon={TrendingUp} color="lime"
                    onClick={() => onChangeView(View.PERF_HOME)}
                />

                {/* 033 Flight Planning */}
                <SubjectCard
                    code="033" title="Flight Planning"
                    desc="VFR/IFR planning, fuel planning, point of equal time, and flight monitoring."
                    icon={Map} color="green"
                    onClick={() => onChangeView(View.FLIGHT_PLAN_HOME)}
                />

                {/* 040 Human Performance */}
                <SubjectCard
                    code="040" title="Human Performance"
                    desc="Physiology, psychology, sleep, stress, and error management in aviation."
                    icon={Users} color="emerald"
                    onClick={() => onChangeView(View.HPL_HOME)}
                />

                {/* 050 Meteorology */}
                <SubjectCard
                    code="050" title="Meteorology"
                    desc="Atmosphere, wind, thermodynamics, clouds, fog, precipitation and climatology."
                    icon={Cloud} color="teal"
                    onClick={() => onChangeView(View.MET_HOME)}
                />

                {/* 061 General Nav */}
                <SubjectCard
                    code="061" title="General Navigation"
                    desc="Basics of navigation, magnetism, charts, dead reckoning and in-flight navigation."
                    icon={Compass} color="cyan"
                    onClick={() => onChangeView(View.GEN_NAV_HOME)}
                />

                {/* 062 Radio Nav */}
                <SubjectCard
                    code="062" title="Radio Navigation"
                    desc="Radio aids, radar, GNSS, area navigation systems and self-contained nav."
                    icon={Radio} color="sky"
                    onClick={() => onChangeView(View.RAD_NAV_HOME)}
                />

                {/* 070 Operational Procedures */}
                <SubjectCard
                    code="070" title="Operational Proc."
                    desc="Special operational procedures, noise abatement, fire/smoke, wind shear and icing."
                    icon={BookOpen} color="indigo"
                    onClick={() => onChangeView(View.OPS_PROC_HOME)}
                />

                {/* 081 Principles of Flight */}
                <SubjectCard
                    code="081" title="Principles of Flight"
                    desc="Subsonic aerodynamics, stability, control, lift, drag, and stalling."
                    icon={Plane} color="violet"
                    onClick={() => onChangeView(View.POF_HOME)}
                />

                {/* 100 KSA */}
                <SubjectCard
                    code="100" title="KSA"
                    desc="Knowledge, Skills and Attitudes. Core competencies, TEM, and mental maths."
                    icon={Users} color="pink"
                    onClick={() => onChangeView(View.KSA_HOME)}
                />

                {/* 090 Communications (Featured) */}
                <div className="md:col-span-2 xl:col-span-3">
                    <div
                        onClick={() => !commsLocked && onChangeView(View.DASHBOARD)}
                        className={`group relative glass-card rounded-2xl p-1 overflow-hidden transition-all duration-300 ${commsLocked ? 'opacity-80 cursor-not-allowed' : 'hover:scale-[1.005] cursor-pointer'}`}
                    >
                        {commsLocked && (
                            <div className="absolute inset-0 z-30 bg-slate-950/60 backdrop-blur-[4px] flex flex-col items-center justify-center transition-opacity hover:bg-slate-950/50">
                                <div className="p-3 bg-slate-900/80 rounded-full border border-white/10 shadow-xl mb-2 backdrop-blur-md">
                                    <Lock className="w-6 h-6 text-slate-400" />
                                </div>
                                <span className="text-white font-bold text-xs tracking-wider uppercase bg-black/40 px-3 py-1 rounded-full border border-white/10">Locked</span>
                            </div>
                        )}

                        <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 rounded-xl h-full p-8 relative overflow-hidden">
                            {/* Background Glow */}
                            <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-600 rounded-full blur-[100px] opacity-20 group-hover:opacity-30 transition-opacity duration-700"></div>

                            {/* Icon */}
                            <div className="absolute top-1/2 right-12 -translate-y-1/2 opacity-20 group-hover:opacity-30 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12 hidden md:block">
                                <Navigation size={180} />
                            </div>

                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl shadow-blue-500/20">
                                    <Navigation size={40} className="text-white" />
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30 mb-3">
                                        Featured Module
                                    </div>
                                    <h2 className="text-3xl font-bold text-white mb-2 group-hover:text-blue-100 transition-colors">VFR & IFR Communications (090)</h2>
                                    <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
                                        Comprehensive coverage of VFR/IFR communications, distress & urgency, propagation theory, and general operating procedures. Includes AI Roleplay and Voice Simulation.
                                    </p>
                                </div>
                                <div className="flex items-center text-sm font-bold text-blue-300 bg-blue-500/10 px-6 py-3 rounded-lg border border-blue-500/20 group-hover:bg-blue-500/20 group-hover:text-white transition-all whitespace-nowrap">
                                    <span>Enter Cockpit</span>
                                    <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PlatformDashboard;
