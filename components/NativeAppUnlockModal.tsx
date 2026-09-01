import React from 'react';
import { Tablet, Smartphone, Download, Lock, CheckCircle2, X, ExternalLink } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  featureTitle?: string;
}

const NativeAppUnlockModal: React.FC<Props> = ({ 
  isOpen, 
  onClose, 
  featureTitle = 'Full ATPL Question Bank & High-Yield Summary Decks' 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 select-none">
      <div className="relative max-w-lg w-full bg-slate-900 border border-blue-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-blue-900/40 text-slate-100 overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Tablet className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-[11px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
              IPAD & MOBILE EXCLUSIVE
            </span>
            <h2 className="text-xl font-bold text-white mt-1">Unlock Full Flight Deck</h2>
          </div>
        </div>

        <p className="text-slate-300 text-sm mb-6 leading-relaxed">
          You are currently in <span className="text-blue-400 font-semibold">Web Preview Mode</span>. To protect our proprietary content and provide an optimal flight training experience, <span className="text-white font-medium">{featureTitle}</span> is available exclusively in the native iPad & Mobile app.
        </p>

        {/* Benefits Grid */}
        <div className="space-y-2.5 mb-6 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-3 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Complete 14-subject EASA ATPL Question Bank (15,000+ LO questions)</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Interactive 3D aerodynamic visualizers & Apple Pencil scratchpad</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Offline encrypted study vault for in-flight revision</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="https://testflight.apple.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Get on iPad (TestFlight)</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>

          <button
            onClick={onClose}
            className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition-colors"
          >
            Continue Web Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default NativeAppUnlockModal;
