import React, { useState } from 'react';
import { 
   UserCheck, HeartPulse, Clock, Calendar, Search, 
   Briefcase, Info, TreeDeciduous, ShieldCheck, 
   AlertTriangle, GraduationCap, Map, BookOpen, 
   CheckCircle2, ChevronRight, XCircle, RefreshCw, 
   Eye, Ear, Activity, Stethoscope, AlertCircle 
} from 'lucide-react';

const SyllabusBadge = ({ lo }: { lo?: string }) => (
   lo ? (
      <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 bg-slate-950/80 backdrop-blur-md rounded-full border border-white/10 group-hover:border-emerald-500/50 transition-all">
         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
         <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">LO {lo}</span>
      </div>
   ) : null
);

const PersonnelLicensing: React.FC = () => {
   const [activeTab, setActiveTab] = useState<'medicals' | 'fitness' | 'privileges' | 'ratings' | 'definitions' | 'general' | 'structure'>('medicals');
   const [selectedLicense, setSelectedLicense] = useState('PPL');
   const [selectedMed, setSelectedMed] = useState('Class 1');
   const [searchTerm, setSearchTerm] = useState('');
   const [syllabusMode, setSyllabusMode] = useState(false);
   const [quizActive, setQuizActive] = useState(false);
   const [currentQuestion, setCurrentQuestion] = useState(0);
   const [score, setScore] = useState(0);
   const [showResults, setShowResults] = useState(false);

   const definitions = [
      { term: 'Category', def: 'Aeroplane, helicopter, sailplane, etc.', lo: '010.04.02.01.01', cat: 'Operations' },
      { term: 'Class', def: 'Single-engine, multi-engine, land, sea, etc.', lo: '010.04.02.01.01', cat: 'Operations' },
      { term: 'Type', def: 'Specific model (e.g., A320, B737) requiring specific training.', lo: '010.04.02.01.01', cat: 'Operations' },
      { term: 'Rating', def: 'An authorization entered on or associated with a license.', lo: '010.04.02.01.02', cat: 'Operations' },
      { term: 'SPIC', def: 'Student Pilot-in-Command. Student acting as PIC with instructor supervision.', lo: '010.04.02.01.01', cat: 'Operations' },
      { term: 'Flight Time', def: 'Total time from when an aircraft first moves for taking off until it finally comes to rest.', lo: '010.04.02.01.01', cat: 'Operations' },
      { term: 'Flight Time (Heli)', def: 'Total time from when the rotors start turning until the helicopter stops and rotors are stopped.', lo: '010.04.02.01.01', cat: 'Operations' },
      { term: 'Night', def: 'The period between the end of evening civil twilight and the beginning of morning civil twilight.', lo: '010.04.02.01.01', cat: 'Operations' },
      { term: 'Skill Test', def: 'Demonstration of skill for license/rating issue, including oral examination.', lo: '010.04.02.01.01', cat: 'Operations' },
      { term: 'Proficiency Check', def: 'Demonstration of skill to revalidate or renew ratings.', lo: '010.04.02.01.01', cat: 'Operations' },
      { term: 'Cross-country', def: 'A flight between a point of departure and arrival following a pre-planned route.', lo: '010.04.02.01.01', cat: 'Operations' },
      { term: 'Dual', def: 'Flight instruction time receiving instruction from an authorized flight instructor.', lo: '010.04.02.01.01', cat: 'Operations' },
      { term: 'Instrument Time', def: 'Instrument flight time or instrument ground time.', lo: '010.04.02.01.01', cat: 'Operations' },
      { term: 'Instrument Flight Time', def: 'Time operating an aircraft solely by reference to instruments.', lo: '010.04.02.01.01', cat: 'Operations' },
      { term: 'Instrument Ground Time', def: 'Time receiving instruction in simulated instrument flight in an FSTD.', lo: '010.04.02.01.01', cat: 'Operations' },
      { term: 'Private Pilot', def: 'A pilot holding a license prohibiting CAT for remuneration.', lo: '010.04.02.01.01', cat: 'Operations' },
      { term: 'Renewal', def: 'The administrative action taken after a rating or certificate has lapsed.', lo: '010.04.02.01.01', cat: 'Operations' },
      { term: 'Revalidation', def: 'Action taken within validity allowing continued exercise of privileges.', lo: '010.04.02.01.01', cat: 'Operations' },
      { term: 'Solo', def: 'Flight time during which a student pilot is the sole occupant of an aircraft.', lo: '010.04.02.01.01', cat: 'Operations' },
      { term: 'MCC', def: 'Multi-Crew Cooperation. Team functioning led by the PIC.', lo: '010.04.02.01.02', cat: 'Operations' },
      { term: 'Multi-pilot Aircraft', def: 'Aircraft required to be operated with a co-pilot by AFM or Regulation.', lo: '010.04.02.01.02', cat: 'Operations' },
      { term: 'Co-pilot', def: 'Pilot operating other than as PIC on an aircraft requiring more than one pilot.', lo: '010.04.02.01.01', cat: 'Operations' },
      { term: 'FSTD', def: 'Flight Simulation Training Device. Full flight simulators, flight training devices, etc.', lo: '010.04.02.01.01', cat: 'Operations' },
      { term: 'Route Sector', def: 'A flight comprising take-off, departure, en-route, arrival and landing.', lo: '010.04.02.01.01', cat: 'Operations' }
   ];


   const medicalDefinitions = [
      { term: 'Medical Assessment', def: 'Evidence issued by Licensing Authority meeting specific medical requirements.', lo: '010.04.03.01.01', cat: 'Medical' },
      { term: 'Medical Assessor', def: 'A physician evaluating medical reports submitted to the Licensing Authority.', lo: '010.04.03.01.01', cat: 'Medical' },
      { term: 'AME', def: 'Aero-medical Examiner. Physician with aviation medicine training.', lo: '010.04.03.01.01', cat: 'Medical' },
      { term: 'AeMC', def: 'Aero-medical Centre. Approved organization to issue medical certificates.', lo: '010.04.03.01.01', cat: 'Medical' },
      { term: 'Decrease in Fitness', def: 'Any condition impeding the safe exercise of privileges.', lo: '010.04.03.01.04', cat: 'Medical' },
      { term: 'GMP', def: 'General Medical Practitioner. May issue LAPL certificates in some states.', lo: '010.04.03.01.01', cat: 'Medical' },
      { term: 'Limitation', def: 'A condition placed on a medical certificate (e.g., VDL, OML).', lo: '010.04.03.02.01', cat: 'Medical' }
   ];


   const medicalClasses = {
      'Class 1': {
         title: 'Class 1 Medical',
         license: 'CPL, MPL, ATPL',
         validity: '12 Months (Age <40)',
         v40: '12 Months (Multi-pilot CAT) / 6 Months (Single-pilot CAT)',
         v60: '6 Months (All operations)',
         revalidation: 'Within 45 days before expiry. Extends from current expiry date.',
         lo: '010.04.03.01.03'
      },
      'Class 2': {
         title: 'Class 2 Medical',
         license: 'PPL, SPL, BPL',
         validity: '60 Months (Age <40)',
         v40: '24 Months (Age 40-49)',
         v50: '12 Months (Age 50+)',
         v60: '12 Months',
         revalidation: 'Within 45 days before expiry.',
         lo: '010.04.03.01.02'
      },
      'LAPL': {
         title: 'LAPL Medical',
         license: 'LAPL only',
         validity: '60 Months (Age <40)',
         v40: '24 Months (Age 40+)',
         v60: '24 Months',
         revalidation: 'Within 45 days before expiry.',
         lo: '010.04.03.01.02'
      }
   };

   const licenseData = {
      'PPL': {
         privileges: 'Act without remuneration as PIC or co-pilot on aeroplanes or TMGs engaged in non-commercial operations.',
         requirements: '45h Total (25h Dual, 10h Solo, 5h X-country).',
         age: 17,
         lo: '010.04.02.02.02'
      },
      'CPL': {
         privileges: 'Act as PIC in single-pilot commercial air transport; Act as co-pilot in any CAT; Exercise all PPL privileges.',
         requirements: '200h Total (100h PIC, 20h X-country, 10h Instrument). Class 1 Medical required.',
         age: 18,
         lo: '010.04.02.03.02'
      },
      'ATPL': {
         privileges: 'Act as PIC or co-pilot in aeroplanes engaged in commercial air transport; Exercise all PPL & CPL privileges.',
         requirements: '1500h Total (500h Multi-pilot, 250h PIC, 200h X-country, 75h Instrument). Class 1 Medical required.',
         age: 21,
         lo: '010.04.02.04.02'
      },
      'MPL': {
         privileges: 'Act as co-pilot in aeroplanes required to be operated with a co-pilot (Multi-pilot operations).',
         requirements: '240h Training (Competency-based). Must hold a valid Class 1 medical.',
         age: 18,
         lo: '010.04.02.04.04'
      },
      'LAPL': {
         privileges: 'Act as PIC on single-engine piston aeroplanes or TMG with MTOM of 2000kg or less, carrying max 3 passengers.',
         requirements: '30h Training (20h Dual, 10h Solo). LAPL medical required.',
         age: 17,
         lo: '010.04.02.02.02'
      }
   };

   const ratingsData = [
      { title: 'SEP (Land)', type: 'Class', validity: '2 Years', reval: '12h in last 12 months (incl. 6h PIC & 1h with FI) OR Proficiency Check.', privileges: 'Single-engine piston aeroplanes (land).', lo: '010.04.02.05.01' },
      { title: 'MEP (Land)', type: 'Class', validity: '1 Year', reval: 'Proficiency Check in last 3 months of validity.', privileges: 'Multi-engine piston aeroplanes (land).', lo: '010.04.02.05.01' },
      { title: 'Instrument Rating (IR)', type: 'Additional', validity: '1 Year', reval: 'Proficiency Check (can be combined with Class/Type check). Includes BIR, CB-IR.', privileges: 'Fly under IFR with a minimum ceiling of 200ft.', lo: '010.04.02.05.03' },
      { title: 'Type Rating', type: 'Type', validity: '1 Year', reval: 'Proficiency Check in last 3 months of validity.', privileges: 'Specific aircraft type (e.g. B737, A320).', lo: '010.04.02.05.02' }
   ];

   const fitnessData = [
      { 
         title: 'Decrease in Fitness', 
         text: 'Holders shall not exercise privileges if they are aware of any decrease in medical fitness. Notification must be made without undue delay.', 
         trigger: 'Hospital admission, surgical operation, significant injury (>21 days), regular medication, or corrective lenses (VDL).',
         lo: '010.04.03.01.04' 
      },
      { 
         title: 'Pregnancy', 
         text: 'Medical certificate shall be suspended upon awareness of pregnancy. Re-validation requires assessment after recovery or delivery.', 
         trigger: 'Multi-pilot limitation (OML) may be applied in some cases during pregnancy.',
         lo: '010.04.03.01.04' 
      }
   ];

   const psychoactiveData = {
      definition: 'Alcohol, opioids, cannabinoids, sedatives, hypnotics, cocaine, psychostimulants, hallucinogens, volatile solvents.',
      regulation: 'Holders shall not exercise privileges while under the influence of any psychoactive substance that renders them unable to function safely.',
      lo: '010.04.03.02.01'
   };

   const recentExperienceData = [
      { title: 'Passenger Carrying (90 Days)', text: '3 take-offs and 3 landings in the last 90 days on the same type or class.', lo: '010.04.02.02.05' },
      { title: 'Night (Passengers)', text: 'At least 1 of the 3 take-offs/landings must be at night (unless holding an IR).', lo: '010.04.02.02.05' },
      { title: 'Single Pilot CAT', text: 'Age 60-64: Only multi-pilot operations allowed for CAT.', lo: '010.04.02.02.05' }
   ];

   const comparisonData = [
      { feature: 'Primary Source', icao: 'Annex 1 - Personnel Licensing', easa: 'Regulation (EU) No 1178/2011', note: 'EASA implements ICAO SARPs.' },
      { feature: 'Structure', icao: 'Chapters (1-6)', easa: 'Annexes (Part-FCL, MED, ARA, ORA)', note: 'EASA structure is more modular.' },
      { feature: 'Licensing Authority', icao: 'Contracting State', easa: 'Competent Authority (NAA)', note: 'EASA provides mutual recognition.' },
      { feature: 'Medical Standards', icao: 'Classes 1, 2, 3', easa: 'Classes 1, 2, LAPL', note: 'LAPL is a specific EU-level medical.' },
      { feature: 'Language Proficiency', icao: 'Level 4 Minimum (Operational)', easa: 'Levels 4, 5, 6 (Expert)', note: 'Strict EASA validity for LPE.' }
   ];

   const architectureTree = {
      name: "Aircrew Regulation",
      children: [
         { name: "Annex I (Part-FCL)", desc: "Flight Crew Licensing", lo: "010.04.02.02.01" },
         { name: "Annex IV (Part-MED)", desc: "Medical Requirements", lo: "010.04.03.01.01" },
         { name: "Annex VI (Part-ARA)", desc: "Authority Requirements", lo: "010.04.02.02.01" },
         { name: "Annex VII (Part-ORA)", desc: "Organization Requirements", lo: "010.04.02.02.01" }
      ]
   };


   const quizQuestions = [
      {
         question: "What is the minimum age for the issue of a CPL(A)?",
         options: ["17 years", "18 years", "21 years", "16 years"],
         correct: 1,
         lo: "010.04.02.03.01"
      },
      {
         question: "What is the validity of a Class 1 medical for a pilot aged 35 engaged in CAT?",
         options: ["60 months", "24 months", "12 months", "6 months"],
         correct: 2,
         lo: "010.04.03.01.03"
      },
      {
         question: "When should a pilot notify the authority about a significant injury?",
         options: ["Immediately for any injury", "After 7 days of incapacity", "After 21 days of incapacity", "Only if it involves a bone fracture"],
         correct: 2,
         lo: "010.04.03.01.04"
      },
      {
         question: "Definition of 'Psychoactive Substances' includes:",
         options: ["Only illegal drugs", "Alcohol, opioids, and sedatives", "Any prescription medication", "Only substances that cause hallucinations"],
         correct: 1,
         lo: "010.04.03.02.01"
      },
      {
         question: "What is the revalidation window for a medical certificate?",
         options: ["30 days before expiry", "45 days before expiry", "60 days before expiry", "90 days before expiry"],
         correct: 1,
         lo: "010.04.03.01.01"
      },
      {
         question: "What is the definition of 'Night' in Part-FCL?",
         options: ["Sunset to Sunrise", "30 mins after sunset to 30 mins before sunrise", "End of evening civil twilight to beginning of morning civil twilight", "Darkness requiring landing lights"],
         correct: 2,
         lo: "010.04.02.01.01"
      },
      {
         question: "For a PPL(A) holder, what is the 'Recent Experience' requirement for carrying passengers?",
         options: ["12h flight time in 12 months", "3 take-offs and landings in 90 days", "1h with an instructor in 24 months", "Proficiency check every year"],
         correct: 1,
         lo: "010.04.02.02.05"
      },
      {
         question: "A Class 2 medical for a pilot aged 45 is valid for:",
         options: ["60 months", "24 months", "12 months", "6 months"],
         correct: 1,
         lo: "010.04.03.01.02"
      }
   ];

   const tabs = [
      { id: 'structure', label: 'Regulation Structure', icon: <Map size={20} /> },
      { id: 'medicals', label: 'Medical Classes', icon: <HeartPulse size={20} /> },
      { id: 'fitness', label: 'Fitness & Substances', icon: <Activity size={20} /> },
      { id: 'privileges', label: 'Licenses', icon: <UserCheck size={20} /> },
      { id: 'ratings', label: 'Ratings', icon: <Clock size={20} /> },
      { id: 'definitions', label: 'Definitions', icon: <Search size={20} /> },
      { id: 'general', label: 'General Rules', icon: <ShieldCheck size={20} /> }
   ];

   const handleQuizAnswer = (index: number) => {
      if (index === quizQuestions[currentQuestion].correct) {
         setScore(score + 1);
      }
      if (currentQuestion + 1 < quizQuestions.length) {
         setCurrentQuestion(currentQuestion + 1);
      } else {
         setShowResults(true);
      }
   };

   const resetQuiz = () => {
      setQuizActive(false);
      setCurrentQuestion(0);
      setScore(0);
      setShowResults(false);
   };

   return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
         {/* Premium Header */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 animate-in fade-in slide-in-from-top-8 duration-1000">
            <div className="flex items-center gap-6">
               <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 animate-pulse" />
                  <div className="relative w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl overflow-hidden group">
                     <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                     <UserCheck className="text-emerald-500 group-hover:scale-110 transition-transform" size={32} />
                  </div>
               </div>
               <div>
                  <h1 className="text-4xl font-black text-white tracking-tight mb-1">
                     Personnel Licensing
                  </h1>
                  <p className="text-slate-500 font-medium flex items-center gap-2">
                     <ShieldCheck size={14} className="text-emerald-500" />
                     EASA Part-FCL & Part-MED Regulatory Explorer
                  </p>
               </div>
            </div>

            <div className="flex items-center gap-4">
               <button
                  onClick={() => setSyllabusMode(!syllabusMode)}
                  className={`group flex items-center gap-3 px-5 py-2.5 rounded-2xl border transition-all duration-300 ${
                     syllabusMode 
                     ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
                     : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-800'
                  }`}
               >
                  <GraduationCap className={syllabusMode ? 'animate-bounce' : ''} size={20} />
                  <div className="text-left">
                     <p className="text-[10px] uppercase tracking-widest font-bold opacity-60">Syllabus Mode</p>
                     <p className="text-sm font-bold">{syllabusMode ? 'Enabled' : 'Disabled'}</p>
                  </div>
                  <div className={`w-10 h-5 rounded-full relative transition-colors duration-500 ${syllabusMode ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                     <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 shadow-sm ${syllabusMode ? 'left-6' : 'left-1'}`} />
                  </div>
               </button>

               <button
                  onClick={() => setQuizActive(true)}
                  className="flex items-center gap-3 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl shadow-xl shadow-emerald-900/40 transition-all active:scale-95 font-bold"
               >
                  <BookOpen size={18} />
                  Start Quiz
               </button>
            </div>
         </div>

         {/* Premium Tab Bar */}
         <div className="flex items-center gap-2 p-2 bg-slate-900/50 backdrop-blur-xl rounded-[2rem] border border-white/5 mb-10 overflow-x-auto no-scrollbar">
            {tabs.map(tab => (
               <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-6 py-3.5 rounded-[1.5rem] font-bold transition-all duration-500 whitespace-nowrap ${
                     activeTab === tab.id 
                     ? 'bg-emerald-500 text-slate-950 shadow-2xl shadow-emerald-500/20 scale-105' 
                     : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
               >
                  {tab.icon}
                  {tab.label}
               </button>
            ))}
         </div>

         {/* Content Area */}
         {activeTab === 'structure' ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
               {/* Visual Architecture Tree */}
               <div className="bg-slate-900/40 backdrop-blur-md p-10 rounded-[3rem] border border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                     <TreeDeciduous size={180} />
                  </div>
                  
                  <div className="relative z-10 text-center mb-12">
                     <h3 className="text-2xl font-black text-white mb-2">Part-FCL Architecture</h3>
                     <p className="text-slate-500 text-sm font-medium">The modular structure of the Aircrew Regulation</p>
                  </div>

                  <div className="relative z-10 flex flex-col items-center">
                     {/* Root Node */}
                     <div className="bg-emerald-500 text-slate-950 px-8 py-4 rounded-2xl font-black text-lg shadow-2xl shadow-emerald-500/20 mb-12 relative">
                        {architectureTree.name}
                        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-px h-12 bg-emerald-500/50" />
                     </div>

                     {/* Children Nodes */}
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full relative">
                        <div className="absolute -top-6 left-0 right-0 h-px bg-emerald-500/50 hidden md:block" />
                        {architectureTree.children.map((child, i) => (
                           <div key={i} className="relative pt-6">
                              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-6 bg-emerald-500/50 hidden md:block" />
                              <div className="bg-slate-950 border border-white/5 p-5 rounded-3xl group/node hover:border-emerald-500/30 transition-all text-center h-full flex flex-col items-center justify-center">
                                 <h4 className="text-emerald-400 font-bold text-sm mb-1">{child.name}</h4>
                                 <p className="text-slate-500 text-[10px] leading-tight font-medium">{child.desc}</p>
                                 <div className="mt-3 px-2 py-0.5 bg-emerald-500/10 rounded text-[8px] font-black text-emerald-500 opacity-0 group-hover/node:opacity-100 transition-opacity uppercase tracking-tighter">
                                    LO {child.lo}
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               {/* ICAO vs EASA Comparison Table */}
               <div className="bg-slate-900/40 backdrop-blur-md p-10 rounded-[3rem] border border-white/5">
                  <div className="flex items-center gap-4 mb-10">
                     <div className="p-3 bg-sky-500/20 rounded-2xl text-sky-400">
                        <Search size={24} />
                     </div>
                     <div>
                        <h3 className="text-2xl font-black text-white">ICAO Annex 1 vs. EASA Regulation</h3>
                        <p className="text-slate-500 text-sm font-medium">Comparing international standards with European implementation</p>
                     </div>
                  </div>

                  <div className="overflow-x-auto">
                     <table className="w-full text-left border-separate border-spacing-y-3">
                        <thead>
                           <tr>
                              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Regulatory Feature</th>
                              <th className="px-6 py-4 text-[10px] font-black text-sky-400 uppercase tracking-widest bg-sky-500/5 rounded-l-2xl">ICAO Annex 1</th>
                              <th className="px-6 py-4 text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/5 rounded-r-2xl">EASA (Part-FCL/MED)</th>
                           </tr>
                        </thead>
                        <tbody>
                           {comparisonData.map((row, i) => (
                              <tr key={i} className="group">
                                 <td className="px-6 py-5 bg-slate-950/50 rounded-l-2xl border-y border-l border-white/5 group-hover:border-white/10 transition-all">
                                    <p className="text-white font-bold text-sm">{row.feature}</p>
                                    <p className="text-slate-500 text-[10px] mt-1 italic">{row.note}</p>
                                 </td>
                                 <td className="px-6 py-5 bg-sky-500/[0.02] border-y border-white/5 group-hover:border-white/10 transition-all">
                                    <p className="text-slate-300 text-sm font-medium">{row.icao}</p>
                                 </td>
                                 <td className="px-6 py-5 bg-emerald-500/[0.02] rounded-r-2xl border-y border-r border-white/5 group-hover:border-white/10 transition-all">
                                    <p className="text-slate-200 text-sm font-bold">{row.easa}</p>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
                  <div className="mt-8 flex justify-end">
                     <SyllabusBadge lo="010.04.01.01.01" />
                  </div>
               </div>
            </div>
         ) : activeTab === 'medicals' ? (
            <div className="grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="space-y-6">
                  {Object.entries(medicalClasses).map(([key, data]) => (
                     <div 
                        key={key}
                        onClick={() => setSelectedMed(key)}
                        className={`p-8 rounded-[2.5rem] border transition-all duration-500 cursor-pointer group relative overflow-hidden ${
                           selectedMed === key 
                           ? 'bg-slate-900 border-emerald-500/50 shadow-2xl scale-[1.02]' 
                           : 'bg-slate-900/40 border-white/5 hover:border-white/10'
                        }`}
                     >
                        <div className={`absolute top-0 left-0 w-2 h-full ${selectedMed === key ? 'bg-emerald-500' : 'bg-slate-800'}`} />
                        <div className="flex justify-between items-start">
                           <div className="flex items-center gap-4">
                              <div className={`p-4 rounded-2xl transition-colors ${selectedMed === key ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-500'}`}>
                                 <Stethoscope size={28} />
                              </div>
                              <div>
                                 <h3 className="text-xl font-black text-white">{data.title}</h3>
                                 <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">{data.license}</p>
                              </div>
                           </div>
                           <div className="flex flex-col items-end">
                              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Validity (Age &lt; 40)</p>
                              <p className="text-lg font-black text-white">{data.validity}</p>
                           </div>
                        </div>
                        {selectedMed === key && (
                           <div className="mt-8 grid grid-cols-2 gap-4 animate-in slide-in-from-top-4 duration-500">
                               <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Age 40-59</p>
                                  <p className="text-white font-bold">{data.v40}</p>
                               </div>
                               { (data as any).v50 && (
                                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Age 50+</p>
                                     <p className="text-white font-bold">{(data as any).v50}</p>
                                  </div>
                               )}
                               <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Age 60+</p>
                                  <p className="text-white font-bold">{data.v60}</p>
                               </div>
                               <div className="col-span-2 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                                  <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2">Revalidation</p>
                                  <p className="text-white text-xs">{(data as any).revalidation}</p>
                               </div>
                            </div>
                        )}
                        <SyllabusBadge lo={data.lo} />
                     </div>
                  ))}
               </div>

               <div className="space-y-8">
                  <div className="bg-slate-900/40 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                     <h4 className="text-lg font-black text-white flex items-center gap-3">
                        <RefreshCw className="text-emerald-500" /> Revalidation Rules
                     </h4>
                     <div className="space-y-4">
                        <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-950/50 border border-white/5 hover:border-emerald-500/20 transition-all">
                           <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400">
                              <Clock size={20} />
                           </div>
                           <div>
                              <p className="text-white font-bold text-sm">45-Day Window</p>
                              <p className="text-slate-400 text-xs leading-relaxed mt-1">Examinations can be performed up to 45 days prior to expiry without losing days.</p>
                           </div>
                        </div>
                        <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-950/50 border border-white/5 hover:border-sky-500/20 transition-all">
                           <div className="p-2 bg-sky-500/20 rounded-xl text-sky-400">
                              <ShieldCheck size={20} />
                           </div>
                           <div>
                              <p className="text-white font-bold text-sm">Decrease in Fitness</p>
                              <p className="text-slate-400 text-xs leading-relaxed mt-1">Must notify AME if surgery, significant injury (>21 days), or regular medication occurs.</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-500/10">
                     <div className="flex items-center gap-3 text-amber-500 mb-4">
                        <AlertCircle size={24} />
                        <h4 className="font-black text-white">Pregnancy Rules</h4>
                     </div>
                     <p className="text-sm text-slate-400 leading-relaxed font-medium">
                        Suspension of medical certificate during pregnancy. Re-validation requires successful examination after delivery/termination of pregnancy.
                     </p>
                     <SyllabusBadge lo="010.04.02.01.03" />
                  </div>
               </div>
            </div>
         ) : activeTab === 'fitness' ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="grid md:grid-cols-3 gap-6">
                  {fitnessData.map((item, i) => (
                     <div key={i} className="bg-slate-900/40 backdrop-blur-md p-8 rounded-3xl border border-white/5 hover:border-emerald-500/30 transition-all group relative overflow-hidden">
                        <div className="flex items-center gap-4 mb-6">
                           <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400">
                              <Activity size={24} />
                           </div>
                           <h4 className="text-xl font-black text-white">{item.title}</h4>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">{item.text}</p>
                        <div className="p-4 rounded-2xl bg-slate-950/50 border border-white/5">
                           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                              <AlertTriangle size={12} className="text-amber-500" /> Trigger Events
                           </p>
                           <p className="text-white text-xs font-medium">{item.trigger}</p>
                        </div>
                        <SyllabusBadge lo={item.lo} />
                     </div>
                  ))}
               </div>

               <div className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                     <AlertCircle size={120} />
                  </div>
                  <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                     <div className="w-20 h-20 bg-rose-500/20 rounded-3xl flex items-center justify-center text-rose-500 border border-rose-500/20 shadow-2xl">
                        <AlertCircle size={40} />
                     </div>
                     <div className="flex-1">
                        <h3 className="text-2xl font-black text-white mb-2">Psychoactive Substances</h3>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-2xl mb-4">
                           {psychoactiveData.regulation}
                        </p>
                        <div className="flex flex-wrap gap-2">
                           {psychoactiveData.definition.split(', ').map(sub => (
                              <span key={sub} className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-slate-400 border border-white/5 hover:border-rose-500/30 hover:text-rose-400 transition-colors">
                                 {sub}
                              </span>
                           ))}
                        </div>
                     </div>
                     <SyllabusBadge lo={psychoactiveData.lo} />
                  </div>
               </div>
            </div>
         ) : activeTab === 'privileges' ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="grid grid-cols-2 md:grid-cols-5 gap-4 relative">
                  {Object.entries(licenseData).map(([key, data], index) => (
                     <div key={key} className="relative group">
                        {index < 4 && (
                           <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-slate-800 z-0" />
                        )}
                        <button
                           onClick={() => setSelectedLicense(key)}
                           className={`w-full relative z-10 p-6 rounded-3xl border transition-all duration-500 text-center ${
                              selectedLicense === key 
                              ? 'bg-emerald-500/10 border-emerald-500 shadow-2xl shadow-emerald-500/10 scale-105' 
                              : 'bg-slate-900 border-white/5 text-slate-500 hover:border-white/10'
                           }`}
                        >
                           <GraduationCap className={`mx-auto mb-3 transition-transform duration-500 ${selectedLicense === key ? 'scale-110 text-emerald-400' : ''}`} size={32} />
                           <h4 className={`font-black text-xl mb-1 ${selectedLicense === key ? 'text-white' : ''}`}>{key}</h4>
                           <p className="text-[10px] uppercase font-bold tracking-widest">{data.age}+ Years</p>
                        </button>
                     </div>
                  ))}
               </div>

               <div className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl animate-in zoom-in-95 duration-500">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                     <div className="flex-1 space-y-6">
                        <div className="flex items-center gap-4">
                           <div className="p-3 bg-emerald-500/20 rounded-2xl">
                              <ShieldCheck className="text-emerald-400" size={24} />
                           </div>
                           <div>
                              <h3 className="text-2xl font-black text-white">{selectedLicense} Privileges</h3>
                              <p className="text-slate-500 text-sm font-medium">According to Part-FCL requirements</p>
                           </div>
                           <SyllabusBadge lo={licenseData[selectedLicense as keyof typeof licenseData].lo} />
                        </div>
                        
                        <div className="p-6 rounded-2xl bg-slate-950/50 border border-white/5">
                           <p className="text-slate-300 leading-relaxed italic">
                              "{licenseData[selectedLicense as keyof typeof licenseData].privileges}"
                           </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                           <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Required Training</p>
                              <div className="flex items-center gap-3">
                                 <Clock className="text-emerald-500" size={18} />
                                 <p className="text-white font-medium">{licenseData[selectedLicense as keyof typeof licenseData].requirements}</p>
                              </div>
                           </div>
                           <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Minimum Age</p>
                              <div className="flex items-center gap-3">
                                 <Calendar className="text-sky-500" size={18} />
                                 <p className="text-white font-medium">{licenseData[selectedLicense as keyof typeof licenseData].age} Years Old</p>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="w-full md:w-80 space-y-4">
                        <div className="p-6 rounded-3xl bg-slate-950 border border-white/5">
                           <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Prerequisites</h4>
                           <div className="space-y-3">
                              {selectedLicense === 'ATPL' ? (
                                 ['Hold a CPL(A)', 'Hold a Multi-Engine IR', 'MCC Training Course', 'Advanced UPRT'].map((p, i) => (
                                    <div key={i} className="flex items-center gap-3 text-xs text-slate-400 bg-white/5 p-2 rounded-lg">
                                       <CheckCircle2 size={12} className="text-emerald-500" />
                                       {p}
                                    </div>
                                 ))
                              ) : (
                                 <p className="text-xs text-slate-500 italic">No specific advanced prerequisites beyond medical class.</p>
                              )}
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         ) : activeTab === 'ratings' ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="grid md:grid-cols-2 gap-6">
                  {ratingsData.map((rating, i) => (
                     <div key={i} className="bg-slate-900/40 backdrop-blur-md p-8 rounded-3xl border border-white/5 hover:border-emerald-500/30 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                           <Activity size={80} />
                        </div>
                        
                        <div className="flex justify-between items-start mb-6">
                           <div>
                              <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                                 rating.type === 'Class' ? 'bg-sky-500/20 text-sky-400' : 
                                 rating.type === 'Type' ? 'bg-amber-500/20 text-amber-400' : 
                                 'bg-emerald-500/20 text-emerald-400'
                              }`}>
                                 {rating.type} Rating
                              </span>
                              <h4 className="text-2xl font-black text-white mt-3 tracking-tight">{rating.title}</h4>
                           </div>
                           <div className="text-right">
                              <p className="text-[10px] text-slate-500 uppercase font-black tracking-tighter">Validity</p>
                              <p className="text-lg font-black text-emerald-400">{rating.validity}</p>
                           </div>
                        </div>

                        <div className="space-y-4">
                           <div className="p-4 rounded-2xl bg-slate-950/50 border border-white/5">
                              <p className="text-[10px] text-slate-500 uppercase font-bold mb-2 flex items-center gap-2">
                                 <RefreshCw size={12} /> Revalidation
                              </p>
                              <p className="text-sm text-slate-300 leading-relaxed">{rating.reval}</p>
                           </div>
                           <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                              <p className="text-[10px] text-emerald-500 uppercase font-bold mb-2 flex items-center gap-2">
                                 <ShieldCheck size={12} /> Privileges
                              </p>
                              <p className="text-sm text-slate-200 font-medium">{rating.privileges}</p>
                           </div>
                        </div>
                        <SyllabusBadge lo={rating.lo} />
                     </div>
                  ))}
               </div>
            </div>
         ) : activeTab === 'definitions' ? (
            <div className="animate-in slide-in-from-bottom-4 duration-700">
               <div className="flex flex-col md:flex-row gap-6 mb-8">
                  <div className="relative flex-1 group">
                     <div className="absolute inset-0 bg-emerald-500/20 blur-3xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                     <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
                     <input
                        type="text"
                        placeholder="Search Part-FCL & Part-MED definitions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all text-lg font-medium shadow-2xl"
                     />
                  </div>
                  <div className="flex items-center gap-2 p-1.5 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/5">
                     {['All', 'Operations', 'Medical'].map(cat => (
                        <button
                           key={cat}
                           onClick={() => setSelectedLicense(cat)} // Reusing selectedLicense for category filtering in this tab
                           className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                              (cat === 'All' && selectedLicense === 'All') || (cat === 'Operations' && selectedLicense === 'Operations') || (cat === 'Medical' && selectedLicense === 'Medical')
                              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                              : 'text-slate-400 hover:text-white'
                           }`}
                        >
                           {cat}
                        </button>
                     ))}
                  </div>
               </div>

               <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[700px] overflow-y-auto pr-4 custom-scrollbar p-1">
                  {[...definitions, ...medicalDefinitions]
                     .filter(d => 
                        (selectedLicense === 'All' || d.cat === selectedLicense) &&
                        (d.term.toLowerCase().includes(searchTerm.toLowerCase()) || d.def.toLowerCase().includes(searchTerm.toLowerCase()))
                     )
                     .map((d, i) => (
                        <div 
                           key={i} 
                           className={`group relative bg-slate-900/40 backdrop-blur-md p-8 rounded-[2rem] border transition-all duration-500 hover:-translate-y-2 overflow-hidden ${
                              d.cat === 'Medical' 
                              ? 'hover:border-rose-500/30 hover:shadow-[0_20px_40px_-15px_rgba(244,63,94,0.1)]' 
                              : 'hover:border-sky-500/30 hover:shadow-[0_20px_40px_-15px_rgba(14,165,233,0.1)]'
                           }`}
                        >
                           {/* Category HSL Glow */}
                           <div className={`absolute -top-10 -right-10 w-32 h-32 blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 ${
                              d.cat === 'Medical' ? 'bg-rose-500' : 'bg-sky-500'
                           }`} />

                           <div className="flex justify-between items-start mb-6">
                              <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${
                                 d.cat === 'Medical' ? 'bg-rose-500/10 text-rose-500' : 'bg-sky-500/10 text-sky-500'
                              }`}>
                                 {d.cat}
                              </span>
                              <div className="text-slate-700 font-black text-[10px] group-hover:text-slate-500 transition-colors">#{i + 1}</div>
                           </div>

                           <h4 className="text-xl font-black text-white mb-3 tracking-tight group-hover:text-emerald-400 transition-colors">{d.term}</h4>
                           <p className="text-slate-400 text-sm leading-relaxed font-medium mb-6 line-clamp-3 group-hover:line-clamp-none transition-all">
                              {d.def}
                           </p>

                           <div className="flex justify-between items-center pt-6 border-t border-white/5">
                              <div className="flex items-center gap-2">
                                 <div className={`w-1.5 h-1.5 rounded-full ${d.cat === 'Medical' ? 'bg-rose-500' : 'bg-sky-500'}`} />
                                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">LO {d.lo}</span>
                              </div>
                              <Info size={14} className="text-slate-700 group-hover:text-emerald-500 transition-colors" />
                           </div>
                        </div>
                     ))}
               </div>
            </div>

         ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-slate-900/40 backdrop-blur-md p-8 rounded-3xl border border-white/5 space-y-8">
                     <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        <ShieldCheck className="text-sky-500" /> General Principles
                     </h3>
                     <div className="space-y-4">
                        {[
                           { title: "Competent Authority", text: "The authority in the Member State where you apply for the license or medical certificate issuance.", lo: "010.04.02.02.06" },
                           { title: "ICAO Compliance", text: "EASA Part-FCL is based on ICAO Annex 1. EASA licenses are generally valid globally for EASA-registered aircraft.", lo: "010.04.01.01.01" },
                           { title: "Two-Factor Privileges", text: "A pilot must hold BOTH a valid license/rating AND a valid medical certificate matching the operation.", lo: "010.04.02.02.03" },
                           { title: "Language Proficiency", text: "Endorsement required for English and/or the language of communication. Levels 4, 5, or 6 (Expert).", lo: "010.04.02.02.04" }
                        ].map((p, i) => (
                           <div key={i} className="p-6 rounded-2xl bg-slate-950/50 border border-white/5 hover:border-white/10 transition-all">
                              <div className="flex justify-between items-start mb-2">
                                 <h4 className="text-white font-bold text-sm">{p.title}</h4>
                                 <span className="text-[10px] font-black text-slate-500">LO {p.lo}</span>
                              </div>
                              <p className="text-slate-400 text-sm leading-relaxed">{p.text}</p>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-8">
                     <div className="bg-slate-900/40 backdrop-blur-md p-8 rounded-3xl border border-white/5">
                        <h4 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                           <Briefcase className="text-emerald-500" /> Mandatory Documents
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           {[
                              "Valid License", "Valid Medical", "ID (Passport/DL)", 
                              "Logbook (Current)", "Language Endorsement", "Radio License"
                           ].map(doc => (
                              <div key={doc} className="flex items-center gap-4 bg-slate-950/50 p-4 rounded-2xl border border-white/5 group hover:bg-emerald-500/5 hover:border-emerald-500/20 transition-all">
                                 <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-pulse" />
                                 <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{doc}</span>
                              </div>
                           ))}
                        </div>
                        <div className="mt-8 p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                           <p className="text-xs text-amber-300 leading-relaxed font-medium italic">
                              "Failure to present documentation may lead to immediate suspension of privileges during a ramp inspection (SAFA)."
                           </p>
                        </div>
                        <SyllabusBadge lo="010.04.02.02.07" />
                     </div>

                     <div className="bg-slate-900/40 backdrop-blur-md p-8 rounded-3xl border border-white/5 space-y-6">
                        <h4 className="text-xl font-bold text-white flex items-center gap-3">
                           <RefreshCw className="text-emerald-500" /> Recent Experience
                        </h4>
                        <div className="space-y-4">
                           {recentExperienceData.map((item, i) => (
                              <div key={i} className="p-4 rounded-2xl bg-slate-950/50 border border-white/5">
                                 <div className="flex justify-between items-center mb-2">
                                    <p className="text-white font-bold text-sm">{item.title}</p>
                                    <span className="text-[10px] font-black text-slate-500">LO {item.lo}</span>
                                 </div>
                                 <p className="text-slate-400 text-xs">{item.text}</p>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>

               <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-sky-500/5 to-indigo-500/5 border border-sky-500/10 flex flex-col md:flex-row items-center gap-8">
                  <div className="w-20 h-20 bg-sky-500/20 rounded-3xl flex items-center justify-center text-sky-500 border border-sky-500/20 shadow-2xl">
                     <AlertCircle size={40} />
                  </div>
                  <div className="flex-1">
                     <h3 className="text-2xl font-black text-white mb-2">Age 65 Limit</h3>
                     <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
                        A license holder shall not act as PIC or co-pilot in commercial air transport if they have reached the age of 65. Between 60 and 64, they may only act as PIC in CAT if they are part of a multi-pilot crew.
                     </p>
                  </div>
                  <SyllabusBadge lo="010.04.02.02.05" />
               </div>
            </div>
         )}

         {/* Knowledge Quiz Footer Card */}
         <div className="mt-16 p-10 rounded-[3rem] bg-gradient-to-br from-emerald-600/10 via-slate-900/50 to-teal-600/10 border border-emerald-500/20 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0%,transparent_70%)] group-hover:scale-150 transition-transform duration-1000" />
            <div className="relative z-10">
               <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-500 ring-1 ring-emerald-500/50">
                  <BookOpen size={32} />
               </div>
               <h3 className="text-3xl font-black text-white mb-4">Ready for the Examination?</h3>
               <p className="text-slate-400 mb-10 max-w-xl mx-auto text-lg">Test your understanding of EASA licensing regulations with our curated question bank.</p>
               <button 
                  onClick={() => setQuizActive(true)}
                  className="px-12 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl transition-all shadow-2xl shadow-emerald-500/20 active:scale-95 text-lg"
               >
                  Start Assessment
               </button>
            </div>
         </div>

         {/* Quiz Modal */}
         {quizActive && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
               <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-500" onClick={resetQuiz} />
               <div className="bg-slate-900 border border-white/10 w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-500">
                  {!showResults ? (
                     <div className="p-10">
                        <div className="flex justify-between items-center mb-10">
                           <div>
                              <h3 className="text-2xl font-black text-white tracking-tight">Personnel Licensing Quiz</h3>
                              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Question {currentQuestion + 1} of {quizQuestions.length}</p>
                           </div>
                           <button onClick={resetQuiz} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 transition-all">
                              <XCircle size={24} />
                           </button>
                        </div>

                        <div className="mb-12">
                           <h4 className="text-xl font-bold text-slate-100 leading-snug mb-4">{quizQuestions[currentQuestion].question}</h4>
                           <SyllabusBadge lo={quizQuestions[currentQuestion].lo} />
                        </div>

                        <div className="space-y-4">
                           {quizQuestions[currentQuestion].options.map((opt, i) => (
                              <button
                                 key={i}
                                 onClick={() => handleQuizAnswer(i)}
                                 className="w-full text-left p-6 rounded-3xl bg-slate-950/50 border border-white/5 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group flex items-center justify-between"
                              >
                                 <span className="text-slate-300 font-medium group-hover:text-white transition-colors">{opt}</span>
                                 <ChevronRight size={20} className="text-slate-700 group-hover:text-emerald-500 transition-colors translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                              </button>
                           ))}
                        </div>
                        
                        <div className="mt-12 h-2 w-full bg-slate-800 rounded-full overflow-hidden p-0.5">
                           <div 
                              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(16,185,129,0.4)]" 
                              style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                           />
                        </div>
                     </div>
                  ) : (
                     <div className="p-12 text-center">
                        <div className="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-12 shadow-2xl shadow-emerald-500/10 border border-emerald-500/20">
                           <CheckCircle2 size={56} />
                        </div>
                        <h3 className="text-4xl font-black text-white mb-2">Assessment Complete</h3>
                        <p className="text-slate-400 mb-10 text-lg">Your regulatory knowledge score</p>
                        
                        <div className="grid grid-cols-2 gap-6 mb-12">
                           <div className="bg-slate-950/50 p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
                              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Accuracy</p>
                              <p className="text-4xl font-black text-white">{Math.round((score / quizQuestions.length) * 100)}%</p>
                           </div>
                           <div className="bg-slate-950/50 p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
                              <div className={`absolute top-0 left-0 w-full h-1 ${score === quizQuestions.length ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Status</p>
                              <p className={`text-4xl font-black ${score === quizQuestions.length ? 'text-emerald-500' : 'text-amber-500'}`}>
                                 {score === quizQuestions.length ? 'Master' : 'Student'}
                              </p>
                           </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                           <button 
                              onClick={resetQuiz}
                              className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
                           >
                              <RefreshCw size={20} />
                              Retake Quiz
                           </button>
                           <button 
                              onClick={resetQuiz}
                              className="flex-1 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-2xl transition-all active:scale-95"
                           >
                              Review Syllabus
                           </button>
                        </div>
                     </div>
                  )}
               </div>
            </div>
         )}
      </div>
   );
};

export default PersonnelLicensing;