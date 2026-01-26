import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plane, Zap, Info, ShieldAlert, Thermometer, Wind, Activity } from 'lucide-react';

const AirspeedIndicator: React.FC = () => {
    const [ias, setIas] = useState(150);
    const [altitude, setAltitude] = useState(0);
    const [oat, setOat] = useState(15);
    const [showCorrection, setShowCorrection] = useState(false);

    // Simplistic speed correction logic
    // CAS = IAS + Position/Instrument Error (fixed small value here)
    const cas = ias + 2;

    // EAS = CAS - Compressibility (negligible below 10,000ft / 300kts)
    const compressibility = altitude > 10000 ? (cas / 100) * (altitude / 10000) * 1.5 : 0;
    const eas = cas - compressibility;

    // TAS = EAS corrected for Density
    // Rule of thumb: TAS increases 2% for every 1000ft
    const densityFactor = 1 + (altitude / 1000) * 0.02;
    // Further temp correction: roughly 1% per 5°C deviation from ISA
    const isaTempAtAlt = 15 - (altitude / 1000) * 1.98;
    const tempDev = oat - isaTempAtAlt;
    const tempFactor = 1 + (tempDev / 5) * 0.01;

    const tas = eas * densityFactor * tempFactor;

    // Marker Colors
    const V_SO = 60;   // Stall Full Flap
    const V_S1 = 70;   // Stall Clean
    const V_FE = 110;  // Max Flap
    const V_NO = 160;  // Max Structural
    const V_NE = 200;  // Never Exceed

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="mb-12">
                <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
                    <Plane className="text-sky-400" />
                    Airspeed Indicator (ASI)
                </h1>
                <p className="text-slate-400 max-w-2xl">
                    Dynamic pressure in action. Learn the relationship between indicated, calibrated, equivalent, and true airspeeds across the altitude envelope.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Control Panel */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                        <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                            <Zap className="text-amber-400 w-4 h-4" />
                            Cockpit Inputs
                        </h3>

                        <div className="space-y-8">
                            <div>
                                <label className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                    <span>Indicated Speed (IAS)</span>
                                    <span className="text-white font-mono">{ias} KTS</span>
                                </label>
                                <input
                                    type="range" min="40" max="250" step="1"
                                    value={ias}
                                    onChange={(e) => setIas(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                                />
                            </div>

                            <div>
                                <label className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                    <span>Pressure Altitude</span>
                                    <span className="text-white font-mono">{altitude} FT</span>
                                </label>
                                <input
                                    type="range" min="0" max="45000" step="500"
                                    value={altitude}
                                    onChange={(e) => setAltitude(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-500"
                                />
                            </div>

                            <div>
                                <label className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                    <span>Static Air Temp (SAT)</span>
                                    <span className={`font-mono ${oat < isaTempAtAlt ? 'text-blue-400' : 'text-orange-400'}`}>{oat}°C</span>
                                </label>
                                <input
                                    type="range" min="-60" max="40" step="1"
                                    value={oat}
                                    onChange={(e) => setOat(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                />
                                <div className="mt-2 text-[10px] text-slate-500 flex justify-between">
                                    <span>ISA: {isaTempAtAlt.toFixed(1)}°C</span>
                                    <span>DEV: {tempDev > 0 ? '+' : ''}{tempDev.toFixed(1)}°C</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowCorrection(!showCorrection)}
                            className="w-full mt-8 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-xs uppercase tracking-widest transition-colors border border-slate-700"
                        >
                            {showCorrection ? 'Hide Corrections' : 'Show Speed Chain'}
                        </button>
                    </div>

                    <div className="bg-sky-500/10 border border-sky-500/20 p-6 rounded-2xl">
                        <h4 className="flex items-center gap-2 text-sky-400 font-bold mb-2 text-sm uppercase">
                            <Info className="w-4 h-4" />
                            Correction Logic
                        </h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed italic">
                            "CAS corrected for compressibility is EAS. EAS corrected for density is TAS. As altitude increases, dynamic pressure decreases, so TAS must increase to maintain the same IAS."
                        </p>
                    </div>
                </div>

                {/* Main Instrument Display */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 md:p-12 flex flex-col items-center relative overflow-hidden min-h-[400px] md:min-h-[500px]">

                        {/* Speed Chain Visualizer */}
                        {showCorrection && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="absolute left-4 md:left-8 top-12 bottom-12 w-40 md:w-48 bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/5 z-20 flex flex-col justify-between"
                            >
                                <div className="space-y-1">
                                    <div className="text-[8px] font-black text-slate-500 uppercase">Indicated</div>
                                    <div className="text-xl font-black text-white">{ias}</div>
                                </div>
                                <div className="text-center text-slate-600">↓ Error</div>
                                <div className="space-y-1">
                                    <div className="text-[8px] font-black text-sky-500 uppercase">Calibrated</div>
                                    <div className="text-xl font-black text-sky-400">{cas}</div>
                                </div>
                                <div className="text-center text-slate-600">↓ Compress</div>
                                <div className="space-y-1">
                                    <div className="text-[8px] font-black text-indigo-500 uppercase">Equivalent</div>
                                    <div className="text-xl font-black text-indigo-400">{Math.round(eas)}</div>
                                </div>
                                <div className="text-center text-slate-600">↓ Density</div>
                                <div className="space-y-1">
                                    <div className="text-[8px] font-black text-orange-500 uppercase">True Airspeed</div>
                                    <div className="text-2xl font-black text-orange-400">{Math.round(tas)}</div>
                                </div>
                            </motion.div>
                        )}

                        {/* ASI Face */}
                        <div className="w-64 h-64 md:w-72 md:h-72 rounded-full bg-slate-950 border-[12px] border-slate-800 shadow-2xl relative flex items-center justify-center transform scale-95 md:scale-100">
                            {/* Color Arcs */}
                            <svg className="absolute inset-0 w-full h-full -rotate-90">
                                {/* White Arc (Flaps) */}
                                <circle
                                    cx="50%" cy="50%" r="45%"
                                    className="stroke-white fill-none"
                                    strokeWidth="10"
                                    strokeDasharray={`${(V_FE - V_SO) * 0.8} 1000`}
                                    strokeDashoffset={`-${V_SO * 0.8}`}
                                />
                                {/* Green Arc (Normal) */}
                                <circle
                                    cx="50%" cy="50%" r="45%"
                                    className="stroke-emerald-500 fill-none"
                                    strokeWidth="10"
                                    strokeDasharray={`${(V_NO - V_S1) * 0.8} 1000`}
                                    strokeDashoffset={`-${V_S1 * 0.8}`}
                                />
                                {/* Yellow Arc (Caution) */}
                                <circle
                                    cx="50%" cy="50%" r="45%"
                                    className="stroke-yellow-500 fill-none"
                                    strokeWidth="10"
                                    strokeDasharray={`${(V_NE - V_NO) * 0.8} 1000`}
                                    strokeDashoffset={`-${V_NO * 0.8}`}
                                />
                            </svg>

                            {/* Numbers */}
                            {[0, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240].map((num) => (
                                <div
                                    key={num}
                                    className="absolute inset-4 text-center"
                                    style={{ transform: `rotate(${num * 1.5}deg)` }}
                                >
                                    <span className="text-[10px] font-bold text-slate-500" style={{ transform: `rotate(-${num * 1.5}deg)` }}>
                                        {num}
                                    </span>
                                </div>
                            ))}

                            {/* Pointer */}
                            <motion.div
                                animate={{ rotate: ias * 1.5 }}
                                className="absolute w-1.5 h-28 md:h-32 bg-white origin-bottom bottom-1/2 rounded-full shadow-lg z-10"
                            />

                            {/* TAS Pointer (Optional/Secondary) */}
                            <motion.div
                                animate={{ rotate: tas * 1.5 }}
                                className="absolute w-1 h-28 md:h-32 bg-orange-500/40 origin-bottom bottom-1/2 rounded-full z-0"
                            />

                            <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-slate-800 rounded-full border-2 border-slate-900 z-20"></div>

                            <div className="mt-24 text-center">
                                <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Knots</div>
                                <div className="text-2xl font-black text-white font-mono">{ias}</div>
                            </div>
                        </div>

                        {/* ASI Markings Legend */}
                        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                            <div className="bg-slate-800/50 p-3 rounded-xl border border-white/5 flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                <div>
                                    <div className="text-[8px] text-slate-500 uppercase font-bold">White Arc</div>
                                    <div className="text-[10px] text-white">Full Flap Range ({V_SO}-{V_FE})</div>
                                </div>
                            </div>
                            <div className="bg-slate-800/50 p-3 rounded-xl border border-white/5 flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                                <div>
                                    <div className="text-[8px] text-slate-500 uppercase font-bold">Green Arc</div>
                                    <div className="text-[10px] text-white">Normal Op ({V_S1}-{V_NO})</div>
                                </div>
                            </div>
                            <div className="bg-slate-800/50 p-3 rounded-xl border border-white/5 flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                                <div>
                                    <div className="text-[8px] text-slate-500 uppercase font-bold">Yellow Arc</div>
                                    <div className="text-[10px] text-white">Caution (Calm Air)</div>
                                </div>
                            </div>
                            <div className="bg-slate-800/50 p-3 rounded-xl border border-red-500/30 flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                <div>
                                    <div className="text-[8px] text-slate-500 uppercase font-bold">Red Line</div>
                                    <div className="text-[10px] text-white">V<sub>NE</sub> ({V_NE} Kts)</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* V-Speeds Detail */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                            <h4 className="flex items-center gap-2 text-white font-bold mb-4">
                                <ShieldAlert className="text-orange-400 w-4 h-4" />
                                V-Speed Definitions
                            </h4>
                            <ul className="text-xs text-slate-400 space-y-2">
                                <li><strong>V<sub>SO</sub>:</strong> Smallest speed. Stall speed with full flaps (bottom of white).</li>
                                <li><strong>V<sub>S1</sub>:</strong> Stall speed clean (bottom of green).</li>
                                <li><strong>V<sub>LE</sub>:</strong> Max landing gear extended speed.</li>
                                <li><strong>V<sub>LO</sub>:</strong> Max landing gear operating speed (moving).</li>
                            </ul>
                        </div>

                        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                            <h4 className="flex items-center gap-2 text-white font-bold mb-4 text-sm uppercase">
                                <Activity className="text-sky-400 w-4 h-4" />
                                Critical Truths
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                The ASI measures <strong>Dynamic Pressure (q)</strong>. It is the difference between Pitot (Total) and Static.
                            </p>
                            <div className="mt-4 p-3 bg-black/40 rounded border border-white/5 text-center">
                                <span className="text-[10px] font-mono text-slate-500 uppercase mr-2">Formula:</span>
                                <span className="text-xs font-bold text-white font-mono tracking-widest">q = ½ ρ v²</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Advanced ASI Theory (NEW) */}
            <div className="mt-12 pt-12 border-t border-slate-800 grid md:grid-cols-2 gap-12">
                <div>
                    <h3 className="text-xl font-bold text-white mb-6">The Speed Chain</h3>
                    <div className="space-y-4">
                        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 hover:border-sky-500/30 transition-colors">
                            <h4 className="font-bold text-white text-sm mb-1 uppercase tracking-wider">IAS &rarr; CAS</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Corrected for <strong>Instrument</strong> (manufacturing) and <strong>Position</strong> (airflow around fuselage) errors. Usually very small difference in modern jets.
                            </p>
                        </div>
                        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 hover:border-sky-500/30 transition-colors">
                            <h4 className="font-bold text-white text-sm mb-1 uppercase tracking-wider">CAS &rarr; EAS</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Corrected for <strong>Compressibility</strong>. Crucial above 260 kts / Mach 0.4. IAS will overread as air particles compress into the probe.
                            </p>
                        </div>
                        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 hover:border-sky-500/30 transition-colors">
                            <h4 className="font-bold text-white text-sm mb-1 uppercase tracking-wider">EAS &rarr; TAS</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Corrected for <strong>Density</strong>. Since density (ρ) decreases with altitude, TAS is always higher than IAS at height (Ice Cold Beer &rarr; IAS CAS EAS TAS).
                            </p>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-bold text-white mb-6">Failure & Mach Theory</h3>
                    <div className="space-y-4">
                        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-600">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="text-xs font-black text-slate-200 uppercase">Pitot Blockage</h4>
                                <span className="text-[10px] bg-red-500/20 text-red-500 px-2 py-0.5 rounded font-bold italic">ACTS AS ALTIMETER</span>
                            </div>
                            <p className="text-[11px] text-slate-400">
                                In a climb, trapped air in the capsule expands against lower ambient static pressure &rarr; <strong>ASI Overreads</strong>. PUD: Underreads in Descent.
                            </p>
                        </div>

                        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-600">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="text-xs font-black text-slate-200 uppercase">Mach Number (M)</h4>
                            </div>
                            <p className="text-[11px] text-slate-400 mb-2">Ratio of True Airspeed (TAS) to Local Speed of Sound (LSS).</p>
                            <div className="grid grid-cols-2 gap-2 text-center">
                                <div className="p-2 bg-black/40 rounded border border-white/5">
                                    <p className="text-[8px] text-slate-500 uppercase">Mach</p>
                                    <p className="text-xs font-bold text-white font-mono">TAS / LSS</p>
                                </div>
                                <div className="p-2 bg-black/40 rounded border border-white/5">
                                    <p className="text-[8px] text-slate-500 uppercase">LSS @ SL (ISA)</p>
                                    <p className="text-xs font-bold text-white font-mono">661 KTS</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-sky-900/10 p-4 rounded-xl border border-sky-900/50">
                            <h4 className="text-xs font-bold text-sky-400 mb-2 uppercase flex items-center gap-2">
                                <Thermometer size={14} /> Critical Mach
                            </h4>
                            <p className="text-[10px] text-slate-300 leading-relaxed">
                                <strong>M<sub>CRIT</sub>:</strong> The speed at which airflow over any part of the wing first reaches the speed of sound.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AirspeedIndicator;
