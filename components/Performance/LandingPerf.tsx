import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlaneLanding, ShieldAlert, ArrowRight, XCircle } from 'lucide-react';

export const LandingPerf = () => {
    const [condition, setCondition] = useState<'dry' | 'wet' | 'contaminated'>('dry');

    // Simulate stopping distances. Dry = baseline 50%. Wet = 15% more. Contaminated = 40% more.
    const baseDistance = 50;
    let actualDistance = baseDistance;
    if (condition === 'wet') actualDistance *= 1.15;
    if (condition === 'contaminated') actualDistance *= 1.40;

    // Regulatory Factors for jet (Class A): LDR at destination must be <= 60% of LDA (Dry)
    // Means LDA must be at least LDR / 0.6 = 1.67 * LDR
    const regulatoryLda = baseDistance * 1.67;

    const overran = actualDistance > regulatoryLda;

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <div className="bg-amber-100 dark:bg-amber-900/50 p-3 rounded-full">
                    <PlaneLanding className="text-amber-600 dark:text-amber-400" size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Landing Performance</h1>
                    <p className="text-slate-600 dark:text-slate-400">LDA, LDR, and Runway Conditions</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Visualizer Panel */}
                <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">

                    {/* The Runway Environment */}
                    <div className="absolute bottom-20 left-10 right-10 h-16 flex relative">

                        {/* Approach path visual */}
                        <div className="absolute -left-10 bottom-[150%] w-48 border-b-2 border-dashed border-sky-400 transform origin-bottom-right -rotate-[3deg]"></div>

                        {/* Screen Height Marker (50 ft) */}
                        <div className="absolute left-0 bottom-full h-8 border-l border-slate-400 flex items-center">
                            <span className="text-[10px] text-slate-500 absolute -left-10 font-mono">50 ft</span>
                            <div className="w-4 h-[1px] bg-slate-400"></div>
                        </div>

                        {/* Runway Surface */}
                        <div className={`h-full w-full rounded-sm relative transition-colors duration-500 ${condition === 'dry' ? 'bg-slate-700' :
                                condition === 'wet' ? 'bg-sky-900/50' : 'bg-slate-400/50'
                            }`}>
                            <div className="w-full h-1 border-t-2 border-dashed border-white/50 absolute top-1/2 -translate-y-1/2"></div>

                            {/* Landing Threshold */}
                            <div className="absolute left-0 top-0 bottom-0 w-4 border-r-4 border-white/80"></div>

                            {/* Visual Touchdown Point (VTP) */}
                            <div className="absolute left-[15%] top-1/4 bottom-1/4 w-8 bg-white/80"></div>
                        </div>
                    </div>

                    {/* Distance Indicators */}
                    <div className="absolute bottom-6 left-10 right-10 flex flex-col gap-2">
                        {/* LDA Marker */}
                        <div className="flex w-full relative">
                            <div className="border-l border-r border-slate-500 h-2 absolute left-0 bottom-0" style={{ width: `${regulatoryLda}%` }}></div>
                            <div className="absolute -bottom-4 text-[10px] font-bold text-slate-400" style={{ left: `${regulatoryLda / 2}%`, transform: 'translateX(-50%)' }}>
                                LDA (Landing Distance Available)
                            </div>
                        </div>

                        {/* LDR Marker */}
                        <div className="flex w-full relative">
                            <div className={`border-l border-r h-2 absolute left-0 bottom-4 transition-all duration-500 ${overran ? 'border-red-500' : 'border-amber-500'}`} style={{ width: `${actualDistance}%` }}></div>
                            <div className={`absolute bottom-0 text-[10px] font-bold transition-all duration-500 ${overran ? 'text-red-500' : 'text-amber-500'}`} style={{ left: `${actualDistance / 2}%`, transform: 'translateX(-50%)' }}>
                                Actual Landing Distance
                            </div>
                        </div>
                    </div>

                    {/* The Airplane Animation */}
                    <motion.div
                        className="absolute bottom-20 z-20"
                        animate={{
                            left: ['-5%', '15%', `${actualDistance}%`], // Flare -> Touchdown -> Stop
                            bottom: ['8rem', '5rem', '5rem'],
                            rotate: [-3, 0, 0]
                        }}
                        transition={{
                            duration: 4,
                            ease: "easeOut",
                            times: [0, 0.3, 1]
                        }}
                        key={condition} // Re-animate on condition change
                    >
                        <div className="text-white" style={{ transform: 'scaleX(-1)' }}>
                            <PlaneLanding size={32} />
                        </div>
                    </motion.div>

                    {overran && (
                        <div className="absolute top-8 bg-red-900 border border-red-500 text-white px-4 py-2 rounded-xl font-bold animate-bounce flex items-center gap-2 z-30">
                            <ShieldAlert /> RUNWAY OVERRUN!
                        </div>
                    )}
                </div>

                {/* Controls and Explanation Panel */}
                <div className="lg:col-span-4 flex flex-col gap-4">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
                        <h3 className="font-bold text-slate-800 dark:text-white mb-4">Runway Condition</h3>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => setCondition('dry')}
                                className={`px-4 py-3 rounded-xl font-bold text-sm text-left transition-all ${condition === 'dry' ? 'bg-slate-800 text-white border-slate-800' : 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-400'
                                    } border`}
                            >
                                Dry Runway
                                <p className="text-xs font-normal opacity-80 mt-1">Maximum braking effectiveness. Baseline regulatory calculation (60% factor).</p>
                            </button>
                            <button
                                onClick={() => setCondition('wet')}
                                className={`px-4 py-3 rounded-xl font-bold text-sm text-left transition-all ${condition === 'wet' ? 'bg-sky-600 text-white border-sky-600' : 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-400'
                                    } border`}
                            >
                                Wet Runway
                                <p className="text-xs font-normal opacity-80 mt-1">Reduced friction. LDR is factored by an additional 115% for Class A aircraft.</p>
                            </button>
                            <button
                                onClick={() => setCondition('contaminated')}
                                className={`px-4 py-3 rounded-xl font-bold text-sm text-left transition-all ${condition === 'contaminated' ? 'bg-slate-400 text-slate-900 border-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-400'
                                    } border`}
                            >
                                Contaminated (Snow/Ice)
                                <p className="text-xs font-normal opacity-80 mt-1">Severely reduced friction. Risk of aquaplaning. Specific performance data required.</p>
                            </button>
                        </div>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 p-5 rounded-xl flex-grow">
                        <h4 className="font-bold text-amber-800 dark:text-amber-400 text-sm mb-2">The 60% Rule (Class A)</h4>
                        <p className="text-xs text-amber-700 dark:text-amber-300/80 leading-relaxed">
                            For heavy public transport jets (Class A), the aircraft must be capable of a full-stop landing from 50 ft above the threshold, natively using <strong>no more than 60%</strong> of the Landing Distance Available (LDA).
                        </p>
                        <p className="text-xs text-amber-700 dark:text-amber-300/80 leading-relaxed mt-2">
                            This provides a built-in safety margin of 40% of the runway for float, flare variations, or minor system degradation.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPerf;
