import React, { Component, ErrorInfo, ReactNode } from 'react';
import { WifiOff, RefreshCw, Home } from 'lucide-react';

interface Props {
    children?: ReactNode;
    onResetView?: () => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

function isDynamicImportError(error: Error | null | undefined): boolean {
    if (!error) return false;
    const msg = error.message || '';
    return (
        error.name === 'ChunkLoadError' ||
        /Failed to fetch dynamically imported module/i.test(msg) ||
        /Importing a module script failed/i.test(msg) ||
        /error loading dynamically imported module/i.test(msg) ||
        /Unable to preload CSS/i.test(msg) ||
        /Load failed/i.test(msg)
    );
}

async function clearStaleCachesAndReload() {
    try {
        if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            await Promise.all(registrations.map((r) => r.unregister()));
        }
        if ('caches' in window) {
            const keys = await caches.keys();
            await Promise.all(keys.map((k) => caches.delete(k)));
        }
    } catch (e) {
        console.warn('Cache cleanup skipped:', e);
    }
    const url = new URL(window.location.href);
    url.searchParams.set('_v', Date.now().toString());
    window.location.replace(url.toString());
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

        // Auto-reload on chunk/module script load errors (including iOS Safari "Importing a module script failed.")
        if (isDynamicImportError(error)) {
            const lastReload = Number(sessionStorage.getItem('atpl_chunk_reload_ts') || '0');
            if (Date.now() - lastReload > 10000) {
                sessionStorage.setItem('atpl_chunk_reload_ts', Date.now().toString());
                clearStaleCachesAndReload();
            }
        }
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
        if (this.props.onResetView) {
            this.props.onResetView();
        } else {
            clearStaleCachesAndReload();
        }
    };

    private handleHardReload = () => {
        this.setState({ hasError: false, error: null });
        clearStaleCachesAndReload();
    };

    public render() {
        if (this.state.hasError) {
            const isChunkError = isDynamicImportError(this.state.error);

            return (
                <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans">
                    <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-xl border border-red-500/20 rounded-3xl p-8 text-center shadow-2xl">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-red-500/5">
                            <WifiOff className="w-8 h-8 text-red-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-3">
                            {isChunkError ? 'Updating Application Module...' : 'System Glitch Detected'}
                        </h1>
                        <p className="text-slate-400 mb-6 text-sm">
                            {isChunkError 
                                ? 'A newer version of this simulator module was deployed. Tap Reboot System below to load the latest build.'
                                : 'An unexpected error occurred while rendering this module. Our telemetry has captured the fault.'}
                        </p>
                        
                        <div className="bg-slate-950/60 rounded-xl p-4 mb-6 border border-slate-800 text-left">
                            <p className="text-xs font-mono text-red-400 break-words opacity-85">
                                {this.state.error?.message || 'Unknown Error'}
                            </p>
                        </div>

                        <div className="space-y-3">
                            {this.props.onResetView && (
                                <button
                                    onClick={this.handleReset}
                                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 active:scale-95"
                                >
                                    <Home size={18} />
                                    <span>Return to Hangar</span>
                                </button>
                            )}
                            <button
                                onClick={this.handleHardReload}
                                className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold transition-all border border-white/10 flex items-center justify-center gap-2 active:scale-95"
                            >
                                <RefreshCw size={18} />
                                <span>Reboot System</span>
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
