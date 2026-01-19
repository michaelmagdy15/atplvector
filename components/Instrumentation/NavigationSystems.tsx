import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Cpu, Activity, ShieldCheck, Info, Zap, Settings, Wifi, RefreshCw } from 'lucide-react';

const NavigationSystems: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'ADC' | 'IRS' | 'FMS'>('ADC');

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="mb-12">
                <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
                    <Database className="text-violet-400" />
                    Advanced Navigation Systems
                </h1>
                <p className="text-slate-400 max-w-2xl">
                    From analogue probes to digital logic. Explore the backbone of modern avionics: Air Data Computers, Inertial Reference, and Flight Management Systems.
                </p>
            </div>

            {/* System Selector */}
            <div className="flex gap-4 mb-8 bg-slate-900/50 p-2 rounded-2xl border border-slate-800 w-fit">
                {(['ADC', 'IRS', 'FMS'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === tab
                            ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/20'
                            : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        {tab === 'ADC' ? 'Air Data Computer' : tab === 'IRS' ? 'Inertial Reference' : 'Flight Management'}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visual Architecture */}
                <div className="lg:col-span-2">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden min-h-[500px]">
                        <AnimatePresence mode="wait">
                            {activeTab === 'ADC' && (
                                <motion.div
                                    key="adc"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    className="h-full flex flex-col"
                                >
                                    <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                                        <Cpu className="text-blue-400" />
                                        ADC Signal Flow
                                    </h2>

                                    <div className="flex flex-1 items-center justify-between px-12 relative">
                                        {/* Inputs */}
                                        <div className="space-y-8 z-10">
                                            <div className="p-4 bg-slate-800 rounded-xl border border-white/5 flex items-center gap-3">
                                                <div className="w-2 h-12 bg-blue-400 rounded-full"></div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase">Pitot (Total)</div>
                                            </div>
                                            <div className="p-4 bg-slate-800 rounded-xl border border-white/5 flex items-center gap-3">
                                                <div className="w-2 h-12 bg-emerald-400 rounded-full"></div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase">Static Port</div>
                                            </div>
                                            <div className="p-4 bg-slate-800 rounded-xl border border-white/5 flex items-center gap-3">
                                                <div className="w-2 h-12 bg-orange-400 rounded-full"></div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase">TAT Probe</div>
                                            </div>
                                        </div>

                                        {/* Processor */}
                                        <div className="w-48 h-48 bg-violet-600/20 rounded-3xl border-2 border-violet-500/50 flex flex-col items-center justify-center relative shadow-2xl shadow-violet-500/10">
                                            <Cpu className="text-violet-400 w-12 h-12 mb-2 animate-pulse" />
                                            <div className="text-xs font-black text-white uppercase">Compute Unit</div>
                                            <div className="absolute inset-0 border border-white/10 rounded-3xl animate-ping opacity-20"></div>
                                        </div>

                                        {/* Outputs */}
                                        <div className="space-y-4 z-10">
                                            {['ALT', 'IAS/TAS', 'Mach', 'VSI', 'SAT'].map((label) => (
                                                <div key={label} className="px-4 py-2 bg-slate-950 rounded-lg border border-white/5 text-[8px] font-black text-slate-300 uppercase tracking-widest transition-all hover:bg-violet-500 hover:text-white cursor-help">
                                                    {label} Data Bus
                                                </div>
                                            ))}
                                        </div>

                                        {/* Connection Lines */}
                                        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                                            <line x1="200" y1="120" x2="350" y2="250" stroke="#8b5cf6" strokeWidth="2" />
                                            <line x1="200" y1="250" x2="350" y2="250" stroke="#8b5cf6" strokeWidth="2" />
                                            <line x1="200" y1="380" x2="350" y2="250" stroke="#8b5cf6" strokeWidth="2" />
                                            <line x1="550" y1="250" x2="700" y2="150" stroke="#8b5cf6" strokeWidth="2" />
                                            <line x1="550" y1="250" x2="700" y2="350" stroke="#8b5cf6" strokeWidth="2" />
                                        </svg>
                                    </div>

                                    <div className="mt-8 p-4 bg-blue-500/10 border-l-4 border-blue-500 rounded-r-xl">
                                        <p className="text-xs text-slate-400 italic">"ADCs convert pneumatic and temperature signals into digital ARINC 429 data, reducing probe error and lag."</p>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'IRS' && (
                                <motion.div
                                    key="irs"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="h-full flex flex-col"
                                >
                                    <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                                        <Activity className="text-emerald-400" />
                                        Strapdown IRS Logic
                                    </h2>

                                    <div className="grid grid-cols-2 gap-12 flex-1">
                                        <div className="space-y-6">
                                            <div className="p-6 bg-slate-800/50 rounded-2xl border border-white/5">
                                                <h4 className="text-[10px] font-black text-slate-500 uppercase mb-4">Sensors</h4>
                                                <div className="flex gap-4">
                                                    <div className="flex-1 p-4 bg-slate-950 rounded-xl border border-emerald-500/20 flex flex-col items-center">
                                                        <RefreshCw className="text-emerald-500 mb-2" size={20} />
                                                        <span className="text-[8px] font-bold text-white uppercase">3x Laser Gyros</span>
                                                    </div>
                                                    <div className="flex-1 p-4 bg-slate-950 rounded-xl border border-blue-500/20 flex flex-col items-center">
                                                        <Zap className="text-blue-500 mb-2" size={20} />
                                                        <span className="text-[8px] font-bold text-white uppercase">3x Accels</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-6 bg-slate-800/50 rounded-2xl border border-white/5">
                                                <h4 className="text-[10px] font-black text-slate-500 uppercase mb-2">Integration</h4>
                                                <div className="text-[10px] text-slate-400 font-mono space-y-2">
                                                    <div className="flex justify-between"><span>Accels</span> <span>→ Velocity</span></div>
                                                    <div className="flex justify-between"><span>Velocity</span> <span>→ Position</span></div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-slate-950 rounded-3xl border border-white/10 p-8 flex flex-col items-center justify-center text-center">
                                            <ShieldCheck size={48} className="text-emerald-500 mb-4 opacity-50" />
                                            <h3 className="text-white font-bold mb-2">Self-Contained</h3>
                                            <p className="text-xs text-slate-500 max-w-[200px]">Doesn't need external satellites or stations. Just needs 10-15 mins of alignment at start of flight.</p>
                                            <div className="mt-6 flex gap-2">
                                                <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[8px] font-black rounded border border-emerald-500/20">SCHULER TUNING</span>
                                                <span className="px-2 py-1 bg-blue-500/10 text-blue-500 text-[8px] font-black rounded border border-blue-500/20">ARINC 704</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'FMS' && (
                                <motion.div
                                    key="fms"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="h-full flex flex-col"
                                >
                                    <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                                        <Database className="text-indigo-400" />
                                        FMS Performance Cloud
                                    </h2>

                                    <div className="flex-1 flex items-center justify-center">
                                        <div className="relative w-full max-w-lg">
                                            {/* FMS Core */}
                                            <div className="w-full aspect-video bg-gradient-to-br from-indigo-900/40 to-slate-900 border-2 border-indigo-500/30 rounded-[40px] shadow-2xl relative flex items-center justify-center overflow-hidden">
                                                <div className="p-12 text-center">
                                                    <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">Nav Database + Perf Data</div>
                                                    <div className="text-4xl font-black text-white italic tracking-tighter">OPTIMIZED FLOW</div>
                                                    <div className="mt-4 flex gap-4 justify-center">
                                                        <div className="text-[8px] font-bold text-slate-500 border border-white/5 px-2 py-1 rounded">V-SPEEDS</div>
                                                        <div className="text-[8px] font-bold text-slate-500 border border-white/5 px-2 py-1 rounded">STEP CLIMBS</div>
                                                        <div className="text-[8px] font-bold text-slate-500 border border-white/5 px-2 py-1 rounded">COST INDEX</div>
                                                    </div>
                                                </div>

                                                {/* Floating Data Icons */}
                                                <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute top-8 left-12"><Wifi className="text-indigo-500/40" /></motion.div>
                                                <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 3, delay: 1 }} className="absolute bottom-12 right-12"><Activity className="text-indigo-500/40" /></motion.div>
                                            </div>

                                            {/* External Inputs */}
                                            <div className="absolute -top-12 -left-12 p-4 bg-slate-900 border border-white/5 rounded-2xl shadow-xl flex items-center gap-3">
                                                <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center"><Cpu size={20} className="text-indigo-400" /></div>
                                                <div>
                                                    <div className="text-[8px] font-black text-slate-500 uppercase">Input</div>
                                                    <div className="text-xs font-bold text-white">IRS / GPS</div>
                                                </div>
                                            </div>
                                            <div className="absolute -bottom-12 -right-12 p-4 bg-slate-900 border border-white/5 rounded-2xl shadow-xl flex items-center gap-3">
                                                <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center"><Activity size={20} className="text-indigo-400" /></div>
                                                <div>
                                                    <div className="text-[8px] font-black text-slate-500 uppercase">Input</div>
                                                    <div className="text-xs font-bold text-white">ADC / Engine</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Sidebar Specs/Notes */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                        <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                            <Settings className="w-4 h-4 text-violet-400" />
                            System Truths
                        </h4>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-4"
                            >
                                {activeTab === 'ADC' && (
                                    <ul className="text-xs text-slate-400 space-y-3">
                                        <li className="flex gap-2">
                                            <div className="w-1 h-1 bg-violet-500 rounded-full mt-1.5 shrink-0"></div>
                                            <span><strong>Advantage:</strong> Eliminates position and instrument errors via software.</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <div className="w-1 h-1 bg-violet-500 rounded-full mt-1.5 shrink-0"></div>
                                            <span><strong>Redundancy:</strong> Dual or Triple ADCs compare data. Failure triggers flags.</span>
                                        </li>
                                    </ul>
                                )}
                                {activeTab === 'IRS' && (
                                    <ul className="text-xs text-slate-400 space-y-3">
                                        <li className="flex gap-2">
                                            <div className="w-1 h-1 bg-emerald-500 rounded-full mt-1.5 shrink-0"></div>
                                            <span><strong>Alignment:</strong> Needs 10-15 mins at high latitudes. Aircraft must be stationary.</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <div className="w-1 h-1 bg-emerald-500 rounded-full mt-1.5 shrink-0"></div>
                                            <span><strong>RLG Advantage:</strong> No moving parts, faster start-up, less power.</span>
                                        </li>
                                    </ul>
                                )}
                                {activeTab === 'FMS' && (
                                    <ul className="text-xs text-slate-400 space-y-3">
                                        <li className="flex gap-2">
                                            <div className="w-1 h-1 bg-indigo-500 rounded-full mt-1.5 shrink-0"></div>
                                            <span><strong>Composite Fix:</strong> Merges IRS, GPS, VOR/DME for the best position.</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <div className="w-1 h-1 bg-indigo-500 rounded-full mt-1.5 shrink-0"></div>
                                            <span><strong>Cost Index:</strong> Ratio of time-based cost vs fuel cost. CI 0 = Max Range.</span>
                                        </li>
                                    </ul>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-white/5 p-6 rounded-2xl">
                        <h4 className="text-white font-bold mb-2 flex items-center gap-2 text-sm uppercase">
                            <Info size={16} className="text-violet-400" />
                            Exam Concept
                        </h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed italic">
                            "Modern flight decks don't just show data; they manage it. The <strong>EFIS</strong> (Electronic Flight Instrument System) gathers info from all these computers to build a unified cockpit picture."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavigationSystems;
