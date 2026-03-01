import React from 'react';
import { motion } from 'framer-motion';
import {
    Scale,
    Calculator,
    ArrowRight,
    AlertTriangle,
    Info,
    Box,
    TrendingDown,
    Layout,
    FileSpreadsheet,
    Shuffle,
    Percent,
    Plane,
    Truck,
    Users
} from 'lucide-react';
import { View } from '../../types';

interface ModuleCardProps {
    title: string;
    description: string;
    icon: any;
    onClick: () => void;
    color: string;
    isLocked?: boolean;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ title, description, icon: Icon, onClick, color, isLocked }) => (
    <motion.button
        variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
        }}
        whileHover={{ scale: 1.02, y: -5 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        disabled={isLocked}
        className={`glass-card p-6 text-left w-full h-full flex flex-col group relative overflow-hidden ${isLocked ? 'opacity-50 grayscale cursor-not-allowed' : 'cursor-pointer'}`}
    >
        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Icon className="w-16 h-16" />
        </div>

        <div className={`w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-6 border border-primary/20 group-hover:bg-primary/30 transition-all duration-300`}>
            <Icon className={`w-6 h-6 text-secondary`} />
        </div>

        <h3 className="text-xl font-bold text-white mb-2 font-sans tracking-tight">{title}</h3>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed flex-grow font-sans">{description}</p>

        {!isLocked && (
            <div className="flex items-center text-accent text-sm font-bold mt-auto group/btn">
                <span className="tracking-wider uppercase text-xs">Initialize</span>
                <div className="ml-2 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center group-hover/btn:bg-accent group-hover/btn:text-background transition-all">
                    <ArrowRight className="w-4 h-4" />
                </div>
            </div>
        )}

        {isLocked && (
            <div className="absolute top-4 right-4 text-slate-500">
                <div className="w-6 h-6 rounded-full border border-slate-600 flex items-center justify-center">
                    <div className="w-3 h-3 bg-slate-600 rounded-[1px]"></div>
                </div>
            </div>
        )}
    </motion.button>
);

interface Props {
    onNavigate: (view: View) => void;
    isLocked?: boolean;
}

const MassBalanceDashboard: React.FC<Props> = ({ onNavigate, isLocked }) => {

    const modules = [
        {
            id: 'quiz',
            title: 'Guided Wizard',
            description: 'Step-by-step exam question walkthroughs. Guaranteed success!',
            icon: Calculator,
            color: 'emerald',
            view: View.MASS_BAL_QUIZ
        },
        {
            id: 'definitions',
            title: 'Mass Definitions',
            description: 'Interactive visualizer for BEM, DOM, TOM, and ZFM relationships.',
            icon: Info,
            color: 'blue',
            view: View.MASS_BAL_DEFINITIONS
        },
        {
            id: 'weighing',
            title: 'Weighing Procedure',
            description: 'Simulate aircraft weighing and calculate CG from reaction forces.',
            icon: Scale,
            color: 'purple',
            view: View.MASS_BAL_CG_CALC
        },
        {
            id: 'mac',
            title: 'MAC Visualizer',
            description: 'Understand Mean Aerodynamic Chord and %MAC calculations.',
            icon: Percent,
            color: 'cyan',
            view: View.MASS_BAL_MAC
        },
        {
            id: 'cg_calc',
            title: 'Load Sheet Sim',
            description: 'Plan your load: Pax, Cargo, and Fuel. Verify CG limits.',
            icon: FileSpreadsheet,
            color: 'green',
            view: View.MASS_BAL_LOADSHEET
        },
        {
            id: 'trim',
            title: 'Trim Sheet Sim',
            description: 'Traditional trim sheet plotting practice.',
            icon: Layout,
            color: 'slate',
            view: View.MASS_BAL_TRIM_SHEET
        },
        {
            id: 'limits',
            title: 'Loading Limits',
            description: 'Explore structural vs performance limits (MSTOM, PLTOM).',
            icon: AlertTriangle,
            color: 'amber',
            view: View.MASS_BAL_LIMITS
        },
        {
            id: 'fuel',
            title: 'Fuel Density',
            description: 'Convert Volume to Mass based on SG/Density.',
            icon: TrendingDown,
            color: 'yellow',
            view: View.MASS_BAL_FUEL
        },
        {
            id: 'cg_shift',
            title: 'CG Shift (Move/Add)',
            description: 'Visualizer for moving, adding, or removing mass.',
            icon: Shuffle,
            color: 'indigo',
            view: View.MASS_BAL_CG_SHIFT
        },
        {
            id: 'cargo_shift',
            title: 'Cargo Handling',
            description: 'Simulate cargo shifting and its effect on CG.',
            icon: Truck,
            color: 'orange',
            view: View.MASS_BAL_SHIFT
        },
        {
            id: 'converter',
            title: 'Unit Converter',
            description: 'Convert between kg, lbs, USG, Litres.',
            icon: Calculator,
            color: 'pink',
            view: View.MASS_BAL_CONVERTER
        },
        {
            id: 'effects_mass',
            title: 'Effects of Mass',
            description: 'Impact of high mass on performance and speeds.',
            icon: TrendingDown,
            color: 'red',
            view: View.MASS_BAL_EFFECTS
        },
        {
            id: 'effects_cg',
            title: 'Effects of CG Position',
            description: 'Stability, Control, and Stalls vs CG location.',
            icon: Plane,
            color: 'blue',
            view: View.MASS_BAL_CG_EFFECTS
        },
        {
            id: 'structural',
            title: 'Structural Limits',
            description: 'V-n diagrams and structural load limitations.',
            icon: Layout,
            color: 'red',
            view: View.MASS_BAL_STRUCTURAL
        },
        {
            id: 'stall_speed',
            title: 'Stall Speed Calc',
            description: 'Calculate Vs based on Mass and Load Factor.',
            icon: Calculator,
            color: 'orange',
            view: View.MASS_BAL_STALL_SPEED
        },
        {
            id: 'fleet',
            title: 'Fleet Weighing',
            description: 'Rules for weighing mass of fleet aircraft.',
            icon: Users,
            color: 'teal',
            view: View.MASS_BAL_FLEET
        },
        {
            id: 'cargo_types',
            title: 'Cargo Types',
            description: 'Dangerous goods and special cargo handling.',
            icon: Box,
            color: 'emerald',
            view: View.MASS_BAL_CARGO_TYPES
        },
        {
            id: 'std_masses',
            title: 'Standard Masses',
            description: 'Standard masses for Pax and Baggage (Tables).',
            icon: Users,
            color: 'violet',
            view: View.MASS_BAL_STD_MASSES
        },
        {
            id: 'flow',
            title: 'Mass Build-up',
            description: 'Flow diagram showing how masses aggregate up to TOM.',
            icon: TrendingDown,
            color: 'indigo',
            view: View.MASS_BAL_FLOW_DIAGRAM
        },
    ];

    return (
        <div className="min-h-screen p-8 pb-32">
            <div className="max-w-7xl mx-auto">
                <header className="mb-16 relative">
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-[100px] animate-pulse delay-700"></div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl font-black mb-4 tracking-tighter text-white font-sans uppercase">
                            <span className="text-glow text-secondary">Mass</span> & Balance
                        </h1>
                        <div className="h-1 w-20 bg-gradient-to-r from-secondary to-accent mb-6 rounded-full"></div>
                        <p className="text-slate-400 text-lg max-w-2xl font-sans leading-relaxed">
                            Precision loading algorithms and aerodynamic center calculation systems.
                            <span className="text-white/60"> Engineered for ATPL candidates.</span>
                        </p>
                    </motion.div>
                </header>

                <motion.div
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.05
                            }
                        }
                    }}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {modules.map((module) => (
                        <ModuleCard
                            key={module.id}
                            {...module}
                            onClick={() => onNavigate(module.view)}
                            isLocked={isLocked}
                        />
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default MassBalanceDashboard;
