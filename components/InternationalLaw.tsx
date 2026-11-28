import React, { useState } from 'react';
import { FREEDOMS_OF_THE_AIR_DATA } from '../data/courseData';
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  FileText,
  Gavel,
  Globe,
  Info,
  Landmark,
  Layers,
  Plane,
  Scale,
  Shield,
  Stamp,
  User,
} from 'lucide-react';
import {
  ACARSDebriefSlip,
  ChapterKneeboardDrawer,
  ConfusionBusterGrid,
  ConfusionPair,
  InOneMinuteStrip,
  LessonHeaderDeck,
  OneMinuteItem,
} from './lesson';
import {
  CaseFileStampSimulator,
  CheckrideCall,
  CheckrideDeck,
  HoldShortGate,
  StampCaseFile,
  TreatyStampOption,
} from './engines';

const ONE_MINUTE_ITEMS: OneMinuteItem[] = [
  {
    num: '01',
    headline: 'Complete Sovereignty (Art 1)',
    body: 'Every State holds **complete & exclusive** airspace sovereignty over land + **12 NM** territorial waters.',
    accent: 'var(--subj-law)',
  },
  {
    num: '02',
    headline: '19 Annexes & Art 38',
    body: 'ICAO Standards (**"Shall"**) + Recommended Practices (**"Should"**). States notify differences via **Art 38**.',
    accent: '#38bdf8',
  },
  {
    num: '03',
    headline: 'Freedoms & Art 7 Cabotage',
    body: '1–2 are **technical transit**; 3–5 are **commercial**; 8–9 are **Cabotage** (domestic foreign-carrier legs).',
    accent: '#f59e0b',
  },
  {
    num: '04',
    headline: 'Criminal & Liability Treaties',
    body: '**Chicago** (rules), **Montreal 1999** (pax/cargo liability), **Tokyo** (PIC restraint), **Hague** (hijack), **Montreal 1971** (sabotage).',
    accent: '#34d399',
  },
];

const STAMP_OPTIONS: TreatyStampOption[] = [
  { id: 'chicago', label: 'CHICAGO 1944', sublabel: 'Sovereignty & SARPs' },
  { id: 'montreal99', label: 'MONTREAL 1999', sublabel: 'Pax & Cargo SDR' },
  { id: 'tokyo', label: 'TOKYO 1963', sublabel: 'PIC Restraint & Immunity' },
  { id: 'hague', label: 'HAGUE 1970', sublabel: 'Hijacking / Seizure' },
  { id: 'montreal71', label: 'MONTREAL 1971', sublabel: 'Sabotage & Facilities' },
  { id: 'rome', label: 'ROME 1952', sublabel: 'Ground 3rd-Party' },
];

const CASE_FILES: StampCaseFile[] = [
  {
    id: 'c1',
    docketCode: 'AL-01 // UNRULY PAX',
    scenario:
      'Over international waters, an intoxicated passenger tries to force the cockpit door open. The **Commander orders cabin crew and two passengers to restrain him** with plastic cuffs.',
    correctStampId: 'tokyo',
    why: '**Tokyo Convention (1963)** grants the PIC authority (Art 6) to impose reasonable restraint and grants civil/criminal immunity to crew and assisting passengers.',
  },
  {
    id: 'c2',
    docketCode: 'AL-02 // CHECKED BAG & INJURY',
    scenario:
      'During severe clear-air turbulence over France, a passenger breaks her wrist and her checked suitcase vanishes. She files a strict-liability claim calibrated in **Special Drawing Rights (128,821 / 1,288 SDR)**.',
    correctStampId: 'montreal99',
    why: '**Montreal Convention (1999)** sets uniform strict-liability tiers for bodily injury (up to 128,821 SDR), baggage (~1,288 SDR), and cargo (**22 SDR/kg**).',
  },
  {
    id: 'c3',
    docketCode: 'AL-03 // ARMED COCKPIT TAKEOVER',
    scenario:
      'A passenger produces a weapon in flight and forces the crew to divert to another State (**unlawful seizure of an aircraft in flight**). Which convention obliges States to impose severe penalties or extradite?',
    correctStampId: 'hague',
    why: '**Hague Convention (1970)** specifically targets **unlawful seizure (hijacking)** and enforces aut dedere aut judicare (prosecute or extradite).',
  },
  {
    id: 'c4',
    docketCode: 'AL-04 // OVERFLIGHT & DIFFERENCE FILING',
    scenario:
      'A Contracting State adopts national separation minima below ICAO Annex 11 SARPs and must **notify ICAO immediately of differences** under **Article 38**.',
    correctStampId: 'chicago',
    why: '**Chicago Convention (1944)** establishes sovereign airspace, the 19 Annexes (SARPs), and **Article 38** mandatory notification of differences.',
  },
  {
    id: 'c5',
    docketCode: 'AL-05 //ILS ANTENNA SABOTAGE',
    scenario:
      'An individual destroys an airport **ILS localizer shelter** and phones in a **false bomb threat** causing emergency evacuations.',
    correctStampId: 'montreal71',
    why: '**Montreal Convention (1971)** suppresses **sabotage, destruction of air navigation facilities, and false bomb/safety information**.',
  },
  {
    id: 'c6',
    docketCode: 'AL-06 // FARM DAMAGE ON SURFACE',
    scenario:
      'A foreign-registered freighter sheds a cowling panel mid-cruise, damaging a greenhouse and barn on the surface below. Which treaty governs **damage caused by foreign aircraft to third parties on the surface**?',
    correctStampId: 'rome',
    why: '**Rome Convention (1952)** covers strict liability for **third-party damage on the surface** caused by foreign aircraft in flight.',
  },
  {
    id: 'c7',
    docketCode: 'AL-07 // CABOTAGE REFUSAL',
    scenario:
      'A non-EU carrier requests permission to carry paid domestic passengers **between Munich and Frankfurt** on a standalone leg. Germany refuses under **Article 7**.',
    correctStampId: 'chicago',
    why: '**Chicago Convention Article 7 (Cabotage)** lets any State refuse foreign carriers from uplifting domestic commercial traffic inside its territory.',
  },
  {
    id: 'c8',
    docketCode: 'AL-08 // CARGO LOSS PER KG',
    scenario:
      'An airfreight shipment weighing 500 kg of electronics is destroyed in transit with no declared value excess; compensation defaults to **22 SDR per kilogram**.',
    correctStampId: 'montreal99',
    why: '**Montreal Convention (1999)** caps un-declared air cargo liability at **22 SDR/kg**.',
  },
];

const CONFUSION_PAIRS: ConfusionPair[] = [
  {
    leftTitle: 'Standard (SARP)',
    leftBody: 'Uses **"SHALL"**. Uniform compliance recognized as **necessary** for safety/regularity. Non-compliance requires **Art 38 notification**.',
    leftColor: '#34d399',
    rightTitle: 'Recommended Practice',
    rightBody: 'Uses **"SHOULD"**. Uniform application recognized as **desirable**; States *endeavour* to conform without Art 38 legal duty.',
    rightColor: '#f59e0b',
    tellApart: '**SHALL + Notify (Art 38)** = Standard. **SHOULD + Desirable** = Recommended Practice.',
  },
  {
    leftTitle: 'Hague Convention (1970)',
    leftBody: 'Suppresses **Unlawful Seizure** of aircraft in flight (**Hijacking**).',
    leftColor: '#fb7185',
    rightTitle: 'Montreal Convention (1971)',
    rightBody: 'Suppresses **Unlawful Acts** against civil aviation safety (**Sabotage, bombs, nav-aid destruction, false threats**).',
    rightColor: '#38bdf8',
    tellApart: '**Hague = Hijack** (taking the cockpit). **Montreal ’71 = Malice/Sabotage** (bombs, radar destruction, hoax calls).',
  },
  {
    leftTitle: '8th Freedom (Consecutive Cabotage)',
    leftBody: 'Foreign airline operates domestic sector (e.g. **London → Manchester**) **as a continuation** of a flight starting/ending in its Home State.',
    leftColor: '#a855f7',
    rightTitle: '9th Freedom (Standalone Cabotage)',
    rightBody: 'Foreign airline operates domestic sector (**London ↔ Manchester**) **entirely independent** of its Home State.',
    rightColor: '#ec4899',
    tellApart: '**8 = tethered back Home**; **9 = pure standalone** foreign domestic operation.',
  },
  {
    leftTitle: 'Hard Law (EASA IR)',
    leftBody: '**Basic Regulation (2018/1139)** and **Implementing Rules** (Part-FCL, Part-OPS, SERA) — legally binding in EU law.',
    leftColor: '#818cf8',
    rightTitle: 'Soft Law (AMC / GM / CS)',
    rightBody: '**Certification Specs (CS-25)**, **Acceptable Means of Compliance**, and **Guidance Material** — presumed compliance, not strictly statute.',
    rightColor: '#14b8a6',
    tellApart: '**Binding** = Basic Reg + IRs. **Non-binding executive EASA specs** = CS, AMC, GM.',
  },
];

const CHECKRIDE_CALLS: CheckrideCall[] = [
  {
    id: 'al-cr-1',
    question: 'Under **Chicago Convention Article 38**, when must a Contracting State notify ICAO of differences?',
    options: [
      'Immediately when it cannot comply with an ICAO Standard',
      'Only once every 5 years for Recommended Practices',
      'Never, if EASA has issued an AMC',
      'Only after an accident investigation under Annex 13',
    ],
    answerIndex: 0,
    why: 'Article 38 makes **immediate notification of differences** mandatory whenever national rules depart from an ICAO **Standard**.',
  },
  {
    id: 'al-cr-2',
    question: 'A carrier registered in **State A** flies **State A → State B → State C**, picking up passengers in B to fly to C. Which Freedom of the Air is this?',
    options: ['5th Freedom (Beyond Rights)', '2nd Freedom (Technical Stop)', '8th Freedom (Cabotage)', '3rd Freedom'],
    answerIndex: 0,
    why: 'Carrying revenue traffic between two foreign countries (**B → C**) on a service originating/terminating in **Home State A** is the **5th Freedom**.',
  },
  {
    id: 'al-cr-3',
    question: 'Which document is **NOT** listed under Chicago Convention **Article 29** as mandatory to carry on board every international flight?',
    options: [
      'Certificate of Airline Insurance Policy',
      'Journey Logbook',
      'Certificate of Airworthiness & Certificate of Registration',
      'Aircraft Radio Station Licence',
    ],
    answerIndex: 0,
    why: 'Art 29 lists **C of R, C of A, Crew Licences, Journey Logbook, Radio Licence, Pax list & Cargo manifest** — insurance certificates come from EU Reg 785/2004, not Art 29.',
  },
  {
    id: 'al-cr-4',
    question: 'Over the **High Seas** (outside any State’s 12 NM territorial waters), which rules apply without exception under **Chicago Article 12**?',
    options: [
      'ICAO Annex 2 (Rules of the Air)',
      'Only the local airline’s Operations Manual',
      'EU 261/2004 passenger compensation exclusively',
      'Chicago Article 7 Cabotage prohibitions',
    ],
    answerIndex: 0,
    why: 'Article 12 dictates that **over the High Seas, Rules of the Air (Annex 2)** in force shall be those established under the Chicago Convention without exception.',
  },
];

/**
 * 3-Column Swimlane Diagram visualising Freedoms 1..9 in 3 seconds:
 * [HOME STATE A] | [FOREIGN STATE B] | [FOREIGN STATE C]
 */
const FreedomSwimlaneDiagram: React.FC<{ freedomId: number }> = ({ freedomId }) => {
  const isTech = freedomId === 1 || freedomId === 2;
  const isCabotage = freedomId === 8 || freedomId === 9;

  // Describe simplified arc segments across x=100 (Home A), x=300 (State B), x=500 (State C)
  const routeText: Record<number, { caption: string; segs: Array<{ x1: number; x2: number; dash?: boolean; stopB?: boolean; blocked?: boolean }> }> = {
    1: { caption: 'Overfly Foreign State B airspace without landing (Technical).', segs: [{ x1: 90, x2: 510, dash: true }] },
    2: { caption: 'Land in Foreign State B strictly for fuel / maintenance — NO traffic uplift (Technical).', segs: [{ x1: 90, x2: 300, dash: true, stopB: true }, { x1: 300, x2: 510, dash: true }] },
    3: { caption: 'Carry commercial traffic FROM Home State A TO Foreign State B.', segs: [{ x1: 90, x2: 300 }] },
    4: { caption: 'Pick up commercial traffic FROM Foreign State B back TO Home State A.', segs: [{ x1: 300, x2: 90 }] },
    5: { caption: 'Home A → State B → State C, uplifting revenue pax/cargo between B and C.', segs: [{ x1: 90, x2: 300, dash: true, stopB: true }, { x1: 300, x2: 510 }] },
    6: { caption: 'Carry traffic between Foreign B and Foreign C via a hub stop in Home State A.', segs: [{ x1: 300, x2: 90 }, { x1: 90, x2: 510 }] },
    7: { caption: 'Operate commercially directly between Foreign B and Foreign C without touching Home A.', segs: [{ x1: 300, x2: 510 }] },
    8: { caption: 'Consecutive Cabotage: Home A → B1 → B2 inside Foreign State B (Art 7 consent required).', segs: [{ x1: 90, x2: 265, dash: true }, { x1: 265, x2: 355, blocked: true }] },
    9: { caption: 'Standalone Cabotage: Foreign carrier operates domestic B1 ↔ B2 inside State B only.', segs: [{ x1: 255, x2: 355, blocked: true }] },
  };

  const cfg = routeText[freedomId] || routeText[1];

  return (
    <div className="border-[1.5px] border-line-strong bg-bg p-4 mb-5">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <span className="hud-label text-sky-400">
          SWIMLANE AIRSPACE MAP · {freedomId <= 2 ? 'TECHNICAL (TRANSIT)' : isCabotage ? 'CABOTAGE (ART 7 PROTECTED)' : 'COMMERCIAL TRAFFIC RIGHT'}
        </span>
        <div className="flex items-center gap-3 text-[10px] font-mono text-muted">
          <span className="flex items-center gap-1"><span className="w-4 border-t-2 border-dashed border-sky-400 inline-block" /> Technical</span>
          <span className="flex items-center gap-1"><span className="w-4 border-t-2 border-emerald-400 inline-block" /> Commercial</span>
          <span className="flex items-center gap-1"><span className="w-4 border-t-2 border-rose-400 inline-block" /> Sovereignty Gate</span>
        </div>
      </div>

      <svg viewBox="0 0 600 135" className="w-full h-32 block">
        {/* 3 Sovereign Columns */}
        <rect x="12" y="10" width="176" height="114" fill="rgba(56,189,248,0.08)" stroke="rgba(56,189,248,0.35)" />
        <text x="100" y="28" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">HOME STATE A</text>

        <rect x="212" y="10" width="176" height="114" fill="rgba(245,158,11,0.08)" stroke={isCabotage ? '#fb7185' : 'rgba(245,158,11,0.35)'} />
        <text x="300" y="28" fill={isCabotage ? '#fb7185' : '#fbbf24'} fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">FOREIGN STATE B</text>

        <rect x="412" y="10" width="176" height="114" fill="rgba(168,85,247,0.08)" stroke="rgba(168,85,247,0.35)" />
        <text x="500" y="28" fill="#c084fc" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">FOREIGN STATE C</text>

        {/* Ground runway dots */}
        <circle cx="90" cy="95" r="5" fill="#38bdf8" />
        <circle cx="265" cy="95" r="4" fill="#fbbf24" />
        <circle cx="345" cy="95" r="4" fill={isCabotage ? '#fb7185' : '#fbbf24'} />
        <circle cx="510" cy="95" r="5" fill="#c084fc" />

        {/* Arcs */}
        {cfg.segs.map((seg, idx) => {
          const midX = (seg.x1 + seg.x2) / 2;
          const arcY = seg.blocked ? 48 : seg.dash ? 40 : 44;
          const stroke = seg.blocked ? '#fb7185' : seg.dash ? '#38bdf8' : '#34d399';
          const yStart = seg.dash && !seg.stopB && seg.x2 === 510 ? 52 : 92;
          const yEnd = seg.dash && !seg.stopB && seg.x2 === 510 ? 52 : 92;
          return (
            <g key={idx}>
              <path
                d={`M ${seg.x1} ${yStart} Q ${midX} ${arcY} ${seg.x2} ${yEnd}`}
                fill="none"
                stroke={stroke}
                strokeWidth="2.8"
                strokeDasharray={seg.dash ? '6 5' : undefined}
              />
              {seg.stopB && (
                <text x="300" y="114" fill="#fbbf24" fontSize="9" textAnchor="middle" fontFamily="monospace">
                  {isTech ? 'FUEL ONLY' : 'TRANSIT STOP'}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      <p className="text-xs font-mono text-muted mt-1">{cfg.caption}</p>
    </div>
  );
};

const InternationalLaw: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'principles' | 'orgs' | 'freedoms' | 'liability' | 'easa' | 'documents' | 'recall'
  >('principles');
  const [freedom, setFreedom] = useState(1);
  const [selectedAnnex, setSelectedAnnex] = useState<number | null>(null);
  const [guessAnnexMode, setGuessAnnexMode] = useState(false);
  const [revealedAnnexes, setRevealedAnnexes] = useState<Record<number, boolean>>({});
  const [showAllObjectives, setShowAllObjectives] = useState(false);

  const tabs = [
    { id: 'principles', label: 'Principles & Annexes', icon: Globe },
    { id: 'freedoms', label: 'Air Freedoms', icon: Plane },
    { id: 'recall', label: 'Case Stamp & Drills', icon: Stamp },
    { id: 'orgs', label: 'Global Orgs', icon: Landmark },
    { id: 'liability', label: 'Liability & Rights', icon: Scale },
    { id: 'easa', label: 'EASA Framework', icon: Building2 },
    { id: 'documents', label: 'On-Board Docs', icon: FileText },
  ] as const;

  const icaoObjectives = [
    'Ensure the safe and orderly growth of international civil aviation throughout the world.',
    'Encourage the arts of aircraft design and operation for peaceful purposes.',
    'Encourage the development of airways, airports, and air navigation facilities.',
    'Meet the needs of the peoples of the world for safe, regular, efficient and economical air transport.',
    'Prevent economic waste caused by unreasonable competition.',
    'Ensure that the rights of contracting States are fully respected.',
    'Avoid discrimination between contracting States.',
    'Promote safety of flight in international air navigation.',
    'Promote generally the development of all aspects of international civil aeronautics.',
  ];

  const iataObjectives = [
    'Promote safe, regular and economical air transport for the benefit of the peoples of the world.',
    'Foster air commerce and study problems connected therewith.',
    'Provide means for collaboration among air transport enterprises.',
    'Cooperate with ICAO and other international organizations.',
  ];

  const icaoAnnexes = [
    { nr: 1, title: 'Personnel Licensing', focus: 'Licences for flight crew, ATC, and maintenance.' },
    { nr: 2, title: 'Rules of the Air', focus: 'General rules, VFR, and IFR (applies without exception over High Seas).' },
    { nr: 3, title: 'Meteorological Service', focus: 'Provision of weather info for international navigation.' },
    { nr: 4, title: 'Aeronautical Charts', focus: 'Standards for maps & charts used in aviation.' },
    { nr: 5, title: 'Units of Measurement', focus: 'SI / non-SI dimensional units for air & ground operations.' },
    { nr: 6, title: 'Operation of Aircraft', focus: 'Commercial, GA, and Helicopter operational safety.' },
    { nr: 7, title: 'Nationality & Reg. Marks', focus: 'Registration, marks placement, and fireproof plate.' },
    { nr: 8, title: 'Airworthiness', focus: 'Certification, C of A, and continuing inspection standards.' },
    { nr: 9, title: 'Facilitation', focus: 'Border crossing, customs, crew member certificates.' },
    { nr: 10, title: 'Aeronautical Telecoms', focus: 'Radio frequency, navaids, and digital datalink.' },
    { nr: 11, title: 'Air Traffic Services', focus: 'ATC, flight information, and alerting services.' },
    { nr: 12, title: 'Search & Rescue', focus: 'SAR regions, phases (INCERFA/ALERFA/DETRESFA).' },
    { nr: 13, title: 'Accident Investigation', focus: 'Objective: prevention, NOT apportioning blame.' },
    { nr: 14, title: 'Aerodromes', focus: 'Physical design, Declared Distances, lighting, RFF.' },
    { nr: 15, title: 'AIS', focus: 'AIP, AIC, NOTAMs, SNOWTAM, and AIRAC 28/56-day cycle.' },
    { nr: 16, title: 'Environmental Protection', focus: 'Aircraft noise chapters and engine emissions.' },
    { nr: 17, title: 'Security', focus: 'Safeguarding civil aviation against unlawful interference.' },
    { nr: 18, title: 'Dangerous Goods', focus: 'Safe transport of hazardous materials by air.' },
    { nr: 19, title: 'Safety Management', focus: 'State Safety Programmes (SSP) & operator SMS.' },
  ];

  const documents = [
    { id: 'cofr', title: 'Cert. of Registration', ref: 'Art 17–21', desc: 'Proves nationality. One State only (Art 18).' },
    { id: 'cofa', title: 'Cert. of Airworthiness', ref: 'Art 31', desc: 'Issued/validated by State of Registry.' },
    { id: 'lic', title: 'Personnel Licences', ref: 'Art 32', desc: 'For every operating flight crew member.' },
    { id: 'radio', title: 'Radio Station Licence', ref: 'Art 30', desc: 'Required for transmitting equipment installed.' },
    { id: 'pax', title: 'Passenger List', ref: 'Art 29', desc: 'Names and places of embarkation/destination.' },
    { id: 'cargo', title: 'Cargo Manifest', ref: 'Art 29', desc: 'Detailed declaration of cargo carried.' },
    { id: 'log', title: 'Journey Logbook', ref: 'Art 34', desc: 'Details of every international flight performed.' },
    { id: 'photog', title: 'Photo Apparatus', ref: 'Art 36', desc: 'States may prohibit or regulate cameras in airspace.' },
    { id: 'restr', title: 'Munitions / Cargo (Art 35)', ref: 'Art 35', desc: 'War munitions require prior State permission.' },
  ];

  const freedoms = FREEDOMS_OF_THE_AIR_DATA;
  const selFreedom = freedoms.find((f) => f.id === freedom) || freedoms[0];

  return (
    <div className="bg-dot-grid min-h-screen pb-16 text-ink">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Top Universal Scaffolds */}
        <InOneMinuteStrip items={ONE_MINUTE_ITEMS} subjectColor="var(--subj-law)" />

        <div className="dx-card p-6 md:p-8" style={{ borderTopWidth: '3px', borderTopColor: 'var(--subj-law)' }}>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <span className="hud-label text-rose-400">EASA ATPL 010.01 // AIR LAW</span>
              <h1 className="font-display text-3xl md:text-4xl font-black text-ink tracking-tight mt-1">
                International Law, Freedoms &amp; Conventions
              </h1>
            </div>
            <ChapterKneeboardDrawer
              chapterCode="010.01"
              chapterTitle="Air Law Treaties & Freedoms Kneeboard"
              formulas={[
                { name: 'Territorial Airspace Span', formula: 'State Airspace = Land Mass + {{12 NM // Territorial Sea}}   (Art 1 & 2)' },
                { name: 'Standard Compliance Rule', formula: 'Standard (SHALL) + Deviation = Immediate Art 38 Notify' },
              ]}
              keyNumbers={[
                { label: 'Chicago Convention Signed', value: '7 Dec 1944 · 19 Annexes', note: 'Headquarters: Montreal' },
                { label: 'ICAO Council / ANC', value: '36 States / 19 Experts', note: 'Assembly meets every 3 years' },
                { label: 'Montreal 1999 Injury Tier', value: '128,821 SDR Strict', note: 'Cargo: 22 SDR/kg · Bag: 1,288 SDR' },
                { label: 'EU 261/2004 Compensation', value: '€250 / €400 / €600', note: '<1500 / 1500–3500 / >3500 km' },
              ]}
              memoryHooks={[
                '**1–2 Technical** (overfly/fuel) · **3–5 Commercial** (to/from/beyond) · **8–9 Cabotage**.',
                '**Tokyo 63** = PIC handcuffs & immunity · **Hague 70** = Hijack · **Montreal 71** = Sabotage · **Montreal 99** = Liability Money.',
              ]}
            />
          </div>

          <LessonHeaderDeck
            id="al-main-header"
            questionTitle="Who owns the sky, who pays when things break, and what can a foreign airline carry?"
            examRule="Chicago Convention (1944) governs **sovereignty, Annexes 1–19, and Cabotage (Art 7)**; **Montreal 1999** sets airline liability; **Tokyo/Hague/Montreal ’71** prosecute unlawful acts."
            memoryHook="**1–2 Technical** (fly/fuel) · **3–5 Commercial** (out/back/beyond) · **6–9 Hub & Cabotage**."
            askedInEasa
            subjectColor="var(--subj-law)"
          />

          {/* Tactile Tab Bar */}
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-line">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs font-mono font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
                    active
                      ? 'border-rose-400 bg-rose-500/20 text-ink'
                      : 'border-line bg-bg text-muted hover:text-ink hover:border-line-strong'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-rose-400" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* PRINCIPLES & GUESS-FIRST ANNEXES */}
        {activeTab === 'principles' && (
          <div className="space-y-6">
            <div className="dx-card p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-line bg-bg p-5 space-y-3">
                  <h3 className="font-bold text-ink flex items-center gap-2">
                    <Shield className="text-sky-400 w-5 h-5" /> Sovereignty &amp; High Seas (Art 1 &amp; 12)
                  </h3>
                  <p className="text-xs text-muted leading-relaxed">
                    <strong className="text-ink">Article 1:</strong> Every State has <strong className="text-ink">complete and exclusive sovereignty</strong> over airspace above land and <strong className="text-ink">12 NM</strong> territorial waters.
                  </p>
                  <p className="text-xs text-muted leading-relaxed">
                    <strong className="text-ink">Article 12:</strong> Over the High Seas, ICAO <strong className="text-ink">Annex 2 (Rules of the Air)</strong> applies without exception.
                  </p>
                </div>

                <div className="border border-line bg-bg p-5 space-y-3">
                  <h3 className="font-bold text-ink flex items-center gap-2">
                    <Layers className="text-amber-400 w-5 h-5" /> Registration, Art 5/6 &amp; Art 38
                  </h3>
                  <p className="text-xs text-muted leading-relaxed">
                    Aircraft carry the nationality of one State (<strong className="text-ink">Art 17 &amp; 18</strong>). Scheduled services require special permission (<strong className="text-ink">Art 6</strong>), whereas non-scheduled flights enjoy Art 5 overflight subject to State regulations.
                  </p>
                  <p className="text-xs text-amber-300 leading-relaxed">
                    <strong>Art 38:</strong> States unable to comply with an ICAO Standard MUST notify ICAO immediately.
                  </p>
                </div>
              </div>

              {/* 19 ICAO Annexes with GUESS-FIRST Active Recall Toggle */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="font-display text-xl font-bold text-ink flex items-center gap-2">
                      <BookOpen className="text-emerald-400 w-5 h-5" /> ICAO Annexes 1–19 (SARPs)
                    </h3>
                    <p className="text-xs text-muted">
                      {guessAnnexMode
                        ? 'Guess-First Mode ACTIVE: name the Annex mentally, then click a tile to reveal & test yourself!'
                        : 'Click any Annex tile to inspect its exam focus.'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setGuessAnnexMode((m) => !m);
                        setRevealedAnnexes({});
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold uppercase border cursor-pointer ${
                        guessAnnexMode
                          ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                          : 'border-line bg-bg text-muted hover:text-ink'
                      }`}
                    >
                      {guessAnnexMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      {guessAnnexMode ? 'Exit Guess-First' : 'Guess-First Mode'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                  {icaoAnnexes.map((annex) => {
                    const isSelected = selectedAnnex === annex.nr;
                    const isRevealed = !guessAnnexMode || !!revealedAnnexes[annex.nr];
                    return (
                      <button
                        key={annex.nr}
                        type="button"
                        onClick={() => {
                          if (guessAnnexMode) {
                            setRevealedAnnexes((prev) => ({ ...prev, [annex.nr]: !prev[annex.nr] }));
                          }
                          setSelectedAnnex(isSelected ? null : annex.nr);
                        }}
                        className={`p-3 border text-left transition-all relative cursor-pointer ${
                          isSelected
                            ? 'border-emerald-400 bg-emerald-500/15'
                            : 'border-line bg-bg hover:border-line-strong'
                        }`}
                      >
                        <span className="font-mono text-[10px] font-bold text-emerald-400 block">
                          ANNEX {annex.nr}
                        </span>
                        <span className="text-xs font-bold text-ink block leading-snug mt-0.5">
                          {isRevealed ? annex.title : 'Tap to reveal title…'}
                        </span>
                        {isRevealed && isSelected && (
                          <p className="text-[11px] text-muted mt-2 pt-1.5 border-t border-line leading-snug">
                            {annex.focus}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AIR FREEDOMS + SWIMLANE VISUALIZER */}
        {activeTab === 'freedoms' && (
          <div className="dx-card p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl font-bold text-ink flex items-center gap-2">
                  <Plane className="text-sky-400" /> Freedoms of the Air &amp; Cabotage (Art 7)
                </h2>
                <p className="text-xs text-muted mt-1">
                  Select any Freedom on the left to watch how its route maps cleanly across sovereign airspace columns.
                </p>
              </div>
              <span className="font-mono text-xs px-2.5 py-1 border border-sky-400/50 bg-sky-500/10 text-sky-300">
                Chicago Art 5, 6 &amp; 7
              </span>
            </div>

            <FreedomSwimlaneDiagram freedomId={freedom} />

            <div className="flex flex-col lg:flex-row gap-6">
              <div className="w-full lg:w-1/3 space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {freedoms.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFreedom(f.id)}
                    className={`w-full p-3 border text-left flex items-center justify-between transition-colors cursor-pointer ${
                      freedom === f.id
                        ? 'border-sky-400 bg-sky-500/15 text-ink'
                        : 'border-line bg-bg text-muted hover:text-ink hover:border-line-strong'
                    }`}
                  >
                    <div>
                      <span className="font-mono text-[10px] font-bold uppercase text-sky-400">
                        {f.type} · {f.title}
                      </span>
                      <div className="text-xs font-bold text-ink mt-0.5">{f.name}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </button>
                ))}
              </div>

              <div className="flex-1 border border-line-strong bg-bg p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-line">
                  <span className="font-mono text-xs font-bold uppercase text-sky-400">
                    {selFreedom.title} · {selFreedom.type}
                  </span>
                  <span className="font-mono text-[11px] px-2.5 py-0.5 border border-line bg-bg-sunken text-ink">
                    {selFreedom.trafficRights}
                  </span>
                </div>
                <h3 className="font-display text-2xl font-bold text-ink">{selFreedom.name}</h3>
                <p className="text-sm text-muted leading-relaxed">{selFreedom.desc}</p>

                <div className="border border-line bg-bg-raised p-4">
                  <div className="hud-label text-muted mb-1">REAL AIRLINE ROUTE EXAMPLE</div>
                  <p className="text-xs font-mono text-sky-300 leading-relaxed">{selFreedom.example}</p>
                </div>

                <div className="border border-rose-500/40 bg-rose-500/10 p-4">
                  <div className="hud-label text-rose-400 mb-1">EASA RTFQ TRAP DEFENSE</div>
                  <p className="text-xs text-rose-100 leading-relaxed">{selFreedom.rtfqTrap}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ACTIVE RECALL LAB: CASE STAMP SIMULATOR + HOLD SHORT GATES */}
        {activeTab === 'recall' && (
          <div className="space-y-6">
            <CaseFileStampSimulator stamps={STAMP_OPTIONS} cases={CASE_FILES} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <HoldShortGate
                gate={{
                  id: 'gate-art29-docs',
                  kind: 'redpen',
                  askedInEasa: true,
                  ask: 'Ramp inspection check under **Chicago Article 29**: one document listed is NOT required by Art 29 (or violates Art 18). **Tap the wrong line**:',
                  rows: [
                    { label: 'Art 29(a)', value: 'Certificate of Registration (1 State only)', note: 'Mandatory ship paper.' },
                    { label: 'Art 29(b)', value: 'Certificate of Airworthiness (State of Registry)', note: 'Mandatory ship paper.' },
                    {
                      label: 'Art 18 Registration',
                      value: 'Dual State registration (G-ABCD & F-WXYZ simultaneously)',
                      fix: 'PROHIBITED — Single State of Registry only',
                    },
                    { label: 'Art 29(c)/(e)', value: 'Appropriate Crew Licences & Radio Station Licence', note: 'Mandatory ship paper.' },
                  ],
                  yes: 'Correct — dual registration is strictly forbidden under Article 18!',
                  why: 'An aircraft cannot be validly registered in more than one State (**Art 18**), though registration may be transferred between States.',
                }}
              />

              <HoldShortGate
                gate={{
                  id: 'gate-icao-order',
                  kind: 'tiles',
                  askedInEasa: true,
                  ask: 'Build the correct **Annex 7 Registration Mark** sequence (Nationality Mark, Hyphen when letters follow letters, Registration Mark) for a German jet registered **ABCE**:',
                  answerTiles: ['D', '-', 'A', 'B', 'C', 'E'],
                  extraTiles: ['_', 'N'],
                  yes: 'Accepted — D-ABCE follows ICAO Annex 7 formatting.',
                  why: 'Per Annex 7, when letters follow a letter nationality mark (`D`), a **hyphen (`-`)** separates Nationality from Registration (`D-ABCE`). No hyphen is used only if numbers follow letters.',
                }}
              />
            </div>
          </div>
        )}

        {/* GLOBAL ORGS */}
        {activeTab === 'orgs' && (
          <div className="dx-card p-6 grid md:grid-cols-2 gap-6">
            <div className="border border-line bg-bg p-5 space-y-4">
              <div className="flex items-center gap-3">
                <Landmark className="text-indigo-400 w-6 h-6" />
                <div>
                  <h3 className="font-bold text-ink">ICAO (UN Specialized Agency)</h3>
                  <p className="text-[11px] font-mono text-indigo-400">Assembly (3 yrs) · Council (36 States) · ANC (19 Experts)</p>
                </div>
              </div>
              <ul className="space-y-2">
                {(showAllObjectives ? icaoObjectives : icaoObjectives.slice(0, 5)).map((obj, i) => (
                  <li key={i} className="flex gap-2 text-xs text-muted">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => setShowAllObjectives(!showAllObjectives)}
                className="text-xs font-mono font-bold text-indigo-400 cursor-pointer"
              >
                {showAllObjectives ? 'Show fewer' : `+ Show all ${icaoObjectives.length} Art 44 objectives`}
              </button>
            </div>

            <div className="border border-line bg-bg p-5 space-y-4">
              <div className="flex items-center gap-3">
                <Building2 className="text-sky-400 w-6 h-6" />
                <div>
                  <h3 className="font-bold text-ink">IATA (Airlines Trade Body)</h3>
                  <p className="text-[11px] font-mono text-sky-400">Commercial &amp; Safety Audit Standardization</p>
                </div>
              </div>
              <ul className="space-y-2">
                {iataObjectives.map((obj, i) => (
                  <li key={i} className="flex gap-2 text-xs text-muted">
                    <Info className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* LIABILITY */}
        {activeTab === 'liability' && (
          <div className="space-y-6">
            <div className="dx-card p-6 grid md:grid-cols-2 gap-6">
              <div className="border border-line bg-bg p-5 space-y-3">
                <h3 className="font-bold text-ink flex items-center gap-2">
                  <Scale className="text-indigo-400 w-5 h-5" /> Montreal Convention (1999)
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  <strong className="text-ink">Death / Injury:</strong> Strict liability up to **128,821 SDR**; unlimited above unless carrier proves non-negligence.
                </p>
                <p className="text-xs text-muted leading-relaxed">
                  <strong className="text-ink">Baggage:</strong> ~1,288 SDR/pax · <strong className="text-ink">Cargo:</strong> 22 SDR/kg. Missing ticket does NOT void the contract.
                </p>
              </div>

              <div className="border border-line bg-bg p-5 space-y-3">
                <h3 className="font-bold text-ink flex items-center gap-2">
                  <User className="text-amber-400 w-5 h-5" /> Passenger Rights (EU 261/2004)
                </h3>
                <div className="grid grid-cols-3 gap-2 font-mono text-xs text-center">
                  <div className="border border-line p-2 bg-bg-sunken">
                    <div className="text-muted">≤ 1,500 km (2h)</div>
                    <div className="text-emerald-400 font-bold text-base">€250</div>
                  </div>
                  <div className="border border-line p-2 bg-bg-sunken">
                    <div className="text-muted">1500–3500 km (3h)</div>
                    <div className="text-emerald-400 font-bold text-base">€400</div>
                  </div>
                  <div className="border border-line p-2 bg-bg-sunken">
                    <div className="text-muted">&gt; 3,500 km (4h)</div>
                    <div className="text-emerald-400 font-bold text-base">€600</div>
                  </div>
                </div>
              </div>
            </div>

            <CaseFileStampSimulator stamps={STAMP_OPTIONS} cases={CASE_FILES} />
          </div>
        )}

        {/* EASA FRAMEWORK */}
        {activeTab === 'easa' && (
          <div className="dx-card p-6 grid md:grid-cols-2 gap-6">
            <div className="border border-line bg-bg p-5 space-y-3">
              <span className="hud-label text-indigo-400">HARD LAW (BINDING)</span>
              <h3 className="font-bold text-ink">Basic Reg (2018/1139) &amp; Implementing Rules</h3>
              <p className="text-xs text-muted leading-relaxed">
                EU Parliament/Council Basic Regulation establishes EASA; European Commission adopts mandatory Parts (**Part-FCL**, **Part-MED**, **Part-OPS**, **SERA**).
              </p>
            </div>
            <div className="border border-line bg-bg p-5 space-y-3">
              <span className="hud-label text-emerald-400">SOFT LAW (EASA EXECUTIVE)</span>
              <h3 className="font-bold text-ink">Certification Specs (CS), AMC &amp; GM</h3>
              <p className="text-xs text-muted leading-relaxed">
                **CS-23/25** define airworthiness standards; **AMC** illustrates compliant methods (AltMoC permitted with NAA approval).
              </p>
            </div>
          </div>
        )}

        {/* ON-BOARD DOCS */}
        {activeTab === 'documents' && (
          <div className="dx-card p-6 space-y-4">
            <h3 className="font-bold text-ink flex items-center gap-2">
              <FileText className="text-emerald-400" /> Mandatory On-Board Documents (Chicago Art 29–36)
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {documents.map((doc) => (
                <div key={doc.id} className="border border-line bg-bg p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-ink">{doc.title}</span>
                    <span className="font-mono text-[10px] text-emerald-400">{doc.ref}</span>
                  </div>
                  <p className="text-xs text-muted">{doc.desc}</p>
                </div>
              ))}
            </div>
            <div className="border border-amber-500/40 bg-amber-500/10 p-4 flex items-center gap-3 text-xs text-amber-100">
              <AlertCircle className="text-amber-400 w-5 h-5 shrink-0" />
              <span>
                <strong>Art 33 Recognition:</strong> Contracting States MUST recognize foreign C of A &amp; crew licences provided issuing standards equal or exceed ICAO minimums.
              </span>
            </div>
          </div>
        )}

        {/* Universal Confusion Buster + Checkride + ACARS Debrief */}
        <ConfusionBusterGrid pairs={CONFUSION_PAIRS} />
        <CheckrideDeck calls={CHECKRIDE_CALLS} subjectLabel="AIR LAW 010.01" />
        <ACARSDebriefSlip
          chapterLabel="010.01 // INT LAW"
          headline="AIR LAW & TREATY DISPATCH SUMMARY — **CLEARED**"
          rows={[
            { label: 'Sovereignty & High Seas', value: 'Art 1 (12 NM) · Art 12 Annex 2' },
            { label: 'Art 38 Differences', value: 'Standards ("Shall") notify immediately' },
            { label: 'Cabotage (Art 7)', value: 'State may refuse 8th/9th domestic traffic' },
            { label: 'Liability vs Crime', value: 'Montreal ’99 (SDR) · Tokyo/Hague/Montreal ’71' },
          ]}
        />
      </div>
    </div>
  );
};

export default InternationalLaw;
