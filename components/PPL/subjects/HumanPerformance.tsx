import React, { useState } from 'react';
import { View } from '../../../types';
import { ChevronLeft, Users, Eye, HeartPulse, AlertTriangle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onChangeView: (view: View) => void;
}

const HumanPerformance: React.FC<Props> = ({ onChangeView }) => {
  const [activeTab, setActiveTab] = useState<'hypoxia' | 'illusions'>('hypoxia');
  
  // Hypoxia state
  const [altitude, setAltitude] = useState<number>(0);

  // Illusions state
  const [runwayIllusion, setRunwayIllusion] = useState<'normal' | 'upsloping' | 'downsloping' | 'narrow' | 'wide'>('normal');

  const getHypoxiaSymptoms = (alt: number) => {
    if (alt < 10000) return ['Normal cognitive function', 'Normal vision', 'No impairment'];
    if (alt < 15000) return ['Impaired dark adaptation', 'Slightly increased heart rate', 'Mild euphoria or fatigue'];
    if (alt < 20000) return ['Significant cognitive impairment', 'Cyanosis (blue lips/fingers)', 'Loss of coordination', 'Dizziness', 'Headache'];
    return ['Loss of consciousness', 'Severe cyanosis', 'Convulsions', 'Coma'];
  };

  const getTUC = (alt: number) => {
    if (alt < 15000) return 'Indefinite';
    if (alt < 18000) return '30 minutes';
    if (alt < 22000) return '5 - 10 minutes';
    if (alt < 25000) return '3 - 5 minutes';
    if (alt < 28000) return '2.5 - 3 minutes';
    if (alt < 30000) return '1 - 2 minutes';
    if (alt < 35000) return '30 - 60 seconds';
    return '9 - 15 seconds';
  };

  const getOxygenSaturation = (alt: number) => {
    if (alt < 5000) return 98;
    if (alt < 10000) return 90;
    if (alt < 15000) return 81;
    if (alt < 20000) return 71;
    if (alt < 25000) return 60;
    return 50;
  };

  const currentSymptoms = getHypoxiaSymptoms(altitude);
  const currentTUC = getTUC(altitude);
  const currentSpO2 = getOxygenSaturation(altitude);

  const getIllusionDescription = () => {
    switch (runwayIllusion) {
      case 'upsloping':
        return 'An upsloping runway creates the illusion that the aircraft is higher than it actually is. The pilot may fly a lower approach.';
      case 'downsloping':
        return 'A downsloping runway creates the illusion that the aircraft is lower than it actually is. The pilot may fly a higher approach.';
      case 'narrow':
        return 'A narrower-than-usual runway creates the illusion that the aircraft is higher than it actually is. The pilot may fly a lower approach.';
      case 'wide':
        return 'A wider-than-usual runway creates the illusion that the aircraft is lower than it actually is. The pilot may fly a higher approach.';
      default:
        return 'Normal runway proportions and slope.';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in duration-700">
      <button 
        onClick={() => onChangeView(View.PPL_DASHBOARD)}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
        Back to Dashboard
      </button>

      <div className="glass-panel p-8 md:p-12 rounded-3xl border border-emerald-500/20 relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
        
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="p-4 bg-emerald-500/20 rounded-2xl text-emerald-400">
            <Users size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Human Performance</h1>
        </div>
        
        <p className="text-slate-300 text-lg max-w-2xl leading-relaxed relative z-10">
          Explore interactive simulators for aeromedical factors, physiology, and visual illusions critical to aviation safety.
        </p>
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('hypoxia')}
          className={`px-6 py-3 rounded-xl font-bold transition-all ${
            activeTab === 'hypoxia' 
              ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          Hypoxia Simulator
        </button>
        <button
          onClick={() => setActiveTab('illusions')}
          className={`px-6 py-3 rounded-xl font-bold transition-all ${
            activeTab === 'illusions' 
              ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          Visual Illusions
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'hypoxia' && (
          <motion.div
            key="hypoxia"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <div className="glass-panel p-8 rounded-3xl border border-white/10">
              <div className="flex items-center gap-3 mb-8">
                <HeartPulse className="text-emerald-400" size={28} />
                <h2 className="text-2xl font-bold text-white">Altitude Physiology</h2>
              </div>

              <div className="mb-12">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-slate-400 font-medium">Altitude</span>
                  <span className="text-3xl font-black text-white">{altitude.toLocaleString()} ft</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="40000" 
                  step="1000" 
                  value={altitude} 
                  onChange={(e) => setAltitude(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium">
                  <span>Sea Level</span>
                  <span>10,000'</span>
                  <span>20,000'</span>
                  <span>30,000'</span>
                  <span>40,000'</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className={`p-6 rounded-2xl border transition-colors ${altitude >= 12500 && altitude <= 14000 ? 'bg-orange-500/20 border-orange-500/50' : 'bg-slate-800/50 border-white/5'}`}>
                  <div className="text-sm text-slate-400 mb-1">FAA Part 91.211</div>
                  <div className="font-bold text-white text-lg leading-tight">12,500' - 14,000'</div>
                  <div className="text-xs text-slate-400 mt-2">Crew must use O2 if &gt; 30 mins</div>
                </div>
                <div className={`p-6 rounded-2xl border transition-colors ${altitude > 14000 && altitude <= 15000 ? 'bg-orange-500/20 border-orange-500/50' : 'bg-slate-800/50 border-white/5'}`}>
                  <div className="text-sm text-slate-400 mb-1">FAA Part 91.211</div>
                  <div className="font-bold text-white text-lg leading-tight">&gt; 14,000'</div>
                  <div className="text-xs text-slate-400 mt-2">Crew must use O2 continuously</div>
                </div>
                <div className={`col-span-2 p-6 rounded-2xl border transition-colors ${altitude > 15000 ? 'bg-red-500/20 border-red-500/50' : 'bg-slate-800/50 border-white/5'}`}>
                  <div className="text-sm text-slate-400 mb-1">FAA Part 91.211</div>
                  <div className="font-bold text-white text-lg leading-tight">&gt; 15,000'</div>
                  <div className="text-xs text-slate-400 mt-2">Every occupant must be provided O2</div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass-panel p-6 rounded-3xl border border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-400 mb-1 font-medium">Blood Oxygen Saturation (SpO2)</div>
                  <div className="text-3xl font-black text-white">{currentSpO2}%</div>
                </div>
                <div className="w-16 h-16 rounded-full flex items-center justify-center relative">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-800" />
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="282.7" strokeDashoffset={282.7 - (282.7 * currentSpO2) / 100} className={`${currentSpO2 < 90 ? 'text-red-500' : 'text-emerald-500'} transition-all duration-500`} />
                  </svg>
                </div>
              </div>

              <div className="glass-panel p-6 rounded-3xl border border-white/10">
                <div className="text-sm text-slate-400 mb-1 font-medium">Time of Useful Consciousness</div>
                <div className={`text-4xl font-black ${altitude >= 20000 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {currentTUC}
                </div>
              </div>

              <div className="glass-panel p-6 rounded-3xl border border-white/10 flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle size={20} className={altitude >= 15000 ? 'text-red-400' : 'text-emerald-400'} />
                  <h3 className="font-bold text-white">Symptoms of Hypoxia</h3>
                </div>
                <ul className="space-y-3">
                  {currentSymptoms.map((symptom, idx) => (
                    <motion.li 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      key={`${altitude}-${idx}`}
                      className="flex items-center gap-3 text-slate-300 bg-slate-800/50 p-3 rounded-xl border border-white/5"
                    >
                      <ArrowRight size={16} className="text-emerald-500 shrink-0" />
                      {symptom}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'illusions' && (
          <motion.div
            key="illusions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="glass-panel p-8 rounded-3xl border border-white/10 lg:col-span-1 space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <Eye className="text-emerald-400" size={28} />
                <h2 className="text-2xl font-bold text-white">Approach Illusions</h2>
              </div>
              
              <button 
                onClick={() => setRunwayIllusion('normal')}
                className={`w-full text-left p-4 rounded-xl font-bold transition-all border ${runwayIllusion === 'normal' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-slate-800/50 border-white/5 text-slate-400 hover:bg-slate-700/50'}`}
              >
                Normal Runway
              </button>
              <button 
                onClick={() => setRunwayIllusion('upsloping')}
                className={`w-full text-left p-4 rounded-xl font-bold transition-all border ${runwayIllusion === 'upsloping' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-slate-800/50 border-white/5 text-slate-400 hover:bg-slate-700/50'}`}
              >
                Upsloping Runway
              </button>
              <button 
                onClick={() => setRunwayIllusion('downsloping')}
                className={`w-full text-left p-4 rounded-xl font-bold transition-all border ${runwayIllusion === 'downsloping' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-slate-800/50 border-white/5 text-slate-400 hover:bg-slate-700/50'}`}
              >
                Downsloping Runway
              </button>
              <button 
                onClick={() => setRunwayIllusion('narrow')}
                className={`w-full text-left p-4 rounded-xl font-bold transition-all border ${runwayIllusion === 'narrow' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-slate-800/50 border-white/5 text-slate-400 hover:bg-slate-700/50'}`}
              >
                Narrow Runway
              </button>
              <button 
                onClick={() => setRunwayIllusion('wide')}
                className={`w-full text-left p-4 rounded-xl font-bold transition-all border ${runwayIllusion === 'wide' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-slate-800/50 border-white/5 text-slate-400 hover:bg-slate-700/50'}`}
              >
                Wide Runway
              </button>

              <div className="mt-8 p-4 bg-slate-900 rounded-2xl border border-white/10">
                <div className="text-sm font-bold text-white mb-2">Effect</div>
                <p className="text-slate-400 text-sm leading-relaxed">{getIllusionDescription()}</p>
              </div>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-white/10 lg:col-span-2 flex flex-col items-center justify-center relative min-h-[500px] overflow-hidden perspective-[1000px]">
              {/* Sky and Ground */}
              <div className="absolute inset-0 bg-gradient-to-b from-blue-900 to-slate-900/0 h-1/2 z-0" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-b from-green-900/20 to-slate-900 h-1/2 z-0" />
              <div className="absolute inset-x-0 top-1/2 h-[1px] bg-white/20 z-0" />

              {/* Viewport for 3D runway */}
              <div className="relative w-full max-w-[600px] h-[400px] z-10 flex flex-col items-center justify-end overflow-visible">
                
                {/* Aircraft Instrument Reference (HUD) */}
                <div className="absolute inset-0 border-2 border-emerald-500/20 rounded-3xl pointer-events-none flex items-center justify-center">
                  <div className="w-16 h-16 border border-emerald-500/50 rounded-full" />
                  <div className="absolute w-32 h-[1px] bg-emerald-500/50" />
                  <div className="absolute w-[1px] h-32 bg-emerald-500/50" />
                  {/* Actual Glide Path indicator */}
                  <div className={`absolute left-4 w-4 h-32 border-2 border-slate-600 rounded-full flex flex-col justify-center items-center`}>
                    <div className="h-[2px] w-6 bg-slate-500 mb-8" />
                    <div className="h-[2px] w-8 bg-emerald-500" />
                    <div className="h-[2px] w-6 bg-slate-500 mt-8" />
                    
                    {/* Deviation indicator */}
                    <motion.div 
                      className="absolute w-4 h-4 bg-emerald-400 rotate-45 border-2 border-slate-900"
                      animate={{
                        y: runwayIllusion === 'upsloping' || runwayIllusion === 'narrow' ? 24 : 
                           runwayIllusion === 'downsloping' || runwayIllusion === 'wide' ? -24 : 0
                      }}
                      transition={{ type: "spring", stiffness: 50 }}
                    />
                  </div>
                </div>

                {/* Runway element */}
                <motion.div 
                  className="bg-slate-800 relative flex justify-center border-x-4 border-slate-600 origin-bottom"
                  initial={false}
                  animate={{
                    width: runwayIllusion === 'narrow' ? '120px' : runwayIllusion === 'wide' ? '300px' : '200px',
                    height: runwayIllusion === 'upsloping' ? '180px' : runwayIllusion === 'downsloping' ? '320px' : '250px',
                    rotateX: runwayIllusion === 'upsloping' ? '70deg' : runwayIllusion === 'downsloping' ? '50deg' : '60deg',
                    y: runwayIllusion === 'upsloping' ? -20 : runwayIllusion === 'downsloping' ? 20 : 0
                  }}
                  transition={{ type: "spring", stiffness: 40, damping: 15 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Centerline */}
                  <div className="w-[4px] h-full bg-white opacity-80" style={{ backgroundImage: 'linear-gradient(to bottom, transparent 50%, white 50%)', backgroundSize: '100% 40px' }} />
                  
                  {/* Threshold markings */}
                  <div className="absolute bottom-4 w-full px-4 flex justify-between h-16">
                    <div className="w-[10%] h-full bg-white opacity-80" />
                    <div className="w-[10%] h-full bg-white opacity-80" />
                    <div className="w-[10%] h-full bg-white opacity-80" />
                    <div className="w-[10%] h-full bg-white opacity-80" />
                  </div>
                  
                  {/* Aiming point markings */}
                  <div className="absolute bottom-32 w-full px-8 flex justify-between h-20">
                    <div className="w-[20%] h-full bg-white opacity-90" />
                    <div className="w-[20%] h-full bg-white opacity-90" />
                  </div>
                </motion.div>
                
                {/* Pilot's actual path description */}
                <motion.div 
                  className="absolute top-8 bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-emerald-500/30 text-center shadow-xl"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={runwayIllusion}
                >
                  <div className="font-bold text-white text-lg">
                    {runwayIllusion === 'normal' && 'On 3° Glide Path'}
                    {(runwayIllusion === 'upsloping' || runwayIllusion === 'narrow') && 'Pilot flies LOWER approach'}
                    {(runwayIllusion === 'downsloping' || runwayIllusion === 'wide') && 'Pilot flies HIGHER approach'}
                  </div>
                  <div className="text-emerald-400 text-sm mt-1">
                    {(runwayIllusion === 'upsloping' || runwayIllusion === 'narrow') && 'Risk of striking obstacles or landing short'}
                    {(runwayIllusion === 'downsloping' || runwayIllusion === 'wide') && 'Risk of overshooting the runway'}
                    {runwayIllusion === 'normal' && 'Normal sight picture'}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HumanPerformance;
