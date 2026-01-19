import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Activity, Info, Thermometer, Wind, AlertCircle } from 'lucide-react';

const Machmeter: React.FC = () => {
    const [altitude, setAltitude] = useState(30000);
    const [cas, setCas] = useState(250);
    const [oat, setOat] = useState(-44.4); // ISA at 30k ft

    // Mach formula from PDF: M = sqrt( (PT - PS) / PS ) - simplified conceptual
    // In reality: M = TAS / Local Speed of Sound (LSS)

    // LSS = 38.945 * sqrt(Static Temp in Kelvin)
    const tempKelvin = oat + 273.15;
    const lss = 38.945 * Math.sqrt(tempKelvin);

    // TAS calculation (approximate from CAS and Altitude)
    const tas = cas * (1 + (altitude / 1000) * 0.02); // 2% per 1000ft rule
    const mach = tas / lss;

    // Critical speeds
    const V_MO = 340;  // Max Operating CAS
    const M_MO = 0.82; // Max Operating Mach

    const isMachCritical = mach > 0.8;
    const isCasCritical = cas > 330;

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="mb-12">
                <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
                    <Zap className="text-amber-400" />
                    Machmeter Lab
                </h1>
                <p className="text-slate-400 max-w-2xl">
                    High speed, high altitude. Explore the relationship between Mach number, Calibrated Airspeed (CAS), and the Speed of Sound (LSS).
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Inputs */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                        <h3 className="text-white font-bold mb-6 flex items-center gap-2 text-sm uppercase">
                            <Activity className="text-slate-400 w-4 h-4" />
                            Flight Parameters
                        </h3>

                        <div className="space-y-8">
                            <div>
                                <label className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                    <span>Pressure Altitude</span>
                                    <span className="text-white font-mono">{altitude} FT</span>
                                </label>
                                <input
                                    type="range" min="0" max="50000" step="1000"
                                    value={altitude}
                                    onChange={(e) => {
                                        const alt = parseInt(e.target.value);
                                        setAltitude(alt);
                                        setOat(15 - (alt / 1000) * 1.98); // Auto-update OAT to ISA
                                    }}
                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                />
                            </div>

                            <div>
                                <label className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                    <span>Calibrated ASI (CAS)</span>
                                    <span className="text-white font-mono">{cas} KTS</span>
                                </label>
                                <input
                                    type="range" min="150" max="400" step="5"
                                    value={cas}
                                    onChange={(e) => setCas(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                                />
                            </div>

                            <div>
                                <label className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                    <span>Local Air Temp (SAT)</span>
                                    <span className="text-amber-400 font-mono">{oat.toFixed(1)}°C</span>
                                </label>
                                <input
                                    type="range" min="-80" max="30" step="0.5"
                                    value={oat}
                                    onChange={(e) => setOat(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                />
                                <div className="mt-2 text-[10px] text-slate-500 text-center">
                                    LSS: {lss.toFixed(1)} KTS (Speed of Sound)
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-2xl">
                        <h4 className="flex items-center gap-2 text-amber-400 font-bold mb-2 text-sm uppercase">
                            <Info className="w-4 h-4" />
                            Mach Rule
                        </h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed italic">
                            "Climbing at a constant Mach means IAS (CAS) must <strong>decrease</strong>. Climbing at a constant IAS means Mach number will <strong>increase</strong> because LSS drops with temperature."
                        </p>
                    </div>
                </div>

                {/* Instrument Display */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 flex flex-col items-center">
                        <div className="relative w-72 h-72">
                            {/* Inner Mach Dial */}
                            <div className="absolute inset-0 rounded-full bg-slate-950 border-8 border-slate-800 shadow-2xl flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1">Mach Number</div>
                                    <motion.div
                                        className={`text-6xl font-black font-mono tracking-tighter transition-colors ${isMachCritical ? 'text-red-500' : 'text-white'}`}
                                    >
                                        {mach.toFixed(3)}
                                    </motion.div>
                                    <div className="text-[10px] text-slate-500 mt-2 font-bold uppercase transition-opacity" style={{ opacity: isMachCritical ? 1 : 0.3 }}>
                                        MMO RECHED
                                    </div>
                                </div>

                                {/* Radial Gauge Arc */}
                                <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                                    <circle
                                        cx="50%" cy="50%" r="46%"
                                        className="stroke-slate-800 fill-none"
                                        strokeWidth="4"
                                    />
                                    <motion.circle
                                        cx="50%" cy="50%" r="46%"
                                        className={`fill-none transition-colors ${isMachCritical ? 'stroke-red-500' : 'stroke-amber-400'}`}
                                        strokeWidth="4"
                                        animate={{ strokeDasharray: `${mach * 100} 1000` }}
                                        strokeDashoffset="0"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Speed Relationship Card */}
                        <div className="mt-12 w-full max-w-lg grid grid-cols-2 gap-8">
                            <div className="space-y-2 p-6 bg-slate-800/30 rounded-2xl border border-white/5">
                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase">
                                    <Wind size={12} className="text-sky-400" />
                                    CAS (Indicated)
                                </div>
                                <div className="text-3xl font-black text-white">{cas} <span className="text-sm font-normal text-slate-500">KTS</span></div>
                                <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                                    <motion.div
                                        animate={{ width: `${(cas / 400) * 100}%` }}
                                        className={`h-full ${isCasCritical ? 'bg-red-500' : 'bg-sky-400'}`}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 p-6 bg-slate-800/30 rounded-2xl border border-white/5">
                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase">
                                    <Zap size={12} className="text-orange-400" />
                                    TAS (True)
                                </div>
                                <div className="text-3xl font-black text-white">{Math.round(tas)} <span className="text-sm font-normal text-slate-500">KTS</span></div>
                                <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                                    <motion.div
                                        animate={{ width: `${(tas / 600) * 100}%` }}
                                        className="h-full bg-orange-400"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Technical Notes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                            <h4 className="flex items-center gap-2 text-white font-bold mb-4">
                                <AlertCircle className="text-red-500 w-4 h-4" />
                                Critical Mach (M<sub>CR</sub>)
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                The free stream Mach number where the <strong>local flow</strong> anywhere on the aircraft first reaches Mach 1.0. This happens on the upper wing surface due to acceleration. MMO is slightly higher than MCR.
                            </p>
                        </div>

                        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                            <h4 className="flex items-center gap-2 text-white font-bold mb-4">
                                <Thermometer className="text-orange-400 w-4 h-4" />
                                Temperature Dependency
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                local speed of sound (LSS) depends <strong>only on temperature</strong>. Mach is the ratio of (PT-PS)/PS but conceptually it represents TAS/LSS.
                            </p>
                            <div className="mt-4 p-3 bg-black/40 rounded border border-white/5 text-center text-[10px] font-mono text-slate-300">
                                Constant Mach + Descent = Increasing IAS
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Machmeter;
