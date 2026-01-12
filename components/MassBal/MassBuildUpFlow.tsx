import React from 'react';
import { ArrowDown, ArrowRight, Info, Plane } from 'lucide-react';

const MassBuildUpFlow: React.FC = () => {
    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto animate-in fade-in duration-500 bg-slate-950/50 rounded-3xl border border-slate-800/50 backdrop-blur-sm">
            {/* Header */}
            <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-full mb-4">
                    <Plane className="w-8 h-8 text-indigo-400" />
                </div>
                <h1 className="text-4xl font-black text-white tracking-tight uppercase mb-2">
                    Definitions & Flow <span className="text-indigo-400">Diagram</span>
                </h1>
                <p className="text-slate-400 font-mono">Visualizing the accumulation of aircraft mass from Empty to Landing.</p>
            </div>

            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col items-center">

                    {/* STEP 1: BEM */}
                    <div className="relative z-10">
                        <div className="w-56 h-28 bg-slate-900 border-2 border-slate-700 hover:border-indigo-500 transition-colors rounded-2xl flex flex-col items-center justify-center shadow-2xl group">
                            <span className="text-3xl font-black text-white mb-1">BEM</span>
                            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold group-hover:text-indigo-400">Basic Empty Mass</span>
                        </div>
                    </div>

                    {/* Connector */}
                    <div className="h-12 w-px bg-slate-700 relative">
                        <div className="absolute top-1/2 left-4 w-48 text-[10px] text-slate-500 uppercase font-bold transform -translate-y-1/2">
                            + Crew, Pantry, Fluids
                        </div>
                    </div>

                    {/* STEP 2: DOM */}
                    <div className="relative z-10 w-full flex justify-center">
                        <div className="w-56 h-28 bg-yellow-400 border-4 border-yellow-500 rounded-2xl flex flex-col items-center justify-center shadow-[0_0_30px_rgba(250,204,21,0.2)] transform hover:scale-105 transition-transform">
                            <span className="text-3xl font-black text-slate-900 mb-1">DOM</span>
                            <span className="text-[10px] uppercase tracking-widest text-slate-800 font-bold">Dry Operating Mass</span>
                        </div>
                    </div>

                    {/* Split Paths */}
                    <div className="w-full grid grid-cols-2 gap-8 mt-8 relative">

                        {/* Connecting Lines for Split */}
                        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30" style={{ zIndex: 0 }}>
                            {/* Center Down Split */}
                            <path d="M 448 0 L 448 40 L 220 40 L 220 80" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400" />
                            <path d="M 448 0 L 448 40 L 676 40 L 676 80" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400" />

                            {/* Merge back to TOM */}
                            <path d="M 220 200 L 220 250 L 448 250 L 448 280" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400" />
                            <path d="M 676 200 L 676 250 L 448 250 L 448 280" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400" />
                        </svg>

                        {/* Left Path: DOM + TO Fuel = OM */}
                        <div className="flex flex-col items-center pt-20">
                            <div className="uppercase text-[10px] font-bold text-slate-400 mb-2 bg-slate-900 px-2 py-1 rounded border border-slate-800 z-10">
                                + Take-off Fuel
                            </div>
                            <div className="w-48 h-24 bg-slate-800 border-2 border-slate-600 rounded-xl flex flex-col items-center justify-center relative z-10">
                                <span className="text-2xl font-black text-slate-300">OM</span>
                                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Operating Mass</span>
                            </div>
                        </div>

                        {/* Right Path: DOM + Traffic = ZFM */}
                        <div className="flex flex-col items-center pt-20">
                            <div className="uppercase text-[10px] font-bold text-slate-400 mb-2 bg-slate-900 px-2 py-1 rounded border border-slate-800 z-10">
                                + Traffic Load
                            </div>
                            <div className="w-48 h-24 bg-amber-500 border-4 border-red-500 rounded-xl flex flex-col items-center justify-center relative z-10 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                                <span className="text-2xl font-black text-slate-900">ZFM</span>
                                <span className="text-[10px] uppercase tracking-widest text-slate-900 font-bold">Zero Fuel Mass</span>
                                <div className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-lg">L</div>
                            </div>
                        </div>
                    </div>

                    {/* Useful Load Overlay - Spanning center */}
                    <div className="mt-8 mb-12 bg-sky-500/10 border border-sky-500/30 text-sky-400 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md z-20">
                        Useful Load = Traffic + Take-off Fuel
                    </div>

                    {/* TOM Section with Taxi Mass Connected */}
                    <div className="w-full flex justify-center items-center gap-8 relative mt-4">

                        {/* Ramp/Taxi Side Box */}
                        <div className="hidden md:flex flex-col items-center absolute left-[15%] top-1/2 -translate-y-1/2">
                            <div className="w-32 h-16 bg-orange-500/20 border-2 border-orange-500 border-dashed rounded-lg flex flex-col items-center justify-center mb-2">
                                <span className="text-lg font-bold text-orange-400">RAMP</span>
                                <span className="text-[9px] uppercase text-orange-300">Block Mass</span>
                            </div>
                            <ArrowRight className="text-orange-500 rotate-90 md:rotate-0" />
                            <div className="text-[9px] text-orange-400 font-bold uppercase mt-1">- Start/Taxi Fuel</div>
                        </div>

                        {/* Connector line for Ramp to TOM (horizontal) */}
                        <div className="hidden md:block absolute left-[26%] right-[50%] top-1/2 h-0.5 bg-orange-500/30 -z-10"></div>

                        {/* TOM */}
                        <div className="w-56 h-28 bg-yellow-400 border-4 border-yellow-500 rounded-2xl flex flex-col items-center justify-center shadow-[0_0_30px_rgba(250,204,21,0.2)] relative z-10">
                            <span className="text-3xl font-black text-slate-900 mb-1">TOM</span>
                            <span className="text-[10px] uppercase tracking-widest text-slate-800 font-bold">Take-Off Mass</span>
                            <div className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-lg">L</div>
                        </div>
                    </div>

                    {/* Connector */}
                    <div className="h-16 w-px bg-slate-700 relative">
                        <div className="absolute top-1/2 left-4 w-48 text-[10px] text-slate-500 uppercase font-bold transform -translate-y-1/2">
                            - Trip Fuel
                        </div>
                    </div>

                    {/* LM */}
                    <div className="relative z-10 mb-12">
                        <div className="w-56 h-28 bg-yellow-400 border-4 border-yellow-500 rounded-2xl flex flex-col items-center justify-center shadow-[0_0_30px_rgba(250,204,21,0.2)] group">
                            <span className="text-3xl font-black text-slate-900 mb-1">LM</span>
                            <span className="text-[10px] uppercase tracking-widest text-slate-800 font-bold">Landing Mass</span>
                            <div className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-lg">L</div>
                        </div>
                    </div>

                </div>
            </div>

            <div className="mt-8 flex justify-center gap-6 text-xs text-slate-500 font-mono">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-400 rounded border border-yellow-600"></div>
                    <span>Regulated Mass</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-amber-500 rounded border border-red-500"></div>
                    <span>Structural Limit</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full text-white flex items-center justify-center text-[8px] font-bold">L</div>
                    <span>Limiting Mass</span>
                </div>
            </div>
        </div>
    );
};

export default MassBuildUpFlow;
