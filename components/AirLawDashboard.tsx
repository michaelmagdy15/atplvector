
import React from 'react';
import { View } from '../types';
import { Scale, Plane, AlertTriangle, Layout, Map, Tag, BookOpen, Layers, Settings, Compass, ArrowRight, Globe, UserCheck, Shield, Siren, AlertOctagon, Lightbulb, ThermometerSnowflake, Signpost, Cloud, Briefcase, Radio, PlaneLanding, RotateCcw, Crosshair, PenTool, Mountain, Gavel, Truck, GitMerge, Database, UserPlus } from 'lucide-react';

interface Props {
    onChangeView: (view: View) => void;
    isLocked?: boolean;
    onOpenSyllabus?: (id: string) => void;
}

const AirLawDashboard: React.FC<Props> = ({ onChangeView, isLocked = false, onOpenSyllabus }) => {
    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6 pb-20">
            <div className="mb-12 text-center relative">
                {onOpenSyllabus && (
                    <button
                        onClick={() => onOpenSyllabus('010')}
                        className="absolute right-0 top-0 hidden md:flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg transition-all font-bold text-sm shadow-lg"
                    >
                        <BookOpen size={16} />
                        View Syllabus
                    </button>
                )}
                <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                    Air Law Library (010)
                    {isLocked && <span className="ml-4 text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full uppercase tracking-wider border border-red-500/30">Locked</span>}
                </h1>
                <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mb-4">Comprehensive interactive modules covering International Law, Annexes 1-19, Procedures, and Operations.</p>
                {onOpenSyllabus && (
                    <button
                        onClick={() => onOpenSyllabus('010')}
                        className="md:hidden mx-auto flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg transition-all font-bold text-sm shadow-lg"
                    >
                        <BookOpen size={16} />
                        View Syllabus
                    </button>
                )}
            </div>

            {/* SECTION: International Law & Organization */}
            <div className={`mb-10 ${isLocked ? 'opacity-50 pointer-events-none blur-[1px] grayscale-[0.5] select-none' : ''}`}>
                <h2 className="text-xl font-bold text-slate-300 mb-4 border-b border-slate-700 pb-2">International Law & Organisations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div onClick={() => onChangeView(View.AIR_LAW_ORG)} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-blue-500 cursor-pointer group transition-all shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-500/20 rounded-lg text-blue-500"><Globe /></div>
                            <span className="text-xs font-bold text-slate-500">ICAO / EASA / EURO</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">Organisations</h3>
                        <p className="text-slate-400 text-sm">Objectives and structure of ICAO, EASA, and Eurocontrol.</p>
                    </div>
                    <div onClick={() => onChangeView(View.AIR_LAW_INT_LAW)} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-purple-500 cursor-pointer group transition-all shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-purple-500/20 rounded-lg text-purple-500"><Scale /></div>
                            <span className="text-xs font-bold text-slate-500">CHICAGO / CONVENTIONS</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">International Law</h3>
                        <p className="text-slate-400 text-sm">Freedoms of the Air, Chicago Convention, and Penal Law.</p>
                    </div>
                    <div onClick={() => onChangeView(View.AIR_LAW_LIABILITY)} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-purple-500 cursor-pointer group transition-all shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-purple-500/20 rounded-lg text-purple-500"><Gavel /></div>
                            <span className="text-xs font-bold text-slate-500">EC 261 / ROME</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">Liability & Rights</h3>
                        <p className="text-slate-400 text-sm">Passenger rights, compensation calculator, and surface damage liability.</p>
                    </div>
                    <div onClick={() => onChangeView(View.AIR_LAW_ANNEXES)} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-indigo-500 cursor-pointer group transition-all shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-indigo-500/20 rounded-lg text-indigo-500"><BookOpen /></div>
                            <span className="text-xs font-bold text-slate-500">SARPs</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">The 19 Annexes</h3>
                        <p className="text-slate-400 text-sm">Overview of all ICAO Annexes from Personnel Licensing to SMS.</p>
                    </div>
                    <div onClick={() => onChangeView(View.AIR_LAW_CONVENTIONS)} className="bg-slate-900 border border-red-500/30 p-6 rounded-xl cursor-pointer group transition-all shadow-xl shadow-red-500/5">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-red-500/20 rounded-lg text-red-500"><Scale /></div>
                            <span className="text-xs font-bold text-red-500">LAB: LIABILITY</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">Conventions Lab</h3>
                        <p className="text-slate-400 text-sm">Montreal vs Warsaw comparison & interactive SDR liability calculator.</p>
                    </div>
                </div>
            </div>

            {/* SECTION: Personnel & Aircraft */}
            <div className={`mb-10 ${isLocked ? 'opacity-50 pointer-events-none blur-[1px] grayscale-[0.5] select-none' : ''}`}>
                <h2 className="text-xl font-bold text-slate-300 mb-4 border-b border-slate-700 pb-2">Personnel & Aircraft</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div onClick={() => onChangeView(View.AIR_LAW_PERSONNEL)} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-blue-500 cursor-pointer group transition-all shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-500/20 rounded-lg text-blue-500"><UserCheck /></div>
                            <span className="text-xs font-bold text-slate-500">ANNEX 1</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">Personnel Licensing</h3>
                        <p className="text-slate-400 text-sm">License validity, medical requirements and recent experience rules.</p>
                    </div>
                    <div onClick={() => onChangeView(View.AIR_LAW_AIRWORTHINESS)} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-teal-500 cursor-pointer group transition-all shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-teal-500/20 rounded-lg text-teal-500"><PenTool /></div>
                            <span className="text-xs font-bold text-slate-500">ANNEX 8 / TECH</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-teal-400 transition-colors">Airworthiness & Ops</h3>
                        <p className="text-slate-400 text-sm">C of A, PCN/ACN pavement strength, and RFF categories.</p>
                    </div>
                    <div onClick={() => onChangeView(View.AIR_LAW_REGISTRATION)} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-violet-500 cursor-pointer group transition-all shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-violet-500/20 rounded-lg text-violet-500"><Tag /></div>
                            <span className="text-xs font-bold text-slate-500">ANNEX 7</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-violet-400 transition-colors">Aircraft Registration</h3>
                        <p className="text-slate-400 text-sm">Nationality marks, common marks, and placement rules.</p>
                    </div>
                    <div onClick={() => onChangeView(View.AIR_LAW_DOCS)} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-amber-500 cursor-pointer group transition-all shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-amber-500/20 rounded-lg text-amber-500"><Briefcase /></div>
                            <span className="text-xs font-bold text-slate-500">ART 29 / ANNEX 6</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">Documents Onboard</h3>
                        <p className="text-slate-400 text-sm">Mandatory certificates and ship papers for international flights.</p>
                    </div>
                </div>
            </div>

            {/* SECTION: Rules of the Air (Annex 2 / SERA) */}
            <div className={`mb-10 ${isLocked ? 'opacity-50 pointer-events-none blur-[1px] grayscale-[0.5] select-none' : ''}`}>
                <h2 className="text-xl font-bold text-slate-300 mb-4 border-b border-slate-700 pb-2">Rules of the Air (Annex 2 / SERA)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div onClick={() => onChangeView(View.AIR_LAW_RULES_DETAILS)} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-sky-500 cursor-pointer group transition-all shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-sky-500/20 rounded-lg text-sky-500"><Plane /></div>
                            <span className="text-xs font-bold text-slate-500">SERA / ANNEX 2</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-sky-400 transition-colors">Rules of the Air</h3>
                        <p className="text-slate-400 text-sm">Right of way, minimum heights, and flight plan submission rules.</p>
                    </div>
                    <div onClick={() => onChangeView(View.AIR_LAW_RULES_OF_AIR)} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-sky-500 cursor-pointer group transition-all shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-sky-500/20 rounded-lg text-sky-500"><Plane /></div>
                            <span className="text-xs font-bold text-slate-500">FLIGHT RULES</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-sky-400 transition-colors">VFR vs IFR</h3>
                        <p className="text-slate-400 text-sm">Visual vs Instrument Flight Rules, visualizer and constraints.</p>
                    </div>
                    <div onClick={() => onChangeView(View.AIR_LAW_CRUISING)} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-amber-500 cursor-pointer group transition-all shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-amber-500/20 rounded-lg text-amber-500"><Compass /></div>
                            <span className="text-xs font-bold text-slate-500">LEVELS</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">Cruising Levels</h3>
                        <p className="text-slate-400 text-sm">Semi-circular rule calculator for IFR and VFR tracks.</p>
                    </div>
                    <div onClick={() => onChangeView(View.AIR_LAW_INTERCEPT)} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-red-500 cursor-pointer group transition-all shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-red-500/20 rounded-lg text-red-500"><AlertOctagon /></div>
                            <span className="text-xs font-bold text-slate-500">INTERCEPTION</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">Interception</h3>
                        <p className="text-slate-400 text-sm">Standard visual signals and pilot actions when intercepted.</p>
                    </div>
                    <div onClick={() => onChangeView(View.AIR_LAW_LIGHTGUN)} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-green-500 cursor-pointer group transition-all shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-green-500/20 rounded-lg text-green-500"><Crosshair /></div>
                            <span className="text-xs font-bold text-slate-500">SIGNALS</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">Light Gun Signals</h3>
                        <p className="text-slate-400 text-sm">Visual communication from the tower when radio fails.</p>
                    </div>
                </div>
            </div>

            {/* SECTION: Air Traffic Services (Annex 11 & PANS-OPS) */}
            <div className={`mb-10 ${isLocked ? 'opacity-50 pointer-events-none blur-[1px] grayscale-[0.5] select-none' : ''}`}>
                <h2 className="text-xl font-bold text-slate-300 mb-4 border-b border-slate-700 pb-2">Air Traffic Services (Annex 11 / PANS-OPS)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div onClick={() => onChangeView(View.AIR_LAW_LAYERS)} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-red-500 cursor-pointer group transition-all shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-red-500/20 rounded-lg text-red-500"><Layers /></div>
                            <span className="text-xs font-bold text-slate-500">AIRSPACE</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">Airspace Classes</h3>
                        <p className="text-slate-400 text-sm">Interactive 3D visualization of airspace classifications A-G.</p>
                    </div>
                    <div onClick={() => onChangeView(View.AIR_LAW_IFR_VFR)} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-sky-500 cursor-pointer group transition-all shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-sky-500/20 rounded-lg text-sky-500"><Scale /></div>
                            <span className="text-xs font-bold text-slate-500">SEPARATION</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-sky-400 transition-colors">IFR vs VFR Explorer</h3>
                        <p className="text-slate-400 text-sm">Visualise airspace separation rules and ATC services.</p>
                    </div>
                    <div onClick={() => onChangeView(View.AIR_LAW_INSTRUMENT)} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-teal-500 cursor-pointer group transition-all shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-teal-500/20 rounded-lg text-teal-500"><PlaneLanding /></div>
                            <span className="text-xs font-bold text-slate-500">APPROACH</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-teal-400 transition-colors">Instrument Approach</h3>
                        <p className="text-slate-400 text-sm">Visualizing the 5 segments of an instrument approach procedure.</p>
                    </div>
                    <div onClick={() => onChangeView(View.AIR_LAW_PANS_OPS)} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-pink-500 cursor-pointer group transition-all shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-pink-500/20 rounded-lg text-pink-500"><Mountain /></div>
                            <span className="text-xs font-bold text-slate-500">DOC 8168</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-pink-400 transition-colors">PANS-OPS Procedures</h3>
                        <p className="text-slate-400 text-sm">Departure criteria (PDG), Circling areas, and Parallel runways.</p>
                    </div>
                    <div onClick={() => onChangeView(View.AIR_LAW_HOLDING)} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-indigo-500 cursor-pointer group transition-all shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-indigo-500/20 rounded-lg text-indigo-500"><RotateCcw /></div>
                            <span className="text-xs font-bold text-slate-500">HOLDING</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">Holding Entry</h3>
                        <p className="text-slate-400 text-sm">Determine Parallel, Offset, or Direct entry sectors.</p>
                    </div>
                    <div onClick={() => onChangeView(View.AIR_LAW_ALTIMETER)} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-lime-500 cursor-pointer group transition-all shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-lime-500/20 rounded-lg text-lime-500"><Settings /></div>
                            <span className="text-xs font-bold text-slate-500">ALTIMETRY</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-lime-400 transition-colors">Altimeter Settings</h3>
                        <p className="text-slate-400 text-sm">Transition Altitude vs Transition Level logic visualization.</p>
                    </div>
                    <div onClick={() => onChangeView(View.AIR_LAW_PARALLEL_RWY)} className="bg-slate-900 border border-blue-500/30 p-6 rounded-xl cursor-pointer group transition-all shadow-xl shadow-blue-500/5">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-500/20 rounded-lg text-blue-500"><GitMerge /></div>
                            <span className="text-xs font-bold text-blue-500">LAB: 3D SIM</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">Parallel Runway Ops</h3>
                        <p className="text-slate-400 text-sm">3D interactive simulator for independent and dependent approaches.</p>
                    </div>
                </div>
            </div>

            {/* SECTION: Aerodromes (Annex 14) */}
            <div className={`mb-10 ${isLocked ? 'opacity-50 pointer-events-none blur-[1px] grayscale-[0.5] select-none' : ''}`}>
                <h2 className="text-xl font-bold text-slate-300 mb-4 border-b border-slate-700 pb-2">Aerodromes (Annex 14)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div onClick={() => onChangeView(View.AIR_LAW_REF_CODE)} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-cyan-500 cursor-pointer group transition-all shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-cyan-500/20 rounded-lg text-cyan-500"><Plane /></div>
                            <span className="text-xs font-bold text-slate-500">REF CODE</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">Aerodrome Code</h3>
                        <p className="text-slate-400 text-sm">Aerodrome Reference Code calculator (Field Length & Wingspan).</p>
                    </div>
                    <div onClick={() => onChangeView(View.AIR_LAW_SURFACE_CON)} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-sky-500 cursor-pointer group transition-all shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-sky-500/20 rounded-lg text-sky-500"><ThermometerSnowflake /></div>
                            <span className="text-xs font-bold text-slate-500">CONDITION</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-sky-400 transition-colors">Surface Conditions</h3>
                        <p className="text-slate-400 text-sm">Runway contamination, braking action codes and SNOWTAMs.</p>
                    </div>
                    <div onClick={() => onChangeView(View.AIR_LAW_LIGHTING)} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-yellow-500 cursor-pointer group transition-all shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-yellow-500/20 rounded-lg text-yellow-500"><Lightbulb /></div>
                            <span className="text-xs font-bold text-slate-500">LIGHTING</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">Lighting Summary</h3>
                        <p className="text-slate-400 text-sm">Interactive guide to Runway and Taxiway lighting.</p>
                    </div>
                    <div onClick={() => onChangeView(View.AIR_LAW_AERODROME_VIS)} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-white cursor-pointer group transition-all shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-slate-500/20 rounded-lg text-white"><Layout /></div>
                            <span className="text-xs font-bold text-slate-500">MARKINGS</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-slate-300 transition-colors">Aerodrome Visuals</h3>
                        <p className="text-slate-400 text-sm">Runway markings, Threshold logic and PAPI Simulator.</p>
                    </div>
                    <div onClick={() => onChangeView(View.AIR_LAW_SIGNS)} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-orange-500 cursor-pointer group transition-all shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-orange-500/20 rounded-lg text-orange-500"><Signpost /></div>
                            <span className="text-xs font-bold text-slate-500">SIGNAGE</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">Signs & Signals</h3>
                        <p className="text-slate-400 text-sm">Mandatory vs Info signs, and Signal Square symbols.</p>
                    </div>
                    <div onClick={() => onChangeView(View.AIR_LAW_GROUND_OPS)} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-orange-500 cursor-pointer group transition-all shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-orange-500/20 rounded-lg text-orange-500"><Truck /></div>
                            <span className="text-xs font-bold text-slate-500">GROUND OPS</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">Ground Operations</h3>
                        <p className="text-slate-400 text-sm">Marshalling signals and apron safety procedures.</p>
                    </div>
                    <div onClick={() => onChangeView(View.AIR_LAW_RWSL)} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-red-600 cursor-pointer group transition-all shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-red-600/20 rounded-lg text-red-500"><AlertOctagon /></div>
                            <span className="text-xs font-bold text-slate-500">SAFETY</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">RWSL</h3>
                        <p className="text-slate-400 text-sm">Runway Status Lights (REL/THL) logic and meaning.</p>
                    </div>
                    <div onClick={() => onChangeView(View.AIR_LAW_TVASIS)} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-pink-500 cursor-pointer group transition-all shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-pink-500/20 rounded-lg text-pink-500"><Lightbulb /></div>
                            <span className="text-xs font-bold text-slate-500">VASI</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-pink-400 transition-colors">T-VASIS</h3>
                        <p className="text-slate-400 text-sm">T-Visual Approach Slope Indicator System visualizer.</p>
                    </div>
                    <div onClick={() => onChangeView(View.AIR_LAW_DECLARED_DIST)} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-green-500 cursor-pointer group transition-all shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-green-500/20 rounded-lg text-green-500"><ArrowRight /></div>
                            <span className="text-xs font-bold text-slate-500">DISTANCES</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">Declared Distances</h3>
                        <p className="text-slate-400 text-sm">Visualizing TORA, TODA, ASDA and LDA concepts.</p>
                    </div>
                </div>
            </div>

            {/* SECTION: Ops & Emergency */}
            <div className={`mb-10 ${isLocked ? 'opacity-50 pointer-events-none blur-[1px] grayscale-[0.5] select-none' : ''}`}>
                <h2 className="text-xl font-bold text-slate-300 mb-4 border-b border-slate-700 pb-2">Ops, Safety & Emergency</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div onClick={() => onChangeView(View.AIR_LAW_OPS_INFO)} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-cyan-500 cursor-pointer group transition-all shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-cyan-500/20 rounded-lg text-cyan-500"><Globe /></div>
                            <span className="text-xs font-bold text-slate-500">ANNEX 15</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">Operational Info</h3>
                        <p className="text-slate-400 text-sm">AIS overview, NOTAMs, SNOWTAMs, and regulatory reporting.</p>
                    </div>
                    <div onClick={() => onChangeView(View.AIR_LAW_AIS_DEEP_DIVE)} className="bg-slate-900 border border-emerald-500/30 p-6 rounded-xl cursor-pointer group transition-all shadow-xl shadow-emerald-500/5">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-emerald-500/20 rounded-lg text-emerald-500"><Database /></div>
                            <span className="text-xs font-bold text-emerald-500">LAB: TIMELINE</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">AIS & AIRAC Cycle</h3>
                        <p className="text-slate-400 text-sm">Interactive "Time Traveler" to visualize the 56-day AIRAC cycle.</p>
                    </div>
                    <div onClick={() => onChangeView(View.AIR_LAW_FACILITATION)} className="bg-slate-900 border border-violet-500/30 p-6 rounded-xl cursor-pointer group transition-all shadow-xl shadow-violet-500/5">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-violet-500/20 rounded-lg text-violet-500"><UserPlus /></div>
                            <span className="text-xs font-bold text-violet-500">ANNEX 9</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-violet-400 transition-colors">Facilitation</h3>
                        <p className="text-slate-400 text-sm">International entry/departure formalities for aircraft, crew and cargo.</p>
                    </div>
                    <div onClick={() => onChangeView(View.AIR_LAW_SECURITY)} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-emerald-500 cursor-pointer group transition-all shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-emerald-500/20 rounded-lg text-emerald-500"><Shield /></div>
                            <span className="text-xs font-bold text-slate-500">ANNEX 17</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">Security</h3>
                        <p className="text-slate-400 text-sm">Safeguarding civil aviation, hijack protocols and cockpit security.</p>
                    </div>
                    <div onClick={() => onChangeView(View.AIR_LAW_ACCIDENT)} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-rose-500 cursor-pointer group transition-all shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-rose-500/20 rounded-lg text-rose-500"><AlertTriangle /></div>
                            <span className="text-xs font-bold text-slate-500">ANNEX 13</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-rose-400 transition-colors">Accident Investigation</h3>
                        <p className="text-slate-400 text-sm">Definitions of Accidents vs Incidents and State responsibilities.</p>
                    </div>
                    <div onClick={() => onChangeView(View.AIR_LAW_SAR)} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-red-500 cursor-pointer group transition-all shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-red-500/20 rounded-lg text-red-500"><Siren /></div>
                            <span className="text-xs font-bold text-slate-500">ANNEX 12</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">Search & Rescue</h3>
                        <p className="text-slate-400 text-sm">Emergency phases (INCERFA/ALERFA/DETRESFA) and SAR signals.</p>
                    </div>
                    <div onClick={() => onChangeView(View.AIR_LAW_EMERGENCY)} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-orange-500 cursor-pointer group transition-all shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-orange-500/20 rounded-lg text-orange-500"><Radio /></div>
                            <span className="text-xs font-bold text-slate-500">PANS-ATM</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">Emergency & Comms Fail</h3>
                        <p className="text-slate-400 text-sm">Procedures for Distress, Urgency, Fuel Dumping and Radio Failure.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AirLawDashboard;
