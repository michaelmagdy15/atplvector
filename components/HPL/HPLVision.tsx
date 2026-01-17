
import React, { useState, useRef, useEffect } from 'react';
import { Eye, Zap, AlertTriangle, ArrowRight, MousePointer } from 'lucide-react';

const HPLVision: React.FC = () => {
    const [tab, setTab] = useState<'anatomy' | 'illusions' | 'blindspot' | 'defects'>('anatomy');

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <Eye className="text-cyan-400" />
                        Vision & Visual Illusions
                    </h2>
                    <p className="text-slate-400 text-sm">Anatomy, scanning techniques, and physiological limitations.</p>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-lg flex-wrap">
                    <button onClick={() => setTab('anatomy')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'anatomy' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}>Anatomy</button>
                    <button onClick={() => setTab('defects')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'defects' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}>Defects</button>
                    <button onClick={() => setTab('blindspot')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'blindspot' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}>Blind Spot</button>
                    <button onClick={() => setTab('illusions')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'illusions' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}>Illusions</button>
                </div>
            </div>

            {tab === 'anatomy' && <EyeAnatomy />}
            {tab === 'blindspot' && <BlindSpotTest />}
            {tab === 'illusions' && <VisualIllusions />}
        </div>
    );
};

const EyeAnatomy = () => (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in">
        <div className="space-y-6">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h3 className="font-bold text-white mb-4">Photoreceptors</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800 p-4 rounded border-t-4 border-yellow-400">
                        <h4 className="font-bold text-white mb-1">CONES</h4>
                        <p className="text-xs text-slate-300 mb-2">Photopic Vision (Day)</p>
                        <ul className="text-xs text-slate-400 list-disc pl-4 space-y-1">
                            <li>Center of Retina (Fovea).</li>
                            <li>High Acuity (Detail).</li>
                            <li>Color Perception.</li>
                            <li>Need high light intensity.</li>
                        </ul>
                    </div>
                    <div className="bg-slate-800 p-4 rounded border-t-4 border-slate-400">
                        <h4 className="font-bold text-white mb-1">RODS</h4>
                        <p className="text-xs text-slate-300 mb-2">Scotopic Vision (Night)</p>
                        <ul className="text-xs text-slate-400 list-disc pl-4 space-y-1">
                            <li>Periphery of Retina.</li>
                            <li>Low Acuity (Blurry).</li>
                            <li>Black & White only.</li>
                            <li>Detect movement well.</li>
                            <li>Secret "Visual Purple" (Rhodopsin) for night adapting.</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h3 className="font-bold text-white mb-2">Scanning Techniques</h3>
                <div className="space-y-4">
                    <div className="flex items-start gap-4">
                        <div className="bg-cyan-900/30 p-2 rounded text-cyan-400 font-bold text-xs uppercase w-20 shrink-0 text-center">Day Scan</div>
                        <p className="text-sm text-slate-300">Saccadic Movements. Jump/Stop/Jump. Eye focuses only when stopped. Overlap sectors by 10&deg;.</p>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="bg-slate-700/50 p-2 rounded text-slate-300 font-bold text-xs uppercase w-20 shrink-0 text-center">Night Scan</div>
                        <p className="text-sm text-slate-300">Off-Center Viewing. Look 5-10&deg; to the side of the object to use Rods (Blind spot in Fovea at night).</p>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="bg-red-900/30 p-2 rounded text-red-400 font-bold text-xs uppercase w-20 shrink-0 text-center">Empty Field</div>
                        <p className="text-sm text-slate-300">Myopia. If nothing to focus on (clouds/haze), eyes focus at resting distance (~1-2m). Danger of not seeing traffic.</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-black p-6 rounded-xl border border-slate-700 relative overflow-hidden flex flex-col items-center justify-center">
            {/* Simple Eye Diagram Visualization */}
            <svg viewBox="0 0 200 200" className="w-full max-w-[300px]">
                {/* Eyeball */}
                <circle cx="100" cy="100" r="90" fill="#1e293b" stroke="#334155" strokeWidth="2" />

                {/* Lens */}
                <ellipse cx="60" cy="100" rx="10" ry="30" fill="#94a3b8" opacity="0.5" />

                {/* Cornea */}
                <path d="M 50 70 Q 30 100 50 130" fill="none" stroke="#60a5fa" strokeWidth="2" />

                {/* Retina */}
                <path d="M 140 40 Q 190 100 140 160" fill="none" stroke="#fbbf24" strokeWidth="4" strokeDasharray="5 5" opacity="0.5" />

                {/* Fovea */}
                <path d="M 185 95 L 185 105" stroke="#fbbf24" strokeWidth="4" />
                <text x="195" y="105" fill="#fbbf24" fontSize="10">Fovea (Cones)</text>

                {/* Blind Spot */}
                <circle cx="170" cy="130" r="5" fill="#f87171" />
                <text x="150" y="150" fill="#f87171" fontSize="10">Optic Disc</text>

                {/* Light Ray */}
                <path d="M 0 100 L 60 100 L 185 100" stroke="white" strokeWidth="1" strokeDasharray="2 2" />
                <text x="10" y="90" fill="white" fontSize="10">Light</text>
            </svg>
            <p className="text-xs text-slate-500 mt-4 text-center">
                Light enters cornea/lens &rarr; Focused on Retina (inverted). <br />
                Optic Nerve exits at Optic Disc (Blind Spot).
            </p>
        </div>
    </div>
);

const BlindSpotTest = () => {
    return (
        <div className="animate-in fade-in text-center">
            <div className="bg-slate-900 p-8 rounded-xl border border-slate-700 max-w-3xl mx-auto mb-8">
                <h3 className="text-xl font-bold text-white mb-2">Physiological Blind Spot Demo</h3>
                <p className="text-sm text-slate-400 mb-8">
                    Every eye has a blind spot where the optic nerve exits.
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
                    <h4 className="font-bold text-white text-sm mb-2">Why don't we see it normally?</h4>
                    <p className="text-xs text-slate-300">
                        Two reasons:
                        1. Binocular vision (the other eye fills the gap).
                        2. The brain "fills in" the missing information based on surrounding texture (auto-complete).
                    </p>
                </div>
                <div className="bg-slate-800 p-4 rounded border border-slate-700">
                    <h4 className="font-bold text-white text-sm mb-2">Flight Safety Implication</h4>
                    <p className="text-xs text-slate-300">
                        A target (other aircraft) on a constant bearing can remain in your blind spot if you don't move your head. Scan by moving head/eyes effectively.
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
        // Simple visual hack: Changing the trapezoid top width simulates glide path perception
        // If up-sloping: Runway looks "longer/higher", pilot thinks they are too high &rarr; Flies LOW.
        // If down-sloping: Runway looks "shorter/lower", pilot thinks they are too low &rarr; Flies HIGH.

        // Let's visualize what the PILOT SEES
        let topWidth = 20;

        // Upsloping: Runway looks steeper (more "up" in field of view). 
        // Actually, the classic illusion is:
        // Upslope: Pilot perceives "Too High". Correction: Pitch Down. Danger: Undershoot/Low.
        // Downslope: Pilot perceives "Too Low". Correction: Pitch Up. Danger: Overshoot/High.

        return {
            rotation: rwSlope * 2, // Rotate the runway polygon visually
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
                    {/* Ground */}
                    <div className="absolute bottom-0 w-full h-1/2 bg-emerald-900/50"></div>

                    {/* Runway Poly */}
                    {/* We manipulate a CSS clip-path or transform to simulate the illusion */}
                    <div
                        className="bg-slate-400 shadow-[0_0_50px_rgba(255,255,255,0.1)] transition-all duration-500 ease-out"
                        style={{
                            width: `${100 * widthScale}px`,
                            height: '400px',
                            transform: `rotateX(${60 + rotation}deg)`, // Tilt creates depth
                            background: 'linear-gradient(to bottom, #475569 0%, #1e293b 100%)',
                            marginTop: '100px'
                        }}
                    >
                        {/* Centerline */}
                        <div className="w-[4px] h-full bg-slate-400/0 mx-auto border-l-2 border-dashed border-white/80"></div>
                    </div>
                </div>

                <div className="absolute top-8 text-white font-bold bg-black/50 px-4 py-2 rounded z-30">
                    Pilot's View Simulation
                </div>
            </div>
        </div>
    );
};

export default HPLVision;
