import React, { useState } from 'react';
import { Signpost, Eye, Maximize } from 'lucide-react';

const SignsAndSignals: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'signs' | 'signals'>('signs');

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Signpost className="text-orange-400" />
            Signs & Signals
          </h2>
          <p className="text-slate-400 text-sm">Visual communication on the movement area.</p>
        </div>

        <div className="flex bg-slate-900 p-1 rounded-lg">
          <button onClick={() => setActiveTab('signs')} className={`px-4 py-2 rounded-md font-bold text-sm ${activeTab === 'signs' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'}`}>Airport Signs</button>
          <button onClick={() => setActiveTab('signals')} className={`px-4 py-2 rounded-md font-bold text-sm ${activeTab === 'signals' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}>Signal Area</button>
        </div>
      </div>

      {activeTab === 'signs' && (
        <div className="grid md:grid-cols-2 gap-8 animate-in slide-in-from-left-4">
           {/* Mandatory Signs */}
           <div className="space-y-4">
              <h3 className="font-bold text-white text-lg border-b border-slate-700 pb-2">Mandatory Signs</h3>
              <p className="text-xs text-slate-400">White text on Red background. Identifying locations beyond which you shall not proceed without clearance.</p>
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="flex flex-col items-center gap-2">
                    <div className="bg-red-600 text-white px-4 py-2 text-2xl font-mono font-bold border-2 border-white rounded shadow-lg">
                       25-07
                    </div>
                    <span className="text-xs text-slate-300">Runway Designation</span>
                 </div>
                 <div className="flex flex-col items-center gap-2">
                    <div className="bg-red-600 text-white px-4 py-2 text-2xl font-mono font-bold border-2 border-white rounded shadow-lg">
                       NO ENTRY
                    </div>
                    <span className="text-xs text-slate-300">No Entry</span>
                 </div>
                 <div className="flex flex-col items-center gap-2">
                    <div className="bg-red-600 text-white px-4 py-2 text-xl font-mono font-bold border-2 border-white rounded shadow-lg">
                       25 CAT II
                    </div>
                    <span className="text-xs text-slate-300">Cat II Holding Point</span>
                 </div>
              </div>
           </div>

           {/* Information Signs */}
           <div className="space-y-4">
              <h3 className="font-bold text-white text-lg border-b border-slate-700 pb-2">Information Signs</h3>
              <p className="text-xs text-slate-400">Yellow/Black. Location (Yellow on Black) or Direction/Destination (Black on Yellow).</p>
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="flex flex-col items-center gap-2">
                    <div className="bg-black text-yellow-400 px-4 py-2 text-2xl font-mono font-bold border-2 border-yellow-400 rounded shadow-lg">
                       B
                    </div>
                    <span className="text-xs text-slate-300">Location (You are on B)</span>
                 </div>
                 <div className="flex flex-col items-center gap-2">
                    <div className="bg-yellow-400 text-black px-4 py-2 text-2xl font-mono font-bold border-2 border-black rounded shadow-lg flex items-center gap-2">
                       <span>A</span> <span className="text-xl">↖</span>
                    </div>
                    <span className="text-xs text-slate-300">Direction (A is Left)</span>
                 </div>
                 <div className="flex flex-col items-center gap-2">
                    <div className="bg-yellow-400 text-black px-4 py-2 text-xl font-mono font-bold border-2 border-black rounded shadow-lg">
                       APRON
                    </div>
                    <span className="text-xs text-slate-300">Destination</span>
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'signals' && (
         <div className="flex flex-col items-center animate-in slide-in-from-right-4">
            <div className="bg-emerald-600/20 p-8 rounded-xl border-4 border-white shadow-2xl relative w-64 h-64 flex items-center justify-center mb-6">
               <span className="absolute -top-6 bg-slate-900 px-2 text-xs text-slate-400">The Signal Square</span>
               
               {/* Signal Grid */}
               <div className="grid grid-cols-2 gap-8">
                  {/* Landing T */}
                  <div className="flex flex-col items-center group cursor-help">
                     <div className="text-white text-4xl font-black drop-shadow-md">T</div>
                     <div className="absolute opacity-0 group-hover:opacity-100 bottom-[-40px] left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] p-2 rounded whitespace-nowrap z-20">
                        Landing Direction
                     </div>
                  </div>

                  {/* Red Square Yellow Diagonal */}
                  <div className="flex flex-col items-center group cursor-help">
                     <div className="w-10 h-10 bg-red-600 relative border border-white">
                        <div className="absolute w-[140%] h-1 bg-yellow-400 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
                        <div className="absolute w-[140%] h-1 bg-yellow-400 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45"></div>
                     </div>
                     <div className="absolute opacity-0 group-hover:opacity-100 bottom-[-40px] left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] p-2 rounded whitespace-nowrap z-20">
                        Prohibited (Do not land)
                     </div>
                  </div>

                  {/* Dumbbell */}
                  <div className="flex flex-col items-center group cursor-help col-span-2">
                     <div className="flex items-center">
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                        <div className="w-10 h-1 bg-white"></div>
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                     </div>
                     <div className="absolute opacity-0 group-hover:opacity-100 bottom-[-40px] left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] p-2 rounded whitespace-nowrap z-20">
                        Land/Taxi on paved surfaces only
                     </div>
                  </div>
               </div>
            </div>
            
            <p className="text-sm text-slate-400 text-center max-w-md">
               Hover over the symbols in the square to see their meanings. The signal area must be visible from the air (at least 9m square).
            </p>
         </div>
      )}
    </div>
  );
};

export default SignsAndSignals;