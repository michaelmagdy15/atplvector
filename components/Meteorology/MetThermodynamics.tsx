import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Thermometer, ArrowUp, ArrowDown, Cloud, Mountain, Info, AlertTriangle, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';

const MetThermodynamics: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'stability' | 'cloudbase' | 'foehn'>('stability');

    return (
        <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white flex items-center gap-3">
                        <div className="p-3 bg-orange-500/20 rounded-xl border border-orange-500/30">
                            <Thermometer className="text-orange-500" size={32} />
                        </div>
                        Thermodynamics & Atmospheric Stability
                    </h2>
                    <p className="text-slate-400 mt-2 text-base font-light">
                        Adiabatic lapse rates, the 3-state atmospheric stability framework, Bradbury cloud base calculation, and Foehn thermodynamics.
                    </p>
                </div>
                <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800 backdrop-blur-md">
                    {(['stability', 'cloudbase', 'foehn'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${
                                activeTab === tab ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/40' : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            {tab === 'stability' ? 'Lapse Rates & Stability' : tab === 'cloudbase' ? 'Bradbury Rule (Cloud Base)' : 'Foehn Effect'}
                        </button>
                    ))}
                </div>
            </header>

            <div className="min-h-[500px]">
                {activeTab === 'stability' && <StabilityModule />}
                {activeTab === 'cloudbase' && <CloudBaseModule />}
                {activeTab === 'foehn' && <FoehnEffectModule />}
            </div>
        </div>
    );
};

// --- SUB-MODULES ---

const StabilityModule: React.FC = () => {
    const [elr, setElr] = useState(2.0); // Environmental Lapse Rate C/1000ft

    // Croucher canonical ATPL values
    const dalr = 3.0; // 3.0°C / 1,000 ft (1.0°C / 100m)
    const salr = 1.8; // ~1.8°C / 1,000 ft (0.6°C / 100m)
    const isaLapse = 2.0; // Standard atmosphere: 1.98°C rounded to 2.0°C / 1,000 ft

    const getStability = () => {
        if (elr > dalr) {
            return {
                status: 'ABSOLUTE INSTABILITY',
                badge: 'Superadiabatic / Unstable',
                color: 'text-red-400',
                border: 'border-red-500/50',
                bg: 'bg-red-500/10',
                desc: 'ELR > DALR (steep lapse rate). Any displaced air parcel is warmer than its surroundings and accelerates upwards continuously.',
                clouds: 'Cumuliform: Towering Cumulus (TCU), Cumulonimbus (CB)',
                turbulence: 'Moderate to severe convective turbulence, squalls',
                visibility: 'Excellent outside precipitation (active vertical mixing)',
                precipitation: 'Showers, hail, thunderstorms'
            };
        }
        if (elr < salr) {
            if (elr < 0) {
                return {
                    status: 'TEMPERATURE INVERSION',
                    badge: 'Extreme Absolute Stability',
                    color: 'text-purple-400',
                    border: 'border-purple-500/50',
                    bg: 'bg-purple-500/10',
                    desc: 'ELR < 0°C/1,000ft (temperature increases with altitude). Inversion acts as a rigid lid, preventing any vertical motion.',
                    clouds: 'Stratus, Stratocumulus, Fog, or clear air with smoke/haze layer',
                    turbulence: 'Extremely smooth, calm air (windshear may exist across the boundary)',
                    visibility: 'Very poor below inversion; trapped industrial haze, dust, fog',
                    precipitation: 'Nil or light drizzle'
                };
            }
            if (elr === 0) {
                return {
                    status: 'ISOTHERMAL LAYER',
                    badge: 'Neutral / Stable',
                    color: 'text-sky-400',
                    border: 'border-sky-500/50',
                    bg: 'bg-sky-500/10',
                    desc: 'ELR = 0°C/1,000ft (temperature unchanged with height). High stability, typical of lower stratosphere.',
                    clouds: 'Stratiform or cloudless',
                    turbulence: 'Smooth',
                    visibility: 'Hazy near surface',
                    precipitation: 'None'
                };
            }
            return {
                status: 'ABSOLUTE STABILITY',
                badge: 'Sub-adiabatic Stable',
                color: 'text-blue-400',
                border: 'border-blue-500/50',
                bg: 'bg-blue-500/10',
                desc: 'ELR < SALR. Displaced parcel is always colder than ambient air whether dry or saturated, resisting motion and sinking back.',
                clouds: 'Stratiform: Stratus (St), Altostratus (As), Nimbostratus (Ns)',
                turbulence: 'Smooth air, no convective activity',
                visibility: 'Poor to moderate, haze and pollutants trapped near ground',
                precipitation: 'Continuous steady rain or drizzle'
            };
        }
        return {
            status: 'CONDITIONAL INSTABILITY',
            badge: 'Trigger-Dependent',
            color: 'text-amber-400',
            border: 'border-amber-500/50',
            bg: 'bg-amber-500/10',
            desc: 'SALR < ELR < DALR. Stable if parcel remains unsaturated (dry), but violently unstable once lifted past the Lifting Condensation Level (LCL) where latent heat warms it above ambient.',
            clouds: 'Scattered cumulus if dry; explosive Cb if orographic, frontal, or thermal lift triggers saturation',
            turbulence: 'Mild initially, becoming severe if convective updrafts activate',
            visibility: 'Moderate, improving rapidly as showers develop',
            precipitation: 'Isolated to scattered heavy convective showers'
        };
    };

    const status = getStability();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">Atmospheric Lapse Rate Graph</h3>
                    <span className="text-xs font-mono px-3 py-1 bg-slate-800 text-slate-300 rounded-full border border-slate-700">
                        ISA = 2.0°C / 1,000 ft
                    </span>
                </div>

                {/* SVG Graph: Temp (X-axis, left to right = cold to warm) vs Height (Y-axis, bottom to top) */}
                <div className="relative h-72 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden p-2">
                    <svg className="w-full h-full" viewBox="0 0 360 220">
                        {/* Grid lines */}
                        <line x1="50" y1="190" x2="330" y2="190" stroke="#334155" strokeWidth="2" />
                        <line x1="50" y1="20" x2="50" y2="190" stroke="#334155" strokeWidth="2" />

                        {/* Axis Labels */}
                        <text x="15" y="30" fill="#94a3b8" fontSize="10" fontWeight="bold">Alt (ft)</text>
                        <text x="15" y="110" fill="#64748b" fontSize="9">5,000</text>
                        <text x="15" y="190" fill="#64748b" fontSize="9">SFC</text>

                        <text x="60" y="205" fill="#64748b" fontSize="9">-10°C</text>
                        <text x="210" y="205" fill="#64748b" fontSize="9">+15°C (ISA SFC)</text>
                        <text x="310" y="205" fill="#64748b" fontSize="9">+30°C</text>

                        {/* Reference Ground Origin: 210, 190 (SFC = +15°C) */}
                        {/* Height = 10,000 ft at y = 30 (dy = 160px) */}
                        {/* Rate 1°C = 7px on X axis. In 10k ft: */}
                        {/* DALR = 30°C drop -> dx = -30 * 4 = -120px -> x = 90 */}
                        {/* SALR = 18°C drop -> dx = -18 * 4 = -72px -> x = 138 */}
                        {/* ISA = 20°C drop -> dx = -20 * 4 = -80px -> x = 130 */}
                        {/* ELR = elr * 10°C drop -> dx = -(elr * 10) * 4 = -(elr * 40) */}

                        {/* Shaded Conditional Instability Sector */}
                        <polygon
                            points={`210,190 90,30 138,30`}
                            fill="#f59e0b"
                            fillOpacity="0.08"
                        />

                        {/* DALR Reference (Dry: 3°C / 1000 ft) */}
                        <line x1="210" y1="190" x2="90" y2="30" stroke="#60a5fa" strokeWidth="2" strokeDasharray="5 5" opacity="0.7" />
                        <text x="75" y="25" fill="#60a5fa" fontSize="9" fontWeight="bold">DALR (3.0°)</text>

                        {/* SALR Reference (Saturated: ~1.8°C / 1000 ft) */}
                        <line x1="210" y1="190" x2="138" y2="30" stroke="#34d399" strokeWidth="2" strokeDasharray="5 5" opacity="0.7" />
                        <text x="140" y="25" fill="#34d399" fontSize="9" fontWeight="bold">SALR (1.8°)</text>

                        {/* ISA Reference (2.0°C / 1000 ft) */}
                        <line x1="210" y1="190" x2="130" y2="30" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />

                        {/* Dynamic ELR Line */}
                        {(() => {
                            const topX = 210 - (elr * 40);
                            return (
                                <g>
                                    <line
                                        x1="210"
                                        y1="190"
                                        x2={topX}
                                        y2="30"
                                        stroke={elr > dalr ? '#f87171' : elr < salr ? '#60a5fa' : '#fbbf24'}
                                        strokeWidth="3.5"
                                    />
                                    <circle cx={topX} cy="30" r="4" fill={elr > dalr ? '#f87171' : elr < salr ? '#60a5fa' : '#fbbf24'} />
                                    <text
                                        x={Math.max(60, Math.min(300, topX - 10))}
                                        y="45"
                                        fill="white"
                                        fontSize="10"
                                        fontWeight="bold"
                                    >
                                        ELR ({elr.toFixed(1)}°)
                                    </text>
                                </g>
                            );
                        })()}

                        {/* Surface Dot */}
                        <circle cx="210" cy="190" r="4" fill="#fbbf24" />
                        <text x="220" y="185" fill="#fbbf24" fontSize="9">Surface Parcel (+15°C)</text>
                    </svg>
                </div>

                <div>
                    <div className="flex justify-between text-sm font-bold text-slate-300 mb-2">
                        <span>Environmental Lapse Rate (ELR)</span>
                        <span className="font-mono text-orange-400 text-base">{elr.toFixed(1)}°C / 1,000 ft</span>
                    </div>
                    <input
                        type="range"
                        min="-2.0"
                        max="4.5"
                        step="0.1"
                        value={elr}
                        onChange={(e) => setElr(parseFloat(e.target.value))}
                        className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                    <div className="grid grid-cols-4 text-[10px] text-slate-500 mt-2 font-mono">
                        <button onClick={() => setElr(-1.5)} className="text-left hover:text-purple-400">Inversion (-1.5°)</button>
                        <button onClick={() => setElr(1.2)} className="text-center hover:text-blue-400">Stable (1.2°)</button>
                        <button onClick={() => setElr(2.0)} className="text-center hover:text-yellow-400">ISA Standard (2.0°)</button>
                        <button onClick={() => setElr(3.6)} className="text-right hover:text-red-400">Unstable (3.6°)</button>
                    </div>
                </div>

                <div className={`p-5 rounded-2xl border ${status.border} ${status.bg} transition-all`}>
                    <div className="flex justify-between items-center mb-1">
                        <h4 className={`text-base font-black tracking-wide ${status.color}`}>{status.status}</h4>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900/60 text-slate-300 border border-white/5">
                            {status.badge}
                        </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed mt-2">{status.desc}</p>

                    <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/5 text-xs">
                        <div>
                            <span className="text-slate-500 block text-[10px] uppercase font-bold">Cloud Types</span>
                            <span className="text-slate-200 font-medium">{status.clouds}</span>
                        </div>
                        <div>
                            <span className="text-slate-500 block text-[10px] uppercase font-bold">Turbulence</span>
                            <span className="text-slate-200 font-medium">{status.turbulence}</span>
                        </div>
                        <div>
                            <span className="text-slate-500 block text-[10px] uppercase font-bold">Visibility</span>
                            <span className="text-slate-200 font-medium">{status.visibility}</span>
                        </div>
                        <div>
                            <span className="text-slate-500 block text-[10px] uppercase font-bold">Precipitation</span>
                            <span className="text-slate-200 font-medium">{status.precipitation}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <BookOpen size={18} className="text-orange-400" />
                        ATPL Stability Framework (Croucher Ch 14)
                    </h3>
                    <div className="space-y-4 text-sm">
                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-mono text-blue-400 font-bold">DALR (Dry Adiabatic)</span>
                                <span className="text-xs font-mono text-white bg-blue-500/20 px-2 py-0.5 rounded">3.0°C / 1,000 ft (1.0°C / 100m)</span>
                            </div>
                            <p className="text-xs text-slate-400">
                                The constant rate of cooling of an unsaturated rising parcel due purely to expansion under decreasing hydrostatic pressure.
                            </p>
                        </div>

                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-mono text-green-400 font-bold">SALR (Saturated Adiabatic)</span>
                                <span className="text-xs font-mono text-white bg-green-500/20 px-2 py-0.5 rounded">~1.8°C / 1,000 ft (0.6°C / 100m)</span>
                            </div>
                            <p className="text-xs text-slate-400">
                                Slower than DALR because water vapor condenses, releasing <strong>latent heat of condensation</strong> (~2.5 × 10⁶ J/kg), which partially warms the rising parcel.
                            </p>
                        </div>

                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-mono text-slate-200 font-bold">ELR (Environmental)</span>
                                <span className="text-xs font-mono text-white bg-slate-700/50 px-2 py-0.5 rounded">ISA: 2.0°C / 1,000 ft (0.65°C / 100m)</span>
                            </div>
                            <p className="text-xs text-slate-400">
                                The ambient temperature gradient measured by radiosondes. Governs whether a displaced parcel will accelerate (unstable) or return (stable).
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 p-6 rounded-3xl">
                    <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <AlertTriangle size={16} />
                        Croucher Operational Rules of Thumb
                    </h4>
                    <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
                        <li>
                            <strong className="text-white">• Anticyclonic Subsidence Inversions:</strong> High-pressure sinking air heats adiabatically at DALR, creating a warm layer aloft that caps vertical motion, trapping smog, moisture, and creating radiation fog beneath.
                        </li>
                        <li>
                            <strong className="text-white">• Conditional Instability Triggering:</strong> High surface moisture + steep ELR aloft = benign morning Cu suddenly exploding into severe Cb once solar insolation or terrain lifts air past LCL.
                        </li>
                        <li>
                            <strong className="text-white">• Diurnal Changes:</strong> Clear sunny days create superadiabatic ELR (&gt;3°C/1000ft) near ground level causing daytime thermals and bumps; clear calm nights produce surface radiation inversions.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

const CloudBaseModule: React.FC = () => {
    const [temp, setTemp] = useState(18);
    const [dp, setDp] = useState(8);

    // Bradbury Rule: Cloud Base (ft AGL) = (Temp - DewPoint) / 2.5 * 1000 ft
    // Or Spread * 400 ft
    const spread = Math.max(0, temp - dp);
    const cloudBase = Math.max(0, (spread / 2.5) * 1000);
    const ruleOfThumbAlt = spread * 400;

    const setPreset = (t: number, d: number) => {
        setTemp(t);
        setDp(d);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Cloud className="text-sky-400" /> The Bradbury Rule (Convective Cloud Base / LCL)
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                            Calculates the Lifting Condensation Level (LCL) for convective cumulus clouds based on surface temperature and dew point.
                        </p>
                    </div>

                    {/* Presets */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setPreset(18, 8)}
                            className="px-3 py-1.5 bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 border border-sky-500/30 rounded-xl text-xs font-mono font-bold transition-all"
                        >
                            EHAM METAR (18° / 8°)
                        </button>
                        <button
                            onClick={() => setPreset(28, 12)}
                            className="px-3 py-1.5 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-mono transition-all"
                        >
                            Summer Cu (28° / 12°)
                        </button>
                        <button
                            onClick={() => setPreset(35, 5)}
                            className="px-3 py-1.5 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-mono transition-all"
                        >
                            Arid / Desert (35° / 5°)
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                        <label className="block text-xs font-bold text-orange-400 uppercase tracking-widest mb-3">
                            Surface Air Temperature (°C)
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                type="number"
                                value={temp}
                                onChange={(e) => setTemp(Number(e.target.value))}
                                className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white w-24 font-mono text-xl font-bold focus:border-orange-500 outline-none"
                            />
                            <input
                                type="range"
                                min="-10"
                                max="45"
                                value={temp}
                                onChange={(e) => setTemp(Number(e.target.value))}
                                className="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                            />
                        </div>
                    </div>

                    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                        <label className="block text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">
                            Surface Dew Point Temperature (°C)
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                type="number"
                                value={dp}
                                max={temp}
                                onChange={(e) => setDp(Math.min(temp, Number(e.target.value)))}
                                className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white w-24 font-mono text-xl font-bold focus:border-blue-500 outline-none"
                            />
                            <input
                                type="range"
                                min="-20"
                                max={temp}
                                value={dp}
                                onChange={(e) => setDp(Math.min(temp, Number(e.target.value)))}
                                className="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-950 p-6 rounded-2xl border border-slate-800">
                    <div className="text-center md:text-left">
                        <div className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Temp - Dew Point Spread</div>
                        <div className="text-3xl font-mono font-bold text-white">{spread.toFixed(1)}°C</div>
                        <div className="text-[11px] text-slate-500 mt-1">Depression of dew point</div>
                    </div>

                    <div className="text-center md:text-left border-y md:border-y-0 md:border-x border-slate-800 py-4 md:py-0 md:px-6">
                        <div className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Exact Bradbury Formula</div>
                        <div className="text-4xl font-mono font-black text-sky-400">{Math.round(cloudBase).toLocaleString()} ft</div>
                        <div className="text-[11px] text-sky-300/70 mt-1">AGL (Above Ground Level)</div>
                    </div>

                    <div className="text-center md:text-left">
                        <div className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Rule of Thumb (×400)</div>
                        <div className="text-3xl font-mono font-bold text-emerald-400">{Math.round(ruleOfThumbAlt).toLocaleString()} ft</div>
                        <div className="text-[11px] text-emerald-400/70 mt-1">Spread × 400 ft / °C</div>
                    </div>
                </div>

                {/* Croucher Worked Example Box */}
                <div className="mt-8 bg-slate-800/40 p-6 rounded-2xl border border-white/5 space-y-4">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Sparkles size={16} className="text-amber-400" />
                        Croucher Ch 14 Official Worked Example
                    </h4>
                    <div className="bg-slate-950 p-4 rounded-xl font-mono text-xs text-slate-300 border border-slate-800">
                        <span className="text-teal-400 font-bold">METAR:</span> EHAM 121200Z 24015KT 9999 <span className="text-amber-300 font-bold">FEW040</span> 18/08 Q1015
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 leading-relaxed">
                        <div>
                            <span className="font-bold text-white">Why divide by 2.5?</span>
                            <p className="text-slate-400 mt-1">
                                An unsaturated rising parcel cools at DALR (<strong className="text-slate-200">3.0°C / 1,000 ft</strong>).
                                Meanwhile, the dew point of the rising parcel drops at approximately <strong className="text-slate-200">0.5°C / 1,000 ft</strong>.
                                The rate of closure is:
                            </p>
                            <code className="text-amber-300 block mt-2 font-mono bg-slate-900 px-3 py-1.5 rounded">
                                Closure Rate = 3.0°C - 0.5°C = 2.5°C / 1,000 ft
                            </code>
                        </div>
                        <div>
                            <span className="font-bold text-white">Application to EHAM:</span>
                            <ul className="text-slate-400 mt-1 space-y-1">
                                <li>• Surface Temp = <span className="text-white">18°C</span>, Dew Point = <span className="text-white">8°C</span></li>
                                <li>• Spread = <span className="text-white">18 - 8 = 10°C</span></li>
                                <li>• Cloud Base = <span className="text-white">(10 / 2.5) × 1,000 ft = 4,000 ft AGL</span></li>
                                <li className="text-emerald-400 font-bold">• Matches reported FEW040 exactly!</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FoehnEffectModule: React.FC = () => {
    const [startTemp, setStartTemp] = useState(20);
    const [startDP, setStartDP] = useState(10);
    const [peakHeight, setPeakHeight] = useState(8000); // ft

    // 1. Rise DALR (3°C/1000ft) until Cloud Base (Bradbury)
    const spread = Math.max(0, startTemp - startDP);
    const cloudBase = Math.min(peakHeight, (spread / 2.5) * 1000);

    // 2. Temp at Base
    const tempAtBase = startTemp - (3.0 * (cloudBase / 1000));

    // 3. Rise SALR (1.8°C/1000ft) from Base to Peak (moisture condenses and rains out)
    const saturatedHeight = Math.max(0, peakHeight - cloudBase);
    const tempAtPeak = tempAtBase - (1.8 * (saturatedHeight / 1000));

    // 4. Descend DALR (3°C/1000ft) on leeward all the way from peak to sea level
    const finalTemp = tempAtPeak + (3.0 * (peakHeight / 1000));
    const netWarming = finalTemp - startTemp;

    return (
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Mountain className="text-orange-400" /> The Foehn Effect (Chinook Wind) Thermodynamics
                    </h3>
                    <p className="text-slate-400 text-sm mt-1">
                        Asymmetric heating cycle: Air rises and cools at SALR with precipitation loss, then descends and warms at DALR.
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <span className="text-xs font-bold text-slate-400">Mountain Peak:</span>
                    <span className="text-sm font-mono font-bold text-white">{peakHeight} ft</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* WINDWARD */}
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center space-y-3">
                    <h4 className="font-bold text-blue-400 uppercase text-xs tracking-wider">Windward Side (Ascent)</h4>
                    <div className="text-4xl font-black text-white">{startTemp}°C</div>
                    <div className="text-xs text-slate-400">Dew Point: {startDP}°C (Spread: {spread}°C)</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                        Cloud Base: {Math.round(cloudBase)} ft
                    </div>
                    <div className="h-24 flex items-end justify-center">
                        <ArrowUp className="text-blue-500 animate-bounce" size={36} />
                    </div>
                </div>

                {/* VISUALIZER */}
                <div className="relative h-64 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col justify-between p-4">
                    <div className="flex justify-between text-[10px] font-mono text-slate-500 z-10">
                        <span>Lifting at DALR (3°)</span>
                        <span>Rain / Snow</span>
                        <span>Descent at DALR (3°)</span>
                    </div>

                    <div className="absolute inset-0 flex items-end">
                        <svg viewBox="0 0 200 100" className="w-full h-full" preserveAspectRatio="none">
                            <path d="M0,100 L70,30 L130,30 L200,100 Z" fill="#334155" stroke="#475569" strokeWidth="1.5" />
                        </svg>
                    </div>

                    {/* Saturated Cloud on Windward Peak */}
                    {saturatedHeight > 0 && (
                        <div className="absolute left-[20%] top-[20%] z-10 animate-pulse flex flex-col items-center">
                            <Cloud className="text-white w-14 h-14 fill-white/80" />
                            <div className="text-[10px] text-blue-300 bg-slate-900/80 px-2 py-0.5 rounded border border-blue-500/30">
                                Latent Heat Release
                            </div>
                        </div>
                    )}

                    {/* Peak Indicator */}
                    <div className="z-10 self-center bg-slate-900/90 px-3 py-1 rounded-xl text-xs font-mono font-bold text-white border border-slate-700">
                        Peak: {tempAtPeak.toFixed(1)}°C
                    </div>

                    <div className="z-10 flex justify-between text-xs font-bold text-slate-400">
                        <span>Windward Base</span>
                        <span className="text-red-400">Net Warming: +{netWarming.toFixed(1)}°C</span>
                        <span>Leeward Base</span>
                    </div>
                </div>

                {/* LEEWARD */}
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center space-y-3">
                    <h4 className="font-bold text-red-400 uppercase text-xs tracking-wider">Leeward Side (Descent)</h4>
                    <div className="text-4xl font-black text-red-500">{finalTemp.toFixed(1)}°C</div>
                    <div className="text-xs text-amber-300 font-semibold">Significantly Warmer & Extremely Dry</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                        Heats at DALR (3.0°C / 1,000 ft) all 8,000 ft
                    </div>
                    <div className="h-24 flex items-start justify-center pt-4">
                        <ArrowDown className="text-red-500 animate-bounce" size={36} />
                    </div>
                </div>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 text-xs text-slate-300 leading-relaxed space-y-2">
                <h4 className="font-bold text-white text-sm mb-1 flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    Thermodynamic Proof
                </h4>
                <p>
                    1. Ascending air cools rapidly at <strong className="text-blue-300">DALR (3.0°C/1,000 ft)</strong> until reaching its dew point at the cloud base ({Math.round(cloudBase)} ft).
                </p>
                <p>
                    2. From cloud base to the {peakHeight} ft ridge crest, moisture condenses into rain/snow, releasing latent heat. The air cools at the much slower <strong className="text-emerald-300">SALR (~1.8°C/1,000 ft)</strong>.
                </p>
                <p>
                    3. Having rained out its moisture over the crest, the descending air warms down the entire leeward face at the full <strong className="text-orange-400">DALR (3.0°C/1,000 ft)</strong>.
                </p>
                <p className="font-bold text-white pt-2 border-t border-slate-700">
                    Result: The leeward air arrives at the surface {netWarming.toFixed(1)}°C warmer with very low relative humidity. Creates mountain wave rotors and high wildland fire risks.
                </p>
            </div>
        </div>
    );
};

export default MetThermodynamics;
