import React, { useState, useEffect } from 'react';
import { View } from '../../types';
import { ChevronLeft, Compass, ShieldAlert, CheckCircle, Info, RefreshCw } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';

interface Props {
  onChangeView: (view: View) => void;
}

const LateralDirectionalCoupling: React.FC<Props> = ({ onChangeView }) => {
  // Stability sliders
  const [lateralStability, setLateralStability] = useState<'STRONG' | 'WEAK'>('STRONG'); // Dihedral effect
  const [directionalStability, setDirectionalStability] = useState<'STRONG' | 'WEAK'>('WEAK'); // Fin effect

  // Simulation State
  const [simMode, setSimMode] = useState<'NORMAL' | 'DUTCH_ROLL' | 'SPIRAL_DIVE'>('NORMAL');
  const [rollAngle, setRollAngle] = useState(0); // degrees
  const [yawAngle, setYawAngle] = useState(0); // degrees
  const [airspeed, setAirspeed] = useState(180); // KT
  const [altitude, setAltitude] = useState(10000); // ft

  // Determine dynamic mode based on stability inputs
  useEffect(() => {
    if (lateralStability === 'STRONG' && directionalStability === 'WEAK') {
      setSimMode('DUTCH_ROLL');
    } else if (lateralStability === 'WEAK' && directionalStability === 'STRONG') {
      setSimMode('SPIRAL_DIVE');
    } else {
      setSimMode('NORMAL');
    }
  }, [lateralStability, directionalStability]);

  // Main simulation loop
  useEffect(() => {
    let frameId: number;
    let time = 0;

    const runSim = () => {
      time += 0.05;

      if (simMode === 'DUTCH_ROLL') {
        // Dutch Roll: Oscillatory yaw/roll out of phase
        // Yaw oscillations: sin(t), Roll oscillations: cos(t + phase)
        const yaw = Math.sin(time * 2.5) * 8;
        const roll = Math.cos(time * 2.5 + 0.8) * 12;
        
        setYawAngle(yaw);
        setRollAngle(roll);
        setAirspeed(180 + Math.sin(time * 2.5) * 5);
        setAltitude(10000); // mostly horizontal oscillation
      } else if (simMode === 'SPIRAL_DIVE') {
        // Spiral Dive: Continuous increase of bank, pitch down, speed increases, altitude drops
        setRollAngle(prev => Math.min(60, prev + 0.3));
        setYawAngle(prev => prev + 0.4);
        setAirspeed(prev => Math.min(320, prev + 1.2));
        setAltitude(prev => Math.max(2000, prev - 35));
      } else {
        // Stable: Smooth recovery to 0
        setRollAngle(prev => (Math.abs(prev) < 0.1 ? 0 : prev * 0.9));
        setYawAngle(prev => (Math.abs(prev) < 0.1 ? 0 : prev * 0.9));
        setAirspeed(180);
        setAltitude(10000);
      }

      frameId = requestAnimationFrame(runSim);
    };

    frameId = requestAnimationFrame(runSim);
    return () => cancelAnimationFrame(frameId);
  }, [simMode]);

  const resetSimulation = () => {
    setRollAngle(0);
    setYawAngle(0);
    setAirspeed(180);
    setAltitude(10000);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in duration-700">
      {/* Back Button */}
      <button 
        onClick={() => onChangeView(View.POF_HOME)}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
        Back to Subject Dashboard
      </button>

      {/* Header */}
      <div className="glass-panel p-8 md:p-12 rounded-3xl border border-violet-500/20 relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="p-4 bg-violet-500/20 rounded-2xl text-violet-400">
            <Compass size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Lateral-Directional Coupling Sim</h1>
        </div>
        <p className="text-slate-300 text-lg max-w-2xl leading-relaxed relative z-10">
          Simulate standard aerodynamic coupling modes. Adjust **Dihedral Effect (Lateral)** and **Fin Effect (Directional)** to model Dutch Roll and Spiral Divergence.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Aero Parameters (5/12) */}
        <div className="lg:col-span-5 bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-white/5 space-y-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <h3 className="text-xl font-bold text-white">Stability Coefficients</h3>
            <button 
              onClick={resetSimulation}
              className="p-2 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-bold"
            >
              <RefreshCw size={12} /> Reset
            </button>
          </div>

          {/* Lateral Stability (Dihedral) */}
          <div className="space-y-2">
            <label className="text-[10px] text-slate-500 font-bold block">STATIC LATERAL STABILITY (DIHEDRAL EFFECT)</label>
            <div className="flex bg-slate-950 p-1 rounded-xl">
              <button 
                onClick={() => setLateralStability('STRONG')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${lateralStability === 'STRONG' ? 'bg-violet-500 text-white shadow-lg shadow-violet-950/20' : 'text-slate-500'}`}
              >
                Strong Dihedral
              </button>
              <button 
                onClick={() => setLateralStability('WEAK')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${lateralStability === 'WEAK' ? 'bg-violet-500 text-white shadow-lg shadow-violet-950/20' : 'text-slate-500'}`}
              >
                Weak Dihedral
              </button>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Dihedral creates restoring rolling moments when in a sideslip. Strong dihedral restores bank rapidly.
            </p>
          </div>

          {/* Directional Stability (Keel Effect) */}
          <div className="space-y-2">
            <label className="text-[10px] text-slate-500 font-bold block">STATIC DIRECTIONAL STABILITY (FIN EFFECT)</label>
            <div className="flex bg-slate-950 p-1 rounded-xl">
              <button 
                onClick={() => setDirectionalStability('STRONG')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${directionalStability === 'STRONG' ? 'bg-violet-500 text-white shadow-lg shadow-violet-950/20' : 'text-slate-500'}`}
              >
                Strong Fin
              </button>
              <button 
                onClick={() => setDirectionalStability('WEAK')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${directionalStability === 'WEAK' ? 'bg-violet-500 text-white shadow-lg shadow-violet-950/20' : 'text-slate-500'}`}
              >
                Weak Fin
              </button>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Vertical tailplane restores nose alignment with relative wind. Weak fin causes yaw lag.
            </p>
          </div>

          {/* Cockpit telemetry */}
          <div className="p-4 bg-slate-950/60 rounded-2xl border border-white/5 space-y-3 font-mono text-xs">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Coupled Telemetry</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900 p-3 rounded-xl border border-white/5">
                <span className="text-[9px] text-slate-500 block">SIDESLIP ANGLE (β)</span>
                <span className="text-sm font-bold text-white">{yawAngle.toFixed(1)}°</span>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-white/5">
                <span className="text-[9px] text-slate-500 block">BANK ANGLE (φ)</span>
                <span className="text-sm font-bold text-white">{rollAngle.toFixed(1)}°</span>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-white/5">
                <span className="text-[9px] text-slate-500 block">INDICATED AIRSPEED</span>
                <span className="text-sm font-bold text-white">{Math.round(airspeed)} KT</span>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-white/5">
                <span className="text-[9px] text-slate-500 block">ALTITUDE</span>
                <span className="text-sm font-bold text-white">{Math.round(altitude)} ft</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visualizer & EASA explanations (7/12) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Flight visualization wireframe */}
          <div className="bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-white/5 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 absolute top-6 left-6">Coupled Motion Display</h4>

            {/* Simulated aircraft views */}
            <div className="flex gap-12 items-center justify-center">
              {/* Front view: Roll */}
              <div className="flex flex-col items-center">
                <span className="text-[9px] text-slate-500 font-bold mb-2">FRONT VIEW (ROLL)</span>
                <motion.div 
                  style={{ rotate: rollAngle }}
                  className="w-32 h-1 bg-violet-400 rounded-full relative flex justify-center"
                >
                  <div className="w-1 h-8 bg-violet-400 absolute bottom-0 rounded-full"></div>
                  <div className="w-4 h-4 bg-white rounded-full absolute -top-1.5 border border-slate-950"></div>
                </motion.div>
              </div>

              {/* Top view: Yaw */}
              <div className="flex flex-col items-center">
                <span className="text-[9px] text-slate-500 font-bold mb-2">TOP VIEW (YAW)</span>
                <motion.div 
                  style={{ rotate: yawAngle }}
                  className="w-1 h-32 bg-cyan-400 rounded-full relative flex justify-center items-center"
                >
                  <div className="w-24 h-1 bg-cyan-400 rounded-full absolute top-10"></div>
                  <div className="w-8 h-1 bg-cyan-400 rounded-full absolute bottom-4"></div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Stability State Advisories */}
          {simMode === 'DUTCH_ROLL' ? (
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl flex items-start gap-3">
              <ShieldAlert className="text-yellow-400 w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-xs text-yellow-200">
                <strong>Dutch Roll Mode Active:</strong> strong static lateral stability paired with weak static directional stability causes a coupled, oscillatory yawing-rolling motion. Sideslip restores bank too fast before the fin can correct the nose yaw, creating a combined tail-wagging oscillation.
              </div>
            </div>
          ) : simMode === 'SPIRAL_DIVE' ? (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-start gap-3">
              <ShieldAlert className="text-red-400 w-5 h-5 shrink-0 mt-0.5 animate-pulse" />
              <div className="text-xs text-red-200 space-y-1">
                <strong>UNSTABLE SPIRAL DIVE DETECTED:</strong> weak static lateral stability paired with strong static directional stability causes spiral divergence. 
                <ul className="list-disc pl-4 mt-2 space-y-0.5 text-red-300">
                  <li>Bank Angle escalates continuously (&gt; {rollAngle.toFixed(0)}°).</li>
                  <li>Nose pitches down heavily, causing altitude loss.</li>
                  <li>Airspeed increases rapidly ({Math.round(airspeed)} KT) towards structural Vne limits.</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-start gap-3">
              <CheckCircle className="text-emerald-400 w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-200">
                <strong>Stable Coupled Balance:</strong> Lateral and directional coefficients are harmonized. Distortions in roll or yaw recover smoothly and return the aircraft back to straight-and-level flight.
              </div>
            </div>
          )}

          {/* Theoretical foundations */}
          <div className="bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-white/5 space-y-4">
            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">EASA Coupling Dynamics</h4>
            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex gap-3">
                <div className="p-2 bg-slate-950 rounded-lg text-violet-400 font-bold h-max font-mono">01</div>
                <div>
                  <strong>Coupling Physics:</strong> Roll causes sideslip due to gravity pulling the aircraft sideways. Yawing also sweeps one wing faster than the other, creating differential lift and causing coupled roll.
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-2 bg-slate-950 rounded-lg text-violet-400 font-bold h-max font-mono">02</div>
                <div>
                  <strong>Spiral Dive Criteria:</strong> Occurs when **directional stability dominates lateral stability**. A slight sideslip yaws the aircraft into a turn, but the weak dihedral fails to level the wings, causing the bank to tighten into a spiral descent.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LateralDirectionalCoupling;
