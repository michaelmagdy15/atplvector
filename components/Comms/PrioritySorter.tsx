import React, { useState } from 'react';
import { ListOrdered, CheckCircle2, XCircle, RotateCcw, AlertCircle, Info } from 'lucide-react';

interface PriorityItem {
    id: string;
    code: string;
    name: string;
    category: string;
    rank: number;
    description: string;
    examples: string;
}

const priorities: PriorityItem[] = [
    {
        id: 'ss',
        code: 'SS',
        name: 'Distress (MAYDAY)',
        category: 'Distress Messages',
        rank: 1,
        description: 'Imminent danger threatening the aircraft, lives on board, requiring immediate assistance.',
        examples: 'Engine failure in IMC, cabin fire, structural failure, ditching.',
    },
    {
        id: 'dd',
        code: 'DD',
        name: 'Urgency (PAN-PAN)',
        category: 'Urgency Messages',
        rank: 2,
        description: 'Safety of aircraft or persons is concerned, but immediate assistance is not required.',
        examples: 'Passenger heart attack, lost position, single generator failure, fuel caution.',
    },
    {
        id: 'df',
        code: 'DF',
        name: 'Direction Finding (DF)',
        category: 'Direction Finding',
        rank: 3,
        description: 'Communications relating directly to aeronautical direction-finding stations.',
        examples: 'Requesting True Bearing (QTE), Magnetic Bearing (QDR), or Magnetic Heading (QDM).',
    },
    {
        id: 'ff',
        code: 'FF',
        name: 'Flight Safety Messages',
        category: 'Safety Messages',
        rank: 4,
        description: 'Air traffic control messages essential for air navigation and aircraft safety.',
        examples: 'ATC clearances, position reports, SIGMETs, AIRMETs, missed approach reports.',
    },
    {
        id: 'gg',
        code: 'GG',
        name: 'Meteorological Messages',
        category: 'Meteorological Information',
        rank: 5,
        description: 'Weather observations and forecasts transmitted to or from aircraft.',
        examples: 'METAR, TAF, SPECI, routine surface wind and temperature reports.',
    },
    {
        id: 'kk',
        code: 'KK',
        name: 'Flight Regularity Messages',
        category: 'Airline Operations',
        rank: 6,
        description: 'Commercial airline operational messages regarding dispatch, schedule, and passenger care.',
        examples: 'Passenger connections, catering requests, gate changes, aircraft maintenance status.',
    },
];

const PrioritySorter: React.FC = () => {
    const [items, setItems] = useState<PriorityItem[]>(() =>
        [...priorities].sort(() => 0.5 - Math.random())
    );
    const [checked, setChecked] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);

    const move = (idx: number, direction: -1 | 1) => {
        if (checked) return;
        const newItems = [...items];
        const target = idx + direction;
        if (target < 0 || target >= newItems.length) return;

        [newItems[idx], newItems[target]] = [newItems[target], newItems[idx]];
        setItems(newItems);
    };

    const check = () => {
        const correct = items.every((item, index) => item.rank === index + 1);
        setIsCorrect(correct);
        setChecked(true);
    };

    const reset = () => {
        setItems([...priorities].sort(() => 0.5 - Math.random()));
        setChecked(false);
        setIsCorrect(false);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-12 text-slate-100">
            {/* Header */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                        <ListOrdered className="text-sky-400" size={28} />
                        ICAO RTF Message Priority Ranking (090)
                    </h2>
                    <p className="text-slate-400 text-xs mt-1">
                        ICAO Annex 10 Vol II & Doc 9432 Radiotelephony Priority Categories
                    </p>
                </div>
                <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 flex items-center gap-2 transition-colors"
                >
                    <Info size={16} />
                    {showExplanation ? 'Hide Mnemonic' : 'Priority Mnemonic'}
                </button>
            </div>

            {/* Mnemonic Banner */}
            {showExplanation && (
                <div className="bg-slate-950 p-5 rounded-2xl border border-sky-800/40 text-xs space-y-2 animate-in fade-in">
                    <div className="font-bold text-sky-400 text-sm flex items-center gap-2">
                        <AlertCircle size={16} />
                        How to Remember the 6 Priority Classes (Order of Transmission)
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center pt-2 font-mono">
                        <div className="bg-rose-950/40 border border-rose-800 p-2 rounded-lg">
                            <span className="text-rose-400 font-bold block">1. SS</span>
                            <span className="text-[11px] text-slate-300">Distress</span>
                        </div>
                        <div className="bg-amber-950/40 border border-amber-800 p-2 rounded-lg">
                            <span className="text-amber-400 font-bold block">2. DD</span>
                            <span className="text-[11px] text-slate-300">Urgency</span>
                        </div>
                        <div className="bg-purple-950/40 border border-purple-800 p-2 rounded-lg">
                            <span className="text-purple-400 font-bold block">3. DF</span>
                            <span className="text-[11px] text-slate-300">Direction</span>
                        </div>
                        <div className="bg-blue-950/40 border border-blue-800 p-2 rounded-lg">
                            <span className="text-blue-400 font-bold block">4. FF</span>
                            <span className="text-[11px] text-slate-300">Safety</span>
                        </div>
                        <div className="bg-teal-950/40 border border-teal-800 p-2 rounded-lg">
                            <span className="text-teal-400 font-bold block">5. GG</span>
                            <span className="text-[11px] text-slate-300">Met (Weather)</span>
                        </div>
                        <div className="bg-slate-800 border border-slate-700 p-2 rounded-lg">
                            <span className="text-slate-300 font-bold block">6. KK</span>
                            <span className="text-[11px] text-slate-400">Regularity</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Sorter List */}
            <div className="bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex justify-between text-xs text-slate-400 uppercase font-semibold tracking-wider pb-2 border-b border-slate-800">
                    <span>Rank Order (Top = Highest Priority)</span>
                    <span>Teletype / RTF Category</span>
                </div>

                <div className="space-y-2.5">
                    {items.map((item, idx) => (
                        <div key={item.id} className="flex items-center gap-3">
                            <div className="flex flex-col space-y-1">
                                <button
                                    onClick={() => move(idx, -1)}
                                    disabled={idx === 0 || checked}
                                    className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 disabled:opacity-20 disabled:hover:bg-slate-800 text-xs transition-colors"
                                >
                                    ▲
                                </button>
                                <button
                                    onClick={() => move(idx, 1)}
                                    disabled={idx === items.length - 1 || checked}
                                    className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 disabled:opacity-20 disabled:hover:bg-slate-800 text-xs transition-colors"
                                >
                                    ▼
                                </button>
                            </div>

                            <div
                                className={`flex-1 p-3.5 rounded-xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                                    checked
                                        ? item.rank === idx + 1
                                            ? 'border-emerald-500 bg-emerald-950/30 text-white'
                                            : 'border-rose-500 bg-rose-950/30 text-rose-200'
                                        : 'border-slate-800 bg-slate-950 hover:border-slate-700 text-slate-200'
                                }`}
                            >
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-xs font-bold text-sky-400">#{idx + 1}</span>
                                        <span className="font-bold text-sm text-white">{item.name}</span>
                                    </div>
                                    <div className="text-[11px] text-slate-400">
                                        {item.description}
                                    </div>
                                    <div className="text-[10px] text-slate-500 italic">
                                        Ex: {item.examples}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 self-start sm:self-center">
                                    <span className="font-mono text-xs px-2.5 py-1 bg-slate-800 rounded-lg text-slate-300 border border-slate-700 font-bold">
                                        {item.code}
                                    </span>
                                    {checked && (
                                        item.rank === idx + 1 ? (
                                            <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
                                        ) : (
                                            <XCircle size={18} className="text-rose-400 flex-shrink-0" />
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-4 flex justify-between items-center border-t border-slate-800">
                    <button
                        onClick={reset}
                        className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
                    >
                        <RotateCcw size={14} /> Shuffle & Restart
                    </button>

                    {!checked ? (
                        <button
                            onClick={check}
                            className="bg-sky-600 hover:bg-sky-500 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-sky-950 transition-all"
                        >
                            Validate Order
                        </button>
                    ) : (
                        <div className="flex items-center gap-4">
                            <span className={`text-xs font-bold flex items-center gap-1.5 ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                                {isCorrect ? 'Perfect! Correct ICAO Priority Order' : 'Incorrect Order — Review Positions'}
                            </span>
                            <button
                                onClick={reset}
                                className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl font-bold text-xs transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PrioritySorter;
