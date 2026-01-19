import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Layout, Map, Compass, Activity, Info, ShieldCheck, Palette } from 'lucide-react';

const FMSEFIS: React.FC = () => {
    const [mode, setMode] = useState<'MAP' | 'VOR' | 'APP' | 'PLAN'>('MAP');

    const colors = [
        { label: 'Green', use: 'Engaged modes, active data, ILS data' },
        { label: 'Cyan/Blue', use: 'Non-active background data, fixed symbols' },
        { label: 'Magenta', use: 'Commanded values (Flight Director), active route' },
        { label: 'White', use: 'Scales, units, current status' },
        { label: 'Amber', use: 'Cautions, warning flags' },
        { label: 'Red', use: 'Critical warnings, Vmo/Mmo limits' }
    ];

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="mb-12">
                <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
                    <Monitor className="text-emerald-400" />
                    EFIS & EHSI Display
                </h1>
                <p className="text-slate-400 max-w-2xl">
                    The modern flight deck interface. Understand EFIS architecture, EHSI display modes, and the standard aviation color coding system.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* EFIS Controls */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                        <h3 className="text-white font-bold mb-6 flex items-center gap-2 text-sm uppercase">
                            <Layout className="text-slate-500 w-4 h-4" />
                            Display Mode (EFIS Control Panel)
                        </h3>

                        <div className="grid grid-cols-2 gap-3">
                            {(['MAP', 'VOR', 'APP', 'PLAN'] as const).map((m) => (
                                <button
                                    key={m}
                                    onClick={() => setMode(m)}
                                    className={`py-4 rounded-xl border font-black text-xs transition-all ${mode === m
                                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/10'
                                            : 'bg-slate-800/50 border-slate-700 text-slate-500'
                                        }`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-800">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Mode Capabilities</h4>
                            <div className="text-xs text-slate-400 space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${mode === 'MAP' ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
                                    <span>Track Up / Heading Up Map</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${mode === 'PLAN' ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
                                    <span>North Up (Static Chart)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${mode === 'APP' ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
                                    <span>Full Compass + G/S + LOC</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                        <h4 className="text-white font-bold mb-4 flex items-center gap-2 text-sm uppercase">
                            <Palette className="w-4 h-4 text-rose-400" />
                            Standard Color Coding
                        </h4>
                        <div className="space-y-3">
                            {colors.map((c) => (
                                <div key={c.label} className="group">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: c.label.toLowerCase() === 'magenta' ? '#d946ef' : c.label.toLowerCase() }}></div>
                                        <span className="text-[10px] font-black uppercase text-slate-300 group-hover:text-white transition-colors">{c.label}</span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 leading-tight">{c.use}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Display Mockup */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-1 relative overflow-hidden h-[500px] flex items-center justify-center">

                        {/* EFIS Screen Frame */}
                        <div className="w-[90%] h-[90%] bg-black rounded-lg border-4 border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden p-6 font-mono">

                            {/* Heading Tape Placeholder */}
                            <div className="absolute top-0 left-0 right-0 h-10 border-b border-white/20 flex items-center justify-center bg-slate-950/50">
                                <div className="text-emerald-400 font-black tracking-[0.5em] text-lg">0 9 0</div>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-4 bg-white"></div>
                            </div>

                            {/* Center Display based on mode */}
                            <AnimatePresence mode="wait">
                                {mode === 'MAP' && (
                                    <motion.div
                                        key="map"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="h-full flex flex-col items-center justify-center"
                                    >
                                        <div className="relative w-64 h-64">
                                            {/* Aircraft symbol */}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Compass className="text-white rotate-180" size={32} />
                                            </div>
                                            {/* Range Rings */}
                                            <div className="absolute inset-0 border border-white/5 rounded-full scale-50"></div>
                                            <div className="absolute inset-0 border border-white/5 rounded-full"></div>
                                            {/* Waypoints */}
                                            <motion.div animate={{ y: [20, 100], x: [100, 110] }} transition={{ repeat: Infinity, duration: 10, ease: "linear" }} className="absolute text-emerald-500 top-20 right-20 flex flex-col items-center">
                                                <div className="w-1.5 h-1.5 border-2 border-emerald-500 rotate-45"></div>
                                                <span className="text-[8px] mt-1">EHAM</span>
                                            </motion.div>
                                            <motion.div animate={{ y: [0, 80] }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }} className="absolute text-magenta-500 top-10 left-32 flex flex-col items-center">
                                                <div className="w-2 h-2 border-2 border-magenta-500 rotate-45 bg-magenta-500/20"></div>
                                                <span className="text-[8px] mt-1 text-magenta-400">WAYPT</span>
                                            </motion.div>
                                        </div>
                                        <div className="absolute bottom-12 right-12 text-blue-400 text-[10px] font-bold">100 / 20NM</div>
                                    </motion.div>
                                )}

                                {mode === 'VOR' && (
                                    <motion.div
                                        key="vor"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="h-full flex flex-col items-center justify-center"
                                    >
                                        <div className="w-64 h-64 border-2 border-white/10 rounded-full relative flex items-center justify-center">
                                            <div className="absolute inset-0 rotate-[45deg]">
                                                <div className="w-full h-0.5 bg-magenta-500 shadow-[0_0_10px_rgba(217,70,239,0.5)]"></div>
                                            </div>
                                            <div className="bg-black border border-white/20 px-2 py-1 text-[8px] text-white">VOR 112.5</div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Mode Indicator */}
                            <div className="absolute top-4 left-4 p-2 bg-slate-900 border border-white/10 rounded flex flex-col">
                                <span className="text-[8px] text-slate-500 font-black uppercase">Active Mode</span>
                                <span className="text-[10px] text-emerald-400 font-bold">{mode}</span>
                            </div>

                            {/* Alert Area */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-amber-500 text-[8px] font-black uppercase tracking-widest flex items-center gap-2">
                                <Activity size={10} />
                                WXR / TERR INHIBITED
                            </div>
                        </div>
                    </div>

                    {/* Technical Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                            <h4 className="flex items-center gap-2 text-white font-bold mb-4">
                                <Info className="text-blue-400 w-4 h-4" />
                                EFIS Components
                            </h4>
                            <ul className="text-xs text-slate-400 space-y-2">
                                <li><strong>PFD:</strong> Primary Flight Display (ASI, AI, ALT, VSI).</li>
                                <li><strong>ND:</strong> Navigation Display (EHSI, Map, WXR).</li>
                                <li><strong>SGU:</strong> Symbol Generator Unit (The 'brain' of the display).</li>
                                <li><strong>CP:</strong> Control Panel (Mode/Range selector).</li>
                            </ul>
                        </div>
                        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                            <h4 className="flex items-center gap-2 text-white font-bold mb-4">
                                <ShieldCheck className="text-emerald-400 w-4 h-4" />
                                Failover Logic
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Modern systems allow <strong>Composite Mode</strong> where if a PFD fails, its data can be transferred to the ND screen so the pilot never loses primary flight info.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FMSEFIS;
