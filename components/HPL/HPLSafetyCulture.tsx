
import React, { useState } from 'react';
import {
  Shield, AlertTriangle, Users, BookOpen, Activity,
  ChevronDown, ChevronRight, FileText, Search, Lightbulb,
  CheckCircle2, XCircle, AlertCircle, ArrowRight, Layers,
  Globe, Building2, User, ClipboardList, Eye, Megaphone,
  Lock
} from 'lucide-react';

/* ──────────────────────────────────────────────────
   MAIN COMPONENT
   ────────────────────────────────────────────────── */
const HPLSafetyCulture: React.FC = () => {
  const [tab, setTab] = useState<'cheese' | 'culture' | 'justculture' | 'reporting' | 'sms'>('cheese');

  const tabs: { key: typeof tab; label: string }[] = [
    { key: 'cheese', label: 'Swiss Cheese' },
    { key: 'culture', label: 'Safety Culture' },
    { key: 'justculture', label: 'Just Culture' },
    { key: 'reporting', label: 'Reporting' },
    { key: 'sms', label: 'SMS' },
  ];

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Shield className="text-emerald-400" />
            Safety Culture &amp; SMS (040.01.04)
          </h2>
          <p className="text-slate-400 text-sm">Organizational safety, Swiss Cheese Model, Just Culture, Reporting Systems, and SMS.</p>
        </div>

        <div className="flex flex-wrap bg-slate-900 p-1 rounded-lg gap-1">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 py-2 rounded-md font-bold text-xs transition-all duration-200 ${
                tab === t.key
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'cheese' && <SwissCheeseModel />}
      {tab === 'culture' && <SafetyCultureView />}
      {tab === 'justculture' && <JustCultureModel />}
      {tab === 'reporting' && <SafetyReportingSystem />}
      {tab === 'sms' && <SMSView />}
    </div>
  );
};

/* ──────────────────────────────────────────────────
   1. SWISS CHEESE MODEL (preserved + enhanced)
   ────────────────────────────────────────────────── */
const SwissCheeseModel = () => {
  const [holes, setHoles] = useState([false, false, false, false]);

  const toggleHole = (idx: number) => {
    const newHoles = [...holes];
    newHoles[idx] = !newHoles[idx];
    setHoles(newHoles);
  };

  const isAccident = holes.every(h => h === true);

  const layers = [
    { name: 'Organization', desc: 'Latent Failures. Culture, Resource allocation, Cost cutting.' },
    { name: 'Supervision', desc: 'Latent Failures. Inadequate training, Poor scheduling.' },
    { name: 'Preconditions', desc: 'Latent/Active. Fatigue, Stress, Poor equipment.' },
    { name: 'Unsafe Acts', desc: 'Active Failures. Errors (Slips/Mistakes) & Violations.' }
  ];

  return (
    <div className="animate-in fade-in">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white">James Reason&apos;s Swiss Cheese Model</h3>
        <p className="text-sm text-slate-400">Accidents occur when holes (failures) in all defenses align.</p>
      </div>

      <div className="relative h-64 bg-slate-900 rounded-xl border border-slate-700 mb-8 flex items-center justify-between px-8 overflow-hidden max-w-4xl mx-auto">
        {/* Hazard */}
        <div className="z-10 flex flex-col items-center">
          <AlertTriangle className="text-red-500 w-12 h-12 relative z-10 animate-bounce" />
          <span className="text-xs font-bold text-red-500 mt-2">THREAT</span>
        </div>

        {/* Laser Line */}
        <div className={`absolute left-16 right-16 h-1 transition-colors duration-300 z-0 ${isAccident ? 'bg-red-500 shadow-[0_0_15px_red]' : 'bg-slate-700'}`}></div>

        {/* Slices */}
        {layers.map((layer, idx) => {
          const isOpen = holes[idx];
          return (
            <div
              key={idx}
              onClick={() => toggleHole(idx)}
              className={`
                relative z-10 w-8 h-48 rounded cursor-pointer transition-all duration-500 flex flex-col items-center justify-center group
                ${isOpen ? 'bg-slate-800 border-2 border-dashed border-slate-600' : 'bg-yellow-500 border-2 border-yellow-400 shadow-xl'}
              `}
            >
              {!isOpen && (
                <>
                  <div className="w-2 h-2 bg-slate-900 rounded-full absolute top-4 left-1 opacity-50"></div>
                  <div className="w-3 h-3 bg-slate-900 rounded-full absolute bottom-8 right-2 opacity-50"></div>
                  <div className="w-1 h-1 bg-slate-900 rounded-full absolute top-12 right-2 opacity-50"></div>
                </>
              )}

              {isOpen && <div className="w-4 h-4 rounded-full bg-red-500/20 animate-ping absolute"></div>}

              {/* Tooltip */}
              <div className="absolute -top-24 bg-black/90 text-white text-xs p-2 rounded w-32 text-center opacity-0 group-hover:opacity-100 transition pointer-events-none z-30">
                <strong>{layer.name}</strong>
                <p className="font-light mt-1">{layer.desc}</p>
              </div>

              <span className="absolute -bottom-8 text-[10px] text-slate-400 font-bold uppercase whitespace-nowrap">{layer.name}</span>
            </div>
          );
        })}

        {/* Accident */}
        <div className="z-10 flex flex-col items-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isAccident ? 'bg-red-600 text-white scale-125' : 'bg-slate-800 text-slate-600'}`}>
            <Activity />
          </div>
          <span className={`text-xs font-bold mt-2 ${isAccident ? 'text-red-500' : 'text-slate-600'}`}>ACCIDENT</span>
        </div>
      </div>

      <p className="text-center text-xs text-slate-500 italic">Click on the cheese slices to align/misalign the holes.</p>
    </div>
  );
};

/* ──────────────────────────────────────────────────
   2. SAFETY CULTURE VIEW — Interactive Pyramid + 5 Components + Hofstede
   ────────────────────────────────────────────────── */
const SafetyCultureView = () => {
  const [expandedLayer, setExpandedLayer] = useState<string | null>(null);
  const [expandedComponent, setExpandedComponent] = useState<number | null>(null);

  const pyramidLayers = [
    {
      id: 'national',
      label: 'National Culture',
      icon: Globe,
      color: 'emerald',
      bgGradient: 'from-emerald-600/30 to-emerald-800/10',
      borderColor: 'border-emerald-500',
      width: 'w-[55%]',
      summary: 'Shared values, beliefs, and behaviors of a nation that influence how people interact in professional settings.',
      examples: [
        'Power Distance (Hofstede PDI): High PDI cultures → subordinates hesitate to question the Captain → steep cockpit gradient.',
        'Individualism vs Collectivism (IDV): High IDV (USA/Europe) = focus on self. Low IDV = focus on group/face-saving.',
        'Uncertainty Avoidance: High UA cultures follow strict SOPs rigidly; Low UA may improvise more.',
        'Masculinity vs Femininity: Affects assertiveness and communication style in CRM.',
      ],
      safetyImpact: 'National culture shapes the cockpit gradient and communication norms. CRM training must account for cultural differences to ensure effective crew coordination regardless of nationality.',
    },
    {
      id: 'organizational',
      label: 'Organizational Culture',
      icon: Building2,
      color: 'sky',
      bgGradient: 'from-sky-600/30 to-sky-800/10',
      borderColor: 'border-sky-500',
      width: 'w-[75%]',
      summary: 'The airline or company\'s attitude toward safety — from top management to line operations.',
      examples: [
        'Open Culture: Reports encouraged, flight data analyzed, feedback given to crews.',
        'Closed Culture: Reports hidden, blame culture, information suppressed.',
        'Resource allocation: Does management invest in training, maintenance, and rest facilities?',
        'Management commitment: Do leaders walk the talk on safety or just produce policy documents?',
      ],
      safetyImpact: 'Organizations set the tone. A CEO who prioritizes schedule over safety creates pressure that cascades to every operational decision. Open culture = more reports = more learning = fewer accidents.',
    },
    {
      id: 'professional',
      label: 'Professional / Individual Culture',
      icon: User,
      color: 'violet',
      bgGradient: 'from-violet-600/30 to-violet-800/10',
      borderColor: 'border-violet-500',
      width: 'w-[95%]',
      summary: 'The individual pilot\'s attitudes, norms, and behaviors — shaped by training, experience, and personal values.',
      examples: [
        'Professional standards: Adherence to SOPs, checklists, and callouts.',
        'Complacency: "I\'ve done this 1000 times" attitude leads to skipping checks.',
        'Peer pressure: "Real pilots don\'t go around" — macho attitude.',
        'Personal minimums: Setting personal limits above regulatory minimums for weather, rest, etc.',
      ],
      safetyImpact: 'Individual attitudes are the last line of defense. A strong professional culture means pilots self-regulate, admit mistakes, and maintain standards even when no one is watching.',
    },
  ];

  const cultureComponents = [
    {
      title: '1. Informed Culture',
      color: 'emerald',
      borderColor: 'border-emerald-500',
      short: 'People know current knowledge about human, technical, and organizational factors.',
      details: 'An informed culture collects and analyzes relevant data. It relies on incident reporting, flight data monitoring (FDM/FOQA), LOSA programs, and regular safety briefings. Everyone from the CEO to the ramp agent understands the current safety landscape.',
    },
    {
      title: '2. Reporting Culture',
      color: 'sky',
      borderColor: 'border-sky-500',
      short: 'People are prepared to report their errors and experiences.',
      details: 'Requires trust and confidentiality. Reports must be easy to file, de-identified where possible, and reporters must see that their reports lead to changes. Both mandatory (accidents/serious incidents) and voluntary (near-misses, hazards) reporting channels exist.',
    },
    {
      title: '3. Learning Culture',
      color: 'blue',
      borderColor: 'border-blue-500',
      short: 'Organization has the will and competence to draw conclusions from safety info.',
      details: 'Data collected must actually be analyzed and acted upon. Safety recommendations are implemented. Trends are identified. Lessons are shared across departments. The organization adapts its procedures based on what it learns.',
    },
    {
      title: '4. Just Culture',
      color: 'purple',
      borderColor: 'border-purple-500',
      short: 'Atmosphere of trust. No punishment for honest errors. Gross negligence IS punished.',
      details: 'The critical distinction: honest mistakes and system-induced errors are treated with support and system fixes. But deliberate violations, substance abuse, and gross negligence face disciplinary action. This is NOT a "no blame" culture — it\'s a "fair accountability" culture.',
    },
    {
      title: '5. Flexible Culture',
      color: 'indigo',
      borderColor: 'border-indigo-500',
      short: 'Able to reconfigure facing high tempo operations or danger.',
      details: 'In normal operations, authority follows hierarchy. In emergencies, expertise drives decisions regardless of rank. The organization can shift from conventional (bureaucratic) to adaptive (expert-driven) mode when needed.',
    },
  ];

  const colorMap: Record<string, string> = {
    emerald: 'text-emerald-400',
    sky: 'text-sky-400',
    blue: 'text-blue-400',
    purple: 'text-purple-400',
    indigo: 'text-indigo-400',
    violet: 'text-violet-400',
  };

  return (
    <div className="animate-in fade-in space-y-8">
      {/* ── Pyramid Diagram ── */}
      <div>
        <h3 className="font-bold text-white mb-2 flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-400" />
          Safety Culture Pyramid — Click Each Layer
        </h3>
        <p className="text-xs text-slate-400 mb-6">Culture flows downward: national norms shape organizations, which shape individuals.</p>

        <div className="flex flex-col items-center gap-2">
          {pyramidLayers.map((layer) => {
            const Icon = layer.icon;
            const isExpanded = expandedLayer === layer.id;
            return (
              <div key={layer.id} className={`${layer.width} transition-all duration-300`}>
                <button
                  onClick={() => setExpandedLayer(isExpanded ? null : layer.id)}
                  className={`w-full bg-gradient-to-r ${layer.bgGradient} border ${layer.borderColor} rounded-lg p-4 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group cursor-pointer`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${colorMap[layer.color]}`} />
                      <div>
                        <span className={`font-bold ${colorMap[layer.color]} text-sm`}>{layer.label}</span>
                        <p className="text-xs text-slate-400 mt-0.5">{layer.summary}</p>
                      </div>
                    </div>
                    {isExpanded
                      ? <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      : <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    }
                  </div>
                </button>

                {isExpanded && (
                  <div className={`mt-2 bg-slate-900/80 border ${layer.borderColor}/30 rounded-lg p-5 space-y-3 animate-in fade-in slide-in-from-top-2`}>
                    <h4 className={`font-bold ${colorMap[layer.color]} text-sm`}>Examples &amp; Factors:</h4>
                    <ul className="space-y-2">
                      {layer.examples.map((ex, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                          <span className={`mt-0.5 w-1.5 h-1.5 rounded-full bg-${layer.color}-400 shrink-0`} />
                          {ex}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 bg-slate-800/60 rounded-lg p-3 border border-slate-700">
                      <h5 className="text-xs font-bold text-white mb-1">⚠️ Safety Impact</h5>
                      <p className="text-xs text-slate-400">{layer.safetyImpact}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 5 Components of Safety Culture ── */}
      <div>
        <h3 className="font-bold text-white mb-4">The 5 Components of Safety Culture</h3>
        <div className="space-y-2">
          {cultureComponents.map((comp, idx) => {
            const isOpen = expandedComponent === idx;
            return (
              <div key={idx}>
                <button
                  onClick={() => setExpandedComponent(isOpen ? null : idx)}
                  className={`w-full bg-slate-900 p-3 rounded-lg border-l-4 ${comp.borderColor} text-left transition-all duration-200 hover:bg-slate-900/80 cursor-pointer group`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`font-bold ${colorMap[comp.color]} text-sm`}>{comp.title}</h4>
                      <p className="text-xs text-slate-300 mt-0.5">{comp.short}</p>
                    </div>
                    {isOpen
                      ? <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                      : <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                    }
                  </div>
                </button>
                {isOpen && (
                  <div className="bg-slate-900/50 border-l-4 border-slate-700 ml-4 p-4 rounded-r-lg mt-1 animate-in fade-in slide-in-from-top-1">
                    <p className="text-xs text-slate-300 leading-relaxed">{comp.details}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Hofstede National Culture ── */}
      <div>
        <h3 className="font-bold text-white mb-4">National Culture (Hofstede&apos;s Dimensions)</h3>
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
          <div className="grid grid-cols-2 gap-4">
            <div className="border-r border-slate-700 pr-4">
              <h4 className="font-bold text-white text-sm">Power Distance (PDI)</h4>
              <p className="text-xs text-slate-400 mt-1">
                High PDI (e.g., some Asian/Latin countries) = Subordinates hesitate to question Captain.
                <br /><span className="text-red-400">Risk:</span> Steep cockpit gradient. Communication barrier.
              </p>
            </div>
            <div className="pl-4">
              <h4 className="font-bold text-white text-sm">Individualism (IDV)</h4>
              <p className="text-xs text-slate-400 mt-1">
                High IDV (e.g., USA/Europe) = Focus on self.
                <br />Low IDV = Focus on Group/Face.
                <br /><span className="text-emerald-400">Goal:</span> Balanced cockpit culture regardless of nationality.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Open vs Closed Culture ── */}
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
        <h4 className="font-bold text-white mb-2">Open vs Closed Culture</h4>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-slate-800 p-3 rounded-lg border border-emerald-900/30">
            <span className="text-emerald-400 font-bold block text-sm">OPEN</span>
            <span className="text-xs text-slate-400 leading-relaxed">Reports encouraged.<br />Flight data analyzed.<br />Feedback given.</span>
          </div>
          <div className="bg-slate-800 p-3 rounded-lg border border-red-900/30">
            <span className="text-red-400 font-bold block text-sm">CLOSED</span>
            <span className="text-xs text-slate-400 leading-relaxed">Reports hidden.<br />Blame culture.<br />Information suppressed.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────────────
   3. JUST CULTURE MODEL — Three-Zone Interactive
   ────────────────────────────────────────────────── */
const JustCultureModel = () => {
  const [activeZone, setActiveZone] = useState<string | null>(null);

  const zones = [
    {
      id: 'green',
      label: 'Honest Human Error',
      color: 'emerald',
      bgClass: 'bg-emerald-900/30 border-emerald-500 hover:bg-emerald-900/50',
      activeBg: 'bg-emerald-900/60 border-emerald-400',
      icon: CheckCircle2,
      response: 'System Issue → Support & System Fix',
      description: 'Unintentional errors that arise from human cognitive limitations. The person did not intend to cause harm and was following established procedures.',
      scenarios: [
        { title: 'Altitude Deviation', detail: 'Pilot inadvertently levels off at FL340 instead of FL350 during a high workload phase. The error was a slip caused by distraction from an ATC re-route. Response: Review procedure, improve callout protocol.' },
        { title: 'Wrong Frequency Dialed', detail: 'FO selects 124.35 instead of 124.53 during a busy approach. Caught by PM within 30 seconds. Response: Console the crew, share as a learning example.' },
        { title: 'Missed Checklist Item', detail: 'During interruption from a cabin call, crew skips one item on the After Takeoff checklist. Response: System review — consider checklist design improvements.' },
      ],
      action: '✅ Console the individual. Fix the system. Share learnings. No disciplinary action.',
    },
    {
      id: 'yellow',
      label: 'At-Risk Behavior',
      color: 'yellow',
      bgClass: 'bg-yellow-900/30 border-yellow-500 hover:bg-yellow-900/50',
      activeBg: 'bg-yellow-900/60 border-yellow-400',
      icon: AlertCircle,
      response: 'Coaching & Behavioral Change Needed',
      description: 'The person chose to cut corners or take a shortcut, often without recognizing the risk. This is a behavioral choice, not a deliberate intent to harm. The person believed the risk was justified or insignificant.',
      scenarios: [
        { title: 'Rushed Approach Briefing', detail: 'Captain routinely gives abbreviated approach briefings ("same as last time") to save time. No incident has occurred yet, but critical information is being omitted. Response: Coach on why complete briefings matter.' },
        { title: 'Skipping Walkaround Items', detail: 'FO consistently skips checking certain items during the external inspection because "they\'re always fine." Response: Coaching session, ride-along supervision.' },
        { title: 'Non-standard Callouts', detail: 'Crew develops their own shorthand callouts that differ from SOP. Response: Retraining on standard phraseology with explanation of why standardization matters.' },
      ],
      action: '⚠️ Coach the individual. Remove incentives for the shortcut. Reinforce correct behavior through training.',
    },
    {
      id: 'red',
      label: 'Reckless / Negligent Behavior',
      color: 'red',
      bgClass: 'bg-red-900/30 border-red-500 hover:bg-red-900/50',
      activeBg: 'bg-red-900/60 border-red-400',
      icon: XCircle,
      response: 'Disciplinary Action Required',
      description: 'The person consciously chose to take a substantial and unjustifiable risk. They knew (or should have known) the risk was unacceptable. Includes substance abuse, deliberate violations, and reckless disregard for safety.',
      scenarios: [
        { title: 'Flying Under Influence', detail: 'Captain reports for duty with BAC above legal limits. Response: Immediate removal from duty, formal disciplinary process, license review.' },
        { title: 'Deliberate SOP Violation', detail: 'Pilot intentionally flies an unstabilized approach below 500ft AGL despite company rules requiring a go-around. Response: Formal disciplinary action, retraining or termination.' },
        { title: 'Falsifying Records', detail: 'Pilot records rest hours that were not actually taken to avoid scheduling conflicts. Response: Regulatory notification, serious disciplinary action.' },
      ],
      action: '🔴 Disciplinary action. Potential regulatory involvement. Removal from operations if necessary.',
    },
  ];

  const colorTextMap: Record<string, string> = {
    emerald: 'text-emerald-400',
    yellow: 'text-yellow-400',
    red: 'text-red-400',
  };

  return (
    <div className="animate-in fade-in space-y-6">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-white">Just Culture Model</h3>
        <p className="text-sm text-slate-400">Click each zone to explore aviation scenarios and appropriate responses.</p>
      </div>

      {/* Distinction: Just vs Non-Punitive */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-700 mb-4">
        <h4 className="font-bold text-white mb-3">Just Culture ≠ Non-Punitive Culture</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-red-900/20 rounded flex items-center justify-center shrink-0">
              <span className="text-lg">❌</span>
            </div>
            <div>
              <h5 className="font-bold text-red-400 text-sm">Non-Punitive (Total Immunity)</h5>
              <p className="text-xs text-slate-400">&quot;No matter what you do, you won&apos;t be punished.&quot; BAD — encourages recklessness/negligence.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-emerald-900/20 rounded flex items-center justify-center shrink-0">
              <span className="text-lg">✅</span>
            </div>
            <div>
              <h5 className="font-bold text-emerald-400 text-sm">Just Culture</h5>
              <p className="text-xs text-slate-400">Honest mistakes = No punishment. Gross Negligence / Wilful Violation = Punishment.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Three Zones */}
      <div className="grid md:grid-cols-3 gap-4">
        {zones.map((zone) => {
          const Icon = zone.icon;
          const isActive = activeZone === zone.id;
          return (
            <button
              key={zone.id}
              onClick={() => setActiveZone(isActive ? null : zone.id)}
              className={`p-5 rounded-xl border-2 text-left transition-all duration-300 cursor-pointer ${
                isActive ? zone.activeBg + ' scale-[1.02] shadow-xl' : zone.bgClass
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-6 h-6 ${colorTextMap[zone.color]}`} />
                <span className={`font-bold ${colorTextMap[zone.color]} text-sm`}>{zone.label}</span>
              </div>
              <p className="text-xs text-slate-400">{zone.response}</p>
              <div className="mt-2 flex items-center gap-1 text-[10px] text-slate-500">
                {isActive ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                {isActive ? 'Click to collapse' : 'Click for scenarios'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Expanded Zone Detail */}
      {activeZone && (() => {
        const zone = zones.find(z => z.id === activeZone)!;
        return (
          <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 animate-in fade-in slide-in-from-top-2 space-y-4">
            <p className="text-sm text-slate-300">{zone.description}</p>

            <h4 className="font-bold text-white text-sm mt-4">Aviation Scenario Examples:</h4>
            <div className="space-y-3">
              {zone.scenarios.map((sc, i) => (
                <div key={i} className="bg-slate-800/60 rounded-lg p-4 border border-slate-700">
                  <h5 className={`font-bold ${colorTextMap[zone.color]} text-sm mb-1`}>{sc.title}</h5>
                  <p className="text-xs text-slate-400 leading-relaxed">{sc.detail}</p>
                </div>
              ))}
            </div>

            <div className="bg-slate-800 rounded-lg p-3 border border-slate-700 mt-2">
              <p className="text-sm font-medium text-white">{zone.action}</p>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

/* ──────────────────────────────────────────────────
   4. SAFETY REPORTING SYSTEM — Interactive Flowchart
   ────────────────────────────────────────────────── */
const SafetyReportingSystem = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const steps = [
    {
      icon: AlertTriangle,
      label: 'Incident Occurs',
      color: 'red',
      detail: 'Any event that has or could have resulted in an accident, injury, or significant operational disruption. Includes: runway incursions, TCAS RAs, near-misses, bird strikes, technical failures, human errors, and near-miss events.',
      barriers: [],
      solutions: [],
    },
    {
      icon: FileText,
      label: 'Report Filed',
      color: 'yellow',
      detail: 'Reports can be Mandatory (required by regulation for accidents, serious incidents, specific occurrences) or Voluntary (encouraged for near-misses, hazards, observations). Both types are critical for building a complete safety picture.',
      barriers: [
        'Fear of punishment or career consequences',
        'Complex or time-consuming reporting forms',
        '"Nothing happened, so why report?"',
        'Lack of trust in the system',
        'Uncertainty about what to report',
      ],
      solutions: [
        'Just Culture policy — protect honest reporters',
        'Simple, quick reporting tools (EFB apps, QR codes)',
        'Anonymous/confidential reporting options',
        'Visible feedback — show reporters their report led to change',
        'Clear guidance on what constitutes a reportable event',
      ],
    },
    {
      icon: Search,
      label: 'Investigation',
      color: 'sky',
      detail: 'Safety investigation focuses on WHY it happened, not WHO is to blame. Uses tools like: Reason Model (Swiss Cheese), HFACS (Human Factors Analysis and Classification System), SHELL Model, Bowtie Analysis. Goal: identify systemic causes and contributing factors.',
      barriers: [],
      solutions: [],
    },
    {
      icon: Lightbulb,
      label: 'Recommendations',
      color: 'emerald',
      detail: 'Based on investigation findings, safety recommendations are developed. These target systemic issues: procedure changes, training updates, equipment modifications, organizational changes. Recommendations must be specific, actionable, and trackable.',
      barriers: [],
      solutions: [],
    },
    {
      icon: CheckCircle2,
      label: 'Changes Implemented',
      color: 'emerald',
      detail: 'Recommendations are turned into concrete actions: SOP revisions, new training modules, equipment upgrades, policy changes. Implementation is tracked, effectiveness is measured, and the cycle feeds back into safety assurance.',
      barriers: [],
      solutions: [],
    },
  ];

  const stepColorText: Record<string, string> = {
    red: 'text-red-400',
    yellow: 'text-yellow-400',
    sky: 'text-sky-400',
    emerald: 'text-emerald-400',
  };
  const stepColorBg: Record<string, string> = {
    red: 'bg-red-900/30 border-red-500/40',
    yellow: 'bg-yellow-900/30 border-yellow-500/40',
    sky: 'bg-sky-900/30 border-sky-500/40',
    emerald: 'bg-emerald-900/30 border-emerald-500/40',
  };
  const stepColorBgActive: Record<string, string> = {
    red: 'bg-red-900/50 border-red-400 shadow-lg shadow-red-900/20',
    yellow: 'bg-yellow-900/50 border-yellow-400 shadow-lg shadow-yellow-900/20',
    sky: 'bg-sky-900/50 border-sky-400 shadow-lg shadow-sky-900/20',
    emerald: 'bg-emerald-900/50 border-emerald-400 shadow-lg shadow-emerald-900/20',
  };

  return (
    <div className="animate-in fade-in space-y-6">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-white">Safety Reporting System</h3>
        <p className="text-sm text-slate-400">Click each step to learn about the process, barriers, and solutions.</p>
      </div>

      {/* Flowchart */}
      <div className="flex flex-col md:flex-row items-stretch justify-center gap-2 md:gap-0">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = activeStep === idx;
          return (
            <React.Fragment key={idx}>
              <button
                onClick={() => setActiveStep(isActive ? null : idx)}
                className={`flex-1 min-w-0 p-4 rounded-xl border-2 text-center transition-all duration-300 cursor-pointer ${
                  isActive ? stepColorBgActive[step.color] : stepColorBg[step.color] + ' hover:scale-[1.03]'
                }`}
              >
                <Icon className={`w-8 h-8 mx-auto mb-2 ${stepColorText[step.color]}`} />
                <span className={`font-bold text-xs ${stepColorText[step.color]} block`}>{step.label}</span>
                <span className="text-[10px] text-slate-500 block mt-1">{isActive ? '▼ Details' : 'Click for details'}</span>
              </button>
              {idx < steps.length - 1 && (
                <div className="hidden md:flex items-center justify-center px-1">
                  <ArrowRight className="w-5 h-5 text-slate-600" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Expanded Step Detail */}
      {activeStep !== null && (() => {
        const step = steps[activeStep];
        return (
          <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 animate-in fade-in slide-in-from-top-2 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <step.icon className={`w-6 h-6 ${stepColorText[step.color]}`} />
              <h4 className={`font-bold ${stepColorText[step.color]}`}>{step.label}</h4>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{step.detail}</p>

            {step.barriers.length > 0 && (
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-red-900/10 border border-red-900/30 rounded-lg p-4">
                  <h5 className="font-bold text-red-400 text-sm mb-2 flex items-center gap-1">
                    <XCircle className="w-4 h-4" /> Barriers to Reporting
                  </h5>
                  <ul className="space-y-1.5">
                    {step.barriers.map((b, i) => (
                      <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">•</span> {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-emerald-900/10 border border-emerald-900/30 rounded-lg p-4">
                  <h5 className="font-bold text-emerald-400 text-sm mb-2 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Solutions
                  </h5>
                  <ul className="space-y-1.5">
                    {step.solutions.map((s, i) => (
                      <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                        <span className="text-emerald-500 mt-0.5">•</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
};

/* ──────────────────────────────────────────────────
   5. SMS VIEW — 4 Interactive Pillars
   ────────────────────────────────────────────────── */
const SMSView = () => {
  const [expandedPillar, setExpandedPillar] = useState<number | null>(null);

  const pillars = [
    {
      icon: ClipboardList,
      title: 'Safety Policy & Objectives',
      color: 'emerald',
      short: 'Management commitment, safety objectives, and accountabilities.',
      details: [
        'Defines the organization\'s safety policy signed by the Accountable Executive.',
        'Establishes safety objectives and performance targets (SPIs — Safety Performance Indicators).',
        'Assigns safety accountabilities and responsibilities at all organizational levels.',
        'Requires appointment of a Safety Manager and a Safety Review Board.',
        'Establishes an Emergency Response Plan (ERP).',
        'Documents safety management through the Safety Management System Manual.',
      ],
      examQuestion: 'The Accountable Executive is the person who has ultimate responsibility for the SMS and the authority to allocate resources.',
    },
    {
      icon: AlertTriangle,
      title: 'Safety Risk Management',
      color: 'yellow',
      short: 'Hazard identification, risk assessment, and mitigation.',
      details: [
        'Systematic hazard identification: reactive (incident reports), proactive (FDM/LOSA/audits), predictive (trend analysis).',
        'Risk assessment using probability × severity matrix.',
        'Risk levels: Acceptable, Tolerable (ALARP — As Low As Reasonably Practicable), Intolerable.',
        'Risk mitigation strategies: Elimination → Reduction → Segregation → Procedures → Training → PPE.',
        'Continuous monitoring of residual risk after mitigation.',
        'Management of Change (MoC) process for new equipment, procedures, or routes.',
      ],
      examQuestion: 'ALARP means the risk has been reduced to As Low As Reasonably Practicable — the cost of further reduction would be grossly disproportionate to the benefit.',
    },
    {
      icon: Eye,
      title: 'Safety Assurance',
      color: 'sky',
      short: 'Monitoring, auditing, and continuous improvement.',
      details: [
        'Safety Performance Monitoring: tracking SPIs and SPTs (Safety Performance Targets).',
        'Internal safety audits and surveys to verify SMS effectiveness.',
        'Flight Data Monitoring (FDM/FOQA) programs for proactive analysis.',
        'LOSA (Line Operations Safety Audit) for observing normal operations.',
        'Management of Change assessment for organizational changes.',
        'Continuous improvement cycle: Monitor → Analyze → Act → Review.',
      ],
      examQuestion: 'Safety Assurance provides the confidence that SMS outputs meet or exceed safety requirements through continuous monitoring.',
    },
    {
      icon: Megaphone,
      title: 'Safety Promotion',
      color: 'violet',
      short: 'Training, communication, and building safety awareness.',
      details: [
        'Safety training programs for all personnel appropriate to their roles.',
        'Safety communication: newsletters, briefings, bulletins, safety days.',
        'Sharing lessons learned from incidents and safety reports across the organization.',
        'Building a positive safety culture through engagement and recognition.',
        'Ensuring personnel understand SMS, reporting procedures, and their roles in safety.',
        'Dissemination of safety information from regulators, manufacturers, and industry.',
      ],
      examQuestion: 'Safety Promotion ensures that all personnel are aware of the SMS, understand their safety roles, and are trained accordingly.',
    },
  ];

  const pillarColorText: Record<string, string> = {
    emerald: 'text-emerald-400',
    yellow: 'text-yellow-400',
    sky: 'text-sky-400',
    violet: 'text-violet-400',
  };
  const pillarColorBorder: Record<string, string> = {
    emerald: 'border-emerald-500',
    yellow: 'border-yellow-500',
    sky: 'border-sky-500',
    violet: 'border-violet-500',
  };

  return (
    <div className="animate-in fade-in space-y-6">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-white">Safety Management System (SMS)</h3>
        <p className="text-sm text-slate-400">ICAO Annex 19 — 4 Pillars. Click each pillar to expand.</p>
        <p className="text-sm text-slate-500 italic mt-1">&quot;Safety First&quot;</p>
      </div>

      {/* Original content preserved: Hazard ID, Risk Mgmt, Safety Assurance */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-700">
          <h4 className="text-emerald-400 font-bold mb-2 text-sm">Hazard Identification</h4>
          <p className="text-xs text-slate-300">
            Proactive method of identifying risks before they become accidents. (FDA, LOSA, Reporting).
          </p>
        </div>
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-700">
          <h4 className="text-emerald-400 font-bold mb-2 text-sm">Risk Management</h4>
          <p className="text-xs text-slate-300">
            Assessing the probability and severity of a hazard. ALARP (As Low As Reasonably Practicable).
          </p>
        </div>
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-700">
          <h4 className="text-emerald-400 font-bold mb-2 text-sm">Safety Assurance</h4>
          <p className="text-xs text-slate-300">
            Monitoring the effectiveness of safety strategies. Audits and feedback.
          </p>
        </div>
      </div>

      {/* 4 Interactive Pillars */}
      <h4 className="font-bold text-white text-sm mb-3">ICAO SMS Framework — 4 Pillars (Interactive)</h4>
      <div className="grid md:grid-cols-2 gap-4">
        {pillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          const isExpanded = expandedPillar === idx;
          return (
            <div key={idx} className="flex flex-col">
              <button
                onClick={() => setExpandedPillar(isExpanded ? null : idx)}
                className={`bg-slate-900 rounded-xl border-2 ${pillarColorBorder[pillar.color]} p-5 text-left transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-lg flex-shrink-0`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 border ${pillarColorBorder[pillar.color]}`}>
                    <Icon className={`w-5 h-5 ${pillarColorText[pillar.color]}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h5 className={`font-bold ${pillarColorText[pillar.color]} text-sm`}>{pillar.title}</h5>
                      {isExpanded
                        ? <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                        : <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                      }
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{pillar.short}</p>
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="bg-slate-900/60 border border-slate-700 rounded-b-xl p-5 mt-1 space-y-3 animate-in fade-in slide-in-from-top-1">
                  <ul className="space-y-2">
                    {pillar.details.map((d, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                          pillar.color === 'emerald' ? 'bg-emerald-400' :
                          pillar.color === 'yellow' ? 'bg-yellow-400' :
                          pillar.color === 'sky' ? 'bg-sky-400' : 'bg-violet-400'
                        }`} />
                        {d}
                      </li>
                    ))}
                  </ul>
                  <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700 mt-2">
                    <h6 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">📝 Exam Tip</h6>
                    <p className="text-xs text-slate-400 italic">{pillar.examQuestion}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HPLSafetyCulture;
