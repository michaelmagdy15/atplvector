
import React, { useState, useEffect } from 'react';
import { Flashcard } from '../types';
import { SUBJECTS } from '../data/learningObjectives';
import { Plus, Trash2, Filter, RotateCcw, ChevronLeft, ChevronRight, Brain, GraduationCap, Shuffle } from 'lucide-react';
import { supabase } from '../lib/supabase';

// Static System Cards (Cannot be deleted by user)
const SYSTEM_CARDS: Flashcard[] = [
    { id: 'sys-1', subjectId: '090', front: 'Meaning of QDM?', back: 'Magnetic Heading TO the station (No wind correction).' },
    { id: 'sys-2', subjectId: '090', front: 'Squawk 7600 indicates?', back: 'Radio Communication Failure.' },
    { id: 'sys-3', subjectId: '090', front: 'Readability Scale 3 means?', back: 'Readable but with difficulty.' },
    { id: 'sys-4', subjectId: '090', front: 'Blind Transmission condition?', back: 'Made when receiver failure is suspected. Transmit blindly twice.' },
    { id: 'sys-5', subjectId: '090', front: 'Urgency Signal?', back: 'PAN-PAN, spoken three times.' },
    { id: 'sys-6', subjectId: '090', front: 'Distress Signal?', back: 'MAYDAY, spoken three times.' },
    { id: 'sys-7', subjectId: '090', front: 'VHF Frequency Range?', back: '118.000 - 136.975 MHz.' },
    { id: 'sys-8', subjectId: '090', front: 'Correct readback for "Climb FL 240"?', back: '"Climb Flight Level 240".' },
    { id: 'sys-9', subjectId: '090', front: 'Definition of "ROGER"?', back: '"I have received all of your last transmission". Does NOT mean Yes/Wilco.' },
    { id: 'sys-10', subjectId: '090', front: 'Meaning of QTE?', back: 'True Bearing FROM the station.' },
    { id: 'sys-11', subjectId: '090', front: 'Transponder Code for Hijack?', back: '7500.' },
    { id: 'sys-12', subjectId: '090', front: 'Correct format for Conditional Clearance?', back: 'Condition - Instruction - Condition (e.g., "Behind the landing A320, line up behind").' },
    { id: 'sys-13', subjectId: '090', front: 'Height of the Ionosphere D-Layer?', back: 'Approx 60km (lowest layer, absorbs HF during day).' },
    { id: 'sys-14', subjectId: '090', front: 'Frequency separation in VHF band?', back: '8.33 kHz or 25 kHz.' },
    { id: 'sys-15', subjectId: '090', front: 'Meaning of "WILCO"?', back: '"I understand your message and will comply with it".' },
    { id: 'sys-16', subjectId: '090', front: 'Maximum range of VHF?', back: 'Line of Sight (Formula: 1.23 * (√H1 + √H2)).' },
    { id: 'sys-17', subjectId: '090', front: 'Priority: Flight Safety Messages vs Met Messages?', back: 'Flight Safety Messages have priority over Meteorological Messages.' },
    { id: 'sys-18', subjectId: '090', front: 'Test transmission limit?', back: 'Should not exceed 10 seconds.' },
    { id: 'sys-19', subjectId: '090', front: 'Squelch function?', back: 'Eliminates background noise when no signal is being received.' },
    { id: 'sys-20', subjectId: '090', front: 'Action on "Readability 1"?', back: 'Unreadable. Try different frequency, check headset, or use backup radio.' },
    { id: 'sys-21', subjectId: '010', front: 'ICAO Annex 2 covers?', back: 'Rules of the Air.' },
    { id: 'sys-22', subjectId: '050', front: 'Standard Lapse Rate?', back: '1.98°C per 1000ft (approx 2°C).' },
];

const FlashcardSystem: React.FC = () => {
    const [userCards, setUserCards] = useState<Flashcard[]>([]);
    
    const [mode, setMode] = useState<'manage' | 'practice'>('manage');
    const [filterSub, setFilterSub] = useState('ALL');
    
    // New Card State
    const [newFront, setNewFront] = useState('');
    const [newBack, setNewBack] = useState('');
    const [newSub, setNewSub] = useState('090');
    const [isSaving, setIsSaving] = useState(false);

    // Practice State
    const [practiceIndex, setPracticeIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    // Load User Cards
    useEffect(() => {
        fetchUserCards();
    }, []);

    const fetchUserCards = async () => {
        const { data: session } = await supabase.auth.getSession();
        if (session.session?.user) {
            const { data, error } = await supabase
                .from('flashcards')
                .select('*')
                .eq('user_id', session.session.user.id);
            
            if (data && !error) {
                const mapped: Flashcard[] = data.map((d: any) => ({
                    id: d.id,
                    subjectId: d.subject_id,
                    front: d.front,
                    back: d.back
                }));
                setUserCards(mapped);
            }
        }
    };

    const allCards = [...SYSTEM_CARDS, ...userCards];
    const activeDeck = filterSub === 'ALL' ? allCards : allCards.filter(c => c.subjectId === filterSub);

    const handleAdd = async () => {
        if (!newFront || !newBack) return;
        setIsSaving(true);
        
        try {
            const { data: userData } = await supabase.auth.getUser();
            const userId = userData.user?.id;

            if (userId) {
                // Persist to DB
                const { data, error } = await supabase.from('flashcards').insert({
                    user_id: userId,
                    subject_id: newSub,
                    front: newFront,
                    back: newBack
                }).select().single();

                if (data && !error) {
                    const newCard: Flashcard = {
                        id: data.id,
                        subjectId: data.subject_id,
                        front: data.front,
                        back: data.back
                    };
                    setUserCards([...userCards, newCard]);
                    setNewFront('');
                    setNewBack('');
                } else if (error) {
                    console.error("DB Error:", error);
                    alert("Failed to save card. " + (error.message || "Unknown error"));
                }
            } else {
                alert("You must be logged in to create cards.");
            }
        } catch (e: any) {
            console.error(e);
            alert("An error occurred: " + (e.message || "Unknown error"));
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        // Prevent deleting system cards
        if (id.startsWith('sys-')) return;

        const { error } = await supabase.from('flashcards').delete().eq('id', id);
        if (!error) {
            setUserCards(userCards.filter(c => c.id !== id));
        } else {
            alert("Failed to delete card: " + error.message);
        }
    };

    const startPractice = () => {
        if (activeDeck.length === 0) return;
        setPracticeIndex(0);
        setIsFlipped(false);
        setMode('practice');
    };

    // Shuffle only affects current view, not permanent order
    const [shuffledDeck, setShuffledDeck] = useState<Flashcard[]>([]);
    
    // When entering practice, use shuffled or ordered
    const getPlayDeck = () => shuffledDeck.length > 0 ? shuffledDeck : activeDeck;

    const handleShuffle = () => {
        setShuffledDeck([...activeDeck].sort(() => Math.random() - 0.5));
    };

    const nextCard = () => {
        const deck = getPlayDeck();
        setIsFlipped(false);
        setTimeout(() => {
            setPracticeIndex((prev) => (prev + 1) % deck.length);
        }, 150);
    };

    const prevCard = () => {
        const deck = getPlayDeck();
        setIsFlipped(false);
        setTimeout(() => {
            setPracticeIndex((prev) => (prev - 1 + deck.length) % deck.length);
        }, 150);
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-2">
                        <GraduationCap className="text-amber-400" /> Study Flashcards
                    </h1>
                    <p className="text-slate-400 mt-1">Create, organize and practice your knowledge.</p>
                </div>
                {mode === 'manage' && (
                    <div className="flex gap-2">
                        <button 
                            onClick={handleShuffle}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors"
                        >
                            <Shuffle size={18} /> Shuffle
                        </button>
                        <button 
                            onClick={startPractice}
                            disabled={activeDeck.length === 0}
                            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
                        >
                            <Brain /> Practice Deck ({activeDeck.length})
                        </button>
                    </div>
                )}
                {mode === 'practice' && (
                    <button 
                        onClick={() => { setMode('manage'); setShuffledDeck([]); }}
                        className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2"
                    >
                        Exit Practice
                    </button>
                )}
            </div>

            {mode === 'manage' && (
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Create & Filter Column */}
                    <div className="space-y-6">
                        {/* Filter */}
                        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                            <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Filter size={16} /> Filter Deck</h3>
                            <select 
                                value={filterSub}
                                onChange={(e) => setFilterSub(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-600 text-white p-3 rounded-lg focus:border-indigo-500 outline-none"
                            >
                                <option value="ALL">All Subjects</option>
                                {SUBJECTS.map(s => <option key={s.id} value={s.id}>{s.id} {s.name}</option>)}
                            </select>
                        </div>

                        {/* Create New */}
                        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                            <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Plus size={16} /> Add New Card</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-slate-400 uppercase font-bold block mb-1">Subject</label>
                                    <select 
                                        value={newSub}
                                        onChange={(e) => setNewSub(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-600 text-white p-2 rounded focus:border-indigo-500 outline-none text-sm"
                                    >
                                        {SUBJECTS.map(s => <option key={s.id} value={s.id}>{s.id} {s.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 uppercase font-bold block mb-1">Front (Question)</label>
                                    <textarea 
                                        value={newFront}
                                        onChange={(e) => setNewFront(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-600 text-white p-2 rounded focus:border-indigo-500 outline-none text-sm h-20 resize-none"
                                        placeholder="e.g. VFR Minima Class G?"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 uppercase font-bold block mb-1">Back (Answer)</label>
                                    <textarea 
                                        value={newBack}
                                        onChange={(e) => setNewBack(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-600 text-white p-2 rounded focus:border-indigo-500 outline-none text-sm h-20 resize-none"
                                        placeholder="e.g. 5km Vis..."
                                    />
                                </div>
                                <button 
                                    onClick={handleAdd}
                                    disabled={isSaving}
                                    className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white py-2 rounded-lg font-bold shadow-md flex justify-center items-center"
                                >
                                    {isSaving ? 'Saving...' : 'Add Card'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Card List Column */}
                    <div className="lg:col-span-2">
                        <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 min-h-[500px]">
                            <h3 className="font-bold text-slate-400 uppercase text-xs mb-4">Your Cards ({activeDeck.length})</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {activeDeck.length === 0 && (
                                    <div className="col-span-full text-center py-20 text-slate-500">No cards in this deck. Add one!</div>
                                )}
                                {activeDeck.map(card => (
                                    <div key={card.id} className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex flex-col justify-between group hover:border-slate-500 transition-colors">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-[10px] bg-slate-900 text-slate-400 px-2 py-1 rounded border border-slate-700">Subject {card.subjectId}</span>
                                                {/* Only show delete for non-system cards */}
                                                {!card.id.startsWith('sys-') && (
                                                    <button onClick={() => handleDelete(card.id)} className="text-slate-600 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                                )}
                                            </div>
                                            <p className="font-bold text-white mb-2 line-clamp-2">{card.front}</p>
                                            <p className="text-sm text-slate-400 line-clamp-3 border-t border-slate-700 pt-2">{card.back}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {mode === 'practice' && (
                <div className="flex flex-col items-center justify-center min-h-[600px] animate-in fade-in">
                    {/* Access correct deck (shuffled or raw) */}
                    {(() => {
                        const deck = getPlayDeck();
                        return (
                            <>
                                {/* Progress Bar */}
                                <div className="w-full max-w-2xl bg-slate-800 h-2 rounded-full mb-8 overflow-hidden">
                                    <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${((practiceIndex + 1) / deck.length) * 100}%` }}></div>
                                </div>

                                {/* The Card */}
                                <div className="relative w-full max-w-2xl h-80 perspective-1000 group cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
                                    <div className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}>
                                        
                                        {/* Front */}
                                        <div className="absolute w-full h-full backface-hidden bg-white rounded-2xl shadow-2xl flex flex-col items-center justify-center p-12 text-center border-b-8 border-indigo-600">
                                            <span className="absolute top-4 left-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Question</span>
                                            <span className="absolute top-4 right-4 text-xs font-bold text-indigo-100 bg-indigo-600 px-2 py-1 rounded">Subject {deck[practiceIndex].subjectId}</span>
                                            <h2 className="text-3xl font-black text-slate-800">{deck[practiceIndex].front}</h2>
                                            <p className="absolute bottom-4 text-slate-400 text-xs flex items-center gap-1"><RotateCcw size={12}/> Click to Flip</p>
                                        </div>

                                        {/* Back */}
                                        <div className="absolute w-full h-full backface-hidden bg-slate-900 rounded-2xl shadow-2xl flex flex-col items-center justify-center p-12 text-center border-b-8 border-emerald-500 rotate-y-180">
                                            <span className="absolute top-4 left-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Answer</span>
                                            <p className="text-xl font-medium text-emerald-400 leading-relaxed">{deck[practiceIndex].back}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Controls */}
                                <div className="flex items-center gap-8 mt-12">
                                    <button onClick={prevCard} className="p-4 bg-slate-800 rounded-full hover:bg-slate-700 text-white transition-all hover:scale-110 border border-slate-600">
                                        <ChevronLeft size={24} />
                                    </button>
                                    <div className="text-slate-400 font-mono font-bold">
                                        {practiceIndex + 1} / {deck.length}
                                    </div>
                                    <button onClick={nextCard} className="p-4 bg-slate-800 rounded-full hover:bg-slate-700 text-white transition-all hover:scale-110 border border-slate-600">
                                        <ChevronRight size={24} />
                                    </button>
                                </div>
                            </>
                        );
                    })()}
                </div>
            )}
        </div>
    );
};

export default FlashcardSystem;
