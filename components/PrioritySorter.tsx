import React, { useState } from 'react';
import { ListOrdered, CheckCircle } from 'lucide-react';

const priorities = [
    { id: 'ss', code: 'SS', name: 'Distress (MAYDAY)', rank: 1 },
    { id: 'dd', code: 'DD', name: 'Urgency (PAN-PAN)', rank: 2 },
    { id: 'df', code: 'DF', name: 'Direction Finding', rank: 3 },
    { id: 'ff', code: 'FF', name: 'Flight Safety', rank: 4 },
    { id: 'gg', code: 'GG', name: 'Meteorological', rank: 5 },
    { id: 'kk', code: 'KK', name: 'Flight Regularity', rank: 6 },
];

const PrioritySorter: React.FC = () => {
    // Shuffle initially
    const [items, setItems] = useState(() => [...priorities].sort(() => 0.5 - Math.random()));
    const [checked, setChecked] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const move = (idx: number, direction: -1 | 1) => {
        if (checked) return;
        const newItems = [...items];
        const target = idx + direction;
        if (target < 0 || target >= newItems.length) return;
        
        [newItems[idx], newItems[target]] = [newItems[target], newItems[idx]];
        setItems(newItems);
    };

    const check = () => {
        const correct = items.every((item, index) => item.rank === index + 1);
        setIsCorrect(correct);
        setChecked(true);
    };

    const reset = () => {
        setItems([...priorities].sort(() => 0.5 - Math.random()));
        setChecked(false);
        setIsCorrect(false);
    };

    return (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-slate-200 text-slate-900">
             <div className="flex items-center space-x-3 mb-6">
                <ListOrdered className="w-6 h-6 text-sky-600" />
                <h2 className="text-2xl font-bold text-slate-800">Message Priority</h2>
            </div>
            <p className="text-slate-500 mb-6 text-sm">Re-order the message categories from Highest Priority (Top) to Lowest (Bottom).</p>

            <div className="space-y-2 mb-8">
                {items.map((item, idx) => (
                    <div key={item.id} className="flex items-center">
                        <div className="flex flex-col mr-2 space-y-1">
                            <button onClick={() => move(idx, -1)} disabled={idx === 0 || checked} className="p-1 bg-slate-100 rounded hover:bg-slate-200 disabled:opacity-30 text-slate-600">▲</button>
                            <button onClick={() => move(idx, 1)} disabled={idx === items.length - 1 || checked} className="p-1 bg-slate-100 rounded hover:bg-slate-200 disabled:opacity-30 text-slate-600">▼</button>
                        </div>
                        <div className={`flex-1 p-4 rounded-lg border-2 font-bold flex justify-between items-center transition-all
                            ${checked 
                                ? (item.rank === idx + 1 ? 'border-green-500 bg-green-50 text-green-700' : 'border-red-500 bg-red-50 text-red-700') 
                                : 'border-slate-200 bg-white text-slate-700'}
                        `}>
                            <span>{item.name}</span>
                            <span className="font-mono text-xs px-2 py-1 bg-slate-200 rounded text-slate-600">{item.code}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-between items-center">
                 {!checked ? (
                     <button onClick={check} className="w-full py-3 bg-sky-600 text-white rounded-lg font-bold hover:bg-sky-500 transition">
                         Check Order
                     </button>
                 ) : (
                     <div className="w-full flex items-center justify-between">
                         <div className={`font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                            {isCorrect ? <><CheckCircle className="mr-2"/> Correct Priority!</> : "Incorrect Order"}
                         </div>
                         <button onClick={reset} className="px-6 py-2 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-700">
                             Try Again
                         </button>
                     </div>
                 )}
            </div>
        </div>
    );
};

export default PrioritySorter;