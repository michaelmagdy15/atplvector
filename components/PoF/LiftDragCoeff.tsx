import React, { useState, useMemo } from 'react';
import { TrendingUp, Wind, AlertTriangle, ShieldAlert, Compass, Gauge, Info, CheckCircle2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const LiftDragCoeff: React.FC = () => {
    // Aerofoil & Wing parameters
    const [camber, setCamber] = useState<'cambered' | 'symmetrical'>('cambered');
    const [aspectRatio, setAspectRatio] = useState(10);
    
    // Lift equation interactive parameters
    const [aoa, setAoa] = useState(5); // degrees (-4 to 22)
    const [tasKt, setTasKt] = useState(150); // knots
    const [altitudeFt, setAltitudeFt] = useState(5000); // feet
    const [wingArea, setWingArea] = useState(25); // m^2
    const [bankAngle, setBankAngle] = useState(0); // degrees (0 to 60)

    // ISA Atmosphere calculations for density rho
    const { rho, tempK } = useMemo(() => {
        let tempC = 15;
        if (altitudeFt <= 36000) {
            tempC -= (altitudeFt / 1000) * 1.98;
        } else {
            tempC = -56.5;
        }
        const tK = tempC + 273.15;
        // Pressure ratio in troposphere: (1 - 2.25577e-5 * h)^5.25588
        const pRatio = Math.pow(Math.max(0.01, 1 - 2.25577e-5 * (altitudeFt * 0.3048)), 5.25588);
        const pSeaLevel = 101325; // Pa
        const p = pSeaLevel * pRatio;
        const R = 287.05; // J/(kg*K)
        const density = p / (R * tK);
        return { rho: density, tempK: tK };
    }, [altitudeFt]);

    // Stall and lift characteristics
    const zeroLiftAlpha = camber === 'cambered' ? -4 : 0;
    const stallAngle = 15; // Critical angle of attack invariant with weight
    const isStalled = aoa > stallAngle;

    // Dynamic Pressure: q = 0.5 * rho * V^2 (V in m/s)
    const vMetersSec = tasKt * 0.514444;
    const dynamicPressureQ = 0.5 * rho * Math.pow(vMetersSec, 2); // N/m^2 (Pascals)

    // Compute CL at current AoA
    const currentCl = useMemo(() => {
        const slope = 0.11; // ~2pi per radian -> ~0.11 per degree
        if (aoa <= stallAngle) {
            return Math.max(0, slope * (aoa - zeroLiftAlpha));
        } else {
            const peak = slope * (stallAngle - zeroLiftAlpha);
            return Math.max(0.1, peak - 0.12 * (aoa - stallAngle));
        }
    }, [aoa, stallAngle, zeroLiftAlpha]);

    // Total Lift Force: L = CL * 0.5 * rho * V^2 * S = CL * q * S
    const totalLiftN = currentCl * dynamicPressureQ * wingArea;
    const totalLiftKN = totalLiftN / 1000;
    const totalLiftLbs = totalLiftN * 0.224809;

    // Load factor & turn stall speed multiplier: n = 1 / cos(phi), Vs_turn = Vs * sqrt(n)
    const loadFactorN = useMemo(() => {
        const rad = (bankAngle * Math.PI) / 180;
        return 1 / Math.cos(rad);
    }, [bankAngle]);
    const vsTurnMultiplier = Math.sqrt(loadFactorN);

    // Generate Graph Data for CL-Alpha and Drag Polar
    const graphData = useMemo(() => {
        const points = [];
        const maxAlpha = 22;
        const minAlpha = -6;

        for (let a = minAlpha; a <= maxAlpha; a++) {
            let cl = 0;
            const slope = 0.11;
            if (a <= stallAngle) {
                cl = slope * (a - zeroLiftAlpha);
            } else {
                const peak = slope * (stallAngle - zeroLiftAlpha);
                cl = peak - 0.12 * (a - stallAngle);
            }

            // Drag Polar: CD = CD0 + (CL^2 / (pi * e * AR))
            const cd0 = 0.022;
            const e = 0.82;
            const k = 1 / (Math.PI * e * aspectRatio);
            let cd = cd0 + k * Math.pow(Math.max(0, cl), 2);
            if (a > stallAngle) {
                cd += 0.06 * (a - stallAngle); // Massive flow separation drag
            }

            points.push({
                alpha: a,
                cl: Number(cl.toFixed(3)),
                cd: Number(cd.toFixed(4)),
                ldRatio: cd > 0 ? Number((cl / cd).toFixed(1)) : 0
            });
        }
        return points;
    }, [aspectRatio, stallAngle, zeroLiftAlpha]);

    // Current CD and L/D
    const currentCd = useMemo(() => {
        const cd0 = 0.022;
        const e = 0.82;
        const k = 1 / (Math.PI * e * aspectRatio);
        let cd = cd0 + k * Math.pow(Math.max(0, currentCl), 2);
        if (aoa > stallAngle) {
            cd += 0.06 * (aoa - stallAngle);
        }
        return cd;
    }, [aspectRatio, currentCl, aoa, stallAngle]);

    const currentLDRatio = currentCd > 0 ? currentCl / currentCd : 0;

    return (
        <div className="bg-slate-900/50 p-4 md:p-8 rounded-2xl border border-slate-700/80 backdrop-blur-sm space-y-8">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                            Lift Equation & Aerodynamic Coefficients
                        </h2>
                        <p className="text-slate-400 text-sm">
                            Master EASA 081 syllabus: $L = C_L \frac{1}{2} \rho V^2 S$, Angle of Attack relationships, critical stall invariance, and the aeroplane polar.
                        </p>
                    </div>
                </div>
            </div>

            {/* Core Equation Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 rounded-2xl border border-indigo-500/30 shadow-xl">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-1 text-center md:text-left">
                        <span className="text-xs uppercase tracking-widest text-indigo-400 font-bold">The Fundamental Lift Equation</span>
                        <div className="text-2xl md:text-3xl font-mono font-bold text-white tracking-wider">
                            L = C<sub>L</sub> · ½ ρ V² · S
                        </div>
                        <p className="text-xs text-slate-400">
                            Where dynamic pressure <span className="text-sky-300 font-mono">q = ½ ρ V²</span> (fluid kinetic energy), <span className="text-emerald-300 font-mono">S</span> is wing surface area, and <span className="text-amber-300 font-mono">C<sub>L</sub></span> is angle-of-attack dependent.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full md:w-auto">
                        <div className="bg-slate-950/80 p-3 rounded-xl border border-white/5 text-center">
                            <span className="text-[10px] text-slate-500 uppercase font-bold block">Dynamic Press (q)</span>
                            <span className="text-lg font-mono font-bold text-sky-400">{Math.round(dynamicPressureQ)} Pa</span>
                        </div>
                        <div className="bg-slate-950/80 p-3 rounded-xl border border-white/5 text-center">
                            <span className="text-[10px] text-slate-500 uppercase font-bold block">Lift Coeff (C<sub>L</sub>)</span>
                            <span className={`text-lg font-mono font-bold ${isStalled ? 'text-red-400' : 'text-amber-400'}`}>
                                {currentCl.toFixed(2)}
                            </span>
                        </div>
                        <div className="bg-slate-950/80 p-3 rounded-xl border border-white/5 text-center">
                            <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Lift (L)</span>
                            <span className="text-lg font-mono font-bold text-emerald-400">{totalLiftKN.toFixed(1)} kN</span>
                        </div>
                        <div className="bg-slate-950/80 p-3 rounded-xl border border-white/5 text-center">
                            <span className="text-[10px] text-slate-500 uppercase font-bold block">Lift / Drag (L/D)</span>
                            <span className="text-lg font-mono font-bold text-violet-400">{currentLDRatio.toFixed(1)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Interactive Flight & Aerofoil Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-slate-800/60 p-6 rounded-2xl border border-slate-700">
                {/* Angle of Attack (AoA) */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 flex justify-between">
                        <span>Angle of Attack (α)</span>
                        <span className={`font-mono ${isStalled ? 'text-red-400 font-black animate-pulse' : 'text-emerald-400'}`}>
                            {aoa}° {isStalled ? '(STALL!)' : ''}
                        </span>
                    </label>
                    <input
                        type="range"
                        min="-4"
                        max="22"
                        step="1"
                        value={aoa}
                        onChange={e => setAoa(Number(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                        <span>-4° (Zero Lift)</span>
                        <span>15° (α<sub>crit</sub>)</span>
                        <span>22°</span>
                    </div>
                </div>

                {/* True Airspeed (TAS) */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 flex justify-between">
                        <span>True Airspeed (TAS)</span>
                        <span className="text-sky-400 font-mono">{tasKt} kt</span>
                    </label>
                    <input
                        type="range"
                        min="60"
                        max="350"
                        step="5"
                        value={tasKt}
                        onChange={e => setTasKt(Number(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                        <span>60 kt</span>
                        <span>q ∝ V²</span>
                        <span>350 kt</span>
                    </div>
                </div>

                {/* Altitude (Density variation) */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 flex justify-between">
                        <span>Pressure Altitude</span>
                        <span className="text-purple-400 font-mono">{altitudeFt.toLocaleString()} ft</span>
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="40000"
                        step="1000"
                        value={altitudeFt}
                        onChange={e => setAltitudeFt(Number(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                        <span>0 ft (1.225 kg/m³)</span>
                        <span>ρ = {rho.toFixed(3)} kg/m³</span>
                    </div>
                </div>

                {/* Wing Area (S) */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 flex justify-between">
                        <span>Wing Area (S)</span>
                        <span className="text-amber-400 font-mono">{wingArea} m²</span>
                    </label>
                    <input
                        type="range"
                        min="15"
                        max="120"
                        step="5"
                        value={wingArea}
                        onChange={e => setWingArea(Number(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                        <span>15 m² (Light)</span>
                        <span>120 m² (Jet)</span>
                    </div>
                </div>
            </div>

            {/* Aerofoil Profile & Turn Load Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Camber Selection */}
                <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700 space-y-3">
                    <label className="text-xs font-bold text-slate-300 block">Aerofoil Camber Profile</label>
                    <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-xl">
                        <button
                            onClick={() => setCamber('cambered')}
                            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                                camber === 'cambered' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            Cambered
                        </button>
                        <button
                            onClick={() => setCamber('symmetrical')}
                            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                                camber === 'symmetrical' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            Symmetrical
                        </button>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                        {camber === 'cambered'
                            ? 'Camber produces positive lift at 0° AoA. Zero-lift angle is negative (typically -4°).'
                            : 'Symmetrical aerofoils produce ZERO lift at 0° AoA. Zero-lift angle is exactly 0°.'}
                    </p>
                </div>

                {/* Aspect Ratio */}
                <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700 space-y-3">
                    <label className="text-xs font-bold text-slate-300 flex justify-between">
                        <span>Aspect Ratio (AR = b² / S)</span>
                        <span className="text-white font-mono">{aspectRatio}</span>
                    </label>
                    <input
                        type="range"
                        min="5"
                        max="22"
                        step="1"
                        value={aspectRatio}
                        onChange={e => setAspectRatio(Number(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                        High AR (e.g. gliders, 20+) reduces induced drag ($C_{Di} = C_L^2 / (\pi e AR)$), shifting the polar left and boosting $L/D_{max}$.
                    </p>
                </div>

                {/* Bank Angle & Stall Speed in Turns */}
                <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700 space-y-3">
                    <label className="text-xs font-bold text-slate-300 flex justify-between">
                        <span>Bank Angle (φ) & Load Factor (n)</span>
                        <span className="text-yellow-400 font-mono">{bankAngle}° ({loadFactorN.toFixed(2)} G)</span>
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="60"
                        step="5"
                        value={bankAngle}
                        onChange={e => setBankAngle(Number(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                    />
                    <div className="flex justify-between items-center text-[11px] text-slate-400">
                        <span>Stall Speed Multiplier:</span>
                        <span className="font-mono text-yellow-300 font-bold">
                            Vs × {vsTurnMultiplier.toFixed(2)} (+{((vsTurnMultiplier - 1) * 100).toFixed(0)}%)
                        </span>
                    </div>
                </div>
            </div>

            {/* Graphs: CL vs Alpha & Aeroplane Drag Polar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Graph 1: CL vs Alpha */}
                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-white font-bold flex items-center gap-2">
                            <Wind size={18} className="text-emerald-400" /> C<sub>L</sub> vs Angle of Attack (α)
                        </h3>
                        <span className="text-xs text-slate-400 font-mono">α<sub>crit</sub> = {stallAngle}°</span>
                    </div>

                    <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                            <LineChart data={graphData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis
                                    dataKey="alpha"
                                    stroke="#94a3b8"
                                    label={{ value: 'Angle of Attack (°)', position: 'bottom', fill: '#94a3b8', fontSize: 11 }}
                                />
                                <YAxis stroke="#94a3b8" domain={[-0.5, 2.0]} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem' }}
                                    formatter={(val: number) => [val.toFixed(2), 'CL']}
                                    labelFormatter={(val) => `AoA: ${val}°`}
                                />
                                <ReferenceLine x={zeroLiftAlpha} stroke="#94a3b8" strokeDasharray="3 3" label={{ value: 'α0L', fill: '#94a3b8', fontSize: 10 }} />
                                <ReferenceLine x={stallAngle} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'STALL (αcrit)', fill: '#ef4444', fontSize: 11 }} />
                                <ReferenceLine x={aoa} stroke="#10b981" strokeWidth={2} label={{ value: `Current α (${aoa}°)`, fill: '#10b981', position: 'top', fontSize: 10 }} />
                                <Line type="monotone" dataKey="cl" stroke="#34d399" strokeWidth={3} dot={false} name="Lift Coefficient (CL)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-3 text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-white/5">
                        <strong className="text-emerald-400">Key ATPL Law:</strong> The aerofoil always stalls at the critical angle of attack (<span className="text-red-400 font-bold">α<sub>crit</sub> = 15°–18°</span>) regardless of airspeed, gross weight, or bank angle. Weight only changes the airspeed at which α<sub>crit</sub> is reached!
                    </div>
                </div>

                {/* Graph 2: Drag Polar (CL vs CD) */}
                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-white font-bold flex items-center gap-2">
                            <Gauge size={18} className="text-sky-400" /> Aeroplane Drag Polar (C<sub>L</sub> vs C<sub>D</sub>)
                        </h3>
                        <span className="text-xs text-violet-400 font-mono">Max L/D Tangent</span>
                    </div>

                    <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                            <LineChart data={graphData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis
                                    dataKey="cd"
                                    type="number"
                                    domain={[0, 0.25]}
                                    stroke="#94a3b8"
                                    label={{ value: 'Drag Coefficient (CD)', position: 'bottom', fill: '#94a3b8', fontSize: 11 }}
                                />
                                <YAxis
                                    dataKey="cl"
                                    stroke="#94a3b8"
                                    label={{ value: 'CL', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem' }}
                                    formatter={(val: number, name: string) => [val.toFixed(3), name === 'cl' ? 'CL' : 'CD']}
                                    labelFormatter={(val) => `CD: ${Number(val).toFixed(4)}`}
                                />
                                <Line type="monotone" dataKey="cl" stroke="#60a5fa" strokeWidth={3} dot={false} name="CL vs CD" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-3 text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-white/5">
                        <strong className="text-sky-400">Glide & Range Tangent:</strong> The tangent from the origin (0,0) to the polar defines <span className="text-white font-bold">(L/D)<sub>max</sub></span>, which establishes the shallowest glide path (best glide angle <span className="text-violet-300 font-mono">γ = 1 / (L/D)<sub>max</sub></span>).
                    </div>
                </div>
            </div>

            {/* EASA Aerodynamics Principles & Anti-Patterns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Stall Recovery with Ailerons Anti-Pattern */}
                <div className="bg-red-950/20 border border-red-500/30 p-6 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                        <ShieldAlert size={20} />
                        <span>Critical Flight Pitfall: Stall Recovery with Ailerons</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                        Using ailerons near or during stall is a lethal mistake. Deflecting an aileron downward to raise a dropping wingtip increases that wingtip&apos;s effective camber and local angle of attack, driving it past α<sub>crit</sub> into a deeper, asymmetric stall and triggering an immediate spin entry.
                    </p>
                    <div className="p-3 bg-red-900/30 rounded-xl border border-red-500/20 text-xs text-red-200 font-semibold">
                        Correct Procedure: Unload the wing (push elevator forward) to break the stall before correcting any bank angle with rudder and coordinated control.
                    </div>
                </div>

                {/* Level Turn Stall Speed Formula */}
                <div className="bg-indigo-950/20 border border-indigo-500/30 p-6 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                        <Compass size={20} />
                        <span>Turn Stall Speed Dynamics: V<sub>s_turn</sub> = V<sub>s</sub> · √n</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                        In a coordinated level turn, lift must increase to support both weight and centrifugal load: <span className="text-white font-mono">L = W / cos(φ)</span>, where load factor <span className="text-white font-mono">n = 1 / cos(φ)</span>. Because stall speed scales with the square root of lift required:
                    </p>
                    <div className="p-3 bg-indigo-900/30 rounded-xl border border-indigo-500/20 text-xs text-indigo-200 font-mono">
                        At 60° bank: cos(60°) = 0.5 → n = 2.0 G → V<sub>s_turn</sub> = V<sub>s</sub> · √2.0 = 1.414 · V<sub>s</sub> (+41% increase in stall speed!).
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiftDragCoeff;
