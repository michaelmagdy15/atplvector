
import React, { useState } from 'react';
import { Cloud, Wind, Thermometer, Disc, FileText, Loader2, Search, ArrowRight, Eye } from 'lucide-react';
import { explainWeather } from '../services/gemini';

const examples = [
    "EGLL 221450Z 24012KT 9999 BKN025 12/08 Q1013",
    "KJFK 041651Z 33017G23KT 1/2SM SN BKN009 OVC015 M02/M05 A2995",
    "TAF LEMD 121100Z 1212/1318 03010KT 9999 FEW030 TX15/1215Z TN04/1306Z TEMPO 1215/1218 03015G25KT"
];

const MetarDecoder: React.FC = () => {
    const [raw, setRaw] = useState(examples[0]);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>(null);

    const handleDecode = async () => {
        if (!raw.trim()) return;
        setLoading(true);
        const result = await explainWeather(raw);
        setData(result);
        setLoading(false);
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <Cloud className="text-sky-400 w-8 h-8" />
                <div>
                    <h2 className="text-2xl font-bold text-white">Smart Weather Decoder</h2>
                    <p className="text-slate-400 text-sm">Decode any METAR or TAF instantly using AI.</p>
                </div>
            </div>

            {/* Input Console */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-2xl mb-8">
                <label className="text-sky-400 text-xs font-bold uppercase mb-2 block tracking-widest">
                    TERMINAL INPUT
                </label>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <textarea 
                            value={raw}
                            onChange={(e) => setRaw(e.target.value)}
                            className="w-full h-24 bg-slate-800 text-green-400 font-mono p-4 rounded-lg border border-slate-600 focus:border-sky-500 outline-none resize-none shadow-inner"
                            placeholder="Paste METAR or TAF here..."
                        />
                    </div>
                    <div className="flex flex-col gap-2 justify-start">
                        <button 
                            onClick={handleDecode}
                            disabled={loading || !raw}
                            className="h-12 px-6 bg-sky-600 text-white rounded-lg font-bold hover:bg-sky-500 disabled:opacity-50 flex items-center justify-center gap-2 transition-all hover:scale-105"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <><Search size={18} /> DECODE</>}
                        </button>
                        <button 
                            onClick={() => {
                                const next = examples[(examples.indexOf(raw) + 1) % examples.length];
                                setRaw(next);
                            }} 
                            className="h-10 px-4 bg-slate-700 text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-600"
                        >
                            Load Example
                        </button>
                    </div>
                </div>
            </div>

            {/* Results Display */}
            {data && !loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4">
                    {/* Header Card */}
                    <div className="col-span-full bg-gradient-to-r from-indigo-900 to-slate-900 p-6 rounded-xl border border-indigo-500/30 flex justify-between items-center">
                        <div>
                            <div className="inline-block px-2 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded mb-2 border border-indigo-500/30">
                                {data.type} REPORT
                            </div>
                            <h3 className="text-2xl font-black text-white">{data.airport}</h3>
                            <p className="text-slate-300 flex items-center gap-2 text-sm mt-1">
                                <FileText size={14} /> {data.time}
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                                {data.type === 'METAR' ? <Eye className="text-white" /> : <ArrowRight className="text-white" />}
                            </div>
                        </div>
                    </div>

                    {/* Wind */}
                    <div className="bg-slate-800 p-6 rounded-xl border-l-4 border-emerald-500 shadow-lg">
                        <div className="flex items-start justify-between mb-2">
                            <h4 className="text-slate-400 text-xs font-bold uppercase">Wind</h4>
                            <Wind className="text-emerald-500" size={20} />
                        </div>
                        <p className="text-2xl font-bold text-white">{data.wind}</p>
                    </div>

                    {/* Visibility */}
                    <div className="bg-slate-800 p-6 rounded-xl border-l-4 border-blue-500 shadow-lg">
                        <div className="flex items-start justify-between mb-2">
                            <h4 className="text-slate-400 text-xs font-bold uppercase">Visibility</h4>
                            <Eye className="text-blue-500" size={20} />
                        </div>
                        <p className="text-2xl font-bold text-white">{data.visibility}</p>
                        {data.conditions && data.conditions.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {data.conditions.map((c: string, i: number) => (
                                    <span key={i} className="text-xs bg-slate-700 px-2 py-1 rounded text-blue-200">{c}</span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Clouds */}
                    <div className="bg-slate-800 p-6 rounded-xl border-l-4 border-slate-400 shadow-lg">
                        <div className="flex items-start justify-between mb-2">
                            <h4 className="text-slate-400 text-xs font-bold uppercase">Sky Condition</h4>
                            <Cloud className="text-slate-400" size={20} />
                        </div>
                        {data.clouds && data.clouds.length > 0 ? (
                            <ul className="space-y-1">
                                {data.clouds.map((c: string, i: number) => (
                                    <li key={i} className="text-lg font-bold text-white">{c}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-xl font-bold text-white">Clear Sky (NSC/SKC)</p>
                        )}
                    </div>

                    {/* Temp */}
                    {data.temp && (
                        <div className="bg-slate-800 p-6 rounded-xl border-l-4 border-orange-500 shadow-lg">
                            <div className="flex items-start justify-between mb-2">
                                <h4 className="text-slate-400 text-xs font-bold uppercase">Temperature</h4>
                                <Thermometer className="text-orange-500" size={20} />
                            </div>
                            <p className="text-2xl font-bold text-white">{data.temp}</p>
                        </div>
                    )}

                    {/* Pressure */}
                    {data.pressure && (
                        <div className="bg-slate-800 p-6 rounded-xl border-l-4 border-purple-500 shadow-lg">
                            <div className="flex items-start justify-between mb-2">
                                <h4 className="text-slate-400 text-xs font-bold uppercase">Pressure</h4>
                                <Disc className="text-purple-500" size={20} />
                            </div>
                            <p className="text-2xl font-bold text-white">{data.pressure}</p>
                        </div>
                    )}

                    {/* Trend */}
                    {data.trend && (
                        <div className="col-span-full md:col-span-2 bg-slate-800 p-6 rounded-xl border-l-4 border-yellow-500 shadow-lg">
                            <div className="flex items-start justify-between mb-2">
                                <h4 className="text-slate-400 text-xs font-bold uppercase">Forecast Trend</h4>
                                <ArrowRight className="text-yellow-500" size={20} />
                            </div>
                            <p className="text-lg font-medium text-white">{data.trend}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MetarDecoder;
