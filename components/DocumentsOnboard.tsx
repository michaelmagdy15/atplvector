import React, { useState } from 'react';
import { FileText, CheckSquare, Briefcase, Globe } from 'lucide-react';

const DocumentsOnboard: React.FC = () => {
  const documents = [
    { id: 'reg', name: 'Certificate of Registration', annex: 'Annex 7', desc: 'Original required. Proves nationality.' },
    { id: 'cof', name: 'Certificate of Airworthiness', annex: 'Annex 8', desc: 'Original required. Must be valid.' },
    { id: 'crew', name: 'Crew Licenses', annex: 'Annex 1', desc: 'For every crew member. Must be valid with medical.' },
    { id: 'log', name: 'Journey Log Book', annex: 'Annex 6', desc: 'Details of the aircraft, crew, and flight times.' },
    { id: 'radio', name: 'Radio Station License', annex: 'Annex 10', desc: 'If radio equipment is installed.' },
    { id: 'pax', name: 'Passenger Manifest', annex: 'Annex 9', desc: 'List of names and places of embarkation/destination.' },
    { id: 'cargo', name: 'Cargo Manifest', annex: 'Annex 9', desc: 'Detailed declaration of cargo.' },
    { id: 'insurance', name: 'Insurance Certificate', annex: 'EU Regs', desc: 'Third party liability cover.' },
    { id: 'noise', name: 'Noise Certificate', annex: 'Annex 16', desc: 'If applicable to aircraft type.' },
    { id: 'aoc', name: 'Certified Copy of AOC', annex: 'Annex 6', desc: 'For Commercial Air Transport.' },
  ];

  const [checked, setChecked] = useState<string[]>([]);

  const toggleCheck = (id: string) => {
    if (checked.includes(id)) {
      setChecked(checked.filter(c => c !== id));
    } else {
      setChecked([...checked, id]);
    }
  };

  const allChecked = checked.length === documents.length;

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Briefcase className="text-amber-500" />
            Documents to be Carried (Article 29)
          </h2>
          <p className="text-slate-400 text-sm">Mandatory documentation for international navigation.</p>
        </div>
        <div className="bg-slate-900 px-4 py-2 rounded text-xs text-slate-400 border border-slate-700">
           {checked.length} / {documents.length} Checked
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
         {documents.map((doc) => (
            <div 
               key={doc.id}
               onClick={() => toggleCheck(doc.id)}
               className={`p-4 rounded-lg border cursor-pointer transition-all flex items-start gap-4 ${
                  checked.includes(doc.id) 
                  ? 'bg-emerald-900/20 border-emerald-500/50' 
                  : 'bg-slate-900 border-slate-700 hover:border-slate-500'
               }`}
            >
               <div className={`mt-1 p-1 rounded ${checked.includes(doc.id) ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-600'}`}>
                  <CheckSquare size={20} />
               </div>
               <div>
                  <h3 className={`font-bold text-sm ${checked.includes(doc.id) ? 'text-emerald-400' : 'text-white'}`}>
                     {doc.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 mb-1">
                     <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 border border-slate-600">
                        {doc.annex}
                     </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-snug">{doc.desc}</p>
               </div>
            </div>
         ))}
      </div>

      {allChecked && (
         <div className="mt-6 p-4 bg-emerald-600 text-white rounded-lg text-center font-bold animate-in zoom-in">
            All Documents Onboard. Ready for Ramp Check!
         </div>
      )}
    </div>
  );
};

export default DocumentsOnboard;