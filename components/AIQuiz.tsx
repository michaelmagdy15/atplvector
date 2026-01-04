import React, { useState } from 'react';
import { generateQuizQuestion } from '../services/gemini';
import { QuizQuestion } from '../types';
import { Brain, Check, X, ArrowRight, Loader2 } from 'lucide-react';

const topics = [
  "Distress and Urgency",
  "VHF Propagation",
  "Q-Codes",
  "General Operating Procedures",
  "Weather Information (METAR/TAF)",
  "Transponder Codes"
];

const AIQuiz: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [selectedTopic, setSelectedTopic] = useState(topics[0]);
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setUserAnswer(null);
    setShowExplanation(false);
    const q = await generateQuizQuestion(selectedTopic);
    setQuestion(q);
    setLoading(false);
  };

  const handleAnswer = (idx: number) => {
    setUserAnswer(idx);
    setShowExplanation(true);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-slate-200 min-h-[500px] text-slate-900">
      <div className="flex items-center space-x-3 mb-6 border-b border-slate-100 pb-4">
        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
            <Brain className="w-6 h-6" />
        </div>
        <div>
            <h2 className="text-xl font-bold text-slate-800">AI Flight Examiner</h2>
            <p className="text-sm text-slate-500">Infinite questions generated from the syllabus.</p>
        </div>
      </div>

      {!question && !loading && (
        <div className="text-center py-12">
            <label className="block text-sm font-medium text-slate-700 mb-3">Choose a Topic to Review</label>
            <div className="flex flex-wrap gap-2 justify-center mb-6 max-w-lg mx-auto">
                {topics.map(t => (
                    <button
                        key={t}
                        onClick={() => setSelectedTopic(t)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                            ${selectedTopic === t ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
                        `}
                    >
                        {t}
                    </button>
                ))}
            </div>
            <button 
                onClick={handleGenerate}
                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
            >
                Start Quiz
            </button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-purple-600 animate-spin mb-4" />
            <p className="text-slate-500 font-medium animate-pulse">Consulting the manuals...</p>
        </div>
      )}

      {question && !loading && (
        <div>
            <div className="mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-1 rounded">
                    {selectedTopic}
                </span>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-6 leading-relaxed">
                {question.question}
            </h3>

            <div className="space-y-3 mb-6">
                {question.options.map((opt, idx) => {
                    let btnClass = "bg-white border-slate-200 hover:bg-slate-50";
                    if (userAnswer !== null) {
                        if (idx === question.correctAnswer) btnClass = "bg-green-100 border-green-300 text-green-800";
                        else if (idx === userAnswer && idx !== question.correctAnswer) btnClass = "bg-red-100 border-red-300 text-red-800";
                        else btnClass = "bg-slate-50 border-slate-200 opacity-50";
                    }

                    return (
                        <button
                            key={idx}
                            disabled={userAnswer !== null}
                            onClick={() => handleAnswer(idx)}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between group text-slate-800 ${btnClass}`}
                        >
                            <span>{opt}</span>
                            {userAnswer !== null && idx === question.correctAnswer && <Check className="w-5 h-5 text-green-600" />}
                            {userAnswer !== null && idx === userAnswer && idx !== question.correctAnswer && <X className="w-5 h-5 text-red-600" />}
                        </button>
                    )
                })}
            </div>

            {showExplanation && (
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h4 className="font-bold text-slate-800 mb-2">Explanation</h4>
                    <p className="text-slate-600 mb-4">{question.explanation}</p>
                    <button 
                        onClick={handleGenerate}
                        className="w-full py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 flex items-center justify-center"
                    >
                        Next Question <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default AIQuiz;