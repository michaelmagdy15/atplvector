import React, { useState } from 'react';
import { Snowflake, AlertTriangle } from 'lucide-react';

const SnowtamDecoder: React.FC = () => {
  const [friction, setFriction] = useState(0.42);

  const getCondition = (coef: number) => {
    if (coef >= 0.40) return { code: 5, action: 'Good', color: 'text-green-600', bg: 'bg-green-100' };
    if (coef >= 0.36) return { code: 4, action: 'Medium to Good', color: 'text-lime-600', bg: 'bg-lime-100' };
    if (coef >= 0.30) return { code: 3, action: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (coef >= 0.26) return { code: 2, action: 'Medium to Poor', color: 'text-orange-600', bg: 'bg-orange-100' };
    if (coef > 9) return { code: 9, action: 'Unreliable', color: 'text-red-600', bg: 'bg-red-100' }; // Special case handling
    return { code: 1, action: 'Poor', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const result = getCondition(friction);

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-slate-200 text-slate-900">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-sky-100 rounded-lg">
           <Snowflake className="w-6 h-6 text-sky-600" />
        </div>
        <div>
           <h2 className="text-2xl font-bold text-slate-800">SNOWTAM Decoder</h2>
           <p className="text-slate-500 text-sm">Convert Friction Coefficient to RWY Condition Code</p>
        </div>
      </div>

      <div className="mb-12 px-4">
        <label className="block text-center text-slate-500 font-bold uppercase text-xs tracking-widest mb-4">Measured Friction Coefficient</label>
        <div className="relative">
            <input 
                type="range" 
                min="0.20" 
                max="0.60" 
                step="0.01" 
                value={friction}
                onChange={(e) => setFriction(Number(e.target.value))}
                className="w-full h-4 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
            />
            <div className="mt-4 text-center font-mono text-3xl font-bold text-slate-800">
                0.{Math.round(friction * 100)}
            </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className={`p-6 rounded-xl border-2 ${result.bg} border-transparent flex flex-col items-center justify-center text-center`}>
            <div className="text-xs font-bold uppercase opacity-60 mb-2 text-slate-700">Braking Action</div>
            <div className={`text-2xl font-black ${result.color}`}>{result.action.toUpperCase()}</div>
        </div>

        <div className={`p-6 rounded-xl border-2 ${result.bg} border-transparent flex flex-col items-center justify-center text-center`}>
            <div className="text-xs font-bold uppercase opacity-60 mb-2 text-slate-700">RWY Condition Code</div>
            <div className={`text-5xl font-black ${result.color}`}>{result.code}</div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-start text-sm text-slate-600">
         <AlertTriangle className="w-5 h-5 text-orange-500 mr-2 flex-shrink-0" />
         <p>
            <strong>Note:</strong> Code 9 indicates unreliable readings (e.g., dry snow, slush). 
            Values ≥ 0.40 are considered Good (Code 5). Values ≤ 0.25 are Poor (Code 1).
         </p>
      </div>
    </div>
  );
};

export default SnowtamDecoder;