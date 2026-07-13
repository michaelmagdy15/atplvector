
import React, { useState, useMemo } from 'react';
import {
    Thermometer,
    Droplets,
    ShieldCheck,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Bug,
    GlassWater,
    Utensils,
    ChevronRight,
    ChevronDown,
    Info,
    MapPin,
    Globe,
    Syringe,
    Clock,
    Plane,
    Heart,
    ArrowUpDown,
    Filter,
    Check,
    AlertTriangle,
    Zap,
    Activity
} from 'lucide-react';
import { View } from '../../types';

interface Props {
    onNavigate: (view: View) => void;
}

/* ─── Data ───────────────────────────────────────────────────────────────── */

type Severity = 'critical' | 'high' | 'moderate' | 'low';

interface Disease {
    name: string;
    type: string;
    vector: string;
    vectorIcon: 'mosquito' | 'water' | 'tick' | 'flea' | 'snail';
    symptoms: string;
    incubation: string;
    prevention: string;
    severity: Severity;
    groundingPeriod: string;
    returnToFly: string;
    regions: string[];
}

const SEVERITY_CONFIG: Record<Severity, { label: string; color: string; bg: string; border: string }> = {
    critical: { label: 'Critical', color: 'text-red-400', bg: 'bg-red-500/15', border: 'border-red-500/30' },
    high: { label: 'High', color: 'text-orange-400', bg: 'bg-orange-500/15', border: 'border-orange-500/30' },
    moderate: { label: 'Moderate', color: 'text-amber-400', bg: 'bg-amber-500/15', border: 'border-amber-500/30' },
    low: { label: 'Low', color: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' },
};

const VECTOR_LABELS: Record<string, string> = {
    mosquito: '🦟 Mosquito-borne',
    water: '💧 Water / Food-borne',
    tick: '🪲 Tick-borne',
    flea: '🪳 Flea-borne',
    snail: '🐌 Snail-borne',
};

const diseases: Disease[] = [
    {
        name: 'Malaria',
        type: 'Protozoan (Plasmodium)',
        vector: 'Anopheles Mosquito (Night biting)',
        vectorIcon: 'mosquito',
        symptoms: 'Fever, chills, headache, muscle ache, fatigue. Can progress to severe anemia, cerebral malaria, organ failure.',
        incubation: '7–30 days (P. falciparum: 7–14 days)',
        prevention: 'Prophylaxis (Malarone, Lariam), Mosquito nets, Repellent (DEET). Avoid outdoor exposure dusk-to-dawn.',
        severity: 'critical',
        groundingPeriod: 'Minimum 3 months after acute illness',
        returnToFly: 'Full recovery confirmed, no recurrence, normal blood counts, AME clearance required.',
        regions: ['africa', 'asia', 'south-america'],
    },
    {
        name: 'Yellow Fever',
        type: 'Viral (Flavivirus)',
        vector: 'Aedes Mosquito (Day biting)',
        vectorIcon: 'mosquito',
        symptoms: 'Fever, muscle pain, jaundice (yellow skin), vomiting. Severe: hemorrhage, liver/kidney failure.',
        incubation: '3–6 days',
        prevention: 'Vaccination (Stamaril) — Mandatory for many countries. Lifetime validity (WHO 2016). Certificate in ICVP "Yellow Book".',
        severity: 'critical',
        groundingPeriod: 'Minimum 6 weeks post-recovery',
        returnToFly: 'Symptom-free, liver function normalised, AME certification.',
        regions: ['africa', 'south-america'],
    },
    {
        name: 'Dengue Fever',
        type: 'Viral (Flavivirus)',
        vector: 'Aedes Aegypti Mosquito (Day biting)',
        vectorIcon: 'mosquito',
        symptoms: "Severe headache, pain behind eyes, joint/muscle pain ('Breakbone fever'). Dengue Hemorrhagic Fever in repeat infections.",
        incubation: '4–10 days',
        prevention: 'Avoid mosquito bites. Dengvaxia vaccine for endemic populations only. No specific antiviral treatment.',
        severity: 'high',
        groundingPeriod: 'Minimum 4 weeks, longer if platelet issues',
        returnToFly: 'Normal platelet count, no hemorrhagic signs, AME clearance.',
        regions: ['asia', 'south-america', 'africa'],
    },
    {
        name: 'Japanese Encephalitis',
        type: 'Viral (Flavivirus)',
        vector: 'Culex Mosquito (Night biting, rural/rice-paddy areas)',
        vectorIcon: 'mosquito',
        symptoms: 'Often asymptomatic. Severe: high fever, headache, neck stiffness, seizures, neurological damage.',
        incubation: '5–15 days',
        prevention: 'Ixiaro vaccine (2-dose schedule). Mosquito avoidance in rural Asia.',
        severity: 'high',
        groundingPeriod: 'Indefinite if neurological involvement',
        returnToFly: 'Full neurological assessment, no residual deficits, specialist + AME clearance.',
        regions: ['asia'],
    },
    {
        name: 'Zika Virus',
        type: 'Viral (Flavivirus)',
        vector: 'Aedes Mosquito (Day biting)',
        vectorIcon: 'mosquito',
        symptoms: 'Mild fever, rash, conjunctivitis, joint pain. Risk: microcephaly in pregnancy, Guillain-Barré syndrome.',
        incubation: '3–14 days',
        prevention: 'Mosquito bite avoidance. No vaccine available. Special precautions for pregnant crew or partners.',
        severity: 'moderate',
        groundingPeriod: '2 weeks post-symptoms',
        returnToFly: 'Symptom resolution, no neurological complications. AME aware.',
        regions: ['south-america', 'asia'],
    },
    {
        name: 'Chagas Disease',
        type: 'Parasitic (Trypanosoma cruzi)',
        vector: 'Triatomine "Kissing Bug" (night biting, mud/thatch houses)',
        vectorIcon: 'flea',
        symptoms: 'Acute: fever, swelling at bite. Chronic: cardiomyopathy, megacolon (years later).',
        incubation: '1–2 weeks (acute phase)',
        prevention: 'Avoid sleeping in mud/thatch structures. Insecticide-treated nets. No vaccine.',
        severity: 'moderate',
        groundingPeriod: 'Variable — cardiac assessment required',
        returnToFly: 'Full cardiac workup clear, no arrhythmias, AME + cardiologist clearance.',
        regions: ['south-america'],
    },
    {
        name: 'Typhoid Fever',
        type: 'Bacterial (Salmonella typhi)',
        vector: 'Contaminated food / water',
        vectorIcon: 'water',
        symptoms: 'High sustained fever, headache, abdominal pain, constipation or diarrhea, rose-colored spots.',
        incubation: '6–30 days (usually 8–14)',
        prevention: 'Typhim Vi injection or Vivotif oral vaccine. Strict food/water hygiene.',
        severity: 'high',
        groundingPeriod: 'Until antibiotic course complete + 2 weeks',
        returnToFly: 'Afebrile, 3 negative stool cultures, full strength restored, AME clearance.',
        regions: ['asia', 'africa', 'south-america'],
    },
    {
        name: 'Cholera',
        type: 'Bacterial (Vibrio cholerae)',
        vector: 'Contaminated water',
        vectorIcon: 'water',
        symptoms: 'Profuse watery diarrhea ("rice-water stools"), severe dehydration, vomiting, leg cramps.',
        incubation: '2 hours – 5 days',
        prevention: 'Dukoral oral vaccine. Safe water and food only. Handwashing. ORS for treatment.',
        severity: 'high',
        groundingPeriod: 'Until fully rehydrated + symptom-free 48h',
        returnToFly: 'Fully rehydrated, normal electrolytes, symptom-free minimum 48 hours.',
        regions: ['asia', 'africa', 'south-america'],
    },
    {
        name: 'Schistosomiasis',
        type: 'Parasitic (Schistosoma)',
        vector: 'Freshwater snails — skin penetration in contaminated lakes/rivers',
        vectorIcon: 'snail',
        symptoms: 'Swimmer\'s itch, fever, chills, cough. Chronic: liver/bladder damage.',
        incubation: '2–12 weeks',
        prevention: 'Avoid swimming/wading in freshwater in endemic areas. Praziquantel for treatment.',
        severity: 'moderate',
        groundingPeriod: '2–4 weeks post-treatment',
        returnToFly: 'Treatment completed, symptoms resolved, normal lab values.',
        regions: ['africa', 'asia', 'south-america'],
    },
];

interface RegionInfo {
    id: string;
    name: string;
    color: string;
    hoverColor: string;
    textColor: string;
    bgGlow: string;
    svgPath: string;
}

const REGIONS: RegionInfo[] = [
    {
        id: 'africa',
        name: 'Africa',
        color: 'from-red-600/40 to-red-900/40',
        hoverColor: 'from-red-500/60 to-red-800/60',
        textColor: 'text-red-400',
        bgGlow: 'bg-red-500/20',
        svgPath: 'M 210 100 L 250 90 L 270 110 L 280 150 L 270 200 L 260 250 L 240 280 L 220 290 L 200 270 L 190 230 L 185 190 L 190 150 L 200 120 Z',
    },
    {
        id: 'asia',
        name: 'Asia',
        color: 'from-amber-600/40 to-amber-900/40',
        hoverColor: 'from-amber-500/60 to-amber-800/60',
        textColor: 'text-amber-400',
        bgGlow: 'bg-amber-500/20',
        svgPath: 'M 280 60 L 350 50 L 400 70 L 420 100 L 410 150 L 380 170 L 340 180 L 300 170 L 280 150 L 270 110 Z',
    },
    {
        id: 'south-america',
        name: 'S. America',
        color: 'from-emerald-600/40 to-emerald-900/40',
        hoverColor: 'from-emerald-500/60 to-emerald-800/60',
        textColor: 'text-emerald-400',
        bgGlow: 'bg-emerald-500/20',
        svgPath: 'M 110 180 L 140 160 L 160 180 L 170 220 L 160 270 L 140 310 L 120 320 L 105 300 L 100 260 L 95 220 Z',
    },
];

interface VaxItem {
    disease: string;
    vaccine: string;
    type: string;
    doses: string;
    timingBefore: string;
    validity: string;
    required: string[];
    recommended: string[];
    icaoNotes: string;
}

const vaccinationData: VaxItem[] = [
    {
        disease: 'Yellow Fever',
        vaccine: 'Stamaril / YF-Vax',
        type: 'Live attenuated',
        doses: '1 dose',
        timingBefore: '≥ 10 days before travel',
        validity: 'Lifetime (WHO 2016)',
        required: ['Sub-Saharan Africa', 'Tropical S. America', 'Transit countries'],
        recommended: [],
        icaoNotes: 'ICVP "Yellow Book" certificate mandatory. Some states require for transit >12h.',
    },
    {
        disease: 'Hepatitis A',
        vaccine: 'Havrix / Vaqta',
        type: 'Inactivated',
        doses: '2 doses (0, 6–12 months)',
        timingBefore: '≥ 2 weeks before travel',
        validity: 'Up to 25 years (with booster)',
        required: [],
        recommended: ['All tropical destinations', 'Areas with poor sanitation'],
        icaoNotes: 'Highly recommended for all crew operating to tropical/subtropical routes.',
    },
    {
        disease: 'Hepatitis B',
        vaccine: 'Engerix-B',
        type: 'Recombinant',
        doses: '3 doses (0, 1, 6 months)',
        timingBefore: '≥ 6 months for full course',
        validity: 'Lifetime (if adequate response)',
        required: [],
        recommended: ['All destinations', 'Especially healthcare contact'],
        icaoNotes: 'Recommended for all aircrew. Check antibody levels periodically.',
    },
    {
        disease: 'Typhoid',
        vaccine: 'Typhim Vi (injection) / Vivotif (oral)',
        type: 'Vi polysaccharide / Live oral',
        doses: 'Injection: 1 dose / Oral: 4 doses',
        timingBefore: '≥ 2 weeks (injection) / 1 week (oral)',
        validity: '2–3 years',
        required: [],
        recommended: ['Indian subcontinent', 'Africa', 'S. America'],
        icaoNotes: 'Recommended when eating outside controlled crew meals in endemic areas.',
    },
    {
        disease: 'Cholera',
        vaccine: 'Dukoral (oral)',
        type: 'Inactivated + B subunit',
        doses: '2 doses (1 week apart)',
        timingBefore: '≥ 1 week before travel',
        validity: '2 years',
        required: [],
        recommended: ['Active outbreak zones'],
        icaoNotes: 'Limited recommendation. Focus on water/food hygiene. Useful for high-risk layovers.',
    },
    {
        disease: 'Japanese Encephalitis',
        vaccine: 'Ixiaro',
        type: 'Inactivated',
        doses: '2 doses (0, 28 days)',
        timingBefore: '≥ 1 week before travel',
        validity: '1–2 years (booster at 12 months)',
        required: [],
        recommended: ['Rural Asia', 'Extended stays during monsoon season'],
        icaoNotes: 'Recommended for crew with rural layovers in SE Asia during monsoon.',
    },
    {
        disease: 'Tetanus / Diphtheria',
        vaccine: 'Td / Tdap',
        type: 'Toxoid',
        doses: 'Booster every 10 years',
        timingBefore: 'Any time (keep current)',
        validity: '10 years',
        required: [],
        recommended: ['Universal — all crew'],
        icaoNotes: 'Standard booster. Ensure up-to-date before medical renewal.',
    },
    {
        disease: 'Rabies',
        vaccine: 'Imovax / RabAvert',
        type: 'Inactivated',
        doses: '3 doses (0, 7, 21–28 days)',
        timingBefore: '≥ 4 weeks before travel',
        validity: '2–3 years (boosters if exposed)',
        required: [],
        recommended: ['Areas with stray dogs', 'Remote areas with limited medical access'],
        icaoNotes: 'Pre-exposure prophylaxis recommended for crew with regular layovers in high-risk areas.',
    },
];

/* ─── Component ──────────────────────────────────────────────────────────── */

const HPLTropicalDiseases: React.FC<Props> = ({ onNavigate }) => {
    const [activeTab, setActiveTab] = useState<'map' | 'diseases' | 'hygiene' | 'prevention' | 'fitness'>('map');
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
    const [expandedDisease, setExpandedDisease] = useState<number | null>(null);
    const [diseaseFilter, setDiseaseFilter] = useState<string>('all');
    const [vaxChecked, setVaxChecked] = useState<Record<string, boolean>>({});
    const [fitnessSortField, setFitnessSortField] = useState<'name' | 'severity' | 'grounding'>('severity');
    const [fitnessSortAsc, setFitnessSortAsc] = useState(true);
    const [fitnessFilter, setFitnessFilter] = useState<Severity | 'all'>('all');

    /* Derived data */
    const regionDiseases = useMemo(() => {
        if (!selectedRegion) return diseases;
        return diseases.filter(d => d.regions.includes(selectedRegion));
    }, [selectedRegion]);

    const filteredDiseases = useMemo(() => {
        if (diseaseFilter === 'all') return diseases;
        return diseases.filter(d => d.vectorIcon === diseaseFilter);
    }, [diseaseFilter]);

    const sortedFitness = useMemo(() => {
        const list = fitnessFilter === 'all' ? [...diseases] : diseases.filter(d => d.severity === fitnessFilter);
        const severityOrder: Record<Severity, number> = { critical: 0, high: 1, moderate: 2, low: 3 };
        list.sort((a, b) => {
            let cmp = 0;
            if (fitnessSortField === 'name') cmp = a.name.localeCompare(b.name);
            else if (fitnessSortField === 'severity') cmp = severityOrder[a.severity] - severityOrder[b.severity];
            else cmp = a.groundingPeriod.localeCompare(b.groundingPeriod);
            return fitnessSortAsc ? cmp : -cmp;
        });
        return list;
    }, [fitnessSortField, fitnessSortAsc, fitnessFilter]);

    const toggleVax = (disease: string) => setVaxChecked(prev => ({ ...prev, [disease]: !prev[disease] }));

    const handleFitnessSort = (field: 'name' | 'severity' | 'grounding') => {
        if (fitnessSortField === field) setFitnessSortAsc(!fitnessSortAsc);
        else { setFitnessSortField(field); setFitnessSortAsc(true); }
    };

    /* ── Renders ─────────────────────────────────────────────────────────── */

    const SeverityBadge = ({ severity }: { severity: Severity }) => {
        const c = SEVERITY_CONFIG[severity];
        return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${c.bg} ${c.color} ${c.border} border`}>
                {severity === 'critical' && <Zap size={10} />}
                {severity === 'high' && <AlertTriangle size={10} />}
                {severity === 'moderate' && <AlertCircle size={10} />}
                {severity === 'low' && <CheckCircle2 size={10} />}
                {c.label}
            </span>
        );
    };

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
            {/* ── Header ──────────────────────────────────────────────────── */}
            <div className="bg-gradient-to-r from-amber-900/80 via-yellow-900/60 to-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl border border-amber-700/40 relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-amber-500/20 rounded-lg backdrop-blur-md border border-amber-500/30">
                            <ShieldCheck className="text-amber-400" size={24} />
                        </div>
                        <span className="text-amber-400 font-bold tracking-widest text-xs uppercase">Learning Objective 040.01.03.01</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Tropical Diseases &amp; Hygiene</h1>
                    <p className="text-amber-100/70 max-w-2xl text-lg leading-relaxed">
                        Essential health guidance for aircrew operating in tropical environments, focusing on disease prevention, vaccinations, and hygiene.
                    </p>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-yellow-400/5 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl"></div>
            </div>

            {/* ── Navigation Tabs ─────────────────────────────────────────── */}
            <div className="flex flex-wrap p-1 bg-slate-900/60 rounded-2xl border border-slate-800 backdrop-blur-sm sticky top-24 z-20 gap-1">
                {([
                    { id: 'map', label: 'Disease Risk Map', icon: Globe },
                    { id: 'diseases', label: 'Disease Cards', icon: Thermometer },
                    { id: 'hygiene', label: 'Food & Water', icon: GlassWater },
                    { id: 'prevention', label: 'Vaccination Plan', icon: Syringe },
                    { id: 'fitness', label: 'Crew Fitness', icon: Activity },
                ] as const).map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl transition-all duration-300 font-bold text-xs md:text-sm ${activeTab === tab.id
                            ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/40'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                    >
                        <tab.icon size={16} />
                        <span className="hidden md:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* ── Tab Content ─────────────────────────────────────────────── */}
            <div className="min-h-[500px]">

                {/* ═══ TAB 1: Disease Risk Map ═══ */}
                {activeTab === 'map' && (
                    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <Globe className="text-amber-400" size={22} />
                                <h2 className="text-xl font-bold text-white">Interactive Disease Risk Map</h2>
                                <span className="text-xs text-slate-500 ml-auto">Click a region to explore</span>
                            </div>

                            {/* Region Cards as clickable map */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                {REGIONS.map(r => {
                                    const isActive = selectedRegion === r.id;
                                    const count = diseases.filter(d => d.regions.includes(r.id)).length;
                                    return (
                                        <button
                                            key={r.id}
                                            onClick={() => setSelectedRegion(isActive ? null : r.id)}
                                            className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-left group overflow-hidden ${
                                                isActive
                                                    ? `border-amber-500 shadow-lg shadow-amber-900/30 bg-gradient-to-br ${r.hoverColor}`
                                                    : `border-slate-700 hover:border-slate-600 bg-gradient-to-br ${r.color}`
                                            }`}
                                        >
                                            <div className={`absolute inset-0 ${r.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                                            <div className="relative z-10">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <MapPin className={`${r.textColor}`} size={18} />
                                                    <span className={`text-lg font-black ${isActive ? 'text-white' : r.textColor}`}>{r.name}</span>
                                                </div>
                                                <div className="text-slate-300 text-xs mb-3">{count} diseases prevalent</div>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {diseases
                                                        .filter(d => d.regions.includes(r.id))
                                                        .slice(0, 4)
                                                        .map(d => (
                                                            <span key={d.name} className="text-[10px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded-full">
                                                                {d.name}
                                                            </span>
                                                        ))}
                                                    {diseases.filter(d => d.regions.includes(r.id)).length > 4 && (
                                                        <span className="text-[10px] text-slate-500">+{diseases.filter(d => d.regions.includes(r.id)).length - 4} more</span>
                                                    )}
                                                </div>
                                            </div>
                                            {isActive && (
                                                <div className="absolute top-3 right-3">
                                                    <Check className="text-amber-400" size={16} />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* SVG Map Visualization */}
                            <div className="relative bg-slate-950 rounded-2xl border border-slate-800 p-4 overflow-hidden">
                                <svg viewBox="0 0 500 340" className="w-full h-auto max-h-[340px]" xmlns="http://www.w3.org/2000/svg">
                                    {/* Simplified World Outline */}
                                    <defs>
                                        <filter id="glow">
                                            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                                            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                                        </filter>
                                    </defs>
                                    {/* Grid lines */}
                                    {[0, 1, 2, 3, 4].map(i => (
                                        <React.Fragment key={`grid-${i}`}>
                                            <line x1={0} y1={i * 85} x2={500} y2={i * 85} stroke="#1e293b" strokeWidth="0.5" />
                                            <line x1={i * 125} y1={0} x2={i * 125} y2={340} stroke="#1e293b" strokeWidth="0.5" />
                                        </React.Fragment>
                                    ))}

                                    {/* Continent Silhouettes — simplified */}
                                    {/* N. America */}
                                    <path d="M 30 40 L 60 30 L 130 35 L 140 60 L 130 90 L 100 120 L 80 140 L 60 130 L 40 100 L 25 70 Z" fill="#1e293b" stroke="#334155" strokeWidth="0.5" />
                                    {/* Europe */}
                                    <path d="M 200 30 L 240 25 L 270 40 L 260 70 L 230 80 L 210 75 L 200 50 Z" fill="#1e293b" stroke="#334155" strokeWidth="0.5" />
                                    {/* Australia */}
                                    <path d="M 380 220 L 420 210 L 440 230 L 430 260 L 400 270 L 380 250 Z" fill="#1e293b" stroke="#334155" strokeWidth="0.5" />

                                    {/* Clickable Risk Regions */}
                                    {REGIONS.map(r => {
                                        const isActive = selectedRegion === r.id;
                                        const fillColor = r.id === 'africa' ? (isActive ? '#ef444480' : '#ef444425')
                                            : r.id === 'asia' ? (isActive ? '#f59e0b80' : '#f59e0b25')
                                            : (isActive ? '#10b98180' : '#10b98125');
                                        const strokeColor = r.id === 'africa' ? '#ef4444'
                                            : r.id === 'asia' ? '#f59e0b'
                                            : '#10b981';
                                        return (
                                            <g key={r.id}
                                                onClick={() => setSelectedRegion(isActive ? null : r.id)}
                                                className="cursor-pointer"
                                                filter={isActive ? 'url(#glow)' : undefined}
                                            >
                                                <path
                                                    d={r.svgPath}
                                                    fill={fillColor}
                                                    stroke={strokeColor}
                                                    strokeWidth={isActive ? '2' : '1'}
                                                    className="transition-all duration-300"
                                                />
                                                {/* Region Label */}
                                                {r.id === 'africa' && <text x="230" y="200" fill="#ef4444" fontSize="11" fontWeight="bold" textAnchor="middle">Africa</text>}
                                                {r.id === 'asia' && <text x="350" y="120" fill="#f59e0b" fontSize="11" fontWeight="bold" textAnchor="middle">Asia</text>}
                                                {r.id === 'south-america' && <text x="130" y="260" fill="#10b981" fontSize="11" fontWeight="bold" textAnchor="middle">S. America</text>}
                                                {/* Pulse dot */}
                                                {isActive && (
                                                    <>
                                                        {r.id === 'africa' && <circle cx="230" cy="180" r="5" fill={strokeColor} opacity="0.7"><animate attributeName="r" values="3;8;3" dur="2s" repeatCount="indefinite" /><animate attributeName="opacity" values="0.7;0.2;0.7" dur="2s" repeatCount="indefinite" /></circle>}
                                                        {r.id === 'asia' && <circle cx="350" cy="100" r="5" fill={strokeColor} opacity="0.7"><animate attributeName="r" values="3;8;3" dur="2s" repeatCount="indefinite" /><animate attributeName="opacity" values="0.7;0.2;0.7" dur="2s" repeatCount="indefinite" /></circle>}
                                                        {r.id === 'south-america' && <circle cx="130" cy="240" r="5" fill={strokeColor} opacity="0.7"><animate attributeName="r" values="3;8;3" dur="2s" repeatCount="indefinite" /><animate attributeName="opacity" values="0.7;0.2;0.7" dur="2s" repeatCount="indefinite" /></circle>}
                                                    </>
                                                )}
                                            </g>
                                        );
                                    })}
                                    {/* Legend */}
                                    <text x="15" y="325" fill="#94a3b8" fontSize="9" fontWeight="600">Click regions to explore disease prevalence</text>
                                </svg>
                            </div>

                            {/* Region Disease Detail Panel */}
                            {selectedRegion && (
                                <div className="mt-6 space-y-3 animate-in slide-in-from-bottom-3 duration-300">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        <MapPin size={16} className="text-amber-400" />
                                        Diseases in {REGIONS.find(r => r.id === selectedRegion)?.name}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {regionDiseases.map(d => (
                                            <div key={d.name} className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 hover:border-amber-500/30 transition-colors">
                                                <div className="flex items-start justify-between mb-2">
                                                    <span className="text-sm font-bold text-white">{d.name}</span>
                                                    <SeverityBadge severity={d.severity} />
                                                </div>
                                                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">{VECTOR_LABELS[d.vectorIcon]}</div>
                                                <p className="text-xs text-slate-400 leading-relaxed">{d.symptoms.split('.')[0]}.</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ═══ TAB 2: Disease Quick Reference Cards ═══ */}
                {activeTab === 'diseases' && (
                    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                        {/* Filter Bar */}
                        <div className="flex items-center gap-3 flex-wrap">
                            <Filter size={14} className="text-slate-500" />
                            <span className="text-xs text-slate-500 font-bold uppercase">Filter by vector:</span>
                            {['all', 'mosquito', 'water', 'flea', 'snail'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setDiseaseFilter(f)}
                                    className={`text-xs px-3 py-1.5 rounded-full font-bold transition-all ${
                                        diseaseFilter === f
                                            ? 'bg-amber-600 text-white'
                                            : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                                    }`}
                                >
                                    {f === 'all' ? 'All' : VECTOR_LABELS[f] || f}
                                </button>
                            ))}
                        </div>

                        {/* Disease Cards */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            {filteredDiseases.map((d, i) => {
                                const isExpanded = expandedDisease === i;
                                return (
                                    <div
                                        key={d.name}
                                        className={`group bg-slate-900 border rounded-2xl transition-all duration-300 overflow-hidden ${
                                            isExpanded
                                                ? 'border-amber-500/50 shadow-xl shadow-amber-900/20 ring-1 ring-amber-500/20'
                                                : 'border-slate-800 hover:border-slate-700'
                                        }`}
                                    >
                                        {/* Card Header */}
                                        <button
                                            onClick={() => setExpandedDisease(isExpanded ? null : i)}
                                            className="w-full p-5 text-left flex items-start justify-between gap-4"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                    <h3 className="text-lg font-black text-white group-hover:text-amber-400 transition-colors">{d.name}</h3>
                                                    <SeverityBadge severity={d.severity} />
                                                </div>
                                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                                    <span className="font-bold uppercase">{d.type}</span>
                                                    <span>•</span>
                                                    <span>{VECTOR_LABELS[d.vectorIcon]}</span>
                                                </div>
                                            </div>
                                            <ChevronDown
                                                size={18}
                                                className={`text-slate-500 shrink-0 mt-1 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-amber-400' : ''}`}
                                            />
                                        </button>

                                        {/* Expanded Content */}
                                        {isExpanded && (
                                            <div className="px-5 pb-5 space-y-4 border-t border-slate-800 pt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {/* Vector / Transmission */}
                                                    <div className="bg-slate-800/50 rounded-xl p-3.5">
                                                        <div className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-1.5">
                                                            <Bug size={10} className="text-amber-500" /> Vector / Transmission
                                                        </div>
                                                        <p className="text-sm text-slate-300 leading-relaxed">{d.vector}</p>
                                                    </div>

                                                    {/* Incubation */}
                                                    <div className="bg-slate-800/50 rounded-xl p-3.5">
                                                        <div className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-1.5">
                                                            <Clock size={10} className="text-blue-400" /> Incubation Period
                                                        </div>
                                                        <p className="text-sm text-blue-300 font-semibold">{d.incubation}</p>
                                                    </div>

                                                    {/* Symptoms */}
                                                    <div className="bg-slate-800/50 rounded-xl p-3.5 sm:col-span-2">
                                                        <div className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-1.5">
                                                            <Thermometer size={10} className="text-red-400" /> Symptoms
                                                        </div>
                                                        <p className="text-sm text-slate-300 leading-relaxed">{d.symptoms}</p>
                                                    </div>

                                                    {/* Prevention */}
                                                    <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-3.5 sm:col-span-2">
                                                        <div className="text-[10px] font-bold text-amber-500 uppercase mb-1.5 flex items-center gap-1.5">
                                                            <ShieldCheck size={10} /> Prevention & Treatment
                                                        </div>
                                                        <p className="text-sm text-amber-100/80 leading-relaxed">{d.prevention}</p>
                                                    </div>

                                                    {/* Flying Fitness Impact */}
                                                    <div className="bg-purple-500/5 border border-purple-500/10 rounded-xl p-3.5 sm:col-span-2">
                                                        <div className="text-[10px] font-bold text-purple-400 uppercase mb-1.5 flex items-center gap-1.5">
                                                            <Plane size={10} /> Impact on Flying Fitness
                                                        </div>
                                                        <div className="flex flex-col sm:flex-row gap-3">
                                                            <div className="flex-1">
                                                                <span className="text-[10px] text-slate-500 font-bold uppercase">Grounding:</span>
                                                                <p className="text-sm text-purple-300 font-semibold">{d.groundingPeriod}</p>
                                                            </div>
                                                            <div className="flex-1">
                                                                <span className="text-[10px] text-slate-500 font-bold uppercase">Return criteria:</span>
                                                                <p className="text-sm text-slate-400">{d.returnToFly}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Regions */}
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <MapPin size={12} className="text-slate-500" />
                                                    <span className="text-[10px] text-slate-500 font-bold uppercase">Regions:</span>
                                                    {d.regions.map(rId => {
                                                        const region = REGIONS.find(r => r.id === rId);
                                                        return (
                                                            <span key={rId} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${region?.textColor} bg-slate-800`}>
                                                                {region?.name}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ═══ TAB 3: Food & Water Hygiene (Original content preserved) ═══ */}
                {activeTab === 'hygiene' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 border-l-4 border-l-emerald-500 shadow-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <CheckCircle2 className="text-emerald-400" size={24} />
                                <h3 className="text-xl font-bold text-white">Food &amp; Water Safety: &quot;Safe&quot;</h3>
                            </div>
                            <ul className="space-y-4">
                                {[
                                    "Bottled water with intact seal",
                                    "Freshly cooked food (piping hot)",
                                    "Fruits you peel yourself (bananas, oranges)",
                                    "Canned or bottled beverages",
                                    "Coffee or tea made with boiling water"
                                ].map((item, idx) => (
                                    <li key={idx} className="flex gap-3 text-slate-300 text-sm">
                                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 border-l-4 border-l-red-500 shadow-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <XCircle className="text-red-400" size={24} />
                                <h3 className="text-xl font-bold text-white">High Risk: &quot;Avoid&quot;</h3>
                            </div>
                            <ul className="space-y-4">
                                {[
                                    "Tap water and ice cubes (often made from tap)",
                                    "Raw salads and unpeeled vegetables",
                                    "Unpasteurized milk or dairy products",
                                    "Buffet food left at lukewarm temperatures",
                                    "Shellfish and undercooked meat"
                                ].map((item, idx) => (
                                    <li key={idx} className="flex gap-3 text-slate-300 text-sm">
                                        <XCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Prevention Methods (original content) */}
                        <div className="md:col-span-2 grid grid-cols-1 lg:grid-cols-3 gap-5">
                            {[
                                {
                                    title: "Mosquito Avoidance",
                                    icon: Bug,
                                    steps: ["Use DEET-based repellents", "Wear long-sleeved clothing", "Sleep under treated nets", "Stay indoors dusk to dawn in malaria zones"],
                                    accent: 'amber'
                                },
                                {
                                    title: "Water Purification",
                                    icon: Droplets,
                                    steps: ["Boiling (at least 1 min)", "Chlorine/Iodine tablets", "Filter systems (0.2µm pore)", "UV-C sterilization pens"],
                                    accent: 'blue'
                                },
                                {
                                    title: "Personal Hygiene",
                                    icon: Heart,
                                    steps: ["Frequent handwashing with soap", "Use alcohol-based sanitizer", "Avoid touching face", "Carry own utensils if needed"],
                                    accent: 'emerald'
                                }
                            ].map((box, i) => (
                                <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                                    <div className={`p-3 bg-${box.accent}-500/10 text-${box.accent}-400 rounded-xl mb-4 w-fit`}>
                                        <box.icon size={22} />
                                    </div>
                                    <h3 className="text-base font-bold text-white mb-3">{box.title}</h3>
                                    <ul className="space-y-2.5">
                                        {box.steps.map((step, si) => (
                                            <li key={si} className="text-xs text-slate-400 flex items-start gap-2">
                                                <CheckCircle2 size={12} className="text-emerald-500 shrink-0 mt-0.5" />
                                                {step}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        <div className="md:col-span-2 bg-amber-500/5 border border-amber-500/20 rounded-3xl p-8 flex flex-col md:flex-row gap-6 items-center">
                            <div className="p-4 bg-amber-500/10 rounded-2xl text-amber-400">
                                <Info size={32} />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-amber-300 mb-2">The Golden Rule for Travelers</h4>
                                <p className="text-slate-400 italic text-lg">&quot;Cook it, boil it, peel it or leave it.&quot;</p>
                                <p className="text-xs text-slate-500 mt-2">Personal hygiene, especially frequent hand-washing, is the singular most effective way to prevent gastrointestinal illness.</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══ TAB 4: Vaccination & Prophylaxis Interactive Checklist ═══ */}
                {activeTab === 'prevention' && (
                    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                        {/* Progress bar */}
                        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-bold text-white flex items-center gap-2"><Syringe size={14} className="text-amber-400" /> Vaccination Readiness</span>
                                <span className="text-xs font-bold text-amber-400">
                                    {Object.values(vaxChecked).filter(Boolean).length} / {vaccinationData.length} complete
                                </span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-2.5">
                                <div
                                    className="bg-gradient-to-r from-amber-600 to-yellow-500 h-2.5 rounded-full transition-all duration-500"
                                    style={{ width: `${(Object.values(vaxChecked).filter(Boolean).length / vaccinationData.length) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Vaccination Cards */}
                        <div className="space-y-3">
                            {vaccinationData.map((v) => {
                                const checked = vaxChecked[v.disease] ?? false;
                                return (
                                    <div
                                        key={v.disease}
                                        className={`bg-slate-900 rounded-2xl border transition-all duration-300 overflow-hidden ${
                                            checked ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-slate-800 hover:border-slate-700'
                                        }`}
                                    >
                                        <div className="flex items-center gap-4 p-5">
                                            {/* Checkbox */}
                                            <button
                                                onClick={() => toggleVax(v.disease)}
                                                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
                                                    checked
                                                        ? 'bg-emerald-500 border-emerald-500'
                                                        : 'border-slate-600 hover:border-amber-500'
                                                }`}
                                            >
                                                {checked && <Check size={14} className="text-white" />}
                                            </button>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 flex-wrap mb-1">
                                                    <span className={`font-bold ${checked ? 'text-emerald-400 line-through' : 'text-white'}`}>{v.disease}</span>
                                                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">{v.type}</span>
                                                    {v.required.length > 0 && (
                                                        <span className="text-[10px] bg-red-500/15 text-red-400 px-2 py-0.5 rounded-full font-bold border border-red-500/20">MANDATORY</span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-slate-500">{v.vaccine} — {v.doses}</div>
                                            </div>

                                            {/* Timing Badge */}
                                            <div className="hidden md:flex flex-col items-end gap-1">
                                                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
                                                    <Clock size={12} />
                                                    {v.timingBefore}
                                                </div>
                                                <span className="text-[10px] text-slate-500">Valid: {v.validity}</span>
                                            </div>
                                        </div>

                                        {/* Expanded Details (always visible) */}
                                        <div className="px-5 pb-4 pt-0 grid grid-cols-1 md:grid-cols-3 gap-3">
                                            {v.required.length > 0 && (
                                                <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-3">
                                                    <div className="text-[10px] font-bold text-red-400 uppercase mb-1">Required for</div>
                                                    <div className="flex flex-wrap gap-1">
                                                        {v.required.map(r => (
                                                            <span key={r} className="text-[10px] bg-red-500/10 text-red-300 px-2 py-0.5 rounded-full">{r}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {v.recommended.length > 0 && (
                                                <div className="bg-amber-500/5 border border-amber-500/10 rounded-lg p-3">
                                                    <div className="text-[10px] font-bold text-amber-400 uppercase mb-1">Recommended for</div>
                                                    <div className="flex flex-wrap gap-1">
                                                        {v.recommended.map(r => (
                                                            <span key={r} className="text-[10px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded-full">{r}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            <div className="bg-blue-500/5 border border-blue-500/10 rounded-lg p-3">
                                                <div className="text-[10px] font-bold text-blue-400 uppercase mb-1 flex items-center gap-1"><Plane size={10} /> ICAO / Crew Notes</div>
                                                <p className="text-[11px] text-slate-400 leading-relaxed">{v.icaoNotes}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* ICAO Yellow Book info */}
                        <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6 flex items-start gap-4">
                            <AlertTriangle size={20} className="text-amber-400 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-bold text-amber-300 mb-1">ICVP — International Certificate of Vaccination or Prophylaxis</h4>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Also known as the &quot;Yellow Book&quot;, this WHO-standardized certificate is <strong className="text-amber-300">legally required</strong> for entry to many countries. 
                                    Yellow Fever vaccination is the most commonly mandated. Keep the certificate with your passport and crew license at all times.
                                    Consult your AME <strong className="text-amber-300">6-8 weeks before</strong> travel to endemic areas.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══ TAB 5: Crew Fitness Impact Table ═══ */}
                {activeTab === 'fitness' && (
                    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                        {/* Filters */}
                        <div className="flex items-center gap-3 flex-wrap">
                            <Filter size={14} className="text-slate-500" />
                            <span className="text-xs text-slate-500 font-bold uppercase">Severity:</span>
                            {(['all', 'critical', 'high', 'moderate', 'low'] as const).map(s => (
                                <button
                                    key={s}
                                    onClick={() => setFitnessFilter(s)}
                                    className={`text-xs px-3 py-1.5 rounded-full font-bold transition-all ${
                                        fitnessFilter === s
                                            ? 'bg-amber-600 text-white'
                                            : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                                    }`}
                                >
                                    {s === 'all' ? 'All' : SEVERITY_CONFIG[s].label}
                                </button>
                            ))}
                        </div>

                        {/* Table */}
                        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-800/60">
                                            {[
                                                { key: 'name' as const, label: 'Disease' },
                                                { key: 'severity' as const, label: 'Severity' },
                                                { key: 'grounding' as const, label: 'Grounding Period' },
                                            ].map(col => (
                                                <th
                                                    key={col.key}
                                                    onClick={() => handleFitnessSort(col.key)}
                                                    className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-amber-400 transition-colors select-none"
                                                >
                                                    <span className="flex items-center gap-1.5">
                                                        {col.label}
                                                        <ArrowUpDown size={10} className={fitnessSortField === col.key ? 'text-amber-400' : 'text-slate-600'} />
                                                    </span>
                                                </th>
                                            ))}
                                            <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Return-to-Fly Criteria</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sortedFitness.map((d, i) => (
                                            <tr
                                                key={d.name}
                                                className={`border-t border-slate-800/50 hover:bg-slate-800/30 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-800/10'}`}
                                            >
                                                <td className="px-5 py-4">
                                                    <div className="text-sm font-bold text-white">{d.name}</div>
                                                    <div className="text-[10px] text-slate-500">{VECTOR_LABELS[d.vectorIcon]}</div>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <SeverityBadge severity={d.severity} />
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className="text-sm text-amber-300 font-semibold">{d.groundingPeriod}</span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <p className="text-xs text-slate-400 leading-relaxed max-w-sm">{d.returnToFly}</p>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Key Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-purple-500/5 border border-purple-500/15 rounded-2xl p-5">
                                <h4 className="text-sm font-bold text-purple-300 mb-3 flex items-center gap-2">
                                    <Plane size={14} /> AME Assessment Requirements
                                </h4>
                                <ul className="space-y-2">
                                    {[
                                        'All tropical disease recoveries require AME (Aeromedical Examiner) clearance',
                                        'Neurological involvement → specialist assessment mandatory',
                                        'Cardiac involvement (Chagas) → cardiologist + AME clearance',
                                        'Recurrent conditions may require extended monitoring',
                                        'Prophylactic medication side effects must also be assessed',
                                    ].map((item, idx) => (
                                        <li key={idx} className="text-xs text-slate-400 flex items-start gap-2">
                                            <AlertCircle size={11} className="text-purple-400 shrink-0 mt-0.5" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-amber-500/5 border border-amber-500/15 rounded-2xl p-5">
                                <h4 className="text-sm font-bold text-amber-300 mb-3 flex items-center gap-2">
                                    <ShieldCheck size={14} /> ICAO Annex 1 — Medical Standards
                                </h4>
                                <ul className="space-y-2">
                                    {[
                                        'Class 1 medical holders must be free from any condition that could cause sudden incapacitation',
                                        'Anti-malarial prophylaxis: Malarone is generally acceptable for flight; Lariam (mefloquine) may cause neuropsychiatric side effects — check with AME',
                                        'Any febrile illness = grounded until diagnosis confirmed and resolved',
                                        'Self-medication NOT recommended; always consult aviation medical authority',
                                    ].map((item, idx) => (
                                        <li key={idx} className="text-xs text-slate-400 flex items-start gap-2">
                                            <Info size={11} className="text-amber-400 shrink-0 mt-0.5" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {/* ── Footer Navigation ───────────────────────────────────────── */}
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

export default HPLTropicalDiseases;
