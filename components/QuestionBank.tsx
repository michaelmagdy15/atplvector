import React, { useState, useEffect } from 'react';
import { BookOpen, Check, X, ArrowRight, Loader2, Image as ImageIcon, LayoutGrid, RotateCcw, HelpCircle, ChevronLeft } from 'lucide-react';
import { Question, View } from '../types';

interface QuestionBankProps {
    onChangeView: (view: View) => void;
}

const subjects = [
    { id: '010', name: 'Air Law', color: 'red' },
    { id: '021', name: 'Aircraft General Knowledge', color: 'orange' },
    { id: '022', name: 'Instrumentation', color: 'amber' },
    { id: '031', name: 'Mass & Balance', color: 'yellow' },
    { id: '032', name: 'Performance', color: 'lime' },
    { id: '033', name: 'Flight Planning', color: 'green' },
    { id: '040', name: 'Human Performance', color: 'emerald' },
    { id: '050', name: 'Meteorology', color: 'teal' },
    { id: '061', name: 'General Navigation', color: 'cyan' },
    { id: '062', name: 'Radio Navigation', color: 'sky' },
    { id: '070', name: 'Operational Procedures', color: 'indigo' },
    { id: '081', name: 'Principles of Flight', color: 'violet' },
    { id: '090', name: 'Communications', color: 'blue' },
];

const QuestionBank: React.FC<QuestionBankProps> = ({ onChangeView }) => {
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [quizMode, setQuizMode] = useState<'browse' | 'practice'>('browse');
    const [score, setScore] = useState(0);
    const [answeredCount, setAnsweredCount] = useState(0);

    useEffect(() => {
        if (selectedSubject) {
            loadQuestions(selectedSubject);
        }
    }, [selectedSubject]);

    const loadQuestions = async (subjectId: string) => {
        setLoading(true);
        try {
            const response = await fetch(`/question-bank/atpl/${subjectId}.json`);
            if (!response.ok) throw new Error('Failed to load questions');
            const data = await response.json();
            // Shuffle for practice
            setQuestions(data.sort(() => Math.random() - 0.5));
            setCurrentIndex(0);
            setAnsweredCount(0);
            setScore(0);
            setQuizMode('practice');
        } catch (error) {
            console.error('Error loading questions:', error);
            alert('Could not load questions for this subject.');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (idx: number) => {
        if (userAnswer !== null) return;
        setUserAnswer(idx);
        setShowExplanation(true);
        setAnsweredCount(prev => prev + 1);
        if (idx === questions[currentIndex].correctAnswer) {
            setScore(prev => prev + 1);
        }
    };

    const nextQuestion = () => {
        setUserAnswer(null);
        setShowExplanation(false);
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setQuizMode('browse');
            setSelectedSubject(null);
        }
    };

    const resetQuiz = () => {
        setCurrentIndex(0);
        setUserAnswer(null);
        setShowExplanation(false);
        setScore(0);
        setAnsweredCount(0);
    };

    const getColorStyles = (color: string) => {
        const styles: Record<string, string> = {
            red: 'from-red-500 to-rose-600',
            orange: 'from-orange-500 to-amber-600',
            amber: 'from-amber-400 to-orange-500',
            yellow: 'from-yellow-400 to-orange-500',
            lime: 'from-lime-400 to-green-500',
            green: 'from-green-500 to-emerald-600',
            emerald: 'from-emerald-500 to-teal-600',
            teal: 'from-teal-400 to-cyan-500',
            cyan: 'from-cyan-400 to-sky-500',
            sky: 'from-sky-400 to-blue-500',
            blue: 'from-blue-500 to-indigo-600',
            indigo: 'from-indigo-500 to-violet-600',
            violet: 'from-violet-500 to-purple-600',
            purple: 'from-purple-500 to-fuchsia-600',
            pink: 'from-pink-500 to-rose-600',
        };
        return styles[color] || styles['blue'];
    };

    if (quizMode === 'browse') {
        return (
            <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-700">
                <div className="mb-10">
                    <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Question Bank</h1>
                    <p className="text-slate-400">Master the syllabus with over 15,000 official ATPL questions. Choose a subject to begin.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subjects.map(subject => (
                        <div
                            key={subject.id}
                            onClick={() => setSelectedSubject(subject.id)}
                            className="group relative glass-card rounded-2xl p-1 overflow-hidden transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                        >
                            <div className="bg-slate-900/40 rounded-xl p-6 relative overflow-hidden flex flex-col min-h-[140px]">
                                <div className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br ${getColorStyles(subject.color)} rounded-full blur-[40px] opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-2 rounded-lg bg-gradient-to-br ${getColorStyles(subject.color)} opacity-80 shadow-lg`}>
                                        <BookOpen size={20} className="text-white" />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Subject {subject.id}</span>
                                </div>
                                <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">{subject.name}</h3>
                                <div className="mt-auto flex items-center text-xs font-bold text-slate-500 group-hover:text-white transition-colors">
                                    <span>Start Practice</span>
                                    <ArrowRight className="ml-auto w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto min-h-screen pb-24 animate-in slide-in-from-right-4 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 glass-panel p-4 rounded-2xl">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setQuizMode('browse')}
                        className="flex items-center text-slate-400 hover:text-white transition-colors font-bold text-sm"
                    >
                        <ChevronLeft size={18} className="mr-1" /> Back
                    </button>
                    <div className="h-4 w-px bg-white/10"></div>
                    <span className="text-white font-bold text-sm hidden md:block">
                        {subjects.find(s => s.id === selectedSubject)?.name}
                    </span>
                </div>
                <div className="flex items-center space-x-6">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">
                        Question {currentIndex + 1} of {questions.length}
                    </div>
                    <div className="text-sm font-black text-green-400">
                        {score} / {answeredCount}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-24">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                    <p className="text-slate-400 animate-pulse font-medium">Downloading question database...</p>
                </div>
            ) : currentQuestion ? (
                <div className="space-y-6">
                    {/* Question Card */}
                    <div className="glass-card rounded-3xl p-8 relative overflow-hidden shadow-2xl">
                        {/* Annexes Container */}
                        {currentQuestion.annexes && currentQuestion.annexes.length > 0 && (
                            <div className="mb-8 rounded-2xl overflow-hidden border border-white/5 bg-black/40 p-3 shadow-inner">
                                {currentQuestion.annexes.map(annexFile => (
                                    <img
                                        key={annexFile}
                                        src={`/question-bank/atpl/images/${annexFile}`}
                                        alt="Question Annex"
                                        className="max-w-full h-auto mx-auto rounded-xl"
                                    />
                                ))}
                                <div className="mt-3 text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                                    <ImageIcon size={12} /> Figure Attached
                                </div>
                            </div>
                        )}

                        <h2 className="text-xl md:text-2xl font-bold text-white leading-relaxed mb-10">
                            {currentQuestion.question}
                        </h2>

                        <div className="grid grid-cols-1 gap-4">
                            {currentQuestion.options.map((opt, idx) => {
                                let statusClass = "border-white/5 bg-white/5 hover:border-blue-500/50 hover:bg-blue-500/5 text-slate-300";
                                if (userAnswer !== null) {
                                    if (idx === currentQuestion.correctAnswer) {
                                        statusClass = "border-green-500/50 bg-green-500/10 text-green-400";
                                    } else if (idx === userAnswer) {
                                        statusClass = "border-red-500/50 bg-red-500/10 text-red-400";
                                    } else {
                                        statusClass = "border-white/5 bg-white/5 opacity-40 text-slate-500 scale-[0.98]";
                                    }
                                }

                                return (
                                    <button
                                        key={idx}
                                        disabled={userAnswer !== null}
                                        onClick={() => handleAnswer(idx)}
                                        className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 flex items-start gap-5 ${statusClass}`}
                                    >
                                        <div className={`mt-0.5 w-8 h-8 rounded-xl border-2 flex items-center justify-center flex-shrink-0 text-sm font-black transition-colors
                      ${userAnswer !== null && idx === currentQuestion.correctAnswer ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/20' :
                                                userAnswer !== null && idx === userAnswer ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20' : 'border-slate-700 text-slate-500'}
                    `}>
                                            {String.fromCharCode(65 + idx)}
                                        </div>
                                        <span className="flex-1 text-sm md:text-base font-medium leading-relaxed">{opt}</span>
                                        {userAnswer !== null && idx === currentQuestion.correctAnswer && (
                                            <div className="p-1 bg-green-500 rounded-full">
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                        {userAnswer !== null && idx === userAnswer && idx !== currentQuestion.correctAnswer && (
                                            <div className="p-1 bg-red-500 rounded-full">
                                                <X className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Explanation Area */}
                    {showExplanation && (
                        <div className="animate-in slide-in-from-bottom-6 fade-in duration-700">
                            <div className="glass-card rounded-3xl p-8 border-blue-500/30 bg-blue-500/5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <HelpCircle size={120} className="text-blue-400" />
                                </div>

                                <div className="relative z-10">
                                    <div className="flex items-center space-x-3 mb-6 text-blue-400">
                                        <HelpCircle className="w-6 h-6" />
                                        <h3 className="text-lg font-black uppercase tracking-tighter">Instructor Notes</h3>
                                    </div>

                                    <div className="text-slate-300 leading-relaxed text-base md:text-lg mb-10">
                                        {currentQuestion.explanation || "No complex theory for this one. The answer is straightforward as per the learning objectives."}
                                    </div>

                                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-white/10">
                                        <div className="flex flex-wrap gap-2">
                                            {currentQuestion.learningObjectives.map(lo => (
                                                <span key={lo} className="text-[10px] font-bold px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-white/5">
                                                    LO {lo}
                                                </span>
                                            ))}
                                        </div>
                                        <button
                                            onClick={nextQuestion}
                                            className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-500/25 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                                        >
                                            Next Briefing <ArrowRight className="w-5 h-5 ml-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : null}

            {/* Control Bar - HUD style */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
                <div className="flex items-center gap-2 p-1.5 bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl">
                    <button
                        onClick={resetQuiz}
                        className="p-3 text-slate-400 hover:text-white transition-all hover:bg-white/5 rounded-xl"
                        title="Reset Practice"
                    >
                        <RotateCcw size={20} />
                    </button>
                    <div className="w-px h-6 bg-white/10 mx-1"></div>
                    <button
                        onClick={() => setQuizMode('browse')}
                        className="px-5 py-3 text-slate-400 hover:text-white transition-all hover:bg-white/5 rounded-xl flex items-center gap-2 font-bold text-xs uppercase tracking-wider"
                        title="Change Subject"
                    >
                        <LayoutGrid size={18} />
                        <span>Subjects</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuestionBank;
