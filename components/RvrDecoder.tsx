import React, { useState } from 'react';
import { Eye } from 'lucide-react';

const RvrDecoder: React.FC = () => {
    const [rwy, setRwy] = useState('28');
    const [vis, setVis] = useState(1000);
    const [trend, setTrend] = useState<'U' | 'D' | 'N' | ''>('U');

    const getTrendText = (t: string) => {
        if (t === 'U') return 'Upward tendency';
        if (t === 'D') return 'Downward tendency';
        if (t === 'N') return 'No change';
        return 'No trend info';
    };

    return (
        <div className="max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-lg border border-slate-200 text-slate-900">
            <div className="flex items-center mb-6">
                <div className="bg-slate-900 text-white p-3 rounded-lg mr-4 font-mono font-bold text-xl">
                    R{rwy}/{vis}{trend}
                </div>
                <div>
                    <h2 className="font-bold text-lg">RVR Report Decoder</h2>
                    <p className="text-xs text-slate-500">Runway Visual Range format</p>
                </div>
            </div>

            <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                    <span className="font-bold text-slate-500 text-sm">RUNWAY</span>
                    <span className="font-mono font-bold text-lg text-slate-800">{rwy}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                    <span className="font-bold text-slate-500 text-sm">VISIBILITY</span>
                    <span className="font-mono font-bold text-lg text-slate-800">{vis} meters</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                    <span className="font-bold text-slate-500 text-sm">TREND</span>
                    <span className="font-mono font-bold text-lg text-slate-800">{getTrendText(trend)}</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold block mb-1">Value</label>
                    <input type="number" value={vis} onChange={e => setVis(Number(e.target.value))} className="w-full p-2 border rounded" />
                </div>
                <div>
                    <label className="text-xs font-bold block mb-1">Trend</label>
                    <div className="flex gap-1">
                        {['U', 'D', 'N', ''].map(t => (
                            <button 
                                key={t} 
                                onClick={() => setTrend(t as any)}
                                className={`flex-1 py-2 rounded text-xs font-bold ${trend === t ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-800'}`}
                            >
                                {t || '-'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RvrDecoder;