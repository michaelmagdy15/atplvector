import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plane, AlertTriangle, Info, CheckCircle, XCircle, Eye, Cloud } from 'lucide-react';

interface AutolandCategory {
    cat: string;
    dh: string;
    rvr: string;
    apType: string;
    description: string;
}

const AUTOLAND_CATEGORIES: AutolandCategory[] = [
    { cat: 'CAT I', dh: '200 ft', rvr: '550m (800m no lights)', apType: 'Standard', description: 'Manual landing after DH' },
    { cat: 'CAT II', dh: '100 ft', rvr: '300m', apType: 'Fail Passive', description: 'Visual segment after DH' },
    { cat: 'CAT IIIA', dh: '50 ft (or no DH)', rvr: '200m', apType: 'Fail Passive / Operational', description: 'Autoland, rollout manual' },
    { cat: 'CAT IIIB', dh: 'No DH', rvr: '75m', apType: 'Fail Operational', description: 'Autoland + auto rollout' },
    { cat: 'CAT IIIC', dh: 'No DH', rvr: 'No minimum', apType: 'Fail Operational', description: 'Zero visibility (theoretical)' },
];

const AutolandSystem: React.FC = () => {
    const [selectedCat, setSelectedCat] = useState<string>('CAT IIIA');
    const [altitude, setAltitude] = useState(500);
    const [phase, setPhase] = useState<'approach' | 'flare' | 'rollout'>('approach');

    const currentCat = AUTOLAND_CATEGORIES.find(c => c.cat === selectedCat);

    // Simulate phases based on altitude
    const getPhase = (alt: number) => {
        if (alt > 50) return 'approach';
        if (alt > 0) return 'flare';
        return 'rollout';
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-white mb-2">Autoland System</h1>
                <p className="text-slate-400">Approach categories, redundancy requirements, and autoland phases.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Category Selector */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Eye className="text-sky-400" />
                        Approach Categories
                    </h2>

                    <div className="space-y-3">
                        {AUTOLAND_CATEGORIES.map((cat) => (
                            <motion.div
                                key={cat.cat}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedCat(cat.cat)}
                                className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedCat === cat.cat ? 'bg-sky-500/20 border-sky-500' : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'}`}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="text-white font-bold">{cat.cat}</div>
                                        <div className="text-slate-400 text-sm">{cat.description}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-slate-500">DH: <span className="text-amber-400">{cat.dh}</span></div>
                                        <div className="text-xs text-slate-500">RVR: <span className="text-emerald-400">{cat.rvr}</span></div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Selected Category Details */}
                <div className="space-y-6">
                    {currentCat && (
                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                            <h3 className="text-2xl font-black text-sky-400 mb-4">{currentCat.cat}</h3>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-slate-800/50 p-4 rounded-lg text-center">
                                    <div className="text-3xl font-mono font-bold text-amber-400">{currentCat.dh}</div>
                                    <div className="text-xs text-slate-500 uppercase mt-1">Decision Height</div>
                                </div>
                                <div className="bg-slate-800/50 p-4 rounded-lg text-center">
                                    <div className="text-3xl font-mono font-bold text-emerald-400">{currentCat.rvr}</div>
                                    <div className="text-xs text-slate-500 uppercase mt-1">Min RVR</div>
                                </div>
                            </div>

                            <div className="bg-slate-800/50 p-4 rounded-lg">
                                <div className="text-sm text-slate-400">Required A/P Type:</div>
                                <div className="text-lg font-bold text-white">{currentCat.apType}</div>
                            </div>
                        </div>
                    )}

                    {/* Fail Passive vs Fail Operational */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <AlertTriangle className="text-amber-400 w-5 h-5" />
                            Autopilot Failure Modes
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg">
                                <h4 className="text-amber-400 font-bold mb-2 flex items-center gap-2">
                                    <XCircle className="w-4 h-4" /> Fail Passive
                                </h4>
                                <p className="text-slate-400">
                                    On failure, A/P disengages. No abrupt maneuver. Pilot takes over manually.
                                </p>
                                <p className="text-xs text-slate-500 mt-2">Required for CAT II, IIIA</p>
                            </div>
                            <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-lg">
                                <h4 className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" /> Fail Operational
                                </h4>
                                <p className="text-slate-400">
                                    On failure, redundant system takes over. No pilot intervention needed immediately.
                                </p>
                                <p className="text-xs text-slate-500 mt-2">Required for CAT IIIB/C</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Autoland Phases */}
            <div className="mt-8 bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Plane className="text-emerald-400" />
                    Autoland Phases
                </h2>

                <div className="relative h-48 bg-gradient-to-b from-slate-800 to-emerald-900/30 rounded-xl overflow-hidden mb-6">
                    {/* Altitude scale */}
                    <div className="absolute left-4 top-0 bottom-0 flex flex-col justify-between py-4 text-xs text-slate-500">
                        <span>500 ft</span>
                        <span>300 ft</span>
                        <span>50 ft</span>
                        <span>0 ft</span>
                    </div>

                    {/* Phase zones */}
                    <div className="absolute inset-0 flex flex-col">
                        <div className="flex-1 border-b border-dashed border-slate-600 flex items-center justify-center">
                            <span className="text-sky-400 font-bold text-sm">APPROACH (Glideslope)</span>
                        </div>
                        <div className="h-16 border-b border-dashed border-amber-500/50 flex items-center justify-center bg-amber-500/5">
                            <span className="text-amber-400 font-bold text-sm">FLARE (Pitch Up + Retard)</span>
                        </div>
                        <div className="h-12 flex items-center justify-center bg-emerald-500/5">
                            <span className="text-emerald-400 font-bold text-sm">ROLLOUT (Auto Brake + Steering)</span>
                        </div>
                    </div>

                    {/* Aircraft position */}
                    <motion.div
                        animate={{ top: `${100 - (altitude / 500) * 100}%` }}
                        className="absolute right-8 transform -translate-y-1/2"
                    >
                        <Plane className="w-8 h-8 text-white -rotate-45" />
                    </motion.div>
                </div>

                {/* Altitude Slider */}
                <div className="px-4">
                    <input
                        type="range"
                        min={0}
                        max={500}
                        value={altitude}
                        onChange={(e) => setAltitude(Number(e.target.value))}
                        className="w-full accent-sky-500"
                    />
                    <div className="flex justify-between text-sm mt-2">
                        <span className="text-slate-500">Touchdown</span>
                        <span className="text-sky-400 font-mono font-bold">{altitude} ft RA</span>
                        <span className="text-slate-500">500 ft</span>
                    </div>
                </div>

                {/* Phase description */}
                <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
                    <div className={`p-3 rounded-lg ${altitude > 50 ? 'bg-sky-500/20 border border-sky-500' : 'bg-slate-800/50 border border-slate-700'}`}>
                        <div className={`font-bold ${altitude > 50 ? 'text-sky-400' : 'text-slate-500'}`}>Approach</div>
                        <div className="text-xs text-slate-500">LOC + G/S tracking</div>
                    </div>
                    <div className={`p-3 rounded-lg ${altitude <= 50 && altitude > 0 ? 'bg-amber-500/20 border border-amber-500' : 'bg-slate-800/50 border border-slate-700'}`}>
                        <div className={`font-bold ${altitude <= 50 && altitude > 0 ? 'text-amber-400' : 'text-slate-500'}`}>Flare</div>
                        <div className="text-xs text-slate-500">~50 ft, pitch up starts</div>
                    </div>
                    <div className={`p-3 rounded-lg ${altitude === 0 ? 'bg-emerald-500/20 border border-emerald-500' : 'bg-slate-800/50 border border-slate-700'}`}>
                        <div className={`font-bold ${altitude === 0 ? 'text-emerald-400' : 'text-slate-500'}`}>Rollout</div>
                        <div className="text-xs text-slate-500">Auto-brakes, NWS</div>
                    </div>
                </div>
            </div>

            {/* Key Exam Points */}
            <div className="mt-8 bg-amber-500/10 border border-amber-500/30 rounded-xl p-5">
                <h3 className="text-amber-400 font-bold mb-3 flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Key Exam Points
                </h3>
                <ul className="text-slate-300 text-sm space-y-2">
                    <li>• <strong>Alert Height:</strong> 100 ft above DH. If A/P fails here, go-around is mandatory for CAT II/III.</li>
                    <li>• <strong>Flare Mode:</strong> Initiated at ~50 ft RA. A/T goes to RETARD at ~30 ft.</li>
                    <li>• <strong>Rollout:</strong> Requires localizer signal for auto-steering. Speed brakes deploy on main gear compression.</li>
                    <li>• <strong>CAT IIIC:</strong> Theoretical only. No airports currently certified.</li>
                </ul>
            </div>
        </div>
    );
};

export default AutolandSystem;
