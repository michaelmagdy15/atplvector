import React, { useState } from 'react';
import { Mic, CheckCircle, XCircle, BookOpen, AlertCircle, ArrowRight, RotateCcw } from 'lucide-react';

interface Scenario {
    id: number;
    category: string;
    atc: string;
    template: string;
    answers: string[];
    explanation: string;
    mandatoryItems: string[];
    omitItems?: string[];
}

const scenarios: Scenario[] = [
    {
        id: 1,
        category: 'Runway & Takeoff Clearances',
        atc: 'Fastair 345, runway 27, wind 250 degrees 12 knots, cleared for takeoff.',
        template: 'Runway {0}, cleared for takeoff, Fastair 345.',
        answers: ['27'],
        explanation: 'Runway designator and takeoff clearance MUST be read back. Wind report is advisory and must NOT be read back.',
        mandatoryItems: ['Runway 27', 'Cleared for takeoff'],
        omitItems: ['Wind 250 degrees 12 knots (Advisory only)'],
    },
    {
        id: 2,
        category: 'Level, Heading & Speed',
        atc: 'Fastair 345, climb flight level 280, turn left heading 040, maintain 250 knots.',
        template: 'Climb flight level {0}, turn left heading {1}, maintain {2} knots, Fastair 345.',
        answers: ['280', '040', '250'],
        explanation: 'All level instructions, heading changes, and speed restrictions are safety-critical and mandatory readback items.',
        mandatoryItems: ['FL 280', 'Heading 040', '250 knots'],
    },
    {
        id: 3,
        category: 'Taxi & Runway Holding Points',
        atc: 'Fastair 345, taxi via taxiway Mike, hold short of runway 28R at holding point Bravo.',
        template: 'Taxi via Mike, hold short runway {0} at {1}, Fastair 345.',
        answers: ['28R', 'Bravo'],
        explanation: 'Any instruction to hold short of, cross, or enter an active runway requires strict readback of runway designator and holding point.',
        mandatoryItems: ['Hold short runway 28R', 'Holding point Bravo'],
    },
    {
        id: 4,
        category: 'Altimeter Setting & Descent',
        atc: 'Fastair 345, descend to altitude 4000 feet, QNH 1018 hectopascals, transition level 60.',
        template: 'Descend to altitude {0} feet, QNH {1}, transition level {2}, Fastair 345.',
        answers: ['4000', '1018', '60'],
        explanation: 'Descent altitude, altimeter pressure datum (QNH), and Transition Level MUST be read back verbatim.',
        mandatoryItems: ['Altitude 4000 feet', 'QNH 1018', 'Transition level 60'],
    },
    {
        id: 5,
        category: 'SSR Squawk & 8.33 kHz Frequency',
        atc: 'Fastair 345, squawk 4215, contact London Control on channel 118.030.',
        template: 'Squawk {0}, contact London Control {1}, Fastair 345.',
        answers: ['4215', '118.030'],
        explanation: 'SSR transponder code and 8.33 kHz channel designators require mandatory readback to prevent communication failure.',
        mandatoryItems: ['Squawk 4215', 'Channel 118.030'],
    },
    {
        id: 6,
        category: 'Approach & Runway in Use',
        atc: 'Fastair 345, cleared ILS approach runway 09L, report established on the localizer.',
        template: 'Cleared ILS approach runway {0}, report established, Fastair 345.',
        answers: ['09L'],
        explanation: 'Approach clearance and active runway designator must always be read back.',
        mandatoryItems: ['Cleared ILS approach', 'Runway 09L'],
    },
    {
        id: 7,
        category: 'Airway Route Clearance',
        atc: 'Fastair 345, cleared to Frankfurt via airway L980, flight planned route, departure DOV 1R, squawk 6124.',
        template: 'Cleared to Frankfurt via L980, departure {0}, squawk {1}, Fastair 345.',
        answers: ['DOV 1R', '6124'],
        explanation: 'Route clearances, standard departure routes (SID), and squawk codes require explicit readback.',
        mandatoryItems: ['Route L980', 'SID DOV 1R', 'Squawk 6124'],
    },
    {
        id: 8,
        category: 'Information Only (Non-Readback)',
        atc: 'Fastair 345, traffic is Boeing 737 5 miles ahead crossing right to left at FL 290, braking action reported good on runway 27.',
        template: 'Traffic {0}, Fastair 345.',
        answers: ['in sight'],
        explanation: 'Traffic information and runway braking action reports are informational. Do NOT read back full sentences; reply "Traffic in sight / Looking" or callsign acknowledgment.',
        mandatoryItems: ['Callsign acknowledgment'],
        omitItems: ['Braking action report', 'Full traffic description'],
    },
];

const ReadbackChallenge: React.FC = () => {
    const [index, setIndex] = useState(0);
    const [inputs, setInputs] = useState<string[]>(['', '', '']);
    const [checked, setChecked] = useState(false);
    const [showRules, setShowRules] = useState(false);
    const [score, setScore] = useState(0);
    const [answeredCount, setAnsweredCount] = useState(0);

    const current = scenarios[index];

    const handleInput = (val: string, i: number) => {
        const newInputs = [...inputs];
        newInputs[i] = val;
        setInputs(newInputs);
    };

    const isInputCorrect = (i: number) => {
        const cleanInput = (inputs[i] || '').trim().toLowerCase();
        const expected = current.answers[i].toLowerCase();
        return cleanInput === expected;
    };

    const allCorrect = current.answers.every((_, i) => isInputCorrect(i));

    const check = () => {
        setChecked(true);
        setAnsweredCount(prev => prev + 1);
        if (allCorrect) {
            setScore(prev => prev + 1);
        }
    };

    const next = () => {
        setIndex(prev => (prev + 1) % scenarios.length);
        setInputs(['', '', '']);
        setChecked(false);
    };

    const reset = () => {
        setIndex(0);
        setInputs(['', '', '']);
        setChecked(false);
        setScore(0);
        setAnsweredCount(0);
    };

    const parts = current.template.split(/\{(\d)\}/);

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 text-white">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                        <Mic className="text-sky-400" size={28} />
                        ICAO RTF Mandatory Readback Master (090)
                    </h2>
                    <p className="text-slate-400 text-xs mt-1">
                        ICAO Annex 10 & Doc 4444 (PANS-ATM Section 12.3.1.5)
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowRules(!showRules)}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 flex items-center gap-2 transition-colors"
                    >
                        <BookOpen size={16} />
                        {showRules ? 'Hide Rules' : 'Mandatory Rules Checklist'}
                    </button>
                    <div className="bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs font-mono">
                        Score: <span className="text-emerald-400 font-bold">{score}</span> / {answeredCount}
                    </div>
                </div>
            </div>

            {/* Rules Drawer */}
            {showRules && (
                <div className="bg-slate-950 p-6 rounded-2xl border border-sky-800/40 text-xs space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                        <BookOpen size={18} />
                        ICAO Doc 4444 Mandatory Readback Checklist
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-slate-300">
                        <div className="space-y-2 bg-slate-900 p-4 rounded-xl border border-slate-800">
                            <span className="font-bold text-emerald-400 uppercase tracking-wider block">
                                MUST ALWAYS BE READ BACK:
                            </span>
                            <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                                <li><strong>Runway Instructions:</strong> Enter, land, takeoff, hold short, cross, taxi, backtrack on ANY runway</li>
                                <li><strong>Route Clearances:</strong> ATS route, SID, STAR, and revisions</li>
                                <li><strong>Runway-in-Use:</strong> Active runway assignment</li>
                                <li><strong>Altimeter Settings:</strong> QNH and QFE</li>
                                <li><strong>SSR Codes:</strong> Transponder Mode A/C/S squawk codes</li>
                                <li><strong>Levels:</strong> Altitudes, Flight Levels, height instructions</li>
                                <li><strong>Heading & Speed:</strong> Vector headings and speed constraints</li>
                                <li><strong>Transition Levels:</strong> Transition altitudes / levels</li>
                                <li><strong>Radio Channels:</strong> VHF 8.33 kHz and 25 kHz channel frequencies</li>
                            </ul>
                        </div>
                        <div className="space-y-2 bg-slate-900 p-4 rounded-xl border border-slate-800">
                            <span className="font-bold text-rose-400 uppercase tracking-wider block">
                                DO NOT READ BACK (Acknowledge with Callsign Only):
                            </span>
                            <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                                <li><strong>Surface Wind Reports:</strong> Speed and direction given with takeoff/landing</li>
                                <li><strong>Visibility & RVR:</strong> Meteorological visual ranges</li>
                                <li><strong>Temperature & Dew Point:</strong> Ambient weather numbers</li>
                                <li><strong>Runway Surface Conditions:</strong> "Braking action medium to poor"</li>
                                <li><strong>Traffic Information:</strong> Reply "Traffic in sight" or "Looking"</li>
                                <li><strong>Radar Identification:</strong> "Radar service terminated"</li>
                                <li><strong>Time Checks:</strong> Current UTC time</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Active Scenario Card */}
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 text-slate-100 shadow-xl space-y-6">
                <div className="flex justify-between items-center text-xs text-slate-400 border-b border-slate-800 pb-3">
                    <span className="bg-sky-950 text-sky-400 font-bold px-3 py-1 rounded-full border border-sky-800">
                        {current.category}
                    </span>
                    <span className="font-mono">Scenario {index + 1} of {scenarios.length}</span>
                </div>

                {/* ATC Transmission Box */}
                <div className="flex items-start gap-4 bg-slate-950 p-5 rounded-xl border border-slate-800">
                    <div className="w-10 h-10 bg-sky-950 rounded-xl border border-sky-700 flex items-center justify-center flex-shrink-0 text-sky-400">
                        <Mic size={20} />
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                            ATC Transmission
                        </div>
                        <div className="text-base md:text-lg font-mono text-emerald-300 font-medium">
                            "{current.atc}"
                        </div>
                    </div>
                </div>

                {/* Pilot Readback Challenge */}
                <div className="space-y-3">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Your Readback Transmission (Fill in the Blanks)
                    </div>
                    <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-lg md:text-xl font-mono leading-relaxed text-slate-200">
                        {parts.map((part, i) => {
                            if (/^\d$/.test(part)) {
                                const idx = parseInt(part);
                                const isCorrect = isInputCorrect(idx);
                                return (
                                    <input
                                        key={i}
                                        type="text"
                                        disabled={checked}
                                        value={inputs[idx] || ''}
                                        onChange={(e) => handleInput(e.target.value, idx)}
                                        className={`inline-block mx-1.5 px-2 py-0.5 border-b-2 text-center outline-none bg-slate-900 rounded font-bold font-mono transition-colors min-w-[90px] ${
                                            checked
                                                ? isCorrect
                                                    ? 'border-emerald-500 text-emerald-400 bg-emerald-950/30'
                                                    : 'border-rose-500 text-rose-400 bg-rose-950/30'
                                                : 'border-slate-600 focus:border-sky-400 text-white'
                                        }`}
                                        placeholder="___"
                                    />
                                );
                            }
                            return <span key={i}>{part}</span>;
                        })}
                    </div>
                </div>

                {/* Explanation and Status */}
                {checked && (
                    <div className="space-y-4 animate-in fade-in">
                        <div className={`p-4 rounded-xl border text-xs flex items-start gap-3 ${
                            allCorrect ? 'bg-emerald-950/40 border-emerald-600 text-emerald-200' : 'bg-rose-950/40 border-rose-600 text-rose-200'
                        }`}>
                            {allCorrect ? (
                                <CheckCircle size={20} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                            ) : (
                                <XCircle size={20} className="text-rose-400 flex-shrink-0 mt-0.5" />
                            )}
                            <div className="space-y-1">
                                <div className="font-bold text-sm">
                                    {allCorrect ? 'Readback Valid & Compliant!' : 'Incorrect or Incomplete Readback'}
                                </div>
                                <div>{current.explanation}</div>
                                <div className="font-mono text-[11px] text-slate-300 pt-1">
                                    Correct inputs: {current.answers.join(', ')}
                                </div>
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-3 text-xs">
                            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                                <span className="font-bold text-emerald-400 block mb-1">Mandatory Items Included:</span>
                                <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                                    {current.mandatoryItems.map((item, idx) => (
                                        <li key={idx}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                            {current.omitItems && (
                                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                                    <span className="font-bold text-rose-400 block mb-1">Correctly Omitted (Not Read Back):</span>
                                    <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                                        {current.omitItems.map((item, idx) => (
                                            <li key={idx}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-2">
                    <button
                        onClick={reset}
                        className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1.5 transition-colors"
                    >
                        <RotateCcw size={14} /> Reset Practice
                    </button>
                    {!checked ? (
                        <button
                            onClick={check}
                            className="bg-sky-600 hover:bg-sky-500 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-sky-950 transition-all flex items-center gap-2"
                        >
                            Submit Readback
                        </button>
                    ) : (
                        <button
                            onClick={next}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-emerald-950 transition-all flex items-center gap-2"
                        >
                            Next Scenario <ArrowRight size={16} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReadbackChallenge;
