import React, { useState } from 'react';
import { interceptSignals } from '../data/courseData';
import { Eye, Plane } from 'lucide-react';

const InterceptTrainer: React.FC = () => {
    const [index, setIndex] = useState(0);
    const [revealed, setRevealed] = useState(false);

    const current = interceptSignals[index];

    const next = () => {
        setRevealed(false);
        setIndex((prev) => (prev + 1) % interceptSignals.length);
    };

    return (
        <div className="max-w-2xl mx-auto bg-slate-900 rounded-2xl shadow-xl overflow-hidden text-white">
            <div className="p-8 border-b border-slate-800">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-red-500/20 rounded-lg">
                         <Plane className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Interception Procedures</h2>
                        <p className="text-slate-400 text-sm">Standard EASA/ICAO visual signals</p>
                    </div>
                </div>
            </div>

            <div className="p-12 text-center min-h-[300px] flex flex-col justify-center items-center">
                 <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">INTERCEPTING AIRCRAFT ACTION</div>
                 <div className="text-2xl font-medium leading-relaxed mb-8">
                     "{current.signal}"
                 </div>

                 {revealed ? (
                     <div className="bg-green-500/20 text-green-400 px-6 py-4 rounded-xl border border-green-500/30 animate-in fade-in slide-in-from-bottom-4">
                         <div className="text-xs font-bold uppercase mb-1 opacity-70">YOU MUST</div>
                         <div className="text-xl font-bold">{current.meaning}</div>
                     </div>
                 ) : (
                     <button 
                        onClick={() => setRevealed(true)}
                        className="flex items-center space-x-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                     >
                         <Eye className="w-4 h-4" /> <span>Reveal Meaning</span>
                     </button>
                 )}
            </div>

            <div className="bg-slate-950 p-4 flex justify-between items-center">
                 <div className="text-xs text-slate-500 font-mono">SIGNAL {index + 1} OF {interceptSignals.length}</div>
                 <button onClick={next} className="px-4 py-2 bg-sky-600 hover:bg-sky-500 rounded font-bold text-sm">Next Signal</button>
            </div>
        </div>
    );
};

export default InterceptTrainer;
