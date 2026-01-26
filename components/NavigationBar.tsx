import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NavigationBarProps {
    canGoBack: boolean;
    canGoForward: boolean;
    onBack: () => void;
    onForward: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
    canGoBack,
    canGoForward,
    onBack,
    onForward
}) => {
    return (
        <div className="flex items-center gap-2">
            <button
                onClick={onBack}
                disabled={!canGoBack}
                className={`p-2.5 rounded-lg transition-all duration-200 ${canGoBack
                    ? 'text-slate-300 hover:text-white hover:bg-white/10 active:scale-95'
                    : 'text-slate-600 cursor-not-allowed'
                    }`}
                title="Go back"
                aria-label="Go back"
            >
                <ChevronLeft size={22} />
            </button>
            <button
                onClick={onForward}
                disabled={!canGoForward}
                className={`p-2.5 rounded-lg transition-all duration-200 ${canGoForward
                    ? 'text-slate-300 hover:text-white hover:bg-white/10 active:scale-95'
                    : 'text-slate-600 cursor-not-allowed'
                    }`}
                title="Go forward"
                aria-label="Go forward"
            >
                <ChevronRight size={22} />
            </button>
        </div>
    );
};

export default NavigationBar;
