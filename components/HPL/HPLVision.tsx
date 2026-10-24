import React, { useState } from 'react';
import { Eye, Zap, AlertTriangle, ArrowRight, MousePointer, Moon, Sun, Glasses, Focus, ShieldCheck } from 'lucide-react';

const HPLVision: React.FC = () => {
    const [tab, setTab] = useState<'anatomy' | 'myopia-nightscan' | 'defects' | 'blindspot' | 'illusions'>('anatomy');

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                        <Eye className="text-cyan-400" />
                        Vision, Visual Limitations &amp; Illusions (040.02.01)
                    </h2>
                    <p className="text-slate-400 text-sm">
                        Photoreceptor biology, Empty Field Myopia, night scanning, refractive defects, and runway illusions.
                    </p>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-lg flex-wrap gap-1">
                    <button onClick={() => setTab('anatomy')} className={`px-3 py-1.5 rounded-md font-bold text-xs transition-colors ${tab === 'anatomy' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}>Anatomy</button>
                    <button onClick={() => setTab('myopia-nightscan')} className={`px-3 py-1.5 rounded-md font-bold text-xs transition-colors ${tab === 'myopia-nightscan' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}>Empty Field &amp; Night Scan</button>
                    <button onClick={() => setTab('defects')} className={`px-3 py-1.5 rounded-md font-bold text-xs transition-colors ${tab === 'defects' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}>Refractive Defects</button>
                    <button onClick={() => setTab('blindspot')} className={`px-3 py-1.5 rounded-md font-bold text-xs transition-colors ${tab === 'blindspot' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}>Blind Spot</button>
                    <button onClick={() => setTab('illusions')} className={`px-3 py-1.5 rounded-md font-bold text-xs transition-colors ${tab === 'illusions' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}>Runway Illusions</button>
                </div>
            </div>

            {tab === 'anatomy' && <EyeAnatomy />}
            {tab === 'myopia-nightscan' && <EmptyFieldAndNightScanning />}
            {tab === 'defects' && <VisionDefects />}
            {tab === 'blindspot' && <BlindSpotTest />}
            {tab === 'illusions' && <VisualIllusions />}
        </div>
    );
};

const EyeAnatomy = () => (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in">
        <div className="space-y-6">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h3 className="font-bold text-white mb-4">Photoreceptors: Cones vs. Rods</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800 p-4 rounded border-t-4 border-yellow-400">
                        <h4 className="font-bold text-white mb-1">CONES (~6–7 Million)</h4>
                        <p className="text-xs text-yellow-300 font-semibold mb-2">Photopic Vision (Daylight)</p>
                        <ul className="text-xs text-slate-400 list-disc pl-4 space-y-1">
                            <li>Concentrated in center of Retina (<strong className="text-white">Fovea Centralis</strong>).</li>
                            <li>High Visual Acuity (sharp detail &amp; reading).</li>
                            <li>Color Perception (Red, Green, Blue pigments).</li>
                            <li>Require high light intensity to function.</li>
                            <li>Inoperative under moonlight or dim starlight.</li>
                        </ul>
                    </div>
                    <div className="bg-slate-800 p-4 rounded border-t-4 border-slate-400">
                        <h4 className="font-bold text-white mb-1">RODS (~120 Million)</h4>
                        <p className="text-xs text-slate-300 font-semibold mb-2">Scotopic Vision (Night)</p>
                        <ul className="text-xs text-slate-400 list-disc pl-4 space-y-1">
                            <li>Spread across Peripheral Retina (absent in Fovea).</li>
                            <li>Low Visual Acuity (blurry silhouettes, no color).</li>
                            <li>Monochromatic (shades of grey/black/white).</li>
                            <li>Highly sensitive to motion and dim light.</li>
                            <li>Depend on <strong className="text-white">Rhodopsin (Visual Purple)</strong>.</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h3 className="font-bold text-white mb-2">Scanning Techniques</h3>
                <div className="space-y-4">
                    <div className="flex items-start gap-4">
                        <div className="bg-cyan-900/30 p-2 rounded text-cyan-400 font-bold text-xs uppercase w-24 shrink-0 text-center">Day Scan</div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            <strong className="text-white">Saccadic Eye Movement:</strong> The eye cannot focus while moving. Scan in systematic overlapping 10&deg; to 15&deg; blocks, pausing for 1–2 seconds in each sector to allow foveal acquisition.
                        </p>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="bg-purple-900/30 p-2 rounded text-purple-400 font-bold text-xs uppercase w-24 shrink-0 text-center">Night Scan</div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            <strong className="text-white">Off-Center Viewing:</strong> Look 5&deg; to 10&deg; to the side of the target object so the image falls on the rod-rich periphery, avoiding the night blind spot in the fovea.
                        </p>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="bg-red-900/30 p-2 rounded text-red-400 font-bold text-xs uppercase w-24 shrink-0 text-center">Empty Field</div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            <strong className="text-white">Optical Resting Focus:</strong> In haze, clouds, or featureless blue sky, eyes relax to a focal resting distance of ~1 to 2 meters. Traffic remains undetected until too late.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-slate-950 p-6 rounded-xl border border-slate-700 relative overflow-hidden flex flex-col items-center justify-center">
            {/* Visual Eye Diagram */}
            <svg viewBox="0 0 200 200" className="w-full max-w-[320px]">
                {/* Eyeball */}
                <circle cx="100" cy="100" r="90" fill="#0f172a" stroke="#334155" strokeWidth="2" />

                {/* Sclera & Cornea */}
                <path d="M 50 65 Q 25 100 50 135" fill="none" stroke="#38bdf8" strokeWidth="3" />
                <text x="15" y="70" fill="#38bdf8" fontSize="8" fontWeight="bold">Cornea</text>

                {/* Lens */}
                <ellipse cx="65" cy="100" rx="9" ry="28" fill="#94a3b8" opacity="0.6" stroke="#cbd5e1" strokeWidth="1" />
                <text x="60" y="60" fill="#94a3b8" fontSize="8">Lens</text>

                {/* Retina */}
                <path d="M 130 35 Q 192 100 130 165" fill="none" stroke="#fbbf24" strokeWidth="4" strokeDasharray="4 2" opacity="0.6" />
                <text x="140" y="30" fill="#fbbf24" fontSize="8">Retina (Photoreceptors)</text>

                {/* Fovea Centralis */}
                <path d="M 188 95 L 188 105" stroke="#38bdf8" strokeWidth="4" />
                <circle cx="188" cy="100" r="3" fill="#38bdf8" />
                <text x="120" y="103" fill="#38bdf8" fontSize="8" fontWeight="bold">Fovea (Cones only)</text>

                {/* Optic Disc / Blind Spot */}
                <circle cx="172" cy="132" r="5" fill="#f87171" />
                <text x="140" y="148" fill="#f87171" fontSize="8" fontWeight="bold">Optic Nerve (Blind Spot)</text>

                {/* Light Ray */}
                <path d="M 0 100 L 65 100 L 188 100" stroke="#fef08a" strokeWidth="1.5" strokeDasharray="2 2" />
                <text x="5" y="93" fill="#fef08a" fontSize="8">Light Ray</text>
            </svg>
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-400 mt-4 text-center max-w-sm">
                Light refracts through the <strong className="text-white">Cornea</strong> (70% of optical power) and is finely focused by the <strong className="text-white">Lens</strong> onto the <strong className="text-sky-400">Fovea</strong> for high-resolution vision.
            </div>
        </div>
    </div>
);

// ─── Empty Field Myopia & Night Scanning Deep-Dive ─────────────────
const EmptyFieldAndNightScanning: React.FC = () => {
    const [environment, setEnvironment] = useState<'clouds' | 'night' | 'day'>('clouds');
    const [eyeMode, setEyeMode] = useState<'relaxed' | 'focused'>('relaxed');

    return (
        <div className="space-y-6 animate-in fade-in">
            {/* Environment Tabs */}
            <div className="flex gap-2 bg-slate-900 p-1 rounded-lg">
                <button
                    onClick={() => { setEnvironment('clouds'); setEyeMode('relaxed'); }}
                    className={`flex-1 py-2 rounded-md font-bold text-xs flex items-center justify-center gap-2 ${
                        environment === 'clouds' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                >
                    <Focus size={16} /> Empty Field Myopia (Cloud / Haze)
                </button>
                <button
                    onClick={() => setEnvironment('night')}
                    className={`flex-1 py-2 rounded-md font-bold text-xs flex items-center justify-center gap-2 ${
                        environment === 'night' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                >
                    <Moon size={16} /> Night Scanning &amp; Scotopic Vision
                </button>
            </div>

            {/* Empty Field Myopia Section */}
            {environment === 'clouds' && (
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 space-y-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Focus className="text-cyan-400" size={20} />
                            <h3 className="text-lg font-bold text-white">Empty Field Myopia (Space / Cloud Myopia)</h3>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            When flying in a featureless visual environment — uniform overcast, flight between cloud layers, dense fog, 
                            thick haze, or completely clear blue sky at high altitude — the visual system has no sharp contrast or edges 
                            to stimulate accommodation.
                        </p>
                    </div>

                    {/* Interactive Focal Plane Simulator */}
                    <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400 font-bold">Pilot Accommodation State:</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setEyeMode('relaxed')}
                                    className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                                        eyeMode === 'relaxed' ? 'bg-red-600 text-white shadow' : 'bg-slate-800 text-slate-400'
                                    }`}
                                >
                                    Resting Muscle Tone (1 to 2m)
                                </button>
                                <button
                                    onClick={() => setEyeMode('focused')}
                                    className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                                        eyeMode === 'focused' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-800 text-slate-400'
                                    }`}
                                >
                                    Deliberate Long-Distance Scan
                                </button>
                            </div>
                        </div>

                        {/* Visual Cockpit Windshield & Approaching Traffic */}
                        <div className="relative h-44 rounded-xl border-2 border-slate-700 bg-gradient-to-b from-slate-700 via-slate-600 to-slate-700 overflow-hidden flex items-center justify-center">
                            {/* Windshield Pillar Frame */}
                            <div className="absolute inset-y-0 left-10 w-2 bg-slate-900/80 border-r border-slate-600" />
                            <div className="absolute inset-y-0 right-10 w-2 bg-slate-900/80 border-l border-slate-600" />

                            {/* Focal distance overlay */}
                            <div className={`absolute inset-0 transition-all duration-500 flex flex-col items-center justify-center ${
                                eyeMode === 'relaxed' ? 'backdrop-blur-[6px]' : 'backdrop-blur-none'
                            }`}>
                                {/* Approaching Traffic */}
                                <div className={`transition-all duration-500 flex flex-col items-center ${
                                    eyeMode === 'relaxed' ? 'opacity-20 scale-75 blur-sm' : 'opacity-100 scale-100'
                                }`}>
                                    <div className="text-2xl font-black text-amber-400">✈</div>
                                    <span className="text-[10px] font-mono text-amber-300 font-bold bg-slate-900/80 px-2 py-0.5 rounded">
                                        Opposite Traffic 3 NM · Converging
                                    </span>
                                </div>
                            </div>

                            {/* Windshield focal marker */}
                            <div className="absolute bottom-2 left-4 text-[11px] font-mono bg-slate-900/90 px-3 py-1 rounded border border-slate-700 text-slate-300">
                                {eyeMode === 'relaxed'
                                    ? '⚠️ Focal Plane: ~1.5 meters (Windshield Glass Level) — Traffic INVISIBLE'
                                    : '✓ Focal Plane: Infinity (Collimated Long Range) — Traffic DETECTED'}
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4 text-xs pt-2">
                            <div className="bg-red-950/30 p-3.5 rounded-lg border border-red-500/30 space-y-1">
                                <strong className="text-red-400 block font-bold">The Hazard:</strong>
                                <p className="text-slate-300">
                                    The pilot genuinely believes they are searching miles ahead for other aircraft, but the ciliary 
                                    muscles have relaxed to their intermediate resting state (1 to 2 meters). An approaching high-speed 
                                    jet remains completely blurred and undetectable until it is within 800m — leaving zero reaction time!
                                </p>
                            </div>

                            <div className="bg-emerald-950/30 p-3.5 rounded-lg border border-emerald-500/30 space-y-1">
                                <strong className="text-emerald-400 block font-bold">Operational Defences:</strong>
                                <ul className="text-slate-300 list-disc pl-4 space-y-1">
                                    <li>Periodically focus on distant cloud edges, wingtips, or aircraft struts to stimulate distance accommodation.</li>
                                    <li>Scan airspace systematically in 10&deg; to 15&deg; overlapping blocks, pausing for 1–2 seconds in each sector.</li>
                                    <li>Rely on TCAS / ADS-B traffic displays to guide visual acquisition.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Night Scanning Section */}
            {environment === 'night' && (
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 space-y-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Moon className="text-indigo-400" size={20} />
                            <h3 className="text-lg font-bold text-white">Night Scanning &amp; Dark Adaptation</h3>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            Under low illumination (scotopic conditions), day cones become inactive. 
                            Vision depends entirely on peripheral rods sensitized by the photochemical substance 
                            <strong className="text-indigo-300"> Rhodopsin (Visual Purple)</strong>.
                        </p>
                    </div>

                    {/* Night Visual Facts Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                        <div className="bg-slate-800 p-4 rounded-xl border border-indigo-500/30 space-y-2">
                            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
                                Night Blind Spot (Foveal Scotoma)
                            </span>
                            <p className="text-slate-300 leading-relaxed">
                                The fovea centralis contains zero rods. In the dark, looking directly at a dim light 
                                or aircraft makes it <strong className="text-rose-400">completely disappear</strong>!
                            </p>
                            <div className="p-2 bg-slate-900 rounded text-[11px] text-amber-300 font-mono">
                                Central 5&deg; to 10&deg; blind spot
                            </div>
                        </div>

                        <div className="bg-slate-800 p-4 rounded-xl border border-indigo-500/30 space-y-2">
                            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
                                Off-Center Viewing Technique
                            </span>
                            <p className="text-slate-300 leading-relaxed">
                                Scan by looking <strong className="text-white">5&deg; to 10&deg; above, below, or to the side</strong> of a suspect target. 
                                This casts the incoming light onto the rod-dense peripheral retina, making faint lights immediately visible.
                            </p>
                            <div className="p-2 bg-slate-900 rounded text-[11px] text-emerald-300 font-mono">
                                10,000x greater light sensitivity
                            </div>
                        </div>

                        <div className="bg-slate-800 p-4 rounded-xl border border-indigo-500/30 space-y-2">
                            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
                                Dark Adaptation Timeline
                            </span>
                            <p className="text-slate-300 leading-relaxed">
                                Cones adapt in 5–7 minutes. Rods require <strong className="text-white">30 to 45 minutes</strong> in total darkness 
                                to fully synthesize rhodopsin. A single white flash bleaches rhodopsin and resets the 30-min clock!
                            </p>
                            <div className="p-2 bg-slate-900 rounded text-[11px] text-sky-300 font-mono">
                                Full Rod Adaptation: 30–45 mins
                            </div>
                        </div>
                    </div>

                    {/* Cockpit Night Rules */}
                    <div className="bg-indigo-950/30 p-4 rounded-xl border border-indigo-500/40 text-xs text-slate-300 space-y-2">
                        <strong className="text-indigo-300 font-bold text-sm block">✈ EASA Cockpit Night Rules:</strong>
                        <ul className="list-disc pl-4 space-y-1">
                            <li><strong className="text-white">Red Cockpit Lighting:</strong> Red light (wavelength &gt;650 nm) does not stimulate or bleach rhodopsin, allowing pilots to read charts while maintaining night adaptation. (Caution: red lighting washes out red print on navigation charts!).</li>
                            <li><strong className="text-white">Hypoxia Impairs Night Vision First:</strong> Rods are the most oxygen-sensitive cells in the body. Mild hypoxia above <strong className="text-amber-400">4,000–5,000 ft</strong> noticeably degrades night vision.</li>
                            <li><strong className="text-white">Vitamin A &amp; Smoking:</strong> Vitamin A is essential for rhodopsin synthesis (deficiency causes Nyctalopia). Carbon monoxide from smoking robs blood oxygen, increasing physiological night altitude by 4,000 ft.</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── Vision Defects & Optical Corrections ───────────────────────────
const VisionDefects: React.FC = () => {
    const defects = [
        {
            name: 'Myopia (Short-Sightedness)',
            cause: 'Eyeball is too long, or cornea/lens refractive power is too strong.',
            focus: 'Light rays focus IN FRONT of the retina.',
            effect: 'Near vision is clear; distant vision is blurred.',
            correction: 'Concave (diverging / negative) spherical lenses.',
            color: 'text-sky-400',
        },
        {
            name: 'Hypermetropia / Hyperopia (Long-Sightedness)',
            cause: 'Eyeball is too short, or lens refractive power is too weak.',
            focus: 'Light rays focus BEHIND the retina.',
            effect: 'Distant vision is relatively clear; near reading vision requires intense accommodation causing eyestrain/headaches.',
            correction: 'Convex (converging / positive) spherical lenses.',
            color: 'text-amber-400',
        },
        {
            name: 'Presbyopia (Aging Eye)',
            cause: 'Natural physiological aging (typically begins age 40–45). The crystalline lens loses water content and elasticity; ciliary muscles lose contractility.',
            focus: 'Near point of accommodation recedes beyond normal reading distance.',
            effect: 'Difficulty reading small print on approach plates and cockpit instruments in dim light.',
            correction: 'Bifocal, trifocal, or progressive reading lenses (convex addition). Pilots must carry a spare set in the cockpit.',
            color: 'text-purple-400',
        },
        {
            name: 'Astigmatism',
            cause: 'Unequal curvature of the cornea (shaped like a rugby ball rather than a spherical football).',
            focus: 'Light rays in different meridians focus at different focal planes.',
            effect: 'Distorted or blurred vision at all distances; vertical or horizontal lines appear out of focus.',
            correction: 'Cylindrical (toric) lenses oriented along the corrective axis.',
            color: 'text-emerald-400',
        },
        {
            name: 'Glaucoma & Cataracts',
            cause: 'Glaucoma: abnormally high intraocular pressure damaging optic nerve fibers. Cataracts: gradual opacification / clouding of the crystalline lens.',
            focus: 'Glaucoma causes progressive peripheral vision loss (tunnel vision). Cataracts cause blurred vision and severe night glare sensitivity.',
            effect: 'Both are disqualifying for commercial flight unless treated, stabilized, and cleared by Aeromedical Section (AMS).',
            correction: 'Prescription eye drops (beta blockers / prostaglandin analogs), laser iridotomy, or surgical lens replacement.',
            color: 'text-rose-400',
        },
    ];

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                    <Glasses className="text-cyan-400" size={22} />
                    <h3 className="text-xl font-bold text-white">Refractive Defects &amp; EASA Medical Standards</h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                    Visual acuity requirements for commercial pilots (EASA Class 1): Distance visual acuity must be at least 
                    <strong className="text-white"> 6/9 (0.7)</strong> in each eye separately and <strong className="text-white">6/6 (1.0)</strong> binocularly, 
                    with or without corrective lenses. If corrective lenses are required, a spare pair of identical prescription glasses must be immediately accessible in flight.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {defects.map(d => (
                    <div key={d.name} className="bg-slate-900 p-5 rounded-xl border border-slate-700 space-y-2">
                        <h4 className={`text-base font-bold ${d.color}`}>{d.name}</h4>
                        <div className="text-xs text-slate-300">
                            <strong className="text-slate-400 block mb-0.5">Underlying Anatomy:</strong>
                            {d.cause}
                        </div>
                        <div className="text-xs text-slate-300">
                            <strong className="text-slate-400 block mb-0.5">Focal Plane:</strong>
                            {d.focus}
                        </div>
                        <div className="p-2.5 rounded bg-slate-800 text-xs text-emerald-300 border border-emerald-500/30">
                            <strong>Optical Prescription:</strong> {d.correction}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const BlindSpotTest = () => {
    return (
        <div className="animate-in fade-in text-center">
            <div className="bg-slate-900 p-8 rounded-xl border border-slate-700 max-w-3xl mx-auto mb-8">
                <h3 className="text-xl font-bold text-white mb-2">Physiological Blind Spot Demo</h3>
                <p className="text-sm text-slate-400 mb-8">
                    Every eye has a blind spot where the optic nerve exits (Optic Disc).
                    <br /><strong>Instructions:</strong> Close your LEFT eye. Look at the Cross with your RIGHT eye. Move your head closer/further (approx 30-40cm) until the Dot disappears.
                </p>

                <div className="flex justify-between items-center px-16 py-12 bg-white rounded text-black">
                    <div className="text-4xl font-black">+</div>
                    <div className="text-6xl font-black">&bull;</div>
                </div>

                <div className="mt-8 text-xs text-slate-500 bg-slate-800 p-2 rounded inline-block">
                    Caution: On mobile, functionality depends on screen width/distance. Use landscape or desktop for best results.
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto text-left">
                <div className="bg-slate-800 p-4 rounded border border-slate-700">
                    <h4 className="font-bold text-white text-sm mb-2">Why don&apos;t we see it normally?</h4>
                    <p className="text-xs text-slate-300">
                        Two reasons:
                        1. Binocular vision (the other eye fills the gap).
                        2. The brain &quot;fills in&quot; the missing information based on surrounding texture (auto-complete).
                    </p>
                </div>
                <div className="bg-slate-800 p-4 rounded border border-slate-700">
                    <h4 className="font-bold text-white text-sm mb-2">Flight Safety Implication</h4>
                    <p className="text-xs text-slate-300">
                        A target (other aircraft) on a constant bearing can remain in your blind spot if you don&apos;t move your head. Scan by moving head/eyes effectively.
                    </p>
                </div>
            </div>
        </div>
    );
};

const VisualIllusions = () => {
    const [rwSlope, setRwSlope] = useState(0); // -10 Down, 0 Level, 10 Up
    const [rwWidth, setRwWidth] = useState(1); // 0.5 Narrow, 1 Normal, 1.5 Wide

    const getPerspective = () => {
        return {
            rotation: rwSlope * 2,
            widthScale: rwWidth
        };
    };

    const { rotation, widthScale } = getPerspective();

    return (
        <div className="grid md:grid-cols-2 gap-8 animate-in fade-in">
            <div className="space-y-6">
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-white mb-4">Runway Perspective Illusions</h3>

                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="flex justify-between text-xs text-slate-400 mb-2">
                                Runway Slope
                                <span className={rwSlope > 0 ? 'text-red-400' : rwSlope < 0 ? 'text-blue-400' : 'text-white'}>
                                    {rwSlope > 0 ? 'Upslope (+)' : rwSlope < 0 ? 'Downslope (-)' : 'Level'}
                                </span>
                            </label>
                            <input type="range" min="-10" max="10" value={rwSlope} onChange={e => setRwSlope(Number(e.target.value))} className="w-full" />
                        </div>
                        <div>
                            <label className="flex justify-between text-xs text-slate-400 mb-2">
                                Runway Width
                                <span className="text-white">
                                    {rwWidth < 1 ? 'Narrow' : rwWidth > 1 ? 'Wide' : 'Standard'}
                                </span>
                            </label>
                            <input type="range" min="0.5" max="1.5" step="0.1" value={rwWidth} onChange={e => setRwWidth(Number(e.target.value))} className="w-full" />
                        </div>
                    </div>

                    <div className="bg-slate-800 p-4 rounded border-l-4 border-cyan-500">
                        <h4 className="font-bold text-white text-sm mb-2">Illusion Result</h4>
                        <p className="text-xs text-slate-300 mb-1">
                            {rwSlope > 0 && "Upsloping: You feel HIGH. Tendency to fly LOW."}
                            {rwSlope < 0 && "Downsloping: You feel LOW. Tendency to fly HIGH."}
                            {rwSlope === 0 && "Normal Slope perception."}
                        </p>
                        <p className="text-xs text-slate-300">
                            {rwWidth > 1 && "Wide Runway: You feel LOW. Tendency to fly HIGH (Flare high)."}
                            {rwWidth < 1 && "Narrow Runway: You feel HIGH. Tendency to fly LOW (Flare late)."}
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-white text-sm mb-2">Other Common Illusions</h3>
                    <ul className="text-xs text-slate-400 space-y-2">
                        <li><strong>Black Hole Effect:</strong> Night approach over water/unlit terrain. No peripheral cues. Tendency to fly a curved path into the ground (undershoot).</li>
                        <li><strong>Autokinesis:</strong> Staring at a static single light in dark. It appears to move. Fight by scanning.</li>
                        <li><strong>Rain on Windscreen:</strong> Refraction makes runway look lower. Tendency to fly lower.</li>
                    </ul>
                </div>
            </div>

            <div className="bg-gradient-to-b from-sky-900 to-slate-900 rounded-xl border border-slate-700 relative overflow-hidden flex flex-col items-center justify-center h-[400px]">
                {/* Cockpit Frame */}
                <div className="absolute inset-0 border-[20px] border-slate-950 pointer-events-none z-20 rounded-xl opacity-80"></div>

                {/* Visual Scene */}
                <div className="relative w-full h-full flex items-center justify-center perspective-[500px]">
                    <div className="absolute bottom-0 w-full h-1/2 bg-emerald-900/50"></div>
                    <div
                        className="bg-slate-400 shadow-[0_0_50px_rgba(255,255,255,0.1)] transition-all duration-500 ease-out"
                        style={{
                            width: `${100 * widthScale}px`,
                            height: '400px',
                            transform: `rotateX(${60 + rotation}deg)`,
                            background: 'linear-gradient(to bottom, #475569 0%, #1e293b 100%)',
                            marginTop: '100px'
                        }}
                    >
                        <div className="w-[4px] h-full bg-slate-400/0 mx-auto border-l-2 border-dashed border-white/80"></div>
                    </div>
                </div>

                <div className="absolute top-8 text-white font-bold bg-black/50 px-4 py-2 rounded z-30">
                    Pilot&apos;s View Simulation
                </div>
            </div>
        </div>
    );
};

export default HPLVision;
