import React, { useState, useMemo, useEffect } from 'react';
import { ChevronRight, ChevronDown, Database, Globe, History, Layout, Settings, Target, Zap, Sparkles, CheckSquare, Square, AlertCircle, Search, Filter, Book, List, Play } from 'lucide-react';
import { QBConfig } from '../types';
import { QBStorage } from '../lib/qb_storage';
import syllabusMetadata from '../data/qb_metadata.json';

interface Wrapper {
    [key: string]: any[];
}
const metadata = syllabusMetadata as Wrapper;

interface SetupProps {
    initialSubject?: string;
    onStart: (config: QBConfig) => void;
    onCancel: () => void;
}

export const QB_Setup: React.FC<SetupProps> = ({ initialSubject, onStart, onCancel }) => {
    const [selectedSubject, setSelectedSubject] = useState<string>(initialSubject || '010');
    const [mode, setMode] = useState<'study' | 'exam'>('study');
    const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set());
    const [questionCount, setQuestionCount] = useState<number>(20);
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

    // Filters
    const [filters, setFilters] = useState({
        onlyRealExam: false,
        withAnnexes: false,
        withoutAnnexes: false,
        unseen: false,
        incorrect: false,
        selectedAuthorities: [] as string[],
        selectedCountries: [] as string[],
        recentOnly: false,
        flaggedOnly: false,
        wrongAnswersOnly: false,
        seenPeriod: 'all' as 'all' | '30' | '60' | '90'
    });

    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const currentStats = QBStorage.getStats();
        setStats(currentStats);
    }, []);

    const authorities = [
        { id: 'EASA', name: 'EASA Central (ECQB)', flag: '🇪🇺' },
        { id: 'UKCAA', name: 'UK CAA', flag: '🇬🇧' },
        { id: 'AUSTRO', name: 'Austro Control', flag: '🇦🇹' },
        { id: 'IAA', name: 'Irish Aviation Authority', flag: '🇮🇪' },
        { id: 'TRANSPORT_MALTA', name: 'Transport Malta', flag: '🇲🇹' },
        { id: 'SACAA', name: 'South African CAA', flag: '🇿🇦' },
    ];

    const countries = [
        { id: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
        { id: 'FR', name: 'France', flag: '🇫🇷' },
        { id: 'DE', name: 'Germany', flag: '🇩🇪' },
        { id: 'AT', name: 'Austria', flag: '🇦🇹' },
        { id: 'ES', name: 'Spain', flag: '🇪🇸' },
        { id: 'IT', name: 'Italy', flag: '🇮🇹' },
        { id: 'MT', name: 'Malta', flag: '🇲🇹' },
    ];

    const toggleAuthority = (id: string) => {
        setFilters(prev => ({
            ...prev,
            selectedAuthorities: prev.selectedAuthorities.includes(id)
                ? prev.selectedAuthorities.filter(a => a !== id)
                : [...prev.selectedAuthorities, id]
        }));
    };

    const currentSyllabus = useMemo(() => {
        return metadata[selectedSubject] || [];
    }, [selectedSubject]);

    // Build tree structure
    const tree = useMemo(() => {
        const buildNode = (parentId: string) => {
            return currentSyllabus
                .filter(n => n.parentId === parentId)
                .map(node => ({
                    ...node,
                    children: buildNode(node.id)
                }));
        };

        // Start with nodes that are direct children of the selected subject
        // In our metadata, these are the Level 1 topics with parentId === selectedSubject
        return buildNode(selectedSubject);
    }, [currentSyllabus, selectedSubject]);

    const toggleExpand = (id: string) => {
        const newSet = new Set(expandedNodes);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setExpandedNodes(newSet);
    };

    const toggleSelect = (id: string, children: any[]) => {
        const newSet = new Set(selectedTopics);
        const isSelected = newSet.has(id);

        const toggleRecursive = (nodeId: string, nodeChildren: any[], select: boolean) => {
            if (select) newSet.add(nodeId);
            else newSet.delete(nodeId);

            nodeChildren.forEach(c => toggleRecursive(c.id, c.children, select));
        };

        toggleRecursive(id, children, !isSelected);
        setSelectedTopics(newSet);
    };

    const subjects = [
        { id: '010', name: 'Air Law' },
        { id: '021', name: 'AGK: Systems' },
        { id: '022', name: 'AGK: Instruments' },
        { id: '031', name: 'Mass & Balance' },
        { id: '032', name: 'Perf (A)' },
        { id: '033', name: 'Flight Planning' },
        { id: '040', name: 'Human Performance' },
        { id: '050', name: 'Meteorology' },
        { id: '061', name: 'Gen Nav' },
        { id: '062', name: 'Radio Nav' },
        { id: '070', name: 'Ops Procedures' },
        { id: '081', name: 'PoF (A)' },
        { id: '090', name: 'Communications' },
    ];

    const handleStart = () => {
        onStart({
            subjectId: selectedSubject,
            mode,
            count: questionCount,
            topics: Array.from(selectedTopics),
            filters
        });
    };

    // Calculate max available questions
    const maxQuestions = useMemo(() => {
        let max = 0;

        if (selectedTopics.size === 0) {
            // If nothing selected, use subject total (Level 1 node in metadata array for this subject)
            // But metadata[subject] is an array of nodes.
            // A safer way is to sum all Level 2 topics (since they are disjoint)
            // or use the Level 1 node if I can find it.
            // The metadata array is flat list of nodes.

            const subjectNode = currentSyllabus.find(n => n.level === 1 && n.id === selectedSubject);
            if (subjectNode) {
                max = subjectNode.questionCount || 0;
            } else {
                // Fallback: sum level 2 nodes
                max = currentSyllabus
                    .filter(n => n.level === 2 && n.parentId === selectedSubject)
                    .reduce((sum, n) => sum + (n.questionCount || 0), 0);
            }
        } else {
            // Sum selected topics...
            // Be careful of parent/child double counting.
            // Strategy: For every selected topic, if its parent is ALSO selected, ignore it (since parent covers it).
            // Sum only the "top-most" selected nodes.

            const topLevelSelected = Array.from(selectedTopics).filter(id => {
                // Find this node
                const node = currentSyllabus.find(n => n.id === id);
                if (!node) return false;
                // check if parent is in selectedTopics
                return !selectedTopics.has(node.parentId);
            });

            max = topLevelSelected.reduce((sum, id) => {
                const node = currentSyllabus.find(n => n.id === id);
                return sum + (node?.questionCount || 0);
            }, 0);
        }

        return max;
    }, [selectedTopics, currentSyllabus, selectedSubject]);

    // Adjust question count if it exceeds max
    // Note: we don't auto-update state in render excessive, use useEffect
    useEffect(() => {
        if (questionCount > maxQuestions && maxQuestions > 0) {
            setQuestionCount(maxQuestions);
        } else if (maxQuestions === 0 && questionCount !== 0) {
            setQuestionCount(0);
        }
    }, [maxQuestions, questionCount]);


    const renderTree = (nodes: any[]) => {
        return nodes.map(node => {
            const hasChildren = node.children && node.children.length > 0;
            const isExpanded = expandedNodes.has(node.id);
            const isSelected = selectedTopics.has(node.id); // Simple check, could be partial
            const count = node.questionCount || 0;

            return (
                <div key={node.id} className="ml-4">
                    <div className="flex items-center gap-2 py-1 text-sm hover:bg-white/5 rounded px-2 group">
                        {hasChildren ? (
                            <button onClick={() => toggleExpand(node.id)} className="p-0.5 hover:text-blue-400 text-slate-500">
                                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </button>
                        ) : <div className="w-4" />}

                        <button onClick={() => toggleSelect(node.id, node.children)} className="hover:text-blue-400">
                            {isSelected ? <CheckSquare size={16} className="text-blue-500" /> : <Square size={16} className="text-slate-600 group-hover:text-slate-500" />}
                        </button>

                        <span className={`text-slate-300 ${isSelected ? 'font-medium text-white' : ''} flex-1 truncate`}>
                            {node.title.length > 60 ? node.title.substring(0, 60) + '...' : node.title}
                            <span className="text-xs text-slate-600 ml-2 font-mono">({node.id})</span>
                        </span>

                        <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full border border-white/5">
                            {count}
                        </span>
                    </div>
                    {hasChildren && isExpanded && (
                        <div className="border-l border-white/5 ml-2 pl-1">
                            {renderTree(node.children)}
                        </div>
                    )}
                </div>
            );
        });
    };

    return (
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 p-4 animate-in slide-in-from-right duration-500">
            {/* Sidebar: Config */}
            <div className="space-y-6">
                <div className="glass-panel p-6 rounded-3xl space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Book size={18} className="text-blue-400" />
                            Subject
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            {subjects.map(sub => (
                                <button
                                    key={sub.id}
                                    onClick={() => setSelectedSubject(sub.id)}
                                    className={`px-3 py-2 text-xs font-bold rounded-lg transition-all ${selectedSubject === sub.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                                >
                                    {sub.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <List size={18} className="text-purple-400" />
                            Mode
                        </h3>
                        <div className="flex bg-slate-900 rounded-xl p-1">
                            <button
                                onClick={() => setMode('study')}
                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === 'study' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:text-white'}`}
                            >
                                Study
                            </button>
                            <button
                                onClick={() => setMode('exam')}
                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === 'exam' ? 'bg-purple-600 text-white shadow' : 'text-slate-500 hover:text-white'}`}
                            >
                                Exam
                            </button>
                        </div>
                        {mode === 'exam' && (
                            <p className="text-xs text-purple-300/60 mt-2 px-2">
                                <AlertCircle size={10} className="inline mr-1" />
                                Review answers only at the end.
                            </p>
                        )}
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Filter size={18} className="text-emerald-400" />
                                <span>Questions</span>
                            </div>
                            <span className="text-white bg-slate-800 px-2 py-1 rounded text-sm font-mono border border-white/10">
                                {questionCount} <span className="text-slate-500 text-xs">/ {maxQuestions}</span>
                            </span>
                        </h3>
                        <input
                            type="range"
                            min="1"
                            max={maxQuestions > 0 ? maxQuestions : 100}
                            step="1"
                            value={questionCount}
                            onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                            className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                            disabled={maxQuestions === 0}
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-wider">
                            <span>Min: 1</span>
                            <span>Max: {maxQuestions}</span>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Filter size={18} className="text-blue-400" />
                            Exam Authority
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {authorities.map(auth => (
                                <button
                                    key={auth.id}
                                    onClick={() => toggleAuthority(auth.id)}
                                    className={`px-3 py-1.5 text-[10px] font-bold rounded-full border transition-all flex items-center gap-2 ${filters.selectedAuthorities.includes(auth.id) ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-white/5 text-slate-400 hover:bg-slate-700'}`}
                                >
                                    <span>{auth.flag}</span>
                                    {auth.id}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-white/5">
                        <label className="flex items-center gap-3 text-sm text-slate-300 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors group">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filters.recentOnly ? 'bg-amber-500 border-amber-500' : 'border-slate-600'}`}>
                                {filters.recentOnly && <CheckSquare size={14} className="text-white" />}
                            </div>
                            <input type="checkbox" className="hidden" checked={filters.recentOnly} onChange={e => setFilters({ ...filters, recentOnly: e.target.checked })} />
                            <div>
                                <span className="block font-bold">Hot Points 🔥</span>
                                <span className="text-[10px] text-slate-500">Only questions seen in the last 90 days</span>
                            </div>
                        </label>
                        <label className="flex items-center gap-3 text-sm text-slate-300 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${filters.unseen ? 'bg-blue-500 border-blue-500' : 'border-slate-600'}`}>
                                {filters.unseen && <CheckSquare size={14} className="text-white" />}
                            </div>
                            <input type="checkbox" className="hidden" checked={filters.unseen} onChange={e => setFilters({ ...filters, unseen: e.target.checked })} />
                            Unseen questions only
                        </label>
                        <label className="flex items-center gap-3 text-sm text-slate-300 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${filters.incorrect ? 'bg-red-500 border-red-500' : 'border-slate-600'}`}>
                                {filters.incorrect && <CheckSquare size={14} className="text-white" />}
                            </div>
                            <input type="checkbox" className="hidden" checked={filters.incorrect} onChange={e => setFilters({ ...filters, incorrect: e.target.checked })} />
                            Previously incorrect only
                        </label>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <AlertCircle size={18} className="text-amber-400" />
                            Smart Filters
                        </h3>
                        <div className="space-y-3">
                            <label className="flex items-center justify-between gap-3 text-sm text-slate-300 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filters.flaggedOnly ? 'bg-blue-600 border-blue-600' : 'border-slate-600'}`}>
                                        {filters.flaggedOnly && <CheckSquare size={14} className="text-white" />}
                                    </div>
                                    <input type="checkbox" className="hidden" checked={filters.flaggedOnly} onChange={e => setFilters({ ...filters, flaggedOnly: e.target.checked })} />
                                    <span>Flagged / Bookmarked</span>
                                </div>
                                <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20 font-bold">
                                    {stats?.flaggedQuestionIds?.length || 0}
                                </span>
                            </label>

                            <label className="flex items-center justify-between gap-3 text-sm text-slate-300 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filters.wrongAnswersOnly ? 'bg-red-600 border-red-600' : 'border-slate-600'}`}>
                                        {filters.wrongAnswersOnly && <CheckSquare size={14} className="text-white" />}
                                    </div>
                                    <input type="checkbox" className="hidden" checked={filters.wrongAnswersOnly} onChange={e => setFilters({ ...filters, wrongAnswersOnly: e.target.checked })} />
                                    <span>Wrongly Answered (Ever)</span>
                                </div>
                                <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full border border-red-500/20 font-bold">
                                    {stats?.incorrectQuestionIds?.length || 0}
                                </span>
                            </label>

                            <div className="pt-2">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 ml-2">Seen in Exam (Temporal)</label>
                                <div className="grid grid-cols-4 gap-1 p-1 bg-slate-800/50 rounded-xl border border-white/5">
                                    {['all', '30', '60', '90'].map(period => (
                                        <button
                                            key={period}
                                            onClick={() => setFilters({ ...filters, seenPeriod: period as any })}
                                            className={`py-1.5 rounded-lg text-[10px] font-bold transition-all ${filters.seenPeriod === period ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-300'}`}
                                        >
                                            {period === 'all' ? 'ALL' : `${period}D`}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleStart}
                        disabled={maxQuestions === 0}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-lg shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Play size={24} fill="currentColor" />
                        Start Session
                    </button>
                    <button onClick={onCancel} className="w-full py-2 text-slate-500 hover:text-white transition-colors">
                        Cancel
                    </button>
                </div>
            </div>

            {/* Tree View */}
            <div className="lg:col-span-2 glass-panel p-6 rounded-3xl flex flex-col h-[80vh]">
                {/* Header with Smart Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h2 className="text-4xl font-black text-white mb-2 tracking-tight">Configure Session</h2>
                        <p className="text-slate-400">Target specific subjects or use smart filters to focus on your weak points.</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => {
                                const qbConfig: any = {
                                    subjectId: selectedSubject || '090', // Fallback or first selected
                                    mode: 'study',
                                    topics: selectedTopics,
                                    count: 50,
                                    filters: { ...filters, wrongAnswersOnly: true }
                                };
                                setFilters({ ...filters, wrongAnswersOnly: true });
                                if (stats?.incorrectQuestionIds?.length > 0) {
                                    onStart(qbConfig);
                                }
                            }}
                            className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                        >
                            <Zap size={14} />
                            Study My Mistakes
                        </button>
                        <button
                            onClick={() => {
                                // Logic for "unseen" would involve passing a filter to onStart
                                // For now, we'll let the user toggle the regular filters
                            }}
                            className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                        >
                            <Sparkles size={14} />
                            Practice Unseen
                        </button>
                    </div>
                </div>
                <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                    <div>
                        <h3 className="text-2xl font-bold text-white">Syllabus Selection</h3>
                        <p className="text-slate-400 text-sm">Select specific topics or leave all unselected for full coverage.</p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-mono font-bold text-blue-400">{selectedTopics.size}</div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider">Topics Selected</div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {tree.length > 0 ? renderTree(tree) : (
                        <div className="text-center py-20 text-slate-500">
                            <Filter size={48} className="mx-auto mb-4 opacity-30" />
                            No syllabus data available for this subject yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
