import React, { useState, useEffect } from 'react';
import { Clock, Hash, Mic, Volume2, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

const TransmissionDrill: React.FC = () => {
    const [mode, setMode] = useState<'NUMBERS' | 'TIME'>('NUMBERS');
    const [challenge, setChallenge] = useState<string>('');
    const [userValues, setUserValues] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<string | null>(null);

    const generateChallenge = () => {
        setFeedback(null);
        setUserValues([]);
        if (mode === 'NUMBERS') {
            const types = ['ALT', 'FL', 'VIS', 'FREQ', 'HDG'];
            const type = types[Math.floor(Math.random() * types.length)];
            let val = '';

            switch (type) {
                case 'ALT': val = (Math.floor(Math.random() * 50) * 100 + 1000).toString(); break; // e.g., 2500, 4000
                case 'FL': val = 'FL' + (Math.floor(Math.random() * 40) * 10 + 50).toString(); break; // e.g. FL120
                case 'VIS': val = (Math.floor(Math.random() * 50) * 100 + 500).toString() + 'm'; break;
                case 'FREQ': val = '1' + (Math.floor(Math.random() * 18) + 18).toString() + '.' + (Math.floor(Math.random() * 90) + 10).toString(); break;
                case 'HDG': val = (Math.floor(Math.random() * 360)).toString().padStart(3, '0'); break;
            }
            setChallenge(val);
        } else {
            // TIME - generate random UTC time
            const h = Math.floor(Math.random() * 24).toString().padStart(2, '0');
            const m = Math.floor(Math.random() * 60).toString().padStart(2, '0');
            setChallenge(`${h}${m}`);
        }
    };

    useEffect(() => {
        generateChallenge();
    }, [mode]);

    const getCorrectPhonetic = (val: string): string[] => {
        // Simple parser for checking logic (simplified for this demo)
        const clean = val.replace(/[^0-9A-Za-z.]/g, '');
        const output: string[] = [];

        for (let i = 0; i < clean.length; i++) {
            const c = clean[i];
            if (c === '.') output.push("DECIMAL");
            else if (c === '9') output.push("NINER");
            else if (c === '3') output.push("TREE");
            else if (c === '5') output.push("FIFE");
            else if (c === '0') output.push("ZERO"); // or ZERO depending on standard
            else if (!isNaN(parseInt(c))) output.push(digitMap[c]);
            else output.push(c.toUpperCase()); // Letters
        }

        // Specific overrides
        if (val.includes('.')) {
            // Frequency: 118.1 -> ONE ONE EIGHT DECIMAL ONE
        }
        if (val.startsWith('FL')) {
            // FL100 -> FLIGHT LEVEL ONE ZERO ZERO
        }

        // For 'DRILL' purposes, we'll prompt the user to match the standard digits
        return clean.split('').map(c => {
            if (c === '.') return "DECIMAL";
            if (c === '3') return "TREE";
            if (c === '4') return "FOWER";
            if (c === '5') return "FIFE";
            if (c === '9') return "NINER";
            if (c === '0') return "ZERO";
            return c.toUpperCase(); // Fallback for 1, 2, 6, 7, 8 and letters
        });
    };

    const digitMap: { [key: string]: string } = {
        '0': 'ZERO', '1': 'WUN', '2': 'TOO', '3': 'TREE', '4': 'FOWER',
        '5': 'FIFE', '6': 'SIX', '7': 'SEVEN', '8': 'AIT', '9': 'NINER', '.': 'DECIMAL'
    };

    const targetWords = challenge.split('').map(c => {
        if (mode === 'NUMBERS') {
            if (c === '.') return 'DECIMAL';
            if (c === 'm') return ''; // ignore units for now
            if (c === 'F' || c === 'L') return c;
            return digitMap[c] || c;
        } else {
            return digitMap[c];
        }
    }).filter(c => c !== undefined && c !== '');

    const checkAnswer = () => {
        // Allow some flexibility
        setFeedback("CORRECT"); // Placeholder for the actual drill logic
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-slate-900 rounded-3xl shadow-2xl border border-slate-800">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-indigo-500 rounded-2xl text-white">
                    <Mic size={32} />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-white">Transmission Lab</h2>
                    <p className="text-slate-400">Master the art of saying numbers and time (090.02.01)</p>
                </div>
            </div>

            <div className="flex gap-4 mb-8 p-1 bg-slate-800 rounded-xl inline-flex">
                <button
                    onClick={() => setMode('NUMBERS')}
                    className={`px-6 py-2 rounded-lg font-bold transition-all ${mode === 'NUMBERS' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                    Numbers
                </button>
                <button
                    onClick={() => setMode('TIME')}
                    className={`px-6 py-2 rounded-lg font-bold transition-all ${mode === 'TIME' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                    Time (UTC)
                </button>
            </div>

            <div className="bg-slate-950 p-12 rounded-3xl border border-slate-800 text-center mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20">
                    {mode === 'TIME' ? <Clock size={120} className="text-indigo-500" /> : <Hash size={120} className="text-indigo-500" />}
                </div>

                <div className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-4">
                    {mode === 'TIME' ? 'TRANSMIT THIS TIME' : 'TRANSMIT THIS VALUE'}
                </div>
                <div className="text-7xl font-mono font-bold text-white mb-8 tracking-wider">
                    {challenge}
                </div>

                <div className="flex justify-center flex-wrap gap-2 text-slate-500 font-mono text-xl">
                    {targetWords.map((word, i) => (
                        <span key={i} className="px-3 py-1 bg-slate-900 rounded border border-slate-800">
                            {word}
                        </span>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={generateChallenge}
                    className="p-4 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition flex items-center justify-center gap-2"
                >
                    <RefreshCw size={20} /> New Challenge
                </button>
                <button className="p-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20">
                    <Volume2 size={20} /> Listen to Demo
                </button>
            </div>
        </div>
    );
};

export default TransmissionDrill;
