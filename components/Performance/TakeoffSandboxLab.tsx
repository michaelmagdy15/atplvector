import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertOctagon,
  AlertTriangle,
  Compass,
  Gauge,
  Info,
  Mountain,
  PlaneTakeoff,
  Scale,
  ShieldAlert,
  Sliders,
  Thermometer,
  Wind,
  XCircle,
} from 'lucide-react';
import {
  AIRCRAFT_PRESETS,
  AircraftPreset,
  AtmosphericConditions,
  calculateAtmosphere,
  calculateBalancedField,
  calculateDeclaredDistances,
  calculateTakeoffPerformance,
  validateVSpeedHierarchy,
} from '../../lib/aviation/aircraftPerformance';
import { View } from '../../types';
import FoundationReadinessPill from '../foundations/FoundationReadinessPill';

interface TakeoffSandboxLabProps {
  onChangeView?: (view: View) => void;
}

export const TakeoffSandboxLab: React.FC<TakeoffSandboxLabProps> = ({ onChangeView }) => {
  const [selectedAircraftId, setSelectedAircraftId] = useState<string>('airbus_a320');
  const aircraft: AircraftPreset = AIRCRAFT_PRESETS[selectedAircraftId] || AIRCRAFT_PRESETS.BARON_G58;

  const [weightLbs, setWeightLbs] = useState<number>(aircraft.maxTakeoffWeightLbs);
  const [elevationFt, setElevationFt] = useState<number>(0);
  const [qnhHpa, setQnhHpa] = useState<number>(1013);
  const [oatC, setOatC] = useState<number>(15);
  const [windKts, setWindKts] = useState<number>(0);
  const [runwaySlopePct, setRunwaySlopePct] = useState<number>(0);
  const [surface, setSurface] = useState<AtmosphericConditions['surface']>('PAVED_DRY');

  const [runwayLengthToraFt, setRunwayLengthToraFt] = useState<number>(8500);
  const [clearwayFt, setClearwayFt] = useState<number>(1000);
  const [stopwayFt, setStopwayFt] = useState<number>(500);
  const [displacedThresholdFt, setDisplacedThresholdFt] = useState<number>(0);

  const [simulateRtoAtV1, setSimulateRtoAtV1] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'simulator' | 'balancedField' | 'samedanScenario' | 'physics'>('simulator');
  const [selectedV1Ratio, setSelectedV1Ratio] = useState<number>(0.9);

  const handleAircraftChange = (id: string) => {
    setSelectedAircraftId(id);
    const newAc = AIRCRAFT_PRESETS[id];
    if (newAc) setWeightLbs(newAc.maxTakeoffWeightLbs);
  };

  const conditions: AtmosphericConditions = useMemo(
    () => ({ elevationFt, qnhHpa, oatC, windKts, runwaySlopePct, surface }),
    [elevationFt, qnhHpa, oatC, windKts, runwaySlopePct, surface]
  );

  const atmosphere = useMemo(() => calculateAtmosphere(conditions), [conditions]);
  const perf = useMemo(
    () => calculateTakeoffPerformance(aircraft, weightLbs, conditions),
    [aircraft, weightLbs, conditions]
  );
  const declared = useMemo(
    () => calculateDeclaredDistances(runwayLengthToraFt, clearwayFt, stopwayFt, displacedThresholdFt),
    [runwayLengthToraFt, clearwayFt, stopwayFt, displacedThresholdFt]
  );

  const { todaFt, asdaFt, ldaFt } = declared;
  const takeoffMarginFt = todaFt - perf.factoredRequiredDistanceFt;
  const isTakeoffSafe = takeoffMarginFt >= 0;
  const stopMarginFt = asdaFt - perf.accelerateStopDistanceFt;
  const isStopSafe = stopMarginFt >= 0;

  const balancedField = useMemo(() => {
    const surfaceFriction = surface === 'PAVED_WET' ? 1.25 : 1.0;
    return calculateBalancedField(perf.vrIasKts, perf.factoredRequiredDistanceFt, surfaceFriction);
  }, [perf.vrIasKts, perf.factoredRequiredDistanceFt, surface]);

  const currentV1Ias = Math.round(perf.vrIasKts * selectedV1Ratio);
  const currentTodr = Math.round(
    perf.factoredRequiredDistanceFt * (0.88 + 1.65 * Math.pow(1 - selectedV1Ratio, 1.25))
  );
  const currentAsdr = Math.round(
    perf.factoredRequiredDistanceFt *
      Math.pow(selectedV1Ratio / 0.9, 2.1) *
      (surface === 'PAVED_WET' ? 1.25 : 1.0)
  );
  const isFieldBalanced = Math.abs(currentTodr - currentAsdr) < 120;
  const isTodrLimited = currentTodr > currentAsdr;

  const vmcgEstimate = Math.round(perf.vrIasKts * 0.82);
  const vmcaEstimate = Math.round(perf.vrIasKts * 0.88);
  const vmbeEstimate = Math.round(perf.vrIasKts * 1.15);
  const v2Speed = aircraft.speeds.v2Ias || Math.round(perf.vrIasKts * 1.06);
  const vsrClean = aircraft.speeds.vs1Ias || Math.round(perf.vrIasKts * 0.84);

  const vSpeedCheck = useMemo(
    () =>
      validateVSpeedHierarchy({
        vmcg: vmcgEstimate,
        v1: currentV1Ias,
        vr: Math.round(perf.vrIasKts),
        vmbe: vmbeEstimate,
        vmca: vmcaEstimate,
        v2: v2Speed,
        vsr: vsrClean,
      }),
    [vmcgEstimate, currentV1Ias, perf.vrIasKts, vmbeEstimate, vmcaEstimate, v2Speed, vsrClean]
  );

  const applyScenario = (preset: 'SEALEVEL_ISA' | 'SAMEDAN_SUMMER' | 'DENVER_HOT') => {
    if (preset === 'SEALEVEL_ISA') {
      setElevationFt(0);
      setQnhHpa(1013);
      setOatC(15);
      setWindKts(0);
      setRunwaySlopePct(0);
      setSurface('PAVED_DRY');
      setRunwayLengthToraFt(8500);
      setClearwayFt(1000);
      setStopwayFt(500);
      setDisplacedThresholdFt(0);
    } else if (preset === 'SAMEDAN_SUMMER') {
      setElevationFt(5660);
      setQnhHpa(1010);
      setOatC(28);
      setWindKts(-3);
      setRunwaySlopePct(0.5);
      setSurface('PAVED_DRY');
      setRunwayLengthToraFt(5905);
      setClearwayFt(0);
      setStopwayFt(0);
      setDisplacedThresholdFt(0);
      setSelectedAircraftId('baron_g58');
      setWeightLbs(5500);
    } else if (preset === 'DENVER_HOT') {
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

  const maxDisplayDistanceFt =
    Math.max(todaFt, asdaFt, perf.factoredRequiredDistanceFt, perf.accelerateStopDistanceFt) * 1.15;
  const toraWidthPct = (runwayLengthToraFt / maxDisplayDistanceFt) * 100;
  const stopwayWidthPct = (stopwayFt / maxDisplayDistanceFt) * 100;
  const clearwayWidthPct = (declared.effectiveClearwayFt / maxDisplayDistanceFt) * 100;
  const groundRollPct = (perf.groundRollFt / maxDisplayDistanceFt) * 100;
  const screenDistPct = (perf.distanceToScreenFt / maxDisplayDistanceFt) * 100;
  const factoredDistPct = (perf.factoredRequiredDistanceFt / maxDisplayDistanceFt) * 100;
  const asdrDistPct = (perf.accelerateStopDistanceFt / maxDisplayDistanceFt) * 100;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Sandbox Scenario Header */}
      <div className="dx-card p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <FoundationReadinessPill
            conceptId="FND_AIR_DENSITY_EFFECT"
            targetLO="032.01"
            onNavigateToFullChain={onChangeView}
          />
          <button
            type="button"
            onClick={() => applyScenario('SEALEVEL_ISA')}
            className="px-3 py-1.5 text-xs font-mono font-bold border border-line bg-bg hover:border-emerald-400 cursor-pointer"
          >
            Sea Level ISA
          </button>
          <button
            type="button"
            onClick={() => applyScenario('SAMEDAN_SUMMER')}
            className="px-3 py-1.5 text-xs font-mono font-bold border border-amber-500/40 bg-amber-500/10 text-amber-300 flex items-center gap-1.5 cursor-pointer"
          >
            <Mountain size={14} /> Samedan (5,660&apos; +28°C)
          </button>
          <button
            type="button"
            onClick={() => applyScenario('DENVER_HOT')}
            className="px-3 py-1.5 text-xs font-mono font-bold border border-rose-500/40 bg-rose-500/10 text-rose-300 cursor-pointer"
          >
            Denver Hot
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'simulator', label: 'Runway Sandbox', icon: Sliders },
            { id: 'balancedField', label: 'Balanced Field', icon: Scale },
            { id: 'samedanScenario', label: 'Samedan Case Study', icon: Mountain },
            { id: 'physics', label: 'CS-23/25 Math', icon: Info },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 text-xs font-mono font-bold flex items-center gap-1.5 border cursor-pointer ${
                  active
                    ? 'border-cad-accent bg-cad-accent text-white'
                    : 'border-line bg-bg text-muted hover:text-ink'
                }`}
              >
                <Icon size={14} /> {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === 'simulator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="dx-card p-3.5">
              <span className="hud-label text-muted flex items-center gap-1">
                <Gauge size={12} /> PA
              </span>
              <div className="text-lg font-black font-mono text-ink mt-1">
                {Math.round(atmosphere.pressureAltFt).toLocaleString()} ft
              </div>
              <span className="text-[10px] font-mono text-muted">ISA: {Math.round(atmosphere.isaTempC)}°C</span>
            </div>

            <div
              className={`dx-card p-3.5 ${
                atmosphere.densityAltFt > 7000
                  ? 'border-rose-500/60'
                  : atmosphere.densityAltFt > 4000
                  ? 'border-amber-500/60'
                  : ''
              }`}
            >
              <span className="hud-label text-muted flex items-center gap-1">
                <Thermometer size={12} /> DA
              </span>
              <div className="text-lg font-black font-mono text-amber-300 mt-1">
                {Math.round(atmosphere.densityAltFt).toLocaleString()} ft
              </div>
              <span className="text-[10px] font-mono text-muted">
                ΔISA: {atmosphere.deltaIsaC >= 0 ? `+${atmosphere.deltaIsaC.toFixed(1)}` : atmosphere.deltaIsaC.toFixed(1)}°C
              </span>
            </div>

            <div className="dx-card p-3.5">
              <span className="hud-label text-muted">σ Ratio</span>
              <div className="text-lg font-black font-mono text-sky-400 mt-1">
                {atmosphere.densityRatioSigma.toFixed(3)}
              </div>
              <span className="text-[10px] font-mono text-muted">
                ρ: {atmosphere.densityRhoKgM3.toFixed(3)}
              </span>
            </div>

            <div className="dx-card p-3.5">
              <span className="hud-label text-muted">Vr IAS / TAS</span>
              <div className="text-lg font-black font-mono text-ink mt-1">
                {perf.vrIasKts} / {perf.vrTasKts} kt
              </div>
              <span className="text-[10px] font-mono text-sky-400">
                +{Math.round((perf.vrTasKts / perf.vrIasKts - 1) * 100)}% TAS
              </span>
            </div>

            <div className="dx-card p-3.5">
              <span className="hud-label text-muted">Power / Thrust</span>
              <div
                className={`text-lg font-black font-mono mt-1 ${
                  perf.powerAvailableFraction < 0.75 ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {Math.round(perf.powerAvailableFraction * 100)}%
              </div>
              <span className="text-[10px] font-mono text-muted">{aircraft.category}</span>
            </div>

            <div
              className={`dx-card p-3.5 ${
                isTakeoffSafe ? 'border-emerald-500/60' : 'border-rose-500/70'
              }`}
            >
              <span className="hud-label text-muted">Clearance</span>
              <div
                className={`text-lg font-black font-mono mt-1 ${
                  isTakeoffSafe ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {isTakeoffSafe ? 'GO' : 'NO-GO'}
              </div>
              <span className="text-[10px] font-mono text-muted">
                {takeoffMarginFt > 0 ? `+${takeoffMarginFt}` : takeoffMarginFt} ft
              </span>
            </div>
          </div>

          <div className="dx-card p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-base text-ink">
                  Dynamic Runway & Declared Distances Visualizer
                </h3>
                <p className="text-xs text-muted">
                  TORA, TODA (50% Clearway cap), ASDA, LDA, ground roll, and {aircraft.screenHeightFt} ft screen height.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSimulateRtoAtV1(!simulateRtoAtV1)}
                className={`px-3.5 py-1.5 text-xs font-mono font-bold border flex items-center gap-2 cursor-pointer ${
                  simulateRtoAtV1
                    ? 'border-rose-500 bg-rose-600 text-white'
                    : 'border-line bg-bg text-ink hover:border-line-strong'
                }`}
              >
                {simulateRtoAtV1 ? <XCircle size={15} /> : <ShieldAlert size={15} />}
                {simulateRtoAtV1 ? 'Simulating RTO at V1' : 'Test RTO at V1'}
              </button>
            </div>

            {declared.isClearwayCapped && (
              <div className="flex items-center gap-2 p-3 border border-amber-500/40 bg-amber-500/10 text-amber-300 text-xs">
                <AlertTriangle size={16} className="shrink-0" />
                <span>
                  Clearway ({clearwayFt} ft) exceeds 50% of TORA ({declared.maxAllowableClearwayFt} ft); TODA credits only {declared.effectiveClearwayFt} ft.
                </span>
              </div>
            )}

            <div className="relative w-full h-72 bg-bg-sunken border border-line p-5 flex flex-col justify-end overflow-hidden">
              <div className="absolute top-3 left-5 flex flex-wrap gap-4 text-xs font-mono text-muted">
                <span>
                  A/C: <strong className="text-ink">{aircraft.name.split('(')[0]}</strong>
                </span>
                <span>
                  Weight: <strong className="text-ink">{weightLbs.toLocaleString()} lbs</strong>
                </span>
                <span>
                  Wind:{' '}
                  <strong className="text-ink">
                    {windKts >= 0 ? `+${windKts} kt Head` : `${Math.abs(windKts)} kt Tail`}
                  </strong>
                </span>
              </div>

              {!isTakeoffSafe && !simulateRtoAtV1 && (
                <div className="absolute top-10 right-5 z-20 bg-rose-600 text-white px-3 py-1.5 text-xs font-mono font-bold">
                  OVERRUN: TODR exceeds TODA by {Math.abs(takeoffMarginFt)} ft
                </div>
              )}
              {simulateRtoAtV1 && !isStopSafe && (
                <div className="absolute top-10 right-5 z-20 bg-rose-600 text-white px-3 py-1.5 text-xs font-mono font-bold">
                  OVERRUN: ASDR exceeds ASDA by {Math.abs(stopMarginFt)} ft
                </div>
              )}

              <div className="relative w-full h-12 flex items-center mb-12">
                <div
                  className="h-full bg-slate-800 border-y-2 border-slate-600 relative flex items-center"
                  style={{ width: `${toraWidthPct}%` }}
                >
                  <div className="w-full border-t-2 border-dashed border-white/40" />
                  {displacedThresholdFt > 0 && (
                    <div
                      className="absolute left-0 top-0 bottom-0 bg-amber-500/20 border-r-2 border-amber-400"
                      style={{ width: `${(displacedThresholdFt / runwayLengthToraFt) * 100}%` }}
                    />
                  )}
                </div>
                {stopwayFt > 0 && (
                  <div
                    className="h-full bg-rose-950/50 border-y-2 border-dashed border-rose-500/60 flex items-center justify-center text-[9px] font-mono text-rose-300"
                    style={{ width: `${stopwayWidthPct}%` }}
                  >
                    STOPWAY
                  </div>
                )}
                {declared.effectiveClearwayFt > 0 && (
                  <div
                    className="h-full bg-emerald-950/40 border-y-2 border-dashed border-emerald-500/60 flex items-center justify-center text-[9px] font-mono text-emerald-300"
                    style={{ width: `${clearwayWidthPct}%` }}
                  >
                    CLEARWAY
                  </div>
                )}
              </div>

              <div className="space-y-1 text-[10px] font-mono">
                <div className="h-3.5 bg-slate-800 border-x border-slate-500 px-2 flex items-center text-slate-200" style={{ width: `${toraWidthPct}%` }}>
                  TORA: {runwayLengthToraFt} ft
                </div>
                <div className="h-3.5 bg-emerald-950 border-x border-emerald-500 px-2 flex items-center text-emerald-300" style={{ width: `${(todaFt / maxDisplayDistanceFt) * 100}%` }}>
                  TODA: {todaFt} ft
                </div>
                <div className="h-3.5 bg-rose-950 border-x border-rose-500 px-2 flex items-center text-rose-300" style={{ width: `${(asdaFt / maxDisplayDistanceFt) * 100}%` }}>
                  ASDA: {asdaFt} ft
                </div>
                <div className="h-3.5 bg-amber-950 border-x border-amber-500 px-2 flex items-center text-amber-300" style={{ width: `${(ldaFt / maxDisplayDistanceFt) * 100}%` }}>
                  LDA: {ldaFt} ft
                </div>
              </div>

              <motion.div
                className="absolute z-20 pointer-events-none"
                initial={{ left: '0%', bottom: '5rem' }}
                animate={{
                  left: simulateRtoAtV1
                    ? ['0%', `${Math.min(100, asdrDistPct * 0.55)}%`, `${Math.min(100, asdrDistPct)}%`]
                    : ['0%', `${Math.min(100, groundRollPct)}%`, `${Math.min(100, screenDistPct)}%`, '104%'],
                  bottom: simulateRtoAtV1
                    ? ['5rem', '5rem', '5rem']
                    : ['5rem', '5rem', '7.5rem', '12rem'],
                  rotate: simulateRtoAtV1 ? [0, 0, 0] : [0, 0, -10, -12],
                }}
                transition={{ duration: simulateRtoAtV1 ? 4.5 : 5.5, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1.5 }}
                key={`${selectedAircraftId}-${elevationFt}-${oatC}-${weightLbs}-${simulateRtoAtV1}`}
              >
                <PlaneTakeoff size={30} className={simulateRtoAtV1 ? 'text-rose-400' : 'text-emerald-400'} />
              </motion.div>

              {!simulateRtoAtV1 && (
                <div
                  className="absolute bottom-24 border-l-2 border-purple-400 border-dashed h-16 z-10"
                  style={{ left: `${Math.min(96, factoredDistPct)}%` }}
                >
                  <span className="bg-purple-600 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 whitespace-nowrap">
                    Factored TODR: {perf.factoredRequiredDistanceFt} ft
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="dx-card p-5 space-y-4">
              <h3 className="font-bold text-ink flex items-center gap-2 text-sm">
                <PlaneTakeoff className="text-emerald-400" size={16} /> Aircraft & Mass
              </h3>
              <div className="space-y-1.5">
                {Object.values(AIRCRAFT_PRESETS).map((ac) => (
                  <button
                    key={ac.id}
                    type="button"
                    onClick={() => handleAircraftChange(ac.id)}
                    className={`w-full px-3 py-2 text-left text-xs font-bold border cursor-pointer ${
                      selectedAircraftId === ac.id
                        ? 'border-emerald-400 bg-emerald-500/15 text-ink'
                        : 'border-line bg-bg text-muted hover:text-ink'
                    }`}
                  >
                    <div className="flex justify-between">
                      <span>{ac.name.split('(')[0]}</span>
                      <span className="font-mono text-[10px]">{ac.category}</span>
                    </div>
                  </button>
                ))}
              </div>
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-muted">TOW</span>
                  <span className="text-ink font-bold">{weightLbs.toLocaleString()} lbs</span>
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
              </div>
            </div>

            <div className="dx-card p-5 space-y-4">
              <h3 className="font-bold text-ink flex items-center gap-2 text-sm">
                <Thermometer className="text-amber-400" size={16} /> Atmosphere
              </h3>
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-muted">Elevation</span>
                  <span className="text-ink font-bold">{elevationFt.toLocaleString()} ft</span>
                </div>
                <input type="range" min={0} max={10000} step={100} value={elevationFt} onChange={(e) => setElevationFt(Number(e.target.value))} className="w-full accent-amber-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-muted">OAT</span>
                  <span className="text-ink font-bold">{oatC}°C</span>
                </div>
                <input type="range" min={-20} max={45} step={1} value={oatC} onChange={(e) => setOatC(Number(e.target.value))} className="w-full accent-amber-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-muted">QNH</span>
                  <span className="text-ink font-bold">{qnhHpa} hPa</span>
                </div>
                <input type="range" min={960} max={1045} step={1} value={qnhHpa} onChange={(e) => setQnhHpa(Number(e.target.value))} className="w-full accent-amber-500" />
              </div>
            </div>

            <div className="dx-card p-5 space-y-3">
              <h3 className="font-bold text-ink flex items-center gap-2 text-sm">
                <Wind className="text-sky-400" size={16} /> Runway & Surface
              </h3>
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-muted">TORA</span>
                  <span className="text-ink font-bold">{runwayLengthToraFt.toLocaleString()} ft</span>
                </div>
                <input type="range" min={1500} max={12000} step={100} value={runwayLengthToraFt} onChange={(e) => setRunwayLengthToraFt(Number(e.target.value))} className="w-full accent-sky-500" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-muted">Clearway</span>
                    <span className="text-ink">{clearwayFt}</span>
                  </div>
                  <input type="range" min={0} max={2500} step={50} value={clearwayFt} onChange={(e) => setClearwayFt(Number(e.target.value))} className="w-full accent-emerald-500" />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-muted">Stopway</span>
                    <span className="text-ink">{stopwayFt}</span>
                  </div>
                  <input type="range" min={0} max={1200} step={50} value={stopwayFt} onChange={(e) => setStopwayFt(Number(e.target.value))} className="w-full accent-rose-500" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-muted">Wind (+Head / −Tail)</span>
                  <span className="text-ink font-bold">{windKts} kt</span>
                </div>
                <input type="range" min={-10} max={30} step={1} value={windKts} onChange={(e) => setWindKts(Number(e.target.value))} className="w-full accent-sky-500" />
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'PAVED_DRY', label: 'Dry (1.0×)' },
                  { id: 'PAVED_WET', label: 'Wet (1.15×)' },
                  { id: 'GRASS_DRY_SHORT', label: 'Grass Dry' },
                  { id: 'GRASS_WET_SHORT', label: 'Grass Wet' },
                ].map((surf) => (
                  <button
                    key={surf.id}
                    type="button"
                    onClick={() => setSurface(surf.id as any)}
                    className={`px-2 py-1 text-[11px] font-mono font-bold border cursor-pointer ${
                      surface === surf.id ? 'border-sky-400 bg-sky-500/15 text-sky-300' : 'border-line bg-bg text-muted'
                    }`}
                  >
                    {surf.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'balancedField' && (
        <div className="dx-card p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-ink">
                Balanced Field Length: TODR = ASDR at Optimal V1
              </h2>
              <p className="text-xs sm:text-sm text-muted mt-1 max-w-2xl">
                Sweep V1/VR below to observe how lower V1 increases engine-out TODR while higher V1 increases braking kinetic energy (ASDR ∝ V1²).
              </p>
            </div>
            <div className={`p-3 border font-mono text-center ${isFieldBalanced ? 'border-emerald-400 bg-emerald-500/15 text-emerald-300' : 'border-line bg-bg text-ink'}`}>
              <div className="text-[10px] text-muted uppercase">Field State</div>
              <div className="text-lg font-bold">
                {isFieldBalanced ? 'BALANCED FIELD' : isTodrLimited ? 'TODR-LIMITED' : 'ASDR-LIMITED'}
              </div>
            </div>
          </div>

          <div className="border border-line bg-bg p-4 space-y-3">
            <div className="flex justify-between font-mono text-xs">
              <span className="text-muted">V1 / VR = {selectedV1Ratio.toFixed(2)} (V1 = {currentV1Ias} kt)</span>
              <button
                type="button"
                onClick={() => setSelectedV1Ratio(Number((balancedField.balancedV1IasKts / perf.vrIasKts).toFixed(2)))}
                className="px-2.5 py-1 border border-purple-400/50 bg-purple-500/15 text-purple-300 font-bold cursor-pointer"
              >
                Snap Balanced ({balancedField.balancedV1IasKts} kt)
              </button>
            </div>
            <input type="range" min={0.78} max={1} step={0.01} value={selectedV1Ratio} onChange={(e) => setSelectedV1Ratio(Number(e.target.value))} className="w-full accent-purple-500" />
          </div>

          <div className="w-full h-56 border border-line bg-bg p-3">
            <svg viewBox="0 0 800 220" className="w-full h-full">
              <line x1="60" y1="20" x2="60" y2="195" stroke="#475569" strokeWidth="1" />
              <line x1="60" y1="195" x2="780" y2="195" stroke="#475569" strokeWidth="1" />
              {(() => {
                const minRatio = 0.78;
                const range = 0.22;
                const scaleMax = balancedField.balancedFieldLengthFt * 1.8;
                const mapY = (d: number) => Math.max(25, 190 - ((d - 2000) / Math.max(500, scaleMax - 2000)) * 160);
                const todrPath = balancedField.points.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${80 + ((pt.v1Ratio - minRatio) / range) * 680},${mapY(pt.todrFt)}`).join(' ');
                const asdrPath = balancedField.points.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${80 + ((pt.v1Ratio - minRatio) / range) * 680},${mapY(pt.asdrFt)}`).join(' ');
                const selectedX = 80 + ((selectedV1Ratio - minRatio) / range) * 680;
                const balancedX = 80 + ((balancedField.balancedV1IasKts / perf.vrIasKts - minRatio) / range) * 680;
                const balancedY = mapY(balancedField.balancedFieldLengthFt);
                return (
                  <>
                    <path d={todrPath} fill="none" stroke="#38bdf8" strokeWidth="3" />
                    <path d={asdrPath} fill="none" stroke="#f43f5e" strokeWidth="3" />
                    <circle cx={balancedX} cy={balancedY} r="6" fill="#fbbf24" />
                    <text x={balancedX} y={balancedY - 12} fill="#fbbf24" fontSize="11" fontWeight="bold" textAnchor="middle">
                      BFL {balancedField.balancedFieldLengthFt} ft @ {balancedField.balancedV1IasKts} kt
                    </text>
                    <line x1={selectedX} y1="20" x2={selectedX} y2="195" stroke="#a855f7" strokeWidth="2" />
                  </>
                );
              })()}
            </svg>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="border border-line bg-bg p-3"><span className="text-muted">TODR</span><div className="text-lg font-bold text-sky-400">{currentTodr} ft</div></div>
            <div className="border border-line bg-bg p-3"><span className="text-muted">ASDR</span><div className="text-lg font-bold text-rose-400">{currentAsdr} ft</div></div>
            <div className="border border-line bg-bg p-3"><span className="text-muted">Required Field</span><div className="text-lg font-bold text-ink">{Math.max(currentTodr, currentAsdr)} ft</div></div>
            <div className="border border-line bg-bg p-3"><span className="text-muted">V-Speed Hierarchy</span><div className={`text-lg font-bold ${vSpeedCheck.allCompliant ? 'text-emerald-400' : 'text-rose-400'}`}>{vSpeedCheck.allCompliant ? 'COMPLIANT' : 'VIOLATION'}</div></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="border border-rose-500/40 bg-rose-500/10 p-4">
              <div className="font-bold text-rose-300 flex items-center gap-1.5 mb-1"><AlertOctagon size={15} /> V1 Red Line</div>
              Before V1, abort cleanly inside ASDA. Above V1, continue into the air — kinetic energy grows with V².
            </div>
            <div className="border border-purple-500/40 bg-purple-500/10 p-4">
              <div className="font-bold text-purple-300 flex items-center gap-1.5 mb-1"><Compass size={15} /> Unbalanced Runways</div>
              Clearway (TODA &gt; ASDA) lowers optimal V1; Stopway (ASDA &gt; TODA) allows raising V1 toward VR.
            </div>
          </div>
        </div>
      )}

      {activeTab === 'samedanScenario' && (
        <div className="dx-card p-6 space-y-4">
          <h2 className="font-display text-2xl font-bold text-ink">
            Samedan Airport (LSZS) — Hot &amp; High Alpine Departure Trap
          </h2>
          <p className="text-xs sm:text-sm text-muted">
            Elevation 5,660 ft + +28°C summer OAT yields Density Altitude &gt; 8,600 ft (σ ≈ 0.77): TAS rises at liftoff while unsupercharged power drops ~28%.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
            <div className="border border-line bg-bg p-3"><span className="text-muted">Elevation</span><div className="text-base font-bold text-ink">5,660 ft</div></div>
            <div className="border border-line bg-bg p-3"><span className="text-muted">Density Alt</span><div className="text-base font-bold text-rose-400">8,600+ ft</div></div>
            <div className="border border-line bg-bg p-3"><span className="text-muted">BHP Output</span><div className="text-base font-bold text-amber-400">~72%</div></div>
            <div className="border border-line bg-bg p-3"><span className="text-muted">Midday MTOW</span><div className="text-base font-bold text-rose-400">NO-GO</div></div>
          </div>
        </div>
      )}

      {activeTab === 'physics' && (
        <div className="dx-card p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="border border-line bg-bg p-4 space-y-2">
            <div className="font-bold text-emerald-400">Lift &amp; TAS Divergence</div>
            <div className="font-mono text-ink">L = ½ · ρ · V_TAS² · S · C_L | TAS = IAS / √σ</div>
          </div>
          <div className="border border-line bg-bg p-4 space-y-2">
            <div className="font-bold text-amber-400">CS-23 vs CS-25 Factoring</div>
            <p className="text-muted">CS-23 unfactored distance × 1.25 to 50 ft; CS-25 greater of 1.15 × AEO or 1.0 × OEI to 35 ft (15 ft wet).</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TakeoffSandboxLab;
