import React, { useState } from 'react';
import { Plane } from 'lucide-react';

const markings = [
    { name: 'Threshold', y: 80, hint: 'The beginning of that portion of the runway usable for landing.' },
    { name: 'Touchdown Zone', y: 150, hint: 'The portion of a runway, beyond the threshold, where it is intended landing aeroplanes first contact the runway.' },
    { name: 'Aiming Point', y: 220, hint: 'A visual aiming point for a landing aircraft.' },
    { name: 'Centerline', y: 300, hint: 'Provides alignment guidance during takeoff and landing.' }
];

const RunwayQuiz: React.FC = () => {
    const [target, setTarget] = useState(markings[0]);
    const [score, setScore] = useState(0);
    const [message, setMessage] = useState('');

    const handleClick = (name: string) => {
        if (name === target.name) {
            setScore(s => s + 1);
            setMessage('Correct! Good approach.');
            const next = markings.filter(m => m.name !== target.name)[Math.floor(Math.random() * (markings.length - 1))];
            setTarget(next);
        } else {
            setMessage('Go around! Try again.');
        }
    };

    return (
        <div className="max-w-2xl mx-auto flex flex-col items-center">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white">Visual Approach</h2>
                <p className="text-slate-400">Identify: <span className="font-bold text-sky-400">{target.name}</span></p>
                <p className="text-xs text-slate-500 mt-1">{target.hint}</p>
            </div>
            
            <div className="relative w-64 h-[500px] bg-slate-800 border-x-8 border-green-700 rounded-lg shadow-2xl overflow-hidden cursor-crosshair">
                {/* Runway Number */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white font-mono text-4xl font-bold opacity-80">27</div>

                {/* Threshold */}
                <div 
                    onClick={() => handleClick('Threshold')}
                    className="absolute top-20 left-4 right-4 h-8 flex justify-between px-2 hover:bg-white/10 transition"
                >
                    {[...Array(8)].map((_,i) => <div key={i} className="w-2 h-full bg-white"></div>)}
                </div>

                {/* Touchdown Zone */}
                <div 
                    onClick={() => handleClick('Touchdown Zone')}
                    className="absolute top-40 left-4 right-4 h-4 flex justify-between px-4 hover:bg-white/10 transition"
                >
                    <div className="w-12 h-full bg-white"></div>
                    <div className="w-12 h-full bg-white"></div>
                </div>

                {/* Aiming Point */}
                <div 
                    onClick={() => handleClick('Aiming Point')}
                    className="absolute top-56 left-8 right-8 h-12 flex justify-between hover:bg-white/10 transition"
                >
                    <div className="w-8 h-full bg-white"></div>
                    <div className="w-8 h-full bg-white"></div>
                </div>

                 {/* Centerline */}
                 <div 
                    onClick={() => handleClick('Centerline')}
                    className="absolute top-72 left-1/2 -translate-x-1/2 w-4 h-full flex flex-col gap-8 hover:bg-white/10 transition"
                >
                     {[...Array(5)].map((_,i) => <div key={i} className="w-full h-12 bg-white"></div>)}
                 </div>
            </div>

            {message && (
                <div className={`mt-6 px-6 py-3 rounded-full font-bold animate-pulse ${message.includes('Correct') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default RunwayQuiz;