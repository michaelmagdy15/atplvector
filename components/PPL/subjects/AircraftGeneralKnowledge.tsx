import React, { useState, useEffect } from 'react';
import { View } from '../../../types';
import { ChevronLeft, Settings, Info, Play, Pause, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onChangeView: (view: View) => void;
}

const AircraftGeneralKnowledge: React.FC<Props> = ({ onChangeView }) => {
  const [activeTab, setActiveTab] = useState<'engine' | 'instruments'>('engine');
  const [isPlaying, setIsPlaying] = useState(true);
  const [engineStage, setEngineStage] = useState(0); // 0: Intake, 1: Compression, 2: Power, 3: Exhaust
  
  // Pitot-Static State
  const [isPitotBlocked, setIsPitotBlocked] = useState(false);
  const [isStaticBlocked, setIsStaticBlocked] = useState(false);
  const [flightState, setFlightState] = useState<'level' | 'climb' | 'descend'>('level');

  // Engine Animation Loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && activeTab === 'engine') {
      interval = setInterval(() => {
        setEngineStage((prev) => (prev + 1) % 4);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, activeTab]);

  const engineStages = [
    { name: 'Intake', color: 'text-blue-400', desc: 'Intake valve opens, piston moves down, drawing in fuel/air mixture.' },
    { name: 'Compression', color: 'text-yellow-400', desc: 'Valves close, piston moves up, compressing the mixture.' },
    { name: 'Power', color: 'text-red-500', desc: 'Spark plug fires, mixture ignites, forcing piston down.' },
    { name: 'Exhaust', color: 'text-gray-400', desc: 'Exhaust valve opens, piston moves up, expelling exhaust gases.' }
  ];

  const getPistonY = () => {
    switch (engineStage) {
      case 0: return 60; // down
      case 1: return 10; // up
      case 2: return 60; // down
      case 3: return 10; // up
      default: return 10;
    }
  };

  const renderEngine = () => (
    <div className="flex flex-col md:flex-row gap-8 items-center bg-slate-900/50 p-8 rounded-3xl border border-white/5">
      <div className="flex-1 w-full flex flex-col items-center">
        <div className="relative w-64 h-80 bg-slate-800 rounded-t-full border-4 border-slate-700 flex justify-center overflow-hidden">
          {/* Spark Plug */}
          <div className="absolute top-0 w-8 h-12 bg-slate-600 rounded-b-lg flex justify-center">
            <div className="w-2 h-4 bg-gray-400 absolute bottom-0" />
            <AnimatePresence>
              {engineStage === 2 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1.5 }}
                  exit={{ opacity: 0 }}
                  className="absolute -bottom-6 w-12 h-12 bg-yellow-400 rounded-full blur-md"
                />
              )}
            </AnimatePresence>
          </div>

          {/* Valves */}
          <motion.div 
            animate={{ y: engineStage === 0 ? 15 : 0 }}
            className="absolute top-8 left-12 w-6 h-4 bg-blue-500/50 rounded-b-lg"
          />
          <motion.div 
            animate={{ y: engineStage === 3 ? 15 : 0 }}
            className="absolute top-8 right-12 w-6 h-4 bg-gray-500/50 rounded-b-lg"
          />

          {/* Mixture Color overlay */}
          <motion.div 
            animate={{ 
              opacity: engineStage === 0 ? 0.3 : engineStage === 1 ? 0.5 : engineStage === 2 ? 0.8 : 0.2,
              backgroundColor: engineStage === 2 ? '#ef4444' : engineStage === 1 ? '#eab308' : '#3b82f6'
            }}
            className="absolute top-12 left-0 w-full h-full"
          />

          {/* Piston */}
          <motion.div 
            animate={{ y: getPistonY() }}
            transition={{ type: "spring", stiffness: 60, damping: 15 }}
            className="absolute w-48 h-32 bg-slate-400 rounded-t-xl border-t-4 border-slate-300 shadow-xl"
          >
            <div className="w-full h-4 mt-4 bg-slate-500/50" />
            <div className="w-full h-4 mt-2 bg-slate-500/50" />
            {/* Connecting Rod */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-8 h-40 bg-slate-500" />
          </motion.div>
        </div>

        <div className="flex gap-4 mt-8">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-3 bg-orange-500 hover:bg-orange-600 rounded-full text-white transition-colors"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <div className="flex gap-2">
            {[0, 1, 2, 3].map(stage => (
              <button 
                key={stage}
                onClick={() => { setIsPlaying(false); setEngineStage(stage); }}
                className={`w-12 h-12 rounded-xl font-bold transition-all ${engineStage === stage ? 'bg-orange-500 text-white scale-110 shadow-lg shadow-orange-500/20' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
              >
                {stage + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-6">
        <h3 className="text-3xl font-black text-white">4-Stroke Cycle</h3>
        <div className="space-y-4">
          {engineStages.map((stage, idx) => (
            <div 
              key={idx}
              className={`p-4 rounded-2xl border transition-all ${engineStage === idx ? 'border-orange-500 bg-orange-500/10' : 'border-white/5 bg-slate-800/50 opacity-50'}`}
            >
              <h4 className={`text-xl font-bold mb-1 ${stage.color}`}>{stage.name}</h4>
              <p className="text-slate-300">{stage.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const getAsiStatus = () => {
    if (isPitotBlocked && isStaticBlocked) return "Frozen at current speed (acts as altimeter)";
    if (isPitotBlocked) return "Drops to zero (if drain open) or frozen";
    if (isStaticBlocked) return "Reads low in climb, high in descent";
    return "Normal Operation";
  };

  const getAltimeterStatus = () => {
    if (isStaticBlocked) return "Frozen at blockage altitude";
    return "Normal Operation";
  };

  const getVsiStatus = () => {
    if (isStaticBlocked) return "Reads zero (level flight)";
    return "Normal Operation";
  };

  const renderInstruments = () => (
    <div className="bg-slate-900/50 p-8 rounded-3xl border border-white/5 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Controls */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-white mb-4">Simulate Blockages</h3>
          
          <div className="space-y-4">
            <button 
              onClick={() => setIsPitotBlocked(!isPitotBlocked)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${isPitotBlocked ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'bg-slate-800 border-white/5 text-slate-300 hover:bg-slate-700'}`}
            >
              <span className="font-semibold">Block Pitot Tube</span>
              {isPitotBlocked && <AlertTriangle size={20} />}
            </button>
            <button 
              onClick={() => setIsStaticBlocked(!isStaticBlocked)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${isStaticBlocked ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'bg-slate-800 border-white/5 text-slate-300 hover:bg-slate-700'}`}
            >
              <span className="font-semibold">Block Static Port</span>
              {isStaticBlocked && <AlertTriangle size={20} />}
            </button>
          </div>

          <div className="pt-6 border-t border-white/10">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Flight State</h4>
            <div className="flex gap-2">
              {['climb', 'level', 'descend'].map(state => (
                <button
                  key={state}
                  onClick={() => setFlightState(state as any)}
                  className={`flex-1 py-2 rounded-lg font-medium capitalize transition-colors ${flightState === state ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                >
                  {state}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Instruments Display */}
        <div className="grid gap-4">
          <div className="p-5 bg-slate-800 rounded-2xl border border-white/5 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-24 h-full bg-blue-500/10 blur-xl" />
            <h4 className="text-lg font-bold text-white mb-2">Airspeed Indicator (ASI)</h4>
            <p className={`text-sm ${isPitotBlocked || isStaticBlocked ? 'text-red-400 font-medium' : 'text-green-400'}`}>
              {getAsiStatus()}
            </p>
            <div className="mt-4 h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div 
                animate={{ width: isPitotBlocked ? '0%' : flightState === 'climb' ? '40%' : flightState === 'descend' ? '80%' : '60%' }}
                className={`h-full ${isPitotBlocked ? 'bg-red-500' : 'bg-blue-500'}`}
              />
            </div>
          </div>

          <div className="p-5 bg-slate-800 rounded-2xl border border-white/5 relative overflow-hidden">
             <div className="absolute right-0 top-0 w-24 h-full bg-green-500/10 blur-xl" />
            <h4 className="text-lg font-bold text-white mb-2">Altimeter</h4>
            <p className={`text-sm ${isStaticBlocked ? 'text-red-400 font-medium' : 'text-green-400'}`}>
              {getAltimeterStatus()}
            </p>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-500 font-mono">
               <span>0</span>
               <span>5000</span>
               <span>10000</span>
            </div>
            <div className="mt-1 h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div 
                animate={{ width: isStaticBlocked ? '50%' : flightState === 'climb' ? '70%' : flightState === 'descend' ? '30%' : '50%' }}
                className={`h-full ${isStaticBlocked ? 'bg-red-500' : 'bg-green-500'}`}
              />
            </div>
          </div>

          <div className="p-5 bg-slate-800 rounded-2xl border border-white/5 relative overflow-hidden">
             <div className="absolute right-0 top-0 w-24 h-full bg-purple-500/10 blur-xl" />
            <h4 className="text-lg font-bold text-white mb-2">Vertical Speed (VSI)</h4>
            <p className={`text-sm ${isStaticBlocked ? 'text-red-400 font-medium' : 'text-green-400'}`}>
              {getVsiStatus()}
            </p>
             <div className="mt-4 flex items-center justify-center gap-4">
                <motion.div 
                  animate={{ rotate: isStaticBlocked ? 0 : flightState === 'climb' ? 45 : flightState === 'descend' ? -45 : 0 }}
                  className="w-16 h-2 bg-purple-500 rounded-full origin-left"
                />
             </div>
          </div>
        </div>
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

      <div className="glass-panel p-8 md:p-12 rounded-3xl border border-orange-500/20 relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
        
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="p-4 bg-orange-500/20 rounded-2xl text-orange-400">
            <Settings size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Aircraft General Knowledge</h1>
        </div>
        
        <p className="text-slate-300 text-lg max-w-2xl leading-relaxed relative z-10">
          Master the systems of a typical single-engine piston training aircraft. Understand engine operations and flight instruments.
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setActiveTab('engine')}
          className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'engine' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
        >
          4-Stroke Engine
        </button>
        <button 
          onClick={() => setActiveTab('instruments')}
          className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'instruments' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
        >
          Pitot-Static System
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'engine' ? renderEngine() : renderInstruments()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AircraftGeneralKnowledge;
