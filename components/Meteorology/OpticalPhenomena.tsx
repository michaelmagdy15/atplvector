
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Cloud, CloudRain, Droplets, Info, Eye } from 'lucide-react';

const OpticalPhenomena: React.FC = () => {
    const [view, setView] = useState<'RAINBOW' | 'HALO' | 'MIRAGE'>('RAINBOW');

    return (
        <div className="space-y-8 p-4 md:p-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-black text-white flex items-center gap-3">
                        <Eye className="text-purple-400" />
                        Optical Phenomena
                    </h2>
                    <p className="text-slate-400 text-sm">Light refraction, reflection, and diffraction in the atmosphere.</p>
                </div>

                <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-slate-800">
                    <TabButton active={view === 'RAINBOW'} onClick={() => setView('RAINBOW')} label="Rainbows" />
                    <TabButton active={view === 'HALO'} onClick={() => setView('HALO')} label="Halos & Coronas" />
                    <TabButton active={view === 'MIRAGE'} onClick={() => setView('MIRAGE')} label="Mirages" />
                </div>
            </div>

            <AnimatePresence mode="wait">
                {view === 'RAINBOW' && (
                    <motion.div
                        key="rainbow"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                    >
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden min-h-[400px] flex flex-col items-center justify-center">
                            {/* Rainbow Visualization */}
                            <div className="relative w-full h-full flex items-center justify-center">
                                {/* Sun rays */}
                                <div className="absolute top-10 left-0 w-32 h-1 bg-yellow-400/50 rotate-12 blur-sm"></div>
                                <div className="absolute top-14 left-0 w-32 h-1 bg-yellow-400/50 rotate-12 blur-sm"></div>

                                {/* Droplet */}
                                <div className="relative w-32 h-32 rounded-full bg-blue-400/20 border border-blue-400/50 backdrop-blur-sm shadow-[0_0_20px_rgba(59,130,246,0.5)] z-10 flex items-center justify-center">
                                    <span className="text-[10px] text-blue-200">H₂O Droplet</span>
                                </div>

                                {/* Refraction Paths */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                    {/* Incident Light */}
                                    <line x1="10%" y1="20%" x2="50%" y2="50%" stroke="white" strokeWidth="2" strokeDasharray="5 5" />

                                    {/* Refracted/Reflected Light (Red) */}
                                    <path d="M 50% 50% L 80% 60% L 30% 90%" fill="none" stroke="red" strokeWidth="2" />
                                    <text x="75%" y="65%" fill="red" fontSize="10">42°</text>

                                    {/* Refracted/Reflected Light (Violet) */}
                                    <path d="M 50% 50% L 82% 58% L 32% 88%" fill="none" stroke="violet" strokeWidth="2" />
                                    <text x="78%" y="55%" fill="violet" fontSize="10">40°</text>
                                </svg>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                                <h3 className="text-xl font-bold text-white mb-4">Physics of Rainbows</h3>
                                <ul className="space-y-3">
                                    <FactRow label="Condition" value="Sun behind observer, rain in front" />
                                    <FactRow label="Process" value="Refraction -> Reflection -> Refraction" />
                                    <FactRow label="Primary Bow" value="Red outside (42°), Violet inside (40°)" />
                                    <FactRow label="Secondary Bow" value="Double reflection. Colors reversed (Red inside). Fainter." />
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                )}

                {view === 'HALO' && (
                    <motion.div
                        key="halo"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                    >
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative flex flex-col items-center">
                            <h3 className="text-xl font-bold text-white mb-6">22° Halo (Ice Crystals)</h3>
                            <div className="relative w-64 h-64 flex items-center justify-center">
                                <Sun className="text-yellow-100 absolute" size={48} />
                                <div className="w-full h-full rounded-full border-[12px] border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.2)]"></div>
                                <span className="absolute top-0 text-xs text-slate-400">22° Radius</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    Halo vs Corona
                                </h3>
                                <div className="space-y-4">
                                    <ComparisonCard
                                        title="Halo"
                                        cause="Refraction through ICE crystals (Cirrostratus)"
                                        appearance="Ring at 22° (or 46°) from Sun/Moon. Red inside."
                                        icon={<Cloud className="text-cyan-400" />}
                                    />
                                    <ComparisonCard
                                        title="Corona"
                                        cause="Diffraction by WATER droplets (Altostratus)"
                                        appearance="Small colored rings touching Sun/Moon. Blue inside, Red outside."
                                        icon={<Droplets className="text-blue-400" />}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {view === 'MIRAGE' && (
                    <motion.div
                        key="mirage"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-900 border border-slate-800 rounded-3xl p-8"
                    >
                        <h3 className="text-xl font-bold text-white mb-4">Mirages</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800">
                                <h4 className="font-bold text-lg text-red-400 mb-2">Inferior Mirage (Desert/Tarmac)</h4>
                                <p className="text-sm text-slate-400 mb-4">Surface is MUCH hotter than air. Light bends upward.</p>
                                <div className="h-24 bg-gradient-to-t from-orange-500/20 to-transparent rounded-lg flex items-end justify-center relative overflow-hidden">
                                    <span className="text-xs font-bold text-orange-500 mb-2">HOT SURFACE</span>
                                    {/* Simple ray bend visualization could go here */}
                                </div>
                                <p className="text-xs text-slate-500 mt-2">"Puddles" on runway.</p>
                            </div>

                            <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800">
                                <h4 className="font-bold text-lg text-blue-400 mb-2">Superior Mirage (Polar)</h4>
                                <p className="text-sm text-slate-400 mb-4">Surface is MUCH colder than air (Inversion). Light bends downward.</p>
                                <div className="h-24 bg-gradient-to-t from-blue-500/20 to-transparent rounded-lg flex items-end justify-center relative overflow-hidden">
                                    <span className="text-xs font-bold text-blue-500 mb-2">COLD SURFACE</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-2">Objects appear higher (looming).</p>
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
        className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${active ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
    >
        {label}
    </button>
);

const FactRow = ({ label, value }: any) => (
    <div className="flex justify-between items-center bg-slate-900 p-3 rounded-lg">
        <span className="text-[11px] font-bold text-slate-400 uppercase">{label}</span>
        <span className="text-xs font-bold text-white text-right">{value}</span>
    </div>
);

const ComparisonCard = ({ title, cause, appearance, icon }: any) => (
    <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-slate-950 rounded-lg">{icon}</div>
            <h4 className="font-bold text-white">{title}</h4>
        </div>
        <div className="space-y-1">
            <p className="text-xs text-slate-400"><strong className="text-slate-500 uppercase text-[10px]">Cause:</strong> {cause}</p>
            <p className="text-xs text-slate-400"><strong className="text-slate-500 uppercase text-[10px]">Appearance:</strong> {appearance}</p>
        </div>
    </div>
);

export default OpticalPhenomena;
