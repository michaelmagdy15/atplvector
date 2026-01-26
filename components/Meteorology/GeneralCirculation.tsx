import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Globe, Info, Compass, Sun, Calendar } from 'lucide-react';

const GeneralCirculation: React.FC = () => {
    const [view, setView] = useState<'cells' | 'pressure' | 'seasons'>('cells');
    const [month, setMonth] = useState<'july' | 'january'>('july');

    // Auto-cycle seasons if in seasons view
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (view === 'seasons') {
            interval = setInterval(() => {
                setMonth(prev => prev === 'july' ? 'january' : 'july');
            }, 4000);
        }
        return () => clearInterval(interval);
    }, [view]);

    // Animation constants
    const flowTransition = { repeat: Infinity, duration: 3, ease: "linear" };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h2 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3">
                        <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
                            <Globe className="text-blue-400" size={32} />
                        </div>
                        Global Circulation
                    </h2>
                    <p className="text-slate-400 mt-3 max-w-2xl text-lg font-light leading-relaxed">
                        The engine of Earth's climate. Watch how planetary rotation and solar heating drive the relentless movement of air masses.
                    </p>
                </div>
                <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
                    {['cells', 'pressure', 'seasons'].map((v) => (
                        <button
                            key={v}
                            onClick={() => setView(v as any)}
                            className={`px-6 py-2 rounded-xl font-bold text-sm transition-all duration-300 capitalize ${view === v ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {v}
                        </button>
                    ))}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                {/* Interactive Globe Visualizer */}
                <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-[2.5rem] p-1 border border-white/5 relative shadow-2xl overflow-hidden min-h-[500px] flex items-center justify-center group">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

                    {/* Starfield Background */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute bg-white rounded-full bg-opacity-40"
                                style={{
                                    width: Math.random() * 2 + 1,
                                    height: Math.random() * 2 + 1,
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                }}
                                animate={{ opacity: [0.2, 0.8, 0.2] }}
                                transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, ease: "easeInOut" }}
                            />
                        ))}
                    </div>

                    <div className="relative w-full h-full max-w-lg aspect-square flex items-center justify-center">
                        {/* Atmosphere Glow */}
                        <div className="absolute inset-4 rounded-full bg-blue-500/5 blur-3xl animate-pulse-slow"></div>

                        {/* THE EARTH CONTAINER */}
                        <div className="w-[80%] h-[80%] rounded-full bg-slate-950 border border-slate-700/50 relative overflow-hidden shadow-2xl">
                            {/* Rotating Map Grid Background */}
                            <motion.div
                                className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,_rgba(56,189,248,0.1),transparent_70%)]"
                            />

                            {/* Grid Lines */}
                            {[0, 30, 60, -30, -60].map((lat) => (
                                <div
                                    key={lat}
                                    className="absolute w-full border-t border-slate-700/50 border-dashed"
                                    style={{ top: `${50 - (lat * 0.9)}%` }} // Approximate spherical projection
                                >
                                    <span className="absolute right-2 -top-2.5 text-[10px] text-slate-600 font-mono">
                                        {lat === 0 ? 'EQ' : `${Math.abs(lat)}°`}
                                    </span>
                                </div>
                            ))}

                            {/* --- SEASONS OVERLAY --- */}
                            {view === 'seasons' && (
                                <>
                                    {/* Thermal Equator / ITCZ Shift */}
                                    <motion.div
                                        className="absolute left-0 right-0 h-1 bg-red-500/80 blur-[2px] shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                                        animate={{
                                            top: month === 'july' ? '40%' : '60%',
                                        }}
                                        transition={{ duration: 4, ease: "easeInOut" }}
                                    />
                                    <motion.div
                                        className="absolute left-0 right-0 flex justify-center pointer-events-none"
                                        animate={{ top: month === 'july' ? '35%' : '63%' }}
                                        transition={{ duration: 4, ease: "easeInOut" }}
                                    >
                                        <span className="bg-red-950/90 text-red-200 px-3 py-1 rounded-full text-xs font-bold border border-red-500/30 backdrop-blur-md">
                                            ITCZ
                                        </span>
                                    </motion.div>

                                    {/* Sun Indicator */}
                                    <motion.div
                                        className="absolute -right-4 w-16 h-16 pointer-events-none z-20"
                                        animate={{ top: month === 'july' ? '25%' : '75%' }}
                                        transition={{ duration: 4, ease: "easeInOut" }}
                                    >
                                        <Sun size={40} className="text-yellow-400 fill-yellow-400 drop-shadow-[0_0_30px_rgba(250,204,21,0.8)] animate-spin-slow" />
                                    </motion.div>
                                </>
                            )}

                            {/* --- CELLS VISUALIZATION (Fixed SVG - SCALED UP) --- */}
                            {view === 'cells' && (
                                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
                                    <defs>
                                        <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                                            <path d="M0,0 L6,3 L0,6 L0,0" fill="#60a5fa" />
                                        </marker>
                                        <linearGradient id="thermalGradient" x1="0" y1="1" x2="0" y2="0">
                                            <stop offset="0%" stopColor="#ef4444" />
                                            <stop offset="100%" stopColor="#3b82f6" />
                                        </linearGradient>
                                    </defs>

                                    {/* HADLEY CELLS - Wide and Tall */}
                                    {/* North: 0 to 30N (Y=200 to Y=133) */}
                                    <motion.path
                                        d="M200 200 Q320 180 200 135 Q80 160 200 200"
                                        stroke="url(#thermalGradient)" strokeWidth="4" fill="none" strokeDasharray="6 4"
                                        animate={{ strokeDashoffset: -40 }} transition={flowTransition} opacity={1}
                                    />
                                    {/* South: 0 to 30S (Y=200 to Y=267) */}
                                    <motion.path
                                        d="M200 200 Q320 220 200 265 Q80 240 200 200"
                                        stroke="url(#thermalGradient)" strokeWidth="4" fill="none" strokeDasharray="6 4"
                                        animate={{ strokeDashoffset: 40 }} transition={flowTransition} opacity={1}
                                    />

                                    {/* TRADE WINDS (Surface) - More prominent */}
                                    <motion.path d="M280 150 L220 190" stroke="#60a5fa" strokeWidth="3" markerEnd="url(#arrow)"
                                        animate={{ pathLength: [0, 1], opacity: [0, 1, 0] }} transition={flowTransition} />
                                    <motion.path d="M120 150 L180 190" stroke="#60a5fa" strokeWidth="3" markerEnd="url(#arrow)"
                                        animate={{ pathLength: [0, 1], opacity: [0, 1, 0] }} transition={flowTransition} />
                                    <motion.path d="M280 250 L220 210" stroke="#60a5fa" strokeWidth="3" markerEnd="url(#arrow)"
                                        animate={{ pathLength: [0, 1], opacity: [0, 1, 0] }} transition={flowTransition} />

                                    {/* FERREL CELLS */}
                                    {/* North: 30N to 60N (Y=135 to Y=70) */}
                                    <motion.path
                                        d="M200 135 Q120 110 200 70 Q280 90 200 135"
                                        stroke="#c084fc" strokeWidth="4" fill="none" strokeDasharray="6 4"
                                        animate={{ strokeDashoffset: 40 }} transition={flowTransition} opacity={0.8}
                                    />

                                    {/* Westerlies */}
                                    <motion.path d="M180 130 L250 80" stroke="#c084fc" strokeWidth="3" markerEnd="url(#arrow)"
                                        animate={{ pathLength: [0, 1], opacity: [0, 1, 0] }} transition={flowTransition} />

                                    {/* POLAR CELLS */}
                                    {/* North: 60N to 90N (Y=70 to Y=10) */}
                                    <motion.path
                                        d="M200 70 Q260 50 200 10 Q140 50 200 70"
                                        stroke="#2dd4bf" strokeWidth="4" fill="none" strokeDasharray="6 4"
                                        animate={{ strokeDashoffset: -40 }} transition={flowTransition} opacity={0.8}
                                    />
                                </svg>
                            )}

                            {/* --- PRESSURE BELTS (Improved Visibility) --- */}
                            {view === 'pressure' && (
                                <div className="absolute inset-x-8 inset-y-8 flex flex-col justify-between">
                                    <div className="flex-1 bg-blue-500/20 border-y border-blue-400/50 flex items-center justify-center relative group">
                                        <span className="bg-slate-900/80 px-2 py-0.5 rounded text-blue-200 text-xs font-bold shadow-lg">POLAR HIGH</span>
                                    </div>
                                    <div className="flex-[2] bg-indigo-500/20 border-y border-indigo-400/50 flex items-center justify-center relative group">
                                        <span className="bg-slate-900/80 px-2 py-0.5 rounded text-indigo-200 text-xs font-bold shadow-lg">SUB-POLAR LOW</span>
                                    </div>
                                    <div className="flex-[2] bg-amber-500/20 border-y border-amber-400/50 flex items-center justify-center relative group">
                                        <span className="bg-slate-900/80 px-2 py-0.5 rounded text-amber-200 text-xs font-bold shadow-lg">SUB-TROPICAL HIGH</span>
                                    </div>
                                    <div className="flex-[3] bg-red-500/30 border-y-2 border-red-500/50 flex items-center justify-center relative shadow-[inset_0_0_20px_rgba(239,68,68,0.2)]">
                                        <span className="bg-red-950/90 px-3 py-1 rounded-full text-red-200 text-sm font-black tracking-widest shadow-xl border border-red-500/40">EQUATORIAL LOW</span>
                                    </div>
                                    <div className="flex-[2] bg-amber-500/20 border-y border-amber-400/50 flex items-center justify-center relative group">
                                        <span className="bg-slate-900/80 px-2 py-0.5 rounded text-amber-200 text-xs font-bold shadow-lg">SUB-TROPICAL HIGH</span>
                                    </div>
                                    <div className="flex-[2] bg-indigo-500/20 border-y border-indigo-400/50 flex items-center justify-center relative group">
                                        <span className="bg-slate-900/80 px-2 py-0.5 rounded text-indigo-200 text-xs font-bold shadow-lg">SUB-POLAR LOW</span>
                                    </div>
                                    <div className="flex-1 bg-blue-500/20 border-y border-blue-400/50 flex items-center justify-center relative group">
                                        <span className="bg-slate-900/80 px-2 py-0.5 rounded text-blue-200 text-xs font-bold shadow-lg">POLAR HIGH</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Compass Rose Decoration */}
                    <div className="absolute bottom-8 right-8 text-slate-700 opacity-20 transition-all duration-1000" style={{ transform: month === 'january' ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                        <Compass size={120} strokeWidth={1} />
                    </div>
                </div>

                {/* Info Panel with Cards */}
                <div className="space-y-6">
                    {view === 'seasons' ? (
                        <div className="bg-slate-800/50 p-8 rounded-[2rem] border border-white/5 backdrop-blur-sm relative overflow-hidden">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                <Calendar size={20} className="text-yellow-400" />
                                Seasonal Shift
                            </h3>

                            <div className="flex bg-slate-900 rounded-xl p-1 mb-6">
                                <button onClick={() => setMonth('july')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${month === 'july' ? 'bg-yellow-500 text-slate-900' : 'text-slate-500 hover:text-white'}`}>JULY</button>
                                <button onClick={() => setMonth('january')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${month === 'january' ? 'bg-blue-500 text-white' : 'text-slate-500 hover:text-white'}`}>JANUARY</button>
                            </div>

                            <p className="text-slate-300 leading-relaxed mb-4">
                                The <strong>ITCZ (Inter-Tropical Convergence Zone)</strong> is the "Thermal Equator" where the sun's heating is most intense. It follows the sun North and South with the seasons.
                            </p>

                            <div className="space-y-3">
                                <div className={`p-4 rounded-xl border-l-4 transition-all ${month === 'july' ? 'bg-slate-800 border-yellow-500' : 'bg-slate-900/50 border-slate-700 opacity-50'}`}>
                                    <div className="text-xs font-bold text-slate-500 uppercase">July (Summer N.H)</div>
                                    <div className="text-white text-sm">ITCZ shifts North over land masses (avg 10-15°N). India sees SW Monsoon.</div>
                                </div>
                                <div className={`p-4 rounded-xl border-l-4 transition-all ${month === 'january' ? 'bg-slate-800 border-blue-500' : 'bg-slate-900/50 border-slate-700 opacity-50'}`}>
                                    <div className="text-xs font-bold text-slate-500 uppercase">January (Winter N.H)</div>
                                    <div className="text-white text-sm">ITCZ shifts South (avg 5-10°S). Dry NE Monsoon affects India.</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-800/50 p-8 rounded-[2rem] border border-white/5 backdrop-blur-sm">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                <Info size={20} className="text-blue-400" />
                                Mechanism of Action
                            </h3>
                            <div className="space-y-4">
                                <CellCard
                                    number="1"
                                    title="Hadley Cell"
                                    desc="Driven by intense solar heating. Hot air rises at the Equator (Low), cools aloft, and sinks at 30° latitude (High)."
                                    color="blue"
                                />
                                <CellCard
                                    number="2"
                                    title="Ferrel Cell"
                                    desc="A 'reverse' gear driven by friction between Hadley and Polar cells. Characterized by unstable weather and Westerlies."
                                    color="purple"
                                />
                                <CellCard
                                    number="3"
                                    title="Polar Cell"
                                    desc="Cold, dense air sinks at the poles, creating high pressure and flowing equatorward."
                                    color="teal"
                                />
                            </div>
                        </div>
                    )}

                    {view !== 'seasons' && (
                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden">
                            <div className="absolute -right-4 -top-4 text-indigo-500/10 transform rotate-12">
                                <Wind size={100} />
                            </div>
                            <h4 className="text-indigo-300 font-bold mb-2 text-sm uppercase tracking-wider relative z-10">Coriolis Effect</h4>
                            <p className="text-slate-300 text-sm leading-relaxed relative z-10">
                                Air moving from High to Low pressure doesn't flow straight. It deflects <strong>Right in N. Hemisphere</strong> and <strong>Left in S. Hemisphere</strong> due to Earth's rotation.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const CellCard: React.FC<{ number: string; title: string; desc: string; color: string }> = ({ number, title, desc, color }) => {
    const colors: Record<string, string> = {
        blue: 'bg-blue-500 text-blue-400',
        purple: 'bg-purple-500 text-purple-400',
        teal: 'bg-teal-500 text-teal-400'
    };

    return (
        <div className="flex gap-4 p-4 rounded-2xl bg-slate-900/40 hover:bg-slate-900/60 transition-colors border border-transparent hover:border-slate-700/50">
            <div className={`w-8 h-8 rounded-full ${colors[color].split(' ')[0]}/20 ${colors[color].split(' ')[1]} flex items-center justify-center font-black text-sm shrink-0 shadow-lg`}>
                {number}
            </div>
            <div>
                <h4 className="text-white font-bold text-sm mb-1">{title}</h4>
                <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

export default GeneralCirculation;
