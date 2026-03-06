import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Wind, ArrowDown, ArrowUp, Activity, CheckCircle2 } from 'lucide-react';

type FlightState = 'IGE' | 'OGE' | 'TRANSLATIONAL' | 'AUTOROTATION';

const flightStates = {
    IGE: {
        id: 'IGE',
        name: 'In Ground Effect (IGE)',
        description: 'Hovering close to the ground (within one rotor diameter). The ground interrupts the downward airflow and rotational vortices, creating a "cushion" of denser air. This requires significantly less engine power to maintain a hover.',
        powerReq: 'Low',
        airflow: 'down-cushion',
    },
    OGE: {
        id: 'OGE',
        name: 'Out of Ground Effect (OGE)',
        description: 'Hovering high above the ground. The rotor must push massive amounts of air downwards without the benefit of a ground cushion. Wingtip vortices are larger and induce higher descending velocity (induced drag). Requires much more power.',
        powerReq: 'High',
        airflow: 'down-free',
    },
    TRANSLATIONAL: {
        id: 'TRANSLATIONAL',
        name: 'Translational Lift',
        description: 'As the helicopter moves forward (typically passing 15-20 knots), it outruns its own downwash vortices and enters clean, undisturbed air. The rotor disc becomes highly efficient, producing more lift for the same power.',
        powerReq: 'Medium',
        airflow: 'diagonal',
    },
    AUTOROTATION: {
        id: 'AUTOROTATION',
        name: 'Autorotation',
        description: 'Engine failure! The pilot lowers the collective immediately. Instead of the engine driving the rotor pushing air DOWN, the helicopter\'s descent pushes air UP through the rotor disc, keeping it spinning. This spinning energy is then used to flare and land softly.',
        powerReq: 'Zero',
        airflow: 'up',
    }
};

export const FlightMech = () => {
    const [activeState, setActiveState] = useState<FlightState>('IGE');

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-full">
                    <Plane className="text-slate-700 dark:text-slate-300" size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Helicopter Flight Mechanics</h1>
                    <p className="text-slate-600 dark:text-slate-400">Hover states, translational lift, and autorotation</p>
                </div>
            </div>

            {/* State Selector */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.values(flightStates).map((state) => (
                    <button
                        key={state.id}
                        onClick={() => setActiveState(state.id as FlightState)}
                        className={`p-3 rounded-xl border font-bold text-sm transition-all ${activeState === state.id
                                ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                            }`}
                    >
                        {state.name}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">

                {/* Simulation Canvas */}
                <div className="lg:col-span-8 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 relative overflow-hidden flex flex-col items-center justify-center min-h-[500px]">

                    {/* Background elements */}
                    <div className="absolute bottom-0 w-full h-[20%] bg-emerald-700/20 dark:bg-emerald-900/30 border-t-4 border-emerald-600/50" />

                    {/* Helicopter Sprite */}
                    <motion.div
                        className="relative z-20 flex flex-col items-center"
                        animate={{
                            y: activeState === 'IGE' ? 120 : activeState === 'AUTOROTATION' ? [-150, 0] : -50,
                            x: activeState === 'TRANSLATIONAL' ? [-100, 100] : 0,
                            rotate: activeState === 'TRANSLATIONAL' ? 10 : 0
                        }}
                        transition={{
                            y: activeState === 'AUTOROTATION' ? { duration: 3, ease: "linear", repeat: Infinity } : { type: 'spring', stiffness: 40 },
                            x: activeState === 'TRANSLATIONAL' ? { duration: 4, ease: "linear", repeat: Infinity } : { type: 'spring', stiffness: 40 }
                        }}
                    >
                        {/* The Rotor */}
                        <motion.div
                            className="w-48 h-2 bg-slate-800 dark:bg-slate-200 rounded-full z-20"
                            animate={{ rotateY: 360 }}
                            transition={{ repeat: Infinity, duration: activeState === 'AUTOROTATION' ? 0.3 : 0.1, ease: 'linear' as any }}
                        />
                        <div className="w-2 h-6 bg-slate-600"></div>
                        <div className="w-24 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg relative">
                            {/* Cockpit Window */}
                            <div className="absolute right-2 top-2 w-6 h-6 bg-sky-200 dark:bg-sky-900 rounded-full opacity-80 mix-blend-screen" />
                            {/* Tail Boom (Side view) */}
                            <div className="absolute -left-16 top-4 w-18 h-2 bg-blue-800 dark:bg-blue-400"></div>
                            {/* Tail Rotor */}
                            <motion.div
                                className="absolute -left-16 top-0 w-2 h-10 bg-slate-800 dark:bg-slate-200"
                                animate={{ rotateX: 360 }}
                                transition={{ repeat: Infinity, duration: 0.1, ease: 'linear' as any }}
                            />
                            {/* Skids */}
                            <div className="absolute -bottom-4 w-16 h-2 border-b-2 border-slate-500 rounded-b-lg"></div>
                        </div>

                    </motion.div>

                    {/* Airflow Particles based on state */}
                    <AnimatePresence>
                        {/* Downward Airflow (IGE/OGE) */}
                        {(activeState === 'IGE' || activeState === 'OGE') && (
                            <motion.div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
                                {[...Array(8)].map((_, i) => (
                                    <motion.div
                                        key={`down-${i}`}
                                        className="absolute w-1 h-12 bg-sky-400/40 dark:bg-sky-300/20 rounded-full"
                                        style={{ left: `${35 + i * 4}%` }}
                                        initial={{ y: activeState === 'IGE' ? '60%' : '30%', opacity: 0 }}
                                        animate={{ y: '100%', opacity: [0, 1, 0] }}
                                        transition={{ repeat: Infinity, duration: 1, delay: i * 0.1, ease: 'linear' as any }}
                                    />
                                ))}
                            </motion.div>
                        )}

                        {/* Ground Cushion Expansion (IGE only - moving outward) */}
                        {activeState === 'IGE' && (
                            <motion.div className="absolute bottom-[20%] w-[300px] h-[40px] z-10 border-t-2 border-l-2 border-r-2 border-sky-400/30 rounded-t-[100%] opacity-50">
                                {/* Visual representation of ground cushion */}
                            </motion.div>
                        )}

                        {/* Upward Airflow (Autorotation) */}
                        {activeState === 'AUTOROTATION' && (
                            <motion.div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
                                {[...Array(12)].map((_, i) => (
                                    <motion.div
                                        key={`up-${i}`}
                                        className="absolute w-1 h-16 bg-emerald-400/40 dark:bg-emerald-300/30 rounded-full"
                                        style={{ left: `${20 + (i * 5)}%` }}
                                        initial={{ y: '100%', opacity: 0 }}
                                        animate={{ y: '-20%', opacity: [0, 1, 0] }}
                                        transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.05, ease: 'linear' as any }}
                                    />
                                ))}
                            </motion.div>
                        )}

                        {/* Horizontal Translational Airflow */}
                        {activeState === 'TRANSLATIONAL' && (
                            <motion.div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
                                {[...Array(10)].map((_, i) => (
                                    <motion.div
                                        key={`horiz-${i}`}
                                        className="absolute h-1 w-24 bg-sky-500/30 dark:bg-sky-300/20 rounded-full"
                                        style={{ top: `${20 + i * 8}%` }}
                                        initial={{ x: '100%', opacity: 0 }}
                                        animate={{ x: '-10%', opacity: [0, 1, 0] }}
                                        transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1, ease: 'linear' as any }}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Ground Effect Label Overlay */}
                    {activeState === 'IGE' && (
                        <div className="absolute bottom-[10%] bg-white/80 dark:bg-slate-900/80 px-3 py-1 rounded shadow text-xs font-bold text-sky-700 dark:text-sky-400 z-30">
                            Ground Cushion
                        </div>
                    )}
                </div>

                {/* Explanation Panel */}
                <div className="lg:col-span-4 flex flex-col gap-4">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex-1">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
                            {flightStates[activeState].name}
                        </h2>

                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                            {flightStates[activeState].description}
                        </p>

                        <div className="space-y-4">
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                                <h3 className="text-xs uppercase font-bold text-slate-500 mb-1">Power Required</h3>
                                <div className={`font-bold text-lg ${flightStates[activeState].powerReq === 'High' ? 'text-red-500' :
                                        flightStates[activeState].powerReq === 'Zero' ? 'text-emerald-500' :
                                            flightStates[activeState].powerReq === 'Medium' ? 'text-amber-500' :
                                                'text-blue-500'
                                    }`}>
                                    {flightStates[activeState].powerReq}
                                </div>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                                <h3 className="text-xs uppercase font-bold text-slate-500 mb-1">Rotor Airflow Direction</h3>
                                <div className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                    {flightStates[activeState].airflow.includes('down') ? <ArrowDown className="text-sky-500" /> : <ArrowUp className="text-emerald-500" />}
                                    {flightStates[activeState].airflow === 'up' ? 'UP (Driven by descent)' : 'DOWN (Driven by engine)'}
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Key Takeaway box */}
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800/30">
                        <div className="flex gap-3">
                            <CheckCircle2 className="text-emerald-500 flex-shrink-0" size={24} />
                            <div>
                                <h4 className="font-bold text-emerald-800 dark:text-emerald-400 text-sm mb-1">Exam Pro Tip</h4>
                                <p className="text-xs text-emerald-700 dark:text-emerald-500">
                                    {activeState === 'AUTOROTATION' ? 'In autorotation, the inner part of the blade is stalled, the middle part drives the rotor, and the outer part produces lift.' :
                                        activeState === 'IGE' ? 'Entering ground effect reduces induced drag, requiring less pitch (and less engine power) to maintain hover.' :
                                            activeState === 'TRANSLATIONAL' ? 'Translational lift occurs when the rotor moves forward fast enough to outrun its old vortices, acting more like an airplane wing.' :
                                                'Transitioning from IGE to OGE hover requires a significant increase in power to combat increased induced drag.'}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default FlightMech;
