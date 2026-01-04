
import React, { useState } from 'react';
import { Plane, ArrowUpRight, PlaneLanding, MapPin, Radio } from 'lucide-react';

const PhraseologyExplorer: React.FC = () => {
  const [activePhase, setActivePhase] = useState('pushback');

  const phases = [
    { id: 'pushback', label: 'Pushback', icon: <Plane className="rotate-180" />, desc: 'Leaving the gate' },
    { id: 'departure', label: 'Departure', icon: <ArrowUpRight />, desc: 'Take-off & Climb' },
    { id: 'enroute', label: 'En-route', icon: <MapPin />, desc: 'Cruise & Reports' },
    { id: 'approach', label: 'Approach', icon: <PlaneLanding />, desc: 'Arrival & Landing' },
  ];

  return (
    <div className="max-w-4xl mx-auto bg-slate-800 rounded-xl overflow-hidden shadow-2xl border border-slate-700 mt-8 min-h-[600px] flex flex-col">
      <div className="bg-slate-900 p-6 border-b border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Radio className="text-emerald-400" /> Standard IFR Phraseology
        </h2>
        <p className="text-slate-400 text-sm">Mastering the standard calls for every phase of flight.</p>
      </div>

      <div className="flex flex-1 flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-slate-900/50 border-r border-slate-700 p-4">
          <div className="space-y-2">
            {phases.map(p => (
              <button
                key={p.id}
                onClick={() => setActivePhase(p.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left ${activePhase === p.id ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
              >
                {p.icon}
                <div>
                  <div className="font-bold text-sm">{p.label}</div>
                  <div className="text-[10px] opacity-70">{p.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 bg-slate-50 text-slate-900">
          
          {activePhase === 'pushback' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-xl font-black text-slate-800 uppercase border-b pb-2 border-slate-200">Pushback Phraseology</h3>
              
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold text-slate-400 uppercase">Pilot</span>
                  <p className="font-mono text-lg font-medium text-blue-700">"Ground, Fastair 345, Stand A1, Request Pushback."</p>
                </div>
                
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 shadow-sm ml-8">
                  <span className="text-xs font-bold text-slate-400 uppercase">ATC</span>
                  <p className="font-mono text-lg font-medium text-emerald-800">"Fastair 345, Pushback Approved, Facing West."</p>
                </div>

                <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                  <h4 className="font-bold text-yellow-800 text-sm mb-1">Important Note</h4>
                  <p className="text-sm text-yellow-700">
                    "Startup Approved" vs "Cleared Startup". ATC may approve startup but you must request pushback separately if not simultaneous.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activePhase === 'departure' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-xl font-black text-slate-800 uppercase border-b pb-2 border-slate-200">Departure Phraseology</h3>
              
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold text-slate-400 uppercase">Pilot</span>
                  <p className="font-mono text-lg font-medium text-blue-700">"Tower, Fastair 345, Ready for Departure."</p>
                </div>
                
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 shadow-sm ml-8">
                  <span className="text-xs font-bold text-slate-400 uppercase">ATC</span>
                  <p className="font-mono text-lg font-medium text-emerald-800">"Fastair 345, Cleared for Takeoff Runway 27, Wind 250 degrees 10 knots."</p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold text-slate-400 uppercase">Pilot (Readback Mandatory)</span>
                  <p className="font-mono text-lg font-medium text-blue-700">"Cleared for Takeoff Runway 27, Fastair 345."</p>
                </div>

                <div className="p-4 bg-sky-50 border-l-4 border-sky-400 rounded-r-lg">
                  <h4 className="font-bold text-sky-800 text-sm mb-1">Conditional Line-up</h4>
                  <p className="text-sm text-sky-700">
                    "BEHIND the landing A320, Line up Runway 27 BEHIND." <br/>
                    Condition must be read back in full.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activePhase === 'enroute' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-xl font-black text-slate-800 uppercase border-b pb-2 border-slate-200">En-route / Airways</h3>
              
              <div className="space-y-4">
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 shadow-sm ml-8">
                  <span className="text-xs font-bold text-slate-400 uppercase">ATC</span>
                  <p className="font-mono text-lg font-medium text-emerald-800">"Fastair 345, Climb Flight Level 240, Report passing FL150."</p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold text-slate-400 uppercase">Pilot</span>
                  <p className="font-mono text-lg font-medium text-blue-700">"Climb Flight Level 240, Wilco, Fastair 345."</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                   <div className="bg-slate-100 p-4 rounded border border-slate-200">
                      <h4 className="font-bold text-slate-700 text-sm mb-1">Level Change Report</h4>
                      <p className="text-xs text-slate-500 font-mono">"Leaving FL140, Climbing FL240"</p>
                   </div>
                   <div className="bg-slate-100 p-4 rounded border border-slate-200">
                      <h4 className="font-bold text-slate-700 text-sm mb-1">Maintain / Reach</h4>
                      <p className="text-xs text-slate-500 font-mono">"Maintain FL240" / "Reach FL240 by WPT"</p>
                   </div>
                </div>
              </div>
            </div>
          )}

          {activePhase === 'approach' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-xl font-black text-slate-800 uppercase border-b pb-2 border-slate-200">Approach & Landing</h3>
              
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold text-slate-400 uppercase">Pilot</span>
                  <p className="font-mono text-lg font-medium text-blue-700">"Approach, Fastair 345, Request Descent."</p>
                </div>
                
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 shadow-sm ml-8">
                  <span className="text-xs font-bold text-slate-400 uppercase">ATC</span>
                  <p className="font-mono text-lg font-medium text-emerald-800">"Fastair 345, Cleared ILS Approach Runway 09, Report Established."</p>
                </div>

                <div className="p-4 bg-orange-50 border-l-4 border-orange-400 rounded-r-lg">
                  <h4 className="font-bold text-orange-800 text-sm mb-1">Missed Approach</h4>
                  <p className="text-sm text-orange-700 font-mono">
                    "Going Around, Fastair 345." <br/>
                    ATC: "Fastair 345, Roger, Climb 3000ft, Contact Radar..."
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default PhraseologyExplorer;
