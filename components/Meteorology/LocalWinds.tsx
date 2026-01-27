import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Sun, Moon, Mountain, Waves, Info, Compass, ArrowRight, AlertTriangle } from 'lucide-react';

const LocalWinds: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'Coastal' | 'Mountain' | 'Foehn' | 'Regional'>('Coastal');
    const [timeOfDay, setTimeOfDay] = useState<'Day' | 'Night'>('Day');

    return (
        <div className="space-y-8 p-4 md:p-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                <div>
                    <h2 className="text-3xl font-black text-white flex items-center gap-3">
                        <Wind className="text-teal-400 stroke-[3]" />
                        Local Wind Systems
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Breezes, slope winds, and regional phenomena.</p>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 scrollbar-hide overflow-x-auto max-w-full">
                    {(['Coastal', 'Mountain', 'Foehn', 'Regional'] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setActiveTab(t)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === t
                                    ? 'bg-teal-600 text-white shadow-lg'
                                    : 'text-slate-500 hover:text-white'
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'Coastal' && (
                    <motion.div
                        key="coastal"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                    >
                        <div className="lg:col-span-2 bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden relative min-h-[400px]">
                            {/* Toggle */}
                            <div className="absolute top-6 left-6 z-20 flex gap-2">
                                <button
                                    onClick={() => setTimeOfDay('Day')}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${timeOfDay === 'Day' ? 'bg-orange-500 text-white' : 'bg-slate-900 text-slate-500'}`}
                                >
                                    <Sun size={14} /> Sea Breeze
                                </button>
                                <button
                                    onClick={() => setTimeOfDay('Night')}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${timeOfDay === 'Night' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-500'}`}
                                >
                                    <Moon size={14} /> Land Breeze
                                </button>
                            </div>

                            {/* Background Visuals */}
                            <div className="absolute inset-0 flex">
                                <div className="w-1/2 h-full bg-emerald-900/10 flex items-end justify-center pb-10 border-r border-white/5 relative">
                                    <span className="text-[10px] font-bold text-emerald-500/50 uppercase tracking-widest absolute top-20">LAND</span>
                                </div>
                                <div className="w-1/2 h-full bg-blue-900/10 flex items-end justify-center pb-10 relative">
                                    <Waves className="absolute bottom-10 text-blue-500/20" size={100} />
                                    <span className="text-[10px] font-bold text-blue-500/50 uppercase tracking-widest absolute top-20">SEA</span>
                                </div>
                            </div>

                            {/* Circulation Animation */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative w-64 h-32 border-2 border-dashed border-slate-800 rounded-full">
                                    <AnimatePresence>
                                        <motion.div
                                            key={timeOfDay}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="absolute inset-0"
                                        >
                                            {/* Surface Wind Arrow */}
                                            <motion.div
                                                animate={{ x: timeOfDay === 'Day' ? [140, 20] : [20, 140] }}
                                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                                className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2"
                                            >
                                                <Compass className={`transform ${timeOfDay === 'Day' ? 'rotate-90' : '-rotate-90'} ${timeOfDay === 'Day' ? 'text-blue-400' : 'text-emerald-400'}`} />
                                                <span className={`text-[10px] font-black uppercase ${timeOfDay === 'Day' ? 'text-blue-400' : 'text-emerald-400'}`}>
                                                    {timeOfDay === 'Day' ? 'Sea Breeze (10-15kt)' : 'Land Breeze (5-7kt)'}
                                                </span>
                                            </motion.div>

                                            {/* Return Flow Arrow (1000 ft) */}
                                            <motion.div
                                                animate={{ x: timeOfDay === 'Day' ? [20, 140] : [140, 20] }}
                                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                                className="absolute -top-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 opacity-30"
                                            >
                                                <Compass className={`transform ${timeOfDay === 'Day' ? '-rotate-90' : 'rotate-90'} text-slate-400`} />
                                                <span className="text-[10px] font-black uppercase text-slate-500">Return Flow (1000ft)</span>
                                            </motion.div>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
                                <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                                    <Info className="text-teal-400" size={18} />
                                    Mechanism
                                </h4>
                                <ul className="space-y-4">
                                    <li className="text-xs text-slate-400 leading-relaxed">
                                        <span className="font-bold text-white block mb-1">Differential Heating:</span>
                                        Day: Land heats faster than sea. Air expands, creating high pressure aloft. Flow starts 1000ft land-to-sea.
                                    </li>
                                    <li className="text-xs text-slate-400 leading-relaxed">
                                        <span className="font-bold text-white block mb-1">Surface Flow:</span>
                                        Compensation causes surface wind to blow from Sea to Land (Day) or Land to Sea (Night).
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-orange-600/10 border border-orange-500/20 p-6 rounded-3xl">
                                <h4 className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <AlertTriangle size={14} /> Operational Note
                                </h4>
                                <p className="text-[11px] text-slate-400 italic leading-relaxed">
                                    "Sea breezes blowing against surface wind can cause a <strong>Sea Breeze Front</strong>, potentially developing CU, CB, or TS."
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'Mountain' && (
                    <motion.div
                        key="mountain"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                    >
                        <SlopeWindCard
                            type="Katabatic"
                            time="Night"
                            title="Katabatic Wind"
                            desc="Cold, heavy air flowing down a mountain slope under gravity. Most intense on glaciers."
                            speed="Can exceed 40-50kts near glaciers"
                            color="text-blue-400"
                            bg="bg-blue-600/5"
                        />
                        <SlopeWindCard
                            type="Anabatic"
                            time="Day"
                            title="Anabatic Wind"
                            desc="Warm air flowing up slopes as it is heated by the sun. Generally weaker than katabatic."
                            speed="Typical max 5 kts"
                            color="text-orange-400"
                            bg="bg-orange-600/5"
                        />
                    </motion.div>
                )}

                {activeTab === 'Foehn' && (
                    <motion.div
                        key="foehn"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
                            <div>
                                <h3 className="text-2xl font-black text-white mb-4">The Foehn Wind Effect</h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-8">
                                    A warm, dry, gusty wind that occurs on the leeward side of mountain ranges.
                                </p>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 group">
                                        <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-blue-400 border border-slate-800">1</div>
                                        <p className="text-xs text-slate-500">Moist air rises on windward side, cooling at <strong>SALR (1.8°C/1000ft)</strong> once saturated.</p>
                                    </div>
                                    <div className="flex items-center gap-4 group">
                                        <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-orange-400 border border-slate-800">2</div>
                                        <p className="text-xs text-slate-500">Precipitation occurs at the peak, removing moisture.</p>
                                    </div>
                                    <div className="flex items-center gap-4 group">
                                        <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-red-500 border border-slate-800">3</div>
                                        <p className="text-xs text-slate-500 font-bold">Dry air descends on leeward side, warming at <strong>DALR (3.0°C/1000ft)</strong>. Result: Hot and dry.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 relative h-64 lg:h-auto">
                                <svg className="w-full h-full" viewBox="0 0 400 200">
                                    {/* Mountain */}
                                    <path d="M 0 200 L 200 50 L 400 200" fill="#1e293b" />

                                    {/* Wind Path */}
                                    <motion.path
                                        d="M 20 180 L 200 60 L 380 180"
                                        fill="none"
                                        stroke="url(#windGradient)"
                                        strokeWidth="4"
                                        strokeDasharray="10 5"
                                        animate={{ strokeDashoffset: [100, 0] }}
                                        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                                    />

                                    <defs>
                                        <linearGradient id="windGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#60a5fa" />
                                            <stop offset="50%" stopColor="#ffffff" />
                                            <stop offset="100%" stopColor="#f87171" />
                                        </linearGradient>
                                    </defs>

                                    <text x="20" y="200" fill="#60a5fa" fontSize="10" fontWeight="bold">WINDWARD (MOIST)</text>
                                    <text x="310" y="200" fill="#f87171" fontSize="10" fontWeight="bold">LEEWARD (DRY/HOT)</text>

                                    {/* Rain */}
                                    <motion.g animate={{ opacity: [0, 1, 0], y: [0, 20] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                                        <line x1="180" y1="80" x2="175" y2="90" stroke="#3b82f6" strokeWidth="1" />
                                        <line x1="190" y1="80" x2="185" y2="90" stroke="#3b82f6" strokeWidth="1" />
                                        <line x1="200" y1="80" x2="195" y2="90" stroke="#3b82f6" strokeWidth="1" />
                                    </motion.g>
                                </svg>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'Regional' && (
                    <motion.div
                        key="regional"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        <RegionalWind title="Mistral" origin="Rhone Valley" desc="Cold northerly wind blowing into the Gulf of Lyon. Enhanced by Venturi effect in the valley." color="border-blue-500/30" />
                        <RegionalWind title="Bora" origin="Balkans/Adriatic" desc="Strong northerly katabatic wind blowing down toward the sea. Cold and guesty." color="border-blue-500/30" />
                        <RegionalWind title="Scirocco" origin="North Africa" desc="Southerly wind from the desert. Very hot, dry and dusty. Known as Ghibli in Libya." color="border-orange-500/30" />
                        <RegionalWind title="Levante" origin="Western Med" desc="Easterly wind blowing through the Strait of Gibraltar. Strong due to Venturi." color="border-teal-500/30" />
                        <RegionalWind title="Harmattan" origin="Saharan Africa" desc="NE trade wind that is hot, dry and carries dust. Part of the West African Monsoon." color="border-yellow-500/30" />
                        <RegionalWind title="Pampero" origin="Argentina/Uruguay" desc="Cold southerly polar outbreak. Can be 'Wet' (heavy rain) or 'Dry' (cold/gusty)." color="border-indigo-500/30" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const SlopeWindCard = ({ type, time, title, desc, speed, color, bg }: any) => (
    <div className={`p-8 rounded-3xl border border-slate-800 ${bg} relative overflow-hidden group`}>
        <div className="flex justify-between items-start mb-6">
            <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-slate-950 border border-slate-800 ${color}`}>
                {time} Phenomenon
            </div>
            <div className={`text-2xl font-black ${color}`}>{type}</div>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">{desc}</p>
        <div className="flex items-center gap-3 p-3 bg-slate-950 rounded-2xl border border-slate-800">
            <Wind className={color} size={20} />
            <div className="text-xs">
                <span className="text-slate-500 uppercase font-bold block">Peak Speed</span>
                <span className="text-white font-mono">{speed}</span>
            </div>
        </div>

        {/* Abstract Slope Visual */}
        <div className="absolute right-[-20px] bottom-[-20px] opacity-10 group-hover:opacity-20 transition-opacity">
            <Mountain size={120} />
        </div>
    </div>
);

const RegionalWind = ({ title, origin, desc, color }: any) => (
    <div className={`bg-slate-900/50 p-6 rounded-3xl border ${color} hover:bg-slate-900 transition-all cursor-default`}>
        <div className="flex justify-between items-center mb-4">
            <h4 className="text-xl font-bold text-white">{title}</h4>
            <ArrowRight className="text-slate-700" size={16} />
        </div>
        <div className="inline-block px-2 py-0.5 rounded bg-slate-950 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">
            Region: {origin}
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
    </div>
);

export default LocalWinds;
