
import React, { useState, useEffect, useCallback } from 'react';
import { Moon, Sun, Clock, Zap, Battery, Globe, Plane, Brain, Activity, AlertTriangle, Info, BarChart3, ChevronDown, ChevronUp, Check, X, Thermometer, Eye, Droplets, Shield } from 'lucide-react';

/* ─────────────────── helpers ─────────────────── */
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const polarX = (cx: number, r: number, deg: number) => cx + r * Math.cos((deg - 90) * Math.PI / 180);
const polarY = (cy: number, r: number, deg: number) => cy + r * Math.sin((deg - 90) * Math.PI / 180);

/* ─────────────────── types ─────────────────── */
type TabId = 'circadian' | 'sleep' | 'jetlag' | 'fatigue' | 'stages';

/* ═════════════════════════════════════════════
   ROOT COMPONENT
   ═════════════════════════════════════════════ */
const SleepAndRhythms: React.FC = () => {
    const [tab, setTab] = useState<TabId>('circadian');

    const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
        { id: 'circadian', label: 'Circadian Clock', icon: <Clock size={14} /> },
        { id: 'sleep', label: 'Sleep Architecture', icon: <Activity size={14} /> },
        { id: 'jetlag', label: 'Jet Lag Calc', icon: <Plane size={14} /> },
        { id: 'fatigue', label: 'Fatigue Risk', icon: <AlertTriangle size={14} /> },
        { id: 'stages', label: 'Sleep Stages', icon: <Brain size={14} /> },
    ];

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <Moon className="text-indigo-400" />
                        Body Rhythm &amp; Sleep (040.02)
                    </h2>
                    <p className="text-slate-400 text-sm">Circadian rhythms, sleep architecture, debt, and jet lag.</p>
                </div>
                <div className="flex bg-slate-900 p-1 rounded-lg overflow-x-auto gap-1">
                    {tabs.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={`px-3 py-2 rounded-md font-bold text-xs whitespace-nowrap transition-all flex items-center gap-1.5 ${tab === t.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                        >
                            {t.icon} {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {tab === 'circadian' && <CircadianClock />}
            {tab === 'sleep' && <SleepArchitecture />}
            {tab === 'jetlag' && <JetLagCalc />}
            {tab === 'fatigue' && <FatigueRisk />}
            {tab === 'stages' && <SleepStagesCards />}
        </div>
    );
};

/* ═════════════════════════════════════════════
   1. CIRCADIAN RHYTHM CLOCK (24h SVG)
   ═════════════════════════════════════════════ */
const CircadianClock = () => {
    const [hour, setHour] = useState(14);
    const [dragging, setDragging] = useState(false);

    // Physiological curves
    const getTemp = (t: number) => 37.0 + 0.5 * Math.cos((t - 18) * Math.PI / 12);
    const getMelatonin = (t: number) => {
        // High 21:00 → 06:00, peak at ~03:00
        if (t >= 21 || t <= 6) {
            const shifted = t >= 21 ? t - 21 : t + 3;
            return 0.5 + 0.5 * Math.sin(shifted * Math.PI / 9);
        }
        return 0;
    };
    const getCortisol = (t: number) => {
        // Peak 06:00-09:00
        return Math.max(0, Math.exp(-0.5 * Math.pow((t - 7.5) / 2, 2)));
    };
    const getPerf = (t: number) => 75 + 25 * Math.cos((t - 18) * Math.PI / 12);

    const isWocl = hour >= 2 && hour <= 6;
    const isDaytime = hour >= 6 && hour <= 20;
    const melatoninWindow = hour >= 21 || hour <= 6;
    const cortisolPeak = hour >= 6 && hour <= 9;

    const temp = getTemp(hour);
    const perf = getPerf(hour);
    const melLevel = getMelatonin(hour);
    const cortLevel = getCortisol(hour);

    // State description
    const getPhysiologicalState = (h: number) => {
        if (h >= 2 && h <= 5) return { state: 'Deep Sleep / WOCL', desc: 'Lowest body temperature, peak melatonin. Cognitive performance at minimum. Window of Circadian Low.', color: 'text-indigo-400' };
        if (h >= 6 && h <= 8) return { state: 'Wake-Up Phase', desc: 'Cortisol surge (Cortisol Awakening Response). Melatonin suppressed by light. Body temperature rising.', color: 'text-amber-400' };
        if (h >= 9 && h <= 11) return { state: 'Morning Peak', desc: 'High alertness, good for complex cognitive tasks. Body temperature climbing.', color: 'text-emerald-400' };
        if (h >= 12 && h <= 14) return { state: 'Post-Lunch Dip', desc: 'Mild circadian dip (not just food-related). Secondary low in alertness.', color: 'text-yellow-400' };
        if (h >= 15 && h <= 18) return { state: 'Afternoon Peak', desc: 'Peak body temperature, peak performance. Best reaction times and coordination.', color: 'text-emerald-400' };
        if (h >= 19 && h <= 21) return { state: 'Evening Decline', desc: 'Melatonin secretion begins (dim-light melatonin onset). Body temperature dropping.', color: 'text-orange-400' };
        if (h >= 22 || h <= 1) return { state: 'Sleep Onset', desc: 'Melatonin high, body temperature falling. Sleep pressure (Process S) at maximum.', color: 'text-purple-400' };
        return { state: 'Transition', desc: '', color: 'text-slate-400' };
    };

    const physiState = getPhysiologicalState(hour);

    // SVG Clock interaction
    const handleClockInteraction = useCallback((e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => {
        const svg = e.currentTarget;
        const rect = svg.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        const x = clientX - rect.left - rect.width / 2;
        const y = clientY - rect.top - rect.height / 2;
        let angle = Math.atan2(x, -y) * 180 / Math.PI;
        if (angle < 0) angle += 360;
        const h = Math.round((angle / 360) * 24) % 24;
        setHour(h);
    }, []);

    // Build temperature arc path
    const buildCurvePath = (getValue: (t: number) => number, minVal: number, maxVal: number, innerR: number, outerR: number) => {
        const points: string[] = [];
        for (let t = 0; t <= 24; t += 0.5) {
            const angle = (t / 24) * 360;
            const norm = (getValue(t) - minVal) / (maxVal - minVal);
            const r = innerR + norm * (outerR - innerR);
            const x = polarX(150, r, angle);
            const y = polarY(150, r, angle);
            points.push(`${t === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`);
        }
        return points.join(' ');
    };

    const handAngle = (hour / 24) * 360;

    return (
        <div className="grid lg:grid-cols-5 gap-6">
            {/* Clock SVG - takes 3 cols */}
            <div className="lg:col-span-3 bg-slate-900 p-4 rounded-xl border border-slate-700 flex flex-col items-center">
                <svg
                    viewBox="0 0 300 300"
                    className="w-full max-w-md cursor-pointer select-none"
                    onMouseDown={() => setDragging(true)}
                    onMouseUp={() => setDragging(false)}
                    onMouseLeave={() => setDragging(false)}
                    onMouseMove={(e) => dragging && handleClockInteraction(e)}
                    onClick={handleClockInteraction}
                    onTouchMove={handleClockInteraction}
                >
                    {/* Background gradient */}
                    <defs>
                        <radialGradient id="clockBg" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor={isDaytime ? '#1e293b' : '#0f172a'} />
                            <stop offset="100%" stopColor={isDaytime ? '#334155' : '#1e1b4b'} />
                        </radialGradient>
                        <linearGradient id="tempGrad" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="50%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#ef4444" />
                        </linearGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Clock face */}
                    <circle cx="150" cy="150" r="140" fill="url(#clockBg)" stroke="#334155" strokeWidth="2" />

                    {/* Melatonin window arc (21:00 → 06:00) */}
                    <path
                        d={describeArc(150, 150, 130, (21 / 24) * 360, (30 / 24) * 360)}
                        fill="none" stroke="#7c3aed" strokeWidth="8" opacity="0.3" strokeLinecap="round"
                    />

                    {/* Performance zones */}
                    {/* High perf: 09-12, 15-18 */}
                    <path d={describeArc(150, 150, 120, (9 / 24) * 360, (12 / 24) * 360)} fill="none" stroke="#10b981" strokeWidth="6" opacity="0.25" strokeLinecap="round" />
                    <path d={describeArc(150, 150, 120, (15 / 24) * 360, (18 / 24) * 360)} fill="none" stroke="#10b981" strokeWidth="6" opacity="0.25" strokeLinecap="round" />
                    {/* WOCL: 02-06 */}
                    <path d={describeArc(150, 150, 120, (2 / 24) * 360, (6 / 24) * 360)} fill="none" stroke="#ef4444" strokeWidth="6" opacity="0.3" strokeLinecap="round" />

                    {/* Temperature curve */}
                    <path
                        d={buildCurvePath(getTemp, 36.4, 37.6, 80, 110)}
                        fill="none" stroke="url(#tempGrad)" strokeWidth="2.5" opacity="0.8"
                    />

                    {/* Melatonin curve */}
                    <path
                        d={buildCurvePath(getMelatonin, 0, 1, 60, 80)}
                        fill="none" stroke="#a78bfa" strokeWidth="2" opacity="0.7"
                    />

                    {/* Cortisol curve */}
                    <path
                        d={buildCurvePath(getCortisol, 0, 1, 60, 80)}
                        fill="none" stroke="#fbbf24" strokeWidth="2" opacity="0.7"
                    />

                    {/* Hour markers */}
                    {Array.from({ length: 24 }, (_, i) => {
                        const angle = (i / 24) * 360;
                        const isMajor = i % 6 === 0;
                        const r1 = isMajor ? 128 : 132;
                        const r2 = 138;
                        return (
                            <g key={i}>
                                <line
                                    x1={polarX(150, r1, angle)} y1={polarY(150, r1, angle)}
                                    x2={polarX(150, r2, angle)} y2={polarY(150, r2, angle)}
                                    stroke={isMajor ? '#94a3b8' : '#475569'} strokeWidth={isMajor ? 2 : 1}
                                />
                                {isMajor && (
                                    <text
                                        x={polarX(150, 116, angle)} y={polarY(150, 116, angle)}
                                        textAnchor="middle" dominantBaseline="central"
                                        className="fill-slate-300 text-[9px] font-bold"
                                    >
                                        {i.toString().padStart(2, '0')}
                                    </text>
                                )}
                            </g>
                        );
                    })}

                    {/* Clock hand */}
                    <line
                        x1="150" y1="150"
                        x2={polarX(150, 105, handAngle)}
                        y2={polarY(150, 105, handAngle)}
                        stroke="#818cf8" strokeWidth="3" strokeLinecap="round"
                        filter="url(#glow)"
                    />
                    {/* Hand tip dot */}
                    <circle
                        cx={polarX(150, 105, handAngle)}
                        cy={polarY(150, 105, handAngle)}
                        r="5" fill="#818cf8" filter="url(#glow)"
                    />
                    {/* Center dot */}
                    <circle cx="150" cy="150" r="6" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2" />

                    {/* Current time display */}
                    <text x="150" y="185" textAnchor="middle" className="fill-white text-lg font-bold" style={{ fontSize: '18px', fontWeight: 800 }}>
                        {hour.toString().padStart(2, '0')}:00
                    </text>

                    {/* Sun/Moon icon in center */}
                    {isDaytime ? (
                        <circle cx="150" cy="140" r="8" fill="#fbbf24" opacity="0.8" />
                    ) : (
                        <circle cx="150" cy="140" r="6" fill="#93c5fd" opacity="0.8" />
                    )}
                </svg>

                {/* Slider fallback */}
                <div className="w-full max-w-md mt-2 px-4">
                    <input
                        type="range" min="0" max="23" step="1" value={hour}
                        onChange={e => setHour(Number(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 mt-1">
                        <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:00</span>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-3 mt-4 justify-center">
                    <LegendDot color="bg-gradient-to-r from-blue-500 via-green-500 to-red-500" label="Body Temp" />
                    <LegendDot color="bg-purple-400" label="Melatonin" />
                    <LegendDot color="bg-yellow-400" label="Cortisol" />
                    <LegendDot color="bg-emerald-500" label="High Perf" />
                    <LegendDot color="bg-red-500" label="WOCL" />
                </div>
            </div>

            {/* Right panel */}
            <div className="lg:col-span-2 space-y-4">
                {/* Physiological State */}
                <div className={`bg-slate-900 p-5 rounded-xl border border-slate-700 transition-all duration-300`}>
                    <div className="flex items-center gap-2 mb-3">
                        {isDaytime ? <Sun className="text-yellow-400" size={20} /> : <Moon className="text-blue-300" size={20} />}
                        <h3 className={`font-bold text-lg ${physiState.color}`}>{physiState.state}</h3>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">{physiState.desc}</p>

                    {isWocl && (
                        <div className="mt-3 bg-red-500/15 border border-red-500/30 p-3 rounded-lg flex items-center gap-2">
                            <AlertTriangle className="text-red-400 w-5 h-5 shrink-0" />
                            <span className="text-red-300 font-bold text-xs">WOCL (02:00–06:00) — Highest accident risk</span>
                        </div>
                    )}
                    {melatoninWindow && (
                        <div className="mt-3 bg-purple-500/15 border border-purple-500/30 p-3 rounded-lg flex items-center gap-2">
                            <Moon className="text-purple-400 w-4 h-4 shrink-0" />
                            <span className="text-purple-300 text-xs">Melatonin secretion active — avoid bright light</span>
                        </div>
                    )}
                    {cortisolPeak && (
                        <div className="mt-3 bg-yellow-500/15 border border-yellow-500/30 p-3 rounded-lg flex items-center gap-2">
                            <Zap className="text-yellow-400 w-4 h-4 shrink-0" />
                            <span className="text-yellow-300 text-xs">Cortisol Awakening Response — natural alertness boost</span>
                        </div>
                    )}
                </div>

                {/* Metrics gauges */}
                <div className="grid grid-cols-2 gap-3">
                    <MetricGauge label="Body Temp" value={`${temp.toFixed(1)}°C`} pct={(temp - 36.4) / 1.2 * 100} color="from-blue-500 to-red-500" />
                    <MetricGauge label="Alertness" value={`${Math.round(perf)}%`} pct={perf} color={perf > 70 ? 'from-emerald-600 to-emerald-400' : 'from-red-600 to-red-400'} />
                    <MetricGauge label="Melatonin" value={`${(melLevel * 100).toFixed(0)}%`} pct={melLevel * 100} color="from-purple-700 to-purple-400" />
                    <MetricGauge label="Cortisol" value={`${(cortLevel * 100).toFixed(0)}%`} pct={cortLevel * 100} color="from-yellow-700 to-yellow-400" />
                </div>

                {/* Key Concepts */}
                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600">
                    <h4 className="font-bold text-white text-sm mb-2">Key Concepts (040.02.03)</h4>
                    <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4">
                        <li><strong>Internal Clock (SCN):</strong> Located in Suprachiasmatic Nucleus. Free-running cycle is ~25 hours.</li>
                        <li><strong>Zeitgebers:</strong> External cues (Light, Meals, Social) reset the clock to 24h.</li>
                        <li><strong>Correlation:</strong> Performance peaks when body temperature peaks (late afternoon).</li>
                        <li><strong>Melatonin:</strong> Secreted by pineal gland, onset ~21:00 (DLMO), suppressed by blue light.</li>
                        <li><strong>Cortisol:</strong> Peaks 06:00-09:00 (CAR), prepares body for daytime activity.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

/* ═════════════════════════════════════════════
   2. SLEEP ARCHITECTURE VISUALIZER
   ═════════════════════════════════════════════ */
const SleepArchitecture = () => {
    const [selectedStage, setSelectedStage] = useState<string | null>(null);
    const [hoverX, setHoverX] = useState<number | null>(null);

    // Hypnogram data: time (hours) → stage (0=Awake, 1=REM, 2=N1, 3=N2, 4=N3)
    // Represents ~8 hours with 5 cycles, REM periods grow longer
    const hypnogramData: { t: number; stage: number }[] = [
        { t: 0, stage: 0 },
        { t: 0.1, stage: 2 }, { t: 0.2, stage: 3 }, { t: 0.5, stage: 4 }, { t: 1.0, stage: 4 },
        { t: 1.2, stage: 3 }, { t: 1.3, stage: 1 }, { t: 1.5, stage: 1 }, // Cycle 1 REM short
        { t: 1.6, stage: 2 }, { t: 1.8, stage: 3 }, { t: 2.1, stage: 4 }, { t: 2.5, stage: 4 },
        { t: 2.8, stage: 3 }, { t: 2.9, stage: 1 }, { t: 3.2, stage: 1 }, // Cycle 2 REM
        { t: 3.3, stage: 2 }, { t: 3.5, stage: 3 }, { t: 3.8, stage: 4 }, { t: 4.0, stage: 3 },
        { t: 4.3, stage: 3 }, { t: 4.4, stage: 1 }, { t: 4.9, stage: 1 }, // Cycle 3 REM longer
        { t: 5.0, stage: 2 }, { t: 5.2, stage: 3 }, { t: 5.5, stage: 3 }, { t: 5.7, stage: 2 },
        { t: 5.8, stage: 1 }, { t: 6.5, stage: 1 }, // Cycle 4 REM even longer
        { t: 6.6, stage: 2 }, { t: 6.8, stage: 3 }, { t: 7.0, stage: 2 },
        { t: 7.1, stage: 1 }, { t: 7.8, stage: 1 }, // Cycle 5 longest REM
        { t: 7.9, stage: 2 }, { t: 8.0, stage: 0 },
    ];

    const stageNames = ['Awake', 'REM', 'N1', 'N2', 'N3 (Deep)'];
    const stageColors = ['#94a3b8', '#fbbf24', '#60a5fa', '#818cf8', '#6366f1'];

    const stageInfo: Record<string, { duration: string; eeg: string; function: string; deprivation: string }> = {
        'Awake': { duration: 'Brief periods', eeg: 'Beta (13-30Hz) / Alpha (8-13Hz)', function: 'Conscious awareness, voluntary movement', deprivation: 'N/A' },
        'REM': { duration: '20-25% of total sleep (~90-120 min)', eeg: 'Beta-like (desynchronized, low voltage, fast)', function: 'Mental restoration, memory consolidation, dreaming. Brain active, body paralyzed (atonia).', deprivation: 'Irritability, poor concentration, hallucinations. Increases later in night.' },
        'N1': { duration: '5% of total sleep', eeg: 'Theta (4-8Hz)', function: 'Transition stage, easily awakened. Hypnic jerks common.', deprivation: 'Mild disorientation, slightly elevated drowsiness' },
        'N2': { duration: '45-55% of total sleep', eeg: 'Sleep spindles (12-14Hz) + K-complexes', function: 'Memory consolidation begins, body temperature drops, heart rate slows', deprivation: 'Reduced memory consolidation, fragmented sleep feeling' },
        'N3 (Deep)': { duration: '15-20% of total sleep', eeg: 'Delta (0.5-4Hz) — Slow Wave Sleep', function: 'Physical restoration, growth hormone release, immune repair. Dominates first half of night.', deprivation: 'Severe fatigue, weakened immunity, high sleep inertia on waking. Microsleep risk.' },
    };

    // Build SVG path
    const svgW = 700, svgH = 200, padL = 50, padR = 10, padT = 10, padB = 30;
    const chartW = svgW - padL - padR;
    const chartH = svgH - padT - padB;
    const xScale = (t: number) => padL + (t / 8) * chartW;
    const yScale = (s: number) => padT + (s / 4) * chartH;

    const linePath = hypnogramData.map((d, i) => {
        const x = xScale(d.t);
        const y = yScale(d.stage);
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    // Highlight REM segments
    const remSegments: { x1: number; x2: number }[] = [];
    let inRem = false;
    let remStart = 0;
    for (const d of hypnogramData) {
        if (d.stage === 1 && !inRem) { inRem = true; remStart = xScale(d.t); }
        if (d.stage !== 1 && inRem) { inRem = false; remSegments.push({ x1: remStart, x2: xScale(d.t) }); }
    }

    // Hover to find current stage
    const getStageAtX = (clientX: number, rect: DOMRect) => {
        const px = clientX - rect.left;
        const fraction = (px - (padL / svgW * rect.width)) / ((chartW / svgW) * rect.width);
        const t = clamp(fraction * 8, 0, 8);
        // Find nearest data point
        let closest = hypnogramData[0];
        for (const d of hypnogramData) {
            if (d.t <= t) closest = d;
        }
        return { time: t, stage: closest.stage };
    };

    return (
        <div className="space-y-6">
            {/* Hypnogram */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <Activity className="text-indigo-400" size={18} /> Hypnogram — Typical 8-Hour Sleep
                </h3>

                <svg
                    viewBox={`0 0 ${svgW} ${svgH}`}
                    className="w-full cursor-crosshair"
                    onMouseMove={e => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const info = getStageAtX(e.clientX, rect);
                        setHoverX(xScale(info.time));
                        setSelectedStage(stageNames[info.stage]);
                    }}
                    onMouseLeave={() => setHoverX(null)}
                    onClick={e => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const info = getStageAtX(e.clientX, rect);
                        setSelectedStage(stageNames[info.stage]);
                    }}
                >
                    {/* REM highlight bands */}
                    {remSegments.map((seg, i) => (
                        <rect key={i} x={seg.x1} y={yScale(1) - 5} width={seg.x2 - seg.x1} height={chartH / 4}
                            fill="#fbbf24" opacity="0.1" rx="3" />
                    ))}

                    {/* Grid lines */}
                    {[0, 1, 2, 3, 4].map(s => (
                        <line key={s} x1={padL} y1={yScale(s)} x2={svgW - padR} y2={yScale(s)}
                            stroke="#334155" strokeWidth="1" strokeDasharray="4,4" />
                    ))}

                    {/* Y-axis labels */}
                    {stageNames.map((name, i) => (
                        <text key={i} x={padL - 5} y={yScale(i)} textAnchor="end" dominantBaseline="central"
                            className="text-[9px] font-bold" fill={stageColors[i]}>{name.replace(' (Deep)', '')}</text>
                    ))}

                    {/* X-axis labels */}
                    {Array.from({ length: 9 }, (_, i) => (
                        <text key={i} x={xScale(i)} y={svgH - 5} textAnchor="middle"
                            className="text-[9px]" fill="#64748b">{i}h</text>
                    ))}

                    {/* Cycle markers */}
                    {[1.5, 3.0, 4.5, 6.0, 7.5].map((t, i) => (
                        <g key={i}>
                            <line x1={xScale(t)} y1={padT} x2={xScale(t)} y2={svgH - padB}
                                stroke="#475569" strokeWidth="1" strokeDasharray="2,6" />
                            <text x={xScale(t)} y={padT - 2} textAnchor="middle"
                                className="text-[7px]" fill="#64748b">Cycle {i + 1}</text>
                        </g>
                    ))}

                    {/* The hypnogram line */}
                    <path d={linePath} fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinejoin="round" />

                    {/* Data point dots */}
                    {hypnogramData.map((d, i) => (
                        <circle key={i} cx={xScale(d.t)} cy={yScale(d.stage)} r="2.5"
                            fill={stageColors[d.stage]} opacity="0.7" />
                    ))}

                    {/* Hover line */}
                    {hoverX !== null && (
                        <line x1={hoverX} y1={padT} x2={hoverX} y2={svgH - padB}
                            stroke="#818cf8" strokeWidth="1" opacity="0.5" strokeDasharray="3,3" />
                    )}
                </svg>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 mt-4 justify-center">
                    {stageNames.map((name, i) => (
                        <button
                            key={name}
                            onClick={() => setSelectedStage(selectedStage === name ? null : name)}
                            className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-all ${selectedStage === name ? 'bg-slate-700 ring-1 ring-indigo-500' : 'hover:bg-slate-800'}`}
                        >
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stageColors[i] }} />
                            <span className="text-slate-300">{name}</span>
                        </button>
                    ))}
                </div>

                {/* Key fact callout */}
                <div className="mt-3 flex items-start gap-2 bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-lg">
                    <Info className="text-indigo-400 shrink-0 mt-0.5" size={14} />
                    <p className="text-xs text-slate-300">
                        <strong className="text-indigo-300">REM periods grow longer</strong> through the night. Deep sleep (N3) dominates the first half, while REM dominates the second half. A complete cycle lasts ~90 minutes.
                    </p>
                </div>
            </div>

            {/* Stage Detail Panel */}
            {selectedStage && stageInfo[selectedStage] && (
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-white flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stageColors[stageNames.indexOf(selectedStage)] }} />
                            {selectedStage}
                        </h4>
                        <button onClick={() => setSelectedStage(null)} className="text-slate-500 hover:text-white transition-colors">
                            <X size={16} />
                        </button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <InfoCard icon={<Clock size={14} />} title="Duration" text={stageInfo[selectedStage].duration} />
                        <InfoCard icon={<Activity size={14} />} title="EEG Pattern" text={stageInfo[selectedStage].eeg} />
                        <InfoCard icon={<Brain size={14} />} title="Function" text={stageInfo[selectedStage].function} />
                        <InfoCard icon={<AlertTriangle size={14} />} title="Effects of Deprivation" text={stageInfo[selectedStage].deprivation} />
                    </div>
                </div>
            )}

            {/* Preserved educational content */}
            <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-indigo-900/20 p-4 rounded-lg border border-indigo-500/50">
                    <h4 className="font-bold text-indigo-400 text-sm mb-1 flex items-center gap-2"><Battery size={14} /> SWS (Stages 3/4)</h4>
                    <p className="text-xs text-slate-300 mb-2">Slow Wave Sleep / Deep Sleep</p>
                    <ul className="text-[10px] text-slate-400 list-disc pl-3 space-y-1">
                        <li>Physical restoration &amp; repair.</li>
                        <li>Dominates first half of night.</li>
                        <li>Difficult to wake (High Sleep Inertia).</li>
                        <li>Growth hormone release peaks.</li>
                    </ul>
                </div>
                <div className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-500/50">
                    <h4 className="font-bold text-yellow-400 text-sm mb-1 flex items-center gap-2"><Brain size={14} /> REM (Paradoxical)</h4>
                    <p className="text-xs text-slate-300 mb-2">Rapid Eye Movement</p>
                    <ul className="text-[10px] text-slate-400 list-disc pl-3 space-y-1">
                        <li>Mental restoration &amp; Memory consolidation.</li>
                        <li>Brain active, Body paralyzed (atonia).</li>
                        <li>Dominates second half of night.</li>
                        <li>Dreaming occurs primarily in REM.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

/* ═════════════════════════════════════════════
   3. JET LAG CALCULATOR
   ═════════════════════════════════════════════ */
const JetLagCalc = () => {
    const [direction, setDirection] = useState<'EAST' | 'WEST'>('EAST');
    const [zones, setZones] = useState(6);

    // EASA/ICAO Rule: West ≈ Zones/1.5, East ≈ Zones/1.0
    const recoveryDays = direction === 'WEST' ? zones / 1.5 : zones;

    const strategies = direction === 'EAST'
        ? [
            'Advance sleep schedule 1-2 hours before departure',
            'Seek morning light at destination to advance body clock',
            'Avoid bright light in the evening',
            'Use melatonin in the early evening (destination time)',
            'Short naps (<30 min) to manage acute fatigue',
        ]
        : [
            'Delay sleep schedule gradually before departure',
            'Seek evening light at destination to delay body clock',
            'Avoid morning bright light on arrival',
            'Stay active and awake until local bedtime',
            'Caffeine strategically in the afternoon (destination time)',
        ];

    // Visual timeline
    const dayBars = Math.ceil(recoveryDays);

    return (
        <div className="space-y-6">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                    <Globe className="text-indigo-400" size={18} /> Jet Lag Recovery Calculator
                </h3>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Controls */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-slate-400 text-xs font-bold uppercase mb-3">Flight Direction</label>
                            <div className="flex gap-2">
                                <button onClick={() => setDirection('WEST')}
                                    className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${direction === 'WEST' ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/20' : 'bg-slate-800 text-slate-400 hover:bg-slate-750'}`}>
                                    ← WEST <span className="text-[10px] opacity-70">(Easier)</span>
                                </button>
                                <button onClick={() => setDirection('EAST')}
                                    className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${direction === 'EAST' ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/20' : 'bg-slate-800 text-slate-400 hover:bg-slate-750'}`}>
                                    EAST → <span className="text-[10px] opacity-70">(Harder)</span>
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-slate-400 text-xs font-bold uppercase mb-2">Time Zones Crossed</label>
                            <div className="flex items-center gap-4">
                                <input type="range" min="1" max="12" value={zones}
                                    onChange={e => setZones(Number(e.target.value))}
                                    className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                                <span className="font-mono font-bold text-white text-2xl w-8 text-center">{zones}</span>
                            </div>
                        </div>

                        {/* Recovery display */}
                        <div className="bg-slate-800 p-6 rounded-xl text-center border border-slate-600">
                            <div className="flex items-center justify-center gap-3 mb-2">
                                <Globe size={36} className="text-slate-600" />
                                <Plane size={28} className={`transition-transform duration-500 ${direction === 'EAST' ? 'rotate-45 text-orange-400' : '-rotate-45 text-sky-400'}`} />
                            </div>
                            <div className="text-5xl font-black text-white mb-1">{recoveryDays.toFixed(1)}</div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Days to Adapt</div>
                        </div>

                        {/* Adaptation timeline */}
                        <div>
                            <p className="text-xs text-slate-400 font-bold uppercase mb-2">Adaptation Timeline</p>
                            <div className="flex gap-1">
                                {Array.from({ length: Math.min(dayBars, 12) }, (_, i) => {
                                    const pct = clamp(((i + 1) / recoveryDays) * 100, 0, 100);
                                    return (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                            <div className="w-full h-16 bg-slate-800 rounded-sm relative overflow-hidden">
                                                <div
                                                    className={`absolute bottom-0 w-full transition-all duration-500 rounded-sm ${pct >= 100 ? 'bg-emerald-500' : pct > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                    style={{ height: `${Math.min(pct, 100)}%` }}
                                                />
                                            </div>
                                            <span className="text-[8px] text-slate-500">D{i + 1}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Strategies */}
                    <div className="space-y-4">
                        <div className={`p-4 rounded-xl border ${direction === 'EAST' ? 'bg-orange-500/10 border-orange-500/30' : 'bg-sky-500/10 border-sky-500/30'}`}>
                            <h4 className={`font-bold text-sm mb-3 ${direction === 'EAST' ? 'text-orange-400' : 'text-sky-400'}`}>
                                Strategies for {direction === 'EAST' ? 'Eastward' : 'Westward'} Travel
                            </h4>
                            <ul className="space-y-2">
                                {strategies.map((s, i) => (
                                    <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                                        <Check size={12} className={`shrink-0 mt-0.5 ${direction === 'EAST' ? 'text-orange-400' : 'text-sky-400'}`} />
                                        {s}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-slate-800 p-4 rounded-lg border border-slate-600">
                            <p className="text-sm text-slate-300 font-bold mb-2">Formula Applied</p>
                            <div className="flex justify-around text-xs font-mono text-slate-400">
                                <div className={direction === 'WEST' ? 'text-sky-400 font-bold' : ''}>WEST: Zones / 1.5</div>
                                <div className={direction === 'EAST' ? 'text-orange-400 font-bold' : ''}>EAST: Zones / 1.0</div>
                            </div>
                            <p className="text-xs text-slate-500 mt-3 italic">
                                &quot;West is Best (Easier), East is Least (Harder)&quot; — the body clock&apos;s natural tendency to lengthen (free-run &gt; 24h) makes westward adaptation easier.
                            </p>
                        </div>

                        <div className="bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-lg">
                            <p className="text-xs text-slate-300">
                                <strong className="text-indigo-300">Why East is harder:</strong> Traveling east requires <em>advancing</em> the body clock (going to bed earlier), which fights the natural drift. Traveling west requires <em>delaying</em> (staying up later), which aligns with it.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ═════════════════════════════════════════════
   4. FATIGUE RISK FACTORS (Cumulative Gauge)
   ═════════════════════════════════════════════ */
interface FatigueFactor {
    id: string;
    label: string;
    description: string;
    weight: number;
    icon: React.ReactNode;
}

const FatigueRisk = () => {
    const factors: FatigueFactor[] = [
        { id: 'sleep_debt', label: 'Sleep Debt (>2h cumulative)', description: 'Sleeping less than 7-8 hours consistently. Each hour of debt accumulates.', weight: 25, icon: <Battery size={14} /> },
        { id: 'time_awake', label: 'Extended Time Awake (>16h)', description: 'Being awake for more than 16 hours. At 17h ≈ 0.05% BAC equivalent.', weight: 20, icon: <Clock size={14} /> },
        { id: 'circadian', label: 'Circadian Low Point (02:00-06:00)', description: 'Operating during the WOCL when body temperature and alertness are at their lowest.', weight: 25, icon: <Moon size={14} /> },
        { id: 'workload', label: 'High Workload / Monotony', description: 'Complex tasks or conversely, monotonous cruise phases that reduce stimulation.', weight: 10, icon: <Zap size={14} /> },
        { id: 'consecutive', label: 'Consecutive Duty Periods (>5)', description: 'Multiple early starts or late finishes without adequate rest between.', weight: 15, icon: <BarChart3 size={14} /> },
        { id: 'disruption', label: 'Sleep Quality Disruption', description: 'Noise, light, temperature, unfamiliar sleeping environment reducing sleep quality.', weight: 10, icon: <AlertTriangle size={14} /> },
        { id: 'timezone', label: 'Recent Time Zone Crossing', description: 'Body clock desynchronized from local time, reducing sleep quality and timing.', weight: 15, icon: <Globe size={14} /> },
    ];

    const [activeFactors, setActiveFactors] = useState<Set<string>>(new Set(['sleep_debt', 'circadian']));

    const toggleFactor = (id: string) => {
        setActiveFactors(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const totalScore = factors.filter(f => activeFactors.has(f.id)).reduce((sum, f) => sum + f.weight, 0);
    const maxScore = factors.reduce((sum, f) => sum + f.weight, 0);
    const riskPct = (totalScore / maxScore) * 100;

    const riskLevel = riskPct < 25 ? { label: 'LOW', color: 'text-emerald-400', bg: 'bg-emerald-500', border: 'border-emerald-500/30' }
        : riskPct < 50 ? { label: 'MODERATE', color: 'text-yellow-400', bg: 'bg-yellow-500', border: 'border-yellow-500/30' }
        : riskPct < 75 ? { label: 'HIGH', color: 'text-orange-400', bg: 'bg-orange-500', border: 'border-orange-500/30' }
        : { label: 'CRITICAL', color: 'text-red-400', bg: 'bg-red-500', border: 'border-red-500/30' };

    return (
        <div className="grid lg:grid-cols-5 gap-6">
            {/* Factors list */}
            <div className="lg:col-span-3 bg-slate-900 p-5 rounded-xl border border-slate-700">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <Shield className="text-indigo-400" size={18} /> Fatigue Risk Factors
                </h3>
                <p className="text-xs text-slate-400 mb-4">Toggle factors to see cumulative fatigue risk. Multiple factors compound dangerously.</p>

                <div className="space-y-2">
                    {factors.map(f => {
                        const active = activeFactors.has(f.id);
                        return (
                            <button
                                key={f.id}
                                onClick={() => toggleFactor(f.id)}
                                className={`w-full text-left p-3 rounded-lg border transition-all flex items-start gap-3 ${active
                                    ? `bg-indigo-500/10 border-indigo-500/40 ring-1 ring-indigo-500/20`
                                    : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'}`}
                            >
                                <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center shrink-0 transition-colors ${active ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-500'}`}>
                                    {active ? <Check size={12} /> : null}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className={active ? 'text-indigo-300' : 'text-slate-500'}>{f.icon}</span>
                                        <span className={`text-sm font-bold ${active ? 'text-white' : 'text-slate-400'}`}>{f.label}</span>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${active ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-700 text-slate-500'}`}>+{f.weight}</span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 leading-relaxed">{f.description}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Risk Gauge */}
            <div className="lg:col-span-2 space-y-4">
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 flex flex-col items-center">
                    {/* Semicircular gauge */}
                    <svg viewBox="0 0 200 120" className="w-full max-w-xs mb-4">
                        <defs>
                            <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#10b981" />
                                <stop offset="33%" stopColor="#eab308" />
                                <stop offset="66%" stopColor="#f97316" />
                                <stop offset="100%" stopColor="#ef4444" />
                            </linearGradient>
                        </defs>
                        {/* Background arc */}
                        <path d={describeArc(100, 100, 75, 180, 360)} fill="none" stroke="#334155" strokeWidth="16" strokeLinecap="round" />
                        {/* Filled arc */}
                        <path d={describeArc(100, 100, 75, 180, 180 + riskPct * 1.8)} fill="none" stroke="url(#gaugeGrad)" strokeWidth="16" strokeLinecap="round"
                            style={{ transition: 'all 0.5s ease-out' }} />
                        {/* Needle */}
                        {(() => {
                            const needleAngle = 180 + riskPct * 1.8;
                            const nx = polarX(100, 60, needleAngle);
                            const ny = polarY(100, 60, needleAngle);
                            return <line x1="100" y1="100" x2={nx} y2={ny} stroke="white" strokeWidth="2" strokeLinecap="round"
                                style={{ transition: 'all 0.5s ease-out' }} />;
                        })()}
                        <circle cx="100" cy="100" r="5" fill="#1e293b" stroke="white" strokeWidth="2" />
                        {/* Score text */}
                        <text x="100" y="85" textAnchor="middle" className="font-bold" fill="white" style={{ fontSize: '22px', fontWeight: 800 }}>
                            {totalScore}
                        </text>
                        <text x="100" y="72" textAnchor="middle" fill="#94a3b8" style={{ fontSize: '8px' }}>
                            / {maxScore}
                        </text>
                    </svg>

                    <div className={`text-xl font-black ${riskLevel.color} mb-1`}>{riskLevel.label} RISK</div>
                    <p className="text-xs text-slate-400 text-center">
                        {activeFactors.size} of {factors.length} factors active
                    </p>

                    {/* Consequences */}
                    <div className="w-full mt-4 space-y-2">
                        {riskPct >= 25 && (
                            <div className="flex items-center gap-2 text-xs text-yellow-300 bg-yellow-900/15 p-2 rounded">
                                <AlertTriangle size={12} className="shrink-0" /> Reaction time increased, attention narrowing
                            </div>
                        )}
                        {riskPct >= 50 && (
                            <div className="flex items-center gap-2 text-xs text-orange-300 bg-orange-900/15 p-2 rounded">
                                <AlertTriangle size={12} className="shrink-0" /> Microsleep episodes likely, impaired decision-making
                            </div>
                        )}
                        {riskPct >= 75 && (
                            <div className="flex items-center gap-2 text-xs text-red-300 bg-red-900/15 p-2 rounded">
                                <AlertTriangle size={12} className="shrink-0" /> Cognitive impairment equivalent to &gt;0.05% BAC
                            </div>
                        )}
                    </div>
                </div>

                {/* Mitigations */}
                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600">
                    <h4 className="font-bold text-white text-sm mb-2">Fatigue Countermeasures</h4>
                    <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                        <li><strong>Controlled napping:</strong> NASA nap = 20-26 min, +34% alertness</li>
                        <li><strong>Caffeine:</strong> Strategic use, avoid within 6h of planned sleep</li>
                        <li><strong>Task sharing:</strong> Cross-monitoring, CRM callouts during WOCL</li>
                        <li><strong>Light exposure:</strong> Bright light during desired wake period</li>
                        <li><strong>FRM reporting:</strong> Report fatigue through company FRMS</li>
                    </ul>
                </div>

                <div className="bg-slate-800 p-4 rounded text-xs text-slate-400">
                    <strong>Rule of Thumb:</strong> Sleep debt is cumulative. It generally takes 2 consecutive nights of unrestricted sleep to fully recover from a chronic sleep debt.
                </div>
            </div>
        </div>
    );
};

/* ═════════════════════════════════════════════
   5. SLEEP STAGES QUICK REFERENCE (Expandable)
   ═════════════════════════════════════════════ */
const SleepStagesCards = () => {
    const [expanded, setExpanded] = useState<string | null>(null);

    const stages = [
        {
            id: 'n1', name: 'NREM Stage 1 (N1)', color: 'from-blue-600 to-blue-500', borderColor: 'border-blue-500/50',
            brief: '5% of sleep · Transition · Easily awakened',
            duration: '~5% of total sleep time',
            eeg: 'Theta waves (4-8 Hz) — low amplitude, mixed frequency',
            characteristics: ['Light, transitional sleep stage', 'Hypnic jerks (myoclonic jerks) common', 'Easily awakened — may deny having been asleep', 'Rolling eye movements', 'Loss of muscle tone begins'],
            function: 'Bridge between wakefulness and sleep. The brain begins to disengage from the environment.',
            deprivation: 'Mild increase in daytime drowsiness, slightly elevated sleep pressure.',
            pilotNote: 'Microsleeps during this stage can go unnoticed — a critical safety concern during low-workload phases.',
        },
        {
            id: 'n2', name: 'NREM Stage 2 (N2)', color: 'from-indigo-600 to-indigo-500', borderColor: 'border-indigo-500/50',
            brief: '45-55% of sleep · Sleep spindles · Memory consolidation',
            duration: '~45-55% of total sleep time (largest portion)',
            eeg: 'Sleep spindles (12-14 Hz bursts) and K-complexes',
            characteristics: ['True sleep — higher arousal threshold than N1', 'Body temperature drops', 'Heart rate and breathing become regular', 'Sleep spindles gate sensory input (noise protection)', 'K-complexes may indicate response to stimuli during sleep'],
            function: 'Memory consolidation begins, particularly procedural/motor memory. Protects sleep continuity.',
            deprivation: 'Reduced procedural memory consolidation, fragmented sleep quality.',
            pilotNote: 'Sleep spindles protect against external noise. Important for crew rest in noisy environments.',
        },
        {
            id: 'n3', name: 'NREM Stage 3 (N3 / SWS)', color: 'from-purple-700 to-purple-500', borderColor: 'border-purple-500/50',
            brief: '15-20% of sleep · Deep/SWS · Physical restoration',
            duration: '~15-20% of total sleep time',
            eeg: 'Delta waves (0.5-4 Hz) — high amplitude, slow',
            characteristics: ['Deepest sleep stage — very difficult to awaken', 'Growth hormone secretion peaks', 'Immune system restoration', 'Parasomnias may occur (sleepwalking, night terrors)', 'Dominates the first third of the night'],
            function: 'Physical repair and restoration. Tissue growth, immune strengthening, energy restoration.',
            deprivation: 'Severe fatigue, weakened immunity, impaired glucose metabolism, high sleep inertia on forced awakening.',
            pilotNote: 'Waking from deep sleep causes significant sleep inertia (grogginess). Plan naps to avoid N3 (keep naps <30 min).',
        },
        {
            id: 'rem', name: 'REM Sleep', color: 'from-amber-600 to-yellow-500', borderColor: 'border-yellow-500/50',
            brief: '20-25% of sleep · Dreaming · Mental restoration',
            duration: '~20-25% of total sleep time',
            eeg: 'Beta-like activity (desynchronized, low voltage, fast) — paradoxically similar to wakefulness',
            characteristics: ['Rapid Eye Movements (conjugate)', 'Skeletal muscle atonia (paralysis) — except diaphragm and eye muscles', 'Vivid dreaming', 'Irregular heart rate and breathing', 'Periods lengthen through the night (longest near morning)', 'Also called "Paradoxical Sleep" (active brain, paralyzed body)'],
            function: 'Mental restoration, emotional processing, procedural and declarative memory consolidation.',
            deprivation: 'Irritability, difficulty concentrating, poor emotional regulation, potential hallucinations with extended deprivation.',
            pilotNote: 'REM dominates the second half of sleep. Cutting sleep short (early wake) primarily robs REM time, impairing cognitive and emotional function.',
        },
    ];

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
                <Brain className="text-indigo-400" size={18} />
                <h3 className="font-bold text-white">Sleep Stages Quick Reference</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">Click any stage to expand detailed information. All percentages are for healthy adult sleep.</p>

            {stages.map(stage => {
                const isOpen = expanded === stage.id;
                return (
                    <div key={stage.id} className={`rounded-xl border transition-all duration-300 overflow-hidden ${stage.borderColor} ${isOpen ? 'bg-slate-900' : 'bg-slate-900/60 hover:bg-slate-900'}`}>
                        <button
                            onClick={() => setExpanded(isOpen ? null : stage.id)}
                            className="w-full p-4 flex items-center justify-between text-left"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stage.color} flex items-center justify-center shadow-lg`}>
                                    <Brain size={18} className="text-white" />
                                </div>
                                <div>
                                    <div className="font-bold text-white text-sm">{stage.name}</div>
                                    <div className="text-xs text-slate-400">{stage.brief}</div>
                                </div>
                            </div>
                            {isOpen ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                        </button>

                        {isOpen && (
                            <div className="px-4 pb-5 pt-0 space-y-4 animate-in fade-in slide-in-from-top-2">
                                <div className="grid sm:grid-cols-2 gap-3">
                                    <InfoCard icon={<Clock size={14} />} title="Duration" text={stage.duration} />
                                    <InfoCard icon={<Activity size={14} />} title="EEG Pattern" text={stage.eeg} />
                                </div>

                                <div className="bg-slate-800/50 p-3 rounded-lg">
                                    <h5 className="font-bold text-white text-xs mb-2">Characteristics</h5>
                                    <ul className="text-[11px] text-slate-300 space-y-1 list-disc pl-4">
                                        {stage.characteristics.map((c, i) => <li key={i}>{c}</li>)}
                                    </ul>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-3">
                                    <InfoCard icon={<Brain size={14} />} title="Function" text={stage.function} />
                                    <InfoCard icon={<AlertTriangle size={14} />} title="Effects of Deprivation" text={stage.deprivation} />
                                </div>

                                <div className="bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-lg flex items-start gap-2">
                                    <Plane size={14} className="text-indigo-400 shrink-0 mt-0.5" />
                                    <div>
                                        <span className="text-xs font-bold text-indigo-300">Pilot Relevance: </span>
                                        <span className="text-xs text-slate-300">{stage.pilotNote}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

/* ═════════════════════════════════════════════
   SHARED SUB-COMPONENTS
   ═════════════════════════════════════════════ */
const LegendDot = ({ color, label }: { color: string; label: string }) => (
    <div className="flex items-center gap-1.5">
        <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
        <span className="text-[10px] text-slate-400">{label}</span>
    </div>
);

const MetricGauge = ({ label, value, pct, color }: { label: string; value: string; pct: number; color: string }) => (
    <div className="bg-slate-900 p-3 rounded-lg border border-slate-700">
        <div className="flex justify-between items-center mb-2">
            <span className="text-[11px] text-slate-400">{label}</span>
            <span className="text-xs font-mono font-bold text-white">{value}</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className={`h-full bg-gradient-to-r ${color} transition-all duration-500 rounded-full`}
                style={{ width: `${clamp(pct, 0, 100)}%` }} />
        </div>
    </div>
);

const InfoCard = ({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) => (
    <div className="bg-slate-800/70 p-3 rounded-lg">
        <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-indigo-400">{icon}</span>
            <span className="text-xs font-bold text-slate-300">{title}</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">{text}</p>
    </div>
);

/* ─────────────────── SVG arc helper ─────────────────── */
function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
    const start = {
        x: cx + r * Math.cos((startAngle - 90) * Math.PI / 180),
        y: cy + r * Math.sin((startAngle - 90) * Math.PI / 180),
    };
    const end = {
        x: cx + r * Math.cos((endAngle - 90) * Math.PI / 180),
        y: cy + r * Math.sin((endAngle - 90) * Math.PI / 180),
    };
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

export default SleepAndRhythms;
