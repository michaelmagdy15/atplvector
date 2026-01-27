import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Wind, Cloud, Sun, ArrowDown, ArrowUp, Info, RefreshCw, AlertCircle } from 'lucide-react';

const DepressionsAnticyclones: React.FC = () => {
    const [system, setSystem] = useState<'Low' | 'High'>('Low');
    const [hemisphere, setHemisphere] = useState<'Northern' | 'Southern'>('Northern');

    return (
        <div className="space-y-8 p-4 md:p-6 max-w-7xl mx-auto text-slate-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white flex items-center gap-3">
                        <Activity className="text-blue-400" />
                        Pressure Systems
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Understanding Depressions (Lows) and Anticyclones (Highs).</p>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800 gap-1">
                    <button
                        onClick={() => setSystem('Low')}
                        className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${system === 'Low' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                    >
                        Depression (L)
                    </button>
                    <button
                        onClick={() => setSystem('High')}
                        className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${system === 'High' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                    >
                        Anticyclone (H)
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visualizer Card */}
                <div className="lg:col-span-2 bg-slate-950 rounded-[2.5rem] border border-slate-800 relative overflow-hidden min-h-[500px] flex flex-col items-center justify-center p-8">
                    {/* Background Glow */}
                    <div className={`absolute inset-0 opacity-20 blur-[100px] ${system === 'Low' ? 'bg-blue-600' : 'bg-orange-600'}`} />

                    {/* Controls Overlay */}
                    <div className="absolute top-8 left-8 flex items-center gap-3 z-20">
                        <button
                            onClick={() => setHemisphere(h => h === 'Northern' ? 'Southern' : 'Northern')}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-900/80 backdrop-blur rounded-full border border-slate-700 text-xs font-black uppercase tracking-widest text-slate-300 hover:border-slate-500 transition-colors"
                        >
                            <RefreshCw size={14} /> {hemisphere} Hemisphere
                        </button>
                    </div>

                    {/* Central Symbol */}
                    <motion.div
                        initial={false}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className={`text-9xl font-black z-10 select-none ${system === 'Low' ? 'text-blue-500/30' : 'text-orange-500/30'}`}
                    >
                        {system === 'Low' ? 'L' : 'H'}
                    </motion.div>

                    {/* Wind Arrows Animation */}
                    <WindArrows system={system} hemisphere={hemisphere} />

                    {/* Vertical Motion Indicator */}
                    <div className="absolute right-12 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
                        <div className="h-32 w-2 bg-slate-800 rounded-full relative overflow-hidden">
                            <motion.div
                                animate={{ y: system === 'Low' ? [-100, 100] : [100, -100] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className={`absolute inset-0 ${system === 'Low' ? 'bg-blue-400' : 'bg-orange-400'}`}
                            />
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase vertical-text">
                            {system === 'Low' ? 'Rising (Convergence)' : 'Subsiding (Divergence)'}
                        </span>
                    </div>

                    <div className="absolute bottom-8 text-center z-10">
                        <h3 className="text-xl font-bold text-white mb-1">
                            {system === 'Low' ? 'Cyclonic Flow' : 'Anticyclonic Flow'}
                        </h3>
                        <p className="text-sm text-slate-400">
                            Winds circulate <span className="text-white font-bold">{getCirculationText(system, hemisphere)}</span> at the surface.
                        </p>
                    </div>
                </div>

                {/* Info Column */}
                <div className="space-y-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={system}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-slate-900 border border-slate-800 rounded-3xl p-6"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`p-2 rounded-xl ${system === 'Low' ? 'bg-blue-500/10 text-blue-400' : 'bg-orange-500/10 text-orange-400'}`}>
                                    {system === 'Low' ? <Cloud size={20} /> : <Sun size={20} />}
                                </div>
                                <h4 className="text-lg font-bold text-white">Characteristics</h4>
                            </div>

                            <ul className="space-y-4">
                                {system === 'Low' ? (
                                    <>
                                        <FeatureItem icon={ArrowUp} label="Vertical Motion" value="Convergence & Ascent" />
                                        <FeatureItem icon={Wind} label="Weather" value="Precipitation, Clouds, Strong Winds" />
                                        <FeatureItem icon={Activity} label="Pressure Gradient" value="Strong (Isobars close together)" />
                                    </>
                                ) : (
                                    <>
                                        <FeatureItem icon={ArrowDown} label="Vertical Motion" value="Divergence & Subsistence" />
                                        <FeatureItem icon={Sun} label="Weather" value="Dry, Clear Skies, Light Winds" />
                                        <FeatureItem icon={Activity} label="Pressure Gradient" value="Weak (Isobars spaced out)" />
                                    </>
                                )}
                            </ul>
                        </motion.div>
                    </AnimatePresence>

                    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
                            <Info size={14} className="text-teal-400" />
                            Buys Ballot's Law
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed italic">
                            "In the Northern Hemisphere, if you stand with your back to the wind, the LOW pressure window is on your LEFT."
                        </p>
                        <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                            <span className="text-[10px] text-slate-500 font-bold uppercase">Opposite in SH</span>
                            <div className="flex gap-1">
                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                <div className="w-2 h-2 rounded-full bg-orange-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-6">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-red-400 uppercase tracking-widest mb-2">
                            <AlertCircle size={14} />
                            Operational Risk
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            {system === 'Low'
                                ? "Lows often result in poor visibility, low ceilings, and turbulence. Watch for rapid pressure drops during flight planning."
                                : "Subsidence associated with Highs can cause a Temperature Inversion, trapping pollutants and causing radiation fog or poor visibility at low levels."
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const WindArrows = ({ system, hemisphere }: { system: 'Low' | 'High', hemisphere: 'Northern' | 'Southern' }) => {
    // Rotation logic
    const isClockwise = (system === 'Low' && hemisphere === 'Southern') || (system === 'High' && hemisphere === 'Northern');
    const directionMult = isClockwise ? 1 : -1;

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <motion.div
                    key={angle}
                    initial={false}
                    animate={{ rotate: [angle, angle + (360 * directionMult)] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute"
                >
                    <motion.div
                        animate={{
                            x: system === 'Low' ? [180, 100] : [100, 180],
                            opacity: system === 'Low' ? [0, 1, 0] : [0, 1, 0]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: (angle / 360) * 3,
                            ease: "easeOut"
                        }}
                        className={`p-1 rounded-full ${system === 'Low' ? 'bg-blue-400/50' : 'bg-orange-400/50'}`}
                    >
                        <Wind size={16} className={`${system === 'Low' ? 'text-blue-300 transform rotate-180' : 'text-orange-300'}`} />
                    </motion.div>
                </motion.div>
            ))}
        </div>
    );
};

const FeatureItem = ({ icon: Icon, label, value }: any) => (
    <li className="flex items-center justify-between group">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center border border-slate-800 group-hover:border-slate-700 transition-colors">
                <Icon size={14} className="text-slate-500" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</span>
        </div>
        <span className="text-xs text-white font-medium">{value}</span>
    </li>
);

const getCirculationText = (system: 'Low' | 'High', hemisphere: 'Northern' | 'Southern') => {
    if (system === 'Low') {
        return hemisphere === 'Northern' ? 'Anticlockwise & Inward' : 'Clockwise & Inward';
    } else {
        return hemisphere === 'Northern' ? 'Clockwise & Outward' : 'Anticlockwise & Outward';
    }
};

export default DepressionsAnticyclones;
