import React, { useState } from 'react';
import { vhfSpectrum } from '../data/courseData';

const FrequencyExplorer: React.FC = () => {
    const [activeBand, setActiveBand] = useState<number | null>(null);

    return (
        <div className="max-w-5xl mx-auto">
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8 text-slate-900">
                <h2 className="text-xl font-bold text-slate-800 mb-6">Radio Spectrum Propagation</h2>
                
                {/* Visual Spectrum Bar */}
                <div className="flex h-32 rounded-lg overflow-hidden mb-8 border border-slate-300">
                    {vhfSpectrum.map((band, idx) => (
                        <div 
                            key={band.band}
                            onMouseEnter={() => setActiveBand(idx)}
                            className={`flex-1 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative group
                                ${idx === 4 ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}
                                ${activeBand === idx ? 'flex-[2] bg-indigo-600 text-white shadow-inner' : ''}
                            `}
                        >
                            <span className="font-bold text-xl">{band.band}</span>
                            {activeBand === idx && (
                                <span className="text-xs mt-1 opacity-90 animate-in fade-in">{band.range}</span>
                            )}
                        </div>
                    ))}
                </div>

                {/* Info Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {activeBand !== null ? (
                        <>
                             <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                                 <h3 className="font-bold text-slate-400 text-xs uppercase mb-2">Frequency Range</h3>
                                 <div className="text-2xl font-bold text-indigo-600">{vhfSpectrum[activeBand].range}</div>
                             </div>
                             <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                                 <h3 className="font-bold text-slate-400 text-xs uppercase mb-2">Wave Type</h3>
                                 <div className="text-2xl font-bold text-indigo-600">{vhfSpectrum[activeBand].wave}</div>
                             </div>
                             <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                                 <h3 className="font-bold text-slate-400 text-xs uppercase mb-2">Typical Range</h3>
                                 <div className="text-2xl font-bold text-indigo-600">{vhfSpectrum[activeBand].dist}</div>
                             </div>
                        </>
                    ) : (
                        <div className="col-span-3 text-center text-slate-400 py-10 italic">Hover over a band to view propagation details</div>
                    )}
                </div>
             </div>
        </div>
    );
};

export default FrequencyExplorer;