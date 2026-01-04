import React, { useState } from 'react';
import { FlightRule } from '../types';
import { VFR_RULES, IFR_RULES } from '../data/courseData';
import { Cloud, Sun, Gauge, Plane, Eye } from 'lucide-react';

const CockpitToggle: React.FC = () => {
  const [mode, setMode] = useState<FlightRule>(FlightRule.VFR);

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Plane className="text-sky-400" />
          Flight Mode Visualizer
        </h2>
        
        <div className="flex bg-slate-900 p-1 rounded-lg">
          <button
            onClick={() => setMode(FlightRule.VFR)}
            className={`px-6 py-2 rounded-md font-bold transition-all duration-300 ${
              mode === FlightRule.VFR
                ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            VFR (Visual)
          </button>
          <button
            onClick={() => setMode(FlightRule.IFR)}
            className={`px-6 py-2 rounded-md font-bold transition-all duration-300 ${
              mode === FlightRule.IFR
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            IFR (Instrument)
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Visual Simulation */}
        <div className="relative h-64 md:h-80 rounded-lg overflow-hidden border-4 border-slate-600 shadow-inner group">
          {/* Sky Background */}
          <div className={`absolute inset-0 transition-all duration-1000 ${
            mode === FlightRule.VFR 
              ? 'bg-gradient-to-b from-sky-400 to-sky-200' 
              : 'bg-gradient-to-b from-slate-400 to-slate-500'
          }`}>
            {mode === FlightRule.VFR ? (
              <>
                <Sun className="absolute top-4 right-4 text-yellow-300 w-16 h-16 animate-pulse" />
                <div className="absolute bottom-0 w-full h-1/3 bg-emerald-600/80 backdrop-blur-sm transform translate-y-4"></div>
                <div className="absolute top-1/2 left-1/4 w-24 h-8 bg-white/40 rounded-full blur-xl"></div>
              </>
            ) : (
              <>
                <div className="absolute inset-0 bg-white/30 backdrop-blur-md"></div>
                <Cloud className="absolute top-10 left-10 text-slate-200 w-32 h-32 opacity-50 blur-sm" />
                <Cloud className="absolute top-20 right-20 text-slate-300 w-40 h-40 opacity-60 blur-md" />
                <Cloud className="absolute bottom-10 left-1/3 text-slate-300 w-48 h-48 opacity-40 blur-lg" />
              </>
            )}
          </div>

          {/* Cockpit Frame overlay */}
          <div className="absolute inset-0 border-[20px] border-slate-800 rounded-lg pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 bg-slate-800 h-full opacity-20"></div>

          {/* HUD / Focus Indicator */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            {mode === FlightRule.VFR ? (
              <div className="bg-black/50 p-2 rounded text-white backdrop-blur-sm">
                <Eye className="inline mb-1" />
                <p className="font-bold text-sm">LOOK OUTSIDE</p>
                <p className="text-xs text-sky-200">See & Avoid</p>
              </div>
            ) : (
              <div className="bg-black/50 p-2 rounded text-white backdrop-blur-sm border border-red-500/50">
                <Gauge className="inline mb-1" />
                <p className="font-bold text-sm">SCAN INSTRUMENTS</p>
                <p className="text-xs text-indigo-200">Trust the dial</p>
              </div>
            )}
          </div>
        </div>

        {/* Rules & Characteristics Card */}
        <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
          <h3 className={`text-xl font-bold mb-4 ${
            mode === FlightRule.VFR ? 'text-sky-400' : 'text-indigo-400'
          }`}>
            {mode === FlightRule.VFR ? 'Visual Flight Rules' : 'Instrument Flight Rules'}
          </h3>
          
          <ul className="space-y-3">
            {(mode === FlightRule.VFR ? VFR_RULES : IFR_RULES).map((rule, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${
                  mode === FlightRule.VFR ? 'bg-sky-500' : 'bg-indigo-500'
                }`} />
                <span className="text-slate-300 text-sm leading-relaxed">{rule}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 p-4 bg-slate-800 rounded border-l-4 border-yellow-500">
            <p className="text-xs text-yellow-500 uppercase font-bold mb-1">Exam Note</p>
            <p className="text-sm text-slate-300">
              {mode === FlightRule.VFR 
                ? "Changing to IFR? Submit a flight plan to ATS and obtain clearance prior to entering controlled airspace." 
                : "Above FL290? RVSM separation applies (1000ft). Below FL290, check semi-circular rules."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CockpitToggle;