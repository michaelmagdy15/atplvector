import React, { useState } from 'react';
import { 
  BookOpen, Search, Filter, Lightbulb, AlertOctagon, 
  CheckCircle2, XCircle, RotateCcw, HelpCircle, Layers, ArrowRight 
} from 'lucide-react';
import { ICAO_ANNEXES_DATA } from '../data/courseData';
import { IcaoAnnexDef } from '../types';

const AnnexList: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAnnex, setSelectedAnnex] = useState<IcaoAnnexDef | null>(ICAO_ANNEXES_DATA[12]); // Default Annex 13 (Accident Invest)
  const [drillMode, setDrillMode] = useState<boolean>(false);

  // Drill State
  const [drillIndex, setDrillIndex] = useState<number>(0);
  const [userSelectedAnswer, setUserSelectedAnswer] = useState<number | null>(null);
  const [drillScore, setDrillScore] = useState<number>(0);
  const [drillTotal, setDrillTotal] = useState<number>(0);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  const categories = ['All', 'Operations', 'Technical', 'Safety', 'Personnel', 'Administration', 'Infrastructure', 'Environment'];

  const filteredAnnexes = ICAO_ANNEXES_DATA.filter(annex => {
    const matchesCat = selectedCategory === 'All' || annex.domain.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = 
      annex.nr.toString().includes(searchQuery) ||
      annex.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      annex.focus.toLowerCase().includes(searchQuery.toLowerCase()) ||
      annex.mnemonic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Setup drill question
  const currentDrillAnnex = ICAO_ANNEXES_DATA[drillIndex % ICAO_ANNEXES_DATA.length];
  
  // Generate 4 multiple-choice options (1 correct + 3 random distractors)
  const getDrillOptions = () => {
    const correctNr = currentDrillAnnex.nr;
    const others = ICAO_ANNEXES_DATA.filter(a => a.nr !== correctNr).sort(() => 0.5 - Math.random()).slice(0, 3);
    const combined = [...others, currentDrillAnnex].sort((a, b) => a.nr - b.nr);
    return combined;
  };

  const [drillOptions, setDrillOptions] = useState<IcaoAnnexDef[]>(getDrillOptions());

  const nextDrillQuestion = () => {
    const nextIdx = (drillIndex + 1) % ICAO_ANNEXES_DATA.length;
    setDrillIndex(nextIdx);
    setUserSelectedAnswer(null);
    setShowExplanation(false);
    
    const nextAnnex = ICAO_ANNEXES_DATA[nextIdx];
    const others = ICAO_ANNEXES_DATA.filter(a => a.nr !== nextAnnex.nr).sort(() => 0.5 - Math.random()).slice(0, 3);
    setDrillOptions([...others, nextAnnex].sort((a, b) => a.nr - b.nr));
  };

  const handleDrillAnswer = (nr: number) => {
    if (userSelectedAnswer !== null) return;
    setUserSelectedAnswer(nr);
    setShowExplanation(true);
    setDrillTotal(t => t + 1);
    if (nr === currentDrillAnnex.nr) {
      setDrillScore(s => s + 1);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-700 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-500/30 text-indigo-400">
            <BookOpen size={32} />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              The 19 ICAO Annexes (SARPs)
            </h2>
            <p className="text-slate-400 text-sm">
              Chicago Convention Standards & Recommended Practices • Complete Reference & Operational Memory Hooks
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setDrillMode(!drillMode);
            setUserSelectedAnswer(null);
            setShowExplanation(false);
          }}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center gap-2 ${
            drillMode
              ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
          }`}
        >
          {drillMode ? 'Back to Library View' : 'Launch Annex Master Drill'}
        </button>
      </div>

      {/* DRILL MODE */}
      {drillMode ? (
        <div className="max-w-3xl mx-auto bg-slate-900 rounded-3xl border border-indigo-500/30 p-8 space-y-6 shadow-2xl animate-in zoom-in-95">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block">
                Annex Identification Drill
              </span>
              <h3 className="text-xl font-black text-white mt-1">
                Question {drillIndex + 1} of 19
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 font-bold block">Score</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">
                {drillScore} / {drillTotal}
              </span>
            </div>
          </div>

          <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Identify the matching ICAO Annex:
            </span>
            <p className="text-lg font-bold text-white leading-relaxed">
              "{currentDrillAnnex.focus}"
            </p>
            <div className="p-3 bg-indigo-950/30 rounded-xl border border-indigo-500/20 text-xs text-indigo-300">
              <strong>Memory Hook:</strong> {currentDrillAnnex.mnemonic}
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {drillOptions.map(opt => {
              const isSelected = userSelectedAnswer === opt.nr;
              const isCorrect = opt.nr === currentDrillAnnex.nr;

              let btnStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-600';
              if (showExplanation) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                } else if (isSelected) {
                  btnStyle = 'bg-red-950/60 border-red-500 text-red-200';
                } else {
                  btnStyle = 'bg-slate-950 border-slate-800 opacity-40 text-slate-500';
                }
              }

              return (
                <button
                  key={opt.nr}
                  disabled={showExplanation}
                  onClick={() => handleDrillAnswer(opt.nr)}
                  className={`p-4 rounded-xl border text-left transition-all ${btnStyle}`}
                >
                  <div className="text-xs font-bold text-indigo-400 uppercase mb-0.5">
                    Annex {opt.nr}
                  </div>
                  <div className="font-bold text-sm text-white">
                    {opt.title}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation Banner */}
          {showExplanation && (
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2">
                {userSelectedAnswer === currentDrillAnnex.nr ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
                <span className="font-bold text-sm text-white">
                  {userSelectedAnswer === currentDrillAnnex.nr ? 'Correct!' : `Incorrect — This is Annex ${currentDrillAnnex.nr}`}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Core Rule:</strong> {currentDrillAnnex.examKey}
              </p>
              <div className="p-3 bg-red-950/20 rounded-xl border border-red-500/30 text-xs text-red-300">
                {currentDrillAnnex.rtfqTrap}
              </div>
              <button
                onClick={nextDrillQuestion}
                className="w-full mt-2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm transition-all"
              >
                Next Question <ArrowRight className="inline w-4 h-4 ml-1" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* LIBRARY VIEW */
        <div className="space-y-6">
          {/* Controls Bar: Category Filter & Search */}
          <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
            {/* Category pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 md:pb-0">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[260px]">
              <Search className="absolute left-3 top-2.5 text-slate-500 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Annex title, number, or keyword..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Master 19 Annexes Grid + Detail Inspector */}
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Annex Card Grid */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[680px] overflow-y-auto pr-1">
              {filteredAnnexes.map(annex => {
                const isSelected = selectedAnnex?.nr === annex.nr;
                return (
                  <button
                    key={annex.nr}
                    onClick={() => setSelectedAnnex(annex)}
                    className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-xl shadow-indigo-600/20 scale-[1.02]'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-600 hover:bg-slate-800/80 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-3xl font-black mb-1 opacity-20 group-hover:opacity-40 transition-opacity absolute right-2 bottom-1 font-mono">
                      {annex.nr}
                    </div>
                    <span className={`text-[10px] font-bold block uppercase tracking-wider ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>
                      ANNEX {annex.nr} • {annex.domain}
                    </span>
                    <h4 className="font-bold text-sm text-white line-clamp-2 mt-1">
                      {annex.title}
                    </h4>
                  </button>
                );
              })}
            </div>

            {/* Detail Inspector Panel */}
            <div className="lg:col-span-5">
              {selectedAnnex ? (
                <div className="bg-slate-900 p-6 md:p-8 rounded-3xl border border-indigo-500/30 shadow-2xl space-y-6 sticky top-6">
                  <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                    <div>
                      <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block">
                        ICAO Annex {selectedAnnex.nr} • {selectedAnnex.domain}
                      </span>
                      <h3 className="text-2xl font-black text-white mt-1">
                        {selectedAnnex.title}
                      </h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-xl font-black font-mono text-indigo-400">
                      {selectedAnnex.nr}
                    </div>
                  </div>

                  {/* Focus Scope */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Scope & Subject Matter:
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {selectedAnnex.focus}
                    </p>
                  </div>

                  {/* Operational Mnemonic */}
                  <div className="p-4 bg-indigo-950/40 rounded-2xl border border-indigo-500/30 space-y-1">
                    <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider">
                      <Lightbulb size={16} className="text-amber-400" />
                      Operational Memory Hook
                    </div>
                    <p className="text-xs text-white font-medium italic">
                      "{selectedAnnex.mnemonic}"
                    </p>
                  </div>

                  {/* Core Technical Key */}
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Core Exam Principle:
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {selectedAnnex.examKey}
                    </p>
                  </div>

                  {/* RTFQ Exam Trap */}
                  <div className="p-4 bg-red-950/20 rounded-2xl border border-red-500/30 space-y-1">
                    <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider">
                      <AlertOctagon size={16} />
                      RTFQ Exam Trap
                    </div>
                    <p className="text-xs text-red-200 leading-relaxed">
                      {selectedAnnex.rtfqTrap}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900/40 p-12 rounded-3xl border border-slate-800 text-center text-slate-500">
                  Select an Annex from the grid to view detailed SARPs breakdown and memory hooks.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnexList;
