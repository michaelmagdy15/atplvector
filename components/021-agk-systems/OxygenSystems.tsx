import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, ShieldAlert, Users, Beaker, Zap, CheckCircle2, Info } from 'lucide-react';

// COVERAGE TRACKER - do not remove
// "021.13.01.01.01" - Cockpit oxygen system modes (normal, 100%, emergency).
// "021.13.01.01.02" - Portable oxygen systems (smoke hoods, portable bottles).
// "021.13.01.01.03" - Passenger oxygen systems (fixed vs portable).
// "021.13.01.01.04" - Passenger oxygen mask actuation (automatic/manual).
// "021.13.01.01.05" - Chemical generators vs Gaseous systems.

type TabType = 'cockpit' | 'passenger' | 'generators' | 'portable';

export default function OxygenSystems() {
    const [activeTab, setActiveTab] = useState<TabType>('cockpit');

    const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
        { id: 'cockpit', label: 'Cockpit Systems', icon: <Wind className="w-5 h-5" /> },
        { id: 'passenger', label: 'Passenger Systems', icon: <Users className="w-5 h-5" /> },
        { id: 'generators', label: 'Chemical vs Gaseous', icon: <Beaker className="w-5 h-5" /> },
        { id: 'portable', label: 'Portable & PBE', icon: <ShieldAlert className="w-5 h-5" /> },
    ];

    const tabContent = {
        cockpit: (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
            >
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Wind className="text-blue-400" />
                        Flight Deck Oxygen Modes
                    </h3>
                    <p className="text-slate-300 mb-6">
                        Flight crew use quick-donning masks connected to a high-pressure gaseous oxygen system. 
                        The regulators typically offer three main modes of operation:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-blue-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <h4 className="font-bold text-blue-300 mb-2">Normal Mode</h4>
                            <p className="text-sm text-slate-400">
                                Provides a mixture of ambient cabin air and oxygen. The ratio of oxygen increases automatically 
                                as cabin altitude rises, providing 100% oxygen above approximately 30,000 ft.
                            </p>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-purple-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <h4 className="font-bold text-purple-300 mb-2">100% Mode</h4>
                            <p className="text-sm text-slate-400">
                                Delivers 100% pure oxygen on demand, regardless of altitude. Used to avoid inhaling 
                                contaminated cabin air, such as smoke or noxious fumes.
                            </p>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-red-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <h4 className="font-bold text-red-300 mb-2">Emergency Mode</h4>
                            <p className="text-sm text-slate-400">
                                Delivers 100% pure oxygen under continuous positive pressure. This forces oxygen into the lungs 
                                and prevents toxic gases from leaking into the mask.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        ),
        passenger: (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
            >
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Users className="text-emerald-400" />
                        Passenger Drop-down Systems
                    </h3>
                    <p className="text-slate-300 mb-6">
                        Designed to provide supplemental oxygen during a rapid decompression until the aircraft can descend 
                        to a safe altitude (usually 10,000 ft). Uses continuous flow masks.
                    </p>
                    
                    <div className="space-y-4">
                        <div className="bg-slate-900/50 p-5 rounded-lg border border-slate-700/50 flex flex-col sm:flex-row gap-4 items-start">
                            <div className="bg-emerald-500/20 p-3 rounded-full text-emerald-400 shrink-0">
                                <Zap className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-white mb-1">Automatic Deployment</h4>
                                <p className="text-slate-400 text-sm">
                                    Masks drop automatically from Passenger Service Units (PSUs) if the cabin altitude 
                                    exceeds a predetermined threshold, typically <span className="text-emerald-300 font-mono">14,000 ft</span>.
                                </p>
                            </div>
                        </div>
                        
                        <div className="bg-slate-900/50 p-5 rounded-lg border border-slate-700/50 flex flex-col sm:flex-row gap-4 items-start">
                            <div className="bg-amber-500/20 p-3 rounded-full text-amber-400 shrink-0">
                                <Wind className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-white mb-1">Manual Deployment</h4>
                                <p className="text-slate-400 text-sm">
                                    The flight crew can manually trigger the deployment of passenger oxygen masks from 
                                    the flight deck using an override switch if they anticipate a pressure loss or the automatic system fails.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex items-start gap-3 bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
                        <Info className="text-blue-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-200">
                            <strong>Note:</strong> Pulling the mask down activates the oxygen flow (often by pulling a lanyard attached to a firing pin for chemical generators).
                        </p>
                    </div>
                </div>
            </motion.div>
        ),
        generators: (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
            >
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Beaker className="text-amber-400" />
                        Chemical vs Gaseous Systems
                    </h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h4 className="text-lg font-bold text-amber-300 border-b border-amber-900/50 pb-2">Chemical Oxygen Generators</h4>
                            <ul className="space-y-3">
                                {[
                                    'Uses a solid chemical core (usually sodium chlorate).',
                                    'Pulling the mask strikes a firing pin, starting a chemical reaction that produces oxygen.',
                                    'Generates substantial heat during operation (up to 260°C).',
                                    'Cannot be turned off once activated.',
                                    'Provides oxygen for approximately 15 minutes.',
                                    'Lighter and requires no heavy plumbing; common in passenger systems.'
                                ].map((item, idx) => (
                                    <li key={idx} className="flex gap-3 text-sm text-slate-300">
                                        <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div className="space-y-4">
                            <h4 className="text-lg font-bold text-blue-300 border-b border-blue-900/50 pb-2">Gaseous Oxygen Systems</h4>
                            <ul className="space-y-3">
                                {[
                                    'Stores oxygen as a compressed gas in high-pressure cylinders.',
                                    'Can be turned on and off as needed.',
                                    'Requires extensive, heavy plumbing to route oxygen throughout the cabin.',
                                    'Can supply oxygen for longer durations.',
                                    'Standard for flight crew systems; sometimes used for passengers on long-haul/high-altitude routes.'
                                ].map((item, idx) => (
                                    <li key={idx} className="flex gap-3 text-sm text-slate-300">
                                        <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </motion.div>
        ),
        portable: (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
            >
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <ShieldAlert className="text-rose-400" />
                        Portable Oxygen & Protective Breathing Equipment
                    </h3>
                    <p className="text-slate-300 mb-6">
                        Aircraft carry portable oxygen sources for medical emergencies, post-decompression mobility, 
                        and firefighting operations.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-900/50 p-5 rounded-lg border border-slate-700/50">
                            <h4 className="text-lg font-bold text-rose-300 mb-3">Portable Oxygen Bottles</h4>
                            <p className="text-slate-400 text-sm mb-4">
                                Used by cabin crew to move around the cabin following a decompression, or for passenger first aid.
                            </p>
                            <ul className="space-y-2 text-sm text-slate-300">
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Typically have High and Low flow settings.</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Cannot be used for firefighting (fire hazard).</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Stored securely in brackets.</li>
                            </ul>
                        </div>

                        <div className="bg-slate-900/50 p-5 rounded-lg border border-slate-700/50">
                            <h4 className="text-lg font-bold text-orange-300 mb-3">Protective Breathing Equipment (PBE)</h4>
                            <p className="text-slate-400 text-sm mb-4">
                                Also known as "Smoke Hoods", these are self-contained systems protecting the wearer from smoke and toxic fumes.
                            </p>
                            <ul className="space-y-2 text-sm text-slate-300">
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-500" /> Essential for firefighting.</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-500" /> Typically provides ~15 minutes of breathable air.</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-500" /> Protects eyes and respiratory tract.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </motion.div>
        )
    };

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8 pt-24 min-h-screen">
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-4">
                    Oxygen Systems
                </h1>
                <p className="text-slate-400 text-lg max-w-3xl">
                    High-altitude flight requires robust supplemental oxygen systems to protect crew and passengers 
                    from hypoxia in the event of depressurization, as well as toxic fumes during emergencies.
                </p>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                            activeTab === tab.id
                                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25 border-transparent'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-700'
                        }`}
                    >
                        {tab.icon}
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {tabContent[activeTab]}
            </AnimatePresence>
        </div>
    );
}
