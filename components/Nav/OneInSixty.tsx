
import React, { useState } from 'react';
import { Navigation } from 'lucide-react';

const OneInSixty: React.FC = () => {
    const [distGone, setDistGone] = useState(60);
    const [trackError, setTrackError] = useState(5); // miles off

    // 1 in 60 rule: Track Error Angle = (Dist Off / Dist Gone) * 60
    const teAngle = ((trackError / distGone) * 60).toFixed(1);

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Navigation className="text-indigo-400" /> 1 in 60 Rule Calculator
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div>
                        <label className="text-slate-400 text-sm block mb-2">Distance Gone (NM)</label>
                        <input 
                            type="range" min="10" max="120" value={distGone} 
                            onChange={e => setDistGone(Number(e.target.value))}
                            className="w-full accent-indigo-500"
                        />
                        <div className="text-right text-white font-mono">{distGone} NM</div>
                    </div>
                    <div>
                        <label className="text-slate-400 text-sm block mb-2">Distance Off Track (NM)</label>
                        <input 
                            type="range" min="1" max="20" value={trackError} 
                            onChange={e => setTrackError(Number(e.target.value))}
                            className="w-full accent-red-500"
                        />
                        <div className="text-right text-white font-mono">{trackError} NM</div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center bg-slate-900 rounded-xl p-8 text-center">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-2">Track Error Angle</p>
                    <div className="text-6xl font-black text-white mb-4">{teAngle}°</div>
                    <div className="bg-slate-800 p-3 rounded text-sm text-slate-300">
                        Formula: <br/>
                        <code>TE = (Off / Gone) × 60</code>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OneInSixty;
