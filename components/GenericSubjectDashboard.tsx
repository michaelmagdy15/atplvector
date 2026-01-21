
import React from 'react';
import { View } from '../types';
import { LucideIcon, BookOpen, ChevronRight, Lock } from 'lucide-react';

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
    color: string; // e.g., "emerald", "sky", "orange"
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

    // Helper to map color names to Tailwind classes dynamically might be tricky with JIT, 
    // so we use standard classes or a safe mapping if needed. 
    // For simplicity, we assume standard colors are safe or use style objects for specific dynamic colors.

    const getColorClasses = (c: string) => {
        const map: Record<string, { bg: string, text: string, border: string, glow: string }> = {
            red: { bg: 'bg-red-600', text: 'text-red-500', border: 'border-red-500', glow: 'shadow-red-500/20' },
            orange: { bg: 'bg-orange-600', text: 'text-orange-500', border: 'border-orange-500', glow: 'shadow-orange-500/20' },
            amber: { bg: 'bg-amber-500', text: 'text-amber-500', border: 'border-amber-500', glow: 'shadow-amber-500/20' },
            yellow: { bg: 'bg-yellow-500', text: 'text-yellow-500', border: 'border-yellow-500', glow: 'shadow-yellow-500/20' },
            lime: { bg: 'bg-lime-600', text: 'text-lime-500', border: 'border-lime-500', glow: 'shadow-lime-500/20' },
            green: { bg: 'bg-green-600', text: 'text-green-500', border: 'border-green-500', glow: 'shadow-green-500/20' },
            emerald: { bg: 'bg-emerald-600', text: 'text-emerald-500', border: 'border-emerald-500', glow: 'shadow-emerald-500/20' },
            teal: { bg: 'bg-teal-600', text: 'text-teal-500', border: 'border-teal-500', glow: 'shadow-teal-500/20' },
            cyan: { bg: 'bg-cyan-600', text: 'text-cyan-500', border: 'border-cyan-500', glow: 'shadow-cyan-500/20' },
            sky: { bg: 'bg-sky-600', text: 'text-sky-500', border: 'border-sky-500', glow: 'shadow-sky-500/20' },
            blue: { bg: 'bg-blue-600', text: 'text-blue-500', border: 'border-blue-500', glow: 'shadow-blue-500/20' },
            indigo: { bg: 'bg-indigo-600', text: 'text-indigo-500', border: 'border-indigo-500', glow: 'shadow-indigo-500/20' },
            violet: { bg: 'bg-violet-600', text: 'text-violet-500', border: 'border-violet-500', glow: 'shadow-violet-500/20' },
            purple: { bg: 'bg-purple-600', text: 'text-purple-500', border: 'border-purple-500', glow: 'shadow-purple-500/20' },
            pink: { bg: 'bg-pink-600', text: 'text-pink-500', border: 'border-pink-500', glow: 'shadow-pink-500/20' },
            rose: { bg: 'bg-rose-600', text: 'text-rose-500', border: 'border-rose-500', glow: 'shadow-rose-500/20' },
        };
        return map[color] || map['blue'];
    };

    const theme = getColorClasses(color);

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header Hero */}
            <div className={`rounded-2xl p-8 text-white shadow-xl mb-8 border border-slate-700 relative overflow-hidden bg-gradient-to-r from-slate-900 to-slate-800`}>
                <div className={`absolute top-0 left-0 w-2 h-full ${theme.bg}`}></div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className={`inline-block px-3 py-1 ${theme.bg} bg-opacity-20 ${theme.text} border ${theme.border} border-opacity-30 text-xs font-bold rounded-full mb-3`}>
                                SUBJECT {subjectCode}
                            </div>
                            <h1 className="text-4xl font-black mb-2">{subjectName}</h1>
                            <p className="text-slate-300 max-w-xl text-lg mb-6">{description}</p>
                        </div>
                        {onOpenSyllabus && (
                            <button
                                onClick={() => onOpenSyllabus(subjectCode)}
                                className={`hidden md:flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg transition-all font-bold text-sm shadow-lg`}
                            >
                                <BookOpen size={16} className={theme.text} />
                                View Syllabus
                            </button>
                        )}
                    </div>
                    {/* Mobile Button */}
                    {onOpenSyllabus && (
                        <button
                            onClick={() => onOpenSyllabus(subjectCode)}
                            className={`md:hidden w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white px-4 py-3 rounded-lg transition-all font-bold text-sm shadow-lg mb-4`}
                        >
                            <BookOpen size={16} className={theme.text} />
                            View Syllabus
                        </button>
                    )}
                </div>
                {/* Brand Watermark */}
                <div className="absolute right-[-40px] top-[-40px] w-96 h-96 opacity-[0.03] rotate-[-15deg] pointer-events-none select-none">
                    <img src="/assets/logo.png" alt="" className="w-full h-full object-contain" />
                </div>
                <Icon className="absolute right-[-20px] bottom-[-40px] w-64 h-64 text-white opacity-5 rotate-12" />
            </div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">

                {/* Available Modules */}
                {modules.map((mod, idx) => (
                    <div
                        key={idx}
                        onClick={() => !mod.isLocked && mod.view && onChangeView(mod.view)}
                        className={`bg-slate-800 p-6 rounded-xl border border-slate-700 transition-all group relative overflow-hidden
                            ${mod.isLocked ? 'opacity-70 cursor-not-allowed' : `cursor-pointer hover:border-${color}-500 hover:shadow-lg active:scale-[0.98] active:bg-slate-700/80`}
                        `}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-lg bg-slate-900 ${mod.isLocked ? 'text-slate-600' : theme.text}`}>
                                {mod.isLocked ? <Lock size={24} /> : <BookOpen size={24} />}
                            </div>
                            {mod.isLocked && <span className="text-[10px] uppercase font-bold bg-slate-700 text-slate-400 px-2 py-1 rounded">Locked</span>}
                        </div>

                        <h3 className={`text-xl font-bold text-white mb-2 ${!mod.isLocked && 'group-hover:text-blue-400'} transition-colors`}>
                            {mod.title}
                        </h3>
                        <p className="text-slate-400 text-sm mb-4 min-h-[40px]">
                            {mod.desc}
                        </p>

                        {!mod.isLocked && (
                            <div className={`flex items-center text-sm font-bold ${theme.text} group-hover:translate-x-2 transition-transform`}>
                                Launch Module <ChevronRight className="w-4 h-4 ml-1" />
                            </div>
                        )}
                    </div>
                ))}

                {/* Coming Soon Placeholder */}
                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 border-dashed flex flex-col items-center justify-center text-center min-h-[200px]">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-3">
                        <Icon className="text-slate-600" size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-500">More Coming Soon</h3>
                    <p className="text-sm text-slate-600 mt-1 max-w-xs">
                        We are continuously adding new interactive modules for {subjectName}.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default GenericSubjectDashboard;
