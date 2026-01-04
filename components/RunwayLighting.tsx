import React, { useState } from 'react';
import { Lightbulb, Info } from 'lucide-react';

type SystemType = 'simple' | 'cat1' | 'cat2';

// Helper to render a light dot
// Added style prop for animation handling
const Light: React.FC<{ cx: number; cy: number; color: string; pulse?: boolean; delay?: number }> = ({ cx, cy, color, pulse = false, delay = 0 }) => (
   <circle
      cx={cx}
      cy={cy}
      r={pulse ? 3 : 2}
      className={`${color}`}
      style={{
         animation: pulse
            ? `sequence-flash 1s infinite ${delay}s`
            : `steady-glow 3s infinite ${Math.random() * 2}s`,
         transformBox: 'fill-box',
         transformOrigin: 'center'
      }}
   />
);

// Helper to render a barrette (row of lights)
const Barrette: React.FC<{ x: number; y: number; width: number; color?: string; pulse?: boolean; delay?: number }> = ({ x, y, width, color = 'fill-white', pulse, delay = 0 }) => (
   <rect
      x={x - width / 2}
      y={y - 1}
      width={width}
      height={2}
      className={color}
      rx={1}
      style={{
         animation: pulse
            ? `sequence-flash 1s infinite ${delay}s`
            : `steady-glow 3s infinite ${Math.random() * 2}s`
      }}
   />
);

const RunwayLighting: React.FC = () => {
   const [system, setSystem] = useState<SystemType>('simple');

   return (
      <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
         <style>{`
        @keyframes sequence-flash {
            0% { opacity: 0.3; filter: brightness(1); transform: scale(1); }
            10% { opacity: 1; filter: brightness(3) drop-shadow(0 0 5px white); transform: scale(1.5); }
            20% { opacity: 0.3; filter: brightness(1); transform: scale(1); }
            100% { opacity: 0.3; filter: brightness(1); transform: scale(1); }
        }
        @keyframes steady-glow {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 1; filter: brightness(1.2); }
        }
      `}</style>
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
               <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                  <Lightbulb className="text-yellow-400" />
                  Approach & Runway Lighting
               </h2>
               <p className="text-slate-400 text-sm">Visualizing Simple, CAT I, and CAT II/III configurations with animation.</p>
            </div>

            <div className="flex bg-slate-900 p-1 rounded-lg">
               <button onClick={() => setSystem('simple')} className={`px-4 py-2 rounded-md font-bold text-sm ${system === 'simple' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'}`}>Simple</button>
               <button onClick={() => setSystem('cat1')} className={`px-4 py-2 rounded-md font-bold text-sm ${system === 'cat1' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'}`}>CAT I</button>
               <button onClick={() => setSystem('cat2')} className={`px-4 py-2 rounded-md font-bold text-sm ${system === 'cat2' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'}`}>CAT II / III</button>
            </div>
         </div>

         <div className="grid md:grid-cols-2 gap-8">
            {/* Visualizer */}
            <div className="bg-black rounded-xl p-4 border-4 border-slate-700 relative h-[300px] md:h-[500px] flex justify-center overflow-hidden shadow-2xl">
               {/* Grass background hints */}
               <div className="absolute inset-0 bg-emerald-900/10"></div>

               {/* Dynamic Glow Overlay for Approach */}
               <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-t from-white/5 to-transparent pointer-events-none"></div>

               <svg viewBox="0 0 300 600" className="h-full w-full max-w-[300px] z-10">

                  {/* --- RUNWAY SURFACE --- */}
                  <rect x="100" y="300" width="100" height="300" fill="#1e293b" />

                  {/* --- THRESHOLD --- */}
                  {/* Green Threshold Lights (Common to all) */}
                  <g>
                     {[...Array(15)].map((_, i) => (
                        <Light key={`th-${i}`} cx={102 + i * 6.8} cy={300} color="fill-green-500 shadow-[0_0_5px_#22c55e]" />
                     ))}
                  </g>

                  {/* --- APPROACH LIGHTING (Bottom to Top is Approach Path -> Runway) --- */}
                  {/* Note: SVG Y increases downwards. Let's map: 0 = far approach, 300 = threshold, 600 = runway end */}
                  {/* We sequence flashes starting from FAR (Top of svg 0) to NEAR (300). Wait, 0 is Far. */}

                  {/* SIMPLE APPROACH */}
                  {system === 'simple' && (
                     <g>
                        {/* Centreline: Single row */}
                        {[...Array(7)].map((_, i) => (
                           // i=0 is near (280), i=6 is far (100).
                           // Delay: Far lights (high i) flash first. Near lights (low i) flash last.
                           // Sequence duration approx 1s.
                           <Light
                              key={`cl-${i}`}
                              cx={150}
                              cy={280 - i * 30}
                              color="fill-white"
                              pulse={true}
                              delay={(7 - i) * 0.1}
                           />
                        ))}
                        {/* Crossbar at 300m (approx y=130) - Steady */}
                        {[...Array(10)].map((_, i) => (
                           <Light key={`cb-${i}`} cx={100 + i * 11} cy={130} color="fill-white" />
                        ))}
                     </g>
                  )}

                  {/* CAT I APPROACH */}
                  {system === 'cat1' && (
                     <g>
                        {/* Calvert System: 5 Crossbars */}
                        {/* Centerline - Sequenced */}
                        {[...Array(10)].map((_, i) => (
                           // i=0 near (290), i=9 far.
                           <Barrette
                              key={`cl1-${i}`}
                              x={150}
                              y={290 - i * 28}
                              width={10}
                              color="fill-white"
                              pulse={true}
                              delay={(10 - i) * 0.08}
                           />
                        ))}

                        {/* Crossbars - Steady */}
                        <Barrette x={150} y={250} width={40} />
                        <Barrette x={150} y={200} width={60} />
                        <Barrette x={150} y={150} width={80} />
                        <Barrette x={150} y={100} width={100} />
                        <Barrette x={150} y={50} width={120} />
                     </g>
                  )}

                  {/* CAT II/III APPROACH */}
                  {system === 'cat2' && (
                     <g>
                        {/* Supplementary Approach Lighting (Red Side Rows) in last 300m - Steady */}
                        {[...Array(8)].map((_, i) => (
                           <React.Fragment key={`supp-${i}`}>
                              <Barrette x={130} y={290 - i * 20} width={10} color="fill-red-600" /> {/* Left Red */}
                              <Barrette x={170} y={290 - i * 20} width={10} color="fill-red-600" /> {/* Right Red */}
                              {/* Center White - Sequenced */}
                              <Barrette
                                 x={150}
                                 y={290 - i * 20}
                                 width={10}
                                 color="fill-white"
                                 pulse={true}
                                 delay={(13 - i) * 0.08} // Offset to sync with far lights
                              />
                           </React.Fragment>
                        ))}
                        {/* Further out standard centerline - Sequenced */}
                        {[...Array(5)].map((_, i) => (
                           // y starts 130, goes up.
                           <Barrette
                              key={`far-${i}`}
                              x={150}
                              y={130 - i * 25}
                              width={10}
                              color="fill-white"
                              pulse={true}
                              delay={(5 - i) * 0.08}
                           />
                        ))}
                        {/* Crossbars at 150m and 300m - Steady */}
                        <Barrette x={150} y={140} width={60} />
                        <Barrette x={150} y={50} width={100} />
                     </g>
                  )}


                  {/* --- RUNWAY LIGHTING (300 to 600) --- */}

                  {/* Edge Lights - Steady with Flicker */}
                  {[...Array(15)].map((_, i) => {
                     // Last 600m (visual scale approx last 30% of runway here) are Yellow (Caution Zone)
                     // Runway len in svg is 300 units. Let's say caution starts at y=500.
                     const yPos = 320 + i * 20;
                     const color = yPos > 500 ? 'fill-yellow-400' : 'fill-white';
                     return (
                        <React.Fragment key={`edge-${i}`}>
                           <Light cx={100} cy={yPos} color={color} />
                           <Light cx={200} cy={yPos} color={color} />
                        </React.Fragment>
                     )
                  })}

                  {/* Centreline Lights - Steady */}
                  {[...Array(15)].map((_, i) => {
                     // CAT I usually no CL required visually in daylight diagram, but for CAT II/III essential.
                     // Specs: White -> Red/White -> Red.
                     // Let's show full CL for CAT II/III, maybe simpler for others.
                     if (system === 'simple') return null;

                     const yPos = 320 + i * 20;
                     let color = 'fill-white';
                     if (yPos > 550) color = 'fill-red-600'; // End
                     else if (yPos > 480) color = (i % 2 === 0) ? 'fill-red-600' : 'fill-white'; // Alt

                     return <Light key={`rcl-${i}`} cx={150} cy={yPos} color={color} />
                  })}

                  {/* Touchdown Zone (TDZ) - CAT II/III Only */}
                  {system === 'cat2' && (
                     <g>
                        {[...Array(6)].map((_, i) => (
                           <React.Fragment key={`tdz-${i}`}>
                              <Barrette x={130} y={320 + i * 20} width={12} color="fill-white" />
                              <Barrette x={170} y={320 + i * 20} width={12} color="fill-white" />
                           </React.Fragment>
                        ))}
                     </g>
                  )}

                  {/* Runway End Lights */}
                  {[...Array(15)].map((_, i) => (
                     <Light key={`end-${i}`} cx={102 + i * 6.8} cy={600} color="fill-red-600" />
                  ))}

                  {/* PAPI (Left side) */}
                  <g transform="translate(60, 380)">
                     <Light cx={0} cy={0} color="fill-red-600" />
                     <Light cx={10} cy={0} color="fill-red-600" />
                     <Light cx={20} cy={0} color="fill-white" />
                     <Light cx={30} cy={0} color="fill-white" />
                     <text x="15" y="-10" fill="white" fontSize="8" textAnchor="middle">PAPI</text>
                  </g>

               </svg>
            </div>

            {/* Info Panel */}
            <div className="space-y-6">
               <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
                  <h3 className="font-bold text-white mb-4 text-lg">System Features</h3>

                  {system === 'simple' && (
                     <ul className="space-y-3 text-sm text-slate-300">
                        <li className="flex gap-2"><span className="text-sky-400 font-bold">•</span> Single row centerline extending 420m+ from threshold.</li>
                        <li className="flex gap-2"><span className="text-sky-400 font-bold">•</span> Single crossbar at 300m.</li>
                        <li className="flex gap-2"><span className="text-sky-400 font-bold">•</span> Used for Non-Precision approaches.</li>
                        <li className="flex gap-2"><span className="text-white font-bold animate-pulse">•</span> Rabbit Lights: Sequenced flashing strobes lead to runway.</li>
                     </ul>
                  )}

                  {system === 'cat1' && (
                     <ul className="space-y-3 text-sm text-slate-300">
                        <li className="flex gap-2"><span className="text-sky-400 font-bold">•</span> Centerline extending 900m.</li>
                        <li className="flex gap-2"><span className="text-sky-400 font-bold">•</span> 5 Crossbars (Distance Coded) decreasing in width towards runway.</li>
                        <li className="flex gap-2"><span className="text-sky-400 font-bold">•</span> Runway Edge lights: White, turning Yellow (Caution) in last 600m.</li>
                        <li className="flex gap-2"><span className="text-white font-bold animate-pulse">•</span> Sequenced Flashers (The "Rabbit") for low visibility guidance.</li>
                     </ul>
                  )}

                  {system === 'cat2' && (
                     <ul className="space-y-3 text-sm text-slate-300">
                        <li className="flex gap-2"><span className="text-red-400 font-bold">•</span> <strong>Supplementary Approach:</strong> Red side row barrettes in inner 300m.</li>
                        <li className="flex gap-2"><span className="text-white font-bold">•</span> <strong>Touchdown Zone (TDZ):</strong> White barrettes for first 900m of runway.</li>
                        <li className="flex gap-2"><span className="text-white font-bold">•</span> <strong>Runway Centerline:</strong> Coded White &rarr; Red/White &rarr; Red.</li>
                        <li className="flex gap-2"><span className="text-sky-400 font-bold">•</span> Allows auto-land and low visibility taxi.</li>
                     </ul>
                  )}
               </div>

               <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
                  <h4 className="font-bold text-amber-400 mb-2 text-sm uppercase">Runway Light Coding</h4>
                  <div className="space-y-2 text-xs">
                     <div className="flex justify-between border-b border-slate-800 pb-1">
                        <span className="text-slate-400">Edge Lights</span>
                        <span className="text-white">White → Yellow (Last 600m)</span>
                     </div>
                     <div className="flex justify-between border-b border-slate-800 pb-1">
                        <span className="text-slate-400">Centerline</span>
                        <span className="text-white">White → R/W (Last 900m) → Red (Last 300m)</span>
                     </div>
                     <div className="flex justify-between">
                        <span className="text-slate-400">End Lights</span>
                        <span className="text-red-500 font-bold">RED (Unidirectional)</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default RunwayLighting;