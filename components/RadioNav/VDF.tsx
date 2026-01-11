import React, { useState, useEffect } from 'react';
import { View } from '../../types';
import { ArrowLeft, Radio, Wind, Compass, AlertTriangle, Navigation, Signal, Antenna, Info, CheckCircle, XCircle } from 'lucide-react';

interface Props {
    onNavigate?: (view: View) => void;
}

const VDF: React.FC<Props> = ({ onNavigate }) => {
    const [activeTab, setActiveTab] = useState('SPECTRUM');

    return (
        <div className="max-w-6xl mx-auto p-4 space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center space-x-4 mb-6">
                <button
                    onClick={() => onNavigate?.(View.RAD_NAV_HOME)}
                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
                        <Radio className="text-sky-400" size={32} />
                        VDF (VHF Direction Finding)
                    </h1>
                    <p className="text-slate-400 mt-1">Master direction finding: principles, Q-codes, and operational procedures.</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 p-1 bg-slate-900/80 rounded-xl backdrop-blur-sm border border-slate-800 sticky top-4 z-50">
                <TabButton id="SPECTRUM" label="Spectrum & Antennas" icon={<Signal size={18} />} active={activeTab} setActive={setActiveTab} />
                <TabButton id="PRINCIPLES" label="Principles (Adcock)" icon={<Antenna size={18} />} active={activeTab} setActive={setActiveTab} />
                <TabButton id="QCODES" label="Directional Q-Codes" icon={<Compass size={18} />} active={activeTab} setActive={setActiveTab} />
                <TabButton id="ACCURACY" label="Accuracy & Errors" icon={<AlertTriangle size={18} />} active={activeTab} setActive={setActiveTab} />
                <TabButton id="OPS" label="Operational Apps" icon={<Navigation size={18} />} active={activeTab} setActive={setActiveTab} />
            </div>

            {/* Content Body */}
            <div className="min-h-[600px] transition-all duration-300">
                {activeTab === 'SPECTRUM' && <SpectrumSection />}
                {activeTab === 'PRINCIPLES' && <PrinciplesSection />}
                {activeTab === 'QCODES' && <QCodesSection />}
                {activeTab === 'ACCURACY' && <AccuracySection />}
                {activeTab === 'OPS' && <OpsSection />}
            </div>
        </div>
    );
};

// --- Shared Components ---

const TabButton = ({ id, label, icon, active, setActive }: any) => (
    <button
        onClick={() => setActive(id)}
        className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${active === id
            ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/20'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
    >
        {icon}
        {label}
    </button>
);

// --- Sections ---

const SpectrumSection = () => {
    const [freq, setFreq] = useState(118); // MHz
    // Simple logic: 300kHz (0.3 MHz) -> 500m antenna. 118 MHz -> 1.25m antenna.
    // Lambda (m) = 300 / f (MHz)
    // Quarter Wave Antenna = Lambda / 4
    const wavelength = 300 / freq;
    const antennaSize = wavelength / 4;

    // For visualization scale, we limit heights
    const scaleHeight = Math.min(antennaSize, 100);

    const [isSkywave, setIsSkywave] = useState(false);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid md:grid-cols-2 gap-8">
                {/* Calculator Card */}
                <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-900/50">
                    <h3 className="text-xl font-bold text-sky-400 mb-4 flex items-center gap-2">
                        <Signal size={20} /> Frequency vs. Antenna Size
                    </h3>
                    <p className="text-slate-300 mb-6 text-sm">
                        Antenna efficiency depends on its size relative to the wavelength. Lower frequencies require massive antennas.
                    </p>

                    <div className="space-y-6">
                        <div>
                            <label className="flex justify-between text-sm text-slate-300 mb-2">
                                <span>Frequency</span>
                                <span className="font-mono text-sky-400">{freq >= 1 ? freq.toFixed(1) : freq.toFixed(3)} MHz</span>
                            </label>
                            <input
                                type="range"
                                min="0.3"
                                max="150"
                                step="0.1"
                                value={freq}
                                onChange={(e) => setFreq(Number(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                            />
                            <div className="flex justify-between text-xs text-slate-500 mt-2">
                                <span onClick={() => setFreq(0.3)} className="cursor-pointer hover:text-white">LF (300kHz)</span>
                                <span onClick={() => setFreq(10)} className="cursor-pointer hover:text-white">HF (10MHz)</span>
                                <span onClick={() => setFreq(118)} className="cursor-pointer hover:text-white">VHF (118MHz)</span>
                            </div>
                        </div>

                        <div className="bg-slate-800/50 p-4 rounded-lg space-y-2">
                            <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                                <span className="text-slate-400 text-sm">Wavelength ($\lambda$)</span>
                                <span className="text-white font-mono">{wavelength.toFixed(1)} m</span>
                            </div>
                            <div className="flex justify-between items-center text-sky-300">
                                <span className="text-sm font-bold">Ideal Antenna ($\lambda/4$)</span>
                                <span className="font-mono text-xl">{antennaSize.toFixed(2)} m</span>
                            </div>
                        </div>

                        {antennaSize > 10 && (
                            <div className="bg-red-900/20 text-red-300 p-3 rounded-lg text-xs flex gap-2 items-start border border-red-500/20">
                                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                                <div>
                                    <strong>Impractical for Aircraft!</strong>
                                    <p>An antenna of {antennaSize.toFixed(1)}m cannot fit on a tail fin. HF radios use "bent" wires or matching units, sacrificing efficiency.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Visualizer */}
                <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="text-xs text-slate-500 absolute top-4 left-4">Visual Scale (Logarithmic)</div>
                    {/* Tail Fin Representation */}
                    <div className="relative mt-20">
                        {/* Fin base */}
                        <div className="w-32 h-24 bg-slate-800 transform skew-x-[-20deg] rounded-sm relative z-10 border border-slate-700"></div>
                        <div className="absolute bottom-0 left-0 text-[10px] text-slate-500 -mb-5">Aircraft Tail</div>

                        {/* The Antenna */}
                        {/* We clamp visualization height but show real text */}
                        <div
                            className="bg-sky-500 w-1 absolute bottom-24 left-1/2 transform -translate-x-1/2 transition-all duration-300 shadow-[0_0_15px_#0ea5e9]"
                            style={{ height: `${Math.min(antennaSize * 10, 200)}px` }}
                        ></div>

                        {antennaSize > 20 && (
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-red-500 text-sm font-bold animate-pulse whitespace-nowrap">
                                TOO TALL!
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Propagation Section */}
            <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-900/50">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-sky-400">Propagation: HF vs VHF</h3>
                    <div className="flex gap-2 bg-slate-800 p-1 rounded-lg">
                        <button onClick={() => setIsSkywave(false)} className={`px-3 py-1 rounded text-sm ${!isSkywave ? 'bg-sky-600 text-white' : 'text-slate-400'}`}>VHF (Line of Sight)</button>
                        <button onClick={() => setIsSkywave(true)} className={`px-3 py-1 rounded text-sm ${isSkywave ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>HF (Skywave)</button>
                    </div>
                </div>

                <div className="relative h-64 bg-slate-950 rounded-lg overflow-hidden border border-slate-800">
                    {/* Earth */}
                    <div className="absolute bottom-0 left-0 right-0 h-4 bg-emerald-900/50"></div>
                    <div className="absolute bottom-4 left-10 text-white text-xs">TX</div>
                    <div className="absolute bottom-4 left-10 w-2 h-6 bg-slate-600"></div>

                    {/* Ionosphere */}
                    <div className={`absolute top-0 left-0 right-0 h-16 bg-purple-900/10 border-b border-purple-500/20 transition-opacity duration-500 ${isSkywave ? 'opacity-100' : 'opacity-30'}`}>
                        <div className="absolute top-2 right-2 text-xs text-purple-400">Ionosphere</div>
                    </div>

                    {/* Aircraft */}
                    <div className="absolute top-20 right-20 text-2xl">✈️</div>

                    {/* Waves */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        {isSkywave ? (
                            <path d="M 50 170 L 200 10 L 400 100" fill="none" stroke="#60a5fa" strokeWidth="2" strokeDasharray="5,5" className="animate-[dash_20s_linear_infinite]" />
                        ) : (
                            <path d="M 50 170 L 400 80" fill="none" stroke="#22c55e" strokeWidth="2" className="animate-pulse" />
                        )}
                    </svg>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 px-4 py-2 rounded text-sm text-slate-200 backdrop-blur-sm">
                        {isSkywave
                            ? "HF signals bounce off the Ionosphere (Skywave), allowing Over-The-Horizon range. Frequency must be adjusted for day/night ion changes."
                            : "VHF signals penetrate the ionosphere and are lost to space. They rely on Line-of-Sight."}
                    </div>
                </div>
            </div>
        </div>
    );
};

const PrinciplesSection = () => {
    const [signalAngle, setSignalAngle] = useState(45);

    return (
        <div className="grid lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-4">The Adcock Aerial</h2>
                <p className="text-slate-300 leading-relaxed">
                    Modern VDF uses the <strong>Adcock Aerial</strong> array. It consists of four vertical dipoles arranged in a square.
                    By comparing the <strong>Phase Difference</strong> of the arriving signal at opposite pairs of antennas, the direction can be calculated electronically without moving parts.
                </p>

                <div className="bg-slate-800 p-4 rounded-xl border-l-4 border-sky-500">
                    <h4 className="font-bold text-sky-400 mb-2">Why Phase Difference?</h4>
                    <p className="text-sm text-slate-400">
                        As a radio wave hits the array, it reaches one antenna slightly before the other (unless perpendicular). This time delay creates a phase shift proportional to the angle of arrival.
                    </p>
                </div>

                <div className="p-4 bg-slate-900 rounded-xl border border-slate-700">
                    <label className="block text-sm font-semibold text-slate-300 mb-4">Rotate Incoming Signal Source</label>
                    <input
                        type="range"
                        min="0"
                        max="360"
                        value={signalAngle}
                        onChange={(e) => setSignalAngle(Number(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                    />
                    <div className="text-center mt-2 font-mono text-sky-400 text-xl">{signalAngle}°</div>
                </div>
            </div>

            <div className="bg-slate-950 rounded-xl border border-slate-800 p-8 flex items-center justify-center relative min-h-[400px]">
                {/* Adcock Array Visual */}
                <div className="relative w-64 h-64">
                    {/* Antennas */}
                    <div className="absolute top-0 left-1/2 w-4 h-4 bg-sky-500 rounded-full -translate-x-1/2 ring-4 ring-sky-900/50"></div> {/* N */}
                    <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-sky-500 rounded-full -translate-x-1/2 ring-4 ring-sky-900/50"></div> {/* S */}
                    <div className="absolute left-0 top-1/2 w-4 h-4 bg-sky-500 rounded-full -translate-y-1/2 ring-4 ring-sky-900/50"></div> {/* W */}
                    <div className="absolute right-0 top-1/2 w-4 h-4 bg-sky-500 rounded-full -translate-y-1/2 ring-4 ring-sky-900/50"></div> {/* E */}

                    {/* Cables to Center */}
                    <div className="absolute inset-0 border-2 border-slate-800 rounded-full opacity-20"></div>
                    <div className="absolute top-1/2 left-1/2 w-32 h-[2px] bg-slate-700 -translate-y-1/2 -translate-x-1/2"></div>
                    <div className="absolute top-1/2 left-1/2 w-[2px] h-32 bg-slate-700 -translate-y-1/2 -translate-x-1/2"></div>

                    {/* Central Processor */}
                    <div className="absolute top-1/2 left-1/2 w-12 h-12 bg-slate-800 border-2 border-slate-600 rounded flex items-center justify-center -translate-x-1/2 -translate-y-1/2 z-10 shadow-xl">
                        <span className="text-[10px] text-slate-400">DF Unit</span>
                    </div>

                    {/* Incoming Wavefront */}
                    <div
                        className="absolute top-1/2 left-1/2 w-[200%] h-[200%] pointer-events-none transition-transform duration-100 ease-out -translate-x-1/2 -translate-y-1/2"
                        style={{ transform: `translate(-50%, -50%) rotate(${signalAngle - 90}deg)` }}
                    >
                        {/* Arrows representing wave direction */}
                        <div className="absolute inset-0 flex flex-col justify-center items-center opacity-30">
                            <div className="text-4xl text-sky-400 animate-pulse">↓</div>
                            <div className="text-4xl text-sky-400 animate-pulse delay-75">↓</div>
                            <div className="text-4xl text-sky-400 animate-pulse delay-150">↓</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const QCodesSection = () => {
    const [heading, setHeading] = useState(45);
    const [bearing, setBearing] = useState(225); // Pos of aircraft relative to station

    // QDM: Magnetic TO Station
    // If bearing (FROM station) is 225, then aircraft is SW of station.
    // To fly TO station, we need to fly NE (045).
    const qdm = (bearing + 180) % 360;
    const qdr = bearing;

    return (
        <div className="grid lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-6">
                <div className="glass-panel p-6 rounded-xl space-y-4 bg-slate-900/50 border border-slate-800">
                    <h2 className="text-white font-bold text-xl flex items-center gap-2"><Compass size={24} className="text-sky-400" /> Directional Q-Codes</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-green-500/5 group-hover:bg-green-500/10 transition-colors"></div>
                            <h3 className="text-3xl font-mono font-bold text-green-400">{Math.round(qdm).toString().padStart(3, '0')}°</h3>
                            <div className="text-sm font-bold text-white mt-1">QDM</div>
                            <div className="text-xs text-slate-400">Magnetic Bearing <strong>TO</strong> Station</div>
                        </div>
                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-orange-500/5 group-hover:bg-orange-500/10 transition-colors"></div>
                            <h3 className="text-3xl font-mono font-bold text-orange-400">{Math.round(qdr).toString().padStart(3, '0')}°</h3>
                            <div className="text-sm font-bold text-white mt-1">QDR</div>
                            <div className="text-xs text-slate-400">Magnetic Bearing <strong>FROM</strong> Station</div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center p-2 bg-slate-800/50 rounded-lg">
                        <span className="text-sm text-slate-300 font-mono">QDM ± 180° = QDR</span>
                    </div>

                    <div className="pt-4">
                        <label className="text-sm text-slate-400 mb-2 block">Aircraft Position (Orbit Station)</label>
                        <input
                            type="range"
                            min="0"
                            max="360"
                            value={bearing}
                            onChange={(e) => setBearing(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                        />
                    </div>
                </div>

                <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/20 text-sm text-blue-200">
                    <strong className="block mb-1">Tip:</strong>
                    QUJ is the TRUE bearing to the station. QDM is MAGNETIC.
                    <br />
                    VDF is mostly used for limited situations, like QDM steers.
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 relative h-[400px] overflow-hidden">
                {/* Grid */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                {/* Station */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20">
                    <div className="w-8 h-8 bg-sky-600 rounded-full flex items-center justify-center border-4 border-slate-900 shadow-xl">
                        <Radio size={16} className="text-white" />
                    </div>
                    <span className="text-xs font-bold text-sky-400 mt-2 bg-slate-900/80 px-2 rounded">STATION</span>
                </div>

                {/* Bearing Line QDR */}
                <div
                    className="absolute top-1/2 left-1/2 h-0.5 bg-orange-500/50 origin-left z-0"
                    style={{
                        width: '300px',
                        transform: `rotate(${qdr - 90}deg)` // -90 because 0deg is usually East in CSS rotate (if using right), here careful with orientation
                    }}
                ></div>

                {/* Aircraft */}
                <div
                    className="absolute w-12 h-12 z-30 transition-all duration-75 ease-linear flex flex-col items-center justify-center"
                    style={{
                        top: '50%', left: '50%',
                        transform: `rotate(${bearing - 90}deg) translate(140px) rotate(-${bearing - 90}deg)`
                    }}
                >
                    <div style={{ transform: `rotate(${heading}deg)` }}>
                        <div className="text-3xl filter drop-shadow-lg">✈️</div>
                    </div>
                    <div className="absolute -bottom-8 bg-slate-900/90 text-[10px] px-2 py-1 rounded border border-slate-600 whitespace-nowrap">
                        Track: {heading}°
                    </div>
                </div>
            </div>
        </div>
    );
};

const AccuracySection = () => {
    const [selectedClass, setSelectedClass] = useState<'A' | 'B' | 'C' | 'D'>('B');

    // Accuracies
    const accuracyMap = {
        'A': 2,
        'B': 5,
        'C': 10,
        'D': 20 // >10
    };

    const acc = accuracyMap[selectedClass];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white">VDF Accuracy Classes</h2>
                    <p className="text-slate-300">
                        The accuracy of a bearing provided by a VDF station is classified into four categories.
                        The controller will usually state the class if it is not Class B or better.
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                        {(['A', 'B', 'C', 'D'] as const).map((cls) => (
                            <button
                                key={cls}
                                onClick={() => setSelectedClass(cls)}
                                className={`p-4 rounded-xl border transition-all text-left ${selectedClass === cls
                                    ? 'bg-sky-600/20 border-sky-500 ring-1 ring-sky-500'
                                    : 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                                    }`}
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <span className={`font-bold ${selectedClass === cls ? 'text-sky-400' : 'text-slate-200'}`}>Class {cls}</span>
                                    {selectedClass === cls && <CheckCircle size={16} className="text-sky-400" />}
                                </div>
                                <div className="text-2xl font-mono text-white">± {accuracyMap[cls]}°</div>
                                <div className="text-xs text-slate-400 mt-2">
                                    {cls === 'A' && "Precision approach quality"}
                                    {cls === 'B' && "Standard operational use"}
                                    {cls === 'C' && "Limited reliability"}
                                    {cls === 'D' && "Unreliable / Not for nav"}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Cone Visualizer */}
                <div className="bg-slate-950 p-8 rounded-xl border border-slate-800 flex items-center justify-center relative shadow-inner">
                    <div className="absolute top-4 left-4 text-xs text-slate-500">Visualization of Bearing Error</div>

                    <div className="relative w-full h-64 flex flex-col items-center justify-end">
                        {/* Station */}
                        <div className="w-4 h-4 bg-sky-500 rounded-full z-10 shadow-[0_0_20px_#0ea5e9]"></div>

                        {/* Beams */}
                        <div
                            className="absolute bottom-2 h-[300px] w-1 bg-green-500/50 origin-bottom"
                            style={{ transform: 'rotate(0deg)' }}
                        ></div>

                        {/* Error Cone Left */}
                        <div
                            className="absolute bottom-2 h-[300px] bg-red-500/20 origin-bottom transition-all duration-500 border-l border-red-500/30"
                            style={{
                                width: '2px', // minimal width, we use rotate
                                transform: `rotate(-${acc}deg)`,
                                height: '250px'
                            }}
                        >
                            {/* Area fill hack with spread not easily possible in pure CSS rotate with simple div, 
                            so we use a pie slice or SVG */}
                        </div>

                        {/* SVG Cone for better viz */}
                        <svg className="absolute bottom-2 left-1/2 -translate-x-1/2 overflow-visible" width="300" height="300" style={{ pointerEvents: 'none', bottom: '8px' }}>
                            <path
                                d={`M 150 300 L ${150 - Math.tan(acc * Math.PI / 180) * 250} 50 L ${150 + Math.tan(acc * Math.PI / 180) * 250} 50 Z`}
                                fill="rgba(239, 68, 68, 0.2)"
                                stroke="rgba(239, 68, 68, 0.5)"
                            />
                        </svg>

                        <div className="absolute top-10 bg-slate-900 px-3 py-1 rounded-full text-xs border border-slate-700 text-slate-300">
                            Total Spread: {acc * 2}°
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-900/50">
                <h3 className="text-xl font-bold text-white mb-4">Common Errors</h3>
                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        { title: "Synchronous Transmission", desc: "If two aircraft transmit at once, the DF reading can be erratic or an average.", icon: <Signal /> },
                        { title: "Mountain Effect", desc: "Reflections from terrain can cause 'ghost' bearings or signal bending.", icon: <Wind /> },
                        { title: "Site Error", desc: "Metal hangars or buildings near the antennas distort the incoming wavefront.", icon: <Antenna /> }
                    ].map((err, i) => (
                        <div key={i} className="bg-slate-800 p-4 rounded-lg flex flex-col gap-3">
                            <div className="p-2 bg-slate-700 w-fit rounded-lg text-sky-400">{err.icon}</div>
                            <h4 className="font-bold text-slate-200">{err.title}</h4>
                            <p className="text-sm text-slate-400">{err.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const OpsSection = () => {
    const [status, setStatus] = useState<'IDLE' | 'TRANSMITTING' | 'RECEIVED' | 'CORRECTED'>('IDLE');
    const [heading, setHeading] = useState(20); // starts wrong
    const targetQDM = 270; // We want to go West

    const handleTransmit = () => {
        setStatus('TRANSMITTING');
        setTimeout(() => setStatus('RECEIVED'), 1500);
    };

    const handleTurn = () => {
        setHeading(targetQDM);
        setStatus('CORRECTED');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-white">Emergency Procedures</h2>
                <p className="text-slate-400">
                    VDF is primarily used when an aircraft is unsure of its position or has a Nav failure.
                    Simulate a "QDM Steer" request.
                </p>
            </div>

            <div className="bg-slate-950 border-2 border-slate-800 rounded-2xl p-8 relative overflow-hidden min-h-[400px]">
                {/* Cockpit View UI */}
                <div className="absolute top-4 left-4 text-xs font-mono text-green-500 bg-black/60 p-2 rounded border border-green-500/30">
                    COM1: 124.500 <br />
                    STBY: 118.000
                </div>

                <div className="flex flex-col items-center justify-center h-full space-y-8">

                    {/* Direction Indicator */}
                    <div className="relative w-48 h-48 bg-slate-900 rounded-full border-4 border-slate-700 shadow-2xl flex items-center justify-center">
                        <div className="absolute text-xs text-slate-500 -top-6">HEADING</div>

                        {/* Compass Card */}
                        <div
                            className="w-full h-full rounded-full border border-slate-600 relative transition-transform duration-1000 ease-in-out"
                            style={{ transform: `rotate(${-heading}deg)` }}
                        >
                            {[0, 90, 180, 270].map(d => (
                                <div key={d} className="absolute text-slate-200 text-sm font-bold"
                                    style={{
                                        top: d === 0 ? "5px" : d === 180 ? "auto" : "50%",
                                        bottom: d === 180 ? "5px" : "auto",
                                        left: d === 270 ? "5px" : d === 90 ? "auto" : "50%",
                                        right: d === 90 ? "5px" : "auto",
                                        transform: `translate(${d === 0 || d === 180 ? '-50%' : '0'}, ${d === 90 || d === 270 ? '-50%' : '0'})`
                                    }}>
                                    {d === 0 ? 'N' : d === 90 ? 'E' : d === 180 ? 'S' : 'W'}
                                </div>
                            ))}
                        </div>

                        {/* Aircraft Symbol Fixed */}
                        <div className="absolute text-3xl text-yellow-500">✈️</div>
                    </div>

                    {/* Interactions */}
                    <div className="w-full max-w-md space-y-4 z-10">
                        {status === 'IDLE' && (
                            <button
                                onClick={handleTransmit}
                                className="w-full py-4 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl shadow-lg shadow-sky-900/40 transition-all flex items-center justify-center gap-2"
                            >
                                <Radio size={20} />
                                Request QDM (Press PTT)
                            </button>
                        )}

                        {status === 'TRANSMITTING' && (
                            <div className="w-full py-4 bg-slate-800 text-sky-400 font-mono text-center rounded-xl animate-pulse border border-sky-500/30">
                                "Vector Tower, G-ABCD, request QDM..."
                            </div>
                        )}

                        {status === 'RECEIVED' && (
                            <div className="space-y-4">
                                <div className="bg-slate-800 p-4 rounded-xl border-l-4 border-green-500 text-green-300 font-mono">
                                    "G-CD, QDM 270 Degrees Class Alpha."
                                </div>
                                <button
                                    onClick={handleTurn}
                                    className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-xl shadow-lg transition-all"
                                >
                                    Turn Left to Heading 270
                                </button>
                            </div>
                        )}

                        {status === 'CORRECTED' && (
                            <div className="bg-green-600/20 text-green-400 p-4 rounded-xl text-center border border-green-500/30 flex items-center justify-center gap-2">
                                <CheckCircle />
                                Tracking to Station
                                <button onClick={() => { setStatus('IDLE'); setHeading(20); }} className="ml-4 text-xs underline text-slate-400 hover:text-white">Reset</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VDF;
