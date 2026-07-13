import React, { useState, useEffect, useCallback } from 'react';
import {
    Gauge, Layers, Brain, AlertTriangle, CheckCircle, Timer,
    ChevronDown, ChevronRight, Plane, Radio, CloudLightning,
    Wrench, Users, MapPin, BatteryLow, GraduationCap, Cpu,
    ToggleLeft, ToggleRight, Activity, Shield, Eye, ZapOff, Zap,
    ArrowDown, ArrowUp
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────
interface DemandItem {
    id: string;
    label: string;
    icon: React.FC<any>;
    weight: number;
    active: boolean;
    color: string;
}

interface PhaseInfo {
    id: string;
    label: string;
    shortLabel: string;
    workload: number;
    sterile: boolean;
    tasks: string[];
    drivers: string[];
}

interface StrategyItem {
    id: string;
    title: string;
    icon: React.FC<any>;
    color: string;
    summary: string;
    details: string[];
    scenario: string;
}

// ─── Data ───────────────────────────────────────────────────────
const DEMAND_ITEMS: DemandItem[] = [
    { id: 'atc', label: 'ATC Instruction', icon: Radio, weight: 20, active: false, color: 'sky' },
    { id: 'weather', label: 'Weather Change', icon: CloudLightning, weight: 25, active: false, color: 'amber' },
    { id: 'failure', label: 'System Failure', icon: Wrench, weight: 35, active: false, color: 'red' },
    { id: 'pax', label: 'Passenger Issue', icon: Users, weight: 15, active: false, color: 'purple' },
    { id: 'nav', label: 'Navigation Update', icon: MapPin, weight: 18, active: false, color: 'emerald' },
];

const PHASES: PhaseInfo[] = [
    {
        id: 'taxi', label: 'Taxi', shortLabel: 'TAXI', workload: 35, sterile: false,
        tasks: ['Taxi clearance readback', 'Before-takeoff checklist', 'Flight controls check', 'Transponder set'],
        drivers: ['Airport complexity', 'Visibility conditions', 'Runway crossings'],
    },
    {
        id: 'takeoff', label: 'Takeoff', shortLabel: 'T/O', workload: 90, sterile: true,
        tasks: ['Thrust setting', 'V-speed callouts', 'Rotation & liftoff', 'Positive climb confirmation'],
        drivers: ['Crosswind', 'Engine failure drills', 'Noise abatement procedures'],
    },
    {
        id: 'climb', label: 'Climb', shortLabel: 'CLB', workload: 70, sterile: true,
        tasks: ['Gear & flap retraction', 'After-takeoff checklist', 'ATC departure frequency', 'Altitude constraints'],
        drivers: ['SID complexity', 'Traffic density', 'Speed restrictions below 10,000ft'],
    },
    {
        id: 'cruise', label: 'Cruise', shortLabel: 'CRZ', workload: 25, sterile: false,
        tasks: ['Fuel monitoring', 'Weather updates', 'Position reports (oceanic)', 'Passenger services'],
        drivers: ['Route length', 'Turbulence', 'RVSM monitoring'],
    },
    {
        id: 'descent', label: 'Descent', shortLabel: 'DES', workload: 55, sterile: false,
        tasks: ['ATIS/METAR review', 'Approach briefing', 'Descent checklist', 'Speed management'],
        drivers: ['STAR complexity', 'Sequencing delays', 'Weather at destination'],
    },
    {
        id: 'approach', label: 'Approach', shortLabel: 'APP', workload: 80, sterile: true,
        tasks: ['Localizer/glideslope capture', 'Landing checklist', 'Speed & configuration', 'Minima callouts'],
        drivers: ['Approach type (ILS/VOR/RNAV)', 'Visibility', 'Wind conditions'],
    },
    {
        id: 'landing', label: 'Landing', shortLabel: 'LDG', workload: 85, sterile: true,
        tasks: ['Flare & touchdown', 'Reverse thrust', 'Braking & deceleration', 'Runway vacating'],
        drivers: ['Crosswind', 'Runway condition', 'Stopping distance'],
    },
];

const STRATEGIES: StrategyItem[] = [
    {
        id: 'prioritize',
        title: 'Prioritization — Aviate, Navigate, Communicate',
        icon: Shield,
        color: 'red',
        summary: 'The fundamental priority hierarchy for all pilots under workload.',
        details: [
            '1. AVIATE — Fly the aircraft first. Maintain attitude, altitude, and airspeed.',
            '2. NAVIGATE — Know where you are and where you are going. Follow the flight plan.',
            '3. COMMUNICATE — Talk to ATC only when the first two are secure. Say "Stand by" if saturated.',
        ],
        scenario: 'Engine fire during climb: First maintain aircraft control (Aviate), then turn toward a suitable airport (Navigate), then declare MAYDAY (Communicate).',
    },
    {
        id: 'shedding',
        title: 'Task Shedding',
        icon: ZapOff,
        color: 'amber',
        summary: 'Deliberately dropping lower-priority tasks to focus on what matters most.',
        details: [
            'Identify non-essential tasks and defer them.',
            'Use the "kill list" — tasks you\'re allowed to skip under high workload.',
            'Example: Stop position reports during an emergency; ATC can radar-identify you.',
            'Deferred tasks must be revisited once workload decreases.',
        ],
        scenario: 'Hydraulic failure on approach: Shed cabin PA announcements and fuel log updates to focus on the QRH procedure and aircraft handling.',
    },
    {
        id: 'delegation',
        title: 'Delegation',
        icon: Users,
        color: 'sky',
        summary: 'Distribute tasks among crew members based on roles and capacity.',
        details: [
            'PF (Pilot Flying) focuses on aircraft control.',
            'PM (Pilot Monitoring) handles checklists, communication, and monitoring.',
            'Use clear task assignments: "You fly, I\'ll run the checklist."',
            'Confirm task ownership — never assume the other pilot has it.',
        ],
        scenario: 'TCAS RA during approach: PF follows TCAS guidance, PM communicates with ATC and monitors traffic.',
    },
    {
        id: 'automation',
        title: 'Automation Use',
        icon: Cpu,
        color: 'emerald',
        summary: 'Engage autopilot and autothrust to reduce manual flying workload.',
        details: [
            'Engage AP/AT during high-workload phases to free mental capacity.',
            'Use managed modes (LNAV/VNAV) for lateral and vertical navigation.',
            'Caution: Monitor automation — don\'t become complacent ("automation surprise").',
            'Know when to disconnect: hand-fly if automation creates confusion.',
        ],
        scenario: 'Weather diversion during cruise: Engage autopilot to follow the new route while you and the PM brief the alternate approach.',
    },
    {
        id: 'briefing',
        title: 'Briefing & Preparation',
        icon: GraduationCap,
        color: 'purple',
        summary: 'Anticipate workload peaks and prepare in advance to stay ahead of the aircraft.',
        details: [
            'Brief approaches and emergencies during low-workload cruise phase.',
            '"What if" planning: review options before they\'re needed.',
            'Pre-set frequencies, altitudes, and speeds before entering high-workload phases.',
            'Use quiet moments to review NOTAMs, weather, and fuel status.',
        ],
        scenario: 'Long cruise before complex STAR: Brief the arrival, set up the FMC, and discuss contingencies while workload is low.',
    },
];

// ─── Helper Components ──────────────────────────────────────────

const TabButton = ({ active, onClick, icon: Icon, label }: any) => (
    <button
        onClick={onClick}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-2 rounded-md transition-all font-medium text-sm ${active
            ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/30'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
    >
        <Icon size={18} />
        <span className="hidden sm:inline">{label}</span>
    </button>
);

// ─── Section 1: Demand / Capacity Model ─────────────────────────

const DemandCapacityModel = () => {
    const [demands, setDemands] = useState<DemandItem[]>(DEMAND_ITEMS);
    const [fatigue, setFatigue] = useState(30);
    const [experience, setExperience] = useState(70);
    const [automation, setAutomation] = useState(50);
    const [pulseOverload, setPulseOverload] = useState(false);

    const totalDemand = demands.filter(d => d.active).reduce((sum, d) => sum + d.weight, 0);
    const baseCapacity = 100;
    const capacityMod = (experience * 0.4) + (automation * 0.3) - (fatigue * 0.3);
    const totalCapacity = Math.round(Math.max(20, Math.min(130, baseCapacity + capacityMod - 50)));
    const isOverloaded = totalDemand > totalCapacity;
    const loadRatio = totalCapacity > 0 ? totalDemand / totalCapacity : 999;

    useEffect(() => {
        if (!isOverloaded) { setPulseOverload(false); return; }
        const iv = setInterval(() => setPulseOverload(p => !p), 600);
        return () => clearInterval(iv);
    }, [isOverloaded]);

    const toggleDemand = (id: string) => {
        setDemands(prev => prev.map(d => d.id === id ? { ...d, active: !d.active } : d));
    };

    const demandBarMax = Math.max(totalDemand, totalCapacity, 100);

    const colorForDemand = (c: string) => {
        const m: Record<string, string> = { sky: 'bg-sky-500', amber: 'bg-amber-500', red: 'bg-red-500', purple: 'bg-purple-500', emerald: 'bg-emerald-500' };
        return m[c] || 'bg-slate-500';
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white text-center">Workload Demand / Capacity Model</h3>
            <p className="text-slate-400 text-sm text-center max-w-2xl mx-auto">
                Toggle task demands and adjust capacity modifiers. When total demand exceeds available capacity the pilot enters <span className="text-red-400 font-semibold">task saturation</span> — errors, tunnel vision, and omissions become likely.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Demand toggles */}
                <div className="bg-slate-900 p-5 rounded-xl">
                    <h4 className="font-bold text-white mb-4 flex items-center gap-2"><ArrowUp size={16} className="text-red-400" /> Task Demands</h4>
                    <div className="space-y-2">
                        {demands.map(d => {
                            const Icon = d.icon;
                            return (
                                <button
                                    key={d.id}
                                    onClick={() => toggleDemand(d.id)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${d.active
                                        ? `border-${d.color}-500/60 bg-${d.color}-900/30`
                                        : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                                        }`}
                                >
                                    <Icon size={18} className={d.active ? `text-${d.color}-400` : 'text-slate-500'} />
                                    <span className={`flex-1 font-medium text-sm ${d.active ? 'text-white' : 'text-slate-400'}`}>{d.label}</span>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${d.active ? 'bg-red-500/30 text-red-300' : 'bg-slate-700 text-slate-500'}`}>+{d.weight}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Capacity sliders */}
                <div className="bg-slate-900 p-5 rounded-xl">
                    <h4 className="font-bold text-white mb-4 flex items-center gap-2"><ArrowDown size={16} className="text-emerald-400" /> Capacity Modifiers</h4>
                    {[
                        { label: 'Fatigue Level', value: fatigue, set: setFatigue, icon: BatteryLow, note: 'Higher = less capacity', invert: true },
                        { label: 'Experience', value: experience, set: setExperience, icon: GraduationCap, note: 'Higher = more capacity', invert: false },
                        { label: 'Automation', value: automation, set: setAutomation, icon: Cpu, note: 'Higher = more capacity', invert: false },
                    ].map(s => {
                        const SIcon = s.icon;
                        return (
                            <div key={s.label} className="mb-5">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm text-slate-300 flex items-center gap-2"><SIcon size={14} className="text-slate-500" />{s.label}</span>
                                    <span className="text-xs text-slate-500">{s.value}%</span>
                                </div>
                                <input type="range" min={0} max={100} value={s.value} onChange={e => s.set(Number(e.target.value))} className="w-full accent-sky-500 h-2" />
                                <span className="text-[10px] text-slate-600">{s.note}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Bar comparison */}
            <div className="bg-slate-900 p-5 rounded-xl">
                <div className="grid grid-cols-2 gap-6">
                    {/* Demand bar */}
                    <div>
                        <div className="text-sm text-slate-400 mb-2">Total Demand</div>
                        <div className="h-8 bg-slate-800 rounded-full overflow-hidden relative">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${isOverloaded ? 'bg-red-500' : 'bg-sky-500'}`}
                                style={{ width: `${Math.min(100, (totalDemand / demandBarMax) * 100)}%` }}
                            />
                            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow">{totalDemand}</span>
                        </div>
                        {/* Stacked mini-bars for active demands */}
                        <div className="flex gap-0.5 mt-2 h-3 rounded overflow-hidden">
                            {demands.filter(d => d.active).map(d => (
                                <div key={d.id} className={`${colorForDemand(d.color)} transition-all`} style={{ flex: d.weight }} title={`${d.label}: ${d.weight}`} />
                            ))}
                            {demands.filter(d => d.active).length === 0 && <div className="flex-1 bg-slate-700" />}
                        </div>
                    </div>
                    {/* Capacity bar */}
                    <div>
                        <div className="text-sm text-slate-400 mb-2">Available Capacity</div>
                        <div className="h-8 bg-slate-800 rounded-full overflow-hidden relative">
                            <div
                                className="h-full rounded-full transition-all duration-500 bg-emerald-500"
                                style={{ width: `${Math.min(100, (totalCapacity / demandBarMax) * 100)}%` }}
                            />
                            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow">{totalCapacity}</span>
                        </div>
                        <div className="flex gap-1 mt-2 text-[10px] text-slate-500 justify-between">
                            <span>Fatigue −{Math.round(fatigue * 0.3)}</span>
                            <span>Exp +{Math.round(experience * 0.4)}</span>
                            <span>Auto +{Math.round(automation * 0.3)}</span>
                        </div>
                    </div>
                </div>

                {/* Overload warning */}
                {isOverloaded && (
                    <div className={`mt-4 p-4 rounded-xl border-2 text-center transition-all ${pulseOverload ? 'border-red-500 bg-red-900/40' : 'border-red-700 bg-red-900/20'}`}>
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <AlertTriangle className="text-red-400" size={20} />
                            <span className="text-red-300 font-black text-lg tracking-wider">⚠ OVERLOAD ⚠</span>
                            <AlertTriangle className="text-red-400" size={20} />
                        </div>
                        <p className="text-red-200 text-sm">
                            Demand ({totalDemand}) exceeds capacity ({totalCapacity}) by <strong>{totalDemand - totalCapacity}</strong> units.
                            Task shedding, delegation, or automation increase required.
                        </p>
                    </div>
                )}
                {!isOverloaded && totalDemand > 0 && (
                    <div className="mt-4 p-3 rounded-lg bg-emerald-900/20 border border-emerald-500/30 text-center">
                        <CheckCircle className="inline text-emerald-400 mr-2" size={16} />
                        <span className="text-emerald-300 text-sm font-medium">Workload within capacity — {Math.round((1 - loadRatio) * 100)}% margin remaining</span>
                    </div>
                )}
            </div>
        </div>
    );
};

// ─── Section 2: Phase of Flight Workload Curve ──────────────────

const PhaseOfFlightCurve = () => {
    const [activePhase, setActivePhase] = useState<string | null>(null);

    const svgW = 700;
    const svgH = 300;
    const padL = 50;
    const padR = 20;
    const padT = 30;
    const padB = 60;
    const chartW = svgW - padL - padR;
    const chartH = svgH - padT - padB;

    const points = PHASES.map((p, i) => {
        const x = padL + (chartW / (PHASES.length - 1)) * i;
        const y = padT + chartH - (p.workload / 100) * chartH;
        return { x, y, phase: p };
    });

    const linePath = points.map((pt, i) => {
        if (i === 0) return `M ${pt.x} ${pt.y}`;
        const prev = points[i - 1];
        const cpx1 = prev.x + (pt.x - prev.x) * 0.4;
        const cpx2 = pt.x - (pt.x - prev.x) * 0.4;
        return `C ${cpx1} ${prev.y}, ${cpx2} ${pt.y}, ${pt.x} ${pt.y}`;
    }).join(' ');

    const areaPath = linePath + ` L ${points[points.length - 1].x} ${padT + chartH} L ${points[0].x} ${padT + chartH} Z`;

    const selected = PHASES.find(p => p.id === activePhase);

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white text-center">Phase of Flight — Workload Curve</h3>
            <p className="text-slate-400 text-sm text-center max-w-2xl mx-auto">
                Click or hover on each flight phase to see typical tasks and workload drivers.
                Phases highlighted in <span className="text-amber-400 font-semibold">amber</span> are <strong>sterile cockpit</strong> phases (below 10,000 ft) where non-essential conversation and activities are prohibited.
            </p>

            {/* SVG Chart */}
            <div className="bg-slate-900 p-4 rounded-xl overflow-x-auto">
                <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto" style={{ minWidth: 500 }}>
                    {/* Grid lines */}
                    {[0, 25, 50, 75, 100].map(v => {
                        const gy = padT + chartH - (v / 100) * chartH;
                        return (
                            <g key={v}>
                                <line x1={padL} y1={gy} x2={svgW - padR} y2={gy} stroke="#334155" strokeWidth={0.5} strokeDasharray={v === 0 ? '0' : '4 4'} />
                                <text x={padL - 8} y={gy + 4} textAnchor="end" fill="#64748b" fontSize={10}>{v}%</text>
                            </g>
                        );
                    })}

                    {/* Y-axis label */}
                    <text x={14} y={svgH / 2} textAnchor="middle" fill="#94a3b8" fontSize={11} transform={`rotate(-90, 14, ${svgH / 2})`}>Workload</text>

                    {/* Sterile cockpit zones (highlight behind curve) */}
                    {points.map((pt, i) => {
                        if (!pt.phase.sterile) return null;
                        const halfGap = (chartW / (PHASES.length - 1)) * 0.48;
                        return (
                            <rect key={`st-${i}`} x={pt.x - halfGap} y={padT} width={halfGap * 2} height={chartH}
                                fill="#f59e0b" opacity={0.06} rx={4} />
                        );
                    })}

                    {/* Gradient fill */}
                    <defs>
                        <linearGradient id="wlGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.35} />
                            <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.02} />
                        </linearGradient>
                    </defs>
                    <path d={areaPath} fill="url(#wlGrad)" />

                    {/* Curve line */}
                    <path d={linePath} fill="none" stroke="#0ea5e9" strokeWidth={2.5} strokeLinejoin="round" />

                    {/* Data points & labels */}
                    {points.map((pt, i) => {
                        const isActive = activePhase === pt.phase.id;
                        const isSterile = pt.phase.sterile;
                        return (
                            <g key={pt.phase.id}
                                onMouseEnter={() => setActivePhase(pt.phase.id)}
                                onClick={() => setActivePhase(prev => prev === pt.phase.id ? null : pt.phase.id)}
                                className="cursor-pointer"
                            >
                                {/* Hit area */}
                                <rect x={pt.x - 30} y={padT} width={60} height={chartH + padB} fill="transparent" />

                                {/* Dot */}
                                <circle cx={pt.x} cy={pt.y} r={isActive ? 7 : 5}
                                    fill={isSterile ? '#f59e0b' : '#0ea5e9'}
                                    stroke={isActive ? '#fff' : 'none'} strokeWidth={2}
                                    className="transition-all duration-200"
                                />

                                {/* Workload value */}
                                <text x={pt.x} y={pt.y - 12} textAnchor="middle" fill={isActive ? '#fff' : '#94a3b8'} fontSize={isActive ? 12 : 10} fontWeight={isActive ? 700 : 400}>
                                    {pt.phase.workload}%
                                </text>

                                {/* Phase label */}
                                <text x={pt.x} y={padT + chartH + 18} textAnchor="middle" fill={isActive ? '#fff' : isSterile ? '#fbbf24' : '#94a3b8'} fontSize={11} fontWeight={isActive ? 700 : 500}>
                                    {pt.phase.shortLabel}
                                </text>
                                {isSterile && (
                                    <text x={pt.x} y={padT + chartH + 32} textAnchor="middle" fill="#d97706" fontSize={8}>STERILE</text>
                                )}
                            </g>
                        );
                    })}
                </svg>
            </div>

            {/* Phase detail card */}
            {selected && (
                <div className={`p-5 rounded-xl border transition-all ${selected.sterile ? 'border-amber-500/40 bg-amber-900/10' : 'border-sky-500/40 bg-sky-900/10'}`}>
                    <div className="flex items-center gap-3 mb-3">
                        <Plane size={20} className={selected.sterile ? 'text-amber-400' : 'text-sky-400'} />
                        <h4 className="font-bold text-white text-lg">{selected.label} Phase</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${selected.workload >= 80 ? 'bg-red-500/30 text-red-300' : selected.workload >= 50 ? 'bg-amber-500/30 text-amber-300' : 'bg-emerald-500/30 text-emerald-300'}`}>
                            {selected.workload}% Workload
                        </span>
                        {selected.sterile && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-300 font-bold">Sterile Cockpit</span>
                        )}
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <h5 className="text-sm font-semibold text-slate-300 mb-2">Typical Tasks</h5>
                            <ul className="space-y-1">
                                {selected.tasks.map((t, i) => (
                                    <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                                        <CheckCircle size={14} className="text-sky-500 mt-0.5 shrink-0" />{t}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h5 className="text-sm font-semibold text-slate-300 mb-2">Workload Drivers</h5>
                            <ul className="space-y-1">
                                {selected.drivers.map((d, i) => (
                                    <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                                        <Activity size={14} className="text-amber-500 mt-0.5 shrink-0" />{d}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── Section 3: Workload Management Strategies (Accordion) ──────

const ManagementStrategiesAccordion = () => {
    const [openId, setOpenId] = useState<string | null>(null);

    const toggle = (id: string) => setOpenId(prev => prev === id ? null : id);

    const borderColor = (c: string) => {
        const m: Record<string, string> = { red: 'border-red-500/40', amber: 'border-amber-500/40', sky: 'border-sky-500/40', emerald: 'border-emerald-500/40', purple: 'border-purple-500/40' };
        return m[c] || 'border-slate-700';
    };
    const bgColor = (c: string) => {
        const m: Record<string, string> = { red: 'bg-red-900/10', amber: 'bg-amber-900/10', sky: 'bg-sky-900/10', emerald: 'bg-emerald-900/10', purple: 'bg-purple-900/10' };
        return m[c] || 'bg-slate-900/50';
    };
    const iconColor = (c: string) => {
        const m: Record<string, string> = { red: 'text-red-400', amber: 'text-amber-400', sky: 'text-sky-400', emerald: 'text-emerald-400', purple: 'text-purple-400' };
        return m[c] || 'text-slate-400';
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white text-center">Workload Management Strategies</h3>
            <p className="text-slate-400 text-sm text-center max-w-2xl mx-auto">
                Click each strategy to expand with detailed guidance and real aviation scenarios.
            </p>

            <div className="space-y-3">
                {STRATEGIES.map(s => {
                    const isOpen = openId === s.id;
                    const SIcon = s.icon;
                    return (
                        <div key={s.id} className={`rounded-xl border transition-all ${isOpen ? borderColor(s.color) : 'border-slate-700'} ${isOpen ? bgColor(s.color) : 'bg-slate-900/50'}`}>
                            <button
                                onClick={() => toggle(s.id)}
                                className="w-full flex items-center gap-3 p-4 text-left"
                            >
                                <SIcon size={20} className={iconColor(s.color)} />
                                <div className="flex-1">
                                    <div className="font-bold text-white text-sm">{s.title}</div>
                                    <div className="text-xs text-slate-500 mt-0.5">{s.summary}</div>
                                </div>
                                {isOpen
                                    ? <ChevronDown size={18} className="text-slate-400" />
                                    : <ChevronRight size={18} className="text-slate-500" />
                                }
                            </button>
                            {isOpen && (
                                <div className="px-4 pb-5 space-y-4 animate-in fade-in">
                                    <ul className="space-y-2 pl-2">
                                        {s.details.map((d, i) => (
                                            <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                                <CheckCircle size={14} className={`${iconColor(s.color)} mt-0.5 shrink-0`} />
                                                {d}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                                        <div className="text-xs text-slate-500 uppercase font-bold mb-1 flex items-center gap-1">
                                            <Plane size={12} /> Aviation Scenario
                                        </div>
                                        <p className="text-sm text-slate-300 italic">"{s.scenario}"</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* DODAR framework preserved from original */}
            <div className="bg-orange-900/20 border border-orange-500/30 p-6 rounded-xl">
                <h4 className="font-bold text-orange-300 mb-4">DODAR Decision Framework</h4>
                <div className="grid grid-cols-5 gap-3">
                    {[
                        { letter: 'D', word: 'Diagnose', desc: 'What is the problem?' },
                        { letter: 'O', word: 'Options', desc: 'What can we do?' },
                        { letter: 'D', word: 'Decide', desc: 'Which option best?' },
                        { letter: 'A', word: 'Assign', desc: 'Who does what?' },
                        { letter: 'R', word: 'Review', desc: 'Is it working?' },
                    ].map((step, i) => (
                        <div key={i} className="text-center">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500/30 rounded-full flex items-center justify-center mx-auto mb-2">
                                <span className="text-lg sm:text-xl font-black text-orange-300">{step.letter}</span>
                            </div>
                            <div className="font-bold text-white text-xs sm:text-sm">{step.word}</div>
                            <p className="text-[10px] sm:text-xs text-slate-400">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// ─── Section 4: Underload vs Overload Comparison Toggle ─────────

const UnderloadOverloadToggle = () => {
    const [showOverload, setShowOverload] = useState(true);

    const overloadData = {
        title: 'Overload (Task Saturation)',
        icon: Zap,
        color: 'red',
        symptoms: [
            'Tunnel vision — fixating on one task and ignoring others',
            'Channelized attention — losing situational awareness',
            'Task shedding — unconsciously dropping tasks',
            'Rushed or incomplete checklists',
            'Breakdown in crew communication',
            'Increased error rate and missed callouts',
        ],
        risks: [
            'Controlled Flight Into Terrain (CFIT)',
            'Loss of separation — TCAS alerts',
            'Runway incursions',
            'Incorrect configuration (flaps/gear)',
            'Fuel mismanagement',
        ],
        examples: [
            'Engine failure during single-pilot IFR approach in IMC',
            'Multiple system failures combined with severe weather',
            'Go-around with configuration change, wind shear, and ATC re-routing',
            'Eastern Airlines Flight 401 — crew fixated on landing gear indicator, flew into the Everglades',
        ],
    };

    const underloadData = {
        title: 'Underload (Complacency)',
        icon: Eye,
        color: 'amber',
        symptoms: [
            'Vigilance decrement — "zoning out" during long cruise',
            'Mind wandering and daydreaming',
            'Slow reaction to system changes or alerts',
            'Automation complacency — over-trusting autopilot',
            'Boredom and reduced motivation',
            'Loss of situational awareness over time',
        ],
        risks: [
            'Missed radio calls or ATC instructions',
            'Altitude or heading deviations',
            'Failure to notice weather changes',
            'CFIT during "routine" approaches',
            'Fuel exhaustion from inattentive monitoring',
        ],
        examples: [
            'Long oceanic cruise with full automation — pilot microsleep',
            'Repetitive short-haul flights leading to complacent approaches',
            'Clear weather day with no ATC interaction for extended periods',
            'Air France Flight 447 — crew slow to recognize stall during automated cruise',
        ],
    };

    const data = showOverload ? overloadData : underloadData;
    const DataIcon = data.icon;
    const accent = showOverload ? 'red' : 'amber';

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white text-center">Underload vs Overload</h3>
            <p className="text-slate-400 text-sm text-center max-w-2xl mx-auto">
                Both extremes of workload degrade performance. Toggle between the two to compare symptoms, risks, and real-world examples.
            </p>

            {/* Toggle */}
            <div className="flex justify-center">
                <div className="inline-flex bg-slate-900 rounded-full p-1 border border-slate-700">
                    <button
                        onClick={() => setShowOverload(false)}
                        className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${!showOverload ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <Eye size={14} className="inline mr-1.5 -mt-0.5" />Underload
                    </button>
                    <button
                        onClick={() => setShowOverload(true)}
                        className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${showOverload ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <Zap size={14} className="inline mr-1.5 -mt-0.5" />Overload
                    </button>
                </div>
            </div>

            {/* Content card */}
            <div className={`p-6 rounded-xl border transition-all ${accent === 'red' ? 'border-red-500/40 bg-red-900/10' : 'border-amber-500/40 bg-amber-900/10'}`}>
                <div className="flex items-center gap-3 mb-5">
                    <DataIcon size={24} className={accent === 'red' ? 'text-red-400' : 'text-amber-400'} />
                    <h4 className="text-lg font-bold text-white">{data.title}</h4>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Symptoms */}
                    <div>
                        <h5 className={`text-sm font-bold mb-3 ${accent === 'red' ? 'text-red-300' : 'text-amber-300'}`}>Symptoms</h5>
                        <ul className="space-y-2">
                            {data.symptoms.map((s, i) => (
                                <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                    <AlertTriangle size={13} className={`${accent === 'red' ? 'text-red-500' : 'text-amber-500'} mt-0.5 shrink-0`} />
                                    {s}
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Risks */}
                    <div>
                        <h5 className={`text-sm font-bold mb-3 ${accent === 'red' ? 'text-red-300' : 'text-amber-300'}`}>Risks</h5>
                        <ul className="space-y-2">
                            {data.risks.map((r, i) => (
                                <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                    <Shield size={13} className={`${accent === 'red' ? 'text-red-500' : 'text-amber-500'} mt-0.5 shrink-0`} />
                                    {r}
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Examples */}
                    <div>
                        <h5 className={`text-sm font-bold mb-3 ${accent === 'red' ? 'text-red-300' : 'text-amber-300'}`}>Real-World Examples</h5>
                        <ul className="space-y-2">
                            {data.examples.map((ex, i) => (
                                <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                                    <Plane size={13} className="text-slate-600 mt-0.5 shrink-0" />
                                    <span className="italic">{ex}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Yerkes-Dodson summary preserved from original */}
            <div className="bg-slate-900 p-5 rounded-xl">
                <h4 className="font-bold text-white mb-3 text-center">Yerkes-Dodson Law — The Inverted U</h4>
                <p className="text-slate-400 text-sm text-center mb-4 max-w-xl mx-auto">
                    Performance follows an inverted-U relationship with workload/arousal.
                    Too little OR too much demand leads to degraded performance.
                    The optimal zone lies in the middle where the pilot is engaged and alert.
                </p>
                <div className="relative h-40">
                    <div className="absolute inset-0 flex items-end gap-0.5">
                        {Array.from({ length: 20 }, (_, i) => {
                            const x = (i + 1) * 5;
                            const perf = x <= 50 ? x * 2 : 200 - x * 2;
                            const height = Math.max(2, Math.min(100, perf));
                            return (
                                <div
                                    key={i}
                                    className={`flex-1 rounded-t transition-all ${x <= 25 ? 'bg-amber-500/40' : x <= 75 ? 'bg-emerald-500/40' : 'bg-red-500/40'}`}
                                    style={{ height: `${height}%` }}
                                />
                            );
                        })}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-slate-500 border-t border-slate-700 pt-1">
                        <span>Underload</span>
                        <span className="text-emerald-400 font-bold">Optimal</span>
                        <span>Overload</span>
                    </div>
                </div>
                <div className="text-[10px] text-slate-600 text-center mt-2">↑ Performance</div>
            </div>
        </div>
    );
};

// ─── Section 5: Prioritization Game (preserved from original) ──

const PrioritizationGame = () => {
    const [gameState, setGameState] = useState<'ready' | 'playing' | 'results'>('ready');
    const [currentTask, setCurrentTask] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);

    const scenarios = [
        {
            situation: 'Engine fire warning light illuminates during cruise',
            options: [
                { text: 'Inform ATC', priority: 3 },
                { text: 'Run engine fire checklist', priority: 1 },
                { text: 'Turn toward nearest suitable airport', priority: 2 },
            ]
        },
        {
            situation: 'TCAS RA "DESCEND" command received',
            options: [
                { text: 'Follow TCAS guidance immediately', priority: 1 },
                { text: 'Inform ATC of TCAS RA', priority: 2 },
                { text: 'Check visual for traffic', priority: 3 },
            ]
        },
        {
            situation: 'Windshear warning on short final',
            options: [
                { text: 'Advise tower of go-around', priority: 3 },
                { text: 'Execute go-around procedure', priority: 1 },
                { text: 'Apply TOGA and rotate', priority: 2 },
            ]
        },
    ];

    useEffect(() => {
        if (gameState === 'playing' && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && gameState === 'playing') {
            setGameState('results');
        }
    }, [timeLeft, gameState]);

    const handleAnswer = (priority: number) => {
        if (priority === 1) {
            setScore(s => s + 10);
        } else if (priority === 2) {
            setScore(s => s + 5);
        }

        if (currentTask < scenarios.length - 1) {
            setCurrentTask(t => t + 1);
        } else {
            setGameState('results');
        }
    };

    const startGame = () => {
        setGameState('playing');
        setCurrentTask(0);
        setScore(0);
        setTimeLeft(30);
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white text-center">Task Prioritization Trainer</h3>

            {gameState === 'ready' && (
                <div className="text-center py-12">
                    <div className="text-6xl mb-6">🎮</div>
                    <h4 className="text-xl font-bold text-white mb-4">Quick Decision Trainer</h4>
                    <p className="text-slate-400 mb-6 max-w-md mx-auto">
                        You'll be presented with emergency scenarios. Choose the FIRST priority action as fast as possible.
                    </p>
                    <button
                        onClick={startGame}
                        className="px-8 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl transition-all"
                    >
                        Start Training
                    </button>
                </div>
            )}

            {gameState === 'playing' && (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <div className="text-sm text-slate-400">
                            Scenario {currentTask + 1} of {scenarios.length}
                        </div>
                        <div className={`font-mono font-bold ${timeLeft < 10 ? 'text-red-400' : 'text-white'}`}>
                            {timeLeft}s
                        </div>
                        <div className="text-sm text-emerald-400">
                            Score: {score}
                        </div>
                    </div>

                    <div className="bg-red-900/30 border border-red-500/50 p-6 rounded-xl mb-6">
                        <div className="flex items-center gap-3 mb-3">
                            <AlertTriangle className="text-red-400" />
                            <span className="text-sm text-red-300 uppercase font-bold">Emergency Scenario</span>
                        </div>
                        <p className="text-xl text-white font-bold">
                            {scenarios[currentTask].situation}
                        </p>
                    </div>

                    <p className="text-slate-400 text-center mb-4">What is your FIRST priority?</p>

                    <div className="space-y-3">
                        {scenarios[currentTask].options
                            .sort(() => Math.random() - 0.5)
                            .map((opt, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleAnswer(opt.priority)}
                                    className="w-full p-4 bg-slate-900 hover:bg-slate-700 border border-slate-700 hover:border-sky-500/50 rounded-xl text-left text-white transition-all"
                                >
                                    {opt.text}
                                </button>
                            ))
                        }
                    </div>
                </div>
            )}

            {gameState === 'results' && (
                <div className="text-center py-12">
                    <div className="text-6xl mb-6">
                        {score >= 25 ? '🏆' : score >= 15 ? '✅' : '📚'}
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-2">
                        {score >= 25 ? 'Excellent!' : score >= 15 ? 'Good Job!' : 'Keep Practicing'}
                    </h4>
                    <p className="text-4xl font-black text-sky-400 mb-4">{score} points</p>
                    <p className="text-slate-400 mb-6">
                        {score >= 25
                            ? 'You have strong prioritization instincts!'
                            : 'Remember: AVIATE first, then NAVIGATE, then COMMUNICATE'}
                    </p>
                    <button
                        onClick={startGame}
                        className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all"
                    >
                        Try Again
                    </button>
                </div>
            )}
        </div>
    );
};

// ─── Main Component ─────────────────────────────────────────────

const HPLWorkload: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'demand' | 'curve' | 'strategies' | 'comparison' | 'game'>('demand');

    return (
        <div className="space-y-6">
            <header className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-sky-500/20 rounded-lg">
                        <Gauge className="w-6 h-6 text-sky-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-100">Workload Management</h1>
                </div>
                <p className="text-slate-400">
                    Understanding task saturation, workload curves, and prioritization strategies for optimal performance.
                </p>
            </header>

            <div className="flex gap-1.5 bg-slate-800/50 p-1 rounded-lg overflow-x-auto">
                <TabButton active={activeTab === 'demand'} onClick={() => setActiveTab('demand')} icon={Layers} label="Demand Model" />
                <TabButton active={activeTab === 'curve'} onClick={() => setActiveTab('curve')} icon={Activity} label="Flight Phases" />
                <TabButton active={activeTab === 'strategies'} onClick={() => setActiveTab('strategies')} icon={Brain} label="Strategies" />
                <TabButton active={activeTab === 'comparison'} onClick={() => setActiveTab('comparison')} icon={Gauge} label="Under/Overload" />
                <TabButton active={activeTab === 'game'} onClick={() => setActiveTab('game')} icon={Timer} label="Trainer" />
            </div>

            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 min-h-[400px]">
                {activeTab === 'demand' && <DemandCapacityModel />}
                {activeTab === 'curve' && <PhaseOfFlightCurve />}
                {activeTab === 'strategies' && <ManagementStrategiesAccordion />}
                {activeTab === 'comparison' && <UnderloadOverloadToggle />}
                {activeTab === 'game' && <PrioritizationGame />}
            </div>
        </div>
    );
};

export default HPLWorkload;
