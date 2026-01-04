import React, { useState } from 'react';
import { Mic } from 'lucide-react';

const challenges = [
    { raw: 'FL100', answer: 'FLIGHT LEVEL ONE HUNDRED' },
    { raw: '2400ft', answer: 'TWO THOUSAND FOUR HUNDRED' },
    { raw: '118.1', answer: 'ONE ONE EIGHT DECIMAL ONE' },
    { raw: '1000', answer: 'ONE THOUSAND' },
    { raw: 'FL240', answer: 'FLIGHT LEVEL TWO FOUR ZERO' } // FL ending in 00 is hundred, else digits
];

const AltSpeak: React.FC = () => {
    const [index, setIndex] = useState(0);
    const [show, setShow] = useState(false);

    const current = challenges[index];

    const next = () => {
        setIndex((prev) => (prev + 1) % challenges.length);
        setShow(false);
    };

    return (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg text-center border border-slate-200 text-slate-900">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Transmission Numbers</h2>
            
            <div className="bg-slate-100 p-8 rounded-xl mb-6">
                <div className="text-slate-400 text-xs font-bold uppercase mb-2">TRANSMIT THIS:</div>
                <div className="text-4xl font-black text-slate-800">{current.raw}</div>
            </div>

            {show ? (
                <div className="bg-green-100 text-green-800 p-4 rounded-xl font-bold animate-in fade-in mb-6">
                    "{current.answer}"
                </div>
            ) : (
                <div className="h-16 mb-6"></div>
            )}

            <div className="flex gap-4">
                <button onClick={() => setShow(true)} className="flex-1 py-3 bg-white border-2 border-slate-200 rounded-lg font-bold hover:bg-slate-50 text-slate-800">
                    Reveal Answer
                </button>
                <button onClick={next} className="flex-1 py-3 bg-sky-600 text-white rounded-lg font-bold hover:bg-sky-700">
                    Next
                </button>
            </div>
        </div>
    );
};

export default AltSpeak;