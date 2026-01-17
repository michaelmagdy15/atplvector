import React from 'react';
import { TestResult, TopicResult } from '../types';
import { Home, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';

interface ResultsProps {
    result: TestResult;
    onHome: () => void;
}

export const QB_Results: React.FC<ResultsProps> = ({ result, onHome }) => {
    const percentage = Math.round((result.score / result.totalQuestions) * 100);

    // Sort topics by performance (lowest first)
    const sortedTopics = [...result.topicBreakdown].sort((a, b) => {
        const scoreA = a.total > 0 ? a.correct / a.total : 0;
        const scoreB = b.total > 0 ? b.correct / b.total : 0;
        return scoreA - scoreB;
    });

    const weakAreas = sortedTopics.filter(t => (t.correct / t.total) < 0.75).slice(0, 3);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}m ${s}s`;
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">

            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-white">Session Complete</h2>
                <p className="text-slate-400">Here's how you performed</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Score Card */}
                <div className="md:col-span-1 glass-panel p-8 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden">
                    <div className={`absolute inset-0 opacity-20 ${percentage >= 75 ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                    <div className="relative z-10 text-center">
                        <div className="text-6xl font-black text-white mb-2">{percentage}%</div>
                        <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold uppercase ${percentage >= 75 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                            {percentage >= 75 ? 'PASS' : 'FAIL'}
                        </div>
                        <div className="mt-4 text-slate-400 text-sm">
                            {result.score} / {result.totalQuestions} Correct
                        </div>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                    <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                        <div className="p-3 bg-blue-500/10 text-blue-400 rounded-full mb-3">
                            <RefreshCw size={24} />
                        </div>
                        <div className="text-2xl font-bold text-white">{formatTime(result.timeSpent)}</div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider">Time Taken</div>
                    </div>
                    <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                        <div className="p-3 bg-purple-500/10 text-purple-400 rounded-full mb-3">
                            <CheckCircle size={24} />
                        </div>
                        <div className="text-2xl font-bold text-white">
                            {Math.round((result.timeSpent / result.totalQuestions))}s
                        </div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider">Avg Time / Question</div>
                    </div>
                </div>
            </div>

            {/* Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-panel p-6 rounded-3xl space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <AlertTriangle size={20} className="text-red-400" />
                        Areas for Improvement
                    </h3>
                    <div className="space-y-3">
                        {weakAreas.length > 0 ? weakAreas.map(topic => (
                            <div key={topic.topicId} className="bg-slate-800/50 p-4 rounded-xl border-l-4 border-red-500">
                                <div className="font-medium text-white mb-1">{topic.title}</div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-red-400 font-bold">{Math.round((topic.correct / topic.total) * 100)}%</span>
                                    <span className="text-slate-500">{topic.correct}/{topic.total} Correct</span>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-8 text-slate-500">
                                <CheckCircle size={40} className="mx-auto mb-2 text-emerald-500/50" />
                                Great job! No significant weak areas detected.
                            </div>
                        )}
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-3xl space-y-4">
                    <h3 className="text-lg font-bold text-white">Topic Breakdown</h3>
                    <div className="space-y-4 overflow-y-auto max-h-[300px] custom-scrollbar pr-2">
                        {sortedTopics.map(topic => {
                            const p = Math.round((topic.total > 0 ? topic.correct / topic.total : 0) * 100);
                            return (
                                <div key={topic.topicId}>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-slate-300 truncate max-w-[200px]" title={topic.title}>{topic.title}</span>
                                        <span className={p >= 75 ? "text-emerald-400" : "text-amber-400"}>{p}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${p >= 75 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                            style={{ width: `${p}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="flex justify-center pt-8">
                <button
                    onClick={onHome}
                    className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold flex items-center gap-2 transition-all hover:scale-105"
                >
                    <Home size={20} />
                    Back to Dashboard
                </button>
            </div>

        </div>
    );
};
