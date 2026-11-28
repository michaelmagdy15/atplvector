import React, { useEffect, useState } from 'react';
import { PlaneTakeoff, Plane, PlaneLanding, TrendingUp, BookOpen, Layers, Target, CheckCircle2, ArrowRight } from 'lucide-react';
import { View } from '../../types';
import { CockpitSixPackHub } from '../hubs';
import { PROGRESS_EVENT, readLessonMeta } from '../../lib/lessonProgress';

interface Props {
    currentView?: View;
    setCurrentView?: (view: View) => void;
    onChangeView?: (view: View) => void;
    onNavigate?: (view: View) => void;
}

export const PerfDashboard: React.FC<Props> = ({ setCurrentView, onChangeView, onNavigate }) => {
    const handleSelectView = (view: View) => {
        if (onChangeView) return onChangeView(view);
        if (setCurrentView) return setCurrentView(view);
        if (onNavigate) return onNavigate(view);
    };

    const [doneIds, setDoneIds] = useState<string[]>(() => readLessonMeta().doneIds);
    useEffect(() => {
        const sync = () => setDoneIds(readLessonMeta().doneIds);
        window.addEventListener(PROGRESS_EVENT, sync);
        return () => window.removeEventListener(PROGRESS_EVENT, sync);
    }, []);

    const categories = [
        {
            title: "Introduction to Performance",
            description: "Basic concepts, definitions, speeds (V1, Vr, V2, etc.), and atmospheric effects.",
            icon: <BookOpen className="text-sky-400" size={20} />,
            view: View.PERF_INTRO,
            badge: "CORE DEFINITIONS",
        },
        {
            title: "Take-off Performance (3D Story)",
            description: "Interactive 3D A320 RWY 27L roll, Stopway/Clearway limits, Balanced V1 & 3-Column RTOM.",
            icon: <PlaneTakeoff className="text-pink-400" size={20} />,
            view: View.PERF_TAKEOFF,
            badge: "v2 3D ENGINE",
        },
        {
            title: "Climb Performance",
            description: "Climb gradients, Vx vs Vy, engine-out climb segments, and obstacle clearance planes.",
            icon: <TrendingUp className="text-indigo-400" size={20} />,
            view: View.PERF_CLIMB,
            badge: "SEGMENTS 1–4",
        },
        {
            title: "Cruise Performance",
            description: "Maximum range vs endurance speeds, step climbs, drift down procedures.",
            icon: <Plane className="text-cyan-400" size={20} />,
            view: View.PERF_CRUISE,
            badge: "VMD / LRC / MRC",
        },
        {
            title: "Landing Performance",
            description: "LDA, LDR factoring (1.67× / 1.92×), contaminated runways, and approach climb.",
            icon: <PlaneLanding className="text-amber-400" size={20} />,
            view: View.PERF_LANDING,
            badge: "DRY & WET LDR",
        },
        {
            title: "Class A (Multi-Engine Jets)",
            description: "CS-25 requirements, net flight paths, gross flight paths, and engine-out operations.",
            icon: <Layers className="text-rose-400" size={20} />,
            view: View.PERF_CLASS_A,
            badge: "CS-25",
        },
        {
            title: "Class B (Single/Multi-Engine Props)",
            description: "CS-23 requirements, short field operations, and unpaved runway corrections.",
            icon: <Target className="text-emerald-400" size={20} />,
            view: View.PERF_CLASS_B,
            badge: "CS-23",
        }
    ];

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
            <div>
                <div className="hud-label text-pink-400 mb-1">SUBJECT 032 // CS-23 & CS-25</div>
                <h1 className="font-display text-3xl md:text-4xl font-black text-ink tracking-tight">
                    Aircraft Performance
                </h1>
                <p className="text-muted text-sm md:text-base mt-1">
                    Calculate and visualize take-off margins, climb segments, balanced V1, and landing factors.
                </p>
            </div>

            <CockpitSixPackHub subjectCode="032" onNavigate={handleSelectView} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category, index) => {
                    const isDone = doneIds.includes(`topic-${category.view}`);
                    return (
                        <button
                            key={index}
                            type="button"
                            onClick={() => handleSelectView(category.view)}
                            style={{ borderTopWidth: '3px', borderTopColor: isDone ? '#34d399' : 'var(--subj-perf)' }}
                            className="dx-card flex flex-col justify-between text-left p-6 hover:border-line-strong hover:bg-bg transition-colors group cursor-pointer"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-10 h-10 border border-line bg-bg-sunken flex items-center justify-center">
                                        {category.icon}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        {isDone && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold uppercase border border-emerald-500/40 bg-emerald-500/15 text-emerald-300">
                                                <CheckCircle2 size={11} /> Done
                                            </span>
                                        )}
                                        <span className="font-mono text-[10px] px-2 py-0.5 border border-line bg-bg text-muted">
                                            {category.badge}
                                        </span>
                                    </div>
                                </div>
                                <h3 className="font-display font-bold text-lg text-ink mb-2 group-hover:text-cad-accent transition-colors">
                                    {category.title}
                                </h3>
                                <p className="text-xs text-muted mb-6 leading-relaxed">
                                    {category.description}
                                </p>
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t border-line font-mono text-[11px] uppercase tracking-wider text-muted group-hover:text-ink">
                                <span>Launch Simulator</span>
                                <ArrowRight size={14} />
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default PerfDashboard;
