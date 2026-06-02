import React, { useState, useEffect, useRef } from 'react';
import { View } from '../../types';
import { ChevronLeft, Map, Compass, Info, HelpCircle } from 'lucide-react';
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
  
  // Lambert specific: Parallel of Origin
  const [parallelOfOrigin, setParallelOfOrigin] = useState(45); // degrees

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Calculations
  const deltaLon = Math.abs(lonB - lonA);
  const meanLat = (latA + latB) / 2;

  // Earth Convergency = deltaLon * sin(meanLat)
  const earthConvergency = deltaLon * Math.sin((meanLat * Math.PI) / 180);

  // Constant of the cone (n)
  const n = projection === 'POLAR' 
    ? 1 
    : projection === 'LAMBERT' 
      ? Math.sin((parallelOfOrigin * Math.PI) / 180) 
      : 0;

  // Chart Convergency = deltaLon * n
  const chartConvergency = deltaLon * n;

  // Track Change on Straight Line on Chart
  const trackChange = chartConvergency;

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

    // Draw grid based on projection
    ctx.lineWidth = 1.5;
    
    if (projection === 'MERCATOR') {
      // Draw standard Mercator Grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      
      // Parallel Meridians
      for (let x = 40; x < w; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      // Parallels (Spacing expanding away from Equator)
      let currentY = cy;
      let spacing = 20;
      for (let i = 0; currentY > 0; i++) {
        ctx.beginPath();
        ctx.moveTo(0, currentY);
        ctx.lineTo(w, currentY);
        ctx.stroke();
        currentY -= spacing;
        spacing *= 1.25;
      }
      currentY = cy;
      spacing = 20;
      for (let i = 0; currentY < h; i++) {
        ctx.beginPath();
        ctx.moveTo(0, currentY);
        ctx.lineTo(w, currentY);
        ctx.stroke();
        currentY += spacing;
        spacing *= 1.25;
      }

      // Great Circle (Curved, concave to pole - N hemisphere is up)
      ctx.strokeStyle = '#38bdf8'; // Sky Blue
      ctx.beginPath();
      ctx.moveTo(60, h - 80);
      ctx.quadraticCurveTo(cx, 50, w - 60, h - 80);
      ctx.stroke();

      // Rhumb Line (Straight line)
      ctx.strokeStyle = '#facc15'; // Yellow
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(60, h - 80);
      ctx.lineTo(w - 60, h - 80);
      ctx.stroke();
      ctx.setLineDash([]);

    } else if (projection === 'LAMBERT') {
      // Lambert Conformal Conic (Converging meridians)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      const apexX = cx;
      const apexY = -80; // apex off-screen

      // Meridians converging at apex
      for (let angleDeg = -45; angleDeg <= 45; angleDeg += 15) {
        const rad = (angleDeg * Math.PI) / 180;
        ctx.beginPath();
        ctx.moveTo(apexX, apexY);
        ctx.lineTo(apexX + Math.sin(rad) * 450, apexY + Math.cos(rad) * 450);
        ctx.stroke();
      }

      // Concentric Parallels
      for (let radius = 200; radius <= 400; radius += 50) {
        ctx.beginPath();
        ctx.arc(apexX, apexY, radius, Math.PI / 2 - 0.8, Math.PI / 2 + 0.8);
        ctx.stroke();
      }

      // Great Circle (Straight line)
      ctx.strokeStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(cx - 120, 260);
      ctx.lineTo(cx + 120, 260);
      ctx.stroke();

      // Rhumb Line (Curved, concave to pole - pole is at top/apex)
      ctx.strokeStyle = '#facc15';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(cx - 120, 260);
      ctx.quadraticCurveTo(cx, 290, cx + 120, 260);
      ctx.stroke();
      ctx.setLineDash([]);

    } else {
      // Polar Stereographic (Meridians radiating from center pole)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';

      // Radiating meridians
      for (let angleDeg = 0; angleDeg < 360; angleDeg += 30) {
        const rad = (angleDeg * Math.PI) / 180;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(rad) * 180, cy + Math.sin(rad) * 180);
        ctx.stroke();
      }

      // Concentric circles
      for (let r = 40; r <= 160; r += 40) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Great Circle (Straight line nearby pole)
      ctx.strokeStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(cx - 100, cy - 60);
      ctx.lineTo(cx + 100, cy - 60);
      ctx.stroke();

      // Rhumb Line (Concentric spiral, visualised as curve concave to pole)
      ctx.strokeStyle = '#facc15';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(cx - 100, cy - 60);
      ctx.quadraticCurveTo(cx, cy - 20, cx + 100, cy - 60);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [projection, parallelOfOrigin]);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in duration-700">
      {/* Back Button */}
      <button 
        onClick={() => onChangeView(View.GEN_NAV_HOME)}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
        Back to Subject Dashboard
      </button>

      {/* Header */}
      <div className="glass-panel p-8 md:p-12 rounded-3xl border border-cyan-500/20 relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="p-4 bg-cyan-500/20 rounded-2xl text-cyan-400">
            <Map size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">ICAO Map Projections Explorer</h1>
        </div>
        <p className="text-slate-300 text-lg max-w-2xl leading-relaxed relative z-10">
          Simulate Earth geometry conversions, calculate the **Constant of the Cone**, and audit straight-line chart track deviations across standard projections.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Grid Selector & Track Math (5/12) */}
        <div className="lg:col-span-5 bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-white/5 space-y-6">
          <h3 className="text-xl font-bold text-white border-b border-white/5 pb-3">Projection Settings</h3>

          {/* Tab Selector */}
          <div className="flex bg-slate-950 p-1 rounded-xl">
            <button 
              onClick={() => setProjection('MERCATOR')} 
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${projection === 'MERCATOR' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Direct Mercator
            </button>
            <button 
              onClick={() => setProjection('LAMBERT')} 
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${projection === 'LAMBERT' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Lambert Conic
            </button>
            <button 
              onClick={() => setProjection('POLAR')} 
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${projection === 'POLAR' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Polar Stereo
            </button>
          </div>

          {/* Lambert specific control */}
          {projection === 'LAMBERT' && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4 pt-2"
            >
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>PARALLEL OF ORIGIN (φ₀)</span>
                <span className="text-white font-bold">{parallelOfOrigin}° N</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="80" 
                value={parallelOfOrigin} 
                onChange={e => setParallelOfOrigin(Number(e.target.value))} 
                className="w-full accent-cyan-500" 
              />
            </motion.div>
          )}

          {/* Grid coordinates input for track computations */}
          <div className="pt-4 border-t border-white/5 space-y-4">
            <h4 className="text-sm font-bold text-slate-300">Track Deviation Calculator</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">POINT A LONGITUDE</label>
                <input 
                  type="number" 
                  value={lonA} 
                  onChange={e => setLonA(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white font-mono text-sm focus:outline-none" 
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">POINT B LONGITUDE</label>
                <input 
                  type="number" 
                  value={lonB} 
                  onChange={e => setLonB(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white font-mono text-sm focus:outline-none" 
                />
              </div>
            </div>

            <div className="p-4 bg-slate-950/60 rounded-2xl border border-white/5 space-y-3 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Change in Longitude (Δλ):</span>
                <span className="text-white font-bold">{deltaLon}°</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Constant of Cone (n):</span>
                <span className="text-white font-bold">{n.toFixed(4)}</span>
              </div>
              <div className="flex justify-between border-t border-white/5 pt-2 text-cyan-400 font-bold">
                <span>Chart Convergency:</span>
                <span>{chartConvergency.toFixed(2)}°</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Canvas Grid & Explanations (7/12) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Canvas Card */}
          <div className="bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-white/5 flex flex-col items-center">
            <canvas 
              ref={canvasRef} 
              width={480} 
              height={300} 
              className="w-full bg-slate-950 rounded-2xl border border-slate-800 shadow-inner max-w-lg" 
            />
            <div className="flex gap-6 mt-4 text-xs font-bold text-center">
              <span className="text-sky-400">── Great Circle Path</span>
              <span className="text-yellow-400">--- Rhumb Line Path</span>
            </div>
          </div>

          {/* Projection Specific Properties & EASA Questions */}
          <div className="bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-white/5 space-y-4">
            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">ICAO Conformality Properties</h4>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex gap-3">
                <div className="p-2 bg-slate-950 rounded-lg text-cyan-400 font-bold h-max font-mono">01</div>
                <div>
                  <strong>Requirement for Conformality:</strong> To support navigation, charts must be conformal (maintain correct angular relationships locally). Straight lines drawn on the chart should closely approximate a **Great Circle** for quick course plotting.
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-2 bg-slate-950 rounded-lg text-cyan-400 font-bold h-max font-mono">02</div>
                <div>
                  <strong>Earth vs Chart Convergency:</strong>
                  <ul className="list-disc pl-4 mt-2 space-y-1">
                    <li>Earth Convergency = Delta-Longitude * sin(Mean Latitude).</li>
                    <li>Chart Convergency = Delta-Longitude * n.</li>
                    <li>For Lambert: n = sin(Parallel of Origin).</li>
                    <li>For Polar Stereographic: n = 1 (Chart convergency equals change in longitude).</li>
                  </ul>
                </div>
              </div>

              {projection === 'POLAR' && (
                <div className="p-4 bg-cyan-950/20 border border-cyan-500/20 rounded-2xl font-mono space-y-2">
                  <span className="text-cyan-400 block font-bold">Polar Stereographic Track Calculation</span>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    Since n = 1, the straight line track change is exactly Delta-Longitude.
                    For example, departing at **{lonA}°W** on a straight course and arriving at **{lonB}°E**, the track will change by exactly **{deltaLon}°**.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectionsExplorer;
