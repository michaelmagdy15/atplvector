import React, { useState } from 'react';
import { RotateCcw, Check, RefreshCw } from 'lucide-react';

interface Block {
    id: string;
    label: string;
    category: 'fix' | 'level' | 'inbound' | 'turn' | 'time';
}

const FlirtTrainer: React.FC = () => {
    const [slots, setSlots] = useState<Block[]>([]);
    const [result, setResult] = useState<string | null>(null);

    const pool: Block[] = [
        { id: 'f', label: 'FIX (e.g. OCK)', category: 'fix' },
        { id: 'l', label: 'LEVEL (e.g. FL80)', category: 'level' },
        { id: 'i', label: 'INBOUND TRACK', category: 'inbound' },
        { id: 'r', label: 'RIGHT/LEFT TURN', category: 'turn' },
        { id: 't', label: 'TIME (EFC)', category: 'time' },
    ];

    const addToSlot = (block: Block) => {
        if (!slots.find(s => s.id === block.id)) {
            setSlots([...slots, block]);
        }
    };

    const checkOrder = () => {
        const currentString = slots.map(s => s.id).join('');
        if (currentString === 'flirt') {
            setResult('CORRECT');
        } else {
            setResult('WRONG');
        }
    };

    const reset = () => {
        setSlots([]);
        setResult(null);
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-slate-200 text-slate-900">
            <div className="flex items-center space-x-3 mb-6">
                <RotateCcw className="w-6 h-6 text-sky-600" />
                <h2 className="text-2xl font-bold text-slate-800">Holding Instructions (FLIRT)</h2>
            </div>
            <p className="text-slate-500 mb-8">
                According to Page 9, Holding Instructions should follow the <strong>FLIRT</strong> mnemonic. 
                Build the correct sequence below.
            </p>

            {/* Drop Zone */}
            <div className="bg-slate-100 p-6 rounded-xl mb-8 min-h-[100px] flex flex-wrap gap-2 items-center justify-center border-2 border-dashed border-slate-300">
                {slots.length === 0 && <span className="text-slate-400 italic">Tap items below to build sequence</span>}
                {slots.map((s, idx) => (
                    <div key={s.id} className="bg-sky-600 text-white px-4 py-2 rounded-lg font-bold shadow-sm flex items-center animate-in scale-in">
                        <span className="opacity-50 mr-2 text-xs">{idx + 1}</span>
                        {s.label}
                    </div>
                ))}
            </div>

            {/* Pool */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                {pool.map(p => (
                    <button
                        key={p.id}
                        onClick={() => addToSlot(p)}
                        disabled={slots.some(s => s.id === p.id)}
                        className="p-3 bg-white border border-slate-200 rounded-lg hover:border-sky-500 hover:bg-sky-50 disabled:opacity-30 disabled:bg-slate-50 font-medium text-sm transition text-slate-800"
                    >
                        {p.label}
                    </button>
                ))}
            </div>

            <div className="flex justify-between">
                <button onClick={reset} className="p-3 text-slate-500 hover:text-slate-800">
                    <RefreshCw className="w-5 h-5" />
                </button>
                <button 
                    onClick={checkOrder}
                    className={`flex-1 ml-4 py-3 rounded-lg font-bold text-white transition
                        ${result === 'CORRECT' ? 'bg-green-500' : result === 'WRONG' ? 'bg-red-500' : 'bg-slate-800 hover:bg-slate-700'}
                    `}
                >
                    {result === 'CORRECT' ? 'CORRECT SEQUENCE!' : result === 'WRONG' ? 'INCORRECT - TRY AGAIN' : 'CHECK SEQUENCE'}
                </button>
            </div>
        </div>
    );
};

export default FlirtTrainer;