import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Settings, Thermometer, AlertTriangle, HelpCircle, Activity } from 'lucide-react';

const AltimeterLab: React.FC = () => {
    const [indicatedAlt, setIndicatedAlt] = useState(5000);
    const [qnh, setQnh] = useState(1013);
    const [oat, setOat] = useState(15); // Outside Air Temp at SL
    const [isNonStandardTemp, setIsNonStandardTemp] = useState(false);

    // ISA Atmosphere Logic
    const isaTempAtAlt = 15 - (indicatedAlt / 1000) * 1.98;
    const currentTemp = isNonStandardTemp ? oat - (indicatedAlt / 1000) * 1.98 : isaTempAtAlt;

    // Temperature Error Formula: 4ft per 1000ft per degree deviation
    const tempDeviation = currentTemp - isaTempAtAlt;
    const tempError = (indicatedAlt / 1000) * 4 * tempDeviation;
    const trueAlt = indicatedAlt + tempError;

    // High to Low - Look out below
    // Low to High - Clear the sky
    const errorNature = tempError < 0 ? "Lower (Dangerous)" : "Higher (Safe)";

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="mb-12">
                <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
                    <TrendingUp className="text-emerald-400" />
                    Pressure Altimeter Lab
                </h1>
                <p className="text-slate-400 max-w-2xl">
                    Beyond simple meters. Understand how pressure, temperature, and sub-scale settings change your perceived vs true position in space.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Controls Area */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                        <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                            <Settings className="text-slate-400 w-4 h-4" />
                            Calibration Tools
                        </h3>

                        {/* Indicated Altitude */}
                        <div className="mb-8">
                            <label className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                <span>Indicated Altitude</span>
                                <span className="text-white font-mono">{indicatedAlt} FT</span>
                            </label>
                            <input
                                type="range" min="0" max="45000" step="100"
                                value={indicatedAlt}
                                onChange={(e) => setIndicatedAlt(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                        </div>

                        {/* Sub-scale QNH */}
                        <div className="mb-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                            <label className="flex justify-between text-xs font-bold text-slate-500 uppercase mb-2">
                                <span>Sub-scale Setting (QNH)</span>
                                <span className="text-emerald-400 font-mono italic">{qnh} hPa</span>
                            </label>
                            <input
                                type="range" min="940" max="1060" step="1"
                                value={qnh}
                                onChange={(e) => setQnh(parseInt(e.target.value))}
                                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                            />
                            <p className="text-[10px] text-slate-500 mt-2">1 hPa change = 27-30ft change in datum (MSL)</p>
                        </div>

                        {/* Temperature Toggle */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-400 uppercase">Atmosphere Type</span>
                                <button
                                    onClick={() => setIsNonStandardTemp(!isNonStandardTemp)}
                                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all ${isNonStandardTemp ? 'bg-orange-500 text-white' : 'bg-blue-500 text-white'
                                        }`}
                                >
                                    {isNonStandardTemp ? 'Non-Standard' : 'Standard (ISA)'}
                                </button>
                            </div>

                            {isNonStandardTemp && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="pt-2"
                                >
                                    <label className="flex justify-between text-xs font-bold text-slate-500 uppercase mb-2">
                                        <span>Sea Level Temperature</span>
                                        <span className={oat < 15 ? 'text-blue-400' : 'text-orange-400'}>{oat}°C</span>
                                    </label>
                                    <input
                                        type="range" min="-30" max="50" step="1"
                                        value={oat}
                                        onChange={(e) => setOat(parseInt(e.target.value))}
                                        className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                    />
                                    <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-500">
                                        <Thermometer size={12} />
                                        <span>ISA Deviation: {oat - 15 > 0 ? '+' : ''}{oat - 15}°C</span>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Rule of Thumb Box */}
                    <div className={`p-6 rounded-2xl border-l-4 transition-all ${tempError < 0 ? 'bg-red-500/10 border-red-500' : 'bg-emerald-500/10 border-emerald-500'}`}>
                        <div className="flex gap-4">
                            <AlertTriangle className={tempError < 0 ? 'text-red-500' : 'text-emerald-500'} />
                            <div>
                                <h4 className="text-white font-bold mb-1">Temperature Error</h4>
                                <p className="text-xs text-slate-300 leading-relaxed mb-2">
                                    When air is colder than ISA, the pressure levels are "compressed". Your <strong>True Altitude</strong> is <strong>{errorNature}</strong> than indicated.
                                </p>
                                <div className="text-[10px] font-mono p-2 bg-black/30 rounded text-slate-400">
                                    TRUE = IND + (4ft/1000ft × ΔISA × ALT/1000)
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Display Area */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Altimeter Face */}
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 md:p-12 flex flex-col items-center justify-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 md:p-6 flex flex-col items-end gap-1">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Actual QNH</div>
                            <div className="text-xl md:text-2xl font-black text-white font-mono tracking-tighter">{qnh}</div>
                        </div>

                        {/* 3-Pointer Altimeter Representation */}
                        <div className="w-56 h-56 md:w-64 md:h-64 rounded-full border-[10px] border-slate-800 shadow-2xl relative flex items-center justify-center bg-slate-950">
                            {/* Dial Numbers */}
                            {[...Array(10)].map((_, i) => (
                                <div key={i} className="absolute inset-2 text-center" style={{ transform: `rotate(${i * 36}deg)` }}>
                                    <span className="text-slate-700 font-bold block" style={{ transform: `rotate(-${i * 36}deg)` }}>{i}</span>
                                </div>
                            ))}

                            {/* 10,000 ft Hand (Thick) */}
                            <motion.div
                                animate={{ rotate: (indicatedAlt / 100000) * 360 }}
                                className="absolute w-2 h-14 md:h-16 bg-white/20 origin-bottom bottom-1/2 rounded-full"
                            />
                            {/* 1,000 ft Hand (Broad) */}
                            <motion.div
                                animate={{ rotate: (indicatedAlt / 10000) * 360 }}
                                className="absolute w-2 h-20 md:h-24 bg-white origin-bottom bottom-1/2 rounded-full shadow-lg"
                            />
                            {/* 100 ft Hand (Thin) */}
                            <motion.div
                                animate={{ rotate: (indicatedAlt / 1000) * 360 }}
                                className="absolute w-1 h-[100px] md:h-[110px] bg-white origin-bottom bottom-1/2 rounded-full"
                            />

                            {/* Center Nut */}
                            <div className="w-4 h-4 bg-slate-700 rounded-full z-10 border-2 border-slate-900 shadow-inner"></div>
                        </div>

                        {/* Digital Readout */}
                        <div className="mt-8 grid grid-cols-2 gap-4 md:gap-12 text-center w-full max-w-sm">
                            <div>
                                <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-1">Indicated</h5>
                                <div className="text-3xl md:text-4xl font-black text-white font-mono tracking-tighter">
                                    {indicatedAlt.toLocaleString()}
                                </div>
                                <div className="text-[10px] text-slate-600 mt-1 uppercase">Feet</div>
                            </div>
                            <div>
                                <h5 className="text-[10px] font-bold text-emerald-500/50 uppercase mb-1">True (Calc)</h5>
                                <div className="text-3xl md:text-4xl font-black text-emerald-400 font-mono tracking-tighter">
                                    {Math.round(trueAlt).toLocaleString()}
                                </div>
                                <div className="text-[10px] text-emerald-500/30 mt-1 uppercase">Feet</div>
                            </div>
                        </div>
                    </div>

                    {/* Compare Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                            <h4 className="flex items-center gap-2 text-white font-bold mb-4">
                                <Activity className="text-blue-400 w-4 h-4" />
                                Aneroid Mechanics
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                The heart is an <strong>evacuated aneroid capsule</strong>. As ambient pressure (PS) decreases with height, the internal pressure causes the capsule to expand.
                            </p>
                            <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-500 bg-slate-950 p-2 rounded">
                                <HelpCircle size={12} />
                                <span>Higher ALT = More Expansion = Lower Sensitivity</span>
                            </div>
                        </div>

                        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                            <h4 className="flex items-center gap-2 text-white font-bold mb-4">
                                <TrendingUp className="text-emerald-400 w-4 h-4" />
                                Datum Truths
                            </h4>
                            <ul className="text-xs text-slate-400 space-y-2">
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500 font-bold">QNH:</span>
                                    <span>Height above Mean Sea Level (Altitude).</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-sky-500 font-bold">QFE:</span>
                                    <span>Height above Aerodrome (Zero at runway).</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-500 font-bold">SPS:</span>
                                    <span>1013.25 hPa datum (Flight Levels).</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Advanced Altimeter Theory (NEW) */}
            <div className="mt-12 pt-12 border-t border-slate-800 grid md:grid-cols-2 gap-12">
                <div>
                    <h3 className="text-xl font-bold text-white mb-6">Types of Altimeters</h3>
                    <div className="space-y-4">
                        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 hover:border-emerald-500/30 transition-colors">
                            <h4 className="font-bold text-white text-sm mb-1 uppercase tracking-wider">Simple Altimeter</h4>
                            <p className="text-xs text-slate-400">Uses a <strong>single</strong> capsule. Suitable only for low altitudes due to limited sensitivity.</p>
                        </div>
                        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 hover:border-emerald-500/30 transition-colors">
                            <h4 className="font-bold text-white text-sm mb-1 uppercase tracking-wider">Sensitive Altimeter</h4>
                            <p className="text-xs text-slate-400">Uses <strong>three</strong> capsules to increase sensitivity. Typically accurate up to 25,000 ft.</p>
                        </div>
                        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 hover:border-emerald-500/30 transition-colors">
                            <h4 className="font-bold text-white text-sm mb-1 uppercase tracking-wider font-highlight text-emerald-400">Servo Altimeter</h4>
                            <p className="text-xs text-slate-400">Uses an <strong>I-bar</strong> and electromagnetic induction. Offers highest accuracy, no lag, and reduced friction. Good for all altitudes.</p>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-bold text-white mb-6">Error Case Studies</h3>
                    <div className="space-y-4">
                        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="text-xs font-black text-slate-200 uppercase">Hysteresis Error</h4>
                                <span className="text-[10px] bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded">ELASTICITY</span>
                            </div>
                            <p className="text-[11px] text-slate-400">
                                After prolonged time at a constant altitude, the capsule loses elasticity. It becomes "laggy" during subsequent climbs or descents.
                            </p>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="text-xs font-black text-slate-200 uppercase">Instrument Tolerances</h4>
                                <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-mono">STANDARDS</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 font-mono">
                                <div className="flex justify-between border-b border-slate-800 pb-1"><span>Sea Level</span> <span className="text-white">± 50 ft</span></div>
                                <div className="flex justify-between border-b border-slate-800 pb-1"><span>10,000 ft</span> <span className="text-white">± 175 ft</span></div>
                                <div className="flex justify-between border-b border-slate-800 pb-1"><span>40,000 ft</span> <span className="text-white">± 600 ft</span></div>
                            </div>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="text-xs font-black text-slate-200 uppercase">Density Altitude</h4>
                            </div>
                            <p className="text-[11px] text-slate-400 mb-2">The altitude in the ISA at which air density would be equal to the current density.</p>
                            <div className="p-2 bg-black/40 rounded text-center font-mono text-emerald-500 font-bold text-xs">
                                DA = PA ± (120 ft × ΔISA)
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AltimeterLab;
