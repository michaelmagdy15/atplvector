import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';

const FOCUS_TIME = 25 * 60; // 25 minutes
const SHORT_BREAK = 5 * 60; // 5 minutes

const FocusTimer: React.FC = () => {
    const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<'focus' | 'break'>('focus');
    const [isMinimized, setIsMinimized] = useState(true);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            // Play sound or notify?
            // For now, auto-switch mode request (but manual start)
            if (mode === 'focus') {
                setMode('break');
                setTimeLeft(SHORT_BREAK);
            } else {
                setMode('focus');
                setTimeLeft(FOCUS_TIME);
            }
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, timeLeft, mode]);

    const toggleTimer = () => setIsActive(!isActive);
    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(mode === 'focus' ? FOCUS_TIME : SHORT_BREAK);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (isMinimized) {
        return (
            <button
                onClick={() => setIsMinimized(false)}
                className="fixed bottom-4 right-4 bg-slate-800 border border-slate-700 p-3 rounded-full text-white shadow-lg z-50 hover:bg-slate-700 transition-all active:scale-95 group"
                title="Open Focus Timer"
            >
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full animate-pulse" style={{ display: isActive ? 'block' : 'none' }}></div>
                <Timer size={24} className={isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-white'} />
            </button>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
            {/* Header */}
            <div className={`p-3 flex justify-between items-center ${mode === 'focus' ? 'bg-indigo-900/50' : 'bg-emerald-900/50'}`}>
                <div className="flex items-center gap-2">
                    <Timer size={16} className={mode === 'focus' ? 'text-indigo-400' : 'text-emerald-400'} />
                    <span className="text-sm font-bold text-white uppercase tracking-wider">
                        {mode === 'focus' ? 'Focus Mode' : 'Short Break'}
                    </span>
                </div>
                <button onClick={() => setIsMinimized(true)} className="text-white/50 hover:text-white transition-colors">
                    <span className="sr-only">Minimize</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
            </div>

            {/* Timer Body */}
            <div className="p-6 text-center">
                <div className={`text-5xl font-mono font-black mb-6 tabular-nums tracking-wider ${isActive ? 'text-white' : 'text-slate-500'}`}>
                    {formatTime(timeLeft)}
                </div>

                <div className="flex justify-center gap-4">
                    <button
                        onClick={toggleTimer}
                        className={`p-3 rounded-full transition-all active:scale-95 ${isActive
                                ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
                                : 'bg-indigo-500 text-white hover:bg-indigo-400 shadow-lg shadow-indigo-500/20'
                            }`}
                    >
                        {isActive ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                    </button>
                    <button
                        onClick={resetTimer}
                        className="p-3 rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-all active:scale-95"
                    >
                        <RotateCcw size={20} />
                    </button>
                </div>
            </div>

            {/* Session Indicator (Visual flair) */}
            <div className="h-1 bg-slate-800 w-full mt-2">
                <div
                    className={`h-full transition-all duration-1000 ${mode === 'focus' ? 'bg-indigo-500' : 'bg-emerald-500'}`}
                    style={{ width: `${(timeLeft / (mode === 'focus' ? FOCUS_TIME : SHORT_BREAK)) * 100}%` }}
                ></div>
            </div>
        </div>
    );
};

export default FocusTimer;
