import React, { useState } from 'react';
import { Lightbulb, Layout, ArrowUp, Plane } from 'lucide-react';

const AerodromeVisualizer: React.FC = () => {
  const [slope, setSlope] = useState(3); // 3 degrees is ideal
  
  // PAPI Logic
  // Ideal is usually 3 degrees.
  // > 3.5: White White White White (Too High)
  // 3.2 - 3.5: Red White White White
  // 2.8 - 3.2: Red Red White White (On Slope)
  // 2.5 - 2.8: Red Red Red White
  // < 2.5: Red Red Red Red (Too Low)

  const getPapiLights = (angle: number) => {
    if (angle > 3.5) return ['bg-white', 'bg-white', 'bg-white', 'bg-white'];
    if (angle > 3.1) return ['bg-red-600', 'bg-white', 'bg-white', 'bg-white'];
    if (angle > 2.8) return ['bg-red-600', 'bg-red-600', 'bg-white', 'bg-white']; // Ideal
    if (angle > 2.5) return ['bg-red-600', 'bg-red-600', 'bg-red-600', 'bg-white'];
    return ['bg-red-600', 'bg-red-600', 'bg-red-600', 'bg-red-600'];
  };

  const lights = getPapiLights(slope);

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Layout className="text-yellow-400" />
          Aerodromes (Annex 14)
        </h2>
        <p className="text-slate-400 text-sm">Visual Aids, Markings, and Lighting Systems.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* PAPI Simulator */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
           <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <Lightbulb className="text-yellow-400" /> PAPI Simulator
           </h3>
           
           <div className="bg-black p-8 rounded-lg flex justify-center gap-2 md:gap-4 mb-6 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] border border-slate-800 relative overflow-hidden">
              {/* Ground texture */}
              <div className="absolute bottom-0 w-full h-1/2 bg-emerald-900/20"></div>
              
              {lights.map((color, i) => (
                 <div key={i} className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${color} shadow-[0_0_30px_currentColor] transition-colors duration-300 relative z-10 border-4 border-gray-800`}></div>
              ))}
           </div>

           <div>
              <label className="flex justify-between text-slate-400 text-sm mb-2">
                 <span>Approach Angle</span>
                 <span className={`font-bold ${slope >= 2.8 && slope <= 3.2 ? 'text-emerald-400' : 'text-red-400'}`}>{slope.toFixed(1)}°</span>
              </label>
              <input 
                 type="range" 
                 min="2.0" 
                 max="4.0" 
                 step="0.1" 
                 value={slope} 
                 onChange={(e) => setSlope(parseFloat(e.target.value))}
                 className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-white"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                 <span>Low (Red)</span>
                 <span>Ideal (3°)</span>
                 <span>High (White)</span>
              </div>
           </div>
        </div>

        {/* Markings Info */}
        <div className="space-y-4">
           <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 h-full flex flex-col justify-center relative overflow-hidden">
              {/* Runway Graphic */}
              <div className="w-full h-32 bg-slate-800 relative flex items-center justify-center border-y-4 border-emerald-900/50">
                 {/* Centerline */}
                 <div className="absolute w-full h-0 border-t-2 border-dashed border-white opacity-50"></div>
                 
                 {/* Threshold Stripes (Piano Keys) */}
                 <div className="absolute left-4 flex flex-col gap-1">
                    {[...Array(8)].map((_,i) => <div key={i} className="w-8 h-1 bg-white"></div>)}
                 </div>

                 {/* Designator */}
                 <div className="absolute left-20 transform -rotate-90 text-white font-black text-2xl font-mono opacity-80">27</div>

                 {/* Touchdown Zone */}
                 <div className="absolute left-40 flex flex-col gap-8">
                    <div className="w-8 h-2 bg-white"></div>
                    <div className="w-8 h-2 bg-white"></div>
                 </div>
                 
                 {/* Aiming Point (Big Blocks) */}
                 <div className="absolute left-60 flex flex-col gap-4">
                    <div className="w-12 h-6 bg-white"></div>
                    <div className="w-12 h-6 bg-white"></div>
                 </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 text-xs text-slate-300">
                 <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-white border border-slate-600"></div> 
                    <span>White: Runway Markings</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-400 border border-slate-600"></div> 
                    <span>Yellow: Taxiway Markings</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500 shadow-[0_0_5px_lime]"></div> 
                    <span>Green Lights: Threshold / Centerline</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-500 shadow-[0_0_5px_red]"></div> 
                    <span>Red Lights: End / Stop Bars</span>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default AerodromeVisualizer;