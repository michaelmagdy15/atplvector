import React, { useState } from 'react';
import { CloudRain, Snowflake, AlertOctagon, Info, Cloud, Droplets } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Precipitation: React.FC = () => {
    const [precipType, setPrecipType] = useState<'rain' | 'snow' | 'hail' | 'drizzle' | 'freezing_rain'>('rain');

    const content = {
        rain: {
            title: "Rain (+RA)",
            desc: "Water drops larger than 0.5mm. Produced by Nimbostratus (continuous) or Cumulonimbus (showers).",
            process: "coalescence",
            processTitle: "Collision-Coalescence",
            icon: CloudRain,
            color: "blue"
        },
        drizzle: {
            title: "Drizzle (DZ)",
            desc: "Very small water drops (<0.5mm) that settle slowly. Unlike rain, drizzle falls from Stratus clouds.",
            process: "coalescence_small",
            processTitle: "Collision-Coalescence (Low Level)",
            icon: Droplets,
            color: "sky"
        },
        snow: {
            title: "Snow (SN)",
            desc: "Ice crystals that remain frozen from cloud to ground. Occurs when temperature is <0°C throughout.",
            process: "bergeron",
            processTitle: "Bergeron-Findeisen Process",
            icon: Snowflake,
            color: "white"
        },
        freezing_rain: {
            title: "Freezing Rain (FZRA)",
            desc: "Supercooled rain that freezes instantly upon impact. Rain falls through a sub-zero layer near the ground.",
            process: "freezing_rain",
            processTitle: "Supercooled Droplets",
            icon: Snowflake,
            color: "cyan"
        },
        hail: {
            title: "Hail (GR)",
            desc: "Solid balls of ice >5mm. Only formed in Cumulonimbus (CB) clouds with strong updrafts.",
            process: "accretion",
            processTitle: "Accretion in Updrafts",
            icon: AlertOctagon,
            color: "teal"
        }
    };

    const currentInfo = content[precipType];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 flex flex-col gap-8">
            <div className="max-w-6xl mx-auto w-full">
                <header className="mb-8">
                    <h1 className="text-3xl font-black text-white flex items-center gap-3 mb-4">
                        <CloudRain className="text-blue-500" /> Precipitation Types
                    </h1>
                    <div className="flex flex-wrap gap-2">
                        {(Object.keys(content) as Array<keyof typeof content>).map((t) => (
                            <button
                                key={t}
                                onClick={() => setPrecipType(t)}
                                className={`px-4 py-2 rounded-lg font-bold transition-all text-sm uppercase tracking-wide border ${precipType === t
                                    ? 'bg-blue-600 border-blue-400 text-white shadow-lg scale-105'
                                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                {t.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* VISUALIZATION PANEL */}
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={precipType}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="w-full h-full flex flex-col items-center"
                            >
                                <div className={`p-4 rounded-full bg-${currentInfo.color}-500/10 mb-6`}>
                                    <currentInfo.icon className={`text-${currentInfo.color}-400 w-16 h-16`} />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">{currentInfo.title}</h2>
                                <p className="text-center text-slate-400 max-w-sm mb-8">{currentInfo.desc}</p>

                                {/* Simple SVG Diagram */}
                                <div className="w-full max-w-md aspect-video bg-slate-950 rounded-xl border border-slate-800 relative overflow-hidden">
                                    <SimpleDiagram type={precipType} />
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* THEORY PANEL */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <Info className="text-blue-400" />
                            <h3 className="text-xl font-bold text-white">Formation Mechanics</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                                <h4 className="text-sm font-bold text-slate-400 uppercase mb-2">Process: {currentInfo.processTitle}</h4>
                                <p className="text-slate-300 leading-relaxed">
                                    {precipType === 'rain' && "Large cloud droplets fall faster than smaller ones, colliding and merging (coalescence) to become raindrops. In cold clouds, ice crystals fall into warmer air and melt."}
                                    {precipType === 'drizzle' && "Occurs in stable Stratus clouds. Weak updrafts prevent droplets from growing large. They fall slowly and evaporate easily."}
                                    {precipType === 'snow' && "Water vapor deposits directly onto ice crystals (Sublimation/Deposition). The crystals grow large enough to fall without passing through a melting layer."}
                                    {precipType === 'freezing_rain' && "Snow falls into a warm layer (+2°C) and melts completely. It then continues falling into a sub-zero layer near the surface, becoming supercooled liquid that freezes on contact."}
                                    {precipType === 'hail' && "Vertical currents in a thunderstorm cycle pellets up and down. They gather layers of supercooled water which freezes instantly (opaque) or slowly (clear)."}
                                </p>
                            </div>

                            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex items-center gap-4">
                                <Cloud className="text-slate-500 w-10 h-10" />
                                <div>
                                    <h4 className="text-sm font-bold text-slate-400 uppercase">Associated Cloud</h4>
                                    <p className="text-white font-bold text-lg">
                                        {precipType === 'hail' ? 'Cumulonimbus (CB)' : precipType === 'drizzle' ? 'Stratus (ST)' : 'Nimbostratus (NS)'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Simple Diagram Components
const SimpleDiagram = ({ type }: { type: string }) => {
    return (
        <svg viewBox="0 0 400 250" className="w-full h-full">
            {/* Background Atmosphere */}
            <rect width="100%" height="100%" fill="#0f172a" />

            {/* Cloud Layer */}
            <path d="M50 60 Q80 20 120 40 Q150 10 200 40 Q250 20 280 60 L320 60 L50 60" fill="#334155" opacity="0.8" />

            {/* Rain Visualization */}
            {type === 'rain' && (
                <g>
                    <line x1="100" y1="60" x2="100" y2="200" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" className="animate-dash" />
                    <line x1="150" y1="60" x2="150" y2="200" stroke="#3b82f6" strokeWidth="2" strokeDasharray="8,8" className="animate-dash" />
                    <line x1="200" y1="60" x2="200" y2="200" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" className="animate-dash" />
                    <text x="20" y="230" fill="#3b82f6" fontSize="12">+ Temp &gt; 0°C</text>
                </g>
            )}

            {/* Snow Visualization */}
            {type === 'snow' && (
                <g>
                    <text x="100" y="100" fill="white" fontSize="20" className="animate-fall decoration-white">*</text>
                    <text x="150" y="140" fill="white" fontSize="20" className="animate-fall-delayed">*</text>
                    <text x="200" y="120" fill="white" fontSize="20" className="animate-fall">*</text>
                    <rect x="0" y="0" width="400" height="250" fill="transparent" stroke="white" strokeOpacity="0.1" />
                    <text x="20" y="230" fill="white" fontSize="12">- Temp &lt; 0°C</text>
                </g>
            )}

            {/* Freezing Rain Visualization */}
            {type === 'freezing_rain' && (
                <g>
                    {/* Warm Layer */}
                    <rect x="0" y="80" width="400" height="80" fill="#ef4444" opacity="0.2" />
                    <text x="300" y="120" fill="#fca5a5" fontSize="10">Warm Layer (+)</text>

                    {/* Freezing Layer */}
                    <rect x="0" y="160" width="400" height="90" fill="#3b82f6" opacity="0.2" />
                    <text x="300" y="200" fill="#93c5fd" fontSize="10">Freezing Layer (-)</text>

                    {/* Particle Path */}
                    <path d="M120 60 L120 100" stroke="white" strokeWidth="2" strokeDasharray="2,2" /> {/* Snow */}
                    <path d="M120 100 L120 160" stroke="#3b82f6" strokeWidth="2" /> {/* Rain */}
                    <path d="M120 160 L120 220" stroke="#a5f3fc" strokeWidth="2" /> {/* Supercooled */}

                    <circle cx="120" cy="230" r="5" fill="#a5f3fc" /> {/* Ice on ground */}
                </g>
            )}

            {/* Hail Visualization */}
            {type === 'hail' && (
                <g>
                    {/* Updraft Arrows */}
                    <path d="M250 200 L250 50" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrow)" strokeDasharray="4,4" />
                    <text x="260" y="150" fill="#ef4444" fontSize="10">Updraft</text>

                    {/* Cycle */}
                    <circle cx="200" cy="100" r="10" fill="none" stroke="white" strokeWidth="2" />
                    <circle cx="200" cy="100" r="14" fill="none" stroke="white" strokeWidth="1" opacity="0.5" />
                    <path d="M200 100 Q150 50 200 50 T250 100 T200 150" fill="none" stroke="white" strokeDasharray="3,3" />
                </g>
            )}

            {/* Drizzle Visualization */}
            {type === 'drizzle' && (
                <g>
                    <circle cx="100" cy="100" r="1" fill="#7dd3fc" />
                    <circle cx="120" cy="130" r="1" fill="#7dd3fc" />
                    <circle cx="140" cy="110" r="1" fill="#7dd3fc" />
                    <circle cx="160" cy="150" r="1" fill="#7dd3fc" />
                    <circle cx="180" cy="120" r="1" fill="#7dd3fc" />
                    <text x="20" y="230" fill="#7dd3fc" fontSize="12">Mist / Low Viz</text>
                </g>
            )}
        </svg>
    );
};

export default Precipitation;
