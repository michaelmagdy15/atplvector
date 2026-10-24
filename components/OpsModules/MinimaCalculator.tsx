import React, { useState } from 'react';
import { 
  Ruler, Eye, Cloud, AlertTriangle, CheckCircle2, 
  XCircle, ArrowDown, Gauge, Shield, AlertOctagon, HelpCircle 
} from 'lucide-react';
import { AWO_OPERATING_MINIMA_DATA } from '../../data/courseData';

const MinimaCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'alternate' | 'awo' | 'ban'>('awo');

  // Alternate Planning State
  const [approachType, setApproachType] = useState<string>('cat1');
  const [cat1Rvr, setCat1Rvr] = useState<number>(550);
  const [npaRvr, setNpaRvr] = useState<number>(1000);
  const [npaCeiling, setNpaCeiling] = useState<number>(400); // MDH
  const [circlingVis, setCirclingVis] = useState<number>(1500);
  const [circlingCeiling, setCirclingCeiling] = useState<number>(1000);

  // Approach Ban State
  const [reportedRvr, setReportedRvr] = useState<number>(450);
  const [requiredRvr, setRequiredRvr] = useState<number>(550);
  const [currentAltitude, setCurrentAltitude] = useState<number>(1200); // ft AAL
  const [visualsAcquiredAtDh, setVisualsAcquiredAtDh] = useState<boolean>(false);

  // Selected AWO Category for details
  const [selectedAwo, setSelectedAwo] = useState<string>('CAT I');

  // Alternate planning calculation
  const getAlternateMinima = () => {
    let rvr = 0;
    let ceiling: number | string = "N/A";
    let note = "";

    switch (approachType) {
      case 'cat23':
        rvr = cat1Rvr;
        ceiling = "N/A";
        note = "Planning Minima for CAT II/III is standard CAT I RVR (Ceiling not applicable under EASA).";
        break;
      case 'cat1':
        rvr = npaRvr;
        ceiling = npaCeiling;
        note = "Planning Minima for CAT I is Non-Precision Approach (NPA) RVR and Ceiling (MDH).";
        break;
      case 'npa':
        rvr = npaRvr + 1000;
        ceiling = npaCeiling + 200;
        note = "Planning Minima for NPA is charted RVR + 1,000 m & charted MDH + 200 ft.";
        break;
      case 'circle':
        rvr = circlingVis;
        ceiling = circlingCeiling;
        note = "Planning Minima for Circling is standard Circling Minima (both ceiling and visibility).";
        break;
    }

    return { rvr, ceiling, note };
  };

  const altResult = getAlternateMinima();

  // Approach Ban Logic (Croucher Ch 08)
  const isBelowMinima = reportedRvr < requiredRvr;
  const isAbove1000ftGate = currentAltitude >= 1000;

  // Decision outcomes:
  // If reported RVR < Minima:
  //   - If >= 1000ft: Approach Ban active! MUST NOT continue past 1,000 ft.
  //   - If < 1000ft: Aircraft passed 1,000ft gate legally; MAY continue down to DH ("look-see").
  const banActive = isBelowMinima && isAbove1000ftGate;
  const canContinueToDh = !isBelowMinima || !isAbove1000ftGate;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-700 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-500/30 text-indigo-400">
            <Ruler size={32} />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              All-Weather Operations & Approach Minima
            </h2>
            <p className="text-slate-400 text-sm">
              EASA Part-CAT.OP.MPA.110 • AWO Precision Minima, Approach Ban 1,000 ft Gate & Alternate Planning
            </p>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 bg-slate-800/60 p-1.5 rounded-2xl w-fit border border-slate-700">
        {[
          { id: 'awo', label: '1. AWO Cat I - IIIC Minima' },
          { id: 'ban', label: '2. Approach Ban Rules Engine' },
          { id: 'alternate', label: '3. Alternate Planning Minima' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl font-bold text-xs md:text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: AWO PRECISION CATEGORIES I TO IIIC */}
      {activeTab === 'awo' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {AWO_OPERATING_MINIMA_DATA.map(awo => (
              <button
                key={awo.category}
                onClick={() => setSelectedAwo(awo.category)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedAwo === awo.category
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-xl shadow-indigo-600/20 scale-[1.02]'
                    : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-xl font-black mb-1">{awo.category}</div>
                <div className="text-xs font-mono font-bold text-indigo-300">DH: {awo.dh}</div>
                <div className="text-xs font-mono text-slate-300">RVR: {awo.rvr}</div>
              </button>
            ))}
          </div>

          {/* Selected AWO Specification Card */}
          {(() => {
            const current = AWO_OPERATING_MINIMA_DATA.find(a => a.category === selectedAwo)!;
            return (
              <div className="bg-slate-900 rounded-3xl border border-indigo-500/30 p-6 md:p-8 space-y-6 shadow-2xl">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-3xl font-black text-white">{current.category} Precision Standards</h3>
                    <p className="text-indigo-400 text-xs font-bold uppercase tracking-wider mt-0.5">
                      Decision Height & Runway Visual Range Minima
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center min-w-[120px]">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Min Decision Height</span>
                      <span className="text-lg font-black text-white font-mono">{current.dh}</span>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center min-w-[120px]">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Min RVR</span>
                      <span className="text-lg font-black text-emerald-400 font-mono">{current.rvr}</span>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Eye className="text-emerald-400 w-4 h-4" />
                      Visual Reference Required to Land
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {current.visualRefRequired}
                    </p>
                  </div>

                  <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Gauge className="text-indigo-400 w-4 h-4" />
                      Avionics & Airborne Systems Required
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {current.systemReq}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-indigo-950/30 rounded-2xl border border-indigo-500/20 text-xs text-indigo-200">
                  <strong className="text-indigo-300 block mb-0.5">Croucher Technical Context:</strong>
                  {current.croucherNotes}
                </div>
              </div>
            );
          })()}

          {/* Low Visibility Procedures (LVP) Trigger Card */}
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-700 flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-bold text-white text-base flex items-center gap-2">
                <Shield className="text-cyan-400 w-5 h-5" />
                Low Visibility Procedures (LVP) Enforced
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                Aerodromes enforce Low Visibility Procedures whenever the Runway Visual Range falls below <strong>550 m</strong> or the Cloud Ceiling drops below <strong>200 ft</strong>.
                Under LVP, taxiway stop-bars are radar-interlocked, ILS critical and sensitive areas are cleared of aircraft/vehicles to prevent signal distortion, and ground taxi speeds are restricted.
              </p>
            </div>
            <div className="bg-cyan-950/40 border border-cyan-500/30 p-4 rounded-xl text-center shrink-0">
              <span className="text-[10px] text-cyan-400 uppercase font-bold block">LVP Trigger Gate</span>
              <span className="text-xl font-mono font-black text-white">RVR &lt; 550m</span>
              <span className="text-xs text-slate-400 block">or Ceiling &lt; 200ft</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: APPROACH BAN RULES ENGINE (CROUCHER WORKED EXAMPLE) */}
      {activeTab === 'ban' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Controls */}
            <div className="lg:col-span-6 bg-slate-900 p-6 rounded-3xl border border-slate-700 space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <AlertTriangle className="text-amber-400 w-5 h-5" />
                Simulate Approach Ban Scenario
              </h3>

              {/* Required Minima */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-400 font-bold uppercase">Required Charted RVR:</span>
                  <span className="font-mono text-white font-bold">{requiredRvr} m</span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="1200"
                  step="50"
                  value={requiredRvr}
                  onChange={(e) => setRequiredRvr(Number(e.target.value))}
                  className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Reported RVR */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-400 font-bold uppercase">Reported ATC RVR:</span>
                  <span className={`font-mono font-bold ${reportedRvr < requiredRvr ? 'text-red-400' : 'text-emerald-400'}`}>
                    {reportedRvr} m {reportedRvr < requiredRvr ? '(BELOW MINIMA)' : '(LEGAL)'}
                  </span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="1200"
                  step="50"
                  value={reportedRvr}
                  onChange={(e) => setReportedRvr(Number(e.target.value))}
                  className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Current Aircraft Altitude */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-400 font-bold uppercase">Aircraft Altitude Above Aerodrome (AAL):</span>
                  <span className="font-mono text-cyan-400 font-bold">{currentAltitude} ft</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="2500"
                  step="50"
                  value={currentAltitude}
                  onChange={(e) => setCurrentAltitude(Number(e.target.value))}
                  className="w-full accent-cyan-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>100 ft (Near DH)</span>
                  <span className="text-amber-400 font-bold">1,000 ft (Approach Ban Gate)</span>
                  <span>2,500 ft (Intercept)</span>
                </div>
              </div>

              {/* If below 1000ft, toggle whether visual cues acquired at DH */}
              {!isAbove1000ftGate && (
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-300 block">
                    At Decision Height (200 ft): Are required visual references acquired?
                  </span>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setVisualsAcquiredAtDh(true)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                        visualsAcquiredAtDh ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'
                      }`}
                    >
                      Yes, Visual Contact Established
                    </button>
                    <button
                      onClick={() => setVisualsAcquiredAtDh(false)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                        !visualsAcquiredAtDh ? 'bg-red-600 border-red-400 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'
                      }`}
                    >
                      No Visual Contact
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Decision Output & Visualization */}
            <div className="lg:col-span-6 space-y-6">
              {/* Verdict Card */}
              <div className={`p-6 rounded-3xl border-2 text-center transition-all ${
                banActive
                  ? 'bg-red-950/40 border-red-500 text-red-200'
                  : canContinueToDh
                    ? (isBelowMinima ? 'bg-amber-950/40 border-amber-500 text-amber-200' : 'bg-emerald-950/40 border-emerald-500 text-emerald-200')
                    : 'bg-slate-900 border-slate-700'
              }`}>
                <div className="flex justify-center mb-3">
                  {banActive ? (
                    <XCircle size={56} className="text-red-500" />
                  ) : isBelowMinima ? (
                    <AlertTriangle size={56} className="text-amber-400" />
                  ) : (
                    <CheckCircle2 size={56} className="text-emerald-400" />
                  )}
                </div>

                <h4 className="text-2xl font-black mb-2">
                  {banActive
                    ? 'APPROACH BAN ACTIVE — GO-AROUND MANDATORY'
                    : isBelowMinima
                      ? (visualsAcquiredAtDh && currentAltitude <= 200 ? 'LANDING PERMITTED' : 'LOOK-SEE PERMITTED DOWN TO DH')
                      : 'NORMAL APPROACH PERMITTED'}
                </h4>

                <p className="text-xs leading-relaxed max-w-md mx-auto text-slate-300">
                  {banActive && (
                    <span>
                      The reported RVR ({reportedRvr} m) is below the required minimum ({requiredRvr} m) while the aircraft is at {currentAltitude} ft (above the 1,000 ft gate / outer marker). 
                      <strong>The approach MUST NOT be continued beyond 1,000 ft!</strong>
                    </span>
                  )}
                  {!banActive && isBelowMinima && (
                    <span>
                      Aircraft passed the 1,000 ft gate while legal (or is below 1,000 ft). Under Part-CAT, the approach <strong>MAY continue down to Decision Height (DH)</strong>. 
                      {visualsAcquiredAtDh ? ' Visual cues acquired at DH: Landing is legal!' : ' If no visual cues at DH: Go-around mandatory!'}
                    </span>
                  )}
                  {!banActive && !isBelowMinima && (
                    <span>
                      Reported RVR ({reportedRvr} m) meets or exceeds charted requirement ({requiredRvr} m). Normal approach authorized down to DA/H.
                    </span>
                  )}
                </p>
              </div>

              {/* The Two Worked Examples from Croucher */}
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-700 text-xs space-y-3">
                <span className="font-bold text-white uppercase text-[10px] block">
                  Croucher ATPL Worked Examples Reference:
                </span>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="font-bold text-amber-400">Case 1: At 1,200 ft AGL, RVR drops to 450 m (Min: 550 m)</div>
                  <p className="text-slate-400">
                    Decision: Above 1,000 ft / outer marker. Approach ban applies. Aircraft MUST NOT continue past 1,000 ft; execute missed approach or enter hold immediately.
                  </p>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="font-bold text-emerald-400">Case 2: Passes 1,000 ft with RVR 600 m; at 700 ft ATC reports RVR 400 m</div>
                  <p className="text-slate-400">
                    Decision: Aircraft passed 1,000 ft while legal. It MAY continue down to Decision Height (200 ft). If visual references acquired at DH, landing is permitted.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ALTERNATE PLANNING MINIMA (EASA PART-CAT) */}
      {activeTab === 'alternate' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Configuration */}
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-700 space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
                  Approach Available at Planned Alternate
                </label>
                <select
                  value={approachType}
                  onChange={(e) => setApproachType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-sm font-bold"
                >
                  <option value="cat23">Precision ILS CAT II or III Available</option>
                  <option value="cat1">Precision ILS CAT I Available</option>
                  <option value="npa">Non-Precision (NPA) or APV Available</option>
                  <option value="circle">Circling Approach Only</option>
                </select>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                  Charted Minima for Selected Approach
                </h4>

                {approachType === 'cat23' && (
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                    <label className="text-xs text-slate-400 block mb-1">Charted CAT I RVR for this Runway (m)</label>
                    <input
                      type="number"
                      value={cat1Rvr}
                      onChange={e => setCat1Rvr(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono font-bold"
                    />
                  </div>
                )}

                {approachType === 'cat1' && (
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">NPA RVR (m)</label>
                      <input
                        type="number"
                        value={npaRvr}
                        onChange={e => setNpaRvr(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">NPA MDH (ft)</label>
                      <input
                        type="number"
                        value={npaCeiling}
                        onChange={e => setNpaCeiling(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono font-bold"
                      />
                    </div>
                  </div>
                )}

                {approachType === 'npa' && (
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Charted NPA RVR (m)</label>
                      <input
                        type="number"
                        value={npaRvr}
                        onChange={e => setNpaRvr(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Charted MDH (ft)</label>
                      <input
                        type="number"
                        value={npaCeiling}
                        onChange={e => setNpaCeiling(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono font-bold"
                      />
                    </div>
                  </div>
                )}

                {approachType === 'circle' && (
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Charted Visibility (m)</label>
                      <input
                        type="number"
                        value={circlingVis}
                        onChange={e => setCirclingVis(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Charted Ceiling (ft)</label>
                      <input
                        type="number"
                        value={circlingCeiling}
                        onChange={e => setCirclingCeiling(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono font-bold"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Required Forecast Conditions Output */}
            <div className="flex flex-col justify-center space-y-4">
              <div className="rounded-3xl bg-slate-900 text-white p-8 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                <h3 className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-6">
                  Required Weather Forecast (TAF) at Alternate
                </h3>

                <div className="grid grid-cols-2 gap-6 text-center">
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                    <div className="flex justify-center items-center text-indigo-400 mb-2">
                      <Eye className="w-5 h-5 mr-1" />
                      <span className="font-bold text-xs uppercase">Required RVR</span>
                    </div>
                    <div className="text-4xl font-black text-white font-mono">
                      {altResult.rvr}
                      <span className="text-base font-normal text-slate-400 ml-1">m</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">or greater</div>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                    <div className="flex justify-center items-center text-indigo-400 mb-2">
                      <Cloud className="w-5 h-5 mr-1" />
                      <span className="font-bold text-xs uppercase">Required Ceiling</span>
                    </div>
                    <div className="text-4xl font-black text-white font-mono">
                      {altResult.ceiling}
                      <span className="text-base font-normal text-slate-400 ml-1">
                        {altResult.ceiling !== "N/A" && "ft"}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">or higher</div>
                  </div>
                </div>

                <div className="mt-6 p-3 bg-indigo-950/30 rounded-xl border border-indigo-500/20 text-xs text-indigo-300">
                  <strong>Planning Rule:</strong> {altResult.note}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RTFQ Exam Traps Defense Section */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-red-500/30 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <AlertOctagon className="text-red-400" />
          AWO & Approach Ban RTFQ Exam Traps
        </h3>
        <div className="grid md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h5 className="font-bold text-amber-400 mb-1">Does Ceiling Affect the Approach Ban?</h5>
            <p className="text-slate-400 leading-relaxed">
              <strong>TRAP:</strong> "Ceiling is below Decision Height, can you commence approach?" 
              <strong>CORRECT:</strong> Under EASA Part-CAT, the Approach Ban is controlled strictly by <strong>RVR (or visibility)</strong>, NOT ceiling! An approach is legal even with zero ceiling if RVR is adequate.
            </p>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h5 className="font-bold text-amber-400 mb-1">Which RVR Transmissometer Controls?</h5>
            <p className="text-slate-400 leading-relaxed">
              <strong>TRAP:</strong> Touchdown RVR is always the controlling RVR. If midpoint and stop-end are reported, they must meet the rollout minima (typically 75 m to 125 m).
            </p>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h5 className="font-bold text-amber-400 mb-1">Fail-Passive vs Fail-Operational Autoland</h5>
            <p className="text-slate-400 leading-relaxed">
              <strong>TRAP:</strong> CAT IIIA requires fail-passive minimum (pilot takes over manually if autopilot disconnects). CAT IIIB with RVR &lt; 125m strictly mandates fail-operational (dual active channels, automatic rollout).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinimaCalculator;
