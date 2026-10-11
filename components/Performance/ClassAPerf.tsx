import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Layers, Shield, AlertTriangle, CheckCircle2, Sliders,
  TrendingUp, Wind, Thermometer, Gauge, ArrowRight, HelpCircle
} from 'lucide-react';
import {
  AIRCRAFT_PRESETS,
  calculateAtmosphere,
  calculateTakeoffPerformance,
  calculateClimbPerformance,
  AtmosphericConditions
} from '../../lib/aviation/aircraftPerformance';

export const ClassAPerf: React.FC = () => {
  // Aircraft selection: Default to A320 or Citation Mustang
  const [selectedAircraftId, setSelectedAircraftId] = useState<'airbus_a320' | 'citation_mustang'>('airbus_a320');
  const aircraft = AIRCRAFT_PRESETS[selectedAircraftId];

  // Parameters
  const [weightKg, setWeightKg] = useState<number>(72000); // 72 Tons
  const [elevationFt, setElevationFt] = useState<number>(300); // Cairo / Frankfurt
  const [qnhHpa, setQnhHpa] = useState<number>(1013);
  const [oatC, setOatC] = useState<number>(30); // Hot summer day
  const [runwayCondition, setRunwayCondition] = useState<'DRY' | 'WET'>('DRY');

  // Convert kg to lbs for engine math
  const weightLbs = weightKg * 2.20462;

  // Conditions
  const conditions: AtmosphericConditions = useMemo(() => ({
    elevationFt,
    qnhHpa,
    oatC,
    windKts: 0,
    runwaySlopePct: 0,
    surface: runwayCondition === 'WET' ? 'PAVED_WET' : 'PAVED_DRY'
  }), [elevationFt, qnhHpa, oatC, runwayCondition]);

  const atmo = useMemo(() => calculateAtmosphere(conditions), [conditions]);

  // V-Speed calculations (Class A rules)
  // V1, VR, V2 depend on weight and density
  const baseV1 = selectedAircraftId === 'airbus_a320' ? 140 : 88;
  const baseVr = selectedAircraftId === 'airbus_a320' ? 144 : 91;
  const baseV2 = selectedAircraftId === 'airbus_a320' ? 148 : 97;

  const wtFactor = Math.sqrt(weightLbs / aircraft.maxTakeoffWeightLbs);
  const v1Ias = Math.round(baseV1 * wtFactor * (runwayCondition === 'WET' ? 0.95 : 1.0));
  const vrIas = Math.round(baseVr * wtFactor);
  const v2Ias = Math.round(baseV2 * wtFactor);

  // Takeoff climb segments (OEI - 2 engine jet)
  // Segment 2: Gross min 2.4%, Net = Gross - 0.8% = min 1.6%
  // Segment 4: Gross min 1.2%, Net = Gross - 0.8% = min 0.4%
  const tempPenalty = Math.max(0, oatC - 15) * 0.04;
  const daPenalty = (atmo.densityAltFt / 1000) * 0.12;

  const seg2GrossGrad = Math.max(1.5, Number((3.6 - tempPenalty - daPenalty).toFixed(2)));
  const seg2NetGrad = Number((seg2GrossGrad - 0.8).toFixed(2));

  const seg4GrossGrad = Math.max(0.8, Number((2.1 - tempPenalty * 0.7 - daPenalty * 0.6).toFixed(2)));
  const seg4NetGrad = Number((seg4GrossGrad - 0.8).toFixed(2));

  // Compliance check
  const isSeg2Compliant = seg2GrossGrad >= 2.4;
  const isSeg4Compliant = seg4GrossGrad >= 1.2;

  // Student quiz
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-4">
          <div className="bg-rose-500/10 dark:bg-rose-500/20 p-4 rounded-2xl text-rose-500 border border-rose-500/30">
            <Layers size={36} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                EASA CS-25 & CAT.POL.A.200+
              </span>
              <span className="text-xs text-slate-500 font-mono">Large Commercial Transport Aeroplanes</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              Class A Jet Performance Module
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base mt-1">
              Engine-Out Takeoff Segments, Gross vs Net Flight Paths, and Balanced Field Speeds
            </p>
          </div>
        </div>

        {/* Aircraft Selector */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => {
              setSelectedAircraftId('airbus_a320');
              setWeightKg(72000);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedAircraftId === 'airbus_a320'
                ? 'bg-rose-600 text-white font-black shadow'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Airbus A320-200
          </button>
          <button
            onClick={() => {
              setSelectedAircraftId('citation_mustang');
              setWeightKg(3900);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedAircraftId === 'citation_mustang'
                ? 'bg-rose-600 text-white font-black shadow'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Citation Mustang
          </button>
        </div>
      </div>

      {/* V-Speeds Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">V1 Decision Speed</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
              VMCG ≤ V1 ≤ VR
            </span>
          </div>
          <div className="text-3xl font-black font-mono text-red-500 mt-2">
            {v1Ias} <span className="text-sm font-normal text-slate-400">kts IAS</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Max speed to abort takeoff; failure before V1 MUST stop. Failure after V1 MUST continue.
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">VR Rotation Speed</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              VR ≥ 1.05 VMCA
            </span>
          </div>
          <div className="text-3xl font-black font-mono text-amber-500 mt-2">
            {vrIas} <span className="text-sm font-normal text-slate-400">kts IAS</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Speed where rotation is initiated at standard pitch rate (3°/sec) to reach V2 by 35 ft.
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">V2 Takeoff Safety Speed</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              V2 ≥ 1.13 VSR
            </span>
          </div>
          <div className="text-3xl font-black font-mono text-emerald-500 mt-2">
            {v2Ias} <span className="text-sm font-normal text-slate-400">kts IAS</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Target speed achieved by 35 ft screen height with one engine inoperative (OEI).
          </p>
        </div>
      </div>

      {/* The 4 Takeoff Climb Segments Visualizer */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-xl text-white flex items-center gap-2">
              <TrendingUp className="text-rose-500" />
              The Four Engine-Out Takeoff Climb Segments (CS-25.121)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Twin-jet Gross gradient minus 0.8% margin produces the regulatory Net Takeoff Flight Path.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl text-xs">
            <span className="px-3 py-1 font-bold text-slate-400">Gross Margin:</span>
            <span className="px-2 py-1 bg-rose-500/20 text-rose-300 font-mono font-bold rounded">
              -0.8% (Twin-Jet)
            </span>
          </div>
        </div>

        {/* 4 Segment Profile Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Segment 1 */}
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-bold text-rose-400">1st SEGMENT</span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">35' to Gear Up</span>
            </div>
            <div className="space-y-1 text-xs text-slate-300">
              <div>Gear: <strong className="text-amber-400">Down / Retracting</strong></div>
              <div>Flaps: <strong className="text-white">Takeoff</strong></div>
              <div>Speed: <strong className="text-white">V2</strong></div>
              <div>Thrust: <strong className="text-white">Takeoff (OEI)</strong></div>
            </div>
            <div className="pt-2 border-t border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block font-bold">Min Requirement</span>
              <span className="text-xs font-mono font-bold text-emerald-400">Positive Net Gradient</span>
            </div>
          </div>

          {/* Segment 2 */}
          <div className={`p-5 rounded-2xl space-y-3 border ${
            isSeg2Compliant ? 'bg-slate-900/80 border-slate-800' : 'bg-red-500/10 border-red-500/30'
          }`}>
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-bold text-rose-400">2nd SEGMENT (CRITICAL)</span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">Gear Up to min 400'</span>
            </div>
            <div className="space-y-1 text-xs text-slate-300">
              <div>Gear: <strong className="text-emerald-400">Up & Locked</strong></div>
              <div>Flaps: <strong className="text-white">Takeoff</strong></div>
              <div>Speed: <strong className="text-white">V2</strong></div>
              <div>Thrust: <strong className="text-white">Takeoff (OEI)</strong></div>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between items-end">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Current Gradient</span>
                <span className="text-xs font-mono font-bold text-white">Gross: {seg2GrossGrad}% | Net: {seg2NetGrad}%</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-rose-400">Min 2.4% Gross</span>
            </div>
          </div>

          {/* Segment 3 */}
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-bold text-rose-400">3rd SEGMENT</span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">Flap Retraction</span>
            </div>
            <div className="space-y-1 text-xs text-slate-300">
              <div>Gear: <strong className="text-emerald-400">Up</strong></div>
              <div>Flaps: <strong className="text-amber-400">Retracting → Clean</strong></div>
              <div>Speed: <strong className="text-white">Accelerating to VFTO</strong></div>
              <div>Thrust: <strong className="text-white">Takeoff / MCT</strong></div>
            </div>
            <div className="pt-2 border-t border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block font-bold">Purpose</span>
              <span className="text-xs font-mono font-bold text-sky-400">Level Acceleration & Clean-up</span>
            </div>
          </div>

          {/* Segment 4 */}
          <div className={`p-5 rounded-2xl space-y-3 border ${
            isSeg4Compliant ? 'bg-slate-900/80 border-slate-800' : 'bg-red-500/10 border-red-500/30'
          }`}>
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-bold text-rose-400">4th SEGMENT (FINAL)</span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">400' to min 1,500'</span>
            </div>
            <div className="space-y-1 text-xs text-slate-300">
              <div>Gear: <strong className="text-emerald-400">Up</strong></div>
              <div>Flaps: <strong className="text-emerald-400">Clean (0)</strong></div>
              <div>Speed: <strong className="text-white">VFTO (Green Dot)</strong></div>
              <div>Thrust: <strong className="text-white">Max Continuous (MCT)</strong></div>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between items-end">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Current Gradient</span>
                <span className="text-xs font-mono font-bold text-white">Gross: {seg4GrossGrad}% | Net: {seg4NetGrad}%</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-rose-400">Min 1.2% Gross</span>
            </div>
          </div>

        </div>
      </div>

      {/* Student Mastery Assessment Challenge */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-rose-500/30 rounded-3xl p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-500/20 text-rose-400 rounded-xl">
            <HelpCircle size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Student Mastery Assessment Challenge</h3>
            <p className="text-xs text-slate-400">Class A Transport Jet Certification Check (EASA 032)</p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-slate-200 leading-relaxed font-semibold">
            Question: In CS-25 certification for a twin-engine turbojet aeroplane, what is the regulatory minimum gross climb gradient requirement in the second takeoff segment with one engine inoperative, and what margin is deducted to determine the net takeoff flight path?
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {[
              { id: 1, text: "A) Gross minimum 2.4%, Margin deducted 0.8% (Net minimum 1.6%)", correct: true },
              { id: 2, text: "B) Gross minimum 2.7%, Margin deducted 0.9% (Net minimum 1.8%)", correct: false },
              { id: 3, text: "C) Gross minimum 3.0%, Margin deducted 1.0% (Net minimum 2.0%)", correct: false },
              { id: 4, text: "D) Gross minimum 1.2%, Margin deducted 0.5% (Net minimum 0.7%)", correct: false }
            ].map(option => (
              <button
                key={option.id}
                onClick={() => {
                  setQuizAnswer(option.id);
                  setQuizSubmitted(true);
                }}
                className={`p-4 rounded-xl text-left border transition-all ${
                  quizAnswer === option.id
                    ? option.correct
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-bold'
                      : 'border-red-500 bg-red-500/10 text-red-300 font-bold'
                    : 'border-slate-800 bg-slate-900/50 text-slate-300 hover:border-slate-700'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>

          {quizSubmitted && (
            <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
              quizAnswer === 1
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-red-500/10 border-red-500/30 text-red-300'
            }`}>
              {quizAnswer === 1 ? (
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} />
                  <span><strong>Correct!</strong> Under CS-25.121(b), a twin-jet must achieve at least 2.4% gross climb gradient in the second segment, and CS-25.115 specifies an 0.8% reduction for the net flight path. (3-engines: 2.7% gross, 0.9% net; 4-engines: 3.0% gross, 1.0% net).</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <AlertTriangle size={18} />
                  <span><strong>Incorrect.</strong> Remember: For a 2-engine jet, 2nd segment gross minimum is 2.4% with an 0.8% margin (yielding 1.6% net). 2.7% is for tri-jets, and 3.0% is for quad-jets!</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default ClassAPerf;
