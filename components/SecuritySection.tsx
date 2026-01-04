import React, { useState } from 'react';
import { Shield, Lock, Unlock, User, Plane, AlertOctagon, CheckSquare, Search, Eye, ScanLine } from 'lucide-react';

const SecuritySection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'responsibilities' | 'deck' | 'procedures'>('responsibilities');
  
  // Calculator State
  const [mtow, setMtow] = useState<number>(0);
  const [seats, setSeats] = useState<number>(0);

  const needsDoor = 
    mtow >= 54.5 || 
    (mtow >= 45 && seats >= 19) || 
    seats >= 60;

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Shield className="text-emerald-500" />
            Security (Annex 17)
          </h2>
          <p className="text-slate-400 text-sm">Safeguarding against unlawful interference.</p>
        </div>

        <div className="flex bg-slate-900 p-1 rounded-lg">
          <button onClick={() => setActiveTab('responsibilities')} className={`px-4 py-2 rounded-md font-bold text-sm ${activeTab === 'responsibilities' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}>Roles</button>
          <button onClick={() => setActiveTab('deck')} className={`px-4 py-2 rounded-md font-bold text-sm ${activeTab === 'deck' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}>Flight Deck</button>
          <button onClick={() => setActiveTab('procedures')} className={`px-4 py-2 rounded-md font-bold text-sm ${activeTab === 'procedures' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}>Procedures</button>
        </div>
      </div>

      {activeTab === 'responsibilities' && (
        <div className="grid md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="bg-slate-900/50 p-5 rounded-xl border-l-4 border-blue-500 hover:bg-slate-900 transition-colors group">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <span className="bg-blue-500/20 p-2 rounded text-blue-500 group-hover:scale-110 transition-transform"><AlertOctagon size={18} /></span> The State
            </h3>
            <ul className="text-sm text-slate-300 space-y-2">
              <li>• Must establish a <strong>National Aviation Security Program</strong>.</li>
              <li>• Designated Authority responsible for development (e.g., CAA).</li>
              <li>• Must be able to rapidly expand for threats.</li>
              <li>• <strong>Nat. Security Committee</strong> coordinates between airports, operators, and state.</li>
            </ul>
          </div>

          <div className="bg-slate-900/50 p-5 rounded-xl border-l-4 border-purple-500 hover:bg-slate-900 transition-colors group">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <span className="bg-purple-500/20 p-2 rounded text-purple-500 group-hover:scale-110 transition-transform"><Plane size={18} /></span> The Airport
            </h3>
            <ul className="text-sm text-slate-300 space-y-2">
              <li>• Must have a written <strong>Security Program</strong>.</li>
              <li>• Must have an <strong>Airport Security Committee</strong> to oversee implementation.</li>
              <li>• Defines <strong>Airside</strong> vs. <strong>Security Restricted Areas</strong> (priority risk).</li>
            </ul>
          </div>

          <div className="bg-slate-900/50 p-5 rounded-xl border-l-4 border-orange-500 hover:bg-slate-900 transition-colors group">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <span className="bg-orange-500/20 p-2 rounded text-orange-500 group-hover:scale-110 transition-transform"><User size={18} /></span> The Operator
            </h3>
            <ul className="text-sm text-slate-300 space-y-2">
              <li>• Must ensure personnel comply with security programs.</li>
              <li>• Must report unlawful acts immediately.</li>
              <li>• Mandatory <strong>Aircraft Search Checklist</strong>.</li>
              <li>• Cockpit doors must be lockable.</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'deck' && (
        <div className="flex flex-col md:flex-row gap-8 animate-in fade-in duration-500">
          <div className="w-full md:w-1/2 space-y-6">
            <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
              <h3 className="font-bold text-white mb-4">Does this flight need a Security Door?</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">MTOW (Tonnes)</label>
                  <input 
                    type="number" 
                    value={mtow} 
                    onChange={(e) => setMtow(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white focus:border-emerald-500 outline-none"
                    placeholder="e.g., 60"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Passenger Seats</label>
                  <input 
                    type="number" 
                    value={seats} 
                    onChange={(e) => setSeats(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white focus:border-emerald-500 outline-none"
                    placeholder="e.g., 20"
                  />
                </div>
              </div>

              <div className={`mt-6 p-4 rounded-lg flex items-center gap-4 transition-all duration-500 ${needsDoor ? 'bg-emerald-500/20 border border-emerald-500' : 'bg-slate-600/20 border border-slate-500'}`}>
                 <div className={`p-3 rounded-full transition-transform duration-500 ${needsDoor ? 'bg-emerald-500 text-white rotate-0' : 'bg-slate-500 text-slate-300 -rotate-12'}`}>
                    {needsDoor ? <Lock /> : <Unlock />}
                 </div>
                 <div>
                    <p className="font-bold text-white">{needsDoor ? 'FLIGHT DECK DOOR REQUIRED' : 'No Requirement'}</p>
                    <p className="text-xs text-slate-400">
                      {needsDoor 
                        ? 'Meets Annex 17 criteria (Weight or Seats).' 
                        : 'Below thresholds (54.5t, or 45t+19seats, or 60seats).'}
                    </p>
                 </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 bg-slate-900 rounded-lg p-6 relative overflow-hidden border border-slate-700 group">
             {/* Visual representation of a door */}
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
             
             {/* Scan line animation */}
             <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-[scan_3s_ease-in-out_infinite]"></div>

             <h3 className="relative z-10 font-bold text-slate-400 mb-6 uppercase tracking-widest flex items-center gap-2">
                <ScanLine className="text-emerald-500" /> Door Specifications
             </h3>
             
             <div className="relative z-10 grid gap-4">
                <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded border border-slate-700 hover:border-emerald-500 transition-colors">
                   <div className="p-2 bg-emerald-500/10 rounded text-emerald-500"><Lock size={16} /></div>
                   <div>
                      <p className="text-sm font-bold text-white">Lockable</p>
                      <p className="text-xs text-slate-400">From pilot's position only.</p>
                   </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded border border-slate-700 hover:border-emerald-500 transition-colors">
                   <div className="p-2 bg-emerald-500/10 rounded text-emerald-500"><Eye size={16} /></div>
                   <div>
                      <p className="text-sm font-bold text-white">Viewable Area</p>
                      <p className="text-xs text-slate-400">Pilot must be able to see the atrium area outside.</p>
                   </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded border border-slate-700 hover:border-emerald-500 transition-colors">
                   <div className="p-2 bg-emerald-500/10 rounded text-emerald-500"><Shield size={16} /></div>
                   <div>
                      <p className="text-sm font-bold text-white">Ballistic Resistance</p>
                      <p className="text-xs text-slate-400">Resist small arms fire, grenade shrapnel, and intrusion.</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'procedures' && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
           {/* Check vs Search */}
           <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-900 p-5 rounded-lg border border-slate-700 hover:border-indigo-500 transition-colors">
                 <div className="flex items-center gap-2 mb-2 text-indigo-400">
                    <CheckSquare /> <h3 className="font-bold">Security Check</h3>
                 </div>
                 <p className="text-sm text-slate-300">
                    An inspection where passengers may have access. Covers the hold and accessible areas.
                 </p>
              </div>
              <div className="bg-slate-900 p-5 rounded-lg border border-slate-700 hover:border-purple-500 transition-colors">
                 <div className="flex items-center gap-2 mb-2 text-purple-400">
                    <Search /> <h3 className="font-bold">Security Search</h3>
                 </div>
                 <p className="text-sm text-slate-300">
                    A thorough inspection of the aircraft (interior and exterior). More in-depth than a check.
                 </p>
              </div>
           </div>

           {/* Unlawful Interference */}
           <div className="bg-red-900/10 p-5 rounded-lg border border-red-900/30">
              <h3 className="font-bold text-red-400 mb-3 uppercase flex items-center gap-2">
                 <AlertOctagon size={18} className="animate-pulse" /> Protocol: Unlawful Interference (Hijack)
              </h3>
              <ul className="grid md:grid-cols-2 gap-4 text-sm text-slate-300">
                 <li className="flex gap-2 items-start"><span className="text-red-500 font-bold">1.</span> State must assist (Nav aids, ATSU, Permission to land).</li>
                 <li className="flex gap-2 items-start"><span className="text-red-500 font-bold">2.</span> Aircraft on ground must be kept unless human life is at risk.</li>
                 <li className="flex gap-2 items-start"><span className="text-red-500 font-bold">3.</span> Follow RSUPPs first if hijacked.</li>
                 <li className="flex gap-2 items-start"><span className="text-red-500 font-bold">4.</span> After landing: Park <strong>100m</strong> away from people/sensitive areas.</li>
              </ul>
           </div>
        </div>
      )}
      
      <style>{`
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default SecuritySection;