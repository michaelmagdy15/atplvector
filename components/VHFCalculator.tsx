import React, { useState } from 'react';
import { RefreshCw, Info } from 'lucide-react';

const VHFCalculator: React.FC = () => {
  const [h1, setH1] = useState(100); // Transmitter height ft
  const [h2, setH2] = useState(3000); // Aircraft height ft

  // Formula from PDF: 1.23 * sqrt(H1) + 1.23 * sqrt(H2)
  const range = (1.23 * Math.sqrt(h1) + 1.23 * Math.sqrt(h2)).toFixed(1);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-slate-200 text-slate-900">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center">
            VHF Range Calculator
            <span className="ml-3 text-xs bg-sky-100 text-sky-800 px-2 py-1 rounded-full font-mono">FORMULA: 1.23 × √H1 + 1.23 × √H2</span>
        </h2>
        <p className="text-slate-500 mt-2">
            Calculate the theoretical Line-of-Sight range for VHF communications based on transmitter and receiver altitude.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
            {/* Input H1 */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Transmitter Elevation (H1)
                </label>
                <div className="flex items-center space-x-4 mb-4">
                    <input 
                        type="range" 
                        min="0" 
                        max="5000" 
                        step="50"
                        value={h1}
                        onChange={(e) => setH1(Number(e.target.value))}
                        className="w-full h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-sky-600"
                    />
                    <span className="font-mono font-bold w-20 text-right text-slate-700">{h1} ft</span>
                </div>
                <p className="text-xs text-slate-500">Usually a ground station antenna height.</p>
            </div>

            {/* Input H2 */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Aircraft Altitude (H2)
                </label>
                <div className="flex items-center space-x-4 mb-4">
                    <input 
                        type="range" 
                        min="0" 
                        max="45000" 
                        step="500"
                        value={h2}
                        onChange={(e) => setH2(Number(e.target.value))}
                        className="w-full h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-sky-600"
                    />
                    <span className="font-mono font-bold w-20 text-right text-slate-700">{h2} ft</span>
                </div>
                <p className="text-xs text-slate-500">Your current flight level or altitude.</p>
            </div>
        </div>

        {/* Visualization */}
        <div className="relative flex flex-col items-center justify-center p-8 bg-gradient-to-b from-sky-50 to-white rounded-2xl border-2 border-sky-100">
            
            {/* Result */}
            <div className="absolute top-6 right-6 text-right">
                <div className="text-sm text-slate-400 font-bold tracking-wider mb-1">THEORETICAL RANGE</div>
                <div className="text-5xl font-bold text-sky-600 font-mono tracking-tighter">
                    {range} <span className="text-xl text-slate-400">NM</span>
                </div>
            </div>

            {/* SVG Diagram */}
            <div className="mt-20 w-full h-64 relative">
                 <svg viewBox="0 0 400 200" className="w-full h-full drop-shadow-lg">
                    {/* Ground curve */}
                    <path d="M0,180 Q200,160 400,180" fill="none" stroke="#94a3b8" strokeWidth="2" />
                    
                    {/* Tower */}
                    <line x1="50" y1="178" x2="50" y2={178 - (Math.min(h1, 5000) / 100)} stroke="#475569" strokeWidth="4" />
                    <circle cx="50" cy={178 - (Math.min(h1, 5000) / 100)} r="4" fill="#0ea5e9" />
                    
                    {/* Aircraft */}
                    <g transform={`translate(350, ${178 - (Math.min(h2, 45000) / 400)})`}>
                         <path d="M-10,0 L10,0 M0,-5 L0,5" stroke="#0ea5e9" strokeWidth="2" />
                         <path d="M-15,2 L-5,-2 L15,0 L-5,2 Z" fill="#0f172a" />
                    </g>

                    {/* Signal Line */}
                    <line 
                        x1="50" 
                        y1={178 - (Math.min(h1, 5000) / 100)} 
                        x2="350" 
                        y2={178 - (Math.min(h2, 45000) / 400)} 
                        stroke="#38bdf8" 
                        strokeWidth="2" 
                        strokeDasharray="4 4"
                        className="opacity-50"
                    />
                 </svg>
            </div>

            <div className="flex items-start p-4 bg-sky-50 rounded-lg text-sky-800 text-sm mt-4">
                <Info className="w-5 h-5 mr-2 flex-shrink-0" />
                <p>Note: This formula assumes line-of-sight propagation over a smooth earth. Actual range may be reduced by terrain obstruction or increased by atmospheric ducting.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default VHFCalculator;