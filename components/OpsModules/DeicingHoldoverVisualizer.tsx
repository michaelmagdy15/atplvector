import React, { useState } from 'react';
import { 
  ThermometerSnowflake, Droplets, AlertTriangle, ShieldCheck, 
  Clock, CheckCircle2, XCircle, Info, Plane, AlertOctagon, HelpCircle 
} from 'lucide-react';
import { DEICING_HOLDOVER_DATA } from '../../data/courseData';

type WeatherCondition = 'frost' | 'freezing_fog' | 'light_snow' | 'moderate_snow' | 'freezing_drizzle' | 'rain_cold_soaked';

interface HotTableEntry {
  aboveZero: string;
  zeroToMinus3: string;
  minus3ToMinus10: string;
  belowMinus10: string;
}

const HOT_ESTIMATES: Record<string, Record<WeatherCondition, HotTableEntry>> = {
  'Type I': {
    frost: { aboveZero: '45 min', zeroToMinus3: '30 min', minus3ToMinus10: '15 min', belowMinus10: '10 min' },
    freezing_fog: { aboveZero: '12-25 min', zeroToMinus3: '8-15 min', minus3ToMinus10: '5-10 min', belowMinus10: '2-5 min' },
    light_snow: { aboveZero: '15-25 min', zeroToMinus3: '10-20 min', minus3ToMinus10: '6-12 min', belowMinus10: '4-8 min' },
    moderate_snow: { aboveZero: '10-15 min', zeroToMinus3: '6-10 min', minus3ToMinus10: '3-6 min', belowMinus10: '2-4 min' },
    freezing_drizzle: { aboveZero: '8-15 min', zeroToMinus3: '5-9 min', minus3ToMinus10: '2-5 min', belowMinus10: 'CAUTION' },
    rain_cold_soaked: { aboveZero: '10-20 min', zeroToMinus3: '5-10 min', minus3ToMinus10: 'N/A', belowMinus10: 'N/A' },
  },
  'Type II': {
    frost: { aboveZero: '12-18 hrs', zeroToMinus3: '8-12 hrs', minus3ToMinus10: '4-6 hrs', belowMinus10: '2-3 hrs' },
    freezing_fog: { aboveZero: '50-90 min', zeroToMinus3: '35-65 min', minus3ToMinus10: '20-40 min', belowMinus10: '10-20 min' },
    light_snow: { aboveZero: '40-70 min', zeroToMinus3: '30-50 min', minus3ToMinus10: '15-30 min', belowMinus10: '10-15 min' },
    moderate_snow: { aboveZero: '25-40 min', zeroToMinus3: '15-30 min', minus3ToMinus10: '10-20 min', belowMinus10: '5-10 min' },
    freezing_drizzle: { aboveZero: '30-60 min', zeroToMinus3: '20-40 min', minus3ToMinus10: '10-20 min', belowMinus10: 'CAUTION' },
    rain_cold_soaked: { aboveZero: '45-90 min', zeroToMinus3: '20-40 min', minus3ToMinus10: 'N/A', belowMinus10: 'N/A' },
  },
  'Type III': {
    frost: { aboveZero: '6-10 hrs', zeroToMinus3: '4-6 hrs', minus3ToMinus10: '2-4 hrs', belowMinus10: '1-2 hrs' },
    freezing_fog: { aboveZero: '35-60 min', zeroToMinus3: '25-45 min', minus3ToMinus10: '15-30 min', belowMinus10: '8-15 min' },
    light_snow: { aboveZero: '30-50 min', zeroToMinus3: '20-40 min', minus3ToMinus10: '12-25 min', belowMinus10: '8-12 min' },
    moderate_snow: { aboveZero: '15-30 min', zeroToMinus3: '10-20 min', minus3ToMinus10: '8-15 min', belowMinus10: '4-8 min' },
    freezing_drizzle: { aboveZero: '20-40 min', zeroToMinus3: '15-30 min', minus3ToMinus10: '8-15 min', belowMinus10: 'CAUTION' },
    rain_cold_soaked: { aboveZero: '30-60 min', zeroToMinus3: '15-30 min', minus3ToMinus10: 'N/A', belowMinus10: 'N/A' },
  },
  'Type IV': {
    frost: { aboveZero: '18-24 hrs', zeroToMinus3: '12-18 hrs', minus3ToMinus10: '6-12 hrs', belowMinus10: '3-6 hrs' },
    freezing_fog: { aboveZero: '75-140 min', zeroToMinus3: '50-100 min', minus3ToMinus10: '30-60 min', belowMinus10: '15-30 min' },
    light_snow: { aboveZero: '60-110 min', zeroToMinus3: '45-80 min', minus3ToMinus10: '25-50 min', belowMinus10: '15-25 min' },
    moderate_snow: { aboveZero: '35-60 min', zeroToMinus3: '25-45 min', minus3ToMinus10: '15-30 min', belowMinus10: '10-15 min' },
    freezing_drizzle: { aboveZero: '40-80 min', zeroToMinus3: '30-60 min', minus3ToMinus10: '15-30 min', belowMinus10: 'CAUTION' },
    rain_cold_soaked: { aboveZero: '60-120 min', zeroToMinus3: '30-60 min', minus3ToMinus10: 'N/A', belowMinus10: 'N/A' },
  }
};

const DeicingHoldoverVisualizer: React.FC = () => {
  const [selectedFluid, setSelectedFluid] = useState<'Type I' | 'Type II' | 'Type III' | 'Type IV'>('Type IV');
  const [weather, setWeather] = useState<WeatherCondition>('light_snow');
  const [tempRange, setTempRange] = useState<'aboveZero' | 'zeroToMinus3' | 'minus3ToMinus10' | 'belowMinus10'>('zeroToMinus3');
  const [rotationSpeed, setRotationSpeed] = useState<number>(135); // kt Vr
  const [minutesSinceStart, setMinutesSinceStart] = useState<number>(25);

  const fluidInfo = DEICING_HOLDOVER_DATA.find(f => f.fluidType === selectedFluid)!;
  const currentHotEstimate = HOT_ESTIMATES[selectedFluid][weather][tempRange];

  // Rotation speed check
  const isVrCompatible = () => {
    if (selectedFluid === 'Type II' || selectedFluid === 'Type IV') {
      return rotationSpeed >= 100;
    }
    if (selectedFluid === 'Type III') {
      return rotationSpeed < 100;
    }
    return true; // Type I is compatible with all
  };

  const vrOk = isVrCompatible();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-700 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/20 rounded-xl border border-cyan-500/30 text-cyan-400">
            <ThermometerSnowflake size={32} />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              De-icing, Anti-icing & Holdover Time (HOT)
            </h2>
            <p className="text-slate-400 text-sm">
              EASA Part-CAT.OP.MPA.250 & ICAO Annex 6 • Clean Aircraft Concept & Fluid Shear Dynamics
            </p>
          </div>
        </div>
        <div className="bg-cyan-950/40 border border-cyan-500/30 px-3 py-1.5 rounded-lg flex items-center gap-2">
          <ShieldCheck className="text-cyan-400 w-4 h-4" />
          <span className="text-xs font-bold text-cyan-300">Clean Aircraft Concept</span>
        </div>
      </div>

      {/* Croucher Mental Model Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-cyan-500/10 border-l-4 border-amber-500 p-5 rounded-r-xl border border-slate-700/50">
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-amber-400 w-6 h-6 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-amber-300 font-black text-sm uppercase tracking-wider mb-1">
              CROUCHER CORE MENTAL MODEL: The Clock Starts with the First Drop
            </h4>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
              <strong>The Holdover Time clock begins at the START of the final application step</strong> (the anti-icing step), 
              <strong>NEVER</strong> when spraying completes! Extrapolating or extending Holdover Times beyond table limits is 
              strictly prohibited under Part-CAT without conducting a physical pre-takeoff contamination check.
            </p>
          </div>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Fluid Selector */}
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-700/80">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3">
              1. Select Anti-icing Fluid Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(['Type I', 'Type II', 'Type III', 'Type IV'] as const).map(ft => (
                <button
                  key={ft}
                  onClick={() => setSelectedFluid(ft)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedFluid === ft
                      ? 'bg-cyan-600 border-cyan-400 shadow-lg shadow-cyan-600/20 text-white'
                      : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'
                  }`}
                >
                  <div className="font-bold text-sm">{ft}</div>
                  <div className="text-[10px] opacity-75 mt-0.5">
                    {ft === 'Type I' && 'Orange • Unthickened'}
                    {ft === 'Type II' && 'Clear • Vr >= 100kt'}
                    {ft === 'Type III' && 'Yellow • Vr < 100kt'}
                    {ft === 'Type IV' && 'Green • Long HOT'}
                  </div>
                </button>
              ))}
            </div>

            {/* Selected Fluid Spec Badge */}
            <div className="mt-4 p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs flex flex-wrap gap-4 items-center justify-between">
              <div>
                <span className="text-slate-500 font-bold uppercase text-[10px] block">Fluid Color Code</span>
                <span className="font-bold text-white">{fluidInfo.color}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold uppercase text-[10px] block">Thickened?</span>
                <span className={`font-bold ${fluidInfo.thickened ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {fluidInfo.thickened ? 'Yes (Pseudoplastic)' : 'No (Unthickened)'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 font-bold uppercase text-[10px] block">Minimum Rotation Speed</span>
                <span className="font-bold text-cyan-300">{fluidInfo.minVr}</span>
              </div>
            </div>
          </div>

          {/* Weather Condition & Temperature */}
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-700/80 space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
                2. Active Weather / Precipitation
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'frost', label: 'Frost' },
                  { id: 'freezing_fog', label: 'Freezing Fog' },
                  { id: 'light_snow', label: 'Light Snow' },
                  { id: 'moderate_snow', label: 'Moderate Snow' },
                  { id: 'freezing_drizzle', label: 'Freezing Drizzle' },
                  { id: 'rain_cold_soaked', label: 'Rain on Cold Soaked Wing' },
                ].map(w => (
                  <button
                    key={w.id}
                    onClick={() => setWeather(w.id as WeatherCondition)}
                    className={`p-2.5 rounded-lg border text-xs font-bold transition-all text-left ${
                      weather === w.id
                        ? 'bg-blue-600/30 border-blue-500 text-blue-200'
                        : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
                3. Outside Air Temperature (OAT)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'aboveZero', label: 'Above 0°C' },
                  { id: 'zeroToMinus3', label: '0°C to -3°C' },
                  { id: 'minus3ToMinus10', label: '-3°C to -10°C' },
                  { id: 'belowMinus10', label: 'Below -10°C' },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTempRange(t.id as any)}
                    className={`p-2.5 rounded-lg border text-xs font-bold transition-all text-center ${
                      tempRange === t.id
                        ? 'bg-indigo-600 border-indigo-400 text-white'
                        : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Aircraft Rotation Speed (Vr) Verification */}
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-700/80">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                4. Aircraft Takeoff Rotation Speed (Vr)
              </label>
              <span className="font-mono text-cyan-400 font-bold text-base">{rotationSpeed} kt</span>
            </div>
            <input
              type="range"
              min="50"
              max="180"
              value={rotationSpeed}
              onChange={(e) => setRotationSpeed(Number(e.target.value))}
              className="w-full accent-cyan-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>50 kt (Light Single)</span>
              <span>100 kt (Boundary)</span>
              <span>180 kt (Heavy Jet)</span>
            </div>

            {/* Aerodynamic Shear Warning */}
            <div className={`mt-4 p-3 rounded-xl border flex items-center gap-3 ${
              vrOk
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                : 'bg-red-950/50 border-red-500 text-red-200 animate-pulse'
            }`}>
              {vrOk ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> : <AlertOctagon className="w-5 h-5 text-red-400 shrink-0" />}
              <div className="text-xs">
                {vrOk ? (
                  <span>
                    <strong>Aerodynamic Clearance Valid:</strong> Vr {rotationSpeed} kt is compatible with {selectedFluid} shear-off characteristics.
                  </span>
                ) : (
                  <span>
                    <strong>DANGEROUS FLUID MISMATCH:</strong> {selectedFluid} requires {fluidInfo.minVr}! At {rotationSpeed} kt, 
                    the viscous fluid will NOT blow off the wings, severely degrading maximum lift coefficient and reducing stall margin by up to 30%!
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Results & Live Simulation Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* Estimated HOT Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-6 rounded-2xl border border-cyan-500/30 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 text-cyan-400">
              <Clock size={120} />
            </div>

            <span className="text-[10px] font-bold tracking-widest uppercase text-cyan-400 block mb-1">
              Holdover Time Range (HOT)
            </span>
            <div className="text-4xl md:text-5xl font-black text-white tracking-tight font-mono mb-2">
              {currentHotEstimate}
            </div>
            <p className="text-slate-400 text-xs leading-relaxed mb-6">
              Under {selectedFluid} application in {weather.replace(/_/g, ' ')} at {tempRange.replace(/([A-Z])/g, ' $1').toLowerCase()}.
            </p>

            {/* Holdover Time Countdown Simulator */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold">Time Elapsed Since Start of Anti-icing:</span>
                <span className="font-mono text-amber-400 font-bold">{minutesSinceStart} min</span>
              </div>
              <input
                type="range"
                min="0"
                max="90"
                value={minutesSinceStart}
                onChange={(e) => setMinutesSinceStart(Number(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>0 min (Start of spray)</span>
                <span>45 min</span>
                <span>90 min</span>
              </div>
            </div>

            {/* Protocol Check */}
            <div className="mt-4 pt-4 border-t border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Tactical Status:</span>
                <span className="font-bold text-white">
                  {minutesSinceStart <= 25 ? 'Within Lower HOT Limit' : minutesSinceStart <= 45 ? 'Approaching Upper Limit' : 'HOT Exceeded / Check Required'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Pre-takeoff Check:</span>
                <span className={`font-bold ${minutesSinceStart > 40 ? 'text-amber-400' : 'text-slate-300'}`}>
                  {minutesSinceStart > 40 ? 'MANDATORY (Within 5 min of TO)' : 'Standard Cockpit Visual'}
                </span>
              </div>
            </div>
          </div>

          {/* Clean Aircraft Concept & Cold-Soak Wing */}
          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-700/60 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Info className="text-cyan-400 w-4 h-4" />
              The Clean Aircraft Concept
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              No aircraft shall commence takeoff unless all critical surfaces (wings, horizontal stabilizer, rudder, control tabs, engine cowlings) 
              are completely free from frost, ice, slush, or snow. A surface is contaminated if frost layer exceeds 0.5 mm thickness.
            </p>

            <div className="p-3 bg-amber-950/20 rounded-lg border border-amber-500/30 text-xs text-amber-200">
              <strong>Cold-Soaked Fuel Phenomenon:</strong> When an aircraft lands with large amounts of sub-zero fuel in wing tanks, 
              atmospheric moisture condenses and freezes into clear ice on the upper wing surface, <em>even when outside air temperature is well above freezing (+5°C to +15°C)!</em>
            </div>
          </div>
        </div>
      </div>

      {/* RTFQ Exam Traps Defense Section */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-red-500/30 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <AlertOctagon className="text-red-400" />
          Air Law (010) & Ops (070) RTFQ Exam Traps
        </h3>
        <div className="grid md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h5 className="font-bold text-amber-400 mb-1">When does HOT begin?</h5>
            <p className="text-slate-400 leading-relaxed">
              <strong>TRAP:</strong> Exam questions offer "When de-icing is completed" or "When aircraft taxies". 
              <strong>CORRECT:</strong> The Holdover Time begins at the <em>commencement of the anti-icing application</em> (Step 2 in two-step procedure).
            </p>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h5 className="font-bold text-amber-400 mb-1">Extrapolating Holdover Times</h5>
            <p className="text-slate-400 leading-relaxed">
              <strong>TRAP:</strong> Never extrapolate or assume safety if Holdover Time has expired. 
              <strong>CORRECT:</strong> If HOT is exceeded, takeoff is prohibited unless a complete tactile and visual pre-takeoff contamination check confirms wings remain clean.
            </p>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h5 className="font-bold text-amber-400 mb-1">One-Step vs Two-Step Method</h5>
            <p className="text-slate-400 leading-relaxed">
              <strong>TRAP:</strong> One-step uses heated anti-icing fluid to both clean and protect. 
              <strong>CORRECT:</strong> Two-step uses hot water / Type I to remove contaminants, followed immediately by unheated Type II/IV to provide long-lasting holdover protection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeicingHoldoverVisualizer;
