import React from 'react';
import { motion } from 'framer-motion';
import { View } from '../types';
import { LucideIcon, BookOpen, ChevronRight, Lock, ArrowRight } from 'lucide-react';

interface ModuleItem {
    title: string;
    desc: string;
    view?: View;
    isLocked?: boolean;
}

interface Props {
    subjectCode: string;
    subjectName: string;
    description: string;
    icon: LucideIcon;
    color: string;
    modules: ModuleItem[];
    onChangeView: (view: View) => void;
    onOpenSyllabus?: (id: string) => void;
}

const GenericSubjectDashboard: React.FC<Props> = ({
    subjectCode,
    subjectName,
    description,
    icon: Icon,
    color,
    modules,
    onChangeView,
    onOpenSyllabus
}) => {

    const getColorClasses = (c: string) => {
        const map: Record<string, string> = {
            red: 'bg-red-500',
            orange: 'bg-orange-500',
            amber: 'bg-amber-500',
            yellow: 'bg-yellow-500',
            lime: 'bg-lime-500',
            green: 'bg-green-500',
            emerald: 'bg-emerald-500',
            teal: 'bg-teal-500',
            cyan: 'bg-cyan-500',
            sky: 'bg-sky-500',
            blue: 'bg-blue-500',
            indigo: 'bg-indigo-500',
            violet: 'bg-violet-500',
            purple: 'bg-purple-500',
            pink: 'bg-pink-500',
            rose: 'bg-rose-500',
        };
        return map[color] || 'bg-blue-500';
    };

    const bgClass = getColorClasses(color);

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6">
            {/* Header section matching MetDashboard style */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-4xl md:text-5xl font-black text-white flex items-center gap-4">
                        <Icon className={`w-12 h-12 ${color === 'yellow' || color === 'amber' ? 'text-yellow-400' : 'text-white'} animate-pulse`} />
                        {subjectName}
                    </h1>

                    {onOpenSyllabus && (
                        <button
                            onClick={() => onOpenSyllabus(subjectCode)}
                            className="hidden md:flex items-center gap-2 text-slate-400 hover:text-white transition-colors border border-slate-700 hover:border-slate-500 px-4 py-2 rounded-lg"
                        >
                            <BookOpen size={16} />
                            <span className="font-bold text-sm">Syllabus</span>
                        </button>
                    )}
                </div>

                <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
                    {description}
                </p>

                {onOpenSyllabus && (
                    <button
                        onClick={() => onOpenSyllabus(subjectCode)}
                        className="md:hidden mt-4 flex items-center gap-2 text-slate-400 hover:text-white transition-colors border border-slate-700 px-4 py-2 rounded-lg w-full justify-center"
                    >
                        <BookOpen size={16} />
                        <span className="font-bold text-sm">View Syllabus</span>
                    </button>
                )}
            </motion.div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.map((mod, idx) => (
                    <motion.button
                        key={idx}
                        disabled={mod.isLocked}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => !mod.isLocked && mod.view && onChangeView(mod.view)}
                        whileHover={!mod.isLocked ? { scale: 1.02, y: -5 } : {}}
                        whileTap={!mod.isLocked ? { scale: 0.98 } : {}}
                        className={`group relative overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl p-8 text-left transition-all 
                            ${mod.isLocked
                                ? 'opacity-60 cursor-not-allowed grayscale'
                                : 'hover:border-slate-600 hover:shadow-2xl hover:shadow-blue-900/10 cursor-pointer'
                            }
                        `}
                    >
                        {/* Background Splash */}
                        <div className={`absolute top-0 right-0 w-32 h-32 ${bgClass} opacity-5 rounded-bl-full md:group-hover:opacity-10 transition-opacity`} />

                        {/* Icon Box */}
                        <div className={`w-14 h-14 rounded-2xl ${bgClass} flex items-center justify-center mb-6 shadow-lg relative`}>
                            {mod.isLocked ? <Lock className="text-white/70" size={24} /> : <BookOpen className="text-white" size={24} />}
                        </div>

                        {/* Title & Desc */}
                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                            {mod.title}
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-8 min-h-[40px]">
                            {mod.desc}
                        </p>

                        {/* Action Link */}
                        <div className={`flex items-center gap-2 text-sm font-bold ${mod.isLocked ? 'text-slate-600' : 'text-white/50 group-hover:text-white'} transition-colors`}>
                            <span>{mod.isLocked ? 'Locked' : 'Launch Module'}</span>
                            {!mod.isLocked && <ArrowRight size={16} />}
                        </div>
                    </motion.button>
                ))}

                {/* Coming Soon Placeholder */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-slate-900/30 border border-slate-800/50 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center group"
                >
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-4 group-hover:bg-slate-700 transition-colors">
                        <Icon className="text-slate-600" size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-500 mb-2">More Content Coming</h3>
                    <p className="text-sm text-slate-600 max-w-xs">
                        We are continuously adding new modules to {subjectName}.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default GenericSubjectDashboard;
