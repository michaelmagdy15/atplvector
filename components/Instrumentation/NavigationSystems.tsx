import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Cpu, Activity, ShieldCheck, Info, Zap, Settings, Wifi, RefreshCw, Compass, ArrowRight } from 'lucide-react';

const NavigationSystems: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'ADC' | 'IRS' | 'FMS'>('ADC');

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="mb-10">
                <div className="flex items-center gap-2 text-xs font-bold text-violet-400 uppercase tracking-widest mb-2">
                    <span>AGK 022</span>
                    <span>•</span>
                    <span>Digital Avionics & Data Systems</span>
                </div>
                <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
                    <Database className="text-violet-400" />
                    Air Data Computers (ADC), IRS & Flight Management
                </h1>
                <p className="text-slate-400 max-w-3xl leading-relaxed text-sm">
                    From pneumatic capsule friction to multi-channel digital ARINC buses.
                    Explore the computing backbone of modern jet transports: the <strong className="text-white">Air Data Computer (ADC)</strong> speed chain,
                    <strong className="text-white">Ring Laser Gyro Strapdown IRS</strong>, and <strong className="text-white">Flight Management Systems (FMS)</strong>.
                </p>
            </div>

            {/* System Selector */}
            <div className="flex gap-3 mb-8 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800 w-fit">
                {(['ADC', 'IRS', 'FMS'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${
                            activeTab === tab
                                ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25'
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        {tab === 'ADC' ? 'Air Data Computer (ADC)' : tab === 'IRS' ? 'Inertial Reference (IRS)' : 'Flight Management (FMS)'}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visual Architecture */}
                <div className="lg:col-span-2">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden min-h-[500px]">
                        <AnimatePresence mode="wait">
                            {activeTab === 'ADC' && (
                                <motion.div
                                    key="adc"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.02 }}
                                    className="h-full flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex justify-between items-center mb-6">
                                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                                <Cpu className="text-blue-400" />
                                                ADC Architecture & Speed Derivation Pipeline
                                            </h2>
                                            <span className="text-[10px] font-mono text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded">
                                                ARINC 429 Dual Bus
                                            </span>
                                        </div>

                                        {/* Architecture Diagram */}
                                        <div className="grid grid-cols-3 gap-6 items-center my-6">
                                            {/* Sensor Inputs */}
                                            <div className="space-y-3">
                                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Raw Air Data Inputs</div>
                                                <div className="p-3 bg-slate-950 rounded-xl border border-blue-500/20 flex items-center gap-2.5">
                                                    <div className="w-2 h-8 bg-blue-400 rounded-full" />
                                                    <div>
                                                        <div className="text-xs font-bold text-white">Pitot Probes</div>
                                                        <div className="text-[10px] text-slate-500">Total Pressure (Pt)</div>
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-slate-950 rounded-xl border border-emerald-500/20 flex items-center gap-2.5">
                                                    <div className="w-2 h-8 bg-emerald-400 rounded-full" />
                                                    <div>
                                                        <div className="text-xs font-bold text-white">Static Ports</div>
                                                        <div className="text-[10px] text-slate-500">Static Pressure (Ps)</div>
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-slate-950 rounded-xl border border-orange-500/20 flex items-center gap-2.5">
                                                    <div className="w-2 h-8 bg-orange-400 rounded-full" />
                                                    <div>
                                                        <div className="text-xs font-bold text-white">TAT Probe</div>
                                                        <div className="text-[10px] text-slate-500">Total Air Temp (TAT)</div>
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-slate-950 rounded-xl border border-purple-500/20 flex items-center gap-2.5">
                                                    <div className="w-2 h-8 bg-purple-400 rounded-full" />
                                                    <div>
                                                        <div className="text-xs font-bold text-white">AoA Vane</div>
                                                        <div className="text-[10px] text-slate-500">Angle of Attack (&alpha;)</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Central Digital Processor */}
                                            <div className="bg-gradient-to-br from-violet-900/30 to-slate-950 p-5 rounded-2xl border-2 border-violet-500/40 text-center relative shadow-2xl">
                                                <Cpu className="text-violet-400 w-10 h-10 mx-auto mb-2 animate-pulse" />
                                                <div className="text-xs font-black text-white uppercase tracking-wider mb-2">ADC Internal Engine</div>
                                                <div className="space-y-1.5 text-[10px] font-mono text-slate-300 text-left bg-slate-950/80 p-2.5 rounded-lg border border-white/5">
                                                    <div className="text-blue-300">&bull; Position Error Lookup</div>
                                                    <div className="text-indigo-300">&bull; Compressibility Alg (EAS)</div>
                                                    <div className="text-orange-300">&bull; SAT: TAT / (1 + 0.2M&sup2;)</div>
                                                    <div className="text-emerald-300">&bull; Baro Corrected Alt</div>
                                                </div>
                                            </div>

                                            {/* Digital Bus Outputs */}
                                            <div className="space-y-2">
                                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Consumers via ARINC 429</div>
                                                {[
                                                    { name: 'PFD / EFIS', desc: 'Altitude, IAS, Mach, VSI' },
                                                    { name: 'Autopilot (AFCS)', desc: 'Altitude & Speed holds' },
                                                    { name: 'FMS / Performance', desc: 'TAS, SAT, Wind vector' },
                                                    { name: 'TCAS II', desc: 'Barometric Altitude' },
                                                    { name: 'GPWS / EGPWS', desc: 'Baro sink rate & altitude' }
                                                ].map((item) => (
                                                    <div key={item.name} className="p-2 bg-slate-950/80 rounded-lg border border-white/5 text-[10px]">
                                                        <strong className="text-white block">{item.name}</strong>
                                                        <span className="text-slate-500">{item.desc}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Speed Chain Sequence in ADC */}
                                    <div className="p-4 bg-slate-950/80 rounded-2xl border border-violet-500/20">
                                        <div className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-2">The Speed Calculation Chain:</div>
                                        <div className="flex items-center justify-between text-xs font-mono">
                                            <div className="text-center">
                                                <div className="text-slate-400">P<sub>t</sub> − P<sub>s</sub></div>
                                                <div className="text-white font-bold">IAS</div>
                                            </div>
                                            <ArrowRight size={14} className="text-slate-600" />
                                            <div className="text-center">
                                                <div className="text-slate-400">Position/Inst</div>
                                                <div className="text-blue-400 font-bold">CAS</div>
                                            </div>
                                            <ArrowRight size={14} className="text-slate-600" />
                                            <div className="text-center">
                                                <div className="text-slate-400">Compressibility</div>
                                                <div className="text-indigo-400 font-bold">EAS</div>
                                            </div>
                                            <ArrowRight size={14} className="text-slate-600" />
                                            <div className="text-center">
                                                <div className="text-slate-400">Density Ratio</div>
                                                <div className="text-orange-400 font-bold">TAS</div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'IRS' && (
                                <motion.div
                                    key="irs"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="h-full flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex justify-between items-center mb-6">
                                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                                <Activity className="text-emerald-400" />
                                                Strapdown Ring Laser Gyro (RLG) IRS
                                            </h2>
                                            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                                                ARINC 704
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-8 my-4">
                                            <div className="space-y-4">
                                                <div className="p-4 bg-slate-950 rounded-xl border border-white/5 space-y-2">
                                                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">Strapdown Triad Sensors</span>
                                                    <div className="grid grid-cols-2 gap-2 pt-1">
                                                        <div className="p-3 bg-slate-900 rounded-lg text-center border border-white/5">
                                                            <div className="text-lg font-black text-white font-mono">3x</div>
                                                            <div className="text-[10px] text-slate-400">Ring Laser Gyros</div>
                                                            <div className="text-[9px] text-emerald-400 mt-1">Sagnac Effect</div>
                                                        </div>
                                                        <div className="p-3 bg-slate-900 rounded-lg text-center border border-white/5">
                                                            <div className="text-lg font-black text-white font-mono">3x</div>
                                                            <div className="text-[10px] text-slate-400">Accelerometers</div>
                                                            <div className="text-[9px] text-blue-400 mt-1">Force-Feedback</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-4 bg-slate-950 rounded-xl border border-white/5 space-y-1 text-xs text-slate-300">
                                                    <strong className="text-white block text-xs">Double Integration Mathematics:</strong>
                                                    <div className="text-[11px] font-mono text-slate-400">
                                                        <div>1. Acceleration &rarr; Integrated once &rarr; <span className="text-emerald-400 font-bold">Velocity</span></div>
                                                        <div>2. Velocity &rarr; Integrated twice &rarr; <span className="text-sky-400 font-bold">Position (Lat/Long)</span></div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">IRS Alignment & Tuning</span>
                                                <p className="text-xs text-slate-400 leading-relaxed">
                                                    <strong className="text-white">Earth Rate Alignment:</strong> Requires 7 to 15 minutes stationary. Detects Earth's rotational speed (15°/hr &times; sin Lat) to find <strong>True North</strong> and verify present position latitude.
                                                </p>
                                                <p className="text-xs text-slate-400 leading-relaxed">
                                                    <strong className="text-white">Schuler Tuning (84.4-minute period):</strong> Models a hypothetical pendulum with radius equal to Earth's radius (R = 6,371 km). Dampens unbounded position drift from vehicle acceleration.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300">
                                        Unlike GNSS or VOR/DME, an IRS is 100% self-contained and immune to jamming, spoofing, or radio signal loss.
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'FMS' && (
                                <motion.div
                                    key="fms"
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    className="h-full flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex justify-between items-center mb-6">
                                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                                <Database className="text-indigo-400" />
                                                Flight Management System (FMS) Fusion Core
                                            </h2>
                                            <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                                                Navigation + Performance
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6 my-4">
                                            <div className="p-5 bg-slate-950 rounded-2xl border border-indigo-500/30 space-y-3">
                                                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Navigation Database (NDB)</h4>
                                                <p className="text-xs text-slate-400 leading-relaxed">
                                                    Updated on the <strong>28-day AIRAC cycle</strong>. Contains worldwide waypoints, airways, SIDs, STARs, approaches, and runway threshold data.
                                                </p>
                                                <div className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 p-2 rounded">
                                                    Position Updating Hierarchy: GPS &rarr; DME/DME &rarr; VOR/DME &rarr; IRS Only (Dead Reckoning)
                                                </div>
                                            </div>

                                            <div className="p-5 bg-slate-950 rounded-2xl border border-indigo-500/30 space-y-3">
                                                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Performance Database (PDB)</h4>
                                                <p className="text-xs text-slate-400 leading-relaxed">
                                                    Contains aerodynamic drag polar, engine fuel burn curves, optimum cruise altitudes, and step climb calculations based on the <strong>Cost Index (CI)</strong>.
                                                </p>
                                                <div className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 p-2 rounded">
                                                    Cost Index = Time Cost ($/hr) &divide; Fuel Cost (cents/lb). CI 0 = Max Range (Min Fuel).
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-3.5 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-xs text-indigo-300">
                                        FMS continuously combines IRS raw stability with GPS absolute accuracy to compute the "FMS Composite Position" with RNP precision.
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Sidebar Technical Notes */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow-xl">
                        <h4 className="text-white font-bold mb-4 flex items-center gap-2 text-xs uppercase tracking-wider">
                            <ShieldCheck className="w-4 h-4 text-violet-400" />
                            EASA 022 Exam Points
                        </h4>
                        <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
                            <div className="p-3 bg-slate-950 rounded-xl border border-white/5">
                                <strong className="text-white block mb-1">Total Temperature (TAT):</strong>
                                <span className="text-slate-400">
                                    TAT is always higher than Static Temperature (SAT) due to adiabatic compression heating (Ram Rise):
                                    <span className="text-orange-400 font-mono block mt-1">TAT = SAT &times; (1 + 0.2 &times; M&sup2;)</span>
                                </span>
                            </div>

                            <div className="p-3 bg-slate-950 rounded-xl border border-white/5">
                                <strong className="text-white block mb-1">IRS Schuler Tuning:</strong>
                                <span className="text-slate-400">
                                    The 84.4-minute Schuler oscillation prevents aircraft linear accelerations from being mistaken for tilts in the local vertical gravity vector.
                                </span>
                            </div>

                            <div className="p-3 bg-slate-950 rounded-xl border border-white/5">
                                <strong className="text-white block mb-1">ADC Redundancy:</strong>
                                <span className="text-slate-400">
                                    Transport category aircraft feature 2 or 3 independent ADCs. Discrepancies between ADC 1 and ADC 2 trigger "ALT DISAGREE" or "IAS DISAGREE" flags on the PFD.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavigationSystems;
