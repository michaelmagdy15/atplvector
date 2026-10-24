import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
    Legend
} from 'recharts';
import {
    Flame,
    Wind,
    Gauge,
    Activity,
    Cpu,
    ShieldAlert,
    Zap,
    Target,
    Thermometer,
    RotateCw,
    AlertTriangle,
    ArrowRight,
    CheckCircle,
    XCircle,
    Info,
    Scale,
    Layers,
    Sliders,
    Sparkles,
    Settings
} from 'lucide-react';

const JetEnginePrinciples: React.FC = () => {
    const [activeTab, setActiveTab] = useState<
        'brayton' | 'diffuser' | 'types' | 'compressor' | 'combustion' | 'creep' | 'fadec' | 'quiz'
    >('brayton');

    const tabs = [
        { id: 'brayton', label: 'Brayton Cycle', icon: Activity },
        { id: 'diffuser', label: 'Divergent Duct & Flow', icon: Wind },
        { id: 'types', label: 'Turbofan BPR (80/20)', icon: Target },
        { id: 'compressor', label: 'Stall & Surge', icon: AlertTriangle },
        { id: 'combustion', label: 'Combustor & Cooling', icon: Flame },
        { id: 'creep', label: 'Thermal Creep & Flex Calc', icon: Thermometer },
        { id: 'fadec', label: 'FADEC & PMA Architecture', icon: Cpu },
        { id: 'quiz', label: 'ATPL 021 Exam Quiz', icon: ShieldAlert },
    ];

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <Flame className="text-orange-500 animate-pulse" />
                        Gas Turbines &amp; Jet Engines (ATPL 021)
                    </h1>
                    <p className="text-slate-400 mt-2 max-w-2xl leading-relaxed">
                        The continuous open Brayton cycle, divergent duct aerodynamics, compressor stall/surge dynamics, high-bypass ratio thrust mechanics, turbine blade creep, and FADEC architecture.
                    </p>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-xl text-xs text-slate-400">
                    <span className="text-orange-400 font-bold uppercase tracking-wider">EASA ATPL Engines Chapter</span> Grounded
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 bg-slate-900/50 p-1 rounded-xl w-full border border-slate-800">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
                            activeTab === tab.id
                                ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/20'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <tab.icon size={15} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Body */}
            <AnimatePresence mode="wait">
                {activeTab === 'brayton' && <BraytonCycle key="brayton" />}
                {activeTab === 'diffuser' && <DiffuserAirflow key="diffuser" />}
                {activeTab === 'types' && <EngineTypesAndBPR key="types" />}
                {activeTab === 'compressor' && <CompressorStallSurge key="compressor" />}
                {activeTab === 'combustion' && <CombustionChamber key="combustion" />}
                {activeTab === 'creep' && <TurbineCreepAndFlexTakeoff key="creep" />}
                {activeTab === 'fadec' && <FADECArchitecture key="fadec" />}
                {activeTab === 'quiz' && <QuickQuiz key="quiz" />}
            </AnimatePresence>
        </div>
    );
};

// ==========================================
// 1. BRAYTON CYCLE & OTTO COMPARISON
// ==========================================
const pvData = [
    { v: 10, p: 1, c: '1. Ambient Intake (1-2)' },
    { v: 2.2, p: 28, c: '2. Compressor Discharge (2-3)' },
    { v: 4.8, p: 27, c: '3. Combustion Chamber (Constant Pressure) (3-4)' },
    { v: 9.6, p: 1.8, c: '4. Turbine & Nozzle Expansion (4-5)' },
];

const BraytonCycle: React.FC = () => {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Continuous Gas Flow Visualizer */}
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl flex flex-col items-center justify-between min-h-[440px] shadow-xl">
                    <div className="w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Activity className="text-orange-400" />
                                Continuous Open Brayton Cycle
                            </h3>
                            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                                Constant Pressure Combustion
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                            Unlike the reciprocating Otto cycle where combustion is intermittent (25–30 distinct explosions/sec in closed cylinders), the gas turbine conducts induction, compression, combustion, and exhaust <strong>simultaneously and continuously</strong> in open flow.
                        </p>
                    </div>

                    {/* Flow tube */}
                    <div className="relative w-full h-44 bg-slate-950 rounded-2xl border-2 border-slate-700 overflow-hidden flex items-center shadow-inner my-2">
                        {/* Animated airflow stream */}
                        <motion.div
                            className="absolute inset-0 flex"
                            animate={{ x: [-120, 120] }}
                            transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
                        >
                            {Array.from({ length: 24 }).map((_, i) => (
                                <div key={i} className="h-full w-1.5 bg-gradient-to-r from-transparent via-sky-400/25 to-transparent mx-3" />
                            ))}
                        </motion.div>

                        {/* Station Blocks */}
                        <div className="flex w-full h-full relative z-10 font-black text-xs text-center">
                            <div className="flex-1 bg-blue-950/80 flex flex-col justify-center items-center border-r border-slate-700/60 p-1">
                                <span className="text-blue-300">INTAKE</span>
                                <span className="text-[9px] text-slate-400 font-normal">P_amb, T_amb</span>
                            </div>
                            <div className="flex-[1.5] bg-blue-900/80 flex flex-col justify-center items-center border-r border-slate-700/60 p-1">
                                <span className="text-sky-300">COMPRESSOR</span>
                                <span className="text-[9px] text-emerald-400 font-mono">P ↑↑ | T ↑ | V ↓</span>
                            </div>
                            <div className="flex-[1.8] bg-orange-950/80 flex flex-col justify-center items-center border-r border-slate-700/60 p-1">
                                <span className="text-orange-400 font-bold">COMBUSTOR</span>
                                <span className="text-[9px] text-amber-300 font-mono">P = const | T ↑↑↑</span>
                            </div>
                            <div className="flex-[1.4] bg-red-950/80 flex flex-col justify-center items-center border-r border-slate-700/60 p-1">
                                <span className="text-red-400">TURBINE</span>
                                <span className="text-[9px] text-orange-300 font-mono">Drives Spools</span>
                            </div>
                            <div className="flex-1 bg-slate-900/90 flex flex-col justify-center items-center p-1">
                                <span className="text-slate-300">NOZZLE</span>
                                <span className="text-[9px] text-sky-400 font-mono">Vel ↑↑ (Thrust)</span>
                            </div>
                        </div>
                    </div>

                    {/* Anti-Pattern Alert from EASA Engines Module */}
                    <div className="w-full mt-4 p-3 bg-red-950/30 border border-red-900/40 rounded-xl text-xs text-red-300 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <div>
                            <strong>EASA Engines Module Anti-Pattern:</strong> Snapping turbine throttles open abruptly dumps excess fuel into combustors, spikes backpressure, and drives compressor blades into an <strong>instantaneous surge</strong>.
                        </div>
                    </div>
                </div>

                {/* P-V Diagram */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Gauge className="text-orange-400" />
                            Ideal Brayton P-V Diagram
                        </h3>
                        <span className="text-xs font-mono text-slate-400">Pressure vs Volume</span>
                    </div>

                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={pvData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis
                                    dataKey="v"
                                    type="number"
                                    name="Specific Volume"
                                    stroke="#94a3b8"
                                    label={{ value: "Specific Volume (v)", position: "insideBottomRight", offset: -5, fill: '#94a3b8' }}
                                />
                                <YAxis
                                    stroke="#94a3b8"
                                    label={{ value: "Pressure (P)", angle: -90, position: "insideLeft", fill: '#94a3b8' }}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                                    formatter={(value: any, name: any, item: any) => [`P: ${value} bar, V: ${item.payload.v}`, item.payload.c]}
                                />
                                <Line type="linear" dataKey="p" stroke="#f97316" strokeWidth={3} dot={{ r: 6, fill: '#f97316' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="bg-slate-950 p-3 rounded-lg border border-white/5">
                            <div className="text-[10px] text-slate-400 uppercase font-bold">Thermal Efficiency Formula</div>
                            <div className="text-sm text-emerald-400 font-mono mt-1 font-bold">η = 1 - (1 / r_p^((γ-1)/γ))</div>
                            <div className="text-[10px] text-slate-500 mt-0.5">r_p = Pressure Ratio, γ = 1.4 for air</div>
                        </div>
                        <div className="bg-slate-950 p-3 rounded-lg border border-white/5">
                            <div className="text-[10px] text-slate-400 uppercase font-bold">Isobaric Combustion</div>
                            <div className="text-sm text-white mt-1">Heat addition occurs at essentially constant pressure</div>
                            <div className="text-[10px] text-slate-500 mt-0.5">Pressure drops slightly due to duct friction (~2-5%)</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Direct Standard ATPL Reference Table */}
            <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-2xl shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                    <Scale className="text-orange-400 w-6 h-6" />
                    <div>
                        <h3 className="text-xl font-bold text-white">Comparative Summary: Otto vs Brayton Engines</h3>
                        <p className="text-xs text-slate-400 mt-0.5">ATPL 021 Powerplants Syllabus Core Matrix</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="border-b border-slate-700 bg-slate-800/40 text-xs font-bold uppercase tracking-wider text-slate-300">
                                <th className="p-3">Design Parameter</th>
                                <th className="p-3 text-orange-400">Reciprocating Engine (Otto)</th>
                                <th className="p-3 text-sky-400">High-Bypass Gas Turbine (Brayton)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-slate-300">
                            <tr>
                                <td className="p-3 font-bold text-white">Cycle Type</td>
                                <td className="p-3">4-Stroke Otto (Constant Volume Combustion)</td>
                                <td className="p-3">Continuous Open Brayton (Constant Pressure Combustion)</td>
                            </tr>
                            <tr>
                                <td className="p-3 font-bold text-white">Combustion Event</td>
                                <td className="p-3">Intermittent explosions (25–30 cycles/sec per cylinder)</td>
                                <td className="p-3">Continuous steady uninterrupted flame front</td>
                            </tr>
                            <tr>
                                <td className="p-3 font-bold text-white">Fuel Specification</td>
                                <td className="p-3">AVGAS 100LL (Dyed blue, TEL additive, flash pt -40°C)</td>
                                <td className="p-3">JET A-1 (Kerosene, straw-colored, flash pt &gt; 38°C)</td>
                            </tr>
                            <tr>
                                <td className="p-3 font-bold text-white">Thrust Generation</td>
                                <td className="p-3">Propeller air acceleration</td>
                                <td className="p-3 font-semibold text-emerald-400">
                                    80% Bypass fan air + 20% Core exhaust jet
                                </td>
                            </tr>
                            <tr>
                                <td className="p-3 font-bold text-white">Thermal Limit Parameter</td>
                                <td className="p-3">Cylinder Head Temp (CHT) &amp; Oil Temp</td>
                                <td className="p-3 font-semibold text-red-400">Turbine Entry Temp (TET) / EGT (Blade Creep)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

// ==========================================
// 2. DIVERGENT DUCT & DIFFUSER SECTION
// ==========================================
const flowStationData = [
    { station: '1. Intake', velocity: 160, staticP: 1.0, totalP: 1.0 },
    { station: '2. Compressor Exit', velocity: 155, staticP: 28.0, totalP: 30.0 },
    { station: '3. Diffuser Duct', velocity: 30, staticP: 29.5, totalP: 29.8 },
    { station: '4. Combustor Flame', velocity: 25, staticP: 28.5, totalP: 28.7 },
    { station: '5. Turbine Inlet', velocity: 350, staticP: 9.0, totalP: 25.0 },
    { station: '6. Jet Nozzle', velocity: 580, staticP: 1.0, totalP: 1.8 },
];

const DiffuserAirflow: React.FC = () => {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Divergent Duct Theory */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
                    <div className="flex items-center gap-3">
                        <Wind className="text-sky-400 w-6 h-6" />
                        <div>
                            <h3 className="text-xl font-bold text-white">The Divergent Duct Principle</h3>
                            <p className="text-xs text-slate-400">Mental Model from EASA ATPL Ch05</p>
                        </div>
                    </div>

                    <div className="p-4 bg-sky-950/30 border border-sky-800/40 rounded-xl space-y-2 text-xs text-slate-300">
                        <p className="font-bold text-sky-300">
                            Subsonic Duct Rule (Bernoulli &amp; Continuity Equations):
                        </p>
                        <p className="leading-relaxed font-mono text-emerald-300">
                            A₁ &lt; A₂ (Widening / Divergent Passage) ⟹ Velocity (V) ↓ | Static Pressure (P_s) ↑
                        </p>
                        <p className="text-slate-400 leading-relaxed">
                            In subsonic flow, as a duct expands in cross-sectional area, kinetic energy (dynamic pressure ½ρV²) is converted into potential energy (static pressure). This fundamental principle governs both the compressor stators and the combustion chamber <strong>diffuser section</strong>.
                        </p>
                    </div>

                    {/* Diffuser Section Explainer */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            <Layers className="text-orange-400 w-4 h-4" />
                            Why the Diffuser Is Vital Ahead of Combustion
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            Air leaves the final high-pressure compressor stage at excessive speeds (approx <strong>150 m/s</strong>).
                        </p>
                        <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside leading-relaxed">
                            <li>
                                <strong>Flameout Prevention:</strong> Kerosene fuel burns at a flame propagation rate of only ~<strong>10 to 25 m/s</strong>. If air entered the combustion chamber at compressor exit speed, the flame would instantly blow out.
                            </li>
                            <li>
                                <strong>Maximum Static Pressure Conversion:</strong> The divergent diffuser section decelerates the airflow to ~<strong>25 m/s</strong>, converting dynamic pressure into the peak static pressure needed for combustion and expansion across the turbine.
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Pressure & Velocity Distribution Graph */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-white">Airflow Velocity &amp; Pressure Profiles</h3>
                        <span className="text-xs font-mono text-slate-400">Engine Stations</span>
                    </div>
                    <p className="text-xs text-slate-400">
                        Watch Station 3 (Diffuser): Air velocity plummets as static pressure peaks right before combustion.
                    </p>

                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={flowStationData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="station" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                                <YAxis yAxisId="left" stroke="#38bdf8" label={{ value: "Velocity (m/s)", angle: -90, position: "insideLeft", fill: '#38bdf8' }} />
                                <YAxis yAxisId="right" orientation="right" stroke="#f97316" label={{ value: "Static Pressure (bar)", angle: 90, position: "insideRight", fill: '#f97316' }} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
                                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                                <Line yAxisId="left" type="monotone" dataKey="velocity" name="Velocity (m/s)" stroke="#38bdf8" strokeWidth={3} />
                                <Line yAxisId="right" type="monotone" dataKey="staticP" name="Static Pressure (bar)" stroke="#f97316" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-xl border border-white/5 text-[11px] text-slate-400">
                        <strong className="text-white">ATPL Key takeaway:</strong> Across the entire engine, <strong>Total Pressure</strong> only rises in the compressor (energy added by turbine work) and continuously drops through the combustor, turbine, and nozzle due to friction and extraction of work.
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// ==========================================
// 3. ENGINE TYPES & TURBOFAN BPR (80/20)
// ==========================================
const EngineTypesAndBPR: React.FC = () => {
    const [bpr, setBpr] = useState<number>(8.5); // Bypass ratio 0 to 12
    const totalMassFlow = 600; // kg/s

    // Core mass flow vs bypass mass flow
    const coreMass = totalMassFlow / (1 + bpr);
    const bypassMass = totalMassFlow - coreMass;

    // Fan air velocity vs Core jet velocity (m/s)
    const fanVel = 320;
    const coreVel = 480;
    const tas = 230; // cruise speed m/s

    // Thrust calculation: F = m * (Vj - V0)
    const fanThrust = Math.round(bypassMass * (fanVel - tas));
    const coreThrust = Math.round(coreMass * (coreVel - tas));
    const totalThrust = fanThrust + coreThrust;

    const fanThrustPercent = Math.round((fanThrust / totalThrust) * 100);
    const coreThrustPercent = 100 - fanThrustPercent;

    // Froude propulsive efficiency: eta_p = 2 / (1 + Vj/V0)
    const avgVj = (fanThrust * fanVel + coreThrust * coreVel) / (totalThrust || 1);
    const propulsiveEfficiency = Math.min(95, Math.round((2 / (1 + avgVj / tas)) * 100));

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
            {/* Architectural Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                    <div className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">Turbojet (BPR = 0)</div>
                    <p className="text-xs text-slate-300 mb-3">All air enters the core. High exhaust velocity, high jet noise, poor subsonic fuel economy. Used in supersonic flight (Concorde, fighter jets).</p>
                    <div className="text-[11px] font-mono text-slate-400">100% Core Jet Thrust</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl border-l-4 border-l-sky-500">
                    <div className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-1">High-Bypass Turbofan (BPR 5:1 – 12:1+)</div>
                    <p className="text-xs text-slate-300 mb-3">Large forward fan accelerates cold bypass air around the core. Extremely high propulsive efficiency, lower noise, low SFC. (A320neo, B787, B777X).</p>
                    <div className="text-[11px] font-mono text-emerald-400 font-bold">~80% Fan Thrust / ~20% Core Thrust</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                    <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Turboprop / Turboshaft</div>
                    <p className="text-xs text-slate-300 mb-3">Turbine extracts up to 90–100% of expansion energy to drive a reduction gearbox and propeller or helicopter rotor shaft. Negligible jet thrust.</p>
                    <div className="text-[11px] font-mono text-slate-400">Shaft Horsepower (SHP) Dominant</div>
                </div>
            </div>

            {/* TURBOFAN HIGH/LOW BPR CALCULATOR */}
            <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-2xl shadow-xl space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Sliders className="text-orange-400" />
                            High-Bypass Turbofan Thrust Split &amp; Efficiency Calculator
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                            Grounding EASA Engines Module: 80% thrust from fan cold air, 20% from core hot exhaust.
                        </p>
                    </div>
                    <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono text-sky-300">
                        Cruise TAS: {tas} m/s (~450 kts)
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Controls */}
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                <span>Engine Bypass Ratio (BPR)</span>
                                <span className="text-white font-mono text-sm">{bpr.toFixed(1)} : 1</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="14"
                                step="0.5"
                                value={bpr}
                                onChange={(e) => setBpr(parseFloat(e.target.value))}
                                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                            />
                            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                                <span>0:1 (Pure Turbojet)</span>
                                <span>5:1 (Early Turbofan)</span>
                                <span>8.5:1 (CFM LEAP)</span>
                                <span>14:1 (Ultra-High BPR)</span>
                            </div>
                        </div>

                        {/* Visual Thrust Split Bar */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold uppercase">
                                <span className="text-sky-400">Fan Bypass Air Thrust ({fanThrustPercent}%)</span>
                                <span className="text-red-400">Core Jet Exhaust Thrust ({coreThrustPercent}%)</span>
                            </div>
                            <div className="w-full h-8 bg-slate-800 rounded-xl overflow-hidden flex shadow-inner">
                                <div
                                    className="h-full bg-gradient-to-r from-sky-600 to-sky-400 transition-all duration-300 flex items-center justify-center text-xs font-black text-slate-900"
                                    style={{ width: `${fanThrustPercent}%` }}
                                >
                                    {fanThrustPercent > 15 ? `${fanThrustPercent}% FAN` : ''}
                                </div>
                                <div
                                    className="h-full bg-gradient-to-r from-red-500 to-amber-500 transition-all duration-300 flex items-center justify-center text-xs font-black text-white"
                                    style={{ width: `${coreThrustPercent}%` }}
                                >
                                    {coreThrustPercent > 15 ? `${coreThrustPercent}% CORE` : ''}
                                </div>
                            </div>
                        </div>

                        {/* Froude Efficiency Note */}
                        <div className="p-4 bg-slate-950 rounded-xl border border-white/5 text-xs text-slate-300 leading-relaxed space-y-1">
                            <div className="font-bold text-white flex items-center gap-1.5">
                                <Sparkles className="w-4 h-4 text-yellow-400" />
                                The Froude Propulsive Efficiency Advantage
                            </div>
                            <p className="text-slate-400 text-[11px] leading-relaxed">
                                Thrust equals momentum change: <em>F = ṁ · ΔV</em>. However, kinetic energy lost in the wake equals <em>½ṁ(ΔV)²</em>. Accelerating a <strong>massive airflow by a modest velocity increment</strong> produces the exact same thrust with drastically less fuel burn and dramatically lower acoustic noise.
                            </p>
                        </div>
                    </div>

                    {/* Calculated Output Cards */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Total Net Thrust</div>
                            <div className="text-2xl font-black text-white font-mono mt-1">
                                {(totalThrust / 1000).toFixed(1)} <span className="text-xs text-slate-500">kN</span>
                            </div>
                            <div className="text-[10px] text-slate-400 mt-1">
                                Fan: {(fanThrust / 1000).toFixed(1)} kN | Core: {(coreThrust / 1000).toFixed(1)} kN
                            </div>
                        </div>

                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Propulsive Efficiency (η_p)</div>
                            <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
                                {propulsiveEfficiency}%
                            </div>
                            <div className="text-[10px] text-slate-400 mt-1">
                                {bpr >= 8 ? 'High Subsonic Optimum' : 'Lower Propulsive Efficiency'}
                            </div>
                        </div>

                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Cold Bypass Air Mass</div>
                            <div className="text-xl font-black text-sky-400 font-mono mt-1">
                                {Math.round(bypassMass)} <span className="text-xs text-slate-500">kg/s</span>
                            </div>
                            <div className="text-[10px] text-slate-500 mt-1">Shrouded bypass duct flow</div>
                        </div>

                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Hot Core Gas Mass</div>
                            <div className="text-xl font-black text-red-400 font-mono mt-1">
                                {Math.round(coreMass)} <span className="text-xs text-slate-500">kg/s</span>
                            </div>
                            <div className="text-[10px] text-slate-500 mt-1">Combustor &amp; Turbine flow</div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// ==========================================
// 4. COMPRESSOR STALL VS SURGE MECHANICS
// ==========================================
const CompressorStallSurge: React.FC = () => {
    const [axialVel, setAxialVel] = useState<number>(140); // m/s
    const [rpm, setRpm] = useState<number>(95); // % N2
    const [bleedsOpen, setBleedsOpen] = useState<boolean>(false);

    // Calculate effective Angle of Attack (AoA) on compressor rotor blades
    // High RPM (high blade tangential velocity U) + Low Axial Velocity (Va) = Excessive AoA
    const effectiveAxial = bleedsOpen ? axialVel + 25 : axialVel;
    const bladeAoA = Math.round((rpm * 0.22) - (effectiveAxial * 0.08) + 4);

    let state: 'normal' | 'stall' | 'surge' = 'normal';
    let stateLabel = 'Stable Aerodynamic Flow';
    let stateColor = 'text-emerald-400';
    let symptomDesc = 'Compressor rotor blades operating within laminar boundary layer limits.';

    if (bladeAoA >= 16) {
        state = 'surge';
        stateLabel = 'CRITICAL COMPRESSOR SURGE';
        stateColor = 'text-red-500 animate-pulse';
        symptomDesc = 'Complete breakdown of airflow across the entire compressor spool. High-pressure combustion gas explosively reverses forward out through the intake! Loud bangs, flame belching, violent vibration, EGT spike.';
    } else if (bladeAoA >= 11) {
        state = 'stall';
        stateLabel = 'ROTATING COMPRESSOR STALL';
        stateColor = 'text-amber-400';
        symptomDesc = 'Aerodynamic stall of individual rotor blades or blade tip pockets. Manifests as a low-frequency rumble, airframe vibration, and rising EGT.';
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Aerodynamic Blade Theory Card */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="text-red-500 w-6 h-6" />
                        <div>
                            <h3 className="text-xl font-bold text-white">Compressor Stall vs Surge Mechanics</h3>
                            <p className="text-xs text-slate-400">Mental Model: &quot;Compressor Blade as a Wing&quot; (EASA Engines Module)</p>
                        </div>
                    </div>

                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-300">
                        <p className="font-bold text-orange-400">
                            Aerodynamic Angle of Attack (AoA) Vector:
                        </p>
                        <p className="text-slate-300 leading-relaxed">
                            Every compressor blade is a rotating miniature aerofoil. The relative airflow it experiences is the vector resultant of two velocities:
                        </p>
                        <ol className="list-decimal list-inside space-y-1 text-slate-400 font-mono">
                            <li><strong>Axial Velocity (V_a):</strong> Airspeed rushing into the engine core.</li>
                            <li><strong>Rotational Velocity (U):</strong> Tangential blade speed driven by the turbine spool.</li>
                        </ol>
                        <p className="text-slate-300 mt-2">
                            If <strong>Axial Velocity drops</strong> (e.g., crosswind gust, bird ingestion, ice contamination, intake distortion) or <strong>RPM increases too rapidly</strong> (snapping the throttle open), the angle of attack exceeds the blade&apos;s critical stall angle (α_crit).
                        </p>
                    </div>

                    {/* Anti-Stall Protections */}
                    <div className="space-y-2">
                        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Engine Anti-Stall Automation</h4>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="p-3 bg-slate-950 rounded-xl border border-white/5">
                                <div className="font-bold text-sky-400 mb-1">Variable Stator Vanes (VSVs)</div>
                                <p className="text-[11px] text-slate-400">
                                    Hydraulically modulated stator vanes swivel at low/transient RPM to direct incoming air onto rotor blades at safe angles of attack.
                                </p>
                            </div>
                            <div className="p-3 bg-slate-950 rounded-xl border border-white/5">
                                <div className="font-bold text-emerald-400 mb-1">Transient Bleed Valves</div>
                                <p className="text-[11px] text-slate-400">
                                    Automatically open at low RPM or during engine acceleration to dump excess interstage air, preserving downstream axial velocity.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Interactive Stall & Surge Simulator */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-white">Aerodynamic Stall Simulator</h3>
                        <span className={`text-xs font-black uppercase font-mono px-2 py-0.5 rounded ${
                            state === 'normal' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40' :
                            state === 'stall' ? 'bg-amber-950/40 text-amber-400 border border-amber-800/40' :
                            'bg-red-950/60 text-red-400 border border-red-800/60 animate-pulse'
                        }`}>
                            {state.toUpperCase()}
                        </span>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                <span>Spool Rotational Speed (N2 RPM)</span>
                                <span className="text-white font-mono">{rpm}%</span>
                            </div>
                            <input
                                type="range"
                                min="60"
                                max="110"
                                step="1"
                                value={rpm}
                                onChange={(e) => setRpm(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                <span>Core Axial Air Velocity (V_a)</span>
                                <span className="text-white font-mono">{axialVel} m/s</span>
                            </div>
                            <input
                                type="range"
                                min="60"
                                max="180"
                                step="2"
                                value={axialVel}
                                onChange={(e) => setAxialVel(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                            />
                            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                                <span>Low Velocity (Intake distortion / Crosswind)</span>
                                <span>High Clean Ram Airflow</span>
                            </div>
                        </div>

                        {/* Transient Bleed Valve Toggle */}
                        <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                            <div>
                                <div className="text-xs font-bold text-white">Transient Bleed Valves</div>
                                <div className="text-[10px] text-slate-400">Vents interstage pressure to unload compressor</div>
                            </div>
                            <button
                                onClick={() => setBleedsOpen(!bleedsOpen)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                    bleedsOpen ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400'
                                }`}
                            >
                                {bleedsOpen ? 'VALVES OPEN (Unloaded)' : 'VALVES CLOSED'}
                            </button>
                        </div>

                        {/* State & Instrument Reaction */}
                        <div className="p-4 bg-slate-950 rounded-xl border border-white/5 space-y-2">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400">Effective Blade Angle of Attack:</span>
                                <span className="font-mono font-bold text-white text-sm">{bladeAoA}° (Stall at &ge; 11°, Surge at &ge; 16°)</span>
                            </div>
                            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-300 ${
                                        state === 'normal' ? 'bg-emerald-500' : state === 'stall' ? 'bg-amber-400' : 'bg-red-500 animate-pulse'
                                    }`}
                                    style={{ width: `${Math.min(100, (bladeAoA / 20) * 100)}%` }}
                                />
                            </div>
                            <p className="text-[11px] text-slate-300 leading-relaxed pt-1">{symptomDesc}</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// ==========================================
// 5. COMBUSTION CHAMBER & COOLING AIR
// ==========================================
const relightData = [
    { airspeed: 120, alt: 10000 },
    { airspeed: 180, alt: 22000 },
    { airspeed: 250, alt: 30000 },
    { airspeed: 320, alt: 32000 },
    { airspeed: 400, alt: 25000 },
    { airspeed: 460, alt: 15000 },
];

const CombustionChamber: React.FC = () => {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Airflow Splitting: Primary vs Cooling Air */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Flame className="text-orange-400" />
                            Primary vs Secondary Cooling Airflow
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                            Crucial ATPL 021 concept: Jet engines are limited by Turbine Entry Temperature (TET).
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="p-4 bg-red-950/30 border border-red-900/40 rounded-xl space-y-1">
                            <div className="text-xs font-bold text-red-400 uppercase">Primary Combustion Zone (~20% Airflow)</div>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                Mixes with atomized fuel at a strict stoichiometric ratio (~<strong>15:1</strong> by weight) to sustain stable combustion with a flame temperature exceeding <strong>2,000°C</strong>.
                            </p>
                        </div>

                        <div className="p-4 bg-sky-950/30 border border-sky-900/40 rounded-xl space-y-1">
                            <div className="text-xs font-bold text-sky-400 uppercase">Secondary &amp; Dilution Cooling Air (~60–80% Airflow)</div>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                Dilutes the overall air/fuel ratio to approx <strong>60:1</strong>. This massive flow wraps around the flame tube, cools the gas stream to ~<strong>1,100°C</strong>, and forms a protective cooling film over nozzle guide vanes and High-Pressure Turbine (HPT) blades to prevent immediate melting.
                            </p>
                        </div>
                    </div>

                    {/* Combustor Chamber Layouts */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                            <div className="font-bold text-white mb-1">Multiple Can</div>
                            <div className="text-slate-400 text-[10px]">Individual cylindrical cans. Heavy, high pressure drop, easy to replace.</div>
                        </div>
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                            <div className="font-bold text-white mb-1">Can-Annular</div>
                            <div className="text-slate-400 text-[10px]">Multiple flame tubes sharing an annular air casing. Good rigidity.</div>
                        </div>
                        <div className="bg-slate-950 p-3 rounded-xl border border-orange-500/30 bg-orange-950/20">
                            <div className="font-bold text-orange-400 mb-1">Full Annular</div>
                            <div className="text-slate-400 text-[10px]">Single continuous 360° ring. Shortest, lightest, lowest surface area (Modern standard).</div>
                        </div>
                    </div>
                </div>

                {/* In-Flight Relight Envelope */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <RotateCw className="text-amber-400" />
                            Windmilling In-Flight Relight Envelope
                        </h3>
                        <span className="text-xs font-mono text-slate-400">Airspeed vs Altitude</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                        Following a flameout, the engine windmill rotation must be fast enough to drive the high-pressure compressor to the minimum pressure ratio before fuel and high-energy igniters can re-light the core.
                    </p>

                    <div className="h-60 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={relightData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="airspeed" type="number" domain={[100, 500]} name="Airspeed (kts)" stroke="#94a3b8" />
                                <YAxis dataKey="alt" type="number" stroke="#94a3b8" label={{ value: "Altitude (ft)", angle: -90, position: "insideLeft", fill: '#94a3b8' }} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff' }} />
                                <Area type="monotone" dataKey="alt" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} name="Safe Relight Boundary" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="text-[11px] text-center text-amber-400 font-mono">
                        Safe Relight Region: High forward airspeed required at high altitude to windmill N2 &gt; 12–15%.
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// ==========================================
// 6. TURBINE BLADE THERMAL CREEP & FLEX TAKEOFF
// ==========================================
const TurbineCreepAndFlexTakeoff: React.FC = () => {
    const actualOAT = 22; // °C
    const [assumedTemp, setAssumedTemp] = useState<number>(48); // °C (Flex temp)
    const runwayAvailable = 3000; // meters

    // Grounding Engine Performance Worked Example:
    // Full rated thrust at 22°C: Peak EGT = 920°C, Takeoff run = 2,000m
    // Assumed temperature = 48°C:
    // FADEC meters reduced fuel flow matching 48°C lower air density
    // Peak EGT drops to 830°C (-90°C drop)
    // Takeoff run increases by +250m to 2,250m (well within 3,000m available runway)
    // Blade creep rate drops exponentially, extending on-wing core life by 400%!

    const flexDelta = Math.max(0, assumedTemp - actualOAT);
    const peakEgt = Math.round(920 - (flexDelta * 3.46)); // 920°C down to ~830°C at 48°C
    const takeoffRun = Math.round(2000 + (flexDelta * 9.6)); // 2000m up to ~2250m at 48°C
    const runwayMargin = runwayAvailable - takeoffRun;

    // Relative creep deformation rate (normalized to 100% at full rated 920°C)
    // Thermal creep follows Arrhenius exponential law: rate ~ e^(-Q/RT)
    const creepRatePercent = Math.max(15, Math.round(Math.pow((peakEgt - 700) / 220, 3) * 100));
    const lifeExtensionPercent = Math.round((100 / (creepRatePercent / 100)) - 100);

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
            {/* Explainer: Blade Thermal Creep */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
                <div className="flex items-center gap-3">
                    <Thermometer className="text-red-500 w-6 h-6" />
                    <div>
                        <h3 className="text-xl font-bold text-white">Turbine Blade Thermal Creep Mechanics</h3>
                        <p className="text-xs text-slate-400">Microscopic Plastic Deformation at Extreme Temperatures</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                        <div className="font-bold text-orange-400 mb-1">1. Centrifugal Tensile Load</div>
                        <p className="text-slate-400 text-[11px] leading-relaxed">
                            Turbine discs spin at up to 15,000+ RPM. A single 50g HPT stage 1 blade exerts several tons of centrifugal outward pull on the disc dovetail root.
                        </p>
                    </div>
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                        <div className="font-bold text-red-400 mb-1">2. Thermal Plastic Creep</div>
                        <p className="text-slate-400 text-[11px] leading-relaxed">
                            At metal temperatures &gt; 900°C, crystal grain boundaries slip. The blade undergoes slow, irreversible plastic stretching (&quot;creep&quot;) over time until the tip rubs against the outer casing shroud.
                        </p>
                    </div>
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                        <div className="font-bold text-emerald-400 mb-1">3. The Assumed Temp (Flex) Solution</div>
                        <p className="text-slate-400 text-[11px] leading-relaxed">
                            Lowering peak takeoff EGT by just <strong>50°C to 90°C</strong> slows metallurgical creep by up to <strong>75%</strong>, quadrupling the engine&apos;s operational life before expensive shop overhauls.
                        </p>
                    </div>
                </div>
            </div>

            {/* FLEX DERATE TEMPERATURE CALCULATOR */}
            <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-2xl shadow-xl space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Sliders className="text-orange-400" />
                            Assumed Temperature (Flex) Takeoff Method Calculator
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                            Exact worked scenario from EASA ATPL Ch05: Actual OAT 22°C vs Assumed Temp 48°C.
                        </p>
                    </div>
                    <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono text-emerald-300">
                        Runway Available: {runwayAvailable.toLocaleString()} m
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Input Controls */}
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                <span>Actual Airport OAT (Static Temperature)</span>
                                <span className="text-white font-mono text-sm">{actualOAT}°C</span>
                            </div>
                            <div className="w-full h-2 bg-slate-800 rounded-lg relative overflow-hidden">
                                <div className="h-full bg-blue-500 w-[22%]" />
                            </div>
                            <div className="text-[10px] text-slate-500 mt-1">Measured at airfield surface</div>
                        </div>

                        <div>
                            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                <span>FADEC Assumed (Flex) Takeoff Temperature</span>
                                <span className="text-orange-400 font-mono text-base font-black">{assumedTemp}°C</span>
                            </div>
                            <input
                                type="range"
                                min={actualOAT}
                                max="60"
                                step="1"
                                value={assumedTemp}
                                onChange={(e) => setAssumedTemp(parseInt(e.target.value))}
                                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                            />
                            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                                <span>{actualOAT}°C (Full Rated Thrust)</span>
                                <span>48°C (Standard Flex Derate)</span>
                                <span>60°C (Max Derate Cutoff)</span>
                            </div>
                        </div>

                        {/* Runway Utilization Bar */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold uppercase">
                                <span className="text-slate-300">Takeoff Ground Roll: {takeoffRun.toLocaleString()} m</span>
                                <span className="text-emerald-400">Clearance Margin: +{runwayMargin.toLocaleString()} m</span>
                            </div>
                            <div className="w-full h-6 bg-slate-800 rounded-lg overflow-hidden flex shadow-inner">
                                <div
                                    className="h-full bg-gradient-to-r from-orange-600 to-amber-500 transition-all duration-300 flex items-center justify-center text-[10px] font-bold text-white"
                                    style={{ width: `${(takeoffRun / runwayAvailable) * 100}%` }}
                                >
                                    Roll ({Math.round((takeoffRun / runwayAvailable) * 100)}%)
                                </div>
                                <div
                                    className="h-full bg-emerald-950/60 transition-all duration-300 flex items-center justify-center text-[10px] font-bold text-emerald-400 border-l border-emerald-500/40"
                                    style={{ width: `${(runwayMargin / runwayAvailable) * 100}%` }}
                                >
                                    Stop Margin
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results Cards */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Peak Takeoff EGT</div>
                            <div className={`text-3xl font-black font-mono mt-1 ${peakEgt < 850 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {peakEgt}<span className="text-xs text-slate-500 ml-1">°C</span>
                            </div>
                            <div className="text-[10px] text-slate-400 mt-1">
                                Full Rated EGT: 920°C ({920 - peakEgt}°C Drop)
                            </div>
                        </div>

                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Engine On-Wing Life Extension</div>
                            <div className="text-3xl font-black text-sky-400 font-mono mt-1">
                                +{lifeExtensionPercent}%
                            </div>
                            <div className="text-[10px] text-slate-400 mt-1">
                                Quadruples core turbine life at 48°C!
                            </div>
                        </div>

                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Takeoff Run Delta</div>
                            <div className="text-xl font-black text-amber-400 font-mono mt-1">
                                +{takeoffRun - 2000} <span className="text-xs text-slate-500">meters</span>
                            </div>
                            <div className="text-[10px] text-slate-500 mt-1">Well within TODA &amp; ASDA limits</div>
                        </div>

                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">HPT Creep Wear Rate</div>
                            <div className="text-xl font-black text-purple-400 font-mono mt-1">
                                {creepRatePercent}% <span className="text-xs text-slate-500">of max</span>
                            </div>
                            <div className="text-[10px] text-slate-500 mt-1">Exponential creep reduction</div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// ==========================================
// 7. FADEC & INDEPENDENT PMA ARCHITECTURE
// ==========================================
const FADECArchitecture: React.FC = () => {
    const [activeChannel, setActiveChannel] = useState<'A' | 'B'>('A');
    const [pmaOnline, setPmaOnline] = useState<boolean>(true);

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Architectural Blueprint */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
                    <div className="flex items-center gap-3">
                        <Cpu className="text-cyan-400 w-6 h-6" />
                        <div>
                            <h3 className="text-xl font-bold text-white">FADEC Redundant Architecture</h3>
                            <p className="text-xs text-slate-400">Full Authority Digital Engine Control (Dual Channel)</p>
                        </div>
                    </div>

                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs text-slate-300">
                        <div className="font-bold text-white flex items-center gap-2">
                            <Info className="text-cyan-400 w-4 h-4" />
                            Core ATPL Operational Principles:
                        </div>
                        <ul className="space-y-2 text-slate-400 list-disc list-inside leading-relaxed">
                            <li>
                                <strong>Dual Channel Redundancy:</strong> Channel A and Channel B operate in active/standby mode. They continuously cross-talk and cross-validate sensor inputs. If one channel suffers degradation, authority transfers seamlessly to the healthy channel.
                            </li>
                            <li>
                                <strong>No Mechanical Reversion:</strong> Modern airliners have <strong>no cable linkages or hydro-mechanical backup</strong>. The thrust lever transmits only electrical resolver signals to the FADEC computer.
                            </li>
                            <li>
                                <strong>Total Failure Consequence:</strong> If both FADEC channels fail, the engine undergoes an automatic safety shutdown. It cannot run unmonitored.
                            </li>
                        </ul>
                    </div>

                    {/* Dedicated PMA Section */}
                    <div className="p-4 bg-amber-950/20 border border-amber-900/40 rounded-xl space-y-2 text-xs">
                        <div className="font-bold text-amber-400 flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            Dedicated Permanent Magnet Alternator (PMA)
                        </div>
                        <p className="text-slate-300 leading-relaxed">
                            FADEC does <strong>NOT</strong> rely on aircraft main generators or DC battery buses during normal flight!
                        </p>
                        <p className="text-slate-400 text-[11px] leading-relaxed">
                            A dedicated, engine-driven <strong>Permanent Magnet Alternator (PMA)</strong> mounted on the accessory gearbox powers FADEC independently once the engine spools above ~<strong>10% to 15% N2</strong>. A complete total failure of the aircraft electrical generators and battery will <strong>NOT</strong> flame out the engine!
                        </p>
                    </div>
                </div>

                {/* Interactive Schematic Diagram */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6 flex flex-col justify-between">
                    <div>
                        <h4 className="text-base font-bold text-white mb-4 flex items-center justify-between">
                            <span>System Interactive Signal Flow</span>
                            <span className="text-xs font-mono text-cyan-400">Channel {activeChannel} Active</span>
                        </h4>

                        {/* Power Source Block */}
                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 mb-4 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Zap className={pmaOnline ? 'text-amber-400' : 'text-slate-600'} size={18} />
                                <div>
                                    <div className="text-xs font-bold text-white">Engine Gearbox PMA</div>
                                    <div className="text-[10px] text-slate-400">{pmaOnline ? 'Self-Powered (Isolated from Aircraft Bus)' : 'Aircraft Essential Bus Backup (Cranking)'}</div>
                                </div>
                            </div>
                            <button
                                onClick={() => setPmaOnline(!pmaOnline)}
                                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300 rounded"
                            >
                                Toggle PMA
                            </button>
                        </div>

                        {/* Dual Channel Computer Visualizer */}
                        <div className="grid grid-cols-2 gap-4">
                            <div
                                onClick={() => setActiveChannel('A')}
                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                    activeChannel === 'A'
                                        ? 'border-cyan-500 bg-cyan-950/30 shadow-lg'
                                        : 'border-slate-800 bg-slate-950/40 opacity-50'
                                }`}
                            >
                                <div className="text-xs font-black uppercase text-cyan-400 mb-1">CHANNEL A</div>
                                <div className="text-[10px] text-slate-300">State: {activeChannel === 'A' ? 'CONTROLLING' : 'STANDBY HOT'}</div>
                                <div className="text-[9px] text-slate-500 mt-2 font-mono">Sensors: TLA, N1, N2, EGT, P3</div>
                            </div>

                            <div
                                onClick={() => setActiveChannel('B')}
                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                    activeChannel === 'B'
                                        ? 'border-cyan-500 bg-cyan-950/30 shadow-lg'
                                        : 'border-slate-800 bg-slate-950/40 opacity-50'
                                }`}
                            >
                                <div className="text-xs font-black uppercase text-cyan-400 mb-1">CHANNEL B</div>
                                <div className="text-[10px] text-slate-300">State: {activeChannel === 'B' ? 'CONTROLLING' : 'STANDBY HOT'}</div>
                                <div className="text-[9px] text-slate-500 mt-2 font-mono">Sensors: Dual-redundant resolvers</div>
                            </div>
                        </div>

                        {/* Actuator Outputs */}
                        <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                            <div className="text-[10px] font-bold text-slate-400 uppercase">Controlled Actuators</div>
                            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300">
                                <div>• Fuel Metering Valve (FMV)</div>
                                <div>• Variable Stator Vanes (VSVs)</div>
                                <div>• Transient Bleed Valves (TBVs)</div>
                                <div>• Active Clearance Control (ACC)</div>
                            </div>
                        </div>
                    </div>

                    <div className="p-3 bg-red-950/30 border border-red-900/40 rounded-xl text-[11px] text-red-300">
                        <strong>Safety Consequence:</strong> Complete dual-channel FADEC loss results in immediate fuel shutoff (fail-safe to prevent uncommanded engine overspeed).
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// ==========================================
// 8. ATPL 021 EXAMINATION QUICK QUIZ
// ==========================================
interface Question {
    q: string;
    a: string[];
    c: number;
    explanation: string;
}

const questions: Question[] = [
    {
        q: "In a continuous Brayton Cycle gas turbine, during which phase is heat added to the working fluid?",
        a: ["Constant Volume combustion", "Constant Pressure combustion", "Isothermal Expansion", "Polytropic Compression"],
        c: 1,
        explanation: "The Brayton cycle features continuous heat addition at approximately constant pressure (isobaric), unlike the Otto cycle's constant volume combustion."
    },
    {
        q: "What is the primary aerodynamic purpose of the divergent duct diffuser section immediately after the compressor?",
        a: [
            "Accelerate air to supersonic velocity for rapid ignition",
            "Decelerate airflow and convert kinetic velocity into maximum static pressure",
            "Cool the incoming air before the fuel nozzles",
            "Direct cold bypass airflow directly to the exhaust nozzle"
        ],
        c: 1,
        explanation: "The divergent diffuser slows the 150 m/s compressor exit air down to ~25 m/s to prevent flameout, converting dynamic pressure into peak static pressure."
    },
    {
        q: "What is the primary root aerodynamic cause of a compressor stall?",
        a: [
            "Excessive blade angle of attack due to low axial velocity or rapid acceleration",
            "Turbine blade thermal creep rubbing against the outer shroud",
            "Over-lean mixture causing delayed flame front",
            "Transient bleed valves remaining stuck open"
        ],
        c: 0,
        explanation: "Compressor blades are aerofoils. When axial velocity drops or RPM rises too rapidly, relative airflow angle exceeds the blade's critical stall angle."
    },
    {
        q: "In a modern high-bypass turbofan engine, what proportion of total propulsive thrust is generated by the cold bypass fan air?",
        a: ["Approximately 20%", "Approximately 50%", "Approximately 80%", "100%"],
        c: 2,
        explanation: "High-bypass turbofans (BPR 5:1 to 12:1+) generate roughly 80% of total thrust from cold bypass fan air and only 20% from hot core exhaust."
    },
    {
        q: "Why is the Assumed Temperature (Flex) takeoff method employed by commercial airline operators?",
        a: [
            "To artificially lower outside air density for heavier payloads",
            "To lower peak EGT, drastically reducing turbine blade thermal creep and extending engine life",
            "To reduce the takeoff runway distance required",
            "To ensure the ignition magnetos run on retarded timing"
        ],
        c: 1,
        explanation: "Operating at reduced thrust matching an assumed higher temperature drops peak EGT (e.g. 920°C to 830°C), exponentially slowing blade creep and saving overhaul costs."
    },
    {
        q: "How is a FADEC system powered during normal cruising flight?",
        a: [
            "Directly from the main aircraft AC bus via a transformer rectifier",
            "From the aircraft main ship battery",
            "By its own dedicated, engine-driven Permanent Magnet Alternator (PMA)",
            "From the APU generator"
        ],
        c: 2,
        explanation: "FADEC is self-powered by a dedicated PMA mounted on the engine gearbox once above ~10-15% N2, isolating it completely from aircraft electrical bus failures."
    },
    {
        q: "What happens if a dual-channel FADEC experiences a total, catastrophic failure of both channels?",
        a: [
            "The engine reverts to mechanical flyweight governor mode",
            "The engine automatically shuts down",
            "The thrust locks at the last commanded thrust setting indefinitely",
            "The pilot uses a mechanical push-pull manual cable"
        ],
        c: 1,
        explanation: "FADEC has no mechanical reversion; total dual-channel failure causes an automatic fail-safe engine shutdown to prevent catastrophic overspeed."
    },
    {
        q: "What is the difference between Detonation and Pre-Ignition in reciprocating aircraft engines?",
        a: [
            "Detonation is normal; pre-ignition is caused by low octane fuel",
            "Detonation is spontaneous explosion of unburnt end-gas; pre-ignition is ignition prior to timed spark by a hot spot",
            "Detonation only occurs at idle cutoff; pre-ignition occurs during cruise",
            "Detonation cools the cylinder; pre-ignition raises EGT"
        ],
        c: 1,
        explanation: "Detonation is the explosive auto-ignition of end-gas ahead of the flame front. Pre-ignition is premature ignition before spark by glowing carbon deposits or hot electrodes."
    }
];

const QuickQuiz: React.FC = () => {
    const [current, setCurrent] = useState<number>(0);
    const [score, setScore] = useState<number>(0);
    const [showResults, setShowResults] = useState<boolean>(false);
    const [answeredIdx, setAnsweredIdx] = useState<number | null>(null);

    const handleAnswer = (idx: number) => {
        if (answeredIdx !== null) return;
        setAnsweredIdx(idx);
        if (idx === questions[current].c) setScore((s) => s + 1);

        setTimeout(() => {
            if (current < questions.length - 1) {
                setCurrent((c) => c + 1);
                setAnsweredIdx(null);
            } else {
                setShowResults(true);
            }
        }, 2200);
    };

    const reset = () => {
        setCurrent(0);
        setScore(0);
        setShowResults(false);
        setAnsweredIdx(null);
    };

    if (showResults) {
        return (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center shadow-2xl">
                <ShieldAlert className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-3xl font-black text-white mb-2">Quiz Complete</h3>
                <p className="text-slate-400 text-lg mb-6">
                    You scored <span className="text-white font-bold">{score}</span> out of <span className="text-white font-bold">{questions.length}</span> ({Math.round((score / questions.length) * 100)}%)
                </p>
                <div className="max-w-md mx-auto text-xs text-slate-400 mb-6">
                    {score >= 7 ? 'Excellent mastery of ATPL 021 Powerplants principles!' : 'Review the Brayton Cycle, Divergent Ducts, and Blade Creep sections to solidify your understanding.'}
                </div>
                <button onClick={reset} className="px-6 py-3 bg-orange-600 font-bold text-white rounded-xl hover:bg-orange-500 shadow-lg">
                    Retry ATPL Quiz
                </button>
            </motion.div>
        );
    }

    const { q, a, c, explanation } = questions[current];

    return (
        <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-slate-900 border border-slate-800 p-6 md:p-10 rounded-2xl shadow-2xl space-y-6">
            <div className="flex justify-between items-center text-xs font-bold text-orange-500 uppercase tracking-widest">
                <span>Question {current + 1} of {questions.length}</span>
                <span className="text-slate-400">Score: {score}</span>
            </div>

            <h3 className="text-xl md:text-2xl font-bold text-white leading-relaxed">{q}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {a.map((ans, idx) => {
                    let borderCol = "border-slate-800 bg-slate-950/60 hover:border-slate-600 text-slate-300";
                    let icon = null;

                    if (answeredIdx !== null) {
                        if (idx === c) {
                            borderCol = "border-emerald-500 bg-emerald-950/40 text-white font-bold";
                            icon = <CheckCircle className="text-emerald-500 ml-auto h-5 w-5 shrink-0" />;
                        } else if (idx === answeredIdx) {
                            borderCol = "border-red-500 bg-red-950/40 text-white font-bold opacity-60";
                            icon = <XCircle className="text-red-500 ml-auto h-5 w-5 shrink-0" />;
                        } else {
                            borderCol = "border-slate-900 opacity-30 text-slate-500";
                        }
                    }

                    return (
                        <button
                            key={idx}
                            onClick={() => handleAnswer(idx)}
                            disabled={answeredIdx !== null}
                            className={`p-4 rounded-xl border-2 text-left text-sm transition-all flex items-center justify-between ${borderCol}`}
                        >
                            <span>{ans}</span>
                            {icon}
                        </button>
                    );
                })}
            </div>

            {answeredIdx !== null && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-slate-950 rounded-xl border border-white/5 text-xs text-slate-300">
                    <strong className="text-orange-400">ATPL Explanation: </strong>
                    {explanation}
                </motion.div>
            )}
        </motion.div>
    );
};

export default JetEnginePrinciples;
