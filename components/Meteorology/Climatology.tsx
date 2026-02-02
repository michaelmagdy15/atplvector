import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Thermometer, CloudRain, Sun, Compass, Info, Map as MapIcon, AlertTriangle } from 'lucide-react';

const Climatology: React.FC = () => {
    const [view, setView] = useState<'Koppen' | 'Pressure' | 'ITCZ'>('Koppen');
    const [month, setMonth] = useState<'January' | 'July'>('January');

    return (
        <div className="space-y-8 p-4 md:p-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                <div>
                    <h2 className="text-3xl font-black text-white flex items-center gap-3">
                        <Globe className="text-emerald-400 animate-pulse" />
                        Climatology
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Global weather patterns, climates, and ITCZ dynamics.</p>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
                    {(['Koppen', 'Pressure', 'ITCZ'] as const).map((v) => (
                        <button
                            key={v}
                            onClick={() => setView(v)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === v
                                ? 'bg-emerald-600 text-white shadow-lg'
                                : 'text-slate-500 hover:text-white'
                                }`}
                        >
                            {v === 'Koppen' ? 'Köppen Classes' : v === 'Pressure' ? 'Global Pressure' : 'ITCZ'}
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {view === 'Koppen' && (
                    <motion.div
                        key="koppen"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        <ClimateCard
                            title="Class A: Tropical"
                            desc="High temperatures and rainfall throughout the year. No dry season."
                            features={["Equatorial latitudes", "High humidity", "Intense TS activity"]}
                            icon={<CloudRain className="text-blue-400" />}
                            color="border-blue-500/30"
                        />
                        <ClimateCard
                            title="Class B: Arid"
                            desc="Little rain, huge daily temperature variation. No permanent water."
                            features={["Subtropical belts", "High diurnal range", "Clear skies"]}
                            icon={<Sun className="text-yellow-400" />}
                            color="border-yellow-500/30"
                        />
                        <ClimateCard
                            title="Class C: Mid-latitude"
                            desc="Distinct summer and winter seasons. Temperate conditions."
                            features={["European/US climates", "Frontal activity", "Variable weather"]}
                            icon={<Thermometer className="text-emerald-400" />}
                            color="border-emerald-500/30"
                        />
                        <ClimateCard
                            title="Class D: Sub-arctic"
                            desc="Cold temperatures, boreal forest regions. Severe winters."
                            features={["High latitudes", "Continental effects", "Snow dominated"]}
                            icon={<Globe className="text-indigo-400" />}
                            color="border-indigo-500/30"
                        />
                        <ClimateCard
                            title="Class E: Polar"
                            desc="Permanent snow/ice. Antarctica and Arctic regions."
                            features={["Lowest temperatures", "Ice caps", "Dry air"]}
                            icon={<Globe className="text-slate-400" />}
                            color="border-slate-500/30"
                        />
                        <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
                            <Info className="text-slate-600 mb-4" size={32} />
                            <p className="text-sm text-slate-500 italic">Mediterranean climate is temperate-transition (warm dry summer, cool wet winter).</p>
                        </div>
                    </motion.div>
                )}

                {view === 'Pressure' && (
                    <motion.div
                        key="pressure"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-3xl border border-slate-800">
                            <h3 className="font-bold text-white">Global Pressure Belts - {month}</h3>
                            <div className="flex gap-2">
                                {(['January', 'July'] as const).map(m => (
                                    <button
                                        key={m}
                                        onClick={() => setMonth(m)}
                                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${month === m ? 'bg-white text-slate-900' : 'bg-slate-800 text-slate-500'}`}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 relative min-h-[400px]">
                                <h4 className="text-lg font-bold text-white mb-6">Thermodynamic Cells</h4>
                                <div className="space-y-6 relative z-10">
                                    <CellRow lat="90°N" type="POLAR HIGH" action="Subsidence" color="text-blue-400" />
                                    <CellRow lat="60°N" type="POLAR FRONT LOW" action="Convergence" color="text-red-400" />
                                    <CellRow lat="30°N" type="SUBTROPICAL HIGH" action="Subsidence" color="text-blue-400" />
                                    <CellRow lat="0°" type="EQUATORIAL LOW" action="Convergence (ITCZ)" color="text-red-400" />
                                    <CellRow lat="30°S" type="SUBTROPICAL HIGH" action="Subsidence" color="text-blue-400" />
                                    <CellRow lat="60°S" type="POLAR FRONT LOW" action="Convergence" color="text-red-400" />
                                    <CellRow lat="90°S" type="POLAR HIGH" action="Subsidence" color="text-blue-400" />
                                </div>
                                <div className="absolute right-10 top-20 bottom-20 w-32 border-l border-slate-800 flex flex-col justify-around py-4 opacity-50">
                                    <span className="text-[10px] text-slate-500 rotate-90 whitespace-nowrap">Polar Cell</span>
                                    <span className="text-[10px] text-slate-500 rotate-90 whitespace-nowrap">Ferrel Cell</span>
                                    <span className="text-[10px] text-slate-500 rotate-90 whitespace-nowrap">Hadley Cell</span>
                                </div>
                            </div>

                            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
                                <h4 className="text-lg font-bold text-white mb-6">Seasonal Features ({month})</h4>
                                <div className="space-y-4">
                                    {month === 'January' ? (
                                        <>
                                            <FeatureItem title="Siberian High" desc="Huge cold anticyclone over Asia. Affects UK with frosty conditions." />
                                            <FeatureItem title="Azores High" desc="Retreats south. Weak control over European weather." />
                                            <FeatureItem title="Icelandic Low" desc="Very deep. Drives frequent depressions into Europe." />
                                            <FeatureItem title="Australian High" desc="Forms over land in the SH summer." />
                                        </>
                                    ) : (
                                        <>
                                            <FeatureItem title="Azores High" desc="Expands north-east. Brings fine summer weather to Europe." />
                                            <FeatureItem title="South Asian Low" desc="Thermal depression due to intense heating. ITCZ reaches 40°N." />
                                            <FeatureItem title="Icelandic Low" desc="Weakens and moves further north." />
                                            <FeatureItem title="Siberian Low" desc="Continental heating replaces the winter high with low pressure." />
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {view === 'ITCZ' && (
                    <motion.div
                        key="itcz"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="bg-slate-900 border border-slate-800 p-8 rounded-3xl"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div>
                                <h3 className="text-2xl font-black text-white mb-4">Intertropical Convergence Zone</h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                    The "thermal equator" where trade winds from both hemispheres meet. Characterized by rising air, low pressure, and intense convective activity.
                                </p>

                                <div className="space-y-6">
                                    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                                        <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">Flight Hazards</h4>
                                        <ul className="space-y-3">
                                            <HazardItem text="Severe icing even below -40°C due to intense updrafts." />
                                            <HazardItem text="Towering CBs reaching up to 55,000 ft+." />
                                            <HazardItem text="Severe turbulence and heavy rain (good vis except in rain)." />
                                            <HazardItem text="Width varies from 27 nm to 270 nm." />
                                        </ul>
                                    </div>

                                    <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl flex gap-4">
                                        <Compass className="text-orange-400 shrink-0" size={24} />
                                        <div className="text-xs text-slate-400 italic">
                                            The ITCZ follows the Sun (seasonal movement). In July it moves north (reaching India/Asia), in January it moves south.
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative h-80 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center overflow-hidden">
                                {/* Simplified World Map Path */}
                                <div className="absolute inset-0 opacity-10 flex items-center justify-center">
                                    <MapIcon size={200} />
                                </div>
                                <div className="absolute w-full h-[1px] bg-slate-800 top-1/2" />
                                <span className="absolute right-2 top-[48%] text-[8px] text-slate-600">EQUATOR</span>

                                {/* ITCZ Line Animation */}
                                <motion.div
                                    animate={{
                                        y: month === 'January' ? 40 : -60,
                                        opacity: [0.5, 0.8, 0.5]
                                    }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="absolute w-full h-8 bg-gradient-to-r from-red-500/0 via-red-500/20 to-red-500/0 flex items-center justify-center"
                                >
                                    <div className="w-full flex items-center justify-center gap-1">
                                        {[...Array(30)].map((_, i) => (
                                            <CloudRain key={i} size={8} className="text-red-400/50" />
                                        ))}
                                    </div>
                                    <div className="absolute -top-4 text-[10px] font-bold text-red-500">ITCZ ({month})</div>
                                </motion.div>

                                {/* Trade Winds Arrows */}
                                <motion.div animate={{ y: month === 'January' ? 20 : -80 }} className="absolute w-full px-20 flex justify-between top-0 pt-10 opacity-30">
                                    <Compass className="text-blue-400 rotate-180" size={40} />
                                    <Compass className="text-blue-400 rotate-180" size={40} />
                                </motion.div>
                                <motion.div animate={{ y: month === 'January' ? 80 : -20 }} className="absolute w-full px-20 flex justify-between bottom-0 pb-10 opacity-30">
                                    <Compass className="text-blue-400" size={40} />
                                    <Compass className="text-blue-400" size={40} />
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ClimateCard = ({ title, desc, features, icon, color }: any) => (
    <div className={`bg-slate-900 p-6 rounded-3xl border ${color} hover:bg-slate-800/80 transition-all`}>
        <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">{desc}</p>
        <div className="space-y-2">
            {features.map((f: string, i: number) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                    {f}
                </div>
            ))}
        </div>
    </div>
);

const CellRow = ({ lat, type, action, color }: any) => (
    <div className="flex items-center gap-6 p-3 bg-slate-950/50 rounded-xl border border-white/5">
        <div className="w-16 text-[10px] font-mono text-slate-500">{lat}</div>
        <div className={`flex-1 font-bold ${color} text-sm`}>{type}</div>
        <div className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">{action}</div>
    </div>
);

const FeatureItem = ({ title, desc }: any) => (
    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors">
        <h5 className="font-bold text-white text-sm mb-1">{title}</h5>
        <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
    </div>
);

const HazardItem = ({ text }: { text: string }) => (
    <li className="flex gap-3 text-xs text-slate-400 items-start">
        <AlertTriangle className="text-red-500 mt-0.5 shrink-0" size={14} />
        {text}
    </li>
);

export default Climatology;
