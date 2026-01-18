import React, { useState, useEffect } from 'react';
import { Loader2, ArrowRight, HelpCircle, ImageIcon, Check, X, RotateCcw, ChevronLeft, Flag, Save, Sparkles } from 'lucide-react';
import { Question, View, QBConfig, SavedTest, TestResult, TopicResult } from '../types';
import { QB_Dashboard } from './QB_Dashboard';
import { QB_Setup } from './QB_Setup';
import { QB_Grid } from './QB_Grid';
import { QB_Results } from './QB_Results';
import { QBStorage } from '../lib/qb_storage';
import syllabusMetadata from '../data/qb_metadata.json'; // Access to titles for results

const metadata = syllabusMetadata as { [key: string]: any[] };

interface QuestionBankProps {
    onChangeView: (view: View) => void;
}

type QBView = 'DASHBOARD' | 'SETUP' | 'PRACTICE' | 'RESULTS';

const QuestionBank: React.FC<QuestionBankProps> = ({ onChangeView }) => {
    const [view, setView] = useState<QBView>('DASHBOARD');
    const [currentTest, setCurrentTest] = useState<SavedTest | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]); // Current test questions
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<TestResult | null>(null);

    // Advanced Reporting State
    const [reportingQ, setReportingQ] = useState<Question | null>(null);
    const [reportData, setReportData] = useState({
        type: 'seen' as 'seen' | 'typo' | 'wrong_ans' | 'missing_annex',
        country: '',
        details: ''
    });

    const submitReport = () => {
        if (!reportingQ) return;
        // In a real app, send to Supabase here
        console.log("Submitting report:", { questionId: reportingQ.id, ...reportData });
        alert("Thank you! Your report has been submitted. Our team will review it shortly to keep the ECQB 2024 bank updated.");
        setReportingQ(null);
        setReportData({ type: 'seen', country: '', details: '' });
    };

    const [generatingAI, setGeneratingAI] = useState<string | null>(null); // questionId

    const handleAIExplanation = async (question: Question) => {
        setGeneratingAI(question.id);

        // Simulating AI request (Gemini 1.5 Flash)
        setTimeout(() => {
            const aiExp = `[AI GENERATED EXPLANATION]\nThis is a high-quality explanation for "${question.question}". In a real environment, this text would be the output of Gemini 1.5 Flash, providing technical reasoning for why choice ${String.fromCharCode(65 + question.correctAnswer)} is correct. This response is then saved to Supabase to serve all future students.`;

            // Update the local question object for immediate UI update
            question.explanation = aiExp;

            // In a real app, you'd also update the master list or send to Supabase
            console.log("Saving AI explanation to Supabase/DB for:", question.id);

            setGeneratingAI(null);
            alert("AI Explanation generated and saved for all students!");
        }, 1500);
    };

    // Timer
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (view === 'PRACTICE' && currentTest && !currentTest.isCompleted) {
            interval = setInterval(() => {
                setCurrentTest(prev => {
                    if (!prev) return null;
                    return { ...prev, timeSpent: (prev.timeSpent || 0) + 1 };
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [view, currentTest?.isCompleted]);

    // Save on unmount or view change
    useEffect(() => {
        if (currentTest && !currentTest.isCompleted) {
            QBStorage.saveTest(currentTest);
        }
    }, [currentTest]);

    const handleStartNew = (config: QBConfig) => {
        initializeTest(config);
    };

    const handleResume = async (test: SavedTest) => {
        setLoading(true);
        // Load questions for this test
        try {
            // In a real app we'd store question content in DB or fetch by ID.
            // Here we have to fetch the whole subject file and filter by IDs in SavedTest.
            const response = await fetch(`/question-bank/atpl/${test.subjectId}.json`);
            const allQuestions: Question[] = await response.json();

            // Map saved items to full question objects
            // Preserve order!
            const testQuestions = test.questionIds.map(id => allQuestions.find(q => q.id === id)).filter(Boolean) as Question[];

            setQuestions(testQuestions);
            setCurrentTest(test);
            setView('PRACTICE');
        } catch (e) {
            console.error(e);
            alert("Failed to resume session. Data might be missing.");
        } finally {
            setLoading(false);
        }
    };

    const initializeTest = async (config: QBConfig) => {
        setLoading(true);
        try {
            const response = await fetch(`/question-bank/atpl/${config.subjectId}.json`);
            if (!response.ok) throw new Error("Failed to load subject");

            let allQuestions: Question[] = await response.json();

            // Authority Filter
            if (config.filters.selectedAuthorities && config.filters.selectedAuthorities.length > 0) {
                allQuestions = allQuestions.filter(q =>
                    q.authorities && q.authorities.some(auth => config.filters.selectedAuthorities?.includes(auth))
                );
            }

            // Country Filter
            if (config.filters.selectedCountries && config.filters.selectedCountries.length > 0) {
                allQuestions = allQuestions.filter(q =>
                    q.countries && q.countries.some(country => config.filters.selectedCountries?.includes(country))
                );
            }

            // Recent Filter (Hot Points)
            if (config.filters.recentOnly) {
                allQuestions = allQuestions.filter(q => q.isRecent);
            }

            // Topic Filter
            if (config.topics.length > 0) {
                allQuestions = allQuestions.filter(q =>
                    q.learningObjectives.some(lo =>
                        config.topics.some(topicId => lo.startsWith(topicId))
                    )
                );
            }

            // Shuffle
            allQuestions = allQuestions.sort(() => Math.random() - 0.5);

            // Slice
            const selectedQuestions = allQuestions.slice(0, config.count);

            // Create SavedTest
            const newTest: SavedTest = {
                id: crypto.randomUUID(),
                name: `${config.mode === 'exam' ? 'Exam' : 'Study'} - ${new Date().toLocaleDateString()}`,
                subjectId: config.subjectId,
                mode: config.mode,
                questionIds: selectedQuestions.map(q => q.id),
                userAnswers: new Array(selectedQuestions.length).fill(null),
                userStatuses: new Array(selectedQuestions.length).fill('unseen'),
                currentIndex: 0,
                score: 0,
                timeSpent: 0,
                createdAt: new Date().toISOString(),
                lastResumedAt: new Date().toISOString(),
                isCompleted: false
            };

            setQuestions(selectedQuestions);
            setCurrentTest(newTest);
            setView('PRACTICE');
            QBStorage.saveTest(newTest);

        } catch (error) {
            console.error(error);
            alert("Error initializing test.");
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (optionIndex: number) => {
        if (!currentTest || !questions[currentTest.currentIndex]) return;

        const currentQ = questions[currentTest.currentIndex];
        const isCorrect = optionIndex === currentQ.correctAnswer;

        // Update state
        const newAnswers = [...currentTest.userAnswers];
        const newStatuses = [...currentTest.userStatuses];

        // If already answered, don't change in exam mode maybe? But usually allow changing.
        // For now, let's allow changing answer if not completed, but in 'Study' mode showing explanation might lock it?
        // Let's assume one-shot for simplicity or until reset.

        if (newAnswers[currentTest.currentIndex] !== null) return; // Prevent changing for now

        newAnswers[currentTest.currentIndex] = optionIndex;
        newStatuses[currentTest.currentIndex] = isCorrect ? 'correct' : 'incorrect';

        const newScore = isCorrect ? currentTest.score + 1 : currentTest.score;

        setCurrentTest({
            ...currentTest,
            userAnswers: newAnswers,
            userStatuses: newStatuses,
            score: newScore
        });
    };

    const handleFinish = () => {
        if (!currentTest) return;

        // Prepare results
        const topicMap = new Map<string, { total: number, correct: number, title: string }>();

        questions.forEach((q, idx) => {
            const isCorrect = currentTest.userStatuses[idx] === 'correct';
            // Use first LO as primary topic
            // Find the robust topic ID (e.g. 090.01) from metadata if possible
            const lo = q.learningObjectives[0] || 'Unknown';
            // Try to find matching topic in metadata (e.g. first 3 parts 090.01.01)
            let topicId = lo.split('.').slice(0, 3).join('.');
            // Fallback to 2 parts if not found or if syllabus is simpler
            let topicMeta = metadata[currentTest.subjectId]?.find(t => t.id === topicId);
            if (!topicMeta) {
                topicId = lo.split('.').slice(0, 2).join('.');
                topicMeta = metadata[currentTest.subjectId]?.find(t => t.id === topicId);
            }

            const title = topicMeta?.title || topicId;

            if (!topicMap.has(topicId)) {
                topicMap.set(topicId, { total: 0, correct: 0, title });
            }
            const entry = topicMap.get(topicId)!;
            entry.total++;
            if (isCorrect) entry.correct++;
        });

        const topicBreakdown: TopicResult[] = Array.from(topicMap.entries()).map(([id, data]) => ({
            topicId: id,
            title: data.title,
            total: data.total,
            correct: data.correct
        }));

        const result: TestResult = {
            testId: currentTest.id,
            score: currentTest.score,
            totalQuestions: currentTest.questionIds.length,
            timeSpent: currentTest.timeSpent,
            topicBreakdown,
            areasForImprovement: []
        };

        // Update Stats
        QBStorage.updateStats({
            score: (result.score / result.totalQuestions) * 100,
            type: currentTest.mode,
            seenCount: result.totalQuestions
        });

        // Mark complete
        const completedTest = { ...currentTest, isCompleted: true };
        QBStorage.saveTest(completedTest);
        // Maybe move to 'archived' storage later to keep 'Saved' list clean? 
        // For now, saveTest keeps it and we can filter completed ones in dashboard if we want, 
        // but user asked for "resume", so maybe we delete completed ones from "resume" list or move to history.
        // I'll keep it simple: Finished tests are removed from "Resume" list in Dashboard (I should update getSavedTests logic or filter there).
        // Actually, let's just delete it from saved list as it's done. History is in stats.
        QBStorage.deleteTest(currentTest.id);

        setResult(result);
        setView('RESULTS');
    };

    if (view === 'DASHBOARD') {
        return <QB_Dashboard onStartNew={() => setView('SETUP')} onResume={handleResume} />;
    }

    if (view === 'SETUP') {
        return <QB_Setup onStart={handleStartNew} onCancel={() => setView('DASHBOARD')} />;
    }

    if (view === 'RESULTS' && result) {
        return <QB_Results result={result} onHome={() => setView('DASHBOARD')} />;
    }

    if (view === 'PRACTICE' && currentTest) {
        const currentQ = questions[currentTest.currentIndex];

        return (
            <div className="flex h-screen bg-slate-950 pt-20 pb-4 overflow-hidden animate-in fade-in duration-500">
                {/* Reporting Modal */}
                {reportingQ && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                        <div className="glass-panel w-full max-w-lg rounded-3xl p-8 shadow-2xl border border-white/10 animate-in zoom-in-95 duration-300">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Flag size={20} className="text-red-500" />
                                    Report Question / Seen in Exam
                                </h3>
                                <button onClick={() => setReportingQ(null)} className="p-2 hover:bg-white/5 rounded-lg text-slate-400">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">Report Type</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { id: 'seen', label: 'Seen in Exam', icon: '📝' },
                                            { id: 'typo', label: 'Typo / Error', icon: '✍️' },
                                            { id: 'wrong_ans', label: 'Wrong Answer', icon: '❌' },
                                            { id: 'missing_annex', label: 'Missing Annex', icon: '🖼️' },
                                        ].map(type => (
                                            <button
                                                key={type.id}
                                                onClick={() => setReportData({ ...reportData, type: type.id as any })}
                                                className={`p-4 rounded-2xl border-2 transition-all text-left flex items-center gap-3 ${reportData.type === type.id ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-slate-800/50 border-white/5 text-slate-400 hover:bg-slate-800'}`}
                                            >
                                                <span className="text-xl">{type.icon}</span>
                                                <span className="font-bold text-xs">{type.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">Exam Authority / Country</label>
                                    <select
                                        value={reportData.country}
                                        onChange={(e) => setReportData({ ...reportData, country: e.target.value })}
                                        className="w-full bg-slate-800 border-white/5 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="">Select Authority...</option>
                                        <option value="UK">UK CAA</option>
                                        <option value="AT">Austro Control</option>
                                        <option value="IE">Irish Aviation (IAA)</option>
                                        <option value="DE">Germany (LBA)</option>
                                        <option value="FR">France (DGAC)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">Additional details (Optional)</label>
                                    <textarea
                                        value={reportData.details}
                                        onChange={(e) => setReportData({ ...reportData, details: e.target.value })}
                                        placeholder="e.g. 'This question appeared exactly as is in my UK exam today...'"
                                        className="w-full h-24 bg-slate-800 border-white/5 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none text-sm"
                                    />
                                </div>

                                <button
                                    onClick={submitReport}
                                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                                >
                                    <Save size={18} />
                                    Submit Report
                                </button>
                                <p className="text-[10px] text-center text-slate-600 px-4">
                                    Your feedback helps us maintain the most accurate ECQB 2024 database. Multiple reports of the same question will trigger a "Hot Point" badge for all users.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Question Area */}
                <div className="flex-1 overflow-y-auto px-4 lg:px-8 pb-20 custom-scrollbar">
                    <div className="max-w-4xl mx-auto py-8">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <button onClick={() => { QBStorage.saveTest(currentTest); setView('DASHBOARD'); }} className="p-2 hover:bg-white/5 rounded-lg text-slate-400">
                                    <ChevronLeft />
                                </button>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h2 className="text-xl font-bold text-white">Question {currentTest.currentIndex + 1}</h2>
                                        {currentQ?.isRecent && (
                                            <span className="bg-amber-500/10 text-amber-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/20 flex items-center gap-1 animate-pulse">
                                                <Flag size={10} fill="currentColor" />
                                                HOT POINT
                                            </span>
                                        )}
                                        {currentQ?.countries?.map(country => (
                                            <span key={country} className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-500/20">
                                                SEEN IN {country}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                                        <span>ID: {currentQ?.id}</span>
                                        {currentQ?.lastSeen && (
                                            <span className="flex items-center gap-1 text-slate-600">
                                                <RotateCcw size={10} />
                                                Reported: {new Date(currentQ.lastSeen).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => { setReportingQ(currentQ); setReportData({ ...reportData, type: 'seen' }); }}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 rounded-xl text-slate-400 hover:text-red-400 text-xs font-bold transition-all"
                            >
                                <HelpCircle size={14} />
                                Report / Seen in Exam
                            </button>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" /></div>
                        ) : currentQ ? (
                            <div className="space-y-6">
                                {/* Question Content */}
                                <div className="glass-card rounded-3xl p-8 relative shadow-2xl">
                                    {currentQ.annexes && currentQ.annexes.length > 0 && (
                                        <div className="mb-8 rounded-2xl overflow-hidden border border-white/5 bg-black/40 p-3">
                                            {currentQ.annexes.map(annexFile => (
                                                <img
                                                    key={annexFile}
                                                    src={`/question-bank/atpl/images/${annexFile}`}
                                                    alt="Annex"
                                                    className="max-w-full h-auto mx-auto rounded-xl"
                                                />
                                            ))}
                                        </div>
                                    )}
                                    <h2 className="text-xl md:text-2xl font-bold text-white leading-relaxed mb-10">
                                        {currentQ.question}
                                    </h2>
                                    <div className="grid grid-cols-1 gap-4">
                                        {currentQ.options.map((opt, idx) => {
                                            const answered = currentTest.userAnswers[currentTest.currentIndex] !== null;
                                            const selected = currentTest.userAnswers[currentTest.currentIndex] === idx;
                                            const isCorrect = idx === currentQ.correctAnswer;

                                            // Styles
                                            let style = "border-white/5 bg-white/5 hover:bg-white/10 text-slate-300";
                                            if (answered) {
                                                if (isCorrect) style = "border-green-500/50 bg-green-500/10 text-green-400";
                                                else if (selected) style = "border-red-500/50 bg-red-500/10 text-red-400";
                                                else style = "border-white/5 bg-white/5 opacity-50";
                                            }

                                            return (
                                                <button
                                                    key={idx}
                                                    disabled={answered}
                                                    onClick={() => handleAnswer(idx)}
                                                    className={`w-full text-left p-6 rounded-2xl border-2 transition-all flex items-start gap-4 ${style}`}
                                                >
                                                    <div className={`mt-0.5 w-6 h-6 rounded border flex items-center justify-center text-xs font-bold
                                                        ${answered && isCorrect ? 'bg-green-500 border-green-500 text-white' :
                                                            answered && selected ? 'bg-red-500 border-red-500 text-white' : 'border-slate-600'}
                                                     `}>
                                                        {String.fromCharCode(65 + idx)}
                                                    </div>
                                                    <span className="flex-1">{opt}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Explanation - Show immediately in Study mode if answered */}
                                {currentTest.mode === 'study' && currentTest.userAnswers[currentTest.currentIndex] !== null && (
                                    <div className="glass-panel p-8 rounded-3xl border-l-4 border-blue-500 animate-in slide-in-from-bottom-2 fade-in">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2 text-blue-400">
                                                <HelpCircle size={20} />
                                                <span className="font-bold uppercase tracking-wider text-sm">Explanation</span>
                                            </div>
                                            {!currentQ.explanation && (
                                                <button
                                                    onClick={() => handleAIExplanation(currentQ)}
                                                    disabled={generatingAI === currentQ.id}
                                                    className="flex items-center gap-2 px-4 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 rounded-full text-[10px] font-bold border border-blue-500/20 transition-all disabled:opacity-50"
                                                >
                                                    {generatingAI === currentQ.id ? (
                                                        <Loader2 size={12} className="animate-spin" />
                                                    ) : (
                                                        <Sparkles size={12} />
                                                    )}
                                                    {generatingAI === currentQ.id ? 'GENERATING...' : 'GENERATE WITH AI'}
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                                            {currentQ.explanation || (
                                                <span className="text-slate-500 italic">No explanation yet. Click the "GENERATE WITH AI" button to create one for everyone!</span>
                                            )}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {currentQ.learningObjectives.map(lo => (
                                                <span key={lo} className="text-[10px] font-bold px-2 py-1 rounded bg-slate-800 text-slate-500">
                                                    LO {lo}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Navigation Footer */}
                                <div className="flex justify-between items-center pt-8">
                                    <button
                                        onClick={() => setCurrentTest({ ...currentTest, currentIndex: Math.max(0, currentTest.currentIndex - 1) })}
                                        disabled={currentTest.currentIndex === 0}
                                        className="px-6 py-3 rounded-xl bg-slate-800 text-slate-400 hover:text-white disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setCurrentTest({ ...currentTest, currentIndex: Math.min(questions.length - 1, currentTest.currentIndex + 1) })}
                                        disabled={currentTest.currentIndex === questions.length - 1}
                                        className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg disabled:opacity-50 disabled:bg-slate-800"
                                    >
                                        Next Question
                                    </button>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>

                {/* Right Sidebar - Grid */}
                <div className="w-80 border-l border-white/10 bg-slate-900/50 p-4 hidden lg:block">
                    <QB_Grid
                        total={questions.length}
                        current={currentTest.currentIndex}
                        statuses={currentTest.userStatuses}
                        onNavigate={(i) => setCurrentTest({ ...currentTest, currentIndex: i })}
                        onSave={() => { QBStorage.saveTest(currentTest); setView('DASHBOARD'); }}
                        onFinish={handleFinish}
                        timeLeft={currentTest.mode === 'exam' ? (90 * 60) - currentTest.timeSpent : undefined}
                    />
                </div>
            </div>
        );
    }

    return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto" /></div>;
};

export default QuestionBank;
