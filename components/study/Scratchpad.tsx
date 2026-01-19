import React, { useState, useEffect } from 'react';
import { PenTool, Save, Trash2, Maximize2, Minimize2, X } from 'lucide-react';
import { useToast } from '../ui/ToastContext';

const Scratchpad: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [note, setNote] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const { success } = useToast();

    // Load from local storage on mount
    useEffect(() => {
        const savedNote = localStorage.getItem('atpl_scratchpad');
        if (savedNote) setNote(savedNote);
    }, []);

    // Auto-save effect
    useEffect(() => {
        const handler = setTimeout(() => {
            localStorage.setItem('atpl_scratchpad', note);
        }, 1000); // Debounce save every 1s

        return () => clearTimeout(handler);
    }, [note]);

    const handleClear = () => {
        if (confirm('Clear your notes? This cannot be undone.')) {
            setNote('');
            localStorage.removeItem('atpl_scratchpad');
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-20 bg-slate-800 border border-slate-700 p-3 rounded-full text-white shadow-lg z-50 hover:bg-slate-700 transition-all active:scale-95 group"
                title="Open Scratchpad"
            >
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border border-slate-900" style={{ display: note.length > 0 ? 'block' : 'none' }}></div>
                <PenTool size={24} className="text-slate-400 group-hover:text-emerald-400 transition-colors" />
            </button>
        );
    }

    return (
        <div className={`fixed bottom-20 right-4 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 transition-all ${isExpanded ? 'w-[500px] h-[600px]' : 'w-80 h-96'}`}>
            {/* Header */}
            <div className="flex items-center justify-between p-3 bg-slate-800 border-b border-slate-700">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-wider">
                    <PenTool size={16} /> Scratchpad
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
                        title={isExpanded ? "Collapse" : "Expand"}
                    >
                        {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                    </button>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between bg-slate-900 p-2 border-b border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold pl-2">
                    {note.length} chars • Autosaved
                </span>
                <button
                    onClick={handleClear}
                    className="flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-red-400 px-2 py-1 rounded hover:bg-slate-800 transition-colors"
                >
                    <Trash2 size={12} /> CLEAR
                </button>
            </div>

            {/* Editor Area */}
            <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="flex-1 w-full bg-slate-950 p-4 text-slate-300 placeholder-slate-600 focus:outline-none resize-none font-mono text-sm leading-relaxed"
                placeholder="Type your quick notes here... They stick around even if you close the browser."
                spellCheck={false}
            />
        </div>
    );
};

export default Scratchpad;
