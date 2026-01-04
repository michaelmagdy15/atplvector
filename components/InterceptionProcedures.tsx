import React, { useState } from 'react';
import { Plane, AlertTriangle, MessageSquare, Info, ShieldAlert } from 'lucide-react';

const InterceptionProcedures: React.FC = () => {
  const [activeSignal, setActiveSignal] = useState<string | null>(null);

  const signals = [
    {
      id: 'rock',
      phrase: 'Rocking Wings',
      meaning: 'You have been intercepted. Follow me.',
      response: 'Rock wings, flash lights, follow.',
      animationClass: 'animate-rock'
    },
    {
      id: 'break',
      phrase: 'Abrupt Break-away',
      meaning: 'You may proceed.',
      response: 'Rock wings, proceed.',
      animationClass: 'animate-break'
    },
    {
      id: 'flash',
      phrase: 'Flashing Lights',
      meaning: 'Land at this aerodrome.',
      response: 'Lower gear, turn on lights, follow.',
      animationClass: 'animate-flash'
    }
  ];

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
      <style>{`
        @keyframes rock-wings {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(15deg); }
          50% { transform: rotate(-15deg); }
          75% { transform: rotate(15deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes flash-lights {
          0% { opacity: 1; }
          50% { opacity: 0.3; }
          100% { opacity: 1; }
        }
        @keyframes break-away {
          0% { transform: translateX(0) rotate(0); opacity: 1; }
          100% { transform: translateX(-100px) rotate(-45deg); opacity: 0; }
        }
        .animate-rock { animation: rock-wings 2s infinite ease-in-out; }
        .animate-flash { animation: flash-lights 0.5s infinite; }
        .animate-break { animation: break-away 2s forwards; }
      `}</style>
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <ShieldAlert className="text-red-500" />
          Interception Procedures (SERA)
        </h2>
        <p className="text-slate-400 text-sm">Visual signals and protocols when intercepted by military aircraft.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Left: Signals Visualizer */}
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 to-slate-900 opacity-50"></div>
          
          {/* Clouds bg */}
          <div className="absolute top-10 left-10 text-white/5"><Plane size={100} /></div>
          
          {/* Main Aircraft Representation */}
          <div className="relative z-10 flex flex-col items-center">
            {activeSignal ? (
              <>
                <div className={`transition-all duration-500 ${signals.find(s => s.id === activeSignal)?.animationClass}`}>
                  <Plane size={96} className="text-sky-400" strokeWidth={1.5} />
                  {/* Lights for flash */}
                  {activeSignal === 'flash' && (
                    <>
                      <div className="absolute top-0 left-0 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white] animate-flash"></div>
                      <div className="absolute top-0 right-0 w-2 h-2 bg-green-400 rounded-full shadow-[0_0_10px_green] animate-flash"></div>
                    </>
                  )}
                </div>
                <div className="mt-8 bg-slate-800/80 backdrop-blur p-4 rounded-lg border border-sky-500/50 text-center max-w-xs animate-in slide-in-from-bottom-4">
                  <p className="font-bold text-sky-400 text-lg">{signals.find(s => s.id === activeSignal)?.phrase}</p>
                  <p className="text-white text-sm mt-1">Meaning: {signals.find(s => s.id === activeSignal)?.meaning}</p>
                  <div className="mt-2 pt-2 border-t border-slate-700">
                    <p className="text-xs text-slate-400 uppercase font-bold">Pilot Response:</p>
                    <p className="text-xs text-slate-300">{signals.find(s => s.id === activeSignal)?.response}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-slate-500">
                <AlertTriangle size={48} className="mx-auto mb-2 opacity-50" />
                <p>Select a signal to visualize</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Info & Controls */}
        <div className="space-y-6">
          <div className="bg-slate-900 p-4 rounded-lg border-l-4 border-red-500">
             <h3 className="font-bold text-white mb-2 text-sm flex items-center gap-2">
               <Info size={16} /> Why Intercept?
             </h3>
             <ul className="grid grid-cols-2 gap-2 text-xs text-slate-300">
               <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> Unidentified a/c</li>
               <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> Hostile intent</li>
               <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> Smuggling</li>
               <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> Loss of comms</li>
               <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> Off route</li>
               <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> Hazard to safety</li>
             </ul>
          </div>

          <div>
            <h3 className="font-bold text-slate-400 text-xs uppercase mb-3">Intercepting Aircraft Signals</h3>
            <div className="space-y-2">
              {signals.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSignal(s.id)}
                  className={`w-full p-3 rounded flex items-center justify-between transition-all ${
                    activeSignal === s.id 
                    ? 'bg-sky-600 text-white shadow-lg' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <span className="font-bold text-sm">{s.phrase}</span>
                  <MessageSquare size={16} className={activeSignal === s.id ? 'text-white' : 'text-slate-500'} />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/50 p-4 rounded border border-slate-700">
             <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase">Emergency Frequencies</h4>
             <div className="flex gap-4 font-mono text-sm font-bold text-white">
               <span className="bg-slate-800 px-2 py-1 rounded">121.5 MHz</span>
               <span className="bg-slate-800 px-2 py-1 rounded">243.0 MHz</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterceptionProcedures;