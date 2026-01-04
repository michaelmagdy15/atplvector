import React, { useState } from 'react';
import { MapPin, Check, RotateCcw } from 'lucide-react';

const items = [
    { id: 'id', label: 'Aircraft Identification' },
    { id: 'pos', label: 'Position' },
    { id: 'time', label: 'Time' },
    { id: 'lvl', label: 'Flight Level / Altitude' },
    { id: 'next', label: 'Next Position & Time' },
    { id: 'ensuing', label: 'Ensuing Significant Point' },
];

const PositionReport: React.FC = () => {
    const [selection, setSelection] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        if (!selection.includes(id)) {
            setSelection([...selection, id]);
        }
    };

    const checkOrder = () => {
        // Correct order is standard list order
        const correctOrder = items.map(i => i.id);
        const isCorrect = selection.length === correctOrder.length && selection.every((val, index) => val === correctOrder[index]);
        
        if (isCorrect) setFeedback('CORRECT');
        else setFeedback('INCORRECT');
    };

    const reset = () => {
        setSelection([]);
        setFeedback(null);
    };

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-slate-200 text-slate-900">
            <div className="flex items-center space-x-3 mb-6">
                <MapPin className="w-6 h-6 text-sky-600" />
                <h2 className="text-2xl font-bold text-slate-800">Position Report Builder</h2>
            </div>
            <p className="text-slate-500 mb-8">Construct a standard Position Report by selecting elements in the correct ICAO order.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <h3 className="font-bold text-slate-400 text-xs uppercase mb-2">Available Elements</h3>
                    {items.map(item => (
                        <button
                            key={item.id}
                            onClick={() => handleSelect(item.id)}
                            disabled={selection.includes(item.id)}
                            className="w-full p-3 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg font-medium text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                <div className="bg-slate-900 rounded-xl p-6 relative">
                    <h3 className="font-bold text-slate-500 text-xs uppercase mb-4">Your Transmission Sequence</h3>
                    
                    <div className="space-y-2 min-h-[200px]">
                        {selection.map((id, idx) => {
                            const item = items.find(i => i.id === id);
                            return (
                                <div key={id} className="flex items-center text-white bg-slate-800 p-2 rounded border border-slate-700 animate-in slide-in-from-left-2">
                                    <span className="w-6 h-6 rounded-full bg-sky-600 text-xs flex items-center justify-center mr-3 font-bold">{idx + 1}</span>
                                    {item?.label}
                                </div>
                            );
                        })}
                        {selection.length === 0 && (
                            <div className="text-slate-600 text-sm italic text-center mt-10">Select elements to build report...</div>
                        )}
                    </div>

                    <div className="mt-6 flex space-x-3">
                        <button onClick={reset} className="p-2 bg-slate-700 text-white rounded hover:bg-slate-600"><RotateCcw className="w-5 h-5"/></button>
                        <button 
                            onClick={checkOrder}
                            disabled={selection.length === 0}
                            className={`flex-1 py-2 rounded font-bold transition-all ${
                                feedback === 'CORRECT' ? 'bg-green-500 text-white' : 
                                feedback === 'INCORRECT' ? 'bg-red-500 text-white' : 
                                'bg-sky-600 text-white hover:bg-sky-500'
                            }`}
                        >
                            {feedback === 'CORRECT' ? 'SEQUENCE CORRECT' : feedback === 'INCORRECT' ? 'WRONG ORDER' : 'VERIFY SEQUENCE'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PositionReport;