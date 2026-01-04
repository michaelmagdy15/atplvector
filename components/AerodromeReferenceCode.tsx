import React, { useState } from 'react';
import { Plane, Ruler, MoveHorizontal } from 'lucide-react';

const AerodromeReferenceCode: React.FC = () => {
  const [fieldLength, setFieldLength] = useState(2000);
  const [wingspan, setWingspan] = useState(30);
  const [gearSpan, setGearSpan] = useState(8);

  // Element 1: Reference Field Length
  const getCodeNumber = (len: number) => {
    if (len < 800) return 1;
    if (len < 1200) return 2;
    if (len < 1800) return 3;
    return 4;
  };

  // Element 2: Wingspan & Gear Span (Most restrictive applies)
  const getCodeLetter = (ws: number, gs: number) => {
    // Logic from Table on Page 1
    // A: WS < 15, GS < 4.5
    // B: WS 15-24, GS 4.5-6
    // C: WS 24-36, GS 6-9
    // D: WS 36-52, GS 9-14
    // E: WS 52-65, GS 9-14
    // F: WS 65-80, GS 14-16
    
    let wsChar = 'A';
    if (ws >= 65) wsChar = 'F';
    else if (ws >= 52) wsChar = 'E';
    else if (ws >= 36) wsChar = 'D';
    else if (ws >= 24) wsChar = 'C';
    else if (ws >= 15) wsChar = 'B';

    let gsChar = 'A';
    if (gs >= 14) gsChar = 'F'; // Note: E and D share 9-14 range effectively in some simplified tables, but F starts at 14.
    // Actually PDF table:
    // D: 9-13.99
    // E: 9-13.99 (Same gear span as D, distinguished by wingspan)
    // F: 14-15.99
    else if (gs >= 9) gsChar = 'D'; // Covers D and E
    else if (gs >= 6) gsChar = 'C';
    else if (gs >= 4.5) gsChar = 'B';

    // Return the "higher" of the two letters
    if (wsChar > gsChar) return wsChar;
    return gsChar; // If gear requires higher code, use that (though usually wingspan drives it)
  };

  const codeNum = getCodeNumber(fieldLength);
  const codeLet = getCodeLetter(wingspan, gearSpan);

  // Example Aircraft
  const getExampleAircraft = (letter: string) => {
    switch (letter) {
      case 'A': return 'Cessna 172 / Piper PA-28';
      case 'B': return 'Beechcraft King Air / DHC-6';
      case 'C': return 'Boeing 737 / Airbus A320';
      case 'D': return 'Boeing 767 / MD-11';
      case 'E': return 'Boeing 777 / A330 / B747-400';
      case 'F': return 'Airbus A380 / B747-8';
      default: return 'Unknown';
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Plane className="text-sky-400" />
          Aerodrome Reference Codes
        </h2>
        <p className="text-slate-400 text-sm">Classifying aerodromes by aircraft performance and dimensions.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          {/* Element 1 Input */}
          <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
            <label className="flex justify-between text-slate-400 text-sm mb-2">
              <span className="flex items-center gap-2"><Ruler size={16} /> Ref Field Length</span>
              <span className="font-bold text-white">{fieldLength} m</span>
            </label>
            <input 
              type="range" min="600" max="3500" step="50"
              value={fieldLength} 
              onChange={(e) => setFieldLength(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
            <div className="mt-2 flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Code 1 (&lt;800)</span>
              <span>2</span>
              <span>3</span>
              <span>Code 4 (&gt;1800)</span>
            </div>
          </div>

          {/* Element 2 Inputs */}
          <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
            <div className="mb-4">
              <label className="flex justify-between text-slate-400 text-sm mb-2">
                <span className="flex items-center gap-2"><MoveHorizontal size={16} /> Wingspan</span>
                <span className="font-bold text-white">{wingspan} m</span>
              </label>
              <input 
                type="range" min="10" max="85" step="1"
                value={wingspan} 
                onChange={(e) => setWingspan(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
            <div>
              <label className="flex justify-between text-slate-400 text-sm mb-2">
                <span className="flex items-center gap-2"><MoveHorizontal size={16} /> Outer Main Gear Span</span>
                <span className="font-bold text-white">{gearSpan} m</span>
              </label>
              <input 
                type="range" min="2" max="16" step="0.5"
                value={gearSpan} 
                onChange={(e) => setGearSpan(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Result Display */}
        <div className="flex flex-col items-center justify-center p-8 bg-slate-900 rounded-xl border border-slate-700 relative overflow-hidden">
           <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-sky-500 to-transparent"></div>
           
           <div className="text-center z-10">
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">Aerodrome Code</p>
              <div className="text-8xl font-black text-white flex items-center justify-center gap-2">
                 <span className="text-sky-400">{codeNum}</span>
                 <span className="text-slate-600 text-6xl">/</span>
                 <span className="text-indigo-400">{codeLet}</span>
              </div>
              <div className="mt-4 inline-block px-4 py-2 bg-slate-800 rounded-full border border-slate-600">
                 <p className="text-sm font-bold text-slate-300">Typical: {getExampleAircraft(codeLet)}</p>
              </div>
           </div>

           {/* Visual Scale Reference */}
           <div className="mt-8 w-full h-2 bg-slate-700 rounded-full relative">
              <div 
                className="absolute top-0 left-0 h-full bg-sky-500 rounded-full transition-all duration-300" 
                style={{ width: `${(fieldLength/3500)*100}%` }}
              ></div>
              <div 
                className="absolute top-4 left-0 h-1 bg-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${(wingspan/85)*100}%` }}
              ></div>
           </div>
           <div className="flex justify-between w-full text-[10px] text-slate-500 mt-6">
              <span>Code Number (Runway Length)</span>
              <span>Code Letter (Wingspan)</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AerodromeReferenceCode;