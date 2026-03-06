import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plane, ArrowUp, ArrowRight, ArrowDown } from 'lucide-react';

type FlightStage = 'level' | 'climb' | 'descent' | 'glide' | 'turn';

export const PoFFlightMechanics = () => {
    const [selectedStage, setSelectedStage] = useState<FlightStage>('level');

    const stages: Record<FlightStage, { title: string; description: string; planeRotation: number; thrust: boolean }> = {
        level: {
            title: 'Straight, horizontal, steady flight',
            description: 'Lift equals Weight. Thrust equals Total Drag. The aircraft remains at a constant altitude and speed.',
            planeRotation: 0,
            thrust: true
        },
        climb: {
            title: 'Straight, steady climb',
            description: 'Lift is actually slightly less than Weight! Thrust must overcome both Drag and the rearward component of Weight caused by the pitch up attitude.',
            planeRotation: -15,
            thrust: true
        },
        descent: {
            title: 'Straight, steady descent',
            description: 'Lift is less than Weight. The forward component of Weight balances Drag, and Thrust is reduced or equals idle.',
            planeRotation: 15,
            thrust: true
        },
        glide: {
            title: 'Straight, steady glide',
            description: 'Thrust is zero. The forward component of Weight entirely balances the backward Drag force. Best glide speed is Vmd.',
            planeRotation: 15,
            thrust: false
        },
        turn: {
            title: 'Steady, coordinated turn',
            description: 'Lift is tilted inwards. The vertical component of Lift balances Weight, while the horizontal component (centripetal force) turns the airplane.',
            planeRotation: 0, // Simplified to standard view, but could add bank
            thrust: true
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold mb-4 text-slate-800 dark:text-slate-100">Flight Mechanics</h1>
            <p className="text-gray-600 dark:text-gray-300">
                Understanding the forces acting on an aircraft in various states of steady unaccelerated flight. Explore the relationships between Lift, Weight, Thrust, and Drag.
            </p>

            <div className="flex gap-4 mb-6 flex-wrap">
                {(Object.keys(stages) as FlightStage[]).map((stage) => (
                    <button
                        key={stage}
                        onClick={() => setSelectedStage(stage)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedStage === stage
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                            }`}
                    >
                        {stages[stage].title}
                    </button>
                ))}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center min-h-[400px]">

                <h2 className="text-xl font-bold mb-2 text-blue-600 dark:text-blue-400">
                    {stages[selectedStage].title}
                </h2>
                <p className="text-center text-slate-600 dark:text-slate-400 mb-12 max-w-lg">
                    {stages[selectedStage].description}
                </p>

                <div className="relative w-64 h-64 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-full">
                    {/* Aircraft Icon */}
                    <motion.div
                        initial={{ rotate: 0 }}
                        animate={{
                            rotate: stages[selectedStage].planeRotation,
                            scale: selectedStage === 'turn' ? 1.2 : 1
                        }}
                        transition={{ type: "spring", stiffness: 100 }}
                        className="z-10 text-slate-700 dark:text-slate-300"
                    >
                        <Plane size={64} className={selectedStage === 'turn' ? 'rotate-45' : ''} />
                    </motion.div>

                    {/* LIFT Vector */}
                    <motion.div
                        className="absolute top-0 flex flex-col items-center text-blue-500"
                        animate={{
                            height: selectedStage === 'climb' || selectedStage === 'descent' || selectedStage === 'glide' ? '80px' : '100px',
                            rotate: selectedStage === 'turn' ? 45 : 0
                        }}
                    >
                        <span className="text-xs font-bold mb-1">LIFT</span>
                        <ArrowUp size={24} />
                    </motion.div>

                    {/* WEIGHT Vector */}
                    <div className="absolute bottom-0 flex flex-col items-center text-green-500 h-[100px] justify-end">
                        <ArrowDown size={24} />
                        <span className="text-xs font-bold mt-1">WEIGHT</span>
                    </div>

                    {/* THRUST Vector */}
                    {stages[selectedStage].thrust && (
                        <motion.div
                            className="absolute left-[-20px] flex items-center text-orange-500"
                            animate={{ rotate: stages[selectedStage].planeRotation }}
                        >
                            <span className="text-xs font-bold mr-1">THRUST</span>
                            <ArrowRight size={24} />
                        </motion.div>
                    )}

                    {/* DRAG Vector */}
                    <motion.div
                        className="absolute right-[-20px] flex items-center text-red-500"
                        animate={{ rotate: stages[selectedStage].planeRotation }}
                    >
                        <ArrowRight size={24} className="rotate-180" />
                        <span className="text-xs font-bold ml-1">DRAG</span>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default PoFFlightMechanics;
