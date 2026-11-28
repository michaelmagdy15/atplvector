import React, { useEffect, useState } from 'react';
import { View } from '../types';
import { LucideIcon, BookOpen, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CockpitSixPackHub } from './hubs';
import { getSubjectRecallSpec } from '../data/subjectRecallLibrary';
import { PROGRESS_EVENT, readLessonMeta } from '../lib/lessonProgress';

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
    modules,
    onChangeView,
    onOpenSyllabus
}) => {
    const spec = getSubjectRecallSpec(subjectCode);
    const [doneIds, setDoneIds] = useState<string[]>(() => readLessonMeta().doneIds);

    useEffect(() => {
        const sync = () => setDoneIds(readLessonMeta().doneIds);
        window.addEventListener(PROGRESS_EVENT, sync);
        return () => window.removeEventListener(PROGRESS_EVENT, sync);
    }, []);

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6">
            {/* Subject Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <div className="hud-label mb-1" style={{ color: spec.accentColor }}>
                        SUBJECT {subjectCode} // EASA GROUND SCHOOL
                    </div>
                    <h1 className="font-display text-3xl md:text-4xl font-black text-ink flex items-center gap-3 tracking-tight">
                        <Icon className="w-8 h-8 shrink-0" style={{ color: spec.accentColor }} />
                        <span>{subjectName}</span>
                    </h1>
                    <p className="text-sm md:text-base text-muted max-w-2xl mt-1.5 leading-relaxed">
                        {description}
                    </p>
                </div>

                {onOpenSyllabus && (
                    <button
                        type="button"
                        onClick={() => onOpenSyllabus(subjectCode)}
                        className="inline-flex items-center gap-2 border border-line-strong bg-bg-raised hover:bg-bg-sunken text-ink px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider shrink-0 cursor-pointer"
                    >
                        <BookOpen size={15} />
                        <span>View Syllabus</span>
                    </button>
                )}
            </div>

            {/* Spatial Cockpit / 3D A320 Hub + In-One-Minute Briefing */}
            <CockpitSixPackHub subjectCode={subjectCode} onNavigate={onChangeView} />

            {/* Tactile Module Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {modules.map((mod) => {
                    const isDone = mod.view ? doneIds.includes(`topic-${mod.view}`) : false;
                    return (
                        <button
                            key={mod.view || mod.title}
                            type="button"
                            disabled={mod.isLocked}
                            onClick={() => !mod.isLocked && mod.view && onChangeView(mod.view)}
                            style={{ borderTopWidth: '3px', borderTopColor: isDone ? '#34d399' : spec.accentColor }}
                            className={`dx-card p-6 text-left flex flex-col justify-between transition-colors ${
                                mod.isLocked
                                    ? 'opacity-55 cursor-not-allowed grayscale'
                                    : 'hover:border-line-strong hover:bg-bg cursor-pointer group'
                            }`}
                        >
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-10 h-10 border border-line bg-bg-sunken flex items-center justify-center" style={{ color: spec.accentColor }}>
                                        {mod.isLocked ? <Lock size={18} /> : <BookOpen size={18} />}
                                    </div>
                                    {isDone && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold uppercase border border-emerald-500/40 bg-emerald-500/15 text-emerald-300">
                                            <CheckCircle2 size={11} /> Done
                                        </span>
                                    )}
                                </div>

                                <h3 className="font-display text-xl font-bold text-ink mb-2 group-hover:text-cad-accent transition-colors">
                                    {mod.title}
                                </h3>
                                <p className="text-muted text-xs leading-relaxed mb-6">
                                    {mod.desc}
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-line font-mono text-[11px] uppercase tracking-wider text-muted group-hover:text-ink">
                                <span>{mod.isLocked ? 'Locked' : 'Launch Module'}</span>
                                {!mod.isLocked && <ArrowRight size={14} />}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default GenericSubjectDashboard;
