import React, { useState } from 'react';
import { Lightbulb } from 'lucide-react';

const SurfaceLighting: React.FC = () => {
  const [activeType, setActiveType] = useState<'runway' | 'taxiway' | 'all'>('all');

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Lightbulb className="text-amber-400" />
          Surface Lighting Colors
        </h2>
        <p className="text-slate-400 text-sm">Standard color coding for Runway and Taxiway lighting.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Controls / Info */}
        <div className="w-full md:w-1/3 space-y-6">
            <div className="bg-slate-900 p-1 rounded-lg flex mb-4 border border-slate-700">
                <button 
                    onClick={() => setActiveType('all')} 
                    className={`flex-1 py-2 text-xs font-bold rounded transition-all ${activeType === 'all' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                    View All
                </button>
                <button 
                    onClick={() => setActiveType('runway')} 
                    className={`flex-1 py-2 text-xs font-bold rounded transition-all ${activeType === 'runway' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                    Runway
                </button>
                <button 
                    onClick={() => setActiveType('taxiway')} 
                    className={`flex-1 py-2 text-xs font-bold rounded transition-all ${activeType === 'taxiway' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                    Taxiway
                </button>
            </div>

            <div className={`p-4 rounded-lg border border-slate-700 bg-slate-900/50 transition-all duration-500 ${activeType === 'runway' || activeType === 'all' ? 'opacity-100 translate-x-0' : 'opacity-30 -translate-x-4'}`}>
                <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                    <span className="w-3 h-3 bg-white rounded-full shadow-[0_0_10px_white]"></span> Runway
                </h3>
                <ul className="text-xs text-slate-300 space-y-2">
                    <li className="flex justify-between items-center border-b border-slate-700/50 pb-1">
                        <span>Edge Lights</span>
                        <span className="text-white font-bold bg-white/10 px-2 rounded">White</span>
                    </li>
                    <li className="flex justify-between items-center border-b border-slate-700/50 pb-1">
                        <span>Centerline</span>
                        <span className="text-white font-bold bg-white/10 px-2 rounded">White</span>
                    </li>
                    <li className="flex justify-between items-center border-b border-slate-700/50 pb-1">
                        <span>Threshold (Start)</span>
                        <span className="text-green-400 font-bold bg-green-900/30 px-2 rounded">Green Bar</span>
                    </li>
                    <li className="flex justify-between items-center">
                        <span>End (Stop)</span>
                        <span className="text-red-500 font-bold bg-red-900/30 px-2 rounded">Red Bar</span>
                    </li>
                </ul>
            </div>

            <div className={`p-4 rounded-lg border border-slate-700 bg-slate-900/50 transition-all duration-500 ${activeType === 'taxiway' || activeType === 'all' ? 'opacity-100 translate-x-0' : 'opacity-30 -translate-x-4'}`}>
                <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                    <span className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_blue]"></span> Taxiway
                </h3>
                <ul className="text-xs text-slate-300 space-y-2">
                    <li className="flex justify-between items-center border-b border-slate-700/50 pb-1">
                        <span>Edge Lights</span>
                        <span className="text-blue-400 font-bold bg-blue-900/30 px-2 rounded">Blue</span>
                    </li>
                    <li className="flex justify-between items-center">
                        <span>Centerline</span>
                        <span className="text-green-400 font-bold bg-green-900/30 px-2 rounded">Green</span>
                    </li>
                </ul>
            </div>
        </div>

        {/* Visualizer */}
        <div className="w-full md:w-2/3 bg-black rounded-xl border-4 border-slate-700 relative overflow-hidden h-[300px] md:h-[400px] flex items-center justify-center group shadow-2xl">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-slate-900/50"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800/20 to-black opacity-80"></div>

            {/* SVG Diagram */}
            <svg viewBox="0 0 400 300" className="w-full h-full relative z-10">
                {/* Definitions for Glows */}
                <defs>
                    <filter id="glow-white" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                    <filter id="glow-green" x="-50%" y="-50%" width="200%" height="200%">
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
                    <filter id="glow-blue" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>

                {/* Runway Surface */}
                <path d="M 50,250 L 350,250 L 350,50 L 50,50 Z" fill="#1e293b" />
                
                {/* Taxiway Surface (Exiting Right) */}
                <path d="M 250,150 Q 280,150 300,180 L 380,250 L 400,230 L 320,160 Q 290,130 250,130" fill="#1e293b" />


                {/* === RUNWAY LIGHTS === */}
                <g style={{ opacity: activeType === 'taxiway' ? 0.1 : 1, transition: 'opacity 0.5s' }}>
                    {/* Edges (White) */}
                    {Array.from({length: 10}).map((_, i) => (
                        <React.Fragment key={`edge-${i}`}>
                            <circle cx="60" cy={60 + i * 20} r="2" fill="white" filter="url(#glow-white)" />
                            <circle cx="340" cy={60 + i * 20} r="2" fill="white" filter="url(#glow-white)" />
                        </React.Fragment>
                    ))}

                    {/* Centerline (White) */}
                    {Array.from({length: 10}).map((_, i) => (
                        <circle key={`center-${i}`} cx="200" cy={60 + i * 20} r="1.5" fill="white" filter="url(#glow-white)" />
                    ))}

                    {/* Threshold Bar (Green) - Bottom (Start) */}
                    <g>
                        {Array.from({length: 12}).map((_, i) => (
                            <circle key={`th-${i}`} cx={70 + i * 24} cy={245} r="2.5" fill="#22c55e" filter="url(#glow-green)" />
                        ))}
                    </g>

                    {/* Runway End (Red) - Top */}
                    <g>
                        {Array.from({length: 12}).map((_, i) => (
                            <circle key={`end-${i}`} cx={70 + i * 24} cy={55} r="2.5" fill="#ef4444" filter="url(#glow-red)" />
                        ))}
                    </g>
                </g>

                {/* === TAXIWAY LIGHTS === */}
                <g style={{ opacity: activeType === 'runway' ? 0.1 : 1, transition: 'opacity 0.5s' }}>
                    {/* Blue Edges */}
                    <circle cx="260" cy="130" r="2" fill="#3b82f6" filter="url(#glow-blue)" />
                    <circle cx="280" cy="135" r="2" fill="#3b82f6" filter="url(#glow-blue)" />
                    <circle cx="300" cy="145" r="2" fill="#3b82f6" filter="url(#glow-blue)" />
                    <circle cx="320" cy="160" r="2" fill="#3b82f6" filter="url(#glow-blue)" />
                    <circle cx="340" cy="178" r="2" fill="#3b82f6" filter="url(#glow-blue)" />
                    <circle cx="360" cy="195" r="2" fill="#3b82f6" filter="url(#glow-blue)" />
                    <circle cx="380" cy="212" r="2" fill="#3b82f6" filter="url(#glow-blue)" />

                    <circle cx="260" cy="170" r="2" fill="#3b82f6" filter="url(#glow-blue)" />
                    <circle cx="275" cy="175" r="2" fill="#3b82f6" filter="url(#glow-blue)" />
                    <circle cx="290" cy="190" r="2" fill="#3b82f6" filter="url(#glow-blue)" />
                    <circle cx="305" cy="205" r="2" fill="#3b82f6" filter="url(#glow-blue)" />
                    <circle cx="320" cy="220" r="2" fill="#3b82f6" filter="url(#glow-blue)" />

                    {/* Centerline (Green) */}
                    <circle cx="200" cy="140" r="2" fill="#22c55e" filter="url(#glow-green)" />
                    <circle cx="200" cy="160" r="2" fill="#22c55e" filter="url(#glow-green)" />
                    <circle cx="215" cy="155" r="2" fill="#22c55e" filter="url(#glow-green)" />
                    <circle cx="230" cy="152" r="2" fill="#22c55e" filter="url(#glow-green)" />
                    <circle cx="245" cy="150" r="2" fill="#22c55e" filter="url(#glow-green)" />
                    <circle cx="260" cy="152" r="2" fill="#22c55e" filter="url(#glow-green)" />
                    <circle cx="275" cy="160" r="2" fill="#22c55e" filter="url(#glow-green)" />
                    <circle cx="290" cy="170" r="2" fill="#22c55e" filter="url(#glow-green)" />
                    <circle cx="305" cy="182" r="2" fill="#22c55e" filter="url(#glow-green)" />
                    <circle cx="320" cy="195" r="2" fill="#22c55e" filter="url(#glow-green)" />
                    <circle cx="335" cy="208" r="2" fill="#22c55e" filter="url(#glow-green)" />
                </g>

                {/* Annotations */}
                {activeType === 'runway' && (
                    <g className="animate-pulse">
                        <text x="210" y="80" fill="white" fontSize="10" fontWeight="bold">Centerline (White)</text>
                        <line x1="210" y1="85" x2="200" y2="100" stroke="white" strokeWidth="0.5" />

                        <text x="20" y="80" fill="white" fontSize="10" fontWeight="bold">Edge (White)</text>
                        <line x1="50" y1="85" x2="60" y2="100" stroke="white" strokeWidth="0.5" />

                        <text x="70" y="270" fill="#22c55e" fontSize="10" fontWeight="bold">Threshold (Green)</text>
                        <text x="70" y="40" fill="#ef4444" fontSize="10" fontWeight="bold">End (Red)</text>
                    </g>
                )}

                {activeType === 'taxiway' && (
                    <g className="animate-pulse">
                        <text x="320" y="140" fill="#3b82f6" fontSize="10" fontWeight="bold">Edge (Blue)</text>
                        <line x1="320" y1="145" x2="300" y2="150" stroke="#3b82f6" strokeWidth="0.5" />

                        <text x="340" y="230" fill="#22c55e" fontSize="10" fontWeight="bold">Center (Green)</text>
                        <line x1="340" y1="225" x2="335" y2="208" stroke="#22c55e" strokeWidth="0.5" />
                    </g>
                )}
            </svg>
        </div>
      </div>
    </div>
  );
};

export default SurfaceLighting;