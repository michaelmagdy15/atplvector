import React, { useState } from 'react';
import { easaAirspace } from '../data/courseData';
import { Shield, Radio, CheckSquare, XSquare, Gauge, AlertCircle, Info } from 'lucide-react';

const AirspaceExplorer: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState(easaAirspace[2]); // Default to Class C

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center">
        <h2 className="text-3xl font-black text-white tracking-tight">ICAO & EASA Airspace Spectrum</h2>
        <p className="text-slate-400 text-sm mt-1">
          Interactive classification guide across Classes A to G • Separation, Clearance, and Speed Standards
        </p>
      </div>

      {/* Cockpit Mental Model Banner */}
      <div className="bg-slate-900 border border-indigo-500/30 p-4 rounded-2xl flex items-center gap-3">
        <Info className="text-indigo-400 w-5 h-5 shrink-0" />
        <p className="text-xs text-indigo-200">
          <strong>Cockpit Mental Model — "Controlled Airspace as a Filter":</strong> Class A blocks all VFR; Class B separates everyone from everyone; 
          Class C and D progressively offload separation responsibilities to VFR pilots; Class E controls only IFR; and Class G provides no separation.
        </p>
      </div>

      {/* Airspace Class Buttons (A to G) */}
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
        {easaAirspace.map((ac) => (
          <button
            key={ac.class}
            onClick={() => setSelectedClass(ac)}
            className={`p-3 rounded-2xl font-bold text-center transition-all shadow-md ${
              selectedClass.class === ac.class
                ? 'bg-sky-600 text-white scale-105 shadow-sky-600/30 border-2 border-sky-400'
                : 'bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="text-2xl font-black font-mono">
              {ac.class}
            </div>
            <div className="text-[10px] uppercase opacity-75 mt-0.5">
              {ac.class === 'G' ? 'Uncontrolled' : ac.class === 'F' ? 'Advisory' : 'Controlled'}
            </div>
          </button>
        ))}
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col md:flex-row text-slate-900">
        {/* Left Column / Badge */}
        <div className="bg-slate-900 p-8 md:w-1/3 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950"></div>
          <div className="relative z-10">
            <div className="text-9xl font-black text-slate-800/40 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-mono">
              {selectedClass.class}
            </div>
            <Shield className="w-20 h-20 text-sky-400 mx-auto mb-3" />
            <h3 className="text-white font-black text-2xl">Class {selectedClass.class}</h3>
            <div className={`text-sm font-bold uppercase tracking-wider mt-1 ${selectedClass.class === 'G' ? 'text-red-400' : 'text-emerald-400'}`}>
              {selectedClass.class === 'G' ? 'Uncontrolled Airspace' : selectedClass.class === 'F' ? 'Advisory Airspace' : 'Controlled Airspace'}
            </div>
            <div className="mt-4 inline-block bg-slate-800/90 border border-slate-700 px-3 py-1 rounded-full text-xs font-mono text-slate-300">
              VFR: {selectedClass.vfr ? 'Permitted' : 'PROHIBITED'}
            </div>
          </div>
        </div>

        {/* Right Column / Criteria */}
        <div className="p-8 md:w-2/3 space-y-5 bg-slate-50">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-xs uppercase">Two-Way Radio</h4>
                <p className="text-slate-600 text-sm font-semibold">{selectedClass.radio}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                selectedClass.clearance.includes('Not') || selectedClass.clearance.includes('No')
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-amber-100 text-amber-600'
              }`}>
                {selectedClass.clearance.includes('Not') || selectedClass.clearance.includes('No') ? (
                  <CheckSquare className="w-5 h-5" />
                ) : (
                  <XSquare className="w-5 h-5" />
                )}
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-xs uppercase">ATC Clearance</h4>
                <p className="text-slate-600 text-sm font-semibold">{selectedClass.clearance}</p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-xs uppercase">Speed Restriction</h4>
              <p className="text-slate-600 text-sm font-semibold">{selectedClass.speed || '250 kt IAS below FL 100'}</p>
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-700 text-xs uppercase mb-1">Separation Provided by ATC</h4>
            <p className="text-slate-900 font-semibold text-sm">"{selectedClass.separation}"</p>
          </div>

          <div className="p-4 bg-sky-50 rounded-xl border border-sky-200 text-xs text-sky-900 leading-relaxed">
            <strong>Operational Notes:</strong> {selectedClass.notes}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirspaceExplorer;
