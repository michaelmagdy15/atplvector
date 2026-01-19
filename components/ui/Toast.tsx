import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
    onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, type, message, duration = 3000, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, id, onClose]);

    const icons = {
        success: <CheckCircle size={20} className="text-emerald-400" />,
        error: <AlertCircle size={20} className="text-red-400" />,
        info: <Info size={20} className="text-blue-400" />,
        warning: <AlertTriangle size={20} className="text-amber-400" />
    };

    const styles = {
        success: 'bg-emerald-900/90 border-emerald-500/50 text-emerald-50',
        error: 'bg-red-900/90 border-red-500/50 text-red-50',
        info: 'bg-blue-900/90 border-blue-500/50 text-blue-50',
        warning: 'bg-amber-900/90 border-amber-500/50 text-amber-50'
    };

    return (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-md animate-in slide-in-from-top-2 fade-in duration-300 min-w-[300px] max-w-md ${styles[type]}`}>
            <div className="shrink-0">{icons[type]}</div>
            <p className="text-sm font-medium flex-1">{message}</p>
            <button
                onClick={() => onClose(id)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors shrink-0"
            >
                <X size={16} />
            </button>
        </div>
    );
};

export default Toast;
