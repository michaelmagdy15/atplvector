
import React, { useState } from 'react';
import { ArrowUpRight, RotateCw, AlignVerticalJustifyCenter, Mountain, Plane } from 'lucide-react';

const PansOpsProcedures: React.FC = () => {
  const [tab, setTab] = useState<'dep' | 'circle' | 'parallel'>('dep');

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Mountain className="text-pink-400" />
            PANS-OPS Procedures (Doc 8168)
          </h2>
          <p className="text-slate-400 text-sm">Design criteria for Departures, Approaches, and Parallel Operations.</p>
        </div>

        <div className="flex bg-slate-900 p-1 rounded-lg">
          <button onClick={() => setTab('dep')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'dep' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-white'}`}>Departures</button>
          <button onClick={() => setTab('circle')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'circle' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-white'}`}>Circling</button>
          <button onClick={() => setTab('parallel')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'parallel' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-white'}`}>Parallel Runways</button>
        </div>
      </div>

      {tab === 'dep' && <DepartureDesign />}
      {tab === 'circle' && <CirclingAreas />}
      {tab === 'parallel' && <ParallelRunways />}
    </div>
  );
};

const DepartureDesign = () => (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 relative h-[300px] flex items-end overflow-hidden">
            {/* Visualizing PDG */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900"></div>
            
            {/* Runway */}
            <div className="absolute bottom-10 left-4 w-20 h-2 bg-slate-500"></div>
            <div className="absolute bottom-10 left-4 text-[10px] text-slate-400 -mb-4">DER</div>

            {/* PDG Slope (3.3%) */}
            <div className="absolute bottom-10 left-24 w-full h-1 bg-pink-500 origin-bottom-left -rotate-6"></div>
            <div className="absolute bottom-28 left-60 text-pink-400 text-xs font-bold -rotate-6">PDG 3.3%</div>

            {/* OIS Slope (2.5%) */}
            <div className="absolute bottom-10 left-24 w-full h-1 bg-slate-500 origin-bottom-left -rotate-3 border-t border-dashed border-slate-300"></div>
            <div className="absolute bottom-20 left-60 text-slate-500 text-xs font-bold -rotate-3">OIS 2.5%</div>

            {/* Screen Height */}
            <div className="absolute bottom-10 left-24 w-1 h-4 bg-yellow-400"></div>
            <div className="absolute bottom-4 left-24 text-[10px] text-yellow-400 font-bold w-12 leading-tight">Screen Height</div>

            {/* MOC */}
            <div className="absolute bottom-32 left-80 h-10 w-1 border-r border-pink-500">
                <span className="absolute -left-12 top-2 text-[10px] text-pink-300">0.8% MOC</span>
            </div>
        </div>

        <div className="space-y-4">
            <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
                <h3 className="font-bold text-white mb-2 flex items-center gap-2"><ArrowUpRight /> Standard Departure (SID) Criteria</h3>
                <ul className="text-sm text-slate-300 space-y-2">
                    <li className="flex justify-between border-b border-slate-800 pb-1">
                        <span>Procedure Design Gradient (PDG)</span>
                        <span className="text-pink-400 font-bold">3.3%</span>
                    </li>
                    <li className="flex justify-between border-b border-slate-800 pb-1">
                        <span>Obstacle Id Surface (OIS)</span>
                        <span className="text-slate-400 font-bold">2.5%</span>
                    </li>
                    <li className="flex justify-between border-b border-slate-800 pb-1">
                        <span>Min Obstacle Clearance (MOC)</span>
                        <span className="text-slate-400 font-bold">0.8%</span>
                    </li>
                    <li className="flex justify-between">
                        <span>Screen Height (DER)</span>
                        <span className="text-yellow-400 font-bold">5m (16ft)*</span>
                    </li>
                </ul>
                <p className="text-[10px] text-slate-500 mt-2">*Previously 35ft. Now 5m/16ft for Props/Jets standard.</p>
            </div>

            <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
                <h4 className="font-bold text-white text-sm mb-2">Track Guidance</h4>
                <p className="text-xs text-slate-300">
                    Departure track normally begins at the DER (Departure End of Runway). 
                    Straight flight assumed until <span className="text-pink-400 font-bold">120m (394ft)</span> above DER elevation.
                </p>
            </div>
        </div>
    </div>
);

const CirclingAreas = () => {
    const [cat, setCat] = useState('C');
    
    // Simplified Radii (ICAO PANS-OPS)
    // A: 1.68 NM, B: 2.66 NM, C: 4.20 NM, D: 5.28 NM, E: 6.94 NM
    const getData = (c: string) => {
        switch(c) {
            case 'A': return { r: 1.68, speed: 100 };
            case 'B': return { r: 2.66, speed: 135 };
            case 'C': return { r: 4.20, speed: 180 };
            case 'D': return { r: 5.28, speed: 205 };
            case 'E': return { r: 6.94, speed: 240 };
            default: return { r: 0, speed: 0 };
        }
    };

    const data = getData(cat);
    const scale = (data.r / 7) * 100; // Scale relative to max E (approx 7)

    return (
        <div className="flex flex-col md:flex-row gap-8 animate-in slide-in-from-right-2">
            <div className="w-full md:w-1/3 space-y-6">
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h3 className="font-bold text-white mb-4">Select Category</h3>
                    <div className="flex gap-2">
                        {['A', 'B', 'C', 'D', 'E'].map(c => (
                            <button 
                                key={c}
                                onClick={() => setCat(c)}
                                className={`flex-1 py-2 rounded font-bold text-sm ${cat === c ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h3 className="font-bold text-white mb-2">Parameters</h3>
                    <div className="flex justify-between mb-2">
                        <span className="text-slate-400 text-sm">Max Speed</span>
                        <span className="font-mono text-white font-bold">{data.speed} kts</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-400 text-sm">Protected Radius</span>
                        <span className="font-mono text-pink-400 font-bold">{data.r.toFixed(2)} NM</span>
                    </div>
                </div>
            </div>

            <div className="w-full md:w-2/3 bg-slate-900 rounded-xl border border-slate-700 relative h-[350px] flex items-center justify-center overflow-hidden">
                {/* Visual Area */}
                <div className="absolute inset-0 bg-slate-800/50"></div>
                
                {/* Runway */}
                <div className="w-16 h-2 bg-white absolute z-20"></div>

                {/* Protected Area (Capsule Shape simplified as circle for dynamic radius viz) */}
                {/* Normally arcs from threshold, but let's represent radius scale */}
                <div 
                    className="absolute rounded-full border-2 border-pink-500 bg-pink-500/10 transition-all duration-500"
                    style={{ width: `${scale}%`, height: `${scale}%` }}
                ></div>
                
                {/* Radius Line */}
                <div className="absolute w-1/2 h-[1px] border-t border-dashed border-pink-400 top-1/2 left-1/2 origin-left flex items-end justify-center" style={{ width: `${scale/2}%` }}>
                    <span className="text-[10px] text-pink-300 -mb-4">{data.r} NM</span>
                </div>

                <div className="absolute top-4 right-4 flex items-center gap-2">
                    <RotateCw className="text-slate-500" />
                    <span className="text-xs text-slate-400">Visual Maneuvering Area</span>
                </div>
            </div>
        </div>
    );
};

const ParallelRunways = () => (
    <div className="space-y-6 animate-in fade-in">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 relative h-[300px] overflow-hidden flex justify-center items-center">
            {/* Runways */}
            <div className="absolute top-[20%] w-full h-2 bg-slate-600 flex justify-center"><div className="w-32 h-full bg-white"></div></div>
            <div className="absolute bottom-[20%] w-full h-2 bg-slate-600 flex justify-center"><div className="w-32 h-full bg-white"></div></div>

            {/* Approach Paths */}
            <div className="absolute top-[20%] right-0 w-1/2 h-[1px] bg-white/30"></div>
            <div className="absolute bottom-[20%] right-0 w-1/2 h-[1px] bg-white/30"></div>

            {/* NTZ (No Transgression Zone) */}
            <div className="absolute top-1/2 -translate-y-1/2 w-full h-20 bg-red-900/20 border-y border-red-500/50 flex items-center justify-center">
                <span className="text-red-500 font-bold tracking-[1em] text-xs opacity-50">NO TRANSGRESSION ZONE (NTZ)</span>
            </div>

            {/* Aircraft */}
            <div className="absolute top-[25%] right-[20%] text-white"><Plane className="-rotate-90" /></div>
            <div className="absolute bottom-[25%] right-[10%] text-white"><Plane className="-rotate-90" /></div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
                <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                    <AlignVerticalJustifyCenter size={18} className="text-pink-400" /> Independent Operations
                </h3>
                <p className="text-sm text-slate-300 mb-2">Simultaneous approaches permitted.</p>
                <ul className="text-xs text-slate-400 list-disc pl-4 space-y-1">
                    <li>Requires <strong className="text-white">NTZ</strong> (at least 610m wide).</li>
                    <li>Radar monitoring required.</li>
                    <li>Turn away immediately if aircraft penetrates NTZ.</li>
                </ul>
            </div>

            <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
                <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                    <AlignVerticalJustifyCenter size={18} className="text-slate-400" /> Dependent Operations
                </h3>
                <p className="text-sm text-slate-300 mb-2">Staggered approaches.</p>
                <ul className="text-xs text-slate-400 list-disc pl-4 space-y-1">
                    <li>Separation must be maintained diagonally.</li>
                    <li>Standard: 1.5 NM / 2 NM / 3 NM radar separation depending on runway distance.</li>
                </ul>
            </div>
        </div>
    </div>
);

export default PansOpsProcedures;
