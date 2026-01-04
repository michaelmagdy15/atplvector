
import React, { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
    children: React.ReactNode;
    userId?: string;
}

const ContentProtection: React.FC<Props> = ({ children, userId }) => {
    const [blurred, setBlurred] = useState(false);
    const [warning, setWarning] = useState(false);

    useEffect(() => {
        // Disable Right Click
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        // Detect PrintScreen or Copy keys
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'PrintScreen' || (e.ctrlKey && e.key === 'p') || (e.metaKey && e.shiftKey && e.key === '4')) {
                setBlurred(true);
                setWarning(true);
                setTimeout(() => {
                    setBlurred(false);
                    setWarning(false);
                }, 2000);
            }
        };

        // Blur on window focus loss (e.g. switching to recording software)
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setBlurred(true);
            } else {
                setBlurred(false);
            }
        };

        window.addEventListener('contextmenu', handleContextMenu);
        window.addEventListener('keydown', handleKeyDown); // Note: PrintScreen is often intercepted by OS before browser
        window.addEventListener('keyup', handleKeyDown);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('contextmenu', handleContextMenu);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyDown);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    return (
        <div className="relative w-full min-h-screen protected-content">
            {/* Watermark Overlay */}
            <div className="fixed inset-0 pointer-events-none z-50 flex flex-wrap opacity-[0.03] overflow-hidden select-none">
                {[...Array(20)].map((_, i) => (
                    <div key={i} className="w-64 h-64 flex items-center justify-center -rotate-45 transform">
                        <span className="text-xl font-bold text-black">
                            ATPL VECTOR<br/>
                            {userId || 'PREVIEW'}<br/>
                            DO NOT DISTRIBUTE
                        </span>
                    </div>
                ))}
            </div>

            {/* Anti-Screenshot Warning Overlay */}
            {warning && (
                <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
                    <div className="text-center p-8 bg-red-900 rounded-xl">
                        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">SCREENSHOT DETECTED</h2>
                        <p className="text-red-200">Recording or capturing this content is strictly prohibited.</p>
                    </div>
                </div>
            )}

            {/* Content Blur Filter */}
            <div className={`transition-all duration-300 ${blurred ? 'blur-xl opacity-20' : ''}`}>
                {children}
            </div>
        </div>
    );
};

export default ContentProtection;
