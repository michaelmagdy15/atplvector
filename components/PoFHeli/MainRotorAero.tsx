import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wind, Info, Activity, Plane } from 'lucide-react';

export const MainRotorAero = () => {
    const [forwardSpeed, setForwardSpeed] = useState(50); // 0 to 100%
    const isHovering = forwardSpeed === 0;

    // Calculations based on forward speed
    const advancingWindSpeed = 100 + forwardSpeed;
    const retreatingWindSpeed = 100 - forwardSpeed;

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
                    <Activity className="text-blue-600 dark:text-blue-400" size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Main-Rotor Aerodynamics</h1>
                    <p className="text-slate-600 dark:text-slate-400">Interactive visualization of Dissymmetry of Lift & Blade Flapping</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Visualizer Panel */}
                <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 flex flex-col items-center space-y-8 relative overflow-hidden">

                    {/* Simulated relative wind lines */}
                    {!isHovering && (
                        <div className="absolute inset-0 pointer-events-none opacity-20">
                            {[...Array(5)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-full h-[1px] bg-blue-500"
                                    style={{ top: `${20 + i * 15}%` }}
                                    animate={{ y: [0, 400] }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 200 / Math.max(forwardSpeed, 1),
                                        ease: 'linear' as any,
                                        delay: i * 0.2
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    <div className="text-center z-10 w-full mb-8">
                        <div className="flex justify-between items-center px-8 text-sm font-bold mb-4">
                            <span className="text-red-500 flex flex-col items-center">
                                Retreating Side
                                <span className="text-xs font-normal">Relative Wind: {retreatingWindSpeed} kts</span>
                            </span>
                            <span className="text-emerald-500 flex flex-col items-center">
                                Advancing Side
                                <span className="text-xs font-normal">Relative Wind: {advancingWindSpeed} kts</span>
                            </span>
                        </div>

                        {/* Top-down Helicopter View */}
                        <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
                            {/* Fuselage */}
                            <div className="absolute w-12 h-32 bg-slate-700 dark:bg-slate-300 rounded-full z-10 shadow-lg flex flex-col items-center justify-start py-2">
                                <div className="w-8 h-8 bg-blue-900/50 rounded-full"></div>
                            </div>
                            {/* Tail Boom */}
                            <div className="absolute top-1/2 w-4 h-32 bg-slate-600 dark:bg-slate-400 z-0"></div>

                            {/* Rotation direction indicator */}
                            <motion.div
                                className="absolute w-72 h-72 rounded-full border-4 border-dashed border-slate-300 dark:border-slate-600 opacity-50"
                                animate={{ rotate: -360 }}
                                transition={{ repeat: Infinity, duration: 10, ease: 'linear' as any }}
                            />

                            {/* The Rotor Disc */}
                            <motion.div
                                className="relative w-full h-full"
                                animate={{ rotate: -360 }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 0.5,
                                    ease: 'linear' as any
                                }}
                            >
                                {/* Rotor Blades */}
                                <div className="absolute top-1/2 left-0 w-full h-2 bg-slate-800 dark:bg-slate-200 -translate-y-1/2 rounded-full"></div>
                                <div className="absolute top-0 left-1/2 w-2 h-full bg-slate-800 dark:bg-slate-200 -translate-x-1/2 rounded-full"></div>
                            </motion.div>

                            {/* Flapping Indicator Overlays */}
                            {!isHovering && (
                                <>
                                    {/* Left (Retreating) Side - Flaps Down */}
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 z-20">
                                        <div className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded shadow animate-pulse">
                                            Flaps Down
                                            <br />(Inc. AoA)
                                        </div>
                                    </div>
                                    {/* Right (Advancing) Side - Flaps Up */}
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 z-20">
                                        <div className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded shadow animate-pulse">
                                            Flaps Up
                                            <br />(Dec. AoA)
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="w-full max-w-md z-10 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                        <label className="block text-sm font-medium mb-4 flex items-center gap-2 text-slate-700 dark:text-slate-300">
                            <Plane size={16} />
                            Forward Airspeed (TAS): {forwardSpeed} kts
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={forwardSpeed}
                            onChange={(e) => setForwardSpeed(Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-2">
                            <span>Hover (0 kts)</span>
                            <span>Cruise (100 kts)</span>
                        </div>
                    </div>
                </div>

                {/* Info Panel */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-white mb-4">
                            <Wind className="text-blue-500" /> Dissymmetry of Lift
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
                            In forward flight, the relative wind velocity over the main rotor blades varies depending on where they are in their rotation.
                        </p>
                        <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300 pl-4 border-l-2 border-slate-200 dark:border-slate-700">
                            <li>
                                <strong className="text-emerald-600 dark:text-emerald-400">Advancing Blade (Right side):</strong> Speed = Rotational Velocity + Forward Speed. Generates more lift.
                            </li>
                            <li>
                                <strong className="text-red-500 dark:text-red-400">Retreating Blade (Left side):</strong> Speed = Rotational Velocity - Forward Speed. Generates less lift.
                            </li>
                        </ul>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/30 rounded-2xl p-6">
                        <h3 className="font-bold text-purple-800 dark:text-purple-300 mb-3">
                            The Solution: Blade Flapping
                        </h3>
                        <p className="text-sm text-purple-700 dark:text-purple-400 mb-4">
                            To prevent the helicopter from rolling over due to unequal lift, blades are mounted on hinges that allow them to move up and down (flap).
                        </p>

                        <div className="space-y-2 opacity-90">
                            <div className="flex justify-between text-sm bg-white dark:bg-slate-800/50 p-2 rounded">
                                <span>Advancing Blade</span>
                                <span className="font-mono">Flaps Up ➔ Decreases Angle of Attack ➔ Decreases Lift</span>
                            </div>
                            <div className="flex justify-between text-sm bg-white dark:bg-slate-800/50 p-2 rounded">
                                <span>Retreating Blade</span>
                                <span className="font-mono">Flaps Down ➔ Increases Angle of Attack ➔ Increases Lift</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-xl p-4 flex gap-3">
                        <Info className="text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" size={20} />
                        <div>
                            <h4 className="font-bold text-amber-800 dark:text-amber-400 text-sm mb-1">Gyroscopic Precession</h4>
                            <p className="text-xs text-amber-700 dark:text-amber-500 leading-relaxed">
                                Because the rotor disc acts like a gyroscope, an applied force acts 90° later in the direction of rotation. The maximum upward flapping velocity occurs over the nose, causing the rotor disc to tilt backwards (blowback) when transitioning to forward flight.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainRotorAero;
