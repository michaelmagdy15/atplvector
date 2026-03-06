import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fan, Info, ArrowLeftRight, RotateCw, GitCommit } from 'lucide-react';

type ConfigType = 'single' | 'tandem' | 'coaxial' | 'intermeshing';

const configurations: Record<string, any> = {
    single: {
        name: 'Single Main Rotor',
        description: 'The most common helicopter configuration. Requires a tail rotor (anti-torque rotor) to counteract the main rotor\'s torque effect, otherwise the fuselage would spin in the opposite direction.',
        pros: ['Simplest mechanical design', 'Excellent control responsiveness'],
        cons: ['Tail rotor consumes 10-20% of engine power', 'Tail rotor strike hazard', 'Long tail footprint'],
        icon: <Fan size={48} className="text-slate-700" />,
        animation: {
            main: { rotate: 360, transition: { repeat: Infinity, duration: 1, ease: 'linear' as any } },
            tail: { rotate: 360, transition: { repeat: Infinity, duration: 0.2, ease: 'linear' as any } },
            bodyColor: 'bg-blue-200 dark:bg-blue-800'
        }
    },
    tandem: {
        name: 'Tandem Rotors (e.g., Chinook)',
        description: 'Two large main rotors placed one behind the other (forward and aft), counter-rotating to cancel out torque. Eliminates the need for a tail rotor.',
        pros: ['All engine power goes into lift/thrust', 'Huge lifting capability', 'Large center of gravity range'],
        cons: ['Complex transmission linking both rotors', 'High downwash', 'Interference between front and rear airflow'],
        icon: <ArrowLeftRight size={48} className="text-slate-700" />,
        animation: {
            main1: { rotate: 360, transition: { repeat: Infinity, duration: 1, ease: 'linear' as any } },
            main2: { rotate: -360, transition: { repeat: Infinity, duration: 1, ease: 'linear' as any } },
            bodyColor: 'bg-green-200 dark:bg-green-800'
        }
    },
    coaxial: {
        name: 'Coaxial Rotors (e.g., Kamov)',
        description: 'Two rotors mounted on the same shaft, but rotating in opposite directions. The torque of one cancels the torque of the other.',
        pros: ['No tail rotor needed', 'Very compact footprint', 'Excellent crosswind stability'],
        cons: ['Very complex mechanical rotor head', 'Rotors must be spaced far apart to avoid colliding', 'High drag from tall mast'],
        icon: <RotateCw size={48} className="text-slate-700" />,
        animation: {
            top: { rotate: 360, transition: { repeat: Infinity, duration: 1, ease: 'linear' as any } },
            bottom: { rotate: -360, transition: { repeat: Infinity, duration: 1, ease: 'linear' as any as any } },
            bodyColor: 'bg-purple-200 dark:bg-purple-800'
        }
    },
    intermeshing: {
        name: 'Intermeshing (Synchropter)',
        description: 'Two rotors turning in opposite directions, mounted on angled shafts close together so that the blades intermesh (like an eggbeater) without colliding.',
        pros: ['Excellent hovering efficiency', 'No tail rotor power waste'],
        cons: ['Complex gearboxes', 'Limited forward speed', 'Unique low-G handling characteristics'],
        icon: <GitCommit size={48} className="text-slate-700" />,
        animation: {
            left: { rotate: 360, transition: { repeat: Infinity, duration: 1.2, ease: 'linear' as any } },
            right: { rotate: -360, transition: { repeat: Infinity, duration: 1.2, ease: 'linear' as any } },
            bodyColor: 'bg-orange-200 dark:bg-orange-800'
        }
    }
};

export const RotorcraftTypes = () => {
    const [activeConfig, setActiveConfig] = useState<ConfigType>('single');

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-full">
                    <Fan className="text-slate-700 dark:text-slate-300" size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Rotorcraft Configurations</h1>
                    <p className="text-slate-600 dark:text-slate-400">Understanding aerodynamic trade-offs in helicopter design</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {(Object.keys(configurations) as ConfigType[]).map((key) => (
                    <button
                        key={key}
                        onClick={() => setActiveConfig(key)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${activeConfig === key
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900'
                            }`}
                    >
                        <div className="flex flex-col items-center justify-center text-center space-y-3">
                            <div className={`p-3 rounded-full ${activeConfig === key ? 'bg-blue-100 dark:bg-blue-800' : 'bg-slate-100 dark:bg-slate-800'}`}>
                                {configurations[key].icon}
                            </div>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{configurations[key].name.split(' (')[0]}</span>
                        </div>
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeConfig}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8"
                >
                    {/* Visualizer Panel */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px]">

                        <div className="relative w-64 h-64 flex items-center justify-center">

                            {activeConfig === 'single' && (
                                <div className={`relative w-16 h-48 ${configurations.single.animation.bodyColor} rounded-full shadow-lg flex flex-col items-center justify-start py-8`}>
                                    {/* Main Rotor */}
                                    <motion.div
                                        animate={configurations.single.animation.main}
                                        className="w-48 h-2 bg-slate-400 absolute top-10 border-x-4 border-slate-500 rounded-full"
                                    />
                                    {/* Tail Boom */}
                                    <div className="absolute top-full -mt-4 w-4 h-32 bg-slate-300 dark:bg-slate-600" />
                                    {/* Tail Rotor */}
                                    <motion.div
                                        animate={configurations.single.animation.tail}
                                        className="w-16 h-1 bg-red-400 absolute -bottom-[6.5rem] right-2 border-x-4 border-red-600 rounded-full"
                                    />
                                </div>
                            )}

                            {activeConfig === 'tandem' && (
                                <div className={`relative w-20 h-56 ${configurations.tandem.animation.bodyColor} roundedbr-2xl rounded-tr-2xl rounded-tl-full rounded-bl-full shadow-lg flex flex-col items-center justify-between py-6`}>
                                    {/* Front Rotor */}
                                    <motion.div
                                        animate={configurations.tandem.animation.main1}
                                        className="w-48 h-2 bg-slate-400 absolute top-4 border-x-4 border-slate-500 rounded-full"
                                    />
                                    {/* Rear Rotor */}
                                    <motion.div
                                        animate={configurations.tandem.animation.main2}
                                        className="w-48 h-2 bg-slate-400 absolute bottom-4 border-x-4 border-slate-500 rounded-full"
                                    />
                                </div>
                            )}

                            {activeConfig === 'coaxial' && (
                                <div className={`relative w-20 h-40 ${configurations.coaxial.animation.bodyColor} rounded-[50%_50%_40%_40%] shadow-lg flex flex-col items-center py-6`}>
                                    <div className="absolute -top-8 w-4 h-16 bg-slate-300 dark:bg-slate-600" />
                                    {/* Top Rotor */}
                                    <motion.div
                                        animate={configurations.coaxial.animation.top}
                                        className="w-48 h-2 bg-slate-400 absolute -top-8 border-x-4 border-slate-500 rounded-full"
                                    />
                                    {/* Bottom Rotor */}
                                    <motion.div
                                        animate={configurations.coaxial.animation.bottom}
                                        className="w-48 h-2 bg-slate-400 absolute -top-2 border-x-4 border-slate-500 rounded-full z-10"
                                    />
                                </div>
                            )}

                            {activeConfig === 'intermeshing' && (
                                <div className={`relative w-24 h-40 ${configurations.intermeshing.animation.bodyColor} rounded-full shadow-lg flex justify-between px-2 pt-6`}>
                                    <div className="absolute -top-4 left-4 w-2 h-10 bg-slate-300 dark:bg-slate-600 transform -rotate-12" />
                                    <div className="absolute -top-4 right-4 w-2 h-10 bg-slate-300 dark:bg-slate-600 transform rotate-12" />

                                    {/* Left Angled Rotor */}
                                    <motion.div
                                        animate={configurations.intermeshing.animation.left}
                                        className="w-32 h-2 bg-slate-400 absolute -top-4 left-0 border-x-4 border-slate-500 rounded-full origin-left transform -rotate-12"
                                    />
                                    {/* Right Angled Rotor */}
                                    <motion.div
                                        animate={configurations.intermeshing.animation.right}
                                        className="w-32 h-2 bg-slate-400 absolute -top-4 right-0 border-x-4 border-slate-500 rounded-full origin-right transform rotate-12 z-10"
                                    />
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Information Panel */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">
                                {configurations[activeConfig].name}
                            </h2>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                {configurations[activeConfig].description}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded-xl p-5">
                                <h3 className="font-bold text-green-700 dark:text-green-400 mb-3 flex items-center">
                                    Advantages
                                </h3>
                                <ul className="space-y-2">
                                    {configurations[activeConfig].pros.map((pro, idx) => (
                                        <li key={idx} className="text-sm text-green-800 dark:text-green-300 flex items-start">
                                            <span className="mr-2 mt-1">•</span> {pro}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-xl p-5">
                                <h3 className="font-bold text-red-700 dark:text-red-400 mb-3 flex items-center">
                                    Disadvantages
                                </h3>
                                <ul className="space-y-2">
                                    {configurations[activeConfig].cons.map((con, idx) => (
                                        <li key={idx} className="text-sm text-red-800 dark:text-red-300 flex items-start">
                                            <span className="mr-2 mt-1">•</span> {con}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-xl p-4 flex gap-3">
                            <Info className="text-blue-500 flex-shrink-0" size={20} />
                            <p className="text-sm text-blue-800 dark:text-blue-300">
                                <strong>Torque Reaction:</strong> Newton's Third Law dictates that as the engine turns the rotor in one direction, the fuselage tries to turn in the opposite. Every rotorcraft design must incorporate a method to counteract this torque.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default RotorcraftTypes;
