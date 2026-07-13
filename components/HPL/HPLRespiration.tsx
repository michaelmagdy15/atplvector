import React, { useState } from 'react';
import {
    Wind, Activity, Brain, Mountain, AlertTriangle,
    ChevronDown, ChevronUp, Heart, Zap,
    ArrowDown, ArrowUp, Info
} from 'lucide-react';

// ─── Data ────────────────────────────────────────────────────────

const ALTITUDE_DATA: {
    maxAlt: number;
    spo2: number;
    tuc: string;
    zone: string;
    zoneColor: string;
    symptoms: string[];
}[] = [
    { maxAlt: 0,     spo2: 99,  tuc: 'Unlimited',      zone: 'Safe Zone',              zoneColor: '#10b981', symptoms: ['Normal physiological function'] },
    { maxAlt: 5000,  spo2: 97,  tuc: 'Unlimited',      zone: 'Safe Zone',              zoneColor: '#10b981', symptoms: ['Slight decrease in night vision above 4,000 ft'] },
    { maxAlt: 10000, spo2: 93,  tuc: 'Unlimited',      zone: 'Indifferent Zone',       zoneColor: '#a3e635', symptoms: ['Night vision impaired', 'Slight performance decrease'] },
    { maxAlt: 15000, spo2: 85,  tuc: '30 min+',        zone: 'Disturbance Zone',       zoneColor: '#facc15', symptoms: ['Drowsiness', 'Poor judgment', 'Impaired coordination', 'Headache'] },
    { maxAlt: 18000, spo2: 78,  tuc: '20-30 min',      zone: 'Disturbance Zone',       zoneColor: '#f59e0b', symptoms: ['Euphoria', 'Belligerence', 'Tunnel vision', 'Cyanosis'] },
    { maxAlt: 22000, spo2: 70,  tuc: '5-10 min',       zone: 'Critical Zone',          zoneColor: '#f97316', symptoms: ['Severe impairment', 'Loss of muscle control', 'Memory loss'] },
    { maxAlt: 25000, spo2: 60,  tuc: '3-5 min',        zone: 'Critical Zone',          zoneColor: '#ef4444', symptoms: ['Convulsions', 'Unconsciousness imminent', 'Circulatory failure'] },
    { maxAlt: 30000, spo2: 50,  tuc: '1-2 min',        zone: 'Critical Zone',          zoneColor: '#dc2626', symptoms: ['Rapid unconsciousness', 'Seizures', 'Death without O2'] },
    { maxAlt: 35000, spo2: 35,  tuc: '30-60 sec',      zone: 'Lethal Zone',            zoneColor: '#991b1b', symptoms: ['Near-instant incapacitation', 'Loss of consciousness'] },
    { maxAlt: 40000, spo2: 20,  tuc: '15-20 sec',      zone: 'Lethal Zone',            zoneColor: '#7f1d1d', symptoms: ['Explosive decompression risk', 'Ebullism above 63,000 ft'] },
];

const HYPERVENT_CARDS: {
    id: string;
    title: string;
    icon: React.ElementType;
    color: string;
    borderColor: string;
    items: string[];
}[] = [
    {
        id: 'causes',
        title: 'Causes',
        icon: Zap,
        color: 'text-amber-400',
        borderColor: 'border-amber-500/30 bg-amber-900/10',
        items: [
            'Anxiety, stress, or fear',
            'Hypoxia (body tries to compensate by breathing faster)',
            'Pain or emotional distress',
            'Excessive heat in the cockpit',
            'Motion sickness or spatial disorientation',
            'Attempting to breathe too fast on a demand regulator',
        ],
    },
    {
        id: 'effects',
        title: 'Symptoms & Effects',
        icon: AlertTriangle,
        color: 'text-rose-400',
        borderColor: 'border-rose-500/30 bg-rose-900/10',
        items: [
            'Dizziness and lightheadedness',
            'Tingling / numbness in fingers, toes, and lips (paraesthesia)',
            'Muscle spasms and carpopedal spasm (claw-like hands)',
            'Visual disturbances — tunnel vision, blurred vision',
            'Hot / cold sensations',
            'Anxiety amplification — creates a positive feedback loop',
            'Loss of consciousness in severe cases',
            'Symptoms overlap significantly with hypoxia — difficult to distinguish!',
        ],
    },
    {
        id: 'recovery',
        title: 'Recovery Steps',
        icon: Heart,
        color: 'text-emerald-400',
        borderColor: 'border-emerald-500/30 bg-emerald-900/10',
        items: [
            '1. Consciously slow your breathing rate (breathe into a bag if available)',
            '2. Talk or sing aloud — this regulates breathing rhythm',
            '3. Check oxygen equipment is set correctly',
            '4. Rule out hypoxia first if above 10,000 ft (use supplemental O2)',
            '5. Descend if symptoms persist and oxygen is not available',
            '6. Reassure passenger/crew — calm environment aids recovery',
        ],
    },
];

// ─── Helper: Interpolate altitude data ───────────────────────────

function getAltitudeInfo(altitude: number) {
    for (let i = ALTITUDE_DATA.length - 1; i >= 0; i--) {
        if (altitude >= ALTITUDE_DATA[i].maxAlt) {
            const lower = ALTITUDE_DATA[i];
            const upper = ALTITUDE_DATA[Math.min(i + 1, ALTITUDE_DATA.length - 1)];
            if (lower === upper) return lower;
            const t = (altitude - lower.maxAlt) / (upper.maxAlt - lower.maxAlt);
            return {
                ...upper,
                spo2: Math.round(lower.spo2 + (upper.spo2 - lower.spo2) * t),
                tuc: altitude >= upper.maxAlt ? upper.tuc : lower.tuc,
                zone: t > 0.5 ? upper.zone : lower.zone,
                zoneColor: t > 0.5 ? upper.zoneColor : lower.zoneColor,
                symptoms: t > 0.5 ? upper.symptoms : lower.symptoms,
            };
        }
    }
    return ALTITUDE_DATA[0];
}

function sliderGradientColor(pct: number) {
    if (pct < 0.25) return `hsl(${142 - pct * 200}, 70%, 45%)`;
    if (pct < 0.5) return `hsl(${90 - (pct - 0.25) * 200}, 80%, 50%)`;
    if (pct < 0.75) return `hsl(${40 - (pct - 0.5) * 120}, 85%, 50%)`;
    return `hsl(${10 - (pct - 0.75) * 40}, 80%, 45%)`;
}

// ─── Main Component ──────────────────────────────────────────────

const HPLRespiration: React.FC = () => {
    const [activeTab, setActiveTab] = useState<
        'altitude' | 'breathing' | 'hyperventilation' | 'exchange' | 'volumes' | 'control'
    >('altitude');

    return (
        <div className="space-y-6">
            {/* Header */}
            <header className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-teal-500/20 rounded-lg">
                        <Wind className="w-6 h-6 text-teal-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-100">Respiration &amp; Gas Exchange</h1>
                </div>
                <p className="text-slate-400">
                    Understanding lung volumes, alveolar gas exchange, and the control of breathing is vital for understanding hypoxia mechanisms.
                </p>
            </header>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 bg-slate-900 p-1 rounded-lg">
                <TabButton active={activeTab === 'altitude'} onClick={() => setActiveTab('altitude')} icon={Mountain} label="Altitude Hypoxia" />
                <TabButton active={activeTab === 'breathing'} onClick={() => setActiveTab('breathing')} icon={Wind} label="Breathing Mechanics" />
                <TabButton active={activeTab === 'hyperventilation'} onClick={() => setActiveTab('hyperventilation')} icon={AlertTriangle} label="Hyperventilation" />
                <TabButton active={activeTab === 'exchange'} onClick={() => setActiveTab('exchange')} icon={Wind} label="Gas Exchange" />
                <TabButton active={activeTab === 'volumes'} onClick={() => setActiveTab('volumes')} icon={Activity} label="Lung Volumes" />
                <TabButton active={activeTab === 'control'} onClick={() => setActiveTab('control')} icon={Brain} label="Control" />
            </div>

            {/* Panels */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 min-h-[400px]">
                {activeTab === 'altitude' && <AltitudeHypoxiaSlider />}
                {activeTab === 'breathing' && <BreathingMechanics />}
                {activeTab === 'hyperventilation' && <HyperventilationSection />}
                {activeTab === 'exchange' && <GasExchangeDiagram />}
                {activeTab === 'volumes' && <LungVolumesSim />}
                {activeTab === 'control' && <RespirationControl />}
            </div>
        </div>
    );
};

// ─── Shared Tab Button ───────────────────────────────────────────

const TabButton = ({ active, onClick, icon: Icon, label }: {
    active: boolean; onClick: () => void; icon: React.ElementType; label: string;
}) => (
    <button
        onClick={onClick}
        className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-2.5 rounded-md transition-all duration-300 font-medium text-sm ${
            active
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
        }`}
    >
        <Icon size={16} />
        {label}
    </button>
);

// ═══════════════════════════════════════════════════════════════════
// 1. ALTITUDE HYPOXIA SLIDER
// ═══════════════════════════════════════════════════════════════════

const AltitudeHypoxiaSlider = () => {
    const [altitude, setAltitude] = useState(0);
    const info = getAltitudeInfo(altitude);
    const pct = altitude / 40000;

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Mountain className="text-sky-400" size={22} />
                Altitude &amp; Hypoxia Effects
            </h3>

            {/* Color-gradient altitude bar */}
            <div className="relative">
                <div
                    className="h-3 rounded-full mb-2"
                    style={{
                        background: 'linear-gradient(to right, #10b981 0%, #a3e635 20%, #facc15 35%, #f59e0b 45%, #f97316 55%, #ef4444 70%, #991b1b 100%)',
                    }}
                />
                <input
                    type="range"
                    min={0}
                    max={40000}
                    step={500}
                    value={altitude}
                    onChange={(e) => setAltitude(Number(e.target.value))}
                    className="w-full accent-sky-400 cursor-pointer"
                    aria-label="Altitude slider"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>Sea Level</span>
                    <span>10,000 ft</span>
                    <span>20,000 ft</span>
                    <span>30,000 ft</span>
                    <span>40,000 ft</span>
                </div>
            </div>

            {/* Info display */}
            <div className="grid md:grid-cols-3 gap-4">
                {/* Altitude & Zone */}
                <div
                    className="rounded-xl p-5 border border-slate-700 transition-all duration-500"
                    style={{ backgroundColor: info.zoneColor + '18', borderColor: info.zoneColor + '55' }}
                >
                    <div className="text-sm text-slate-400 mb-1">Current Altitude</div>
                    <div className="text-3xl font-bold text-white">{altitude.toLocaleString()} ft</div>
                    <div className="mt-2 text-sm font-semibold" style={{ color: info.zoneColor }}>
                        {info.zone}
                    </div>
                </div>

                {/* SpO2 */}
                <div className="rounded-xl p-5 border border-slate-700 bg-slate-900/60">
                    <div className="text-sm text-slate-400 mb-1">SpO2 (Oxygen Saturation)</div>
                    <div className="flex items-end gap-2">
                        <span
                            className="text-4xl font-bold transition-all duration-500"
                            style={{ color: info.spo2 > 90 ? '#10b981' : info.spo2 > 75 ? '#facc15' : info.spo2 > 55 ? '#f97316' : '#ef4444' }}
                        >
                            {info.spo2}%
                        </span>
                        <span className="text-slate-500 text-sm mb-1">normal &gt;95%</span>
                    </div>
                    {/* SpO2 bar */}
                    <div className="w-full bg-slate-700 rounded-full h-2.5 mt-3">
                        <div
                            className="h-2.5 rounded-full transition-all duration-500"
                            style={{
                                width: `${info.spo2}%`,
                                backgroundColor: info.spo2 > 90 ? '#10b981' : info.spo2 > 75 ? '#facc15' : info.spo2 > 55 ? '#f97316' : '#ef4444',
                            }}
                        />
                    </div>
                </div>

                {/* TUC */}
                <div className="rounded-xl p-5 border border-slate-700 bg-slate-900/60">
                    <div className="text-sm text-slate-400 mb-1">Time of Useful Consciousness</div>
                    <div className="text-3xl font-bold text-sky-400 transition-all duration-500">
                        {info.tuc}
                    </div>
                    <div className="text-xs text-slate-500 mt-2">
                        TUC = time after O₂ loss to make life-saving decisions
                    </div>
                </div>
            </div>

            {/* Symptoms */}
            <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700">
                <h4 className="text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider">
                    Symptoms at {altitude.toLocaleString()} ft
                </h4>
                <div className="flex flex-wrap gap-2">
                    {info.symptoms.map((s, i) => (
                        <span
                            key={i}
                            className="px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-500 border"
                            style={{
                                color: info.zoneColor,
                                borderColor: info.zoneColor + '44',
                                backgroundColor: info.zoneColor + '15',
                            }}
                        >
                            {s}
                        </span>
                    ))}
                </div>
            </div>

            {/* Educational note */}
            <div className="bg-sky-900/20 border border-sky-500/30 rounded-lg p-4 text-sm text-slate-300 flex gap-3">
                <Info className="text-sky-400 flex-shrink-0 mt-0.5" size={18} />
                <div>
                    <strong className="text-sky-300">ATPL Key Fact:</strong> Supplemental oxygen is required for
                    all crew above <strong className="text-white">10,000 ft cabin altitude</strong> for prolonged
                    periods, and <strong className="text-white">mandatory above FL130 (13,000 ft)</strong>.
                    Rapid decompression at FL350 gives only <strong className="text-white">30-60 seconds</strong> of
                    useful consciousness — you must don your oxygen mask immediately.
                </div>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════
// 2. BREATHING MECHANICS VISUALIZER
// ═══════════════════════════════════════════════════════════════════

const BreathingMechanics = () => {
    const [phase, setPhase] = useState<'inhale' | 'exhale'>('inhale');
    const isInhale = phase === 'inhale';

    const lungScale = isInhale ? 1.15 : 0.88;
    const diaphragmY = isInhale ? 260 : 220;
    const pO2 = isInhale ? 159 : 116;
    const pCO2 = isInhale ? 0.3 : 32;
    const pN2 = isInhale ? 597 : 565;
    const pH2O = isInhale ? 3.7 : 47;

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Wind className="text-teal-400" size={22} />
                Breathing Mechanics Visualizer
            </h3>

            {/* Toggle */}
            <div className="flex gap-2 bg-slate-900 p-1 rounded-lg w-fit mx-auto">
                <button
                    onClick={() => setPhase('inhale')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-md font-medium transition-all duration-300 ${
                        isInhale ? 'bg-sky-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                    }`}
                >
                    <ArrowDown size={16} /> Inhale
                </button>
                <button
                    onClick={() => setPhase('exhale')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-md font-medium transition-all duration-300 ${
                        !isInhale ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                    }`}
                >
                    <ArrowUp size={16} /> Exhale
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
                {/* SVG lungs */}
                <div className="bg-slate-900/60 rounded-xl p-6 border border-slate-700 flex justify-center">
                    <svg viewBox="0 0 300 320" width="100%" className="max-w-[340px]">
                        {/* Trachea */}
                        <rect x="140" y="10" width="20" height="60" rx="6" fill="#64748b" />
                        {/* Left bronchus */}
                        <line x1="150" y1="70" x2="100" y2="110" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
                        {/* Right bronchus */}
                        <line x1="150" y1="70" x2="200" y2="110" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />

                        {/* Left lung */}
                        <g style={{ transform: `scale(${lungScale})`, transformOrigin: '90px 170px', transition: 'transform 0.7s ease-in-out' }}>
                            <ellipse cx="90" cy="170" rx="60" ry="80"
                                fill={isInhale ? 'rgba(56,189,248,0.2)' : 'rgba(251,146,60,0.15)'}
                                stroke={isInhale ? '#38bdf8' : '#fb923c'}
                                strokeWidth="2"
                                style={{ transition: 'fill 0.7s, stroke 0.7s' }}
                            />
                            {/* Alveoli dots */}
                            <circle cx="70" cy="150" r="8" fill={isInhale ? 'rgba(56,189,248,0.3)' : 'rgba(251,146,60,0.2)'} style={{ transition: 'fill 0.7s' }} />
                            <circle cx="100" cy="180" r="10" fill={isInhale ? 'rgba(56,189,248,0.3)' : 'rgba(251,146,60,0.2)'} style={{ transition: 'fill 0.7s' }} />
                            <circle cx="80" cy="200" r="7" fill={isInhale ? 'rgba(56,189,248,0.3)' : 'rgba(251,146,60,0.2)'} style={{ transition: 'fill 0.7s' }} />
                        </g>

                        {/* Right lung */}
                        <g style={{ transform: `scale(${lungScale})`, transformOrigin: '210px 170px', transition: 'transform 0.7s ease-in-out' }}>
                            <ellipse cx="210" cy="170" rx="60" ry="80"
                                fill={isInhale ? 'rgba(56,189,248,0.2)' : 'rgba(251,146,60,0.15)'}
                                stroke={isInhale ? '#38bdf8' : '#fb923c'}
                                strokeWidth="2"
                                style={{ transition: 'fill 0.7s, stroke 0.7s' }}
                            />
                            <circle cx="190" cy="150" r="9" fill={isInhale ? 'rgba(56,189,248,0.3)' : 'rgba(251,146,60,0.2)'} style={{ transition: 'fill 0.7s' }} />
                            <circle cx="220" cy="185" r="11" fill={isInhale ? 'rgba(56,189,248,0.3)' : 'rgba(251,146,60,0.2)'} style={{ transition: 'fill 0.7s' }} />
                            <circle cx="230" cy="155" r="6" fill={isInhale ? 'rgba(56,189,248,0.3)' : 'rgba(251,146,60,0.2)'} style={{ transition: 'fill 0.7s' }} />
                        </g>

                        {/* Diaphragm */}
                        <path
                            d={`M 20 ${diaphragmY} Q 150 ${diaphragmY + (isInhale ? 40 : -10)} 280 ${diaphragmY}`}
                            fill="none"
                            stroke="#f59e0b"
                            strokeWidth="3"
                            strokeDasharray="8 4"
                            style={{ transition: 'd 0.7s ease-in-out' }}
                        />
                        <text x="150" y={diaphragmY + (isInhale ? 55 : 8)} textAnchor="middle" fill="#f59e0b" fontSize="11" fontWeight="bold">
                            Diaphragm {isInhale ? '(Contracts ↓)' : '(Relaxes ↑)'}
                        </text>

                        {/* Air direction arrows */}
                        <text x="150" y="8" textAnchor="middle" fill={isInhale ? '#38bdf8' : '#fb923c'} fontSize="16" style={{ transition: 'fill 0.5s' }}>
                            {isInhale ? '↓ Air In' : '↑ Air Out'}
                        </text>
                    </svg>
                </div>

                {/* Partial pressures & mechanics info */}
                <div className="space-y-4">
                    <div className="bg-slate-900/60 rounded-xl p-5 border border-slate-700">
                        <h4 className="font-bold text-white mb-3">
                            {isInhale ? 'Inspired Air' : 'Expired Air'} — Partial Pressures (mmHg)
                        </h4>
                        <div className="space-y-2">
                            <PressureBar label="PO₂ (Oxygen)" value={pO2} max={160} color="#38bdf8" />
                            <PressureBar label="PCO₂ (Carbon Dioxide)" value={pCO2} max={50} color="#f97316" />
                            <PressureBar label="PN₂ (Nitrogen)" value={pN2} max={600} color="#a78bfa" />
                            <PressureBar label="PH₂O (Water Vapor)" value={pH2O} max={50} color="#2dd4bf" />
                        </div>
                    </div>

                    <div className="bg-slate-900/50 rounded-lg p-4 text-sm text-slate-300 border border-slate-700">
                        <h4 className="font-bold text-teal-400 mb-2">Mechanics of {isInhale ? 'Inhalation' : 'Exhalation'}</h4>
                        {isInhale ? (
                            <ul className="space-y-1.5">
                                <li>• <strong>Diaphragm contracts</strong> and moves downward</li>
                                <li>• External intercostal muscles lift the rib cage</li>
                                <li>• Thoracic cavity volume <strong>increases</strong></li>
                                <li>• Intrapulmonary pressure <strong>drops below</strong> atmospheric</li>
                                <li>• Air flows <strong>into</strong> the lungs (Boyle's Law)</li>
                                <li>• This is an <strong>active</strong> process requiring muscle energy</li>
                            </ul>
                        ) : (
                            <ul className="space-y-1.5">
                                <li>• <strong>Diaphragm relaxes</strong> and moves upward</li>
                                <li>• Internal intercostal muscles depress the rib cage</li>
                                <li>• Thoracic cavity volume <strong>decreases</strong></li>
                                <li>• Intrapulmonary pressure <strong>rises above</strong> atmospheric</li>
                                <li>• Air flows <strong>out</strong> of the lungs</li>
                                <li>• Normal exhalation is <strong>passive</strong> (elastic recoil)</li>
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const PressureBar = ({ label, value, max, color }: { label: string; value: number; max: number; color: string }) => (
    <div>
        <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">{label}</span>
            <span className="font-mono font-bold" style={{ color }}>{value} mmHg</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
            <div
                className="h-2 rounded-full transition-all duration-700"
                style={{ width: `${Math.min((value / max) * 100, 100)}%`, backgroundColor: color }}
            />
        </div>
    </div>
);

// ═══════════════════════════════════════════════════════════════════
// 3. HYPERVENTILATION INTERACTIVE SECTION
// ═══════════════════════════════════════════════════════════════════

const HyperventilationSection = () => {
    const [expandedCard, setExpandedCard] = useState<string | null>(null);

    const toggle = (id: string) => setExpandedCard(expandedCard === id ? null : id);

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <AlertTriangle className="text-amber-400" size={22} />
                Hyperventilation
            </h3>

            <p className="text-slate-300">
                Hyperventilation is <strong className="text-white">an increase in ventilation beyond what is
                needed</strong> to maintain normal blood gas levels. It lowers CO₂ (hypocapnia), causing respiratory
                alkalosis. This is a critical topic for pilots because it mimics hypoxia and can lead to
                incapacitation.
            </p>

            {/* Flow diagram (preserved from original) */}
            <div className="bg-slate-900 p-6 rounded-xl text-center border border-slate-700">
                <h4 className="text-white font-bold mb-4">Hyperventilation Positive Feedback Loop</h4>
                <div className="flex flex-wrap justify-center items-center gap-3 text-sm font-mono">
                    <div className="bg-amber-500/10 px-4 py-2.5 rounded-lg border border-amber-500/20 text-amber-400">
                        Anxiety / Hypoxia
                    </div>
                    <span className="text-slate-500 text-xl">→</span>
                    <div className="bg-amber-500/10 px-4 py-2.5 rounded-lg border border-amber-500/20 text-amber-400">
                        Increased Breathing Rate
                    </div>
                    <span className="text-slate-500 text-xl">→</span>
                    <div className="bg-rose-500/10 px-4 py-2.5 rounded-lg border border-rose-500/20 text-rose-400">
                        Low CO₂ (Hypocapnia)
                    </div>
                    <span className="text-slate-500 text-xl">→</span>
                    <div className="bg-rose-500/10 px-4 py-2.5 rounded-lg border border-rose-500/20 text-rose-400">
                        Alkalosis &amp; Symptoms
                    </div>
                    <span className="text-slate-500 text-xl">→</span>
                    <div className="bg-amber-500/10 px-4 py-2.5 rounded-lg border border-amber-500/20 text-amber-400">
                        More Anxiety ↻
                    </div>
                </div>
            </div>

            {/* Click-to-reveal cards */}
            <div className="grid md:grid-cols-3 gap-4">
                {HYPERVENT_CARDS.map((card) => {
                    const isOpen = expandedCard === card.id;
                    const Icon = card.icon;
                    return (
                        <div
                            key={card.id}
                            className={`rounded-xl border p-5 cursor-pointer transition-all duration-500 ${card.borderColor} ${
                                isOpen ? 'shadow-xl' : 'hover:shadow-lg'
                            }`}
                            onClick={() => toggle(card.id)}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Icon size={20} className={card.color} />
                                    <h4 className={`font-bold ${card.color}`}>{card.title}</h4>
                                </div>
                                {isOpen ? (
                                    <ChevronUp size={18} className="text-slate-400" />
                                ) : (
                                    <ChevronDown size={18} className="text-slate-400" />
                                )}
                            </div>
                            <p className="text-xs text-slate-500 mb-2">
                                {isOpen ? 'Click to collapse' : 'Click to reveal'}
                            </p>
                            <div
                                className={`overflow-hidden transition-all duration-500 ${
                                    isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                                }`}
                            >
                                <ul className="space-y-2 text-sm text-slate-300 pt-2 border-t border-slate-700/50">
                                    {card.items.map((item, i) => (
                                        <li key={i} className="flex gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: card.color.includes('amber') ? '#fbbf24' : card.color.includes('rose') ? '#fb7185' : '#34d399' }} />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Key distinction note */}
            <div className="bg-amber-900/15 border border-amber-500/30 rounded-lg p-4 text-sm text-slate-300 flex gap-3">
                <AlertTriangle className="text-amber-400 flex-shrink-0 mt-0.5" size={18} />
                <div>
                    <strong className="text-amber-300">Critical ATPL Distinction:</strong> Hyperventilation and
                    Hypoxia share many overlapping symptoms (dizziness, tingling, visual issues). If a pilot
                    experiences symptoms above 10,000 ft, they must <strong className="text-white">assume hypoxia
                    first</strong> and use supplemental O₂. If symptoms persist after O₂ use, hyperventilation is
                    likely the cause.
                </div>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════
// 4. GAS EXCHANGE DIAGRAM (SVG)
// ═══════════════════════════════════════════════════════════════════

const GasExchangeDiagram = () => {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Wind className="text-teal-400" size={22} />
                Alveolar Gas Exchange
            </h3>

            <p className="text-slate-300">
                Exchange occurs via <span className="text-teal-400 font-bold">Diffusion</span>. Gases move from
                an area of high partial pressure to low partial pressure across the alveolar-capillary membrane.
            </p>

            <div className="grid md:grid-cols-2 gap-8 items-start">
                {/* SVG Diagram */}
                <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-700 flex justify-center">
                    <svg viewBox="0 0 400 360" width="100%" className="max-w-[440px]">
                        {/* Background */}
                        <rect x="0" y="0" width="400" height="360" fill="transparent" />

                        {/* Alveolus (large circle) */}
                        <circle cx="200" cy="120" r="80" fill="rgba(56,189,248,0.08)" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6 3" />
                        <text x="200" y="80" textAnchor="middle" fill="#38bdf8" fontSize="13" fontWeight="bold">ALVEOLUS</text>
                        <text x="200" y="100" textAnchor="middle" fill="#7dd3fc" fontSize="11">(Air Side)</text>
                        <text x="200" y="125" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">PO₂ = 103 mmHg</text>
                        <text x="200" y="145" textAnchor="middle" fill="#94a3b8" fontSize="11">PCO₂ = 40 mmHg</text>

                        {/* Membrane */}
                        <rect x="60" y="205" width="280" height="8" rx="4" fill="rgba(148,163,184,0.3)" />
                        <text x="200" y="200" textAnchor="middle" fill="#94a3b8" fontSize="9" fontStyle="italic">
                            Alveolar-Capillary Membrane (~0.5 μm)
                        </text>

                        {/* Capillary (bottom) */}
                        <rect x="70" y="230" width="260" height="60" rx="30" fill="rgba(239,68,68,0.08)" stroke="#ef4444" strokeWidth="2" />
                        <text x="200" y="252" textAnchor="middle" fill="#fca5a5" fontSize="12" fontWeight="bold">PULMONARY CAPILLARY</text>
                        <text x="200" y="270" textAnchor="middle" fill="#94a3b8" fontSize="11">(Blood Side)</text>

                        {/* Venous blood label (left) */}
                        <rect x="10" y="240" width="60" height="40" rx="6" fill="rgba(99,102,241,0.15)" stroke="#818cf8" strokeWidth="1" />
                        <text x="40" y="256" textAnchor="middle" fill="#a5b4fc" fontSize="8" fontWeight="bold">VENOUS</text>
                        <text x="40" y="268" textAnchor="middle" fill="#94a3b8" fontSize="7">PO₂=40</text>
                        <text x="40" y="278" textAnchor="middle" fill="#94a3b8" fontSize="7">PCO₂=46</text>
                        {/* Arrow from venous into capillary */}
                        <line x1="70" y1="260" x2="85" y2="260" stroke="#818cf8" strokeWidth="2" markerEnd="url(#arrowhead-purple)" />

                        {/* Arterial blood label (right) */}
                        <rect x="330" y="240" width="60" height="40" rx="6" fill="rgba(239,68,68,0.15)" stroke="#ef4444" strokeWidth="1" />
                        <text x="360" y="256" textAnchor="middle" fill="#fca5a5" fontSize="8" fontWeight="bold">ARTERIAL</text>
                        <text x="360" y="268" textAnchor="middle" fill="#94a3b8" fontSize="7">PO₂=100</text>
                        <text x="360" y="278" textAnchor="middle" fill="#94a3b8" fontSize="7">PCO₂=40</text>
                        {/* Arrow from capillary to arterial */}
                        <line x1="315" y1="260" x2="330" y2="260" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrowhead-red)" />

                        {/* O2 Arrow (down) */}
                        <line x1="155" y1="165" x2="155" y2="225" stroke="#38bdf8" strokeWidth="3" markerEnd="url(#arrowhead-blue)" />
                        <text x="130" y="195" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">O₂ ↓</text>

                        {/* CO2 Arrow (up) */}
                        <line x1="245" y1="225" x2="245" y2="165" stroke="#f97316" strokeWidth="3" markerEnd="url(#arrowhead-orange)" />
                        <text x="272" y="195" textAnchor="middle" fill="#f97316" fontSize="11" fontWeight="bold">CO₂ ↑</text>

                        {/* Blood flow direction */}
                        <text x="200" y="310" textAnchor="middle" fill="#64748b" fontSize="10">
                            Blood Flow Direction →
                        </text>
                        <line x1="100" y1="315" x2="300" y2="315" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrowhead-gray)" />

                        {/* Arrowhead markers */}
                        <defs>
                            <marker id="arrowhead-blue" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                                <polygon points="0 0, 8 3, 0 6" fill="#38bdf8" />
                            </marker>
                            <marker id="arrowhead-orange" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                                <polygon points="0 0, 8 3, 0 6" fill="#f97316" />
                            </marker>
                            <marker id="arrowhead-gray" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                                <polygon points="0 0, 8 3, 0 6" fill="#64748b" />
                            </marker>
                            <marker id="arrowhead-red" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                                <polygon points="0 0, 8 3, 0 6" fill="#ef4444" />
                            </marker>
                            <marker id="arrowhead-purple" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                                <polygon points="0 0, 8 3, 0 6" fill="#818cf8" />
                            </marker>
                        </defs>
                    </svg>
                </div>

                {/* Factors affecting diffusion (preserved from original) */}
                <div className="space-y-4">
                    <div className="bg-slate-700/30 p-6 rounded-xl border border-slate-700">
                        <h4 className="font-bold text-teal-400 mb-4">Factors Affecting Diffusion</h4>
                        <ul className="space-y-3 text-sm text-slate-300">
                            <li className="flex gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 flex-shrink-0" />
                                <span><strong>Pressure Gradient:</strong> The steeper the difference, the faster the diffusion. Hypoxia entails a lower gradient.</span>
                            </li>
                            <li className="flex gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 flex-shrink-0" />
                                <span><strong>Surface Area:</strong> Emphysema reduces surface area, impairing exchange.</span>
                            </li>
                            <li className="flex gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 flex-shrink-0" />
                                <span><strong>Thickness:</strong> Pneumonia/Edema thickens the membrane, slowing diffusion.</span>
                            </li>
                            <li className="flex gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 flex-shrink-0" />
                                <span><strong>Time:</strong> Blood needs ~0.25s to oxygenate. At high heart rates (exercise), time is reduced but still sufficient in healthy lungs.</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-slate-900/50 p-4 rounded-lg text-sm text-slate-300 border border-slate-700">
                        <strong className="text-white">Dalton's Law:</strong> Total pressure = sum of all partial pressures.
                        At sea level (760 mmHg): O₂ ≈ 21% → PO₂ = 159 mmHg.
                        <br />
                        <strong className="text-white">Henry's Law:</strong> Amount of gas dissolved in a liquid is proportional to its partial pressure above the liquid.
                    </div>
                </div>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════
// 5. LUNG VOLUMES (preserved + enhanced)
// ═══════════════════════════════════════════════════════════════════

const LungVolumesSim = () => {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Activity className="text-teal-400" size={22} />
                Spirometry &amp; Lung Volumes
            </h3>

            {/* Visual spirometry representation */}
            <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
                <svg viewBox="0 0 500 200" width="100%" className="max-w-[600px] mx-auto">
                    {/* Background grid */}
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                        <React.Fragment key={`grid-${i}`}>
                            <line x1="40" y1={30 + i * 30} x2="480" y2={30 + i * 30} stroke="#334155" strokeWidth="0.5" />
                            <text x="35" y={35 + i * 30} textAnchor="end" fill="#64748b" fontSize="9">
                                {6000 - i * 1200} ml
                            </text>
                        </React.Fragment>
                    ))}

                    {/* Spirometry trace */}
                    <polyline
                        points="50,105 80,90 110,105 140,90 170,105 200,30 250,105 280,150 330,105 360,90 390,105 420,90 450,105"
                        fill="none"
                        stroke="#2dd4bf"
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                    />

                    {/* Area fill under the curve */}
                    <polyline
                        points="50,105 80,90 110,105 140,90 170,105 200,30 250,105 280,150 330,105 360,90 390,105 420,90 450,105 450,180 50,180"
                        fill="rgba(45,212,191,0.08)"
                        stroke="none"
                    />

                    {/* Labels */}
                    <text x="130" y="85" fill="#94a3b8" fontSize="8">Tidal</text>
                    <text x="200" y="24" fill="#38bdf8" fontSize="8">IRV Peak</text>
                    <text x="280" y="165" fill="#f97316" fontSize="8">ERV</text>

                    {/* Residual volume line */}
                    <line x1="40" y1="170" x2="480" y2="170" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 3" />
                    <text x="485" y="173" fill="#ef4444" fontSize="8">RV (1200ml)</text>
                </svg>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <VolumeCard title="Tidal Volume (TV)" val="~500 ml" desc="Volume of air inhaled or exhaled in a normal breath." color="bg-teal-500/10 border-teal-500/30" />
                <VolumeCard title="Inspiratory Reserve (IRV)" val="~3000 ml" desc="Max volume that can be inhaled after a normal inhalation." color="bg-sky-500/10 border-sky-500/30" />
                <VolumeCard title="Expiratory Reserve (ERV)" val="~1100 ml" desc="Max volume that can be exhaled after a normal exhalation." color="bg-orange-500/10 border-orange-500/30" />
                <VolumeCard title="Residual Volume (RV)" val="~1200 ml" desc="Volume remaining in lungs after max exhalation. Keeps alveoli open." color="bg-rose-500/10 border-rose-500/30" />
            </div>

            <div className="bg-slate-900/50 p-4 rounded-lg text-sm text-slate-300 border border-slate-700">
                <strong className="text-white">Vital Capacity (VC)</strong> = IRV + TV + ERV. This is the max air you can move (~4.6L).
                <br />
                <strong className="text-white">Total Lung Capacity (TLC)</strong> = VC + RV (~5.8L).
            </div>
        </div>
    );
};

const VolumeCard = ({ title, val, desc, color }: { title: string; val: string; desc: string; color: string }) => (
    <div className={`p-4 rounded-xl border ${color}`}>
        <div className="flex justify-between items-center mb-1">
            <span className="font-bold text-slate-200">{title}</span>
            <span className="text-sm font-mono bg-slate-900 px-2 py-1 rounded text-slate-400">{val}</span>
        </div>
        <p className="text-xs text-slate-400">{desc}</p>
    </div>
);

// ═══════════════════════════════════════════════════════════════════
// 6. RESPIRATION CONTROL (preserved from original)
// ═══════════════════════════════════════════════════════════════════

const RespirationControl = () => {
    return (
        <div className="space-y-8">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Brain className="text-teal-400" size={22} />
                Control of Breathing
            </h3>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="p-6 bg-indigo-900/20 border border-indigo-500/30 rounded-xl">
                    <h3 className="text-lg font-bold text-indigo-300 mb-2">Central Chemoreceptors</h3>
                    <p className="text-sm text-slate-400 mb-4">Located in the Medulla Oblongata (Brain Stem).</p>
                    <div className="space-y-2">
                        <div className="flex justify-between bg-black/20 p-2 rounded px-3">
                            <span className="text-slate-300">Primary Stimulus</span>
                            <span className="text-white font-bold">CO₂ Level (High PCO₂)</span>
                        </div>
                        <div className="flex justify-between bg-black/20 p-2 rounded px-3">
                            <span className="text-slate-300">Sensitivity</span>
                            <span className="text-teal-400">High</span>
                        </div>
                        <div className="text-xs text-slate-400 mt-2 italic">
                            &quot;Hypercapnic Drive&quot; — Normal breathing is driven by the need to expel CO₂.
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-rose-900/20 border border-rose-500/30 rounded-xl">
                    <h3 className="text-lg font-bold text-rose-300 mb-2">Peripheral Chemoreceptors</h3>
                    <p className="text-sm text-slate-400 mb-4">Located in Carotid &amp; Aortic bodies.</p>
                    <div className="space-y-2">
                        <div className="flex justify-between bg-black/20 p-2 rounded px-3">
                            <span className="text-slate-300">Primary Stimulus</span>
                            <span className="text-white font-bold">Low O₂ (Hypoxia)</span>
                        </div>
                        <div className="flex justify-between bg-black/20 p-2 rounded px-3">
                            <span className="text-slate-300">Activation Threshold</span>
                            <span className="text-rose-400">PaO₂ &lt; 60 mmHg</span>
                        </div>
                        <div className="text-xs text-slate-400 mt-2 italic">
                            &quot;Hypoxic Drive&quot; — Takes over as primary drive in severe lung disease or extreme altitude.
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl text-center border border-slate-700">
                <h4 className="text-white font-bold mb-2">Hyperventilation Loop</h4>
                <p className="text-slate-400 max-w-2xl mx-auto mb-6">
                    Hyperventilation expels too much CO₂ (Hypocapnia). This reduces the &quot;Hypercapnic Drive&quot;,
                    potentially leading to a temporary cessation of breathing (bedside apnea) until CO₂ builds back up.
                </p>
                <div className="flex flex-wrap justify-center items-center gap-3 text-sm font-mono text-teal-500">
                    <div className="bg-teal-500/10 px-4 py-2 rounded-lg border border-teal-500/20">Anxiety / Hypoxia</div>
                    <span className="text-slate-500">→</span>
                    <div className="bg-teal-500/10 px-4 py-2 rounded-lg border border-teal-500/20">Increased Rate</div>
                    <span className="text-slate-500">→</span>
                    <div className="bg-teal-500/10 px-4 py-2 rounded-lg border border-teal-500/20">Low CO₂</div>
                    <span className="text-slate-500">→</span>
                    <div className="bg-teal-500/10 px-4 py-2 rounded-lg border border-teal-500/20">Alkalosis (Symptoms)</div>
                </div>
            </div>
        </div>
    );
};

export default HPLRespiration;
