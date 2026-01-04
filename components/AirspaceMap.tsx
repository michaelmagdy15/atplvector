import React, { useState } from 'react';
import { AirspaceClass } from '../types';
import { Plane, AlertTriangle, ShieldCheck, Eye, Activity, ShieldAlert, Radio, Ban } from 'lucide-react';

interface Props {
  airspaceClass: AirspaceClass;
}

const AirspaceMap: React.FC<Props> = ({ airspaceClass }) => {
  const [pilotType, setPilotType] = useState<'VFR' | 'IFR'>('VFR');

  // Configuration for airspace rules based on class AND pilot type
  const getAirspaceRules = (c: AirspaceClass, type: 'VFR' | 'IFR') => {
    // Default base config
    let config = {
      status: 'Allowed',
      separation: 'None',
      atcService: 'Flight Info',
      color: 'bg-slate-600',
      icon: Activity,
      desc: 'Standard operations.',
      radarColor: 'text-slate-500'
    };

    if (c === AirspaceClass.A) {
      if (type === 'VFR') {
        return { ...config, status: 'PROHIBITED', separation: 'N/A', atcService: 'None', color: 'bg-red-600', icon: Ban, desc: 'NO VFR FLIGHTS ALLOWED.', radarColor: 'text-red-500' };
      }
      return { ...config, status: 'Cleared', separation: 'Separated from ALL', atcService: 'Air Traffic Control', color: 'bg-emerald-600', icon: ShieldCheck, desc: 'Full ATC separation from everyone.', radarColor: 'text-emerald-400' };
    }

    if (c === AirspaceClass.B) {
      return { ...config, status: 'Cleared', separation: 'Separated from ALL', atcService: 'Air Traffic Control', color: 'bg-emerald-600', icon: ShieldCheck, desc: 'Strict control. Separation provided from everyone.', radarColor: 'text-emerald-400' };
    }

    if (c === AirspaceClass.C) {
      if (type === 'VFR') {
        return { ...config, status: 'Cleared', separation: 'From IFR Only', atcService: 'ATC + Traffic Info', color: 'bg-yellow-600', icon: Eye, desc: 'Separated from IFR. Traffic info on other VFR.', radarColor: 'text-yellow-400' };
      }
      return { ...config, status: 'Cleared', separation: 'From IFR & VFR', atcService: 'Air Traffic Control', color: 'bg-emerald-600', icon: ShieldCheck, desc: 'ATC separates you from VFR and IFR.', radarColor: 'text-emerald-400' };
    }

    if (c === AirspaceClass.D) {
      if (type === 'VFR') {
        return { ...config, status: 'Cleared', separation: 'None', atcService: 'Traffic Info', color: 'bg-orange-600', icon: Eye, desc: 'Traffic Info only. "See and Avoid".', radarColor: 'text-orange-400' };
      }
      return { ...config, status: 'Cleared', separation: 'From IFR', atcService: 'ATC + Traffic Info', color: 'bg-yellow-600', icon: ShieldCheck, desc: 'Separated from IFR. Traffic info on VFR.', radarColor: 'text-yellow-400' };
    }

    if (c === AirspaceClass.E) {
      if (type === 'VFR') {
        return { ...config, status: 'Allowed', separation: 'None', atcService: 'Traffic Info (Workload)', color: 'bg-slate-600', icon: Radio, desc: 'No clearance needed. Traffic info if available.', radarColor: 'text-slate-500' };
      }
      return { ...config, status: 'Cleared', separation: 'From IFR', atcService: 'Air Traffic Control', color: 'bg-yellow-600', icon: ShieldCheck, desc: 'Separated from IFR only. Watch out for VFR!', radarColor: 'text-yellow-400' };
    }

    if (c === AirspaceClass.F) {
       return { ...config, status: 'Advisory', separation: 'Advisory Only', atcService: 'Advisory Service', color: 'bg-amber-600', icon: Activity, desc: 'Separation encouraged but not guaranteed.', radarColor: 'text-amber-500' };
    }

    if (c === AirspaceClass.G) {
       return { ...config, status: 'Allowed', separation: 'None', atcService: 'Flight Info Service', color: 'bg-slate-700', icon: ShieldAlert, desc: 'Uncontrolled. "See and Avoid" applies.', radarColor: 'text-slate-600' };
    }

    return config;
  };

  const rules = getAirspaceRules(airspaceClass, pilotType);
  const StatusIcon = rules.icon;

  return (
    <div className="w-full h-full bg-slate-900 rounded-lg overflow-hidden relative flex flex-col border border-slate-700">
       
       {/* Top Bar: Pilot Perspective Switcher */}
       <div className="bg-slate-800 p-2 flex justify-between items-center z-20 shadow-md">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pilot Perspective</div>
          <div className="flex bg-slate-900 rounded p-1">
             <button 
                onClick={() => setPilotType('VFR')}
                className={`px-3 py-1 rounded text-xs font-bold transition-all flex items-center gap-2 ${pilotType === 'VFR' ? 'bg-emerald-500 text-white shadow' : 'text-slate-400 hover:text-emerald-400'}`}
             >
                <Eye size={14} /> VFR
             </button>
             <button 
                onClick={() => setPilotType('IFR')}
                className={`px-3 py-1 rounded text-xs font-bold transition-all flex items-center gap-2 ${pilotType === 'IFR' ? 'bg-indigo-500 text-white shadow' : 'text-slate-400 hover:text-indigo-400'}`}
             >
                <Radio size={14} /> IFR
             </button>
          </div>
       </div>

       {/* Visualization Area */}
       <div className="relative flex-grow overflow-hidden group min-h-[350px]">
          
          {/* Radar Background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,41,59,0)_0%,rgba(15,23,42,0.8)_100%)]"></div>
          <div className="absolute inset-0 opacity-20" 
              style={{ 
                  backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', 
                  backgroundSize: '40px 40px' 
              }}>
          </div>
          {/* Radar Sweep Animation */}
          <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,rgba(16,185,129,0)_0%,rgba(16,185,129,0.1)_50%,rgba(16,185,129,0)_100%)] animate-[spin_4s_linear_infinite] rounded-full scale-[1.5] opacity-30 pointer-events-none"></div>

          {/* Central Plane (YOU) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
             
             {/* Separation Bubble Visualization */}
             {rules.separation !== 'None' && rules.separation !== 'N/A' && (
                <div className={`absolute w-40 h-40 rounded-full border-2 border-dashed ${rules.color.replace('bg-', 'border-')} opacity-30 animate-pulse`}></div>
             )}
             
             {/* Plane Icon */}
             <div className={`p-2 rounded-full ${pilotType === 'VFR' ? 'bg-emerald-500' : 'bg-indigo-500'} shadow-[0_0_15px_currentColor] relative z-20`}>
                <Plane className="text-white transform -rotate-45" size={24} />
             </div>
             
             {/* Tag */}
             <div className="mt-2 bg-slate-900/80 px-2 py-1 rounded text-[10px] font-mono border border-slate-700 text-white whitespace-nowrap">
                YOU ({pilotType})
             </div>
          </div>

          {/* Traffic Planes (Decorations) */}
          <div className="absolute top-[20%] right-[20%] animate-[float_10s_ease-in-out_infinite]">
             <Plane className={`transform rotate-[135deg] ${rules.separation.includes('ALL') ? 'text-emerald-500' : 'text-slate-500'}`} size={20} />
             {rules.separation.includes('ALL') && <div className="absolute inset-0 border border-emerald-500/30 rounded-full scale-150"></div>}
          </div>
          <div className="absolute bottom-[30%] left-[20%] animate-[float_12s_ease-in-out_infinite_reverse]">
             <Plane className="transform rotate-45 text-slate-500" size={20} />
             {/* Show Danger Line if no separation */}
             {rules.separation === 'None' && airspaceClass !== AirspaceClass.A && (
                <div className="absolute w-24 h-[1px] bg-red-500/50 rotate-45 origin-top-left animate-pulse"></div>
             )}
          </div>

          {/* HUD Overlay Info */}
          <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded-xl shadow-2xl flex items-center gap-4">
             <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${rules.color} shadow-lg`}>
                <StatusIcon className="text-white" size={24} />
             </div>
             
             <div className="flex-grow">
                <div className="flex justify-between items-center mb-1">
                   <h3 className="font-bold text-white text-sm">Class {airspaceClass} Rules</h3>
                   <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${rules.color} text-white uppercase`}>
                      {rules.status}
                   </span>
                </div>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                   <div className="flex items-center gap-1 text-slate-400">
                      <ShieldCheck size={12} />
                      <span>Sep: <strong className="text-white">{rules.separation}</strong></span>
                   </div>
                   <div className="flex items-center gap-1 text-slate-400">
                      <Radio size={12} />
                      <span>Svc: <strong className="text-white">{rules.atcService}</strong></span>
                   </div>
                </div>
                
                <p className="text-[10px] text-slate-400 mt-2 border-t border-slate-700 pt-1 italic">
                   "{rules.desc}"
                </p>
             </div>
          </div>

          {/* Prohibited Overlay for Class A VFR */}
          {airspaceClass === AirspaceClass.A && pilotType === 'VFR' && (
             <div className="absolute inset-0 bg-red-900/40 backdrop-blur-[2px] flex items-center justify-center z-30">
                <div className="bg-red-600 text-white p-4 rounded-xl shadow-2xl border-2 border-white transform rotate-[-10deg]">
                   <h2 className="text-2xl font-black uppercase">Entry Denied</h2>
                   <p className="text-xs font-bold text-center">IFR Only Airspace</p>
                </div>
             </div>
          )}

       </div>

       <style>{`
         @keyframes float {
           0%, 100% { transform: translate(0, 0); }
           50% { transform: translate(10px, -10px); }
         }
       `}</style>
    </div>
  );
};

export default AirspaceMap;