import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ArrowLeft, Eye, Layers, RotateCcw, Sliders, Wind } from 'lucide-react';
import {
  AviationStudio,
  clamp,
  createA320Rig,
  createAirflowStreamlines,
  createAviationStudio,
  createCloudDeck,
  createForceArrow,
} from '../../lib/three/AviationKit';
import {
  CheckrideCall,
  ConfusionPair,
  KneeboardFormula,
  KneeboardNumber,
  OneMinuteItem,
  ScrollyBeatSpec,
  ScrollySceneInstance,
  ScrollySceneLesson,
  ScrollyTelemetryItem,
} from '../engines';

interface Props {
  onBack: () => void;
}

const ONE_MINUTE_ITEMS: OneMinuteItem[] = [
  {
    num: '01',
    headline: 'Lift = ½ρV²SCL',
    body: 'Lift balances Weight via **dynamic pressure** (½ρV²) and **Angle of Attack** (CL), not engine thrust directly.',
    accent: 'var(--subj-pof)',
  },
  {
    num: '02',
    headline: 'AoA ≠ Pitch Attitude',
    body: '**AoA** is chord line to relative airflow; **Pitch** is nose to horizon. You can stall level or nose-down!',
    accent: '#38bdf8',
  },
  {
    num: '03',
    headline: 'Induced vs Parasite Drag',
    body: 'Induced drag drops with {{1 // V²}} while parasite drag rises with **V²** — crossing at minimum drag **VMD**.',
    accent: '#f59e0b',
  },
  {
    num: '04',
    headline: 'Stall Is Always an Angle',
    body: 'Critical AoA (~15°) is constant for a configuration; **IAS stall speed** rises with **√n** in turns & G-load.',
    accent: '#fb7185',
  },
];

const BEATS: ScrollyBeatSpec[] = [
  {
    id: 'pof-equilibrium',
    actTitle: 'Four Forces in Equilibrium',
    questionTitle: 'Held up by air it cannot grip — how do four forces stay in balance?',
    examRule: 'In steady unaccelerated flight: **Lift = Weight** vertically and **Thrust = Drag** longitudinally — regardless of flight path angle when level, climbing, or gliding slowly.',
    memoryHook: '**Straight, level, unaccelerated**: Lift doesn’t exceed Weight in a steady climb — excess **Thrust** pays for climb gradient!',
    askedInEasa: true,
    analogy: 'Hold your flat palm out a car window at 100 km/h: tilt it slightly up and the rushing air shoves your hand skyward while pushing it backward.',
    say: 'Around **350,000 Newtons** of Airbus A320 rides invisibly on moving air over RWY 27L. Emerald **Lift** cancels Weight vertically, while sky-blue **Thrust** answers rose **Drag**.',
    sub: 'All four arrows pivot around the Center of Gravity & Center of Pressure — watch them rebalance whenever AoA or airspeed moves.',
    camera: [-42, 14, 44, 0.8, 2.0, 0],
    sceneState: { tasKts: 220, aoaDeg: 4, loadG: 1.0, flapDeg: 0, gear: 0, cut: 0, tipStall: 0 },
    tags: [
      { anchor: 'cg', label: 'Lift vs Weight Couple', tone: 'emerald' },
      { anchor: 'engineL', label: 'CFM56 Thrust Vector', tone: 'sky' },
      { anchor: 'wingTipR', label: 'Wingtip Downwash & Vortex', tone: 'amber' },
    ],
    gate: {
      id: 'gate-pof-eq',
      kind: 'sentence',
      askedInEasa: true,
      sentence: 'During a steady constant-IAS straight climb at 12° nose-up pitch, **Lift** is actually slightly ___ **Weight** (since thrust provides an upward component).',
      options: ['less than', 'greater than', 'exactly twice', 'zero compared to'],
      answerIndex: 0,
      yes: 'Cleared — L = W · cos(γ), slightly less than W!',
      why: 'Lift acts perpendicular to the **relative airflow**, not vertically against gravity. In a steady climb angle γ, Lift supports **W cos γ** while excess Thrust supports **W sin γ**.',
    },
  },
  {
    id: 'pof-aoa-flex',
    actTitle: 'Angle of Attack & Wing Flex',
    questionTitle: 'Why do wings bend visibly upward as AoA or G-load climbs?',
    examRule: 'Dynamic pressure drops if speed slows, forcing a larger **Angle of Attack (CL)** to maintain **L = W** — shifting bending load outward along the wing spar.',
    memoryHook: '**Pitch is for the horizon; AoA is for the wind.** Air molecules only care where the wing is pointing relative to the **incoming streamline**.',
    askedInEasa: true,
    say: 'Raise Angle of Attack from 2° to 8° at constant speed: sky-blue streamlines deflect sharply downward behind the trailing edge and the **GLSL wing-flex shader (`uBend`)** curves the swept wings skyward.',
    formula: {
      name: 'DYNAMIC LIFT EQUATION',
      expr: 'Lift = {{1 // 2}} · ρ · V_{{TAS}}² · S · C_L(α)',
      note: 'CL grows linearly with Angle of Attack α until airflow detaches near critical α (~15°).',
    },
    camera: [26, 10, 38, -0.5, 2.0, 0],
    sceneState: { tasKts: 175, aoaDeg: 8, loadG: 1.45, flapDeg: 0, gear: 0, cut: 0, tipStall: 0 },
    tags: [
      { anchor: 'nose', label: 'Chord vs Relative Airflow (AoA)', tone: 'sky' },
      { anchor: 'wingTipL', label: 'GLSL Spar Flex (+G)', tone: 'emerald' },
    ],
    gate: {
      id: 'gate-pof-trim-aoa',
      kind: 'set',
      ask: 'At **180 kt TAS** (clean wing), trim **Angle of Attack** until Lift closely balances our **1G equilibrium (~350 kN → AoA 6° to 8°)**:',
      lever: { key: 'aoaDeg', label: 'Angle of Attack (α)', unit: '°', min: -1, max: 14, step: 0.5, start: 2 },
      okRange: [6, 8],
      during: { tasKts: 180, gear: 0, flapDeg: 0 },
      goLabel: 'Trim aircraft',
      yes: '1G trimmed — Lift equals Weight smoothly!',
      hint: 'Check the live Lift/Weight telemetry below the 3D wind tunnel and adjust AoA until Lift matches ~350 kN.',
      why: 'Slower airspeed (lower dynamic pressure q) requires a higher **CL** via higher **AoA** so that ½ρV²SCL remains equal to aircraft Weight.',
    },
  },
  {
    id: 'pof-stall',
    actTitle: 'Boundary-Layer Separation & Stall',
    questionTitle: 'Why can an aircraft stall at 220 knots just as easily as at 120 knots?',
    examRule: 'Stall occurs at one fixed **critical Angle of Attack (~15° clean)**. Because **Vs_turn = Vs_1G × √n**, a 60° level turn (2G) spikes stall speed by **+41%** (`√2 ≈ 1.414`).',
    memoryHook: '**15° breaks the airflow at ANY airspeed.** Pull 4G at cruise speed and your stall speed **doubles** (`√4 = 2`).',
    askedInEasa: true,
    say: 'Push AoA to **16°**: notice the wind-tunnel streamlines snap from smooth sky-blue ribbons into **churning red separation vortices**, Lift collapses, Drag spikes, and the wings relax downward.',
    camera: [-46, 14, 38, 0, 2.1, 0],
    sceneState: { tasKts: 130, aoaDeg: 16.5, loadG: 0.85, flapDeg: 0, gear: 0, cut: 0, tipStall: 1 },
    tags: [
      { anchor: 'wingTipL', label: 'Red Boundary Separation (>15° AoA)', tone: 'rose' },
      { anchor: 'tail', label: 'Tailplane Downforce Loss', tone: 'amber' },
    ],
    gate: {
      id: 'gate-pof-stall-sort',
      kind: 'sort',
      ask: 'Triage each factor by what it actually changes on the flight deck:',
      bins: [
        { label: 'Increases VS (kt IAS)', desc: 'Same critical AoA, higher speed' },
        { label: 'Lowers Critical AoA (°)', desc: 'Wing stalls at a smaller angle' },
        { label: 'Lowers VS (kt IAS)', desc: 'Allows slower flight safely' },
      ],
      items: [
        { text: '60° Bank Level Turn (n = 2G)', binIndex: 0, note: '√2 = 1.414 × VS — huge IAS jump!' },
        { text: 'Trailing-Edge Slotted Flaps Extended', binIndex: 2, note: 'Camber & boundary slot boost CLmax → lower VS.' },
        { text: 'Frost / Clear Ice Roughness on Leading Edge', binIndex: 1, note: 'Ice trips early separation → lower critical AoA AND higher VS.' },
        { text: 'Increased Gross Take-Off Mass', binIndex: 0, note: 'Needs more lift force at the same critical α → higher VS.' },
      ],
      why: 'Separating **critical angle** triggers (ice, rearward CG/flap config) from **IAS** multipliers (mass, √n load factor) solves 80% of EASA 081 stall questions.',
    },
  },
  {
    id: 'pof-drag-curve',
    actTitle: 'Total Drag Curve & Minimum Drag (VMD)',
    questionTitle: 'Why does flying slower actually increase drag on the back side of the curve?',
    examRule: 'Total Drag = **Parasite (∝ V²)** + **Induced (∝ 1/V²)**. Minimum Drag (**VMD**, best glide / max endurance jet) occurs where **Induced = Parasite**.',
    memoryHook: '**Induced** = slow-flight vortex penalty (**LIFT’s exhaust**); **Parasite** = fast-flight wind blast (**AIRFRAME’s friction**).',
    askedInEasa: true,
    say: 'On the slow back side of the drag curve, high AoA bends lift vectors backward and intensifies wingtip vortices. As speed climbs, Induced Drag falls rapidly with **1/V²** until Parasite Drag takes over.',
    formula: {
      name: 'TOTAL DRAG TRADE-OFF',
      expr: 'D_{{total}} = D_{{parasite}}(∝ V²) + D_{{induced}}({{1 // V²}})   |   Min at L/D_{{max}}',
      note: 'Fly at VMD for maximum L/D ratio — longest glide distance in a zero-wind engine-out.',
    },
    camera: [42, 16, 26, 0, 1.8, 0],
    sceneState: { tasKts: 260, aoaDeg: 3.2, loadG: 1.0, flapDeg: 0, gear: 0, cut: 0, tipStall: 0 },
    tags: [
      { anchor: 'cg', label: 'Best L/D Point (VMD)', tone: 'emerald' },
      { anchor: 'nose', label: 'Low AoA → Less Induced Drag', tone: 'sky' },
    ],
    gate: {
      id: 'gate-pof-drag-call',
      kind: 'call',
      askedInEasa: true,
      ask: 'An A320 maintains steady 1G level flight and **doubles** its airspeed (`150 → 300 kt`). Slide how **Parasite Drag** changes (`1× → 4×` vs dropping), then click **Run it**:',
      lever: { key: 'predictedDragMult', label: 'Parasite Drag Multiplier', unit: '×', min: 0.25, max: 5, step: 0.25, start: 1 },
      baseValue: 1,
      truthValue: 4,
      during: { aoaDeg: 1.5, gear: 0 },
      playTween: { key: 'tasKts', from: 150, to: 320, ms: 2400 },
      yes: 'Exactly right — Parasite Drag scales with V², so doubling speed quadruples (4×) Parasite Drag (and Induced Drag drops to ¼)!',
      why: 'Both **Lift** and **Parasite Drag** depend linearly on dynamic pressure **q = ½ρV²**. Doubling V multiplies q by 2² = **4**.',
    },
  },
  {
    id: 'pof-swept-airline',
    tier: 'airline',
    actTitle: 'Airline Prep: Swept-Wing Tip Stall & Cutaway',
    questionTitle: 'Why do swept-wing jets pitch NOSE UP when stalling instead of dropping the nose?',
    examRule: 'Spanwise outflow thickens the boundary layer at the **aft-swept wingtips**. Tip stall behind CG shifts **Center of Pressure forward**, causing pitch-up (**Mach tuck / deep stall risk**).',
    memoryHook: '**Aft tip dies → lift stays forward** → nose pitches **UP** toward a deeper stall unless **wing fences / vortex generators / stick pusher** intervene.',
    askedInEasa: false,
    say: 'In Airline Technical interviews, explain how spanwise pressure gradients push low-energy air outward toward the wingtips. Because swept tips sit aft of CG, losing tip lift pitches the nose **up** — the opposite of a straight Cessna wing.',
    camera: [-28, 22, 22, 0.5, 1.8, 0],
    sceneState: { tasKts: 290, aoaDeg: 12, loadG: 1.1, flapDeg: 0, gear: 0, cut: 1, tipStall: 1 },
    tags: [
      { anchor: 'wingTipR', label: 'Aft Tip Stalls First', tone: 'rose' },
      { anchor: 'cg', label: 'CP Moves Forward (Nose-Up Moment)', tone: 'amber' },
      { anchor: 'fuelTank', label: 'Wingbox Carry-Through', tone: 'sky' },
    ],
    gate: {
      id: 'gate-pof-lift-num',
      kind: 'num',
      askedInEasa: true,
      generator: 'liftEquation',
    },
  },
];

const CONFUSION_PAIRS: ConfusionPair[] = [
  {
    leftTitle: 'Angle of Attack (α)',
    leftBody: 'Angle between **chord line** and **relative airflow**. Fixes **CL** and stall (~15°).',
    leftColor: '#14b8a6',
    rightTitle: 'Pitch Attitude (θ)',
    rightBody: 'Angle between aircraft **longitudinal axis** and the **horizon** (Flight Path + AoA).',
    rightColor: '#38bdf8',
    tellApart: 'In a steep sink rate or windshear, Pitch can be 0° level while Relative Airflow comes from below — exceeding **15° AoA**.',
  },
  {
    leftTitle: 'Induced Drag',
    leftBody: 'By-product of lift & tip vortices. Varies with **{{1 // V²}}** and **Weight²**.',
    leftColor: '#f59e0b',
    rightTitle: 'Parasite Drag',
    rightBody: 'Form + skin friction + interference drag. Varies directly with **V²**.',
    rightColor: '#fb7185',
    tellApart: 'Slow down → **Induced** explodes; speed up → **Parasite** explodes. Best L/D (`VMD`) is where the two curves **cross** (`Di = Dp`).',
  },
  {
    leftTitle: 'Critical AoA (°)',
    leftBody: 'Fixed aerodynamic angle (~15° clean). Drops slightly with **ice/flaps**; unaffected by mass/G.',
    leftColor: '#34d399',
    rightTitle: 'Stall Speed VS (kt)',
    rightBody: 'IAS where level/turning flight hits critical α. Rises with **Mass**, **Altitude (TAS)**, and **√n**.',
    rightColor: '#a855f7',
    tellApart: 'Weight **does NOT change critical AoA**, only **VS** (stalls at higher speed). Frost changes **BOTH**.',
  },
  {
    leftTitle: 'Best Glide (VMD)',
    leftBody: 'Max Lift-to-Drag ratio (**L/Dmax**) — minimum total drag (**Di = Dp**).',
    leftColor: '#38bdf8',
    rightTitle: 'Min Power (VMP)',
    rightBody: 'Minimum drag × speed (**max endurance for piston/prop**), slower than VMD (`≈ 0.76 VMD`).',
    rightColor: '#ec4899',
    tellApart: '**Jets** use **VMD** for max endurance (least thrust = least fuel); **Props** fly slower at **VMP** for max endurance.',
  },
];

const KNEEBOARD_FORMULAS: KneeboardFormula[] = [
  { name: 'Lift Equation', formula: 'L = {{1 // 2}} · ρ · V_{{TAS}}² · S · C_L' },
  { name: 'Stall Speed Scaling', formula: 'V_{{S,new}} = V_{{S,1G}} · √({{Mass_{{new}} // Mass_{{old}}}} · n)   where   n = {{1 // cos(φ)}}' },
  { name: 'Total Drag & VMD', formula: 'D_{{total}} = k_p · V² + {{k_i · W² // V²}}   (D_{{induced}} = D_{{parasite}} at V_{{MD}})' },
];

const KNEEBOARD_NUMBERS: KneeboardNumber[] = [
  { label: '2G Level Turn Bank Angle', value: '60° Bank → +41% VS', note: 'cos(60°) = 0.5 → n = 2.0 → √2 = 1.414' },
  { label: 'Tipical Critical Clean AoA', value: '~15° – 16°', note: 'Independent of mass, CG, or altitude' },
  { label: 'Min Power vs Min Drag Speed', value: 'VMP = 0.76 VMD', note: 'L/D max is best glide range (0 wind)' },
  { label: 'Double Airspeed Effect on Parasite Drag', value: '4× Drag', note: 'Induced drag becomes ¼× at 1G' },
];

const CHECKRIDE_CALLS: CheckrideCall[] = [
  {
    id: 'pof-cr-1',
    question: 'If an aircraft enters a steady coordinated **60° bank level turn** (`n = 2.0 G`), how does its indicated stall speed change?',
    options: ['Increases by 41% (× √2)', 'Doubles (× 2.0)', 'Remains identical because AoA stays 15°', 'Increases by 15%'],
    answerIndex: 0,
    why: 'Stall speed scales with **√n**. At 60° bank, n = 1/cos(60°) = 2, so VS rises by **√2 = 1.414 (+41%)**.',
  },
  {
    id: 'pof-cr-2',
    question: 'In steady unaccelerated flight at **VMD** (best L/D ratio), what is the relationship between Induced Drag and Parasite Drag?',
    options: [
      'Induced Drag equals Parasite Drag (Di = Dp)',
      'Induced Drag is three times Parasite Drag',
      'Parasite Drag is zero',
      'Total Drag equals zero',
    ],
    answerIndex: 0,
    why: 'Mathematically, the sum of an inverse-square curve (**Di**) and square curve (**Dp**) minimizes right where **Di = Dp**.',
  },
  {
    id: 'pof-cr-3',
    question: 'How does doubling aircraft **mass** at constant load factor (`n = 1`) and constant airspeed affect **Induced Drag**?',
    options: ['Quadruples (× 4)', 'Doubles (× 2)', 'Halves (× 0.5)', 'Unchanged'],
    answerIndex: 0,
    why: 'Induced drag scales with **W² / V²**. Doubling mass doubles CL and multiplies **Induced Drag by 4**.',
  },
  {
    id: 'pof-cr-4',
    question: 'Why does a **trailing-edge flap** deflection reduce stall speed `VS`?',
    options: [
      'It increases CLmax by boosting wing camber and chord',
      'It increases critical Angle of Attack far above 25°',
      'It doubles engine thrust at low IAS',
      'It halves aircraft weight during approach',
    ],
    answerIndex: 0,
    why: 'Flaps raise **CLmax** dramatically (while critical AoA often decreases slightly), allowing 1G lift at lower **IAS**.',
  },
];

const FreePlayWindTunnelLab: React.FC<{ onBack: () => void; onSwitchStory: () => void }> = ({
  onBack,
  onSwitchStory,
}) => {
  const [airspeed, setAirspeed] = useState(210);
  const [aoa, setAoa] = useState(5);
  const [flapDeg, setFlapDeg] = useState(0);
  const [cutaway, setCutaway] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paramsRef = useRef({ airspeed, aoa, flapDeg, cutaway });
  paramsRef.current = { airspeed, aoa, flapDeg, cutaway };

  const massKg = 68000;
  const weightN = massKg * 9.81;
  const rho = 1.225;
  const wingArea = 122.6;
  const velMs = airspeed * 0.514444;
  const q = 0.5 * rho * velMs * velMs;

  const stalled = aoa >= 15;
  const flapClBonus = (flapDeg / 30) * 0.65;
  const rawCl = Math.max(0.05, 0.14 + 0.095 * aoa + flapClBonus);
  const cl = stalled ? rawCl * Math.max(0.42, 1 - (aoa - 15) * 0.1) : rawCl;
  const cd0 = 0.022 + (flapDeg / 30) * 0.035;
  const k = 0.048;
  const cd = cd0 + k * cl * cl + (stalled ? 0.14 : 0);

  const liftN = cl * q * wingArea;
  const dragN = cd * q * wingArea;
  const ldRatio = liftN / Math.max(1, dragN);
  const loadG = clamp(liftN / weightN, 0.2, 2.8);

  const statsRef = useRef({ liftN, weightN, dragN, loadG, aoa, airspeed, flapDeg, cutaway });
  statsRef.current = { liftN, weightN, dragN, loadG, aoa, airspeed, flapDeg, cutaway };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const isDarkNow = (document.documentElement.getAttribute('data-theme') || 'dark') === 'dark';
    let studio: AviationStudio | null = null;
    try {
      studio = createAviationStudio(canvas, { isDark: isDarkNow });
    } catch {
      return;
    }

    const a320 = createA320Rig(studio);
    const clouds = createCloudDeck(studio, { count: 7, yMin: -6, yMax: 7 });
    const streams = createAirflowStreamlines(studio, { count: 52 });
    const vLift = createForceArrow(studio, 'emerald', 0.15);
    const vWeight = createForceArrow(studio, 'gold', 0.15);
    const vThrust = createForceArrow(studio, 'sky', 0.15);
    const vDrag = createForceArrow(studio, 'red', 0.15);

    studio.scene.add(a320.root, clouds.group, streams.mesh, vLift.group, vWeight.group, vThrust.group, vDrag.group);

    let rafId = 0;
    let lastT = performance.now();
    let elapsed = 0;
    let az = -42;
    let el = 14;
    let dragActive = false;
    let lx = 0;
    let ly = 0;

    const onDown = (e: PointerEvent) => {
      dragActive = true;
      lx = e.clientX;
      ly = e.clientY;
    };
    const onMove = (e: PointerEvent) => {
      if (!dragActive) return;
      az -= (e.clientX - lx) * 0.35;
      el = clamp(el + (e.clientY - ly) * 0.25, -5, 80);
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
      const r = canvas.parentElement?.getBoundingClientRect();
      if (r && studio) studio.resize(r.width, r.height);
    };
    resize();
    const rObs = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
    if (canvas.parentElement) rObs?.observe(canvas.parentElement);

    const loop = (now: number) => {
      rafId = requestAnimationFrame(loop);
      if (document.hidden || !studio) {
        lastT = now;
        return;
      }
      const dt = Math.min(0.05, Math.max(0.001, (now - lastT) / 1000));
      lastT = now;
      elapsed += dt;

      const s = statsRef.current;
      a320.root.position.set(0, Math.sin(elapsed * 2.2) * 0.08, 0);
      a320.root.rotation.set(0, 0, (-s.aoa * Math.PI) / 180);
      a320.setState({
        gear: 0,
        flapDeg: s.flapDeg,
        bend: (s.loadG - 0.3) * 1.1,
        fanSpeed: s.airspeed / 65,
        cut: s.cutaway ? 1 : 0,
      });
      a320.tick(dt, elapsed);

      clouds.tick(elapsed, s.airspeed / 55);
      streams.tick(elapsed, s.airspeed, s.aoa, 15);

      const cg = new THREE.Vector3(-0.4, 2.0, 0);
      const liftLen = clamp((s.liftN / s.weightN) * 3.2, 0.5, 6.2);
      const dragLen = clamp((s.dragN / s.weightN) * 14.0, 0.5, 5.5);
      vLift.setVector(cg, new THREE.Vector3(0, liftLen, 0));
      vWeight.setVector(cg, new THREE.Vector3(0, -3.2, 0));
      vThrust.setVector(new THREE.Vector3(-2.5, 1.3, 0), new THREE.Vector3(-dragLen, 0, 0));
      vDrag.setVector(new THREE.Vector3(0.4, 2.0, 0), new THREE.Vector3(dragLen, 0, 0));

      const radAz = (az * Math.PI) / 180;
      const radEl = (el * Math.PI) / 180;
      const dist = 24;
      studio.camera.position.set(
        dist * Math.cos(radEl) * Math.sin(radAz),
        1.8 + dist * Math.sin(radEl),
        dist * Math.cos(radEl) * Math.cos(radAz)
      );
      studio.camera.lookAt(0, 1.9, 0);
      studio.focusShadow(0, 0, 26);
      studio.renderer.shadowMap.needsUpdate = true;
      studio.render();
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
  }, []);

  return (
    <div className="bg-dot-grid min-h-screen flex flex-col lg:flex-row">
      <aside className="w-full lg:w-96 border-b lg:border-b-0 lg:border-r border-line bg-bg-raised p-6 space-y-6">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-muted hover:text-ink cursor-pointer"
          >
            <ArrowLeft size={14} /> Hangar
          </button>
          <button
            type="button"
            onClick={onSwitchStory}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-cad-accent bg-cad-accent/15 text-[11px] font-mono font-bold uppercase text-ink cursor-pointer"
          >
            <Layers size={13} /> Guided Story
          </button>
        </div>

        <div>
          <span className="hud-label text-teal-400">EASA 081 // WIND TUNNEL LAB</span>
          <h2 className="font-display text-2xl font-bold text-ink mt-1">Four Forces 3D Rig</h2>
          <p className="text-xs text-muted mt-1">
            Drag airspeed, AoA, flaps, and cutaway to watch real-time GLSL wing flex &amp; stall vortex separation.
          </p>
        </div>

        <div className="space-y-4">
          <div className="dx-card p-3.5">
            <div className="flex justify-between font-mono text-xs mb-1.5">
              <span className="text-muted">TAS</span>
              <span className="font-bold text-sky-400">{airspeed} kt</span>
            </div>
            <input type="range" min={85} max={440} step={5} value={airspeed} onChange={(e) => setAirspeed(Number(e.target.value))} className="w-full accent-sky-400 cursor-pointer" />
          </div>

          <div className="dx-card p-3.5">
            <div className="flex justify-between font-mono text-xs mb-1.5">
              <span className="text-muted">Angle of Attack (α)</span>
              <span className={`font-bold ${stalled ? 'text-rose-400' : 'text-emerald-400'}`}>
                {aoa}° {stalled ? '(STALL)' : ''}
              </span>
            </div>
            <input type="range" min={-2} max={20} step={0.5} value={aoa} onChange={(e) => setAoa(Number(e.target.value))} className="w-full accent-emerald-400 cursor-pointer" />
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {[0, 15, 30].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFlapDeg(f)}
                className={`py-2 font-mono text-xs font-bold border cursor-pointer ${
                  flapDeg === f ? 'border-cad-accent bg-cad-accent text-white' : 'border-line bg-bg text-muted'
                }`}
              >
                Flaps {f}°
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setCutaway((c) => !c)}
            className={`w-full py-2 font-mono text-xs font-bold uppercase border flex items-center justify-center gap-2 cursor-pointer ${
              cutaway ? 'border-amber-400 bg-amber-500/20 text-amber-300' : 'border-line bg-bg text-ink'
            }`}
          >
            <Eye size={14} /> {cutaway ? 'Close Fuselage Skin' : 'Open Fuselage Cutaway'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 font-mono text-xs">
          <div className="dx-card p-3">
            <span className="text-[10px] text-muted">Lift</span>
            <div className="text-base font-bold text-emerald-400">{Math.round(liftN / 1000)} kN</div>
          </div>
          <div className="dx-card p-3">
            <span className="text-[10px] text-muted">Drag</span>
            <div className="text-base font-bold text-rose-400">{Math.round(dragN / 1000)} kN</div>
          </div>
          <div className="dx-card p-3">
            <span className="text-[10px] text-muted">CL / CD</span>
            <div className="text-sm font-bold text-ink">{cl.toFixed(2)} / {cd.toFixed(3)}</div>
          </div>
          <div className="dx-card p-3">
            <span className="text-[10px] text-muted">L/D (Load {loadG.toFixed(2)}G)</span>
            <div className="text-base font-bold text-sky-400">{ldRatio.toFixed(1)} : 1</div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setAirspeed(210);
            setAoa(5);
            setFlapDeg(0);
            setCutaway(false);
          }}
          className="w-full py-2.5 border border-line bg-bg hover:border-line-strong font-mono text-xs font-bold uppercase flex items-center justify-center gap-2 text-ink cursor-pointer"
        >
          <RotateCcw size={14} /> Reset 1G Trim
        </button>
      </aside>

      <div className="flex-1 min-h-[460px] relative">
        <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />
        <div className="absolute top-4 left-4 dx-card px-3 py-1.5 font-mono text-[11px] flex items-center gap-2">
          <Wind size={14} className={stalled ? 'text-rose-400' : 'text-sky-400'} />
          <span>{stalled ? 'CRITICAL AOA EXCEEDED — FLOW SEPARATED' : 'LAMINAR / ATTACHED STREAMLINES · DRAG TO ORBIT'}</span>
        </div>
      </div>
    </div>
  );
};

const ForcesOfFlight: React.FC<Props> = ({ onBack }) => {
  const [viewMode, setViewMode] = useState<'story' | 'lab'>('story');

  const createScene = useCallback((studio: AviationStudio): ScrollySceneInstance => {
    const a320 = createA320Rig(studio);
    const clouds = createCloudDeck(studio, { count: 6, yMin: -3.5, yMax: 6.5 });
    const streams = createAirflowStreamlines(studio, { count: 54 });
    const vLift = createForceArrow(studio, 'emerald', 0.14);
    const vWeight = createForceArrow(studio, 'gold', 0.14);
    const vThrust = createForceArrow(studio, 'sky', 0.14);
    const vDrag = createForceArrow(studio, 'red', 0.14);

    studio.scene.add(a320.root, clouds.group, streams.mesh, vLift.group, vWeight.group, vThrust.group, vDrag.group);

    return {
      apply(state) {
        const aoa = state.aoaDeg ?? 4;
        const tas = state.tasKts ?? 220;
        const loadG = state.loadG ?? 1.0;

        a320.root.position.set(0, 0, 0);
        a320.root.rotation.set(0, 0, (-aoa * Math.PI) / 180);
        a320.setState({
          gear: state.gear ?? 0,
          flapDeg: state.flapDeg ?? 0,
          bend: (loadG - 0.3) * 1.15,
          fanSpeed: tas / 65,
          cut: state.cut ?? 0,
          cargoRatio: 0.65,
          fuelRatio: 0.75,
        });

        const stalled = aoa >= 15 || (state.tipStall ?? 0) > 0.5;
        const liftVecLen = clamp(loadG * 2.9 * (stalled ? 0.65 : 1), 0.9, 5.2);
        const dragVecLen = clamp((tas / 220) ** 2 * 1.9 + (stalled ? 2.2 : 0.6), 1.0, 5.2);

        vLift.setVector(new THREE.Vector3(-0.3, 3.15, 0), new THREE.Vector3(0, liftVecLen, 0));
        vWeight.setVector(new THREE.Vector3(-0.3, 0.85, 0), new THREE.Vector3(0, -2.9, 0));
        vThrust.setVector(new THREE.Vector3(-4.2, 0.95, 3.2), new THREE.Vector3(-dragVecLen, 0, 0));
        vDrag.setVector(new THREE.Vector3(8.0, 2.25, 0), new THREE.Vector3(dragVecLen, 0, 0));

        studio.focusShadow(0, 0, 28);
      },
      tick(elapsed, state, dt) {
        a320.tick(dt, elapsed);
        const tas = state.tasKts ?? 220;
        const aoa = state.aoaDeg ?? 4;
        clouds.tick(elapsed, tas / 60);
        streams.tick(elapsed, tas, aoa, 15);
      },
      getAnchors() {
        a320.root.updateMatrixWorld(true);
        return {
          nose: a320.anchors.nose.getWorldPosition(new THREE.Vector3()),
          cg: a320.anchors.cg.getWorldPosition(new THREE.Vector3()),
          wingTipL: a320.anchors.wingTipL.getWorldPosition(new THREE.Vector3()),
          wingTipR: a320.anchors.wingTipR.getWorldPosition(new THREE.Vector3()),
          engineL: a320.anchors.engineL.getWorldPosition(new THREE.Vector3()),
          tail: a320.anchors.tail.getWorldPosition(new THREE.Vector3()),
          fuelTank: a320.anchors.fuelTank.getWorldPosition(new THREE.Vector3()),
        };
      },
      getReadout(state): ScrollyTelemetryItem[] {
        const tas = Math.round(state.tasKts ?? 220);
        const aoa = Number((state.aoaDeg ?? 4).toFixed(1));
        const velMs = tas * 0.514444;
        const cl = Math.max(0.1, 0.14 + 0.095 * aoa);
        const liftKn = Math.round((0.5 * 1.225 * velMs * velMs * 122.6 * cl) / 1000);
        const stalled = aoa >= 15;
        return [
          { label: 'TAS', value: `${tas}`, unit: 'kt' },
          { label: 'AoA (α)', value: `${aoa}°`, unit: stalled ? 'STALL' : 'CLEAN' },
          { label: 'Est. Lift', value: `${liftKn}`, unit: 'kN' },
          { label: 'Load Factor', value: `${(liftKn / 667).toFixed(2)}`, unit: 'G' },
        ];
      },
    };
  }, []);

  if (viewMode === 'lab') {
    return (
      <FreePlayWindTunnelLab
        onBack={onBack}
        onSwitchStory={() => setViewMode('story')}
      />
    );
  }

  return (
    <ScrollySceneLesson
      chapterCode="081.01"
      subjectName="PRINCIPLES OF FLIGHT"
      subjectColor="var(--subj-pof)"
      heroTitle="Held up by air it cannot grip."
      heroLede="How dynamic pressure, **Angle of Attack**, GLSL wing-spar flexing, and total drag trade-offs keep an A320 flying — and why **15° breaks lift at any speed**."
      flightLine="Flight VEC-081 · Subsonic Wind Tunnel · A320-214 Clean"
      loaderText="Pressurizing subsonic wind tunnel…"
      oneMinuteItems={ONE_MINUTE_ITEMS}
      beats={BEATS}
      confusionPairs={CONFUSION_PAIRS}
      kneeboard={{
        title: 'Aerodynamics & Stall Mechanics Sheet',
        formulas: KNEEBOARD_FORMULAS,
        keyNumbers: KNEEBOARD_NUMBERS,
        memoryHooks: [
          'Pitch is horizon-relative; **Angle of Attack** is airflow-relative.',
          'Turn stall speed scales with **√n** (60° bank = 2G → +41% VS).',
          'Induced Drag falls (**1/V²**) while Parasite Drag climbs (**V²**) — crossing at **VMD**.',
        ],
      }}
      checkrideCalls={CHECKRIDE_CALLS}
      acarsDebrief={{
        chapterLabel: '081.01 // FORCES & STALL',
        headline: 'WIND TUNNEL FLIGHT TEST — **VERIFIED**',
        rows: [
          { label: 'Lift law', value: 'L = ½ · ρ · V_TAS² · S · CL' },
          { label: 'Stall trigger', value: 'Constant ~15° Critical AoA (any IAS)' },
          { label: 'Minimum Drag VMD', value: 'Induced Drag = Parasite Drag (L/D max)' },
        ],
      }}
      createScene={createScene}
      headerRightSlot={
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onBack}
            className="px-2.5 py-1.5 border border-line bg-bg text-[11px] font-mono font-bold uppercase text-muted hover:text-ink cursor-pointer"
          >
            ← Hangar
          </button>
          <button
            type="button"
            onClick={() => setViewMode('lab')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono font-bold uppercase border border-teal-400/60 bg-teal-500/15 text-ink hover:bg-teal-600 hover:text-white transition-colors cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" /> Free Wind Tunnel
          </button>
        </div>
      }
    />
  );
};

export default ForcesOfFlight;
