import React, { useState } from 'react';
import { AIRSPACE_DATA } from '../data/courseData';
import { AirspaceClass } from '../types';
import { ShieldCheck, ShieldAlert, List, Layers, Map as MapIcon } from 'lucide-react';
import AirspaceCake from './AirspaceCake';
import AirspaceMap from './AirspaceMap';

const AirspaceLayers: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<AirspaceClass>(AirspaceClass.A);
  const [viewMode, setViewMode] = useState<'3D' | '2D'>('3D');

  const selectedData = AIRSPACE_DATA.find(d => d.class === selectedClass);

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Airspace Class Explorer</h2>
          <p className="text-slate-400">Interact with the visualizations to explore different airspace classes.</p>
        </div>
        
        {/* View Toggles */}
        <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-700">
           <button 
              onClick={() => setViewMode('3D')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${viewMode === '3D' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
           >
              <Layers size={16} /> 3D Stack
           </button>
           <button 
              onClick={() => setViewMode('2D')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${viewMode === '2D' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
           >
              <MapIcon size={16} /> 2D Map
           </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Visualization Area */}
        <div className="w-full lg:w-1/2 border-4 border-slate-700 rounded-xl overflow-hidden shadow-2xl bg-slate-900 h-[400px] md:h-[500px]">
           {viewMode === '3D' ? (
             <AirspaceCake 
                data={AIRSPACE_DATA} 
                selectedClass={selectedClass} 
                onSelect={setSelectedClass} 
             />
           ) : (
             <AirspaceMap airspaceClass={selectedClass} />
           )}
        </div>

        {/* Details Card */}
        <div className="w-full lg:w-1/2 flex flex-col">
          {/* Quick Select Bar for Accessibility/Ease */}
          <div className="flex flex-wrap gap-2 mb-4 bg-slate-900/50 p-2 rounded-lg border border-slate-700">
            <span className="flex items-center text-xs text-slate-400 px-2">
              <List size={14} className="mr-1" /> Quick Select:
            </span>
            {AIRSPACE_DATA.map(d => (
               <button
                  key={d.class}
                  onClick={() => setSelectedClass(d.class)}
                  className={`
                     w-8 h-8 rounded flex items-center justify-center text-sm font-bold transition-all
                     ${selectedClass === d.class 
                        ? (d.type === 'Controlled' ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white')
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}
                  `}
               >
                  {d.class}
               </button>
            ))}
          </div>

          {selectedData && (
            <div className="bg-slate-900 rounded-lg p-6 flex-grow border border-slate-700 relative overflow-hidden shadow-inner">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <span className="text-9xl font-black">{selectedData.class}</span>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-3 rounded-lg ${selectedData.type === 'Controlled' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>
                    {selectedData.type === 'Controlled' ? <ShieldCheck size={32} /> : <ShieldAlert size={32} />}
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white">Class {selectedData.class}</h3>
                    <p className={`${selectedData.type === 'Controlled' ? 'text-emerald-400' : 'text-slate-400'} font-medium`}>
                      {selectedData.type} Airspace
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-slate-800/50 p-3 rounded border border-slate-700 transition-colors hover:border-slate-500">
                      <p className="text-xs text-slate-400 uppercase mb-1">Separation</p>
                      <p className="text-sm font-semibold">{selectedData.separation}</p>
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded border border-slate-700 transition-colors hover:border-slate-500">
                      <p className="text-xs text-slate-400 uppercase mb-1">VFR Allowed?</p>
                      <p className={`text-sm font-bold ${selectedData.vfrAllowed ? 'text-emerald-400' : 'text-red-400'}`}>
                        {selectedData.vfrAllowed ? 'YES' : 'NO'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-slate-800/50 p-3 rounded border border-slate-700 transition-colors hover:border-slate-500">
                      <p className="text-xs text-slate-400 uppercase mb-1">Radio Required?</p>
                      <p className="text-sm font-semibold">{selectedData.radioReq ? 'Yes' : 'No'}</p>
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded border border-slate-700 transition-colors hover:border-slate-500">
                      <p className="text-xs text-slate-400 uppercase mb-1">Clearance Required?</p>
                      <p className="text-sm font-semibold">{selectedData.clearanceReq ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-800">
                  <div className="flex gap-2 items-start">
                    <div className="w-1 h-full min-h-[2rem] bg-indigo-500 rounded-full"></div>
                    <p className="text-indigo-300 text-sm italic">
                       {selectedData.notes}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AirspaceLayers;