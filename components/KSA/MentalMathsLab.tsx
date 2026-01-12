import React, { useState, useEffect } from 'react';
import { Calculator, RotateCw, Navigation, Watch, Check, X, Play, RefreshCw } from 'lucide-react';

const MentalMathsLab: React.FC = () => {
    const [tab, setTab] = useState<'RECIP' | '1IN60' | 'TSD'>('RECIP');

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-fuchsia-500/20 rounded-xl">
                    <Calculator className="w-8 h-8 text-fuchsia-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">
                        Mental Maths <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-pink-400">Lab</span>
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Sharpen your rapid calculation skills for the cockpit.
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                <TabButton id="RECIP" label="Reciprocals" icon={RotateCw} active={tab === 'RECIP'} onClick={() => setTab('RECIP')} />
                <TabButton id="1IN60" label="1 in 60 Rule" icon={Navigation} active={tab === '1IN60'} onClick={() => setTab('1IN60')} />
                <TabButton id="TSD" label="Time / Speed / Dist" icon={Watch} active={tab === 'TSD'} onClick={() => setTab('TSD')} />
            </div>

            {/* Content */}
            <div className="bg-slate-900/50 backdrop-blur border border-white/10 rounded-3xl p-8 min-h-[400px]">
                {tab === 'RECIP' && <ReciprocalsTrainer />}
                {tab === '1IN60' && <OneInSixtyTrainer />}
                {tab === 'TSD' && <TSDTrainer />}
            </div>
        </div>
    );
};

const TabButton: React.FC<any> = ({ label, icon: Icon, active, onClick }) => (
    <button
        onClick={onClick}
        className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap ${active
                ? 'bg-white text-slate-900 shadow-lg scale-105'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
    >
        <Icon size={18} />
        {label}
    </button>
);

// --- Sub-components ---

const ReciprocalsTrainer = () => {
    const [heading, setHeading] = useState(0);
    const [input, setInput] = useState('');
    const [status, setStatus] = useState<'IDLE' | 'CORRECT' | 'WRONG'>('IDLE');
    const [streak, setStreak] = useState(0);

    const generate = () => {
        setHeading(Math.floor(Math.random() * 360) + 1);
        setInput('');
        setStatus('IDLE');
    };

    useEffect(() => { generate(); }, []);

    const check = (e: React.FormEvent) => {
        e.preventDefault();
        const val = parseInt(input);
        let correct = heading + 180;
        if (correct > 360) correct -= 360;

        if (val === correct) {
            setStatus('CORRECT');
            setStreak(s => s + 1);
            setTimeout(generate, 1000);
        } else {
            setStatus('WRONG');
            setStreak(0);
        }
    };

    return (
        <div className="max-w-md mx-auto text-center space-y-8">
            <div className="flex flex-col items-center justify-center w-48 h-48 rounded-full border-4 border-slate-700 mx-auto bg-slate-800 relative">
                <span className="text-sm font-mono text-slate-500 absolute top-4">HEADING</span>
                <span className="text-5xl font-black text-white">{heading.toString().padStart(3, '0')}°</span>
            </div>

            <form onSubmit={check} className="space-y-4">
                <label className="block text-slate-400 text-sm font-bold uppercase tracking-wider">Enter Reciprocal</label>
                <div className="flex gap-2 justify-center">
                    <input
                        autoFocus
                        type="number"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="w-32 bg-slate-800 border-2 border-slate-600 rounded-xl px-4 py-3 text-2xl text-center font-mono font-bold text-white focus:border-fuchsia-500 outline-none transition-colors"
                        placeholder="???"
                    />
                    <button
                        type="submit"
                        className="p-3 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-xl transition-all"
                    >
                        <Check size={24} />
                    </button>
                </div>
            </form>

            {status === 'CORRECT' && <div className="text-emerald-400 font-bold animate-pulse">Correct! Next...</div>}
            {status === 'WRONG' && <div className="text-red-400 font-bold">Try again! (+/- 180)</div>}

            <div className="text-xs font-mono text-slate-600">
                Streak: {streak}
            </div>
        </div>
    );
};

const OneInSixtyTrainer = () => {
    // Simple static explanation for now, can be expanded to interactive
    return (
        <div className="text-center space-y-6 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white">The 1 in 60 Rule</h3>
            <p className="text-slate-300 text-lg">
                For every <span className="text-fuchsia-400 font-bold">60 NM</span> flown,
                a <span className="text-fuchsia-400 font-bold">1 degree</span> track error results in being
                <span className="text-fuchsia-400 font-bold"> 1 NM</span> off track.
            </p>

            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 text-left space-y-4">
                <h4 className="font-bold text-slate-400 uppercase text-sm">Formulae</h4>
                <div className="font-mono text-lg bg-black/30 p-4 rounded-lg text-fuchsia-300">
                    Track Error Angle (TE) = (Distance Off / Distance Gone) × 60
                </div>
                <div className="font-mono text-lg bg-black/30 p-4 rounded-lg text-blue-300">
                    Closing Angle (CA) = (Distance Off / Distance To Go) × 60
                </div>
            </div>

            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-200">
                <p>Interactive practice scenarios coming soon.</p>
            </div>
        </div>
    );
}

const TSDTrainer = () => {
    return (
        <div className="text-center space-y-6 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white">Time, Speed, Distance</h3>
            <div className="grid grid-cols-3 gap-4">
                <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
                    <span className="block text-slate-500 text-xs font-bold mb-2">SPEED (GS)</span>
                    <span className="text-2xl font-mono text-white">Dist / Time</span>
                </div>
                <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
                    <span className="block text-slate-500 text-xs font-bold mb-2">TIME</span>
                    <span className="text-2xl font-mono text-white">Dist / Speed</span>
                </div>
                <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
                    <span className="block text-slate-500 text-xs font-bold mb-2">DISTANCE</span>
                    <span className="text-2xl font-mono text-white">Speed × Time</span>
                </div>
            </div>
            <p className="text-slate-400">
                Remember to convert time to decimal hours (Minutes / 60) for calculation!
                <br />
                <span className="text-sm opacity-50">E.g. 120 KT for 30 min (0.5 hr) = 60 NM.</span>
            </p>
        </div>
    )
}

export default MentalMathsLab;
