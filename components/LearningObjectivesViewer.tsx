import React, { useState, useMemo } from 'react';
import { LEARNING_OBJECTIVES, SUBJECTS } from '../data/learningObjectives';
import syllabusData from '../data/syllabus.json';
import { View } from '../types';
import { Search, Check, ChevronRight, ChevronDown, Layers, FileText, BookOpen, AlertCircle } from 'lucide-react';

interface Props {
    onNavigate: (view: View) => void;
}

// Type definitions for the recursive node structure
interface SyllabusNodeData {
    code?: string;
    title?: string;
    id?: string;
    text?: string;
    children?: SyllabusNodeData[];
    los?: SyllabusNodeData[];
    details?: string;
}

// Recursive Tree Node Component
// Helper to normalize code from "062 01 01 00" to "062.01.01"
const normalizeCode = (code: string | undefined): string => {
    if (!code) return '';
    const parts = code.split(' ');
    // Remove trailing '00's
    while (parts.length > 0 && parts[parts.length - 1] === '00') {
        parts.pop();
    }
    return parts.join('.');
};

// Recursive Tree Node Component
const SyllabusNode: React.FC<{
    node: SyllabusNodeData;
    depth: number;
    onNavigate: (view: View) => void;
    searchTerm: string;
    defaultOpen?: boolean;
    inheritedView?: View; // View passed down from parent
}> = ({ node, depth, onNavigate, searchTerm, defaultOpen, inheritedView }) => {
    // Determine if this node is relevant to the search
    // If searchTerm is empty, show everything (collapsed by default unless depth < 2)
    // If searchTerm exists, expand if self or children match

    // Helper to check if node matches
    const matches = (n: SyllabusNodeData, term: string): boolean => {
        if (!term) return true;
        const lowerTerm = term.toLowerCase();
        return (
            (n.code?.toLowerCase().includes(lowerTerm) ?? false) ||
            (n.title?.toLowerCase().includes(lowerTerm) ?? false) ||
            (n.id?.toLowerCase().includes(lowerTerm) ?? false) ||
            (n.text?.toLowerCase().includes(lowerTerm) ?? false)
        );
    };

    // Helper to check if any descendant matches (to force expand)
    const hasMatchingDescendant = (n: SyllabusNodeData, term: string): boolean => {
        if (!term) return false;
        if (n.children?.some(c => matches(c, term) || hasMatchingDescendant(c, term))) return true;
        if (n.los?.some(l => matches(l, term))) return true;
        return false;
    };

    const isMatch = matches(node, searchTerm);
    const hasMatchInChildren = hasMatchingDescendant(node, searchTerm);

    // If searching, hide nodes that don't match AND don't have matching children
    if (searchTerm && !isMatch && !hasMatchInChildren) return null;

    const [isOpen, setIsOpen] = useState(defaultOpen || (searchTerm && hasMatchInChildren) || depth < 1);

    // Different styles based on depth
    const isSubject = depth === 0;
    const isTopic = depth === 1;
    const isSubTopic = depth === 2;
    const isLO = !!node.id && !node.code; // It's a Learning Objective leaf

    // Determine Coverage
    // 1. Check if direct match in LEARNING_OBJECTIVES (using normalized code)
    const normalizedId = normalizeCode(node.code);
    const directCoverage = LEARNING_OBJECTIVES.find(l => l.id === normalizedId || l.id === node.id);

    // 2. Resolve final view: direct coverage OR inherited view
    const effectiveView = directCoverage?.coveredBy || inheritedView;
    const isCovered = !!effectiveView;

    if (isLO) {
        return (
            <div className={`mt-2 p-4 rounded-xl border border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/60 transition-all flex flex-col md:flex-row gap-4 justify-between group animate-in fade-in slide-in-from-left-2 duration-300`}>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            {node.id}
                        </span>
                    </div>
                    <p className="text-slate-300 font-medium leading-relaxed">{node.text}</p>
                    {node.details && node.details !== node.text && (
                        <p className="text-slate-500 text-sm mt-2 pl-2 border-l-2 border-slate-700">{node.details}</p>
                    )}
                </div>
                {isCovered ? (
                    <button
                        onClick={() => onNavigate(effectiveView!)}
                        className="self-start md:self-center shrink-0 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-lg font-bold shadow-lg shadow-emerald-900/20 transition-all transform hover:scale-105"
                    >
                        <Check size={16} />
                        <span>Launch</span>
                    </button>
                ) : (
                    <div className="self-start md:self-center shrink-0 px-3 py-1 bg-slate-800/50 rounded-full border border-slate-700 text-slate-500 text-xs font-mono">
                        Not Implemented
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={`mb-2 ${isSubject ? 'mb-8' : ''}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center gap-3 text-left transition-all duration-200 group
                    ${isSubject ? 'py-4 border-b border-slate-700 mb-4' : 'py-2 px-2 rounded-lg hover:bg-white/5'}
                `}
            >
                {/* Icon/Chevron */}
                <div className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`}>
                    {isSubject ? (
                        <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
                            <BookOpen size={20} className="text-white" />
                        </div>
                    ) : (
                        <ChevronRight size={isTopic ? 18 : 16} className={isOpen ? 'text-blue-400 hover:text-blue-300' : 'text-slate-500'} />
                    )}
                </div>

                {/* Content */}
                <div className="flex-1">
                    <div className="flex items-baseline gap-3">
                        {node.code && (
                            <span className={`font-mono ${isSubject ? 'text-blue-400 text-sm' : 'text-slate-500 text-xs'}`}>
                                {node.code}
                            </span>
                        )}
                        <span className={`
                            ${isSubject ? 'text-2xl font-bold text-white tracking-tight' : ''}
                            ${isTopic ? 'text-lg font-semibold text-slate-200' : ''}
                            ${isSubTopic ? 'text-base font-medium text-slate-300' : ''}
                        `}>
                            {node.title}
                        </span>

                        {/* Status Badge for Topic/Subject */}
                        {isCovered && !isSubject && (
                            <span className="ml-auto text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold hidden md:inline-block">
                                IMPLEMENTED
                            </span>
                        )}
                    </div>
                </div>
            </button>

            {/* Children container with animation logic */}
            {isOpen && (
                <div className={`
                    ${isSubject ? 'pl-2' : ''}
                    ${isTopic ? 'pl-4 border-l-2 border-slate-800 ml-3' : ''}
                    ${isSubTopic ? 'pl-4 border-l border-slate-800/50 ml-3' : ''}
                `}>
                    {node.children?.map((child, idx) => (
                        <SyllabusNode
                            key={child.code || idx}
                            node={child}
                            depth={depth + 1}
                            onNavigate={onNavigate}
                            searchTerm={searchTerm}
                            inheritedView={effectiveView} // Pass down coverage
                        />
                    ))}
                    {node.los?.map((lo, idx) => (
                        <SyllabusNode
                            key={lo.id || idx}
                            node={lo}
                            depth={depth + 1}
                            onNavigate={onNavigate}
                            searchTerm={searchTerm}
                            inheritedView={effectiveView} // Pass down coverage
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// Main Component
const LearningObjectivesViewer: React.FC<Props> = ({ onNavigate }) => {
    const [viewMode, setViewMode] = useState<'TREE' | 'LIST'>('TREE');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSubject, setFilterSubject] = useState<string>('ALL'); // Default to ALL for Tree view

    // Legacy Filter Logic
    const filteredLegacy = useMemo(() => {
        return LEARNING_OBJECTIVES.filter(lo => {
            const matchesSearch = lo.text.toLowerCase().includes(searchTerm.toLowerCase()) || lo.id.includes(searchTerm);
            const matchesSubject = filterSubject === 'ALL' || lo.subject === filterSubject;
            return matchesSearch && matchesSubject;
        });
    }, [searchTerm, filterSubject]);

    // Tree Data Preparation
    // syllabusData is an array of Subjects (Roots).
    // We filter based on the 'filterSubject' (e.g. 040 matches code starting with 040)
    const filteredTreeRoots = useMemo(() => {
        if (filterSubject === 'ALL') return syllabusData;
        return syllabusData.filter((root: any) => root.code.startsWith(filterSubject));
    }, [filterSubject]);

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 min-h-screen">

            {/* Header Card */}
            <div className="glass-card rounded-2xl p-6 mb-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight mb-2">
                            Syllabus <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Explorer</span>
                        </h1>
                        <p className="text-slate-400 max-w-lg text-sm">
                            Navigate the complete EASA Part-FCL learning objectives.
                            Switch between the visual tree explorer and the classic list view.
                        </p>
                    </div>

                    {/* View Toggle */}
                    <div className="bg-slate-900/50 p-1 rounded-xl border border-white/10 flex items-center">
                        <button
                            onClick={() => setViewMode('TREE')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'TREE'
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Layers size={16} />
                            <span>Tree View</span>
                        </button>
                        <button
                            onClick={() => setViewMode('LIST')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'LIST'
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <FileText size={16} />
                            <span>List View</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Controls Toolbar */}
            <div className="sticky top-20 z-30 bg-slate-950/80 backdrop-blur-xl border-y border-white/5 py-4 mb-8 -mx-4 px-4 md:mx-0 md:px-0 md:border md:rounded-xl">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-3 text-slate-500" size={20} />
                        <input
                            type="text"
                            placeholder={viewMode === 'TREE' ? "Search syllabus tree..." : "Search by keyword or ID..."}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700/50 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                    <select
                        value={filterSubject}
                        onChange={(e) => setFilterSubject(e.target.value)}
                        className="bg-slate-900 border border-slate-700/50 rounded-xl px-4 py-2.5 text-white outline-none focus:border-blue-500"
                    >
                        <option value="ALL">All Subjects</option>
                        {SUBJECTS.map(s => (
                            <option key={s.id} value={s.id}>{s.id} - {s.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Content Area */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {viewMode === 'TREE' ? (
                    <div className="space-y-4">


                        {filteredTreeRoots.length > 0 ? (
                            filteredTreeRoots.map((node: any, idx: number) => (
                                <SyllabusNode
                                    key={idx}
                                    node={node}
                                    depth={0}
                                    onNavigate={onNavigate}
                                    searchTerm={searchTerm}
                                />
                            ))
                        ) : (
                            <div className="text-center py-20">
                                <p className="text-slate-500 text-lg">No syllabus content found for this filter.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    // LEGACY LIST VIEW
                    <div className="grid gap-3">
                        {filteredLegacy.length > 0 ? filteredLegacy.map(lo => (
                            <div key={lo.id} className="bg-slate-900/50 p-5 rounded-xl border border-slate-800 hover:border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between group transition-all">
                                <div className="mb-4 md:mb-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded text-xs font-mono font-bold">{lo.id}</span>
                                        <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">{SUBJECTS.find(s => s.id === lo.subject)?.name}</span>
                                    </div>
                                    <p className="font-medium text-slate-200 group-hover:text-white transition-colors">{lo.text}</p>
                                </div>
                                {lo.coveredBy ? (
                                    <button
                                        onClick={() => onNavigate(lo.coveredBy!)}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600/10 text-blue-400 border border-blue-600/20 rounded-lg hover:bg-blue-600 hover:text-white transition-all font-semibold text-sm"
                                    >
                                        <Check size={16} />
                                        Launch
                                    </button>
                                ) : (
                                    <span className="text-slate-600 text-sm italic px-4">Pending Development</span>
                                )}
                            </div>
                        )) : (
                            <div className="text-center py-20 text-slate-500">
                                No Learning Objectives found matching your search.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LearningObjectivesViewer;
