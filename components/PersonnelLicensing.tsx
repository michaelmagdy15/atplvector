import React, { useState } from 'react';
import { UserCheck, HeartPulse, Clock, Calendar } from 'lucide-react';

const PersonnelLicensing: React.FC = () => {
   const [age, setAge] = useState(30);
   const [medClass, setMedClass] = useState<'1' | '2'>('1');
   const [activeTab, setActiveTab] = useState<'medicals' | 'privileges'>('medicals');
   const [selectedLicense, setSelectedLicense] = useState('PPL');

   const licenseData = {
      'LAPL': { title: 'Light Aircraft Pilot License', role: 'Pilot in Command (PIC)', remuneration: 'No (Cost sharing only)', ifr: 'No', multiPilot: 'No' },
      'PPL': { title: 'Private Pilot License', role: 'Pilot in Command (PIC) or Co-pilot', remuneration: 'No (Instructor PPL is exception)', ifr: 'Yes (with Rating)', multiPilot: 'No' },
      'CPL': { title: 'Commercial Pilot License', role: 'PIC in Commercial Air Transport (Single Pilot)', remuneration: 'Yes', ifr: 'Yes (with Rating)', multiPilot: 'Co-pilot only' },
      'MPL': { title: 'Multi-Crew Pilot License', role: 'Co-Pilot in Multi-Crew only', remuneration: 'Yes', ifr: 'Yes', multiPilot: 'Yes (Restricted to Multi-crew)' },
      'ATPL': { title: 'Airline Transport Pilot License', role: 'PIC in Commercial Air Transport', remuneration: 'Yes', ifr: 'Yes', multiPilot: 'Yes' },
   };

   // Logic from EASA Part-MED
   const getValidity = () => {
      if (medClass === '1') {
         // Class 1 (Commercial)
         if (age < 40) return 12; // 12 months (not 60)
         if (age >= 40 && age < 60) return 12; // Still 12 months but different checks
         if (age >= 60) return 6; // 6 months for commercial transport
         return 12;
      } else {
         // Class 2 (Private)
         if (age < 40) return 60; // 5 years
         if (age >= 40 && age < 50) return 24; // 2 years
         if (age >= 50) return 12; // 1 year
         return 12;
      }
   };

   return (
      <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
         <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
               <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                  <UserCheck className="text-emerald-400" />
                  Personnel Licensing (Annex 1)
               </h2>
               <p className="text-slate-400 text-sm">Licenses, Medicals, and Validity (EASA Part-FCL/MED).</p>
            </div>
            <div className="flex bg-slate-900 p-1 rounded-lg">
               <button onClick={() => setActiveTab('medicals')} className={`px-4 py-2 rounded-md font-bold text-sm ${activeTab === 'medicals' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}>Medicals & Ratings</button>
               <button onClick={() => setActiveTab('privileges')} className={`px-4 py-2 rounded-md font-bold text-sm ${activeTab === 'privileges' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}>License Privileges</button>
            </div>
         </div>

         {activeTab === 'medicals' ? (
            <div className="grid md:grid-cols-2 gap-8 animate-in fade-in">
               {/* Medical Calculator */}
               <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                  <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                     <HeartPulse className="text-red-500" /> Medical Validity Calculator
                  </h3>

                  <div className="space-y-6">
                     <div>
                        <label className="flex justify-between text-slate-400 text-sm mb-2">
                           <span>Pilot Age</span>
                           <span className="font-bold text-white">{age} years</span>
                        </label>
                        <input
                           type="range"
                           min="17"
                           max="70"
                           value={age}
                           onChange={(e) => setAge(parseInt(e.target.value))}
                           className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                     </div>

                     <div>
                        <label className="block text-slate-400 text-sm mb-2">Medical Class</label>
                        <div className="grid grid-cols-2 gap-2">
                           <button
                              onClick={() => setMedClass('1')}
                              className={`p-2 rounded text-sm font-bold border transition-colors ${medClass === '1' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-800 border-slate-600 text-slate-400'}`}
                           >
                              Class 1 (CPL/ATPL)
                           </button>
                           <button
                              onClick={() => setMedClass('2')}
                              className={`p-2 rounded text-sm font-bold border transition-colors ${medClass === '2' ? 'bg-sky-600 border-sky-500 text-white' : 'bg-slate-800 border-slate-600 text-slate-400'}`}
                           >
                              Class 2 (PPL)
                           </button>
                        </div>
                     </div>

                     <div className="mt-4 p-4 bg-slate-800 rounded-lg border border-slate-600 text-center">
                        <p className="text-xs text-slate-400 uppercase mb-1">Validity Period</p>
                        <p className="text-4xl font-black text-white">{getValidity()} <span className="text-lg font-normal text-slate-400">Months</span></p>
                        {age >= 60 && medClass === '1' && (
                           <p className="text-xs text-orange-400 mt-2">Age 60+: Single Pilot Commercial limit (Curtailment).</p>
                        )}
                        {age >= 65 && medClass === '1' && (
                           <p className="text-xs text-red-400 mt-1">Age 65+: No Commercial Transport.</p>
                        )}
                     </div>
                  </div>
               </div>

               {/* Revalidation Rules */}
               <div className="space-y-4">
                  <div className="bg-slate-900 p-4 rounded-lg border-l-4 border-indigo-500">
                     <h4 className="font-bold text-white mb-2">Class Rating Revalidation (SEP)</h4>
                     <p className="text-xs text-slate-300 mb-2">Single Engine Piston ratings expire every 2 years. Revalidate by:</p>
                     <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-slate-800 p-2 rounded border border-slate-600">
                           <p className="font-bold text-white mb-1">Method A: Evaluation</p>
                           <p className="text-slate-400">Proficiency check with Examiner within 3 months of expiry.</p>
                        </div>
                        <div className="bg-slate-800 p-2 rounded border border-slate-600">
                           <p className="font-bold text-white mb-1">Method B: Experience</p>
                           <p className="text-slate-400">In last 12 months: 12h Flight Time (inc. 6h PIC) + 12 T/O & Ldgs + 1h Training Flight.</p>
                        </div>
                     </div>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-lg border-l-4 border-amber-500">
                     <h4 className="font-bold text-white mb-2">Recent Experience (Pax Carrying)</h4>
                     <div className="flex items-center gap-3 bg-slate-800 p-2 rounded mb-2">
                        <Clock size={18} className="text-amber-400" />
                        <span className="text-sm font-bold text-white">3 Take-offs & Landings</span>
                        <span className="text-xs text-slate-400">in last 90 days</span>
                     </div>
                     <p className="text-xs text-slate-400">Must be on same Type/Class. For night passengers, 1 landing must be at night (unless IR holder).</p>
                  </div>
               </div>
            </div>
         ) : (
            <div className="animate-in fade-in">
               <div className="grid grid-cols-5 gap-2 mb-6 overflow-x-auto pb-2">
                  {Object.keys(licenseData).map(lic => (
                     <button
                        key={lic}
                        onClick={() => setSelectedLicense(lic)}
                        className={`p-2 rounded-lg font-bold text-lg transition-all ${selectedLicense === lic ? 'bg-emerald-600 text-white shadow-lg scale-105' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
                     >
                        {lic}
                     </button>
                  ))}
               </div>

               {licenseData[selectedLicense as keyof typeof licenseData] && (
                  <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                     <h3 className="text-xl font-bold text-white mb-6 border-b border-slate-700 pb-4">{licenseData[selectedLicense as keyof typeof licenseData].title}</h3>

                     <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                           <div className="flex justify-between items-center p-3 bg-slate-800 rounded">
                              <span className="text-slate-400 text-sm">Remuneration?</span>
                              <span className={`font-bold ${licenseData[selectedLicense as keyof typeof licenseData].remuneration.includes('Yes') ? 'text-emerald-400' : 'text-red-400'}`}>
                                 {licenseData[selectedLicense as keyof typeof licenseData].remuneration}
                              </span>
                           </div>
                           <div className="flex justify-between items-center p-3 bg-slate-800 rounded">
                              <span className="text-slate-400 text-sm">Instrument Flight?</span>
                              <span className="text-white font-bold">{licenseData[selectedLicense as keyof typeof licenseData].ifr}</span>
                           </div>
                        </div>
                        <div className="space-y-4">
                           <div className="flex justify-between items-center p-3 bg-slate-800 rounded">
                              <span className="text-slate-400 text-sm">Role</span>
                              <span className="text-white font-bold text-sm text-right">{licenseData[selectedLicense as keyof typeof licenseData].role}</span>
                           </div>
                           <div className="flex justify-between items-center p-3 bg-slate-800 rounded">
                              <span className="text-slate-400 text-sm">Multi-Pilot Ops?</span>
                              <span className="text-white font-bold">{licenseData[selectedLicense as keyof typeof licenseData].multiPilot}</span>
                           </div>
                        </div>
                     </div>
                  </div>
               )}
            </div>
         )}
      </div>
   );
};

export default PersonnelLicensing;