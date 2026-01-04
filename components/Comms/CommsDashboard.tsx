
import React from 'react';
import { View } from '../../types';
import { 
    Radio, MessageSquare, AlertCircle, Cloud, 
    Navigation, Activity, Phone, Wifi, Book, 
    Mic, Play, ShieldAlert, Crosshair, Calculator,
    Brain, Clock, Database, Zap, Lock, Grid,
    ListOrdered, FileText, CheckSquare, Sun, Thermometer, Map, Plane
} from 'lucide-react';

interface Props {
    onChangeView: (view: View) => void;
}

const CommsDashboard: React.FC<Props> = ({ onChangeView }) => {
    
    const SectionTitle = ({ icon: Icon, title, color }: any) => (
        <div className="col-span-full mt-12 mb-6 flex items-center gap-3 border-b border-slate-700 pb-4">
            <div className={`p-3 rounded-xl bg-${color}-500/20 text-${color}-400 ring-1 ring-${color}-500/50`}>
                <Icon size={24} />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-white">{title}</h2>
                <div className={`h-1 w-20 bg-${color}-500 mt-1 rounded-full`}></div>
            </div>
        </div>
    );

    const Card = ({ view, title, desc, icon: Icon, color, tag }: any) => (
        <div 
            onClick={() => onChangeView(view)} 
            className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-slate-500 cursor-pointer group transition-all hover:shadow-xl hover:shadow-slate-900/50 relative overflow-hidden flex flex-col h-full"
        >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}-500/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-500`}></div>
            
            <div className="flex justify-between items-start mb-5 relative z-10">
                <div className={`p-3.5 rounded-xl bg-${color}-500/10 text-${color}-400 group-hover:bg-${color}-500/20 transition-colors ring-1 ring-${color}-500/20`}>
                    <Icon size={28} />
                </div>
                {tag && (
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full bg-${color}-500/20 text-${color}-300 uppercase tracking-wider border border-${color}-500/30`}>
                        {tag}
                    </span>
                )}
            </div>
            
            <h3 className="font-bold text-white text-lg mb-2 relative z-10 group-hover:text-blue-400 transition-colors">{title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed relative z-10 flex-grow">{desc}</p>
            
            <div className={`mt-4 flex items-center text-${color}-400 text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300`}>
                Launch Module →
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto pb-20">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 md:p-16 text-white shadow-2xl mb-12 border border-slate-700 relative overflow-hidden">
                <div className="relative z-20 max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold rounded-full mb-6 backdrop-blur-sm">
                        <Radio size={12} /> EASA SUBJECT 090
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
                        VFR & IFR<br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Communications</span>
                    </h1>
                    <p className="text-blue-100 text-lg md:text-xl leading-relaxed max-w-2xl opacity-90">
                        Master the language of aviation. From propagation physics to complex distress scenarios, 
                        use our comprehensive suite of simulators and AI tools to perfect your radiotelephony.
                    </p>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
                    <Mic size={400} className="transform translate-x-1/4 translate-y-1/4 rotate-12" />
                </div>
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* --- 090.01 & 090.06: CONCEPTS & PROPAGATION --- */}
                <SectionTitle icon={Book} title="Definitions & Theory" color="indigo" />
                
                <Card 
                    view={View.GENERAL_THEORY} 
                    title="General Theory" 
                    desc="Transmission methods (Simplex/Duplex), standard abbreviations, and station categories."
                    icon={Book} color="indigo"
                />
                <Card 
                    view={View.PROPAGATION_THEORY} 
                    title="VHF Propagation" 
                    desc="Line of sight, atmospheric ducting, attenuation, and range limitations."
                    icon={Wifi} color="indigo"
                />
                <Card 
                    view={View.TECH_PHYSICS} 
                    title="Tech & Physics" 
                    desc="Frequency spacing (8.33kHz), refraction, and signal quality factors."
                    icon={Activity} color="indigo"
                />
                 <Card 
                    view={View.FREQ_EXPLORER} 
                    title="Band Explorer" 
                    desc="Visualise VLF, LF, MF, HF, VHF, UHF spectrums and their uses."
                    icon={Activity} color="indigo"
                />
                <Card 
                    view={View.SUFFIX_MATCH} 
                    title="Station Suffixes" 
                    desc="Learn the callsigns: CONTROL, INFORMATION, DELIVERY, RADIO, etc."
                    icon={Radio} color="indigo" tag="DRILL"
                />
                 <Card 
                    view={View.QCODE_CARDS} 
                    title="Q-Code Mastery" 
                    desc="Interactive flashcards for QNH, QFE, QDM, QDR, QUJ, and QTE."
                    icon={ListOrdered} color="indigo" tag="DRILL"
                />
                 <Card 
                    view={View.Q_COMPASS} 
                    title="Direction Finding" 
                    desc="Visualise QDM/QDR/QUJ/QTE bearings relative to the station."
                    icon={Navigation} color="indigo" tag="TOOL"
                />
                <Card 
                    view={View.WORD_MATCH} 
                    title="Standard Words" 
                    desc="Memory game for standard words: WILCO, ROGER, ACKNOWLEDGE."
                    icon={CheckSquare} color="indigo" tag="GAME"
                />


                {/* --- 090.02: GENERAL OPERATING PROCEDURES --- */}
                <SectionTitle icon={Mic} title="Operating Procedures" color="blue" />

                <Card 
                    view={View.PHONETIC} 
                    title="Phonetic Trainer" 
                    desc="Speed run the NATO phonetic alphabet from Alpha to Zulu."
                    icon={Mic} color="blue" tag="DRILL"
                />
                <Card 
                    view={View.ALT_SPEAK} 
                    title="Number Transmission" 
                    desc="Practice transmitting Altitude, FL, Heading and Frequency numbers."
                    icon={ListOrdered} color="blue" tag="DRILL"
                />
                <Card 
                    view={View.TIME_REPORT} 
                    title="Time Transmission" 
                    desc="Rules for reporting time (minutes only vs hours & minutes)."
                    icon={Clock} color="blue" tag="DRILL"
                />
                <Card 
                    view={View.READABILITY_SIM} 
                    title="Readability Scale" 
                    desc="Simulate Radio Checks 1 to 5. 'Reading you five'."
                    icon={Activity} color="blue" tag="SIM"
                />
                <Card 
                    view={View.FLIGHT_RULES} 
                    title="Standard Protocols" 
                    desc="Readback requirements, Conditional Clearances, and Call Sign rules."
                    icon={FileText} color="blue" tag="STUDY"
                />
                <Card 
                    view={View.PRIORITY} 
                    title="Message Priority" 
                    desc="Sort messages by priority: Distress, Urgency, DF, Safety, Met, Flight Safety."
                    icon={ListOrdered} color="blue" tag="GAME"
                />
                <Card 
                    view={View.READBACK} 
                    title="Readback Challenge" 
                    desc="Fill-in-the-blanks for mandatory readback items in clearances."
                    icon={Phone} color="blue" tag="GAME"
                />


                {/* --- 090.03 & 090.07: WEATHER & INFO --- */}
                <SectionTitle icon={Cloud} title="Weather & Information" color="sky" />

                <Card 
                    view={View.METAR} 
                    title="METAR Decoder" 
                    desc="Break down raw METAR/TAF strings into plain English."
                    icon={Cloud} color="sky" tag="TOOL"
                />
                <Card 
                    view={View.VOLMET_SIM} 
                    title="VOLMET & ATIS" 
                    desc="Simulator for D-ATIS, Voice ATIS and VOLMET broadcasts."
                    icon={Radio} color="sky" tag="AUDIO"
                />
                 <Card 
                    view={View.AIREP_SPEC} 
                    title="AIREP Special" 
                    desc="Reporting special weather phenomena (Turbulence, Icing, Ash)."
                    icon={Thermometer} color="sky" tag="TOOL"
                />
                <Card 
                    view={View.RADIO_NAV_DATA} 
                    title="Data Link (ACARS)" 
                    desc="ACARS OOOI phases and CPDLC message types."
                    icon={Database} color="sky"
                />
                <Card 
                    view={View.TIME_ZONER} 
                    title="Time Zoner" 
                    desc="Understand UTC (Zulu) vs Local time offsets."
                    icon={Clock} color="sky"
                />


                {/* --- 090.04 & 090.05: EMERGENCY & FAILURE --- */}
                <SectionTitle icon={ShieldAlert} title="Emergency & Failure" color="red" />

                <Card 
                    view={View.EMERGENCY} 
                    title="Distress Builder" 
                    desc="Construct the perfect MAYDAY call sequence."
                    icon={AlertCircle} color="red" tag="TOOL"
                />
                 <Card 
                    view={View.EMERGENCY_OPS} 
                    title="Emergency Ops" 
                    desc="Procedures for Fuel Dumping, TCAS RA, and Wind Shear."
                    icon={ShieldAlert} color="red"
                />
                <Card 
                    view={View.COMM_FAIL} 
                    title="Comms Failure" 
                    desc="Interactive wizard for VFR/IFR Radio Failure procedures."
                    icon={Zap} color="red" tag="WIZARD"
                />
                <Card 
                    view={View.BLIND_TX} 
                    title="Blind Transmission" 
                    desc="Procedure for transmitting when receiver failure is suspected."
                    icon={Mic} color="red"
                />
                <Card 
                    view={View.TRANSPONDER} 
                    title="Transponder Dojo" 
                    desc="Master Squawk codes (7500, 7600, 7700) and modes."
                    icon={Grid} color="red" tag="GAME"
                />


                {/* --- SIMULATORS & AI --- */}
                <SectionTitle icon={Brain} title="Advanced Simulation" color="purple" />

                <Card 
                    view={View.VFR_COMMS_SIM} 
                    title="VFR Flight Sim" 
                    desc="Full VFR flight profile script: Startup, Taxi, Takeoff, Arrival."
                    icon={Plane} color="purple" tag="SIM"
                />
                <Card 
                    view={View.PHRASEOLOGY_EXPLORER} 
                    title="IFR Phraseology" 
                    desc="Standard calls for Pushback, Departure, En-route, and Approach."
                    icon={MessageSquare} color="purple" tag="SIM"
                />
                <Card 
                    view={View.POS_REPORT} 
                    title="Position Reports" 
                    desc="Build standard non-radar position reports."
                    icon={Map} color="purple" tag="TOOL"
                />
                <Card 
                    view={View.TRAFFIC_CLOCK} 
                    title="Traffic Information" 
                    desc="Visualise 'Traffic 2 o'clock, 5 miles' calls."
                    icon={Navigation} color="purple" tag="TOOL"
                />
                <Card 
                    view={View.AI_ROLEPLAY} 
                    title="ATC Roleplay" 
                    desc="Voice/Text chat with an AI Air Traffic Controller."
                    icon={Mic} color="purple" tag="AI"
                />
                <Card 
                    view={View.AI_QUIZ} 
                    title="Infinite Examiner" 
                    desc="Generate unlimited exam questions on any topic."
                    icon={Brain} color="purple" tag="AI"
                />
                <Card 
                    view={View.LIGHT_GUN} 
                    title="Light Gun Hero" 
                    desc="Test your reaction time decoding tower light signals."
                    icon={Play} color="purple" tag="GAME"
                />
                <Card 
                    view={View.MORSE} 
                    title="Morse Master" 
                    desc="Learn and test your ability to identify VOR/NDB idents."
                    icon={Activity} color="purple" tag="GAME"
                />

            </div>
        </div>
    );
};

export default CommsDashboard;
