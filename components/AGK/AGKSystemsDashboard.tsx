import React from 'react';
import { motion } from 'framer-motion';
import { 
    Settings, 
    Zap, 
    Droplets, 
    Fan, 
    ArrowRight, 
    Gauge, 
    ArrowDown, 
    Shield, 
    Plane, 
    Wind, 
    ShieldAlert 
} from 'lucide-react';
import { View } from '../../types';

interface Props {
    setCurrentView: (view: View) => void;
    currentView: View;
    isLocked?: boolean;
}

const AGKSystemsDashboard: React.FC<Props> = ({ setCurrentView, isLocked = false }) => {

    const modules = [
        {
            title: 'Airframes & Structures',
            icon: Shield,
            description: 'Safe Life vs Fail-Safe vs Damage Tolerance, +2.5g/-1.0g limits, Hooke\'s law, and materials.',
            color: 'bg-blue-600',
            view: View.AGK_AIRFRAMES
        },
        {
            title: 'Flight Controls & Flutter',
            icon: Plane,
            description: 'Primary/secondary controls, mass balancing ahead of hinge line, aeroelastic flutter, and buzz.',
            color: 'bg-indigo-600',
            view: View.AGK_FLIGHT_CONTROLS
        },
        {
            title: 'Hydraulics & PTU',
            icon: Droplets,
            description: 'Pascal\'s multiplication, Skydrol vs mineral seals, nitrogen accumulators, and PTU handshake.',
            color: 'bg-purple-600',
            view: View.AGK_HYDRAULICS
        },
        {
            title: 'Air Conditioning & Press.',
            icon: Wind,
            description: 'Engine bleed air extraction, bootstrap ACM refrigeration packs, and outflow valve balance.',
            color: 'bg-cyan-600',
            view: View.AGK_AIR_CONDITIONING
        },
        {
            title: 'Electrics',
            icon: Zap,
            description: '115V/200V 400Hz 3-phase, CSD disconnect rules, TRUs, inverters, and 30-min emergency bus.',
            color: 'bg-yellow-500',
            view: View.AGK_ELECTRICS
        },
        {
            title: 'Landing Gear & Brakes',
            icon: ArrowDown,
            description: 'Retraction sequencing, 3 greens, squat switches, carbon brake cooling, and anti-skid.',
            color: 'bg-emerald-600',
            view: View.AGK_LANDING_GEAR
        },
        {
            title: 'Oxygen Systems',
            icon: ShieldAlert,
            description: 'Diluter-demand flight deck masks, 14,000 ft PSU drop, chemical candles (>250°C), and PBE.',
            color: 'bg-rose-600',
            view: View.AGK_SYSTEMS_OXYGEN
        },
        {
            title: 'Piston Engines',
            icon: Settings,
            description: 'The Otto Cycle, 4-stroke principles, mixture leaning, magnetos, and carburettor icing.',
            color: 'bg-orange-500',
            view: View.AGK_PISTON_ENGINE
        },
        {
            title: 'Gas Turbines',
            icon: Fan,
            description: 'Brayton Cycle, multi-spool compressors, bypass ratios, surge/stall, and thrust reversers.',
            color: 'bg-sky-500',
            view: View.AGK_JET_ENGINE
        }
    ];

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-blue-400 mb-2">
                    <span>EASA Subject 021</span>
                    <span>•</span>
                    <span>Aircraft General Knowledge</span>
                    <span>•</span>
                    <span>Systems</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4 flex items-center gap-4">
                    <Settings className="text-blue-500 w-12 h-12 animate-spin-slow" />
                    AGK: Airframes & Systems
                </h1>
                <p className="text-lg text-slate-400 max-w-3xl leading-relaxed">
                    Master the mechanical, hydraulic, pneumatic, and electrical arteries of commercial transport category aircraft with interactive engineering schematics and ATPL exam-tested principles.
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
                        transition={{ delay: idx * 0.04 }}
                        whileHover={!isLocked ? { scale: 1.02, y: -4 } : {}}
                        whileTap={!isLocked ? { scale: 0.98 } : {}}
                        className={`group relative overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl p-7 text-left transition-all hover:border-slate-600 hover:shadow-2xl hover:shadow-blue-900/10 flex flex-col justify-between ${
                            isLocked ? 'opacity-50 grayscale cursor-not-allowed' : ''
                        }`}
                    >
                        <div className={`absolute top-0 right-0 w-32 h-32 ${mod.color} opacity-5 rounded-bl-full md:group-hover:opacity-15 transition-opacity`} />

                        <div>
                            <div className={`w-14 h-14 rounded-2xl ${mod.color} flex items-center justify-center mb-6 shadow-lg shadow-black/40`}>
                                <mod.icon className="text-white w-7 h-7" strokeWidth={1.8} />
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                                {mod.title}
                            </h3>
                            <p className="text-slate-400 text-xs leading-relaxed mb-6">
                                {mod.description}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-mono font-bold text-white/50 group-hover:text-white transition-colors pt-4 border-t border-slate-800/80">
                            <span>{isLocked ? 'Locked' : 'Launch Interactive Lab'}</span>
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default AGKSystemsDashboard;
