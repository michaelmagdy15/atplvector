
import React, { useState } from 'react';
import { User, Truck, AlertTriangle, ArrowRight, ArrowLeft, StopCircle, PlayCircle } from 'lucide-react';

const GroundOperations: React.FC = () => {
  const [signal, setSignal] = useState('marshall');

  const marshallingSignals = [
    { id: 'start', name: 'Start Engines', desc: 'Circular motion of right hand at head level.', action: 'Rotate' },
    { id: 'stop', name: 'Stop', desc: 'Arms crossed above head.', action: 'Cross' },
    { id: 'left', name: 'Turn Left', desc: 'Right arm moves, Left arm points.', action: 'Left' },
    { id: 'right', name: 'Turn Right', desc: 'Left arm moves, Right arm points.', action: 'Right' },
    { id: 'chocks', name: 'Chocks Inserted', desc: 'Arms down, palms facing inwards, swing arms inwards.', action: 'In' },
    { id: 'cut', name: 'Cut Engines', desc: 'Hand moves across throat.', action: 'Cut' },
  ];

  const [activeSignal, setActiveSignal] = useState(marshallingSignals[1]); // Default Stop

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Truck className="text-orange-500" />
            Ground Operations (Annex 14/2)
          </h2>
          <p className="text-slate-400 text-sm">Marshalling Signals & Apron Safety.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Marshalling Simulator */}
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 flex flex-col items-center">
           <h3 className="font-bold text-white mb-6 uppercase text-sm tracking-widest">Marshaller Visual</h3>
           
           {/* The Stick Figure */}
           <div className="relative w-48 h-64 bg-slate-800 rounded-lg flex items-center justify-center mb-8 border border-slate-700 shadow-inner overflow-hidden">
              <div className="absolute inset-0 bg-black/20"></div>
              
              {/* Body */}
              <div className="w-16 h-24 bg-orange-500 rounded-lg relative z-10 mx-auto mt-10">
                 {/* Head */}
                 <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-10 h-10 bg-yellow-200 rounded-full border-2 border-orange-600"></div>
                 {/* Vest Stripes */}
                 <div className="w-full h-2 bg-yellow-400 mt-4"></div>
                 <div className="w-full h-2 bg-yellow-400 mt-4"></div>
                 
                 {/* Arms Container */}
                 <div className="absolute top-2 w-full h-4">
                    {/* Left Arm (Viewer's Left) */}
                    <div className={`absolute left-0 w-20 h-3 bg-orange-600 origin-right transition-all duration-500 rounded-full flex items-center justify-start
                        ${activeSignal.id === 'stop' ? '-rotate-45 -translate-x-16 -translate-y-12' : ''}
                        ${activeSignal.id === 'left' ? 'rotate-0 -translate-x-16' : ''}
                        ${activeSignal.id === 'right' ? '-rotate-90 -translate-x-16' : ''}
                        ${activeSignal.id === 'start' ? 'rotate-90 -translate-x-12' : ''}
                        ${activeSignal.id === 'cut' ? 'rotate-0 -translate-x-8 translate-y-8' : ''}
                        ${activeSignal.id === 'chocks' ? 'rotate-45 -translate-x-12 translate-y-20' : ''}
                    `}>
                        <div className="w-8 h-3 bg-yellow-400 rounded-l-full"></div> {/* Wand/Hand */}
                    </div>

                    {/* Right Arm (Viewer's Right) */}
                    <div className={`absolute right-0 w-20 h-3 bg-orange-600 origin-left transition-all duration-500 rounded-full flex items-center justify-end
                        ${activeSignal.id === 'stop' ? 'rotate-45 translate-x-16 -translate-y-12' : ''}
                        ${activeSignal.id === 'left' ? 'rotate-90 translate-x-16' : ''}
                        ${activeSignal.id === 'right' ? 'rotate-0 translate-x-16' : ''}
                        ${activeSignal.id === 'start' ? '-rotate-45 translate-x-12 -translate-y-12 animate-pulse' : ''}
                        ${activeSignal.id === 'cut' ? 'rotate-0 translate-x-8 translate-y-8' : ''}
                        ${activeSignal.id === 'chocks' ? '-rotate-45 translate-x-12 translate-y-20' : ''}
                    `}>
                        <div className="w-8 h-3 bg-yellow-400 rounded-r-full"></div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Controls */}
           <div className="grid grid-cols-2 gap-2 w-full">
              {marshallingSignals.map(sig => (
                 <button 
                    key={sig.id}
                    onClick={() => setActiveSignal(sig)}
                    className={`p-2 rounded text-xs font-bold transition-all ${activeSignal.id === sig.id ? 'bg-orange-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                 >
                    {sig.name}
                 </button>
              ))}
           </div>
           <div className="mt-4 p-3 bg-slate-800 rounded border border-slate-600 text-center w-full min-h-[60px]">
              <p className="text-white font-bold text-sm">{activeSignal.name}</p>
              <p className="text-xs text-slate-400 mt-1">{activeSignal.desc}</p>
           </div>
        </div>

        {/* Safety & Info */}
        <div className="space-y-6">
           <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                 <AlertTriangle className="text-red-500" size={18} /> Danger Zones
              </h3>
              <div className="space-y-4">
                 <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-red-900/20 rounded-full flex items-center justify-center border border-red-500/50">
                       <span className="text-red-500 font-black text-xs">JET</span>
                    </div>
                    <div>
                       <p className="font-bold text-white text-sm">Jet Blast / Intake</p>
                       <p className="text-xs text-slate-400">Stay clear of intake (suction) and exhaust (blast/heat). Anti-collision light ON means engine running or imminent start.</p>
                    </div>
                 </div>
                 <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-orange-900/20 rounded-full flex items-center justify-center border border-orange-500/50">
                       <span className="text-orange-500 font-black text-xs">PROP</span>
                    </div>
                    <div>
                       <p className="font-bold text-white text-sm">Propellers</p>
                       <p className="text-xs text-slate-400">Always approach from behind wings if possible. Never walk through arc.</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                 <Truck className="text-sky-500" size={18} /> Refueling Safety
              </h3>
              <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4">
                 <li>No smoking within <strong>15m</strong>.</li>
                 <li><strong>Bonding</strong> wire attached before cap removal (Dissipate static).</li>
                 <li>Passengers onboard? allowed if:
                    <ul className="list-[square] pl-4 mt-1 text-slate-400">
                       <li>Crew stationed at doors.</li>
                       <li>"Fasten Seatbelt" signs OFF.</li>
                       <li>"No Smoking" signs ON.</li>
                       <li>Ground area clear for evacuation.</li>
                    </ul>
                 </li>
              </ul>
           </div>
        </div>

      </div>
    </div>
  );
};

export default GroundOperations;
