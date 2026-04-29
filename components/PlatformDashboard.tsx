import React from 'react';
import { View, User } from '../types';
import { Plane, Scale, Clock, Trophy, ChevronRight, Settings, Activity, Weight, TrendingUp, Map, Users, Cloud, Radio, Navigation, Compass, BookOpen, Lock, Calendar, Flame, Target } from 'lucide-react';

interface Props {
    onChangeView: (view: View) => void;
    studyTime: number;
    user: User;
}

const PlatformDashboard: React.FC<Props> = ({ onChangeView, studyTime, user }) => {
    // ... helper functions (formatTime, isLocked, getColorStyles) ...
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

    // SubjectCard component
    const SubjectCard = ({ id, code, title, desc, icon: Icon, color, onClick, progress, isComingSoon }: any) => {
        const locked = isLocked(code) || isComingSoon;
        const gradient = getColorStyles(color);

        return (
            <div
                onClick={() => !locked && onClick()}
                className={`group relative glass-card rounded-2xl p-1 overflow-hidden transition-all duration-300 will-change-transform ${locked ? 'opacity-80 cursor-not-allowed' : 'hover:scale-[1.01] cursor-pointer'}`}
            >
                {locked && (
                    <div className="absolute inset-0 z-30 bg-slate-950/80 flex flex-col items-center justify-center transition-opacity hover:bg-slate-950/70">
                        <div className="p-3 bg-slate-900 border border-white/10 shadow-lg mb-3">
                            {isComingSoon ? (
                                <Calendar className="w-6 h-6 text-amber-500" />
                            ) : (
                                <Lock className="w-6 h-6 text-slate-400" />
                            )}
                        </div>
                        <span className={`text-white font-black text-[10px] tracking-[0.2em] uppercase bg-black/60 px-4 py-1.5 rounded-full border ${isComingSoon ? 'border-amber-500/50 text-amber-400' : 'border-white/10 text-slate-300'}`}>
                            {isComingSoon ? 'Coming Soon' : 'Locked'}
                        </span>
                    </div>
                )}

                <div className="bg-slate-900/40 rounded-xl h-full p-6 md:p-8 relative overflow-hidden flex flex-col">
                    <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${gradient} rounded-full blur-[40px] opacity-20 group-hover:opacity-30 transition-opacity duration-500`}></div>
                    <div className={`absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12`}>
                        <Icon size={120} />
                    </div>
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-6">
                            <div className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border bg-white/5 border-white/10 text-slate-300 shadow-sm`}>
                                Subject {code}
                            </div>
                            <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient} shadow-md opacity-80 group-hover:opacity-100 transition-opacity`}>
                                <Icon size={24} className="text-white" />
                            </div>
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all">{title}</h2>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
                            {desc}
                        </p>
                        {!locked && progress !== undefined && (
                            <div className="mb-6">
                                <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
                                    <span>Progress</span>
                                    <span>{progress}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full bg-gradient-to-r ${gradient} transition-transform duration-1000 origin-left will-change-transform`}
                                        style={{ transform: `scaleX(${progress / 100})` }}
                                    ></div>
                                </div>
                            </div>
                        )}
                        <div className="flex items-center text-sm font-bold text-white/80 group-hover:text-white transition-colors pt-4 border-t border-white/5 mt-auto">
                            <span>Open Module</span>
                            <ChevronRight className="ml-auto w-5 h-5 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const commsLocked = isLocked('090');

    // Gamification calculations
    const todayDateStr = new Date().toISOString().split('T')[0];
    const todayStudySeconds = user?.dailyStudyData?.[todayDateStr] || 0;
    const dailyGoalSeconds = user?.dailyGoalSeconds || 3600;
    const streakDays = user?.streakDays || 0;
    const goalProgressPercent = Math.min(100, Math.round((todayStudySeconds / dailyGoalSeconds) * 100));

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8">
            {/* Header / Stats */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-12 gap-8 pt-4">
                <div className="animate-in fade-in slide-in-from-left duration-1000">
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-3 tracking-tighter uppercase italic leading-tight py-2">
                        Pilot <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">Dashboard</span>
                    </h1>
                    <p className="text-slate-400 text-sm md:text-lg font-medium">Flight deck initialized. All systems nominal.</p>
                </div>

                <div className="flex flex-wrap gap-4 animate-in fade-in slide-in-from-right duration-1000">
                    {/* Gamification: Daily Goal */}
                    <div className="glass-panel px-6 py-4 rounded-2xl flex items-center gap-4 border border-white/10 shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent w-full h-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 relative z-10">
                            <Target size={28} />
                        </div>
                        <div className="relative z-10">
                            <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1 flex justify-between">
                                <span>Daily Goal</span>
                                <span className="text-emerald-400">{goalProgressPercent}%</span>
                            </div>
                            <div className="h-1.5 w-32 bg-slate-800 rounded-full overflow-hidden mb-1">
                                <div 
                                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-1000" 
                                    style={{ width: `${goalProgressPercent}%` }}
                                ></div>
                            </div>
                            <div className="text-xs font-mono font-bold text-slate-300">
                                {formatTime(todayStudySeconds)} / {formatTime(dailyGoalSeconds)}
                            </div>
                        </div>
                    </div>

                    {/* Gamification: Study Streak */}
                    <div className="glass-panel px-6 py-4 rounded-2xl flex items-center gap-4 border border-white/10 shadow-2xl">
                        <div className={`p-3 rounded-xl ${streakDays > 0 ? 'bg-orange-500/10 text-orange-400' : 'bg-slate-800 text-slate-500'}`}>
                            <Flame size={28} className={streakDays > 0 ? 'animate-pulse' : ''} />
                        </div>
                        <div>
                            <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Study Streak</div>
                            <div className="text-2xl font-bold text-white leading-none flex items-baseline gap-1">
                                {streakDays} <span className="text-sm text-slate-400">Days</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel px-6 py-4 rounded-2xl flex items-center gap-4 border border-white/10 shadow-2xl">
                        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                            <Clock size={28} />
                        </div>
                        <div>
                            <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Total Flight Time</div>
                            <div className="text-2xl font-mono font-bold text-white leading-none">{formatTime(studyTime)}</div>
                        </div>
                    </div>
                    
                    <div className="glass-panel px-6 py-4 rounded-2xl flex items-center gap-4 border border-white/10 shadow-2xl hidden md:flex">
                        <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-400">
                            <Trophy size={28} />
                        </div>
                        <div>
                            <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Experience</div>
                            <div className="text-2xl font-bold text-white leading-none">Cadet</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subjects Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in zoom-in duration-700 delay-300">
                <SubjectCard
                    code="010" title="Air Law"
                    desc="International law, conventions, agreements and organizations. Annex 2, 7, 11 and 14."
                    icon={Scale} color="red"
                    onClick={() => onChangeView(View.AIR_LAW_HOME)}
                />
                <SubjectCard
                    code="021" title="AGK: Systems"
                    desc="Fuselage, hydraulics, landing gear, flight controls, pneumatics and electrics."
                    icon={Settings} color="orange"
                    onClick={() => onChangeView(View.AGK_SYSTEMS_HOME)}
                />
                <SubjectCard
                    code="022" title="AGK: Instruments"
                    desc="Sensors, instruments, measurement of air data, gyroscopic instruments and EFIS."
                    icon={Activity} color="amber"
                    onClick={() => onChangeView(View.INST_HOME)}
                />
                <SubjectCard
                    code="031" title="Mass & Balance"
                    desc="Center of gravity calculations, loading, weighing, and performance limitations."
                    icon={Weight} color="yellow"
                    onClick={() => onChangeView(View.MASS_BAL_HOME)}
                />
                <SubjectCard
                    code="032" title="Performance (A)"
                    desc="Take-off, climb, cruise, descent and landing performance for Class A/B aircraft."
                    icon={TrendingUp} color="lime"
                    onClick={() => onChangeView(View.PERF_HOME)}
                />
                <SubjectCard
                    code="040" title="Human Performance"
                    desc="Physiology, psychology, sleep, stress, and error management in aviation."
                    icon={Users} color="emerald"
                    onClick={() => onChangeView(View.HPL_HOME)}
                />
                <SubjectCard
                    code="050" title="Meteorology"
                    desc="Atmosphere, wind, thermodynamics, clouds, fog, precipitation and climatology."
                    icon={Cloud} color="teal"
                    onClick={() => onChangeView(View.MET_HOME)}
                />
                <SubjectCard
                    code="061" title="General Navigation"
                    desc="Basics of navigation, magnetism, charts, dead reckoning and in-flight navigation."
                    icon={Compass} color="cyan"
                    onClick={() => onChangeView(View.GEN_NAV_HOME)}
                />
                <SubjectCard
                    code="062" title="Radio Navigation"
                    desc="Radio aids, radar, GNSS, area navigation systems and self-contained nav."
                    icon={Radio} color="sky"
                    onClick={() => onChangeView(View.RAD_NAV_HOME)}
                />
                <SubjectCard
                    code="070" title="Operational Proc."
                    desc="Special operational procedures, noise abatement, fire/smoke, wind shear and icing."
                    icon={BookOpen} color="indigo"
                    onClick={() => onChangeView(View.OPS_PROC_HOME)}
                />
                <SubjectCard
                    code="081" title="Principles of Flight"
                    desc="Subsonic aerodynamics, stability, control, lift, drag, and stalling."
                    icon={Plane} color="violet"
                    onClick={() => onChangeView(View.POF_HOME)}
                />
                <SubjectCard
                    code="100" title="KSA"
                    desc="Knowledge, Skills and Attitudes. Core competencies, TEM, and mental maths."
                    icon={Users} color="pink"
                    onClick={() => onChangeView(View.KSA_HOME)}
                />

                {/* Featured Module */}
                <div className="md:col-span-2 xl:col-span-3">
                    <div
                        onClick={() => !commsLocked && onChangeView(View.DASHBOARD)}
                        className={`group relative glass-card rounded-3xl p-1 overflow-hidden transition-all duration-500 ${commsLocked ? 'opacity-80 cursor-not-allowed' : 'hover:scale-[1.005] cursor-pointer shadow-2xl shadow-blue-500/10'}`}
                    >
                        <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 rounded-3xl h-full p-10 relative overflow-hidden backdrop-blur-md">
                            <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>
                            <div className="absolute top-1/2 right-12 -translate-y-1/2 opacity-20 group-hover:opacity-40 transition-all duration-700 transform group-hover:scale-110 group-hover:rotate-6 hidden md:block">
                                <Navigation size={220} className="text-blue-400" />
                            </div>
                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                                <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-700 shadow-2xl shadow-blue-600/30">
                                    <Navigation size={48} className="text-white" />
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <div className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-blue-500/20 text-blue-300 border border-blue-500/30 mb-4 shadow-inner">
                                        Featured Simulation
                                    </div>
                                    <h2 className="text-4xl font-black text-white mb-3 tracking-tight">VFR & IFR Communications</h2>
                                    <p className="text-slate-300 text-lg leading-relaxed max-w-2xl opacity-80">
                                        Master radio telephony with AI-powered ATC simulation. Interactive roleplay for all phases of flight.
                                    </p>
                                </div>
                                <div className="flex items-center text-sm font-black uppercase tracking-widest text-white bg-blue-600 px-8 py-4 rounded-2xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 group-hover:translate-y-[-2px]">
                                    <span>Initialize</span>
                                    <ChevronRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
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

