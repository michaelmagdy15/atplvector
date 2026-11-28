import React, { useMemo, useRef, useState } from 'react';
import { ChevronRight, Compass, Navigation } from 'lucide-react';
import { View } from '../../types';
import { Accent } from '../artcraft/SectionShell';

interface HsiSector {
  id: string;
  heading: number;
  label: string;
  shortLabel: string;
  color: string;
  desc: string;
  subjects: Array<{ code: string; name: string; view: View }>;
}

const SECTORS: HsiSector[] = [
  {
    id: 'law-ops',
    heading: 300,
    label: 'Air Law, Ops & Comms',
    shortLabel: 'Air Law & Ops',
    color: '#f59e0b',
    desc: 'ICAO Chicago Convention, SERA right-of-way, CAT I/II/III minima, and RTF phraseology.',
    subjects: [
      { code: '010', name: 'Air Law & Treaties', view: View.AIR_LAW_HOME },
      { code: '070', name: 'Ops Procedures', view: View.OPS_PROC_HOME },
      { code: '090', name: 'VFR/IFR Comms', view: View.DASHBOARD },
    ],
  },
  {
    id: 'nav-met',
    heading: 60,
    label: 'Meteorology & Navigation',
    shortLabel: 'Met & Nav',
    color: '#60a5fa',
    desc: 'ISA molecular physics, charts, Great Circle convergency, VOR/ILS & GNSS.',
    subjects: [
      { code: '050', name: 'Atmos Chain Lab', view: View.FOUNDATION_ATM_PERF_CHAIN },
      { code: '061', name: 'Gen Navigation', view: View.GEN_NAV_HOME },
      { code: '062', name: 'Radio Navigation', view: View.RAD_NAV_HOME },
    ],
  },
  {
    id: 'perf-hpl',
    heading: 180,
    label: 'Performance, Mass & Planning',
    shortLabel: 'Perf & Planning',
    color: '#ec4899',
    desc: 'CS-25 runway roll, Balanced Field V1, RTOM 3-columns, fuel PET/PSR, and physiology.',
    subjects: [
      { code: '032', name: 'Take-Off 3D Story', view: View.PERF_TAKEOFF },
      { code: '031', name: 'Mass & Balance', view: View.MASS_BAL_HOME },
      { code: '033', name: 'Flight Planning', view: View.FLIGHT_PLAN_HOME },
    ],
  },
  {
    id: 'tech-pof',
    heading: 240,
    label: 'Tech General, Instruments & PoF',
    shortLabel: 'Tech & PoF',
    color: '#a78bfa',
    desc: '3D A320 aerodynamics, stall, hydraulics, IDG electrics, and EFIS/TCAS.',
    subjects: [
      { code: '081', name: 'Forces 3D Wind Tunnel', view: View.CONCEPT_FORCES_OF_FLIGHT },
      { code: '021', name: 'AGK Systems', view: View.AGK_SYSTEMS_HOME },
      { code: '022', name: 'Instrumentation', view: View.INST_HOME },
    ],
  },
];

function circularDiff(a: number, b: number): number {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

const FLOATING_BADGES = [
  { text: '1 in 60', x: '4%', y: '10%', rot: '-5deg', color: '#86efac' },
  { text: 'CDMVT', x: '22%', y: '7%', rot: '4deg', color: '#f9a8d4' },
  { text: 'W/V', x: '41%', y: '14%', rot: '-4deg', color: '#e2e8f0' },
  { text: 'V1 ≤ VR', x: '56%', y: '8%', rot: '3deg', color: '#93c5fd' },
  { text: 'ISA 15°C', x: '6%', y: '82%', rot: '-3deg', color: '#fcd34d' },
];

export const HsiSubjectCompass: React.FC<{
  onNavigate: (view: View) => void;
}> = ({ onNavigate }) => {
  const [heading, setHeading] = useState(180);
  const svgRef = useRef<SVGSVGElement>(null);
  const draggingRef = useRef(false);

  const activeSector = useMemo(() => {
    let best = SECTORS[0];
    let bestDiff = 999;
    SECTORS.forEach((s) => {
      const diff = circularDiff(heading, s.heading);
      if (diff < bestDiff) {
        bestDiff = diff;
        best = s;
      }
    });
    return best;
  }, [heading]);

  const updateFromPointer = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    const r = svg.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const rad = Math.atan2(clientX - cx, -(clientY - cy));
    const deg = ((Math.round((rad * 180) / Math.PI) % 360) + 360) % 360;
    setHeading(deg);
  };

  // Course vector dot along bezel perimeter toward the active heading
  const hdgRad = ((heading - 90) * Math.PI) / 180;
  const courseEndX = 130 + 104 * Math.cos(hdgRad);
  const courseEndY = 130 + 104 * Math.sin(hdgRad);

  return (
    <div data-autopilot-target="hsi-compass" className="w-full space-y-6">
      {/* Editorial Headline + 4 Tactile Pillar Selector Pills */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
          <Navigation className="w-3.5 h-3.5 text-cad-accent" />
          <span>EASA ATPL GROUND SCHOOL · DRAWN, NOT DUMPED</span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl lg:text-[54px] font-black tracking-[-0.03em] leading-[1.03] text-ink">
          Set your{' '}
          <span
            className="italic inline-block px-1 bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(120deg, #93c5fd 0%, #60a5fa 45%, #a78bfa 100%)',
              textDecoration: 'underline',
              textDecorationColor: '#f59e0b',
              textUnderlineOffset: '8px',
              textDecorationThickness: '4px',
            }}
          >
            heading.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-muted max-w-2xl leading-relaxed">
          All fourteen <Accent className="text-ink font-semibold">EASA ATPL</Accent> subjects mapped onto one flight deck. Twist the compass rose or pick a pillar pill to align your dispatch.
        </p>

        {/* 4 Rounded Tactile Pillar Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {SECTORS.map((s) => {
            const isSel = activeSector.id === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setHeading(s.heading)}
                className={`px-4 py-3 rounded-2xl border-2 flex items-center justify-between transition-all cursor-pointer text-left ${
                  isSel
                    ? 'bg-white text-slate-950 border-white shadow-[0_5px_0_0_var(--sel-color)] -translate-y-0.5'
                    : 'bg-bg-raised text-ink border-line hover:border-line-strong'
                }`}
                style={{ '--sel-color': s.color } as React.CSSProperties}
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="text-sm font-bold truncate">{s.shortLabel}</span>
                </span>
                <span className={`font-mono text-[11px] font-bold shrink-0 ml-2 ${isSel ? 'text-slate-600' : 'text-muted'}`}>
                  {String(s.heading).padStart(3, '0')}°
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Aeronautical Chart Stage + Large Draggable White-Bezel HSI Rose */}
      <div
        className="relative overflow-hidden rounded-3xl border-2 border-line-strong bg-[#0d1924] text-slate-100 p-6 sm:p-8 shadow-[0_6px_0_0_rgba(255,255,255,0.08)]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 75% 45%, rgba(56, 189, 248, 0.12), transparent 55%),
            linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 84px 84px, 84px 84px',
        }}
      >
        {/* Subtle Curved Airway Contour Lines + Graticule Labels */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1000 380"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none opacity-35"
        >
          <path d="M -20 90 Q 320 140 620 60 T 1040 160" fill="none" stroke="rgba(148,163,184,0.35)" strokeWidth="1.2" />
          <path d="M 100 380 Q 410 210 680 260 T 1040 110" fill="none" stroke="rgba(52,211,153,0.45)" strokeWidth="1.5" strokeDasharray="6 6" />
          <path d="M 650 0 Q 670 190 610 380" fill="none" stroke="rgba(52,211,153,0.4)" strokeWidth="1.5" strokeDasharray="5 5" />
        </svg>

        <span className="hidden md:block absolute left-3 top-[52%] font-mono text-[10px] text-slate-400/70">24°N</span>
        <span className="hidden md:block absolute left-[64%] top-3 font-mono text-[10px] text-emerald-300/70">1°W</span>

        {/* Tilted Floating Concept Tags */}
        <div className="hidden md:block relative h-12 pointer-events-none mb-2">
          {FLOATING_BADGES.slice(0, 4).map((b) => (
            <span
              key={b.text}
              style={{
                left: b.x,
                top: b.y,
                transform: `rotate(${b.rot})`,
                color: b.color,
              }}
              className="absolute px-2.5 py-1 rounded-lg border border-white/25 bg-[#0a131c]/90 font-mono text-xs font-bold shadow-md"
            >
              {b.text}
            </span>
          ))}
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: Selected Sector Briefing + 3 Direct Module Launchers */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <span
                  className="font-mono text-[11px] font-bold uppercase tracking-widest"
                  style={{ color: activeSector.color }}
                >
                  HEADING {String(activeSector.heading).padStart(3, '0')}° · {activeSector.shortLabel}
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full border border-white/15 bg-white/5 text-slate-300">
                  75% EASA PASS
                </span>
              </div>

              <h2 className="font-display text-2xl sm:text-4xl font-black tracking-tight text-white">
                {activeSector.label}
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed mt-2 max-w-xl">
                {activeSector.desc}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              {activeSector.subjects.map((subj) => (
                <button
                  key={subj.code}
                  type="button"
                  onClick={() => onNavigate(subj.view)}
                  className="px-3.5 py-3 rounded-xl border border-white/20 bg-[#101e2b]/90 hover:bg-white hover:text-slate-950 hover:border-white group flex items-center justify-between text-left transition-all cursor-pointer"
                >
                  <div className="min-w-0">
                    <div
                      className="font-mono text-[10px] font-bold tracking-wider group-hover:text-slate-600"
                      style={{ color: activeSector.color }}
                    >
                      SUBJ {subj.code}
                    </div>
                    <div className="text-xs font-bold truncate mt-0.5">{subj.name}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 shrink-0 opacity-70 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Large High-Contrast Draggable White-Bezel HSI Rose */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="mb-1.5 px-3 py-0.5 rounded-full bg-white text-slate-950 font-mono text-[11px] font-black tracking-wider shadow">
              SET HEADING: {String(heading).padStart(3, '0')}°
            </div>

            <svg
              ref={svgRef}
              viewBox="0 0 260 260"
              className="w-60 h-60 sm:w-64 sm:h-64 select-none cursor-grab active:cursor-grabbing touch-none drop-shadow-[0_14px_28px_rgba(0,0,0,0.55)]"
              onPointerDown={(e) => {
                draggingRef.current = true;
                e.currentTarget.setPointerCapture?.(e.pointerId);
                updateFromPointer(e.clientX, e.clientY);
              }}
              onPointerMove={(e) => {
                if (draggingRef.current) updateFromPointer(e.clientX, e.clientY);
              }}
              onPointerUp={() => {
                draggingRef.current = false;
              }}
            >
              {/* Crisp Bright White Bezel Ring */}
              <circle cx="130" cy="130" r="118" fill="#ffffff" />
              <circle cx="130" cy="130" r="96" fill="#0d1722" stroke="#1e293b" strokeWidth="1.5" />
              <circle cx="130" cy="130" r="64" fill="none" stroke="rgba(255,255,255,0.14)" strokeDasharray="3 4" />

              {/* 72 compass ticks + N/E/S/W + numbers */}
              {Array.from({ length: 36 }).map((_, i) => {
                const ang = i * 10;
                const rad = ((ang - 90) * Math.PI) / 180;
                const isCard = ang % 90 === 0;
                const isMajor = ang % 30 === 0;
                const r1 = isMajor ? 82 : 89;
                const r2 = 95;
                const lblR = 71;
                const cardMap: Record<number, string> = { 0: 'N', 90: 'E', 180: 'S', 270: 'W' };
                const lbl = isCard ? cardMap[ang] : isMajor ? String(ang / 10) : '';
                return (
                  <g key={i}>
                    <line
                      x1={130 + r1 * Math.cos(rad)}
                      y1={130 + r1 * Math.sin(rad)}
                      x2={130 + r2 * Math.cos(rad)}
                      y2={130 + r2 * Math.sin(rad)}
                      stroke={isMajor ? '#ffffff' : 'rgba(255,255,255,0.45)'}
                      strokeWidth={isMajor ? 2 : 1}
                    />
                    {lbl && (
                      <text
                        x={130 + lblR * Math.cos(rad)}
                        y={130 + lblR * Math.sin(rad) + 4}
                        textAnchor="middle"
                        fill="#f8fafc"
                        fontSize={isCard ? '13' : '10'}
                        fontWeight="800"
                        fontFamily="JetBrains Mono, monospace"
                      >
                        {lbl}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* 4 Colored Heading Bug Blocks on the White Bezel */}
              {SECTORS.map((s) => {
                const rad = ((s.heading - 90) * Math.PI) / 180;
                const bx = 130 + 107 * Math.cos(rad);
                const by = 130 + 107 * Math.sin(rad);
                const isSel = activeSector.id === s.id;
                return (
                  <g
                    key={s.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setHeading(s.heading);
                    }}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={bx}
                      cy={by}
                      r={isSel ? 9 : 6.5}
                      fill={s.color}
                      stroke="#0f172a"
                      strokeWidth={isSel ? 2.5 : 1.5}
                    />
                  </g>
                );
              })}

              {/* Radial Course Vector Line */}
              <line
                x1="130"
                y1="130"
                x2={courseEndX}
                y2={courseEndY}
                stroke={activeSector.color}
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.9"
              />

              {/* Center Crisp Airplane Silhouette */}
              <path
                d="M130 113 L133.5 123.5 L146 128.5 L146 132 L133.5 130.5 L133.5 139.5 L138 143 L138 145.5 L130 143 L122 145.5 L122 143 L126.5 139.5 L126.5 130.5 L114 132 L114 128.5 L126.5 123.5 Z"
                fill="#ffffff"
              />

              {/* Sector Pill Inside Rose */}
              <rect x="85" y="160" width="90" height="20" rx="10" fill="#1e293b" stroke={activeSector.color} strokeWidth="1.5" />
              <text
                x="130"
                y="173"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="8.5"
                fontWeight="700"
                fontFamily="JetBrains Mono, monospace"
              >
                {activeSector.shortLabel.toUpperCase()}
              </text>
            </svg>

            <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <Compass className="w-3 h-3" style={{ color: activeSector.color }} />
              <span>Drag dial ring or tap colored bugs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HsiSubjectCompass;
