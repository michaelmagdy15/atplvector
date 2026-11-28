import React, { useEffect, useRef, useState } from 'react';
import { Droplets, Thermometer } from 'lucide-react';
import { calculateDensityAltitude, calculateHumidAtmosphere } from '../../lib/atmospherePhysics';

interface Molecule {
  x: number;
  y: number;
  vx: number;
  vy: number;
  kind: 'N2' | 'O2' | 'Ar' | 'H2O';
  angle: number;
  spin: number;
}

const COLORS = {
  N2: '#38bdf8',
  O2: '#34d399',
  Ar: '#fbbf24',
  H2O: '#a78bfa',
};

export const KineticAtmosphereSandbox: React.FC<{
  pressureAltFt?: number;
  initialTempC?: number;
}> = ({ pressureAltFt = 0, initialTempC = 15 }) => {
  const [tempC, setTempC] = useState(initialTempC);
  const [humidTropical, setHumidTropical] = useState(false);
  const [highlightGas, setHighlightGas] = useState<'ALL' | 'N2' | 'O2' | 'Ar' | 'H2O'>('ALL');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ tempC, humidTropical, highlightGas });
  stateRef.current = { tempC, humidTropical, highlightGas };

  const moleculesRef = useRef<Molecule[]>([]);

  // Rebuild particle counts whenever humidity changes (78 N2, 21 O2, 1 Ar dry -> replace 4 with lighter H2O when humid)
  useEffect(() => {
    const list: Molecule[] = [];
    const n2Count = humidTropical ? 75 : 78;
    const o2Count = humidTropical ? 20 : 21;
    const h2oCount = humidTropical ? 4 : 0;

    const add = (kind: Molecule['kind'], count: number) => {
      for (let i = 0; i < count; i++) {
        const speedBase = kind === 'H2O' ? 1.28 : kind === 'N2' ? 1.0 : kind === 'O2' ? 0.94 : 0.85;
        const dir = Math.random() * Math.PI * 2;
        list.push({
          x: 20 + Math.random() * 440,
          y: 20 + Math.random() * 210,
          vx: Math.cos(dir) * speedBase * 1.4,
          vy: Math.sin(dir) * speedBase * 1.4,
          kind,
          angle: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.08,
        });
      }
    };
    add('N2', n2Count);
    add('O2', o2Count);
    add('Ar', 1);
    if (h2oCount > 0) add('H2O', h2oCount);
    moleculesRef.current = list;
  }, [humidTropical]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let visible = true;
    const obs =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver((e) => {
            visible = e[0]?.isIntersecting ?? true;
          })
        : null;
    obs?.observe(canvas);

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      if (!visible || document.hidden) return;

      const { tempC: tC, highlightGas: hi } = stateRef.current;
      const thermalScale = Math.sqrt(Math.max(180, tC + 273.15) / 288.15);
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      moleculesRef.current.forEach((m) => {
        m.x += m.vx * thermalScale;
        m.y += m.vy * thermalScale;
        m.angle += m.spin * thermalScale;

        if (m.x < 10) {
          m.x = 10;
          m.vx = Math.abs(m.vx);
        } else if (m.x > w - 10) {
          m.x = w - 10;
          m.vx = -Math.abs(m.vx);
        }
        if (m.y < 10) {
          m.y = 10;
          m.vy = Math.abs(m.vy);
        } else if (m.y > h - 10) {
          m.y = h - 10;
          m.vy = -Math.abs(m.vy);
        }

        const dimmed = hi !== 'ALL' && hi !== m.kind;
        ctx.save();
        ctx.translate(m.x, m.y);
        ctx.rotate(m.angle);
        ctx.globalAlpha = dimmed ? 0.16 : 0.92;
        ctx.fillStyle = COLORS[m.kind];

        if (m.kind === 'Ar') {
          ctx.beginPath();
          ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (m.kind === 'H2O') {
          // Bent H2O triatomic shape
          ctx.beginPath();
          ctx.arc(0, -1, 3.6, 0, Math.PI * 2);
          ctx.arc(-3.5, 2.5, 2.1, 0, Math.PI * 2);
          ctx.arc(3.5, 2.5, 2.1, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Diatomic dumbbell N2 or O2
          ctx.beginPath();
          ctx.arc(-3.2, 0, 3.2, 0, Math.PI * 2);
          ctx.arc(3.2, 0, 3.2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      obs?.disconnect();
    };
  }, []);

  const rh = humidTropical ? 92 : 0;
  const moist = calculateHumidAtmosphere(pressureAltFt, tempC, rh);
  const da = calculateDensityAltitude(pressureAltFt, moist.virtualTempC, 120);

  const gasCards: Array<{ key: 'N2' | 'O2' | 'Ar' | 'H2O'; label: string; pct: string; mass: string }> = [
    { key: 'N2', label: 'Nitrogen N₂', pct: humidTropical ? '75%' : '78%', mass: '28 g/mol' },
    { key: 'O2', label: 'Oxygen O₂', pct: humidTropical ? '20%' : '21%', mass: '32 g/mol' },
    { key: 'Ar', label: 'Argon Ar', pct: '1%', mass: '40 g/mol' },
    { key: 'H2O', label: 'Water Vapour H₂O', pct: humidTropical ? '4%' : '0%', mass: '18 g/mol (lighter!)' },
  ];

  return (
    <section className="dx-card p-5 sm:p-6 my-6" aria-label="Kinetic atmosphere molecule sandbox">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-line">
        <div>
          <div className="hud-label text-sky-400">ATMOS-100 // KINETIC MOLECULE SANDBOX</div>
          <h3 className="font-display text-lg sm:text-xl font-bold text-ink mt-0.5">
            What is air really made of — and why does humid air fly worse?
          </h3>
        </div>

        <button
          type="button"
          onClick={() => setHumidTropical((h) => !h)}
          className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-mono font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
            humidTropical
              ? 'border-violet-400 bg-violet-500/20 text-violet-200'
              : 'border-sky-400 bg-sky-500/15 text-sky-200 hover:bg-sky-500/25'
          }`}
        >
          <Droplets className="w-4 h-4" />
          {humidTropical ? 'Back to dry ISA air' : 'Make it humid tropical air'}
        </button>
      </div>

      {/* 100-Molecule Box + Live Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <div className="lg:col-span-7 border border-line-strong bg-bg relative overflow-hidden">
          <canvas
            ref={canvasRef}
            width={480}
            height={240}
            className="w-full h-[220px] sm:h-[250px] block"
          />
          <div className="px-3 py-2 border-t border-line bg-bg-sunken flex items-center justify-between gap-4 text-xs font-mono">
            <label className="flex items-center gap-2 flex-1">
              <Thermometer className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-muted">OAT</span>
              <input
                type="range"
                min={-30}
                max={45}
                value={tempC}
                onChange={(e) => setTempC(Number(e.target.value))}
                className="flex-1 accent-amber-400 cursor-pointer"
              />
              <span className="font-bold text-ink w-12 text-right">{tempC}°C</span>
            </label>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col justify-between gap-3">
          {/* Proportional Composition Bar */}
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted mb-1.5">
              100 molecules (click a gas below to isolate)
            </div>
            <div className="h-4 w-full flex border border-line overflow-hidden">
              <div style={{ width: humidTropical ? '75%' : '78%', backgroundColor: COLORS.N2 }} />
              <div style={{ width: humidTropical ? '20%' : '21%', backgroundColor: COLORS.O2 }} />
              <div style={{ width: '1%', backgroundColor: COLORS.Ar }} />
              {humidTropical && <div style={{ width: '4%', backgroundColor: COLORS.H2O }} />}
            </div>
          </div>

          {/* Click-to-highlight Gas Cards */}
          <div className="grid grid-cols-2 gap-2">
            {gasCards.map((g) => {
              const active = highlightGas === g.key;
              return (
                <button
                  key={g.key}
                  type="button"
                  onClick={() => setHighlightGas(active ? 'ALL' : g.key)}
                  className={`p-2.5 border text-left transition-colors cursor-pointer ${
                    active
                      ? 'border-ink bg-bg-sunken'
                      : 'border-line bg-bg hover:border-line-strong'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-xs font-bold">
                    <span style={{ color: COLORS[g.key] }}>{g.label}</span>
                    <span className="text-ink">{g.pct}</span>
                  </div>
                  <div className="text-[10px] font-mono text-muted mt-0.5">{g.mass}</div>
                </button>
              );
            })}
          </div>

          {/* Live Physics Readout */}
          <div className="grid grid-cols-2 gap-2 font-mono">
            <div className="border border-line bg-bg p-2.5">
              <div className="text-[9px] uppercase text-muted">Air Density ρ</div>
              <div className="text-sm font-bold text-ink">
                {moist.moistDensityKgM3.toFixed(3)} kg/m³
              </div>
            </div>
            <div className="border border-line bg-bg p-2.5">
              <div className="text-[9px] uppercase text-muted">Virtual DA (w/ H₂O)</div>
              <div className="text-sm font-bold text-amber-300">
                {Math.round(da.densityAltitudeFt).toLocaleString()} ft
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KineticAtmosphereSandbox;
