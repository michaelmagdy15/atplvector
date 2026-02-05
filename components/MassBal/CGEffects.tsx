import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wind, Gauge, AlertTriangle, TrendingUp } from 'lucide-react';

const CGEffects: React.FC = () => {
    const [cgPos, setCgPos] = useState(30); // % MAC (Range 10 - 40)

    // Limits
    const FWD_LIMIT = 20;
    const AFT_LIMIT = 35;

    // Derived Effects (Simplified Physics Models)
    // 1. Stability (Longitudinal): Fwd CG = More Stable, Aft CG = Less Stable
    const stability = Math.max(0, 100 - ((cgPos - 10) * 3));

    // 2. Control Forces (Maneuverability): Fwd CG = Heavy Forces, Aft CG = Light Forces
    const controllability = Math.min(100, Math.max(0, (cgPos - 10) * 3.3));

    // 3. Tail Downforce: Fwd CG requires MORE downforce to balance
    // 0 = Neutral, 100 = Max Downforce
    const tailDownforce = Math.max(0, 100 - ((cgPos - 10) * 3));

    // 4. Stall Speed (Vs): High Downforce = Higher Effective Weight = Higher Vs
    // Base Vs = 100kt. Max effect +5kts
    const vs = 100 + (tailDownforce / 100 * 5);

    // 5. Fuel Burn (Drag): High Downforce = High Induced Drag = Higher Burn
    // Base Burn = 1000kg/hr. Max effect +5%
    const fuelBurn = 1000 + (tailDownforce / 100 * 50);

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8 font-sans">
            <h2 className="text-2xl font-bold text-white mb-2">Effects of CG Position</h2>
            <p className="text-slate-400 mb-8">Move the CG to see how it affects Stability, Control, Drag, and Performance.</p>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Visual Aircraft Model */}
                <div className="lg:col-span-2 bg-slate-900 rounded-xl border border-slate-700 p-8 relative overflow-hidden min-h-[300px] flex items-center justify-center">
                    {/* Airflow Lines */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ x: -100 }}
                                animate={{ x: 1000 }}
                                transition={{ repeat: Infinity, duration: 2, delay: i * 0.4, ease: "linear" }}
                                className="h-0.5 bg-white absolute w-20"
                                style={{ top: `${20 + (i * 15)}%` }}
                            />
                        ))}
                    </div>

                    {/* Aircraft Side Profile (Simplified) */}
                    <div className="relative w-full max-w-lg h-32">
                        {/* Fuselage */}
                        <div className="absolute top-1/2 left-0 right-0 h-10 bg-slate-700 rounded-full -translate-y-1/2 overflow-visible">
                            {/* Main Wing (Lift Vector) */}
                            <div className="absolute top-0 left-1/3 w-24 h-4 bg-slate-600 -mt-2 skew-x-12"></div>
                            <div className="absolute top-0 left-1/3 -mt-16 text-center">
                                <motion.div
                                    className="w-1 bg-emerald-500 mx-auto"
                                    animate={{ height: 60 + (tailDownforce * 0.5) }} // Lift increases to counter heavy aircraft + downforce
                                ></motion.div>
                                <span className="text-emerald-500 font-bold text-xs uppercase">Lift</span>
                            </div>

                            {/* Tailplane (Downforce Vector) */}
                            <div className="absolute top-2 right-4 w-12 h-2 bg-slate-600"></div>
                            <div className="absolute top-full right-8 mt-1 text-center">
                                <motion.div
                                    className="w-1 bg-red-500 mx-auto"
                                    animate={{ height: tailDownforce * 0.8 }}
                                ></motion.div>
                                <span className="text-red-500 font-bold text-xs uppercase block mt-1">Downforce</span>
                            </div>

                            {/* CG Marker */}
                            <motion.div
                                className="absolute top-1/2 w-4 h-4 bg-purple-500 rounded-full border-2 border-white -translate-y-1/2 z-20"
                                animate={{ left: `${25 + (cgPos * 0.8)}%` }}
                            >
                                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-purple-400 font-bold whitespace-nowrap">CG</div>
                            </motion.div>

                            {/* CP Marker (Fixed) */}
                            <div className="absolute top-1/2 left-[35%] w-3 h-3 bg-emerald-500 rounded-full -translate-y-1/2 z-10 opacity-50">
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-emerald-500/50 font-bold whitespace-nowrap text-xs">CP</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Metrics Panel */}
                <div className="space-y-6">
                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                        <div className="text-slate-500 text-xs uppercase mb-2">Longitudinal Stability</div>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-blue-500"
                                    animate={{ width: `${stability}%` }}
                                ></motion.div>
                            </div>
                            <span className="text-blue-400 font-mono w-12 text-right">{stability.toFixed(0)}%</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">High stability (Fwd CG) resists pitch changes.</p>
                    </div>

                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                        <div className="text-slate-500 text-xs uppercase mb-2">Maneuverability</div>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-orange-500"
                                    animate={{ width: `${controllability}%` }}
                                ></motion.div>
                            </div>
                            <span className="text-orange-400 font-mono w-12 text-right">{controllability.toFixed(0)}%</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Aft CG reduces stick forces (Light Controls).</p>
                    </div>

                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-slate-500 text-xs uppercase">Est. Fuel Consumption</span>
                            <Wind size={14} className="text-slate-500" />
                        </div>
                        <div className="text-2xl font-mono text-white mb-1">
                            {fuelBurn.toFixed(0)} <span className="text-sm text-slate-500">kg/hr</span>
                        </div>
                        <div className="text-xs text-slate-400">
                            {cgPos < 25 ? 'High Drag (Slower Cruise)' : 'Optimized Drag (Efficient)'}
                        </div>
                    </div>

                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-slate-500 text-xs uppercase">Stall Speed (Vs)</span>
                            <Gauge size={14} className="text-slate-500" />
                        </div>
                        <div className="text-2xl font-mono text-white mb-1">
                            {vs.toFixed(1)} <span className="text-sm text-slate-500">kt</span>
                        </div>
                        <div className="text-xs text-slate-400">
                            Higher stall speed at Fwd CG due to increased wing loading.
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="mt-8 pt-8 border-t border-slate-700">
                <label className="block text-slate-400 mb-2">CG Position (% MAC)</label>
                <div className="relative h-12 flex items-center">
                    <div className="absolute left-0 right-0 h-2 bg-slate-700 rounded-full overflow-hidden">
                        {/* Safe Range Zone */}
                        <div
                            className="absolute top-0 bottom-0 bg-emerald-500/20"
                            style={{ left: `${FWD_LIMIT}%`, width: `${AFT_LIMIT - FWD_LIMIT}%` }}
                        ></div>
                    </div>
                    <input
                        type="range"
                        min="0" max="50" step="0.5"
                        value={cgPos}
                        onChange={(e) => setCgPos(parseFloat(e.target.value))}
                        className="w-full relative z-10 opacity-0 cursor-pointer h-full"
                    />

                    {/* Visual Thumb */}
                    <motion.div
                        className={`absolute w-6 h-6 border-2 rounded-full z-0 pointer-events-none flex items-center justify-center ${cgPos >= FWD_LIMIT && cgPos <= AFT_LIMIT ? 'bg-emerald-500 border-emerald-400' : 'bg-red-500 border-red-400'}`}
                        style={{ left: `${cgPos * 2}%`, transform: 'translateX(-50%)' }}
                    >
                        <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
                    </motion.div>
                </div>

                <div className="flex justify-between text-xs text-slate-500 mt-1 font-mono">
                    <span>0% (LEMAC)</span>
                    <span className="text-emerald-500">{FWD_LIMIT}% (Fwd Limit)</span>
                    <span className="text-emerald-500">{AFT_LIMIT}% (Aft Limit)</span>
                    <span>50%</span>
                </div>
            </div>

            {/* Warnings */}
            <div className="mt-6 flex justify-center gap-4 min-h-[40px]">
                {cgPos < FWD_LIMIT && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-red-400 font-bold bg-red-500/10 px-4 py-2 rounded-lg"
                    >
                        <AlertTriangle size={18} />
                        UNSTABLE FWD: Excessive stick forces required for flare!
                    </motion.div>
                )}
                {cgPos > AFT_LIMIT && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-red-400 font-bold bg-red-500/10 px-4 py-2 rounded-lg"
                    >
                        <AlertTriangle size={18} />
                        UNSTABLE AFT: Difficult stall recovery (Flat Spin Risk)!
                    </motion.div>
                )}
                {cgPos >= FWD_LIMIT && cgPos <= AFT_LIMIT && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-emerald-400 font-bold bg-emerald-500/10 px-4 py-2 rounded-lg"
                    >
                        <TrendingUp size={18} />
                        Within Normal Operating Limits
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default CGEffects;
