import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Thermometer, Map, Globe, Info, AlertTriangle, Layers } from 'lucide-react';

interface JetStreamData {
    name: string;
    altitude: string;
    latitudeNH: string;
    latitudeSH: string;
    speed: string;
    description: string;
    catRisk: string;
    color: string;
}

const jetStreams: JetStreamData[] = [
    {
        name: "Subtropical Jet Stream",
        altitude: "FL400 (12km)",
        latitudeNH: "25°N - 40°N",
        latitudeSH: "35°S - 45°S",
        speed: "Up to 300 kts",
        description: "Permanent features moving slightly with seasons. Found in the area of subtropical anticyclones.",
        catRisk: "Moderate, found in the upper levels.",
        color: "text-orange-400"
    },
    {
        name: "Polar Front Jet Stream",
        altitude: "FL300 (9km)",
        latitudeNH: "40°N - 60°N",
        latitudeSH: "40°S - 50°S",
        speed: "Up to 150 kts",
        description: "Associated with Polar Front Depressions. Highly variable in position.",
        catRisk: "High, especially near the tropopause break on the cold side.",
        color: "text-blue-400"
    },
    {
        name: "Arctic Jet Stream",
        altitude: "FL200 - FL250",
        latitudeNH: "55°N (Winter)",
        latitudeSH: "N/A",
        speed: "75 - 100 kts",
        description: "Winter feature affecting Canada and Siberia. Lower altitude due to cold air.",
        catRisk: "Moderate to strong vertical shear.",
        color: "text-cyan-400"
    },
    {
        name: "Equatorial Easterly Jet",
        altitude: "FL450",
        latitudeNH: "5°N - 20°N (Summer)",
        latitudeSH: "N/A",
        speed: "25 - 70 kts",
        description: "Summer feature flowing from the Bay of Bengal towards Ethiopia.",
        catRisk: "Associated with intense convection/thunderstorms.",
        color: "text-yellow-400"
    }
];

const JetStreams: React.FC = () => {
    const [selectedJet, setSelectedJet] = useState<number>(0);
    const [season, setSeason] = useState<'Winter' | 'Summer'>('Winter');

    const activeJet = jetStreams[selectedJet];

    // Simple altitude calculation for labels
    const getAltitudeY = (altStr: string) => {
        if (altStr.includes("FL450")) return "20%";
        if (altStr.includes("FL400")) return "30%";
        if (altStr.includes("FL300")) return "50%";
        if (altStr.includes("FL200")) return "70%";
        return "50%";
    };

    return (
        <div className="space-y-8 p-4 md:p-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                <div>
                    <h2 className="text-3xl font-black text-white flex items-center gap-3">
                        <Wind className="text-blue-400 animate-pulse" />
                        Jet Streams
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">High-altitude wind systems and clear air turbulence.</p>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
                    {(['Winter', 'Summer'] as const).map((s) => (
                        <button
                            key={s}
                            onClick={() => setSeason(s)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${season === s
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'text-slate-500 hover:text-white'
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Selector List */}
                <div className="space-y-3">
                    {jetStreams.map((jet, idx) => (
                        <button
                            key={jet.name}
                            onClick={() => setSelectedJet(idx)}
                            className={`w-full p-4 rounded-2xl border text-left transition-all relative overflow-hidden group ${selectedJet === idx
                                    ? 'bg-slate-800 border-blue-500 ring-1 ring-blue-500/50'
                                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                                }`}
                        >
                            <div className={`flex items-center gap-3 ${selectedJet === idx ? activeJet.color : 'text-slate-400'}`}>
                                <Layers size={18} />
                                <span className="font-bold">{jet.name}</span>
                            </div>
                            <div className="mt-1 text-xs text-slate-500 font-mono">
                                {jet.altitude} • {jet.speed}
                            </div>
                            {selectedJet === idx && (
                                <motion.div
                                    layoutId="active-indicator"
                                    className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"
                                />
                            )}
                        </button>
                    ))}

                    <div className="p-4 bg-slate-900/50 border border-slate-800 border-dashed rounded-2xl mt-6">
                        <div className="flex items-start gap-3">
                            <Info className="text-blue-400 shrink-0 mt-1" size={16} />
                            <div className="text-xs text-slate-500 leading-relaxed">
                                <span className="font-bold text-slate-400">Key Fact:</span> Jet streams occur where the tropopause changes height in steps. They flow from <span className="text-slate-300">West to East</span> (except the Equatorial Easterly).
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed View */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Visual Diagram */}
                    <div className="bg-slate-950 border border-slate-800 rounded-3xl h-80 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                            <div className="h-full w-full bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]" />
                        </div>

                        {/* Scale */}
                        <div className="absolute left-4 top-4 bottom-4 flex flex-col justify-between text-[10px] font-mono text-slate-600 border-r border-slate-900 pr-2">
                            <span>60,000 ft</span>
                            <span>45,000 ft</span>
                            <span>30,000 ft</span>
                            <span>15,000 ft</span>
                            <span>Surface</span>
                        </div>

                        {/* Tropopause Line (Simplified) */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            <path
                                d="M 50 100 Q 200 80 400 120 T 800 150"
                                fill="none"
                                stroke="#1e293b"
                                strokeWidth="2"
                                strokeDasharray="5 5"
                            />
                        </svg>

                        {/* Jet Core Visualizer */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeJet.name + season}
                                initial={{ opacity: 0, scale: 0.9, x: -20 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 1.1, x: 20 }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <div className="relative w-full h-full flex items-center justify-center">
                                    {/* The Jet 'Tunnel' */}
                                    <div className="absolute flex items-center gap-1 opacity-20">
                                        {[...Array(20)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                animate={{ x: [0, 40] }}
                                                transition={{ repeat: Infinity, duration: 1, ease: "linear", delay: i * 0.05 }}
                                                className="h-1 w-8 bg-blue-500 rounded-full"
                                            />
                                        ))}
                                    </div>

                                    {/* Jet Core */}
                                    <div
                                        className="relative transition-all duration-700"
                                        style={{ top: getAltitudeY(activeJet.altitude) }}
                                    >
                                        <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30 blur-sm animate-pulse" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Wind className="text-blue-400" size={32} />
                                        </div>

                                        {/* Core Label */}
                                        <div className="absolute top-16 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/80 backdrop-blur px-2 py-1 rounded border border-white/10 text-[10px] font-bold text-white shadow-xl">
                                            CORE: {activeJet.speed}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Legend */}
                        <div className="absolute bottom-4 right-4 text-[10px] text-slate-500 space-y-1 bg-slate-900/40 p-2 rounded">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500" />
                                <span>Max Wind Velocity</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-0.5 border-t border-dashed border-slate-700 block" />
                                <span>Tropopause Level</span>
                            </div>
                        </div>
                    </div>

                    {/* Data Sheets */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Map size={14} /> Global Position
                            </h4>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-[10px] text-slate-500 mb-1">N. Hemisphere</div>
                                    <div className="text-lg font-bold text-white">{activeJet.latitudeNH}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-slate-500 mb-1">S. Hemisphere</div>
                                    <div className="text-lg font-bold text-white">{activeJet.latitudeSH}</div>
                                </div>
                                <div className="pt-2 border-t border-slate-800">
                                    <p className="text-xs text-slate-400 leading-relaxed italic">
                                        {season === 'Winter'
                                            ? "In winter, jets move toward the equator and increase in speed."
                                            : "In summer, jets move toward the poles and decrease in speed."}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl border-l-orange-500/50">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <AlertTriangle size={14} className="text-orange-400" /> Hazard Matrix
                            </h4>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-[10px] text-orange-500 uppercase font-bold mb-1">CAT Association</div>
                                    <div className="text-sm text-slate-300 leading-relaxed font-medium">
                                        {activeJet.catRisk}
                                    </div>
                                </div>
                                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-2">CAT Location Rule</div>
                                    <p className="text-[11px] text-slate-400">
                                        Found on the <span className="text-red-400 font-bold">Cold Side</span> (Polar side) of the jet core, from core level down to 7,000 ft below tropopause.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pro Tip/Note */}
                    <div className="bg-blue-600/10 border border-blue-500/20 p-6 rounded-3xl">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shrink-0">
                                <Globe className="text-white" size={20} />
                            </div>
                            <div>
                                <h5 className="font-bold text-white text-sm mb-1">{activeJet.name} Characteristics</h5>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    {activeJet.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JetStreams;
