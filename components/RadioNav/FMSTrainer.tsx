import React, { useState } from 'react';
import { View } from '../../types';
import { ArrowLeft, Monitor, Divide } from 'lucide-react';

interface Props {
    onNavigate?: (view: View) => void;
}

const FMSTrainer: React.FC<Props> = ({ onNavigate }) => {
    const [page, setPage] = useState<'INIT' | 'RTE' | 'LEGS' | 'PROG'>('INIT');
    const [scratchpad, setScratchpad] = useState<string>('');

    const handleKey = (key: string) => {
        if (scratchpad.length < 10) {
            setScratchpad(prev => prev + key);
        }
    };

    const clearScratchpad = () => {
        if (scratchpad.length > 0) {
            setScratchpad(prev => prev.slice(0, -1));
        }
    };

    // Line Select Key (LSK) Handlers (Mock)
    const handleLSK = (side: 'L' | 'R', index: number) => {
        // Simple mock interaction
        if (scratchpad) {
            // "Enter" data
            setScratchpad(''); // Consume
        } else {
            // "Copy" data to scratchpad (if implemented)
        }
    };

    const renderScreen = () => {
        switch (page) {
            case 'INIT':
                return (
                    <div className="text-green-500 font-mono text-xs md:text-sm leading-6">
                        <div className="flex justify-between text-white border-b border-white/20 mb-2"><span>INIT/REF INDEX</span><span>1/1</span></div>
                        <div className="flex justify-between"><span>&lt;IDENT</span><span></span></div>
                        <div className="flex justify-between"><span>&lt;POS</span><span>PERF&gt;</span></div>
                        <div className="flex justify-between"><span></span><span></span></div>
                        <div className="flex justify-between"><span>&lt;IRS MONITOR</span><span>MAINT&gt;</span></div>
                    </div>
                );
            case 'RTE':
                return (
                    <div className="text-green-500 font-mono text-xs md:text-sm leading-6">
                        <div className="flex justify-between text-white border-b border-white/20 mb-2"><span>RTE 1</span><span>1/2</span></div>
                        <div className="flex justify-between"><span className="text-xs text-white">ORIGIN</span><span className="text-xs text-white">DEST</span></div>
                        <div className="flex justify-between"><span>EGLL</span><span>LFPG</span></div>
                        <div className="flex justify-between"><span className="text-xs text-white">RUNWAY</span><span className="text-xs text-white">FLT NO</span></div>
                        <div className="flex justify-between"><span>27R</span><span>BA304</span></div>
                        <div className="flex justify-between mt-2"><span className="text-xs text-white">ROUTE</span><span className="text-xs text-white">ACTIVATE&gt;</span></div>
                    </div>
                );
            case 'LEGS':
                return (
                    <div className="text-green-500 font-mono text-xs md:text-sm leading-6">
                        <div className="flex justify-between text-white border-b border-white/20 mb-2"><span>ACT RTE 1 LEGS</span><span>1/3</span></div>
                        <div className="flex justify-between text-xs text-white"><span></span><span>DIST</span></div>
                        <div className="flex justify-between"><span>DET</span><span>15NM</span></div>
                        <div className="flex justify-between"><span>DVR</span><span>32NM</span></div>
                        <div className="flex justify-between"><span>COC</span><span>18NM</span></div>
                        <div className="flex justify-between"><span>KOK</span><span>25NM</span></div>
                    </div>
                );
            default: return <div></div>;
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => onNavigate?.(View.RAD_NAV_HOME)}
                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="flex items-center gap-2">
                    <Monitor className="text-slate-400" />
                    <h1 className="text-2xl font-bold text-slate-100">FMS CDU Trainer</h1>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">

                {/* CDU Unit */}
                <div className="bg-[#1a1a1a] p-4 rounded-xl border-4 border-[#2a2a2a] shadow-2xl max-w-sm mx-auto">
                    {/* Screen */}
                    <div className="flex gap-1 mb-4">
                        {/* Left LSKs */}
                        <div className="flex flex-col justify-start pt-12 gap-5">
                            {[1, 2, 3, 4, 5, 6].map(i => <button key={`L${i}`} onClick={() => handleLSK('L', i)} className="w-6 h-4 bg-black border border-gray-600 rounded-sm hover:bg-gray-800"></button>)}
                        </div>

                        {/* Display Area */}
                        <div className="flex-1 bg-black border-[3px] border-gray-700/50 rounded-lg h-64 p-3 relative overflow-hidden">
                            {renderScreen()}

                            {/* Scratchpad (Bottom Line) */}
                            <div className="absolute bottom-1 left-2 text-white font-mono text-sm font-bold min-h-[1.5em] w-full">
                                {scratchpad || <span className="opacity-0">_</span>}
                            </div>
                            {scratchpad && <div className="absolute bottom-1 left-2 ml-[calc(scratchpad.length*0.6em)] h-4 w-2 bg-green-500/50 animate-pulse"></div>}
                        </div>

                        {/* Right LSKs */}
                        <div className="flex flex-col justify-start pt-12 gap-5">
                            {[1, 2, 3, 4, 5, 6].map(i => <button key={`R${i}`} onClick={() => handleLSK('R', i)} className="w-6 h-4 bg-black border border-gray-600 rounded-sm hover:bg-gray-800"></button>)}
                        </div>
                    </div>

                    {/* Keyboard / Function Keys */}
                    <div className="space-y-4 px-2">
                        {/* Mode Keys */}
                        <div className="grid grid-cols-6 gap-2">
                            <button onClick={() => setPage('INIT')} className="col-span-1 bg-[#111] text-xs font-bold text-white py-2 border border-gray-700 rounded hover:bg-gray-800">INIT</button>
                            <button onClick={() => setPage('RTE')} className="col-span-1 bg-[#111] text-xs font-bold text-white py-2 border border-gray-700 rounded hover:bg-gray-800">RTE</button>
                            <button className="col-span-1 bg-[#111] text-xs font-bold text-white py-2 border border-gray-700 rounded hover:bg-gray-800">CLB</button>
                            <button className="col-span-1 bg-[#111] text-xs font-bold text-white py-2 border border-gray-700 rounded hover:bg-gray-800">CRZ</button>
                            <button className="col-span-1 bg-[#111] text-xs font-bold text-white py-2 border border-gray-700 rounded hover:bg-gray-800">DES</button>
                            <button className="col-span-1 bg-[#111] text-xs font-bold text-white py-2 border border-gray-700 rounded hover:bg-gray-800">MENU</button>

                            <button onClick={() => setPage('LEGS')} className="col-span-1 bg-[#111] text-xs font-bold text-white py-2 border border-gray-700 rounded hover:bg-gray-800">LEGS</button>
                            <button className="col-span-1 bg-[#111] text-xs font-bold text-white py-2 border border-gray-700 rounded hover:bg-gray-800">DEP</button>
                            <button className="col-span-1 bg-[#111] text-xs font-bold text-white py-2 border border-gray-700 rounded hover:bg-gray-800">HOLD</button>
                            <button onClick={() => setPage('PROG')} className="col-span-1 bg-[#111] text-xs font-bold text-white py-2 border border-gray-700 rounded hover:bg-gray-800">PROG</button>
                            <button className="col-span-1 bg-[#111] text-xs font-bold text-white py-2 border border-gray-700 rounded hover:bg-gray-800">EXEC</button>
                        </div>

                        {/* Alpha Numeric */}
                        <div className="grid grid-cols-5 gap-2 pb-4">
                            {['1', '2', '3', 'A', 'B', 'C', 'D', 'E', 'F', 'G'].concat(['4', '5', '6', 'H', 'I', 'J', 'K', 'L', 'M', 'N']).concat(['7', '8', '9', 'O', 'P', 'Q', 'R', 'S', 'T', 'U']).concat(['.', '0', '+/-', 'V', 'W', 'X', 'Y', 'Z', 'SP', 'DEL']).map(k => (
                                <button
                                    key={k}
                                    onClick={() => k === 'DEL' ? clearScratchpad() : handleKey(k)}
                                    className={`text-[10px] font-bold py-2 rounded border border-gray-800 hover:bg-gray-700 ${!isNaN(parseInt(k)) ? 'bg-[#222] text-white' : 'bg-[#151515] text-gray-300'}`}
                                >
                                    {k}
                                </button>
                            ))}
                            <button onClick={() => clearScratchpad()} className="col-span-1 text-[10px] font-bold py-2 rounded bg-[#151515] text-red-400 border border-gray-800 hover:bg-gray-700">CLR</button>
                            <button className="col-span-1 text-[10px] font-bold py-2 rounded bg-[#151515] text-white border border-gray-800 hover:bg-gray-700">/</button>
                        </div>
                    </div>
                </div>

                {/* Info & Guide */}
                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-xl">
                        <h3 className="text-sm font-bold text-white mb-4">CDU / MCDU</h3>
                        <p className="text-sm text-slate-300 mb-4">
                            The Control Display Unit (CDU) or Multifunction Control Display Unit (MCDU) is the primary interface for the Flight Management System (FMS).
                        </p>
                        <ul className="space-y-2 text-xs text-slate-400 list-disc pl-4">
                            <li><strong>INIT:</strong> Initialization (Position, Weights, Performance).</li>
                            <li><strong>RTE:</strong> Route entry (Origin, Dest, Airways).</li>
                            <li><strong>LEGS:</strong> Waypoint-by-waypoint detail with distances and restrictions.</li>
                        </ul>
                    </div>

                    <div className="p-4 bg-slate-800 rounded border border-slate-700 text-xs text-slate-400 italic">
                        Use the keypad to type into the scratchpad. Click LSKs (Line Select Keys) to move data.<br />
                        (Simulation limited: Visual Only)
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FMSTrainer;
