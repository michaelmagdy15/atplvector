import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen,
    CheckCircle2,
    ChevronRight,
    Target,
    Award,
    AlertCircle,
    HelpCircle,
    RotateCcw
} from 'lucide-react';
import { KSA_COMPETENCIES, KSA_GRADING_SCALE, KSACompetency } from '../../data/ksaCompetencies';

type Mode = 'study' | 'assessment';

const KSACoreCompetencies: React.FC = () => {
    const [mode, setMode] = useState<Mode>('study');
    const [selectedCompetency, setSelectedCompetency] = useState<KSACompetency | null>(null);
    const [checkedIndicators, setCheckedIndicators] = useState<Record<string, string[]>>({});

    const toggleIndicator = (compId: string, indicator: string) => {
        setCheckedIndicators(prev => {
            const current = prev[compId] || [];
            const newIndicators = current.includes(indicator)
                ? current.filter(i => i !== indicator)
                : [...current, indicator];
            return { ...prev, [compId]: newIndicators };
        });
    };

    const getCompetencyGrade = (compId: string, totalIndicators: number) => {
        const checkedCount = (checkedIndicators[compId] || []).length;
        const percentage = (checkedCount / totalIndicators) * 100;

        // Logic based on the "35% Satisfactory" rule from the document
        // 5 - Excellent (90%+)
        // 4 - Very Good (75%+)
        // 3 - Good (55%+)
        // 2 - Fair (35%+)
        // 1 - Retraining (<35%)

        if (percentage >= 90) return KSA_GRADING_SCALE.find(g => g.value === 5);
        if (percentage >= 75) return KSA_GRADING_SCALE.find(g => g.value === 4);
        if (percentage >= 55) return KSA_GRADING_SCALE.find(g => g.value === 3);
        if (percentage >= 35) return KSA_GRADING_SCALE.find(g => g.value === 2);
        return KSA_GRADING_SCALE.find(g => g.value === 1);
    };

    const resetAssessment = () => {
        if (window.confirm('Reset all progress?')) {
            setCheckedIndicators({});
        }
    };

    return (
        <div className="h-full flex flex-col space-y-6 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h2 className="text-2xl font-bold font-mono text-white flex items-center gap-3">
                        <Target className="w-8 h-8 text-indigo-400" />
                        Area 100 KSA Competencies
                    </h2>
                    <p className="text-slate-400 mt-1">
                        Instruction and Assessment Performance Indicators
                    </p>
                </div>

                <div className="flex bg-slate-800/50 p-1 rounded-lg border border-slate-700">
                    <button
                        onClick={() => setMode('study')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${mode === 'study'
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        <BookOpen className="w-4 h-4" />
                        Study Mode
                    </button>
                    <button
                        onClick={() => setMode('assessment')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${mode === 'assessment'
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        Self Assessment
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-8 pb-12 custom-scrollbar">

                {mode === 'assessment' && (
                    <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-indigo-500/20 rounded-full shrink-0">
                                <HelpCircle className="w-6 h-6 text-indigo-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-white mb-2">Assessment Guidelines</h3>
                                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                                    To achieve a <span className="text-yellow-400 font-bold">Satisfactory (2 - Fair)</span> standard,
                                    you must demonstrate at least <span className="text-white font-bold">35%</span> of the indicators for a competency.
                                    Select the indicators you have demonstrated in your exercises to calculate your estimated grade.
                                </p>
                                <button
                                    onClick={resetAssessment}
                                    className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
                                >
                                    <RotateCcw className="w-3 h-3" />
                                    Reset Evaluation
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {KSA_COMPETENCIES.map((comp) => {
                        const grade = getCompetencyGrade(comp.id, comp.indicators.length);
                        const isAssessed = (checkedIndicators[comp.id] || []).length > 0;

                        return (
                            <motion.div
                                key={comp.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`group relative bg-slate-900 border ${mode === 'assessment' && isAssessed && grade?.value! >= 2
                                        ? 'border-green-500/30 shadow-green-900/10'
                                        : 'border-slate-800 hover:border-indigo-500/30'
                                    } rounded-xl overflow-hidden transition-all duration-300 shadow-xl`}
                            >
                                {/* Access Decorator */}
                                <div className="absolute top-0 right-0 p-4 opacity-50 font-mono text-xs font-bold text-slate-600">
                                    {comp.id}
                                </div>

                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-slate-100 pr-12 mb-2 group-hover:text-indigo-400 transition-colors">
                                        {comp.name}
                                    </h3>
                                    <p className="text-slate-400 text-sm italic mb-6 border-l-2 border-indigo-500/30 pl-3">
                                        "{comp.description}"
                                    </p>

                                    {mode === 'assessment' && (
                                        <div className="mb-6 flex items-center justify-between bg-slate-950/50 rounded-lg p-3 border border-slate-800">
                                            <div className="text-xs font-mono text-slate-400">
                                                SCORE: <span className="text-white text-base ml-1">
                                                    {(checkedIndicators[comp.id] || []).length}
                                                </span>
                                                <span className="text-slate-600">/{comp.indicators.length}</span>
                                            </div>

                                            {isAssessed && grade && (
                                                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-slate-900 ${grade.color}`}>
                                                    <Award className="w-3 h-3" />
                                                    {grade.label.toUpperCase()}
                                                </div>
                                            )}

                                            {!isAssessed && (
                                                <span className="text-xs text-slate-600 font-mono">NOT STARTED</span>
                                            )}
                                        </div>
                                    )}

                                    <div className="space-y-3">
                                        {comp.indicators.map((indicator, idx) => {
                                            const isChecked = (checkedIndicators[comp.id] || []).includes(indicator);

                                            return (
                                                <div
                                                    key={idx}
                                                    onClick={() => mode === 'assessment' && toggleIndicator(comp.id, indicator)}
                                                    className={`
                                                        relative pl-8 pr-4 py-3 rounded-lg text-sm transition-all cursor-pointer
                                                        ${mode === 'assessment'
                                                            ? isChecked
                                                                ? 'bg-indigo-500/10 text-indigo-200 border-l-2 border-indigo-500'
                                                                : 'bg-slate-800/30 text-slate-400 hover:bg-slate-800 border-l-2 border-transparent'
                                                            : 'bg-slate-800/30 text-slate-300 border-l-2 border-slate-700'
                                                        }
                                                    `}
                                                >
                                                    <div className={`
                                                        absolute left-2.5 top-3.5 w-3 h-3 rounded-full border transition-colors
                                                        ${mode === 'assessment'
                                                            ? isChecked ? 'bg-indigo-500 border-indigo-500' : 'border-slate-600'
                                                            : 'bg-slate-600 border-slate-600'
                                                        }
                                                    `} />
                                                    {indicator}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Grading Reference Footer */}
                <div className="mt-12 border-t border-slate-800 pt-8">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Award className="w-5 h-5 text-indigo-400" />
                        Grading Standards
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {KSA_GRADING_SCALE.map((grade) => (
                            <div key={grade.value} className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                                <div className={`inline-block px-2 py-1 rounded text-xs font-bold text-slate-900 mb-2 ${grade.color}`}>
                                    LEVEL {grade.value}
                                </div>
                                <div className="font-bold text-slate-200 mb-2">{grade.label}</div>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    {grade.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KSACoreCompetencies;
