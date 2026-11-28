import React, { useEffect, useState } from 'react';
import { Compass, Layers, Sparkles, X } from 'lucide-react';
import { View } from '../../types';

const TOUR_KEY = 'atplvector-autopilot-seen';

const STOPS = [
  {
    title: '1. Steer by Instrument Heading',
    body: 'Drag the **HSI Compass** on your Hangar dashboard to rotate between EASA training pillars and jump directly into any subject.',
    icon: Compass,
  },
  {
    title: '2. Toggle Exam vs Airline Prep',
    body: 'Switch between focused **EASA Exam (75%)** rules and deeper **Airline Prep** engineering notes across our upgraded v2 lessons.',
    icon: Layers,
  },
  {
    title: '3. Scroll 3D Sims + Open Kneeboards',
    body: 'Every topic now includes a one-click **Kneeboard & Formulas** drawer, **Don’t Mix Up** traps, and interactive **Hold Short** active checks.',
    icon: Sparkles,
  },
];

export const AutopilotTour: React.FC<{ currentView: View }> = ({ currentView }) => {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (currentView !== View.PLATFORM_DASHBOARD) {
      setVisible(false);
      return;
    }
    try {
      if (!localStorage.getItem(TOUR_KEY)) {
        const t = setTimeout(() => setVisible(true), 800);
        return () => clearTimeout(t);
      }
    } catch {
      // ignore storage errors
    }
  }, [currentView]);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(TOUR_KEY, '1');
    } catch {
      // ignore storage errors
    }
  };

  if (!visible || currentView !== View.PLATFORM_DASHBOARD) return null;

  const cur = STOPS[step] || STOPS[0];
  const Icon = cur.icon;

  return (
    <div
      role="dialog"
      aria-label="ATPLVector Autopilot Tour"
      className="fixed bottom-20 sm:bottom-6 right-4 z-[80] w-80 max-w-[calc(100vw-2rem)] dx-card border-cad-accent bg-bg-raised p-4 shadow-2xl"
    >
      <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-line">
        <span className="hud-label text-cad-accent flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cad-accent animate-ping" />
          AUTOPILOT TOUR · {step + 1}/{STOPS.length}
        </span>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close tour"
          className="p-1 text-muted hover:text-ink cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-start gap-3">
        <div className="p-2 border border-line bg-bg text-cad-accent shrink-0">
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-ink">{cur.title}</h4>
          <p className="text-[11px] text-muted mt-1 leading-relaxed">{cur.body.replace(/\*\*/g, '')}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-2 border-t border-line">
        <button
          type="button"
          onClick={dismiss}
          className="text-[10px] font-mono uppercase text-muted hover:text-ink cursor-pointer"
        >
          Skip tour
        </button>
        {step < STOPS.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            className="px-3 py-1 bg-cad-accent text-white text-[11px] font-mono font-bold uppercase cursor-pointer"
          >
            Next →
          </button>
        ) : (
          <button
            type="button"
            onClick={dismiss}
            className="px-3 py-1 bg-emerald-600 text-white text-[11px] font-mono font-bold uppercase cursor-pointer"
          >
            Fly solo ✓
          </button>
        )}
      </div>
    </div>
  );
};

export default AutopilotTour;
