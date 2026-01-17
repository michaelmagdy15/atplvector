import React, { useState, useEffect } from 'react';
import { BookOpen, Trophy, RefreshCw } from 'lucide-react';

const abbreviations = [
    { abbr: 'CAVOK', full: 'Clouds and Visibility OK' },
    { abbr: 'NOSIG', full: 'No Significant Change' },
    { abbr: 'RVR', full: 'Runway Visual Range' },
    { abbr: 'ATIS', full: 'Automatic Terminal Information Service' },
    { abbr: 'CTR', full: 'Control Zone' },
    { abbr: 'TMA', full: 'Terminal Manoeuvring Area' },
    { abbr: 'FIR', full: 'Flight Information Region' },
    { abbr: 'AIC', full: 'Aeronautical Information Circular' },
    { abbr: 'AIP', full: 'Aeronautical Information Publication' },
    { abbr: 'AIRAC', full: 'Aeronautical Information Regulation And Control' },
    { abbr: 'SAR', full: 'Search and Rescue' },
    { abbr: 'UTC', full: 'Coordinated Universal Time' },
    { abbr: 'H24', full: 'Continuous Day and Night Service' },
    { abbr: 'HJ', full: 'Sunrise to Sunset' },
    { abbr: 'HX', full: 'No Specific Working Hours' }
];

const AbbreviationGame: React.FC = () => {
    const [current, setCurrent] = useState(abbreviations[0]);
    const [options, setOptions] = useState<string[]>([]);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [feedback, setFeedback] = useState<string | null>(null);

    const generateQuestion = () => {
        const target = abbreviations[Math.floor(Math.random() * abbreviations.length)];
        setCurrent(target);
        setFeedback(null);

        // Generate 3 distractors
        const others = abbreviations.filter(a => a.abbr !== target.abbr);
        const distractors = others.sort(() => 0.5 - Math.random()).slice(0, 3).map(a => a.full);

        const allOptions = [...distractors, target.full].sort(() => 0.5 - Math.random());
        setOptions(allOptions);
    };

    useEffect(() => {
        generateQuestion();
    }, []);

    const handleGuess = (answer: string) => {
        if (answer === current.full) {
            setScore(s => s + 10);
            setStreak(s => s + 1);
            setFeedback('CORRECT');
            setTimeout(generateQuestion, 800);
        } else {
            setStreak(0);
            setFeedback('WRONG');
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-end mb-6 text-white">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <BookOpen className="text-purple-400" /> Abbreviation Master
                    </h2>
                    <p className="text-slate-400 text-sm">Decode standard ICAO abbreviations</p>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-black text-purple-400">{score}</div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center justify-end gap-1">
                        <Trophy size={12} /> Streak: {streak}
                    </div>
                </div>
            </div>

            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-2xl text-center mb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>

                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">What does this stand for?</h3>
                <div className="text-6xl font-black text-white mb-8 tracking-tighter">
                    {current.abbr}
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {options.map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={() => !feedback && handleGuess(opt)}
                            className={`p-4 rounded-xl font-bold text-sm transition-all border-2
                                ${feedback === 'CORRECT' && opt === current.full ? 'bg-green-500 text-white border-green-400' : ''}
                                ${feedback === 'WRONG' && opt === current.full ? 'bg-green-500 text-white border-green-400' : ''}
                                ${feedback === 'WRONG' && opt !== current.full ? 'opacity-50 bg-slate-700 border-slate-700 text-slate-400' : ''}
                                ${!feedback ? 'bg-slate-700/50 border-slate-600 text-slate-200 hover:border-purple-500 hover:bg-slate-700' : ''}
                            `}
                        >
                            {opt}
                        </button>
                    ))}
                </div>

                {feedback === 'WRONG' && (
                    <div className="mt-6 animate-in fade-in slide-in-from-bottom-2">
                        <div className="text-red-400 font-bold mb-2">Incorrect</div>
                        <p className="text-white text-lg">Correct answer: <span className="font-bold text-green-400">{current.full}</span></p>
                        <button onClick={generateQuestion} className="mt-4 px-6 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg font-bold flex items-center gap-2 mx-auto">
                            <RefreshCw size={16} /> Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AbbreviationGame;
