import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Map, MapPin, Navigation, Info, Plane, Compass } from 'lucide-react';

const CHART_FEATURES = [
  { id: 'classB', name: 'Class B Airspace', color: 'border-blue-600 border-4', desc: 'Solid blue lines. Requires ATC clearance to enter. Often associated with major airports.', x: 30, y: 30, w: 40, h: 40, type: 'circle' },
  { id: 'classC', name: 'Class C Airspace', color: 'border-fuchsia-700 border-4', desc: 'Solid magenta lines. Requires two-way radio communication prior to entry.', x: 10, y: 70, w: 20, h: 20, type: 'circle' },
  { id: 'classD', name: 'Class D Airspace', color: 'border-blue-600 border-2 border-dashed', desc: 'Dashed blue lines. Requires two-way radio communication prior to entry. Towered airports.', x: 75, y: 15, w: 15, h: 15, type: 'circle' },
  { id: 'classE', name: 'Class E Airspace', color: 'border-fuchsia-700 border-4 border-dashed opacity-50', desc: 'Dashed magenta lines. Controlled airspace starting at surface. No specific entry requirements for VFR.', x: 60, y: 60, w: 30, h: 30, type: 'circle' },
  { id: 'vor', name: 'VOR Station', color: 'bg-blue-600/20 border-blue-600 border-2', desc: 'VHF Omnidirectional Range. Primary ground-based navaid. Shown as a compass rose.', x: 45, y: 45, w: 10, h: 10, type: 'hexagon' },
  { id: 'airport', name: 'Towred Airport', color: 'bg-blue-600', desc: 'Blue airports have control towers. Magenta airports do not.', x: 48, y: 48, w: 4, h: 4, type: 'circle' },
];

const VFRChartExplorer: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const handleFeatureClick = (id: string) => {
    setSelectedFeature(id === selectedFeature ? null : id);
  };

  const selectedData = CHART_FEATURES.find(f => f.id === selectedFeature);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left: Map Explorer */}
        <div className="flex-[2] bg-slate-900 border border-slate-800 p-8 rounded-3xl relative overflow-hidden">
          <div className="flex justify-between items-center mb-6 z-10 relative">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Map className="text-cyan-400" /> VFR Sectional Explorer
            </h3>
            <div className="text-xs font-mono bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
              Scale 1:500,000
            </div>
          </div>

          {/* Interactive Map Area */}
          <div className="w-full aspect-[4/3] bg-[#f0ebd8] rounded-xl border-4 border-slate-800 relative overflow-hidden cursor-crosshair">
            
            {/* Terrain Background (Simplified) */}
            <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,50 Q25,30 50,50 T100,50 L100,100 L0,100 Z" fill="#b1d8b7" />
              <path d="M0,70 Q40,40 70,80 T100,60 L100,100 L0,100 Z" fill="#94c995" />
              <path d="M40,0 Q60,30 100,10 L100,0 L40,0 Z" fill="#e0d1b3" />
              {/* Rivers */}
              <path d="M0,20 Q30,40 50,20 T100,30" fill="none" stroke="#6ca6cd" strokeWidth="1" />
            </svg>

            {/* Grid Lines (Lat/Lon) */}
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 opacity-20 pointer-events-none">
              {Array.from({length: 24}).map((_, i) => <div key={i} className="border-r border-b border-black"/>)}
            </div>

            {/* Map Features */}
            {CHART_FEATURES.map((feature) => (
              <motion.div
                key={feature.id}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleFeatureClick(feature.id)}
                className={`absolute cursor-pointer transition-all ${feature.color} ${selectedFeature === feature.id ? 'ring-4 ring-yellow-400/50 shadow-xl z-20' : 'hover:ring-2 hover:ring-white/50 z-10'} ${feature.type === 'circle' ? 'rounded-full' : ''}`}
                style={{
                  left: `${feature.x}%`,
                  top: `${feature.y}%`,
                  width: `${feature.w}%`,
                  height: `${feature.h}%`,
                  transform: 'translate(-50%, -50%)',
                  clipPath: feature.type === 'hexagon' ? 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' : 'none'
                }}
              >
                {/* Feature Label (visible on select) */}
                {selectedFeature === feature.id && feature.type !== 'circle' && (
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg">
                    {feature.name}
                  </div>
                )}
              </motion.div>
            ))}

            {/* Compass Rose around VOR */}
            <div className="absolute top-[45%] left-[45%] w-[15%] h-[15%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-600/50 pointer-events-none flex items-center justify-center">
              <div className="absolute top-0 w-0.5 h-1 bg-blue-600"></div>
              <div className="absolute bottom-0 w-0.5 h-1 bg-blue-600"></div>
              <div className="absolute left-0 w-1 h-0.5 bg-blue-600"></div>
              <div className="absolute right-0 w-1 h-0.5 bg-blue-600"></div>
            </div>

          </div>
        </div>

        {/* Right: Info Panel */}
        <div className="flex-1 space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl min-h-[300px]">
            <h3 className="text-xl font-bold text-white mb-6">Feature Details</h3>
            
            {selectedData ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <h4 className="text-lg font-bold text-cyan-400 border-b border-slate-800 pb-2">
                  {selectedData.name}
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {selectedData.desc}
                </p>
                <div className="bg-slate-800/50 p-4 rounded-xl mt-4">
                  <h5 className="text-xs font-bold text-slate-400 uppercase mb-2">FAA Ground Lesson - Nav</h5>
                  <p className="text-xs text-slate-400">
                    Understanding VFR chart symbology is critical for cross-country planning, airspace avoidance, and radio communication requirements.
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-3 mt-10">
                <MapPin size={48} className="opacity-20" />
                <p className="text-sm">Select a feature on the map to view details.</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Navigation className="text-blue-400" size={20} />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Pilotage</div>
                  <div className="text-[10px] text-slate-400">Nav by landmarks</div>
                </div>
             </div>
             <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-3">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <Compass className="text-indigo-400" size={20} />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Dead Reckoning</div>
                  <div className="text-[10px] text-slate-400">Nav by comp/time</div>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VFRChartExplorer;
