import React, { useMemo, useRef, useState } from 'react';
import { ChevronRight, Compass } from 'lucide-react';
import { View } from '../../types';

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
    shortLabel: 'LAW / OPS',
    color: '#f43f5e',
    desc: 'ICAO Chicago/Annexes, SERA, CAT minima, and RTF phraseology.',
    subjects: [
      { code: '010', name: 'Air Law & Treaties', view: View.AIR_LAW_HOME },
      { code: '070', name: 'Ops Procedures', view: View.OPS_PROC_HOME },
      { code: '090', name: 'VFR/IFR Comms', view: View.DASHBOARD },
    ],
  },
  {
    id: 'tech-pof',
    heading: 30,
    label: 'Tech General, Instruments & PoF',
    shortLabel: 'TECH / POF',
    color: '#14b8a6',
    desc: '3D A320 aerodynamics, stall, hydraulics, IDG electrics, and EFIS/TCAS.',
    subjects: [
      { code: '081', name: 'Forces 3D Wind Tunnel', view: View.CONCEPT_FORCES_OF_FLIGHT },
      { code: '021', name: 'AGK Systems', view: View.AGK_SYSTEMS_HOME },
      { code: '022', name: 'Instrumentation', view: View.INST_HOME },
    ],
  },
  {
    id: 'nav-met',
    heading: 120,
    label: 'Meteorology & Navigation',
    shortLabel: 'MET / NAV',
    color: '#38bdf8',
    desc: 'ISA molecular physics, charts, Great Circle convergency, VOR/ILS & GNSS.',
    subjects: [
      { code: '050', name: 'Atmos Chain Lab', view: View.FOUNDATION_ATM_PERF_CHAIN },
      { code: '061', name: 'Gen Navigation', view: View.GEN_NAV_HOME },
      { code: '062', name: 'Radio Navigation', view: View.RAD_NAV_HOME },
    ],
  },
  {
    id: 'perf-hpl',
    heading: 220,
    label: 'Performance, Mass & HPL',
    shortLabel: 'PERF / M&B',
    color: '#ec4899',
    desc: 'CS-25 runway roll, Balanced Field V1, RTOM 3-columns, fuel PET/PSR, and physiology.',
    subjects: [
      { code: '032', name: 'Take-Off 3D Story', view: View.PERF_TAKEOFF },
      { code: '031', name: 'Mass & Balance', view: View.MASS_BAL_HOME },
      { code: '033', name: 'Flight Planning', view: View.FLIGHT_PLAN_HOME },
    ],
  },
];

function circularDiff(a: number, b: number): number {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

export const HsiSubjectCompass: React.FC<{
  onNavigate: (view: View) => void;
}> = ({ onNavigate }) => {
  const [heading, setHeading] = useState(220);
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

  return (
    <div
      data-autopilot-target="hsi-compass"
      className="border border-line-strong bg-bg p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5"
    >
      {/* Draggable SVG HSI Dial */}
      <div className="relative shrink-0 flex flex-col items-center">
        <svg
          ref={svgRef}
          viewBox="0 0 220 220"
          className="w-44 h-44 select-none cursor-grab active:cursor-grabbing touch-none"
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
          <circle cx="110" cy="110" r="98" fill="var(--bg-raised)" stroke="var(--line-strong)" strokeWidth="2" />
          <circle cx="110" cy="110" r="66" fill="none" stroke="var(--line)" strokeDasharray="3 4" />

          {/* 36 compass tick marks */}
          {Array.from({ length: 36 }).map((_, i) => {
            const ang = i * 10;
            const rad = ((ang - 90) * Math.PI) / 180;
            const major = i % 3 === 0;
            const r1 = major ? 82 : 89;
            const r2 = 95;
            return (
              <line
                key={i}
                x1={110 + r1 * Math.cos(rad)}
                y1={110 + r1 * Math.sin(rad)}
                x2={110 + r2 * Math.cos(rad)}
                y2={110 + r2 * Math.sin(rad)}
                stroke={major ? 'var(--ink)' : 'var(--muted)'}
                strokeWidth={major ? 1.8 : 1}
                opacity={major ? 0.85 : 0.4}
              />
            );
          })}

          {/* 4 Subject Heading Bugs */}
          {SECTORS.map((s) => {
            const rad = ((s.heading - 90) * Math.PI) / 180;
            const bx = 110 + 73 * Math.cos(rad);
            const by = 110 + 73 * Math.sin(rad);
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
                  r={isSel ? 8.5 : 5.5}
                  fill={s.color}
                  stroke="#fff"
                  strokeWidth={isSel ? 2 : 1}
                />
              </g>
            );
          })}

          {/* Rotating CDI Needle */}
          <g transform={`rotate(${heading} 110 110)`}>
            <line x1="110" y1="32" x2="110" y2="188" stroke={activeSector.color} strokeWidth="2.5" />
            <polygon points="110,20 104,35 116,35" fill={activeSector.color} />
          </g>

          {/* Center Mini Aircraft Symbol */}
          <path d="M110 98 L113 107 L124 111 L124 114 L113 113 L113 121 L117 124 L117 126 L110 124 L103 126 L103 124 L107 121 L107 113 L96 114 L96 111 L107 107 Z" fill="var(--ink)" />
        </svg>

        <div className="mt-1 font-mono text-[10px] font-bold tracking-widest uppercase text-muted flex items-center gap-1.5">
          <Compass className="w-3 h-3 text-cad-accent" />
          <span>SET HEADING: {String(heading).padStart(3, '0')}°</span>
        </div>
      </div>

      {/* Selected Pillar Quick-Launch Panel */}
      <div className="flex-1 min-w-0 space-y-3 w-full">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="hud-label" style={{ color: activeSector.color }}>
              HDG {String(activeSector.heading).padStart(3, '0')}° · {activeSector.shortLabel}
            </span>
            <span className="font-mono text-[10px] text-muted">75% EASA PASS</span>
          </div>
          <h3 className="font-display text-lg font-bold text-ink mt-0.5 truncate">
            {activeSector.label}
          </h3>
          <p className="text-xs text-muted leading-relaxed">{activeSector.desc}</p>
        </div>

        <div className="grid grid-cols-1 gap-1.5">
          {activeSector.subjects.map((subj) => (
            <button
              key={subj.code}
              type="button"
              onClick={() => onNavigate(subj.view)}
              className="w-full px-3 py-2 border border-line bg-bg-raised hover:border-line-strong flex items-center justify-between text-xs font-medium text-ink transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2 truncate">
                <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 bg-bg-sunken border border-line" style={{ color: activeSector.color }}>
                  {subj.code}
                </span>
                <span className="truncate font-semibold">{subj.name}</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-muted shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HsiSubjectCompass;
