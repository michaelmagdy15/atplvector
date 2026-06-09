import React, { useState } from 'react';
import { View } from '../../types';
import { 
  Plane, BookOpen, Shield, Fuel, Navigation, BarChart3, Users, 
  Search, Award, Clock, ArrowLeft, ChevronRight, CheckCircle, HelpCircle
} from 'lucide-react';

interface Props {
  onChangeView: (view: View) => void;
}

interface Chapter {
  number: number;
  title: string;
  summary: string;
  keyTopics: string[];
  atplView?: View;
  atplLinkLabel?: string;
}

const egyptAirChapters: Chapter[] = [
  {
    number: 1,
    title: "Introduction to Flight Crew Training & Fleet Profile",
    summary: "Overview of the EgyptAir training pathways, cadet standards, and structural transition models to modern jet fleets (A320neo, B787, A220).",
    keyTopics: ["Cadet milestones", "Fleet capabilities", "Standard operating philosophies"],
    atplView: View.KSA_HOME,
    atplLinkLabel: "100 KSA"
  },
  {
    number: 2,
    title: "ECAA Authority Structure & Egyptian CARs",
    summary: "Detailed analysis of the Egyptian Civil Aviation Authority (ECAA) directives and EASA/FAA harmonized regulations under ECAR Part 121.",
    keyTopics: ["ECAR 121 commercial ops", "ECAA audit guidelines", "EGALPA pilots association support"],
    atplView: View.AIR_LAW_HOME,
    atplLinkLabel: "010 Air Law"
  },
  {
    number: 3,
    title: "Meteorology & EMA Reporting",
    summary: "Interpretation of EMA meteorological datasets, local desert weather phenomena (Khamsin wind), and decoding Metar/Taf/Gamet reports.",
    keyTopics: ["Khamsin wind guidelines", "Taf/Metar decoding", "EMA safety warnings"],
    atplView: View.MET_HOME,
    atplLinkLabel: "050 Meteorology"
  },
  {
    number: 4,
    title: "Air Traffic Control & Communications",
    summary: "Aviation phraseology standards inside Cairo FIR (HECC), emergency transmissions, and operational blind transmission protocols.",
    keyTopics: ["Cairo Control communications", "Phonetic clear-speak", "Blind transmissions"],
    atplView: View.DASHBOARD,
    atplLinkLabel: "090 Communications"
  },
  {
    number: 5,
    title: "Rules of the Air & Airspace Classes",
    summary: "ECAA airspace categorization (Class A to G) and separation rules governing VFR/IFR traffic in high-density corridors.",
    keyTopics: ["Vertical separation minimums", "Right of way rules", "Airspace boundaries"],
    atplView: View.AIR_LAW_RULES_DETAILS,
    atplLinkLabel: "Rules of the Air (010)"
  },
  {
    number: 6,
    title: "Flight Planning Operations",
    summary: "Mastering the preparation of operational flight plans (OFPs), ICAO flight forms, and airway route validation protocols.",
    keyTopics: ["OFP construction", "ICAO item fields", "Airway clearance"],
    atplView: View.FLIGHT_PLAN_HOME,
    atplLinkLabel: "033 Flight Planning"
  },
  {
    number: 7,
    title: "Instrument Approach & Landing Procedures",
    summary: "Precision vs non-precision landing profiles, standard instrument departures (SIDs), and standard terminal arrival routes (STARs).",
    keyTopics: ["Category II/III ILS limits", "STAR flow charts", "Missed approach criteria"],
    atplView: View.AIR_LAW_INSTRUMENT,
    atplLinkLabel: "ILS & STAR (010)"
  },
  {
    number: 8,
    title: "Flight Crew Flight Time Limitations (FTL)",
    summary: "ECAA rest and duty guidelines. Maximum monthly block hours, fatigue management, and pilot standby regulations.",
    keyTopics: ["Maximum block hours", "Rest period calculations", "Standby duty rules"],
    atplView: View.OPS_FTL,
    atplLinkLabel: "FTL & Rest Rules (070)"
  },
  {
    number: 9,
    title: "Company Fuel Policy & Contingency Planning",
    summary: "Fuel buildup policies including taxi fuel, alternate, final reserve, contingency fuel rules, and isolated aerodrome procedures.",
    keyTopics: ["5% vs 3% Contingency with Decision Point", "Final reserve jet rules", "Alternate fuel requirements"],
    atplView: View.FLIGHT_PLAN_FUEL,
    atplLinkLabel: "Fuel Planning (033)"
  },
  {
    number: 10,
    title: "Aircraft General Systems",
    summary: "Primary airframe systems: triple redundancy hydraulics, multi-generator electrical buses, and pneumatic bleed air systems.",
    keyTopics: ["Hydraulic flow routing", "AC/DC electrical buses", "Pneumatic cross-bleed valve"],
    atplView: View.AGK_SYSTEMS_HOME,
    atplLinkLabel: "021 Aircraft Systems"
  },
  {
    number: 11,
    title: "Instrument Flight Rules (IFR) & DME Arc Lab",
    summary: "Techniques for high-precision radio navigation, VOR/NDB tracking, DME Arc procedures, and hold pattern entry sectors.",
    keyTopics: ["Lead radial calculations", "Direct/Teardrop/Parallel entry", "Holding speed limitations"],
    atplView: View.RAD_NAV_HOME,
    atplLinkLabel: "062 Radio Nav"
  },
  {
    number: 12,
    title: "High-Altitude Operations & RVSM",
    summary: "Requirements for cruising in Reduced Vertical Separation Minimum (RVSM) airspace, IRS drift, and high-altitude aerodynamic limits.",
    keyTopics: ["RVSM airspace equipment", "Coffin corner handling", "Altimeter tolerance limits"],
    atplView: View.AIR_LAW_CRUISING,
    atplLinkLabel: "Cruising & RVSM (010)"
  },
  {
    number: 13,
    title: "Emergency Procedures & Communication Failures",
    summary: "Standard protocols for handling in-flight engine failures, cabin rapid depressurization, and radio communication failures (7600).",
    keyTopics: ["Engine fire checklists", "Emergency descents", "7600 lost comm routing"],
    atplView: View.EMERGENCY_OPS,
    atplLinkLabel: "Emergency Ops (070)"
  },
  {
    number: 14,
    title: "Weight & Balance Controls",
    summary: "Calculation of Dry Operating Mass, Zero Fuel Mass, and Takeoff/Landing limits. Shift of CG and indexing load sheets.",
    keyTopics: ["Index and chord percentages", "Load sheet validation", "Forward vs Aft CG limits"],
    atplView: View.MASS_BAL_HOME,
    atplLinkLabel: "031 Mass & Balance"
  },
  {
    number: 15,
    title: "Jet Characteristics & High-Speed Aerodynamics",
    summary: "Understanding swept-wing characteristics, Mach tuck, shockwaves, boundary layer control, and dutch roll dynamics.",
    keyTopics: ["Swept-wing stall profiles", "Critical Mach number", "Dutch roll oscillations"],
    atplView: View.POF_HOME,
    atplLinkLabel: "081 Principles of Flight"
  },
  {
    number: 16,
    title: "Takeoff Performance Calculations & V-speeds",
    summary: "Balanced field length concepts, takeoff segments (first through fourth), and critical V-speeds (V1, VR, V2, Vmcg, Vmca).",
    keyTopics: ["Balanced field margins", "Takeoff climb gradients", "Wet runway speed reductions"],
    atplView: View.PERF_HOME,
    atplLinkLabel: "032 Performance"
  },
  {
    number: 17,
    title: "Aeronautical Decision Making & CRM",
    summary: "Core human factors, hazardous attitudes (impulsivity, macho, resignation), Threat and Error Management (TEM), and cockpit authority gradients.",
    keyTopics: ["Five hazardous attitudes", "Synergy and authority gradients", "TEM threat avoidance"],
    atplView: View.HPL_HOME,
    atplLinkLabel: "040 Human Performance"
  }
];

export const EgyptAirDashboard: React.FC<Props> = ({ onChangeView }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'CURRICULUM' | 'SIMULATORS' | 'STUDY_EXAMS'>('CURRICULUM');

  const filteredChapters = egyptAirChapters.filter(chapter => 
    chapter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chapter.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chapter.keyTopics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const stats = [
    { label: "Manual Edition", value: "4th Edition", icon: BookOpen, color: "text-blue-400" },
    { label: "SOP Modules", value: "5 Active Lab Units", icon: Award, color: "text-cyan-400" },
    { label: "Study Progress", value: "First Officer Track", icon: Clock, color: "text-indigo-400" }
  ];

  const simulatorsList = [
    {
      title: "ECAA & ECAR Regulations Quiz",
      description: "Interactive test on ECAR 121 rules, Operations Manual formats, and regulatory agency roles (ECAA, ICAO, EGALPA).",
      icon: Shield,
      view: View.EGYPTAIR_REGS_QUIZ,
      gradient: "from-blue-600 to-cyan-500",
      stats: "20 Core Questions"
    },
    {
      title: "Company Fuel Policy Planner",
      description: "Buildup dynamic company fuel logs (Taxi, Trip, 5% or 3% Contingency, Alternate, Final Reserve) with volumetric fuel tanks.",
      icon: Fuel,
      view: View.EGYPTAIR_FUEL_PLAN,
      gradient: "from-cyan-600 to-teal-500",
      stats: "ECAA Compliant Logic"
    },
    {
      title: "Instrument Navigation Lab",
      description: "Interactive hold entries visualizer (Teardrop, Parallel, Direct sectors) and DME Arc lead radials visual simulator.",
      icon: Navigation,
      view: View.EGYPTAIR_NAV_SIM,
      gradient: "from-indigo-600 to-blue-500",
      stats: "DME Arc & Hold entry visualizer"
    },
    {
      title: "Jet Performance V-Speeds Calc",
      description: "Input aircraft weight, OAT, and field elevation to compute V1, VR, V2, and render active takeoff segment climb profiles.",
      icon: BarChart3,
      view: View.EGYPTAIR_PERF_CALC,
      gradient: "from-blue-700 to-indigo-600",
      stats: "4-Segment Climb Plotter"
    },
    {
      title: "SOP Decision Scenario Engine",
      description: "ECAA-themed cockpit crisis scenarios evaluating your susceptibility to the 5 ADM Hazardous Attitudes and TEM scores.",
      icon: Users,
      view: View.EGYPTAIR_CRM_SIM,
      gradient: "from-purple-600 to-indigo-600",
      stats: "CRM & Hazardous Attitudes Review"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 relative overflow-hidden font-sans text-slate-100">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        
        {/* Navigation Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <button 
            onClick={() => onChangeView(View.PLATFORM_DASHBOARD)}
            className="inline-flex items-center px-4 py-2 bg-slate-900/80 hover:bg-slate-800 text-slate-300 rounded-xl border border-white/5 transition-all text-sm w-fit active:scale-95"
          >
            <ArrowLeft className="mr-2 w-4 h-4" /> Back to Mission Control
          </button>
          
          <div className="inline-flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="text-xs font-black uppercase tracking-[0.2em] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-3 py-1.5 rounded-full">
              EgyptAir Cadet Prep Suite
            </span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="glass-card rounded-[2rem] p-8 md:p-12 bg-gradient-to-r from-blue-950/40 via-indigo-950/20 to-slate-900/60 border border-white/10 relative overflow-hidden">
          <div className="absolute top-1/2 right-12 -translate-y-1/2 opacity-10 hidden lg:block">
            <Plane size={240} className="text-blue-400 rotate-12" />
          </div>
          
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
              EgyptAir Cadet <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                ABC 4th Edition Ground School
              </span>
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed opacity-95">
              Welcome to the official cadet preparation space. This training syllabus aggregates regulations, operations, flight characteristics, and crew coordination protocols direct from the ABC manual to equip you for airline operations.
            </p>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              {stats.map((stat, idx) => (
                <div key={idx} className="p-5 bg-slate-900/50 rounded-2xl border border-white/5 flex items-center gap-4">
                  <div className={`p-3 bg-slate-800 rounded-xl ${stat.color}`}>
                    <stat.icon size={20} />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-black tracking-wider">{stat.label}</div>
                    <div className="text-white font-bold text-sm mt-0.5">{stat.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap border-b border-white/5 gap-6">
          <button 
            onClick={() => setActiveTab('CURRICULUM')}
            className={`pb-4 text-sm md:text-base font-bold transition-all relative ${
              activeTab === 'CURRICULUM' ? 'text-blue-400 border-b-2 border-blue-500' : 'text-slate-400 hover:text-white'
            }`}
          >
            Syllabus Curriculum
          </button>
          <button 
            onClick={() => setActiveTab('SIMULATORS')}
            className={`pb-4 text-sm md:text-base font-bold transition-all relative ${
              activeTab === 'SIMULATORS' ? 'text-blue-400 border-b-2 border-blue-500' : 'text-slate-400 hover:text-white'
            }`}
          >
            Training Simulators & Labs
          </button>
          <button 
            onClick={() => setActiveTab('STUDY_EXAMS')}
            className={`pb-4 text-sm md:text-base font-bold transition-all relative ${
              activeTab === 'STUDY_EXAMS' ? 'text-blue-400 border-b-2 border-blue-500' : 'text-slate-400 hover:text-white'
            }`}
          >
            Study & Exams
          </button>
        </div>

        {/* Content Tabs */}
        {activeTab === 'CURRICULUM' && (
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-3.5 text-slate-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search chapters, flight rules, SOPs..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900/80 border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-white focus:border-blue-500 outline-none transition-all placeholder-slate-600 text-sm"
              />
            </div>

            {/* Chapters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChapters.map((chapter) => (
                <div 
                  key={chapter.number}
                  className="glass-card bg-slate-900/40 border border-white/5 rounded-2xl p-6 hover:border-blue-500/20 hover:bg-slate-900/60 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-blue-400 font-bold uppercase tracking-widest">Chapter {chapter.number}</span>
                      <span className="p-1 bg-slate-800 rounded text-[10px] text-slate-400 font-mono">ABC v4</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white tracking-tight">{chapter.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{chapter.summary}</p>
                  </div>

                  <div>
                    <div className="pt-6 border-t border-white/5 mt-6 space-y-2">
                      <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Key Focus Areas</div>
                      <div className="flex flex-wrap gap-2">
                        {chapter.keyTopics.map((topic, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 text-[10px] font-medium text-blue-300 rounded-lg">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    {chapter.atplView && (
                      <button
                        onClick={() => onChangeView(chapter.atplView!)}
                        className="w-full mt-4 py-2.5 px-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-xl text-xs font-bold text-blue-400 hover:text-white transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
                      >
                        <BookOpen size={12} />
                        Study {chapter.atplLinkLabel || "ATPL Reference"}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {filteredChapters.length === 0 && (
                <div className="col-span-full py-16 text-center text-slate-500">
                  No chapters found matching your search term.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'SIMULATORS' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-500">
            {simulatorsList.map((sim, idx) => (
              <div 
                key={idx}
                onClick={() => onChangeView(sim.view)}
                className="group relative glass-card rounded-2xl p-1 overflow-hidden transition-all duration-500 hover:scale-[1.005] cursor-pointer shadow-xl border border-white/5 hover:border-blue-500/30"
              >
                <div className="bg-slate-900/60 hover:bg-slate-900/80 rounded-2xl h-full p-8 relative overflow-hidden backdrop-blur-md transition-all">
                  <div className="flex items-start gap-6">
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${sim.gradient} text-white shadow-lg`}>
                      <sim.icon size={28} />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">{sim.stats}</span>
                        <ChevronRight className="w-5 h-5 text-slate-500 group-hover:translate-x-1 group-hover:text-white transition-all" />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors">
                        {sim.title}
                      </h3>
                      
                      <p className="text-slate-400 text-sm leading-relaxed">
                        {sim.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'STUDY_EXAMS' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="p-6 bg-blue-950/20 border border-blue-500/20 rounded-2xl">
              <h3 className="text-xl font-bold text-white mb-2">EgyptAir Cadet EASA ATPL Reference</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                As part of your EgyptAir FO cadet training, you are required to master these core EASA ATPL subjects. Click on any subject below to open the interactive EASA ground school dashboard, or practice the EASA question banks to prepare for your ECAA exams.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  code: "010",
                  subject: "Air Law & ATC Procedures",
                  desc: "Airspace classes, flight rules (VFR/IFR), and Cairo FIR operations.",
                  studyView: View.AIR_LAW_HOME
                },
                {
                  code: "021/022",
                  subject: "Aircraft Systems & Instruments",
                  desc: "Triple hydraulics, AC/DC electrical grids, jet bleed air, and DME/VOR/ILS instruments.",
                  studyView: View.AGK_SYSTEMS_HOME
                },
                {
                  code: "031/032",
                  subject: "Performance & Weight & Balance",
                  desc: "Balanced field length calculations, critical V-speeds, and Dry Operating Mass indexing.",
                  studyView: View.PERF_HOME
                },
                {
                  code: "040",
                  subject: "Human Performance & Limitations",
                  desc: "Threat and Error Management (TEM), cockpit authority gradients, and ADM.",
                  studyView: View.HPL_HOME
                },
                {
                  code: "050",
                  subject: "Meteorology",
                  desc: "Khamsin desert storms, EMA met reporting, TAF/METAR, and upper winds.",
                  studyView: View.MET_HOME
                },
                {
                  code: "061/062",
                  subject: "Navigation & Radio Navigation",
                  desc: "VOR/NDB tracking, DME Arc procedures, and hold pattern entry sectors.",
                  studyView: View.GEN_NAV_HOME
                },
                {
                  code: "070",
                  subject: "Operational Procedures",
                  desc: "Taxi, trip, contingency, and reserve fuel policies under ECAA directives.",
                  studyView: View.OPS_PROC_HOME
                },
                {
                  code: "081",
                  subject: "Principles of Flight (Jet Aerodynamics)",
                  desc: "Swept-wing stall behavior, Mach tuck, critical Mach numbers, and shockwave control.",
                  studyView: View.POF_HOME
                }
              ].map((item, idx) => (
                <div key={idx} className="glass-card bg-slate-900/40 border border-white/5 rounded-2xl p-6 hover:border-blue-500/20 transition-all flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-blue-400 font-bold uppercase tracking-widest">EASA Subject {item.code}</span>
                      <span className="p-1 bg-slate-800 rounded text-[10px] text-slate-400 font-mono">Exam Prep</span>
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-tight">{item.subject}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 flex gap-4">
                    <button
                      onClick={() => onChangeView(item.studyView)}
                      className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/10 active:scale-[0.98]"
                    >
                      <BookOpen size={14} /> Open Study Ground School
                    </button>
                    <button
                      onClick={() => onChangeView(View.QUESTION_BANK)}
                      className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
                    >
                      <HelpCircle size={14} /> Practice Exams
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default EgyptAirDashboard;
