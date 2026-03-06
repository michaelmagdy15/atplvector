import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlaneTakeoff, ShieldAlert, ArrowRight, XCircle } from 'lucide-react';

export const TakeoffPerf = () => {
    const [scenario, setScenario] = useState<'balanced' | 'clearway' | 'stopway'>('balanced');
    const [engineFailure, setEngineFailure] = useState(false);

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <div className="bg-emerald-100 dark:bg-emerald-900/50 p-3 rounded-full">
                    <PlaneTakeoff className="text-emerald-600 dark:text-emerald-400" size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Take-off Performance</h1>
                    <p className="text-slate-600 dark:text-slate-400">Field Lengths & Balanced Field Concepts</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm mb-6">
                <div className="flex flex-wrap gap-4 mb-8 justify-center">
                    <button
                        onClick={() => setScenario('balanced')}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${scenario === 'balanced' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                    >
                        Balanced Field
                    </button>
                    <button
                        onClick={() => setScenario('clearway')}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${scenario === 'clearway' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                    >
                        With Clearway
                    </button>
                    <button
                        onClick={() => setScenario('stopway')}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${scenario === 'stopway' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                    >
                        With Stopway
                    </button>
                </div>

                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-slate-800 dark:text-white">Runway Interactive Simulator</h3>
                    <button
                        onClick={() => setEngineFailure(!engineFailure)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${engineFailure
                                ? 'bg-red-100 text-red-700 border border-red-300 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400'
                                : 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 hover:bg-slate-200'
                            }`}
                    >
                        {engineFailure ? <XCircle size={14} /> : <ShieldAlert size={14} />}
                        {engineFailure ? 'Engine Failed at V1' : 'Simulate Engine Failure (V1)'}
                    </button>
                </div>

                {/* Runway Visualizer */}
                <div className="relative w-full h-80 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700 p-8 flex flex-col justify-center overflow-hidden">

                    {/* The Ground */}
                    <div className="absolute bottom-16 left-8 right-8 h-12 flex relative">
                        {/* TORA (Runway) */}
                        <div className="h-full w-3/5 bg-slate-800 dark:bg-slate-600 rounded-sm relative shadow-inner z-10 flex items-center">
                            <div className="w-full h-1 border-t-2 border-dashed border-white/50 absolute top-1/2 -translate-y-1/2"></div>
                            <div className="absolute -top-6 left-0 text-xs font-bold text-slate-500">Brakes Release</div>
                        </div>

                        {/* Extensions based on scenario */}
                        <div className="h-full flex-1 flex relative">
                            {scenario === 'clearway' && (
                                <div className="h-full w-full bg-emerald-100 dark:bg-emerald-900/20 border-2 border-dashed border-emerald-300 dark:border-emerald-700/50 rounded-r-sm absolute top-0 left-0 z-0">
                                    <span className="absolute bottom-2 right-2 text-xs font-bold text-emerald-600/50 dark:text-emerald-400/50">CLEARWAY</span>
                                </div>
                            )}

                            {scenario === 'stopway' && (
                                <div className="h-full w-2/3 bg-rose-100 dark:bg-rose-900/20 border-2 border-dashed border-rose-300 dark:border-rose-700/50 rounded-r-sm absolute top-0 left-0 z-0">
                                    <span className="absolute bottom-2 right-2 text-xs font-bold text-rose-600/50 dark:text-rose-400/50">STOPWAY</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Dimensions Labels */}
                    <div className="absolute bottom-2 left-8 right-8 flex flex-col gap-1 text-[10px] font-mono">
                        <div className="flex w-full">
                            <div className="border-l border-r border-slate-400 h-4 flex items-center justify-center bg-slate-200 dark:bg-slate-700 dark:text-slate-300" style={{ width: '60%' }}>TORA</div>
                        </div>

                        {scenario === 'stopway' && (
                            <div className="flex w-full relative">
                                <div className="border-l border-r border-slate-400 h-4 flex items-center justify-center bg-rose-200 dark:bg-rose-900/50 dark:text-rose-200 mt-1" style={{ width: 'calc(60% + 26.66%)' }}>ASDA = TORA + Stopway</div>
                            </div>
                        )}
                        {scenario === 'clearway' && (
                            <div className="flex w-full relative">
                                <div className="border-l border-r border-slate-400 h-4 flex items-center justify-center bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-200 mt-1" style={{ width: '100%' }}>TODA = TORA + Clearway</div>
                            </div>
                        )}
                        {scenario === 'balanced' && (
                            <div className="flex w-full relative">
                                <div className="border-l border-r border-slate-400 h-4 flex items-center justify-center bg-blue-200 dark:bg-blue-900/50 dark:text-blue-200 mt-1" style={{ width: '60%' }}>TODA = ASDA = TORA (Balanced Field)</div>
                            </div>
                        )}
                    </div>

                    {/* Airplane Animation */}
                    <motion.div
                        className="absolute bottom-28 z-20 flex flex-col items-center"
                        animate={{
                            left: engineFailure ? ['0%', '40%', '65%'] : ['0%', '40%', '80%', '110%'],
                            bottom: engineFailure ? ['7rem', '7rem', '7rem'] : ['7rem', '7rem', '9rem', '15rem'],
                            rotate: engineFailure ? [0, 0, 0] : [0, 0, 15, 15]
                        }}
                        transition={{
                            duration: engineFailure ? 4 : 5,
                            ease: "easeOut",
                            times: engineFailure ? [0, 0.4, 1] : [0, 0.4, 0.7, 1]
                        }}
                        key={engineFailure ? 'fail' : 'success'} // Force re-render animation when toggled
                    >
                        {/* Simple plane representation */}
                        <div className="text-slate-800 dark:text-white" style={{ transform: 'scaleX(-1)' }}>
                            <PlaneTakeoff size={32} />
                        </div>

                        <div className="text-[10px] font-bold text-slate-500 mt-1">
                            <motion.span
                                animate={{ opacity: [1, 1, 0, 0] }}
                                transition={{ duration: 5, times: [0, 0.3, 0.4, 1] }}
                            >
                                Roll
                            </motion.span>
                            <motion.span
                                animate={{ opacity: [0, 0, 1, 0] }}
                                transition={{ duration: 5, times: [0, 0.3, 0.5, 1] }}
                                className="text-blue-500"
                            >
                                V1/Vr
                            </motion.span>
                            <motion.span
                                animate={{ opacity: [0, 0, 0, 1] }}
                                transition={{ duration: 5, times: [0, 0.5, 0.6, 1] }}
                                className={engineFailure ? "text-red-500" : "text-emerald-500"}
                            >
                                {engineFailure ? 'RTO' : '35ft'}
                            </motion.span>
                        </div>
                    </motion.div>

                    {/* 35ft Screen Height marker for normal takeoff */}
                    {!engineFailure && (
                        <div className="absolute right-12 bottom-36 border-b border-emerald-400 w-16 text-[10px] text-emerald-600 text-center font-bold">
                            35 ft
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-4 rounded-xl">
                    <h3 className="font-bold text-slate-800 dark:text-white mb-2">TORA</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                        <strong>Take-Off Run Available.</strong> The physical length of runway declared available and suitable for the ground run of an aeroplane taking off.
                    </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-4 rounded-xl">
                    <h3 className="font-bold text-slate-800 dark:text-white mb-2">TODA</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                        <strong>Take-Off Distance Available.</strong> TORA + Clearway (if any). The clearway must not exceed 50% of TORA. Contains no obstacles protruding above the clearway plane.
                    </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-4 rounded-xl">
                    <h3 className="font-bold text-slate-800 dark:text-white mb-2">ASDA</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                        <strong>Accelerate-Stop Distance Available.</strong> TORA + Stopway (if any). A surface capable of supporting the aeroplane during an aborted take-off without structural damage.
                    </p>
                </div>
            </div>

        </div>
    );
};

export default TakeoffPerf;
