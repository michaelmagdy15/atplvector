import React from 'react';
import { motion } from 'framer-motion';
import { CloudRain, Wind, Thermometer, Layers, ArrowRight, Droplets, Sun, Activity, Globe, CloudLightning } from 'lucide-react';
import { View } from '../../types';

interface Props {
    onChangeView?: (view: View) => void;
}

const MetDashboard: React.FC<Props> = ({ onChangeView }) => {

    const modules = [
        {
            title: 'The Atmosphere',
            icon: Layers,
            description: 'Layers, Composition, and Temperature profile.',
            color: 'bg-blue-500',
            view: View.MET_ATMOSPHERE
        },
        {
            title: 'Pressure Systems',
            icon: Activity,
            description: 'Highs, Lows, Q-Codes (QNH/QFE), and Isobars.',
            color: 'bg-indigo-500',
            view: View.MET_PRESSURE
        },
        {
            title: 'Density & Altitude',
            icon: Thermometer,
            description: 'Density Altitude, ISA deviation, and performance impacts.',
            color: 'bg-orange-500',
            view: View.MET_DENSITY
        },
        {
            title: 'Altimetry',
            icon: Activity,
            description: 'Altimeter settings, calculations, and errors.',
            color: 'bg-emerald-500',
            view: View.MET_ALTIMETRY
        },
        {
            title: 'Wind Systems',
            icon: Wind,
            description: 'Coriolis, geostrophic wind, and local effects.',
            color: 'bg-teal-500',
            view: View.MET_WIND
        },
        {
            title: 'Global Circulation',
            icon: Globe,
            description: 'Three-cell model, ITCZ, and global pressure belts.',
            color: 'bg-cyan-600',
            view: View.MET_CIRCULATION
        },
        {
            title: 'Humidity & Stability',
            icon: Droplets,
            description: 'Latent Heat, Dew Point, Adiabatics (DALR/SALR).',
            color: 'bg-sky-500',
            view: View.MET_HUMIDITY
        },
        {
            title: 'Clouds & Precip',
            icon: CloudRain,
            description: 'Cloud types, formation triggers, and precipitation.',
            color: 'bg-blue-600',
            view: View.MET_PRECIPITATION
        },
        {
            title: 'Frontal Systems',
            icon: CloudLightning,
            description: 'Warm, Cold, and Occluded fronts. Polar Front Theory.',
            color: 'bg-violet-500',
            view: View.MET_FRONTS
        },
        {
            title: 'Thunderstorms',
            icon: CloudLightning,
            description: 'Life cycle, hazards, lightning, and avoidance.',
            color: 'bg-purple-600',
            view: View.MET_THUNDERSTORMS
        },
        {
            title: 'Icing',
            icon: Droplets,
            description: 'Ice accretion types, intensity, and hazards.',
            color: 'bg-blue-400',
            view: View.MET_ICING
        },
        {
            title: 'Visibility & Fog',
            icon: Sun,
            description: 'Fog types (Radiation, Advection), Haze, and RVR.',
            color: 'bg-amber-500',
            view: View.MET_VISIBILITY
        },
        {
            title: 'Air Masses',
            icon: Globe,
            description: 'Source regions and classification (mPw, cTc, etc).',
            color: 'bg-rose-500',
            view: View.MET_AIR_MASSES
        },
        {
            title: 'Turbulence',
            icon: Wind,
            description: 'CAT, Mountain Waves, and Windshear.',
            color: 'bg-red-500',
            view: View.MET_TURBULENCE
        }
    ];

    const handleNavigate = (view: View) => {
        if (onChangeView) {
            onChangeView(view);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4 flex items-center gap-4">
                    <Sun className="text-yellow-500 w-12 h-12 animate-pulse" />
                    Meteorology
                </h1>
                <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
                    Master the elements. Understand the physical processes driving global weather patterns, from the molecular behavior of water vapor to the dynamics of jet streams.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.map((mod, idx) => (
                    <motion.button
                        key={idx}
                        onClick={() => handleNavigate(mod.view)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        className="group relative overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl p-8 text-left transition-all hover:border-slate-600 hover:shadow-2xl hover:shadow-blue-900/10"
                    >
                        <div className={`absolute top-0 right-0 w-32 h-32 ${mod.color} opacity-5 rounded-bl-full md:group-hover:opacity-10 transition-opacity`} />

                        <div className={`w-14 h-14 rounded-2xl ${mod.color} flex items-center justify-center mb-6 shadow-lg`}>
                            <mod.icon className="text-white w-8 h-8" strokeWidth={1.5} />
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                            {mod.title}
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-8 min-h-[40px]">
                            {mod.description}
                        </p>

                        <div className="flex items-center gap-2 text-sm font-bold text-white/50 group-hover:text-white transition-colors">
                            <span>Launch Module</span>
                            <ArrowRight size={16} />
                        </div>
                    </motion.button>
                ))}

                {/* Coming Soon */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-slate-900/30 border border-slate-800/50 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center group"
                >
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-4 group-hover:bg-slate-700 transition-colors">
                        <Thermometer className="text-slate-600" size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-500 mb-2">More Coming Soon</h3>
                    <p className="text-sm text-slate-600 max-w-xs">
                        Climatology, Flight Hazards, and Met Reports.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default MetDashboard;
