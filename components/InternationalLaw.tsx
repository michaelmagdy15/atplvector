import React, { useState } from 'react';
import { Globe, Plane, Gavel, FileText, ArrowRight } from 'lucide-react';

const InternationalLaw: React.FC = () => {
  const [freedom, setFreedom] = useState(1);

  const freedoms = [
    { id: 1, title: '1st Freedom', desc: 'The right to fly over a foreign country without landing.', visual: 'A -> [Overfly B] -> C' },
    { id: 2, title: '2nd Freedom', desc: 'The right to refuel or carry out maintenance in a foreign country without embarking or disembarking passengers or cargo.', visual: 'A -> [Tech Stop B] -> C' },
    { id: 3, title: '3rd Freedom', desc: 'The right to fly from one\'s own country to another country.', visual: 'Home -> B' },
    { id: 4, title: '4th Freedom', desc: 'The right to fly from another country back to one\'s own country.', visual: 'B -> Home' },
    { id: 5, title: '5th Freedom', desc: 'The right to fly between two foreign countries on a flight originating or ending in one\'s own country.', visual: 'Home -> B -> C' },
  ];

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Gavel className="text-purple-400" />
          International Law & Conventions
        </h2>
        <p className="text-slate-400 text-sm">Chicago Convention (1944), Freedoms of the Air, and Liability.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Freedoms of the Air Visualizer */}
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-700">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <Plane className="text-sky-400" /> Freedoms of the Air
          </h3>
          
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {freedoms.map(f => (
              <button
                key={f.id}
                onClick={() => setFreedom(f.id)}
                className={`px-3 py-1 rounded text-xs font-bold whitespace-nowrap transition-all ${
                  freedom === f.id ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {f.id}{f.id === 1 ? 'st' : f.id === 2 ? 'nd' : f.id === 3 ? 'rd' : 'th'}
              </button>
            ))}
          </div>

          <div className="relative h-40 bg-slate-800/50 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
             {/* Simple visual representation */}
             <div className="flex items-center gap-8 text-sm font-bold">
                {freedom === 1 && (
                  <>
                    <div className="bg-indigo-600 p-2 rounded text-white">State A</div>
                    <ArrowRight className="text-slate-500" />
                    <div className="bg-slate-700 p-2 rounded text-slate-400 border border-dashed border-sky-500">State B (Overfly)</div>
                    <ArrowRight className="text-slate-500" />
                    <div className="bg-emerald-600 p-2 rounded text-white">State C</div>
                  </>
                )}
                {freedom === 2 && (
                  <>
                    <div className="bg-indigo-600 p-2 rounded text-white">State A</div>
                    <ArrowRight className="text-slate-500" />
                    <div className="bg-amber-600 p-2 rounded text-white">State B (Refuel)</div>
                    <ArrowRight className="text-slate-500" />
                    <div className="bg-emerald-600 p-2 rounded text-white">State C</div>
                  </>
                )}
                {freedom === 3 && (
                  <>
                    <div className="bg-indigo-600 p-2 rounded text-white">Home State</div>
                    <div className="w-12 h-0.5 bg-sky-500 relative">
                       <Plane size={16} className="absolute -top-2 left-1/2 -translate-x-1/2 text-white" />
                    </div>
                    <div className="bg-emerald-600 p-2 rounded text-white">State B</div>
                  </>
                )}
                {freedom === 4 && (
                  <>
                    <div className="bg-emerald-600 p-2 rounded text-white">State B</div>
                    <div className="w-12 h-0.5 bg-sky-500 relative">
                       <Plane size={16} className="absolute -top-2 left-1/2 -translate-x-1/2 text-white transform rotate-180" />
                    </div>
                    <div className="bg-indigo-600 p-2 rounded text-white">Home State</div>
                  </>
                )}
                {freedom === 5 && (
                  <>
                    <div className="bg-indigo-600 p-2 rounded text-white">Home</div>
                    <ArrowRight className="text-slate-500" />
                    <div className="bg-emerald-600 p-2 rounded text-white">State B</div>
                    <div className="w-12 h-0.5 bg-sky-500 relative">
                       <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] whitespace-nowrap">Pick Up Pax</span>
                    </div>
                    <div className="bg-purple-600 p-2 rounded text-white">State C</div>
                  </>
                )}
             </div>
          </div>

          <div className="bg-slate-800 p-4 rounded border-l-4 border-sky-500">
            <h4 className="font-bold text-white mb-1">{freedoms.find(f => f.id === freedom)?.title}</h4>
            <p className="text-sm text-slate-300">{freedoms.find(f => f.id === freedom)?.desc}</p>
          </div>
        </div>

        {/* Conventions Accordion */}
        <div className="space-y-4">
           <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
              <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                 <Globe size={16} className="text-purple-400" /> Chicago Convention (1944)
              </h3>
              <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4">
                 <li>Established <strong>ICAO</strong>.</li>
                 <li>Recognizes State Sovereignty over airspace.</li>
                 <li>Applies to <strong>Civil</strong> aircraft only (not State aircraft like Military/Police).</li>
                 <li>Established the 19 Annexes (SARPs).</li>
              </ul>
           </div>

           <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
              <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                 <FileText size={16} className="text-amber-400" /> Liability (Warsaw / Montreal)
              </h3>
              <p className="text-xs text-slate-400 mb-2">
                 <strong>Montreal Convention (1999)</strong> modernized the rules.
              </p>
              <ul className="text-xs text-slate-300 space-y-1">
                 <li className="flex justify-between"><span>Death/Injury:</span> <span className="text-emerald-400 font-mono">Strict Liability up to 113,100 SDR</span></li>
                 <li className="flex justify-between"><span>Cargo:</span> <span className="text-emerald-400 font-mono">19 SDR per kg</span></li>
                 <li className="flex justify-between"><span>Delay:</span> <span className="text-emerald-400 font-mono">Liability limited</span></li>
              </ul>
           </div>

           <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
              <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                 <Gavel size={16} className="text-red-400" /> Criminal Law (Tokyo 1963)
              </h3>
              <p className="text-xs text-slate-300">
                 Applies to offenses on board. The <strong>State of Registration</strong> has jurisdiction.
                 The PIC is empowered to restrain passengers if necessary for safety.
              </p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default InternationalLaw;