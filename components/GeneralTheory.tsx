
import React, { useState } from 'react';
import { Book, Radio, Mic, Activity, Clock } from 'lucide-react';

const GeneralTheory: React.FC = () => {
  const [tab, setTab] = useState<'methods' | 'abbreviations' | 'stations'>('methods');

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl overflow-hidden shadow-2xl border border-slate-200 mt-8 text-slate-900">
      <div className="bg-indigo-900 p-6 text-white">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Book className="text-indigo-400" /> Communications Theory
        </h2>
        <p className="text-indigo-200 text-sm">Definitions, Abbreviations and Transmission Methods.</p>
      </div>

      <div className="border-b border-slate-200">
        <nav className="flex">
          <button onClick={() => setTab('methods')} className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors ${tab === 'methods' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Transmission Methods</button>
          <button onClick={() => setTab('abbreviations')} className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors ${tab === 'abbreviations' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>ATC Abbreviations</button>
          <button onClick={() => setTab('stations')} className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors ${tab === 'stations' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Station Types</button>
        </nav>
      </div>

      <div className="p-8 min-h-[400px]">
        
        {tab === 'methods' && (
          <div className="grid md:grid-cols-3 gap-6 animate-in fade-in">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4 text-indigo-600">
                <Radio size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Simplex</h3>
              <p className="text-sm text-slate-600 mb-4">One way at a time. Transmission is possible in both directions, but not simultaneously.</p>
              <div className="text-xs bg-white p-2 rounded border border-slate-100 font-mono text-slate-500">"Over" required to switch turns.</div>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4 text-emerald-600">
                <Activity size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Duplex</h3>
              <p className="text-sm text-slate-600 mb-4">Simultaneous two-way communication (like a telephone). Both parties can speak at once.</p>
              <div className="text-xs bg-white p-2 rounded border border-slate-100 font-mono text-slate-500">No "Over" required.</div>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4 text-orange-600">
                <Mic size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Semi-Duplex</h3>
              <p className="text-sm text-slate-600 mb-4">Standard in Aviation. Ground station is Duplex, Aircraft is Simplex. effectively works as Simplex.</p>
              <div className="text-xs bg-white p-2 rounded border border-slate-100 font-mono text-slate-500">Offset Frequencies.</div>
            </div>
          </div>
        )}

        {tab === 'abbreviations' && (
          <div className="space-y-6 animate-in fade-in">
             <h3 className="font-bold text-slate-700">Common Flight Plan & ATC Abbreviations</h3>
             <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                   <div className="bg-slate-100 p-3 font-bold text-xs uppercase text-slate-500">Flight Rules / Conditions</div>
                   <div className="p-3 grid grid-cols-2 gap-y-2 text-sm">
                      <span className="font-bold">VFR</span> <span className="text-slate-600">Visual Flight Rules</span>
                      <span className="font-bold">IFR</span> <span className="text-slate-600">Instrument Flight Rules</span>
                      <span className="font-bold">VMC</span> <span className="text-slate-600">Visual Met Conditions</span>
                      <span className="font-bold">IMC</span> <span className="text-slate-600">Instrument Met Conditions</span>
                   </div>
                </div>

                <div className="border border-slate-200 rounded-lg overflow-hidden">
                   <div className="bg-slate-100 p-3 font-bold text-xs uppercase text-slate-500">Airspace & Services</div>
                   <div className="p-3 grid grid-cols-2 gap-y-2 text-sm">
                      <span className="font-bold">CTR</span> <span className="text-slate-600">Control Zone</span>
                      <span className="font-bold">CTA</span> <span className="text-slate-600">Control Area</span>
                      <span className="font-bold">ATZ</span> <span className="text-slate-600">Aerodrome Traffic Zone</span>
                      <span className="font-bold">FIS</span> <span className="text-slate-600">Flight Info Service</span>
                   </div>
                </div>

                <div className="border border-slate-200 rounded-lg overflow-hidden">
                   <div className="bg-slate-100 p-3 font-bold text-xs uppercase text-slate-500">Time (UTC)</div>
                   <div className="p-3 grid grid-cols-2 gap-y-2 text-sm">
                      <span className="font-bold">ETD</span> <span className="text-slate-600">Estimated Time Departure</span>
                      <span className="font-bold">ETA</span> <span className="text-slate-600">Estimated Time Arrival</span>
                      <span className="font-bold">EET</span> <span className="text-slate-600">Estimated Enroute Time</span>
                      <span className="font-bold">EAT</span> <span className="text-slate-600">Expected Approach Time</span>
                   </div>
                </div>

                <div className="border border-slate-200 rounded-lg overflow-hidden">
                   <div className="bg-slate-100 p-3 font-bold text-xs uppercase text-slate-500">Operational</div>
                   <div className="p-3 grid grid-cols-2 gap-y-2 text-sm">
                      <span className="font-bold">QNH</span> <span className="text-slate-600">Altitude Pressure</span>
                      <span className="font-bold">QFE</span> <span className="text-slate-600">Height Pressure</span>
                      <span className="font-bold">RVR</span> <span className="text-slate-600">Runway Visual Range</span>
                      <span className="font-bold">CAVOK</span> <span className="text-slate-600">Clouds & Vis OK</span>
                   </div>
                </div>
             </div>
          </div>
        )}

        {tab === 'stations' && (
           <div className="space-y-4 animate-in fade-in">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                 <h4 className="font-bold text-blue-800">Aeronautical Station</h4>
                 <p className="text-sm text-blue-600">A land station in the aeronautical mobile service. In certain instances, an aeronautical station may be located, for example, on board a ship or on a platform at sea.</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                 <div className="p-4 bg-white border border-slate-200 rounded-lg">
                    <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">Network Station</span>
                    <p className="mt-2 text-sm text-slate-700">Part of the AFTN network. Provides regular communications.</p>
                 </div>
                 <div className="p-4 bg-white border border-slate-200 rounded-lg">
                    <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">Broadcast Station</span>
                    <p className="mt-2 text-sm text-slate-700">Transmits blindly (VOLMET, ATIS).</p>
                 </div>
                 <div className="p-4 bg-white border border-slate-200 rounded-lg">
                    <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">Aircraft Station</span>
                    <p className="mt-2 text-sm text-slate-700">A mobile station in the aeronautical mobile service, other than a survival craft station, located on board an aircraft.</p>
                 </div>
              </div>
           </div>
        )}

      </div>
    </div>
  );
};

export default GeneralTheory;
