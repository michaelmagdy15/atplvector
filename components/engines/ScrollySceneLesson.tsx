import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCcw } from 'lucide-react';
import {
  AviationStudio,
  clamp,
  createAviationStudio,
  lerp,
  smoothstep,
} from '../../lib/three/AviationKit';
import { useStudyDepth } from '../../context/StudyDepthContext';
import {
  ACARSDebriefSlip,
  AcarsRow,
  ChapterKneeboardDrawer,
  ConfusionBusterGrid,
  ConfusionPair,
  FlightPlanProgressBar,
  FlightPlanWaypoint,
  InOneMinuteStrip,
  KneeboardFormula,
  KneeboardNumber,
  LessonHeaderDeck,
  OneMinuteItem,
  RichText,
  StudyDepthToggle,
} from '../lesson';
import { CheckrideCall, CheckrideDeck, HoldGateSpec, HoldShortGate } from './HoldShortGate';

export type CameraPose = [number, number, number, number, number, number]; // [azimuthDeg, elevDeg, distance, tx, ty, tz]

export interface ScrollyTagSpec {
  anchor: string;
  label: string;
  tone?: 'sky' | 'amber' | 'emerald' | 'rose' | 'ink';
}

export interface ScrollyBeatSpec {
  id: string;
  actTitle?: string;
  questionTitle?: string;
  examRule?: string;
  memoryHook?: string;
  askedInEasa?: boolean;
  analogy?: string;
  scaleNote?: string;
  tier?: 'exam' | 'airline';
  say: string;
  sub?: string;
  formula?: { name: string; expr: string; note?: string };
  note?: string;
  remember?: string;
  camera: CameraPose;
  sceneState: Record<string, any>;
  tags?: ScrollyTagSpec[];
  gate?: HoldGateSpec;
}

export interface ScrollyTelemetryItem {
  label: string;
  value: string;
  unit?: string;
  tone?: 'sky' | 'amber' | 'emerald' | 'rose' | 'ink';
}

export interface ScrollySceneInstance {
  apply: (state: Record<string, any>, dt: number) => void;
  tick?: (elapsed: number, state: Record<string, any>, dt: number) => void;
  getAnchors?: (state: Record<string, any>) => Record<string, THREE.Vector3>;
  getReadout?: (state: Record<string, any>) => ScrollyTelemetryItem[];
  dispose?: () => void;
}

export interface ScrollySceneLessonProps {
  chapterCode: string;
  subjectName: string;
  subjectColor?: string;
  heroTitle: string;
  heroLede: string;
  flightLine: string;
  loaderText?: string;
  oneMinuteItems: OneMinuteItem[];
  beats: ScrollyBeatSpec[];
  confusionPairs: ConfusionPair[];
  kneeboard: {
    title: string;
    formulas: KneeboardFormula[];
    keyNumbers: KneeboardNumber[];
    memoryHooks?: string[];
  };
  checkrideCalls: CheckrideCall[];
  acarsDebrief: {
    chapterLabel: string;
    headline: string;
    rows: AcarsRow[];
  };
  createScene: (studio: AviationStudio) => ScrollySceneInstance;
  headerRightSlot?: React.ReactNode;
}

function wrapDeg(a: number, ref: number): number {
  return a - 360 * Math.round((a - ref) / 360);
}

function pchipSlope(a: number, b: number, c: number): number {
  const d0 = b - a;
  const d1 = c - b;
  const avg = (d0 + d1) / 2;
  if (d0 * d1 <= 0) return 0;
  return Math.sign(avg) * Math.min(Math.abs(avg), 3 * Math.abs(d0), 3 * Math.abs(d1));
}

function hermiteEval(p0: number, p1: number, p2: number, p3: number, t: number): number {
  const t2 = t * t;
  const t3 = t2 * t;
  const m1 = pchipSlope(p0, p1, p2);
  const m2 = pchipSlope(p1, p2, p3);
  return (
    (2 * t3 - 3 * t2 + 1) * p1 +
    (t3 - 2 * t2 + t) * m1 +
    (-2 * t3 + 3 * t2) * p2 +
    (t3 - t2) * m2
  );
}

export const ScrollySceneLesson: React.FC<ScrollySceneLessonProps> = ({
  chapterCode,
  subjectName,
  subjectColor = 'var(--accent)',
  heroTitle,
  heroLede,
  flightLine,
  loaderText = 'Aligning 3D flight deck scene…',
  oneMinuteItems,
  beats,
  confusionPairs,
  kneeboard,
  checkrideCalls,
  acarsDebrief,
  createScene,
  headerRightSlot,
}) => {
  const { isAirline } = useStudyDepth();

  const airlineExtrasCount = useMemo(
    () => beats.filter((b) => b.tier === 'airline').length,
    [beats]
  );

  const visibleBeats = useMemo(
    () => beats.filter((b) => isAirline || b.tier !== 'airline'),
    [beats, isAirline]
  );

  const waypoints: FlightPlanWaypoint[] = useMemo(
    () =>
      visibleBeats
        .filter((b) => b.actTitle)
        .map((b) => ({ id: b.id, label: b.actTitle! })),
    [visibleBeats]
  );

  const [activeBeatIdx, setActiveBeatIdx] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [minutesLeft, setMinutesLeft] = useState(Math.max(1, visibleBeats.length * 2));
  const [stageReady, setStageReady] = useState(false);
  const [webglError, setWebglError] = useState<string | null>(null);
  const [telemetry, setTelemetry] = useState<ScrollyTelemetryItem[]>([]);
  const [clearedGates, setClearedGates] = useState<Record<string, boolean>>({});
  const [leaderPaths, setLeaderPaths] = useState<
    Array<{
      id: string;
      label: string;
      tone: string;
      x: number;
      y: number;
      sx: number;
      sy: number;
      isLeft: boolean;
      pathD: string;
    }>
  >([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const stageBoxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beatElsRef = useRef<Array<HTMLElement | null>>([]);
  const overridesRef = useRef<Record<string, any>>({});
  const tweensRef = useRef<
    Array<{
      key: string;
      from: number;
      to: number;
      ms: number;
      elapsedMs: number;
      onDone?: () => void;
    }>
  >([]);
  const orbitDragRef = useRef<{
    active: boolean;
    lastX: number;
    lastY: number;
    azOffset: number;
    elOffset: number;
  }>({ active: false, lastX: 0, lastY: 0, azOffset: 0, elOffset: 0 });
  const isVisibleRef = useRef(true);
  const lastBeatSeenRef = useRef(-1);

  const setBeatRef = useCallback(
    (idx: number) => (el: HTMLElement | null) => {
      beatElsRef.current[idx] = el;
    },
    []
  );

  const jumpToWaypoint = useCallback(
    (wpIndex: number) => {
      const wp = waypoints[wpIndex];
      if (!wp) return;
      const targetBeatIdx = visibleBeats.findIndex((b) => b.id === wp.id);
      const el = beatElsRef.current[targetBeatIdx];
      if (el) {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
      }
    },
    [visibleBeats, waypoints]
  );

  const activeWaypointIndex = useMemo(() => {
    const activeBeat = visibleBeats[activeBeatIdx];
    if (!activeBeat) return 0;
    for (let i = activeBeatIdx; i >= 0; i--) {
      if (visibleBeats[i]?.actTitle) {
        const wIdx = waypoints.findIndex((w) => w.id === visibleBeats[i].id);
        if (wIdx >= 0) return wIdx;
      }
    }
    return 0;
  }, [activeBeatIdx, visibleBeats, waypoints]);

  const handleSceneOverride = useCallback((patch: Record<string, any>) => {
    Object.assign(overridesRef.current, patch);
  }, []);

  const handleScenePlay = useCallback(
    (key: string, from: number, to: number, ms: number, onDone?: () => void) => {
      overridesRef.current[key] = from;
      tweensRef.current = tweensRef.current.filter((tw) => tw.key !== key);
      tweensRef.current.push({ key, from, to, ms, elapsedMs: 0, onDone });
    },
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const stageBox = stageBoxRef.current;
    if (!canvas || !stageBox) return;

    const isLowPower =
      (navigator.hardwareConcurrency || 8) <= 4 ||
      window.innerWidth < 900;
    const isDarkNow =
      (document.documentElement.getAttribute('data-theme') || 'dark') === 'dark';

    let studio: AviationStudio | null = null;
    let sceneObj: ScrollySceneInstance | null = null;
    try {
      studio = createAviationStudio(canvas, {
        lowPower: isLowPower,
        isDark: isDarkNow,
      });
      sceneObj = createScene(studio);
      setWebglError(null);
    } catch (err) {
      setWebglError(
        err instanceof Error
          ? err.message
          : 'WebGL could not initialize; text and interactive checks remain active.'
      );
      setStageReady(true);
      return;
    }

    let disposed = false;
    let rafId = 0;
    let frameCount = 0;
    let lastTime = performance.now();
    let elapsedSec = 0;
    let lastLeaderUpdate = 0;
    let lastTelemetryUpdate = 0;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const doResize = () => {
      if (!studio || !stageBox) return;
      const rect = stageBox.getBoundingClientRect();
      studio.resize(rect.width, rect.height);
    };
    doResize();

    const resizeObs =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(doResize) : null;
    resizeObs?.observe(stageBox);

    const intObs =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            (entries) => {
              isVisibleRef.current = entries[0]?.isIntersecting ?? true;
            },
            { rootMargin: '12% 0px' }
          )
        : null;
    if (containerRef.current) intObs?.observe(containerRef.current);

    const themeObs = new MutationObserver(() => {
      const dark =
        (document.documentElement.getAttribute('data-theme') || 'dark') === 'dark';
      studio?.setTheme(dark);
    });
    themeObs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    // Clear beat-scoped overrides when scrolling to a new beat
    const computeScrollState = () => {
      const anchorY = window.scrollY + window.innerHeight * 0.45;
      const centers = visibleBeats.map((_, i) => {
        const el = beatElsRef.current[i];
        if (!el) return i * 400;
        const r = el.getBoundingClientRect();
        return r.top + window.scrollY + Math.min(r.height * 0.45, 220);
      });

      let idxA = 0;
      while (idxA < centers.length - 1 && centers[idxA + 1] <= anchorY) {
        idxA++;
      }
      const idxB = Math.min(centers.length - 1, idxA + 1);
      const span = Math.max(1, centers[idxB] - centers[idxA]);
      const rawT = idxA === idxB ? 0 : clamp((anchorY - centers[idxA]) / span, 0, 1);
      const easedT = smoothstep((rawT - 0.08) / 0.84);

      if (idxA !== lastBeatSeenRef.current) {
        lastBeatSeenRef.current = idxA;
        overridesRef.current = {};
        tweensRef.current = [];
        setActiveBeatIdx(idxA);
        const total = Math.max(1, centers[centers.length - 1] - centers[0]);
        setScrollProgress(clamp((anchorY - centers[0]) / total, 0, 1));
        setMinutesLeft(Math.max(0, Math.round(((centers.length - 1 - idxA) * 1.4))));
      }

      // Gently spring drag orbit back while scrolling
      if (!orbitDragRef.current.active) {
        orbitDragRef.current.azOffset *= 0.92;
        orbitDragRef.current.elOffset *= 0.92;
      }

      const bA = visibleBeats[idxA];
      const bB = visibleBeats[idxB] || bA;

      const merged: Record<string, any> = {};
      const keys = new Set([
        ...Object.keys(bA.sceneState || {}),
        ...Object.keys(bB.sceneState || {}),
      ]);
      keys.forEach((k) => {
        const va = bA.sceneState?.[k];
        const vb = bB.sceneState?.[k];
        if (typeof va === 'number' && typeof vb === 'number') {
          merged[k] = lerp(va, vb, easedT);
        } else {
          merged[k] = easedT > 0.5 && vb !== undefined ? vb : va !== undefined ? va : vb;
        }
      });

      // Advance active tweens
      if (tweensRef.current.length > 0) {
        const dtMs = Math.min(50, performance.now() - lastTime);
        tweensRef.current = tweensRef.current.filter((tw) => {
          tw.elapsedMs += dtMs;
          const p = clamp(tw.elapsedMs / Math.max(1, tw.ms), 0, 1);
          overridesRef.current[tw.key] = lerp(tw.from, tw.to, smoothstep(p));
          if (p >= 1) {
            tw.onDone?.();
            return false;
          }
          return true;
        });
      }

      Object.assign(merged, overridesRef.current);

      // Camera Hermite spline
      const p0 = visibleBeats[Math.max(0, idxA - 1)].camera;
      const p1 = bA.camera;
      const p2 = bB.camera;
      const p3 = visibleBeats[Math.min(visibleBeats.length - 1, idxB + 1)].camera;

      const camPose = p1.map((v1, c) => {
        let v0 = p0[c];
        let v2 = p2[c];
        let v3 = p3[c];
        if (c === 0) {
          v0 = wrapDeg(v0, v1);
          v2 = wrapDeg(v2, v1);
          v3 = wrapDeg(v3, v2);
        }
        return hermiteEval(v0, v1, v2, v3, easedT);
      }) as CameraPose;

      return { merged, camPose, activeBeat: easedT > 0.5 ? bB : bA };
    };

    const tickLoop = (now: number) => {
      if (disposed) return;
      rafId = requestAnimationFrame(tickLoop);
      if (!isVisibleRef.current || document.hidden || !studio || !sceneObj) {
        lastTime = now;
        return;
      }

      const dtMs = now - lastTime;
      const dt = Math.min(0.05, Math.max(0.001, dtMs / 1000));
      lastTime = now;
      if (!reducedMotion) elapsedSec += dt;
      frameCount++;

      const { merged, camPose, activeBeat } = computeScrollState();

      // Update Camera
      const az = ((camPose[0] + orbitDragRef.current.azOffset) * Math.PI) / 180;
      const el = clamp(camPose[1] + orbitDragRef.current.elOffset, -5, 86) * (Math.PI / 180);
      const dist = camPose[2];
      const cosEl = Math.cos(el);
      const target = new THREE.Vector3(camPose[3], camPose[4], camPose[5]);
      studio.camera.position.set(
        target.x + dist * cosEl * Math.sin(az),
        target.y + dist * Math.sin(el),
        target.z + dist * cosEl * Math.cos(az)
      );
      studio.camera.lookAt(target);
      studio.camera.updateMatrixWorld();

      sceneObj.apply(merged, dt);
      sceneObj.tick?.(elapsedSec, merged, dt);

      if (frameCount % studio.shadowCadence === 0) {
        studio.renderer.shadowMap.needsUpdate = true;
      }

      studio.recordFrameMs(dtMs);
      studio.render();

      if (!stageReady) {
        setStageReady(true);
      }

      // Update HUD Telemetry (~8 Hz to avoid excessive React re-renders)
      if (now - lastTelemetryUpdate > 120 && sceneObj.getReadout) {
        lastTelemetryUpdate = now;
        setTelemetry(sceneObj.getReadout(merged));
      }

      // Project 3D-to-2D Collision-Free Leader Callouts (~18 Hz)
      if (now - lastLeaderUpdate > 55 && sceneObj.getAnchors && activeBeat.tags?.length) {
        lastLeaderUpdate = now;
        const rect = stageBox.getBoundingClientRect();
        const w = Math.max(1, rect.width);
        const h = Math.max(1, rect.height);
        const anchors = sceneObj.getAnchors(merged);

        const projected = activeBeat.tags
          .map((tag) => {
            const worldPos = anchors[tag.anchor];
            if (!worldPos) return null;
            const p = worldPos.clone().project(studio!.camera);
            if (p.z > 1) return null;
            const sx = ((p.x + 1) / 2) * w;
            const sy = ((1 - p.y) / 2) * h;
            return {
              id: `${activeBeat.id}-${tag.anchor}`,
              label: tag.label,
              tone: tag.tone || 'ink',
              sx,
              sy,
              isLeft: sx < w * 0.5,
              y: sy - 14,
            };
          })
          .filter(Boolean) as Array<{
          id: string;
          label: string;
          tone: string;
          sx: number;
          sy: number;
          isLeft: boolean;
          y: number;
        }>;

        const resolveStack = (list: typeof projected) => {
          list.sort((a, b) => a.sy - b.sy);
          let minY = 56;
          list.forEach((item) => {
            item.y = clamp(Math.max(minY, item.sy - 13), 56, h - 96);
            minY = item.y + 34;
          });
        };

        const lefts = projected.filter((p) => p.isLeft);
        const rights = projected.filter((p) => !p.isLeft);
        resolveStack(lefts);
        resolveStack(rights);

        const built = [...lefts, ...rights].map((item) => {
          const boxX = item.isLeft ? 16 : Math.max(16, w - 196);
          const anchorEdgeX = item.isLeft ? boxX + 150 : boxX;
          const midY = item.y + 13;
          const elbowX = item.isLeft
            ? Math.min(anchorEdgeX + 20, item.sx)
            : Math.max(anchorEdgeX - 20, item.sx);
          const pathD = `M${anchorEdgeX.toFixed(1)} ${midY.toFixed(1)}L${elbowX.toFixed(
            1
          )} ${midY.toFixed(1)}L${item.sx.toFixed(1)} ${item.sy.toFixed(1)}`;
          return {
            id: item.id,
            label: item.label,
            tone: item.tone,
            x: boxX,
            y: item.y,
            sx: item.sx,
            sy: item.sy,
            isLeft: item.isLeft,
            pathD,
          };
        });
        setLeaderPaths(built);
      } else if (!activeBeat.tags?.length && leaderPaths.length > 0) {
        setLeaderPaths([]);
      }
    };

    rafId = requestAnimationFrame(tickLoop);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      resizeObs?.disconnect();
      intObs?.disconnect();
      themeObs.disconnect();
      sceneObj?.dispose?.();
      studio?.dispose();
    };
  }, [createScene, visibleBeats]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    orbitDragRef.current.active = true;
    orbitDragRef.current.lastX = e.clientX;
    orbitDragRef.current.lastY = e.clientY;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!orbitDragRef.current.active) return;
    const dx = e.clientX - orbitDragRef.current.lastX;
    const dy = e.clientY - orbitDragRef.current.lastY;
    orbitDragRef.current.lastX = e.clientX;
    orbitDragRef.current.lastY = e.clientY;
    orbitDragRef.current.azOffset -= dx * 0.35;
    orbitDragRef.current.elOffset = clamp(orbitDragRef.current.elOffset + dy * 0.2, -25, 35);
  };

  const handlePointerUp = () => {
    orbitDragRef.current.active = false;
  };

  const resetOrbit = () => {
    orbitDragRef.current.azOffset = 0;
    orbitDragRef.current.elOffset = 0;
  };

  return (
    <div ref={containerRef} className="bg-dot-grid text-ink pb-16">
      {/* Top Sticky Flight-Plan Progress Scrubber */}
      <FlightPlanProgressBar
        chapterCode={chapterCode}
        waypoints={waypoints.map((w) => ({
          ...w,
          done: visibleBeats.some((b) => b.id === w.id && b.gate && clearedGates[b.gate.id]),
        }))}
        activeIndex={activeWaypointIndex}
        progress={scrollProgress}
        minutesLeft={minutesLeft}
        onJump={jumpToWaypoint}
        rightSlot={
          <div className="flex items-center gap-2">
            <StudyDepthToggle airlineExtrasCount={airlineExtrasCount} className="hidden sm:inline-flex" />
            <ChapterKneeboardDrawer
              chapterCode={chapterCode}
              chapterTitle={kneeboard.title}
              formulas={kneeboard.formulas}
              keyNumbers={kneeboard.keyNumbers}
              memoryHooks={kneeboard.memoryHooks}
            />
            {headerRightSlot}
          </div>
        }
      />

      <div className="mx-auto max-w-[1380px] px-3 sm:px-6 pt-6">
        {/* Mobile Controls Strip */}
        <div className="flex sm:hidden flex-wrap items-center gap-2 mb-4">
          <StudyDepthToggle airlineExtrasCount={airlineExtrasCount} />
        </div>

        {/* Hero Chapter Title & Concrete Flight Mission Anchor */}
        <header className="dx-card p-6 md:p-8 mb-6" style={{ borderTopWidth: '3px', borderTopColor: subjectColor }}>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <span className="hud-label" style={{ color: subjectColor }}>
              {subjectName} · {chapterCode}
            </span>
            <span className="font-mono text-[11px] px-2.5 py-1 border border-line bg-bg text-muted">
              {flightLine}
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-ink leading-[1.06] mb-3">
            {heroTitle}
          </h1>
          <p className="text-sm sm:text-base text-muted max-w-3xl leading-relaxed">
            <RichText text={heroLede} />
          </p>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-widest text-cad-accent">
            ↓ Scroll to fly each beat · Drag the 3D viewport anytime to orbit
          </p>
        </header>

        {/* The Chapter in One Minute */}
        <InOneMinuteStrip items={oneMinuteItems} subjectColor={subjectColor} />

        {/* Split Scrollytelling Workspace: Left Narrative Column + Right Sticky 3D Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative">
          {/* Sticky 3D Stage (Rendered first in DOM on mobile top; on right col 8 on desktop!) */}
          <div className="lg:col-span-7 lg:order-2 sticky top-[116px] lg:top-[122px] z-20">
            <figure
              ref={stageBoxRef}
              aria-hidden="true"
              className="relative h-[38vh] min-h-[280px] lg:h-[calc(100vh-9.5rem)] w-full select-none overflow-hidden border border-line lg:border-0 bg-transparent"
            >
              {/* Aviation Loader */}
              {!stageReady && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-bg/95 font-mono text-xs text-cad-accent gap-2" style={{ backgroundColor: 'var(--bg)' }}>
                  <span className="w-2.5 h-2.5 rounded-full bg-cad-accent animate-ping" />
                  <span>{loaderText}</span>
                </div>
              )}

              {webglError ? (
                <div className="h-full flex items-center justify-center p-6 text-center dx-card">
                  <p className="text-xs font-mono text-muted">{webglError}</p>
                </div>
              ) : (
                <canvas
                  ref={canvasRef}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  className="w-full h-full block cursor-grab active:cursor-grabbing touch-pan-y"
                  style={{
                    WebkitMaskImage:
                      typeof window !== 'undefined' && window.innerWidth >= 1024
                        ? 'linear-gradient(90deg, transparent 0px, #000 38px)'
                        : undefined,
                    maskImage:
                      typeof window !== 'undefined' && window.innerWidth >= 1024
                        ? 'linear-gradient(90deg, transparent 0px, #000 38px)'
                        : undefined,
                  }}
                />
              )}

              {/* Collision-Free 3D-to-2D SVG Leader Overlay */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 hidden sm:block">
                {leaderPaths.map((lp) => (
                  <g key={lp.id}>
                    <path
                      d={lp.pathD}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.25"
                      className="text-line-strong"
                    />
                    <circle
                      cx={lp.sx}
                      cy={lp.sy}
                      r={3.5}
                      className="fill-amber-400"
                    />
                  </g>
                ))}
              </svg>

              <div className="absolute inset-0 pointer-events-none z-10 hidden sm:block">
                {leaderPaths.map((lp) => (
                  <div
                    key={lp.id}
                    style={{
                      transform: `translate3d(${lp.x.toFixed(0)}px, ${lp.y.toFixed(0)}px, 0)`,
                      maxWidth: '175px',
                      backgroundColor: 'var(--bg-raised)',
                    }}
                    className="absolute top-0 left-0 px-2.5 py-1 rounded-lg border border-line-strong text-[11px] font-mono font-bold text-ink shadow-md"
                  >
                    {lp.label}
                  </div>
                ))}
              </div>

              {/* Orbit Reset Button */}
              <button
                type="button"
                onClick={resetOrbit}
                title="Re-center 3D camera"
                style={{ backgroundColor: 'var(--bg-raised)' }}
                className="pointer-events-auto absolute top-3 right-3 z-20 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-line text-[10px] font-mono uppercase text-muted hover:text-ink cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Reset view
              </button>

              {/* Sticky Telemetry HUD Strip */}
              {telemetry.length > 0 && (
                <div className="pointer-events-none absolute bottom-3 left-3 right-3 z-20 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {telemetry.map((t, idx) => (
                    <div
                      key={idx}
                      style={{ backgroundColor: 'var(--bg-raised)' }}
                      className="rounded-xl border border-line-strong px-3 py-2 shadow-sm"
                    >
                      <div className="font-mono text-[9px] uppercase tracking-wider text-muted">
                        {t.label}
                      </div>
                      <div className="font-mono text-sm font-bold text-ink">
                        {t.value}
                        {t.unit && (
                          <span className="text-[10px] font-normal text-muted ml-1">
                            {t.unit}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="pointer-events-none hidden lg:block absolute bottom-16 right-2 z-10 font-mono text-[10px] text-muted/60">
                Airbus A320 · amvlab (CC BY 4.0, adapted)
              </div>
            </figure>
          </div>

          {/* Left Scrollable Editorial Narrative Column (Airy Typography Directly Over Dot-Grid) */}
          <article className="lg:col-span-5 lg:order-1 space-y-10 pb-8 pt-2">
            {visibleBeats.map((beat, idx) => {
              const isActive = idx === activeBeatIdx;
              return (
                <section
                  key={beat.id}
                  ref={setBeatRef(idx)}
                  className={`transition-opacity duration-300 ${
                    isActive ? 'opacity-100' : 'opacity-45 hover:opacity-85'
                  }`}
                >
                  {beat.questionTitle && beat.examRule && beat.memoryHook && (
                    <LessonHeaderDeck
                      id={beat.id}
                      index={beat.actTitle ? `${chapterCode} · ACT` : undefined}
                      questionTitle={beat.questionTitle}
                      examRule={beat.examRule}
                      memoryHook={beat.memoryHook}
                      askedInEasa={beat.askedInEasa}
                      analogy={beat.analogy}
                      scaleNote={beat.scaleNote}
                      tier={beat.tier}
                      subjectColor={subjectColor}
                    />
                  )}

                  {!beat.questionTitle && beat.actTitle && (
                    <h3 className="font-display text-2xl sm:text-3xl font-black text-ink mb-3">
                      {beat.actTitle}
                    </h3>
                  )}

                  <p className="text-xl sm:text-[26px] font-extrabold tracking-[-0.02em] text-ink leading-[1.32]">
                    <RichText text={beat.say} />
                  </p>

                  {beat.sub && (
                    <p className="text-sm sm:text-base text-muted leading-relaxed mt-3">
                      <RichText text={beat.sub} />
                    </p>
                  )}

                  {beat.formula && (
                    <div className="mt-4 dx-card p-4">
                      <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-cad-accent mb-1">
                        {beat.formula.name}
                      </div>
                      <div className="font-mono text-sm sm:text-base font-bold text-ink">
                        <RichText text={beat.formula.expr} />
                      </div>
                      {beat.formula.note && (
                        <p className="text-xs text-muted mt-1">{beat.formula.note}</p>
                      )}
                    </div>
                  )}

                  {beat.note && (
                    <p className="mt-3 text-xs sm:text-sm text-muted italic border-l-2 border-line-strong pl-3">
                      <RichText text={beat.note} />
                    </p>
                  )}

                  {beat.remember && (
                    <div className="mt-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-3.5 text-xs sm:text-sm text-amber-100">
                      <span className="font-mono font-bold uppercase tracking-wider text-amber-400 mr-1.5">
                        Keep this:
                      </span>
                      <RichText text={beat.remember} />
                    </div>
                  )}

                  {beat.gate && (
                    <div className="mt-5">
                      <HoldShortGate
                        gate={beat.gate}
                        onSceneOverride={handleSceneOverride}
                        onScenePlay={handleScenePlay}
                        onCleared={(gateId) =>
                          setClearedGates((prev) => ({ ...prev, [gateId]: true }))
                        }
                      />
                    </div>
                  )}
                </section>
              );
            })}
          </article>
        </div>

        {/* Confusion-Buster VS Cards */}
        <ConfusionBusterGrid pairs={confusionPairs} />

        {/* Randomized Exam-Style Checkride */}
        <CheckrideDeck calls={checkrideCalls} subjectLabel={subjectName} />

        {/* Thermal ACARS Debrief Slip */}
        <ACARSDebriefSlip
          chapterLabel={`${chapterCode} // DEBRIEF`}
          headline={acarsDebrief.headline}
          rows={acarsDebrief.rows}
        />
      </div>
    </div>
  );
};

export default ScrollySceneLesson;
