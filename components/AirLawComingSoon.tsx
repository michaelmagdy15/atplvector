
import React, { useState } from 'react';
import { Scale, Hammer, Construction } from 'lucide-react';

const AirLawComingSoon: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto p-12 text-center">
            <div className="bg-slate-800 rounded-2xl p-12 border-2 border-dashed border-slate-700 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-orange-500 to-red-500"></div>
                
                <div className="mb-8 relative">
                    <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full"></div>
                    <Scale className="w-32 h-32 text-red-500 mx-auto relative z-10" />
                </div>

                <h1 className="text-4xl font-black text-white mb-4">AIR LAW (010)</h1>
                <h2 className="text-2xl font-bold text-red-400 mb-6 flex items-center justify-center">
                    <Construction className="mr-3" /> UNDER CONSTRUCTION
                </h2>

                <p className="text-slate-400 max-w-lg mx-auto text-lg leading-relaxed mb-8">
                    The ATPLVector engineering team is currently finalizing the Air Law curriculum. 
                    Expect interactive modules on the Chicago Convention, Annexes, and Rules of the Air shortly.
                </p>

                <div className="inline-flex flex-col items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Expected Arrival</span>
                    <span className="text-xl font-mono text-white bg-slate-900 px-4 py-2 rounded border border-slate-700">Q2 2025</span>
                </div>
            </div>
        </div>
    );
};

export default AirLawComingSoon;
