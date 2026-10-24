import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Shield, 
    AlertTriangle, 
    Layers, 
    Compass, 
    Activity, 
    CheckCircle2, 
    Info, 
    Maximize2, 
    RotateCcw,
    Scale,
    Wrench,
    Zap
} from 'lucide-react';

type TabType = 'philosophies' | 'loads' | 'flutter' | 'materials';

export default function AirframesStructures() {
    const [activeTab, setActiveTab] = useState<TabType>('philosophies');

    // Interactive load factor state
    const [bankAngle, setBankAngle] = useState<number>(30);
    const [flapsExtended, setFlapsExtended] = useState<boolean>(false);

    // Turn load factor: n = 1 / cos(bankAngle in radians)
    const rad = (bankAngle * Math.PI) / 180;
    const loadFactor = 1 / Math.cos(rad);
    const stallSpeedIncreasePct = Math.round((Math.sqrt(loadFactor) - 1) * 100);

    // Limit load criteria for transport category:
    // Clean: +2.5g to -1.0g
    // Flaps: +2.0g to 0.0g
    const limitMax = flapsExtended ? 2.0 : 2.5;
    const ultimateMax = limitMax * 1.5;
    const isOverLimit = loadFactor > limitMax;
    const isOverUltimate = loadFactor > ultimateMax;

    // Flutter simulator state
    const [massBalancePosition, setMassBalancePosition] = useState<'forward' | 'aft'>('forward');
    const [flutterAirspeed, setFlutterAirspeed] = useState<number>(240); // kts

    const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
        { id: 'philosophies', label: 'Design Philosophies', icon: <Shield className="w-5 h-5" /> },
        { id: 'loads', label: 'Limit vs Ultimate Load', icon: <Scale className="w-5 h-5" /> },
        { id: 'flutter', label: 'Flutter & Mass Balancing', icon: <Activity className="w-5 h-5" /> },
        { id: 'materials', label: 'Materials & Construction', icon: <Layers className="w-5 h-5" /> },
    ];

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-8 min-h-screen">
            {/* Header */}
            <div>
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-blue-400 mb-2">
                    <span>EASA 021.01</span>
                    <span>•</span>
                    <span>Aircraft General Knowledge</span>
                    <span>•</span>
                    <span>Airframes & Structures</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight flex items-center gap-3">
                    <Shield className="text-blue-500 w-10 h-10" />
                    Airframes & Structural Design
                </h1>
                <p className="text-slate-400 mt-2 max-w-3xl text-base md:text-lg">
                    Balancing aerodynamic lightness with structural resistance against static, dynamic, and cyclic fatigue loads through damage-tolerant engineering philosophies.
                </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${
                            activeTab === tab.id
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                        }`}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Content Body */}
            <AnimatePresence mode="wait">
                {/* 1. DESIGN PHILOSOPHIES */}
                {activeTab === 'philosophies' && (
                    <motion.div
                        key="philosophies"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Safe Life */}
                            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-slate-700 transition-colors">
                                <div>
                                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold mb-4">
                                        01
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Safe Life</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed mb-4">
                                        A component is certified to remain in service for a strictly predetermined number of flight hours, cycles, or calendar time.
                                    </p>
                                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 mb-4">
                                        <div className="text-xs font-mono text-amber-400 font-bold uppercase">Mandatory Rule</div>
                                        <p className="text-xs text-slate-300">
                                            Retired and scrapped automatically when reaching life limit, regardless of how pristine its physical condition appears.
                                        </p>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-slate-800 text-xs text-slate-400">
                                    <strong className="text-white">Examples:</strong> Landing gear main struts, helicopter rotor hubs, engine turbine discs.
                                </div>
                            </div>

                            {/* Fail Safe */}
                            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-slate-700 transition-colors">
                                <div>
                                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold mb-4">
                                        02
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Fail-Safe</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed mb-4">
                                        Employs redundant, multiple load paths. If any single structural member fails, surrounding adjacent members carry the remaining load without catastrophic collapse.
                                    </p>
                                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 mb-4">
                                        <div className="text-xs font-mono text-blue-400 font-bold uppercase">Redundant Load Paths</div>
                                        <p className="text-xs text-slate-300">
                                            Designed so that remaining structure can safely support limit loads until detected at the next scheduled maintenance inspection.
                                        </p>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-slate-800 text-xs text-slate-400">
                                    <strong className="text-white">Examples:</strong> Multi-spar wings, split control surface hinges, multi-segment flap tracks.
                                </div>
                            </div>

                            {/* Damage Tolerance */}
                            <div className="bg-slate-900 border border-blue-500/30 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden bg-gradient-to-b from-blue-950/20 to-slate-900">
                                <div className="absolute top-4 right-4 bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase px-2.5 py-1 rounded-full border border-emerald-500/40">
                                    Modern Standard
                                </div>
                                <div>
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold mb-4">
                                        03
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Damage Tolerance</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed mb-4">
                                        Recognizes that micro-flaws, manufacturing voids, and fatigue cracks will inevitably form in cyclic service.
                                    </p>
                                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 mb-4">
                                        <div className="text-xs font-mono text-emerald-400 font-bold uppercase">Inspection Calibration</div>
                                        <p className="text-xs text-slate-300">
                                            Inspection intervals (visual, NDT, eddy-current, ultrasonic) are strictly calibrated to catch crack growth before it reaches critical catastrophic length.
                                        </p>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-slate-800 text-xs text-slate-400">
                                    <strong className="text-white">Examples:</strong> Modern transport fuselage skin panels, wing skins, pressure bulkheads.
                                </div>
                            </div>
                        </div>

                        {/* Mental Model & Exam Trap Banner */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                                <h4 className="text-sm font-mono uppercase text-blue-400 tracking-wider font-bold mb-3 flex items-center gap-2">
                                    <Compass className="w-4 h-4" />
                                    Croucher Mental Model: "The Spider Web"
                                </h4>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    Think of modern airframes like a web. Severing one strand transfers tension to surrounding strands without causing the web to tear apart. But under <em>Damage Tolerance</em>, technicians inspect the web regularly so micro-frays are repaired before dynamic aerodynamic loads tear the web.
                                </p>
                            </div>

                            <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-6">
                                <h4 className="text-sm font-mono uppercase text-amber-400 tracking-wider font-bold mb-3 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    ATPL Exam Trap: Safe Life Misconception
                                </h4>
                                <p className="text-sm text-amber-200/90 leading-relaxed">
                                    Examiners often ask: <em>"Can a Safe Life component have its service life extended if non-destructive inspection proves it has zero cracks?"</em><br />
                                    <strong>Answer: NO!</strong> Safe Life is an absolute threshold based on statistical fatigue life testing. It must be replaced regardless of inspection findings.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* 2. LIMIT VS ULTIMATE LOAD */}
                {activeTab === 'loads' && (
                    <motion.div
                        key="loads"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Interactive Calculator */}
                            <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Scale className="text-blue-400" />
                                    Turn Load Factor ($g$)
                                </h3>

                                <div>
                                    <div className="flex justify-between text-xs font-mono text-slate-400 mb-2">
                                        <span>Bank Angle ($\phi$)</span>
                                        <span className="text-blue-400 font-bold">{bankAngle}°</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="80"
                                        step="1"
                                        value={bankAngle}
                                        onChange={(e) => setBankAngle(Number(e.target.value))}
                                        className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                                    />
                                    <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                                        <span>0°</span>
                                        <span>30°</span>
                                        <span>45°</span>
                                        <span>60°</span>
                                        <span>75°</span>
                                        <span>80°</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
                                    <div>
                                        <span className="text-xs font-bold text-white block">Flap Configuration</span>
                                        <span className="text-[10px] text-slate-500">
                                            {flapsExtended ? 'Flaps Extended (+2.0g / 0g)' : 'Clean (+2.5g / -1.0g)'}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setFlapsExtended(!flapsExtended)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                            flapsExtended
                                                ? 'bg-amber-600 text-white'
                                                : 'bg-slate-800 text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        {flapsExtended ? 'FLAPS EXT' : 'CLEAN'}
                                    </button>
                                </div>

                                {/* Calculated metrics */}
                                <div className="space-y-3">
                                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                        <div className="text-[10px] font-mono uppercase text-slate-500 mb-1">Load Factor ($n = 1/\cos\phi$)</div>
                                        <div className={`text-3xl font-black font-mono ${
                                            isOverUltimate ? 'text-red-500 animate-pulse' :
                                            isOverLimit ? 'text-amber-400' : 'text-emerald-400'
                                        }`}>
                                            +{loadFactor.toFixed(2)} g
                                        </div>
                                        <div className="text-xs text-slate-400 mt-1">
                                            Stall speed increase: <strong className="text-white">+{stallSpeedIncreasePct}%</strong> ($\times \sqrt{`{n}`}$)
                                        </div>
                                    </div>

                                    {/* Status Alert */}
                                    {isOverUltimate ? (
                                        <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-xl flex items-start gap-2 text-red-300 text-xs">
                                            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                                            <span><strong>CRITICAL DANGER:</strong> Exceeds Ultimate Load (+{ultimateMax.toFixed(2)}g)! Catastrophic structural wing failure imminent.</span>
                                        </div>
                                    ) : isOverLimit ? (
                                        <div className="bg-amber-500/10 border border-amber-500/50 p-3 rounded-xl flex items-start gap-2 text-amber-300 text-xs">
                                            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                                            <span><strong>LIMIT LOAD EXCEEDED (+{limitMax.toFixed(1)}g):</strong> Permanent plastic deformation permitted! Structure compromised.</span>
                                        </div>
                                    ) : (
                                        <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl flex items-start gap-2 text-emerald-300 text-xs">
                                            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                                            <span><strong>WITHIN LIMIT LOAD:</strong> Purely elastic deformation. Returns to original shape when g-load removed.</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Core Definitions & Regulatory Rules */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                                    <h3 className="text-xl font-bold text-white mb-4">
                                        EASA CS-25 Transport Category Certification Limits
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                                            <div className="text-xs font-mono uppercase text-blue-400 font-bold mb-1">Limit Load</div>
                                            <div className="text-2xl font-black text-white mb-2">+2.5g / -1.0g</div>
                                            <p className="text-xs text-slate-300 leading-relaxed">
                                                The maximum load factor anticipated to occur in normal flight service. <strong>NO permanent (plastic) deformation</strong> is permitted. Must remain strictly within Hooke's Law elastic limit.
                                            </p>
                                        </div>

                                        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                                            <div className="text-xs font-mono uppercase text-purple-400 font-bold mb-1">Ultimate Load (1.5x Safety Factor)</div>
                                            <div className="text-2xl font-black text-white mb-2">+3.75g / -1.5g</div>
                                            <p className="text-xs text-slate-300 leading-relaxed">
                                                Ultimate Load = Limit Load × 1.5. The airframe must withstand this load for <strong>at least 3 seconds</strong> without catastrophic collapse. Permanent deformation is expected.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Hooke's Law Progression Table */}
                                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                        <h4 className="text-xs font-mono uppercase text-slate-400 font-bold mb-3">
                                            The Stress-Strain Curve Progression (Hooke's Law)
                                        </h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-xs">
                                            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                                                <div className="text-emerald-400 font-bold mb-1">1. Elastic Limit</div>
                                                <span className="text-[11px] text-slate-400">Material fully rebounds to zero strain.</span>
                                            </div>
                                            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                                                <div className="text-yellow-400 font-bold mb-1">2. Yield Point</div>
                                                <span className="text-[11px] text-slate-400">Onset of permanent plastic deformation.</span>
                                            </div>
                                            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                                                <div className="text-amber-500 font-bold mb-1">3. UTS</div>
                                                <span className="text-[11px] text-slate-400">Ultimate Tensile Strength peak load.</span>
                                            </div>
                                            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                                                <div className="text-red-500 font-bold mb-1">4. Rupture</div>
                                                <span className="text-[11px] text-slate-400">Total physical separation / fracture.</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Maneuvering Speed Warning */}
                                <div className="bg-blue-950/20 border border-blue-500/30 rounded-2xl p-5 flex items-start gap-4">
                                    <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl shrink-0">
                                        <Zap className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-sm mb-1">
                                            Operational Pitfall: Maneuvering Speed ($V_A$) & Gusts
                                        </h4>
                                        <p className="text-xs text-slate-300 leading-relaxed">
                                            At or below $V_A$, full or abrupt control deflection will cause the aircraft to stall aerodynamically before the structure exceeds its $+2.5g$ limit load. <strong>Above $V_A$</strong>, full control deflection or severe turbulence gusts can exceed the design limit load factor, bending wing spars permanently!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* 3. FLUTTER & MASS BALANCING */}
                {activeTab === 'flutter' && (
                    <motion.div
                        key="flutter"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Interactive Flutter Simulator */}
                            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                                <Activity className="text-blue-400" />
                                                Control Surface Flutter Simulator
                                            </h3>
                                            <p className="text-xs text-slate-400 mt-1">
                                                Dynamic, self-feeding aeroelastic oscillation caused by inertial lag and wing torsional twisting.
                                            </p>
                                        </div>

                                        <div className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase ${
                                            massBalancePosition === 'forward'
                                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                                : 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse'
                                        }`}>
                                            {massBalancePosition === 'forward' ? 'FLUTTER SUPPRESSED' : 'DIVERGENT FLUTTER!'}
                                        </div>
                                    </div>

                                    {/* Wing Cutaway Diagram */}
                                    <div className="relative h-64 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center p-4">
                                        {/* Wing Chord Line */}
                                        <div className="relative w-full max-w-lg flex items-center">
                                            {/* Main Wing Body */}
                                            <div className="w-2/3 h-20 bg-slate-800 rounded-l-3xl border-2 border-slate-600 flex items-center justify-center relative shadow-inner">
                                                <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider">Main Wing Section</span>
                                                <div className="absolute top-2 left-4 text-[10px] text-slate-500 font-mono">Torsional Axis</div>
                                            </div>

                                            {/* Hinge Line */}
                                            <div className="w-2 h-24 bg-amber-500 rounded-full z-20 flex items-center justify-center relative shadow-[0_0_12px_rgba(245,158,11,0.5)]">
                                                <div className="w-1 h-1 bg-white rounded-full"></div>
                                                <span className="absolute -bottom-6 text-[10px] font-mono text-amber-400 font-bold whitespace-nowrap">Hinge Line</span>
                                            </div>

                                            {/* Control Surface (Aileron/Elevator) */}
                                            <motion.div
                                                className="w-1/3 h-16 bg-blue-900/60 border-2 border-blue-500 rounded-r-2xl relative flex items-center justify-center origin-left"
                                                animate={
                                                    massBalancePosition === 'aft'
                                                        ? { rotate: [0, -18, 18, -22, 22, -15, 0] }
                                                        : { rotate: [0, -2, 2, 0] }
                                                }
                                                transition={{
                                                    repeat: Infinity,
                                                    duration: massBalancePosition === 'aft' ? 0.35 : 2.5,
                                                    ease: "easeInOut"
                                                }}
                                            >
                                                <span className="text-[11px] font-mono text-blue-200 font-bold">Aileron</span>

                                                {/* Mass Balance Lead Weight (Forward or Aft) */}
                                                {massBalancePosition === 'forward' ? (
                                                    <div className="absolute -left-12 w-10 h-6 bg-amber-400 border border-amber-300 rounded-lg flex items-center justify-center shadow-lg shadow-amber-400/40">
                                                        <span className="text-[9px] font-black text-slate-950 font-mono">LEAD</span>
                                                        <div className="absolute -top-5 text-[9px] font-bold text-amber-400 font-mono whitespace-nowrap">
                                                            CG Ahead of Hinge
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="absolute right-2 w-10 h-6 bg-red-500 border border-red-300 rounded-lg flex items-center justify-center shadow-lg shadow-red-500/40">
                                                        <span className="text-[9px] font-black text-white font-mono">AFT</span>
                                                        <div className="absolute -top-5 text-[9px] font-bold text-red-400 font-mono whitespace-nowrap">
                                                            CG Behind Hinge!
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>

                                {/* Controls */}
                                <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setMassBalancePosition('forward')}
                                            className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs transition-all ${
                                                massBalancePosition === 'forward'
                                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                                                    : 'bg-slate-800 text-slate-400 hover:text-white'
                                            }`}
                                        >
                                            Mass Ahead of Hinge (Balanced)
                                        </button>
                                        <button
                                            onClick={() => setMassBalancePosition('aft')}
                                            className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs transition-all ${
                                                massBalancePosition === 'aft'
                                                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                                                    : 'bg-slate-800 text-slate-400 hover:text-white'
                                            }`}
                                        >
                                            Mass Behind Hinge (Unbalanced)
                                        </button>
                                    </div>

                                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                                        <span className="text-slate-400 font-mono">Indicated Airspeed:</span>
                                        <span className="text-white font-bold font-mono text-sm">{flutterAirspeed} KTAS</span>
                                    </div>
                                </div>
                            </div>

                            {/* Deep Dive & Exam Rules */}
                            <div className="space-y-4">
                                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                                    <h4 className="text-sm font-mono uppercase text-blue-400 font-bold mb-2">
                                        Croucher Mental Model: "The Lever"
                                    </h4>
                                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                                        Adding lead weights <strong>forward of the control surface hinge line</strong> shifts the surface center of gravity ahead of the pivot. When the wing flexes upwards, the inertia of the lead mass forces the trailing edge down, counteracting wing twisting and extinguishing resonant vibration!
                                    </p>
                                </div>

                                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                                    <h4 className="text-sm font-mono uppercase text-purple-400 font-bold mb-2">
                                        Aero vs Mass Balance
                                    </h4>
                                    <ul className="text-xs text-slate-300 space-y-2">
                                        <li>
                                            • <strong className="text-white">Aerodynamic Balance:</strong> Horn balance, inset hinge, balance tab. Reduces pilot stick force required to move the surface.
                                        </li>
                                        <li>
                                            • <strong className="text-white">Mass Balance:</strong> Forward weights (lead/depleted uranium). Solely suppresses dynamic flutter oscillations.
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-5">
                                    <h4 className="text-sm font-mono uppercase text-amber-400 font-bold mb-2 flex items-center gap-1.5">
                                        <AlertTriangle className="w-4 h-4" />
                                        Control Surface Buzz
                                    </h4>
                                    <p className="text-xs text-amber-200/90 leading-relaxed">
                                        A high-frequency transonic phenomenon. Normal shockwaves forming on the upper and lower surfaces oscillate fore-and-aft across the hinge, causing severe buzz independently of structural flexing. Solved by irreversible hydraulic power control units (PCUs).
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* 4. MATERIALS & CONSTRUCTION */}
                {activeTab === 'materials' && (
                    <motion.div
                        key="materials"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="space-y-6"
                    >
                        {/* Monocoque vs Semi-Monocoque */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-bold text-white">Monocoque ("Single Shell")</h3>
                                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">Legacy / Light</span>
                                </div>
                                <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                                    The outer skin carries all structural bending, shear, and torsional loads without internal longitudinal reinforcement.
                                </p>
                                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                                    <div className="text-red-400 font-bold font-mono">Major Disadvantage:</div>
                                    <p className="text-slate-300">
                                        Highly vulnerable to <strong>elastic skin buckling</strong> under compressive loads. A single dent or skin deformation can cause instantaneous structural collapse.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-slate-900 border border-blue-500/30 rounded-3xl p-6 bg-gradient-to-br from-blue-950/20 to-slate-900">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-bold text-white">Semi-Monocoque (Stressed Skin)</h3>
                                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">Air Transport Standard</span>
                                </div>
                                <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                                    Stressed outer skin reinforced internally by longitudinal <strong>stringers & longerons</strong> and transverse <strong>formers & frames</strong>.
                                </p>
                                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                                    <div className="text-emerald-400 font-bold font-mono">Key Advantage:</div>
                                    <p className="text-slate-300">
                                        Provides damage-tolerant multiple load paths. Stringers carry bending tension and prevent skin buckling, while transverse frames preserve the aerodynamic cross-section under cabin pressurization.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Aerospace Materials Comparison Matrix */}
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 overflow-hidden">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Wrench className="text-blue-400" />
                                Aerospace Structural Materials Matrix (Croucher Ch 02)
                            </h3>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-slate-300">
                                    <thead className="text-xs uppercase bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
                                        <tr>
                                            <th className="px-4 py-3">Material</th>
                                            <th className="px-4 py-3">Advantages</th>
                                            <th className="px-4 py-3">Disadvantages</th>
                                            <th className="px-4 py-3">Typical Transport Application</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/60 font-sans">
                                        <tr className="hover:bg-slate-800/30 transition-colors">
                                            <td className="px-4 py-3.5 font-bold text-white flex items-center gap-2">
                                                <div className="w-2.5 h-2.5 rounded-full bg-blue-400"></div>
                                                Aluminium-Lithium (Al-Li)
                                            </td>
                                            <td className="px-4 py-3 text-slate-300">Low density (-10%), high stiffness (+15%), superior fatigue resistance.</td>
                                            <td className="px-4 py-3 text-slate-400">Notch sensitive, high cost, specialized welding.</td>
                                            <td className="px-4 py-3 text-blue-300 font-mono text-xs">Fuselage skins, wing upper skins.</td>
                                        </tr>
                                        <tr className="hover:bg-slate-800/30 transition-colors">
                                            <td className="px-4 py-3.5 font-bold text-white flex items-center gap-2">
                                                <div className="w-2.5 h-2.5 rounded-full bg-slate-400"></div>
                                                Titanium Alloys
                                            </td>
                                            <td className="px-4 py-3 text-slate-300">Exceptional strength-to-weight, heat resistance up to 400°C, zero corrosion.</td>
                                            <td className="px-4 py-3 text-slate-400">Extremely expensive, difficult to machine and bend.</td>
                                            <td className="px-4 py-3 text-slate-300 font-mono text-xs">Engine pylons, firewalls, landing gear bogies.</td>
                                        </tr>
                                        <tr className="hover:bg-slate-800/30 transition-colors">
                                            <td className="px-4 py-3.5 font-bold text-white flex items-center gap-2">
                                                <div className="w-2.5 h-2.5 rounded-full bg-purple-400"></div>
                                                Carbon Fiber (CFRP)
                                            </td>
                                            <td className="px-4 py-3 text-slate-300">Highest specific strength, zero fatigue degradation, custom fiber orientation.</td>
                                            <td className="px-4 py-3 text-slate-400">Brittle failure (no yield warning), hidden delamination (BVID), galvanic corrosion with Al.</td>
                                            <td className="px-4 py-3 text-purple-300 font-mono text-xs">B787/A350 fuselage barrels, wing boxes, vertical fin.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Primary vs Secondary Structures */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                                <h4 className="text-sm font-mono uppercase text-red-400 font-bold mb-2">
                                    Primary Structure (Class 1)
                                </h4>
                                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                                    Failure would cause direct loss of aircraft control, loss of cabin pressurization integrity, or catastrophic structural disintegration.
                                </p>
                                <span className="text-[11px] text-slate-400 font-mono">
                                    Includes: Wing spars, fuselage frames, pressure bulkheads, engine pylon mounts, primary control surfaces.
                                </span>
                            </div>

                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                                <h4 className="text-sm font-mono uppercase text-emerald-400 font-bold mb-2">
                                    Secondary Structure (Class 2)
                                </h4>
                                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                                    Failure does not directly imperil flight safety or cause catastrophic loss of control, though it may degrade aerodynamic efficiency.
                                </p>
                                <span className="text-[11px] text-slate-400 font-mono">
                                    Includes: Wingtip fairings, aerodynamic flap track fairings ("canoes"), engine cowlings, radome.
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
