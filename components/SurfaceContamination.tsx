import React, { useState } from 'react';
import { Snowflake, Droplets, ThermometerSnowflake, Activity } from 'lucide-react';

const SurfaceContamination: React.FC = () => {
   const [brakingCode, setBrakingCode] = useState(5);
   const [contaminant, setContaminant] = useState<'water' | 'snow' | 'slush'>('water');

   const getEstimatedAction = (code: number) => {
      switch (code) {
         case 5: return { label: 'Good', color: 'text-emerald-400' };
         case 4: return { label: 'Medium-Good', color: 'text-emerald-200' };
         case 3: return { label: 'Medium', color: 'text-yellow-400' };
         case 2: return { label: 'Medium-Poor', color: 'text-orange-400' };
         case 1: return { label: 'Poor', color: 'text-red-500' };
         default: return { label: 'Unreliable', color: 'text-slate-500' };
      }
   };

   const getFrictionCoeff = (code: number) => {
      switch (code) {
         case 5: return '≥ 0.40';
         case 4: return '0.36 - 0.39';
         case 3: return '0.30 - 0.35';
         case 2: return '0.26 - 0.29';
         case 1: return '≤ 0.25';
         default: return 'N/A';
      }
   };

   return (
      <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
         <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
               <ThermometerSnowflake className="text-sky-400" />
               Surface Contamination & Braking
            </h2>
            <p className="text-slate-400 text-sm">Runway conditions and reported braking action.</p>
         </div>

         <div className="grid md:grid-cols-2 gap-8">
            {/* Contaminant Type */}
            <div className="space-y-6">
               <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                  <h3 className="font-bold text-white mb-4">Contaminant Type</h3>
                  <div className="flex gap-2">
                     <button onClick={() => setContaminant('water')} className={`flex-1 p-3 rounded border transition-all ${contaminant === 'water' ? 'bg-blue-900/50 border-blue-500 text-blue-400' : 'bg-slate-800 border-slate-600 text-slate-400'}`}>
                        <div className="flex flex-col items-center">
                           <Droplets size={20} className="mb-1" />
                           <span className="text-xs font-bold">Water</span>
                        </div>
                     </button>
                     <button onClick={() => setContaminant('snow')} className={`flex-1 p-3 rounded border transition-all ${contaminant === 'snow' ? 'bg-white/10 border-white text-white' : 'bg-slate-800 border-slate-600 text-slate-400'}`}>
                        <div className="flex flex-col items-center">
                           <Snowflake size={20} className="mb-1" />
                           <span className="text-xs font-bold">Snow</span>
                        </div>
                     </button>
                     <button onClick={() => setContaminant('slush')} className={`flex-1 p-3 rounded border transition-all ${contaminant === 'slush' ? 'bg-slate-500/20 border-slate-400 text-slate-300' : 'bg-slate-800 border-slate-600 text-slate-400'}`}>
                        <div className="flex flex-col items-center">
                           <Activity size={20} className="mb-1" />
                           <span className="text-xs font-bold">Slush</span>
                        </div>
                     </button>
                  </div>

                  <div className="mt-4 text-xs text-slate-300 bg-slate-800 p-3 rounded">
                     {contaminant === 'water' && (
                        <div className="space-y-3">
                           <ul className="list-disc pl-4 space-y-1">
                              <li><strong>Damp:</strong> Surface shows color change due to moisture, but is NOT reflective & no standing water.</li>
                              <li><strong>Wet:</strong> Surface is soaked, but NO standing water.</li>
                              <li><strong>Water Patches:</strong> Significant patches of standing water are visible.</li>
                              <li><strong>Flooded:</strong> Extensive standing water is visible.</li>
                           </ul>
                           <div className="p-2 bg-amber-900/20 border border-amber-900/50 rounded flex items-center gap-2">
                              <Activity size={14} className="text-amber-500" />
                              <p className="text-[10px] text-amber-200"><strong>Note:</strong> Authorities must report any portion that is "Slippery when wet".</p>
                           </div>
                        </div>
                     )}
                     {contaminant === 'snow' && (
                        <ul className="list-disc pl-4 space-y-1">
                           <li><strong>Dry Snow:</strong> Loose, blown if needed. SG &lt; 0.35.</li>
                           <li><strong>Wet Snow:</strong> Sticks together (snowball). SG 0.35-0.5.</li>
                        </ul>
                     )}
                     {contaminant === 'slush' && (
                        <p>Water-saturated snow. Splatters on impact. SG 0.5-0.8.</p>
                     )}
                  </div>
               </div>
            </div>

            {/* Braking Action */}
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
               <h3 className="font-bold text-white mb-4">Braking Action Code</h3>

               <input
                  type="range" min="1" max="5" step="1"
                  value={brakingCode}
                  onChange={(e) => setBrakingCode(parseInt(e.target.value))}
                  className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500 mb-6"
               />

               <div className="flex justify-between items-center text-center">
                  <div className="bg-slate-800 p-3 rounded w-20 border border-slate-600">
                     <p className="text-[10px] text-slate-400 uppercase">Code</p>
                     <p className="text-3xl font-black text-white">{brakingCode}</p>
                  </div>

                  <div className="flex-1 px-4">
                     <p className="text-[10px] text-slate-400 uppercase mb-1">Estimated Action</p>
                     <p className={`text-xl font-bold ${getEstimatedAction(brakingCode).color}`}>
                        {getEstimatedAction(brakingCode).label}
                     </p>
                     <p className="text-xs text-slate-500 mt-1">Coeff: {getFrictionCoeff(brakingCode)}</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default SurfaceContamination;