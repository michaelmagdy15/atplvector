import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const TimeZoner: React.FC = () => {
    const [offset, setOffset] = useState<number>(0);
    const [localTime, setLocalTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setLocalTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const utcTime = new Date(localTime.getTime());
    // Display purposes only, simple logic
    
    // Calculate hypothetical local based on offset user enters relative to UTC
    const userLocalHours = (utcTime.getUTCHours() + offset + 24) % 24;
    const userLocalString = `${userLocalHours.toString().padStart(2, '0')}:${utcTime.getUTCMinutes().toString().padStart(2, '0')}`;
    const utcString = `${utcTime.getUTCHours().toString().padStart(2, '0')}:${utcTime.getUTCMinutes().toString().padStart(2, '0')} Z`;

    return (
        <div className="max-w-md mx-auto bg-slate-900 text-white p-8 rounded-3xl shadow-2xl">
            <div className="text-center mb-8">
                <div className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-2">ZULU TIME (UTC)</div>
                <div className="text-6xl font-mono font-bold text-green-400">{utcString}</div>
            </div>

            <div className="bg-slate-800 p-6 rounded-2xl mb-6">
                 <div className="flex justify-between items-center mb-4">
                     <label className="text-sm font-bold text-slate-400">OFFSET</label>
                     <span className="font-mono font-bold text-xl">{offset > 0 ? `+${offset}` : offset}</span>
                 </div>
                 <input 
                    type="range"
                    min="-12"
                    max="14"
                    step="1"
                    value={offset}
                    onChange={(e) => setOffset(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                 />
            </div>

            <div className="text-center">
                 <div className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-2">CALCULATED LOCAL</div>
                 <div className="text-4xl font-mono font-bold">{userLocalString}</div>
                 <div className="text-xs text-slate-500 mt-2">Aviation operations always reference UTC (Zulu) to avoid confusion.</div>
            </div>
        </div>
    );
};

export default TimeZoner;
