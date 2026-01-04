import React, { useState } from 'react';
import { Cloud, Sun } from 'lucide-react';

const CloudMaster: React.FC = () => {
    const [oktas, setOktas] = useState(0);

    const getCode = (o: number) => {
        if (o === 0) return { code: 'SKC / NSC', desc: 'Sky Clear / No Sig Cloud', color: 'bg-sky-400' };
        if (o <= 2) return { code: 'FEW', desc: 'Few (1-2 Oktas)', color: 'bg-sky-300' };
        if (o <= 4) return { code: 'SCT', desc: 'Scattered (3-4 Oktas)', color: 'bg-sky-200' };
        if (o <= 7) return { code: 'BKN', desc: 'Broken (5-7 Oktas)', color: 'bg-slate-300' };
        return { code: 'OVC', desc: 'Overcast (8 Oktas)', color: 'bg-slate-500' };
    };

    const info = getCode(oktas);

    return (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-slate-200 text-slate-900">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-800">CloudMaster</h2>
                <p className="text-slate-500">Visualise cloud coverage codes (Oktas)</p>
            </div>

            <div className="relative w-64 h-64 mx-auto mb-8 rounded-full border-4 border-slate-800 overflow-hidden bg-sky-500 shadow-inner flex flex-wrap">
                {/* Simulated Sky Slices */}
                {[...Array(8)].map((_, i) => (
                    <div 
                        key={i}
                        className={`w-1/4 h-1/2 transition-all duration-300 ${i < oktas ? 'bg-white opacity-90' : 'bg-transparent'}`}
                        style={{
                            // Rough simulation of pie slices using grid
                            clipPath: i < 4 ? 'polygon(0 0, 100% 0, 50% 100%)' : 'polygon(50% 0, 100% 100%, 0 100%)',
                            transform: i < 4 ? 'scale(1.5) translateY(10%)' : 'scale(1.5) translateY(-10%)'
                        }}
                    ></div>
                ))}
                {oktas === 0 && <Sun className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-yellow-400 w-16 h-16 animate-spin-slow" />}
            </div>

            <div className="mb-8 px-4">
                <input 
                    type="range" 
                    min="0" 
                    max="8" 
                    step="1" 
                    value={oktas}
                    onChange={(e) => setOktas(Number(e.target.value))}
                    className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                />
                <div className="flex justify-between text-xs text-slate-400 font-bold mt-2">
                    <span>SKC (0)</span>
                    <span>4</span>
                    <span>OVC (8)</span>
                </div>
            </div>

            <div className={`p-6 rounded-xl text-center transition-colors duration-300 ${info.color} ${oktas > 4 ? 'text-white' : 'text-slate-800'}`}>
                <div className="text-sm font-bold uppercase opacity-70 mb-1">{oktas} / 8 OKTAS</div>
                <div className="text-4xl font-black mb-2">{info.code}</div>
                <div className="font-medium">{info.desc}</div>
            </div>
        </div>
    );
};

export default CloudMaster;