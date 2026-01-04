import React, { useState } from 'react';
import { Droplets, Thermometer } from 'lucide-react';

const FuelDensityCalc: React.FC = () => {
    const [fuelType, setFuelType] = useState<'JETA1' | 'AVGAS'>('JETA1');
    const [temp, setTemp] = useState(15); // Celsius
    const [volume, setVolume] = useState(1000); // Liters

    // Standard Densities at 15C
    // Jet A1: 0.80 kg/L. Coeff approx 0.0007 per deg C (Density decreases as temp increases)
    // Avgas: 0.72 kg/L. Coeff approx 0.0009 per deg C
    
    const getDensity = (t: number, type: string) => {
        const deltaT = t - 15;
        if (type === 'JETA1') {
            return 0.80 - (deltaT * 0.0007);
        } else {
            return 0.72 - (deltaT * 0.0009);
        }
    };

    const density = getDensity(temp, fuelType);
    const mass = volume * density;

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Droplets className="text-blue-400" /> Fuel Density & Mass
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
                
                {/* Visual Tank */}
                <div className="bg-slate-900 rounded-xl p-8 flex items-center justify-center border border-slate-700">
                    <div className="relative w-48 h-64 border-4 border-slate-500 rounded-lg bg-slate-800 overflow-hidden">
                        {/* Fluid */}
                        <div 
                            className={`absolute bottom-0 w-full transition-all duration-500 ${fuelType === 'JETA1' ? 'bg-amber-300/80' : 'bg-blue-400/80'}`}
                            style={{ height: `${(volume / 2000) * 100}%` }}
                        >
                            {/* Bubbles animation */}
                            <div className="absolute inset-0 w-full h-full opacity-30 bg-[url('https://www.transparenttextures.com/patterns/circles.png')] animate-[slide_10s_linear_infinite]"></div>
                        </div>
                        
                        {/* Graduations */}
                        <div className="absolute right-0 top-0 bottom-0 w-8 border-l border-slate-600 flex flex-col justify-between py-2 text-[10px] text-slate-400 font-mono text-right pr-1">
                            <span>2000L</span>
                            <span>1500L</span>
                            <span>1000L</span>
                            <span>500L</span>
                            <span>0L</span>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="space-y-6">
                    <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
                        <label className="text-xs font-bold text-slate-400 uppercase mb-4 block">Fuel Type</label>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setFuelType('JETA1')}
                                className={`flex-1 py-3 rounded font-bold border transition-all ${fuelType === 'JETA1' ? 'bg-amber-300 text-black border-amber-400' : 'bg-slate-800 text-slate-400 border-slate-600'}`}
                            >
                                JET A1
                            </button>
                            <button 
                                onClick={() => setFuelType('AVGAS')}
                                className={`flex-1 py-3 rounded font-bold border transition-all ${fuelType === 'AVGAS' ? 'bg-blue-500 text-white border-blue-400' : 'bg-slate-800 text-slate-400 border-slate-600'}`}
                            >
                                AVGAS 100LL
                            </button>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
                        <div className="flex justify-between mb-2">
                            <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1"><Thermometer size={14}/> Temperature</span>
                            <span className="font-bold text-white">{temp}°C</span>
                        </div>
                        <input 
                            type="range" min="-40" max="50" step="1" 
                            value={temp} 
                            onChange={e => setTemp(Number(e.target.value))}
                            className="w-full accent-white"
                        />
                    </div>

                    <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
                        <div className="flex justify-between mb-2">
                            <span className="text-xs font-bold text-slate-400 uppercase">Volume</span>
                            <span className="font-bold text-white">{volume} Liters</span>
                        </div>
                        <input 
                            type="range" min="100" max="2000" step="50" 
                            value={volume} 
                            onChange={e => setVolume(Number(e.target.value))}
                            className="w-full accent-white"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-700 p-4 rounded-lg text-center">
                            <p className="text-xs text-slate-400 uppercase mb-1">Density (SG)</p>
                            <p className="text-xl font-mono font-bold text-white">{density.toFixed(4)}</p>
                        </div>
                        <div className="bg-emerald-900/30 p-4 rounded-lg text-center border border-emerald-500/50">
                            <p className="text-xs text-emerald-400 uppercase mb-1">Total Mass</p>
                            <p className="text-2xl font-mono font-black text-white">{Math.round(mass)} kg</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default FuelDensityCalc;