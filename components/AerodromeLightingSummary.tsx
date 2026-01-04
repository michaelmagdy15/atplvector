import React, { useState } from 'react';
import { Ruler, Map, ArrowRight, ArrowLeft, Info } from 'lucide-react';

const AerodromeLightingSummary: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'runway' | 'taxiway'>('runway');
  const [direction, setDirection] = useState<'L-R' | 'R-L'>('L-R');
  const [highlightedFeature, setHighlightedFeature] = useState<string | null>(null);

  // Runway Constants
  const RUNWAY_LENGTH = 3000; // meters for visualization scale
  const SCALE = 0.2; // pixels per meter approx for display

  // Helper to determine light color based on distance from END of runway
  const getLightColors = (posMeters: number, totalLen: number) => {
    // Distance remaining
    const remaining = totalLen - posMeters;
    
    // Centerline Logic
    let clColor = 'bg-white shadow-[0_0_5px_white]';
    if (remaining < 300) {
      clColor = 'bg-red-600 shadow-[0_0_5px_red]';
    } else if (remaining < 900) {
      // Alternate Red/White. simpler to just return 'red-white' and handle pattern in render
      clColor = 'alternate'; 
    }

    // Edge Logic
    let edgeColor = 'bg-white shadow-[0_0_5px_white]';
    if (remaining < 600) {
      edgeColor = 'bg-yellow-400 shadow-[0_0_5px_yellow]';
    }

    return { clColor, edgeColor };
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Map className="text-emerald-400" />
            Airfield Lighting Summary
          </h2>
          <p className="text-slate-400 text-sm">Comprehensive guide to Distance Coding & Intersection Lighting.</p>
        </div>

        <div className="flex bg-slate-900 p-1 rounded-lg">
          <button onClick={() => setActiveTab('runway')} className={`px-4 py-2 rounded-md font-bold text-sm ${activeTab === 'runway' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}>Runway Coding</button>
          <button onClick={() => setActiveTab('taxiway')} className={`px-4 py-2 rounded-md font-bold text-sm ${activeTab === 'taxiway' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}>Taxiway Summary</button>
        </div>
      </div>

      {activeTab === 'runway' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 flex justify-between items-center">
             <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-slate-400 uppercase">Landing Direction:</span>
                <div className="flex bg-slate-800 rounded p-1">
                   <button 
                      onClick={() => setDirection('L-R')}
                      className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-2 ${direction === 'L-R' ? 'bg-sky-600 text-white' : 'text-slate-400'}`}
                   >
                      09 (L <ArrowRight size={12}/> R)
                   </button>
                   <button 
                      onClick={() => setDirection('R-L')}
                      className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-2 ${direction === 'R-L' ? 'bg-sky-600 text-white' : 'text-slate-400'}`}
                   >
                      27 (R <ArrowLeft size={12}/> L)
                   </button>
                </div>
             </div>
             <div className="text-xs text-slate-400 flex gap-4">
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-yellow-400 rounded-full"></span> Caution Zone</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-600 rounded-full"></span> Stop/End Zone</span>
             </div>
          </div>

          <div className="relative h-[200px] bg-black rounded-xl border-4 border-slate-700 overflow-hidden flex items-center shadow-2xl">
             {/* Runway Surface */}
             <div className="absolute w-full h-32 bg-slate-800 top-1/2 -translate-y-1/2"></div>
             
             {/* Distance Markers (Zones) based on direction */}
             <div className="absolute inset-0 pointer-events-none z-0">
                {/* Visualizing the zones based on direction */}
                {direction === 'L-R' ? (
                   <>
                      <div className="absolute top-0 bottom-0 right-[0%] w-[10%] bg-red-900/20 border-l border-red-500/30"></div> {/* 300m */}
                      <div className="absolute top-0 bottom-0 right-[10%] w-[20%] bg-yellow-900/10 border-l border-yellow-500/30"></div> {/* 900m total end */}
                   </>
                ) : (
                   <>
                      <div className="absolute top-0 bottom-0 left-[0%] w-[10%] bg-red-900/20 border-r border-red-500/30"></div>
                      <div className="absolute top-0 bottom-0 left-[10%] w-[20%] bg-yellow-900/10 border-r border-yellow-500/30"></div>
                   </>
                )}
             </div>

             {/* Lights Container */}
             <div className="absolute inset-0 w-full h-full">
                {Array.from({ length: 30 }).map((_, i) => {
                   // Calculate position percentage (0 to 100)
                   const pct = (i / 29) * 100;
                   // Calculate meter position based on direction
                   const posMeters = direction === 'L-R' ? (pct / 100) * 3000 : (1 - pct / 100) * 3000;
                   
                   const { clColor, edgeColor } = getLightColors(posMeters, 3000);
                   
                   // Handle Alternating CL
                   let finalClColor = clColor;
                   if (clColor === 'alternate') {
                      // If i is even/odd
                      finalClColor = i % 2 === 0 ? 'bg-red-600 shadow-[0_0_5px_red]' : 'bg-white shadow-[0_0_5px_white]';
                   }

                   return (
                      <React.Fragment key={i}>
                         {/* Top Edge */}
                         <div className={`absolute top-[70px] w-2 h-2 rounded-full ${edgeColor}`} style={{ left: `${pct}%` }}></div>
                         {/* Centerline */}
                         <div className={`absolute top-[98px] w-2 h-2 rounded-full ${finalClColor}`} style={{ left: `${pct}%` }}></div>
                         {/* Bottom Edge */}
                         <div className={`absolute top-[128px] w-2 h-2 rounded-full ${edgeColor}`} style={{ left: `${pct}%` }}></div>
                      </React.Fragment>
                   );
                })}
             </div>

             {/* Labels overlay */}
             <div className="absolute bottom-2 w-full flex justify-between px-4 text-[10px] font-mono font-bold text-slate-500">
                {direction === 'L-R' ? (
                   <>
                      <span>THRESHOLD</span>
                      <span className="text-yellow-500 ml-auto mr-[20%]">900m REMAINING</span>
                      <span className="text-orange-500 mr-[10%]">600m</span>
                      <span className="text-red-500">END</span>
                   </>
                ) : (
                   <>
                      <span className="text-red-500">END</span>
                      <span className="text-orange-500 ml-[10%]">600m</span>
                      <span className="text-yellow-500 ml-[20%]">900m REMAINING</span>
                      <span className="ml-auto">THRESHOLD</span>
                   </>
                )}
             </div>
          </div>

          {/* Rules Summary Card */}
          <div className="grid md:grid-cols-2 gap-4">
             <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                <h3 className="font-bold text-white mb-2 text-sm border-b border-slate-700 pb-1">Runway Centerline</h3>
                <ul className="text-xs text-slate-300 space-y-2 mt-2">
                   <li className="flex justify-between"><span>Start to 900m from end:</span> <span className="text-white font-bold">White</span></li>
                   <li className="flex justify-between"><span>900m to 300m from end:</span> <span className="text-red-300 font-bold">Red / White Alternate</span></li>
                   <li className="flex justify-between"><span>Last 300m:</span> <span className="text-red-500 font-bold">Red</span></li>
                </ul>
             </div>
             <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                <h3 className="font-bold text-white mb-2 text-sm border-b border-slate-700 pb-1">Runway Edge</h3>
                <ul className="text-xs text-slate-300 space-y-2 mt-2">
                   <li className="flex justify-between"><span>Start to 600m from end:</span> <span className="text-white font-bold">White</span></li>
                   <li className="flex justify-between"><span>Last 600m (Caution Zone):</span> <span className="text-yellow-400 font-bold">Yellow</span></li>
                   <li className="mt-1 text-slate-500 italic">Pre-threshold area usually red if displaced.</li>
                </ul>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'taxiway' && (
        <div className="flex flex-col md:flex-row gap-8 animate-in slide-in-from-right-2">
           {/* Visual Map */}
           <div className="w-full md:w-2/3 bg-green-900 rounded-xl relative h-[400px] border-4 border-slate-700 overflow-hidden shadow-inner group">
              {/* Grass Texture */}
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')]"></div>

              {/* Pavement: Main Horizontal */}
              <div className="absolute top-[40%] left-0 w-full h-24 bg-slate-600 border-y border-slate-500"></div>
              {/* Pavement: Vertical Intersection */}
              <div className="absolute top-0 right-[20%] w-24 h-full bg-slate-600 border-x border-slate-500"></div>
              {/* Pavement: Rapid Exit (Diagonal) */}
              <div className="absolute top-[40%] right-[20%] w-20 h-[300px] bg-slate-600 origin-top-left -rotate-45 border-x border-slate-500"></div>

              {/* === LIGHTS LAYER === */}
              
              {/* 1. Taxiway Centerline (Green) */}
              <g className={`transition-opacity ${highlightedFeature && highlightedFeature !== 'cl' ? 'opacity-20' : 'opacity-100'}`}>
                 {/* Horizontal */}
                 {Array.from({length: 20}).map((_, i) => (
                    <div key={`hcl-${i}`} className="absolute top-[calc(40%+48px)] w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_4px_lime]" style={{ left: `${i*5}%` }}></div>
                 ))}
                 {/* Vertical */}
                 {Array.from({length: 20}).map((_, i) => (
                    <div key={`vcl-${i}`} className="absolute right-[calc(20%+48px)] w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_4px_lime]" style={{ top: `${i*5}%` }}></div>
                 ))}
                 {/* Rapid Exit */}
                 {Array.from({length: 12}).map((_, i) => (
                    <div key={`rcl-${i}`} className="absolute w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_4px_lime]" 
                         style={{ top: `${45 + i*4}%`, right: `${38 + i*4}%` }}></div>
                 ))}
              </g>

              {/* 2. Taxiway Edge (Blue) */}
              <g className={`transition-opacity ${highlightedFeature && highlightedFeature !== 'edge' ? 'opacity-20' : 'opacity-100'}`}>
                 {/* Horizontal Top Edge */}
                 {Array.from({length: 15}).map((_, i) => (
                    <div key={`hte-${i}`} className="absolute top-[41%] w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_4px_blue]" style={{ left: `${i*6}%` }}></div>
                 ))}
                 {/* Vertical Right Edge */}
                 {Array.from({length: 15}).map((_, i) => (
                    <div key={`vre-${i}`} className="absolute right-[21%] w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_4px_blue]" style={{ top: `${i*7}%` }}></div>
                 ))}
              </g>

              {/* 3. Stop Bars (Red) */}
              <g className={`transition-opacity ${highlightedFeature && highlightedFeature !== 'stop' ? 'opacity-20' : 'opacity-100'}`}>
                 {/* Intersection Hold */}
                 <div className="absolute top-[40%] right-[24%] flex flex-col gap-1">
                     <div className="w-1.5 h-1.5 bg-red-600 rounded-full shadow-[0_0_5px_red]"></div>
                     <div className="w-1.5 h-1.5 bg-red-600 rounded-full shadow-[0_0_5px_red]"></div>
                     <div className="w-1.5 h-1.5 bg-red-600 rounded-full shadow-[0_0_5px_red]"></div>
                     <div className="w-1.5 h-1.5 bg-red-600 rounded-full shadow-[0_0_5px_red]"></div>
                 </div>
              </g>

              {/* 4. Intersection / Clearance Bars (Yellow) */}
              <g className={`transition-opacity ${highlightedFeature && highlightedFeature !== 'yellow' ? 'opacity-20' : 'opacity-100'}`}>
                 {/* Just before intersection */}
                 <div className="absolute top-[45%] left-[65%] flex gap-2">
                     <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full shadow-[0_0_4px_yellow]"></div>
                     <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full shadow-[0_0_4px_yellow]"></div>
                     <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full shadow-[0_0_4px_yellow]"></div>
                 </div>
              </g>
              
              {/* 5. Exit Lead-off (Green/Yellow) */}
              <g className={`transition-opacity ${highlightedFeature && highlightedFeature !== 'exit' ? 'opacity-20' : 'opacity-100'}`}>
                 {/* Representing the ILS sensitive area exit coding */}
                 <div className="absolute top-[46%] right-[32%] flex gap-1 transform rotate-45">
                     <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full shadow-[0_0_4px_yellow]"></div>
                     <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_4px_lime]"></div>
                     <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full shadow-[0_0_4px_yellow]"></div>
                 </div>
              </g>

              {/* Labels */}
              <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] p-1 rounded">Taxiway Alpha</div>
              <div className="absolute bottom-2 right-[22%] bg-black/50 text-white text-[10px] p-1 rounded">Taxiway Bravo</div>
           </div>

           {/* Legend / Interactive List */}
           <div className="w-full md:w-1/3 space-y-2">
              <h3 className="font-bold text-white text-sm uppercase mb-2">Lighting Legend</h3>
              <p className="text-xs text-slate-400 mb-4">Hover items to highlight on map.</p>

              <div 
                 onMouseEnter={() => setHighlightedFeature('cl')}
                 onMouseLeave={() => setHighlightedFeature(null)}
                 className="flex items-center gap-3 bg-slate-900 p-3 rounded border border-slate-700 hover:border-green-500 cursor-help transition-all"
              >
                 <div className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_5px_lime]"></div>
                 <div>
                    <p className="text-xs font-bold text-white">Taxiway Centerline</p>
                    <p className="text-[10px] text-slate-400">Green. Continuous guidance.</p>
                 </div>
              </div>

              <div 
                 onMouseEnter={() => setHighlightedFeature('edge')}
                 onMouseLeave={() => setHighlightedFeature(null)}
                 className="flex items-center gap-3 bg-slate-900 p-3 rounded border border-slate-700 hover:border-blue-500 cursor-help transition-all"
              >
                 <div className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_5px_blue]"></div>
                 <div>
                    <p className="text-xs font-bold text-white">Taxiway Edge</p>
                    <p className="text-[10px] text-slate-400">Blue. Defines limits.</p>
                 </div>
              </div>

              <div 
                 onMouseEnter={() => setHighlightedFeature('stop')}
                 onMouseLeave={() => setHighlightedFeature(null)}
                 className="flex items-center gap-3 bg-slate-900 p-3 rounded border border-slate-700 hover:border-red-500 cursor-help transition-all"
              >
                 <div className="w-3 h-3 bg-red-600 rounded-full shadow-[0_0_5px_red]"></div>
                 <div>
                    <p className="text-xs font-bold text-white">Stop Bar</p>
                    <p className="text-[10px] text-slate-400">Red. Unidirectional. Stop!</p>
                 </div>
              </div>

              <div 
                 onMouseEnter={() => setHighlightedFeature('yellow')}
                 onMouseLeave={() => setHighlightedFeature(null)}
                 className="flex items-center gap-3 bg-slate-900 p-3 rounded border border-slate-700 hover:border-yellow-500 cursor-help transition-all"
              >
                 <div className="w-3 h-3 bg-yellow-400 rounded-full shadow-[0_0_5px_yellow]"></div>
                 <div>
                    <p className="text-xs font-bold text-white">Intersection Light</p>
                    <p className="text-[10px] text-slate-400">Yellow. Clearance bar / Holding.</p>
                 </div>
              </div>

              <div 
                 onMouseEnter={() => setHighlightedFeature('exit')}
                 onMouseLeave={() => setHighlightedFeature(null)}
                 className="flex items-center gap-3 bg-slate-900 p-3 rounded border border-slate-700 hover:border-emerald-500 cursor-help transition-all"
              >
                 <div className="flex gap-1">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                 </div>
                 <div>
                    <p className="text-xs font-bold text-white">Exit / ILS Area</p>
                    <p className="text-slate-400 text-[10px]">Alt Green/Yellow within critical area.</p>
                 </div>
              </div>

           </div>
        </div>
      )}

    </div>
  );
};

export default AerodromeLightingSummary;