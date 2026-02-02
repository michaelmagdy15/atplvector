import React from 'react';
import { motion } from 'framer-motion';
import { CloudRain, Wind, Thermometer, Layers, ArrowRight, Droplets, Sun, Activity, Globe, CloudLightning, Gauge, Zap, Map, FileText, Waves, AlertTriangle, Radio, Eye } from 'lucide-react';
import { View } from '../../types';

interface Props {
    onChangeView?: (view: View) => void;
}

const MetDashboard: React.FC<Props> = ({ onChangeView }) => {

    const modules = [
        {
            title: 'The Atmosphere',
            icon: Layers,
            description: 'Composition, layers, and transition zones.',
            view: View.MET_ATMOSPHERE,
            color: 'from-blue-500/20 to-blue-600/5'
        },
        {
            title: 'ISA & Temperature',
            icon: Thermometer,
            description: 'Lapse rates, ISA calcs, and heat transfer.',
            view: View.MET_TEMPERATURE,
            color: 'from-orange-500/20 to-orange-600/5'
        },
        {
            title: 'Pressure Systems',
            icon: Gauge,
            description: 'Isobars, Pressure gradients, and systems.',
            view: View.MET_PRESSURE,
            color: 'from-indigo-500/20 to-indigo-600/5'
        },
        {
            title: 'Density Altitude',
            icon: Activity,
            description: 'Performance impacts and calculations.',
            view: View.MET_DENSITY,
            color: 'from-emerald-500/20 to-emerald-600/5'
        },
        {
            title: 'Altimetry',
            icon: Activity,
            description: 'QNH, QFE, QNE and altimeter errors.',
            view: View.MET_ALTIMETRY,
            color: 'from-purple-500/20 to-purple-600/5'
        },
        {
            title: 'Wind Systems',
            icon: Wind,
            description: 'Coriolis force, Friction, and Geostrophic flow.',
            view: View.MET_WIND,
            color: 'from-teal-500/20 to-teal-600/5'
        },
        {
            title: 'Local Winds',
            icon: Wind,
            description: 'Sea breezes, Foehn winds, and Catabatics.',
            view: View.MET_LOCAL_WINDS,
            color: 'from-emerald-500/20 to-emerald-600/5'
        },
        {
            title: 'Global Circulation',
            icon: Globe,
            description: 'Hadley cells, ITCZ, and global patterns.',
            view: View.MET_CIRCULATION,
            color: 'from-cyan-500/20 to-cyan-600/5'
        },
        {
            title: 'Depressions',
            icon: Wind,
            description: 'Cyclogenesis and Anticyclonic systems.',
            view: View.MET_DEPRESSIONS_ANTICYCLONES,
            color: 'from-indigo-600/20 to-indigo-700/5'
        },
        {
            title: 'Humidity & Moisture',
            icon: Droplets,
            description: 'Vapor pressure, Dewpoint, and Adiabatics.',
            view: View.MET_HUMIDITY,
            color: 'from-blue-400/20 to-blue-500/5'
        },
        {
            title: 'Clouds & Fog',
            icon: Sun,
            description: 'Formation, Classification, and Fog types.',
            view: View.MET_CLOUD_TYPES,
            color: 'from-slate-400/20 to-slate-500/5'
        },
        {
            title: 'Precipitation',
            icon: CloudRain,
            description: 'Rain, Snow, Hail, and formation models.',
            view: View.MET_PRECIPITATION,
            color: 'from-indigo-400/20 to-indigo-500/5'
        },
        {
            title: 'Frontal Systems',
            icon: ArrowRight,
            description: 'Warm, Cold, and Occluded fronts.',
            view: View.MET_FRONTS,
            color: 'from-red-500/20 to-red-600/5'
        },
        {
            title: 'Air Masses',
            icon: Globe,
            description: 'Polar, Tropical, and Stability profiles.',
            view: View.MET_AIR_MASSES,
            color: 'from-emerald-500/20 to-emerald-600/5'
        },
        {
            title: 'Thunderstorms',
            icon: CloudLightning,
            description: 'Lifecycle, Hazards, and Avoidance.',
            view: View.MET_THUNDERSTORMS,
            color: 'from-yellow-500/20 to-yellow-600/5'
        },
        {
            title: 'Icing',
            icon: Droplets,
            description: 'Structural icing types and prevention.',
            view: View.MET_ICING,
            color: 'from-blue-300/20 to-blue-400/5'
        },
        {
            title: 'Turbulence',
            icon: Activity,
            description: 'Mechanical, Convective, and CAT.',
            view: View.MET_TURBULENCE,
            color: 'from-orange-400/20 to-orange-500/5'
        },
        {
            title: 'Jet Streams',
            icon: Zap,
            description: 'PFJ, STJ, and associated CAT zones.',
            view: View.MET_JET_STREAMS,
            color: 'from-purple-400/20 to-purple-500/5'
        },
        {
            title: 'Visibility',
            icon: Sun,
            description: 'RVR, Slant visibility, and obscurations.',
            view: View.MET_VISIBILITY,
            color: 'from-slate-300/20 to-slate-400/5'
        },
        {
            title: 'Climatology',
            icon: Map,
            description: 'Regional winds, Monsoons, and Waves.',
            view: View.MET_CLIMATOLOGY,
            color: 'from-amber-600/20 to-amber-700/5'
        },
        {
            title: 'Weather Charts',
            icon: Map,
            description: 'SIGWX and Upper air chart decoding.',
            view: View.MET_CHARTS,
            color: 'from-blue-600/20 to-blue-700/5'
        },
        {
            title: 'Tropical Storms',
            icon: Waves,
            description: 'TRS Structure, Avoidance, and Regions.',
            view: View.MET_TRS,
            color: 'from-cyan-600/20 to-cyan-700/5'
        },
        {
            title: 'Special Hazards',
            icon: AlertTriangle,
            description: 'Volcanic Ash, Microbursts, and Space Wx.',
            view: View.MET_SPECIAL_HAZARDS,
            color: 'from-red-600/20 to-red-700/5'
        },
        {
            title: 'Satellite & Radar',
            icon: Radio,
            description: 'Imagery analysis and radar principles.',
            view: View.MET_SATELLITE,
            color: 'from-emerald-600/20 to-emerald-700/5'
        },
        {
            title: 'Reporting',
            icon: FileText,
            description: 'METAR, TAF, and SIGMET interpretation.',
            view: View.MET_METAR_TAF,
            color: 'from-slate-500/20 to-slate-600/5'
        },
        {
            title: 'Optical Phenom.',
            icon: Eye,
            description: 'Rainbows, Halos, and Mirages.',
            view: View.MET_OPTICAL,
            color: 'from-purple-500/20 to-purple-600/5'
        },
        {
            title: 'Station Models',
            icon: Gauge,
            description: 'Synoptic chart plotting and decoding.',
            view: View.MET_STATION_MODEL,
            color: 'from-emerald-500/20 to-emerald-600/5'
        }
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-12">
                <h1 className="text-4xl font-black text-white mb-4 tracking-tight">Meteorology (050)</h1>
                <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
                    A comprehensive visual curriculum for the EASA ATPL Meteorology syllabus.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {modules.map((module, index) => {
                    const Icon = module.icon;
                    return (
                        <motion.div
                            key={index}
                            whileHover={{ y: -4, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onChangeView?.(module.view)}
                            className={`group relative p-6 rounded-[2rem] border border-white/5 bg-gradient-to-br ${module.color} hover:bg-white/5 cursor-pointer transition-all duration-300 shadow-xl`}
                        >
                            <div className="relative z-10 text-center">
                                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 group-hover:bg-white/20 transition-all">
                                    <Icon className="text-white" size={24} />
                                </div>
                                <h3 className="text-sm font-bold text-white mb-2 line-clamp-1">{module.title}</h3>
                                <p className="text-[10px] text-slate-400 leading-tight line-clamp-2">{module.description}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="mt-16 bg-slate-900/50 rounded-[3rem] p-10 border border-white/5">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div>
                        <h4 className="text-2xl font-bold text-white mb-2">Ready for the Exam?</h4>
                        <p className="text-slate-400">Master the 050 syllabus with our integrated question bank.</p>
                    </div>
                    <button
                        onClick={() => onChangeView?.(View.QUESTION_BANK)}
                        className="px-8 py-4 bg-white text-black font-black rounded-2xl hover:bg-slate-200 transition-colors shadow-2xl"
                    >
                        PRACTICE EXAM
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MetDashboard;
