import React, { useState, useEffect, lazy, Suspense } from 'react';
import { LandingView } from './LandingView';
import { KeyboardHelp } from './KeyboardHelp';
import { useFAAProgress } from '../../hooks/useFAAProgress';
import { setProgressUserId } from '../../lib/faaProgressTracker';
import { FAAQuestion as Question, FAATestMode as TestMode, View } from '../../types';
import { getFAAQuestions } from '../../lib/faaQuestionsData';
import { ArrowLeft, Sparkles, Plane, Loader2 } from 'lucide-react';
import { sfx } from '../../utils/sfx';

const QuestionView = lazy(() => import('./QuestionView').then(m => ({ default: m.QuestionView })));
const C172Hub = lazy(() => import('../c172/C172Hub').then(m => ({ default: m.C172Hub })));
const QuizMode = lazy(() => import('./QuizMode').then(m => ({ default: m.QuizMode })));
const QuizSetup = lazy(() => import('./QuizSetup').then(m => ({ default: m.QuizSetup })));
const PracticeExam = lazy(() => import('./PracticeExam').then(m => ({ default: m.PracticeExam })));
const PPLStudyGuide = lazy(() => import('../ppl-guide/PPLStudyGuide').then(m => ({ default: m.PPLStudyGuide })));

const pplChapterTitles: Record<string, string> = {
  "1": "Discovering Aviation", "2": "Airplane Systems", "3": "Aerodynamic Principles",
  "4": "The Flight Environment", "5": "Communication and Flight Information",
  "6": "Meteorology for Pilots", "7": "Interpreting Weather Data", "8": "Airplane Performance",
  "9": "Navigation", "10": "Human Factors", "11": "Flying Cross-Country", "12": "Regulations & Airspace"
};
const irChapterTitles: Record<string, string> = {
  "1": "IFR Regulations & Pilot Requirements", "2": "IFR Flight Planning & Weather Services",
  "3": "Meteorology & Weather Products", "4": "IFR En Route Operations",
  "5": "IFR Approach Procedures & Minima", "6": "Navigation Systems & GPS",
  "7": "Aircraft Instruments & Avionics", "8": "Aeromedical Factors & ADM",
};
const cplChapterTitles: Record<string, string> = {
  "1": "Pilot Qualifications & Regulations", "2": "Aircraft Systems",
  "3": "Preflight & Weather Services", "9": "Flight Planning & Performance",
  "11": "Advanced Systems", "12": "Aerodynamics & Performance Limitations",
  "13": "Navigation & Cross-Country", "14": "Maneuvers & Emergency Procedures",
};
const airlineChapterTitles: Record<string, string> = {
  "1": "Performance", "2": "Meteorology", "3": "Aerodynamics",
  "4": "Flight Controls", "5": "Instrument Navigation", "6": "Weight and Balance",
  "7": "Flight Planning", "8": "Jeppesen", "9": "ATC", "10": "Propulsion System",
};

const getChapter = (id: string) => id.split('-')[1] ?? id.split('-')[0];

const getChapters = (data: Question[], titleMap: Record<string, string>) => {
  const chapterMap = new Map<string, number>();
  data.forEach((q: Question) => {
    const chap = getChapter(q.id);
    chapterMap.set(chap, (chapterMap.get(chap) || 0) + 1);
  });
  return Array.from(chapterMap.entries())
    .map(([id, total]) => ({ id, title: titleMap[id] || `Chapter ${id}`, total }))
    .sort((a, b) => parseInt(a.id) - parseInt(b.id));
};

const titleMap: Record<TestMode, Record<string, string>> = {
  ppl: pplChapterTitles, ir: irChapterTitles, cpl: cplChapterTitles, c172: {},
  airline: airlineChapterTitles,
};
const prefixMap: Record<TestMode, string> = {
  ppl: 'faa_ppl_progress', ir: 'faa_ir_progress', cpl: 'faa_cpl_progress', c172: 'faa_c172_progress',
  airline: 'faa_airline_progress',
};

type ViewMode = 'landing' | 'chapter' | 'quiz-setup' | 'quiz' | 'exam' | 'ppl-study';

interface FAATestGuideProps {
  onChangeView?: (view: View) => void;
  initialMode?: TestMode;
}

export const FAATestGuide: React.FC<FAATestGuideProps> = ({ onChangeView, initialMode = 'ppl' }) => {
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<TestMode>(initialMode);
  const [viewMode, setViewMode] = useState<ViewMode>('landing');
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [reviewMode, setReviewMode] = useState(false);
  const [questionsData, setQuestionsData] = useState<Question[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [quizCategory, setQuizCategory] = useState('all');
  const [examType, setExamType] = useState<'ppl' | 'ir' | 'cpl' | 'airline'>('ppl');

  // Load questions when mode changes
  useEffect(() => {
    let active = true;
    setLoading(true);
    getFAAQuestions(mode).then((questions) => {
      if (active) {
        setQuestionsData(questions);
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, [mode]);

  const progressPrefix = prefixMap[mode];
  const chapters = getChapters(questionsData, titleMap[mode]);

  const { chapterProgress, reviewQuestions, resetAllProgress, resetChapterProgress } = useFAAProgress(
    progressPrefix, questionsData, selectedChapter, reviewMode
  );

  const handleModeSwitch = (newMode: TestMode) => {
    setMode(newMode);
    setViewMode('landing');
    setSelectedChapter(null);
    setReviewMode(false);
  };

  const handleSelectChapter = (chapter: string) => {
    setSelectedChapter(chapter);
    setReviewMode(false);
    setViewMode('chapter');
  };

  const handleSelectReview = () => {
    if (reviewQuestions.length > 0) {
      setSelectedChapter('REVIEW');
      setReviewMode(true);
      setViewMode('chapter');
    }
  };

  const handleBack = () => {
    setViewMode('landing');
    setSelectedChapter(null);
    setReviewMode(false);
  };

  const handleNavigateToQuestion = (questionId: string) => {
    const question = questionsData.find((q: Question) => q.id === questionId);
    if (question) {
      setSelectedChapter(getChapter(question.id));
      setReviewMode(false);
      setViewMode('chapter');
    }
  };

  const handleStartQuiz = (selected: Question[], category: string) => {
    setQuizQuestions(selected);
    setQuizCategory(category);
    setViewMode('quiz');
  };

  const handleStartExam = (type: 'ppl' | 'ir' | 'cpl' | 'airline') => {
    setExamType(type);
    setViewMode('exam');
  };

  const handleOpenStudyGuide = () => {
    setViewMode('ppl-study');
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '350px', gap: '1rem', color: 'var(--text-secondary)' }}>
          <Loader2 size={36} className="animate-spin" style={{ color: '#38bdf8' }} />
          <span style={{ fontSize: '0.95rem' }}>Loading FAA Question Bank...</span>
        </div>
      );
    }

    if (mode === 'c172') {
      return (
        <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Cessna 172 Hub...</div>}>
          <C172Hub onModeSwitch={handleModeSwitch} onBack={handleBack} />
        </Suspense>
      );
    }

    switch (viewMode) {
      case 'quiz':
        return (
          <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Quiz...</div>}>
            <QuizMode questions={quizQuestions} category={quizCategory} mode={mode} onBack={handleBack} />
          </Suspense>
        );
      case 'exam':
        return (
          <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Exam Simulator...</div>}>
            <PracticeExam questions={questionsData} mode={mode} examType={examType} onBack={handleBack} />
          </Suspense>
        );
      case 'ppl-study':
        return (
          <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading PPL Study Guide...</div>}>
            <PPLStudyGuide onBack={handleBack} />
          </Suspense>
        );
      case 'quiz-setup':
        return (
          <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Setup...</div>}>
            <QuizSetup questions={questionsData} mode={mode} onStart={handleStartQuiz} onClose={handleBack} />
          </Suspense>
        );
      case 'chapter':
        return selectedChapter ? (
          <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Questions...</div>}>
            <QuestionView
              chapter={selectedChapter}
              questions={reviewMode ? reviewQuestions : questionsData.filter((q: Question) => getChapter(q.id) === selectedChapter)}
              onBack={handleBack}
              mode={mode}
              progressPrefix={progressPrefix}
            />
          </Suspense>
        ) : null;
      default:
        return (
          <LandingView
            mode={mode}
            onModeSwitch={handleModeSwitch}
            chapters={chapters}
            onSelect={handleSelectChapter}
            onReview={handleSelectReview}
            totalQuestions={questionsData.length}
            reviewCount={reviewQuestions.length}
            chapterProgress={chapterProgress}
            onResetAll={resetAllProgress}
            onResetChapter={resetChapterProgress}
            onNavigateToQuestion={handleNavigateToQuestion}
            onStartQuiz={() => setViewMode('quiz-setup')}
            onStartExam={handleStartExam}
            onStudyGuide={handleOpenStudyGuide}
          />
        );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, padding: '1rem', width: '100%', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Platform Navigation Breadcrumb */}
      {onChangeView && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <button
            onClick={() => { sfx.playSelect(); onChangeView(View.PLATFORM_DASHBOARD); }}
            onMouseEnter={() => sfx.playHover()}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.4rem 0.8rem', borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(15, 23, 42, 0.6)',
              color: '#94a3b8', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500,
              transition: 'all 0.2s ease',
            }}
          >
            <ArrowLeft size={14} />
            <span>Back to ATPL Vector Dashboard</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#64748b' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#38bdf8', fontWeight: 600 }}>
              <Plane size={14} /> FAA Knowledge Center
            </span>
            <span>•</span>
            <span>Zero-Latency Offline Mode Active</span>
          </div>
        </div>
      )}

      {/* Main FAA View Content */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        {renderContent()}
      </div>

      <KeyboardHelp />
    </div>
  );
};

export default FAATestGuide;
