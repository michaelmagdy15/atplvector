import React, { useState } from 'react';
import { UserCheck, HeartPulse, Clock, Calendar } from 'lucide-react';

const PersonnelLicensing: React.FC = () => {
  const [age, setAge] = useState(30);
  const [medClass, setMedClass] = useState<'1' | '2'>('1');
  const [licenseType, setLicenseType] = useState('ATPL'); // ATPL/CPL requires Class 1, PPL Class 2

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
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <UserCheck className="text-emerald-400" />
          Personnel Licensing (Annex 1)
        </h2>
        <p className="text-slate-400 text-sm">Licenses, Medicals, and Validity (EASA Part-FCL/MED).</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
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

              <div className="mt-4 p-4 bg-slate-800 rounded-lg border border-slate-600 text-center animate-in zoom-in duration-300">
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

        {/* License Info */}
        <div className="space-y-4">
           <div className="bg-slate-900 p-4 rounded-lg border-l-4 border-indigo-500">
              <h4 className="font-bold text-white mb-2">Recent Experience (Recency)</h4>
              <p className="text-sm text-slate-300 mb-2">To carry passengers:</p>
              <div className="flex items-center gap-3 bg-slate-800 p-2 rounded">
                 <Clock size={18} className="text-indigo-400" />
                 <span className="text-sm font-bold text-white">3 Take-offs & Landings</span>
                 <span className="text-xs text-slate-400">in last 90 days</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">Must be on same Type/Class. For night passengers, 1 landing must be at night.</p>
           </div>

           <div className="bg-slate-900 p-4 rounded-lg border-l-4 border-amber-500">
              <h4 className="font-bold text-white mb-2">License Validity</h4>
              <div className="space-y-2 text-sm">
                 <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">PPL / CPL / ATPL</span>
                    <span className="text-white font-bold">Non-Expiring*</span>
                 </div>
                 <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">SEP / MEP Rating</span>
                    <span className="text-white font-bold">1 Year (MEP) / 2 Years (SEP)</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-slate-400">IR Rating</span>
                    <span className="text-white font-bold">1 Year</span>
                 </div>
                 <p className="text-[10px] text-slate-500 mt-2">*License doc valid 5 years, but privileges depend on valid ratings & medical.</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default PersonnelLicensing;