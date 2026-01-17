import React, { useState } from 'react';
import { CloudRain, Wind, AlertTriangle, Map } from 'lucide-react';

const samples = [
    {
        id: 'turb',
        raw: 'EGTT SIGMET 01 VALID 221400/221800 EGLL- EGTT LONDON FIR SEV TURB FCST SW OF LINE N5100 W00400 - N5200 E00100 FL240/360 MOV E 20KT WKN=',
        type: 'SIGMET',
        parts: [
            { label: 'FIR', text: 'EGTT (London)' },
            { label: 'Sequence', text: '01' },
            { label: 'Validity', text: '22nd 1400z to 1800z' },
            { label: 'Phenomenon', text: 'SEVERE TURBULENCE' },
            { label: 'Location', text: 'Forecast SW of line N51 W004 - N52 E001' },
            { label: 'Levels', text: 'FL240 to FL360' },
            { label: 'Movement', text: 'Moving East at 20KT' },
            { label: 'Change', text: 'Weakening' }
        ]
    },
    {
        id: 'ice',
        raw: 'LFFF SIGMET 03 VALID 221500/221900 LFPW- LFFF PARIS FIR SEV ICE FCST N OF N4900 AND W OF E00200 BLW FL120 MOV NE NC=',
        type: 'SIGMET',
        parts: [
            { label: 'FIR', text: 'LFFF (Paris)' },
            { label: 'Sequence', text: '03' },
            { label: 'Validity', text: '22nd 1500z to 1900z' },
            { label: 'Phenomenon', text: 'SEVERE ICING' },
            { label: 'Location', text: 'North of N49 and West of E002' },
            { label: 'Levels', text: 'Below FL120' },
            { label: 'Movement', text: 'Moving North-East' },
            { label: 'Change', text: 'No Change' }
        ]
    },
    {
        id: 'va',
        raw: 'EGTT SIGMET 05 VALID 221200/221800 EGLL- EGTT LONDON FIR VA ERUPTION MT HEKLA PSN N6359 W01942 VA CLD OBS AT 1200Z WI N5500 W01000 - N5500 E00000 - N5200 E00000 - N5200 W01000 SFC/FL550 MOV S 15KT NC=',
        type: 'SIGMET',
        parts: [
            { label: 'FIR', text: 'EGTT (London)' },
            { label: 'Phenomenon', text: 'VOLCANIC ASH (Mt Hekla)' },
            { label: 'Observed', text: 'At 1200Z' },
            { label: 'Area', text: 'Box: 55N 10W - 55N 00E - 52N 00E - 52N 10W' },
            { label: 'Levels', text: 'Surface to FL550' },
            { label: 'Movement', text: 'Moving South 15KT' }
        ]
    }
];

const SigmetDecoder: React.FC = () => {
    const [selected, setSelected] = useState(samples[0]);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <AlertTriangle className="text-amber-500" /> SIGMET & AIRMET Decoder
                </h2>
                <p className="text-slate-400">Interpret hazardous weather warnings (090.03.01.01)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Selector */}
                <div className="space-y-3">
                    {samples.map(s => (
                        <button
                            key={s.id}
                            onClick={() => setSelected(s)}
                            className={`w-full text-left p-4 rounded-xl border transition-all
                                ${selected.id === s.id
                                    ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'}
                            `}
                        >
                            <div className="font-bold text-sm mb-1">{s.type} {s.parts[0].text}</div>
                            <div className="text-xs opacity-70 truncate">{s.raw}</div>
                        </button>
                    ))}
                </div>

                {/* Display */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-black/50 border border-slate-700 rounded-xl p-6 font-mono text-amber-400 text-lg leading-relaxed break-words shadow-inner">
                        {selected.raw}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selected.parts.map((part, idx) => (
                            <div key={idx} className="bg-slate-800 border border-slate-700 p-4 rounded-xl animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${idx * 50}ms` }}>
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{part.label}</div>
                                <div className="text-white font-medium flex items-start gap-2">
                                    {part.label === 'Phenomenon' && <AlertTriangle size={16} className="mt-1 text-red-500" />}
                                    {part.label === 'Movement' && <Wind size={16} className="mt-1 text-sky-500" />}
                                    {part.label === 'Location' && <Map size={16} className="mt-1 text-green-500" />}
                                    <span>{part.text}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SigmetDecoder;
