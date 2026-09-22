import React, { useState, useEffect } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { Play, Pause, RotateCcw, Timer, Eye, EyeOff, GripHorizontal, ChevronDown } from 'lucide-react';
import { triggerHaptic } from '../../lib/nativeBridge';

const FOCUS_TIME = 25 * 60; // 25 minutes
const SHORT_BREAK = 5 * 60; // 5 minutes

const FocusTimer: React.FC = () => {
    const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<'focus' | 'break'>('focus');
    const [isMinimized, setIsMinimized] = useState(true);
    const [isTranslucent, setIsTranslucent] = useState(false);

    const dragControls = useDragControls();

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
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

    const toggleTimer = () => {
        triggerHaptic('light');
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        triggerHaptic('selection');
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
            <motion.button
                drag
                dragMomentum={false}
                dragElastic={0.1}
                onClick={() => {
                    triggerHaptic('light');
                    setIsMinimized(false);
                }}
                className={`fixed bottom-[calc(max(env(safe-area-inset-bottom,0px),var(--sab,0px))+5.5rem)] right-20 sm:right-24 sm:bottom-6 border rounded-full text-white shadow-xl z-40 transition-shadow active:scale-95 group backdrop-blur-md cursor-grab active:cursor-grabbing flex items-center gap-2 px-3.5 py-2.5 ${
                    isActive
                        ? 'bg-indigo-900/90 border-indigo-400/50 shadow-indigo-900/40'
                        : 'bg-slate-900/90 border-slate-700/60 hover:bg-slate-800'
                }`}
                title="Focus Timer (Drag anywhere, tap to open)"
            >
                <div
                    className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-pulse"
                    style={{ display: isActive ? 'block' : 'none' }}
                />
                <Timer size={18} className={isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-white'} />
                <span className="font-mono text-xs font-bold tabular-nums">
                    {formatTime(timeLeft)}
                </span>
            </motion.button>
        );
    }

    return (
        <motion.div
            drag
            dragControls={dragControls}
            dragListener={false}
            dragMomentum={false}
            dragElastic={0.06}
            className={`fixed bottom-[calc(max(env(safe-area-inset-bottom,0px),var(--sab,0px))+4.5rem)] right-3 sm:bottom-6 sm:right-6 w-[270px] sm:w-64 bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl shadow-slate-950/80 z-50 overflow-hidden backdrop-blur-xl animate-in slide-in-from-bottom-5 fade-in duration-200 select-none ${
                isTranslucent ? 'opacity-40 hover:opacity-100 transition-opacity' : 'opacity-100'
            }`}
        >
            {/* Top Drag Handle Bar */}
            <div
                onPointerDown={(e) => dragControls.start(e)}
                className="w-full pt-2 pb-1 px-3 bg-slate-950/90 border-b border-white/5 flex items-center justify-between cursor-grab active:cursor-grabbing touch-none select-none group"
                title="Drag from here to move timer anywhere"
            >
                <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-400 group-hover:text-indigo-400 transition-colors">
                    <GripHorizontal size={13} />
                    <span className="tracking-wider uppercase font-semibold">Drag</span>
                </div>
                <div className="w-10 h-1 rounded-full bg-slate-600/50 group-hover:bg-indigo-400/80 transition-colors" />
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                    {mode.toUpperCase()}
                </span>
            </div>

            {/* Header */}
            <div className={`px-3 py-2 flex justify-between items-center ${mode === 'focus' ? 'bg-indigo-950/60' : 'bg-emerald-950/60'}`}>
                <div className="flex items-center gap-2">
                    <Timer size={15} className={mode === 'focus' ? 'text-indigo-400' : 'text-emerald-400'} />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                        {mode === 'focus' ? 'Focus Mode' : 'Break'}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    {/* Ghost / Translucent Mode */}
                    <button
                        onClick={() => setIsTranslucent(!isTranslucent)}
                        className={`p-1 rounded-lg transition-colors ${
                            isTranslucent ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                        title={isTranslucent ? 'Disable Translucent Peek' : 'Peek Behind: Make Semi-Transparent'}
                    >
                        {isTranslucent ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                    {/* Minimize */}
                    <button
                        onClick={() => setIsMinimized(true)}
                        className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        title="Minimize"
                    >
                        <ChevronDown size={15} />
                    </button>
                </div>
            </div>

            {/* Timer Body */}
            <div className="p-4 sm:p-5 text-center">
                <div className={`text-4xl sm:text-5xl font-mono font-black mb-4 tabular-nums tracking-wider ${isActive ? 'text-white' : 'text-slate-400'}`}>
                    {formatTime(timeLeft)}
                </div>

                <div className="flex justify-center gap-3">
                    <button
                        onClick={toggleTimer}
                        className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all active:scale-95 flex items-center gap-2 ${
                            isActive
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                                : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/30'
                        }`}
                    >
                        {isActive ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                        <span>{isActive ? 'Pause' : 'Start'}</span>
                    </button>
                    <button
                        onClick={resetTimer}
                        className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-all active:scale-95 border border-white/5"
                        title="Reset"
                    >
                        <RotateCcw size={16} />
                    </button>
                </div>
            </div>

            {/* Session Indicator Progress Bar */}
            <div className="h-1 bg-slate-800 w-full">
                <div
                    className={`h-full transition-all duration-1000 ${mode === 'focus' ? 'bg-indigo-500' : 'bg-emerald-500'}`}
                    style={{ width: `${(timeLeft / (mode === 'focus' ? FOCUS_TIME : SHORT_BREAK)) * 100}%` }}
                />
            </div>
        </motion.div>
    );
};

export default FocusTimer;
