import React, { useState } from 'react';
import { Compass } from 'lucide-react';

const QCodeCompass: React.FC = () => {
    const [heading, setHeading] = useState(45); // Aircraft Heading
    const [bearing, setBearing] = useState(90); // Bearing TO station

    // Calculations
    const qdm = bearing; // Magnetic TO
    const qdr = (bearing + 180) % 360; // Magnetic FROM
    const quj = bearing; // True TO (Assuming 0 var for simplicity or labeled as True)
    const qte = (bearing + 180) % 360; // True FROM

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-slate-200 text-slate-900">
            <div className="flex items-center space-x-3 mb-6">
                <Compass className="w-6 h-6 text-sky-600" />
                <h2 className="text-2xl font-bold text-slate-800">Q-Code Direction Finding</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Visual */}
                <div className="relative w-64 h-64 mx-auto">
                    {/* Compass Rose */}
                    <div className="absolute inset-0 border-4 border-slate-200 rounded-full flex items-center justify-center">
                        <div className="absolute top-2 text-xs font-bold text-slate-400">N</div>
                        <div className="absolute bottom-2 text-xs font-bold text-slate-400">S</div>
                        <div className="absolute left-2 text-xs font-bold text-slate-400">W</div>
                        <div className="absolute right-2 text-xs font-bold text-slate-400">E</div>
                    </div>

                    {/* Station */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-4 h-4 bg-slate-800 rounded-full z-20"></div>
                        <div className="absolute text-[10px] font-bold mt-6 text-slate-800">STATION</div>
                    </div>

                    {/* Aircraft Vector (TO Station) */}
                    <div 
                        className="absolute w-full h-full flex items-center justify-center pointer-events-none transition-transform duration-300"
                        style={{ transform: `rotate(${bearing + 180}deg)` }} 
                    >
                        <div className="w-1 h-32 bg-sky-500 origin-top translate-y-[50%] relative">
                             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-sky-600 font-bold text-lg">✈️</div>
                        </div>
                    </div>
                </div>

                {/* Controls & Data */}
                <div className="space-y-6">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Bearing to Station (QDM)</label>
                        <input 
                            type="range" 
                            min="0" 
                            max="359" 
                            value={bearing} 
                            onChange={(e) => setBearing(Number(e.target.value))}
                            className="w-full"
                        />
                        <div className="text-right font-mono font-bold text-xl">{bearing.toString().padStart(3, '0')}°</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-sky-50 rounded-lg border border-sky-100">
                            <div className="text-xs text-sky-600 font-bold">QDM (Mag To)</div>
                            <div className="text-2xl font-black text-slate-800">{qdm.toString().padStart(3, '0')}°</div>
                        </div>
                        <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                            <div className="text-xs text-orange-600 font-bold">QDR (Mag From)</div>
                            <div className="text-2xl font-black text-slate-800">{qdr.toString().padStart(3, '0')}°</div>
                        </div>
                        <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                            <div className="text-xs text-indigo-600 font-bold">QUJ (True To)</div>
                            <div className="text-2xl font-black text-slate-800">{quj.toString().padStart(3, '0')}°</div>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                            <div className="text-xs text-purple-600 font-bold">QTE (True From)</div>
                            <div className="text-2xl font-black text-slate-800">{qte.toString().padStart(3, '0')}°</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QCodeCompass;