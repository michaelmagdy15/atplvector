import React, { useState, useEffect } from 'react';
import { morseCode } from '../data/courseData';
import { Activity } from 'lucide-react';

const MorseMaster: React.FC = () => {
    const [target, setTarget] = useState(morseCode[0]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [lightOn, setLightOn] = useState(false);
    const [feedback, setFeedback] = useState<boolean | null>(null);

    const playMorse = async () => {
        if (isPlaying) return;
        setIsPlaying(true);
        
        for (const symbol of target.code.split('')) {
            setLightOn(true);
            await new Promise(r => setTimeout(r, symbol === '.' ? 200 : 600)); // Dot vs Dash duration
            setLightOn(false);
            await new Promise(r => setTimeout(r, 200)); // Intra-character gap
        }
        
        setIsPlaying(false);
    };

    const next = () => {
        setTarget(morseCode[Math.floor(Math.random() * morseCode.length)]);
        setFeedback(null);
    };

    const handleGuess = (char: string) => {
        if (char === target.char) {
            setFeedback(true);
            setTimeout(next, 1000);
        } else {
            setFeedback(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto text-center bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
            <div className="bg-slate-900 p-12 rounded-2xl shadow-xl mb-8 relative">
                <div className={`w-32 h-32 mx-auto rounded-full transition-colors duration-75 ${lightOn ? 'bg-yellow-400 shadow-[0_0_50px_rgba(250,204,21,0.6)]' : 'bg-slate-800 border-4 border-slate-700'}`}></div>
                <button 
                    onClick={playMorse}
                    disabled={isPlaying}
                    className="mt-8 px-6 py-2 bg-slate-700 text-white rounded-full font-bold hover:bg-slate-600 disabled:opacity-50"
                >
                    {isPlaying ? 'TRANSMITTING...' : 'PLAY IDENT'}
                </button>
            </div>

            <h3 className="text-slate-500 font-bold mb-4">IDENTIFY THE VOR BEACON</h3>
            
            <div className="grid grid-cols-6 gap-2">
                {morseCode.map((m) => (
                    <button
                        key={m.char}
                        onClick={() => handleGuess(m.char)}
                        disabled={feedback === true}
                        className={`p-3 rounded font-bold text-lg border transition-all
                            ${feedback === true && m.char === target.char ? 'bg-green-500 text-white border-green-500' : 
                              'bg-white border-slate-200 hover:bg-sky-50 hover:border-sky-300 text-slate-800'}
                        `}
                    >
                        {m.char}
                    </button>
                ))}
            </div>
            {feedback === false && <div className="mt-4 text-red-500 font-bold">Incorrect, listen again!</div>}
        </div>
    );
};

export default MorseMaster;