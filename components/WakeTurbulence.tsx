import React, { useState } from 'react';
import { Plane, Scale } from 'lucide-react';

const WakeTurbulence: React.FC = () => {
    const [weight, setWeight] = useState(50000); // kg

    const getCategory = (kg: number) => {
        if (kg >= 136000) return { cat: 'HEAVY (H)', color: 'text-purple-600', bg: 'bg-purple-100', desc: 'A380, B747, A340' };
        if (kg > 7000) return { cat: 'MEDIUM (M)', color: 'text-blue-600', bg: 'bg-blue-100', desc: 'B737, A320, CRJ' };
        return { cat: 'LIGHT (L)', color: 'text-green-600', bg: 'bg-green-100', desc: 'C172, PA28, Citation' };
    };

    const result = getCategory(weight);

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-slate-200 text-slate-900">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-800">Wake Turbulence Categories</h2>
                <p className="text-slate-500">Determine ATC separation category based on MTOW</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-4 text-center">Aircraft Maximum Take-off Weight (kg)</label>
                <input 
                    type="range" 
                    min="1000" 
                    max="200000" 
                    step="1000" 
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full h-3 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-slate-800"
                />
                <div className="flex justify-between text-xs text-slate-400 font-mono mt-2 font-bold uppercase">
                    <span>Light (7t)</span>
                    <span>Medium</span>
                    <span>Heavy (136t)</span>
                </div>
                <div className="text-center mt-6">
                    <span className="text-4xl font-mono font-bold text-slate-800">{weight.toLocaleString()}</span>
                    <span className="text-slate-500 ml-2 font-bold">kg</span>
                </div>
            </div>

            <div className={`p-8 rounded-2xl ${result.bg} text-center transition-colors duration-300`}>
                <div className="text-sm font-bold opacity-60 uppercase mb-2 text-slate-700">Category</div>
                <div className={`text-4xl font-black ${result.color} mb-4`}>{result.cat}</div>
                <div className="flex items-center justify-center space-x-2 text-slate-600 font-medium">
                    <Plane className={`w-5 h-5 ${result.color}`} />
                    <span>Examples: {result.desc}</span>
                </div>
            </div>
            
            <div className="mt-6 text-center text-xs text-slate-400">
                Data Source: ICAO Annex / Syllabus Page 8
            </div>
        </div>
    );
};

export default WakeTurbulence;