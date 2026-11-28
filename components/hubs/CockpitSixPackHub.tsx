import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Award, CheckCircle2, Clock, Compass, Sparkles } from 'lucide-react';
import { NAV_MAP } from '../../data/sidebarNavigation';
import { getSubjectRecallSpec } from '../../data/subjectRecallLibrary';
import { PROGRESS_EVENT, readLessonMeta } from '../../lib/lessonProgress';
import {
  AviationStudio,
  clamp,
  createA320Rig,
  createAviationStudio,
} from '../../lib/three/AviationKit';
import { View } from '../../types';
import { ChapterKneeboardDrawer, InOneMinuteStrip, StudyDepthToggle } from '../lesson';

interface CockpitSixPackHubProps {
  subjectCode: string;
  onNavigate: (view: View) => void;
  variant?: 'auto' | 'six-pack' | 'a320-picker';
  showOneMinute?: boolean;
}

const A320_HOTSPOTS: Array<{
  id: string;
  label: string;
  anchorKey: 'wingTipR' | 'engineL' | 'gearMain' | 'nose' | 'fuelTank';
  agkView: View;
  pofView: View;
}> = [
  { id: 'wing', label: '① Wing & Airfoil', anchorKey: 'wingTipR', agkView: View.AGK_FLIGHT_CONTROLS, pofView: View.CONCEPT_FORCES_OF_FLIGHT },
  { id: 'engine', label: '② Gas Turbine', anchorKey: 'engineL', agkView: View.AGK_JET_ENGINE, pofView: View.POF_3D_AIRFLOW },
  { id: 'gear', label: '③ Gear & Hydraulics', anchorKey: 'gearMain', agkView: View.AGK_HYDRAULICS, pofView: View.POF_STABILITY },
  { id: 'deck', label: '④ Electrics / Flight Deck', anchorKey: 'nose', agkView: View.AGK_ELECTRICS, pofView: View.POF_HIGH_SPEED },
  { id: 'fuse', label: '⑤ Airframe & Pressurization', anchorKey: 'fuelTank', agkView: View.AGK_AIRFRAMES, pofView: View.POF_HIGH_LIFT },
];

export const CockpitSixPackHub: React.FC<CockpitSixPackHubProps> = ({
  subjectCode,
  onNavigate,
  variant = 'auto',
  showOneMinute = true,
}) => {
  const spec = getSubjectRecallSpec(subjectCode);
  const navCfg = NAV_MAP.find((s) => s.id === subjectCode);

  const resolvedVariant =
    variant === 'auto'
      ? ['021', '081', '082'].includes(subjectCode)
        ? 'a320-picker'
        : 'six-pack'
      : variant;

  const [doneCount, setDoneCount] = useState(0);
  const [totalTopics, setTotalTopics] = useState(0);

  useEffect(() => {
    const sync = () => {
      const meta = readLessonMeta();
      const topics =
        navCfg?.items.filter((i) => i.view !== navCfg.dashboardView) || [];
      setTotalTopics(topics.length);
      const count = topics.filter((t) =>
        meta.doneIds.includes(`topic-${t.view}`)
      ).length;
      setDoneCount(count);
    };
    sync();
    window.addEventListener(PROGRESS_EVENT, sync);
    return () => window.removeEventListener(PROGRESS_EVENT, sync);
  }, [navCfg]);

  // 3D A320 Hotspot Picker canvas for 021 / 081 / 082
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cutOpen, setCutOpen] = useState(false);
  const cutOpenRef = useRef(cutOpen);
  cutOpenRef.current = cutOpen;

  const [pins, setPins] = useState<Array<{ id: string; label: string; x: number; y: number; view: View }>>([]);

  useEffect(() => {
    if (resolvedVariant !== 'a320-picker') return;
    const canvas = canvasRef.current;
    const box = boxRef.current;
    if (!canvas || !box) return;

    const isDarkNow = (document.documentElement.getAttribute('data-theme') || 'dark') === 'dark';
    let studio: AviationStudio | null = null;
    try {
      studio = createAviationStudio(canvas, { lowPower: true, isDark: isDarkNow });
    } catch {
      return;
    }

    const a320 = createA320Rig(studio);
    studio.scene.add(a320.root);

    let rafId = 0;
    let lastT = performance.now();
    let elapsed = 0;
    let az = -38;
    let el = 16;
    let dragActive = false;
    let lx = 0;
    let ly = 0;
    let lastPinT = 0;

    const onDown = (e: PointerEvent) => {
      dragActive = true;
      lx = e.clientX;
      ly = e.clientY;
    };
    const onMove = (e: PointerEvent) => {
      if (!dragActive) return;
      az -= (e.clientX - lx) * 0.45;
      el = clamp(el + (e.clientY - ly) * 0.25, 2, 70);
      lx = e.clientX;
      ly = e.clientY;
    };
    const onUp = () => {
      dragActive = false;
    };
    canvas.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);

    const resize = () => {
      const r = box.getBoundingClientRect();
      studio?.resize(r.width, r.height);
    };
    resize();
    const rObs = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
    rObs?.observe(box);

    const loop = (now: number) => {
      rafId = requestAnimationFrame(loop);
      if (document.hidden || !studio) {
        lastT = now;
        return;
      }
      const dt = Math.min(0.05, Math.max(0.001, (now - lastT) / 1000));
      lastT = now;
      elapsed += dt;

      if (!dragActive) az += dt * 7;
      a320.setState({ gear: 1, flapDeg: 10, cut: cutOpenRef.current ? 1 : 0, bend: 0.35 });
      a320.tick(dt, elapsed);

      const radAz = (az * Math.PI) / 180;
      const radEl = (el * Math.PI) / 180;
      const dist = 21;
      studio.camera.position.set(
        dist * Math.cos(radEl) * Math.sin(radAz),
        2 + dist * Math.sin(radEl),
        dist * Math.cos(radEl) * Math.cos(radAz)
      );
      studio.camera.lookAt(0, 1.9, 0);
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
            label: hs.label,
            x: clamp(((v.x + 1) / 2) * rect.width, 60, Math.max(80, rect.width - 130)),
            y: clamp(((1 - v.y) / 2) * rect.height, 24, Math.max(40, rect.height - 34)),
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
    <div className="space-y-4 mb-8">
      {/* Instrument Telemetry Strip */}
      <div
        className="dx-card p-4 sm:p-5"
        style={{ borderTopWidth: '3px', borderTopColor: spec.accentColor }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-line">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold px-2 py-0.5 border border-line-strong bg-bg-sunken" style={{ color: spec.accentColor }}>
              EASA {subjectCode}
            </span>
            <span className="text-xs sm:text-sm font-bold text-ink">
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

        {/* Six-Pack Style Instrument Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
          <div className="border border-line bg-bg p-3">
            <div className="text-[10px] text-muted uppercase flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-400" /> Exam Weight
            </div>
            <div className="text-lg font-bold text-ink mt-1">
              {spec.examQuestions > 0 ? `${spec.examQuestions} Qs` : 'KSA 100'}
            </div>
            <div className="text-[10px] text-muted">Pass Threshold: {spec.passPercent}%</div>
          </div>

          <div className="border border-line bg-bg p-3">
            <div className="text-[10px] text-muted uppercase flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-sky-400" /> Time Allowance
            </div>
            <div className="text-lg font-bold text-ink mt-1">
              {spec.examMinutes > 0 ? `${spec.examMinutes} min` : 'Continuous'}
            </div>
            <div className="text-[10px] text-muted">Official ECQB allocation</div>
          </div>

          <div className="border border-line bg-bg p-3">
            <div className="text-[10px] text-muted uppercase flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Topics Mastered
            </div>
            <div className="text-lg font-bold text-emerald-400 mt-1">
              {doneCount} / {totalTopics || '—'}
            </div>
            <div className="h-1.5 bg-line mt-1.5 overflow-hidden">
              <div className="h-full bg-emerald-400 transition-all" style={{ width: `${completionPct}%` }} />
            </div>
          </div>

          <div className="border border-line bg-bg p-3 flex flex-col justify-between">
            <div className="text-[10px] text-muted uppercase flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> First Recommended
            </div>
            <button
              type="button"
              onClick={() => {
                const firstTopic = navCfg?.items.find((i) => i.view !== navCfg.dashboardView);
                if (firstTopic) onNavigate(firstTopic.view);
              }}
              className="mt-1 px-2.5 py-1.5 bg-cad-accent text-white text-[11px] font-bold uppercase tracking-wider text-center cursor-pointer"
            >
              Launch First Module →
            </button>
          </div>
        </div>

        {/* Interactive 3D A320 Hotspot Picker for Technical Subjects */}
        {resolvedVariant === 'a320-picker' && (
          <div ref={boxRef} className="mt-4 relative h-64 sm:h-72 border border-line-strong bg-bg overflow-hidden">
            <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />

            <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
              <span className="px-2.5 py-1 border border-line-strong bg-bg/90 font-mono text-[10px] font-bold uppercase text-ink flex items-center gap-1.5">
                <Compass className="w-3 h-3 text-teal-400" /> 3D A320 PICKER · CLICK A HOTSPOT
              </span>
              <button
                type="button"
                onClick={() => setCutOpen((c) => !c)}
                className="px-2.5 py-1 border border-amber-400/60 bg-bg/90 font-mono text-[10px] font-bold uppercase text-amber-300 cursor-pointer"
              >
                {cutOpen ? 'Close Cutaway' : 'Open Cutaway'}
              </button>
            </div>

            {pins.map((pin) => (
              <button
                key={pin.id}
                type="button"
                onClick={() => onNavigate(pin.view)}
                style={{ transform: `translate3d(${pin.x - 50}px, ${pin.y - 12}px, 0)` }}
                className="absolute top-0 left-0 z-20 px-2 py-0.5 border border-teal-400 bg-bg/90 hover:bg-teal-500 hover:text-slate-950 font-mono text-[10px] font-bold text-teal-300 transition-colors cursor-pointer shadow"
              >
                {pin.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {showOneMinute && (
        <InOneMinuteStrip items={spec.oneMinuteItems} subjectColor={spec.accentColor} />
      )}
    </div>
  );
};

export default CockpitSixPackHub;
