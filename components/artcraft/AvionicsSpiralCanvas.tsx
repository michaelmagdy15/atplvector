import React, { useEffect, useRef } from 'react';

interface TelemetryCardItem {
  code: string;
  title: string;
  metric: string;
  sub: string;
  accentColor: string;
  kind: 'vor' | 'sine' | 'wind' | 'hold' | 'pfd' | 'polar' | 'metar' | 'tc';
}

const TELEMETRY_DECK: TelemetryCardItem[] = [
  { code: '010', title: 'AIR LAW · ICAO', metric: 'FL350 RVSM', sub: 'SEP MINIMA 1000FT', accentColor: '#3b82f6', kind: 'hold' },
  { code: '021', title: 'AIRFRAME & SYS', metric: 'HYD 3000 PSI', sub: 'BUS TIE AUTO', accentColor: '#38bdf8', kind: 'pfd' },
  { code: '022', title: 'INSTRUMENTATION', metric: 'MACH 0.82', sub: 'FMC LNAV/VNAV', accentColor: '#6366f1', kind: 'vor' },
  { code: '031', title: 'MASS & BALANCE', metric: 'MAC 27.4%', sub: 'ZFW 58,400 KG', accentColor: '#10b981', kind: 'polar' },
  { code: '032', title: 'PERF CLASS A', metric: 'V1 142 KT', sub: 'VR 146 / V2 151', accentColor: '#8b5cf6', kind: 'sine' },
  { code: '033', title: 'FLIGHT PLANNING', metric: 'ETOPS 180', sub: 'FUEL RSV +4,200KG', accentColor: '#38bdf8', kind: 'wind' },
  { code: '040', title: 'HUMAN PERF', metric: 'SPO2 98%', sub: 'TUC FL400 15S', accentColor: '#a855f7', kind: 'sine' },
  { code: '050', title: 'METEOROLOGY', metric: 'CB FL410', sub: 'JET 270/135KT', accentColor: '#06b6d4', kind: 'metar' },
  { code: '061', title: 'GENERAL NAV', metric: 'GC 284°T', sub: 'CONV ANGLE 4.2°', accentColor: '#3b82f6', kind: 'wind' },
  { code: '062', title: 'RADIO NAV · ILS', metric: 'CAT IIIB', sub: 'LOC 109.90 MHZ', accentColor: '#10b981', kind: 'vor' },
  { code: '070', title: 'OPS PROCEDURES', metric: 'RVR 125M', sub: 'ALL WX OPS', accentColor: '#6366f1', kind: 'hold' },
  { code: '081', title: 'PRINCIPLES FLIGHT', metric: 'CL/CD MAX', sub: 'ALPHA CRIT 16.2°', accentColor: '#8b5cf6', kind: 'polar' },
  { code: '090', title: 'VFR / IFR COMMS', metric: '121.500 MHZ', sub: 'SELCAL AL-BM', accentColor: '#38bdf8', kind: 'tc' },
  { code: '100', title: 'KSA · TEM MATRIX', metric: 'FORDEC 100%', sub: 'DECISION VECTOR', accentColor: '#10b981', kind: 'pfd' },
];

interface SpiralCardInstance {
  arm: number;
  s: number;
  speed: number;
  baseW: number;
  baseH: number;
  rotOffset: number;
  phase: number;
  item: TelemetryCardItem;
  hover: number;
  boost: number;
  rx: number;
  ry: number;
  sx: number;
  sy: number;
  w: number;
  h: number;
  rot: number;
}

interface Ripple {
  x: number;
  y: number;
  t: number;
}

export const AvionicsSpiralCanvas: React.FC<{
  onSelectSubject?: (code: string) => void;
}> = ({ onSelectSubject }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cardsRef = useRef<SpiralCardInstance[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);
  const pointerRef = useRef({ x: -9999, y: -9999, inside: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const ARMS = 6;
    const PER_ARM = 4;
    const THETA_MAX = 2.65 * Math.PI;
    const THETA_MIN = 0.25 * Math.PI;

    // Initialize spiral cards across 6 arms (exact ArtCraft module 17031 math)
    const instances: SpiralCardInstance[] = [];
    for (let arm = 0; arm < ARMS; arm++) {
      for (let i = 0; i < PER_ARM; i++) {
        const idx = (arm * PER_ARM + i) % TELEMETRY_DECK.length;
        const item = TELEMETRY_DECK[idx];
        const isWide = (arm + i) % 3 === 0;
        instances.push({
          arm,
          s: (i + (arm % 2) * 0.5) / PER_ARM,
          speed: 0.022 + (arm % 3) * 0.004,
          baseW: isWide ? 168 : 148,
          baseH: isWide ? 104 : 96,
          rotOffset: ((arm * 7 + i * 13) % 9 - 4) * 0.018,
          phase: arm * 1.1 + i * 0.9,
          item,
          hover: 0,
          boost: 0,
          rx: 0,
          ry: 0,
          sx: 0,
          sy: 0,
          w: 148,
          h: 96,
          rot: 0,
        });
      }
    }
    cardsRef.current = instances;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const inside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;
      pointerRef.current = { x, y, inside };
    };

    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || x > rect.width || y < 0 || y > rect.height) return;

      ripplesRef.current.push({
        x,
        y,
        t: performance.now() / 1000,
      });

      // Check if user clicked near a telemetry card or disperse cards outward
      let hitCard: SpiralCardInstance | null = null;
      for (const c of cardsRef.current) {
        const dx = c.sx - x;
        const dy = c.sy - y;
        const dist = Math.hypot(dx, dy);
        if (dist < 280) {
          c.boost = Math.min(0.35, c.boost + (1 - dist / 280) * 0.16);
        }
        if (dist < Math.max(c.w, c.h) * 0.45) {
          hitCard = c;
        }
      }
      if (hitCard && onSelectSubject) {
        onSelectSubject(hitCard.item.code);
      }
    };

    let lastScrollY = window.scrollY;
    const onScroll = () => {
      const sy = window.scrollY;
      const delta = sy - lastScrollY;
      lastScrollY = sy;
      if (Math.abs(delta) > 0 && sy < window.innerHeight * 1.3) {
        const scrub = delta * 0.00028;
        for (const c of cardsRef.current) {
          c.s = ((c.s + scrub) % 1 + 1) % 1;
        }
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('click', onClick);
    window.addEventListener('scroll', onScroll, { passive: true });

    const drawVectorDiagram = (
      ctx: CanvasRenderingContext2D,
      kind: TelemetryCardItem['kind'],
      x: number,
      y: number,
      w: number,
      h: number,
      accent: string,
      isLight: boolean,
      now: number,
      phase: number
    ) => {
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.clip();

      const strokeBase = isLight ? 'rgba(11,11,12,0.22)' : 'rgba(243,242,238,0.22)';
      const cx = x + w * 0.5;
      const cy = y + h * 0.5;

      if (kind === 'vor') {
        // Compass rose + rotating radial needle
        const r = Math.min(w, h) * 0.36;
        ctx.strokeStyle = strokeBase;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();

        for (let i = 0; i < 12; i++) {
          const a = (i / 12) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(a) * (r * 0.78), cy + Math.sin(a) * (r * 0.78));
          ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
          ctx.stroke();
        }

        const needleA = now * 0.6 + phase;
        ctx.strokeStyle = accent;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(cx - Math.cos(needleA) * (r * 0.65), cy - Math.sin(needleA) * (r * 0.65));
        ctx.lineTo(cx + Math.cos(needleA) * (r * 0.85), cy + Math.sin(needleA) * (r * 0.85));
        ctx.stroke();
      } else if (kind === 'sine') {
        // Phugoid / aerodynamic oscillation curve
        ctx.strokeStyle = strokeBase;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + 6, cy);
        ctx.lineTo(x + w - 6, cy);
        ctx.stroke();

        ctx.strokeStyle = accent;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        for (let px = 6; px <= w - 6; px += 3) {
          const norm = (px - 6) / (w - 12);
          const py = cy + Math.sin(norm * Math.PI * 3 + now * 2 + phase) * (h * 0.28);
          if (px === 6) ctx.moveTo(x + px, py);
          else ctx.lineTo(x + px, py);
        }
        ctx.stroke();
      } else if (kind === 'polar') {
        // Drag polar Cl/Cd curve + tangent vector
        ctx.strokeStyle = strokeBase;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + 10, y + 6);
        ctx.lineTo(x + 10, y + h - 6);
        ctx.lineTo(x + w - 8, y + h - 6);
        ctx.stroke();

        ctx.strokeStyle = accent;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(x + 12, y + h - 8);
        ctx.quadraticCurveTo(x + w * 0.35, y + 4, x + w - 10, y + h * 0.45);
        ctx.stroke();
      } else if (kind === 'hold') {
        // ICAO Racetrack Holding pattern
        const rw = w * 0.56;
        const rh = h * 0.42;
        ctx.strokeStyle = accent;
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.roundRect(cx - rw * 0.5, cy - rh * 0.5, rw, rh, rh * 0.5);
        ctx.stroke();

        // Fix waypoint triangle
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.arc(cx - rw * 0.25, cy - rh * 0.5, 2.5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Horizon / PFD pitch ladder
        ctx.strokeStyle = strokeBase;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + 8, cy);
        ctx.lineTo(x + w - 8, cy);
        ctx.stroke();

        ctx.strokeStyle = accent;
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(cx - 16, cy - 6);
        ctx.lineTo(cx + 16, cy - 6);
        ctx.moveTo(cx - 10, cy + 6);
        ctx.lineTo(cx + 10, cy + 6);
        ctx.stroke();
      }

      ctx.restore();
    };

    let rafId = 0;
    let lastTime = performance.now();

    const render = (nowMs: number) => {
      const dt = Math.min(0.05, (nowMs - lastTime) / 1000);
      lastTime = nowMs;
      const now = nowMs / 1000;

      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const inkRGB = isLight ? '11, 11, 12' : '243, 242, 238';
      const bgCard = isLight ? 'rgba(247, 246, 242, 0.94)' : 'rgba(17, 17, 19, 0.92)';
      const borderCard = isLight ? 'rgba(11, 11, 12, 0.16)' : 'rgba(243, 242, 238, 0.16)';

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const cx = width * 0.5;
      const cy = height * 0.5;
      const maxR = Math.hypot(width, height) * 0.58;
      const spiralC = maxR / THETA_MAX;
      const scaleFactor = Math.min(1.05, Math.max(0.62, Math.min(width, height) / 900));

      // 1. Subtle radial coordinate rings + outer dashed construction circle (circFrac = 0.56)
      const circR = maxR * 0.56;
      ctx.save();
      ctx.strokeStyle = `rgba(${inkRGB}, 0.08)`;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.arc(cx, cy, circR, 0, Math.PI * 2);
      ctx.stroke();

      ctx.setLineDash([2, 8]);
      ctx.strokeStyle = `rgba(${inkRGB}, 0.05)`;
      ctx.beginPath();
      ctx.arc(cx, cy, maxR * 0.32, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // 2. 6 Logarithmic Spiral Arms + 16 radial ticks per arm
      ctx.save();
      for (let arm = 0; arm < ARMS; arm++) {
        const armAngle = (arm * 2 * Math.PI) / ARMS + now * 0.025;
        ctx.strokeStyle = `rgba(${inkRGB}, 0.075)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        const STEPS = 90;
        for (let i = 0; i <= STEPS; i++) {
          const u = i / STEPS;
          const theta = THETA_MIN + u * (THETA_MAX - THETA_MIN);
          const r = spiralC * theta;
          const a = theta + armAngle;
          const x = cx + Math.cos(a) * r;
          const y = cy + Math.sin(a) * r;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Radial arm ticks (16 per arm)
        const TICKS = 16;
        ctx.strokeStyle = `rgba(${inkRGB}, 0.10)`;
        for (let k = 2; k < TICKS; k++) {
          const u = k / TICKS;
          const theta = THETA_MIN + u * (THETA_MAX - THETA_MIN);
          const r = spiralC * theta;
          const a = theta + armAngle;
          const x = cx + Math.cos(a) * r;
          const y = cy + Math.sin(a) * r;
          const nx = -Math.sin(a);
          const ny = Math.cos(a);
          ctx.beginPath();
          ctx.moveTo(x - nx * 3.5, y - ny * 3.5);
          ctx.lineTo(x + nx * 3.5, y + ny * 3.5);
          ctx.stroke();
        }
      }

      // 3. Golden-Ratio Dephased Comet Pulses along each Spiral Arm
      const pulseDur = 6.5;
      const tailLen = 0.22;
      const tailSegs = 26;
      for (let arm = 0; arm < ARMS; arm++) {
        const armAngle = (arm * 2 * Math.PI) / ARMS + now * 0.025;
        const head = ((now / pulseDur) + arm * 0.6180339887) % 1;
        for (let s = 0; s < tailSegs; s++) {
          const u0 = head - (s / tailSegs) * tailLen;
          const u1 = head - ((s + 1) / tailSegs) * tailLen;
          if (u1 < 0 || u0 > 1) continue;
          const c0 = Math.max(0, Math.min(1, u0));
          const c1 = Math.max(0, Math.min(1, u1));
          const th0 = THETA_MIN + c0 * (THETA_MAX - THETA_MIN);
          const th1 = THETA_MIN + c1 * (THETA_MAX - THETA_MIN);
          const r0 = spiralC * th0;
          const r1 = spiralC * th1;
          const a0 = th0 + armAngle;
          const a1 = th1 + armAngle;
          const fade = Math.pow(1 - s / tailSegs, 1.7) * Math.sin(c0 * Math.PI);
          ctx.strokeStyle =
            arm % 2 === 0
              ? `rgba(59, 130, 246, ${0.48 * fade})`
              : `rgba(99, 102, 241, ${0.38 * fade})`;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(a0) * r0, cy + Math.sin(a0) * r0);
          ctx.lineTo(cx + Math.cos(a1) * r1, cy + Math.sin(a1) * r1);
          ctx.stroke();
        }
      }
      ctx.restore();

      // 4. Click Shockwave Ripples
      const activeRipples: Ripple[] = [];
      for (const rp of ripplesRef.current) {
        const age = now - rp.t;
        if (age < 1.35) {
          activeRipples.push(rp);
          const p = age / 1.35;
          const r = 16 + p * 260;
          ctx.save();
          ctx.strokeStyle = `rgba(59, 130, 246, ${(1 - p) * 0.45})`;
          ctx.lineWidth = 1.25;
          ctx.beginPath();
          ctx.arc(rp.x, rp.y, r, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      }
      ripplesRef.current = activeRipples;

      // 5. Update & Sort Floating Avionics Telemetry Cards along the Spiral Arms
      const ptr = pointerRef.current;
      for (const c of cardsRef.current) {
        c.s = (c.s + (c.speed + c.boost) * dt) % 1;
        c.boost *= Math.pow(0.06, dt);

        const armAngle = (c.arm * 2 * Math.PI) / ARMS + now * 0.025;
        const theta = THETA_MIN + Math.pow(c.s, 0.88) * (THETA_MAX - THETA_MIN);
        const r = spiralC * theta;
        const a = theta + armAngle;
        const baseX = cx + Math.cos(a) * r;
        const baseY = cy + Math.sin(a) * r;

        let targetHover = 0;
        let tx = 0;
        let ty = 0;
        if (ptr.inside) {
          const dx = ptr.x - baseX;
          const dy = ptr.y - baseY;
          const dist = Math.hypot(dx, dy);
          if (dist < 165) {
            targetHover = 1 - dist / 165;
            tx = dx * 0.14 * targetHover;
            ty = dy * 0.14 * targetHover;
          }
        }

        c.hover += (targetHover - c.hover) * Math.min(1, dt * 8);
        c.rx += (tx - c.rx) * Math.min(1, dt * 8);
        c.ry += (ty - c.ry) * Math.min(1, dt * 8);

        c.sx = baseX + c.rx;
        c.sy = baseY + c.ry;

        const perspectiveScale = (0.36 + 0.78 * c.s) * scaleFactor * (1 + c.hover * 0.12);
        c.w = c.baseW * perspectiveScale;
        c.h = c.baseH * perspectiveScale;
        c.rot = c.rotOffset + Math.sin(now * 0.7 + c.phase) * 0.025;
      }

      const sorted = [...cardsRef.current].sort((a, b) => a.s - b.s);

      // 6. Render Telemetry Cards
      for (const c of sorted) {
        const fadeIn = Math.min(1, c.s / 0.16);
        const fadeOut = Math.min(1, (1 - c.s) / 0.14);
        const alpha = Math.max(0, Math.min(1, fadeIn * fadeOut * (0.28 + 0.68 * c.s + c.hover * 0.25)));
        if (alpha <= 0.03) continue;

        ctx.save();
        ctx.translate(c.sx, c.sy);
        ctx.rotate(c.rot);
        ctx.globalAlpha = alpha;

        const hw = c.w * 0.5;
        const hh = c.h * 0.5;

        // Card chassis
        ctx.fillStyle = bgCard;
        ctx.fillRect(-hw, -hh, c.w, c.h);

        ctx.strokeStyle = c.hover > 0.25 ? c.item.accentColor : borderCard;
        ctx.lineWidth = c.hover > 0.25 ? 1.4 : 1;
        ctx.strokeRect(-hw, -hh, c.w, c.h);

        // Corner crosshair ticks on hovered cards
        if (c.hover > 0.18) {
          ctx.strokeStyle = c.item.accentColor;
          ctx.lineWidth = 1.2;
          const tk = 4;
          ctx.beginPath();
          ctx.moveTo(-hw - tk, -hh);
          ctx.lineTo(-hw + tk, -hh);
          ctx.moveTo(-hw, -hh - tk);
          ctx.lineTo(-hw, -hh + tk);
          ctx.moveTo(hw - tk, -hh);
          ctx.lineTo(hw + tk, -hh);
          ctx.moveTo(hw, -hh - tk);
          ctx.lineTo(hw, -hh + tk);
          ctx.stroke();
        }

        // Top HUD header bar inside card
        const headerH = Math.max(14, c.h * 0.22);
        ctx.strokeStyle = borderCard;
        ctx.lineWidth = 0.75;
        ctx.beginPath();
        ctx.moveTo(-hw, -hh + headerH);
        ctx.lineTo(hw, -hh + headerH);
        ctx.stroke();

        // Status dot + EASA code
        const fontPx = Math.max(7, Math.round(c.w * 0.062));
        ctx.font = `600 ${fontPx}px "JetBrains Mono", monospace`;
        ctx.fillStyle = c.item.accentColor;
        ctx.fillText(`SUBJ ${c.item.code}`, -hw + 6, -hh + headerH * 0.68);

        // Right metric badge
        ctx.fillStyle = isLight ? 'rgba(11,11,12,0.55)' : 'rgba(243,242,238,0.55)';
        ctx.textAlign = 'right';
        ctx.fillText(c.item.metric, hw - 6, -hh + headerH * 0.68);
        ctx.textAlign = 'left';

        // Vector Avionics Mini-Diagram
        const diagY = -hh + headerH + 2;
        const diagH = c.h - headerH - Math.max(16, c.h * 0.24);
        if (diagH > 12) {
          drawVectorDiagram(
            ctx,
            c.item.kind,
            -hw + 4,
            diagY,
            c.w - 8,
            diagH,
            c.item.accentColor,
            isLight,
            now,
            c.phase
          );
        }

        // Bottom caption bar
        const footFont = Math.max(6.5, Math.round(c.w * 0.056));
        ctx.font = `500 ${footFont}px "JetBrains Mono", monospace`;
        ctx.fillStyle = isLight ? 'rgba(11,11,12,0.78)' : 'rgba(243,242,238,0.82)';
        ctx.fillText(c.item.title, -hw + 6, hh - 5);

        ctx.restore();
      }

      // 7. Central HUD Target Reticle
      ctx.save();
      ctx.strokeStyle = `rgba(${inkRGB}, 0.18)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - 14, cy);
      ctx.lineTo(cx + 14, cy);
      ctx.moveTo(cx, cy - 14);
      ctx.lineTo(cx, cy + 14);
      ctx.stroke();
      ctx.restore();

      ctx.restore();
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('click', onClick);
      window.removeEventListener('scroll', onScroll);
    };
  }, [onSelectSubject]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full block cursor-crosshair"
      aria-label="Interactive EASA ATPL Flight Telemetry Spiral Radar"
    />
  );
};
