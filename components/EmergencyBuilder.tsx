import React, { useState } from 'react';
import { AlertCircle, RotateCcw, ShieldAlert, CheckCircle2, XCircle, Info, Sparkles } from 'lucide-react';

interface Part {
    id: string;
    text: string;
    type: 'header-mayday' | 'header-pan' | 'station' | 'callsign' | 'type' | 'nature' | 'intentions' | 'position' | 'info' | 'distractor';
    order: number;
    description: string;
}

const emergencyComponents: Part[] = [
    { id: 'h_mayday', text: 'MAYDAY MAYDAY MAYDAY', type: 'header-mayday', order: 1, description: '1. Distress Signal (Spoken 3 times)' },
    { id: 'h_pan', text: 'PAN-PAN PAN-PAN PAN-PAN', type: 'header-pan', order: 1, description: '1. Urgency Signal (Spoken 3 times)' },
    { id: 'station', text: 'LONDON CONTROL', type: 'station', order: 2, description: '2. Station Addressed' },
    { id: 'callsign', text: 'FASTAIR 345', type: 'callsign', order: 3, description: '3. Aircraft Callsign' },
    { id: 'type', text: 'BOEING 737-800', type: 'type', order: 4, description: '4. Aircraft Type' },
    { id: 'nature_engine', text: 'DUAL ENGINE FLAMEOUT IN CLOUD', type: 'nature', order: 5, description: '5. Nature of Emergency' },
    { id: 'nature_medical', text: 'PASSENGER SUSPECTED HEART ATTACK', type: 'nature', order: 5, description: '5. Nature of Emergency' },
    { id: 'intent_glide', text: 'GLIDING, INTENDING DITCHING IN THAMES ESTUARY', type: 'intentions', order: 6, description: '6. Pilot Intentions' },
    { id: 'intent_divert', text: 'REQUEST IMMEDIATE DIVERSION AND AMBULANCE GATWICK', type: 'intentions', order: 6, description: '6. Pilot Intentions' },
    { id: 'position', text: 'POSITION 25 NM EAST OF BIGGIN HILL, FL 90, HEADING 180', type: 'position', order: 7, description: '7. Present Position, Level & Heading' },
    { id: 'info', text: '168 POB, FUEL ENDURANCE 3 HOURS', type: 'info', order: 8, description: '8. Additional Info (POB & Endurance)' },
    { id: 'distractor_squawk', text: 'TRANSPONDER IDENT BUTTON PRESSED', type: 'distractor', order: 99, description: 'Distractor (Non-ICAO phrase in voice msg)' },
    { id: 'distractor_over', text: 'OVER AND OUT', type: 'distractor', order: 99, description: 'Distractor (Prohibited RTF contradiction)' },
];

const EmergencyBuilder: React.FC = () => {
    const [mode, setMode] = useState<'mayday' | 'pan'>('mayday');
    const [built, setBuilt] = useState<Part[]>([]);
    const [evaluation, setEvaluation] = useState<{ pass: boolean; feedback: string } | null>(null);

    const filteredPool = emergencyComponents.filter(p => {
        if (mode === 'mayday') {
            if (p.type === 'header-pan' || p.id === 'nature_medical' || p.id === 'intent_divert') return false;
        } else {
            if (p.type === 'header-mayday' || p.id === 'nature_engine' || p.id === 'intent_glide') return false;
        }
        return true;
    });

    const addToMessage = (part: Part) => {
        if (!built.find(p => p.id === part.id)) {
            setBuilt([...built, part]);
            setEvaluation(null);
        }
    };

    const removeFromMessage = (partId: string) => {
        setBuilt(built.filter(p => p.id !== partId));
        setEvaluation(null);
    };

    const reset = () => {
        setBuilt([]);
        setEvaluation(null);
    };

    const handleSwitchMode = (newMode: 'mayday' | 'pan') => {
        setMode(newMode);
        setBuilt([]);
        setEvaluation(null);
    };

    const validateMessage = () => {
        if (built.length === 0) {
            setEvaluation({ pass: false, feedback: 'Message is empty. Tap components to build your call.' });
            return;
        }

        // Must not contain distractors
        if (built.some(p => p.type === 'distractor')) {
            setEvaluation({
                pass: false,
                feedback: 'Message contains invalid or non-standard RTF phrases (e.g. "OVER AND OUT" is prohibited!).',
            });
            return;
        }

        // Must start with header
        const expectedHeader = mode === 'mayday' ? 'header-mayday' : 'header-pan';
        if (built[0].type !== expectedHeader) {
            setEvaluation({
                pass: false,
                feedback: `Message must begin with the 3-fold signal: ${mode === 'mayday' ? 'MAYDAY MAYDAY MAYDAY' : 'PAN-PAN PAN-PAN PAN-PAN'}.`,
            });
            return;
        }

        // Must contain callsign, nature, intentions
        const hasCallsign = built.some(p => p.type === 'callsign');
        const hasNature = built.some(p => p.type === 'nature');
        const hasIntentions = built.some(p => p.type === 'intentions');

        if (!hasCallsign || !hasNature || !hasIntentions) {
            setEvaluation({
                pass: false,
                feedback: 'Incomplete call. Aircraft identification, nature of emergency, and pilot intentions are mandatory.',
            });
            return;
        }

        // Verify correct sequence order (strictly increasing order)
        let isSequential = true;
        for (let i = 0; i < built.length - 1; i++) {
            if (built[i].order >= built[i + 1].order) {
                isSequential = false;
                break;
            }
        }

        if (!isSequential) {
            setEvaluation({
                pass: false,
                feedback: 'Sequence error: Components are out of order according to ICAO Doc 9432. Review the standard transmission template.',
            });
            return;
        }

        setEvaluation({
            pass: true,
            feedback: 'Perfect! Transmission conforms precisely to ICAO Annex 10 & Doc 9432 emergency standards.',
        });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12 text-slate-100">
            {/* Header */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                        <AlertCircle className="text-rose-500" size={28} />
                        Emergency Transmission Builder (090)
                    </h2>
                    <p className="text-slate-400 text-xs mt-1">
                        ICAO Annex 10 & Doc 9432 Distress (MAYDAY) vs Urgency (PAN-PAN) Calls
                    </p>
                </div>
                <div className="flex gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                    <button
                        onClick={() => handleSwitchMode('mayday')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                            mode === 'mayday' ? 'bg-rose-600 text-white shadow-lg shadow-rose-950' : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        MAYDAY (Distress)
                    </button>
                    <button
                        onClick={() => handleSwitchMode('pan')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                            mode === 'pan' ? 'bg-amber-600 text-white shadow-lg shadow-amber-950' : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        PAN-PAN (Urgency)
                    </button>
                </div>
            </div>

            {/* Definitions Box */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs flex items-start gap-3">
                <Info size={18} className="text-sky-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                    <strong className="text-white block">
                        {mode === 'mayday' ? 'ICAO Distress Definition (SS Priority):' : 'ICAO Urgency Definition (DD Priority):'}
                    </strong>
                    <p className="text-slate-300">
                        {mode === 'mayday'
                            ? '"A condition of being threatened by serious and/or imminent danger and of requiring immediate assistance."'
                            : '"A condition concerning the safety of an aircraft or other vehicle, or of some person on board or within sight, but which does not require immediate assistance."'}
                    </p>
                </div>
            </div>

            {/* Builder Workspace */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Available Components Pool */}
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800 text-xs text-slate-400 uppercase font-semibold">
                        <span>Selectable Speech Fragments</span>
                        <span>Doc 9432 Order</span>
                    </div>

                    <div className="space-y-2">
                        {filteredPool.map(part => {
                            const isSelected = !!built.find(p => p.id === part.id);
                            return (
                                <button
                                    key={part.id}
                                    onClick={() => addToMessage(part)}
                                    disabled={isSelected}
                                    className={`w-full p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                                        isSelected
                                            ? 'bg-slate-950/40 border-slate-800 opacity-30 cursor-not-allowed'
                                            : 'bg-slate-950 border-slate-800 hover:border-sky-500 hover:bg-slate-800/80 text-white'
                                    }`}
                                >
                                    <div className="font-mono text-xs font-bold text-sky-300">{part.text}</div>
                                    <div className="text-[10px] text-slate-400 mt-1">{part.description}</div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Built Transmission Output */}
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-800 text-xs text-slate-400 uppercase font-semibold">
                            <span>Your Radio Transmission</span>
                            <span className="font-mono">{built.length} Segments</span>
                        </div>

                        <div className="min-h-[280px] bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                            {built.length === 0 ? (
                                <div className="h-full flex items-center justify-center text-slate-600 text-xs italic text-center py-24">
                                    Click components on the left to structure your {mode.toUpperCase()} transmission in accordance with ICAO rules.
                                </div>
                            ) : (
                                built.map((part, idx) => (
                                    <div
                                        key={part.id}
                                        onClick={() => removeFromMessage(part.id)}
                                        className="group p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-rose-500 cursor-pointer transition-all flex justify-between items-center"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">
                                                #{idx + 1}
                                            </span>
                                            <span className="font-mono text-xs font-bold text-emerald-300">
                                                {part.text}
                                            </span>
                                        </div>
                                        <span className="text-[10px] text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                            Remove ✕
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Feedback & Actions */}
                    <div className="space-y-4">
                        {evaluation && (
                            <div className={`p-4 rounded-xl border text-xs flex items-start gap-3 ${
                                evaluation.pass ? 'bg-emerald-950/40 border-emerald-600 text-emerald-200' : 'bg-rose-950/40 border-rose-600 text-rose-200'
                            }`}>
                                {evaluation.pass ? (
                                    <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                                ) : (
                                    <XCircle size={18} className="text-rose-400 flex-shrink-0 mt-0.5" />
                                )}
                                <div>
                                    <strong className="block text-sm mb-0.5">
                                        {evaluation.pass ? 'Compliant Emergency Call' : 'Format Deviation'}
                                    </strong>
                                    {evaluation.feedback}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between items-center gap-3">
                            <button
                                onClick={reset}
                                className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
                                title="Clear All"
                            >
                                <RotateCcw size={18} />
                            </button>
                            <button
                                onClick={validateMessage}
                                className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg ${
                                    mode === 'mayday'
                                        ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950'
                                        : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-950'
                                }`}
                            >
                                Transmit & Validate
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmergencyBuilder;
