import React, { useState } from 'react';
import { Ruler, Monitor, Armchair, Eye, Lightbulb, AlertTriangle, ToggleLeft, ToggleRight, ChevronDown, ChevronUp, Activity, Zap, Hand, Layers } from 'lucide-react';

/* ─── DATA ───────────────────────────────────────────────────────────── */

const cockpitZones = [
  {
    id: 'pfd',
    label: 'Primary Flight Displays',
    shortLabel: 'PFD / ND',
    x: 70, y: 100, w: 160, h: 80,
    color: '#06b6d4',
    principles: [
      'Positioned directly in front of the pilot within the primary visual field (±15° from center).',
      'PFD shows attitude, airspeed, altitude, heading — the most critical parameters grouped together (Proximity Compatibility Principle).',
      'Movement compatibility: pitch up → horizon moves down, consistent with external visual cues.',
      'The Design Eye Position (DEP) is calibrated so all displays are readable without parallax error.',
    ],
  },
  {
    id: 'overhead',
    label: 'Overhead Panel',
    shortLabel: 'Overhead',
    x: 70, y: 10, w: 160, h: 70,
    color: '#f59e0b',
    principles: [
      'Contains systems rarely used in normal flight: electrical, hydraulics, pneumatics, fire handles.',
      'Located overhead to keep the main panel uncluttered — reduces visual noise in the primary scan area.',
      'Guards and locking mechanisms on critical switches prevent inadvertent activation.',
      'Shape-coded and color-coded: fire handles are red T-shaped, distinctive by touch alone.',
    ],
  },
  {
    id: 'pedestal',
    label: 'Center Pedestal',
    shortLabel: 'Pedestal',
    x: 115, y: 200, w: 70, h: 90,
    color: '#a78bfa',
    principles: [
      'Houses throttle quadrant, trim wheels, flap lever, speed brake, radio/nav panels.',
      'Positioned between the pilots so both Captain and First Officer can reach critical controls.',
      'Throttle levers use position coding — each lever\'s detent corresponds to a power setting (Idle, CLB, TOGA).',
      'Radio panels are lower on the pedestal — lower priority, used less frequently during critical flight phases.',
    ],
  },
  {
    id: 'throttle',
    label: 'Throttle Quadrant',
    shortLabel: 'Throttles',
    x: 120, y: 200, w: 60, h: 40,
    color: '#10b981',
    principles: [
      'Throttle levers are forward for more thrust, aft for less — following the natural movement stereotype (forward = more).',
      'Levers are spaced and shaped so pilots can grip correctly by feel alone (shape coding).',
      'Reverse thrust levers require a deliberate lift-and-pull action — preventing accidental selection in flight.',
      'Tactile feedback at detents (CLB, FLX, TOGA) confirms power setting without visual verification.',
    ],
  },
  {
    id: 'glareshield',
    label: 'Glareshield / FCU',
    shortLabel: 'FCU',
    x: 70, y: 85, w: 160, h: 20,
    color: '#f472b6',
    principles: [
      'Flight Control Unit (FCU) sits at eye level on the glareshield — the primary autopilot interface.',
      'Speed, heading, altitude, vertical speed selectors are arranged left-to-right matching PFD layout.',
      'Push = managed mode, Pull = selected mode — consistent logic across all selectors.',
      'Knobs have different sizes and spacing to prevent wrong-selector errors by touch.',
    ],
  },
];

const controlDesignPrinciples = [
  {
    id: 'shape',
    title: 'Shape Coding',
    icon: 'shape',
    color: '#06b6d4',
    summary: 'Controls have unique shapes so they can be identified by touch alone.',
    reason: 'During night flights or high-workload situations, the pilot cannot always look at a control before operating it. Different shapes allow tactile identification, preventing mis-selection. This dates back to WWII when gear/flap mix-ups caused accidents.',
    examples: ['Gear lever = wheel shape', 'Flap lever = airfoil shape', 'Throttle = round knob', 'Fire handle = T-shape'],
  },
  {
    id: 'color',
    title: 'Color Coding',
    icon: 'color',
    color: '#ef4444',
    summary: 'Colors convey urgency, grouping, and system state.',
    reason: 'The human visual system processes color pre-attentively — you notice a red warning before reading the text. Color coding leverages this to ensure critical alerts (red), cautions (amber), and advisories (blue/green) are processed at the correct priority level.',
    examples: ['Red = fire, danger, master warning', 'Amber = caution, abnormal', 'Green = safe, normal, on', 'Blue/White = advisory, information'],
  },
  {
    id: 'position',
    title: 'Position Coding',
    icon: 'position',
    color: '#a78bfa',
    summary: 'Controls are located where the pilot expects them based on function.',
    reason: 'Spatial memory is one of the strongest forms of human memory. By standardizing the position of controls across aircraft types, pilots can transfer between fleets with fewer errors. Violating positional expectations causes "negative transfer."',
    examples: ['Engine controls = center pedestal', 'Flight controls = in front of each pilot', 'System panels = overhead', 'Comms = lower pedestal'],
  },
  {
    id: 'size',
    title: 'Size Coding',
    icon: 'size',
    color: '#f59e0b',
    summary: 'Important or frequently used controls are larger.',
    reason: 'Fitts\'s Law states that the time to acquire a target is a function of distance and size. Larger controls are faster to reach and harder to miss. Critical controls like landing gear and thrust levers are deliberately oversized to reduce reaction time in emergencies.',
    examples: ['Landing gear lever = large, prominent', 'Thrust levers = long, full-grip', 'Trim switches = small (fine adjustment)', 'FCU knobs = medium, evenly spaced'],
  },
  {
    id: 'labeling',
    title: 'Labeling',
    icon: 'labeling',
    color: '#10b981',
    summary: 'Clear, unambiguous labels prevent misidentification.',
    reason: 'Under stress, reading ability degrades. Labels must be short, use standard abbreviations, and be placed consistently (above or to the left of the control). Font size, contrast, and viewing angle are calculated from the DEP to ensure legibility.',
    examples: ['Use standard ICAO abbreviations', 'Labels above or left of control', 'White text on dark background', 'Backlit for night operations'],
  },
];

const bodyParts: Record<string, { label: string; issues: string[]; recommendations: string[] }> = {
  head: {
    label: 'Head & Neck',
    issues: ['Neck strain from frequent head-up / head-down transitions', 'Headset clamping pressure causing headaches on long flights', 'Parallax errors if DEP is not set correctly'],
    recommendations: ['Adjust seat to proper DEP — align red balls on glareshield', 'Use lightweight ANR headsets to reduce clamping force', 'Minimize head rotation by using proper scan patterns'],
  },
  shoulders: {
    label: 'Shoulders & Upper Back',
    issues: ['Overhead panel reach causes repeated shoulder elevation', 'Sustained arm position on yoke/sidestick causes tension', 'Asymmetric loading if armrest is used on one side only'],
    recommendations: ['Use both armrests to distribute load symmetrically', 'Briefly rest arms during cruise when autopilot is engaged', 'Perform shoulder rolls during low-workload phases'],
  },
  back: {
    label: 'Lower Back (Lumbar)',
    issues: ['Prolonged sitting compresses lumbar discs', 'Vibration from turbulence accelerates spinal fatigue', 'Poor seat cushion reduces blood flow'],
    recommendations: ['Adjust lumbar support to maintain natural lordosis', 'Stand and stretch during cruise on long-haul flights', 'Use anti-vibration seat cushions if available'],
  },
  arms: {
    label: 'Arms & Hands',
    issues: ['Repetitive switch actuation — especially during checklists', 'Grip fatigue from sustained yoke/sidestick input', 'Cold extremities in unpressurized/draft-prone cockpits'],
    recommendations: ['Alternate hands for switch actuation during normal ops', 'Use trim to offload sustained control forces', 'Wear gloves or adjust cockpit temperature'],
  },
  legs: {
    label: 'Legs & Feet',
    issues: ['Restricted leg movement in narrow cockpits reduces blood flow', 'Sustained rudder pedal pressure during crosswind ops', 'Risk of DVT on ultra-long-haul flights (> 8 hours)'],
    recommendations: ['Adjust rudder pedals so knees are slightly bent, never locked', 'Perform ankle circles and calf raises during cruise', 'Stay hydrated — dehydration increases DVT risk'],
  },
};

/* ─── SVG ICON HELPERS ───────────────────────────────────────────────── */

const ShapeIcons: Record<string, React.ReactNode> = {
  shape: (
    <svg viewBox="0 0 40 40" className="w-8 h-8">
      <circle cx="12" cy="14" r="8" fill="none" stroke="#06b6d4" strokeWidth="2" />
      <rect x="22" y="6" width="14" height="14" rx="2" fill="none" stroke="#06b6d4" strokeWidth="2" />
      <polygon points="12,38 4,26 20,26" fill="none" stroke="#06b6d4" strokeWidth="2" />
      <polygon points="29,22 36,30 32,38 26,38 22,30" fill="none" stroke="#06b6d4" strokeWidth="2" />
    </svg>
  ),
  color: (
    <svg viewBox="0 0 40 40" className="w-8 h-8">
      <circle cx="14" cy="16" r="10" fill="#ef444488" />
      <circle cx="26" cy="16" r="10" fill="#3b82f688" />
      <circle cx="20" cy="28" r="10" fill="#22c55e88" />
    </svg>
  ),
  position: (
    <svg viewBox="0 0 40 40" className="w-8 h-8">
      <rect x="4" y="4" width="14" height="14" rx="2" fill="#a78bfa44" stroke="#a78bfa" strokeWidth="1.5" />
      <rect x="22" y="4" width="14" height="14" rx="2" fill="#a78bfa44" stroke="#a78bfa" strokeWidth="1.5" />
      <rect x="4" y="22" width="14" height="14" rx="2" fill="#a78bfa44" stroke="#a78bfa" strokeWidth="1.5" />
      <rect x="22" y="22" width="14" height="14" rx="2" fill="#a78bfa44" stroke="#a78bfa" strokeWidth="1.5" />
      <circle cx="11" cy="11" r="3" fill="#a78bfa" />
    </svg>
  ),
  size: (
    <svg viewBox="0 0 40 40" className="w-8 h-8">
      <circle cx="10" cy="30" r="6" fill="none" stroke="#f59e0b" strokeWidth="2" />
      <circle cx="22" cy="24" r="9" fill="none" stroke="#f59e0b" strokeWidth="2" />
      <circle cx="30" cy="12" r="4" fill="none" stroke="#f59e0b" strokeWidth="2" />
    </svg>
  ),
  labeling: (
    <svg viewBox="0 0 40 40" className="w-8 h-8">
      <rect x="4" y="8" width="32" height="24" rx="3" fill="none" stroke="#10b981" strokeWidth="2" />
      <text x="20" y="24" textAnchor="middle" fill="#10b981" fontSize="10" fontWeight="bold">APU</text>
    </svg>
  ),
};

/* ─── MAIN COMPONENT ─────────────────────────────────────────────────── */

const HPLErgonomics: React.FC = () => {
  const [tab, setTab] = useState<'cockpit' | 'controls' | 'display' | 'fatigue' | 'anthropometry' | 'dep' | 'biomechanics'>('cockpit');

  const tabs = [
    { id: 'cockpit' as const, label: 'Cockpit Layout', icon: <Layers className="w-4 h-4" /> },
    { id: 'controls' as const, label: 'Control Design', icon: <Hand className="w-4 h-4" /> },
    { id: 'display' as const, label: 'Display Design', icon: <Monitor className="w-4 h-4" /> },
    { id: 'fatigue' as const, label: 'Fatigue & Posture', icon: <Activity className="w-4 h-4" /> },
    { id: 'anthropometry' as const, label: 'Anthropometry', icon: <Ruler className="w-4 h-4" /> },
    { id: 'dep' as const, label: 'Design Eye Position', icon: <Eye className="w-4 h-4" /> },
    { id: 'biomechanics' as const, label: 'Biomechanics', icon: <Zap className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <header className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-cyan-500/20 rounded-lg">
            <Armchair className="w-6 h-6 text-cyan-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100">Flight Deck Ergonomics</h1>
        </div>
        <p className="text-slate-400">
          The study of people in their working environment. Matching the machine to the pilot (Hardware–Liveware interface).
        </p>
      </header>

      {/* ── Tab Bar ── */}
      <div className="flex flex-wrap gap-1.5 bg-slate-800/50 p-1.5 rounded-lg">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded text-sm font-medium transition-all duration-200
              ${tab === t.id
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20'
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
          >
            {t.icon}
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 min-h-[480px]">
        {tab === 'cockpit' && <CockpitLayoutVisualizer />}
        {tab === 'controls' && <ControlDesignPrinciples />}
        {tab === 'display' && <DisplayDesignComparison />}
        {tab === 'fatigue' && <FatiguePosture />}
        {tab === 'anthropometry' && <Anthropometry />}
        {tab === 'dep' && <DesignEyePosition />}
        {tab === 'biomechanics' && <Biomechanics />}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   1. COCKPIT LAYOUT VISUALIZER
   ═══════════════════════════════════════════════════════════════════════ */

const CockpitLayoutVisualizer: React.FC = () => {
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const selected = cockpitZones.find(z => z.id === activeZone);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white flex items-center gap-2">
        <Layers className="w-5 h-5 text-cyan-400" />
        Cockpit Layout Visualizer
      </h3>
      <p className="text-slate-400 text-sm">Click any zone to explore its ergonomic design principles.</p>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* SVG Top-Down Cockpit View */}
        <div className="bg-slate-900 rounded-xl border border-slate-700 p-4 flex items-center justify-center">
          <svg viewBox="0 0 300 320" className="w-full max-w-sm" style={{ fontFamily: 'inherit' }}>
            {/* Cockpit shell */}
            <path d="M 40,300 Q 40,0 150,0 Q 260,0 260,300 Z" fill="#0f172a" stroke="#334155" strokeWidth="2" />

            {/* Windshield */}
            <path d="M 60,60 Q 60,10 150,10 Q 240,10 240,60 Z" fill="#0c4a6e22" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="4 2" />
            <text x="150" y="40" textAnchor="middle" fill="#0ea5e944" fontSize="8" fontWeight="bold">WINDSHIELD</text>

            {/* Reach envelope arcs */}
            <ellipse cx="100" cy="260" rx="90" ry="75" fill="none" stroke="#06b6d422" strokeWidth="1" strokeDasharray="3 3" />
            <ellipse cx="200" cy="260" rx="90" ry="75" fill="none" stroke="#06b6d422" strokeWidth="1" strokeDasharray="3 3" />
            <text x="55" y="210" fill="#06b6d444" fontSize="6">REACH</text>
            <text x="225" y="210" fill="#06b6d444" fontSize="6">REACH</text>

            {/* Zones */}
            {cockpitZones.map(zone => {
              const isActive = activeZone === zone.id;
              return (
                <g key={zone.id} className="cursor-pointer" onClick={() => setActiveZone(isActive ? null : zone.id)}>
                  <rect
                    x={zone.x} y={zone.y} width={zone.w} height={zone.h} rx={6}
                    fill={isActive ? `${zone.color}33` : `${zone.color}11`}
                    stroke={zone.color}
                    strokeWidth={isActive ? 2.5 : 1.2}
                    className="transition-all duration-200"
                  />
                  <text
                    x={zone.x + zone.w / 2} y={zone.y + zone.h / 2 + 1}
                    textAnchor="middle" dominantBaseline="middle"
                    fill={zone.color} fontSize={zone.shortLabel.length > 8 ? 8 : 9} fontWeight="bold"
                  >
                    {zone.shortLabel}
                  </text>
                </g>
              );
            })}

            {/* Pilot seats */}
            <rect x="55" y="245" width="50" height="55" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
            <text x="80" y="275" textAnchor="middle" fill="#94a3b8" fontSize="7" fontWeight="bold">CAPT</text>
            <rect x="195" y="245" width="50" height="55" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
            <text x="220" y="275" textAnchor="middle" fill="#94a3b8" fontSize="7" fontWeight="bold">F/O</text>

            {/* DEP indicator */}
            <circle cx="80" cy="258" r="3" fill="#06b6d4" opacity="0.8" />
            <circle cx="220" cy="258" r="3" fill="#06b6d4" opacity="0.8" />
            <text x="150" y="258" textAnchor="middle" fill="#06b6d466" fontSize="5">DEP</text>
          </svg>
        </div>

        {/* Info Panel */}
        <div className="flex flex-col justify-center">
          {selected ? (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selected.color }} />
                <h4 className="text-lg font-bold text-white">{selected.label}</h4>
              </div>
              <ul className="space-y-3">
                {selected.principles.map((p, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                      style={{ backgroundColor: `${selected.color}22`, color: selected.color }}>
                      {i + 1}
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-center text-slate-500 py-12">
              <Layers className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Click a zone on the cockpit diagram to explore its ergonomic design principles.</p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {cockpitZones.map(z => (
                  <button key={z.id} onClick={() => setActiveZone(z.id)}
                    className="px-2 py-1 rounded text-xs border transition-colors"
                    style={{ borderColor: `${z.color}66`, color: z.color }}>
                    {z.shortLabel}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   2. CONTROL DESIGN PRINCIPLES
   ═══════════════════════════════════════════════════════════════════════ */

const ControlDesignPrinciples: React.FC = () => {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white flex items-center gap-2">
        <Hand className="w-5 h-5 text-cyan-400" />
        Control Design Principles
      </h3>
      <p className="text-slate-400 text-sm">Each principle prevents specific types of human error. Click a card to reveal <em>why</em> it matters.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {controlDesignPrinciples.map(p => {
          const isOpen = expanded === p.id;
          return (
            <div
              key={p.id}
              className="bg-slate-900 rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden"
              style={{ borderColor: isOpen ? p.color : '#334155' }}
              onClick={() => setExpanded(isOpen ? null : p.id)}
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">{ShapeIcons[p.icon]}</div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{p.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">{p.summary}</p>
                    </div>
                  </div>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />}
                </div>

                {/* Examples */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {p.examples.map((ex, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${p.color}18`, color: p.color }}>
                      {ex}
                    </span>
                  ))}
                </div>
              </div>

              {/* Expanded reason */}
              {isOpen && (
                <div className="px-5 pb-5 pt-0 animate-in fade-in">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: `${p.color}11` }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4" style={{ color: p.color }} />
                      <span className="text-xs font-bold" style={{ color: p.color }}>Why This Matters</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{p.reason}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   3. DISPLAY DESIGN COMPARISON
   ═══════════════════════════════════════════════════════════════════════ */

const displayExamples = [
  {
    title: 'Proximity Compatibility',
    good: {
      description: 'Related information grouped together — altitude, vertical speed, and altitude trend shown on the same tape.',
      svg: (
        <svg viewBox="0 0 200 140" className="w-full">
          <rect x="0" y="0" width="200" height="140" rx="8" fill="#0f172a" />
          {/* Grouped altitude display */}
          <rect x="120" y="10" width="65" height="120" rx="4" fill="#1e293b" stroke="#0ea5e9" strokeWidth="1" />
          <text x="152" y="28" textAnchor="middle" fill="#94a3b8" fontSize="7">ALT</text>
          {[35000, 34000, 33000, 32000, 31000].map((alt, i) => (
            <text key={i} x="152" y={46 + i * 18} textAnchor="middle" fill={i === 2 ? '#22d3ee' : '#64748b'} fontSize={i === 2 ? 11 : 8} fontWeight={i === 2 ? 'bold' : 'normal'}>{alt}</text>
          ))}
          {/* VS arrow next to altitude */}
          <line x1="188" y1="80" x2="188" y2="50" stroke="#22c55e" strokeWidth="2" />
          <polygon points="188,46 184,54 192,54" fill="#22c55e" />
          <text x="188" y="92" textAnchor="middle" fill="#22c55e" fontSize="6">+1200</text>
          {/* Speed tape grouped */}
          <rect x="15" y="10" width="55" height="120" rx="4" fill="#1e293b" stroke="#0ea5e9" strokeWidth="1" />
          <text x="42" y="28" textAnchor="middle" fill="#94a3b8" fontSize="7">SPD</text>
          <text x="42" y="74" textAnchor="middle" fill="#22d3ee" fontSize="12" fontWeight="bold">250</text>
          <text x="42" y="90" textAnchor="middle" fill="#94a3b8" fontSize="7">.78M</text>
          {/* Attitude in center */}
          <rect x="78" y="30" width="35" height="80" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="0.5" />
          <line x1="82" y1="70" x2="109" y2="70" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="95" y="58" textAnchor="middle" fill="#94a3b8" fontSize="6">ATT</text>
        </svg>
      ),
    },
    bad: {
      description: 'Altitude in one corner, vertical speed in another, trend on a separate page. Pilot must mentally integrate scattered data.',
      svg: (
        <svg viewBox="0 0 200 140" className="w-full">
          <rect x="0" y="0" width="200" height="140" rx="8" fill="#0f172a" />
          <rect x="10" y="10" width="50" height="35" rx="3" fill="#1e293b" stroke="#ef4444" strokeWidth="1" strokeDasharray="3" />
          <text x="35" y="25" textAnchor="middle" fill="#94a3b8" fontSize="6">ALT</text>
          <text x="35" y="38" textAnchor="middle" fill="#64748b" fontSize="9">33000</text>
          <rect x="140" y="90" width="50" height="35" rx="3" fill="#1e293b" stroke="#ef4444" strokeWidth="1" strokeDasharray="3" />
          <text x="165" y="105" textAnchor="middle" fill="#94a3b8" fontSize="6">V/S</text>
          <text x="165" y="118" textAnchor="middle" fill="#64748b" fontSize="9">+1200</text>
          <rect x="75" y="55" width="50" height="30" rx="3" fill="#1e293b" stroke="#ef4444" strokeWidth="1" strokeDasharray="3" />
          <text x="100" y="68" textAnchor="middle" fill="#94a3b8" fontSize="6">TREND</text>
          <text x="100" y="80" textAnchor="middle" fill="#64748b" fontSize="8">↑</text>
          {/* Scattered arrows */}
          <line x1="60" y1="40" x2="80" y2="55" stroke="#ef444466" strokeWidth="1" strokeDasharray="2" />
          <line x1="120" y1="80" x2="140" y2="95" stroke="#ef444466" strokeWidth="1" strokeDasharray="2" />
          <text x="100" y="135" textAnchor="middle" fill="#ef4444" fontSize="7">⚠ Information scattered</text>
        </svg>
      ),
    },
  },
  {
    title: 'Movement Compatibility',
    good: {
      description: 'Attitude indicator: pitch up → horizon moves down (matches external view). Roll right → horizon tilts left.',
      svg: (
        <svg viewBox="0 0 200 140" className="w-full">
          <rect x="0" y="0" width="200" height="140" rx="8" fill="#0f172a" />
          <circle cx="100" cy="70" r="50" fill="#1e293b" stroke="#0ea5e9" strokeWidth="1" />
          {/* Sky / Ground */}
          <clipPath id="adi-clip-good"><circle cx="100" cy="70" r="49" /></clipPath>
          <g clipPath="url(#adi-clip-good)">
            <rect x="50" y="20" width="100" height="40" fill="#1e40af33" />
            <rect x="50" y="60" width="100" height="60" fill="#92400e33" />
            <line x1="50" y1="60" x2="150" y2="60" stroke="#f59e0b" strokeWidth="1.5" />
          </g>
          {/* Aircraft symbol */}
          <line x1="80" y1="70" x2="95" y2="70" stroke="white" strokeWidth="2" />
          <line x1="105" y1="70" x2="120" y2="70" stroke="white" strokeWidth="2" />
          <circle cx="100" cy="70" r="2" fill="white" />
          {/* Arrow showing pitch up */}
          <line x1="160" y1="80" x2="160" y2="50" stroke="#22c55e" strokeWidth="2" />
          <polygon points="160,46 156,54 164,54" fill="#22c55e" />
          <text x="160" y="92" textAnchor="middle" fill="#22c55e" fontSize="6">PITCH UP</text>
          <text x="160" y="102" textAnchor="middle" fill="#22c55e" fontSize="5">Horizon ↓</text>
          <text x="100" y="135" textAnchor="middle" fill="#22c55e" fontSize="7">✓ Natural mapping</text>
        </svg>
      ),
    },
    bad: {
      description: 'A reversed display where pitch up moves the horizon up — conflicts with external visual cues and causes disorientation.',
      svg: (
        <svg viewBox="0 0 200 140" className="w-full">
          <rect x="0" y="0" width="200" height="140" rx="8" fill="#0f172a" />
          <circle cx="100" cy="70" r="50" fill="#1e293b" stroke="#ef4444" strokeWidth="1" />
          <clipPath id="adi-clip-bad"><circle cx="100" cy="70" r="49" /></clipPath>
          <g clipPath="url(#adi-clip-bad)">
            <rect x="50" y="20" width="100" height="60" fill="#1e40af33" />
            <rect x="50" y="80" width="100" height="40" fill="#92400e33" />
            <line x1="50" y1="80" x2="150" y2="80" stroke="#f59e0b" strokeWidth="1.5" />
          </g>
          <line x1="80" y1="70" x2="95" y2="70" stroke="white" strokeWidth="2" />
          <line x1="105" y1="70" x2="120" y2="70" stroke="white" strokeWidth="2" />
          <circle cx="100" cy="70" r="2" fill="white" />
          <line x1="160" y1="80" x2="160" y2="50" stroke="#ef4444" strokeWidth="2" />
          <polygon points="160,46 156,54 164,54" fill="#ef4444" />
          <text x="160" y="92" textAnchor="middle" fill="#ef4444" fontSize="6">PITCH UP</text>
          <text x="160" y="102" textAnchor="middle" fill="#ef4444" fontSize="5">Horizon ↑ ??</text>
          <text x="100" y="135" textAnchor="middle" fill="#ef4444" fontSize="7">⚠ Reversed mapping</text>
        </svg>
      ),
    },
  },
  {
    title: 'Color Coding Consistency',
    good: {
      description: 'Standard ECAM color scheme: red = warning, amber = caution, green = normal, cyan = labels, magenta = managed targets.',
      svg: (
        <svg viewBox="0 0 200 140" className="w-full">
          <rect x="0" y="0" width="200" height="140" rx="8" fill="#0f172a" />
          <rect x="15" y="15" width="170" height="110" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="0.5" />
          {[
            { y: 28, color: '#ef4444', label: 'ENG 1 FIRE', tag: 'WARNING' },
            { y: 50, color: '#f59e0b', label: 'HYD G SYS LO PR', tag: 'CAUTION' },
            { y: 72, color: '#22c55e', label: 'ELEC — NORMAL', tag: 'NORMAL' },
            { y: 94, color: '#06b6d4', label: 'FUEL QTY  12.4 T', tag: 'INFO' },
            { y: 112, color: '#d946ef', label: 'SPD: 250 / .78', tag: 'MANAGED' },
          ].map((item, i) => (
            <g key={i}>
              <circle cx="30" cy={item.y} r="4" fill={item.color} />
              <text x="40" y={item.y + 4} fill={item.color} fontSize="8" fontWeight="bold">{item.label}</text>
              <text x="175" y={item.y + 3} textAnchor="end" fill={`${item.color}88`} fontSize="6">{item.tag}</text>
            </g>
          ))}
        </svg>
      ),
    },
    bad: {
      description: 'Random colors with no semantic meaning — green for warnings, red for labels. Pilot must read every word; cannot rely on pre-attentive color processing.',
      svg: (
        <svg viewBox="0 0 200 140" className="w-full">
          <rect x="0" y="0" width="200" height="140" rx="8" fill="#0f172a" />
          <rect x="15" y="15" width="170" height="110" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="0.5" />
          {[
            { y: 28, color: '#22c55e', label: 'ENG 1 FIRE', tag: '??' },
            { y: 50, color: '#3b82f6', label: 'HYD G SYS LO PR', tag: '??' },
            { y: 72, color: '#ef4444', label: 'ELEC — NORMAL', tag: '??' },
            { y: 94, color: '#d946ef', label: 'FUEL QTY  12.4 T', tag: '??' },
            { y: 112, color: '#f59e0b', label: 'SPD: 250 / .78', tag: '??' },
          ].map((item, i) => (
            <g key={i}>
              <circle cx="30" cy={item.y} r="4" fill={item.color} />
              <text x="40" y={item.y + 4} fill={item.color} fontSize="8" fontWeight="bold">{item.label}</text>
              <text x="175" y={item.y + 3} textAnchor="end" fill="#ef444488" fontSize="6">{item.tag}</text>
            </g>
          ))}
          <text x="100" y="137" textAnchor="middle" fill="#ef4444" fontSize="7">⚠ No consistent meaning</text>
        </svg>
      ),
    },
  },
];

const DisplayDesignComparison: React.FC = () => {
  const [showGood, setShowGood] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Monitor className="w-5 h-5 text-cyan-400" />
          Display Design Comparison
        </h3>
        <button
          onClick={() => setShowGood(!showGood)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
            showGood
              ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40'
              : 'bg-red-600/20 text-red-400 border border-red-500/40'
          }`}
        >
          {showGood ? <ToggleLeft className="w-5 h-5" /> : <ToggleRight className="w-5 h-5" />}
          {showGood ? '✓ Good Design' : '✗ Bad Design'}
        </button>
      </div>
      <p className="text-slate-400 text-sm">Toggle between well-designed and poorly-designed cockpit displays to understand each principle.</p>

      <div className="grid md:grid-cols-3 gap-5">
        {displayExamples.map((ex, i) => {
          const variant = showGood ? ex.good : ex.bad;
          return (
            <div key={i} className={`rounded-xl border overflow-hidden transition-all duration-300 ${
              showGood ? 'border-emerald-500/30 bg-slate-900' : 'border-red-500/30 bg-slate-900'
            }`}>
              <div className="p-3">
                <h4 className="text-sm font-bold text-white mb-1">{ex.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-3">{variant.description}</p>
                <div className="rounded-lg overflow-hidden border border-slate-700/50">
                  {variant.svg}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   4. FATIGUE & POSTURE
   ═══════════════════════════════════════════════════════════════════════ */

const FatiguePosture: React.FC = () => {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const info = selectedPart ? bodyParts[selectedPart] : null;

  const partStyle = (id: string) => ({
    fill: selectedPart === id ? '#06b6d4' : '#334155',
    stroke: selectedPart === id ? '#22d3ee' : '#475569',
    strokeWidth: selectedPart === id ? 2 : 1,
    cursor: 'pointer' as const,
    transition: 'all 0.2s',
  });

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white flex items-center gap-2">
        <Activity className="w-5 h-5 text-cyan-400" />
        Fatigue & Posture
      </h3>
      <p className="text-slate-400 text-sm">Click body regions to see cockpit-related ergonomic issues and recommendations.</p>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Body Diagram */}
        <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 flex items-center justify-center">
          <svg viewBox="0 0 200 360" className="w-full max-w-[220px]">
            {/* Head */}
            <ellipse cx="100" cy="40" rx="28" ry="32" {...partStyle('head')} onClick={() => setSelectedPart(selectedPart === 'head' ? null : 'head')} />
            <text x="100" y="44" textAnchor="middle" fill={selectedPart === 'head' ? 'white' : '#94a3b8'} fontSize="9" fontWeight="bold" style={{ pointerEvents: 'none' }}>HEAD</text>

            {/* Neck */}
            <rect x="90" y="70" width="20" height="15" rx="4" {...partStyle('head')} onClick={() => setSelectedPart(selectedPart === 'head' ? null : 'head')} />

            {/* Shoulders */}
            <rect x="40" y="85" width="120" height="35" rx="12" {...partStyle('shoulders')} onClick={() => setSelectedPart(selectedPart === 'shoulders' ? null : 'shoulders')} />
            <text x="100" y="106" textAnchor="middle" fill={selectedPart === 'shoulders' ? 'white' : '#94a3b8'} fontSize="8" fontWeight="bold" style={{ pointerEvents: 'none' }}>SHOULDERS</text>

            {/* Torso / Back */}
            <rect x="60" y="120" width="80" height="75" rx="8" {...partStyle('back')} onClick={() => setSelectedPart(selectedPart === 'back' ? null : 'back')} />
            <text x="100" y="155" textAnchor="middle" fill={selectedPart === 'back' ? 'white' : '#94a3b8'} fontSize="8" fontWeight="bold" style={{ pointerEvents: 'none' }}>LUMBAR</text>
            <text x="100" y="167" textAnchor="middle" fill={selectedPart === 'back' ? 'white' : '#94a3b8'} fontSize="7" style={{ pointerEvents: 'none' }}>BACK</text>

            {/* Arms */}
            <rect x="22" y="92" width="22" height="85" rx="10" {...partStyle('arms')} onClick={() => setSelectedPart(selectedPart === 'arms' ? null : 'arms')} />
            <rect x="156" y="92" width="22" height="85" rx="10" {...partStyle('arms')} onClick={() => setSelectedPart(selectedPart === 'arms' ? null : 'arms')} />
            {/* Hands */}
            <ellipse cx="33" cy="185" rx="12" ry="10" {...partStyle('arms')} onClick={() => setSelectedPart(selectedPart === 'arms' ? null : 'arms')} />
            <ellipse cx="167" cy="185" rx="12" ry="10" {...partStyle('arms')} onClick={() => setSelectedPart(selectedPart === 'arms' ? null : 'arms')} />
            <text x="33" y="140" textAnchor="middle" fill={selectedPart === 'arms' ? 'white' : '#94a3b8'} fontSize="6" fontWeight="bold" style={{ pointerEvents: 'none' }} transform="rotate(-90,33,140)">ARMS</text>

            {/* Legs */}
            <rect x="62" y="200" width="30" height="100" rx="10" {...partStyle('legs')} onClick={() => setSelectedPart(selectedPart === 'legs' ? null : 'legs')} />
            <rect x="108" y="200" width="30" height="100" rx="10" {...partStyle('legs')} onClick={() => setSelectedPart(selectedPart === 'legs' ? null : 'legs')} />
            {/* Feet */}
            <ellipse cx="77" cy="310" rx="18" ry="10" {...partStyle('legs')} onClick={() => setSelectedPart(selectedPart === 'legs' ? null : 'legs')} />
            <ellipse cx="123" cy="310" rx="18" ry="10" {...partStyle('legs')} onClick={() => setSelectedPart(selectedPart === 'legs' ? null : 'legs')} />
            <text x="100" y="260" textAnchor="middle" fill={selectedPart === 'legs' ? 'white' : '#94a3b8'} fontSize="8" fontWeight="bold" style={{ pointerEvents: 'none' }}>LEGS</text>

            {/* Quick labels */}
            {!selectedPart && (
              <text x="100" y="345" textAnchor="middle" fill="#475569" fontSize="8">Click a body region</text>
            )}
          </svg>
        </div>

        {/* Info Panel */}
        <div className="flex flex-col justify-center">
          {info ? (
            <div className="space-y-5 animate-in fade-in">
              <h4 className="text-lg font-bold text-white">{info.label}</h4>

              <div className="bg-red-900/15 border border-red-500/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-bold text-red-300">Ergonomic Issues</span>
                </div>
                <ul className="space-y-2">
                  {info.issues.map((issue, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-red-400 mt-0.5">•</span>{issue}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-emerald-900/15 border border-emerald-500/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold text-emerald-300">Recommendations</span>
                </div>
                <ul className="space-y-2">
                  {info.recommendations.map((rec, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5">✓</span>{rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-500 py-12">
              <Activity className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Click a body part on the diagram to see cockpit-related ergonomic issues.</p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {Object.entries(bodyParts).map(([key, val]) => (
                  <button key={key} onClick={() => setSelectedPart(key)}
                    className="px-2.5 py-1 rounded text-xs border border-slate-600 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors">
                    {val.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   ORIGINAL SECTIONS — PRESERVED
   ═══════════════════════════════════════════════════════════════════════ */

const Anthropometry = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white">The Measurement of Man</h3>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <p className="text-slate-300 mb-6">
            Cockpits cannot be custom built for every individual. They are designed to fit a specific range of the population.
          </p>

          <div className="bg-slate-900 mx-auto w-full h-48 rounded-lg relative flex items-end justify-center px-8 border border-slate-700 overflow-hidden">
            {/* Gaussian Curve Visualization */}
            <div className="absolute inset-0 flex items-end justify-center gap-1 opacity-50">
              {[1, 2, 5, 10, 20, 35, 50, 60, 65, 60, 50, 35, 20, 10, 5, 2, 1].map((h, i) => (
                <div key={i} className="w-4 bg-cyan-500 rounded-t" style={{ height: `${h}%` }}></div>
              ))}
            </div>

            <div className="z-10 w-full flex justify-between px-12 pb-2 text-xs text-white font-bold">
              <div className="text-center">
                <div className="w-px h-full bg-red-500 absolute top-0 bottom-0 left-[20%]"></div>
                <span className="text-red-400">5th %ile</span>
              </div>
              <div className="text-center">
                <div className="w-px h-full bg-red-500 absolute top-0 bottom-0 right-[20%]"></div>
                <span className="text-red-400">95th %ile</span>
              </div>
            </div>
          </div>
          <div className="text-center text-xs text-slate-400 mt-2">
            Standard Cockpit Design Range (5th to 95th Percentile)
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-cyan-900/20 border-l-4 border-cyan-500 p-4 rounded-lg">
            <h4 className="font-bold text-cyan-300">The Design Philosophy</h4>
            <p className="text-sm text-slate-300">
              By designing for the 5th to 95th percentile, ~90% of the population is accommodated.
              The remaining 10% (very short or very tall) may require adaptive devices (cushions) or be excluded.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-700/30 p-4 rounded-lg">
              <h5 className="font-bold text-white text-sm">Static</h5>
              <p className="text-xs text-slate-400 mt-1">
                Measurements while stationary (e.g., Sitting Height, Arm Span).
              </p>
            </div>
            <div className="bg-slate-700/30 p-4 rounded-lg">
              <h5 className="font-bold text-white text-sm">Dynamic</h5>
              <p className="text-xs text-slate-400 mt-1">
                Measurements during movement (e.g., Functional Reach, Range of Motion).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DesignEyePosition = () => (
  <div className="space-y-6">
    <h3 className="text-xl font-bold text-white">Design Eye Position (DEP)</h3>
    <p className="text-slate-300">
      The optimum position of the pilot's eyes to ensure:
    </p>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 flex flex-col items-center text-center">
        <Monitor className="w-10 h-10 text-blue-400 mb-4" />
        <h4 className="font-bold text-slate-200">Internal Visibility</h4>
        <p className="text-xs text-slate-400 mt-2">
          All flight instruments and warning lights are visible without head movement creating parallax errors.
        </p>
      </div>

      <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 flex flex-col items-center text-center">
        <Eye className="w-10 h-10 text-green-400 mb-4" />
        <h4 className="font-bold text-slate-200">External Visibility</h4>
        <p className="text-xs text-slate-400 mt-2">
          Clear view of the runway during approach (cut-off angle) and traffic.
        </p>
      </div>

      <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 flex flex-col items-center text-center">
        <Armchair className="w-10 h-10 text-orange-400 mb-4" />
        <h4 className="font-bold text-slate-200">Comfort & Reach</h4>
        <p className="text-xs text-slate-400 mt-2">
          All controls are within reach and the seating position does not cause fatigue.
        </p>
      </div>
    </div>

    <div className="bg-blue-900/20 p-6 rounded-xl border border-blue-500/30 flex items-start gap-4">
      <div className="bg-blue-500/20 p-2 rounded-full hidden md:block">
        <Ruler className="text-blue-400" />
      </div>
      <div>
        <h4 className="font-bold text-blue-300">Adjustment Procedure</h4>
        <ol className="list-decimal list-inside space-y-1 text-sm text-slate-300 mt-2">
          <li>Adjust seat height until the &quot;balls&quot; (alignment indicators) line up.</li>
          <li>Ensure rudder pedals allow full travel without locking knees.</li>
          <li>Ensure cyclic/yoke full travel does not hit legs or abdomen.</li>
        </ol>
      </div>
    </div>
  </div>
);

const Biomechanics = () => (
  <div className="space-y-6">
    <h3 className="text-xl font-bold text-white">Biomechanics & Reach</h3>

    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
        <h4 className="font-bold text-white mb-4">Control Types</h4>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <div className="bg-slate-700 p-1.5 rounded text-white text-xs font-bold">Rudder</div>
            <div>
              <span className="text-sm font-bold text-slate-200 block">Legs/Feet</span>
              <span className="text-xs text-slate-400">Best for large force, poor precision. Used for coarse heavy control.</span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="bg-slate-700 p-1.5 rounded text-white text-xs font-bold">Yoke/Stick</div>
            <div>
              <span className="text-sm font-bold text-slate-200 block">Arms/Hands</span>
              <span className="text-xs text-slate-400">Good balance of force and precision. Optimal control range is elbow height.</span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="bg-slate-700 p-1.5 rounded text-white text-xs font-bold">Switches</div>
            <div>
              <span className="text-sm font-bold text-slate-200 block">Fingers</span>
              <span className="text-xs text-slate-400">Low force, high precision. Should move &quot;Forward/Up&quot; for processing specific systems.</span>
            </div>
          </li>
        </ul>
      </div>

      <div className="space-y-6">
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-600">
          <h5 className="font-bold text-cyan-300 mb-2">Movement Stereotypes</h5>
          <p className="text-sm text-slate-300">
            Design must follow natural expectations to avoid error under stress.
          </p>
          <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
            <div className="bg-black/30 p-2 rounded text-slate-400">Clockwise</div>
            <div className="bg-black/30 p-2 rounded text-green-400 font-bold">Increase</div>
            <div className="bg-black/30 p-2 rounded text-slate-400">Forward</div>
            <div className="bg-black/30 p-2 rounded text-green-400 font-bold">Go / Increase</div>
            <div className="bg-black/30 p-2 rounded text-slate-400">Switch Up</div>
            <div className="bg-black/30 p-2 rounded text-green-400 font-bold">On</div>
          </div>
        </div>

        <div className="bg-white/5 p-4 rounded-lg">
          <h5 className="font-bold text-white text-sm mb-1">Habit Capture</h5>
          <p className="text-xs text-slate-400">
            If a control design violates these stereotypes (e.g., a fuel switch that turns OFF when moved UP), pilots are likely to revert to the stereotype under stress, causing an accident.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default HPLErgonomics;
