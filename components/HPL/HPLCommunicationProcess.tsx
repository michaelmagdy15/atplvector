import React, { useState, useEffect } from 'react';
import { View } from '../../types';
import { ArrowLeft, User, Send, Radio, Ear, RefreshCcw, AlertTriangle, MessageSquare, Zap, Globe, Lock, BookOpen } from 'lucide-react';

interface Props {
    onNavigate: (view: View) => void;
}

const HPLCommunicationProcess: React.FC<Props> = ({ onNavigate }) => {
    const [step, setStep] = useState(0); // 0: Compose, 1: Transmitting, 2: Received
    const [originalMsg, setOriginalMsg] = useState("");
    const [receivedMsg, setReceivedMsg] = useState("");
    const [activeBarriers, setActiveBarriers] = useState<string[]>([]);

    // predefined messages
    const messages = [
        "Descent to altitude 3000 feet",
        "Turn left heading 270",
        "Clearance limit is holding point Alpha"
    ];

    const barriers = [
        { id: 'noise', label: 'Physical Noise', icon: <Zap size={16} />, effect: (msg: string) => msg.replace(/[aeiou]/g, '*') },
        { id: 'jargon', label: 'Jargon/Semantics', icon: <BookOpen size={16} />, effect: (msg: string) => msg.replace(/altitude/g, "level").replace(/heading/g, "track") },
        { id: 'bias', label: 'Expectation Bias', icon: <Lock size={16} />, effect: (msg: string) => "Climb to altitude " + (msg.match(/\d+/) || ["4000"])[0] + " feet" }, // Inverts descent/climb
        { id: 'lang', label: 'Language Barrier', icon: <Globe size={16} />, effect: (msg: string) => msg.split(' ').reverse().join(' ') } // Extreme example
    ];



    const toggleBarrier = (id: string) => {
        if (activeBarriers.includes(id)) {
            setActiveBarriers(activeBarriers.filter(b => b !== id));
        } else {
            setActiveBarriers([...activeBarriers, id]);
        }
    };

    const transmit = (msg: string) => {
        setOriginalMsg(msg);
        setStep(1);

        // Simulate transmission delay and modification
        setTimeout(() => {
            let processed = msg;

            // Apply barriers sequentially
            barriers.forEach(b => {
                if (activeBarriers.includes(b.id)) {
                    processed = b.effect(processed);
                }
            });

            setReceivedMsg(processed);
            setStep(2);
        }, 2000);
    };

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => onNavigate(View.SYLLABUS_VIEWER)}
                    className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">The Communication Loop</h1>
                    <p className="text-slate-400">040.03.04.04 Communication Process & Barriers</p>
                </div>
            </div>

            {/* Simulation Stage */}
            <div className="glass-card p-8 rounded-2xl border border-slate-700 relative overflow-hidden mb-8">
                <div className="absolute inset-0 bg-grid-slate-800/50 [mask-image:linear-gradient(0deg,transparent,black)] pointer-events-none"></div>

                {/* Visual Loop */}
                <div className="relative z-10 grid md:grid-cols-5 gap-4 items-center mb-12">
                    {/* Sender */}
                    <div className={`flex flex-col items-center gap-2 p-4 rounded-xl border ${step >= 0 ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-slate-900 border-slate-700 text-slate-500'} transition-all`}>
                        <User size={32} />
                        <span className="font-bold">Sender</span>
                        <span className="text-xs">Encoding</span>
                    </div>

                    {/* Arrow */}
                    <div className="hidden md:flex justify-center text-slate-600">
                        <ArrowRight size={24} className={step === 1 ? 'text-yellow-400 animate-pulse' : ''} />
                    </div>

                    {/* Medium / Barriers */}
                    <div className={`flex flex-col items-center gap-2 p-4 rounded-xl border ${step === 1 ? 'bg-yellow-600/20 border-yellow-500 text-yellow-400 scale-110 shadow-lg shadow-yellow-500/20' : 'bg-slate-900 border-slate-700 text-slate-500'} transition-all duration-500`}>
                        <Radio size={32} className={step === 1 ? 'animate-ping' : ''} />
                        <span className="font-bold text-center">Transmission</span>
                        <span className="text-xs text-center">{activeBarriers.length > 0 ? `${activeBarriers.length} Barriers Active` : 'Clear Channel'}</span>
                    </div>

                    {/* Arrow */}
                    <div className="hidden md:flex justify-center text-slate-600">
                        <ArrowRight size={24} className={step === 1 ? 'text-yellow-400 animate-pulse' : ''} />
                    </div>

                    {/* Receiver */}
                    <div className={`flex flex-col items-center gap-2 p-4 rounded-xl border ${step === 2 ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400' : 'bg-slate-900 border-slate-700 text-slate-500'} transition-all`}>
                        <Ear size={32} />
                        <span className="font-bold">Receiver</span>
                        <span className="text-xs">Decoding</span>
                    </div>
                </div>

                {/* Controls */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Input Side */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Send size={18} />
                            1. Select Message (Sender)
                        </h3>
                        <div className="grid gap-2">
                            {messages.map((m, i) => (
                                <button
                                    key={i}
                                    onClick={() => transmit(m)}
                                    disabled={step === 1}
                                    className="p-3 bg-slate-800 hover:bg-slate-700 text-left rounded-lg text-slate-300 text-sm font-mono border border-slate-700 transition-colors disabled:opacity-50"
                                >
                                    "{m}"
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Interference Side */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <AlertTriangle size={18} className="text-amber-500" />
                            2. Add Barriers (Noise)
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            {barriers.map(b => (
                                <button
                                    key={b.id}
                                    onClick={() => toggleBarrier(b.id)}
                                    className={`p-3 rounded-lg border text-sm font-bold flex items-center gap-2 transition-all ${activeBarriers.includes(b.id) ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-slate-900 border-slate-700 text-slate-500 hover:bg-slate-800'}`}
                                >
                                    {b.icon}
                                    {b.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Result Display */}
                {step === 2 && (
                    <div className="mt-8 bg-black/40 rounded-xl p-6 border border-slate-600 animate-in slide-in-from-bottom-2">
                        <div className="flex flex-col md:flex-row gap-8 justify-between">
                            <div className="flex-1">
                                <span className="text-xs text-slate-500 uppercase font-bold">Sent Message</span>
                                <p className="text-blue-400 font-mono text-lg mt-1">"{originalMsg}"</p>
                            </div>

                            <div className="hidden md:block w-px bg-slate-700"></div>

                            <div className="flex-1">
                                <span className="text-xs text-slate-500 uppercase font-bold">Received (Decoded)</span>
                                <p className={`font-mono text-lg mt-1 ${activeBarriers.length > 0 ? 'text-red-400' : 'text-emerald-400'}`}>"{receivedMsg}"</p>
                            </div>
                        </div>

                        {originalMsg !== receivedMsg && (
                            <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center gap-3 text-amber-400 text-sm font-bold">
                                <AlertTriangle size={16} />
                                <span>Communication Breakdown Detected! This is why "Readback" is critical.</span>
                            </div>
                        )}

                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setStep(0)}
                                className="flex items-center gap-2 px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-bold"
                            >
                                <RefreshCcw size={16} />
                                Reset Loop
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Theory Cards */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                    <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                        <MessageSquare size={18} className="text-blue-400" />
                        Explicit vs Implicit
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Aviation requires <strong>explicit</strong> communication.
                        Implicit hints ("I'm uncomfortable") are often missed under stress.
                        Always state <em>intent</em> clearly.
                    </p>
                </div>

                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                    <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                        <RefreshCcw size={18} className="text-emerald-400" />
                        Feedback Loop
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Without feedback (Readback), the sender assumes the message was received correctly.
                        This assumption is the root of many accidents (e.g. Tenerife).
                    </p>
                </div>

                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                    <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                        <Zap size={18} className="text-yellow-400" />
                        Context
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Context (Phase of Flight) changes meaning.
                        "Go ahead" means one thing on ground, another in air.
                        Standard phraseology eliminates context ambiguity.
                    </p>
                </div>
            </div>
        </div>
    );
};

// Simple ArrowRight component since it might be missing from lucide-react in some versions or I missed importing it
const ArrowRight = ({ size, className }: { size: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
);

export default HPLCommunicationProcess;
