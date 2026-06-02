import React, { useState } from 'react';
import { View } from '../../types';
import { 
  ArrowLeft, Shield, CheckCircle, XCircle, Info, ChevronRight, Award, RotateCcw, HelpCircle, FileText
} from 'lucide-react';

interface Props {
  onChangeView: (view: View) => void;
}

interface Question {
  id: number;
  text: string;
  options: string[];
  correctIdx: number;
  explanation: string;
}

const quizQuestions: Question[] = [
  {
    id: 1,
    text: "Under ECAR Part 121, which manual outlines the general operational guidelines, flight safety standards, and crew administration policies for EgyptAir?",
    options: [
      "Operations Manual Part A (OM-A)",
      "Operations Manual Part B (OM-B)",
      "Operations Manual Part C (OM-C)",
      "Operations Manual Part D (OM-D)"
    ],
    correctIdx: 0,
    explanation: "Operations Manual Part A (OM-A) covers General/Basic policies, organization, safety, and administration across all fleets. OM-B details specific airplane operating manuals; OM-C is routes/charts; OM-D handles training policies."
  },
  {
    id: 2,
    text: "What is the primary operational distinction between a Master Minimum Equipment List (MMEL) and a Minimum Equipment List (MEL)?",
    options: [
      "The MMEL is issued by the manufacturer/authority, whereas the MEL is a customized, more restrictive document approved by ECAA for EgyptAir fleet use.",
      "The MEL is issued by Boeing/Airbus directly, whereas the MMEL is created by EGALPA.",
      "The MMEL is used in-flight, whereas the MEL is strictly used on the ground prior to dispatch.",
      "The MEL can be less restrictive than the MMEL if ECAA grants a special pilot waiver."
    ],
    correctIdx: 0,
    explanation: "The MMEL is established by the manufacturer and approved by the regulatory authority. The operator's MEL is tailored specifically to the operator's routes and configurations, and must be equal to or more restrictive than the MMEL, and is formally approved by the ECAA."
  },
  {
    id: 3,
    text: "Which Egyptian aviation body is responsible for issuance of pilot licenses, validation of foreign crew credentials, and publishing airworthiness directives?",
    options: [
      "EGALPA (Egyptian Air Line Pilots Association)",
      "ECAA (Egyptian Civil Aviation Authority)",
      "EMA (Egyptian Meteorological Authority)",
      "Ministry of Civil Aviation Command"
    ],
    correctIdx: 1,
    explanation: "The Egyptian Civil Aviation Authority (ECAA) is the state regulatory body responsible for license issuance, validations, oversight, and airworthiness directives. EGALPA is a pilots professional association, not a regulatory authority."
  },
  {
    id: 4,
    text: "Under ECAA commercial standards (ECAR 121), which document allows an operator to dispatch an aircraft with specific external parts missing, such as fairings or gear doors?",
    options: [
      "Minimum Equipment List (MEL)",
      "Configuration Deviation List (CDL)",
      "Airworthiness Directive (AD)",
      "Operations Manual Part C (OM-C)"
    ],
    correctIdx: 1,
    explanation: "The Configuration Deviation List (CDL) regulates dispatch with missing external aerodynamic parts (fairings, fairing panels, fairing seals, or landing gear doors). The MEL handles inoperative systems, components, or internal instruments."
  },
  {
    id: 5,
    text: "What is the primary role of the Egyptian Air Line Pilots Association (EGALPA)?",
    options: [
      "Conducting SAFA ramp audit checks and issuing fines on behalf of ECAA.",
      "Representing EgyptAir and commercial pilots, advocating safety standards, and coordinating with international bodies like IFALPA.",
      "Developing and issuing state-level meteorological reports and volcanic ash advisories.",
      "Approving the Dry Operating Mass for EgyptAir fleet aircraft."
    ],
    correctIdx: 1,
    explanation: "EGALPA represents commercial pilots in Egypt, promotes flight safety, and acts as the domestic association connected to international organizations such as IFALPA. It does not carry out regulatory inspections or meteorology roles."
  }
];

export const EgyptAirRegulationsQuiz: React.FC<Props> = ({ onChangeView }) => {
  const [activeTab, setActiveTab] = useState<'STUDY' | 'QUIZ'>('STUDY');
  
  // Quiz State
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleOptionSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
  };

  const handleSubmit = () => {
    if (selectedOpt === null || isAnswered) return;
    setIsAnswered(true);
    if (selectedOpt === quizQuestions[currentIdx].correctIdx) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedOpt(null);
    setIsAnswered(false);
    if (currentIdx + 1 < quizQuestions.length) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setScore(0);
    setShowResult(false);
  };

  const manualDefinitions = [
    {
      title: "OM-A: Operations Manual (General)",
      content: "Contains non-fleet specific operational rules. Admin hierarchy, crew fatigue programs, flight dispatch procedures, security policies, and cold-weather operations directives."
    },
    {
      title: "OM-B: Aircraft Operating Manuals",
      content: "Contains specific airplane technical descriptions, limitations, standard operating procedures (SOPs), normal & non-normal checklists, emergency alerts, and performance data."
    },
    {
      title: "OM-C: Route, Aerodrome & Chart Manuals",
      content: "Contains airway charts, terminal navigation plates (SIDs/STARs), communication frequencies, aerodrome rescue levels, and minimum sector altitudes (MSAs)."
    },
    {
      title: "OM-D: Training Manual",
      content: "Contains training specifications, ground school structures, simulator profiles, check-ride criteria, and cadet progression standards."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 relative overflow-hidden font-sans text-slate-100">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10 space-y-8">
        
        {/* Navigation Header */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => onChangeView(View.EGYPTAIR_DASHBOARD)}
            className="inline-flex items-center px-4 py-2 bg-slate-900/80 hover:bg-slate-800 text-slate-300 rounded-xl border border-white/5 transition-all text-sm active:scale-95"
          >
            <ArrowLeft className="mr-2 w-4 h-4" /> Back to Cadet Portal
          </button>
          
          <div className="flex bg-slate-900 border border-white/5 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('STUDY')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'STUDY' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Study Sheets
            </button>
            <button 
              onClick={() => setActiveTab('QUIZ')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'QUIZ' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              ECAA Prep Quiz
            </button>
          </div>
        </div>

        {/* Content Panel */}
        {activeTab === 'STUDY' ? (
          <div className="space-y-8">
            <div className="glass-card bg-slate-900/40 border border-white/5 rounded-[2rem] p-8 md:p-10 space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3.5 bg-blue-500/10 rounded-2xl text-blue-400 border border-blue-500/20">
                  <Shield size={24} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white">ECAA & ECAR Regulations</h2>
                  <p className="text-slate-400 text-sm">Official cadet reference for Egyptian Civil Aviation directives.</p>
                </div>
              </div>
              
              <div className="border-t border-white/5 my-4"></div>

              {/* Regulatory Framework */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-1.5 h-3 bg-blue-500 rounded-sm"></span> Key Aviation Organizations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-5 bg-slate-900/60 rounded-xl border border-white/5 space-y-2">
                    <h4 className="text-sm font-black text-cyan-400 uppercase tracking-widest">ECAA</h4>
                    <p className="text-xs text-slate-400 leading-relaxed"><strong>Egyptian Civil Aviation Authority</strong>. The national governing body that enforces aviation laws, inspects carriers, registers aircraft, and issues EASA-harmonized flight licenses.</p>
                  </div>
                  <div className="p-5 bg-slate-900/60 rounded-xl border border-white/5 space-y-2">
                    <h4 className="text-sm font-black text-purple-400 uppercase tracking-widest">EGALPA</h4>
                    <p className="text-xs text-slate-400 leading-relaxed"><strong>Egyptian Air Line Pilots Association</strong>. Member association representing Egyptian pilots nationally and internationally, advocating for crew safety and professional support.</p>
                  </div>
                  <div className="p-5 bg-slate-900/60 rounded-xl border border-white/5 space-y-2">
                    <h4 className="text-sm font-black text-blue-400 uppercase tracking-widest">EMA</h4>
                    <p className="text-xs text-slate-400 leading-relaxed"><strong>Egyptian Meteorological Authority</strong>. Sole state provider of aviation weather reports (METAR/TAF/GAMETs) for flights operating within the Cairo FIR.</p>
                  </div>
                </div>
              </div>

              {/* Operations Manual Framework */}
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-1.5 h-3 bg-blue-500 rounded-sm"></span> Operations Manual Structure (ECAR 121)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {manualDefinitions.map((man, idx) => (
                    <div key={idx} className="p-5 bg-slate-900/50 rounded-xl border border-white/5 space-y-2 hover:border-blue-500/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText size={16} className="text-blue-400" />
                        <h4 className="text-white font-bold text-sm">{man.title}</h4>
                      </div>
                      <p className="text-slate-400 text-xs leading-relaxed">{man.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* MEL vs CDL */}
              <div className="p-6 bg-slate-900/80 rounded-2xl border border-white/5 space-y-4">
                <h3 className="text-sm font-black uppercase text-cyan-400 tracking-widest flex items-center gap-2">
                  <Info size={16} /> Dispatch Deviations: MEL vs CDL
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-400">
                  <div className="space-y-2">
                    <strong className="text-white">Minimum Equipment List (MEL):</strong>
                    <p className="leading-relaxed">Governs dispatch with inoperative cockpit systems, internal instruments, valves, or electronic components. Must be customized by EgyptAir and approved by ECAA.</p>
                  </div>
                  <div className="space-y-2">
                    <strong className="text-white">Configuration Deviation List (CDL):</strong>
                    <p className="leading-relaxed">Governs dispatch with missing external aerodynamic structures (such as secondary spoilers, access panels, fairing seals, or gear doors). Prepared by the aircraft manufacturer.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ) : (
          /* Quiz Module */
          <div className="glass-card bg-slate-900/40 border border-white/5 rounded-[2rem] p-8 md:p-10">
            {!showResult ? (
              <div className="space-y-6">
                
                {/* Question Info */}
                <div className="flex items-center justify-between text-xs text-slate-400 border-b border-white/5 pb-4">
                  <span className="font-bold">ECAA Regulation Module</span>
                  <span>Question {currentIdx + 1} of {quizQuestions.length}</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-500 h-full transition-all duration-300"
                    style={{ width: `${((currentIdx + 1) / quizQuestions.length) * 100}%` }}
                  ></div>
                </div>

                {/* Question Text */}
                <h3 className="text-2xl font-bold text-white leading-snug tracking-tight">
                  {quizQuestions[currentIdx].text}
                </h3>

                {/* Options List */}
                <div className="space-y-3 pt-2">
                  {quizQuestions[currentIdx].options.map((opt, oIdx) => {
                    const isSelected = selectedOpt === oIdx;
                    const isCorrect = oIdx === quizQuestions[currentIdx].correctIdx;
                    
                    let cardClass = "border-white/5 bg-slate-900/50 text-slate-300 hover:bg-slate-900 hover:border-slate-700";
                    if (isSelected && !isAnswered) {
                      cardClass = "border-blue-500 bg-blue-500/10 text-white";
                    } else if (isAnswered) {
                      if (isCorrect) {
                        cardClass = "border-green-500 bg-green-500/10 text-white font-medium";
                      } else if (isSelected) {
                        cardClass = "border-red-500 bg-red-500/10 text-white";
                      } else {
                        cardClass = "border-white/5 bg-slate-900/30 text-slate-500 opacity-60";
                      }
                    }

                    return (
                      <div 
                        key={oIdx}
                        onClick={() => handleOptionSelect(oIdx)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer text-sm flex items-center justify-between ${cardClass}`}
                      >
                        <span>{opt}</span>
                        {isAnswered && isCorrect && <CheckCircle className="text-green-500 w-5 h-5 shrink-0" />}
                        {isAnswered && isSelected && !isCorrect && <XCircle className="text-red-500 w-5 h-5 shrink-0" />}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Card */}
                {isAnswered && (
                  <div className="p-5 bg-blue-950/20 border border-blue-500/25 rounded-2xl space-y-2 animate-in slide-in-from-top-2">
                    <div className="flex items-center gap-2 text-blue-400 text-xs font-black uppercase tracking-widest">
                      <Info size={14} /> Explanation
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {quizQuestions[currentIdx].explanation}
                    </p>
                  </div>
                )}

                {/* Controls */}
                <div className="flex justify-end pt-4 border-t border-white/5">
                  {!isAnswered ? (
                    <button 
                      onClick={handleSubmit}
                      disabled={selectedOpt === null}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all shadow-lg active:scale-95"
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <button 
                      onClick={handleNext}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg flex items-center gap-2 active:scale-95"
                    >
                      <span>{currentIdx + 1 === quizQuestions.length ? 'Show Results' : 'Next Question'}</span>
                      <ChevronRight size={16} />
                    </button>
                  )}
                </div>

              </div>
            ) : (
              /* Results Screen */
              <div className="text-center py-12 space-y-6 max-w-md mx-auto">
                <div className="p-5 rounded-3xl bg-blue-500/10 border border-blue-500/20 w-fit mx-auto text-blue-400">
                  <Award size={64} className="animate-bounce" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-white">Quiz Completed</h3>
                  <p className="text-slate-400 text-sm">Regulations and organizations module score breakdown.</p>
                </div>

                <div className="p-6 bg-slate-900 rounded-3xl border border-white/5 space-y-2">
                  <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Total Correct</div>
                  <div className="text-5xl font-black text-white">{score} / {quizQuestions.length}</div>
                  <div className="text-[10px] text-green-400 font-bold uppercase tracking-wider mt-2">
                    {score === quizQuestions.length ? 'Perfect Score - ECAA Ready!' : 'Review the study sheets for missed sections.'}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={handleRestart}
                    className="flex-1 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/5 font-bold rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <RotateCcw size={16} /> Restart Quiz
                  </button>
                  <button 
                    onClick={() => onChangeView(View.EGYPTAIR_DASHBOARD)}
                    className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default EgyptAirRegulationsQuiz;
