import React from 'react';
import { ShieldAlert, Tablet, Smartphone, Download, Lock, CheckCircle2, Award, ExternalLink } from 'lucide-react';

interface Props {
  onBypassDev?: () => void;
}

const MobileOnlyGateScreen: React.FC<Props> = ({ onBypassDev }) => {
  const isDev = import.meta.env.DEV;

  return (
    <div className="min-h-screen w-full bg-[#030712] text-slate-100 flex flex-col justify-between items-center p-6 relative overflow-hidden select-none">
      {/* Dynamic Background Gradients & Radar Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/30 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Header Bar */}
      <header className="w-full max-w-4xl flex items-center justify-between z-10 pt-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-wider text-white flex items-center gap-2">
              ATPL VECTOR <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-mono">SECURE FLIGHT DECK</span>
            </h1>
            <p className="text-xs text-slate-400">Next-Gen EASA Airline Transport Pilot Ground School</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-400">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>DRM HARDENED CONTAINER</span>
        </div>
      </header>

      {/* Main Gate Hero */}
      <main className="max-w-2xl w-full z-10 my-auto py-10 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-6 shadow-inner backdrop-blur-md">
          <Tablet className="w-4 h-4 text-blue-400 animate-pulse" />
          <span>EXCLUSIVE IPAD & MOBILE NATIVE APPLICATION</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
          Restricted to <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">iPad & Mobile Flight Decks</span>
        </h2>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-xl mx-auto">
          To protect proprietary ATPL question banks, high-fidelity 3D aerodynamic visualizers, and summary syllabus content, 
          ATPL Vector runs exclusively inside our cryptographically attested native application.
        </p>

        {/* Feature Security Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mb-8 text-left">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 mb-2">
              <Tablet className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-xs text-slate-200">iPad Split Cockpit</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Optimized for iPad Pro/Air with Apple Pencil scratchpads and split-screen charts.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-2">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-xs text-slate-200">Offline Study Vault</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Encrypted local storage allowing pilots to study offline at FL390 without leaks.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-2">
              <Award className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-xs text-slate-200">Device Authenticated</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Secured with Apple DeviceCheck & hardware attestation.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
          <a
            href="https://testflight.apple.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Install on iPad via TestFlight</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>

          <a
            href="https://apps.apple.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-semibold text-sm hover:bg-slate-800 hover:border-slate-600 transition-all flex items-center justify-center gap-2"
          >
            <Smartphone className="w-4 h-4 text-slate-400" />
            <span>App Store (Coming Soon)</span>
          </a>
        </div>

        {/* Developer Bypass (Only visible in Local Development) */}
        {isDev && onBypassDev && (
          <div className="mt-8 pt-4 border-t border-slate-800/60 w-full flex items-center justify-center">
            <button
              onClick={onBypassDev}
              className="px-4 py-2 text-xs font-mono bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg transition-colors flex items-center gap-2"
            >
              <span>[DEV ONLY] Bypass Gate to Preview Web UI</span>
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-2 z-10 pt-6 border-t border-slate-800/40 text-xs text-slate-500 font-mono">
        <div>© {new Date().getFullYear()} ATPL VECTOR. ALL RIGHTS RESERVED.</div>
        <div className="flex items-center gap-4">
          <span>EASA EC 1178/2011</span>
          <span>•</span>
          <span>ICAO DOC 9868</span>
          <span>•</span>
          <span>SECURE NATIVE ENCLAVE</span>
        </div>
      </footer>
    </div>
  );
};

export default MobileOnlyGateScreen;
