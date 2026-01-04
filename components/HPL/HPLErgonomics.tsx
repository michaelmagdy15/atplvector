import React, { useState } from 'react';
import { Ruler, Monitor, Armchair, Eye } from 'lucide-react';

const HPLErgonomics: React.FC = () => {
    const [tab, setTab] = useState<'anthropometry' | 'dep' | 'biomechanics'>('anthropometry');

    return (
        <div className="space-y-6">
            <header className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                        <Armchair className="w-6 h-6 text-purple-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-100">Flight Deck Ergonomics</h1>
                </div>
                <p className="text-slate-400">
                    The study of people in their working environment. Matching the machine to the pilot (Hardware-Liveware).
                </p>
            </header>

            <div className="flex gap-2 bg-slate-800/50 p-1 rounded-lg">
                <button onClick={() => setTab('anthropometry')} className={`flex-1 py-2 rounded transition-colors ${tab === 'anthropometry' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}>Anthropometry</button>
                <button onClick={() => setTab('dep')} className={`flex-1 py-2 rounded transition-colors ${tab === 'dep' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}>Design Eye Position</button>
                <button onClick={() => setTab('biomechanics')} className={`flex-1 py-2 rounded transition-colors ${tab === 'biomechanics' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}>Biomechanics</button>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 min-h-[400px]">
                {tab === 'anthropometry' && <Anthropometry />}
                {tab === 'dep' && <DesignEyePosition />}
                {tab === 'biomechanics' && <Biomechanics />}
            </div>
        </div>
    );
};

const Anthropometry = () => {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">The Measurement of Man</h3>

            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <p className="text-slate-300 mb-6">
                        Cockpits cannot be custom built for every individual. They are designed to fit a specific range of the population.
                    </p>

                    <div className="bg-slate-900 mx-auto w-full h-48 rounded-lg relative flex items-end justify-center px-8 border border-slate-700 overflow-hidden">
                        {/* Gaussian Curve Visualization */}
                        <div className="absolute inset-0 flex items-end justify-center gap-1 opacity-50">
                            {[1, 2, 5, 10, 20, 35, 50, 60, 65, 60, 50, 35, 20, 10, 5, 2, 1].map((h, i) => (
                                <div key={i} className="w-4 bg-purple-500 rounded-t" style={{ height: `${h}%` }}></div>
                            ))}
                        </div>

                        <div className="z-10 w-full flex justify-between px-12 pb-2 text-xs text-white font-bold">
                            <div className="text-center">
                                <div className="w-px h-full bg-red-500 absolute top-0 bottom-0 left-[20%]"></div>
                                <span className="text-red-400">5th %ile</span>
                            </div>
                            <div className="text-center">
                                <div className="w-px h-full bg-red-500 absolute top-0 bottom-0 right-[20%]"></div>
                                <span className="text-red-400">95th %ile</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-center text-xs text-slate-400 mt-2">
                        Standard Cockpit Design Range (5th to 95th Percentile)
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-purple-900/20 border-l-4 border-purple-500 p-4 rounded-lg">
                        <h4 className="font-bold text-purple-300">The Design Philosophy</h4>
                        <p className="text-sm text-slate-300">
                            By designing for the 5th to 95th percentile, ~90% of the population is accommodated.
                            The remaining 10% (very short or very tall) may require adaptive devices (cushions) or be excluded.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-700/30 p-4 rounded-lg">
                            <h5 className="font-bold text-white text-sm">Static</h5>
                            <p className="text-xs text-slate-400 mt-1">
                                Measurements while stationary (e.g., Sitting Height, Arm Span).
                            </p>
                        </div>
                        <div className="bg-slate-700/30 p-4 rounded-lg">
                            <h5 className="font-bold text-white text-sm">Dynamic</h5>
                            <p className="text-xs text-slate-400 mt-1">
                                Measurements during movement (e.g., Functional Reach, Range of Motion).
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DesignEyePosition = () => (
    <div className="space-y-6">
        <h3 className="text-xl font-bold text-white">Design Eye Position (DEP)</h3>
        <p className="text-slate-300">
            The optimum position of the pilot's eyes to ensure:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 flex flex-col items-center text-center">
                <Monitor className="w-10 h-10 text-blue-400 mb-4" />
                <h4 className="font-bold text-slate-200">Internal Visibility</h4>
                <p className="text-xs text-slate-400 mt-2">
                    All flight instruments and warning lights are visible without head movement creating parallax errors.
                </p>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 flex flex-col items-center text-center">
                <Eye className="w-10 h-10 text-green-400 mb-4" />
                <h4 className="font-bold text-slate-200">External Visibility</h4>
                <p className="text-xs text-slate-400 mt-2">
                    Clear view of the runway during approach (cut-off angle) and traffic.
                </p>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 flex flex-col items-center text-center">
                <Armchair className="w-10 h-10 text-orange-400 mb-4" />
                <h4 className="font-bold text-slate-200">Comfort & Reach</h4>
                <p className="text-xs text-slate-400 mt-2">
                    All controls are within reach and the seating position does not cause fatigue.
                </p>
            </div>
        </div>

        <div className="bg-blue-900/20 p-6 rounded-xl border border-blue-500/30 flex items-start gap-4">
            <div className="bg-blue-500/20 p-2 rounded-full hidden md:block">
                <Ruler className="text-blue-400" />
            </div>
            <div>
                <h4 className="font-bold text-blue-300">Adjustment Procedure</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-slate-300 mt-2">
                    <li>Adjust seat height until the "balls" (alignment indicators) line up.</li>
                    <li>Ensure rudder pedals allow full travel without locking knees.</li>
                    <li>Ensure cyclic/yoke full travel does not hit legs or abdomen.</li>
                </ol>
            </div>
        </div>
    </div>
);

const Biomechanics = () => (
    <div className="space-y-6">
        <h3 className="text-xl font-bold text-white">Biomechanics & Reach</h3>

        <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h4 className="font-bold text-white mb-4">Control Types</h4>
                <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                        <div className="bg-slate-700 p-1.5 rounded text-white text-xs font-bold">Rudder</div>
                        <div>
                            <span className="text-sm font-bold text-slate-200 block">Legs/Feet</span>
                            <span className="text-xs text-slate-400">Best for large force, poor precision. Used for coarse heavy control.</span>
                        </div>
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="bg-slate-700 p-1.5 rounded text-white text-xs font-bold">Yoke/Stick</div>
                        <div>
                            <span className="text-sm font-bold text-slate-200 block">Arms/Hands</span>
                            <span className="text-xs text-slate-400">Good balance of force and precision. Optimal control range is elbow height.</span>
                        </div>
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="bg-slate-700 p-1.5 rounded text-white text-xs font-bold">Switches</div>
                        <div>
                            <span className="text-sm font-bold text-slate-200 block">Fingers</span>
                            <span className="text-xs text-slate-400">Low force, high precision. Should move "Forward/Up" for processing specific systems.</span>
                        </div>
                    </li>
                </ul>
            </div>

            <div className="space-y-6">
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-600">
                    <h5 className="font-bold text-purple-300 mb-2">Movement Stereotypes</h5>
                    <p className="text-sm text-slate-300">
                        Design must follow natural expectations to avoid error under stress.
                    </p>
                    <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                        <div className="bg-black/30 p-2 rounded text-slate-400">Clockwise</div>
                        <div className="bg-black/30 p-2 rounded text-green-400 font-bold">Increase</div>
                        <div className="bg-black/30 p-2 rounded text-slate-400">Forward</div>
                        <div className="bg-black/30 p-2 rounded text-green-400 font-bold">Go / Increase</div>
                        <div className="bg-black/30 p-2 rounded text-slate-400">Switch Up</div>
                        <div className="bg-black/30 p-2 rounded text-green-400 font-bold">On</div>
                    </div>
                </div>

                <div className="bg-white/5 p-4 rounded-lg">
                    <h5 className="font-bold text-white text-sm mb-1">Habit Capture</h5>
                    <p className="text-xs text-slate-400">
                        If a control design violates these stereotypes (e.g., a fuel switch that turns OFF when moved UP), pilots are likely to revert to the stereotype under stress, causing an accident.
                    </p>
                </div>
            </div>
        </div>
    </div>
);

export default HPLErgonomics;
