import React, { useState, useEffect } from 'react';
import { RotateCcw, ArrowUp, Navigation } from 'lucide-react';

const HoldingPatternEntry: React.FC = () => {
  const [inboundTrack, setInboundTrack] = useState(270); // The track TO the fix
  const [heading, setHeading] = useState(90); // Aircraft heading
  const [entryType, setEntryType] = useState<'Parallel' | 'Offset' | 'Direct'>('Direct');

  // Calculate Entry Type based on Standard Right Hand Hold
  useEffect(() => {
    // 1. Determine sectors relative to Inbound Track
    // Sector 1 (Parallel): Heading is roughly opposite. Inbound + 180 +/-
    // Sector 2 (Offset): Teardrop area.
    // Sector 3 (Direct): The big sector.
    
    // Normalize angles
    const normHdg = (heading % 360 + 360) % 360;
    const normTrk = (inboundTrack % 360 + 360) % 360;
    
    // Calculate difference: Heading relative to Inbound Track
    // Ideally we rotate the frame so Inbound Track is "North" (360/0) for calculation
    // Relative Heading = Heading - Inbound Track
    let relHdg = (normHdg - normTrk + 360) % 360;
    
    // ICAO Standard Right Turn Hold Sectors relative to Inbound Track:
    // Sector 1 (Parallel): 110 deg slice. Relative: 250° to 360° (Using Reciprocal logic)
    // Actually easier:
    // Reciprocal of Inbound = (Inbound + 180).
    // Sector 1 (Parallel): Reciprocal + 70° to Reciprocal - 40°?? No.
    
    // Let's use the visual diagram logic (Page 16):
    // If we fly TOWARDS the fix on Inbound Track 270.
    // Sector 3 (Direct) is large (180 deg).
    // Sector 1 (Parallel) is medium (110 deg).
    // Sector 2 (Offset) is small (70 deg).
    
    // Relative to the FIX and INBOUND TRACK:
    // If Reciprocal is 090.
    // Sector 1 (Parallel): 090 to 200 (110 deg span)
    // Sector 2 (Offset): 020 to 090 (70 deg span)
    // Sector 3 (Direct): 200 to 020 (180 deg span)
    
    // Wait, let's normalize to "Reciprocal Track" being 0 degrees for math.
    const reciprocal = (normTrk + 180) % 360;
    const hdgRelToRecip = (normHdg - reciprocal + 360) % 360;
    
    // Standard Right Turn Entry:
    // Sector 1 (Parallel): 0 to 110 degrees (Right of reciprocal)
    // Sector 2 (Offset): 290 to 360 (Left of reciprocal, 70 deg) -> i.e. -70 to 0
    // Sector 3 (Direct): 110 to 290
    
    if (hdgRelToRecip >= 0 && hdgRelToRecip < 110) {
      setEntryType('Parallel');
    } else if (hdgRelToRecip >= 290 || (hdgRelToRecip < 0)) /* <0 cant happen with modulo */ {
      setEntryType('Offset');
    } else {
      setEntryType('Direct');
    }

  }, [inboundTrack, heading]);

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <RotateCcw className="text-amber-500" />
            Holding Pattern Entry
          </h2>
          <p className="text-slate-400 text-sm">Determine Sector 1, 2, or 3 based on aircraft heading.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
           {/* Inputs */}
           <div>
            <label className="flex justify-between text-slate-400 text-sm mb-4">
               <span>Inbound Track to Fix</span>
               <span className="font-mono text-amber-400 font-bold">{inboundTrack.toString().padStart(3, '0')}°</span>
            </label>
            <input
              type="range"
              min="0"
              max="359"
              value={inboundTrack}
              onChange={(e) => setInboundTrack(parseInt(e.target.value))}
              className="w-full h-3 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          <div>
            <label className="flex justify-between text-slate-400 text-sm mb-4">
               <span>Your Heading (To Fix)</span>
               <span className="font-mono text-sky-400 font-bold">{heading.toString().padStart(3, '0')}°</span>
            </label>
            <input
              type="range"
              min="0"
              max="359"
              value={heading}
              onChange={(e) => setHeading(parseInt(e.target.value))}
              className="w-full h-3 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
          </div>

          {/* Result Card */}
          <div className={`p-6 rounded-xl border-l-4 transition-all duration-300 ${
             entryType === 'Direct' ? 'bg-emerald-900/20 border-emerald-500' :
             entryType === 'Parallel' ? 'bg-blue-900/20 border-blue-500' :
             'bg-orange-900/20 border-orange-500'
          }`}>
             <p className="text-xs text-slate-400 uppercase font-bold mb-1">Recommended Entry</p>
             <h3 className={`text-3xl font-black mb-2 ${
                entryType === 'Direct' ? 'text-emerald-400' :
                entryType === 'Parallel' ? 'text-blue-400' :
                'text-orange-400'
             }`}>
                {entryType}
             </h3>
             <p className="text-sm text-slate-300">
                {entryType === 'Direct' && "Fly directly to the fix and turn right to follow the holding pattern."}
                {entryType === 'Parallel' && "Fly to fix, turn outbound (parallel to inbound track) for 1 min, then turn left to intercept inbound track."}
                {entryType === 'Offset' && "Fly to fix, turn to a heading 30° from reciprocal of inbound track, fly for 1 min, then turn right to intercept."}
             </p>
          </div>
        </div>

        {/* Visualization Diagram Wrapper - Changed to separate circle from legend container */}
        <div className="relative aspect-square">
           
           {/* Diagram Circle - Kept rounded and clipped */}
           <div className="absolute inset-0 rounded-full bg-slate-900 border-4 border-slate-700 overflow-hidden shadow-inner flex items-center justify-center">
             
             {/* Fix Point */}
             <div className="absolute z-20 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_white]"></div>
             <div className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-6 text-[10px] font-bold text-white">FIX</div>

             {/* Inbound Track Line */}
             <div 
               className="absolute w-1 h-1/2 bg-amber-500/50 origin-bottom bottom-1/2 left-1/2 -translate-x-1/2 z-10"
               style={{ transform: `rotate(${inboundTrack}deg)` }}
             >
                <ArrowUp className="absolute top-0 text-amber-500 -translate-y-full left-1/2 -translate-x-1/2" size={24} />
             </div>

             {/* Sectors Visualization */}
             <div 
                className="absolute w-full h-full rounded-full opacity-40 transition-transform duration-500"
                style={{ transform: `rotate(${inboundTrack + 180}deg)` }}
             >
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full -rotate-90">
                   {/* Parallel (0-110) */}
                   <path d="M 50 50 L 100 50 A 50 50 0 0 1 32 96 Z" className="fill-blue-500" />
                   {/* Direct (110-290) */}
                   <path d="M 50 50 L 32 96 A 50 50 0 1 1 68 3 Z" className="fill-emerald-500" />
                   {/* Offset (290-360) */}
                   <path d="M 50 50 L 68 3 A 50 50 0 0 1 100 50 Z" className="fill-orange-500" />
                </svg>
             </div>

             {/* Aircraft Icon */}
             <div 
                className="absolute w-full h-full z-30 transition-transform duration-500"
                style={{ transform: `rotate(${heading}deg)` }}
             >
                <div className="absolute top-4 left-1/2 -translate-x-1/2">
                   <Navigation size={32} className="text-sky-400 fill-sky-400/20" />
                </div>
             </div>
           </div>

           {/* Legend Overlay - Positioned relative to the square wrapper, outside the clipped circle if needed, or sitting on top safely */}
           <div className="absolute bottom-2 left-2 flex flex-col gap-1 text-[10px] font-bold pointer-events-none z-40 bg-black/60 p-2 rounded backdrop-blur-sm border border-slate-700 shadow-xl">
              <span className="text-blue-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400"></span> Parallel (1)</span>
              <span className="text-orange-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400"></span> Offset (2)</span>
              <span className="text-emerald-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> Direct (3)</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default HoldingPatternEntry;