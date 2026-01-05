import React, { useState } from 'react';
import { Eye, Lightbulb, Plane, AlertTriangle, Target } from 'lucide-react';

const HPLPerception: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'illusions' | 'runway' | 'night'>('illusions');

    return (
        <div className="space-y-6">
            <header className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-violet-500/20 rounded-lg">
                        <Eye className="w-6 h-6 text-violet-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-100">Perception & Visual Illusions</h1>
                </div>
                <p className="text-slate-400">
                    Understanding how visual illusions can mislead pilots, particularly during approach and landing phases.
                </p>
            </header>

            <div className="flex gap-2 bg-slate-800/50 p-1 rounded-lg">
                <TabButton
                    active={activeTab === 'illusions'}
                    onClick={() => setActiveTab('illusions')}
                    icon={Lightbulb}
                    label="Visual Illusions"
                />
                <TabButton
                    active={activeTab === 'runway'}
                    onClick={() => setActiveTab('runway')}
                    icon={Plane}
                    label="Runway Illusions"
                />
                <TabButton
                    active={activeTab === 'night'}
                    onClick={() => setActiveTab('night')}
                    icon={Target}
                    label="Night/Weather"
                />
            </div>

            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 min-h-[400px]">
                {activeTab === 'illusions' && <VisualIllusionsSection />}
                {activeTab === 'runway' && <RunwayIllusionsSection />}
                {activeTab === 'night' && <NightWeatherSection />}
            </div>
        </div>
    );
};

const TabButton = ({ active, onClick, icon: Icon, label }: any) => (
    <button
        onClick={onClick}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md transition-all font-medium ${active
            ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/20'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
    >
        <Icon size={18} />
        {label}
    </button>
);

const VisualIllusionsSection = () => {
    const illusions = [
        {
            name: 'Autokinesis',
            description: 'A stationary light appears to move when stared at in darkness',
            cause: 'Lack of visual reference points, eye muscle fatigue',
            example: 'Staring at a single star or distant light at night',
            danger: 'May mistake stationary light for aircraft, attempt to follow',
            prevention: 'Use multiple reference points, scan regularly'
        },
        {
            name: 'False Horizon',
            description: 'Sloping cloud banks or terrain create illusion of tilted horizon',
            cause: 'Brain uses available visual cues as "level" reference',
            example: 'Flying along sloping coastline or cloud layer',
            danger: 'Pilot banks aircraft to align with false reference',
            prevention: 'Trust instruments, especially AI/ADI'
        },
        {
            name: 'Relative Motion',
            description: 'Unable to distinguish if you or another object is moving',
            cause: 'No fixed reference point available',
            example: 'Two aircraft on parallel headings, one appears stationary',
            danger: 'Misjudge closing rate, collision risk',
            prevention: 'Use ATC, TCAS, multiple visual checks'
        },
        {
            name: 'Size Constancy',
            description: 'Objects appear smaller when brain expects them to be further away',
            cause: 'Brain interprets size based on expected distance',
            example: 'Large aircraft at distance appears closer than it is',
            danger: 'Misjudge traffic separation',
            prevention: 'Use radar, verify with ATC'
        },
    ];

    const [selected, setSelected] = useState(0);

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white text-center">Common Visual Illusions</h3>

            <div className="flex flex-wrap justify-center gap-2">
                {illusions.map((ill, i) => (
                    <button
                        key={i}
                        onClick={() => setSelected(i)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${selected === i
                                ? 'bg-violet-600 text-white'
                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            }`}
                    >
                        {ill.name}
                    </button>
                ))}
            </div>

            <div className="bg-violet-900/20 border border-violet-500/30 rounded-xl p-6">
                <h4 className="text-xl font-bold text-white mb-4">{illusions[selected].name}</h4>
                <p className="text-slate-300 mb-6">{illusions[selected].description}</p>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <span className="text-violet-400 font-bold text-sm">CAUSE</span>
                            <p className="text-slate-300 text-sm mt-1">{illusions[selected].cause}</p>
                        </div>
                        <div>
                            <span className="text-amber-400 font-bold text-sm">EXAMPLE</span>
                            <p className="text-slate-300 text-sm mt-1">{illusions[selected].example}</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <span className="text-red-400 font-bold text-sm">DANGER</span>
                            <p className="text-slate-300 text-sm mt-1">{illusions[selected].danger}</p>
                        </div>
                        <div>
                            <span className="text-emerald-400 font-bold text-sm">PREVENTION</span>
                            <p className="text-slate-300 text-sm mt-1">{illusions[selected].prevention}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const RunwayIllusionsSection = () => {
    const [runwayWidth, setRunwayWidth] = useState(45); // meters
    const [runwaySlope, setRunwaySlope] = useState(0); // degrees

    // Calculate perceived position based on runway characteristics
    const normalWidth = 45;
    const widthEffect = runwayWidth > normalWidth ? 'HIGH' : runwayWidth < normalWidth ? 'LOW' : 'CORRECT';
    const slopeEffect = runwaySlope > 0 ? 'HIGH' : runwaySlope < 0 ? 'LOW' : 'CORRECT';

    const illusions = [
        {
            condition: 'Narrow Runway',
            perception: 'Higher than actual',
            reaction: 'Fly lower approach → CFIT risk',
            icon: '📏',
            color: 'red'
        },
        {
            condition: 'Wide Runway',
            perception: 'Lower than actual',
            reaction: 'Fly higher approach → long landing',
            icon: '📐',
            color: 'amber'
        },
        {
            condition: 'Upsloping Runway',
            perception: 'Higher than actual',
            reaction: 'Fly lower approach → CFIT risk',
            icon: '📈',
            color: 'red'
        },
        {
            condition: 'Downsloping Runway',
            perception: 'Lower than actual',
            reaction: 'Fly higher approach → long landing',
            icon: '📉',
            color: 'amber'
        },
        {
            condition: 'Rain on Windscreen',
            perception: 'Higher than actual',
            reaction: 'Fly lower approach → CFIT risk',
            icon: '🌧️',
            color: 'red'
        },
        {
            condition: 'Featureless Terrain',
            perception: 'Higher than actual (black hole)',
            reaction: 'Fly lower approach → CFIT risk',
            icon: '🌑',
            color: 'red'
        },
    ];

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white text-center">Runway Illusions on Approach</h3>

            {/* Interactive Simulator */}
            <div className="bg-slate-900 p-6 rounded-xl">
                <h4 className="font-bold text-white mb-4">Approach Perception Simulator</h4>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-slate-400 block mb-2">
                                Runway Width: {runwayWidth}m (Standard: 45m)
                            </label>
                            <input
                                type="range"
                                min="30"
                                max="60"
                                value={runwayWidth}
                                onChange={e => setRunwayWidth(Number(e.target.value))}
                                className="w-full accent-violet-500"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-slate-400 block mb-2">
                                Runway Slope: {runwaySlope > 0 ? '+' : ''}{runwaySlope}° (0° = Flat)
                            </label>
                            <input
                                type="range"
                                min="-3"
                                max="3"
                                value={runwaySlope}
                                onChange={e => setRunwaySlope(Number(e.target.value))}
                                className="w-full accent-violet-500"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-6xl mb-4">✈️</div>
                            <div className={`text-lg font-bold ${widthEffect === 'LOW' || slopeEffect === 'LOW' ? 'text-red-400' :
                                    widthEffect === 'HIGH' || slopeEffect === 'HIGH' ? 'text-amber-400' :
                                        'text-emerald-400'
                                }`}>
                                Perceived: {widthEffect === 'LOW' || slopeEffect === 'LOW' ? 'TOO HIGH' :
                                    widthEffect === 'HIGH' || slopeEffect === 'HIGH' ? 'TOO LOW' :
                                        'CORRECT HEIGHT'}
                            </div>
                            <p className="text-sm text-slate-400 mt-2">
                                {widthEffect === 'LOW' || slopeEffect === 'LOW'
                                    ? '⚠️ Risk: Flying a LOW approach'
                                    : widthEffect === 'HIGH' || slopeEffect === 'HIGH'
                                        ? '⚠️ Risk: Flying a HIGH approach'
                                        : '✓ Normal approach path'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Reference Cards */}
            <div className="grid md:grid-cols-3 gap-4">
                {illusions.map((ill, i) => (
                    <div
                        key={i}
                        className={`p-4 rounded-lg border ${ill.color === 'red' ? 'border-red-500/30 bg-red-900/10' : 'border-amber-500/30 bg-amber-900/10'
                            }`}
                    >
                        <span className="text-2xl">{ill.icon}</span>
                        <h5 className="font-bold text-white mt-2">{ill.condition}</h5>
                        <p className="text-sm text-slate-400 mt-1">Perception: {ill.perception}</p>
                        <p className={`text-sm font-medium mt-1 ${ill.color === 'red' ? 'text-red-400' : 'text-amber-400'}`}>
                            {ill.reaction}
                        </p>
                    </div>
                ))}
            </div>

            <div className="bg-emerald-900/20 border border-emerald-500/30 p-4 rounded-lg">
                <h4 className="font-bold text-emerald-300 mb-2">Countermeasures</h4>
                <ul className="grid md:grid-cols-2 gap-2 text-sm text-slate-300">
                    <li>✓ Use PAPI/VASI for visual guidance</li>
                    <li>✓ Cross-check with ILS glideslope if available</li>
                    <li>✓ Know the runway dimensions in advance</li>
                    <li>✓ Brief expected visual picture</li>
                    <li>✓ Be extra vigilant at unfamiliar airports</li>
                    <li>✓ Use published approach procedures</li>
                </ul>
            </div>
        </div>
    );
};

const NightWeatherSection = () => {
    const hazards = [
        {
            name: 'Black Hole Approach',
            desc: 'Approach over water or unlit terrain to a lit runway',
            risk: 'No ground references → Fly dangerously low → CFIT',
            mitigation: 'Use ILS/PAPI, maintain published altitudes until runway in sight',
            severity: 'critical'
        },
        {
            name: 'Bright Runway Lights',
            desc: 'Runway lights appear closer than they are in clear conditions',
            risk: 'Initiate descent too early, undershoot',
            mitigation: 'Cross-check altitude, use distance information',
            severity: 'high'
        },
        {
            name: 'Dim/Obscured Lights',
            desc: 'Fog, rain, or low intensity makes runway appear further',
            risk: 'Delay descent, overshoot or unstable approach',
            mitigation: 'Use approach aids, set minimums appropriately',
            severity: 'high'
        },
        {
            name: 'Sloping Terrain Before Runway',
            desc: 'Rising terrain approaching runway threshold',
            risk: 'Combined with night = extreme CFIT risk',
            mitigation: 'Know the terrain, use EGPWS, maintain profile',
            severity: 'critical'
        },
    ];

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white text-center">Night & Weather Illusions</h3>

            <div className="bg-slate-900 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="text-red-400" />
                    <h4 className="font-bold text-white">CFIT is the #1 cause of fatal accidents in general aviation</h4>
                </div>
                <p className="text-slate-300 text-sm">
                    Controlled Flight Into Terrain often results from visual illusions during night or instrument
                    meteorological conditions. Most CFIT accidents occur during approach and landing phases.
                </p>
            </div>

            <div className="space-y-4">
                {hazards.map((h, i) => (
                    <div
                        key={i}
                        className={`rounded-xl p-5 border ${h.severity === 'critical'
                                ? 'border-red-500/50 bg-red-900/20'
                                : 'border-amber-500/50 bg-amber-900/20'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-bold text-white text-lg">{h.name}</h4>
                            <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase ${h.severity === 'critical'
                                    ? 'bg-red-500/30 text-red-300'
                                    : 'bg-amber-500/30 text-amber-300'
                                }`}>
                                {h.severity}
                            </span>
                        </div>
                        <p className="text-slate-400 text-sm mb-4">{h.desc}</p>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <span className="text-red-400 font-bold text-xs">RISK</span>
                                <p className="text-slate-300 text-sm mt-1">{h.risk}</p>
                            </div>
                            <div>
                                <span className="text-emerald-400 font-bold text-xs">MITIGATION</span>
                                <p className="text-slate-300 text-sm mt-1">{h.mitigation}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-violet-900/20 border border-violet-500/30 p-4 rounded-lg">
                <h4 className="font-bold text-violet-300 mb-2">Night Flying Best Practices</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-300">
                    <ul className="space-y-1">
                        <li>• Allow 30 min for dark adaptation</li>
                        <li>• Use red cockpit lighting</li>
                        <li>• Carry a red flashlight</li>
                        <li>• Avoid bright lights before flight</li>
                    </ul>
                    <ul className="space-y-1">
                        <li>• Plan approaches over lit areas when possible</li>
                        <li>• Use all available approach aids</li>
                        <li>• Set personal minimums higher at night</li>
                        <li>• Scan instruments frequently</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default HPLPerception;
