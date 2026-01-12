import React, { useState } from 'react';
import { Settings, TrendingUp, Calculator, Plane, Scale, Info } from 'lucide-react';

const TrimSheetSim: React.FC = () => {
    // --------------------------------------------------------------------------
    // STATE: Basic Inputs
    // --------------------------------------------------------------------------
    const [doi, setDoi] = useState(40.0); // Dry Operating Index
    const [paxFwd, setPaxFwd] = useState(2);
    const [paxAft, setPaxAft] = useState(40);
    const [cargoFwd, setCargoFwd] = useState(150);
    const [cargoAft, setCargoAft] = useState(300);
    const [takeOffFuel, setTakeOffFuel] = useState(2800);
    const [tripFuel, setTripFuel] = useState(1200);

    // --------------------------------------------------------------------------
    // CONSTANTS (Mock Data for "Twin Jet")
    // --------------------------------------------------------------------------
    const BEM = 24000;
    const CREW_PANTRY = 800;
    const DOM = BEM + CREW_PANTRY; // 24800

    // Limits
    const MSTOM = 45000; // Max Structural TOM
    const MSLM = 40000;  // Max Structural LM
    const MSZFM = 36000; // Max Structural ZFM

    // Weights
    const PAX_WEIGHT = 84;

    // Indices Constraints (MAC)
    // Fwd Limit: Index 10 -> 25% MAC (Mocked mapping)
    // Aft Limit: Index 90 -> 35% MAC
    // Envelope is usually:
    // Y (Mass) vs X (Index)

    // --------------------------------------------------------------------------
    // CALCULATIONS: Mass
    // --------------------------------------------------------------------------
    const massPaxFwd = paxFwd * PAX_WEIGHT;
    const massPaxAft = paxAft * PAX_WEIGHT;
    const trafficLoad = massPaxFwd + massPaxAft + cargoFwd + cargoAft;

    const ZFM = DOM + trafficLoad;
    const TOM = ZFM + takeOffFuel;
    const LM = TOM - tripFuel;

    // --------------------------------------------------------------------------
    // CALCULATIONS: Index / CG
    // --------------------------------------------------------------------------
    // Simple Moment arms for simulation visuals
    // Index Change = Mass * StationEffect

    const idxPaxFwd = -(paxFwd * 0.5); // Fwd pax moves CG fwd (negative index)
    const idxPaxAft = +(paxAft * 0.3); // Aft pax moves CG aft
    const idxCargoFwd = -(cargoFwd * 0.005);
    const idxCargoAft = +(cargoAft * 0.004);
    const idxFuel = -(takeOffFuel * 0.001); // Fuel usually slight fwd or neutral

    const zfmIndex = doi + idxPaxFwd + idxPaxAft + idxCargoFwd + idxCargoAft;
    const tomIndex = zfmIndex + idxFuel;
    // LM Index usually differs by fuel burn moment... assumed simplified here
    const lmIndex = tomIndex + (tripFuel * 0.0005);

    // --------------------------------------------------------------------------
    // FORM VALIDATION
    // --------------------------------------------------------------------------
    const isZfmValid = ZFM <= MSZFM;
    const isTomValid = TOM <= MSTOM;
    const isLmValid = LM <= MSLM;

    // --------------------------------------------------------------------------
    // GRAPH HELPERS
    // --------------------------------------------------------------------------
    // Map Mass (20k - 50k) to Y (100% - 0%)
    const mapY = (m: number) => 100 - ((m - 20000) / 30000) * 100;
    // Map Index (0 - 100) to X (0% - 100%)
    const mapX = (i: number) => Math.max(0, Math.min(100, i));

    return (
        <div className="p-2 md:p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
            {/* Paper Container */}
            <div className="bg-slate-100 text-slate-900 rounded-none md:rounded-lg shadow-2xl overflow-hidden border border-slate-300 min-h-[800px] flex flex-col">

                {/* 1. HEADER */}
                <div className="bg-slate-900 text-white p-4 flex justify-between items-center border-b-4 border-yellow-500">
                    <div className="flex items-center gap-3">
                        <Plane className="w-8 h-8 text-yellow-400" />
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-wider">Load & Trim Sheet</h1>
                            <div className="text-xs font-mono text-slate-400">JAA-FCL TWIN JET SIMULATION</div>
                        </div>
                    </div>
                    <div className="text-right hidden md:block">
                        <div className="text-xs text-slate-400 uppercase">Interactive Form</div>
                        <div className="text-xl font-bold font-mono text-yellow-400">{new Date().toLocaleDateString()}</div>
                    </div>
                </div>

                {/* MAIN CONTENT GRID */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12">

                    {/* 2. LEFT PANEL: MASS & INDEX TABLE (The Form) */}
                    <div className="lg:col-span-5 border-r border-slate-300 bg-white p-4 md:p-6 flex flex-col gap-6 font-mono text-sm">

                        {/* INPUTS SECTION */}
                        <div className="space-y-4">
                            <h3 className="bg-slate-200 p-2 font-bold text-slate-700 uppercase border-l-4 border-slate-500">1. Loading Distribution</h3>

                            <div className="grid grid-cols-2 gap-4 items-center">
                                <label className="font-bold text-slate-600">Start DOI</label>
                                <input
                                    type="number"
                                    value={doi}
                                    onChange={(e) => setDoi(Number(e.target.value))}
                                    className="border border-slate-300 p-1 w-24 text-right rounded"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-xs font-bold text-slate-500 border-b border-slate-200 pb-1">
                                <span>ZONE</span>
                                <span className="text-center">QTY / KG</span>
                                <span className="text-right">INDEX Δ</span>
                            </div>

                            {/* ROW: Pax Fwd */}
                            <div className="grid grid-cols-3 gap-2 items-center">
                                <label>Pax Fwd</label>
                                <input
                                    type="range" min="0" max="100"
                                    value={paxFwd} onChange={(e) => setPaxFwd(Number(e.target.value))}
                                    className="accent-slate-700"
                                />
                                <span className="text-right text-red-600">{idxPaxFwd.toFixed(1)}</span>
                            </div>

                            {/* ROW: Pax Aft */}
                            <div className="grid grid-cols-3 gap-2 items-center">
                                <label>Pax Aft</label>
                                <input
                                    type="range" min="0" max="100"
                                    value={paxAft} onChange={(e) => setPaxAft(Number(e.target.value))}
                                    className="accent-slate-700"
                                />
                                <span className="text-right text-green-600">+{idxPaxAft.toFixed(1)}</span>
                            </div>

                            {/* ROW: Cargo */}
                            <div className="grid grid-cols-3 gap-2 items-center">
                                <label>Cargo Fwd (kg)</label>
                                <input
                                    type="number" step="10"
                                    value={cargoFwd} onChange={(e) => setCargoFwd(Number(e.target.value))}
                                    className="border border-slate-300 p-1 w-20 text-right"
                                />
                                <span className="text-right text-red-600">{idxCargoFwd.toFixed(1)}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 items-center">
                                <label>Cargo Aft (kg)</label>
                                <input
                                    type="number" step="10"
                                    value={cargoAft} onChange={(e) => setCargoAft(Number(e.target.value))}
                                    className="border border-slate-300 p-1 w-20 text-right"
                                />
                                <span className="text-right text-green-600">+{idxCargoAft.toFixed(1)}</span>
                            </div>

                        </div>

                        {/* MASS CALCULATION TABLE */}
                        <div className="flex-1 space-y-1">
                            <h3 className="bg-slate-200 p-2 font-bold text-slate-700 uppercase border-l-4 border-slate-500 mb-4">2. Mass Build-Up</h3>

                            {/* TABLE HEADER */}
                            <div className="grid grid-cols-12 gap-1 text-[10px] font-bold bg-slate-100 p-1 border-y border-slate-300">
                                <div className="col-span-5">ITEM</div>
                                <div className="col-span-3 text-right">MASS (kg)</div>
                                <div className="col-span-4 text-right">MAX (kg)</div>
                            </div>

                            {/* DOM */}
                            <div className="grid grid-cols-12 gap-1 py-1 border-b border-slate-100">
                                <div className="col-span-5 font-bold">Dry Operating Mass</div>
                                <div className="col-span-3 text-right text-slate-600">{DOM}</div>
                                <div className="col-span-4 text-right text-slate-400">-</div>
                            </div>

                            {/* TRAFFIC */}
                            <div className="grid grid-cols-12 gap-1 py-1 border-b border-slate-100">
                                <div className="col-span-5 pl-2">+ Traffic Load</div>
                                <div className="col-span-3 text-right text-blue-600">{trafficLoad}</div>
                                <div className="col-span-4 text-right text-slate-400">-</div>
                            </div>

                            {/* ZFM */}
                            <div className={`grid grid-cols-12 gap-1 py-2 font-black bg-slate-50 ${isZfmValid ? 'text-slate-800' : 'text-red-500 bg-red-50'}`}>
                                <div className="col-span-5">ZERO FUEL MASS</div>
                                <div className="col-span-3 text-right text-lg">{ZFM}</div>
                                <div className="col-span-4 text-right">{MSZFM}</div>
                            </div>

                            {/* FUEL */}
                            <div className="grid grid-cols-12 gap-1 py-1 border-b border-slate-100 items-center">
                                <div className="col-span-5 pl-2">+ T.O. Fuel</div>
                                <div className="col-span-3 text-right">
                                    <input
                                        type="number" step="100"
                                        value={takeOffFuel} onChange={(e) => setTakeOffFuel(Number(e.target.value))}
                                        className="border-b border-slate-300 w-full text-right text-blue-600 focus:outline-none bg-transparent"
                                    />
                                </div>
                                <div className="col-span-4 text-right text-slate-400">cap. 12000</div>
                            </div>

                            {/* TOM */}
                            <div className={`grid grid-cols-12 gap-1 py-2 font-black bg-slate-100 border-2 ${isTomValid ? 'border-slate-300 text-slate-900' : 'border-red-500 text-red-600 bg-red-50'}`}>
                                <div className="col-span-5">TAKE-OFF MASS</div>
                                <div className="col-span-3 text-right text-xl">{TOM}</div>
                                <div className="col-span-4 text-right">{MSTOM}</div>
                            </div>

                            {/* TRIP */}
                            <div className="grid grid-cols-12 gap-1 py-1 border-b border-slate-100 items-center">
                                <div className="col-span-5 pl-2">- Trip Fuel</div>
                                <div className="col-span-3 text-right">
                                    <input
                                        type="number" step="100"
                                        value={tripFuel} onChange={(e) => setTripFuel(Number(e.target.value))}
                                        className="border-b border-slate-300 w-full text-right text-orange-600 focus:outline-none bg-transparent"
                                    />
                                </div>
                                <div className="col-span-4 text-right text-slate-400">-</div>
                            </div>

                            {/* LM */}
                            <div className={`grid grid-cols-12 gap-1 py-2 font-black bg-slate-50 ${isLmValid ? 'text-slate-800' : 'text-red-500 bg-red-50'}`}>
                                <div className="col-span-5">LANDING MASS</div>
                                <div className="col-span-3 text-right text-lg">{LM}</div>
                                <div className="col-span-4 text-right">{MSLM}</div>
                            </div>

                        </div>
                    </div>

                    {/* 3. RIGHT PANEL: ENVELOPE GRAPH */}
                    <div className="lg:col-span-7 bg-white relative">
                        {/* Paper Grid Background */}
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-30"></div>
                        <div className="absolute inset-0 pointer-events-none" style={{ backgroundSize: '40px 40px', backgroundImage: 'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)' }}></div>

                        <div className="relative h-full w-full p-8 flex flex-col">
                            <h3 className="text-center font-bold text-slate-500 uppercase tracking-widest mb-4">CG Envelope (Trim Chart)</h3>

                            <div className="flex-1 relative border-2 border-slate-800 bg-white/50 shadow-inner">
                                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    {/* Limits / Envelope Shape */}
                                    {/* Limits: 
                                        Mass 45000 (Top) -> Index range 20-80
                                        Mass 24000 (Bottom) -> Index range 10-90
                                        Mocked shape
                                    */}
                                    <path
                                        d={`
                                            M ${mapX(15)} ${mapY(20000)}
                                            L ${mapX(25)} ${mapY(MSTOM)}
                                            L ${mapX(80)} ${mapY(MSTOM)}
                                            L ${mapX(90)} ${mapY(20000)}
                                            Z
                                        `}
                                        fill="none"
                                        stroke="#1e293b"
                                        strokeWidth="0.5"
                                        strokeDasharray="1 1"
                                    />
                                    {/* Bold Structural Limits */}
                                    <line x1={mapX(0)} y1={mapY(MSTOM)} x2={mapX(100)} y2={mapY(MSTOM)} stroke="red" strokeWidth="0.5" />
                                    <text x="2" y={mapY(MSTOM) - 2} fontSize="3" fill="red" fontWeight="bold">MTOM</text>

                                    <line x1={mapX(0)} y1={mapY(MSZFM)} x2={mapX(100)} y2={mapY(MSZFM)} stroke="orange" strokeWidth="0.5" strokeDasharray="2 1" />
                                    <text x="2" y={mapY(MSZFM) - 2} fontSize="3" fill="orange" fontWeight="bold">MZFM</text>


                                    {/* LIVE PLOT */}

                                    {/* 1. ZFM Point */}
                                    <circle cx={mapX(zfmIndex)} cy={mapY(ZFM)} r="1" fill="blue" />
                                    <text x={mapX(zfmIndex) + 2} y={mapY(ZFM)} fontSize="3" fill="blue" fontWeight="bold">ZFM</text>

                                    {/* 2. TOM Point */}
                                    <circle cx={mapX(tomIndex)} cy={mapY(TOM)} r="1" fill="black" />
                                    <text x={mapX(tomIndex) + 2} y={mapY(TOM)} fontSize="3" fill="black" fontWeight="bold">TOM</text>

                                    {/* 3. LM Point */}
                                    <circle cx={mapX(lmIndex)} cy={mapY(LM)} r="1" fill="green" />
                                    <text x={mapX(lmIndex) + 2} y={mapY(LM)} fontSize="3" fill="green" fontWeight="bold">LM</text>

                                    {/* CONNECTOR LINES (The "Drop Line" or "Load Vector") */}
                                    {/* DOM is roughly at DOI? Simplified visual: Start DOI -> ZFM -> TOM -> LM */}

                                    <path
                                        d={`
                                            M ${mapX(doi)} ${mapY(DOM)}
                                            L ${mapX(zfmIndex)} ${mapY(ZFM)}
                                            L ${mapX(tomIndex)} ${mapY(TOM)}
                                        `}
                                        fill="none"
                                        stroke="blue"
                                        strokeWidth="0.8"
                                        markerEnd="url(#arrowhead)"
                                    />
                                    <path
                                        d={`
                                            M ${mapX(tomIndex)} ${mapY(TOM)}
                                            L ${mapX(lmIndex)} ${mapY(LM)}
                                        `}
                                        fill="none"
                                        stroke="green"
                                        strokeWidth="0.8"
                                        strokeDasharray="2 1"
                                    />

                                    {/* Definitions for Markers */}
                                    <defs>
                                        <marker id="arrowhead" markerWidth="5" markerHeight="4" refX="2.5" refY="2" orient="auto">
                                            <polygon points="0 0, 5 2, 0 4" fill="blue" />
                                        </marker>
                                    </defs>

                                </svg>

                                {/* AXIS LABELS */}
                                <div className="absolute bottom-0 left-0 w-full flex justify-between text-[8px] font-mono px-2 translate-y-4">
                                    <span>Index 0</span>
                                    <span>Index 50</span>
                                    <span>Index 100</span>
                                </div>
                                <div className="absolute top-0 left-0 h-full flex flex-col justify-between text-[8px] font-mono -translate-x-6 py-2 text-right w-4">
                                    <span>50T</span>
                                    <span>40T</span>
                                    <span>30T</span>
                                    <span>20T</span>
                                </div>
                            </div>

                            {/* LEGEND */}
                            <div className="mt-6 flex justify-center gap-4 text-xs font-bold uppercase">
                                <div className="flex items-center gap-1 text-blue-600"><div className="w-3 h-3 bg-blue-600 rounded-full"></div> Loading Vector</div>
                                <div className="flex items-center gap-1 text-green-600"><div className="w-3 h-3 bg-green-600 rounded-full border-2 border-white "></div> Fuel Burn</div>
                                <div className="flex items-center gap-1 text-red-600"><div className="w-3 h-0.5 bg-red-600"></div> Limits</div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrimSheetSim;
