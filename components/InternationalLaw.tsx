import React, { useState } from 'react';
import { Globe, Plane, Gavel, FileText, ArrowRight } from 'lucide-react';

const InternationalLaw: React.FC = () => {
  const [freedom, setFreedom] = useState(1);

  const freedoms = [
    { id: 1, title: '1st Freedom', desc: 'The right to fly over a foreign country without landing.', visual: 'A -> [Overfly B] -> C' },
    { id: 2, title: '2nd Freedom', desc: 'The right to refuel or carry out maintenance in a foreign country without embarking or disembarking passengers or cargo.', visual: 'A -> [Tech Stop B] -> C' },
    { id: 3, title: '3rd Freedom', desc: 'The right to fly from one\'s own country to another country.', visual: 'Home -> B' },
    { id: 4, title: '4th Freedom', desc: 'The right to fly from another country back to one\'s own country.', visual: 'B -> Home' },
    { id: 5, title: '5th Freedom', desc: 'The right to fly between two foreign countries on a flight originating or ending in one\'s own country.', visual: 'Home -> B -> C' },
  ];

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Gavel className="text-purple-400" />
          International Law & Conventions
        </h2>
        <p className="text-slate-400 text-sm">Chicago Convention (1944), Freedoms of the Air, and Liability.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">

        {/* Freedoms of the Air Visualizer */}
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-700">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <Plane className="text-sky-400" /> Freedoms of the Air
          </h3>

          <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
            {freedoms.map(f => (
              <button
                key={f.id}
                onClick={() => setFreedom(f.id)}
                className={`px-3 py-1 rounded text-xs font-bold whitespace-nowrap transition-all ${freedom === f.id ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
              >
                {f.id}{f.id === 1 ? 'st' : f.id === 2 ? 'nd' : f.id === 3 ? 'rd' : 'th'}
              </button>
            ))}
          </div>

          <div className="mb-4 flex gap-4 text-[10px] uppercase font-bold tracking-wider">
            <span className={freedom <= 2 ? "text-sky-400" : "text-slate-600"}>Technical Freedoms (1-2)</span>
            <span className={freedom >= 3 ? "text-indigo-400" : "text-slate-600"}>Commercial Freedoms (3-5)</span>
          </div>

          <div className="relative h-40 bg-slate-800/50 rounded-lg flex items-center justify-center mb-4 overflow-hidden border border-slate-700">
            {/* Simple visual representation */}
            <div className="flex items-center gap-8 text-sm font-bold">
              {freedom === 1 && (
                <>
                  <div className="bg-indigo-600 p-2 rounded text-white">State A</div>
                  <ArrowRight className="text-slate-500" />
                  <div className="bg-slate-700 p-2 rounded text-slate-400 border border-dashed border-sky-500">State B (Overfly)</div>
                  <ArrowRight className="text-slate-500" />
                  <div className="bg-emerald-600 p-2 rounded text-white">State C</div>
                </>
              )}
              {freedom === 2 && (
                <>
                  <div className="bg-indigo-600 p-2 rounded text-white">State A</div>
                  <ArrowRight className="text-slate-500" />
                  <div className="bg-amber-600 p-2 rounded text-white">State B (Refuel)</div>
                  <ArrowRight className="text-slate-500" />
                  <div className="bg-emerald-600 p-2 rounded text-white">State C</div>
                </>
              )}
              {freedom === 3 && (
                <>
                  <div className="bg-indigo-600 p-2 rounded text-white">Home State</div>
                  <div className="w-12 h-0.5 bg-sky-500 relative">
                    <Plane size={16} className="absolute -top-2 left-1/2 -translate-x-1/2 text-white" />
                  </div>
                  <div className="bg-emerald-600 p-2 rounded text-white">State B</div>
                </>
              )}
              {freedom === 4 && (
                <>
                  <div className="bg-emerald-600 p-2 rounded text-white">State B</div>
                  <div className="w-12 h-0.5 bg-sky-500 relative">
                    <Plane size={16} className="absolute -top-2 left-1/2 -translate-x-1/2 text-white transform rotate-180" />
                  </div>
                  <div className="bg-indigo-600 p-2 rounded text-white">Home State</div>
                </>
              )}
              {freedom === 5 && (
                <>
                  <div className="bg-indigo-600 p-2 rounded text-white">Home</div>
                  <ArrowRight className="text-slate-500" />
                  <div className="bg-emerald-600 p-2 rounded text-white">State B</div>
                  <div className="w-12 h-0.5 bg-sky-500 relative">
                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] whitespace-nowrap">Pick Up Pax</span>
                  </div>
                  <div className="bg-purple-600 p-2 rounded text-white">State C</div>
                </>
              )}
            </div>
          </div>

          <div className="bg-slate-800 p-4 rounded border-l-4 border-sky-500">
            <h4 className="font-bold text-white mb-1">{freedoms.find(f => f.id === freedom)?.title}</h4>
            <p className="text-sm text-slate-300">{freedoms.find(f => f.id === freedom)?.desc}</p>
          </div>
        </div>

        {/* Conventions Detailed list */}
        <div className="space-y-4">
          <h3 className="font-bold text-white flex items-center gap-2">
            <Globe size={16} className="text-purple-400" /> Major Conventions
          </h3>

          <div className="space-y-3 h-[400px] overflow-y-auto pr-2 custom-scrollbar">

            {/* Paris 1919 */}
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 relative pl-10 opacity-70 hover:opacity-100 transition-opacity">
              <div className="absolute left-3 top-3 w-4 h-4 rounded-full bg-slate-600 flex items-center justify-center text-[10px] font-bold text-white">1</div>
              <div className="absolute left-[19px] top-8 bottom-0 w-0.5 bg-slate-700"></div>
              <h4 className="font-bold text-white text-sm">Paris Convention (1919)</h4>
              <p className="text-xs text-slate-400">First International Air Navigation Convention. Established ICAN (Pre-ICAO).</p>
              <p className="text-[10px] text-slate-500 mt-1 font-mono">SOVEREIGNTY over airspace recognized.</p>
            </div>

            {/* Warsaw 1929 */}
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 relative pl-10">
              <div className="absolute left-3 top-3 w-4 h-4 rounded-full bg-amber-600 flex items-center justify-center text-[10px] font-bold text-white">2</div>
              <div className="absolute left-[19px] top-8 bottom-0 w-0.5 bg-slate-700"></div>
              <h4 className="font-bold text-white text-sm">Warsaw (1929) &rarr; Montreal (1999)</h4>
              <p className="text-xs text-slate-300">Liability of carriers (Tickets, Baggage).</p>
              <ul className="text-[10px] text-slate-400 mt-1 pl-2 list-disc">
                <li>Strict Liability for Pax injury/death.</li>
                <li>Measured in SDR (Special Drawing Rights).</li>
              </ul>
            </div>

            {/* Chicago 1944 */}
            <div className="bg-slate-900 p-3 rounded-lg border border-indigo-500 relative pl-10 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
              <div className="absolute left-3 top-3 w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-bold text-white">3</div>
              <div className="absolute left-[19px] top-8 bottom-0 w-0.5 bg-slate-700"></div>
              <h4 className="font-bold text-white text-sm">Chicago Convention (1944)</h4>
              <span className="text-[10px] bg-indigo-600 text-white px-1.5 py-0.5 rounded ml-2">CRITICAL</span>
              <p className="text-xs text-slate-300 mt-1">Established <strong>ICAO</strong>. 52 Signatories.</p>
              <ul className="text-[10px] text-slate-400 mt-1 pl-2 list-disc">
                <li>Sovereignty (Article 1).</li>
                <li>Rules of the Air (Article 12) - must prevail over High Seas.</li>
                <li>Registration (Article 17) - one state only.</li>
              </ul>
            </div>

            {/* Geneva 1948 */}
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 relative pl-10 opacity-80">
              <div className="absolute left-3 top-3 w-4 h-4 rounded-full bg-slate-600 flex items-center justify-center text-[10px] font-bold text-white">4</div>
              <div className="absolute left-[19px] top-8 bottom-0 w-0.5 bg-slate-700"></div>
              <h4 className="font-bold text-white text-sm">Geneva Convention (1948)</h4>
              <p className="text-xs text-slate-400">International recognition of <strong>Rights in Aircraft</strong> (Property/Ownership).</p>
            </div>

            {/* Rome 1952 */}
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 relative pl-10 opacity-80">
              <div className="absolute left-3 top-3 w-4 h-4 rounded-full bg-slate-600 flex items-center justify-center text-[10px] font-bold text-white">5</div>
              <div className="absolute left-[19px] top-8 bottom-0 w-0.5 bg-slate-700"></div>
              <h4 className="font-bold text-white text-sm">Rome Convention (1952)</h4>
              <p className="text-xs text-slate-400">Damage caused to third parties <strong>on the surface</strong>.</p>
            </div>

            {/* Tokyo 1963 */}
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 relative pl-10">
              <div className="absolute left-3 top-3 w-4 h-4 rounded-full bg-red-600 flex items-center justify-center text-[10px] font-bold text-white">6</div>
              <div className="absolute left-[19px] top-8 bottom-0 w-0.5 bg-slate-700"></div>
              <h4 className="font-bold text-white text-sm">Tokyo Convention (1963)</h4>
              <p className="text-xs text-slate-300">Offences <strong>on board</strong> aircraft.</p>
              <p className="text-[10px] text-slate-400 mt-1">Gives PIC power to restrain PAX for safety. Jurisdiction = State of Registration.</p>
            </div>

            {/* Hague 1970 */}
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 relative pl-10">
              <div className="absolute left-3 top-3 w-4 h-4 rounded-full bg-red-600 flex items-center justify-center text-[10px] font-bold text-white">7</div>
              <div className="absolute left-[19px] top-8 bottom-0 w-0.5 bg-slate-700"></div>
              <h4 className="font-bold text-white text-sm">Hague Convention (1970)</h4>
              <p className="text-xs text-slate-300">Suppression of <strong>Unlawful Seizure</strong> (Hijacking).</p>
            </div>

            {/* Montreal 1971 */}
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 relative pl-10">
              <div className="absolute left-3 top-3 w-4 h-4 rounded-full bg-red-600 flex items-center justify-center text-[10px] font-bold text-white">8</div>
              <h4 className="font-bold text-white text-sm">Montreal Convention (1971)</h4>
              <p className="text-xs text-slate-300">Suppression of <strong>Unlawful Acts</strong> against Safety (Sabotage/Bombing).</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InternationalLaw;