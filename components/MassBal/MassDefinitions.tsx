
import React, { useState } from 'react';
import { Weight, Info, ArrowRight } from 'lucide-react';

const MassDefinitions: React.FC = () => {
    const [bem, setBem] = useState(25000); // Basic Empty Mass
    const [crew, setCrew] = useState(500); // Crew + Bag
    const [fuel, setFuel] = useState(8000); // Takeoff Fuel
    const [pax, setPax] = useState(12000); // Payload

    // Calculations based on 031.02.01
    const dom = bem + crew; // Dry Operating Mass
    const om = dom + fuel; // Operating Mass
    const tom = om + pax; // Takeoff Mass (Zero Fuel Mass + Fuel)
    const zfm = dom + pax; // Zero Fuel Mass

    const maxScale = 60000;
    const getPercent = (val: number) => (val / maxScale) * 100;

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <Weight className="text-yellow-400" /> Mass Definitions (031.02)
            </h2>
            <p className="text-slate-400 mb-8">Visualize how aircraft masses are constructed.</p>

            <div className="grid lg:grid-cols-2 gap-12">
                
                {/* Visual Stack */}
                <div className="relative h-[400px] w-full bg-slate-900 rounded-xl border border-slate-700 flex flex-col-reverse p-8 shadow-inner">
                    
                    {/* BEM Block */}
                    <div 
                        style={{ height: `${getPercent(bem)}%` }} 
                        className="w-full bg-slate-600 rounded-b-lg relative border-t border-slate-500 flex items-center justify-center transition-all duration-500"
                    >
                        <span className="text-white font-bold drop-shadow-md">Basic Empty Mass (BEM)</span>
                        <span className="absolute right-2 text-xs text-slate-300">{bem} kg</span>
                    </div>

                    {/* Crew Block */}
                    <div 
                        style={{ height: `${getPercent(crew)}%` }} 
                        className="w-full bg-indigo-600 relative border-t border-indigo-400 flex items-center justify-center transition-all duration-500"
                    >
                        <span className="text-white text-xs font-bold drop-shadow-md">+ Crew & Kit</span>
                        <div className="absolute right-[-140px] top-1/2 -translate-y-1/2 text-indigo-400 font-bold flex items-center">
                             <ArrowRight className="mr-2 h-4 w-4" /> DOM: {dom} kg
                        </div>
                    </div>

                    {/* Payload Block */}
                    <div 
                        style={{ height: `${getPercent(pax)}%` }} 
                        className="w-full bg-emerald-600 relative border-t border-emerald-400 flex items-center justify-center transition-all duration-500"
                    >
                        <span className="text-white text-xs font-bold drop-shadow-md">+ Traffic Load (Payload)</span>
                        <div className="absolute left-[-140px] top-1/2 -translate-y-1/2 text-emerald-400 font-bold flex items-center justify-end w-[130px]">
                             ZFM: {zfm} kg <ArrowRight className="ml-2 h-4 w-4 rotate-180" /> 
                        </div>
                    </div>

                    {/* Fuel Block */}
                    <div 
                        style={{ height: `${getPercent(fuel)}%` }} 
                        className="w-full bg-yellow-600 rounded-t-lg relative border-t border-yellow-400 flex items-center justify-center transition-all duration-500"
                    >
                        <span className="text-white text-xs font-bold drop-shadow-md">+ Take-off Fuel</span>
                    </div>

                    {/* Total */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-white font-bold text-xl">
                        TOM: {tom} kg
                    </div>
                </div>

                {/* Controls */}
                <div className="space-y-6">
                    <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
                        <label className="block text-slate-400 text-xs font-bold uppercase mb-2">Basic Empty Mass (Structure + Oil + Unusable Fuel)</label>
                        <input type="range" min="15000" max="30000" step="500" value={bem} onChange={e => setBem(Number(e.target.value))} className="w-full accent-slate-500" />
                    </div>

                    <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
                        <label className="block text-indigo-400 text-xs font-bold uppercase mb-2">Crew, Pantry & Kit</label>
                        <input type="range" min="100" max="2000" step="50" value={crew} onChange={e => setCrew(Number(e.target.value))} className="w-full accent-indigo-500" />
                    </div>

                    <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
                        <label className="block text-emerald-400 text-xs font-bold uppercase mb-2">Traffic Load (Pax + Cargo)</label>
                        <input type="range" min="0" max="20000" step="500" value={pax} onChange={e => setPax(Number(e.target.value))} className="w-full accent-emerald-500" />
                    </div>

                    <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
                        <label className="block text-yellow-400 text-xs font-bold uppercase mb-2">Take-off Fuel</label>
                        <input type="range" min="2000" max="15000" step="500" value={fuel} onChange={e => setFuel(Number(e.target.value))} className="w-full accent-yellow-500" />
                    </div>

                    <div className="bg-slate-700 p-4 rounded text-sm text-slate-300 flex gap-2">
                        <Info className="flex-shrink-0 text-sky-400" />
                        <p><strong>Note:</strong> Trip Fuel + Reserves = Take-off Fuel. Taxi Fuel is consumed before TOM. Useful Load = Traffic Load + Useable Fuel.</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MassDefinitions;
