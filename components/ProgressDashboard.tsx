import React, { useMemo } from 'react';
import { SubjectStats, View } from '../types';
import { SUBJECTS, calculateProgress } from '../data/learningObjectives';
import { ChevronRight, Plus } from 'lucide-react';

interface ProgressDashboardProps {
    onChangeView: (view: View, subjectId?: string) => void;
    onOpenSyllabus: (subjectId: string) => void;
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ onChangeView, onOpenSyllabus }) => {

    // Calculate real-time stats
    const progressStats = useMemo(() => {
        return calculateProgress();
    }, []);

    // Merge static subject data with limits and live progress
    const enrichedSubjects = SUBJECTS.map(sub => {
        const stats = progressStats.find(s => s.id === sub.id);
        return {
            ...sub,
            percentage: stats?.percentage || 0,
            completedLOs: stats?.completedLOs || 0,
            masteredLOs: stats?.masteredLOs || 0,
        };
    });

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight mb-2">
                        Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Progress</span>
                    </h1>
                    <p className="text-slate-400 text-sm">
                        Track your ATPL theory journey across {SUBJECTS.length} subjects
                    </p>
                </div>

                <button
                    onClick={() => onChangeView(View.EXAM_PLANNER)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-sm transition-all shadow-lg shadow-emerald-900/20"
                >
                    <Plus size={16} />
                    Add Exam
                </button>
            </div>

            <div className="mb-6">
                <h2 className="text-lg font-bold text-white mb-4">All Subjects</h2>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {enrichedSubjects.map((subject) => (
                    <div
                        key={subject.id}
                        onClick={() => onOpenSyllabus(subject.id)}
                        className="group bg-slate-900/50 hover:bg-slate-800/80 border border-slate-700/50 hover:border-blue-500/30 rounded-xl p-5 cursor-pointer transition-all duration-300 relative overflow-hidden"
                    >
                        {/* Hover Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <div className="relative z-10 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                {/* Circular Progress - Mini */}
                                <div className="relative w-14 h-14 flex-shrink-0 flex items-center justify-center">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-800" />
                                        <circle
                                            cx="28" cy="28" r="24"
                                            stroke="currentColor" strokeWidth="4"
                                            fill="transparent"
                                            className={`${subject.percentage > 0 ? 'text-blue-500' : 'text-slate-700'} transition-all duration-1000 ease-out`}
                                            strokeDasharray={2 * Math.PI * 24}
                                            strokeDashoffset={2 * Math.PI * 24 * (1 - subject.percentage / 100)}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <span className="absolute text-[10px] font-bold text-white">
                                        {subject.percentage}%
                                    </span>
                                </div>

                                <div>
                                    <div className="text-[10px] font-mono text-blue-400 mb-0.5">{subject.id}</div>
                                    <h3 className="font-bold text-white text-base leading-tight mb-1 max-w-[200px] md:max-w-xs">
                                        {subject.name}
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        <span className="text-slate-300">{subject.completedLOs}</span>/{subject.totalLOs} Learning Objectives completed
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                                <ChevronRight size={18} className="text-slate-600 group-hover:text-white transition-colors" />
                                <div className="mt-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-blue-400 transition-colors">
                                    Mastery <span className="ml-1 text-slate-300">0%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 flex justify-end text-xs text-slate-600">
                13 subjects
            </div>
        </div>
    );
};

export default ProgressDashboard;
