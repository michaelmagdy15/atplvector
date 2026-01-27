import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Waves, AlertTriangle, Shield, Navigation, Sun, Info, Compass, ArrowDown, ArrowUp } from 'lucide-react';

const TropicalStorms: React.FC = () => {
    const [view, setView] = useState<'CROSS_SECTION' | 'AVOIDANCE' | 'REGIONS'>('CROSS_SECTION');

    return (
        <div className="space-y-8 p-4 md:p-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-black text-white flex items-center gap-3">
                        <Waves className="text-cyan-400" />
                        Tropical Revolving Storms (TRS)
                    </h2>
                    <p className="text-slate-400 text-sm">Structure, avoidance, and formation of Cyclones, Hurricanes, and Typhoons.</p>
                </div>

                <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-slate-800">
                    <TabButton active={view === 'CROSS_SECTION'} onClick={() => setView('CROSS_SECTION')} label="Structure" />
                    <TabButton active={view === 'AVOIDANCE'} onClick={() => setView('AVOIDANCE')} label="Avoidance" />
                    <TabButton active={view === 'REGIONS'} onClick={() => setView('REGIONS')} label="Regions" />
                </div>
            </div>

            <AnimatePresence mode="wait">
                {view === 'CROSS_SECTION' && (
                    <motion.div
                        key="structure"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-12"
                    >
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden min-h-[400px] flex items-center justify-center">
                            {/* SVG Cross Section */}
                            <svg viewBox="0 0 800 400" className="w-full h-auto drop-shadow-2xl">
                                {/* Sea surface */}
                                <rect x="0" y="380" width="800" height="20" fill="#0c4a6e" />

                                {/* Cloud walls */}
                                <motion.path
                                    d="M100,380 L150,300 C180,250 150,150 200,80 L300,80 L350,150 L350,380 Z"
                                    fill="url(#stormGradient)"
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ repeat: Infinity, duration: 3 }}
                                />
                                <motion.path
                                    d="M700,380 L650,300 C620,250 650,150 600,80 L500,80 L450,150 L450,380 Z"
                                    fill="url(#stormGradient)"
                                    animate={{ x: [0, -5, 0] }}
                                    transition={{ repeat: Infinity, duration: 3 }}
                                />

                                {/* The EYE */}
                                <rect x="350" y="50" width="100" height="330" fill="#082f49" fillOpacity="0.5" />
                                <text x="400" y="200" textAnchor="middle" fill="#7dd3fc" fontSize="24" fontWeight="bold">EYE</text>

                                {/* Descending air in eye */}
                                <motion.path
                                    d="M380,80 L400,120 L420,80"
                                    stroke="#7dd3fc"
                                    strokeWidth="3"
                                    fill="none"
                                    animate={{ y: [0, 20, 0] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                />
                                <text x="400" y="70" textAnchor="middle" fill="#7dd3fc" fontSize="12">Descending Air (Calm)</text>

                                {/* Eyewall Label */}
                                <text x="210" y="150" fill="white" fontSize="14" fontWeight="bold">Eyewall (Max Winds)</text>

                                {/* Gradients */}
                                <defs>
                                    <linearGradient id="stormGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#475569" />
                                        <stop offset="100%" stopColor="#1e293b" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800">
                                <h3 className="text-xl font-bold text-white mb-6">Storm Anatomy</h3>
                                <div className="space-y-6">
                                    <DetailItem
                                        title="The Eye"
                                        desc="Diameter 30-50km. Calm winds, descending air (adiabatic warming), and often clear skies. Lowest pressure."
                                        icon={<Sun className="text-yellow-500" />}
                                    />
                                    <DetailItem
                                        title="The Eyewall"
                                        desc="Surrounding the eye. Composed of CB clouds with maximum vertical development, highest wind speeds, and heaviest precipitation."
                                        icon={<Wind className="text-blue-400" />}
                                    />
                                    <DetailItem
                                        title="Outflow"
                                        desc="At the top (Troposphere), air spirals outwards (Anticyclonic). High Cirrus clouds often signal the approaching TRS."
                                        icon={<ArrowUp className="text-slate-400" />}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {view === 'AVOIDANCE' && (
                    <motion.div
                        key="avoidance"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                    >
                        <div className="lg:col-span-1 space-y-4">
                            <h3 className="text-xl font-bold text-white mb-2">Buys Ballot's Law in TRS</h3>
                            <p className="text-sm text-slate-400 leading-relaxed mb-6">
                                Facing the wind, the center of the storm is 90° to 135° to your right (Northern Hemisphere).
                            </p>
                            <AvoidanceCard
                                type="DANGEROUS"
                                title="Dangerous Semi-circle"
                                side="RIGHT"
                                desc="Wind speed + Forward speed of storm. Wind blows aircraft INTO the eye."
                                color="border-red-500 bg-red-500/5 text-red-400"
                            />
                            <AvoidanceCard
                                type="NAVIGABLE"
                                title="Navigable Semi-circle"
                                side="LEFT"
                                desc="Wind speed - Forward speed of storm. Wind blows aircraft AWAY from the eye."
                                color="border-emerald-500 bg-emerald-500/5 text-emerald-400"
                            />
                        </div>

                        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-12 relative flex items-center justify-center">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                                className="relative w-64 h-64 border-8 border-dashed border-blue-500/20 rounded-full flex items-center justify-center"
                            >
                                <div className="absolute top-0 right-0 w-1/2 h-full bg-red-500/10 rounded-tr-full rounded-br-full border-l border-red-500/30"></div>
                                <div className="absolute top-0 left-0 w-1/2 h-full bg-emerald-500/10 rounded-tl-full rounded-bl-full border-r border-emerald-500/30"></div>
                                <div className="w-16 h-16 bg-white rounded-full shadow-[0_0_30px_rgba(255,255,255,0.5)] flex items-center justify-center">
                                    <span className="text-black font-black">LOW</span>
                                </div>
                            </motion.div>

                            {/* Path Arrow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[150px] flex flex-col items-center gap-2">
                                <ArrowUp className="text-yellow-500 animate-bounce" size={40} />
                                <span className="text-xs font-bold text-yellow-500 uppercase tracking-widest">Line of Advance</span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {view === 'REGIONS' && (
                    <motion.div
                        key="regions"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        <RegionCard name="Hurricane" location="Atlantic / NE Pacific" season="June - Nov" icon="H" color="text-red-400" />
                        <RegionCard name="Typhoon" location="NW Pacific (Asia)" season="July - Oct" icon="T" color="text-blue-400" />
                        <RegionCard name="Cyclone" location="Indian Ocean / SW Pacific" season="Oct - May" icon="C" color="text-emerald-400" />
                        <RegionCard name="Willy-Willy" location="NW Australia" season="Dec - April" icon="W" color="text-orange-400" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const TabButton = ({ active, onClick, label }: any) => (
    <button
        onClick={onClick}
        className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${active ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
    >
        {label}
    </button>
);

const DetailItem = ({ title, desc, icon }: any) => (
    <div className="flex gap-4 items-start">
        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 shrink-0">
            {icon}
        </div>
        <div>
            <h4 className="font-bold text-white mb-1">{title}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
        </div>
    </div>
);

const AvoidanceCard = ({ title, side, desc, color }: any) => (
    <div className={`p-6 rounded-2xl border-l-4 ${color}`}>
        <div className="flex justify-between items-center mb-2">
            <h4 className="font-bold text-sm uppercase">{title}</h4>
            <Shield size={16} />
        </div>
        <p className="text-[11px] leading-relaxed opacity-80">{desc}</p>
        <div className="mt-2 text-[10px] font-mono font-bold">{side} SIDE of path</div>
    </div>
);

const RegionCard = ({ name, location, season, icon, color }: any) => (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center flex flex-col items-center">
        <div className={`w-12 h-12 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-xl font-black mb-4 ${color}`}>
            {icon}
        </div>
        <h4 className="font-bold text-white mb-1">{name}</h4>
        <p className="text-[10px] text-slate-500 uppercase font-bold mb-3">{location}</p>
        <div className="mt-auto pt-4 border-t border-slate-800 w-full">
            <span className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                <Info size={10} /> {season}
            </span>
        </div>
    </div>
);

export default TropicalStorms;
