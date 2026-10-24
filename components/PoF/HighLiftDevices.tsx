import React, { useState, useMemo } from 'react';
import { Settings, Wind, Layers, ArrowUpRight, ShieldCheck, Activity, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

type FlapType = 'plain' | 'split' | 'slotted' | 'fowler';

const HighLiftDevices: React.FC = () => {
    const [flapType, setFlapType] = useState<FlapType>('fowler');
    const [flapSetting, setFlapSetting] = useState<number>(20); // 0° to 40°
    const [slatDeployed, setSlatDeployed] = useState<boolean>(true);
    const [probeAoA, setProbeAoA] = useState<number>(8); // Angle of attack probe

    // High lift device aerodynamic impact calculations
    const flapExtensionRatio = flapSetting / 40; // 0 to 1

    // Delta CL and stall angle changes
    const flapEffect = useMemo(() => {
        let maxClDelta = 0.5;
        let deltaStallAngle = -2; // flaps shift stall angle left
        let dragMultiplier = 1 + flapExtensionRatio * 2.5;

        switch (flapType) {
            case 'plain':
                maxClDelta = 0.5 * flapExtensionRatio;
                deltaStallAngle = -2 * flapExtensionRatio;
                break;
            case 'split':
                maxClDelta = 0.65 * flapExtensionRatio;
                deltaStallAngle = -3 * flapExtensionRatio;
                dragMultiplier = 1 + flapExtensionRatio * 3.2; // split creates massive wake drag
                break;
            case 'slotted':
                maxClDelta = 0.75 * flapExtensionRatio;
                deltaStallAngle = -1 * flapExtensionRatio; // slot helps delay separation
                break;
            case 'fowler':
                maxClDelta = 1.05 * flapExtensionRatio; // Fowler increases both camber AND wing area S
                deltaStallAngle = -2 * flapExtensionRatio;
                dragMultiplier = 1 + flapExtensionRatio * 2.8;
                break;
        }

        return { maxClDelta, deltaStallAngle, dragMultiplier };
    }, [flapType, flapExtensionRatio]);

    const slatEffect = useMemo(() => {
        if (!slatDeployed) return { deltaCl: 0, deltaStallAngle: 0 };
        // Slats re-energize the boundary layer, delaying separation to higher AoA
        return { deltaCl: 0.25, deltaStallAngle: 6 }; // +6° stall margin
    }, [slatDeployed]);

    // Generate multi-curve data for CL vs Alpha
    const chartData = useMemo(() => {
        const points = [];
        const cleanStall = 15;
        const currentStall = cleanStall + flapEffect.deltaStallAngle + slatEffect.deltaStallAngle;

        for (let a = -4; a <= 26; a++) {
            // Clean wing curve
            let clClean = 0;
            if (a <= cleanStall) {
                clClean = 0.11 * (a - (-4));
            } else {
                clClean = Math.max(0.2, 0.11 * (cleanStall - (-4)) - 0.12 * (a - cleanStall));
            }

            // Flap only curve
            const stallFlapOnly = cleanStall + flapEffect.deltaStallAngle;
            let clFlap = 0;
            if (a <= stallFlapOnly) {
                clFlap = 0.11 * (a - (-4)) + flapEffect.maxClDelta;
            } else {
                clFlap = Math.max(0.2, (0.11 * (stallFlapOnly - (-4)) + flapEffect.maxClDelta) - 0.12 * (a - stallFlapOnly));
            }

            // Slat only curve
            const stallSlatOnly = cleanStall + slatEffect.deltaStallAngle;
            let clSlat = 0;
            if (a <= stallSlatOnly) {
                clSlat = 0.11 * (a - (-4)) + (slatDeployed ? 0.05 : 0);
            } else {
                clSlat = Math.max(0.2, (0.11 * (stallSlatOnly - (-4)) + (slatDeployed ? 0.05 : 0)) - 0.12 * (a - stallSlatOnly));
            }

            // Combined current configuration curve
            let clCurrent = 0;
            if (a <= currentStall) {
                clCurrent = 0.11 * (a - (-4)) + flapEffect.maxClDelta + (slatDeployed ? 0.15 : 0);
            } else {
                const peak = 0.11 * (currentStall - (-4)) + flapEffect.maxClDelta + (slatDeployed ? 0.15 : 0);
                clCurrent = Math.max(0.2, peak - 0.12 * (a - currentStall));
            }

            points.push({
                alpha: a,
                clClean: Number(Math.max(0, clClean).toFixed(2)),
                clCurrent: Number(Math.max(0, clCurrent).toFixed(2)),
                clFlapOnly: Number(Math.max(0, clFlap).toFixed(2)),
                clSlatOnly: Number(Math.max(0, clSlat).toFixed(2))
            });
        }
        return { points, currentStall };
    }, [flapEffect, slatEffect, slatDeployed]);

    // Probe AoA values
    const cleanStall = 15;
    const currentStall = chartData.currentStall;
    const isProbeStalled = probeAoA > currentStall;

    return (
        <div className="bg-slate-900/50 p-4 md:p-8 rounded-2xl border border-slate-700 backdrop-blur-sm space-y-8">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 bg-purple-500/20 text-purple-400 rounded-xl border border-purple-500/30">
                        <Settings size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                            High-Lift Devices: Flaps & Leading Edge Slats
                        </h2>
                        <p className="text-slate-400 text-sm">
                            Trailing Edge Flaps (camber & Fowler chord extension) vs Leading Edge Slats (boundary layer re-energization).
                        </p>
                    </div>
                </div>
            </div>

            {/* Interactive Wing Profile Visualizer */}
            <div className="bg-[#0b1324] rounded-2xl border border-slate-700 p-6 relative overflow-hidden flex flex-col items-center justify-center">
                <div className="w-full flex justify-between text-xs text-slate-400 mb-4 z-20">
                    <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-sky-400 inline-block"></span>
                        Leading Edge Slat: {slatDeployed ? 'Extended (Ducting Airflow)' : 'Retracted'}
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block"></span>
                        Trailing Edge Flap: {flapType.toUpperCase()} at {flapSetting}°
                    </span>
                </div>

                <div className="relative w-full max-w-2xl h-44 flex items-center justify-center">
                    <svg viewBox="0 0 600 180" className="w-full h-full">
                        {/* Streamlines / Boundary Layer */}
                        <g opacity="0.35">
                            {/* Upper boundary layer streamlines */}
                            <path d="M 20 80 Q 200 10 550 110" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6 4" />
                            <path d="M 20 60 Q 200 -10 550 90" fill="none" stroke="#38bdf8" strokeWidth="2" />
                            {/* Slotted air stream */}
                            {slatDeployed && (
                                <path d="M 70 120 Q 110 80 250 50" fill="none" stroke="#facc15" strokeWidth="3" strokeDasharray="4 2" />
                            )}
                            {flapType === 'slotted' || flapType === 'fowler' ? (
                                flapSetting > 10 && (
                                    <path d="M 400 120 Q 440 90 540 140" fill="none" stroke="#a855f7" strokeWidth="3" strokeDasharray="4 2" />
                                )
                            ) : null}
                        </g>

                        {/* Main Wing Body */}
                        <path
                            d="M 120 70 C 220 30, 360 40, 440 75 L 430 115 C 340 115, 220 115, 130 95 Z"
                            fill="#334155"
                            stroke="#64748b"
                            strokeWidth="2"
                        />

                        {/* Leading Edge Slat */}
                        <g
                            transform={slatDeployed ? 'translate(-25, 12) rotate(-8 100 80)' : 'translate(0, 0)'}
                            className="transition-transform duration-500 ease-out"
                        >
                            <path
                                d="M 80 85 C 90 60, 115 65, 125 70 L 120 85 C 110 80, 95 80, 80 85 Z"
                                fill="#38bdf8"
                                stroke="#0284c7"
                                strokeWidth="2"
                            />
                            {slatDeployed && (
                                <text x="70" y="50" fill="#38bdf8" fontSize="10" fontWeight="bold">Slat Gap (Ducts High Pressure Air)</text>
                            )}
                        </g>

                        {/* Trailing Edge Flap */}
                        {(() => {
                            let tx = 0;
                            let ty = 0;
                            const rot = flapSetting;

                            if (flapType === 'fowler') {
                                tx = flapExtensionRatio * 45; // Fowler extends chord rearward
                                ty = flapExtensionRatio * 15;
                            } else if (flapType === 'slotted') {
                                tx = flapExtensionRatio * 12;
                                ty = flapExtensionRatio * 6;
                            }

                            return (
                                <g
                                    transform={`translate(${tx}, ${ty}) rotate(${rot} 440 75)`}
                                    className="transition-transform duration-500 ease-out"
                                >
                                    <path
                                        d="M 440 75 C 490 85, 520 95, 540 100 L 530 115 C 490 110, 455 105, 435 95 Z"
                                        fill="#6366f1"
                                        stroke="#4338ca"
                                        strokeWidth="2"
                                    />
                                    {flapType === 'fowler' && flapSetting > 10 && (
                                        <text x="460" y="55" fill="#a5b4fc" fontSize="10" fontWeight="bold">Wing Area Extended +{Math.round(flapExtensionRatio * 20)}%</text>
                                    )}
                                </g>
                            );
                        })()}
                    </svg>
                </div>
            </div>

            {/* Controls Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-800/60 p-6 rounded-2xl border border-slate-700">
                {/* Flap Type Selection */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-300 block">Flap Architecture</label>
                    <div className="grid grid-cols-2 gap-2">
                        {(['plain', 'split', 'slotted', 'fowler'] as FlapType[]).map(type => (
                            <button
                                key={type}
                                onClick={() => setFlapType(type)}
                                className={`py-2 px-3 rounded-xl text-xs font-bold uppercase transition-all ${
                                    flapType === type ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:text-white'
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                        {flapType === 'fowler' && 'Fowler: Extends backwards then downward. Increases both camber AND wing area (S).'}
                        {flapType === 'slotted' && 'Slotted: Allows high-energy underwing air into the upper boundary layer.'}
                        {flapType === 'split' && 'Split: Deflects lower surface only. Creates a massive turbulent low-pressure drag wake.'}
                        {flapType === 'plain' && 'Plain: Simple hinged trailing edge increasing overall section camber.'}
                    </p>
                </div>

                {/* Flap Extension Angle */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-300 flex justify-between">
                        <span>Trailing Edge Flap Angle</span>
                        <span className="text-indigo-400 font-mono font-bold">{flapSetting}°</span>
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="40"
                        step="5"
                        value={flapSetting}
                        onChange={e => setFlapSetting(Number(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                        <span>0° (Clean)</span>
                        <span>15° (Takeoff Lift)</span>
                        <span>40° (Landing Drag)</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                        Small deflections (1°–15°) provide lift with modest drag. Large deflections (&gt;25°) provide immense parasite drag for steep landing approaches.
                    </p>
                </div>

                {/* Leading Edge Slat & AoA Probe */}
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-300 block mb-2">Leading Edge Slats</label>
                        <button
                            onClick={() => setSlatDeployed(!slatDeployed)}
                            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                                slatDeployed ? 'bg-sky-500 text-white shadow-lg' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            }`}
                        >
                            <Wind size={16} />
                            {slatDeployed ? 'Slats EXTENDED (Boundary Layer Energized)' : 'Slats RETRACTED'}
                        </button>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-300 flex justify-between mb-1">
                            <span>Test Angle of Attack (α)</span>
                            <span className={`font-mono ${isProbeStalled ? 'text-red-400 font-black' : 'text-emerald-400'}`}>
                                {probeAoA}° {isProbeStalled ? '(STALLED)' : ''}
                            </span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="24"
                            step="1"
                            value={probeAoA}
                            onChange={e => setProbeAoA(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                    </div>
                </div>
            </div>

            {/* CL vs Alpha Comparison Chart */}
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex flex-col">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                    <h3 className="text-white font-bold flex items-center gap-2">
                        <Activity size={18} className="text-purple-400" /> High-Lift Polar Shift: C<sub>L</sub> vs Angle of Attack
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs">
                        <span className="flex items-center gap-1.5 text-slate-400">
                            <span className="w-3 h-0.5 bg-slate-400 inline-block"></span> Clean Wing
                        </span>
                        <span className="flex items-center gap-1.5 text-indigo-400">
                            <span className="w-3 h-1 bg-indigo-500 inline-block"></span> Current Configuration
                        </span>
                    </div>
                </div>

                <div className="h-[340px] w-full">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                        <LineChart data={chartData.points} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis
                                dataKey="alpha"
                                stroke="#94a3b8"
                                label={{ value: 'Angle of Attack (°)', position: 'bottom', fill: '#94a3b8', fontSize: 12 }}
                            />
                            <YAxis stroke="#94a3b8" domain={[0, 2.8]} label={{ value: 'CL', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem' }}
                                itemStyle={{ color: '#fff' }}
                            />

                            <ReferenceLine x={cleanStall} stroke="#94a3b8" strokeDasharray="3 3" label={{ value: 'Clean Stall (15°)', fill: '#94a3b8', fontSize: 10 }} />
                            <ReferenceLine x={currentStall} stroke="#ef4444" strokeDasharray="4 4" label={{ value: `Config Stall (${currentStall}°)`, fill: '#ef4444', fontSize: 11 }} />
                            <ReferenceLine x={probeAoA} stroke="#10b981" strokeWidth={2} label={{ value: `α = ${probeAoA}°`, fill: '#10b981', position: 'insideTopLeft', fontSize: 11 }} />

                            <Line type="monotone" dataKey="clClean" stroke="#94a3b8" strokeWidth={2} strokeDasharray="4 4" dot={false} name="Clean Wing" />
                            <Line type="monotone" dataKey="clCurrent" stroke="#6366f1" strokeWidth={3.5} dot={false} name="Current Config" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-700 text-xs text-slate-300">
                    <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5">
                        <strong className="text-indigo-400">Flaps Effect (Up & Left):</strong> Increases camber, shifting the curve up and to the left. Increases maximum lift coefficient (C<sub>Lmax</sub>) but <span className="text-yellow-400 font-semibold">decreases stall angle</span> slightly.
                    </div>
                    <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5">
                        <strong className="text-sky-400">Slats Effect (Right & Up):</strong> Ducts high pressure air to delay boundary layer separation. Maintains the curve slope while <span className="text-emerald-400 font-semibold">increasing stall angle (αcrit)</span> up to 20°–24°.
                    </div>
                </div>
            </div>

            {/* EASA Aerodynamics Boundary Layer Physics Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-3">
                    <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                        <Layers size={20} />
                        <span>Boundary Layer: Laminar vs Turbulent</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                        The boundary layer is the thin viscous fluid layer adjacent to the aerofoil surface where friction slows air molecules from freestream to zero:
                    </p>
                    <div className="space-y-2 text-xs text-slate-300">
                        <div className="p-2.5 bg-slate-900 rounded-lg border border-white/5">
                            <span className="text-sky-400 font-bold">Laminar Layer:</span> Very thin, smooth, low skin friction drag, but possesses low kinetic energy. It is easily separated by adverse pressure gradients.
                        </div>
                        <div className="p-2.5 bg-slate-900 rounded-lg border border-white/5">
                            <span className="text-amber-400 font-bold">Turbulent Layer:</span> Thicker, turbulent mixing, higher skin friction drag, but high kinetic energy allows it to resist adverse pressure gradients and remain attached much longer.
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-3">
                    <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                        <Wind size={20} />
                        <span>Slot / Slat Aerodynamic Mechanism</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                        Leading-edge slats create a convergent nozzle slot between the slat and the main wing. High-pressure air from the lower surface is accelerated through this slot and injected tangentially into the retarded boundary layer on the upper surface.
                    </p>
                    <div className="p-3 bg-purple-900/20 rounded-xl border border-purple-500/20 text-xs text-purple-200">
                        <strong>Re-energizing the boundary layer</strong> restores momentum to the fluid particles, enabling them to overcome the steep adverse pressure gradient at high angles of attack without separating.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HighLiftDevices;
