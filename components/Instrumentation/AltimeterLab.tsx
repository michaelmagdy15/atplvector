import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Settings, Thermometer, AlertTriangle, HelpCircle, Activity, Mountain, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

const AltimeterLab: React.FC = () => {
    // Basic Flight Parameters
    const [indicatedAlt, setIndicatedAlt] = useState(8000);
    const [actualQnh, setActualQnh] = useState(1013);
    const [subscaleSetting, setSubscaleSetting] = useState(1013);
    const [subscaleMode, setSubscaleMode] = useState<'QNH' | 'QFE' | 'STD'>('QNH');
    const [aerodromeElevation, setAerodromeElevation] = useState(1200); // ft AMSL
    
    // Atmospheric Temperature Parameters
    const [isNonStandardTemp, setIsNonStandardTemp] = useState(true);
    const [oatAtAlt, setOatAtAlt] = useState(-25); // OAT at indicated altitude
    const [terrainElevation, setTerrainElevation] = useState(5500); // Terrain peak

    // Standard ISA Temperature at Indicated Altitude
    // ISA lapse rate ~ 1.98°C (~2°C) per 1000 ft from +15°C SL
    const isaTempAtAlt = 15 - (indicatedAlt / 1000) * 2;
    const currentTemp = isNonStandardTemp ? oatAtAlt : isaTempAtAlt;
    const tempDeviation = currentTemp - isaTempAtAlt; // ΔISA

    // 1. Subscale Pressure Error (27 ft per 1 hPa rule at low levels)
    // If pilot dials subscale higher than actual QNH => altimeter overreads (aircraft lower than indicated)
    const subscaleErrorFt = (subscaleSetting - actualQnh) * 27;

    // 2. Temperature Error Calculation (EASA Rule: 4 ft per 1000 ft per °C deviation below/above ISA)
    // Formula: Correction = 4 * (Alt/1000) * ΔISA
    const tempCorrectionFt = 4 * (indicatedAlt / 1000) * tempDeviation;

    // 3. True Altitude Calculation
    // Base true altitude relative to datum with pressure and temperature deviations
    const trueAltitude = indicatedAlt - subscaleErrorFt + tempCorrectionFt;
    const actualTerrainClearance = trueAltitude - terrainElevation;
    const nominalIndicatedClearance = indicatedAlt - terrainElevation;

    // Subscale Mode Presets
    const handleSetSubscaleMode = (mode: 'QNH' | 'QFE' | 'STD') => {
        setSubscaleMode(mode);
        if (mode === 'QNH') {
            setSubscaleSetting(actualQnh);
        } else if (mode === 'QFE') {
            // QFE = QNH - (Elevation / 27)
            const qfe = Math.round(actualQnh - aerodromeElevation / 27);
            setSubscaleSetting(qfe);
        } else if (mode === 'STD') {
            setSubscaleSetting(1013);
        }
    };

    const isHighToLowRisk = subscaleErrorFt > 0 || tempCorrectionFt < -100;
    const isTerrainWarning = actualTerrainClearance < 1000;

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="mb-10">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">
                    <span>AGK 022</span>
                    <span>•</span>
                    <span>Barometric Altimetry</span>
                </div>
                <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
                    <TrendingUp className="text-emerald-400" />
                    Pressure Altimeter & Barometric Subscale Lab
                </h1>
                <p className="text-slate-400 max-w-3xl leading-relaxed text-sm">
                    Altimeters measure static pressure (<span className="text-emerald-400 font-mono font-bold">P<sub>s</sub></span>) and translate it into height based on the International Standard Atmosphere (ISA).
                    Master subscale datums (QNH, QFE, standard QNE 1013.25 hPa), the <span className="text-amber-400 font-bold">27 ft per 1 hPa rule</span>, and extreme cold-temperature isobar contraction.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Calibration Controls */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow-xl">
                        <h3 className="text-white font-bold mb-5 flex items-center gap-2 text-sm uppercase tracking-wider">
                            <Settings className="text-slate-400 w-4 h-4" />
                            Altimeter & Atmosphere Controls
                        </h3>

                        {/* Indicated Altitude */}
                        <div className="mb-6">
                            <label className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                <span>Indicated Altitude</span>
                                <span className="text-white font-mono">{indicatedAlt.toLocaleString()} FT</span>
                            </label>
                            <input
                                type="range" min="1000" max="25000" step="500"
                                value={indicatedAlt}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    setIndicatedAlt(val);
                                    if (!isNonStandardTemp) {
                                        setOatAtAlt(Math.round(15 - (val / 1000) * 2));
                                    }
                                }}
                                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                                <span>1,000 FT</span>
                                <span>12,000 FT</span>
                                <span>25,000 FT</span>
                            </div>
                        </div>

                        {/* Subscale Setting & Datums */}
                        <div className="mb-6 p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-400 uppercase">Subscale Datum Mode</span>
                                <div className="flex gap-1 bg-slate-900 p-1 rounded-lg border border-white/5">
                                    {(['QNH', 'QFE', 'STD'] as const).map((mode) => (
                                        <button
                                            key={mode}
                                            onClick={() => handleSetSubscaleMode(mode)}
                                            className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-all ${
                                                subscaleMode === mode
                                                    ? 'bg-emerald-500 text-slate-950 font-black'
                                                    : 'text-slate-400 hover:text-white'
                                            }`}
                                        >
                                            {mode}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-1">
                                    <span>Kollsman Window (Subscale)</span>
                                    <span className="text-emerald-400 font-mono font-bold">{subscaleSetting} hPa</span>
                                </label>
                                <input
                                    type="range" min="950" max="1050" step="1"
                                    value={subscaleSetting}
                                    onChange={(e) => {
                                        setSubscaleSetting(parseInt(e.target.value));
                                        setSubscaleMode('QNH'); // custom
                                    }}
                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                                />
                            </div>

                            <div className="text-[10px] text-slate-400 pt-1 flex justify-between border-t border-slate-800/60">
                                <span>Actual Local QNH: <strong className="text-white">{actualQnh} hPa</strong></span>
                                <span>Subscale &Delta;: <strong className={subscaleErrorFt === 0 ? 'text-emerald-400' : 'text-amber-400'}>{subscaleSetting - actualQnh > 0 ? '+' : ''}{subscaleSetting - actualQnh} hPa</strong></span>
                            </div>
                        </div>

                        {/* Temperature Profile */}
                        <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-400 uppercase">Atmosphere Temperature</span>
                                <button
                                    onClick={() => {
                                        setIsNonStandardTemp(!isNonStandardTemp);
                                        if (isNonStandardTemp) {
                                            setOatAtAlt(Math.round(isaTempAtAlt));
                                        }
                                    }}
                                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                                        isNonStandardTemp ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                    }`}
                                >
                                    {isNonStandardTemp ? 'Non-Standard Temp' : 'Standard ISA'}
                                </button>
                            </div>

                            {isNonStandardTemp ? (
                                <div>
                                    <label className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-1">
                                        <span>Outside Air Temp (OAT) @ {indicatedAlt} FT</span>
                                        <span className={`font-mono font-bold ${oatAtAlt < isaTempAtAlt ? 'text-blue-400' : 'text-orange-400'}`}>
                                            {oatAtAlt}°C
                                        </span>
                                    </label>
                                    <input
                                        type="range" min="-60" max="30" step="1"
                                        value={oatAtAlt}
                                        onChange={(e) => setOatAtAlt(parseInt(e.target.value))}
                                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                    />
                                    <div className="mt-2 text-[10px] text-slate-400 flex justify-between font-mono">
                                        <span>ISA Standard: {isaTempAtAlt.toFixed(0)}°C</span>
                                        <span className={tempDeviation < 0 ? 'text-blue-400 font-bold' : 'text-orange-400'}>
                                            &Delta;ISA: {tempDeviation > 0 ? '+' : ''}{tempDeviation.toFixed(0)}°C
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-[10px] text-slate-500">
                                    Atmosphere perfectly follows ISA standard (15°C at MSL, −2°C/1,000 ft lapse rate).
                                </p>
                            )}
                        </div>

                        {/* Preset Worked Example from Chapter 6 */}
                        <div className="pt-2">
                            <button
                                onClick={() => {
                                    setIndicatedAlt(8000);
                                    setActualQnh(1013);
                                    setSubscaleSetting(1013);
                                    setSubscaleMode('QNH');
                                    setIsNonStandardTemp(true);
                                    setOatAtAlt(-25);
                                    setTerrainElevation(5500);
                                }}
                                className="w-full py-2.5 px-3 bg-gradient-to-r from-blue-900/40 to-slate-800 hover:from-blue-800/40 text-blue-200 rounded-xl text-xs font-bold border border-blue-500/30 flex items-center justify-center gap-2"
                            >
                                <Mountain size={14} className="text-blue-400" />
                                <span>Load Ch 06 Cold Mountain Scenario (8,000' / -25°C)</span>
                            </button>
                        </div>
                    </div>

                    {/* Golden Rule of Thumb Box */}
                    <div className={`p-5 rounded-2xl border-l-4 transition-all ${
                        isHighToLowRisk ? 'bg-red-500/10 border-red-500' : 'bg-emerald-500/10 border-emerald-500'
                    }`}>
                        <div className="flex gap-3">
                            <AlertTriangle className={isHighToLowRisk ? 'text-red-400 shrink-0' : 'text-emerald-400 shrink-0'} />
                            <div>
                                <h4 className="text-white font-bold text-xs uppercase mb-1">
                                    {isHighToLowRisk ? 'Warning: High to Low Danger' : 'Standard Datum State'}
                                </h4>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    <em>"From High to Low (pressure or temperature), Look Out Below!"</em>
                                </p>
                                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                                    When air is colder than ISA or pressure drops without updating subscale, the true isobar columns contract: the aircraft flies <strong>lower than the instrument indicates</strong>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Display & Analysis Area */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Altimeter Face & Digital Readouts */}
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden flex flex-col md:flex-row items-center justify-around gap-6">
                        {/* 3-Pointer Altimeter Gauge */}
                        <div className="w-60 h-60 rounded-full border-[10px] border-slate-800 bg-slate-950 shadow-2xl relative flex items-center justify-center shrink-0">
                            {/* Kollsman Window Simulation */}
                            <div className="absolute right-7 top-1/2 -translate-y-1/2 bg-slate-900 px-2 py-0.5 rounded border border-white/20 text-[9px] font-mono text-emerald-400">
                                {subscaleSetting}
                            </div>

                            {/* Dial Numbers 0 to 9 */}
                            {[...Array(10)].map((_, i) => (
                                <div key={i} className="absolute inset-3 text-center" style={{ transform: `rotate(${i * 36}deg)` }}>
                                    <span className="text-slate-400 font-bold block text-sm" style={{ transform: `rotate(-${i * 36}deg)` }}>
                                        {i}
                                    </span>
                                </div>
                            ))}

                            {/* 10,000 ft Hand (Thin with cross/inverted triangle) */}
                            <motion.div
                                animate={{ rotate: (indicatedAlt / 100000) * 360 }}
                                className="absolute w-1 h-14 bg-white/40 origin-bottom bottom-1/2 rounded-full"
                            />
                            {/* 1,000 ft Hand (Broad needle) */}
                            <motion.div
                                animate={{ rotate: (indicatedAlt / 10000) * 360 }}
                                className="absolute w-2.5 h-20 bg-white origin-bottom bottom-1/2 rounded-full shadow-lg"
                            />
                            {/* 100 ft Hand (Long thin needle) */}
                            <motion.div
                                animate={{ rotate: (indicatedAlt / 1000) * 360 }}
                                className="absolute w-1 h-24 bg-emerald-400 origin-bottom bottom-1/2 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                            />

                            {/* Center Nut */}
                            <div className="w-5 h-5 bg-slate-700 rounded-full z-10 border-2 border-slate-950 shadow-inner" />
                        </div>

                        {/* Readout Numbers Grid */}
                        <div className="space-y-4 w-full max-w-xs">
                            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                                <span className="text-[10px] font-bold text-slate-500 uppercase block">Indicated Altitude</span>
                                <div className="text-3xl font-black text-white font-mono">
                                    {indicatedAlt.toLocaleString()} <span className="text-xs font-normal text-slate-500">FT</span>
                                </div>
                                <span className="text-[9px] text-slate-400">Read directly off instrument face</span>
                            </div>

                            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-emerald-500/20">
                                <span className="text-[10px] font-bold text-emerald-400 uppercase block">Calculated True Altitude</span>
                                <div className="text-3xl font-black text-emerald-400 font-mono">
                                    {Math.round(trueAltitude).toLocaleString()} <span className="text-xs font-normal text-emerald-500/60">FT</span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                                    <span>Error:</span>
                                    <span className={`font-mono font-bold ${trueAltitude < indicatedAlt ? 'text-red-400' : 'text-emerald-400'}`}>
                                        {Math.round(trueAltitude - indicatedAlt)} FT
                                    </span>
                                </div>
                            </div>

                            <div className={`p-3.5 rounded-xl border ${isTerrainWarning ? 'bg-red-500/15 border-red-500/40 text-red-300' : 'bg-slate-950/80 border-slate-800 text-slate-300'}`}>
                                <span className="text-[10px] font-bold uppercase block opacity-70">Actual Terrain Clearance</span>
                                <div className="text-2xl font-black font-mono">
                                    {Math.round(actualTerrainClearance).toLocaleString()} <span className="text-xs font-normal">FT AGL</span>
                                </div>
                                <div className="text-[9px] mt-0.5 opacity-80">
                                    Nominal clearance assumed by pilot: {nominalIndicatedClearance} FT
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Interactive Cold-Air Terrain Cross-Section */}
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                                <Mountain className="w-4 h-4 text-emerald-400" />
                                Isobar Compression & Terrain Clearance Profile
                            </h4>
                            <span className="text-[10px] font-mono text-slate-400">
                                Peak: {terrainElevation} FT AMSL
                            </span>
                        </div>

                        {/* Visual Terrain Profile Canvas */}
                        <div className="relative h-56 bg-gradient-to-b from-sky-950/30 via-slate-950 to-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col justify-end p-4">
                            {/* Contracted Isobars */}
                            <div className="absolute inset-0 pointer-events-none opacity-20">
                                <div className="w-full border-b border-dashed border-sky-400" style={{ top: '25%' }} />
                                <div className="w-full border-b border-dashed border-sky-400" style={{ top: '50%' }} />
                                <div className="w-full border-b border-dashed border-sky-400" style={{ top: '75%' }} />
                            </div>

                            {/* Mountain Silhouette */}
                            <svg className="absolute bottom-0 left-0 right-0 h-40 w-full" preserveAspectRatio="none" viewBox="0 0 500 150">
                                <polygon points="0,150 150,150 250,30 350,150 500,150" fill="#1e293b" />
                                <polygon points="210,78 250,30 290,78" fill="#e2e8f0" opacity="0.8" />
                            </svg>

                            {/* Aircraft Flight Level Trajectories */}
                            {/* Indicated Level (What pilot thinks) */}
                            <div
                                className="absolute left-6 right-6 border-t-2 border-dotted border-slate-500 flex items-center justify-between text-[9px] font-mono text-slate-400"
                                style={{ bottom: `${(indicatedAlt / 12000) * 100}%` }}
                            >
                                <span className="bg-slate-900/90 px-1.5 py-0.5 rounded">Indicated: {indicatedAlt} FT</span>
                                <span className="text-[8px] uppercase">Pilot's Assumed Path</span>
                            </div>

                            {/* Actual True Altitude (Where aircraft actually flies) */}
                            <motion.div
                                animate={{ bottom: `${Math.max(10, Math.min(95, (trueAltitude / 12000) * 100))}%` }}
                                transition={{ type: 'spring', damping: 25 }}
                                className="absolute left-6 right-6 border-t-2 border-emerald-400 flex items-center justify-between text-[9px] font-mono text-emerald-400"
                            >
                                <div className="flex items-center gap-1.5 bg-slate-950/90 px-2 py-0.5 rounded border border-emerald-500/40">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <span>True Altitude: {Math.round(trueAltitude)} FT</span>
                                </div>
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                    actualTerrainClearance < 1000 ? 'bg-red-500 text-white font-black animate-bounce' : 'bg-emerald-500/20 text-emerald-300'
                                }`}>
                                    Actual Clearance: {Math.round(actualTerrainClearance)} FT
                                </span>
                            </motion.div>
                        </div>

                        {/* Step-by-Step Worked Derivation Box */}
                        <div className="mt-4 p-4 bg-slate-950/80 rounded-2xl border border-white/5 space-y-2">
                            <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider block">
                                Mathematical Derivation (Croucher ATPL Method)
                            </span>
                            <div className="text-xs text-slate-300 font-mono space-y-1 leading-relaxed">
                                <div>1. Standard ISA Temp at {indicatedAlt} FT = 15 − (2 &times; {indicatedAlt / 1000}) = <span className="text-white font-bold">{isaTempAtAlt.toFixed(0)}°C</span></div>
                                <div>2. Temperature Deviation (&Delta;ISA) = {oatAtAlt}°C − ({isaTempAtAlt.toFixed(0)}°C) = <span className="text-blue-400 font-bold">{tempDeviation > 0 ? '+' : ''}{tempDeviation.toFixed(0)}°C</span></div>
                                <div>3. Cold Correction = 4 ft &times; ({indicatedAlt} / 1000) &times; ({tempDeviation.toFixed(0)}) = <span className={tempCorrectionFt < 0 ? 'text-red-400 font-bold' : 'text-emerald-400'}>{Math.round(tempCorrectionFt)} FT</span></div>
                                <div>4. Subscale Pressure Error = ({subscaleSetting} − {actualQnh}) &times; 27 ft/hPa = <span className="text-amber-400 font-bold">{subscaleErrorFt > 0 ? '+' : ''}{subscaleErrorFt} FT</span></div>
                                <div className="pt-1 text-emerald-400 font-bold border-t border-slate-800">
                                    &rarr; Actual True Altitude = {indicatedAlt} − ({subscaleErrorFt}) + ({Math.round(tempCorrectionFt)}) = {Math.round(trueAltitude)} FT
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subscale Datums Reference Cards */}
            <div className="mt-12 pt-10 border-t border-slate-800 grid md:grid-cols-3 gap-6">
                <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider">QNH (Altitude)</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Subscale pressure reduced to <strong>Mean Sea Level (MSL)</strong> using ISA temperature lapse rate.
                        On the ground at an aerodrome, the altimeter reads the <strong>official aerodrome elevation</strong>.
                    </p>
                    <div className="mt-3 text-[10px] font-mono text-emerald-400/80 bg-emerald-500/10 p-2 rounded">
                        Used from ground up to Transition Altitude (TA).
                    </div>
                </div>

                <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider">QFE (Height)</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Altimeter subscale set to actual <strong>aerodrome atmospheric pressure</strong>.
                        Reads <strong>ZERO</strong> on the runway threshold, indicating height above touchdown datum.
                    </p>
                    <div className="mt-3 text-[10px] font-mono text-sky-400/80 bg-sky-500/10 p-2 rounded">
                        QFE = QNH − (Aerodrome Elev / 27 ft per hPa)
                    </div>
                </div>

                <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider">Standard QNE / SPS</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Standard Pressure Setting set to <strong>1013.25 hPa / 29.92 inHg</strong>.
                        All aircraft above Transition Altitude use this universal datum to guarantee vertical separation in <strong>Flight Levels (FL)</strong>.
                    </p>
                    <div className="mt-3 text-[10px] font-mono text-amber-400/80 bg-amber-500/10 p-2 rounded">
                        FL250 = 25,000 ft on 1013.25 hPa datum
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AltimeterLab;
