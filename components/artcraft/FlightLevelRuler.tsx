import React, { useEffect, useRef, useState } from 'react';

const SECTIONS = [
  { id: 'flight-plan', code: '01', label: 'FLIGHT PLAN' },
  { id: 'capabilities', code: '02', label: 'SIMULATOR' },
  { id: 'viewport-3d', code: '03', label: '3D VIEWPORT' },
  { id: 'live-demo', code: '04', label: 'LIVE LAB' },
  { id: 'pricing', code: '05', label: 'PRICING' },
];

export const FlightLevelRuler: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [hoverFrac, setHoverFrac] = useState<number | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const railRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);

  useEffect(() => {
    let rafId = 0;
    let lastScroll = window.scrollY;
    let smoothVel = 0;

    const update = () => {
      const sy = window.scrollY;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, sy / maxScroll));
      const delta = Math.abs(sy - lastScroll);
      lastScroll = sy;
      smoothVel = smoothVel * 0.82 + Math.min(1, delta / 45) * 0.18;

      setProgress(p);
      setVelocity(smoothVel);

      // Determine active section
      const viewportMid = sy + window.innerHeight * 0.35;
      let current = 0;
      SECTIONS.forEach((sec, idx) => {
        const el = document.getElementById(sec.id);
        if (el && el.offsetTop <= viewportMid) {
          current = idx;
        }
      });
      setActiveIdx(current);

      if (smoothVel > 0.01) {
        rafId = requestAnimationFrame(update);
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const scrubToClientY = (clientY: number) => {
    const rail = railRef.current;
    if (!rail) return;
    const rect = rail.getBoundingClientRect();
    const pad = 48;
    const usable = Math.max(1, rect.height - pad * 2);
    const frac = Math.min(1, Math.max(0, (clientY - rect.top - pad) / usable));
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    window.scrollTo({ top: frac * maxScroll, behavior: 'auto' });
  };

  const TICKS = 41;
  const pctInt = Math.round(progress * 100);
  const flReadout = `FL${String(Math.round(progress * 390)).padStart(3, '0')}`;

  return (
    <div
      ref={railRef}
      onPointerDown={(e) => {
        draggingRef.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        scrubToClientY(e.clientY);
      }}
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const pad = 48;
        const usable = Math.max(1, rect.height - pad * 2);
        const frac = Math.min(1, Math.max(0, (e.clientY - rect.top - pad) / usable));
        setHoverFrac(frac);
        if (draggingRef.current) {
          scrubToClientY(e.clientY);
        }
      }}
      onPointerUp={(e) => {
        draggingRef.current = false;
        e.currentTarget.releasePointerCapture(e.pointerId);
      }}
      onPointerLeave={() => {
        draggingRef.current = false;
        setHoverFrac(null);
      }}
      className="fixed right-0 top-12 bottom-0 z-40 hidden xl:block w-[64px] select-none cursor-crosshair"
      aria-hidden="true"
    >
      {/* Left border hairline */}
      <div className="absolute left-0 inset-y-0 w-px bg-line/60" />

      {/* Top Altimeter Scale Ticks */}
      <div className="relative h-full w-full">
        {Array.from({ length: TICKS }, (_, idx) => {
          const frac = idx / (TICKS - 1);
          const isMajor = idx % 10 === 0;
          const isMid = idx % 5 === 0 && !isMajor;
          const distNeedle = Math.abs(frac - progress);
          const nearNeedle = Math.max(0, 1 - distNeedle / 0.08);
          const nearHover =
            hoverFrac !== null ? Math.max(0, 1 - Math.abs(frac - hoverFrac) / 0.07) : 0;

          const baseW = isMajor ? 18 : isMid ? 11 : 6;
          const dynamicW = Math.round(baseW + nearNeedle * 10 * (1 + velocity) + nearHover * 8);
          const alpha = Math.min(
            0.9,
            (isMajor ? 0.38 : isMid ? 0.24 : 0.14) + nearNeedle * 0.45 + nearHover * 0.35
          );

          return (
            <div
              key={idx}
              className="absolute right-0 flex items-center justify-end pointer-events-none"
              style={{
                top: `calc(28px + (100% - 176px) * ${frac.toFixed(4)})`,
                transform: 'translateY(-50%)',
              }}
            >
              {isMajor && (
                <span
                  className="mr-1.5 font-mono text-[8px] tracking-[0.06em] tabular-nums"
                  style={{ color: 'var(--ink)', opacity: alpha * 0.85 }}
                >
                  {String(idx * 10).padStart(3, '0')}
                </span>
              )}
              <span
                className="block h-px transition-[width] duration-75"
                style={{
                  width: `${dynamicW}px`,
                  background: nearNeedle > 0.4 ? 'var(--accent)' : 'var(--ink)',
                  opacity: alpha,
                }}
              />
            </div>
          );
        })}

        {/* Active Altimeter / Scroll Needle Readout */}
        <div
          className="absolute right-0 flex items-center pointer-events-none whitespace-nowrap"
          style={{
            top: `calc(28px + (100% - 176px) * ${progress.toFixed(4)})`,
            transform: 'translateY(-50%)',
          }}
        >
          <span className="mr-1.5 px-1.5 py-0.5 bg-bg/95 border border-cad-accent/60 font-mono text-[9px] font-semibold tracking-[0.06em] text-cad-accent tabular-nums shadow-sm whitespace-nowrap">
            {flReadout} · {String(pctInt).padStart(2, '0')}%
          </span>
          <span className="block h-[2px] w-5 bg-cad-accent shadow-[0_0_8px_var(--accent)]" />
        </div>

        {/* Bottom-Right Section Quick-Jump Index */}
        <div
          onPointerDown={(e) => e.stopPropagation()}
          className="fixed bottom-4 right-2 z-50 flex flex-col items-end gap-0.5 bg-bg/85 backdrop-blur-md border border-line p-1.5"
        >
          {SECTIONS.map((sec, idx) => {
            const active = idx === activeIdx;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => {
                  const el = document.getElementById(sec.id);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`group flex items-center gap-1.5 px-1.5 py-0.5 font-mono text-[8px] tracking-[0.14em] uppercase transition-colors cursor-pointer ${
                  active ? 'text-cad-accent font-semibold' : 'text-muted hover:text-ink'
                }`}
              >
                <span className="opacity-60">{sec.code}</span>
                <span>{sec.label}</span>
                <span
                  className={`block h-px transition-all ${
                    active ? 'w-3 bg-cad-accent' : 'w-1.5 bg-line-strong group-hover:w-2.5'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
