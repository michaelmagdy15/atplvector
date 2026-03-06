import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MousePointer2, Info } from 'lucide-react';

export const PoFControl = () => {
    const [elevatorPos, setElevatorPos] = useState(0); // -100 to 100
    const [trimPos, setTrimPos] = useState(0); // -100 to 100

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold mb-4 text-slate-800 dark:text-slate-100 flex items-center">
                <MousePointer2 className="mr-3 text-blue-500" />
                Flight Controls & Balancing
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
                Primary flight controls manipulate aerodynamic forces to change the aircraft's attitude. Aerodynamic balancing (like trim tabs, balance tabs, and horn balances) reduces the physical force required by the pilot to move these surfaces.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Control Panel */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">Cockpit Inputs</h2>

                    <div>
                        <div className="flex justify-between text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            <span>Elevator Yoke Position</span>
                            <span>{elevatorPos > 0 ? `PULL ${elevatorPos}%` : elevatorPos < 0 ? `PUSH ${Math.abs(elevatorPos)}%` : 'NEUTRAL'}</span>
                        </div>
                        <input
                            type="range"
                            min="-100"
                            max="100"
                            value={elevatorPos}
                            onChange={(e) => setElevatorPos(Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            <span>Trim Wheel</span>
                            <span>{trimPos > 0 ? `NOSE UP ${trimPos}%` : trimPos < 0 ? `NOSE DOWN ${Math.abs(trimPos)}%` : 'NEUTRAL'}</span>
                        </div>
                        <input
                            type="range"
                            min="-100"
                            max="100"
                            value={trimPos}
                            onChange={(e) => setTrimPos(Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
                        />
                    </div>

                    <button
                        onClick={() => { setElevatorPos(0); setTrimPos(0); }}
                        className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors"
                    >
                        Reset Controls
                    </button>
                </div>

                {/* Physics Visualizer */}
                <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm min-h-[300px] flex col-span-1 items-center justify-center relative overflow-hidden">

                    <div className="text-center absolute top-4 w-full">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Horizontal Stabilizer & Elevator</span>
                    </div>

                    <div className="relative w-80 h-24 flex items-center">
                        {/* Static Horizontal Stabilizer */}
                        <div className="w-1/2 h-8 bg-blue-200 dark:bg-blue-900 rounded-[50%_0_0_50%/100%] border-2 border-r-0 border-blue-400 dark:border-blue-700 z-10" />

                        {/* Moving Elevator */}
                        <motion.div
                            className="w-1/2 h-6 bg-slate-300 dark:bg-slate-600 rounded-[0_80%_80%_0/100%] border-2 border-slate-400 dark:border-slate-500 origin-left flex items-center justify-end"
                            animate={{ rotate: -(elevatorPos * 0.25) }} // -25 to 25 degrees
                            transition={{ type: "spring", stiffness: 120, damping: 15 }}
                        >
                            {/* Moving Trim Tab - Moves opposite to elevator theoretically, but here controlled by trim */}
                            <motion.div
                                className="w-8 h-2 bg-red-400 dark:bg-red-600 absolute right-2 border border-red-500 origin-left rounded-sm"
                                animate={{ rotate: (trimPos * 0.3) }} // Moves to push elevator
                            />
                        </motion.div>
                    </div>

                    {/* Wind Forces Animation */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute h-[1px] bg-black dark:bg-white w-full"
                                style={{ top: `${15 + i * 15}%` }}
                                animate={{ x: ['100%', '-100%'] }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: i * 0.2 }}
                            />
                        ))}
                    </div>
                </div>

            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex gap-3 text-sm text-blue-800 dark:text-blue-300">
                <Info className="flex-shrink-0 mt-0.5 text-blue-500" size={18} />
                <div>
                    <p className="mb-2"><strong>How Trim Works:</strong> The small red trim tab moves in the <em>opposite</em> direction of the desired elevator movement. The air hitting this small tab generates a force that pushes the main elevator surface in the intended direction, holding it there without continuous pilot effort.</p>
                    <p><strong>Control Force (Stick Force):</strong> A pilot feels the resistance of airflow trying to push the elevator back to neutral. Trim tabs relieve this pressure so the pilot can release the yoke.</p>
                </div>
            </div>

        </div>
    );
};

export default PoFControl;
