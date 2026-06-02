import React, { useState } from 'react';
import { View } from '../../types';
import { ChevronLeft, Droplets, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  onChangeView: (view: View) => void;
}

const FuelPlanner: React.FC<Props> = ({ onChangeView }) => {
  // Inputs
  const [distance, setDistance] = useState(400); // NM
  const [speed, setSpeed] = useState(250); // Knots TAS
  const [fuelFlow, setFuelFlow] = useState(600); // kg/hour
  const [altDistance, setAltDistance] = useState(100); // NM
  
  // Policies
  const [hasAlternate, setHasAlternate] = useState(true);
  const [contingencyType, setContingencyType] = useState<'STANDARD' | 'RCF'>('STANDARD'); // RCF = Reduced Contingency Fuel (3%)
  const [extraFuel, setExtraFuel] = useState(100); // kg (Discretionary)

  // Calculations
  const taxiFuel = 50; // kg fixed taxi fuel
  
  const tripTimeHours = distance / speed;
  const tripFuel = Math.round(tripTimeHours * fuelFlow);
  
  const altTimeHours = hasAlternate ? altDistance / speed : 0;
  const altFuel = hasAlternate ? Math.round(altTimeHours * fuelFlow) : 0;

  // Contingency Fuel:
  // Standard: 5% of trip fuel OR 5 mins holding, whichever is greater
  // RCF: 3% of trip fuel using a Decision Point
  const standardContingency = Math.max(Math.round(tripFuel * 0.05), Math.round((5 / 60) * fuelFlow));
  const rcfContingency = Math.round(tripFuel * 0.03);
  const contingencyFuel = contingencyType === 'STANDARD' ? standardContingency : rcfContingency;

  // Final Reserve Fuel:
  // Standard turbine: 30 minutes holding at 1500ft
  const finalReserveFuel = Math.round(30 / 60 * fuelFlow);

  // Isolated Aerodrome Procedure:
  // If no alternate exists, must carry 2 hours of normal cruise fuel instead of Alternate + Final Reserve
  const isIsolated = !hasAlternate;
  const isolatedAerodromeFuel = isIsolated ? Math.round(2 * fuelFlow) : 0;

  // Total block fuel
  // If isolated: Taxi + Trip + Contingency + 2hr reserve + Extra
  // If standard: Taxi + Trip + Contingency + Alternate + Final Reserve + Extra
  const totalBlockFuel = taxiFuel + tripFuel + contingencyFuel + (isIsolated ? isolatedAerodromeFuel : (altFuel + finalReserveFuel)) + extraFuel;

  // Visual percentages for fuel tank layout
  const tripPct = Math.round((tripFuel / totalBlockFuel) * 100);
  const contPct = Math.round((contingencyFuel / totalBlockFuel) * 100);
  const reservePct = Math.round(((isIsolated ? isolatedAerodromeFuel : (altFuel + finalReserveFuel)) / totalBlockFuel) * 100);
  const extraPct = Math.round((extraFuel / totalBlockFuel) * 100);
  const taxiPct = Math.round((taxiFuel / totalBlockFuel) * 100);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in duration-700">
      {/* Back Button */}
      <button 
        onClick={() => onChangeView(View.FLIGHT_PLAN_HOME)}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
        Back to Subject Dashboard
      </button>

      {/* Header */}
      <div className="glass-panel p-8 md:p-12 rounded-3xl border border-orange-500/20 relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="p-4 bg-orange-500/20 rounded-2xl text-orange-400">
            <Droplets size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight animate-pulse">Fuel Policy Planner</h1>
        </div>
        <p className="text-slate-300 text-lg max-w-2xl leading-relaxed relative z-10">
          EASA compliant fuel planner. Test standard contingency safety factors, Reduced Contingency Fuel (RCF) margins, and Isolated Aerodrome fuel reserves.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: Inputs (5/12 cols) */}
        <div className="lg:col-span-5 bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-white/5 space-y-6">
          <h3 className="text-xl font-bold text-white border-b border-white/5 pb-3">Route & Performance</h3>
          
          {/* Distance */}
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono">
              <span>TRIP DISTANCE</span>
              <span className="text-white font-bold">{distance} NM</span>
            </div>
            <input type="range" min="100" max="1500" step="50" value={distance} onChange={e => setDistance(Number(e.target.value))} className="w-full accent-orange-500" />
          </div>

          {/* Speed */}
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono">
              <span>CRUISE SPEED (TAS)</span>
              <span className="text-white font-bold">{speed} KT</span>
            </div>
            <input type="range" min="100" max="500" step="10" value={speed} onChange={e => setSpeed(Number(e.target.value))} className="w-full accent-orange-500" />
          </div>

          {/* Fuel Flow */}
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono">
              <span>FUEL FLOW</span>
              <span className="text-white font-bold">{fuelFlow} kg/hr</span>
            </div>
            <input type="range" min="100" max="2500" step="50" value={fuelFlow} onChange={e => setFuelFlow(Number(e.target.value))} className="w-full accent-orange-500" />
          </div>

          {/* Alternate Selector */}
          <div className="pt-4 border-t border-white/5 space-y-4">
            <h4 className="text-sm font-bold text-slate-300">Destination Alternate</h4>
            <div className="flex bg-slate-950 p-1 rounded-lg">
              <button onClick={() => setHasAlternate(true)} className={`flex-1 py-2 text-xs font-bold rounded transition-colors ${hasAlternate ? 'bg-orange-500 text-black' : 'text-slate-500 hover:text-slate-300'}`}>Required</button>
              <button onClick={() => setHasAlternate(false)} className={`flex-1 py-2 text-xs font-bold rounded transition-colors ${!hasAlternate ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-slate-500 hover:text-slate-300'}`}>Isolated Aerodrome</button>
            </div>

            {hasAlternate ? (
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono">
                  <span>ALTERNATE DISTANCE</span>
                  <span className="text-white font-bold">{altDistance} NM</span>
                </div>
                <input type="range" min="30" max="300" step="10" value={altDistance} onChange={e => setAltDistance(Number(e.target.value))} className="w-full accent-orange-500" />
              </div>
            ) : (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
                <AlertTriangle className="text-red-400 w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-xs text-red-200 leading-relaxed">
                  <strong>Isolated Aerodrome Procedure:</strong> If no destination alternate is designated, the flight must carry **2 Hours of Cruise Fuel** at normal consumption rates following arrival. Alternate and standard Final Reserve are replaced.
                </div>
              </div>
            )}
          </div>

          {/* Contingency Selector */}
          <div className="pt-4 border-t border-white/5 space-y-4">
            <h4 className="text-sm font-bold text-slate-300">Contency Fuel Policy</h4>
            <div className="flex bg-slate-950 p-1 rounded-lg">
              <button onClick={() => setContingencyType('STANDARD')} className={`flex-1 py-2 text-xs font-bold rounded transition-colors ${contingencyType === 'STANDARD' ? 'bg-orange-500 text-black' : 'text-slate-500 hover:text-slate-300'}`}>Standard (5% / 5m)</button>
              <button onClick={() => setContingencyType('RCF')} className={`flex-1 py-2 text-xs font-bold rounded transition-colors ${contingencyType === 'RCF' ? 'bg-orange-500 text-black' : 'text-slate-500 hover:text-slate-300'}`}>Reduced (3% RCF)</button>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Standard is 5% of trip fuel (minimum 5 minutes holding). Reduced Contingency Fuel (3%) requires a defined Decision Point en-route where weather is re-evaluated.
            </p>
          </div>
        </div>

        {/* Right column: Results & Tank (7/12 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Fuel Log Table */}
          <div className="bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-white/5">
            <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
              <CheckCircle className="text-emerald-400" />
              EASA Fuel Log Analysis
            </h3>
            
            <div className="space-y-3 font-mono">
              <div className="flex justify-between text-sm py-2 border-b border-white/5 text-slate-400">
                <span>1. TAXI FUEL</span>
                <span className="text-white font-bold">{taxiFuel} kg</span>
              </div>
              <div className="flex justify-between text-sm py-2 border-b border-white/5 text-slate-400">
                <span>2. TRIP FUEL ({tripTimeHours.toFixed(2)} hrs)</span>
                <span className="text-white font-bold">{tripFuel} kg</span>
              </div>
              <div className="flex justify-between text-sm py-2 border-b border-white/5 text-slate-400">
                <span>3. CONTINGENCY FUEL ({contingencyType === 'STANDARD' ? '5%' : '3%'})</span>
                <span className="text-white font-bold">{contingencyFuel} kg</span>
              </div>
              
              {hasAlternate ? (
                <>
                  <div className="flex justify-between text-sm py-2 border-b border-white/5 text-slate-400">
                    <span>4. ALTERNATE FUEL ({altTimeHours.toFixed(2)} hrs)</span>
                    <span className="text-white font-bold">{altFuel} kg</span>
                  </div>
                  <div className="flex justify-between text-sm py-2 border-b border-white/5 text-slate-400">
                    <span>5. FINAL RESERVE FUEL (30 min)</span>
                    <span className="text-white font-bold">{finalReserveFuel} kg</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-sm py-2 border-b border-white/5 text-slate-400 bg-red-950/20 px-3 rounded-lg border border-red-500/20">
                  <span className="text-red-400">4. ISOLATED AERODROME RESERVE (2 hrs)</span>
                  <span className="text-red-400 font-bold">{isolatedAerodromeFuel} kg</span>
                </div>
              )}
              
              <div className="flex justify-between text-sm py-2 border-b border-white/5 text-slate-400">
                <span>6. EXTRA / COMMANDER DISCRETION</span>
                <div className="flex items-center gap-2">
                  <input type="number" value={extraFuel} onChange={e => setExtraFuel(Math.max(0, Number(e.target.value)))} className="w-20 bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-right font-bold text-white text-sm" />
                  <span className="text-slate-500 text-xs">kg</span>
                </div>
              </div>

              {/* Total Block Fuel */}
              <div className="flex justify-between text-xl font-bold pt-6 text-orange-400 bg-slate-950/40 p-4 rounded-2xl border border-white/5 mt-4">
                <span>TOTAL BLOCK FUEL</span>
                <span className="font-mono text-2xl font-black">{totalBlockFuel} kg</span>
              </div>
            </div>
          </div>

          {/* Visual Tank Gauge */}
          <div className="bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-white/5">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Fuel Tank Volumetric Allocation</h4>
            
            {/* Visual Tank Bar */}
            <div className="h-16 w-full bg-slate-950 border-2 border-slate-800 rounded-2xl overflow-hidden flex shadow-inner">
              <motion.div animate={{ width: `${tripPct}%` }} className="bg-blue-500/80 hover:bg-blue-500 border-r border-slate-950 transition-colors flex items-center justify-center text-[10px] font-black text-white" title={`Trip: ${tripFuel}kg`}>{tripPct > 10 && 'TRIP'}</motion.div>
              <motion.div animate={{ width: `${contPct}%` }} className="bg-amber-500/80 hover:bg-amber-500 border-r border-slate-950 transition-colors flex items-center justify-center text-[10px] font-black text-white" title={`Contingency: ${contingencyFuel}kg`}>{contPct > 10 && 'CONT'}</motion.div>
              <motion.div animate={{ width: `${reservePct}%` }} className="bg-red-500/80 hover:bg-red-500 border-r border-slate-950 transition-colors flex items-center justify-center text-[10px] font-black text-white" title={`Reserves: ${isIsolated ? isolatedAerodromeFuel : (altFuel + finalReserveFuel)}kg`}>{reservePct > 10 && 'RESV'}</motion.div>
              <motion.div animate={{ width: `${extraPct}%` }} className="bg-purple-500/80 hover:bg-purple-500 border-r border-slate-950 transition-colors flex items-center justify-center text-[10px] font-black text-white" title={`Discretionary: ${extraFuel}kg`}>{extraPct > 10 && 'EXTRA'}</motion.div>
              <motion.div animate={{ width: `${taxiPct}%` }} className="bg-slate-600 hover:bg-slate-500 flex items-center justify-center text-[10px] font-black text-white" title={`Taxi: ${taxiFuel}kg`}>{taxiPct > 10 && 'TAXI'}</motion.div>
            </div>

            <div className="flex flex-wrap gap-4 mt-6 text-xs text-slate-400 justify-center">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-blue-500/80 rounded-sm"></span> Trip ({tripPct}%)</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-amber-500/80 rounded-sm"></span> Contingency ({contPct}%)</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-red-500/80 rounded-sm"></span> Reserves ({reservePct}%)</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-purple-500/80 rounded-sm"></span> Discretionary ({extraPct}%)</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-slate-600 rounded-sm"></span> Taxi ({taxiPct}%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FuelPlanner;
