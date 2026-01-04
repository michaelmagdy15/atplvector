import React, { useState } from 'react';
import { Radio, Droplets, Plane, AlertCircle, VolumeX, ArrowDown, Zap } from 'lucide-react';

const EmergencyProcedures: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'actions' | 'comms' | 'fuel'>('actions');

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <AlertCircle className="text-red-500" />
            Emergencies (PANS-ATM)
          </h2>
          <p className="text-slate-400 text-sm">Procedures for distress, comms failure, and fuel dumping.</p>
        </div>

        <div className="flex bg-slate-900 p-1 rounded-lg">
          <button onClick={() => setActiveTab('actions')} className={`px-4 py-2 rounded-md font-bold text-sm ${activeTab === 'actions' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}>Immediate Actions</button>
          <button onClick={() => setActiveTab('comms')} className={`px-4 py-2 rounded-md font-bold text-sm ${activeTab === 'comms' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}>Comms Failure</button>
          <button onClick={() => setActiveTab('fuel')} className={`px-4 py-2 rounded-md font-bold text-sm ${activeTab === 'fuel' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}>Fuel Dumping</button>
        </div>
      </div>

      {activeTab === 'actions' && (
        <div className="grid md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-2">
          {/* Pilot Actions */}
          <div className="bg-slate-900/50 p-5 rounded-xl border-l-4 border-red-500">
             <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Plane className="text-red-500" /> Pilot Actions
             </h3>
             <ul className="space-y-3">
                <li className="bg-slate-800 p-3 rounded flex items-center gap-3">
                   <div className="bg-red-500/20 text-red-500 p-2 rounded font-mono font-bold">7700</div>
                   <div className="text-sm text-slate-300">Set Squawk Mode A to 7700.</div>
                </li>
                <li className="bg-slate-800 p-3 rounded flex items-center gap-3">
                   <div className="bg-red-500/20 text-red-500 p-2 rounded font-mono font-bold">ADS-B</div>
                   <div className="text-sm text-slate-300">Select Emergency Mode.</div>
                </li>
                <li className="bg-slate-800 p-3 rounded flex items-center gap-3">
                   <div className="bg-red-500/20 text-red-500 p-2 rounded font-mono font-bold">CPDLC</div>
                   <div className="text-sm text-slate-300">Transmit emergency message.</div>
                </li>
                <li className="bg-slate-800 p-3 rounded flex items-center gap-3">
                   <div className="bg-red-500/20 text-red-500 p-2 rounded font-mono font-bold">VOICE</div>
                   <div className="text-sm text-slate-300">"MAYDAY, MAYDAY, MAYDAY"</div>
                </li>
             </ul>
             <div className="mt-4 p-3 bg-red-900/20 border border-red-900/50 rounded text-xs text-red-200 flex items-start gap-2">
                <Zap size={16} className="mt-0.5 flex-shrink-0" />
                <span><strong>Descending?</strong> Turn on exterior lights and fly the aircraft!</span>
             </div>
          </div>

          {/* ATSU Actions */}
          <div className="bg-slate-900/50 p-5 rounded-xl border-l-4 border-sky-500">
             <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Radio className="text-sky-500" /> ATSU Actions
             </h3>
             <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex gap-2">
                   <span className="text-sky-500 font-bold">•</span>
                   Broadcast emergency message.
                </li>
                <li className="flex gap-2">
                   <span className="text-sky-500 font-bold">•</span>
                   Issue instructions/info to <em>affected</em> aircraft.
                </li>
                <li className="flex gap-2">
                   <span className="text-sky-500 font-bold">•</span>
                   Transmit Minimum Flight Altitude (MFA) and Altimeter settings.
                </li>
                <li className="flex gap-2">
                   <span className="text-sky-500 font-bold">•</span>
                   Inform other ATSUs.
                </li>
             </ul>
             
             <div className="mt-6 bg-slate-800 p-3 rounded">
                <h4 className="text-xs font-bold text-sky-400 uppercase mb-2">Air Traffic Incident vs AIRPROX</h4>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                   <div>
                      <span className="block font-bold text-white">Incident Report</span>
                      <span className="text-slate-400">Hazard caused by ATSU (e.g., faulty procedure, equipment).</span>
                   </div>
                   <div>
                      <span className="block font-bold text-white">AIRPROX</span>
                      <span className="text-slate-400">Separation minima broken (Risk of collision).</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'comms' && (
        <div className="flex flex-col md:flex-row gap-8 animate-in fade-in">
           <div className="w-full md:w-1/3 bg-slate-900 p-5 rounded-lg border border-slate-700">
              <div className="flex items-center justify-center w-16 h-16 bg-slate-800 rounded-full mb-4 mx-auto">
                 <VolumeX size={32} className="text-amber-500" />
              </div>
              <h3 className="text-center font-bold text-white mb-4">Initial Checks</h3>
              <ul className="text-sm text-slate-400 space-y-2">
                 <li className="flex justify-between border-b border-slate-800 pb-2">
                    <span>1. Check Leads</span> <span className="text-emerald-500">✓</span>
                 </li>
                 <li className="flex justify-between border-b border-slate-800 pb-2">
                    <span>2. Check Volume</span> <span className="text-emerald-500">✓</span>
                 </li>
                 <li className="flex justify-between border-b border-slate-800 pb-2">
                    <span>3. Try CPDLC</span> <span className="text-emerald-500">✓</span>
                 </li>
                 <li className="flex justify-between">
                    <span>4. Use Another Freq</span> <span className="text-emerald-500">✓</span>
                 </li>
              </ul>
           </div>

           <div className="w-full md:w-2/3 bg-slate-900 p-5 rounded-lg border border-slate-700 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5">
                  <span className="text-9xl font-black">7600</span>
               </div>
               
               <h3 className="text-xl font-bold text-white mb-4">Procedure</h3>
               
               <div className="space-y-4">
                  <div className="flex items-center gap-4 bg-slate-800 p-4 rounded border-l-4 border-amber-500">
                     <div className="font-mono text-2xl font-bold text-amber-500">7600</div>
                     <div>
                        <p className="font-bold text-white">Set Transponder</p>
                        <p className="text-xs text-slate-400">Mode A code 7600 indicates radio failure.</p>
                     </div>
                  </div>

                  <div className="flex items-center gap-4 bg-slate-800 p-4 rounded border-l-4 border-slate-500">
                     <div className="font-mono text-2xl font-bold text-slate-300">TX</div>
                     <div>
                        <p className="font-bold text-white">Blind Transmissions</p>
                        <p className="text-xs text-slate-400">"Transmitting Blind". Continue to state intentions in case receiver is faulty.</p>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                     <div className="bg-indigo-900/20 p-3 rounded border border-indigo-900/50">
                        <p className="text-xs font-bold text-indigo-400 uppercase">VFR</p>
                        <p className="text-xs text-slate-300 mt-1">Remain VFR. Land at nearest suitable aerodrome. Report arrival.</p>
                     </div>
                     <div className="bg-sky-900/20 p-3 rounded border border-sky-900/50">
                        <p className="text-xs font-bold text-sky-400 uppercase">IFR</p>
                        <p className="text-xs text-slate-300 mt-1">Maintain speed/level for 7 mins, then adjust per flight plan. Follow clearance limit rules.</p>
                     </div>
                  </div>
               </div>
           </div>
        </div>
      )}

      {activeTab === 'fuel' && (
        <div className="flex flex-col items-center animate-in slide-in-from-right-2">
           <div className="w-full max-w-2xl bg-slate-900 p-8 rounded-xl border border-slate-700 relative h-[400px] flex items-center justify-center overflow-hidden group">
              
              {/* Central Plane (Dumping) */}
              <div className="relative z-20 flex flex-col items-center">
                 <Plane size={48} className="text-emerald-400 rotate-0" />
                 <div className="flex flex-col items-center mt-1 animate-pulse">
                    <Droplets size={16} className="text-sky-400" />
                    <Droplets size={16} className="text-sky-400" />
                 </div>
                 <span className="text-xs font-bold text-emerald-400 mt-2 bg-slate-900/80 px-2 rounded">DUMPING AIRCRAFT</span>
              </div>

              {/* Exclusion Zones Visualization */}
              
              {/* 10nm Ahead */}
              <div className="absolute left-[65%] top-1/2 -translate-y-1/2 w-32 border-l-2 border-slate-500 h-20 flex items-center pl-2 group-hover:border-red-500 transition-colors">
                 <div className="text-right">
                    <p className="text-xs text-slate-400">No Aircraft</p>
                    <p className="font-bold text-red-400 text-sm">10 NM AHEAD</p>
                 </div>
                 <ArrowDown className="text-slate-600 rotate-[-90deg] ml-2" />
              </div>

              {/* 50nm Behind */}
              <div className="absolute right-[65%] top-1/2 -translate-y-1/2 w-48 border-r-2 border-slate-500 h-20 flex items-center justify-end pr-2 group-hover:border-red-500 transition-colors">
                 <ArrowDown className="text-slate-600 rotate-[90deg] mr-2" />
                 <div className="text-left">
                    <p className="text-xs text-slate-400">No Aircraft</p>
                    <p className="font-bold text-red-400 text-sm">50 NM / 15 MIN BEHIND</p>
                 </div>
              </div>

              {/* 1000ft Above */}
              <div className="absolute top-[20%] left-1/2 -translate-x-1/2 flex flex-col items-center group-hover:text-red-400 transition-colors">
                 <p className="font-bold text-red-400 text-sm">1000 FT ABOVE</p>
                 <div className="h-16 w-0 border-l-2 border-dashed border-slate-600 my-1"></div>
              </div>

              {/* 3000ft Below */}
              <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 flex flex-col items-center group-hover:text-red-400 transition-colors">
                 <div className="h-24 w-0 border-l-2 border-dashed border-slate-600 my-1"></div>
                 <p className="font-bold text-red-400 text-sm">3000 FT BELOW</p>
              </div>

              {/* Grid Background */}
              <div className="absolute inset-0 z-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
           </div>

           <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
              <div className="bg-slate-700 p-3 rounded text-center border border-slate-600">
                 <p className="text-[10px] uppercase text-slate-400">Horizontal Ahead</p>
                 <p className="font-bold text-white">10 NM</p>
              </div>
              <div className="bg-slate-700 p-3 rounded text-center border border-slate-600">
                 <p className="text-[10px] uppercase text-slate-400">Horizontal Behind</p>
                 <p className="font-bold text-white">50 NM</p>
                 <p className="text-[10px] text-slate-400">(or 15 mins)</p>
              </div>
              <div className="bg-slate-700 p-3 rounded text-center border border-slate-600">
                 <p className="text-[10px] uppercase text-slate-400">Vertical Above</p>
                 <p className="font-bold text-white">1000 FT</p>
              </div>
              <div className="bg-slate-700 p-3 rounded text-center border border-slate-600">
                 <p className="text-[10px] uppercase text-slate-400">Vertical Below</p>
                 <p className="font-bold text-white">3000 FT</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyProcedures;