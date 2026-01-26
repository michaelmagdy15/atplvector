import React, { useState, useEffect, useMemo } from 'react';
import { Search, Map, BookOpen, Settings, User as UserIcon, LogOut, Layout, Wifi, Cloud, Box, GraduationCap, X } from 'lucide-react';
import { View } from '../types';
import { NAV_MAP } from '../data/sidebarNavigation';

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (view: View) => void;
}

interface Command {
    id: string;
    label: string;
    category: string;
    icon: React.ReactNode;
    action: () => void;
    subtitle?: string;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onNavigate }) => {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);

    // Get current subject config if scoped
    const scopedSubject = selectedSubjectId ? NAV_MAP.find(s => s.id === selectedSubjectId) : null;

    // Define searchable items
    const commands: Command[] = useMemo(() => {
        if (selectedSubjectId && scopedSubject) {
            // Scoped Search: Only show topics for this subject
            return scopedSubject.items.map(item => ({
                id: `topic-${scopedSubject.id}-${item.view}`,
                label: item.label,
                subtitle: scopedSubject.title,
                category: 'Topics',
                icon: React.createElement(item.icon || GraduationCap, { size: 18 }),
                action: () => onNavigate(item.view)
            }));
        }

        // Global Search: Show everything
        return [
            // Navigation - Main
            { id: 'home', label: 'Dashboard', category: 'Navigation', icon: <Layout size={18} />, action: () => onNavigate(View.PLATFORM_DASHBOARD) },
            { id: 'profile', label: 'Profile', category: 'General', icon: <UserIcon size={18} />, action: () => onNavigate(View.PROFILE) },
            { id: 'settings', label: 'Settings', category: 'General', icon: <Settings size={18} />, action: () => onNavigate(View.ACCOUNT_SETTINGS) },

            // Subjects
            ...NAV_MAP.flatMap(subject => [
                // Subject Home
                {
                    id: `subject-${subject.id}`,
                    label: `${subject.title} (${subject.id})`,
                    category: 'Subjects',
                    icon: React.createElement(subject.items[0]?.icon || BookOpen, { size: 18 }),
                    action: () => onNavigate(subject.dashboardView)
                },
                // Search Within Option
                {
                    id: `scope-${subject.id}`,
                    label: `Search within ${subject.title}`,
                    category: 'Filters',
                    icon: <Search size={18} className="text-indigo-400" />,
                    action: () => {
                        setSelectedSubjectId(subject.id);
                        setQuery('');
                    }
                }
            ]),

            // Individual Topics (Global)
            ...NAV_MAP.flatMap(subject =>
                subject.items.filter(item => item.label !== 'Dashboard').map(item => ({
                    id: `topic-${subject.id}-${item.view}`,
                    label: item.label,
                    subtitle: subject.title,
                    category: 'Topics',
                    icon: React.createElement(item.icon || GraduationCap, { size: 18 }),
                    action: () => onNavigate(item.view)
                }))
            ),

            // Tools
            { id: 'concept', label: 'Visual Concept Lab', category: 'Tools', icon: <Box size={18} />, action: () => onNavigate(View.CONCEPT_LAB) },
        ];
    }, [selectedSubjectId, scopedSubject, onNavigate]);

    // Filter commands based on query
    const filteredCommands = useMemo(() => {
        if (query === '') {
            return commands.slice(0, 10);
        }
        const lowerQuery = query.toLowerCase();
        return commands.filter(cmd =>
            cmd.label.toLowerCase().includes(lowerQuery) ||
            (cmd.subtitle && cmd.subtitle.toLowerCase().includes(lowerQuery)) ||
            (cmd.category.toLowerCase().includes(lowerQuery))
        );
    }, [commands, query]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
            } else if (e.key === 'Enter') {
                if (filteredCommands[selectedIndex]) {
                    filteredCommands[selectedIndex].action();
                    // Don't close if we just updated the scope
                    if (filteredCommands[selectedIndex].id.startsWith('scope-')) {
                        // Scope updated, stay open
                    } else {
                        onClose();
                    }
                }
            } else if (e.key === 'Escape') {
                if (selectedSubjectId) {
                    setSelectedSubjectId(null);
                    setQuery('');
                } else {
                    onClose();
                }
            } else if (e.key === 'Backspace' && query === '' && selectedSubjectId) {
                setSelectedSubjectId(null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, filteredCommands, selectedIndex, onClose, selectedSubjectId, query]);

    // Reset selection when query or scope changes
    useEffect(() => {
        setSelectedIndex(0);
    }, [query, selectedSubjectId]);

    // Reset state when opening
    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setSelectedSubjectId(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-start justify-center pt-4 md:pt-[20vh] px-4 animate-in fade-in duration-200" onClick={onClose}>
            <div
                className="w-full max-w-xl bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center px-4 py-4 border-b border-slate-800 shrink-0">
                    {selectedSubjectId ? (
                        <div className="flex items-center bg-indigo-500/20 text-indigo-300 px-2.5 py-1.5 rounded-lg text-[10px] md:text-xs font-bold border border-indigo-500/30 mr-3 animate-in slide-in-from-left-2 whitespace-nowrap">
                            <span className="max-w-[100px] md:max-w-none truncate">{scopedSubject?.title}</span>
                            <button onClick={() => setSelectedSubjectId(null)} className="ml-2 hover:text-white p-0.5">
                                <X size={12} />
                            </button>
                        </div>
                    ) : (
                        <Search className="text-slate-400 mr-3 shrink-0" size={20} />
                    )}
                    <input
                        autoFocus
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder={selectedSubjectId ? `Search in ${scopedSubject?.title}...` : "Search anything..."}
                        className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-500 text-base md:text-lg min-w-0"
                    />
                    <div className="flex gap-1 items-center shrink-0">
                        {query === '' && selectedSubjectId && (
                            <span className="hidden md:inline text-[10px] text-slate-500 uppercase font-bold mr-2">⌫ to clear</span>
                        )}
                        <div className="hidden md:block text-[10px] font-bold bg-slate-800 text-slate-400 px-2 py-1 rounded border border-slate-700">ESC</div>
                        <button onClick={onClose} className="md:hidden p-1 text-slate-500 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto py-2 overscroll-contain">
                    {filteredCommands.length === 0 ? (
                        <div className="px-4 py-12 text-center">
                            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                                <Search size={24} />
                            </div>
                            <p className="text-slate-400 text-sm italic">No results found in {selectedSubjectId ? scopedSubject?.title : 'global search'}</p>
                        </div>
                    ) : (
                        filteredCommands.map((cmd, index) => (
                            <button
                                key={cmd.id}
                                onClick={() => {
                                    cmd.action();
                                    if (!cmd.id.startsWith('scope-')) onClose();
                                }}
                                onMouseEnter={() => setSelectedIndex(index)}
                                className={`w-full text-left px-4 py-3.5 flex items-center gap-4 transition-colors ${index === selectedIndex ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800/50'
                                    }`}
                            >
                                <span className={`${index === selectedIndex ? 'text-indigo-200' : (cmd.category === 'Filters' ? 'text-indigo-400' : 'text-slate-500')} shrink-0`}>
                                    {cmd.icon}
                                </span>
                                <div className="flex flex-col min-w-0">
                                    <span className="font-medium text-sm md:text-base truncate">{cmd.label}</span>
                                    {cmd.subtitle && (
                                        <span className={`text-[10px] uppercase tracking-wider font-bold truncate ${index === selectedIndex ? 'text-indigo-200/70' : 'text-slate-500'}`}>
                                            {cmd.subtitle}
                                        </span>
                                    )}
                                </div>
                                {index === selectedIndex && (
                                    <span className="ml-auto text-[10px] font-bold opacity-70 shrink-0 hidden md:block">
                                        {cmd.category === 'Filters' ? 'SCOPE SEARCH' : 'JUMP TO'}
                                    </span>
                                )}
                            </button>
                        ))
                    )}
                </div>

                <div className="bg-slate-950 px-4 py-2 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
                    <div>
                        <span className="font-bold">ProTip:</span> Use <kbd className="bg-slate-800 px-1 rounded border border-slate-700 text-[10px]">ESC</kbd> or <kbd className="bg-slate-800 px-1 rounded border border-slate-700 text-[10px]">⌫</kbd> to clear filters
                    </div>
                    <div>
                        ATPL Vector <span className="opacity-50">v1.2</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommandPalette;
