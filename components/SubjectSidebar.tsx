
import React from 'react';
import { View } from '../types';
import { SubjectConfig } from '../data/sidebarNavigation';
import { ChevronLeft, Circle, CheckCircle2 } from 'lucide-react';

interface Props {
    config: SubjectConfig;
    currentView: View;
    onNavigate: (view: View) => void;
    onClose?: () => void; // For mobile
}

const SubjectSidebar: React.FC<Props> = ({ config, currentView, onNavigate, onClose }) => {
    
    // Dynamic color classes based on config.color
    const getColorClass = (isActive: boolean) => {
        const base = "transition-all duration-200 flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ";
        // Map simplified color names to tailwind
        const activeMap: Record<string, string> = {
            red: "bg-red-500/20 text-red-100 border border-red-500/30 shadow-sm",
            orange: "bg-orange-500/20 text-orange-100 border border-orange-500/30 shadow-sm",
            yellow: "bg-yellow-500/20 text-yellow-100 border border-yellow-500/30 shadow-sm",
            emerald: "bg-emerald-500/20 text-emerald-100 border border-emerald-500/30 shadow-sm",
            teal: "bg-teal-500/20 text-teal-100 border border-teal-500/30 shadow-sm",
            cyan: "bg-cyan-500/20 text-cyan-100 border border-cyan-500/30 shadow-sm",
            sky: "bg-sky-500/20 text-sky-100 border border-sky-500/30 shadow-sm",
            blue: "bg-blue-500/20 text-blue-100 border border-blue-500/30 shadow-sm",
            indigo: "bg-indigo-500/20 text-indigo-100 border border-indigo-500/30 shadow-sm",
            violet: "bg-violet-500/20 text-violet-100 border border-violet-500/30 shadow-sm",
            purple: "bg-purple-500/20 text-purple-100 border border-purple-500/30 shadow-sm",
            pink: "bg-pink-500/20 text-pink-100 border border-pink-500/30 shadow-sm",
        };
        const activeClass = activeMap[config.color] || activeMap['indigo'];
        
        return isActive 
            ? base + activeClass 
            : base + "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent";
    };

    return (
        <div className="h-full flex flex-col bg-slate-900/50 backdrop-blur-xl border-r border-white/5 md:border-none md:bg-transparent">
            {/* Header */}
            <div className="p-4 mb-2">
                <button 
                    onClick={() => onNavigate(View.PLATFORM_DASHBOARD)}
                    className="flex items-center text-xs font-bold text-slate-500 hover:text-white mb-4 transition-colors group"
                >
                    <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                    BACK TO HANGAR
                </button>
                <h2 className="text-xl font-black text-white tracking-tight">{config.title}</h2>
                <p className="text-xs text-slate-400 font-mono mt-1">SUBJECT {config.id}</p>
            </div>

            {/* Scrollable List */}
            <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1 scrollbar-thin scrollbar-thumb-slate-700">
                {config.items.map((item, idx) => {
                    const isActive = currentView === item.view;
                    const Icon = item.icon || (isActive ? CheckCircle2 : Circle);
                    
                    return (
                        <button
                            key={idx}
                            onClick={() => {
                                onNavigate(item.view);
                                if (onClose) onClose();
                            }}
                            className={getColorClass(isActive)}
                        >
                            <Icon size={16} className={isActive ? "opacity-100" : "opacity-50"} />
                            <span className="truncate">{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default SubjectSidebar;
