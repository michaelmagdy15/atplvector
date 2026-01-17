import React, { useState, useEffect } from 'react';
import { Loader2, ArrowRight, HelpCircle, ImageIcon, Check, X, RotateCcw, ChevronLeft } from 'lucide-react';
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

            // Filter
            if (config.topics.length > 0) {
                // Check if question LO starts with any selected topic ID (e.g. 090.01)
                // Question LOs are like "090.01.01.01.01"
                allQuestions = allQuestions.filter(q =>
                    q.learningObjectives.some(lo =>
                        config.topics.some(topicId => lo.startsWith(topicId))
                    )
                );
            }
            // Todo: Implement other filters like 'unseen' logic using stats history if available

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
                {/* Main Question Area */}
                <div className="flex-1 overflow-y-auto px-4 lg:px-8 pb-20 custom-scrollbar">
                    <div className="max-w-4xl mx-auto py-8">
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-6">
                            <button onClick={() => { QBStorage.saveTest(currentTest); setView('DASHBOARD'); }} className="p-2 hover:bg-white/5 rounded-lg text-slate-400">
                                <ChevronLeft />
                            </button>
                            <div>
                                <h2 className="text-xl font-bold text-white mb-1">Question {currentTest.currentIndex + 1}</h2>
                                <div className="text-xs text-slate-500 font-mono uppercase">ID: {currentQ?.id}</div>
                            </div>
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
                                        <div className="flex items-center gap-2 mb-4 text-blue-400">
                                            <HelpCircle size={20} />
                                            <span className="font-bold uppercase tracking-wider text-sm">Explanation</span>
                                        </div>
                                        <p className="text-slate-300 leading-relaxed">
                                            {currentQ.explanation || "No explanation provided."}
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
