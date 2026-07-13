import React, { useState } from 'react';
import { Wine, AlertTriangle, Pill, Cigarette, Clock, Skull, Activity, ChevronRight, Shield, Droplets, Brain, HeartPulse, Eye, ThermometerSun, FlaskConical, Scale, Timer, CheckCircle2, XCircle, HelpCircle, ArrowRight } from 'lucide-react';

/* ──────────────────────────────────────────
   DATA
   ────────────────────────────────────────── */

interface SubstanceInfo {
    name: string;
    icon: React.ReactNode;
    color: string;
    borderColor: string;
    bgColor: string;
    riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';
    effects: string[];
    duration: string;
    impairment: string;
    icaoStance: string;
}

const SUBSTANCES: SubstanceInfo[] = [
    {
        name: 'Alcohol',
        icon: <Wine size={20} />,
        color: 'text-red-400',
        borderColor: 'border-red-500/50',
        bgColor: 'bg-red-500/10',
        riskLevel: 'EXTREME',
        effects: ['Impaired judgment & decision-making', 'Reduced reaction time', 'Loss of fine motor control', 'Degraded night vision', 'Tunnel vision at higher BAC'],
        duration: 'Metabolised at ~0.015% BAC/hour. Effects persist beyond zero BAC (hangover).',
        impairment: 'Central nervous system depressant — cognitive, psychomotor, vestibular.',
        icaoStance: 'ICAO: 0.02% BAC limit or 0.2 g/L. EASA: minimum 8h "bottle-to-throttle". Many operators require 12-24h.',
    },
    {
        name: 'Cannabis',
        icon: <Brain size={20} />,
        color: 'text-amber-400',
        borderColor: 'border-amber-500/50',
        bgColor: 'bg-amber-500/10',
        riskLevel: 'EXTREME',
        effects: ['Distorted time perception', 'Impaired short-term memory', 'Reduced coordination', 'Altered risk assessment', 'Delayed reaction time'],
        duration: 'Active: 2-6 hours. THC metabolites detectable for 30+ days. Cognitive effects can last 24-48h.',
        impairment: 'Psychomotor, cognitive, perceptual — especially tracking tasks and divided attention.',
        icaoStance: 'ICAO/EASA: Strictly prohibited. Any use is disqualifying. Random testing programmes in place.',
    },
    {
        name: 'Opioids',
        icon: <Droplets size={20} />,
        color: 'text-purple-400',
        borderColor: 'border-purple-500/50',
        bgColor: 'bg-purple-500/10',
        riskLevel: 'EXTREME',
        effects: ['Severe drowsiness & sedation', 'Respiratory depression', 'Impaired cognitive function', 'Nausea & dizziness', 'Constricted pupils (reduced light adaptation)'],
        duration: 'Codeine: 4-6h. Morphine: 4-5h. Extended release: 12-24h. Withdrawal effects can last weeks.',
        impairment: 'CNS depression — sedation, cognitive impairment, respiratory compromise at altitude.',
        icaoStance: 'ICAO/EASA: Not permitted while flying. Medical certificate suspended during treatment. Consult AME.',
    },
    {
        name: 'Stimulants',
        icon: <Activity size={20} />,
        color: 'text-blue-400',
        borderColor: 'border-blue-500/50',
        bgColor: 'bg-blue-500/10',
        riskLevel: 'HIGH',
        effects: ['False sense of alertness', 'Anxiety & agitation', 'Tremors & fine motor impairment', 'Elevated heart rate & BP', 'Crash fatigue after wearing off'],
        duration: 'Caffeine: 3-5h half-life. Amphetamines: 10-12h. Cocaine: 1-2h active, crash follows.',
        impairment: 'Sympathetic overactivation — anxiety, tremor, false confidence, post-effect fatigue crash.',
        icaoStance: 'Caffeine: permitted in moderation. Prescription stimulants: AME review needed. Illicit: strictly prohibited.',
    },
    {
        name: 'Sedatives',
        icon: <ThermometerSun size={20} />,
        color: 'text-indigo-400',
        borderColor: 'border-indigo-500/50',
        bgColor: 'bg-indigo-500/10',
        riskLevel: 'HIGH',
        effects: ['Residual drowsiness (next-day hangover)', 'Impaired reaction time', 'Reduced alertness', 'Memory lapses', 'Dizziness & balance issues'],
        duration: 'Short-acting (Zolpidem): 6-8h. Long-acting (Diazepam): 20-100h half-life. Wait period varies.',
        impairment: 'CNS depression — sedation, reduced vigilance, impaired psychomotor performance.',
        icaoStance: 'EASA: Generally not compatible with flying. Minimum waiting period after last dose. AME consultation required.',
    },
    {
        name: 'OTC Medications',
        icon: <Pill size={20} />,
        color: 'text-teal-400',
        borderColor: 'border-teal-500/50',
        bgColor: 'bg-teal-500/10',
        riskLevel: 'MODERATE',
        effects: ['Drowsiness (antihistamines)', 'Dizziness (decongestants)', 'Gastric irritation (NSAIDs)', 'Potential "reverse block" (nasal sprays)', 'Masking of warning symptoms'],
        duration: '1st-gen antihistamines: 4-6h sedation. Decongestants: 4-12h. NSAIDs: 4-8h.',
        impairment: 'Varies by type — sedation, vestibular disturbance, cardiovascular effects.',
        icaoStance: 'EASA: The underlying condition may be disqualifying. Many OTC meds allowed only when symptom-free for 24h+.',
    },
];

const HANGOVER_TIMELINE = [
    { hour: 0, label: 'Last drink', cognitive: 100, impairment: 'Fully intoxicated', effects: 'All systems impaired', color: 'bg-red-500' },
    { hour: 2, label: '2 hours', cognitive: 85, impairment: 'Heavily impaired', effects: 'Poor judgment, slow reactions, blurred vision', color: 'bg-red-500' },
    { hour: 4, label: '4 hours', cognitive: 70, impairment: 'Significantly impaired', effects: 'Reduced coordination, nausea onset', color: 'bg-red-400' },
    { hour: 6, label: '6 hours', cognitive: 55, impairment: 'Moderately impaired', effects: 'Headache begins, dehydration, fatigue', color: 'bg-orange-500' },
    { hour: 8, label: '8 hours', cognitive: 45, impairment: 'Bottle-to-Throttle limit', effects: 'Headache, nausea, poor concentration, tremor', color: 'bg-orange-400' },
    { hour: 10, label: '10 hours', cognitive: 35, impairment: 'Hangover peak', effects: 'Maximum headache, fatigue, dehydration', color: 'bg-amber-500' },
    { hour: 12, label: '12 hours', cognitive: 25, impairment: 'Moderate hangover', effects: 'Reduced alertness, mild nausea, irritability', color: 'bg-amber-400' },
    { hour: 16, label: '16 hours', cognitive: 15, impairment: 'Mild hangover', effects: 'Lingering fatigue, mild headache, reduced focus', color: 'bg-yellow-500' },
    { hour: 20, label: '20 hours', cognitive: 8, impairment: 'Residual effects', effects: 'Slight fatigue, sub-optimal performance', color: 'bg-yellow-400' },
    { hour: 24, label: '24 hours', cognitive: 3, impairment: 'Near baseline', effects: 'Most functions restored. Best practice: fully rested.', color: 'bg-emerald-400' },
];

/* ──────────────────────────────────────────
   MAIN COMPONENT
   ────────────────────────────────────────── */

const HPLToxicology: React.FC = () => {
    const [tab, setTab] = useState<'bac' | 'drugs' | 'flowchart' | 'hangover' | 'caffeine' | 'smoking'>('bac');

    const tabs = [
        { id: 'bac' as const, label: 'BAC Calculator', icon: <FlaskConical size={14} /> },
        { id: 'drugs' as const, label: 'Drug Effects', icon: <Pill size={14} /> },
        { id: 'flowchart' as const, label: 'Med Decision', icon: <Shield size={14} /> },
        { id: 'hangover' as const, label: 'Hangover', icon: <Timer size={14} /> },
        { id: 'caffeine' as const, label: 'Caffeine', icon: <Activity size={14} /> },
        { id: 'smoking' as const, label: 'Smoking', icon: <Cigarette size={14} /> },
    ];

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <Skull className="text-red-400" />
                        Toxicology (040.02.05)
                    </h2>
                    <p className="text-slate-400 text-sm">Effects of Alcohol, Drugs, and Toxic Hazards.</p>
                </div>

                <div className="flex flex-wrap bg-slate-900 p-1 rounded-lg border border-slate-800 gap-0.5">
                    {tabs.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={`px-3 py-2 rounded-md font-bold text-xs transition-all flex items-center gap-1.5 ${tab === t.id ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                        >
                            {t.icon} {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {tab === 'bac' && <BACCalculator />}
            {tab === 'drugs' && <DrugEffectsDashboard />}
            {tab === 'flowchart' && <MedicationFlowchart />}
            {tab === 'hangover' && <HangoverTimeline />}
            {tab === 'caffeine' && <CaffeineFacts />}
            {tab === 'smoking' && <SmokingCO />}
        </div>
    );
};

/* ──────────────────────────────────────────
   1. BAC CALCULATOR
   ────────────────────────────────────────── */

const BACCalculator = () => {
    const [weight, setWeight] = useState(75);       // kg
    const [drinks, setDrinks] = useState(3);         // standard drinks
    const [elapsed, setElapsed] = useState(1);       // hours
    const [gender, setGender] = useState<'male' | 'female'>('male');

    // Widmark formula: BAC = (drinks × 14g) / (weight × 1000 × r) - (0.015 × hours)
    const r = gender === 'male' ? 0.68 : 0.55;
    const alcoholGrams = drinks * 14; // 1 standard drink ≈ 14g alcohol
    const rawBAC = (alcoholGrams / (weight * 1000 * r)) * 100;
    const bac = Math.max(0, rawBAC - (0.015 * elapsed));
    const aviationLimit = 0.02;

    const getGaugeColor = (val: number) => {
        if (val <= 0) return { bg: 'bg-emerald-500', text: 'text-emerald-400', label: 'CLEAR', desc: 'No alcohol detected.' };
        if (val <= 0.02) return { bg: 'bg-emerald-500', text: 'text-emerald-400', label: 'LEGAL', desc: 'Below ICAO 0.02% limit. Ensure no residual impairment.' };
        if (val <= 0.05) return { bg: 'bg-amber-500', text: 'text-amber-400', label: 'CAUTION', desc: 'Above aviation limit. Do NOT fly.' };
        if (val <= 0.08) return { bg: 'bg-orange-500', text: 'text-orange-400', label: 'IMPAIRED', desc: 'Significant impairment to judgment and motor skills.' };
        return { bg: 'bg-red-500', text: 'text-red-400', label: 'DANGEROUS', desc: 'Severe intoxication. Life-threatening.' };
    };

    const gaugeInfo = getGaugeColor(bac);
    const gaugePercent = Math.min(100, (bac / 0.12) * 100);
    const timeToLegal = bac > aviationLimit ? Math.ceil((bac - aviationLimit) / 0.015) : 0;
    const timeToZero = bac > 0 ? Math.ceil(bac / 0.015) : 0;
    const bottleToThrottleOk = elapsed >= 8;
    const bacOk = bac <= aviationLimit;
    const canFly = bottleToThrottleOk && bacOk;

    return (
        <div className="space-y-6 animate-in fade-in">
            {/* 8-hour rule banner */}
            <div className="bg-gradient-to-r from-red-900/40 to-orange-900/30 border border-red-500/40 rounded-xl p-4 flex items-start gap-4">
                <AlertTriangle className="text-red-400 shrink-0 mt-0.5" size={22} />
                <div>
                    <h3 className="font-black text-red-300 text-sm tracking-wide">THE 8-HOUR / 0.02% RULE</h3>
                    <p className="text-xs text-slate-300 mt-1">
                        <strong>EASA/ICAO:</strong> A pilot must not fly within <strong>8 hours</strong> of consuming alcohol <em>AND</em> blood alcohol must be below <strong>0.02% (20 mg/dL)</strong>. Many operators require <strong>12-24 hours</strong>. Both conditions must be met simultaneously.
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Inputs */}
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 space-y-5">
                    <h3 className="font-bold text-white flex items-center gap-2 text-sm">
                        <Scale className="text-red-400" size={18} /> BAC Estimation (Widmark)
                    </h3>

                    {/* Gender toggle */}
                    <div className="flex gap-2">
                        {(['male', 'female'] as const).map(g => (
                            <button
                                key={g}
                                onClick={() => setGender(g)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${gender === g ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'}`}
                            >
                                {g === 'male' ? '♂ Male' : '♀ Female'}
                            </button>
                        ))}
                        <span className="text-[10px] text-slate-500 self-center ml-2">Factor (r): {r}</span>
                    </div>

                    {/* Weight */}
                    <div>
                        <label className="flex justify-between text-slate-400 text-xs mb-2">
                            <span>Body Weight</span>
                            <span className="text-white font-bold">{weight} kg ({Math.round(weight * 2.205)} lbs)</span>
                        </label>
                        <input type="range" min={45} max={140} step={1} value={weight} onChange={e => setWeight(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg accent-red-500 cursor-pointer" />
                        <div className="flex justify-between text-[10px] text-slate-600"><span>45 kg</span><span>140 kg</span></div>
                    </div>

                    {/* Drinks */}
                    <div>
                        <label className="flex justify-between text-slate-400 text-xs mb-2">
                            <span>Standard Drinks</span>
                            <span className="text-white font-bold">{drinks} {drinks === 1 ? 'drink' : 'drinks'}</span>
                        </label>
                        <input type="range" min={1} max={12} step={1} value={drinks} onChange={e => setDrinks(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg accent-orange-500 cursor-pointer" />
                        <p className="text-[10px] text-slate-500 mt-1">1 standard drink = 350 ml beer / 150 ml wine / 45 ml spirits ≈ 14 g alcohol</p>
                    </div>

                    {/* Time elapsed */}
                    <div>
                        <label className="flex justify-between text-slate-400 text-xs mb-2">
                            <span>Time Since Last Drink</span>
                            <span className="text-white font-bold">{elapsed}h</span>
                        </label>
                        <input type="range" min={0} max={24} step={0.5} value={elapsed} onChange={e => setElapsed(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg accent-blue-500 cursor-pointer" />
                        <div className="flex justify-between text-[10px] text-slate-600"><span>0h</span><span>24h</span></div>
                    </div>
                </div>

                {/* Output gauge */}
                <div className="flex flex-col gap-4">
                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 flex-1 flex flex-col items-center justify-center">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-3">Estimated BAC</p>

                        {/* Gauge bar */}
                        <div className="w-full max-w-xs mb-2">
                            <div className="relative w-full h-5 bg-slate-700 rounded-full overflow-hidden">
                                {/* Gradient background */}
                                <div className="absolute inset-0 flex">
                                    <div className="bg-emerald-600/40 h-full" style={{ width: `${(0.02 / 0.12) * 100}%` }} />
                                    <div className="bg-amber-500/40 h-full" style={{ width: `${((0.05 - 0.02) / 0.12) * 100}%` }} />
                                    <div className="bg-orange-500/40 h-full" style={{ width: `${((0.08 - 0.05) / 0.12) * 100}%` }} />
                                    <div className="bg-red-600/40 h-full flex-1" />
                                </div>
                                {/* Fill */}
                                <div className={`absolute inset-y-0 left-0 ${gaugeInfo.bg} rounded-full transition-all duration-500`} style={{ width: `${gaugePercent}%` }} />
                                {/* Aviation limit marker */}
                                <div className="absolute inset-y-0 border-r-2 border-dashed border-white/70" style={{ left: `${(0.02 / 0.12) * 100}%` }} />
                            </div>
                            <div className="flex justify-between text-[9px] text-slate-500 mt-1">
                                <span>0%</span>
                                <span className="text-white font-bold" style={{ marginLeft: `${(0.02 / 0.12) * 100 - 3}%` }}>0.02%<br />Limit</span>
                                <span>0.05%</span>
                                <span>0.08%</span>
                                <span>0.12%+</span>
                            </div>
                        </div>

                        <p className={`text-5xl font-black mt-3 tabular-nums ${gaugeInfo.text}`}>{bac.toFixed(3)}%</p>
                        <p className={`text-sm font-black mt-1 tracking-wider ${gaugeInfo.text}`}>{gaugeInfo.label}</p>
                        <p className="text-[11px] text-slate-400 text-center mt-2 max-w-xs">{gaugeInfo.desc}</p>
                    </div>

                    {/* Flight status */}
                    <div className={`rounded-xl p-4 flex items-center gap-4 border ${canFly ? 'bg-emerald-900/20 border-emerald-500/40' : 'bg-red-900/20 border-red-500/40'}`}>
                        {canFly ? <CheckCircle2 className="text-emerald-400 shrink-0" size={24} /> : <XCircle className="text-red-400 shrink-0" size={24} />}
                        <div>
                            <h4 className={`font-black text-sm ${canFly ? 'text-emerald-400' : 'text-red-400'}`}>
                                {canFly ? 'CONDITIONS MET — May Fly' : 'DO NOT FLY'}
                            </h4>
                            <div className="text-[11px] text-slate-300 mt-1 space-y-0.5">
                                <p className="flex items-center gap-1.5">
                                    {bacOk ? <CheckCircle2 size={11} className="text-emerald-400" /> : <XCircle size={11} className="text-red-400" />}
                                    BAC {bacOk ? '≤' : '>'} 0.02% ({bac.toFixed(3)}%)
                                    {!bacOk && <span className="text-red-300 ml-1">— est. {timeToLegal}h to legal</span>}
                                </p>
                                <p className="flex items-center gap-1.5">
                                    {bottleToThrottleOk ? <CheckCircle2 size={11} className="text-emerald-400" /> : <XCircle size={11} className="text-red-400" />}
                                    8-hour rule ({elapsed}h elapsed)
                                </p>
                                {bac > 0 && <p className="text-slate-400 mt-1">Time to zero BAC: ~{timeToZero}h. Add recovery time for hangover.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Educational content preserved */}
            <div className="grid md:grid-cols-3 gap-4 mt-2">
                <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-700">
                    <h4 className="text-xs font-bold text-white mb-2">Metabolic Rate</h4>
                    <p className="text-[11px] text-slate-400">Average elimination rate: ~0.015% BAC/hour. Varies with liver size, enzyme levels, and genetics. Food slows absorption but does not speed elimination.</p>
                </div>
                <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-700">
                    <h4 className="text-xs font-bold text-white mb-2">Altitude Interaction</h4>
                    <p className="text-[11px] text-slate-400">Alcohol effects are amplified at altitude due to hypoxia. Even sub-legal BAC levels can produce significant impairment in an unpressurised or depressurised cabin.</p>
                </div>
                <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-700">
                    <h4 className="text-xs font-bold text-white mb-2">Widmark Limitation</h4>
                    <p className="text-[11px] text-slate-400">This is an approximation. Actual BAC varies with food intake, hydration, medication, liver health, and individual metabolism. Never rely on calculation alone.</p>
                </div>
            </div>
        </div>
    );
};

/* ──────────────────────────────────────────
   2. DRUG EFFECTS DASHBOARD
   ────────────────────────────────────────── */

const DrugEffectsDashboard = () => {
    const [selected, setSelected] = useState<number | null>(null);

    const riskBadge = (level: string) => {
        const map: Record<string, string> = {
            LOW: 'bg-emerald-500/20 text-emerald-400',
            MODERATE: 'bg-amber-500/20 text-amber-400',
            HIGH: 'bg-orange-500/20 text-orange-400',
            EXTREME: 'bg-red-500/20 text-red-400',
        };
        return map[level] || '';
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            {/* Golden rule preserved */}
            <div className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-500/50 flex gap-3">
                <AlertTriangle className="text-yellow-500 shrink-0" />
                <p className="text-sm text-slate-300">
                    <strong>Golden Rule:</strong> If you are taking medication, you are likely not fit to fly due to the condition itself, regardless of side effects. Consult AME.
                </p>
            </div>

            {/* Cards grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {SUBSTANCES.map((sub, i) => (
                    <button
                        key={i}
                        onClick={() => setSelected(selected === i ? null : i)}
                        className={`text-left bg-slate-900 p-4 rounded-xl border transition-all duration-200 group
                            ${selected === i ? `${sub.borderColor} ring-1 ring-offset-0` : 'border-slate-700 hover:border-slate-600'}
                            ${selected === i ? sub.bgColor : ''}`}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <span className={sub.color}>{sub.icon}</span>
                                <h4 className="font-bold text-white text-sm">{sub.name}</h4>
                            </div>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded ${riskBadge(sub.riskLevel)}`}>
                                {sub.riskLevel}
                            </span>
                        </div>

                        {selected === i ? (
                            <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                <div>
                                    <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Performance Effects</h5>
                                    <ul className="mt-1 space-y-0.5">
                                        {sub.effects.map((e, j) => (
                                            <li key={j} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                                                <ChevronRight size={10} className={`${sub.color} shrink-0 mt-0.5`} /> {e}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Duration</h5>
                                    <p className="text-[11px] text-slate-300 mt-0.5">{sub.duration}</p>
                                </div>
                                <div>
                                    <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Impairment Type</h5>
                                    <p className="text-[11px] text-slate-300 mt-0.5">{sub.impairment}</p>
                                </div>
                                <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/50">
                                    <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">ICAO / EASA Stance</h5>
                                    <p className="text-[11px] text-slate-300 mt-0.5">{sub.icaoStance}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-[10px] text-slate-500 group-hover:text-slate-400 transition-colors">Click to view details →</p>
                        )}
                    </button>
                ))}
            </div>

            {/* Original medication cards preserved */}
            <div className="mt-4">
                <h3 className="font-bold text-white mb-4 text-sm">Common Medication Categories</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    {[
                        { name: 'Analgesics / Painkillers', type: 'Aspirin, Ibuprofen', effect: 'Gastric irritation, masking of pain (warning system).', risk: 'Low' },
                        { name: 'Antihistamines', type: 'Hayfever Meds', effect: 'Drowsiness, impaired performance, dizziness. Older types are Sedative.', risk: 'High' },
                        { name: 'Antibiotics', type: 'Penicillin', effect: 'Nausea, allergic reactions, intestinal issues. Short term incapacity.', risk: 'Med' },
                        { name: 'Decongestants', type: 'Nasal Sprays', effect: 'Increased heart rate, anxiety, potential for "Reverse Block" on descent.', risk: 'Med' },
                        { name: 'Stimulants', type: 'Caffeine, Amphetamines', effect: 'Anxiety, tremor, false confidence, crash after effects wear off.', risk: 'High' },
                        { name: 'Hypnotics', type: 'Sleeping Pills', effect: 'Residual drowsiness, impaired reaction time next day.', risk: 'High' }
                    ].map((drug, i) => (
                        <div key={i} className="bg-slate-900 p-4 rounded-xl border border-slate-700 hover:border-red-500/40 transition-colors group">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="font-bold text-white text-sm">{drug.name}</h4>
                                    <p className="text-[10px] text-slate-400">{drug.type}</p>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded ${drug.risk === 'High' ? 'bg-red-500/20 text-red-400' : drug.risk === 'Med' ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'}`}>
                                    {drug.risk} RISK
                                </span>
                            </div>
                            <p className="text-xs text-slate-300 mt-2 border-t border-slate-800 pt-2">
                                <span className="text-red-400 font-bold">Side Effects:</span> {drug.effect}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

/* ──────────────────────────────────────────
   3. MEDICATION DECISION FLOWCHART
   ────────────────────────────────────────── */

type FlowStep = 'start' | 'prescribed' | 'approved' | 'stable' | 'fly' | 'dontfly' | 'consultame';

const FLOW_QUESTIONS: Record<string, { question: string; yes: FlowStep; no: FlowStep; icon: React.ReactNode }> = {
    start: { question: 'Are you currently taking any medication (including OTC)?', yes: 'prescribed', no: 'fly', icon: <Pill size={20} /> },
    prescribed: { question: 'Is the medication prescribed by a doctor?', yes: 'approved', no: 'consultame', icon: <HelpCircle size={20} /> },
    approved: { question: 'Is the medication on the aviation-approved list (checked with AME)?', yes: 'stable', no: 'dontfly', icon: <Shield size={20} /> },
    stable: { question: 'Have you been on a stable dose for 7+ days with no side effects?', yes: 'fly', no: 'consultame', icon: <Clock size={20} /> },
};

const MedicationFlowchart = () => {
    const [step, setStep] = useState<FlowStep>('start');
    const [history, setHistory] = useState<FlowStep[]>([]);

    const handleAnswer = (next: FlowStep) => {
        setHistory(prev => [...prev, step]);
        setStep(next);
    };

    const reset = () => { setStep('start'); setHistory([]); };

    const goBack = () => {
        if (history.length > 0) {
            const prev = history[history.length - 1];
            setHistory(h => h.slice(0, -1));
            setStep(prev);
        }
    };

    const isTerminal = step === 'fly' || step === 'dontfly' || step === 'consultame';
    const currentQ = FLOW_QUESTIONS[step];

    const terminals: Record<string, { title: string; desc: string; color: string; bgColor: string; icon: React.ReactNode }> = {
        fly: {
            title: '✅ FIT TO FLY',
            desc: 'Based on your answers, you appear fit to fly. However, always self-assess for any side effects before each flight and report changes to your AME.',
            color: 'text-emerald-400', bgColor: 'bg-emerald-900/20 border-emerald-500/40',
            icon: <CheckCircle2 size={32} className="text-emerald-400" />,
        },
        dontfly: {
            title: '❌ DO NOT FLY',
            desc: 'The medication you are taking is not approved for flight operations. You must not fly until cleared by your Aviation Medical Examiner (AME).',
            color: 'text-red-400', bgColor: 'bg-red-900/20 border-red-500/40',
            icon: <XCircle size={32} className="text-red-400" />,
        },
        consultame: {
            title: '⚠️ CONSULT YOUR AME',
            desc: 'Your situation requires evaluation by an Aviation Medical Examiner. Do not self-clear. Bring your medication list and dosage information to the consultation.',
            color: 'text-amber-400', bgColor: 'bg-amber-900/20 border-amber-500/40',
            icon: <HelpCircle size={32} className="text-amber-400" />,
        },
    };

    // Progress indicator
    const stepIndex = history.length;
    const totalSteps = 4;

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="max-w-2xl mx-auto">
                {/* Progress bar */}
                <div className="flex items-center gap-2 mb-6">
                    {Array.from({ length: totalSteps }).map((_, i) => (
                        <div key={i} className="flex-1 flex items-center gap-1">
                            <div className={`h-1.5 rounded-full flex-1 transition-colors duration-300 ${i <= stepIndex ? (isTerminal ? (step === 'fly' ? 'bg-emerald-500' : step === 'dontfly' ? 'bg-red-500' : 'bg-amber-500') : 'bg-red-500') : 'bg-slate-700'}`} />
                        </div>
                    ))}
                </div>

                {!isTerminal && currentQ ? (
                    <div className="bg-slate-900 rounded-xl border border-slate-700 p-8 text-center">
                        <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-5 text-red-400">
                            {currentQ.icon}
                        </div>
                        <h3 className="text-lg font-bold text-white mb-6">{currentQ.question}</h3>
                        <div className="flex items-center justify-center gap-4">
                            <button onClick={() => handleAnswer(currentQ.yes)}
                                className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all hover:scale-105 shadow-lg shadow-emerald-600/20">
                                Yes
                            </button>
                            <button onClick={() => handleAnswer(currentQ.no)}
                                className="px-8 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-all hover:scale-105 shadow-lg shadow-red-600/20">
                                No
                            </button>
                        </div>
                        {history.length > 0 && (
                            <button onClick={goBack} className="mt-4 text-xs text-slate-500 hover:text-slate-300 transition-colors">← Go Back</button>
                        )}
                    </div>
                ) : (
                    <div className={`rounded-xl border p-8 text-center ${terminals[step]?.bgColor}`}>
                        <div className="flex justify-center mb-4">{terminals[step]?.icon}</div>
                        <h3 className={`text-xl font-black mb-3 ${terminals[step]?.color}`}>{terminals[step]?.title}</h3>
                        <p className="text-sm text-slate-300 max-w-md mx-auto">{terminals[step]?.desc}</p>
                        <button onClick={reset}
                            className="mt-6 px-6 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition-colors">
                            Start Over
                        </button>
                    </div>
                )}

                {/* Path visualisation */}
                {history.length > 0 && (
                    <div className="mt-6 flex items-center gap-2 justify-center flex-wrap">
                        {history.map((h, i) => (
                            <React.Fragment key={i}>
                                <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-400 border border-slate-700">
                                    {FLOW_QUESTIONS[h]?.question.split('?')[0].split('(')[0].trim().slice(0, 30)}…
                                </span>
                                <ArrowRight size={10} className="text-slate-600" />
                            </React.Fragment>
                        ))}
                        <span className={`text-[10px] px-2 py-1 rounded font-bold ${isTerminal ? (step === 'fly' ? 'bg-emerald-500/20 text-emerald-400' : step === 'dontfly' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400') : 'bg-red-500/20 text-red-400'}`}>
                            {isTerminal ? terminals[step]?.title : 'Current'}
                        </span>
                    </div>
                )}
            </div>

            {/* Educational note */}
            <div className="bg-slate-900/50 rounded-lg border border-slate-700 p-4 max-w-2xl mx-auto">
                <p className="text-[11px] text-slate-400">
                    <strong className="text-slate-300">Remember:</strong> The underlying medical condition is often more disqualifying than the medication itself. Even if a drug is "approved," the illness it treats may ground you. Always consult your AME before flying on any medication.
                </p>
            </div>
        </div>
    );
};

/* ──────────────────────────────────────────
   4. HANGOVER EFFECTS TIMELINE
   ────────────────────────────────────────── */

const HangoverTimeline = () => {
    const [selectedHour, setSelectedHour] = useState(8);

    // Find nearest data point
    const nearest = HANGOVER_TIMELINE.reduce((prev, curr) =>
        Math.abs(curr.hour - selectedHour) <= Math.abs(prev.hour - selectedHour) ? curr : prev
    );

    const impairmentPct = nearest.cognitive;

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="grid md:grid-cols-5 gap-6">
                {/* Timeline slider — spans 3 cols */}
                <div className="md:col-span-3 bg-slate-900 p-6 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-white mb-1 flex items-center gap-2 text-sm">
                        <Clock className="text-orange-400" size={18} /> Hangover Impairment Timeline
                    </h3>
                    <p className="text-[11px] text-slate-500 mb-6">After heavy alcohol consumption (6+ standard drinks). Drag the slider to explore.</p>

                    {/* Slider */}
                    <div>
                        <label className="flex justify-between text-slate-400 text-xs mb-2">
                            <span>Hours After Last Drink</span>
                            <span className="text-white font-bold text-base">{selectedHour}h</span>
                        </label>
                        <input type="range" min={0} max={24} step={1} value={selectedHour} onChange={e => setSelectedHour(Number(e.target.value))}
                            className="w-full h-2.5 bg-slate-700 rounded-lg accent-orange-500 cursor-pointer" />
                        <div className="flex justify-between text-[10px] text-slate-600 mt-1">
                            <span>0h (intoxicated)</span>
                            <span className="text-red-400 font-bold">8h min</span>
                            <span>12h</span>
                            <span>24h (safe)</span>
                        </div>
                    </div>

                    {/* Impairment bar chart */}
                    <div className="mt-6 space-y-1.5">
                        {HANGOVER_TIMELINE.map((point, i) => (
                            <div key={i} className={`flex items-center gap-3 transition-all duration-200 ${point.hour === nearest.hour ? 'scale-[1.02]' : 'opacity-60'}`}>
                                <span className="text-[10px] text-slate-400 w-8 text-right font-mono">{point.hour}h</span>
                                <div className="flex-1 h-4 bg-slate-800 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full transition-all duration-500 ${point.color}`}
                                        style={{ width: `${point.cognitive}%` }} />
                                </div>
                                <span className="text-[10px] text-slate-400 w-8 font-mono">{point.cognitive}%</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-[10px] text-slate-600 mt-2 text-center">Bar = Residual impairment level (higher = worse)</p>
                </div>

                {/* Status panel — 2 cols */}
                <div className="md:col-span-2 flex flex-col gap-4">
                    {/* Current status */}
                    <div className={`bg-slate-900 p-6 rounded-xl border flex-1 ${selectedHour < 8 ? 'border-red-500/40' : selectedHour < 12 ? 'border-orange-500/40' : selectedHour < 20 ? 'border-amber-500/40' : 'border-emerald-500/40'}`}>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Status at {selectedHour}h</p>
                        <p className={`text-2xl font-black ${selectedHour < 8 ? 'text-red-400' : selectedHour < 12 ? 'text-orange-400' : selectedHour < 20 ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {nearest.impairment}
                        </p>

                        {/* Impairment gauge */}
                        <div className="mt-4 mb-3">
                            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full transition-all duration-500 ${nearest.color}`}
                                    style={{ width: `${impairmentPct}%` }} />
                            </div>
                            <div className="flex justify-between text-[9px] text-slate-500 mt-1">
                                <span>No impairment</span>
                                <span className="font-bold">{impairmentPct}% impaired</span>
                            </div>
                        </div>

                        <div className="bg-slate-800/60 p-3 rounded-lg mt-3">
                            <h5 className="text-[10px] font-bold text-slate-500 uppercase">Cognitive Effects</h5>
                            <p className="text-xs text-slate-300 mt-1">{nearest.effects}</p>
                        </div>

                        <div className="mt-4 flex items-center gap-2">
                            {selectedHour < 8 ? (
                                <span className="flex items-center gap-1.5 text-xs font-bold text-red-400">
                                    <XCircle size={14} /> Below 8-hour minimum
                                </span>
                            ) : selectedHour < 24 ? (
                                <span className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                                    <AlertTriangle size={14} /> Legal minimum met — assess fitness
                                </span>
                            ) : (
                                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                                    <CheckCircle2 size={14} /> Best practice met — 24h elapsed
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Affected systems */}
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                        <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Systems Affected</h5>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { label: 'Reaction Time', icon: <Activity size={12} />, threshold: 16 },
                                { label: 'Decision Making', icon: <Brain size={12} />, threshold: 20 },
                                { label: 'Visual Acuity', icon: <Eye size={12} />, threshold: 12 },
                                { label: 'Balance/Vestibular', icon: <HeartPulse size={12} />, threshold: 10 },
                            ].map((sys, i) => {
                                const impaired = selectedHour < sys.threshold;
                                return (
                                    <div key={i} className={`p-2 rounded-lg text-[10px] flex items-center gap-1.5 border transition-colors ${impaired ? 'bg-red-900/10 border-red-500/30 text-red-300' : 'bg-emerald-900/10 border-emerald-500/30 text-emerald-300'}`}>
                                        {sys.icon} {sys.label}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ──────────────────────────────────────────
   ORIGINAL: CAFFEINE FACTS (preserved)
   ────────────────────────────────────────── */

const CaffeineFacts = () => (
    <div className="animate-in fade-in grid md:grid-cols-2 gap-8">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="text-blue-400" /> Caffeine (Stimulant)
            </h3>
            <p className="text-xs text-slate-400 mb-4">Found in coffee, tea, cola, and some over-the-counter drugs.</p>

            <div className="space-y-4">
                <div className="bg-slate-800 p-3 rounded border-l-4 border-blue-500">
                    <h4 className="text-xs font-bold text-white">Desired Effects</h4>
                    <p className="text-[10px] text-slate-400">Temporary increase in alertness, reduced feeling of fatigue.</p>
                </div>
                <div className="bg-red-900/10 p-3 rounded border-l-4 border-red-500">
                    <h4 className="text-xs font-bold text-red-400">Negatives / Overdose</h4>
                    <p className="text-[10px] text-slate-300">Nervousness, tremor, heart palpitations, insomnia. Impairs fine motor control.</p>
                </div>
            </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
            <h3 className="font-bold text-white mb-4">Withdrawal & Aviation</h3>
            <div className="space-y-4">
                <p className="text-xs text-slate-400">Regular users build tolerance. Stopping abruptly causes <strong>Withdrawal Symptoms:</strong></p>
                <ul className="text-[11px] text-slate-300 space-y-1 ml-4 list-disc">
                    <li>Severe headaches</li>
                    <li>Irritability</li>
                    <li>Excessive fatigue</li>
                </ul>
                <div className="bg-yellow-900/10 p-3 rounded border border-yellow-500/30">
                    <p className="text-[10px] text-yellow-200"><strong>Note:</strong> Caffeine is a diuretic. It increases urine production, contributing to <strong>dehydration</strong> in the dry cabin environment.</p>
                </div>
            </div>
        </div>
    </div>
);

/* ──────────────────────────────────────────
   ORIGINAL: SMOKING & CO (preserved)
   ────────────────────────────────────────── */

const SmokingCO = () => {
    return (
        <div className="animate-in slide-in-from-right-4 grid md:grid-cols-2 gap-8">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <Cigarette className="text-slate-400" /> Smoking Effects
                </h3>

                <div className="space-y-4">
                    <div className="bg-slate-800 p-4 rounded-lg">
                        <h4 className="text-sm font-bold text-white">Carbon Monoxide (CO) Affinity</h4>
                        <p className="text-xs text-slate-400 mt-2">
                            CO binds to Haemoglobin <strong>210-250 times</strong> more readily than Oxygen.
                            It forms Carboxyhaemoglobin (COHb), reducing blood's O2 carrying capacity.
                        </p>
                        <div className="mt-3 w-full bg-slate-700 h-4 rounded-full overflow-hidden flex">
                            <div className="bg-red-500 w-[10%] h-full"></div>
                            <div className="bg-blue-500 w-[90%] h-full"></div>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                            <span className="text-red-400 font-bold">CO (Blocker)</span>
                            <span className="text-blue-400">Available O2 Space</span>
                        </div>
                    </div>

                    <div className="bg-slate-800 p-4 rounded-lg border-l-4 border-red-500">
                        <h4 className="text-sm font-bold text-white">Hypoxic Equivalent</h4>
                        <p className="text-xs text-slate-400 mt-1">
                            A heavy smoker (15-20/day) has a functional altitude of <strong>4,000 - 5,000 ft</strong> while at sea level.
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                            Their Night Vision is degraded earlier (from ground level).
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h3 className="font-bold text-white mb-4">Carbon Monoxide Poisoning</h3>
                <p className="text-xs text-slate-400 mb-4">
                    Most common in light aircraft via heater shroud leaks.
                </p>

                <div className="space-y-2">
                    <h4 className="text-sm font-bold text-slate-300">Symptoms Progression:</h4>
                    {[
                        { stage: 'Early', sym: 'Headache, slight dizziness, warm feeling' },
                        { stage: 'Middle', sym: 'Nausea, impaired judgement, cherry-red lips/skin' },
                        { stage: 'Late', sym: 'Convulsions, Coma, Death' },
                    ].map((s, i) => (
                        <div key={i} className="flex gap-2 p-2 bg-slate-800 rounded">
                            <div className={`w-2 h-full rounded-full ${i === 2 ? 'bg-red-600' : i === 1 ? 'bg-orange-500' : 'bg-yellow-400'}`}></div>
                            <div>
                                <span className="text-xs font-bold text-white block">{s.stage}</span>
                                <span className="text-xs text-slate-400">{s.sym}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 p-3 bg-red-900/20 border-red-500/50 border rounded-lg">
                    <p className="text-xs text-red-200 font-bold text-center">
                        ACTION: Shut off heater. Open vents. Land ASAP.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HPLToxicology;
