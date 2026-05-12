import React, { useState } from 'react';
import { View } from '../../../types';
import { ChevronLeft, Compass, Map as MapIcon, Wind, Navigation as NavIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  onChangeView: (view: View) => void;
}

const Navigation: React.FC<Props> = ({ onChangeView }) => {
  const [activeTab, setActiveTab] = useState<'dead_reckoning' | 'vor_sim' | 'lost_procedures'>('dead_reckoning');

  // Dead Reckoning State
  const [trueCourse, setTrueCourse] = useState<number>(90);
  const [trueAirspeed, setTrueAirspeed] = useState<number>(100);
  const [windDirection, setWindDirection] = useState<number>(180);
  const [windSpeed, setWindSpeed] = useState<number>(20);

  // VOR Sim State
  const [obs, setObs] = useState<number>(360);
  const [aircraftRadial, setAircraftRadial] = useState<number>(180);
  const [aircraftHeading, setAircraftHeading] = useState<number>(360);

  // Simplified Wind Triangle Calculation
  // All angles in radians for Math.sin/Math.cos
  const tcRad = (trueCourse * Math.PI) / 180;
  const wdRad = (windDirection * Math.PI) / 180;

  // Wind Correction Angle (WCA) = arcsin((WindSpeed * sin(WindDirection - TrueCourse)) / TrueAirspeed)
  const wcaRad = Math.asin((windSpeed * Math.sin(wdRad - tcRad)) / trueAirspeed) || 0;
  const wcaDeg = (wcaRad * 180) / Math.PI;

  const trueHeading = (trueCourse + wcaDeg + 360) % 360;

  // Ground Speed (GS) = TrueAirspeed * cos(WCA) + WindSpeed * cos(WindDirection - TrueCourse)
  const groundSpeed = trueAirspeed * Math.cos(wcaRad) + windSpeed * Math.cos(wdRad - tcRad);

  // VOR Calculation
  const relativeBearing = (aircraftRadial - obs + 360) % 360;
  const isTo = relativeBearing > 90 && relativeBearing < 270;
  let deviation = isTo ? (obs - (aircraftRadial + 180)) % 360 : (obs - aircraftRadial) % 360;
  if (deviation > 180) deviation -= 360;
  if (deviation < -180) deviation += 360;
  const clampedDeviation = Math.max(-10, Math.min(10, deviation));
  
  const lostProcedures = [
    { title: 'Confess', desc: 'Admit to yourself and others that you are lost.' },
    { title: 'Climb', desc: 'Climb to a higher altitude for better radio/nav reception and visibility.' },
    { title: 'Conserve', desc: 'Reduce power to conserve fuel while figuring out your position.' },
    { title: 'Communicate', desc: 'Contact ATC or FSS on 121.5 or the local frequency.' },
    { title: 'Comply', desc: 'Follow the instructions given by ATC to get back on track.' },
  ];

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
            <Compass size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Navigation</h1>
        </div>
        
        <p className="text-slate-300 text-lg max-w-2xl leading-relaxed relative z-10">
          Master dead reckoning and pilotage. Calculate wind correction angles, practice VOR tracking, and review lost procedures.
        </p>
      </div>

      <div className="flex gap-4 mb-8 border-b border-white/10 pb-4">
        <button 
          onClick={() => setActiveTab('dead_reckoning')}
          className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'dead_reckoning' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
        >
          Flight Computer (E6B)
        </button>
        <button 
          onClick={() => setActiveTab('vor_sim')}
          className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'vor_sim' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
        >
          VOR Simulator
        </button>
        <button 
          onClick={() => setActiveTab('lost_procedures')}
          className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'lost_procedures' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
        >
          Lost Procedures
        </button>
      </div>

      {activeTab === 'dead_reckoning' && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-8 duration-500">
        
        {/* Calculator Panel */}
        <div className="bg-slate-900/50 p-8 rounded-3xl border border-white/5 space-y-8">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
             <NavIcon className="text-emerald-400" />
             <h3 className="text-2xl font-bold text-white">Flight Computer (E6B)</h3>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <label className="text-slate-400 font-bold uppercase">True Course (°)</label>
                <span className="text-white font-mono">{trueCourse}°</span>
              </div>
              <input 
                type="range" 
                min="1" max="360" 
                value={trueCourse} 
                onChange={(e) => setTrueCourse(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <label className="text-slate-400 font-bold uppercase">True Airspeed (KT)</label>
                <span className="text-white font-mono">{trueAirspeed} KT</span>
              </div>
              <input 
                type="range" 
                min="40" max="250" 
                value={trueAirspeed} 
                onChange={(e) => setTrueAirspeed(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <label className="text-slate-400 font-bold uppercase">Wind Direction (°)</label>
                <span className="text-white font-mono">{windDirection}°</span>
              </div>
              <input 
                type="range" 
                min="1" max="360" 
                value={windDirection} 
                onChange={(e) => setWindDirection(Number(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <label className="text-slate-400 font-bold uppercase">Wind Speed (KT)</label>
                <span className="text-white font-mono">{windSpeed} KT</span>
              </div>
              <input 
                type="range" 
                min="0" max="60" 
                value={windSpeed} 
                onChange={(e) => setWindSpeed(Number(e.target.value))}
                className="w-full accent-orange-500"
              />
            </div>
          </div>

          <div className="p-6 bg-slate-800 rounded-2xl border border-white/5 mt-8">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Calculated Results</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-sm">True Heading</p>
                <p className="text-3xl font-black text-white font-mono">{Math.round(trueHeading)}°</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Ground Speed</p>
                <p className="text-3xl font-black text-white font-mono">{Math.max(0, Math.round(groundSpeed))} <span className="text-lg">KT</span></p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Wind Correction</p>
                <p className={`text-xl font-bold font-mono ${wcaDeg > 0 ? 'text-blue-400' : wcaDeg < 0 ? 'text-red-400' : 'text-slate-300'}`}>
                  {wcaDeg > 0 ? '+' : ''}{wcaDeg.toFixed(1)}° {wcaDeg > 0 ? '(Right)' : wcaDeg < 0 ? '(Left)' : ''}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Visualizer Panel */}
        <div className="bg-slate-900/50 p-8 rounded-3xl border border-white/5 relative flex items-center justify-center overflow-hidden min-h-[400px]">
          {/* Compass Rose Background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <div className="w-80 h-80 border-2 border-white rounded-full flex justify-center items-center relative">
              <div className="absolute top-2 font-bold text-2xl">N</div>
              <div className="absolute bottom-2 font-bold text-2xl">S</div>
              <div className="absolute right-2 font-bold text-2xl">E</div>
              <div className="absolute left-2 font-bold text-2xl">W</div>
            </div>
          </div>

          <div className="relative w-64 h-64 z-10 flex justify-center items-center">
             {/* True Course Vector (Dashed Line) */}
             <motion.div 
               animate={{ rotate: trueCourse }}
               className="absolute w-full h-1 border-t-2 border-dashed border-emerald-500/50"
             />

             {/* True Heading Vector (Solid Line / Aircraft) */}
             <motion.div 
               animate={{ rotate: trueHeading }}
               className="absolute w-full flex items-center justify-end pr-4"
             >
               <div className="w-3/4 h-1 bg-white" />
               <div className="w-4 h-4 bg-white rotate-45 transform translate-x-2" />
             </motion.div>

             {/* Wind Vector */}
             <motion.div 
               animate={{ rotate: windDirection + 180 }} // Wind comes FROM the direction, so vector points TO direction + 180
               className="absolute w-full flex items-center justify-start pl-8"
             >
               <div className="w-12 h-1 bg-purple-500 relative">
                 <div className="absolute left-0 -top-1 w-2 h-2 border-l-2 border-b-2 border-purple-500 rotate-45" />
               </div>
             </motion.div>
          </div>
          
          <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 border-t-2 border-dashed border-emerald-500" />
              <span className="text-slate-400">Desired Course</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-white" />
              <span className="text-slate-400">Aircraft Heading</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-purple-500" />
              <span className="text-slate-400">Wind Direction</span>
            </div>
          </div>
        </div>

      </div>
      )}

      {activeTab === 'vor_sim' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-8 duration-500">
          <div className="bg-slate-900/50 p-8 rounded-3xl border border-white/5 space-y-8">
            <h3 className="text-2xl font-bold text-white">VOR Configuration</h3>
            <div>
              <label className="text-slate-400 font-bold uppercase text-sm mb-2 block">Omni Bearing Selector (OBS) - {obs}°</label>
              <input type="range" min="1" max="360" value={obs} onChange={(e) => setObs(Number(e.target.value))} className="w-full accent-emerald-500" />
            </div>
            <div>
              <label className="text-slate-400 font-bold uppercase text-sm mb-2 block">Aircraft Position (Radial from VOR) - {aircraftRadial}°</label>
              <input type="range" min="1" max="360" value={aircraftRadial} onChange={(e) => setAircraftRadial(Number(e.target.value))} className="w-full accent-blue-500" />
            </div>
            <div>
              <label className="text-slate-400 font-bold uppercase text-sm mb-2 block">Aircraft Heading - {aircraftHeading}°</label>
              <input type="range" min="1" max="360" value={aircraftHeading} onChange={(e) => setAircraftHeading(Number(e.target.value))} className="w-full accent-purple-500" />
            </div>
          </div>
          <div className="bg-slate-900/50 p-8 rounded-3xl border border-white/5 flex items-center justify-center min-h-[400px]">
            <div className="relative w-64 h-64 border-4 border-slate-700 rounded-full flex justify-center items-center bg-slate-800">
               {/* OBS Ring */}
               <motion.div animate={{ rotate: -obs }} className="absolute inset-0 w-full h-full rounded-full border-2 border-dashed border-slate-500/50" />
               <div className="absolute top-2 text-emerald-400 font-bold font-mono">{obs}°</div>
               
               {/* TO/FROM Flag */}
               <div className={`absolute right-8 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-bold ${isTo ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                 {isTo ? 'TO' : 'FR'}
               </div>

               {/* CDI Needle */}
               <div className="absolute inset-x-8 top-1/2 flex justify-between items-center -translate-y-1/2">
                 <div className="w-2 h-2 rounded-full bg-slate-500" />
                 <div className="w-2 h-2 rounded-full bg-slate-500" />
                 <div className="w-4 h-4 rounded-full border-2 border-slate-500" />
                 <div className="w-2 h-2 rounded-full bg-slate-500" />
                 <div className="w-2 h-2 rounded-full bg-slate-500" />
               </div>

               <motion.div 
                 animate={{ x: clampedDeviation * 6 }} // 6px per degree of deviation
                 className="absolute top-8 bottom-8 w-1 bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)] z-20"
               />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'lost_procedures' && (
        <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {lostProcedures.map((proc, idx) => (
              <motion.div 
                key={proc.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-900/50 p-6 rounded-3xl border border-white/5 relative overflow-hidden"
              >
                <div className="text-5xl font-black text-emerald-500/10 absolute -right-2 -bottom-4">{idx + 1}</div>
                <h3 className="text-2xl font-bold text-white mb-2 text-emerald-400">{proc.title}</h3>
                <p className="text-slate-300 text-sm relative z-10">{proc.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navigation;
