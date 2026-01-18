import React, { useEffect, useState } from 'react';
import { Play, RotateCcw, TrendingUp, Clock, BookOpen, AlertCircle, Trash2, ShieldCheck, Target, Zap, Calendar } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { SavedTest, QBStats } from '../types';
import { QBStorage } from '../lib/qb_storage';

interface DashboardProps {
    onStartNew: () => void;
    onResume: (test: SavedTest) => void;
    onOpenPlanner: () => void;
}

export const QB_Dashboard: React.FC<DashboardProps> = ({ onStartNew, onResume, onOpenPlanner }) => {
    const [stats, setStats] = useState<QBStats | null>(null);
    const [savedTests, setSavedTests] = useState<SavedTest[]>([]);

    useEffect(() => {
        setStats(QBStorage.getStats());
        setSavedTests(QBStorage.getSavedTests());
    }, []);

    const subjectProficiency = [
        { subject: 'Law', score: 85 },
        { subject: 'POF', score: 65 },
        { subject: 'Ops', score: 90 },
        { subject: 'Met', score: 70 },
        { subject: 'Nav', score: 60 },
        { subject: 'Comms', score: 95 },
    ]; // Placeholder - will link to real stats soon

    const bankCoverage = stats ? Math.min(100, Math.round((stats.seenQuestionIds?.length / 1000) * 100)) : 0; // Assuming 1000 questions total for now

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this session?')) {
            QBStorage.deleteTest(id);
            setSavedTests(QBStorage.getSavedTests());
        }
    };

    const formatDate = (iso: string) => {
        return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">

            {/* Header & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-3 glass-panel p-6 rounded-3xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2">Welcome back, Pilot</h2>
                            <p className="text-slate-400">Ready to sharpen your knowledge? Continue where you left off or start a fresh challenge.</p>
                        </div>

                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={onStartNew}
                                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
                            >
                                <Play size={20} fill="currentColor" />
                                Start New Test
                            </button>
                            <button
                                onClick={onOpenPlanner}
                                className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
                            >
                                <Calendar size={20} className="text-indigo-400" />
                                Exam Planner
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Stats Cards */}
                <div className="md:col-span-1 glass-panel p-6 rounded-3xl flex flex-col justify-center space-y-4">
                    <div className="flex items-center gap-3 text-slate-400">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                            <TrendingUp size={20} />
                        </div>
                        <span className="text-sm font-medium">Average Score</span>
                    </div>
                    <div className="text-4xl font-black text-white">
                        {stats ? Math.round(stats.averageScore) : 0}%
                    </div>
                    <div className="text-xs text-slate-500">
                        Based on {stats?.totalTestsCompleted || 0} completed tests
                    </div>
                </div>

                {/* Bank Coverage Card */}
                <div className="glass-panel p-6 rounded-3xl flex flex-col justify-center space-y-4 border-blue-500/20 shadow-lg shadow-blue-500/5 relative overflow-hidden group">
                    <div className="flex items-center gap-3 text-slate-400">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                            <ShieldCheck size={20} />
                        </div>
                        <span className="text-sm font-medium">Bank Coverage</span>
                    </div>
                    <div className="text-4xl font-black text-white">
                        {bankCoverage}%
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${bankCoverage}%` }}></div>
                    </div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold">
                        {stats?.seenQuestionIds?.length || 0} / 1000 Questions seen
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Performance Visualizer */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Target size={20} className="text-blue-400" />
                        Proficiency Analysis
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="glass-panel p-6 rounded-3xl h-[350px]">
                            <h4 className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-wider">Subject Mastery</h4>
                            <ResponsiveContainer width="100%" height="80%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={subjectProficiency}>
                                    <PolarGrid stroke="#334155" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                    <Radar
                                        name="Proficiency"
                                        dataKey="score"
                                        stroke="#3b82f6"
                                        fill="#3b82f6"
                                        fillOpacity={0.5}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="glass-panel p-6 rounded-3xl h-[350px] flex flex-col">
                            <h4 className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-wider">Score History</h4>
                            <div className="flex-1 flex items-end justify-between gap-2">
                                {stats && stats.scoreHistory.length > 0 ? (
                                    stats.scoreHistory.slice(-10).map((entry, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                            <div
                                                className={`w-full rounded-t-lg transition-all duration-500 hover:opacity-80 relative group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] ${entry.type === 'exam' ? 'bg-purple-500' : 'bg-blue-500'}`}
                                                style={{ height: `${entry.score}%` }}
                                            >
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                                    {entry.score}%
                                                </div>
                                            </div>
                                            <div className="text-[10px] text-slate-500 rotate-45 origin-left -translate-y-1">
                                                {new Date(entry.date).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="w-full text-center text-slate-600 self-center italic">No data yet</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Saved Sessions & Hot Topics */}
                <div className="space-y-6">
                    {/* Hot Topics (Weak areas) */}
                    <div className="glass-panel p-6 rounded-3xl border border-amber-500/20 bg-amber-500/5">
                        <h3 className="text-sm font-bold text-amber-400 mb-4 flex items-center gap-2 uppercase tracking-wider">
                            <Zap size={16} />
                            Weak Areas (Hot Topics)
                        </h3>
                        {stats && stats.incorrectQuestionIds.length > 0 ? (
                            <div className="space-y-3">
                                <p className="text-xs text-slate-400">You have {stats.incorrectQuestionIds.length} questions to retest. Focus on these topics:</p>
                                <button
                                    onClick={onStartNew}
                                    className="w-full py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded-xl text-xs font-bold transition-all"
                                >
                                    Review All Mistakes
                                </button>
                            </div>
                        ) : (
                            <p className="text-xs text-slate-500 italic">No weak areas identified yet. Keep practicing!</p>
                        )}
                    </div>

                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Clock size={20} className="text-amber-400" />
                        Resume Session
                    </h3>

                    <div className="space-y-3">
                        {savedTests.length === 0 ? (
                            <div className="p-6 text-center text-slate-500 glass-panel rounded-2xl">
                                <p>No saved sessions found.</p>
                            </div>
                        ) : (
                            savedTests.map(test => (
                                <div
                                    key={test.id}
                                    onClick={() => onResume(test)}
                                    className="glass-panel p-4 rounded-xl border border-white/5 hover:bg-white/5 cursor-pointer group transition-all relative"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${test.mode === 'exam' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'}`}>
                                            {test.mode}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-slate-500">
                                                {formatDate(test.lastResumedAt)}
                                            </span>
                                            <button
                                                onClick={(e) => handleDelete(test.id, e)}
                                                className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </div>

                                    <h4 className="font-bold text-white text-sm mb-1 truncate pr-4">{test.name}</h4>

                                    <div className="flex items-center justify-between text-xs text-slate-400">
                                        <span>{test.questionIds.length} Questions</span>
                                        <div className="flex items-center gap-1">
                                            <span className={test.score >= 75 ? "text-emerald-400" : "text-amber-400"}>
                                                {Math.round((test.score / test.questionIds.length) * 100)}%
                                            </span>
                                            <span>Complete</span>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="w-full h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500"
                                            style={{ width: `${(test.currentIndex / test.questionIds.length) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};
