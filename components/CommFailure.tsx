import React, { useState } from 'react';
import { Radio, Cloud, Sun, Navigation, AlertTriangle, Clock, ShieldAlert, CheckCircle2 } from 'lucide-react';

const CommFailure: React.FC = () => {
    const [condition, setCondition] = useState<'vmc' | 'imc'>('vmc');
    const [radarEnv, setRadarEnv] = useState<'non-radar' | 'radar'>('radar');
    const [activeTab, setActiveTab] = useState<'wizard' | 'timeline' | 'transponder'>('wizard');

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12 text-slate-100">
            {/* Header */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                        <Radio className="text-rose-500" size={28} />
                        Communications Failure & NORDO Procedures (090)
                    </h2>
                    <p className="text-slate-400 text-xs mt-1">
                        ICAO Annex 2 (Rules of the Air) & EASA SERA.8035 Lost Communications
                    </p>
                </div>
                <div className="flex gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                    <button
                        onClick={() => setActiveTab('wizard')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            activeTab === 'wizard' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        Decision Flow
                    </button>
                    <button
                        onClick={() => setActiveTab('timeline')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            activeTab === 'timeline' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        IMC Timeline (7 vs 20 min)
                    </button>
                    <button
                        onClick={() => setActiveTab('transponder')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            activeTab === 'transponder' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        SSR Emergency Codes
                    </button>
                </div>
            </div>

            {/* TAB 1: DECISION FLOW */}
            {activeTab === 'wizard' && (
                <div className="bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-800 space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div
                            onClick={() => setCondition('vmc')}
                            className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                                condition === 'vmc'
                                    ? 'bg-amber-950/20 border-amber-500 shadow-lg shadow-amber-950/30'
                                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                            }`}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <Sun className="text-amber-400 w-8 h-8" />
                                <div>
                                    <h3 className="font-bold text-white text-base">Visual Met Conditions (VMC)</h3>
                                    <span className="text-[11px] text-slate-400">Flight in VMC or encounters VMC</span>
                                </div>
                            </div>
                        </div>

                        <div
                            onClick={() => setCondition('imc')}
                            className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                                condition === 'imc'
                                    ? 'bg-blue-950/20 border-blue-500 shadow-lg shadow-blue-950/30'
                                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                            }`}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <Cloud className="text-blue-400 w-8 h-8" />
                                <div>
                                    <h3 className="font-bold text-white text-base">Instrument Met Conditions (IMC)</h3>
                                    <span className="text-[11px] text-slate-400">Operating under IFR or unable to maintain VMC</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* VMC Results */}
                    {condition === 'vmc' && (
                        <div className="bg-slate-950 p-6 rounded-xl border border-amber-500/40 space-y-4 animate-in fade-in">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                <span className="font-bold text-amber-400 flex items-center gap-2">
                                    <Sun size={18} /> ICAO VMC Lost Communications Standard
                                </span>
                                <span className="font-mono text-xs bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800">
                                    Squawk 7600
                                </span>
                            </div>
                            <ol className="space-y-3 text-xs text-slate-300 list-decimal list-inside leading-relaxed">
                                <li>
                                    <strong className="text-white">Squawk Mode A/C Code 7600</strong> immediately to alert ATC of two-way radio failure.
                                </li>
                                <li>
                                    <strong className="text-white">Continue to fly in Visual Meteorological Conditions (VMC)</strong>. Do not enter clouds.
                                </li>
                                <li>
                                    <strong className="text-white">Land at the nearest suitable aerodrome</strong> (does not have to be destination if an earlier suitable field is available).
                                </li>
                                <li>
                                    <strong className="text-white">Report arrival</strong> to the appropriate air traffic services unit by the most expeditious means (telephone, mobile, handler) upon landing.
                                </li>
                            </ol>
                        </div>
                    )}

                    {/* IMC Results */}
                    {condition === 'imc' && (
                        <div className="space-y-4 animate-in fade-in">
                            <div className="flex gap-3 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                                <button
                                    onClick={() => setRadarEnv('radar')}
                                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                                        radarEnv === 'radar' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                                    }`}
                                >
                                    ATS Surveillance / Radar Area (7-Minute Rule)
                                </button>
                                <button
                                    onClick={() => setRadarEnv('non-radar')}
                                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                                        radarEnv === 'non-radar' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                                    }`}
                                >
                                    Procedural / Non-Radar Airspace (20-Minute Rule)
                                </button>
                            </div>

                            <div className="bg-slate-950 p-6 rounded-xl border border-blue-500/40 space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                    <span className="font-bold text-sky-400 flex items-center gap-2">
                                        <Clock size={18} />
                                        {radarEnv === 'radar' ? 'Radar Airspace (7 Min Buffer)' : 'Non-Radar Airspace (20 Min Buffer)'}
                                    </span>
                                    <span className="font-mono text-xs bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-800">
                                        Squawk 7600
                                    </span>
                                </div>

                                <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
                                    <p>
                                        <strong className="text-white">1. Squawk 7600</strong> immediately.
                                    </p>
                                    <p>
                                        <strong className="text-white">2. Level & Speed Maintenance:</strong>
                                        <br />
                                        {radarEnv === 'radar' ? (
                                            <>
                                                Maintain last assigned speed and level (or minimum flight altitude if higher) for a period of <strong className="text-sky-400">7 minutes</strong> following:
                                                <ul className="list-disc list-inside mt-1 ml-2 text-slate-400">
                                                    <li>Reaching the last assigned level or minimum flight altitude; OR</li>
                                                    <li>Being instructed to turn / radar vectored.</li>
                                                </ul>
                                                Thereafter, rejoin the current flight plan route no later than the next significant point.
                                            </>
                                        ) : (
                                            <>
                                                Maintain last assigned speed and level (or minimum flight altitude if higher) for a period of <strong className="text-sky-400">20 minutes</strong> following:
                                                <ul className="list-disc list-inside mt-1 ml-2 text-slate-400">
                                                    <li>Failure to report position over a compulsory reporting point.</li>
                                                </ul>
                                                Thereafter, adjust speed and level in accordance with the filed flight plan.
                                            </>
                                        )}
                                    </p>
                                    <p>
                                        <strong className="text-white">3. Fly to Destination Nav Aid:</strong> Proceed to the designated navigation aid serving the destination aerodrome.
                                    </p>
                                    <p>
                                        <strong className="text-white">4. Hold & Descend Timing:</strong> Hold over this aid until:
                                        <br />
                                        • The <strong className="text-amber-400">Expected Approach Time (EAT)</strong> last received and acknowledged; OR
                                        <br />
                                        • If no EAT received, the <strong className="text-amber-400">Estimated Time of Arrival (ETA)</strong> calculated from the filed flight plan.
                                    </p>
                                    <p>
                                        <strong className="text-white">5. Commence Approach & Landing:</strong> Start descent from holding at or as close as possible to EAT/ETA, execute instrument approach, and land within <strong className="text-emerald-400">30 minutes</strong> of ETA or EAT.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* TAB 2: TIMELINE */}
            {activeTab === 'timeline' && (
                <div className="bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-800 space-y-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Clock size={20} className="text-sky-400" />
                        IMC Loss of Communication Step-by-Step Timeline
                    </h3>

                    <div className="space-y-4">
                        <div className="border-l-2 border-rose-500 pl-4 py-2 relative">
                            <div className="absolute -left-2 top-2 w-3.5 h-3.5 rounded-full bg-rose-500"></div>
                            <span className="font-mono text-xs text-rose-400 font-bold">T = 0:00 — Loss of Two-Way Comms</span>
                            <p className="text-xs text-slate-300 mt-1">
                                Check audio panel, volume, frequency, alternate radio (VHF 2), switch to VHF Guard 121.500. Transmit blind. Select <strong className="text-white font-mono">Squawk 7600</strong>.
                            </p>
                        </div>

                        <div className="border-l-2 border-amber-500 pl-4 py-2 relative">
                            <div className="absolute -left-2 top-2 w-3.5 h-3.5 rounded-full bg-amber-500"></div>
                            <span className="font-mono text-xs text-amber-400 font-bold">Buffer Period: 7 Min (Radar) vs 20 Min (Non-Radar)</span>
                            <p className="text-xs text-slate-300 mt-1">
                                Maintain last assigned speed and level (or MSA if higher). ATC establishes sterile airspace around you during this buffer.
                            </p>
                        </div>

                        <div className="border-l-2 border-sky-500 pl-4 py-2 relative">
                            <div className="absolute -left-2 top-2 w-3.5 h-3.5 rounded-full bg-sky-500"></div>
                            <span className="font-mono text-xs text-sky-400 font-bold">Enroute to Destination Nav Aid</span>
                            <p className="text-xs text-slate-300 mt-1">
                                Rejoin flight plan route. Adjust speed and level in accordance with filed flight plan. Track towards the IAF / destination holding fix.
                            </p>
                        </div>

                        <div className="border-l-2 border-emerald-500 pl-4 py-2 relative">
                            <div className="absolute -left-2 top-2 w-3.5 h-3.5 rounded-full bg-emerald-500"></div>
                            <span className="font-mono text-xs text-emerald-400 font-bold">At EAT or Flight Plan ETA: Commence Descent</span>
                            <p className="text-xs text-slate-300 mt-1">
                                Leave the holding fix at the exact acknowledged Expected Approach Time (or flight plan ETA if no EAT received). Fly standard instrument approach and land within 30 minutes.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 3: TRANSPONDER CODES */}
            {activeTab === 'transponder' && (
                <div className="bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-800 space-y-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <ShieldAlert size={20} className="text-rose-400" />
                        ICAO Emergency SSR Transponder Mode A/C/S Codes
                    </h3>

                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-slate-950 p-5 rounded-xl border border-rose-600/50 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="font-mono text-3xl font-black text-rose-500">7700</span>
                                <span className="text-[10px] bg-rose-950 text-rose-300 px-2 py-0.5 rounded border border-rose-800 font-bold">
                                    MAYDAY / PAN
                                </span>
                            </div>
                            <h4 className="font-bold text-white text-sm">General Aviation Emergency</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Used when an aircraft is threatened by serious or imminent danger, or requires immediate operational priority (engine failure, fire, decompression, severe icing).
                            </p>
                        </div>

                        <div className="bg-slate-950 p-5 rounded-xl border border-amber-600/50 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="font-mono text-3xl font-black text-amber-500">7600</span>
                                <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800 font-bold">
                                    NORDO
                                </span>
                            </div>
                            <h4 className="font-bold text-white text-sm">Radio Communication Failure</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Selected when two-way radio communication cannot be maintained with ATC. Follow standard ICAO VMC or IMC failure procedures.
                            </p>
                        </div>

                        <div className="bg-slate-950 p-5 rounded-xl border border-purple-600/50 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="font-mono text-3xl font-black text-purple-400">7500</span>
                                <span className="text-[10px] bg-purple-950 text-purple-300 px-2 py-0.5 rounded border border-purple-800 font-bold">
                                    SECURITY
                                </span>
                            </div>
                            <h4 className="font-bold text-white text-sm">Unlawful Interference (Hijack)</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Selected silently in the event of hijack or unlawful coercion. ATC will not interrogate or question this squawk directly on frequency.
                            </p>
                        </div>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
                        <AlertTriangle size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <strong className="text-white block mb-1">Mnemonic for Remembering SSR Codes:</strong>
                            <div className="grid sm:grid-cols-3 gap-2 font-mono text-[11px] text-slate-300">
                                <div><strong className="text-purple-400">75</strong>: Taken alive (Hijack)</div>
                                <div><strong className="text-amber-400">76</strong>: Radio in a fix (NORDO)</div>
                                <div><strong className="text-rose-400">77</strong>: Going to heaven (Emergency)</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommFailure;
