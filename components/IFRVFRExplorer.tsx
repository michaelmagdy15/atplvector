import React, { useState } from 'react';
import { AirspaceClass } from '../types';
import AirspaceMap from './AirspaceMap';
import { Scale, Info } from 'lucide-react';

const IFRVFRExplorer: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<AirspaceClass>(AirspaceClass.C);

  const classes = [
    AirspaceClass.A,
    AirspaceClass.B,
    AirspaceClass.C,
    AirspaceClass.D,
    AirspaceClass.E,
    AirspaceClass.F,
    AirspaceClass.G,
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="mb-8 flex items-center space-x-4">
        <div className="p-3 bg-red-600 rounded-xl shadow-lg shadow-red-500/20">
          <Scale className="w-8 h-8 text-white" />
        </div>
        <div>
           <div className="text-xs font-bold text-red-500 uppercase tracking-widest mb-1">Air Law (010)</div>
           <h1 className="text-3xl font-black text-slate-100">IFR vs VFR Explorer</h1>
           <p className="text-slate-400">Visualize separation rules and ATC services for each airspace class.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Selector */}
        <div className="space-y-4">
           <div className="bg-slate-800 rounded-xl p-1 border border-slate-700">
              {classes.map((cls) => (
                <button
                  key={cls}
                  onClick={() => setSelectedClass(cls)}
                  className={`w-full text-left px-6 py-4 rounded-lg flex items-center justify-between transition-all duration-200 ${
                    selectedClass === cls
                      ? 'bg-slate-700 text-white shadow-sm ring-1 ring-slate-600'
                      : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        selectedClass === cls ? 'bg-red-500 text-white' : 'bg-slate-900 text-slate-500'
                    }`}>
                        {cls}
                    </span>
                    <span className="font-bold text-lg">Class {cls}</span>
                  </div>
                  {selectedClass === cls && <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>}
                </button>
              ))}
           </div>
           
           <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-800 text-sm text-slate-400">
              <div className="flex items-center space-x-2 text-slate-300 font-bold mb-2">
                 <Info className="w-4 h-4" /> <span>Study Tip</span>
              </div>
              Most European airspace uses classes A, C, D, E and G. Class B is rare in EASA land (common in USA). Class F is advisory (rare).
           </div>
        </div>

        {/* Right Column: Visualization */}
        <div className="lg:col-span-2 min-h-[500px] flex flex-col">
            <div className="flex-grow bg-slate-900 rounded-2xl border-4 border-slate-800 shadow-2xl overflow-hidden relative">
                <AirspaceMap airspaceClass={selectedClass} />
            </div>
            <div className="mt-4 flex justify-between text-xs text-slate-500 font-mono">
                <span>RADAR SIMULATION</span>
                <span>DATA: ICAO ANNEX 11</span>
            </div>
        </div>

      </div>
    </div>
  );
};

export default IFRVFRExplorer;