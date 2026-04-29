import React from 'react';
import { PenTool, Plane, Tag } from 'lucide-react';

const AircraftRegistration: React.FC = () => {
  const [activeMark, setActiveMark] = React.useState<'wing' | 'fuselage' | 'plate' | null>(null);

  const definitions = [
    { term: "Aircraft", def: "Any machine that can derive support in the atmosphere from the reactions of the air other than the reactions of the air against the earth's surface." },
    { term: "Heavier-than-air aircraft", def: "Any aircraft deriving its lift in flight chiefly from aerodynamic forces." },
    { term: "State of Registry", def: "The State on whose register the aircraft is entered." }
  ];

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Tag className="text-indigo-400" />
            Nationality & Registration (Annex 7)
          </h2>
          <p className="text-slate-400 text-sm">Rules for displaying marks on aircraft.</p>
        </div>
        <div className="bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-lg max-w-xs">
            <p className="text-[10px] font-bold text-indigo-400 uppercase mb-1">LO 010.02.04.01.02</p>
            <p className="text-xs text-slate-300"><strong>Responsibility:</strong> The <strong>State of Registry</strong> (or common mark authority) assigns marks.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Definitions Section */}
        <div className="space-y-4">
            <h3 className="text-white font-bold text-sm flex items-center gap-2">
                <PenTool size={16} className="text-indigo-400" />
                Definitions <span className="text-[10px] text-slate-500 font-normal">(LO 010.02.03.01.01)</span>
            </h3>
            {definitions.map((d, i) => (
                <div key={i} className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 hover:border-indigo-500/30 transition-colors">
                    <p className="text-indigo-400 font-bold text-xs mb-1">{d.term}</p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{d.def}</p>
                </div>
            ))}
        </div>

         {/* Visual Inspector */}
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 rounded-xl p-4 relative flex flex-col items-center border border-slate-700 min-h-[400px]">
                <div className="absolute top-4 left-4 z-10">
                    <h3 className="text-white font-bold text-sm">Visual Inspector <span className="text-[10px] text-slate-500 font-normal">(LO 010.02.04.01.01)</span></h3>
                    <p className="text-[10px] text-slate-500 italic">Click/Hover the marked areas</p>
                </div>

                {/* Interactive SVG */}
                <svg viewBox="0 0 400 300" className="w-full h-full drop-shadow-2xl max-w-lg">
                    {/* Fuselage */}
                    <path 
                        d="M 50,150 Q 50,130 100,130 L 300,130 L 350,100 L 380,100 L 320,135 L 380,140 L 380,160 L 320,165 L 350,200 L 300,200 L 100,170 Q 50,170 50,150" 
                        fill="#cbd5e1" 
                        stroke="#475569" 
                        strokeWidth="2" 
                    />
                    
                    {/* Wing */}
                    <path 
                        d="M 150,150 L 100,280 L 150,280 L 250,150" 
                        fill="#94a3b8" 
                        stroke="#475569" 
                        strokeWidth="2" 
                    />

                    {/* Fuselage Hotspot */}
                    <g 
                        className="cursor-pointer group"
                        onMouseEnter={() => setActiveMark('fuselage')}
                        onMouseLeave={() => setActiveMark(null)}
                    >
                        <rect x="240" y="145" width="80" height="25" fill={activeMark === 'fuselage' ? 'rgba(99,102,241,0.2)' : 'transparent'} stroke={activeMark === 'fuselage' ? '#6366f1' : 'transparent'} strokeDasharray="4" rx="4" />
                        <text x="250" y="162" fontSize="16" fontWeight="bold" fill="#1e293b" className="pointer-events-none">G-ABCD</text>
                    </g>

                    {/* Wing Hotspot */}
                    <g 
                        className="cursor-pointer group"
                        onMouseEnter={() => setActiveMark('wing')}
                        onMouseLeave={() => setActiveMark(null)}
                    >
                        <rect x="110" y="180" width="100" height="80" fill={activeMark === 'wing' ? 'rgba(99,102,241,0.2)' : 'transparent'} stroke={activeMark === 'wing' ? '#6366f1' : 'transparent'} strokeDasharray="4" rx="4" transform="rotate(-20 110,180)" />
                        <text x="120" y="250" fontSize="20" fontWeight="bold" fill="#1e293b" transform="rotate(-70 120,250)" className="pointer-events-none">G-ABCD</text>
                    </g>

                    {/* Fireproof Plate Hotspot */}
                    <circle 
                        cx="110" cy="145" r="8" 
                        fill="#f59e0b" 
                        className="cursor-pointer animate-pulse"
                        onMouseEnter={() => setActiveMark('plate')}
                        onMouseLeave={() => setActiveMark(null)}
                    />
                </svg>

                {/* Detail Overlay */}
                <div className="absolute bottom-4 right-4 left-4 bg-slate-800/90 backdrop-blur border border-slate-700 p-4 rounded-lg min-h-[100px] flex items-center gap-4 animate-in slide-in-from-bottom-2">
                    {!activeMark ? (
                        <p className="text-slate-400 text-sm text-center w-full italic">Select an aircraft mark to see requirements...</p>
                    ) : activeMark === 'fuselage' ? (
                        <>
                            <div className="bg-indigo-500 p-2 rounded-lg text-white font-bold text-xl">30cm</div>
                            <div>
                                <h4 className="text-white font-bold text-sm">Fuselage or Vertical Tail</h4>
                                <p className="text-xs text-slate-400 font-medium">Height of marks must be at least 30 cm.</p>
                                <p className="text-[10px] text-slate-500 mt-1">Must be on both sides of the fuselage or tail.</p>
                            </div>
                        </>
                    ) : activeMark === 'wing' ? (
                        <>
                            <div className="bg-indigo-500 p-2 rounded-lg text-white font-bold text-xl">50cm</div>
                            <div>
                                <h4 className="text-white font-bold text-sm">Wings (Left Side Bottom)</h4>
                                <p className="text-xs text-slate-400 font-medium">Height of marks must be at least 50 cm.</p>
                                <p className="text-[10px] text-slate-500 mt-1">Placed on the lower surface of the port wing structure.</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="bg-amber-500 p-2 rounded-lg text-white"><Tag size={24} /></div>
                            <div>
                                <h4 className="text-white font-bold text-sm">Identification Plate</h4>
                                <p className="text-xs text-slate-400 font-medium">Fireproof metal plate containing nationality/registration.</p>
                                <p className="text-[10px] text-slate-500 mt-1">Affixed in a prominent position near the main entrance.</p>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Quick Rules */}
            <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h4 className="text-white font-bold text-xs uppercase mb-3 text-slate-500 tracking-wider">Format Rules</h4>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="bg-indigo-600 text-white px-2 py-1 rounded font-mono font-bold text-lg">G</div>
                        <div className="text-slate-500">-</div>
                        <div className="bg-slate-700 text-white px-2 py-1 rounded font-mono font-bold text-lg">ABCD</div>
                    </div>
                    <p className="text-[11px] text-slate-400"><strong>Hyphen:</strong> Required between nationality and registration marks.</p>
                </div>
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h4 className="text-white font-bold text-xs uppercase mb-3 text-slate-500 tracking-wider">Common Marks</h4>
                    <p className="text-[11px] text-slate-400 mb-2">Used by international operating agencies where the State of Registry is not a single country.</p>
                    <p className="text-[11px] text-indigo-400 font-bold">Assigned by ICAO.</p>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AircraftRegistration;