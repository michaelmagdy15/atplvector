import React, { useState, useEffect } from 'react';
import { View } from '../../types';
import { ChevronLeft, Compass, ShieldAlert, CheckCircle, Info, RefreshCw, Radio, Zap, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  onChangeView: (view: View) => void;
}

const LateralDirectionalCoupling: React.FC<Props> = ({ onChangeView }) => {
  // Stability configuration
  const [lateralStability, setLateralStability] = useState<'STRONG' | 'WEAK'>('STRONG'); // Dihedral effect
  const [directionalStability, setDirectionalStability] = useState<'STRONG' | 'WEAK'>('WEAK'); // Fin effect
  const [yawDamperActive, setYawDamperActive] = useState<boolean>(false);
  const [wingType, setWingType] = useState<'SWEPT' | 'STRAIGHT'>('SWEPT');

  // Simulation State
  const [simMode, setSimMode] = useState<'NORMAL' | 'DUTCH_ROLL' | 'SPIRAL_DIVE'>('DUTCH_ROLL');
  const [rollAngle, setRollAngle] = useState(0); // degrees
  const [yawAngle, setYawAngle] = useState(0); // degrees
  const [airspeed, setAirspeed] = useState(250); // KT
  const [altitude, setAltitude] = useState(32000); // ft

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
        if (yawDamperActive) {
          // Yaw Damper actively suppressing Dutch Roll
          // Rapidly decaying exponential oscillation
          const decay = Math.max(0, 1 - (time * 0.15) % 3);
          const yaw = Math.sin(time * 2.5) * 8 * decay;
          const roll = Math.cos(time * 2.5 + 0.8) * 12 * decay;
          setYawAngle(yaw);
          setRollAngle(roll);
          setAirspeed(250);
          setAltitude(32000);
        } else {
          // Dutch Roll: Persistent coupled oscillatory yaw/roll out of phase
          // Wing sweep adds powerful roll coupling
          const sweepFactor = wingType === 'SWEPT' ? 1.4 : 1.0;
          const yaw = Math.sin(time * 2.4) * 8;
          const roll = Math.cos(time * 2.4 + 0.85) * (10 * sweepFactor);
          
          setYawAngle(yaw);
          setRollAngle(roll);
          setAirspeed(250 + Math.sin(time * 2.4) * 6);
          setAltitude(32000);
        }
      } else if (simMode === 'SPIRAL_DIVE') {
        // Spiral Dive: Continuous escalation of bank angle, nose pitch down, speed increases
        setRollAngle(prev => Math.min(65, prev + 0.25));
        setYawAngle(prev => prev + 0.35);
        setAirspeed(prev => Math.min(340, prev + 1.1));
        setAltitude(prev => Math.max(2000, prev - 45));
      } else {
        // Stable: Smooth recovery to straight & level
        setRollAngle(prev => (Math.abs(prev) < 0.1 ? 0 : prev * 0.92));
        setYawAngle(prev => (Math.abs(prev) < 0.1 ? 0 : prev * 0.92));
        setAirspeed(250);
        setAltitude(32000);
      }

      frameId = requestAnimationFrame(runSim);
    };

    frameId = requestAnimationFrame(runSim);
    return () => cancelAnimationFrame(frameId);
  }, [simMode, yawDamperActive, wingType]);

  const resetSimulation = () => {
    setRollAngle(0);
    setYawAngle(0);
    setAirspeed(250);
    setAltitude(32000);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in duration-700 space-y-8">
      {/* Back Navigation */}
      <button 
        onClick={() => onChangeView(View.POF_HOME)}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
        Back to Subject Dashboard
      </button>

      {/* Header */}
      <div className="glass-panel p-6 md:p-10 rounded-3xl border border-violet-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
        <div className="flex items-center gap-4 mb-4 relative z-10">
          <div className="p-4 bg-violet-500/20 rounded-2xl text-violet-400">
            <Compass size={32} />
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">Lateral-Directional Coupling Sim</h1>
            <p className="text-slate-400 text-sm mt-1">
              Dutch Roll, Spiral Divergence, Swept-Wing Dihedral Effect, and Automatic Yaw Damper operation.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Aero Parameters & Controls (5/12) */}
        <div className="lg:col-span-5 bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-white/5 space-y-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <h3 className="text-xl font-bold text-white">Stability Coefficients</h3>
            <button 
              onClick={resetSimulation}
              className="p-2 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-bold"
            >
              <RefreshCw size={12} /> Reset Sim
            </button>
          </div>

          {/* Wing Sweep Setting */}
          <div className="space-y-2">
            <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
              Wing Planform (Swept vs Straight)
            </label>
            <div className="flex bg-slate-950 p-1 rounded-xl">
              <button 
                onClick={() => setWingType('SWEPT')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  wingType === 'SWEPT' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400'
                }`}
              >
                Swept Wing (Jet)
              </button>
              <button 
                onClick={() => setWingType('STRAIGHT')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  wingType === 'STRAIGHT' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400'
                }`}
              >
                Straight Wing
              </button>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Swept wings naturally create a powerful dihedral effect: the advancing wing encounters less sweep (cos(Λ - β)), causing a sharp lift surge that rolls strongly into the yaw.
            </p>
          </div>

          {/* Lateral Stability (Dihedral) */}
          <div className="space-y-2">
            <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
              Static Lateral Stability (Dihedral Effect)
            </label>
            <div className="flex bg-slate-950 p-1 rounded-xl">
              <button 
                onClick={() => setLateralStability('STRONG')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  lateralStability === 'STRONG' ? 'bg-violet-600 text-white shadow-lg' : 'text-slate-500'
                }`}
              >
                Strong Dihedral (C<sub>lβ</sub> High)
              </button>
              <button 
                onClick={() => setLateralStability('WEAK')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  lateralStability === 'WEAK' ? 'bg-violet-600 text-white shadow-lg' : 'text-slate-500'
                }`}
              >
                Weak Dihedral (C<sub>lβ</sub> Low)
              </button>
            </div>
          </div>

          {/* Directional Stability (Fin Effect) */}
          <div className="space-y-2">
            <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
              Static Directional Stability (Vertical Fin)
            </label>
            <div className="flex bg-slate-950 p-1 rounded-xl">
              <button 
                onClick={() => setDirectionalStability('STRONG')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  directionalStability === 'STRONG' ? 'bg-violet-600 text-white shadow-lg' : 'text-slate-500'
                }`}
              >
                Strong Fin (C<sub>nβ</sub> High)
              </button>
              <button 
                onClick={() => setDirectionalStability('WEAK')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  directionalStability === 'WEAK' ? 'bg-violet-600 text-white shadow-lg' : 'text-slate-500'
                }`}
              >
                Weak Fin (C<sub>nβ</sub> Low)
              </button>
            </div>
          </div>

          {/* Yaw Damper Avionics Switch */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-violet-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio size={18} className={yawDamperActive ? 'text-emerald-400 animate-pulse' : 'text-slate-600'} />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Yaw Damper System</span>
              </div>
              <button
                onClick={() => setYawDamperActive(!yawDamperActive)}
                className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all ${
                  yawDamperActive ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-950/40' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {yawDamperActive ? 'ENGAGED' : 'DISENGAGED'}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              The Yaw Damper senses yaw rate and automatically commands opposed rudder deflections, suppressing Dutch Roll without pilot intervention.
            </p>
          </div>

          {/* Flight Telemetry Panel */}
          <div className="p-4 bg-slate-950/80 rounded-2xl border border-white/5 space-y-3 font-mono text-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Coupled Telemetry</span>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-900 p-3 rounded-xl border border-white/5">
                <span className="text-[9px] text-slate-500 block">SIDESLIP ANGLE (β)</span>
                <span className="text-base font-bold text-white">{yawAngle.toFixed(1)}°</span>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-white/5">
                <span className="text-[9px] text-slate-500 block">BANK ANGLE (φ)</span>
                <span className="text-base font-bold text-white">{rollAngle.toFixed(1)}°</span>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-white/5">
                <span className="text-[9px] text-slate-500 block">AIRSPEED</span>
                <span className="text-base font-bold text-white">{Math.round(airspeed)} KT</span>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-white/5">
                <span className="text-[9px] text-slate-500 block">ALTITUDE</span>
                <span className="text-base font-bold text-white">{Math.round(altitude).toLocaleString()} ft</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Animation & Croucher Principles (7/12) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Visual Flight Motion Wireframe */}
          <div className="bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-white/5 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
            <div className="w-full flex justify-between items-center text-xs text-slate-400 mb-6">
              <span className="font-bold text-slate-500 uppercase tracking-widest">Coupled Motion Display</span>
              <span className="font-mono text-emerald-400">
                Mode: {simMode} {yawDamperActive && simMode === 'DUTCH_ROLL' ? '(Damped)' : ''}
              </span>
            </div>

            <div className="flex gap-16 items-center justify-center">
              {/* Front View: Roll (Bank) */}
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-slate-400 font-bold mb-3 tracking-wider">FRONT VIEW (ROLL φ)</span>
                <motion.div 
                  style={{ rotate: rollAngle }}
                  className="w-36 h-1 bg-violet-400 rounded-full relative flex justify-center shadow-[0_0_15px_rgba(167,139,250,0.5)]"
                >
                  <div className="w-1 h-10 bg-violet-400 absolute bottom-0 rounded-full"></div>
                  <div className="w-4 h-4 bg-white rounded-full absolute -top-1.5 border border-slate-950"></div>
                </motion.div>
                <span className="text-xs font-mono text-violet-300 mt-4">{rollAngle.toFixed(1)}°</span>
              </div>

              {/* Top View: Yaw (Sideslip) */}
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-slate-400 font-bold mb-3 tracking-wider">TOP VIEW (YAW β)</span>
                <motion.div 
                  style={{ rotate: yawAngle }}
                  className="w-1 h-36 bg-cyan-400 rounded-full relative flex justify-center items-center shadow-[0_0_15px_rgba(34,211,238,0.5)]"
                >
                  <div className="w-28 h-1 bg-cyan-400 rounded-full absolute top-12"></div>
                  <div className="w-10 h-1 bg-cyan-400 rounded-full absolute bottom-4"></div>
                </motion.div>
                <span className="text-xs font-mono text-cyan-300 mt-4">{yawAngle.toFixed(1)}°</span>
              </div>
            </div>
          </div>

          {/* Dynamic Advisory Banner */}
          {simMode === 'DUTCH_ROLL' ? (
            yawDamperActive ? (
              <div className="p-4 bg-emerald-950/30 border border-emerald-500/40 rounded-2xl flex items-start gap-3">
                <ShieldCheck className="text-emerald-400 w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-200 leading-relaxed">
                  <strong>Yaw Damper Active:</strong> Rudder actuators apply automatic opposing yaw corrections proportional to yaw rate, arresting Dutch Roll oscillation within 1 cycle.
                </div>
              </div>
            ) : (
              <div className="p-4 bg-amber-950/30 border border-amber-500/40 rounded-2xl flex items-start gap-3">
                <ShieldAlert className="text-amber-400 w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-200 leading-relaxed">
                  <strong>Dutch Roll Mode Active:</strong> Strong static lateral stability (dihedral + wing sweep) paired with relatively weak static directional stability causes a coupled out-of-phase yaw-roll oscillation. The restoring bank overshoots before the vertical fin can align the nose.
                </div>
              </div>
            )
          ) : simMode === 'SPIRAL_DIVE' ? (
            <div className="p-4 bg-red-950/30 border border-red-500/40 rounded-2xl flex items-start gap-3">
              <ShieldAlert className="text-red-400 w-5 h-5 shrink-0 mt-0.5 animate-pulse" />
              <div className="text-xs text-red-200 leading-relaxed">
                <strong>Spiral Divergence Detected:</strong> Directional stability dominates lateral stability. When a sideslip occurs, the fin immediately yaws the aircraft into the turn, but weak dihedral fails to level the wings, causing the bank to tighten progressively into a descending spiral dive.
              </div>
            </div>
          ) : (
            <div className="p-4 bg-emerald-950/30 border border-emerald-500/40 rounded-2xl flex items-start gap-3">
              <CheckCircle className="text-emerald-400 w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-200 leading-relaxed">
                <strong>Harmonized Stability:</strong> Lateral and directional stability are balanced. Aerodynamic disturbances are damped out naturally without divergence.
              </div>
            </div>
          )}

          {/* Croucher ch03 Principles & Anti-Patterns */}
          <div className="bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-white/5 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Croucher ATPL Principles: Swept Wings & Dutch Roll</h4>
            
            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 bg-slate-950 rounded-xl border border-white/5 space-y-1">
                <span className="text-indigo-400 font-bold block">1. Why Swept Wings Exacerbate Dutch Roll:</span>
                <p className="leading-relaxed">
                  When a swept wing aircraft yaws left, the right wing becomes more perpendicular to relative airflow (effective sweep drops from Λ to Λ - β), generating a dramatic lift increase. The left wing becomes more obliquely swept (Λ + β) and loses lift. This produces an intense rolling moment into the yaw direction.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-white/5 space-y-1">
                <span className="text-amber-400 font-bold block">2. Pilot Recovery Anti-Pattern (Aileron Lag):</span>
                <p className="leading-relaxed">
                  Never attempt to counteract Dutch Roll manually with rapid alternating aileron inputs. Human neuromuscular lag typically causes aileron deflection to arrive 180° out-of-phase with the roll, amplifying the oscillations into catastrophic Pilot-Induced Oscillation (PIO).
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-white/5 space-y-1">
                <span className="text-emerald-400 font-bold block">3. Correct Handling Technique:</span>
                <p className="leading-relaxed">
                  Verify Yaw Damper engagement. If inoperative, gently hold ailerons neutral and use gentle, smooth coordinated rudder pressure, or gradually deploy speedbrakes to slow the aircraft down and increase aerodynamic damping.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LateralDirectionalCoupling;
