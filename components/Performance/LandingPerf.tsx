import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlaneLanding, ShieldAlert, ArrowRight, XCircle, CheckCircle2,
  AlertTriangle, Sliders, Info, HelpCircle, Waves, Gauge, Scale, Award
} from 'lucide-react';
import {
  calculateLandingDistanceRequired,
  LandingDistanceCalculation
} from '../../lib/aviation/aircraftPerformance';

export const LandingPerf: React.FC = () => {
  // Aircraft Selection
  const [selectedAircraft, setSelectedAircraft] = useState<'A320' | 'MUSTANG'>('A320');

  // Operational State
  const [condition, setCondition] = useState<'DRY' | 'WET' | 'CONTAMINATED'>('DRY');
  const [ldaFt, setLdaFt] = useState<number>(7500); // Landing Distance Available
  const [landingWeightKg, setLandingWeightKg] = useState<number>(62000); // A320 default ~62 tonnes
  const [headwindKts, setHeadwindKts] = useState<number>(0);
  const [runwaySlopePct, setRunwaySlopePct] = useState<number>(0);

  // Speeds (VREF >= 1.23 VSR0)
  const baseVref = selectedAircraft === 'A320' ? 134 : 92;
  const maxLwKg = selectedAircraft === 'A320' ? 66000 : 3630;
  const weightRatio = Math.max(0.65, Math.min(1.05, landingWeightKg / maxLwKg));
  const vrefKts = Math.round(baseVref * Math.sqrt(weightRatio));
  const vappKts = Math.round(vrefKts + Math.max(5, Math.min(15, headwindKts * 0.33))); // VAPP = VREF + wind increment

  // Unfactored Actual Landing Distance (ALD from 50 ft screen height to full stop)
  // For A320 at MLW SL ISA, ALD is ~2,800 to 3,200 ft
  const baseAld = selectedAircraft === 'A320' ? 3000 : 2100;
  const slopeFactor = runwaySlopePct < 0 ? 1 + Math.abs(runwaySlopePct) * 0.05 : 1 - runwaySlopePct * 0.03; // Downslope increases distance!
  const windFactor = headwindKts > 0 ? Math.max(0.7, 1 - (headwindKts / 10) * 0.05) : 1 + (Math.abs(headwindKts) / 2) * 0.05;

  const actualDistanceFt = Math.round(baseAld * weightRatio * slopeFactor * windFactor);

  // Regulatory Factored Calculations via aircraftPerformance engine
  const landingCalc: LandingDistanceCalculation = useMemo(() => {
    return calculateLandingDistanceRequired(actualDistanceFt, ldaFt, condition);
  }, [actualDistanceFt, ldaFt, condition]);

  const requiredDistanceFt = landingCalc.activeRequiredLdrFt;
  const isCompliant = landingCalc.isCompliant;
  const marginFt = landingCalc.marginFt;

  // Visualizer scaling
  const maxDisplayDistanceFt = Math.max(ldaFt, requiredDistanceFt, actualDistanceFt) * 1.15;
  const ldaPct = (ldaFt / maxDisplayDistanceFt) * 100;
  const aldPct = (actualDistanceFt / maxDisplayDistanceFt) * 100;
  const ldrPct = (requiredDistanceFt / maxDisplayDistanceFt) * 100;

  // Student quiz
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-4">
          <div className="bg-amber-500/10 dark:bg-amber-500/20 p-4 rounded-2xl text-amber-500 border border-amber-500/30">
            <PlaneLanding size={36} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                EASA CS-25 & CAT.POL.A.230
              </span>
              <span className="text-xs text-slate-500 font-mono">EASA Ch 09: Landing Performance</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              Landing Distance Required (LDR) Engine
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base mt-1">
              The 60% Rule (1.67x Factor), Wet Runway (1.15x Factoring), Contaminated Surfaces & Screen Height
            </p>
          </div>
        </div>

        {/* Aircraft Selector */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => {
              setSelectedAircraft('A320');
              setLandingWeightKg(62000);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedAircraft === 'A320'
                ? 'bg-amber-600 text-white font-black shadow'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Airbus A320-200
          </button>
          <button
            onClick={() => {
              setSelectedAircraft('MUSTANG');
              setLandingWeightKg(3400);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedAircraft === 'MUSTANG'
                ? 'bg-amber-600 text-white font-black shadow'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Citation Mustang
          </button>
        </div>
      </div>

      {/* Metrics Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase text-slate-500 block">Landing Weight</span>
          <div className="text-xl font-black font-mono text-slate-900 dark:text-white mt-1">
            {(landingWeightKg / 1000).toFixed(1)} <span className="text-xs font-normal text-slate-400">tonnes</span>
          </div>
          <span className="text-[10px] text-slate-400">Max LW: {(maxLwKg / 1000).toFixed(1)} t</span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase text-slate-500 block">VREF Speed</span>
          <div className="text-xl font-black font-mono text-amber-500 mt-1">
            {vrefKts} <span className="text-xs font-normal text-slate-400">kt IAS</span>
          </div>
          <span className="text-[10px] text-slate-400">VREF ≥ 1.23 VSR0</span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase text-slate-500 block">Approach (VAPP)</span>
          <div className="text-xl font-black font-mono text-sky-500 mt-1">
            {vappKts} <span className="text-xs font-normal text-slate-400">kt IAS</span>
          </div>
          <span className="text-[10px] text-slate-400">VREF + wind correction</span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase text-slate-500 block">Actual Landing (ALD)</span>
          <div className="text-xl font-black font-mono text-slate-900 dark:text-white mt-1">
            {actualDistanceFt.toLocaleString()} <span className="text-xs font-normal text-slate-400">ft</span>
          </div>
          <span className="text-[10px] text-slate-400">Unfactored 50' to stop</span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase text-slate-500 block">Regulatory Factor</span>
          <div className="text-xl font-black font-mono text-purple-400 mt-1">
            {landingCalc.factorMultiplier.toFixed(3)}×
          </div>
          <span className="text-[10px] text-slate-400">
            {condition === 'DRY' ? '60% Rule (1/0.6)' : condition === 'WET' ? 'Dry × 1.15' : 'Contaminated (1.40×)'}
          </span>
        </div>

        <div className={`p-4 rounded-2xl border ${
          isCompliant ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/15 border-red-500/40 animate-pulse'
        }`}>
          <span className="text-[10px] font-bold uppercase text-slate-500 block">Landing Clearance</span>
          <div className={`text-xl font-black font-mono mt-1 ${
            isCompliant ? 'text-emerald-500' : 'text-red-500'
          }`}>
            {isCompliant ? 'LEGAL (GO)' : 'OVERRUN (NO-GO)'}
          </div>
          <span className="text-[10px] font-mono">
            Margin: {marginFt >= 0 ? `+${marginFt}` : marginFt} ft
          </span>
        </div>
      </div>

      {/* Main Visualizer Stage */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8 relative overflow-hidden space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <PlaneLanding className="text-amber-400" size={20} />
              Runway Environment & Stopping Distances
            </h3>
            <p className="text-xs text-slate-400">
              Threshold Screen Height: 50 ft | Scale: 0 to {Math.round(maxDisplayDistanceFt).toLocaleString()} ft
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400">Surface State:</span>
            <span className={`px-3 py-1 rounded-lg text-xs font-mono font-bold ${
              condition === 'DRY'
                ? 'bg-slate-800 text-slate-300'
                : condition === 'WET'
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {condition} RUNWAY ({landingCalc.factorMultiplier.toFixed(2)}× LDR)
            </span>
          </div>
        </div>

        {/* Overrun Warning Banner */}
        {!isCompliant && (
          <div className="bg-red-600/90 text-white px-4 py-2.5 rounded-xl border border-red-400 text-xs font-bold shadow-lg flex items-center gap-2 animate-bounce">
            <ShieldAlert size={18} />
            <span>CRITICAL DISPATCH VIOLATION: Required Landing Distance ({requiredDistanceFt} ft) exceeds available LDA ({ldaFt} ft) by {Math.abs(marginFt)} ft!</span>
          </div>
        )}

        {/* Visual Runway Field Canvas */}
        <div className="relative w-full h-80 bg-slate-900/60 rounded-2xl border border-slate-800 p-6 flex flex-col justify-end overflow-hidden">
          
          {/* Approach Slope Line (3 degree glidepath into 50 ft screen height) */}
          <div className="absolute top-8 left-0 w-36 border-b-2 border-dashed border-sky-400 transform origin-bottom-right rotate-[6deg] opacity-70" />

          {/* Screen Height 50 ft Marker at Threshold */}
          <div className="absolute left-10 bottom-28 h-20 border-l-2 border-dashed border-slate-400 flex flex-col justify-start">
            <div className="bg-slate-800 border border-slate-600 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded shadow whitespace-nowrap -ml-6 -mt-3">
              50 ft Screen Height
            </div>
          </div>

          {/* Runway Physical Surface */}
          <div className="relative w-full h-16 flex items-center mb-16">
            <div
              className={`h-full border-y-2 relative flex items-center shadow-inner transition-colors duration-500 ${
                condition === 'DRY'
                  ? 'bg-slate-800 border-slate-700'
                  : condition === 'WET'
                  ? 'bg-sky-950/70 border-sky-600/60'
                  : 'bg-slate-700/80 border-cyan-400/60'
              }`}
              style={{ width: `${ldaPct}%` }}
            >
              {/* Runway Centerline */}
              <div className="w-full h-1 border-t-2 border-dashed border-white/50 absolute top-1/2 -translate-y-1/2" />

              {/* Threshold Piano Keys Marking */}
              <div className="absolute left-1 top-1 bottom-1 w-3 border-r-4 border-white/80" />

              {/* Touchdown Zone (TDZ) Markings (typically 1,000 ft from threshold) */}
              <div className="absolute left-[15%] top-2 bottom-2 w-10 bg-white/40 flex items-center justify-center">
                <span className="text-[8px] font-mono text-slate-300 font-bold">TDZ</span>
              </div>

              {/* End of LDA Bar */}
              <div className="absolute right-1 top-1 bottom-1 w-3 border-l-4 border-red-500/80" />

              <div className="absolute -top-5 left-1 text-[10px] font-mono font-bold text-slate-400">
                THRESHOLD (0 ft)
              </div>
              <div className="absolute -top-5 right-1 text-[10px] font-mono font-bold text-slate-400">
                RUNWAY END ({ldaFt} ft)
              </div>
            </div>
          </div>

          {/* Distance Indicator Bars */}
          <div className="relative w-full space-y-1 mb-2 text-[10px] font-mono">
            {/* LDA Bar */}
            <div className="relative h-4 bg-slate-800 border-l border-r border-slate-500 flex items-center justify-center text-slate-300" style={{ width: `${ldaPct}%` }}>
              LDA: {ldaFt} ft
            </div>

            {/* Factored LDR Bar */}
            <div
              className={`relative h-4 border-l border-r flex items-center justify-center transition-all ${
                isCompliant ? 'bg-amber-950/70 border-amber-500 text-amber-300' : 'bg-red-950/80 border-red-500 text-red-300'
              }`}
              style={{ width: `${Math.min(100, ldrPct)}%` }}
            >
              Factored LDR ({landingCalc.factorMultiplier.toFixed(2)}×): {requiredDistanceFt} ft
            </div>

            {/* Actual Landing Distance (ALD) Bar */}
            <div className="relative h-4 bg-emerald-950/70 border-l border-r border-emerald-500 flex items-center justify-center text-emerald-300" style={{ width: `${Math.min(100, aldPct)}%` }}>
              Actual Landing Distance (ALD): {actualDistanceFt} ft
            </div>
          </div>

          {/* Airplane Animated Landing Touchdown and Rollout */}
          <motion.div
            className="absolute z-20 flex flex-col items-center pointer-events-none"
            initial={{ left: '0%', bottom: '7rem', rotate: -3 }}
            animate={{
              left: ['0%', '15%', `${Math.min(95, aldPct)}%`],
              bottom: ['7rem', '5.5rem', '5.5rem'],
              rotate: [-3, 0, 0]
            }}
            transition={{
              duration: 4.5,
              ease: "easeOut",
              repeat: Infinity,
              repeatDelay: 2
            }}
            key={`${selectedAircraft}-${condition}-${landingWeightKg}-${ldaFt}`}
          >
            <div className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" style={{ transform: 'scaleX(-1)' }}>
              <PlaneLanding size={34} className={condition === 'CONTAMINATED' ? 'text-red-400' : 'text-amber-400'} />
            </div>
          </motion.div>

        </div>

      </div>

      {/* Interactive Controls & EASA Standard Regulatory Rules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Sliders & Condition Selectors */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-5">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders size={18} className="text-amber-500" />
              Landing Operational Parameters
            </h3>

            {/* Runway Condition Buttons */}
            <div>
              <label className="text-xs font-bold uppercase text-slate-500 block mb-2">Runway Surface State</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => setCondition('DRY')}
                  className={`p-3 rounded-xl font-bold text-xs text-left border transition-all ${
                    condition === 'DRY'
                      ? 'bg-slate-800 text-white border-slate-700 shadow'
                      : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="font-bold text-sm">Dry Runway</div>
                  <div className="text-[10px] font-normal opacity-80 mt-0.5">Factor: 1.667× (The 60% Rule)</div>
                </button>

                <button
                  onClick={() => setCondition('WET')}
                  className={`p-3 rounded-xl font-bold text-xs text-left border transition-all ${
                    condition === 'WET'
                      ? 'bg-sky-600 text-white border-sky-500 shadow'
                      : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="font-bold text-sm">Wet Runway</div>
                  <div className="text-[10px] font-normal opacity-80 mt-0.5">Factor: 1.917× (Dry × 1.15)</div>
                </button>

                <button
                  onClick={() => setCondition('CONTAMINATED')}
                  className={`p-3 rounded-xl font-bold text-xs text-left border transition-all ${
                    condition === 'CONTAMINATED'
                      ? 'bg-red-600 text-white border-red-500 shadow'
                      : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="font-bold text-sm">Contaminated</div>
                  <div className="text-[10px] font-normal opacity-80 mt-0.5">Factor: 2.333× (&gt;3mm water/ice)</div>
                </button>
              </div>
            </div>

            {/* Landing Distance Available (LDA) */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-500">Landing Distance Available (LDA)</span>
                <span className="font-mono">{ldaFt.toLocaleString()} ft</span>
              </div>
              <input
                type="range"
                min={3000}
                max={12000}
                step={100}
                value={ldaFt}
                onChange={(e) => setLdaFt(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>3,000 ft (Short)</span>
                <span>7,500 ft (Standard)</span>
                <span>12,000 ft (Major Hub)</span>
              </div>
            </div>

            {/* Landing Weight */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-500">Aircraft Landing Weight</span>
                <span className="font-mono">{landingWeightKg.toLocaleString()} kg ({Math.round(landingWeightKg * 2.20462).toLocaleString()} lbs)</span>
              </div>
              <input
                type="range"
                min={selectedAircraft === 'A320' ? 45000 : 2500}
                max={maxLwKg}
                step={selectedAircraft === 'A320' ? 500 : 50}
                value={landingWeightKg}
                onChange={(e) => setLandingWeightKg(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            {/* Headwind & Runway Slope */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-500">Headwind</span>
                  <span className="font-mono">{headwindKts} kt</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={30}
                  step={2}
                  value={headwindKts}
                  onChange={(e) => setHeadwindKts(Number(e.target.value))}
                  className="w-full accent-sky-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-500">Runway Slope</span>
                  <span className="font-mono">{runwaySlopePct > 0 ? `+${runwaySlopePct}% Up` : `${runwaySlopePct}% Down`}</span>
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
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: EASA Ch 09 Theory & Regulatory Standards */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* The 60% Rule Card */}
          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
            <h4 className="font-bold text-amber-500 text-sm flex items-center gap-2">
              <Scale size={18} />
              The 60% Rule for Class A Turbojets (CS-25 / EASA CAT.POL.A.230)
            </h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              At the destination airport on a dry runway, a commercial turbojet must be able to land from <strong>50 ft screen height</strong> and come to a complete stop within <strong>60% of the Landing Distance Available (LDA)</strong>:
            </p>
            <div className="p-3 bg-slate-900 rounded-xl font-mono text-xs text-amber-400 space-y-1">
              <div>ALD ≤ 0.60 × LDA</div>
              <div>LDR_dry = ALD / 0.60 = 1.667 × ALD</div>
              <div>LDA ≥ 1.667 × ALD</div>
            </div>
            <p className="text-[11px] text-slate-500">
              The remaining 40% margin accounts for pilot flare variations, ground effect float, late touchdown, or minor system degradation.
            </p>
          </div>

          {/* Wet & Contaminated Factoring */}
          <div className="p-5 rounded-2xl bg-sky-500/10 border border-sky-500/30 space-y-3">
            <h4 className="font-bold text-sky-500 text-sm flex items-center gap-2">
              <Waves size={18} />
              Wet & Contaminated Runway Factors
            </h4>
            <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <div>
                <strong>Wet Runway (115% of Dry):</strong> The regulatory LDR is multiplied by an additional 1.15:
                <div className="font-mono text-sky-400 mt-0.5">LDR_wet = LDR_dry × 1.15 = 1.917 × ALD</div>
              </div>
              <div className="pt-2 border-t border-sky-500/20">
                <strong>Contaminated Runway (&gt;3 mm water, slush, ice):</strong> Severe friction loss and dynamic aquaplaning risk.
                Dynamic aquaplaning speed formula:
                <div className="font-mono text-sky-400 mt-0.5">V_P ≈ 9 × √(Tire Pressure in psi)</div>
                Standard factoring requires at least <strong>1.40 × LDR_dry ≈ 2.333 × ALD</strong>, and flexible takeoff thrust is strictly forbidden!
              </div>
            </div>
          </div>

          {/* V-Speed Hierarchy Card */}
          <div className="p-5 rounded-2xl bg-purple-500/10 border border-purple-500/30 space-y-2">
            <h4 className="font-bold text-purple-400 text-sm flex items-center gap-2">
              <Gauge size={18} />
              Landing V-Speed Certification: VREF ≥ 1.23 VSR0
            </h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              VREF is the reference landing speed at 50 ft above the runway threshold in the landing configuration. It must be at least <strong>1.23 times the 1-g stall speed (VSR0)</strong> to ensure adequate aerodynamic stall margin during the landing flare.
            </p>
          </div>

        </div>

      </div>

      {/* Student Quiz */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-500/30 rounded-3xl p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl">
            <HelpCircle size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">ATPL 032 Knowledge Check: Landing Distance</h3>
            <p className="text-xs text-slate-400">Class A Transport Jet Landing Regulations</p>
          </div>
        </div>

        <p className="text-sm text-slate-200 font-semibold">
          Question: An Airbus A320 has an unfactored Actual Landing Distance (ALD) of 3,000 ft at its destination aerodrome. What is the minimum required Landing Distance Available (LDA) for dispatch on a dry runway, and on a wet runway?
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {[
            { id: 1, text: "A) Dry: 5,000 ft (1.67x), Wet: 5,750 ft (1.92x)", correct: true },
            { id: 2, text: "B) Dry: 3,750 ft (1.25x), Wet: 4,312 ft (1.44x)", correct: false },
            { id: 3, text: "C) Dry: 4,500 ft (1.50x), Wet: 5,175 ft (1.72x)", correct: false },
            { id: 4, text: "D) Dry: 3,000 ft (1.00x), Wet: 3,450 ft (1.15x)", correct: false },
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setQuizAnswer(opt.id)}
              className={`p-4 rounded-xl text-left border transition-all ${
                quizAnswer === opt.id
                  ? opt.correct
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-bold'
                    : 'border-red-500 bg-red-500/10 text-red-300 font-bold'
                  : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
              }`}
            >
              {opt.text}
            </button>
          ))}
        </div>

        {quizAnswer !== null && (
          <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
            quizAnswer === 1
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}>
            <div className="flex items-start gap-2">
              {quizAnswer === 1 ? (
                <CheckCircle2 size={18} className="shrink-0 text-emerald-400 mt-0.5" />
              ) : (
                <AlertTriangle size={18} className="shrink-0 text-red-400 mt-0.5" />
              )}
              <div>
                <strong>{quizAnswer === 1 ? 'Correct! ' : 'Incorrect. '}</strong>
                Under CS-25 60% rule: LDR_dry = ALD / 0.60 = 3,000 / 0.6 = <strong>5,000 ft</strong>.
                For wet runway: LDR_wet = LDR_dry × 1.15 = 5,000 × 1.15 = <strong>5,750 ft</strong> (or 1.917 × ALD).
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default LandingPerf;
