import React, { useState } from 'react';
import { ClipboardList, Stethoscope, AlertTriangle, Info, FileText, Share2, Activity, Globe, Gavel, Flag, XCircle } from 'lucide-react';

const AccidentInvestigation: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState<number | null>(null);
  const [activeRole, setActiveRole] = useState<string | null>(null);

  const scenarios = [
    { 
      id: 1, 
      text: "Passenger breaks leg during turbulence", 
      result: "Accident", 
      reason: "Broken bones (fracture) counts as Serious Injury.",
      icon: <Activity className="text-red-400" />
    },
    { 
      id: 2, 
      text: "Engine failure with debris contained", 
      result: "Incident", 
      reason: "Damage limited to engine/accessories is an Exception to 'Accident'.",
      icon: <AlertTriangle className="text-amber-400" />
    },
    { 
      id: 3, 
      text: "Passenger suffers heart attack in flight", 
      result: "Not Accident", 
      reason: "Natural causes are excluded from the definition.",
      icon: <Stethoscope className="text-slate-400" />
    },
    { 
      id: 4, 
      text: "Wing tip scrapes runway", 
      result: "Incident", 
      reason: "Damage limited to wing tips is excluded from 'Accident'.",
      icon: <Info className="text-sky-400" />
    },
    { 
      id: 5, 
      text: "Near collision requiring evasive action", 
      result: "Serious Incident", 
      reason: "High probability of accident, but avoided. Investigated like an accident.",
      icon: <AlertTriangle className="text-orange-500" />
    },
    { 
      id: 6, 
      text: "Emergency evacuation causing broken ankle", 
      result: "Accident", 
      reason: "Injury sustained during operation of aircraft (evacuation).",
      icon: <Activity className="text-red-500" />
    },
    { 
      id: 7, 
      text: "Maintenance truck hits parked aircraft", 
      result: "Not Accident", 
      reason: "No intention for flight at the time (if crew/pax not boarding/onboard for flight).",
      icon: <XCircle className="text-slate-400" />
    }
  ];

  const roles = [
    { 
      id: 'occurrence', 
      title: 'State of Occurrence', 
      icon: <AlertTriangle />,
      duty: 'Institutes and Conducts the investigation.',
      detail: 'If the accident happens in their territory, they are the boss. They can delegate the whole investigation to the State of Registry or Operator if desired.'
    },
    { 
      id: 'registry', 
      title: 'State of Registry', 
      icon: <Flag />,
      duty: 'Entitled to appoint Accredited Rep (ACCREP).',
      detail: 'The state where the aircraft is registered. Must notify others if State of Occurrence is unaware.'
    },
    { 
      id: 'operator', 
      title: 'State of Operator', 
      icon: <ClipboardList />,
      duty: 'Entitled to appoint Accredited Rep.',
      detail: 'Where the airline is based. Provides info on flight crew, logs, and maintenance.'
    },
    { 
      id: 'design', 
      title: 'State of Design', 
      icon: <Share2 />,
      duty: 'Entitled to appoint Accredited Rep.',
      detail: 'Where the aircraft type was designed (e.g., USA for Boeing, France for Airbus). Essential for technical data.'
    },
    { 
      id: 'manufacturer', 
      title: 'State of Manufacture', 
      icon: <Gavel />,
      duty: 'Entitled to appoint Accredited Rep.',
      detail: 'Where the aircraft was assembled. Often same as Design, but not always.'
    }
  ];

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <ClipboardList className="text-rose-500" />
          Accident & Investigation (Annex 13)
        </h2>
        <p className="text-slate-400 text-sm">Sole objective: Prevention of accidents, not apportioning blame.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Left Column: Definitions & Interactive Classifier */}
        <div className="space-y-6">
          <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
             <h3 className="font-bold text-white mb-4 border-b border-slate-800 pb-2">Is it an Accident?</h3>
             <div className="space-y-2">
               {scenarios.map((s) => (
                 <div key={s.id} className="bg-slate-800 p-3 rounded hover:bg-slate-750 transition-colors">
                    <div className="flex justify-between items-center cursor-pointer" onClick={() => setActiveScenario(activeScenario === s.id ? null : s.id)}>
                       <div className="flex items-center gap-3">
                          {s.icon}
                          <span className="text-sm font-medium text-slate-200">{s.text}</span>
                       </div>
                       <button className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">Check</button>
                    </div>
                    
                    {activeScenario === s.id && (
                       <div className="mt-3 pt-3 border-t border-slate-700 animate-in slide-in-from-top-2">
                          <p className={`font-bold text-lg ${
                            s.result === 'Accident' ? 'text-red-500' : 
                            s.result === 'Incident' ? 'text-amber-400' : 
                            s.result === 'Serious Incident' ? 'text-orange-500' :
                            'text-slate-400'
                          }`}>
                             {s.result}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">{s.reason}</p>
                       </div>
                    )}
                 </div>
               ))}
             </div>
          </div>

          <div className="bg-slate-800 border border-slate-600 p-4 rounded-lg">
             <h4 className="font-bold text-rose-400 text-sm uppercase mb-2">Serious Injury Definition</h4>
             <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4">
                <li>Hospitalization for <strong>&gt; 48 hours</strong> (within 7 days).</li>
                <li>Fractures (except simple fingers/toes/nose).</li>
                <li>Lacerations causing severe hemorrhage/nerve damage.</li>
                <li>Injury to internal organ.</li>
                <li>2nd/3rd degree burns or &gt;5% body surface.</li>
                <li>Exposure to infectious substance/radiation.</li>
             </ul>
          </div>
        </div>

        {/* Right Column: Conduct of Investigation & Roles */}
        <div className="flex flex-col gap-6">
           <div className="bg-slate-900 p-5 rounded-lg border border-slate-700 flex-grow">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                 <Globe size={18} /> Conduct of Investigation
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                 Who is responsible? Click on a State role to see their duties.
              </p>

              <div className="grid grid-cols-1 gap-2">
                {roles.map((role) => (
                  <div 
                    key={role.id}
                    onClick={() => setActiveRole(activeRole === role.id ? null : role.id)}
                    className={`p-3 rounded border transition-all cursor-pointer ${
                      activeRole === role.id 
                        ? 'bg-indigo-600/20 border-indigo-500' 
                        : 'bg-slate-800 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${activeRole === role.id ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                        {role.icon}
                      </div>
                      <div className="flex-1">
                        <p className={`font-bold text-sm ${activeRole === role.id ? 'text-indigo-300' : 'text-slate-300'}`}>
                          {role.title}
                        </p>
                        {activeRole === role.id && (
                          <div className="mt-2 animate-in slide-in-from-left-2">
                            <p className="text-sm font-semibold text-white mb-1">{role.duty}</p>
                            <p className="text-xs text-slate-400 leading-relaxed">{role.detail}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
           </div>

           <div className="bg-emerald-900/10 border border-emerald-900/30 p-4 rounded-lg">
              <h4 className="font-bold text-emerald-500 text-sm mb-2 flex items-center gap-2">
                 <FileText size={16} /> Mandatory Occurrence Reporting (MOR)
              </h4>
              <p className="text-xs text-slate-400 mb-2">Who MUST report?</p>
              <div className="flex flex-wrap gap-2">
                 {['PIC', 'Engineer', 'ATC', 'Airport Manager', 'Ground Handling', 'Maintenance'].map(role => (
                    <span key={role} className="bg-slate-800 text-slate-300 text-[10px] px-2 py-1 rounded border border-slate-600 font-mono">
                       {role}
                    </span>
                 ))}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default AccidentInvestigation;