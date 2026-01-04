import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Settings } from 'lucide-react';

const AltimeterVisualizer: React.FC = () => {
  const [altitude, setAltitude] = useState(2500); // Current altitude in feet
  const TRANSITION_ALT = 3000;
  const TRANSITION_LEVEL = 4000; // Simplified for visual

  const isAboveTA = altitude > TRANSITION_ALT;
  const isAboveTL = altitude >= TRANSITION_LEVEL;
  const inLayer = altitude > TRANSITION_ALT && altitude < TRANSITION_LEVEL;

  // Determine correct setting
  const setting = isAboveTA ? 'SPS (1013 hPa)' : 'QNH (Local)';

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Settings className="text-slate-400" />
          Altimeter Procedures (Annex 2)
        </h2>
        <p className="text-slate-400 text-sm">Transition Altitude vs Transition Level.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-center">
         {/* Controls */}
         <div className="w-full md:w-1/3 space-y-6">
            <div>
               <label className="flex justify-between text-slate-400 text-sm mb-2">
                  <span>Current Altitude</span>
                  <span className="font-bold text-white">{altitude} ft</span>
               </label>
               <input 
                  type="range" 
                  min="0" 
                  max="6000" 
                  step="100"
                  value={altitude} 
                  onChange={(e) => setAltitude(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-white"
               />
            </div>

            <div className={`p-4 rounded-lg border-l-4 transition-colors ${isAboveTA ? 'bg-sky-900/30 border-sky-400' : 'bg-emerald-900/30 border-emerald-400'}`}>
               <p className="text-xs text-slate-400 uppercase font-bold mb-1">Required Setting</p>
               <p className={`text-2xl font-bold ${isAboveTA ? 'text-sky-400' : 'text-emerald-400'}`}>
                  {setting}
               </p>
               <p className="text-xs text-slate-300 mt-2">
                  {isAboveTA 
                     ? "You are climbing/cruising above Transition Altitude. Reference Standard Pressure (Flight Levels)." 
                     : "You are below Transition Altitude. Reference Mean Sea Level (Altitude)."}
               </p>
            </div>
         </div>

         {/* Visual Diagram */}
         <div className="w-full md:w-2/3 h-[300px] bg-slate-900 rounded-xl relative border border-slate-700 overflow-hidden">
            {/* Layers */}
            
            {/* Flight Level Space */}
            <div className="absolute top-0 left-0 w-full h-[33%] bg-sky-900/20 flex items-center justify-center border-b border-dashed border-sky-500/30">
               <span className="text-sky-500/50 font-bold uppercase tracking-widest">Flight Levels (SPS)</span>
            </div>
            {/* Transition Level Line */}
            <div className="absolute top-[33%] left-0 w-full border-t-2 border-slate-500 flex justify-between px-2">
               <span className="text-[10px] text-slate-400">Transition Level</span>
               <span className="text-[10px] text-slate-400">FL40</span>
            </div>

            {/* Transition Layer */}
            <div className="absolute top-[33%] left-0 w-full h-[17%] bg-slate-800/50 flex items-center justify-center">
               <span className="text-slate-600 font-bold uppercase text-xs">Transition Layer</span>
            </div>

            {/* Transition Altitude Line */}
            <div className="absolute top-[50%] left-0 w-full border-t-2 border-emerald-500 flex justify-between px-2">
               <span className="text-[10px] text-emerald-400 font-bold">Transition Altitude</span>
               <span className="text-[10px] text-emerald-400 font-bold">3000 ft</span>
            </div>

            {/* Altitude Space */}
            <div className="absolute top-[50%] left-0 w-full h-[50%] bg-emerald-900/10 flex items-end justify-center pb-4">
               {/* Terrain */}
               <div className="absolute bottom-0 left-0 w-full h-20 bg-emerald-800 rounded-tr-[100px]"></div>
               <span className="relative z-10 text-emerald-500/50 font-bold uppercase tracking-widest mb-10">Altitudes (QNH)</span>
            </div>

            {/* Aircraft Indicator */}
            <div 
               className="absolute left-1/2 -translate-x-1/2 w-32 flex items-center gap-2 transition-all duration-300 ease-out z-20"
               style={{ bottom: `${(altitude / 6000) * 100}%` }}
            >
               <div className="w-full h-[1px] bg-white/50"></div>
               <div className="bg-white text-slate-900 text-xs font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap">
                  {isAboveTA && !isAboveTL ? '⚠ In Layer' : (isAboveTA ? `FL${Math.round(altitude/100)}` : `${altitude} ft`)}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AltimeterVisualizer;