import React, { useState } from 'react';
import { Layers, Monitor, User, Sun, Cpu, AlertTriangle, ShieldCheck, CheckCircle2, HelpCircle } from 'lucide-react';

interface ShellCaseStudy {
    id: string;
    title: string;
    flight: string;
    interfaceType: 'LS' | 'LH' | 'LE' | 'LL';
    interfaceLabel: string;
    description: string;
    mismatch: string;
    solution: string;
}

const CASE_STUDIES: ShellCaseStudy[] = [
    {
        id: 'cali',
        title: 'FMC Waypoint Selection & Logic',
        flight: 'American Airlines 965 (Cali, 1995)',
        interfaceType: 'LS',
        interfaceLabel: 'Liveware - Software (L-S)',
        description: 'Crew selected waypoint "ROZO" (entered as "R") on the FMS. In the navigation database, "R" defaulted to ROMEO near Bogota, causing the autopilot to turn the aircraft into mountainous terrain.',
        mismatch: 'Non-intuitive navigation database naming convention and FMC auto-sequencing logic conflicted with crew mental model during high-workload descent.',
        solution: 'Strict SOPs requiring waypoint latitude/longitude cross-verification, enhanced FMS display disambiguation, and CFIT escape procedures.',
    },
    {
        id: 'kegworth',
        title: 'Engine Vibration Display & Control Confusion',
        flight: 'British Midland 092 (Kegworth, 1989)',
        interfaceType: 'LH',
        interfaceLabel: 'Liveware - Hardware (L-H)',
        description: 'Left engine threw a fan blade with heavy airframe vibration. The crew inadvertently throttled back and feathered the good right engine due to ambiguous small vibration meters and air conditioning pack cross-coupling.',
        mismatch: 'Hardware display ergonomics: early electronic engine instruments were small, poorly differentiated, and failed to clearly indicate which engine was vibrating.',
        solution: 'Redesigned EFIS engine display units, prominent warning flags, distinct control shape/feel coding, and non-engine air bleed isolation SOPs.',
    },
    {
        id: 'helios',
        title: 'Pressurization Mode Switch & Hypoxia',
        flight: 'Helios Airways 522 (Grammatiko, 2005)',
        interfaceType: 'LE',
        interfaceLabel: 'Liveware - Environment (L-E)',
        description: 'Aircraft cabin pressurization mode selector was left in "MANUAL" after maintenance ground check. As aircraft climbed past FL300, lack of ambient pressure led to insidious hypoxic incapacitation of the entire flight crew.',
        mismatch: 'Environmental stress (extreme hypoxia at high altitude) combined with failure to recognize cabin altitude warning horn (which shared identical sound with takeoff configuration horn).',
        solution: 'Automated pressurization alert callouts, dedicated cabin altitude warning klaxon differentiated from takeoff warning, and mandatory oxygen mask donning drills.',
    },
    {
        id: 'tenerife',
        title: 'Steep Authority Gradient & Radio Overwrite',
        flight: 'Pan Am 1736 & KLM 4805 (Tenerife, 1977)',
        interfaceType: 'LL',
        interfaceLabel: 'Liveware - Liveware (L-L)',
        description: 'A prestigious KLM captain initiated takeoff without explicit ATC clearance in dense fog. The first officer felt uncomfortable challenging the revered senior training captain, while simultaneous radio transmissions produced a heterodyne squeal.',
        mismatch: 'Liveware-Liveware mismatch: an overly steep trans-cockpit authority gradient suppressed subordinate assertiveness; compounded by ATC-cockpit radio interference.',
        solution: 'Birth of modern Crew Resource Management (CRM), standardized ICAO phraseology ("takeoff" reserved only for actual clearance), and assertive PACE escalation protocol.',
    },
];

const HPLShell: React.FC = () => {
    const [selectedInterface, setSelectedInterface] = useState<'LS' | 'LH' | 'LE' | 'LL'>('LS');
    const [activeCaseId, setActiveCaseId] = useState<string>('cali');

    const activeCase = CASE_STUDIES.find(c => c.id === activeCaseId) || CASE_STUDIES[0];

    return (
        <div className="space-y-8 animate-in fade-in">
            {/* Header Banner */}
            <header className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-sky-500/20 rounded-lg text-sky-400">
                        <Layers size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">The SHELL Model (Edwards 1972 / Hawkins 1975)</h2>
                        <p className="text-xs text-sky-400 font-mono mt-0.5">EASA ATPL Human Performance &amp; Limitations · Topic 040.01</p>
                    </div>
                </div>
                <p className="text-slate-300 text-sm mt-3 leading-relaxed">
                    A conceptual tool for analyzing human-system interfaces and accident causality. 
                    The human operator (<strong className="text-sky-400">Liveware</strong>) sits at the center. 
                    Unlike engineered components, the human cannot be redesigned; rather, the surrounding systems 
                    (<strong className="text-emerald-400">Software</strong>, <strong className="text-amber-400">Hardware</strong>, <strong className="text-purple-400">Environment</strong>, and <strong className="text-sky-300">Liveware</strong>) 
                    must be harmonized to avoid critical interface mismatches.
                </p>
            </header>

            {/* Model & Interface Breakdown */}
            <div className="grid lg:grid-cols-12 gap-8 items-start">
                {/* Visual Model Canvas */}
                <div className="lg:col-span-6 bg-slate-900 p-8 rounded-xl border border-slate-700 flex flex-col items-center justify-center relative min-h-[460px]">
                    <div className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-4">
                        Interactive Interface Selector
                    </div>

                    <div className="relative w-72 h-72 flex items-center justify-center my-6">
                        {/* Center: Liveware (Me / The Human Pilot) */}
                        <div 
                            className="absolute z-20 w-32 h-32 bg-sky-600 rounded-2xl flex flex-col items-center justify-center shadow-2xl border-4 border-slate-900 transform rotate-45 select-none"
                            title="Liveware Core: The human pilot with biological constraints"
                        >
                            <div className="transform -rotate-45 flex flex-col items-center text-white text-center">
                                <User size={28} className="text-white drop-shadow" />
                                <span className="font-black text-xl leading-none mt-1">L</span>
                                <span className="text-[9px] uppercase font-bold tracking-wider text-sky-100">Liveware (Me)</span>
                            </div>
                        </div>

                        {/* Top: Software (S) */}
                        <button
                            onClick={() => setSelectedInterface('LS')}
                            className={`absolute -top-4 z-10 w-24 h-24 bg-emerald-700 rounded-xl flex flex-col items-center justify-center shadow-lg transform rotate-45 border-4 border-slate-800 hover:z-30 hover:bg-emerald-600 transition-all cursor-pointer ${
                                selectedInterface === 'LS' ? 'ring-4 ring-emerald-400 scale-110 z-30 bg-emerald-600 shadow-emerald-500/30' : 'opacity-80 hover:opacity-100'
                            }`}
                        >
                            <div className="transform -rotate-45 flex flex-col items-center text-white">
                                <span className="font-black text-lg">S</span>
                                <span className="text-[9px] uppercase font-bold">Software</span>
                            </div>
                        </button>

                        {/* Right: Hardware (H) */}
                        <button
                            onClick={() => setSelectedInterface('LH')}
                            className={`absolute -right-4 z-10 w-24 h-24 bg-amber-700 rounded-xl flex flex-col items-center justify-center shadow-lg transform rotate-45 border-4 border-slate-800 hover:z-30 hover:bg-amber-600 transition-all cursor-pointer ${
                                selectedInterface === 'LH' ? 'ring-4 ring-amber-400 scale-110 z-30 bg-amber-600 shadow-amber-500/30' : 'opacity-80 hover:opacity-100'
                            }`}
                        >
                            <div className="transform -rotate-45 flex flex-col items-center text-white">
                                <span className="font-black text-lg">H</span>
                                <span className="text-[9px] uppercase font-bold">Hardware</span>
                            </div>
                        </button>

                        {/* Bottom: Environment (E) */}
                        <button
                            onClick={() => setSelectedInterface('LE')}
                            className={`absolute -bottom-4 z-10 w-24 h-24 bg-purple-700 rounded-xl flex flex-col items-center justify-center shadow-lg transform rotate-45 border-4 border-slate-800 hover:z-30 hover:bg-purple-600 transition-all cursor-pointer ${
                                selectedInterface === 'LE' ? 'ring-4 ring-purple-400 scale-110 z-30 bg-purple-600 shadow-purple-500/30' : 'opacity-80 hover:opacity-100'
                            }`}
                        >
                            <div className="transform -rotate-45 flex flex-col items-center text-white">
                                <span className="font-black text-lg">E</span>
                                <span className="text-[9px] uppercase font-bold">Environment</span>
                            </div>
                        </button>

                        {/* Left: Liveware Others (L) */}
                        <button
                            onClick={() => setSelectedInterface('LL')}
                            className={`absolute -left-4 z-10 w-24 h-24 bg-sky-800 rounded-xl flex flex-col items-center justify-center shadow-lg transform rotate-45 border-4 border-slate-800 hover:z-30 hover:bg-sky-600 transition-all cursor-pointer ${
                                selectedInterface === 'LL' ? 'ring-4 ring-sky-400 scale-110 z-30 bg-sky-700 shadow-sky-500/30' : 'opacity-80 hover:opacity-100'
                            }`}
                        >
                            <div className="transform -rotate-45 flex flex-col items-center text-white">
                                <span className="font-black text-lg">L</span>
                                <span className="text-[9px] uppercase font-bold">Liveware</span>
                            </div>
                        </button>
                    </div>

                    <p className="text-xs text-slate-400 italic text-center max-w-sm mt-2">
                        "The blocks must match. Mismatched interfaces lead directly to active slips, lapses, and catastrophic systemic accidents."
                    </p>
                </div>

                {/* Interface Details Panel */}
                <div className="lg:col-span-6 bg-slate-900 p-6 rounded-xl border border-slate-700 space-y-4">
                    {selectedInterface === 'LS' && (
                        <div className="space-y-4 animate-in fade-in">
                            <div className="flex items-center gap-2 text-emerald-400 border-b border-slate-800 pb-3">
                                <Cpu size={22} />
                                <h3 className="text-xl font-bold">Liveware — Software Interface (L-S)</h3>
                            </div>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                The non-physical supporting systems: manuals, standard operating procedures (SOPs), 
                                paper and electronic checklists, computerized databases, navigation charts, and flight deck symbology.
                            </p>
                            <div className="grid sm:grid-cols-2 gap-3 text-xs pt-1">
                                <div className="bg-slate-800/80 p-3 rounded-lg border border-emerald-500/30">
                                    <span className="text-emerald-400 font-bold block mb-1">Optimal Interface:</span>
                                    <ul className="text-slate-300 space-y-1 list-disc pl-4">
                                        <li>Unambiguous checklist items</li>
                                        <li>Standardized ICAO terminology</li>
                                        <li>Error-tolerant flight management software</li>
                                    </ul>
                                </div>
                                <div className="bg-slate-800/80 p-3 rounded-lg border border-red-500/30">
                                    <span className="text-red-400 font-bold block mb-1">Dangerous Mismatch:</span>
                                    <ul className="text-slate-300 space-y-1 list-disc pl-4">
                                        <li>Confusing chart clutter or symbols</li>
                                        <li>Overly convoluted emergency checklists</li>
                                        <li>FMS waypoint duplication causing route diversion</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedInterface === 'LH' && (
                        <div className="space-y-4 animate-in fade-in">
                            <div className="flex items-center gap-2 text-amber-400 border-b border-slate-800 pb-3">
                                <Monitor size={22} />
                                <h3 className="text-xl font-bold">Liveware — Hardware Interface (L-H)</h3>
                            </div>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                The relationship between the human operator and physical equipment: cockpit layout, flight controls, 
                                switches, levers, digital instrumentation, HUDs, and anthropometric seat adjustments.
                            </p>
                            <div className="grid sm:grid-cols-2 gap-3 text-xs pt-1">
                                <div className="bg-slate-800/80 p-3 rounded-lg border border-amber-500/30">
                                    <span className="text-amber-400 font-bold block mb-1">Optimal Interface:</span>
                                    <ul className="text-slate-300 space-y-1 list-disc pl-4">
                                        <li>Tactile shape coding (wheel for gear, airfoil for flaps)</li>
                                        <li>High-contrast sunlight-readable EFIS screens</li>
                                        <li>Reach envelope tailored to 5th-95th percentile humans</li>
                                    </ul>
                                </div>
                                <div className="bg-slate-800/80 p-3 rounded-lg border border-red-500/30">
                                    <span className="text-red-400 font-bold block mb-1">Dangerous Mismatch:</span>
                                    <ul className="text-slate-300 space-y-1 list-disc pl-4">
                                        <li>Switches with identical feel placed side by side</li>
                                        <li>Small, unreadable engine vibration scales</li>
                                        <li>Glare or reflection obscuring warnings</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedInterface === 'LE' && (
                        <div className="space-y-4 animate-in fade-in">
                            <div className="flex items-center gap-2 text-purple-400 border-b border-slate-800 pb-3">
                                <Sun size={22} />
                                <h3 className="text-xl font-bold">Liveware — Environment Interface (L-E)</h3>
                            </div>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                The internal and external environment in which the pilot performs: atmospheric pressure, cabin altitude, 
                                hypoxia, acceleration (+Gz), noise, vibration, thermal stress, radiation, turbulence, and darkness.
                            </p>
                            <div className="grid sm:grid-cols-2 gap-3 text-xs pt-1">
                                <div className="bg-slate-800/80 p-3 rounded-lg border border-purple-500/30">
                                    <span className="text-purple-400 font-bold block mb-1">Optimal Interface:</span>
                                    <ul className="text-slate-300 space-y-1 list-disc pl-4">
                                        <li>Cabin altitude below 8,000 ft</li>
                                        <li>Active noise-canceling headsets</li>
                                        <li>Adequate cockpit climate &amp; airflow control</li>
                                    </ul>
                                </div>
                                <div className="bg-slate-800/80 p-3 rounded-lg border border-red-500/30">
                                    <span className="text-red-400 font-bold block mb-1">Dangerous Mismatch:</span>
                                    <ul className="text-slate-300 space-y-1 list-disc pl-4">
                                        <li>Rapid decompression causing hypoxia within seconds</li>
                                        <li>Cockpit heat stress exacerbating dehydration</li>
                                        <li>Night illusions over featureless terrain (black hole)</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedInterface === 'LL' && (
                        <div className="space-y-4 animate-in fade-in">
                            <div className="flex items-center gap-2 text-sky-400 border-b border-slate-800 pb-3">
                                <User size={22} />
                                <h3 className="text-xl font-bold">Liveware — Liveware Interface (L-L)</h3>
                            </div>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                The interpersonal interactions between people in the aviation system: Captain-First Officer authority 
                                gradients, communication styles, CRM, briefings, pilot-ATC phraseology, and cabin crew coordination.
                            </p>
                            <div className="grid sm:grid-cols-2 gap-3 text-xs pt-1">
                                <div className="bg-slate-800/80 p-3 rounded-lg border border-sky-500/30">
                                    <span className="text-sky-400 font-bold block mb-1">Optimal Interface:</span>
                                    <ul className="text-slate-300 space-y-1 list-disc pl-4">
                                        <li>Synergistic authority gradient (assertive, open)</li>
                                        <li>Standardized PACE challenge-and-response protocol</li>
                                        <li>Clear division of PF (Flying) and PM (Monitoring)</li>
                                    </ul>
                                </div>
                                <div className="bg-slate-800/80 p-3 rounded-lg border border-red-500/30">
                                    <span className="text-red-400 font-bold block mb-1">Dangerous Mismatch:</span>
                                    <ul className="text-slate-300 space-y-1 list-disc pl-4">
                                        <li>Autocratic Captain intimidating junior FO</li>
                                        <li>Simultaneous radio transmissions blocking clearances</li>
                                        <li>Cultural hierarchy barriers hindering error alerts</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Quick navigation pill selector */}
                    <div className="pt-3 border-t border-slate-800 flex gap-2 flex-wrap">
                        <button 
                            onClick={() => setSelectedInterface('LS')} 
                            className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${selectedInterface === 'LS' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                        >
                            L-S Software
                        </button>
                        <button 
                            onClick={() => setSelectedInterface('LH')} 
                            className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${selectedInterface === 'LH' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                        >
                            L-H Hardware
                        </button>
                        <button 
                            onClick={() => setSelectedInterface('LE')} 
                            className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${selectedInterface === 'LE' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                        >
                            L-E Environment
                        </button>
                        <button 
                            onClick={() => setSelectedInterface('LL')} 
                            className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${selectedInterface === 'LL' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                        >
                            L-L Liveware
                        </button>
                    </div>
                </div>
            </div>

            {/* Real World ATPL Accident Case Studies */}
            <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                    <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <AlertTriangle className="text-amber-400" size={20} />
                            SHELL Mismatch Lab: Real-World Accident Case Studies
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Select an accident to analyze the specific SHELL interface failure and systemic remedy.
                        </p>
                    </div>
                    <span className="text-xs font-mono px-2.5 py-1 bg-slate-800 text-amber-300 rounded border border-amber-500/30 w-fit">
                        EASA Case Analysis
                    </span>
                </div>

                {/* Case buttons */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {CASE_STUDIES.map(c => {
                        const isSelected = c.id === activeCaseId;
                        return (
                            <button
                                key={c.id}
                                onClick={() => {
                                    setActiveCaseId(c.id);
                                    setSelectedInterface(c.interfaceType);
                                }}
                                className={`p-3.5 rounded-lg border text-left transition-all ${
                                    isSelected 
                                        ? 'bg-slate-800 border-sky-500 shadow-md shadow-sky-900/30 ring-1 ring-sky-500' 
                                        : 'bg-slate-800/50 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
                                }`}
                            >
                                <span className="text-[10px] font-mono text-sky-400 uppercase block font-semibold">{c.interfaceLabel}</span>
                                <span className="text-xs font-bold text-white block mt-1">{c.flight}</span>
                                <span className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{c.title}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Active Case Detail Card */}
                <div className="bg-slate-800/70 rounded-xl p-5 border border-slate-700 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <h4 className="text-base font-bold text-white">{activeCase.flight} — {activeCase.title}</h4>
                            <span className="text-xs text-sky-400 font-semibold">{activeCase.interfaceLabel} Breakdown</span>
                        </div>
                        <span className="text-xs bg-slate-900 px-3 py-1 rounded text-slate-300 border border-slate-700 font-mono">
                            SHELL Interface: {activeCase.interfaceType}
                        </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                        {activeCase.description}
                    </p>

                    <div className="grid md:grid-cols-2 gap-4 text-xs pt-2">
                        <div className="bg-red-950/30 p-3.5 rounded-lg border border-red-500/30 space-y-1">
                            <div className="flex items-center gap-1.5 text-red-400 font-bold">
                                <AlertTriangle size={14} />
                                <span>The Interface Mismatch:</span>
                            </div>
                            <p className="text-slate-300 leading-relaxed">{activeCase.mismatch}</p>
                        </div>

                        <div className="bg-emerald-950/30 p-3.5 rounded-lg border border-emerald-500/30 space-y-1">
                            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                                <ShieldCheck size={14} />
                                <span>Aviation Engineering &amp; SOP Remedy:</span>
                            </div>
                            <p className="text-slate-300 leading-relaxed">{activeCase.solution}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HPLShell;
