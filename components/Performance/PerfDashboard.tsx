import React from 'react';
import { PlaneTakeoff, Plane, PlaneLanding, TrendingUp, BookOpen, Layers, Target, Scale, Wind } from 'lucide-react';
import { View } from '../../types';

interface Props {
    currentView: View;
    setCurrentView: (view: View) => void;
}

export const PerfDashboard: React.FC<Props> = ({ setCurrentView }) => {
    const categories = [
        {
            title: "Introduction to Performance",
            description: "Basic concepts, definitions, speeds (V1, Vr, V2, etc.), and atmospheric effects.",
            icon: <BookOpen className="text-blue-500" size={24} />,
            view: View.PERF_INTRO,
            stats: "0/5 Topics",
        },
        {
            title: "Take-off Performance",
            description: "Field length requirements, unbalanced fields, stopways, clearways, and obstacle clearance.",
            icon: <PlaneTakeoff className="text-emerald-500" size={24} />,
            view: View.PERF_TAKEOFF,
            stats: "0/8 Topics",
        },
        {
            title: "Climb Performance",
            description: "Climb gradients, Vx vs Vy, engine-out climb segments, and obstacle clearance planes.",
            icon: <TrendingUp className="text-indigo-500" size={24} />,
            view: View.PERF_CLIMB,
            stats: "0/6 Topics",
        },
        {
            title: "Cruise Performance",
            description: "Maximum range vs endurance speeds, step climbs, drift down procedures.",
            icon: <Plane className="text-sky-500" size={24} />,
            view: View.PERF_CRUISE,
            stats: "0/6 Topics",
        },
        {
            title: "Landing Performance",
            description: "LDA, LDR, factoring, contaminated runways, and approach climb requirements.",
            icon: <PlaneLanding className="text-amber-500" size={24} />,
            view: View.PERF_LANDING,
            stats: "0/5 Topics",
        },
        {
            title: "Class A (Multi-Engine Jets)",
            description: "CS-25 requirements, net flight paths, gross flight paths, and engine-out operations.",
            icon: <Layers className="text-rose-500" size={24} />,
            view: View.PERF_CLASS_A,
            stats: "0/7 Topics",
        },
        {
            title: "Class B (Single/Multi-Engine Props)",
            description: "CS-23 requirements, short field operations, and unpaved runway corrections.",
            icon: <Target className="text-emerald-600" size={24} />,
            view: View.PERF_CLASS_B,
            stats: "0/4 Topics",
        }
    ];

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <div className="bg-rose-100 dark:bg-rose-900/50 p-4 rounded-full">
                    <TrendingUp className="text-rose-600 dark:text-rose-400" size={40} />
                </div>
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Aircraft Performance</h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg mt-1">032 - Calculate and optimize standard flight phases</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentView(category.view)}
                        className="flex flex-col text-left p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110">
                            {category.icon}
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800 w-12 h-12 rounded-lg flex items-center justify-center mb-4 border border-slate-100 dark:border-slate-700">
                            {category.icon}
                        </div>
                        <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2">{category.title}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 flex-grow">
                            {category.description}
                        </p>
                        <div className="flex items-center justify-between w-full mt-auto">
                            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                {category.stats}
                            </span>
                            <span className="text-blue-600 dark:text-blue-400 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                Explore <TrendingUp size={14} />
                            </span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PerfDashboard;
