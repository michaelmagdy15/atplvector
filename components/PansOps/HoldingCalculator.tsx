import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { RotateCw, RotateCcw, Plane, Info, ArrowRight } from 'lucide-react';

const HoldingCalculator: React.FC = () => {
    const [inbound, setInbound] = useState(360);
    const [heading, setHeading] = useState(180);
    const [isRightHand, setIsRightHand] = useState(true);

    const getSector = () => {
        // Difference between heading and reciprocal of inbound
        const reciprocal = (inbound + 180) % 360;
        let diff = (heading - reciprocal + 360) % 360;

        if (isRightHand) {
            if (diff >= 0 && diff <= 70) return { id: 2, name: 'Offset (Teardrop)', color: 'bg-orange-500', text: 'text-orange-400' };
            if (diff > 250 && diff < 360) return { id: 1, name: 'Parallel', color: 'bg-blue-500', text: 'text-blue-400' };
            return { id: 3, name: 'Direct', color: 'bg-green-500', text: 'text-green-400' };
        } else {
            // Left Hand hold
            if (diff >= 290 && diff <= 360) return { id: 2, name: 'Offset (Teardrop)', color: 'bg-orange-500', text: 'text-orange-400' };
            if (diff > 0 && diff < 110) return { id: 1, name: 'Parallel', color: 'bg-blue-500', text: 'text-blue-400' };
            return { id: 3, name: 'Direct', color: 'bg-green-500', text: 'text-green-400' };
        }
    };

    const sector = getSector();

    return (
        <div className="grid lg:grid-cols-2 gap-12 p-8 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden relative">
            <div className="space-y-8 z-10">
                <div>
                    <h3 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
                        <RotateCw className="text-pink-500" /> Holding Entry Calc
                    </h3>
                    <p className="text-slate-400 text-sm">
                        Calculate sector entry procedures based on ICAO Doc 8168 PANS-OPS criteria.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Inbound Track</label>
                        <div className="flex items-center bg-slate-950 rounded-xl p-4 border border-slate-800">
                            <input 
                                type="number" 
                                value={inbound}
                                onChange={(e) => setInbound(Number(e.target.value) % 360)}
                                className="bg-transparent text-white font-mono text-2xl w-full outline-none"
                            />
                            <span className="text-slate-600 font-bold">°</span>
                        </div>
                        <input type="range" min="0" max="359" value={inbound} onChange={e => setInbound(Number(e.target.value))} className="w-full accent-pink-500" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">A/C Heading</label>
                        <div className="flex items-center bg-slate-950 rounded-xl p-4 border border-slate-800">
                            <input 
                                type="number" 
                                value={heading}
                                onChange={(e) => setHeading(Number(e.target.value) % 360)}
                                className="bg-transparent text-white font-mono text-2xl w-full outline-none"
                            />
                            <span className="text-slate-600 font-bold">°</span>
                        </div>
                        <input type="range" min="0" max="359" value={heading} onChange={e => setHeading(Number(e.target.value))} className="w-full accent-blue-500" />
                    </div>
                </div>

                <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 w-fit">
                    <button 
                        onClick={() => setIsRightHand(true)}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${isRightHand ? 'bg-pink-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                    >
                        Standard (Right)
                    </button>
                    <button 
                        onClick={() => setIsRightHand(false)}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${!isRightHand ? 'bg-pink-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                    >
                        Non-Std (Left)
                    </button>
                </div>

                <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/50 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-slate-500 uppercase">Recommended Entry</span>
                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold bg-white/5 ${sector.text}`}>Sector {sector.id}</div>
                    </div>
                    <div className={`text-4xl font-black mb-4 ${sector.text} tracking-tight`}>
                        {sector.name.toUpperCase()}
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-slate-900/50 rounded-xl border border-slate-800 text-xs text-slate-400">
                        <Info className="text-slate-500 shrink-0" size={16} />
                        <p>
                            Upon reaching the fix, initiate the <strong>{sector.name}</strong> procedure. 
                            Maintain {isRightHand ? 'Right' : 'Left'} turns within the pattern after the initial entry.
                        </p>
                    </div>
                </div>
            </div>

            <div className="relative flex items-center justify-center min-h-[400px]">
                {/* Visual Dial */}
                <div className="relative w-80 h-80 rounded-full border-2 border-slate-800 bg-slate-950 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    {/* Compass Rose Numbers */}
                    {[0, 90, 180, 270].map(deg => (
                        <div key={deg} className="absolute inset-0 flex items-start justify-center p-2 font-mono text-[10px] text-slate-700" style={{ transform: `rotate(${deg}deg)` }}>
                            <span style={{ transform: `rotate(${-deg}deg)` }}>{deg === 0 ? 'N' : deg === 90 ? 'E' : deg === 180 ? 'S' : 'W'}</span>
                        </div>
                    ))}

                    {/* Sectors Background */}
                    <div 
                        className="absolute inset-2 rounded-full opacity-20 transition-all duration-700 overflow-hidden"
                        style={{
                            background: `conic-gradient(
                                from ${inbound}deg,
                                #22c55e 0deg ${isRightHand ? '180deg' : '180deg'}, 
                                #f97316 ${isRightHand ? '180deg 250deg' : '290deg 360deg'},
                                #3b82f6 ${isRightHand ? '250deg 360deg' : '180deg 290deg'}
                            )`
                        }}
                    ></div>

                    {/* Sector Labels (Static Positions relative to inbound) */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        {/* Direct Label */}
                        <div className="absolute font-bold text-[8px] text-green-500/60 uppercase" style={{ transform: `rotate(${inbound + 90}deg) translateY(-80px)` }}>Direct</div>
                        {/* Parallel Label */}
                        <div className="absolute font-bold text-[8px] text-blue-500/60 uppercase" style={{ transform: `rotate(${inbound + (isRightHand ? 305 : 235)}deg) translateY(-80px)` }}>Parallel</div>
                        {/* Offset Label */}
                        <div className="absolute font-bold text-[8px] text-orange-500/60 uppercase" style={{ transform: `rotate(${inbound + (isRightHand ? 215 : 145)}deg) translateY(-80px)` }}>Offset</div>
                    </div>

                    {/* Holding Pattern Visualization */}
                    <div 
                        className="absolute inset-0 flex items-center justify-center transition-transform duration-500"
                        style={{ transform: `rotate(${inbound - 180}deg)` }}
                    >
                        <div className={`w-32 h-16 border-2 border-dashed border-slate-600 rounded-full flex items-center justify-end pr-2 ${isRightHand ? 'origin-left' : 'origin-left'}`}>
                            <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
                        </div>
                        <div className="absolute w-2 h-2 bg-pink-500 rounded-full shadow-[0_0_10px_#ec4899]"></div>
                    </div>

                    {/* Aircraft Needle */}
                    <div 
                        className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
                        style={{ transform: `rotate(${heading}deg)` }}
                    >
                        <div className="w-1 h-32 bg-gradient-to-t from-transparent via-blue-500 to-blue-400 rounded-full relative">
                            <Plane className="absolute -top-3 -left-2 text-white fill-white shadow-xl" size={20} style={{ transform: `rotate(${-heading}deg)` }} />
                        </div>
                    </div>

                    {/* Central Hub */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shadow-inner font-mono text-[10px] text-slate-500">
                            FIX
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative background gradients */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-600/10 blur-[100px] -z-0"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 blur-[100px] -z-0"></div>
        </div>
    );
};

export default HoldingCalculator;
