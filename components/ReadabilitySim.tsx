import React, { useState } from 'react';
import { Volume2, RefreshCcw } from 'lucide-react';

const messages = [
    "Climb flight level one zero zero",
    "Turn right heading two seven zero",
    "Cleared for takeoff runway zero nine",
    "Report passing altitude three thousand",
    "Contact ground one two one decimal nine"
];

const ReadabilitySim: React.FC = () => {
    const [level, setLevel] = useState(5);
    const [msgIndex, setMsgIndex] = useState(0);

    const getGarbledMessage = (text: string, scale: number) => {
        if (scale === 5) return text;
        if (scale === 1) return text.replace(/[a-zA-Z0-9]/g, '█');
        
        const chance = (5 - scale) * 0.2; // 1->0.8, 2->0.6, 3->0.4, 4->0.2
        return text.split('').map(char => {
            if (char === ' ') return ' ';
            return Math.random() < chance ? (Math.random() > 0.5 ? '_' : '.') : char;
        }).join('');
    };

    const definitions = [
        "Unreadable",
        "Readable now and then",
        "Readable but with difficulty",
        "Readable",
        "Perfectly readable"
    ];

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-slate-200 text-slate-900">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-800">Radio Readability Scale</h2>
                <p className="text-slate-500">"Station calling, reading you..."</p>
            </div>

            <div className="bg-slate-900 p-8 rounded-xl mb-8 relative overflow-hidden font-mono min-h-[120px] flex items-center justify-center">
                <div className={`text-xl md:text-2xl text-green-400 text-center transition-opacity duration-200 ${level < 3 ? 'opacity-50 blur-[1px]' : 'opacity-100'}`}>
                    "{getGarbledMessage(messages[msgIndex], level)}"
                </div>
                {level < 3 && <div className="absolute inset-0 bg-white/5 pointer-events-none animate-pulse"></div>}
            </div>

            <div className="mb-8">
                <input 
                    type="range" 
                    min="1" 
                    max="5" 
                    step="1" 
                    value={level}
                    onChange={(e) => setLevel(Number(e.target.value))}
                    className="w-full h-4 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                />
                <div className="flex justify-between text-xs font-bold text-slate-400 mt-2">
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    <span>5</span>
                </div>
            </div>

            <div className="text-center">
                <div className="text-6xl font-black text-slate-800 mb-2">{level}</div>
                <div className="text-xl text-sky-600 font-bold">{definitions[level - 1]}</div>
            </div>

            <button onClick={() => setMsgIndex((prev) => (prev + 1) % messages.length)} className="mt-8 mx-auto flex items-center text-slate-400 hover:text-slate-600">
                <RefreshCcw className="w-4 h-4 mr-2" /> New Transmission
            </button>
        </div>
    );
};

export default ReadabilitySim;