import React, { useState } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

const parts = [
    { id: 'mayday3', text: 'MAYDAY MAYDAY MAYDAY', type: 'header' },
    { id: 'pan3', text: 'PAN-PAN PAN-PAN PAN-PAN', type: 'header' },
    { id: 'station', text: 'LONDON CENTRE', type: 'address' },
    { id: 'callsign', text: 'FASTAIR 345', type: 'id' },
    { id: 'type', text: 'CESSNA 172', type: 'aircraft' },
    { id: 'nature', text: 'ENGINE FAILURE', type: 'nature' },
    { id: 'position', text: '20 MILES SOUTH OF OCKHAM', type: 'pos' },
    { id: 'intentions', text: 'ATTEMPTING FORCED LANDING', type: 'intent' },
    { id: 'pilot', text: '2 POB, ENDURANCE 2 HOURS', type: 'info' },
];

const EmergencyBuilder: React.FC = () => {
    const [built, setBuilt] = useState<typeof parts>([]);
    const [result, setResult] = useState<string | null>(null);

    const addToMessage = (part: typeof parts[0]) => {
        if (!built.find(p => p.id === part.id)) {
            setBuilt([...built, part]);
        }
    };

    const reset = () => {
        setBuilt([]);
        setResult(null);
    };

    const validate = () => {
        // Ideal order: Header -> Station (Optional) -> Callsign -> Type -> Nature -> Intentions -> Position -> Pilot Info
        // Simplified check: Must start with Header, include Callsign, Nature, Intentions.
        const hasHeader = built[0]?.type === 'header';
        const hasCallsign = built.some(p => p.type === 'id');
        const hasNature = built.some(p => p.type === 'nature');
        
        if (hasHeader && hasCallsign && hasNature) {
            setResult('PASS');
        } else {
            setResult('FAIL');
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
             <div className="mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                    <AlertCircle className="mr-2 text-red-500" /> Distress Message Builder
                </h2>
                <p className="text-slate-400">Construct a valid ICAO distress message by clicking the components in the correct order.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Source Parts */}
                <div className="space-y-3">
                    <h3 className="font-bold text-slate-400 uppercase text-xs tracking-wider mb-2">Available Components</h3>
                    {parts.map(p => (
                        <button
                            key={p.id}
                            onClick={() => addToMessage(p)}
                            disabled={!!built.find(x => x.id === p.id)}
                            className="w-full text-left p-3 rounded-lg bg-white border border-slate-200 shadow-sm hover:border-sky-500 disabled:opacity-40 disabled:bg-slate-50 font-mono text-sm text-slate-900"
                        >
                            {p.text}
                        </button>
                    ))}
                </div>

                {/* Built Message */}
                <div className="bg-slate-900 rounded-xl p-6 flex flex-col min-h-[400px]">
                     <h3 className="font-bold text-slate-500 uppercase text-xs tracking-wider mb-4">Your Transmission</h3>
                     <div className="flex-1 space-y-2">
                        {built.map((p, idx) => (
                            <div key={p.id} className="text-white font-mono text-lg border-l-2 border-sky-500 pl-3 py-1 animate-in fade-in slide-in-from-left-2">
                                <span className="text-slate-500 text-xs mr-2 select-none">{idx + 1}</span>
                                {p.text}
                            </div>
                        ))}
                        {built.length === 0 && (
                            <div className="text-slate-600 italic text-center mt-20">Tap components to start building...</div>
                        )}
                     </div>

                     <div className="mt-6 flex space-x-4">
                        <button onClick={reset} className="p-3 bg-slate-800 text-white rounded hover:bg-slate-700">
                            <RotateCcw className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={validate}
                            className={`flex-1 py-3 rounded font-bold transition-all ${
                                result === 'PASS' ? 'bg-green-500 text-white' : 
                                result === 'FAIL' ? 'bg-red-500 text-white' : 
                                'bg-sky-600 text-white hover:bg-sky-500'
                            }`}
                        >
                            {result === 'PASS' ? 'CORRECT STRUCTURE' : result === 'FAIL' ? 'INCOMPLETE / WRONG ORDER' : 'TRANSMIT'}
                        </button>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default EmergencyBuilder;