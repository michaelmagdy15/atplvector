import React, { useState } from 'react';
import { ArrowDownRight, Flag, PlaneLanding, Mountain } from 'lucide-react';

const InstrumentApproach: React.FC = () => {
  const [activeSegment, setActiveSegment] = useState<number | null>(null);

  const segments = [
    { id: 1, name: 'Arrival', desc: 'En-route to Initial Approach Fix (IAF). MOC (Obstacle Clearance) = 1000ft.', width: '20%', color: 'bg-slate-700' },
    { id: 2, name: 'Initial', desc: 'IAF to Intermediate Fix (IF). Manoeuvring to align. MOC = 1000ft.', width: '20%', color: 'bg-slate-600' },
    { id: 3, name: 'Intermediate', desc: 'IF to Final Approach Fix (FAF). Slowing down, configuring. MOC = 500ft.', width: '20%', color: 'bg-slate-500' },
    { id: 4, name: 'Final', desc: 'FAF to MAPt (Missed Approach Point). Alignment and descent for landing.', width: '20%', color: 'bg-sky-600' },
    { id: 5, name: 'Missed Approach', desc: 'MAPt to MAF. Go-around procedure if visual reference not established.', width: '20%', color: 'bg-red-500' },
  ];

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <PlaneLanding className="text-teal-400" />
          Instrument Approach Segments (PANS-OPS)
        </h2>
        <p className="text-slate-400 text-sm">The 5 phases of an Instrument Approach Procedure.</p>
      </div>

      {/* Visual Diagram */}
      <div className="relative h-64 bg-slate-900 rounded-xl border border-slate-700 overflow-hidden mb-8 flex items-end">
         {/* Segments */}
         {segments.map((seg, i) => (
            <div 
               key={seg.id}
               className={`h-full border-r border-slate-800 relative transition-all duration-300 hover:opacity-100 ${activeSegment && activeSegment !== seg.id ? 'opacity-30' : 'opacity-80'}`}
               style={{ width: seg.width }}
               onMouseEnter={() => setActiveSegment(seg.id)}
               onMouseLeave={() => setActiveSegment(null)}
            >
               {/* Background / Terrain clearance visualization */}
               <div className={`absolute bottom-0 w-full ${seg.color}`} style={{ height: `${20 + (5-i)*10}%` }}></div>
               
               {/* Label */}
               <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center w-full px-2">
                  <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-xs font-bold text-white mx-auto mb-2">
                     {seg.id}
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 uppercase block">{seg.name}</span>
               </div>

               {/* Fix Points */}
               <div className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 z-10">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
               </div>
            </div>
         ))}
         
         {/* Flight Path Line */}
         <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <polyline 
               points="0,50 200,50 400,100 600,150 800,220 1000,50" 
               fill="none" 
               stroke="white" 
               strokeWidth="2" 
               strokeDasharray="5,5" 
               className="opacity-50"
            />
         </svg>
      </div>

      {/* Info Card */}
      <div className="grid grid-cols-1 gap-4">
         {activeSegment ? (
            <div className="bg-slate-700 p-6 rounded-lg border-l-4 border-teal-400 animate-in fade-in slide-in-from-top-2">
               <h3 className="text-xl font-bold text-white mb-2">{segments[activeSegment - 1].name} Segment</h3>
               <p className="text-slate-300">{segments[activeSegment - 1].desc}</p>
            </div>
         ) : (
            <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700 text-center text-slate-500">
               <ArrowDownRight className="mx-auto mb-2 opacity-50" />
               Hover over a segment to view details
            </div>
         )}
      </div>
    </div>
  );
};

export default InstrumentApproach;