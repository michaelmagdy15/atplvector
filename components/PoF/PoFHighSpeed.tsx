import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, Zap } from 'lucide-react';

export const PoFHighSpeed = () => {
    const [mach, setMach] = useState(0.4);

    // Derived states
    const isCompressible = mach > 0.4;
    const isTransonic = mach >= 0.8 && mach < 1.2;
    const isSupersonic = mach >= 1.2;

    const dragRise = mach > 0.8 ? Math.pow(mach - 0.8, 2) * 500 : 0;

    // Wave positions
    const normalShockVis = mach >= 0.8 && mach < 1.0;
    const tailWaveVis = mach >= 1.0;
    const bowWaveVis = mach >= 1.2;

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold mb-4 text-slate-800 dark:text-slate-100 flex items-center">
                <Zap className="mr-3 text-yellow-500" />
                High Speed Flight
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
                Explore the effects of compressibility, shockwaves, and the transonic regime as an aircraft approaches and exceeds the speed of sound.
            </p>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Current Speed: Mach {mach.toFixed(2)}
                </label>
                <input
                    type="range"
                    min="0.2"
                    max="2.5"
                    step="0.05"
                    value={mach}
                    onChange={(e) => setMach(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
                />

                <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
                    <span>Subsonic</span>
                    <span>Transonic (M0.8 - M1.2)</span>
                    <span>Supersonic (M1.2+)</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Visualizer */}
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700 min-h-[300px] relative overflow-hidden">

                    {/* Airflow Lines */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute h-[1px] bg-blue-500 w-full"
                                style={{ top: `${20 + i * 15}%` }}
                                animate={{ x: ['100%', '-100%'] }}
                                transition={{ repeat: Infinity, duration: 2 / mach, ease: "linear" }}
                            />
                        ))}
                    </div>

                    {/* Aerofoil Profile */}
                    <div className="relative z-10 w-48 h-12 bg-slate-400 dark:bg-slate-500 rounded-[100%_0_0_0/100%] shadow-lg border-b-4 border-slate-500 dark:border-slate-600 mb-8" />

                    {/* Shockwaves */}
                    {normalShockVis && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="absolute top-1/4 w-1 h-32 bg-red-500/80 blur-[2px] z-20"
                            style={{ left: `${50 + (mach - 0.8) * 100}%` }}
                        />
                    )}

                    {tailWaveVis && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="absolute top-1/4 ml-32 w-12 h-32 border-r-4 border-red-500/80 rounded-full blur-[1px] z-20 transform -rotate-12"
                        />
                    )}

                    {bowWaveVis && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="absolute top-1/4 -ml-32 w-16 h-32 border-l-4 border-orange-500/80 rounded-full blur-[1px] z-20 transform -translate-x-12"
                        />
                    )}

                    {isCompressible && (
                        <div className="absolute bottom-4 flex items-center text-xs font-bold text-orange-500 bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-full">
                            <Activity size={14} className="mr-1" />
                            Compressible Flow Active
                        </div>
                    )}
                </div>

                {/* Telemetry */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col justify-center space-y-6">

                    <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Flight Regime</h3>
                        <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                            {mach < 0.8 ? 'Subsonic' : mach < 1.2 ? 'Transonic' : 'Supersonic'}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            {mach < 0.8 ? 'Air behaves like an incompressible fluid.' :
                                mach < 1.2 ? 'Mixed subsonic and supersonic flow over the wing.' :
                                    'Entire airflow around the aircraft is supersonic.'}
                        </p>
                    </div>

                    <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
                        <h3 className="text-sm font-bold text-red-500 dark:text-red-400 uppercase tracking-wide mb-2 flex items-center">
                            <ArrowRight size={14} className="mr-1" /> Wave Drag Penalty
                        </h3>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mb-2">
                            <div className="bg-red-500 h-3 rounded-full transition-all duration-300" style={{ width: `${Math.min(100, dragRise)}%` }}></div>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                            {mach < 0.8 ? 'No wave drag. Pure profile/induced drag.' :
                                'Shockwave formation causes a massive surge in total drag (drag divergence).'}
                        </p>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default PoFHighSpeed;
