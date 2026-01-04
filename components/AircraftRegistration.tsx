import React from 'react';
import { PenTool, Plane, Tag } from 'lucide-react';

const AircraftRegistration: React.FC = () => {
  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Tag className="text-indigo-400" />
          Nationality & Registration (Annex 7)
        </h2>
        <p className="text-slate-400 text-sm">Rules for displaying marks on aircraft.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
         {/* Visual */}
         <div className="bg-slate-900 rounded-xl p-8 relative flex items-center justify-center border border-slate-700 min-h-[300px]">
            {/* Simple Plane SVG */}
            <svg viewBox="0 0 400 300" className="w-full h-full drop-shadow-lg">
               {/* Fuselage */}
               <path d="M 50,150 Q 50,130 100,130 L 300,130 L 350,100 L 380,100 L 320,135 L 380,140 L 380,160 L 320,165 L 350,200 L 300,200 L 100,170 Q 50,170 50,150" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
               {/* Wing (Underneath View) */}
               <path d="M 150,150 L 100,280 L 150,280 L 250,150" fill="#94a3b8" stroke="#475569" strokeWidth="2" opacity="0.8" />
               
               {/* Registration Marks */}
               {/* Fuselage Mark */}
               <text x="250" y="160" fontSize="16" fontWeight="bold" fill="#1e293b" transform="rotate(0)">G-ABCD</text>
               <line x1="245" y1="165" x2="310" y2="165" stroke="red" strokeWidth="1" />
               <text x="250" y="180" fontSize="10" fill="red">Height ≥ 30cm</text>

               {/* Wing Mark */}
               <text x="120" y="250" fontSize="20" fontWeight="bold" fill="#1e293b" transform="rotate(-70 120,250)">G-ABCD</text>
               <text x="160" y="270" fontSize="10" fill="red">Height ≥ 50cm</text>
            </svg>
         </div>

         {/* Rules */}
         <div className="space-y-6">
            <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
               <h3 className="font-bold text-white mb-3 text-lg">Format</h3>
               <div className="flex items-center gap-2 mb-4">
                  <div className="bg-indigo-600 text-white px-3 py-2 rounded font-mono font-bold text-xl">G</div>
                  <div className="text-slate-500">-</div>
                  <div className="bg-slate-700 text-white px-3 py-2 rounded font-mono font-bold text-xl">ABCD</div>
               </div>
               <ul className="text-sm text-slate-300 space-y-2">
                  <li><strong className="text-indigo-400">Nationality Mark:</strong> Selected from ITU callsigns (e.g., G for UK, N for USA).</li>
                  <li><strong className="text-slate-400">Common Mark:</strong> Allocated by ICAO if aircraft owned by joint international agency.</li>
                  <li><strong className="text-white">Hyphen:</strong> Must follow nationality mark.</li>
               </ul>
            </div>

            <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
               <h3 className="font-bold text-white mb-3 text-lg">Placement & Size</h3>
               <div className="space-y-3 text-sm text-slate-300">
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                     <span>Wings (LHS Bottom)</span>
                     <span className="font-bold text-white">≥ 50 cm</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                     <span>Fuselage (Sides) OR Tail</span>
                     <span className="font-bold text-white">≥ 30 cm</span>
                  </div>
                  <div className="mt-2 bg-slate-800 p-3 rounded text-xs">
                     Also requires a <strong>Fireproof Plate</strong> made of steel/metal secured to the aircraft (usually near main door) identifying the owner/reg.
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AircraftRegistration;