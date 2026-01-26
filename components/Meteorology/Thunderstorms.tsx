
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CloudLightning, Zap, Wind, AlertOctagon } from 'lucide-react';

const Thunderstorms: React.FC = () => {
    const [stage, setStage] = useState<0 | 1 | 2>(0);

    const stages = [
        {
            name: 'Cumulus (Developing)',
            time: '15-20 mins',
            features: ['Updrafts only (3000ft/min)', 'No Precipitation', 'Cloud structure: Towering Cumulus (TCU)', 'Hazards: Turbulence, Icing'],
            color: 'bg-yellow-500'
        },
        {
            name: 'Mature',
            time: '15-30 mins',
            features: ['Updrafts & Downdrafts', 'Heavy Precipitation (rain/hail)', 'Lightning & Thunder', 'Microbursts likely', 'Cloud tops to 40k+ ft'],
            color: 'bg-red-500'
        },
        {
            name: 'Dissipating',
            time: '1.5 - 2.5 hours',
            features: ['Downdrafts dominate', 'Light precipitation', 'Anvil top formation', 'Storm raining itself out'],
            color: 'bg-blue-500'
        }
    ];

    return (
        <div className="space-y-8">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                        <CloudLightning className="text-purple-500" /> Thunderstorm Life Cycle
                    </h3>

                    <div className="flex gap-2">
                        {[0, 1, 2].map((s) => (
                            <button
                                key={s}
                                onClick={() => setStage(s as any)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${stage === s ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-800 text-slate-500'
                                    }`}
                            >
                                {s + 1}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Animation Container */}
                    <div className="relative h-[400px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-end justify-center">
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950"></div>

                        {/* Ground */}
                        <div className="absolute bottom-0 w-full h-8 bg-emerald-900/50 border-t border-emerald-500/20"></div>

                        {/* Cloud Visuals */}
                        <div className="relative z-10 w-full flex items-end justify-center h-full pb-8">
                            {stage === 0 && (
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="w-48 h-64 bg-slate-200 rounded-full blur-xl opacity-80"
                                    style={{ background: 'radial-gradient(circle, #fff 0%, #94a3b8 100%)' }}
                                >
                                    {/* Arrow Up */}
                                    <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
                                        <Wind className="text-red-500 rotate-[-90deg] animate-pulse" />
                                        <Wind className="text-red-500 rotate-[-90deg] animate-pulse" />
                                    </div>
                                </motion.div>
                            )}

                            {stage === 1 && (
                                <motion.div
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: 1.1 }}
                                    className="w-64 h-[90%] bg-slate-300 rounded-[3rem] blur-md flex flex-col items-center relative"
                                    style={{ background: 'radial-gradient(circle, #e2e8f0 0%, #475569 100%)' }}
                                >
                                    {/* Anvil starting */}
                                    {/* Lightning */}
                                    <Zap className="absolute top-1/2 text-yellow-400 w-16 h-16 animate-ping" />

                                    {/* Up/Down Drafts */}
                                    <div className="absolute flex w-full justify-around h-full pt-20">
                                        <div className="flex flex-col gap-8"><Wind className="text-red-600 rotate-[-90deg]" /></div>
                                        <div className="flex flex-col gap-8"><Wind className="text-blue-600 rotate-[90deg]" /></div>
                                    </div>

                                    {/* Rain */}
                                    <div className="absolute -bottom-8 w-full h-20 bg-blue-500/20 blur-sm flex justify-center">
                                        <span className="text-blue-400 font-bold text-xs">HEAVY RAIN/HAIL</span>
                                    </div>
                                </motion.div>
                            )}

                            {stage === 2 && (
                                <motion.div
                                    className="w-full max-w-sm h-full flex flex-col items-center relative"
                                >
                                    {/* Anvil shape */}
                                    <div className="w-[120%] h-32 bg-slate-400 blur-xl translate-y-10 rounded-full"></div>
                                    <div className="w-64 h-full bg-slate-400 blur-xl -translate-y-10 rounded-full opacity-50"></div>

                                    {/* Down Drafts */}
                                    <div className="absolute inset-0 flex items-center justify-center flex-col gap-8">
                                        <Wind className="text-blue-700 rotate-[90deg]" />
                                        <Wind className="text-blue-700 rotate-[90deg]" />
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Info Panel */}
                    <div>
                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-4 ${stages[stage].color}`}>
                            Stage {stage + 1}: {stages[stage].name}
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Duration</h4>
                                <div className="text-2xl font-mono text-white">{stages[stage].time}</div>
                            </div>

                            <div>
                                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Key Features</h4>
                                <ul className="space-y-2">
                                    {stages[stage].features.map((f, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                                            <div className={`w-1.5 h-1.5 rounded-full ${stages[stage].color}`}></div>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {stage === 1 && (
                            <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                                <h4 className="text-red-400 font-bold text-sm flex items-center gap-2 mb-2">
                                    <AlertOctagon size={16} /> Microburst Hazard
                                </h4>
                                <p className="text-xs text-slate-400">
                                    Intense downdraft (&lt;4km wide). Performance shear:
                                    <span className="text-white"> 45kt Headwind &rarr; Tailwind</span> loss.
                                    Avoidance is the only safe option.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Thunderstorms;
