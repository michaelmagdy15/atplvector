import React, { useState } from 'react';
import { UserPlus, Shield, FileText, Globe, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';

const AirLawFacilitation: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState<'entry' | 'docs' | 'cooperation'>('entry');

    const entryRequirements = [
        { title: 'Aircraft Entry', desc: 'Requirements for aircraft arrival and departure, customs, and health clearance.', icon: Globe },
        { title: 'Crew Entry', desc: 'Licensing recognition and standard crew member certificates (CMC).', icon: UserPlus },
        { title: 'Passenger Entry', desc: 'Immigration procedures and visa requirements.', icon: Shield },
    ];

    const docs = [
        { label: 'General Declaration', code: 'C-7', desc: 'Standard form for aircraft entry/departure.' },
        { label: 'Passenger Manifest', code: 'P-1', desc: 'List of passengers for customs/immigration.' },
        { label: 'Cargo Manifest', code: 'C-1', desc: 'Detailed list of goods transported.' },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 animate-in fade-in duration-500">
            {/* Header */}
            <header className="max-w-6xl mx-auto mb-12">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-red-500/20 text-red-500 rounded-2xl border border-red-500/30 shadow-xl shadow-red-500/5">
                        <UserPlus size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            Facilitation (Annex 9)
                        </h1>
                        <p className="text-slate-500 text-sm uppercase tracking-widest font-semibold flex items-center gap-2">
                            International Civil Aviation convention
                        </p>
                    </div>
                </div>
                <div className="grid md:grid-cols-2 gap-8 items-center bg-slate-900/50 backdrop-blur-xl border border-white/5 p-6 rounded-3xl">
                    <div>
                        <p className="text-slate-400 leading-relaxed text-lg italic">
                            "The objective of Annex 9 is to simplify and expedite the formalities for aircraft, crews, passengers, and cargo across international borders."
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-300">ICAO ANNEX 9</div>
                        <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-300">CUSTOMS</div>
                        <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-300">IMMIGRATION</div>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto space-y-12">
                {/* Entry Requirements Grid */}
                <section>
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Globe className="text-blue-400" size={20} />
                        Entry & Departure Principles
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {entryRequirements.map((req, i) => (
                            <div key={i} className="group bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-red-500/50 transition-all duration-300">
                                <div className="p-3 bg-slate-800 rounded-xl w-fit mb-4 group-hover:bg-red-500 group-hover:text-white transition-colors">
                                    <req.icon size={24} />
                                </div>
                                <h3 className="font-bold text-lg mb-2">{req.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{req.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Interactive Documents Section */}
                <section className="bg-slate-900/80 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="grid md:grid-cols-3">
                        {/* Sidebar */}
                        <div className="p-8 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-950/50">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <FileText className="text-red-400" size={20} />
                                Documentation
                            </h3>
                            <div className="space-y-4">
                                {docs.map((doc, i) => (
                                    <button
                                        key={i}
                                        className="w-full text-left p-4 rounded-xl border border-slate-800 hover:border-red-500/30 hover:bg-red-500/5 transition-all group"
                                    >
                                        <div className="text-xs font-bold text-red-500 mb-1">{doc.code}</div>
                                        <div className="font-medium text-sm group-hover:text-white transition-colors">{doc.label}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="col-span-2 p-8 md:p-12 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                                <FileText size={200} />
                            </div>
                            <div className="relative z-10">
                                <h4 className="text-2xl font-bold mb-6">General Declaration Rules</h4>
                                <div className="space-y-6 max-w-lg">
                                    <div className="flex gap-4">
                                        <CheckCircle className="text-green-500 shrink-0" size={20} />
                                        <p className="text-slate-400 text-sm italic py-1">
                                            The General Declaration is the only document required for customs and health clearance.
                                        </p>
                                    </div>
                                    <div className="flex gap-4">
                                        <CheckCircle className="text-green-500 shrink-0" size={20} />
                                        <p className="text-slate-400 text-sm italic py-1">
                                            Signature is only required where explicitly requested by national legislation.
                                        </p>
                                    </div>
                                    <div className="flex gap-4">
                                        <AlertCircle className="text-amber-500 shrink-0" size={20} />
                                        <p className="text-slate-400 text-sm italic py-1">
                                            No visa is required for crew members holding a valid CMC and acting in the line of duty.
                                        </p>
                                    </div>
                                </div>
                                <button className="mt-8 px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-red-600/20 flex items-center gap-2">
                                    View Sample Doc <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AirLawFacilitation;
