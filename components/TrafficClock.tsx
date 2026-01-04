import React, { useState } from 'react';
import { Plane, Navigation } from 'lucide-react';

const TrafficClock: React.FC = () => {
    const [clock, setClock] = useState(12);
    const [dist, setDist] = useState(5);

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-slate-200 text-slate-900">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                <Navigation className="mr-2 text-sky-600" /> Traffic Information
            </h2>

            <div className="flex flex-col md:flex-row gap-8 items-center">
                {/* Radar View */}
                <div className="relative w-64 h-64 bg-slate-900 rounded-full border-4 border-slate-700 shadow-inner flex items-center justify-center">
                    {/* Range Rings */}
                    <div className="absolute w-48 h-48 border border-slate-600 rounded-full opacity-50"></div>
                    <div className="absolute w-32 h-32 border border-slate-600 rounded-full opacity-50"></div>
                    
                    {/* Ownship */}
                    <Plane className="text-green-500 w-8 h-8 z-10 fill-current" />

                    {/* Traffic */}
                    <div 
                        className="absolute w-full h-full transition-transform duration-500"
                        style={{ transform: `rotate(${clock * 30}deg)` }}
                    >
                        <div 
                            className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center"
                            style={{ transform: `translateY(${(10 - dist) * 10}px)` }}
                        >
                            <Plane className="text-red-500 w-6 h-6 rotate-180" />
                            <span className="text-[10px] text-red-400 font-mono mt-1">{dist}NM</span>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex-1 w-full space-y-6">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Clock Position</label>
                        <input 
                            type="range" 
                            min="1" 
                            max="12" 
                            value={clock}
                            onChange={(e) => setClock(Number(e.target.value))}
                            className="w-full" 
                        />
                        <div className="text-center font-bold text-xl">{clock} o'clock</div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Distance</label>
                        <input 
                            type="range" 
                            min="1" 
                            max="10" 
                            value={dist}
                            onChange={(e) => setDist(Number(e.target.value))}
                            className="w-full" 
                        />
                        <div className="text-center font-bold text-xl">{dist} Miles</div>
                    </div>

                    <div className="p-4 bg-slate-100 rounded-lg text-center font-mono font-medium text-slate-700">
                        "Traffic, {clock} o'clock, {dist} miles, crossing left to right."
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrafficClock;