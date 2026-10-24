import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wind, Gauge, AlertTriangle, TrendingUp, Info, Fuel, Shield, ArrowDown, ArrowUp, Compass } from 'lucide-react';

const CGEffects: React.FC = () => {
    // CG Position in % MAC (Typical transport range: 0% to 50%, certified envelope 15% to 35%)
    const [cgPos, setCgPos] = useState<number>(26); // Default near sweet spot

    // Modern Airliner Trim Tank Active toggle
    const [trimTankActive, setTrimTankActive] = useState<boolean>(false);

    // Certified Envelope Limits
    const FWD_LIMIT = 15;
    const AFT_LIMIT = 35;
    const SWEET_SPOT_MIN = 28;
    const SWEET_SPOT_MAX = 33;

    // Derived Aerodynamic & Flight Mechanics (Based on Croucher Ch 10)
    // 1. Static Margin & Longitudinal Stability (Distance between CG and Neutral Point)
    // At Fwd CG (15%): Static margin is large (~25%), stability is high (95%), heavy stick forces
    // At Aft CG (35%): Static margin approaches certified minimum, stability drops to ~30%, sensitive stick
    // Beyond 38%: Neutral/negative stability -> pitch-divergent instability
    const stabilityScore = Math.max(0, Math.min(100, 100 - ((cgPos - 10) * 2.8)));

    // 2. Control Stick Force Gradient (Stick force per 'g'):
    // High stick force at Fwd CG (requires strong pilot pull), Light/sensitive at Aft CG
    const stickForceScore = Math.max(10, Math.min(100, 100 - ((cgPos - 10) * 2.5)));

    // 3. Tail Downforce (Downward Aerodynamic Lift on Horizontal Stabilizer):
    // Tail acts as downward force to balance nose-down moment (Lift-Weight couple)
    // When CG is far forward, arm to CP is large, requiring massive downward tail force.
    // Normalized downforce in kN for a 65,000 kg airliner:
    const tailDownforceKn = Math.max(2, 45 - ((cgPos - 10) * 1.15));

    // 4. Stall Speed (Vs) Impact:
    // Required Wing Lift = Aircraft Weight + Tail Downforce!
    // Downforce acts as "dead weight".
    // Base Vs = 125 kt at 65 tonnes in clean config.
    // Each 10 kN of tail downforce adds ~1.2 kt to stall speed!
    const baseVs = 125.0;
    const stallSpeed = Number((baseVs + (tailDownforceKn * 0.12)).toFixed(1));

    // 5. Trim Drag & Fuel Burn:
    // Wing Induced Drag increases with square of total lift: L^2 = (W + T_down)^2.
    // Plus the profile/induced drag of the horizontal tail itself.
    // Base cruise burn = 2,400 kg/hr at optimal aft CG. Up to +2.5% penalty at forward CG.
    const baseBurn = 2400;
    const trimDragPenaltyPct = Number(((tailDownforceKn - 5) * 0.06).toFixed(2));
    const effectiveBurn = Math.round(baseBurn * (1 + trimDragPenaltyPct / 100));

    // Stabilizer Trim Setting (Units of nose-up trim)
    const stabTrimUnits = Number((8.5 - ((cgPos - 10) * 0.18)).toFixed(1));

    // Handle Trim Tank Activation (A330/A340/B747/B777 logic)
    const handleToggleTrimTank = () => {
        if (!trimTankActive) {
            setTrimTankActive(true);
            setCgPos(31.5); // Shifts to optimum aft cruise sweet spot
        } else {
            setTrimTankActive(false);
            setCgPos(22.0); // Fuel pumped forward for descent/landing
        }
    };

    return (
        <div className="bg-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl border border-slate-700 font-sans space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700 pb-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                        <Compass className="w-3.5 h-3.5" /> Subject 031 • Flight Mechanics & Stability
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight">
                        Forward vs Aft Center of Gravity Trade-Offs
                    </h2>
                    <p className="text-slate-400 text-sm mt-1 max-w-2xl leading-relaxed">
                        Understand the fundamental physics of the wing-tail seesaw. Discover why forward CG costs fuel and raises stall speed, while aft CG saves fuel but reduces longitudinal stability.
                    </p>
                </div>

                {/* Trim Tank Cruise Simulation Switch */}
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700 flex items-center gap-3">
                    <Fuel className={`w-5 h-5 ${trimTankActive ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
                    <div>
                        <div className="text-xs font-bold text-white">Horizontal Stabilizer Trim Tank</div>
                        <div className="text-[10px] text-slate-400">Pumps fuel aft during cruise for 1–2% burn savings</div>
                    </div>
                    <button
                        onClick={handleToggleTrimTank}
                        className={`ml-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            trimTankActive
                                ? 'bg-amber-500 text-slate-900 shadow-md shadow-amber-500/20'
                                : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                        }`}
                    >
                        {trimTankActive ? 'PUMP FORWARD' : 'TRANSFER AFT'}
                    </button>
                </div>
            </div>

            {/* Aerodynamic Diagram & Force Couple */}
            <div className="grid lg:grid-cols-12 gap-8">
                {/* Visual Aircraft Physics (8 cols) */}
                <div className="lg:col-span-8 bg-slate-900/90 rounded-2xl border border-slate-700 p-6 md:p-8 relative overflow-hidden flex flex-col justify-between min-h-[380px]">
                    <div className="flex justify-between items-center text-xs font-mono text-slate-400 border-b border-slate-800 pb-3 z-10">
                        <span>AERODYNAMIC EQUILIBRIUM: LIFT = WEIGHT + TAIL DOWNFORCE</span>
                        <span className="text-amber-400 font-bold">CG: {cgPos.toFixed(1)}% MAC</span>
                    </div>

                    {/* Aircraft Profile Schematic */}
                    <div className="relative w-full my-8 select-none">
                        {/* Fuselage Spine */}
                        <div className="h-12 bg-slate-800 rounded-full border border-slate-700 relative flex items-center justify-between px-8">
                            <span className="text-xs font-bold text-slate-400">NOSE</span>
                            <span className="text-xs font-bold text-slate-400">TAIL</span>

                            {/* Wing Root & Lift Vector (Center of Pressure CP at ~33% MAC) */}
                            <div className="absolute left-[38%] top-0 bottom-0 w-24 bg-blue-900/40 border-x border-blue-500/50 flex flex-col items-center">
                                {/* Upward Lift Vector */}
                                <motion.div
                                    className="absolute bottom-full mb-1 flex flex-col items-center"
                                    animate={{ height: 60 + (tailDownforceKn * 1.5) }}
                                >
                                    <span className="text-[10px] font-mono font-bold text-emerald-400 whitespace-nowrap mb-1">
                                        Total Lift: {(650 + tailDownforceKn).toFixed(0)} kN
                                    </span>
                                    <div className="w-1.5 bg-emerald-500 flex-1 rounded-t"></div>
                                    <ArrowUp className="w-4 h-4 text-emerald-400 -mt-1" />
                                </motion.div>
                                <span className="text-[9px] text-blue-300 font-mono mt-3">CP (Fulcrum)</span>
                            </div>

                            {/* Downward Gravity Vector at CG */}
                            <motion.div
                                className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center z-20"
                                style={{ left: `${20 + (cgPos * 1.2)}%` }}
                                animate={{ left: `${20 + (cgPos * 1.2)}%` }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            >
                                <div className="w-5 h-5 rounded-full bg-purple-500 border-2 border-white shadow-lg shadow-purple-500/50 flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 bg-slate-900 rounded-full"></div>
                                </div>
                                <span className="text-[10px] font-mono font-black text-purple-300 mt-1 whitespace-nowrap">
                                    CG ({cgPos.toFixed(1)}%)
                                </span>

                                {/* Weight Arrow Downward */}
                                <div className="flex flex-col items-center mt-1">
                                    <ArrowDown className="w-4 h-4 text-purple-400 -mb-1" />
                                    <div className="w-1.5 h-12 bg-purple-500 rounded-b"></div>
                                    <span className="text-[9px] font-mono text-purple-400 whitespace-nowrap mt-1">
                                        Aircraft Weight (638 kN)
                                    </span>
                                </div>
                            </motion.div>

                            {/* Tailplane Downforce Vector */}
                            <div className="absolute right-12 top-0 bottom-0 flex flex-col items-center">
                                <motion.div
                                    className="absolute top-full mt-1 flex flex-col items-center"
                                    animate={{ height: Math.max(20, tailDownforceKn * 1.8) }}
                                >
                                    <ArrowDown className="w-4 h-4 text-red-400 -mb-1" />
                                    <div className="w-1.5 bg-red-500 flex-1 rounded-b"></div>
                                    <span className="text-[10px] font-mono font-bold text-red-400 whitespace-nowrap mt-1">
                                        Tail Downforce: {tailDownforceKn.toFixed(1)} kN
                                    </span>
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* Seesaw Mental Model Alert */}
                    <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl flex items-start gap-3 z-10">
                        <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                        <div className="text-xs text-slate-300 leading-relaxed">
                            <strong className="text-amber-400">Croucher Mental Model — &quot;The Seesaw with a Wing Fulcrum&quot;:</strong> The Center of Pressure (CP) acts as the seesaw pivot. Because the CG sits forward of the CP, the aircraft naturally pitches down. To keep level flight, the tailplane must generate a <strong>downward aerodynamic force</strong>. This tail download is effectively <em>dead weight</em> that the main wing must generate extra lift to support (L<sub>wing</sub> = Mass × g + Tail Download).
                        </div>
                    </div>
                </div>

                {/* Quantitative Impact Dashboard (4 cols) */}
                <div className="lg:col-span-4 space-y-4">
                    {/* Stall Speed Card */}
                    <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700">
                        <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
                            <span className="uppercase font-mono">1. Stall Speed (Vs)</span>
                            <Gauge className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-white font-mono">{stallSpeed}</span>
                            <span className="text-xs text-slate-400 font-mono">kt (Clean)</span>
                            <span className={`text-xs font-bold font-mono ml-auto ${stallSpeed > baseVs ? 'text-amber-400' : 'text-emerald-400'}`}>
                                {stallSpeed >= baseVs ? `+${(stallSpeed - baseVs).toFixed(1)}` : (stallSpeed - baseVs).toFixed(1)} kt
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-2 leading-snug">
                            {cgPos < FWD_LIMIT + 5
                                ? 'Higher Vs! Extra tail download increases wing loading, stalling the wing at a higher calibrated airspeed.'
                                : 'Lower Vs. Minimal tail download allows the wing to carry pure weight without dead-weight downforce.'}
                        </p>
                    </div>

                    {/* Fuel Consumption Card */}
                    <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700">
                        <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
                            <span className="uppercase font-mono">2. Cruise Fuel Burn</span>
                            <Wind className="w-4 h-4 text-amber-400" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-white font-mono">{effectiveBurn.toLocaleString()}</span>
                            <span className="text-xs text-slate-400 font-mono">kg/hr</span>
                            <span className={`text-xs font-bold font-mono ml-auto ${trimDragPenaltyPct > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                                {trimDragPenaltyPct > 0 ? `+${trimDragPenaltyPct}%` : 'OPTIMAL'}
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-2 leading-snug">
                            {cgPos >= SWEET_SPOT_MIN && cgPos <= SWEET_SPOT_MAX
                                ? 'Aerodynamic sweet spot! Minimum trim drag saves 1–2% fuel ($150,000+/year per long-haul aircraft).'
                                : 'Trim drag penalty. High tail deflection and increased wing angle of attack generate excess induced drag.'}
                        </p>
                    </div>

                    {/* Longitudinal Stability Card */}
                    <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700">
                        <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
                            <span className="uppercase font-mono">3. Longitudinal Stability</span>
                            <Shield className="w-4 h-4 text-purple-400" />
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                    className={`h-full ${stabilityScore > 60 ? 'bg-emerald-500' : stabilityScore > 30 ? 'bg-amber-500' : 'bg-red-500'}`}
                                    animate={{ width: `${stabilityScore}%` }}
                                ></motion.div>
                            </div>
                            <span className="font-mono text-xs font-bold text-white w-10 text-right">{stabilityScore.toFixed(0)}%</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-snug">
                            {cgPos > AFT_LIMIT
                                ? 'CRITICAL HAZARD: Negative static margin! High risk of unrecoverable deep stall or pitch-up divergent spin.'
                                : cgPos > SWEET_SPOT_MAX
                                ? 'Reduced static margin. Lighter control stick forces, requires alert piloting.'
                                : 'High static margin. Aircraft naturally returns to trimmed speed after pitch disturbances.'}
                        </p>
                    </div>

                    {/* Stabilizer Trim Setting Card */}
                    <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700">
                        <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
                            <span className="uppercase font-mono">4. Stabilizer Trim Units</span>
                            <Compass className="w-4 h-4 text-blue-400" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-white font-mono">{stabTrimUnits}</span>
                            <span className="text-xs text-slate-400 font-mono">Units ANU (Nose-Up)</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-2 leading-snug">
                            Fwd CG requires heavy nose-up trim (high horizontal stabilizer incidence). Aft CG requires near-neutral trim.
                        </p>
                    </div>
                </div>
            </div>

            {/* Slider Control Bar */}
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 space-y-4">
                <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-400 uppercase font-bold">DRAG SLIDER: POSITION CENTER OF GRAVITY (% MAC)</span>
                    <span className={`text-sm font-black ${cgPos >= FWD_LIMIT && cgPos <= AFT_LIMIT ? 'text-purple-400' : 'text-red-400'}`}>
                        {cgPos.toFixed(1)}% MAC
                    </span>
                </div>

                <div className="relative">
                    <input
                        type="range"
                        min="5"
                        max="45"
                        step="0.5"
                        value={cgPos}
                        onChange={e => {
                            setCgPos(parseFloat(e.target.value));
                            setTrimTankActive(false);
                        }}
                        className="w-full accent-purple-500 h-3 cursor-pointer"
                    />

                    {/* Scale annotations */}
                    <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-2">
                        <span>5% (Extreme Fwd)</span>
                        <span className="text-amber-400 font-bold">15% (Fwd Certified Limit)</span>
                        <span className="text-emerald-400 font-bold">30% (Cruise Sweet Spot)</span>
                        <span className="text-amber-400 font-bold">35% (Aft Certified Limit)</span>
                        <span>45% (Extreme Aft)</span>
                    </div>
                </div>

                {/* Safety Boundary Alerts */}
                {cgPos < FWD_LIMIT && (
                    <div className="p-4 bg-red-950/30 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-300 text-xs">
                        <AlertTriangle className="w-5 h-5 shrink-0 text-red-400 animate-bounce" />
                        <div>
                            <strong>FORWARD CG LIMIT EXCEEDED:</strong> Elevator control power is insufficient to achieve the certified landing flare. High risk of nose-gear collapse on touchdown! Excessive trim drag and fuel burn.
                        </div>
                    </div>
                )}

                {cgPos > AFT_LIMIT && (
                    <div className="p-4 bg-red-950/30 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-300 text-xs">
                        <AlertTriangle className="w-5 h-5 shrink-0 text-red-400 animate-bounce" />
                        <div>
                            <strong>AFT CG LIMIT EXCEEDED:</strong> Severe longitudinal instability. Stick force per 'g' is critically low or reversed. In a stall, aerodynamic pitch-up prevents nose-down recovery (flat spin risk)!
                        </div>
                    </div>
                )}
            </div>

            {/* Croucher Complete Reference Comparison Table */}
            <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-700 space-y-4">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    Croucher Summary Matrix: Operational Effects of CG Position (Ch 10)
                </h3>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="border-b border-slate-700 text-slate-400">
                                <th className="p-3 font-semibold">FLIGHT PARAMETER</th>
                                <th className="p-3 font-semibold text-amber-400">FORWARD CG IMPACT</th>
                                <th className="p-3 font-semibold text-cyan-400">AFT CG IMPACT</th>
                                <th className="p-3 font-semibold text-slate-400">AERODYNAMIC MECHANISM</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 font-sans">
                            <tr>
                                <td className="p-3 font-bold text-white">Stall Speed (Vs)</td>
                                <td className="p-3 text-amber-300 font-medium">Increases (Higher Vs)</td>
                                <td className="p-3 text-cyan-300 font-medium">Decreases (Lower Vs)</td>
                                <td className="p-3 text-slate-400 text-[11px]">Forward CG requires higher downward tail lift, forcing the wing to produce more total lift (higher effective mass).</td>
                            </tr>
                            <tr>
                                <td className="p-3 font-bold text-white">Cruise Drag & Fuel Burn</td>
                                <td className="p-3 text-amber-300 font-medium">Higher drag & fuel burn (+2% to +3%)</td>
                                <td className="p-3 text-cyan-300 font-medium">Lowest drag & optimal fuel burn (Sweet Spot)</td>
                                <td className="p-3 text-slate-400 text-[11px]">Trim drag equals tailplane induced drag plus wing extra induced drag caused by carrying tail download.</td>
                            </tr>
                            <tr>
                                <td className="p-3 font-bold text-white">Longitudinal Stability</td>
                                <td className="p-3 text-amber-300 font-medium">Maximum stability, heavy stick forces</td>
                                <td className="p-3 text-cyan-300 font-medium">Reduced stability, light/sensitive controls</td>
                                <td className="p-3 text-slate-400 text-[11px]">Static margin = distance from CG to Neutral Point. Large margin = stiff stability; small margin = agile/unstable.</td>
                            </tr>
                            <tr>
                                <td className="p-3 font-bold text-white">Landing Flare & Authority</td>
                                <td className="p-3 text-amber-300 font-medium">Difficult (May run out of up-elevator)</td>
                                <td className="p-3 text-cyan-300 font-medium">Easy, but prone to over-control & tailstrike</td>
                                <td className="p-3 text-slate-400 text-[11px]">At low speed in flare, elevator dynamic pressure drops. Forward CG demands maximum up-elevator deflection.</td>
                            </tr>
                            <tr>
                                <td className="p-3 font-bold text-white">Stall & Spin Recovery</td>
                                <td className="p-3 text-amber-300 font-medium">Prompt, natural nose drop recovery</td>
                                <td className="p-3 text-cyan-300 font-medium">Extremely dangerous (Flat spin / deep stall)</td>
                                <td className="p-3 text-slate-400 text-[11px]">Forward CG nose-down pitching moment aids stall recovery. Aft CG aerodynamic moments resist nose-down pitch.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CGEffects;
