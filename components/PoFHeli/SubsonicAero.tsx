import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wind, Ruler, RotateCw, Lightbulb } from 'lucide-react';

export const SubsonicAero = () => {
    const [showTwist, setShowTwist] = useState(false);

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
                    <Wind className="text-blue-600 dark:text-blue-400" size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Subsonic Aerodynamics</h1>
                    <p className="text-slate-600 dark:text-slate-400">Spanwise Lift Distribution & Blade Twist (Wash-out)</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visualizer Panel */}
                <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 flex flex-col justify-center min-h-[400px]">

                    <div className="relative w-full h-64 mt-10">
                        {/* Hub */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-16 bg-slate-700 dark:bg-slate-300 rounded-r-lg z-20 flex flex-col justify-center">
                            <motion.div animate={{ rotate: [0, 360] }} transition={{ repeat: Infinity, duration: 2, ease: "linear" as any }} className="w-8 h-8 border-4 border-slate-500 rounded-full mx-auto border-t-blue-500" />
                        </div>

                        {/* Rotor Blade Base */}
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 w-[90%] h-12 bg-slate-400 dark:bg-slate-500 rounded-r-full overflow-visible flex items-center justify-between px-10">

                            {/* Inner third */}
                            <div className="w-1/3 flex flex-col items-center">
                                <motion.div
                                    className="flex flex-col items-center justify-end"
                                    animate={{ height: showTwist ? 60 : 20 }}
                                >
                                    {showTwist && <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 -mt-6">High AoA</span>}
                                    <div className="w-2 bg-blue-500 rounded-t h-full origin-bottom"></div>
                                </motion.div>
                                <span className="text-[10px] mt-2 font-mono bg-white/50 px-1 rounded">Slow Airflow</span>
                            </div>

                            {/* Middle third */}
                            <div className="w-1/3 flex flex-col items-center">
                                <motion.div
                                    className="flex flex-col items-center justify-end"
                                    animate={{ height: showTwist ? 80 : 60 }}
                                >
                                    <div className="w-2 bg-blue-500 rounded-t h-full origin-bottom"></div>
                                </motion.div>
                            </div>

                            {/* Outer third */}
                            <div className="w-1/3 flex flex-col items-center">
                                <motion.div
                                    className="flex flex-col items-center justify-end"
                                    animate={{ height: showTwist ? 100 : 160 }}
                                >
                                    {showTwist && <span className="text-xs font-bold text-amber-700 dark:text-amber-300 -mt-6">Low AoA</span>}
                                    <div className="w-2 bg-blue-500 rounded-t h-full origin-bottom"></div>
                                </motion.div>
                                <span className="text-[10px] mt-2 font-mono bg-white/50 px-1 rounded">Fast Airflow</span>
                            </div>

                        </div>

                        <div className="absolute -bottom-16 left-0 w-full flex justify-between px-12 opacity-50 text-sm">
                            <div className="flex items-center gap-1"><Ruler size={14} /> Root</div>
                            <div>Span</div>
                            <div>Tip</div>
                        </div>
                    </div>

                    <div className="mt-16 flex justify-center">
                        <button
                            onClick={() => setShowTwist(!showTwist)}
                            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${!showTwist
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200'
                                }`}
                        >
                            <RotateCw size={18} />
                            {showTwist ? 'Blade Twist Applied (Even Lift)' : 'Apply Blade Twist (Wash-out)'}
                        </button>
                    </div>
                </div>

                {/* Info Panel */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-3">
                            The Spanwise Lift Problem
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
                            Because a helicopter blade rotates around a central hub, the <strong>blade tip travels much faster through the air than the blade root</strong>.
                        </p>
                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                            Since Lift is proportional to Velocity squared ($V^2$), if the entire blade had the same pitch angle, the tip would generate massively more lift than the root, creating extreme bending stress.
                        </p>
                    </div>

                    <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800/30 rounded-2xl p-6">
                        <h3 className="font-bold text-indigo-800 dark:text-indigo-400 mb-3 flex items-center gap-2">
                            <Lightbulb className="text-indigo-500" /> The Solution: Blade Wash-out
                        </h3>
                        <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-4 leading-relaxed">
                            Helicopter blades are manufactured with a physical twist built into them, known as <strong>Wash-out</strong>.
                        </p>

                        <ul className="text-sm text-indigo-800 dark:text-indigo-400 space-y-3 pl-4 border-l-2 border-indigo-200 dark:border-indigo-700">
                            <li>
                                <strong>At the Root:</strong> Slow airflow. To compensate, the physical angle of incidence (pitch) is high.
                            </li>
                            <li>
                                <strong>At the Tip:</strong> Fast airflow. The physical angle of incidence is low to reduce lift generation.
                            </li>
                        </ul>
                    </div>

                    <div className="bg-slate-800 text-white rounded-xl p-4 text-center">
                        <div className="text-sm font-bold text-blue-400 mb-1">Resulting Lift Distribution</div>
                        <div className="text-xs text-slate-300">
                            {showTwist
                                ? "With twist, lift is distributed evenly across the specific span of the blade, minimizing bending forces."
                                : "Without twist, lift spikes exponentially at the tip, causing destructive structural bending."}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubsonicAero;
