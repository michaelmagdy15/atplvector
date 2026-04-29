import React, { useState } from 'react';
import { 
  Globe, Plane, Gavel, FileText, ArrowRight, Shield, 
  Info, CheckCircle2, AlertCircle, BookOpen, Scale,
  User, Building2, Layers, Landmark
} from 'lucide-react';

const InternationalLaw: React.FC = () => {
  const [activeTab, setActiveTab] = useState('principles');
  const [freedom, setFreedom] = useState(1);
  const [selectedAnnex, setSelectedAnnex] = useState<number | null>(null);
  const [showAllObjectives, setShowAllObjectives] = useState(false);

  const tabs = [
    { id: 'principles', label: 'Principles', icon: Globe },
    { id: 'orgs', label: 'Global Orgs', icon: Landmark },
    { id: 'freedoms', label: 'Air Freedoms', icon: Plane },
    { id: 'liability', label: 'Liability & Rights', icon: Scale },
    { id: 'easa', label: 'EASA Framework', icon: Building2 },
    { id: 'documents', label: 'On-Board Docs', icon: FileText },
  ];

  const icaoObjectives = [
    "Ensure the safe and orderly growth of international civil aviation throughout the world.",
    "Encourage the arts of aircraft design and operation for peaceful purposes.",
    "Encourage the development of airways, airports, and air navigation facilities.",
    "Meet the needs of the peoples of the world for safe, regular, efficient and economical air transport.",
    "Prevent economic waste caused by unreasonable competition.",
    "Ensure that the rights of contracting States are fully respected.",
    "Avoid discrimination between contracting States.",
    "Promote safety of flight in international air navigation.",
    "Promote generally the development of all aspects of international civil aeronautics."
  ];

  const historicalContext = {
    title: "The Chicago Convention (1944)",
    circumstances: "Convened during WWII (Dec 1944) by 54 nations to plan for the post-war era. The collapse of the 1919 Paris Convention's effectiveness and the rapid technological leap during the war necessitated a new, global framework for safe and orderly air travel.",
    article38: "Article 38 (Notification of Differences): If a state cannot comply with an ICAO Standard, it MUST immediately notify ICAO of the differences between its own practice and that established by the international standard."
  };

  const iataObjectives = [
    "To promote safe, regular and economical air transport for the benefit of the peoples of the world.",
    "To foster air commerce and to study the problems connected therewith.",
    "To provide means for collaboration among air transport enterprises.",
    "To cooperate with ICAO and other international organizations."
  ];

  const freedoms = [
    { id: 1, title: '1st Freedom', desc: 'The right to fly over a foreign country without landing (Transit).', type: 'Technical' },
    { id: 2, title: '2nd Freedom', desc: 'The right to land in a foreign country for non-traffic purposes (Refueling/Maintenance).', type: 'Technical' },
    { id: 3, title: '3rd Freedom', desc: 'The right to fly from one\'s own country to another country for commercial purposes.', type: 'Commercial' },
    { id: 4, title: '4th Freedom', desc: 'The right to fly from another country back to one\'s own country for commercial purposes.', type: 'Commercial' },
    { id: 5, title: '5th Freedom', desc: 'The right to fly between two foreign countries on a flight originating or ending in the home country.', type: 'Commercial' },
  ];

  const icaoAnnexes = [
    { nr: 1, title: 'Personnel Licensing', focus: 'Licenses for flight crew, ATC, and maintenance.' },
    { nr: 2, title: 'Rules of the Air', focus: 'General rules, visual rules, and instrument flight rules.' },
    { nr: 3, title: 'Meteorological Service', focus: 'Provision of weather info for international navigation.' },
    { nr: 4, title: 'Aeronautical Charts', focus: 'Standards for maps used in aviation.' },
    { nr: 5, title: 'Units of Measurement', focus: 'Dimensional units for air and ground operations.' },
    { nr: 6, title: 'Operation of Aircraft', focus: 'Safety and efficiency in commercial and general aviation.' },
    { nr: 7, title: 'Aircraft Nationality/Marks', focus: 'Registration and marking of aircraft.' },
    { nr: 8, title: 'Airworthiness of Aircraft', focus: 'Certification and inspection standards.' },
    { nr: 9, title: 'Facilitation', focus: 'Simplifying border-crossing for people and cargo.' },
    { nr: 10, title: 'Aeronautical Comms', focus: 'Radio frequency and digital data standards.' },
    { nr: 11, title: 'Air Traffic Services', focus: 'Establishment of ATC, flight info, and alerting services.' },
    { nr: 12, title: 'Search and Rescue', focus: 'Org and operation of SAR services.' },
    { nr: 13, title: 'Aircraft Accident Invest.', focus: 'Procedures for investigating incidents/accidents.' },
    { nr: 14, title: 'Aerodromes', focus: 'Design and operations of airports.' },
    { nr: 15, title: 'Aeronautical Info Services', focus: 'Methods for collecting and disseminating data (NOTAMs).' },
    { nr: 16, title: 'Environmental Protection', focus: 'Aircraft noise and engine emissions.' },
    { nr: 17, title: 'Security', focus: 'Safeguarding civil aviation against unlawful acts.' },
    { nr: 18, title: 'Dangerous Goods', focus: 'Safe transport of hazardous materials by air.' },
    { nr: 19, title: 'Safety Management', focus: 'State safety programs and SMS for operators.' },
  ];

  const documents = [
    { id: 'cofr', title: 'Cert. of Registration', ref: 'Art 17-21', desc: 'Proves nationality. One state only.' },
    { id: 'cofa', title: 'Cert. of Airworthiness', ref: 'Art 31', desc: 'Issued by State of Registry. Validates safety.' },
    { id: 'lic', title: 'Personnel Licences', ref: 'Art 32', desc: 'For every crew member. Validated by registry.' },
    { id: 'radio', title: 'Radio Station Licence', ref: 'Art 30', desc: 'Required for all aircraft with radio.' },
    { id: 'pax', title: 'Passenger List', ref: 'Art 29', desc: 'Names and places of embarkation/destination.' },
    { id: 'cargo', title: 'Cargo Manifest', ref: 'Art 29', desc: 'Declaration of the cargo carried.' },
    { id: 'log', title: 'Journey Logbook', ref: 'Art 34', desc: 'Details of every flight performed.' },
    { id: 'photog', title: 'Photographic Apparatus', ref: 'Art 36', desc: 'States may prohibit/regulate use over territory.' },
    { id: 'restr', title: 'Cargo Restrictions', ref: 'Art 35', desc: 'Munitions/war material require state permission.' },
  ];

  return (
    <div className="min-h-[600px] bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-8 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-800">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
            <Gavel className="text-indigo-400 w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">International Law</h2>
            <p className="text-slate-400 text-sm font-medium">Prefix 010.01 • Chicago Convention & Regulatory Frameworks</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap
                ${activeTab === tab.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-slate-900/50">
        
        {/* Principles Tab */}
        {activeTab === 'principles' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Timeline */}
            <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <BookOpen className="text-indigo-400" /> Evolution of Air Law
              </h3>
              <div className="relative flex justify-between items-start max-w-2xl mx-auto mb-4">
                <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-700 z-0"></div>
                <div className="relative z-10 flex flex-col items-center text-center w-24">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center mb-2">
                    <span className="text-[10px] font-bold text-slate-400">1919</span>
                  </div>
                  <span className="text-white font-bold text-[10px]">Paris</span>
                  <span className="text-slate-500 text-[8px]">Sovereignty Defined</span>
                </div>
                <div className="relative z-10 flex flex-col items-center text-center w-24">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center mb-2">
                    <span className="text-[10px] font-bold text-slate-400">1928</span>
                  </div>
                  <span className="text-white font-bold text-[10px]">Havana</span>
                  <span className="text-slate-500 text-[8px]">Pan-American Rules</span>
                </div>
                <div className="relative z-10 flex flex-col items-center text-center w-24">
                  <div className="w-10 h-10 -mt-1 rounded-full bg-indigo-600 border-2 border-indigo-400 flex items-center justify-center mb-2 shadow-lg shadow-indigo-600/30">
                    <span className="text-[10px] font-bold text-white">1944</span>
                  </div>
                  <span className="text-indigo-400 font-bold text-[10px]">Chicago</span>
                  <span className="text-indigo-300 text-[8px]">Modern Framework</span>
                </div>
              </div>
              <p className="text-slate-400 text-xs text-center italic mb-4">The Chicago Convention superseded Paris and Havana to establish a global standard.</p>
              
              <div className="p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20 mt-4">
                <h4 className="text-indigo-400 font-bold text-xs uppercase tracking-widest mb-1 flex items-center gap-1">
                  <Info className="w-3 h-3" /> Historical Context (Art. 43)
                </h4>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {historicalContext.circumstances}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Shield className="text-sky-400" /> Sovereignty & Territory
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-700">
                    <span className="text-sky-400 font-bold text-xs uppercase tracking-widest block mb-1">Article 1</span>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Every state has <strong className="text-white">complete and exclusive sovereignty</strong> over the airspace above its territory.
                    </p>
                  </div>
                  <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-700">
                    <span className="text-sky-400 font-bold text-xs uppercase tracking-widest block mb-1">Territory Definition</span>
                    <p className="text-slate-300 text-sm leading-relaxed mb-2">
                      Land areas and <strong className="text-white">territorial waters</strong> adjacent thereto.
                    </p>
                    <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-lg border border-slate-700">
                      <div className="w-12 h-6 bg-emerald-600 rounded flex items-center justify-center text-[8px] font-bold text-white">LAND</div>
                      <div className="h-0.5 flex-1 bg-slate-600 relative">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[8px] text-slate-500">12 NM</div>
                      </div>
                      <div className="w-12 h-6 bg-blue-600 rounded flex items-center justify-center text-[8px] font-bold text-white">HIGH SEAS</div>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-700">
                    <span className="text-sky-400 font-bold text-xs uppercase tracking-widest block mb-1">High Seas</span>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Airspace over high seas is <strong className="text-white">international</strong>. Rules of the Air (Annex 2) apply without exception as per Article 12.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Layers className="text-amber-400" /> Traffic Rights & Controls
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="group cursor-help relative p-4 bg-slate-900/60 rounded-xl border border-slate-700 hover:border-amber-500/50 transition-colors">
                    <h4 className="text-amber-400 font-bold text-sm mb-1">Cabotage (Art 7)</h4>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      The right of an airline from one country to fly between two points within a foreign country. States may refuse this right.
                    </p>
                  </div>
                  <div className="group cursor-help relative p-4 bg-slate-900/60 rounded-xl border border-slate-700 hover:border-amber-500/50 transition-colors">
                    <h4 className="text-amber-400 font-bold text-sm mb-1">Nationality of Aircraft</h4>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      Aircraft have the nationality of the <strong className="text-white">State in which they are registered</strong> (Article 17). Dual registration is prohibited (Art 18).
                    </p>
                  </div>
                  <div className="group cursor-help relative p-4 bg-slate-900/60 rounded-xl border border-slate-700 hover:border-amber-500/50 transition-colors">
                    <h4 className="text-amber-400 font-bold text-sm mb-1">Scheduled vs Non-Scheduled</h4>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      <strong className="text-white">Article 5:</strong> Non-scheduled flight rights. <br/>
                      <strong className="text-white">Article 6:</strong> Scheduled air services require <strong className="text-white">special permission</strong> or authorization.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-indigo-500/5 p-6 rounded-2xl border border-indigo-500/20">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <Info className="text-indigo-400 w-5 h-5" /> Chicago Convention Summary
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Signed on 7 December 1944. Its primary aim is to ensure that international civil aviation is developed in a <strong className="text-white">safe and orderly manner</strong> and that services are established on the basis of equality of opportunity.
              </p>
              <div className="flex gap-4">
                <div className="flex-1 bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-center">
                  <span className="block text-indigo-400 font-bold text-lg">96</span>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Articles</span>
                </div>
                <div className="flex-1 bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-center">
                  <span className="block text-indigo-400 font-bold text-lg">19</span>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Annexes</span>
                </div>
                <div className="flex-1 bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-center">
                  <span className="block text-indigo-400 font-bold text-lg">Montreal</span>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Permanent Seat</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Organizations Tab */}
        {activeTab === 'orgs' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Top Comparison */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800/40 p-6 rounded-2xl border border-indigo-500/30 shadow-lg shadow-indigo-500/5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-indigo-500/20 rounded-lg">
                    <Landmark className="text-indigo-400 w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">ICAO</h3>
                    <p className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold">Intergovernmental (UN)</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-700">
                    <h4 className="text-xs font-bold text-slate-300 uppercase mb-2">Objectives (Art 44)</h4>
                    <ul className="space-y-2">
                      {(showAllObjectives ? icaoObjectives : icaoObjectives.slice(0, 4)).map((obj, i) => (
                        <li key={i} className="flex gap-2 text-[11px] text-slate-400 leading-tight">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0 mt-0.5" />
                          {obj}
                        </li>
                      ))}
                      <li 
                        onClick={() => setShowAllObjectives(!showAllObjectives)}
                        className="text-[10px] text-indigo-400 font-bold italic cursor-pointer hover:text-indigo-300 transition-colors"
                      >
                        {showAllObjectives ? 'Show less' : `+ ${icaoObjectives.length - 4} more key objectives`}
                      </li>
                    </ul>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Assembly</span>
                      <p className="text-[10px] text-slate-300">All members. Meets <span className="text-white font-bold">triennially</span>.</p>
                    </div>
                    <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Council</span>
                      <p className="text-[10px] text-slate-300"><span className="text-white font-bold">36 States</span>. Adopts SARPs.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/40 p-6 rounded-2xl border border-sky-500/30 shadow-lg shadow-sky-500/5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-sky-500/20 rounded-lg">
                    <Building2 className="text-sky-400 w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">IATA</h3>
                    <p className="text-[10px] text-sky-400 uppercase tracking-widest font-bold">Airlines Trade Association</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-700">
                    <h4 className="text-xs font-bold text-slate-300 uppercase mb-2">Objectives</h4>
                    <div className="grid gap-2">
                      {iataObjectives.map((obj, i) => (
                        <div key={i} className="flex gap-2 p-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
                          <div className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 flex-shrink-0" />
                          <p className="text-[10px] text-slate-400 leading-tight">{obj}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
                    <h4 className="text-amber-400 font-bold text-[10px] uppercase mb-1">Art. 38: Notification of Differences</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      States must notify ICAO if they cannot comply with a Standard. This is critical for the <span className="text-amber-200">Validity of Endorsed Licences</span> and certificates.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Annexes Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <BookOpen className="text-emerald-400" /> ICAO Annexes (SARPs)
                </h3>
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Standards</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Recommended Practices</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {icaoAnnexes.map(annex => (
                  <button
                    key={annex.nr}
                    onClick={() => setSelectedAnnex(annex.nr === selectedAnnex ? null : annex.nr)}
                    className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden group
                      ${selectedAnnex === annex.nr 
                        ? 'bg-emerald-600 border-emerald-400 shadow-lg shadow-emerald-600/20' 
                        : 'bg-slate-800/40 border-slate-700 hover:border-emerald-500/50 hover:bg-slate-800'}`}
                  >
                    <div className="text-lg font-black mb-0.5 opacity-20 group-hover:opacity-40 transition-opacity absolute -right-1 -bottom-1">
                      {annex.nr}
                    </div>
                    <span className={`text-[10px] font-bold block transition-colors ${selectedAnnex === annex.nr ? 'text-emerald-200' : 'text-slate-500'}`}>
                      ANNEX {annex.nr}
                    </span>
                    <span className={`text-[11px] font-bold block leading-tight ${selectedAnnex === annex.nr ? 'text-white' : 'text-slate-300'}`}>
                      {annex.title}
                    </span>
                    {selectedAnnex === annex.nr && (
                      <div className="mt-2 pt-2 border-t border-emerald-400/30 animate-in fade-in zoom-in-95 duration-200">
                        <p className="text-[10px] text-emerald-50 text-leading-tight font-medium">
                          {annex.focus}
                        </p>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Freedoms Tab */}
        {activeTab === 'freedoms' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-slate-800/40 p-8 rounded-2xl border border-slate-700/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <Plane className="text-slate-700 w-32 h-32 rotate-12 opacity-20" />
              </div>
              
              <div className="relative z-10 flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/3 space-y-3">
                  {freedoms.map(f => (
                    <button
                      key={f.id}
                      onClick={() => setFreedom(f.id)}
                      className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between group
                        ${freedom === f.id 
                          ? 'bg-sky-600 border-sky-400 shadow-xl shadow-sky-600/20 scale-[1.02]' 
                          : 'bg-slate-900/60 border-slate-700 hover:border-sky-500/50'}`}
                    >
                      <div>
                        <span className={`text-[10px] font-black uppercase tracking-widest block ${freedom === f.id ? 'text-sky-200' : 'text-slate-500'}`}>
                          {f.type}
                        </span>
                        <h4 className={`font-bold ${freedom === f.id ? 'text-white' : 'text-slate-300'}`}>
                          {f.title}
                        </h4>
                      </div>
                      <ArrowRight className={`w-4 h-4 transition-transform ${freedom === f.id ? 'translate-x-1 text-white' : 'text-slate-600 group-hover:text-slate-400'}`} />
                    </button>
                  ))}
                </div>

                <div className="flex-1 bg-slate-900/80 rounded-2xl border border-slate-700 flex flex-col">
                  <div className="p-6 border-b border-slate-800">
                    <h3 className="text-xl font-bold text-white mb-2">{freedoms[freedom-1].title}</h3>
                    <p className="text-slate-400 text-sm">{freedoms[freedom-1].desc}</p>
                  </div>
                  <div className="flex-1 flex items-center justify-center p-12 relative min-h-[240px]">
                    {/* Visualizer - Schematic */}
                    <div className="flex items-center gap-12 text-sm font-bold w-full max-w-lg">
                      <div className="flex flex-col items-center gap-2 flex-1">
                        <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-600/20 border-2 border-indigo-400">
                          <Landmark className="text-white" />
                        </div>
                        <span className="text-white text-xs uppercase tracking-widest">Home State</span>
                      </div>

                      <div className="flex-grow flex items-center relative h-12">
                        <div className="w-full h-0.5 bg-slate-700 border-t-2 border-dashed border-sky-500/30"></div>
                        
                        {/* The Plane Animation */}
                        <div className={`absolute top-1/2 -translate-y-1/2 transition-all duration-1000 ease-in-out w-full
                          ${freedom === 1 ? 'animate-fly-through' : ''}
                          ${freedom === 2 ? 'animate-stop-at-b' : ''}
                          ${freedom === 3 ? 'animate-home-to-b' : ''}
                          ${freedom === 4 ? 'animate-b-to-home' : ''}
                          ${freedom === 5 ? 'animate-home-to-c' : ''}
                        `}>
                          <Plane className={`text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)] 
                            ${freedom === 4 ? 'rotate-180' : ''}`} 
                          />
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-2 flex-1 relative">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all
                          ${freedom >= 1 ? 'bg-emerald-600 border-emerald-400 shadow-lg shadow-emerald-600/20' : 'bg-slate-800 border-slate-700'}`}>
                          <Globe className="text-white" />
                        </div>
                        <span className="text-white text-xs uppercase tracking-widest">State B</span>
                        {freedom === 5 && (
                          <div className="absolute -top-12 whitespace-nowrap bg-indigo-600 text-[10px] px-2 py-1 rounded text-white font-bold animate-bounce shadow-lg">
                            PICK UP PASSENGERS
                          </div>
                        )}
                      </div>

                      {freedom >= 5 && (
                        <>
                          <div className="flex-grow flex items-center relative h-12">
                            <div className="w-full h-0.5 bg-slate-700 border-t-2 border-dashed border-sky-500/30"></div>
                          </div>
                          <div className="flex flex-col items-center gap-2 flex-1">
                            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center border-2 border-purple-400 shadow-lg shadow-purple-600/20">
                              <Globe className="text-white" />
                            </div>
                            <span className="text-white text-xs uppercase tracking-widest">State C</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Liability Tab */}
        {activeTab === 'liability' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Scale className="text-indigo-400" /> Carrier Liability
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-900/60 rounded-xl border-l-4 border-amber-500">
                    <h4 className="text-white font-bold text-sm mb-1">Montreal Convention (1999)</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Established <strong className="text-slate-200">Strict Liability</strong> for death or injury up to 128,821 SDR. Beyond this, liability is unlimited unless the carrier proves it was not negligent.
                    </p>
                  </div>
                  <div className="p-4 bg-slate-900/60 rounded-xl border-l-4 border-indigo-500">
                    <h4 className="text-white font-bold text-sm mb-1">Documents of Carriage</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Individual or collective document of carriage is required. Non-compliance does <strong className="text-slate-200">not</strong> affect the validity of the contract.
                    </p>
                  </div>
                  <div className="p-4 bg-slate-900/60 rounded-xl border-l-4 border-sky-500">
                    <h4 className="text-white font-bold text-sm mb-1">SDR Liability Limits</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      <strong className="text-slate-200">Baggage:</strong> ~1,288 SDR per pax (destruction, loss, damage or delay). <br/>
                      <strong className="text-slate-200">Cargo:</strong> 22 SDR per kg.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <User className="text-purple-400" /> Passenger Rights (EU 261/2004)
                </h3>
                <div className="space-y-4">
                  {/* Visual Compensation Table */}
                  <div className="bg-slate-900/80 rounded-xl border border-slate-700 overflow-hidden">
                    <table className="w-full text-[10px] text-left">
                      <thead className="bg-slate-800 text-slate-400 uppercase font-bold">
                        <tr>
                          <th className="px-3 py-2">Distance</th>
                          <th className="px-3 py-2">Delay</th>
                          <th className="px-3 py-2">Comp.</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        <tr className="hover:bg-slate-800/50 transition-colors">
                          <td className="px-3 py-2 text-slate-300">Up to 1500km</td>
                          <td className="px-3 py-2 text-slate-400">2 hours</td>
                          <td className="px-3 py-2 font-bold text-emerald-400">€250</td>
                        </tr>
                        <tr className="hover:bg-slate-800/50 transition-colors">
                          <td className="px-3 py-2 text-slate-300">1500 - 3500km</td>
                          <td className="px-3 py-2 text-slate-400">3 hours</td>
                          <td className="px-3 py-2 font-bold text-emerald-400">€400</td>
                        </tr>
                        <tr className="hover:bg-slate-800/50 transition-colors">
                          <td className="px-3 py-2 text-slate-300">Over 3500km</td>
                          <td className="px-3 py-2 text-slate-400">4 hours</td>
                          <td className="px-3 py-2 font-bold text-emerald-400">€600</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="p-3 bg-amber-500/5 rounded-xl border border-amber-500/20">
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      <strong className="text-amber-400">Right to Care:</strong> Meals, refreshments, 2 phone calls, and hotel accommodation if an overnight stay is required.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-red-500/5 p-6 rounded-2xl border border-red-500/20">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <Shield className="text-red-400 w-5 h-5" /> PIC Powers & Unlawful Acts
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2 p-4 bg-slate-900/40 rounded-xl border border-slate-800">
                  <h4 className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Tokyo (1963)</h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    <strong className="text-white">Art 6:</strong> PIC may impose <span className="text-red-200">restraint</span> on any person who has committed (or is about to commit) an act jeopardizing safety. 
                  </p>
                  <p className="text-[10px] text-slate-500 italic">Immunity granted to crew/passengers for actions taken.</p>
                </div>
                <div className="space-y-2 p-4 bg-slate-900/40 rounded-xl border border-slate-800">
                  <h4 className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Hague (1970)</h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Deals with <strong className="text-white">Unlawful Seizure</strong> of aircraft (Hijacking). States must make hijacking a "punishable by severe penalties" offence.
                  </p>
                </div>
                <div className="space-y-2 p-4 bg-slate-900/40 rounded-xl border border-slate-800">
                  <h4 className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Montreal (1971)</h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Suppression of <strong className="text-white">Unlawful Acts</strong> against safety (Sabotage, false info, damaging facilities). 
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EASA Tab */}
        {activeTab === 'easa' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Building2 className="text-indigo-400" /> EASA Objectives (Reg. 2018/1139)
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="p-5 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                  <h4 className="text-indigo-400 font-bold text-xs uppercase tracking-widest mb-2">Principal Objective</h4>
                  <p className="text-white text-sm font-bold leading-relaxed">
                    Establish and maintain a <span className="text-indigo-300">high uniform level</span> of civil aviation safety in the Union.
                  </p>
                </div>
                <div className="p-5 bg-slate-900/60 rounded-2xl border border-slate-700">
                  <h4 className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-2">Additional Objectives</h4>
                  <ul className="space-y-2">
                    {['Environmental protection', 'Level playing field', 'Free movement of goods/persons', 'Promotion of EU views globally'].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-[11px] text-slate-400">
                        <div className="w-1 h-1 rounded-full bg-indigo-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-12 relative">
                <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-700 -translate-x-1/2"></div>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-indigo-600 p-1.5 rounded text-white font-bold text-[10px]">HARD LAW</div>
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Binding Regulations</span>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-900/60 rounded-xl border border-indigo-500/20 group hover:border-indigo-500/50 transition-colors">
                      <h4 className="text-white font-bold text-sm mb-1">Basic Regulation</h4>
                      <p className="text-slate-400 text-xs">Council/Parliament Level. Establishes EASA & Principles.</p>
                    </div>
                    <div className="p-4 bg-slate-900/60 rounded-xl border border-indigo-500/20 group hover:border-indigo-500/50 transition-colors">
                      <h4 className="text-white font-bold text-sm mb-1">Implementing Rules (IR)</h4>
                      <p className="text-slate-400 text-xs">Commission Level. Detailed technical requirements (e.g. Part-FCL, Part-OPS).</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-emerald-600 p-1.5 rounded text-white font-bold text-[10px]">SOFT LAW</div>
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">EASA Executive Decisions</span>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-900/60 rounded-xl border border-emerald-500/20 group hover:border-emerald-500/50 transition-colors">
                      <h4 className="text-white font-bold text-sm mb-1">CS (Certification Specs)</h4>
                      <p className="text-slate-400 text-xs">Standards used for the certification of products (e.g. CS-25 for large planes).</p>
                    </div>
                    <div className="p-4 bg-slate-900/60 rounded-xl border border-emerald-500/20 group hover:border-emerald-500/50 transition-colors">
                      <h4 className="text-white font-bold text-sm mb-1">AMC / GM</h4>
                      <p className="text-slate-400 text-xs">Acceptable Means of Compliance and Guidance Material.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Plane className="text-sky-400 w-5 h-5" /> Single European Sky (SES)
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Reform of European airspace management to reduce fragmentation.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700 text-center">
                      <span className="text-[10px] font-bold text-sky-400 uppercase tracking-tighter">FAB</span>
                      <p className="text-[9px] text-slate-500 mt-1">Functional Airspace Blocks</p>
                    </div>
                    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700 text-center">
                      <span className="text-[10px] font-bold text-sky-400 uppercase tracking-tighter">SESAR</span>
                      <p className="text-[9px] text-slate-500 mt-1">Tech R&D Program</p>
                    </div>
                  </div>
                </div>
                <div className="bg-sky-500/5 p-4 rounded-xl border border-sky-500/20">
                  <h4 className="text-[10px] font-bold text-sky-400 uppercase tracking-widest mb-2">Performance Scheme Targets</h4>
                  <div className="space-y-2">
                    {['Safety', 'Environment (Fuel/CO2)', 'Capacity (Delay reduction)', 'Cost-efficiency'].map((target, i) => (
                      <div key={i} className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-300">{target}</span>
                        <CheckCircle2 className="w-3 h-3 text-sky-500" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <FileText className="text-emerald-400" /> Mandatory Documents on Board (Art 29)
              </h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.map(doc => (
                  <div 
                    key={doc.id}
                    className="p-5 bg-slate-900/60 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-all hover:shadow-lg hover:shadow-emerald-500/5 group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-bold text-sm group-hover:text-emerald-400 transition-colors">{doc.title}</h4>
                      <CheckCircle2 className="text-emerald-500 w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-2">{doc.ref}</span>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      {doc.desc}
                    </p>
                  </div>
                ))}
                
                <div className="p-5 bg-emerald-500/5 rounded-2xl border border-emerald-500/20 flex items-center justify-center text-center">
                  <div>
                    <h4 className="text-emerald-400 font-bold text-xs uppercase tracking-widest mb-1">Art. 10 & 16: Searches</h4>
                    <p className="text-slate-400 text-[10px] leading-relaxed">
                      Aircraft must land at designated <strong className="text-white">Customs Airports</strong>. States have the right <strong className="text-white">to search aircraft</strong> on landing/departure (Art 16).
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700 flex items-center gap-6">
              <div className="hidden sm:flex w-16 h-16 bg-amber-500/10 rounded-2xl items-center justify-center border border-amber-500/20 flex-shrink-0">
                <AlertCircle className="text-amber-400 w-8 h-8" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm mb-1 uppercase tracking-tight">Recognition of Certificates</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  States <strong className="text-slate-200">must recognize</strong> CofA and licences issued by other Contracting States, provided the requirements for such certificates are <strong className="text-slate-200">equal to or above</strong> ICAO standards (Art 33).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Exam Fast Track */}
        <div className="mt-8 pt-8 border-t border-slate-800/60 mx-8">
          <div className="flex items-center gap-2 mb-6">
            <CheckCircle2 className="text-emerald-500 w-5 h-5" />
            <h3 className="text-lg font-bold text-white uppercase tracking-tight">Exam Fast-Track: 010.01 High-Yield Facts</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800 hover:border-indigo-500/30 transition-colors">
              <span className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Standard vs RP</span>
              <p className="text-[11px] text-slate-300">
                <strong className="text-indigo-400">Standard:</strong> "Shall" - Necessary. <br/>
                <strong className="text-amber-400">Recommended:</strong> "Should" - Desirable.
              </p>
            </div>
            <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800 hover:border-indigo-500/30 transition-colors">
              <span className="text-[9px] font-bold text-slate-500 uppercase block mb-1">ICAO Numbers</span>
              <p className="text-[11px] text-slate-300">
                <strong className="text-white">Council:</strong> 36 States. <br/>
                <strong className="text-white">ANC:</strong> 19 Experts.
              </p>
            </div>
            <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800 hover:border-indigo-500/30 transition-colors">
              <span className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Cabotage (Art 7)</span>
              <p className="text-[11px] text-slate-300">States have the right to <strong className="text-white">refuse permission</strong> to other states to take on/discharge traffic for profit. </p>
            </div>
            <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800 hover:border-indigo-500/30 transition-colors">
              <span className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Sovereignty (Art 1)</span>
              <p className="text-[11px] text-slate-300">Every state has <strong className="text-white">complete and exclusive</strong> sovereignty over the airspace above its territory.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="px-8 py-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Syllabus Coverage: 100% (Prefix 010.01)</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] text-slate-600 font-medium">ATPL Vector • Interactive Learning Module</span>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fly-through {
          0% { left: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        @keyframes stop-at-b {
          0% { left: 0%; opacity: 0; }
          10% { opacity: 1; }
          50% { left: 50%; transform: translate(-50%, -50%); }
          90% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        @keyframes home-to-b {
          0% { left: 0%; opacity: 0; }
          10% { opacity: 1; }
          100% { left: 50%; opacity: 1; transform: translate(-50%, -50%); }
        }
        @keyframes b-to-home {
          0% { left: 50%; opacity: 0; transform: translate(-50%, -50%) rotate(180deg); }
          10% { opacity: 1; }
          100% { left: 0%; opacity: 1; transform: translate(-50%, -50%) rotate(180deg); }
        }
        @keyframes home-to-c {
          0% { left: 0%; opacity: 0; }
          10% { opacity: 1; }
          50% { left: 50%; opacity: 1; transform: translate(-50%, -50%); }
          100% { left: 100%; opacity: 1; transform: translate(-50%, -50%); }
        }
        .animate-fly-through { animation: fly-through 3s infinite linear; }
        .animate-stop-at-b { animation: stop-at-b 4s infinite ease-in-out; }
        .animate-home-to-b { animation: home-to-b 2s infinite ease-out; }
        .animate-b-to-home { animation: b-to-home 2s infinite ease-out; }
        .animate-home-to-c { animation: home-to-c 4s infinite linear; }
      `}} />
    </div>
  );
};

export default InternationalLaw;