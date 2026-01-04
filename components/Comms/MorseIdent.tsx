
import React, { useState } from 'react';
import { Radio, Play, Check } from 'lucide-react';

const MorseIdent: React.FC = () => {
    const [activeId, setActiveId] = useState<string | null>(null);

    const aids = [
        { id: 'VOR', freq: 1020, label: 'VOR', desc: 'Continuous or 10s', rate: '3 letters' },
        { id: 'DME', freq: 1350, label: 'DME', desc: 'Every 30s', rate: 'Higher Pitch' },
        { id: 'ILS', freq: 1020, label: 'ILS', desc: 'Continuous', rate: 'Approx 6/min' }
    ];

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Radio className="text-green-500" /> Nav Aid Identification
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
                {aids.map(aid => (
                    <div key={aid.id} className="bg-slate-900 p-6 rounded-xl border border-slate-600 hover:border-green-500 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-2xl font-black text-white">{aid.label}</h3>
                            <button 
                                onClick={() => setActiveId(aid.id)}
                                className={`p-2 rounded-full ${activeId === aid.id ? 'bg-green-500 text-white' : 'bg-slate-800 text-slate-400'}`}
                            >
                                {activeId === aid.id ? <Radio className="animate-pulse" /> : <Play size={16} />}
                            </button>
                        </div>
                        
                        <div className="space-y-2 text-sm text-slate-400">
                            <div className="flex justify-between">
                                <span>Freq:</span> <span className="text-white font-mono">{aid.freq} Hz</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Rate:</span> <span className="text-white">{aid.desc}</span>
                            </div>
                        </div>

                        {activeId === aid.id && (
                            <div className="mt-4 p-3 bg-green-900/20 rounded border border-green-900/50 text-xs text-green-300">
                                Audio Sim: *Beep Beep Beep* <br/>
                                {aid.id === 'DME' && "(Higher Pitch than VOR)"}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-6 p-4 bg-slate-700/50 rounded-lg text-sm text-slate-300">
                <strong>Synchronization:</strong> When VOR and DME are associated, their idents are synchronized. 
                Typically, the VOR ident is transmitted 3 times, followed by the DME ident once.
            </div>
        </div>
    );
};

export default MorseIdent;
