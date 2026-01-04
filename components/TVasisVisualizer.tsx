import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Check, AlertTriangle, Lightbulb } from 'lucide-react';

const TVasisVisualizer: React.FC = () => {
  // Level: 0 = On Slope. 
  // Positive = High (1, 2, 3 lights above).
  // Negative = Low (-1, -2, -3 lights below).
  // -4 = Grossly Low (Red).
  const [level, setLevel] = useState(0);

  const getStatus = () => {
    if (level > 0) return { title: "TOO HIGH", action: "Fly Down", color: "text-amber-400", desc: "Inverted 'T' visible. Lights appear above the bar." };
    if (level === 0) return { title: "ON SLOPE", action: "Maintain", color: "text-emerald-400", desc: "Only Wing Bar visible." };
    if (level > -4) return { title: "TOO LOW", action: "Fly Up", color: "text-amber-400", desc: "Upright 'T' visible. Lights appear below the bar." };
    return { title: "GROSSLY LOW", action: "PULL UP", color: "text-red-500", desc: "Bar and Fly-Up lights turn RED." };
  };

  const status = getStatus();
  const isRed = level === -4;

  // Helper to render a single light unit (dot)
  const LightUnit = ({ cx, cy, active, red }: { cx: number, cy: number, active: boolean, red: boolean }) => (
    <circle 
      cx={cx} 
      cy={cy} 
      r={active ? 4 : 2} 
      className={`transition-all duration-300 ${active ? (red ? 'fill-red-600' : 'fill-white') : 'fill-slate-800'}`}
      filter={active ? (red ? 'url(#glow-red)' : 'url(#glow-white)') : ''}
    />
  );

  // Render one side of the T-VASIS (Left or Right)
  const TvasisSide = ({ offsetX }: { offsetX: number }) => {
     return (
        <g transform={`translate(${offsetX}, 0)`}>
           {/* FLY DOWN LIGHTS (Above Wing Bar) */}
           {/* 3rd (Top) */}
           <LightUnit cx={0} cy={60} active={level >= 3} red={false} />
           {/* 2nd */}
           <LightUnit cx={0} cy={80} active={level >= 2} red={false} />
           {/* 1st */}
           <LightUnit cx={0} cy={100} active={level >= 1} red={false} />

           {/* WING BAR (4 Horizontal Lights) */}
           <g>
              <LightUnit cx={-30} cy={120} active={true} red={isRed} />
              <LightUnit cx={-10} cy={120} active={true} red={isRed} />
              <LightUnit cx={10} cy={120} active={true} red={isRed} />
              <LightUnit cx={30} cy={120} active={true} red={isRed} />
           </g>

           {/* FLY UP LIGHTS (Below Wing Bar) */}
           {/* 1st */}
           <LightUnit cx={0} cy={140} active={level <= -1} red={isRed} />
           {/* 2nd */}
           <LightUnit cx={0} cy={160} active={level <= -2} red={isRed} />
           {/* 3rd (Bottom) */}
           <LightUnit cx={0} cy={180} active={level <= -3} red={isRed} />
        </g>
     );
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Lightbulb className="text-white" />
          T-VASIS Visualizer
        </h2>
        <p className="text-slate-400 text-sm">
          T-Visual Approach Slope Indicator System. Consists of 20 lights forming a cross shape.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
         
         {/* Simulator View */}
         <div className="bg-black rounded-xl p-4 border-4 border-slate-700 relative h-[300px] md:h-[350px] flex justify-center items-center overflow-hidden shadow-2xl group">
            {/* Sky / Ground Horizon */}
            <div className="absolute top-0 w-full h-[40%] bg-slate-900"></div>
            <div className="absolute bottom-0 w-full h-[60%] bg-emerald-900/20"></div>

            <svg viewBox="0 0 400 300" className="w-full h-full relative z-10">
               <defs>
                  <filter id="glow-white" x="-50%" y="-50%" width="200%" height="200%">
                     <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                     <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                     </feMerge>
                  </filter>
                  <filter id="glow-red" x="-50%" y="-50%" width="200%" height="200%">
                     <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                     <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                     </feMerge>
                  </filter>
               </defs>

               {/* Runway Perspective */}
               <path d="M 170,120 L 230,120 L 280,300 L 120,300 Z" fill="#1e293b" />
               <line x1="200" y1="120" x2="200" y2="300" stroke="white" strokeWidth="1" strokeDasharray="5,5" />

               {/* Left T-VASIS */}
               <TvasisSide offsetX={80} />

               {/* Right T-VASIS */}
               <TvasisSide offsetX={320} />
            </svg>

            {/* Status Overlay */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur px-4 py-2 rounded-lg border border-slate-600 text-center">
               <p className={`font-black text-xl tracking-widest ${status.color}`}>{status.title}</p>
               {level !== 0 && (
                  <div className="flex items-center justify-center gap-1 text-white font-bold text-sm mt-1 animate-pulse">
                     {level > 0 ? <ArrowDown size={16} /> : <ArrowUp size={16} />}
                     {status.action}
                  </div>
               )}
            </div>
         </div>

         {/* Controls */}
         <div className="space-y-6">
            <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
               <label className="flex justify-between text-slate-400 text-sm mb-4">
                  <span>Approach Slope Deviation</span>
               </label>
               
               <input 
                  type="range" 
                  min="-4" 
                  max="3" 
                  step="1" 
                  value={level} 
                  onChange={(e) => setLevel(parseInt(e.target.value))}
                  className="w-full h-4 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-white"
               />
               
               <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-2 uppercase font-bold">
                  <span className="text-red-500">Grossly Low</span>
                  <span>Low</span>
                  <span className="text-emerald-500">On Slope</span>
                  <span>High</span>
               </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
               <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-sky-400" /> System Logic
               </h3>
               <p className="text-slate-300 text-sm leading-relaxed">
                  {status.desc}
               </p>
               <div className="mt-4 space-y-2 text-xs text-slate-400 border-t border-slate-800 pt-4">
                  <p>• <strong>High (Fly Down):</strong> The wing bar + 1, 2, or 3 lights <em>above</em> (beyond) it form an inverted 'T'.</p>
                  <p>• <strong>On Slope:</strong> Only the horizontal wing bar is visible.</p>
                  <p>• <strong>Low (Fly Up):</strong> The wing bar + 1, 2, or 3 lights <em>below</em> it form an upright 'T'.</p>
                  <p>• <strong>Grossly Low:</strong> The bar and fly-up lights turn RED.</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default TVasisVisualizer;