import React, { useState, useEffect } from 'react';
import { ListOrdered, CheckCircle, RotateCcw, Award } from 'lucide-react';

interface PriorityLevel {
    id: number;
    name: string;
    description: string;
    examples: string[];
}

const priorities: PriorityLevel[] = [
    { id: 1, name: 'Distress', description: 'Grave and imminent danger.', examples: ['MAYDAY'] },
    { id: 2, name: 'Urgency', description: 'Safety of ship/person involved.', examples: ['PAN PAN'] },
    { id: 3, name: 'Direction Finding', description: 'Bearing info.', examples: ['QDM/QTE request'] },
    { id: 4, name: 'Flight Safety', description: 'ATC clearances & instructions.', examples: ['Clearance', 'Position Report'] },
    { id: 5, name: 'Meteorological', description: 'Weather info.', examples: ['METAR', 'SIGMET'] },
    { id: 6, name: 'Flight Regularity', description: 'Ops messages.', examples: ['Change of sched', 'Load msg'] }
];

const MessagePriority: React.FC = () => {
    const [scrambled, setScrambled] = useState<typeof priorities>([]);
    const [attempts, setAttempts] = useState(0);
    const [solved, setSolved] = useState(false);

    useEffect(() => {
        resetGame();
    }, []);

    const resetGame = () => {
        const shuffled = [...priorities].sort(() => Math.random() - 0.5);
        setScrambled(shuffled);
        setAttempts(0);
        setSolved(false);
    };

    const moveItem = (fromIndex: number, toIndex: number) => {
        if (toIndex < 0 || toIndex >= scrambled.length) return;
        const newItems = [...scrambled];
        const item = newItems[fromIndex];
        newItems.splice(fromIndex, 1);
        newItems.splice(toIndex, 0, item);
        setScrambled(newItems);
        checkSolution(newItems);
    };

    const checkSolution = (currentOrder: typeof priorities) => {
        const isCorrect = currentOrder.every((item, index) => item.id === index + 1);
        if (isCorrect) {
            setSolved(true);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-black p-8 rounded-3xl border border-indigo-500/30 shadow-2xl relative overflow-hidden">
                <div className="relative z-10 flex justify-between items-start mb-8">
                    <div>
                        <h2 className="text-3xl font-black text-white flex items-center gap-3">
                            <ListOrdered className="text-indigo-400" />
                            Message Priority
                        </h2>
                        <p className="text-indigo-200 mt-2 max-w-xl">
                            Drag and sort the message categories from Highest Priority (1) to Lowest Priority (6).
                            "Distress" is always number one!
                        </p>
                    </div>
                    {solved && (
                        <div className="bg-green-500/20 text-green-400 px-6 py-3 rounded-xl border border-green-500/50 flex items-center gap-3 animate-in bounce-in">
                            <Award size={24} />
                            <span className="font-bold">PERFECT ORDER!</span>
                        </div>
                    )}
                </div>

                <div className="space-y-3 relative z-10">
                    {scrambled.map((item, index) => (
                        <div
                            key={item.id}
                            className={`
                                flex items-center gap-4 p-4 rounded-xl border transition-all duration-300
                                ${solved ? 'bg-indigo-500/20 border-indigo-500/50' : 'bg-slate-800/50 border-slate-700'}
                            `}
                        >
                            <div className="flex flex-col gap-1">
                                <button
                                    onClick={() => moveItem(index, index - 1)}
                                    disabled={index === 0 || solved}
                                    className="p-1 hover:bg-white/10 rounded disabled:opacity-20"
                                >
                                    ▲
                                </button>
                                <button
                                    onClick={() => moveItem(index, index + 1)}
                                    disabled={index === scrambled.length - 1 || solved}
                                    className="p-1 hover:bg-white/10 rounded disabled:opacity-20"
                                >
                                    ▼
                                </button>
                            </div>

                            <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                                ${solved ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-400'}
                            `}>
                                {index + 1}
                            </div>

                            <div className="flex-1">
                                <h3 className={`font-bold text-lg ${solved ? 'text-white' : 'text-slate-200'}`}>
                                    {item.name}
                                </h3>
                                <p className="text-xs text-slate-400">{item.description}</p>
                            </div>

                            <div className="hidden md:block bg-black/20 px-3 py-1 rounded text-xs font-mono text-indigo-300 border border-indigo-500/20">
                                eg: {item.examples[0]}
                            </div>

                            {solved && <CheckCircle className="text-indigo-400" />}
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={resetGame}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-slate-800 text-white hover:bg-slate-700 border border-slate-600 transition-colors"
                    >
                        <RotateCcw size={18} /> Restart
                    </button>
                </div>
            </div>

            <div className="mt-8 grid md:grid-cols-2 gap-6">
                <div className="bg-amber-900/20 p-6 rounded-xl border border-amber-900/30">
                    <h4 className="text-amber-500 font-bold mb-2">Memory Aid</h4>
                    <p className="text-amber-100 text-sm">Remember: "Please Do Send My Flowers"</p>
                    <ul className="mt-2 text-xs text-amber-200/70 space-y-1 font-mono">
                        <li>(Distress/Urgency first)</li>
                        <li>P - Priority (Direction Finding)</li>
                        <li>D - Domain (Wait, no... wrong mnemonic)</li>
                    </ul>
                    <p className="mt-4 text-amber-100 text-sm italic">
                        Better mnemonic: "Duck Under Dad's Slippers My Feet"
                    </p>
                    <ul className="mt-2 text-xs text-amber-200/70 space-y-1 font-mono">
                        <li className="text-white font-bold">D - Distress</li>
                        <li className="text-white font-bold">U - Urgency</li>
                        <li className="text-white font-bold">D - Direction Finding</li>
                        <li className="text-white font-bold">S - Safety (Flight Safety)</li>
                        <li className="text-white font-bold">M - Meteorological</li>
                        <li className="text-white font-bold">F - Flight Regularity</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default MessagePriority;
