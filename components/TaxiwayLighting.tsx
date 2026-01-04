import React, { useState } from 'react';
import { AlertOctagon, ArrowUpRight } from 'lucide-react';

const TaxiwayLighting: React.FC = () => {
  const [mode, setMode] = useState<'normal' | 'lowvis'>('normal');
  const [stopBar, setStopBar] = useState(false);

  // Helper for glow effects
  const GlowFilter = ({ id, color }: { id: string, color: string }) => (
    <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
      <feFlood floodColor={color} result="glowColor" />
      <feComposite in="glowColor" in2="coloredBlur" operator="in" result="softGlow_colored" />
      <feMerge>
        <feMergeNode in="softGlow_colored"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  );

  // Precise coordinates for the curved taxiway centerline
  // Starts on Runway Centerline (x=100) and curves out to taxiway
  const centerlinePath = [
    { x: 100, y: 80, type: 'lead-off' },  // On Runway CL
    { x: 100, y: 100, type: 'lead-off' }, // On Runway CL
    { x: 105, y: 115, type: 'lead-off' }, // Starting turn
    { x: 118, y: 125, type: 'lead-off' },
    { x: 135, y: 130, type: 'lead-off' }, // Crossing Runway Edge
    { x: 155, y: 132, type: 'taxi' },     // Entering Taxiway
    { x: 175, y: 135, type: 'taxi' },
    { x: 195, y: 142, type: 'taxi' },
    { x: 215, y: 155, type: 'taxi' },     // Curve apex
    { x: 235, y: 170, type: 'taxi' },
    { x: 255, y: 185, type: 'taxi' },
    { x: 275, y: 200, type: 'taxi' },     // ILS Boundary area approx
    { x: 295, y: 215, type: 'taxi' },
    { x: 315, y: 230, type: 'taxi' },
    { x: 335, y: 245, type: 'taxi' },
  ];

  // Coordinates for Taxiway Edge Lights (Blue)
  // Top Edge
  const topEdgePath = [
    { x: 155, y: 95 },
    { x: 175, y: 98 },
    { x: 195, y: 105 },
    { x: 215, y: 115 },
    { x: 235, y: 130 },
    { x: 255, y: 145 },
    { x: 275, y: 160 },
    { x: 295, y: 175 },
    { x: 315, y: 190 },
    { x: 335, y: 205 },
    { x: 355, y: 220 },
  ];

  // Bottom Edge
  const bottomEdgePath = [
    { x: 155, y: 155 },
    { x: 175, y: 160 },
    { x: 195, y: 170 },
    { x: 215, y: 185 },
    { x: 235, y: 200 },
    { x: 255, y: 215 },
    { x: 275, y: 230 },
    { x: 295, y: 245 },
    { x: 315, y: 260 },
  ];

  // Critical Area Line X coordinate (Vertical for simplicity)
  const CRITICAL_LINE_X = 270;

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
      <style>{`
        @keyframes flow-pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); filter: brightness(1.3); }
        }
      `}</style>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <ArrowUpRight className="text-emerald-400" />
          Taxiway Lighting & Stop Bars
        </h2>
        <p className="text-slate-400 text-sm">
          Visualizing low visibility operations, lead-off lights, and holding points.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Controls */}
        <div className="w-full md:w-1/3 space-y-6">
           <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
              <h3 className="font-bold text-white mb-4 text-sm uppercase">1. Visibility Mode</h3>
              <div className="flex gap-2 mb-2">
                 <button 
                    onClick={() => setMode('normal')}
                    className={`flex-1 py-3 rounded text-xs font-bold transition-all border ${mode === 'normal' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-600 text-slate-400'}`}
                 >
                    Normal (Blue Edge)
                 </button>
                 <button 
                    onClick={() => setMode('lowvis')}
                    className={`flex-1 py-3 rounded text-xs font-bold transition-all border ${mode === 'lowvis' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-800 border-slate-600 text-slate-400'}`}
                 >
                    Low Vis (Green CL)
                 </button>
              </div>
              <p className="text-[10px] text-slate-400">
                 {mode === 'normal' 
                    ? "Standard taxiways use Blue Edge lighting." 
                    : "Low visibility/CAT II/III use Green Centerline lighting."}
              </p>
           </div>

           <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
              <h3 className="font-bold text-white mb-4 text-sm uppercase">2. Holding Point</h3>
              <button 
                 onClick={() => setStopBar(!stopBar)}
                 className={`w-full py-3 rounded text-sm font-bold transition-all border flex items-center justify-center gap-2 ${stopBar ? 'bg-red-600 border-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'bg-slate-800 border-slate-600 text-slate-400'}`}
              >
                 <AlertOctagon size={18} />
                 {stopBar ? 'STOP BAR ACTIVE' : 'STOP BAR OFF'}
              </button>
              <p className="text-[10px] text-slate-400 mt-2">
                 Unidirectional red lights across the taxiway. No entry when lit.
              </p>
           </div>

           <div className="bg-slate-800 p-4 rounded border-l-4 border-yellow-500">
              <h4 className="font-bold text-white text-xs uppercase mb-1">ILS Sensitive Area</h4>
              <p className="text-xs text-slate-300">
                 Exiting the runway? Lights alternate <span className="text-yellow-400 font-bold">Yellow</span> & <span className="text-emerald-400 font-bold">Green</span> until you are clear of the ILS sensitive area.
              </p>
           </div>
        </div>

        {/* Visualizer */}
        <div className="w-full md:w-2/3 bg-black rounded-xl border-4 border-slate-700 relative overflow-hidden h-[300px] md:h-[400px] flex items-center justify-center shadow-2xl">
           <div className="absolute inset-0 bg-slate-900/50"></div>
           
           <svg viewBox="0 0 400 300" className="w-full h-full relative z-10">
              <defs>
                 <GlowFilter id="glow-green" color="#22c55e" />
                 <GlowFilter id="glow-blue" color="#3b82f6" />
                 <GlowFilter id="glow-red" color="#ef4444" />
                 <GlowFilter id="glow-yellow" color="#eab308" />
                 <GlowFilter id="glow-white" color="#ffffff" />
              </defs>

              {/* === SURFACES === */}
              
              {/* Runway (Vertical Left) */}
              <rect x="50" y="0" width="100" height="300" fill="#1e293b" />
              
              {/* Taxiway (Curving Right) */}
              {/* Path definition: Starts x=150 (Runway Edge). 
                  Top Edge: M 150,90 Q 200,90 400,240
                  Bottom Edge: L 400,300 L 350,300 Q 220,180 150,150 Z 
                  Note: Adjusted coordinates to match light paths better visually 
              */}
              <path d="M 150,90 Q 210,90 400,230 L 400,300 L 300,300 Q 210,180 150,150 Z" fill="#1e293b" />

              {/* Markings */}
              {/* Runway Edge Line */}
              <line x1="140" y1="0" x2="140" y2="300" stroke="white" strokeWidth="2" />
              {/* Runway Centerline */}
              <line x1="100" y1="0" x2="100" y2="300" stroke="white" strokeWidth="2" strokeDasharray="15,15" />
              
              {/* ILS Sensitive Area Boundary Line */}
              <line x1={CRITICAL_LINE_X} y1="0" x2={CRITICAL_LINE_X} y2="300" stroke="#eab308" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />
              <text x={CRITICAL_LINE_X + 5} y="20" fill="#eab308" fontSize="10" opacity="0.8">ILS CRITICAL AREA</text>


              {/* === LIGHTS === */}

              {/* 1. Taxiway Edge Lights (Blue) - Normal Mode */}
              {mode === 'normal' && (
                 <g>
                    {topEdgePath.map((pt, i) => (
                       <circle key={`te-top-${i}`} cx={pt.x} cy={pt.y} r="2" fill="#3b82f6" filter="url(#glow-blue)" />
                    ))}
                    {bottomEdgePath.map((pt, i) => (
                       <circle key={`te-bot-${i}`} cx={pt.x} cy={pt.y} r="2" fill="#3b82f6" filter="url(#glow-blue)" />
                    ))}
                 </g>
              )}

              {/* 2. Taxiway Centerline (Green/Yellow) - Low Vis Mode */}
              <g>
                  {centerlinePath.map((pt, i) => {
                     // Logic:
                     // If x < CRITICAL_LINE_X: Alternate Green/Yellow
                     // If x >= CRITICAL_LINE_X: Green
                     
                     let color = "#22c55e"; // Green
                     let filter = "url(#glow-green)";
                     
                     // Inside critical area
                     if (pt.x < CRITICAL_LINE_X) {
                        // Pattern: G Y G Y
                        if (i % 2 !== 0) {
                           color = "#eab308"; // Yellow
                           filter = "url(#glow-yellow)";
                        }
                     }

                     const delay = i * 0.15;

                     return (
                        <circle 
                           key={`cl-${i}`} 
                           cx={pt.x} 
                           cy={pt.y} 
                           r="2" 
                           fill={color} 
                           filter={filter}
                           opacity={mode === 'lowvis' ? 1 : 0}
                           style={{ 
                             animation: mode === 'lowvis' ? `flow-pulse 2s infinite ${delay}s` : 'none',
                             transformBox: 'fill-box',
                             transformOrigin: 'center',
                             transition: 'opacity 0.5s'
                           }}
                        />
                     );
                  })}
              </g>

              {/* 3. Stop Bar (Red) */}
              <g opacity={stopBar ? 1 : 0.1} className="transition-opacity duration-300">
                 {/* Positioned at the ILS Critical Line (Hold Short point) */}
                 {[...Array(6)].map((_, i) => {
                    // Perpendicular to centerline at x=270 approx
                    // Centerline at x=270 is approx y=195.
                    // Bar should span roughly y=160 to y=230
                    const cx = CRITICAL_LINE_X;
                    const cy = 160 + i * 14; 
                    return (
                       <circle key={`sb-${i}`} cx={cx} cy={cy} r="3" fill="#ef4444" filter="url(#glow-red)" />
                    )
                 })}
                 {stopBar && <text x={CRITICAL_LINE_X + 10} y="190" fill="#ef4444" fontSize="12" fontWeight="bold">STOP</text>}
              </g>

              {/* Runway Lights (Context) - Always faint white/red/green for realism */}
              <g opacity="0.3">
                 {/* Centerline */}
                 {[...Array(6)].map((_, i) => (
                    <circle key={`rcl-${i}`} cx={100} cy={20 + i * 50} r="1.5" fill="white" filter="url(#glow-white)" />
                 ))}
                 {/* Edge */}
                 {[...Array(6)].map((_, i) => (
                    <circle key={`re-${i}`} cx={140} cy={20 + i * 50} r="2" fill="white" filter="url(#glow-white)" />
                 ))}
              </g>
           </svg>
        </div>
      </div>
    </div>
  );
};

export default TaxiwayLighting;