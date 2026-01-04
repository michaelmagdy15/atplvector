import React, { useState } from 'react';
import { Mic } from 'lucide-react';

const scenarios = [
    {
        atc: "Fastair 345, climb flight level 240, turn right heading 090.",
        template: "Climb flight level {0}, turn right heading {1}, Fastair 345.",
        answers: ["240", "090"]
    },
    {
        atc: "Fastair 345, cleared for takeoff runway 27, wind 250 degrees 10 knots.",
        template: "Cleared for takeoff runway {0}, Fastair 345.",
        answers: ["27"]
    },
    {
        atc: "Fastair 345, squawk 4321, contact London Control 132.6.",
        template: "Squawk {0}, contact London Control {1}, Fastair 345.",
        answers: ["4321", "132.6"]
    }
];

const ReadbackChallenge: React.FC = () => {
    const [index, setIndex] = useState(0);
    const [inputs, setInputs] = useState<string[]>(['', '']);
    const [checked, setChecked] = useState(false);

    const current = scenarios[index];

    const handleInput = (val: string, i: number) => {
        const newInputs = [...inputs];
        newInputs[i] = val;
        setInputs(newInputs);
    };

    const check = () => {
        setChecked(true);
    };

    const next = () => {
        setIndex((prev) => (prev + 1) % scenarios.length);
        setInputs(['', '']);
        setChecked(false);
    };

    // Render logic to split template by placeholders
    const parts = current.template.split(/\{(\d)\}/);

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-slate-200 text-slate-900">
             <div className="flex items-start mb-8">
                <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <Mic className="text-white w-6 h-6" />
                </div>
                <div className="bg-slate-100 p-4 rounded-xl rounded-tl-none w-full">
                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">ATC Transmission</div>
                    <div className="text-lg font-medium text-slate-900 font-mono">"{current.atc}"</div>
                </div>
             </div>

             <div className="mb-8 pl-16">
                 <div className="text-xs font-bold text-slate-500 uppercase mb-2">Your Readback</div>
                 <div className="text-xl leading-loose font-mono text-slate-700">
                    {parts.map((part, i) => {
                        // If part is a digit, it's a placeholder index
                        if (/^\d$/.test(part)) {
                            const idx = parseInt(part);
                            const isCorrect = inputs[idx] === current.answers[idx];
                            return (
                                <input
                                    key={i}
                                    type="text"
                                    disabled={checked}
                                    value={inputs[idx] || ''}
                                    onChange={(e) => handleInput(e.target.value, idx)}
                                    className={`inline-block mx-1 w-24 border-b-2 text-center outline-none bg-transparent font-bold text-slate-800
                                        ${checked ? (isCorrect ? 'border-green-500 text-green-600' : 'border-red-500 text-red-600') : 'border-slate-300 focus:border-sky-500'}
                                    `}
                                    placeholder="___"
                                />
                            );
                        }
                        return <span key={i}>{part}</span>;
                    })}
                 </div>
             </div>

             <div className="flex justify-end">
                 {!checked ? (
                     <button onClick={check} className="bg-sky-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-sky-700">
                        Check Readback
                     </button>
                 ) : (
                     <button onClick={next} className="bg-slate-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-700">
                        Next Transmission
                     </button>
                 )}
             </div>
        </div>
    );
};

export default ReadbackChallenge;