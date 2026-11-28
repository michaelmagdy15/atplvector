import React, { useCallback, useState } from 'react';
import * as THREE from 'three';
import { Layers, Sliders } from 'lucide-react';
import {
  AIRCRAFT_PRESETS,
  calculateAtmosphere,
  calculateTakeoffPerformance,
} from '../../lib/aviation/aircraftPerformance';
import {
  AviationStudio,
  clamp,
  createA320Rig,
  createForceArrow,
  createRunwayRig,
  lerp,
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
import { View } from '../../types';
import TakeoffSandboxLab from './TakeoffSandboxLab';

interface TakeoffPerfProps {
  onChangeView?: (view: View) => void;
}

const ONE_MINUTE_ITEMS: OneMinuteItem[] = [
  {
    num: '01',
    headline: 'TORA · TODA · ASDA',
    body: '**TORA** is paved runway; **TODA** adds up to 50% Clearway; **ASDA** adds load-bearing Stopway.',
    accent: 'var(--subj-perf)',
  },
  {
    num: '02',
    headline: 'Decision Speed V1',
    body: 'Fail below **V1** → reject & stop within **ASDA**. Fail at/above **V1** → continue takeoff.',
    accent: '#38bdf8',
  },
  {
    num: '03',
    headline: 'Balanced Field',
    body: 'Choosing **V1** where **TODR = ASDR** gives the shortest required field and maximum take-off mass.',
    accent: '#f59e0b',
  },
  {
    num: '04',
    headline: 'Hot & High Compounding',
    body: 'Low **σ** raises liftoff **TAS** AND cuts thrust simultaneously — roll grows roughly as {{1 // σ²}}.',
    accent: '#fb7185',
  },
  {
    num: '05',
    headline: 'Wet 15 ft Screen',
    body: 'On a **wet runway**, OEI TODR finishes over a **15 ft** screen (not 35 ft) while ASDR lengthens sharply.',
    accent: '#34d399',
  },
];

const BEATS: ScrollyBeatSpec[] = [
  {
    id: 'pf-declared',
    actTitle: 'Declared Distances (RWY 27L)',
    questionTitle: 'Why can TODA and ASDA extend beyond the concrete?',
    examRule: 'TODA = TORA + Clearway (capped at **50% of TORA**); ASDA = TORA + Stopway; LDA subtracts any **displaced threshold**.',
    memoryHook: '**Clear**way lets you **Climb** (fly over, max half TORA); **Stop**way must hold your wheels on an aborted **Stop**.',
    askedInEasa: true,
    analogy: 'Think of Clearway as mowed flat safety grass with no trees — safe to climb over, terrible for braking heavy landing tyres.',
    scaleNote: 'A320 scaled 1.6× relative to RWY 27L width for crisp visual cues.',
    say: 'On **RWY 27L at Heathrow**, brake release starts at the threshold piano keys. Concrete stops at **TORA** — yet dispatch credit can reach slightly farther into the Stopway chevrons and obstacle-free Clearway.',
    sub: 'Notice the magenta shoulder distance bar stretching past TORA end to the teal 35 ft obstacle screen gate.',
    camera: [46, 18, 62, 14, 1.8, 0],
    sceneState: {
      acX: 19,
      acY: 0,
      pitchDeg: 0,
      gear: 1,
      flapDeg: 10,
      bend: 0.3,
      wet: 0,
      showGhost: 0,
      ghostX: 0,
      showStopway: 1,
      showClearway: 1,
      distFrac: 0.85,
      oatC: 15,
      elevFt: 83,
      windKts: 0,
      cut: 0,
      cargoRatio: 0.7,
      fuelRatio: 0.8,
      speedLabel: 'TAXI / HOLD',
    },
    tags: [
      { anchor: 'threshold', label: 'Brake Release (0 m)', tone: 'ink' },
      { anchor: 'toraEnd', label: 'TORA End (Paved)', tone: 'amber' },
      { anchor: 'stopway', label: 'Stopway (Chevrons)', tone: 'rose' },
      { anchor: 'clearway', label: 'Clearway (Max 50% TORA)', tone: 'emerald' },
    ],
    gate: {
      id: 'gate-clearway-cap',
      kind: 'redpen',
      askedInEasa: true,
      ask: 'An airfield briefing card contains ONE illegal EASA Annex 14 / CS-25 declared-distance number. **Tap the wrong line** to red-pen it:',
      rows: [
        { label: 'RWY 27L TORA', value: '3,000 m', note: 'Published paved take-off run.' },
        { label: 'Published Stopway', value: '300 m (ASDA 3,300 m)', note: 'Load-bearing overrun pad is legal.' },
        {
          label: 'Credited Clearway',
          value: '1,800 m (TODA 4,800 m)',
          fix: '1,500 m MAX (50% TORA → TODA 4,500 m)',
        },
        { label: 'Displaced Threshold', value: '200 m (LDA 2,800 m)', note: 'Available for takeoff start, not landing touchdown.' },
      ],
      yes: 'Caught it — Clearway credit is capped strictly at 50% of TORA!',
      why: 'No matter how flat the sea beyond the runway is, ICAO Annex 14 / CS-25 never lets credited Clearway exceed **50% of TORA**.',
    },
  },
  {
    id: 'pf-six-speeds',
    actTitle: 'Six Speeds, One Runway',
    questionTitle: 'Why must V1 always sit between VMCG and VR?',
    examRule: 'The legal takeoff speed ladder is strictly **VMCG ≤ V1 ≤ VR**, followed by **VLOF** and **V2 ≥ 1.13 VSR**.',
    memoryHook: '**M**inimum **C**ontrol on **G**round (VMCG) comes before **1**st choice (**V1**), which must come before **R**otation (**VR**).',
    askedInEasa: true,
    analogy: 'You cannot decide to stay on the runway (V1) after your nosewheel is already lifting off the concrete (VR).',
    say: 'Watch the A320 accelerate past **VMCG** — the speed where rudder airflow finally overpowers an asymmetric dead engine on the ground. Only above VMCG can you safely continue on one engine.',
    sub: 'As flaps sit at 1+F (10°), wing lift bends the tips gently upward via the **uBend** load shader as speed climbs toward VR and liftoff.',
    camera: [-40, 14, 33, -4, 2.0, 0],
    sceneState: {
      acX: -4,
      acY: 0.4,
      pitchDeg: 4,
      gear: 1,
      flapDeg: 15,
      bend: 0.85,
      wet: 0,
      showGhost: 0,
      ghostX: 0,
      showStopway: 1,
      showClearway: 1,
      distFrac: 0.72,
      oatC: 15,
      elevFt: 83,
      windKts: 0,
      cut: 0,
      speedLabel: 'VR → VLOF',
    },
    tags: [
      { anchor: 'nose', label: 'VR Rotation (Nose up)', tone: 'sky' },
      { anchor: 'wingTipR', label: 'Lift Flexing Wing', tone: 'emerald' },
      { anchor: 'gearMain', label: 'VLOF Unstick', tone: 'amber' },
    ],
    gate: {
      id: 'gate-vspeed-tape',
      kind: 'tape',
      ask: 'Build the certified CS-25 **Takeoff V-Speed Tape** from **slowest to fastest**:',
      orderedSpeeds: ['VMCG', 'V1', 'VR', 'VLOF', 'V2'],
      hints: {
        VMCG: 'Start with the lowest speed where aerodynamic rudder can hold directional control on ground.',
        V1: 'Decision speed must sit above VMCG and at or below VR.',
        VR: 'Rotation initiation always follows V1.',
        VLOF: 'The main wheels actually lift off slightly after VR rotation starts.',
        V2: 'Target climb safety speed reached by the 35 ft screen.',
      },
      notes: {
        VMCG: 'Rudder directional authority established.',
        V1: 'Go / No-Go commitment point.',
        VR: 'Pitch attitude rotates smoothly toward 15°.',
        VLOF: 'Main bogies leave RWY 27L.',
        V2: 'Climb gradient protected at 35 ft screen.',
      },
      why: 'In EASA exams, any V-speed ordering where **V1 < VMCG** or **V1 > VR** is an instant invalid flight-manual dispatch.',
    },
  },
  {
    id: 'pf-v1-wet',
    actTitle: 'Engine Failure at V1 & Wet Runways',
    questionTitle: 'Why does rain lower your optimum V1?',
    examRule: 'Water reduces wheel braking friction, lengthening **ASDR** dramatically. To rebalance **TODR = ASDR**, **Balanced V1 decreases**.',
    memoryHook: '**Wet brakes slide further** → abort earlier (**lower V1**) and take CS-25’s **15 ft wet screen** credit if needed.',
    askedInEasa: true,
    say: 'When the #1 CFM56 surges and flames out right at **V1**, two futures split on the runway: the translucent ghost stops all-out within **ASDA**, while the committed aircraft climbs OEI through the **35 ft screen**.',
    sub: 'Now test your intuition: on a flooded wet runway, which way must Balanced V1 move?',
    formula: {
      name: 'BALANCED FIELD EQUILIBRIUM',
      expr: 'TODR_{{OEI}} (V1) = ASDR (V1)   |   TODA_{{wet screen}} = 15 ft',
      note: 'Kinetic energy grows with V²; friction drop hurts braking far more than OEI climb.',
    },
    camera: [-15, 22, 42, -38, 1.8, 0],
    sceneState: {
      acX: -48,
      acY: 3.4,
      pitchDeg: 11,
      gear: 1,
      flapDeg: 15,
      bend: 1.15,
      wet: 1,
      showGhost: 1,
      ghostX: -54,
      showStopway: 1,
      showClearway: 1,
      distFrac: 0.94,
      oatC: 15,
      elevFt: 83,
      windKts: 0,
      cut: 0,
      speedLabel: 'OEI V2 CLIMB',
    },
    tags: [
      { anchor: 'screenGate', label: '35 ft Dry / 15 ft Wet Screen', tone: 'emerald' },
      { anchor: 'engineL', label: 'OEI Asymmetric Thrust', tone: 'rose' },
      { anchor: 'stopway', label: 'Ghost RTO Stop Point', tone: 'amber' },
    ],
    gate: {
      id: 'gate-wet-v1-call',
      kind: 'call',
      askedInEasa: true,
      ask: 'Dry Balanced V1 is **138 kt**. Monsoon rain pools on RWY 27L. Slide the predicted **Wet Balanced V1**, then click **Run it** to watch the ghost RTO slide!',
      lever: {
        key: 'predictedWetV1',
        label: 'Predicted Wet Balanced V1',
        unit: 'kt IAS',
        min: 120,
        max: 150,
        step: 1,
        start: 138,
      },
      baseValue: 138,
      truthValue: 130,
      during: { wet: 1, showGhost: 1 },
      playTween: { key: 'ghostX', from: -10, to: -61, ms: 2600 },
      yes: 'Spot on — Balanced V1 drops! Starting an abort slower recovers precious braking margin on wet asphalt.',
      why: 'Wet friction cuts deceleration, shooting the **ASDR curve upward** on the right. Its intersection with the OEI TODR curve shifts **down and left to a lower V1** (requiring a longer Balanced Field overall).',
      showOnPass: { wet: 1, showGhost: 1, ghostX: -61 },
    },
  },
  {
    id: 'pf-hot-high',
    actTitle: 'Hot, High & Tailwind Compounding',
    questionTitle: 'Why does high Density Altitude punish ground roll twice?',
    examRule: 'Thinner air forces higher **TAS = IAS / √σ** to rotate while starving engines of air mass flow, lengthening roll roughly with **1/σ²**.',
    memoryHook: '**Hot + High + Humid = Heavy penalty twice**: **more speed needed** across concrete AND **less push** to reach it.',
    askedInEasa: true,
    analogy: 'Like trying to reach 100 km/h up a hill in third gear with half the throttle blocked — it takes disproportionately more road.',
    say: 'Climb into an Alpine summer departure like Samedan (5,660 ft, +28°C, 3 kt valley tailwind). Indicated VR barely moves on the airspeed tape, yet true speed across the concrete balloons while thrust falls.',
    camera: [-46, 10, 24, -22, 1.8, 0],
    sceneState: {
      acX: -22,
      acY: 0.1,
      pitchDeg: 1.5,
      gear: 1,
      flapDeg: 15,
      bend: 0.65,
      wet: 0,
      showGhost: 0,
      ghostX: -22,
      showStopway: 1,
      showClearway: 1,
      distFrac: 0.96,
      oatC: 34,
      elevFt: 5600,
      windKts: -8,
      cut: 0,
      speedLabel: 'HIGH DA ROLL',
    },
    tags: [
      { anchor: 'toraEnd', label: 'Stretched Ground Roll', tone: 'rose' },
      { anchor: 'engineL', label: 'Thin-Air Thrust Loss', tone: 'amber' },
    ],
    gate: {
      id: 'gate-todr-num',
      kind: 'num',
      askedInEasa: true,
      generator: 'takeoffGroundRoll',
    },
  },
  {
    id: 'pf-rtom-cols',
    actTitle: 'Regulated Take-Off Mass (RTOM)',
    questionTitle: 'How do three limit columns cap your maximum payload?',
    examRule: '**RTOM = min(MTOM, MLM + Trip Fuel, MZFM + Take-Off Fuel)**. Never exceed the lowest structural ceiling.',
    memoryHook: '**One flight, three ceilings**: Take-off weight now, **Landing weight** after burning Trip Fuel, and **Wing-bend (MZFM)** with all fuel loaded.',
    askedInEasa: true,
    say: 'Now slice the A320 fuselage open in cutaway view. Watch forward cargo, aft cargo, and the center wing fuel tank fill as you solve the classic **3-column EASA RTOM & Max Traffic Load** dispatch sheet.',
    camera: [14, 15, 24, -1, 1.9, 0],
    sceneState: {
      acX: 0,
      acY: 0,
      pitchDeg: 0,
      gear: 1,
      flapDeg: 0,
      bend: 0.4,
      wet: 0,
      showGhost: 0,
      ghostX: 0,
      showStopway: 0,
      showClearway: 0,
      distFrac: 0.5,
      oatC: 15,
      elevFt: 83,
      windKts: 0,
      cut: 1,
      cargoRatio: 0.2,
      fuelRatio: 0.85,
      speedLabel: 'LOADSHEET CUTAWAY',
    },
    tags: [
      { anchor: 'cargoFwd', label: 'Forward Cargo Hold', tone: 'amber' },
      { anchor: 'fuelTank', label: 'Center Fuel Tank (TOF)', tone: 'sky' },
      { anchor: 'cargoAft', label: 'Aft Cargo Hold', tone: 'emerald' },
    ],
    gate: {
      id: 'gate-rtom-builder',
      kind: 'cols',
    },
  },
];

const CONFUSION_PAIRS: ConfusionPair[] = [
  {
    leftTitle: 'TORA vs TODA',
    leftBody: '**TORA** is strictly load-bearing runway declared available for ground run.',
    leftColor: '#38bdf8',
    rightTitle: 'TODA (with Clearway)',
    rightBody: '**TODA = TORA + Clearway** (airspace/surface free of obstacles, capped at **50% TORA**).',
    rightColor: '#34d399',
    tellApart: 'You cannot put wheels on a Clearway — only your 35 ft airborne climb passes over it.',
  },
  {
    leftTitle: 'VMCG',
    leftBody: 'Minimum control speed on **Ground** using aerodynamic rudder alone (max **30 ft** lateral deviation, NWS disconnected).',
    leftColor: '#ec4899',
    rightTitle: 'VMCA',
    rightBody: 'Minimum control speed in the **Air** with up to **5° bank** toward the live engine.',
    rightColor: '#f59e0b',
    tellApart: '**G = Ground** (V1 must be ≥ VMCG); **A = Air** (V2 ≥ 1.10 VMCA). Bank is allowed in air, never on concrete.',
  },
  {
    leftTitle: 'Balanced Field',
    leftBody: 'V1 selected so **TODR = ASDR**, yielding minimum field length and max TOM.',
    leftColor: '#14b8a6',
    rightTitle: 'Unbalanced (Clearway / Stopway)',
    rightBody: 'Excess Clearway lets you **lower V1**; excess Stopway lets you **raise V1** toward VR.',
    rightColor: '#a855f7',
    tellApart: 'Look at which distance is extra: spare Clearway → fly earlier (**lower V1**); spare Stopway → stop later (**higher V1**).',
  },
  {
    leftTitle: 'Dry 35 ft Screen',
    leftBody: 'CS-25 dry OEI TODR must reach **35 ft** above takeoff surface by end of TODA.',
    leftColor: '#38bdf8',
    rightTitle: 'Wet 15 ft Screen',
    rightBody: 'On a **wet runway**, CS-25 permits clearing only a **15 ft** screen height for TODR.',
    rightColor: '#fb7185',
    tellApart: 'Never apply the **15 ft** rule on a dry runway — it is strictly a wet-runway OEI concession to offset longer wet ASDR.',
  },
];

const KNEEBOARD_FORMULAS: KneeboardFormula[] = [
  { name: 'Declared Distances', formula: 'TODA = TORA + min(Clearway, 0.5 × TORA)  |  ASDA = TORA + Stopway' },
  { name: 'Speed Ladder (CS-25)', formula: 'V_{{MCG}} ≤ V_1 ≤ V_R ≤ V_{{MBE}}   and   V_2 ≥ 1.13 V_{{SR}}' },
  { name: 'True Liftoff Speed', formula: 'TAS = {{IAS // √σ}}   (Density Ratio σ = {{ρ // 1.225}})' },
  { name: 'Three-Column RTOM', formula: 'RTOM = min(MTOM, MLM + Trip, MZFM + TOF)   |   MTL = RTOM − DOM − TOF' },
];

const KNEEBOARD_NUMBERS: KneeboardNumber[] = [
  { label: 'Clearway Cap (Annex 14 / CS-25)', value: 'Max 50% TORA', note: 'Excess clearway ignored' },
  { label: 'CS-25 Screen Height (Dry / Wet)', value: '35 ft / 15 ft', note: 'CS-23 Piston Class B: 50 ft' },
  { label: 'CS-25 All-Engine Factor', value: '1.15 ×', note: 'CS-23 unfactored × 1.25' },
  { label: 'Tailwind Rule of Thumb', value: '+15% per 5 kt', note: 'Headwind subtracts ~1% per 2 kt' },
  { label: 'V2 Minimum Margin', value: '1.13 VSR / 1.10 VMCA', note: 'Jet / 2-engine transport' },
];

const CHECKRIDE_CALLS: CheckrideCall[] = [
  {
    id: 'cr-1',
    question: 'TORA is 2,400 m, Stopway is 200 m, and Clearway is 1,500 m. What is the legally credited **TODA**?',
    options: ['3,600 m', '3,900 m', '2,600 m', '3,150 m'],
    answerIndex: 0,
    why: 'Clearway credit is capped at **50% of TORA** (0.5 × 2,400 = 1,200 m). TODA = 2,400 + 1,200 = **3,600 m**.',
  },
  {
    id: 'cr-2',
    question: 'If an aircraft experiences an engine failure just **above V1** on a dry runway, what is the required Class A procedure?',
    options: [
      'Continue the takeoff and climb over a 35 ft screen',
      'Reject immediately using maximum reverse and autobrake',
      'Continue only if Clearway is at least 300 m',
      'Reduce thrust on the live engine to maintain centerline',
    ],
    answerIndex: 0,
    why: 'Above **V1**, ASDA braking margin is gone; the aircraft is certified to continue OEI and clear **35 ft** by the end of TODA.',
  },
  {
    id: 'cr-3',
    question: 'Moving from a **dry** runway to a **wet** runway requires what change to Balanced V1 and Balanced Field Length?',
    options: [
      'Balanced V1 decreases and Balanced Field Length increases',
      'Balanced V1 increases and Balanced Field Length increases',
      'Balanced V1 decreases and Balanced Field Length decreases',
      'Both stay unchanged because lift depends only on airspeed',
    ],
    answerIndex: 0,
    why: 'Worse braking raises ASDR, shifting the ASDR/TODR intersection to a **lower V1** and a **longer required field**.',
  },
  {
    id: 'cr-4',
    question: 'Using the three-column rule: **MTOM 75,000 kg**, **MLM 66,000 kg**, **MZFM 61,500 kg**, **Trip Fuel 6,000 kg**, **TOF 8,800 kg**. What is **RTOM**?',
    options: ['70,300 kg', '72,000 kg', '75,000 kg', '66,000 kg'],
    answerIndex: 0,
    why: 'Cols: MTOM = 75,000 | MLM+Trip = 72,000 | **MZFM+TOF = 61,500 + 8,800 = 70,300 kg** (the smallest wins).',
  },
  {
    id: 'cr-5',
    question: 'What is the maximum screen height permitted by CS-25 for OEI **TODR on a wet runway**?',
    options: ['15 ft', '35 ft', '50 ft', '25 ft'],
    answerIndex: 0,
    why: 'CS-25 lowers the wet-runway OEI screen height requirement from **35 ft** to **15 ft**.',
  },
];

export const TakeoffPerf: React.FC<TakeoffPerfProps> = ({ onChangeView }) => {
  const [viewMode, setViewMode] = useState<'story' | 'sandbox'>('story');

  const createScene = useCallback((studio: AviationStudio): ScrollySceneInstance => {
    const a320 = createA320Rig(studio);
    const ghost = createA320Rig(studio, { ghost: true, opacity: 0.25, tint: 'sky' });
    const runway = createRunwayRig(studio);
    const thrustVec = createForceArrow(studio, 'sky', 0.14);
    const liftVec = createForceArrow(studio, 'emerald', 0.14);

    studio.scene.add(runway.group, a320.root, ghost.root, thrustVec.group, liftVec.group);

    return {
      apply(state) {
        const acX = state.acX ?? 0;
        const acY = state.acY ?? 0;
        const pitch = ((state.pitchDeg ?? 0) * Math.PI) / 180;

        a320.root.position.set(acX, acY, 0);
        a320.root.rotation.set(0, 0, -pitch);
        a320.setState({
          gear: state.gear ?? 1,
          flapDeg: state.flapDeg ?? 10,
          bend: state.bend ?? 0.4,
          fanSpeed: 3.4,
          cut: state.cut ?? 0,
          cargoRatio: state.cargoRatio ?? 0.7,
          fuelRatio: state.fuelRatio ?? 0.8,
        });

        ghost.root.visible = (state.showGhost ?? 0) > 0.5;
        ghost.root.position.set(state.ghostX ?? -50, 0, -4.5);
        ghost.setState({ gear: 1, flapDeg: 15, bend: 0.2 });

        runway.group.visible = (state.cut ?? 0) < 0.5;
        runway.setConfig({
          showStopway: (state.showStopway ?? 1) > 0.5,
          showClearway: (state.showClearway ?? 1) > 0.5,
          wet: (state.wet ?? 0) > 0.5,
          highlightDistFrac: state.distFrac ?? 0.75,
        });

        // Thrust & Lift force arrows
        const liftMag = 1.6 + (state.pitchDeg ?? 0) * 0.25;
        liftVec.setVector(
          new THREE.Vector3(acX - 0.5, acY + 2.2, 0),
          new THREE.Vector3(0, liftMag, 0)
        );
        thrustVec.setVector(
          new THREE.Vector3(acX - 1.6, acY + 1.1, 3.2),
          new THREE.Vector3(-3.2, 0, 0)
        );

        studio.focusShadow(acX, 0, 36);
      },
      tick(elapsed, _state, dt) {
        a320.tick(dt, elapsed);
        runway.tick?.(elapsed);
      },
      getAnchors() {
        a320.root.updateMatrixWorld(true);
        runway.group.updateMatrixWorld(true);
        return {
          nose: a320.anchors.nose.getWorldPosition(new THREE.Vector3()),
          wingTipR: a320.anchors.wingTipR.getWorldPosition(new THREE.Vector3()),
          gearMain: a320.anchors.gearMain.getWorldPosition(new THREE.Vector3()),
          engineL: a320.anchors.engineL.getWorldPosition(new THREE.Vector3()),
          cargoFwd: a320.anchors.cargoFwd.getWorldPosition(new THREE.Vector3()),
          cargoAft: a320.anchors.cargoAft.getWorldPosition(new THREE.Vector3()),
          fuelTank: a320.anchors.fuelTank.getWorldPosition(new THREE.Vector3()),
          threshold: runway.anchors.threshold.getWorldPosition(new THREE.Vector3()),
          toraEnd: runway.anchors.toraEnd.getWorldPosition(new THREE.Vector3()),
          stopway: runway.anchors.stopway.getWorldPosition(new THREE.Vector3()),
          clearway: runway.anchors.clearway.getWorldPosition(new THREE.Vector3()),
          screenGate: runway.anchors.screenGate.getWorldPosition(new THREE.Vector3()),
        };
      },
      getReadout(state): ScrollyTelemetryItem[] {
        const elev = Math.round(state.elevFt ?? 83);
        const oat = Math.round(state.oatC ?? 15);
        const wind = Math.round(state.windKts ?? 0);
        const wet = (state.wet ?? 0) > 0.5;
        const cond = {
          elevationFt: elev,
          qnhHpa: 1013,
          oatC: oat,
          windKts: wind,
          runwaySlopePct: 0,
          surface: wet ? ('PAVED_WET' as const) : ('PAVED_DRY' as const),
        };
        const atm = calculateAtmosphere(cond);
        const ac = AIRCRAFT_PRESETS.airbus_a320;
        const perf = calculateTakeoffPerformance(ac, ac.maxTakeoffWeightLbs, cond);

        return [
          { label: 'Density Alt', value: `${Math.round(atm.densityAltFt).toLocaleString()}`, unit: 'ft' },
          { label: 'VR (IAS → TAS)', value: `${perf.vrIasKts} → ${perf.vrTasKts}`, unit: 'kt' },
          {
            label: wet ? 'Wet Factored TODR' : 'Factored TODR',
            value: `${perf.factoredRequiredDistanceFt.toLocaleString()}`,
            unit: 'ft',
          },
          { label: 'Phase', value: String(state.speedLabel || 'TAKEOFF') },
        ];
      },
    };
  }, []);

  const modeSwitchButton = (
    <button
      type="button"
      onClick={() => setViewMode(viewMode === 'story' ? 'sandbox' : 'story')}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono font-bold uppercase tracking-wider border border-cad-accent bg-cad-accent/15 text-ink hover:bg-cad-accent hover:text-white transition-colors cursor-pointer"
    >
      {viewMode === 'story' ? <Sliders className="w-3.5 h-3.5" /> : <Layers className="w-3.5 h-3.5" />}
      <span>{viewMode === 'story' ? 'Free-Play Lab' : 'Guided 3D Story'}</span>
    </button>
  );

  if (viewMode === 'sandbox') {
    return (
      <div className="bg-dot-grid min-h-screen">
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 flex items-center justify-between gap-4">
          <div>
            <span className="hud-label text-pink-400">EASA ATPL 032 // PERFORMANCE LAB</span>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-ink mt-1">
              Free-Play Takeoff Performance Sandbox
            </h1>
          </div>
          {modeSwitchButton}
        </div>
        <TakeoffSandboxLab onChangeView={onChangeView} />
      </div>
    );
  }

  return (
    <ScrollySceneLesson
      chapterCode="032.02"
      subjectName="AIRCRAFT PERFORMANCE"
      subjectColor="var(--subj-perf)"
      heroTitle="Six speeds, one runway."
      heroLede="How an **Airbus A320** decides when to stop, when to fly, and why **hot, wet, or heavy departures** squeeze the margin from both ends."
      flightLine="Flight VEC-032 · EGLL RWY 27L → LSZH · A320-214"
      loaderText="Taxiing A320 onto RWY 27L…"
      oneMinuteItems={ONE_MINUTE_ITEMS}
      beats={BEATS}
      confusionPairs={CONFUSION_PAIRS}
      kneeboard={{
        title: 'Take-Off Performance & RTOM Reference',
        formulas: KNEEBOARD_FORMULAS,
        keyNumbers: KNEEBOARD_NUMBERS,
        memoryHooks: [
          'Clearway lets you **Climb** (airborne only, capped at 50% TORA); Stopway holds wheels for **Stop**.',
          'Wet runway lowers **Balanced V1** because wet brakes slide further.',
          'RTOM is ALWAYS the **smallest** of MTOM, (MLM + Trip), and (MZFM + TOF).',
        ],
      }}
      checkrideCalls={CHECKRIDE_CALLS}
      acarsDebrief={{
        chapterLabel: '032.02 // TAKE-OFF & RTOM',
        headline: 'RWY 27L DISPATCH SUMMARY — **RELEASED**',
        rows: [
          { label: 'Declared distances', value: 'TODA ≤ TORA + 0.5×TORA Clearway' },
          { label: 'Certified speed order', value: 'VMCG ≤ V1 ≤ VR ≤ VLOF ≤ V2' },
          { label: 'Wet runway rule', value: 'Lower Balanced V1 · 15 ft OEI screen' },
          { heading: 'RTOM THREE COLUMNS' },
          { label: 'Take-Off Limit / Landing / Zero-Fuel', value: 'min(MTOM, MLM + Trip, MZFM + TOF)' },
        ],
      }}
      createScene={createScene}
      headerRightSlot={modeSwitchButton}
    />
  );
};

export default TakeoffPerf;
