import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Settings, 
    Plane, 
    ArrowUp, 
    ArrowDown, 
    ArrowLeft, 
    ArrowRight, 
    RotateCcw, 
    RotateCw, 
    Shield, 
    Activity, 
    AlertTriangle, 
    Scale, 
    CheckCircle2,
    Compass,
    Layers
} from 'lucide-react';

const FlightControlsSystem: React.FC = () => {
    // Primary Controls
    const [elevator, setElevator] = useState(0); // -100 to 100
    const [aileron, setAileron] = useState(0); // -100 to 100
    const [rudder, setRudder] = useState(0); // -100 to 100

    // Secondary Controls
    const [flaps, setFlaps] = useState(0); // 0, 1, 5, 15, 25, 40
    const [slats, setSlats] = useState(false);
    const [spoilers, setSpoilers] = useState(0); // 0 to 100
    const [trimElevator, setTrimElevator] = useState(0);

    // Interactive Flutter Mode Toggle
    const [massBalanceMode, setMassBalanceMode] = useState<'balanced' | 'unbalanced'>('balanced');

    // Structural Load Factor state
    const [gLoad, setGLoad] = useState<number>(1.0); // 1.0g nominal

    const flapPositions = [0, 1, 5, 15, 25, 40];

    // Limit load criteria for transport category:
    // Clean: +2.5g to -1.0g
    // Flaps: +2.0g to 0.0g
    const limitMax = flaps > 0 ? 2.0 : 2.5;
    const ultimateMax = limitMax * 1.5;
    const isOverLimit = gLoad > limitMax;
    const isOverUltimate = gLoad > ultimateMax;

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 min-h-screen">
            {/* Header */}
            <div>
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-blue-400 mb-2">
                    <span>EASA 021.04</span>
                    <span>•</span>
                    <span>Aircraft General Knowledge</span>
                    <span>•</span>
                    <span>Flight Controls & Aeroelasticity</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight flex items-center gap-3">
                    <Plane className="text-blue-500 w-10 h-10" />
                    Flight Controls & Aeroelastic Flutter
                </h1>
                <p className="text-slate-400 mt-2 max-w-3xl text-base md:text-lg">
                    Primary aerodynamic control surfaces, high-lift devices, irreversible hydraulic PCUs, control surface mass balancing, and structural g-load boundaries.
                </p>
            </div>

            {/* Main Interactive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Aircraft Visualization */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-8 relative min-h-[480px] flex items-center justify-center overflow-hidden">
                    {/* Background Grid */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />

                    {/* Aircraft Schematic */}
                    <div className="relative w-80 h-80">
                        {/* Fuselage */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-52 bg-slate-700 rounded-full border border-slate-600 shadow-xl" />

                        {/* Nose */}
                        <div className="absolute left-1/2 top-6 -translate-x-1/2 w-8 h-8 bg-slate-600 rounded-full border border-slate-500" />

                        {/* Wings */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-8 flex items-center justify-center">
                            {/* Left Wing */}
                            <motion.div
                                className="h-5 w-36 bg-gradient-to-l from-slate-600 to-slate-700 rounded-l-full relative border border-slate-600"
                                animate={
                                    massBalanceMode === 'unbalanced'
                                        ? { rotateX: [aileron * 0.3 - 15, aileron * 0.3 + 15, aileron * 0.3 - 15] }
                                        : { rotateX: aileron * 0.3 }
                                }
                                transition={
                                    massBalanceMode === 'unbalanced'
                                        ? { repeat: Infinity, duration: 0.25, ease: "easeInOut" }
                                        : {}
                                }
                            >
                                {/* Left Aileron */}
                                <motion.div
                                    className="absolute right-0 top-0 h-full w-10 bg-blue-500/70 rounded-l border-l border-blue-300"
                                    animate={{ rotateX: aileron * 0.5 }}
                                    style={{ transformOrigin: 'right' }}
                                />
                                {/* Slats */}
                                {slats && (
                                    <div className="absolute -top-1.5 left-4 w-20 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                                )}
                                {/* Flap */}
                                <div 
                                    className={`absolute -bottom-2 right-10 w-14 h-2.5 ${flaps > 0 ? 'bg-emerald-500' : 'bg-slate-500'} rounded transition-all shadow-md`}
                                    style={{ transform: `rotate(${flaps * 0.5}deg)` }}
                                />
                                {/* Spoilers */}
                                {spoilers > 0 && (
                                    <div 
                                        className="absolute -top-2 right-10 w-12 h-2 bg-amber-500 rounded border border-amber-300"
                                        style={{ transform: `rotate(-${spoilers * 0.4}deg)` }}
                                    />
                                )}
                            </motion.div>

                            {/* Right Wing */}
                            <motion.div
                                className="h-5 w-36 bg-gradient-to-r from-slate-600 to-slate-700 rounded-r-full relative border border-slate-600"
                                animate={
                                    massBalanceMode === 'unbalanced'
                                        ? { rotateX: [-aileron * 0.3 + 15, -aileron * 0.3 - 15, -aileron * 0.3 + 15] }
                                        : { rotateX: -aileron * 0.3 }
                                }
                                transition={
                                    massBalanceMode === 'unbalanced'
                                        ? { repeat: Infinity, duration: 0.25, ease: "easeInOut" }
                                        : {}
                                }
                            >
                                {/* Right Aileron */}
                                <motion.div
                                    className="absolute left-0 top-0 h-full w-10 bg-blue-500/70 rounded-r border-r border-blue-300"
                                    animate={{ rotateX: -aileron * 0.5 }}
                                    style={{ transformOrigin: 'left' }}
                                />
                                {/* Slats */}
                                {slats && (
                                    <div className="absolute -top-1.5 right-4 w-20 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                                )}
                                {/* Flap */}
                                <div 
                                    className={`absolute -bottom-2 left-10 w-14 h-2.5 ${flaps > 0 ? 'bg-emerald-500' : 'bg-slate-500'} rounded transition-all shadow-md`}
                                    style={{ transform: `rotate(-${flaps * 0.5}deg)` }}
                                />
                                {/* Spoilers */}
                                {spoilers > 0 && (
                                    <div 
                                        className="absolute -top-2 left-10 w-12 h-2 bg-amber-500 rounded border border-amber-300"
                                        style={{ transform: `rotate(-${spoilers * 0.4}deg)` }}
                                    />
                                )}
                            </motion.div>
                        </div>

                        {/* Horizontal Stabilizer (Elevators) */}
                        <div className="absolute left-1/2 bottom-14 -translate-x-1/2 flex items-center">
                            <motion.div
                                className="h-3 w-18 bg-slate-600 rounded-l-full border border-slate-500"
                                animate={{ rotateX: elevator * 0.4 }}
                            />
                            <motion.div
                                className="h-3 w-18 bg-slate-600 rounded-r-full border border-slate-500"
                                animate={{ rotateX: elevator * 0.4 }}
                            />
                        </div>

                        {/* Vertical Stabilizer (Rudder) */}
                        <motion.div
                            className="absolute left-1/2 bottom-14 -translate-x-1/2 w-4 h-14 bg-amber-600 rounded-t border border-amber-400 shadow-md origin-bottom"
                            animate={{ rotateY: rudder * 0.4 }}
                        />

                        {/* Live Readout Overlay */}
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-4 text-xs font-mono font-bold whitespace-nowrap bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
                            <span className="text-blue-400">Ail: {aileron}%</span>
                            <span className="text-emerald-400">Elev: {elevator}%</span>
                            <span className="text-amber-400">Rud: {rudder}%</span>
                            <span className="text-purple-400">Trim: {trimElevator}%</span>
                        </div>
                    </div>

                    {/* Flutter Alert Badge */}
                    {massBalanceMode === 'unbalanced' && (
                        <div className="absolute top-4 left-4 px-4 py-2 bg-red-600/20 border-2 border-red-500 text-red-300 text-xs font-black uppercase rounded-xl flex items-center gap-2 animate-pulse">
                            <AlertTriangle size={16} className="text-red-400" />
                            AEROELASTIC FLUTTER ACTIVE (CG AFT OF HINGE)
                        </div>
                    )}
                </div>

                {/* Primary & Secondary Controls Panel */}
                <div className="space-y-6">
                    {/* Primary Controls */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                        <h3 className="text-white font-bold text-sm uppercase tracking-wider flex items-center justify-between">
                            <span>Primary Controls</span>
                            <span className="text-[10px] font-mono text-blue-400">Pitch / Roll / Yaw</span>
                        </h3>

                        {/* Elevator */}
                        <div>
                            <div className="flex justify-between text-xs text-slate-400 mb-1">
                                <span className="flex items-center gap-1 font-mono"><ArrowUp size={12} /> Nose Up</span>
                                <span className="font-bold text-white">Elevator ({elevator}%)</span>
                                <span className="flex items-center gap-1 font-mono">Nose Down <ArrowDown size={12} /></span>
                            </div>
                            <input
                                type="range"
                                min="-100" max="100" value={elevator}
                                onChange={(e) => setElevator(Number(e.target.value))}
                                className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                            />
                        </div>

                        {/* Aileron */}
                        <div>
                            <div className="flex justify-between text-xs text-slate-400 mb-1">
                                <span className="flex items-center gap-1 font-mono"><RotateCcw size={12} /> Roll L</span>
                                <span className="font-bold text-white">Ailerons ({aileron}%)</span>
                                <span className="flex items-center gap-1 font-mono">Roll R <RotateCw size={12} /></span>
                            </div>
                            <input
                                type="range"
                                min="-100" max="100" value={aileron}
                                onChange={(e) => setAileron(Number(e.target.value))}
                                className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                            />
                        </div>

                        {/* Rudder */}
                        <div>
                            <div className="flex justify-between text-xs text-slate-400 mb-1">
                                <span className="flex items-center gap-1 font-mono"><ArrowLeft size={12} /> Yaw L</span>
                                <span className="font-bold text-white">Rudder ({rudder}%)</span>
                                <span className="flex items-center gap-1 font-mono">Yaw R <ArrowRight size={12} /></span>
                            </div>
                            <input
                                type="range"
                                min="-100" max="100" value={rudder}
                                onChange={(e) => setRudder(Number(e.target.value))}
                                className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Secondary Controls (High Lift Devices) */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                        <h3 className="text-white font-bold text-sm uppercase tracking-wider flex items-center justify-between">
                            <span>High-Lift Devices</span>
                            <span className="text-[10px] font-mono text-emerald-400">Flaps & Slats</span>
                        </h3>

                        {/* Flaps */}
                        <div>
                            <span className="text-xs text-slate-400 block mb-2 font-mono">Trailing Edge Flaps (° deflection)</span>
                            <div className="grid grid-cols-6 gap-1">
                                {flapPositions.map((pos) => (
                                    <button
                                        key={pos}
                                        onClick={() => setFlaps(pos)}
                                        className={`py-2 text-xs font-bold font-mono rounded-lg transition-all ${
                                            flaps === pos
                                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                        }`}
                                    >
                                        {pos}°
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Slats & Spoilers */}
                        <div className="flex items-center justify-between pt-2">
                            <span className="text-xs text-slate-300 font-bold">Leading Edge Slats</span>
                            <button
                                onClick={() => setSlats(!slats)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    slats ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30' : 'bg-slate-800 text-slate-400'
                                }`}
                            >
                                {slats ? 'EXTENDED' : 'RETRACTED'}
                            </button>
                        </div>

                        <div>
                            <div className="flex justify-between text-xs text-slate-400 mb-1">
                                <span>Speedbrakes / Flight Spoilers</span>
                                <span className="font-mono text-amber-400 font-bold">{spoilers}%</span>
                            </div>
                            <input
                                type="range"
                                min="0" max="100" value={spoilers}
                                onChange={(e) => setSpoilers(Number(e.target.value))}
                                className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Reset Controls Button */}
                    <button
                        onClick={() => {
                            setElevator(0);
                            setAileron(0);
                            setRudder(0);
                            setFlaps(0);
                            setSlats(false);
                            setSpoilers(0);
                            setTrimElevator(0);
                        }}
                        className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-colors text-xs uppercase tracking-wider"
                    >
                        Reset All Control Surfaces to Neutral
                    </button>
                </div>
            </div>

            {/* TECHNICAL FLIGHT CONTROL MODULES */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 1. Flutter Suppression & Mass Balancing */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Activity className="text-blue-400" />
                            Control Surface Mass Balancing
                        </h3>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setMassBalanceMode('balanced')}
                                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                    massBalanceMode === 'balanced'
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-slate-800 text-slate-400'
                                }`}
                            >
                                BALANCED
                            </button>
                            <button
                                onClick={() => setMassBalanceMode('unbalanced')}
                                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                    massBalanceMode === 'unbalanced'
                                        ? 'bg-red-600 text-white'
                                        : 'bg-slate-800 text-slate-400'
                                }`}
                            >
                                UNBALANCED
                            </button>
                        </div>
                    </div>

                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                        <h4 className="text-xs font-mono uppercase text-blue-400 font-bold">
                            Cockpit Mental Model: "Mass Balancing as a Lever"
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            Control surfaces must have their <strong>Center of Gravity positioned forward of the hinge line</strong>. Lead or depleted uranium weights placed on extensions forward of the hinge act as a lever. When a gust bends the wing upward, inertia on the forward weight forces the trailing edge down, instantly damping the twisting oscillation and suppressing catastrophic flutter!
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                            <strong className="text-white block mb-1">Flexural / Torsional Flutter</strong>
                            <p className="text-slate-400">
                                Dynamic aeroelastic coupling between wing bending and wing twisting. Frequency matches natural resonance; can rip wings off in under 2 seconds!
                            </p>
                        </div>
                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                            <strong className="text-amber-400 block mb-1">Control Surface Buzz</strong>
                            <p className="text-slate-400">
                                Transonic shockwave boundary layer interaction over ailerons at high Mach numbers (M &gt; 0.82). Prevented by irreversible hydraulic actuators.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 2. Limit Load vs Ultimate Load & Philosophies */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Scale className="text-purple-400" />
                        Transport Category Load Factor Envelope (CS-25)
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">Clean Configuration</span>
                            <div className="text-2xl font-black text-white font-mono">+2.5g / -1.0g</div>
                            <span className="text-[11px] text-slate-400 mt-1 block">Ultimate: +3.75g (1.5x factor)</span>
                        </div>

                        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">Flaps Extended</span>
                            <div className="text-2xl font-black text-white font-mono">+2.0g / 0.0g</div>
                            <span className="text-[11px] text-slate-400 mt-1 block">Ultimate: +3.00g (1.5x factor)</span>
                        </div>
                    </div>

                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                        <h4 className="text-xs font-mono uppercase text-purple-400 font-bold">
                            Structural Design Trilogy Summary
                        </h4>
                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                                <strong className="text-amber-400 block">Safe Life</strong>
                                <span className="text-[10px] text-slate-400">Scrapped after fixed hours/cycles.</span>
                            </div>
                            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                                <strong className="text-blue-400 block">Fail-Safe</strong>
                                <span className="text-[10px] text-slate-400">Redundant multiple load paths.</span>
                            </div>
                            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                                <strong className="text-emerald-400 block">Damage Tol.</strong>
                                <span className="text-[10px] text-slate-400">Inspect cracks before critical size.</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-amber-950/20 border border-amber-500/30 p-4 rounded-2xl text-xs text-amber-200/90 leading-relaxed flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                            <strong>ATPL Exam Rule: Ultimate Load 3-Second Requirement</strong><br />
                            Under EASA CS-25, the airframe must be capable of carrying the Ultimate Load for <strong>at least 3 seconds</strong> without catastrophic structural failure or detachment of primary flight controls.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlightControlsSystem;
