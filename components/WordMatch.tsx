import React, { useState, useEffect } from 'react';
import { standardWords } from '../data/courseData';

interface Card {
    id: string;
    content: string;
    type: 'word' | 'meaning';
    matched: boolean;
}

const WordMatch: React.FC = () => {
    const [cards, setCards] = useState<Card[]>([]);
    const [flipped, setFlipped] = useState<string[]>([]);
    const [solved, setSolved] = useState(false);

    useEffect(() => {
        initializeGame();
    }, []);

    const initializeGame = () => {
        // Take 6 random words
        const selection = standardWords.sort(() => 0.5 - Math.random()).slice(0, 6);
        const deck: Card[] = [];
        selection.forEach((item, idx) => {
            deck.push({ id: `word-${idx}`, content: item.word, type: 'word', matched: false });
            deck.push({ id: `def-${idx}`, content: item.meaning, type: 'meaning', matched: false });
        });
        setCards(deck.sort(() => 0.5 - Math.random()));
        setFlipped([]);
        setSolved(false);
    };

    const handleCardClick = (id: string) => {
        if (flipped.length >= 2 || flipped.includes(id) || cards.find(c => c.id === id)?.matched) return;

        const newFlipped = [...flipped, id];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            checkForMatch(newFlipped);
        }
    };

    const checkForMatch = (ids: string[]) => {
        const card1 = cards.find(c => c.id === ids[0]);
        const card2 = cards.find(c => c.id === ids[1]);

        if (card1 && card2) {
            // Check if ids match base index (word-0 matches def-0)
            const idx1 = card1.id.split('-')[1];
            const idx2 = card2.id.split('-')[1];

            if (idx1 === idx2) {
                setTimeout(() => {
                    setCards(prev => prev.map(c => ids.includes(c.id) ? { ...c, matched: true } : c));
                    setFlipped([]);
                }, 500);
            } else {
                setTimeout(() => {
                    setFlipped([]);
                }, 1000);
            }
        }
    };

    useEffect(() => {
        if (cards.length > 0 && cards.every(c => c.matched)) setSolved(true);
    }, [cards]);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-bold text-slate-800">Standard Words Memory</h2>
                 <button onClick={initializeGame} className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700">Reset Game</button>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                {cards.map(card => {
                    const isFlipped = flipped.includes(card.id) || card.matched;
                    return (
                        <div 
                            key={card.id}
                            onClick={() => handleCardClick(card.id)}
                            className={`h-32 rounded-xl cursor-pointer perspective-1000 transition-all duration-300 relative
                                ${isFlipped ? 'rotate-y-180' : 'bg-slate-800'}
                            `}
                        >
                            {/* Front (Hidden) */}
                            {!isFlipped && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-8 h-8 rounded-full bg-slate-700"></div>
                                </div>
                            )}

                            {/* Back (Revealed) */}
                            {isFlipped && (
                                <div className={`absolute inset-0 rounded-xl p-4 flex items-center justify-center text-center text-sm font-bold shadow-md
                                    ${card.type === 'word' ? 'bg-sky-100 text-sky-800' : 'bg-white text-slate-600 border border-slate-200'}
                                    ${card.matched ? 'opacity-50 ring-2 ring-green-500' : ''}
                                `}>
                                    {card.content}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            
            {solved && (
                 <div className="mt-8 p-8 bg-green-50 rounded-xl text-center text-green-700 font-bold text-xl animate-bounce">
                     All words matched! Good job!
                 </div>
            )}
        </div>
    );
};

export default WordMatch;
