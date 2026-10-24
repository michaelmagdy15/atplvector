import React, { useState, useEffect, useRef } from 'react';
import { View } from '../../types';
import { ChevronLeft, Map, Compass, Info, HelpCircle, Layers, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  onChangeView: (view: View) => void;
}

const ProjectionsExplorer: React.FC<Props> = ({ onChangeView }) => {
  const [projection, setProjection] = useState<'MERCATOR' | 'LAMBERT' | 'POLAR'>('MERCATOR');

  // Coordinates State for track changes
  const [latA, setLatA] = useState(60);
  const [lonA, setLonA] = useState(-30);
  const [latB, setLatB] = useState(60);
  const [lonB, setLonB] = useState(10);

  // Lambert specific: Standard Parallels and Parallel of Origin
  const [stdPar1, setStdPar1] = useState(30);
  const [stdPar2, setStdPar2] = useState(60);
  const [parallelOfOrigin, setParallelOfOrigin] = useState(45); // φ₀

  // Mercator specific: Latitude for Scale Factor
  const [mercatorLat, setMercatorLat] = useState(60);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Calculations
  const deltaLon = Math.abs(lonB - lonA);
  const meanLat = (latA + latB) / 2;

  // Earth Convergency = deltaLon * sin(meanLat)
  const earthConvergency = deltaLon * Math.sin((meanLat * Math.PI) / 180);

  // Constant of the cone (n)
  // For Lambert: n = sin(parallelOfOrigin)
  // For Polar Stereographic: n = 1
  // For Direct Mercator: n = 0
  const n = projection === 'POLAR'
    ? 1.0
    : projection === 'LAMBERT'
      ? Math.sin((parallelOfOrigin * Math.PI) / 180)
      : 0;

  // Chart Convergency = deltaLon * n
  const chartConvergency = deltaLon * n;

  // Mercator Scale Factor: SF = sec(Lat) = 1 / cos(Lat)
  const mercatorScaleFactor = 1 / Math.cos((mercatorLat * Math.PI) / 180);

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;

    ctx.lineWidth = 1.5;

    if (projection === 'MERCATOR') {
      // Direct Mercator Grid
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, w, h);

      // Parallel Straight Meridians
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      for (let x = 40; x < w; x += 55) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      // Parallels (Spacing expanding with sec(Lat) away from Equator at cy)
      let currentY = cy;
      let spacing = 18;
      for (let i = 0; currentY > 0; i++) {
        ctx.beginPath();
        ctx.moveTo(0, currentY);
        ctx.lineTo(w, currentY);
        ctx.stroke();
        currentY -= spacing;
        spacing *= 1.22; // secant expansion visualization
      }
      currentY = cy;
      spacing = 18;
      for (let i = 0; currentY < h; i++) {
        ctx.beginPath();
        ctx.moveTo(0, currentY);
        ctx.lineTo(w, currentY);
        ctx.stroke();
        currentY += spacing;
        spacing *= 1.22;
      }

      // Equator
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(w, cy);
      ctx.stroke();
      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText('EQUATOR (TRUE SCALE: SF = 1.0)', 10, cy - 4);

      // Rhumb Line: Straight Line on Mercator
      ctx.strokeStyle = '#f59e0b'; // Amber
      ctx.setLineDash([5, 4]);
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(50, cy - 30);
      ctx.lineTo(w - 50, cy - 70);
      ctx.stroke();
      ctx.setLineDash([]);

      // Great Circle: Curved Line, CONVEX to the nearer pole (Northern Pole is up)
      ctx.strokeStyle = '#38bdf8'; // Sky blue
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(50, cy - 30);
      ctx.quadraticCurveTo(cx, cy - 130, w - 50, cy - 70);
      ctx.stroke();

      // Labels on Canvas
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('Great Circle (Curves to Pole)', cx - 60, cy - 135);
      ctx.fillStyle = '#f59e0b';
      ctx.fillText('Rhumb Line (Straight Line)', cx - 55, cy - 40);

    } else if (projection === 'LAMBERT') {
      // Lambert Conformal Conic (Converging meridians & concentric parallels)
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      const apexX = cx;
      const apexY = -90; // Apex of the cone

      // Meridians converging at apex
      for (let angleDeg = -42; angleDeg <= 42; angleDeg += 12) {
        const rad = (angleDeg * Math.PI) / 180;
        ctx.beginPath();
        ctx.moveTo(apexX, apexY);
        ctx.lineTo(apexX + Math.sin(rad) * 460, apexY + Math.cos(rad) * 460);
        ctx.stroke();
      }

      // Parallels (Concentric circular arcs)
      for (let radius = 170; radius <= 420; radius += 45) {
        ctx.beginPath();
        ctx.arc(apexX, apexY, radius, Math.PI / 2 - 0.75, Math.PI / 2 + 0.75);
        ctx.stroke();
      }

      // Standard Parallels Highlighting (SP1 and SP2)
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)'; // Green = True scale
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(apexX, apexY, 215, Math.PI / 2 - 0.75, Math.PI / 2 + 0.75);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(apexX, apexY, 350, Math.PI / 2 - 0.75, Math.PI / 2 + 0.75);
      ctx.stroke();

      ctx.fillStyle = '#10b981';
      ctx.font = '10px monospace';
      ctx.fillText(`SP 2 (${stdPar2}°N) - SCALE TRUE (1.0)`, cx - 180, 135);
      ctx.fillText(`SP 1 (${stdPar1}°N) - SCALE TRUE (1.0)`, cx - 180, 270);
      ctx.fillStyle = '#f43f5e';
      ctx.fillText('Between SPs: COMPRESSED (< 1.0)', cx - 80, 205);

      // Great Circle on Lambert: Virtually a Straight Line!
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx - 130, 240);
      ctx.lineTo(cx + 130, 240);
      ctx.stroke();

      // Rhumb Line on Lambert: Curved, CONCAVE to the parallel of origin/apex
      ctx.strokeStyle = '#f59e0b';
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(cx - 130, 240);
      ctx.quadraticCurveTo(cx, 265, cx + 130, 240);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#38bdf8';
      ctx.fillText('Straight line ≈ Great Circle', cx - 60, 230);

    } else {
      // Polar Stereographic (Meridians radiating from center pole)
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';

      // Radiating straight meridians from Pole (cx, cy)
      for (let angleDeg = 0; angleDeg < 360; angleDeg += 30) {
        const rad = (angleDeg * Math.PI) / 180;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(rad) * 170, cy + Math.sin(rad) * 170);
        ctx.stroke();
      }

      // Concentric circles (Parallels of latitude)
      for (let r = 35; r <= 150; r += 35) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Pole label
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('NORTH POLE (n = 1.0)', cx - 55, cy - 8);

      // Great Circle (Nearly a straight line across polar cap)
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx - 110, cy - 50);
      ctx.lineTo(cx + 110, cy - 50);
      ctx.stroke();

      // Rhumb Line (Spiral concave to the pole)
      ctx.strokeStyle = '#f59e0b';
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(cx - 110, cy - 50);
      ctx.quadraticCurveTo(cx, cy - 20, cx + 110, cy - 50);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [projection, parallelOfOrigin, stdPar1, stdPar2]);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500 text-slate-100">
      {/* Back Button */}
      <button
        onClick={() => onChangeView(View.GEN_NAV_HOME)}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span>Back to General Navigation</span>
      </button>

      {/* Header Banner */}
      <div className="glass-panel p-8 md:p-12 rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-slate-900 via-cyan-950/30 to-slate-900 relative overflow-hidden">
        <div className="flex items-center gap-4 mb-4 relative z-10">
          <div className="p-3 bg-cyan-500/20 rounded-2xl text-cyan-400">
            <Map size={32} />
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              Aeronautical Chart Projections
            </h1>
            <p className="text-xs font-mono text-cyan-300 mt-1">EASA 061.04 CHARTS & CONFORMALITY</p>
          </div>
        </div>
        <p className="text-slate-300 text-sm md:text-base max-w-3xl leading-relaxed relative z-10">
          Analyze projection distortion mechanics: Direct Mercator scale expansion ($\sec \text{Lat}$), Lambert Conformal
          conic standard parallels, and Polar Stereographic track convergency ($n = 1.0$).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Selector & Formulas (5/12) */}
        <div className="lg:col-span-5 bg-slate-900/60 p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6">
          <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <Layers size={18} className="text-cyan-400" />
            Projection Model Selector
          </h3>

          {/* Tab Selector */}
          <div className="flex bg-slate-950 p-1 rounded-xl">
            <button
              onClick={() => setProjection('MERCATOR')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                projection === 'MERCATOR'
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Direct Mercator
            </button>
            <button
              onClick={() => setProjection('LAMBERT')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                projection === 'LAMBERT'
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Lambert Conic
            </button>
            <button
              onClick={() => setProjection('POLAR')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                projection === 'POLAR'
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Polar Stereo
            </button>
          </div>

          {/* MERCATOR SPECIFIC: SCALE EXPANSION SLIDER */}
          {projection === 'MERCATOR' && (
            <div className="space-y-4 pt-2">
              <div className="p-4 bg-slate-950 rounded-2xl border border-cyan-500/20 space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase">MERCATOR SCALE EXPANSION</span>
                <div className="text-xl font-black text-cyan-400 font-mono">
                  Scale Factor = sec(Latitude) = 1 / cos(φ)
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Scale is only true at the Equator (SF = 1.0). Towards the poles, scale expands to infinity.
                </p>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 font-mono mb-2">
                  <span>AUDIT LATITUDE (φ):</span>
                  <strong className="text-cyan-400 font-bold">{mercatorLat}° N/S</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  step="1"
                  value={mercatorLat}
                  onChange={e => setMercatorLat(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>0° (Eq: 1.0×)</span>
                  <span>60° (2.0× - Double!)</span>
                  <span>80° (5.76× - Huge distortion)</span>
                </div>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-white/5 space-y-2 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">cos({mercatorLat}°):</span>
                  <span className="text-white font-bold">{Math.cos((mercatorLat * Math.PI) / 180).toFixed(4)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-2 text-sm text-cyan-400 font-bold">
                  <span>Scale Factor (sec φ):</span>
                  <span>{mercatorScaleFactor.toFixed(3)}×</span>
                </div>
                <p className="text-[11px] text-slate-400 pt-1 italic">
                  A 100 NM distance measured at {mercatorLat}° latitude appears {Math.round(100 * mercatorScaleFactor)} NM wide on the chart!
                </p>
              </div>
            </div>
          )}

          {/* LAMBERT SPECIFIC CONTROLS */}
          {projection === 'LAMBERT' && (
            <div className="space-y-4 pt-2">
              <div className="p-4 bg-slate-950 rounded-2xl border border-cyan-500/20 space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase">CONSTANT OF THE CONE (n)</span>
                <div className="text-xl font-black text-cyan-400 font-mono">
                  n = sin(Parallel of Origin φ₀)
                </div>
                <p className="text-xs text-slate-400">
                  Chart Convergency = ΔLong × n.
                </p>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 font-mono mb-2">
                  <span>PARALLEL OF ORIGIN (φ₀):</span>
                  <strong className="text-cyan-400 font-bold">{parallelOfOrigin}° N</strong>
                </div>
                <input
                  type="range"
                  min="15"
                  max="75"
                  value={parallelOfOrigin}
                  onChange={e => {
                    const po = Number(e.target.value);
                    setParallelOfOrigin(po);
                    setStdPar1(Math.max(10, po - 15));
                    setStdPar2(Math.min(80, po + 15));
                  }}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl">
                  <span className="text-slate-400 block text-[10px]">STANDARD PARALLEL 1</span>
                  <span className="text-emerald-400 font-bold text-sm">{stdPar1}° N (Scale True)</span>
                </div>
                <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl">
                  <span className="text-slate-400 block text-[10px]">STANDARD PARALLEL 2</span>
                  <span className="text-emerald-400 font-bold text-sm">{stdPar2}° N (Scale True)</span>
                </div>
              </div>
            </div>
          )}

          {/* POLAR STEREOGRAPHIC SPECIFIC */}
          {projection === 'POLAR' && (
            <div className="p-4 bg-slate-950 rounded-2xl border border-cyan-500/20 space-y-3 text-xs">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">POLAR CONVERGENCY LAW</span>
              <div className="text-xl font-black text-cyan-400 font-mono">n = 1.0000</div>
              <p className="text-slate-300 leading-relaxed">
                On a Polar Stereographic chart, the Constant of the Cone is exactly 1.
                <strong> Chart Convergency = Change in Longitude (Δλ)</strong>.
                A straight-line flight from 030°W to 050°E undergoes a track change of exactly 80°!
              </p>
            </div>
          )}

          {/* TRACK CONVERGENCY CALCULATOR */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-slate-300">Chart Track Deviation Calculator</h4>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1 font-mono">POINT A LONGITUDE (°)</label>
                <input
                  type="number"
                  value={lonA}
                  onChange={e => setLonA(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-sm"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1 font-mono">POINT B LONGITUDE (°)</label>
                <input
                  type="number"
                  value={lonB}
                  onChange={e => setLonB(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-sm"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-white/5 space-y-2.5 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Change in Longitude (Δλ):</span>
                <span className="text-white font-bold">{deltaLon}°</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Constant of Cone (n):</span>
                <span className="text-white font-bold">{n.toFixed(4)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-2 text-cyan-400 font-bold text-sm">
                <span>Straight Line Track Change:</span>
                <span>{chartConvergency.toFixed(2)}°</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Canvas Grid & Detailed ATPL Laws (7/12) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/60 p-6 md:p-8 rounded-3xl border border-slate-800 flex flex-col items-center shadow-2xl">
            <canvas
              ref={canvasRef}
              width={520}
              height={320}
              className="w-full bg-slate-950 rounded-2xl border border-slate-800 shadow-inner max-w-xl"
            />
            <div className="flex flex-wrap justify-between items-center w-full mt-4 text-xs font-bold gap-3 px-2">
              <span className="text-sky-400 flex items-center gap-1.5">
                <span className="w-4 h-1 bg-sky-400 rounded-full inline-block"></span>
                Great Circle Path
              </span>
              <span className="text-amber-400 flex items-center gap-1.5">
                <span className="w-4 h-0.5 border-t border-dashed border-amber-400 inline-block"></span>
                Rhumb Line Path
              </span>
            </div>
          </div>

          {/* Projection Conformality & Scale Distribution Table */}
          <div className="bg-slate-900/60 p-6 md:p-8 rounded-3xl border border-slate-800 space-y-5">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Compass size={18} className="text-cyan-400" />
              Chart Conformality & Scale Comparison
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <strong className="text-cyan-400 block">Direct Mercator</strong>
                <ul className="space-y-1.5 text-slate-300 list-disc pl-4">
                  <li><strong>Meridians:</strong> Parallel straight lines.</li>
                  <li><strong>Rhumb Line:</strong> Straight line.</li>
                  <li><strong>Great Circle:</strong> Curved convex to nearer pole.</li>
                  <li><strong>Scale:</strong> True ONLY at Equator; expands with $\sec(\text{Lat})$. Unusable above 70°.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <strong className="text-emerald-400 block">Lambert Conformal</strong>
                <ul className="space-y-1.5 text-slate-300 list-disc pl-4">
                  <li><strong>Meridians:</strong> Straight lines converging at cone apex.</li>
                  <li><strong>Rhumb Line:</strong> Curved concave to parallel of origin.</li>
                  <li><strong>Great Circle:</strong> Practically a straight line!</li>
                  <li><strong>Scale:</strong> True at standard parallels; compressed between, expanded outside.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <strong className="text-purple-400 block">Polar Stereographic</strong>
                <ul className="space-y-1.5 text-slate-300 list-disc pl-4">
                  <li><strong>Meridians:</strong> Straight lines radiating from pole.</li>
                  <li><strong>Parallels:</strong> Concentric circles centered at pole.</li>
                  <li><strong>Great Circle:</strong> Straight line near the pole.</li>
                  <li><strong>Convergency:</strong> $n = 1.0$ (Chart conv = $\Delta\text{Long}$).</li>
                </ul>
              </div>
            </div>

            {/* Standard Parallels Scale Distribution Alert */}
            {projection === 'LAMBERT' && (
              <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl text-xs space-y-1.5 text-emerald-200">
                <strong className="text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 size={16} /> Lambert Standard Parallels Law (EASA High-Yield Exam Fact)
                </strong>
                <p className="leading-relaxed">
                  The cone cuts the sphere at two standard parallels.
                  Between standard parallels ({stdPar1}° and {stdPar2}°), the chart surface is <strong>inside</strong> the Earth sphere, so the chart scale is <strong>smaller than nominal (compressed, SF &lt; 1.0)</strong>.
                  Outside the standard parallels, the chart surface is <strong>outside</strong> the sphere, so the scale is <strong>larger than nominal (expanded, SF &gt; 1.0)</strong>.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectionsExplorer;
