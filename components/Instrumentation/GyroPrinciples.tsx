import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, RefreshCw, Zap, Info, ShieldCheck, Activity, Compass, ArrowRight, RotateCw, RotateCcw } from 'lucide-react';

const GyroPrinciples: React.FC = () => {
    const [spinSpeed, setSpinSpeed] = useState(60); // RPM scale (10 to 100)
    const [rotorMass, setRotorMass] = useState(3); // kg mass concentration
    const [spinDirection, setSpinDirection] = useState<'CW' | 'CCW'>('CW');
    const [activeForceAngle, setActiveForceAngle] = useState<number | null>(null);
    const [precessionResultAngle, setPrecessionResultAngle] = useState<number | null>(null);
    const [isAnimatingForce, setIsAnimatingForce] = useState(false);

    // Rigidity is proportional to Angular Momentum L = I * omega
    // Moment of inertia I ~ mass * radius^2
    const angularMomentum = (rotorMass * 0.1) * (spinSpeed * 100);
    const rigidityScore = Math.min(100, Math.round((angularMomentum / 500) * 100));

    // Precession Rate: Omega_p = Torque / (I * omega)
    // High RPM/Mass => LOW precession rate => HIGH stability
    const precessionRateDegSec = (50 / (angularMomentum * 0.05)).toFixed(1);

    // Apply external force at specific angle (0: Top, 90: Right, 180: Bottom, 270: Left)
    const handleApplyForce = (angle: number) => {
        setIsAnimatingForce(true);
        setActiveForceAngle(angle);

        // Resulting movement occurs 90 degrees later in direction of rotation
        const delta = spinDirection === 'CW' ? 90 : -90;
        const result = (angle + delta + 360) % 360;
        setPrecessionResultAngle(result);

        setTimeout(() => {
            setIsAnimatingForce(false);
            setActiveForceAngle(null);
            setPrecessionResultAngle(null);
        }, 2200);
    };

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="mb-10">
                <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-widest mb-2">
                    <span>AGK 022</span>
                    <span>•</span>
                    <span>Gyroscopic Principles</span>
                </div>
                <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
                    <RefreshCw className="text-orange-400 rotate-icon" />
                    Gyroscopic Rigidity & Precession Dynamics
                </h1>
                <p className="text-slate-400 max-w-3xl leading-relaxed text-sm">
                    Gyroscopic flight instruments rely on two fundamental laws of physics: <strong className="text-white">Rigidity in Space</strong> (conservation of angular momentum) and <strong className="text-white">Precession</strong> (the 90° reaction rule).
                    Apply forces to the spinning rotor to observe how external torques translate into flight deck indications.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Control Tower */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow-xl">
                        <h3 className="text-white font-bold mb-5 flex items-center gap-2 text-sm uppercase tracking-wider">
                            <Settings className="w-4 h-4 text-slate-400" />
                            Rotor Parameters & Momentum
                        </h3>

                        <div className="space-y-5">
                            {/* RPM Control */}
                            <div>
                                <label className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                    <span>Rotor Speed (RPM)</span>
                                    <span className="text-orange-400 font-mono font-bold">{(spinSpeed * 150).toLocaleString()} RPM</span>
                                </label>
                                <input
                                    type="range" min="10" max="100" step="5"
                                    value={spinSpeed}
                                    onChange={(e) => setSpinSpeed(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                />
                                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                                    <span>1,500 RPM (Low)</span>
                                    <span>15,000 RPM (Typical)</span>
                                </div>
                            </div>

                            {/* Rotor Mass / Inertia */}
                            <div>
                                <label className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                    <span>Rim Mass Concentration</span>
                                    <span className="text-white font-mono font-bold">{rotorMass} kg (Peripheral)</span>
                                </label>
                                <input
                                    type="range" min="1" max="5" step="1"
                                    value={rotorMass}
                                    onChange={(e) => setRotorMass(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                />
                                <div className="text-[10px] text-slate-500 mt-1">
                                    Higher rim mass increases Moment of Inertia (<span className="text-white font-mono">I = m·r²</span>).
                                </div>
                            </div>

                            {/* Spin Direction */}
                            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                                <span className="text-xs font-bold text-slate-400 uppercase">Spin Direction</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setSpinDirection('CW')}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                                            spinDirection === 'CW' ? 'bg-orange-500 text-white font-black' : 'bg-slate-800 text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        <RotateCw size={13} />
                                        <span>CW</span>
                                    </button>
                                    <button
                                        onClick={() => setSpinDirection('CCW')}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                                            spinDirection === 'CCW' ? 'bg-orange-500 text-white font-black' : 'bg-slate-800 text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        <RotateCcw size={13} />
                                        <span>CCW</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Force Inputs */}
                        <div className="mt-6 pt-6 border-t border-slate-800">
                            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                <Zap className="w-3.5 h-3.5 text-amber-400" />
                                Apply Deflecting Force / Torque
                            </h4>
                            <div className="grid grid-cols-2 gap-2.5">
                                <button
                                    onClick={() => handleApplyForce(0)}
                                    disabled={isAnimatingForce}
                                    className="p-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-between border border-white/5 transition-all"
                                >
                                    <span>Push Top (0°)</span>
                                    <span className="text-amber-400 font-mono text-[10px]">&darr;</span>
                                </button>
                                <button
                                    onClick={() => handleApplyForce(90)}
                                    disabled={isAnimatingForce}
                                    className="p-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-between border border-white/5 transition-all"
                                >
                                    <span>Push Right (90°)</span>
                                    <span className="text-amber-400 font-mono text-[10px]">&larr;</span>
                                </button>
                                <button
                                    onClick={() => handleApplyForce(180)}
                                    disabled={isAnimatingForce}
                                    className="p-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-between border border-white/5 transition-all"
                                >
                                    <span>Push Bottom (180°)</span>
                                    <span className="text-amber-400 font-mono text-[10px]">&uarr;</span>
                                </button>
                                <button
                                    onClick={() => handleApplyForce(270)}
                                    disabled={isAnimatingForce}
                                    className="p-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-between border border-white/5 transition-all"
                                >
                                    <span>Push Left (270°)</span>
                                    <span className="text-amber-400 font-mono text-[10px]">&rarr;</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Momentum Stats Card */}
                    <div className="bg-gradient-to-br from-orange-950/30 to-amber-950/30 border border-orange-500/20 p-5 rounded-2xl space-y-3">
                        <div className="flex justify-between items-center text-xs uppercase font-bold text-slate-300">
                            <span>Angular Momentum (L = I&omega;)</span>
                            <span className="text-orange-400 font-mono">{angularMomentum.toFixed(0)} N·m·s</span>
                        </div>
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                                animate={{ width: `${rigidityScore}%` }}
                                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                            />
                        </div>
                        <div className="text-[11px] text-slate-400 leading-relaxed">
                            <strong className="text-white">Rigidity Index: {rigidityScore}%</strong> — Higher angular momentum keeps the spin axis firmly locked in space, resisting gimbal friction and apparent wander.
                        </div>
                    </div>
                </div>

                {/* Simulation Canvas & Vector Mechanics */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden min-h-[460px] flex flex-col items-center justify-center">
                        {/* Status Header */}
                        <div className="absolute top-6 left-6 right-6 flex justify-between items-center border-b border-slate-800/80 pb-3">
                            <div className="flex items-center gap-2">
                                <Activity className="w-5 h-5 text-orange-400" />
                                <span className="text-xs font-black text-white uppercase tracking-widest">
                                    Precession Reaction Vector Engine
                                </span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-400">
                                Spin: <strong className="text-orange-400">{spinDirection}</strong> @ {(spinSpeed * 150).toLocaleString()} RPM
                            </span>
                        </div>

                        {/* Interactive Rotor Disc Representation */}
                        <div className="relative w-72 h-72 my-10 flex items-center justify-center">
                            {/* Outer Gimbal Ring */}
                            <div className="absolute inset-0 rounded-full border-4 border-slate-800 shadow-[0_0_30px_rgba(0,0,0,0.5)] flex items-center justify-center">
                                {/* Degree Marks around circumference */}
                                <span className="absolute top-2 text-[10px] font-mono font-bold text-slate-500">0° (TOP)</span>
                                <span className="absolute right-2 text-[10px] font-mono font-bold text-slate-500">90°</span>
                                <span className="absolute bottom-2 text-[10px] font-mono font-bold text-slate-500">180°</span>
                                <span className="absolute left-2 text-[10px] font-mono font-bold text-slate-500">270°</span>
                            </div>

                            {/* Inner Spinning Heavy Rotor */}
                            <motion.div
                                animate={{ rotate: spinDirection === 'CW' ? 360 : -360 }}
                                transition={{ repeat: Infinity, duration: 20 / spinSpeed, ease: "linear" }}
                                className="w-52 h-52 rounded-full border-[18px] border-slate-700 bg-slate-950 relative shadow-2xl flex items-center justify-center"
                            >
                                {/* Heavy Rim Spokes */}
                                <div className="absolute w-full h-2.5 bg-slate-800" />
                                <div className="absolute h-full w-2.5 bg-slate-800" />
                                <div className="absolute w-full h-2.5 bg-slate-800 rotate-45" />
                                <div className="absolute w-full h-2.5 bg-slate-800 -rotate-45" />

                                {/* Center Hub / Axle */}
                                <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full border-4 border-slate-900 z-10 flex items-center justify-center shadow-inner">
                                    <div className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-ping" />
                                </div>
                            </motion.div>

                            {/* Applied Input Force Graphic */}
                            <AnimatePresence>
                                {activeForceAngle !== null && (
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.5, opacity: 0 }}
                                        className="absolute z-30 pointer-events-none"
                                        style={{
                                            transform: `rotate(${activeForceAngle}deg) translateY(-145px)`
                                        }}
                                    >
                                        <div className="flex flex-col items-center">
                                            <div className="bg-amber-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded shadow-lg uppercase">
                                                Applied Force
                                            </div>
                                            <div className="w-1.5 h-8 bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.9)] animate-pulse" />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* 90-Degree Precession Result Graphic */}
                            <AnimatePresence>
                                {precessionResultAngle !== null && (
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.5, opacity: 0 }}
                                        className="absolute z-30 pointer-events-none"
                                        style={{
                                            transform: `rotate(${precessionResultAngle}deg) translateY(-145px)`
                                        }}
                                    >
                                        <div className="flex flex-col items-center">
                                            <div className="w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-bounce">
                                                <Zap size={16} className="fill-current" />
                                            </div>
                                            <div className="bg-emerald-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded mt-1 shadow-lg uppercase whitespace-nowrap">
                                                Resultant Precession (+90°)
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Interactive Explanation Dynamic Footer */}
                        <div className="w-full max-w-lg text-center mt-4">
                            <AnimatePresence mode="wait">
                                {isAnimatingForce && activeForceAngle !== null && precessionResultAngle !== null ? (
                                    <motion.div
                                        key="reaction"
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="p-3 bg-emerald-500/15 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold leading-relaxed"
                                    >
                                        Torque applied at <span className="text-white font-mono">{activeForceAngle}°</span>.
                                        Due to gyroscopic precession, motion occurs <span className="text-white underline">90° later</span> in spin direction &rarr; axis tilts at <span className="text-white font-mono">{precessionResultAngle}°</span>!
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="idle"
                                        className="text-slate-400 text-xs leading-relaxed"
                                    >
                                        Click one of the four push points above. Notice that the resultant displacement is deflected exactly <strong>90° downstream</strong> in the direction of rotation.
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Gyroscopic Instruments Applications Matrix */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                            <div className="flex items-center gap-2 mb-2 text-white font-bold text-xs uppercase">
                                <Compass className="w-4 h-4 text-sky-400" />
                                Directional Gyro (DG)
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                                Uses <strong>Rigidity in Space</strong> with a <strong>horizontal spin axis</strong> (2 degrees of freedom). Maintains heading without turning/acceleration errors, but subject to real and apparent earth wander.
                            </p>
                        </div>

                        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                            <div className="flex items-center gap-2 mb-2 text-white font-bold text-xs uppercase">
                                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                Attitude Indicator (AI)
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                                Uses <strong>Rigidity</strong> with a <strong>vertical spin axis</strong> (tied gyro). Pendulous vane or torque motor erection systems correct for wander and keep the rotor aligned with local gravity.
                            </p>
                        </div>

                        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                            <div className="flex items-center gap-2 mb-2 text-white font-bold text-xs uppercase">
                                <Activity className="w-4 h-4 text-orange-400" />
                                Turn Coordinator
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                                Uses <strong>Precession</strong>! A rate gyro with 1 degree of freedom and spring restraint. As the aircraft yaws/rolls, precession torque twists the gimbal against calibrated springs, deflecting the needle.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GyroPrinciples;
