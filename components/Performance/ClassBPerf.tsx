import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Target, Shield, AlertTriangle, CheckCircle2, Sliders, Mountain,
  Wind, Thermometer, Gauge, ArrowRight, HelpCircle, RefreshCw
} from 'lucide-react';
import {
  AIRCRAFT_PRESETS,
  calculateAtmosphere,
  calculateTakeoffPerformance,
  calculateClimbPerformance,
  evaluateObstacleClearance,
  AtmosphericConditions
} from '../../lib/aviation/aircraftPerformance';

export const ClassBPerf: React.FC = () => {
  // Aircraft model: Default to Baron G58 (Light Twin CS-23)
  const [selectedAircraftId, setSelectedAircraftId] = useState<'baron_g58' | 'c172_sp'>('baron_g58');
  const aircraft = AIRCRAFT_PRESETS[selectedAircraftId];

  // Parameters
  const [weightLbs, setWeightLbs] = useState<number>(5500);
  const [elevationFt, setElevationFt] = useState<number>(5660); // Samedan
  const [qnhHpa, setQnhHpa] = useState<number>(1010);
  const [oatC, setOatC] = useState<number>(28);
  const [windKts, setWindKts] = useState<number>(-3); // 3 kt tailwind
  const [runwaySlopePct, setRunwaySlopePct] = useState<number>(0.5);
  const [surface, setSurface] = useState<AtmosphericConditions['surface']>('PAVED_DRY');

  // Declared runway distances (Samedan RWY 21: 1,800m = 5,905 ft)
  const runwayToraFt = 5905;

  // Student Mastery Quiz State
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Atmospheric conditions
  const conditions: AtmosphericConditions = useMemo(() => ({
    elevationFt,
    qnhHpa,
    oatC,
    windKts,
    runwaySlopePct,
    surface
  }), [elevationFt, qnhHpa, oatC, windKts, runwaySlopePct, surface]);

  // Calculations
  const atmo = useMemo(() => calculateAtmosphere(conditions), [conditions]);
  const takeoff = useMemo(() => calculateTakeoffPerformance(aircraft, weightLbs, conditions), [aircraft, weightLbs, conditions]);
  const climbAeo = useMemo(() => calculateClimbPerformance(aircraft, weightLbs, conditions, aircraft.speeds.vxIas, false), [aircraft, weightLbs, conditions]);
  const climbOei = useMemo(() => calculateClimbPerformance(aircraft, weightLbs, conditions, aircraft.speeds.vyIas, true), [aircraft, weightLbs, conditions]);

  // Obstacle at Samedan: 2.5 NM (15,190 ft) at 6,800 ft AMSL
  const obstacleClearance = useMemo(() => {
    return evaluateObstacleClearance(
      elevationFt,
      aircraft.screenHeightFt,
      climbAeo.groundGradientPct,
      { distanceFromDerFt: 2.5 * 6076.12, elevationFt: 6800 }
    );
  }, [elevationFt, aircraft.screenHeightFt, climbAeo.groundGradientPct]);

  // Margins
  const runwayMarginFt = runwayToraFt - takeoff.factoredRequiredDistanceFt;
  const isRunwaySafe = runwayMarginFt >= 0;
  const isClimbSafe = climbAeo.groundGradientPct >= 6.5; // Required valley gradient
  const isOeiSafe = (climbOei.gradientPct ?? 0) > 0.5;

  // Calculate mass shed needed to restore safe takeoff and climb
  const calculateSafeWeightLbs = () => {
    // Binary search or loop down
    let testWt = weightLbs;
    while (testWt > aircraft.emptyWeightLbs + 300) {
      const p = calculateTakeoffPerformance(aircraft, testWt, conditions);
      const c = calculateClimbPerformance(aircraft, testWt, conditions, aircraft.speeds.vxIas, false);
      if (runwayToraFt - p.factoredRequiredDistanceFt >= 500 && c.groundGradientPct >= 6.5) {
        return testWt;
      }
      testWt -= 50;
    }
    return testWt;
  };

  const safeWeightLbs = calculateSafeWeightLbs();
  const payloadToShedLbs = Math.max(0, weightLbs - safeWeightLbs);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-4">
          <div className="bg-amber-500/10 dark:bg-amber-500/20 p-4 rounded-2xl text-amber-500 border border-amber-500/30">
            <Target size={36} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                EASA CS-23 & CAT.POL.A.300+
              </span>
              <span className="text-xs text-slate-500 font-mono">Single & Multi-Engine Propeller Aeroplanes (≤ 5,700 kg, ≤ 9 Pax)</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              Class B Performance Specialist Module
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base mt-1">
              Safety Factors (1.25× TODR, 1.15× TORR), Grass/Slope Penalties, and High Alpine Hot & High Limitations
            </p>
          </div>
        </div>

        {/* Aircraft Selector */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => {
              setSelectedAircraftId('baron_g58');
              setWeightLbs(5500);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedAircraftId === 'baron_g58'
                ? 'bg-amber-500 text-slate-950 font-black shadow'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Beech Baron G58 (Light Twin)
          </button>
          <button
            onClick={() => {
              setSelectedAircraftId('c172_sp');
              setWeightLbs(2550);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedAircraftId === 'c172_sp'
                ? 'bg-amber-500 text-slate-950 font-black shadow'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Cessna 172S (Single Piston)
          </button>
        </div>
      </div>

      {/* Atmospheric Context Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
          <span className="text-xs text-slate-500 uppercase font-bold flex items-center gap-1">
            <Thermometer size={14} className="text-red-400" /> Density Altitude
          </span>
          <div className="text-2xl font-black font-mono text-red-500 mt-1">
            {Math.round(atmo.densityAltFt).toLocaleString()} ft
          </div>
          <span className="text-[10px] text-slate-400">
            Elevation: {elevationFt}' | ΔISA: +{atmo.deltaIsaC.toFixed(1)}°C
          </span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
          <span className="text-xs text-slate-500 uppercase font-bold">Density Ratio (σ)</span>
          <div className="text-2xl font-black font-mono text-sky-400 mt-1">
            {atmo.densityRatioSigma.toFixed(3)}
          </div>
          <span className="text-[10px] text-slate-400">
            Air density ρ: {atmo.densityRhoKgM3.toFixed(3)} kg/m³ (-23%)
          </span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
          <span className="text-xs text-slate-500 uppercase font-bold">Unfactored vs Factored TOD</span>
          <div className="text-2xl font-black font-mono text-white mt-1">
            {takeoff.distanceToScreenFt}' → <span className="text-purple-400">{takeoff.factoredRequiredDistanceFt}'</span>
          </div>
          <span className="text-[10px] text-purple-400 font-bold">
            Mandatory CS-23 Factor: 1.25×
          </span>
        </div>

        <div className={`p-4 rounded-2xl border ${
          isRunwaySafe && isClimbSafe
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : 'bg-red-500/15 border-red-500/40 text-red-400 animate-pulse'
        }`}>
          <span className="text-xs uppercase font-bold">Overall Flight Authorization</span>
          <div className="text-2xl font-black font-mono mt-1">
            {isRunwaySafe && isClimbSafe ? 'GO (AUTHORIZED)' : 'NO-GO (LETHAL)'}
          </div>
          <span className="text-[10px] font-bold">
            {!isRunwaySafe ? 'Runway Exceeded' : !isClimbSafe ? 'Terrain Impact Predicted' : 'Clearances Met'}
          </span>
        </div>
      </div>

      {/* Main Analysis Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Interactive Controls & Scenario Sandbox */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center justify-between">
            <span>Samedan (LSZS) Departure Flight Dispatch</span>
            <span className="text-xs font-mono font-normal text-slate-400">Runway 21 (5,905 ft)</span>
          </h3>

          {/* Sliders Grid */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1 text-slate-600 dark:text-slate-300">
                <span>Takeoff Gross Weight</span>
                <span className="font-mono text-amber-500">{weightLbs.toLocaleString()} lbs</span>
              </div>
              <input
                type="range"
                min={aircraft.emptyWeightLbs}
                max={aircraft.maxTakeoffWeightLbs}
                step={50}
                value={weightLbs}
                onChange={(e) => setWeightLbs(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1 text-slate-600 dark:text-slate-300">
                <span>Outside Air Temperature (OAT)</span>
                <span className="font-mono text-red-400">{oatC}°C (ISA Standard at 5,660' is +3.8°C)</span>
              </div>
              <input
                type="range"
                min={0}
                max={38}
                step={1}
                value={oatC}
                onChange={(e) => setOatC(Number(e.target.value))}
                className="w-full accent-red-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1 text-slate-600 dark:text-slate-300">
                <span>Wind Component</span>
                <span className="font-mono text-sky-400">
                  {windKts >= 0 ? `+${windKts} kt Headwind` : `${Math.abs(windKts)} kt Tailwind`}
                </span>
              </div>
              <input
                type="range"
                min={-10}
                max={25}
                step={1}
                value={windKts}
                onChange={(e) => setWindKts(Number(e.target.value))}
                className="w-full accent-sky-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-500 block mb-2">Runway Surface Correction</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {[
                  { id: 'PAVED_DRY', label: 'Dry Paved (1.00×)' },
                  { id: 'PAVED_WET', label: 'Wet Paved (1.15×)' },
                  { id: 'GRASS_DRY_SHORT', label: 'Dry Grass (1.20×)' },
                  { id: 'GRASS_WET_SHORT', label: 'Wet Grass (1.30×)' }
                ].map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSurface(s.id as any)}
                    className={`p-2 rounded-xl border text-center font-bold transition-all ${
                      surface === s.id
                        ? 'border-amber-500 bg-amber-500/10 text-amber-500'
                        : 'border-slate-200 dark:border-slate-800 text-slate-500'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mass Shedding Remediation Box */}
          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl space-y-3">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
              <span>Performance Remediation Solver</span>
              {payloadToShedLbs > 0 ? (
                <span className="text-xs font-mono font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/30">
                  Offload Required: {payloadToShedLbs} lbs
                </span>
              ) : (
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  Weight Margin Acceptable
                </span>
              )}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {payloadToShedLbs > 0 ? (
                <>
                  To satisfy the 5,905 ft runway length with the mandatory 1.25× CS-23 safety factor AND clear the 6.5% valley terrain gradient, maximum allowable takeoff weight is <strong>{safeWeightLbs.toLocaleString()} lbs</strong>.
                  You must offload <strong>{payloadToShedLbs} lbs</strong> of payload/fuel or delay flight until temperature cools to <strong>+12°C</strong>.
                </>
              ) : (
                <>Current payload configuration complies with EASA Class B takeoff and obstacle clearance rules.</>
              )}
            </p>
            {payloadToShedLbs > 0 && (
              <button
                onClick={() => setWeightLbs(safeWeightLbs)}
                className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow"
              >
                Apply Safe Weight ({safeWeightLbs.toLocaleString()} lbs)
              </button>
            )}
          </div>
        </div>

        {/* Right: Regulatory Audit & Multi-Engine Catastrophe Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Detailed Regulatory Factoring Breakdown */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="text-purple-400" size={18} />
              CS-23 Regulatory Factoring Audit
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Unfactored Ground Roll (TOR):</span>
                <span className="font-mono font-bold">{takeoff.groundRollFt} ft</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Unfactored Distance to 50ft (TOD):</span>
                <span className="font-mono font-bold">{takeoff.distanceToScreenFt} ft</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Class B Takeoff Safety Factor:</span>
                <span className="font-mono font-bold text-purple-400">× 1.25 (EASA Standard)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Factored Takeoff Distance Required (TODR):</span>
                <span className={`font-mono font-black ${isRunwaySafe ? 'text-emerald-500' : 'text-red-500'}`}>
                  {takeoff.factoredRequiredDistanceFt} ft
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Runway Available (TORA):</span>
                <span className="font-mono font-bold text-white">{runwayToraFt} ft</span>
              </div>
            </div>
          </div>

          {/* Multi-Engine OEI Disaster Reality */}
          {aircraft.enginesCount > 1 && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-3xl p-6 space-y-3">
              <h4 className="font-bold text-sm text-red-400 flex items-center gap-2">
                <AlertTriangle size={16} />
                The Piston Twin Engine-Failure Reality
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Many pilots assume losing 1 engine out of 2 reduces performance by 50%.
                <strong> This is a fatal misconception.</strong>
                While available power is cut by 50%, all of that remaining power is required just to overcome level-flight drag.
                Excess power drops by <strong>80% to 100%</strong>!
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="bg-slate-900/60 p-3 rounded-xl border border-white/10">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Both Engines Climb</span>
                  <div className="text-lg font-bold font-mono text-emerald-400 mt-1">
                    {climbAeo.gradientPct.toFixed(1)}% ({climbAeo.rocFpm} fpm)
                  </div>
                </div>
                <div className="bg-slate-900/60 p-3 rounded-xl border border-white/10">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">OEI Engine Out</span>
                  <div className={`text-lg font-bold font-mono mt-1 ${
                    (climbOei.gradientPct ?? 0) <= 0 ? 'text-red-400' : 'text-amber-400'
                  }`}>
                    {(climbOei.gradientPct ?? 0).toFixed(1)}% ({(climbOei.rocFpm ?? 0)} fpm)
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Student Mastery Assessment Challenge */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-purple-500/30 rounded-3xl p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl">
            <HelpCircle size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Student Mastery Assessment Challenge</h3>
            <p className="text-xs text-slate-400">Class B Flight Planning Certification Check (EASA 032)</p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-slate-200 leading-relaxed font-semibold">
            Question: You are planning a maximum takeoff mass departure in a Class B twin-piston aircraft from an aerodrome at 5,600 ft elevation with ambient temperature +28°C and dry short grass runway (length 2,000 m).
            The unfactored distance from the flight manual to clear 50 ft is 4,200 ft.
            What is the minimum regulatory Takeoff Distance Required (TODR) to be compared against TODA?
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {[
              { id: 1, text: "A) 4,200 ft (Flight manual unfactored figure is sufficient)", correct: false },
              { id: 2, text: "B) 5,250 ft (4,200 ft × 1.25 Class B safety factor)", correct: false },
              { id: 3, text: "C) 6,300 ft (4,200 ft × 1.25 factor × 1.20 grass factor)", correct: true },
              { id: 4, text: "D) 4,830 ft (4,200 ft × 1.15 TORR factor)", correct: false }
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
              quizAnswer === 3
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-red-500/10 border-red-500/30 text-red-300'
            }`}>
              {quizAnswer === 3 ? (
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} />
                  <span><strong>Correct!</strong> Under EASA CS-23 and CAT.POL.A.305, the distance must first be factored by 1.25 for Class B, and then corrected by 1.20 for dry grass: 4,200 × 1.25 × 1.20 = <strong>6,300 ft</strong>.</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <AlertTriangle size={18} />
                  <span><strong>Incorrect.</strong> Remember that grass runway corrections (×1.20) are multiplicative with the base 1.25 Class B safety factor: 4,200 × 1.25 × 1.20 = 6,300 ft.</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default ClassBPerf;
