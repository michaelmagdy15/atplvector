import React, { useState } from 'react';
import { AlertTriangle, RotateCcw, Check } from 'lucide-react';

const scenarios = [
    {
        id: 'engine_fail',
        title: 'Engine Failure (Twin)',
        desc: 'One engine failed on a twin-engine aircraft. Maintain flight possible.',
        correct: ['pan3', 'station', 'callsign', 'nature_eng', 'intent_land', 'pos', 'pilot']
    },
    {
        id: 'medical',
        title: 'Medical Issue',
        desc: 'Passenger with suspected heart attack.',
        correct: ['pan3', 'station', 'callsign', 'nature_med', 'intent_divert', 'pos', 'pilot']
    }
];

const parts = [
    { id: 'pan3', text: 'PAN-PAN PAN-PAN PAN-PAN', type: 'header' },
    { id: 'mayday3', text: 'MAYDAY MAYDAY MAYDAY', type: 'header_wrong' },
    { id: 'station', text: 'LONDON CENTRE', type: 'address' },
    { id: 'callsign', text: 'SPEEDBIRD 123', type: 'id' },
    { id: 'nature_eng', text: 'ONE ENGINE FAILED', type: 'nature' },
    { id: 'nature_med', text: 'PASSENGER HEART ATTACK', type: 'nature' },
    { id: 'intent_land', text: 'REQUEST PRIORITY LANDING', type: 'intent' },
    { id: 'intent_divert', text: 'DIVERTING TO MANCHESTER', type: 'intent' },
    { id: 'pos', text: '20 MILES NORTH OF MID', type: 'pos' },
    { id: 'pilot', text: '150 POB', type: 'info' },
];

const UrgencyTrainer: React.FC = () => {
    const [scenario, setScenario] = useState(scenarios[0]);
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
        const builtIds = built.map(p => p.id);
        // Check if all correct parts are present
        const allPresent = scenario.correct.every(id => builtIds.includes(id));
        // Check if order is roughly correct (Header first)
        const headerCorrect = built[0]?.id === 'pan3';

        if (allPresent && headerCorrect) {
            setResult('PASS');
        } else {
            setResult('FAIL');
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center mb-2">
                    <AlertTriangle className="mr-2 text-amber-500" /> Urgency (PAN-PAN) Trainer
                </h2>
                <p className="text-slate-400">Practice constructing urgency messages for non-distress situations.</p>
            </div>

            <div className="bg-slate-800 p-4 rounded-xl mb-6 border border-slate-700">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-white">Scenario: {scenario.title}</h3>
                    <div className="flex gap-2">
                        {scenarios.map(s => (
                            <button
                                key={s.id}
                                onClick={() => { setScenario(s); reset(); }}
                                className={`px-3 py-1 rounded text-xs font-bold ${scenario.id === s.id ? 'bg-amber-500 text-slate-900' : 'bg-slate-700 text-slate-300'}`}
                            >
                                {s.title}
                            </button>
                        ))}
                    </div>
                </div>
                <p className="text-slate-300 text-sm">{scenario.desc}</p>
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
                            className={`w-full text-left p-3 rounded-lg border shadow-sm transition-all text-sm font-mono
                                ${p.type === 'header' ? 'bg-amber-500/10 border-amber-500/50 text-amber-200' :
                                    p.type === 'header_wrong' ? 'bg-red-900/10 border-red-900/30 text-red-400' :
                                        'bg-slate-800 border-slate-700 text-slate-300 hover:border-amber-500'}
                                disabled:opacity-30 disabled:cursor-not-allowed
                            `}
                        >
                            {p.text}
                        </button>
                    ))}
                </div>

                {/* Built Message */}
                <div className="bg-slate-900 rounded-xl p-6 flex flex-col min-h-[400px] border border-slate-800">
                    <h3 className="font-bold text-slate-500 uppercase text-xs tracking-wider mb-4">Your Transmission</h3>
                    <div className="flex-1 space-y-2">
                        {built.map((p, idx) => (
                            <div key={p.id} className="text-white font-mono text-lg border-l-2 border-amber-500 pl-3 py-1 animate-in fade-in slide-in-from-left-2">
                                <span className="text-slate-600 text-xs mr-2 select-none">{idx + 1}</span>
                                {p.text}
                            </div>
                        ))}
                        {built.length === 0 && (
                            <div className="text-slate-700 italic text-center mt-20">Tap components to build...</div>
                        )}
                    </div>

                    <div className="mt-6 flex space-x-4">
                        <button onClick={reset} className="p-3 bg-slate-800 text-white rounded hover:bg-slate-700 border border-slate-700">
                            <RotateCcw className="w-5 h-5" />
                        </button>
                        <button
                            onClick={validate}
                            className={`flex-1 py-3 rounded font-bold transition-all flex items-center justify-center gap-2 ${result === 'PASS' ? 'bg-green-600 text-white' :
                                    result === 'FAIL' ? 'bg-red-600 text-white' :
                                        'bg-amber-600 text-white hover:bg-amber-500'
                                }`}
                        >
                            {result === 'PASS' ? <><Check size={20} /> Correct Sequence</> :
                                result === 'FAIL' ? 'Incorrect Structure' : 'Transmit Message'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UrgencyTrainer;
