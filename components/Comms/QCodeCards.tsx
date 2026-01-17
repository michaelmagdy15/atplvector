import React, { useState } from 'react';
import { Search, RotateCcw, Check, X } from 'lucide-react';

interface QCode {
    code: string;
    meaning: string;
    category: 'DIRECTION' | 'PRESSURE' | 'CONTROL' | 'REPORT';
}

const qCodes: QCode[] = [
    { code: 'QDM', meaning: 'Magnetic heading TO the station (no wind)', category: 'DIRECTION' },
    { code: 'QDR', meaning: 'Magnetic bearing FROM the station', category: 'DIRECTION' },
    { code: 'QTE', meaning: 'True bearing FROM the station', category: 'DIRECTION' },
    { code: 'QUJ', meaning: 'True track TO the station', category: 'DIRECTION' },
    { code: 'QNH', meaning: 'Altimeter sub-scale setting to obtain elevation when on the ground', category: 'PRESSURE' },
    { code: 'QFE', meaning: 'Altimeter sub-scale setting to obtain height above the reference datum (0ft on ground)', category: 'PRESSURE' },
    { code: 'QNE', meaning: 'Indicated altitude at landing threshold when standard pressure (1013.25) is set', category: 'PRESSURE' },
    { code: 'QFF', meaning: 'Atmospheric pressure at a place, reduced to MSL using actual temperature', category: 'PRESSURE' },
    { code: 'QGH', meaning: 'Controlled descent through clouds', category: 'CONTROL' },
    { code: 'QSY', meaning: 'Change frequency to...', category: 'CONTROL' },
    { code: 'QTR', meaning: 'What is the correct time?', category: 'REPORT' },
    { code: 'QRH', meaning: 'Variation of frequency', category: 'REPORT' },
];

const QCodeCards: React.FC = () => {
    const [flipped, setFlipped] = useState<number | null>(null);
    const [filter, setFilter] = useState<'ALL' | 'DIRECTION' | 'PRESSURE' | 'CONTROL'>('ALL');

    const filteredCodes = filter === 'ALL' ? qCodes : qCodes.filter(q => q.category === filter);

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Q-Code Master</h2>
                    <p className="text-slate-500">Essential codes for VFR/IFR communication (090.01.01.03)</p>
                </div>

                <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
                    {(['ALL', 'DIRECTION', 'PRESSURE', 'CONTROL'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all
                                ${filter === f ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}
                            `}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredCodes.map((q, idx) => (
                    <div
                        key={q.code}
                        className="group h-64 perspective-1000 cursor-pointer"
                        onClick={() => setFlipped(flipped === idx ? null : idx)}
                    >
                        <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${flipped === idx ? 'rotate-y-180' : ''}`}>

                            {/* FRONT */}
                            <div className="absolute inset-0 backface-hidden bg-white border-2 border-slate-100 rounded-2xl shadow-xl flex flex-col items-center justify-center p-8 hover:border-indigo-200 transition-colors">
                                <div className={`text-xs font-bold px-2 py-1 rounded mb-4
                                    ${q.category === 'DIRECTION' ? 'bg-blue-100 text-blue-700' : ''}
                                    ${q.category === 'PRESSURE' ? 'bg-emerald-100 text-emerald-700' : ''}
                                    ${q.category === 'CONTROL' ? 'bg-amber-100 text-amber-700' : ''}
                                    ${q.category === 'REPORT' ? 'bg-slate-100 text-slate-700' : ''}
                                `}>{q.category}</div>
                                <div className="text-5xl font-black text-slate-800">{q.code}</div>
                                <div className="mt-8 text-slate-400 text-sm font-medium flex items-center gap-2">
                                    <RotateCcw size={14} /> Click to reveal
                                </div>
                            </div>

                            {/* BACK */}
                            <div className="absolute inset-0 backface-hidden rotate-y-180 bg-indigo-600 rounded-2xl shadow-xl flex flex-col items-center justify-center p-8 text-center">
                                <div className="text-white font-medium text-lg leading-relaxed">
                                    {q.meaning}
                                </div>
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QCodeCards;
