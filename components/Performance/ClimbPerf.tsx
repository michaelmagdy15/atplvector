import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, MountainSnow, Wind, Target, Plane, ShieldAlert,
  AlertTriangle, CheckCircle2, Sliders, Info, Mountain, ArrowRight,
  Flame, Gauge, Thermometer
} from 'lucide-react';
import {
  AIRCRAFT_PRESETS,
  calculateAtmosphere,
  calculateClimbPerformance,
  evaluateObstacleClearance,
  AtmosphericConditions,
  AircraftPreset
} from '../../lib/aviation/aircraftPerformance';

export const ClimbPerf: React.FC = () => {
  // Aircraft Selection
  const [selectedAircraftId, setSelectedAircraftId] = useState<string>('baron_g58');
  const aircraft: AircraftPreset = AIRCRAFT_PRESETS[selectedAircraftId] || AIRCRAFT_PRESETS.BARON_G58;

  // Weight
  const [weightLbs, setWeightLbs] = useState<number>(aircraft.maxTakeoffWeightLbs);

  // Atmospheric conditions
  const [elevationFt, setElevationFt] = useState<number>(5660); // Default to Samedan elevation
  const [qnhHpa, setQnhHpa] = useState<number>(1010);
  const [oatC, setOatC] = useState<number>(28); // Hot summer day
  const [windKts, setWindKts] = useState<number>(-4); // Tailwind down valley

  // Flight condition
  const [airspeedIasKts, setAirspeedIasKts] = useState<number>(aircraft.speeds.vyIas);
  const [isOei, setIsOei] = useState<boolean>(false); // One Engine Inoperative

  // Obstacle (e.g. Alpine valley ridge)
  const [obstacleDistanceNm, setObstacleDistanceNm] = useState<number>(2.5); // 2.5 NM
  const [obstacleHeightAmslFt, setObstacleHeightAmslFt] = useState<number>(6800); // Mountain pass ridge

  // Update weight & speed defaults when aircraft changes
  const handleAircraftChange = (id: string) => {
    setSelectedAircraftId(id);
    const newAc = AIRCRAFT_PRESETS[id];
    if (newAc) {
      setWeightLbs(newAc.maxTakeoffWeightLbs);
      setAirspeedIasKts(newAc.speeds.vyIas);
      setIsOei(false);
    }
  };

  // Conditions object
  const conditions: AtmosphericConditions = useMemo(() => ({
    elevationFt,
    qnhHpa,
    oatC,
    windKts,
    surface: 'PAVED_DRY',
    runwaySlopePct: 0
  }), [elevationFt, qnhHpa, oatC, windKts]);

  // Physics calculations
  const atmosphere = useMemo(() => calculateAtmosphere(conditions), [conditions]);
  const climbResult = useMemo(() => {
    return calculateClimbPerformance(aircraft, weightLbs, conditions, airspeedIasKts, isOei);
  }, [aircraft, weightLbs, conditions, airspeedIasKts, isOei]);

  // Obstacle clearance evaluation
  const obstacleDistanceFt = obstacleDistanceNm * 6076.12;
  const obstacleClearance = useMemo(() => {
    return evaluateObstacleClearance(
      elevationFt,
      aircraft.screenHeightFt,
      climbResult.groundGradientPct,
      {
        distanceFromDerFt: obstacleDistanceFt,
        elevationFt: obstacleHeightAmslFt
      }
    );
  }, [elevationFt, aircraft.screenHeightFt, climbResult.groundGradientPct, obstacleDistanceFt, obstacleHeightAmslFt]);

  // Quick preset loader
  const applyPreset = (preset: 'ISA_SL' | 'SAMEDAN_HOT' | 'INNSBRUCK') => {
    if (preset === 'ISA_SL') {
      setElevationFt(0);
      setQnhHpa(1013);
      setOatC(15);
      setWindKts(0);
      setIsOei(false);
      setObstacleDistanceNm(3.0);
      setObstacleHeightAmslFt(1000);
    } else if (preset === 'SAMEDAN_HOT') {
      setElevationFt(5660);
      setQnhHpa(1010);
      setOatC(28);
      setWindKts(-4);
      setSelectedAircraftId('baron_g58');
      setWeightLbs(5500);
      setAirspeedIasKts(92); // Vx
      setObstacleDistanceNm(2.5);
      setObstacleHeightAmslFt(6800);
    } else if (preset === 'INNSBRUCK') {
      setElevationFt(1900);
      setQnhHpa(1015);
      setOatC(32);
      setWindKts(5);
      setSelectedAircraftId('citation_mustang');
      setWeightLbs(8645);
      setAirspeedIasKts(120);
      setObstacleDistanceNm(4.0);
      setObstacleHeightAmslFt(4500);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-500/10 dark:bg-indigo-500/20 p-4 rounded-2xl text-indigo-500 border border-indigo-500/30">
            <TrendingUp size={36} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
                EASA ATPL 032
              </span>
              <span className="text-xs text-slate-500 font-mono">Gradient vs Rate Physics & Obstacle Geometry</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              Climb Performance & Obstacle Clearance
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base mt-1">
              Angle (Vx) vs Rate (Vy), Excess Thrust (T - D)/W, and Valley Terrain Clearance
            </p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => applyPreset('ISA_SL')}
            className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors"
          >
            Sea Level ISA
          </button>
          <button
            onClick={() => applyPreset('SAMEDAN_HOT')}
            className="px-3 py-1.5 text-xs font-bold rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 transition-colors flex items-center gap-1.5"
          >
            <Mountain size={14} /> Samedan Alps (+28°C)
          </button>
          <button
            onClick={() => applyPreset('INNSBRUCK')}
            className="px-3 py-1.5 text-xs font-bold rounded-lg border border-purple-500/40 bg-purple-500/10 text-purple-700 dark:text-purple-300 hover:bg-purple-500/20 transition-colors"
          >
            Innsbruck Valley
          </button>
        </div>
      </div>

      {/* Atmospheric & Performance Status Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
            <Thermometer size={12} /> Density Alt (DA)
          </span>
          <div className="text-xl font-black font-mono text-slate-900 dark:text-white mt-1">
            {Math.round(atmosphere.densityAltFt).toLocaleString()} ft
          </div>
          <span className="text-[10px] text-amber-500 font-bold">
            ΔISA: {atmosphere.deltaIsaC >= 0 ? `+${atmosphere.deltaIsaC.toFixed(1)}` : atmosphere.deltaIsaC.toFixed(1)}°C
          </span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
            Climb Gradient (Air)
          </span>
          <div className={`text-xl font-black font-mono mt-1 ${
            climbResult.gradientPct <= 0 ? 'text-red-500' : climbResult.gradientPct < 3.0 ? 'text-amber-500' : 'text-emerald-500'
          }`}>
            {climbResult.gradientPct.toFixed(1)}%
          </div>
          <span className="text-[10px] text-slate-400">
            sin(γ) = (T - D)/W
          </span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
            Ground Gradient
          </span>
          <div className={`text-xl font-black font-mono mt-1 ${
            climbResult.groundGradientPct <= 0 ? 'text-red-500' : 'text-indigo-400'
          }`}>
            {climbResult.groundGradientPct.toFixed(1)}%
          </div>
          <span className="text-[10px] text-slate-400">
            ROC / Groundspeed
          </span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase text-slate-500">
            Rate of Climb (ROC)
          </span>
          <div className={`text-xl font-black font-mono mt-1 ${
            climbResult.rocFpm <= 0 ? 'text-red-500' : 'text-slate-900 dark:text-white'
          }`}>
            {climbResult.rocFpm.toLocaleString()} <span className="text-xs font-normal text-slate-400">fpm</span>
          </div>
          <span className="text-[10px] text-slate-400">
            Excess Power / Weight
          </span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase text-slate-500">
            Thrust vs Drag
          </span>
          <div className="text-xl font-black font-mono text-slate-900 dark:text-white mt-1">
            {climbResult.excessThrustLbs > 0 ? `+${climbResult.excessThrustLbs}` : climbResult.excessThrustLbs} lbs
          </div>
          <span className="text-[10px] text-slate-400">
            T: {climbResult.thrustLbs} | D: {climbResult.dragLbs}
          </span>
        </div>

        <div className={`p-4 rounded-2xl border ${
          obstacleClearance.isCleared
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
            : 'bg-red-500/15 border-red-500/40 text-red-600 dark:text-red-400 animate-pulse'
        }`}>
          <span className="text-[10px] font-bold uppercase">
            Obstacle Clearance
          </span>
          <div className="text-xl font-black font-mono mt-1">
            {obstacleClearance.clearanceMarginFt >= 0 ? `+${obstacleClearance.clearanceMarginFt}` : obstacleClearance.clearanceMarginFt} ft
          </div>
          <span className="text-[10px] font-bold">
            {obstacleClearance.isCleared ? 'CLEARED (>= 50ft)' : 'TERRAIN IMPACT'}
          </span>
        </div>
      </div>

      {/* Main Visualizer: Alpine Mountain Terrain & Flight Path Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[460px]">
          
          {/* Top Status Indicators */}
          <div className="flex flex-wrap items-center justify-between gap-4 z-20">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-400">
                Aerodrome: {elevationFt}' AMSL
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-xs font-mono font-bold text-slate-400">
                Obstacle: {obstacleHeightAmslFt}' AMSL @ {obstacleDistanceNm} NM
              </span>
            </div>

            {/* Multi-Engine OEI Failure Toggle */}
            {aircraft.enginesCount > 1 && (
              <button
                onClick={() => setIsOei(!isOei)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                  isOei
                    ? 'bg-red-600 text-white border-red-400 shadow-lg shadow-red-600/30'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                <Flame size={14} className={isOei ? 'animate-bounce text-amber-300' : 'text-slate-400'} />
                {isOei ? 'One Engine Failed (OEI)' : 'Simulate Engine Out (OEI)'}
              </button>
            )}
          </div>

          {/* SVG Flight Path and Terrain Canvas */}
          <div className="relative w-full h-72 my-4 z-10 flex items-end">
            
            {/* Mountain Terrain Obstacle SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 400" preserveAspectRatio="none">
              <defs>
                <linearGradient id="mountainGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#334155" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0f172a" stopOpacity="0.95" />
                </linearGradient>
              </defs>

              {/* Valley Floor */}
              <rect x="0" y="360" width="1000" height="40" fill="#1e293b" />
              
              {/* Mountain Profile */}
              {/* Runway DER starts at x=100. Obstacle placed at x=750 */}
              <polygon
                points="550,360 750,140 850,220 950,110 1000,360"
                fill="url(#mountainGrad)"
                stroke="#64748b"
                strokeWidth="2"
              />

              {/* Obstacle Peak Red Beacon & Marker */}
              <circle cx="750" cy="140" r="5" fill="#ef4444" className="animate-ping origin-center" />
              <circle cx="750" cy="140" r="4" fill="#ef4444" />
              <line x1="750" y1="140" x2="750" y2="360" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

              {/* 50ft Clearance Buffer Plane above obstacle */}
              <line x1="710" y1="115" x2="790" y2="115" stroke="#10b981" strokeWidth="1.5" strokeDasharray="2 2" />
              <text x="750" y="105" fill="#10b981" fontSize="12" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                +50' Buffer
              </text>

              {/* Flight Trajectory Line */}
              {/* Start at DER x=100, y=340. Slope based on groundGradientPct */}
              {/* A 10% gradient reaches y=140 (dy=200) over dx=650 */}
              {(() => {
                const startX = 100;
                const startY = 340;
                const targetX = 750;
                // gradient scaling: 8% gradient reaches obstacle peak height
                const gradientScale = climbResult.groundGradientPct / 8.0;
                const aircraftYAtObs = startY - 200 * gradientScale;
                const endX = 950;
                const endY = startY - (850 / 650) * (200 * gradientScale);
                const isHit = aircraftYAtObs >= 140;

                return (
                  <>
                    <line
                      x1={startX}
                      y1={startY}
                      x2={endX}
                      y2={endY}
                      stroke={isHit ? '#ef4444' : '#10b981'}
                      strokeWidth="3"
                      strokeDasharray={isHit ? "5 3" : "none"}
                    />
                    {/* Aircraft Position at Obstacle Cross */}
                    <circle
                      cx={targetX}
                      cy={aircraftYAtObs}
                      r="6"
                      fill={isHit ? '#ef4444' : '#10b981'}
                      className="drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                    />
                  </>
                );
              })()}
            </svg>

            {/* Labels and Callouts */}
            <div className="absolute left-6 bottom-4 text-[11px] font-mono text-slate-400">
              Runway DER (0 NM)
            </div>
            <div className="absolute right-36 bottom-4 text-[11px] font-mono text-slate-400 text-center">
              Obstacle ({obstacleDistanceNm} NM)
              <div className="text-red-400 font-bold">{obstacleHeightAmslFt} ft AMSL</div>
            </div>
          </div>

          {/* Airspeed Controls & Vx / Vy Selector */}
          <div className="w-full bg-slate-900 border border-slate-800 p-4 rounded-2xl z-20 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
                <Sliders size={14} /> Pitch & Indicated Airspeed (IAS)
              </label>
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-bold text-white bg-slate-800 px-3 py-1 rounded-lg">
                  {airspeedIasKts} kts IAS
                </span>
                <span className="font-mono text-xs text-sky-400">
                  TAS: {Math.round(climbResult.vxTasKts * (airspeedIasKts / climbResult.vxIasKts))} kts
                </span>
              </div>
            </div>

            {/* Slider with Vx and Vy quick buttons */}
            <div className="space-y-2">
              <input
                type="range"
                min={aircraft.speeds.vs1Ias}
                max={aircraft.speeds.vyIas + 40}
                step={1}
                value={airspeedIasKts}
                onChange={(e) => setAirspeedIasKts(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <div className="flex justify-between items-center text-[10px] font-mono">
                <button
                  onClick={() => setAirspeedIasKts(climbResult.vxIasKts)}
                  className={`px-2 py-1 rounded font-bold border transition-colors ${
                    airspeedIasKts === climbResult.vxIasKts
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                      : 'border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  Vx = {climbResult.vxIasKts} kt (Best Angle)
                </button>

                <button
                  onClick={() => setAirspeedIasKts(climbResult.vyIasKts)}
                  className={`px-2 py-1 rounded font-bold border transition-colors ${
                    airspeedIasKts === climbResult.vyIasKts
                      ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                      : 'border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  Vy = {climbResult.vyIasKts} kt (Best Rate)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Aerodynamic Derivation & Obstacle Clearances */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Obstacle Clearance Decision Card */}
          <div className={`p-6 rounded-3xl border shadow-sm ${
            obstacleClearance.isCleared
              ? 'bg-emerald-500/10 border-emerald-500/30'
              : 'bg-red-500/15 border-red-500/40 animate-pulse'
          }`}>
            <h3 className="font-bold text-lg flex items-center justify-between text-slate-900 dark:text-white mb-3">
              <span>Terrain Margin Analysis</span>
              {obstacleClearance.isCleared ? (
                <CheckCircle2 className="text-emerald-500" size={24} />
              ) : (
                <AlertTriangle className="text-red-500" size={24} />
              )}
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between pb-2 border-b border-white/10">
                <span className="text-slate-500">Aircraft Alt at Obstacle:</span>
                <span className="font-mono font-bold text-white">{obstacleClearance.aircraftAltitudeAtObstacleAmmsl} ft AMSL</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-white/10">
                <span className="text-slate-500">Obstacle Peak Elevation:</span>
                <span className="font-mono font-bold text-white">{obstacleHeightAmslFt} ft AMSL</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-white/10">
                <span className="text-slate-500">Net Vertical Clearance:</span>
                <span className={`font-mono font-bold ${obstacleClearance.clearanceMarginFt >= 50 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {obstacleClearance.clearanceMarginFt} ft
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-500">Required Gradient to Clear:</span>
                <span className="font-mono font-bold text-amber-400">
                  {obstacleClearance.requiredGradientToClearPct}% minimum
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 text-xs leading-relaxed text-slate-400">
              {obstacleClearance.isCleared ? (
                <span className="text-emerald-400 font-semibold">
                  Safe Departure: Current climb ground gradient ({climbResult.groundGradientPct.toFixed(1)}%) satisfies ICAO/EASA valley obstacle clearance margins.
                </span>
              ) : (
                <span className="text-red-400 font-semibold">
                  UNSAFE DEPARTURE: Aircraft will impact or breach the 50 ft clearance plane. Shed weight or depart at lower ambient temperature!
                </span>
              )}
            </div>
          </div>

          {/* Aerodynamic Theory Callout Card */}
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Target size={16} className="text-indigo-500" />
              Vx vs Vy Aerodynamic Laws
            </h4>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <strong className="text-emerald-500 block mb-1">Vx (Best Angle of Climb)</strong>
                Maximum altitude gained per unit horizontal distance. Occurs where <strong>Excess Thrust (T - D)</strong> is greatest. Used strictly for obstacle clearance.
              </div>

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <strong className="text-indigo-500 block mb-1">Vy (Best Rate of Climb)</strong>
                Maximum altitude gained per unit time. Occurs where <strong>Excess Power (P_avail - P_req)</strong> is greatest. Used to reach en-route cruising levels rapidly.
              </div>

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <strong className="text-amber-500 block mb-1">Altitude Effect on Vx & Vy</strong>
                As density altitude increases, available power and thrust decrease. $V_x$ (IAS) increases slightly, while $V_y$ (IAS) decreases until they converge at the <strong>Absolute Ceiling</strong> (where ROC = 0).
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ClimbPerf;
