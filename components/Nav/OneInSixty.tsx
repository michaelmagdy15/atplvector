import React, { useState, useEffect, useRef } from 'react';
import { Navigation, Plane, Compass, AlertCircle, ArrowRight, RotateCcw, TrendingDown, CheckCircle2, Ruler } from 'lucide-react';

const OneInSixty: React.FC = () => {
    const [mode, setMode] = useState<'HORIZONTAL' | 'DESCENT'>('HORIZONTAL');

    // Horizontal Track Correction State
    const [totalLeg, setTotalLeg] = useState(120);
    const [distFlown, setDistFlown] = useState(40);
    const [distOffTrack, setDistOffTrack] = useState(4);
    const [offTrackSide, setOffTrackSide] = useState<'RIGHT' | 'LEFT'>('RIGHT');

    // Descent & TOD State
    const [cruisingAlt, setCruisingAlt] = useState(33000);
    const [targetAlt, setTargetAlt] = useState(3000);
    const [groundspeed, setGroundspeed] = useState(250);
    const [windComp, setWindComp] = useState(10); // +10 kt tailwind or -10 kt headwind
    const [decelAllowance, setDecelAllowance] = useState(true);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Calculations: Horizontal 1-in-60
    const distToGo = Math.max(1, totalLeg - distFlown);
    const tea = (distOffTrack / Math.max(1, distFlown)) * 60;
    const closingAngle = (distOffTrack / distToGo) * 60;
    const totalAlteration = tea + closingAngle;
    const turnDirection = offTrackSide === 'RIGHT' ? 'LEFT' : 'RIGHT';

    // Calculations: Vertical 3-to-1 & 3° Descent
    const altToLose = Math.max(0, cruisingAlt - targetAlt);
    const baseTODDist = (altToLose / 1000) * 3;
    const windAdjustment = (windComp / 10) * 1.0;
    const decelDist = decelAllowance ? 5 : 0;
    const totalTODDist = Math.max(0, baseTODDist + windAdjustment + decelDist);
    // Rate of descent for 3° path = GS * 5
    const rodFpm = groundspeed * 5;

    // Canvas drawing for flight vector triangle
    useEffect(() => {
        if (mode !== 'HORIZONTAL') return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        ctx.fillStyle = '#090d16';
        ctx.fillRect(0, 0, w, h);

        const marginX = 40;
        const startX = marginX;
        const endX = w - marginX;
        const trackY = h / 2;

        // 1. Planned Track (Dashed white/slate line)
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(startX, trackY);
        ctx.lineTo(endX, trackY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Waypoints
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(startX, trackY, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px monospace';
        ctx.fillText('WAYPOINT A', startX - 25, trackY + 22);

        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(endX, trackY, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillText('WAYPOINT B', endX - 25, trackY + 22);

        // Current aircraft position
        const flownRatio = distFlown / totalLeg;
        const fixX = startX + flownRatio * (endX - startX);
        const pixelOffset = offTrackSide === 'RIGHT' ? (distOffTrack * 4.5) : -(distOffTrack * 4.5);
        const fixY = trackY + pixelOffset;

        // Flown path (Red/Rose line from A to fix)
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(startX, trackY);
        ctx.lineTo(fixX, fixY);
        ctx.stroke();

        // Off-track deviation line (vertical to planned track)
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(fixX, trackY);
        ctx.lineTo(fixX, fixY);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#f43f5e';
        ctx.font = '10px monospace';
        ctx.fillText(`${distOffTrack} NM`, fixX + 6, trackY + pixelOffset / 2);

        // Intercept Rejoin Vector to Waypoint B (Green line from fix to B)
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(fixX, fixY);
        ctx.lineTo(endX, trackY);
        ctx.stroke();

        // Parallel Vector (Cyan dashed line from fix parallel to planned track)
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(fixX, fixY);
        ctx.lineTo(endX, fixY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Aircraft Icon at Fix
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(fixX, fixY, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 8px sans-serif';
        ctx.fillText('✈', fixX - 3.5, fixY + 3);

        // Labels
        ctx.fillStyle = '#94a3b8';
        ctx.font = '9px monospace';
        ctx.fillText(`TEA = ${tea.toFixed(1)}°`, fixX - 45, fixY - (offTrackSide === 'RIGHT' ? 12 : -18));
        ctx.fillText(`CA = ${closingAngle.toFixed(1)}°`, fixX + 25, fixY - (offTrackSide === 'RIGHT' ? 12 : -18));
    }, [mode, totalLeg, distFlown, distOffTrack, offTrackSide, tea, closingAngle]);

    const setWorkedExample = () => {
        setTotalLeg(120);
        setDistFlown(40);
        setDistOffTrack(4);
        setOffTrackSide('RIGHT');
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 text-slate-100">
            {/* Header */}
            <div className="glass-panel p-6 md:p-8 rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 relative overflow-hidden">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400">
                                <Navigation size={28} />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                                The 1-in-60 Rule Mental Engine
                            </h1>
                        </div>
                        <p className="text-slate-300 text-sm mt-2 max-w-2xl leading-relaxed">
                            Foundational dead-reckoning mathematics for inflight track correction (TEA, Closing Angle, and Total Alteration)
                            and vertical descent flight planning ($3^\circ$ profile & Top of Descent 3:1 heuristic).
                        </p>
                    </div>
                </div>
            </div>

            {/* Mode Switcher */}
            <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
                <button
                    onClick={() => setMode('HORIZONTAL')}
                    className={`flex-1 py-3 text-xs md:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                        mode === 'HORIZONTAL'
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                            : 'text-slate-400 hover:text-white'
                    }`}
                >
                    <Navigation size={18} /> Horizontal Track Correction (TEA + CA)
                </button>
                <button
                    onClick={() => setMode('DESCENT')}
                    className={`flex-1 py-3 text-xs md:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                        mode === 'DESCENT'
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                            : 'text-slate-400 hover:text-white'
                    }`}
                >
                    <TrendingDown size={18} /> Vertical Descent & TOD (3:1 Heuristic)
                </button>
            </div>

            {/* MODE 1: HORIZONTAL TRACK CORRECTION */}
            {mode === 'HORIZONTAL' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Controls (5/12) */}
                    <div className="lg:col-span-5 bg-slate-900/60 p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                            <h3 className="font-bold text-white text-base">En-Route Leg Parameters</h3>
                            <button
                                onClick={setWorkedExample}
                                className="text-xs px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 font-mono hover:bg-indigo-500/30 border border-indigo-500/30"
                            >
                                Load Standard ATPL Example
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs text-slate-300 font-mono mb-1">
                                    <span>TOTAL LEG DISTANCE:</span>
                                    <strong className="text-white font-bold">{totalLeg} NM</strong>
                                </div>
                                <input
                                    type="range"
                                    min="30"
                                    max="300"
                                    step="5"
                                    value={totalLeg}
                                    onChange={e => {
                                        const leg = Number(e.target.value);
                                        setTotalLeg(leg);
                                        if (distFlown >= leg) setDistFlown(leg - 10);
                                    }}
                                    className="w-full accent-indigo-500"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between text-xs text-slate-300 font-mono mb-1">
                                    <span>DISTANCE FLOWN (GONE):</span>
                                    <strong className="text-sky-400 font-bold">{distFlown} NM</strong>
                                </div>
                                <input
                                    type="range"
                                    min="10"
                                    max={totalLeg - 5}
                                    step="5"
                                    value={distFlown}
                                    onChange={e => setDistFlown(Number(e.target.value))}
                                    className="w-full accent-sky-500"
                                />
                                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                                    Distance to Go: {distToGo} NM
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs text-slate-300 font-mono mb-1">
                                    <span>DISTANCE OFF TRACK:</span>
                                    <strong className="text-rose-400 font-bold">{distOffTrack} NM</strong>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="25"
                                    step="0.5"
                                    value={distOffTrack}
                                    onChange={e => setDistOffTrack(Number(e.target.value))}
                                    className="w-full accent-rose-500"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-slate-400 block mb-1 font-mono">OFF-TRACK DISPLACEMENT SIDE</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => setOffTrackSide('LEFT')}
                                        className={`py-2 text-xs font-bold rounded-xl transition-all ${
                                            offTrackSide === 'LEFT'
                                                ? 'bg-rose-500 text-white'
                                                : 'bg-slate-950 text-slate-400 border border-slate-800'
                                        }`}
                                    >
                                        Port (Left of Track)
                                    </button>
                                    <button
                                        onClick={() => setOffTrackSide('RIGHT')}
                                        className={`py-2 text-xs font-bold rounded-xl transition-all ${
                                            offTrackSide === 'RIGHT'
                                                ? 'bg-rose-500 text-white'
                                                : 'bg-slate-950 text-slate-400 border border-slate-800'
                                        }`}
                                    >
                                        Starboard (Right of Track)
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Calculated Corrections Card */}
                        <div className="p-5 bg-slate-950 rounded-2xl border border-white/5 space-y-3 font-mono text-xs">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">1. Track Error Angle (TEA):</span>
                                <span className="text-sky-400 font-bold text-sm">{tea.toFixed(1)}°</span>
                            </div>
                            <div className="text-[10px] text-slate-500">
                                Formula: ({distOffTrack} NM / {distFlown} NM) × 60
                            </div>

                            <div className="flex justify-between items-center border-t border-slate-800 pt-2">
                                <span className="text-slate-400">2. Closing Angle (CA):</span>
                                <span className="text-amber-400 font-bold text-sm">{closingAngle.toFixed(1)}°</span>
                            </div>
                            <div className="text-[10px] text-slate-500">
                                Formula: ({distOffTrack} NM / {distToGo} NM) × 60
                            </div>

                            <div className="flex justify-between items-center border-t border-slate-800 pt-3">
                                <span className="font-bold text-white text-sm">TOTAL ALTERATION:</span>
                                <span className="text-2xl font-black text-emerald-400">
                                    {totalAlteration.toFixed(1)}° {turnDirection}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Vector Canvas & Solutions (7/12) */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 flex flex-col items-center shadow-2xl">
                            <canvas
                                ref={canvasRef}
                                width={540}
                                height={260}
                                className="w-full bg-slate-950 rounded-2xl border border-slate-800 shadow-inner"
                            />
                            <div className="flex flex-wrap justify-between items-center w-full mt-4 text-xs font-bold gap-2 px-1">
                                <span className="text-rose-400 flex items-center gap-1.5">
                                    <span className="w-3 h-1 bg-rose-500 inline-block"></span> Flown Path (Off Track)
                                </span>
                                <span className="text-emerald-400 flex items-center gap-1.5">
                                    <span className="w-3 h-1 bg-emerald-500 inline-block"></span> Rejoin Next Waypoint (TEA + CA)
                                </span>
                                <span className="text-sky-400 flex items-center gap-1.5">
                                    <span className="w-3 h-0.5 border-t border-dashed border-sky-400 inline-block"></span> Parallel Track (TEA Only)
                                </span>
                            </div>
                        </div>

                        {/* Pilot Action Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-5 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
                                <div className="text-xs font-bold text-sky-400 uppercase tracking-wider">Option A: Parallel the Track</div>
                                <div className="text-xl font-black text-white font-mono">
                                    Turn {tea.toFixed(1)}° {turnDirection}
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    Altering heading by Track Error Angle (TEA) stops further drift and keeps the aircraft flying parallel to the planned track, maintaining a constant {distOffTrack} NM offset.
                                </p>
                            </div>

                            <div className="p-5 bg-emerald-950/20 rounded-2xl border border-emerald-500/30 space-y-2">
                                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Option B: Intercept Next Waypoint</div>
                                <div className="text-xl font-black text-emerald-300 font-mono">
                                    Turn {totalAlteration.toFixed(1)}° {turnDirection}
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    Altering heading by (TEA + CA) points the nose directly toward Waypoint B, regaining the planned destination fix without re-intercepting the original line first.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODE 2: VERTICAL DESCENT PLANNING */}
            {mode === 'DESCENT' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Descent Inputs (6/12) */}
                    <div className="lg:col-span-6 bg-slate-900/60 p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6">
                        <div className="border-b border-slate-800 pb-3">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <TrendingDown className="text-emerald-400" />
                                3-to-1 Top of Descent (TOD) Heuristic
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">
                                Fast inflight mental math rule for standard 3.0° instrument descent profiles.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1 font-mono">CRUISE ALTITUDE (FT)</label>
                                    <input
                                        type="number"
                                        min="5000"
                                        max="45000"
                                        step="1000"
                                        value={cruisingAlt}
                                        onChange={e => setCruisingAlt(Number(e.target.value))}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1 font-mono">TARGET ALTITUDE (FT)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="15000"
                                        step="500"
                                        value={targetAlt}
                                        onChange={e => setTargetAlt(Number(e.target.value))}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1 font-mono">GROUNDSPEED (KT)</label>
                                    <input
                                        type="number"
                                        min="80"
                                        max="500"
                                        step="10"
                                        value={groundspeed}
                                        onChange={e => setGroundspeed(Number(e.target.value))}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1 font-mono">WIND COMPONENT (KT)</label>
                                    <input
                                        type="number"
                                        min="-60"
                                        max="80"
                                        step="5"
                                        value={windComp}
                                        onChange={e => setWindComp(Number(e.target.value))}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm"
                                    />
                                    <span className="text-[10px] text-slate-500 font-mono">
                                        {windComp >= 0 ? `+${windComp} kt tailwind` : `${windComp} kt headwind`}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <input
                                    type="checkbox"
                                    id="decel"
                                    checked={decelAllowance}
                                    onChange={e => setDecelAllowance(e.target.checked)}
                                    className="w-4 h-4 rounded accent-emerald-500 bg-slate-900 border-slate-700"
                                />
                                <label htmlFor="decel" className="text-xs text-slate-300 font-medium">
                                    Include 5 NM Deceleration Allowance (250 kt to approach speed)
                                </label>
                            </div>
                        </div>

                        {/* Calculated Output Card */}
                        <div className="p-6 bg-slate-950 rounded-2xl border border-emerald-500/20 space-y-3 font-mono text-xs">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Altitude to Lose:</span>
                                <span className="text-white font-bold">{altToLose.toLocaleString()} ft</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Base TOD (3 NM per 1,000 ft):</span>
                                <span className="text-white font-bold">{baseTODDist.toFixed(1)} NM</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Wind Adjustment (+1 NM / 10 kt tailwind):</span>
                                <span className={`font-bold ${windAdjustment >= 0 ? 'text-amber-400' : 'text-sky-400'}`}>
                                    {windAdjustment >= 0 ? `+${windAdjustment.toFixed(1)}` : windAdjustment.toFixed(1)} NM
                                </span>
                            </div>
                            {decelAllowance && (
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Deceleration Cushion:</span>
                                    <span className="text-white font-bold">+5.0 NM</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center border-t border-slate-800 pt-3">
                                <span className="font-bold text-emerald-400 text-sm">TOTAL TOP OF DESCENT:</span>
                                <span className="text-3xl font-black text-white">
                                    {totalTODDist.toFixed(1)} <span className="text-xs text-slate-400">NM out</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Rate of Descent Heuristic Card (6/12) */}
                    <div className="lg:col-span-6 space-y-6">
                        <div className="bg-slate-900/60 p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6">
                            <h4 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <Ruler size={18} className="text-emerald-400" />
                                3.0° Glide Slope Rate of Descent Formula
                            </h4>

                            <div className="p-6 bg-slate-950 rounded-2xl border border-emerald-500/20 text-center space-y-2">
                                <span className="text-[10px] font-mono text-slate-400 uppercase">MENTAL HEURISTIC</span>
                                <div className="text-3xl font-black text-emerald-400 font-mono">
                                    ROD (fpm) = Groundspeed (kt) × 5
                                </div>
                                <p className="text-xs text-slate-400">
                                    Or: Half the Groundspeed and add a zero (e.g. 140 kt → 70 → 700 fpm).
                                </p>
                            </div>

                            <div className="p-5 bg-slate-950/60 rounded-2xl border border-white/5 space-y-3 text-xs">
                                <div className="flex justify-between items-baseline font-mono">
                                    <span className="text-slate-400">Selected Groundspeed:</span>
                                    <span className="text-white font-bold text-base">{groundspeed} kt</span>
                                </div>
                                <div className="flex justify-between items-baseline font-mono border-t border-slate-800 pt-2">
                                    <span className="text-emerald-400 font-bold">Target 3.0° Rate of Descent:</span>
                                    <span className="text-2xl font-black text-emerald-300">{rodFpm} fpm</span>
                                </div>
                            </div>

                            <div className="p-4 bg-indigo-950/30 border border-indigo-500/30 rounded-2xl space-y-2 text-xs">
                                <span className="font-bold text-indigo-300 block">Classic ATPL Benchmark Examples:</span>
                                <ul className="space-y-1 font-mono text-slate-300 list-disc pl-4">
                                    <li><strong>120 kt GS:</strong> 120 × 5 = 600 fpm</li>
                                    <li><strong>140 kt GS:</strong> 140 × 5 = 700 fpm (standard airliner final approach)</li>
                                    <li><strong>160 kt GS:</strong> 160 × 5 = 800 fpm</li>
                                    <li><strong>240 kt GS:</strong> 240 × 5 = 1,200 fpm (intermediate descent)</li>
                                    <li><strong>300 kt GS:</strong> 300 × 5 = 1,500 fpm (high speed en-route descent)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OneInSixty;
