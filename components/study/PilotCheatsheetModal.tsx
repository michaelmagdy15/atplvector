import React, { useState } from 'react';
import { 
  BookMarked, 
  X, 
  Search, 
  Copy, 
  Check, 
  Gauge, 
  TrendingUp, 
  CloudRain, 
  Compass, 
  Radio, 
  Scale, 
  ShieldAlert, 
  Maximize2, 
  Minimize2,
  ChevronRight
} from 'lucide-react';
import { triggerHaptic } from '../../lib/nativeBridge';

interface CheatsheetSection {
  id: string;
  title: string;
  category: string;
  badge: string;
  icon: any;
  items: {
    label: string;
    value: string;
    details?: string;
    ruleOfThumb?: string;
  }[];
}

const CHEATSHEET_SECTIONS: CheatsheetSection[] = [
  {
    id: 'v-speeds',
    title: 'V-Speed Certification Hierarchy (CS-25)',
    category: 'Performance',
    badge: '032',
    icon: Gauge,
    items: [
      {
        label: 'Hierarchy Rule',
        value: 'Vmcg ≤ V1 ≤ VR ≤ Vmbe',
        details: 'V1 cannot be lower than Vmcg (rudder alone, nosewheel failed) and cannot exceed VR or maximum brake energy speed (Vmbe).'
      },
      {
        label: 'V2 Minimum Speed',
        value: 'V2 ≥ 1.13 Vsr (or 1.20 Vs)',
        details: 'Takeoff safety speed at 35 ft screen height with critical engine failed.',
        ruleOfThumb: 'Guarantees 2nd segment climb gradient margin above stall.'
      },
      {
        label: 'VR (Rotation Speed)',
        value: 'VR ≥ 1.05 Vmca',
        details: 'Must allow reaching V2 before reaching 35 ft screen height.',
        ruleOfThumb: 'Never rotate below VR; tailstrike or stall danger.'
      },
      {
        label: 'Vref (Threshold Speed)',
        value: 'Vref ≥ 1.23 Vsr0',
        details: 'Target speed at 50 ft threshold crossing in landing configuration.',
        ruleOfThumb: 'Add wind additive up to max 15-20 kt for gusts.'
      }
    ]
  },
  {
    id: 'climb-segments',
    title: 'Takeoff Climb Gradients (CS-25 Twin)',
    category: 'Performance',
    badge: '032 / CS-25',
    icon: TrendingUp,
    items: [
      {
        label: '1st Segment',
        value: '35 ft to Gear Retracted // Pos Gradient (>0%)',
        details: 'Flaps Takeoff, Gear Down, Speed V2. Twin gross min: > 0%. Net penalty: -0.8%.'
      },
      {
        label: '2nd Segment (Most Restrictive)',
        value: 'Gear Retracted to Min 400 ft // 2.4% Gross',
        details: 'Flaps Takeoff, Gear Up, Speed V2. Twin gross min: 2.4%. Obstacle Net = Gross - 0.8% (1.6% min net).',
        ruleOfThumb: 'Usually limits maximum takeoff mass on hot/high airfields.'
      },
      {
        label: '3rd Segment (Acceleration)',
        value: '400 ft to Clean Configuration // Level Accel',
        details: 'Flaps retracting, speed accelerating to Vfto. Obstacle Net penalty: -0.8% gradient equivalent.'
      },
      {
        label: '4th Segment (Final Takeoff)',
        value: 'Cleaned Up to 1,500 ft AGL // 1.2% Gross',
        details: 'Gear Up, Flaps 0, Speed Vfto, Max Continuous Thrust (MCT). Net penalty: -0.8%.'
      }
    ]
  },
  {
    id: 'awo-minima',
    title: 'All-Weather Operations (AWO) Minima',
    category: 'Air Law / Ops',
    badge: '010 / 070',
    icon: CloudRain,
    items: [
      {
        label: 'Category I',
        value: 'DH ≥ 200 ft // RVR ≥ 550 m',
        details: '800 m RVR for non-autocoupled approach without HUD/autoland. Visual req: at least 1 light element.',
        ruleOfThumb: 'Standard precision approach.'
      },
      {
        label: 'Category II',
        value: 'DH 100-199 ft // RVR ≥ 300 m',
        details: 'Visual req: 3 consecutive lights (centerline or threshold + 2 others). Autocoupled.'
      },
      {
        label: 'Category IIIA',
        value: 'DH < 100 ft or No DH // RVR ≥ 175 m',
        details: 'Visual req: 3 consecutive lights of touchdown zone or centerline.'
      },
      {
        label: 'Category IIIB',
        value: 'DH < 50 ft or No DH // RVR 75-174 m',
        details: 'Visual req: at least 1 centerline light. Fail-operational rollout control required.'
      }
    ]
  },
  {
    id: 'altimetry-rules',
    title: 'Altimetry & Temperature Errors',
    category: 'Meteorology / Nav',
    badge: '050 / 022',
    icon: Compass,
    items: [
      {
        label: 'Golden Temperature Rule',
        value: '4 ft error per 1,000 ft altitude per 1°C ISA deviation',
        details: 'Error (ft) = Indicated Altitude (thousands) × 4 × ISA Deviation (°C).',
        ruleOfThumb: 'High to Low (temp or pressure), LOOK OUT BELOW! Cold air = True < Indicated.'
      },
      {
        label: 'Pressure Lapse Rate',
        value: '27 ft per 1 hPa at Sea Level',
        details: 'Lapses at 27 ft/hPa at SL, expanding to ~50 ft/hPa at FL200 and ~100 ft/hPa at FL400.'
      },
      {
        label: 'QNH vs QFE vs Standard',
        value: 'QNH = Elevation | QFE = Height 0 | STD = 1013.25',
        details: 'Standard subscale used at or above Transition Altitude. QNH gives True Altitude only in standard atmosphere.'
      }
    ]
  },
  {
    id: 'golden-formulas',
    title: 'Flight Planning & Golden Navigation Rules',
    category: 'Flight Planning / Nav',
    badge: '033 / 061',
    icon: Scale,
    items: [
      {
        label: '1-in-60 Track Alteration',
        value: 'Total Turn = TEA + Closing Angle',
        details: 'TEA = (Dist Off × 60) / Dist Flown. Closing Angle = (Dist Off × 60) / Dist to Go.',
        ruleOfThumb: 'Parallel heading = TEA. Intercept track = TEA + CA.'
      },
      {
        label: 'Point of Equal Time (PET)',
        value: 'Distance to PET = (D × H) / (O + H)',
        details: 'D = Total Distance, H = Groundspeed Home, O = Groundspeed Outward (critical engine inop).',
        ruleOfThumb: 'With headwind, PET moves closer to destination (downwind).'
      },
      {
        label: 'Point of Safe Return (PSR)',
        value: 'Time to PSR = (Safe Endurance × H) / (O + H)',
        details: 'E = Safe Endurance (Fuel onboard minus reserve), H = Groundspeed Home, O = Groundspeed Out.',
        ruleOfThumb: 'Always earlier than PET on long sectors.'
      },
      {
        label: 'Mass Shift Formula',
        value: 'ΔCG = (Mass Shifted × Dist Shifted) / Total Mass',
        details: 'Or: Mass to Shift = (Total Aircraft Mass × Desired ΔCG) / Distance Shifted.'
      },
      {
        label: '% MAC Formula',
        value: '% MAC = [(CG Station - LEMAC) / MAC] × 100',
        details: 'LEMAC = Leading Edge MAC Station. MAC = Mean Aerodynamic Chord length.'
      }
    ]
  },
  {
    id: 'emergency-transponder',
    title: 'ICAO Squawk Codes & Transmission Order',
    category: 'Comms / Ops',
    badge: '090 / 070',
    icon: Radio,
    items: [
      {
        label: 'Squawk 7700',
        value: 'MAYDAY // General Emergency & Distress',
        details: 'Imminent danger to aircraft or persons requiring immediate assistance.'
      },
      {
        label: 'Squawk 7600',
        value: 'NORDO // Radio Communications Failure',
        details: 'Transmit blind: "Transmitting blind due to receiver failure". Follow ICAO lost comms routing.'
      },
      {
        label: 'Squawk 7500',
        value: 'UNLAWFUL INTERFERENCE // Hijacking',
        details: 'Never acknowledge ATC squawk confirmation if under duress; ATC will verify discreetly.'
      },
      {
        label: 'Message Priority Order',
        value: 'Distress (MAYDAY) > Urgency (PAN) > Direction Finding > Flight Safety > Met > Flight Regularity',
        details: 'EASA exam mnemonic: "Don\'t Underestimate Direct Flights, Mind Regularity".'
      }
    ]
  }
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PilotCheatsheetModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('ALL');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    triggerHaptic('light');
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 1800);
  };

  const filteredSections = CHEATSHEET_SECTIONS.filter(section => {
    if (selectedCat !== 'ALL' && section.category !== selectedCat) return false;
    if (!search.trim()) return true;

    const term = search.toLowerCase();
    const titleMatch = section.title.toLowerCase().includes(term);
    const itemMatch = section.items.some(
      i => i.label.toLowerCase().includes(term) || 
           i.value.toLowerCase().includes(term) || 
           (i.details && i.details.toLowerCase().includes(term))
    );
    return titleMatch || itemMatch;
  });

  const categories = ['ALL', 'Performance', 'Air Law / Ops', 'Meteorology / Nav', 'Flight Planning / Nav', 'Comms / Ops'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl shadow-amber-950/50 flex flex-col overflow-hidden text-slate-100 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 border-b border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
                EASA ATPL Quick Reference
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Operational Pilot Cheatsheet
              </h2>
            </div>
          </div>
          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 bg-slate-950/60 border-b border-white/5 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search V-speeds, 1-in-60, climb gradients, AWO minima, squawks, temperature errors..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-amber-500/50 focus:outline-none text-sm text-slate-200 placeholder-slate-500 font-mono"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  triggerHaptic('light');
                  setSelectedCat(cat);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCat === cat
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                    : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {filteredSections.length === 0 ? (
            <div className="text-center py-12 text-slate-500 font-mono text-sm">
              No matching cheatsheet items found for "{search}".
            </div>
          ) : (
            filteredSections.map(section => {
              const IconComp = section.icon;
              return (
                <div 
                  key={section.id} 
                  className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-white/5">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-white text-base sm:text-lg">
                        {section.title}
                      </h3>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] text-amber-300">
                      {section.badge}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {section.items.map((item, idx) => (
                      <div 
                        key={idx}
                        className="bg-slate-900/80 border border-white/5 rounded-xl p-3.5 flex flex-col justify-between group hover:border-amber-500/30 transition-all"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-mono font-semibold text-slate-400">
                              {item.label}
                            </span>
                            <button
                              onClick={() => handleCopy(item.value)}
                              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-amber-300 transition-all"
                              title="Copy formula/rule"
                            >
                              {copiedText === item.value ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                          <div className="text-sm font-mono font-bold text-amber-300 mt-1 break-words">
                            {item.value}
                          </div>
                          {item.details && (
                            <div className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                              {item.details}
                            </div>
                          )}
                        </div>

                        {item.ruleOfThumb && (
                          <div className="mt-2.5 pt-2 border-t border-white/5 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                            <ChevronRight className="w-3 h-3 shrink-0" />
                            <span>{item.ruleOfThumb}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-white/10 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>EASA Professional Pilot Operations Reference</span>
          <span>Tip: Tap any value to copy to scratchpad</span>
        </div>
      </div>
    </div>
  );
};

export default PilotCheatsheetModal;
