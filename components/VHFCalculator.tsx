import React, { useState } from 'react';
import { RefreshCw, Info, Radio, Plane, Compass, CheckCircle2 } from 'lucide-react';

const VHFCalculator: React.FC = () => {
  const [h1, setH1] = useState(400); // Ground station transmitter height AMSL (ft)
  const [h2, setH2] = useState(36000); // Aircraft receiver altitude (ft) - FL360

  // Standard ICAO / EASA Formula: Range (NM) = 1.23 * (sqrt(h_tx) + sqrt(h_rx))
  const sqrtH1 = Math.sqrt(h1);
  const sqrtH2 = Math.sqrt(h2);
  const rangeNM = 1.23 * (sqrtH1 + sqrtH2);

  // Optical Horizon (without atmospheric refraction, k=1.0): 1.06 * (sqrt(h1) + sqrt(h2))
  const opticalRangeNM = 1.06 * (sqrtH1 + sqrtH2);

  // Metric calculation: d (km) = 4.12 * (sqrt(h1_m) + sqrt(h2_m))
  const h1_m = h1 * 0.3048;
  const h2_m = h2 * 0.3048;
  const rangeKM = 4.12 * (Math.sqrt(h1_m) + Math.sqrt(h2_m));

  const loadPreset = (presetH1: number, presetH2: number) => {
    setH1(presetH1);
    setH2(presetH2);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-8 bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 text-slate-100 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-sky-500/20 text-sky-400 rounded-2xl">
              <Radio size={28} />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-white">
                VHF / UHF Line-of-Sight Range Calculator
              </h2>
              <p className="text-xs text-sky-400 font-mono mt-0.5">
                EASA 062.01 & 090.01 PROPAGATION PHYSICS
              </p>
            </div>
          </div>
          <div className="px-3 py-1 bg-sky-500/10 border border-sky-500/30 text-sky-300 rounded-full font-mono text-xs">
            Range (NM) = 1.23 × (√h_tx + √h_rx)
          </div>
        </div>
        <p className="text-slate-400 text-sm mt-3 leading-relaxed">
          VHF and UHF radio signals (VOR, DME, ILS, and voice airband) propagate as space waves along direct lines of sight.
          Atmospheric refraction bends the radio path slightly around the Earth's curvature, extending range ~15% beyond the optical horizon.
        </p>
      </div>

      {/* Preset Quick Buttons */}
      <div className="flex flex-wrap gap-2 text-xs font-mono">
        <span className="text-slate-500 flex items-center pr-2">PRESETS:</span>
        <button
          onClick={() => loadPreset(400, 36000)}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-300 rounded-xl border border-slate-700"
        >
          Croucher ATPL: FL360 + 400 ft VOR (258 NM)
        </button>
        <button
          onClick={() => loadPreset(100, 10000)}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700"
        >
          FL100 + 100 ft Tower (135 NM)
        </button>
        <button
          onClick={() => loadPreset(0, 3000)}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700"
        >
          VFR 3,000 ft + Sea Level Ground Station (67 NM)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sliders & Inputs (6/12) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Input H1 (Transmitter) */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-300 font-mono flex items-center gap-2">
                <Radio size={14} className="text-sky-400" />
                TRANSMITTER ANTENNA ELEVATION (h_tx)
              </label>
              <span className="font-mono font-bold text-sky-400 text-base">{h1.toLocaleString()} ft AMSL</span>
            </div>
            <input
              type="range"
              min="0"
              max="5000"
              step="25"
              value={h1}
              onChange={e => setH1(Number(e.target.value))}
              className="w-full accent-sky-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 ft (Sea Level)</span>
              <span>√h_tx = {sqrtH1.toFixed(2)}</span>
              <span>5,000 ft (Mountain VOR)</span>
            </div>
          </div>

          {/* Input H2 (Aircraft Altitude) */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-300 font-mono flex items-center gap-2">
                <Plane size={14} className="text-sky-400" />
                AIRCRAFT ALTITUDE (h_rx)
              </label>
              <span className="font-mono font-bold text-sky-400 text-base">{h2.toLocaleString()} ft (FL{Math.round(h2 / 100)})</span>
            </div>
            <input
              type="range"
              min="500"
              max="45000"
              step="500"
              value={h2}
              onChange={e => setH2(Number(e.target.value))}
              className="w-full accent-sky-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>500 ft (Low VFR)</span>
              <span>√h_rx = {sqrtH2.toFixed(2)}</span>
              <span>FL450 (High Cruise)</span>
            </div>
          </div>

          {/* Step-by-Step Breakdown */}
          <div className="p-5 bg-slate-950 rounded-2xl border border-white/5 space-y-2.5 font-mono text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Transmitter Component (1.23 × √{h1}):</span>
              <span className="text-white font-bold">{(1.23 * sqrtH1).toFixed(1)} NM</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Aircraft Component (1.23 × √{h2}):</span>
              <span className="text-white font-bold">{(1.23 * sqrtH2).toFixed(1)} NM</span>
            </div>
            <div className="flex justify-between border-t border-slate-800 pt-2 text-slate-400">
              <span>Optical Line of Sight (No Refraction, 1.06):</span>
              <span className="text-amber-400 font-bold">{opticalRangeNM.toFixed(1)} NM</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Metric Standard (4.12 × [√h₁_m + √h₂_m]):</span>
              <span className="text-slate-200 font-bold">{rangeKM.toFixed(1)} km</span>
            </div>
          </div>
        </div>

        {/* Visual Diagram & High-Yield Facts (6/12) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Theoretical Range Display */}
          <div className="bg-gradient-to-br from-sky-950/40 via-slate-950 to-slate-950 p-6 rounded-2xl border border-sky-500/30 text-center relative overflow-hidden">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest block mb-1">
              THEORETICAL MAXIMUM VHF RANGE
            </span>
            <div className="text-5xl md:text-6xl font-black text-sky-400 font-mono tracking-tight">
              {rangeNM.toFixed(1)} <span className="text-xl text-slate-400 font-normal">NM</span>
            </div>
            <p className="text-xs text-sky-200/70 mt-2 font-mono">
              ({Math.round(rangeKM)} km / {Math.round(rangeNM * 1.15078)} Statute Miles)
            </p>

            {/* SVG Visual Arc */}
            <div className="mt-6 w-full h-32 relative">
              <svg viewBox="0 0 400 120" className="w-full h-full">
                {/* Earth Curvature */}
                <path d="M 0 110 Q 200 80 400 110" fill="none" stroke="#334155" strokeWidth="3" />
                <text x="200" y="105" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">EARTH CURVATURE</text>

                {/* Ground Tower */}
                <line x1="50" y1="102" x2="50" y2="60" stroke="#38bdf8" strokeWidth="3" />
                <circle cx="50" cy="60" r="4" fill="#38bdf8" />
                <text x="50" y="52" textAnchor="middle" fill="#38bdf8" fontSize="8" fontFamily="monospace">TX ({h1} ft)</text>

                {/* Aircraft */}
                <circle cx="350" cy="30" r="4" fill="#10b981" />
                <path d="M 345 30 L 355 30 M 350 25 L 350 35" stroke="#10b981" strokeWidth="2" />
                <text x="350" y="20" textAnchor="middle" fill="#10b981" fontSize="8" fontFamily="monospace">RX ({h2} ft)</text>

                {/* Tangent Radio Ray (Bending around curve) */}
                <line x1="50" y1="60" x2="350" y2="30" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,4" />
                <text x="200" y="40" textAnchor="middle" fill="#f59e0b" fontSize="8" fontFamily="monospace">
                  Direct Line of Sight ({rangeNM.toFixed(0)} NM)
                </text>
              </svg>
            </div>
          </div>

          {/* Why 1.23 instead of 1.06? Explainer */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 text-xs text-slate-300">
            <h4 className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              Why the 1.23 Constant? (The 4/3 Earth Radius Factor)
            </h4>
            <p className="leading-relaxed">
              In a vacuum, the geometric optical horizon factor is √(2h) ≈ 1.06.
              However, in the standard atmosphere, atmospheric density and water vapor decrease with altitude, causing the refractive index to drop.
              This produces standard atmospheric refraction where radio waves curve downwards toward the denser air.
            </p>
            <p className="leading-relaxed font-mono text-[11px] text-sky-300">
              Effective Earth Radius = 4/3 × True Earth Radius (8,500 km instead of 6,371 km).
              Replacing the radius into the horizon equation increases the constant from 1.06 to <strong>1.23</strong>!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VHFCalculator;
