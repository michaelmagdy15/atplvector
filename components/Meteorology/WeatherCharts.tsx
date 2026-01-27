import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, MapPin, Wind, Info, Layers, Navigation, ArrowUpRight, Cloud, Zap, AlertTriangle } from 'lucide-react';

const WeatherCharts: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'SIGWX' | 'UPPER_AIR' | 'SYMBOLS'>('SIGWX');

    const symbols = [
        { name: 'Moderate Turbulence', icon: <TurbulenceIcon />, desc: 'Reported between specified levels.' },
        { name: 'Severe Turbulence', icon: <TurbulenceIcon severe />, desc: 'Significant hazard to aircraft structural integrity.' },
        { name: 'Moderate Icing', icon: <IcingIcon />, desc: 'Accumulation requiring de-ice boots.' },
        { name: 'Severe Icing', icon: <IcingIcon severe />, desc: 'Exceeds equipment capability.' },
        { name: 'Thunderstorm (Isolated)', icon: <Zap className="text-yellow-400" />, desc: 'ISOL TS: Individual cells.' },
        { name: 'Thunderstorm (Embedded)', icon: <div className="relative"><Cloud className="text-slate-400" /><Zap className="absolute top-1 right-0 text-yellow-500 w-3 h-3" /></div>, desc: 'EMBD TS: Hidden within other clouds.' },
    ];

    return (
        <div className="space-y-8 p-4 md:p-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-black text-white flex items-center gap-3">
                        <Map className="text-blue-500" />
                        Met Charts & Services
                    </h2>
                    <p className="text-slate-400 text-sm">SIGWX, Upper Air Charts, and Symbol interpretation.</p>
                </div>

                <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-slate-800">
                    <TabButton active={activeTab === 'SIGWX'} onClick={() => setActiveTab('SIGWX')} label="SIGWX Chart" />
                    <TabButton active={activeTab === 'UPPER_AIR'} onClick={() => setActiveTab('UPPER_AIR')} label="Upper Air" />
                    <TabButton active={activeTab === 'SYMBOLS'} onClick={() => setActiveTab('SYMBOLS')} label="Symbols" />
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'SIGWX' && (
                    <motion.div
                        key="sigwx"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                    >
                        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden relative min-h-[500px]">
                            {/* Mock Chart Background */}
                            <div className="absolute inset-0 opacity-20 pointer-events-none">
                                <div className="absolute top-1/4 left-1/4 w-96 h-96 border-4 border-indigo-500/30 rounded-full blur-3xl"></div>
                                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 border-4 border-emerald-500/30 rounded-full blur-3xl"></div>
                            </div>

                            <div className="relative p-8 h-full flex flex-col">
                                <div className="flex justify-between items-start mb-12">
                                    <div className="bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/5">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Chart Details</h4>
                                        <div className="text-sm text-white font-mono">SWH 250-630 | VALID 1200Z</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                                        <span className="text-[10px] text-slate-500 font-bold uppercase">Live Training Mode</span>
                                    </div>
                                </div>

                                {/* Chart Interactive Elements */}
                                <div className="flex-grow relative">
                                    <ChartMarker top="30%" left="40%" label="JET FL340" type="JET" rotate={45} />
                                    <ChartMarker top="60%" left="20%" label="CAT MOD" type="TURB" />
                                    <ChartMarker top="15%" left="70%" label="ISOL EMB TS" type="WX" />
                                    <ChartMarker top="70%" left="65%" label="OCL FRONT" type="FRONT" />
                                </div>

                                <div className="mt-auto bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                                    <p className="text-xs text-slate-400">
                                        <Info size={12} className="inline mr-2 text-blue-400" />
                                        Interactive SIGWX: Hover markers to see decoding according to ICAO Annex 3.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800">
                                <h3 className="text-lg font-bold text-white mb-4">Legend & Decoding</h3>
                                <div className="space-y-4">
                                    <LegendItem label="FL340" desc="Flight Level (Pressure Alt in 100ft)" />
                                    <LegendItem label="CAT" desc="Clear Air Turbulence (Area indicated)" />
                                    <LegendItem label="EMBD" desc="Embedded in other clouds / haze" />
                                    <LegendItem label="CB" desc="Cumulonimbus (TS implied)" />
                                </div>
                            </div>
                            <div className="bg-emerald-900/10 border border-emerald-500/20 p-6 rounded-3xl">
                                <h4 className="text-sm font-bold text-emerald-400 mb-2">Pro Tip</h4>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    SWH charts cover FL250-FL630. For shorter regional flights, you must check SWM (FL100-FL250) or SWL (below FL100).
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'UPPER_AIR' && (
                    <motion.div
                        key="upper_air"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                    >
                        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
                            <h3 className="text-xl font-bold text-white mb-6">Wind Barbs Decoder</h3>
                            <div className="flex items-center justify-around mb-8 bg-slate-950 py-12 rounded-2xl border border-slate-800">
                                <div className="text-center">
                                    <div className="relative w-24 h-24 mx-auto mb-4 border border-dashed border-slate-700 rounded-full flex items-center justify-center">
                                        <WindBarb speed={65} rotate={225} />
                                    </div>
                                    <span className="text-xs font-mono text-slate-500">225° / 65 KT</span>
                                </div>
                                <div className="text-left space-y-2">
                                    <div className="flex gap-2 items-center"><div className="w-8 h-1 bg-white"></div> <span className="text-xs text-slate-400">Long flag = 10 KT</span></div>
                                    <div className="flex gap-2 items-center"><div className="w-4 h-1 bg-white"></div> <span className="text-xs text-slate-400">Short flag = 5 KT</span></div>
                                    <div className="flex gap-2 items-center"><div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-white rotate-180"></div> <span className="text-xs text-slate-400">Triangle = 50 KT</span></div>
                                </div>
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Upper air charts (e.g., 500hPa, 300hPa) show actual wind velocity and temperature at standard pressure levels. Essential for flight planning and jet stream identification.
                            </p>
                        </div>
                        <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800">
                            <h3 className="text-xl font-bold text-white mb-6">Chart Levels</h3>
                            <div className="space-y-4">
                                <LevelCard pressure="850 hPa" altitude="~5,000 ft" usage="Low level winds/temps" />
                                <LevelCard pressure="700 hPa" altitude="~10,000 ft" usage="Moisture & Freezing level" />
                                <LevelCard pressure="500 hPa" altitude="~18,000 ft" usage="General flow & Steering" />
                                <LevelCard pressure="300 hPa" altitude="~30,000 ft" usage="Jet Stream level (Polar)" />
                                <LevelCard pressure="200 hPa" altitude="~39,000 ft" usage="Jet Stream level (Subtropical)" />
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'SYMBOLS' && (
                    <motion.div
                        key="symbols"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {symbols.map((s, i) => (
                            <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-start gap-4 hover:border-blue-500/50 transition-colors">
                                <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-800 text-white shrink-0">
                                    {s.icon}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white mb-1">{s.name}</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const TabButton = ({ active, onClick, label }: any) => (
    <button
        onClick={onClick}
        className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${active ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
    >
        {label}
    </button>
);

const ChartMarker = ({ top, left, label, type, rotate = 0 }: any) => (
    <div className="absolute group" style={{ top, left }}>
        <motion.div
            whileHover={{ scale: 1.2 }}
            className={`w-6 h-6 rounded-full flex items-center justify-center cursor-help border border-white/20 shadow-xl ${type === 'JET' ? 'bg-purple-500' : type === 'TURB' ? 'bg-orange-500' : type === 'WX' ? 'bg-yellow-500' : 'bg-red-500'
                }`}
        >
            {type === 'JET' && <Zap size={12} className="text-white" style={{ transform: `rotate(${rotate}deg)` }} />}
            {type === 'TURB' && <TurbulenceIcon size={12} />}
            {type === 'WX' && <Cloud size={12} className="text-white" />}
            {type === 'FRONT' && <ArrowUpRight size={12} className="text-white" />}
        </motion.div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
            <div className="bg-black/90 text-white text-[10px] font-bold px-2 py-1 rounded border border-slate-700">
                {label}
            </div>
        </div>
    </div>
);

const LegendItem = ({ label, desc }: any) => (
    <div className="flex gap-4 items-start">
        <span className="text-blue-400 font-mono text-xs font-bold w-12 pt-0.5">{label}</span>
        <span className="text-xs text-slate-400 flex-grow">{desc}</span>
    </div>
);

const LevelCard = ({ pressure, altitude, usage }: any) => (
    <div className="flex justify-between items-center p-3 bg-slate-900 rounded-xl border border-slate-800">
        <div>
            <div className="text-sm font-bold text-white">{pressure}</div>
            <div className="text-[10px] text-slate-500 uppercase">{altitude}</div>
        </div>
        <div className="text-[11px] text-slate-400">{usage}</div>
    </div>
);

const WindBarb = ({ speed, rotate }: any) => {
    const triangles = Math.floor(speed / 50);
    const longFlags = Math.floor((speed % 50) / 10);
    const shortFlags = Math.floor((speed % 10) / 5);

    return (
        <div style={{ transform: `rotate(${rotate}deg)` }} className="relative w-1 h-16 bg-white origin-bottom">
            <div className="absolute top-0 right-0 space-y-1">
                {[...Array(triangles)].map((_, i) => (
                    <div key={`t-${i}`} className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-white rotate-180 -mr-2"></div>
                ))}
                {[...Array(longFlags)].map((_, i) => (
                    <div key={`l-${i}`} className="w-4 h-0.5 bg-white -mr-4 rotate-[30deg] origin-left"></div>
                ))}
                {[...Array(shortFlags)].map((_, i) => (
                    <div key={`s-${i}`} className="w-2 h-0.5 bg-white -mr-2 rotate-[30deg] origin-left"></div>
                ))}
            </div>
        </div>
    );
};

const TurbulenceIcon = ({ size = 24, severe = false }: any) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 16V8l5 8V8l5 8" />
        {severe && <path d="M7 6v12M17 6v12" />}
    </svg>
);

const IcingIcon = ({ size = 24, severe = false }: any) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M2 12h20" />
        <path d="m16.24 7.76-8.48 8.48M7.76 7.76l8.48 8.48" />
        {severe && <circle cx="12" cy="12" r="6" strokeDasharray="2 2" />}
    </svg>
);

export default WeatherCharts;
