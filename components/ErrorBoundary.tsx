import React, { Component, ErrorInfo, ReactNode } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
        
        // Auto-reload on chunk load errors (often caused by new deployments)
        if (error.name === 'ChunkLoadError' || error.message.includes('Failed to fetch dynamically imported module')) {
            window.location.reload();
        }
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            // Check if it's a chunk error specifically to show a better message
            const isChunkError = this.state.error?.name === 'ChunkLoadError' || 
                               this.state.error?.message.includes('Failed to fetch dynamically imported module');

            return (
                <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans">
                    <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-xl border border-red-500/20 rounded-3xl p-8 text-center shadow-2xl">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-red-500/5">
                            <WifiOff className="w-8 h-8 text-red-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-3">
                            {isChunkError ? 'Connection Interrupted' : 'System Glitch Detected'}
                        </h1>
                        <p className="text-slate-400 mb-8 text-sm">
                            {isChunkError 
                                ? 'A network error prevented the module from loading. This usually happens when the app updates or your connection drops.'
                                : 'An unexpected error occurred while rendering this module. Our telemetry has captured the fault.'}
                        </p>
                        
                        <div className="bg-slate-950/50 rounded-xl p-4 mb-8 border border-slate-800 text-left overflow-hidden">
                            <p className="text-xs font-mono text-red-400 truncate opacity-70">
                                {this.state.error?.message || 'Unknown Error'}
                            </p>
                        </div>

                        <button
                            onClick={this.handleReset}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 active:scale-95"
                        >
                            <RefreshCw size={18} />
                            <span>Reboot System</span>
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
