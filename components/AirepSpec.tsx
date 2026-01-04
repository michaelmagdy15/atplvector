import React, { useState } from 'react';
import { CloudRain } from 'lucide-react';

const AirepSpec: React.FC = () => {
    const [hazard, setHazard] = useState('Severe Turbulence');

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-slate-200 text-slate-900">
            <div className="flex items-center mb-6">
                <div className="bg-red-100 p-3 rounded-full mr-4 text-red-600"><CloudRain /></div>
                <h2 className="text-2xl font-bold text-slate-800">AIREP SPECIAL</h2>
            </div>
            
            <p className="text-slate-600 mb-6">
                Construct a Special Air Report. Mandatory reporting for:
            </p>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Select Phenomenon</label>
                <select 
                    className="w-full p-3 rounded-lg border border-slate-300 bg-white text-slate-800"
                    value={hazard}
                    onChange={(e) => setHazard(e.target.value)}
                >
                    <option>Severe Turbulence</option>
                    <option>Severe Icing</option>
                    <option>Severe Mountain Wave</option>
                    <option>Thunderstorms (Obscured)</option>
                    <option>Heavy Duststorm</option>
                    <option>Volcanic Ash</option>
                </select>
            </div>

            <div className="bg-slate-900 text-white p-6 rounded-xl font-mono">
                <span className="text-slate-500">TRANSMISSION:</span><br/>
                "AIREP SPECIAL, FASTAIR 345, <span className="text-red-400">{hazard.toUpperCase()}</span>, FLIGHT LEVEL 340, PRESENT POSITION."
            </div>
        </div>
    );
};

export default AirepSpec;