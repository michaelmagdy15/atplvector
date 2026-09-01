import React from 'react';
import { Tablet, Sparkles, ExternalLink } from 'lucide-react';
import { Capacitor } from '@capacitor/core';

interface Props {
  onUnlockClick?: () => void;
}

const WebPreviewBanner: React.FC<Props> = ({ onUnlockClick }) => {
  if (Capacitor.isNativePlatform()) return null;

  return (
    <aside aria-label="Web preview notice" className="w-full bg-gradient-to-r from-blue-900/80 via-indigo-950/80 to-slate-900/80 border-b border-blue-500/30 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 backdrop-blur-md z-40 relative select-none">
      <div className="flex items-center gap-2 text-blue-200">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
        </span>
        <Tablet className="w-4 h-4 text-blue-400" />
        <span className="font-semibold text-white">Web Preview Mode</span>
        <span className="hidden sm:inline text-slate-300">— Experience full high-yield question banks & 3D cockpits on iPad.</span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onUnlockClick}
          className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Unlock Full iPad App</span>
          <ExternalLink className="w-3 h-3 opacity-70" />
        </button>
      </div>
    </aside>
  );
};

export default WebPreviewBanner;
