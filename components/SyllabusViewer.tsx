import React, { useState, useEffect, useMemo } from 'react';
import { ChevronRight, ChevronDown, Circle, BookOpen, Search, Check, Clock, HelpCircle } from 'lucide-react';
import { View, User } from '../types';
import { SyllabusNode } from '../services/syllabusService';
import { supabase } from '../lib/supabase';
import { SUBJECTS, LEARNING_OBJECTIVES, calculateProgress } from '../data/learningObjectives';
import syllabusData from '../data/syllabus.json';

interface SyllabusViewerProps {
    subjectId: string; // Can be 'ALL' or specific ID
    currentUser: User | null;
    onUpdateUser: (updatedUser: User) => void;
    onBack?: () => void;
    onNavigate?: (view: View) => void;
}

// Normalize code helper
const normalizeCode = (code: string | undefined): string => {
    if (!code) return '';
    const parts = code.split(' ');
    while (parts.length > 0 && parts[parts.length - 1] === '00') {
        parts.pop();
    }
    return parts.join('.');
};

const SyllabusViewer: React.FC<SyllabusViewerProps> = ({ subjectId, currentUser, onUpdateUser, onBack, onNavigate }) => {
    // State
    const [filterSubject, setFilterSubject] = useState<string>(subjectId || 'ALL');
    const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [localRatings, setLocalRatings] = useState<Record<string, number>>({});

    // Calculate Subject Progress for UI badges
    const subjectProgress = useMemo(() => {
        const stats = calculateProgress();
        const map: Record<string, number> = {};
        stats.forEach(s => map[s.id] = s.percentage);
        return map;
    }, []);

    // Get current subject metadata
    const currentSubject = useMemo(() => SUBJECTS.find(s => s.id === filterSubject) || { name: 'All Subjects', totalLOs: 0 }, [filterSubject]);
    const currentProgress = subjectProgress[filterSubject] || 0;

    // Update filter if prop changes
    useEffect(() => {
        if (subjectId) setFilterSubject(subjectId);
    }, [subjectId]);

    useEffect(() => {
        // Initialize local ratings
        if (!currentUser) {
            const saved = localStorage.getItem('atpl_syllabus_ratings');
            if (saved) {
                try {
                    setLocalRatings(JSON.parse(saved));
                } catch (e) {
                    console.error("Failed to parse local ratings", e);
                }
            }
        }
        setIsLoading(false);
    }, [currentUser]);

    // Tree Data Preparation
    const filteredTreeRoots = useMemo(() => {
        let roots = syllabusData as SyllabusNode[];

        // Filter out known empty/duplicate category headers
        roots = roots.filter(root => root.code !== '030 00 00 00');

        if (filterSubject !== 'ALL') {
            // Find the specific subject root node (level 0)
            const subjectRoot = roots.find(root => root.code.startsWith(filterSubject));
            // If found, return its CHILDREN as the roots for the viewer, effectively "zooming in" one level
            // per the screenshot design (displaying Level 1 topics as cards)
            if (subjectRoot && subjectRoot.children) {
                return subjectRoot.children;
            }
            // Fallback if no children or exact subject not found (shouldn't happen for valid IDs)
            return roots.filter(root => root.code.startsWith(filterSubject));
        }
        return roots;
    }, [filterSubject]);


    // Helper to check if node matches search
    const matches = (n: any, term: string): boolean => {
        if (!term) return true;
        const lowerTerm = term.toLowerCase();
        return (
            (n.code?.toLowerCase().includes(lowerTerm) ?? false) ||
            (n.title?.toLowerCase().includes(lowerTerm) ?? false) ||
            (n.id?.toLowerCase().includes(lowerTerm) ?? false) ||
            (n.text?.toLowerCase().includes(lowerTerm) ?? false)
        );
    };

    // Helper to check descendants for search
    const hasMatchingDescendant = (n: any, term: string): boolean => {
        if (!term) return false;
        if (n.children?.some((c: any) => matches(c, term) || hasMatchingDescendant(c, term))) return true;
        if (n.los?.some((l: any) => matches(l, term))) return true;
        return false;
    };


    const toggleNode = (code: string) => {
        setExpandedNodes(prev => ({
            ...prev,
            [code]: !prev[code]
        }));
    };

    const handleRatingChange = async (loId: string, rating: number) => {
        if (currentUser) {
            const newRatings = {
                ...(currentUser.learningObjectivesRatings || {}),
                [loId]: rating
            };
            onUpdateUser({ ...currentUser, learningObjectivesRatings: newRatings });
            try {
                await supabase.from('profiles').update({ learning_objectives_ratings: newRatings }).eq('id', currentUser.id);
            } catch (err) { console.error("Failed to save rating", err); }
        } else {
            const newRatings = { ...localRatings, [loId]: rating };
            setLocalRatings(newRatings);
            localStorage.setItem('atpl_syllabus_ratings', JSON.stringify(newRatings));
        }
    };

    const getUserRating = (loId: string) => {
        if (currentUser) {
            return currentUser.learningObjectivesRatings?.[loId] || 0;
        }
        return localRatings[loId] || 0;
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

    // Calculate Mastery (Average of ratings)
    const mastery = useMemo(() => {
        let totalScore = 0;
        let count = 0;

        const traverse = (node: any) => {
            if (node.los) {
                node.los.forEach((lo: any) => {
                    const r = getUserRating(lo.id);
                    totalScore += r;
                    // Count only if rated > 0 effectively, or count all? 
                    // Usually mastery is % of total possible score (5 * total LOs)
                    count++;
                });
            }
            if (node.children) node.children.forEach(traverse);
        };

        // We need to traverse the full subject root, not just the filtered view if we want accurate subject mastery
        // But for this view, let's use the visible roots
        filteredTreeRoots.forEach(traverse);

        if (count === 0) return 0;
        return Math.round((totalScore / (count * 5)) * 100);
    }, [filteredTreeRoots, currentUser, localRatings]);


    // Helper to count LOs recursively
    const countNodeLOs = useMemo(() => {
        const cache = new Map<string, number>();
        const count = (node: SyllabusNode): number => {
            if (cache.has(node.code)) return cache.get(node.code)!;
            let c = node.los?.length || 0;
            if (node.children) {
                c += node.children.reduce((acc, child) => acc + count(child), 0);
            }
            cache.set(node.code, c);
            return c;
        };
        return count;
    }, [filteredTreeRoots]);


    // --- Recursive Renderer ---
    const renderNode = (node: SyllabusNode, level: number = 0, parentMatched: boolean = false, inheritedCoverageView?: View) => {
        // Search Logic:
        const isSelfMatch = matches(node, searchTerm);
        const hasMatchInChildren = hasMatchingDescendant(node, searchTerm);

        const shouldShow = !searchTerm || parentMatched || isSelfMatch || hasMatchInChildren;

        if (!shouldShow) return null;

        const effectivelyMatched = parentMatched || isSelfMatch;
        const isExpanded = expandedNodes[node.code] || (!!searchTerm && (hasMatchInChildren || effectivelyMatched));

        const hasChildren = (node.children && node.children.length > 0) || (node.los && node.los.length > 0);
        const loCount = countNodeLOs(node);

        const normalizedId = normalizeCode(node.code);
        const directCoverage = LEARNING_OBJECTIVES.find(l =>
            l.id === normalizedId || (node.code && l.id === node.code)
        );
        const effectiveCoverageView = directCoverage?.coveredBy || inheritedCoverageView;

        // Styling based on level
        // Level 0 in this view is actually Level 1 (Topic) of the subject
        // We want Level 0 to be the "Dark Card" container style

        if (level === 0) {
            return (
                <div key={node.code} className="mb-4 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <div
                        className="flex items-center p-4 cursor-pointer hover:bg-slate-800/50 transition-colors"
                        onClick={() => hasChildren && toggleNode(node.code)}
                    >
                        <div className="mr-3 text-slate-500">
                            {hasChildren ? (
                                isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />
                            ) : <Circle size={8} />}
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                                <span className="font-mono text-xs font-bold text-slate-500 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                                    {node.code.split(' ').slice(1, 2).join('')}
                                </span>
                                <h3 className="font-bold text-slate-200 text-sm md:text-base uppercase tracking-tight">
                                    {node.title}
                                </h3>
                            </div>
                            {/* Progress Bar Line */}
                            <div className="w-full h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                                {/* Mock progress for visual flair - or calculate real if needed */}
                                <div className="h-full bg-blue-600 w-0"></div>
                            </div>
                        </div>

                        {/* Question Count Badge (Mock) */}
                        <div className="ml-4 flex items-center gap-1 bg-lime-500/10 border border-lime-500/20 text-lime-400 px-2 py-1 rounded text-xs font-bold">
                            {/* Random mock count for UI parity */}
                            <span>{Math.floor(loCount / 3) + 1} Q</span>
                        </div>
                    </div>

                    {isExpanded && (
                        <div className="bg-slate-950/50 border-t border-slate-800 p-2">
                            {node.children?.map(child => renderNode(child, level + 1, effectivelyMatched, effectiveCoverageView))}
                            {node.los?.map(lo => renderLO(lo, effectivelyMatched, effectiveCoverageView))}
                        </div>
                    )}
                </div>
            );
        }

        // Nested Levels (Indent)
        return (
            <div key={node.code} className={`ml-4 pl-4 border-l border-slate-800/50 my-2`}>
                <div
                    className="flex items-center py-2 cursor-pointer hover:bg-slate-800/30 rounded pl-2 transition-colors"
                    onClick={() => hasChildren && toggleNode(node.code)}
                >
                    <div className="mr-2 text-slate-600">
                        {hasChildren ? (
                            isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                        ) : <Circle size={6} />}
                    </div>
                    <span className="font-mono text-xs text-slate-500 mr-2">{node.code.split(' ').slice(-2, -1).join('')}</span>
                    <span className="text-slate-400 text-sm font-medium">{node.title}</span>
                </div>
                {isExpanded && (
                    <div className="mt-1">
                        {node.children?.map(child => renderNode(child, level + 1, effectivelyMatched, effectiveCoverageView))}
                        {node.los?.map(lo => renderLO(lo, effectivelyMatched, effectiveCoverageView))}
                    </div>
                )}
            </div>
        );
    };

    const renderLO = (lo: any, effectivelyMatched: boolean, effectiveCoverageView?: View) => {
        const isLOMatch = matches(lo, searchTerm);
        if (searchTerm && !effectivelyMatched && !isLOMatch) return null;

        const isCovered = !!effectiveCoverageView; // Simplified logic for demo

        return (
            <div key={lo.id} className="ml-8 p-3 hover:bg-slate-900 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/50 last:border-0 group">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono text-slate-600 bg-slate-900 border border-slate-800 px-1.5 rounded">{lo.full_id || lo.id}</span>
                        {isCovered && <Check size={12} className="text-emerald-500" />}
                    </div>
                    <div className="text-slate-300 text-sm leading-relaxed">{lo.text}</div>
                </div>

                <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                    {[0, 1, 2, 3, 4, 5].map((rating) => (
                        <button
                            key={rating}
                            onClick={(e) => { e.stopPropagation(); handleRatingChange(lo.id, rating); }}
                            className={`
                                w-6 h-6 rounded flex items-center justify-center text-xs font-bold transition-all
                                ${getUserRating(lo.id) >= rating && rating > 0 ? getRatingColor(rating) : 'text-slate-700 bg-slate-900'}
                                ${getUserRating(lo.id) === rating && rating === 0 ? 'bg-slate-800 text-slate-500' : ''}
                            `}
                        >
                            {rating === 0 ? '·' : rating}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 min-h-screen">
            {/* Top Bar Navigation */}
            <div className="mb-6 flex items-center justify-between">
                {onBack && (
                    <button onClick={onBack} className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-bold transition-colors">
                        <ChevronRight className="rotate-180" size={16} />
                        Back to Dashboard
                    </button>
                )}
            </div>

            {/* Main Header Card */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <BookOpen className="text-blue-500" size={24} />
                        <span className="text-slate-500 font-mono text-sm">{filterSubject}</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-6">
                        {currentSubject.name}
                    </h1>

                    <div className="flex items-start gap-12">
                        <div>
                            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Learning Objectives</div>
                            <div className="text-2xl font-bold text-white">{currentSubject.totalLOs}</div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Completed</div>
                            <div className="text-2xl font-bold text-white">0</div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Mastered</div>
                            <div className="text-2xl font-bold text-emerald-500">0</div>
                        </div>
                    </div>

                    <div className="mt-8 flex items-center gap-6 text-sm text-slate-400">
                        <div className="flex items-center gap-2">
                            <Clock size={16} />
                            <span>~{Math.ceil(currentSubject.totalLOs / 10)} hours</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <HelpCircle size={16} />
                            <span>{Math.floor(currentSubject.totalLOs * 2.5)} questions</span>
                        </div>
                    </div>
                </div>

                {/* Circles */}
                <div className="flex items-center gap-8">
                    {/* Overall Progress */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="relative w-24 h-24 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-800" />
                                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-blue-600"
                                    strokeDasharray={2 * Math.PI * 40}
                                    strokeDashoffset={2 * Math.PI * 40 * (1 - currentProgress / 100)}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <span className="absolute text-xl font-bold text-white">0%</span>
                        </div>
                        <span className="text-xs font-bold text-slate-500 uppercase">Overall Progress</span>
                    </div>

                    {/* Mastery */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="relative w-24 h-24 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-800" />
                                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-emerald-500"
                                    strokeDasharray={2 * Math.PI * 40}
                                    strokeDashoffset={2 * Math.PI * 40 * (1 - mastery / 100)}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <span className="absolute text-xl font-bold text-white">{mastery}%</span>
                        </div>
                        <span className="text-xs font-bold text-slate-500 uppercase">Mastery</span>
                    </div>
                </div>
            </div>

            {/* Search & Rating Key */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                {/* Rating Scale Legend */}
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg p-2 px-3">
                    <span className="text-xs text-slate-500 font-bold mr-2">Rating Scale:</span>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-[10px] text-slate-400"><span className="w-2 h-2 rounded-full bg-slate-700"></span> Not studied</div>
                        <div className="flex items-center gap-1 text-[10px] text-red-400"><span className="w-2 h-2 rounded-full bg-red-500"></span> 1-2</div>
                        <div className="flex items-center gap-1 text-[10px] text-yellow-500"><span className="w-2 h-2 rounded-full bg-yellow-400"></span> 3-4</div>
                        <div className="flex items-center gap-1 text-[10px] text-emerald-500"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Mastered</div>
                    </div>
                </div>

                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
                    <input
                        type="text"
                        placeholder="Search topics..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:border-blue-500 outline-none"
                    />
                </div>

                <button
                    onClick={() => Object.keys(expandedNodes).length > 0 ? setExpandedNodes({}) : null} // Simplified expand functionality
                    className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white"
                >
                    Expand All
                </button>
            </div>

            {/* List */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="text-center py-12 text-slate-500">Loading syllabus...</div>
                ) : (
                    filteredTreeRoots.length > 0 ? filteredTreeRoots.map((node) => renderNode(node)) : (
                        <div className="text-center py-12 text-slate-500">No syllabus content found.</div>
                    )
                )}
            </div>
        </div>
    );
};

export default SyllabusViewer;
