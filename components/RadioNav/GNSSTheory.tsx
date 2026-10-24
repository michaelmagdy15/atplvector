import React, { useState } from 'react';
import { View } from '../../types';
import { ArrowLeft, Globe, Satellite, AlertTriangle, Layers, Navigation, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';

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
                        Global Navigation Satellite Systems (062)
                    </h1>
                    <p className="text-slate-400 mt-1">Architecture, Signals, Trilateration, RAIM & Augmentation Systems</p>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 p-1 bg-slate-900/80 rounded-xl backdrop-blur-sm border border-slate-800 sticky top-4 z-50">
                <TabButton id="CONST" label="Constellations" icon={<Globe size={18} />} active={activeTab} setActive={setActiveTab} />
                <TabButton id="ARCH" label="Architecture & Signals" icon={<Layers size={18} />} active={activeTab} setActive={setActiveTab} />
                <TabButton id="POS" label="Trilateration & Clocks" icon={<Navigation size={18} />} active={activeTab} setActive={setActiveTab} />
                <TabButton id="RAIM" label="RAIM & Augmentation" icon={<ShieldCheck size={18} />} active={activeTab} setActive={setActiveTab} />
                <TabButton id="ERR" label="Errors & DOP" icon={<AlertTriangle size={18} />} active={activeTab} setActive={setActiveTab} />
            </div>

            <div className="transition-all duration-300">
                {activeTab === 'CONST' && <ConstellationsSection />}
                {activeTab === 'ARCH' && <ArchitectureSection />}
                {activeTab === 'POS' && <PositioningSection />}
                {activeTab === 'RAIM' && <RAIMSection />}
                {activeTab === 'ERR' && <ErrorsSection />}
            </div>
        </div>
    );
};

const TabButton = ({ id, label, icon, active, setActive }: any) => (
    <button
        onClick={() => setActive(id)}
        className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
            active === id
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
        { id: 'GPS (NAVSTAR)', country: 'USA', Sats: '24 nominal (31+ active)', Orbit: '20,200 km (10,898 NM)', Period: '11h 58m (half sidereal day)', Planes: '6 planes @ 55° inclination' },
        { id: 'GLONASS', country: 'Russia', Sats: '24 nominal', Orbit: '19,100 km (10,313 NM)', Period: '11h 15m', Planes: '3 planes @ 64.8° inclination' },
        { id: 'Galileo', country: 'EU (Civilian)', Sats: '24 + 6 spares', Orbit: '23,222 km (12,539 NM)', Period: '14h 05m', Planes: '3 planes @ 56° inclination' },
        { id: 'BeiDou (BDS)', country: 'China', Sats: '35 (MEO + GEO + IGSO)', Orbit: '21,528 km (MEO)', Period: '12h 38m', Planes: '3 planes MEO + GEO & IGSO' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {systems.map(s => (
                    <div key={s.id} className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-sky-500/50 transition-colors group flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-lg font-black text-white">{s.id}</h3>
                                <span className="text-xs font-bold px-2 py-1 rounded bg-slate-800 text-slate-400 group-hover:bg-sky-900 group-hover:text-sky-300 transition-colors">
                                    {s.country}
                                </span>
                            </div>
                            <ul className="text-xs text-slate-400 space-y-2">
                                <li className="flex justify-between">
                                    <span>Satellites</span> <span className="text-white font-mono">{s.Sats}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Altitude</span> <span className="text-white font-mono">{s.Orbit}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Period</span> <span className="text-white font-mono">{s.Period}</span>
                                </li>
                                <li className="flex flex-col pt-1 border-t border-slate-800">
                                    <span className="text-slate-500">Geometry</span>
                                    <span className="text-slate-300 font-mono text-[11px] mt-0.5">{s.Planes}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                ))}
            </div>

            <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-900/50">
                <h3 className="text-xl font-bold text-sky-400 mb-4 flex items-center gap-2">
                    <OrbitIcon size={24} /> Orbital Mechanics & Geometry for Aviation
                </h3>
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                        <p className="text-slate-300 leading-relaxed text-sm">
                            GPS operates in <strong className="text-white">Medium Earth Orbit (MEO)</strong> at an altitude of approximately <strong className="text-white">20,200 km (10,898 NM)</strong>.
                            The constellation uses <strong className="text-sky-400">6 orbital planes</strong> spaced 60° apart around the equator, each inclined at <strong className="text-sky-400">55°</strong>.
                        </p>
                        <div className="bg-slate-800/80 p-4 rounded-lg border-l-4 border-amber-500 text-xs space-y-2">
                            <h4 className="font-bold text-white text-sm">Key EASA ATPL Concept</h4>
                            <p className="text-slate-300">
                                Satellites are <strong>NOT geostationary</strong>. They orbit Earth once every <strong>11 hours 58 minutes</strong> (half a sidereal day), rising and setting ~4 minutes earlier each day.
                            </p>
                            <p className="text-slate-400">
                                This ensures that at least <strong>4 satellites</strong> (and typically 6 to 12) are visible from any point on Earth at an elevation mask angle above 5°.
                            </p>
                        </div>
                    </div>
                    <div className="relative h-64 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-blue-600 shadow-[0_0_35px_rgba(37,99,235,0.6)] z-10 flex items-center justify-center">
                            <Globe className="text-blue-200 opacity-60" size={56} />
                        </div>
                        {[0, 60, 120].map(deg => (
                            <div
                                key={deg}
                                className="absolute w-[220px] h-[75px] rounded-[100%] border border-sky-500/30"
                                style={{ transform: `rotate(${deg}deg)` }}
                            >
                                <div className="absolute top-0 left-1/2 w-2.5 h-2.5 bg-yellow-400 rounded-full shadow-[0_0_10px_#facc15] animate-pulse"></div>
                            </div>
                        ))}
                        <div className="absolute bottom-2 right-3 text-[10px] text-slate-500 font-mono">
                            6 Orbital Planes • 55° Inclination
                        </div>
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
                        Constellation of 24+ Space Vehicles (SVs). Continuously transmit navigation signals containing time, orbital ephemeris, and status on UHF frequencies.
                    </p>
                    <div className="mt-auto w-full bg-slate-800 p-3 rounded text-xs text-left border-l-2 border-sky-400">
                        <strong className="block text-slate-200 mb-1">Atomic Clocks (Onboard SV)</strong>
                        Each satellite carries <strong className="text-amber-400">4 Atomic Clocks</strong> (Cesium & Rubidium standards) with nanosecond precision ($10^{-9}\text{ s}$).
                    </div>
                </div>

                {/* Control Segment */}
                <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-900/50 flex flex-col items-center text-center">
                    <div className="p-4 bg-slate-800 rounded-full mb-4 text-emerald-400">
                        <Layers size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Control Segment</h3>
                    <p className="text-sm text-slate-400 mb-4">
                        Master Control Station (Schriever SFB, Colorado) + 16 Monitor Stations + Ground Antennas worldwide. Tracks orbits, synchronizes clocks, uploads updates.
                    </p>
                    <div className="mt-auto w-full bg-slate-800 p-3 rounded text-xs text-left border-l-2 border-emerald-400">
                        <strong className="block text-slate-200 mb-1">Navigation Message Uploads</strong>
                        Uploads <strong>Ephemeris</strong> (precise current orbit, valid ~4 hours) and <strong>Almanac</strong> (coarse constellation data, valid ~6 months).
                    </div>
                </div>

                {/* User Segment */}
                <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-900/50 flex flex-col items-center text-center">
                    <div className="p-4 bg-slate-800 rounded-full mb-4 text-amber-400">
                        <Navigation size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">User Segment</h3>
                    <p className="text-sm text-slate-400 mb-4">
                        Aircraft avionics GNSS receiver and antenna. Fully <strong>passive</strong> (transmits nothing). Computes time of arrival (TOA) and pseudo-ranges.
                    </p>
                    <div className="mt-auto w-full bg-slate-800 p-3 rounded text-xs text-left border-l-2 border-amber-400">
                        <strong className="block text-slate-200 mb-1">Quartz Oscillator (Receiver)</strong>
                        Equipped with an inexpensive <strong>quartz clock</strong>. The 4th satellite measurement solves for receiver clock error $\Delta t_r$.
                    </div>
                </div>
            </div>

            {/* Signal Details */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 space-y-4">
                <h3 className="text-lg font-bold text-slate-200">GPS Radio Frequencies & Modulation</h3>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3 text-sm text-slate-400">
                        <p className="text-xs text-slate-300">
                            GPS signals are transmitted in the <strong className="text-white">UHF band</strong> using Code Division Multiple Access (CDMA) with BPSK modulation:
                        </p>
                        <div className="bg-slate-800 p-3 rounded-lg font-mono text-xs space-y-2">
                            <div className="flex justify-between border-b border-slate-700 pb-1">
                                <span className="text-sky-400 font-bold">L1: 1575.42 MHz</span>
                                <span className="text-slate-300">C/A code (Civilian, 1.023 MHz) + P(Y) code</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-700 pb-1">
                                <span className="text-sky-400 font-bold">L2: 1227.60 MHz</span>
                                <span className="text-slate-300">P(Y) code + L2C (Dual-freq iono correction)</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sky-400 font-bold">L5: 1176.45 MHz</span>
                                <span className="text-emerald-400 font-bold">Aviation Safety of Life (Civilian)</span>
                            </div>
                        </div>
                        <p className="text-xs text-slate-400">
                            <strong>PRN (Pseudo-Random Noise):</strong> A unique mathematical code broadcast by each satellite. The receiver aligns its local replica code with the received code; the time delay corresponds to the distance.
                        </p>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-green-400 flex flex-col justify-between">
                        <div className="space-y-1">
                            <div>&gt; GNSS_RECEIVER_STATUS: TRACKING 9 SVs</div>
                            <div>&gt; SATELLITE_CLOCKS: ATOMIC (Cesium / Rubidium)</div>
                            <div>&gt; AIRCRAFT_CLOCK: QUARTZ CRYSTAL (Corrected by 4th SV)</div>
                            <div>&gt; EPHEMERIS: VALID (Expires in 03h 42m)</div>
                            <div>&gt; ALMANAC: VALID (Age: 3 days)</div>
                            <div>&gt; CARRIER: L1 (1575.42 MHz) + L5 (1176.45 MHz)</div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-800 text-slate-400 text-[11px] leading-relaxed">
                            <strong className="text-white">Exam Takeaway:</strong> Ephemeris provides high-precision orbital data for the specific satellite being tracked. Almanac contains coarse orbital parameters for the entire constellation to speed up satellite acquisition.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// === SECTION 3: POSITIONING & CLOCKS ===
const PositioningSection = () => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-900/50">
                        <h3 className="text-xl font-bold text-sky-400 mb-3">Trilateration Principles</h3>
                        <p className="text-slate-300 mb-4 text-sm leading-relaxed">
                            Distance to each satellite is measured using Time of Arrival:
                            <br />
                            <span className="font-mono text-sky-300 bg-slate-800 px-2 py-0.5 rounded text-xs inline-block my-1">
                                Pseudo-Range (r) = c × (t_rx - t_tx)
                            </span>
                            <br />
                            where c = 300,000 km/s (162,000 NM/s). Because the receiver's quartz clock is not perfectly synchronized with atomic time, the calculated range is called a <strong>pseudo-range</strong>.
                        </p>

                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-3 p-3 bg-slate-800 rounded">
                                <div className="font-mono text-2xl font-bold text-slate-500 w-8 text-center">1</div>
                                <div>
                                    <strong className="text-white">1 Satellite Sphere</strong>
                                    <div className="text-slate-400 text-xs">Position lies anywhere on a sphere centered at satellite.</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-slate-800 rounded">
                                <div className="font-mono text-2xl font-bold text-slate-400 w-8 text-center">2</div>
                                <div>
                                    <strong className="text-white">2 Satellites Circle</strong>
                                    <div className="text-slate-400 text-xs">Intersection of 2 spheres produces a circle of position.</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-slate-800 rounded">
                                <div className="font-mono text-2xl font-bold text-blue-400 w-8 text-center">3</div>
                                <div>
                                    <strong className="text-white">3 Satellites (2 Points / 2D Fix)</strong>
                                    <div className="text-slate-400 text-xs">Intersection produces 2 discrete points. With altitude known (or Earth surface intersection), yields a 2D Fix (Latitude & Longitude).</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-slate-800 rounded border border-emerald-500/50">
                                <div className="font-mono text-2xl font-bold text-emerald-400 w-8 text-center">4</div>
                                <div>
                                    <strong className="text-white">4 Satellites (Full 3D Fix + Time Bias)</strong>
                                    <div className="text-slate-400 text-xs">Provides 4 simultaneous equations in 4 unknowns (x, y, z, Δt). Resolves receiver quartz clock bias and gives Latitude, Longitude, and Altitude.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 flex flex-col justify-between">
                    <div>
                        <h4 className="text-base font-bold text-amber-400 mb-2 flex items-center gap-2">
                            <AlertTriangle size={18} /> Critical Exam Clarification: Atomic vs Quartz Clocks
                        </h4>
                        <div className="bg-amber-950/30 border border-amber-800/40 rounded-lg p-4 text-xs text-slate-300 space-y-3 leading-relaxed">
                            <p>
                                <strong className="text-amber-300">Common Misconception:</strong> "Satellites have cheap quartz clocks that drift."
                            </p>
                            <p>
                                <strong className="text-emerald-400">CORRECT ATPL FACT:</strong>
                                <br />
                                • <strong className="text-white">Satellites carry 4 Atomic Clocks</strong> (Cesium/Rubidium) accurate to 1 second in 300,000 years.
                                <br />
                                • <strong className="text-white">Aircraft Receivers carry Inexpensive Quartz Clocks</strong> because atomic clocks are too heavy, power-hungry, and costly for everyday avionics.
                            </p>
                            <p>
                                Since light travels at 300,000 km/s, a clock error of just <strong className="text-amber-300">1 millisecond (0.001 s) produces a 300 km (162 NM) error</strong>!
                            </p>
                            <p>
                                The 4th satellite provides the 4th mathematical equation required to eliminate this receiver clock bias, effectively granting the quartz receiver the timing accuracy of an atomic clock!
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs font-mono text-slate-400">
                        <div className="text-sky-400 font-bold mb-1">Equation System Solved by Receiver:</div>
                        <div>(x - x_1)² + (y - y_1)² + (z - z_1)² = [c · (Δt_1 - Δt_r)]²</div>
                        <div>(x - x_2)² + (y - y_2)² + (z - z_2)² = [c · (Δt_2 - Δt_r)]²</div>
                        <div>(x - x_3)² + (y - y_3)² + (z - z_3)² = [c · (Δt_3 - Δt_r)]²</div>
                        <div>(x - x_4)² + (y - y_4)² + (z - z_4)² = [c · (Δt_4 - Δt_r)]²</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// === SECTION 4: RAIM & AUGMENTATION ===
const RAIMSection = () => {
    const [satCount, setSatCount] = useState<number>(5);
    const [baroAiding, setBaroAiding] = useState<boolean>(false);

    // RAIM capability logic
    const effectiveSats = satCount + (baroAiding ? 1 : 0);
    const has2D = effectiveSats >= 3;
    const has3D = effectiveSats >= 4;
    const hasFD = effectiveSats >= 5;
    const hasFDE = effectiveSats >= 6;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Interactive RAIM Simulator */}
            <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-900/50">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-sky-400 flex items-center gap-2">
                            <ShieldCheck size={24} /> RAIM Integrity Interactive Simulator
                        </h3>
                        <p className="text-slate-400 text-xs mt-1">
                            Receiver Autonomous Integrity Monitoring (ICAO Annex 10 / EASA CS-ACNS)
                        </p>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-800 px-4 py-2 rounded-xl">
                        <label className="text-xs font-bold text-slate-300 flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={baroAiding}
                                onChange={(e) => setBaroAiding(e.target.checked)}
                                className="w-4 h-4 text-sky-600 rounded bg-slate-700 border-slate-600 focus:ring-sky-500"
                            />
                            Barometric Aiding Enabled (+1 Pseudo-SV)
                        </label>
                    </div>
                </div>

                <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-300 font-semibold">Visible In-View Satellites:</span>
                        <span className="text-2xl font-black text-sky-400 font-mono">{satCount} SVs</span>
                    </div>
                    <input
                        type="range"
                        min="2"
                        max="8"
                        step="1"
                        value={satCount}
                        onChange={(e) => setSatCount(parseInt(e.target.value))}
                        className="w-full accent-sky-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-slate-500 font-mono">
                        <span>2 Sats</span>
                        <span>3 Sats</span>
                        <span>4 Sats (3D)</span>
                        <span>5 Sats (FD)</span>
                        <span>6 Sats (FDE)</span>
                        <span>7+ Sats</span>
                    </div>
                </div>

                {/* Status Badges */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className={`p-4 rounded-xl border ${has2D ? 'bg-sky-950/40 border-sky-600 text-sky-200' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-sm">2D Navigation</span>
                            {has2D ? <CheckCircle2 size={18} className="text-sky-400" /> : <XCircle size={18} className="text-slate-600" />}
                        </div>
                        <p className="text-xs">Requires 3 Satellites (Lat/Long with known altitude).</p>
                    </div>

                    <div className={`p-4 rounded-xl border ${has3D ? 'bg-blue-950/40 border-blue-600 text-blue-200' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-sm">3D Navigation</span>
                            {has3D ? <CheckCircle2 size={18} className="text-blue-400" /> : <XCircle size={18} className="text-slate-600" />}
                        </div>
                        <p className="text-xs">Requires 4 Satellites. Solves x, y, z and receiver clock bias.</p>
                    </div>

                    <div className={`p-4 rounded-xl border ${hasFD ? 'bg-amber-950/40 border-amber-500 text-amber-200' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-sm">RAIM Fault Detection</span>
                            {hasFD ? <CheckCircle2 size={18} className="text-amber-400" /> : <XCircle size={18} className="text-slate-600" />}
                        </div>
                        <p className="text-xs">Requires 5 Satellites (or 4 + Baro). Detects faulty SV and alerts pilot.</p>
                    </div>

                    <div className={`p-4 rounded-xl border ${hasFDE ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-sm">RAIM Fault Exclusion</span>
                            {hasFDE ? <CheckCircle2 size={18} className="text-emerald-400" /> : <XCircle size={18} className="text-slate-600" />}
                        </div>
                        <p className="text-xs">Requires 6 Satellites (or 5 + Baro). Isolates & discards faulty SV seamlessly.</p>
                    </div>
                </div>
            </div>

            {/* Augmentation Systems (ABAS, SBAS, GBAS) */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sky-400">ABAS</h4>
                        <span className="text-[10px] bg-sky-950 text-sky-300 px-2 py-0.5 rounded border border-sky-800">Airborne</span>
                    </div>
                    <p className="text-xs text-slate-300">
                        <strong>Airborne Based Augmentation System:</strong> Uses aircraft avionics and sensors only.
                    </p>
                    <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                        <li>RAIM software algorithms</li>
                        <li>Barometric VNAV integration (Baro-aiding)</li>
                        <li>IRS/INS hybridization for coasting during GNSS outages</li>
                    </ul>
                </div>

                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="font-bold text-amber-400">SBAS</h4>
                        <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800">Satellite</span>
                    </div>
                    <p className="text-xs text-slate-300">
                        <strong>Satellite Based Augmentation System:</strong> Ground reference stations compute differential corrections and ionospheric delay maps, uplinked to <strong>Geostationary (GEO)</strong> satellites.
                    </p>
                    <ul className="text-xs text-slate-400 space-y-1.5">
                        <li>• <strong className="text-white">EGNOS</strong> (Europe)</li>
                        <li>• <strong className="text-white">WAAS</strong> (North America)</li>
                        <li>• <strong className="text-white">MSAS</strong> (Japan), <strong className="text-white">GAGAN</strong> (India)</li>
                        <li>• Enables <strong className="text-amber-300">LPV Approaches down to 200 ft</strong> DH without ground ILS.</li>
                    </ul>
                </div>

                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="font-bold text-emerald-400">GBAS (LAAS)</h4>
                        <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">Ground VHF</span>
                    </div>
                    <p className="text-xs text-slate-300">
                        <strong>Ground Based Augmentation System:</strong> 4 reference receivers at an airport calculate differential corrections broadcast locally via <strong>VHF Data Broadcast (VDB)</strong> on 108.025–117.950 MHz.
                    </p>
                    <ul className="text-xs text-slate-400 space-y-1.5">
                        <li>• Range: ~20–30 NM around aerodrome</li>
                        <li>• Single station supports multiple runway ends</li>
                        <li>• Supports <strong className="text-emerald-300">CAT I, II, and III</strong> precision approaches and autoland.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

// === SECTION 5: ERRORS & DOP ===
const ErrorsSection = () => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-900/50">
                <h3 className="text-xl font-bold text-rose-400 mb-6 flex items-center gap-2">
                    <AlertTriangle size={24} /> GNSS Error Budget & Atmospheric Physics
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                    <ErrorCard
                        title="Ionospheric Delay (Largest Error)"
                        val="~5 - 30m"
                        desc="Solar radiation ionizes atmospheric gas into free electrons, which refract and retard GNSS radio signals inversely proportional to the square of frequency (1/f²). Corrected by dual-frequency comparison (L1/L2/L5), SBAS models, or Klobuchar iono model."
                    />
                    <ErrorCard
                        title="Tropospheric Delay"
                        val="~2 - 4m"
                        desc="Temperature, pressure, and humidity in the lower atmosphere (0–50 km) refract and delay signals. Unlike the ionosphere, troposphere is non-dispersive (all radio frequencies delayed equally); corrected using barometric/temperature standard atmosphere models."
                    />
                    <ErrorCard
                        title="Multipath Error"
                        val="~1 - 3m"
                        desc="Signal bounces off aircraft fuselage, wings, ground, water, or airport hangars before entering the antenna. Produces phase shift and range overestimation. Mitigated by choke-ring antennas and carrier-smoothing."
                    />
                    <ErrorCard
                        title="Ephemeris & Clock Drift"
                        val="~1 - 2m"
                        desc="Small differences between predicted satellite orbital position and actual trajectory, plus minute atomic clock drift. Updated regularly by the Master Control Station."
                    />
                    <ErrorCard
                        title="Relativistic Effects"
                        val="~38 μs / day"
                        desc="Special relativity (high orbital velocity slows satellite clocks by -7 μs/day) + General relativity (weaker gravitational potential speeds clocks up by +45 μs/day). Net effect: satellite clocks tick +38 μs/day faster; factory calibrated before launch to 10.22999999543 MHz instead of 10.23 MHz!"
                    />
                    <ErrorCard
                        title="Selective Availability (SA)"
                        val="0m (Retired)"
                        desc="Intentional military signal degradation introduced by US DoD in the 1990s. Deactivated on May 1, 2000, and permanently removed from GPS Block III satellites."
                    />
                </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4">
                <h3 className="text-lg font-bold text-white">DOP (Dilution of Precision) Geometry</h3>
                <p className="text-xs text-slate-400">
                    DOP is a purely geometric multiplier: <span className="font-mono text-sky-400">Total Error = DOP × UERE (User Equivalent Range Error)</span>.
                    Lower DOP values indicate superior satellite geometry and higher precision.
                </p>

                <div className="grid md:grid-cols-2 gap-6 pt-2">
                    <div className="bg-rose-950/20 border border-rose-900/50 p-4 rounded-xl text-center">
                        <div className="h-20 flex items-center justify-center gap-3 mb-2">
                            <Satellite size={24} className="text-rose-400 animate-bounce" />
                            <Satellite size={24} className="text-rose-400" />
                            <Satellite size={24} className="text-rose-400 animate-pulse" />
                        </div>
                        <div className="font-bold text-rose-300 text-sm">High DOP (&gt; 6) — Poor Geometry</div>
                        <p className="text-xs text-slate-400 mt-1">
                            Satellites are bunched together in one sector of the sky. The intersecting position lines cross at shallow angles, creating a large ellipse of uncertainty.
                        </p>
                    </div>

                    <div className="bg-emerald-950/20 border border-emerald-900/50 p-4 rounded-xl text-center">
                        <div className="h-20 relative mb-2 flex items-center justify-center">
                            <Satellite size={20} className="text-emerald-400 absolute top-1 left-8" />
                            <Satellite size={20} className="text-emerald-400 absolute top-1 right-8" />
                            <Satellite size={20} className="text-emerald-400 absolute bottom-1 left-1/2 -translate-x-1/2" />
                        </div>
                        <div className="font-bold text-emerald-300 text-sm">Low DOP (1 - 3) — Optimal Geometry</div>
                        <p className="text-xs text-slate-400 mt-1">
                            Satellites are widely separated across the sky (one overhead, others near 15°–20° above horizon). The intersecting spheres cut near 90°, yielding tight position fixes.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono pt-2">
                    <div className="bg-slate-800 p-2.5 rounded border border-slate-700">
                        <div className="text-slate-400">GDOP</div>
                        <div className="text-white font-bold">Geometric (3D + Time)</div>
                    </div>
                    <div className="bg-slate-800 p-2.5 rounded border border-slate-700">
                        <div className="text-slate-400">PDOP</div>
                        <div className="text-white font-bold">Position (3D Space)</div>
                    </div>
                    <div className="bg-slate-800 p-2.5 rounded border border-slate-700">
                        <div className="text-slate-400">HDOP</div>
                        <div className="text-white font-bold">Horizontal (Lat / Long)</div>
                    </div>
                    <div className="bg-slate-800 p-2.5 rounded border border-slate-700">
                        <div className="text-slate-400">VDOP</div>
                        <div className="text-white font-bold">Vertical (Altitude)</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ErrorCard = ({ title, val, desc }: any) => (
    <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60">
        <div className="flex justify-between items-center mb-2">
            <h4 className="font-bold text-slate-100 text-sm">{title}</h4>
            <span className="text-xs font-mono bg-slate-900 px-2 py-0.5 rounded text-rose-300 border border-rose-900/40">{val}</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
    </div>
);

function OrbitIcon(props: any) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
            <path d="M2 12a14.5 14.5 0 0 0 20 0 14.5 14.5 0 0 0-20 0" />
        </svg>
    );
}

export default GNSSTheory;
