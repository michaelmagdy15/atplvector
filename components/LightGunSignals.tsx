import React, { useState } from 'react';
import { Crosshair, Zap, Plane, Truck, Eye } from 'lucide-react';

const LightGunSignals: React.FC = () => {
  const [receiver, setReceiver] = useState<'air' | 'ground' | 'vehicle'>('air');
  const [signal, setSignal] = useState<'steady-green' | 'flash-green' | 'steady-red' | 'flash-red' | 'flash-white' | 'alt-red-green'>('steady-green');

  // Logic map based on Annex 14 / provided image
  const getMeaning = () => {
    if (receiver === 'air') {
       switch(signal) {
          case 'steady-green': return "Cleared to Land";
          case 'flash-green': return "Return for Landing";
          case 'steady-red': return "Give Way to other aircraft and continue circling";
          case 'flash-red': return "Aerodrome Unsafe, Do Not Land";
          case 'flash-white': return "Land at this aerodrome and proceed to apron"; // Technically usually implies "Not applicable" in some simple charts but in standard ICAO: Land at this aerodrome...
          case 'alt-red-green': return "Exercise Extreme Caution";
       }
    } else if (receiver === 'ground') { // Aircraft on ground
       switch(signal) {
          case 'steady-green': return "Cleared for Takeoff";
          case 'flash-green': return "Cleared to Taxi";
          case 'steady-red': return "STOP";
          case 'flash-red': return "Taxi clear of landing area in use";
          case 'flash-white': return "Return to starting point on aerodrome";
          case 'alt-red-green': return "Exercise Extreme Caution";
       }
    } else { // Vehicle
       switch(signal) {
          case 'steady-green': return "Cleared to Cross runway or taxiway";
          case 'flash-green': return "Cleared to Taxi/Proceed"; // Image says "Cleared to taxi (aircraft only)" but usually implies proceed for vehicles
          case 'steady-red': return "STOP";
          case 'flash-red': return "Clear runway or taxiway immediately";
          case 'flash-white': return "Return to starting point";
          case 'alt-red-green': return "Exercise Extreme Caution";
       }
    }
    return "";
  };

  // Visual CSS helper
  const getLightClass = () => {
     switch(signal) {
        case 'steady-green': return 'bg-green-500 shadow-[0_0_50px_lime]';
        case 'flash-green': return 'bg-green-500 shadow-[0_0_50px_lime] animate-pulse';
        case 'steady-red': return 'bg-red-600 shadow-[0_0_50px_red]';
        case 'flash-red': return 'bg-red-600 shadow-[0_0_50px_red] animate-pulse';
        case 'flash-white': return 'bg-white shadow-[0_0_50px_white] animate-pulse';
        case 'alt-red-green': return 'bg-gradient-to-r from-red-500 to-green-500 animate-pulse shadow-[0_0_50px_orange]'; // Simplified visual for alternating
     }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Crosshair className="text-emerald-400" />
          ATC Light Gun Signals
        </h2>
        <p className="text-slate-400 text-sm">
          Visual communication from the Tower when radio communications fail.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
         {/* Controls */}
         <div className="space-y-6 order-2 md:order-1">
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
               <h3 className="font-bold text-slate-300 mb-3 text-xs uppercase">1. Select Receiver</h3>
               <div className="flex gap-2">
                  <button onClick={() => setReceiver('air')} className={`flex-1 py-3 rounded flex flex-col items-center gap-2 border transition-all ${receiver === 'air' ? 'bg-sky-600 border-sky-500 text-white' : 'bg-slate-800 border-slate-600 text-slate-400'}`}>
                     <Plane size={20} className="-rotate-12" />
                     <span className="text-xs font-bold">In Flight</span>
                  </button>
                  <button onClick={() => setReceiver('ground')} className={`flex-1 py-3 rounded flex flex-col items-center gap-2 border transition-all ${receiver === 'ground' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-600 text-slate-400'}`}>
                     <Plane size={20} />
                     <span className="text-xs font-bold">On Ground</span>
                  </button>
                  <button onClick={() => setReceiver('vehicle')} className={`flex-1 py-3 rounded flex flex-col items-center gap-2 border transition-all ${receiver === 'vehicle' ? 'bg-orange-600 border-orange-500 text-white' : 'bg-slate-800 border-slate-600 text-slate-400'}`}>
                     <Truck size={20} />
                     <span className="text-xs font-bold">Vehicle</span>
                  </button>
               </div>
            </div>

            <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
               <h3 className="font-bold text-slate-300 mb-3 text-xs uppercase">2. Select Signal</h3>
               <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setSignal('steady-green')} className={`p-2 rounded border flex items-center gap-2 ${signal === 'steady-green' ? 'bg-slate-700 border-green-500 text-white' : 'bg-slate-800 border-slate-600 text-slate-400'}`}>
                     <div className="w-4 h-4 bg-green-500 rounded-full"></div> <span className="text-xs font-bold">Steady Green</span>
                  </button>
                  <button onClick={() => setSignal('flash-green')} className={`p-2 rounded border flex items-center gap-2 ${signal === 'flash-green' ? 'bg-slate-700 border-green-500 text-white' : 'bg-slate-800 border-slate-600 text-slate-400'}`}>
                     <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div> <span className="text-xs font-bold">Flashing Green</span>
                  </button>
                  <button onClick={() => setSignal('steady-red')} className={`p-2 rounded border flex items-center gap-2 ${signal === 'steady-red' ? 'bg-slate-700 border-red-500 text-white' : 'bg-slate-800 border-slate-600 text-slate-400'}`}>
                     <div className="w-4 h-4 bg-red-600 rounded-full"></div> <span className="text-xs font-bold">Steady Red</span>
                  </button>
                  <button onClick={() => setSignal('flash-red')} className={`p-2 rounded border flex items-center gap-2 ${signal === 'flash-red' ? 'bg-slate-700 border-red-500 text-white' : 'bg-slate-800 border-slate-600 text-slate-400'}`}>
                     <div className="w-4 h-4 bg-red-600 rounded-full animate-pulse"></div> <span className="text-xs font-bold">Flashing Red</span>
                  </button>
                  <button onClick={() => setSignal('flash-white')} className={`p-2 rounded border flex items-center gap-2 ${signal === 'flash-white' ? 'bg-slate-700 border-white text-white' : 'bg-slate-800 border-slate-600 text-slate-400'}`}>
                     <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div> <span className="text-xs font-bold">Flashing White</span>
                  </button>
                  <button onClick={() => setSignal('alt-red-green')} className={`p-2 rounded border flex items-center gap-2 ${signal === 'alt-red-green' ? 'bg-slate-700 border-yellow-500 text-white' : 'bg-slate-800 border-slate-600 text-slate-400'}`}>
                     <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-green-500 rounded-full"></div> <span className="text-xs font-bold">Alternating</span>
                  </button>
               </div>
            </div>
         </div>

         {/* Visual Output */}
         <div className="flex flex-col order-1 md:order-2">
            <div className="relative bg-black rounded-t-xl border-x border-t border-slate-600 h-[250px] overflow-hidden group">
               {/* Background Context */}
               <div className={`absolute inset-0 opacity-30 ${receiver === 'air' ? 'bg-gradient-to-b from-sky-900 to-slate-900' : 'bg-slate-900'}`}>
                  {receiver === 'air' ? (
                     <div className="w-full h-full flex items-end justify-center pb-10">
                        <div className="w-24 h-40 bg-slate-800/80 mx-auto clip-path-tower"></div>
                     </div>
                  ) : (
                     <div className="w-full h-full flex items-end justify-center">
                        <div className="w-full h-1/3 bg-slate-800"></div> {/* Ground */}
                        <div className="absolute bottom-10 w-32 h-64 bg-slate-800 border border-slate-600 flex items-center justify-center">
                           <div className="w-20 h-10 bg-sky-900/50 border border-sky-500/30"></div> {/* Tower Windows */}
                        </div>
                     </div>
                  )}
               </div>

               {/* The Light Signal */}
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`w-16 h-16 rounded-full blur-md opacity-90 transition-all duration-200 ${getLightClass()}`}></div>
                  <div className={`absolute w-8 h-8 rounded-full bg-white opacity-80 ${getLightClass()}`}></div>
               </div>

               {/* Viewfinder Overlay */}
               <div className="absolute inset-0 border-2 border-slate-500/20 rounded-t-xl pointer-events-none flex items-center justify-center">
                  <Eye className="text-white/20 w-32 h-32" />
               </div>
            </div>

            {/* Meaning Card */}
            <div className="bg-slate-900 p-6 rounded-b-xl border border-slate-600 text-center">
               <p className="text-xs text-slate-400 uppercase font-bold mb-2">Meaning for {receiver === 'air' ? 'Aircraft in Flight' : receiver === 'ground' ? 'Aircraft on Ground' : 'Vehicle'}</p>
               <p className="text-xl font-black text-white animate-in zoom-in duration-300 key-{signal}-{receiver}">
                  "{getMeaning()}"
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default LightGunSignals;