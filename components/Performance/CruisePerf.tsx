import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Plane,
    Maximize,
    Clock,
    Info,
    TrendingUp,
    Wind,
    Gauge,
    AlertTriangle,
    Flame,
    CheckCircle2,
    BookOpen,
    Mountain
} from 'lucide-react';

export const CruisePerf: React.FC = () => {
    const [speed, setSpeed] = useState<number>(150);
    const [propulsionType, setPropulsionType] = useState<'JET' | 'PROP'>('JET');
    const [windKts, setWindKts] = useState<number>(0); // + headwind, - tailwind

    // Reference speeds
    // Vmp ~ 95 kt, Vmd ~ 120 kt, 1.32 Vmd ~ 158 kt
    const vmp = 95;
    const vmd = 120;
    const v132md = 158;

    // Effective Best Range speed adjusted for wind
    const targetEnduranceSpeed = propulsionType === 'JET' ? vmd : vmp;
    const baseRangeSpeed = propulsionType === 'JET' ? v132md : vmd;
    const targetRangeSpeed = Math.round(baseRangeSpeed + windKts * 0.35);

    // Fuel Flow model (kg/hr)
    const minSpeedForFF = targetEnduranceSpeed;
    const fuelFlow = (Math.pow((speed - minSpeedForFF) / 38, 2) + 9.5) * (propulsionType === 'JET' ? 180 : 22);

    // Groundspeed & Specific Range
    const groundSpeed = Math.max(30, speed - windKts);
    const specificAirRange = speed / fuelFlow;
    const specificGroundRange = groundSpeed / fuelFlow;
    const specificEndurance = 1000 / fuelFlow; // hrs per 1,000 kg

    const isBestEndurance = Math.abs(speed - targetEnduranceSpeed) <= 6;
    const isBestRange = Math.abs(speed - targetRangeSpeed) <= 6;

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
                <div className="flex items-center gap-4">
                    <div className="bg-sky-500/10 dark:bg-sky-500/20 p-4 rounded-2xl text-sky-500 border border-sky-500/30">
                        <Plane size={36} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/30">
                                EASA ATPL 032
                            </span>
                            <span className="text-xs text-slate-500 font-mono">Cruise, Range, Endurance & Drift-Down</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                            Cruise Performance, Range & Endurance
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base mt-1">
                            Jet (Thrust/Drag) vs Propeller (Power Required) Curves, SFC, Cost Index, Step Climb & Drift-Down
                        </p>
                    </div>
                </div>

                {/* Propulsion Toggle */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    <button
                        onClick={() => {
                            setPropulsionType('JET');
                            setSpeed(158);
                        }}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                            propulsionType === 'JET'
                                ? 'bg-sky-600 text-white shadow'
                                : 'text-slate-600 dark:text-slate-400'
                        }`}
                    >
                        Turbojet (Thrust / Drag Curve)
                    </button>
                    <button
                        onClick={() => {
                            setPropulsionType('PROP');
                            setSpeed(120);
                        }}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                            propulsionType === 'PROP'
                                ? 'bg-amber-600 text-white shadow'
                                : 'text-slate-600 dark:text-slate-400'
                        }`}
                    >
                        Propeller (Power Required Curve)
                    </button>
                </div>
            </div>

            {/* Interactive Simulator Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Graph Visualization */}
                <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-white">
                                {propulsionType === 'JET'
                                    ? 'Jet: Total Drag / Thrust Required vs TAS'
                                    : 'Propeller: Power Required vs TAS'}
                            </h3>
                            <p className="text-xs text-slate-500">
                                {propulsionType === 'JET'
                                    ? 'Jet Max Endurance = VMD (bottom of Drag curve) | Jet Max Range = 1.32 VMD (tangent from origin)'
                                    : 'Prop Max Endurance = VMP (bottom of Power curve) | Prop Max Range = VMD (tangent to Power curve)'}
                            </p>
                        </div>
                        <span className="px-2.5 py-1 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-mono text-xs font-bold">
                            {propulsionType === 'JET' ? 'Max Range = 1.32 VMD' : 'Max Range = VMD'}
                        </span>
                    </div>

                    <div className="relative w-full h-[290px] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                        {/* Axes */}
                        <div className="absolute bottom-8 left-12 right-6 h-[1px] bg-slate-700" />
                        <div className="absolute top-6 bottom-8 left-12 w-[1px] bg-slate-700" />

                        <div className="absolute left-2 top-1/2 -rotate-90 text-[10px] font-bold text-slate-400 uppercase tracking-widest origin-center whitespace-nowrap">
                            {propulsionType === 'JET' ? 'Thrust / Drag (Fuel Flow)' : 'Power Required (Fuel Flow)'}
                        </div>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                            True Airspeed (TAS) — Wind Shift: {windKts > 0 ? `+${windKts} kt HW` : windKts < 0 ? `${Math.abs(windKts)} kt TW` : 'Zero Wind'}
                        </div>

                        {/* Curve & Tangent SVG */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                            {/* U-Curve */}
                            <path
                                d="M 16 78 Q 34 22, 48 32 T 92 85"
                                fill="none"
                                stroke="#38bdf8"
                                strokeWidth="1.2"
                            />
                            {/* Tangent line from wind-shifted origin to curve (Max Range) */}
                            <line
                                x1={12 + (windKts / 60) * 10}
                                y1="88"
                                x2="60"
                                y2="42"
                                stroke="#10b981"
                                strokeWidth="0.8"
                                strokeDasharray="2 1.5"
                            />
                        </svg>

                        {/* Interactive Dot */}
                        <motion.div
                            className="absolute w-4 h-4 bg-sky-400 rounded-full shadow-lg shadow-sky-400/60 border-2 border-white z-20"
                            style={{
                                left: `calc(12% + ${((speed - 60) / 180) * 76}%)`,
                                bottom: `calc(14% + ${Math.min(72, Math.pow((speed - targetEnduranceSpeed) / 45, 2) * 28 + 18)}%)`,
                                transform: 'translate(-50%, 50%)'
                            }}
                        />

                        {/* Best Endurance Marker */}
                        <div
                            className="absolute bottom-8 top-8 border-l border-dashed border-amber-400/70 z-10"
                            style={{ left: `calc(12% + ${((targetEnduranceSpeed - 60) / 180) * 76}%)` }}
                        >
                            <span className="absolute top-2 -left-10 text-[10px] text-amber-300 font-mono font-bold bg-slate-900/90 border border-amber-500/40 px-1.5 py-0.5 rounded whitespace-nowrap">
                                Max End ({propulsionType === 'JET' ? 'VMD' : 'VMP'})
                            </span>
                        </div>

                        {/* Best Range Marker */}
                        <div
                            className="absolute bottom-8 top-8 border-l border-dashed border-emerald-400/70 z-10"
                            style={{ left: `calc(12% + ${((targetRangeSpeed - 60) / 180) * 76}%)` }}
                        >
                            <span className="absolute top-9 -left-10 text-[10px] text-emerald-300 font-mono font-bold bg-slate-900/90 border border-emerald-500/40 px-1.5 py-0.5 rounded whitespace-nowrap">
                                Max Range ({propulsionType === 'JET' ? '1.32 VMD' : 'VMD'})
                            </span>
                        </div>
                    </div>

                    {/* Sliders */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <div className="flex justify-between text-xs font-bold mb-1">
                                <span className="text-slate-600 dark:text-slate-300">True Airspeed (TAS)</span>
                                <span className="font-mono text-sky-500">{speed} kt</span>
                            </div>
                            <input
                                type="range"
                                min="70"
                                max="220"
                                value={speed}
                                onChange={(e) => setSpeed(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                                <button onClick={() => setSpeed(targetEnduranceSpeed)} className="hover:text-amber-400 underline">
                                    Set Max Endurance ({targetEnduranceSpeed} kt)
                                </button>
                                <button onClick={() => setSpeed(targetRangeSpeed)} className="hover:text-emerald-400 underline">
                                    Set Max Range ({targetRangeSpeed} kt)
                                </button>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-xs font-bold mb-1">
                                <span className="text-slate-600 dark:text-slate-300">Wind Component</span>
                                <span className="font-mono text-emerald-500">
                                    {windKts > 0 ? `${windKts} kt Headwind` : windKts < 0 ? `${Math.abs(windKts)} kt Tailwind` : 'Calm (0 kt)'}
                                </span>
                            </div>
                            <input
                                type="range"
                                min="-40"
                                max="40"
                                step="5"
                                value={windKts}
                                onChange={(e) => setWindKts(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                            <p className="text-[10px] text-slate-400 mt-1">
                                Headwind shifts origin right → <strong>higher</strong> Max Range speed. Tailwind → <strong>lower</strong> speed.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Live Metrics & Core Formulas */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div className={`p-4 rounded-2xl border transition-all ${
                            isBestEndurance
                                ? 'bg-amber-500/10 border-amber-500/40 ring-1 ring-amber-400/40'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                        }`}>
                            <Clock className={`mb-2 ${isBestEndurance ? 'text-amber-400' : 'text-slate-400'}`} size={22} />
                            <p className="text-[10px] text-slate-500 font-bold uppercase">Fuel Flow (FF)</p>
                            <div className="text-xl font-mono font-black text-slate-900 dark:text-white">
                                {Math.round(fuelFlow)} <span className="text-xs font-normal text-slate-400">kg/h</span>
                            </div>
                            <span className="text-[10px] text-amber-400 font-mono">
                                SE = 1/FF ({specificEndurance.toFixed(2)} h/t)
                            </span>
                        </div>

                        <div className={`p-4 rounded-2xl border transition-all ${
                            isBestRange
                                ? 'bg-emerald-500/10 border-emerald-500/40 ring-1 ring-emerald-400/40'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                        }`}>
                            <Maximize className={`mb-2 ${isBestRange ? 'text-emerald-400' : 'text-slate-400'}`} size={22} />
                            <p className="text-[10px] text-slate-500 font-bold uppercase">Specific Ground Range</p>
                            <div className="text-xl font-mono font-black text-slate-900 dark:text-white">
                                {(specificGroundRange * 10).toFixed(2)} <span className="text-xs font-normal text-slate-400">NM/10kg</span>
                            </div>
                            <span className="text-[10px] text-emerald-400 font-mono">
                                SGR = GS / FF | SR = TAS / FF
                            </span>
                        </div>
                    </div>

                    {/* Core Exam Formulas Box */}
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                        <h4 className="text-xs font-mono uppercase tracking-wider text-sky-400 font-bold flex items-center gap-2">
                            <Flame size={15} /> Essential Cruise & Fuel Formulas (032 Exam)
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono">
                            <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
                                <span className="text-slate-400 block text-[10px]">Specific Fuel Consumption</span>
                                <strong className="text-white">SFC = FF / Thrust</strong>
                                <span className="block text-[10px] text-sky-400">Units: kg/h/N (FF = Thrust × SFC)</span>
                            </div>
                            <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
                                <span className="text-slate-400 block text-[10px]">Specific Air / Ground Range</span>
                                <strong className="text-white">SR = TAS / FF | SGR = GS / FF</strong>
                                <span className="block text-[10px] text-emerald-400">Max fuel remaining on landing = 1.32 VMD</span>
                            </div>
                            <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
                                <span className="text-slate-400 block text-[10px]">Specific Endurance</span>
                                <strong className="text-white">SE = 1 / Fuel Flow</strong>
                                <span className="block text-[10px] text-amber-400">Holding speed = VMD (Jet) / VMP (Prop)</span>
                            </div>
                            <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
                                <span className="text-slate-400 block text-[10px]">Speed Hierarchy (Low → High)</span>
                                <strong className="text-white">VS &lt; VX &lt; VY &lt; Max Range</strong>
                                <span className="block text-[10px] text-purple-400">Mnemonic: "Sexy Low-to-High"</span>
                            </div>
                        </div>
                    </div>

                    {/* Mnemonics Callout */}
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 space-y-2">
                        <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                            <BookOpen size={15} /> High-Yield Exam Mnemonics
                        </div>
                        <ul className="text-xs text-slate-300 space-y-1.5 leading-relaxed">
                            <li>• <strong>EnduroX:</strong> <strong>Mass</strong> affects Endurance &amp; <strong>VX</strong>; <strong>Wind</strong> affects Range &amp; <strong>VY</strong>.</li>
                            <li>• <strong>PRAT:</strong> <strong>P</strong>ower = <strong>R</strong>ate of Climb (VY); <strong>A</strong>ngle of Climb = <strong>T</strong>hrust (VX).</li>
                            <li>• <strong>Jet on Power Required Curve:</strong> Tangent from origin to the <em>Power Required</em> curve touches at <strong>VMD</strong> (which is Max Endurance for a Jet, and Max Range for a Prop!).</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Complete Jet vs Prop Matrix + Max Endurance Altitudes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Gauge className="text-sky-500" size={20} />
                        Jet vs. Propeller Speeds &amp; Curves Matrix
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase">
                                    <th className="py-2.5 pr-3">Regime</th>
                                    <th className="py-2.5 px-3">Speed</th>
                                    <th className="py-2.5 px-3">Curve Reference</th>
                                    <th className="py-2.5 pl-3">Aerodynamic Ratio</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                                <tr>
                                    <td className="py-2.5 pr-3 font-bold text-emerald-500">Max Range (Jet)</td>
                                    <td className="py-2.5 px-3 font-bold text-white">1.32 VMD</td>
                                    <td className="py-2.5 px-3">Tangent to Thrust/Drag curve</td>
                                    <td className="py-2.5 pl-3">Max (TAS / Drag) or CL / CD²</td>
                                </tr>
                                <tr>
                                    <td className="py-2.5 pr-3 font-bold text-amber-500">Max Endurance (Jet)</td>
                                    <td className="py-2.5 px-3 font-bold text-white">VMD</td>
                                    <td className="py-2.5 px-3">Lowest point on Thrust/Drag curve (Tangent on Power Req)</td>
                                    <td className="py-2.5 pl-3">Max (Lift / Drag) or (CL / CD)max</td>
                                </tr>
                                <tr>
                                    <td className="py-2.5 pr-3 font-bold text-sky-500">Max Range (Prop)</td>
                                    <td className="py-2.5 px-3 font-bold text-white">VMD</td>
                                    <td className="py-2.5 px-3">Tangent to Power Required curve</td>
                                    <td className="py-2.5 pl-3">Max (Lift / Drag) or (CL / CD)max</td>
                                </tr>
                                <tr>
                                    <td className="py-2.5 pr-3 font-bold text-purple-400">Max Endurance (Prop)</td>
                                    <td className="py-2.5 px-3 font-bold text-white">VMP (0.76 VMD)</td>
                                    <td className="py-2.5 px-3">Lowest point on Power Required curve</td>
                                    <td className="py-2.5 pl-3">Max (CL³/² / CD)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Optimum Endurance Altitudes + Step Climb + Cost Index + Drift Down */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Mountain className="text-emerald-500" size={20} />
                        Altitudes, Step Climb, Cost Index &amp; Drift-Down
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                            <span className="text-[10px] font-mono uppercase text-slate-400 block">Piston Engine</span>
                            <strong className="text-sm text-slate-900 dark:text-white">Low Altitude (SL)</strong>
                            <p className="text-[11px] text-slate-500 mt-1">Best endurance at Sea Level (lowest TAS for VMP).</p>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                            <span className="text-[10px] font-mono uppercase text-amber-400 block">Turboprop</span>
                            <strong className="text-sm text-slate-900 dark:text-white">Mid Alt (~10,000 ft)</strong>
                            <p className="text-[11px] text-slate-500 mt-1">Optimum endurance around 10,000 ft.</p>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                            <span className="text-[10px] font-mono uppercase text-sky-400 block">Turbojet</span>
                            <strong className="text-sm text-slate-900 dark:text-white">High Altitude</strong>
                            <p className="text-[11px] text-slate-500 mt-1">Reduced SFC &amp; higher TAS at tropopause.</p>
                        </div>
                    </div>

                    <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300 pt-1">
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                            <strong className="text-sky-400">Step Climb &amp; 1.3g Buffet Limit:</strong> Heavy long-range jets cannot climb directly to optimum altitude due to the <strong>1.3g maneuver/buffet margin</strong> (coffin corner). Instead, they perform <strong>step climbs</strong> as fuel burns off and mass decreases.
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                            <strong className="text-emerald-400">Cost Index (CI = Time Cost / Fuel Cost):</strong> <strong>High CI</strong> = fly faster (ECON approaches MMO/VMO, higher fuel burn). <strong>CI = 0</strong> = fly at Maximum Range speed (1.32 VMD, minimum fuel burn).
                        </div>
                        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30">
                            <strong className="text-rose-400">En-Route OEI Drift-Down Clearances (Class A):</strong> Net drift-down path must clear all obstacles within <strong>5 NM</strong> either side of track by at least <strong>2,000 ft</strong> vertically during descent, achieve a positive net slope at <strong>1,500 ft</strong> above the diversion aerodrome, or clear obstacles by <strong>1,000 ft</strong> where level flight can be maintained.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CruisePerf;
