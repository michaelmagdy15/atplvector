import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Battery, Cpu, Power, Activity, ArrowRight, AlertTriangle, RefreshCw, Layers } from 'lucide-react';

const ElectricsSystem: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'ac' | 'dc' | 'dist'>('ac');

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <Zap className="text-yellow-400 fill-yellow-400/20" />
                        Electrical Systems
                    </h1>
                    <p className="text-slate-400 mt-2 max-w-2xl">
                        Master the flow of electrons. From Constant Speed Drives (CSD) and Main Generators to Essential Busses and Emergency Power.
                    </p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 bg-slate-900/50 p-1 rounded-xl w-fit border border-slate-800">
                {[
                    { id: 'ac', label: 'AC Generation', icon: RefreshCw },
                    { id: 'dc', label: 'DC & Batteries', icon: Battery },
                    { id: 'dist', label: 'Distribution & Busbars', icon: Layers },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
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
                {activeTab === 'ac' && <ACGeneration key="ac" />}
                {activeTab === 'dc' && <DCGeneration key="dc" />}
                {activeTab === 'dist' && <DistributionSystem key="dist" />}
            </AnimatePresence>
        </div>
    );
};

const ACGeneration = () => {
    const [rpm, setRpm] = useState(6000);
    const [poles, setPoles] = useState(4);

    // Formula: f = (N * P) / 120  (where N is RPM, P is poles)
    // Wait, standard formula: f = (RPM * Poles/2) / 60 = (RPM * Poles) / 120
    const frequency = (rpm * poles) / 120;

    const [csdActive, setCsdActive] = useState(true);
    // CSD Output mimics stable RPM despite Engine RPM changes
    const csdOutput = csdActive ? 400 : (frequency > 400 ? frequency : frequency); // Simplified logic for viz
    const stableFreq = csdActive ? 400 : frequency;

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Activity className="text-blue-400" />
                            Alternator Principles
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <label className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                    <span>Engine RPM (N)</span>
                                    <span className="text-white">{rpm} RPM</span>
                                </label>
                                <input
                                    type="range" min="3000" max="12000" step="100"
                                    value={rpm}
                                    onChange={(e) => setRpm(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                            </div>

                            <div className="flex items-center justify-between bg-slate-800/50 p-4 rounded-xl">
                                <span className="text-sm font-bold text-slate-300">Constant Speed Drive (CSD)</span>
                                <button
                                    onClick={() => setCsdActive(!csdActive)}
                                    className={`px-3 py-1 rounded-full text-xs font-black uppercase transition-colors ${csdActive ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-700 text-slate-400'
                                        }`}
                                >
                                    {csdActive ? 'ENGAGED' : 'DISCONNECT'}
                                </button>
                            </div>

                            <div className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-slate-500 text-xs font-bold uppercase">Frequency Output</span>
                                    <span className={`font-mono font-bold ${Math.abs(stableFreq - 400) < 5 ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {Math.round(stableFreq)} Hz
                                    </span>
                                </div>
                                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                    <motion.div
                                        className={`h-full ${Math.abs(stableFreq - 400) < 5 ? 'bg-emerald-500' : 'bg-red-500'}`}
                                        animate={{ width: `${Math.min((stableFreq / 800) * 100, 100)}%` }}
                                    />
                                </div>
                                <p className="text-[10px] text-slate-500 pt-2">
                                    Target: 400Hz (Aircraft Standard). Modern jets use IDGs (Integrated Drive Generators) which combine the CSD and Generator in one housing.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-900/10 border border-blue-500/20 p-6 rounded-2xl">
                        <h4 className="flex items-center gap-2 text-blue-400 font-bold mb-3 text-sm uppercase">
                            <RefreshCw size={16} /> Key Concepts
                        </h4>
                        <ul className="space-y-2 text-xs text-slate-300">
                            <li>• <strong>Frequency Formula:</strong> f = (N × P) / 120. Where N=RPM, P=Poles.</li>
                            <li>• <strong>Real Load (KW):</strong> Does the work. Dependent on Torque.</li>
                            <li>• <strong>Reactive Load (KVAR):</strong> Creating magnetic fields. Dependent on Excitation.</li>
                            <li>• <strong>Parallel Ops:</strong> Voltage must be same. Frequency must be same. Phase sequence must be same. Phase angle must be synched.</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

                    <div className="relative z-10 flex flex-col items-center gap-8">
                        {/* CSD & Generator Viz */}
                        <div className="flex items-center gap-1">
                            <div className="flex flex-col items-center">
                                <motion.div
                                    animate={{ rotate: rpm / 10 }} // Visual spin based on Engine RPM
                                    className="w-16 h-16 rounded-full border-4 border-slate-600 border-dashed mb-2"
                                />
                                <span className="text-[10px] font-black uppercase text-slate-500">Engine Shaft</span>
                            </div>

                            <ArrowRight className="text-slate-600" />

                            {/* CSD Unit */}
                            <div className={`w-24 h-16 rounded-lg flex items-center justify-center border-2 transition-colors ${csdActive ? 'bg-emerald-900/20 border-emerald-500/50' : 'bg-slate-800 border-slate-600'}`}>
                                <span className="text-xs font-bold text-slate-300">CSD</span>
                            </div>

                            <ArrowRight className={`${csdActive ? 'text-emerald-500' : 'text-slate-600'}`} />

                            {/* Generator */}
                            <div className="flex flex-col items-center relative">
                                <motion.div
                                    animate={{ rotate: stableFreq }}
                                    className="w-20 h-20 rounded-full border-4 border-blue-500 border-t-transparent shadow-xl shadow-blue-500/20 mb-2 relative flex items-center justify-center bg-slate-950"
                                >
                                    <Zap className="text-blue-400" />
                                </motion.div>
                                <span className="text-[10px] font-black uppercase text-blue-400">IDG / GEN</span>
                            </div>
                        </div>

                        {/* Frequency Wave Viz */}
                        <div className="w-full h-32 bg-slate-950 rounded-xl border border-slate-800 relative overflow-hidden flex items-center">
                            <svg className="w-full h-full" preserveAspectRatio="none">
                                <motion.path
                                    d={`M 0 64 Q 25 10, 50 64 T 100 64 T 150 64 T 200 64 T 250 64 T 300 64`}
                                    fill="none"
                                    stroke={Math.abs(stableFreq - 400) < 5 ? "#10b981" : "#ef4444"} // Green if 400Hz, else Red
                                    strokeWidth="3"
                                    initial={{ pathLength: 0, pathOffset: 0 }}
                                    animate={{ pathOffset: -1 }}
                                    transition={{ repeat: Infinity, duration: 1000 / stableFreq, ease: "linear" }}
                                // Note: Simple visual approximation
                                />
                                {/* Static Sine Wave for visual effect */}
                                <path d="M0,64 C50,10 50,118 100,64 C150,10 150,118 200,64 C250,10 250,118 300,64" stroke="currentColor" className="text-white/5" fill="none" />
                            </svg>

                            <div className="absolute bottom-2 right-2 text-xs font-mono text-slate-500">
                                SCOPE: {stableFreq.toFixed(0)} Hz
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const DCGeneration = () => {
    // Battery Config
    const [config, setConfig] = useState<'series' | 'parallel'>('series');

    // Battery Specs (Single Cell)
    const volts = 12;
    const capacity = 50; // Ah

    const outputVolts = config === 'series' ? volts * 2 : volts;
    const outputCap = config === 'series' ? capacity : capacity * 2;

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Battery className="text-yellow-400" />
                            Battery Configuration
                        </h3>

                        <div className="bg-slate-800/50 p-1 rounded-lg flex mb-8">
                            <button
                                onClick={() => setConfig('series')}
                                className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${config === 'series' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                            >
                                Series (Voltage ↑)
                            </button>
                            <button
                                onClick={() => setConfig('parallel')}
                                className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${config === 'parallel' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                            >
                                Parallel (Capacity ↑)
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-950 rounded-xl border border-slate-700 text-center">
                                <div className="text-[10px] text-slate-500 font-black uppercase mb-1">Output Voltage</div>
                                <div className={`text-2xl font-black ${config === 'series' ? 'text-yellow-400' : 'text-slate-300'}`}>
                                    {outputVolts}V
                                </div>
                            </div>
                            <div className="p-4 bg-slate-950 rounded-xl border border-slate-700 text-center">
                                <div className="text-[10px] text-slate-500 font-black uppercase mb-1">Capacity</div>
                                <div className={`text-2xl font-black ${config === 'parallel' ? 'text-yellow-400' : 'text-slate-300'}`}>
                                    {outputCap} Ah
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                        <h4 className="font-bold text-white mb-4">Battery Types</h4>
                        <div className="space-y-3">
                            <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-sm text-slate-200">Lead Acid</span>
                                    <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded text-white">Legacy</span>
                                </div>
                                <p className="text-xs text-slate-400">Electrolyte: Sulphuric Acid. Checks: SG via Hydrometer (1.270 fully charged).</p>
                            </div>
                            <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-sm text-slate-200">NiCad / Li-ion</span>
                                    <span className="text-[10px] bg-sky-600 px-2 py-0.5 rounded text-white">Modern</span>
                                </div>
                                <p className="text-xs text-slate-400">Electrolyte: Potassium Hydroxide. Risks: Thermal Runaway. Keep clean and cool.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Visualizer */}
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl flex items-center justify-center relative min-h-[400px]">
                    <div className="flex flex-col items-center gap-8 w-full max-w-sm">

                        {/* Battery 1 */}
                        <div className="w-32 h-20 bg-slate-800 border-4 border-slate-600 rounded-lg relative flex items-center justify-center">
                            <div className="absolute -top-3 left-4 w-4 h-3 bg-slate-500 rounded-t-sm"></div>
                            <div className="absolute -top-3 right-4 w-4 h-3 bg-slate-500 rounded-t-sm"></div>
                            <span className="font-black text-slate-500 text-xl">12V</span>
                            <span className="absolute bottom-1 right-2 text-[10px] font-mono text-slate-600">50Ah</span>
                        </div>

                        {/* Connection Lines */}
                        <div className="w-full relative h-16">
                            {config === 'series' ? (
                                // Series Connection Viz
                                <svg className="absolute inset-0 w-full h-full stroke-yellow-500 stroke-[4]" fill="none">
                                    <path d="M 96 0 L 96 64" /> {/* Positive of B1 to Negative of B2 - simplified */}
                                    <path d="M 224 0 L 224 64" strokeOpacity={0.0} />
                                    {/* Visual simplified: Series involves creating a chain */}
                                    <line x1="160" y1="0" x2="160" y2="64" stroke="currentColor" strokeDasharray="4 4" />
                                </svg>
                            ) : (
                                // Parallel Connection Viz
                                <svg className="absolute inset-0 w-full h-full stroke-blue-500 stroke-[4]" fill="none">
                                    <path d="M 80 0 L 80 64" />
                                    <path d="M 240 0 L 240 64" />
                                    <line x1="80" y1="32" x2="240" y2="32" />
                                </svg>
                            )}
                        </div>

                        {/* Battery 2 */}
                        <div className="w-32 h-20 bg-slate-800 border-4 border-slate-600 rounded-lg relative flex items-center justify-center">
                            <div className="absolute -top-3 left-4 w-4 h-3 bg-slate-500 rounded-t-sm"></div>
                            <div className="absolute -top-3 right-4 w-4 h-3 bg-slate-500 rounded-t-sm"></div>
                            <span className="font-black text-slate-500 text-xl">12V</span>
                            <span className="absolute bottom-1 right-2 text-[10px] font-mono text-slate-600">50Ah</span>
                        </div>

                        <div className="mt-8 p-4 bg-slate-950 rounded-xl border border-white/10 w-full text-center">
                            <div className="text-xs font-bold text-slate-500 uppercase mb-2">Total Output</div>
                            <div className="flex justify-center gap-8">
                                <div><span className="block text-2xl font-black text-white">{outputVolts}V</span><span className="text-[10px] text-slate-500">Voltage</span></div>
                                <div><span className="block text-2xl font-black text-white">{outputCap}Ah</span><span className="text-[10px] text-slate-500">Amp Hours</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const DistributionSystem = () => {
    // Simplified Bus Logic
    // Sources: GEN 1, GEN 2, APU, EXT PWR
    // Buses: MAIN AC, MAIN DC, ESS AC, ESS DC, BATT BUS

    // Interactive switches
    const [gen1, setGen1] = useState(true);
    const [gen2, setGen2] = useState(true);
    const [apu, setApu] = useState(false);

    // Bus Logic
    const mainAC = gen1 || gen2 || apu;
    const essAC = mainAC; // In normal ops, Main feeds Essential (simplified)
    const tr1 = mainAC; // TRU powered by AC
    const mainDC = tr1;
    const essDC = mainDC;

    const onBattery = !mainAC; // If AC lost, on Battery

    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 overflow-x-auto">
                <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                    <Layers className="text-purple-400" />
                    Busbar Logic (Split System)
                </h3>

                {/* Overhead Panel Controls */}
                <div className="flex gap-4 mb-12 justify-center">
                    <ControlSwitch label="GEN 1" active={gen1} onClick={() => setGen1(!gen1)} />
                    <ControlSwitch label="APU GEN" active={apu} onClick={() => setApu(!apu)} color="bg-amber-500" />
                    <ControlSwitch label="GEN 2" active={gen2} onClick={() => setGen2(!gen2)} />
                </div>

                {/* Schematic */}
                <div className="relative min-w-[800px] min-h-[400px] flex flex-col items-center gap-12">

                    {/* AC BUS LAYOUT */}
                    <div className="flex justify-between w-full px-20">
                        <BusBar label="AC BUS 1" powered={gen1 || (apu && !gen2)} width="w-48" />
                        <BusBar label="AC ESS BUS" powered={essAC} width="w-48" color={essAC ? 'bg-red-500' : 'bg-slate-800'} />
                        <BusBar label="AC BUS 2" powered={gen2 || (apu && !gen1)} width="w-48" />
                    </div>

                    {/* TRUs */}
                    <div className="flex justify-between w-full px-32 relative">
                        {/* Wiring AC to TRU */}
                        <div className={`absolute top-[-48px] left-[100px] w-1 h-12 ${mainAC ? 'bg-yellow-400' : 'bg-slate-700'}`}></div>
                        <div className={`absolute top-[-48px] right-[100px] w-1 h-12 ${mainAC ? 'bg-yellow-400' : 'bg-slate-700'}`}></div>

                        <TRU label="TRU 1" active={gen1 || apu} />
                        <TRU label="TRU 2" active={gen2 || apu} />
                    </div>

                    {/* DC BUS LAYOUT */}
                    <div className="flex justify-between w-full px-20">
                        <BusBar label="DC BUS 1" powered={gen1 || apu} width="w-48" color="bg-blue-600" />
                        <BusBar label="DC ESS BUS" powered={essDC || onBattery} width="w-48" color={essDC ? 'bg-blue-600' : (onBattery ? 'bg-orange-500' : 'bg-slate-800')} />
                        <BusBar label="DC BUS 2" powered={gen2 || apu} width="w-48" color="bg-blue-600" />
                    </div>

                    {/* Battery & Emergency */}
                    {onBattery && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            className="absolute bottom-0 text-center bg-orange-500/10 border border-orange-500 p-4 rounded-xl"
                        >
                            <div className="flex items-center gap-2 justify-center text-orange-500 font-bold uppercase mb-1">
                                <AlertTriangle size={18} />
                                Emergency Power
                            </div>
                            <p className="text-xs text-orange-200">
                                Essential Buses powered by BATTERY. (Limited Time: ~30-60m)
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

const ControlSwitch = ({ label, active, onClick, color = 'bg-emerald-500' }: any) => (
    <div className="flex flex-col items-center gap-2">
        <button
            onClick={onClick}
            className={`w-16 h-10 rounded border-2 transition-all shadow-lg ${active
                    ? `${color} border-white/20 shadow-${color.replace('bg-', '')}/40 translate-y-0.5`
                    : 'bg-slate-800 border-slate-600 hover:border-slate-500'
                }`}
        >
            <div className={`w-full h-1/2 ${active ? 'bg-black/10' : 'bg-transparent'}`}></div>
        </button>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
);

const BusBar = ({ label, powered, width = 'w-32', color = 'bg-yellow-500' }: any) => (
    <div className={`flex flex-col items-center transition-all duration-500 ${powered ? 'opacity-100' : 'opacity-40 grayscale'}`}>
        <div className={`${width} h-4 ${powered ? color : 'bg-slate-700'} rounded-sm mb-2 shadow-lg shadow-current`}></div>
        <span className="text-[10px] font-black text-slate-500 uppercase">{label}</span>
        {powered && <span className="text-[8px] text-emerald-400 font-bold">POWERED</span>}
    </div>
);

const TRU = ({ label, active }: any) => (
    <div className={`w-16 h-12 border-2 ${active ? 'border-blue-400 bg-blue-900/20' : 'border-slate-600 bg-slate-800'} rounded flex items-center justify-center`}>
        <div className="text-center">
            <div className="text-[8px] text-slate-400 font-bold">{label}</div>
            <div className="flex justify-center text-[8px] text-slate-500">~ ~ =</div>
        </div>
    </div>
);

export default ElectricsSystem;
