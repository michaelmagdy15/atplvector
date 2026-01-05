import React, { useState } from 'react';
import { Gauge, ArrowDown, AlertTriangle, Ear, Wind } from 'lucide-react';

const HPLPressure: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'basics' | 'barotrauma' | 'decompression'>('basics');

    return (
        <div className="space-y-6">
            <header className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-sky-500/20 rounded-lg">
                        <Gauge className="w-6 h-6 text-sky-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-100">Pressure Effects & Barotrauma</h1>
                </div>
                <p className="text-slate-400">
                    Understanding how atmospheric pressure changes affect the body, including gas expansion, barotrauma, and decompression.
                </p>
            </header>

            <div className="flex gap-2 bg-slate-800/50 p-1 rounded-lg">
                <TabButton
                    active={activeTab === 'basics'}
                    onClick={() => setActiveTab('basics')}
                    icon={ArrowDown}
                    label="Pressure Basics"
                />
                <TabButton
                    active={activeTab === 'barotrauma'}
                    onClick={() => setActiveTab('barotrauma')}
                    icon={Ear}
                    label="Barotrauma"
                />
                <TabButton
                    active={activeTab === 'decompression'}
                    onClick={() => setActiveTab('decompression')}
                    icon={AlertTriangle}
                    label="Decompression"
                />
            </div>

            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 min-h-[400px]">
                {activeTab === 'basics' && <PressureBasics />}
                {activeTab === 'barotrauma' && <BarotraumaSim />}
                {activeTab === 'decompression' && <DecompressionSection />}
            </div>
        </div>
    );
};

const TabButton = ({ active, onClick, icon: Icon, label }: any) => (
    <button
        onClick={onClick}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md transition-all font-medium ${active
            ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/20'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
    >
        <Icon size={18} />
        {label}
    </button>
);

const PressureBasics = () => {
    const [altitude, setAltitude] = useState(0);

    // Calculate pressure at altitude using barometric formula approximation
    const pressure = Math.round(1013.25 * Math.pow((1 - altitude * 0.0000225577), 5.25588));
    const gasExpansion = ((1013.25 / pressure) * 100).toFixed(0);

    const altitudeData = [
        { alt: 0, pressure: 1013, gas: '100%' },
        { alt: 8000, pressure: 753, gas: '135%' },
        { alt: 18000, pressure: 506, gas: '200%' },
        { alt: 25000, pressure: 376, gas: '270%' },
        { alt: 35000, pressure: 238, gas: '426%' },
        { alt: 40000, pressure: 188, gas: '539%' },
    ];

    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-xl font-bold text-white mb-4">Boyle's Law Simulator</h3>
                    <p className="text-slate-400 text-sm mb-6">
                        As altitude increases, pressure decreases. Trapped gases in body cavities <span className="text-sky-400 font-bold">expand</span>.
                    </p>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-slate-400 mb-2 block">Altitude: {altitude.toLocaleString()} ft</label>
                            <input
                                type="range"
                                min="0"
                                max="40000"
                                step="1000"
                                value={altitude}
                                onChange={e => setAltitude(Number(e.target.value))}
                                className="w-full accent-sky-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                                <div className="text-xs text-slate-500 uppercase mb-1">Pressure</div>
                                <div className="text-2xl font-bold text-sky-400">{pressure} hPa</div>
                            </div>
                            <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                                <div className="text-xs text-slate-500 uppercase mb-1">Gas Volume</div>
                                <div className="text-2xl font-bold text-amber-400">{gasExpansion}%</div>
                            </div>
                        </div>
                    </div>

                    {/* Visual Gas Expansion */}
                    <div className="mt-6 flex items-end justify-center gap-4 h-32">
                        <div className="text-center">
                            <div
                                className="w-16 bg-sky-500/30 border-2 border-sky-500 rounded-lg transition-all duration-300"
                                style={{ height: '60px' }}
                            />
                            <span className="text-xs text-slate-400 mt-1 block">Sea Level</span>
                        </div>
                        <div className="text-center">
                            <div
                                className="w-16 bg-amber-500/30 border-2 border-amber-500 rounded-lg transition-all duration-300"
                                style={{ height: `${Math.min(120, 60 * (parseFloat(gasExpansion) / 100))}px` }}
                            />
                            <span className="text-xs text-slate-400 mt-1 block">{altitude.toLocaleString()} ft</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-bold text-white mb-4">Pressure vs Altitude Table</h3>
                    <div className="bg-slate-900 rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-950">
                                <tr>
                                    <th className="px-4 py-2 text-left text-slate-400">Altitude (ft)</th>
                                    <th className="px-4 py-2 text-left text-slate-400">Pressure (hPa)</th>
                                    <th className="px-4 py-2 text-left text-slate-400">Gas Vol.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {altitudeData.map(row => (
                                    <tr key={row.alt} className="border-t border-slate-800">
                                        <td className="px-4 py-2 text-white">{row.alt.toLocaleString()}</td>
                                        <td className="px-4 py-2 text-sky-400">{row.pressure}</td>
                                        <td className="px-4 py-2 text-amber-400">{row.gas}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="bg-sky-900/20 border border-sky-500/30 p-4 rounded-lg">
                <h4 className="font-bold text-sky-300 mb-2">Boyle's Law: P₁V₁ = P₂V₂</h4>
                <p className="text-slate-300 text-sm">
                    At constant temperature, the volume of a gas is inversely proportional to its pressure.
                    At 18,000 ft, gas expands to roughly <span className="text-amber-400 font-bold">double</span> its sea level volume.
                </p>
            </div>
        </div>
    );
};

const BarotraumaSim = () => {
    const cavities = [
        {
            name: 'Middle Ear',
            icon: '👂',
            ascent: 'Eustachian tube usually vents automatically',
            descent: 'Air must be actively equalized (Valsalva, swallowing)',
            symptoms: 'Pain, tinnitus, vertigo, hearing loss',
            prevention: 'Equalize early and often, avoid flying with cold',
            color: 'blue'
        },
        {
            name: 'Sinuses',
            icon: '👃',
            ascent: 'Usually vents through ostia',
            descent: 'Blocked ostia trap air, causing pain',
            symptoms: 'Frontal headache, pain over cheekbones',
            prevention: 'Avoid flying with congestion, use decongestants',
            color: 'purple'
        },
        {
            name: 'Teeth',
            icon: '🦷',
            ascent: 'Trapped air under fillings expands',
            descent: 'Less common, pressure on nerves',
            symptoms: 'Sharp toothache (barodontalgia)',
            prevention: 'Regular dental checkups, proper fillings',
            color: 'emerald'
        },
        {
            name: 'GI Tract',
            icon: '🫁',
            ascent: 'Intestinal gas expands significantly',
            descent: 'Usually not problematic',
            symptoms: 'Bloating, cramps, discomfort',
            prevention: 'Avoid gas-producing foods before flight',
            color: 'amber'
        },
    ];

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white">Barotrauma: Pressure Injury to Body Cavities</h3>
                <p className="text-slate-400 text-sm mt-2">Click each cavity to see details about ascent vs descent effects</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {cavities.map(cavity => (
                    <div
                        key={cavity.name}
                        className={`bg-${cavity.color}-900/20 border border-${cavity.color}-500/30 rounded-xl p-5 hover:border-${cavity.color}-500/60 transition-all`}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl">{cavity.icon}</span>
                            <h4 className="text-lg font-bold text-white">{cavity.name}</h4>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex gap-2">
                                <span className="text-green-400 font-bold w-20 shrink-0">↑ Ascent:</span>
                                <span className="text-slate-300">{cavity.ascent}</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-red-400 font-bold w-20 shrink-0">↓ Descent:</span>
                                <span className="text-slate-300">{cavity.descent}</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-amber-400 font-bold w-20 shrink-0">Symptoms:</span>
                                <span className="text-slate-300">{cavity.symptoms}</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-sky-400 font-bold w-20 shrink-0">Prevention:</span>
                                <span className="text-slate-300">{cavity.prevention}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg">
                <h4 className="font-bold text-red-300 flex items-center gap-2 mb-2">
                    <AlertTriangle size={18} /> Valsalva Maneuver Warning
                </h4>
                <p className="text-slate-300 text-sm">
                    Never perform Valsalva during <span className="text-red-400 font-bold">ascent</span> - this can
                    force air through the Eustachian tube and cause reverse squeeze. Only use during descent to equalize.
                </p>
            </div>
        </div>
    );
};

const DecompressionSection = () => {
    const [cabinAlt, setCabinAlt] = useState(8000);
    const decompressionTypes = [
        {
            type: 'Slow/Gradual',
            time: '> 10 seconds',
            cause: 'Small leak, seal failure, door seal issue',
            symptoms: 'May go unnoticed initially, gradual hypoxia symptoms',
            action: 'Monitor cabin altitude, use O2 if needed, descend',
            severity: 'low'
        },
        {
            type: 'Rapid',
            time: '1-10 seconds',
            cause: 'Structural failure, window crack, large seal breach',
            symptoms: 'Loud noise, fog, sudden cold, ear pain, debris',
            action: 'Don O2 mask, emergency descent, declare emergency',
            severity: 'medium'
        },
        {
            type: 'Explosive',
            time: '< 1 second',
            cause: 'Catastrophic structural failure, bomb',
            symptoms: 'Violent, lung damage possible, instant fog',
            action: 'Immediate O2, maximum rate descent',
            severity: 'high'
        },
    ];

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'low': return 'border-yellow-500/30 bg-yellow-900/20';
            case 'medium': return 'border-orange-500/30 bg-orange-900/20';
            case 'high': return 'border-red-500/30 bg-red-900/20';
            default: return '';
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Decompression Events</h3>

            <div className="space-y-4">
                {decompressionTypes.map(d => (
                    <div key={d.type} className={`rounded-xl p-5 border ${getSeverityColor(d.severity)}`}>
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-lg font-bold text-white">{d.type} Decompression</h4>
                            <span className="text-sm font-mono bg-slate-900 px-3 py-1 rounded text-slate-400">{d.time}</span>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <div>
                                <span className="text-slate-500 block mb-1">Cause</span>
                                <span className="text-slate-300">{d.cause}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 block mb-1">Symptoms</span>
                                <span className="text-slate-300">{d.symptoms}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 block mb-1">Action</span>
                                <span className="text-emerald-400 font-medium">{d.action}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-slate-900 p-6 rounded-xl">
                <h4 className="font-bold text-white mb-4">Time of Useful Consciousness (TUC)</h4>
                <div className="grid grid-cols-4 gap-4 text-center">
                    {[
                        { alt: '25,000 ft', tuc: '3-5 min' },
                        { alt: '30,000 ft', tuc: '1-2 min' },
                        { alt: '35,000 ft', tuc: '30-60 sec' },
                        { alt: '40,000 ft', tuc: '15-20 sec' },
                    ].map(item => (
                        <div key={item.alt} className="bg-slate-800 p-4 rounded-lg">
                            <div className="text-slate-400 text-xs mb-1">{item.alt}</div>
                            <div className="text-xl font-bold text-red-400">{item.tuc}</div>
                        </div>
                    ))}
                </div>
                <p className="text-sm text-slate-400 mt-4 text-center">
                    TUC is <span className="text-red-400">halved</span> during rapid/explosive decompression due to reverse respiration.
                </p>
            </div>
        </div>
    );
};

export default HPLPressure;
