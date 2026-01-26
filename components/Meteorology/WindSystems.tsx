import React, { useState, useEffect } from 'react';
import { Wind, Globe, Compass, RefreshCw, Sun, Moon, ArrowRight, Activity, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WindSystems: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'forces' | 'jets' | 'local'>('forces');
    const [pressureGradient, setPressureGradient] = useState(50);
    const [isDay, setIsDay] = useState(true); // For Sea Breeze animation

    // Cycle Day/Night automatically for Local Winds
    useEffect(() => {
        if (activeTab === 'local') {
            const interval = setInterval(() => setIsDay(prev => !prev), 5000);
            return () => clearInterval(interval);
        }
    }, [activeTab]);

    return (
        <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h2 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3">
                        <div className="p-3 bg-teal-500/20 rounded-xl border border-teal-500/30">
                            <Wind className="text-teal-400" size={32} />
                        </div>
                        Wind Systems
                    </h2>
                    <p className="text-slate-400 mt-3 max-w-2xl text-lg font-light leading-relaxed">
                        Understand the forces that drive the atmosphere. From the global jet streams to the local sea breeze.
                    </p>
                </div>

                <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
                    {['forces', 'jets', 'local'].map((t) => (
                        <button
                            key={t}
                            onClick={() => setActiveTab(t as any)}
                            className={`px-6 py-2 rounded-xl font-bold text-sm transition-all duration-300 capitalize ${activeTab === t ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/50' : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </header>

            <AnimatePresence mode="wait">
                {activeTab === 'forces' && (
                    <motion.div
                        key="forces"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                    >
                        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] min-h-[500px] flex flex-col relative overflow-hidden">
                            {/* Background Grid */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                            <h3 className="text-2xl font-bold text-white mb-6 relative z-10">Geostrophic Balance</h3>

                            <div className="flex-1 relative flex items-center justify-center">
                                {/* Isobars */}
                                <div className="absolute top-[20%] w-full h-px bg-slate-600 dashed border-t border-dashed border-slate-500"></div>
                                <span className="absolute top-[17%] left-4 text-xs font-mono text-slate-400">LOW PRESSURE (990 hPa)</span>

                                <div className="absolute bottom-[20%] w-full h-px bg-slate-600 dashed border-t border-dashed border-slate-500"></div>
                                <span className="absolute bottom-[23%] left-4 text-xs font-mono text-slate-400">HIGH PRESSURE (1020 hPa)</span>

                                {/* Interactive Particles Flowing with Wind */}
                                <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
                                    {[...Array(10)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="absolute h-1 bg-teal-400 rounded-full blur-[1px]"
                                            style={{
                                                top: `${Math.random() * 60 + 20}%`,
                                                left: -100,
                                                width: Math.random() * 100 + 50
                                            }}
                                            animate={{ x: 1000 }}
                                            transition={{ duration: 4 - (pressureGradient / 50), repeat: Infinity, ease: "linear", delay: i * 0.2 }}
                                        />
                                    ))}
                                </div>

                                {/* Central Vector Diagram */}
                                <div className="relative z-10 w-20 h-20 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                                    <Wind size={24} className="text-white" />

                                    {/* PGF Vector (Blue) - Towards LOW */}
                                    <motion.div
                                        className="absolute bottom-1/2 left-1/2 w-1.5 bg-blue-500 rounded-full origin-bottom shadow-[0_0_10px_#3b82f6]"
                                        style={{ height: 0 }}
                                        animate={{ height: pressureGradient * 2.5 }}
                                        transition={{ type: "spring", bounce: 0.5 }}
                                    >
                                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-blue-400 font-bold text-xs whitespace-nowrap bg-slate-900/80 px-2 py-0.5 rounded">PGF</span>
                                        <div className="absolute -top-2 -left-1.5 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-blue-500"></div>
                                    </motion.div>

                                    {/* Coriolis Vector (Red) - Opposite PGF in Balance */}
                                    <motion.div
                                        className="absolute top-1/2 left-1/2 w-1.5 bg-red-500 rounded-full origin-top shadow-[0_0_10px_#ef4444]"
                                        style={{ height: 0 }}
                                        animate={{ height: pressureGradient * 2.5 }}
                                        transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                                    >
                                        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-red-400 font-bold text-xs whitespace-nowrap bg-slate-900/80 px-2 py-0.5 rounded">Coriolis</span>
                                        <div className="absolute -bottom-2 -left-1.5 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-red-500"></div>
                                    </motion.div>

                                    {/* Resultant Wind (Teal) - 90deg Right */}
                                    <motion.div
                                        className="absolute top-1/2 left-1/2 h-2 bg-teal-400 rounded-full origin-left shadow-[0_0_15px_#2dd4bf]"
                                        initial={{ width: 0 }}
                                        animate={{ width: pressureGradient * 3.5 }}
                                        transition={{ type: "spring", stiffness: 100 }}
                                    >
                                        <span className="absolute right-2 -bottom-6 text-teal-300 font-bold text-xs whitespace-nowrap bg-slate-900/80 px-2 py-0.5 rounded">Geostrophic Wind ({pressureGradient}kts)</span>
                                        <div className="absolute -right-2 -top-1.5 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[8px] border-l-teal-400"></div>
                                    </motion.div>
                                </div>
                            </div>

                            <div className="mt-8 relative z-10">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-slate-400 text-sm font-bold">Isobar Spacing (Pressure Gradient)</span>
                                    <span className="text-teal-400 font-mono font-bold">{pressureGradient}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="20" max="100"
                                    value={pressureGradient}
                                    onChange={(e) => setPressureGradient(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                                />
                            </div>
                        </div>

                        {/* Theory Cards - kept clean */}
                        <div className="space-y-6">
                            <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 backdrop-blur-md">
                                <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                    <RefreshCw className="text-red-400" size={18} /> Coriolis Force
                                </h4>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    An apparent force caused by Earth's rotation. It pulls wind to the <strong>RIGHT</strong> in the Northern Hemisphere. It acts perpendicular to the wind direction and balances the Pressure Gradient Force (PGF).
                                </p>
                            </div>
                            <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 backdrop-blur-md">
                                <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                    <Compass className="text-blue-400" size={18} /> Buys Ballot's Law
                                </h4>
                                <p className="text-slate-400 text-sm leading-relaxed border-l-2 border-blue-500 pl-4 py-1">
                                    "Stand with your back to the wind in the Northern Hemisphere, and the Low Pressure is on your LEFT."
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'local' && (
                    <motion.div
                        key="local"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] relative overflow-hidden min-h-[500px]"
                    >
                        {/* Day/Night Background Switch */}
                        <motion.div
                            className="absolute inset-0"
                            animate={{ backgroundColor: isDay ? '#0f172a' : '#020617' }}
                            transition={{ duration: 2 }}
                        />

                        {/* Sky Elements */}
                        <motion.div
                            className="absolute top-10 right-10"
                            animate={{ y: isDay ? 0 : 200, opacity: isDay ? 1 : 0 }}
                        >
                            <Sun size={64} className="text-yellow-400 drop-shadow-[0_0_30px_rgba(250,204,21,0.6)] animate-spin-slow" />
                        </motion.div>
                        <motion.div
                            className="absolute top-10 right-10"
                            animate={{ y: isDay ? -200 : 0, opacity: isDay ? 0 : 1 }}
                        >
                            <Moon size={50} className="text-slate-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
                        </motion.div>

                        {/* Interactive Scene */}
                        <div className="absolute inset-x-0 bottom-0 top-32 flex">
                            {/* SEA SECTION */}
                            <div className="flex-1 relative bg-gradient-to-t from-blue-900/80 to-blue-500/10 flex items-end justify-center">
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                                <span className="mb-4 text-blue-200 font-bold tracking-widest text-lg z-10">SEA</span>

                                {/* Water Temperature Indicator */}
                                <div className="absolute top-1/2 text-center">
                                    <div className="text-xs uppercase text-slate-400 mb-1">Temp</div>
                                    <div className="text-2xl font-bold text-blue-300">Slow Change</div>
                                </div>
                            </div>

                            {/* LAND SECTION */}
                            <motion.div
                                className="flex-1 relative flex items-end justify-center"
                                animate={{ backgroundColor: isDay ? 'rgba(16, 185, 129, 0.1)' : 'rgba(30, 41, 59, 0.5)' }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 to-transparent"></div>
                                {/* Heat Haze on Day */}
                                {isDay && (
                                    <motion.div className="absolute inset-0 bg-orange-500/5" animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
                                )}

                                <span className="mb-4 text-emerald-200 font-bold tracking-widest text-lg z-10">LAND</span>

                                {/* Land Temp Indicator */}
                                <div className="absolute top-1/2 text-center">
                                    <div className="text-xs uppercase text-slate-400 mb-1">Temp</div>
                                    <motion.div
                                        className="text-2xl font-bold"
                                        animate={{ color: isDay ? '#fbbf24' : '#94a3b8', scale: isDay ? 1.1 : 1 }}
                                    >
                                        {isDay ? 'HOT' : 'COLD'}
                                    </motion.div>
                                </div>
                            </motion.div>

                            {/* COASTLINE */}
                            <div className="w-16 h-full bg-gradient-to-r from-blue-900/80 to-emerald-900/80 skew-x-12 blur-xl absolute left-1/2 -ml-8"></div>
                        </div>

                        {/* Arrows / Circulation Loop */}
                        <div className="absolute inset-0 pointer-events-none">
                            <svg className="w-full h-full">
                                <defs>
                                    <marker id="windArrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                                        <path d="M0,0 L10,5 L0,10 L0,0" fill="white" />
                                    </marker>
                                </defs>

                                {isDay ? (
                                    // SEA BREEZE (Day)
                                    <g>
                                        {/* Rising Air over Land */}
                                        <motion.path
                                            d="M 75% 80% L 75% 30%"
                                            stroke="#fbbf24" strokeWidth="4" strokeDasharray="10 5"
                                            animate={{ strokeDashoffset: -20 }} transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
                                        />
                                        <text x="76%" y="50%" fill="#fbbf24" fontSize="12" fontWeight="bold">RISING (LOW)</text>

                                        {/* Sinking Air over Sea */}
                                        <motion.path
                                            d="M 25% 30% L 25% 80%"
                                            stroke="#60a5fa" strokeWidth="4" strokeDasharray="10 5"
                                            animate={{ strokeDashoffset: 20 }} transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
                                        />
                                        <text x="26%" y="50%" fill="#60a5fa" fontSize="12" fontWeight="bold">SINKING (HIGH)</text>

                                        {/* Surface Flow (Sea to Land) */}
                                        <motion.path
                                            d="M 25% 85% L 75% 85%"
                                            stroke="white" strokeWidth="6" markerEnd="url(#windArrow)"
                                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.5 }}
                                        />
                                        <rect x="45%" y="82%" width="10%" height="6%" fill="#0f172a" rx="4" />
                                        <text x="50%" y="86%" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">SEA BREEZE</text>

                                        {/* Upper Return Flow */}
                                        <motion.path
                                            d="M 75% 25% L 25% 25%"
                                            stroke="white" strokeWidth="2" strokeOpacity="0.5" markerEnd="url(#windArrow)"
                                        />
                                    </g>
                                ) : (
                                    // LAND BREEZE (Night)
                                    <g>
                                        {/* Rising Air over Sea */}
                                        <motion.path
                                            d="M 25% 80% L 25% 30%"
                                            stroke="#fbbf24" strokeWidth="4" strokeDasharray="10 5"
                                            animate={{ strokeDashoffset: -20 }} transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
                                        />

                                        {/* Sinking Air over Land */}
                                        <motion.path
                                            d="M 75% 30% L 75% 80%"
                                            stroke="#60a5fa" strokeWidth="4" strokeDasharray="10 5"
                                            animate={{ strokeDashoffset: 20 }} transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
                                        />

                                        {/* Surface Flow (Land to Sea) */}
                                        <motion.path
                                            d="M 75% 85% L 25% 85%"
                                            stroke="white" strokeWidth="6" markerEnd="url(#windArrow)"
                                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.5 }}
                                        />
                                        <rect x="45%" y="82%" width="10%" height="6%" fill="#0f172a" rx="4" />
                                        <text x="50%" y="86%" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">LAND BREEZE</text>

                                        {/* Upper Return Flow */}
                                        <motion.path
                                            d="M 25% 25% L 75% 25%"
                                            stroke="white" strokeWidth="2" strokeOpacity="0.5" markerEnd="url(#windArrow)"
                                        />
                                    </g>
                                )}
                            </svg>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'jets' && (
                    <motion.div
                        key="jets"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        {/* Visualization Card */}
                        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] md:col-span-2 min-h-[400px] relative overflow-hidden flex items-center justify-center">
                            {/* Map Background */}
                            <Globe size={300} className="text-slate-800 opacity-50 absolute" strokeWidth={0.5} />

                            <h3 className="absolute top-8 left-8 text-2xl font-bold text-white z-10">Jet Streams</h3>

                            {/* Animated Jet Streams */}
                            <svg className="absolute inset-0 w-full h-full">
                                <defs>
                                    <linearGradient id="jetGradient" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0" />
                                        <stop offset="50%" stopColor="#2dd4bf" />
                                        <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
                                    </linearGradient>
                                </defs>

                                {/* Polar Front Jet */}
                                <motion.path
                                    d="M -100 150 Q 200 50 400 150 T 900 150"
                                    fill="none" stroke="url(#jetGradient)" strokeWidth="12" strokeLinecap="round"
                                    filter="drop-shadow(0 0 10px #2dd4bf)"
                                    animate={{
                                        d: [
                                            "M -100 150 Q 200 50 400 150 T 900 150",
                                            "M -100 120 Q 200 180 400 120 T 900 180",
                                            "M -100 150 Q 200 50 400 150 T 900 150"
                                        ]
                                    }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                                />
                                <text x="100" y="100" fill="#2dd4bf" fontWeight="bold">Polar Front Jet (FL300)</text>

                                {/* Subtropical Jet */}
                                <motion.path
                                    d="M -100 350 Q 300 300 600 350 T 1000 300"
                                    fill="none" stroke="url(#jetGradient)" strokeWidth="8" strokeLinecap="round" opacity="0.6"
                                    animate={{
                                        d: [
                                            "M -100 350 Q 300 300 600 350 T 1000 300",
                                            "M -100 380 Q 300 320 600 380 T 1000 320",
                                            "M -100 350 Q 300 300 600 350 T 1000 300"
                                        ]
                                    }}
                                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                                />
                                <text x="500" y="400" fill="#2dd4bf" opacity="0.6" fontWeight="bold">Subtropical Jet (FL400)</text>

                                {/* Moving Particles along the jet */}
                                <motion.circle r="4" fill="white" filter="blur(2px)"
                                    animate={{ x: [0, 800], y: [150, 150] }} // Simplified path trace
                                >
                                    {/* In a real app, motion path offset would be used */}
                                </motion.circle>
                            </svg>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                            <div className="flex gap-4 items-start">
                                <Activity className="text-teal-400 shrink-0" />
                                <div>
                                    <h4 className="text-white font-bold mb-1">Clear Air Turbulence (CAT)</h4>
                                    <p className="text-sm text-slate-400">
                                        Significant turbulence occurs on the <strong>Cold Air Side</strong> (Poleward) of the jet core.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                            <div className="flex gap-4 items-start">
                                <Zap className="text-yellow-400 shrink-0" />
                                <div>
                                    <h4 className="text-white font-bold mb-1">Jet Streaks</h4>
                                    <p className="text-sm text-slate-400">
                                        Areas of localized max wind speeds within the stream, causing divergence aloft and cyclogenesis below.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default WindSystems;
