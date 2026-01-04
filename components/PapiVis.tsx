import React, { useState } from 'react';

const PapiVis: React.FC = () => {
    const [angle, setAngle] = useState(3.0); // 3.0 is perfect

    // Logic:
    // > 3.5: All White (Too High)
    // 3.2 - 3.5: 3 White 1 Red (Slightly High)
    // 2.8 - 3.2: 2 White 2 Red (On Slope)
    // 2.5 - 2.8: 1 White 3 Red (Slightly Low)
    // < 2.5: All Red (Too Low)

    const getLights = (a: number) => {
        if (a >= 3.5) return ['white', 'white', 'white', 'white'];
        if (a >= 3.2) return ['white', 'white', 'white', 'red'];
        if (a >= 2.8) return ['white', 'white', 'red', 'red'];
        if (a >= 2.5) return ['white', 'red', 'red', 'red'];
        return ['red', 'red', 'red', 'red'];
    };

    const lights = getLights(angle);

    return (
        <div className="max-w-2xl mx-auto bg-slate-900 p-8 rounded-2xl shadow-xl text-center">
            <h2 className="text-white font-bold text-xl mb-8">PAPI Simulator</h2>
            
            <div className="flex justify-center space-x-4 mb-12">
                {lights.map((color, i) => (
                    <div 
                        key={i}
                        className={`w-16 h-16 rounded-full border-4 border-slate-700 shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-colors duration-300
                            ${color === 'white' ? 'bg-white shadow-white/50' : 'bg-red-600 shadow-red-600/50'}
                        `}
                    ></div>
                ))}
            </div>

            <div className="bg-slate-800 p-6 rounded-xl">
                <div className="flex justify-between text-slate-400 text-xs font-bold uppercase mb-2">
                    <span>Low (Red)</span>
                    <span>On Slope (3.0°)</span>
                    <span>High (White)</span>
                </div>
                <input 
                    type="range" 
                    min="2.0" 
                    max="4.0" 
                    step="0.1" 
                    value={angle}
                    onChange={(e) => setAngle(Number(e.target.value))}
                    className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-white"
                />
                <div className="text-white font-mono font-bold text-2xl mt-4">{angle.toFixed(1)}°</div>
            </div>
        </div>
    );
};

export default PapiVis;
