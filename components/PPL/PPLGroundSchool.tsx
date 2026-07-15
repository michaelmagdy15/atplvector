import React, { useState, useEffect, useRef } from 'react';
import { View, User } from '../../types';
import { PPL_GROUND_COURSE, PPLVideoLesson } from '../../data/pplGroundCourse';
import { PPL_SUBJECTS } from '../../data/pplSubjects';
import { 
  ChevronLeft, Play, Award, CheckCircle, Search, Edit3, Save, 
  Layers, Compass, Wind, Eye, FileText, Check, AlertTriangle, HelpCircle, 
  RotateCcw, Sliders, ChevronDown, ChevronUp, Link2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  user: User;
  onChangeView: (view: View) => void;
}

const PPLGroundSchool: React.FC<Props> = ({ user, onChangeView }) => {
  const [selectedLesson, setSelectedLesson] = useState<PPLVideoLesson>(PPL_GROUND_COURSE[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'interactive' | 'notes'>('overview');
  
  // Progress states
  const [watchedLessons, setWatchedLessons] = useState<number[]>([]);
  const [masteredLessons, setMasteredLessons] = useState<number[]>([]);
  const [lessonNotes, setLessonNotes] = useState<Record<number, string>>({});
  
  // Note editing state
  const [currentNote, setCurrentNote] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Quiz states
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState({ correct: 0, total: 3, passed: false });

  // Sidebar grouping collapse states
  const [collapsedSubjects, setCollapsedSubjects] = useState<Record<string, boolean>>({});

  // Initialize progress from localStorage
  useEffect(() => {
    try {
      const watched = JSON.parse(localStorage.getItem('ppl_watched_lessons') || '[]');
      const mastered = JSON.parse(localStorage.getItem('ppl_mastered_lessons') || '[]');
      const notes = JSON.parse(localStorage.getItem('ppl_lessons_notes') || '{}');
      
      setWatchedLessons(watched);
      setMasteredLessons(mastered);
      setLessonNotes(notes);

      // Load initial note for first lesson
      if (notes[PPL_GROUND_COURSE[0].index]) {
        setCurrentNote(notes[PPL_GROUND_COURSE[0].index]);
      }
    } catch (e) {
      console.error('Error loading progress:', e);
    }
  }, []);

  // Update current note when selected lesson changes
  useEffect(() => {
    setCurrentNote(lessonNotes[selectedLesson.index] || '');
    // Reset quiz state
    setSelectedAnswers({});
    setQuizSubmitted(false);
  }, [selectedLesson, lessonNotes]);

  const toggleWatched = (index: number) => {
    const updated = watchedLessons.includes(index)
      ? watchedLessons.filter(i => i !== index)
      : [...watchedLessons, index];
    setWatchedLessons(updated);
    localStorage.setItem('ppl_watched_lessons', JSON.stringify(updated));
  };

  const handleSaveNote = () => {
    setSaveStatus('saving');
    const updatedNotes = { ...lessonNotes, [selectedLesson.index]: currentNote };
    setLessonNotes(updatedNotes);
    localStorage.setItem('ppl_lessons_notes', JSON.stringify(updatedNotes));
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 1500);
    }, 500);
  };

  const handleQuizSubmit = () => {
    let correctCount = 0;
    selectedLesson.quiz.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answerIndex) {
        correctCount++;
      }
    });

    const passed = correctCount === selectedLesson.quiz.length;
    setQuizResult({ correct: correctCount, total: selectedLesson.quiz.length, passed });
    setQuizSubmitted(true);

    if (passed && !masteredLessons.includes(selectedLesson.index)) {
      const updated = [...masteredLessons, selectedLesson.index];
      setMasteredLessons(updated);
      localStorage.setItem('ppl_mastered_lessons', JSON.stringify(updated));
    }
  };

  const selectAnswer = (qIdx: number, oIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers({ ...selectedAnswers, [qIdx]: oIdx });
  };

  const toggleSubjectCollapse = (subId: string) => {
    setCollapsedSubjects({ ...collapsedSubjects, [subId]: !collapsedSubjects[subId] });
  };

  // Filter lessons based on search query
  const filteredLessons = PPL_GROUND_COURSE.filter(lesson => 
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lesson.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
      
      {/* Header Navigation */}
      <button 
        onClick={() => onChangeView(View.PPL_DASHBOARD)}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
        Back to PPL Dashboard
      </button>

      {/* Main Ground School Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Playlist & Sidebar (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col h-[700px]">
            <h3 className="text-xl font-extrabold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
              🎓 Lesson Map
              <span className="text-xs font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
                {watchedLessons.length}/64 Done
              </span>
            </h3>

            {/* Search Input */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search topics, regulations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors"
              />
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            </div>

            {/* Playlist Container */}
            <div className="flex-grow overflow-y-auto pr-1 space-y-4 custom-scrollbar">
              {searchQuery ? (
                // Simple list for search results
                <div className="space-y-2">
                  {filteredLessons.map(lesson => (
                    <LessonRow 
                      key={lesson.index}
                      lesson={lesson}
                      selectedLesson={selectedLesson}
                      setSelectedLesson={setSelectedLesson}
                      watchedLessons={watchedLessons}
                      masteredLessons={masteredLessons}
                      toggleWatched={toggleWatched}
                    />
                  ))}
                </div>
              ) : (
                // Standard Grouping by PPL Subject
                PPL_SUBJECTS.map(subject => {
                  const subjectLessons = PPL_GROUND_COURSE.filter(l => l.subjectId === subject.id);
                  const isCollapsed = collapsedSubjects[subject.id];
                  const completedInSubject = subjectLessons.filter(l => watchedLessons.includes(l.index)).length;
                  
                  return (
                    <div key={subject.id} className="border-b border-white/5 pb-2">
                      <button
                        onClick={() => toggleSubjectCollapse(subject.id)}
                        className="w-full flex items-center justify-between py-2 text-left font-bold text-sm text-slate-300 hover:text-white transition-colors"
                      >
                        <span className="truncate flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full bg-${subject.color}-500`} />
                          {subject.name}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-mono text-slate-500">
                            {completedInSubject}/{subjectLessons.length}
                          </span>
                          {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                        </div>
                      </button>

                      {!isCollapsed && (
                        <div className="pl-2.5 mt-1 space-y-1.5 animate-in slide-in-from-top-1 duration-200">
                          {subjectLessons.map(lesson => (
                            <LessonRow 
                              key={lesson.index}
                              lesson={lesson}
                              selectedLesson={selectedLesson}
                              setSelectedLesson={setSelectedLesson}
                              watchedLessons={watchedLessons}
                              masteredLessons={masteredLessons}
                              toggleWatched={toggleWatched}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Player, Tabs & Interactive Visual Workspace (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Responsive Video Player */}
          <div className="glass-panel overflow-hidden rounded-3xl border border-white/10 bg-black/40">
            <div className="aspect-video w-full relative">
              <iframe
                title={selectedLesson.title}
                src={`https://www.youtube.com/embed/${selectedLesson.videoId}`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-6 border-t border-white/10 bg-slate-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-md">
                  Lesson {selectedLesson.index} • {selectedLesson.category}
                </span>
                <h1 className="text-xl font-bold text-white mt-2 leading-snug">{selectedLesson.title}</h1>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => toggleWatched(selectedLesson.index)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all border ${
                    watchedLessons.includes(selectedLesson.index)
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-slate-800 hover:bg-slate-700 border-white/5 text-slate-300'
                  }`}
                >
                  <CheckCircle size={14} />
                  {watchedLessons.includes(selectedLesson.index) ? 'Completed' : 'Mark Complete'}
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Workspace Tabs */}
          <div className="flex gap-2 border-b border-white/10 pb-3">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Overview & Objectives
            </button>
            <button
              onClick={() => setActiveTab('interactive')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'interactive'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sliders size={14} />
              Interactive Lab
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'notes'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Edit3 size={14} />
              My Notes
              {lessonNotes[selectedLesson.index] && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
            </button>
          </div>

          {/* Dynamic Tab Panels */}
          <div className="min-h-[400px]">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Objectives Panel */}
                <div className="glass-panel p-6 rounded-3xl border border-white/10">
                  <h4 className="text-base font-bold text-white mb-4 uppercase tracking-wider">Lesson Objectives</h4>
                  <ul className="space-y-3 text-sm text-slate-300">
                    {selectedLesson.summary.map((pt, idx) => (
                      <li key={idx} className="flex gap-2.5 items-start">
                        <Check size={16} className="text-blue-400 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Simulator Redirect Card if exists */}
                  {selectedLesson.relatedView && (
                    <div className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 flex items-center justify-between gap-4">
                      <div>
                        <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Vector Practical Simulator</h5>
                        <p className="text-[11px] text-slate-400 leading-normal">
                          This lesson has a corresponding deep-dive simulator on the platform.
                        </p>
                      </div>
                      <button
                        onClick={() => onChangeView(selectedLesson.relatedView!)}
                        className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shrink-0 transition-all flex items-center gap-1 text-[11px] font-black uppercase tracking-wider"
                      >
                        <Link2 size={12} /> Launch
                      </button>
                    </div>
                  )}
                </div>

                {/* Quick Quiz Panel */}
                <div className="glass-panel p-6 rounded-3xl border border-white/10">
                  <h4 className="text-base font-bold text-white mb-4 uppercase tracking-wider flex items-center justify-between">
                    <span>Quick Concept Quiz</span>
                    {masteredLessons.includes(selectedLesson.index) && (
                      <span className="text-[10px] bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-full uppercase font-bold flex items-center gap-1">
                        <Award size={10} /> Mastered
                      </span>
                    )}
                  </h4>

                  <div className="space-y-6">
                    {selectedLesson.quiz.map((q, qIdx) => (
                      <div key={qIdx} className="space-y-2.5">
                        <p className="text-sm font-bold text-slate-200">
                          {qIdx + 1}. {q.question}
                        </p>
                        <div className="grid grid-cols-1 gap-2">
                          {q.options.map((opt, oIdx) => {
                            const isSelected = selectedAnswers[qIdx] === oIdx;
                            const isCorrect = q.answerIndex === oIdx;
                            let btnStyle = 'bg-slate-950/40 border-white/5 hover:bg-slate-900 text-slate-300';
                            
                            if (quizSubmitted) {
                              if (isSelected) {
                                btnStyle = isCorrect
                                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                  : 'bg-red-500/10 border-red-500/30 text-red-400';
                              } else if (isCorrect) {
                                btnStyle = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
                              }
                            } else if (isSelected) {
                              btnStyle = 'bg-blue-600/20 border-blue-500/50 text-blue-400';
                            }

                            return (
                              <button
                                key={oIdx}
                                onClick={() => selectAnswer(qIdx, oIdx)}
                                disabled={quizSubmitted}
                                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs border font-medium transition-all ${btnStyle}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        {quizSubmitted && selectedAnswers[qIdx] !== undefined && (
                          <p className="text-[11px] text-slate-400 italic bg-slate-950/30 p-2 rounded-lg leading-normal mt-1 border border-white/5">
                            {q.explanation}
                          </p>
                        )}
                      </div>
                    ))}

                    {!quizSubmitted ? (
                      <button
                        onClick={handleQuizSubmit}
                        disabled={Object.keys(selectedAnswers).length < selectedLesson.quiz.length}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg transition-all"
                      >
                        Submit Answers
                      </button>
                    ) : (
                      <div className="flex items-center justify-between gap-4 pt-2">
                        <span className={`text-xs font-bold ${quizResult.passed ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {quizResult.passed 
                            ? '🎉 Perfect Score! Lesson Mastered!' 
                            : `Study score: ${quizResult.correct} / 3 Correct.`}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedAnswers({});
                            setQuizSubmitted(false);
                          }}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-[10px] uppercase tracking-wider transition-all"
                        >
                          Retry
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'interactive' && (
              <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 bg-slate-900/40">
                <InteractiveContainer lessonIndex={selectedLesson.index} />
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-white uppercase tracking-wider">My Summary & Study Notes</h4>
                  <button
                    onClick={handleSaveNote}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                  >
                    <Save size={14} />
                    {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Notes'}
                  </button>
                </div>
                
                <p className="text-xs text-slate-400 italic leading-relaxed">
                  Type your own notes and summaries here. Your notes are auto-saved to your browser's local storage and persist across training sessions.
                </p>

                <textarea
                  value={currentNote}
                  onChange={(e) => setCurrentNote(e.target.value)}
                  placeholder={`Write your summary for "${selectedLesson.title}" here... e.g. formulas, key concepts, or things to remember.`}
                  className="w-full h-80 p-4 bg-slate-950/60 border border-white/10 rounded-2xl text-slate-200 text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors resize-none font-mono leading-relaxed"
                />
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

// Sub-component for individual playlist items
interface RowProps {
  lesson: PPLVideoLesson;
  selectedLesson: PPLVideoLesson;
  setSelectedLesson: (l: PPLVideoLesson) => void;
  watchedLessons: number[];
  masteredLessons: number[];
  toggleWatched: (idx: number) => void;
}

const LessonRow: React.FC<RowProps> = ({
  lesson, selectedLesson, setSelectedLesson, watchedLessons, masteredLessons, toggleWatched
}) => {
  const isSelected = selectedLesson.index === lesson.index;
  const isWatched = watchedLessons.includes(lesson.index);
  const isMastered = masteredLessons.includes(lesson.index);

  return (
    <div 
      className={`group flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all ${
        isSelected
          ? 'bg-blue-600/10 border-blue-500/30 text-white'
          : 'bg-slate-950/20 border-white/5 hover:bg-slate-900/40 text-slate-400 hover:text-slate-200'
      }`}
    >
      <div 
        onClick={() => setSelectedLesson(lesson)}
        className="flex items-start gap-2.5 cursor-pointer flex-grow min-w-0 py-1"
      >
        <span className="font-mono text-[10px] text-slate-600 mt-0.5 shrink-0">
          {String(lesson.index).padStart(2, '0')}
        </span>
        <div className="truncate pr-2">
          <p className={`truncate font-semibold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
            {lesson.title.replace("YouTube's ONLY Complete Private Pilot Ground Course ", "")}
          </p>
          <span className="text-[9px] text-slate-500 block mt-0.5">
            {lesson.category} • {lesson.duration}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {isMastered && <span title="Quiz Mastered"><Award size={14} className="text-amber-400" /></span>}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWatched(lesson.index);
          }}
          className={`p-1.5 rounded-lg border transition-all ${
            isWatched
              ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
              : 'bg-transparent border-white/10 hover:border-slate-400 text-slate-600 hover:text-slate-400'
          }`}
        >
          <Check size={12} />
        </button>
      </div>
    </div>
  );
};

// Sub-component that holds all 6 interactive visual widgets
const InteractiveContainer: React.FC<{ lessonIndex: number }> = ({ lessonIndex }) => {
  // Map lesson indices to their corresponding visual widget type
  // Aerodynamics & Load Factor: 1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 13, 14, 64
  // Airspace Limits & Weather Minima: 15, 16, 17, 18, 19, 20, 21, 22, 53, 54, 55, 56
  // Pitot-Static Blockage: 28, 29, 30, 31, 32, 33, 34
  // VOR Receiver: 38
  // METAR Decoder: 40, 41, 42
  // Weight & Balance: 50, 51, 52
  // Fallback default: General widget

  if ([1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 13, 14, 64].includes(lessonIndex)) {
    return <AerodynamicsWidget />;
  } else if ([15, 16, 17, 18, 19, 20, 21, 22, 53, 54, 55, 56, 62, 63].includes(lessonIndex)) {
    return <AirspaceWidget />;
  } else if ([28, 29, 30, 31, 32, 33, 34].includes(lessonIndex)) {
    return <PitotStaticWidget />;
  } else if (lessonIndex === 38) {
    return <VORWidget />;
  } else if ([40, 41, 42].includes(lessonIndex)) {
    return <METARWidget />;
  } else if ([50, 51, 52].includes(lessonIndex)) {
    return <WeightBalanceWidget />;
  }

  return <DefaultFlightPrepWidget />;
};

/* -------------------------------------------------------------
   WIDGET 1: Aerodynamics & Load Factor Lab
------------------------------------------------------------- */
const AerodynamicsWidget: React.FC = () => {
  const [bankAngle, setBankAngle] = useState(0);

  // Load factor calculation: G = 1 / cos(theta)
  const rad = (bankAngle * Math.PI) / 180;
  const loadFactor = bankAngle === 90 ? 99.9 : Math.min(10, 1 / Math.cos(rad));
  
  // Stall speed factor: stall speed = Vs * sqrt(G)
  const stallSpeedPct = Math.round((Math.sqrt(loadFactor) - 1) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
        <Wind className="text-blue-400" size={24} />
        <div>
          <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">Aerodynamics & Load Factor Lab</h4>
          <p className="text-[11px] text-slate-400 leading-normal">Simulate flight banking angles to evaluate structural load factor increases and stall speed changes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Visual Banking Plane */}
        <div className="flex flex-col items-center justify-center p-6 bg-slate-950/40 rounded-2xl border border-white/5 h-64 relative">
          <span className="absolute top-3 left-3 text-[10px] font-mono text-slate-500">AIRCRAFT attitude</span>
          <div 
            className="w-40 h-2 bg-slate-700 rounded-full relative transition-transform duration-200"
            style={{ transform: `rotate(${bankAngle}deg)` }}
          >
            {/* Left Wing Tip */}
            <div className="absolute -left-2 -top-1 w-2 h-4 bg-rose-500 rounded-sm" />
            {/* Right Wing Tip */}
            <div className="absolute -right-2 -top-1 w-2 h-4 bg-emerald-500 rounded-sm" />
            {/* Cockpit Canopy */}
            <div className="absolute left-1/2 -top-4 -translate-x-1/2 w-6 h-4 bg-sky-400 rounded-t-full" />
            {/* Vertical Tail */}
            <div className="absolute left-1/2 -top-8 -translate-x-1/2 w-1.5 h-6 bg-slate-600" />
          </div>
          {/* Artificial Horizon Lines */}
          <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 border-t border-dashed border-white/10 -z-10 pointer-events-none" />
          
          <div className="text-center mt-8">
            <span className="text-3xl font-mono font-black text-white">{bankAngle}°</span>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Bank Angle</p>
          </div>
        </div>

        {/* Readouts & Slider */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex justify-between">
              <span>Adjust Bank Angle</span>
              <span className="font-mono text-blue-400">{bankAngle}°</span>
            </label>
            <input
              type="range"
              min="0"
              max="75"
              step="1"
              value={bankAngle}
              onChange={(e) => setBankAngle(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950/40 border border-white/5 rounded-xl">
              <span className="text-2xl font-mono font-black text-blue-400">{loadFactor.toFixed(2)} G</span>
              <h5 className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-1">Load Factor</h5>
            </div>
            <div className="p-4 bg-slate-950/40 border border-white/5 rounded-xl">
              <span className="text-2xl font-mono font-black text-amber-400">+{stallSpeedPct}%</span>
              <h5 className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-1">Stall Speed Increase</h5>
            </div>
          </div>

          {loadFactor > 2.5 && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-[10px] flex items-center gap-2">
              <AlertTriangle size={14} className="shrink-0" />
              <span>Normal category structural G-limit exceeded (+2.5 G is warning, limit is +3.8 G).</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------
   WIDGET 2: Airspace limits & VFR Minima
------------------------------------------------------------- */
const AirspaceWidget: React.FC = () => {
  const [selectedAirspace, setSelectedAirspace] = useState<'B' | 'C' | 'D' | 'E' | 'G'>('B');

  const airspaceRules = {
    B: {
      name: "Class B Airspace",
      limits: "Surface to 10,000 ft MSL. Custom tailored wedding-cake structure.",
      visibility: "3 Statute Miles (SM)",
      clouds: "Clear of clouds",
      entry: "Requires explicit ATC clearance prior to entry",
      equipment: "Two-way radio, Mode C Transponder, ADS-B Out (inside and within 30 NM Mode C Veil)."
    },
    C: {
      name: "Class C Airspace",
      limits: "Surface to 4,000 ft AGL. Standard 5 NM inner ring, 10 NM outer shelf (1,200 to 4,000 ft AGL).",
      visibility: "3 Statute Miles (SM)",
      clouds: "500 ft below, 1,000 ft above, 2,000 ft horizontal",
      entry: "Two-way radio communication established (ATC must read back your full tail number)",
      equipment: "Two-way radio, Mode C Transponder, ADS-B Out."
    },
    D: {
      name: "Class D Airspace",
      limits: "Surface to 2,500 ft AGL. Standard 4 NM radius cylindrical structure.",
      visibility: "3 Statute Miles (SM)",
      clouds: "500 ft below, 1,000 ft above, 2,000 ft horizontal",
      entry: "Two-way radio communication established prior to entry",
      equipment: "Two-way radio."
    },
    E: {
      name: "Class E Airspace",
      limits: "Controlled airspace that is not A, B, C, or D. Standard floor is 700 ft AGL or 1,200 ft AGL up to 18,000 ft MSL.",
      visibility: "3 SM (below 10,000 ft MSL) / 5 SM (at or above 10,000 ft MSL)",
      clouds: "Below 10,000 ft: 500' below, 1,000' above, 2,000' horiz. Above 10,000 ft: 1,000' below, 1,000' above, 1 SM horiz.",
      entry: "None for VFR flights",
      equipment: "None below 10,000 ft MSL. Transponder and ADS-B required above 10,000 ft MSL."
    },
    G: {
      name: "Class G Airspace",
      limits: "Uncontrolled airspace. Extending from surface up to the floor of overlying Class E airspace.",
      visibility: "1 SM Day / 3 SM Night (below 1,200 ft AGL)",
      clouds: "Day: Clear of clouds. Night: 500' below, 1,000' above, 2,000' horizontal.",
      entry: "None",
      equipment: "None."
    }
  };

  const active = airspaceRules[selectedAirspace];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
        <Layers className="text-blue-400" size={24} />
        <div>
          <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">Airspace & VFR Weather Minima Chart</h4>
          <p className="text-[11px] text-slate-400 leading-normal">Explore airspaces to learn visual flight rules (VFR), cloud clearances, and ATC entry requirements.</p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-white/5 pb-3">
        {(['B', 'C', 'D', 'E', 'G'] as const).map(cls => (
          <button
            key={cls}
            onClick={() => setSelectedAirspace(cls)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedAirspace === cls
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-950/40 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            Class {cls}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Visual Cake Representation */}
        <div className="p-6 bg-slate-950/40 border border-white/5 rounded-2xl flex flex-col justify-between min-h-[250px] relative">
          <span className="text-[10px] font-mono text-slate-500 absolute top-3 left-3">Visual Profile</span>
          
          <div className="flex-grow flex items-center justify-center pt-6">
            {selectedAirspace === 'B' && (
              <div className="flex flex-col items-center">
                <div className="w-48 h-8 bg-blue-500/20 border border-blue-500/40 rounded-md flex items-center justify-center text-[10px] text-blue-300 font-bold uppercase tracking-wider">10,000 ft MSL Shelf (30 NM)</div>
                <div className="w-36 h-8 bg-blue-500/30 border border-blue-500/50 rounded-md flex items-center justify-center text-[10px] text-blue-300 font-bold uppercase tracking-wider">5,000 ft MSL Shelf (20 NM)</div>
                <div className="w-24 h-12 bg-blue-500/40 border border-blue-500/60 rounded-md flex items-center justify-center text-[10px] text-blue-300 font-bold uppercase tracking-wider">Surface Core (10 NM)</div>
              </div>
            )}
            {selectedAirspace === 'C' && (
              <div className="flex flex-col items-center">
                <div className="w-40 h-10 bg-indigo-500/20 border border-indigo-500/40 rounded-md flex items-center justify-center text-[10px] text-indigo-300 font-bold uppercase tracking-wider">1,200 to 4,000 ft AGL Shelf (10 NM)</div>
                <div className="w-20 h-12 bg-indigo-500/45 border border-indigo-500/60 rounded-md flex items-center justify-center text-[10px] text-indigo-300 font-bold uppercase tracking-wider">Surface to 4,000 ft AGL (5 NM)</div>
              </div>
            )}
            {selectedAirspace === 'D' && (
              <div className="w-24 h-24 bg-violet-500/30 border border-violet-500/50 rounded-md flex items-center justify-center text-center text-[10px] text-violet-300 font-bold uppercase tracking-wider">Surface to 2,500 ft AGL (4 NM Cylinder)</div>
            )}
            {selectedAirspace === 'E' && (
              <div className="w-full h-24 bg-slate-800/20 border border-slate-700/30 rounded-md flex items-center justify-center text-center text-[10px] text-slate-300 font-bold uppercase tracking-wider">Controlled airspace starting at 700 ft AGL or 1,200 ft AGL</div>
            )}
            {selectedAirspace === 'G' && (
              <div className="w-full h-24 bg-teal-800/10 border border-teal-700/20 rounded-md flex items-center justify-center text-center text-[10px] text-teal-300 font-bold uppercase tracking-wider">Uncontrolled airspace starting from the surface</div>
            )}
          </div>

          <h5 className="text-center text-sm font-bold text-white mt-4">{active.name}</h5>
        </div>

        {/* Rules Table */}
        <div className="space-y-4 text-xs">
          <div className="border-b border-white/5 pb-2">
            <span className="text-slate-500 uppercase tracking-wider font-bold text-[9px] block">Vertical/Horizontal Limits</span>
            <span className="text-slate-200 mt-0.5 block leading-relaxed">{active.limits}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="border-b border-white/5 pb-2">
              <span className="text-slate-500 uppercase tracking-wider font-bold text-[9px] block">Visibility Minimum</span>
              <span className="text-slate-200 mt-0.5 block">{active.visibility}</span>
            </div>
            <div className="border-b border-white/5 pb-2">
              <span className="text-slate-500 uppercase tracking-wider font-bold text-[9px] block">Cloud Clearance</span>
              <span className="text-slate-200 mt-0.5 block">{active.clouds}</span>
            </div>
          </div>
          <div className="border-b border-white/5 pb-2">
            <span className="text-slate-500 uppercase tracking-wider font-bold text-[9px] block">ATC Entry requirements</span>
            <span className="text-emerald-400 mt-0.5 block leading-relaxed">{active.entry}</span>
          </div>
          <div className="border-b border-white/5 pb-2">
            <span className="text-slate-500 uppercase tracking-wider font-bold text-[9px] block">Required Equipment</span>
            <span className="text-slate-300 mt-0.5 block leading-relaxed">{active.equipment}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------
   WIDGET 3: Pitot-Static Blockage Simulator
------------------------------------------------------------- */
const PitotStaticWidget: React.FC = () => {
  const [pitotInletBlocked, setPitotInletBlocked] = useState(false);
  const [pitotDrainBlocked, setPitotDrainBlocked] = useState(false);
  const [staticBlocked, setStaticBlocked] = useState(false);

  const [altitude, setAltitude] = useState(3000); // ft
  const [airspeed, setAirspeed] = useState(100); // kts

  // Simulated instrument responses
  // Altimeter: static blocked means it freezes at blockage altitude (say 3000ft)
  const displayAltimeter = staticBlocked ? 3000 : altitude;
  
  // VSI: static blocked means it freezes at 0
  const displayVSI = staticBlocked ? 0 : 'Normal';

  // ASI: complex logic
  let displayASI = airspeed;
  let asiStatus = 'Normal';

  if (pitotInletBlocked) {
    if (pitotDrainBlocked) {
      // Pitot inlet + drain blocked: traps pressure. Acts as altimeter.
      // If altitude increases above blockage altitude (3000ft), ASI reads HIGH.
      const altDelta = altitude - 3000;
      displayASI = airspeed + (altDelta / 20); // 1kt per 20ft roughly
      asiStatus = 'Acts as Altimeter (Reads high in climb)';
    } else {
      // Pitot inlet blocked, drain open: pressure drops to static reference (0 airspeed).
      displayASI = 0;
      asiStatus = 'Blocked (Reads 0)';
    }
  } else if (staticBlocked) {
    // Static port blocked: static pressure trapped.
    // In climb, actual atmospheric pressure drops, but instrument static line pressure is trapped (high).
    // ASI diaphragm differential decreases, meaning ASI reads LOW.
    const altDelta = altitude - 3000;
    displayASI = Math.max(0, airspeed - (altDelta / 30));
    asiStatus = 'Reads low in climb, high in descent';
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
        <Compass className="text-blue-400" size={24} />
        <div>
          <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">Pitot-Static System Blockage Lab</h4>
          <p className="text-[11px] text-slate-400 leading-normal">Toggle blockages in the pitot tube and static ports, then fly climbs or descents to observe the error readings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Controls Column */}
        <div className="space-y-5">
          <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl space-y-4">
            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Toggle Blockages</h5>
            
            <div className="space-y-3">
              <label className="flex items-center gap-3 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pitotInletBlocked}
                  onChange={(e) => setPitotInletBlocked(e.target.checked)}
                  className="rounded border-white/10 text-blue-600 focus:ring-0 focus:ring-offset-0 bg-slate-950"
                />
                <span>Pitot Tube Inlet Blocked</span>
              </label>

              <label className="flex items-center gap-3 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pitotDrainBlocked}
                  onChange={(e) => setPitotDrainBlocked(e.target.checked)}
                  className="rounded border-white/10 text-blue-600 focus:ring-0 focus:ring-offset-0 bg-slate-950"
                />
                <span>Pitot Tube Drain Hole Blocked</span>
              </label>

              <label className="flex items-center gap-3 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={staticBlocked}
                  onChange={(e) => setStaticBlocked(e.target.checked)}
                  className="rounded border-white/10 text-blue-600 focus:ring-0 focus:ring-offset-0 bg-slate-950"
                />
                <span>Static Port Blocked (at 3,000 ft)</span>
              </label>
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex justify-between">
                <span>Simulate Altitude Change</span>
                <span className="font-mono text-blue-400">{altitude} ft</span>
              </label>
              <input
                type="range"
                min="1000"
                max="8000"
                step="100"
                value={altitude}
                onChange={(e) => setAltitude(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex justify-between">
                <span>Simulate Actual Airspeed</span>
                <span className="font-mono text-blue-400">{airspeed} KTAS</span>
              </label>
              <input
                type="range"
                min="60"
                max="160"
                step="5"
                value={airspeed}
                onChange={(e) => setAirspeed(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Instruments Readout Column */}
        <div className="grid grid-cols-1 gap-4">
          <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Airspeed Indicator</span>
              <h5 className="text-xl font-mono font-black text-white mt-1">
                {displayASI === 0 ? '0' : Math.round(displayASI)} <span className="text-xs text-slate-400">KTS</span>
              </h5>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
              asiStatus === 'Normal' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
            }`}>
              {asiStatus}
            </span>
          </div>

          <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Altimeter</span>
              <h5 className="text-xl font-mono font-black text-white mt-1">
                {displayAltimeter} <span className="text-xs text-slate-400">FT</span>
              </h5>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
              staticBlocked ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
            }`}>
              {staticBlocked ? 'Frozen' : 'Normal'}
            </span>
          </div>

          <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Vertical Speed Indicator</span>
              <h5 className="text-xl font-mono font-black text-white mt-1">
                {displayVSI}
              </h5>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
              staticBlocked ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
            }`}>
              {staticBlocked ? 'Frozen' : 'Normal'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------
   WIDGET 4: VOR Navigation Receiver Dojo
------------------------------------------------------------- */
const VORWidget: React.FC = () => {
  const [obs, setObs] = useState(360);
  const [aircraftPos, setAircraftPos] = useState({ x: 120, y: 70 }); // Relative coordinates to map center (100, 100)
  
  // VOR station coordinate is at (100, 100)
  // Calculate radial from VOR to aircraft
  const dx = aircraftPos.x - 100;
  const dy = 100 - aircraftPos.y; // invert Y coordinate for standard Cartesian angle
  
  let radialAngle = Math.atan2(dx, dy) * (180 / Math.PI);
  if (radialAngle < 0) radialAngle += 360;
  
  const radial = Math.round(radialAngle);

  // Calculate CDI needle deflection: OBS vs Radial
  // Difference between OBS heading and Radial
  let diff = obs - radial;
  // normalize diff to -180 to 180
  while (diff > 180) diff -= 360;
  while (diff < -180) diff += 360;

  // TO/FROM logic
  // If the plane is on the same side of the station as the OBS course, it's FROM.
  // Mathematically, if cos(diff) > 0, it's FROM (because OBS and Radial point in the same direction).
  // If cos(diff) < 0, it's TO.
  const radDiff = (diff * Math.PI) / 180;
  const cosDiff = Math.cos(radDiff);
  
  let toFromFlag: 'TO' | 'FROM' | 'OFF' = 'OFF';
  if (Math.abs(cosDiff) < 0.15) {
    toFromFlag = 'OFF'; // inside the zone of confusion / cone of silence
  } else {
    toFromFlag = cosDiff > 0 ? 'FROM' : 'TO';
  }

  // Needle deflection (scaled 0 to 10 dots, where 10 is fully deflected)
  // Standard CDI needle has 5 dots left, 5 dots right. Full deflection is 10 degrees.
  // If TO, needle behavior is inverted to act as a proper command indicator:
  // FROM: needle moves toward the course (diff)
  // TO: needle moves toward the course (inverts the relative position)
  let deflection = diff;
  if (toFromFlag === 'TO') {
    deflection = -diff;
  }
  
  // clamp deflection to max 10 degrees
  const needleDeflection = Math.max(-10, Math.min(10, deflection));

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setAircraftPos({ x, y });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
        <Compass className="text-blue-400" size={24} />
        <div>
          <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">VOR Navigation Instrument Dojo</h4>
          <p className="text-[11px] text-slate-400 leading-normal">Reposition the aircraft on the map and rotate the OBS dial to observe how the CDI needle and TO/FROM flag update.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Interactive Map */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Interactive Navigation Map (Click to Position Aircraft)</label>
          <div 
            onClick={handleMapClick}
            className="w-full h-64 bg-slate-950/60 border border-white/5 rounded-2xl relative cursor-crosshair overflow-hidden"
          >
            {/* Compass Grid lines */}
            <div className="absolute inset-0 border border-dashed border-white/5 pointer-events-none" />
            <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-white/5 pointer-events-none" />
            <div className="absolute left-1/2 top-0 bottom-0 border-l border-dashed border-white/5 pointer-events-none" />

            {/* VOR Station */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500 flex items-center justify-center text-[8px] font-black text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.3)]">VOR</div>
            </div>

            {/* Radial Line to aircraft */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <line 
                x1="50%" 
                y1="50%" 
                x2={`${(aircraftPos.x / 200) * 200}%`} // scale relative to coordinate container width
                y2={`${(aircraftPos.y / 200) * 200}%`}
                stroke="rgba(59,130,246,0.15)"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
            </svg>

            {/* Aircraft Icon */}
            <div 
              className="absolute -translate-x-1/2 -translate-y-1/2 p-2 bg-blue-600 rounded-lg text-white shadow-lg pointer-events-none transition-all duration-200"
              style={{ left: `${aircraftPos.x}px`, top: `${aircraftPos.y}px` }}
            >
              <Play size={12} className="rotate-[-90deg]" />
            </div>

            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-slate-500">
              Radial: {String(radial).padStart(3, '0')}° FROM VOR
            </div>
          </div>
        </div>

        {/* VOR Instrument Face */}
        <div className="flex flex-col items-center gap-6">
          <div className="w-48 h-48 rounded-full bg-slate-950 border-4 border-slate-800 relative flex flex-col items-center justify-center shadow-2xl">
            {/* Instrument Compass Ring Rotation Indicator */}
            <div 
              className="absolute inset-2 border-2 border-slate-900 rounded-full transition-transform duration-200"
              style={{ transform: `rotate(${-obs}deg)` }}
            >
              {/* Card N, E, S, W markings */}
              <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[10px] font-black text-white">N</span>
              <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">E</span>
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-400">S</span>
              <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">W</span>
            </div>

            {/* CDI Needle (Deflects left/right) */}
            <div 
              className="w-1.5 h-36 bg-orange-500 rounded-full absolute transition-all duration-300"
              style={{ transform: `translateX(${needleDeflection * 4}px)` }}
            />

            {/* Scale Dots (CDI Center Scale) */}
            <div className="absolute flex gap-4 text-[6px] text-slate-600 font-bold pointer-events-none">
              <span>•</span><span>•</span><span>[ ]</span><span>•</span><span>•</span>
            </div>

            {/* TO/FROM/OFF Flag Screen */}
            <div className="absolute bottom-8 px-2 py-0.5 bg-slate-900 border border-white/5 rounded text-[10px] font-black font-mono tracking-wider">
              {toFromFlag === 'TO' && <span className="text-emerald-400">▲ TO</span>}
              {toFromFlag === 'FROM' && <span className="text-blue-400">▼ FROM</span>}
              {toFromFlag === 'OFF' && <span className="text-red-500">■ OFF</span>}
            </div>

            {/* OBS Course Pointer index */}
            <div className="absolute top-1 w-2 h-2 bg-blue-500 rotate-45 border border-slate-950" />
          </div>

          {/* OBS Dial Slider */}
          <div className="w-full space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex justify-between">
              <span>Rotate OBS Course Dial</span>
              <span className="font-mono text-blue-400">{String(obs).padStart(3, '0')}°</span>
            </label>
            <input
              type="range"
              min="1"
              max="360"
              step="1"
              value={obs}
              onChange={(e) => setObs(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------
   WIDGET 5: METAR Weather Code Breaker
------------------------------------------------------------- */
const METARWidget: React.FC = () => {
  const [selectedToken, setSelectedToken] = useState<string | null>(null);

  const tokens = [
    { code: "KPDX", desc: "Airport Identifier", explanation: "KPDX represents Portland International Airport, Oregon, USA." },
    { code: "151653Z", desc: "Observation Time", explanation: "Observed on the 15th day of the month at 16:53 UTC (Zulu time)." },
    { code: "31012G18KT", desc: "Wind Direction & Speed", explanation: "Winds are coming from 310 degrees at 12 knots, with gust velocities reaching up to 18 knots." },
    { code: "10SM", desc: "VFR Visibility", explanation: "Horizontal visibility is 10 Statute Miles, indicating excellent visual weather conditions." },
    { code: "SCT025", desc: "Scattered Cloud Layers", explanation: "Scattered cloud layers present at 2,500 feet above ground level (AGL). Covers 3/8 to 4/8 of the sky." },
    { code: "BKN040", desc: "Broken Sky Coverage", explanation: "Broken cloud ceiling present at 4,000 feet AGL. Covers 5/8 to 7/8 of the sky. This constitutes a ceiling." },
    { code: "18/12", desc: "Temperature & Dewpoint", explanation: "Ambient air temperature is 18°C, and the dewpoint temperature is 12°C. The close split indicates moderate humidity." },
    { code: "A3002", desc: "Altimeter Setting", explanation: "The atmospheric pressure correction factor is 30.02 inches of mercury (inHg). Adjust this on the altimeter's subscale." }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
        <Eye className="text-blue-400" size={24} />
        <div>
          <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">METAR Weather Code Breaker</h4>
          <p className="text-[11px] text-slate-400 leading-normal">Click on any section of the raw weather report string below to decode and explain its coding rules.</p>
        </div>
      </div>

      {/* METAR Code String Block */}
      <div className="flex flex-wrap gap-2.5 p-6 bg-slate-950/60 border border-white/5 rounded-2xl">
        {tokens.map((tk, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedToken(tk.code)}
            className={`px-3 py-2 rounded-xl font-mono text-base font-bold transition-all border ${
              selectedToken === tk.code
                ? 'bg-blue-600 text-white border-blue-500/50 shadow-md scale-105'
                : 'bg-slate-900/60 text-slate-300 hover:text-white border-white/5'
            }`}
          >
            {tk.code}
          </button>
        ))}
      </div>

      {/* Explanation panel */}
      <div className="p-5 bg-slate-950/40 border border-white/5 rounded-2xl min-h-[120px]">
        {selectedToken ? (
          (() => {
            const tk = tokens.find(t => t.code === selectedToken)!;
            return (
              <div className="space-y-2 animate-in fade-in duration-300">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block">{tk.desc}</span>
                <h5 className="text-lg font-bold text-white">{tk.code}</h5>
                <p className="text-xs text-slate-300 leading-relaxed">{tk.explanation}</p>
              </div>
            );
          })()
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-500 h-full py-4 gap-2">
            <HelpCircle size={24} />
            <span className="text-xs">Click a segment of the METAR text block above to begin decoding.</span>
          </div>
        )}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------
   WIDGET 6: Weight & Balance Calculator
------------------------------------------------------------- */
const WeightBalanceWidget: React.FC = () => {
  const [frontPilot, setFrontPilot] = useState(170); // lbs
  const [rearPassenger, setRearPassenger] = useState(0); // lbs
  const [fuel, setFuel] = useState(30); // gallons (6lbs per gallon)
  const [baggage, setBaggage] = useState(10); // lbs

  // Constant parameters for Cessna 172-like model
  const emptyWeight = 1450; // lbs
  const emptyArm = 38.5; // inches

  // Arm lengths (inches aft of datum)
  const frontArm = 37.0;
  const rearArm = 73.0;
  const fuelArm = 48.0;
  const baggageArm = 95.0;

  // Weights
  const fuelWeight = fuel * 6.0;
  const totalWeight = emptyWeight + frontPilot + rearPassenger + fuelWeight + baggage;

  // Moments
  const emptyMoment = emptyWeight * emptyArm;
  const frontMoment = frontPilot * frontArm;
  const rearMoment = rearPassenger * rearArm;
  const fuelMoment = fuelWeight * fuelArm;
  const baggageMoment = baggage * baggageArm;
  const totalMoment = emptyMoment + frontMoment + rearMoment + fuelMoment + baggageMoment;

  // Center of Gravity
  const cg = totalWeight === 0 ? 0 : totalMoment / totalWeight;

  // Limits
  const maxWeight = 2400; // lbs
  const cgForwardLimit = 35.0; // inches
  const cgAftLimit = 47.3; // inches
  const isWithinLimits = totalWeight <= maxWeight && cg >= cgForwardLimit && cg <= cgAftLimit;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
        <Sliders className="text-blue-400" size={24} />
        <div>
          <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">Weight & Balance Lab</h4>
          <p className="text-[11px] text-slate-400 leading-normal">Load the aircraft compartments and watch the Center of Gravity (CG) relocate relative to safety envelopes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Loading Inputs */}
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex justify-between">
              <span>Front Seats (Pilot + Passenger)</span>
              <span className="font-mono text-blue-400">{frontPilot} lbs</span>
            </label>
            <input
              type="range"
              min="100"
              max="400"
              step="10"
              value={frontPilot}
              onChange={(e) => setFrontPilot(Number(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex justify-between">
              <span>Rear Passengers</span>
              <span className="font-mono text-blue-400">{rearPassenger} lbs</span>
            </label>
            <input
              type="range"
              min="0"
              max="400"
              step="10"
              value={rearPassenger}
              onChange={(e) => setRearPassenger(Number(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex justify-between">
              <span>Fuel (AVGAS)</span>
              <span className="font-mono text-blue-400">{fuel} gal ({fuel * 6} lbs)</span>
            </label>
            <input
              type="range"
              min="0"
              max="55"
              step="1"
              value={fuel}
              onChange={(e) => setFuel(Number(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex justify-between">
              <span>Baggage Compartment</span>
              <span className="font-mono text-blue-400">{baggage} lbs</span>
            </label>
            <input
              type="range"
              min="0"
              max="120"
              step="5"
              value={baggage}
              onChange={(e) => setBaggage(Number(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        </div>

        {/* Readouts & Envelope check */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl">
              <span className="text-xl font-mono font-black text-white">{totalWeight} lbs</span>
              <h5 className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-1">Total Weight (Max 2400)</h5>
            </div>
            <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl">
              <span className="text-xl font-mono font-black text-white">{cg.toFixed(2)} in</span>
              <h5 className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-1">Center of Gravity (CG)</h5>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-3 ${
            isWithinLimits 
              ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' 
              : 'bg-red-500/10 border-red-500/25 text-red-400'
          }`}>
            {isWithinLimits ? (
              <>
                <Check size={20} className="shrink-0" />
                <div>
                  <span className="block font-black uppercase tracking-wider">Weight & Balance OK</span>
                  <span className="text-[10px] font-normal text-slate-400 mt-0.5 block">CG is currently within limits ({cgForwardLimit} to {cgAftLimit} inches).</span>
                </div>
              </>
            ) : (
              <>
                <AlertTriangle size={20} className="shrink-0" />
                <div>
                  <span className="block font-black uppercase tracking-wider">Warning: Out of Limits!</span>
                  <span className="text-[10px] font-normal text-slate-400 mt-0.5 block">
                    {totalWeight > maxWeight 
                      ? 'Maximum gross takeoff weight exceeded!' 
                      : 'Center of Gravity (CG) lies outside the certified envelope limits.'}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------
   DEFAULT: Preflight Flight Planning Tool
------------------------------------------------------------- */
const DefaultFlightPrepWidget: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[300px] gap-4">
      <FileText className="text-blue-500/40" size={56} />
      <div>
        <h4 className="text-base font-bold text-white uppercase tracking-wider">Flight Training Laboratory</h4>
        <p className="text-xs text-slate-400 max-w-sm leading-relaxed mt-1">
          Review the lesson plan, notes, and quiz panels. Some lessons incorporate specialized cockpit gauges and weather tracking tools which display here.
        </p>
      </div>
    </div>
  );
};

export default PPLGroundSchool;
