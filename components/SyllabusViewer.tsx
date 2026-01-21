import React, { useState, useEffect, useMemo } from 'react';
import { ChevronRight, ChevronDown, Circle, BookOpen, Search, Check } from 'lucide-react';
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

        // Filter out known empty/duplicate category headers (specifically 030 which appears as interleaved empty siblings)
        roots = roots.filter(root => root.code !== '030 00 00 00');

        if (filterSubject !== 'ALL') {
            roots = roots.filter(root => root.code.startsWith(filterSubject));
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

    // Calculate Mastery (for current filtered view)
    const mastery = useMemo(() => {
        // Collect ALL LOs in current view
        let totalScore = 0;
        let count = 0;

        const traverse = (node: any) => {
            if (node.los) {
                node.los.forEach((lo: any) => {
                    const r = getUserRating(lo.id);
                    totalScore += r;
                    count++;
                });
            }
            if (node.children) node.children.forEach(traverse);
        };

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
    }, [filteredTreeRoots]); // Re-create if roots change (though logic is data-dependent)

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

        // --- Determine Coverage for THIS node ---
        const normalizedId = normalizeCode(node.code);
        // Check exact match or ID match in LEARING_OBJECTIVES
        const directCoverage = LEARNING_OBJECTIVES.find(l =>
            l.id === normalizedId || (node.code && l.id === node.code)
        );

        // If this node is covered, all children inherit this view.
        // Otherwise, they keep the parent's coverage.
        const effectiveCoverageView = directCoverage?.coveredBy || inheritedCoverageView;

        // Get Topic Coverage Percentage (Only for Level 0 Subjects)
        let subjectCoveragePercent = 0;
        if (level === 0) {
            const subjectId = node.code.substring(0, 3);
            subjectCoveragePercent = subjectProgress[subjectId] || 0;
        }

        return (
            <div key={node.code} className={`mb-2 ${level > 0 ? 'ml-4 pl-4 border-l border-slate-700/50' : ''}`}>
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

                    <div className="flex-1 overflow-hidden">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded shrink-0">
                                {node.code.replace(/ 00/g, '').trim()}
                            </span>
                            <span className={`font-medium ${level === 0 ? 'text-lg text-white' : 'text-slate-300'}`}>
                                {node.title}
                            </span>
                            <span className="ml-2 text-[10px] font-bold text-slate-600 bg-slate-900/50 px-2 py-0.5 rounded-full border border-slate-800">
                                {loCount} LOs
                            </span>

                            {/* Subject Coverage Circle (Level 0 only) */}
                            {level === 0 && (
                                <div className="ml-4 flex items-center gap-2" title={`${subjectCoveragePercent}% Coverage implemented`}>
                                    <div className="relative w-6 h-6 flex items-center justify-center">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-slate-700" />
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-blue-500"
                                                strokeDasharray={2 * Math.PI * 10}
                                                strokeDashoffset={2 * Math.PI * 10 * (1 - subjectCoveragePercent / 100)}
                                            />
                                        </svg>
                                    </div>
                                    <span className="text-xs font-bold text-blue-400">{subjectCoveragePercent}%</span>
                                </div>
                            )}

                            {/* Show coverage badge on Topic if covered */}
                            {(effectiveCoverageView && level > 0) && (
                                <span className="ml-2 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                                    <Check size={10} />
                                    MAPPED
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {isExpanded && (
                    <div className="mt-1 animate-in slide-in-from-top-2 duration-200">
                        {/* Recurse with coverage */}
                        {node.children?.map(child => renderNode(child, level + 1, effectivelyMatched, effectiveCoverageView))}

                        {node.los?.map(lo => {
                            const isLOMatch = matches(lo, searchTerm);
                            if (searchTerm && !effectivelyMatched && !isLOMatch) return null;

                            // Check for specific LO override coverage
                            const loNormalized = lo.full_id || lo.id;
                            const loDirectCoverage = LEARNING_OBJECTIVES.find(l =>
                                l.id === lo.id || (lo.full_id && l.id === lo.full_id)
                            );

                            // Specific override > Parent topic > Inherited
                            const loCoverageView = loDirectCoverage?.coveredBy || effectiveCoverageView;
                            const isCovered = !!loCoverageView;

                            return (
                                <div key={lo.id} className="ml-8 p-3 hover:bg-slate-800/30 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/50 last:border-0 hover:border-slate-700 transition-colors">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-mono text-slate-500">{lo.full_id || lo.id}</span>
                                            {isCovered && (
                                                <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                                                    <Check size={10} />
                                                    IMPLEMENTED
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-slate-300 text-sm">{lo.text}</div>
                                    </div>

                                    {/* Actions: Rating + Launch */}
                                    <div className="flex items-end md:items-center gap-4">
                                        {/* Rating Scale */}
                                        <div className="flex items-center gap-1 bg-slate-900/50 p-1.5 rounded-lg border border-slate-800">
                                            {[0, 1, 2, 3, 4, 5].map((rating) => (
                                                <button
                                                    key={rating}
                                                    onClick={(e) => { e.stopPropagation(); handleRatingChange(lo.id, rating); }}
                                                    className={`
                                                        w-8 h-8 rounded-md flex items-center justify-center text-sm font-bold transition-all
                                                        ${getUserRating(lo.id) >= rating && rating > 0 ? getRatingColor(rating) : 'text-slate-600 hover:bg-slate-700'}
                                                        ${getUserRating(lo.id) === rating && rating === 0 ? 'bg-slate-700 text-slate-400' : ''}
                                                    `}
                                                    title={`Rate: ${rating}`}
                                                >
                                                    {rating === 0 ? '-' : rating}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Launch or Status Button */}
                                        {isCovered && onNavigate ? (
                                            <button
                                                onClick={() => onNavigate(loCoverageView!)}
                                                className="h-11 px-4 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20 rounded-lg transition-all flex items-center gap-2 font-medium text-sm whitespace-nowrap"
                                                title="Launch Module"
                                            >
                                                <BookOpen size={16} />
                                                Launch
                                            </button>
                                        ) : (
                                            <button
                                                disabled
                                                className="h-11 px-4 bg-slate-800 text-slate-500 rounded-lg cursor-not-allowed border border-slate-700/50 flex items-center gap-2 font-medium text-sm whitespace-nowrap"
                                                title="Module coming soon"
                                            >
                                                <FileText size={16} />
                                                Not Implemented
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 min-h-screen">
            {/* Header Card */}
            <div className="glass-card rounded-2xl p-6 mb-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        {onBack && (
                            <button onClick={onBack} className="text-slate-400 hover:text-white mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
                                ← Back to Dashboard
                            </button>
                        )}
                        <h1 className="text-3xl font-black text-white tracking-tight mb-2">
                            Syllabus <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Explorer</span>
                        </h1>
                        <p className="text-slate-400 max-w-lg text-sm">
                            Track your confidence and access implemented modules across {SUBJECTS.reduce((acc, s) => acc + s.totalLOs, 0)} learning objectives.
                        </p>
                    </div>

                    {/* Mastery Widget */}
                    <div className="bg-slate-900/80 border border-slate-700 p-4 rounded-xl flex items-center gap-4 min-w-[200px]">
                        <div className="relative w-16 h-16 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-800" />
                                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-blue-500" strokeDasharray={2 * Math.PI * 28} strokeDashoffset={2 * Math.PI * 28 * (1 - mastery / 100)} />
                            </svg>
                            <span className="absolute text-sm font-bold text-white">{mastery}%</span>
                        </div>
                        <div>
                            <div className="text-sm text-slate-400 uppercase font-bold tracking-wider">Mastery</div>
                            <div className="text-xs text-slate-500">Self-Rating Score</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls & Search */}
            <div className="sticky top-20 z-30 bg-slate-950/80 backdrop-blur-xl border-y border-white/5 py-4 mb-8 -mx-4 px-4 md:mx-0 md:px-0 md:border md:rounded-xl">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-3 text-slate-500" size={20} />
                        <input
                            type="text"
                            placeholder="Search syllabus tree..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700/50 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                    <select
                        value={filterSubject}
                        onChange={(e) => setFilterSubject(e.target.value)}
                        className="bg-slate-900 border border-slate-700/50 rounded-xl px-4 py-2.5 text-white outline-none focus:border-blue-500 max-w-xs"
                    >
                        <option value="ALL">All Subjects</option>
                        {SUBJECTS.map(s => (
                            <option key={s.id} value={s.id}>{s.id} - {s.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Scale Legend */}
            <div className="flex flex-wrap gap-4 mb-8 justify-center md:justify-start px-2">
                <div className="flex items-center gap-2 text-xs text-slate-400"><span className="w-4 h-4 rounded bg-slate-800 block"></span> Not Studied</div>
                <div className="flex items-center gap-2 text-xs text-red-400"><span className="w-4 h-4 rounded bg-red-500/20 border border-red-500/30 block"></span> Low</div>
                <div className="flex items-center gap-2 text-xs text-yellow-400"><span className="w-4 h-4 rounded bg-yellow-500/20 border border-yellow-500/30 block"></span> Good</div>
                <div className="flex items-center gap-2 text-xs text-emerald-400"><span className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-500/30 block"></span> Mastered</div>
            </div>

            {/* Content */}
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
