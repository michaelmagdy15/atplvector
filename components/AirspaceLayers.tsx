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
            <div className="bg-slate-900 rounded-2xl p-6 flex-grow border border-slate-700 relative overflow-hidden shadow-inner space-y-6">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <span className="text-9xl font-black">{selectedData.class}</span>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-xl ${selectedData.type === 'Controlled' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-500/20 text-slate-400 border border-slate-700'}`}>
                    {selectedData.type === 'Controlled' ? <ShieldCheck size={32} /> : <ShieldAlert size={32} />}
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white">Class {selectedData.class} Airspace</h3>
                    <p className={`${selectedData.type === 'Controlled' ? 'text-emerald-400' : 'text-slate-400'} font-bold text-xs uppercase tracking-wider`}>
                      {selectedData.type} Airspace
                    </p>
                  </div>
                </div>

                {/* Core Parameters Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
                  <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">VFR Allowed?</p>
                    <p className={`text-sm font-black ${selectedData.vfrAllowed ? 'text-emerald-400' : 'text-red-400'}`}>
                      {selectedData.vfrAllowed ? 'YES' : 'NO (IFR Only)'}
                    </p>
                  </div>
                  <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">ATC Clearance</p>
                    <p className="text-sm font-bold text-white">{selectedData.clearanceReq ? 'Mandatory' : 'Not Required'}</p>
                  </div>
                  <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Two-Way Radio</p>
                    <p className="text-sm font-bold text-white">{selectedData.radioReq ? 'Mandatory' : 'Not Required'}</p>
                  </div>
                  <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Speed Limit</p>
                    <p className="text-xs font-bold text-cyan-300">{selectedData.speedLimit || '250 kt IAS below FL100'}</p>
                  </div>
                </div>

                {/* Separation Matrix */}
                {selectedData.separationDetails && (
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-4 space-y-2">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                      ATC Separation Standard Matrix:
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">IFR from IFR:</span>
                        <span className="font-bold text-white">{selectedData.separationDetails.ifrFromIfr}</span>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">IFR from VFR:</span>
                        <span className="font-bold text-white">{selectedData.separationDetails.ifrFromVfr}</span>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">VFR from IFR:</span>
                        <span className="font-bold text-white">{selectedData.separationDetails.vfrFromIfr}</span>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">VFR from VFR:</span>
                        <span className="font-bold text-white">{selectedData.separationDetails.vfrFromVfr}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* VMC Minima */}
                {selectedData.vmcMinima && (
                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 mb-3 text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">VMC Minima Criteria:</span>
                    <span className="text-slate-200">{selectedData.vmcMinima}</span>
                  </div>
                )}

                {/* RTFQ Exam Trap */}
                {selectedData.rtfqTrap && (
                  <div className="p-3 bg-red-950/20 rounded-xl border border-red-500/30 text-xs text-red-200">
                    <strong className="text-red-400 uppercase tracking-wider block mb-0.5">RTFQ Defense:</strong>
                    {selectedData.rtfqTrap}
                  </div>
                )}

                {/* Description Note */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex gap-2 items-start">
                  <div className="w-1 h-full min-h-[2rem] bg-indigo-500 rounded-full"></div>
                  <p className="text-slate-400 text-xs italic leading-relaxed">
                    {selectedData.notes}
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

export default AirspaceLayers;