import React, { useState } from 'react';
import { Plane, AlertOctagon, Info } from 'lucide-react';

const RWSL: React.FC = () => {
  const [scenario, setScenario] = useState<'clear' | 'landing' | 'crossing'>('clear');

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <AlertOctagon className="text-red-500" />
          Runway Status Lights (RWSL)
        </h2>
        <p className="text-slate-400 text-sm">
          Automated system providing direct warning to pilots and vehicles when it is unsafe to enter, cross, or take off from a runway.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Visualizer */}
        <div className="bg-slate-900 rounded-xl p-4 border border-slate-700 relative h-[400px] overflow-hidden flex items-center justify-center">
           {/* Runway */}
           <div className="absolute w-full h-32 bg-slate-700 flex items-center">
              {/* Centerline */}
              <div className="w-full h-0 border-t-2 border-dashed border-white"></div>
              
              {/* THL Lights (Takeoff Hold Lights) - On Runway Centerline */}
              {scenario === 'crossing' && (
                 <div className="absolute left-10 flex gap-8">
                    {[...Array(5)].map((_, i) => (
                       <div key={i} className="w-3 h-3 bg-red-600 rounded-full shadow-[0_0_10px_red] animate-pulse"></div>
                    ))}
                 </div>
              )}
           </div>

           {/* Taxiway (Bottom to Top crossing) */}
           <div className="absolute h-full w-24 bg-slate-800 border-x border-slate-600 left-1/2 -translate-x-1/2 flex flex-col items-center">
              {/* Taxi Centerline */}
              <div className="h-full w-0 border-l-2 border-yellow-400"></div>

              {/* REL Lights (Runway Entrance Lights) - At Hold Short */}
              {/* Bottom Hold */}
              <div className="absolute bottom-[35%] flex gap-2">
                 <div className={`w-2 h-2 rounded-full ${scenario === 'landing' || scenario === 'crossing' ? 'bg-red-600 shadow-[0_0_8px_red] animate-pulse' : 'bg-slate-600'}`}></div>
                 <div className={`w-2 h-2 rounded-full ${scenario === 'landing' || scenario === 'crossing' ? 'bg-red-600 shadow-[0_0_8px_red] animate-pulse' : 'bg-slate-600'}`}></div>
                 <div className={`w-2 h-2 rounded-full ${scenario === 'landing' || scenario === 'crossing' ? 'bg-red-600 shadow-[0_0_8px_red] animate-pulse' : 'bg-slate-600'}`}></div>
              </div>
              
              {/* Top Hold */}
              <div className="absolute top-[35%] flex gap-2">
                 <div className={`w-2 h-2 rounded-full ${scenario === 'landing' ? 'bg-red-600 shadow-[0_0_8px_red] animate-pulse' : 'bg-slate-600'}`}></div>
                 <div className={`w-2 h-2 rounded-full ${scenario === 'landing' ? 'bg-red-600 shadow-[0_0_8px_red] animate-pulse' : 'bg-slate-600'}`}></div>
                 <div className={`w-2 h-2 rounded-full ${scenario === 'landing' ? 'bg-red-600 shadow-[0_0_8px_red] animate-pulse' : 'bg-slate-600'}`}></div>
              </div>
           </div>

           {/* Traffic Animation */}
           {scenario === 'landing' && (
              <div className="absolute w-full h-full pointer-events-none">
                 <div className="absolute top-1/2 -translate-y-1/2 left-0 animate-[flyby_4s_linear_infinite] flex items-center text-white font-bold">
                    <Plane className="rotate-90 text-emerald-400" size={32} />
                    <span className="ml-2 bg-black/50 px-1 rounded text-xs">Landing Traffic</span>
                 </div>
              </div>
           )}

           {scenario === 'crossing' && (
              <div className="absolute w-full h-full pointer-events-none">
                 <div className="absolute left-1/2 -translate-x-1/2 top-0 animate-[taxi_5s_linear_infinite] flex flex-col items-center text-white font-bold">
                    <Plane className="rotate-180 text-orange-400" size={32} />
                    <span className="mt-1 bg-black/50 px-1 rounded text-xs">Crossing</span>
                 </div>
              </div>
           )}

           {/* User Aircraft (Waiting to Takeoff or Enter) */}
           <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 p-2 rounded border border-white/20">
              <Plane className="rotate-90 text-white" size={24} />
              <div className="text-[8px] text-center text-white mt-1">YOU</div>
           </div>
           <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 p-2 rounded border border-white/20">
              <Plane className="text-white" size={24} />
              <div className="text-[8px] text-center text-white mt-1">YOU</div>
           </div>
        </div>

        {/* Controls & Info */}
        <div className="space-y-6">
           <div className="flex gap-2">
              <button 
                 onClick={() => setScenario('clear')} 
                 className={`flex-1 py-2 rounded text-sm font-bold border transition-colors ${scenario === 'clear' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-800 border-slate-600 text-slate-400'}`}
              >
                 Runway Clear
              </button>
              <button 
                 onClick={() => setScenario('landing')} 
                 className={`flex-1 py-2 rounded text-sm font-bold border transition-colors ${scenario === 'landing' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-600 text-slate-400'}`}
              >
                 High Speed Landing
              </button>
              <button 
                 onClick={() => setScenario('crossing')} 
                 className={`flex-1 py-2 rounded text-sm font-bold border transition-colors ${scenario === 'crossing' ? 'bg-orange-600 border-orange-500 text-white' : 'bg-slate-800 border-slate-600 text-slate-400'}`}
              >
                 Traffic Crossing
              </button>
           </div>

           <div className="space-y-4">
              <div className={`p-4 rounded-lg border-l-4 transition-all ${scenario === 'landing' || scenario === 'crossing' ? 'bg-red-900/20 border-red-500' : 'bg-slate-800 border-slate-600'}`}>
                 <h3 className="font-bold text-white mb-2 flex items-center gap-2">REL (Runway Entrance Lights)</h3>
                 <p className="text-sm text-slate-300">
                    Red lights at taxiway hold lines.
                    <br/>
                    <strong>Status:</strong> {scenario !== 'clear' ? <span className="text-red-500 font-bold">ILLUMINATED (DO NOT ENTER)</span> : <span className="text-slate-500">OFF (Clearance Required)</span>}
                 </p>
                 <p className="text-xs text-slate-400 mt-2">Activates when high speed traffic is detected on the runway or approaching the threshold.</p>
              </div>

              <div className={`p-4 rounded-lg border-l-4 transition-all ${scenario === 'crossing' ? 'bg-red-900/20 border-red-500' : 'bg-slate-800 border-slate-600'}`}>
                 <h3 className="font-bold text-white mb-2 flex items-center gap-2">THL (Takeoff Hold Lights)</h3>
                 <p className="text-sm text-slate-300">
                    Red lights on the runway centerline.
                    <br/>
                    <strong>Status:</strong> {scenario === 'crossing' ? <span className="text-red-500 font-bold">ILLUMINATED (STOP TAKEOFF)</span> : <span className="text-slate-500">OFF</span>}
                 </p>
                 <p className="text-xs text-slate-400 mt-2">Activates when another aircraft/vehicle is detected crossing or occupying the runway ahead.</p>
              </div>
           </div>

           <div className="bg-slate-900 p-4 rounded text-xs text-slate-400 flex gap-2">
              <Info size={16} className="shrink-0 text-sky-400" />
              <p>RWSL is an independent safety layer. It does not substitute ATC clearance. If ATC clears you but lights are RED, <strong>do not proceed</strong> and query ATC. If lights are OFF, you still need ATC clearance.</p>
           </div>
        </div>
      </div>
      
      <style>{`
         @keyframes flyby {
            0% { left: -10%; }
            100% { left: 110%; }
         }
         @keyframes taxi {
            0% { top: -10%; }
            100% { top: 110%; }
         }
      `}</style>
    </div>
  );
};

export default RWSL;