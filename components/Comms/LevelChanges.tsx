import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Plane } from 'lucide-react';

const scenarios = [
    {
        id: 'simple_climb',
        instruction: 'FASTAIR 345, CLIMB FLIGHT LEVEL 120.',
        options: [
            'CLIMBING FLIGHT LEVEL 120, FASTAIR 345',
            'FLIGHT LEVEL 120, FASTAIR 345',
            'WILCO, FASTAIR 345'
        ],
        correct: 0,
        explanation: 'Standard climb clearance requires readback of the level and callsign.'
    },
    {
        id: 'conditional_level',
        instruction: 'FASTAIR 345, CLIMB FLIGHT LEVEL 240 TO REACH BY ABBOT.',
        options: [
            'CLIMBING FLIGHT LEVEL 240, FASTAIR 345',
            'CLIMB FLIGHT LEVEL 240 TO REACH BY ABBOT, FASTAIR 345',
            'REACHING BY ABBOT 240, FASTAIR 345'
        ],
        correct: 1,
        explanation: 'Level restrictions (reach by, cross at) must be read back in full.'
    },
    {
        id: 'descent_qnh',
        instruction: 'FASTAIR 345, DESCEND ALTITUDE 3000 FEET QNH 1013.',
        options: [
            'DESCENDING 3000 FEET, 1013, FASTAIR 345',
            'DESCEND ALTITUDE 3000 FEET QNH 1013, FASTAIR 345',
            'LEAVING FL100 FOR 3000 FEET, FASTAIR 345'
        ],
        correct: 1,
        explanation: 'When changing from Flight Level to Altitude, "Altitude" and QNH must be included.'
    }
];

const LevelChanges: React.FC = () => {
    const [index, setIndex] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null);

    const scenario = scenarios[index];

    const handleSelect = (idx: number) => {
        setSelected(idx);
        if (idx === scenario.correct) {
            setFeedback('CORRECT');
        } else {
            setFeedback('WRONG');
        }
    };

    const next = () => {
        setIndex((prev) => (prev + 1) % scenarios.length);
        setSelected(null);
        setFeedback(null);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-xl">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-full bg-blue-500/20 text-blue-400">
                        <Plane size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Level Change Drill</h2>
                        <p className="text-slate-400 text-sm">ATC Instruction Translation</p>
                    </div>
                </div>

                <div className="bg-blue-900/30 border border-blue-500/30 p-6 rounded-xl mb-8 relative">
                    <div className="absolute -top-3 left-4 px-2 bg-slate-800 text-blue-400 text-xs font-bold uppercase tracking-wider">
                        ATC Transmission
                    </div>
                    <p className="text-xl font-mono text-white text-center">"{scenario.instruction}"</p>
                </div>

                <div className="space-y-3">
                    {scenario.options.map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={() => !feedback && handleSelect(idx)}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all font-mono text-sm
                                ${selected === idx && feedback === 'CORRECT' ? 'bg-green-500/20 border-green-500 text-green-300' : ''}
                                ${selected === idx && feedback === 'WRONG' ? 'bg-red-500/20 border-red-500 text-red-300' : ''}
                                ${selected !== idx && !feedback ? 'bg-slate-700/50 border-slate-600 hover:border-blue-500 text-slate-300' : ''}
                                ${selected !== idx && feedback ? 'opacity-50' : ''}
                            `}
                        >
                            {opt}
                        </button>
                    ))}
                </div>

                {feedback && (
                    <div className={`mt-6 p-4 rounded-xl ${feedback === 'CORRECT' ? 'bg-green-900/20 border border-green-500/30' : 'bg-red-900/20 border border-red-500/30'}`}>
                        <div className="font-bold mb-1 text-white">{feedback === 'CORRECT' ? 'Correct Readback!' : 'Incorrect Readback'}</div>
                        <p className="text-sm text-slate-300">{scenario.explanation}</p>

                        <button
                            onClick={next}
                            className="mt-4 w-full py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold text-white transition-colors"
                        >
                            Next Scenario
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LevelChanges;
