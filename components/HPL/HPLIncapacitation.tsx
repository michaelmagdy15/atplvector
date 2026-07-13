
import React, { useState } from 'react';
import {
    HeartPulse,
    AlertTriangle,
    UserX,
    Wind,
    CheckCircle2,
    Volume2,
    AlertOctagon,
    ChevronRight,
    Stethoscope,
    Zap,
    Eye,
    Brain,
    ShieldCheck,
    Radio,
    Plane,
    Activity,
    Clock,
    ChevronDown,
    ArrowRight,
    BarChart3,
    Clipboard
} from 'lucide-react';
import { View } from '../../types';

interface Props {
    onNavigate: (view: View) => void;
}

/* ────────────────────────────────────────────────────────
   MAIN COMPONENT
   ──────────────────────────────────────────────────────── */
const HPLIncapacitation: React.FC<Props> = ({ onNavigate }) => {
    const [activeTab, setActiveTab] = useState<'types' | 'drill' | 'medical' | 'risks' | 'fumes'>('types');

    const tabs = [
        { id: 'types', label: 'Types & Recognition', icon: HeartPulse },
        { id: 'drill', label: 'Incapacitation Drill', icon: Clipboard },
        { id: 'medical', label: 'Medical Fitness', icon: Stethoscope },
        { id: 'risks', label: 'Risk Factors', icon: BarChart3 },
        { id: 'fumes', label: 'Fume Events', icon: Wind },
    ] as const;

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-900 via-rose-900 to-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl border border-red-700/50 relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-red-500/20 rounded-lg backdrop-blur-md border border-red-500/30">
                            <UserX className="text-red-400" size={24} />
                        </div>
                        <span className="text-red-400 font-bold tracking-widest text-xs uppercase">Learning Objective 040.02.03.05</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Incapacitation & Fumes</h1>
                    <p className="text-rose-100/80 max-w-2xl text-lg leading-relaxed">
                        Procedures for handling crew incapacitation, including the "2-Communication Rule" and recognizing subtle fume events.
                    </p>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap p-1 bg-slate-900/50 rounded-2xl border border-slate-800 backdrop-blur-sm sticky top-24 z-20 gap-1">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl transition-all duration-300 font-bold text-sm min-w-[100px] ${activeTab === tab.id
                            ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                    >
                        <tab.icon size={18} />
                        <span className="hidden lg:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[500px]">
                {activeTab === 'types' && <IncapacitationTypeComparison />}
                {activeTab === 'drill' && <IncapacitationDrill />}
                {activeTab === 'medical' && <MedicalFitnessRequirements />}
                {activeTab === 'risks' && <RiskFactorsChart />}
                {activeTab === 'fumes' && <FumesTab />}
            </div>

            {/* Footer Navigation */}
            <div className="pt-12 border-t border-slate-800 flex justify-between">
                <button
                    onClick={() => onNavigate(View.HPL_HOME)}
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"
                >
                    <div className="rotate-180 group-hover:-translate-x-1 transition-transform">
                        <ChevronRight />
                    </div>
                    Return to HPL Dashboard
                </button>
            </div>
        </div>
    );
};

/* ────────────────────────────────────────────────────────
   1. INCAPACITATION TYPE COMPARISON CARDS
   ──────────────────────────────────────────────────────── */
const IncapacitationTypeComparison = () => {
    const [expandedCard, setExpandedCard] = useState<'obvious' | 'subtle' | null>(null);
    const [twoCommsStep, setTwoCommsStep] = useState(0);

    const toggleCard = (card: 'obvious' | 'subtle') => {
        setExpandedCard(prev => prev === card ? null : card);
    };

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-white mb-2">Sudden vs Insidious Incapacitation</h2>
                <p className="text-slate-400 text-sm">Click each card to explore details</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* OBVIOUS Incapacitation Card */}
                <div
                    onClick={() => toggleCard('obvious')}
                    className={`bg-slate-900 rounded-3xl border-2 transition-all duration-500 cursor-pointer relative overflow-hidden group
                        ${expandedCard === 'obvious'
                            ? 'border-red-500 shadow-lg shadow-red-900/30'
                            : 'border-red-500/30 hover:border-red-500/60 hover:shadow-md hover:shadow-red-900/20'}`}
                >
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                        <AlertOctagon size={140} className="text-red-500" />
                    </div>

                    <div className="p-8 relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-red-500/20 rounded-xl border border-red-500/30">
                                <Zap className="text-red-400" size={28} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white">OBVIOUS</h3>
                                <p className="text-red-400 text-xs font-bold uppercase tracking-wider">Sudden Incapacitation</p>
                            </div>
                            <ChevronDown
                                size={20}
                                className={`ml-auto text-slate-500 transition-transform duration-300 ${expandedCard === 'obvious' ? 'rotate-180' : ''}`}
                            />
                        </div>

                        <p className="text-slate-400 text-sm mb-4">
                            Obvious and immediate — the pilot collapses or shows unmistakable signs.
                        </p>

                        {/* Collapsed Preview */}
                        <div className="flex gap-2 flex-wrap">
                            <span className="px-3 py-1 bg-red-900/30 border border-red-500/20 rounded-lg text-xs font-bold text-red-300">Heart Attack</span>
                            <span className="px-3 py-1 bg-red-900/30 border border-red-500/20 rounded-lg text-xs font-bold text-red-300">Seizure</span>
                            <span className="px-3 py-1 bg-red-900/30 border border-red-500/20 rounded-lg text-xs font-bold text-red-300">Stroke</span>
                        </div>

                        {/* Expanded Content */}
                        <div className={`overflow-hidden transition-all duration-500 ${expandedCard === 'obvious' ? 'max-h-[600px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
                            <div className="space-y-4">
                                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                                    <h4 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                                        <Eye size={16} className="text-red-400" />
                                        Examples & Signs
                                    </h4>
                                    <ul className="space-y-2">
                                        {['Collapse / Loss of consciousness', 'Severe pain / Convulsions', 'Slumping over controls', 'Involuntary movements / Rigidity', 'No verbal or physical response'].map((item, i) => (
                                            <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                                    <h4 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                                        <AlertTriangle size={16} className="text-amber-400" />
                                        Detection
                                    </h4>
                                    <p className="text-sm text-slate-300">
                                        <strong className="text-white">Immediately apparent.</strong> The non-flying pilot or cabin crew will notice within seconds. No special procedures needed for detection.
                                    </p>
                                </div>

                                <div className="bg-red-900/20 p-4 rounded-xl border border-red-500/30">
                                    <h4 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                                        <ShieldCheck size={16} className="text-red-400" />
                                        Immediate Response
                                    </h4>
                                    <p className="text-sm text-slate-300">
                                        "I HAVE CONTROL" → Engage AP → Move pilot away from controls → Slide seat back → Lock harness → Call cabin crew → Declare MAYDAY
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SUBTLE Incapacitation Card */}
                <div
                    onClick={() => toggleCard('subtle')}
                    className={`bg-slate-900 rounded-3xl border-2 transition-all duration-500 cursor-pointer relative overflow-hidden group
                        ${expandedCard === 'subtle'
                            ? 'border-amber-500 shadow-lg shadow-amber-900/30'
                            : 'border-amber-500/30 hover:border-amber-500/60 hover:shadow-md hover:shadow-amber-900/20'}`}
                >
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                        <UserX size={140} className="text-amber-500" />
                    </div>

                    <div className="p-8 relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/30">
                                <UserX className="text-amber-400" size={28} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white">SUBTLE</h3>
                                <p className="text-amber-400 text-xs font-bold uppercase tracking-wider">Insidious Incapacitation</p>
                            </div>
                            <ChevronDown
                                size={20}
                                className={`ml-auto text-slate-500 transition-transform duration-300 ${expandedCard === 'subtle' ? 'rotate-180' : ''}`}
                            />
                        </div>

                        <p className="text-slate-400 text-sm mb-4">
                            Dangerous because the pilot looks normal but is not functioning — hard to detect.
                        </p>

                        <div className="flex gap-2 flex-wrap">
                            <span className="px-3 py-1 bg-amber-900/30 border border-amber-500/20 rounded-lg text-xs font-bold text-amber-300">Hypoxia</span>
                            <span className="px-3 py-1 bg-amber-900/30 border border-amber-500/20 rounded-lg text-xs font-bold text-amber-300">CO Poisoning</span>
                            <span className="px-3 py-1 bg-amber-900/30 border border-amber-500/20 rounded-lg text-xs font-bold text-amber-300">Fatigue</span>
                        </div>

                        <div className={`overflow-hidden transition-all duration-500 ${expandedCard === 'subtle' ? 'max-h-[800px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
                            <div className="space-y-4">
                                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                                    <h4 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                                        <Eye size={16} className="text-amber-400" />
                                        Examples
                                    </h4>
                                    <ul className="space-y-2">
                                        {[
                                            'Hypoxia — gradual cognitive degradation',
                                            'CO poisoning — insidious onset',
                                            'Fatigue / Microsleeps — eyes open but absent',
                                            'Hypoglycaemia — low blood sugar impairment',
                                            'Medication side effects',
                                            'Spatial disorientation — unaware of unusual attitude'
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-amber-900/20 p-4 rounded-xl border border-amber-500/30">
                                    <h4 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                                        <AlertTriangle size={16} className="text-amber-400" />
                                        Why It's Dangerous
                                    </h4>
                                    <ul className="space-y-2 text-sm text-slate-300">
                                        <li>• The pilot may still be <strong className="text-white">moving and appearing normal</strong></li>
                                        <li>• They may respond but with <strong className="text-white">inappropriate actions</strong></li>
                                        <li>• More common than obvious incapacitation</li>
                                        <li>• Takes longer to recognise → delayed response</li>
                                    </ul>
                                </div>

                                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                                    <h4 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                                        <Brain size={16} className="text-amber-400" />
                                        Detection: The 2-Communication Rule
                                    </h4>
                                    <p className="text-sm text-slate-300 mb-3">
                                        If a crew member does not respond to <strong className="text-amber-400">two</strong> verbal communications, or one verbal and one significant visual/tactile stimulus, assume incapacitation.
                                    </p>
                                    <div className="flex gap-2 text-xs">
                                        <span className="px-2 py-1 bg-amber-900/40 rounded-lg text-amber-300 border border-amber-500/20">Verbal ×2</span>
                                        <span className="text-slate-500 flex items-center">or</span>
                                        <span className="px-2 py-1 bg-amber-900/40 rounded-lg text-amber-300 border border-amber-500/20">Verbal + Touch/Visual</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2-Comms Simulation */}
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
                <h3 className="text-2xl font-bold text-white mb-2">The "2-Communication Rule" Simulation</h3>
                <p className="text-slate-400 mb-6 text-sm">
                    How do you confirm insidious incapacitation? Walk through the steps below.
                </p>
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                    <TwoCommsSim step={twoCommsStep} setStep={setTwoCommsStep} />
                </div>
            </div>
        </div>
    );
};

/* ────── 2-Communication Simulation ────── */
const TwoCommsSim = ({ step, setStep }: { step: number; setStep: (s: number) => void }) => {
    const reset = () => setStep(0);

    return (
        <div className="space-y-4">
            <h4 className="font-bold text-white text-lg mb-4">Simulation</h4>

            <div className={`h-32 flex items-center justify-center rounded-xl border-2 transition-all duration-500 ${step === 4 ? 'bg-red-500/20 border-red-500' : 'bg-slate-900 border-slate-600'}`}>
                {step === 0 && <span className="text-slate-400">Pilot Flying looks fixated...</span>}
                {step === 1 && <span className="text-slate-300 animate-pulse">"Speed check?" ... (Silence)</span>}
                {step === 2 && <span className="text-amber-400 animate-pulse">"HEY! SPEED CHECK!" ... (Silence)</span>}
                {step === 3 && <span className="text-orange-500 font-bold animate-bounce">SHAKING SHOULDER ... (No Reaction)</span>}
                {step === 4 && <span className="text-red-500 font-black text-2xl animate-pulse">I HAVE CONTROL!</span>}
            </div>

            <div className="grid grid-cols-1 gap-2">
                {step === 0 && (
                    <button onClick={() => setStep(1)} className="p-3 bg-slate-700 rounded-lg text-white font-bold hover:bg-slate-600 transition-colors">
                        1. Ask Standard Callout
                    </button>
                )}
                {step === 1 && (
                    <button onClick={() => setStep(2)} className="p-3 bg-amber-700 rounded-lg text-white font-bold hover:bg-amber-600 transition-colors">
                        2. Repeat Loudly
                    </button>
                )}
                {step === 2 && (
                    <button onClick={() => setStep(3)} className="p-3 bg-orange-700 rounded-lg text-white font-bold hover:bg-orange-600 transition-colors">
                        3. Shake Shoulder
                    </button>
                )}
                {step === 3 && (
                    <button onClick={() => setStep(4)} className="p-3 bg-red-600 rounded-lg text-white font-bold hover:bg-red-500 shadow-lg shadow-red-900/50 transition-colors">
                        4. ASSUME CONTROL
                    </button>
                )}
                {step === 4 && (
                    <button onClick={reset} className="p-3 bg-slate-700 rounded-lg text-slate-300 text-sm hover:bg-slate-600 transition-colors">
                        Reset Scenario
                    </button>
                )}
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-500 uppercase font-bold mt-4">
                <span className={step >= 1 ? 'text-rose-500' : ''}>Trigger 1</span>
                <span className={step >= 2 ? 'text-rose-500' : ''}>Trigger 2</span>
                <span className={step >= 3 ? 'text-rose-500' : ''}>Action</span>
            </div>
        </div>
    );
};

/* ────────────────────────────────────────────────────────
   2. PILOT INCAPACITATION DRILL
   ──────────────────────────────────────────────────────── */
const drillSteps = [
    {
        title: 'Suspect Incapacitation',
        icon: Eye,
        color: 'amber',
        whatToDo: 'Observe pilot behaviour. Look for fixation, non-responsiveness, inappropriate actions, or slumped posture.',
        why: 'Subtle incapacitation is more common than obvious. Early detection prevents further deterioration of the flight situation.',
        whatToSay: '"Captain, how are you feeling?" — Use standard callouts to test awareness.',
    },
    {
        title: 'Confirm Incapacitation',
        icon: Volume2,
        color: 'amber',
        whatToDo: 'Apply the 2-Communication Rule: Issue two verbal challenges. If no appropriate response, apply tactile stimulus (shoulder shake).',
        why: 'Prevents premature takeover from a pilot who may simply be distracted or deep in thought.',
        whatToSay: '"Speed Check!" ... (No response) ... "HEY! SPEED CHECK!" ... (No response) → Shake shoulder.',
    },
    {
        title: 'Take Control',
        icon: ShieldCheck,
        color: 'red',
        whatToDo: 'Firmly state "I HAVE CONTROL". Press AP disconnect to ensure you are the master. Move incapacitated pilot away from controls — slide seat back, lock harness.',
        why: 'Immediate control authority prevents involuntary inputs. Securing the pilot prevents them from falling onto the yoke/side-stick.',
        whatToSay: '"I HAVE CONTROL!" — Clear, assertive, on intercom.',
    },
    {
        title: 'Engage Autopilot',
        icon: Plane,
        color: 'blue',
        whatToDo: 'Engage autopilot at current altitude and heading. Verify flight path. Cross-check instruments.',
        why: 'Reduces workload dramatically, giving you time to manage the situation. You are now single-pilot — AP is your second pair of hands.',
        whatToSay: '"Autopilot engaged, maintaining FL350, heading 270."',
    },
    {
        title: 'Communicate',
        icon: Radio,
        color: 'rose',
        whatToDo: 'Call cabin crew to the flight deck for first aid / oxygen. Declare MAYDAY to ATC. Request medical assistance on arrival.',
        why: 'Cabin crew can provide immediate first aid. ATC priority handling clears the way for expedited approach. Medical teams need time to prepare.',
        whatToSay: '"MAYDAY MAYDAY MAYDAY, [callsign], pilot incapacitation, request immediate vectors for nearest suitable airport, medical assistance required on arrival."',
    },
    {
        title: 'Decide: Divert?',
        icon: AlertTriangle,
        color: 'red',
        whatToDo: 'Assess: Can you continue to destination? Is diversion safer? Consider: distance, weather, airport facilities, fuel, passenger medical needs.',
        why: 'As single pilot, workload is high. Shorter flight = less risk. Medical help sooner = better outcome. But diverting to an unfamiliar airport has its own risks.',
        whatToSay: '"ATC, request vectors to [nearest suitable airport]. We need an airport with full emergency services and medical facilities."',
    },
];

const IncapacitationDrill = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const totalSteps = drillSteps.length;
    const step = drillSteps[currentStep];
    const progress = ((currentStep + 1) / totalSteps) * 100;

    const colorMap: Record<string, { bg: string; border: string; text: string; icon: string; progressBar: string }> = {
        amber: { bg: 'bg-amber-900/15', border: 'border-amber-500/30', text: 'text-amber-400', icon: 'text-amber-400', progressBar: 'bg-amber-500' },
        red: { bg: 'bg-red-900/15', border: 'border-red-500/30', text: 'text-red-400', icon: 'text-red-400', progressBar: 'bg-red-500' },
        blue: { bg: 'bg-blue-900/15', border: 'border-blue-500/30', text: 'text-blue-400', icon: 'text-blue-400', progressBar: 'bg-blue-500' },
        rose: { bg: 'bg-rose-900/15', border: 'border-rose-500/30', text: 'text-rose-400', icon: 'text-rose-400', progressBar: 'bg-rose-500' },
    };
    const colors = colorMap[step.color] || colorMap.amber;

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-2">
                <h2 className="text-2xl font-bold text-white mb-2">Pilot Incapacitation Drill</h2>
                <p className="text-slate-400 text-sm">Step-by-step procedure walkthrough</p>
            </div>

            {/* Progress Bar */}
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Step {currentStep + 1} of {totalSteps}
                    </span>
                    <span className="text-xs font-bold text-slate-500">{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${colors.progressBar}`}
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Step dots */}
                <div className="flex justify-between mt-4">
                    {drillSteps.map((s, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentStep(i)}
                            className={`flex flex-col items-center gap-1 group transition-all duration-300`}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 ${i === currentStep
                                ? `${colors.progressBar} text-white shadow-lg scale-110`
                                : i < currentStep
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-slate-800 text-slate-500 hover:bg-slate-700'
                                }`}>
                                {i < currentStep ? '✓' : i + 1}
                            </div>
                            <span className={`text-[9px] font-bold uppercase tracking-wider hidden md:block ${i === currentStep ? colors.text : 'text-slate-600'}`}>
                                {s.title.split(' ')[0]}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Current Step Card */}
            <div className={`${colors.bg} border ${colors.border} rounded-3xl p-8 transition-all duration-500`}>
                <div className="flex items-center gap-4 mb-6">
                    <div className={`p-4 rounded-2xl bg-slate-900/60 border ${colors.border}`}>
                        <step.icon className={colors.icon} size={32} />
                    </div>
                    <div>
                        <span className={`text-xs font-bold uppercase tracking-widest ${colors.text}`}>Step {currentStep + 1}</span>
                        <h3 className="text-2xl font-black text-white">{step.title}</h3>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-700">
                        <div className="flex items-center gap-2 mb-3">
                            <CheckCircle2 size={16} className="text-emerald-400" />
                            <h4 className="font-bold text-emerald-400 text-sm uppercase tracking-wider">What to Do</h4>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed">{step.whatToDo}</p>
                    </div>
                    <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-700">
                        <div className="flex items-center gap-2 mb-3">
                            <Brain size={16} className="text-blue-400" />
                            <h4 className="font-bold text-blue-400 text-sm uppercase tracking-wider">Why</h4>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed">{step.why}</p>
                    </div>
                    <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-700">
                        <div className="flex items-center gap-2 mb-3">
                            <Volume2 size={16} className="text-amber-400" />
                            <h4 className="font-bold text-amber-400 text-sm uppercase tracking-wider">What to Say</h4>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed italic">"{step.whatToSay}"</p>
                    </div>
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
                <button
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                    className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all duration-300 ${currentStep === 0
                        ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                        : 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700'
                        }`}
                >
                    <ChevronRight size={16} className="rotate-180" />
                    Previous
                </button>

                {currentStep < totalSteps - 1 ? (
                    <button
                        onClick={() => setCurrentStep(currentStep + 1)}
                        className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 ${colors.progressBar} text-white hover:opacity-90 transition-all duration-300 shadow-lg`}
                    >
                        Next Step
                        <ArrowRight size={16} />
                    </button>
                ) : (
                    <button
                        onClick={() => setCurrentStep(0)}
                        className="px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 bg-emerald-600 text-white hover:bg-emerald-500 transition-all duration-300 shadow-lg"
                    >
                        <CheckCircle2 size={16} />
                        Restart Drill
                    </button>
                )}
            </div>

            {/* Prevention Section */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
                    <h3 className="text-xl font-bold text-white mb-6">Prevention: One-Stomach Rule</h3>
                    <div className="flex flex-col items-center justify-center gap-6 py-4">
                        <div className="flex gap-8">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center border-4 border-slate-600 mb-2">
                                    <span className="text-2xl">🍗</span>
                                </div>
                                <p className="text-white font-bold text-sm">Captain</p>
                                <p className="text-xs text-slate-400">Chicken Meal</p>
                            </div>
                            <div className="h-20 w-[2px] bg-slate-700"></div>
                            <div className="text-center">
                                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center border-4 border-slate-600 mb-2">
                                    <span className="text-2xl">🐟</span>
                                </div>
                                <p className="text-white font-bold text-sm">First Officer</p>
                                <p className="text-xs text-slate-400">Fish Meal</p>
                            </div>
                        </div>
                        <div className="bg-emerald-900/20 border border-emerald-500/30 p-4 rounded-xl text-center w-full">
                            <h4 className="text-emerald-400 font-bold mb-1 text-sm">Why?</h4>
                            <p className="text-xs text-slate-300">
                                To prevent simultaneous incapacitation from food poisoning.
                                Meals should be consumed at different times (e.g. 1 hour apart) if possible.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 flex flex-col justify-center">
                    <h3 className="text-xl font-bold text-white mb-4">Key Fact</h3>
                    <div className="bg-rose-900/15 border border-rose-500/30 p-6 rounded-2xl">
                        <p className="text-slate-300 text-sm leading-relaxed">
                            <strong className="text-rose-400">Gastroenteritis</strong> is the most common cause of pilot incapacitation, accounting for approximately <strong className="text-white">50% of all cases</strong>. This is why the different-meal rule exists.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ────────────────────────────────────────────────────────
   3. MEDICAL FITNESS REQUIREMENTS
   ──────────────────────────────────────────────────────── */
const MedicalFitnessRequirements = () => {
    const [activeClass, setActiveClass] = useState<1 | 2>(1);
    const [expandedRow, setExpandedRow] = useState<number | null>(null);

    const classData = {
        1: {
            label: 'Class 1 Medical',
            subtitle: 'Commercial Pilots (ATPL / CPL)',
            color: 'blue',
            validity: [
                { age: 'Under 40', period: '12 months', ecg: 'Initial + every 5 years', note: 'Standard validity period for younger pilots.' },
                { age: '40–49', period: '12 months', ecg: 'Every 2 years', note: 'ECG frequency increases due to higher cardiac risk.' },
                { age: '50–59', period: '6 months', ecg: 'Annually', note: 'Medical validity halved. Annual ECG mandatory.' },
                { age: '60+', period: '6 months', ecg: 'Annually', note: 'Mandatory retirement at 65 for multi-crew. Single-pilot commercial ops cease at 60.' },
            ],
            requirements: [
                'Cardiovascular: ECG, blood pressure, lipid profile',
                'Vision: 6/9 or better each eye (correctable to 6/6)',
                'Hearing: Audiometry at initial and periodically',
                'Lung function: Spirometry at initial',
                'Neurological: Full assessment',
                'Blood/Urine: Haemoglobin, glucose, urinalysis',
                'Mental health: Assessment of psychological fitness',
            ]
        },
        2: {
            label: 'Class 2 Medical',
            subtitle: 'Private Pilots (PPL)',
            color: 'emerald',
            validity: [
                { age: 'Under 40', period: '60 months', ecg: 'Initial examination', note: 'Much longer validity for recreational pilots.' },
                { age: '40–49', period: '24 months', ecg: 'At initial + at revalidation', note: 'Reduced from 60 to 24 months at age 40.' },
                { age: '50+', period: '12 months', ecg: 'At every examination', note: 'Annual medical required from age 50 onwards.' },
            ],
            requirements: [
                'Cardiovascular: Blood pressure, resting ECG',
                'Vision: 6/12 or better each eye (correctable to 6/6)',
                'Hearing: Whispered voice test or audiometry',
                'General health: Physical examination',
                'Urinalysis: Dipstick testing',
                'Mental health: General assessment',
            ]
        }
    };

    const data = classData[activeClass];
    const isClass1 = activeClass === 1;

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-2">
                <h2 className="text-2xl font-bold text-white mb-2">Medical Fitness Requirements</h2>
                <p className="text-slate-400 text-sm">EASA medical certificate classes and age-based requirements</p>
            </div>

            {/* Class Toggle */}
            <div className="flex p-1 bg-slate-900 rounded-2xl border border-slate-800 max-w-md mx-auto">
                <button
                    onClick={() => { setActiveClass(1); setExpandedRow(null); }}
                    className={`flex-1 py-3 px-4 rounded-xl transition-all duration-300 font-bold text-sm ${activeClass === 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-400 hover:text-white'}`}
                >
                    Class 1 — ATPL/CPL
                </button>
                <button
                    onClick={() => { setActiveClass(2); setExpandedRow(null); }}
                    className={`flex-1 py-3 px-4 rounded-xl transition-all duration-300 font-bold text-sm ${activeClass === 2 ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' : 'text-slate-400 hover:text-white'}`}
                >
                    Class 2 — PPL
                </button>
            </div>

            {/* Info Card */}
            <div className={`rounded-3xl p-8 border transition-all duration-500 ${isClass1 ? 'bg-blue-900/10 border-blue-500/30' : 'bg-emerald-900/10 border-emerald-500/30'}`}>
                <div className="flex items-center gap-4 mb-6">
                    <div className={`p-3 rounded-xl ${isClass1 ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-emerald-500/20 border border-emerald-500/30'}`}>
                        <Stethoscope className={isClass1 ? 'text-blue-400' : 'text-emerald-400'} size={28} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-white">{data.label}</h3>
                        <p className={`text-xs font-bold uppercase tracking-wider ${isClass1 ? 'text-blue-400' : 'text-emerald-400'}`}>{data.subtitle}</p>
                    </div>
                </div>

                {/* Age-Based Table */}
                <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
                    <Clock size={16} className={isClass1 ? 'text-blue-400' : 'text-emerald-400'} />
                    Validity Periods by Age
                </h4>

                <div className="space-y-3 mb-8">
                    {data.validity.map((row, i) => (
                        <div key={i}>
                            <div
                                onClick={() => setExpandedRow(expandedRow === i ? null : i)}
                                className={`grid grid-cols-3 gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 border ${expandedRow === i
                                    ? `${isClass1 ? 'bg-blue-900/20 border-blue-500/30' : 'bg-emerald-900/20 border-emerald-500/30'}`
                                    : 'bg-slate-900/60 border-slate-700 hover:border-slate-600'
                                    }`}
                            >
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Age Group</p>
                                    <p className="text-white font-bold text-sm">{row.age}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Valid For</p>
                                    <p className={`font-bold text-sm ${isClass1 ? 'text-blue-400' : 'text-emerald-400'}`}>{row.period}</p>
                                </div>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">ECG Frequency</p>
                                        <p className="text-slate-300 text-sm">{row.ecg}</p>
                                    </div>
                                    <ChevronDown
                                        size={16}
                                        className={`text-slate-500 transition-transform duration-300 mt-2 ${expandedRow === i ? 'rotate-180' : ''}`}
                                    />
                                </div>
                            </div>
                            <div className={`overflow-hidden transition-all duration-300 ${expandedRow === i ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="px-4 py-3 text-sm text-slate-400 bg-slate-900/40 rounded-b-xl border-x border-b border-slate-700">
                                    {row.note}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Requirements List */}
                <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
                    <Clipboard size={16} className={isClass1 ? 'text-blue-400' : 'text-emerald-400'} />
                    Required Examinations
                </h4>
                <div className="grid md:grid-cols-2 gap-2">
                    {data.requirements.map((req, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-700">
                            <CheckCircle2 size={14} className={`shrink-0 mt-0.5 ${isClass1 ? 'text-blue-400' : 'text-emerald-400'}`} />
                            <span className="text-sm text-slate-300">{req}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Age Comparison Quick Reference */}
            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800">
                <h4 className="font-bold text-white mb-4 text-center">Quick Comparison: Class 1 vs Class 2</h4>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-700">
                                <th className="text-left py-3 px-4 text-slate-400 font-bold text-xs uppercase">Feature</th>
                                <th className="text-center py-3 px-4 text-blue-400 font-bold text-xs uppercase">Class 1</th>
                                <th className="text-center py-3 px-4 text-emerald-400 font-bold text-xs uppercase">Class 2</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-300">
                            <tr className="border-b border-slate-800">
                                <td className="py-3 px-4 font-medium">For whom</td>
                                <td className="py-3 px-4 text-center">ATPL / CPL holders</td>
                                <td className="py-3 px-4 text-center">PPL holders</td>
                            </tr>
                            <tr className="border-b border-slate-800">
                                <td className="py-3 px-4 font-medium">Max validity (under 40)</td>
                                <td className="py-3 px-4 text-center text-blue-400 font-bold">12 months</td>
                                <td className="py-3 px-4 text-center text-emerald-400 font-bold">60 months</td>
                            </tr>
                            <tr className="border-b border-slate-800">
                                <td className="py-3 px-4 font-medium">Vision standard</td>
                                <td className="py-3 px-4 text-center">6/9 each eye</td>
                                <td className="py-3 px-4 text-center">6/12 each eye</td>
                            </tr>
                            <tr className="border-b border-slate-800">
                                <td className="py-3 px-4 font-medium">ECG at 50+</td>
                                <td className="py-3 px-4 text-center">Annually</td>
                                <td className="py-3 px-4 text-center">At every exam</td>
                            </tr>
                            <tr>
                                <td className="py-3 px-4 font-medium">Stringency</td>
                                <td className="py-3 px-4 text-center">
                                    <span className="px-2 py-0.5 bg-red-900/30 text-red-400 rounded-full text-xs font-bold">Very High</span>
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <span className="px-2 py-0.5 bg-amber-900/30 text-amber-400 rounded-full text-xs font-bold">Moderate</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

/* ────────────────────────────────────────────────────────
   4. RISK FACTORS BAR CHART
   ──────────────────────────────────────────────────────── */
const riskFactors = [
    {
        name: 'Gastrointestinal',
        percentage: 50,
        color: 'bg-amber-500',
        details: 'Gastroenteritis, food poisoning, peptic ulcers. Most common cause overall. Prevented by the different-meal rule.',
        prevention: 'Different meals for crew members, eaten at different times. Avoid suspect food sources.'
    },
    {
        name: 'Cardiac',
        percentage: 18,
        color: 'bg-red-500',
        details: 'Myocardial infarction, arrhythmias, angina. Leading cause of sudden death incapacitation. Risk increases significantly over 40.',
        prevention: 'Regular ECG screening, cardiovascular fitness, avoid smoking, manage cholesterol and blood pressure.'
    },
    {
        name: 'Neurological',
        percentage: 12,
        color: 'bg-purple-500',
        details: 'Stroke, epileptic seizure, transient ischaemic attack (TIA), migraine with aura. Can be sudden or insidious.',
        prevention: 'Blood pressure management, regular neurological assessment, avoid excessive alcohol.'
    },
    {
        name: 'Vasovagal (Fainting)',
        percentage: 8,
        color: 'bg-blue-500',
        details: 'Simple faint due to blood pooling, dehydration, or emotional stress. Usually transient and self-resolving.',
        prevention: 'Stay well hydrated, regular meals, avoid prolonged standing pre-flight, manage stress.'
    },
    {
        name: 'Hypoglycaemia',
        percentage: 6,
        color: 'bg-orange-500',
        details: 'Low blood sugar causing confusion, visual disturbance, loss of coordination. Common in pilots who skip meals.',
        prevention: 'Regular meals before and during flight. Carry glucose tablets. Do not fly fasting.'
    },
    {
        name: 'Respiratory / Hypoxia',
        percentage: 4,
        color: 'bg-teal-500',
        details: 'Cabin pressurisation failure, blocked oxygen supply. Can be insidious with gradual cognitive degradation.',
        prevention: 'Monitor cabin altitude, know hypoxia symptoms, quick-don oxygen masks accessible.'
    },
    {
        name: 'Other (Renal, ENT, etc.)',
        percentage: 2,
        color: 'bg-slate-500',
        details: 'Renal colic, ear/sinus barotrauma, back pain. Painful but rarely life-threatening. Can significantly impair performance.',
        prevention: 'Pre-flight health check, avoid flying with upper respiratory infections, manage known conditions.'
    },
];

const RiskFactorsChart = () => {
    const [expandedBar, setExpandedBar] = useState<number | null>(null);

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-2">
                <h2 className="text-2xl font-bold text-white mb-2">Incapacitation Causes by Frequency</h2>
                <p className="text-slate-400 text-sm">Click any bar to see details and prevention strategies</p>
            </div>

            <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800">
                <div className="space-y-4">
                    {riskFactors.map((factor, i) => (
                        <div key={i}>
                            <div
                                onClick={() => setExpandedBar(expandedBar === i ? null : i)}
                                className={`cursor-pointer rounded-xl transition-all duration-300 p-4 border ${expandedBar === i
                                    ? 'bg-slate-800/80 border-slate-600 shadow-lg'
                                    : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${factor.color}`}></div>
                                        <span className="text-white font-bold text-sm">{factor.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-slate-400 font-mono text-sm font-bold">{factor.percentage}%</span>
                                        <ChevronDown
                                            size={16}
                                            className={`text-slate-500 transition-transform duration-300 ${expandedBar === i ? 'rotate-180' : ''}`}
                                        />
                                    </div>
                                </div>

                                {/* Bar */}
                                <div className="w-full h-6 bg-slate-900 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ease-out ${factor.color}`}
                                        style={{
                                            width: `${factor.percentage}%`,
                                            opacity: expandedBar !== null && expandedBar !== i ? 0.4 : 1,
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Expanded Details */}
                            <div className={`overflow-hidden transition-all duration-400 ${expandedBar === i ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="grid md:grid-cols-2 gap-3 px-4 py-4">
                                    <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700">
                                        <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                                            <Activity size={14} className="text-rose-400" />
                                            Details
                                        </h5>
                                        <p className="text-sm text-slate-300">{factor.details}</p>
                                    </div>
                                    <div className="bg-emerald-900/15 p-4 rounded-xl border border-emerald-500/20">
                                        <h5 className="font-bold text-emerald-400 text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                                            <ShieldCheck size={14} className="text-emerald-400" />
                                            Prevention
                                        </h5>
                                        <p className="text-sm text-slate-300">{factor.prevention}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Legend */}
                <div className="mt-8 pt-6 border-t border-slate-800">
                    <p className="text-xs text-slate-500 text-center">
                        Data represents approximate relative frequency of incapacitation causes in commercial aviation.
                        Gastrointestinal causes dominate, but cardiac events are the leading cause of <strong className="text-slate-400">fatal</strong> incapacitation.
                    </p>
                </div>
            </div>
        </div>
    );
};

/* ────────────────────────────────────────────────────────
   5. FUME EVENTS (preserved from original)
   ──────────────────────────────────────────────────────── */
const FumesTab = () => {
    return (
        <div className="grid md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <Wind className="text-slate-400" />
                    Fume Events (Toxic Air)
                </h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                    Bleed air from engines can be contaminated by pyrolyzed oil/hydraulic fluid. This contains organophosphates (nervous system toxins).
                </p>

                <div className="space-y-4">
                    <div className="bg-slate-800 p-4 rounded-xl border-l-4 border-amber-500">
                        <h4 className="font-bold text-white mb-2">Olfactory Recognition</h4>
                        <p className="text-sm text-slate-300 mb-3">Often described as:</p>
                        <div className="flex gap-2 flex-wrap">
                            <span className="px-3 py-1 bg-slate-700 rounded-lg text-xs font-bold text-amber-200">Wet Dog</span>
                            <span className="px-3 py-1 bg-slate-700 rounded-lg text-xs font-bold text-amber-200">Old Socks</span>
                            <span className="px-3 py-1 bg-slate-700 rounded-lg text-xs font-bold text-amber-200">Acrid / Metallic</span>
                        </div>
                    </div>

                    <div className="bg-slate-800 p-4 rounded-xl border-l-4 border-red-500">
                        <h4 className="font-bold text-white mb-2">Symptoms (Aerotoxic Syndrome)</h4>
                        <ul className="grid grid-cols-2 gap-2 text-xs text-slate-400 list-disc pl-4">
                            <li>Eye/Nose Irritation</li>
                            <li>Dizziness / Nausea</li>
                            <li>Blurred Vision</li>
                            <li>Tremors</li>
                            <li>Poor Concentration</li>
                            <li>Memory Impairment</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <AlertTriangle className="text-red-500" />
                    Immediate Actions
                </h3>

                <div className="relative">
                    <div className="absolute left-6 top-6 bottom-6 w-1 bg-slate-700 -z-10"></div>

                    <div className="space-y-6">
                        <div className="flex gap-4 items-center">
                            <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center font-black text-white shrink-0 shadow-lg shadow-red-900/50">1</div>
                            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex-1">
                                <h4 className="font-bold text-white">DON OXYGEN MASKS</h4>
                                <p className="text-xs text-rose-400 font-bold">100% / EMERGENCY Setting</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-center">
                            <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center font-black text-white shrink-0">2</div>
                            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex-1">
                                <h4 className="font-bold text-white">ESTABLISH COMMS</h4>
                                <p className="text-xs text-slate-400">Through mask microphone</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-center">
                            <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center font-black text-white shrink-0">3</div>
                            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex-1">
                                <h4 className="font-bold text-white">SMOKE/FUME CHECKLIST</h4>
                                <p className="text-xs text-slate-400">Isolate bleed source</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-center">
                            <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center font-black text-white shrink-0">4</div>
                            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex-1">
                                <h4 className="font-bold text-white">LAND ASAP</h4>
                                <p className="text-xs text-slate-400">Do not persist with toxic air</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HPLIncapacitation;
