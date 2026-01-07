import React, { useState } from 'react';
import { View } from '../../types';
import { ArrowLeft, Send, RadioReceiver, ShieldAlert } from 'lucide-react';

interface Props {
    onNavigate?: (view: View) => void;
}

const SSRTransponder: React.FC<Props> = ({ onNavigate }) => {
    const [code, setCode] = useState('7000');
    const [mode, setMode] = useState<'STBY' | 'ON' | 'ALT'>('STBY');
    const [ident, setIdent] = useState(false);
    const [inputBuffer, setInputBuffer] = useState('');

    const handleKey = (key: string) => {
        if (inputBuffer.length < 4) {
            const newBuffer = inputBuffer + key;
            setInputBuffer(newBuffer);
            if (newBuffer.length === 4) {
                setCode(newBuffer);
                setInputBuffer('');
            }
        }
    };

    const handleClear = () => {
        setInputBuffer('');
    };

    const handleIdent = () => {
        setIdent(true);
        setTimeout(() => setIdent(false), 5000); // IDENT lasts 18 seconds in real life, 5s for demo
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
                    <RadioReceiver className="text-orange-500" />
                    <h1 className="text-2xl font-bold text-slate-100">SSR Transponder</h1>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">

                {/* Transponder Unit (UI) */}
                <div className="bg-slate-800 p-1 rounded-xl shadow-2xl border-4 border-slate-900 w-full max-w-md mx-auto">
                    {/* Bezel */}
                    <div className="bg-neutral-800 rounded-lg p-6 space-y-6">

                        {/* Display */}
                        <div className="bg-black border-2 border-slate-700 rounded p-4 flex justify-between items-center h-24">
                            <div className="space-y-1">
                                <span className="text-xs text-orange-500 font-mono block">MODE {mode}</span>
                                {ident && <span className="text-xs text-white bg-orange-600 px-1 rounded animate-pulse">IDENT</span>}
                                {mode === 'ALT' && <span className="text-xs text-green-500 font-mono block mt-1">FL 320</span>}
                            </div>
                            <div className="text-5xl font-mono text-orange-500 tracking-widest text-shadow-glow">
                                {inputBuffer.padEnd(4, '_')}
                                {/* Show code if no buffer, else buffer */}
                                {inputBuffer === '' && code}
                            </div>
                        </div>

                        {/* Knobs / Mode Selector */}
                        <div className="flex justify-between items-center bg-neutral-900/50 p-2 rounded-lg border border-white/5">
                            <div className="flex gap-2">
                                <button onClick={() => setMode('STBY')} className={`px-2 py-1 text-xs font-bold rounded ${mode === 'STBY' ? 'bg-orange-600 text-white' : 'bg-neutral-700 text-neutral-400'}`}>STBY</button>
                                <button onClick={() => setMode('ON')} className={`px-2 py-1 text-xs font-bold rounded ${mode === 'ON' ? 'bg-orange-600 text-white' : 'bg-neutral-700 text-neutral-400'}`}>ON</button>
                                <button onClick={() => setMode('ALT')} className={`px-2 py-1 text-xs font-bold rounded ${mode === 'ALT' ? 'bg-orange-600 text-white' : 'bg-neutral-700 text-neutral-400'}`}>ALT</button>
                            </div>
                            <button
                                onClick={handleIdent}
                                className={`px-3 py-1 rounded bg-neutral-700 border border-neutral-600 text-xs font-bold ${ident ? 'bg-white text-orange-600' : 'text-neutral-400'}`}
                            >
                                IDENT
                            </button>
                        </div>

                        {/* Keypad */}
                        <div className="grid grid-cols-4 gap-2">
                            {[0, 1, 2, 3, 4, 5, 6, 7].map(num => (
                                <button
                                    key={num}
                                    onClick={() => handleKey(num.toString())}
                                    className="aspect-square bg-neutral-700 rounded shadow-lg border-b-4 border-neutral-900 active:border-b-0 active:translate-y-1 transition-all text-xl font-bold text-white hover:bg-neutral-600"
                                >
                                    {num}
                                </button>
                            ))}
                        </div>

                        <div className="flex justify-between gap-2">
                            <button onClick={handleClear} className="flex-1 py-2 bg-red-900/50 text-red-200 text-xs font-bold rounded border border-red-900 hover:bg-red-900">CLR</button>
                            <button onClick={() => setCode('7000')} className="flex-1 py-2 bg-green-900/50 text-green-200 text-xs font-bold rounded border border-green-900 hover:bg-green-900">VFR</button>
                        </div>

                    </div>
                </div>

                {/* Theory Visualization */}
                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-xl">
                        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Send size={16} /> Interrogation Simulation</h3>

                        <div className="relative h-40 bg-slate-900 rounded-lg border border-slate-700 overflow-hidden p-4">
                            {/* Ground Station */}
                            <div className="absolute left-4 bottom-4 w-8 h-8 bg-blue-600 rounded-t-full"></div>
                            <div className="absolute left-4 bottom-0 text-xs text-blue-400">SSR</div>

                            {/* Aircraft */}
                            <div className="absolute right-4 top-4 w-8 h-4 bg-white rounded-full"></div>
                            <div className="absolute right-4 top-0 text-xs text-white">XPDR</div>

                            {/* Waves */}
                            {mode !== 'STBY' && (
                                <>
                                    {/* Interrogation (Up) */}
                                    <div className="absolute left-8 bottom-8 w-2 h-2 bg-blue-400 rounded-full animate-[ping_2s_linear_infinite]"></div>
                                    <div className="absolute left-10 bottom-10 text-[10px] text-blue-400 animate-[pulse_2s_linear_infinite]">
                                        Rate: 1030 MHz (Who are you?)
                                    </div>

                                    {/* Reply (Down) */}
                                    <div className="absolute right-8 top-8 w-2 h-2 bg-orange-400 rounded-full animate-[ping_2s_linear_infinite_1s]"></div>
                                    <div className="absolute right-10 top-10 text-[10px] text-orange-400 animate-[pulse_2s_linear_infinite_1s] text-right">
                                        Rate: 1090 MHz<br />
                                        Code: {code}<br />
                                        {mode === 'ALT' && "Alt: FL320 (Mode C)"}<br />
                                        {ident && "SPI (Special Pulse Identifier)"}
                                    </div>
                                </>
                            )}

                            {mode === 'STBY' && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm text-slate-400 text-sm font-bold">
                                    TRANSPONDER STANDBY
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-xl">
                        <h3 className="text-sm font-bold text-white mb-3">Special Codes</h3>
                        <div className="space-y-2">
                            <div className={`p-2 rounded border ${code === '7700' ? 'bg-red-600 text-white border-red-400 animate-pulse' : 'bg-slate-900 text-slate-400 border-slate-800'}`}>
                                <div className="font-mono font-bold">7700</div>
                                <div className="text-xs">Emergency (General)</div>
                            </div>
                            <div className={`p-2 rounded border ${code === '7600' ? 'bg-orange-600 text-white border-orange-400 animate-pulse' : 'bg-slate-900 text-slate-400 border-slate-800'}`}>
                                <div className="font-mono font-bold">7600</div>
                                <div className="text-xs">Radio Failure (Lost Comms)</div>
                            </div>
                            <div className={`p-2 rounded border ${code === '7500' ? 'bg-yellow-600 text-white border-yellow-400 animate-pulse' : 'bg-slate-900 text-slate-400 border-slate-800'}`}>
                                <div className="font-mono font-bold">7500</div>
                                <div className="text-xs">Unlawful Interference (Hijack)</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SSRTransponder;
