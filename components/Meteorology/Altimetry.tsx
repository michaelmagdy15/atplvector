import React, { useState } from 'react';
import { Cloud, ArrowUp, ArrowDown, Calculator, Info, AlertTriangle, Mountain, Ruler, Plane, Target, MousePointer2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Altimetry: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'basics' | 'fast-method' | 'pit-calc' | 'errors' | 'calculator'>('basics');

    // Calculator State
    const [qnh, setQnh] = useState(1013);
    const [elevation, setElevation] = useState(0);
    const [tempDev, setTempDev] = useState(0); // ISA Deviation

    // Fast Method State
    const [pressureDiff, setPressureDiff] = useState(0);

    // PIT Calculator State
    const [pitQnh, setPitQnh] = useState(1013);
    const [pitIndicatedAlt, setPitIndicatedAlt] = useState(10000);
    const [pitTempDev, setPitTempDev] = useState(0);

    // PIT Calculations
    const pressCorr = (pitQnh - 1013) * 30;
    const pressAlt = pitIndicatedAlt - pressCorr;
    const tempCorr = (pitIndicatedAlt / 1000) * 4 * pitTempDev;
    const trueAlt = pitIndicatedAlt + tempCorr;

    // Visualizer State
    const [visualMode, setVisualMode] = useState<'QNH' | 'QFE' | 'QNE'>('QNH');

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h2 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3">
                        <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
                            <Ruler className="text-emerald-400" size={32} />
                        </div>
                        Altimetry Master
                    </h2>
                    <p className="text-slate-400 mt-3 max-w-2xl text-lg font-light leading-relaxed">
                        Master the vertical dimension. Visualize pressure datums, density altitude, and critical instrument errors.
                    </p>
                </div>

                {/* Navigation Tabs */}
                <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md overflow-x-auto">
                    {[
                        { id: 'basics', label: 'Fundamentals', icon: Mountain },
                        { id: 'fast-method', label: 'The Fast Method', icon: ArrowUp },
                        { id: 'pit-calc', label: 'PIT Calculator', icon: Info },
                        { id: 'errors', label: 'Errors & Hazards', icon: AlertTriangle },
                        { id: 'calculator', label: 'FL Calculator', icon: Calculator },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === tab.id
                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {/* @ts-ignore */}
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </header>

            <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 p-1 overflow-hidden min-h-[600px] relative shadow-2xl">
                {/* Background Noise/Gradient */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/20 pointer-events-none"></div>

                <div className="relative z-10 p-6 md:p-8 h-full">
                    {/* --- BASICS TAB (Interactive Visualizer) --- */}
                    {activeTab === 'basics' && (
                        <div className="grid lg:grid-cols-2 gap-12 h-full">
                            <div className="space-y-6 flex flex-col justify-center">
                                <h3 className="text-2xl font-bold text-white mb-2">Pressure Definitions</h3>
                                <div className="space-y-4">
                                    {[
                                        {
                                            code: 'QNH',
                                            title: 'Altitude Above Mean Sea Level',
                                            desc: 'Altimeter reads ELEVATION when on ground. Reference is Mean Sea Level (MSL). Used for local flying.',
                                            color: 'border-emerald-500'
                                        },
                                        {
                                            code: 'QFE',
                                            title: 'Height Above Field Elevation',
                                            desc: 'Altimeter reads ZERO when on ground. Reference is the Aerodrome. Used for circuit work.',
                                            color: 'border-amber-500'
                                        },
                                        {
                                            code: 'QNE',
                                            title: 'Standard Pressure Setting',
                                            desc: '1013.25 hPa datum. Altimeter reads Flight Levels. Used above Transition Altitude.',
                                            color: 'border-blue-500'
                                        },
                                    ].map(item => (
                                        <button
                                            key={item.code}
                                            onClick={() => setVisualMode(item.code as any)}
                                            className={`w-full text-left p-6 rounded-2xl bg-slate-800/50 border-l-4 transition-all hover:bg-slate-800 group ${visualMode === item.code ? `${item.color} bg-slate-800 shadow-lg` : 'border-transparent opacity-60 hover:opacity-100'
                                                }`}
                                        >
                                            <div className="flex justify-between items-center mb-2">
                                                <span className={`text-2xl font-black tracking-tight ${visualMode === item.code ? 'text-white' : 'text-slate-400'}`}>{item.code}</span>
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{item.title}</span>
                                            </div>
                                            <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                                                {item.desc}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Interactive Diagram */}
                            <div className="bg-slate-950 rounded-3xl border border-slate-700/50 relative overflow-hidden flex flex-col">
                                <div className="absolute top-4 right-4 bg-slate-900/90 px-3 py-1 rounded-lg border border-white/10 text-xs font-mono text-emerald-400 z-20">
                                    VISUAL REFERENCE: {visualMode}
                                </div>

                                <div className="flex-1 relative">
                                    <svg className="w-full h-full" viewBox="0 0 400 300">
                                        <defs>
                                            <linearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#0f172a" />
                                                <stop offset="100%" stopColor="#1e293b" />
                                            </linearGradient>
                                            <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="0" refY="2" orient="auto">
                                                <polygon points="0 0, 6 2, 0 4" fill="#94a3b8" />
                                            </marker>
                                        </defs>

                                        {/* Sky */}
                                        <rect width="400" height="300" fill="url(#skyGradient)" />

                                        {/* Terrain */}
                                        <path d="M0 300 L100 300 L150 200 L250 200 L300 300 L400 300" fill="#334155" />

                                        {/* Sea Level Line (MSL) */}
                                        <line x1="0" y1="280" x2="400" y2="280" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="5 5" opacity="0.5" />
                                        <text x="10" y="275" fill="#0ea5e9" fontSize="10" fontWeight="bold">MSL</text>

                                        {/* 1013 Datum Line */}
                                        <motion.g animate={{ y: visualMode === 'QNE' ? 0 : 20 }}>
                                            <line x1="0" y1="250" x2="400" y2="250" stroke="#60a5fa" strokeWidth="1" strokeDasharray="2 2" opacity="0.3" />
                                            <text x="350" y="245" fill="#60a5fa" fontSize="9" opacity="0.5">1013 hPa</text>
                                        </motion.g>

                                        {/* Aerodrome */}
                                        <rect x="180" y="198" width="40" height="2" fill="#ef4444" />
                                        <text x="185" y="190" fill="#ef4444" fontSize="10" fontWeight="bold">AD Elev</text>

                                        {/* Aircraft */}
                                        <motion.g animate={{ y: -20 }}>
                                            <Plane size={24} x="188" y="80" className="text-yellow-400" fill="currentColor" />
                                            <line x1="200" y1="100" x2="200" y2="120" stroke="#facc15" strokeWidth="1" strokeDasharray="2 2" />
                                        </motion.g>

                                        {/* Indicators based on mode */}
                                        <AnimatePresence mode="wait">
                                            {visualMode === 'QNH' && (
                                                <motion.g key="qnh" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                                    {/* Bracket from MSL to Plane */}
                                                    <line x1="100" y1="280" x2="100" y2="100" stroke="#10b981" strokeWidth="2" />
                                                    <line x1="95" y1="280" x2="105" y2="280" stroke="#10b981" strokeWidth="2" /> {/* Bottom Tick */}
                                                    <line x1="95" y1="100" x2="180" y2="100" stroke="#10b981" strokeWidth="1" strokeDasharray="4 2" /> {/* Top Ref */}

                                                    <rect x="80" y="180" width="40" height="20" rx="4" fill="#064e3b" />
                                                    <text x="100" y="194" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="bold">ALTITUDE</text>
                                                </motion.g>
                                            )}

                                            {visualMode === 'QFE' && (
                                                <motion.g key="qfe" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                                    {/* Bracket from AD to Plane */}
                                                    <line x1="140" y1="200" x2="140" y2="100" stroke="#f59e0b" strokeWidth="2" />
                                                    <line x1="135" y1="200" x2="145" y2="200" stroke="#f59e0b" strokeWidth="2" />
                                                    <line x1="135" y1="100" x2="180" y2="100" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 2" />

                                                    <rect x="120" y="140" width="40" height="20" rx="4" fill="#78350f" />
                                                    <text x="140" y="154" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">HEIGHT</text>
                                                </motion.g>
                                            )}

                                            {visualMode === 'QNE' && (
                                                <motion.g key="qne" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                                    {/* Bracket from 1013 to Plane */}
                                                    <line x1="300" y1="250" x2="300" y2="100" stroke="#3b82f6" strokeWidth="2" />
                                                    <line x1="295" y1="250" x2="305" y2="250" stroke="#3b82f6" strokeWidth="2" />
                                                    <line x1="220" y1="100" x2="305" y2="100" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 2" />

                                                    <rect x="280" y="160" width="40" height="20" rx="4" fill="#1e3a8a" />
                                                    <text x="300" y="174" textAnchor="middle" fill="#60a5fa" fontSize="10" fontWeight="bold">FLIGHT LEVEL</text>
                                                </motion.g>
                                            )}
                                        </AnimatePresence>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- FAST METHOD TAB --- */}
                    {activeTab === 'fast-method' && (
                        <div className="max-w-4xl mx-auto space-y-8">
                            <div className="bg-slate-800/50 p-8 rounded-3xl border border-emerald-500/20 shadow-lg">
                                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                    <ArrowUp className="text-emerald-400" />
                                    The "Gaps" Technical Method
                                </h3>

                                <div className="grid md:grid-cols-2 gap-12">
                                    <div className="space-y-6">
                                        <div className="bg-slate-900 p-6 rounded-2xl border-l-4 border-emerald-500">
                                            <p className="text-lg text-emerald-100 font-medium italic">"High to Low, Watch out Below"</p>
                                            <p className="text-sm text-slate-400 mt-2">If you fly from High Pressure to Low Pressure without adjusting subscale, your True Altitude is LOWER than indicated.</p>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-sm font-bold text-slate-400">Pressure Difference Simulation</label>
                                            <div className="bg-slate-900 rounded-xl p-4 flex items-center gap-4">
                                                <input
                                                    type="range" min="-50" max="50"
                                                    value={pressureDiff}
                                                    onChange={(e) => setPressureDiff(parseInt(e.target.value))}
                                                    className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                                />
                                                <div className="w-16 text-right font-mono text-emerald-400 font-bold text-lg">
                                                    {pressureDiff > 0 ? '+' : ''}{pressureDiff} hPa
                                                </div>
                                            </div>
                                            <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
                                                <span>Low Pressure</span>
                                                <span>High Pressure</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden h-[300px] flex items-center justify-center">
                                        {/* Visual Simulation of Plane vs Ground */}
                                        <div className="absolute inset-x-0 bottom-0 h-16 bg-slate-800 border-t border-slate-600"></div> {/* Ground */}

                                        {/* True Altitude Ghost */}
                                        <motion.div
                                            className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center opacity-50"
                                            initial={{ bottom: '50%' }}
                                            animate={{ bottom: '50%' }}
                                        >
                                            <Plane className="text-slate-500 rotate-0" size={32} />
                                            <div className="text-xs text-slate-500 mt-1">Indicated: 10,000'</div>
                                        </motion.div>

                                        {/* Actual Plane Position */}
                                        <motion.div
                                            className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center"
                                            initial={{ bottom: '50%' }}
                                            animate={{ bottom: `${50 + (pressureDiff * 0.8)}%` }}
                                            transition={{ type: "spring", stiffness: 100 }}
                                        >
                                            <Plane className={`${(10000 + pressureDiff * 30) < 10000 ? 'text-red-400' : 'text-emerald-400'} rotate-0 drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]`} size={40} fill="currentColor" />
                                            <div className={`text-sm font-bold mt-1 px-3 py-1 rounded-full bg-slate-900 ${(10000 + pressureDiff * 30) < 10000 ? 'text-red-400' : 'text-emerald-400'}`}>
                                                True: {10000 + (pressureDiff * 30)}'
                                            </div>
                                        </motion.div>

                                        {/* Warning Overlay */}
                                        {(10000 + pressureDiff * 30) < 9000 && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="absolute top-4 bg-red-500/20 text-red-400 px-4 py-2 rounded-lg border border-red-500/50 flex items-center gap-2 font-bold"
                                            >
                                                <AlertTriangle size={16} /> TERRAIN WARNING
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- PIT CALCULATOR TAB --- */}
                    {activeTab === 'pit-calc' && (
                        <div className="max-w-4xl mx-auto space-y-12">
                            <div className="flex flex-col md:flex-row gap-8">
                                {/* Inputs Panel */}
                                <div className="md:w-1/3 space-y-6">
                                    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                                        <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Input Parameters</h4>

                                        <div className="space-y-6">
                                            <div>
                                                <label className="text-sm text-white font-semibold mb-2 block">QNH (hPa)</label>
                                                <input type="number" value={pitQnh} onChange={e => setPitQnh(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white font-mono focus:border-blue-500 outline-none" />
                                            </div>
                                            <div>
                                                <label className="text-sm text-white font-semibold mb-2 block">Indicated Alt (ft)</label>
                                                <input type="number" value={pitIndicatedAlt} onChange={e => setPitIndicatedAlt(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white font-mono focus:border-purple-500 outline-none" />
                                            </div>
                                            <div>
                                                <label className="text-sm text-white font-semibold mb-2 block">ISA Deviation (°C)</label>
                                                <input type="number" value={pitTempDev} onChange={e => setPitTempDev(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white font-mono focus:border-emerald-500 outline-none" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Visualization Flow */}
                                <div className="md:w-2/3 flex flex-col justify-center relative">
                                    <div className="flex items-center justify-between relative z-10">
                                        {/* P Node */}
                                        <div className="flex flex-col items-center gap-4 group">
                                            <div className="w-20 h-20 rounded-2xl bg-blue-500/20 border border-blue-500/50 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                                                <span className="text-3xl font-black text-blue-400">P</span>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Pressure Alt</div>
                                                <div className="font-mono text-white text-lg">{Math.round(pressAlt)}'</div>
                                            </div>
                                        </div>

                                        {/* Arrow 1 */}
                                        <div className="flex-1 h-[2px] bg-slate-700 relative mx-4">
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 px-2 py-1 border border-slate-700 rounded text-[10px] text-slate-400">
                                                {pressCorr > 0 ? '+' : ''}{Math.round(pressCorr)}'
                                            </div>
                                        </div>

                                        {/* I Node */}
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-24 h-24 rounded-2xl bg-purple-500/20 border border-purple-500/50 flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.3)] scale-110">
                                                <span className="text-4xl font-black text-purple-400">I</span>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Indicated</div>
                                                <div className="font-mono text-white text-xl font-bold">{Math.round(pitIndicatedAlt)}'</div>
                                            </div>
                                        </div>

                                        {/* Arrow 2 */}
                                        <div className="flex-1 h-[2px] bg-slate-700 relative mx-4">
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 px-2 py-1 border border-slate-700 rounded text-[10px] text-slate-400">
                                                {tempCorr > 0 ? '+' : ''}{Math.round(tempCorr)}'
                                            </div>
                                        </div>

                                        {/* T Node */}
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-20 h-20 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                                                <span className="text-3xl font-black text-emerald-400">T</span>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">True Alt</div>
                                                <div className="font-mono text-white text-lg">{Math.round(trueAlt)}'</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- ERRORS TAB --- */}
                    {activeTab === 'errors' && (
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-slate-800/50 p-8 rounded-3xl border border-white/5">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <AlertTriangle className="text-orange-400" /> Temperature Error
                                </h3>
                                <p className="text-slate-400 leading-relaxed mb-6">
                                    "Hot to Cold, Watch out Below." When flying into colder than ISA air, your altimeter overreads. The column of air shrinks, bringing 10,000' indicated closer to the ground.
                                </p>
                                <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                                    <div className="flex justify-between items-center text-sm mb-2">
                                        <span className="text-slate-400">Formula approximation:</span>
                                    </div>
                                    <code className="text-orange-300 font-mono text-sm block">
                                        4ft per 1,000ft per 1°C Dev
                                    </code>
                                </div>
                            </div>
                            <div className="bg-slate-800/50 p-8 rounded-3xl border border-white/5">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <Mountain className="text-slate-400" /> Orographic Error
                                </h3>
                                <p className="text-slate-400 leading-relaxed">
                                    Wind flowing over a mountain ridge accelerates (Bernoulli), causing local pressure to drop. This can result in the altimeter overreading significantly, putting you dangerously close to the ridge.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* --- FLIGHT LEVEL CALCULATOR (Simple utility) --- */}
                    {activeTab === 'calculator' && (
                        <div className="max-w-xl mx-auto bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-xl">
                            <h3 className="text-xl font-bold text-white mb-6">Transition Layer Calc</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-slate-400">Local QNH</label>
                                    <input type="number" value={qnh} onChange={e => setQnh(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white" />
                                </div>
                                <div>
                                    <label className="text-sm text-slate-400">Transition Altitude</label>
                                    <input type="number" defaultValue={5000} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white" />
                                </div>
                                <div className="pt-4 border-t border-slate-700 mt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-300">Lowest Usable FL:</span>
                                        <span className="text-2xl font-bold text-emerald-400 font-mono">FL060</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Based on standard separation rules.</p>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Altimetry;
