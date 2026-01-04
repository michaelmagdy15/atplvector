import React, { useState } from 'react';
import { qCodes } from '../data/courseData';
import { ChevronLeft, ChevronRight, Rotate3D } from 'lucide-react';

const QCodeFlashcards: React.FC = () => {
    const [index, setIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);

    const next = () => {
        setFlipped(false);
        setTimeout(() => setIndex((prev) => (prev + 1) % qCodes.length), 150);
    };

    const prev = () => {
        setFlipped(false);
        setTimeout(() => setIndex((prev) => (prev - 1 + qCodes.length) % qCodes.length), 150);
    };

    const current = qCodes[index];

    return (
        <div className="max-w-md mx-auto h-80 perspective-1000">
             <div 
                onClick={() => setFlipped(!flipped)}
                className={`relative w-full h-full cursor-pointer transition-transform duration-500 transform-style-3d
                    ${flipped ? 'rotate-y-180' : ''}
                `}
             >
                {/* Front */}
                <div className="absolute inset-0 bg-white rounded-2xl shadow-xl border border-slate-200 flex flex-col items-center justify-center p-8 backface-hidden">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">CODE</div>
                    <div className="text-6xl font-black text-slate-800">{current.code}</div>
                    <div className="absolute bottom-6 text-slate-400 flex items-center text-sm">
                        <Rotate3D className="w-4 h-4 mr-1" /> Tap to reveal meaning
                    </div>
                </div>

                {/* Back */}
                <div className="absolute inset-0 bg-indigo-600 rounded-2xl shadow-xl flex flex-col items-center justify-center p-8 rotate-y-180 backface-hidden text-center">
                    <div className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-4">MEANING</div>
                    <div className="text-xl font-bold text-white leading-relaxed">{current.meaning}</div>
                </div>
             </div>

             <div className="flex justify-between items-center mt-8">
                 <button onClick={prev} className="p-4 bg-white rounded-full shadow-md hover:bg-slate-50 text-slate-600"><ChevronLeft /></button>
                 <span className="font-mono text-slate-400">{index + 1} / {qCodes.length}</span>
                 <button onClick={next} className="p-4 bg-white rounded-full shadow-md hover:bg-slate-50 text-slate-600"><ChevronRight /></button>
             </div>
        </div>
    );
};

export default QCodeFlashcards;
