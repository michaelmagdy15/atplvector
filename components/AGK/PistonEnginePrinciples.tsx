import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gauge, Flame, Thermometer, Wind, RotateCw, Settings, Fan, Fuel, Activity, AlertTriangle } from 'lucide-react';

const PistonEnginePrinciples: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'cycle' | 'mixture' | 'ignition'>('cycle');

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <Fan className="text-orange-500 animate-spin-slow" />
                        Piston Engines
                    </h1>
                    <p className="text-slate-400 mt-2 max-w-2xl">
                        The heartbeat of General Aviation. Explore the Otto Cycle, Mixture management, and Magneto ignition systems.
                    </p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 bg-slate-900/50 p-1 rounded-xl w-fit border border-slate-800">
                {[
                    { id: 'cycle', label: 'The Otto Cycle', icon: RotateCw },
                    { id: 'mixture', label: 'Mixture & EGT', icon: Fuel },
                    { id: 'ignition', label: 'Ignition & Mags', icon: ZapIcon },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id
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
            </AnimatePresence>
        </div>
    );
};

// --- SUB COMPONENTS ---

const ZapIcon = ({ size, className }: any) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
);

const OttoCycle = () => {
    const [stage, setStage] = useState(0); // 0: Intake, 1: Compression, 2: Power, 3: Exhaust
    const [isPlaying, setIsPlaying] = useState(true);

    useEffect(() => {
        if (!isPlaying) return;
        const timer = setInterval(() => {
            setStage((prev) => (prev + 1) % 4);
        }, 2000);
        return () => clearInterval(timer);
    }, [isPlaying]);

    const stages = [
        { name: 'Induction', desc: 'Inlet Valve OPEN. Piston moves DOWN. Fuel/Air drawn in.', color: 'bg-blue-500' },
        { name: 'Compression', desc: 'Both Valves CLOSED. Piston moves UP. Mixture compressed.', color: 'bg-yellow-500' },
        { name: 'Power', desc: 'Spark fires. Explosion forces Piston DOWN. Work is done.', color: 'bg-red-600' },
        { name: 'Exhaust', desc: 'Exhaust Valve OPEN. Piston moves UP. Gases expelled.', color: 'bg-slate-500' },
    ];

    const currentStage = stages[stage];

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visualizer */}
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl flex items-center justify-center min-h-[500px] relative overflow-hidden">
                    {/* Cylinder */}
                    <div className="relative w-64 h-96 bg-slate-800/50 rounded-t-3xl border-x-4 border-t-4 border-slate-600 overflow-hidden">

                        {/* Valves */}
                        <div className="absolute top-0 left-8 w-8 h-4 bg-slate-400 origin-top transition-transform duration-300"
                            style={{ transform: stage === 0 ? 'translateY(10px) rotate(-10deg)' : 'rotate(0deg)' }} /> {/* Intake */}
                        <div className="absolute top-0 right-8 w-8 h-4 bg-slate-400 origin-top transition-transform duration-300"
                            style={{ transform: stage === 3 ? 'translateY(10px) rotate(10deg)' : 'rotate(0deg)' }} /> {/* Exhaust */}

                        {/* Spark Plug */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-8 bg-white/20">
                            {stage === 2 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0 }} animate={{ opacity: [1, 0], scale: [1, 1.5] }} transition={{ duration: 0.2 }}
                                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-12 bg-yellow-400 rounded-full blur-md"
                                />
                            )}
                        </div>

                        {/* Combustion Chamber Content */}
                        <motion.div
                            className={`absolute inset-0 w-full transition-colors duration-500 opacity-30 pointer-events-none 
                                ${stage === 0 ? 'bg-blue-400/50' :
                                    stage === 1 ? 'bg-yellow-500/60' :
                                        stage === 2 ? 'bg-red-600/80' : 'bg-slate-800/50'}
                            `}
                        />

                        {/* Piston */}
                        <motion.div
                            className="absolute bottom-0 w-full h-32 bg-slate-400 border-t-4 border-slate-300"
                            animate={{
                                top: stage === 0 ? '70%' : stage === 1 ? '20%' : stage === 2 ? '70%' : '20%'
                            }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                            {/* Rings */}
                            <div className="w-full h-1 bg-slate-500 mt-2"></div>
                            <div className="w-full h-1 bg-slate-500 mt-2"></div>
                            <div className="w-full h-1 bg-slate-500 mt-2"></div>

                            {/* Con Rod */}
                            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-8 h-64 bg-slate-500 origin-top animate-pendulum"></div>
                        </motion.div>
                    </div>
                </div>

                {/* Controls & Text */}
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <RotateCw className="text-orange-400" />
                                Four Stroke Cycle
                            </h3>
                            <button onClick={() => setIsPlaying(!isPlaying)} className="px-4 py-2 bg-slate-800 rounded-lg text-xs font-bold text-white hover:bg-slate-700">
                                {isPlaying ? 'PAUSE' : 'PLAY'}
                            </button>
                        </div>

                        {/* Stage Indicators */}
                        <div className="grid grid-cols-4 gap-2 mb-8">
                            {stages.map((s, i) => (
                                <button
                                    key={i}
                                    onClick={() => { setIsPlaying(false); setStage(i); }}
                                    className={`p-2 rounded-lg text-center transition-all ${stage === i ? `${s.color} text-white scale-105` : 'bg-slate-800 text-slate-500 opacity-50'}`}
                                >
                                    <div className="text-[10px] uppercase font-black tracking-wider mb-1">Stroke {i + 1}</div>
                                    <div className="text-xs font-bold">{s.name}</div>
                                </button>
                            ))}
                        </div>

                        <div className={`p-6 rounded-xl border-l-4 ${currentStage.color.replace('bg-', 'border-')} bg-slate-800/50`}>
                            <h4 className="text-lg font-bold text-white mb-2">{currentStage.name}</h4>
                            <p className="text-slate-300 text-sm leading-relaxed">{currentStage.desc}</p>
                        </div>
                    </div>

                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                        <h4 className="text-sm font-bold text-slate-400 uppercase mb-4">Key Calculations</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-950 p-3 rounded-lg border border-white/5">
                                <div className="text-[10px] text-slate-500 uppercase">Power Formula</div>
                                <div className="text-sm text-white font-mono mt-1">P = PLAN / 33000</div>
                            </div>
                            <div className="bg-slate-950 p-3 rounded-lg border border-white/5">
                                <div className="text-[10px] text-slate-500 uppercase">Compression Ratio</div>
                                <div className="text-sm text-white font-mono mt-1">Total Vol / Clearance Vol</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const MixtureControl = () => {
    const [altitude, setAltitude] = useState(0); // 0 to 10000 ft
    const [mixture, setMixture] = useState(100); // 0 (Cutoff) to 100 (Rich)

    // Logic: 
    // Density decreases with altitude.
    // Optimal mixture needs to be leaned as altitude increases (fuel reduced to match reduced air).
    // If mixture stays at 100 (Full Rich) while altitude increases, engine runs "Over-Rich" -> Power Loss + Roughness.
    // If leaned too much -> "Over-Lean" -> Detonation Risk.

    const optimalMixture = Math.max(0, 100 - (altitude / 10000) * 30); // Optimal leans as we climb
    const deviation = mixture - optimalMixture;

    let egt = 1300; // Base EGT
    let status = "Peak EGT";
    let statusColor = "text-emerald-400";

    if (activeRegion(deviation, -5, 5)) {
        egt = 1500; // Peak
        status = "Peak EGT (Best Eco)";
        statusColor = "text-emerald-400";
    } else if (deviation > 20) {
        egt = 1300;
        status = "Over-Rich (Cooler)";
        statusColor = "text-blue-400";
    } else if (deviation > 5) {
        egt = 1400;
        status = "Rich of Peak (Best Power)";
        statusColor = "text-cyan-400";
    } else if (deviation < -20) {
        egt = 1600; // Actually drops if too lean but detonation risk is high
        status = "Critical! Over-Lean";
        statusColor = "text-red-500 animate-pulse";
    } else {
        egt = 1450;
        status = "Lean of Peak";
        statusColor = "text-amber-400";
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Fuel className="text-red-400" />
                        Mixture Management
                    </h3>

                    {/* Controls */}
                    <div className="space-y-8">
                        <div>
                            <label className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                <span>Altitude (Density Altitude)</span>
                                <span className="text-white">{altitude} ft</span>
                            </label>
                            <input
                                type="range" min="0" max="10000" step="100"
                                value={altitude}
                                onChange={(e) => setAltitude(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                            />
                        </div>

                        <div>
                            <label className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                <span>Mixture Lever</span>
                                <span className="text-white">{mixture === 0 ? 'CUTOFF' : (mixture === 100 ? 'FULL RICH' : `${mixture}%`)}</span>
                            </label>
                            <div className="flex gap-4 items-center">
                                <span className="text-[10px] font-bold text-red-500">LEAN</span>
                                <input
                                    type="range" min="0" max="100" step="1"
                                    value={mixture}
                                    onChange={(e) => setMixture(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
                                />
                                <span className="text-[10px] font-bold text-red-500">RICH</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                    <h4 className="flex items-center gap-2 text-white font-bold mb-4">
                        <Thermometer className="text-orange-400 w-4 h-4" />
                        EGT Response
                    </h4>
                    <p className="text-sm text-slate-300 mb-4">
                        <strong>Exhaust Gas Temperature (EGT)</strong> is the primary reference for leaning.
                        As you lean from Full Rich, EGT rises to a Peak (Stoichiometric ratio ~15:1), then drops.
                    </p>
                    <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-500 uppercase font-bold">Status</span>
                            <span className={`text-sm font-black ${statusColor} uppercase`}>{status}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl flex flex-col items-center justify-center">
                {/* EGT Gauge Viz */}
                <div className="relative w-64 h-64">
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                        {/* Dial Background */}
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="8" />
                        {/* Arc for "Good Range" */}
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#10b981" strokeWidth="8" strokeDasharray="50 200" strokeDashoffset="-80" opacity="0.5" />

                        {/* Needle */}
                        <motion.line
                            x1="50" y1="50" x2="90" y2="50"
                            stroke="white" strokeWidth="2"
                            strokeLinecap="round"
                            initial={{ rotate: 0 }}
                            animate={{ rotate: (egt - 1000) / 10 }} // Map 1000-1600 to degrees
                            transition={{ type: "spring", stiffness: 50 }}
                            style={{ originX: "50%", originY: "50%" }}
                        />

                        {/* Center Cap */}
                        <circle cx="50" cy="50" r="4" fill="#64748b" />
                    </svg>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pt-16 text-center">
                        <div className="text-2xl font-black text-white">{egt}</div>
                        <div className="text-[10px] text-slate-500 uppercase font-bold">°F EGT</div>
                    </div>
                </div>

                {/* Air Density Viz */}
                <div className="mt-8 flex gap-2">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${i < (10 - altitude / 1000) ? 'bg-sky-400' : 'bg-slate-800'}`}
                            title="Air Molecule"
                        ></div>
                    ))}
                    <span className="text-xs text-slate-500 ml-2">Air Density</span>
                </div>
            </div>
        </motion.div>
    );
};

const IgnitionSystem = () => {
    const [sw, setSw] = useState<'OFF' | 'L' | 'R' | 'BOTH' | 'START'>('BOTH');

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <ZapIcon className="text-yellow-400 w-6 h-6" />
                        Dual Ignition System
                    </h3>

                    <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 mb-6">
                        <p className="text-xs text-orange-200 leading-relaxed font-bold">
                            <AlertTriangle className="inline w-3 h-3 mr-1" />
                            Wait! Magnetos are SELF-POWERED.
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                            They do NOT require the battery. If electrical failure occurs, the engine KEEPS RUNNING.
                            Turning the switch OFF grounds the magneto (stops the spark).
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Ignition Switch Viz */}
                        <div className="flex justify-center">
                            <div className="bg-slate-950 p-4 rounded-full border-4 border-slate-700 w-48 h-48 relative flex items-center justify-center shadow-2xl">
                                {/* Labels */}
                                <span className="absolute top-4 font-black text-slate-500 text-xs">OFF</span>
                                <span className="absolute top-8 right-8 font-black text-slate-500 text-xs">R</span>
                                <span className="absolute bottom-16 right-4 font-black text-slate-500 text-xs">L</span>
                                <span className="absolute bottom-8 left-12 font-black text-slate-500 text-xs text-center">BOTH<br />ALL</span>
                                <span className="absolute top-8 left-8 font-black text-slate-500 text-xs">START</span>

                                {/* Key */}
                                <motion.div
                                    className="w-4 h-24 bg-slate-300 rounded-full origin-bottom absolute bottom-1/2 left-1/2 -translate-x-1/2 shadow-lg cursor-pointer"
                                    animate={{
                                        rotate: sw === 'OFF' ? -45 : sw === 'R' ? 0 : sw === 'L' ? 45 : sw === 'BOTH' ? 90 : 135
                                    }}
                                >
                                    <div className="w-8 h-12 bg-black/20 absolute top-0 left-1/2 -translate-x-1/2 rounded-t-full"></div>
                                </motion.div>
                            </div>
                        </div>

                        <div className="flex justify-center gap-2">
                            {['OFF', 'R', 'L', 'BOTH', 'START'].map(pos => (
                                <button
                                    key={pos}
                                    onClick={() => setSw(pos as any)}
                                    className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${sw === pos ? 'bg-white text-black' : 'bg-slate-800 text-slate-500'}`}
                                >
                                    {pos}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl flex flex-col items-center justify-center">
                <div className="grid grid-cols-2 gap-12 relative">
                    {/* Left Mag */}
                    <div className={`flex flex-col items-center gap-2 transition-opacity ${sw === 'L' || sw === 'BOTH' || sw === 'START' ? 'opacity-100' : 'opacity-30 grayscale'}`}>
                        <div className="w-20 h-24 bg-slate-700 rounded-lg flex items-center justify-center border-b-4 border-slate-600 relative">
                            <ZapIcon className="text-yellow-400 w-8 h-8 animate-pulse" />
                            <span className="absolute bottom-1 text-[10px] font-black text-slate-400 uppercase">LEFT MAG</span>
                        </div>
                        {/* Spark Plugs */}
                        <div className="flex gap-2">
                            <SparkPlug active={sw === 'L' || sw === 'BOTH' || sw === 'START'} />
                            <SparkPlug active={sw === 'L' || sw === 'BOTH' || sw === 'START'} />
                        </div>
                    </div>

                    {/* Right Mag */}
                    <div className={`flex flex-col items-center gap-2 transition-opacity ${sw === 'R' || sw === 'BOTH' || sw === 'START' ? 'opacity-100' : 'opacity-30 grayscale'}`}>
                        <div className="w-20 h-24 bg-slate-700 rounded-lg flex items-center justify-center border-b-4 border-slate-600 relative">
                            <ZapIcon className="text-yellow-400 w-8 h-8 animate-pulse" />
                            <span className="absolute bottom-1 text-[10px] font-black text-slate-400 uppercase">RIGHT MAG</span>
                        </div>
                        {/* Spark Plugs */}
                        <div className="flex gap-2">
                            <SparkPlug active={sw === 'R' || sw === 'BOTH' || sw === 'START'} />
                            <SparkPlug active={sw === 'R' || sw === 'BOTH' || sw === 'START'} />
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <div className="text-xs font-bold text-slate-500 uppercase mb-2">Engine Performance (RPM)</div>
                    <div className="text-3xl font-black text-white font-mono">
                        {sw === 'OFF' ? '0' : sw === 'BOTH' ? '2400' : '2325'}
                        <span className="text-sm text-slate-500 ml-1">RPM</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-2">
                        {sw === 'BOTH' ? 'Optimized Burn (Dual Spark)' : sw === 'OFF' ? 'Engine Cut' : 'RPM Drop (~75 RPM) Expected'}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const SparkPlug = ({ active }: any) => (
    <div className={`w-3 h-8 rounded-b bg-slate-500 border border-slate-400 flex items-end justify-center pb-1 ${active ? 'shadow-[0_0_10px_2px_rgba(250,204,21,0.5)]' : ''}`}>
        <div className={`w-1 h-3 rounded-full ${active ? 'bg-yellow-400 animate-ping' : 'bg-slate-800'}`}></div>
    </div>
);

function activeRegion(val: number, min: number, max: number) {
    return val >= min && val <= max;
}

export default PistonEnginePrinciples;
