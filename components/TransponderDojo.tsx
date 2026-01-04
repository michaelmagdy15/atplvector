import React, { useState } from 'react';
import { transponderCodes } from '../data/courseData';
import { AlertTriangle, Radio } from 'lucide-react';

const TransponderDojo: React.FC = () => {
  const [code, setCode] = useState('7000');
  const [scenario, setScenario] = useState<{msg: string, code: string} | null>(null);
  const [feedback, setFeedback] = useState('');

  const handleDigit = (digit: string) => {
    if (code.length >= 4) {
      setCode(digit);
    } else {
      setCode(prev => prev + digit);
    }
  };

  const newScenario = () => {
    const random = transponderCodes[Math.floor(Math.random() * transponderCodes.length)];
    setScenario({ msg: `Situation: ${random.meaning}`, code: random.code });
    setFeedback('');
    setCode('');
  };

  const checkCode = () => {
    if (!scenario) return;
    if (code === scenario.code) {
      setFeedback('CORRECT');
    } else {
      setFeedback('INCORRECT');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border-b-8 border-slate-900">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-slate-400 font-mono text-sm tracking-widest">TRANSPONDER XPDR</h2>
            <div className="flex space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div className="text-xs text-green-500 font-mono">ALT</div>
            </div>
        </div>

        {/* Screen */}
        <div className="bg-black border-4 border-slate-600 rounded-lg p-6 mb-8 relative overflow-hidden">
            <div className="flex justify-between items-end font-mono">
                <div className="text-orange-500 text-5xl tracking-[0.2em] font-bold drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]">
                    {code.padEnd(4, '-')}
                </div>
            </div>
            {feedback === 'CORRECT' && (
                <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center text-green-400 font-bold font-mono text-xl animate-pulse">MATCHED</div>
            )}
             {feedback === 'INCORRECT' && (
                <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center text-red-400 font-bold font-mono text-xl">INVALID</div>
            )}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-3 mb-6">
            {[0,1,2,3,4,5,6,7].map(num => (
                <button
                    key={num}
                    onClick={() => handleDigit(num.toString())}
                    className="h-16 bg-slate-700 rounded shadow-md text-white font-mono text-xl font-bold hover:bg-slate-600 active:translate-y-1 transition-all border-b-4 border-slate-800 active:border-b-0"
                >
                    {num}
                </button>
            ))}
        </div>

        <div className="flex space-x-4">
             <button onClick={() => setCode('7000')} className="flex-1 py-3 bg-slate-700 text-xs font-bold text-slate-300 rounded hover:bg-slate-600 uppercase">VFR (EASA)</button>
             <button onClick={() => setCode('2000')} className="flex-1 py-3 bg-slate-700 text-xs font-bold text-slate-300 rounded hover:bg-slate-600 uppercase">IFR</button>
             <button onClick={() => setCode('')} className="flex-1 py-3 bg-yellow-600 text-xs font-bold text-yellow-100 rounded hover:bg-yellow-500 uppercase">CLR</button>
             <button onClick={checkCode} className="flex-1 py-3 bg-green-600 text-xs font-bold text-green-100 rounded hover:bg-green-500 uppercase">IDENT</button>
        </div>
      </div>

      {/* Scenario Box */}
      <div className="mt-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center text-slate-900">
        {!scenario ? (
            <button onClick={newScenario} className="bg-slate-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-slate-700">
                Start Scenario
            </button>
        ) : (
            <div>
                <div className="flex items-center justify-center text-amber-600 mb-2">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    <span className="font-bold uppercase">Emergency Scenario</span>
                </div>
                <p className="text-xl font-medium text-slate-800 mb-4">{scenario.msg}</p>
                {feedback === 'CORRECT' && (
                    <button onClick={newScenario} className="text-sky-600 font-bold underline">Next Scenario</button>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default TransponderDojo;