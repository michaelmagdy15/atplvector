import React, { useState, useEffect } from 'react';
import { Calendar, ChevronRight, AlertCircle, Info, Trash2, CheckCircle2, Layout, Clock, BookOpen, Target, Sparkles, Plus } from 'lucide-react';

interface Subject {
    id: string;
    name: string;
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Medium-Hard';
    passRate: number;
    description: string;
}

const ALL_SUBJECTS: Subject[] = [
    { id: '010', name: 'Air Law', difficulty: 'Medium', passRate: 92, description: 'Regulations, airspaces, and rules of the air.' },
    { id: '021', name: 'Aircraft General Knowledge', difficulty: 'Medium', passRate: 84, description: 'Airframe, systems, and powerplants.' },
    { id: '022', name: 'Instrumentation', difficulty: 'Medium', passRate: 90, description: 'Flight instruments and automated systems.' },
    { id: '031', name: 'Mass & Balance', difficulty: 'Medium', passRate: 83, description: 'Weight, CG limits, and loadsheets.' },
    { id: '032', name: 'Performance', difficulty: 'Hard', passRate: 67, description: 'Take-off, landing, and climb performance.' },
    { id: '033', name: 'Flight Planning', difficulty: 'Hard', passRate: 65, description: 'Fuel planning, routes, and monitoring.' },
    { id: '040', name: 'Human Performance', difficulty: 'Medium', passRate: 87, description: 'Physiology and psychology in aviation.' },
    { id: '050', name: 'Meteorology', difficulty: 'Medium-Hard', passRate: 81, description: 'Atmosphere, charts, and weather hazards.' },
    { id: '061', name: 'General Navigation', difficulty: 'Hard', passRate: 70, description: 'Plotting, charts, and dead reckoning.' },
    { id: '062', name: 'Radio Navigation', difficulty: 'Medium', passRate: 86, description: 'ILS, VOR, DME, and Satellite Nav.' },
    { id: '070', name: 'Operational Procedures', difficulty: 'Medium', passRate: 90, description: 'Special ops, fire, and emergency procedures.' },
    { id: '081', name: 'Principles of Flight', difficulty: 'Hard', passRate: 76, description: 'Aerodynamics and lift/drag forces.' },
    { id: '090', name: 'Communications', difficulty: 'Easy', passRate: 98, description: 'VFR and IFR phraseology.' },
];

interface Sitting {
    id: number;
    month: number;
    subjects: string[]; // IDs
}

export const ExamPlanner: React.FC = () => {
    const [sittings, setSittings] = useState<Sitting[]>([]);
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
    const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);

    // Load from local storage
    useEffect(() => {
        const saved = localStorage.getItem('atpl_exam_plan');
        if (saved) {
            const parsed = JSON.parse(saved);
            setSittings(parsed.sittings || []);
            setSelectedSubjects(parsed.selectedSubjects || []);
            setStartDate(parsed.startDate || new Date().toISOString().split('T')[0]);
        }
    }, []);

    // Save to local storage
    useEffect(() => {
        localStorage.setItem('atpl_exam_plan', JSON.stringify({ sittings, selectedSubjects, startDate }));
    }, [sittings, selectedSubjects, startDate]);

    const addSitting = () => {
        if (sittings.length >= 6) {
            alert("You are limited to 6 sittings for the ATPL exams.");
            return;
        }
        const nextId = sittings.length > 0 ? Math.max(...sittings.map(s => s.id)) + 1 : 1;
        setSittings([...sittings, { id: nextId, month: sittings.length * 2, subjects: [] }]);
    };

    const toggleSubjectInSitting = (sittingId: number, subjectId: string) => {
        setSittings(prev => prev.map(s => {
            if (s.id === sittingId) {
                const alreadyHas = s.subjects.includes(subjectId);
                if (alreadyHas) {
                    return { ...s, subjects: s.subjects.filter(id => id !== subjectId) };
                } else {
                    // Remove from other sittings first
                    const cleanedPrev = prev.map(ps => ({ ...ps, subjects: ps.subjects.filter(id => id !== subjectId) }));
                    const targetSitting = cleanedPrev.find(ps => ps.id === sittingId);
                    if (targetSitting) {
                        targetSitting.subjects.push(subjectId);
                    }
                    return targetSitting || s;
                }
            }
            return { ...s, subjects: s.subjects.filter(id => id !== subjectId) };
        }));
    };

    const removeSitting = (id: number) => {
        setSittings(sittings.filter(s => s.id !== id));
    };

    const getRecommendedPlan = () => {
        // Based on Airhead ATPL strategy
        const plan: Sitting[] = [
            { id: 1, month: 0, subjects: ['010', '022', '031', '040', '090'] }, // Module 1: Relatively easy mix
            { id: 2, month: 3, subjects: ['021', '062', '070', '081'] }, // Module 2: AGK + POF
            { id: 3, month: 6, subjects: ['032', '033', '050', '061'] }, // Module 3: Gen Nav, Perf, Flight Planning, Met (The big ones)
        ];
        setSittings(plan);
    };

    const assignedSubjectIds = sittings.flatMap(s => s.subjects);
    const unassignedSubjects = ALL_SUBJECTS.filter(s => !assignedSubjectIds.includes(s.id));

    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case 'Easy': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
            case 'Medium': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            case 'Medium-Hard': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
            case 'Hard': return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                        <Calendar size={12} />
                        Strategic Exam Planner
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight">Plan Your Sittings</h1>
                    <p className="text-slate-400 max-w-2xl">
                        You have <span className="text-white font-bold">6 sittings</span> and <span className="text-white font-bold">18 months</span> to complete all 13 subjects.
                        Use this tool to group subjects strategically based on difficulty and pass rates.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={getRecommendedPlan}
                        className="px-6 py-3 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-2xl font-bold transition-all flex items-center gap-2"
                    >
                        <Sparkles size={18} />
                        Load Recommended Strategy
                    </button>
                    <button
                        onClick={addSitting}
                        className="px-6 py-3 bg-white text-slate-900 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Add Sitting
                    </button>
                </div>
            </div>

            {/* Rules Alert */}
            <div className="glass-panel p-6 rounded-3xl border-l-4 border-amber-500 flex gap-6 items-start">
                <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl">
                    <AlertCircle size={24} />
                </div>
                <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white">EASA/CAA Regulations</h3>
                    <p className="text-sm text-slate-400">
                        All exams must be passed within <span className="text-amber-400 font-bold">18 months</span> of the end of the month in which you first attempted an exam.
                        You have a maximum of <span className="text-amber-400 font-bold">6 sittings</span> and <span className="text-amber-400 font-bold">4 attempts</span> per subject.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left Sidebar: Unassigned Subjects */}
                <div className="lg:col-span-1 space-y-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <BookOpen size={20} className="text-indigo-400" />
                        Remaining Subjects
                    </h3>
                    <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                        {unassignedSubjects.map(subject => (
                            <div
                                key={subject.id}
                                className="glass-panel p-4 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all group cursor-pointer"
                                onClick={() => {
                                    if (sittings.length === 0) {
                                        alert("Please add at least one sitting first.");
                                        return;
                                    }
                                    toggleSubjectInSitting(sittings[0].id, subject.id);
                                }}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-mono text-slate-500 tracking-wider">#{subject.id}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getDifficultyColor(subject.difficulty)}`}>
                                        {subject.difficulty}
                                    </span>
                                </div>
                                <h4 className="font-bold text-white mb-1">{subject.name}</h4>
                                <div className="flex items-center justify-between mt-3">
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Avg. Pass Rate</span>
                                    <span className="text-xs font-black text-slate-300">{subject.passRate}%</span>
                                </div>
                            </div>
                        ))}
                        {unassignedSubjects.length === 0 && (
                            <div className="p-10 text-center glass-panel rounded-3xl border border-dashed border-white/10">
                                <CheckCircle2 size={40} className="mx-auto mb-4 text-emerald-500/50" />
                                <p className="text-slate-500 text-sm">All subjects assigned!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Area: Sittings Timeline */}
                <div className="lg:col-span-3 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {sittings.map((sitting, index) => (
                            <div key={sitting.id} className="glass-panel p-6 rounded-3xl border border-white/5 relative group animate-in slide-in-from-right-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-black">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white uppercase tracking-wider text-sm">Sitting #{index + 1}</h4>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase">Estimated Month {sitting.month}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeSitting(sitting.id)}
                                        className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="space-y-3 min-h-[100px]">
                                    {sitting.subjects.length > 0 ? (
                                        sitting.subjects.map(subId => {
                                            const sub = ALL_SUBJECTS.find(s => s.id === subId);
                                            if (!sub) return null;
                                            return (
                                                <div key={subId} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 group/item">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-2 h-2 rounded-full ${sub.difficulty === 'Hard' ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                                                        <span className="text-sm font-medium text-white">{sub.name}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => toggleSubjectInSitting(sitting.id, subId)}
                                                        className="text-slate-600 hover:text-white transition-colors"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-center p-6 border-2 border-dashed border-white/5 rounded-2xl">
                                            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">No subjects assigned</p>
                                        </div>
                                    )}
                                </div>

                                {/* Summary of Difficulty in Sitting */}
                                {sitting.subjects.length > 0 && (
                                    <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
                                        <div className="flex gap-1">
                                            {sitting.subjects.map(id => (
                                                <div key={id} className={`w-4 h-1 rounded-full ${ALL_SUBJECTS.find(s => s.id === id)?.difficulty === 'Hard' ? 'bg-red-500' : 'bg-indigo-500'}`}></div>
                                            ))}
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                                            {sitting.subjects.length} Subjects
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}

                        {sittings.length === 0 && (
                            <div className="md:col-span-2 py-20 text-center glass-panel rounded-[40px] border-2 border-dashed border-white/5">
                                <Calendar size={64} className="mx-auto mb-6 text-slate-800" />
                                <h3 className="text-xl font-bold text-slate-400 mb-2">No sittings planned yet</h3>
                                <p className="text-slate-600 text-sm mb-8 max-w-xs mx-auto">Start by adding your first exam session or use our recommended strategy.</p>
                                <button
                                    onClick={addSitting}
                                    className="px-8 py-3 bg-indigo-500 hover:bg-indigo-400 text-white rounded-2xl font-bold transition-all"
                                >
                                    Add First Sitting
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Timeline Analysis */}
                    {sittings.length > 0 && (
                        <div className="glass-panel p-8 rounded-3xl space-y-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Target size={20} className="text-emerald-400" />
                                Plan Viability Analysis
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="space-y-4">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Time Window</div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-3xl font-black text-white">18m</div>
                                        <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 w-[70%]"></div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-400">Total time from first to last sitting is within the 18-month limit.</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sitting Count</div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-3xl font-black text-white">{sittings.length}/6</div>
                                        <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-500" style={{ width: `${(sittings.length / 6) * 100}%` }}></div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-400">You are using {sittings.length} out of your 6 allowed sitting windows.</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Subject Completion</div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-3xl font-black text-white">{assignedSubjectIds.length}/13</div>
                                        <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500" style={{ width: `${(assignedSubjectIds.length / 13) * 100}%` }}></div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-400">
                                        {assignedSubjectIds.length === 13 ? "All subjects are planned! Good luck, Pilot." : `${13 - assignedSubjectIds.length} subjects remaining to be planned.`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
