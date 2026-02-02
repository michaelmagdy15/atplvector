import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Thermometer, ArrowUp, ArrowDown, Cloud, Mountain, Info, AlertTriangle } from 'lucide-react';

const MetThermodynamics: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'stability' | 'foehn' | 'cloudbase'>('stability');

    return (
        <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white flex items-center gap-3">
                        <Thermometer className="text-orange-500" />
                        Thermodynamics & Stability
                    </h2>
                    <p className="text-slate-400 mt-2">
                        Understanding adiabatic processes, lapse rates, and atmospheric stability.
                    </p>
                </div>
                <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
                    {(['stability', 'foehn', 'cloudbase'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${activeTab === tab ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                            {tab === 'foehn' ? 'Foehn Effect' : tab === 'cloudbase' ? 'Cloud Base' : tab}
                        </button>
                    ))}
                </div>
            </header>

            <div className="min-h-[500px]">
                {activeTab === 'stability' && <StabilityModule />}
                {activeTab === 'foehn' && <FoehnEffectModule />}
                {activeTab === 'cloudbase' && <CloudBaseModule />}
            </div>
        </div>
    );
};

// --- SUB-MODULES ---

const StabilityModule: React.FC = () => {
    const [elr, setElr] = useState(2); // Environmental Lapse Rate C/1000ft

    // DALR = 3C/1000ft, SALR = 1.5C/1000ft (approx avg)
    const dalr = 3;
    const salr = 1.8; // Average substitute

    const getStability = () => {
        if (elr > dalr) return { status: 'ABSOLUTE INSTABILITY', color: 'text-red-500', desc: 'ELR > DALR. Air will continue to rise (TSRA possible).' };
        if (elr < salr) return { status: 'ABSOLUTE STABILITY', color: 'text-blue-400', desc: 'ELR < SALR. Air resists displacement and sinks back.' };
        return { status: 'CONDITIONAL INSTABILITY', color: 'text-yellow-400', desc: 'SALR < ELR < DALR. Stable if dry, Unstable if saturated.' };
    };

    const status = getStability();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
                <h3 className="text-xl font-bold text-white mb-6">Lapse Rate Graph</h3>

                {/* Simplified SVG Graph */}
                <div className="relative h-64 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden mb-8">
                    <svg className="w-full h-full p-4" viewBox="0 0 300 200">
                        {/* Axes */}
                        <line x1="40" y1="180" x2="280" y2="180" stroke="#475569" strokeWidth="2" /> {/* Temp X Axis (Right is cold?) usually Graph is Temp (X) vs Height (Y) */}
                        <line x1="40" y1="20" x2="40" y2="180" stroke="#475569" strokeWidth="2" /> {/* Height Y Axis */}

                        <text x="10" y="20" fill="#94a3b8" fontSize="10">Height</text>
                        <text x="260" y="195" fill="#94a3b8" fontSize="10">Temp (+)</text>

                        {/* ELR Line (Variable) */}
                        {/* Start [40, 180] (Surface). 
                            If DALR (3C) is steep slope.
                            If ELR is small (Isothermal) it is vertical.
                            Let's simulate slope. Higher ELR = More temp loss per height = leans LEFT more.
                        */}
                        <line x1="40" y1="180" x2={280 - (elr * 40)} y2="20" stroke={status.color.replace('text-', 'stroke-')} strokeWidth="3" />
                        <text x={280 - (elr * 40)} y="15" fill="white" fontSize="10">ELR</text>

                        {/* DALR Reference */}
                        <line x1="40" y1="180" x2={280 - (dalr * 40)} y2="20" stroke="#60a5fa" strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />
                        <text x={280 - (dalr * 40)} y="35" fill="#60a5fa" fontSize="10">DALR</text>

                        {/* SALR Reference */}
                        <line x1="40" y1="180" x2={280 - (salr * 40)} y2="20" stroke="#34d399" strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />
                        <text x={280 - (salr * 40)} y="35" fill="#34d399" fontSize="10">SALR</text>
                    </svg>
                </div>

                <div className="mb-6">
                    <label className="flex justify-between text-sm font-bold text-slate-400 mb-2">
                        <span>Environmental Lapse Rate (ELR)</span>
                        <span className="text-white">{elr.toFixed(1)}°C / 1000ft</span>
                    </label>
                    <input
                        type="range" min="-2" max="5" step="0.1"
                        value={elr} onChange={(e) => setElr(parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                        <span>Inversion (-2)</span>
                        <span>Isothermal (0)</span>
                        <span>Superadiabatic (5)</span>
                    </div>
                </div>

                <div className={`p-4 rounded-xl bg-slate-950 border ${status.color.replace('text', 'border')}`}>
                    <h4 className={`font-black ${status.color}`}>{status.status}</h4>
                    <p className="text-sm text-slate-300 mt-1">{status.desc}</p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                    <h3 className="text-lg font-bold text-white mb-4">Key Definitions</h3>
                    <ul className="space-y-4 text-sm text-slate-300">
                        <li className="flex gap-3">
                            <span className="font-mono text-blue-400 font-bold shrink-0">DALR</span>
                            <span>
                                <strong>Dry Adiabatic Lapse Rate (3°C/1000ft)</strong><br />
                                Rate at which unsaturated air cools as it rises (expands). Constant value.
                            </span>
                        </li>
                        <li className="flex gap-3">
                            <span className="font-mono text-green-400 font-bold shrink-0">SALR</span>
                            <span>
                                <strong>Saturated Adiabatic Lapse Rate (~1.8°C/1000ft)</strong><br />
                                Rate for saturated air. Less than DALR because Latent Heat is released during condensation, warming the parcel.
                            </span>
                        </li>
                        <li className="flex gap-3">
                            <span className="font-mono text-white font-bold shrink-0">ELR</span>
                            <span>
                                <strong>Environmental Lapse Rate</strong><br />
                                The actual temperature change of the surrounding atmosphere. Varies with time/place.
                            </span>
                        </li>
                    </ul>
                </div>

                <div className="bg-blue-900/20 border border-blue-500/20 p-6 rounded-3xl">
                    <div className="flex items-start gap-4">
                        <Info className="text-blue-400 shrink-0" />
                        <p className="text-xs text-blue-200 leading-relaxed">
                            <strong>Exam Tip:</strong> High pressure systems usually create subsidence inversions (Absolute Stability), trapping pollutants and causing haze.
                            Low pressure systems usually have steep ELRs (Instability), creating CB clouds.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CloudBaseModule: React.FC = () => {
    const [temp, setTemp] = useState(20);
    const [dp, setDp] = useState(10);

    // Formula: (T - DP) / 2.5 * 1000
    const spread = temp - dp;
    const base = Math.max(0, (spread / 2.5) * 1000);

    return (
        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 p-8 rounded-3xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Cloud className="text-sky-400" /> Cloud Base Calculator
            </h3>

            <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Surface Temp (°C)</label>
                    <div className="flex items-center gap-4">
                        <input
                            type="number" value={temp} onChange={(e) => setTemp(Number(e.target.value))}
                            className="bg-slate-950 border border-slate-600 rounded px-3 py-2 text-white w-20 font-mono"
                        />
                        <input
                            type="range" min="-10" max="40" value={temp} onChange={(e) => setTemp(Number(e.target.value))}
                            className="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Dew Point (°C)</label>
                    <div className="flex items-center gap-4">
                        <input
                            type="number" value={dp} onChange={(e) => setDp(Math.min(temp, Number(e.target.value)))}
                            className="bg-slate-950 border border-slate-600 rounded px-3 py-2 text-white w-20 font-mono"
                        />
                        <input
                            type="range" min="-20" max={temp} value={dp} onChange={(e) => setDp(Math.min(temp, Number(e.target.value)))}
                            className="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                    <div className="text-slate-400 text-xs uppercase mb-1">Temperature - Dewpoint Spread</div>
                    <div className="text-2xl font-mono text-white">{spread.toFixed(1)}°C</div>
                </div>
                <div className="text-right">
                    <div className="text-slate-400 text-xs uppercase mb-1">Estimated Cloud Base (AGL)</div>
                    <div className="text-4xl font-black text-sky-400 font-mono">{base.toFixed(0)} ft</div>
                </div>
            </div>

            <div className="mt-6 text-center text-xs text-slate-500">
                Formula: Base = (Temp - Dewpoint) / 2.5 × 1000
            </div>
        </div>
    );
};

const FoehnEffectModule: React.FC = () => {
    // Basic numerical simulation
    // Start T = 15C, DP = 10C. 
    // Rise to 10000ft mountain.
    // 1. Rise DALR (3/1000) until Cloud Base.
    // 2. Rise SALR (1.8/1000) from Base to Peak (Rain).
    // 3. Descend DALR (3/1000) to surface on leeward.

    // Calculate details
    const startTemp = 20;
    const startDP = 10;
    const peakHeight = 8000; // ft

    // 1
    const spread = startTemp - startDP;
    const cloudBase = (spread / 2.5) * 1000;

    // 2. Temp at Base
    const tempAtBase = startTemp - (3 * (cloudBase / 1000));

    // 3. Rise SALR to Peak
    const saturatedHeight = Math.max(0, peakHeight - cloudBase);
    const tempAtPeak = tempAtBase - (1.8 * (saturatedHeight / 1000));

    // 4. Descend DALR to 0
    // descent is 8000ft
    const finalTemp = tempAtPeak + (3 * (peakHeight / 1000));

    // Colors
    const getC = (t: number) => t > 20 ? 'text-red-400' : t > 0 ? 'text-orange-300' : 'text-blue-300';

    return (
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* WINDWARD */}
                <div className="text-center space-y-2">
                    <h4 className="font-bold text-slate-400 uppercase text-xs">Windward (Start)</h4>
                    <div className="text-3xl font-black text-white">{startTemp}°C</div>
                    <div className="text-xs text-slate-500">Dew Point: {startDP}°C</div>
                    <div className="h-32 flex items-end justify-center">
                        <ArrowUp className="text-blue-500 animate-bounce" size={32} />
                    </div>
                </div>

                {/* VISUALIZER */}
                <div className="relative h-64 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden col-span-1 md:col-span-1">
                    <div className="absolute bottom-0 w-full flex items-end">
                        {/* Mountain SVG shape */}
                        <svg viewBox="0 0 200 100" className="w-full h-full" preserveAspectRatio="none">
                            <path d="M0,100 L80,20 L120,20 L200,100 Z" fill="#334155" stroke="#475569" />
                        </svg>
                    </div>

                    {/* Cloud */}
                    {saturatedHeight > 0 && (
                        <div className="absolute left-[30%] top-[30%] animate-pulse">
                            <Cloud className="text-white w-12 h-12 fill-white opacity-80" />
                            <div className="text-blue-300 text-[10px] absolute -bottom-4 w-20">Rain/Snow (Moisture Loss)</div>
                        </div>
                    )}

                    {/* Peak Label */}
                    <div className="absolute top-[10%] left-1/2 -translate-x-1/2 bg-slate-900/80 px-2 py-1 rounded text-xs text-white border border-slate-700">
                        Peak: {tempAtPeak.toFixed(1)}°C
                    </div>
                </div>

                {/* LEEWARD */}
                <div className="text-center space-y-2">
                    <h4 className="font-bold text-slate-400 uppercase text-xs">Leeward (Finish)</h4>
                    <div className="text-4xl font-black text-red-500">{finalTemp.toFixed(1)}°C</div>
                    <div className="text-xs text-slate-500">Warmer & Drier</div>
                    <div className="h-32 flex items-start justify-center pt-8">
                        <ArrowDown className="text-red-500 animate-bounce" size={32} />
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                    <Mountain className="text-slate-400" /> Why is it warmer?
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                    Air cools at the slower <strong>SALR</strong> (1.8°C) while rising in clouds because latent heat is released (condensation).
                    When it descends on the other side, it warms at the faster <strong>DALR</strong> (3.0°C) because it is now dry (moisture was lost as rain).
                    This net gain in heat is the <strong>Foehn Effect</strong> (or Chinook).
                </p>
            </div>
        </div>
    );
}

export default MetThermodynamics;
