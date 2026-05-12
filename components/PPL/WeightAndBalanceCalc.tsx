import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Scale, AlertTriangle, CheckCircle2, User, Luggage, Fuel } from 'lucide-react';

const AIRCRAFT = {
  emptyWeight: 1600, // lbs
  emptyMoment: 60800, // in-lbs (CG = 38)
  maxTakeoffWeight: 2550, // lbs
  arms: {
    frontSeats: 37,
    rearSeats: 73,
    baggage: 95,
    fuel: 48, // Usable fuel arm
  }
};

// Simplified C172-like CG Envelope (Weight vs CG)
// Points: [CG, Weight]
const ENVELOPE_POINTS = [
  [35.0, 1500],
  [35.0, 1950],
  [38.5, 2550], // Max Gross Normal Category
  [47.3, 2550],
  [47.3, 1500],
];

// SVG ViewBox mapping
const X_MIN = 33;
const X_MAX = 50;
const Y_MIN = 1400;
const Y_MAX = 2700;

const WeightAndBalanceCalc: React.FC = () => {
  const [frontPax, setFrontPax] = useState<number>(340); // 2 standard adults (170 lbs each)
  const [rearPax, setRearPax] = useState<number>(0);
  const [baggage, setBaggage] = useState<number>(50);
  const [fuelGals, setFuelGals] = useState<number>(40); // 40 gallons usable

  const fuelWeight = fuelGals * 6; // 6 lbs per gallon

  const totalWeight = AIRCRAFT.emptyWeight + frontPax + rearPax + baggage + fuelWeight;
  const totalMoment = 
    AIRCRAFT.emptyMoment + 
    (frontPax * AIRCRAFT.arms.frontSeats) + 
    (rearPax * AIRCRAFT.arms.rearSeats) + 
    (baggage * AIRCRAFT.arms.baggage) + 
    (fuelWeight * AIRCRAFT.arms.fuel);
  
  const currentCG = totalMoment / totalWeight;

  // Simple point in polygon check (since envelope is convex)
  const isWithinEnvelope = () => {
    if (totalWeight > AIRCRAFT.maxTakeoffWeight) return false;
    if (currentCG < 35.0 || currentCG > 47.3) return false;
    if (totalWeight > 1950 && currentCG < 35.0 + ((totalWeight - 1950) / (2550 - 1950)) * (38.5 - 35.0)) return false;
    return true;
  };

  const isSafe = isWithinEnvelope();

  // SVG Mapping Helpers
  const mapX = (x: number) => ((x - X_MIN) / (X_MAX - X_MIN)) * 100;
  const mapY = (y: number) => 100 - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * 100;

  const envelopePath = ENVELOPE_POINTS.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${mapX(p[0])} ${mapY(p[1])}`
  ).join(' ') + ' Z';

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row gap-8">
        
        {/* Left: Load Stations */}
        <div className="flex-1 bg-slate-900 border border-slate-800 p-8 rounded-3xl">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Scale className="text-lime-400" /> Loading Stations
          </h3>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="flex justify-between text-sm font-bold text-slate-300">
                <span className="flex items-center gap-2"><User size={16}/> Front Seats</span>
                <span className="text-white font-mono">{frontPax} lbs</span>
              </label>
              <input
                type="range" min="0" max="400" step="10"
                value={frontPax} onChange={(e) => setFrontPax(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-lime-500"
              />
              <div className="text-[10px] text-slate-500 text-right font-mono">Arm: {AIRCRAFT.arms.frontSeats}"</div>
            </div>

            <div className="space-y-2">
              <label className="flex justify-between text-sm font-bold text-slate-300">
                <span className="flex items-center gap-2"><User size={16}/> Rear Seats</span>
                <span className="text-white font-mono">{rearPax} lbs</span>
              </label>
              <input
                type="range" min="0" max="400" step="10"
                value={rearPax} onChange={(e) => setRearPax(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-lime-500"
              />
              <div className="text-[10px] text-slate-500 text-right font-mono">Arm: {AIRCRAFT.arms.rearSeats}"</div>
            </div>

            <div className="space-y-2">
              <label className="flex justify-between text-sm font-bold text-slate-300">
                <span className="flex items-center gap-2"><Luggage size={16}/> Baggage Area</span>
                <span className="text-white font-mono">{baggage} lbs</span>
              </label>
              <input
                type="range" min="0" max="120" step="5"
                value={baggage} onChange={(e) => setBaggage(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-lime-500"
              />
              <div className="text-[10px] text-slate-500 text-right font-mono">Arm: {AIRCRAFT.arms.baggage}" | Max: 120 lbs</div>
            </div>

            <div className="space-y-2">
              <label className="flex justify-between text-sm font-bold text-slate-300">
                <span className="flex items-center gap-2"><Fuel size={16}/> Usable Fuel</span>
                <span className="text-white font-mono">{fuelGals} gal ({fuelWeight} lbs)</span>
              </label>
              <input
                type="range" min="0" max="53" step="1"
                value={fuelGals} onChange={(e) => setFuelGals(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-lime-500"
              />
              <div className="text-[10px] text-slate-500 text-right font-mono">Arm: {AIRCRAFT.arms.fuel}" | 6 lbs/gal</div>
            </div>
          </div>
        </div>

        {/* Right: CG Envelope and Results */}
        <div className="flex-[1.5] space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl relative">
            <h3 className="text-xl font-bold text-white mb-6">CG Envelope</h3>
            
            {/* SVG Envelope Chart */}
            <div className="w-full aspect-video bg-slate-950 rounded-xl border border-slate-800 relative overflow-hidden">
               {/* Axis Grid lines (simplified) */}
               <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 opacity-10 pointer-events-none">
                 {Array.from({length: 16}).map((_, i) => <div key={i} className="border-r border-b border-white"/>)}
               </div>
               
               <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                 {/* The Envelope */}
                 <path
                   d={envelopePath}
                   fill="rgba(132, 204, 22, 0.1)"
                   stroke="#84cc16"
                   strokeWidth="0.5"
                   vectorEffect="non-scaling-stroke"
                 />
                 
                 {/* The Current Point */}
                 <motion.circle
                   cx={mapX(currentCG)}
                   cy={mapY(totalWeight)}
                   r="1.5"
                   fill={isSafe ? "#84cc16" : "#ef4444"}
                   animate={{ 
                     cx: mapX(currentCG),
                     cy: mapY(totalWeight)
                   }}
                   transition={{ type: "spring", stiffness: 100, damping: 15 }}
                   className="drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                 />
               </svg>

               {/* Axes Labels */}
               <div className="absolute bottom-1 left-2 text-[10px] text-slate-500 font-mono text-center w-full">CG Location (inches aft of datum)</div>
               <div className="absolute top-1/2 -left-3 text-[10px] text-slate-500 font-mono -rotate-90 origin-center whitespace-nowrap">Weight (lbs)</div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div className="bg-slate-800/50 p-4 rounded-xl text-center">
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Total Weight</div>
                <div className={`text-lg font-bold font-mono ${totalWeight > AIRCRAFT.maxTakeoffWeight ? 'text-red-400' : 'text-white'}`}>
                  {totalWeight} <span className="text-xs text-slate-500">lbs</span>
                </div>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-xl text-center">
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Total Moment</div>
                <div className="text-lg font-bold font-mono text-white">
                  {Math.round(totalMoment/100)/10} <span className="text-xs text-slate-500">k</span>
                </div>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-xl text-center">
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">CG Location</div>
                <div className={`text-lg font-bold font-mono ${!isSafe ? 'text-red-400' : 'text-white'}`}>
                  {currentCG.toFixed(1)}<span className="text-xs text-slate-500">"</span>
                </div>
              </div>
              <div className={`p-4 rounded-xl flex flex-col justify-center items-center gap-2 ${isSafe ? 'bg-lime-500/20 text-lime-400 border border-lime-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                {isSafe ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
                <div className="text-xs font-bold uppercase">{isSafe ? 'Within Limits' : 'Out of Limits'}</div>
              </div>
            </div>

          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
            <h4 className="font-bold text-white mb-2">FAA Ground Lesson - Performance</h4>
            <p className="text-sm text-slate-300">
              Understanding weight and balance is critical for safety. Operating outside the CG envelope compromises aircraft stability, increases stall speed, and can make recovery from a stall or spin impossible.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default WeightAndBalanceCalc;
