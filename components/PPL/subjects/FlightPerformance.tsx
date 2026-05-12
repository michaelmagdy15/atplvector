import React, { useState } from 'react';
import { View } from '../../../types';
import { ChevronLeft, TrendingUp, Scale, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  onChangeView: (view: View) => void;
}

const FlightPerformance: React.FC<Props> = ({ onChangeView }) => {
  const [frontSeatWt, setFrontSeatWt] = useState(350);
  const [rearSeatWt, setRearSeatWt] = useState(0);
  const [baggageWt, setBaggageWt] = useState(20);
  const [fuelGals, setFuelGals] = useState(40);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'wb' | 'performance'>('wb');

  // Density Altitude State
  const [elevation, setElevation] = useState(0);
  const [altimeter, setAltimeter] = useState(29.92);
  const [temperature, setTemperature] = useState(15);


  // Constants for a generic C172-like aircraft
  const emptyWeight = 1600;
  const emptyMoment = 62400; // ARM approx 39
  
  const frontArm = 37;
  const rearArm = 73;
  const baggageArm = 95;
  const fuelArm = 48;
  const fuelWeightPerGal = 6;

  const maxTakeoffWeight = 2400;
  
  // Calculate Moments
  const frontMoment = frontSeatWt * frontArm;
  const rearMoment = rearSeatWt * rearArm;
  const baggageMoment = baggageWt * baggageArm;
  const fuelWeight = fuelGals * fuelWeightPerGal;
  const fuelMoment = fuelWeight * fuelArm;

  const totalWeight = emptyWeight + frontSeatWt + rearSeatWt + baggageWt + fuelWeight;
  const totalMoment = emptyMoment + frontMoment + rearMoment + baggageMoment + fuelMoment;
  const cg = totalMoment / totalWeight;

  // W&B Envelope (Simplified Utility & Normal category envelope)
  const isOverweight = totalWeight > maxTakeoffWeight;
  const isCgForward = cg < 35 || (totalWeight > 1950 && cg < 35 + ((totalWeight - 1950) * 0.01));
  const isCgAft = cg > 47.3;
  const isSafe = !isOverweight && !isCgForward && !isCgAft;

  // Density Altitude Calculations
  const pressureAltitude = elevation + (29.92 - altimeter) * 1000;
  const standardTemp = 15 - (pressureAltitude / 1000 * 2);
  const densityAltitude = pressureAltitude + (120 * (temperature - standardTemp));

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in duration-700">
      <button 
        onClick={() => onChangeView(View.PPL_DASHBOARD)}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
        Back to Dashboard
      </button>

      <div className="glass-panel p-8 md:p-12 rounded-3xl border border-yellow-500/20 relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
        
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="p-4 bg-yellow-500/20 rounded-2xl text-yellow-400">
            <TrendingUp size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Flight Performance</h1>
        </div>
        
        <p className="text-slate-300 text-lg max-w-2xl leading-relaxed relative z-10">
          Calculate Weight and Balance (W&B) to ensure the aircraft is within the center of gravity envelope. Analyze takeoff, climb, and cruise performance.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab('wb')}
          className={`px-6 py-3 rounded-xl font-bold transition-all ${
            activeTab === 'wb' 
              ? 'bg-yellow-500 text-slate-900 shadow-[0_0_20px_rgba(234,179,8,0.4)]' 
              : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          Weight & Balance
        </button>
        <button
          onClick={() => setActiveTab('performance')}
          className={`px-6 py-3 rounded-xl font-bold transition-all ${
            activeTab === 'performance' 
              ? 'bg-yellow-500 text-slate-900 shadow-[0_0_20px_rgba(234,179,8,0.4)]' 
              : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          Density Altitude
        </button>
      </div>

      {activeTab === 'wb' && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">
        
        {/* W&B Calculator Inputs */}
        <div className="bg-slate-900/50 p-8 rounded-3xl border border-white/5 space-y-8">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
             <Scale className="text-yellow-400" />
             <h3 className="text-2xl font-bold text-white">Weight & Balance Loader</h3>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <label className="text-slate-400 font-bold uppercase">Front Seats (lbs)</label>
                <span className="text-white font-mono">{frontSeatWt}</span>
              </div>
              <input 
                type="range" 
                min="0" max="400" 
                value={frontSeatWt} 
                onChange={(e) => setFrontSeatWt(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <label className="text-slate-400 font-bold uppercase">Rear Seats (lbs)</label>
                <span className="text-white font-mono">{rearSeatWt}</span>
              </div>
              <input 
                type="range" 
                min="0" max="400" 
                value={rearSeatWt} 
                onChange={(e) => setRearSeatWt(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <label className="text-slate-400 font-bold uppercase">Baggage (lbs)</label>
                <span className="text-white font-mono">{baggageWt}</span>
              </div>
              <input 
                type="range" 
                min="0" max="120" 
                value={baggageWt} 
                onChange={(e) => setBaggageWt(Number(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <label className="text-slate-400 font-bold uppercase">Fuel (Gallons)</label>
                <span className="text-white font-mono">{fuelGals} Gal / {fuelWeight} lbs</span>
              </div>
              <input 
                type="range" 
                min="0" max="53" 
                value={fuelGals} 
                onChange={(e) => setFuelGals(Number(e.target.value))}
                className="w-full accent-orange-500"
              />
            </div>
          </div>

          {/* Results Summary */}
          <div className={`p-6 rounded-2xl border ${isSafe ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'} mt-8 transition-colors`}>
            <div className="flex items-center gap-3 mb-4">
              {isSafe ? <CheckCircle className="text-emerald-400" /> : <AlertTriangle className="text-red-400" />}
              <h4 className={`text-lg font-bold ${isSafe ? 'text-emerald-400' : 'text-red-400'}`}>
                {isSafe ? 'Within Safe Limits' : 'Out of Limits'}
              </h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-sm">Total Weight</p>
                <p className={`text-2xl font-black font-mono ${isOverweight ? 'text-red-400' : 'text-white'}`}>
                  {totalWeight} <span className="text-sm font-normal">lbs</span>
                </p>
                {isOverweight && <p className="text-xs text-red-400 mt-1">Exceeds {maxTakeoffWeight} lbs</p>}
              </div>
              <div>
                <p className="text-slate-400 text-sm">Center of Gravity</p>
                <p className={`text-2xl font-black font-mono ${(isCgForward || isCgAft) ? 'text-red-400' : 'text-white'}`}>
                  {cg.toFixed(2)} <span className="text-sm font-normal">in</span>
                </p>
                {isCgForward && <p className="text-xs text-red-400 mt-1">Too far forward</p>}
                {isCgAft && <p className="text-xs text-red-400 mt-1">Too far aft</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Visual Envelope */}
        <div className="bg-slate-900/50 p-8 rounded-3xl border border-white/5 flex flex-col items-center justify-center relative min-h-[400px]">
          <h3 className="text-xl font-bold text-white mb-6 w-full text-center">Center of Gravity Envelope</h3>
          
          <div className="relative w-full max-w-sm aspect-square bg-slate-800 rounded-xl border-2 border-slate-700 overflow-hidden">
            {/* Envelope Grid */}
            <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 opacity-10 pointer-events-none">
               {[...Array(16)].map((_, i) => <div key={i} className="border border-white" />)}
            </div>

            {/* Approximate Normal Category Envelope polygon */}
            {/* X-axis: 35 to 48 (Range = 13) */}
            {/* Y-axis: 1500 to 2400 (Range = 900) */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none">
               <polygon 
                 points="0,100 0,50 30,0 95,0 95,100" 
                 fill="#3b82f6" 
               />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center opacity-50 font-bold text-blue-400 uppercase tracking-widest text-sm pointer-events-none">
              Normal Category Envelope
            </div>

            {/* Current CG Plot Point */}
            {/* Mapping CG (34-49) to X (0-100%) */}
            {/* Mapping Weight (1400-2500) to Y (100-0%) */}
            <motion.div 
              animate={{ 
                left: `${Math.max(0, Math.min(100, ((cg - 34) / 15) * 100))}%`,
                top: `${Math.max(0, Math.min(100, 100 - ((totalWeight - 1400) / 1100) * 100))}%`
              }}
              className="absolute w-4 h-4 -ml-2 -mt-2 rounded-full border-2 border-slate-900 z-10 shadow-lg"
              style={{ backgroundColor: isSafe ? '#10b981' : '#ef4444' }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            />
          </div>

          <div className="w-full flex justify-between mt-4 text-xs text-slate-500 font-mono">
            <span>CG 34"</span>
            <span>CG 49"</span>
          </div>
          <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-slate-500 font-mono transform origin-center">
            Weight (lbs)
          </div>
        </div>

      </div>
      )}

      {activeTab === 'performance' && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">
        <div className="bg-slate-900/50 p-8 rounded-3xl border border-white/5 space-y-8">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
             <TrendingUp className="text-yellow-400" />
             <h3 className="text-2xl font-bold text-white">Atmospheric Conditions</h3>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <label className="text-slate-400 font-bold uppercase">Field Elevation (ft)</label>
                <span className="text-white font-mono">{elevation}</span>
              </div>
              <input 
                type="range" 
                min="0" max="10000" step="100"
                value={elevation} 
                onChange={(e) => setElevation(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <label className="text-slate-400 font-bold uppercase">Altimeter Setting (inHg)</label>
                <span className="text-white font-mono">{altimeter.toFixed(2)}</span>
              </div>
              <input 
                type="range" 
                min="28.00" max="31.00" step="0.01"
                value={altimeter} 
                onChange={(e) => setAltimeter(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <label className="text-slate-400 font-bold uppercase">Outside Air Temp (°C)</label>
                <span className="text-white font-mono">{temperature}</span>
              </div>
              <input 
                type="range" 
                min="-20" max="50" step="1"
                value={temperature} 
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full accent-orange-500"
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700 mt-8">
            <h4 className="text-lg font-bold text-white mb-4">Results</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-sm">Pressure Altitude</p>
                <p className="text-2xl font-black font-mono text-white">
                  {Math.round(pressureAltitude)} <span className="text-sm font-normal">ft</span>
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Density Altitude</p>
                <p className={`text-2xl font-black font-mono ${densityAltitude > elevation + 2000 ? 'text-orange-400' : 'text-blue-400'}`}>
                  {Math.round(densityAltitude)} <span className="text-sm font-normal">ft</span>
                </p>
              </div>
            </div>
            {densityAltitude > elevation + 2000 && (
              <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg flex items-start gap-2">
                <AlertTriangle className="text-orange-400 shrink-0 w-5 h-5" />
                <p className="text-sm text-orange-200">High density altitude significantly degrades takeoff and climb performance.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Visual DA indicator */}
        <div className="bg-slate-900/50 p-8 rounded-3xl border border-white/5 flex flex-col items-center justify-center relative min-h-[400px]">
          <h3 className="text-xl font-bold text-white mb-6 w-full text-center">Performance Impact</h3>
          
          <div className="relative w-full max-w-xs h-64 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden flex flex-col justify-end p-4">
            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 via-transparent to-transparent pointer-events-none" />
            
            {/* Mountain / Ground representation */}
            <div className="absolute bottom-0 left-0 w-full h-8 bg-slate-700 rounded-t-lg" />
            
            {/* Plane showing takeoff climb gradient */}
            {/* A higher DA means a shallower climb angle */}
            {/* Calculate a pseudo climb angle based on DA */}
            {(() => {
              const baseClimbAngle = 15; // degrees at sea level standard
              const degradation = Math.max(0, densityAltitude / 1000); // lose 1 degree per 1000ft DA
              const currentClimbAngle = Math.max(2, baseClimbAngle - degradation);
              
              return (
                <motion.div 
                  className="absolute bottom-8 left-4 text-white flex items-center"
                  animate={{ 
                    rotate: -currentClimbAngle,
                    y: [-10, -80],
                    x: [0, 200]
                  }}
                  transition={{ 
                    duration: 3 + (densityAltitude / 5000), // Takes longer to climb at higher DA
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <ArrowRight className="w-8 h-8 text-blue-400" />
                </motion.div>
              );
            })()}
            
            <div className="mt-auto relative z-10 text-center">
              <p className="text-slate-300 font-medium">Takeoff Distance & Climb</p>
              <p className="text-xs text-slate-500 mt-1">Animation represents climb gradient</p>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default FlightPerformance;
