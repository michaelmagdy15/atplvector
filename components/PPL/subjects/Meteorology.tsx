import React, { useState } from 'react';
import { View } from '../../../types';
import { ChevronLeft, CloudLightning, Wind, Droplets, ThermometerSnowflake, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onChangeView: (view: View) => void;
}

const Meteorology: React.FC<Props> = ({ onChangeView }) => {
  const [activeTab, setActiveTab] = useState<'decoder' | 'phenomena'>('decoder');
  const [metarInput, setMetarInput] = useState('METAR KORD 121851Z 27015G25KT 10SM BKN040 OVC080 15/08 A2992 RMK AO2 PK WND 28028/1845');

  const parseMetar = (metar: string) => {
    if (!metar) return [];
    const parts = metar.trim().split(/\s+/);
    return parts.map(part => {
      let meaning = 'Unknown Code';
      if (part === 'METAR' || part === 'SPECI' || part === 'TAF') meaning = 'Report Type';
      else if (/^[A-Z]{4}$/.test(part) && part !== 'RMK') meaning = 'Station Identifier';
      else if (/^\d{6}Z$/.test(part)) meaning = `Date/Time: ${part.substring(0,2)}th at ${part.substring(2,4)}:${part.substring(4,6)} UTC`;
      else if (/^\d{3}\d{2,3}(G\d{2,3})?(KT|MPS|KMH)$/.test(part)) {
        const dir = part.substring(0,3);
        const speed = part.substring(3,5);
        meaning = `Wind: ${dir}° at ${speed} ${part.endsWith('KT') ? 'knots' : 'units'}`;
      }
      else if (/^\d+(SM|KM)$/.test(part) || /^\d+\/\d+SM$/.test(part)) meaning = `Visibility: ${part}`;
      else if (/^(FEW|SCT|BKN|OVC|VV)\d{3}(CB|TCU)?$/.test(part)) {
        const type = part.substring(0,3);
        const height = parseInt(part.substring(3,6)) * 100;
        const labels: any = { FEW: 'Few', SCT: 'Scattered', BKN: 'Broken', OVC: 'Overcast', VV: 'Vertical Visibility' };
        meaning = `Clouds: ${labels[type]} at ${height} ft AGL`;
      }
      else if (/^M?\d{2}\/M?\d{2}$/.test(part)) meaning = `Temp/Dewpoint: ${part.replace('M', '-')}`;
      else if (/^[AQ]\d{4}$/.test(part)) {
        if (part.startsWith('A')) meaning = `Altimeter: ${part.substring(1,3)}.${part.substring(3,5)} inHg`;
        if (part.startsWith('Q')) meaning = `QNH: ${part.substring(1)} hPa`;
      }
      else if (part === 'RMK') meaning = 'Remarks follow';
      
      return { part, meaning };
    });
  };

  const phenomena = [
    {
      id: 'thunderstorm',
      title: 'Thunderstorms (CB)',
      icon: <CloudLightning size={32} />,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/20',
      description: 'Require three ingredients: moisture, instability, and lifting action. Three stages: Cumulus (updrafts), Mature (updrafts & downdrafts, rain starts), Dissipating (downdrafts only). Hazards include severe turbulence, hail, lightning, and microbursts.'
    },
    {
      id: 'icing',
      title: 'Aircraft Icing',
      icon: <ThermometerSnowflake size={32} />,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/20',
      description: 'Requires visible moisture and freezing temperatures. Types include Clear (large drops, freezes slowly, very dangerous), Rime (small drops, freezes instantly, milky appearance), and Mixed. Alters airfoil shape, decreasing lift and increasing drag.'
    },
    {
      id: 'fog',
      title: 'Fog & Visibility',
      icon: <CloudLightning size={32} className="opacity-50" />, // Using cloud as a stand-in for fog
      color: 'text-slate-400',
      bg: 'bg-slate-500/20',
      description: 'Surface-based cloud reducing visibility. Radiation fog (calm, clear nights), Advection fog (warm moist air moves over cold surface, requires wind), Upslope fog (moist air pushed up terrain), Steam fog (cold air over warm water).'
    },
    {
      id: 'fronts',
      title: 'Frontal Systems',
      icon: <Wind size={32} />,
      description: 'Cold Front: Cold air replaces warm air, often causes squall lines and thunderstorms. Warm Front: Warm air rides over cold air, causes widespread stratus clouds and steady precipitation. Occluded Front: Fast cold front catches up to a slow warm front.'
    },
    {
      id: 'wake',
      title: 'Wake Turbulence',
      icon: <Wind size={32} />,
      color: 'text-rose-400',
      bg: 'bg-rose-500/20',
      description: 'Created by wingtip vortices. Greatest when heavy, clean, and slow. Avoidance: Takeoff before heavy aircraft rotation point. Land beyond heavy aircraft touchdown point. Wait 2-3 minutes if taking off behind heavy from same point.'
    }
  ];

  const renderDecoder = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-500">
      <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-full bg-blue-500/10 blur-2xl" />
        <h3 className="text-xl font-bold text-white mb-4 relative z-10">Paste METAR or TAF</h3>
        <div className="relative z-10 flex gap-4">
          <input 
            type="text" 
            value={metarInput}
            onChange={(e) => setMetarInput(e.target.value)}
            className="flex-1 bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="e.g. METAR KLAX..."
          />
          <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-bold transition-colors flex items-center gap-2">
            <Search size={20} />
            Decode
          </button>
        </div>
      </div>

      <div className="bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-white/5">
        <h3 className="text-2xl font-bold text-white mb-6">Decoded Result</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {parseMetar(metarInput).map((item, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.05 }}
                key={idx + item.part} 
                className="p-4 bg-slate-800/50 rounded-xl border border-white/5 flex flex-col gap-1"
              >
                <span className="text-blue-400 font-mono font-bold">{item.part}</span>
                <span className="text-slate-300 text-sm">{item.meaning}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  const renderPhenomena = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {phenomena.map((item) => (
          <motion.div 
            key={item.id}
            whileHover={{ scale: 1.02 }}
            className="bg-slate-900/50 p-8 rounded-3xl border border-white/5 overflow-hidden relative group cursor-pointer"
          >
            <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full blur-[40px] opacity-20 transition-opacity group-hover:opacity-40 ${item.bg.replace('/20', '')}`} />
            
            <div className={`p-4 rounded-2xl w-max mb-6 ${item.bg} ${item.color}`}>
              {item.icon}
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="bg-slate-900/50 p-8 rounded-3xl border border-white/5 relative overflow-hidden">
        <h3 className="text-2xl font-bold text-white mb-6">Wake Turbulence Avoidance Visualizer</h3>
        <div className="relative w-full h-64 bg-slate-800 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden perspective-1000">
          <div className="absolute inset-0 bg-grid-white/5 bg-[size:20px_20px]" />
          
          {/* Heavy Aircraft */}
          <motion.div 
            animate={{ x: [200, -200] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-16 bg-slate-600 rounded-full flex items-center justify-center z-20 shadow-2xl"
          >
            <span className="text-white font-bold text-xs">Heavy B747</span>
            {/* Wingtips */}
            <div className="absolute -left-16 top-1/2 w-16 h-2 bg-slate-500" />
            <div className="absolute -right-16 top-1/2 w-16 h-2 bg-slate-500" />
          </motion.div>

          {/* Vortices */}
          <motion.div 
            animate={{ 
              x: [180, -220],
              y: [0, 60],
              scale: [0.5, 2],
              opacity: [1, 0]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: 0.5 }}
            className="absolute top-1/2 left-1/2 w-48 h-12 border-2 border-red-500/50 rounded-full blur-md z-10"
          />
          <motion.div 
            animate={{ 
              x: [160, -240],
              y: [0, 80],
              scale: [0.8, 3],
              opacity: [0.8, 0]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: 1 }}
            className="absolute top-1/2 left-1/2 w-64 h-16 border-2 border-orange-500/30 rounded-full blur-xl z-10"
          />

          {/* Light Aircraft Avoidance Path */}
          <motion.div
             animate={{ x: [300, -100], y: [-50, -50] }}
             transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: 1.5 }}
             className="absolute top-1/2 left-1/2 w-8 h-4 bg-blue-500 rounded-full z-30 flex items-center justify-center"
          >
            <span className="absolute -top-6 text-blue-300 text-[10px] whitespace-nowrap font-bold">Stay Above & Upwind</span>
          </motion.div>
        </div>
        <p className="text-slate-400 text-sm mt-4 text-center">
          Wingtip vortices sink and drift outward. Always fly above the heavy aircraft's flight path and land beyond its touchdown point.
        </p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in duration-700">
      <button 
        onClick={() => onChangeView(View.PPL_DASHBOARD)}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
        Back to Dashboard
      </button>

      <div className="glass-panel p-8 md:p-12 rounded-3xl border border-blue-500/20 relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
        
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="p-4 bg-blue-500/20 rounded-2xl text-blue-400">
            <CloudLightning size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Meteorology</h1>
        </div>
        
        <p className="text-slate-300 text-lg max-w-2xl leading-relaxed relative z-10">
          Understand aviation weather. Decode terminal aerodrome forecasts (TAF) and routine reports (METAR), and recognize hazardous weather phenomena.
        </p>
      </div>

      <div className="flex gap-4 mb-8 border-b border-white/10 pb-4">
        <button 
          onClick={() => setActiveTab('decoder')}
          className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'decoder' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
        >
          METAR / TAF Decoder
        </button>
        <button 
          onClick={() => setActiveTab('phenomena')}
          className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'phenomena' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
        >
          Weather Phenomena
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'decoder' ? renderDecoder() : renderPhenomena()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Meteorology;
