import React, { useState, useEffect, useCallback } from 'react';
import { lightSignals } from '../data/courseData';
import { LightSignal } from '../types';
import { Play, RotateCcw, CheckCircle, XCircle } from 'lucide-react';

const LightGunGame: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSignal, setCurrentSignal] = useState<LightSignal | null>(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [flashState, setFlashState] = useState(true);

  const startGame = () => {
    setScore(0);
    setIsPlaying(true);
    setFeedback(null);
    pickRandomSignal();
  };

  const pickRandomSignal = useCallback(() => {
    const random = lightSignals[Math.floor(Math.random() * lightSignals.length)];
    setCurrentSignal(random);
    setFeedback(null);
  }, []);

  useEffect(() => {
    if (!currentSignal || currentSignal.pattern === 'steady') {
      setFlashState(true);
      return;
    }

    const interval = setInterval(() => {
      setFlashState(prev => !prev);
    }, 500); // 500ms flash interval

    return () => clearInterval(interval);
  }, [currentSignal]);

  const handleGuess = (meaning: string) => {
    if (!currentSignal) return;

    if (meaning === currentSignal.meaning) {
      setScore(s => s + 1);
      setFeedback('correct');
      setTimeout(pickRandomSignal, 1500);
    } else {
      setFeedback('wrong');
    }
  };

  // Filter options to ensure we don't just show random text, but plausible alternatives
  const getOptions = () => {
    if (!currentSignal) return [];
    const correct = currentSignal.meaning;
    // Get 3 random other meanings
    const others = lightSignals
      .filter(s => s.meaning !== correct)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(s => s.meaning);
    
    return [...others, correct].sort(() => 0.5 - Math.random());
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-slate-200 text-slate-900">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Light Gun Hero</h2>
            <p className="text-slate-500">Identify the signal from the tower!</p>
        </div>
        <div className="text-right">
            <span className="text-sm font-semibold uppercase tracking-wider text-slate-400">Score</span>
            <div className="text-3xl font-mono font-bold text-sky-600">{score}</div>
        </div>
      </div>

      {!isPlaying ? (
        <div className="text-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
          <Play className="w-16 h-16 mx-auto text-sky-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-slate-800">Ready for takeoff?</h3>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">
            Test your knowledge of ATC light gun signals. You will see a signal and context (Air/Ground). 
            Select the correct action.
          </p>
          <button 
            onClick={startGame}
            className="px-6 py-3 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition shadow-lg shadow-sky-200"
          >
            Start Training
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Visualizer */}
          <div className="relative h-80 bg-slate-900 rounded-2xl overflow-hidden flex flex-col items-center justify-center border-4 border-slate-800 shadow-inner">
            {/* Context Badge */}
            <div className="absolute top-4 left-4 px-3 py-1 bg-slate-800/80 text-white text-xs font-mono rounded border border-slate-700">
                CONTEXT: {currentSignal?.context.toUpperCase()}
            </div>

            {/* The Light Gun */}
            <div className="relative">
                {/* Glow effect */}
                <div 
                    className={`absolute inset-0 rounded-full blur-xl transition-opacity duration-100 ${
                        !flashState ? 'opacity-0' : 'opacity-60'
                    }`}
                    style={{ backgroundColor: currentSignal?.color === 'white' ? '#fff' : currentSignal?.color }}
                ></div>
                
                {/* The Light bulb */}
                <div 
                    className={`w-24 h-24 rounded-full border-4 border-slate-700 shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-opacity duration-100 ease-in-out`}
                    style={{ 
                        backgroundColor: currentSignal?.color === 'white' ? '#f8fafc' : (currentSignal?.color === 'green' ? '#22c55e' : '#ef4444'),
                        opacity: flashState ? 1 : 0.1,
                        boxShadow: flashState ? `0 0 40px 10px ${currentSignal?.color === 'white' ? '#fff' : currentSignal?.color}` : 'none'
                    }}
                ></div>
            </div>
            
            <div className="absolute bottom-4 text-slate-500 text-xs font-mono">TOWER VISUAL</div>
          </div>

          {/* Controls */}
          <div className="flex flex-col justify-center space-y-3">
            {feedback === 'correct' && (
                <div className="p-4 bg-green-50 text-green-700 rounded-lg flex items-center mb-4 animate-bounce">
                    <CheckCircle className="w-6 h-6 mr-2" />
                    <span className="font-bold">Correct! Next signal coming...</span>
                </div>
            )}
             {feedback === 'wrong' && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center mb-4">
                    <XCircle className="w-6 h-6 mr-2" />
                    <span className="font-bold">Incorrect! Try again.</span>
                </div>
            )}

            <div className="grid grid-cols-1 gap-3">
                {getOptions().map((opt, idx) => (
                    <button
                        key={idx}
                        onClick={() => !feedback && handleGuess(opt)}
                        disabled={!!feedback}
                        className={`p-4 text-left rounded-lg border-2 transition-all font-medium text-slate-800
                            ${feedback 
                                ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed' 
                                : 'bg-white border-slate-200 hover:border-sky-500 hover:shadow-md active:bg-sky-50'
                            }
                        `}
                    >
                        {opt}
                    </button>
                ))}
            </div>

            <button 
                onClick={startGame}
                className="mt-6 flex items-center justify-center text-slate-400 hover:text-slate-600 text-sm"
            >
                <RotateCcw className="w-4 h-4 mr-1" /> Reset Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LightGunGame;