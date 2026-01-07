import React, { useState } from 'react';
import { View } from '../../types';
import { ArrowLeft, Radio, Search } from 'lucide-react';

interface Props {
    onNavigate?: (view: View) => void;
}

const SpectrumExplorer: React.FC<Props> = ({ onNavigate }) => {
    const [selectedBand, setSelectedBand] = useState<string | null>(null);

    const bands = [
        { id: 'VLF', name: 'Very Low Frequency', range: '3 - 30 kHz', use: 'Long range comms, Submarine', aviation: 'Not typically used', color: 'bg-red-500' },
        { id: 'LF', name: 'Low Frequency', range: '30 - 300 kHz', use: 'NDB (Non-Directional Beacon)', aviation: 'NDB Loctr', color: 'bg-orange-500' },
        { id: 'MF', name: 'Medium Frequency', range: '300 - 3000 kHz', use: 'AM Radio, NDB', aviation: 'NDB (Locator)', color: 'bg-amber-500' },
        { id: 'HF', name: 'High Frequency', range: '3 - 30 MHz', use: 'Long Range Aviation Comms', aviation: 'Oceanic Comms (Skywave)', color: 'bg-yellow-500' },
        { id: 'VHF', name: 'Very High Frequency', range: '30 - 300 MHz', use: 'VOR, ILS, Comms', aviation: 'Voice Comms (118-137), VOR (108-117.975)', color: 'bg-lime-500' },
        { id: 'UHF', name: 'Ultra High Frequency', range: '300 - 3000 MHz', use: 'DME, SSR, GPS', aviation: 'DME, Transponder, GNSS (L1, L2)', color: 'bg-green-500' },
        { id: 'SHF', name: 'Super High Frequency', range: '3 - 30 GHz', use: 'Radar, SatCom', aviation: 'Weather Radar, Radio Altimeter', color: 'bg-teal-500' },
        { id: 'EHF', name: 'Extremely High Frequency', range: '30 - 300 GHz', use: 'Experimental, Satellites', aviation: 'Future comms', color: 'bg-cyan-500' },
    ];

    return (
        <div className="max-w-6xl mx-auto p-4 space-y-8">
            {/* Header */}
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => onNavigate?.(View.RAD_NAV_HOME)}
                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
                        <Radio className="text-sky-400" />
                        Radio Frequency Spectrum
                    </h1>
                    <p className="text-slate-400 text-sm">Aviation frequency bands and their applications</p>
                </div>
            </div>

            {/* Visual Spectrum Bar */}
            <div className="glass-panel p-8 rounded-2xl overflow-x-auto">
                <div className="min-w-[800px] flex items-stretch h-32 rounded-xl overflow-hidden shadow-2xl">
                    {bands.map((band) => (
                        <div
                            key={band.id}
                            onClick={() => setSelectedBand(band.id)}
                            className={`flex-1 ${band.color} relative group cursor-pointer transition-all duration-300 hover:flex-[1.5] flex flex-col items-center justify-center p-2 border-r border-white/10`}
                        >
                            <span className="text-black/60 font-black text-xl mb-1">{band.id}</span>
                            <span className="text-[10px] text-black/70 font-bold bg-white/20 px-2 py-0.5 rounded-full whitespace-nowrap opacity-60 group-hover:opacity-100 transition-opacity">
                                {band.range}
                            </span>

                            {selectedBand === band.id && (
                                <div className="absolute inset-0 bg-white/20 border-4 border-white animate-pulse"></div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-slate-500 font-mono">
                    <span>Low Frequency (Long Wavelength)</span>
                    <span>High Frequency (Short Wavelength)</span>
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bands.map((band) => (
                    <div
                        key={band.id}
                        className={`transition-all duration-500 ${selectedBand === band.id
                            ? 'bg-slate-800 border-sky-500/50 scale-[1.02] shadow-sky-500/10 shadow-xl'
                            : selectedBand ? 'opacity-50 blur-sm scale-95' : 'bg-slate-900 border-slate-700 hover:border-slate-600'} 
                            border rounded-xl p-5 cursor-pointer`}
                        onClick={() => setSelectedBand(selectedBand === band.id ? null : band.id)}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <span className={`w-3 h-3 rounded-full ${band.color}`}></span>
                                    {band.id} - {band.name}
                                </h3>
                                <span className="text-xs font-mono text-sky-400 mt-1 block">{band.range}</span>
                            </div>
                            {selectedBand === band.id && (
                                <span className="text-xs bg-sky-500 text-white px-2 py-1 rounded font-bold">ACTIVE</span>
                            )}
                        </div>

                        <div className="space-y-3">
                            <div className="bg-slate-950/50 p-3 rounded-lg">
                                <span className="text-xs text-slate-500 uppercase tracking-wider font-bold block mb-1">General Use</span>
                                <p className="text-sm text-slate-300">{band.use}</p>
                            </div>

                            <div className="bg-blue-900/10 border border-blue-500/20 p-3 rounded-lg">
                                <span className="text-xs text-blue-400 uppercase tracking-wider font-bold block mb-1 flex items-center gap-2">
                                    <Radio size={12} /> Aviation Application
                                </span>
                                <p className="text-sm text-blue-100 font-medium">{band.aviation}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Aviation Ref Table */}
            <div className="glass-panel p-6 rounded-xl">
                <h2 className="text-xl font-bold text-white mb-4">Common Aviation Frequencies</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
                            <tr>
                                <th className="px-4 py-3 rounded-l-lg">System</th>
                                <th className="px-4 py-3">Band</th>
                                <th className="px-4 py-3">Frequency Range</th>
                                <th className="px-4 py-3 rounded-r-lg">Notes</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-300">
                            <tr className="border-b border-slate-800 hover:bg-slate-800/30">
                                <td className="px-4 py-3 font-medium text-white">NDB</td>
                                <td className="px-4 py-3"><span className="text-amber-400">LF / MF</span></td>
                                <td className="px-4 py-3">190 - 1750 kHz</td>
                                <td className="px-4 py-3">Subject to Night Effect & Coastal Refraction</td>
                            </tr>
                            <tr className="border-b border-slate-800 hover:bg-slate-800/30">
                                <td className="px-4 py-3 font-medium text-white">VOR</td>
                                <td className="px-4 py-3"><span className="text-lime-400">VHF</span></td>
                                <td className="px-4 py-3">108.00 - 117.975 MHz</td>
                                <td className="px-4 py-3">Line of Sight only</td>
                            </tr>
                            <tr className="border-b border-slate-800 hover:bg-slate-800/30">
                                <td className="px-4 py-3 font-medium text-white">ILS (Localizer)</td>
                                <td className="px-4 py-3"><span className="text-lime-400">VHF</span></td>
                                <td className="px-4 py-3">108.10 - 111.95 MHz</td>
                                <td className="px-4 py-3">Odd decimals only</td>
                            </tr>
                            <tr className="border-b border-slate-800 hover:bg-slate-800/30">
                                <td className="px-4 py-3 font-medium text-white">ILS (Glidepath)</td>
                                <td className="px-4 py-3"><span className="text-green-400">UHF</span></td>
                                <td className="px-4 py-3">329.15 - 335.00 MHz</td>
                                <td className="px-4 py-3">Paired with Localizer frequency</td>
                            </tr>
                            <tr className="border-b border-slate-800 hover:bg-slate-800/30">
                                <td className="px-4 py-3 font-medium text-white">DME</td>
                                <td className="px-4 py-3"><span className="text-green-400">UHF</span></td>
                                <td className="px-4 py-3">960 - 1215 MHz</td>
                                <td className="px-4 py-3">Slant range distance</td>
                            </tr>
                            <tr className="border-b border-slate-800 hover:bg-slate-800/30">
                                <td className="px-4 py-3 font-medium text-white">Transponder (SSR)</td>
                                <td className="px-4 py-3"><span className="text-green-400">UHF</span></td>
                                <td className="px-4 py-3">1030 MHz (Tx) / 1090 MHz (Rx)</td>
                                <td className="px-4 py-3">Secondary Surveillance Radar</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SpectrumExplorer;
