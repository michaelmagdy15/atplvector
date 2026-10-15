import React, { useEffect, useRef, useState } from 'react';
import { Compass, Activity, Wind, Layers, Radio } from 'lucide-react';

interface ScenarioPreset {
  id: string;
  code: string;
  name: string;
  pitch: number;
  roll: number;
  mach: string;
  fl: string;
  aoa: string;
  clcd: string;
  vorCourse: string;
  status: string;
}

const PRESETS: ScenarioPreset[] = [
  {
    id: 'cruise',
    code: '081 / POF',
    name: 'HIGH-ALTITUDE MACH CRUISE',
    pitch: 2.4,
    roll: -4.0,
    mach: 'M 0.82',
    fl: 'FL370',
    aoa: '2.8°',
    clcd: '18.4 L/D',
    vorCourse: 'CRS 284°',
    status: 'COFFIN CORNER MARGIN +14 KT',
  },
  {
    id: 'ils',
    code: '062 / RNAV',
    name: 'CAT IIIB AUTOLAND INTERCEPT',
    pitch: -3.0,
    roll: 8.5,
    mach: '142 KTS',
    fl: '01,200 FT',
    aoa: '6.1°',
    clcd: 'FLAPS 30',
    vorCourse: 'ILS 109.90',
    status: 'LOC CAPTURE · GLIDESLOPE LOCKED',
  },
  {
    id: 'engineout',
    code: '032 / PERF',
    name: 'V1 ENGINE-OUT CLIMB VECTOR',
    pitch: 12.5,
    roll: 5.0,
    mach: 'V2 151 KT',
    fl: '00,850 FT',
    aoa: '11.4°',
    clcd: 'ASYM YAW',
    vorCourse: 'EOSID 094°',
    status: 'RUDDER TRIM +14° · TOGA THRUST',
  },
];

export const FlightDeckSplitViewport: React.FC<{
  onLaunchDemo?: () => void;
}> = ({ onLaunchDemo }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wireCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [splitPct, setSplitPct] = useState(52);
  const [activePreset, setActivePreset] = useState<ScenarioPreset>(PRESETS[0]);
  const pointerXRef = useRef<number | null>(null);
  const splitValRef = useRef(52);

  // Smooth split-screen divider physics (exact ArtCraft module 44498 exponential damping)
  useEffect(() => {
    let raf = 0;
    let last = performance.now();

    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const target =
        pointerXRef.current !== null
          ? pointerXRef.current
          : 50 + 18 * Math.sin(now / 1000 / 3.1);
      splitValRef.current += (target - splitValRef.current) * (1 - Math.exp(-6.5 * dt));
      setSplitPct(splitValRef.current);
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  // 3D Wireframe CAD Canvas on the left viewport
  useEffect(() => {
    const canvas = wireCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // 3D Swept-Wing Jet Airframe Wireframe Vertices
    const vertices: [number, number, number][] = [
      // Nose & Fuselage spine
      [0, 0, 2.2],
      [0, 0.22, 1.5],
      [0, -0.18, 1.5],
      [-0.24, 0, 1.5],
      [0.24, 0, 1.5],
      [0, 0.28, -1.6],
      [0, -0.2, -1.6],
      [-0.28, 0, -1.6],
      [0.28, 0, -1.6],
      [0, 0.12, -2.35],
      // Swept Main Wings
      [-0.28, -0.02, 0.45],
      [-2.35, -0.08, -0.65],
      [-2.42, 0.22, -0.82], // Winglet L
      [-0.28, -0.02, -0.45],
      [0.28, -0.02, 0.45],
      [2.35, -0.08, -0.65],
      [2.42, 0.22, -0.82], // Winglet R
      [0.28, -0.02, -0.45],
      // Vertical & Horizontal Stabilizers
      [0, 0.28, -1.35],
      [0, 1.05, -2.15],
      [0, 1.05, -2.42],
      [-0.95, 0.08, -2.15],
      [0.95, 0.08, -2.15],
    ];

    const edges: [number, number][] = [
      // Nose cone
      [0, 1], [0, 2], [0, 3], [0, 4],
      [1, 3], [3, 2], [2, 4], [4, 1],
      // Fuselage longerons
      [1, 5], [2, 6], [3, 7], [4, 8],
      [5, 7], [7, 6], [6, 8], [8, 5],
      // Tail cone
      [5, 9], [6, 9], [7, 9], [8, 9],
      // Left wing + winglet
      [10, 11], [11, 12], [11, 13], [10, 13], [3, 10], [7, 13],
      // Right wing + winglet
      [14, 15], [15, 16], [15, 17], [14, 17], [4, 14], [8, 17],
      // Vertical fin
      [18, 19], [19, 20], [20, 9],
      // Horizontal tailplane
      [5, 21], [9, 21], [5, 22], [9, 22],
    ];

    let rafId = 0;
    const draw = (nowMs: number) => {
      const t = nowMs / 1000;
      ctx.clearRect(0, 0, w, h);

      // Background CAD dark blueprint surface
      ctx.fillStyle = '#090b10';
      ctx.fillRect(0, 0, w, h);

      const cx = w * 0.5;
      const cy = h * 0.52;
      const scale = Math.min(w, h) * 0.16;

      // Camera / Aircraft orientation driven by preset + gentle orbit
      const yaw = t * 0.38;
      const pitchRad = (activePreset.pitch * Math.PI) / 180 + 0.28;
      const rollRad = (activePreset.roll * Math.PI) / 180 + Math.sin(t * 0.9) * 0.06;

      const project = (vx: number, vy: number, vz: number): [number, number, number] => {
        // Roll around Z
        const x1 = vx * Math.cos(rollRad) - vy * Math.sin(rollRad);
        const y1 = vx * Math.sin(rollRad) + vy * Math.cos(rollRad);
        const z1 = vz;
        // Yaw around Y
        const x2 = x1 * Math.cos(yaw) + z1 * Math.sin(yaw);
        const y2 = y1;
        const z2 = -x1 * Math.sin(yaw) + z1 * Math.cos(yaw);
        // Pitch around X
        const x3 = x2;
        const y3 = y2 * Math.cos(pitchRad) - z2 * Math.sin(pitchRad);
        const z3 = y2 * Math.sin(pitchRad) + z2 * Math.cos(pitchRad);

        const fov = 5.2 / (5.2 - z3 * 0.45);
        return [cx + x3 * scale * fov, cy - y3 * scale * fov, z3];
      };

      // 1. Perspective CAD Ground Reference Grid
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.11)';
      ctx.lineWidth = 1;
      for (let g = -3; g <= 3; g++) {
        const [xA, yA] = project(g * 0.85, -1.15, -2.6);
        const [xB, yB] = project(g * 0.85, -1.15, 2.6);
        ctx.beginPath();
        ctx.moveTo(xA, yA);
        ctx.lineTo(xB, yB);
        ctx.stroke();

        const [xC, yC] = project(-2.6, -1.15, g * 0.85);
        const [xD, yD] = project(2.6, -1.15, g * 0.85);
        ctx.beginPath();
        ctx.moveTo(xC, yC);
        ctx.lineTo(xD, yD);
        ctx.stroke();
      }

      // 2. Aerodynamic Force Vectors (Lift, Weight, Thrust, Drag)
      const [ox, oy] = project(0, 0, 0);
      const drawVectorArrow = (
        tx: number,
        ty: number,
        tz: number,
        color: string,
        label: string
      ) => {
        const [px, py] = project(tx, ty, tz);
        ctx.save();
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(px, py);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '600 10px "JetBrains Mono", monospace';
        ctx.fillText(label, px + 6, py - 4);
        ctx.restore();
      };

      drawVectorArrow(0, 1.45, 0, '#10b981', 'LIFT (CL)');
      drawVectorArrow(0, -1.25, 0, '#f59e0b', 'WEIGHT (MG)');
      drawVectorArrow(0, 0, 2.85, '#3b82f6', `THRUST (${activePreset.mach})`);
      drawVectorArrow(0, 0, -2.75, '#38bdf8', 'DRAG (CD)');

      // 3. Project & Draw Airframe Wireframe Mesh
      const projVerts = vertices.map(([vx, vy, vz]) => project(vx, vy, vz));

      ctx.strokeStyle = 'rgba(243, 242, 238, 0.78)';
      ctx.lineWidth = 1.25;
      for (const [a, b] of edges) {
        const [x1, y1] = projVerts[a];
        const [x2, y2] = projVerts[b];
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // Draw CAD Vertex Nodes
      ctx.fillStyle = '#3b82f6';
      for (const [px, py] of projVerts) {
        ctx.fillRect(px - 1.75, py - 1.75, 3.5, 3.5);
      }

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [activePreset]);

  return (
    <div className="border border-line bg-bg-sunken">
      {/* Top Scenario Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-bg px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 bg-cad-accent inline-block" />
          <span className="hud-label text-ink">
            INTERACTIVE SPLIT TELEMETRY · SCRUB CURSOR ACROSS VIEWPORT
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          {PRESETS.map((preset) => {
            const active = preset.id === activePreset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => setActivePreset(preset)}
                className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.12em] border transition-colors cursor-pointer ${
                  active
                    ? 'bg-cad-accent text-white border-cad-accent'
                    : 'bg-bg text-muted border-line hover:text-ink'
                }`}
              >
                {preset.code} · {preset.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Split Viewport Container */}
      <div
        ref={containerRef}
        onPointerMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const pct = ((e.clientX - rect.left) / rect.width) * 100;
          pointerXRef.current = Math.max(6, Math.min(94, pct));
        }}
        onPointerLeave={() => {
          pointerXRef.current = null;
        }}
        className="relative h-[420px] md:h-[520px] w-full overflow-hidden select-none cursor-ew-resize"
      >
        {/* RIGHT LAYER (Base): Rendered Glass Cockpit EASA Simulator */}
        <div className="absolute inset-0 bg-[#0d1117] text-[#f3f2ee] p-6 md:p-10 flex flex-col justify-between">
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle at 70% 35%, rgba(255, 82, 16, 0.28), transparent 55%), linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
              backgroundSize: '100% 100%, 32px 32px, 32px 32px',
            }}
          />

          {/* Top Cockpit Telemetry Strip */}
          <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-4">
              <div className="px-2.5 py-1 bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-mono text-[11px] tracking-widest uppercase">
                AP1 · FD · A/THR
              </div>
              <div className="hidden sm:flex items-center gap-3 font-mono text-xs text-white/70">
                <span>SPD: <strong className="text-white">{activePreset.mach}</strong></span>
                <span className="text-white/25">|</span>
                <span>ALT: <strong className="text-sky-400">{activePreset.fl}</strong></span>
                <span className="text-white/25">|</span>
                <span>NAV: <strong className="text-amber-400">{activePreset.vorCourse}</strong></span>
              </div>
            </div>
            <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-white/50">
              EASA ECQB-2026 · LIVE COCKPIT RENDER
            </span>
          </div>

          {/* Center PFD + ND Dual Glass Display */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 my-auto py-4">
            {/* Primary Flight Display (Artificial Horizon) */}
            <div className="border border-white/15 bg-black/55 backdrop-blur-md p-4 relative overflow-hidden">
              <div className="flex items-center justify-between text-[10px] font-mono text-white/60 mb-3">
                <span className="flex items-center gap-1.5 text-sky-400">
                  <Activity className="w-3.5 h-3.5" /> PFD · ATTITUDE DIRECTOR
                </span>
                <span>PITCH {activePreset.pitch > 0 ? `+${activePreset.pitch}` : activePreset.pitch}°</span>
              </div>

              <div className="relative h-44 border border-white/10 overflow-hidden flex items-center justify-center bg-gradient-to-b from-sky-900/50 via-sky-950/30 to-amber-950/50">
                {/* Horizon Line & Pitch Ladder */}
                <div
                  className="w-64 h-64 relative flex items-center justify-center transition-transform duration-500"
                  style={{
                    transform: `rotate(${-activePreset.roll}deg) translateY(${activePreset.pitch * 3}px)`,
                  }}
                >
                  <div className="w-full h-px bg-emerald-400/80 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  <div className="absolute -top-6 w-16 h-px bg-white/50" />
                  <div className="absolute -top-12 w-24 h-px bg-white/50" />
                  <div className="absolute top-6 w-16 h-px bg-white/50" />
                  <div className="absolute top-12 w-24 h-px bg-white/50" />
                </div>

                {/* Fixed Aircraft Reference Symbol */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-1 border-t-2 border-r-2 border-amber-400" />
                    <div className="w-2 h-2 bg-amber-400" />
                    <div className="w-8 h-1 border-t-2 border-l-2 border-amber-400" />
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] font-mono">
                <span className="text-white/60">AOA: <strong className="text-white">{activePreset.aoa}</strong></span>
                <span className="text-emerald-400">{activePreset.clcd}</span>
              </div>
            </div>

            {/* Navigation Display (HSI / VOR / Wind Vector) */}
            <div className="border border-white/15 bg-black/55 backdrop-blur-md p-4 relative overflow-hidden">
              <div className="flex items-center justify-between text-[10px] font-mono text-white/60 mb-3">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <Compass className="w-3.5 h-3.5" /> ND · HSI &amp; WIND VECTOR
                </span>
                <span>{activePreset.vorCourse}</span>
              </div>

              <div className="relative h-44 border border-white/10 flex items-center justify-center bg-[#06090e]">
                <svg viewBox="0 0 180 180" className="w-40 h-40">
                  <circle
                    cx="90"
                    cy="90"
                    r="72"
                    fill="none"
                    stroke="rgba(255,255,255,0.18)"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <circle
                    cx="90"
                    cy="90"
                    r="44"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="1"
                  />
                  <line x1="90" y1="14" x2="90" y2="166" stroke="rgba(56,189,248,0.35)" strokeWidth="1" />
                  <line x1="14" y1="90" x2="166" y2="90" stroke="rgba(56,189,248,0.35)" strokeWidth="1" />
                  {/* Course Deviation Bar */}
                  <line
                    x1="90"
                    y1="26"
                    x2="90"
                    y2="154"
                    stroke="#ff5210"
                    strokeWidth="2.2"
                  />
                  <polygon points="90,20 85,30 95,30" fill="#ff5210" />
                  {/* Aircraft triangle */}
                  <polygon points="90,82 84,96 96,96" fill="#fff" />
                </svg>
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] font-mono">
                <span className="text-sky-400">{activePreset.status}</span>
                {onLaunchDemo && (
                  <button
                    type="button"
                    onClick={onLaunchDemo}
                    className="text-cad-accent hover:underline uppercase cursor-pointer"
                  >
                    OPEN SIM →
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Bottom right label */}
          <div className="relative z-10 flex justify-end">
            <div className="inline-flex items-center gap-2 border border-white/20 bg-black/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white">
              <Radio className="w-3 h-3 text-emerald-400" />
              GLASS COCKPIT SIMULATOR — INTERACTIVE EASA LAB
            </div>
          </div>
        </div>

        {/* LEFT LAYER (Clipped by Split): 3D Aerodynamic Wireframe Blocking */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            clipPath: `inset(0 ${(100 - splitPct).toFixed(2)}% 0 0)`,
          }}
        >
          <canvas ref={wireCanvasRef} className="w-full h-full block" />

          {/* Top-left wireframe HUD overlay */}
          <div className="absolute top-6 left-6 border border-white/15 bg-black/70 backdrop-blur-sm px-3.5 py-2 font-mono text-[11px] text-white/80 space-y-1">
            <div className="text-cad-accent font-semibold tracking-wider">
              CAD MESH // AERODYNAMIC VECTOR SOLVER
            </div>
            <div className="text-white/55 text-[10px]">
              VERTICES: 23 · EDGES: 38 · EULER PITCH {activePreset.pitch}° · ROLL {activePreset.roll}°
            </div>
          </div>

          {/* Bottom-left badge */}
          <div className="absolute bottom-6 left-6 inline-flex items-center gap-2 border border-white/20 bg-black/75 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white">
            <Layers className="w-3 h-3 text-cad-accent" />
            3D WIREFRAME — AERODYNAMIC TELEMETRY
          </div>
        </div>

        {/* Glowing Laser Split Line + Crosshair Handle */}
        <div
          className="absolute inset-y-0 z-20 pointer-events-none"
          style={{ left: `${splitPct.toFixed(2)}%` }}
        >
          <div className="h-full w-px bg-cad-accent shadow-[0_0_12px_1px_var(--accent)]" />
          <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 h-9 w-9 border border-cad-accent bg-bg/90 flex items-center justify-center font-mono text-[10px] text-cad-accent shadow-lg">
            ↔
          </div>
        </div>
      </div>
    </div>
  );
};
