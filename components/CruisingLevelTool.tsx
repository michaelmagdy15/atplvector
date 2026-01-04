import React, { useState, useEffect } from 'react';
import { Compass, ArrowUp, Info, RotateCcw } from 'lucide-react';

const CruisingLevelTool: React.FC = () => {
  const [heading, setHeading] = useState<number>(90);
  const [flightRule, setFlightRule] = useState<'VFR' | 'IFR'>('VFR');
  const [result, setResult] = useState<string>('');
  const [trackType, setTrackType] = useState<'East' | 'West'>('East');

  useEffect(() => {
    // Semi-Circular Rule Logic (Page 117 PDF)
    // 000-179 (East): ODD
    // 180-359 (West): EVEN
    
    // Normalize heading
    const normalizedHeading = ((heading % 360) + 360) % 360;
    
    let isEast = normalizedHeading >= 0 && normalizedHeading <= 179;
    setTrackType(isEast ? 'East' : 'West');

    let baseRule = isEast ? "ODD" : "EVEN";
    
    if (flightRule === 'IFR') {
      setResult(`${baseRule} Flight Levels (e.g., FL${isEast ? '50, 70, 90' : '60, 80, 100'})`);
    } else {
      setResult(`${baseRule} + 500ft (e.g., FL${isEast ? '55, 75, 95' : '65, 85, 105'})`);
    }

  }, [heading, flightRule]);

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <Compass className="text-amber-400" />
        Cruising Level Calculator
      </h2>
      
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div>
            <label className="flex justify-between text-slate-400 text-sm mb-4">
               <span>Magnetic Track</span>
               <span className="font-mono text-amber-400 font-bold">{heading.toString().padStart(3, '0')}°</span>
            </label>
            <input
              type="range"
              min="0"
              max="359"
              value={heading}
              onChange={(e) => setHeading(parseInt(e.target.value))}
              className="w-full h-3 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400 transition-all"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
               <span>000°</span>
               <span>180°</span>
               <span>359°</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 text-sm mb-2">Flight Rules</label>
            <div className="flex bg-slate-900 p-1 rounded-lg w-full">
              <button
                onClick={() => setFlightRule('VFR')}
                className={`flex-1 py-3 rounded font-bold text-sm transition-all ${
                  flightRule === 'VFR' ? 'bg-sky-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                }`}
              >
                VFR
              </button>
              <button
                onClick={() => setFlightRule('IFR')}
                className={`flex-1 py-3 rounded font-bold text-sm transition-all ${
                  flightRule === 'IFR' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                }`}
              >
                IFR
              </button>
            </div>
          </div>
          
          <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
             <p className="text-xs text-slate-400 uppercase mb-1">Result</p>
             <p className="text-lg font-bold text-white animate-in slide-in-from-left-2 duration-300" key={result}>
                {result}
             </p>
          </div>
        </div>

        {/* Visualizer Dial */}
        <div className="flex flex-col items-center justify-center relative">
          <div className="relative w-64 h-64">
             {/* SVG Dial */}
             <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
                {/* Background Ring */}
                <circle cx="50" cy="50" r="48" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                
                {/* East Sector (Odd) */}
                <path d="M 50 2 A 48 48 0 0 1 50 98" fill="none" stroke="#f97316" strokeWidth="8" strokeOpacity="0.2" />
                <path d="M 50 10 A 40 40 0 0 1 50 90" fill="none" stroke="#f97316" strokeWidth="1" strokeDasharray="2 2" />
                
                {/* West Sector (Even) */}
                <path d="M 50 98 A 48 48 0 0 1 50 2" fill="none" stroke="#3b82f6" strokeWidth="8" strokeOpacity="0.2" />
                <path d="M 50 90 A 40 40 0 0 1 50 10" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="2 2" />

                {/* Labels */}
                <text x="75" y="52" className="text-[6px] fill-orange-400 font-bold" textAnchor="middle">ODD</text>
                <text x="25" y="52" className="text-[6px] fill-blue-400 font-bold" textAnchor="middle">EVEN</text>
                
                <text x="50" y="15" className="text-[4px] fill-slate-500 font-mono" textAnchor="middle">000°</text>
                <text x="85" y="52" className="text-[4px] fill-slate-500 font-mono" textAnchor="middle">090°</text>
                <text x="50" y="90" className="text-[4px] fill-slate-500 font-mono" textAnchor="middle">180°</text>
                <text x="15" y="52" className="text-[4px] fill-slate-500 font-mono" textAnchor="middle">270°</text>

                {/* Center Hub */}
                <circle cx="50" cy="50" r="15" fill="#0f172a" stroke="#475569" strokeWidth="1" />
                
                {/* Heading Value in Center */}
                <text x="50" y="52" className="text-[10px] fill-white font-mono font-bold" textAnchor="middle" dominantBaseline="middle">
                   {heading.toString().padStart(3, '0')}°
                </text>

                {/* Aircraft Pointer */}
                <g transform={`rotate(${heading}, 50, 50)`}>
                   {/* Plane Icon */}
                   <path d="M 50 20 L 55 35 L 50 32 L 45 35 Z" fill="#fbbf24" />
                   {/* Needle Line */}
                   <line x1="50" y1="50" x2="50" y2="25" stroke="#fbbf24" strokeWidth="1" />
                </g>
             </svg>

             {/* Dynamic Quadrant Indicator */}
             <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 px-4 py-1 rounded-full border border-slate-700 text-xs font-bold whitespace-nowrap">
                Currently: <span className={trackType === 'East' ? 'text-orange-400' : 'text-blue-400'}>{trackType}ern / {trackType === 'East' ? 'ODD' : 'EVEN'}</span>
             </div>
          </div>
        </div>
      </div>
      
      <div className="mt-12 flex items-start gap-3 text-xs text-slate-400 bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
        <Info size={16} className="mt-0.5 flex-shrink-0 text-sky-400" />
        <p>
          <strong>Semi-Circular Rule:</strong> Separation increases to 2000ft above FL290 (unless RVSM). 
          This rule prevents head-on collisions by separating traffic based on their magnetic track.
          Remember the mnemonic: <span className="text-orange-300">"East is Odd"</span>, <span className="text-blue-300">"West is Even"</span>.
        </p>
      </div>
    </div>
  );
};

export default CruisingLevelTool;