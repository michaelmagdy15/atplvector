
import React, { useState, useEffect } from 'react';
import { Radio, Cloud, Clock, RefreshCw } from 'lucide-react';

const VolmetSimulator: React.FC = () => {
    const [freq, setFreq] = useState('126.6');
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentReport, setCurrentReport] = useState(0);

    const reports = [
        { station: 'AMSTERDAM', time: '1020', wind: '240/12', vis: '10KM', clouds: 'FEW020', temp: '16/10', qnh: '1018' },
        { station: 'LONDON HEATHROW', time: '1020', wind: '270/08', vis: 'CAVOK', clouds: 'NSC', temp: '18/11', qnh: '1020' },
        { station: 'BRUSSELS', time: '1020', wind: '220/15', vis: '8000', clouds: 'SCT015', temp: '15/11', qnh: '1017' },
        { station: 'PARIS CDG', time: '1020', wind: 'Variable 03', vis: 'CAVOK', clouds: 'NSC', temp: '19/12', qnh: '1021' },
    ];

    useEffect(() => {
        let interval: any;
        if (isPlaying) {
            interval = setInterval(() => {
                setCurrentReport((prev) => (prev + 1) % reports.length);
            }, 4000);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <div className="flex items-center gap-4 mb-6">
                <div className="bg-indigo-600 p-3 rounded-lg"><Radio className="text-white" /></div>
                <div>
                    <h2 className="text-2xl font-bold text-white">VOLMET vs ATIS</h2>
                    <p className="text-slate-400 text-sm">Meteorological Information Broadcasts (090.03)</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* VOLMET SIM */}
                <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Mainair VOLMET</span>
                        <div className="bg-black px-3 py-1 rounded text-green-500 font-mono text-xl">{freq}</div>
                    </div>

                    <div className="h-48 flex items-center justify-center bg-slate-800 rounded-lg mb-6 border border-slate-700 relative">
                        {isPlaying ? (
                            <div className="text-center animate-in fade-in zoom-in duration-300">
                                <h3 className="text-2xl font-black text-white mb-2">{reports[currentReport].station}</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm text-slate-300">
                                    <div><span className="text-slate-500">Wind:</span> {reports[currentReport].wind}</div>
                                    <div><span className="text-slate-500">Vis:</span> {reports[currentReport].vis}</div>
                                    <div><span className="text-slate-500">Temp:</span> {reports[currentReport].temp}</div>
                                    <div><span className="text-slate-500">QNH:</span> {reports[currentReport].qnh}</div>
                                </div>
                                <div className="absolute top-2 right-2 flex gap-1">
                                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                    <span className="text-[10px] text-red-500 font-bold">LIVE</span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-slate-500">Radio Off</div>
                        )}
                    </div>

                    <div className="flex gap-4">
                        <button 
                            onClick={() => setIsPlaying(!isPlaying)}
                            className={`flex-1 py-3 rounded font-bold transition-all ${isPlaying ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}
                        >
                            {isPlaying ? 'STOP Rx' : 'START Rx'}
                        </button>
                        <button className="p-3 bg-slate-700 rounded text-slate-300 hover:text-white"><RefreshCw /></button>
                    </div>
                </div>

                {/* Comparison Chart */}
                <div className="space-y-4">
                    <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
                        <h3 className="font-bold text-white mb-2 flex items-center gap-2"><Cloud size={16} /> VOLMET</h3>
                        <ul className="text-xs text-slate-300 list-disc pl-4 space-y-1">
                            <li><strong className="text-white">Volume Meteorological:</strong> Broadcasts METARs for a <em>group</em> of airports.</li>
                            <li><strong>Frequency:</strong> VHF or HF.</li>
                            <li><strong>Purpose:</strong> En-route decision making.</li>
                            <li><strong>Content:</strong> Continuous loop of METARs.</li>
                        </ul>
                    </div>

                    <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
                        <h3 className="font-bold text-white mb-2 flex items-center gap-2"><Radio size={16} /> ATIS</h3>
                        <ul className="text-xs text-slate-300 list-disc pl-4 space-y-1">
                            <li><strong className="text-white">Automatic Terminal Info Service:</strong> Specific to <em>one</em> airport.</li>
                            <li><strong>Frequency:</strong> Discrete VHF or VOR voice channel.</li>
                            <li><strong>Purpose:</strong> Approach/Departure info (Runway in use, Transition Level).</li>
                            <li><strong>Requirement:</strong> Must acknowledge receipt (Information Identifier) on first contact.</li>
                        </ul>
                    </div>

                    <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
                         <h3 className="font-bold text-white mb-2 flex items-center gap-2"><Clock size={16} /> D-ATIS</h3>
                         <p className="text-xs text-slate-300">
                            Digital ATIS via ACARS/Data Link. Text format displayed on MCDU/Screen. Can be printed.
                         </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VolmetSimulator;
