import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, CheckCircle, Circle, Star, PieChart } from 'lucide-react';
import { View, User, SubjectStats } from '../types';
import { getAllLOsForSubject, getUseSyllabusForSubject, SyllabusNode } from '../services/syllabusService';
import { supabase } from '../lib/supabase';
import { SUBJECTS } from '../data/learningObjectives';

interface SyllabusViewerProps {
    subjectId: string;
    currentUser: User | null;
    onUpdateUser: (updatedUser: User) => void;
    onBack?: () => void;
}

const SyllabusViewer: React.FC<SyllabusViewerProps> = ({ subjectId, currentUser, onUpdateUser, onBack }) => {
    // State
    const [syllabusRoot, setSyllabusRoot] = useState<SyllabusNode | null>(null);
    const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});
    const [isLoading, setIsLoading] = useState(true);

    // Ratings map: LO ID -> Rating (0-5)
    // We initialize from user profile but also keep local state for responsiveness

    useEffect(() => {
        const root = getUseSyllabusForSubject(subjectId);
        setSyllabusRoot(root || null);

        // Auto-expand the first level
        if (root?.children) {
            const initialMap: Record<string, boolean> = {};
            root.children.forEach(child => {
                initialMap[child.code] = true;
            });
            setExpandedNodes(initialMap);
        }

        setIsLoading(false);
    }, [subjectId]);

    const toggleNode = (code: string) => {
        setExpandedNodes(prev => ({
            ...prev,
            [code]: !prev[code]
        }));
    };

    const handleRatingChange = async (loId: string, rating: number) => {
        if (!currentUser) return;

        const newRatings = {
            ...(currentUser.learningObjectivesRatings || {}),
            [loId]: rating
        };

        // Optimistic UI update
        const updatedUser = { ...currentUser, learningObjectivesRatings: newRatings };
        onUpdateUser(updatedUser);

        // Persist to DB
        // Note: You'll need to ensure the 'learning_objectives_ratings' column exists as JSONB in 'profiles' table
        // For now we store it in metadata or assume a column exists. 
        // If column doesn't exist, this might fail unless we handle it.
        // Let's assume we store it in a JSONB column named 'learning_objectives_ratings'

        try {
            await supabase.from('profiles')
                .update({ learning_objectives_ratings: newRatings })
                .eq('id', currentUser.id);
        } catch (err) {
            console.error("Failed to save rating", err);
        }
    };

    const getUserRating = (loId: string) => {
        return currentUser?.learningObjectivesRatings?.[loId] || 0;
    };

    // calculate mastery for the CURRENT subject
    const calculateMastery = () => {
        if (!syllabusRoot) return 0;
        const allLos = getAllLOsForSubject(subjectId);
        if (allLos.length === 0) return 0;

        let totalScore = 0;
        let maxScore = allLos.length * 5;

        allLos.forEach(lo => {
            totalScore += getUserRating(lo.id);
        });

        return Math.round((totalScore / maxScore) * 100);
    };

    const mastery = calculateMastery();
    const subjectInfo = SUBJECTS.find(s => s.id === subjectId) || { name: 'Unknown Subject', id: subjectId };

    // --- Recursive Tree Renderer ---
    const renderNode = (node: SyllabusNode, level: number = 0) => {
        const isExpanded = expandedNodes[node.code];
        const hasChildren = (node.children && node.children.length > 0) || (node.los && node.los.length > 0);

        // Calculate progress for this specific node
        // (Optional: could be expensive for large trees, maybe skip for now or memoize)

        return (
            <div key={node.code} className={`mb-2 ${level > 0 ? 'ml-4 pl-4 border-l border-slate-700/50' : ''}`}>
                {/* Node Header */}
                <div
                    className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-slate-800/50 transition-colors
                        ${level === 0 ? 'bg-slate-800 mb-2 border border-slate-700' : ''}
                    `}
                    onClick={() => hasChildren && toggleNode(node.code)}
                >
                    <div className="mr-2 text-slate-400">
                        {hasChildren ? (
                            isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />
                        ) : <Circle size={8} />}
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">
                                {node.code.replace(/ 00/g, '').trim()}
                            </span>
                            <span className={`font-medium ${level === 0 ? 'text-lg text-white' : 'text-slate-300'}`}>
                                {node.title}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Children / LOs */}
                {isExpanded && (
                    <div className="mt-1 animate-in slide-in-from-top-2 duration-200">
                        {/* Render Sub-Topics */}
                        {node.children?.map(child => renderNode(child, level + 1))}

                        {/* Render LOs */}
                        {node.los?.map(lo => (
                            <div key={lo.id} className="ml-8 p-3 hover:bg-slate-800/30 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/50 last:border-0">
                                <div className="flex-1">
                                    <div className="text-slate-300 text-sm">{lo.text}</div>
                                    <div className="text-xs text-slate-600 font-mono mt-1">{lo.full_id || lo.id}</div>
                                </div>

                                {/* Rating Controls */}
                                <div className="flex items-center gap-1 bg-slate-900/50 p-1.5 rounded-lg border border-slate-800">
                                    {[0, 1, 2, 3, 4, 5].map((rating) => (
                                        <button
                                            key={rating}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRatingChange(lo.id, rating);
                                            }}
                                            className={`
                                                w-8 h-8 rounded-md flex items-center justify-center text-sm font-bold transition-all
                                                ${getUserRating(lo.id) >= rating && rating > 0
                                                    ? getRatingColor(rating)
                                                    : 'text-slate-600 hover:bg-slate-700'
                                                }
                                                ${getUserRating(lo.id) === rating && rating === 0 ? 'bg-slate-700 text-slate-400' : ''}
                                            `}
                                            title={`Rate: ${rating}`}
                                        >
                                            {rating === 0 ? '-' : rating}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const getRatingColor = (rating: number) => {
        switch (rating) {
            case 1: return 'bg-red-500/20 text-red-400 border border-red-500/30';
            case 2: return 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
            case 3: return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
            case 4: return 'bg-lime-500/20 text-lime-400 border border-lime-500/30';
            case 5: return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10';
            default: return 'text-slate-600';
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <button
                        onClick={onBack}
                        className="text-slate-400 hover:text-white mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider"
                    >
                        ← Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-black text-white">{subjectInfo.name} <span className="text-slate-500">Syllabus</span></h1>
                    <p className="text-slate-400">Track your confidence for each learning objective.</p>
                </div>

                {/* Mastery Card */}
                <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl flex items-center gap-4 min-w-[200px]">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-800" />
                            <circle
                                cx="32" cy="32" r="28"
                                stroke="currentColor" strokeWidth="4"
                                fill="transparent"
                                className="text-blue-500"
                                strokeDasharray={2 * Math.PI * 28}
                                strokeDashoffset={2 * Math.PI * 28 * (1 - mastery / 100)}
                            />
                        </svg>
                        <span className="absolute text-sm font-bold text-white">{mastery}%</span>
                    </div>
                    <div>
                        <div className="text-sm text-slate-400 uppercase font-bold tracking-wider">Mastery</div>
                        <div className="text-xs text-slate-500">Based on self-ratings</div>
                    </div>
                </div>
            </div>

            {/* Scale Legend */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 mb-8 flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mr-2 py-1">Rating Scale:</div>
                <div className="flex items-center gap-2 text-xs text-slate-400"><span className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center font-bold text-slate-500">-</span> Not Studied</div>
                <div className="flex items-center gap-2 text-xs text-red-400"><span className="w-6 h-6 rounded bg-red-500/20 border border-red-500/30 flex items-center justify-center font-bold">1</span> Low Confidence</div>
                <div className="flex items-center gap-2 text-xs text-yellow-400"><span className="w-6 h-6 rounded bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center font-bold">3</span> Good Confidence</div>
                <div className="flex items-center gap-2 text-xs text-emerald-400"><span className="w-6 h-6 rounded bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-bold">5</span> Mastered</div>
            </div>

            {/* Tree */}
            <div className="space-y-2">
                {isLoading ? (
                    <div className="text-center py-12 text-slate-500">Loading syllabus...</div>
                ) : (
                    syllabusRoot ? renderNode(syllabusRoot) : (
                        <div className="text-center py-12 text-slate-500">
                            Syllabus data not found for subject {subjectId}.
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default SyllabusViewer;
