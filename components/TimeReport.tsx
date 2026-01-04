import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

const TimeReport: React.FC = () => {
    const [scenario, setScenario] = useState({ current: '10:05', event: '10:08', correct: 'minutes' });
    const [feedback, setFeedback] = useState<string | null>(null);

    const generateScenario = () => {
        const hour = Math.floor(Math.random() * 23);
        const min = Math.floor(Math.random() * 50);
        
        // 50% chance of "Confusion" (different hours or large gap)
        const isConfusion = Math.random() > 0.5;
        
        let eventHour = hour;
        let eventMin = min + (Math.floor(Math.random() * 10) + 1);

        if (isConfusion) {
            // Force confusion: Change hour OR make gap large
            eventHour = (hour + 1) % 24;
            eventMin = Math.floor(Math.random() * 59);
        } else {
            // No confusion: Same hour, small gap
            if (eventMin >= 60) {
                // If it rolls over, it becomes confusion
                eventHour = (hour + 1) % 24; 
                eventMin = eventMin % 60;
            }
        }

        const format = (h: number, m: number) => `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`;
        
        // Rule Page 8: 
        // No confusion: 08 -> Just minutes
        // Confusion: 10:08 -> Hours & Minutes
        const correctType = (hour !== eventHour) ? 'full' : 'minutes';

        setScenario({
            current: format(hour, min),
            event: format(eventHour, eventMin),
            correct: correctType
        });
        setFeedback(null);
    };

    const handleGuess = (type: 'minutes' | 'full') => {
        if (type === scenario.correct) {
            setFeedback('correct');
            setTimeout(generateScenario, 1500);
        } else {
            setFeedback('wrong');
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-slate-200 text-center text-slate-900">
            <div className="flex justify-center mb-6">
                <div className="p-4 bg-sky-100 rounded-full">
                    <Clock className="w-8 h-8 text-sky-600" />
                </div>
            </div>
            
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Time Reporting</h2>
            <p className="text-slate-500 mb-8">Rule: Transmit only minutes unless there is confusion.</p>

            <div className="flex justify-center space-x-12 mb-10">
                <div className="text-center">
                    <div className="text-xs font-bold text-slate-400 uppercase mb-1">Current Time</div>
                    <div className="text-3xl font-mono font-bold text-slate-700">{scenario.current}</div>
                </div>
                <div className="text-center">
                    <div className="text-xs font-bold text-slate-400 uppercase mb-1">Report At</div>
                    <div className="text-3xl font-mono font-bold text-indigo-600">{scenario.event}</div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button 
                    onClick={() => handleGuess('minutes')}
                    className="p-4 border-2 border-slate-200 rounded-xl hover:border-sky-500 hover:bg-sky-50 font-bold text-slate-700 transition"
                >
                    "{scenario.event.split(':')[1]}"
                    <div className="text-xs font-normal text-slate-400 mt-1">Minutes Only</div>
                </button>
                <button 
                    onClick={() => handleGuess('full')}
                    className="p-4 border-2 border-slate-200 rounded-xl hover:border-sky-500 hover:bg-sky-50 font-bold text-slate-700 transition"
                >
                    "{scenario.event.replace(':', '')}"
                    <div className="text-xs font-normal text-slate-400 mt-1">Hours & Minutes</div>
                </button>
            </div>

            {feedback === 'correct' && (
                <div className="mt-6 flex items-center justify-center text-green-600 font-bold animate-pulse">
                    <CheckCircle className="w-5 h-5 mr-2" /> Correct!
                </div>
            )}
            {feedback === 'wrong' && (
                <div className="mt-6 flex items-center justify-center text-red-500 font-bold">
                    <XCircle className="w-5 h-5 mr-2" /> Incorrect format.
                </div>
            )}
        </div>
    );
};

export default TimeReport;