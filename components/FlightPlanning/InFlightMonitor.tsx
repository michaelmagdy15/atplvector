import React, { useState } from 'react';
import { View } from '../../types';
import { ChevronLeft, LineChart, AlertTriangle, CheckCircle, Navigation, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  onChangeView: (view: View) => void;
}

interface Checkpoint {
  name: string;
  distToNext: number; // NM
  plannedTime: number; // minutes from dep
  actualTime: number | null; // minutes from dep
  plannedFuel: number; // kg
  actualFuel: number | null; // kg
}

const InFlightMonitor: React.FC<Props> = ({ onChangeView }) => {
  // Flight Log State
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([
    { name: 'EGLL (DEP)', distToNext: 80, plannedTime: 0, actualTime: 0, plannedFuel: 4200, actualFuel: 4200 },
    { name: 'DTY', distToNext: 120, plannedTime: 18, actualTime: 22, plannedFuel: 3950, actualFuel: 3880 },
    { name: 'GAM', distToNext: 150, plannedTime: 45, actualTime: 54, plannedFuel: 3500, actualFuel: 3350 },
    { name: 'LFPG (DEST)', distToNext: 0, plannedTime: 80, actualTime: null, plannedFuel: 2800, actualFuel: null },
  ]);

  // Diversion State
  const [isDiverting, setIsDiverting] = useState(false);
  const [divAirport, setDivAirport] = useState('LFOB');
  const [divDistance, setDivDistance] = useState(90); // NM
  const [aircraftMass, setAircraftMass] = useState(65000); // kg (for landing mass calculations)

  // Calculations at GAM (last checked point)
  // Distance from DEP to GAM = 80 + 120 = 200 NM
  // Time from DEP to GAM = 54 mins
  // GS actual = (200 NM / 54 mins) * 60 = 222 KT
  // Planned GS = (200 NM / 45 mins) * 60 = 266 KT
  // Delay = 9 mins (Headwind deviation)
  const distFlown = 200;
  const timeFlown = 54;
  const gsActual = Math.round((distFlown / timeFlown) * 60);

  // Fuel actual burn = 4200 - 3350 = 850 kg
  // Fuel burn rate actual = (850 kg / 54 mins) * 60 = 944 kg/hr
  const fuelBurned = 850;
  const fuelFlowActual = Math.round((fuelBurned / timeFlown) * 60);

  // Projections for Destination (LFPG)
  // Remaining distance = 150 NM
  const distRemaining = 150;
  const timeRemaining = (distRemaining / gsActual) * 60; // mins
  const etaMins = timeFlown + timeRemaining;
  const fuelRemainingAtDest = 3350 - (timeRemaining / 60) * fuelFlowActual;

  // EASA reserves safety threshold
  const alternateFuelRequired = 600; // kg
  const finalReserveFuel = 450; // kg
  const safeReserveThreshold = alternateFuelRequired + finalReserveFuel; // 1050 kg

  // Diversion calculations
  const timeToDiv = (divDistance / gsActual) * 60; // mins
  const fuelToDiv = (timeToDiv / 60) * fuelFlowActual;
  const landingMassAtDiv = aircraftMass - fuelToDiv;

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
      <div className="glass-panel p-8 md:p-12 rounded-3xl border border-emerald-500/20 relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="p-4 bg-emerald-500/20 rounded-2xl text-emerald-400">
            <LineChart size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">In-Flight Log Monitor</h1>
        </div>
        <p className="text-slate-300 text-lg max-w-2xl leading-relaxed relative z-10">
          Realtime en-route check-point visualizer. Detect delays, compute revised actual ground speeds, and audit commander diversion reserve compliance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Log Table (8/12) */}
        <div className="lg:col-span-8 bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-white/5 space-y-6">
          <h3 className="text-xl font-bold text-white border-b border-white/5 pb-3">En-Route Checkpoints & Tracking</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm font-mono">
              <thead>
                <tr className="border-b border-white/10 text-slate-500">
                  <th className="pb-3">WAYPOINT</th>
                  <th className="pb-3">LEG DIST</th>
                  <th className="pb-3">PLN TIME</th>
                  <th className="pb-3">ACT TIME</th>
                  <th className="pb-3">PLN FUEL</th>
                  <th className="pb-3 font-bold text-emerald-400">ACT FUEL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {checkpoints.map((cp, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 font-bold text-white">{cp.name}</td>
                    <td className="py-4">{cp.distToNext > 0 ? `${cp.distToNext} NM` : '─'}</td>
                    <td className="py-4">{cp.plannedTime}m</td>
                    <td className="py-4 text-white">
                      {cp.actualTime !== null ? (
                        `${cp.actualTime}m`
                      ) : (
                        <span className="text-slate-600 font-bold">PROJ: {Math.round(etaMins)}m</span>
                      )}
                    </td>
                    <td className="py-4">{cp.plannedFuel} kg</td>
                    <td className="py-4 font-bold text-emerald-400">
                      {cp.actualFuel !== null ? (
                        `${cp.actualFuel} kg`
                      ) : (
                        <span className="text-slate-600 font-bold">PROJ: {Math.round(fuelRemainingAtDest)} kg</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-950/60 rounded-2xl border border-white/5 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cockpit Revision Computer</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 p-3 rounded-xl border border-white/5 text-center">
                <span className="text-[10px] text-slate-500 block">ACTUAL GROUND SPEED</span>
                <span className="text-lg font-bold text-white font-mono">{gsActual} KT</span>
                <span className="text-[9px] text-red-400 block mt-1">44 KT slower (Headwind)</span>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-white/5 text-center">
                <span className="text-[10px] text-slate-500 block">ACTUAL FUEL FLOW</span>
                <span className="text-lg font-bold text-white font-mono">{fuelFlowActual} kg/hr</span>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-white/5 text-center">
                <span className="text-[10px] text-slate-500 block">REVISED ETA (DEST)</span>
                <span className="text-lg font-bold text-yellow-400 font-mono">+{Math.round(etaMins - 80)} MINS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Commander Decision Matrix (4/12) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/50 p-6 rounded-3xl border border-white/5 space-y-4">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Shield className="text-emerald-400" />
              Commander Review
            </h3>

            {fuelRemainingAtDest < safeReserveThreshold ? (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl space-y-3">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-red-400 w-5 h-5 shrink-0 mt-0.5" />
                  <div className="text-xs text-red-200 leading-relaxed">
                    <strong>RESERVE ALERT:</strong> Expected landing fuel (**{Math.round(fuelRemainingAtDest)} kg**) is below required safe reserves (**{safeReserveThreshold} kg**). Alternate fuel would be compromised.
                  </div>
                </div>
                <button 
                  onClick={() => setIsDiverting(true)}
                  className="w-full py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-red-950/20 active:scale-95"
                >
                  Initiate Diversion Re-Routing
                </button>
              </div>
            ) : (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-start gap-3">
                <CheckCircle className="text-emerald-400 w-5 h-5 shrink-0" />
                <div className="text-xs text-emerald-200">
                  Fuel status nominal. Expected landing reserves exceed absolute safe minimums.
                </div>
              </div>
            )}
          </div>

          {/* Diversion Workspace */}
          {isDiverting && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/50 p-6 rounded-3xl border border-red-500/30 space-y-4"
            >
              <h4 className="text-sm font-bold text-red-400 uppercase tracking-wider">Diversion Performance Planning</h4>
              
              <div>
                <label className="text-[10px] text-slate-500 font-bold block mb-1">DIVERSION AIRPORT</label>
                <input 
                  type="text" 
                  value={divAirport} 
                  onChange={e => setDivAirport(e.target.value.toUpperCase())}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none" 
                />
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-slate-500 mb-1 font-mono">
                  <span>DISTANCE TO ALTERNATE</span>
                  <span className="text-white font-bold">{divDistance} NM</span>
                </div>
                <input 
                  type="range" 
                  min="30" 
                  max="200" 
                  value={divDistance} 
                  onChange={e => setDivDistance(Number(e.target.value))} 
                  className="w-full accent-red-500" 
                />
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl space-y-2 border border-white/5 font-mono text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>EET to ALTN:</span>
                  <span className="text-white">{Math.round(timeToDiv)} mins</span>
                </div>
                <div className="flex justify-between">
                  <span>Required Fuel:</span>
                  <span className="text-white">{Math.round(fuelToDiv)} kg</span>
                </div>
                <div className="flex justify-between">
                  <span>Remaining Landing Mass:</span>
                  <span className="text-white">{Math.round(landingMassAtDiv / 100) / 10} t</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InFlightMonitor;
