import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const PoFPropellers = () => {
    const [rpm, setRpm] = useState(50);
    const [tas, setTas] = useState(50);

    // Derived simplified values for illustration
    // Slip represents the difference between geometric pitch and effective pitch
    // Higher TAS = more distance covered = higher effective pitch
    // Higher RPM = faster rotation = lower effective pitch relative to geometric
    const geometricPitch = 100;
    const effectivePitch = Math.min(geometricPitch, tas * 1.5 + (100 - rpm) * 0.2);
    const slip = Math.max(0, geometricPitch - effectivePitch);

    const angleOfAttack = Math.max(0, rpm * 0.15 - tas * 0.1);

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold mb-4 text-slate-800 dark:text-slate-100">Propeller Theory</h1>
            <p className="text-gray-600 dark:text-gray-300">
                A propeller converts engine power into forward thrust using aerodynamic principles.
                Interact with the RPM and Airspeed (TAS) sliders to see how they affect Propeller Pitch and Angle of Attack.
            </p>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm mb-6">
                <h2 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-400">Flight Controls</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Engine RPM: {rpm}%
                        </label>
                        <input
                            type="range"
                            min="20"
                            max="100"
                            value={rpm}
                            onChange={(e) => setRpm(Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
                        />
                        <p className="text-xs text-slate-500 mt-2">Higher RPM increases structural Angle of Attack on the blades.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            True Airspeed (TAS): {tas} kts
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="200"
                            value={tas}
                            onChange={(e) => setTas(Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
                        />
                        <p className="text-xs text-slate-500 mt-2">Higher TAS reduces the blade's Angle of Attack (propeller "bites" less air forward). Too low TAS at high RPM increases slip.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Propeller Animation visually reflecting RPM */}
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700 min-h-[300px] overflow-hidden relative">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                            repeat: Infinity,
                            duration: 20 / rpm, // Faster spin with higher RPM
                            ease: "linear"
                        }}
                        className="w-48 h-4 bg-slate-600 dark:bg-slate-400 rounded-full relative"
                    >
                        {/* Propeller Hub */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-slate-800 dark:bg-slate-200 rounded-full z-10" />
                    </motion.div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col justify-center space-y-4">
                    <div>
                        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Blade Angle of Attack</h3>
                        <div className="flex items-end mt-1">
                            <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{angleOfAttack.toFixed(1)}°</span>
                        </div>
                        {angleOfAttack < 1 && <p className="text-red-500 text-xs mt-1">Warning: Negative or zero AoA reduces thrust and may cause windmilling.</p>}
                        {angleOfAttack > 12 && <p className="text-red-500 text-xs mt-1">Warning: High AoA risks blade stall.</p>}
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Pitch Metrics</h3>

                        <div className="mt-3 space-y-3">
                            <div>
                                <div className="flex justify-between text-xs mb-1 font-medium text-slate-600 dark:text-slate-400">
                                    <span>Geometric Pitch (Theoretical)</span>
                                    <span>{geometricPitch.toFixed(0)} units</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                    <div className="bg-slate-400 h-2 rounded-full" style={{ width: '100%' }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs mb-1 font-medium text-slate-600 dark:text-slate-400">
                                    <span>Effective Pitch (Actual)</span>
                                    <span>{effectivePitch.toFixed(0)} units</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(effectivePitch / geometricPitch) * 100}%` }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs mb-1 font-medium text-slate-600 dark:text-slate-400">
                                    <span>Propeller Slip (Lost Efficiency)</span>
                                    <span>{slip.toFixed(0)} units</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                    <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(slip / geometricPitch) * 100}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PoFPropellers;
