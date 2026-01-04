
import React, { useState } from 'react';
import { MessageSquare, Navigation, ArrowUpRight, Cloud, Radio } from 'lucide-react';

const AdvancedPhraseology: React.FC = () => {
    const [tab, setTab] = useState(0);

    const tabs = [
        { name: 'Conditional', icon: MessageSquare },
        { name: 'True Bearing', icon: Navigation },
        { name: 'Level Change', icon: ArrowUpRight },
        { name: 'Wx Deviation', icon: Cloud },
        { name: 'Monitor/Contact', icon: Radio },
    ];

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 min-h-[600px] flex flex-col text-black">
            <div className="bg-slate-900 p-4 flex overflow-x-auto scrollbar-hide">
                {tabs.map((t, i) => (
                    <button
                        key={i}
                        onClick={() => setTab(i)}
                        className={`flex items-center px-4 py-2 rounded-lg mr-2 transition-all whitespace-nowrap ${
                            tab === i ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                    >
                        <t.icon className="w-4 h-4 mr-2" />
                        {t.name}
                    </button>
                ))}
            </div>
            <div className="p-8 flex-1 bg-slate-50 text-black">
                {tab === 0 && <ConditionalClearance />}
                {tab === 1 && <TrueBearingRequest />}
                {tab === 2 && <LevelChange />}
                {tab === 3 && <WeatherDeviation />}
                {tab === 4 && <MonitorContact />}
            </div>
        </div>
    );
};

// 1. Conditional Clearance (Page 7)
const ConditionalClearance = () => {
    const [selection, setSelection] = useState<string | null>(null);
    const phrase = "BEHIND THE LANDING A320, LINE UP RUNWAY 27 BEHIND";
    
    const check = (part: string) => {
        if (part === 'CONDITION') setSelection('CORRECT');
        else setSelection('WRONG');
    };

    return (
        <div className="text-center space-y-6">
            <h3 className="text-xl font-bold text-slate-900">Conditional Clearance Structure</h3>
            <p className="text-slate-600">Identify the <span className="font-bold text-sky-700">CONDITION</span> in this clearance.</p>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-lg font-mono font-bold leading-relaxed text-black">
                <span 
                    onClick={() => check('CONDITION')}
                    className="cursor-pointer hover:bg-sky-100 px-1 rounded transition-colors border-b-2 border-transparent hover:border-sky-500"
                >
                    BEHIND THE LANDING A320
                </span>
                <span className="mx-2 text-black">,</span>
                <span 
                    onClick={() => check('INSTRUCTION')}
                    className="cursor-pointer hover:bg-orange-100 px-1 rounded transition-colors border-b-2 border-transparent hover:border-orange-500"
                >
                    LINE UP RUNWAY 27
                </span>
                <span 
                    onClick={() => check('CONDITION')}
                    className="cursor-pointer hover:bg-sky-100 px-1 rounded transition-colors border-b-2 border-transparent hover:border-sky-500"
                >
                     BEHIND
                </span>
            </div>

            {selection === 'CORRECT' && <div className="text-green-700 font-bold animate-bounce">Correct! The condition must be stated first and last.</div>}
            {selection === 'WRONG' && <div className="text-red-600 font-bold">Incorrect. Look for the part describing another aircraft or event.</div>}
        </div>
    );
};

// 2. True Bearing Request (Page 11)
const TrueBearingRequest = () => {
    const [count, setCount] = useState(0);
    
    return (
        <div className="text-center max-w-md mx-auto">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Request True Bearing</h3>
            <p className="text-slate-600 mb-6">If not using Q-Codes (QTE), you must use plain language. How many times must you say "TRUE BEARING"?</p>
            
            <div className="bg-slate-800 text-white p-6 rounded-xl font-mono mb-6">
                "FASTAIR 345, REQUEST {Array(count).fill("TRUE BEARING").join(", ")}..."
            </div>

            <div className="flex justify-center gap-4">
                <button onClick={() => setCount(Math.max(0, count - 1))} className="p-3 bg-slate-200 rounded-full hover:bg-slate-300 text-slate-900 font-bold">-</button>
                <button onClick={() => setCount(count + 1)} className="p-3 bg-slate-200 rounded-full hover:bg-slate-300 text-slate-900 font-bold">+</button>
            </div>

            <div className="mt-6">
                {count === 3 ? (
                    <div className="text-green-700 font-bold">Correct! It must be spoken 3 times.</div>
                ) : (
                    <div className="text-slate-500">Keep adjusting...</div>
                )}
            </div>
        </div>
    );
};

// 3. Level Change (Page 9)
const LevelChange = () => {
    const [current, setCurrent] = useState(200);
    const [cleared, setCleared] = useState(120);

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 text-center">Level Change Report</h3>
            
            <div className="grid grid-cols-2 gap-8">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase">Current FL</label>
                    <input type="range" min="50" max="400" step="10" value={current} onChange={e => setCurrent(Number(e.target.value))} className="w-full" />
                    <div className="text-center font-mono font-bold text-2xl text-slate-900">FL{current}</div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase">Cleared FL</label>
                    <input type="range" min="50" max="400" step="10" value={cleared} onChange={e => setCleared(Number(e.target.value))} className="w-full" />
                    <div className="text-center font-mono font-bold text-2xl text-slate-900">FL{cleared}</div>
                </div>
            </div>

            <div className="bg-sky-100 p-6 rounded-xl text-sky-900 font-mono text-center font-bold border border-sky-200">
                "FASTAIR 345, LEAVING FL{current}, {current > cleared ? 'DESCENDING' : 'CLIMBING'} TO FL{cleared}."
            </div>
        </div>
    );
};

// 4. Weather Deviation (Page 10)
const WeatherDeviation = () => {
    const [dir, setDir] = useState('LEFT');
    const [degrees, setDegrees] = useState(10);

    return (
        <div className="space-y-6 text-center">
            <h3 className="text-xl font-bold text-slate-900">Weather Deviation Request</h3>
            
            <div className="relative w-48 h-48 mx-auto bg-slate-200 rounded-full flex items-center justify-center border-4 border-slate-300">
                <div 
                    className="w-1 h-24 bg-red-500 origin-bottom absolute bottom-1/2 transition-transform"
                    style={{ transform: `rotate(${dir === 'RIGHT' ? degrees : -degrees}deg)` }}
                ></div>
                <div className="w-1 h-24 bg-slate-400 origin-bottom absolute bottom-1/2 border-l border-dashed border-slate-600"></div>
                <Cloud className="absolute top-4 text-slate-500 w-8 h-8 animate-pulse" />
            </div>

            <div className="flex justify-center gap-4">
                <button onClick={() => setDir(dir === 'LEFT' ? 'RIGHT' : 'LEFT')} className="px-4 py-2 bg-slate-800 text-white rounded font-bold">
                    {dir}
                </button>
                <input 
                    type="range" min="5" max="45" step="5" 
                    value={degrees} 
                    onChange={e => setDegrees(Number(e.target.value))} 
                    className="w-32"
                />
                <span className="font-mono font-bold w-12 text-slate-900">{degrees}°</span>
            </div>

            <div className="bg-white p-4 rounded border border-slate-200 font-mono text-black font-bold">
                "REQUEST DEVIATION {degrees} DEGREES {dir} FOR WEATHER."
            </div>
        </div>
    );
};

// 5. Monitor vs Contact (Page 20)
const MonitorContact = () => {
    const [scenario, setScenario] = useState(0);
    const [feedback, setFeedback] = useState('');

    const scenarios = [
        { text: "Listen out on 118.1", answer: 'MONITOR' },
        { text: "Establish communications with Tower", answer: 'CONTACT' },
        { text: "Standby on frequency", answer: 'MONITOR' },
        { text: "Call Approach", answer: 'CONTACT' }
    ];

    const handleGuess = (ans: string) => {
        if (ans === scenarios[scenario].answer) {
            setFeedback('CORRECT');
            setTimeout(() => {
                setScenario((s) => (s + 1) % scenarios.length);
                setFeedback('');
            }, 1000);
        } else {
            setFeedback('WRONG');
        }
    };

    return (
        <div className="text-center max-w-md mx-auto">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Monitor vs Contact</h3>
            
            <div className="bg-slate-100 p-8 rounded-xl mb-8 min-h-[120px] flex items-center justify-center">
                <p className="text-lg font-bold text-slate-800">{scenarios[scenario].text}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button onClick={() => handleGuess('MONITOR')} className="py-4 bg-sky-500 text-white rounded-lg font-bold hover:bg-sky-600">MONITOR</button>
                <button onClick={() => handleGuess('CONTACT')} className="py-4 bg-indigo-500 text-white rounded-lg font-bold hover:bg-indigo-600">CONTACT</button>
            </div>
            
            {feedback && <div className={`mt-4 font-bold ${feedback === 'CORRECT' ? 'text-green-600' : 'text-red-600'}`}>{feedback}</div>}
        </div>
    );
};

export default AdvancedPhraseology;
