import React, { useEffect, useState } from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  userId?: string;
  userEmail?: string;
  enforceProtection?: boolean;
}

const ContentProtection: React.FC<Props> = ({ 
  children, 
  userId, 
  userEmail,
  enforceProtection = true 
}) => {
  const [blurred, setBlurred] = useState(false);
  const [warning, setWarning] = useState(false);
  const [sessionStamp] = useState(() => new Date().toISOString().substring(0, 19).replace('T', ' '));

  useEffect(() => {
    if (!enforceProtection) return;

    // 1. Disable Right Click Context Menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // 2. Prevent Drag and Drop of proprietary diagrams / images
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // 3. Intercept PrintScreen, Copy, and DevTools keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen, Cmd+Shift+3/4/5 (Mac screenshot), Ctrl+P (Print), Ctrl+S (Save page), Ctrl+U (View Source)
      if (
        e.key === 'PrintScreen' ||
        ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 's' || e.key === 'u' || e.key === 'c' && window.getSelection()?.toString())) ||
        (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5'))
      ) {
        if (e.key === 'PrintScreen' || (e.ctrlKey && (e.key === 'p' || e.key === 's' || e.key === 'u'))) {
          e.preventDefault();
        }
        setBlurred(true);
        setWarning(true);
        const timer = setTimeout(() => {
          setBlurred(false);
          setWarning(false);
        }, 2200);
        return () => clearTimeout(timer);
      }
    };

    // 4. Blur on window focus loss (e.g. switching to screen recorder or external capture software)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setBlurred(true);
      } else {
        setBlurred(false);
      }
    };

    // 5. Native iOS / iPad selection callout suppressor
    document.documentElement.style.webkitUserSelect = 'none';
    document.documentElement.style.userSelect = 'none';

    window.addEventListener('contextmenu', handleContextMenu, { capture: true });
    window.addEventListener('dragstart', handleDragStart, { capture: true });
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu, { capture: true });
      window.removeEventListener('dragstart', handleDragStart, { capture: true });
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enforceProtection]);

  const watermarkTag = userEmail || userId || 'ATPL VECTOR NATIVE FLIGHT DECK';

  return (
    <div className="relative w-full min-h-screen protected-content select-none overflow-x-hidden">
      {/* Dynamic Traceable Watermark Overlay Grid */}
      <div 
        className="fixed inset-0 pointer-events-none z-50 flex flex-wrap opacity-[0.035] overflow-hidden select-none"
        aria-hidden="true"
      >
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="w-72 h-72 flex flex-col items-center justify-center -rotate-45 transform p-4 text-center">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-100">
              ATPL VECTOR PROPRIETARY
            </span>
            <span className="text-[10px] font-mono text-slate-300 mt-0.5">
              PILOT: {watermarkTag}
            </span>
            <span className="text-[9px] font-mono text-slate-400">
              {sessionStamp} • SECURE CONTAINER
            </span>
          </div>
        ))}
      </div>

      {/* Screen Capture Detected Warning Modal */}
      {warning && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="text-center p-8 bg-slate-900 border border-red-500/40 rounded-2xl max-w-md shadow-2xl shadow-red-900/30">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-400 animate-pulse" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">CAPTURE PREVENTED</h2>
            <p className="text-sm text-slate-300 mb-4">
              ATPL Vector study material is cryptographically watermarked and licensed exclusively for your registered flight deck device.
            </p>
            <div className="text-xs font-mono text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              ID: {watermarkTag}
            </div>
          </div>
        </div>
      )}

      {/* Content Blur Filter on capture attempt or focus loss */}
      <div className={`transition-all duration-300 ${blurred ? 'blur-2xl opacity-10 pointer-events-none' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default ContentProtection;
