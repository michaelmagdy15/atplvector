import React, { useState, useEffect, useRef } from 'react';
import {
    Eye, Compass, Move, AlertOctagon, RotateCw, Plane,
    ChevronDown, ChevronRight, Shield, Moon, Sun, Activity,
    AlertTriangle, Info, Clock, Zap, Navigation
} from 'lucide-react';

/* ─────────────────────────────────────────────
   Main Component
   ───────────────────────────────────────────── */
const HPLDisorientation: React.FC = () => {
    const [tab, setTab] = useState<'vestibular' | 'illusions' | 'nightvision' | 'prevention'>('vestibular');

    const tabs = [
        { id: 'vestibular' as const, label: 'Vestibular Sim', icon: <RotateCw size={14} /> },
        { id: 'illusions' as const, label: 'Illusion Explorer', icon: <AlertOctagon size={14} /> },
        { id: 'nightvision' as const, label: 'Night Vision', icon: <Moon size={14} /> },
        { id: 'prevention' as const, label: 'Prevention', icon: <Shield size={14} /> },
    ];

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <Compass className="text-violet-400" />
                        Disorientation &amp; Illusions (040.02.04)
                    </h2>
                    <p className="text-slate-400 text-sm">
                        Vestibular System, Visual Illusions, Night Vision &amp; Prevention Strategies.
                    </p>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-lg flex-wrap gap-1">
                    {tabs.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={`px-3 py-2 rounded-md font-bold text-xs flex items-center gap-1.5 transition-all duration-200 ${
                                tab === t.id
                                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                        >
                            {t.icon} {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {tab === 'vestibular' && <VestibularSimulator />}
            {tab === 'illusions' && <IllusionExplorer />}
            {tab === 'nightvision' && <NightVisionTimeline />}
            {tab === 'prevention' && <PreventionAccordion />}
        </div>
    );
};

/* ─────────────────────────────────────────────
   1. Vestibular Illusion Simulator
   SVG semicircular canal with animated endolymph
   ───────────────────────────────────────────── */
type TurnPhase = 'rest' | 'start' | 'steady' | 'stop';

const VestibularSimulator = () => {
    const [phase, setPhase] = useState<TurnPhase>('rest');
    const [cupulaAngle, setCupulaAngle] = useState(0);
    const [fluidOffset, setFluidOffset] = useState(0);
    const animRef = useRef<number | null>(null);

    useEffect(() => {
        let target = 0;
        let fluidTarget = 0;

        switch (phase) {
            case 'rest':
                target = 0;
                fluidTarget = 0;
                break;
            case 'start':
                target = -25; // Cupula deflects opposite to turn
                fluidTarget = -20;
                break;
            case 'steady':
                target = 0; // Cupula returns — fluid catches up ("washout")
                fluidTarget = 0;
                break;
            case 'stop':
                target = 25; // Cupula deflects the OTHER way — illusion!
                fluidTarget = 20;
                break;
        }

        let current = cupulaAngle;
        let fluidCurrent = fluidOffset;

        const animate = () => {
            current += (target - current) * 0.04;
            fluidCurrent += (fluidTarget - fluidCurrent) * 0.03;

            if (Math.abs(target - current) > 0.3 || Math.abs(fluidTarget - fluidCurrent) > 0.3) {
                setCupulaAngle(current);
                setFluidOffset(fluidCurrent);
                animRef.current = requestAnimationFrame(animate);
            } else {
                setCupulaAngle(target);
                setFluidOffset(fluidTarget);
            }
        };

        animRef.current = requestAnimationFrame(animate);
        return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase]);

    const phaseInfo: Record<TurnPhase, { label: string; detail: string; color: string }> = {
        rest: {
            label: 'At Rest',
            detail: 'Cupula is centred. Fluid is stationary. No rotational sensation.',
            color: 'text-emerald-400',
        },
        start: {
            label: 'Turn Initiated',
            detail: 'Canal wall moves but fluid (endolymph) lags due to inertia → cupula deflects → brain senses turn.',
            color: 'text-violet-400',
        },
        steady: {
            label: 'Steady Turn (≈20 s)',
            detail: 'Fluid catches up with canal walls. Cupula returns to neutral. Brain thinks the turn has STOPPED — but the aircraft is still banking!',
            color: 'text-amber-400',
        },
        stop: {
            label: 'Turn Stopped',
            detail: 'Canal walls stop, but fluid keeps moving → cupula deflects the opposite way → brain senses a turn in the OPPOSITE direction. This causes The Leans.',
            color: 'text-red-400',
        },
    };

    const info = phaseInfo[phase];

    return (
        <div className="grid md:grid-cols-2 gap-8">
            {/* SVG Canal */}
            <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 flex flex-col items-center">
                <h3 className="font-bold text-white mb-4 text-center">Semicircular Canal Cross-Section</h3>

                <svg viewBox="0 0 300 280" className="w-full max-w-sm" xmlns="http://www.w3.org/2000/svg">
                    {/* Background glow */}
                    <defs>
                        <radialGradient id="canalGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
                        </radialGradient>
                        <linearGradient id="fluidGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#6d28d9" stopOpacity="0.9" />
                        </linearGradient>
                    </defs>
                    <rect x="0" y="0" width="300" height="280" fill="url(#canalGlow)" rx="12" />

                    {/* Canal outer wall */}
                    <path
                        d="M 60 220 Q 60 60 150 60 Q 240 60 240 220"
                        fill="none" stroke="#475569" strokeWidth="28" strokeLinecap="round"
                    />
                    {/* Canal inner wall */}
                    <path
                        d="M 60 220 Q 60 60 150 60 Q 240 60 240 220"
                        fill="none" stroke="#1e293b" strokeWidth="18" strokeLinecap="round"
                    />

                    {/* Endolymph (fluid) — shifts with fluidOffset */}
                    <g style={{ transform: `translateX(${fluidOffset}px)`, transition: 'none' }}>
                        <path
                            d="M 72 215 Q 72 75 150 75 Q 228 75 228 215"
                            fill="none" stroke="url(#fluidGrad)" strokeWidth="10" strokeLinecap="round"
                            strokeDasharray="8 4" opacity="0.85"
                        />
                        {/* Fluid particles */}
                        {[90, 120, 150, 180, 200].map((angle, i) => {
                            const t = angle / 290;
                            const x = 72 + (228 - 72) * t;
                            const y = 215 - Math.sin(t * Math.PI) * 140;
                            return (
                                <circle key={i} cx={x} cy={y} r="3" fill="#a78bfa" opacity="0.7">
                                    <animate attributeName="opacity" values="0.4;0.9;0.4" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
                                </circle>
                            );
                        })}
                    </g>

                    {/* Ampulla / bulge region */}
                    <ellipse cx="80" cy="210" rx="22" ry="18" fill="#334155" stroke="#475569" strokeWidth="2" />
                    <text x="80" y="252" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="bold">AMPULLA</text>

                    {/* Cupula (deflects with cupulaAngle) */}
                    <g style={{ transformOrigin: '80px 222px', transform: `rotate(${cupulaAngle}deg)` }}>
                        <line x1="80" y1="195" x2="80" y2="222" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
                        <circle cx="80" cy="192" r="5" fill="#f59e0b" opacity="0.9" />
                        {/* Hair cells at base */}
                        {[-6, -2, 2, 6].map((dx, i) => (
                            <line key={i} x1={80 + dx} y1="224" x2={80 + dx} y2="230" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
                        ))}
                    </g>
                    <text x="80" y="242" textAnchor="middle" fill="#fbbf24" fontSize="8" fontWeight="bold">CUPULA</text>

                    {/* Labels */}
                    <text x="150" y="50" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold">SEMICIRCULAR CANAL</text>
                    <text x="240" y="240" textAnchor="middle" fill="#a78bfa" fontSize="8">Endolymph</text>

                    {/* Turn direction arrows */}
                    {(phase === 'start' || phase === 'steady') && (
                        <g opacity="0.6">
                            <path d="M 260 140 Q 275 100 250 70" fill="none" stroke="#7c3aed" strokeWidth="2" markerEnd="url(#arrowViolet)" />
                            <text x="272" y="110" fill="#7c3aed" fontSize="8">TURN</text>
                        </g>
                    )}
                    {phase === 'stop' && (
                        <g opacity="0.6">
                            <path d="M 250 70 Q 275 100 260 140" fill="none" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrowRed)" />
                            <text x="268" y="110" fill="#ef4444" fontSize="8">STOP</text>
                        </g>
                    )}
                    <defs>
                        <marker id="arrowViolet" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                            <path d="M0,0 L8,3 L0,6" fill="#7c3aed" />
                        </marker>
                        <marker id="arrowRed" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                            <path d="M0,0 L8,3 L0,6" fill="#ef4444" />
                        </marker>
                    </defs>
                </svg>

                {/* Phase buttons */}
                <div className="flex flex-wrap gap-2 mt-6 justify-center">
                    {(['rest', 'start', 'steady', 'stop'] as TurnPhase[]).map(p => (
                        <button
                            key={p}
                            onClick={() => setPhase(p)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                                phase === p
                                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/40 scale-105'
                                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            }`}
                        >
                            {p === 'rest' ? '⏸ At Rest' : p === 'start' ? '▶ Start Turn' : p === 'steady' ? '⏩ Steady Turn' : '⏹ Stop Turn'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Info panel */}
            <div className="space-y-6">
                {/* Current phase status */}
                <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Activity className="text-violet-400" size={20} />
                        <h3 className="font-bold text-white">Current Phase</h3>
                    </div>
                    <div className={`text-xl font-black mb-3 ${info.color}`}>{info.label}</div>
                    <p className="text-sm text-slate-300 leading-relaxed">{info.detail}</p>

                    {phase === 'steady' && (
                        <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                            <p className="text-xs text-amber-300 font-bold">⚠ DANGER ZONE</p>
                            <p className="text-xs text-amber-200/80 mt-1">
                                The &quot;washout&quot; effect takes ~20 seconds. After this, the pilot&apos;s vestibular system gives ZERO turn feedback despite continuous banking.
                            </p>
                        </div>
                    )}
                    {phase === 'stop' && (
                        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                            <p className="text-xs text-red-300 font-bold">⚠ ILLUSION ACTIVE</p>
                            <p className="text-xs text-red-200/80 mt-1">
                                The pilot now FEELS a turn in the opposite direction. This is &quot;The Leans&quot; — the most common vestibular illusion. The pilot may re-enter the original turn unconsciously.
                            </p>
                        </div>
                    )}
                </div>

                {/* Key numbers */}
                <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
                    <h3 className="font-bold text-white mb-4">Thresholds &amp; Key Facts</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-slate-800 rounded-lg">
                            <div className="text-2xl font-black text-violet-400">2°/s</div>
                            <p className="text-[10px] text-slate-400 mt-1">Sub-threshold roll rate</p>
                        </div>
                        <div className="text-center p-3 bg-slate-800 rounded-lg">
                            <div className="text-2xl font-black text-amber-400">~20s</div>
                            <p className="text-[10px] text-slate-400 mt-1">Washout time constant</p>
                        </div>
                        <div className="text-center p-3 bg-slate-800 rounded-lg">
                            <div className="text-2xl font-black text-emerald-400">3</div>
                            <p className="text-[10px] text-slate-400 mt-1">Canal pairs (Pitch/Roll/Yaw)</p>
                        </div>
                        <div className="text-center p-3 bg-slate-800 rounded-lg">
                            <div className="text-2xl font-black text-red-400">90°</div>
                            <p className="text-[10px] text-slate-400 mt-1">Angle between canal pairs</p>
                        </div>
                    </div>
                </div>

                {/* Otolith summary */}
                <div className="bg-slate-900 rounded-xl border border-slate-700 p-4">
                    <h4 className="font-bold text-white text-sm mb-2">Otoliths (Utricle &amp; Saccule)</h4>
                    <p className="text-xs text-slate-400">
                        Chalk-like crystals on hair cells. Detect <strong className="text-white">linear acceleration</strong> and <strong className="text-white">gravity</strong>.
                    </p>
                    <div className="mt-3 p-2 bg-violet-500/10 border border-violet-500/30 rounded text-xs text-violet-300 font-bold text-center">
                        Primary cause of Somatogravic Illusion (False Climb/Dive)
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────
   2. Illusion Type Explorer
   Color-coded expandable cards
   ───────────────────────────────────────────── */
interface IllusionData {
    name: string;
    severity: 'high' | 'medium' | 'critical';
    icon: React.ReactNode;
    sensor: string;
    description: string;
    scenario: string;
    prevention: string;
    mechanism: string;
}

const illusionData: IllusionData[] = [
    {
        name: 'The Leans',
        severity: 'high',
        icon: <Move size={18} />,
        sensor: 'Semicircular Canals',
        description: 'Most common vestibular illusion. A sub-threshold roll into a bank followed by a sudden correction gives a false sensation of banking in the opposite direction.',
        mechanism: 'Sub-threshold entry (< 2°/s) goes undetected → "washout" makes brain think wings are level → quick correction is detected as a roll INTO a turn.',
        scenario: 'IMC flight: gradual unnoticed bank develops. On instruments the pilot corrects rapidly. Now FEELS tilted even though wings are level. Pilot leans body to compensate.',
        prevention: 'Trust instruments. Avoid abrupt corrections. Cross-check AI (Attitude Indicator) frequently. Do NOT lean your body — stay centred in the seat.',
    },
    {
        name: 'Graveyard Spiral',
        severity: 'critical',
        icon: <Navigation size={18} />,
        sensor: 'Semicircular Canals',
        description: 'Extension of The Leans. After prolonged undetected bank, pilot senses only the descent (from altimeter/VSI) and pulls back on the stick — tightening the spiral.',
        mechanism: 'Washout + steady turn → no bank sensation → pilot notices altitude loss → pulls back → increases bank angle → tightens descending spiral → structural failure or CFIT.',
        scenario: 'VFR pilot enters cloud. Undetected bank develops. Altimeter shows descent. Pilot pulls nose up but doesn\'t level wings. Speed builds, G increases, spiral tightens.',
        prevention: 'FIRST level the wings (attitude indicator), THEN pull out of dive. Scan instruments methodically. Never fixate on a single instrument.',
    },
    {
        name: 'Somatogravic Illusion',
        severity: 'critical',
        icon: <Zap size={18} />,
        sensor: 'Otoliths (Utricle)',
        description: 'Rapid acceleration (e.g., take-off) tilts the otolith membrane backwards, mimicking a nose-up pitch. Pilot pushes nose down into the ground.',
        mechanism: 'Linear acceleration → otoliths cannot distinguish acceleration from gravity vector change → brain interprets acceleration as pitch-up → pilot "corrects" by pitching down.',
        scenario: 'Night take-off from unlighted runway. Full power applied. Pilot feels strong pitch-up, pushes stick forward. On a go-around with rapid throttle-up, same illusion occurs.',
        prevention: 'Monitor attitude indicator during take-off and go-around. Brief yourself on the illusion before night departures. Trust instruments over sensations.',
    },
    {
        name: 'Coriolis Illusion',
        severity: 'high',
        icon: <RotateCw size={18} />,
        sensor: 'Semicircular Canals (cross-coupled)',
        description: 'Head movement in a different plane during a turn stimulates canals in two planes simultaneously, causing a violent tumbling sensation.',
        mechanism: 'Turning (yaw) + head tilt (pitch or roll) = fluid displaced in canals that were previously at rest → brain receives conflicting signals → extreme disorientation.',
        scenario: 'Pilot in a steady coordinated turn looks down at a chart or reaches for a dropped pen. The head pitch in the context of the existing yaw creates a massive disorientation event.',
        prevention: 'Avoid head movements during turns in IMC. Pre-position charts and equipment. Keep head movements slow and deliberate. Use autopilot before looking away.',
    },
    {
        name: 'Black Hole Approach',
        severity: 'critical',
        icon: <Eye size={18} />,
        sensor: 'Visual System',
        description: 'Approach over water or unlit terrain at night toward a lit runway. No peripheral visual cues. Pilots fly a curved, descending approach — landing short.',
        mechanism: 'No visual horizon or peripheral cues → pilot relies solely on runway lights → misjudges height and distance → unconsciously descends below glidepath → CFIT.',
        scenario: 'Night approach over the sea or desert to a coastal airport. Only the runway lights are visible. Pilot gradually descends below the 3° glideslope without realizing it.',
        prevention: 'Use VASI/PAPI. Fly ILS/RNAV approach even in VMC at night. Monitor radio altimeter. Brief the crew on black hole conditions before approach.',
    },
    {
        name: 'False Horizon',
        severity: 'medium',
        icon: <AlertTriangle size={18} />,
        sensor: 'Visual System',
        description: 'Sloping cloud layers, city lights on hills, or aurora borealis create a visual line that the pilot mistakes for the true horizon.',
        mechanism: 'The brain uses the strongest visual reference as "horizon." Sloped cloud lines, angled shorelines, or rows of lights on a hillside can override instrument information.',
        scenario: 'Flying toward a coastline at an angle at night. The shoreline lights slope upward. Pilot unconsciously banks to align with the false horizon.',
        prevention: 'Cross-check attitude indicator. Be especially vigilant in areas with misleading light patterns (coastlines, mountains, northern latitudes). Use autopilot altitude hold.',
    },
];

const severityConfig = {
    critical: { bg: 'bg-red-500/10', border: 'border-red-500/40', badge: 'bg-red-500/20 text-red-400', accent: 'text-red-400' },
    high: { bg: 'bg-amber-500/10', border: 'border-amber-500/40', badge: 'bg-amber-500/20 text-amber-400', accent: 'text-amber-400' },
    medium: { bg: 'bg-blue-500/10', border: 'border-blue-500/40', badge: 'bg-blue-500/20 text-blue-400', accent: 'text-blue-400' },
};

const IllusionExplorer = () => {
    const [expanded, setExpanded] = useState<number | null>(null);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <AlertOctagon className="text-violet-400" size={18} />
                    Illusion Type Explorer
                </h3>
                <div className="flex gap-3 text-[10px]">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Critical</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> High</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Medium</span>
                </div>
            </div>

            {illusionData.map((illusion, idx) => {
                const sev = severityConfig[illusion.severity];
                const isOpen = expanded === idx;

                return (
                    <div
                        key={idx}
                        className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                            isOpen ? `${sev.border} ${sev.bg}` : 'border-slate-700 bg-slate-900 hover:border-slate-600'
                        }`}
                    >
                        {/* Header */}
                        <button
                            className="w-full flex items-center gap-3 p-4 text-left"
                            onClick={() => setExpanded(isOpen ? null : idx)}
                        >
                            <div className={`p-2 rounded-lg ${sev.badge}`}>{illusion.icon}</div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-white text-sm">{illusion.name}</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${sev.badge}`}>
                                        {illusion.severity}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 mt-0.5 truncate">{illusion.sensor}</p>
                            </div>
                            <ChevronDown
                                size={16}
                                className={`text-slate-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {/* Expanded content */}
                        <div
                            className="overflow-hidden transition-all duration-300"
                            style={{ maxHeight: isOpen ? '600px' : '0px', opacity: isOpen ? 1 : 0 }}
                        >
                            <div className="px-4 pb-4 space-y-4">
                                <p className="text-sm text-slate-300 leading-relaxed">{illusion.description}</p>

                                <div className="grid md:grid-cols-3 gap-3">
                                    {/* Mechanism */}
                                    <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                                        <div className="flex items-center gap-1.5 mb-2">
                                            <Activity size={12} className="text-violet-400" />
                                            <span className="text-[10px] font-bold text-violet-400 uppercase">Mechanism</span>
                                        </div>
                                        <p className="text-xs text-slate-400 leading-relaxed">{illusion.mechanism}</p>
                                    </div>

                                    {/* Scenario */}
                                    <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                                        <div className="flex items-center gap-1.5 mb-2">
                                            <Plane size={12} className="text-amber-400" />
                                            <span className="text-[10px] font-bold text-amber-400 uppercase">Cockpit Scenario</span>
                                        </div>
                                        <p className="text-xs text-slate-400 leading-relaxed">{illusion.scenario}</p>
                                    </div>

                                    {/* Prevention */}
                                    <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                                        <div className="flex items-center gap-1.5 mb-2">
                                            <Shield size={12} className="text-emerald-400" />
                                            <span className="text-[10px] font-bold text-emerald-400 uppercase">Prevention</span>
                                        </div>
                                        <p className="text-xs text-slate-400 leading-relaxed">{illusion.prevention}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Visual runway illusions (preserved from original) */}
            <div className="mt-6 bg-slate-900 rounded-xl border border-slate-700 p-6">
                <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                    <Eye size={16} className="text-violet-400" />
                    Runway Perspective Illusions
                </h4>
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-violet-500/50 transition-colors">
                        <div className="h-24 bg-black relative mb-3 overflow-hidden rounded">
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-full bg-slate-500"
                                style={{ clipPath: 'polygon(20% 0, 80% 0, 100% 100%, 0% 100%)' }} />
                        </div>
                        <h5 className="font-bold text-white text-xs">Narrow Runway</h5>
                        <p className="text-[10px] text-slate-400 mt-1">
                            Looks higher → Pilot flies <span className="text-red-400 font-bold">LOWER</span>
                        </p>
                        <div className="mt-1 text-[9px] text-red-400 font-mono">DANGER: CFIT / Undershoot</div>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-violet-500/50 transition-colors">
                        <div className="h-24 bg-black relative mb-3 overflow-hidden rounded">
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-full bg-slate-500"
                                style={{ clipPath: 'polygon(20% 0, 80% 0, 100% 100%, 0% 100%)' }} />
                        </div>
                        <h5 className="font-bold text-white text-xs">Wide Runway</h5>
                        <p className="text-[10px] text-slate-400 mt-1">
                            Looks lower → Pilot flies <span className="text-blue-400 font-bold">HIGHER</span>
                        </p>
                        <div className="mt-1 text-[9px] text-blue-400 font-mono">RISK: Overshoot / Flare High</div>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-violet-500/50 transition-colors">
                        <div className="h-24 bg-black relative mb-3 overflow-hidden rounded flex items-center justify-center">
                            <div className="w-20 h-14 border-b-4 border-slate-500 transform" style={{ clipPath: 'polygon(30% 100%, 70% 100%, 80% 0, 20% 0)', background: 'linear-gradient(to top, #475569, transparent)' }} />
                        </div>
                        <h5 className="font-bold text-white text-xs">Upsloping Runway</h5>
                        <p className="text-[10px] text-slate-400 mt-1">
                            Looks higher → Pilot flies <span className="text-red-400 font-bold">LOWER</span>
                        </p>
                        <div className="mt-1 text-[9px] text-amber-400 font-mono">DANGER: CFIT / Undershoot</div>
                    </div>
                </div>

                <div className="mt-4 p-3 bg-slate-700/30 rounded-lg text-xs text-slate-300 border border-slate-600">
                    <strong>Autokinesis:</strong> Staring at a single static light in the dark — it appears to move after a few seconds. Do not follow it.
                </div>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────
   3. Night Vision Adaptation Timeline
   Slider 0–30 min with rod/cone curves
   ───────────────────────────────────────────── */
const NightVisionTimeline = () => {
    const [minutes, setMinutes] = useState(0);

    // Rod sensitivity rises logarithmically over ~30 min
    const rodSensitivity = Math.min(100, (Math.log10(minutes + 1) / Math.log10(31)) * 100);
    // Cone sensitivity peaks quickly (~5 min) then stays flat
    const coneSensitivity = Math.min(100, minutes <= 5 ? (minutes / 5) * 100 : 100);
    // But cones only contribute ~15% of dark adaptation
    const coneMaxContribution = 15;
    const coneContrib = (coneSensitivity / 100) * coneMaxContribution;

    const markers = [
        { min: 0, label: 'Full Light', desc: 'Photopic vision (cones). Full color. No dark adaptation.' },
        { min: 5, label: 'Cones Adapted', desc: 'Cone dark adaptation complete. Central vision improved but limited. Color vision still present but degraded.' },
        { min: 10, label: 'Rod-Cone Break', desc: 'Rods begin to take over. Scotopic vision emerging. Loss of color perception begins.' },
        { min: 20, label: 'Significant Adaptation', desc: 'Rod sensitivity ~80%. Off-centre viewing technique effective. Minimal colour vision remains.' },
        { min: 30, label: 'Full Dark Adaptation', desc: 'Rods at maximum sensitivity (~1000× brighter than cones). Vision is monochromatic. Single bright light will RESET the process.' },
    ];

    const currentMarker = [...markers].reverse().find(m => minutes >= m.min) || markers[0];

    // SVG curve points
    const curvePoints = (type: 'rod' | 'cone') => {
        const points: string[] = [];
        for (let m = 0; m <= 30; m += 0.5) {
            const x = 30 + (m / 30) * 240;
            let y: number;
            if (type === 'rod') {
                const sens = Math.min(100, (Math.log10(m + 1) / Math.log10(31)) * 100);
                y = 160 - (sens / 100) * 130;
            } else {
                const sens = Math.min(100, m <= 5 ? (m / 5) * 100 : 100);
                y = 160 - ((sens / 100) * coneMaxContribution / 100) * 130;
            }
            points.push(`${x},${y}`);
        }
        return points.join(' ');
    };

    const sliderX = 30 + (minutes / 30) * 240;
    const rodY = 160 - (rodSensitivity / 100) * 130;

    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
                {/* SVG Chart */}
                <div className="md:col-span-2 bg-slate-900 rounded-xl border border-slate-700 p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                        <Moon className="text-violet-400" size={18} />
                        Dark Adaptation Curves
                    </h3>

                    <svg viewBox="0 0 300 200" className="w-full" xmlns="http://www.w3.org/2000/svg">
                        {/* Grid */}
                        {[0, 5, 10, 15, 20, 25, 30].map(m => {
                            const x = 30 + (m / 30) * 240;
                            return (
                                <g key={m}>
                                    <line x1={x} y1="25" x2={x} y2="160" stroke="#334155" strokeWidth="0.5" />
                                    <text x={x} y="175" textAnchor="middle" fill="#64748b" fontSize="7">{m}min</text>
                                </g>
                            );
                        })}
                        {[0, 25, 50, 75, 100].map(pct => {
                            const y = 160 - (pct / 100) * 130;
                            return (
                                <g key={pct}>
                                    <line x1="30" y1={y} x2="270" y2={y} stroke="#334155" strokeWidth="0.5" />
                                    <text x="26" y={y + 3} textAnchor="end" fill="#64748b" fontSize="6">{pct}%</text>
                                </g>
                            );
                        })}

                        {/* Axes */}
                        <line x1="30" y1="25" x2="30" y2="160" stroke="#475569" strokeWidth="1" />
                        <line x1="30" y1="160" x2="270" y2="160" stroke="#475569" strokeWidth="1" />
                        <text x="150" y="192" textAnchor="middle" fill="#94a3b8" fontSize="7">Time in Dark (minutes)</text>
                        <text x="10" y="95" textAnchor="middle" fill="#94a3b8" fontSize="6" transform="rotate(-90, 10, 95)">Sensitivity</text>

                        {/* Cone curve */}
                        <polyline points={curvePoints('cone')} fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 2" opacity="0.8" />

                        {/* Rod curve */}
                        <polyline points={curvePoints('rod')} fill="none" stroke="#a78bfa" strokeWidth="2.5" />

                        {/* Rod-Cone break line at ~10 min */}
                        <line x1={30 + (10 / 30) * 240} y1="25" x2={30 + (10 / 30) * 240} y2="160" stroke="#7c3aed" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
                        <text x={30 + (10 / 30) * 240} y="20" textAnchor="middle" fill="#7c3aed" fontSize="6">Rod-Cone Break</text>

                        {/* Current position indicator */}
                        <line x1={sliderX} y1="25" x2={sliderX} y2="160" stroke="#e2e8f0" strokeWidth="1" opacity="0.4" />
                        <circle cx={sliderX} cy={rodY} r="4" fill="#a78bfa" stroke="white" strokeWidth="1.5" />

                        {/* Legend */}
                        <line x1="200" y1="15" x2="215" y2="15" stroke="#a78bfa" strokeWidth="2.5" />
                        <text x="218" y="18" fill="#a78bfa" fontSize="7">Rods (Scotopic)</text>
                        <line x1="200" y1="8" x2="215" y2="8" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 2" />
                        <text x="218" y="11" fill="#f59e0b" fontSize="7">Cones (Photopic)</text>
                    </svg>

                    {/* Slider */}
                    <div className="mt-4">
                        <input
                            type="range"
                            min="0"
                            max="30"
                            step="1"
                            value={minutes}
                            onChange={e => setMinutes(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                            <span>0 min</span>
                            <span className="text-violet-400 font-bold">{minutes} min</span>
                            <span>30 min</span>
                        </div>
                    </div>

                    {/* Marker chips */}
                    <div className="flex flex-wrap gap-2 mt-3">
                        {markers.map(m => (
                            <button
                                key={m.min}
                                onClick={() => setMinutes(m.min)}
                                className={`text-[10px] px-2 py-1 rounded-full transition-all ${
                                    minutes === m.min
                                        ? 'bg-violet-600 text-white font-bold'
                                        : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                                }`}
                            >
                                {m.min}min — {m.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Status panel */}
                <div className="space-y-4">
                    <div className="bg-slate-900 rounded-xl border border-slate-700 p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <Clock className="text-violet-400" size={16} />
                            <h4 className="font-bold text-white text-sm">@ {minutes} Minutes</h4>
                        </div>
                        <div className={`text-lg font-black mb-2 ${minutes >= 20 ? 'text-violet-400' : minutes >= 10 ? 'text-amber-400' : 'text-slate-300'}`}>
                            {currentMarker.label}
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{currentMarker.desc}</p>
                    </div>

                    {/* Sensitivity bars */}
                    <div className="bg-slate-900 rounded-xl border border-slate-700 p-5 space-y-4">
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-violet-400">Rod Sensitivity</span>
                                <span className="text-xs text-slate-400">{rodSensitivity.toFixed(0)}%</span>
                            </div>
                            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-violet-600 to-violet-400 rounded-full transition-all duration-500"
                                    style={{ width: `${rodSensitivity}%` }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-amber-400">Cone Adaptation</span>
                                <span className="text-xs text-slate-400">{coneSensitivity.toFixed(0)}%</span>
                            </div>
                            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-500"
                                    style={{ width: `${coneSensitivity}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Vision type indicator */}
                    <div className={`rounded-xl border p-5 text-center transition-all duration-500 ${
                        minutes >= 10
                            ? 'bg-violet-500/10 border-violet-500/40'
                            : minutes >= 5
                                ? 'bg-amber-500/10 border-amber-500/40'
                                : 'bg-slate-900 border-slate-700'
                    }`}>
                        <div className="flex items-center justify-center gap-2 mb-2">
                            {minutes >= 10 ? <Moon size={20} className="text-violet-400" /> : <Sun size={20} className="text-amber-400" />}
                            <span className={`text-sm font-black ${minutes >= 10 ? 'text-violet-400' : 'text-amber-400'}`}>
                                {minutes >= 10 ? 'Scotopic Vision' : minutes >= 5 ? 'Mesopic Vision' : 'Photopic Vision'}
                            </span>
                        </div>
                        <p className="text-[10px] text-slate-400">
                            {minutes >= 10
                                ? 'Rod-dominated. No colour. Use off-centre viewing. Avoid bright lights!'
                                : minutes >= 5
                                    ? 'Mixed rod/cone. Reduced colour. Central vision limited.'
                                    : 'Cone-dominated. Full colour. Normal acuity.'
                            }
                        </p>
                    </div>

                    {/* Cockpit tip */}
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                        <p className="text-[10px] text-red-300 font-bold mb-1">⚠ CRITICAL</p>
                        <p className="text-xs text-red-200/80">
                            A single exposure to bright white light (phone, cabin light) <strong>resets dark adaptation to zero</strong>. Use red cockpit lighting to preserve rod sensitivity.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────
   4. Prevention Strategies Accordion
   ───────────────────────────────────────────── */
interface PreventionStrategy {
    title: string;
    icon: React.ReactNode;
    color: string;
    items: string[];
}

const strategies: PreventionStrategy[] = [
    {
        title: 'Instrument Cross-Check',
        icon: <Activity size={16} />,
        color: 'violet',
        items: [
            'Maintain a structured instrument scan (radial or selective).',
            'Attitude Indicator (AI) is the PRIMARY reference in IMC.',
            'Never fixate on a single instrument — "fixation kills."',
            'Use the "1-2-3 check": AI → DG → VSI every 3 seconds.',
            'Trust instruments over body sensations — always.',
        ],
    },
    {
        title: 'Crew Resource Management (CRM)',
        icon: <Plane size={16} />,
        color: 'emerald',
        items: [
            'Brief disorientation risks before flight (night, IMC, long sectors).',
            'Non-flying pilot monitors and calls out unusual attitudes.',
            'Use the challenge: "Check your attitude" without judgement.',
            'If disoriented, transfer control to the non-affected pilot.',
            'Verbalise: "I have The Leans" — breaking the loop.',
        ],
    },
    {
        title: 'Night Flying Precautions',
        icon: <Moon size={16} />,
        color: 'amber',
        items: [
            'Allow 30 minutes dark adaptation before flight.',
            'Use red cockpit lighting to preserve rod sensitivity.',
            'Avoid staring at single lights (autokinesis).',
            'Use off-centre viewing technique for peripheral scan.',
            'Fly instrument approaches even in VMC at night.',
            'Be extra cautious on black hole approaches (over water/desert).',
        ],
    },
    {
        title: 'Physical Countermeasures',
        icon: <Move size={16} />,
        color: 'blue',
        items: [
            'Keep head movements slow and deliberate, especially in turns.',
            'Pre-position charts and equipment within easy reach.',
            'Stay centred in the seat — do NOT lean to "correct" The Leans.',
            'Avoid alcohol within 8-24 hrs (impairs vestibular function).',
            'Manage fatigue — exhaustion amplifies illusion susceptibility.',
            'Stay hydrated and maintain blood sugar levels.',
        ],
    },
    {
        title: 'Technology & Automation',
        icon: <Shield size={16} />,
        color: 'cyan',
        items: [
            'Use autopilot during high-risk phases (night, IMC manoeuvres).',
            'Engage altitude hold before looking away from instruments.',
            'Trust VASI/PAPI for approach path guidance.',
            'Use radar altimeter callouts for terrain awareness.',
            'Flight directors reduce scan workload — use them.',
        ],
    },
    {
        title: 'Recovery Procedure (Unusual Attitude)',
        icon: <AlertTriangle size={16} />,
        color: 'red',
        items: [
            'RECOGNIZE: "I am disoriented" — admit it immediately.',
            'CONFIRM: Check attitude indicator — is it reliable?',
            'RECOVER: Nose-down + Wings-level → then power → then climb.',
            'LEVEL WINGS FIRST before pulling out of a dive (prevents graveyard spiral).',
            'Transfer control if unable to recover within 3 seconds.',
            'After recovery, engage autopilot and stabilise before continuing.',
        ],
    },
];

const colorMap: Record<string, { header: string; border: string; bg: string; icon: string }> = {
    violet: { header: 'text-violet-400', border: 'border-violet-500/30', bg: 'bg-violet-500/5', icon: 'text-violet-400' },
    emerald: { header: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/5', icon: 'text-emerald-400' },
    amber: { header: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/5', icon: 'text-amber-400' },
    blue: { header: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-500/5', icon: 'text-blue-400' },
    cyan: { header: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-500/5', icon: 'text-cyan-400' },
    red: { header: 'text-red-400', border: 'border-red-500/30', bg: 'bg-red-500/5', icon: 'text-red-400' },
};

const PreventionAccordion = () => {
    const [openSections, setOpenSections] = useState<Set<number>>(new Set([0]));

    const toggle = (idx: number) => {
        setOpenSections(prev => {
            const next = new Set(prev);
            if (next.has(idx)) next.delete(idx);
            else next.add(idx);
            return next;
        });
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <Shield className="text-violet-400" size={18} />
                    Prevention Strategies
                </h3>
                <button
                    onClick={() => {
                        if (openSections.size === strategies.length) setOpenSections(new Set());
                        else setOpenSections(new Set(strategies.map((_, i) => i)));
                    }}
                    className="text-[10px] text-violet-400 hover:text-violet-300 font-bold"
                >
                    {openSections.size === strategies.length ? 'Collapse All' : 'Expand All'}
                </button>
            </div>

            {strategies.map((strategy, idx) => {
                const isOpen = openSections.has(idx);
                const colors = colorMap[strategy.color] || colorMap.violet;

                return (
                    <div
                        key={idx}
                        className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                            isOpen ? `${colors.border} ${colors.bg}` : 'border-slate-700 bg-slate-900'
                        }`}
                    >
                        <button
                            className="w-full flex items-center gap-3 p-4 text-left"
                            onClick={() => toggle(idx)}
                        >
                            <div className={`p-1.5 rounded-lg bg-slate-800 ${colors.icon}`}>{strategy.icon}</div>
                            <span className={`font-bold text-sm flex-1 ${isOpen ? colors.header : 'text-white'}`}>
                                {strategy.title}
                            </span>
                            <span className="text-[10px] text-slate-500 mr-2">{strategy.items.length} items</span>
                            <ChevronRight
                                size={14}
                                className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
                            />
                        </button>

                        <div
                            className="overflow-hidden transition-all duration-300"
                            style={{ maxHeight: isOpen ? '500px' : '0px', opacity: isOpen ? 1 : 0 }}
                        >
                            <div className="px-4 pb-4">
                                <ul className="space-y-2">
                                    {strategy.items.map((item, i) => (
                                        <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                                            <span className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                                strategy.color === 'violet' ? 'bg-violet-400' :
                                                strategy.color === 'emerald' ? 'bg-emerald-400' :
                                                strategy.color === 'amber' ? 'bg-amber-400' :
                                                strategy.color === 'blue' ? 'bg-blue-400' :
                                                strategy.color === 'cyan' ? 'bg-cyan-400' :
                                                'bg-red-400'
                                            }`} />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Summary callout */}
            <div className="mt-6 p-4 bg-violet-500/10 border border-violet-500/30 rounded-xl">
                <div className="flex items-start gap-3">
                    <Info size={16} className="text-violet-400 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="text-xs text-violet-300 font-bold mb-1">Golden Rule of Disorientation</p>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            <strong className="text-white">Trust your instruments, not your senses.</strong> The vestibular system evolved for
                            walking on Earth, not flying in clouds. Every illusion described above exploits the same fundamental mismatch
                            between biological sensors and the flight environment. Instrument proficiency and CRM are your best defences.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HPLDisorientation;
