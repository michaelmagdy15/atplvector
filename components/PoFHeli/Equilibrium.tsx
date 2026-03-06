import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Scale, CheckCircle2, AlertOctagon, Plane, Wind } from 'lucide-react';

export const Equilibrium = () => {
    const [scenario, setScenario] = useState<'hover' | 'forward'>('hover');
    const [sasEnabled, setSasEnabled] = useState(false);
    const controls = useAnimation();

    // Hover stability simulation (inverted pendulum effect)
    useEffect(() => {
        if (scenario === 'hover') {
            if (!sasEnabled) {
                // Highly unstable: random large swings
                controls.start({
                    rotate: [0, 15, -10, 20, -25, 5, -15],
                    x: [0, -20, 30, -40, 25, -10, 35],
                    transition: { repeat: Infinity, duration: 4, ease: "easeInOut" }
                });
            } else {
                // SAS enabled: minor corrections
                controls.start({
                    rotate: [0, 2, -1, 1, -2, 0],
                    x: [0, -5, 3, -2, 4, 0],
                    transition: { repeat: Infinity, duration: 4, ease: "easeInOut" }
                });
            }
        } else {
            // Forward flight: streamlined
            controls.start({
                rotate: 5, // slight nose down
                x: 0,
                y: [0, -5, 5, 0], // slight altitude bobbing
                transition: { y: { repeat: Infinity, duration: 5, ease: "easeInOut" } }
            });
        }
    }, [scenario, sasEnabled, controls]);

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <div className="bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-full">
                    <Scale className="text-indigo-600 dark:text-indigo-400" size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Equilibrium & Stability</h1>
                    <p className="text-slate-600 dark:text-slate-400">Inherent instability, AFCS, and aerodynamic stabilisers</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <button
                    onClick={() => setScenario('hover')}
                    className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${scenario === 'hover'
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                        }`}
                >
                    <span className="font-bold">Hovering (Static Instability)</span>
                </button>
                <button
                    onClick={() => setScenario('forward')}
                    className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${scenario === 'forward'
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                        }`}
                >
                    <span className="font-bold">Forward Flight (Aerodynamic Stability)</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Simulation Canvas */}
                <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]">

                    {scenario === 'forward' && (
                        <div className="absolute inset-0 pointer-events-none opacity-20">
                            {[...Array(10)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-12 h-[2px] bg-sky-500 rounded-full"
                                    style={{ top: `${10 + i * 10}%` }}
                                    animate={{ left: ['100%', '-20%'] }}
                                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' as any, delay: i * 0.2 }}
                                />
                            ))}
                        </div>
                    )}

                    {/* Helicopter Model */}
                    <motion.div animate={controls} className="relative z-20 flex flex-col items-center justify-center">
                        <motion.div className="w-48 h-1 bg-slate-700 dark:bg-slate-300 rounded-full absolute -top-8 z-30" animate={{ rotateY: 360 }} transition={{ repeat: Infinity, duration: 0.1, ease: 'linear' as any }} />
                        <div className="w-1 h-8 bg-slate-500"></div>
                        <div className="w-24 h-16 bg-blue-600 rounded-2xl flex relative">
                            {/* Cockpit */}
                            <div className="w-8 h-12 bg-sky-200 ml-2 mt-2 rounded-xl opacity-80"></div>
                            {/* Tail Boom */}
                            <div className="absolute left-full top-4 w-20 h-4 bg-blue-700">
                                {/* Horizontal Stabilizer (only functional in forward flight) */}
                                <div className={`absolute right-4 top-1 w-6 h-12 bg-indigo-500 rounded -translate-y-1/2 transition-opacity ${scenario === 'forward' ? 'opacity-100' : 'opacity-40'}`}></div>
                                {/* Tail Rotor */}
                                <motion.div className="absolute right-0 top-2 h-10 w-1 bg-slate-800 absolute -translate-y-1/2" animate={{ rotateX: 360 }} transition={{ repeat: Infinity, duration: 0.1, ease: 'linear' as any }} />
                            </div>
                        </div>
                        <div className="w-16 h-2 bg-slate-400 mt-2 rounded-full"></div>
                    </motion.div>

                    {scenario === 'hover' && (
                        <div className="absolute bottom-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-xl flex items-center gap-4 z-40">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                Stability Augmentation System (SAS)
                            </label>
                            <button
                                onClick={() => setSasEnabled(!sasEnabled)}
                                className={`w-12 h-6 rounded-full p-1 transition-colors ${sasEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${sasEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </button>
                        </div>
                    )}
                </div>

                {/* Information Panel */}
                <div className="lg:col-span-5 flex flex-col gap-5">
                    {scenario === 'hover' ? (
                        <>
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 p-6 rounded-2xl relative overflow-hidden">
                                <AlertOctagon className="absolute -right-4 -bottom-4 text-red-100 dark:text-red-900/50" size={100} />
                                <h3 className="font-bold text-red-800 dark:text-red-400 text-lg mb-2 relative z-10">Inherent Instability</h3>
                                <p className="text-sm text-red-700 dark:text-red-300 relative z-10 leading-relaxed mb-4">
                                    Unlike an airplane, a helicopter in a hover is inherently dynamically unstable. If disturbed by a gust of wind, it will not return to its original position naturally.
                                    <br /><br />Instead, the oscillations will grow larger and larger over time unless the pilot (or an SAS) provides corrective input.
                                </p>
                            </div>

                            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 p-5 rounded-xl">
                                <h4 className="font-bold text-emerald-800 dark:text-emerald-400 mb-1 flex items-center gap-2"><CheckCircle2 size={18} /> SAS & AFCS</h4>
                                <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">
                                    To reduce pilot workload, modern helicopters use a Stability Augmentation System (SAS) which detects uncommanded pitch/roll/yaw rates and inputs micro-corrections faster than a human could react.
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800/30 p-6 rounded-2xl relative overflow-hidden">
                                <Plane className="absolute -right-4 -bottom-4 text-sky-100 dark:text-sky-900/50" size={100} />
                                <h3 className="font-bold text-sky-800 dark:text-sky-400 text-lg mb-2 relative z-10">Aerodynamic Stability</h3>
                                <p className="text-sm text-sky-700 dark:text-sky-300 relative z-10 leading-relaxed mb-4">
                                    As forward airspeed increases, the helicopter acts more like an airplane. The relative airflow moving over aerodynamic surfaces (like vertical and horizontal stabilizers) begins to naturally stabilize the aircraft.
                                </p>
                            </div>

                            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800/30 p-5 rounded-xl">
                                <h4 className="font-bold text-indigo-800 dark:text-indigo-400 mb-1 flex items-center gap-2"><Wind size={18} /> Horizontal Stabilizer</h4>
                                <p className="text-xs text-indigo-700 dark:text-indigo-400 leading-relaxed">
                                    Because increasing forward speed requires pitching the nose down, the fuselage produces massive drag. The horizontal stabilizer counters this by pushing the tail DOWN during fast flight, keeping the fuselage relatively level and streamlined.
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Equilibrium;
