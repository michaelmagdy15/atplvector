import React, { useState } from 'react';
import { CheckSquare, Square } from 'lucide-react';

const steps = [
    "State 'TRANSMITTING BLIND'",
    "State 'TRANSMITTING BLIND' (Second time)",
    "State current situation / message",
    "State intentions",
    "State time of next transmission",
    "Repeat the entire message"
];

const BlindTrans: React.FC = () => {
    const [checked, setChecked] = useState<number[]>([]);

    const toggle = (idx: number) => {
        if (checked.includes(idx)) {
            setChecked(checked.filter(i => i !== idx));
        } else {
            setChecked([...checked, idx]);
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-slate-200 text-slate-900">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Blind Transmission Proc</h2>
            <p className="text-slate-500 mb-6">If receiver failure is suspected:</p>

            <div className="space-y-4">
                {steps.map((step, i) => (
                    <div 
                        key={i} 
                        onClick={() => toggle(i)}
                        className={`flex items-center p-4 rounded-xl cursor-pointer border-2 transition-all
                            ${checked.includes(i) ? 'bg-sky-50 border-sky-500' : 'bg-white border-slate-100 hover:border-slate-300'}
                        `}
                    >
                        <div className={`mr-4 ${checked.includes(i) ? 'text-sky-600' : 'text-slate-300'}`}>
                            {checked.includes(i) ? <CheckSquare /> : <Square />}
                        </div>
                        <span className={`font-medium ${checked.includes(i) ? 'text-slate-800' : 'text-slate-500'}`}>{step}</span>
                    </div>
                ))}
            </div>
            
            {checked.length === steps.length && (
                <div className="mt-6 text-center text-green-600 font-bold animate-bounce">
                    Procedure Complete!
                </div>
            )}
        </div>
    );
};

export default BlindTrans;