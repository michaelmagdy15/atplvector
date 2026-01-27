import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Flame, Wind, Radio, Info, ShieldAlert, ArrowDown, Activity, Zap } from 'lucide-react';

const SpecialHazards: React.FC = () => {
    const [hazard, setHazard] = useState<'VOLCANIC_ASH' | 'MICROBURST' | 'SPACE_WEATHER'>('VOLCANIC_ASH');

    return (
        <div className="space-y-8 p-4 md:p-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-black text-white flex items-center gap-3">
                        <AlertTriangle className="text-red-500" />
                        Special Hazards
                    </h2>
                    <p className="text-slate-400 text-sm">Aviation-specific risks: Volcanic ash, microbursts, and cosmic radiation.</p>
                </div>

                <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-slate-800">
                    <TabButton active={hazard === 'VOLCANIC_ASH'} onClick={() => setHazard('VOLCANIC_ASH')} label="Volcanic Ash" icon={<Flame size={14} />} />
                    <TabButton active={hazard === 'MICROBURST'} onClick={() => setHazard('MICROBURST')} label="Microburst" icon={<Wind size={14} />} />
                    <TabButton active={hazard === 'SPACE_WEATHER'} onClick={() => setHazard('SPACE_WEATHER')} label="Space Weather" icon={<Zap size={14} />} />
                </div>
            </div>

            <AnimatePresence mode="wait">
                {hazard === 'VOLCANIC_ASH' && (
                    <motion.div
                        key="ash"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-12"
                    >
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden flex flex-col">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <ShieldAlert className="text-orange-500" />
                                Operational Impacts
                            </h3>
                            <div className="space-y-4 flex-grow">
                                <ImpactCard title="Engine Flameout" desc="Silicates melt in turbine section and solidify on blades/nozzles, choking the engine." />
                                <ImpactCard title="St. Elmo's Fire" desc="Static discharge on windscreen/nose due to high-speed particle friction." />
                                <ImpactCard title="Pitot Static Blockage" desc="Fine glass-like ash clogs sensors, leading to unreliable instrument readings." />
                                <ImpactCard title="Abrasion" desc="Severe 'sandblasting' of windscreens and leading edges reduces visibility significantly." />
                            </div>
                            <div className="mt-8 bg-black/40 p-4 rounded-xl border border-white/5">
                                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Detection</h4>
                                <p className="text-xs text-slate-400">Ash is NOT detectable by weather radar as particles are too small to reflect beams.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800">
                                <h3 className="text-xl font-bold text-white mb-4">Pilot Actions</h3>
                                <ul className="space-y-3">
                                    <ActionItem text="Immediate 180° turn back to clear air." />
                                    <ActionItem text="Reduce thrust to idle (minimizes heat/melting)." />
                                    <ActionItem text="Turn on all anti-ice and ignition systems." />
                                    <ActionItem text="Initiate VAR (Volcanic Activity Report) to ATC." />
                                </ul>
                            </div>
                            <div className="bg-blue-900/10 border border-blue-500/20 p-6 rounded-3xl">
                                <h4 className="text-sm font-bold text-blue-400 mb-2">VAAC Systems</h4>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    9 Volcanic Ash Advisory Centers globally (e.g., London, Anchorage, Tokyo) monitor eruptions and issue SIGMETs.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {hazard === 'MICROBURST' && (
                    <motion.div
                        key="microburst"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                    >
                        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-8 relative min-h-[450px]">
                            {/* Visual Profile */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-10">
                                <ArrowDown size={300} className="text-blue-500" />
                            </div>

                            <div className="relative z-10 h-full flex flex-col">
                                <div className="mb-12">
                                    <h3 className="text-2xl font-black text-white mb-2 underline decoration-blue-500 decoration-4">The Landing Trap</h3>
                                    <p className="text-sm text-slate-400">Sequence of effects during approach.</p>
                                </div>

                                <div className="flex-grow grid grid-cols-3 gap-4 items-end">
                                    <SequenceItem step="1" title="Increased Headwind" desc="Lift increases, aircraft rises above GS." />
                                    <SequenceItem step="2" title="Severe Downdraft" desc="Rapid sink rate, high power required." />
                                    <SequenceItem step="3" title="Sudden Tailwind" desc="IAS drops, lift lost, stall risk." />
                                </div>

                                <div className="mt-12 bg-slate-950 p-4 rounded-xl border border-slate-800">
                                    <p className="text-xs text-slate-400 italic font-mono">
                                        Note: Typical diameter {`<`} 4km. Lifetime 5-15 mins. Intensity can exceed 6,000 ft/min downflow.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-800 pb-2">Identification</h4>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-1 h-12 bg-emerald-500/50 rounded-full" />
                                    <div>
                                        <div className="text-sm font-bold text-white">Virga</div>
                                        <div className="text-xs text-slate-500">Precipitation evaporating before ground (cooling the air).</div>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-1 h-12 bg-red-500/50 rounded-full" />
                                    <div>
                                        <div className="text-sm font-bold text-white">Dust Rings</div>
                                        <div className="text-xs text-slate-500">Blowing dust at surface indicates the 'outflow' boundary.</div>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-1 h-12 bg-blue-500/50 rounded-full" />
                                    <div>
                                        <div className="text-sm font-bold text-white">Anemometer Deviations</div>
                                        <div className="text-xs text-slate-500">Rapid gusts reported by LLWAS systems.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {hazard === 'SPACE_WEATHER' && (
                    <motion.div
                        key="space"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                    >
                        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
                            <h3 className="text-xl font-bold text-white mb-6">Cosmic Radiation</h3>
                            <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 mb-6">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-xs text-slate-500 uppercase font-black">Exposure Factors</span>
                                    <Activity className="text-red-400 animate-pulse" size={16} />
                                </div>
                                <ul className="space-y-4">
                                    <FactorRow label="Altitude" desc="Doubles every 6,000ft increase (less shielding)." />
                                    <FactorRow label="Latitude" desc="Higher near poles (magnetic field lines convergence)." />
                                    <FactorRow label="Solar Cycle" desc="Varies with 11-year sunspot cycle flares." />
                                </ul>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed italic border-l-2 border-yellow-500 pl-4">
                                EASA Part-CAT: Aircrew must be monitored for exposure exceeding 1 mSv per year.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800">
                                <h3 className="text-xl font-bold text-white mb-4">GNSS & Comms</h3>
                                <div className="space-y-4">
                                    <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                                        <h4 className="font-bold text-blue-300 text-sm mb-1">Ionospheric Scintillation</h4>
                                        <p className="text-[11px] text-slate-400">Can cause signal fading and positioning errors (meters to tens of meters).</p>
                                    </div>
                                    <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                                        <h4 className="font-bold text-red-300 text-sm mb-1">HF Blackout</h4>
                                        <p className="text-[11px] text-slate-400">Solar flares ionize the D-layer, absorbing HF signals on sunlit side of Earth.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const TabButton = ({ active, onClick, label, icon }: any) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${active ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
    >
        {icon}
        {label}
    </button>
);

const ImpactCard = ({ title, desc }: any) => (
    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 hover:border-orange-500/50 transition-colors">
        <h4 className="font-bold text-white text-sm mb-1">{title}</h4>
        <p className="text-xs text-slate-500">{desc}</p>
    </div>
);

const ActionItem = ({ text }: any) => (
    <li className="flex gap-3 items-center">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
        <span className="text-sm text-slate-300">{text}</span>
    </li>
);

const SequenceItem = ({ step, title, desc }: any) => (
    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 border-b-4 border-b-blue-500">
        <div className="text-[10px] font-black text-blue-500 mb-2 uppercase tracking-tight">Stage {step}</div>
        <h4 className="font-bold text-white text-xs mb-1 truncate">{title}</h4>
        <p className="text-[10px] text-slate-500 leading-tight">{desc}</p>
    </div>
);

const FactorRow = ({ label, desc }: any) => (
    <div className="flex justify-between items-start gap-4">
        <span className="text-[11px] font-bold text-slate-300 w-20 shrink-0">{label}</span>
        <span className="text-[11px] text-slate-500">{desc}</span>
    </div>
);

export default SpecialHazards;
