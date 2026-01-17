import React from 'react';
import { BookOpen } from 'lucide-react';

const AnnexList: React.FC = () => {
  const annexes = [
    { id: 1, title: 'Personnel Licensing', cat: 'Personnel' },
    { id: 2, title: 'Rules of the Air', cat: 'Ops' },
    { id: 3, title: 'Meteorological Service', cat: 'Env' },
    { id: 4, title: 'Aeronautical Charts', cat: 'Ops' },
    { id: 5, title: 'Units of Measurement', cat: 'Tech' },
    { id: 6, title: 'Operation of Aircraft', cat: 'Ops' },
    { id: 7, title: 'Aircraft Nationality & Registration', cat: 'Tech' },
    { id: 8, title: 'Airworthiness of Aircraft', cat: 'Tech' },
    { id: 9, title: 'Facilitation', cat: 'Admin' },
    { id: 10, title: 'Aeronautical Telecommunications', cat: 'Tech' },
    { id: 11, title: 'Air Traffic Services', cat: 'Ops' },
    { id: 12, title: 'Search and Rescue', cat: 'Safety' },
    { id: 13, title: 'Aircraft Accident Investigation', cat: 'Safety' },
    { id: 14, title: 'Aerodromes', cat: 'Infra' },
    { id: 15, title: 'Aeronautical Information Services', cat: 'Info' },
    { id: 16, title: 'Environmental Protection', cat: 'Env' },
    { id: 17, title: 'Security', cat: 'Security' },
    { id: 18, title: 'Transport of Dangerous Goods', cat: 'Safety' },
    { id: 19, title: 'Safety Management', cat: 'Safety' },
  ];

  const [mode, setMode] = React.useState<'list' | 'quiz'>('list');
  const [showTitles, setShowTitles] = React.useState(true);

  // Quiz state
  const [currentQuestion, setCurrentQuestion] = React.useState<number | null>(null);
  const [score, setScore] = React.useState(0);
  const [quizComplete, setQuizComplete] = React.useState(false);

  const startQuiz = () => {
    setMode('quiz');
    setScore(0);
    setQuizComplete(false);
    nextQuestion();
  };

  const nextQuestion = () => {
    const randomId = Math.floor(Math.random() * 19) + 1;
    setCurrentQuestion(randomId);
  };

  const handleAnswer = (annexId: number) => {
    if (annexId === currentQuestion) {
      setScore(s => s + 1);
      if (score + 1 >= 5) { // Win after 5 correct
        setQuizComplete(true);
      } else {
        nextQuestion();
      }
    } else {
      // Wrong answer - visual shake or feedback could go here
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600 rounded-lg text-white">
            <BookOpen size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">The 19 Annexes</h2>
            <p className="text-slate-400 text-sm">Chicago Convention Standard & Recommended Practices (SARPs)</p>
          </div>
        </div>

        <div className="flex gap-2">
          {mode === 'list' && (
            <button
              onClick={() => setShowTitles(!showTitles)}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-bold transition-colors"
            >
              {showTitles ? 'Hide Titles (Test Yourself)' : 'Show Titles'}
            </button>
          )}
          <button
            onClick={() => mode === 'list' ? startQuiz() : setMode('list')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold transition-colors"
          >
            {mode === 'list' ? 'Start Drill' : 'Back to List'}
          </button>
        </div>
      </div>

      {mode === 'quiz' ? (
        <div className="max-w-xl mx-auto text-center py-8 animate-in fade-in">
          {quizComplete ? (
            <div>
              <h3 className="text-3xl font-bold text-emerald-400 mb-4">Quiz Complete!</h3>
              <p className="text-slate-300 mb-8">You successfully identified 5 annexes correctly.</p>
              <button onClick={startQuiz} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold">Play Again</button>
            </div>
          ) : (
            <>
              <p className="text-slate-400 mb-2">Identify the correct Annex Number for:</p>
              <h3 className="text-2xl font-bold text-white mb-8 border-b border-slate-700 pb-8">
                {annexes.find(a => a.id === currentQuestion)?.title}
              </h3>

              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {Array.from({ length: 19 }, (_, i) => i + 1).map(num => (
                  <button
                    key={num}
                    onClick={() => handleAnswer(num)}
                    className="aspect-square bg-slate-700 hover:bg-slate-600 text-white font-black text-lg rounded-lg transition-all active:scale-95"
                  >
                    {num}
                  </button>
                ))}
              </div>
              <div className="mt-8 text-slate-500 text-sm font-mono">Current Score: {score}/5</div>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-in fade-in">
          {annexes.map((annex) => (
            <div key={annex.id} className="bg-slate-900 p-4 rounded-lg border border-slate-700 hover:border-indigo-500 transition-colors group relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-slate-800 px-2 py-1 rounded-bl text-[10px] font-bold text-slate-500 group-hover:text-white transition-colors">
                {annex.cat}
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-xl font-black text-slate-600 group-hover:text-indigo-500 transition-colors">{annex.id}</span>
                <span className="text-xs text-slate-500 uppercase font-bold">Annex</span>
              </div>
              <h3 className={`font-bold text-slate-200 text-sm leading-tight group-hover:text-white transition-all ${!showTitles ? 'opacity-0 group-hover:opacity-100 blur-sm group-hover:blur-0' : ''}`}>
                {annex.title}
              </h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnnexList;