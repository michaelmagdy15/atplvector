import React, { useState } from 'react';
import { Plane, ArrowDown, Eye, Gauge, AlertCircle, AlertOctagon, CheckCircle2 } from 'lucide-react';

const ApproachCategoriesVisualizer: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState<string>('C');

  const categories = [
    { id: 'A', vatMin: 0, vatMax: 90, color: 'emerald', mdh: 400, vis: 1500, desc: 'Light singles and light twins (e.g. C172, DA42)' },
    { id: 'B', vatMin: 91, vatMax: 120, color: 'blue', mdh: 500, vis: 1600, desc: 'Commuters and regional turboprops (e.g. King Air, ATR 42/72)' },
    { id: 'C', vatMin: 121, vatMax: 140, color: 'orange', mdh: 600, vis: 2400, desc: 'Standard narrow-body jet transports (e.g. A320, B737)' },
    { id: 'D', vatMin: 141, vatMax: 165, color: 'red', mdh: 700, vis: 3600, desc: 'Wide-body heavy transport aircraft (e.g. B777, A350, B747)' },
    { id: 'E', vatMin: 166, vatMax: 210, color: 'purple', mdh: 1000, vis: 4500, desc: 'Specialized high-speed military/experimental transports' },
  ];

  const ilsCategories = [
    { cat: 'CAT I', dh: '>= 200 ft', rvr: '>= 550 m', visual: '1 light element of approach/runway', note: 'Standard precision approach' },
    { cat: 'CAT II', dh: '100 - 199 ft', rvr: '>= 300 m', visual: '3 consecutive lights + lateral element', note: 'LVP in force; autoland or approved HUD' },
    { cat: 'CAT IIIA', dh: '< 100 ft or no DH', rvr: '>= 175 m', visual: '3 consecutive lights of CL/TDZ', note: 'Fail-passive autoland minimum' },
    { cat: 'CAT IIIB', dh: '< 50 ft or no DH', rvr: '75 - 174 m', visual: 'At least 1 centerline light', note: 'Fail-operational autoland & rollout' },
  ];

  const npaMinima = [
    { type: 'VOR', mdh: 300 },
    { type: 'VOR/DME or LOC', mdh: 250 },
    { type: 'NDB', mdh: 350 },
    { type: 'NDB/DME', mdh: 300 },
    { type: 'SRA (1 NM)', mdh: 300 },
  ];

  const selectedCategory = categories.find(c => c.id === selectedCat) || categories[2];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-2">
        <Plane className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white">Approach Categories & Operating Minima</h2>
          <p className="text-slate-400 text-sm">
            ICAO Doc 8168 PANS-OPS & EASA Part-CAT • VAT Speed Bands, Circling, and Visual References
          </p>
        </div>
      </div>

      {/* Aircraft Category Selector */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700">
        <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-4">
          Select Aircraft Approach Category (Based on VAT at Maximum Landing Mass):
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                selectedCat === cat.id
                  ? 'bg-blue-600/30 border-blue-500 shadow-lg shadow-blue-500/20'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-600'
              }`}
            >
              <div className="text-3xl font-black text-white font-mono">{cat.id}</div>
              <div className="text-xs font-bold text-blue-400 mt-1">
                {cat.vatMin === 0 ? '< 91' : `${cat.vatMin}-${cat.vatMax}`} kt
              </div>
              <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">{cat.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Circling Minima for Selected Category */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4">
            Circling Approach Minima — Category {selectedCategory.id}
          </span>
          <div className="grid grid-cols-2 gap-6 text-center">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <div className="flex justify-center items-center text-blue-400 mb-2">
                <ArrowDown className="w-5 h-5 mr-1" />
                <span className="font-bold text-xs">MINIMUM MDH</span>
              </div>
              <div className="text-4xl font-black text-white font-mono">
                {selectedCategory.mdh}
                <span className="text-base font-normal text-slate-400 ml-1">ft</span>
              </div>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <div className="flex justify-center items-center text-blue-400 mb-2">
                <Eye className="w-5 h-5 mr-1" />
                <span className="font-bold text-xs">METEOROLOGICAL VIS</span>
              </div>
              <div className="text-4xl font-black text-white font-mono">
                {selectedCategory.vis}
                <span className="text-base font-normal text-slate-400 ml-1">m</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700 space-y-3">
          <h3 className="font-bold text-white text-sm uppercase tracking-wider">
            VAT Threshold Speed Formula
          </h3>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-blue-400 font-bold block mb-0.5">Formula 1 (Landing Configuration):</span>
              <span className="font-mono text-sm text-white font-bold">VAT = 1.30 × Vs0</span>
              <p className="text-[10px] text-slate-500 mt-0.5">Stall speed in the landing configuration at Maximum Certified Landing Mass.</p>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-blue-400 font-bold block mb-0.5">Formula 2 (1g Stall Speed):</span>
              <span className="font-mono text-sm text-white font-bold">VAT = 1.23 × Vs1g</span>
              <p className="text-[10px] text-slate-500 mt-0.5">Stall speed at 1g load factor in the landing configuration.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ILS Precision Categories */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700">
        <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
          <Gauge className="w-5 h-5 text-indigo-400" />
          Precision Approach Operating Categories (EASA Part-CAT)
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ilsCategories.map((ils, i) => (
            <div key={i} className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-left space-y-2">
              <div className="text-xl font-black text-indigo-400 font-mono">{ils.cat}</div>
              <div className="grid grid-cols-2 gap-2 text-xs border-y border-slate-800/80 py-2">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">DH</span>
                  <span className="font-bold text-white font-mono">{ils.dh}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Min RVR</span>
                  <span className="font-bold text-emerald-400 font-mono">{ils.rvr}</span>
                </div>
              </div>
              <div className="text-[11px] text-slate-300">
                <strong>Visual Cue:</strong> {ils.visual}
              </div>
              <div className="text-[10px] text-slate-500 italic">{ils.note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Non-Precision Minimum MDH */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700">
        <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-4">
          Non-Precision Approach (NPA) Minimum MDH by Aid Type
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {npaMinima.map((npa, i) => (
            <div key={i} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <div className="text-xs font-bold text-slate-300 mb-1">{npa.type}</div>
              <div className="text-2xl font-black text-amber-400 font-mono">
                {npa.mdh} <span className="text-xs text-slate-500 font-normal">ft</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual References EASA Standard Framework */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700 space-y-4">
        <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
          <Eye className="w-5 h-5 text-emerald-400" />
          Required Visual References for Precision Approaches (EASA Standard)
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-sm">CAT I Visual References</h4>
            <p className="text-slate-300 leading-relaxed">
              At least <strong>ONE</strong> of the following visual reference elements must be clearly visible and identifiable to the pilot at DH:
            </p>
            <ul className="space-y-1 text-slate-400 list-disc pl-4">
              <li>Elements of the approach lighting system</li>
              <li>The threshold or its markings / lights</li>
              <li>The touchdown zone or its markings / lights</li>
              <li>Runway edge lights or visual glide slope indicators (PAPI/VASI)</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-sm">CAT II Visual References</h4>
            <p className="text-slate-300 leading-relaxed">
              At least <strong>THREE consecutive lights</strong> of the approach lights centerline, runway centerline lights, touchdown zone lights, or runway edge lights, 
              <strong>AND</strong> a lateral element of ground pattern (e.g. an approach light crossbar or the threshold bar).
            </p>
          </div>
        </div>
      </div>

      {/* RTFQ Exam Traps Defense */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-red-500/30 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <AlertOctagon className="text-red-400" />
          Approach Category RTFQ Exam Traps
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h5 className="font-bold text-amber-400 mb-1">Can an Aircraft Fly to a Lower Category?</h5>
            <p className="text-slate-400 leading-relaxed">
              <strong>TRAP:</strong> An aircraft is certified Category C based on maximum landing mass. If landing at light weight, can it use Category B minima? 
              <strong>CORRECT: NEVER!</strong> An aircraft can NEVER operate to lower category minima than its certified category based on MLW. However, if operated at a higher speed, it MUST use higher category minima!
            </p>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h5 className="font-bold text-amber-400 mb-1">Low Visibility Take-off (LVTO) Minima</h5>
            <p className="text-slate-400 leading-relaxed">
              <strong>TRAP:</strong> Standard takeoff minima with runway edge lights and centerline markings: <strong>150 m RVR</strong> for Categories A, B, C; <strong>200 m RVR</strong> for Category D. 
              Can be reduced to 125 m only with high-intensity centerline lights spaced &le;15m and operator approval.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApproachCategoriesVisualizer;
