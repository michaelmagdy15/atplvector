import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Flame,
    Thermometer,
    RotateCw,
    Fan,
    Fuel,
    Activity,
    AlertTriangle,
    ShieldAlert,
    CheckCircle,
    XCircle,
    Info,
    Gauge,
    ArrowRight,
    Zap,
    Scale,
    Layers
} from 'lucide-react';

const PistonEnginePrinciples: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'cycle' | 'mixture' | 'ignition' | 'detonation'>('cycle');

    const tabs = [
        { id: 'cycle', label: 'The Otto Cycle & Brayton Comparison', icon: RotateCw },
        { id: 'mixture', label: 'Mixture, EGT & Fuels', icon: Fuel },
        { id: 'ignition', label: 'Dual Magnetos & Impulse Coupling', icon: Zap },
        { id: 'detonation', label: 'Detonation vs Pre-Ignition', icon: AlertTriangle },
    ];

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <Fan className="text-orange-500 animate-spin-slow" />
                        Piston Engines (ATPL 021)
                    </h1>
                    <p className="text-slate-400 mt-2 max-w-2xl leading-relaxed">
                        Reciprocating powerplants: Intermittent four-stroke Otto cycle, isolated magneto ignition with impulse coupling, and combustion abnormality management.
                    </p>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-xl text-xs text-slate-400">
                    <span className="text-orange-400 font-bold uppercase tracking-wider">Croucher ATPL Chapter 5</span> Grounded
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 bg-slate-900/50 p-1 rounded-xl w-full border border-slate-800">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                            activeTab === tab.id
                                ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/20'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <AnimatePresence mode="wait">
                {activeTab === 'cycle' && <OttoCycle key="cycle" />}
                {activeTab === 'mixture' && <MixtureControl key="mixture" />}
                {activeTab === 'ignition' && <IgnitionSystem key="ignition" />}
                {activeTab === 'detonation' && <DetonationPreignitionLab key="detonation" />}
            </AnimatePresence>
        </div>
    );
};

// ==========================================
// 1. OTTO CYCLE & OTTO VS BRAYTON COMPARISON
// ==========================================
const OttoCycle: React.FC = () => {
    const [stage, setStage] = useState(0); // 0: Intake, 1: Compression, 2: Power, 3: Exhaust
    const [isPlaying, setIsPlaying] = useState(true);

    useEffect(() => {
        if (!isPlaying) return;
        const timer = setInterval(() => {
            setStage((prev) => (prev + 1) % 4);
        }, 2200);
        return () => clearInterval(timer);
    }, [isPlaying]);

    const stages = [
        {
            name: 'Induction (Intake)',
            valves: 'Inlet OPEN, Exhaust CLOSED',
            piston: 'Moves DOWN (TDC to BDC)',
            volume: 'Volume Increases',
            pressure: 'Sub-atmospheric / manifold pressure',
            desc: 'Inlet valve opens slightly before TDC (valve lead). Downward piston movement creates a depression in the cylinder, drawing in the fuel/air charge.',
            color: 'bg-blue-500',
            borderColor: 'border-blue-500'
        },
        {
            name: 'Compression',
            valves: 'Both Valves CLOSED',
            piston: 'Moves UP (BDC to TDC)',
            volume: 'Volume Decreases (~8:1 to 10:1 ratio)',
            pressure: 'Pressure & Temp rise steeply',
            desc: 'Inlet valve closes after BDC (valve lag). Upward motion compresses the trapped charge into the clearance volume, prepping it for rapid combustion.',
            color: 'bg-yellow-500',
            borderColor: 'border-yellow-500'
        },
        {
            name: 'Power (Combustion)',
            valves: 'Both Valves CLOSED',
            piston: 'Spark fires, Gas expands, Piston forced DOWN',
            volume: 'Rapid expansion',
            pressure: 'Constant-volume peak pressure rise',
            desc: 'Dual spark plugs fire ~20°-25° before TDC. Controlled progressive flame front raises gas pressure to 600-800 psi, driving the piston down to deliver useful mechanical work.',
            color: 'bg-red-600',
            borderColor: 'border-red-600'
        },
        {
            name: 'Exhaust',
            valves: 'Exhaust OPEN, Inlet CLOSED',
            piston: 'Moves UP (BDC to TDC)',
            volume: 'Volume Decreases',
            pressure: 'Slight positive scavenge pressure',
            desc: 'Exhaust valve opens before BDC (valve lead) to allow high-pressure blowdown. Upward stroke expels burned combustion gases. Valve overlap occurs around TDC.',
            color: 'bg-slate-500',
            borderColor: 'border-slate-500'
        },
    ];

    const currentStage = stages[stage];

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visualizer */}
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden shadow-2xl">
                    <div className="absolute top-4 left-4 flex items-center gap-2 text-xs font-mono text-slate-400">
                        <Activity className="text-orange-400 w-4 h-4" />
                        <span>Crankshaft: {stage * 180}° – {((stage + 1) * 180)}°</span>
                    </div>

                    {/* Cylinder Body */}
                    <div className="relative w-64 h-96 bg-slate-800/40 rounded-t-3xl border-x-4 border-t-4 border-slate-600 overflow-hidden shadow-inner mt-4">
                        {/* Inlet Valve (Left) */}
                        <div
                            className="absolute top-0 left-8 w-8 h-4 bg-slate-300 origin-top transition-transform duration-300 shadow"
                            style={{ transform: stage === 0 ? 'translateY(12px) rotate(-12deg)' : 'rotate(0deg)' }}
                        />
                        <div className="absolute top-0 left-6 text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                            Inlet {stage === 0 ? '(OPEN)' : ''}
                        </div>

                        {/* Exhaust Valve (Right) */}
                        <div
                            className="absolute top-0 right-8 w-8 h-4 bg-slate-300 origin-top transition-transform duration-300 shadow"
                            style={{ transform: stage === 3 ? 'translateY(12px) rotate(12deg)' : 'rotate(0deg)' }}
                        />
                        <div className="absolute top-0 right-4 text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                            Exhaust {stage === 3 ? '(OPEN)' : ''}
                        </div>

                        {/* Dual Spark Plugs */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 flex gap-4">
                            <div className="w-2.5 h-7 bg-amber-400/80 rounded-b relative">
                                {stage === 2 && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: [1, 0, 1], scale: [1, 1.4, 1] }}
                                        transition={{ duration: 0.3, repeat: Infinity }}
                                        className="absolute -bottom-2 -left-2 w-7 h-7 bg-yellow-400 rounded-full blur-sm"
                                    />
                                )}
                            </div>
                            <div className="w-2.5 h-7 bg-amber-400/80 rounded-b relative">
                                {stage === 2 && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: [1, 0, 1], scale: [1, 1.4, 1] }}
                                        transition={{ duration: 0.3, repeat: Infinity, delay: 0.05 }}
                                        className="absolute -bottom-2 -left-2 w-7 h-7 bg-yellow-400 rounded-full blur-sm"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Combustion Gas Color Fill */}
                        <motion.div
                            className={`absolute inset-0 w-full transition-colors duration-500 opacity-40 pointer-events-none ${
                                stage === 0 ? 'bg-sky-500' :
                                stage === 1 ? 'bg-amber-500' :
                                stage === 2 ? 'bg-red-600' : 'bg-slate-700'
                            }`}
                        />

                        {/* Piston Crown & Body */}
                        <motion.div
                            className="absolute bottom-0 w-full h-32 bg-slate-400 border-t-4 border-slate-200 shadow-2xl"
                            animate={{
                                top: stage === 0 ? '65%' : stage === 1 ? '18%' : stage === 2 ? '65%' : '18%'
                            }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                        >
                            {/* Piston Compression & Oil Scraper Rings */}
                            <div className="w-full h-1 bg-slate-600 mt-2" />
                            <div className="w-full h-1 bg-slate-600 mt-1.5" />
                            <div className="w-full h-1 bg-slate-600 mt-1.5" />

                            {/* Piston Wrist Pin */}
                            <div className="w-6 h-6 rounded-full bg-slate-600 mx-auto mt-2 border border-slate-300 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-slate-800" />
                            </div>

                            {/* Connecting Rod */}
                            <div className="absolute top-16 left-1/2 -translate-x-1/2 w-6 h-56 bg-gradient-to-b from-slate-400 to-slate-600 origin-top rounded-b" />
                        </motion.div>
                    </div>

                    <div className="text-[11px] text-slate-500 mt-4 text-center">
                        2 Crankshaft Revolutions (720°) = 1 Complete 4-Stroke Power Cycle
                    </div>
                </div>

                {/* Controls & Stroke Narrative */}
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <RotateCw className="text-orange-400" />
                                Four-Stroke Otto Cycle
                            </h3>
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                    isPlaying ? 'bg-orange-600/30 text-orange-300 border border-orange-500/50' : 'bg-slate-800 text-white'
                                }`}
                            >
                                {isPlaying ? 'PAUSE CYCLE' : 'RESUME PLAY'}
                            </button>
                        </div>

                        {/* Stage Indicators */}
                        <div className="grid grid-cols-4 gap-2 mb-6">
                            {stages.map((s, i) => (
                                <button
                                    key={i}
                                    onClick={() => { setIsPlaying(false); setStage(i); }}
                                    className={`p-2 rounded-lg text-center transition-all ${
                                        stage === i ? `${s.color} text-white scale-105 shadow-md` : 'bg-slate-800 text-slate-400 opacity-60 hover:opacity-100'
                                    }`}
                                >
                                    <div className="text-[9px] uppercase font-black tracking-wider mb-0.5">Stroke {i + 1}</div>
                                    <div className="text-xs font-bold truncate">{s.name.split(' ')[0]}</div>
                                </button>
                            ))}
                        </div>

                        {/* Detailed Description */}
                        <div className={`p-6 rounded-xl border-l-4 ${currentStage.borderColor} bg-slate-800/40 space-y-3`}>
                            <div className="flex justify-between items-center">
                                <h4 className="text-lg font-bold text-white">{currentStage.name}</h4>
                                <span className="text-xs font-mono text-orange-400 bg-orange-950/40 px-2 py-0.5 rounded border border-orange-800/40">
                                    {currentStage.valves}
                                </span>
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed">{currentStage.desc}</p>
                            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-700/60 font-mono text-slate-400">
                                <div><strong className="text-slate-200">Piston:</strong> {currentStage.piston}</div>
                                <div><strong className="text-slate-200">Volume:</strong> {currentStage.volume}</div>
                            </div>
                        </div>
                    </div>

                    {/* Key Formula Card */}
                    <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Gauge className="text-orange-400 w-4 h-4" />
                            Piston Engine Mathematical Relationships
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-slate-950 p-4 rounded-xl border border-white/5">
                                <div className="text-[10px] text-slate-500 uppercase font-bold">Indicated Power (Formula)</div>
                                <div className="text-sm text-emerald-400 font-mono mt-1 font-bold">P = (P · L · A · N · K) / 60,000</div>
                                <div className="text-[11px] text-slate-400 mt-1">P = Mean Eff Pressure, L = Stroke, A = Area, N = Power Strokes/min, K = Cylinders</div>
                            </div>
                            <div className="bg-slate-950 p-4 rounded-xl border border-white/5">
                                <div className="text-[10px] text-slate-500 uppercase font-bold">Compression Ratio (CR)</div>
                                <div className="text-sm text-sky-400 font-mono mt-1 font-bold">CR = (V_swept + V_clearance) / V_clearance</div>
                                <div className="text-[11px] text-slate-400 mt-1">Typical GA avgas engines use 8.5:1. Limited by fuel detonation threshold.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CROUCHER CHAPTER 5 COMPARISON TABLE: OTTO VS BRAYTON */}
            <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-2xl shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                    <Scale className="text-orange-400 w-6 h-6" />
                    <div>
                        <h3 className="text-xl font-bold text-white">Otto Cycle vs Continuous Brayton Cycle</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Core comparison from Croucher ATPL Ch05 (Engines)</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="border-b border-slate-700 bg-slate-800/40 text-xs font-bold uppercase tracking-wider text-slate-300">
                                <th className="p-3">Characteristic</th>
                                <th className="p-3 text-orange-400">Reciprocating Piston Engine</th>
                                <th className="p-3 text-sky-400">High-Bypass Gas Turbine</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-slate-300">
                            <tr>
                                <td className="p-3 font-bold text-white">Thermodynamic Cycle</td>
                                <td className="p-3">4-Stroke Otto Cycle (Constant Volume Combustion)</td>
                                <td className="p-3">Continuous Open Brayton Cycle (Constant Pressure Combustion)</td>
                            </tr>
                            <tr>
                                <td className="p-3 font-bold text-white">Combustion Event</td>
                                <td className="p-3">Intermittent (25–30 distinct explosions/sec per cylinder)</td>
                                <td className="p-3">Continuous steady uninterrupted flame front</td>
                            </tr>
                            <tr>
                                <td className="p-3 font-bold text-white">Aviation Fuel Used</td>
                                <td className="p-3">
                                    <span className="text-blue-400 font-semibold">AVGAS 100LL</span> (TEL additive, dyed blue, high octane rating)
                                </td>
                                <td className="p-3">
                                    <span className="text-amber-300 font-semibold">JET A-1</span> (Kerosene, straw-colored, flash point &gt; 38°C)
                                </td>
                            </tr>
                            <tr>
                                <td className="p-3 font-bold text-white">Primary Thrust Source</td>
                                <td className="p-3">Propeller air acceleration driven by crankshaft shaft-power</td>
                                <td className="p-3 font-semibold text-emerald-400">
                                    80% Bypass fan air + 20% Core exhaust jet
                                </td>
                            </tr>
                            <tr>
                                <td className="p-3 font-bold text-white">Limiting Thermal Parameter</td>
                                <td className="p-3">
                                    <strong>Cylinder Head Temperature (CHT)</strong> (approx &lt; 230°C / 460°F) &amp; Oil Temp
                                </td>
                                <td className="p-3">
                                    <strong>Turbine Entry Temperature (TET) / EGT</strong> (limited by HPT thermal creep)
                                </td>
                            </tr>
                            <tr>
                                <td className="p-3 font-bold text-white">Air/Fuel Ratio Dynamics</td>
                                <td className="p-3">Chemically matched (~12:1 to 16:1) through carburettor / injector</td>
                                <td className="p-3">Primary zone at ~15:1; diluted to ~60:1 by secondary cooling air</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

// ==========================================
// 2. MIXTURE & EGT WITH ALTITUDE LEANING
// ==========================================
const MixtureControl: React.FC = () => {
    const [altitude, setAltitude] = useState(0); // 0 to 12000 ft
    const [mixture, setMixture] = useState(100); // 0 (Cutoff) to 100 (Full Rich)

    // Air density decreases with altitude.
    // If un-leaned during climb, mixture becomes increasingly over-rich (anti-pattern from Croucher ch05).
    const optimalMixture = Math.max(0, 100 - (altitude / 10000) * 35);
    const deviation = mixture - optimalMixture;

    let egt = 1350;
    let cht = 380;
    let status = "Peak EGT";
    let statusColor = "text-emerald-400";
    let riskNote = "";

    if (mixture === 0) {
        egt = 0;
        cht = 150;
        status = "Engine Cut / Idle Cutoff";
        statusColor = "text-slate-500";
        riskNote = "Fuel completely isolated at fuel control unit.";
    } else if (deviation >= -5 && deviation <= 5) {
        egt = 1520;
        cht = 410;
        status = "Peak EGT (Stoichiometric ~15:1 / Best Economy)";
        statusColor = "text-emerald-400";
        riskNote = "Maximum thermal efficiency. Excellent for long-range cruise at < 65% power.";
    } else if (deviation > 25) {
        egt = 1280;
        cht = 350;
        status = "Severely Over-Rich (High Altitude Un-leaned)";
        statusColor = "text-blue-400";
        riskNote = "Croucher Ch05 Anti-Pattern: Excess fuel causes spark plug lead fouling, carbon deposits, and severe power loss!";
    } else if (deviation > 5) {
        egt = 1420;
        cht = 425;
        status = "Rich of Peak (~12:1 / Best Power)";
        statusColor = "text-cyan-400";
        riskNote = "Produces highest brake horsepower for takeoff and climb; extra fuel provides internal cylinder cooling.";
    } else if (deviation < -20) {
        egt = 1360;
        cht = 460;
        status = "Critically Over-Lean (High Detonation Risk)";
        statusColor = "text-red-500 animate-pulse";
        riskNote = "Slow combustion velocity causes burning into exhaust stroke, elevated CHT, and extreme risk of detonation.";
    } else {
        egt = 1460;
        cht = 390;
        status = "Lean of Peak (~16:1 / Clean Burn)";
        statusColor = "text-amber-400";
        riskNote = "Safe only with balanced GAMI injectors at approved cruise power settings.";
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Control Panel */}
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Fuel className="text-red-400" />
                            Mixture &amp; Altitude Management
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                    <span>Density Altitude</span>
                                    <span className="text-white font-mono">{altitude.toLocaleString()} ft</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="12000"
                                    step="500"
                                    value={altitude}
                                    onChange={(e) => setAltitude(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                                />
                                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                                    <span>Sea Level (High Air Density)</span>
                                    <span>FL120 (Thin Air)</span>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                    <span>Mixture Lever (Red Knob)</span>
                                    <span className="text-white font-mono">
                                        {mixture === 0 ? 'IDLE CUTOFF' : (mixture === 100 ? 'FULL RICH' : `${mixture}%`)}
                                    </span>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <span className="text-[10px] font-bold text-red-500">LEAN</span>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        step="1"
                                        value={mixture}
                                        onChange={(e) => setMixture(parseInt(e.target.value))}
                                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
                                    />
                                    <span className="text-[10px] font-bold text-red-500">RICH</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setMixture(Math.round(optimalMixture))}
                                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-lg border border-slate-700 transition-colors"
                            >
                                Auto-Lean to Recommended Peak for {altitude} ft
                            </button>
                        </div>
                    </div>

                    {/* Operational Warning Card */}
                    <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-400 uppercase font-bold">Combustion State</span>
                            <span className={`text-xs font-black uppercase ${statusColor}`}>{status}</span>
                        </div>
                        <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-xs text-slate-300 leading-relaxed">
                            {riskNote}
                        </div>
                    </div>
                </div>

                {/* Gauges & Fuel Specs */}
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center shadow-xl">
                        <div className="grid grid-cols-2 gap-6 w-full">
                            {/* EGT Gauge */}
                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                                <div className="text-[10px] font-bold text-slate-500 uppercase">Exhaust Gas Temp (EGT)</div>
                                <div className="text-3xl font-black text-white font-mono mt-1">
                                    {egt}<span className="text-xs text-slate-500 ml-1">°F</span>
                                </div>
                                <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                                    <div
                                        className="h-full bg-orange-500 transition-all duration-300"
                                        style={{ width: `${Math.min(100, Math.max(0, (egt / 1650) * 100))}%` }}
                                    />
                                </div>
                                <div className="text-[10px] text-slate-400 mt-2">Peak = Stoichiometric 15:1</div>
                            </div>

                            {/* CHT Gauge */}
                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                                <div className="text-[10px] font-bold text-slate-500 uppercase">Cylinder Head Temp (CHT)</div>
                                <div className={`text-3xl font-black font-mono mt-1 ${cht > 435 ? 'text-red-400' : 'text-white'}`}>
                                    {cht}<span className="text-xs text-slate-500 ml-1">°F</span>
                                </div>
                                <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-300 ${cht > 435 ? 'bg-red-500' : 'bg-emerald-500'}`}
                                        style={{ width: `${Math.min(100, Math.max(0, (cht / 500) * 100))}%` }}
                                    />
                                </div>
                                <div className="text-[10px] text-slate-400 mt-2">Max Limit: ~460°F / 238°C</div>
                            </div>
                        </div>

                        {/* AVGAS vs JET A-1 Quick Card */}
                        <div className="w-full mt-6 bg-slate-950/70 p-4 rounded-xl border border-white/5 space-y-2 text-xs">
                            <div className="font-bold text-white flex items-center gap-2">
                                <Info className="text-blue-400 w-4 h-4" />
                                Aviation Gasoline (AVGAS 100LL) Specs
                            </div>
                            <div className="text-slate-400 text-[11px] leading-relaxed">
                                AVGAS is dyed <strong>blue</strong>, contains Tetraethyllead (TEL) anti-knock additive to prevent detonation, has a low flash point (-40°C), and requires strict mixture leaning as density altitude increases to prevent plug fouling.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// ==========================================
// 3. DUAL MAGNETOS & IMPULSE COUPLING
// ==========================================
const IgnitionSystem: React.FC = () => {
    const [sw, setSw] = useState<'OFF' | 'L' | 'R' | 'BOTH' | 'START'>('BOTH');
    const [impulseActive, setImpulseActive] = useState<boolean>(false);

    useEffect(() => {
        if (sw === 'START') {
            setImpulseActive(true);
        } else {
            setImpulseActive(false);
        }
    }, [sw]);

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Switch & Magneto Circuitry */}
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Zap className="text-yellow-400 w-5 h-5" />
                            Dual Magneto Ignition &amp; P-Lead Circuit
                        </h3>

                        {/* Crucial ATPL Principle Banner */}
                        <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 mb-6 space-y-2">
                            <p className="text-xs text-orange-300 font-bold flex items-center gap-1.5">
                                <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0" />
                                Magnetos Are Completely Independent &amp; Self-Powered
                            </p>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                Magnetos are engine-driven permanent-magnet AC generators. They do <strong>NOT</strong> require aircraft bus or battery power. Even during a complete electrical bus failure, the engine continues firing normally.
                            </p>
                            <p className="text-xs text-amber-200/90 leading-relaxed font-mono">
                                <strong>Safety Rule:</strong> The ignition switch works in reverse: turning it to <strong>OFF grounds</strong> the primary circuit via the <strong>P-Lead</strong> (quenching spark). A broken P-lead creates a deadly &quot;LIVE MAG&quot; condition even with the key removed!
                            </p>
                        </div>

                        {/* Key Switch Interactive */}
                        <div className="space-y-4">
                            <div className="flex justify-center">
                                <div className="bg-slate-950 p-4 rounded-full border-4 border-slate-700 w-44 h-44 relative flex items-center justify-center shadow-2xl">
                                    <span className="absolute top-3 font-black text-slate-500 text-[10px]">OFF</span>
                                    <span className="absolute top-7 right-7 font-black text-slate-500 text-[10px]">R</span>
                                    <span className="absolute bottom-12 right-3 font-black text-slate-500 text-[10px]">L</span>
                                    <span className="absolute bottom-6 left-9 font-black text-slate-500 text-[10px]">BOTH</span>
                                    <span className="absolute top-7 left-7 font-black text-amber-400 text-[10px]">START</span>

                                    {/* Key Indicator */}
                                    <motion.div
                                        className="w-3.5 h-20 bg-slate-300 rounded-full origin-bottom absolute bottom-1/2 left-1/2 -translate-x-1/2 shadow-lg"
                                        animate={{
                                            rotate: sw === 'OFF' ? -45 : sw === 'R' ? 0 : sw === 'L' ? 45 : sw === 'BOTH' ? 90 : 135
                                        }}
                                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                    >
                                        <div className="w-7 h-10 bg-slate-700 absolute top-0 left-1/2 -translate-x-1/2 rounded-t-full border border-slate-400" />
                                    </motion.div>
                                </div>
                            </div>

                            <div className="flex justify-center gap-2 flex-wrap">
                                {(['OFF', 'R', 'L', 'BOTH', 'START'] as const).map(pos => (
                                    <button
                                        key={pos}
                                        onClick={() => setSw(pos)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                            sw === pos ? 'bg-orange-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        {pos}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Magnetos, Plugs, and Impulse Coupling Explainer */}
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col items-center">
                        <div className="grid grid-cols-2 gap-6 w-full">
                            {/* Left Magneto */}
                            <div className={`p-4 rounded-xl border ${sw === 'L' || sw === 'BOTH' || sw === 'START' ? 'border-yellow-500/50 bg-slate-800/80' : 'border-slate-800 bg-slate-950/40 opacity-40'} transition-all`}>
                                <div className="text-center font-bold text-xs text-white mb-2">LEFT MAGNETO</div>
                                <div className="text-[10px] text-center text-slate-400 mb-3">
                                    Fires Top Left &amp; Bottom Right Plugs
                                </div>
                                <div className="flex justify-center gap-2">
                                    <SparkPlug active={sw === 'L' || sw === 'BOTH' || sw === 'START'} />
                                    <SparkPlug active={sw === 'L' || sw === 'BOTH' || sw === 'START'} />
                                </div>
                                <div className="text-[9px] text-center font-mono mt-2 text-slate-500">
                                    P-Lead: {sw === 'L' || sw === 'BOTH' || sw === 'START' ? 'OPEN (Live)' : 'GROUNDED'}
                                </div>
                            </div>

                            {/* Right Magneto */}
                            <div className={`p-4 rounded-xl border ${sw === 'R' || sw === 'BOTH' || sw === 'START' ? 'border-yellow-500/50 bg-slate-800/80' : 'border-slate-800 bg-slate-950/40 opacity-40'} transition-all`}>
                                <div className="text-center font-bold text-xs text-white mb-2">RIGHT MAGNETO</div>
                                <div className="text-[10px] text-center text-slate-400 mb-3">
                                    Fires Top Right &amp; Bottom Left Plugs
                                </div>
                                <div className="flex justify-center gap-2">
                                    <SparkPlug active={sw === 'R' || sw === 'BOTH' || sw === 'START'} />
                                    <SparkPlug active={sw === 'R' || sw === 'BOTH' || sw === 'START'} />
                                </div>
                                <div className="text-[9px] text-center font-mono mt-2 text-slate-500">
                                    P-Lead: {sw === 'R' || sw === 'BOTH' || sw === 'START' ? 'OPEN (Live)' : 'GROUNDED'}
                                </div>
                            </div>
                        </div>

                        {/* RPM Drop Check Simulator */}
                        <div className="w-full mt-6 bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                            <div>
                                <div className="text-[10px] font-bold text-slate-500 uppercase">Engine Tachometer</div>
                                <div className="text-2xl font-black text-white font-mono mt-0.5">
                                    {sw === 'OFF' ? 0 : sw === 'START' ? 250 : sw === 'BOTH' ? 2400 : 2320}
                                    <span className="text-xs text-slate-500 ml-1">RPM</span>
                                </div>
                            </div>
                            <div className="text-right text-xs">
                                <span className="font-bold text-slate-400">Mag Drop: </span>
                                <span className={sw === 'L' || sw === 'R' ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                                    {sw === 'L' || sw === 'R' ? '~80 RPM Drop (Normal Single-Flame Front)' : sw === 'BOTH' ? '0 RPM (Dual Spark Timing)' : 'Engine Cut'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* CROUCHER CH05: IMPULSE COUPLING MASTERCLASS */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-3">
                        <div className="flex items-center gap-2">
                            <RotateCw className="text-orange-400 w-5 h-5" />
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                                Impulse Coupling &amp; Shower of Sparks
                            </h4>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            During engine starting, two fundamental problems exist:
                        </p>
                        <ol className="list-decimal list-inside text-xs text-slate-400 space-y-1 leading-relaxed">
                            <li><strong>Speed Problem:</strong> The starter only cranks the engine at ~100 RPM. A standard magneto rotates too slowly to induce the high-voltage spark needed.</li>
                            <li><strong>Timing Problem:</strong> Standard advanced timing (20°-25° BTDC) would cause premature combustion during cranking, kicking the piston backwards and damaging the starter drive.</li>
                        </ol>
                        <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-xs text-slate-300 space-y-1">
                            <div className="font-bold text-orange-400">The Solution: The Impulse Coupling</div>
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                                A mechanical spring-loaded device fitted between the drive shaft and magneto. During cranking, flyweight pawls momentarily halt the magneto rotor while a heavy internal clock spring winds up. As the piston reaches Top Dead Center, the pawl releases: <strong>the spring snaps the magneto rotor forward at high speed</strong>, generating an intense, hot spark precisely <strong>retarded</strong> to TDC to safely start the engine. Once above ~400 RPM, centrifugal force retracts the pawls for normal operation.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const SparkPlug = ({ active }: { active: boolean }) => (
    <div className={`w-4 h-10 rounded-b bg-slate-600 border border-slate-400 flex items-end justify-center pb-1 ${active ? 'shadow-[0_0_12px_3px_rgba(250,204,21,0.6)]' : ''}`}>
        <div className={`w-1.5 h-3.5 rounded-full ${active ? 'bg-yellow-300 animate-ping' : 'bg-slate-800'}`} />
    </div>
);

// ==========================================
// 4. DETONATION VS PRE-IGNITION LAB
// ==========================================
const DetonationPreignitionLab: React.FC = () => {
    const [scenario, setScenario] = useState<'normal' | 'detonation' | 'preignition'>('normal');

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
            {/* Selector */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                    onClick={() => setScenario('normal')}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                        scenario === 'normal'
                            ? 'border-emerald-500 bg-emerald-950/30 text-white'
                            : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                    }`}
                >
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1 flex items-center gap-1.5">
                        <CheckCircle size={14} /> Normal Progressive Combustion
                    </div>
                    <div className="text-xs text-slate-300">Controlled flame front ~15–25 m/s across combustion chamber.</div>
                </button>

                <button
                    onClick={() => setScenario('detonation')}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                        scenario === 'detonation'
                            ? 'border-red-500 bg-red-950/30 text-white'
                            : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                    }`}
                >
                    <div className="text-xs font-bold uppercase tracking-wider text-red-400 mb-1 flex items-center gap-1.5">
                        <AlertTriangle size={14} /> Detonation (Knock / Ping)
                    </div>
                    <div className="text-xs text-slate-300">Spontaneous supersonic explosion of unburnt end-gas ahead of flame.</div>
                </button>

                <button
                    onClick={() => setScenario('preignition')}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                        scenario === 'preignition'
                            ? 'border-amber-500 bg-amber-950/30 text-white'
                            : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                    }`}
                >
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1 flex items-center gap-1.5">
                        <Flame size={14} /> Pre-Ignition (Runaway Hot Spot)
                    </div>
                    <div className="text-xs text-slate-300">Charge ignited prematurely before timed spark by glowing deposit.</div>
                </button>
            </div>

            {/* Diagnostic Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visual Chamber Pressure Profile */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
                    <div>
                        <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                            <Activity className="text-orange-400" />
                            Cylinder Pressure &amp; Wavefront Behavior
                        </h4>
                        <p className="text-xs text-slate-400 mb-6">
                            Comparing normal combustion pressure rise with acoustic shock waves.
                        </p>

                        <div className="h-44 w-full bg-slate-950 rounded-xl border border-slate-800 relative overflow-hidden flex items-end p-4">
                            {scenario === 'normal' && (
                                <div className="w-full flex items-end justify-center">
                                    <div className="text-center w-full">
                                        <div className="text-emerald-400 font-mono text-sm font-bold mb-2">Smooth Progressive Rise to ~700 psi</div>
                                        <div className="h-20 w-4/5 mx-auto bg-gradient-to-t from-emerald-500/20 to-emerald-500/80 rounded-t-full" />
                                    </div>
                                </div>
                            )}

                            {scenario === 'detonation' && (
                                <div className="w-full flex items-end justify-center">
                                    <div className="text-center w-full">
                                        <div className="text-red-400 font-mono text-sm font-bold mb-2 animate-pulse">Violent Spike &gt; 1,500 psi + Shock Wave</div>
                                        <div className="h-32 w-4/5 mx-auto bg-gradient-to-t from-red-600/30 via-red-500 to-red-400 rounded-t-lg relative">
                                            <div className="absolute inset-0 flex justify-around items-center">
                                                <div className="w-1 h-full bg-yellow-300 animate-ping" />
                                                <div className="w-1 h-full bg-yellow-300 animate-ping delay-100" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {scenario === 'preignition' && (
                                <div className="w-full flex items-end justify-center">
                                    <div className="text-center w-full">
                                        <div className="text-amber-400 font-mono text-sm font-bold mb-2">Ignition on Upstroke: Catastrophic Thermal Runaway</div>
                                        <div className="h-28 w-4/5 mx-auto bg-gradient-to-t from-amber-600/30 to-amber-500 rounded-t-xl" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="bg-slate-950 p-3 rounded-lg border border-white/5">
                            <div className="text-[10px] text-slate-500 uppercase font-bold">Cylinder Head Temp (CHT)</div>
                            <div className={`text-xl font-mono font-bold mt-1 ${scenario === 'normal' ? 'text-emerald-400' : 'text-red-400'}`}>
                                {scenario === 'normal' ? '380°F (Stable)' : scenario === 'detonation' ? '465°F (Rapid Rise)' : '520°F+ (Melting)'}
                            </div>
                        </div>
                        <div className="bg-slate-950 p-3 rounded-lg border border-white/5">
                            <div className="text-[10px] text-slate-500 uppercase font-bold">Engine Vibration / Sound</div>
                            <div className={`text-sm font-bold mt-1 ${scenario === 'normal' ? 'text-slate-300' : 'text-red-400'}`}>
                                {scenario === 'normal' ? 'Smooth GA hum' : scenario === 'detonation' ? 'Metallic Pinging / Knock' : 'Engine Seizure / Loss of Power'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Diagnostic Matrix Table */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <ShieldAlert className="text-orange-400 w-5 h-5" />
                        ATPL 021 Comparison Matrix: Detonation vs Pre-Ignition
                    </h4>

                    <div className="space-y-3 text-xs">
                        <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/60">
                            <div className="font-bold text-red-400 uppercase tracking-wide mb-1">DETONATION</div>
                            <ul className="text-slate-300 space-y-1 list-disc list-inside">
                                <li><strong>Definition:</strong> Instantaneous spontaneous explosion of residual &quot;end-gas&quot; ahead of the flame front.</li>
                                <li><strong>Root Causes:</strong> Incorrect fuel grade (low octane), excessive manifold pressure combined with low RPM, over-lean mixture, or excessive cylinder head temperature.</li>
                                <li><strong>Consequences:</strong> Hammer-like blow on piston crown, cracked cylinder heads, blown head gaskets, broken piston rings.</li>
                                <li><strong>Pilot Corrective Action:</strong> Enrich mixture to FULL RICH, reduce manifold pressure, increase airspeed, open cowl flaps to drop CHT.</li>
                            </ul>
                        </div>

                        <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/60">
                            <div className="font-bold text-amber-400 uppercase tracking-wide mb-1">PRE-IGNITION</div>
                            <ul className="text-slate-300 space-y-1 list-disc list-inside">
                                <li><strong>Definition:</strong> Premature ignition of the fuel/air charge BEFORE the timed spark fires.</li>
                                <li><strong>Root Causes:</strong> Incandescent carbon deposits glowing on piston or valve, overheated spark plug electrodes, cracked ceramic insulators.</li>
                                <li><strong>Consequences:</strong> The expanding gas fights against the upward-moving piston. Rapid thermal escalation causes hole melted through the piston crown and catastrophic seizure within minutes.</li>
                                <li><strong>Pilot Corrective Action:</strong> Immediate power reduction, mixture enrichment, check engine instruments, land ASAP.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PistonEnginePrinciples;
