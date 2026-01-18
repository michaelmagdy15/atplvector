import React from 'react';
import { Play, Wind, Info, ArrowRight } from 'lucide-react';
import { View } from '../types';

interface Props {
    onChangeView: (view: View) => void;
}

const ConceptLab: React.FC<Props> = ({ onChangeView }) => {
    const concepts = [
        {
            id: 'forces-of-flight',
            title: "The 4 Forces",
            subject: "Principles of Flight",
            description: "Understand the relationship between Lift, Weight, Thrust, and Drag in various flight attitudes.",
            icon: <Wind className="text-blue-400" size={32} />,
            color: "from-blue-500/20 to-indigo-500/20",
            targetView: View.CONCEPT_FORCES_OF_FLIGHT,
            difficulty: "Fundamental"
        },
        // Future concepts...
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen">
            <header className="mb-12">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
                        <Play className="text-indigo-400 fill-indigo-400" size={24} />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight">Visual Concept Lab</h1>
                </div>
                <p className="text-lg text-slate-400 max-w-2xl">
                    Interactive 3D simulations to build intuitive understanding.
                    Manipulate variables in real-time and observe the aerodynamic consequences.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {concepts.map((concept) => (
                    <div
                        key={concept.id}
                        onClick={() => onChangeView(concept.targetView)} // Use specific view enum
                        className="group relative overflow-hidden bg-slate-900 border border-white/10 rounded-2xl hover:border-indigo-500/50 transition-all duration-300 cursor-pointer hover:-translate-y-1 shadow-2xl shadow-black/50"
                    >
                        {/* Background Gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${concept.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                        <div className="relative p-6 h-full flex flex-col">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-slate-800 rounded-xl border border-white/5 group-hover:border-white/20 transition-colors">
                                    {concept.icon}
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/5 px-2 py-1 rounded text-slate-400">
                                    {concept.difficulty}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-100 transition-colors">
                                {concept.title}
                            </h3>
                            <p className="text-sm text-slate-400 mb-6 flex-grow">
                                {concept.description}
                            </p>

                            <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold uppercase tracking-wider group-hover:gap-3 transition-all">
                                Launch Simulation <ArrowRight size={16} />
                            </div>
                        </div>
                    </div>
                ))}

                {/* Coming Soon Card */}
                <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center opacity-50 border-dashed">
                    <Info size={32} className="text-slate-600 mb-4" />
                    <h3 className="text-slate-500 font-bold">More Coming Soon</h3>
                    <p className="text-xs text-slate-600 mt-2">New simulations added weekly</p>
                </div>
            </div>
        </div>
    );
};

export default ConceptLab;
