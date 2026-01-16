
import React, { useState } from 'react';
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
    Info
} from 'lucide-react';
import { View } from '../../types';

interface Props {
    onNavigate: (view: View) => void;
}

const HPLTropicalDiseases: React.FC<Props> = ({ onNavigate }) => {
    const [activeTab, setActiveTab] = useState<'diseases' | 'hygiene' | 'prevention'>('diseases');
    const [selectedDisease, setSelectedDisease] = useState<number | null>(null);

    const diseases = [
        {
            name: "Malaria",
            type: "Protozoan (Plasmodium)",
            vector: "Anopheles Mosquito (Night biting)",
            symptoms: "Fever, chills, headache, muscle ache, fatigue.",
            prevention: "Prophylaxis (Malarone, Lariam), Mosquito nets, Repellent (DEET).",
            color: "red"
        },
        {
            name: "Yellow Fever",
            type: "Viral",
            vector: "Aedes Mosquito (Day biting)",
            symptoms: "Fever, muscle pain, jaundice (yellow skin), vomiting.",
            prevention: "Vaccination (Stamaril) - Mandatory for many countries. 10-year validity (now lifetime).",
            color: "yellow"
        },
        {
            name: "Dengue Fever",
            type: "Viral",
            vector: "Aedes Aegypti Mosquito",
            symptoms: "Severe headache, pain behind eyes, joint/muscle pain ('Breakbone fever').",
            prevention: "Avoid bites (no specific vaccine widely used for travelers).",
            color: "orange"
        },
        {
            name: "Cholera / Typhoid",
            type: "Bacterial",
            vector: "Contaminated food/water",
            symptoms: "Severe diarrhea, dehydration (Cholera), high fever (Typhoid).",
            prevention: "Hygiene, safe water, vaccinations (Dukoral, Typhim).",
            color: "blue"
        }
    ];

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl border border-teal-700/50 relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-emerald-500/20 rounded-lg backdrop-blur-md border border-emerald-500/30">
                            <ShieldCheck className="text-emerald-400" size={24} />
                        </div>
                        <span className="text-emerald-400 font-bold tracking-widest text-xs uppercase">Learning Objective 040.01.03.01</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Tropical Diseases & Hygiene</h1>
                    <p className="text-teal-100/80 max-w-2xl text-lg leading-relaxed">
                        Essential health guidance for aircrew operating in tropical environments, focusing on disease prevention, vaccinations, and hygiene.
                    </p>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex p-1 bg-slate-900/50 rounded-2xl border border-slate-800 backdrop-blur-sm sticky top-24 z-20">
                {[
                    { id: 'diseases', label: 'Disease Profiles', icon: Thermometer },
                    { id: 'hygiene', label: 'Food & Water Hygiene', icon: GlassWater },
                    { id: 'prevention', label: 'Preventative Measures', icon: Bug },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all duration-300 font-bold text-sm ${activeTab === tab.id
                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                    >
                        <tab.icon size={18} />
                        <span className="hidden md:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[500px]">
                {activeTab === 'diseases' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4 duration-500">
                        {diseases.map((d, i) => (
                            <div
                                key={i}
                                onClick={() => setSelectedDisease(selectedDisease === i ? null : i)}
                                className={`group cursor-pointer bg-slate-900 border border-slate-800 p-6 rounded-3xl transition-all hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-900/20 relative overflow-hidden ${selectedDisease === i ? 'ring-2 ring-emerald-500 shadow-emerald-900/30' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors">{d.name}</h3>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{d.type}</span>
                                    </div>
                                    <div className={`p-3 rounded-2xl bg-${d.color}-500/10 text-${d.color}-400`}>
                                        <AlertCircle size={20} />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Bug className="text-emerald-500 shrink-0 mt-1" size={16} />
                                        <div>
                                            <div className="text-[10px] font-bold text-slate-500 uppercase">Vector / Transmission</div>
                                            <div className="text-slate-300 text-sm">{d.vector}</div>
                                        </div>
                                    </div>

                                    {selectedDisease === i && (
                                        <div className="space-y-4 pt-4 border-t border-slate-800 animate-in fade-in zoom-in-95">
                                            <div>
                                                <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Symptoms</div>
                                                <p className="text-slate-400 text-sm leading-relaxed">{d.symptoms}</p>
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-bold text-emerald-500 uppercase mb-1">Prevention & Treatment</div>
                                                <p className="text-emerald-100/90 text-sm leading-relaxed border-l-2 border-emerald-500 pl-3 bg-emerald-500/5 py-2 rounded-r-lg">
                                                    {d.prevention}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 flex items-center justify-end text-emerald-500 font-bold text-xs gap-1 group-hover:gap-2 transition-all">
                                    {selectedDisease === i ? 'Show less' : 'View details'} <ChevronRight size={14} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'hygiene' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 border-l-4 border-l-emerald-500 shadow-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <CheckCircle2 className="text-emerald-400" size={24} />
                                <h3 className="text-xl font-bold text-white">Food & Water Safety: "Safe"</h3>
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
                                        <span className="text-emerald-500 font-bold">•</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 border-l-4 border-l-red-500 shadow-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <XCircle className="text-red-400" size={24} />
                                <h3 className="text-xl font-bold text-white">High Risk: "Avoid"</h3>
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
                                        <span className="text-red-500 font-bold">•</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="md:col-span-2 bg-blue-500/5 border border-blue-500/20 rounded-3xl p-8 flex flex-col md:flex-row gap-6 items-center">
                            <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-400">
                                <Info size={32} />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-blue-300 mb-2">The Golden Rule for Travelers</h4>
                                <p className="text-slate-400 italic">"Cook it, boil it, peel it or leave it."</p>
                                <p className="text-xs text-slate-500 mt-2">Personal hygiene, especially frequent hand-washing, is the singular most effective way to prevent gastrointestinal illness.</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'prevention' && (
                    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {[
                                {
                                    title: "Mosquito Avoidance",
                                    icon: Bug,
                                    steps: ["Use DEET-based repellents", "Wear long-sleeved clothing", "Sleep under treated nets"],
                                    color: "emerald"
                                },
                                {
                                    title: "Water Purification",
                                    icon: Droplets,
                                    steps: ["Boiling (at least 1 min)", "Chlorine/Iodine tablets", "Filter systems"],
                                    color: "blue"
                                },
                                {
                                    title: "Vaccination Plan",
                                    icon: ShieldCheck,
                                    steps: ["Consult 6-8 weeks prior", "Verify mandatory vs recommended", "Keep records in Yellow Book"],
                                    color: "purple"
                                }
                            ].map((box, i) => (
                                <div key={i} className="bg-slate-900 border border-slate-800 p-8 rounded-3xl flex flex-col items-center text-center">
                                    <div className={`p-4 bg-${box.color}-500/10 text-${box.color}-400 rounded-2xl mb-6`}>
                                        <box.icon size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-4">{box.title}</h3>
                                    <ul className="space-y-3 w-full">
                                        {box.steps.map((step, si) => (
                                            <li key={si} className="text-sm text-slate-400 flex items-center justify-center gap-2">
                                                <CheckCircle2 size={14} className="text-emerald-500" />
                                                {step}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
                            <h3 className="text-xl font-bold text-white mb-6">Vaccination Guide for Aircrew</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-slate-800">
                                            <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Disease</th>
                                            <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Type</th>
                                            <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Duration</th>
                                            <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Notes</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        <tr className="border-b border-slate-800/50">
                                            <td className="py-4 text-white font-bold">Yellow Fever</td>
                                            <td className="py-4 text-slate-400">Live attenuated</td>
                                            <td className="py-4 text-slate-400">Lifetime</td>
                                            <td className="py-4 text-amber-400 font-medium">Mandatory for many/Transit</td>
                                        </tr>
                                        <tr className="border-b border-slate-800/50">
                                            <td className="py-4 text-white font-bold">Hepatitis A</td>
                                            <td className="py-4 text-slate-400">Inactivated</td>
                                            <td className="py-4 text-slate-400">Up to 25 years</td>
                                            <td className="py-4 text-slate-400 italic">Highly recommended for travel</td>
                                        </tr>
                                        <tr className="border-b border-slate-800/50">
                                            <td className="py-4 text-white font-bold">Tetanus</td>
                                            <td className="py-4 text-slate-400">Toxoid</td>
                                            <td className="py-4 text-slate-400">10 years</td>
                                            <td className="py-4 text-slate-400 italic">Standard universal booster</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
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

export default HPLTropicalDiseases;
