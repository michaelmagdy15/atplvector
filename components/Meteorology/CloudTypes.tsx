import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, CloudRain, CloudLightning, Info, AlertTriangle, Layers, ArrowUp, Snowflake } from 'lucide-react';

type CloudLevel = 'High' | 'Medium' | 'Low' | 'Vertical';

interface CloudInfo {
    name: string;
    description: string;
    precipitation: string;
    icingTurbulence: string;
    composition: string;
    baseRange: string;
    icon: any;
}

const cloudData: Record<CloudLevel, CloudInfo[]> = {
    High: [
        { name: 'Cirrus (CI)', description: 'Detached, delicate white filaments. Often indicating changing weather.', precipitation: 'None', icingTurbulence: 'None/Trace', composition: 'Ice Crystals', baseRange: '20,000ft+', icon: Cloud },
        { name: 'Cirrocumulus (CC)', description: 'Thin white patches composed of very small ripples.', precipitation: 'None', icingTurbulence: 'Light', composition: 'Ice Crystals', baseRange: '20,000ft+', icon: Cloud },
        { name: 'Cirrostratus (CS)', description: 'Transparent whitish veil. Produces HALO effects around sun/moon.', precipitation: 'None', icingTurbulence: 'Trace', composition: 'Ice Crystals', baseRange: '20,000ft+', icon: Layers },
    ],
    Medium: [
        { name: 'Altocumulus (AC)', description: 'White/grey patches. Can indicate instability if "Castellanus".', precipitation: 'Virga possible', icingTurbulence: 'Moderate Icing', composition: 'Water droplets', baseRange: '6,500 - 20,000ft', icon: Cloud },
        { name: 'Altostratus (AS)', description: 'Greyish/bluish sheet. Sun appears "watery" or blurred.', precipitation: 'Light continuous', icingTurbulence: 'Moderate Icing', composition: 'Water/Ice mix', baseRange: '6,500 - 20,000ft', icon: Layers },
        { name: 'Nimbostratus (NS)', description: 'Dark grey, thick layer. Obliterates the sun completely.', precipitation: 'Moderate continuous rain/snow', icingTurbulence: 'Moderate/Severe Icing', composition: 'Water/Ice/Snow', baseRange: '2,000 - 10,000ft (Extensive)', icon: CloudRain },
    ],
    Low: [
        { name: 'Stratocumulus (SC)', description: 'Grey/whitish patch or layer with dark parts. Large lumpy masses.', precipitation: 'Drizzle/Light rain', icingTurbulence: 'Light/Mod Icing', composition: 'Water droplets', baseRange: '0 - 6,500ft', icon: Cloud },
        { name: 'Stratus (ST)', description: 'Uniform grey layer, similar to fog but not on ground. Ragged when "fractus".', precipitation: 'Drizzle/Snow grains', icingTurbulence: 'Light/Mod in clouds', composition: 'Water droplets', baseRange: '0 - 2,000ft', icon: Layers },
    ],
    Vertical: [
        { name: 'Cumulus (CU)', description: 'Detached, dense with sharp outlines. Cauliflower shape.', precipitation: 'Showers if heavy', icingTurbulence: 'Moderate Vertical', composition: 'Water droplets', baseRange: '1,500 - 5,000ft', icon: Cloud },
        { name: 'Cumulonimbus (CB)', description: 'Heavy dense cloud of great vertical extent. Anvil top (Capillatus).', precipitation: 'Heavy showers, hail', icingTurbulence: 'Severe (Icing/Turbulence/Microbursts)', composition: 'Water/Ice/Hail', baseRange: 'Under 6,500ft to Tropopause', icon: CloudLightning },
    ]
};

const CloudTypes: React.FC = () => {
    const [level, setLevel] = useState<CloudLevel>('Low');

    return (
        <div className="space-y-8 p-4 md:p-6 max-w-7xl mx-auto text-slate-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black text-white flex items-center gap-3">
                        <Cloud className="text-sky-400 stroke-[2.5]" />
                        Cloud Classifications
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Classified by height of base and formation type.</p>
                </div>

                <div className="flex flex-wrap bg-slate-900/80 p-1 rounded-2xl border border-slate-800 backdrop-blur-sm">
                    {(['High', 'Medium', 'Low', 'Vertical'] as const).map((l) => (
                        <button
                            key={l}
                            onClick={() => setLevel(l)}
                            className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${level === l ? 'bg-sky-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            {l}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Cloud Visual List */}
                <div className="lg:col-span-2 space-y-4">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={level}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-4"
                        >
                            {cloudData[level].map((cloud, idx) => (
                                <CloudCard key={idx} cloud={cloud} />
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Legend / Height Visual */}
                <div className="bg-slate-950 rounded-[2rem] border border-slate-800 p-8 sticky top-24">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Layers className="text-sky-400" size={18} />
                        Atmospheric Profile
                    </h3>

                    <div className="relative h-96 w-full bg-gradient-to-t from-slate-900 to-sky-900/30 rounded-2xl border border-slate-800/50 overflow-hidden">
                        {/* Altitude markers */}
                        <div className="absolute left-4 h-full flex flex-col justify-between py-4 text-[10px] font-mono text-slate-500">
                            <span>FL450 (13km)</span>
                            <span>FL200 (6km)</span>
                            <span>6500ft (2km)</span>
                            <span>Surface</span>
                        </div>

                        {/* Highlight Zone */}
                        <motion.div
                            animate={{
                                top: level === 'High' ? '0%' : level === 'Medium' ? '40%' : level === 'Low' ? '75%' : '20%',
                                height: level === 'Vertical' ? '80%' : '25%'
                            }}
                            className="absolute left-0 right-0 bg-sky-400/10 border-y border-sky-400/30 backdrop-blur-[2px] z-10"
                        />

                        {/* Icons Floating */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-20">
                            {level === 'Vertical' && <CloudLightning size={120} className="text-white animate-pulse" />}
                            {level === 'High' && <Snowflake size={100} className="text-white" />}
                        </div>
                    </div>

                    <div className="mt-8 space-y-4">
                        <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
                            <div className="flex items-center gap-2 text-orange-400 font-bold text-xs uppercase mb-1">
                                <AlertTriangle size={14} /> Warning
                            </div>
                            <p className="text-[10px] text-slate-400 leading-relaxed">
                                Icing refers to sub-freezing water droplets. It's most severe in <strong>AS, NS, SC</strong> and especially in <strong>CB</strong>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CloudCard = ({ cloud }: { cloud: CloudInfo }) => {
    const Icon = cloud.icon;
    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl hover:border-sky-500/30 transition-all group">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-slate-950 flex items-center justify-center text-sky-400 border border-slate-800 shadow-inner">
                        <Icon size={32} />
                    </div>
                </div>

                <div className="flex-grow space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <h4 className="text-xl font-black text-white">{cloud.name}</h4>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-slate-950 rounded-full text-[10px] font-bold text-slate-500 border border-slate-800">{cloud.baseRange}</span>
                            <span className="px-3 py-1 bg-slate-950 rounded-full text-[10px] font-bold text-slate-500 border border-slate-800">{cloud.composition}</span>
                        </div>
                    </div>

                    <p className="text-sm text-slate-400 leading-relaxed italic">"{cloud.description}"</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                        <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
                            <CloudRain size={16} className="text-blue-400" />
                            <div>
                                <span className="text-[10px] font-bold text-slate-600 uppercase block">Precipitation</span>
                                <span className="text-xs text-white uppercase">{cloud.precipitation}</span>
                            </div>
                        </div>
                        <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
                            <ArrowUp size={16} className="text-orange-400" />
                            <div>
                                <span className="text-[10px] font-bold text-slate-600 uppercase block">Icing/Turbulence</span>
                                <span className="text-xs text-white uppercase">{cloud.icingTurbulence}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CloudTypes;
