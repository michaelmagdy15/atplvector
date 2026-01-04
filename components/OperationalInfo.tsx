import React, { useState } from 'react';
import { Book, Globe, Snowflake, Flame, Calendar, Briefcase, FileCheck, Stamp, XCircle } from 'lucide-react';

const OperationalInfo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ais' | 'notam' | 'admin'>('ais');
  const [activeColor, setActiveColor] = useState<string | null>(null);

  const aicColors = [
    { code: 'Pink', meaning: 'Matters relating to Safety', css: 'bg-pink-500 text-white' },
    { code: 'Yellow', meaning: 'Operational matters including ATS facilities', css: 'bg-yellow-400 text-black' },
    { code: 'White', meaning: 'Administrative matters', css: 'bg-white text-black' },
    { code: 'Mauve', meaning: 'National / Domestic requirements', css: 'bg-purple-400 text-white' },
    { code: 'Green', meaning: 'Maps and charts', css: 'bg-green-500 text-white' },
  ];

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Globe className="text-indigo-400" />
            Operational Info
          </h2>
          <p className="text-slate-400 text-sm">AIS (Annex 15) & Facilitation (Annex 9).</p>
        </div>

        <div className="flex bg-slate-900 p-1 rounded-lg">
          <button onClick={() => setActiveTab('ais')} className={`px-4 py-2 rounded-md font-bold text-sm ${activeTab === 'ais' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>AIS Structure</button>
          <button onClick={() => setActiveTab('notam')} className={`px-4 py-2 rounded-md font-bold text-sm ${activeTab === 'notam' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>NOTAMs</button>
          <button onClick={() => setActiveTab('admin')} className={`px-4 py-2 rounded-md font-bold text-sm ${activeTab === 'admin' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>Facilitation</button>
        </div>
      </div>

      {activeTab === 'ais' && (
        <div className="space-y-6 animate-in fade-in">
           {/* IAIP Section */}
           <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                 <Book size={18} /> Integrated Aeronautical Information Package (IAIP)
              </h3>
              <div className="grid md:grid-cols-5 gap-2 text-center">
                 <div className="bg-slate-800 p-3 rounded border border-slate-600">
                    <p className="font-bold text-indigo-400">AIP</p>
                    <p className="text-[10px] text-slate-400">Static Info (GEN, ENR, AD)</p>
                 </div>
                 <div className="bg-slate-800 p-3 rounded border border-slate-600">
                    <p className="font-bold text-indigo-400">Supplements</p>
                    <p className="text-[10px] text-slate-400">Temp changes &gt;3 months</p>
                 </div>
                 <div className="bg-slate-800 p-3 rounded border border-slate-600">
                    <p className="font-bold text-indigo-400">NOTAMs</p>
                    <p className="text-[10px] text-slate-400">Short duration / Urgent</p>
                 </div>
                 <div className="bg-slate-800 p-3 rounded border border-slate-600">
                    <p className="font-bold text-indigo-400">PIB</p>
                    <p className="text-[10px] text-slate-400">Pre-flight Bulletin</p>
                 </div>
                 <div className="bg-slate-800 p-3 rounded border border-slate-600">
                    <p className="font-bold text-indigo-400">AIC</p>
                    <p className="text-[10px] text-slate-400">Circulars</p>
                 </div>
              </div>
              <div className="mt-3 flex items-center justify-between bg-slate-800/50 p-3 rounded">
                 <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-slate-400" />
                    <span className="text-sm text-slate-300">AIRAC Cycle</span>
                 </div>
                 <span className="font-bold text-white">Every 28 Days</span>
              </div>
           </div>

           {/* AIC Colors */}
           <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
              <h3 className="font-bold text-white mb-4">AIC Circular Colors</h3>
              <div className="flex flex-wrap gap-3">
                 {aicColors.map((c) => (
                    <button
                       key={c.code}
                       onClick={() => setActiveColor(c.code)}
                       className={`px-4 py-2 rounded font-bold shadow-md transition-transform hover:scale-105 ${c.css} border-2 border-transparent focus:border-white/50`}
                    >
                       {c.code}
                    </button>
                 ))}
              </div>
              {activeColor && (
                 <div className="mt-4 p-4 bg-slate-800 rounded border border-slate-600 animate-in slide-in-from-top-2">
                    <span className="text-xs text-slate-400 uppercase font-bold">{activeColor} Circular</span>
                    <p className="text-lg text-white font-medium">
                       {aicColors.find(c => c.code === activeColor)?.meaning}
                    </p>
                 </div>
              )}
           </div>
        </div>
      )}

      {activeTab === 'notam' && (
         <div className="grid md:grid-cols-2 gap-6 animate-in slide-in-from-right-2">
            <div className="space-y-4">
               <div className="bg-slate-900 p-4 rounded-lg border-l-4 border-slate-500">
                  <h4 className="font-bold text-white mb-1">NOTAM (Notice to Airmen)</h4>
                  <ul className="text-sm text-slate-400 list-disc pl-4 space-y-1">
                     <li>Temporary info of short duration.</li>
                     <li>Significant operational permanent changes at short notice.</li>
                     <li>Distributed via AFS (Aeronautical Fixed Service).</li>
                     <li>If valid &gt; 3 months, should become AIP Supplement.</li>
                  </ul>
               </div>
               
               <div className="bg-slate-900 p-4 rounded-lg border-l-4 border-sky-400">
                  <h4 className="font-bold text-white mb-1 flex items-center gap-2">
                     <Snowflake size={16} className="text-sky-400" /> SNOWTAM
                  </h4>
                  <p className="text-sm text-slate-400">
                     Specific series NOTAM notifying presence or removal of hazardous conditions due to snow, ice, slush or standing water on movement areas.
                  </p>
               </div>

               <div className="bg-slate-900 p-4 rounded-lg border-l-4 border-red-500">
                  <h4 className="font-bold text-white mb-1 flex items-center gap-2">
                     <Flame size={16} className="text-red-500" /> ASHTAM
                  </h4>
                  <p className="text-sm text-slate-400">
                     Specific series NOTAM regarding volcanic activity, eruption or volcanic ash cloud.
                  </p>
               </div>
            </div>

            <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
               <h4 className="font-bold text-amber-400 mb-4 text-sm uppercase">Volcano Activity Codes</h4>
               <div className="space-y-3">
                  <div className="flex items-center gap-3 bg-red-900/20 p-2 rounded border border-red-900/50">
                     <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                     <div>
                        <p className="text-xs font-bold text-red-400">RED</p>
                        <p className="text-[10px] text-slate-400">Eruption imminent/underway. Major ash.</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-3 bg-orange-900/20 p-2 rounded border border-orange-900/50">
                     <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                     <div>
                        <p className="text-xs font-bold text-orange-400">ORANGE</p>
                        <p className="text-[10px] text-slate-400">Heightened unrest OR eruption w/ minor ash.</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-3 bg-yellow-900/20 p-2 rounded border border-yellow-900/50">
                     <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
                     <div>
                        <p className="text-xs font-bold text-yellow-400">YELLOW</p>
                        <p className="text-[10px] text-slate-400">Elevated unrest above background levels.</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-3 bg-green-900/20 p-2 rounded border border-green-900/50">
                     <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                     <div>
                        <p className="text-xs font-bold text-green-400">GREEN</p>
                        <p className="text-[10px] text-slate-400">Normal, non-eruptive state.</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      )}

      {activeTab === 'admin' && (
         <div className="space-y-4 animate-in slide-in-from-left-2">
            <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
               <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                  <Stamp size={18} className="text-indigo-400" /> Border Crossings
               </h3>
               <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-800 p-3 rounded">
                     <p className="font-bold text-sm text-white mb-1">General Declaration (Gen Dec)</p>
                     <p className="text-xs text-slate-400">Contains Aircraft info, Flight details, Crew/Passenger counts. Signed by PIC or Agent.</p>
                  </div>
                  <div className="bg-slate-800 p-3 rounded">
                     <p className="font-bold text-sm text-white mb-1">CMC (Crew Member Cert)</p>
                     <p className="text-xs text-slate-400">States must accept this instead of a passport/visa for crew remaining with aircraft or departing on same/next flight.</p>
                  </div>
               </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
               <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
                  <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
                     <Briefcase size={16} /> Unaccompanied Baggage
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4">
                     <li>Must be transferred efficiently.</li>
                     <li>Secure custody must be arranged.</li>
                     <li>Operator clears it on behalf of passenger.</li>
                  </ul>
               </div>

               <div className="bg-red-900/10 p-5 rounded-lg border border-red-900/30">
                  <h4 className="font-bold text-red-400 text-sm mb-2 flex items-center gap-2">
                     <XCircle size={16} /> Inadmissible Passengers
                  </h4>
                  <p className="text-xs text-slate-300 mb-2">
                     Person refused admission to a State.
                  </p>
                  <div className="bg-slate-800/50 p-2 rounded text-xs text-slate-400 border border-slate-700">
                     <strong>Protocol:</strong> Operator must take them out of State. Operator bears cost initially (can claim back from passenger).
                  </div>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default OperationalInfo;