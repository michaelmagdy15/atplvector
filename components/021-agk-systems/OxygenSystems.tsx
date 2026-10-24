import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Wind, 
    ShieldAlert, 
    Users, 
    Beaker, 
    Zap, 
    CheckCircle2, 
    Info, 
    Flame, 
    AlertTriangle,
    Compass,
    Clock
} from 'lucide-react';

// COVERAGE TRACKER - EASA Syllabus
// "021.13.01.01.01" - Cockpit oxygen system modes (normal, 100%, emergency positive pressure).
// "021.13.01.01.02" - Portable oxygen systems (smoke hoods / PBE, portable bottles).
// "021.13.01.01.03" - Passenger oxygen systems (chemical vs gaseous).
// "021.13.01.01.04" - Passenger oxygen mask actuation (automatic 14,000 ft / manual override).
// "021.13.01.01.05" - Chemical candle reactions (>250°C heat, irreversible 12-15 min).

type TabType = 'cockpit' | 'passenger' | 'generators' | 'portable';

export default function OxygenSystems() {
    const [activeTab, setActiveTab] = useState<TabType>('cockpit');

    const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
        { id: 'cockpit', label: 'Flight Deck Diluter-Demand', icon: <Wind className="w-5 h-5" /> },
        { id: 'passenger', label: 'Passenger Drop-down (14,000 FT)', icon: <Users className="w-5 h-5" /> },
        { id: 'generators', label: 'Chemical Candle vs Gaseous', icon: <Beaker className="w-5 h-5" /> },
        { id: 'portable', label: 'Portable O2 & PBE Smoke Hoods', icon: <ShieldAlert className="w-5 h-5" /> },
    ];

    const tabContent = {
        cockpit: (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
            >
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Wind className="text-blue-400" />
                                Flight Deck Quick-Donning Oxygen Regulators
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">
                                High-pressure gaseous oxygen system with quick-donning masks inflatable in &lt; 5 seconds with one hand.
                            </p>
                        </div>
                        <div className="text-xs font-mono px-3 py-1.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-blue-300">
                            Storage Pressure: <span className="font-bold text-white">1,800 – 2,000 PSI</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Normal Mode */}
                        <div className="bg-slate-950 p-6 rounded-2xl border border-blue-500/30 relative overflow-hidden group">
                            <div className="text-xs font-mono uppercase text-blue-400 font-bold mb-2">01. Normal Mode</div>
                            <h4 className="text-lg font-bold text-white mb-2">Diluter Demand</h4>
                            <p className="text-xs text-slate-400 leading-relaxed mb-4">
                                Automatically dilutes pure oxygen with ambient cabin air based on cabin altitude. Conserves oxygen during minor depressurizations.
                            </p>
                            <div className="text-[11px] font-mono text-cyan-300 bg-cyan-950/30 p-2.5 rounded-lg border border-cyan-500/20">
                                Delivers 100% O2 automatically above ~33,000 FT cabin altitude.
                            </div>
                        </div>

                        {/* 100% Mode */}
                        <div className="bg-slate-950 p-6 rounded-2xl border border-purple-500/30 relative overflow-hidden group">
                            <div className="text-xs font-mono uppercase text-purple-400 font-bold mb-2">02. 100% Mode</div>
                            <h4 className="text-lg font-bold text-white mb-2">Pure O2 on Demand</h4>
                            <p className="text-xs text-slate-400 leading-relaxed mb-4">
                                Supplies 100% pure gaseous oxygen on each inhalation, completely bypassing ambient cabin air regardless of altitude.
                            </p>
                            <div className="text-[11px] font-mono text-purple-300 bg-purple-950/30 p-2.5 rounded-lg border border-purple-500/20">
                                Essential selection when cockpit smoke or noxious fumes are suspected.
                            </div>
                        </div>

                        {/* Emergency Positive Pressure */}
                        <div className="bg-slate-950 p-6 rounded-2xl border border-red-500/30 relative overflow-hidden group">
                            <div className="text-xs font-mono uppercase text-red-400 font-bold mb-2">03. Emergency Mode</div>
                            <h4 className="text-lg font-bold text-white mb-2">Continuous Positive Pressure</h4>
                            <p className="text-xs text-slate-400 leading-relaxed mb-4">
                                Delivers 100% oxygen under continuous positive internal pressure into the mask cavity. Forces air into the lungs.
                            </p>
                            <div className="text-[11px] font-mono text-red-300 bg-red-950/30 p-2.5 rounded-lg border border-red-500/20">
                                Positive internal pressure physically prevents toxic fumes from leaking inward around facial seal!
                            </div>
                        </div>
                    </div>

                    {/* Quick Donning Rule */}
                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-300 leading-relaxed">
                            <strong>Quick-Donning Harness Requirement:</strong> Flight crew masks feature pneumatic head harnesses inflated by squeezing red control tabs. Pilots must be capable of donning and establishing radio communication within <strong>5 seconds</strong> with one hand, even while wearing prescription eyeglasses.
                        </p>
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
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Users className="text-emerald-400" />
                        Passenger Drop-down System & Automatic Deployment
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                        Supplies supplemental oxygen to passengers during sudden cabin depressurization, sustaining consciousness while the aircraft carries out an emergency descent to 10,000 ft or Minimum Safe Altitude (MSA).
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-950 p-6 rounded-2xl border border-emerald-500/30 space-y-3">
                            <div className="flex items-center gap-2">
                                <Zap className="w-5 h-5 text-emerald-400" />
                                <h4 className="text-base font-bold text-white">Automatic Actuation Threshold: 14,000 FT</h4>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                An aneroid pressure switch automatically energizes the door latch solenoids on all Passenger Service Units (PSUs) when the <strong>cabin altitude reaches 14,000 ft</strong> (+0/-500 ft). Masks drop immediately under gravity.
                            </p>
                        </div>

                        <div className="bg-slate-950 p-6 rounded-2xl border border-amber-500/30 space-y-3">
                            <div className="flex items-center gap-2">
                                <Wind className="w-5 h-5 text-amber-400" />
                                <h4 className="text-base font-bold text-white">Flight Deck Manual Override</h4>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                The flight crew can manually trigger the PSU release solenoids from a guarded overhead switch (e.g. MASK MAN ON) if an explosive decompression is anticipated or the automatic aneroid switch malfunctions.
                            </p>
                        </div>
                    </div>

                    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3">
                        <h4 className="text-xs font-mono uppercase text-emerald-400 font-bold">
                            Lanyard Firing Pin & Reservoir Bag
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            Each passenger mask is attached by a lanyard to the generator firing pin. <strong>Pulling the mask firmly toward the face pulls the pin</strong>, which releases a spring-loaded striker into a percussion cap, igniting the chemical reaction. The flexible plastic reservoir bag collects pure oxygen between breaths to prevent waste.
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
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Beaker className="text-amber-400" />
                            Chemical Oxygen Candle vs Gaseous Systems
                        </h3>
                        <span className="text-xs font-mono text-amber-400 bg-amber-950/40 px-3 py-1 rounded-xl border border-amber-500/30">
                            Croucher Ch 04 Core Focus
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Chemical Candle */}
                        <div className="bg-slate-950 p-6 rounded-2xl border border-amber-500/40 space-y-4">
                            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                                <h4 className="text-lg font-bold text-amber-300">Chemical Generator (Sodium Chlorate Candle)</h4>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">PSU Standard</span>
                            </div>

                            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                    <span><strong>Chemical Reaction:</strong> Sodium Chlorate ($\text{NaClO}_3$) core mixed with iron powder ($Fe$). Burning iron provides heat to decompose chlorate into salt ($\text{NaCl}$) and pure oxygen ($O_2$).</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Flame className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                                    <span><strong>Intense Heat Generation:</strong> Operates at an extreme exothermic temperature of <strong>&gt; 250°C to 260°C (up to 500°F)</strong>. Insulated by thermal blankets. Characteristic scorched smell in the cabin is normal!</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                                    <span><strong>Duration:</strong> Generates continuous oxygen for <strong>12 to 15 minutes</strong>—calibrated precisely to allow aircraft to dive from FL410 to 10,000 ft.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                                    <span><strong>Irreversible:</strong> Once fired, the chemical reaction <strong>CANNOT BE EXTINGUISHED OR TURNED OFF</strong>. It burns until fuel is fully exhausted.</span>
                                </li>
                            </ul>
                        </div>
                        
                        {/* Gaseous System */}
                        <div className="bg-slate-950 p-6 rounded-2xl border border-blue-500/40 space-y-4">
                            <div className="flex items-center justify-between border-b border-blue-500/20 pb-3">
                                <h4 className="text-lg font-bold text-blue-300">Gaseous Oxygen Cylinders</h4>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">Cockpit & Long-Haul</span>
                            </div>

                            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                                    <span><strong>Storage:</strong> Compressed aviator's breathing oxygen (ABO) stored in green or yellow steel/composite cylinders at 1,800–2,000 PSI.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                                    <span><strong>Valving:</strong> Can be turned on, adjusted, and turned off at will. Zero heat generation.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                                    <span><strong>Overpressure Protection:</strong> Fitted with thermal relief burst discs venting through an external green blowout indicator disc on the fuselage skin.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                                    <span><strong>Standard:</strong> Mandatory for flight deck crew; optional for passengers on extended over-mountain routes (Himalayan routes requiring &gt; 22 min O2).</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Green Thermal Disc Exam Trap */}
                    <div className="bg-amber-950/20 border border-amber-500/30 p-5 rounded-2xl flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                        <div className="text-xs text-amber-200/90 leading-relaxed">
                            <strong>Pre-Flight Walkaround Exam Trap:</strong>
                            On walkaround, pilots inspect the green thermal discharge indicator disc on the forward fuselage. If the green disc is missing, the gaseous cylinder has suffered overpressure/thermal venting and the cylinder is completely empty! Dispatch is prohibited.
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
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                        <ShieldAlert className="text-rose-400" />
                        Portable Oxygen & Protective Breathing Equipment (PBE)
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                        Cabin crew require portable oxygen bottles for mobility during emergency post-decompression first aid, and smoke hoods (PBE) for fighting in-flight cargo/galley fires.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3">
                            <h4 className="text-base font-bold text-rose-300">Portable Oxygen Bottles</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Lightweight portable cylinders fitted with shoulder straps and constant-flow masks.
                            </p>
                            <ul className="space-y-2 text-xs text-slate-300">
                                <li>• <strong>Dual Outlets:</strong> High flow (4 L/min for first aid) and Low flow (2 L/min for walking/patrolling).</li>
                                <li>• <strong>Fire Hazard Warning:</strong> NEVER use portable O2 masks near open flames or active fire (pure oxygen accelerates combustion!).</li>
                                <li>• <strong>Pressure Gauge:</strong> Must read minimum 1,500 PSI during pre-flight safety check.</li>
                            </ul>
                        </div>

                        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3">
                            <h4 className="text-base font-bold text-orange-300">PBE Smoke Hoods (Protective Breathing Equipment)</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Flame-resistant hood sealing tightly around the neck with a rubber diaphragm.
                            </p>
                            <ul className="space-y-2 text-xs text-slate-300">
                                <li>• <strong>Certified Duration:</strong> Provides a minimum of <strong>15 minutes</strong> of breathable oxygen.</li>
                                <li>• <strong>Closed-Loop System:</strong> Uses potassium superoxide ($\text{KO}_2$) canister which absorbs exhaled $CO_2$ and moisture while releasing fresh $O_2$.</li>
                                <li>• <strong>Full Protection:</strong> Shields eyes, face, and respiratory system from toxic hydrogen cyanide and dense carbon smoke.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </motion.div>
        )
    };

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-8 min-h-screen">
            {/* Page Header */}
            <div>
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-blue-400 mb-2">
                    <span>EASA 021.13</span>
                    <span>•</span>
                    <span>Aircraft General Knowledge</span>
                    <span>•</span>
                    <span>Oxygen Systems</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight flex items-center gap-3">
                    <Wind className="text-blue-400 w-10 h-10" />
                    Aviation Oxygen Systems
                </h1>
                <p className="text-slate-400 mt-2 max-w-3xl text-base md:text-lg">
                    Flight deck quick-donning diluter demand masks (Normal, 100%, Emergency positive pressure), 14,000 ft passenger drop-down activation, sodium chlorate chemical candles (&gt;250°C), and 15-minute PBE smoke hoods.
                </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${
                            activeTab === tab.id
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                        }`}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Tab Body */}
            <AnimatePresence mode="wait">
                {tabContent[activeTab]}
            </AnimatePresence>
        </div>
    );
}
