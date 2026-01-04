import React, { useState } from 'react';
import { Eye, Plane } from 'lucide-react';

const RvrSimulator: React.FC = () => {
    const [rvr, setRvr] = useState(1200);

    // Calculate opacity of "fog" layer based on RVR. 
    // Lower RVR = Higher Opacity.
    // Let's say 2000m is clear (0 opacity), 50m is blind (1 opacity).
    const opacity = Math.max(0, Math.min(1, 1 - (rvr / 1500)));

    const getCatStatus = (m: number) => {
        if (m < 200) return { cat: 'CAT IIIC', color: 'text-red-600' };
        if (m < 350) return { cat: 'CAT IIIA/B', color: 'text-orange-600' };
        if (m < 550) return { cat: 'CAT II', color: 'text-yellow-600' };
        if (m < 800) return { cat: 'CAT I (Marginal)', color: 'text-blue-600' };
        return { cat: 'CAT I (Good)', color: 'text-green-600' };
    };

    const status = getCatStatus(rvr);

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-slate-200 text-slate-900">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                        <Eye className="mr-2" /> RVR Visualizer
                    </h2>
                    <p className="text-slate-500 text-sm">Runway Visual Range Simulation</p>
                </div>
                <div className="text-right">
                    <div className="text-4xl font-mono font-bold text-slate-900">{rvr}m</div>
                    <div className={`text-sm font-bold ${status.color}`}>{status.cat} Approach</div>
                </div>
            </div>

            {/* Viewport */}
            <div className="relative w-full h-64 bg-slate-800 rounded-xl overflow-hidden mb-8 border-4 border-slate-900 perspective-500">
                {/* Sky */}
                <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-slate-900 to-slate-700"></div>
                {/* Ground */}
                <div className="absolute bottom-0 w-full h-1/2 bg-green-900"></div>
                
                {/* Runway */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-full bg-slate-600 transform perspective-origin-bottom" 
                     style={{ clipPath: 'polygon(20% 0, 80% 0, 100% 100%, 0% 100%)' }}>
                    {/* Centerline Lights */}
                    <div className="absolute left-1/2 -translate-x-1/2 h-full w-2 flex flex-col justify-between py-4">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="w-1 h-8 bg-white rounded-full shadow-[0_0_10px_white]"></div>
                        ))}
                    </div>
                    {/* Edge Lights */}
                    <div className="absolute left-2 h-full w-2 flex flex-col justify-between py-4">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="w-2 h-2 bg-white rounded-full shadow-[0_0_8px_white]"></div>
                        ))}
                    </div>
                    <div className="absolute right-2 h-full w-2 flex flex-col justify-between py-4">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="w-2 h-2 bg-white rounded-full shadow-[0_0_8px_white]"></div>
                        ))}
                    </div>
                </div>

                {/* Fog Layer */}
                <div 
                    className="absolute inset-0 bg-slate-300 pointer-events-none transition-opacity duration-300 z-10"
                    style={{ opacity: opacity }}
                ></div>

                {/* Cockpit Overlay */}
                <div className="absolute inset-0 border-[20px] border-slate-900 rounded-xl pointer-events-none z-20 opacity-80"></div>
            </div>

            <div className="px-4">
                <input 
                    type="range" 
                    min="50" 
                    max="2000" 
                    step="50" 
                    value={rvr}
                    onChange={(e) => setRvr(Number(e.target.value))}
                    className="w-full h-4 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                />
                <div className="flex justify-between text-xs text-slate-400 font-bold mt-2 uppercase">
                    <span>50m (Blind)</span>
                    <span>550m (Cat I Min)</span>
                    <span>1500m+ (Clear)</span>
                </div>
            </div>
        </div>
    );
};

export default RvrSimulator;