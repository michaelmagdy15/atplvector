
import React, { useState } from 'react';
import { Layers, Monitor, User, Sun, Cpu } from 'lucide-react';

const HPLShell: React.FC = () => {
    const [selectedInterface, setSelectedInterface] = useState<'LS' | 'LH' | 'LE' | 'LL' | null>(null);

    return (
        <div className="animate-in fade-in">
            <h3 className="font-bold text-white mb-6">The SHELL Model (Edwards 1972 / Hawkins 1975)</h3>

            <div className="grid md:grid-cols-2 gap-12">
                {/* Visual Model */}
                <div className="bg-slate-900 p-8 rounded-xl border border-slate-700 flex items-center justify-center relative min-h-[400px]">

                    {/* Center: Liveware (Me) */}
                    <div className="absolute z-20 w-32 h-32 bg-sky-600 rounded-xl flex flex-col items-center justify-center shadow-lg transform rotate-45 border-4 border-slate-800 hover:scale-105 transition-transform cursor-pointer">
                        <div className="transform -rotate-45 flex flex-col items-center text-white">
                            <User size={32} />
                            <span className="font-bold">L</span>
                            <span className="text-[10px] uppercase">Liveware (Me)</span>
                        </div>
                    </div>

                    {/* Top: Software */}
                    <button
                        onClick={() => setSelectedInterface('LS')}
                        className={`absolute top-10 z-10 w-24 h-24 bg-emerald-700 rounded-xl flex flex-col items-center justify-center shadow-lg transform rotate-45 border-4 border-slate-800 hover:z-30 hover:bg-emerald-600 transition-all ${selectedInterface === 'LS' ? 'ring-4 ring-emerald-400 scale-110 z-30' : ''}`}
                    >
                        <div className="transform -rotate-45 flex flex-col items-center text-white">
                            <span className="font-bold text-lg">S</span>
                            <span className="text-[10px] uppercase font-bold">Software</span>
                        </div>
                    </button>

                    {/* Right: Hardware */}
                    <button
                        onClick={() => setSelectedInterface('LH')}
                        className={`absolute right-10 z-10 w-24 h-24 bg-amber-700 rounded-xl flex flex-col items-center justify-center shadow-lg transform rotate-45 border-4 border-slate-800 hover:z-30 hover:bg-amber-600 transition-all ${selectedInterface === 'LH' ? 'ring-4 ring-amber-400 scale-110 z-30' : ''}`}
                    >
                        <div className="transform -rotate-45 flex flex-col items-center text-white">
                            <span className="font-bold text-lg">H</span>
                            <span className="text-[10px] uppercase font-bold">Hardware</span>
                        </div>
                    </button>

                    {/* Bottom: Environment */}
                    <button
                        onClick={() => setSelectedInterface('LE')}
                        className={`absolute bottom-10 z-10 w-24 h-24 bg-purple-700 rounded-xl flex flex-col items-center justify-center shadow-lg transform rotate-45 border-4 border-slate-800 hover:z-30 hover:bg-purple-600 transition-all ${selectedInterface === 'LE' ? 'ring-4 ring-purple-400 scale-110 z-30' : ''}`}
                    >
                        <div className="transform -rotate-45 flex flex-col items-center text-white">
                            <span className="font-bold text-lg">E</span>
                            <span className="text-[10px] uppercase font-bold">Environment</span>
                        </div>
                    </button>

                    {/* Left: Liveware (Others) */}
                    <button
                        onClick={() => setSelectedInterface('LL')}
                        className={`absolute left-10 z-10 w-24 h-24 bg-sky-800 rounded-xl flex flex-col items-center justify-center shadow-lg transform rotate-45 border-4 border-slate-800 hover:z-30 hover:bg-sky-600 transition-all ${selectedInterface === 'LL' ? 'ring-4 ring-sky-400 scale-110 z-30' : ''}`}
                    >
                        <div className="transform -rotate-45 flex flex-col items-center text-white">
                            <span className="font-bold text-lg">L</span>
                            <span className="text-[10px] uppercase font-bold">Liveware</span>
                        </div>
                    </button>

                </div>

                {/* Explanations */}
                <div className="space-y-6">
                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 h-full">
                        {!selectedInterface ? (
                            <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
                                <Layers size={48} className="mb-4 opacity-50" />
                                <h3 className="text-xl font-bold text-white mb-2">Explore the Interfaces</h3>
                                <p className="text-sm">Click on a block (S, H, E, L) to see how it interacts with the central Liveware.</p>
                                <p className="text-xs mt-4 italic">
                                    "The blocks must match. Mismatched interfaces lead to error."
                                </p>
                            </div>
                        ) : (
                            <div className="animate-in fade-in">
                                {selectedInterface === 'LS' && (
                                    <>
                                        <h3 className="text-xl font-bold text-emerald-400 mb-2 flex items-center gap-2">
                                            <Cpu /> Liveware - Software
                                        </h3>
                                        <p className="text-sm text-slate-300 mb-4 divider-bottom pb-4 border-slate-700 border-b">
                                            The relationship between the person and the supporting systems found in the workplace (Regulations, Manuals, SOPs, Checklists, Symbology).
                                        </p>
                                        <h4 className="font-bold text-white text-sm mb-2">Cockpit Relevance:</h4>
                                        <ul className="text-xs text-slate-400 list-disc pl-4 space-y-2">
                                            <li><strong>Good:</strong> Clear, unambiguous checklists. User-friendly SOPs.</li>
                                            <li><strong>Bad:</strong> Confusing charts. Poorly written manuals leading to misinterpretation.</li>
                                        </ul>
                                    </>
                                )}
                                {selectedInterface === 'LH' && (
                                    <>
                                        <h3 className="text-xl font-bold text-amber-400 mb-2 flex items-center gap-2">
                                            <Monitor /> Liveware - Hardware
                                        </h3>
                                        <p className="text-sm text-slate-300 mb-4 divider-bottom pb-4 border-slate-700 border-b">
                                            The relationship between the human and the physical machine (Seats, Displays, Controls). Ergonomics.
                                        </p>
                                        <h4 className="font-bold text-white text-sm mb-2">Cockpit Relevance:</h4>
                                        <ul className="text-xs text-slate-400 list-disc pl-4 space-y-2">
                                            <li><strong>Good:</strong> Controls shaped differently (Flaps vs Gear). Screens readable in sunlight.</li>
                                            <li><strong>Bad:</strong> Switches too close together. Uncomfortable seats causing fatigue.</li>
                                        </ul>
                                    </>
                                )}
                                {selectedInterface === 'LE' && (
                                    <>
                                        <h3 className="text-xl font-bold text-purple-400 mb-2 flex items-center gap-2">
                                            <Sun /> Liveware - Environment
                                        </h3>
                                        <p className="text-sm text-slate-300 mb-4 divider-bottom pb-4 border-slate-700 border-b">
                                            The relationship between the person and the internal/external environment.
                                        </p>
                                        <h4 className="font-bold text-white text-sm mb-2">Cockpit Relevance:</h4>
                                        <ul className="text-xs text-slate-400 list-disc pl-4 space-y-2">
                                            <li><strong>Physical:</strong> Noise (Fatigue), Temperature (Heat stress), Vibration, Pressurization.</li>
                                            <li><strong>External:</strong> Weather, Terrain, Night flying illusions.</li>
                                        </ul>
                                    </>
                                )}
                                {selectedInterface === 'LL' && (
                                    <>
                                        <h3 className="text-xl font-bold text-sky-400 mb-2 flex items-center gap-2">
                                            <User /> Liveware - Liveware
                                        </h3>
                                        <p className="text-sm text-slate-300 mb-4 divider-bottom pb-4 border-slate-700 border-b">
                                            The relationship between people. Teamwork, Communication, Leadership.
                                        </p>
                                        <h4 className="font-bold text-white text-sm mb-2">Cockpit Relevance:</h4>
                                        <ul className="text-xs text-slate-400 list-disc pl-4 space-y-2">
                                            <li><strong>Crew:</strong> Captain vs First Officer gradient. CRM.</li>
                                            <li><strong>Others:</strong> Pilot vs ATC. Pilot vs Cabin Crew.</li>
                                            <li><strong>Errors:</strong> Miscommunication, Culture clashes.</li>
                                        </ul>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HPLShell;
