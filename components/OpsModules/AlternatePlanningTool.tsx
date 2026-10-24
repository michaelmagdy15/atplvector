import React, { useState, useEffect } from 'react';
import { 
  Map, Clock, Plane, AlertCircle, CheckCircle2, 
  XCircle, Fuel, AlertOctagon, HelpCircle, ArrowRight, Shield, AlertTriangle 
} from 'lucide-react';

const AlternatePlanningTool: React.FC = () => {
  const [plannerMode, setPlannerMode] = useState<'destination' | 'takeoff'>('destination');

  // Destination Alternate State
  const [flightDuration, setFlightDuration] = useState<number>(4); // hours
  const [separateRunways, setSeparateRunways] = useState<number>(2); // 1 or 2
  const [destCeiling, setDestCeiling] = useState<number>(2500); // ft
  const [destVisibility, setDestVisibility] = useState<number>(6000); // m
  const [isIsolated, setIsIsolated] = useState<boolean>(false);
  const [hasMetForecast, setHasMetForecast] = useState<boolean>(true);
  const [forecastBelowMinima, setForecastBelowMinima] = useState<boolean>(false);

  // Takeoff Alternate State
  const [departureWeatherBelowMinima, setDepartureWeatherBelowMinima] = useState<boolean>(true);
  const [engineCount, setEngineCount] = useState<2 | 3 | 4>(2);
  const [oeiCruiseSpeed, setOeiCruiseSpeed] = useState<number>(380); // kt TAS
  const [isEtopsApproved, setIsEtopsApproved] = useState<boolean>(false);
  const [etopsTime, setEtopsTime] = useState<number>(120); // min

  // Destination logic calculation
  const calculateDestAlternates = () => {
    if (isIsolated) {
      return {
        count: 0,
        type: 'ISOLATED DESTINATION',
        color: 'orange',
        explanation: 'No destination alternate aerodrome available. Operator must carry 2 hours additional fuel at normal cruise consumption.',
        rule: 'Part-CAT.OP.MPA.180 Isolated Aerodrome Procedure.'
      };
    }

    if (!hasMetForecast) {
      return {
        count: 2,
        type: 'TWO DESTINATION ALTERNATES MANDATORY',
        color: 'red',
        explanation: 'No meteorological information / forecast available for destination. Operator MUST select 2 destination alternates!',
        rule: 'Part-CAT.OP.MPA.181(b)'
      };
    }

    if (forecastBelowMinima) {
      return {
        count: 2,
        type: 'TWO DESTINATION ALTERNATES MANDATORY',
        color: 'red',
        explanation: 'Destination weather forecast is below planning minima during ETA ± 1 hour. Operator MUST select 2 destination alternates!',
        rule: 'Part-CAT.OP.MPA.181(a)'
      };
    }

    // Check no-alternate criteria (ALL must be met simultaneously!)
    const meetsNoAltTime = flightDuration < 6;
    const meetsNoAltRunways = separateRunways >= 2;
    const meetsNoAltWeather = destCeiling >= 2000 && destVisibility >= 5000;

    if (meetsNoAltTime && meetsNoAltRunways && meetsNoAltWeather) {
      return {
        count: 0,
        type: 'NO DESTINATION ALTERNATE REQUIRED',
        color: 'emerald',
        explanation: 'Flight duration < 6 hrs AND 2 separate usable runways available AND forecast weather >= 2,000 ft ceiling & 5 km visibility for ETA ± 1 hour.',
        rule: 'Part-CAT.OP.MPA.181(d) No-alternate Exception.'
      };
    }

    // Default: 1 alternate required
    return {
      count: 1,
      type: 'ONE DESTINATION ALTERNATE REQUIRED',
      color: 'blue',
      explanation: 'Standard IFR flight rule: at least 1 destination alternate aerodrome must be specified on the operational flight plan.',
      rule: 'Part-CAT.OP.MPA.181 Standard IFR Rule.'
    };
  };

  const destResult = calculateDestAlternates();

  // Takeoff alternate calculation
  const calculateTakeoffAlternate = () => {
    if (!departureWeatherBelowMinima) {
      return {
        needed: false,
        maxDistanceNm: 0,
        maxFlightTimeHours: 0,
        explanation: 'Departure aerodrome weather meets applicable landing minima. Aircraft can immediately return for landing if an emergency occurs after takeoff. No takeoff alternate required!'
      };
    }

    let maxTimeHours = engineCount === 2 ? 1 : 2;
    if (isEtopsApproved && engineCount === 2) {
      maxTimeHours = etopsTime / 60;
    }

    const maxDistanceNm = Math.round(oeiCruiseSpeed * maxTimeHours);

    return {
      needed: true,
      maxDistanceNm,
      maxFlightTimeHours: maxTimeHours,
      explanation: `Departure weather is below landing minima. Takeoff alternate is MANDATORY within ${maxTimeHours} hour(s) at OEI cruise speed (${maxDistanceNm} NM in still air).`
    };
  };

  const toResult = calculateTakeoffAlternate();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-700 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30 text-blue-400">
            <Map size={32} />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Alternate Aerodrome Planning Calculator
            </h2>
            <p className="text-slate-400 text-sm">
              EASA Part-CAT.OP.MPA.180 & 181 • Destination & Take-off Alternate Selection Logic
            </p>
          </div>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="flex gap-2 bg-slate-800/60 p-1.5 rounded-2xl w-fit border border-slate-700">
        <button
          onClick={() => setPlannerMode('destination')}
          className={`px-4 py-2 rounded-xl font-bold text-xs md:text-sm transition-all ${
            plannerMode === 'destination'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
          }`}
        >
          Destination Alternate Planning
        </button>
        <button
          onClick={() => setPlannerMode('takeoff')}
          className={`px-4 py-2 rounded-xl font-bold text-xs md:text-sm transition-all ${
            plannerMode === 'takeoff'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
          }`}
        >
          Takeoff Alternate Requirements (OEI)
        </button>
      </div>

      {/* MODE 1: DESTINATION ALTERNATE */}
      {plannerMode === 'destination' && (
        <div className="grid lg:grid-cols-12 gap-8 animate-in fade-in">
          {/* Controls */}
          <div className="lg:col-span-7 bg-slate-900 p-6 rounded-3xl border border-slate-700 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Plane className="text-blue-400 w-5 h-5" />
              Flight & Aerodrome Parameters
            </h3>

            {/* Flight Duration */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-slate-400 font-bold uppercase">Flight Duration:</span>
                <span className="font-mono text-cyan-400 font-bold">{flightDuration} hrs</span>
              </div>
              <input
                type="range"
                min="1"
                max="14"
                value={flightDuration}
                onChange={(e) => setFlightDuration(Number(e.target.value))}
                className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>1 hr</span>
                <span className="text-amber-400 font-bold">6 hrs (No-Alt Boundary)</span>
                <span>14 hrs (Long Range)</span>
              </div>
            </div>

            {/* Runways Available */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
                Usable Separate Runways at Destination:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSeparateRunways(1)}
                  className={`p-3 rounded-xl border text-left text-xs font-bold transition-all ${
                    separateRunways === 1
                      ? 'bg-blue-600 border-blue-400 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  1 Runway Only (Single Runway)
                </button>
                <button
                  onClick={() => setSeparateRunways(2)}
                  className={`p-3 rounded-xl border text-left text-xs font-bold transition-all ${
                    separateRunways === 2
                      ? 'bg-blue-600 border-blue-400 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  2+ Separate Usable Runways
                </button>
              </div>
            </div>

            {/* Weather inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Forecast Cloud Ceiling</label>
                <div className="relative">
                  <input
                    type="number"
                    value={destCeiling}
                    onChange={(e) => setDestCeiling(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono font-bold"
                  />
                  <span className="absolute right-3 top-3 text-slate-500 text-xs">ft</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Forecast Visibility</label>
                <div className="relative">
                  <input
                    type="number"
                    value={destVisibility}
                    onChange={(e) => setDestVisibility(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono font-bold"
                  />
                  <span className="absolute right-3 top-3 text-slate-500 text-xs">m</span>
                </div>
              </div>
            </div>

            {/* Special Conditions Checkboxes */}
            <div className="space-y-3 pt-2 border-t border-slate-800 text-xs">
              <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-950 rounded-xl border border-slate-800">
                <input
                  type="checkbox"
                  checked={isIsolated}
                  onChange={(e) => setIsIsolated(e.target.checked)}
                  className="rounded accent-blue-500 w-4 h-4"
                />
                <span className="text-slate-300">
                  <strong>Isolated Destination Aerodrome</strong> (no suitable alternate within normal diversion range)
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-950 rounded-xl border border-slate-800">
                <input
                  type="checkbox"
                  checked={!hasMetForecast}
                  onChange={(e) => setHasMetForecast(!e.target.checked)}
                  className="rounded accent-blue-500 w-4 h-4"
                />
                <span className="text-slate-300">
                  <strong>No Weather Forecast (TAF) Available</strong> for Destination (forces 2 alternates)
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-950 rounded-xl border border-slate-800">
                <input
                  type="checkbox"
                  checked={forecastBelowMinima}
                  onChange={(e) => setForecastBelowMinima(e.target.checked)}
                  className="rounded accent-blue-500 w-4 h-4"
                />
                <span className="text-slate-300">
                  <strong>Destination Weather Forecast Below Planning Minima</strong> for ETA ± 1 hour
                </span>
              </label>
            </div>
          </div>

          {/* Decision Outcome */}
          <div className="lg:col-span-5 space-y-6">
            <div className={`p-8 rounded-3xl border-2 text-center transition-all ${
              destResult.color === 'emerald'
                ? 'bg-emerald-950/40 border-emerald-500'
                : destResult.color === 'red'
                  ? 'bg-red-950/40 border-red-500'
                  : destResult.color === 'orange'
                    ? 'bg-orange-950/40 border-orange-500'
                    : 'bg-blue-950/40 border-blue-500'
            }`}>
              <div className="text-xs uppercase font-bold tracking-widest text-slate-400 mb-2">
                Dispatch Requirement
              </div>
              <div className="text-6xl font-black font-mono text-white mb-2">
                {destResult.count}
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                Alternates Required
              </div>
              <h4 className="text-xl font-black text-white mb-3">
                {destResult.type}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {destResult.explanation}
              </p>
              <span className="text-[10px] font-mono text-blue-300 bg-blue-900/40 px-3 py-1 rounded-full border border-blue-500/30">
                {destResult.rule}
              </span>
            </div>

            {/* Croucher Rule Breakdown */}
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-700 text-xs space-y-3">
              <span className="font-bold text-white uppercase text-[10px] block">
                Croucher Exam Rule: The "No-Alternate" Triple Gate
              </span>
              <p className="text-slate-400 leading-relaxed">
                To dispatch without a destination alternate, you MUST satisfy ALL THREE conditions simultaneously:
              </p>
              <ul className="space-y-1.5 text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Flight duration &lt; 6 hours.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Two separate usable runways available at destination.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Forecast weather for ETA ± 1 hr: Ceiling &ge; 2,000 ft (or circling + 500 ft) & Visibility &ge; 5 km.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: TAKEOFF ALTERNATE */}
      {plannerMode === 'takeoff' && (
        <div className="grid lg:grid-cols-12 gap-8 animate-in fade-in">
          {/* Controls */}
          <div className="lg:col-span-7 bg-slate-900 p-6 rounded-3xl border border-slate-700 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield className="text-blue-400 w-5 h-5" />
              Takeoff Alternate Planning Criteria
            </h3>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                Departure Aerodrome Weather Condition:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setDepartureWeatherBelowMinima(false)}
                  className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                    !departureWeatherBelowMinima
                      ? 'bg-emerald-600 border-emerald-400 text-white'
                      : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  At or Above Landing Minima (Can Return Immediately)
                </button>
                <button
                  onClick={() => setDepartureWeatherBelowMinima(true)}
                  className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                    departureWeatherBelowMinima
                      ? 'bg-red-600 border-red-400 text-white'
                      : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  Below Landing Minima (Cannot Return Immediately)
                </button>
              </div>
            </div>

            {/* Engine Count */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
                Aircraft Engine Configuration:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setEngineCount(2)}
                  className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                    engineCount === 2
                      ? 'bg-blue-600 border-blue-400 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Two-Engine Aeroplane (1 Hour Limit)
                </button>
                <button
                  onClick={() => setEngineCount(3)}
                  className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                    engineCount >= 3
                      ? 'bg-blue-600 border-blue-400 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Three- or Four-Engine Aeroplane (2 Hours Limit)
                </button>
              </div>
            </div>

            {/* OEI Cruise Speed */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-slate-400 font-bold uppercase">
                  One-Engine-Inoperative (OEI) Cruising Speed in Still Air:
                </span>
                <span className="font-mono text-cyan-400 font-bold">{oeiCruiseSpeed} kt TAS</span>
              </div>
              <input
                type="range"
                min="200"
                max="500"
                step="10"
                value={oeiCruiseSpeed}
                onChange={(e) => setOeiCruiseSpeed(Number(e.target.value))}
                className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* ETOPS Override for 2-Engine */}
            {engineCount === 2 && (
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isEtopsApproved}
                    onChange={(e) => setIsEtopsApproved(e.target.checked)}
                    className="rounded accent-blue-500 w-4 h-4"
                  />
                  <span className="text-xs font-bold text-slate-300">
                    Operator Approved for ETOPS / EDTO Dispatch
                  </span>
                </label>
                {isEtopsApproved && (
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                      Approved ETOPS Diversion Time (max 120 or 180 min):
                    </label>
                    <select
                      value={etopsTime}
                      onChange={(e) => setEtopsTime(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-xs font-bold"
                    >
                      <option value={120}>120 Minutes ETOPS</option>
                      <option value={180}>180 Minutes ETOPS</option>
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Takeoff Result */}
          <div className="lg:col-span-5 space-y-6">
            <div className={`p-8 rounded-3xl border-2 text-center transition-all ${
              toResult.needed
                ? 'bg-amber-950/40 border-amber-500 text-amber-200'
                : 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
            }`}>
              <div className="flex justify-center mb-3">
                {toResult.needed ? <AlertTriangle size={56} className="text-amber-400" /> : <CheckCircle2 size={56} className="text-emerald-400" />}
              </div>

              <h4 className="text-2xl font-black mb-2">
                {toResult.needed ? 'TAKEOFF ALTERNATE MANDATORY' : 'NO TAKEOFF ALTERNATE REQUIRED'}
              </h4>

              {toResult.needed && (
                <div className="my-4 p-4 bg-slate-950/80 rounded-2xl border border-amber-500/30">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Maximum Allowable Range</span>
                  <div className="text-5xl font-black font-mono text-white mt-1">
                    {toResult.maxDistanceNm} <span className="text-base font-normal text-slate-400">NM</span>
                  </div>
                  <span className="text-xs text-amber-300 block mt-1">
                    Based on {toResult.maxFlightTimeHours} hr(s) at {oeiCruiseSpeed} kt OEI TAS in still air
                  </span>
                </div>
              )}

              <p className="text-xs text-slate-300 leading-relaxed">
                {toResult.explanation}
              </p>
            </div>

            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-700 text-xs text-slate-300 space-y-2">
              <span className="font-bold text-white uppercase text-[10px] block">
                Weather Criteria at Takeoff Alternate
              </span>
              <p className="leading-relaxed text-slate-400">
                The weather forecast at the selected takeoff alternate must be <strong>at or above the applicable landing minima</strong> for that aerodrome for an estimated time of arrival of <strong>ETA ± 1 hour</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* RTFQ Exam Traps Defense Section */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-red-500/30 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <AlertOctagon className="text-red-400" />
          Alternate Planning RTFQ Exam Traps
        </h3>
        <div className="grid md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h5 className="font-bold text-amber-400 mb-1">Still Air vs Forecast Wind</h5>
            <p className="text-slate-400 leading-relaxed">
              <strong>TRAP:</strong> "Is takeoff alternate maximum distance calculated with forecast tailwind/headwind?" 
              <strong>CORRECT:</strong> Under Part-CAT, takeoff alternate distance is strictly based on <em>one-engine-inoperative cruising speed in STILL AIR</em>!
            </p>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h5 className="font-bold text-amber-400 mb-1">Can Departure Be Its Own Takeoff Alternate?</h5>
            <p className="text-slate-400 leading-relaxed">
              <strong>TRAP:</strong> An aerodrome cannot serve as its own takeoff alternate unless the meteorological conditions are AT OR ABOVE the applicable landing minima.
            </p>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h5 className="font-bold text-amber-400 mb-1">When are Two Destination Alternates Mandatory?</h5>
            <p className="text-slate-400 leading-relaxed">
              <strong>TRAP:</strong> Only 2 specific conditions mandate two alternates: 1) destination forecast is below planning minima (ETA ± 1h), or 2) no meteorological forecast is available.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlternatePlanningTool;
