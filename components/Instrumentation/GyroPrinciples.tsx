import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, RefreshCw, Zap, Info, ShieldCheck, Activity } from 'lucide-react';

const GyroPrinciples: React.FC = () => {
    const [spinSpeed, setSpinSpeed] = useState(50);
    const [isForceActive, setIsForceActive] = useState(false);
    const [precessionPoint, setPrecessionPoint] = useState<number | null>(null);

    // Simulation: Force applied at 0 or 180 degrees
    // Resultant force (precession) happens 90 degrees later in direction of rotation
    const applyForce = (degrees: number) => {
        setIsForceActive(true);
        setPrecessionPoint((degrees + 90) % 360);
        setTimeout(() => {
            setIsForceActive(false);
            setPrecessionPoint(null);
        }, 1500);
    };

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="mb-12">
                <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
                    <RefreshCw className="text-orange-400 rotate-icon" />
                    Gyroscope Principles
                </h1>
                <p className="text-slate-400 max-w-2xl">
                    Rigidity in Space and Precession. Understand why high RPM is critical and how gyroscopes process external forces.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Control Panel */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                        <h3 className="text-white font-bold mb-6 flex items-center gap-2 text-sm uppercase">
                            <Settings className="w-4 h-4 text-slate-500" />
                            Rotor Status
                        </h3>

                        <div className="space-y-8">
                            <div>
                                <label className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                    <span>RPM (Spin Rate)</span>
                                    <span className="text-white">{spinSpeed * 100} RPM</span>
                                </label>
                                <input
                                    type="range" min="10" max="150" step="5"
                                    value={spinSpeed}
                                    onChange={(e) => setSpinSpeed(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                />
                                <div className="mt-2 text-[10px] text-slate-500">
                                    High RPM = High Angular Momentum = High Rigidity
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-800 space-y-4">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Apply Force</h4>

                            <button
                                onClick={() => applyForce(0)}
                                disabled={isForceActive}
                                className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-all disabled:opacity-50"
                            >
                                <Zap className="text-amber-400 w-4 h-4" />
                                Press Top (0°)
                            </button>

                            <button
                                onClick={() => applyForce(90)}
                                disabled={isForceActive}
                                className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-all disabled:opacity-50"
                            >
                                <Zap className="text-amber-400 w-4 h-4" />
                                Press Side (90°)
                            </button>
                        </div>
                    </div>

                    <div className="bg-orange-500/10 border border-orange-500/20 p-6 rounded-2xl">
                        <h4 className="text-orange-400 font-bold mb-2 flex items-center gap-2 text-sm uppercase">
                            <Info size={16} />
                            Key Definitions
                        </h4>
                        <div className="text-xs text-slate-300 space-y-4 leading-relaxed">
                            <p><strong>1. Rigidity:</strong> The property where the spin axis resists any attempt to change its direction. Increases with Rotor Mass and RPM.</p>
                            <p><strong>2. Precession:</strong> If a force is applied, the rotor tilts as if the force was applied <strong>90° later</strong> in the direction of rotation.</p>
                        </div>
                    </div>
                </div>

                {/* Animation Area */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden">

                        {/* 3D-ish Rotor Representation */}
                        <div className="relative w-80 h-80 flex items-center justify-center">
                            {/* Outer Gimbals (Static-ish) */}
                            <div className="absolute w-full h-full border-4 border-slate-800 rounded-full opacity-30"></div>

                            {/* Inner Rotor */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 2 / (spinSpeed / 50), ease: "linear" }}
                                className="w-64 h-64 border-[24px] border-slate-700 rounded-full relative shadow-2xl flex items-center justify-center"
                            >
                                {/* Rotor Spokes */}
                                <div className="absolute w-full h-2 bg-slate-800"></div>
                                <div className="absolute h-full w-2 bg-slate-800"></div>
                                <div className="w-8 h-8 bg-slate-600 rounded-full border-4 border-slate-900"></div>

                                {/* Rotation Glow */}
                                <div className="absolute inset-0 rounded-full bg-orange-500/5 blur-xl"></div>
                            </motion.div>

                            {/* Precession Indicator */}
                            <AnimatePresence>
                                {precessionPoint !== null && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        className="absolute z-20"
                                        style={{
                                            transform: `rotate(${precessionPoint}deg) translateY(-140px)`
                                        }}
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="p-3 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/40 animate-bounce">
                                                <Activity className="text-white w-6 h-6" />
                                            </div>
                                            <div className="bg-emerald-500 text-white text-[10px] font-black px-2 py-1 rounded uppercase">Precession Point</div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Applied Force Indicator */}
                            <AnimatePresence>
                                {isForceActive && precessionPoint !== null && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute z-30"
                                        style={{
                                            transform: `rotate(${precessionPoint - 90}deg) translateY(-140px)`
                                        }}
                                    >
                                        <div className="flex flex-col items-center gap-1">
                                            <div className="text-amber-500 text-[10px] font-black uppercase">Input Force</div>
                                            <div className="w-1 h-8 bg-amber-500 animate-pulse"></div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Explanation Text */}
                        <div className="mt-16 text-center max-w-md">
                            <AnimatePresence mode="wait">
                                {isForceActive ? (
                                    <motion.div
                                        key="explaining"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="text-emerald-400 font-bold"
                                    >
                                        Notice the "Action" is deflected 90 degrees downstream in the spin direction.
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="default"
                                        className="text-slate-500 text-sm leading-relaxed"
                                    >
                                        Apply a force to see Precession in action. The gyroscope is spinning clockwise.
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Applet Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                            <h4 className="flex items-center gap-2 text-white font-bold mb-4">
                                <ShieldCheck className="text-blue-400 w-4 h-4" />
                                Three Degrees of Freedom
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                A rotor is "Free" if it can move in 3 axes (Spin, Pitch, Roll). A "Tied" gyro has its movement restricted to one or two axes to measure specific rates.
                            </p>
                        </div>
                        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                            <h4 className="flex items-center gap-2 text-white font-bold mb-4">
                                <Activity className="text-orange-400 w-4 h-4" />
                                Gyroscopic Drift
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                <strong>Real Wander:</strong> Caused by friction or unbalance. <br />
                                <strong>Apparent Wander (Earth Rate):</strong> Caused by the Earth rotating away from the gyro's fixed point in space. (15° × sin Latitude).
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Advanced Theory Section (NEW) */}
            <div className="mt-12 pt-12 border-t border-slate-800 grid md:grid-cols-2 gap-12">
                <div>
                    <h3 className="text-xl font-bold text-white mb-6">Gyroscopic Wander</h3>
                    <div className="space-y-4">
                        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 hover:border-orange-500/30 transition-colors">
                            <h4 className="font-bold text-white text-sm mb-1 uppercase tracking-wider">Wander (Horizontal)</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                The drift of the spin axis in the <strong>horizontal</strong> plane.
                                Drift = Real Wander + Apparent Wander.
                            </p>
                        </div>
                        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 hover:border-orange-500/30 transition-colors">
                            <h4 className="font-bold text-white text-sm mb-1 uppercase tracking-wider">Topple (Vertical)</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                The drift of the spin axis in the <strong>vertical</strong> plane.
                                Max at the Poles. Zero at Equator.
                            </p>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-bold text-white mb-6">Apparent Wander Factors</h3>
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 relative overflow-hidden">
                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-4 tracking-widest">The "R.E.S.T" Mnemonic</p>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <span className="bg-orange-500/20 text-orange-400 font-black px-2 rounded text-xs">R</span>
                                <div>
                                    <strong className="text-white text-xs block">Earth Rotation</strong>
                                    <span className="text-[10px] text-slate-400">15°/hr × sin(Lat). Real gyro stays fixed, earth moves.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="bg-blue-500/20 text-blue-400 font-black px-2 rounded text-xs">E</span>
                                <div>
                                    <strong className="text-white text-xs block">Earth Rate</strong>
                                    <span className="text-[10px] text-slate-400">Effect due to Earth's rotation (same as above).</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3 opacity-50">
                                <span className="bg-slate-700 text-slate-400 font-black px-2 rounded text-xs">S</span>
                                <div>
                                    <strong className="text-slate-500 text-xs block">Speed</strong>
                                    <span className="text-[10px] text-slate-600">Transport Wander (Velocity effect).</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="bg-purple-500/20 text-purple-400 font-black px-2 rounded text-xs">T</span>
                                <div>
                                    <strong className="text-white text-xs block">Transport Wander</strong>
                                    <span className="text-[10px] text-slate-400">Caused by moving the gyro across longitudes (E/W movement).</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GyroPrinciples;
