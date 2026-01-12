
import React, { useState } from 'react';
import { View } from '../../types';
import { Globe, Satellite, Clock, AlertTriangle, ShieldCheck, Cpu } from 'lucide-react';

interface Props {
    onNavigate?: (view: View) => void;
}

const GNSSTheory: React.FC<Props> = ({ onNavigate }) => {
    const [activeTab, setActiveTab] = useState<'segments' | 'signals' | 'errors' | 'positioning'>('segments');

    return (
        <div className="max-w-5xl mx-auto p-4 space-y-8">
            <div className="flex items-center space-x-4">
                <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
                    <Satellite size={24} className="text-sky-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-100">Global Navigation Satellite Systems (GNSS)</h1>
                    <p className="text-slate-400 text-sm">GPS, GLONASS, Galileo, BeiDou</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {[
                    { id: 'segments', label: 'Architecture', icon: Globe },
                    { id: 'signals', label: 'Signals & Time', icon: Clock },
                    { id: 'positioning', label: 'Positioning', icon: ShieldCheck },
                    { id: 'errors', label: 'Errors & Factors', icon: AlertTriangle },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                            ? 'bg-sky-600 text-white shadow-lg'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                            }`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 min-h-[400px]">

                {/* 1. SEGMENTS */}
                {activeTab === 'segments' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 relative overflow-hidden group hover:border-sky-500/50 transition-all">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Satellite size={80} />
                                </div>
                                <h3 className="text-lg font-bold text-sky-400 mb-2">Space Segment</h3>
                                <ul className="space-y-2 text-sm text-slate-300 relative z-10">
                                    <li>• <strong>24+ Satellites</strong> (30+ active usually)</li>
                                    <li>• <strong>6 Orbital Planes</strong> (55° inclination)</li>
                                    <li>• <strong>Altitude:</strong> 20,200 km (MEO)</li>
                                    <li>• <strong>Orbit Time:</strong> 11 hours 58 min</li>
                                    <li>• Ensures 4+ satellites visible anywhere.</li>
                                </ul>
                            </div>

                            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 relative overflow-hidden group hover:border-emerald-500/50 transition-all">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Cpu size={80} />
                                </div>
                                <h3 className="text-lg font-bold text-emerald-400 mb-2">Control Segment</h3>
                                <ul className="space-y-2 text-sm text-slate-300 relative z-10">
                                    <li>• <strong>Master Control Station</strong> (Colorado Springs)</li>
                                    <li>• <strong>Monitor Stations:</strong> Track satellites.</li>
                                    <li>• <strong>Ground Antennas:</strong> Uplink corrections.</li>
                                    <li>• Updates Almanacs and Atomic Clocks.</li>
                                </ul>
                            </div>

                            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 relative overflow-hidden group hover:border-amber-500/50 transition-all">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <ShieldCheck size={80} />
                                </div>
                                <h3 className="text-lg font-bold text-amber-400 mb-2">User Segment</h3>
                                <ul className="space-y-2 text-sm text-slate-300 relative z-10">
                                    <li>• <strong>Receivers</strong> (Aircraft, Phones, Cars)</li>
                                    <li>• Passive listening only (No transmission).</li>
                                    <li>• Calculates position from Time-of-Arrival.</li>
                                    <li>• Stores an Almanac (approx orbit data).</li>
                                </ul>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-4 gap-4 mt-8">
                            {['GPS (USA)', 'GLONASS (Russia)', 'Galileo (EU)', 'BeiDou (China)'].map(sys => (
                                <div key={sys} className="text-center p-3 bg-slate-950 rounded border border-slate-800">
                                    <span className="text-xs font-bold text-slate-400">{sys}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 2. SIGNALS */}
                {activeTab === 'signals' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-4">The Signal Structure</h3>
                                <div className="space-y-4">
                                    <div className="p-4 bg-slate-800 rounded-lg border-l-4 border-purple-500">
                                        <h4 className="font-bold text-purple-400">Carrier Frequencies</h4>
                                        <p className="text-sm text-slate-300">L1 (1575.42 MHz) and L2/L5 (Civil/Military).</p>
                                    </div>
                                    <div className="p-4 bg-slate-800 rounded-lg border-l-4 border-blue-500">
                                        <h4 className="font-bold text-blue-400">PRN Code (Pseudo Random Noise)</h4>
                                        <p className="text-sm text-slate-300">
                                            A unique digital signature for each satellite. Allows the receiver to identify who is talking (CDMA).
                                            Also used for precise timing measurements.
                                        </p>
                                    </div>
                                    <div className="p-4 bg-slate-800 rounded-lg border-l-4 border-yellow-500">
                                        <h4 className="font-bold text-yellow-400">Navigation Message</h4>
                                        <ul className="text-sm text-slate-300 list-disc list-inside mt-1">
                                            <li><strong>Ephemeris:</strong> Precise orbit data (Valid ~4 hours).</li>
                                            <li><strong>Almanac:</strong> Coarse orbit data for all sats (Valid months).</li>
                                            <li><strong>Clock Correction:</strong> Atomic clock bias.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col justify-center items-center text-center">
                                <Clock size={48} className="text-rose-500 mb-4 animate-pulse" />
                                <h3 className="text-2xl font-bold text-white font-mono">Time = Distance</h3>
                                <p className="text-slate-400 text-sm mt-2 max-w-sm">
                                    Distance = c × (Time_Rx - Time_Tx)
                                </p>
                                <div className="mt-6 p-4 bg-indigo-900/20 rounded-lg border border-indigo-500/20 text-xs text-indigo-200">
                                    An error of just <strong>1 microsecond</strong> ($10^-6$ s) results in a position error of <strong>300 meters</strong>!
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. POSITIONING */}
                {activeTab === 'positioning' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div>
                                <div className="bg-slate-800 p-6 rounded-xl shadow-lg relative h-[300px]">
                                    {/* Abstract visual of Trilateration */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        {/* Sat 1 */}
                                        <div className="absolute top-10 left-10 w-24 h-24 border-2 border-red-500/30 rounded-full flex items-center justify-center">
                                            <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                                        </div>
                                        {/* Sat 2 */}
                                        <div className="absolute top-10 right-10 w-32 h-32 border-2 border-blue-500/30 rounded-full flex items-center justify-center">
                                            <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                                        </div>
                                        {/* Sat 3 */}
                                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-40 h-40 border-2 border-green-500/30 rounded-full flex items-center justify-center">
                                            <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                                        </div>

                                        {/* Intersection */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_15px_white] animate-pulse"></div>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-4 text-xs font-bold text-white bg-black/50 px-1 rounded">2D FIX</div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">Trilateration</h3>
                                <p className="text-slate-400 mb-6">
                                    Measuring distance (Pseudo-range) from multiple known points (Satellites) intersects at a single location.
                                </p>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-slate-800 rounded border border-slate-700">
                                        <span className="font-bold text-slate-300">3 Satellites</span>
                                        <span className="text-yellow-400 font-mono font-bold">2D Fix (Lat, Long)</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-slate-800 rounded border border-slate-700">
                                        <span className="font-bold text-slate-300">4 Satellites</span>
                                        <span className="text-emerald-400 font-mono font-bold">3D Fix (Lat, Long, Alt)</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-slate-800 rounded border border-slate-700">
                                        <span className="font-bold text-slate-300">5+ Satellites</span>
                                        <span className="text-sky-400 font-mono font-bold">RAIM (Fault Detection)</span>
                                    </div>
                                </div>

                                <div className="mt-4 text-xs text-slate-500">
                                    *The 4th satellite is required to solve the Receiver Clock Bias (Time Error). We have 4 unknowns: X, Y, Z, and Time.
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. ERRORS */}
                {activeTab === 'errors' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

                            <div className="p-4 bg-slate-800 rounded-xl border border-rose-500/20 hover:border-rose-500/50 transition-colors">
                                <div className="text-rose-400 font-bold mb-2 flex items-center gap-2">
                                    <AlertTriangle size={16} /> Ionosphere
                                </div>
                                <p className="text-xs text-slate-400">
                                    Solar radiation ionizes the atmosphere, slowing down the signal. Largest source of error.
                                </p>
                                <div className="mt-2 text-xs text-slate-500 font-mono">Mitigation: Dual Frequency (L1/L2) or Models.</div>
                            </div>

                            <div className="p-4 bg-slate-800 rounded-xl border border-amber-500/20 hover:border-amber-500/50 transition-colors">
                                <div className="text-amber-400 font-bold mb-2 flex items-center gap-2">
                                    <AlertTriangle size={16} /> Multipath
                                </div>
                                <p className="text-xs text-slate-400">
                                    Signal bouncing off ground/buildings before reaching receiver. Increases path length.
                                </p>
                                <div className="mt-2 text-xs text-slate-500 font-mono">Mitigation: Mask angle, Antenna design.</div>
                            </div>

                            <div className="p-4 bg-slate-800 rounded-xl border border-blue-500/20 hover:border-blue-500/50 transition-colors">
                                <div className="text-blue-400 font-bold mb-2 flex items-center gap-2">
                                    <AlertTriangle size={16} /> GDOP
                                </div>
                                <p className="text-xs text-slate-400">
                                    <strong>Geometric Dilution of Precision</strong>. Satellites bunched together = Poor accuracy. Spread out = Good accuracy.
                                </p>
                                <div className="mt-2 text-xs text-slate-500 font-mono">Mitigation: More satellites.</div>
                            </div>

                            <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                                <div className="text-slate-300 font-bold mb-2">Clock Error</div>
                                <p className="text-xs text-slate-400">Receiver clock is not atomic. Solved by 4th satellite.</p>
                            </div>

                            <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                                <div className="text-slate-300 font-bold mb-2">Ephemeris Error</div>
                                <p className="text-xs text-slate-400">Satellite orbit is essentially slightly off from reported position.</p>
                            </div>

                            <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                                <div className="text-slate-300 font-bold mb-2">Jamming / Spoofing</div>
                                <p className="text-xs text-slate-400">External interference (Intentional or Unintentional).</p>
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GNSSTheory;
