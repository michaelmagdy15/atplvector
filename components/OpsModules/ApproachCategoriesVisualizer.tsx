import React, { useState } from 'react';
import { Plane, ArrowDown, Eye, Gauge, AlertCircle } from 'lucide-react';

const ApproachCategoriesVisualizer: React.FC = () => {
    const [selectedCat, setSelectedCat] = useState<string>('A');

    const categories = [
        { id: 'A', vatMin: 0, vatMax: 90, color: 'emerald', mdh: 400, vis: 1500 },
        { id: 'B', vatMin: 91, vatMax: 120, color: 'blue', mdh: 500, vis: 1600 },
        { id: 'C', vatMin: 121, vatMax: 140, color: 'orange', mdh: 600, vis: 2400 },
        { id: 'D', vatMin: 141, vatMax: 165, color: 'red', mdh: 700, vis: 3600 },
    ];

    const ilsCategories = [
        { cat: 'CAT I', dh: 200, rvr: 550, note: 'Standard precision approach' },
        { cat: 'CAT II', dh: 100, rvr: 300, note: 'Requires special approval' },
        { cat: 'CAT IIIA', dh: '<100', rvr: 200, note: 'Autoland capable' },
        { cat: 'CAT IIIB', dh: 'No DH', rvr: 75, note: 'Fail-operational required for 75m RVR' },
    ];

    const npaMinima = [
        { type: 'VOR', dh: 300 },
        { type: 'VOR/DME or LOC', dh: 250 },
        { type: 'NDB', dh: 350 },
        { type: 'NDB/DME', dh: 300 },
        { type: 'SRA (1nm)', dh: 300 },
    ];

    const selectedCategory = categories.find(c => c.id === selectedCat)!;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-2">
                <Plane className="w-8 h-8 text-blue-400" />
                <div>
                    <h2 className="text-2xl font-bold text-white">Approach Categories & Minima</h2>
                    <p className="text-slate-400 text-sm">Aircraft categories based on VAT (1.3 Vs0 or 1.23 Vs1g).</p>
                </div>
            </div>

            {/* Aircraft Category Selector */}
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="font-bold text-white mb-4">Select Aircraft Category</h3>
                <div className="flex gap-3">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCat(cat.id)}
                            className={`flex-1 p-4 rounded-xl border-2 transition-all ${selectedCat === cat.id
                                    ? `bg-${cat.color}-900/30 border-${cat.color}-500`
                                    : 'bg-slate-900 border-slate-700 hover:border-slate-500'
                                }`}
                        >
                            <div className={`text-4xl font-black ${selectedCat === cat.id ? `text-${cat.color}-400` : 'text-white'}`}>
                                {cat.id}
                            </div>
                            <div className="text-sm text-slate-400 mt-1">
                                {cat.vatMin === 0 ? '<' : ''}{cat.vatMin || 91}-{cat.vatMax} kts
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Circling Minima for Selected Category */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white text-slate-900 p-6 rounded-xl shadow-xl">
                    <h3 className="text-sm font-bold text-slate-500 uppercase mb-4">Circling Minima - Category {selectedCat}</h3>
                    <div className="grid grid-cols-2 gap-6 text-center">
                        <div>
                            <div className="flex justify-center items-center text-blue-600 mb-2">
                                <ArrowDown className="w-5 h-5 mr-1" />
                                <span className="font-bold text-sm">MDH</span>
                            </div>
                            <div className="text-4xl font-black">{selectedCategory.mdh}<span className="text-base font-normal text-slate-400 ml-1">ft</span></div>
                        </div>
                        <div className="border-l border-slate-200">
                            <div className="flex justify-center items-center text-blue-600 mb-2">
                                <Eye className="w-5 h-5 mr-1" />
                                <span className="font-bold text-sm">VIS</span>
                            </div>
                            <div className="text-4xl font-black">{selectedCategory.vis}<span className="text-base font-normal text-slate-400 ml-1">m</span></div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-white mb-4">VAT / VREF Definition</h3>
                    <div className="space-y-3 text-sm text-slate-300">
                        <div className="bg-slate-800 p-3 rounded-lg">
                            <span className="text-blue-400 font-bold">VAT = </span>
                            1.3 × Vs0 <span className="text-slate-500">(stall speed, landing config)</span>
                        </div>
                        <div className="bg-slate-800 p-3 rounded-lg">
                            <span className="text-blue-400 font-bold">OR = </span>
                            1.23 × Vs1g <span className="text-slate-500">(1g stall speed)</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                            This is the speed over the threshold at maximum landing mass.
                        </p>
                    </div>
                </div>
            </div>

            {/* ILS Categories */}
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-indigo-400" />
                    ILS Operating Categories
                </h3>
                <div className="grid md:grid-cols-4 gap-4">
                    {ilsCategories.map((ils, i) => (
                        <div key={i} className="bg-slate-900 p-4 rounded-xl border border-slate-700 text-center">
                            <div className="text-xl font-black text-indigo-400 mb-2">{ils.cat}</div>
                            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                                <div>
                                    <div className="text-xs text-slate-500">DH</div>
                                    <div className="font-bold text-white">{ils.dh} ft</div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500">RVR</div>
                                    <div className="font-bold text-white">{ils.rvr} m</div>
                                </div>
                            </div>
                            <div className="text-xs text-slate-400">{ils.note}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* NPA Minima */}
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="font-bold text-white mb-4">Non-Precision Approach Minima (Minimum MDH)</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {npaMinima.map((npa, i) => (
                        <div key={i} className="bg-slate-900 p-4 rounded-lg border border-slate-700 text-center">
                            <div className="text-sm font-bold text-white mb-1">{npa.type}</div>
                            <div className="text-2xl font-black text-orange-400">{npa.dh}<span className="text-sm font-normal text-slate-500 ml-1">ft</span></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Visual References */}
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-emerald-400" />
                    Required Visual References
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                        <h4 className="font-bold text-white mb-3">Below MDA for ILS CAT I</h4>
                        <ul className="text-sm text-slate-300 space-y-1">
                            <li>• Approach Lighting</li>
                            <li>• Runway Threshold</li>
                            <li>• PAPI/VASI</li>
                            <li>• Touchdown Zone</li>
                            <li>• Runway Edge Lights</li>
                        </ul>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-lg border border-blue-500/30">
                        <h4 className="font-bold text-white mb-3">Below DA/H for LTS CAT I & II</h4>
                        <ul className="text-sm text-slate-300 space-y-1">
                            <li>• <strong>3 consecutive:</strong> Approach CL, Runway CL, TDZ, or Edge Lights</li>
                            <li>• <strong>AND</strong> a lateral element of ground pattern</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-500/30 flex items-center gap-3">
                <AlertCircle className="text-yellow-400 shrink-0" />
                <p className="text-sm text-yellow-200">
                    <strong>LVTO (Low Visibility Take-Off):</strong> Cannot go below 150m RVR for Cat A/B/C or 200m for Cat D unless authority approves.
                </p>
            </div>
        </div>
    );
};

export default ApproachCategoriesVisualizer;
