import React from 'react';
import { motion } from 'framer-motion';
import {
    CloudRain, Wind, Thermometer, Layers, Droplets,
    Sun, Activity, Globe, CloudLightning, LayoutGrid,
    ChevronLeft, Menu
} from 'lucide-react';
import { View } from '../../types';

interface Props {
    children: React.ReactNode;
    currentView: View;
    onNavigate: (view: View) => void;
}

const MeteorologyLayout: React.FC<Props> = ({ children, currentView, onNavigate }) => {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    const modules = [
        { title: 'Dashboard', icon: LayoutGrid, view: View.MET_HOME, color: 'text-slate-400' },
        { title: 'The Atmosphere', icon: Layers, view: View.MET_ATMOSPHERE, color: 'text-blue-400' },
        { title: 'Pressure Systems', icon: Activity, view: View.MET_PRESSURE, color: 'text-indigo-400' },
        { title: 'Density & Altitude', icon: Thermometer, view: View.MET_DENSITY, color: 'text-orange-400' },
        { title: 'Altimetry', icon: Activity, view: View.MET_ALTIMETRY, color: 'text-emerald-400' },
        { title: 'Wind Systems', icon: Wind, view: View.MET_WIND, color: 'text-teal-400' },
        { title: 'Global Circulation', icon: Globe, view: View.MET_CIRCULATION, color: 'text-cyan-400' },
        { title: 'Humidity', icon: Droplets, view: View.MET_HUMIDITY, color: 'text-sky-400' },
        { title: 'Clouds & Precip', icon: CloudRain, view: View.MET_PRECIPITATION, color: 'text-blue-500' },
        { title: 'Frontal Systems', icon: CloudLightning, view: View.MET_FRONTS, color: 'text-violet-400' },
        { title: 'Thunderstorms', icon: CloudLightning, view: View.MET_THUNDERSTORMS, color: 'text-purple-400' },
        { title: 'Icing', icon: Droplets, view: View.MET_ICING, color: 'text-blue-300' },
        { title: 'Visibility', icon: Sun, view: View.MET_VISIBILITY, color: 'text-amber-400' },
        { title: 'Air Masses', icon: Globe, view: View.MET_AIR_MASSES, color: 'text-rose-400' },
        { title: 'Turbulence', icon: Wind, view: View.MET_TURBULENCE, color: 'text-red-400' },
    ];

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row">
            {/* Mobile Header */}
            <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-50">
                <button onClick={() => onNavigate(View.MET_HOME)} className="flex items-center gap-2 text-slate-400">
                    <ChevronLeft size={20} />
                    <span className="font-bold">Back</span>
                </button>
                <span className="font-bold text-white">Meteorology</span>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white p-2 bg-slate-800 rounded-lg">
                    <Menu size={20} />
                </button>
            </div>

            {/* Sidebar */}
            <motion.div
                className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:block transition-transform duration-200 ease-in-out`}
            >
                <div className="h-full overflow-y-auto p-4 custom-scrollbar">
                    <div className="mb-8 px-2 pt-4">
                        <button
                            onClick={() => onNavigate(View.MET_HOME)}
                            className="flex items-center gap-3 text-slate-200 font-black text-xl hover:text-white transition-colors"
                        >
                            <Sun className="text-yellow-500" size={24} />
                            Meteorology
                        </button>
                        <p className="text-xs text-slate-500 mt-1 pl-9">ATPL Training Module</p>
                    </div>

                    <div className="space-y-1">
                        {modules.map((mod) => (
                            <button
                                key={mod.view}
                                onClick={() => {
                                    onNavigate(mod.view);
                                    setIsSidebarOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${currentView === mod.view
                                    ? 'bg-slate-800 text-white shadow-lg shadow-slate-900/50 border border-slate-700/50'
                                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                                    }`}
                            >
                                <mod.icon size={18} className={`${currentView === mod.view ? mod.color : 'text-slate-600'} transition-colors`} />
                                {mod.title}
                            </button>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsSidebarOpen(false)} />
            )}

            {/* Main Content */}
            <div className="flex-1 min-w-0 h-screen overflow-y-auto">
                {/* Content Wrapper */}
                <div className="max-w-7xl mx-auto p-4 md:p-8 pb-32">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default MeteorologyLayout;
