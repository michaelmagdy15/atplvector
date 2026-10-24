import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlaneTakeoff, ShieldAlert, ArrowRight, XCircle, AlertTriangle,
  CheckCircle2, Wind, Thermometer, Gauge, Mountain, RotateCcw,
  Sparkles, Info, Sliders, ChevronDown, Scale, Compass, Award, AlertOctagon
} from 'lucide-react';
import {
  AIRCRAFT_PRESETS,
  calculateAtmosphere,
  calculateTakeoffPerformance,
  calculateDeclaredDistances,
  calculateBalancedField,
  validateVSpeedHierarchy,
  AtmosphericConditions,
  AircraftPreset
} from '../../lib/aviation/aircraftPerformance';
import { View } from '../../types';
import FoundationReadinessPill from '../foundations/FoundationReadinessPill';

interface TakeoffPerfProps {
  onChangeView?: (view: View) => void;
}

export const TakeoffPerf: React.FC<TakeoffPerfProps> = ({ onChangeView }) => {
  // Aircraft Selection
  const [selectedAircraftId, setSelectedAircraftId] = useState<string>('baron_g58');
  const aircraft: AircraftPreset = AIRCRAFT_PRESETS[selectedAircraftId] || AIRCRAFT_PRESETS.BARON_G58;

  // Weight
  const [weightLbs, setWeightLbs] = useState<number>(aircraft.maxTakeoffWeightLbs);

  // Atmospheric & Aerodrome State
  const [elevationFt, setElevationFt] = useState<number>(0);
  const [qnhHpa, setQnhHpa] = useState<number>(1013);
  const [oatC, setOatC] = useState<number>(15);
  const [windKts, setWindKts] = useState<number>(0); // positive headwind, negative tailwind
  const [runwaySlopePct, setRunwaySlopePct] = useState<number>(0);
  const [surface, setSurface] = useState<AtmosphericConditions['surface']>('PAVED_DRY');

  // Runway Declared Distances Inputs
  const [runwayLengthToraFt, setRunwayLengthToraFt] = useState<number>(4500);
  const [clearwayFt, setClearwayFt] = useState<number>(500);
  const [stopwayFt, setStopwayFt] = useState<number>(300);
  const [displacedThresholdFt, setDisplacedThresholdFt] = useState<number>(0);

  // Failure Simulation
  const [simulateRtoAtV1, setSimulateRtoAtV1] = useState<boolean>(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'simulator' | 'balancedField' | 'samedanScenario' | 'physics'>('simulator');

  // Balanced Field interactive V1 slider ratio (V1 / VR)
  const [selectedV1Ratio, setSelectedV1Ratio] = useState<number>(0.90);

  // Update weight when aircraft changes
  const handleAircraftChange = (id: string) => {
    setSelectedAircraftId(id);
    const newAc = AIRCRAFT_PRESETS[id];
    if (newAc) {
      setWeightLbs(newAc.maxTakeoffWeightLbs);
    }
  };

  // Conditions object
  const conditions: AtmosphericConditions = useMemo(() => ({
    elevationFt,
    qnhHpa,
    oatC,
    windKts,
    runwaySlopePct,
    surface
  }), [elevationFt, qnhHpa, oatC, windKts, runwaySlopePct, surface]);

  // Physics Calculations
  const atmosphere = useMemo(() => calculateAtmosphere(conditions), [conditions]);
  const perf = useMemo(() => calculateTakeoffPerformance(aircraft, weightLbs, conditions), [aircraft, weightLbs, conditions]);

  // Derived Declared Distances (Capped clearway max 50% TORA per ICAO Annex 14 / CS-25)
  const declared = useMemo(() => {
    return calculateDeclaredDistances(runwayLengthToraFt, clearwayFt, stopwayFt, displacedThresholdFt);
  }, [runwayLengthToraFt, clearwayFt, stopwayFt, displacedThresholdFt]);

  const todaFt = declared.todaFt;
  const asdaFt = declared.asdaFt;
  const ldaFt = declared.ldaFt;

  // Safety margins
  const takeoffMarginFt = todaFt - perf.factoredRequiredDistanceFt;
  const isTakeoffSafe = takeoffMarginFt >= 0;
  const stopMarginFt = asdaFt - perf.accelerateStopDistanceFt;
  const isStopSafe = stopMarginFt >= 0;

  // Balanced Field Calculations
  const balancedField = useMemo(() => {
    const surfaceFriction = surface === 'PAVED_WET' ? 1.25 : 1.0;
    return calculateBalancedField(perf.vrIasKts, perf.factoredRequiredDistanceFt, surfaceFriction);
  }, [perf.vrIasKts, perf.factoredRequiredDistanceFt, surface]);

  const currentV1Ias = Math.round(perf.vrIasKts * selectedV1Ratio);
  const currentTodr = Math.round(perf.factoredRequiredDistanceFt * (0.88 + 1.65 * Math.pow(1 - selectedV1Ratio, 1.25)));
  const currentAsdr = Math.round(perf.factoredRequiredDistanceFt * Math.pow(selectedV1Ratio / 0.90, 2.1) * (surface === 'PAVED_WET' ? 1.25 : 1.0));
  const isFieldBalanced = Math.abs(currentTodr - currentAsdr) < 120;
  const isTodrLimited = currentTodr > currentAsdr;

  // V-Speed Hierarchy Check (CS-25.107)
  const vmcgEstimate = Math.round(perf.vrIasKts * 0.82);
  const vmcaEstimate = Math.round(perf.vrIasKts * 0.88);
  const vmbeEstimate = Math.round(perf.vrIasKts * 1.15);
  const v2Speed = aircraft.speeds.v2Ias || Math.round(perf.vrIasKts * 1.06);
  const vsrClean = aircraft.speeds.vs1Ias || Math.round(perf.vrIasKts * 0.84);

  const vSpeedCheck = useMemo(() => {
    return validateVSpeedHierarchy({
      vmcg: vmcgEstimate,
      v1: currentV1Ias,
      vr: Math.round(perf.vrIasKts),
      vmbe: vmbeEstimate,
      vmca: vmcaEstimate,
      v2: v2Speed,
      vsr: vsrClean
    });
  }, [vmcgEstimate, currentV1Ias, perf.vrIasKts, vmbeEstimate, vmcaEstimate, v2Speed, vsrClean]);

  // Preset scenarios
  const applyScenario = (preset: 'SEALEVEL_ISA' | 'SAMEDAN_SUMMER' | 'DENVER_HOT') => {
    if (preset === 'SEALEVEL_ISA') {
      setElevationFt(0);
      setQnhHpa(1013);
      setOatC(15);
      setWindKts(0);
      setRunwaySlopePct(0);
      setSurface('PAVED_DRY');
      setRunwayLengthToraFt(4500);
      setClearwayFt(500);
      setStopwayFt(300);
      setDisplacedThresholdFt(0);
    } else if (preset === 'SAMEDAN_SUMMER') {
      // Samedan LSZS: Elev 5660 ft, 28 deg C, QNH 1010
      setElevationFt(5660);
      setQnhHpa(1010);
      setOatC(28);
      setWindKts(-3); // slight tailwind down valley
      setRunwaySlopePct(0.5); // 0.5% upslope RWY 21
      setSurface('PAVED_DRY');
      setRunwayLengthToraFt(5905); // 1,800 m
      setClearwayFt(0);
      setStopwayFt(0);
      setDisplacedThresholdFt(0);
      setSelectedAircraftId('baron_g58');
      setWeightLbs(5500);
    } else if (preset === 'DENVER_HOT') {
      // Denver KDEN: Elev 5434 ft, 35 deg C, QNH 1008
      setElevationFt(5434);
      setQnhHpa(1008);
      setOatC(35);
      setWindKts(5);
      setRunwaySlopePct(0);
      setSurface('PAVED_DRY');
      setRunwayLengthToraFt(12000);
      setClearwayFt(1000);
      setStopwayFt(500);
      setDisplacedThresholdFt(0);
    }
  };

  // Runway Visualizer calculations (clamped percentage for rendering)
  const maxDisplayDistanceFt = Math.max(todaFt, asdaFt, perf.factoredRequiredDistanceFt, perf.accelerateStopDistanceFt) * 1.15;
  const toraWidthPct = (runwayLengthToraFt / maxDisplayDistanceFt) * 100;
  const stopwayWidthPct = (stopwayFt / maxDisplayDistanceFt) * 100;
  const clearwayWidthPct = (declared.effectiveClearwayFt / maxDisplayDistanceFt) * 100;
  const groundRollPct = (perf.groundRollFt / maxDisplayDistanceFt) * 100;
  const screenDistPct = (perf.distanceToScreenFt / maxDisplayDistanceFt) * 100;
  const factoredDistPct = (perf.factoredRequiredDistanceFt / maxDisplayDistanceFt) * 100;
  const asdrDistPct = (perf.accelerateStopDistanceFt / maxDisplayDistanceFt) * 100;
  const displacedThresholdPct = (displacedThresholdFt / maxDisplayDistanceFt) * 100;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-500/10 dark:bg-emerald-500/20 p-4 rounded-2xl text-emerald-500 border border-emerald-500/30">
            <PlaneTakeoff size={36} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                EASA ATPL 032
              </span>
              <span className="text-xs text-slate-500 font-mono">CS-23 & CS-25 Certified Aerodynamics</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              Take-off Performance Engine
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base mt-1">
              Atmospheric Density Altitude, Declared Distances (TORA/TODA/ASDA/LDA), and Balanced Field Length
            </p>
          </div>
        </div>

        {/* Quick Scenario Buttons & Prerequisite Pill */}
        <div className="flex flex-wrap items-center gap-2">
          <FoundationReadinessPill 
            conceptId="FND_AIR_DENSITY_EFFECT"
            targetLO="032.01"
            onNavigateToFullChain={onChangeView}
          />
          <div className="h-6 w-px bg-slate-300 dark:bg-slate-700 hidden sm:block mx-1" />
          <button
            onClick={() => applyScenario('SEALEVEL_ISA')}
            className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-emerald-500 dark:hover:border-emerald-400 transition-colors"
          >
            Sea Level ISA
          </button>
          <button
            onClick={() => applyScenario('SAMEDAN_SUMMER')}
            className="px-3 py-1.5 text-xs font-bold rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 transition-colors flex items-center gap-1.5"
          >
            <Mountain size={14} /> Samedan (5,660' +28°C)
          </button>
          <button
            onClick={() => applyScenario('DENVER_HOT')}
            className="px-3 py-1.5 text-xs font-bold rounded-lg border border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300 hover:bg-rose-500/20 transition-colors"
          >
            Denver Mile-High Hot
          </button>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
            activeTab === 'simulator'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sliders size={16} /> Interactive Runway Simulator
        </button>
        <button
          onClick={() => setActiveTab('balancedField')}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
            activeTab === 'balancedField'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Scale size={16} /> Balanced Field Length (TODR = ASDR)
        </button>
        <button
          onClick={() => setActiveTab('samedanScenario')}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
            activeTab === 'samedanScenario'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Mountain size={16} /> Samedan Alpine Summer Case Study
        </button>
        <button
          onClick={() => setActiveTab('physics')}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
            activeTab === 'physics'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Info size={16} /> Physics & Mathematics Derivation
        </button>
      </div>

      {activeTab === 'simulator' && (
        <div className="space-y-8">
          
          {/* Key Atmospheric & Performance Metrics Ribbon */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
              <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
                <Gauge size={12} /> Pressure Alt (PA)
              </span>
              <div className="text-xl font-black font-mono text-slate-900 dark:text-white mt-1">
                {Math.round(atmosphere.pressureAltFt).toLocaleString()} ft
              </div>
              <span className="text-[10px] text-slate-400">ISA Standard: {Math.round(atmosphere.isaTempC)}°C</span>
            </div>

            <div className={`p-4 rounded-2xl border ${
              atmosphere.densityAltFt > 7000
                ? 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400'
                : atmosphere.densityAltFt > 4000
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400'
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'
            }`}>
              <span className="text-[10px] font-bold uppercase flex items-center gap-1">
                <Thermometer size={12} /> Density Alt (DA)
              </span>
              <div className="text-xl font-black font-mono mt-1">
                {Math.round(atmosphere.densityAltFt).toLocaleString()} ft
              </div>
              <span className="text-[10px] font-bold">
                ΔISA: {atmosphere.deltaIsaC >= 0 ? `+${atmosphere.deltaIsaC.toFixed(1)}` : atmosphere.deltaIsaC.toFixed(1)}°C
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
              <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
                Density Ratio (σ)
              </span>
              <div className="text-xl font-black font-mono text-sky-600 dark:text-sky-400 mt-1">
                {atmosphere.densityRatioSigma.toFixed(3)}
              </div>
              <span className="text-[10px] text-slate-400">ρ: {atmosphere.densityRhoKgM3.toFixed(3)} kg/m³</span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
              <span className="text-[10px] font-bold uppercase text-slate-500">
                Rotation Speed (Vr)
              </span>
              <div className="text-xl font-black font-mono text-slate-900 dark:text-white mt-1">
                {perf.vrIasKts} <span className="text-xs font-normal text-slate-400">IAS</span>
              </div>
              <span className="text-[11px] font-bold text-indigo-500 font-mono">
                TAS: {perf.vrTasKts} kts (+{Math.round((perf.vrTasKts / perf.vrIasKts - 1) * 100)}%)
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
              <span className="text-[10px] font-bold uppercase text-slate-500">
                Available Power/Thrust
              </span>
              <div className={`text-xl font-black font-mono mt-1 ${
                perf.powerAvailableFraction < 0.75 ? 'text-red-500' : 'text-emerald-500'
              }`}>
                {Math.round(perf.powerAvailableFraction * 100)}%
              </div>
              <span className="text-[10px] text-slate-400">
                {aircraft.engineType === 'PISTON_NA' ? 'Loss: ~3.3%/1k ft DA' : 'Mass Flow Reduced'}
              </span>
            </div>

            <div className={`p-4 rounded-2xl border ${
              isTakeoffSafe ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/15 border-red-500/40 animate-pulse'
            }`}>
              <span className="text-[10px] font-bold uppercase text-slate-500">
                Takeoff Clearance
              </span>
              <div className={`text-xl font-black font-mono mt-1 ${
                isTakeoffSafe ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {isTakeoffSafe ? 'GO (SAFE)' : 'NO-GO (OVERRUN)'}
              </div>
              <span className="text-[10px] font-mono">
                Margin: {takeoffMarginFt > 0 ? `+${takeoffMarginFt}` : takeoffMarginFt} ft
              </span>
            </div>
          </div>

          {/* Main Visualizer Stage */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm relative overflow-hidden">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Dynamic Runway & Declared Distances Visualizer</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-slate-500">
                    Scale: 0 to {Math.round(maxDisplayDistanceFt)} ft
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Visualizes TORA, TODA (with clearway max 50% limit), ASDA (stopway), LDA (displaced threshold), ground roll, and screen height.
                </p>
              </div>

              {/* RTO Simulator Toggle */}
              <button
                onClick={() => setSimulateRtoAtV1(!simulateRtoAtV1)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm ${
                  simulateRtoAtV1
                    ? 'bg-red-600 text-white shadow-red-600/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {simulateRtoAtV1 ? <XCircle size={16} /> : <ShieldAlert size={16} />}
                {simulateRtoAtV1 ? 'Simulating Rejected Takeoff (RTO)' : 'Test RTO at V1'}
              </button>
            </div>

            {/* Clearway Capped Warning Alert */}
            {declared.isClearwayCapped && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs mb-4">
                <AlertTriangle size={18} className="shrink-0" />
                <span>
                  <strong>Clearway Limitation Rule (CS-25 / ICAO Annex 14):</strong> The input clearway ({clearwayFt} ft) exceeds 50% of TORA ({declared.maxAllowableClearwayFt} ft). Only the first {declared.effectiveClearwayFt} ft is legally credited for TODA calculation!
                </span>
              </div>
            )}

            {/* Visual Runway Field Canvas */}
            <div className="relative w-full h-80 bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col justify-end overflow-hidden">
              
              {/* Sky Background Elements */}
              <div className="absolute top-4 left-6 flex items-center gap-4 text-xs font-mono text-slate-500">
                <div>Aircraft: <strong className="text-white">{aircraft.name.split('(')[0]}</strong></div>
                <div>Weight: <strong className="text-white">{weightLbs.toLocaleString()} lbs</strong></div>
                <div>Wind: <strong className="text-white">{windKts >= 0 ? `${windKts} kt Head` : `${Math.abs(windKts)} kt Tail`}</strong></div>
              </div>

              {/* Overrun Danger Zone Warning Banner if unsafe */}
              {!isTakeoffSafe && !simulateRtoAtV1 && (
                <div className="absolute top-12 right-6 z-30 bg-red-600/90 text-white px-4 py-2 rounded-xl border border-red-400 text-xs font-bold shadow-lg flex items-center gap-2">
                  <AlertTriangle size={18} />
                  <span>CRITICAL: Factored Takeoff Distance exceeds TODA by {Math.abs(takeoffMarginFt)} ft!</span>
                </div>
              )}

              {simulateRtoAtV1 && !isStopSafe && (
                <div className="absolute top-12 right-6 z-30 bg-red-600/90 text-white px-4 py-2 rounded-xl border border-red-400 text-xs font-bold shadow-lg flex items-center gap-2">
                  <AlertTriangle size={18} />
                  <span>OVERRUN: Accelerate-Stop Distance exceeds ASDA by {Math.abs(stopMarginFt)} ft!</span>
                </div>
              )}

              {/* Ground Track & Runway Physical Surfaces */}
              <div className="relative w-full h-14 flex items-center mb-16">
                
                {/* TORA Physical Pavement */}
                <div
                  className="h-full bg-slate-800 border-y-2 border-slate-700 relative flex items-center shadow-inner"
                  style={{ width: `${toraWidthPct}%` }}
                >
                  {/* Centerline */}
                  <div className="w-full h-1 border-t-2 border-dashed border-white/40 absolute top-1/2 -translate-y-1/2" />
                  
                  {/* Displaced Threshold Shading (if present) */}
                  {displacedThresholdFt > 0 && (
                    <div
                      className="absolute left-0 top-0 bottom-0 bg-amber-500/20 border-r-2 border-amber-400 flex items-center justify-center"
                      style={{ width: `${(displacedThresholdFt / runwayLengthToraFt) * 100}%` }}
                    >
                      <span className="text-[9px] font-mono font-bold text-amber-300">DISPLACED ({displacedThresholdFt}')</span>
                    </div>
                  )}

                  {/* Threshold Markings */}
                  <div className="absolute left-1 top-1 bottom-1 w-2 border-r-2 border-white/60" />
                  <div className="absolute right-1 top-1 bottom-1 w-2 border-l-2 border-white/60" />
                  
                  <div className="absolute -top-5 left-1 text-[10px] font-mono font-bold text-slate-400">
                    BRAKE RELEASE (0 ft)
                  </div>
                  <div className="absolute -top-5 right-1 text-[10px] font-mono font-bold text-slate-400">
                    TORA ({runwayLengthToraFt} ft)
                  </div>
                </div>

                {/* Stopway (if present) */}
                {stopwayFt > 0 && (
                  <div
                    className="h-full bg-rose-950/40 border-y-2 border-dashed border-rose-500/50 relative flex items-center justify-center"
                    style={{ width: `${stopwayWidthPct}%` }}
                  >
                    <span className="text-[10px] font-mono font-bold text-rose-400/80">STOPWAY (+{stopwayFt}')</span>
                  </div>
                )}

                {/* Effective Clearway (if present) */}
                {declared.effectiveClearwayFt > 0 && (
                  <div
                    className="h-full bg-emerald-950/30 border-y-2 border-dashed border-emerald-500/50 relative flex items-center justify-center"
                    style={{ width: `${clearwayWidthPct}%` }}
                  >
                    <span className="text-[10px] font-mono font-bold text-emerald-400/80">CLEARWAY (+{declared.effectiveClearwayFt}')</span>
                  </div>
                )}
              </div>

              {/* Declared Distances Legend Bars */}
              <div className="relative w-full space-y-1 mb-2 text-[10px] font-mono">
                {/* TORA Bar */}
                <div className="relative h-4 bg-slate-800/80 border-l border-r border-slate-500 flex items-center justify-center text-slate-300" style={{ width: `${toraWidthPct}%` }}>
                  TORA: {runwayLengthToraFt} ft
                </div>

                {/* TODA Bar */}
                <div className="relative h-4 bg-emerald-950/60 border-l border-r border-emerald-500 flex items-center justify-center text-emerald-300" style={{ width: `${(todaFt / maxDisplayDistanceFt) * 100}%` }}>
                  TODA: {todaFt} ft {declared.isClearwayCapped ? '(Clearway max 50% TORA)' : ''}
                </div>

                {/* ASDA Bar */}
                <div className="relative h-4 bg-rose-950/60 border-l border-r border-rose-500 flex items-center justify-center text-rose-300" style={{ width: `${(asdaFt / maxDisplayDistanceFt) * 100}%` }}>
                  ASDA: {asdaFt} ft (TORA + Stopway)
                </div>

                {/* LDA Bar */}
                <div className="relative h-4 bg-amber-950/60 border-l border-r border-amber-500 flex items-center justify-center text-amber-300" style={{ width: `${(ldaFt / maxDisplayDistanceFt) * 100}%` }}>
                  LDA: {ldaFt} ft {displacedThresholdFt > 0 ? `(Displaced: -${displacedThresholdFt}')` : ''}
                </div>
              </div>

              {/* Aircraft Dynamic Trajectory Animation */}
              <motion.div
                className="absolute z-20 flex flex-col items-center pointer-events-none"
                initial={{ left: '0%', bottom: '5.5rem' }}
                animate={{
                  left: simulateRtoAtV1
                    ? ['0%', `${Math.min(100, asdrDistPct * 0.55)}%`, `${Math.min(100, asdrDistPct)}%`]
                    : ['0%', `${Math.min(100, groundRollPct)}%`, `${Math.min(100, screenDistPct)}%`, '105%'],
                  bottom: simulateRtoAtV1
                    ? ['5.5rem', '5.5rem', '5.5rem']
                    : ['5.5rem', '5.5rem', '8.5rem', '14rem'],
                  rotate: simulateRtoAtV1
                    ? [0, 0, 0]
                    : [0, 0, 10, 12]
                }}
                transition={{
                  duration: simulateRtoAtV1 ? 5 : 6,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 2
                }}
                key={`${selectedAircraftId}-${elevationFt}-${oatC}-${weightLbs}-${simulateRtoAtV1}`}
              >
                <div className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]" style={{ transform: 'scaleX(-1)' }}>
                  <PlaneTakeoff size={36} className={simulateRtoAtV1 ? 'text-rose-400' : 'text-emerald-400'} />
                </div>
              </motion.div>

              {/* Physical Markers: Liftoff, Screen Height, Factored Distance */}
              {!simulateRtoAtV1 && (
                <>
                  {/* Ground Roll / Vr Marker */}
                  <div
                    className="absolute bottom-20 border-l-2 border-amber-400 h-16 z-10 flex flex-col items-center"
                    style={{ left: `${Math.min(98, groundRollPct)}%` }}
                  >
                    <div className="bg-amber-500 text-slate-950 font-mono text-[9px] font-bold px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                      Liftoff: {perf.groundRollFt} ft (GS {perf.liftoffGroundSpeedKts} kt)
                    </div>
                  </div>

                  {/* Distance to Screen Height (50ft / 35ft) */}
                  <div
                    className="absolute bottom-24 border-l-2 border-emerald-400 h-20 z-10 flex flex-col items-center"
                    style={{ left: `${Math.min(98, screenDistPct)}%` }}
                  >
                    <div className="bg-emerald-500 text-slate-950 font-mono text-[9px] font-bold px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                      Screen ({aircraft.screenHeightFt}'): {perf.distanceToScreenFt} ft
                    </div>
                  </div>

                  {/* Factored Takeoff Distance Required (TODR) */}
                  <div
                    className="absolute bottom-28 border-l-2 border-purple-400 border-dashed h-24 z-10 flex flex-col items-center"
                    style={{ left: `${Math.min(98, factoredDistPct)}%` }}
                  >
                    <div className="bg-purple-600 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                      Factored TODR ({perf.regulatoryFactor}×): {perf.factoredRequiredDistanceFt} ft
                    </div>
                  </div>
                </>
              )}

              {/* RTO Stop Marker */}
              {simulateRtoAtV1 && (
                <div
                  className="absolute bottom-20 border-l-2 border-rose-500 h-16 z-10 flex flex-col items-center"
                  style={{ left: `${Math.min(98, asdrDistPct)}%` }}
                >
                  <div className="bg-rose-600 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                    Full Stop: {perf.accelerateStopDistanceFt} ft
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Controls Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Column 1: Aircraft & Weight Configuration */}
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-5">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PlaneTakeoff className="text-emerald-500" size={18} />
                Aircraft Selection & Weight
              </h3>

              <div>
                <label className="text-xs font-bold uppercase text-slate-500 block mb-2">Aircraft Model</label>
                <div className="grid grid-cols-1 gap-2">
                  {Object.values(AIRCRAFT_PRESETS).map(ac => (
                    <button
                      key={ac.id}
                      onClick={() => handleAircraftChange(ac.id)}
                      className={`px-3 py-2 rounded-xl text-left text-xs font-bold transition-all border ${
                        selectedAircraftId === ac.id
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{ac.name.split('(')[0]}</span>
                        <span className="text-[10px] font-mono opacity-60">{ac.category}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 font-normal">
                        MTOW: {ac.maxTakeoffWeightLbs.toLocaleString()} lbs | Screen: {ac.screenHeightFt} ft
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-500">Takeoff Weight (TOW)</span>
                  <span className="font-mono">{weightLbs.toLocaleString()} lbs ({Math.round(weightLbs / 2.20462).toLocaleString()} kg)</span>
                </div>
                <input
                  type="range"
                  min={aircraft.emptyWeightLbs}
                  max={aircraft.maxTakeoffWeightLbs}
                  step={50}
                  value={weightLbs}
                  onChange={(e) => setWeightLbs(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Empty ({aircraft.emptyWeightLbs} lbs)</span>
                  <span>MTOW ({aircraft.maxTakeoffWeightLbs} lbs)</span>
                </div>
              </div>
            </div>

            {/* Column 2: Atmospheric & Environmental Conditions */}
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-5">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Thermometer className="text-amber-500" size={18} />
                Atmospheric State
              </h3>

              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-500">Aerodrome Elevation</span>
                  <span className="font-mono">{elevationFt.toLocaleString()} ft AMSL</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10000}
                  step={100}
                  value={elevationFt}
                  onChange={(e) => setElevationFt(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Sea Level (0')</span>
                  <span>Samedan (5,660')</span>
                  <span>Leadville (9,934')</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-500">Outside Air Temp (OAT)</span>
                  <span className="font-mono">{oatC}°C</span>
                </div>
                <input
                  type="range"
                  min={-20}
                  max={45}
                  step={1}
                  value={oatC}
                  onChange={(e) => setOatC(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>-20°C (Freezing)</span>
                  <span>+15°C (ISA SL)</span>
                  <span>+45°C (Extreme)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-500">QNH Pressure</span>
                  <span className="font-mono">{qnhHpa} hPa</span>
                </div>
                <input
                  type="range"
                  min={960}
                  max={1045}
                  step={1}
                  value={qnhHpa}
                  onChange={(e) => setQnhHpa(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>960 hPa (Deep Low)</span>
                  <span>1013.25 (Std)</span>
                  <span>1040 hPa (High)</span>
                </div>
              </div>
            </div>

            {/* Column 3: Runway & Surface Factors */}
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Wind className="text-sky-500" size={18} />
                Runway & Declared Distances (ICAO / CS-25)
              </h3>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-500">Runway Length (TORA)</span>
                  <span className="font-mono">{runwayLengthToraFt.toLocaleString()} ft</span>
                </div>
                <input
                  type="range"
                  min={1500}
                  max={12000}
                  step={100}
                  value={runwayLengthToraFt}
                  onChange={(e) => setRunwayLengthToraFt(Number(e.target.value))}
                  className="w-full accent-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-500">Clearway</span>
                    <span className="font-mono">{clearwayFt} ft</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={2500}
                    step={50}
                    value={clearwayFt}
                    onChange={(e) => setClearwayFt(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                  <span className="text-[10px] text-slate-400">Max 50% TORA ({declared.maxAllowableClearwayFt} ft)</span>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-500">Stopway</span>
                    <span className="font-mono">{stopwayFt} ft</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1200}
                    step={50}
                    value={stopwayFt}
                    onChange={(e) => setStopwayFt(Number(e.target.value))}
                    className="w-full accent-rose-500"
                  />
                  <span className="text-[10px] text-slate-400">Load-bearing paved surface</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-500">Displaced Threshold (reduces LDA)</span>
                  <span className="font-mono">{displacedThresholdFt} ft</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1500}
                  step={50}
                  value={displacedThresholdFt}
                  onChange={(e) => setDisplacedThresholdFt(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-500">Headwind / Tailwind Component</span>
                  <span className="font-mono">
                    {windKts >= 0 ? `+${windKts} kt Headwind` : `${windKts} kt Tailwind`}
                  </span>
                </div>
                <input
                  type="range"
                  min={-10}
                  max={30}
                  step={1}
                  value={windKts}
                  onChange={(e) => setWindKts(Number(e.target.value))}
                  className="w-full accent-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-500 block mb-1">Runway Surface</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'PAVED_DRY', label: 'Paved Dry (1.0×)' },
                    { id: 'PAVED_WET', label: 'Paved Wet (1.15×)' },
                    { id: 'GRASS_DRY_SHORT', label: 'Dry Grass (1.20×)' },
                    { id: 'GRASS_WET_SHORT', label: 'Wet Grass (1.30×)' }
                  ].map(surf => (
                    <button
                      key={surf.id}
                      onClick={() => setSurface(surf.id as any)}
                      className={`px-2 py-1 rounded-lg text-xs font-bold border transition-colors ${
                        surface === surf.id
                          ? 'border-sky-500 bg-sky-500/10 text-sky-600 dark:text-sky-400'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {surf.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-500">Runway Slope</span>
                  <span className="font-mono">{runwaySlopePct > 0 ? `+${runwaySlopePct}% Upslope` : `${runwaySlopePct}% Downslope`}</span>
                </div>
                <input
                  type="range"
                  min={-2}
                  max={2}
                  step={0.5}
                  value={runwaySlopePct}
                  onChange={(e) => setRunwaySlopePct(Number(e.target.value))}
                  className="w-full accent-sky-500"
                />
                <span className="text-[10px] text-slate-400">+5% distance per 1% upslope</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BALANCED FIELD LENGTH CONCEPT (CS-25) */}
      {activeTab === 'balancedField' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Header Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950 border border-purple-500/30 rounded-3xl p-6 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  EASA ATPL Ch 09: Optimization Framework
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-white mt-2">
                  The Balanced Field Length Concept: TODR = ASDR at V1
                </h2>
                <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-3xl leading-relaxed">
                  The condition where the Take-Off Distance Required (TODR) with an engine failure at V1 exactly equals the Accelerate-Stop Distance Required (ASDR).
                  <strong> At this unique balanced V1, the field length required is minimized, allowing the highest permissible takeoff mass.</strong>
                </p>
              </div>

              <div className={`p-4 rounded-2xl border font-mono text-center min-w-[200px] ${
                isFieldBalanced
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-white'
              }`}>
                <span className="text-[10px] text-slate-400 block uppercase font-sans font-bold">Field State</span>
                <div className="text-xl font-black">
                  {isFieldBalanced ? 'BALANCED FIELD' : isTodrLimited ? 'TODR-LIMITED' : 'ASDR-LIMITED'}
                </div>
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  {isFieldBalanced
                    ? 'TODR ≈ ASDR (Optimal Payload)'
                    : isTodrLimited
                    ? 'Low V1: Engine-out climb penalty'
                    : 'High V1: High brake energy / stop penalty'}
                </span>
              </div>
            </div>

            {/* Interactive V1 Selection Slider */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
                  <Sliders size={16} className="text-purple-400" />
                  Decision Speed Ratio: V1 / VR = {selectedV1Ratio.toFixed(2)}
                </label>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-purple-400 bg-purple-500/10 border border-purple-500/30 px-3 py-1 rounded-lg">
                    Selected V1: {currentV1Ias} kt IAS
                  </span>
                  <span className="font-mono text-xs text-slate-400">
                    VR: {Math.round(perf.vrIasKts)} kt | Balanced V1: {balancedField.balancedV1IasKts} kt
                  </span>
                </div>
              </div>

              <input
                type="range"
                min={0.78}
                max={1.00}
                step={0.01}
                value={selectedV1Ratio}
                onChange={(e) => setSelectedV1Ratio(Number(e.target.value))}
                className="w-full accent-purple-500"
              />

              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                <span>0.78 VR (Low V1: Safe Stop, Long Climb)</span>
                <button
                  onClick={() => setSelectedV1Ratio(Number((balancedField.balancedV1IasKts / perf.vrIasKts).toFixed(2)))}
                  className="px-3 py-1 rounded-lg bg-purple-600/30 border border-purple-500/50 text-purple-300 font-bold hover:bg-purple-600/50 transition-colors"
                >
                  Snap to Balanced V1 ({balancedField.balancedV1IasKts} kt)
                </button>
                <span>1.00 VR (High V1 = VR: Quick Climb, Critical Stop)</span>
              </div>
            </div>

            {/* Curve Comparison Chart: TODR vs ASDR */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
                  <Compass size={14} className="text-purple-400" />
                  Interactive Curves: TODR and ASDR as a Function of V1
                </h4>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-blue-400">
                    <span className="w-3 h-0.5 bg-blue-400 inline-block"></span> TODR (Engine Failure at V1)
                  </span>
                  <span className="flex items-center gap-1.5 text-red-400">
                    <span className="w-3 h-0.5 bg-red-400 inline-block"></span> ASDR (Rejected Takeoff at V1)
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span> Balanced Point
                  </span>
                </div>
              </div>

              {/* Dynamic SVG Curves */}
              <div className="w-full h-64 relative">
                <svg viewBox="0 0 800 240" className="w-full h-full" preserveAspectRatio="none">
                  {/* Axis lines */}
                  <line x1="60" y1="20" x2="60" y2="200" stroke="#334155" strokeWidth="1" />
                  <line x1="60" y1="200" x2="780" y2="200" stroke="#334155" strokeWidth="1" />

                  <text x="60" y="15" fill="#64748b" fontSize="10" fontFamily="monospace">Distance (ft)</text>
                  <text x="780" y="215" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="end">Decision Speed V1 (kt)</text>

                  {/* Grid lines */}
                  <line x1="60" y1="60" x2="780" y2="60" stroke="#1e293b" strokeDasharray="3 3" />
                  <line x1="60" y1="110" x2="780" y2="110" stroke="#1e293b" strokeDasharray="3 3" />
                  <line x1="60" y1="160" x2="780" y2="160" stroke="#1e293b" strokeDasharray="3 3" />

                  {/* TODR Curve (Blue: High at low V1, slopes down) */}
                  {/* ASDR Curve (Red: Low at low V1, slopes up quadratically) */}
                  {(() => {
                    const minRatio = 0.78;
                    const maxRatio = 1.00;
                    const range = maxRatio - minRatio;

                    // Plot points
                    const todrPath = balancedField.points.map((pt, i) => {
                      const x = 80 + ((pt.v1Ratio - minRatio) / range) * 680;
                      // Normalize y between 30 and 190
                      const y = 190 - ((pt.todrFt - 2000) / (balancedField.balancedFieldLengthFt * 1.8 - 2000)) * 160;
                      return `${i === 0 ? 'M' : 'L'} ${x},${Math.max(25, y)}`;
                    }).join(' ');

                    const asdrPath = balancedField.points.map((pt, i) => {
                      const x = 80 + ((pt.v1Ratio - minRatio) / range) * 680;
                      const y = 190 - ((pt.asdrFt - 2000) / (balancedField.balancedFieldLengthFt * 1.8 - 2000)) * 160;
                      return `${i === 0 ? 'M' : 'L'} ${x},${Math.max(25, y)}`;
                    }).join(' ');

                    // Selected V1 line
                    const selectedX = 80 + ((selectedV1Ratio - minRatio) / range) * 680;

                    // Balanced point coords
                    const balancedRatio = balancedField.balancedV1IasKts / perf.vrIasKts;
                    const balancedX = 80 + ((balancedRatio - minRatio) / range) * 680;
                    const balancedY = 190 - ((balancedField.balancedFieldLengthFt - 2000) / (balancedField.balancedFieldLengthFt * 1.8 - 2000)) * 160;

                    return (
                      <>
                        <path d={todrPath} fill="none" stroke="#38bdf8" strokeWidth="3" />
                        <path d={asdrPath} fill="none" stroke="#f43f5e" strokeWidth="3" />

                        {/* Balanced Point Golden Marker */}
                        <circle cx={balancedX} cy={balancedY} r="7" fill="#fbbf24" className="drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                        <line x1={balancedX} y1={balancedY} x2={balancedX} y2="200" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 3" />
                        <text x={balancedX} y={balancedY - 12} fill="#fbbf24" fontSize="11" fontWeight="bold" textAnchor="middle">
                          BFL: {balancedField.balancedFieldLengthFt} ft @ {balancedField.balancedV1IasKts} kt
                        </text>

                        {/* Selected V1 Line */}
                        <line x1={selectedX} y1="20" x2={selectedX} y2="200" stroke="#a855f7" strokeWidth="2.5" />
                        <circle cx={selectedX} cy="200" r="5" fill="#a855f7" />
                        <text x={selectedX} y="32" fill="#a855f7" fontSize="10" fontWeight="bold" textAnchor="middle">
                          Selected V1 = {currentV1Ias} kt
                        </text>
                      </>
                    );
                  })()}
                </svg>
              </div>
            </div>

            {/* Metric Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-sans font-bold">TODR at Current V1</span>
                <div className="text-xl font-black text-sky-400">{currentTodr} ft</div>
                <span className="text-slate-400 font-sans">Distance to 35ft with engine failure</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-sans font-bold">ASDR at Current V1</span>
                <div className="text-xl font-black text-rose-400">{currentAsdr} ft</div>
                <span className="text-slate-400 font-sans">Distance to stop from RTO</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-sans font-bold">Required Field Length</span>
                <div className="text-xl font-black text-white">{Math.max(currentTodr, currentAsdr)} ft</div>
                <span className="text-slate-400 font-sans">Governed by max(TODR, ASDR)</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-purple-500/30 space-y-1">
                <span className="text-[10px] text-purple-400 uppercase font-sans font-bold">Balanced Field Length</span>
                <div className="text-xl font-black text-amber-400">{balancedField.balancedFieldLengthFt} ft</div>
                <span className="text-slate-400 font-sans">Optimal V1: {balancedField.balancedV1IasKts} kt</span>
              </div>
            </div>

            {/* V-Speed Certification Hierarchy Checklist */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase text-slate-300 flex items-center gap-2">
                  <ShieldAlert size={16} className="text-amber-400" />
                  V-Speed Certification Bounds Verification (CS-25.107)
                </h4>
                <span className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold ${
                  vSpeedCheck.allCompliant ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {vSpeedCheck.allCompliant ? 'COMPLIANT' : 'SPEED VIOLATION'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className={`p-3 rounded-xl border ${vSpeedCheck.isV1AboveVmcg ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-red-500/40 bg-red-500/10'}`}>
                  <div className="font-bold text-white flex justify-between">
                    <span>VMCG ≤ V1</span>
                    <span>{vmcgEstimate} ≤ {currentV1Ias} kt</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Ensures aerodynamic rudder directional control on ground.</p>
                </div>

                <div className={`p-3 rounded-xl border ${vSpeedCheck.isV1BelowVr ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-red-500/40 bg-red-500/10'}`}>
                  <div className="font-bold text-white flex justify-between">
                    <span>V1 ≤ VR</span>
                    <span>{currentV1Ias} ≤ {Math.round(perf.vrIasKts)} kt</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Decision to abort must occur before pitch rotation.</p>
                </div>

                <div className={`p-3 rounded-xl border ${vSpeedCheck.isVrBelowVmbe ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-red-500/40 bg-red-500/10'}`}>
                  <div className="font-bold text-white flex justify-between">
                    <span>VR ≤ VMBE</span>
                    <span>{Math.round(perf.vrIasKts)} ≤ {vmbeEstimate} kt</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Within wheel brake maximum thermal energy limit.</p>
                </div>

                <div className={`p-3 rounded-xl border ${vSpeedCheck.isV2AboveVsr ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-red-500/40 bg-red-500/10'}`}>
                  <div className="font-bold text-white flex justify-between">
                    <span>V2 ≥ 1.13 VSR</span>
                    <span>{v2Speed} ≥ {Math.round(vsrClean * 1.13)} kt</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Provides required stall safety margin during takeoff climb.</p>
                </div>
              </div>
            </div>

            {/* Operational Mental Models */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-500/10 border border-red-500/30 p-5 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-red-500 font-bold text-sm">
                  <AlertOctagon size={18} />
                  Mental Model: "V1 as the Red Line of No Return"
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Before V1, the captain aborts for engine failure, fire, or master caution.
                  <strong> After V1, takeoff MUST continue into the air even with catastrophic failure or smoke; stopping distance is gone.</strong>
                  Initiating an abort at V1 + 2 kt guarantees a violent runway excursion because kinetic energy varies with velocity squared (Ek ∝ V²).
                </p>
              </div>

              <div className="bg-purple-500/10 border border-purple-500/30 p-5 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                  <Scale size={18} />
                  Unbalanced vs Balanced Runway Operations
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  If TODA &gt; ASDA (a clearway is available), the pilot can reduce V1 down to V1(min) to ease braking requirements.
                  If ASDA &gt; TODA (a stopway is available), the pilot can raise V1 up to V1(max) = VR.
                  <strong> However, when runway length is limited, choosing the Balanced V1 provides the highest allowable Takeoff Mass!</strong>
                </p>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Guided Scenario: Samedan (LSZS) Hot & High Summer Departure */}
      {activeTab === 'samedanScenario' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/30 rounded-3xl p-8 relative overflow-hidden">
            <div className="flex items-center gap-3 text-amber-500 mb-4">
              <Mountain size={28} />
              <span className="text-xs font-mono font-bold uppercase tracking-widest bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/40">
                Aviation Case Study: Hot & High Trap
              </span>
            </div>

            <h2 className="text-3xl font-black text-white tracking-tight">
              Samedan Airport (LSZS), Engadin Alps — Summer Midday Departure
            </h2>
            <p className="text-slate-300 mt-2 max-w-3xl leading-relaxed">
              At 5,660 ft (1,725 m) above sea level, Samedan is one of the highest commercial airports in Europe. 
              Surrounded by towering 10,000+ ft Alpine peaks, departure performance is severely constrained by density altitude and valley obstacle climb requirements.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-slate-900/80 border border-white/10 p-4 rounded-xl">
                <span className="text-xs text-slate-400">Elevation</span>
                <div className="text-2xl font-bold font-mono text-white mt-1">5,660 ft</div>
                <span className="text-xs text-slate-500">Runway 21: 1,800 m (5,905 ft)</span>
              </div>
              <div className="bg-slate-900/80 border border-white/10 p-4 rounded-xl">
                <span className="text-xs text-slate-400">Summer OAT / QNH</span>
                <div className="text-2xl font-bold font-mono text-amber-400 mt-1">+28°C / 1010 hPa</div>
                <span className="text-xs text-slate-500">ISA +24.2°C Hot Day</span>
              </div>
              <div className="bg-slate-900/80 border border-white/10 p-4 rounded-xl">
                <span className="text-xs text-slate-400">Density Altitude (DA)</span>
                <div className="text-2xl font-bold font-mono text-rose-400 mt-1">8,600+ ft</div>
                <span className="text-xs text-slate-500">Air density ratio σ = 0.77</span>
              </div>
              <div className="bg-slate-900/80 border border-white/10 p-4 rounded-xl">
                <span className="text-xs text-slate-400">Piston BHP Output</span>
                <div className="text-2xl font-bold font-mono text-rose-500 mt-1">~72%</div>
                <span className="text-xs text-slate-500">28% Power Deficit</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 font-bold flex items-center justify-center">1</div>
              <h4 className="font-bold text-slate-900 dark:text-white">The True Airspeed Trap</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                To achieve lift-off at standard 85 kts IAS, the aircraft must accelerate to <strong>98 kts TAS</strong> across the ground. 
                Because ground kinetic energy scales with $V^2$, the aircraft needs $(98/85)^2 = 1.33\times$ more acceleration energy.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 font-bold flex items-center justify-center">2</div>
              <h4 className="font-bold text-slate-900 dark:text-white">Thrust Loss Compounding</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Naturally aspirated engines lose ~3.3% power per 1,000 ft density altitude. At DA 8,600 ft, net accelerating force drops from ~0.35g to ~0.22g, 
                stretching the ground roll from 1,400 ft to nearly 3,500 ft.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-3">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 font-bold flex items-center justify-center">3</div>
              <h4 className="font-bold text-slate-900 dark:text-white">The Go/No-Go Decision</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Applying EASA Class B safety factors ($1.25\times$ TODR), the required takeoff distance exceeds 5,750 ft on a 5,905 ft runway.
                More critically, if one engine fails after liftoff:
              </p>
              <div className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded font-mono text-xs text-rose-600 dark:text-rose-400 font-bold">
                OEI Climb Gradient: -0.8% (Descent into terrain)
              </div>
              <p className="text-xs text-slate-500">
                <strong>Verdict: NO-GO at MTOW.</strong> Must delay departure to early morning (+8°C) or offload 400 lbs payload.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Physics & Theory Tab */}
      {activeTab === 'physics' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Exact Aerodynamic & Atmospheric Physics
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-emerald-600 dark:text-emerald-400 mb-2">1. The Dynamic Pressure & Lift Law</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                  Lift is generated by dynamic pressure $q$ across the wing area $S$:
                </p>
                <div className="bg-slate-200 dark:bg-slate-900 p-3 rounded font-mono text-xs text-slate-800 dark:text-slate-200">
                  L = ½ · ρ · V_TAS² · S · C_L = W
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Since dynamic pressure is q = 0.5 * rho * V_TAS^2, indicated airspeeds (Vs, Vr) remain constant for a given weight, but True Airspeed must increase as density drops: TAS = IAS / sqrt(sigma).
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-amber-600 dark:text-amber-400 mb-2">2. Ground Roll Distance Equation</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                  Integrating kinetic energy over net accelerating force:
                </p>
                <div className="bg-slate-200 dark:bg-slate-900 p-3 rounded font-mono text-xs text-slate-800 dark:text-slate-200">
                  S_G ≈ (W · V_LOF,TAS²) / (2 · g · F_acc) ∝ (W² / σ) · (1 / Thrust_avail)
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Because available thrust drops simultaneously as required kinetic energy rises, takeoff distance increases with approximately $1/\sigma^2$ to $1/\sigma^{2.5}$.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-sky-600 dark:text-sky-400 mb-2">3. Climb Gradient Physics</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                  Resolving forces parallel to the flight path in a steady climb:
                </p>
                <div className="bg-slate-200 dark:bg-slate-900 p-3 rounded font-mono text-xs text-slate-800 dark:text-slate-200">
                  Gradient (%) = sin(γ) × 100 = [(Thrust - Drag) / Weight] × 100
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Rate of Climb: ROC (fpm) = Gradient (%) * TAS (kts) * 1.0127.
                  Excess power is (Thrust - Drag) * TAS / Weight.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-purple-600 dark:text-purple-400 mb-2">4. Regulatory Factoring (CS-23 vs CS-25)</h4>
                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 mt-2">
                  <li><strong>Class B (CS-23):</strong> Takeoff Distance Required (TODR) = Unfactored distance to 50ft $\times 1.25$. Grass runways add $+20\%$ (dry) or $+30\%$ (wet).</li>
                  <li><strong>Class A (CS-25):</strong> Takeoff Distance Required is the greater of: (a) All-engines distance to 35ft $\times 1.15$, or (b) One-Engine-Inoperative (OEI) distance to 35ft screen height (15ft if wet).</li>
                  <li><strong>Clearway Limit:</strong> Clearway cannot exceed $50\%$ of TORA per ICAO Annex 14. Stopway must be load-bearing.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TakeoffPerf;
