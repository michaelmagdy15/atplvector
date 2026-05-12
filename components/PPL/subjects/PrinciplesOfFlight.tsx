import React, { useState } from 'react';
import { View } from '../../../types';
import { ChevronLeft, Wind, Activity, ArrowUp, ArrowRight, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  onChangeView: (view: View) => void;
}

const PrinciplesOfFlight: React.FC<Props> = ({ onChangeView }) => {
  const [pitch, setPitch] = useState(0);
  const [roll, setRoll] = useState(0);
  const [yaw, setYaw] = useState(0);

  const [activeTab, setActiveTab] = useState<'forces' | 'controls' | 'stall'>('forces');
  const [aoa, setAoA] = useState(0);


  const resetAttitude = () => {
    setPitch(0);
    setRoll(0);
    setYaw(0);
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

      <div className="glass-panel p-8 md:p-12 rounded-3xl border border-rose-500/20 relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
        
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="p-4 bg-rose-500/20 rounded-2xl text-rose-400">
            <Activity size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Principles of Flight</h1>
        </div>
        
        <p className="text-slate-300 text-lg max-w-2xl leading-relaxed relative z-10">
          Understand the four forces of flight, aerodynamic stability, and how flight controls affect an aircraft's attitude in three dimensions.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-white/10 pb-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('forces')}
          className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all ${
            activeTab === 'forces' 
              ? 'bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)]' 
              : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          Four Forces
        </button>
        <button
          onClick={() => setActiveTab('controls')}
          className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all ${
            activeTab === 'controls' 
              ? 'bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)]' 
              : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          Flight Controls
        </button>
        <button
          onClick={() => setActiveTab('stall')}
          className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all ${
            activeTab === 'stall' 
              ? 'bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)]' 
              : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          Stall / AoA
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Forces of Flight Panel */}
        {activeTab === 'forces' && (
        <div className="col-span-1 lg:col-span-2 bg-slate-900/50 p-8 rounded-3xl border border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[500px]">
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800/50 via-slate-900/50 to-transparent -z-10" />
           <h3 className="text-2xl font-bold text-white mb-8 text-center z-10">The Four Forces of Flight</h3>
           
           <div className="relative w-full h-64 flex items-center justify-center z-10">
              {/* Aircraft Profile (Simplified) */}
              <div className="w-32 h-8 bg-slate-400 rounded-full relative">
                {/* Tail */}
                <div className="absolute -left-2 -top-6 w-8 h-8 bg-slate-400" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }} />
                {/* Wing */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-1 bg-slate-600 rounded-full" />
              </div>

              {/* Force Vectors */}
              <motion.div 
                animate={{ y: [-5, 5, -5] }} 
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="absolute inset-0 flex items-center justify-center"
              >
                 {/* LIFT */}
                 <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <span className="text-blue-400 font-bold mb-1">LIFT</span>
                    <ArrowUp className="text-blue-500 w-8 h-12" />
                 </div>
                 {/* WEIGHT */}
                 <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <ArrowUp className="text-orange-500 w-8 h-12 rotate-180" />
                    <span className="text-orange-400 font-bold mt-1">WEIGHT</span>
                 </div>
                 {/* THRUST */}
                 <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                    <ArrowRight className="text-emerald-500 w-12 h-8" />
                    <span className="text-emerald-400 font-bold ml-2">THRUST</span>
                 </div>
                 {/* DRAG */}
                 <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center">
                    <span className="text-rose-400 font-bold mr-2">DRAG</span>
                    <ArrowRight className="text-rose-500 w-12 h-8 rotate-180" />
                 </div>
              </motion.div>
           </div>
        </div>
        )}

        {/* 3D Attitude Visualizer */}
        {activeTab === 'controls' && (
        <div className="col-span-1 lg:col-span-2 bg-slate-900/50 p-8 rounded-3xl border border-white/5 space-y-8 flex flex-col">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
             <h3 className="text-2xl font-bold text-white">Flight Controls</h3>
             <button 
                onClick={resetAttitude}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                title="Reset Attitude"
              >
                <RotateCcw size={20} />
             </button>
          </div>

          {/* 3D Plane CSS Visualization */}
          <div className="flex-1 min-h-[250px] flex items-center justify-center relative perspective-[1000px]">
             <motion.div 
               className="relative w-48 h-48 preserve-3d"
               animate={{ 
                 rotateX: pitch, 
                 rotateZ: -roll, 
                 rotateY: yaw 
               }}
               transition={{ type: "spring", stiffness: 100, damping: 20 }}
             >
                {/* Fuselage */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-48 bg-slate-400 rounded-full shadow-[inset_0_-10px_20px_rgba(0,0,0,0.5)] z-20" />
                {/* Main Wing */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-8 bg-slate-300 rounded-full shadow-lg z-10" />
                {/* Tail Wing */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-300 rounded-full shadow-lg z-10" />
                {/* Vertical Stabilizer (rudder) - CSS 3D translated */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-2 h-16 bg-rose-500 rounded-t-xl origin-bottom transform rotate-x-90 z-30" style={{ transform: 'rotateX(-90deg) translateZ(8px)' }} />
             </motion.div>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <label className="text-slate-400 font-bold uppercase">Pitch (Elevator)</label>
                <span className="text-white font-mono">{pitch}°</span>
              </div>
              <input 
                type="range" 
                min="-45" max="45" 
                value={pitch} 
                onChange={(e) => setPitch(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <label className="text-slate-400 font-bold uppercase">Roll (Ailerons)</label>
                <span className="text-white font-mono">{roll}°</span>
              </div>
              <input 
                type="range" 
                min="-60" max="60" 
                value={roll} 
                onChange={(e) => setRoll(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <label className="text-slate-400 font-bold uppercase">Yaw (Rudder)</label>
                <span className="text-white font-mono">{yaw}°</span>
              </div>
              <input 
                type="range" 
                min="-45" max="45" 
                value={yaw} 
                onChange={(e) => setYaw(Number(e.target.value))}
                className="w-full accent-rose-500"
              />
            </div>
          </div>
        </div>
        )}

        {/* Stall / AoA Simulator */}
        {activeTab === 'stall' && (
        <div className="col-span-1 lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-900/50 p-8 rounded-3xl border border-white/5 space-y-8 flex flex-col">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
               <h3 className="text-2xl font-bold text-white">Angle of Attack (AoA)</h3>
            </div>
            
            <p className="text-slate-300">
              Increase the Angle of Attack to see how the coefficient of lift changes. Past the critical angle of attack (typically ~15°), the smooth airflow separates from the wing, causing a dramatic loss of lift—a stall.
            </p>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <label className="text-slate-400 font-bold uppercase">AoA</label>
                  <span className="text-white font-mono">{aoa}°</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="25" step="1"
                  value={aoa} 
                  onChange={(e) => setAoA(Number(e.target.value))}
                  className="w-full accent-rose-500"
                />
              </div>
            </div>

            <div className={`p-6 rounded-2xl border ${aoa >= 16 ? 'bg-red-500/20 border-red-500/50' : 'bg-emerald-500/10 border-emerald-500/30'} mt-8`}>
              <h4 className={`text-xl font-bold ${aoa >= 16 ? 'text-red-400' : 'text-emerald-400'} mb-2`}>
                {aoa >= 16 ? 'STALL - Airflow Separated' : 'Normal Flight - Attached Airflow'}
              </h4>
              <p className="text-slate-300">
                {aoa >= 16 
                  ? "The wing has exceeded the critical angle of attack. Lift is drastically reduced and drag is significantly increased." 
                  : "The wing is generating lift efficiently with smooth airflow attached to the upper surface."}
              </p>
            </div>
          </div>

          <div className="bg-slate-900/50 p-8 rounded-3xl border border-white/5 flex flex-col items-center justify-center relative min-h-[400px]">
             <h3 className="text-xl font-bold text-white mb-6 w-full text-center">Airflow Visualization</h3>
             
             <div className="relative w-full h-64 flex items-center justify-center overflow-hidden border border-slate-700 bg-slate-800 rounded-xl">
                {/* Airfoil Cross-Section */}
                <motion.div 
                  className="w-48 h-12 bg-slate-400 relative z-10"
                  style={{
                    borderRadius: '50% 50% 50% 10% / 100% 100% 20% 20%',
                    transformOrigin: '25% 50%'
                  }}
                  animate={{ rotate: -aoa }}
                />
                
                {/* Airflow lines */}
                <div className="absolute inset-0 z-0">
                  {/* Top airflow (attached) */}
                  <motion.div 
                    className="absolute h-1 bg-gradient-to-r from-blue-500/0 via-blue-400 to-blue-500/0 w-full"
                    style={{ top: '40%' }}
                    animate={aoa >= 16 ? {
                      y: [0, -20, 0, 30, -10],
                      opacity: [0.2, 0.8, 0.2],
                      scaleX: [1, 1.2, 1],
                      filter: 'blur(4px)'
                    } : {
                      y: [0, -30, 0],
                      x: [-100, 400],
                      opacity: 0.6
                    }}
                    transition={{ repeat: Infinity, duration: aoa >= 16 ? 0.5 : 2 }}
                  />
                  {/* Bottom airflow */}
                  <motion.div 
                    className="absolute h-1 bg-gradient-to-r from-blue-500/0 via-blue-400 to-blue-500/0 w-full"
                    style={{ top: '60%' }}
                    animate={{ x: [-200, 400] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  />
                </div>
             </div>
          </div>
        </div>
        )}

      </div>
    </div>
  );
};

export default PrinciplesOfFlight;
