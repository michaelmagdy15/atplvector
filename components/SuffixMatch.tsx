import React, { useState, useEffect } from 'react';
import { Radio } from 'lucide-react';

const pairs = [
    { service: 'Area Control Centre', suffix: 'CONTROL' },
    { service: 'Approach Control (No Radar)', suffix: 'APPROACH' },
    { service: 'Approach Control (Radar Arrival)', suffix: 'ARRIVAL' },
    { service: 'Aerodrome Control', suffix: 'TOWER' },
    { service: 'Surface Movement', suffix: 'GROUND' },
    { service: 'Radar (Enroute)', suffix: 'RADAR' },
    { service: 'Precision Approach Radar', suffix: 'PRECISION' },
    { service: 'Flight Information', suffix: 'INFORMATION' },
    { service: 'Clearance Delivery', suffix: 'DELIVERY' },
    { service: 'Apron Control', suffix: 'APRON' },
];

const SuffixMatch: React.FC = () => {
    const [target, setTarget] = useState(pairs[0]);
    const [options, setOptions] = useState<string[]>([]);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState<string | null>(null);

    useEffect(() => {
        nextQuestion();
    }, []);

    const nextQuestion = () => {
        const t = pairs[Math.floor(Math.random() * pairs.length)];
        setTarget(t);
        setFeedback(null);
        
        // 3 distractors
        const distractors = pairs
            .filter(p => p.suffix !== t.suffix)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map(p => p.suffix);
        
        setOptions([...distractors, t.suffix].sort(() => 0.5 - Math.random()));
    };

    const handleGuess = (suffix: string) => {
        if (suffix === target.suffix) {
            setScore(s => s + 1);
            setFeedback('CORRECT');
            setTimeout(nextQuestion, 1000);
        } else {
            setFeedback('WRONG');
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-slate-200 text-center text-slate-900">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-slate-800">Callsign Suffix Trainer</h2>
                <div className="text-sky-600 font-mono font-bold text-xl">Score: {score}</div>
            </div>

            <div className="bg-slate-900 p-8 rounded-xl mb-8 shadow-inner">
                <div className="text-slate-400 text-xs font-bold uppercase mb-2">SERVICE PROVIDED</div>
                <div className="text-2xl text-white font-bold">{target.service}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {options.map(opt => (
                    <button
                        key={opt}
                        onClick={() => !feedback && handleGuess(opt)}
                        className={`p-4 rounded-xl font-bold transition-all border-2
                            ${feedback === 'CORRECT' && opt === target.suffix ? 'bg-green-500 text-white border-green-500' : ''}
                            ${feedback === 'WRONG' && opt === target.suffix ? 'bg-green-500 text-white border-green-500' : ''}
                            ${feedback === 'WRONG' && opt !== target.suffix ? 'bg-red-100 text-red-400 border-red-200' : ''}
                            ${!feedback ? 'bg-white hover:bg-sky-50 border-slate-200 text-slate-700' : ''}
                        `}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SuffixMatch;