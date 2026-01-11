import React, { useState } from 'react';
import { View } from '../../types';
import { ArrowLeft, Radio, Waves, Activity, Globe, Wifi } from 'lucide-react';
import WavePropVisualizer from './WavePropVisualizer';
import SpectrumExplorer from './SpectrumExplorer';
import Modulation from './Modulation';
import IonosphereSim from './IonosphereSim';

// Placeholder imports for new components
import DopplerEffect from './DopplerEffect';
import CommsStandards from './CommsStandards';

interface Props {
    onNavigate?: (view: View) => void;
}

const RadioFundamentals: React.FC<Props> = ({ onNavigate }) => {
    const [activeSection, setActiveSection] = useState<string>('properties');

    const sections = [
        { id: 'properties', title: '1. Wave Properties', icon: Waves },
        { id: 'spectrum', title: '2. Spectrum & Bands', icon: Radio },
        { id: 'doppler', title: '3. Doppler Effect', icon: Activity },
        { id: 'modulation', title: '4. Modulation', icon: Wifi },
        { id: 'standards', title: '5. Standards', icon: Globe },
        { id: 'propagation', title: '6. Propagation', icon: Globe },
    ];

    return (
        <div className="min-h-screen bg-slate-950 pb-20">
            {/* Sticky Header */}
            <div className="sticky top-20 z-40 bg-slate-900/95 backdrop-blur-md border-b border-white/10 px-6 py-4 mb-8">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => onNavigate?.(View.RAD_NAV_HOME)}
                            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-white">Radio Navigation - Class 1</h1>
                            <p className="text-xs text-slate-400">Fundamentals & Theory</p>
                        </div>
                    </div>

                    {/* Section Nav */}
                    <div className="hidden md:flex gap-2 bg-slate-800/50 p-1 rounded-lg">
                        {sections.map(section => (
                            <button
                                key={section.id}
                                onClick={() => {
                                    setActiveSection(section.id);
                                    document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeSection === section.id
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <section.icon size={14} />
                                {section.title}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 space-y-24">

                {/* 1. Properties */}
                <section id="properties" className="scroll-mt-40 space-y-6">
                    <div className="border-l-4 border-blue-500 pl-4">
                        <h2 className="text-3xl font-bold text-white mb-2">1. Fundamental Radio Wave Properties</h2>
                        <p className="text-slate-400 text-lg">Electromagnetic radiation travelling at the speed of light.</p>
                    </div>

                    <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6">
                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <h3 className="text-lg font-bold text-sky-400 mb-4">Key Characteristics</h3>
                                <ul className="space-y-3 text-slate-300">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                        <span>
                                            <strong className="text-white">Wavelength (λ):</strong> Distance of one complete cycle.
                                            <br /><strong className="text-xs font-mono text-slate-500">λ = c / f</strong>
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                        <span>
                                            <strong className="text-white">Frequency (f):</strong> Cycles per second (Hertz).
                                            <br /><strong className="text-xs font-mono text-slate-500">f = c / λ</strong>
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                        <span>
                                            <strong className="text-white">Amplitude:</strong> Signal strength/energy.
                                        </span>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-slate-950 rounded-xl p-4 border border-white/5">
                                <h4 className="text-sm font-bold text-slate-400 mb-2 border-b border-white/10 pb-2">Speed of Light (c)</h4>
                                <div className="text-3xl font-mono text-white mb-1">3 × 10⁸ m/s</div>
                                <div className="text-sm text-slate-500">Vacuum Space</div>
                                <div className="mt-4 text-xs text-slate-400 italic">
                                    "High frequency means short wavelength. Low frequency means long wavelength."
                                </div>
                            </div>
                        </div>

                        {/* Embed Visualizer */}
                        <div className="bg-black/20 rounded-xl overflow-hidden border border-white/5">
                            <WavePropVisualizer />
                        </div>
                    </div>
                </section>

                {/* 2. Spectrum */}
                <section id="spectrum" className="scroll-mt-40 space-y-6">
                    <div className="border-l-4 border-purple-500 pl-4">
                        <h2 className="text-3xl font-bold text-white mb-2">2. Frequency Spectrum & Bands</h2>
                        <p className="text-slate-400 text-lg">Classifying radio bands from VLF to EHF.</p>
                    </div>

                    <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6">
                        <SpectrumExplorer />
                    </div>
                </section>

                {/* 3. Doppler */}
                <section id="doppler" className="scroll-mt-40 space-y-6">
                    <div className="border-l-4 border-amber-500 pl-4">
                        <h2 className="text-3xl font-bold text-white mb-2">3. The Doppler Effect</h2>
                        <p className="text-slate-400 text-lg">Apparent frequency change due to relative motion.</p>
                    </div>

                    <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6">
                        <DopplerEffect />
                    </div>
                </section>

                {/* 4. Modulation */}
                <section id="modulation" className="scroll-mt-40 space-y-6">
                    <div className="border-l-4 border-emerald-500 pl-4">
                        <h2 className="text-3xl font-bold text-white mb-2">4. Signal Modulation</h2>
                        <p className="text-slate-400 text-lg">Encoding information onto a carrier wave.</p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-6">
                        <div className="bg-slate-900/50 border border-white/10 p-6 rounded-2xl">
                            <h3 className="text-lg font-bold text-white mb-4">Modulation Types</h3>
                            <ul className="space-y-4">
                                <li className="bg-slate-800/50 p-3 rounded-lg">
                                    <div className="font-bold text-sky-400">Amplitude Modulation (AM)</div>
                                    <div className="text-sm text-slate-400">Varying amplitude. Used in VHF Comms, NDB, VOR. Prone to static interference.</div>
                                </li>
                                <li className="bg-slate-800/50 p-3 rounded-lg">
                                    <div className="font-bold text-emerald-400">Frequency Modulation (FM)</div>
                                    <div className="text-sm text-slate-400">Varying frequency. Static free. Used in some military comms and broadcast.</div>
                                </li>
                                <li className="bg-slate-800/50 p-3 rounded-lg">
                                    <div className="font-bold text-rose-400">Pulse Modulation</div>
                                    <div className="text-sm text-slate-400">Short bursts of energy. Used in Radar, DME, SSR Transponders.</div>
                                </li>
                            </ul>
                        </div>
                        <div className="bg-slate-900/50 border border-white/10 p-6 rounded-2xl">
                            <Modulation />
                        </div>
                    </div>
                </section>

                {/* 5. Standards */}
                <section id="standards" className="scroll-mt-40 space-y-6">
                    <div className="border-l-4 border-indigo-500 pl-4">
                        <h2 className="text-3xl font-bold text-white mb-2">5. Aviation Standards</h2>
                        <p className="text-slate-400 text-lg">Why AM? And ITU Classification codes.</p>
                    </div>

                    <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6">
                        <CommsStandards />
                    </div>
                </section>

                {/* 6. Propagation */}
                <section id="propagation" className="scroll-mt-40 space-y-6">
                    <div className="border-l-4 border-pink-500 pl-4">
                        <h2 className="text-3xl font-bold text-white mb-2">6. Wave Propagation</h2>
                        <p className="text-slate-400 text-lg">Ground waves, Space waves, and Ionospheric Sky waves.</p>
                    </div>

                    <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6">
                        <IonosphereSim />
                    </div>
                </section>

            </div>
        </div>
    );
};

export default RadioFundamentals;
