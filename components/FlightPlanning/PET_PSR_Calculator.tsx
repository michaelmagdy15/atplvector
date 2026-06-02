import React, { useState } from 'react';
import { View } from '../../types';
import { ChevronLeft, Compass, Info, AlertTriangle, CheckCircle, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  onChangeView: (view: View) => void;
}

const PET_PSR_Calculator: React.FC<Props> = ({ onChangeView }) => {
  // Inputs
  const [totalDistance, setTotalDistance] = useState(600); // NM
  const [tas, setTas] = useState(240); // KT
  const [windComponent, setWindComponent] = useState(30); // KT (+ = Tailwind out, - = Headwind out)
  const [endurance, setEndurance] = useState(4.5); // Hours

  // Calculations
  // Outbound groundspeed
  const gsOut = tas + windComponent;
  // Homebound groundspeed
  const gsHome = tas - windComponent;

  // Point of Equal Time (PET)
  // d_PET = D * H / (O + H)
  const dPet = (totalDistance * gsHome) / (gsOut + gsHome);
  const tPet = dPet / gsOut; // Hours
  const tPetMins = tPet * 60;

  // Point of Safe Return (PSR)
  // t_PSR = E * H / (O + H)
  const tPsr = (endurance * gsHome) / (gsOut + gsHome);
  const tPsrMins = tPsr * 60;
  const dPsr = tPsr * gsOut; // NM

  // Calculations for display
  const halfDistance = totalDistance / 2;
  const petOffsetPercent = (dPet / totalDistance) * 100;
  const psrOffsetPercent = Math.min(100, (dPsr / totalDistance) * 100);

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
      <div className="glass-panel p-8 md:p-12 rounded-3xl border border-blue-500/20 relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="p-4 bg-blue-500/20 rounded-2xl text-blue-400">
            <Compass size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">PET & PSR Critical Point Simulator</h1>
        </div>
        <p className="text-slate-300 text-lg max-w-2xl leading-relaxed relative z-10">
          Simulate en-route critical points. Calculate the **Point of Equal Time (PET)** and **Point of Safe Return (PSR)** dynamically under varying wind factors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Inputs (5/12) */}
        <div className="lg:col-span-5 bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-white/5 space-y-6">
          <h3 className="text-xl font-bold text-white border-b border-white/5 pb-3">Parameter Controls</h3>

          {/* Distance */}
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono">
              <span>TOTAL SECTOR DISTANCE (D)</span>
              <span className="text-white font-bold">{totalDistance} NM</span>
            </div>
            <input 
              type="range" 
              min="200" 
              max="1500" 
              step="50" 
              value={totalDistance} 
              onChange={e => setTotalDistance(Number(e.target.value))} 
              className="w-full accent-blue-500" 
            />
          </div>

          {/* TAS */}
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono">
              <span>TRUE AIRSPEED (TAS)</span>
              <span className="text-white font-bold">{tas} KT</span>
            </div>
            <input 
              type="range" 
              min="120" 
              max="450" 
              step="10" 
              value={tas} 
              onChange={e => setTas(Number(e.target.value))} 
              className="w-full accent-blue-500" 
            />
          </div>

          {/* Wind Component */}
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono">
              <span>OUTBOUND WIND COMPONENT</span>
              <span className={`font-bold ${windComponent > 0 ? 'text-emerald-400' : windComponent < 0 ? 'text-red-400' : 'text-white'}`}>
                {windComponent > 0 ? `+${windComponent} KT Tailwind` : windComponent < 0 ? `${windComponent} KT Headwind` : '0 KT (Calm)'}
              </span>
            </div>
            <input 
              type="range" 
              min="-80" 
              max="80" 
              step="5" 
              value={windComponent} 
              onChange={e => setWindComponent(Number(e.target.value))} 
              className="w-full accent-blue-500" 
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>Headwind Out</span>
              <span>No Wind</span>
              <span>Tailwind Out</span>
            </div>
          </div>

          {/* Endurance */}
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono">
              <span>SAFE FUEL ENDURANCE (E)</span>
              <span className="text-white font-bold">{endurance.toFixed(1)} Hours</span>
            </div>
            <input 
              type="range" 
              min="1.5" 
              max="8.0" 
              step="0.1" 
              value={endurance} 
              onChange={e => setEndurance(Number(e.target.value))} 
              className="w-full accent-blue-500" 
            />
          </div>

          {/* Groundspeeds output */}
          <div className="p-4 bg-slate-950/60 rounded-2xl border border-white/5 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Groundspeed Calculations</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900 p-3 rounded-xl border border-white/5 text-center">
                <span className="text-[10px] text-slate-500 block">GS OUTBOUND (O)</span>
                <span className="text-lg font-bold text-white font-mono">{gsOut} KT</span>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-white/5 text-center">
                <span className="text-[10px] text-slate-500 block">GS HOMEWARD (H)</span>
                <span className="text-lg font-bold text-white font-mono">{gsHome} KT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visualizer & Formulas (7/12) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Visual Scale Dashboard */}
          <div className="bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-white/5">
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
              <Navigation className="text-blue-400 rotate-90" />
              Flight Path Critical Points
            </h3>

            {/* Visual Bar */}
            <div className="relative pt-12 pb-16 px-4">
              {/* Main Line */}
              <div className="h-2 w-full bg-slate-800 rounded-full"></div>

              {/* Halfway point marker */}
              <div className="absolute left-1/2 top-11 -translate-x-1/2 flex flex-col items-center">
                <div className="w-0.5 h-4 bg-slate-700"></div>
                <span className="text-[10px] text-slate-500 font-mono mt-1">Midpoint ({halfDistance} NM)</span>
              </div>

              {/* Departure */}
              <div className="absolute left-4 top-11 flex flex-col items-center">
                <div className="w-1.5 h-4 bg-slate-400"></div>
                <span className="text-[10px] text-slate-400 font-bold mt-1">DEP (0 NM)</span>
              </div>

              {/* Destination */}
              <div className="absolute right-4 top-11 flex flex-col items-center">
                <div className="w-1.5 h-4 bg-slate-400"></div>
                <span className="text-[10px] text-slate-400 font-bold mt-1">DEST ({totalDistance} NM)</span>
              </div>

              {/* PET Pin */}
              <motion.div 
                animate={{ left: `calc(${petOffsetPercent}% + 16px - ${petOffsetPercent * 0.32}px)` }} 
                className="absolute top-2 -translate-x-1/2 flex flex-col items-center z-10 cursor-pointer"
              >
                <div className="bg-blue-500 text-black font-black text-[9px] px-1.5 py-0.5 rounded shadow-lg shadow-blue-500/20">PET</div>
                <div className="w-0.5 h-10 bg-blue-500 shadow-md"></div>
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-slate-900 mt-[-2px]"></div>
                <span className="text-[10px] text-blue-400 font-mono font-bold mt-1">{Math.round(dPet)} NM</span>
              </motion.div>

              {/* PSR Pin */}
              <motion.div 
                animate={{ left: `calc(${psrOffsetPercent}% + 16px - ${psrOffsetPercent * 0.32}px)` }} 
                className="absolute top-16 -translate-x-1/2 flex flex-col items-center z-10 cursor-pointer"
              >
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900"></div>
                <div className="w-0.5 h-10 bg-red-500 shadow-md"></div>
                <div className="bg-red-500 text-black font-black text-[9px] px-1.5 py-0.5 rounded shadow-lg shadow-red-500/20">PSR</div>
                <span className="text-[10px] text-red-400 font-mono font-bold mt-1">{Math.round(dPsr)} NM</span>
              </motion.div>
            </div>

            {/* Analysis text */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/5">
              <div className="bg-slate-950/40 p-4 rounded-2xl border border-white/5 space-y-2">
                <span className="text-xs text-slate-500 block uppercase tracking-wider">Point of Equal Time (PET)</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-blue-400 font-mono">{Math.round(dPet)}</span>
                  <span className="text-xs text-slate-400">NM from DEP</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Time to reach PET: **{Math.floor(tPetMins)} mins**. Returning home or continuing takes exactly **{Math.floor(totalDistance - dPet) / gsOut * 60 === tPetMins ? Math.floor(tPetMins) : Math.round((totalDistance - dPet) / gsOut * 60)} mins**.
                </p>
              </div>

              <div className="bg-slate-950/40 p-4 rounded-2xl border border-white/5 space-y-2">
                <span className="text-xs text-slate-500 block uppercase tracking-wider">Point of Safe Return (PSR)</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-red-400 font-mono">{Math.round(dPsr)}</span>
                  <span className="text-xs text-slate-400">NM from DEP</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Fly out time to PSR: **{Math.floor(tPsrMins)} mins**. Point of no return. Past this point, you cannot return to departure aerodrome safely.
                </p>
              </div>
            </div>

            {/* Safety advisory */}
            {dPsr < dPet ? (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-start gap-3 mt-6">
                <AlertTriangle className="text-red-400 w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-xs text-red-200 leading-relaxed">
                  <strong>CRITICAL FLIGHT PLAN WARNING:</strong> The Point of Safe Return (PSR: {Math.round(dPsr)} NM) occurs BEFORE the Point of Equal Time (PET: {Math.round(dPet)} NM). You will run out of safe fuel return options before reaching the equal-time decision point! Increase fuel endurance or replan route.
                </div>
              </div>
            ) : (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-start gap-3 mt-6">
                <CheckCircle className="text-emerald-400 w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-200 leading-relaxed">
                  <strong>Safety Status Normal:</strong> PSR occurs after PET. You have sufficient fuel to reach the equal-time decision boundary and return to departure safely if an emergency occurs.
                </div>
              </div>
            )}
          </div>

          {/* Formulas & Syllabus Notes */}
          <div className="bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-white/5 space-y-4">
            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">EASA Mathematical Foundations</h4>
            <div className="space-y-4 text-slate-300 text-xs">
              <div className="p-3 bg-slate-950/60 rounded-xl font-mono">
                <span className="text-blue-400 block mb-1">Point of Equal Time (PET) Formula</span>
                <span className="text-white text-sm">d_PET = D * H / (O + H)</span>
                <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                  Where **D** is total distance, **O** is Groundspeed Out, and **H** is Groundspeed Home. **Wind shifts PET towards the direction of departure** (into wind component shifts it further away, with-wind component shifts it closer).
                </p>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl font-mono">
                <span className="text-red-400 block mb-1">Point of Safe Return (PSR) Formula</span>
                <span className="text-white text-sm">t_PSR = E * H / (O + H)</span>
                <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                  Where **E** is Safe Endurance (available fuel minus reserve margins). The distance to PSR is **d_PSR = t_PSR * O**.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PET_PSR_Calculator;
