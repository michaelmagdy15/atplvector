import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudRain, Wind, Thermometer, Layers, ArrowRight, Droplets, Sun, Activity } from 'lucide-react';
import AtmosphereMaster from './AtmosphereMaster';
import WindSystems from './WindSystems';
import HumidityLab from './HumidityLab';
import Altimetry from './Altimetry';
import Precipitation from './Precipitation';

const MetDashboard: React.FC = () => {
    const [activeModule, setActiveModule] = useState<string | null>(null);

    const modules = [
        {
            id: 'atmosphere',
            title: 'The Atmosphere',
            icon: Layers,
            description: 'Layers, Composition, Temperature profile, and the ISA model.',
            color: 'bg-blue-500',
            component: AtmosphereMaster
        },
        {
            id: 'wind',
            title: 'Wind Systems',
            icon: Wind,
            description: 'Coriolis, Gradient Wind, Jet Streams, and Local Winds.',
            color: 'bg-teal-500',
            component: WindSystems
        },
        {
            id: 'humidity',
            title: 'Humidity & Stability',
            icon: Droplets,
            description: 'Latent Heat, Dew Point, Adiabatics (DALR/SALR), and Cloud formation.',
            color: 'bg-cyan-500',
            component: HumidityLab
        },
        {
            id: 'altimetry',
            title: 'Altimetry',
            icon: Activity,
            description: 'QNH, QFE, QFF, True Altitude calculation and temperature errors.',
            color: 'bg-emerald-500',
            component: Altimetry
        },
        {
            id: 'precip',
            title: 'Clouds & Precip',
            icon: CloudRain,
            description: 'Cloud classification, precipitation types, and formation processes.',
            color: 'bg-indigo-500',
            component: Precipitation
        }
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans">
            <AnimatePresence mode="wait">
                {!activeModule ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        key="dashboard"
                        className="max-w-7xl mx-auto"
                    >
                        <div className="mb-12">
                            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 flex items-center gap-4">
                                <Sun className="text-yellow-500 w-12 h-12 animate-pulse" />
                                Meteorology
                            </h1>
                            <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
                                Master the elements. Understand the physical processes driving global weather patterns, from the molecular behavior of water vapor to the dynamics of jet streams.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {modules.map((mod) => (
                                <motion.button
                                    key={mod.id}
                                    onClick={() => setActiveModule(mod.id)}
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
                                    <p className="text-slate-400 text-sm leading-relaxed mb-8">
                                        {mod.description}
                                    </p>

                                    <div className="flex items-center gap-2 text-sm font-bold text-white/50 group-hover:text-white transition-colors">
                                        <span>Launch Module</span>
                                        <ArrowRight size={16} />
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        key="module-view"
                        className="max-w-7xl mx-auto"
                    >
                        <button
                            onClick={() => setActiveModule(null)}
                            className="mb-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-slate-900 w-fit"
                        >
                            <ArrowRight className="rotate-180" size={20} />
                            <span className="font-bold">Back to Dashboard</span>
                        </button>

                        {modules.find(m => m.id === activeModule)?.component && React.createElement(modules.find(m => m.id === activeModule)!.component as React.ComponentType)}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MetDashboard;
