import React from 'react';
import { Flag, Save, CheckCircle } from 'lucide-react';

interface Props {
    total: number;
    current: number;
    statuses: ('correct' | 'incorrect' | 'skipped' | 'unseen')[];
    onNavigate: (index: number) => void;
    onSave: () => void;
    onFinish: () => void;
    timeLeft?: number; // seconds
}

export const QB_Grid: React.FC<Props> = ({ total, current, statuses, onNavigate, onSave, onFinish, timeLeft }) => {

    const formatTime = (seconds?: number) => {
        if (seconds === undefined) return "--:--";
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="glass-panel p-4 rounded-2xl flex flex-col h-full">
            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                    <div className="text-xs text-slate-500 uppercase font-bold">Time Left</div>
                    <div className={`text-2xl font-mono font-bold ${timeLeft && timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                        {formatTime(timeLeft)}
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xs text-slate-500 uppercase font-bold">Progress</div>
                    <div className="text-2xl font-mono font-bold text-blue-400">
                        {current + 1}<span className="text-slate-600 text-lg">/{total}</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
                <div className="grid grid-cols-5 gap-2">
                    {Array.from({ length: total }).map((_, i) => {
                        const status = statuses[i] || 'unseen';
                        let bg = 'bg-slate-800 border-slate-700 text-slate-500';

                        if (status === 'correct') bg = 'bg-emerald-500 border-emerald-400 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]';
                        if (status === 'incorrect') bg = 'bg-red-500 border-red-400 text-white shadow-[0_0_10px_rgba(239,68,68,0.3)]';
                        if (status === 'skipped') bg = 'bg-amber-500/20 border-amber-500 text-amber-500';
                        if (i === current) bg = 'bg-blue-600 border-blue-400 text-white ring-2 ring-blue-400/50';

                        return (
                            <button
                                key={i}
                                onClick={() => onNavigate(i)}
                                className={`aspect-square rounded-lg flex items-center justify-center text-sm font-bold border transition-all hover:scale-105 ${bg}`}
                            >
                                {i + 1}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="mt-6 space-y-3 pt-4 border-t border-white/10">
                <button
                    onClick={onSave}
                    className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                >
                    <Save size={18} />
                    Save & Exit
                </button>

                <button
                    onClick={onFinish}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
                >
                    <CheckCircle size={18} />
                    Finish Test
                </button>
            </div>
        </div>
    );
};
