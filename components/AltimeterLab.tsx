import React, { useState } from 'react';
import { Gauge } from 'lucide-react';

const AltimeterLab: React.FC = () => {
    const [qnh, setQnh] = useState(1013);
    const [subscale, setSubscale] = useState(1013);
    const trueAltitude = 2000; // The actual altitude of the aircraft above MSL

    // Formula: Indicated changes by ~30ft (or 27ft precise) per hPa difference
    // If subscale > QNH, Altimeter overreads (High to Low, look out below)
    const error = (subscale - qnh) * 30; 
    const indicated = trueAltitude + error;

    return (
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 bg-white p-8 rounded-2xl shadow-lg border border-slate-200 text-slate-900">
            <div className="flex-1 space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Altimeter Lab</h2>
                    <p className="text-slate-500 text-sm">See how Pressure settings affect Indicated Altitude.</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Actual QNH (Outside Pressure)</label>
                    <input 
                        type="range" 
                        min="950" 
                        max="1050" 
                        value={qnh}
                        onChange={(e) => setQnh(Number(e.target.value))}
                        className="w-full accent-sky-600"
                    />
                    <div className="text-right font-mono font-bold text-slate-700">{qnh} hPa</div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Altimeter Subscale Setting</label>
                    <input 
                        type="range" 
                        min="950" 
                        max="1050" 
                        value={subscale}
                        onChange={(e) => setSubscale(Number(e.target.value))}
                        className="w-full accent-green-600"
                    />
                    <div className="text-right font-mono font-bold text-green-700">{subscale} hPa</div>
                    
                    <div className="flex gap-2 mt-4">
                        <button onClick={() => setSubscale(1013)} className="px-3 py-1 bg-slate-200 rounded text-xs font-bold hover:bg-slate-300 text-slate-800">STD (1013)</button>
                        <button onClick={() => setSubscale(qnh)} className="px-3 py-1 bg-sky-100 text-sky-700 rounded text-xs font-bold hover:bg-sky-200">Set Correct QNH</button>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center bg-slate-900 rounded-xl p-8 relative overflow-hidden text-white">
                {/* Altimeter Face */}
                <div className="w-64 h-64 rounded-full bg-slate-800 border-4 border-slate-600 relative shadow-2xl flex items-center justify-center">
                    {/* Ticks */}
                    {[...Array(10)].map((_, i) => (
                        <div 
                            key={i} 
                            className="absolute w-1 h-3 bg-slate-400 top-2" 
                            style={{ transform: `rotate(${i * 36}deg)`, transformOrigin: '50% 112px' }}
                        >
                            <span className="block mt-4 -ml-1 text-white font-bold transform -rotate-0 text-lg">{i}</span>
                        </div>
                    ))}

                    {/* Needles */}
                    {/* 1000s */}
                    <div 
                        className="absolute w-2 h-16 bg-white origin-bottom rounded-full"
                        style={{ transform: `translateY(-50%) rotate(${(indicated / 10000) * 360}deg)` }}
                    ></div>
                    {/* 100s */}
                    <div 
                        className="absolute w-1 h-24 bg-white origin-bottom rounded-full"
                        style={{ transform: `translateY(-50%) rotate(${(indicated / 1000) * 360}deg)` }}
                    ></div>

                    {/* Subscale Window */}
                    <div className="absolute right-4 bg-black px-1 border border-slate-600 rounded text-green-400 font-mono text-sm">
                        {subscale}
                    </div>
                </div>

                <div className="mt-8 text-center w-full">
                    <div className="flex justify-between items-end border-b border-slate-700 pb-2 mb-2">
                        <span className="text-slate-400 text-sm">True Altitude</span>
                        <span className="text-white font-mono text-xl">{trueAltitude} ft</span>
                    </div>
                    <div className="flex justify-between items-end">
                        <span className="text-green-400 text-sm font-bold">Indicated</span>
                        <span className="text-green-400 font-mono text-2xl font-bold">{Math.round(indicated)} ft</span>
                    </div>
                    {Math.abs(error) > 50 && (
                        <div className="mt-4 p-2 bg-red-500/20 text-red-400 rounded text-xs font-bold border border-red-500/50">
                            DANGER: {Math.round(Math.abs(error))}ft Discrepancy!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AltimeterLab;