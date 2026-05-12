import React from 'react';
import { useCourseMode } from '../context/CourseModeContext';
import { Plane, Compass } from 'lucide-react';

const CourseModeToggle: React.FC = () => {
    const { track, setTrack } = useCourseMode();

    return (
        <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-white/10 shadow-inner">
            <button
                onClick={() => setTrack('PPL')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    track === 'PPL'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
                <Compass size={14} className={track === 'PPL' ? 'animate-pulse' : ''} />
                <span className="hidden sm:inline">PPL</span>
            </button>
            <button
                onClick={() => setTrack('ATPL')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    track === 'ATPL'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
                <Plane size={14} />
                <span className="hidden sm:inline">ATPL</span>
            </button>
        </div>
    );
};

export default CourseModeToggle;
