import React, { useState, useEffect } from 'react';
import { phoneticAlphabet } from '../data/courseData';
import { Timer, Trophy, Check, X } from 'lucide-react';

const PhoneticTrainer: React.FC = () => {
  const [current, setCurrent] = useState(phoneticAlphabet[0]);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  useEffect(() => {
    nextQuestion();
  }, []);

  const nextQuestion = () => {
    const target = phoneticAlphabet[Math.floor(Math.random() * phoneticAlphabet.length)];
    setCurrent(target);
    setFeedback(null);

    // Generate distractors
    const distractors = phoneticAlphabet
      .filter(p => p.char !== target.char)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(p => p.word);

    setOptions([...distractors, target.word].sort(() => 0.5 - Math.random()));
  };

  const handleGuess = (word: string) => {
    if (word === current.word) {
      setScore(s => s + 10 + (streak * 2));
      setStreak(s => s + 1);
      setFeedback('correct');
      setTimeout(nextQuestion, 600);
    } else {
      setStreak(0);
      setFeedback('wrong');
      // No timeout, let them study it
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-xl border border-slate-200 text-center text-slate-900">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold text-slate-700 flex items-center">
          <span className="bg-orange-100 p-2 rounded-lg mr-2 text-orange-600">A-Z</span> Phonetic Speed Run
        </h2>
        <div className="flex items-center space-x-4">
           <div className="text-right">
             <div className="text-xs text-slate-400 font-bold uppercase">Streak</div>
             <div className="text-xl font-mono font-bold text-orange-500">x{streak}</div>
           </div>
           <div className="text-right">
             <div className="text-xs text-slate-400 font-bold uppercase">Score</div>
             <div className="text-2xl font-mono font-bold text-slate-800">{score}</div>
           </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="w-32 h-32 mx-auto bg-slate-900 rounded-full flex items-center justify-center mb-4 shadow-lg border-4 border-orange-100">
          <span className="text-6xl font-black text-white">{current.char}</span>
        </div>
        <p className="text-slate-500">Select the correct NATO phonetic word</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => !feedback && handleGuess(opt)}
            className={`p-4 rounded-xl text-lg font-semibold transition-all transform active:scale-95
              ${feedback === 'correct' && opt === current.word ? 'bg-green-500 text-white shadow-green-200' : ''}
              ${feedback === 'wrong' && opt === current.word ? 'bg-green-500 text-white' : ''} 
              ${feedback === 'wrong' && opt !== current.word ? 'bg-red-100 text-red-400 opacity-50' : ''}
              ${!feedback ? 'bg-slate-50 hover:bg-orange-50 hover:text-orange-700 border border-slate-200 text-slate-700' : ''}
            `}
          >
            {opt}
          </button>
        ))}
      </div>
      
      {feedback === 'wrong' && (
        <button onClick={nextQuestion} className="mt-8 text-slate-400 underline hover:text-slate-600">Next Letter</button>
      )}
    </div>
  );
};

export default PhoneticTrainer;