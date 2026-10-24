import React, { useState } from 'react';
import { Users, CheckSquare, Layers, AlertOctagon, TrendingUp, MessageSquare, Shield, Target, ArrowRight, CheckCircle2, AlertTriangle, Activity } from 'lucide-react';

const CockpitManagement: React.FC = () => {
    const [tab, setTab] = useState<'crm' | 'gradient' | 'pace' | 'group' | 'sops'>('crm');

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                        <Users className="text-sky-400" />
                        Cockpit Management &amp; CRM (040.03.04)
                    </h2>
                    <p className="text-slate-400 text-sm">
                        Crew Resource Management, Trans-Cockpit Authority Gradients, PACE Assertiveness, and SOPs.
                    </p>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-lg flex-wrap gap-1">
                    <button onClick={() => setTab('crm')} className={`px-3 py-1.5 rounded-md font-bold text-xs transition-colors ${tab === 'crm' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'}`}>Synergy &amp; CRM</button>
                    <button onClick={() => setTab('gradient')} className={`px-3 py-1.5 rounded-md font-bold text-xs transition-colors ${tab === 'gradient' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'}`}>Authority Gradient</button>
                    <button onClick={() => setTab('pace')} className={`px-3 py-1.5 rounded-md font-bold text-xs transition-colors ${tab === 'pace' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'}`}>PACE Assertiveness</button>
                    <button onClick={() => setTab('group')} className={`px-3 py-1.5 rounded-md font-bold text-xs transition-colors ${tab === 'group' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'}`}>Group Dynamics</button>
                    <button onClick={() => setTab('sops')} className={`px-3 py-1.5 rounded-md font-bold text-xs transition-colors ${tab === 'sops' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'}`}>SOPs &amp; Checklists</button>
                </div>
            </div>

            {tab === 'crm' && <SynergyLab />}
            {tab === 'gradient' && <TransCockpitAuthorityGradient />}
            {tab === 'pace' && <PaceAssertivenessLab />}
            {tab === 'group' && <GroupDynamics />}
            {tab === 'sops' && <SopTrainer />}
        </div>
    );
};

// ─── 040.03.04.03 Cooperation - Synergy ────────────────────────────
const SynergyLab = () => {
    const [quality, setQuality] = useState(50); // CRM Quality 0-100

    const pilot1 = 100;
    const pilot2 = 100;
    const synergyFactor = (quality - 50) / 50; // -1 to +1
    const output = (pilot1 + pilot2) + (synergyFactor * 50);

    const getStatus = () => {
        if (output > 210) return { label: 'SYNERGY (1 + 1 > 2)', color: 'text-emerald-400' };
        if (output < 190) return { label: 'INTERFERENCE (1 + 1 < 2)', color: 'text-red-400' };
        return { label: 'Neutral Baseline', color: 'text-slate-400' };
    };

    const status = getStatus();

    return (
        <div className="animate-in fade-in space-y-6">
            <h3 className="text-xl font-bold text-white">The Synergy Concept in Multi-Crew Cockpits</h3>

            <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                    <div className="bg-slate-900 p-5 rounded-xl border border-slate-700">
                        <label className="flex justify-between text-slate-400 text-sm mb-4">
                            <span>CRM Communication &amp; Teamwork Quality</span>
                            <span className="text-white font-bold">{quality}%</span>
                        </label>
                        <input
                            type="range" min="0" max="100"
                            value={quality} onChange={e => setQuality(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 mt-2 uppercase font-bold font-mono">
                            <span>Conflict / Authoritarian (Interference)</span>
                            <span>Cooperative Synergy (1+1 &gt; 2)</span>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 text-xs text-slate-300 space-y-2">
                        <strong className="text-white text-sm block">ATPL Definition:</strong>
                        <p>
                            <strong className="text-sky-300">Synergy</strong> is the coordinated interaction of two or more individuals 
                            such that their combined cognitive and operational performance exceeds the sum of their individual capabilities.
                        </p>
                        <p className="text-slate-400">
                            Conversely, poor communication creates <strong>Interference</strong>, where misunderstandings and friction 
                            make a two-pilot crew perform <em>worse</em> than a single pilot.
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-xl border border-slate-700 flex flex-col items-center">
                    <div className="flex gap-3 items-end mb-4 h-36">
                        <div className="w-16 bg-slate-700 rounded-t flex items-end justify-center pb-2 text-white font-bold text-xs" style={{ height: '50%' }}>
                            Capt (100)
                        </div>
                        <div className="text-slate-500 font-black text-xl mb-6">+</div>
                        <div className="w-16 bg-slate-700 rounded-t flex items-end justify-center pb-2 text-white font-bold text-xs" style={{ height: '50%' }}>
                            F/O (100)
                        </div>
                        <div className="text-slate-500 font-black text-xl mb-6">=</div>
                        <div
                            className={`w-28 rounded-t flex items-end justify-center pb-2 text-white font-black text-lg transition-all duration-300 shadow-lg ${
                                output > 200 ? 'bg-emerald-500 shadow-emerald-900/40' : output < 200 ? 'bg-red-500 shadow-red-900/40' : 'bg-sky-500 shadow-sky-900/40'
                            }`}
                            style={{ height: `${(output / 250) * 85}%` }}
                        >
                            {Math.round(output)}
                        </div>
                    </div>
                    <div className={`text-xl font-black ${status.color} transition-colors tracking-wide`}>
                        {status.label}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Trans-Cockpit Authority Gradient Simulator ────────────────────
const TransCockpitAuthorityGradient: React.FC = () => {
    // Slider: -50 (Flat / Laissez-Faire) to 0 (Optimal) to +50 (Steep / Autocratic)
    const [gradientVal, setGradientVal] = useState<number>(0);

    const getGradientType = (val: number) => {
        if (val > 20) return 'steep';
        if (val < -20) return 'flat';
        return 'optimal';
    };

    const gradientType = getGradientType(gradientVal);

    const gradientsData = {
        steep: {
            title: 'Steep Authority Gradient (Autocratic Captain)',
            badge: 'HIGH ACCIDENT RISK',
            badgeColor: 'bg-red-950 text-red-400 border-red-500/40',
            borderColor: 'border-red-500/50 bg-red-950/20',
            description: 'The Captain is authoritarian, intimidating, or overbearing. The First Officer feels subservient, intimidated, and afraid to challenge erroneous decisions.',
            cockpitDynamic: 'One-way communication from left to right. First Officer acts as passive bystander rather than active safety monitor.',
            accidentCase: 'KLM 4805 (Tenerife, 1977): The senior training captain initiated takeoff without clearance; the flight engineer and first officer hesitated to directly challenge him.',
            crmRemedy: 'Assertiveness training (PACE), psychological safety cultivation, and non-punitive speaking up policies.',
        },
        flat: {
            title: 'Flat Authority Gradient (Laissez-Faire / Friends)',
            badge: 'DISCIPLINE & DECISION RISK',
            badgeColor: 'bg-amber-950 text-amber-400 border-amber-500/40',
            borderColor: 'border-amber-500/50 bg-amber-950/20',
            description: 'Two captains of equal seniority, or close personal friends flying together. There is no clear command leadership or operational boundary.',
            cockpitDynamic: 'Informal atmosphere. Critical checklist callouts are abbreviated or skipped. Hesitation to correct mistakes for fear of offending a friend.',
            accidentCase: 'Air Florida Flight 90 (1982): Informal, casual conversation. Neither pilot took decisive leadership to abort the takeoff despite abnormal engine pressure readings.',
            crmRemedy: 'Strict adherence to SOP roles (Pilot Flying vs Pilot Monitoring) regardless of personal friendship or seniority equivalence.',
        },
        optimal: {
            title: 'Optimal / Synergistic Authority Gradient',
            badge: 'TARGET SAFETY ENVELOPE',
            badgeColor: 'bg-emerald-950 text-emerald-400 border-emerald-500/40',
            borderColor: 'border-emerald-500/50 bg-emerald-950/20',
            description: 'The Captain retains clear final command authority while fostering an open, approachable flight deck environment that explicitly encourages cross-checks and input.',
            cockpitDynamic: 'Two-way, balanced communication. First Officer speaks up proactively without fear; Captain listens, cross-checks, and makes transparent decisions.',
            accidentCase: 'United Airlines 232 (Sioux City, 1989): Captain Al Haynes utilized the full expertise of all crew members (including deadheading DC-10 instructor) to fly crippled aircraft.',
            crmRemedy: 'The gold standard of modern airline Cockpit Resource Management.',
        },
    };

    const cur = gradientsData[gradientType];

    return (
        <div className="space-y-6 animate-in fade-in">
            {/* Header */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <TrendingUp className="text-sky-400" size={22} />
                        Trans-Cockpit Authority Gradient (Edwards &amp; Hawkins)
                    </h3>
                    <span className="text-xs font-mono px-3 py-1 bg-slate-800 text-sky-400 rounded-full border border-slate-700">
                        L-L Interface Dynamic
                    </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                    The interpersonal slope between the Captain and the First Officer. 
                    If the gradient is too <strong className="text-red-400">steep</strong>, safety critical challenges are withheld. 
                    If the gradient is too <strong className="text-amber-400">flat</strong>, discipline and decisive command break down. 
                    A moderately firm, <strong className="text-emerald-400">optimal gradient</strong> maximizes crew synergy.
                </p>
            </div>

            {/* Interactive Gradient Slider */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 space-y-4">
                <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold uppercase tracking-wider">Adjust Cockpit Authority Gradient:</span>
                    <span className="font-mono text-sm font-bold text-white">
                        {gradientVal === 0 ? 'Optimal (0)' : gradientVal > 0 ? `+${gradientVal} (Steep)` : `${gradientVal} (Flat)`}
                    </span>
                </div>

                <input
                    type="range"
                    min="-50"
                    max="50"
                    value={gradientVal}
                    onChange={e => setGradientVal(Number(e.target.value))}
                    className="w-full accent-sky-500 h-2 bg-slate-700 rounded-lg cursor-pointer"
                />

                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span className="text-amber-400 font-bold">← -50 Flat (Laissez-Faire / Casual)</span>
                    <span className="text-emerald-400 font-bold">0 Optimal (Synergistic CRM)</span>
                    <span className="text-red-400 font-bold">+50 Steep (Autocratic Captain) →</span>
                </div>

                {/* Visual Flight Deck Balance Diagram */}
                <div className="relative h-28 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-around px-8 mt-4 overflow-hidden">
                    {/* Visual Fulcrum */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 border-l-4 border-r-4 border-t-8 border-transparent border-t-slate-600" />

                    {/* Left Seat: Captain */}
                    <div
                        className="flex flex-col items-center transition-all duration-300"
                        style={{ transform: `translateY(${-gradientVal * 0.5}px)` }}
                    >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-sm shadow-lg ${
                            gradientVal > 20 ? 'bg-red-600' : gradientVal < -20 ? 'bg-amber-600' : 'bg-emerald-600'
                        }`}>
                            CAPT
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 mt-1">Left Seat</span>
                    </div>

                    {/* Flow arrow */}
                    <div className="flex flex-col items-center">
                        <div className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${cur.badgeColor}`}>
                            {cur.badge}
                        </div>
                        <ArrowRight size={20} className={`mt-1 transition-transform duration-300 ${
                            gradientVal > 20 ? 'rotate-45 text-red-400' : gradientVal < -20 ? '-rotate-45 text-amber-400' : 'text-emerald-400'
                        }`} />
                    </div>

                    {/* Right Seat: First Officer */}
                    <div
                        className="flex flex-col items-center transition-all duration-300"
                        style={{ transform: `translateY(${gradientVal * 0.5}px)` }}
                    >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-sm shadow-lg ${
                            gradientVal > 20 ? 'bg-slate-700 opacity-60' : gradientVal < -20 ? 'bg-amber-600' : 'bg-emerald-600'
                        }`}>
                            F/O
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 mt-1">Right Seat</span>
                    </div>
                </div>
            </div>

            {/* Current Gradient Analysis Card */}
            <div className={`p-6 rounded-xl border-2 ${cur.borderColor} space-y-4`}>
                <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                    <h4 className="text-lg font-bold text-white">{cur.title}</h4>
                    <span className={`text-xs px-3 py-0.5 rounded-full font-bold border ${cur.badgeColor}`}>
                        {cur.badge}
                    </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{cur.description}</p>

                <div className="grid md:grid-cols-2 gap-4 text-xs pt-1">
                    <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-700/80 space-y-1">
                        <strong className="text-sky-300 block">Flight Deck Communication Dynamic:</strong>
                        <p className="text-slate-300 leading-relaxed">{cur.cockpitDynamic}</p>
                    </div>

                    <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-700/80 space-y-1">
                        <strong className="text-amber-300 block">Classic ATPL Incident / CRM Benchmark:</strong>
                        <p className="text-slate-300 leading-relaxed">{cur.accidentCase}</p>
                    </div>
                </div>

                <div className="p-3 bg-slate-900/60 rounded-lg text-xs text-slate-300 border border-slate-800">
                    <strong className="text-emerald-400">Operational Takeaway: </strong>
                    {cur.crmRemedy}
                </div>
            </div>
        </div>
    );
};

// ─── PACE Assertiveness Escalation Protocol Lab ─────────────────────
const PaceAssertivenessLab: React.FC = () => {
    const [activeStep, setActiveStep] = useState<number>(0);

    const paceSteps = [
        {
            letter: 'P',
            word: 'Probe',
            tag: 'Non-Threatening Inquiry',
            dialogue: '"Captain, have you noticed our altitude is 300 feet below profile?"',
            purpose: 'Draw the other pilot’s attention to an operational parameter without sounding accusatory or disrespectful. Allows the pilot flying to self-correct.',
            cockpitContext: 'Aircraft on final approach at night in rain. Pitching down below the ILS glideslope.',
            color: 'text-sky-400',
            badge: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
        },
        {
            letter: 'A',
            word: 'Alert',
            tag: 'Direct Factual Concern',
            dialogue: '"Captain, we are now one dot low on the glideslope with a 1,200 fpm descent rate."',
            purpose: 'State the specific, verifiable deviation clearly and objectively. Eliminates ambiguity and confirms that a hazard exists.',
            cockpitContext: 'No correction made by Captain. Rate of descent is exceeding stabilized approach criteria.',
            color: 'text-amber-400',
            badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        },
        {
            letter: 'C',
            word: 'Challenge',
            tag: 'Firm Demand for Action',
            dialogue: '"Captain, this approach is unstable. You must apply thrust and climb, or GO AROUND NOW!"',
            purpose: 'A direct command. Non-confrontational but unyielding. Requests an immediate corrective flight control input or abort.',
            cockpitContext: 'Aircraft sinking through 500 ft AGL. EGPWS warning: "GLIDESLOPE... PULL UP!"',
            color: 'text-orange-400',
            badge: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
        },
        {
            letter: 'E',
            word: 'Emergency',
            tag: 'Control Intervention & Takeover',
            dialogue: '"I HAVE CONTROL! GOING AROUND, TOGA, FLAPS 15!"',
            purpose: 'Physical takeover of controls. Used when flight safety is in immediate jeopardy and the other pilot has failed to respond to the Challenge.',
            cockpitContext: 'Passing 300 ft AGL with no corrective action. First Officer firmly places both hands on control column, disconnects autopilot, and commands max thrust.',
            color: 'text-red-400',
            badge: 'bg-red-500/20 text-red-300 border-red-500/40',
        },
    ];

    const cur = paceSteps[activeStep];

    return (
        <div className="space-y-6 animate-in fade-in">
            {/* Header */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Target className="text-sky-400" size={22} />
                        The PACE Assertiveness Escalation Protocol
                    </h3>
                    <span className="text-xs font-mono px-3 py-1 bg-slate-800 text-sky-400 rounded-full border border-slate-700">
                        CRM Challenge Model
                    </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                    In multi-crew cockpits, assertiveness is not aggression; it is the professional obligation to advocate for safety. 
                    The <strong className="text-sky-400">PACE</strong> model provides a graduated 4-step framework allowing a subordinate 
                    crew member to escalate their challenge systematically when safety boundaries are breached.
                </p>
            </div>

            {/* Stepped Selection Grid */}
            <div className="grid grid-cols-4 gap-3">
                {paceSteps.map((step, idx) => {
                    const isSelected = idx === activeStep;
                    return (
                        <button
                            key={step.letter}
                            onClick={() => setActiveStep(idx)}
                            className={`p-4 rounded-xl border text-center transition-all relative ${
                                isSelected
                                    ? 'bg-slate-800 border-sky-400 shadow-lg shadow-sky-900/30 ring-2 ring-sky-400/50'
                                    : 'bg-slate-900/80 border-slate-700 hover:border-slate-500'
                            }`}
                        >
                            <span className={`text-3xl font-black block leading-none ${step.color}`}>{step.letter}</span>
                            <span className="text-xs font-bold text-white mt-1 block">{step.word}</span>
                            <span className="text-[10px] text-slate-400 hidden sm:block mt-0.5">{step.tag}</span>
                        </button>
                    );
                })}
            </div>

            {/* Active Step Simulation Dialogue Card */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-xl text-white">
                            {cur.letter}
                        </div>
                        <div>
                            <span className={`text-xs font-mono uppercase font-bold tracking-wider ${cur.color}`}>{cur.word} — Step {activeStep + 1} of 4</span>
                            <h4 className="text-lg font-bold text-white">{cur.tag}</h4>
                        </div>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-bold border ${cur.badge}`}>
                        Level {activeStep + 1}
                    </span>
                </div>

                {/* Spoken Dialogue Box */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-[10px] font-mono uppercase text-sky-400 font-bold block">
                        🎙 First Officer Callout:
                    </span>
                    <div className="text-base font-bold text-white font-mono italic">
                        {cur.dialogue}
                    </div>
                </div>

                {/* Tactical Purpose & Cockpit Context */}
                <div className="grid sm:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700 space-y-1">
                        <strong className="text-amber-400 block font-bold">Aviation Context:</strong>
                        <p className="text-slate-300 leading-relaxed">{cur.cockpitContext}</p>
                    </div>

                    <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700 space-y-1">
                        <strong className="text-emerald-400 block font-bold">CRM Objective:</strong>
                        <p className="text-slate-300 leading-relaxed">{cur.purpose}</p>
                    </div>
                </div>

                {/* Progression Buttons */}
                <div className="flex justify-between items-center pt-2">
                    <button
                        onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
                        disabled={activeStep === 0}
                        className="px-4 py-2 rounded-lg text-xs bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40"
                    >
                        ← De-escalate
                    </button>
                    <button
                        onClick={() => setActiveStep(prev => Math.min(paceSteps.length - 1, prev + 1))}
                        disabled={activeStep === paceSteps.length - 1}
                        className="px-4 py-2 rounded-lg text-xs bg-sky-600 text-white font-bold hover:bg-sky-500 disabled:opacity-40"
                    >
                        Escalate to Next Step →
                    </button>
                </div>
            </div>

            {/* The Two-Challenge Rule */}
            <div className="p-4 bg-sky-950/40 border border-sky-500/30 rounded-xl text-xs text-slate-300 space-y-1">
                <strong className="text-sky-300 font-bold block text-sm">
                    ⚠️ The Two-Challenge Rule in Airline SOPs:
                </strong>
                <p>
                    If the Pilot Flying fails to acknowledge or correct an operational deviation after <strong className="text-white">two consecutive challenges</strong> (e.g. Probe followed by Alert/Challenge), the Pilot Monitoring must assume the Pilot Flying has become physiologically incapacitated or has lost situational awareness, and <strong className="text-red-400">must immediately take over the controls</strong>.
                </p>
            </div>
        </div>
    );
};

// ─── 040.03.04.03 Cooperation - Group Dynamics ─────────────────────
const GroupDynamics = () => {
    const [risk, setRisk] = useState(30);
    const [shiftedRisk, setShiftedRisk] = useState(30);

    const applyRiskyShift = () => {
        let shift = 0;
        if (risk > 40) shift = 25; // Push riskier
        else shift = -10; // Push safer (Cautious shift)
        setShiftedRisk(Math.min(100, Math.max(0, risk + shift)));
    };

    return (
        <div className="animate-in fade-in space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
                {/* Risky Shift */}
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                    <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="text-orange-400" /> The &quot;Risky Shift&quot;
                    </h4>
                    <p className="text-xs text-slate-400 mb-6">
                        The tendency for a group to make decisions that are more extreme than the initial inclination of its individual members.
                    </p>

                    <div className="space-y-6">
                        <div>
                            <label className="text-xs text-slate-400 uppercase font-bold block mb-2">Individual Risk Appetite</label>
                            <input
                                type="range" min="0" max="100"
                                value={risk} onChange={e => { setRisk(Number(e.target.value)); setShiftedRisk(Number(e.target.value)); }}
                                className="w-full h-2 bg-slate-700 rounded-lg accent-slate-400"
                            />
                        </div>

                        <div className="flex justify-center">
                            <button
                                onClick={applyRiskyShift}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-bold text-sm transition-colors"
                            >
                                Discuss in Group
                            </button>
                        </div>

                        <div>
                            <label className="text-xs text-slate-400 uppercase font-bold block mb-2">Group Decision</label>
                            <div className="relative h-4 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className="absolute top-0 bottom-0 w-2 bg-white transition-all duration-500"
                                    style={{ left: `${risk}%`, opacity: 0.5 }}
                                />
                                <div
                                    className={`absolute top-0 bottom-0 w-full transition-all duration-700 ${shiftedRisk > risk ? 'bg-orange-500' : 'bg-emerald-500'}`}
                                    style={{ width: `${shiftedRisk}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                                <span>Safe</span>
                                <span>Risky</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Groupthink */}
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                    <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                        <AlertOctagon className="text-red-400" /> Groupthink
                    </h4>
                    <p className="text-xs text-slate-400 mb-4">
                        A desire for harmony or conformity results in irrational or dysfunctional decision-making.
                    </p>

                    <div className="space-y-2">
                        {[
                            { title: 'Illusion of Invulnerability', desc: 'Excessive optimism encouraging risk.' },
                            { title: 'Rationalization', desc: 'Ignoring warnings or data.' },
                            { title: 'Illusion of Morality', desc: 'Believing the group is ethically right.' },
                            { title: 'Pressure to Conform', desc: 'Suppressing dissenting views.' }
                        ].map((item, i) => (
                            <div key={i} className="bg-slate-800 p-3 rounded border border-slate-600 hover:border-red-500 transition-colors cursor-help group">
                                <span className="font-bold text-slate-200 text-sm">{item.title}</span>
                                <p className="text-xs text-slate-500 mt-1 group-hover:text-slate-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── 040.03.04 Checklists & SOPs ───────────────────────────────────
const SopTrainer = () => {
    const [method, setMethod] = useState<'read-do' | 'challenge'>('read-do');

    return (
        <div className="animate-in fade-in">
            <h3 className="text-xl font-bold text-white mb-6">Checklist Philosophies</h3>

            <div className="flex justify-center gap-4 mb-8">
                <button
                    onClick={() => setMethod('read-do')}
                    className={`px-6 py-3 rounded-lg font-bold border-2 transition-all ${method === 'read-do' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
                >
                    Read-Do
                </button>
                <button
                    onClick={() => setMethod('challenge')}
                    className={`px-6 py-3 rounded-lg font-bold border-2 transition-all ${method === 'challenge' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
                >
                    Challenge-Response
                </button>
            </div>

            <div className="bg-slate-900 p-8 rounded-xl border border-slate-700 max-w-2xl mx-auto">
                {method === 'read-do' ? (
                    <div className="animate-in slide-in-from-left-4">
                        <h4 className="text-lg font-bold text-white mb-2">Read-Do Method</h4>
                        <p className="text-sm text-slate-400 mb-6">
                            Used for non-normal situations or when not in a critical phase. 
                            <strong> Read the item, then Do the action.</strong>
                        </p>
                        <div className="bg-slate-800 p-4 rounded font-mono text-sm text-yellow-400 border-l-4 border-yellow-500">
                            1. READ: &quot;Landing Gear... Down&quot;<br />
                            2. ACTION: Select Gear Down<br />
                            3. VERIFY: 3 Greens<br />
                            4. COMPLETE.
                        </div>
                    </div>
                ) : (
                    <div className="animate-in slide-in-from-right-4">
                        <h4 className="text-lg font-bold text-white mb-2">Challenge-Response</h4>
                        <p className="text-sm text-slate-400 mb-6">
                            Used for normal operations (checklists). 
                            <strong> Actions are done from memory (flow), then verified.</strong>
                        </p>
                        <div className="grid grid-cols-2 gap-4 bg-slate-800 p-4 rounded font-mono text-sm border-l-4 border-emerald-500">
                            <div className="text-right text-sky-400 pr-4 border-r border-slate-600">
                                <span className="block text-[10px] text-slate-500">PM (Pilot Monitoring)</span>
                                &quot;Landing Gear&quot;
                            </div>
                            <div className="text-left text-white pl-4">
                                <span className="block text-[10px] text-slate-500">PF (Pilot Flying)</span>
                                &quot;Down, 3 Greens&quot;
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CockpitManagement;
