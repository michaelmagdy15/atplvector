import React, { useState } from 'react';
import { Gauge, ArrowDown, AlertTriangle, Ear, Wind, Activity, Clock, ShieldAlert, Waves, CheckCircle2, AlertOctagon } from 'lucide-react';

const HPLPressure: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'basics' | 'barotrauma' | 'decompression' | 'dcs'>('basics');

    return (
        <div className="space-y-6">
            <header className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-sky-500/20 rounded-lg">
                        <Gauge className="w-6 h-6 text-sky-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-100">Pressure Effects, Barotrauma &amp; DCS</h1>
                        <p className="text-xs text-sky-400 font-mono mt-0.5">EASA ATPL Human Performance &amp; Limitations · Topic 040.01.02</p>
                    </div>
                </div>
                <p className="text-slate-400 text-sm">
                    Atmospheric pressure physics, Boyle&apos;s &amp; Henry&apos;s gas laws, physiological barotrauma, explosive decompression, Time of Useful Consciousness (TUC), and Decompression Sickness (DCS).
                </p>
            </header>

            <div className="flex gap-2 bg-slate-800/50 p-1 rounded-lg flex-wrap">
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
                    label="Decompression & TUC"
                />
                <TabButton
                    active={activeTab === 'dcs'}
                    onClick={() => setActiveTab('dcs')}
                    icon={Waves}
                    label="DCS & Scuba Diving"
                />
            </div>

            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 min-h-[400px]">
                {activeTab === 'basics' && <PressureBasics />}
                {activeTab === 'barotrauma' && <BarotraumaSim />}
                {activeTab === 'decompression' && <DecompressionSection />}
                {activeTab === 'dcs' && <DCSSection />}
            </div>
        </div>
    );
};

const TabButton = ({ active, onClick, icon: Icon, label }: any) => (
    <button
        onClick={onClick}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-md transition-all font-medium text-xs sm:text-sm whitespace-nowrap ${active
            ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/20'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
    >
        <Icon size={16} />
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
                    <h3 className="text-xl font-bold text-white mb-4">Boyle&apos;s Law Simulator</h3>
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
                <h4 className="font-bold text-sky-300 mb-2">Boyle&apos;s Law: P₁V₁ = P₂V₂</h4>
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
                        className="bg-slate-900/60 border border-slate-700 rounded-xl p-5 hover:border-sky-500/60 transition-all"
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
                    Never perform Valsalva during <span className="text-red-400 font-bold">ascent</span> — this can
                    force air through the Eustachian tube and cause reverse squeeze. Only use during descent to equalize.
                </p>
            </div>
        </div>
    );
};

const DecompressionSection = () => {
    const [rapidDecompression, setRapidDecompression] = useState(false);

    const decompressionTypes = [
        {
            type: 'Slow/Gradual',
            time: '> 10 seconds',
            cause: 'Small skin leak, degraded door seal, outflow valve glitch',
            symptoms: 'May go unnoticed initially; insidious euphoria, subtle performance drop, cabin altitude warning',
            action: 'Verify pressurization controllers, don O2 if cabin alt > 10,000 ft, initiate normal descent',
            severity: 'low'
        },
        {
            type: 'Rapid',
            time: '1 to 10 seconds',
            cause: 'Structural window blowout, fuselage tear, large door seal failure',
            symptoms: 'Loud bang, cabin condensation fog, sub-zero temperature drop, flying debris, acute ear/sinus pain',
            action: 'IMMEDIATELY don quick-donning 100% O2 mask (within 5 seconds), establish crew comms, emergency descent',
            severity: 'medium'
        },
        {
            type: 'Explosive',
            time: '< 0.5 to 1 second',
            cause: 'Catastrophic structural separation, cabin decompressing faster than lungs can vent',
            symptoms: 'Violent decompression wave, pulmonary overpressure injury risk, instant dense fog, violent noise',
            action: 'Don O2 mask under positive pressure instantly, maximum rate emergency descent (spoilers out, VMO/MMO)',
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

    // Standard ATPL TUC Table
    const tucTable = [
        { alt: 'FL 180 (18,000 ft)', normal: '30 to 60 min', rapid: '15 to 30 min', comment: 'Noticeable judgment drop, euphoria' },
        { alt: 'FL 200 (20,000 ft)', normal: '10 min', rapid: '5 min', comment: 'Coordination loss, blue fingernails' },
        { alt: 'FL 250 (25,000 ft)', normal: '3 to 5 min', rapid: '1.5 to 2.5 min', comment: 'Critical zone: confused speech, lethargy' },
        { alt: 'FL 300 (30,000 ft)', normal: '1 to 2 min', rapid: '30 to 60 sec', comment: 'Rapid loss of purposeful motor function' },
        { alt: 'FL 350 (35,000 ft)', normal: '30 to 60 sec', rapid: '15 to 30 sec', comment: 'Barely enough time to don mask' },
        { alt: 'FL 400 (40,000 ft)', normal: '15 to 20 sec', rapid: '8 to 10 sec', comment: 'Instantaneous incapacitation window' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-xl font-bold text-white">Decompression Events &amp; TUC</h3>
                <button
                    onClick={() => setRapidDecompression(!rapidDecompression)}
                    className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-all ${
                        rapidDecompression
                            ? 'bg-red-600 text-white shadow-lg shadow-red-900/40 ring-2 ring-red-400'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                >
                    <AlertOctagon size={16} />
                    {rapidDecompression ? 'Rapid Decompression Active (-50% TUC)' : 'Simulate Rapid Decompression'}
                </button>
            </div>

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
                                <span className="text-slate-500 block mb-1">Mandatory Action</span>
                                <span className="text-emerald-400 font-medium">{d.action}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Time of Useful Consciousness Table */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <h4 className="font-bold text-white text-lg flex items-center gap-2">
                            <Clock className="text-amber-400" size={20} />
                            Time of Useful Consciousness (TUC / EPT)
                        </h4>
                        <p className="text-xs text-slate-400">
                            Effective Performance Time available for a pilot to recognize hypoxia and take life-preserving action (don oxygen mask).
                        </p>
                    </div>
                    {rapidDecompression && (
                        <span className="text-xs font-bold font-mono px-3 py-1 bg-red-950 text-red-400 border border-red-500/50 rounded-full animate-pulse">
                            RAPID DECOMPRESSION: TUC CUT BY 50%
                        </span>
                    )}
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {tucTable.map(item => (
                        <div
                            key={item.alt}
                            className={`p-4 rounded-xl border transition-all ${
                                rapidDecompression
                                    ? 'bg-red-950/20 border-red-500/40 shadow-inner'
                                    : 'bg-slate-800 border-slate-700'
                            }`}
                        >
                            <div className="text-slate-400 text-xs font-mono mb-1">{item.alt}</div>
                            <div className={`text-2xl font-black ${rapidDecompression ? 'text-red-400 animate-pulse' : 'text-amber-400'}`}>
                                {rapidDecompression ? item.rapid : item.normal}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-2 border-t border-slate-700/60 pt-2">
                                {item.comment}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Reverse Respiration Notice */}
                <div className="p-4 rounded-lg bg-red-950/40 border border-red-500/30 text-xs text-slate-300 space-y-1">
                    <strong className="text-red-400 block font-bold text-sm">
                        ⚠️ The 50% TUC Reduction &amp; Reverse Respiration:
                    </strong>
                    <p>
                        During a rapid or explosive decompression, ambient pressure drops drastically in seconds. 
                        The partial pressure of oxygen in the alveolar sacs falls below the partial pressure of oxygen in the venous blood. 
                        Instead of oxygen diffusing into the capillaries, the gradient is <strong className="text-white">reversed</strong>: 
                        oxygen is actively sucked <em>out</em> of the blood into the lungs and exhaled, halving the pilot&apos;s remaining consciousness window!
                    </p>
                </div>
            </div>
        </div>
    );
};

// ─── Decompression Sickness & Scuba Diving ──────────────────────────
const DCSSection: React.FC = () => {
    const [diveType, setDiveType] = useState<'non-deco' | 'deco' | 'multi'>('non-deco');
    const [elapsedHours, setElapsedHours] = useState<number>(8);

    const dcsManifestations = [
        {
            title: 'The Bends (Joints & Limbs)',
            incidence: '85% of cases',
            location: 'Shoulders, elbows, knees, ankles',
            description: 'Nitrogen gas bubbles form within joint capsules, ligaments, and tendons.',
            symptoms: 'Deep, dull, boring, throbbing ache that steadily worsens. Often initially relieved by flexing, then excruciating. Not relieved by massage.',
            color: 'text-amber-400',
            border: 'border-amber-500/40 bg-amber-900/10',
        },
        {
            title: 'The Chokes (Pulmonary System)',
            incidence: '~2% of cases (Life Threatening)',
            location: 'Lungs and pulmonary capillary beds',
            description: 'Micro-bubbles lodge in the pulmonary capillaries, obstructing blood flow to alveoli and causing severe ischemia.',
            symptoms: 'Substernal/retrosternal burning chest pain, severe dyspnea (shortness of breath), and dry, hacking, non-productive cough. Can lead to circulatory collapse.',
            color: 'text-red-400',
            border: 'border-red-500/40 bg-red-900/10',
        },
        {
            title: 'The Creeps (Subcutaneous / Skin)',
            incidence: '~10% of cases',
            location: 'Skin nerve endings and subdermal capillaries',
            description: 'Bubbles form in subcutaneous fat and irritate cutaneous sensory nerves.',
            symptoms: 'Pruritus (intense itching), tingling, formication (sensation of tiny insects crawling under the skin), and mottled red/purple marbled rash (Cutis marmorata).',
            color: 'text-purple-400',
            border: 'border-purple-500/40 bg-purple-900/10',
        },
        {
            title: 'The Staggers (Central Nervous System)',
            incidence: '~3% of cases (Medical Emergency)',
            location: 'Brain, vestibular apparatus, spinal cord',
            description: 'Nitrogen gas emboli compromise cerebral blood vessels or spinal cord myelin sheaths.',
            symptoms: 'Loss of coordination (ataxia), dizziness, vertigo, visual disturbances (scotomas, tunnel vision), partial paralysis, speech deficits, and loss of consciousness.',
            color: 'text-rose-400',
            border: 'border-rose-500/40 bg-rose-900/10',
        },
    ];

    // Wait time logic
    const requiredWait = diveType === 'non-deco' ? 12 : 24;
    const isCleared = elapsedHours >= requiredWait;

    return (
        <div className="space-y-6 animate-in fade-in">
            {/* Physics & Henry's Law */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                    <Waves className="text-cyan-400" size={22} />
                    <h3 className="text-xl font-bold text-white">Henry&apos;s Law &amp; Decompression Sickness (DCS)</h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                    Under pressure at sea level (or while scuba diving), atmospheric nitrogen is dissolved in body fats, tissues, 
                    and blood plasma according to <strong>Henry&apos;s Law</strong> (<code className="text-cyan-400 font-mono">C = k · P_gas</code>: the mass of dissolved gas in a given volume of liquid is directly proportional to its partial pressure).
                </p>
                <div className="mt-4 p-4 rounded-lg bg-slate-800 border border-cyan-500/30 text-xs text-slate-300">
                    <span className="text-cyan-300 font-bold block mb-1">Mechanism in Flight:</span>
                    When cabin pressure drops (unpressurized flight above 18,000 ft or rapid decompression), the surrounding ambient pressure 
                    falls below the nitrogen saturation pressure in body tissues. Just like opening a shaken bottle of carbonated champagne, 
                    nitrogen gas rushes out of physical solution to form microscopic bubbles that coalesce into painful and hazardous emboli.
                </div>
            </div>

            {/* 4 Classic Manifestations */}
            <div>
                <h4 className="text-lg font-bold text-white mb-3">The 4 Classic DCS Manifestations</h4>
                <div className="grid md:grid-cols-2 gap-4">
                    {dcsManifestations.map(m => (
                        <div key={m.title} className={`p-5 rounded-xl border ${m.border} space-y-2`}>
                            <div className="flex items-center justify-between">
                                <h5 className={`font-bold text-base ${m.color}`}>{m.title}</h5>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400">
                                    {m.incidence}
                                </span>
                            </div>
                            <div className="text-xs text-slate-400 font-semibold">{m.location}</div>
                            <p className="text-xs text-slate-300">{m.description}</p>
                            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-xs text-slate-200">
                                <strong className="text-white block mb-0.5">Primary Symptoms:</strong>
                                {m.symptoms}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Scuba Diving Wait Times Calculator */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 space-y-6">
                <div>
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                        <Clock className="text-sky-400" size={20} />
                        Scuba Diving &amp; Post-Dive Flight Clearance Rules
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                        Scuba diving subjects the body to multiple atmospheres of pressure, saturating tissues with excess nitrogen. 
                        Flying too soon triggers severe DCS even at standard cabin altitudes (6,000–8,000 ft).
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-3">
                    <button
                        onClick={() => setDiveType('non-deco')}
                        className={`p-4 rounded-xl border text-left transition-all ${
                            diveType === 'non-deco'
                                ? 'bg-sky-950/60 border-sky-400 text-white ring-2 ring-sky-400/40'
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                    >
                        <span className="text-xs font-bold uppercase text-sky-400 block mb-1">Non-Decompression Dive</span>
                        <div className="text-sm font-bold text-white mb-1">No-Deco Limit (Shallow, &lt;10m)</div>
                        <p className="text-[11px] text-slate-400">Single dive requiring no in-water decompression stops during ascent.</p>
                        <span className="text-xs font-bold text-sky-300 mt-2 block font-mono">Mandatory Wait: 12 Hours</span>
                    </button>

                    <button
                        onClick={() => setDiveType('deco')}
                        className={`p-4 rounded-xl border text-left transition-all ${
                            diveType === 'deco'
                                ? 'bg-amber-950/60 border-amber-400 text-white ring-2 ring-amber-400/40'
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                    >
                        <span className="text-xs font-bold uppercase text-amber-400 block mb-1">Decompression Dive</span>
                        <div className="text-sm font-bold text-white mb-1">Required Decompression Stops</div>
                        <p className="text-[11px] text-slate-400">Deep dive requiring mandatory staged safety stops during ascent.</p>
                        <span className="text-xs font-bold text-amber-300 mt-2 block font-mono">Mandatory Wait: 24 Hours</span>
                    </button>

                    <button
                        onClick={() => setDiveType('multi')}
                        className={`p-4 rounded-xl border text-left transition-all ${
                            diveType === 'multi'
                                ? 'bg-red-950/60 border-red-400 text-white ring-2 ring-red-400/40'
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                    >
                        <span className="text-xs font-bold uppercase text-red-400 block mb-1">Consecutive Days / Multiple Dives</span>
                        <div className="text-sm font-bold text-white mb-1">Multiple Dives in 24h Period</div>
                        <p className="text-[11px] text-slate-400">Cumulative nitrogen accumulation across repeated dive cycles.</p>
                        <span className="text-xs font-bold text-red-300 mt-2 block font-mono">Mandatory Wait: 24 Hours</span>
                    </button>
                </div>

                {/* Elapsed Hours Slider */}
                <div className="bg-slate-800 p-4 rounded-lg space-y-3">
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-bold">Time Elapsed Since Surfacing:</span>
                        <span className="text-white font-mono text-base font-bold">{elapsedHours} Hours</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="36"
                        step="1"
                        value={elapsedHours}
                        onChange={e => setElapsedHours(Number(e.target.value))}
                        className="w-full accent-sky-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                        <span>0h (Just Surfaced)</span>
                        <span>12h (No-Deco Limit)</span>
                        <span>24h (Deco Stop Limit)</span>
                        <span>36h (Safe)</span>
                    </div>
                </div>

                {/* Clearance Verdict Card */}
                <div className={`p-4 rounded-xl border-2 flex items-center justify-between transition-all ${
                    isCleared 
                        ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200' 
                        : 'bg-red-950/40 border-red-500 text-red-200 animate-pulse'
                }`}>
                    <div className="flex items-center gap-3">
                        {isCleared ? <CheckCircle2 size={24} className="text-emerald-400" /> : <AlertOctagon size={24} className="text-red-400" />}
                        <div>
                            <div className="text-xs uppercase font-mono font-bold tracking-wider">
                                {isCleared ? 'FLIGHT AUTHORIZED' : 'GROUNDED · HIGH DCS RISK'}
                            </div>
                            <div className="text-sm font-bold">
                                {isCleared 
                                    ? `Cleared to fly! ${elapsedHours}h elapsed meets the ${requiredWait}h requirement.` 
                                    : `DO NOT FLY! Must wait ${requiredWait - elapsedHours} more hours before flying.`}
                            </div>
                        </div>
                    </div>
                    <div className="text-right font-mono text-xs hidden sm:block">
                        <span>Rule: EASA AMC1 MED.B.001</span>
                    </div>
                </div>

                {/* In-Flight Emergency Management */}
                <div className="p-4 rounded-lg bg-sky-950/40 border border-sky-500/30 text-xs text-slate-300 space-y-2">
                    <strong className="text-sky-300 font-bold block">
                        🚑 Emergency DCS Protocol in Flight:
                    </strong>
                    <ol className="list-decimal pl-4 space-y-1">
                        <li><strong>100% Oxygen immediately:</strong> Don mask under positive pressure. Washing out alveolar nitrogen widens the gradient, accelerating nitrogen outgassing from tissues.</li>
                        <li><strong>Initiate immediate descent:</strong> Descend to lowest safe altitude or sea level to recompress bubbles.</li>
                        <li><strong>Keep patient immobilized:</strong> Keep affected joints still; do NOT exercise limbs (avoids further bubble cavitation).</li>
                        <li><strong>Hyperbaric Recompression:</strong> Arrange emergency landing near a facility with a hyperbaric recompression chamber (increases pressure up to 2.8–6 ATA).</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default HPLPressure;
