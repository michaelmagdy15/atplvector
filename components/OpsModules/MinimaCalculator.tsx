import React, { useState } from 'react';
import { Ruler, ArrowRight, Eye, Cloud } from 'lucide-react';

const MinimaCalculator: React.FC = () => {
    // State
    const [approachType, setApproachType] = useState<string>('cat1'); // cat23, cat1, npa, circle
    const [cat1Rvr, setCat1Rvr] = useState<number>(550);
    const [npaRvr, setNpaRvr] = useState<number>(1000);
    const [npaCeiling, setNpaCeiling] = useState<number>(400); // MDH
    const [circlingVis, setCirclingVis] = useState<number>(1500);
    const [circlingCeiling, setCirclingCeiling] = useState<number>(1000);

    const getMinima = () => {
        let rvr = 0;
        let ceiling: number | string = "N/A";
        let note = "";

        switch (approachType) {
            case 'cat23':
                rvr = cat1Rvr; // PLAN: CAT I RVR
                ceiling = "N/A";
                note = "Planning Minima for CAT II/III is CAT I RVR.";
                break;
            case 'cat1':
                rvr = npaRvr; // PLAN: NPA RVR
                ceiling = npaCeiling; // PLAN: NPA Ceiling (MDH)
                note = "Planning Minima for CAT I is NPA RVR & Ceiling.";
                break;
            case 'npa':
                rvr = npaRvr + 1000;
                ceiling = npaCeiling + 200;
                note = "Planning Minima for NPA is RVR + 1000m & Ceiling + 200ft.";
                break;
            case 'circle':
                rvr = circlingVis;
                ceiling = circlingCeiling;
                note = "Planning Minima for Circling is standard Circling Minima.";
                break;
        }

        return { rvr, ceiling, note };
    };

    const result = getMinima();

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-2">
                <Ruler className="w-8 h-8 text-blue-400" />
                <div>
                    <h2 className="text-2xl font-bold text-white">Alternate Planning Minima</h2>
                    <p className="text-slate-400 text-sm">Calculate required weather for your alternate aerodrome.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Configuration */}
                <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-700 space-y-6">
                    <div>
                        <label className="text-sm font-bold text-white block mb-2">Available Approach at Alternate</label>
                        <select
                            value={approachType}
                            onChange={(e) => setApproachType(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white"
                        >
                            <option value="cat23">ILS CAT II / III</option>
                            <option value="cat1">ILS CAT I</option>
                            <option value="npa">Non-Precision (NPA)</option>
                            <option value="circle">Circling</option>
                        </select>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-xs uppercase font-bold text-slate-500">Standard Minima for Approach</h4>

                        {approachType === 'cat23' && (
                            <div className="bg-blue-900/20 p-3 rounded">
                                <label className="text-xs text-slate-400 block mb-1">CAT I RVR for this Runway</label>
                                <input type="number" value={cat1Rvr} onChange={e => setCat1Rvr(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" />
                            </div>
                        )}

                        {approachType === 'cat1' && (
                            <>
                                <div className="bg-blue-900/20 p-3 rounded grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs text-slate-400 block mb-1">NPA RVR</label>
                                        <input type="number" value={npaRvr} onChange={e => setNpaRvr(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-400 block mb-1">NPA MDH (ft)</label>
                                        <input type="number" value={npaCeiling} onChange={e => setNpaCeiling(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" />
                                    </div>
                                </div>
                            </>
                        )}

                        {approachType === 'npa' && (
                            <div className="bg-blue-900/20 p-3 rounded grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1">Charted RVR</label>
                                    <input type="number" value={npaRvr} onChange={e => setNpaRvr(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1">Charted MDH (ft)</label>
                                    <input type="number" value={npaCeiling} onChange={e => setNpaCeiling(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" />
                                </div>
                            </div>
                        )}

                        {approachType === 'circle' && (
                            <div className="bg-blue-900/20 p-3 rounded grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1">Charted Visibility</label>
                                    <input type="number" value={circlingVis} onChange={e => setCirclingVis(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1">Charted Ceiling</label>
                                    <input type="number" value={circlingCeiling} onChange={e => setCirclingCeiling(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Results */}
                <div className="flex flex-col justify-center space-y-4">
                    <div className="rounded-2xl bg-white text-slate-900 p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                        <h3 className="text-slate-500 font-bold uppercase text-xs mb-6">Required Forecast Conditions</h3>

                        <div className="grid grid-cols-2 gap-8 text-center">
                            <div>
                                <div className="flex justify-center items-center text-blue-600 mb-2">
                                    <Eye className="w-6 h-6 mr-2" />
                                    <span className="font-bold">VIS / RVR</span>
                                </div>
                                <div className="text-4xl font-black">{result.rvr}<span className="text-base font-normal text-slate-400 ml-1">m</span></div>
                                <div className="text-xs text-slate-400 mt-1">or greater</div>
                            </div>

                            <div className="border-l border-slate-200">
                                <div className="flex justify-center items-center text-blue-600 mb-2">
                                    <Cloud className="w-6 h-6 mr-2" />
                                    <span className="font-bold">CEILING</span>
                                </div>
                                <div className="text-4xl font-black">{result.ceiling}<span className="text-base font-normal text-slate-400 ml-1">{result.ceiling !== "N/A" && "ft"}</span></div>
                                <div className="text-xs text-slate-400 mt-1">or higher</div>
                            </div>
                        </div>

                        <div className="mt-8 bg-blue-50 text-blue-900 p-4 rounded-lg text-sm font-medium border border-blue-100">
                            {result.note}
                        </div>
                    </div>

                    <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600">
                        <h4 className="font-bold text-white mb-2">Operating Minima Rules</h4>
                        <ul className="text-xs text-slate-300 space-y-1">
                            <li>• Take-off: Ceiling & RVR considered (Alternate req if no return).</li>
                            <li>• Destination: RVR/Vis Met (Ceiling only for NPA/Circling).</li>
                            <li>• NPA RVR &gt; 800m.</li>
                            <li>• Cannot descend below 1000ft unless above minima.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MinimaCalculator;
