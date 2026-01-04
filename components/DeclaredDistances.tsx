import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Info } from 'lucide-react';

const DeclaredDistances: React.FC = () => {
  const [runwayLen, setRunwayLen] = useState(2000);
  const [stopway, setStopway] = useState(0);
  const [clearway, setClearway] = useState(0);
  const [dispThreshold, setDispThreshold] = useState(0);

  // Calculations
  const tora = runwayLen;
  const asda = tora + stopway;
  // TODA is TORA + Clearway, but Clearway for TODA calc is usually limited to 50% of TORA.
  const validClearway = Math.min(clearway, tora * 0.5); 
  const toda = tora + validClearway;
  const lda = tora - dispThreshold;

  // Scaling for visualization (max width approx 100%)
  const maxDist = 4000; 
  const scale = (val: number) => Math.min((val / maxDist) * 100, 100);

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <ArrowRight className="text-emerald-400" />
          Declared Distances
        </h2>
        <p className="text-slate-400 text-sm">Visualizing TORA, ASDA, TODA, and LDA.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Controls */}
        <div className="space-y-6 lg:col-span-1 bg-slate-900 p-5 rounded-lg border border-slate-700">
           <div>
              <label className="flex justify-between text-xs text-slate-400 mb-1">
                 Runway Length (TORA) <span className="text-white font-bold">{tora}m</span>
              </label>
              <input type="range" min="1000" max="3000" step="50" value={runwayLen} onChange={(e) => setRunwayLen(parseInt(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg cursor-pointer accent-white" />
           </div>
           
           <div>
              <label className="flex justify-between text-xs text-slate-400 mb-1">
                 Stopway (Yellow) <span className="text-yellow-400 font-bold">{stopway}m</span>
              </label>
              <input type="range" min="0" max="500" step="10" value={stopway} onChange={(e) => setStopway(parseInt(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg cursor-pointer accent-yellow-400" />
              <p className="text-[10px] text-slate-500 mt-1">Able to support aircraft during aborted takeoff.</p>
           </div>

           <div>
              <label className="flex justify-between text-xs text-slate-400 mb-1">
                 Clearway (Green) <span className="text-emerald-400 font-bold">{clearway}m</span>
              </label>
              <input type="range" min="0" max="1500" step="50" value={clearway} onChange={(e) => setClearway(parseInt(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg cursor-pointer accent-emerald-400" />
              <p className="text-[10px] text-slate-500 mt-1">Obstacle free plane for initial climb. Max 50% TORA.</p>
           </div>

           <div>
              <label className="flex justify-between text-xs text-slate-400 mb-1">
                 Displaced Threshold <span className="text-red-400 font-bold">{dispThreshold}m</span>
              </label>
              <input type="range" min="0" max="500" step="10" value={dispThreshold} onChange={(e) => setDispThreshold(parseInt(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg cursor-pointer accent-red-400" />
              <p className="text-[10px] text-slate-500 mt-1">Reduces LDA but TORA usually remains.</p>
           </div>
        </div>

        {/* Visualization */}
        <div className="lg:col-span-2 relative bg-slate-900 rounded-lg p-8 border border-slate-700 overflow-hidden flex flex-col justify-center min-h-[300px]">
           
           {/* Runway Strip Graphics */}
           <div className="relative h-16 w-full mb-12">
              {/* Displaced Threshold Area */}
              <div 
                 className="absolute top-0 left-0 h-full bg-slate-600 flex items-center justify-center border-r-2 border-white border-dashed z-10"
                 style={{ width: `${scale(dispThreshold)}%` }}
              >
                 {dispThreshold > 0 && <span className="text-[10px] text-white opacity-50 rotate-45">Disp</span>}
              </div>

              {/* Main TORA Pavement */}
              <div 
                 className="absolute top-0 left-0 h-full bg-slate-500 border-y-2 border-white/20"
                 style={{ width: `${scale(tora)}%` }}
              >
                 <div className="w-full h-full flex items-center justify-around">
                    <div className="h-1 w-8 bg-white"></div>
                    <div className="h-1 w-8 bg-white"></div>
                    <div className="h-1 w-8 bg-white"></div>
                 </div>
              </div>

              {/* Stopway */}
              {stopway > 0 && (
                 <div 
                    className="absolute top-0 h-full bg-[repeating-linear-gradient(45deg,_#eab308,_#eab308_10px,_#ca8a04_10px,_#ca8a04_20px)] opacity-80"
                    style={{ left: `${scale(tora)}%`, width: `${scale(stopway)}%` }}
                 >
                 </div>
              )}

              {/* Clearway */}
              {clearway > 0 && (
                 <div 
                    className="absolute -top-4 h-24 border-2 border-emerald-500/50 bg-emerald-500/10 flex items-center justify-center"
                    style={{ left: `${scale(tora)}%`, width: `${scale(clearway)}%` }}
                 >
                    <span className="text-[10px] text-emerald-400 font-bold -rotate-12">Clearway</span>
                 </div>
              )}
           </div>

           {/* Dimension Arrows */}
           <div className="space-y-4 font-mono text-xs font-bold">
              {/* TORA */}
              <div className="relative h-4">
                 <div className="absolute top-1/2 left-0 h-[2px] bg-white w-full" style={{ width: `${scale(tora)}%` }}></div>
                 <div className="absolute left-0 w-2 h-2 bg-white rounded-full -translate-y-[3px]"></div>
                 <div className="absolute right-0 w-2 h-2 bg-white rounded-full -translate-y-[3px]" style={{ left: `${scale(tora)}%` }}></div>
                 <span className="absolute top-[-15px] left-1/2 -translate-x-1/2 text-white">TORA {tora}m</span>
              </div>

              {/* ASDA */}
              <div className="relative h-4">
                 <div className="absolute top-1/2 left-0 h-[2px] bg-yellow-400 w-full" style={{ width: `${scale(asda)}%` }}></div>
                 <span className="absolute top-[-15px] left-1/2 -translate-x-1/2 text-yellow-400">ASDA {asda}m</span>
              </div>

              {/* TODA */}
              <div className="relative h-4">
                 <div className="absolute top-1/2 left-0 h-[2px] bg-emerald-400 w-full" style={{ width: `${scale(toda)}%` }}></div>
                 <span className="absolute top-[-15px] left-1/2 -translate-x-1/2 text-emerald-400">TODA {toda}m</span>
              </div>

              {/* LDA */}
              <div className="relative h-4">
                 <div className="absolute top-1/2 h-[2px] bg-red-400 w-full" style={{ left: `${scale(dispThreshold)}%`, width: `${scale(lda)}%` }}></div>
                 <span className="absolute top-[-15px] left-1/2 -translate-x-1/2 text-red-400">LDA {lda}m</span>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default DeclaredDistances;