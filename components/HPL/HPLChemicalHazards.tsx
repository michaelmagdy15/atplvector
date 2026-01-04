import React, { useState } from 'react';
import { Leaf, Fuel, Skull, Beaker, AlertTriangle, Wind } from 'lucide-react';

const HPLChemicalHazards: React.FC = () => {
    const [tab, setTab] = useState<'ozone' | 'fluids'>('ozone');

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <Skull className="text-orange-500" />
                        Chemical & Environmental Hazards
                    </h2>
                    <p className="text-slate-400 text-sm">Ozone, Fuels, and Hydraulic Fluids.</p>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-lg">
                    <button onClick={() => setTab('ozone')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'ozone' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'}`}>Ozone (O3)</button>
                    <button onClick={() => setTab('fluids')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'fluids' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'}`}>Fuels & Fluids</button>
                </div>
            </div>

            {tab === 'ozone' && <OzoneInfo />}
            {tab === 'fluids' && <FluidsInfo />}
        </div>
    );
};

const OzoneInfo = () => (
    <div className="animate-in fade-in grid md:grid-cols-2 gap-8">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Wind className="text-sky-400" /> Atmospheric Ozone
            </h3>
            <p className="text-sm text-slate-300 mb-4">
                Ozone (O3) is a toxic gas found in high concentrations in the Stratosphere (Ozone Layer).
            </p>
            <div className="bg-sky-900/20 p-4 rounded-lg border border-sky-500/30 mb-4">
                <h4 className="text-xs font-bold text-sky-400 uppercase mb-2">Location</h4>
                <p className="text-xs text-slate-300">
                    Highest concentrations between <strong>50,000 - 100,000 ft</strong>.
                    <br />Can be encountered by business jets / supersonic flights.
                    <br />Concentration increases with Latitude (more at Poles) and Season (Spring).
                </p>
            </div>
            <div className="bg-red-900/20 p-4 rounded-lg border border-red-500/30">
                <h4 className="text-xs font-bold text-red-400 uppercase mb-2">Effects</h4>
                <ul className="text-xs text-slate-300 list-disc pl-4 space-y-1">
                    <li>Respiratory irritation (Coughing, Chest pain).</li>
                    <li>Shortness of breath.</li>
                    <li>Headaches and fatigue.</li>
                    <li>Decomposition of rubber/plastic components.</li>
                </ul>
            </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 flex flex-col justify-center">
            <h3 className="font-bold text-white mb-4">Catalytic Converters</h3>
            <p className="text-xs text-slate-400 mb-6">
                Most modern high-altitude aircraft are equipped with catalytic converters in the bleed air system to break down O3 back into O2 + O.
            </p>
            <div className="relative h-32 bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center">
                <div className="flex items-center gap-4">
                    <span className="font-black text-sky-500 text-2xl">O3</span>
                    <span className="text-slate-500">→</span>
                    <div className="bg-slate-700 px-3 py-1 rounded text-xs text-white border border-slate-500">Converter</div>
                    <span className="text-slate-500">→</span>
                    <span className="font-black text-emerald-500 text-2xl">O2</span>
                </div>
            </div>
        </div>
    </div>
);

const FluidsInfo = () => (
    <div className="animate-in fade-in space-y-6">
        <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <Fuel className="text-amber-500" /> Fuels (AVGAS / Jet A1)
                </h3>
                <div className="space-y-4">
                    <div>
                        <h4 className="text-sm font-bold text-white">Skin Contact</h4>
                        <p className="text-xs text-slate-400">Dermatitis, chemical burns. Wash immediately with soap and water.</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white">Inhalation</h4>
                        <p className="text-xs text-slate-400">Dizziness, nausea, anaesthetic effect. Long term CNS damage.</p>
                    </div>
                    <div className="bg-amber-900/20 p-2 rounded border border-amber-500/50">
                        <p className="text-[10px] text-amber-200">
                            <strong>Note:</strong> AVGAS 100LL contains Lead (Neurotoxin).
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <Beaker className="text-purple-500" /> Hydraulic Fluids (Skydrol)
                </h3>
                <div className="space-y-4">
                    <div className="bg-purple-900/20 p-4 rounded border border-purple-500/50">
                        <h4 className="text-sm font-bold text-purple-300">Highly Corrosive</h4>
                        <p className="text-xs text-slate-300 mt-1">
                            "Skydrol" (Phosphate Ester based) is extremely irritating to eyes and skin.
                            <br /><strong>Eyes:</strong> Severe stinging / potential damage. Flush with water/saline.
                            <br /><strong>Paint:</strong> Strips paint off metal.
                        </p>
                    </div>
                    <p className="text-xs text-slate-400">
                        Always wear PPE (Gloves/Goggles) when inspecting hydraulic systems.
                    </p>
                </div>
            </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
            <h3 className="font-bold text-white mb-2">Fire Extinguishers (Halon)</h3>
            <p className="text-xs text-slate-400 mb-4">
                Halon 1211 (BCF) and 1301. Effective but toxic in confined spaces.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-800 p-2 rounded">
                    <span className="text-xs font-bold text-white block">Mechanism</span>
                    <span className="text-xs text-slate-500">Chemically interrupts combustion chain reaction.</span>
                </div>
                <div className="bg-red-900/20 p-2 rounded border border-red-500/30">
                    <span className="text-xs font-bold text-red-300 block">Warning</span>
                    <span className="text-xs text-slate-400">Displacing O2 + Toxic decomposition products. Use breathing equipment if available.</span>
                </div>
            </div>
        </div>
    </div>
);

export default HPLChemicalHazards;
