import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, Zap, Info, ShieldAlert, Activity, RefreshCw } from 'lucide-react';

const AttitudeIndicator: React.FC = () => {
    const [pitch, setPitch] = useState(0);
    const [roll, setRoll] = useState(0);
    const [isAccelerating, setIsAccelerating] = useState(false);
    const [isTurning, setIsTurning] = useState(false);

    // Derived errors
    const errorPitch = isAccelerating ? (isTurning ? 2 : 5) : 0;
    const errorRoll = isAccelerating ? 2 : 0;

    const displayedPitch = pitch + errorPitch;
    const displayedRoll = roll + errorRoll;

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="mb-12">
                <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
                    <Compass className="text-rose-400 font-bold" />
                    Attitude Indicator (AI)
                </h1>
                <p className="text-slate-400 max-w-2xl">
                    The pilot's primary reference. Explore the mechanics of the Earth-Vertical gyro, and how forces like acceleration and turning create visual errors.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Simulator Controls */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                        <h3 className="text-white font-bold mb-6 flex items-center gap-2 text-sm uppercase">
                            <Zap className="text-amber-500 w-4 h-4" />
                            Flight Simulation
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <label className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                    <span>Pitch</span>
                                    <span className="text-white">{pitch}°</span>
                                </label>
                                <input
                                    type="range" min="-20" max="20"
                                    value={pitch}
                                    onChange={(e) => setPitch(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                                />
                            </div>

                            <div>
                                <label className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                    <span>Roll</span>
                                    <span className="text-white">{roll}°</span>
                                </label>
                                <input
                                    type="range" min="-45" max="45"
                                    value={roll}
                                    onChange={(e) => setRoll(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                            </div>

                            <div className="pt-6 border-t border-slate-800 space-y-3">
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Apply Dynamic Forces</h4>

                                <button
                                    onClick={() => setIsAccelerating(!isAccelerating)}
                                    className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${isAccelerating ? 'bg-orange-500/10 border-orange-500/50 text-orange-400' : 'bg-slate-800/50 border-slate-700 text-slate-400'
                                        }`}
                                >
                                    <span className="font-bold">Acceleration Force</span>
                                    <Activity className={isAccelerating ? 'animate-pulse' : ''} />
                                </button>

                                <button
                                    onClick={() => setIsTurning(!isTurning)}
                                    className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${isTurning ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' : 'bg-slate-800/50 border-slate-700 text-slate-400'
                                        }`}
                                >
                                    <span className="font-bold">Turning Force</span>
                                    <RefreshCw className={isTurning ? 'animate-spin' : ''} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-2xl">
                        <h4 className="text-rose-400 font-bold mb-2 flex items-center gap-2 text-sm uppercase">
                            <Info size={16} />
                            AI Errors
                        </h4>
                        <div className="text-xs text-slate-300 space-y-4 leading-relaxed">
                            <p><strong>Acceleration:</strong> Displaces pendulous vanes/pendulums, creating a <strong>FAUX PITCH UP</strong> and bank to the right (SODS error).</p>
                            <p><strong>Turn Error:</strong> After a 180° turn, the AI may show a small climb and bank in the opposite direction due to centrifugal precession.</p>
                        </div>
                    </div>
                </div>

                {/* Instrument Display */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 flex flex-col items-center justify-center relative overflow-hidden h-[500px]">

                        {/* The AI Outer Case */}
                        <div className="w-80 h-80 rounded-full bg-slate-950 border-[12px] border-slate-800 shadow-2xl relative overflow-hidden flex items-center justify-center">

                            {/* Blue/Brown Background (Moving) */}
                            <motion.div
                                animate={{
                                    rotate: -displayedRoll,
                                    translateY: displayedPitch * 4
                                }}
                                className="absolute w-[600px] h-[600px] flex flex-col transition-all duration-300 ease-out"
                            >
                                <div className="h-1/2 bg-sky-600/60 flex items-end justify-center pb-4">
                                    <div className="w-full h-px bg-white/20"></div>
                                </div>
                                <div className="h-1/2 bg-amber-900/60 flex items-start justify-center pt-4 border-t-2 border-white">
                                    <div className="w-full h-px bg-white/10"></div>
                                </div>
                            </motion.div>

                            {/* Reference Lines */}
                            <div className="absolute inset-0 pointer-events-none p-12 flex flex-col justify-between items-center opacity-40">
                                {[20, 15, 10, 5, 0, -5, -10, -15, -20].map((val) => (
                                    <div key={val} className={`bg-white h-px ${val % 10 === 0 ? 'w-24' : 'w-12'}`}></div>
                                ))}
                            </div>

                            {/* Fixed Aircraft Symbol (W-Shape) */}
                            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                                <div className="flex items-center gap-12">
                                    <div className="w-16 h-2 bg-rose-500 rounded-full border border-black shadow-lg"></div>
                                    <div className="w-4 h-4 rounded-full bg-rose-500 border border-black shadow-lg"></div>
                                    <div className="w-16 h-2 bg-rose-500 rounded-full border border-black shadow-lg"></div>
                                </div>
                            </div>

                            {/* Bank Index Tooltip */}
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center flex-col gap-1">
                                <div className="w-0.5 h-4 bg-white"></div>
                                <div className="text-[8px] font-black text-white uppercase tracking-widest">Bank Index</div>
                            </div>
                        </div>

                        {/* Status Label */}
                        <div className="mt-8 flex gap-4">
                            {isAccelerating && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="px-4 py-2 bg-orange-500/20 border border-orange-500/50 rounded-full text-xs font-black text-orange-400 uppercase tracking-widest"
                                >
                                    Acceleration Error Active
                                </motion.div>
                            )}
                            {isTurning && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-full text-xs font-black text-blue-400 uppercase tracking-widest"
                                >
                                    Centrifugal Error Active
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Mechanics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                            <h4 className="flex items-center gap-2 text-white font-bold mb-4">
                                <Activity className="text-blue-400 w-4 h-4" />
                                Earth Vertical Gyro
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                The AI uses a <strong>vertical axis rotor</strong>. To keep it aligned with gravity, it uses <strong>Pendulous Vanes</strong> (Pneumatic) or <strong>Torque Motors</strong> (Electric) to correct for drift and precession.
                            </p>
                        </div>
                        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                            <h4 className="flex items-center gap-2 text-white font-bold mb-4">
                                <ShieldAlert className="text-rose-400 w-4 h-4" />
                                Gimbal Lock (Toppling)
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Mechanical AIs have limits (typically 60-70° pitch, 100° roll). Exceeding these causes <strong>Gimbal Lock</strong>, where the gyro becomes unstable and "topples," providing useless indications.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttitudeIndicator;
