
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, CloudFog, Eye, Wind } from 'lucide-react';

const VisibilityFog: React.FC = () => {
    const [fogType, setFogType] = useState<'RADIATION' | 'ADVECTION' | 'UPSLOPE' | 'STEAM' | 'FRONTAL'>('RADIATION');

    const definitions = {
        RADIATION: {
            title: 'Radiation Fog',
            conditions: 'Clear skies, calm wind (<5kt), high humidity, night/early morning.',
            formation: 'Ground cools rapidly at night (radiation), cooling the contact air to dew point.',
            clearance: 'Sunlight (insolation) or strong wind (lifts to Stratus).',
            icon: <CloudFog className="text-purple-400" />
        },
        ADVECTION: {
            title: 'Advection Fog',
            conditions: 'Moist warm air moving over a cold surface. Wind > 10kt.',
            formation: 'Warm moist air is blown (advected) over a cold surface (sea/land), cooling it to dew point.',
            clearance: 'Change of wind direction or air mass.',
            icon: <Wind className="text-blue-400" />
        },
        UPSLOPE: {
            title: 'Hill/Orographic Fog',
            conditions: 'Moist air forced up a slope.',
            formation: 'Adiabatic cooling as air rises up terrain reaches saturation.',
            clearance: 'Air descending on leeward side (Foehn effect).',
            icon: <ActivityIcon />
        },
        STEAM: {
            title: 'Steam Fog (Arctic Smoke)',
            conditions: 'Cold stable air moving over warmer water.',
            formation: 'Evaporation from warm water saturates the cold air immediately above.',
            clearance: 'Turbulence.',
            icon: <CloudFog className="text-gray-400" />
        },
        FRONTAL: {
            title: 'Frontal Fog',
            conditions: 'Warm front passage.',
            formation: 'Rain falling from warm air into cold air below evaporates, saturating the cold air.',
            clearance: 'Passage of the front.',
            icon: <CloudFog className="text-indigo-400" />
        }
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Selector */}
                <div className="col-span-1 space-y-2">
                    {Object.entries(definitions).map(([key, data]) => (
                        <button
                            key={key}
                            onClick={() => setFogType(key as any)}
                            className={`w-full p-4 rounded-xl text-left border transition-all ${fogType === key
                                    ? 'bg-slate-800 border-indigo-500 shadow-lg'
                                    : 'bg-slate-900 border-slate-800 hover:bg-slate-800'
                                }`}
                        >
                            <h4 className={`font-bold text-sm ${fogType === key ? 'text-white' : 'text-slate-400'}`}>{data.title}</h4>
                            <div className="text-[10px] text-slate-500 truncate">{data.conditions}</div>
                        </button>
                    ))}
                </div>

                {/* Content View */}
                <div className="col-span-1 lg:col-span-2 bg-slate-900 border border-slate-800 p-8 rounded-3xl relative overflow-hidden min-h-[400px] flex flex-col justify-end">
                    <div className="absolute inset-0 bg-slate-950">
                        {/* Visuals Background */}
                        {fogType === 'RADIATION' && (
                            <div className="relative w-full h-full">
                                <div className="absolute bottom-0 w-full h-1/3 bg-emerald-900/50"></div>
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
                                    className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-gray-400/50 to-transparent blur-xl"
                                />
                                <div className="absolute top-10 right-10">
                                    <Sun className="text-yellow-600 opacity-20" size={40} />
                                </div>
                            </div>
                        )}
                        {fogType === 'ADVECTION' && (
                            <div className="relative w-full h-full">
                                <div className="absolute bottom-0 w-1/2 h-full bg-blue-900/20"></div>
                                <div className="absolute bottom-0 right-0 w-1/2 h-full bg-emerald-900/20"></div>
                                <motion.div
                                    animate={{ x: [0, 100, 0] }}
                                    transition={{ repeat: Infinity, duration: 10 }}
                                    className="absolute bottom-10 left-10 text-white/50"
                                >
                                    <Wind size={64} />
                                </motion.div>
                            </div>
                        )}
                        {/* More visual placeholders could go here */}
                    </div>

                    <div className="relative z-10 bg-black/60 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                {definitions[fogType].icon}
                                {definitions[fogType].title}
                            </h3>
                            <div className="px-2 py-1 bg-slate-800 rounded text-xs font-mono text-slate-400">
                                METAR: FG (Vis &lt; 1000m)
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">How it Forms</h4>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    {definitions[fogType].formation}
                                </p>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">Clearance</h4>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    {definitions[fogType].clearance}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* RVR Section */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-6">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                    <Eye className="text-slate-400" />
                </div>
                <div>
                    <h4 className="text-white font-bold mb-1">Runway Visual Range (RVR)</h4>
                    <p className="text-sm text-slate-400">
                        Reported when visibility is less than 1500m. Measured by transmissometers at 3 points (Touchdown, Mid, End).
                        Can be significantly higher than MET visibility due to runway lights intensity.
                    </p>
                </div>
            </div>
        </div>
    );
};

const ActivityIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
    </svg>
);

export default VisibilityFog;
