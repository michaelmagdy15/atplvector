import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCw, ArrowRight, ArrowLeft, ShieldAlert, Settings, Zap } from 'lucide-react';

export const TailRotors = () => {
    const [enginePower, setEnginePower] = useState(50); // 0 to 100%
    const [compensateTilting, setCompensateTilting] = useState(false);

    // Physics mapping
    const mainRotorTorque = enginePower; // acts counter-clockwise in US helis, meaning fuselage tries to spin right (clockwise). 
    // Wait, let's assume standard CCW rotor. Fuselage tries to rotate CW (Right).
    const tailRotorPull = enginePower; // Pulls to the right to stop CW fuselage rotation. Wait, no.
    // If rotor turns CCW, fuselage turns CW. Tail rotor must push tail left (pulling fuselage right) to counter CW, or push tail right.
    // Let's abstract it: Tail rotor pushes the helicopter laterally.

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-full">
                    <RotateCw className="text-slate-700 dark:text-slate-300" size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Tail Rotors & Anti-Torque</h1>
                    <p className="text-slate-600 dark:text-slate-400">Understanding Torque Reaction and Translating Tendency</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visualizer Panel */}
                <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center space-y-8 min-h-[450px]">

                    <div className="relative w-64 h-64 flex items-center justify-center">

                        {/* Translate the whole helicopter based on tail rotor thrust (if not compensated) */}
                        <motion.div
                            className="relative flex items-center justify-center"
                            animate={{
                                x: compensateTilting ? 0 : (enginePower * 0.5),
                                rotate: compensateTilting ? -5 : 0
                            }}
                            transition={{ type: 'spring', stiffness: 50 }}
                        >
                            {/* Main Rotor Torque Indicator */}
                            {enginePower > 0 && (
                                <motion.div
                                    className="absolute w-40 h-40 rounded-full border-4 border-red-500/30 border-t-red-500"
                                    animate={{ rotate: [0, 360] }}
                                    transition={{ repeat: Infinity, duration: 200 / Math.max(enginePower, 1), ease: 'linear' as any }}
                                />
                            )}

                            {/* Fuselage */}
                            <div className="absolute w-12 h-32 bg-slate-700 dark:bg-slate-300 rounded-full z-10 shadow-lg"></div>
                            {/* Tail Boom */}
                            <div className="absolute top-1/2 w-4 h-32 bg-slate-600 dark:bg-slate-400 z-0"></div>

                            {/* Tail Rotor */}
                            <div className="absolute -bottom-16 right-0 w-8 h-2 bg-slate-800 dark:bg-slate-200">
                                {enginePower > 0 && (
                                    <div className="absolute -top-4 -right-12 text-blue-500 flex items-center z-20">
                                        <ArrowRight size={24} className="animate-pulse" />
                                        <span className="text-xs font-bold w-16">Anti-Torque Thrust</span>
                                    </div>
                                )}
                            </div>

                            {/* Main Rotor */}
                            <motion.div
                                className="absolute w-48 h-2 bg-slate-800/80 dark:bg-slate-200/80 rounded-full z-20"
                                animate={{ rotate: -360 }}
                                transition={{ repeat: Infinity, duration: 100 / Math.max(enginePower, 1), ease: 'linear' as any }}
                            />

                            {/* Translating Drift Arrow (Only when not compensated) */}
                            {!compensateTilting && enginePower > 0 && (
                                <div className="absolute top-1/2 left-24 text-amber-500 flex flex-col items-center">
                                    <span className="text-xs font-bold mb-1">Drift</span>
                                    <ArrowRight size={32} className="animate-bounce" />
                                </div>
                            )}

                        </motion.div>
                    </div>

                    <div className="w-full max-w-sm space-y-6 pt-8 border-t border-slate-200 dark:border-slate-700">
                        <div>
                            <label className="block text-sm font-medium mb-2 flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                <Zap size={16} className="text-yellow-500" />
                                Engine Power / Torque: {enginePower}%
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={enginePower}
                                onChange={(e) => setEnginePower(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-500"
                            />
                        </div>

                        <button
                            onClick={() => setCompensateTilting(!compensateTilting)}
                            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${!compensateTilting
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                                }`}
                        >
                            <Settings size={18} />
                            {compensateTilting ? 'Mast Tilt Appiled (Drift Compensated)' : 'Apply Mast Tilt Compensation'}
                        </button>
                    </div>
                </div>

                {/* Info Panel */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-3">
                            Torque Reaction
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
                            According to Newton's Third Law (Action and Reaction), as the engine drives the main rotor in one direction, it forces the fuselage to rotate in the opposite direction.
                        </p>
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700 text-sm">
                            The <strong>Tail Rotor</strong> produces thrust sideways to counteract this torque and maintain directional heading.
                        </div>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-2xl p-6">
                        <h3 className="font-bold text-amber-800 dark:text-amber-400 mb-3 flex items-center gap-2">
                            <ArrowRight className="text-amber-500" /> Translating Tendency
                        </h3>
                        <p className="text-sm text-amber-700 dark:text-amber-300 mb-4 leading-relaxed">
                            While the tail rotor stops the helicopter from spinning, its sideways thrust pushes the entire helicopter laterally during a hover. This is known as <strong>Translating Tendency</strong> or Tail Rotor Drift.
                        </p>

                        <div className="space-y-3">
                            <h4 className="font-bold text-amber-900 dark:text-amber-200 text-sm">How manufacturers fix this:</h4>
                            <ul className="text-sm text-amber-800 dark:text-amber-400 space-y-2 pl-4 list-disc">
                                <li>Rigging the flight controls so the main rotor disc is slightly tilted when the cyclic is centered.</li>
                                <li>Tilting the main rotor mast slightly opposite to the tail rotor thrust.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-xl p-4 flex gap-3">
                        <ShieldAlert className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                        <div>
                            <h4 className="font-bold text-red-800 dark:text-red-400 text-sm mb-1">Loss of Tail Rotor Effectiveness (LTE)</h4>
                            <p className="text-xs text-red-700 dark:text-red-300 leading-relaxed">
                                An uncommanded, rapid yaw rate which does not subside of its own accord. It occurs when aerodynamic interference (like crosswinds or main rotor downwash) disrupts the airflow entering the tail rotor, robbing it of thrust.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TailRotors;
