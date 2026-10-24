import React, { useState } from 'react';
import { View } from '../../types';
import { ChevronLeft, Droplets, AlertTriangle, Info, CheckCircle, Radio, Plane, Shield, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  onChangeView: (view: View) => void;
}

const FuelPlanner: React.FC<Props> = ({ onChangeView }) => {
  // Aircraft Category
  const [propulsionType, setPropulsionType] = useState<'JET' | 'PISTON'>('JET');

  // Inputs
  const [distance, setDistance] = useState<number>(650); // NM
  const [speed, setSpeed] = useState<number>(420); // Knots TAS
  const [fuelFlow, setFuelFlow] = useState<number>(2200); // kg/hour
  const [altDistance, setAltDistance] = useState<number>(140); // NM
  
  // Policies & Procedures
  const [hasAlternate, setHasAlternate] = useState<boolean>(true);
  const [contingencyType, setContingencyType] = useState<'STANDARD' | 'ERA_3PCT'>('STANDARD'); // 5% vs 3% with En-Route Alternate
  const [extraFuel, setExtraFuel] = useState<number>(300); // kg (Commander Discretion)

  // Calculations (EASA Part-CAT)
  // 1. Taxi Fuel: Standard nominal burn for APU and ground taxi
  const taxiFuel = propulsionType === 'JET' ? 180 : 25; // kg
  
  // 2. Trip Fuel: From brake release to touchdown
  const tripTimeHours = distance / speed;
  const tripFuel = Math.round(tripTimeHours * fuelFlow);
  
  // 3. Contingency Fuel:
  // Standard: Higher of 5% of trip fuel OR 5 minutes holding at 1,500 ft above destination
  // ERA/RCF: 3% of trip fuel using a certified En-Route Alternate aerodrome
  const fiveMinHoldFuel = Math.round((5 / 60) * fuelFlow * 0.85); // 1500ft holding flow is ~85% cruise flow
  const standardContingency = Math.max(Math.round(tripFuel * 0.05), fiveMinHoldFuel);
  const eraContingency = Math.max(Math.round(tripFuel * 0.03), fiveMinHoldFuel);
  const contingencyFuel = contingencyType === 'STANDARD' ? standardContingency : eraContingency;

  // 4. Alternate Fuel: Go-around at destination, climb, cruise to alternate, descent, approach, and landing
  const altTimeHours = hasAlternate ? (altDistance / speed) + (15 / 60) : 0; // +15 min for missed approach/climb
  const altFuel = hasAlternate ? Math.round(altTimeHours * fuelFlow) : 0;

  // 5. Final Reserve Fuel:
  // Turbine: 30 minutes holding at 1,500 ft above alternate aerodrome in ISA standard
  // Piston: 45 minutes fuel
  const finalReserveMins = propulsionType === 'JET' ? 30 : 45;
  const finalReserveFuel = Math.round((finalReserveMins / 60) * fuelFlow * 0.85);

  // 6. Additional / Isolated Aerodrome Fuel:
  // If destination is isolated (no alternate), Part-CAT requires 2 hours cruise fuel following arrival
  const isIsolated = !hasAlternate;
  const isolatedAerodromeFuel = isIsolated ? Math.round(2 * fuelFlow) : 0;

  // Total Block Fuel
  // Taxi + Trip + Contingency + Alternate + Final Reserve + Extra (or Isolated 2hr)
  const totalBlockFuel = taxiFuel + tripFuel + contingencyFuel + 
    (isIsolated ? isolatedAerodromeFuel : (altFuel + finalReserveFuel)) + extraFuel;

  // In-Flight Fuel Emergency State Tester
  const [simulatedFuelOnBoard, setSimulatedFuelOnBoard] = useState<number>(totalBlockFuel * 0.35);

  // Remaining fuel upon landing calculation
  const remainingAtDest = Math.max(0, simulatedFuelOnBoard - 500); // assuming remaining after diversions/holding
  const isMaydayCondition = remainingAtDest < finalReserveFuel;
  const isMinFuelCondition = !isMaydayCondition && remainingAtDest < (finalReserveFuel + 300);

  // Percentages for visual tank representation
  const tripPct = Math.round((tripFuel / totalBlockFuel) * 100);
  const contPct = Math.round((contingencyFuel / totalBlockFuel) * 100);
  const reservePct = Math.round(((isIsolated ? isolatedAerodromeFuel : (altFuel + finalReserveFuel)) / totalBlockFuel) * 100);
  const extraPct = Math.round((extraFuel / totalBlockFuel) * 100);
  const taxiPct = Math.round((taxiFuel / totalBlockFuel) * 100);

  // Switch aircraft type helper
  const handlePropulsionSwitch = (type: 'JET' | 'PISTON') => {
    setPropulsionType(type);
    if (type === 'PISTON') {
      setSpeed(140);
      setFuelFlow(50);
      setDistance(250);
      setAltDistance(40);
      setExtraFuel(20);
      setSimulatedFuelOnBoard(120);
    } else {
      setSpeed(420);
      setFuelFlow(2200);
      setDistance(650);
      setAltDistance(140);
      setExtraFuel(300);
      setSimulatedFuelOnBoard(4500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in duration-700 font-sans space-y-8">
      {/* Back Button */}
      <button 
        onClick={() => onChangeView(View.FLIGHT_PLAN_HOME)}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
        Back to Subject Dashboard
      </button>

      {/* Header Panel */}
      <div className="glass-panel p-8 md:p-12 rounded-3xl border border-orange-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-xs font-bold uppercase tracking-widest mb-4">
              <Droplets className="w-3.5 h-3.5" /> Subject 033 • Commercial Fuel Planning (Part-CAT)
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              Fuel Policy & Reserves Architecture
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl leading-relaxed mt-2">
              Calculate legal Part-CAT fuel logs: Taxi, Trip, Contingency (5% vs 3% ERA), Alternate, and Final Reserve. Master mandatory Minimum Fuel and Mayday Fuel declarations.
            </p>
          </div>

          {/* Propulsion Category Selector */}
          <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-700 self-start md:self-auto">
            <button
              onClick={() => handlePropulsionSwitch('JET')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                propulsionType === 'JET'
                  ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Plane className="w-4 h-4" />
              Turbine Jet (30m Reserve)
            </button>
            <button
              onClick={() => handlePropulsionSwitch('PISTON')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                propulsionType === 'PISTON'
                  ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Radio className="w-4 h-4" />
              Piston Engine (45m Reserve)
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: Inputs & Controls (5/12 cols) */}
        <div className="lg:col-span-5 bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-white/5 space-y-6">
          <h3 className="text-lg font-bold text-white border-b border-white/5 pb-3 flex items-center justify-between">
            <span>Route & Performance Settings</span>
            <span className="text-xs text-orange-400 font-mono font-normal">
              {propulsionType === 'JET' ? 'B737 / A320 Class' : 'Light Twin / Single'}
            </span>
          </h3>
          
          {/* Distance */}
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono">
              <span>SECTOR TRIP DISTANCE</span>
              <span className="text-white font-bold">{distance} NM</span>
            </div>
            <input
              type="range"
              min={propulsionType === 'JET' ? 100 : 30}
              max={propulsionType === 'JET' ? 2500 : 800}
              step={propulsionType === 'JET' ? 25 : 10}
              value={distance}
              onChange={e => setDistance(Number(e.target.value))}
              className="w-full accent-orange-500 h-2 cursor-pointer"
            />
          </div>

          {/* Cruise Speed TAS */}
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono">
              <span>CRUISE SPEED (TAS)</span>
              <span className="text-white font-bold">{speed} KT</span>
            </div>
            <input
              type="range"
              min={propulsionType === 'JET' ? 250 : 80}
              max={propulsionType === 'JET' ? 520 : 220}
              step="5"
              value={speed}
              onChange={e => setSpeed(Number(e.target.value))}
              className="w-full accent-orange-500 h-2 cursor-pointer"
            />
          </div>

          {/* Fuel Flow */}
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono">
              <span>CRUISE FUEL FLOW</span>
              <span className="text-white font-bold">{fuelFlow} kg/hr</span>
            </div>
            <input
              type="range"
              min={propulsionType === 'JET' ? 1000 : 20}
              max={propulsionType === 'JET' ? 6000 : 150}
              step={propulsionType === 'JET' ? 50 : 2}
              value={fuelFlow}
              onChange={e => setFuelFlow(Number(e.target.value))}
              className="w-full accent-orange-500 h-2 cursor-pointer"
            />
          </div>

          {/* Alternate Aerodrome Selector */}
          <div className="pt-4 border-t border-white/5 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-bold text-slate-300">Destination Alternate</h4>
              <span className="text-[11px] text-slate-500 font-mono">Part-CAT.OP.MPA.181</span>
            </div>
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setHasAlternate(true)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                  hasAlternate ? 'bg-orange-500 text-black' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Standard Alternate
              </button>
              <button
                onClick={() => setHasAlternate(false)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                  !hasAlternate ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Isolated Aerodrome (2h)
              </button>
            </div>

            {hasAlternate ? (
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono">
                  <span>ALTERNATE DISTANCE</span>
                  <span className="text-white font-bold">{altDistance} NM</span>
                </div>
                <input
                  type="range"
                  min={propulsionType === 'JET' ? 40 : 15}
                  max={propulsionType === 'JET' ? 350 : 120}
                  step="5"
                  value={altDistance}
                  onChange={e => setAltDistance(Number(e.target.value))}
                  className="w-full accent-orange-500 h-2 cursor-pointer"
                />
              </div>
            ) : (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-start gap-3">
                <AlertTriangle className="text-red-400 w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-xs text-red-200 leading-relaxed">
                  <strong>Isolated Aerodrome Procedure:</strong> If no suitable destination alternate exists, Part-CAT requires carrying <strong>2 Hours of Normal Cruise Fuel</strong> following arrival. Alternate fuel and standard Final Reserve are replaced by this mandatory buffer.
                </div>
              </div>
            )}
          </div>

          {/* Contingency Selector */}
          <div className="pt-4 border-t border-white/5 space-y-4">
            <h4 className="text-sm font-bold text-slate-300">Contingency Policy (Part-CAT)</h4>
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setContingencyType('STANDARD')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                  contingencyType === 'STANDARD' ? 'bg-orange-500 text-black' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Standard (5% / 5 min)
              </button>
              <button
                onClick={() => setContingencyType('ERA_3PCT')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                  contingencyType === 'ERA_3PCT' ? 'bg-orange-500 text-black' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Reduced (3% with ERA)
              </button>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Standard contingency is the higher of <strong>5% of Trip Fuel</strong> or <strong>5 minutes holding</strong> at 1,500 ft. It may be reduced to <strong>3%</strong> if an official En-Route Alternate (ERA) aerodrome is designated along the track.
            </p>
          </div>
        </div>

        {/* Right column: Results, Fuel Log & Emergency Protocol (7/12 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* EASA Part-CAT Fuel Log Table */}
          <div className="bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-white/5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="text-2xl font-black text-white flex items-center gap-2">
                <CheckCircle className="text-emerald-400" />
                Part-CAT Certified Fuel Log
              </h3>
              <span className="text-xs font-mono text-slate-400 uppercase">
                {propulsionType} Fuel Specification
              </span>
            </div>
            
            <div className="space-y-3 font-mono text-xs md:text-sm">
              <div className="flex justify-between py-2 border-b border-white/5 text-slate-400">
                <span>1. TAXI FUEL (APU & Ground Maneuver)</span>
                <span className="text-white font-bold">{taxiFuel} kg</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5 text-slate-400">
                <span>2. TRIP FUEL ({tripTimeHours.toFixed(2)} hrs @ {speed} kt)</span>
                <span className="text-white font-bold">{tripFuel.toLocaleString()} kg</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5 text-slate-400">
                <span>3. CONTINGENCY FUEL ({contingencyType === 'STANDARD' ? 'Higher of 5% or 5 min' : '3% with ERA'})</span>
                <span className="text-white font-bold">{contingencyFuel.toLocaleString()} kg</span>
              </div>
              
              {hasAlternate ? (
                <>
                  <div className="flex justify-between py-2 border-b border-white/5 text-slate-400">
                    <span>4. ALTERNATE FUEL ({altTimeHours.toFixed(2)} hrs to ALTN)</span>
                    <span className="text-white font-bold">{altFuel.toLocaleString()} kg</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5 text-slate-400">
                    <span className="text-amber-300 font-bold">5. FINAL RESERVE FUEL ({finalReserveMins} min holding @ 1,500 ft)</span>
                    <span className="text-amber-300 font-black">{finalReserveFuel.toLocaleString()} kg</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between py-2.5 border-b border-white/5 text-slate-400 bg-red-950/30 px-3 rounded-lg border border-red-500/20">
                  <span className="text-red-400 font-bold">4. ISOLATED AERODROME RESERVE (2 Hours Cruise)</span>
                  <span className="text-red-400 font-black">{isolatedAerodromeFuel.toLocaleString()} kg</span>
                </div>
              )}
              
              <div className="flex justify-between py-2 border-b border-white/5 text-slate-400 items-center">
                <span>6. COMMANDER DISCRETION / EXTRA FUEL</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={extraFuel}
                    onChange={e => setExtraFuel(Math.max(0, Number(e.target.value)))}
                    className="w-24 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-right font-bold text-white text-sm focus:border-orange-500 focus:outline-none"
                  />
                  <span className="text-slate-500 text-xs">kg</span>
                </div>
              </div>

              {/* Total Block Fuel Banner */}
              <div className="flex justify-between items-center text-xl font-bold pt-4 text-orange-400 bg-slate-950/60 p-4 rounded-2xl border border-white/10 mt-2">
                <span>TOTAL BLOCK / RAMP FUEL:</span>
                <span className="font-mono text-2xl font-black">{totalBlockFuel.toLocaleString()} kg</span>
              </div>
            </div>
          </div>

          {/* Visual Tank Gauge */}
          <div className="bg-slate-900/50 p-6 rounded-3xl border border-white/5 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Volumetric Fuel Distribution
            </h4>
            
            <div className="h-14 w-full bg-slate-950 border-2 border-slate-800 rounded-2xl overflow-hidden flex shadow-inner">
              <motion.div animate={{ width: `${tripPct}%` }} className="bg-blue-500/90 hover:bg-blue-500 border-r border-slate-950 flex items-center justify-center text-[10px] font-black text-white" title={`Trip: ${tripFuel}kg`}>{tripPct > 10 && 'TRIP'}</motion.div>
              <motion.div animate={{ width: `${contPct}%` }} className="bg-amber-500/90 hover:bg-amber-500 border-r border-slate-950 flex items-center justify-center text-[10px] font-black text-white" title={`Contingency: ${contingencyFuel}kg`}>{contPct > 8 && 'CONT'}</motion.div>
              <motion.div animate={{ width: `${reservePct}%` }} className="bg-red-500/90 hover:bg-red-500 border-r border-slate-950 flex items-center justify-center text-[10px] font-black text-white" title={`Reserves: ${isIsolated ? isolatedAerodromeFuel : (altFuel + finalReserveFuel)}kg`}>{reservePct > 10 && 'RESV'}</motion.div>
              <motion.div animate={{ width: `${extraPct}%` }} className="bg-purple-500/90 hover:bg-purple-500 border-r border-slate-950 flex items-center justify-center text-[10px] font-black text-white" title={`Extra: ${extraFuel}kg`}>{extraPct > 8 && 'EXTRA'}</motion.div>
              <motion.div animate={{ width: `${taxiPct}%` }} className="bg-slate-600 hover:bg-slate-500 flex items-center justify-center text-[10px] font-black text-white" title={`Taxi: ${taxiFuel}kg`}>{taxiPct > 5 && 'TAXI'}</motion.div>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-slate-400 justify-center font-mono">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-blue-500 rounded-sm"></span> Trip ({tripPct}%)</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-amber-500 rounded-sm"></span> Contingency ({contPct}%)</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-red-500 rounded-sm"></span> Reserves ({reservePct}%)</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-purple-500 rounded-sm"></span> Discretionary ({extraPct}%)</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-slate-600 rounded-sm"></span> Taxi ({taxiPct}%)</span>
            </div>
          </div>

          {/* Mandatory Emergency Fuel Protocol Section (Croucher Ch 15) */}
          <div className="bg-slate-900/60 p-6 md:p-8 rounded-3xl border border-red-500/30 space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <Shield className="w-6 h-6 text-red-400" />
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">
                  In-Flight Emergency Fuel Declarations (Part-CAT)
                </h3>
                <p className="text-xs text-slate-400">
                  Croucher Mental Model: "Final Reserve is Untouchable Concrete"
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* MINIMUM FUEL Card */}
              <div className="p-4 bg-amber-950/20 border border-amber-500/40 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase font-mono">
                  <Radio className="w-4 h-4" />
                  "MINIMUM FUEL" (Advisory)
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Informs ATC that all planned aerodrome options have been committed to and any change to the existing clearance may result in landing with less than planned Final Reserve fuel. <strong>This is an advisory of anticipated danger, not an emergency declaration.</strong> ATC gives priority consideration but not emergency handling.
                </p>
              </div>

              {/* MAYDAY FUEL Card */}
              <div className="p-4 bg-red-950/30 border border-red-500/50 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase font-mono animate-pulse">
                  <AlertTriangle className="w-4 h-4" />
                  "MAYDAY MAYDAY MAYDAY FUEL"
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Legally mandatory under EASA Part-CAT:</strong> The pilot-in-command MUST declare a fuel distress emergency when calculated usable fuel expected to be available upon landing at the nearest aerodrome is <strong>less than the planned Final Reserve Fuel</strong>. ATC grants immediate emergency priority.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FuelPlanner;
