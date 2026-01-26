import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudRain, CloudLightning, Sun, Thermometer, Wind, Droplets } from 'lucide-react';

const FrontalSystems: React.FC = () => {
    const [frontType, setFrontType] = useState<'cold' | 'warm' | 'occluded'>('cold');

    // Animation variants for transitions
    const canvasVariants = {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
        exit: { opacity: 0, scale: 1.05 }
    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h2 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3">
                        <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
                            <CloudLightning className="text-indigo-400" size={32} />
                        </div>
                        Frontal Systems
                    </h2>
                    <p className="text-slate-400 mt-3 max-w-2xl text-lg font-light leading-relaxed">
                        Visualize the dynamic boundaries between air masses. Toggle between front types to observe lifting mechanisms, cloud formation, and weather phenomena.
                    </p>
                </div>

                {/* Premium Tab Selector */}
                <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md shadow-2xl">
                    {[
                        { id: 'cold', label: 'Cold Front', activeColor: 'bg-blue-600', textColor: 'text-blue-100' },
                        { id: 'warm', label: 'Warm Front', activeColor: 'bg-red-600', textColor: 'text-red-100' },
                        { id: 'occluded', label: 'Occluded', activeColor: 'bg-purple-600', textColor: 'text-purple-100' }
                    ].map((f) => (
                        <button
                            key={f.id}
                            onClick={() => setFrontType(f.id as any)}
                            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 relative overflow-hidden ${frontType === f.id
                                    ? `${f.activeColor} ${f.textColor} shadow-lg shadow-${f.id === 'cold' ? 'blue' : f.id === 'warm' ? 'red' : 'purple'}-900/50`
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <span className="relative z-10">{f.label}</span>
                        </button>
                    ))}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Visualization Pane with Glassmorphism */}
                <div className="lg:h-[500px] h-[400px] bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-[2.5rem] p-1 border border-white/5 relative shadow-2xl overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 mix-blend-overlay"></div>

                    {/* Inner Canvas */}
                    <div className="w-full h-full rounded-[2.2rem] bg-slate-950/50 relative overflow-hidden">
                        {/* Sky Background Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-indigo-950/30 to-slate-900"></div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={frontType}
                                variants={canvasVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="w-full h-full relative"
                            >
                                <svg viewBox="0 0 800 500" className="w-full h-full preserve-3d">
                                    <defs>
                                        <linearGradient id="coldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.4" />
                                            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.9" />
                                        </linearGradient>
                                        <linearGradient id="warmGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
                                            <stop offset="100%" stopColor="#e11d48" stopOpacity="0.3" />
                                        </linearGradient>
                                        <filter id="glow">
                                            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                                            <feMerge>
                                                <feMergeNode in="coloredBlur" />
                                                <feMergeNode in="SourceGraphic" />
                                            </feMerge>
                                        </filter>
                                        <filter id="cloudBlur">
                                            <feGaussianBlur stdDeviation="3" />
                                        </filter>
                                    </defs>

                                    {/* Ground */}
                                    <path d="M0 450 L800 450 L800 500 L0 500 Z" fill="#1e293b" />
                                    <line x1="0" y1="450" x2="800" y2="450" stroke="#334155" strokeWidth="2" />

                                    {/* --- SCENARIO: COLD FRONT --- */}
                                    {frontType === 'cold' && (
                                        <g>
                                            {/* Warm Air (Passive) */}
                                            <path d="M300 450 L800 450 L800 0 L300 0 Z" fill="url(#warmGradient)" opacity="0.3" />

                                            {/* Cold Air (Aggressor) - Steep Wedge */}
                                            <motion.path
                                                d="M-100 450 L400 450 L300 200 L-100 200 Z"
                                                fill="url(#coldGradient)"
                                                stroke="#38bdf8"
                                                strokeWidth="3"
                                                initial={{ x: -100, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                            />

                                            {/* Uplift Arrows */}
                                            <motion.path
                                                d="M450 400 Q400 300 450 200"
                                                stroke="#fca5a5" strokeWidth="4" fill="none"
                                                strokeDasharray="10 5"
                                                markerEnd="url(#arrowhead)"
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ duration: 1.5, delay: 0.5 }}
                                            />

                                            {/* Cumulonimbus Cloud */}
                                            <motion.g
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 1, duration: 1 }}
                                            >
                                                <path d="M320 250 Q300 200 350 180 Q350 120 420 120 Q480 80 550 130 Q600 120 620 180 Q650 200 600 250 Z" fill="#e2e8f0" filter="url(#glow)" />
                                                <path d="M350 250 Q330 200 380 180 Q380 120 450 120 Q510 80 580 130 Q630 120 650 180 Q680 200 630 250 Z" fill="#94a3b8" opacity="0.5" filter="url(#cloudBlur)" transform="translate(-20, 10)" />

                                                {/* Rain / Lightning */}
                                                <motion.g animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 3, repeatDelay: 2 }}>
                                                    <path d="M450 260 L420 350" stroke="#fbbf24" strokeWidth="3" filter="url(#glow)" />
                                                </motion.g>
                                                <line x1="400" y1="260" x2="380" y2="350" stroke="#60a5fa" strokeWidth="2" strokeDasharray="4" />
                                                <line x1="420" y1="260" x2="400" y2="350" stroke="#60a5fa" strokeWidth="2" strokeDasharray="4" />
                                                <line x1="440" y1="260" x2="420" y2="350" stroke="#60a5fa" strokeWidth="2" strokeDasharray="4" />
                                            </motion.g>

                                            {/* Labels */}
                                            <text x="50" y="420" fill="white" fontSize="24" fontWeight="bold">COLD</text>
                                            <text x="600" y="420" fill="#fca5a5" fontSize="24" fontWeight="bold">WARM</text>
                                        </g>
                                    )}

                                    {/* --- SCENARIO: WARM FRONT --- */}
                                    {frontType === 'warm' && (
                                        <g>
                                            {/* Cold Air (Retreating) */}
                                            <path d="M300 450 L800 450 L800 350 L300 450 Z" fill="url(#coldGradient)" opacity="0.5" />
                                            <path d="M800 450 L800 350 L800 450 Z " fill="#3b82f6" /> {/* Extension right */}
                                            <path d="M300 450 L800 450 L800 0 L300 0" fill="none" />

                                            {/* Cold Wedge Base */}
                                            <path d="M200 450 L800 450 L800 250 L200 450" fill="url(#coldGradient)" />

                                            {/* Warm Air (Overriding) - Shallow Slope */}
                                            <motion.path
                                                d="M-200 450 L200 450 L800 250 L800 0 L-200 0 Z"
                                                fill="url(#warmGradient)"
                                                stroke="#f43f5e"
                                                strokeWidth="3"
                                                initial={{ x: -200, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                            />

                                            {/* Layered Clouds (Ns, As, Ci) */}
                                            <motion.g
                                                initial={{ opacity: 0, x: -50 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.8, duration: 1.5 }}
                                            >
                                                {/* Nimbostratus */}
                                                <rect x="200" y="320" width="300" height="40" rx="20" fill="#64748b" filter="url(#cloudBlur)" />
                                                {/* Altostratus */}
                                                <rect x="350" y="250" width="300" height="30" rx="15" fill="#94a3b8" filter="url(#cloudBlur)" />
                                                {/* Cirrus */}
                                                <rect x="550" y="150" width="200" height="10" rx="5" fill="white" opacity="0.6" filter="url(#cloudBlur)" />

                                                {/* Steady Rain */}
                                                <line x1="250" y1="360" x2="250" y2="420" stroke="#60a5fa" strokeWidth="1" />
                                                <line x1="280" y1="360" x2="280" y2="420" stroke="#60a5fa" strokeWidth="1" />
                                                <line x1="310" y1="360" x2="310" y2="420" stroke="#60a5fa" strokeWidth="1" />
                                            </motion.g>

                                            <text x="50" y="300" fill="#fca5a5" fontSize="24" fontWeight="bold">WARM</text>
                                            <text x="600" y="420" fill="#bae6fd" fontSize="24" fontWeight="bold">COLD</text>
                                        </g>
                                    )}

                                    {/* --- SCENARIO: OCCLUDED FRONT --- */}
                                    {frontType === 'occluded' && (
                                        <g>
                                            {/* Coldest Air (Left) */}
                                            <path d="M0 450 L300 450 L300 150 L0 150 Z" fill="#0369a1" opacity="0.9" />
                                            <text x="50" y="420" fill="white" fontSize="20" fontWeight="bold">COLDEST</text>

                                            {/* Less Cold Air (Right) */}
                                            <path d="M500 450 L800 450 L800 150 L500 150 Z" fill="#38bdf8" opacity="0.5" />
                                            <text x="650" y="420" fill="white" fontSize="20" fontWeight="bold">X-COLD</text>

                                            {/* Warm Air (Lifted Aloft) */}
                                            <path d="M300 150 L500 150 L400 50 Z" fill="#f43f5e" filter="url(#glow)" />
                                            <text x="360" y="120" fill="#fee2e2" fontSize="18" fontWeight="bold">WARM ALOFT</text>

                                            {/* Occlusion Point Clouds */}
                                            <circle cx="400" cy="150" r="60" fill="#cbd5e1" filter="url(#cloudBlur)" />
                                            <circle cx="350" cy="180" r="50" fill="#94a3b8" filter="url(#cloudBlur)" />
                                            <circle cx="450" cy="180" r="50" fill="#94a3b8" filter="url(#cloudBlur)" />

                                            {/* Mixed precip */}
                                            <line x1="400" y1="210" x2="400" y2="400" stroke="#a78bfa" strokeWidth="2" strokeDasharray="5" />
                                        </g>
                                    )}
                                </svg>
                            </motion.div>
                        </AnimatePresence>

                        {/* Legend Overlay */}
                        <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md p-3 rounded-xl border border-white/10 text-xs text-slate-300">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div> Cold Air (Dense)
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div> Warm Air (Light)
                            </div>
                        </div>
                    </div>
                </div>

                {/* Information Dashboard */}
                <div className="space-y-6">
                    <div className="bg-slate-800/50 rounded-3xl p-8 border border-white/5 backdrop-blur-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            {frontType === 'cold' && <CloudLightning size={100} className="text-white" />}
                            {frontType === 'warm' && <Droplets size={100} className="text-white" />}
                            {frontType === 'occluded' && <Wind size={100} className="text-white" />}
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            Characteristics
                            <span className="text-xs font-mono px-2 py-1 bg-slate-700 rounded text-slate-300 uppercase">
                                {frontType} sector
                            </span>
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            <Card
                                label="Passage Speed"
                                value={frontType === 'cold' ? 'Fast (25-50kts)' : frontType === 'warm' ? 'Slow (10-20kts)' : 'Variable'}
                                highlight={frontType === 'cold'}
                            />
                            <Card
                                label="Precipitation"
                                value={frontType === 'cold' ? 'Heavy Showers / TS' : frontType === 'warm' ? 'Continuous Rain / Drizzle' : 'Mixed / Prolonged'}
                                highlight={true}
                            />
                            <Card
                                label="Visibility"
                                value={frontType === 'cold' ? 'Good (excl. showers)' : frontType === 'warm' ? 'Poor (Mist/Fog)' : 'Poor'}
                                highlight={false}
                            />
                            <Card
                                label="Pressure Tendency"
                                value={frontType === 'cold' ? 'Falls -> Rises Rapidly' : frontType === 'warm' ? 'Falls Steady -> Steady' : 'Falls -> Rises'}
                                highlight={false}
                            />
                            <Card
                                label="Cloud Types"
                                value={frontType === 'cold' ? 'Cu, Cb, Tcu' : frontType === 'warm' ? 'Ci, Cs, As, Ns' : 'Mix of both'}
                                highlight={false}
                            />
                            <Card
                                label="Wind Change"
                                value={frontType === 'cold' ? 'Veers (e.g. SW -> NW)' : frontType === 'warm' ? 'Veers (e.g. S -> SW)' : 'Veers'}
                                highlight={false}
                            />
                        </div>
                    </div>

                    {/* Pro Tip Box */}
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 flex gap-4 items-start">
                        <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400 shrink-0">
                            <Thermometer size={20} />
                        </div>
                        <div>
                            <h4 className="text-amber-200 font-bold text-sm uppercase tracking-wide mb-1">Exam Tip</h4>
                            <p className="text-amber-100/70 text-sm leading-relaxed">
                                {frontType === 'cold' && "Cold fronts move faster than warm fronts. The slope is steep (1:50), causing rapid uplift and potential Thunderstorms (Cb)."}
                                {frontType === 'warm' && "The slope is shallow (1:150). The first sign of an approaching warm front is high Cirrus clouds (Ci), thickening to Altostratus (As)."}
                                {frontType === 'occluded' && "This occurs when a cold front catches up to a warm front, forcing the warm sector completely aloft. Weather is a mix of both types."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Card: React.FC<{ label: string; value: string; highlight: boolean }> = ({ label, value, highlight }) => (
    <div className={`p-4 rounded-2xl transition-all ${highlight ? 'bg-slate-700/50 border border-white/10' : 'bg-slate-800/30'}`}>
        <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest block mb-1.5">{label}</span>
        <span className="text-slate-100 font-medium text-sm leading-snug block">{value}</span>
    </div>
);

export default FrontalSystems;
