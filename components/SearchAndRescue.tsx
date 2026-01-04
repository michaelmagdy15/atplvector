import React, { useState } from 'react';
import { AlertTriangle, Radio, Eye, CheckCircle, XCircle, ArrowRight, Activity, Search, Siren } from 'lucide-react';

type Tab = 'phases' | 'signals' | 'procedures';

const SearchAndRescue: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('phases');
  const [selectedSignal, setSelectedSignal] = useState<string | null>(null);

  // Data for signals
  const survivorSignals = [
    { code: 'V', meaning: 'Require Assistance', shape: 'V' },
    { code: 'X', meaning: 'Require Medical Assistance', shape: 'X' },
    { code: 'N', meaning: 'No / Negative', shape: 'N' },
    { code: 'Y', meaning: 'Yes / Affirmative', shape: 'Y' },
    { code: '→', meaning: 'Proceed in this direction', shape: 'arrow' },
  ];

  const rescuerSignals = [
    { code: 'LLL', meaning: 'Operation Finished', shape: 'LLL' },
    { code: 'LL', meaning: 'Found All Personnel', shape: 'LL' },
    { code: '++', meaning: 'Found Some Personnel', shape: '++' },
    { code: 'XX', meaning: 'Unable to Continue', shape: 'XX' },
    { code: 'NN', meaning: 'Nothing Found', shape: 'NN' },
  ];

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Siren className="text-red-500" />
            Search & Rescue (Annex 12)
          </h2>
          <p className="text-slate-400 text-sm">Procedures, visual signals, and emergency phases.</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-slate-900 p-1 rounded-lg">
          {(['phases', 'signals', 'procedures'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md font-bold text-sm capitalize transition-all ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* PHASES TAB */}
      {activeTab === 'phases' && (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Uncertainty Phase */}
          <div className="bg-slate-900/50 p-6 rounded-xl border border-yellow-700/30 relative overflow-hidden group hover:border-yellow-500 transition-colors">
            <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-full text-yellow-500">
                <Search size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Uncertainty</h3>
            </div>
            <p className="text-xs font-mono text-yellow-500 mb-2">INCERFA</p>
            <p className="text-slate-300 text-sm leading-relaxed">
              Situation where <strong>uncertainty</strong> exists as to the safety of an aircraft and its occupants.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-700 text-xs text-slate-400">
              Action: ATSU starts looking for aircraft.
            </div>
          </div>

          {/* Alert Phase */}
          <div className="bg-slate-900/50 p-6 rounded-xl border border-orange-700/30 relative overflow-hidden group hover:border-orange-500 transition-colors">
            <div className="absolute top-0 left-0 w-full h-1 bg-orange-500"></div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-orange-500/20 rounded-full text-orange-500">
                <Radio size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Alert</h3>
            </div>
            <p className="text-xs font-mono text-orange-500 mb-2">ALERFA</p>
            <p className="text-slate-300 text-sm leading-relaxed">
              Situation where <strong>apprehension</strong> exists as to the safety of an aircraft and its occupants.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-700 text-xs text-slate-400">
              Action: Rescue Coordination Centre (RCC) informed.
            </div>
          </div>

          {/* Distress Phase */}
          <div className="bg-slate-900/50 p-6 rounded-xl border border-red-700/30 relative overflow-hidden group hover:border-red-500 transition-colors">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-600 animate-pulse"></div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-500/20 rounded-full text-red-500">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Distress</h3>
            </div>
            <p className="text-xs font-mono text-red-500 mb-2">DETRESFA</p>
            <p className="text-slate-300 text-sm leading-relaxed">
              Situation where there is reasonable certainty that an aircraft and its occupants are threatened by <strong>grave and imminent danger</strong>.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-700 text-xs text-slate-400">
              Action: SAR operations launched immediately.
            </div>
          </div>
        </div>
      )}

      {/* SIGNALS TAB */}
      {activeTab === 'signals' && (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Signal Control Panel */}
          <div className="w-full md:w-1/2 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase mb-3">Ground-to-Air (Survivors)</h3>
              <div className="grid grid-cols-3 gap-2">
                {survivorSignals.map((sig) => (
                  <button
                    key={sig.code}
                    onClick={() => setSelectedSignal(sig.code === selectedSignal ? null : sig.code)}
                    className={`p-3 rounded border text-center transition-all ${
                      selectedSignal === sig.code 
                        ? 'bg-amber-500 text-black border-amber-500 font-bold' 
                        : 'bg-slate-700 border-slate-600 hover:bg-slate-600'
                    }`}
                  >
                    <span className="text-xl block mb-1">{sig.code}</span>
                    <span className="text-[10px] opacity-70 leading-tight block">{sig.meaning}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase mb-3">Searcher Responses</h3>
              <div className="grid grid-cols-3 gap-2">
                {rescuerSignals.map((sig) => (
                  <button
                    key={sig.code}
                    onClick={() => setSelectedSignal(sig.code === selectedSignal ? null : sig.code)}
                    className={`p-3 rounded border text-center transition-all ${
                      selectedSignal === sig.code 
                        ? 'bg-indigo-500 text-white border-indigo-500 font-bold' 
                        : 'bg-slate-700 border-slate-600 hover:bg-slate-600'
                    }`}
                  >
                    <span className="text-lg font-mono block mb-1">{sig.code}</span>
                    <span className="text-[10px] opacity-70 leading-tight block">{sig.meaning}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Visual Sandbox */}
          <div className="w-full md:w-1/2 bg-stone-200 rounded-xl overflow-hidden relative border-4 border-slate-700 min-h-[350px] flex items-center justify-center group shadow-inner">
            {/* Terrain Texture */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')]"></div>
            
            {/* Compass Rose */}
            <div className="absolute top-4 right-4 w-12 h-12 border-2 border-stone-400 rounded-full flex items-center justify-center opacity-50">
              <span className="text-stone-500 text-xs font-bold">N</span>
            </div>

            {selectedSignal ? (
              <div className="relative z-10 text-center animate-in zoom-in duration-300 w-full h-full flex flex-col items-center justify-center">
                 
                 {/* Top Label (Pilot sees) */}
                 <div className="absolute top-8 bg-black/70 text-white text-xs px-3 py-1 rounded backdrop-blur-sm whitespace-nowrap shadow-sm border border-white/20">
                    Pilot sees: "{survivorSignals.find(s => s.code === selectedSignal)?.meaning || rescuerSignals.find(s => s.code === selectedSignal)?.meaning}"
                 </div>

                 {/* The visual signal on the ground - Pushed up slightly */}
                 <div className="text-9xl font-black text-red-600 drop-shadow-lg transform group-hover:scale-110 transition-transform mb-16">
                   {selectedSignal}
                 </div>
                 
                 {/* Aircraft Acknowledgment Simulation - Fixed Position */}
                 <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-sm">
                    <div className="bg-white/95 text-slate-900 p-3 rounded-lg text-xs font-bold shadow-xl border border-slate-300 backdrop-blur">
                        Aircraft Acknowledgment:
                        <div className="flex justify-center gap-4 mt-2 font-normal text-xs">
                            <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded border border-slate-200"><span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span> Rock Wings (Day)</span>
                            <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded border border-slate-200"><span className="w-2 h-2 bg-slate-900 rounded-full animate-ping"></span> Flash Lights x2 (Night)</span>
                        </div>
                    </div>
                 </div>
              </div>
            ) : (
              <div className="text-stone-400 text-center p-8">
                <Eye size={48} className="mx-auto mb-2 opacity-50" />
                <p className="font-bold">Aerial View</p>
                <p className="text-sm">Select a signal code to visualize it on the ground.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PROCEDURES TAB */}
      {activeTab === 'procedures' && (
        <div className="space-y-4">
          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
            <h3 className="font-bold text-sky-400 mb-3 flex items-center gap-2">
              <Radio size={18} /> Hearing a Distress Signal
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex gap-2">
                <CheckCircle size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                Record position of craft in distress if given.
              </li>
              <li className="flex gap-2">
                <CheckCircle size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                Take a bearing on the transmission if possible.
              </li>
              <li className="flex gap-2">
                <CheckCircle size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                Inform appropriate RCC or ATSU.
              </li>
              <li className="flex gap-2">
                <CheckCircle size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                At discretion (while awaiting instruction), proceed to position.
              </li>
            </ul>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
            <h3 className="font-bold text-indigo-400 mb-3 flex items-center gap-2">
              <Activity size={18} /> At the Scene
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex gap-2">
                <Eye size={16} className="text-indigo-500 flex-shrink-0 mt-0.5" />
                Keep craft in sight until presence no longer needed.
              </li>
              <li className="flex gap-2">
                <ArrowRight size={16} className="text-indigo-500 flex-shrink-0 mt-0.5" />
                Report details to RCC: Type, Position, Time, Survivors (number/condition).
              </li>
              <li className="flex gap-2">
                <Siren size={16} className="text-indigo-500 flex-shrink-0 mt-0.5" />
                If first on scene (and not SAR aircraft): Take charge until SAR arrives.
              </li>
            </ul>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
            <h3 className="font-bold text-amber-400 mb-3 flex items-center gap-2">
              <ArrowRight size={18} /> Directing Surface Vessels
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-800 p-3 rounded">
                 <p className="font-bold text-xs text-slate-400 uppercase mb-1">"Follow Me"</p>
                 <p className="text-sm">Circle vessel and cross the <strong className="text-amber-400">BOW (Front)</strong> in direction of travel.</p>
              </div>
              <div className="bg-slate-800 p-3 rounded">
                 <p className="font-bold text-xs text-slate-400 uppercase mb-1">"Assistance Not Required"</p>
                 <p className="text-sm">Circle vessel and cross the <strong className="text-amber-400">STERN (Back)</strong>.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndRescue;