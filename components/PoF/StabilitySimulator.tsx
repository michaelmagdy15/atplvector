import React, { useState, useEffect, useRef } from 'react';
import { View } from '../../types';
import { ChevronLeft, Plane, HelpCircle, Info, AlertTriangle, ShieldAlert, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  onChangeView: (view: View) => void;
}

const StabilitySimulator: React.FC<Props> = ({ onChangeView }) => {
  // Inputs
  const [cgPosition, setCgPosition] = useState(25); // % MAC (20 to 45)
  const [airspeed, setAirspeed] = useState(200); // KT
  const [disturbance, setDisturbance] = useState(0); // Pitch perturbation (-10 to 10 deg)

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // EASA Aerodynamic Constants
  const neutralPoint = 38; // % MAC (Aft limit for stability)
  const cpPosition = 30; // % MAC (Wing Center of Pressure is fixed)

  // Calculations
  const cgArm = cpPosition - cgPosition; // arm relative to CP
  // If CG is forward of CP (cgArm > 0), wing lift creates nose-down moment.
  // Tail must create downforce to balance.
  const wingMoment = cgArm * 10; // arbitrary multiplier for visual vectors
  const tailForce = -wingMoment; // opposite force needed to balance

  // Stability State
  const staticStability = cgPosition < neutralPoint 
    ? 'POSITIVE' 
    : cgPosition === neutralPoint 
      ? 'NEUTRAL' 
      : 'NEGATIVE';

  // Dynamic feedback on disturbance recovery
  useEffect(() => {
    if (disturbance !== 0) {
      const timer = setTimeout(() => {
        if (staticStability === 'POSITIVE') {
          // returns to 0
          setDisturbance(prev => {
            const next = prev * 0.85;
            return Math.abs(next) < 0.1 ? 0 : next;
          });
        } else if (staticStability === 'NEGATIVE') {
          // diverges
          setDisturbance(prev => {
            const next = prev * 1.15;
            return Math.abs(next) > 20 ? (prev > 0 ? 20 : -20) : next;
          });
        }
        // Neutral does nothing (stays at disturbance value)
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [disturbance, staticStability]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;

    // Draw aircraft outline (Side Profile)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 2;

    // Disturbance Pitch Rotation
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((disturbance * Math.PI) / 180);

    // Fuselage
    ctx.beginPath();
    ctx.moveTo(-120, -5);
    ctx.lineTo(100, -5);
    ctx.quadraticCurveTo(120, -5, 120, 0);
    ctx.quadraticCurveTo(120, 5, 100, 5);
    ctx.lineTo(-120, 5);
    ctx.closePath();
    ctx.stroke();

    // Horizontal Stabilizer
    ctx.beginPath();
    ctx.moveTo(-110, 0);
    ctx.lineTo(-120, -15);
    ctx.lineTo(-120, -5);
    ctx.stroke();

    // Wing cross section outline centered at CP (CP is at x = 0 roughly)
    const wingX = 0;
    ctx.beginPath();
    ctx.ellipse(wingX, 0, 30, 8, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Draw Vector Points:
    // Center of Gravity (CG)
    // CG position: maps state cgPosition (20 to 45) to X offset (-20 to 30)
    const cgX = (cgPosition - 30) * 2; 
    
    // Draw CG Symbol
    ctx.fillStyle = '#facc15'; // Yellow CG
    ctx.beginPath();
    ctx.arc(cgX, 0, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cgX - 8, 0); ctx.lineTo(cgX + 8, 0);
    ctx.moveTo(cgX, -8); ctx.lineTo(cgX, 8);
    ctx.stroke();

    // Draw CG Weight vector (Down)
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cgX, 0);
    ctx.lineTo(cgX, 45);
    ctx.stroke();
    // arrowhead
    ctx.beginPath();
    ctx.moveTo(cgX - 4, 40); ctx.lineTo(cgX, 45); ctx.lineTo(cgX + 4, 40);
    ctx.stroke();

    // Center of Pressure (CP)
    // Fixed at x = 0 (30% MAC)
    const cpX = 0;
    ctx.fillStyle = '#38bdf8'; // Blue Wing Lift / CP
    ctx.beginPath();
    ctx.arc(cpX, -5, 6, 0, Math.PI * 2);
    ctx.fill();

    // Lift Vector (Up)
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cpX, -5);
    ctx.lineTo(cpX, -50);
    ctx.stroke();
    // arrowhead
    ctx.beginPath();
    ctx.moveTo(cpX - 4, -45); ctx.lineTo(cpX, -50); ctx.lineTo(cpX + 4, -45);
    ctx.stroke();

    // Tail Force Vector (Up or Down depending on tailForce)
    const tailX = -110;
    const tailVectorY = tailForce * 2; // scale factor
    
    ctx.strokeStyle = '#f472b6'; // Pink Tail Balance
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(tailX, 0);
    ctx.lineTo(tailX, tailVectorY);
    ctx.stroke();
    // arrowhead
    if (tailVectorY !== 0) {
      const arrowDir = tailVectorY > 0 ? 1 : -1;
      ctx.beginPath();
      ctx.moveTo(tailX - 4, tailVectorY - 5 * arrowDir); 
      ctx.lineTo(tailX, tailVectorY); 
      ctx.lineTo(tailX + 4, tailVectorY - 5 * arrowDir);
      ctx.stroke();
    }

    ctx.restore();

    // Labels
    ctx.font = '10px sans-serif';
    ctx.fillStyle = 'white';
    ctx.fillText("Wing Lift (CP)", cx - 35, cy - 65);
    ctx.fillText("CG (Weight)", cx + (cgPosition - 30)*2 - 25, cy + 65);
    ctx.fillText(tailForce < 0 ? "Tail Downforce" : "Tail Upforce", cx - 150, cy + (tailForce*2) - 10);

  }, [cgPosition, tailForce, disturbance]);

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
            <Plane size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Static Longitudinal Stability Sim</h1>
        </div>
        <p className="text-slate-300 text-lg max-w-2xl leading-relaxed relative z-10">
          Explore static longitudinal stability. Adjust the aircraft **Center of Gravity (CG)** and airspeed to audit stabilizer forces and disturbance recovery.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Aero controls (5/12) */}
        <div className="lg:col-span-5 bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-white/5 space-y-6">
          <h3 className="text-xl font-bold text-white border-b border-white/5 pb-3">Aerodynamic Trim Controls</h3>

          {/* CG slider */}
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono">
              <span>CENTER OF GRAVITY (CG)</span>
              <span className="text-white font-bold">{cgPosition}% MAC</span>
            </div>
            <input 
              type="range" 
              min="20" 
              max="45" 
              value={cgPosition} 
              onChange={e => setCgPosition(Number(e.target.value))} 
              className="w-full accent-violet-500" 
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>20% (Stable / Heavy nose)</span>
              <span>45% (Unstable)</span>
            </div>
          </div>

          {/* Disturbance Trigger */}
          <div className="space-y-3">
            <label className="text-[10px] text-slate-500 font-bold block">TRIGGER GUST / PITCH PERTURBATION</label>
            <div className="flex gap-4">
              <button 
                onClick={() => setDisturbance(-10)} 
                className="flex-1 py-2 bg-slate-950 border border-slate-800 hover:border-slate-600 rounded-xl text-xs font-bold text-red-400"
              >
                Nose Down Gust (-10°)
              </button>
              <button 
                onClick={() => setDisturbance(10)} 
                className="flex-1 py-2 bg-slate-950 border border-slate-800 hover:border-slate-600 rounded-xl text-xs font-bold text-emerald-400"
              >
                Nose Up Gust (+10°)
              </button>
            </div>
          </div>

          {/* Live parameters output */}
          <div className="p-4 bg-slate-950/60 rounded-2xl border border-white/5 space-y-3 font-mono text-xs">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Moment Arm & Force Analysis</h4>
            <div className="flex justify-between">
              <span>Neutral Point (NP):</span>
              <span className="text-white">{neutralPoint}% MAC</span>
            </div>
            <div className="flex justify-between">
              <span>Static Margin (NP - CG):</span>
              <span className={`font-bold ${neutralPoint - cgPosition > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {(neutralPoint - cgPosition)}% MAC
              </span>
            </div>
            <div className="flex justify-between">
              <span>CG to CP Arm:</span>
              <span className="text-white">{cgArm}% MAC</span>
            </div>
            <div className="flex justify-between border-t border-white/5 pt-2 font-bold text-violet-400">
              <span>Required Tail Force:</span>
              <span>{tailForce < 0 ? `${Math.abs(tailForce)} units (Down)` : `${tailForce} units (Up)`}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Visualizer & EASA Explanations (7/12) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Wind Tunnel View */}
          <div className="bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-white/5 flex flex-col items-center">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Aerodynamic Pitch Balance</h4>
            <canvas 
              ref={canvasRef} 
              width={480} 
              height={260} 
              className="w-full bg-slate-950 rounded-2xl border border-slate-800 shadow-inner max-w-lg" 
            />
            <div className="flex gap-4 mt-4 text-[10px] font-bold text-center text-slate-400 justify-center">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#facc15] rounded-full"></span> CG</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#38bdf8] rounded-full"></span> Wing Lift (CP)</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#f472b6] rounded-full"></span> Stabiliser Force</span>
            </div>
          </div>

          {/* Stability feedback warning */}
          {staticStability === 'POSITIVE' ? (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-start gap-3">
              <CheckCircle className="text-emerald-400 w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-200">
                <strong>Positive Static Stability:</strong> Aircraft is stable. Pitch disturbance generates restoring aerodynamic moments on the horizontal stabilizer that return the aircraft back to trimmed flight.
              </div>
            </div>
          ) : staticStability === 'NEUTRAL' ? (
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl flex items-start gap-3">
              <AlertTriangle className="text-yellow-400 w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-xs text-yellow-200">
                <strong>Neutral Static Stability:</strong> Aircraft is at the Neutral Point. Following a disturbance, the aircraft maintains the new pitch angle without any restoring or diverging moments.
              </div>
            </div>
          ) : (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-start gap-3">
              <ShieldAlert className="text-red-400 w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-xs text-red-200">
                <strong>CRITICAL STABILITY ALERT:</strong> Aircraft has **Negative Static Stability** (CG is aft of the Neutral Point!). Disturbances will dynamically diverge, causing the pitch angle to rapidly escalate. High risk of stall or structural failure.
              </div>
            </div>
          )}

          {/* EASA Key Concepts */}
          <div className="bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-white/5 space-y-4">
            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">EASA Stability & Manoeuvrability</h4>
            
            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex gap-3">
                <div className="p-2 bg-slate-950 rounded-lg text-violet-400 font-bold h-max font-mono">01</div>
                <div>
                  <strong>Longitudinal Stability:</strong> Stable aircraft have CG positioned **forward of the aerodynamic center / neutral point**. This creates a natural pitch-down wing moment that must be counter-balanced by **tailplane downforce**.
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-2 bg-slate-950 rounded-lg text-violet-400 font-bold h-max font-mono">02</div>
                <div>
                  <strong>Manoeuvrability Tradeoff:</strong> High static stability opposes cockpit control inputs, reducing manoeuvrability. An **aft CG position increases manoeuvrability** by reducing the static margin, but degrades pitch stability.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StabilitySimulator;
