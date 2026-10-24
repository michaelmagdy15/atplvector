import React, { useState, useMemo } from 'react';
import { Activity, Gauge, ArrowRightLeft, AlertTriangle, ShieldCheck, HelpCircle, Layers, Sliders } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea } from 'recharts';

const TotalDrag: React.FC = () => {
    // Interactive operational variables
    const [weightMultiplier, setWeightMultiplier] = useState(1.0); // 0.7 (Light) to 1.3 (Heavy)
    const [config, setConfig] = useState<'CLEAN' | 'FLAPS_GEAR'>('CLEAN');
    const [altitudeFt, setAltitudeFt] = useState(0); // 0 to 35,000 ft
    const [selectedSpeed, setSelectedSpeed] = useState(180); // Airspeed cursor

    // Density ratio sigma = rho / rho0
    const sigma = useMemo(() => {
        let tempC = 15;
        if (altitudeFt <= 36000) {
            tempC -= (altitudeFt / 1000) * 1.98;
        } else {
            tempC = -56.5;
        }
        const tempK = tempC + 273.15;
        const pRatio = Math.pow(Math.max(0.01, 1 - 2.25577e-5 * (altitudeFt * 0.3048)), 5.25588);
        const rho = (101325 * pRatio) / (287.05 * tempK);
        return rho / 1.225;
    }, [altitudeFt]);

    // Aerodynamic constants
    // Di = (k * W^2) / (sigma * V^2)
    // Dp = c_p * sigma * V^2
    const baseK = 1800000;
    const baseC = 0.024;

    const k = baseK * Math.pow(weightMultiplier, 2);
    const cp = config === 'CLEAN' ? baseC : baseC * 2.2; // flaps/gear doubles+ parasite drag

    // Calculate Vimd analytically where Di = Dp:
    // (k / (sigma * V^2)) = cp * sigma * V^2
    // V^4 = k / (cp * sigma^2) => V_imd_tas = (k / (cp * sigma^2))^(0.25)
    const vImdTAS = Math.round(Math.pow(k / (cp * Math.pow(sigma, 2)), 0.25));
    // V_imd_ias approx TAS * sqrt(sigma)
    const vImdIAS = Math.round(vImdTAS * Math.sqrt(sigma));

    // Generate curve data (range 80 kt to 360 kt TAS)
    const { chartData, minDragValue } = useMemo(() => {
        const data = [];
        let minDrag = Infinity;

        for (let v = 70; v <= 360; v += 5) {
            const di = k / (sigma * v * v);
            const dp = cp * sigma * v * v;
            const total = di + dp;

            if (total < minDrag) {
                minDrag = total;
            }

            data.push({
                speed: v,
                induced: Math.round(di),
                parasite: Math.round(dp),
                total: Math.round(total)
            });
        }
        return { chartData: data, minDragValue: Math.round(minDrag) };
    }, [k, cp, sigma]);

    // Selected speed forces
    const currentDi = Math.round(k / (sigma * selectedSpeed * selectedSpeed));
    const currentDp = Math.round(cp * sigma * selectedSpeed * selectedSpeed);
    const currentTotal = currentDi + currentDp;
    const isBackSide = selectedSpeed < vImdTAS;

    return (
        <div className="bg-slate-900/50 p-4 md:p-8 rounded-2xl border border-slate-700 backdrop-blur-sm space-y-8">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
                        <Activity size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                            Total Drag Polar Decomposition & V<sub>IMD</sub>
                        </h2>
                        <p className="text-slate-400 text-sm">
                            Induced Drag (1/V²), Parasite Drag (V²), Minimum Drag Speed, and Speed Stability regimes.
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Min Drag Speed (V<sub>IMD</sub> TAS)</span>
                    <div className="text-2xl font-black text-white mt-1 flex items-baseline gap-1">
                        {vImdTAS} <span className="text-xs font-normal text-slate-400">kt</span>
                    </div>
                    <span className="text-[11px] text-amber-400 mt-1 block">IAS: ~{vImdIAS} kt</span>
                </div>

                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Minimum Total Drag</span>
                    <div className="text-2xl font-black text-white mt-1 flex items-baseline gap-1">
                        {minDragValue.toLocaleString()} <span className="text-xs font-normal text-slate-400">N</span>
                    </div>
                    <span className="text-[11px] text-emerald-400 mt-1 block">Di = Dp at V<sub>IMD</sub></span>
                </div>

                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Speed Stability Regime</span>
                    <div className={`text-lg font-black mt-1 flex items-center gap-1.5 ${isBackSide ? 'text-red-400' : 'text-emerald-400'}`}>
                        {isBackSide ? (
                            <>
                                <AlertTriangle size={18} /> Reverse Command
                            </>
                        ) : (
                            <>
                                <ShieldCheck size={18} /> Speed Stable
                            </>
                        )}
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                        {isBackSide ? 'Back side of drag curve' : 'Front side of drag curve'}
                    </span>
                </div>

                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Best Glide Range (L/D)<sub>max</sub></span>
                    <div className="text-2xl font-black text-sky-400 mt-1 flex items-baseline gap-1">
                        Occurs at V<sub>IMD</sub>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">Glide angle γ = 1 / (L/D)<sub>max</sub></span>
                </div>
            </div>

            {/* Interactive Control Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-slate-800/60 p-6 rounded-2xl border border-slate-700">
                {/* Aircraft Weight Slider */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 flex justify-between">
                        <span>Aircraft Gross Weight</span>
                        <span className="text-amber-400 font-mono">{(weightMultiplier * 100).toFixed(0)}%</span>
                    </label>
                    <input
                        type="range"
                        min="0.7"
                        max="1.3"
                        step="0.05"
                        value={weightMultiplier}
                        onChange={e => setWeightMultiplier(Number(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                        <span>Light (0.7x)</span>
                        <span>MTOW (1.3x)</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Weight increases induced drag, shifting V<sub>IMD</sub> to higher airspeeds.</p>
                </div>

                {/* Configuration: Clean vs Flaps/Gear */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 block">Aircraft Configuration</label>
                    <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-xl">
                        <button
                            onClick={() => setConfig('CLEAN')}
                            className={`py-2 px-2 text-xs font-bold rounded-lg transition-all ${
                                config === 'CLEAN' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            Clean
                        </button>
                        <button
                            onClick={() => setConfig('FLAPS_GEAR')}
                            className={`py-2 px-2 text-xs font-bold rounded-lg transition-all ${
                                config === 'FLAPS_GEAR' ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            Flaps & Gear
                        </button>
                    </div>
                    <p className="text-[10px] text-slate-400">Flaps/Gear extension spikes parasite drag, shifting V<sub>IMD</sub> to a lower speed.</p>
                </div>

                {/* Altitude Slider */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 flex justify-between">
                        <span>Cruise Altitude</span>
                        <span className="text-purple-400 font-mono">{altitudeFt.toLocaleString()} ft</span>
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="35000"
                        step="1000"
                        value={altitudeFt}
                        onChange={e => setAltitudeFt(Number(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                        <span>Sea Level</span>
                        <span>FL350 (ρ/ρ0 = {sigma.toFixed(2)})</span>
                    </div>
                    <p className="text-[10px] text-slate-400">At altitude, TAS for minimum drag increases while IAS remains constant.</p>
                </div>

                {/* Speed Cursor Slider */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 flex justify-between">
                        <span>Probe Airspeed (TAS)</span>
                        <span className="text-sky-400 font-mono">{selectedSpeed} kt</span>
                    </label>
                    <input
                        type="range"
                        min="80"
                        max="340"
                        step="5"
                        value={selectedSpeed}
                        onChange={e => setSelectedSpeed(Number(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                        <span>Total: {currentTotal.toLocaleString()} N</span>
                        <span>Di: {currentDi} | Dp: {currentDp}</span>
                    </div>
                </div>
            </div>

            {/* Total Drag Interactive Chart */}
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex flex-col">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                    <h3 className="text-white font-bold flex items-center gap-2">
                        <Gauge size={18} className="text-amber-400" /> Total Drag Curve & Components
                    </h3>
                    <div className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1.5 text-red-400">
                            <span className="w-3 h-0.5 bg-red-400 inline-block"></span> Induced Drag (1/V²)
                        </span>
                        <span className="flex items-center gap-1.5 text-emerald-400">
                            <span className="w-3 h-0.5 bg-emerald-400 inline-block"></span> Parasite Drag (V²)
                        </span>
                        <span className="flex items-center gap-1.5 text-amber-400">
                            <span className="w-3 h-1 bg-amber-400 inline-block"></span> Total Drag
                        </span>
                    </div>
                </div>

                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis
                                dataKey="speed"
                                stroke="#94a3b8"
                                label={{ value: 'Airspeed (TAS in knots)', position: 'bottom', fill: '#94a3b8', fontSize: 12 }}
                            />
                            <YAxis
                                stroke="#94a3b8"
                                label={{ value: 'Drag Force (Newtons)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 12 }}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem' }}
                                itemStyle={{ color: '#fff' }}
                                formatter={(val: number) => [`${val.toLocaleString()} N`]}
                                labelFormatter={(label) => `Airspeed: ${label} kt`}
                            />

                            {/* Backside shading */}
                            <ReferenceArea x1={70} x2={vImdTAS} fill="#ef4444" fillOpacity={0.07} />

                            {/* V_imd reference line */}
                            <ReferenceLine
                                x={vImdTAS}
                                stroke="#f59e0b"
                                strokeWidth={2}
                                strokeDasharray="4 4"
                                label={{ value: `Vimd (${vImdTAS} kt)`, fill: '#f59e0b', position: 'top', fontSize: 11 }}
                            />

                            {/* Current speed marker */}
                            <ReferenceLine
                                x={selectedSpeed}
                                stroke="#38bdf8"
                                strokeWidth={2}
                                label={{ value: `${selectedSpeed} kt`, fill: '#38bdf8', position: 'insideTopRight', fontSize: 11 }}
                            />

                            <Line type="monotone" dataKey="total" stroke="#f59e0b" strokeWidth={3.5} dot={false} name="Total Drag" />
                            <Line type="monotone" dataKey="induced" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Induced Drag" />
                            <Line type="monotone" dataKey="parasite" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Parasite Drag" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="flex flex-col sm:flex-row justify-between text-xs text-slate-400 mt-2 px-2">
                    <span className="text-red-400 font-semibold">← Region of Reverse Command (Slower = More Drag)</span>
                    <span className="text-emerald-400 font-semibold">Region of Normal Command (Faster = More Drag) →</span>
                </div>
            </div>

            {/* EASA Aerodynamics Frameworks & Mental Models */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mental Model: The Seesaw of Drag */}
                <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-3">
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                        <ArrowRightLeft size={20} />
                        <span>Cockpit Mental Model: &quot;The Seesaw of Drag&quot;</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                        Picture induced drag on the left and parasite drag on the right of a seesaw. At low airspeeds, high angle of attack tilts the seesaw toward massive induced drag (<span className="text-red-400 font-mono">D<sub>i</sub> ∝ 1/V²</span>). As the aircraft accelerates, induced drag drops off steeply while parasite drag (<span className="text-emerald-400 font-mono">D<sub>p</sub> ∝ V²</span>) rocks up.
                    </p>
                    <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-xs text-amber-200">
                        <strong>V<sub>IMD</sub> is the exact balance point</strong> where induced drag equals parasite drag (D<sub>i</sub> = D<sub>p</sub>). This speed guarantees minimum thrust required for level flight and yields maximum glide range.
                    </div>
                </div>

                {/* Speed Stability: Front vs Back Side */}
                <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-3">
                    <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                        <Sliders size={20} />
                        <span>Front Side vs Back Side of the Drag Curve</span>
                    </div>
                    <div className="space-y-2 text-xs text-slate-300">
                        <div className="p-2.5 bg-slate-900 rounded-lg border border-white/5">
                            <span className="text-emerald-400 font-bold">Front Side (V &gt; V<sub>IMD</sub>):</span> Speed stable. A decrease in speed reduces drag, causing excess thrust that naturally accelerates the aircraft back toward trim speed.
                        </div>
                        <div className="p-2.5 bg-slate-900 rounded-lg border border-white/5">
                            <span className="text-red-400 font-bold">Back Side (V &lt; V<sub>IMD</sub>):</span> Speed unstable (&quot;Reverse Command&quot;). A slight speed drop causes induced drag to surge, requiring <span className="text-white font-bold">more thrust</span> to maintain level flight. If power is not added, airspeed bleeds uncontrollably toward stall.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TotalDrag;
