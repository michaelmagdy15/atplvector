import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Eye, Cloud, Info, Maximize2, Layers, Search, Wind, Droplets } from 'lucide-react';

const SatelliteRadar: React.FC = () => {
    const [mode, setMode] = useState<'SATELLITE' | 'RADAR'>('SATELLITE');
    const [satType, setSatType] = useState<'VIS' | 'IR' | 'WV'>('IR');

    return (
        <div className="space-y-8 p-4 md:p-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-black text-white flex items-center gap-3">
                        <Radio className="text-blue-400" />
                        Remote Sensing
                    </h2>
                    <p className="text-slate-400 text-sm">Interpreting Satellite imagery and Ground-based Weather Radar.</p>
                </div>

                <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-slate-800">
                    <TabButton active={mode === 'SATELLITE'} onClick={() => setMode('SATELLITE')} label="Satellite Imagery" />
                    <TabButton active={mode === 'RADAR'} onClick={() => setMode('RADAR')} label="Meteorological Radar" />
                </div>
            </div>

            <AnimatePresence mode="wait">
                {mode === 'SATELLITE' && (
                    <motion.div
                        key="sat"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-8"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            <SatTypeCard
                                type="VIS"
                                active={satType === 'VIS'}
                                onClick={() => setSatType('VIS')}
                                title="Visible (VIS)"
                                desc="Measures reflected sunlight (Albedo). High resolution."
                            />
                            <SatTypeCard
                                type="IR"
                                active={satType === 'IR'}
                                onClick={() => setSatType('IR')}
                                title="Infrared (IR)"
                                desc="Measures cloud top temperature. Available 24/7."
                            />
                            <SatTypeCard
                                type="WV"
                                active={satType === 'WV'}
                                onClick={() => setSatType('WV')}
                                title="Water Vapor (WV)"
                                desc="Measures moisture in the upper troposphere."
                            />
                            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col justify-center">
                                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Key Fact</h4>
                                <p className="text-xs text-slate-400 italic">Visible imagery is NOT available at night. IR is used for 24h monitoring.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden min-h-[400px]">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Layers className="text-blue-400" />
                                    Imagery Analysis ({satType})
                                </h3>

                                {/* Simulated Image Container */}
                                <div className={`w-full aspect-video rounded-2xl border border-white/5 overflow-hidden relative shadow-2xl ${satType === 'VIS' ? 'bg-slate-600' : satType === 'IR' ? 'bg-slate-800' : 'bg-blue-900/30'
                                    }`}>
                                    {/* Procedural Cloud Blobs */}
                                    <CloudBlob top="20%" left="10%" size="40%" opacity={0.3} blur="40px" pulse />
                                    <CloudBlob top="40%" left="50%" size="30%" opacity={0.5} blur="30px" />
                                    <CloudBlob top="10%" left="60%" size="25%" opacity={0.2} blur="50px" />

                                    {/* Overlay Labels */}
                                    <AnalysisLabel top="45%" left="55%" text="Convective Cell" />
                                    <AnalysisLabel top="25%" left="25%" text="Cirrus Shield" />
                                </div>

                                <div className="mt-6 flex gap-4">
                                    <LegendItem satType={satType} value="WHITE" desc={satType === 'VIS' ? "Thick Cloud (Reflective)" : "High/Cold Cloud (Cold)"} />
                                    <LegendItem satType={satType} value="BLACK" desc={satType === 'VIS' ? "Sea/Land (Absorptive)" : "Low/Warm Cloud or Surface"} />
                                </div>
                            </div>

                            <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800">
                                <h3 className="text-xl font-bold text-white mb-6">Interpretation Guide</h3>
                                <div className="space-y-6">
                                    <GuideRow
                                        title="Frontal Bands"
                                        desc="Elongated, curved cloud bands spanning thousands of miles."
                                        tip="Easy to spot in IR as distinct temperature boundaries."
                                    />
                                    <GuideRow
                                        title="Jet Stream Cirrus"
                                        desc="Fibrous, thin cloud on the 'warm' side of the jet core."
                                        tip="Often aligns with the PFJ (Polar Front Jet)."
                                    />
                                    <GuideRow
                                        title="Fog/Stratus"
                                        desc="Smooth, flat-looking grey areas on imagery."
                                        tip="May be invisible on IR if their temp matches the ground."
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {mode === 'RADAR' && (
                    <motion.div
                        key="radar"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                    >
                        <div className="lg:col-span-1 bg-slate-950 p-8 rounded-3xl border border-slate-800">
                            <h3 className="text-xl font-bold text-white mb-6">Radar Principles</h3>
                            <div className="space-y-6">
                                <PrincipleCard
                                    title="Reflectivity"
                                    desc="Measures backscatter from raindrops/hail. Strength is proportional to D^6 (drop diameter)."
                                    icon={<Search className="text-emerald-400" />}
                                />
                                <PrincipleCard
                                    title="Attenuation"
                                    desc="The signal is absorbed/scattered by intervening heavy rain, hiding storms behind it."
                                    icon={<Radio className="text-red-400" />}
                                />
                                <PrincipleCard
                                    title="Doppler Effect"
                                    desc="Measures wind velocity towards/away from radar. Detects rotation (tornadoes)."
                                    icon={<Wind className="text-blue-400" />}
                                />
                            </div>
                        </div>

                        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
                            {/* Scanning Animation */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                                className="absolute w-[400px] h-[400px] bg-gradient-to-tr from-emerald-500/20 to-transparent rounded-full"
                                style={{ transformOrigin: 'center center' }}
                            />

                            <div className="relative w-80 h-80 border-2 border-emerald-500/20 rounded-full flex items-center justify-center">
                                {/* Grid Lines */}
                                <div className="absolute inset-0 border border-emerald-500/10 rounded-full scale-75" />
                                <div className="absolute inset-0 border border-emerald-500/10 rounded-full scale-50" />

                                {/* Simulated Echoes */}
                                <RadarEcho top="30%" left="40%" color="bg-red-500" intensity="EXTREME" />
                                <RadarEcho top="50%" left="60%" color="bg-orange-500" intensity="MOD" />
                                <RadarEcho top="45%" left="35%" color="bg-yellow-500" intensity="LIGHT" />

                                <span className="text-emerald-500 text-[10px] uppercase font-bold tracking-tighter">Airport Center</span>
                            </div>

                            <div className="mt-8 flex gap-6">
                                <IntensityIndicator color="bg-emerald-500" label="Light" />
                                <IntensityIndicator color="bg-yellow-500" label="Mod" />
                                <IntensityIndicator color="bg-red-500" label="Severe" />
                                <IntensityIndicator color="bg-purple-500" label="Hail" />
                            </div>
                        </div>
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

const SatTypeCard = ({ type, active, onClick, title, desc }: any) => (
    <button
        onClick={onClick}
        className={`p-4 rounded-2xl border text-left transition-all ${active ? 'bg-blue-600 border-blue-500' : 'bg-slate-900 border-slate-800 hover:bg-slate-800'}`}
    >
        <h4 className={`text-sm font-bold mb-1 ${active ? 'text-white' : 'text-slate-300'}`}>{title}</h4>
        <p className={`text-[11px] leading-tight ${active ? 'text-blue-100' : 'text-slate-500'}`}>{desc}</p>
    </button>
);

const CloudBlob = ({ top, left, size, opacity, blur, pulse = false }: any) => (
    <motion.div
        animate={pulse ? { scale: [1, 1.05, 1], opacity: [opacity, opacity + 0.1, opacity] } : {}}
        transition={{ repeat: Infinity, duration: 5 }}
        className="absolute rounded-full bg-white"
        style={{ top, left, width: size, height: size, opacity, filter: `blur(${blur})` }}
    />
);

const AnalysisLabel = ({ top, left, text }: any) => (
    <div className="absolute flex flex-col items-center gap-1" style={{ top, left }}>
        <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,1)]" />
        <span className="text-[10px] font-black text-white bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm whitespace-nowrap">{text}</span>
    </div>
);

const LegendItem = ({ value, desc }: any) => (
    <div className="flex gap-2 items-center">
        <div className={`w-3 h-3 rounded-full ${value === 'WHITE' ? 'bg-white' : 'bg-black border border-slate-700'}`} />
        <span className="text-[10px] text-slate-400">{desc}</span>
    </div>
);

const GuideRow = ({ title, desc, tip }: any) => (
    <div className="space-y-1">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Maximize2 size={12} className="text-blue-500" />
            {title}
        </h4>
        <p className="text-xs text-slate-400">{desc}</p>
        <p className="text-[10px] text-blue-400 italic">Pro Tip: {tip}</p>
    </div>
);

const PrincipleCard = ({ title, desc, icon }: any) => (
    <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-slate-950 rounded-lg">{icon}</div>
            <h4 className="font-bold text-white text-sm">{title}</h4>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">{desc}</p>
    </div>
);

const RadarEcho = ({ top, left, color, intensity }: any) => (
    <motion.div
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className={`absolute rounded-full blur-md flex items-center justify-center ${color}`}
        style={{ top, left, width: '40px', height: '30px' }}
    >
        <span className="text-[8px] font-black text-white scale-75">{intensity}</span>
    </motion.div>
);

const IntensityIndicator = ({ color, label }: any) => (
    <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${color}`} />
        <span className="text-[10px] text-slate-500 font-bold uppercase">{label}</span>
    </div>
);

export default SatelliteRadar;
