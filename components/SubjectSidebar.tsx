import React, { useEffect, useMemo, useState } from 'react';
import { View } from '../types';
import { SubjectConfig } from '../data/sidebarNavigation';
import { ChevronLeft, Circle, CheckCircle2, X, Search, Trophy } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';
import { triggerHaptic } from '../lib/nativeBridge';
import { PROGRESS_EVENT, readLessonMeta } from '../lib/lessonProgress';

interface Props {
    config: SubjectConfig;
    currentView: View;
    onNavigate: (view: View) => void;
    onClose?: () => void; // For mobile
}

const SubjectSidebar: React.FC<Props> = ({ config, currentView, onNavigate, onClose }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [doneIds, setDoneIds] = useState<string[]>(() => readLessonMeta().doneIds);
    const { xp, rank, progressToNextLevel } = useGamification();

    useEffect(() => {
        const sync = () => setDoneIds(readLessonMeta().doneIds);
        window.addEventListener(PROGRESS_EVENT, sync);
        return () => window.removeEventListener(PROGRESS_EVENT, sync);
    }, []);

    const filteredItems = useMemo(() => {
        if (!searchQuery.trim()) return config.items;
        return config.items.filter(item =>
            item.label.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [config.items, searchQuery]);

    const topicItems = useMemo(
        () => config.items.filter(item => item.view !== config.dashboardView),
        [config]
    );
    const doneTopicCount = useMemo(
        () => topicItems.filter(item => doneIds.includes(`topic-${item.view}`)).length,
        [topicItems, doneIds]
    );
    const topicPct = topicItems.length > 0 ? Math.round((doneTopicCount / topicItems.length) * 100) : 0;

    return (
        <div className="h-full flex flex-col bg-bg-raised border-r border-line">
            {/* Header */}
            <div className="p-4 border-b border-line relative">
                <div className="flex justify-between items-center mb-3">
                    <button
                        onClick={() => {
                            triggerHaptic('light');
                            onNavigate(View.PLATFORM_DASHBOARD);
                        }}
                        className="flex items-center text-[11px] font-mono font-bold text-muted hover:text-ink transition-colors group p-1 -ml-1 active:scale-95 cursor-pointer"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                        BACK TO HANGAR
                    </button>
                    {onClose && (
                        <button
                            onClick={() => {
                                triggerHaptic('light');
                                onClose();
                            }}
                            className="lg:hidden w-9 h-9 -mr-1 text-muted hover:text-ink bg-bg border border-line active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                            aria-label="Close Sidebar"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                <div className="hud-label text-cad-accent mb-0.5">SUBJECT {config.id}</div>
                <h2 className="font-display text-lg font-bold text-ink tracking-tight">{config.title}</h2>

                {/* Live Subject Mastery Progress */}
                <div className="mt-3">
                    <div className="flex justify-between font-mono text-[10px] uppercase tracking-wider text-muted mb-1">
                        <span>{doneTopicCount} / {topicItems.length} DONE</span>
                        <span className="text-emerald-400 font-bold">{topicPct}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-line overflow-hidden">
                        <div
                            className="h-full bg-emerald-400 transition-all duration-300"
                            style={{ width: `${topicPct}%` }}
                        />
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mt-3 relative group">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Search className="w-3.5 h-3.5 text-muted" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search topics..."
                        className="w-full bg-bg border border-line py-1.5 pl-9 pr-7 text-xs text-ink placeholder-muted focus:outline-none focus:border-cad-accent transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute inset-y-0 right-2 flex items-center px-1 text-muted hover:text-ink cursor-pointer"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
            </div>

            {/* Scrollable List */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
                {filteredItems.length === 0 ? (
                    <div className="py-8 text-center">
                        <p className="text-xs text-muted italic">No topics match your search</p>
                        <button
                            onClick={() => setSearchQuery('')}
                            className="mt-2 text-[10px] font-mono font-bold text-cad-accent uppercase tracking-wider cursor-pointer"
                        >
                            Clear search
                        </button>
                    </div>
                ) : (
                    filteredItems.map((item, idx) => {
                        const isActive = currentView === item.view;
                        const isDone = doneIds.includes(`topic-${item.view}`);
                        const Icon = item.icon || (isDone ? CheckCircle2 : Circle);

                        return (
                            <button
                                key={idx}
                                onClick={() => {
                                    triggerHaptic('selection');
                                    onNavigate(item.view);
                                    if (onClose) onClose();
                                }}
                                className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 text-xs font-medium border transition-colors cursor-pointer ${
                                    isActive
                                        ? 'border-cad-accent bg-cad-accent/15 text-ink font-bold'
                                        : 'border-transparent text-muted hover:text-ink hover:bg-bg'
                                }`}
                            >
                                <span className="flex items-center gap-2.5 min-w-0">
                                    <Icon
                                        size={15}
                                        className={
                                            isDone
                                                ? 'text-emerald-400 shrink-0'
                                                : isActive
                                                ? 'text-cad-accent shrink-0'
                                                : 'opacity-50 shrink-0'
                                        }
                                    />
                                    <span className="truncate">{item.label}</span>
                                </span>
                                {isDone && (
                                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                                )}
                            </button>
                        );
                    })
                )}
            </div>

            {/* Gamification Status Footer */}
            <div className="p-4 border-t border-line bg-bg [padding-bottom:max(env(safe-area-inset-bottom,0px),var(--sab,0px),1rem)]">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 border border-emerald-500/40 bg-emerald-500/15 flex items-center justify-center">
                        <Trophy size={14} className="text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-ink truncate">{rank}</div>
                        <div className="text-[10px] text-muted font-mono">{xp} XP</div>
                    </div>
                </div>
                <div className="h-1.5 w-full bg-line overflow-hidden">
                    <div
                        className="h-full bg-emerald-500 transition-all duration-500"
                        style={{ width: `${progressToNextLevel}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default SubjectSidebar;
