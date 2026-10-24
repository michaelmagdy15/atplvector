import React, { useState, useMemo } from 'react';
import { ArrowDown, Plane, AlertTriangle, ShieldAlert, Wind, TrendingUp, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const GroundEffect: React.FC = () => {
    const [height, setHeight] = useState(0.2); // Wingspan ratio h/b (0.05 to 1.5)
    const [approachSpeedKt, setApproachSpeedKt] = useState(135); // Approach speed

    // Standard Wieselsberger Ground Effect formulation:
    // Induced drag factor: Di_ge / Di_free = (33 * (h/b)^1.5) / (1 + 33 * (h/b)^1.5)
    const inducedDragFactor = useMemo(() => {
        if (height >= 1.0) return 1.0;
        const num = 33 * Math.pow(height, 1.5);
        return num / (1 + num);
    }, [height]);

    const inducedDragReductionPercent = Math.round((1 - inducedDragFactor) * 100);

    // Effective AoA boost due to reduced downwash
    // At h/b = 0.1, downwash is halved, giving ~1.5° to 2° effective AoA boost
    const effectiveAoABoostDeg = (1 - inducedDragFactor) * 2.2;

    // Floating flare distance estimate
    // Extra speed over Vref creates exponential floating distance in ground effect
    const excessSpeedKt = Math.max(0, approachSpeedKt - 130);
    const flareDistanceMeters = Math.round(400 + excessSpeedKt * 75 * (1 + (1 - inducedDragFactor) * 1.5));

    const isStrongGroundEffect = height < 0.5;

    // Generate Recharts data for Di reduction vs h/b
    const chartData = useMemo(() => {
        const points = [];
        for (let hb = 0.05; hb <= 1.2; hb += 0.05) {
            const num = 33 * Math.pow(hb, 1.5);
            const factor = hb >= 1.0 ? 1.0 : num / (1 + num);
            points.push({
                hb: Number(hb.toFixed(2)),
                dragPercent: Math.round(factor * 100),
                reductionPercent: Math.round((1 - factor) * 100)
            });
        }
        return points;
    }, []);

    return (
        <div className="bg-slate-900/50 p-4 md:p-8 rounded-2xl border border-slate-700 backdrop-blur-sm space-y-8">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 bg-yellow-500/20 text-yellow-400 rounded-xl border border-yellow-500/30">
                        <ArrowDown size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                            Ground Effect Aerodynamics & Flare Dynamics
                        </h2>
                        <p className="text-slate-400 text-sm">
                            Induced drag suppression, downwash flattening, effective angle of attack boost, and the flare floating phenomenon.
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Height Above Ground</span>
                    <div className="text-2xl font-black text-white mt-1 flex items-baseline gap-1">
                        {height.toFixed(2)} <span className="text-xs font-normal text-slate-400">b (wingspans)</span>
                    </div>
                    <span className="text-[11px] text-yellow-400 mt-1 block">
                        {height < 1.0 ? 'Inside Ground Effect (< 1.0 b)' : 'Free Air (> 1.0 b)'}
                    </span>
                </div>

                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Induced Drag (D<sub>i</sub>)</span>
                    <div className="text-2xl font-black text-emerald-400 mt-1 flex items-baseline gap-1">
                        {Math.round(inducedDragFactor * 100)}% <span className="text-xs font-normal text-slate-400">of free air</span>
                    </div>
                    <span className="text-[11px] text-emerald-300 mt-1 block">
                        -{inducedDragReductionPercent}% drag reduction
                    </span>
                </div>

                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Effective AoA Shift</span>
                    <div className="text-2xl font-black text-sky-400 mt-1 flex items-baseline gap-1">
                        +{effectiveAoABoostDeg.toFixed(1)}°
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">Due to downwash suppression</span>
                </div>

                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Flare Float Distance</span>
                    <div className="text-2xl font-black text-purple-400 mt-1 flex items-baseline gap-1">
                        {flareDistanceMeters} <span className="text-xs font-normal text-slate-400">m</span>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">Runway consumed in flare</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* 2D Physics Visualizer (7/12) */}
                <div className="lg:col-span-7 bg-[#0b1324] rounded-2xl border border-slate-700 h-[420px] relative overflow-hidden flex flex-col justify-end p-4">
                    {/* Sky Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-sky-950/30 to-transparent pointer-events-none" />

                    {/* Aircraft Graphic */}
                    <div
                        className="absolute left-1/2 transform -translate-x-1/2 transition-all duration-300 ease-out z-10 flex flex-col items-center"
                        style={{ bottom: `${Math.min(300, Math.max(35, height * 220))}px` }}
                    >
                        <Plane size={64} className="text-white transform -rotate-90 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]" />

                        {/* Wingtip Vortices Visual */}
                        <div
                            className={`absolute -bottom-2 left-0 w-24 h-12 rounded-full border-t-2 border-dashed border-sky-400/80 transform -translate-x-full transition-all duration-300 ${
                                isStrongGroundEffect ? 'scale-x-150 scale-y-50 rotate-6 opacity-40' : 'scale-100 rotate-45 opacity-80'
                            }`}
                        />
                        <div
                            className={`absolute -bottom-2 right-0 w-24 h-12 rounded-full border-t-2 border-dashed border-sky-400/80 transform translate-x-full transition-all duration-300 ${
                                isStrongGroundEffect ? 'scale-x-150 scale-y-50 -rotate-6 opacity-40' : 'scale-100 -rotate-45 opacity-80'
                            }`}
                        />

                        {/* Downwash Angle Arrows */}
                        <div className="absolute top-16 flex gap-8 text-[10px] text-slate-400 font-mono">
                            <span>Downwash: {isStrongGroundEffect ? 'Flattened' : 'Normal'}</span>
                        </div>
                    </div>

                    {/* High Pressure Ground Cushion Air Bubble */}
                    {isStrongGroundEffect && (
                        <div
                            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-80 h-28 bg-emerald-500/10 rounded-full blur-2xl animate-pulse pointer-events-none"
                        />
                    )}

                    {/* Runway Surface */}
                    <div className="w-full z-20 space-y-1">
                        <div className="h-2 bg-emerald-500 w-full shadow-[0_0_20px_theme('colors.emerald.500')]" />
                        <div className="bg-slate-900/90 py-2 px-4 rounded-xl border border-slate-700 flex justify-between items-center text-xs">
                            <span className="text-emerald-400 font-bold">Runway Threshold & Touchdown Zone</span>
                            <span className="font-mono text-slate-400">h = {(height * 34).toFixed(1)} m AGL (Span = 34 m)</span>
                        </div>
                    </div>
                </div>

                {/* Controls & Curve (5/12) */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-5">
                        <h3 className="text-lg font-bold text-white">Ground Effect Controls</h3>

                        <div>
                            <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
                                <span>Height Above Runway (h/b)</span>
                                <span className="text-yellow-400 font-mono font-bold">{height.toFixed(2)} b</span>
                            </div>
                            <input
                                type="range"
                                min="0.05"
                                max="1.2"
                                step="0.05"
                                value={height}
                                onChange={e => setHeight(Number(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                            />
                            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                                <span>0.05 b (Wheel touch)</span>
                                <span>0.5 b (Significant)</span>
                                <span>1.0 b (Threshold)</span>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
                                <span>Approach Airspeed</span>
                                <span className="text-sky-400 font-mono font-bold">{approachSpeedKt} kt (Vref + {excessSpeedKt})</span>
                            </div>
                            <input
                                type="range"
                                min="120"
                                max="160"
                                step="1"
                                value={approachSpeedKt}
                                onChange={e => setApproachSpeedKt(Number(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                            />
                            <p className="text-[10px] text-slate-400 mt-1">
                                Excess airspeed during flare dramatically magnifies float distance because induced drag is reduced by {inducedDragReductionPercent}%.
                            </p>
                        </div>
                    </div>

                    {/* Chart: Di reduction vs h/b */}
                    <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
                        <h4 className="text-xs font-bold text-white mb-2">Induced Drag Factor vs Height (h/b)</h4>
                        <div className="h-[180px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis dataKey="hb" stroke="#94a3b8" fontSize={10} />
                                    <YAxis stroke="#94a3b8" fontSize={10} domain={[0, 100]} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem' }}
                                        formatter={(val: number) => [`${val}%`, 'Induced Drag']}
                                        labelFormatter={(label) => `Height: ${label} b`}
                                    />
                                    <ReferenceLine x={height} stroke="#f59e0b" strokeWidth={2} />
                                    <Line type="monotone" dataKey="dragPercent" stroke="#34d399" strokeWidth={2.5} dot={false} name="Di %" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* EASA Aerodynamics Principles & Anti-Patterns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Anti-Pattern: Stretching Glide in Ground Effect */}
                <div className="bg-red-950/20 border border-red-500/30 p-6 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                        <ShieldAlert size={20} />
                        <span>Critical Flight Pitfall: Stretching a Glide in Ground Effect</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                        Pulling back on the control column to stretch a landing flare increases angle of attack. As the aircraft slows or slightly balloons out of the sweet spot of ground effect, induced drag rockets up (<span className="text-red-400 font-mono">D<sub>i</sub> ∝ 1/V²</span>), airspeed collapses, and the aircraft drops onto the runway in an abrupt, heavy touchdown with possible tailstrike.
                    </p>
                    <div className="p-3 bg-red-900/30 rounded-xl border border-red-500/20 text-xs text-red-200">
                        Fly the target V<sub>ref</sub>, accept the natural touchdown point, and never attempt to hold the aircraft off the runway indefinitely.
                    </div>
                </div>

                {/* Takeoff Trap: Premature Liftoff */}
                <div className="bg-amber-950/20 border border-amber-500/30 p-6 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                        <AlertTriangle size={20} />
                        <span>Takeoff Trap: Premature Rotation in Ground Effect</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                        In ground effect, reduced induced drag allows an aircraft to lift off prematurely below proper rotation speed (V<sub>R</sub>) or safety speed (V<sub>2</sub>). As the aircraft climbs through one wingspan (h &gt; 1.0b):
                    </p>
                    <div className="p-3 bg-amber-900/30 rounded-xl border border-amber-500/20 text-xs text-amber-200 space-y-1">
                        <div>1. Induced drag abruptly surges by up to +100%.</div>
                        <div>2. Effective angle of attack decreases, reducing lift.</div>
                        <div>3. Nose pitches down due to increased downwash at the tail.</div>
                        <div className="font-bold text-amber-300">The aircraft may stop climbing and settle back onto the runway or terrain!</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroundEffect;
