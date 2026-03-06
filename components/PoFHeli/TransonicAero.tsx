import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, AlertTriangle, ArrowRight, Fan, FastForward } from 'lucide-react';

export const TransonicAero = () => {
    const [speed, setSpeed] = useState(100); // Kts
    const maxSpeed = 220;

    const isCompressible = speed > 160;
    const isStalling = speed > 180;

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <div className="bg-red-100 dark:bg-red-900/50 p-3 rounded-full">
                    <Target className="text-red-600 dark:text-red-400" size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">High Speed & Transonic Aerodynamics</h1>
                    <p className="text-slate-600 dark:text-slate-400">The aerodynamic limits of helicopter forward flight (Vne)</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Visualizer Panel */}
                <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[450px] relative overflow-hidden text-white">

                    {/* Speed Lines Array */}
                    <div className="absolute inset-0 pointer-events-none opacity-20">
                        {[...Array(10)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-full h-[2px] bg-sky-400"
                                style={{ top: `${10 + i * 10}%` }}
                                animate={{ y: [0, 500] }}
                                transition={{
                                    repeat: Infinity,
                                    duration: Math.max(0.1, 100 / speed),
                                    ease: 'linear' as any,
                                    delay: i * 0.1
                                }}
                            />
                        ))}
                    </div>

                    <div className="relative w-[300px] h-[300px] flex items-center justify-center mt-8">
                        {/* Retreating Blade Stall Zone (Left/Red) */}
                        <motion.div
                            className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-32 h-64 rounded-[100%] bg-red-600/30 blur-xl z-0 transition-opacity duration-300"
                            animate={{ opacity: isStalling ? 0.8 : 0, scale: isStalling ? [1, 1.1, 1] : 1 }}
                            transition={{ repeat: Infinity, duration: 0.5 }}
                        />

                        {/* Advancing Blade Compressibility Zone (Right/Blue) */}
                        <motion.div
                            className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-32 h-64 rounded-[100%] bg-sky-400/30 blur-xl z-0 transition-opacity duration-300"
                            animate={{ opacity: isCompressible ? 0.8 : 0, scale: isCompressible ? [1, 1.05, 1] : 1 }}
                            transition={{ repeat: Infinity, duration: 0.2 }}
                        />

                        {/* Helicopter Body */}
                        <div className="absolute w-16 h-40 bg-slate-700 rounded-full z-10 shadow-[0_0_20px_rgba(0,0,0,0.5)] flex flex-col items-center pt-3">
                            <div className="w-10 h-12 bg-sky-900 rounded-full"></div>
                        </div>

                        {/* Rotor Disc Rotation */}
                        <motion.div
                            className="absolute w-72 h-72 z-20"
                            animate={{ rotate: -360 }}
                            transition={{ repeat: Infinity, duration: Math.max(0.05, 50 / speed), ease: 'linear' as any }}
                        >
                            <div className="absolute top-1/2 left-0 w-full h-3 bg-gradient-to-r from-slate-400 via-slate-800 to-slate-400 -translate-y-1/2 rounded-full"></div>
                            <div className="absolute top-0 left-1/2 w-3 h-full bg-gradient-to-b from-slate-400 via-slate-800 to-slate-400 -translate-x-1/2 rounded-full"></div>

                            {/* Shockwaves on advancing tip */}
                            {isCompressible && (
                                <div className="absolute top-1/2 right-0 w-12 h-16 -translate-y-1/2 translate-x-4 border-r-4 border-sky-300 rounded-[100%] opacity-80" />
                            )}
                        </motion.div>

                        {/* Warning Labels */}
                        {isStalling && (
                            <div className="absolute top-8 left-[-40px] z-30 bg-red-900 border border-red-500 text-white px-3 py-2 rounded-lg text-xs font-bold animate-bounce flex items-center gap-2">
                                <AlertTriangle size={14} className="text-red-400" />
                                Retreating Blade Stall
                            </div>
                        )}
                        {isCompressible && (
                            <div className="absolute top-12 right-[-40px] z-30 bg-sky-900 border border-sky-500 text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
                                <FastForward size={14} className="text-sky-300" />
                                Transonic Shockwave
                            </div>
                        )}

                    </div>

                    <div className="w-full mt-10 z-30 bg-slate-800 border border-slate-700 p-5 rounded-xl">
                        <label className="block text-sm font-bold mb-4 flex justify-between items-center text-slate-300">
                            <span className="flex items-center gap-2"><ArrowRight size={18} /> Forward Airspeed (TAS)</span>
                            <span className={`px-2 py-1 rounded ${isStalling ? 'bg-red-500 text-white' : isCompressible ? 'bg-amber-500 text-white' : 'bg-slate-700'}`}>
                                {speed} kts
                            </span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max={maxSpeed}
                            value={speed}
                            onChange={(e) => setSpeed(Number(e.target.value))}
                            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-3 font-mono">
                            <span>0 kts</span>
                            <span>Hover</span>
                            <span className="text-amber-500">160 kts</span>
                            <span className="text-red-500">Vne (200+ kts)</span>
                        </div>
                    </div>
                </div>

                {/* Explanation Panel */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-3">
                            The Dual Speed Barrier
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                            Unlike aeroplanes, helicopters are limited in their maximum forward speed (Vne - Velocity Never Exceed) by two simultaneous aerodynamic crises occurring on opposite sides of the rotor disc.
                        </p>
                    </div>

                    <div className={`transition-all duration-500 border-2 rounded-2xl p-5 ${isCompressible ? 'bg-sky-50 dark:bg-sky-900/20 border-sky-400 dark:border-sky-700' : 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700 opacity-70'
                        }`}>
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 rounded-full ${isCompressible ? 'bg-sky-200 dark:bg-sky-800 text-sky-700 dark:text-sky-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                                <Fan size={20} />
                            </div>
                            <h3 className="font-bold text-slate-800 dark:text-white">Advancing Blade Compressibility</h3>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 ml-12">
                            The advancing blade (right side) moves INTO the relative wind. Its total airspeed is Rotational Speed + Forward Speed.
                        </p>
                        {isCompressible && (
                            <div className="ml-12 bg-sky-100 dark:bg-sky-900/50 p-3 rounded-lg text-xs font-medium text-sky-800 dark:text-sky-200">
                                At high forward speeds, the tip of the advancing blade approaches the speed of sound (Mach 1), forming shockwaves, massive drag rise, and massive vibration.
                            </div>
                        )}
                    </div>

                    <div className={`transition-all duration-500 border-2 rounded-2xl p-5 ${isStalling ? 'bg-red-50 dark:bg-red-900/20 border-red-400 dark:border-red-700' : 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700 opacity-70'
                        }`}>
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 rounded-full ${isStalling ? 'bg-red-200 dark:bg-red-800 text-red-700 dark:text-red-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                                <AlertTriangle size={20} />
                            </div>
                            <h3 className="font-bold text-slate-800 dark:text-white">Retreating Blade Stall</h3>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 ml-12">
                            The retreating blade (left side) moves AWAY from the relative wind. Its airspeed is Rotational Speed - Forward Speed. To maintain lift, it flaps down, increasing its Angle of Attack.
                        </p>
                        {isStalling && (
                            <div className="ml-12 bg-red-100 dark:bg-red-900/50 p-3 rounded-lg text-xs font-medium text-red-800 dark:text-red-200">
                                At extreme speeds, the inner root of the retreating blade enters reverse flow, and the rest of the blade reaches its critical AoA and stalls. This causes the helicopter to pitch up and roll left violently.
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default TransonicAero;
