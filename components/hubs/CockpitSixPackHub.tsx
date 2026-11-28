import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Award, CheckCircle2, Clock, Compass, Sparkles } from 'lucide-react';
import { NAV_MAP } from '../../data/sidebarNavigation';
import { getSubjectRecallSpec } from '../../data/subjectRecallLibrary';
import { PROGRESS_EVENT, readLessonMeta } from '../../lib/lessonProgress';
import { AviationStudio, clamp, createA320Rig, createAviationStudio } from '../../lib/three/AviationKit';
import { View } from '../../types';
import { ChapterKneeboardDrawer, InOneMinuteStrip, StudyDepthToggle } from '../lesson';

export interface CockpitSixPackHubProps {
  subjectCode: string;
  onNavigate: (view: View) => void;
  variant?: 'six-pack' | 'a320-picker';
  showOneMinute?: boolean;
}

interface HotspotItem {
  id: string;
  num: string;
  partLabel: string;
  title: string;
  desc: string;
  anchorKey: 'wingTipR' | 'tail' | 'engineL' | 'nose';
  agkView: View;
  pofView: View;
}

const A320_HOTSPOTS: HotspotItem[] = [
  {
    id: 'wing',
    num: '1',
    partLabel: 'PART 01',
    title: 'Wing & Principles of Flight',
    desc: 'Airfoil camber, lift & stall vortices, swept-wing flex, and high-lift flaps.',
    anchorKey: 'wingTipR',
    agkView: View.AGK_FLIGHT_CONTROLS,
    pofView: View.CONCEPT_FORCES_OF_FLIGHT,
  },
  {
    id: 'airframe',
    num: '2',
    partLabel: 'PART 02',
    title: 'Airframe, Hydraulics & Gear',
    desc: 'Pressurized hull frames, Green/Blue/Yellow hydraulics, and landing gear.',
    anchorKey: 'tail',
    agkView: View.AGK_HYDRAULICS,
    pofView: View.AGK_SYSTEMS_HOME,
  },
  {
    id: 'engine',
    num: '3',
    partLabel: 'PART 03',
    title: 'Powerplant & High-Bypass Fans',
    desc: 'CFM56 / LEAP spool gas flow, FADEC thrust rating, and reverse thrust.',
    anchorKey: 'engineL',
    agkView: View.AGK_JET_ENGINE,
    pofView: View.AGK_PISTON_ENGINE,
  },
  {
    id: 'electrics',
    num: '4',
    partLabel: 'PART 04',
    title: 'Electrics, Buses & Oxygen',
    desc: 'IDG AC/DC distribution, static inverters, RAT emergency bus & avionics.',
    anchorKey: 'nose',
    agkView: View.AGK_ELECTRICS,
    pofView: View.INST_HOME,
  },
];

/* ------------------ Handcrafted SVG Cockpit Dials ------------------ */

const HeadingDialSvg: React.FC<{ color: string; code: string }> = ({ color, code }) => (
  <svg viewBox="0 0 110 110" className="w-20 h-20 sm:w-24 sm:h-24 shrink-0">
    <circle cx="55" cy="55" r="50" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2.5" />
    <circle cx="55" cy="55" r="42" fill="#0f172a" />
    {Array.from({ length: 12 }).map((_, i) => {
      const a = (i * 30 - 90) * (Math.PI / 180);
      return (
        <line
          key={i}
          x1={55 + 34 * Math.cos(a)}
          y1={55 + 34 * Math.sin(a)}
          x2={55 + 40 * Math.cos(a)}
          y2={55 + 40 * Math.sin(a)}
          stroke="#f8fafc"
          strokeWidth={i % 3 === 0 ? 2 : 1}
        />
      );
    })}
    <path d="M55 43 L57.5 52 L66 56 L66 59 L57.5 57.5 L57.5 64 L61 67 L61 69 L55 67 L49 69 L49 67 L52.5 64 L52.5 57.5 L44 59 L44 56 L52.5 52 Z" fill={color} />
    <text x="55" y="34" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="700" fontFamily="JetBrains Mono, monospace">
      {code}
    </text>
  </svg>
);

const AttitudeDialSvg: React.FC<{ pct: number }> = ({ pct }) => {
  const bankDeg = Math.round((pct - 50) * 0.25);
  return (
    <svg viewBox="0 0 110 110" className="w-20 h-20 sm:w-24 sm:h-24 shrink-0">
      <defs>
        <clipPath id="attClip">
          <circle cx="55" cy="55" r="44" />
        </clipPath>
      </defs>
      <circle cx="55" cy="55" r="50" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2.5" />
      <g clipPath="url(#attClip)">
        <g transform={`rotate(${bankDeg} 55 55)`}>
          <rect x="0" y="0" width="110" height="55" fill="#0284c7" />
          <rect x="0" y="55" width="110" height="55" fill="#92400e" />
          <line x1="5" y1="55" x2="105" y2="55" stroke="#ffffff" strokeWidth="2" />
          <line x1="42" y1="43" x2="68" y2="43" stroke="#ffffff" strokeWidth="1.5" />
          <line x1="42" y1="67" x2="68" y2="67" stroke="#ffffff" strokeWidth="1.5" />
        </g>
      </g>
      <path d="M36 55 L48 55 L51 59 L55 55 L59 59 L62 55 L74 55" fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="55" cy="55" r="44" fill="none" stroke="#1e293b" strokeWidth="2.5" />
    </svg>
  );
};

const AirspeedDialSvg: React.FC<{ pct: number }> = ({ pct }) => {
  const angle = -130 + (pct / 100) * 260;
  return (
    <svg viewBox="0 0 110 110" className="w-20 h-20 sm:w-24 sm:h-24 shrink-0">
      <circle cx="55" cy="55" r="50" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2.5" />
      <circle cx="55" cy="55" r="44" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
      <path d="M 24 81 A 39 39 0 1 1 86 81" fill="none" stroke="#10b981" strokeWidth="4" />
      <path d="M 79 26 A 39 39 0 0 1 93 62" fill="none" stroke="#f59e0b" strokeWidth="4" />
      <g transform={`rotate(${angle} 55 55)`}>
        <line x1="55" y1="59" x2="55" y2="20" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
      </g>
      <circle cx="55" cy="55" r="5" fill="#0f172a" />
      <text x="55" y="84" textAnchor="middle" fill="#475569" fontSize="9.5" fontWeight="800" fontFamily="JetBrains Mono, monospace">
        {pct}%
      </text>
    </svg>
  );
};

const FuelGaugeSvg: React.FC<{ qs: number }> = ({ qs }) => {
  const needle = qs > 40 ? 35 : qs > 0 ? 0 : -35;
  return (
    <svg viewBox="0 0 110 110" className="w-20 h-20 sm:w-24 sm:h-24 shrink-0">
      <circle cx="55" cy="55" r="50" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2.5" />
      <circle cx="55" cy="55" r="44" fill="#ffffff" />
      <path d="M 26 72 A 34 34 0 0 1 84 72" fill="none" stroke="#94a3b8" strokeWidth="2" />
      <text x="27" y="75" fill="#e11d48" fontSize="9" fontWeight="800" fontFamily="JetBrains Mono, monospace">E</text>
      <text x="55" y="34" textAnchor="middle" fill="#334155" fontSize="8" fontWeight="800" fontFamily="JetBrains Mono, monospace">ECQB</text>
      <text x="77" y="75" fill="#0f172a" fontSize="9" fontWeight="800" fontFamily="JetBrains Mono, monospace">F</text>
      <g transform={`rotate(${needle} 55 68)`}>
        <line x1="55" y1="68" x2="55" y2="38" stroke="#0f172a" strokeWidth="2.8" strokeLinecap="round" />
      </g>
      <circle cx="55" cy="68" r="4.5" fill="#0f172a" />
    </svg>
  );
};

/* ------------------ Main Hub Component ------------------ */

export const CockpitSixPackHub: React.FC<CockpitSixPackHubProps> = ({
  subjectCode,
  onNavigate,
  variant,
  showOneMinute = true,
}) => {
  const spec = getSubjectRecallSpec(subjectCode);
  const resolvedVariant =
    variant ??
    (['021', '081', '082'].includes(subjectCode) ? 'a320-picker' : 'six-pack');

  const navCfg = useMemo(
    () => NAV_MAP.find((s) => s.id === subjectCode),
    [subjectCode]
  );

  const [doneIds, setDoneIds] = useState<string[]>(() => readLessonMeta().doneIds);
  useEffect(() => {
    const sync = () => setDoneIds(readLessonMeta().doneIds);
    window.addEventListener(PROGRESS_EVENT, sync);
    return () => window.removeEventListener(PROGRESS_EVENT, sync);
  }, []);

  const totalTopics = navCfg
    ? navCfg.items.filter((i) => i.view !== navCfg.dashboardView).length
    : 0;
  const doneCount = navCfg
    ? navCfg.items.filter(
        (i) => i.view !== navCfg.dashboardView && doneIds.includes(`topic-${i.view}`)
      ).length
    : 0;

  // Interactive 3D A320 Picker for 021/081/082
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [cutOpen, setCutOpen] = useState(false);
  const cutOpenRef = useRef(false);
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);
  const [pins, setPins] = useState<
    Array<{ id: string; num: string; label: string; x: number; y: number; view: View }>
  >([]);

  useEffect(() => {
    cutOpenRef.current = cutOpen;
  }, [cutOpen]);

  useEffect(() => {
    if (resolvedVariant !== 'a320-picker') return;
    const canvas = canvasRef.current;
    const box = boxRef.current;
    if (!canvas || !box) return;

    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    let studio: AviationStudio | null = null;
    try {
      studio = createAviationStudio(canvas, { isDark });
    } catch {
      return;
    }

    const a320 = createA320Rig(studio);
    a320.setState({ gear: 0, flapDeg: 8, bend: 0.42, cut: 0 });
    studio.scene.add(a320.root);

    let az = -126;
    let el = 22;
    let dragActive = false;
    let lastX = 0;
    let lastY = 0;

    const onDown = (e: PointerEvent) => {
      dragActive = true;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onMove = (e: PointerEvent) => {
      if (!dragActive) return;
      az -= (e.clientX - lastX) * 0.45;
      el = clamp(el + (e.clientY - lastY) * 0.25, -5, 58);
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onUp = () => {
      dragActive = false;
    };

    canvas.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);

    const doResize = () => {
      if (studio && box) studio.resize(box.clientWidth, box.clientHeight);
    };
    doResize();
    const rObs = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(doResize) : null;
    rObs?.observe(box);

    let rafId = 0;
    let lastT = performance.now();
    let elapsed = 0;
    let lastPinT = 0;

    const loop = (now: number) => {
      rafId = requestAnimationFrame(loop);
      if (!studio || document.hidden) {
        lastT = now;
        return;
      }
      const dt = Math.min(0.05, Math.max(0.001, (now - lastT) / 1000));
      lastT = now;
      elapsed += dt;

      if (!dragActive) az += dt * 7;
      a320.setState({ gear: 0, flapDeg: 8, cut: cutOpenRef.current ? 1 : 0, bend: 0.42 });
      a320.tick(dt, elapsed);

      const radAz = (az * Math.PI) / 180;
      const radEl = (el * Math.PI) / 180;
      const dist = 31.5;
      studio.camera.position.set(
        dist * Math.cos(radEl) * Math.sin(radAz),
        1.8 + dist * Math.sin(radEl),
        dist * Math.cos(radEl) * Math.cos(radAz)
      );
      studio.camera.lookAt(0, 1.8, 0);
      studio.focusShadow(0, 0, 24);
      studio.renderer.shadowMap.needsUpdate = true;
      studio.render();

      if (now - lastPinT > 70) {
        lastPinT = now;
        const rect = box.getBoundingClientRect();
        a320.root.updateMatrixWorld(true);
        const mapped = A320_HOTSPOTS.map((hs) => {
          const v = a320.anchors[hs.anchorKey].getWorldPosition(new THREE.Vector3());
          v.project(studio!.camera);
          return {
            id: hs.id,
            num: hs.num,
            label: hs.title,
            x: clamp(((v.x + 1) / 2) * rect.width, 28, Math.max(60, rect.width - 28)),
            y: clamp(((1 - v.y) / 2) * rect.height, 28, Math.max(60, rect.height - 28)),
            view: subjectCode === '021' ? hs.agkView : hs.pofView,
          };
        });
        setPins(mapped);
      }
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      rObs?.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      studio?.dispose();
    };
  }, [resolvedVariant, subjectCode]);

  const completionPct = totalTopics > 0 ? Math.round((doneCount / totalTopics) * 100) : 0;

  return (
    <div className="space-y-6 mb-8">
      {/* Interactive Blueprint 3D A320 Hero for Technical General / PoF */}
      {resolvedVariant === 'a320-picker' && (
        <section className="relative">
          <div className="bg-blueprint-grid rounded-3xl border-2 border-line-strong text-white p-6 sm:p-8 lg:p-10 shadow-[0_6px_0_0_rgba(255,255,255,0.12)] overflow-hidden relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left Editorial Copy */}
              <div className="lg:col-span-5 z-20 space-y-4">
                <div className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-200/80">
                  EASA {subjectCode} · {spec.subjectName}
                </div>

                <h2 className="font-display text-3xl sm:text-5xl font-black tracking-tight leading-[1.03] text-white">
                  One aircraft,{' '}
                  <span className="inline-block -rotate-1 bg-amber-300 text-slate-950 px-3 py-0.5 rounded-xl mt-1 shadow">
                    four systems.
                  </span>
                </h2>

                <p className="text-sm sm:text-base text-indigo-100/85 leading-relaxed">
                  {spec.subjectName} explains how an Airbus A320 flies, generates pressure, burns fuel, and powers buses. Drag the 3D airframe or tap any numbered station below.
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCutOpen((c) => !c)}
                    className={`px-3.5 py-2 rounded-xl font-mono text-xs font-bold uppercase tracking-wider border-2 transition-colors cursor-pointer ${
                      cutOpen
                        ? 'bg-amber-300 text-slate-950 border-amber-300'
                        : 'bg-white/10 text-white border-white/30 hover:bg-white/20'
                    }`}
                  >
                    {cutOpen ? 'Close Cutaway Skin' : 'Slice Fuselage Cutaway'}
                  </button>
                  <ChapterKneeboardDrawer
                    chapterCode={subjectCode}
                    chapterTitle={spec.kneeboard.title}
                    formulas={spec.kneeboard.formulas}
                    keyNumbers={spec.kneeboard.keyNumbers}
                    memoryHooks={spec.kneeboard.memoryHooks}
                  />
                </div>
              </div>

              {/* Right Interactive GLB 3D A320 Stage */}
              <div ref={boxRef} className="lg:col-span-7 relative h-72 sm:h-96 select-none">
                <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />

                <div className="absolute top-2 right-2 z-20 px-3 py-1 rounded-full bg-white text-slate-950 font-mono text-[10px] font-black uppercase tracking-wider shadow">
                  Drag to turn it · Tap a station
                </div>

                {pins.map((pin) => {
                  const isHov = hoveredHotspot === pin.id;
                  return (
                    <button
                      key={pin.id}
                      type="button"
                      onClick={() => onNavigate(pin.view)}
                      onMouseEnter={() => setHoveredHotspot(pin.id)}
                      onMouseLeave={() => setHoveredHotspot(null)}
                      title={pin.label}
                      style={{ transform: `translate3d(${pin.x - 16}px, ${pin.y - 16}px, 0)` }}
                      className={`absolute top-0 left-0 z-20 w-8 h-8 rounded-full border-2 font-mono text-xs font-black flex items-center justify-center transition-all cursor-pointer shadow-lg ${
                        isHov
                          ? 'bg-amber-300 text-slate-950 border-white scale-110'
                          : 'bg-slate-950 text-white border-white hover:bg-amber-300 hover:text-slate-950'
                      }`}
                    >
                      {pin.num}
                    </button>
                  );
                })}

                <div className="pointer-events-none absolute bottom-1 right-2 font-mono text-[10px] text-indigo-200/65">
                  Airbus A320 · amvlab (CC BY 4.0, adapted)
                </div>
              </div>
            </div>

            {/* 4 Tactile System Cards Inside Bottom of Blueprint Hero */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative z-20">
              {A320_HOTSPOTS.map((hs) => {
                const targetView = subjectCode === '021' ? hs.agkView : hs.pofView;
                const isHov = hoveredHotspot === hs.id;
                return (
                  <button
                    key={hs.id}
                    type="button"
                    onClick={() => onNavigate(targetView)}
                    onMouseEnter={() => setHoveredHotspot(hs.id)}
                    onMouseLeave={() => setHoveredHotspot(null)}
                    className={`rounded-2xl border-2 p-4 text-left transition-all cursor-pointer ${
                      isHov
                        ? 'bg-white text-slate-950 border-white -translate-y-0.5 shadow-lg'
                        : 'bg-[#121036]/95 text-white border-white/25 hover:border-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-widest opacity-70">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-current mr-1.5 font-black">
                          {hs.num}
                        </span>
                        {hs.partLabel}
                      </span>
                    </div>
                    <div className="font-display text-sm font-bold">{hs.title}</div>
                    <p className={`text-xs mt-1 leading-snug ${isHov ? 'text-slate-700' : 'text-indigo-100/75'}`}>
                      {hs.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Tactile 6-Pack Cockpit Instrument Strip */}
      <div
        className="rounded-3xl border-2 border-line-strong bg-bg-raised p-5 sm:p-6 shadow-[0_5px_0_0_var(--card-lip)]"
        style={{ borderTopWidth: '4px', borderTopColor: spec.accentColor }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-line">
          <div className="flex items-center gap-2.5">
            <span
              className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg border border-line-strong bg-bg-sunken"
              style={{ color: spec.accentColor }}
            >
              EASA {subjectCode}
            </span>
            <span className="text-sm font-bold text-ink">
              {spec.subjectName} Dispatch Panel
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <StudyDepthToggle />
            <ChapterKneeboardDrawer
              chapterCode={subjectCode}
              chapterTitle={spec.kneeboard.title}
              formulas={spec.kneeboard.formulas}
              keyNumbers={spec.kneeboard.keyNumbers}
              memoryHooks={spec.kneeboard.memoryHooks}
            />
          </div>
        </div>

        {/* 4 Illustrated SVG Instrument Panels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-line bg-bg p-3.5 flex items-center gap-3.5">
            <HeadingDialSvg color={spec.accentColor} code={subjectCode} />
            <div className="min-w-0">
              <div className="font-mono text-[10px] text-muted uppercase flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-400" /> Exam Weight
              </div>
              <div className="font-display text-lg font-extrabold text-ink mt-0.5">
                {spec.examQuestions > 0 ? `${spec.examQuestions} Qs` : 'KSA 100'}
              </div>
              <div className="font-mono text-[10px] text-muted">Pass: {spec.passPercent}%</div>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-bg p-3.5 flex items-center gap-3.5">
            <AttitudeDialSvg pct={completionPct} />
            <div className="min-w-0">
              <div className="font-mono text-[10px] text-muted uppercase flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-sky-400" /> Allowance
              </div>
              <div className="font-display text-lg font-extrabold text-ink mt-0.5">
                {spec.examMinutes > 0 ? `${spec.examMinutes} min` : 'Ongoing'}
              </div>
              <div className="font-mono text-[10px] text-muted">ECQB Official</div>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-bg p-3.5 flex items-center gap-3.5">
            <AirspeedDialSvg pct={completionPct} />
            <div className="min-w-0 flex-1">
              <div className="font-mono text-[10px] text-muted uppercase flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Mastered
              </div>
              <div className="font-display text-lg font-extrabold text-emerald-400 mt-0.5">
                {doneCount} / {totalTopics || '—'}
              </div>
              <div className="h-1.5 bg-line rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-emerald-400 transition-all" style={{ width: `${completionPct}%` }} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-bg p-3.5 flex items-center gap-3.5">
            <FuelGaugeSvg qs={spec.examQuestions} />
            <div className="min-w-0 flex-1">
              <div className="font-mono text-[10px] text-muted uppercase flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Next Up
              </div>
              <button
                type="button"
                onClick={() => {
                  const firstTopic = navCfg?.items.find((i) => i.view !== navCfg.dashboardView);
                  if (firstTopic) onNavigate(firstTopic.view);
                }}
                className="mt-1.5 w-full px-3 py-2 rounded-xl bg-cad-accent hover:opacity-90 text-white font-mono text-[11px] font-bold uppercase tracking-wider text-center cursor-pointer transition-opacity"
              >
                Launch Module →
              </button>
            </div>
          </div>
        </div>
      </div>

      {showOneMinute && (
        <InOneMinuteStrip items={spec.oneMinuteItems} subjectColor={spec.accentColor} />
      )}
    </div>
  );
};

export default CockpitSixPackHub;
