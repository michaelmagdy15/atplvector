import React, { useState, useEffect } from 'react';
import { Rocket, Star, RefreshCw, Trophy } from 'lucide-react';

interface Abbreviation {
    code: string;
    meaning: string;
}

const database: Abbreviation[] = [
    { code: 'H24', meaning: 'Continuous day and night service' },
    { code: 'HJ', meaning: 'Sunrise to sunset' },
    { code: 'HN', meaning: 'Sunset to sunrise' },
    { code: 'HX', meaning: 'No specific working hours' },
    { code: 'PO', meaning: 'Dust Devils' },
    { code: 'BR', meaning: 'Mist' },
    { code: 'FG', meaning: 'Fog' },
    { code: 'FU', meaning: 'Smoke' },
    { code: 'VA', meaning: 'Volcanic Ash' },
    { code: 'GR', meaning: 'Hail' },
    { code: 'GS', meaning: 'Small Hail' },
    { code: 'SQ', meaning: 'Squall' },
    { code: 'FC', meaning: 'Funnel Cloud' },
    { code: 'PL', meaning: 'Ice Pellets' },
    { code: 'IC', meaning: 'Ice Crystals' },
    { code: 'SN', meaning: 'Snow' },
    { code: 'RA', meaning: 'Rain' },
    { code: 'DZ', meaning: 'Drizzle' },
    { code: 'BC', meaning: 'Patches' },
    { code: 'BL', meaning: 'Blowing' },
    { code: 'DR', meaning: 'Low Drifting' },
    { code: 'FZ', meaning: 'Freezing' },
    { code: 'MI', meaning: 'Shallow' },
    { code: 'PR', meaning: 'Partial' },
    { code: 'SH', meaning: 'Showers' },
    { code: 'TS', meaning: 'Thunderstorm' },
    { code: 'NOSIG', meaning: 'No Significant Change' },
    { code: 'CAVOK', meaning: 'Clouds and Visibility OK' },
    { code: 'NSC', meaning: 'No Significant Cloud' },
    { code: 'SKC', meaning: 'Sky Clear' },
];

const AbbreviationGalaxy: React.FC = () => {
    const [current, setCurrent] = useState<Abbreviation | null>(null);
    const [options, setOptions] = useState<string[]>([]);
    const [score, setScore] = useState(0);
    const [timer, setTimer] = useState(30);
    const [gameOver, setGameOver] = useState(false);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

    useEffect(() => {
        startGame();
    }, []);

    useEffect(() => {
        if (timer > 0 && !gameOver) {
            const t = setTimeout(() => setTimer(prev => prev - 1), 1000);
            return () => clearTimeout(t);
        } else if (timer === 0) {
            setGameOver(true);
        }
    }, [timer, gameOver]);

    const startGame = () => {
        setScore(0);
        setTimer(60);
        setGameOver(false);
        nextQuestion();
    };

    const nextQuestion = () => {
        setFeedback(null);
        const question = database[Math.floor(Math.random() * database.length)];
        setCurrent(question);

        // Generate distractors
        const distractors = new Set<string>();
        while (distractors.size < 3) {
            const random = database[Math.floor(Math.random() * database.length)];
            if (random.code !== question.code) {
                distractors.add(random.meaning);
            }
        }

        const allOptions = [question.meaning, ...Array.from(distractors)].sort(() => Math.random() - 0.5);
        setOptions(allOptions);
    };

    const handleAnswer = (answer: string) => {
        if (!current || feedback) return;

        if (answer === current.meaning) {
            setScore(s => s + 10);
            setFeedback('correct');
            // Bonus time
            setTimer(t => Math.min(t + 2, 60));
            setTimeout(nextQuestion, 500);
        } else {
            setFeedback('wrong');
            setScore(s => Math.max(0, s - 5));
            setTimeout(nextQuestion, 1000);
        }
    };

    if (!current) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 min-h-[600px] flex flex-col items-center justify-center">

            {/* Header / Stats */}
            <div className="w-full flex justify-between items-center mb-8 bg-slate-800 p-4 rounded-xl border border-slate-700">
                <div className="flex items-center gap-3">
                    <Trophy className="text-yellow-400" />
                    <span className="text-2xl font-bold text-white">{score}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-48 h-3 bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-1000 ${timer < 10 ? 'bg-red-500' : 'bg-cyan-500'}`}
                            style={{ width: `${(timer / 60) * 100}%` }}
                        ></div>
                    </div>
                    <span className="font-mono text-slate-400 w-8">{timer}s</span>
                </div>
            </div>

            {gameOver ? (
                <div className="text-center animate-in zoom-in">
                    <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 mb-4">
                        GAME OVER
                    </h2>
                    <p className="text-2xl text-slate-400 mb-8">Final Score: {score}</p>
                    <button
                        onClick={startGame}
                        className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center gap-2 mx-auto"
                    >
                        <RefreshCw /> Play Again
                    </button>
                </div>
            ) : (
                <div className="w-full max-w-2xl relative">
                    {/* The Code Card */}
                    <div className="relative mb-12">
                        <div className="absolute inset-0 bg-cyan-500 blur-2xl opacity-20 animate-pulse"></div>
                        <div className="relative bg-slate-900 border-2 border-slate-600 rounded-3xl p-16 text-center transform transition-all hover:scale-105">
                            <h2 className="text-7xl font-black text-white tracking-widest">{current.code}</h2>
                        </div>
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(option)}
                                disabled={!!feedback}
                                className={`
                                    p-6 rounded-xl border-2 text-left font-bold transition-all
                                    ${feedback && option === current.meaning ? 'bg-green-500 border-green-500 text-white scale-105' : ''}
                                    ${feedback === 'wrong' && option !== current.meaning ? 'opacity-50' : ''}
                                    ${!feedback ? 'bg-white border-slate-200 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20 text-slate-800' : ''}
                                `}
                            >
                                {option}
                            </button>
                        ))}
                    </div>

                    {feedback === 'wrong' && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-red-500 font-black text-6xl animate-ping select-none">WRONG</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AbbreviationGalaxy;
