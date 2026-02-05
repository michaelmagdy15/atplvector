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
        whileHover={{ scale: 1.02, y: -5 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        disabled={isLocked}
        className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-6 rounded-xl text-left w-full h-full flex flex-col group relative overflow-hidden ${isLocked ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:bg-slate-800/80 cursor-pointer'}`}
    >
        <div className={`w-12 h-12 rounded-lg bg-${color}-500/20 flex items-center justify-center mb-4 group-hover:bg-${color}-500/30 transition-colors`}>
            <Icon className={`w-6 h-6 text-${color}-400`} />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400 text-sm mb-4 leading-relaxed flex-grow">{description}</p>

        {!isLocked && (
            <div className={`flex items-center text-${color}-400 text-sm font-medium mt-auto`}>
                <span>Launch Module</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
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
        <div className="min-h-screen bg-slate-950 text-white p-8 pb-32">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        Mass & Balance
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl">
                        Master the principles of aircraft loading, centre of gravity limits, and performance implications through interactive simulations.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {modules.map((module) => (
                        <ModuleCard
                            key={module.id}
                            {...module}
                            onClick={() => onNavigate(module.view)}
                            isLocked={isLocked}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MassBalanceDashboard;
