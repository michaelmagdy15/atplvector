import React, { useState } from 'react';
import { Plane, Radio, CheckCircle, XCircle } from 'lucide-react';

const questions = [
    {
        id: 1,
        type: 'AIRCRAFT',
        context: 'Initial call to Tower. You are G-ABCD.',
        options: [
            'G-CD',
            'G-ABCD',
            'Golf Alpha Bravo Charlie Delta'
        ],
        correct: 1,
        explanation: 'Initial call must always use the full callsign.'
    },
    {
        id: 2,
        type: 'AIRCRAFT',
        context: 'Tower has addressed you as "G-CD". You are G-ABCD.',
        options: [
            'G-CD',
            'G-ABCD',
            'Charlie Delta'
        ],
        correct: 0,
        explanation: 'You may use the abbreviated callsign ONLY after the aeronautical station has used it first.'
    },
    {
        id: 3,
        type: 'AIRCRAFT',
        context: 'You are "Fastair 345". Tower calls you.',
        options: [
            'Fastair 345',
            '345',
            'Fastair'
        ],
        correct: 0,
        explanation: 'Airline callsigns (Telephony Designator + Flight Number) are NEVER abbreviated.'
    },
    {
        id: 4,
        type: 'STATION',
        context: 'You are contacting "London Information" for the first time.',
        options: [
            'London Info',
            'London Information',
            'London'
        ],
        correct: 1,
        explanation: 'Initial call to a ground station must use the full name.'
    },
    {
        id: 5,
        type: 'AIRCRAFT',
        context: 'You are N12345. Tower has abbreviated your callsign.',
        options: [
            'N-45',
            'N-345',
            'N-5'
        ],
        correct: 1,
        explanation: 'US registration abbreviation: First letter + last 3 digits/letters.'
    }
];

const CallsignTrainer: React.FC = () => {
    const [index, setIndex] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [score, setScore] = useState(0);

    const question = questions[index];

    const handleAnswer = (idx: number) => {
        setSelected(idx);
        if (idx === question.correct) {
            setFeedback('CORRECT');
            setScore(s => s + 1);
        } else {
            setFeedback('WRONG');
        }
    };

    const next = () => {
        setIndex((prev) => (prev + 1) % questions.length);
        setSelected(null);
        setFeedback(null);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-xl">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl ${question.type === 'AIRCRAFT' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                            {question.type === 'AIRCRAFT' ? <Plane size={24} /> : <Radio size={24} />}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Callsign Logic</h2>
                            <p className="text-slate-400 text-sm">{question.type} ABBREVIATION RULES</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-white">{score}/{questions.length}</div>
                        <div className="text-xs text-slate-500 uppercase">Score</div>
                    </div>
                </div>

                <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600 mb-8">
                    <p className="text-lg text-white font-medium">{question.context}</p>
                </div>

                <div className="grid grid-cols-1 gap-3 mb-6">
                    {question.options.map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={() => !feedback && handleAnswer(idx)}
                            disabled={!!feedback}
                            className={`p-4 rounded-lg text-left font-mono transition-all border-2
                                ${selected === idx && feedback === 'CORRECT' ? 'bg-green-500/20 border-green-500 text-green-300' : ''}
                                ${selected === idx && feedback === 'WRONG' ? 'bg-red-500/20 border-red-500 text-red-300' : ''}
                                ${!feedback ? 'bg-slate-800 border-slate-700 hover:border-blue-500 text-slate-300' : ''}
                                ${feedback && selected !== idx ? 'opacity-50 border-slate-800 text-slate-500' : ''}
                            `}
                        >
                            {opt}
                        </button>
                    ))}
                </div>

                {feedback && (
                    <div className={`p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2
                        ${feedback === 'CORRECT' ? 'bg-green-900/20 text-green-300' : 'bg-red-900/20 text-red-300'}
                    `}>
                        {feedback === 'CORRECT' ? <CheckCircle className="shrink-0 mt-1" /> : <XCircle className="shrink-0 mt-1" />}
                        <div>
                            <div className="font-bold mb-1">{feedback === 'CORRECT' ? 'Correct!' : 'Incorrect'}</div>
                            <p className="text-sm opacity-90">{question.explanation}</p>
                            <button onClick={next} className="mt-3 px-4 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-white text-sm font-bold transition-colors">
                                Next Scenario
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CallsignTrainer;
