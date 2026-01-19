import React, { useState, useEffect } from 'react';
import { Search, Map, BookOpen, Settings, User as UserIcon, LogOut, Layout, Wifi, Cloud, Box } from 'lucide-react';
import { View } from '../types';

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (view: View) => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onNavigate }) => {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Define searchable items
    const commands = [
        // Navigation - Main
        { id: 'home', label: 'Dashboard', icon: <Layout size={18} />, action: () => onNavigate(View.PLATFORM_DASHBOARD) },
        { id: 'profile', label: 'Profile', icon: <UserIcon size={18} />, action: () => onNavigate(View.PROFILE) },
        { id: 'settings', label: 'Settings', icon: <Settings size={18} />, action: () => onNavigate(View.ACCOUNT_SETTINGS) },

        // Subjects (Example mapping, extend as needed)
        { id: 'air-law', label: 'Air Law (010)', icon: <BookOpen size={18} />, action: () => onNavigate(View.AIR_LAW_HOME) },
        { id: 'agk', label: 'AGK (021)', icon: <Settings size={18} />, action: () => onNavigate(View.AGK_HOME) },
        { id: 'inst', label: 'Instrumentation (022)', icon: <Map size={18} />, action: () => onNavigate(View.INST_HOME) },
        { id: 'gnav', label: 'General Navigation (061)', icon: <Map size={18} />, action: () => onNavigate(View.GEN_NAV_HOME) },
        { id: 'rnav', label: 'Radio Navigation (062)', icon: <Wifi size={18} />, action: () => onNavigate(View.RAD_NAV_HOME) },
        { id: 'ops', label: 'Operational Procedures (070)', icon: <BookOpen size={18} />, action: () => onNavigate(View.OPS_PROC_HOME) },
        { id: 'met', label: 'Meteorology (050)', icon: <Cloud size={18} />, action: () => onNavigate(View.MET_HOME) },

        // Tools
        { id: 'concept', label: 'Visual Concept Lab', icon: <Box size={18} />, action: () => onNavigate(View.CONCEPT_LAB) },
    ];

    // Filter commands based on query
    const filteredCommands = query === ''
        ? commands
        : commands.filter(cmd => cmd.label.toLowerCase().includes(query.toLowerCase()));

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
                    onClose();
                }
            } else if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, filteredCommands, selectedIndex, onClose]);

    // Reset selection when query changes
    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-[20vh] animate-in fade-in duration-200" onClick={onClose}>
            <div
                className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center px-4 py-3 border-b border-slate-800">
                    <Search className="text-slate-400 mr-3" size={20} />
                    <input
                        autoFocus
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Type a command or search..."
                        className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-500 text-lg"
                    />
                    <div className="text-[10px] font-bold bg-slate-800 text-slate-400 px-2 py-1 rounded border border-slate-700">ESC</div>
                </div>

                <div className="max-h-[300px] overflow-y-auto py-2">
                    {filteredCommands.length === 0 ? (
                        <div className="px-4 py-8 text-center text-slate-500 text-sm">No results found.</div>
                    ) : (
                        filteredCommands.map((cmd, index) => (
                            <button
                                key={cmd.id}
                                onClick={() => { cmd.action(); onClose(); }}
                                onMouseEnter={() => setSelectedIndex(index)}
                                className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${index === selectedIndex ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                                    }`}
                            >
                                <span className={index === selectedIndex ? 'text-indigo-200' : 'text-slate-500'}>
                                    {cmd.icon}
                                </span>
                                <span className="font-medium">{cmd.label}</span>
                                {index === selectedIndex && (
                                    <span className="ml-auto text-xs opacity-70">Jump to</span>
                                )}
                            </button>
                        ))
                    )}
                </div>

                <div className="bg-slate-950 px-4 py-2 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
                    <div>
                        <span className="font-bold">ProTip:</span> Use arrow keys to navigate
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
