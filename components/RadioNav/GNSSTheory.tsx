
import React, { useState } from 'react';
import { View } from '../../types';
import { ArrowLeft, Globe, Satellite, Clock, RadioTower, AlertTriangle, Layers, Navigation, Cpu } from 'lucide-react';

interface Props {
    onNavigate?: (view: View) => void;
}

const GNSSTheory: React.FC<Props> = ({ onNavigate }) => {
    const [activeTab, setActiveTab] = useState('CONST');

    return (
        <div className="max-w-6xl mx-auto p-4 space-y-6 pb-20">
            <div className="flex items-center space-x-4 mb-6">
                <button
                    onClick={() => onNavigate?.(View.RAD_NAV_HOME)}
                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
                        <Satellite className="text-sky-400" size={32} />
                        Global Navigation Satellite Systems
                    </h1>
                    <p className="text-slate-400 mt-1">Class 12: Architecture, Signals, Positioning & Errors</p>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 p-1 bg-slate-900/80 rounded-xl backdrop-blur-sm border border-slate-800 sticky top-4 z-50">
                <TabButton id="CONST" label="Constellations" icon={<Globe size={18} />} active={activeTab} setActive={setActiveTab} />
                <TabButton id="ARCH" label="Architecture" icon={<Layers size={18} />} active={activeTab} setActive={setActiveTab} />
                <TabButton id="POS" label="Positioning" icon={<Navigation size={18} />} active={activeTab} setActive={setActiveTab} />
                <TabButton id="ERR" label="Errors" icon={<AlertTriangle size={18} />} active={activeTab} setActive={setActiveTab} />
            </div>

            <div className="transition-all duration-300">
                {activeTab === 'CONST' && <ConstellationsSection />}
                {activeTab === 'ARCH' && <ArchitectureSection />}
                {activeTab === 'POS' && <PositioningSection />}
                {activeTab === 'ERR' && <ErrorsSection />}
            </div>
        </div>
    );
};

const TabButton = ({ id, label, icon, active, setActive }: any) => (
    <button
        onClick={() => setActive(id)}
        className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${active === id
            ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/20'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
    >
        {icon}
        <span className="hidden sm:inline">{label}</span>
    </button>
);

// === SECTION 1: CONSTELLATIONS ===
const ConstellationsSection = () => {
    const systems = [
        { id: 'GPS', country: 'USA', Sats: '24+', Orbit: '20,200 km', Period: '11h 58m' },
        { id: 'GLONASS', country: 'Russia', Sats: '24+', Orbit: '19,100 km', Period: '11h 15m' },
        { id: 'Galileo', country: 'EU', Sats: '24+', Orbit: '23,222 km', Period: '14h 05m' },
        { id: 'BeiDou', country: 'China', Sats: '35', Orbit: 'Multiple', Period: 'Var' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {systems.map(s => (
                    <div key={s.id} className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-sky-500/50 transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-black text-white">{s.id}</h3>
                            <span className="text-xs font-bold px-2 py-1 rounded bg-slate-800 text-slate-400 group-hover:bg-sky-900 group-hover:text-sky-300 transition-colors">
                                {s.country}
                            </span>
                        </div>
                        <ul className="text-sm text-slate-400 space-y-2">
                            <li className="flex justify-between">
                                <span>Satellites</span> <span className="text-white">{s.Sats}</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Altitude</span> <span className="text-white">{s.Orbit}</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Period</span> <span className="text-white">{s.Period}</span>
                            </li>
                        </ul>
                    </div>
                ))}
            </div>

            <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-900/50">
                <h3 className="text-xl font-bold text-sky-400 mb-4 flex items-center gap-2">
                    <OrbitIcon size={24} /> Orbital Characteristics
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <p className="text-slate-300 mb-4 leading-relaxed">
                            Satellites are in <strong className="text-white">Medium Earth Orbit (MEO)</strong>.
                            GPS uses <strong className="text-white">6 orbital planes</strong> inclined at 55° to the equator, ensuring at least 4 satellites are visible from any point on Earth at any time.
                        </p>
                        <div className="bg-slate-800 p-4 rounded-lg border-l-4 border-yellow-500">
                            <h4 className="font-bold text-white mb-1">Key Concept</h4>
                            <p className="text-sm text-slate-400">
                                They are NOT geostationary (except some SBAS/BeiDou). They move across the sky, completing ~2 orbits per day.
                            </p>
                        </div>
                    </div>
                    <div className="relative h-64 bg-black rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
                        {/* Earth */}
                        <div className="w-24 h-24 rounded-full bg-blue-600 shadow-[0_0_30px_rgba(37,99,235,0.5)] z-10 flex items-center justify-center">
                            <Globe className="text-blue-300 opacity-50" size={64} />
                        </div>
                        {/* Orbits */}
                        {[0, 60, 120].map(deg => (
                            <div key={deg} className={`absolute w-[200px] h-[60px] rounded-[100%] border border-slate-600/50`}
                                style={{ transform: `rotate(${deg}deg)` }}>
                                <div className="absolute top-0 left-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_white] animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// === SECTION 2: ARCHITECTURE ===
const ArchitectureSection = () => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid md:grid-cols-3 gap-6">
                {/* Space Segment */}
                <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-900/50 flex flex-col items-center text-center">
                    <div className="p-4 bg-slate-800 rounded-full mb-4 text-sky-400">
                        <Satellite size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Space Segment</h3>
                    <p className="text-sm text-slate-400 mb-4">
                        The constellation of SVs (Space Vehicles). Transmit precise time and position data on L1/L2/L5 frequencies.
                    </p>
                    <div className="mt-auto w-full bg-slate-800 p-3 rounded text-xs text-left">
                        <strong className="block text-slate-300 mb-1">Atomic Clocks</strong>
                        Each SV has 4 atomic clocks (Cesium/Rubidium) for nanosecond precision.
                    </div>
                </div>

                {/* Control Segment */}
                <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-900/50 flex flex-col items-center text-center">
                    <div className="p-4 bg-slate-800 rounded-full mb-4 text-emerald-400">
                        <RadioTower size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Control Segment</h3>
                    <p className="text-sm text-slate-400 mb-4">
                        Master Control Station (Colorado Springs) + Monitor Stations. Tracks satellites and updates their clocks & orbits.
                    </p>
                    <div className="mt-auto w-full bg-slate-800 p-3 rounded text-xs text-left">
                        <strong className="block text-slate-300 mb-1">Uploads</strong>
                        Sends "Ephemeris" (precise orbit) and "Almanac" (general orbit) updates to SVs.
                    </div>
                </div>

                {/* User Segment */}
                <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-900/50 flex flex-col items-center text-center">
                    <div className="p-4 bg-slate-800 rounded-full mb-4 text-amber-400">
                        <Navigation size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">User Segment</h3>
                    <p className="text-sm text-slate-400 mb-4">
                        The aircraft receiver. Passive (does not transmit). Calculates position based on Time of Arrival.
                    </p>
                    <div className="mt-auto w-full bg-slate-800 p-3 rounded text-xs text-left">
                        <strong className="block text-slate-300 mb-1">Pseudo-Random Noise</strong>
                        Receiver matches internal PRN code with received code to measure time delay.
                    </div>
                </div>
            </div>

            {/* Signal Details */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
                <h3 className="text-lg font-bold text-slate-200 mb-4">The GPS Signal</h3>
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li className="flex gap-2">
                                <div className="w-20 font-mono text-sky-400">L1 freq</div>
                                <div className="flex-1">1575.42 MHz (UHF). Carries C/A code (Civil) and P code (Military).</div>
                            </li>
                            <li className="flex gap-2">
                                <div className="w-20 font-mono text-sky-400">Ephemeris</div>
                                <div className="flex-1">Detailed orbital data for the specific satellite. Valid for ~4 hours.</div>
                            </li>
                            <li className="flex gap-2">
                                <div className="w-20 font-mono text-sky-400">Almanac</div>
                                <div className="flex-1">Coarse data for the entire constellation. Helps receiver find sats. Valid for months.</div>
                            </li>
                        </ul>
                    </div>
                    <div className="bg-black/50 p-4 rounded border border-white/5 font-mono text-xs text-green-400 overflow-hidden">
                        <div>&gt; RX_SIGNAL_LOCK: PRN_04</div>
                        <div>&gt; TIME_DELAY: 0.0674s</div>
                        <div>&gt; DISTANCE: 20,220 km</div>
                        <div>&gt; DECODING NAV MSG...</div>
                        <div className="mt-2 text-slate-500">
                            The receiver generates a replica of the PRN code and shifts it to match the incoming signal. The shift amount = Time Delay.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// === SECTION 3: POSITIONING ===
const PositioningSection = () => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-900/50">
                        <h3 className="text-xl font-bold text-sky-400 mb-4">Trilateration</h3>
                        <p className="text-slate-300 mb-4 text-sm">
                            Distance is calculated by <strong className="text-white">Speed of Light × Time</strong>.
                            Knowing distance from satellites creates intersecting spheres.
                        </p>

                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-3 p-3 bg-slate-800 rounded">
                                <div className="font-mono text-2xl font-bold text-slate-500">1</div>
                                <div>
                                    <strong className="text-white">Satellite</strong>
                                    <div className="text-slate-400 text-xs">"I am somewhere on this sphere"</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-slate-800 rounded">
                                <div className="font-mono text-2xl font-bold text-slate-500">2</div>
                                <div>
                                    <strong className="text-white">Satellites</strong>
                                    <div className="text-slate-400 text-xs">Intersection is a circle (infinite positions)</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-slate-800 rounded">
                                <div className="font-mono text-2xl font-bold text-blue-400">3</div>
                                <div>
                                    <strong className="text-white">Satellites</strong>
                                    <div className="text-slate-400 text-xs">Two points (one usually in space, rejected). Gives 2D fix (Lat/Long).</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-slate-800 rounded border border-emerald-500/50">
                                <div className="font-mono text-2xl font-bold text-emerald-400">4</div>
                                <div>
                                    <strong className="text-white">Satellites</strong>
                                    <div className="text-slate-400 text-xs">Resolves <strong className="text-emerald-400">Receiver Clock Error</strong>. Gives 3D fix (Lat/Long/Alt).</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 flex flex-col items-center justify-center text-center">
                    <div className="relative w-64 h-64 mb-4">
                        {/* Abstract Visualization of Intersecting Circles */}
                        <div className="absolute top-0 left-10 w-32 h-32 rounded-full border-2 border-red-500/30 animate-pulse"></div>
                        <div className="absolute top-10 right-10 w-32 h-32 rounded-full border-2 border-blue-500/30 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                        <div className="absolute bottom-4 left-20 w-32 h-32 rounded-full border-2 border-green-500/30 animate-pulse" style={{ animationDelay: '1s' }}></div>

                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_15px_white]"></div>
                    </div>
                    <p className="text-sm text-slate-400 max-w-xs">
                        Satellites have cheap quartz clocks. They drift. The 4th satellite provides a 4th equation to solve for the 4th unknown variable (Time Bias), synchronizing the receiver to atomic time.
                    </p>
                </div>
            </div>
        </div>
    );
};

// === SECTION 4: ERRORS ===
const ErrorsSection = () => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-900/50">
                <h3 className="text-xl font-bold text-rose-400 mb-6 flex items-center gap-2">
                    <AlertTriangle size={24} /> System Errors
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                    <ErrorCard
                        title="Ionospheric Delay"
                        val="~10-20m"
                        desc="Solar radiation ionizes the atmosphere, slowing down signal speed. Greatest error source. Corrected by dual-frequency (L1/L2) or Modelling."
                    />
                    <ErrorCard
                        title="Clock Error"
                        val="~2m"
                        desc="Small discrepancies between atomic clock and receiver time."
                    />
                    <ErrorCard
                        title="Multipath"
                        val="~1-3m"
                        desc="Signal reflects off ground or buildings before reaching receiver. Ghost signals."
                    />
                    <ErrorCard
                        title="Ephemeris Error"
                        val="~2m"
                        desc="Satellite is not exactly where it claims to be in orbit."
                    />
                </div>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-2">GDOP (Geometric Dilution of Precision)</h3>
                <p className="text-sm text-slate-400 mb-4">
                    The geometry of satellites affects accuracy.
                </p>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="text-center">
                        <div className="h-24 flex items-center justify-center gap-1 mb-2">
                            <Satellite size={20} className="text-sky-500" />
                            <Satellite size={20} className="text-sky-500" />
                            <Satellite size={20} className="text-sky-500" />
                        </div>
                        <div className="font-bold text-rose-400">High GDOP (Bad)</div>
                        <p className="text-xs text-slate-500">Satellites bunched together. Large area of uncertainty.</p>
                    </div>
                    <div className="text-center">
                        <div className="h-24 relative mb-2">
                            <Satellite size={20} className="text-emerald-500 absolute top-0 left-0" />
                            <Satellite size={20} className="text-emerald-500 absolute top-0 right-0" />
                            <Satellite size={20} className="text-emerald-500 absolute bottom-0 left-1/2" />
                        </div>
                        <div className="font-bold text-emerald-400">Low GDOP (Good)</div>
                        <p className="text-xs text-slate-500">Satellites widely spread out. Precise intersection.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ErrorCard = ({ title, val, desc }: any) => (
    <div className="bg-slate-800 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
            <h4 className="font-bold text-white">{title}</h4>
            <span className="text-xs font-mono bg-slate-700 px-2 py-1 rounded text-rose-300">{val}</span>
        </div>
        <p className="text-xs text-slate-400">{desc}</p>
    </div>
);

function OrbitIcon(props: any) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
            <path d="M2 12a14.5 14.5 0 0 0 20 0 14.5 14.5 0 0 0-20 0" />
        </svg>
    )
}

export default GNSSTheory;
