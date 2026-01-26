
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUp, Activity, Compass, Wind, Map } from 'lucide-react';

const PressureSystems: React.FC = () => {
    const [qCode, setQCode] = useState<'QNH' | 'QFE' | 'SPS'>('QNH');
    const [systemType, setSystemType] = useState<'HIGH' | 'LOW' | 'RIDGE' | 'TROUGH' | 'COL'>('HIGH');

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Q-Codes Interactive Visualizer */}
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <Activity className="text-indigo-400" /> Altimeter Setting (Q-Codes)
                    </h3>

                    <div className="flex gap-2 mb-8 bg-slate-950 p-1 rounded-xl w-fit">
                        {(['QNH', 'QFE', 'SPS'] as const).map((code) => (
                            <button
                                key={code}
                                onClick={() => setQCode(code)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${qCode === code
                                        ? 'bg-indigo-600 text-white shadow-lg'
                                        : 'text-slate-500 hover:text-white'
                                    }`}
                            >
                                {code}
                            </button>
                        ))}
                    </div>

                    <div className="relative h-64 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-end justify-center">
                        {/* Sea Level */}
                        <div className="absolute bottom-10 w-full h-[1px] bg-blue-500/50 border-t border-dashed border-blue-400">
                            <span className="absolute right-2 -top-5 text-[10px] text-blue-400">MSL (Mean Sea Level)</span>
                        </div>

                        {/* Terrain */}
                        <div className="absolute bottom-0 w-full h-32 bg-emerald-900/30 clip-path-polygon-[0_100%,_30%_60%,_50%_80%,_80%_40%,_100%_100%] border-t border-emerald-500/30"></div>
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            <polygon points="0,256 100,200 250,150 400,256" fill="#064e3b" opacity="0.5" />
                        </svg>

                        {/* Aircraft */}
                        <motion.div
                            className="absolute left-1/2 -translate-x-1/2"
                            animate={{
                                bottom: qCode === 'QFE' ? '40%' : qCode === 'QNH' ? '60%' : '70%'
                            }}
                        >
                            <div className="bg-white p-2 rounded-full shadow-lg shadow-indigo-500/20">
                                <Compass className="text-slate-900 w-6 h-6" />
                            </div>
                            <div className="absolute left-full ml-4 w-32 -top-2">
                                <div className="bg-slate-800 p-2 rounded text-[10px] text-slate-300 border border-slate-700">
                                    <div className="font-bold text-white mb-1">
                                        {qCode === 'QFE' ? 'Height (AGL)' : qCode === 'QNH' ? 'Altitude (AMSL)' : 'Flight Level (PA)'}
                                    </div>
                                    Reads zero at: <br />
                                    <span className="text-indigo-400">
                                        {qCode === 'QFE' ? 'Runway Threshold' : qCode === 'QNH' ? 'Sea Level' : '1013.25 hPa Datum'}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                        <p className="text-sm text-indigo-200">
                            {qCode === 'QNH' && "QNH: The pressure measured at the station reduced to mean sea level. Steps 1013 hPa. Used for Altitude below Transition Altitude."}
                            {qCode === 'QFE' && "QFE: The pressure measured at the station datum (runway). Steps 0 ft at runway. Used for height above ground."}
                            {qCode === 'SPS' && "Standard Pressure Setting (1013.25 hPa). Used for Flight Levels above Transition Altitude. Reference is the standard datum."}
                        </p>
                    </div>
                </div>

                {/* Pressure Systems Visualizer */}
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <Map className="text-emerald-400" /> Pressure Patterns
                    </h3>

                    <div className="grid grid-cols-3 gap-2 mb-6">
                        {(['HIGH', 'LOW', 'RIDGE', 'TROUGH', 'COL'] as const).map(sys => (
                            <button
                                key={sys}
                                onClick={() => setSystemType(sys)}
                                className={`px-2 py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all border ${systemType === sys
                                        ? 'bg-emerald-600 border-emerald-500 text-white'
                                        : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-600'
                                    }`}
                            >
                                {sys}
                            </button>
                        ))}
                    </div>

                    <div className="relative h-64 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center overflow-hidden">
                        {/* Isobars Animation */}
                        {systemType === 'HIGH' && (
                            <div className="relative w-full h-full flex items-center justify-center">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
                                    className="absolute w-48 h-48 rounded-full border-2 border-slate-700 border-dashed"
                                />
                                <div className="text-4xl font-black text-blue-400 bg-slate-900 rounded-full w-16 h-16 flex items-center justify-center z-10 border-4 border-slate-800">H</div>
                                <div className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2">
                                    {/* Outward Arrows for divergence? No, High is clockwise (NH) and divergence at surface. */}
                                    {/* Simply showing clockwise flow */}
                                    <ArrowDown className="absolute top-4 left-1/2 text-slate-600 rotate-[-45deg]" />
                                    <ArrowDown className="absolute bottom-4 left-1/2 text-slate-600 rotate-[135deg]" />
                                </div>
                                <div className="absolute bottom-2 text-xs text-slate-500">Anticyclone (Clockwise in NH)</div>
                            </div>
                        )}

                        {systemType === 'LOW' && (
                            <div className="relative w-full h-full flex items-center justify-center">
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
                                    className="absolute w-48 h-48 rounded-full border-2 border-red-900/50 border-dashed"
                                />
                                <div className="text-4xl font-black text-red-500 bg-slate-900 rounded-full w-16 h-16 flex items-center justify-center z-10 border-4 border-slate-800">L</div>
                                <div className="absolute bottom-2 text-xs text-slate-500">Depression (Anti-Clockwise in NH)</div>
                            </div>
                        )}

                        {(systemType === 'RIDGE' || systemType === 'TROUGH') && (
                            <div className="relative w-full h-full flex items-center justify-center">
                                <svg className="w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
                                    <path
                                        d={systemType === 'RIDGE' ? "M0,100 Q100,-50 200,100" : "M0,0 Q100,150 200,0"}
                                        fill="none"
                                        stroke={systemType === 'RIDGE' ? "#60a5fa" : "#f87171"}
                                        strokeWidth="4"
                                        strokeDasharray="8 4"
                                    />
                                    <path
                                        d={systemType === 'RIDGE' ? "M20,100 Q100,-20 180,100" : "M20,0 Q100,120 180,0"}
                                        fill="none"
                                        stroke={systemType === 'RIDGE' ? "#60a5fa" : "#f87171"}
                                        strokeWidth="2"
                                        opacity="0.5"
                                    />
                                </svg>
                                <div className="absolute text-sm font-bold bg-slate-900 px-2 py-1 rounded text-white">
                                    {systemType === 'RIDGE' ? 'Ridge (Extension of High)' : 'Trough (Extension of Low)'}
                                </div>
                            </div>
                        )}

                        {systemType === 'COL' && (
                            <div className="grid grid-cols-2 grid-rows-2 gap-8 w-full h-full p-8 opacity-50">
                                <div className="flex items-center justify-center border-r border-b border-slate-700">H</div>
                                <div className="flex items-center justify-center border-b border-slate-700">L</div>
                                <div className="flex items-center justify-center border-r border-slate-700">L</div>
                                <div className="flex items-center justify-center">H</div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="bg-slate-900 px-2 text-xs text-slate-400">Neutral Area (Col)</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PressureSystems;
