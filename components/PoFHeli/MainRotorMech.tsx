import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings2, ArrowUpCircle, ArrowRightCircle, ArrowDownCircle, Info, Move } from 'lucide-react';

type ControlState = 'neutral' | 'collective_up' | 'cyclic_forward' | 'cyclic_right';

export const MainRotorMech = () => {
    const [activeControl, setActiveControl] = useState<ControlState>('neutral');

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-full">
                    <Settings2 className="text-slate-700 dark:text-slate-300" size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Main-Rotor Mechanics</h1>
                    <p className="text-slate-600 dark:text-slate-400">Swashplate Assembly & Control Inputs</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
                {[
                    { id: 'neutral', name: 'Neutral', icon: Move },
                    { id: 'collective_up', name: 'Collective Pull (Up)', icon: ArrowUpCircle },
                    { id: 'cyclic_forward', name: 'Cyclic Forward', icon: ArrowDownCircle },
                    { id: 'cyclic_right', name: 'Cyclic Right', icon: ArrowRightCircle },
                ].map((ctrl) => (
                    <button
                        key={ctrl.id}
                        onClick={() => setActiveControl(ctrl.id as ControlState)}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${activeControl === ctrl.id
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-400 dark:text-indigo-300 shadow-md'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-300'
                            }`}
                    >
                        <ctrl.icon size={24} />
                        <span className="font-bold text-sm text-center">{ctrl.name}</span>
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* 3D-ish Swashplate Visualizer */}
                <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px]">
                    <div className="relative w-64 h-[300px] flex items-center justify-center -mt-10">
                        {/* Main Mast */}
                        <div className="absolute w-6 h-64 bg-slate-300 dark:bg-slate-600 rounded-full z-0"></div>

                        {/* Swashplate Assembly Group */}
                        <motion.div
                            className="relative w-40 h-20 z-10 flex flex-col items-center justify-center top-12"
                            animate={{
                                y: activeControl === 'collective_up' ? -40 : 0,
                                rotateX: activeControl === 'cyclic_forward' ? 30 : 0,
                                rotateZ: activeControl === 'cyclic_right' ? 15 : 0,
                            }}
                            transition={{ type: 'spring', stiffness: 60 }}
                        >
                            {/* Non-rotating (lower) swashplate */}
                            <div className="w-32 h-6 bg-slate-700 dark:bg-slate-400 rounded-full absolute bottom-2 border-b-4 border-slate-800/50"></div>

                            {/* Rotating (upper) swashplate */}
                            <div className="w-32 h-6 bg-blue-500 border-t-2 border-blue-400 rounded-full absolute top-2 flex justify-between items-center px-2 z-20">
                                {/* Pitch links connecting to blades */}
                                <div className="w-2 h-16 bg-slate-400 absolute -top-16 left-2 origin-bottom transform -rotate-[10deg]"></div>
                                <div className="w-2 h-16 bg-slate-400 absolute -top-16 right-2 origin-bottom transform rotate-[10deg]"></div>
                            </div>
                        </motion.div>

                        {/* Rotor Hub & Blades */}
                        <motion.div
                            className="absolute top-12 w-56 h-8 z-30 flex items-center justify-center"
                            animate={{
                                y: activeControl === 'collective_up' ? 0 : 0, // Hub stays fixed, pitch links pull blades
                            }}
                        >
                            {/* Hub */}
                            <div className="w-12 h-8 bg-slate-800 dark:bg-slate-200 rounded-lg absolute z-30"></div>

                            {/* Left Blade */}
                            <motion.div
                                className="w-32 h-2 bg-slate-500 rounded-l-full absolute right-[50%] origin-right"
                                animate={{
                                    rotateX: activeControl === 'collective_up' ? 45 : (activeControl === 'cyclic_right' ? -45 : 0)
                                }}
                            />
                            {/* Right Blade */}
                            <motion.div
                                className="w-32 h-2 bg-slate-500 rounded-r-full absolute left-[50%] origin-left"
                                animate={{
                                    rotateX: activeControl === 'collective_up' ? 45 : (activeControl === 'cyclic_right' ? 45 : 0)
                                }}
                            />
                        </motion.div>

                        <div className="absolute bottom-4 text-xs font-bold text-slate-400">FRONT VIEW</div>
                    </div>
                </div>

                {/* Info Panel */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-3">
                            The Swashplate Mechanism
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
                            The swashplate translates the pilot's control inputs (which do not rotate) into the moving rotor blades. It consists of a non-rotating lower plate and a rotating upper plate.
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeControl}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800/30 rounded-2xl p-6"
                        >
                            {activeControl === 'neutral' && (
                                <div>
                                    <h3 className="font-bold text-indigo-800 dark:text-indigo-400 mb-2">Neutral State</h3>
                                    <p className="text-sm text-indigo-700 dark:text-indigo-300">
                                        The swashplate is level and lowered. The blades have minimum pitch, producing minimal lift.
                                    </p>
                                </div>
                            )}

                            {activeControl === 'collective_up' && (
                                <div>
                                    <h3 className="font-bold text-indigo-800 dark:text-indigo-400 mb-2">Collective Input</h3>
                                    <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-3">
                                        Pulling the collective lever raises the <strong>entire swashplate assembly vertically</strong> without tilting it.
                                    </p>
                                    <div className="bg-white dark:bg-slate-900/50 p-3 rounded text-sm text-slate-700 dark:text-slate-300 font-medium">
                                        Result: <span className="text-emerald-500">Simultaneously increases the pitch (Angle of Attack) of ALL blades equally.</span> The helicopter climbs.
                                    </div>
                                </div>
                            )}

                            {activeControl === 'cyclic_forward' || activeControl === 'cyclic_right' ? (
                                <div>
                                    <h3 className="font-bold text-indigo-800 dark:text-indigo-400 mb-2">Cyclic Input</h3>
                                    <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-3">
                                        Moving the cyclic stick <strong>tilts the swashplate</strong> in the corresponding direction.
                                    </p>
                                    <div className="bg-white dark:bg-slate-900/50 p-3 rounded text-sm text-slate-700 dark:text-slate-300 font-medium space-y-2">
                                        <p>Result: The pitch of the blades changes cyclically as they rotate around the mast.</p>
                                        <p className="text-amber-600 dark:text-amber-500">
                                            Due to <strong className="underline">Gyroscopic Precession</strong>, the swashplate is rigged to change blade pitch 90° <em>before</em> the desired movement point.
                                        </p>
                                    </div>
                                </div>
                            ) : null}
                        </motion.div>
                    </AnimatePresence>

                    <div className="flex gap-4">
                        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex-1">
                            <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm mb-2">Lead / Lag (Drag) Hinges</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Allow the blades to move back and forth in the plane of rotation to absorb Coriolis forces (conservation of angular momentum) as blades flap up and down.
                            </p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex-1">
                            <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm mb-2">Flapping Hinges</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Allow the blades to move up and down to compensate for Dissymmetry of Lift. Fully articulated rotors have both flapping and drag hinges.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default MainRotorMech;
