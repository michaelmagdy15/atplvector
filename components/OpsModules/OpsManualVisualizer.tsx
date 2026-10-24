import React, { useState } from 'react';
import { 
  Book, Shield, Users, Map, GraduationCap, AlertCircle, 
  Clock, CheckCircle2, XCircle, AlertOctagon, Scale, FileText, ChevronRight, Info 
} from 'lucide-react';
import { MEL_DISPATCH_INTERVALS_DATA } from '../../data/courseData';

const OpsManualVisualizer: React.FC = () => {
  const [activePart, setActivePart] = useState<'A' | 'B' | 'C' | 'D'>('B');
  const [selectedMelCat, setSelectedMelCat] = useState<'A' | 'B' | 'C' | 'D'>('B');
  const [selectedAirportCat, setSelectedAirportCat] = useState<'A' | 'B' | 'C'>('C');

  const parts = [
    {
      id: 'A' as const,
      title: 'Part A: General/Basic',
      subtitle: 'Company Structure & Non-Type Policies',
      desc: 'All operational policies and company rules that apply universally across the airline regardless of aircraft type.',
      icon: Book,
      color: 'blue',
      badge: 'All Fleets',
      details: [
        'Administration & Control of Operations Manual',
        'Organization & Responsibilities (Accountable Manager & Nominated Postholders)',
        'Operational Control & Flight Dispatch Supervision',
        'Crew Composition, Age Limits & Flight Time Limitations (FTL)',
        'Dangerous Goods Policy (ICAO Annex 18 & Operator Provisions)',
        'Security Procedures & Hijack Threat Management (Annex 17)',
        'All-Weather Operations Policies (AWO general minima principles)',
        'Fuel Planning Policy (Contingency, Alternate, Final Reserve rules)'
      ],
      rtfqTrap: 'TRAP: Flight Time Limitations (FTL) and general company authority are ALWAYS located in Part A, NOT Part B or D!'
    },
    {
      id: 'B' as const,
      title: 'Part B: Aeroplane Operating Matters',
      subtitle: 'Aircraft Type-Specific Technical Manual',
      desc: 'Technical limitations, normal, abnormal, emergency procedures, performance, and the Minimum Equipment List (MEL) for a specific aircraft type.',
      icon: Shield,
      color: 'emerald',
      badge: 'Type Specific',
      details: [
        'General Information & Aircraft System Descriptions',
        'Operating Limitations (Airspeed, Weights, Altitude, CG limits)',
        'Normal Checklists & Standard Operating Procedures (SOPs)',
        'Abnormal & Emergency Procedures (QRH references)',
        'Aircraft Performance Tables (Takeoff, Climb, Cruise, Landing)',
        'Mass & Balance Calculation Schedules and Loading Envelopes',
        'Minimum Equipment List (MEL) & Configuration Deviation List (CDL)'
      ],
      rtfqTrap: 'TRAP: The MEL is ALWAYS housed in Part B of the Operations Manual! Operator MEL can NEVER be less restrictive than the Master MEL (MMEL).'
    },
    {
      id: 'C' as const,
      title: 'Part C: Route & Aerodrome Instructions',
      subtitle: 'Network Directory & Airport Categorization',
      desc: 'Instructions and information relating to routes, aerodromes, navigation aids, and escape procedures for every airport served.',
      icon: Map,
      color: 'purple',
      badge: 'Network & Routes',
      details: [
        'Aerodrome Directory & Operational Briefings',
        'Airport Categorization (Category A, B, and C Aerodromes)',
        'Route Guides & Communication / Navigation Frequencies',
        'Special Terrain Clearance & Engine-Out Departure Escape Routes',
        'En-route Minimum Flight Altitudes (MORA, MEA, MOCA)',
        'Local Noise Abatement Procedures & Curfew Limitations'
      ],
      rtfqTrap: 'TRAP: Category C airports (e.g. Innsbruck, Funchal, Sion) require specialized pilot-in-command route qualification or simulator training in Part C!'
    },
    {
      id: 'D' as const,
      title: 'Part D: Training',
      subtitle: 'Training Syllabi & Crew Checking',
      desc: 'Comprehensive training syllabi, checking programs, conversion courses, and recurrent qualification standards for flight and cabin crew.',
      icon: GraduationCap,
      color: 'orange',
      badge: 'Syllabi & Checks',
      details: [
        'Initial & Recurrent Training Programs for Pilots & Cabin Crew',
        'Operator Proficiency Checks (OPC - every 6 months validity)',
        'Line Checks (every 12 months validity)',
        'Crew Resource Management (CRM) & Human Performance Training',
        'Dangerous Goods Recurrent Training (every 24 months)',
        'Emergency & Safety Equipment Training (SEP - every 12 months)'
      ],
      rtfqTrap: 'TRAP: Operator Proficiency Check (OPC) is valid for 6 calendar months; Line Check is valid for 12 calendar months under EASA Part-CAT!'
    }
  ];

  const airportCategories = [
    {
      cat: 'Category A',
      title: 'Standard Aerodrome',
      desc: 'Meets all standard ICAO requirements. Approved instrument approach, normal cloud base and visibility, non-hazardous terrain.',
      requirements: 'Standard line qualification; briefing only.'
    },
    {
      cat: 'Category B',
      title: 'Non-Standard Aerodrome',
      desc: 'Non-standard approach aids, unusual local weather patterns, or limitations on airport facilities.',
      requirements: 'Self-briefing by review of Part C or audiovisual briefing prior to flying as PIC.'
    },
    {
      cat: 'Category C',
      title: 'Complex / Mountainous Aerodrome',
      desc: 'High-risk terrain, complex departure/approach procedures, non-standard missed approach escape routes (e.g., Innsbruck LOWI, Funchal LPMA, Lugano LSZA, Chambery LFLB).',
      requirements: 'Mandatory PIC visit (jump seat or simulator training) within previous 12 months!'
    }
  ];

  const currentPart = parts.find(p => p.id === activePart)!;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-700 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30 text-blue-400">
            <Book size={32} />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Part-CAT Operations Manual (OM)
            </h2>
            <p className="text-slate-400 text-sm">
              The "Bible" of Airline Operations • EASA ORO.MLR.100 & Part-CAT Four-Volume Structure
            </p>
          </div>
        </div>
        <div className="bg-blue-950/40 border border-blue-500/30 px-3 py-1.5 rounded-lg flex items-center gap-2">
          <Scale className="text-blue-400 w-4 h-4" />
          <span className="text-xs font-bold text-blue-300">Mandatory Regulatory Document</span>
        </div>
      </div>

      {/* Part A/B/C/D Tab Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {parts.map(part => {
          const Icon = part.icon;
          const isActive = activePart === part.id;
          return (
            <button
              key={part.id}
              onClick={() => setActivePart(part.id)}
              className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                isActive
                  ? 'bg-blue-600 border-blue-400 shadow-xl shadow-blue-600/20 scale-[1.02]'
                  : 'bg-slate-900/80 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className={`p-2.5 rounded-xl ${isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-blue-400'}`}>
                  <Icon size={22} />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {part.badge}
                </span>
              </div>
              <h3 className={`font-black text-lg ${isActive ? 'text-white' : 'text-slate-200'}`}>
                {part.title}
              </h3>
              <p className={`text-xs mt-1 leading-snug line-clamp-2 ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                {part.subtitle}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Part Content Explorer */}
      <div className="bg-slate-900 rounded-3xl border border-slate-700 p-6 md:p-8 space-y-8">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <h3 className="text-2xl font-black text-white flex items-center gap-2">
              <span className="text-blue-400">{currentPart.title}</span> — Syllabus & Content
            </h3>
            <span className="text-xs bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1 rounded-full font-bold">
              {currentPart.subtitle}
            </span>
          </div>
          <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
            {currentPart.desc}
          </p>
        </div>

        {/* Section Breakdown Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {currentPart.details.map((detail, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 flex items-start gap-3 hover:border-slate-700 transition-colors"
            >
              <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-mono font-bold">
                {idx + 1}
              </div>
              <span className="text-sm text-slate-200 leading-snug font-medium">
                {detail}
              </span>
            </div>
          ))}
        </div>

        {/* RTFQ Exam Alert for this Part */}
        <div className="p-4 bg-amber-950/20 rounded-2xl border border-amber-500/30 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-200">
            <strong className="text-amber-300 uppercase tracking-wider block mb-0.5">Exam Defense Tip:</strong>
            {currentPart.rtfqTrap}
          </div>
        </div>

        {/* SPECIAL DEEP DIVE: PART B (MEL DISPATCH INTERVALS) */}
        {activePart === 'B' && (
          <div className="mt-8 pt-8 border-t border-slate-800 space-y-6 animate-in fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
              <div>
                <h4 className="text-xl font-black text-white flex items-center gap-2">
                  <Shield className="text-emerald-400 w-5 h-5" />
                  MEL Architecture & Dispatch Rectification Intervals
                </h4>
                <p className="text-slate-400 text-xs">
                  Master MEL (MMEL) vs Operator MEL (OM Part B) • Rectification Categories A, B, C, D
                </p>
              </div>
              <div className="bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded text-emerald-300 text-xs font-bold">
                EASA ORO.MLR.105
              </div>
            </div>

            {/* MMEL vs MEL Hierarchy Card */}
            <div className="grid md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500 font-bold uppercase text-[10px] block mb-1">
                  Master MEL (MMEL)
                </span>
                <p className="text-slate-300 leading-relaxed">
                  Established by the <strong>aircraft manufacturer</strong> and approved by the <strong>State of Design</strong> (e.g. EASA/FAA). Establishes the baseline minimum equipment required for safe operation.
                </p>
              </div>
              <div className="p-4 bg-slate-950 rounded-xl border border-emerald-500/30">
                <span className="text-emerald-400 font-bold uppercase text-[10px] block mb-1">
                  Operator MEL (MEL)
                </span>
                <p className="text-slate-300 leading-relaxed">
                  Established by the <strong>operator</strong> and approved by the <strong>State of Operator</strong>. 
                  Can be <strong className="text-white">more restrictive</strong> than the MMEL, but <strong className="text-red-400">NEVER less restrictive</strong>!
                </p>
              </div>
            </div>

            {/* The 4 Rectification Interval Buttons */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3">
                Rectification Interval Categories (Click to inspect logic):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {MEL_DISPATCH_INTERVALS_DATA.map(item => (
                  <button
                    key={item.category}
                    onClick={() => setSelectedMelCat(item.category)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      selectedMelCat === item.category
                        ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-600/20'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    <div className="text-2xl font-black mb-1">Category {item.category}</div>
                    <div className="font-bold text-xs">{item.duration}</div>
                    <div className="text-[10px] opacity-75 mt-0.5">{item.hoursOrDays}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected MEL Details */}
            {(() => {
              const mel = MEL_DISPATCH_INTERVALS_DATA.find(m => m.category === selectedMelCat)!;
              return (
                <div className="p-5 bg-slate-950 rounded-2xl border border-emerald-500/40 space-y-3">
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <h5 className="font-bold text-white text-base">
                      Category {mel.category} — {mel.duration} ({mel.hoursOrDays})
                    </h5>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      mel.extensionAllowed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {mel.extensionAllowed ? 'Extension (RIE) Permitted' : 'Strictly Non-Extendable'}
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    {mel.description}
                  </p>
                  <div className="p-3 bg-emerald-950/20 rounded-lg border border-emerald-500/20 text-xs text-emerald-200">
                    <strong>Croucher Gold Rule:</strong> {mel.croucherRule}
                  </div>
                </div>
              );
            })()}

            {/* The Brake Release Boundary */}
            <div className="p-4 bg-gradient-to-r from-red-950/20 to-slate-950 rounded-2xl border border-red-500/20 space-y-2">
              <h5 className="font-bold text-white text-sm flex items-center gap-2">
                <AlertOctagon className="text-red-400 w-4 h-4" />
                The "Brake Release" Operational Boundary
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                The MEL applies strictly <strong>prior to the commencement of the flight</strong> (before aircraft moves under its own power for the purpose of takeoff). 
                Once taxi commences or brakes are released for departure, any subsequent inoperative system is handled via the 
                <strong>Quick Reference Handbook (QRH)</strong> and the <strong>Commander's final emergency discretion</strong>, NOT the MEL!
              </p>
            </div>
          </div>
        )}

        {/* SPECIAL DEEP DIVE: PART C (AIRPORT CATEGORIES) */}
        {activePart === 'C' && (
          <div className="mt-8 pt-8 border-t border-slate-800 space-y-6 animate-in fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
              <div>
                <h4 className="text-xl font-black text-white flex items-center gap-2">
                  <Map className="text-purple-400 w-5 h-5" />
                  OM Part C: Airport Categorization Framework
                </h4>
                <p className="text-slate-400 text-xs">
                  EASA AMC1 ORO.FC.105(c) • Criteria for Aerodrome Categories A, B, and C
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {airportCategories.map(ac => (
                <button
                  key={ac.cat}
                  onClick={() => setSelectedAirportCat(ac.cat.replace('Category ', '') as any)}
                  className={`p-5 rounded-2xl border text-left transition-all ${
                    selectedAirportCat === ac.cat.replace('Category ', '')
                      ? 'bg-purple-600 border-purple-400 text-white shadow-xl shadow-purple-600/20 scale-[1.02]'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <div className="text-xl font-black mb-1">{ac.cat}</div>
                  <div className="text-xs font-bold mb-2">{ac.title}</div>
                  <p className="text-xs opacity-80 leading-relaxed mb-3">{ac.desc}</p>
                  <div className={`p-2 rounded text-[10px] font-bold ${
                    selectedAirportCat === ac.cat.replace('Category ', '') ? 'bg-white/20 text-white' : 'bg-slate-900 text-purple-300'
                  }`}>
                    {ac.requirements}
                  </div>
                </button>
              ))}
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-2">
              <span className="font-bold text-white uppercase text-[10px] block">Famous Category C Aerodromes</span>
              <div className="grid sm:grid-cols-4 gap-2 text-center font-mono">
                <span className="p-2 bg-slate-900 rounded border border-slate-800">LOWI (Innsbruck)</span>
                <span className="p-2 bg-slate-900 rounded border border-slate-800">LPMA (Funchal Madeira)</span>
                <span className="p-2 bg-slate-900 rounded border border-slate-800">LSZA (Lugano)</span>
                <span className="p-2 bg-slate-900 rounded border border-slate-800">VNLK (Lukla)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Operator Management Protocol */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <Users className="text-blue-400 w-5 h-5" />
            Mandatory Operator Postholders (Part A)
          </h3>
          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex justify-between items-center py-2 border-b border-slate-800">
              <span className="font-bold text-white">Accountable Manager</span>
              <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">Corporate & Financial Responsibility</span>
            </li>
            <li className="flex justify-between items-center py-2 border-b border-slate-800">
              <span>Flight Operations Postholder</span>
              <span className="text-slate-400">Head of Flight Ops (Chief Pilot)</span>
            </li>
            <li className="flex justify-between items-center py-2 border-b border-slate-800">
              <span>Maintenance System Postholder</span>
              <span className="text-slate-400">Continuing Airworthiness (Part-CAMO)</span>
            </li>
            <li className="flex justify-between items-center py-2 border-b border-slate-800">
              <span>Crew Training Postholder</span>
              <span className="text-slate-400">Head of Training (Syllabi & Checks)</span>
            </li>
            <li className="flex justify-between items-center py-2">
              <span>Ground Operations Postholder</span>
              <span className="text-slate-400">Ramp, Baggage, Loading, De-icing</span>
            </li>
          </ul>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <Scale className="text-indigo-400 w-5 h-5" />
            Independent Corporate Safety Oversight
          </h3>
          <ul className="space-y-3 text-xs text-slate-300">
            <li className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <strong className="text-indigo-400 block mb-1">Safety Manager (Annex 19 / SMS)</strong>
              Must have direct operational reporting lines to the Accountable Manager. Operates independently of commercial pressure.
            </li>
            <li className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <strong className="text-indigo-400 block mb-1">Compliance Monitoring Manager (CMM)</strong>
              Responsible for auditing operational compliance against EASA regulations and company OM rules.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OpsManualVisualizer;
