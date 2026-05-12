import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Settings, Info, Battery, Zap, Droplets } from 'lucide-react';

const STROKES = [
  { id: 'intake', name: 'Intake Stroke', color: 'bg-blue-500', desc: 'Intake valve opens. Piston moves down, drawing in the air-fuel mixture.' },
  { id: 'compression', name: 'Compression Stroke', color: 'bg-orange-500', desc: 'Both valves close. Piston moves up, compressing the mixture.' },
  { id: 'power', name: 'Power Stroke', color: 'bg-red-500', desc: 'Spark plug fires. Explosion forces the piston down. Turns the crankshaft.' },
  { id: 'exhaust', name: 'Exhaust Stroke', color: 'bg-gray-500', desc: 'Exhaust valve opens. Piston moves up, pushing out burned gases.' },
];

const PistonEngineVisualizer: React.FC = () => {
  const [activeStrokeIndex, setActiveStrokeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(2); // seconds per cycle

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveStrokeIndex((prev) => (prev + 1) % STROKES.length);
      }, (speed * 1000) / 4);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  const activeStroke = STROKES[activeStrokeIndex];

  // Animation variants based on stroke
  const pistonVariants = {
    intake: { y: 100 },       // Moves down
    compression: { y: 0 },    // Moves up
    power: { y: 100 },        // Moves down
    exhaust: { y: 0 },        // Moves up
  };

  const intakeValveVariants = {
    intake: { y: 15, rotate: -10 },
    compression: { y: 0, rotate: 0 },
    power: { y: 0, rotate: 0 },
    exhaust: { y: 0, rotate: 0 },
  };

  const exhaustValveVariants = {
    intake: { y: 0, rotate: 0 },
    compression: { y: 0, rotate: 0 },
    power: { y: 0, rotate: 0 },
    exhaust: { y: 15, rotate: 10 },
  };

  const sparkVariants = {
    intake: { opacity: 0, scale: 0 },
    compression: { opacity: 0, scale: 0 },
    power: { opacity: 1, scale: 1.5, transition: { duration: 0.1 } },
    exhaust: { opacity: 0, scale: 0 },
  };

  const mixtureVariants = {
    intake: { opacity: 0.5, backgroundColor: '#3b82f6', height: '100%' },
    compression: { opacity: 0.8, backgroundColor: '#f97316', height: '20%' },
    power: { opacity: 0.9, backgroundColor: '#ef4444', height: '100%' },
    exhaust: { opacity: 0.3, backgroundColor: '#6b7280', height: '20%' },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Col: Animation */}
        <div className="flex-1 bg-slate-900 border border-slate-800 p-8 rounded-3xl relative overflow-hidden flex flex-col items-center justify-center min-h-[500px]">
          
          {/* Controls */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20">
            <h3 className="text-white font-bold flex items-center gap-2"><Settings className="text-orange-400"/> 4-Stroke Engine</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 text-white transition"
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>
            </div>
          </div>

          <div className="absolute top-4 right-4 text-xs font-mono text-slate-400 z-20 bg-black/50 px-2 py-1 rounded">
            RPM: {Math.round(60 / speed * 2)}
          </div>

          {/* Engine Cylinder Assembly */}
          <div className="relative w-48 h-80 mt-8">
            
            {/* Cylinder Block */}
            <div className="absolute inset-0 border-4 border-slate-600 border-t-0 rounded-b-xl z-10" />
            
            {/* Cylinder Head */}
            <div className="absolute -top-4 left-0 right-0 h-16 border-4 border-slate-600 rounded-t-xl z-0" />

            {/* Spark Plug */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-4 h-10 bg-slate-400 rounded-t-sm z-20 flex flex-col items-center">
              <div className="w-2 h-2 bg-slate-300 rounded-full mt-1"></div>
              <div className="w-1 h-8 bg-slate-500"></div>
              {/* Spark Animation */}
              <motion.div 
                variants={sparkVariants}
                animate={activeStroke.id}
                className="absolute bottom-[-15px] text-yellow-400"
              >
                <Zap size={24} fill="currentColor" />
              </motion.div>
            </div>

            {/* Intake Valve */}
            <motion.div 
              variants={intakeValveVariants}
              animate={activeStroke.id}
              transition={{ duration: (speed / 4) * 0.8 }}
              className="absolute -top-2 left-6 w-8 h-12 z-20 flex flex-col items-center"
            >
              <div className="w-1 h-10 bg-slate-400" />
              <div className="w-8 h-2 bg-slate-400 rounded-full" />
              <div className="absolute -top-6 text-[10px] text-blue-400 font-bold uppercase">Intake</div>
            </motion.div>

            {/* Exhaust Valve */}
            <motion.div 
              variants={exhaustValveVariants}
              animate={activeStroke.id}
              transition={{ duration: (speed / 4) * 0.8 }}
              className="absolute -top-2 right-6 w-8 h-12 z-20 flex flex-col items-center"
            >
              <div className="w-1 h-10 bg-slate-400" />
              <div className="w-8 h-2 bg-slate-400 rounded-full" />
              <div className="absolute -top-6 text-[10px] text-gray-400 font-bold uppercase">Exhaust</div>
            </motion.div>

            {/* Gas Mixture Inside Cylinder */}
            <div className="absolute top-12 left-1 right-1 bottom-1 flex items-start justify-center overflow-hidden z-0">
               <motion.div 
                  variants={mixtureVariants}
                  animate={activeStroke.id}
                  transition={{ duration: (speed / 4) }}
                  className="w-full opacity-50 blur-sm"
               />
            </div>

            {/* Piston */}
            <motion.div 
              variants={pistonVariants}
              animate={activeStroke.id}
              transition={{ duration: (speed / 4), ease: "easeInOut" }}
              className="absolute left-2 right-2 h-16 bg-gradient-to-b from-slate-400 to-slate-500 rounded-sm z-10 border-b-4 border-slate-700 shadow-inner flex justify-center"
            >
               {/* Piston Rings */}
               <div className="absolute top-2 w-full h-1 bg-slate-600/50" />
               <div className="absolute top-4 w-full h-1 bg-slate-600/50" />
               {/* Connecting Rod Pin */}
               <div className="w-4 h-4 bg-slate-800 rounded-full mt-8" />
            </motion.div>

          </div>
        </div>

        {/* Right Col: Info */}
        <div className="flex-1 space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-xl font-bold text-white mb-4">FAA Ground Lesson 2</h3>
            <p className="text-sm text-slate-300 mb-6">
              Principles of powerplants and aircraft systems. Understand how aircraft engines and related systems operate.
            </p>

            <div className="space-y-3">
              {STROKES.map((stroke, index) => (
                <button
                  key={stroke.id}
                  onClick={() => {
                    setIsPlaying(false);
                    setActiveStrokeIndex(index);
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    activeStrokeIndex === index 
                      ? `bg-slate-800 border-${stroke.color.split('-')[1]}-500 shadow-md` 
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${stroke.color} ${activeStrokeIndex === index ? 'animate-pulse' : ''}`} />
                    <h4 className={`font-bold ${activeStrokeIndex === index ? 'text-white' : 'text-slate-400'}`}>
                      {index + 1}. {stroke.name}
                    </h4>
                  </div>
                  {activeStrokeIndex === index && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-sm text-slate-300 mt-2 ml-6"
                    >
                      {stroke.desc}
                    </motion.p>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
            <h4 className="font-bold text-white mb-3 flex items-center gap-2"><Info size={18} className="text-blue-400"/> Related Systems</h4>
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-slate-800/50 p-3 rounded-lg flex items-start gap-3">
                  <Zap size={16} className="text-yellow-400 mt-1 shrink-0"/>
                  <div>
                    <div className="text-xs font-bold text-white">Ignition (Magnetos)</div>
                    <div className="text-[10px] text-slate-400">Independent of aircraft electrical system.</div>
                  </div>
               </div>
               <div className="bg-slate-800/50 p-3 rounded-lg flex items-start gap-3">
                  <Droplets size={16} className="text-blue-400 mt-1 shrink-0"/>
                  <div>
                    <div className="text-xs font-bold text-white">Fuel System</div>
                    <div className="text-[10px] text-slate-400">Gravity feed or fuel pump driven.</div>
                  </div>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PistonEngineVisualizer;
