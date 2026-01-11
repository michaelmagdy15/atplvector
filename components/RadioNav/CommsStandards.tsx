import React, { useState } from 'react';
import { Settings, Info } from 'lucide-react';

const CommsStandards: React.FC = () => {
    // ITU CODE STATE
    const [modType, setModType] = useState('A');
    const [sigType, setSigType] = useState('3');
    const [infoType, setInfoType] = useState('E');

    const ituCodes = {
        first: {
            'N': 'Unmodulated carrier',
            'A': 'Double sideband (AM)',
            'H': 'Single sideband, full carrier',
            'R': 'Single sideband, reduced carrier',
            'J': 'Single sideband, suppressed carrier',
            'F': 'Frequency modulation (FM)',
            'G': 'Phase modulation',
            'P': 'Pulse (unmodulated)',
        },
        second: {
            '0': 'No modulating signal',
            '1': 'Digital, no modulation',
            '2': 'Digital, with modulation',
            '3': 'Analog (Single Channel)',
            '7': 'Multichannel digital',
            '8': 'Multichannel analog',
            'X': 'Other cases'
        },
        third: {
            'N': 'No information',
            'A': 'Telegraphy (Aural)',
            'B': 'Telegraphy (Electronic)',
            'E': 'Telephony (Voice)',
            'F': 'Television (Video)',
            'W': 'Combination'
        }
    };

    const commonCodes = [
        { code: 'A3E', desc: 'VHF Comms (AM Voice)' },
        { code: 'J3E', desc: 'HF Comms (SSB Voice)' },
        { code: 'A1A', desc: 'NDB Ident (CW Morse)' },
        { code: 'NON', desc: 'NDB/VOR Carrier Only' },
        { code: 'A2A', desc: 'NDB Ident (Modulated)' },
        { code: 'F3E', desc: 'FM Radio / Marine Band' },
    ];

    return (
        <div className="space-y-8">
            {/* AM vs FM Section */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 p-6 rounded-xl border border-white/5">
                    <h3 className="text-lg font-bold text-sky-400 mb-4 flex items-center gap-2">
                        <span className="bg-sky-500/20 p-1 rounded">AM</span> Amplitude Modulation
                    </h3>
                    <ul className="space-y-3 text-sm text-slate-300">
                        <li className="flex gap-2">
                            <span className="text-green-400 font-bold">✓</span>
                            <span>Narrow Bandwidth (allows more channels).</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-green-400 font-bold">✓</span>
                            <span>Simpler, Cheaper circuitry.</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-green-400 font-bold">✓</span>
                            <span>"Heterodyne" whistle warns of blocked channel.</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-red-400 font-bold">✗</span>
                            <span>Susceptible to static (thunderstorms).</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-red-400 font-bold">✗</span>
                            <span>Wasted power in Carrier and duplicate Sideband.</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-slate-800/50 p-6 rounded-xl border border-white/5">
                    <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
                        <span className="bg-emerald-500/20 p-1 rounded">FM</span> Frequency Modulation
                    </h3>
                    <ul className="space-y-3 text-sm text-slate-300">
                        <li className="flex gap-2">
                            <span className="text-green-400 font-bold">✓</span>
                            <span>Immune to static/amplitude noise.</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-green-400 font-bold">✓</span>
                            <span>Higher audio quality.</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-red-400 font-bold">✗</span>
                            <span>Wide Bandwidth (fewer channels).</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-red-400 font-bold">✗</span>
                            <span><strong>Capture Effect:</strong> Strong signal kills weak one instantly. No warning overlap.</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-red-400 font-bold">✗</span>
                            <span>Requires Line of Sight.</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* ITU Decoder */}
            <div className="glass-panel p-6 rounded-xl border border-indigo-500/30 shadow-lg shadow-indigo-900/20">
                <div className="flex items-center gap-3 mb-6">
                    <Settings className="text-indigo-400" />
                    <h3 className="text-xl font-bold text-white">ITU Classification Decoder</h3>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-8">
                    {/* Selectors */}
                    <div className="space-y-2">
                        <label className="text-xs text-slate-400 font-bold uppercase">1. Modulation</label>
                        <select
                            value={modType}
                            onChange={(e) => setModType(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 outline-none"
                        >
                            {Object.entries(ituCodes.first).map(([k, v]) => (
                                <option key={k} value={k}>{k} - {v}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-slate-400 font-bold uppercase">2. Signal</label>
                        <select
                            value={sigType}
                            onChange={(e) => setSigType(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 outline-none"
                        >
                            {Object.entries(ituCodes.second).map(([k, v]) => (
                                <option key={k} value={k}>{k} - {v}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-slate-400 font-bold uppercase">3. Info</label>
                        <select
                            value={infoType}
                            onChange={(e) => setInfoType(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 outline-none"
                        >
                            {Object.entries(ituCodes.third).map(([k, v]) => (
                                <option key={k} value={k}>{k} - {v}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Result */}
                <div className="bg-gradient-to-r from-indigo-900/50 to-slate-900 p-6 rounded-2xl border border-indigo-500/20 text-center">
                    <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2 tracking-widest">
                        {modType}{sigType}{infoType}
                    </div>
                    <div className="text-xl text-white font-medium">
                        {ituCodes.first[modType as keyof typeof ituCodes.first]} <br />
                        <span className="text-indigo-300">+</span> <br />
                        {ituCodes.second[sigType as keyof typeof ituCodes.second]} <br />
                        <span className="text-indigo-300">+</span> <br />
                        {ituCodes.third[infoType as keyof typeof ituCodes.third]}
                    </div>
                </div>

                {/* Common Presets */}
                <div className="mt-6 pt-6 border-t border-white/5">
                    <p className="text-xs text-slate-500 mb-3 font-bold uppercase">Quick Lookups</p>
                    <div className="flex flex-wrap gap-2">
                        {commonCodes.map(c => (
                            <button
                                key={c.code}
                                onClick={() => {
                                    setModType(c.code[0]);
                                    setSigType(c.code[1]);
                                    setInfoType(c.code[2]);
                                }}
                                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-xs text-slate-300 transition-colors"
                            >
                                <span className="text-white font-bold mr-1">{c.code}</span> {c.desc}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommsStandards;
