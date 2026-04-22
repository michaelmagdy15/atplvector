import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Flame, Wind, Gauge, Activity, Cpu, ShieldAlert, Zap, Target, Thermometer, RotateCw, AlertTriangle, ArrowRight, CheckCircle, XCircle } from 'lucide-react';

const JetEnginePrinciples: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'brayton' | 'types' | 'compressor' | 'combustion' | 'performance' | 'systems' | 'quiz'>('brayton');

    const tabs = [
        { id: 'brayton', label: 'Brayton Cycle', icon: Activity },
        { id: 'types', label: 'Engine Types', icon: Target },
        { id: 'compressor', label: 'Comp & Turbine', icon: Wind },
        { id: 'combustion', label: 'Combustion', icon: Flame },
        { id: 'performance', label: 'Performance', icon: Gauge },
        { id: 'systems', label: 'Systems', icon: Cpu },
        { id: 'quiz', label: 'Quick Quiz', icon: ShieldAlert },
    ];

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <Flame className="text-orange-500 animate-pulse" />
                        Jet & Gas Turbine Engines
                    </h1>
                    <p className="text-slate-400 mt-2 max-w-2xl">
                        Master the Brayton cycle, engine architectures, components, and performance characteristics in modern jet engines.
                    </p>
                </div>
            </div>

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

            <AnimatePresence mode="wait">
                {activeTab === 'brayton' && <BraytonCycle key="brayton" />}
                {activeTab === 'types' && <EngineTypes key="types" />}
                {activeTab === 'compressor' && <CompressorTurbine key="compressor" />}
                {activeTab === 'combustion' && <CombustionChamber key="combustion" />}
                {activeTab === 'performance' && <EnginePerformance key="performance" />}
                {activeTab === 'systems' && <EngineSystems key="systems" />}
                {activeTab === 'quiz' && <QuickQuiz key="quiz" />}
            </AnimatePresence>
        </div>
    );
};

// --- TAB COMPONENT: BRAYTON CYCLE ---
const pvData = [
    { v: 10, p: 1, c: '1. Intake' },
    { v: 2, p: 25, c: '2. Compression' },
    { v: 4, p: 25, c: '3. Combustion' },
    { v: 9, p: 2, c: '4. Expansion' },
];

const BraytonCycle = () => {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl flex flex-col items-center min-h-[400px] overflow-hidden">
                    <h3 className="text-xl font-bold text-white mb-6 w-full flex gap-2"><Activity className="text-orange-400"/> Continuous Gas Flow</h3>
                    
                    <div className="relative w-full h-48 bg-slate-800/50 rounded-full border-4 border-slate-600 overflow-hidden flex items-center shadow-inner">
                        {/* Stream flow particles */}
                        <motion.div 
                            className="absolute inset-0 flex"
                            animate={{ x: [-100, 100] }}
                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        >
                            {Array.from({ length: 20 }).map((_, i) => (
                                <div key={i} className="h-full w-2 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent mx-4" />
                            ))}
                        </motion.div>
                        
                        {/* Sections */}
                        <div className="flex w-full h-full relative z-10 opacity-80 mix-blend-screen font-black text-white/50 text-xs items-center">
                            <div className="flex-1 h-full bg-blue-900 flex justify-center items-center">INTAKE</div>
                            <div className="flex-[2] h-full bg-blue-500 flex justify-center items-center text-center">COMPRESSOR<br/>P↑ T↑ V↓</div>
                            <div className="flex-1 h-full bg-orange-600 flex justify-center items-center text-center text-white/90">COMBUSTOR<br/>P= T↑↑ V↑</div>
                            <div className="flex-1 h-full bg-red-600 flex justify-center items-center text-center">TURBINE<br/>P↓ T↓ V↑</div>
                            <div className="flex-1 h-full bg-slate-400 flex justify-center items-center text-center">NOZZLE<br/>Vel↑</div>
                        </div>
                    </div>
                    
                    <div className="mt-8 bg-slate-800 p-4 rounded-xl text-slate-300 text-sm">
                        <strong className="text-white">Note:</strong> Unlike the intermittent Otto cycle (Piston), the Brayton cycle happens <strong>continuously</strong> and <strong>simultaneously</strong> throughout the engine.
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-6">P-V Ideal Diagram</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={pvData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="v" type="number" name="Volume" stroke="#94a3b8" label={{ value: "Volume", position: "insideBottomRight", offset: -5, fill: '#94a3b8' }} />
                                <YAxis stroke="#94a3b8" label={{ value: "Pressure", angle: -90, position: "insideLeft", fill: '#94a3b8' }} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                                <Line type="linear" dataKey="p" stroke="#f97316" strokeWidth={3} dot={{ r: 6, fill: '#f97316' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="bg-slate-800 p-3 rounded-lg border border-white/5">
                            <div className="text-[10px] text-slate-400 uppercase">Thermal Efficiency</div>
                            <div className="text-sm text-white font-mono mt-1">η = 1 - (T₁ / T₂)</div>
                        </div>
                        <div className="bg-slate-800 p-3 rounded-lg border border-white/5">
                            <div className="text-[10px] text-slate-400 uppercase">Constant Pressure</div>
                            <div className="text-sm text-white mt-1">Combustion occurs at approx constant pressure</div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// --- TAB COMPONENT: ENGINE TYPES ---
const EngineTypes = () => {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Turbojet */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h4 className="text-lg font-bold text-white mb-2 text-red-400">Turbojet</h4>
                    <p className="text-xs text-slate-400 mb-4 h-8">All air goes through the core. High exhaust velocity, noisy, low efficiency at low speeds. (Fighters, Concorde)</p>
                    <div className="w-full h-32 bg-slate-800 rounded-xl relative overflow-hidden flex flex-col justify-center border-l-4 border-red-500">
                         <div className="h-12 bg-red-900/40 w-full flex items-center justify-center font-black text-red-500 uppercase tracking-widest text-xs">Core Flow Only</div>
                    </div>
                    <div className="text-[10px] uppercase font-bold text-slate-500 mt-4 text-center">BPR = 0 : 1</div>
                </div>

                {/* Turbofan (High Bypass) */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h4 className="text-lg font-bold text-white mb-2 text-sky-400">Turbofan (High Bypass)</h4>
                    <p className="text-xs text-slate-400 mb-4 h-8">Large fan driven by core turbine. Most thrust from fan. Highly efficient, quieter. (Modern Airliners)</p>
                    <div className="w-full h-32 rounded-xl relative overflow-hidden flex flex-col border-l-4 border-sky-500">
                        <div className="h-10 bg-sky-900/30 w-full flex items-center justify-center text-[10px] text-sky-500 font-bold border-b border-sky-800/50">Cold Bypass Flow (~80% Thrust)</div>
                        <div className="h-12 bg-red-900/40 w-full flex items-center justify-center text-[10px] text-red-500 font-bold">Hot Core Flow</div>
                        <div className="h-10 bg-sky-900/30 w-full flex items-center justify-center text-[10px] text-sky-500 font-bold border-t border-sky-800/50">Cold Bypass Flow</div>
                    </div>
                    <div className="text-[10px] uppercase font-bold text-slate-500 mt-4 text-center">BPR = 5:1 up to 12:1</div>
                </div>

                {/* Turboprop */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h4 className="text-lg font-bold text-white mb-2 text-emerald-400">Turboprop</h4>
                    <p className="text-xs text-slate-400 mb-4 h-8">Core drives a reduction gearbox and propeller. Extreme efficiency at low speeds (sub-Mach 0.6). (Regional Dash-8, ATR)</p>
                    <div className="w-full h-32 bg-slate-800 rounded-xl relative overflow-hidden flex items-center pl-4 border-l-4 border-emerald-500">
                         <div className="w-4 h-24 bg-slate-400 animate-spin-slow origin-center rounded-sm mr-4" style={{ animationDuration: '0.5s'}}></div>
                         <div className="flex-1 h-12 bg-red-900/40 flex items-center justify-center text-[10px] text-red-500 font-bold">Turbine driving prop</div>
                    </div>
                </div>

                {/* Turboshaft */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h4 className="text-lg font-bold text-white mb-2 text-purple-400">Turboshaft</h4>
                    <p className="text-xs text-slate-400 mb-4 h-8">100% of expansion energy used to drive a shaft (no jet pipe thrust). (Helicopters, APUs)</p>
                    <div className="w-full h-32 bg-slate-800 rounded-xl relative overflow-hidden flex flex-col justify-center items-center border-l-4 border-purple-500">
                        <div className="w-24 h-4 bg-slate-400 animate-spin-slow origin-center rounded-sm absolute top-4 shadow-lg shadow-black" style={{ animationDuration: '0.2s'}}></div>
                        <div className="w-full h-12 bg-red-900/40 mt-8 flex items-center justify-center text-[10px] text-red-500 font-bold">Free Power Turbine</div>
                    </div>
                </div>

            </div>
            
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex gap-4 items-center">
                <div className="bg-slate-800 p-4 rounded-xl font-mono text-center shrink-0">
                    <div className="text-orange-400 font-bold">BPR</div>
                    <div className="text-slate-400 text-xs mt-1">=</div>
                    <div className="text-sky-300 text-sm mt-1 border-b border-slate-600 pb-1">Cold Mass Flow</div>
                    <div className="text-red-400 text-sm pt-1">Hot Mass Flow</div>
                </div>
                <p className="text-sm text-slate-300">
                    Bypass Ratio (BPR) dictates efficiency. Higher BPR means accelerating a <strong>large mass of air by a small amount</strong> ($F = m\Delta v$). This yields better propulsive efficiency and vastly less noise than accelerating a small mass of air by a large amount (Turbojet).
                </p>
            </div>
        </motion.div>
    );
};

// --- TAB COMPONENT: COMPRESSOR & TURBINE ---
const surgeData = [
    { rpm: 'Low', pr: 1, surge: 1.5, chk: 1.2 },
    { rpm: 'Med', pr: 2, surge: 3.0, chk: 2.5 },
    { rpm: 'High', pr: 4, surge: 5.5, chk: 4.5 },
];

const CompressorTurbine = () => {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-6">Compressor Types</h3>
                    
                    <div className="space-y-6">
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                            <h4 className="text-blue-400 font-bold mb-2 flex items-center gap-2">Axial Flow <ArrowRight size={16}/></h4>
                            <p className="text-xs text-slate-300 mb-2">Air flows straight through alternating rows of rotating (Rotors) and stationary (Stators) blades. High mass flow, high total pressure ratio across many stages. Delicate.</p>
                            <div className="flex bg-slate-900 h-8 rounded overflow-hidden">
                                <div className="flex-1 border-r border-slate-800 flex items-center justify-center text-[10px] text-blue-300 animate-pulse bg-blue-900/20">Rotor (Kinetic E↑)</div>
                                <div className="flex-1 flex items-center justify-center text-[10px] text-blue-500 bg-slate-800">Stator (Pressure E↑)</div>
                            </div>
                        </div>

                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                            <h4 className="text-orange-400 font-bold mb-2 flex items-center gap-2">Centrifugal Flow <RotateCw size={16}/></h4>
                            <p className="text-xs text-slate-300 mb-2">Impeller flings air outwards into a diffuser. Robust, simple, but has a large frontal area. Max pressure ratio ~10:1 per stage.</p>
                            <div className="flex bg-slate-900 h-8 rounded overflow-hidden">
                                <div className="flex-1 border-r border-slate-800 flex items-center justify-center text-[10px] text-orange-300 animate-pulse bg-orange-900/20">Impeller</div>
                                <div className="flex-1 flex items-center justify-center text-[10px] text-orange-500 bg-slate-800">Diffuser</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                        <h3 className="text-xl font-bold text-red-500 mb-4 flex gap-2"><AlertTriangle/> Compressor Stall & Surge</h3>
                        <p className="text-sm text-slate-300 mb-4">
                            Compressor blades are aerofoils. If Angle of Attack (AoA) is too high, they <strong>stall</strong>. Total airflow breakdown creates a violent violent flow reversal: a <strong>Surge</strong>.
                        </p>
                        <div className="h-48 w-full">
                           <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={surgeData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155"/>
                                    <XAxis dataKey="rpm" stroke="#94a3b8"/>
                                    <YAxis stroke="#94a3b8" label={{ value: "Pressure Ratio", angle: -90, position: 'insideLeft', fill: '#94a3b8' }}/>
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#fff' }} />
                                    <Line type="monotone" dataKey="surge" name="Surge Line" stroke="#ef4444" strokeWidth={3} strokeDasharray="5 5" />
                                    <Line type="monotone" dataKey="chk" name="Operating Line" stroke="#10b981" strokeWidth={3} />
                                </LineChart>
                           </ResponsiveContainer>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2 text-center">Keep Operating Line safely below Surge Line.</p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center">
                <h3 className="text-lg font-bold text-white mb-2">Spools (N1, N2, N3)</h3>
                <p className="text-sm text-slate-400 mb-4">Turbines drive compressors via concentric shafts. The <strong>High Pressure Turbine (HPT)</strong> drives the <strong>High Pressure Compressor (HPC)</strong> (N2 spool). The LPT drives the Fan/LPC (N1 spool).</p>
                <div className="inline-flex items-center justify-center p-4 bg-slate-950 rounded-xl border border-slate-800">
                     <div className="h-2 w-16 bg-blue-500 rounded-l-full"></div>
                     <div className="h-6 w-32 bg-slate-700 mx-2 text-xs flex items-center justify-center font-bold text-slate-300">Outer Shaft (N2)</div>
                     <div className="h-2 w-16 bg-red-500"></div>
                </div>
                <div className="inline-flex items-center justify-center p-4 bg-slate-950 rounded-xl border border-slate-800 ml-4 relative -top-6">
                     <div className="h-2 w-24 bg-sky-400 rounded-l-full"></div>
                     <div className="h-4 w-40 bg-slate-600 mx-2 text-[10px] flex items-center justify-center font-bold text-slate-300">Inner Shaft (N1)</div>
                     <div className="h-2 w-24 bg-orange-400 rounded-r-full"></div>
                </div>
            </div>
        </motion.div>
    );
};

// --- TAB COMPONENT: COMBUSTION CHAMBER ---
const relightData = [
    { airspeed: 100, alt: 10000 },
    { airspeed: 150, alt: 25000 },
    { airspeed: 250, alt: 35000 },
    { airspeed: 350, alt: 35000 },
    { airspeed: 450, alt: 25000 },
];

const CombustionChamber = () => {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                        <h3 className="text-xl font-bold text-white mb-6">Combustor Designs</h3>
                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                            <div className="bg-slate-800 p-4 rounded-xl border-t-4 border-slate-600">
                                <div className="font-bold text-white mb-2">Multiple-Can</div>
                                <div className="text-slate-400 text-[10px]">Individual cans. Robust, easy to maintain. High pressure loss, heavy.</div>
                            </div>
                            <div className="bg-slate-800 p-4 rounded-xl border-t-4 border-slate-500">
                                <div className="font-bold text-white mb-2">Can-Annular</div>
                                <div className="text-slate-400 text-[10px]">Individual flame tubes in a common casing. Good mix of structural strength and flow.</div>
                            </div>
                            <div className="bg-slate-800 p-4 rounded-xl border-t-4 border-orange-500">
                                <div className="font-bold text-white mb-2">Annular</div>
                                <div className="text-slate-400 text-[10px]">Single continuous ring. Best flow, lowest surface area, light. Hard to maintain.</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                        <h3 className="text-xl font-bold text-white mb-4">Combustor Zones & Airflow</h3>
                        <p className="text-sm text-slate-400 mb-4">To prevent blowing the flame out, compressor air is slowed and split into streams:</p>
                        <div className="w-full flex h-16 rounded-xl overflow-hidden font-bold text-[10px] text-center">
                            <div className="flex flex-col flex-1 bg-red-900/50 justify-center text-red-300 border-r border-black">Primary Zone (20%)<br/>Stoichiometric Burn</div>
                            <div className="flex flex-col flex-1 bg-orange-900/50 justify-center text-orange-300 border-r border-black">Secondary (20%)<br/>Completes Burn</div>
                            <div className="flex flex-col flex-[2] bg-blue-900/50 justify-center text-blue-300">Tertiary / Dilution (60%)<br/>Cools gases for Turbine</div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-4">In-Flight Relight Envelope</h3>
                    <p className="text-xs text-slate-300 mb-4">
                        If a flameout occurs, relighting requires specific altitude and airspeed conditions (to ensure sufficient core rotation and airflow density).
                    </p>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={relightData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="airspeed" type="number" domain={[0, 500]} name="Airspeed (kts)" stroke="#94a3b8" />
                                <YAxis type="number" stroke="#94a3b8" label={{ value: "Altitude (ft)", angle: -90, position: "insideLeft", fill: '#94a3b8' }}/>
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#fff' }} />
                                <Line type="step" dataKey="alt" stroke="#f59e0b" strokeWidth={3} fill="#f59e0b" fillOpacity={0.2} name="Envelope Limit" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-[10px] text-orange-400 mt-2 text-center">Area under the curve defines valid relight parameters.</p>
                </div>
            </div>
        </motion.div>
    );
};

// --- TAB COMPONENT: PERFORMANCE ---
const sfcData = [
    { temp: 15, alt: 0, sfc: 0.6 },
    { temp: -5, alt: 10000, sfc: 0.55 },
    { temp: -25, alt: 20000, sfc: 0.5 },
    { temp: -45, alt: 30000, sfc: 0.45 },
    { temp: -56.5, alt: 36000, sfc: 0.42 }, // Tropopause
    { temp: -56.5, alt: 45000, sfc: 0.42 },
];

const EnginePerformance = () => {
    const [massFlow, setMassFlow] = useState(100);
    const [jetVel, setJetVel] = useState(500);
    const tas = 250; 
    
    // F = m(vj - vo)
    const thrust = Math.max(0, massFlow * (jetVel - tas));

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-4 flex gap-2"><Gauge/> Momentum Thrust</h3>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6 text-center font-mono text-lg text-emerald-400">
                        F = ṁ(V<sub className="text-[10px]">j</sub> - V<sub className="text-[10px]">0</sub>)
                    </div>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                <span>Mass Flow (ṁ)</span>
                                <span className="text-white">{massFlow} kg/s</span>
                            </label>
                            <input type="range" min="20" max="800" value={massFlow} onChange={(e) => setMassFlow(Number(e.target.value))} className="w-full accent-sky-500" />
                        </div>
                        <div>
                            <label className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                <span>Jet Velocity (Vj)</span>
                                <span className="text-white">{jetVel} m/s</span>
                            </label>
                            <input type="range" min="300" max="1000" value={jetVel} onChange={(e) => setJetVel(Number(e.target.value))} className="w-full accent-red-500" />
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-800 flex justify-between items-end">
                        <div className="text-xs text-slate-500 uppercase">Input TAS: {tas} m/s</div>
                        <div className="text-right">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Net Thrust Produced</div>
                            <div className="text-3xl font-black text-white">{thrust.toLocaleString()}<span className="text-sm text-slate-500 ml-1">N</span></div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                    <h3 className="text-md font-bold text-white mb-2">Flat Rating</h3>
                    <p className="text-sm text-slate-400">
                        Modern engines cap maximum thrust to protect physical limitations (internal pressure) at low temperatures. As OAT rises above a threshold (often ISA+15), thrust drops due to temperature limits (EGT/TGT).
                    </p>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-4">Specific Fuel Consumption (SFC)</h3>
                <p className="text-xs text-slate-300 mb-6">
                    SFC is fuel flow per unit of thrust. Lower = better. Notice SFC improves (drops) as we climb until the tropopause (~36,000ft), where temperature stops falling.
                </p>
                
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={sfcData} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <YAxis dataKey="alt" type="number" stroke="#94a3b8" label={{ value: "Altitude (ft)", angle: -90, position: "insideLeft", fill: '#94a3b8' }}/>
                            <XAxis type="number" domain={[0.3, 0.7]} stroke="#94a3b8" label={{ value: "SFC (kg/hr/kgf)", position: "bottom", fill: '#94a3b8' }}/>
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#fff' }} formatter={(val) => [val, 'SFC']} labelFormatter={(l) => `${l} ft`} />
                            <Line type="monotone" dataKey="sfc" stroke="#10b981" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </motion.div>
    );
};

// --- TAB COMPONENT: SYSTEMS ---
const EngineSystems = () => {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Cpu className="text-cyan-400"/> FADEC</h3>
                    <p className="text-sm text-slate-300 mb-4">
                        Full Authority Digital Engine Control. <strong>Absolutely no mechanical linkage</strong> from thrust lever to engine fuel valve. Dual channels (A/B) for redundancy. Automatically handles start seq, limits, and idle speed.
                    </p>
                    <div className="p-3 bg-red-950/30 border border-red-900/50 rounded-lg">
                        <div className="text-xs text-red-400 font-bold flex items-center gap-1 mb-1"><ShieldAlert size={14}/> Failure Consequence</div>
                        <div className="text-[10px] text-slate-400">Total FADEC failure results in complete engine shutdown. No manual reversion exists.</div>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Activity className="text-yellow-600"/> START SEQUENCE</h3>
                    <div className="space-y-4">
                        <div className="flex gap-4 items-center">
                            <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 font-black flex items-center justify-center shrink-0">1</div>
                            <div className="text-xs text-slate-300"><strong>Starter engages</strong>: N2 spool rotates and purges engine.</div>
                        </div>
                        <div className="flex gap-4 items-center">
                            <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 font-black flex items-center justify-center shrink-0">2</div>
                            <div className="text-xs text-slate-300"><strong>Ignition ON</strong>: Igniters spark.</div>
                        </div>
                        <div className="flex gap-4 items-center">
                            <div className="w-8 h-8 rounded-full bg-slate-800 border-[1px] border-orange-500 text-orange-400 font-black flex items-center justify-center shrink-0">3</div>
                            <div className="text-xs text-slate-300"><strong>Fuel ON</strong> (at ~20% N2): "Light Off" occurs. EGT sharply rises.</div>
                        </div>
                        <div className="flex gap-4 items-center">
                            <div className="w-8 h-8 rounded-full bg-slate-800 bg-emerald-900/30 text-emerald-400 font-black flex items-center justify-center shrink-0">4</div>
                            <div className="text-xs text-slate-300">Starter cuts out (~50% N2), engine accelerates to Idle.</div>
                        </div>
                    </div>
                </div>

            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
                 <h3 className="text-lg font-bold text-white mb-4">Fire Detection continuous loop</h3>
                 <div className="flex justify-center mb-4">
                     <div className="w-64 h-32 border-4 rounded-3xl relative border-slate-700 bg-slate-950 flex shadow-[inset_0_0_20px_rgba(239,68,68,0)]">
                         <div className="absolute inset-0 border-4 border-red-500 rounded-3xl animate-pulse opacity-50 m-2"></div>
                         <div className="w-full flex items-center justify-center text-red-500 font-bold"><Flame className="animate-bounce mr-2"/> FIRE WIRE</div>
                     </div>
                 </div>
                 <p className="text-xs text-slate-400 max-w-md mx-auto">
                     A coaxial cable. Heat melts internal insulation, bridging center wire and casing, triggering alarm. Engine shutdown pulls arms the extinguisher bottle squibs.
                 </p>
            </div>
        </motion.div>
    );
};

// --- TAB COMPONENT: QUIZ ---
const questions = [
    { q: "In a Brayton Cycle, when does combustion occur?", a: ["Constant Volume", "Constant Pressure", "Isothermal Expansion", "Constant Temperature"], c: 1 },
    { q: "Which engine type has a Bypass Ratio of zero?", a: ["Turbofan", "Turboprop", "Turbojet", "Turboshaft"], c: 2 },
    { q: "What prevents a compressor stall?", a: ["Increasing fuel flow rapidly", "Keeping operating line far below surge line", "Deploying thrust reversers", "Closing bleed valves"], c: 1 },
    { q: "What drives the High Pressure Compressor (HPC)?", a: ["Fan", "Low Pressure Turbine (LPT)", "Gearbox", "High Pressure Turbine (HPT)"], c: 3 },
    { q: "At what point in the climb does SFC stop improving?", a: ["10,000 ft", "Tropopause", "FL250", "It never stops"], c: 1 },
    { q: "If FADEC completely fails, what happens?", a: ["Engine reverts to hydro-mechanical mode", "Engine runs rough", "Engine shuts down", "Thrust locks at current setting"], c: 2 }
];

const QuickQuiz = () => {
    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [answeredIdx, setAnsweredIdx] = useState<number | null>(null);

    const handleAnswer = (idx: number) => {
        if (answeredIdx !== null) return;
        setAnsweredIdx(idx);
        if (idx === questions[current].c) setScore(s => s + 1);

        setTimeout(() => {
            if (current < questions.length - 1) {
                setCurrent(c => c + 1);
                setAnsweredIdx(null);
            } else {
                setShowResults(true);
            }
        }, 1500);
    };

    const reset = () => {
        setCurrent(0); setScore(0); setShowResults(false); setAnsweredIdx(null);
    }

    if (showResults) {
        return (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center">
                <ShieldAlert className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-3xl font-black text-white mb-2">Quiz Complete</h3>
                <p className="text-slate-400 text-lg mb-6">You scored {score} out of {questions.length}</p>
                <button onClick={reset} className="px-6 py-3 bg-orange-600 font-bold text-white rounded-lg hover:bg-orange-500">Retry Quiz</button>
            </motion.div>
        )
    }

    const { q, a, c } = questions[current];

    return (
        <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-slate-900 border border-slate-800 p-6 md:p-12 rounded-2xl">
            <div className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-4">Question {current + 1} of {questions.length}</div>
            <h3 className="text-2xl font-bold text-white mb-8">{q}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {a.map((ans, idx) => {
                    let borderCol = "border-slate-700 hover:border-slate-500 bg-slate-800/50";
                    let icon = null;
                    if (answeredIdx !== null) {
                        if (idx === c) {
                            borderCol = "border-emerald-500 bg-emerald-900/30 text-white";
                            icon = <CheckCircle className="text-emerald-500 ml-auto h-5 w-5" />;
                        } else if (idx === answeredIdx) {
                            borderCol = "border-red-500 bg-red-900/30 text-white opacity-50";
                            icon = <XCircle className="text-red-500 ml-auto h-5 w-5" />;
                        } else {
                            borderCol = "border-slate-800 opacity-30";
                        }
                    }

                    return (
                        <button
                            key={idx}
                            onClick={() => handleAnswer(idx)}
                            className={`p-4 rounded-xl border-2 text-left font-bold transition-all text-slate-300 flex items-center ${borderCol}`}
                        >
                            {ans}
                            {icon}
                        </button>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default JetEnginePrinciples;
