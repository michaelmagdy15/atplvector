import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Wind, 
    Gauge, 
    Flame, 
    Snowflake, 
    ArrowRight, 
    AlertTriangle, 
    CheckCircle2, 
    Settings, 
    ShieldAlert, 
    Layers, 
    RefreshCw,
    Compass
} from 'lucide-react';

type TabType = 'acm' | 'pressurization' | 'bleed' | 'decompression';

export default function AirConditioningPressurization() {
    const [activeTab, setActiveTab] = useState<TabType>('acm');

    // Pressurization Leaky Bucket Simulator state
    const [flightAltitude, setFlightAltitude] = useState<number>(37000); // ft
    const [packInflowRate, setPackInflowRate] = useState<number>(100); // % (packs on)
    const [outflowValveOpen, setOutflowValveOpen] = useState<number>(35); // % open

    // Derived cabin pressurization parameters
    // Atmospheric ambient pressure at altitude in psi (approx)
    // Sea level = 14.7 psi, FL370 = ~3.14 psi
    const ambientPressurePsi = Math.max(2.5, 14.7 * Math.pow(1 - (0.0000068756 * flightAltitude), 5.2561));
    
    // Inflow adds mass; outflow relieves mass
    // Balanced cabin altitude approx:
    const targetCabinAlt = Math.max(0, Math.min(flightAltitude, Math.round(
        flightAltitude * (outflowValveOpen / 100) * (100 / Math.max(20, packInflowRate)) * 0.4
    )));

    // Cabin pressure in psi
    const cabinPressurePsi = Math.max(ambientPressurePsi, 14.7 * Math.pow(1 - (0.0000068756 * targetCabinAlt), 5.2561));
    const deltaPPsi = Math.max(0, cabinPressurePsi - ambientPressurePsi);

    // Relief valve triggers
    const isOverpressure = deltaPPsi > 9.0;
    const isMaskDrop = targetCabinAlt >= 14000;

    const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
        { id: 'acm', label: 'Air Cycle Machine (ACM)', icon: <Snowflake className="w-5 h-5" /> },
        { id: 'pressurization', label: 'Pressurization & Outflow', icon: <Gauge className="w-5 h-5" /> },
        { id: 'bleed', label: 'Bleed Air Extraction', icon: <Flame className="w-5 h-5" /> },
        { id: 'decompression', label: 'Decompression & Oxygen', icon: <ShieldAlert className="w-5 h-5" /> },
    ];

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-8 min-h-screen">
            {/* Header */}
            <div>
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">
                    <span>EASA 021.08 / 021.09</span>
                    <span>•</span>
                    <span>Aircraft General Knowledge</span>
                    <span>•</span>
                    <span>Pneumatics & Air Conditioning</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight flex items-center gap-3">
                    <Wind className="text-cyan-400 w-10 h-10" />
                    Pneumatics, Air Conditioning & Pressurization
                </h1>
                <p className="text-slate-400 mt-2 max-w-3xl text-base md:text-lg">
                    Continuous inflow from engine bleed air balanced against dynamic outflow valve modulation. Master the bootstrap Air Cycle Machine and the "Leaky Bucket" pressure equilibrium.
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
                                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
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
                {/* 1. AIR CYCLE MACHINE (ACM) PACKS */}
                {activeTab === 'acm' && (
                    <motion.div
                        key="acm"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="space-y-6"
                    >
                        {/* Interactive Bootstrap Pack Flow */}
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                                <div>
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Snowflake className="text-cyan-400" />
                                        The Air Cycle Machine (ACM) "Bootstrap" Cycle
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Tapping hot high-pressure bleed air and producing sub-zero refrigeration air without volatile freon chemicals.
                                    </p>
                                </div>
                                <div className="bg-cyan-950/40 border border-cyan-500/30 px-3 py-1.5 rounded-xl text-xs font-mono text-cyan-300">
                                    Pack Output: <span className="font-bold text-white">+2°C to +4°C (conditioned)</span>
                                </div>
                            </div>

                            {/* Cycle Flow Stages */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 relative">
                                {/* Stage 1 */}
                                <div className="bg-slate-950 p-4 rounded-2xl border border-red-500/30 flex flex-col justify-between">
                                    <div>
                                        <span className="text-[10px] font-mono text-red-400 font-bold uppercase">Stage 01</span>
                                        <h4 className="text-sm font-bold text-white mt-1 mb-2">Bleed Inflow</h4>
                                        <p className="text-xs text-slate-400">Hot engine bleed air enters at ~200°C and 45 psi.</p>
                                    </div>
                                    <div className="mt-4 text-xs font-mono font-bold text-red-400">~200°C</div>
                                </div>

                                {/* Stage 2 */}
                                <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/30 flex flex-col justify-between">
                                    <div>
                                        <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">Stage 02</span>
                                        <h4 className="text-sm font-bold text-white mt-1 mb-2">Primary Heat Exchanger</h4>
                                        <p className="text-xs text-slate-400">Cooled by external ambient ram air duct.</p>
                                    </div>
                                    <div className="mt-4 text-xs font-mono font-bold text-amber-400">Drops to ~90°C</div>
                                </div>

                                {/* Stage 3 */}
                                <div className="bg-slate-950 p-4 rounded-2xl border border-orange-500/30 flex flex-col justify-between">
                                    <div>
                                        <span className="text-[10px] font-mono text-orange-400 font-bold uppercase">Stage 03</span>
                                        <h4 className="text-sm font-bold text-white mt-1 mb-2">ACM Compressor</h4>
                                        <p className="text-xs text-slate-400">Compresses air to higher pressure, raising temperature ("Bootstrap").</p>
                                    </div>
                                    <div className="mt-4 text-xs font-mono font-bold text-orange-400">Spikes to ~130°C</div>
                                </div>

                                {/* Stage 4 */}
                                <div className="bg-slate-950 p-4 rounded-2xl border border-yellow-500/30 flex flex-col justify-between">
                                    <div>
                                        <span className="text-[10px] font-mono text-yellow-400 font-bold uppercase">Stage 04</span>
                                        <h4 className="text-sm font-bold text-white mt-1 mb-2">Secondary Heat Exchanger</h4>
                                        <p className="text-xs text-slate-400">Ram air strips away the heat of compression.</p>
                                    </div>
                                    <div className="mt-4 text-xs font-mono font-bold text-yellow-400">Cools to ~40°C</div>
                                </div>

                                {/* Stage 5 */}
                                <div className="bg-slate-950 p-4 rounded-2xl border border-cyan-500/40 flex flex-col justify-between bg-cyan-950/10">
                                    <div>
                                        <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Stage 05</span>
                                        <h4 className="text-sm font-bold text-white mt-1 mb-2">Expansion Turbine</h4>
                                        <p className="text-xs text-slate-400">Rapid expansion extracts energy to spin compressor; drops temp below 0°C!</p>
                                    </div>
                                    <div className="mt-4 text-xs font-mono font-bold text-cyan-300">-5°C to 0°C</div>
                                </div>

                                {/* Stage 6 */}
                                <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-500/30 flex flex-col justify-between">
                                    <div>
                                        <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">Stage 06</span>
                                        <h4 className="text-sm font-bold text-white mt-1 mb-2">Water Separator & Mix</h4>
                                        <p className="text-xs text-slate-400">Swirl vanes spin out condensed water droplets; mixed with hot trim air.</p>
                                    </div>
                                    <div className="mt-4 text-xs font-mono font-bold text-emerald-400">+18°C Cabin Delivery</div>
                                </div>
                            </div>
                        </div>

                        {/* Mental Model & Exam Pitfall */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                                <h4 className="text-sm font-mono uppercase text-cyan-400 tracking-wider font-bold mb-3 flex items-center gap-2">
                                    <Compass className="w-4 h-4" />
                                    Why Call It a "Bootstrap" Cycle?
                                </h4>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    The cooling turbine and the compressor are mounted on the <strong>same common shaft</strong>. The energy extracted by the air expanding across the cooling turbine mechanically drives the compressor. The system literally "pulls itself up by its own bootstraps" without needing an external electric motor!
                                </p>
                            </div>

                            <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-6">
                                <h4 className="text-sm font-mono uppercase text-amber-400 tracking-wider font-bold mb-3 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    ATPL Exam Trap: Turbine Icing Prevention
                                </h4>
                                <p className="text-sm text-amber-200/90 leading-relaxed">
                                    Because the expansion turbine drops air temperature below freezing (&lt; 0°C), moisture in humid low-altitude air can freeze, clogging the pack. A <strong>35°F (2°C) temperature control valve</strong> bypasses warm air around the pack turbine to prevent ice buildup on the water separator condenser bag.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* 2. PRESSURIZATION & OUTFLOW VALVE */}
                {activeTab === 'pressurization' && (
                    <motion.div
                        key="pressurization"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Interactive Leaky Bucket Simulator */}
                            <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Gauge className="text-cyan-400" />
                                    The "Leaky Bucket" Simulator
                                </h3>

                                <div>
                                    <div className="flex justify-between text-xs font-mono text-slate-400 mb-2">
                                        <span>Aircraft Altitude</span>
                                        <span className="text-cyan-400 font-bold">{flightAltitude.toLocaleString()} FT</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="43000"
                                        step="1000"
                                        value={flightAltitude}
                                        onChange={(e) => setFlightAltitude(Number(e.target.value))}
                                        className="w-full accent-cyan-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                                    />
                                    <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                                        <span>SL</span>
                                        <span>FL100</span>
                                        <span>FL200</span>
                                        <span>FL300</span>
                                        <span>FL430</span>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-xs font-mono text-slate-400 mb-2">
                                        <span>Outflow Valve Opening</span>
                                        <span className="text-white font-bold">{outflowValveOpen}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="5"
                                        max="100"
                                        step="1"
                                        value={outflowValveOpen}
                                        onChange={(e) => setOutflowValveOpen(Number(e.target.value))}
                                        className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                                    />
                                    <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                                        <span>5% (Shut)</span>
                                        <span>35% (Normal)</span>
                                        <span>100% (Dump)</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
                                    <div>
                                        <span className="text-xs font-bold text-white block">Pack Inflow</span>
                                        <span className="text-[10px] text-slate-500">Continuous bleed mass flow</span>
                                    </div>
                                    <button
                                        onClick={() => setPackInflowRate(packInflowRate === 100 ? 0 : 100)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                            packInflowRate > 0
                                                ? 'bg-emerald-600 text-white'
                                                : 'bg-red-600 text-white'
                                        }`}
                                    >
                                        {packInflowRate > 0 ? 'PACKS ON' : 'PACKS OFF'}
                                    </button>
                                </div>

                                {/* Calculated Readings */}
                                <div className="space-y-3">
                                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                        <div className="text-[10px] font-mono uppercase text-slate-500 mb-1">Cabin Altitude</div>
                                        <div className={`text-3xl font-black font-mono ${
                                            isMaskDrop ? 'text-red-500 animate-pulse' :
                                            targetCabinAlt > 8000 ? 'text-amber-400' : 'text-emerald-400'
                                        }`}>
                                            {targetCabinAlt.toLocaleString()} FT
                                        </div>
                                        <div className="text-xs text-slate-400 mt-1">
                                            Normal max ceiling: <strong className="text-white">8,000 FT</strong>
                                        </div>
                                    </div>

                                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                        <div className="text-[10px] font-mono uppercase text-slate-500 mb-1">Differential Pressure ($\Delta P$)</div>
                                        <div className={`text-3xl font-black font-mono ${
                                            isOverpressure ? 'text-red-500 animate-pulse' : 'text-cyan-400'
                                        }`}>
                                            {deltaPPsi.toFixed(2)} PSI
                                        </div>
                                        <div className="text-xs text-slate-400 mt-1">
                                            Max structural relief limit: <strong className="text-white">~9.0 PSI</strong>
                                        </div>
                                    </div>

                                    {/* Alert Badges */}
                                    {isMaskDrop ? (
                                        <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-xl flex items-start gap-2 text-red-300 text-xs">
                                            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                                            <span><strong>EMERGENCY:</strong> Cabin Altitude &ge; 14,000 ft! Passenger oxygen masks automatically drop! Initiate emergency descent.</span>
                                        </div>
                                    ) : isOverpressure ? (
                                        <div className="bg-amber-500/10 border border-amber-500/50 p-3 rounded-xl flex items-start gap-2 text-amber-300 text-xs">
                                            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                                            <span><strong>OVERPRESSURE RELIEF ACTIVE:</strong> Differential pressure &gt; 9.0 psi! Safety relief valve venting to prevent fuselage rupture.</span>
                                        </div>
                                    ) : (
                                        <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl flex items-start gap-2 text-emerald-300 text-xs">
                                            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                                            <span><strong>STABLE EQUILIBRIUM:</strong> Outflow valve modulating normally. Cabin altitude and $\Delta P$ within certified envelope.</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Core Pressurization Rules & Formulas */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                                    <h3 className="text-xl font-bold text-white mb-4">
                                        Croucher Mental Model: "The Leaky Bucket"
                                    </h3>
                                    <p className="text-sm text-slate-300 leading-relaxed mb-6">
                                        Engine bleed air provides a <em>continuous, constant inflow</em> of air into the pressure vessel—like a wide-open water tap running at full bore. The <strong>Outflow Valve</strong> at the bottom of the fuselage is the variable drain plug. By adjusting the size of the drain, the pressurization controller maintains the exact desired air mass and cabin altitude.
                                    </p>

                                    {/* Three Key Metrics */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">1. Cabin Altitude</span>
                                            <div className="text-xl font-black text-white mt-1 mb-1">Max 8,000 FT</div>
                                            <p className="text-[11px] text-slate-400">Equivalent pressure altitude inside cabin under normal cruise.</p>
                                        </div>

                                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">2. Differential ($\Delta P$)</span>
                                            <div className="text-xl font-black text-cyan-300 mt-1 mb-1">8.2 – 8.8 PSI</div>
                                            <p className="text-[11px] text-slate-400">Pressure difference: $P_`{`\text{cabin}`}` - P_`{`\text{ambient}`}`$. Max relief valve at ~9.0 psi.</p>
                                        </div>

                                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">3. Rate of Change</span>
                                            <div className="text-xl font-black text-emerald-400 mt-1 mb-1">+500 / -300 FPM</div>
                                            <p className="text-[11px] text-slate-400">Normal climb (+500 fpm) and descent (-300 fpm) cabin limits for eardrum comfort.</p>
                                        </div>
                                    </div>

                                    {/* Safety Relief Valves */}
                                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                                        <h4 className="text-xs font-mono uppercase text-slate-400 font-bold">
                                            Emergency Pressure Protection Valves
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                                                <strong className="text-red-400 block mb-1">Positive Safety Relief Valve</strong>
                                                <span className="text-slate-300">
                                                    Spring-loaded valve opening outwards at ~9.0 psi to prevent structural over-pressurization and hull burst.
                                                </span>
                                            </div>
                                            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                                                <strong className="text-blue-400 block mb-1">Negative Safety Relief Valve</strong>
                                                <span className="text-slate-300">
                                                    Inward-opening flap valve preventing external atmospheric pressure from exceeding cabin pressure during rapid descent, which would crush fuselage inward!
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Ditching & Ground Depressurization */}
                                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex items-start gap-4">
                                    <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl shrink-0">
                                        <Settings className="w-5 h-5" />
                                    </div>
                                    <div className="text-xs text-slate-300 leading-relaxed">
                                        <strong className="text-white block text-sm mb-1">Ditching Pushbutton & Ground Logic:</strong>
                                        Pressing the cockpit DITCHING switch sends an electric closure command to the outflow valve, ram air inlet, avionics ventilation, and pack valves below the water line to seal the fuselage. On touchdown, squat switches automatically drive the outflow valve fully open to equalize cabin and outside pressure before door opening.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* 3. BLEED AIR EXTRACTION */}
                {activeTab === 'bleed' && (
                    <motion.div
                        key="bleed"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Flame className="text-orange-400" />
                                    Intermediate vs High Pressure Bleed Ports
                                </h3>
                                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                                    Bleed air is extracted from two separate compressor stages on each jet engine to maximize fuel efficiency and maintain proper manifold pressure across all flight phases:
                                </p>
                                <div className="space-y-3">
                                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                        <div className="text-xs font-mono uppercase text-blue-400 font-bold mb-1">IP Port (Intermediate Pressure)</div>
                                        <p className="text-xs text-slate-300">
                                            Used during high-thrust operations (takeoff, climb, cruise). Compressor air is already sufficiently hot and pressurized. Minimizes engine fuel consumption penalty.
                                        </p>
                                    </div>
                                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                        <div className="text-xs font-mono uppercase text-orange-400 font-bold mb-1">HP Port (High Pressure) + HP Valve</div>
                                        <p className="text-xs text-slate-300">
                                            Automatically commanded open by the pneumatic controller when engine is at low thrust (descent, idle, taxi) when IP port pressure is insufficient to power packs and anti-ice.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Settings className="text-cyan-400" />
                                    Precooler & PRSOV Regulation
                                </h3>
                                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                                    High-temperature bleed air (&gt; 400°C) cannot be plumbed directly along wing leading edges or into cabin packs.
                                </p>
                                <div className="space-y-3">
                                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                        <div className="text-xs font-mono uppercase text-cyan-400 font-bold mb-1">Precooler Heat Exchanger</div>
                                        <p className="text-xs text-slate-300">
                                            Located in the engine pylon. Modulates cold engine fan bypass air across the precooler to cool bleed air down to a regulated ~200°C before entering the ducting.
                                        </p>
                                    </div>
                                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                        <div className="text-xs font-mono uppercase text-emerald-400 font-bold mb-1">PRSOV (Pressure Regulating & Shut-Off Valve)</div>
                                        <p className="text-xs text-slate-300">
                                            Pneumatically operated, electrically controlled valve regulating manifold pressure to approximately 40–50 psi and providing rapid fire shut-off capability.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Exam Trap */}
                        <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-6">
                            <h4 className="text-sm font-mono uppercase text-amber-400 tracking-wider font-bold mb-2 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" />
                                ATPL Operational Rule: Thermal Shocking
                            </h4>
                            <p className="text-sm text-amber-200/90 leading-relaxed">
                                Rapidly switching bleed air sources off under heavy thrust/thermal loads causes severe thermal shock to precooler control valves and duct seals. Always allow engine and pneumatic systems to stabilize before rapid bleed reconfigurations.
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* 4. DECOMPRESSION & OXYGEN */}
                {activeTab === 'decompression' && (
                    <motion.div
                        key="decompression"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                                <h3 className="text-lg font-bold text-white mb-4">Decompression Classifications</h3>
                                <div className="space-y-4 text-xs">
                                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                                        <strong className="text-red-400 block mb-1">Explosive Decompression</strong>
                                        <p className="text-slate-300 leading-relaxed">
                                            Occurs in &lt; 0.5 seconds, faster than the lungs can decompress. Risk of pulmonary barotrauma if holding breath. Accompanied by loud bang, dense fog, and flying debris.
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                                        <strong className="text-amber-400 block mb-1">Rapid Decompression</strong>
                                        <p className="text-slate-300 leading-relaxed">
                                            Occurs in 0.5 to 10 seconds. Lungs decompress safely. Fogging occurs as temperature plummets adiabatically.
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                                        <strong className="text-blue-400 block mb-1">Slow / Insidious Depressurization</strong>
                                        <p className="text-slate-300 leading-relaxed">
                                            Most dangerous! Subtle leak through a door seal or faulty controller. Gradual onset of hypoxia can incapacitate pilots without notice unless cabin alt warning horn sounds (10,000 ft).
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-4">Critical Emergency Altitude Thresholds</h3>
                                    <div className="space-y-3 text-xs">
                                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                                            <span className="font-bold text-white">10,000 FT</span>
                                            <span className="text-slate-400">Cabin Altitude Warning Horn sounds.</span>
                                        </div>
                                        <div className="p-3 bg-red-950/20 rounded-xl border border-red-500/30 flex justify-between items-center">
                                            <span className="font-bold text-red-400">14,000 FT</span>
                                            <span className="text-red-300">Passenger oxygen masks drop automatically.</span>
                                        </div>
                                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                                            <span className="font-bold text-emerald-400">10,000 FT / MSA</span>
                                            <span className="text-slate-400">Emergency descent recovery target altitude.</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300">
                                    <strong className="text-white block mb-1">Crew Action:</strong>
                                    Don oxygen masks immediately (100% positive pressure) before any checklist action, establish crew communication, then initiate Emergency Descent with full speedbrakes and V_MO / M_MO.
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
