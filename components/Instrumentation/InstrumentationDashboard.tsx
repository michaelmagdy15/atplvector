import React from 'react';
import { View } from '../../types';
import {
    Activity,
    TrendingUp,
    Plane,
    Settings,
    Compass,
    Database,
    AlertTriangle,
    Zap,
    Wind,
    RotateCcw,
    Radio,
    AlertOctagon,
    Layout
} from 'lucide-react';
import { motion } from 'framer-motion';

interface TopicCardProps {
    title: string;
    description: string;
    view: View;
    icon: any;
    onNavigate: (view: View) => void;
    color: string;
}

const TopicCard: React.FC<TopicCardProps> = ({ title, description, view, icon: Icon, onNavigate, color }) => (
    <motion.div
        whileHover={{ scale: 1.02, translateY: -5 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onNavigate(view)}
        className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 rounded-2xl cursor-pointer hover:border-slate-700 transition-all group relative overflow-hidden"
    >
        <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-500/10 blur-3xl -mr-8 -mt-8 group-hover:bg-${color}-500/20 transition-colors`}></div>

        <div className={`w-12 h-12 rounded-xl bg-${color}-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
            <Icon className={`w-6 h-6 text-${color}-400`} />
        </div>

        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{description}</p>

        <div className="mt-4 flex items-center text-xs font-bold text-slate-500 uppercase tracking-widest group-hover:text-white transition-colors">
            Enter Lab
            <motion.span
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
                className="ml-2"
            >
                →
            </motion.span>
        </div>
    </motion.div>
);

const InstrumentationDashboard: React.FC<{ onChangeView: (view: View) => void; isLocked?: boolean }> = ({ onChangeView, isLocked = false }) => {
    const topics = [
        {
            title: "Pitot-Static System",
            description: "The foundation of pressure instruments. Learn about dynamic, static, and total pressure probes.",
            view: View.INST_PITOT_STATIC,
            icon: Wind,
            color: "blue"
        },
        {
            title: "Altimeter Lab",
            description: "Vertical distance measurement. Simulate barometric settings, temperature errors, and altimeter types.",
            view: View.INST_ALTIMETER,
            icon: TrendingUp,
            color: "emerald"
        },
        {
            title: "Airspeed Indicator",
            description: "Measure dynamic pressure. Understand IAS, CAS, EAS, and TAS corrections and blockage effects.",
            view: View.INST_ASI,
            icon: Plane,
            color: "sky"
        },
        {
            title: "Vertical Speed Indicator",
            description: "Rate of pressure change. Explore standard VSI lag vs. instantaneous IVSI response.",
            view: View.INST_VSI,
            icon: Activity,
            color: "indigo"
        },
        {
            title: "Machmeter",
            description: "High-speed navigation. Analyze the ratio of TAS to Speed of Sound and critical Mach numbers.",
            view: View.INST_MACHMETER,
            icon: Zap,
            color: "amber"
        },
        {
            title: "Gyroscope Principles",
            description: "The physics of flight instruments. Interactively explore Rigidity and Precession.",
            view: View.INST_GYROS,
            icon: Settings,
            color: "orange"
        },
        {
            title: "Turn Indicator",
            description: "Rate gyros and coordinated turns. Understand Rate 1, Rate 2, and slip/skid indications.",
            view: View.INST_TURN_INDICATOR,
            icon: RotateCcw,
            color: "cyan"
        },
        {
            title: "Directional Gyro",
            description: "Gyro-stabilized heading reference. Explore apparent drift and transport wander effects.",
            view: View.INST_DG,
            icon: Compass,
            color: "teal"
        },
        {
            title: "Attitude Indicator",
            description: "The artificial horizon. Understand erection systems and acceleration/turning errors.",
            view: View.INST_ATTITUDE,
            icon: Compass,
            color: "rose"
        },
        {
            title: "Magnetic Compass",
            description: "Terrestrial magnetism. Learn about Dip, ANDS, and UNOS errors in the cockpit.",
            view: View.INST_COMPASS,
            icon: Compass,
            color: "yellow"
        },
        {
            title: "Radio Altimeter",
            description: "FMCW radar for AGL height. Understand cone emission and autoland integration.",
            view: View.INST_RADIO_ALT,
            icon: Radio,
            color: "lime"
        },
        {
            title: "Nav Systems (IRS/ADC)",
            description: "Modern avionics. How ADCs and Inertial Reference Systems drive cockpit displays.",
            view: View.INST_NAV_SYSTEMS,
            icon: Database,
            color: "violet"
        },
        {
            title: "FMS & EFIS Display",
            description: "Flight Management and Electronic Displays. Master EHSI modes and color coding.",
            view: View.INST_FMS_EFIS,
            icon: Layout,
            color: "emerald"
        },
        {
            title: "GPWS / EGPWS",
            description: "Ground Proximity Warning System. Modes 1-7 and terrain awareness.",
            view: View.INST_GPWS,
            icon: AlertOctagon,
            color: "red"
        },
        {
            title: "Autopilot & AFCS",
            description: "Automatic Flight Control. Inner/outer loops, servos, and mode selection.",
            view: View.INST_AUTOPILOT,
            icon: Settings,
            color: "sky"
        },
        {
            title: "Autoland System",
            description: "CAT I/II/III operations. Fail passive vs. fail operational requirements.",
            view: View.INST_AUTOLAND,
            icon: Plane,
            color: "purple"
        }
    ];

    return (
        <div className={`max-w-7xl mx-auto px-6 py-12 transition-all ${isLocked ? 'opacity-50 pointer-events-none blur-[2px] grayscale' : ''}`}>
            <div className="mb-12">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-black text-white mb-4 flex items-center gap-4"
                >
                    Instrumentation
                    <span className="text-slate-500 text-2xl font-normal">Subject 022</span>
                    {isLocked && <span className="text-xs bg-red-500/20 text-red-500 px-3 py-1 rounded-full border border-red-500/30 uppercase tracking-widest">Locked</span>}
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-slate-400 max-w-2xl text-lg"
                >
                    Master the complex systems behind the cockpit. Explore interactive simulators for pressure instruments, gyroscopes, and modern inertial navigation.
                </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {topics.map((topic, index) => (
                    <motion.div
                        key={topic.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.03 }}
                    >
                        <TopicCard {...topic} onNavigate={onChangeView} />
                    </motion.div>
                ))}
            </div>

            {/* Summary Note */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-12 p-6 bg-slate-900/30 border border-slate-800 rounded-2xl flex items-start gap-4"
            >
                <div className="p-2 bg-amber-500/20 rounded-lg">
                    <AlertTriangle className="text-amber-400 w-5 h-5" />
                </div>
                <div>
                    <h4 className="text-white font-bold mb-1">Study Note</h4>
                    <p className="text-slate-400 text-sm italic">
                        "All instruments are calibrated to ISA (International Standard Atmosphere). Remember: Input = Error + Output."
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default InstrumentationDashboard;
