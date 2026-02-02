import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Zap, Droplets, Fan, ArrowRight, Gauge, ArrowDown } from 'lucide-react';
import { View } from '../../types';

interface Props {
    setCurrentView: (view: View) => void;
    currentView: View;
    isLocked?: boolean;
}

const AGKSystemsDashboard: React.FC<Props> = ({ setCurrentView, isLocked = false }) => {

    const modules = [
        {
            title: 'Piston Engines',
            icon: Settings,
            description: 'The Otto Cycle, 4-stroke principles, mixture, and ignition systems.',
            color: 'bg-orange-500',
            view: View.AGK_PISTON_ENGINE
        },
        {
            title: 'Gas Turbines',
            icon: Fan,
            description: 'Jet engine principles, Brayton Cycle, intakes, compressors, and exhaust.',
            color: 'bg-blue-500',
            view: View.AGK_JET_ENGINE
        },
        {
            title: 'Electrics',
            icon: Zap,
            description: 'DC/AC generation, batteries, distribution buses, and circuit protection.',
            color: 'bg-yellow-500',
            view: View.AGK_ELECTRICS
        },
        {
            title: 'Hydraulics',
            icon: Droplets,
            description: 'Pascal\'s law, pumps, reservoirs, actuators, and fluid properties.',
            color: 'bg-purple-500',
            view: View.AGK_HYDRAULICS
        },
        {
            title: 'Landing Gear',
            icon: ArrowDown,
            description: 'Retraction logic, indications (3 Green), squat switches, and braking systems.',
            color: 'bg-zinc-500',
            view: View.AGK_LANDING_GEAR
        }
    ];

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4 flex items-center gap-4">
                    <Settings className="text-blue-500 w-12 h-12 animate-spin-slow" />
                    AGK: Systems
                </h1>
                <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
                    Understand the machine. From the combustion cycles powering your engine to the electrical buses powering your avionics.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.map((mod, idx) => (
                    <motion.button
                        key={idx}
                        onClick={() => setCurrentView(mod.view)}
                        disabled={isLocked}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={!isLocked ? { scale: 1.02, y: -5 } : {}}
                        whileTap={!isLocked ? { scale: 0.98 } : {}}
                        className={`group relative overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl p-8 text-left transition-all hover:border-slate-600 hover:shadow-2xl hover:shadow-blue-900/10 ${isLocked ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
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
                            <span>{isLocked ? 'Locked' : 'Launch Module'}</span>
                            <ArrowRight size={16} />
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default AGKSystemsDashboard;
