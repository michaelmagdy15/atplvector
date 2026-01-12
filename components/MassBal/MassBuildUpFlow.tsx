import React from 'react';
import { ArrowDown, Info } from 'lucide-react';

const MassBuildUpFlow: React.FC = () => {
    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="text-center mb-10">
                <h1 className="text-3xl font-black text-white tracking-tight uppercase">
                    Definitions & Flow <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Diagram</span>
                </h1>
                <p className="text-slate-400 mt-2 font-mono">Visualizing the accumulation of aircraft mass.</p>
            </div>

            <div className="relative max-w-4xl mx-auto">
                {/* Connecting Lines Layer (Absolute) - simplified for distinct blocks */}

                <div className="flex flex-col items-center space-y-4">

                    {/* BEM */}
                    <div className="relative group">
                        <div className="w-48 h-24 bg-yellow-400 border-4 border-yellow-600 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(250,204,21,0.3)]">
                            <span className="text-3xl font-black text-slate-900">BEM</span>
                        </div>
                        <div className="hidden group-hover:block absolute left-full ml-4 top-0 bg-slate-800 p-2 rounded text-xs w-64 border border-slate-600 z-10">
                            <strong>Basic Empty Mass:</strong> Airframe, Engines, Systems, Unusable Fuel/Oil.
                        </div>
                    </div>

                    <ArrowDown className="text-slate-500" />

                    {/* Plus Items for DOM */}
                    <div className="text-xs text-slate-400 text-center max-w-xs uppercase font-bold">
                        + Special Equipment<br />+ Variable Load (Crew, Pantry, etc.)
                    </div>

                    <ArrowDown className="text-slate-500" />

                    {/* DOM */}
                    <div className="relative group">
                        <div className="w-48 h-24 bg-yellow-400 border-4 border-yellow-600 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(250,204,21,0.3)]">
                            <span className="text-3xl font-black text-slate-900">DOM</span>
                        </div>
                        <div className="hidden group-hover:block absolute left-full ml-4 top-0 bg-slate-800 p-2 rounded text-xs w-64 border border-slate-600 z-10">
                            <strong>Dry Operating Mass:</strong> BEM + Operational Items. Ready to fly but NO Fuel, NO Traffic Load.
                        </div>
                    </div>

                    {/* Split Path: + Traffic vs + Fuel */}
                    <div className="grid grid-cols-2 gap-16 w-full pt-8">
                        {/* Left Path: + Fuel = OM */}
                        <div className="flex flex-col items-center">
                            <div className="h-8 border-l-2 border-dashed border-slate-600 absolute -mt-8 left-1/2 -ml-[1px] rotate-45 origin-top-left -translate-x-[2px]"></div> {/* Visual hack for non-svg connection lines */}

                            <div className="text-xs text-slate-400 mb-2 font-bold uppercase">+ Take-off Fuel</div>
                            <div className="w-40 h-20 bg-yellow-300 border-4 border-yellow-600 rounded-lg flex items-center justify-center opacity-80">
                                <span className="text-2xl font-black text-slate-900">OM</span>
                            </div>
                            <div className="text-[10px] text-slate-500 mt-1 uppercase">Operating Mass</div>
                        </div>

                        {/* Right Path: + Traffic = ZFM */}
                        <div className="flex flex-col items-center relative">
                            <div className="text-xs text-slate-400 mb-2 font-bold uppercase">+ Traffic Load</div>
                            <div className="relative group">
                                <div className="w-40 h-20 bg-amber-400 border-4 border-red-700 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(180,83,9,0.4)]">
                                    <span className="text-2xl font-black text-slate-900">ZFM</span>
                                </div>
                                <div className="absolute top-0 right-0 -mr-2 -mt-2 text-red-500 animate-pulse">★</div>
                            </div>
                            <div className="text-[10px] text-red-400 mt-1 uppercase font-bold text-center max-w-[150px]">
                                Limit: Zero Fuel Mass (2.5g Load Factor calc)
                            </div>
                        </div>
                    </div>

                    {/* Convergence to TOM */}
                    <div className="w-full h-8 flex justify-center items-end space-x-32 text-slate-600">
                        <ArrowDown />
                        <ArrowDown />
                    </div>

                    <div className="text-xs text-slate-400 text-center uppercase font-bold">
                        (OM + Traffic) OR (ZFM + Take-off Fuel)
                    </div>

                    {/* TOM */}
                    <div className="relative group">
                        <div className="w-48 h-24 bg-yellow-400 border-4 border-yellow-600 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(250,204,21,0.3)]">
                            <span className="text-3xl font-black text-slate-900">TOM</span>
                        </div>
                        <div className="absolute top-0 right-0 -mr-3 -mt-3 text-red-500 animate-pulse text-2xl">★</div>
                        <div className="hidden group-hover:block absolute left-full ml-4 top-0 bg-slate-800 p-2 rounded text-xs w-64 border border-slate-600 z-10">
                            <strong>Take-Off Mass:</strong> Absolute mass at brake release. Limited by Runways, Climb Performance, and Structure.
                        </div>
                    </div>

                    <ArrowDown className="text-slate-500" />
                    <div className="text-xs text-slate-400 text-center uppercase font-bold">
                        - Trip Fuel (Burn)
                    </div>
                    <ArrowDown className="text-slate-500" />

                    {/* LM */}
                    <div className="relative group">
                        <div className="w-48 h-24 bg-yellow-400 border-4 border-yellow-600 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(250,204,21,0.3)]">
                            <span className="text-3xl font-black text-slate-900">LM</span>
                        </div>
                        <div className="absolute top-0 right-0 -mr-3 -mt-3 text-red-500 animate-pulse text-2xl">★</div>
                        <div className="hidden group-hover:block absolute left-full ml-4 top-0 bg-slate-800 p-2 rounded text-xs w-64 border border-slate-600 z-10">
                            <strong>Landing Mass:</strong> Mass at touchdown. Includes Reserves + Alternate + Contingency.
                        </div>
                    </div>

                    {/* Taxi Mass */}
                    <div className="absolute bottom-20 -left-48 hidden md:flex flex-col items-center">
                        <div className="text-xs text-orange-400 font-bold mb-1">RAMP / BLOCK MASS</div>
                        <div className="w-32 h-16 bg-orange-400 border-4 border-orange-600 rounded-lg flex items-center justify-center">
                            <span className="text-xl font-black text-slate-900">TAXI</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1 uppercase w-32 text-center">
                            TOM + Start & Taxi Fuel
                        </div>
                    </div>


                </div>

                {/* Useful Load Overlay (Center) */}
                <div className="absolute top-[280px] left-1/2 -translate-x-1/2 bg-sky-900/80 border-2 border-sky-400 p-2 rounded text-center text-sky-100 text-sm font-bold backdrop-blur-sm w-32 hidden md:block">
                    Useful Load
                    <div className="text-[10px] font-normal opacity-80">Traffic + Fuel</div>
                </div>

            </div>

            <div className="mt-12 p-4 bg-slate-900 rounded-lg text-center text-slate-400 text-sm">
                <p> <span className="text-red-500 font-bold">★</span> = Structural Limit applies (MZFM, MTOM, MLM).</p>
                <p className="mt-2 text-xs opacity-70">
                    "The statement ALWAYS CORRECT, due to the ONLY MASS CHANGE, is the FUEL CONSUMPTION."
                </p>
            </div>
        </div>
    );
};

export default MassBuildUpFlow;
