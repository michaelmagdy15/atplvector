import React, { useState } from 'react';
import { Cloud, Sun, Eye, CheckCircle, XCircle } from 'lucide-react';

const PRESETS = [
  {
    name: 'CAVOK (Good VFR)',
    code: 'EGLL 121020Z 27010KT 9999 FEW040 18/12 Q1020 NOSIG',
    vis: 10000,
    clouds: 4000,
    cloudType: 'cumulus',
    weather: 'sunny'
  },
  {
    name: 'Marginal VFR',
    code: 'EGLL 121020Z 24015KT 6000 SCT014 15/12 Q1015',
    vis: 6000,
    clouds: 1400,
    cloudType: 'stratocumulus',
    weather: 'cloudy'
  },
  {
    name: 'IMC (Bad Weather)',
    code: 'EGLL 121020Z 20020G30KT 3000 OVC008 12/11 Q1008RA',
    vis: 3000,
    clouds: 800,
    cloudType: 'stratus',
    weather: 'rainy'
  }
];

const WeatherMinima: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0]);

  // VFR Rules (Simplified for demo)
  const vfrRules = [
    { label: 'Visibility > 5km', passed: selectedPreset.vis >= 5000 },
    { label: 'Cloud Ceiling > 1500ft', passed: selectedPreset.clouds >= 1500 },
  ];
  
  const isVFR = vfrRules.every(r => r.passed);

  // Generate rain drops
  const rainDrops = Array.from({ length: 20 }).map((_, i) => ({
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 1}s`,
    duration: `${0.5 + Math.random() * 0.5}s`
  }));

  // Render specific cloud type
  const renderCloud = (className: string, delay: string) => {
    const type = selectedPreset.cloudType;
    
    if (type === 'stratus') {
      // Flat, layered clouds for IMC
      return (
        <svg viewBox="0 0 200 60" className={className} style={{ animationDelay: delay }}>
          <path d="M10,30 Q50,20 100,30 T190,30 L190,50 L10,50 Z" fill="currentColor" opacity="0.9" />
          <path d="M0,40 Q60,30 120,40 T200,40" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" />
        </svg>
      );
    }
    
    if (type === 'stratocumulus') {
       // Lower, slightly flatter cumulus
       return (
        <svg viewBox="0 0 100 60" className={className} style={{ animationDelay: delay }}>
           <path d="M10,40 Q25,25 50,40 T90,40" fill="currentColor" stroke="currentColor" strokeWidth="15" strokeLinecap="round" opacity="0.8" />
        </svg>
       );
    }

    // Default Cumulus (Fluffy)
    return <Cloud className={className} style={{ animationDelay: delay }} />;
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
      <style>{`
        @keyframes rain-fall {
          0% { transform: translateY(-10px); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translateY(200px); opacity: 0; }
        }
        @keyframes sun-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes sun-pulse {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 0.8; }
        }
        @keyframes cloud-float {
          0% { transform: translateX(0px); }
          50% { transform: translateX(10px); }
          100% { transform: translateX(0px); }
        }
      `}</style>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Cloud className="text-sky-400" />
            Weather & VFR Minima
          </h2>
          <p className="text-slate-400 text-sm">Visualize how METAR conditions affect VFR legality.</p>
        </div>

        <div className="flex bg-slate-900 p-1 rounded-lg">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => setSelectedPreset(preset)}
              className={`px-3 py-2 rounded-md font-bold text-xs transition-colors ${
                selectedPreset.name === preset.name
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Visualization Window */}
        <div className="relative h-64 rounded-xl overflow-hidden border-4 border-slate-700 shadow-inner group bg-slate-900">
          {/* Dynamic Sky Background */}
          <div className={`absolute inset-0 transition-all duration-1000 ${
            selectedPreset.weather === 'rainy' ? 'bg-slate-700' : 
            selectedPreset.weather === 'cloudy' ? 'bg-slate-500' : 'bg-gradient-to-b from-sky-400 to-sky-200'
          }`}>
             {/* SUN */}
             {selectedPreset.weather === 'sunny' && (
                <div className="absolute top-4 right-4">
                   <Sun className="text-yellow-300 w-16 h-16 animate-[sun-spin_20s_linear_infinite]" />
                   <div className="absolute inset-0 bg-yellow-300/20 blur-xl rounded-full animate-[sun-pulse_3s_ease-in-out_infinite]"></div>
                </div>
             )}
             
             {/* CLOUDS LAYER */}
             <div className="absolute inset-0 transition-transform duration-1000" style={{ transform: `translateY(${Math.max(0, (5000 - selectedPreset.clouds) / 20)}px)` }}>
                {selectedPreset.weather !== 'sunny' ? (
                  <>
                     {/* Dynamic rendering based on cloud type */}
                     <div className="absolute top-[-20px] left-[-20px] text-slate-300/80 w-64 h-32 blur-sm animate-[cloud-float_8s_ease-in-out_infinite]">
                        {renderCloud('w-full h-full', '0s')}
                     </div>
                     <div className="absolute top-[-10px] right-[-20px] text-slate-200/70 w-80 h-40 blur-md animate-[cloud-float_12s_ease-in-out_infinite_reverse]">
                        {renderCloud('w-full h-full', '2s')}
                     </div>
                     <div className="absolute top-10 left-1/3 text-slate-400/60 w-96 h-48 blur-xl animate-[cloud-float_10s_ease-in-out_infinite]">
                        {renderCloud('w-full h-full', '1s')}
                     </div>
                     
                     {selectedPreset.weather === 'rainy' && (
                       <div className="absolute inset-0 bg-slate-900/40"></div>
                     )}
                  </>
                ) : (
                  <>
                     {/* Fair Weather Cumulus */}
                     <div className="absolute top-4 left-10 text-white/80 w-24 h-24 blur-sm animate-[cloud-float_8s_ease-in-out_infinite]">
                        {renderCloud('w-full h-full', '0s')}
                     </div>
                     <div className="absolute top-12 right-20 text-white/60 w-32 h-32 blur-sm animate-[cloud-float_12s_ease-in-out_infinite_reverse]">
                        {renderCloud('w-full h-full', '4s')}
                     </div>
                  </>
                )}
             </div>

             {/* RAIN DROPS */}
             {selectedPreset.weather === 'rainy' && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                   {rainDrops.map((drop, i) => (
                      <div 
                        key={i}
                        className="absolute top-0 w-[1px] h-4 bg-sky-200/50"
                        style={{
                           left: drop.left,
                           animation: `rain-fall ${drop.duration} linear infinite`,
                           animationDelay: drop.delay
                        }}
                      ></div>
                   ))}
                </div>
             )}

             {/* Landscape Visibility Blur */}
             <div className="absolute bottom-0 w-full h-1/3 bg-emerald-800 transition-all duration-1000 overflow-hidden" style={{ filter: `blur(${Math.max(0, (10000 - selectedPreset.vis) / 500)}px)` }}>
                {/* Runway Strips */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-full bg-slate-500/80 perspective-origin-bottom transform perspective-1000 rotate-x-60 border-x border-dashed border-white/20"></div>
                <div className="absolute bottom-0 left-[20%] w-8 h-8 bg-emerald-700 rounded-full"></div>
                <div className="absolute bottom-[20%] right-[30%] w-12 h-12 bg-emerald-600 rounded-full"></div>
             </div>
          </div>
          
          {/* HUD Overlay */}
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur p-3 rounded-lg border border-white/10 shadow-lg">
             <div className="font-mono text-xs text-green-400 mb-1">METAR DECODED</div>
             <div className="flex items-center gap-2 text-white text-sm">
                <Eye size={14} className="text-sky-400" /> Vis: {selectedPreset.vis}m
             </div>
             <div className="flex items-center gap-2 text-white text-sm">
                <Cloud size={14} className="text-slate-400" /> Ceiling: {selectedPreset.clouds}ft ({selectedPreset.cloudType})
             </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="space-y-6">
           <div className="bg-slate-900 p-4 rounded-lg font-mono text-sm text-sky-300 border border-slate-700 shadow-inner">
              {selectedPreset.code}
           </div>

           <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
              <h3 className="font-bold text-white mb-4">VFR Flight Status</h3>
              <div className="space-y-3">
                 {vfrRules.map((rule, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded bg-slate-800">
                       <span className="text-slate-300 text-sm">{rule.label}</span>
                       {rule.passed ? (
                          <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                             <CheckCircle size={16} /> PASS
                          </div>
                       ) : (
                          <div className="flex items-center gap-2 text-red-400 text-sm font-bold">
                             <XCircle size={16} /> FAIL
                          </div>
                       )}
                    </div>
                 ))}
              </div>

              <div className={`mt-6 p-4 rounded text-center font-black text-xl border-2 transition-all ${
                 isVFR 
                 ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                 : 'bg-red-500/20 border-red-500 text-red-400'
              }`}>
                 {isVFR ? 'VFR PERMITTED' : 'IFR ONLY'}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherMinima;