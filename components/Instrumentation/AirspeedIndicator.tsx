import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Zap, Info, ShieldAlert, Thermometer, Wind, Activity, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';

const AirspeedIndicator: React.FC = () => {
    const [ias, setIas] = useState(250);
    const [altitude, setAltitude] = useState(28000); // 28,000 ft
    const [oat, setOat] = useState(-41); // OAT in °C
    const [positionError, setPositionError] = useState(3); // kt
    const [instrumentError, setInstrumentError] = useState(1); // kt
    const [activeChainStep, setActiveChainStep] = useState<number | null>(null);

    // 1. CAS = IAS + Instrument Error + Position Error
    const cas = ias + instrumentError + positionError;

    // 2. EAS = CAS - Compressibility Correction
    // Compressibility becomes significant above 200 kt / Mach 0.3
    // EASA approximation: delta_V_c ~ (CAS/100)^2 * (Alt/10000) * 0.5
    const machApprox = cas / 661;
    const compressibilityCorrection = altitude > 5000 && cas > 150
        ? Math.min(25, Math.round(((cas / 100) ** 2) * (altitude / 10000) * 0.45))
        : 0;
    const eas = Math.max(0, cas - compressibilityCorrection);

    // 3. TAS = EAS * sqrt(rho_0 / rho)
    // Standard ISA temperature at altitude
    const isaTempAtAlt = 15 - (altitude / 1000) * 1.98;
    const tempKelvin = oat + 273.15;
    const isaTempKelvin = isaTempAtAlt + 273.15;
    
    // Density ratio approximation (considering pressure altitude and temperature deviation)
    // Pressure ratio delta = (1 - 2.25577e-5 * h)^5.25588
    const pressureRatio = Math.max(0.1, (1 - 0.0000225577 * altitude) ** 5.25588);
    const densityRatio = pressureRatio * (288.15 / tempKelvin);
    const tas = eas / Math.sqrt(Math.max(0.1, densityRatio));

    // 4. Local Speed of Sound (LSS) & Mach Number
    // a = 38.945 * sqrt(T_K)
    const lss = 38.945 * Math.sqrt(tempKelvin);
    const mach = tas / lss;

    // ASI Color Arc Definitions (Light twin / turboprop typical numbers)
    const V_SO = 65;   // Stall speed landing configuration (bottom of white)
    const V_FE = 125;  // Max Flap Extended speed (top of white)
    const V_S1 = 78;   // Stall speed clean (bottom of green)
    const V_NO = 210;  // Max Structural Cruising speed (top of green / bottom of yellow)
    const V_NE = 280;  // Never Exceed speed (red radial line)

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="mb-10">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-widest mb-2">
                    <span>AGK 022</span>
                    <span>•</span>
                    <span>Dynamic Pressure & Airspeed Architecture</span>
                </div>
                <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
                    <Plane className="text-sky-400" />
                    Airspeed Indicator (ASI) & ADC Speed Chain
                </h1>
                <p className="text-slate-400 max-w-3xl leading-relaxed text-sm">
                    The Airspeed Indicator measures dynamic pressure (<span className="text-sky-400 font-mono font-bold">q = &frac12;&rho;V&sup2; = P<sub>t</sub> − P<sub>s</sub></span>).
                    Explore how raw probe pressure progresses through the <strong className="text-white">Air Data Computer (ADC) Speed Chain</strong>:
                    <span className="text-white font-mono font-bold"> IAS &rarr; CAS &rarr; EAS &rarr; TAS</span> and High-Mach compressibility.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Flight & Atmospheric Inputs */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow-xl">
                        <h3 className="text-white font-bold mb-5 flex items-center gap-2 text-sm uppercase tracking-wider">
                            <Zap className="text-amber-400 w-4 h-4" />
                            Cockpit & Air Data Inputs
                        </h3>

                        <div className="space-y-5">
                            <div>
                                <label className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                    <span>Indicated Airspeed (IAS)</span>
                                    <span className="text-white font-mono font-bold">{ias} KTS</span>
                                </label>
                                <input
                                    type="range" min="60" max="320" step="5"
                                    value={ias}
                                    onChange={(e) => setIas(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                                />
                                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                                    <span>60 KTS</span>
                                    <span>200 KTS</span>
                                    <span>320 KTS</span>
                                </div>
                            </div>

                            <div>
                                <label className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                    <span>Pressure Altitude</span>
                                    <span className="text-white font-mono font-bold">{altitude.toLocaleString()} FT</span>
                                </label>
                                <input
                                    type="range" min="0" max="45000" step="1000"
                                    value={altitude}
                                    onChange={(e) => {
                                        const alt = parseInt(e.target.value);
                                        setAltitude(alt);
                                        setOat(Math.round(15 - (alt / 1000) * 1.98));
                                    }}
                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                                    <span>SL (0 FT)</span>
                                    <span>FL200</span>
                                    <span>FL450</span>
                                </div>
                            </div>

                            <div>
                                <label className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                    <span>Outside Air Temp (OAT / SAT)</span>
                                    <span className="text-orange-400 font-mono font-bold">{oat}°C</span>
                                </label>
                                <input
                                    type="range" min="-70" max="40" step="1"
                                    value={oat}
                                    onChange={(e) => setOat(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                />
                                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                                    <span>ISA Standard: {isaTempAtAlt.toFixed(0)}°C</span>
                                    <span>LSS: {lss.toFixed(0)} KT</span>
                                </div>
                            </div>

                            {/* Position & Instrument Calibration */}
                            <div className="pt-2 border-t border-slate-800 space-y-3">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">ADC Calibration Corrections</span>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="bg-slate-950 p-2.5 rounded-xl border border-white/5">
                                        <div className="text-[10px] text-slate-400">Position Error:</div>
                                        <div className="font-mono font-bold text-white">+{positionError} KT</div>
                                    </div>
                                    <div className="bg-slate-950 p-2.5 rounded-xl border border-white/5">
                                        <div className="text-[10px] text-slate-400">Instrument Error:</div>
                                        <div className="font-mono font-bold text-white">+{instrumentError} KT</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mnemonic Banner */}
                    <div className="bg-sky-500/10 border border-sky-500/20 p-5 rounded-2xl">
                        <h4 className="flex items-center gap-2 text-sky-400 font-bold mb-2 text-xs uppercase tracking-wider">
                            <Info size={15} />
                            ATPL Speed Chain Mnemonic
                        </h4>
                        <p className="text-xs text-slate-300 font-semibold mb-2">
                            "Ice Cold Beer / In Chicago Eating Tacos"
                        </p>
                        <div className="text-[11px] text-slate-400 space-y-1">
                            <div><strong className="text-white">I</strong>AS &rarr; <span className="text-slate-500">Position/Instrument error</span></div>
                            <div><strong className="text-white">C</strong>AS &rarr; <span className="text-slate-500">Compressibility correction</span></div>
                            <div><strong className="text-white">E</strong>AS &rarr; <span className="text-slate-500">Density correction (&radic;&rho;<sub>0</sub>/&rho;)</span></div>
                            <div><strong className="text-orange-400">T</strong>AS &rarr; <span className="text-slate-500">True Airspeed through the air mass</span></div>
                        </div>
                    </div>
                </div>

                {/* Speed Chain Visualizer & ASI Face */}
                <div className="lg:col-span-2 space-y-6">
                    {/* The 4-Stage ADC Speed Chain Pipeline */}
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-6">
                            <span className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                                <Activity className="w-4 h-4 text-sky-400" />
                                Air Data Computer (ADC) Compensation Chain
                            </span>
                            <span className="text-[10px] font-mono text-emerald-400 font-bold">
                                Live Computation
                            </span>
                        </div>

                        {/* Interactive Steps Flow */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {/* Step 1: IAS */}
                            <div
                                onClick={() => setActiveChainStep(1)}
                                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                                    activeChainStep === 1 ? 'bg-sky-500/20 border-sky-500 shadow-lg' : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                                }`}
                            >
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Raw Dynamic</span>
                                <div className="text-xs font-bold text-white mb-1">IAS</div>
                                <div className="text-2xl font-black text-white font-mono">{ias} <span className="text-xs font-normal text-slate-500">KT</span></div>
                                <p className="text-[10px] text-slate-400 mt-2">Uncorrected dial reading.</p>
                            </div>

                            {/* Step 2: CAS */}
                            <div
                                onClick={() => setActiveChainStep(2)}
                                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                                    activeChainStep === 2 ? 'bg-blue-500/20 border-blue-500 shadow-lg' : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                                }`}
                            >
                                <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest block mb-1">+ Errors ({instrumentError + positionError} KT)</span>
                                <div className="text-xs font-bold text-white mb-1">CAS</div>
                                <div className="text-2xl font-black text-blue-400 font-mono">{cas} <span className="text-xs font-normal text-blue-500/60">KT</span></div>
                                <p className="text-[10px] text-slate-400 mt-2">Position & instrument corrected.</p>
                            </div>

                            {/* Step 3: EAS */}
                            <div
                                onClick={() => setActiveChainStep(3)}
                                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                                    activeChainStep === 3 ? 'bg-indigo-500/20 border-indigo-500 shadow-lg' : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                                }`}
                            >
                                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest block mb-1">− Compress ({compressibilityCorrection} KT)</span>
                                <div className="text-xs font-bold text-white mb-1">EAS</div>
                                <div className="text-2xl font-black text-indigo-400 font-mono">{eas} <span className="text-xs font-normal text-indigo-500/60">KT</span></div>
                                <p className="text-[10px] text-slate-400 mt-2">Compressibility corrected.</p>
                            </div>

                            {/* Step 4: TAS */}
                            <div
                                onClick={() => setActiveChainStep(4)}
                                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                                    activeChainStep === 4 ? 'bg-orange-500/20 border-orange-500 shadow-lg' : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                                }`}
                            >
                                <span className="text-[9px] font-black text-orange-400 uppercase tracking-widest block mb-1">&times; &radic;(&rho;<sub>0</sub>/&rho;)</span>
                                <div className="text-xs font-bold text-white mb-1">TAS</div>
                                <div className="text-2xl font-black text-orange-400 font-mono">{Math.round(tas)} <span className="text-xs font-normal text-orange-500/60">KT</span></div>
                                <p className="text-[10px] text-slate-400 mt-2">Density corrected.</p>
                            </div>
                        </div>

                        {/* Step Details Drawer */}
                        <div className="mt-4 p-4 bg-slate-950 rounded-xl border border-white/5 text-xs text-slate-300">
                            {activeChainStep === 1 && (
                                <div>
                                    <strong className="text-white">Indicated Airspeed (IAS):</strong> Direct mechanical measurement of dynamic pressure (<span className="text-sky-400 font-mono">P<sub>t</sub> − P<sub>s</sub></span>) based on standard sea-level density (1.225 kg/m³).
                                </div>
                            )}
                            {activeChainStep === 2 && (
                                <div>
                                    <strong className="text-white">Calibrated Airspeed (CAS):</strong> Corrected for <em>Instrument Error</em> (friction and mechanical linkage imperfections) and <em>Position/Pressure Error</em> (boundary layer airflow displacement around the static port and pitot probe as Angle of Attack changes).
                                </div>
                            )}
                            {activeChainStep === 3 && (
                                <div>
                                    <strong className="text-white">Equivalent Airspeed (EAS):</strong> Corrected for adiabatic air compression inside the pitot tube. Above 200–250 KT or Mach 0.3, air compresses rather than flowing smoothly, artificially raising pitot pressure. Therefore, <span className="text-indigo-400 font-bold">EAS is always LESS than or equal to CAS</span>!
                                </div>
                            )}
                            {(!activeChainStep || activeChainStep === 4) && (
                                <div>
                                    <strong className="text-white">True Airspeed (TAS):</strong> Corrected for actual ambient air density (<span className="text-orange-400 font-mono">&rho;</span>) at {altitude} FT. Because air is thinner at altitude, the aircraft must fly significantly faster to generate the same dynamic impact pressure on the pitot tube. At FL{altitude/100}, TAS is <strong className="text-orange-400">{Math.round(tas)} KTS</strong> (Mach {mach.toFixed(2)}).
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Cockpit Dial & Speeds */}
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative flex flex-col md:flex-row items-center justify-around gap-8">
                        {/* Dial Face */}
                        <div className="w-64 h-64 rounded-full bg-slate-950 border-[12px] border-slate-800 shadow-2xl relative flex items-center justify-center shrink-0">
                            {/* Color Arcs (SVG) */}
                            <svg className="absolute inset-0 w-full h-full -rotate-90">
                                {/* White Arc (Flaps Extended: 65 to 125 kt) */}
                                <circle
                                    cx="50%" cy="50%" r="44%"
                                    className="stroke-white fill-none"
                                    strokeWidth="8"
                                    strokeDasharray={`${(V_FE - V_SO) * 0.9} 1000`}
                                    strokeDashoffset={`-${V_SO * 0.9}`}
                                />
                                {/* Green Arc (Normal Operating: 78 to 210 kt) */}
                                <circle
                                    cx="50%" cy="50%" r="44%"
                                    className="stroke-emerald-500 fill-none"
                                    strokeWidth="8"
                                    strokeDasharray={`${(V_NO - V_S1) * 0.9} 1000`}
                                    strokeDashoffset={`-${V_S1 * 0.9}`}
                                />
                                {/* Yellow Arc (Caution Range: 210 to 280 kt) */}
                                <circle
                                    cx="50%" cy="50%" r="44%"
                                    className="stroke-amber-400 fill-none"
                                    strokeWidth="8"
                                    strokeDasharray={`${(V_NE - V_NO) * 0.9} 1000`}
                                    strokeDashoffset={`-${V_NO * 0.9}`}
                                />
                            </svg>

                            {/* Numbers around the dial */}
                            {[0, 60, 100, 140, 180, 220, 260, 300].map((num) => (
                                <div
                                    key={num}
                                    className="absolute inset-3 text-center"
                                    style={{ transform: `rotate(${num * 1.1}deg)` }}
                                >
                                    <span className="text-[10px] font-bold text-slate-500 block" style={{ transform: `rotate(-${num * 1.1}deg)` }}>
                                        {num}
                                    </span>
                                </div>
                            ))}

                            {/* IAS Needle (Main White) */}
                            <motion.div
                                animate={{ rotate: ias * 1.1 }}
                                transition={{ type: 'spring', damping: 20 }}
                                className="absolute w-1.5 h-28 bg-white origin-bottom bottom-1/2 rounded-full shadow-lg z-10"
                            />

                            {/* TAS Needle / Bug (Orange) */}
                            <motion.div
                                animate={{ rotate: Math.min(350, tas) * 1.1 }}
                                transition={{ type: 'spring', damping: 20 }}
                                className="absolute w-1 h-28 bg-orange-500/60 origin-bottom bottom-1/2 rounded-full z-0"
                            />

                            {/* Center Nut */}
                            <div className="w-5 h-5 bg-slate-700 rounded-full border-2 border-slate-900 z-20 shadow-md" />

                            <div className="mt-20 text-center">
                                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">KNOTS</span>
                                <div className="text-2xl font-black text-white font-mono">{ias}</div>
                            </div>
                        </div>

                        {/* Dial Color Markings Legend & V-Speeds */}
                        <div className="space-y-3 w-full max-w-xs">
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">ASI Operating Limitations</h4>
                            
                            <div className="p-2.5 bg-slate-950 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded bg-white" />
                                    <span className="text-slate-300 font-semibold">White Arc</span>
                                </div>
                                <span className="font-mono text-slate-400">{V_SO} &ndash; {V_FE} KT (Flap Range)</span>
                            </div>

                            <div className="p-2.5 bg-slate-950 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded bg-emerald-500" />
                                    <span className="text-slate-300 font-semibold">Green Arc</span>
                                </div>
                                <span className="font-mono text-slate-400">{V_S1} &ndash; {V_NO} KT (Normal Op)</span>
                            </div>

                            <div className="p-2.5 bg-slate-950 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded bg-amber-400" />
                                    <span className="text-slate-300 font-semibold">Yellow Arc</span>
                                </div>
                                <span className="font-mono text-slate-400">{V_NO} &ndash; {V_NE} KT (Smooth Air)</span>
                            </div>

                            <div className="p-2.5 bg-slate-950 rounded-xl border border-red-500/20 flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded bg-red-500" />
                                    <span className="text-red-300 font-semibold">Red Radial Line</span>
                                </div>
                                <span className="font-mono text-red-400 font-bold">{V_NE} KT (Never Exceed)</span>
                            </div>

                            <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl text-[11px] text-orange-300 space-y-1">
                                <div className="flex justify-between">
                                    <span>Calculated Mach:</span>
                                    <span className="font-mono font-bold">M {mach.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>TAS vs IAS Delta:</span>
                                    <span className="font-mono font-bold">+{Math.round(tas - ias)} KTS</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AirspeedIndicator;
