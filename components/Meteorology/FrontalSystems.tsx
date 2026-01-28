import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudLightning, Info } from 'lucide-react';

import WarmFront2D from './vis/WarmFront2D';
import ColdFront2D from './vis/ColdFront2D';
import OccludedFront2D from './vis/OccludedFront2D';
import LessonCard from '../ui/LessonCard';

const FrontalSystems: React.FC = () => {
    const [frontType, setFrontType] = useState<'cold' | 'warm' | 'occluded'>('cold');

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 min-h-screen">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h2 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3">
                        <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
                            <CloudLightning className="text-indigo-400" size={32} />
                        </div>
                        Weather Fronts
                        <span className="text-sm font-bold bg-indigo-600 px-3 py-1 rounded-full text-white tracking-wide ml-2">PART 3</span>
                    </h2>
                    <p className="text-slate-400 mt-3 max-w-2xl text-lg font-light leading-relaxed">
                        Visually immersive animated diagrams showing frontal boundaries and associated weather phenomena.
                    </p>
                </div>

                {/* Tab Selector */}
                <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md shadow-2xl overflow-x-auto">
                    {[
                        { id: 'cold', label: 'Cold Front', color: 'blue' },
                        { id: 'warm', label: 'Warm Front', color: 'red' },
                        { id: 'occluded', label: 'Occluded', color: 'purple' }
                    ].map((f) => (
                        <button
                            key={f.id}
                            onClick={() => setFrontType(f.id as any)}
                            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 relative whitespace-nowrap ${frontType === f.id
                                ? `bg-${f.color}-600 text-white shadow-lg`
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                            style={{
                                backgroundColor: frontType === f.id ? (f.id === 'cold' ? '#2563eb' : f.id === 'warm' ? '#dc2626' : '#9333ea') : 'transparent'
                            }}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

                {/* Visualization Area */}
                <div className="h-[400px] md:h-[500px] bg-slate-950 rounded-[2.5rem] border border-slate-800 relative overflow-hidden shadow-2xl group">
                    <div className="absolute top-4 left-6 z-10 pointer-events-none">
                        <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                            Visual Diagram
                        </h3>
                        <p className="text-slate-500 text-xs font-mono uppercase tracking-widest mt-1">
                            Animated for performance
                        </p>
                    </div>

                    <div className="w-full h-full">
                        <AnimatePresence mode="wait">
                            {frontType === 'warm' && (
                                <motion.div
                                    key="warm-vis"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    className="w-full h-full"
                                >
                                    <WarmFront2D />
                                </motion.div>
                            )}
                            {frontType === 'cold' && (
                                <motion.div
                                    key="cold-vis"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    className="w-full h-full"
                                >
                                    <ColdFront2D />
                                </motion.div>
                            )}
                            {frontType === 'occluded' && (
                                <motion.div
                                    key="occluded-vis"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    className="w-full h-full"
                                >
                                    <OccludedFront2D />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Overlay Helper */}
                    <div className="absolute bottom-6 right-6 flex gap-2">
                        <div className="bg-slate-900/80 backdrop-blur text-xs font-bold text-slate-300 px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div> Cold Air
                        </div>
                        <div className="bg-slate-900/80 backdrop-blur text-xs font-bold text-slate-300 px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div> Warm Air
                        </div>
                    </div>
                </div>

                {/* Information Cards (LessonCard) */}
                <div className="space-y-6">
                    <AnimatePresence mode="wait">
                        {frontType === 'cold' && (
                            <LessonCard
                                key="cold-card"
                                title="Cold Front"
                                description="Cold, dense air aggressively undercuts warm air, forcing it to rise rapidly. This steep learning curve creates shorter but more intense weather events."
                                examTip="For Exams: Slope 1:50 • Speed 25-50 kts • Backs then Veers"
                                tags={['Unstable Air', 'Cumuliform Clouds', 'Showers / TS', 'Gusty Winds', 'Good Vis (excl. precip)']}
                                colorTheme="blue"
                            />
                        )}
                        {frontType === 'warm' && (
                            <LessonCard
                                key="warm-card"
                                title="Warm Front"
                                description="Warm air gradually slides over a retreating cold air mass. The shallow slope creates extensive cloud layers and prolonged, steady precipitation well ahead of the surface front."
                                examTip="For Exams: Slope 1:150 • Speed < 15 kts • Gradual Onset"
                                tags={['Stable Air', 'Stratiform Clouds', 'Continuous Rain', 'Low Ceiling', 'Poor Visibility']}
                                colorTheme="red"
                            />
                        )}
                        {frontType === 'occluded' && (
                            <LessonCard
                                key="occluded-card"
                                title="Occluded Front"
                                description="Occurs when a fast-moving cold front catches up to a warm front, lifting the warm sector completely off the ground. It combines characteristics of both front types."
                                examTip="Exam Tip: 'Trowal' (Trough of Warm Air Aloft) • Associated with mature depressions."
                                tags={['Mixed Clouds (Cb + Ns)', 'Prolonged Precip', 'Variable Winds', 'Embedded TS']}
                                colorTheme="purple"
                            />
                        )}
                    </AnimatePresence>

                    {/* Additional Static Info */}
                    <div className="bg-slate-800/30 rounded-2xl p-6 border border-white/5 flex items-start gap-4">
                        <Info className="text-slate-400 shrink-0" />
                        <div>
                            <h4 className="text-white font-bold text-sm mb-1">Observation Note</h4>
                            <p className="text-slate-400 text-sm">
                                Observe the frontal slopes. The Cold Front is much steeper than the Warm Front, leading to more explosive vertical development in the clouds.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default FrontalSystems;

